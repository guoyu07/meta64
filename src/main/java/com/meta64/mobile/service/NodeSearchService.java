package com.meta64.mobile.service;

import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.NodeSearchRequest;
import com.meta64.mobile.response.NodeSearchResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for searching the repository. This searching is currently very basic, and just grabs the
 * first 100 results. Despite it being basic right now, it is however EXTREMELY high performance and
 * leverages the full and best search performance that can be gotten out of Lucene, which beats any
 * other technology in the world in it's power.
 * 
 * http://labs.6dglobal.com/blog/2014-10-07/9-jcr-sql-2-queries-every-aem-dev- should-know/
 * http://docs.jboss.org/modeshape/0.7/manuals/reference/html/jcr-query-and-search.html
 */
@Component
public class NodeSearchService {
	private static final Logger log = LoggerFactory.getLogger(NodeSearchService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	private static boolean searchAllProps = false;

	@Autowired
	private MongoApi api;

	@Autowired
	private Convert convert;

	@Autowired
	private SessionContext sessionContext;
	
	public void search(MongoSession session, NodeSearchRequest req, NodeSearchResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		int MAX_NODES = 100;
		SubNode searchRoot = api.getNode(session, req.getNodeId());

		String searchText = req.getSearchText();
		if (searchText != null && searchText.length() > 0) {
			searchText = searchText.toLowerCase();
		}

		List<NodeInfo> searchResults = new LinkedList<NodeInfo>();
		res.setSearchResults(searchResults);
		int counter = 0;

		for (SubNode node : api.searchSubGraph(session, searchRoot, searchText, req.getSortField(), MAX_NODES)) {
			NodeInfo info = convert.convertToNodeInfo(sessionContext, session, node, true, true, false);
			searchResults.add(info);
			if (counter++ > MAX_NODES) {
				break;
			}
		}
		res.setSuccess(true);
		log.debug("search results count: " + counter);
	}

	// /*
	// * Searches for all nodes having name=rep:policy, and returns a list of the parent nodes of
	// all
	// * those nodes, because those parent nodes are the actual nodes being shared.
	// */
	// public void getSharedNodes(Session session, GetSharedNodesRequest req, GetSharedNodesResponse
	// res) {
	// try {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	// String userRootPath = sessionContext.getRootRefInfo().getPath();
	//
	// int MAX_NODES = 100;
	// Node searchRoot = JcrUtil.findNode(session, req.getNodeId());
	//
	// QueryManager qm = session.getWorkspace().getQueryManager();
	// String absPath = searchRoot.getPath();
	//
	// StringBuilder queryStr = new StringBuilder();
	// queryStr.append("SELECT * from [nt:base] AS t ");
	//
	// int whereCount = 0;
	// if (!absPath.equals("/")) {
	// if (whereCount == 0) {
	// queryStr.append(" WHERE ");
	// }
	// whereCount++;
	// queryStr.append("ISDESCENDANTNODE([");
	// queryStr.append(absPath);
	// queryStr.append("])");
	// }
	//
	// if (whereCount == 0) {
	// queryStr.append(" WHERE ");
	// }
	// else
	// /*
	// * To search ALL properties you can put 't.*' instead of 't.[jcr:content]' below.
	// */
	// if (whereCount > 0) {
	// queryStr.append(" AND ");
	// }
	// whereCount++;
	//
	// queryStr.append("NAME() = 'rep:policy'");
	//
	// Query q = qm.createQuery(queryStr.toString(), Query.JCR_SQL2);
	// QueryResult r = q.execute();
	// NodeIterator nodes = r.getNodes();
	// int counter = 0;
	// List<NodeInfo> searchResults = new LinkedList<NodeInfo>();
	// res.setSearchResults(searchResults);
	//
	// while (nodes.hasNext()) {
	// Node node = nodes.nextNode();
	// Node parentNode = node.getParent();
	//
	// String path = parentNode.getPath();
	// /*
	// * If we encounter this user's root node, then ignore it. We don't consider this a
	// * 'shared' node that the user ever needs to see as shared.
	// */
	// if (path.equals(userRootPath)) {
	// continue;
	// }
	//
	// searchResults.add(convert.convertToNodeInfo(sessionContext, session, parentNode, true, true,
	// false));
	// if (counter++ > MAX_NODES) {
	// break;
	// }
	// }
	// res.setSuccess(true);
	// log.debug("search results count: " + counter);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * The 'contains' function has special escaping requirement:
	// *
	// * https://docs.adobe.com/docs/en/spec/jcr/1.0/6.6.5.2_jcr_contains_Function.html
	// */
	// private String escapeQueryStringForContains(String query) {
	//// return query.replace("\\", "\\\\") //
	//// .replace("'", "\\'") //
	//// .replace("\"", "\\\"") //
	//// .replace("-", "\\-");
	//
	// //I ended up deciding just to let user enter any command string and just ignore single quotes
	// in their input.
	// return query.replace("'", "");
	// }
	//
	// private String escapeQueryStringForLike(String query) {
	// return query.replace("'", "");
	// }
}
