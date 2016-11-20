package com.meta64.mobile.rss;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.rss.model.RssEntryWrapper;
import com.meta64.mobile.rss.model.RssFeedWrapper;
import com.meta64.mobile.service.RssService;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.LimitedInputStreamEx;
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

	private static final String FAKE_USER_AGENT = "Mozilla/5.0";
	private static final int maxFileSize = 10 * 1024 * 1024;
	public static final int MAX_RSS_ENTRIES = 10;

	@Autowired
	private RssService rssService;

	@Autowired
	private RssDbWriter dbWriter;

	public RssReader() {
	}

	public void run(Session session, List<Node> feedNodes) throws Exception {
		for (Node feedNode : feedNodes) {
			RssFeedWrapper wFeed = readFeed(feedNode);
			try {
				writeFeedToDb(session, wFeed, feedNode);
			}
			catch (Exception e) {
				log.error("Failed to process feed: " + wFeed.getFeed().getTitle(), e);
			}
		}
	}

	private RssFeedWrapper readFeed(Node feedNode) throws Exception {
		String feedUrl = JcrUtil.safeGetStringProp(feedNode, JcrProp.RSS_FEED_SRC);
		log.debug("processing RSS url: " + feedUrl);

		URL url = new URL(feedUrl);
		XmlReader reader = null;
		RssFeedWrapper wFeed = null;
		InputStream uis = null;
		InputStream is = null;
		HttpURLConnection httpcon = null;
		
		try {
			httpcon = (HttpURLConnection) url.openConnection();
			httpcon.addRequestProperty("User-Agent", FAKE_USER_AGENT);
			httpcon.connect();
			is = httpcon.getInputStream();
			uis = new LimitedInputStreamEx(is, maxFileSize);
			
			reader = new XmlReader(uis); 
			SyndFeed feed = new SyndFeedInput().build(reader);
			wFeed = new RssFeedWrapper(feed, feedUrl);
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
			
			if (uis != null) {
				uis.close();
				uis = null;
			}
			
			if (is != null) {
				is.close();
				is = null;
			}

			/*
			 * I may not need this after the stream was close, but I'm calling it just in case
			 */
			if (httpcon != null) {
				httpcon.disconnect();
				httpcon = null;
			}
		}
		return wFeed;
	}

	/* Writes all the entries in the specific RssFeedWrapper to the db */
	private void writeFeedToDb(Session session, RssFeedWrapper wFeed, Node feedNode) throws Exception {
		SyndFeed feed = wFeed.getFeed();

		log.debug("writing feed: " + feed.getTitle());
		dbWriter.updateFeedNode(session, feed, feedNode);

		/*
		 * now we have the Feed node in place so we can write all RSS entries to the db
		 */
		for (RssEntryWrapper wEntry : wFeed.getEntryList()) {
			SyndEntry entry = (SyndEntry) wEntry.getEntry();

			try {
				/* if this entry doesn't already exist in our DB */
				if (rssService.getEntryByLink(entry.getLink()) == null) {
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
