package com.meta64.mobile.service;

import org.springframework.stereotype.Component;

/**
 * Service for processing Lucene-related functions.
 */
@Component
public class LuceneService {
	// private static final Logger log = LoggerFactory.getLogger(LuceneService.class);
	//
	// private static final ObjectMapper jsonMapper = new ObjectMapper();
	//
	// @Autowired
	// private AppProp appProp;
	//
	// @Autowired
	// private UserManagerService userManagerService;
	//
	// @Autowired
	// private FileIndexer fileIndexer;
	//
	// @Autowired
	// private FileSearcher searcher;
	//
	// public void reindex(Session session, FileSearchRequest req, FileSearchResponse res) {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	// String nodeId = req.getNodeId();
	// log.info("Reindex runing on server: " + nodeId);
	// Node node = JcrUtil.findNode(session, nodeId);
	// String path = JcrUtil.safeGetStringProp(node, "meta64:path");
	// if (StringUtils.isEmpty(path)) {
	// throw ExUtil.newEx("No path specified to be indexed.");
	// }
	// fileIndexer.index(path, null);
	// }
	//
	// public void search(Session session, FileSearchRequest req, FileSearchResponse res) {
	// try {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	//
	// if (!appProp.isAllowFileSystemSearch()) {
	// throw ExUtil.newEx("File system search is not enabled on the server.");
	// }
	//
	// List<FileSearchResult> resultList = searcher.search(req.getSearchText(), 100);
	// if (resultList == null || resultList.size() == 0) {
	// log.debug("No search results found.");
	// return;
	// }
	//
	// // todo-1: need to load a json object for browsing folders also.
	// String json = jsonMapper.writeValueAsString(resultList);
	// log.debug("RESULT STRING: " + json);
	//
	// SessionContext sessionContext = (SessionContext)
	// SpringContextUtil.getBean(SessionContext.class);
	// String userName = sessionContext.getUserName();
	//
	// String nodeId = req.getNodeId();
	// log.info("File Searching at node: " + nodeId);
	// Node parentNode = JcrUtil.findNode(session, nodeId);
	//
	// Node newNode = parentNode.addNode(JcrUtil.getGUID(), "meta64:filelist");
	// // todo-1: need some type of way to make this kind of node not editable by user. It's
	// // presentation only, and not an editable node.
	// newNode.setProperty(JcrProp.CREATED_BY, userName);
	// newNode.setProperty("meta64:json", json);
	// JcrUtil.timestampNewNode(session, newNode);
	// JcrUtil.save(session);
	//
	// res.setSearchResultNodeId(newNode.getIdentifier());
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
}
