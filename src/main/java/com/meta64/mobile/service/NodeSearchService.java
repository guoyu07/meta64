package com.meta64.mobile.service;

import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.request.GetSharedNodesRequest;
import com.meta64.mobile.request.NodeSearchRequest;
import com.meta64.mobile.response.GetSharedNodesResponse;
import com.meta64.mobile.response.NodeSearchResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
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

	private static boolean useLike = false;

	/*
	 * WARNING: Currently the useContains=true searching appears to successfully use Lucene
	 * fulltext, and useLike=true does NOT work
	 */
	private static boolean useContains = true;

	private static boolean searchAllProps = false;

	@Autowired
	private Convert convert;

	@Autowired
	private SessionContext sessionContext;

	/*
	 * Finds an exact property match under the specified node
	 */
	public Node findNodeByProperty(Session session, String parentPath, String propName, String propVal) {
		try {
			QueryManager qm = session.getWorkspace().getQueryManager();

			/*
			 * Note: This is a bad way to lookup a value that's expected to be an exact match!
			 */
			StringBuilder queryStr = new StringBuilder();
			queryStr.append("SELECT * from [nt:base] AS t WHERE ISDESCENDANTNODE([");
			queryStr.append(parentPath);
			queryStr.append("]) AND t.[" + propName + "]='");
			queryStr.append(propVal);
			queryStr.append("'");

			String qStr = queryStr.toString();
			log.debug("property query: " + qStr);
			Query q = qm.createQuery(qStr, Query.JCR_SQL2);
			QueryResult r = q.execute();
			NodeIterator nodes = r.getNodes();
			Node ret = null;
			if (nodes.hasNext()) {
				ret = nodes.nextNode();
			}

			log.debug(ret == null ? "Node not found." : "node found.");
			return ret;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	public Node findNodeByProperty_test(Session session, String parentPath, String propName, String propVal) {
		try {
			QueryManager qm = session.getWorkspace().getQueryManager();

			/*
			 * Note: This is a bad way to lookup a value that's expected to be an exact match!
			 */
			StringBuilder queryStr = new StringBuilder();
			queryStr.append("SELECT * from [nt:base] AS t WHERE ISDESCENDANTNODE([");
			queryStr.append(parentPath);
			queryStr.append("])");
			// queryStr.append("]) AND t.[" + propName + "]='");
			// queryStr.append(propVal);
			// queryStr.append("'");

			String qStr = queryStr.toString();
			log.debug("property query: " + qStr);
			Query q = qm.createQuery(qStr, Query.JCR_SQL2);
			QueryResult r = q.execute();
			NodeIterator nodes = r.getNodes();
			Node ret = null;
			while (nodes.hasNext()) {
				ret = nodes.nextNode();
				log.debug("   FOUND: path=" + ret.getPath());
			}

			log.debug(ret == null ? "Node not found." : "node found.");
			return ret;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/*
	 * see also: http://docs.jboss.org/jbossdna/0.7/manuals/reference/html/jcr-query-and-
	 * search.html https://wiki.magnolia-cms.com/display/WIKI/JCR+Query+Cheat+Sheet
	 */

	// see DescendantSearchTest
	public void search(Session session, NodeSearchRequest req, NodeSearchResponse res) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
			}
			int MAX_NODES = 100;
			Node searchRoot = JcrUtil.findNode(session, req.getNodeId());

			QueryManager qm = session.getWorkspace().getQueryManager();
			String absPath = searchRoot.getPath();

			StringBuilder queryStr = new StringBuilder();
			queryStr.append("SELECT * from [nt:base] AS t ");

			int whereCount = 0;
			if (!absPath.equals("/")) {
				if (whereCount == 0) {
					queryStr.append(" WHERE ");
				}
				whereCount++;
				queryStr.append("ISDESCENDANTNODE([");
				queryStr.append(absPath);
				queryStr.append("])");
			}

			String searchText = req.getSearchText();
			if (searchText != null && searchText.length() > 0) {
				searchText = searchText.toLowerCase();

				if (whereCount == 0) {
					queryStr.append(" WHERE ");
				}
				else
				/*
				 * To search ALL properties you can put 't.*' instead of 't.[jcr:content]' below.
				 */
				if (whereCount > 0) {
					queryStr.append(" AND ");
				}
				whereCount++;

				if (useContains && useLike) {
					throw ExUtil.newEx("oops. Like + Contains. Use one or the other, not both.");
				}

				// For now the general search can just be made to search all properties, and so we
				// are
				// ignoring searchProp
				String searchProp = "*"; // req.getSearchProp()

				if (useContains) {
					/*
					 * I noticed searching 2/12/2017 that contains doesn't work right without '*'.
					 * It does full word searches ONLY, without wildcard and so it's behaving like a
					 * LIKE clause, contrary to what you'd think since the function is named
					 * 'contains'. I'm adding '*' without researching for now, as a quick fix,
					 * unless user has already put in wildcard. (todo-1, read docs on 'contains'
					 * method)
					 */
					if (!searchText.contains("*")) {
						searchText = "*" + searchText + "*";
					}
					queryStr.append("contains(t.[");
					queryStr.append(searchProp);
					queryStr.append("], '");
					queryStr.append(escapeQueryString(searchText));
					queryStr.append("')");
				}

				/* Lucene doesn't work with this. Searching will be BRUTE FORCE. Don't do this. */
				if (useLike) {
					queryStr.append("lower(");

					if (searchAllProps) {
						queryStr.append("*");
					}
					else {
						queryStr.append("t.[");
						queryStr.append(searchProp);
						queryStr.append("]");
					}

					queryStr.append(") like '%");
					queryStr.append(escapeQueryString(searchText));
					queryStr.append("%'");
				}
			}

			if (!StringUtils.isEmpty(req.getSortField())) {
				queryStr.append(" ORDER BY [");
				queryStr.append(req.getSortField());
				queryStr.append("] " + req.getSortDir());
			}
			else {
				queryStr.append(" ORDER BY [");
				queryStr.append(JcrProp.LAST_MODIFIED);
				queryStr.append("] DESC");
			}

			log.debug("Search: " + queryStr.toString());

			Query q = qm.createQuery(queryStr.toString(), Query.JCR_SQL2);
			QueryResult r = q.execute();
			NodeIterator nodes = r.getNodes();
			int counter = 0;
			List<NodeInfo> searchResults = new LinkedList<NodeInfo>();
			res.setSearchResults(searchResults);

			while (nodes.hasNext()) {
				Node node = nodes.nextNode();
				Property lastModProp = JcrUtil.getProperty(node, JcrProp.LAST_MODIFIED);
				log.debug("NODE: lastModified: " + dateFormat.format(lastModProp.getDate().getTime()));
				NodeInfo info = convert.convertToNodeInfo(sessionContext, session, node, true, true, false);
				searchResults.add(info);
				if (counter++ > MAX_NODES) {
					break;
				}
			}
			res.setSuccess(true);
			log.debug("search results count: " + counter);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/*
	 * Searches for all nodes having name=rep:policy, and returns a list of the parent nodes of all
	 * those nodes, because those parent nodes are the actual nodes being shared.
	 */
	public void getSharedNodes(Session session, GetSharedNodesRequest req, GetSharedNodesResponse res) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
			}
			String userRootPath = sessionContext.getRootRefInfo().getPath();

			int MAX_NODES = 100;
			Node searchRoot = JcrUtil.findNode(session, req.getNodeId());

			QueryManager qm = session.getWorkspace().getQueryManager();
			String absPath = searchRoot.getPath();

			StringBuilder queryStr = new StringBuilder();
			queryStr.append("SELECT * from [nt:base] AS t ");

			int whereCount = 0;
			if (!absPath.equals("/")) {
				if (whereCount == 0) {
					queryStr.append(" WHERE ");
				}
				whereCount++;
				queryStr.append("ISDESCENDANTNODE([");
				queryStr.append(absPath);
				queryStr.append("])");
			}

			if (whereCount == 0) {
				queryStr.append(" WHERE ");
			}
			else
			/*
			 * To search ALL properties you can put 't.*' instead of 't.[jcr:content]' below.
			 */
			if (whereCount > 0) {
				queryStr.append(" AND ");
			}
			whereCount++;

			queryStr.append("NAME() = 'rep:policy'");

			Query q = qm.createQuery(queryStr.toString(), Query.JCR_SQL2);
			QueryResult r = q.execute();
			NodeIterator nodes = r.getNodes();
			int counter = 0;
			List<NodeInfo> searchResults = new LinkedList<NodeInfo>();
			res.setSearchResults(searchResults);

			while (nodes.hasNext()) {
				Node node = nodes.nextNode();
				Node parentNode = node.getParent();

				String path = parentNode.getPath();
				/*
				 * If we encounter this user's root node, then ignore it. We don't consider this a
				 * 'shared' node that the user ever needs to see as shared.
				 */
				if (path.equals(userRootPath)) {
					continue;
				}

				searchResults.add(convert.convertToNodeInfo(sessionContext, session, parentNode, true, true, false));
				if (counter++ > MAX_NODES) {
					break;
				}
			}
			res.setSuccess(true);
			log.debug("search results count: " + counter);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private String escapeQueryString(String query) {
		return query.replaceAll("'", "''");
	}
}
