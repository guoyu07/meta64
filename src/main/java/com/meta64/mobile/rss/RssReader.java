package com.meta64.mobile.rss;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.rss.model.FeedNodeInfo;
import com.meta64.mobile.rss.model.RssEntryWrapper;
import com.meta64.mobile.rss.model.RssFeedWrapper;
import com.meta64.mobile.service.RssService;
import com.meta64.mobile.service.SystemService;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.LimitedInputStreamEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.Util;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

/**
 * Handles reading of RSS feed info from online sources.
 * <p>
 * WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I
 * started, and anything related to RSS is untested code and the commented code you see comes from
 * the older version of the software and is in the process of being converted. Bottom line, don't
 * try to use any RSS code or features yet.
 */

@Component
@Scope("prototype")
public class RssReader {
	private static final Logger log = LoggerFactory.getLogger(RssReader.class);

	private static final String FAKE_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/53.0.2785.143Safari/537.36";
	private static final int maxFileSize = 10 * 1024 * 1024;
	public static final int MAX_RSS_ENTRIES = 50;

	@Autowired
	private RssService rssService;

	@Autowired
	private RssDbWriter dbWriter;

	@Autowired
	private RunAsMongoAdmin adminRunner;
	
	@Autowired
	private MongoApi api;

	public RssReader() {
	}

	public void run(List<FeedNodeInfo> feedNodeInfos) {

		int counter = 0;
		for (FeedNodeInfo feedNodeInfo : feedNodeInfos) {
			AppServer.shutdownCheck();
			RssFeedWrapper wFeed = readFeed(feedNodeInfo.getUrl());
			Util.sleep(1000);
			if (wFeed != null) {
				try {
					feedNodeInfo.setInProgress(true);
					writeFeedToDb(wFeed, feedNodeInfo);
				}
				catch (Exception e) {
					log.error("Failed to process feed: " + wFeed.getFeed().getTitle(), e);
				}
				finally {
					feedNodeInfo.setInProgress(false);
				}
			}
		}
	}

	/*
	 * todo-3: there is no finally block in this method. will be memory leak. Currently this method
	 * isn't being used so i'm not worrying about it for now.
	 */
	public void readUrl__unused(String url) {
		if (true) throw ExUtil.newEx("don't call this until you fix missing finally block memory leak.");
		// HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);

		// add request header
		request.addHeader("User-Agent", FAKE_USER_AGENT);
		HttpClient client = HttpClientBuilder.create().build();

		try {
			HttpResponse response = client.execute(request);

			log.debug("RawRead of " + url + " -> Response Code : " + response.getStatusLine().getStatusCode());

			BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

			StringBuilder result = new StringBuilder();
			String line = null;
			while ((line = rd.readLine()) != null) {
				result.append(line);
			}
			log.debug("CONTENT: " + result.toString());
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	public RssFeedWrapper readFeed(String feedUrl) {
		log.debug("processing RSS url: " + feedUrl);

		XmlReader reader = null;
		RssFeedWrapper wFeed = null;
		InputStream is = null;

		long startTime = System.currentTimeMillis();
		try {
			HttpClient client = HttpClientBuilder.create().build();
			HttpGet request = new HttpGet(feedUrl);
			request.addHeader("User-Agent", FAKE_USER_AGENT);
			HttpResponse response = client.execute(request);

			log.debug("Response Code: " + response.getStatusLine().getStatusCode() + " reason=" + response.getStatusLine().getReasonPhrase());

			is = response.getEntity().getContent();
			reader = new XmlReader(is);

			SyndFeed feed = new SyndFeedInput().build(reader);
			wFeed = new RssFeedWrapper(feed, feedUrl);
			int entryCounter = 0;

			for (Object e : feed.getEntries()) {
				SyndEntry entry = (SyndEntry) e;

				log.debug("RSS Entry in Feed: " + entry.getLink());
				wFeed.getEntryList().add(new RssEntryWrapper(entry));
				Util.sleep(1000);
				if (++entryCounter >= MAX_RSS_ENTRIES) break;
			}
		}

		/*
		 * NOTE: When we get the following exception there is a fix that needs to be run on the
		 * server and I have it documented in my notes and working fine.
		 *
		 * Need to add to github docs. (todo-1) javax.net.ssl.SSLException:
		 * java.lang.RuntimeException: Unexpected error:
		 * java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be
		 * non-empty
		 */
		catch (Exception e) {
			log.error("*** ERROR reading feed: " + feedUrl, e);
			// log.debug("Calling readUrl to double check streamability.");
			// readUrl(feedUrl);

			/*
			 * It is by design that we don't rethrow this exception, because if a feed fails we
			 * return null, and let the system continue processing the rest of the feeds.
			 */
			return null;
		}
		finally {
			StreamUtil.close(reader, is);
			log.info("Stream read took: " + (System.currentTimeMillis() - startTime) + "ms");
		}
		return wFeed;
	}

	/*
	 * This method is no longer being used. This was failing on several RSS feeds, and I never
	 * figured out why, but in the process of researching it I decided using Apache HttpClient could
	 * be better anyway, and by the time I got HttpClient in place it started working on all Feeds,
	 * BUT it may have been the addition of the longer FAKE_USER_AGENT that was the real fix. I
	 * don't know, but I do consider this method dead and will eventually delete it.
	 */
	public RssFeedWrapper readFeed_original(String feedUrl) {
		log.debug("processing RSS url: " + feedUrl);

		try {
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

				// String content = IOUtils.toString(uis, "UTF-8");
				// log.debug("content: "+content);

				reader = new XmlReader(uis);
				// reader = new XmlReader(httpcon);

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

				/*
				 * It is by design that we don't rethrow this exception, because if a feed fails we
				 * return null, and let the system continue processing the rest of the feeds.
				 */
				return null;
			}
			finally {
				StreamUtil.close(reader, uis, is);

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
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	/* Writes all the entries in the specific RssFeedWrapper to the db */
	private void writeFeedToDb(RssFeedWrapper wFeed, FeedNodeInfo feedNodeInfo) {
		SyndFeed feed = wFeed.getFeed();

		log.debug("writing feed: " + feed.getTitle());
		dbWriter.updateFeedNode(feed, feedNodeInfo);

		adminRunner.run(session -> {

			SubNode feedNode = api.getNode(session, feedNodeInfo.getNodeId());
			if (feedNode == null) {
				throw ExUtil.newEx("unable to find feed node id: " + feedNodeInfo.getNodeId());
			}
			/*
			 * now we have the Feed node in place so we can write all RSS entries to the db
			 */
			List<RssEntryWrapper> entries = wFeed.getEntryList();
			feedNodeInfo.setEntryCount(entries.size());

			int entryCounter = 0;
			for (RssEntryWrapper wEntry : entries) {
				AppServer.shutdownCheck();
				SyndEntry entry = (SyndEntry) wEntry.getEntry();

				try {
					/* if this entry doesn't already exist in our DB */
					if (!rssService.linkExists(entry.getLink())) {
						log.debug("writing new entry." + entry.getTitle());
						dbWriter.write(session, feedNode, feedNodeInfo, entry);
					}
					else {
						log.debug("entry already existed." + entry.getTitle());
					}
				}
				catch (Exception e) {
					log.error("Failed writing entry. Continuing to next entry...", e);
				}
				finally {
					entryCounter++;
					feedNodeInfo.setEntriesComplete(entryCounter);
				}
			}

			//adminRunner does an implicit save.
			//api.saveSession(session);
			SystemService.logMemory();
		});
	}
}
