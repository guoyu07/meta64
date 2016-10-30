package com.meta64.mobile.rss;

public class RssDbReader {
	// 2016 comments
	// private HashMap<String, Integer> rssEntryLinkMap = new HashMap<String, Integer>();
	// private HashMap<String, Integer> rssFeedUriMap = new HashMap<String, Integer>();
	//
	// public void read(int parentId) throws Exception {
	//
	// EntityNodeCallback callback = new EntityNodeCallback() {
	//
	// @Override
	// public boolean nodeFound(NodeEntity node) throws Exception {
	//
	// switch (node.getTypeId()) {
	//
	// /*
	// * for entries we merely need to know if they exist so we can
	// * ignore them
	// */
	// case AllTypes.TYPE_RSS_ENTRY_LINK:
	// addToMap(rssEntryLinkMap, node, "rss-entry-link");
	// break;
	//
	// /*
	// * for feeds we need to know the ID of any found feed, so that
	// * we can add to existing feed which required db inserts under
	// * this id.
	// */
	// case AllTypes.TYPE_RSS_FEED_URI:
	// addToMap(rssFeedUriMap, node, "rss-feed-uri");
	// break;
	//
	// default:
	// break;
	// }
	//
	// return true;
	// }
	// };
	//
	// // ALog.log("RSS READING BEGIN");
	// Factory.nodeService().scanNodes(parentId, true, 10, callback);
	// }
	//
	// /* note: Feeds recognized by URI */
	// public Integer getExistingFeedUriId(SyndFeed feed) {
	// return rssFeedUriMap.get(feed.getUri());
	// }
	//
	// /* note: Entries recognized by Link */
	// public boolean entryExistsInDb(SyndEntry entry) {
	// return rssEntryLinkMap.containsKey(entry.getLink());
	// }
	//
	// /*
	// * WARNING **** WARNING: This implementation using 'getLink' must MATCH the
	// * case statement above where TYPE_RSS_ENTRY_LINK is the switch. If you
	// * change either one you have to change both.
	// */
	// public static String buildKey(SyndEntry entry) {
	// return entry.getLink();
	// }
	//
	// /* WARNING ** DITTO ABOVE */
	// public static String buildKey(SyndFeed feed) {
	// return feed.getUri();
	// }
	//
	// public void addToMap(HashMap<String, Integer> map, NodeEntity node, String category) throws
	// Exception {
	//
	// int id = node.getId();
	//
	// /* Given entity node look up entity text */
	// TextEntity entityText = node.getText();
	//
	// if (entityText != null) {
	// if (Constants.debug_rssInternals) {
	// //ALog.log("map " + category + " identifier text [" + entityText.getValue() + "] to id " +
	// id);
	// }
	// map.put(entityText.getValue(), id);
	// }
	// }
}
