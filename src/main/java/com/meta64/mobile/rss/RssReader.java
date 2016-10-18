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
	private List<RssFeedWrapper> feedList = new LinkedList<RssFeedWrapper>();
	
	@Autowired
	private RssService rssService;

	@Autowired
	private RssDbWriter dbWriter;

	public RssReader() {
	}

	public void run(Session session) throws Exception {
		/* and next read the actual feed RSS from the internet */
		// readFeedsFromNet();
		// 2016 let's just read one feed for now:
		readFeed("http://theadamcarollashow.libsyn.com/rss");
		readFeed("http://www.dailywire.com/rss.xml");
		readFeed("http://feeds.twit.tv/twit.xml");

		/* write the feeds & entries to the db */
		writeFeeds(session);
	}

	private void writeFeeds(Session session) throws Exception {
		log.debug("Processing " + feedList.size() + " feeds.");

		for (RssFeedWrapper wFeed : feedList) {

			try {
				writeFeedToDb(session, wFeed);
			}
			catch (Exception e) {
				log.error("Failed to process feed: " + wFeed.getFeed().getTitle(), e);
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
		 * look up this feedNode by uri, because it may already exist. It WILL exist unless this is
		 * the first time we are ever reading this feed
		 */
		Node feedNode = rssService.getFeedNodeByUri(feed.getUri());
		
		/* if not found by uri, try looking up by link */
		if (feedNode==null) {
			feedNode = rssService.getFeedNodeByLink(feed.getLink());
		}

		/*
		 * if feed URI is not found, that means this feed is not in db, so we add a new feed and
		 * assign the feedId from that.
		 */
		if (feedNode == null) {
			log.debug("Feed not found, must be new feed.");
			feedNode = dbWriter.write(session, feed);
		}

		/*
		 * now we have the Feed node in place so we can write all RSS entries to the db
		 */
		for (RssEntryWrapper wEntry : wFeed.getEntryList()) {
			SyndEntry entry = (SyndEntry) wEntry.getEntry();

			try {
				/* if this entry doesn't already exist in our DB */
				if (rssService.getEntryByLink(entry.getLink())==null) {
					log.debug("writing new entry." + entry.getTitle());

					/* write the entry into db */
					dbWriter.write(session, feedNode, entry);
				}
				else {
					log.debug("entry already existed." + entry.getTitle());
				}
			}
			catch (Exception e) {
				log.error("Failed writing feed.", e);
			}
		}
	}
}
