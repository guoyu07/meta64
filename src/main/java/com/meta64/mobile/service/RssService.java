package com.meta64.mobile.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
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
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.JcrUtil;

/* WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I started, and anything related to RSS
 * is untested code and the commented code you see comes from the older version of the software and is in the process of being converted.
 * Bottom line, don't try to use any RSS code or features yet.
 */

/**
 * RSS Feed Processing
 *
 */
@Component
public class RssService {
	@Value("${profileName}")
	private String profileName;

	private static final Logger log = LoggerFactory.getLogger(RssService.class);

	/* State when feeds are currently being processed */
	private boolean processing = false;
	private Object processingLock = new Object();

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private SessionContext sessionContext;

	/* topmost node where everything related to RSS is stored. contains the main feed root node */
	private Node rssRoot;

	/* note that contains all the feed definition nodes */
	private Node feedsRootNode;

	/* List of nodes and hashmap for looking them up quickly by various types of keys */
	private List<Node> feedNodes = new LinkedList<Node>();
	private HashMap<String, Node> feedItemsByLink = new HashMap<String, Node>();

	/*
	 * We cache all the PlayerInfo in memory, so that the API calls from the client have zero lag,
	 * but we will have a deamon thread that goes thru this map and persists all of it
	 * intermittently. If we didn't do it this way the only other alternative would be to perform a
	 * DB write EVERY TIME any user clicks Pause in a media player, and we want to be much more
	 * scalable than that.
	 */
	private HashMap<String, PlayerInfo> playerInfoMap = new HashMap<String, PlayerInfo>();

	public void setPlayerInfo(SetPlayerInfoRequest req) {
		if (sessionContext.isAnonUser()) {
			return;
		}
		String currentUser = sessionContext.getUserName();
		String key = currentUser + ":" + req.getUrl();
		PlayerInfo info = new PlayerInfo();
		info.setTimeOffset(req.getTimeOffset());
		info.setNodePath(req.getNodePath());
		// log.debug("SetPlayer info: offset="+req.getTimeOffset());
		synchronized (playerInfoMap) {
			playerInfoMap.put(key, info);
		}
	}

	public void getPlayerInfo(GetPlayerInfoRequest req, GetPlayerInfoResponse res) {
		String currentUser = sessionContext.getUserName();
		String key = currentUser + ":" + req.getUrl();
		PlayerInfo info = null;
		synchronized (playerInfoMap) {
			info = playerInfoMap.get(key);
		}
		if (info != null) {
			res.setTimeOffset(info.getTimeOffset());
		}
	}

	@Scheduled(fixedDelay = 12 * DateUtil.HOUR_MILLIS)
	public void readFeeds() throws Exception {
		if (processing || !"prod".equalsIgnoreCase(profileName)) return;

		synchronized (processingLock) {
			adminRunner.run((Session session) -> {
				try {
					processing = true;
					init(session);
					session.save();

					RssReader reader = (RssReader) SpringContextUtil.getBean(RssReader.class);
					try {
						reader.run(session, feedNodes);
					}
					catch (Exception e) {
						log.error("Failed processing RSS feeds", e);
					}

					session.save();
				}
				catch (Exception e) {
					log.debug("failed processing RSS", e);
				}
				finally {
					processing = false;
				}
			});
		}
	}

	public Node getFeedsRootNode() {
		return feedsRootNode;
	}

	public Node getEntryByLink(String link) {
		Node entry = feedItemsByLink.get(link);
		log.debug("Looked up link[" + link + "] found=" + (entry != null));
		return entry;
	}

	public void init(Session session) throws Exception {
		rssRoot = JcrUtil.ensureNodeExists(session, "/", JcrName.RSS, "RSS");
		feedsRootNode = JcrUtil.ensureNodeExists(session, "/" + JcrName.RSS + "/", JcrName.RSS_FEEDS, "#RSS Feeds");
		AccessControlUtil.makeNodePublic(session, feedsRootNode);
		/* todo-1: not sure if I need disable_insert here or not */
		feedsRootNode.setProperty(JcrProp.DISABLE_INSERT, "y");
		cacheCurrentFeedNodes();
	}

	private void cacheCurrentFeedNodes() throws Exception {
		feedNodes.clear();

		NodeIterator nodeIter = feedsRootNode.getNodes();
		try {
			while (true) {
				Node feedNode = nodeIter.nextNode();
				if (!feedNode.getPrimaryNodeType().getName().equals("meta64:rssfeed")) continue;

				feedNodes.add(feedNode);
				cacheFeedItems(feedNode);
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}

	private void cacheFeedItems(Node feedNode) throws Exception {

		NodeIterator nodeIter = feedNode.getNodes();
		try {
			while (true) {
				Node itemNode = nodeIter.nextNode();
				String linkProp = JcrUtil.safeGetStringProp(itemNode, JcrProp.RSS_ITEM_LINK);
				if (linkProp != null) {
					log.debug("CACHING ENTRY: link=" + linkProp);
					feedItemsByLink.put(linkProp, itemNode);
				}
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}

	// Work in progress -- this is not yet complete.
	// uncomment annotation to activate this code.
	// @Scheduled(fixedDelay = 10 * 1000)
	public void run() {
		if (AppServer.isShuttingDown() || !AppServer.isEnableScheduling()) return;

		try {
			adminRunner.run((Session session) -> {
				if (persistPlayerInfo(session)) {
					session.save();
				}
			});
		}
		catch (Exception e) {
			log.debug("Failed processing mail.", e);
		}
	}

	/*
	 * This code is not complete. Work in progress...
	 * 
	 * I'm stopping work on it for now. What it WILL do once COMPLETED is read all the cached
	 * PlayerInfo paris from the hashmap and persist them permanently into the db so that even after
	 * a server restart the time offsets where each person's podcast was left off will still be
	 * available after reboot. For now a server restart/redeploy wipes out everyone's info regarding
	 * where the were last listening to any given podcast.
	 */
	private boolean persistPlayerInfo(Session session) throws Exception {
		boolean workDone = false;
		Iterator it = playerInfoMap.entrySet().iterator();

		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry) it.next();
			System.out.println(pair.getKey() + " = " + pair.getValue());
			String key = (String) pair.getKey();
			PlayerInfo info = (PlayerInfo) pair.getValue();
			int urlStart = key.indexOf(":");
			if (urlStart != -1) {
				String url = key.substring(urlStart);
				String path = info.getNodePath();
				log.debug("URL CACHED=" + url + " path=" + info.getNodePath());
				// Node node = JcrUtil.findNode(session, path);

				//////////////////
				// Node prefsNode = getPrefsNodeForSessionUser(session, userName);
				// prefsNode.setProperty(JcrProp.*, advancedMode);
				// workDone = true;
				//////////////////
			}
		}
		return workDone;
	}
}
