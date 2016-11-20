package com.meta64.mobile.service;

import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.lucene.FileIndexer;
import com.meta64.mobile.lucene.FileSearcher;
import com.meta64.mobile.model.FileSearchResult;
import com.meta64.mobile.request.FileSearchRequest;
import com.meta64.mobile.response.FileSearchResponse;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;

@Component
public class LuceneService {
	private static final Logger log = LoggerFactory.getLogger(LuceneService.class);

	private static final ObjectMapper jsonMapper = new ObjectMapper();

	@Autowired
	private UserManagerService userManagerService;

	@Autowired
	private FileIndexer fileIndexer;

	@Autowired
	private FileSearcher searcher;

	public void reindex(Session session, FileSearchRequest req, FileSearchResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		String nodeId = req.getNodeId();
		log.info("Reindex runing on server: " + nodeId);
		Node node = JcrUtil.findNode(session, nodeId);
		String path = JcrUtil.safeGetStringProp(node, "meta64:path");
		if (StringUtils.isEmpty(path)) {
			throw new Exception("No path specified to be indexed.");
		}
		fileIndexer.index(path, null);
	}

	public void search(Session session, FileSearchRequest req, FileSearchResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		if (!userManagerService.isAllowFileSystemSearch()) {
			throw new Exception("File system search is not enabled on the server.");
		}

		List<FileSearchResult> resultList = searcher.search(req.getSearchText(), 100);
		if (resultList == null || resultList.size() == 0) {
			log.debug("No search results found.");
			return;
		}

		String json = jsonMapper.writeValueAsString(resultList);
		log.debug("RESULT STRING: " + json);

		SessionContext sessionContext = (SessionContext) SpringContextUtil.getBean(SessionContext.class);
		String userName = sessionContext.getUserName();

		String nodeId = req.getNodeId();
		log.info("File Searching at node: " + nodeId);
		Node parentNode = JcrUtil.findNode(session, nodeId);

		Node newNode = parentNode.addNode(JcrUtil.getGUID(), "meta64:filelist");
		// todo-0: need some type of way to make this kind of node not editable by user. It's
		// presentation only, and not an editable node.
		newNode.setProperty(JcrProp.CREATED_BY, userName);
		newNode.setProperty("meta64:json", json);
		JcrUtil.timestampNewNode(session, newNode);
		session.save();

		res.setSearchResultNodeId(newNode.getIdentifier());
	}
}
