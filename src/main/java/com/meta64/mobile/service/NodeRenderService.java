package com.meta64.mobile.service;

import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeType;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.AnonPageLoadRequest;
import com.meta64.mobile.request.ExpandAbbreviatedNodeRequest;
import com.meta64.mobile.request.InitNodeEditRequest;
import com.meta64.mobile.request.RenderNodeRequest;
import com.meta64.mobile.response.AnonPageLoadResponse;
import com.meta64.mobile.response.ExpandAbbreviatedNodeResponse;
import com.meta64.mobile.response.InitNodeEditResponse;
import com.meta64.mobile.response.RenderNodeResponse;
import com.meta64.mobile.user.UserSettingsDaemon;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for rendering the content of a page. The actual page is not rendered on the server side.
 * What we are really doing here is generating a list of POJOS that get converted to JSON and sent
 * to the client. But regardless of format this is the primary service for pulling content up for
 * rendering the pages on the client as the user browses around on the tree.
 */
@Component
public class NodeRenderService {
	private static final Logger log = LoggerFactory.getLogger(NodeRenderService.class);

	@Value("${anonUserLandingPageNode}")
	private String anonUserLandingPageNode;

	@Autowired
	private Convert convert;

	@Autowired
	private UserSettingsDaemon userSettingsDaemon;

	@Autowired
	private SessionContext sessionContext;

	/* Note: this should match nav.ROWS_PER_PAGE variable in TypeScript */
	private static int nodesPerPage = 25;

	/*
	 * This is the call that gets all the data to show on a page. Whenever user is browsing to a new
	 * page, this method gets called once per page and retrieves all the data for that page.
	 */
	public void renderNode(Session session, RenderNodeRequest req, RenderNodeResponse res, boolean allowRootAutoPrefix) throws Exception {

		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		List<NodeInfo> children = new LinkedList<NodeInfo>();
		res.setChildren(children);
		String targetId = req.getNodeId();

		log.trace("renderNode targetId:" + targetId);
		Node node = JcrUtil.safeFindNode(session, targetId);

		/*
		 * if the node was a path type and was not found then try with the "/root" prefix before
		 * giving up. We allow ID parameters to omit the leading "/root" part of the path for
		 * shortening the path just for end user convenience.
		 */
		if (node == null && targetId.startsWith("/") && allowRootAutoPrefix) {
			targetId = "/root" + targetId;
			node = JcrUtil.safeFindNode(session, targetId);
		}

		if (node == null) {
			res.setMessage("Node not found.");
			res.setSuccess(false);
			return;
		}
		log.trace("found node:" + targetId);

		String path = node.getPath();
		userSettingsDaemon.setSettingVal(sessionContext.getUserName(), JcrProp.USER_PREF_LAST_NODE, path);

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean advancedMode = userPreferences != null ? userPreferences.isAdvancedMode() : false;
		// boolean showMetaData = userPreferences != null ? userPreferences.isShowMetaData() :
		// false;

		/*
		 * If this is true it means we need to keep scanning child nodes until we find the targetId,
		 * so we can make that one be the first of the search results to display, and set that
		 * offset upon return. During the scan once the node is found, we do set this scanToNode var
		 * back to false, so it represents always if we're still scanning or not.
		 */
		boolean scanToNode = false;

		if (req.isRenderParentIfLeaf() && !JcrUtil.hasDisplayableNodes(advancedMode, node)) {
			res.setDisplayedParent(true);
			req.setUpLevel(1);
		}

		int levelsUpRemaining = req.getUpLevel();
		if (levelsUpRemaining > 0) {
			scanToNode = true;
			while (node != null && levelsUpRemaining > 0) {
				node = node.getParent();
				log.trace("   upLevel to nodeid: " + node.getPath());
				levelsUpRemaining--;
			}
		}
		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, true, true);
		NodeType type = JcrUtil.safeGetPrimaryNodeType(node);
		boolean ordered = type == null ? false : type.hasOrderableChildNodes();
		nodeInfo.setChildrenOrdered(ordered);
		// log.debug("Primary type: " + type.getName() + " childrenOrdered=" +ordered);
		res.setNode(nodeInfo);

		int offset = req.getOffset();
		NodeIterator nodeIter = node.getNodes();
		int idx = 0, count = 0, idxOfNodeFound = -1;
		boolean endReached = false;
		try {
			while (true) {
				Node n = nodeIter.nextNode();

				// Filter on server now too
				if (advancedMode || JcrUtil.nodeVisibleInSimpleMode(node)) {
					idx++;

					if (idx > offset) {

						if (scanToNode) {
							String testPath = n.getPath();

							/*
							 * If this is the node we are scanning for turn off scan mode, but
							 * record its index position
							 */
							if (testPath.equals(path)) {
								scanToNode = false;
								idxOfNodeFound = idx;
							}
							/*
							 * else, we can continue while loop after we incremented 'idx'. Nothing
							 * else to do on this iteration/node
							 */
							else {
								continue;
							}
						}

						count++;
						children.add(convert.convertToNodeInfo(sessionContext, session, n, true, true));

						if (count >= nodesPerPage) {
							try {
								Node finalNode = nodeIter.nextNode();
								if (!advancedMode && !JcrUtil.nodeVisibleInSimpleMode(finalNode)) {
									endReached = true;
								}
							}
							catch (Exception e) {
								endReached = true;
								// we don't rethrow or log this exception. It's normal flow
							}

							/* break out of while loop, we have enough children to send back */
							break;
						}
					}

					// log.trace(" node[" + nodeCount + "] path: " + n.getPath());
				}
				else {
					log.trace("    MODE-REJECT node[" + idx + "] path: " + n.getPath());
				}
			}
		}
		catch (NoSuchElementException ex) {
			endReached = true;
			// not an error. Normal iterator end condition.
		}

		if (idx == 0) {
			log.trace("    no child nodes found.");
		}

		if (idxOfNodeFound!=-1) {
			res.setOffsetOfNodeFound(idxOfNodeFound);
		}
		res.setEndReached(endReached);
	}

	public void initNodeEdit(Session session, InitNodeEditRequest req, InitNodeEditResponse res) throws Exception {

		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeId = req.getNodeId();
		Node node = JcrUtil.safeFindNode(session, nodeId);

		if (node == null) {
			res.setMessage("Node not found.");
			res.setSuccess(false);
			return;
		}

		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, false, false);
		res.setNodeInfo(nodeInfo);
		res.setSuccess(true);
	}

	public void expandAbbreviatedNode(Session session, ExpandAbbreviatedNodeRequest req, ExpandAbbreviatedNodeResponse res) throws Exception {

		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeId = req.getNodeId();
		Node node = JcrUtil.safeFindNode(session, nodeId);

		if (node == null) {
			res.setMessage("Node not found.");
			res.setSuccess(false);
			return;
		}

		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, true, false);
		res.setNodeInfo(nodeInfo);
		res.setSuccess(true);
	}

	/*
	 * There is a system defined way for admins to specify what node should be displayed in the
	 * browser when a non-logged in user (i.e. anonymouse user) is browsing the site, and this
	 * method retrieves that page data.
	 */
	public void anonPageLoad(Session session, AnonPageLoadRequest req, AnonPageLoadResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		boolean allowRootAutoPrefix = false;
		String id = null;
		if (id == null) {
			if (!req.isIgnoreUrl() && sessionContext.getUrlId() != null) {
				id = sessionContext.getUrlId();
				allowRootAutoPrefix = true;
			}
			else {
				id = anonUserLandingPageNode;
			}
		}

		if (!StringUtils.isEmpty(id)) {
			RenderNodeResponse renderNodeRes = new RenderNodeResponse();
			RenderNodeRequest renderNodeReq = new RenderNodeRequest();

			/*
			 * if user specified an ID= parameter on the url, we display that immediately, or else
			 * we display the node that the admin has configured to be the default landing page
			 * node.
			 */
			renderNodeReq.setNodeId(id);
			renderNode(session, renderNodeReq, renderNodeRes, allowRootAutoPrefix);
			res.setRenderNodeResponse(renderNodeRes);
		}
		else {
			res.setContent("No content available.");
		}

		res.setSuccess(true);
	}
}
