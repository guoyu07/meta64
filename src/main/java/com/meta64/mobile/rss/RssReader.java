package com.meta64.mobile.rss;

import java.net.URL;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.rss.model.RssEntryWrapper;
import com.meta64.mobile.rss.model.RssFeedWrapper;
import com.meta64.mobile.service.RssService;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

/* WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I started, and anything related to RSS
 * is untested code and the commented code you see comes from the older version of the software and is in the process of being converted.
 * Bottom line, don't try to use any RSS code or features yet.
 */

@Component
@Scope("prototype")
public class RssReader {

	private static final Logger log = LoggerFactory.getLogger(RssReader.class);

	public static final int MAX_RSS_ENTRIES = 10;
	
	@Autowired
	private RssService rssService;

	private List<String> feedUrlList;
	private List<RssFeedWrapper> feedList = new LinkedList<RssFeedWrapper>();
	private RssDbReader dbReader = new RssDbReader();
	private final StringBuilder output = new StringBuilder();

	//private HashSet<String> existingTitles = new HashSet<String>();

	private int feedsProcessed = 0;
	private int newEntries = 0;
	private int oldEntries = 0;
	private int newFeeds = 0;
	private int oldFeeds = 0;
	private int errorFeeds = 0;
	
	@Autowired
	private RssDbWriter dbWriter;

	public RssReader() {
	}

	public void run(Session session) throws Exception {
		/*
		 * first read out everything that's in the database already (that is, what entries and feeds
		 * already exist so that we can avoid adding them twice
		 */
		// 2016
		// dbReader.read(parentId);

		/* and next read the actual feed RSS from the internet */
		// readFeedsFromNet();
		// 2016 let's just read one feed for now:
		readFeed("http://theadamcarollashow.libsyn.com/rss");

		/* write the feeds & entries to the db */
		writeFeeds(session);

		output.append("Processed " + String.valueOf(feedsProcessed) + " RSS feeds.<p>");

		output.append(String.valueOf(newFeeds) + " new feeds.<br>");
		output.append(String.valueOf(newEntries) + " new entries.<p>");

		output.append(String.valueOf(oldFeeds) + " existing feeds.<p>");
		output.append(String.valueOf(oldEntries) + " ignored/duplicate entries.<br>");

		output.append(errorFeeds + " feeds failed.<br>");
		output.append("<b>Total Entries: " + String.valueOf(newEntries + oldEntries) + "</b>");
	}

	private void writeFeeds(Session session) throws Exception {
		log.debug("Processing " + feedList.size() + " feeds.");

		for (RssFeedWrapper wFeed : feedList) {

			try {
				writeFeedToDb(session, wFeed);
			}
			catch (Exception e) {
				log.error("Failed to process feed: " + wFeed.getFeed().getTitle(), e);
				errorFeeds++;
			}
		}
	}

	// private void readFeedsFromNet() throws Exception {
	// int counter = 0;
	// for (String feed : feedUrlList) {
	// jpaUtil.commitAndRestart(Constants.ONE_SECOND_SLEEP);
	// // if (ServiceCore.isShuttingDown()) {
	// // break;
	// // }
	//
	// try {
	// if (!feed.startsWith("#")) {
	// readFeed(feed);
	// } else {
	// if (Constants.debug_rss) {
	// ALog.log("ignoring comment line: " + feed);
	// }
	// }
	// // db().ping();
	// } catch (Exception e) {
	// //e.printStackTrace();
	//
	// /* message to user */
	// addMessage("Failed to process feed: " + feed + " Error: " + e.getMessage());
	// }
	// counter++;
	// if (counter >= Constants.MAX_RSS_FEEDS) {
	// break;
	// }
	// }
	// }

	private void readFeed(String feedUrl) throws Exception {
		feedsProcessed++;
		log.debug("processing RSS url: " + feedUrl);

		URL url = new URL(feedUrl);
		XmlReader reader = null;

		try {
			reader = new XmlReader(url);
			SyndFeed feed = new SyndFeedInput().build(reader);
			RssFeedWrapper wFeed = new RssFeedWrapper(feed, feedUrl);
			feedList.add(wFeed);
			int entryCounter = 0;

			for (Object e : feed.getEntries()) {
				SyndEntry entry = (SyndEntry) e;

				log.debug("RSS Entry in Feed: " + entry.getLink());
				wFeed.getEntryList().add(new RssEntryWrapper(entry));

				if (++entryCounter >= MAX_RSS_ENTRIES) break;
			}
		}
		catch (Exception e) {
			log.error("*** ERROR reading feed: " + feedUrl, e);
			throw e;
		}
		finally {
			if (reader != null) {
				reader.close();
			}
		}
	}

	/* Writes all the entries in the specific RssFeedWrapper to the db */
	private void writeFeedToDb(Session session, RssFeedWrapper wFeed) throws Exception {
		SyndFeed feed = wFeed.getFeed();

		log.debug("writing feed: " + feed.getTitle());

		/*
		 * try to get feed node from repository (by looking up feed uri), and if not existing we create it
		 */
		//Integer feedUriId = -1; //2016 dbReader.getExistingFeedUriId(feed);
		//int feedId = -1;
		Node feedNode = rssService.getFeedNodeByUri(feed.getUri());

		/*
		 * if feed URI is not found, that means this feed is not in db, so we add a new feed and
		 * assign the feedId from that.
		 */
		if (feedNode == null) {
			log.debug("Feed not found, must be new feed.");
			feedNode = dbWriter.write(session, feed);
			newFeeds++;
		}
		/*
		 * otherwise our feed does exist and we know the db id of the URI node UNDERNEATH it, so we
		 * have to grab the feed node buy looking UP the tree towards the parent which will be the
		 * feed node
		 */
		else {
			log.debug("Is existing feed, in db already.");

			//2016
//			NodeEntity parent = Factory.nodeService().findByChild(feedUriId);
//			/* allow exception to be thrown if parent==null */
//			feedId = parent.getParentId();
			oldFeeds++;
		}

		int idx = -1;
		/*
		 * now we have the Feed node in place so we can write all RSS entries to the db
		 */
		for (RssEntryWrapper wEntry : wFeed.getEntryList()) {
			idx++;
			log.debug("RSS Entry: index=" + idx);
			SyndEntry entry = (SyndEntry) wEntry.getEntry();

			/*
			 * if we already have an RSS element that has the same title then consider this a
			 * duplicate and bypass it.
			 * 
			 * What was this for? Entries that are duplicates still need to be read ithink
			 */
//			if (entry.getTitle() != null) {
//				if (existingTitles.contains(entry.getTitle().trim())) {
//					log.debug("avoided duplicate RSS link: " + entry.getTitle());
//					continue;
//				}
//				/*
//				 * otherwise we do need to update the existingTitles map to add this title
//				 */
//				else {
//					log.debug("Accepting Title (not dupliate yet)." + entry.getTitle());
//					existingTitles.add(entry.getTitle().trim());
//				}
//			}
//			else {
//				log.debug("RSS Entry with no title!");
//			}

			try {
				//2016
//				/* if this entry doesn't already exist in our DB */
//				if (!dbReader.entryExistsInDb(entry)) {
//					newEntries++;
//
//					log.debug("writing new entry." + entry.getTitle());					
//
//					/* write the entry into db */
					dbWriter.write(session, feedNode, entry);
//				}
//				else {
//					oldEntries++;
//					log.debug("skipping entry that is already in db: " + entry.getTitle());
//				}
			}
			catch (Exception e) {
				log.error("Failed writing feed.", e);
			}
		}
	}
}
