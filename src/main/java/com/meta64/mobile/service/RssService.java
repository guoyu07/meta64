package com.meta64.mobile.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.GetPlayerInfoRequest;
import com.meta64.mobile.request.SetPlayerInfoRequest;
import com.meta64.mobile.response.GetPlayerInfoResponse;
import com.meta64.mobile.rss.RssReader;
import com.meta64.mobile.rss.model.FeedNodeInfo;
import com.meta64.mobile.rss.model.PlayerInfo;
import com.meta64.mobile.user.AccessControlUtil;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;

/* WARNING: To anyone who downloads meta64, beware the RSS stuff is a work in progress that I started, and anything related to RSS
 * is untested code and the commented code you see comes from the older version of the software and is in the process of being converted.
 * Bottom line, don't try to use any RSS code or features yet.
 */

/**
 * RSS Feed Processing
 */
@Component
public class RssService {
	private static final Logger log = LoggerFactory.getLogger(RssService.class);

	/* State when feeds are currently being processed */
	private boolean processing = false;
	private Object processingLock = new Object();

	@Autowired
	private AppProp appProp;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private SessionContext sessionContext;

	/* topmost node where everything related to RSS is stored. contains the main feed root node */
	private Node rssRoot;

	/* note that contains all the feed definition nodes */
	private Node feedsRootNode;

	/* List of nodes and hashmap for looking them up quickly by various types of keys */
	private final List<FeedNodeInfo> feedNodeInfos = new LinkedList<FeedNodeInfo>();

	/*
	 * todo-1: If we wanted to be super efficient we could store a checksum/hash of the String,
	 * because that would be sufficient
	 */
	private final HashSet<String> feedItemsByLink = new HashSet<String>();

	/*
	 * We cache all the PlayerInfo in memory, so that the API calls from the client have zero lag,
	 * but we will have a deamon thread that goes thru this map and persists all of it
	 * intermittently. If we didn't do it this way the only other alternative would be to perform a
	 * DB write EVERY TIME any user clicks Pause in a media player, and we want to be much more
	 * scalable than that.
	 */
	private HashMap<String, PlayerInfo> playerInfoMap = new HashMap<String, PlayerInfo>();

	@Scheduled(fixedDelay = 6 * DateUtil.HOUR_MILLIS)
	public void readFeeds() {
		if (!OakRepository.fullInit || AppServer.isShuttingDown()) return;
		if (!appProp.isEnableRssDaemon()) return;
		readFeedsNow();
	}

	public void readFeedsNow() {
		if (processing) return;

		synchronized (processingLock) {
			try {
				processing = true;

				adminRunner.run(session -> {
					init(session);
				});
				AppServer.shutdownCheck();

				RssReader reader = (RssReader) SpringContextUtil.getBean(RssReader.class);
				reader.run(feedNodeInfos);
				log.info("All RSS processing complete.");
			}
			catch (Exception e) {
				log.error("Failed processing RSS feeds", e);
			}
			finally {
				feedNodeInfos.clear();
				feedItemsByLink.clear();
				processing = false;
			}
		}
	}

	public void setPlayerInfo(SetPlayerInfoRequest req) {
		if (sessionContext.isAnonUser()) {
			return;
		}
		String currentUser = sessionContext.getUserName();
		String key = currentUser + ":" + req.getUrl();
		PlayerInfo info = new PlayerInfo();
		info.setTimeOffset(req.getTimeOffset());
		// info.setNodePath(req.getNodePath());
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

	/*
	 * Returns HTML that represents the status of the RSS engine, like what it's doing and how far
	 * along it is.
	 */
	public String getStatusText() {
		if (!processing) {
			return "RSS engine idle.<br>";
		}
		StringBuilder sb = new StringBuilder();
		sb.append("Feed Node count=" + feedNodeInfos.size() + "<br>");
		int counter = 0;
		for (FeedNodeInfo feedNodeInfo : feedNodeInfos) {
			sb.append("Feed Node[" + counter + "] Status: " + feedNodeInfo.getStatus());
			counter++;
		}
		return sb.toString();
	}

	public Node getFeedsRootNode() {
		return feedsRootNode;
	}

	public boolean linkExists(String link) {
		boolean found = feedItemsByLink.contains(link);
		log.debug("Looked up link[" + link + "] found=" + found);
		return found;
	}

	private void init(Session session) {
		rssRoot = JcrUtil.ensureNodeExists(session, "/", JcrName.RSS, "RSS");
		feedsRootNode = JcrUtil.ensureNodeExists(session, "/" + JcrName.RSS + "/", JcrName.RSS_FEEDS, "# RSS Feeds");
		AccessControlUtil.makeNodePublic(session, feedsRootNode);
		/* todo-1: not sure if I need disable_insert here or not */

		try {
			feedsRootNode.setProperty(JcrProp.DISABLE_INSERT, "y");

			feedNodeInfos.clear();
			feedItemsByLink.clear();
			scanForFeedNodes(session, feedsRootNode);

			session.save();
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
		log.info("RSS init complete.");
	}

	/*
	 * NOTE: We use a simple recursion algorithm here, but it would be more efficient to actually do
	 * a query for the rssfeed type itself, and just process the results of the query. Leaving that
	 * as a future enhancement (todo-1)
	 */
	private void scanForFeedNodes(Session session, Node node) {
		try {
			if (node.getPrimaryNodeType().getName().equals("meta64:rssfeed")) {
				String nodeId = node.getIdentifier();
				String url = JcrUtil.getRequiredStringProp(node, JcrProp.RSS_FEED_SRC);
				FeedNodeInfo feedNodeInfo = new FeedNodeInfo();
				feedNodeInfo.setUrl(url);
				feedNodeInfo.setNodeId(nodeId);
				feedNodeInfos.add(feedNodeInfo);
				cacheFeedItems(node);
				return;
			}

			NodeIterator nodeIter = node.getNodes();
			try {
				while (true) {
					Node nextNode = nodeIter.nextNode();
					scanForFeedNodes(session, nextNode);
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
			}
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	private void cacheFeedItems(Node feedNode) {
		try {
			NodeIterator nodeIter = feedNode.getNodes();
			try {
				while (true) {
					Node itemNode = nodeIter.nextNode();
					String linkProp = JcrUtil.safeGetStringProp(itemNode, JcrProp.RSS_ITEM_LINK);
					if (!StringUtils.isEmpty(linkProp)) {
						log.debug("CACHING ENTRY: link=" + linkProp);
						feedItemsByLink.add(linkProp);
					}
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
			}
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	// Work in progress -- this is not yet complete.
	// uncomment annotation to activate this code.
	// @Scheduled(fixedDelay = 10 * 1000)
	//
	// NOTE: By not having this complete all it means is that when we restart the server all
	// information is lost
	// that would allow a user to resume listening to a podcast right where they left off.
	public void run() {
		if (AppServer.isShuttingDown() || !AppServer.isEnableScheduling()) return;

		try {
			adminRunner.run(session -> {
				if (persistPlayerInfo(session)) {
					try {
						session.save();
					}
					catch (Exception ex) {
						throw new RuntimeEx(ex);
					}
				}
			});
		}
		catch (Exception e) {
			log.debug("Failed processing mail.", e);
		}
	}

	public void parseTest__unused(String url) {
		try {
			RssReader rssReader = (RssReader) SpringContextUtil.getBean(RssReader.class);
			rssReader.readUrl__unused(url);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
	private boolean persistPlayerInfo(Session session) {
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
				// String path = info.getNodePath();
				// log.debug("URL CACHED=" + url + " path=" + info.getNodePath());
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
