package com.meta64.mobile.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeName;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoRepository;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.request.GetPlayerInfoRequest;
import com.meta64.mobile.request.SetPlayerInfoRequest;
import com.meta64.mobile.response.GetPlayerInfoResponse;
import com.meta64.mobile.rss.RssReader;
import com.meta64.mobile.rss.model.FeedNodeInfo;
import com.meta64.mobile.rss.model.PlayerInfo;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.SubNodeUtil;

/**
 * RSS Feed Processing
 * <p>
 * WARNING: Experimental work in progress. To anyone who downloads meta64, beware the RSS stuff is a
 * work in progress that I started, and anything related to RSS is untested code and the commented
 * code you see comes from the older version of the software and is in the process of being
 * converted. Bottom line, don't try to use any RSS code or features yet.
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
	private RunAsMongoAdmin adminRunner;
	
	@Autowired
	private SubNodeUtil jcrUtil;

	@Autowired
	private SessionContext sessionContext;
	
	@Autowired
	private MongoApi api;

	/* note that contains all the feed definition nodes */
	private SubNode feedsRootNode;

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

	private static final int HOURS_BETWEEN_RUNS = 6;

	/* Number of hours between RSS runs. Set initial run to happen only 1 hour after startup */
	private int hoursCountdown = 1;

	@Scheduled(fixedDelay = DateUtil.HOUR_MILLIS)
	public void readFeeds() {
		if (hoursCountdown-- > 0) return;

		if (!MongoRepository.fullInit || AppServer.isShuttingDown() || !appProp.isEnableRssDaemon()) return;

		readFeedsNow();

		// reset to wait another 6 hours
		hoursCountdown = HOURS_BETWEEN_RUNS;
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

	public SubNode getFeedsRootNode() {
		return feedsRootNode;
	}

	public boolean linkExists(String link) {
		boolean found = feedItemsByLink.contains(link);
		log.debug("Looked up link[" + link + "] found=" + found);
		return found;
	}

	private void init(MongoSession session) {
		feedsRootNode = jcrUtil.ensureNodeExists(session, "/" + NodeName.ROOT + "/" + NodeName.PUBLIC + "/", NodeName.FEEDS, "# RSS Feeds");

		try {
			feedsRootNode.setProp(NodeProp.DISABLE_INSERT, "y");

			feedNodeInfos.clear();
			feedItemsByLink.clear();
			scanForFeedNodes(session, feedsRootNode);

			api.saveSession(session);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		log.info("RSS init complete.");
	}

	/*
	 * NOTE: We use a simple recursion algorithm here, but it would be more efficient to actually do
	 * a query for the rssfeed type itself, and just process the results of the query. Leaving that
	 * as a future enhancement (todo-1)
	 */
	private void scanForFeedNodes(MongoSession session, SubNode node) {
		try {
			if (node.getType().equals(SubNodeTypes.TYPE_RSS_FEED)) {
				String nodeId = node.getId().toHexString();
				String url = node.getStringProp(NodeProp.RSS_FEED_SRC);
				FeedNodeInfo feedNodeInfo = new FeedNodeInfo();
				feedNodeInfo.setUrl(url);
				feedNodeInfo.setNodeId(nodeId);
				feedNodeInfos.add(feedNodeInfo);
				cacheFeedItems(session, node);
				return;
			}

			for (SubNode child : api.getChildren(session, node, true, null)) {
				scanForFeedNodes(session, child);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void cacheFeedItems(MongoSession session, SubNode feedNode) {
		try {
			for (SubNode child : api.getChildren(session, feedNode, true, null)) {
				String linkProp = child.getStringProp(NodeProp.RSS_ITEM_LINK);
				if (!StringUtils.isEmpty(linkProp)) {
					log.debug("CACHING ENTRY: link=" + linkProp);
					feedItemsByLink.add(linkProp);
				}
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
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
					api.saveSession(session);
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
	private boolean persistPlayerInfo(MongoSession session) {
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
