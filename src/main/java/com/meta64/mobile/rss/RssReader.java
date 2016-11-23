package com.meta64.mobile.rss;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
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

	private static final String FAKE_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36";
	private static final int maxFileSize = 10 * 1024 * 1024;
	public static final int MAX_RSS_ENTRIES = 100;

	@Autowired
	private RssService rssService;

	@Autowired
	private RssDbWriter dbWriter;

	public RssReader() {
	}

	public void run(Session session, List<Node> feedNodes) throws Exception {
		for (Node feedNode : feedNodes) {
			RssFeedWrapper wFeed = readFeed(feedNode);
			if (wFeed != null) {
				try {
					writeFeedToDb(session, wFeed, feedNode);
				}
				catch (Exception e) {
					log.error("Failed to process feed: " + wFeed.getFeed().getTitle(), e);
				}
			}
		}
	}

	public RssFeedWrapper readFeed(Node feedNode) throws Exception {
		String feedUrl = JcrUtil.safeGetStringProp(feedNode, JcrProp.RSS_FEED_SRC);
		return readFeed(feedUrl);
	}

	public void readUrl(String url) throws Exception {
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);

		// add request header
		request.addHeader("User-Agent", FAKE_USER_AGENT);
		HttpResponse response = client.execute(request);

		log.debug("RawRead of " + url + " -> Response Code : " + response.getStatusLine().getStatusCode());

		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

		StringBuilder result = new StringBuilder();
		String line = null;
		while ((line = rd.readLine()) != null) {
			result.append(line);
		}
		log.debug("CONTENT: "+result.toString());
	}

	public RssFeedWrapper readFeed(String feedUrl) throws Exception {
		log.debug("processing RSS url: " + feedUrl);

		XmlReader reader = null;
		RssFeedWrapper wFeed = null;
		InputStream is = null;

		try {
			/*
			 * TODO-0: HttpClient is better than URLConnection, so I need to also look for other
			 * places in the code (like image downloading) where I'm streaming from arbitrary
			 * internet URLs and change them over to HttpClient.
			 */
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

				if (++entryCounter >= MAX_RSS_ENTRIES) break;
			}
		}
		//Still haven't figured out why some RSS feeds result in this error.
		//javax.net.ssl.SSLException: java.lang.RuntimeException: Unexpected error: java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty
		catch (Exception e) {
			log.error("*** ERROR reading feed: " + feedUrl, e);
			//log.debug("Calling readUrl to double check streamability.");
			//readUrl(feedUrl);

			/*
			 * It is by design that we don't rethrow this exception, because if a feed fails we
			 * return null, and let the system continue processing the rest of the feeds.
			 */
			return null;
		}
		finally {
			if (reader != null) {
				reader.close();
			}

			if (is != null) {
				is.close();
				is = null;
			}
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
	public RssFeedWrapper readFeed_original(String feedUrl) throws Exception {
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
				log.error("Failed writing entry. Continuing to next entry...", e);
			}
		}
	}
}
