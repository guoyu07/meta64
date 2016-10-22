package com.meta64.mobile.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.request.GetPlayerInfoRequest;
import com.meta64.mobile.request.SetPlayerInfoRequest;
import com.meta64.mobile.response.GetPlayerInfoResponse;
import com.meta64.mobile.rss.RssReader;
import com.meta64.mobile.rss.model.PlayerInfo;
import com.meta64.mobile.user.AccessControlUtil;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.XString;

/* WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I started, and anything related to RSS
 * is untested code and the commented code you see comes from the older version of the software and is in the process of being converted.
 * Bottom line, don't try to use any RSS code or features yet.
 */

/**
 * RSS Feed Processing
 * 
 * This class is experimental and is not yet complete!
 *
 */
@Component
public class RssService {
	private static final Logger log = LoggerFactory.getLogger(RssService.class);

	@Value("${feed.list}")
	private String feedList;

	@Autowired
	private RunAsJcrAdmin adminRunner;
	
	@Autowired
	private SessionContext sessionContext;

	private Node rssRoot;
	private Node feedsRootNode;

	private List<String> urlsList;

	/* List of nodes and hashmap for looking them up quickly by URI */
	private List<Node> feedNodes = new LinkedList<Node>();
	private HashMap<String, Node> feedsByUri = new HashMap<String, Node>();
	private HashMap<String, Node> feedsByLink = new HashMap<String, Node>();
	private HashMap<String, Node> entriesByLink = new HashMap<String, Node>();
	
	/* We cache all the PlayerInfo in memory, so that the API calls from the client have zero lag, but we will
	 * have a deamon thread that goes thru this map and persists all of it intermittently. If we didn't do it
	 * this way the only other alternative would be to perform a DB write EVERY TIME any user clicks Pause in
	 * a media player, and we want to be much more scalable than that.
	 */
	private HashMap<String, PlayerInfo> playerInfoMap = new HashMap<String, PlayerInfo>();

	public void setPlayerInfo(SetPlayerInfoRequest req) {
		String currentUser = sessionContext.getUserName();
		String key = currentUser+":"+req.getUrl();
		PlayerInfo info = new PlayerInfo();
		info.setTimeOffset(req.getTimeOffset());
		playerInfoMap.put(key, info);
	}
	
	public void getPlayerInfo(GetPlayerInfoRequest req, GetPlayerInfoResponse res) {
		String currentUser = sessionContext.getUserName();
		String key = currentUser+":"+req.getUrl();
		PlayerInfo info = playerInfoMap.get(key);
		if (info != null) {
			res.setTimeOffset(info.getTimeOffset());
		}
	}
	
	
	public void readFeeds() throws Exception {

		adminRunner.run((Session session) -> {
			try {
				init(session);
				session.save();

				if (urlsList == null) {
					// no feed urls defined, nothing to do.
					return;
				}

				RssReader reader = (RssReader) SpringContextUtil.getBean(RssReader.class);
				try {
					reader.run(session, urlsList);
				}
				catch (Exception e) {
					log.error("Failed processing RSS feeds", e);
				}

				session.save();
			}
			catch (Exception e) {
				log.debug("failed processing RSS", e);
			}
		});
	}

	public Node getFeedsRootNode() {
		return feedsRootNode;
	}

	public Node getFeedNodeByUri(String uri) {
		return feedsByUri.get(uri);
	}

	public Node getFeedNodeByLink(String link) {
		return feedsByLink.get(link);
	}

	public Node getEntryByLink(String link) {
		Node entry = entriesByLink.get(link);
		log.debug("Looked up link[" + link + "] found=" + (entry != null));
		return entry;
	}

	public void init(Session session) throws Exception {
		rssRoot = JcrUtil.ensureNodeExists(session, "/", JcrName.RSS, "RSS");
		feedsRootNode = JcrUtil.ensureNodeExists(session, "/" + JcrName.RSS + "/", JcrName.RSS_FEEDS, "#RSS Feeds");
		ensureFeedsAdded();
		AccessControlUtil.makeNodePublic(session, feedsRootNode);
		/* todo-1: not sure if I need disable_insert here or not */
		feedsRootNode.setProperty(JcrProp.DISABLE_INSERT, "y");
		cacheCurrentFeedNodes();
	}

	public void ensureFeedsAdded() throws Exception {
		String urls = JcrUtil.safeGetStringProp(feedsRootNode, JcrProp.RSS_FEED_ROOT_URLS);

		/*
		 * If property exists in the DB use it's content, else we use 'feedList' property to get the
		 * default from the properties file and store it.
		 */
		if (urls == null) {
			urls = feedList;
			feedsRootNode.setProperty(JcrProp.RSS_FEED_ROOT_URLS, urls);
		}

		if (!StringUtils.isEmpty(urls)) {
			urlsList = XString.tokenize(urls, ",", true);
			// if (urlsList != null) {
			// for (String url : urlsList) {
			// log.debug("url[" + url + "]");
			// }
			// }
		}
	}

	private void cacheCurrentFeedNodes() throws Exception {
		feedNodes.clear();
		feedsByUri.clear();

		NodeIterator nodeIter = feedsRootNode.getNodes();
		try {
			while (true) {
				Node feedNode = nodeIter.nextNode();
				feedNodes.add(feedNode);
				String uriProp = JcrUtil.safeGetStringProp(feedNode, JcrProp.RSS_FEED_URI);
				if (uriProp != null) {
					feedsByUri.put(uriProp, feedNode);
				}
				String linkProp = JcrUtil.safeGetStringProp(feedNode, JcrProp.RSS_FEED_LINK);
				if (linkProp != null) {
					feedsByLink.put(linkProp, feedNode);
				}
				cacheFeedEntries(feedNode);
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}

	private void cacheFeedEntries(Node feedNode) throws Exception {

		NodeIterator nodeIter = feedNode.getNodes();
		try {
			while (true) {
				Node entryNode = nodeIter.nextNode();
				String linkProp = JcrUtil.safeGetStringProp(entryNode, JcrProp.RSS_ENTRY_LINK);
				if (linkProp != null) {
					log.debug("CACHING ENTRY: link=" + linkProp);
					entriesByLink.put(linkProp, entryNode);
				}
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}
}
