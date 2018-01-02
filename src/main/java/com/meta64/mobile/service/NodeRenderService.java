package com.meta64.mobile.service;

import java.awt.Dialog;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeName;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.AnonPageLoadRequest;
import com.meta64.mobile.request.InitNodeEditRequest;
import com.meta64.mobile.request.RenderNodeRequest;
import com.meta64.mobile.response.AnonPageLoadResponse;
import com.meta64.mobile.response.InitNodeEditResponse;
import com.meta64.mobile.response.RenderNodeResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.XString;

import javafx.scene.chart.PieChart.Data;

/**
 * Service for rendering the content of a page. The actual page is not rendered
 * on the server side. What we are really doing here is generating a list of
 * POJOS that get converted to JSON and sent to the client. But regardless of
 * format this is the primary service for pulling content up for rendering the
 * pages on the client as the user browses around on the tree.
 */
@Component
public class NodeRenderService {
	private static final Logger log = LoggerFactory.getLogger(NodeRenderService.class);

	@Autowired
	private SubNodeUtil subNodeUtil;

	@Autowired
	private MongoApi api;

	@Autowired
	private AppProp appProp;

	@Autowired
	private Convert convert;

	@Autowired
	private SessionContext sessionContext;

	/* Note: this MUST match nav.ROWS_PER_PAGE variable in TypeScript */
	private static int ROWS_PER_PAGE = 25;

	/*
	 * This is the call that gets all the data to show on a page. Whenever user is
	 * browsing to a new page, this method gets called once per page and retrieves
	 * all the data for that page.
	 */
	public void renderNode(MongoSession session, RenderNodeRequest req, RenderNodeResponse res,
			boolean allowRootAutoPrefix) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		res.setOffsetOfNodeFound(-1);

		String targetId = req.getNodeId();

		log.trace("renderNode targetId:" + targetId);
		SubNode node = api.getNode(session, targetId);

		/*
		 * if the node was a path type and was not found then try with the "/root"
		 * prefix before giving up. We allow ID parameters to omit the leading "/root"
		 * part of the path for shortening the path just for user convenience.
		 */
		if (node == null && targetId.startsWith("/") && allowRootAutoPrefix) {
			targetId = "/" + NodeName.ROOT + "/" + NodeName.USER + targetId;
			node = api.getNode(session, targetId);
		}

		if (node == null) {
			res.setNoDataResponse("Node not found: " + targetId);
			return;
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean advancedMode = userPreferences != null ? userPreferences.isAdvancedMode() : false;
		boolean showMetaData = userPreferences != null ? userPreferences.isShowMetaData() : false;

		/*
		 * If this is true it means we need to keep scanning child nodes until we find
		 * the targetId, so we can make that one be the first of the search results to
		 * display, and set that offset upon return. During the scan once the node is
		 * found, we set this scanToNode var back to false, so it represents always if
		 * we're still scanning or not.
		 */
		boolean scanToNode = false;
		String scanToPath = node.getPath();

		if (req.isRenderParentIfLeaf() && !subNodeUtil.hasDisplayableNodes(advancedMode, node)) {
			res.setDisplayedParent(true);
			req.setUpLevel(1);
		}

		int levelsUpRemaining = req.getUpLevel();
		if (levelsUpRemaining > 0) {
			scanToNode = true;
			while (node != null && levelsUpRemaining > 0) {
				node = api.getParent(session, node);
				log.trace("   upLevel to nodeid: " + node.getPath());
				levelsUpRemaining--;
			}
		}

		// this isn't fully working/tested yet, but partially does work.
		boolean isWebPage = node.getBooleanProp(NodeProp.WEB_PAGE);
		NodeInfo nodeInfo = processRenderNode(session, req, res, node, scanToNode, scanToPath, isWebPage, 0, 0);
		res.setNode(nodeInfo);
	}

	private NodeInfo processRenderNode(MongoSession session, RenderNodeRequest req, RenderNodeResponse res,
			final SubNode node, boolean scanToNode, String scanToPath, boolean isWebPage, int ordinal, int level) {

		// log.trace("RENDER: " + XString.prettyPrint(node) + " ordinal=" + ordinal + "
		// level=" + level);
		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, true, true, false, ordinal);

		/*
		 * If we are not processing a webpage, the we don't recurse deep into the tree
		 * for rendering
		 */
		// Commenting. I think I ended up abandoning Polymer before the 'isWebPage'
		// stuff was fully tested. Need to retest this stuff. todo-0
		if (!isWebPage && level > 0) {
			return nodeInfo;
		}

		/*
		 * If we are scanning to a node we know we need to start from zero offset, or
		 * else we use the offset passed in
		 */
		int offset = isWebPage ? 0 : (scanToNode ? 0 : req.getOffset());

		/*
		 * load a LARGE number (todo-0: what should this large number be, 1000?) if we
		 * are scanning for a specific node and we don't know what it's actual offset is
		 */
		int queryLimit = (isWebPage || scanToNode) ? 1000 : offset + ROWS_PER_PAGE + 1;

		/*
		 * we request ROWS_PER_PAGE+1, because that is enough to trigger 'endReached'
		 * logic to be set correctly
		 */
		Iterable<SubNode> nodeIter = api.getChildren(session, node, true, queryLimit);
		Iterator<SubNode> iterator = nodeIter.iterator();

		int idx = 0, count = 0, idxOfNodeFound = -1;
		boolean endReached = false;

		if (req.isGoToLastPage()) {
			// todo-1: fix
			throw new RuntimeException("No ability to go to last page yet in new mongo api.");
			// offset = (int) nodeIter.getSize() - ROWS_PER_PAGE;
			// if (offset < 0) {
			// offset = 0;
			// }
			// res.setOffsetOfNodeFound(offset);
		}

		/*
		 * Calling 'skip' here technically violates the fact that
		 * nodeVisibleInSimpleMode() can return false for some nodes, but because of the
		 * performance boost it offers i'm doing it anyway. I don't think skipping to
		 * far or too little by one or two will ever be a noticeable issue in the
		 * paginating so this should be fine, because there will be a very small number
		 * of nodes that are not visible to the user, so I can't think of a pathological
		 * case here. Just noting that this IS an imperfection/flaw.
		 */
		if (!scanToNode && offset > 0) {
			idx = api.skip(iterator, offset);
		}

		List<SubNode> slidingWindow = null;

		/*
		 * If we are scanning for a specific node, and starting at zero offset, then we
		 * need to be capturing all the nodes as we go, in a sliding window, so that in
		 * case we find this node on the first page then we can use the slidingWindow
		 * nodes to build the entire first page, because we will need to send back these
		 * nodes starting from the first one.
		 */
		if (offset == 0 && scanToNode) {
			slidingWindow = new LinkedList<SubNode>();
		}

		/*
		 * Main loop to keep reading nodes from the database until we have enough to
		 * render the page
		 */
		while (true) {
			if (!iterator.hasNext()) {
				endReached = true;
				break;
			}
			SubNode n = iterator.next();

			idx++;
			if (idx > offset) {

				if (scanToNode) {
					String testPath = n.getPath();

					/*
					 * If this is the node we are scanning for turn off scan mode, but record its
					 * index position
					 */
					if (testPath.equals(scanToPath)) {
						scanToNode = false;

						/*
						 * If we found our target node, and it's on the first page, then we don't need
						 * to set idxOfNodeFound, but just leave it unset, and we need to load in the
						 * nodes we had collected so far, before continuing
						 */
						if (idx <= ROWS_PER_PAGE && slidingWindow != null) {

							/* loop over all our precached nodes */
							for (SubNode sn : slidingWindow) {
								count++;

								if (nodeInfo.getChildren() == null) {
									nodeInfo.setChildren(new LinkedList<NodeInfo>());
								}

								// log.debug("renderNode DUMP[count=" + count + " idx=" +
								// String.valueOf(idx) + " logicalOrdinal=" + String.valueOf(offset
								// + count) + "]: "
								// + XString.prettyPrint(node));
								// nodeInfo.getChildren().add(convert.convertToNodeInfo(sessionContext,
								// session, sn, true, true, false, offset + count));
								nodeInfo.getChildren().add(processRenderNode(session, req, res, sn, false, null,
										isWebPage, offset + count, level + 1));
							}
						} else {
							idxOfNodeFound = idx;
						}
					}
					/*
					 * else, we can continue while loop after we incremented 'idx'. Nothing else to
					 * do on this iteration/node
					 */
					else {
						/* Are we still within the bounds of the first page ? */
						if (idx <= ROWS_PER_PAGE && slidingWindow != null) {
							slidingWindow.add(n);
						}

						continue;
					}
				}

				count++;

				if (nodeInfo.getChildren() == null) {
					nodeInfo.setChildren(new LinkedList<NodeInfo>());
				}
				// log.debug("renderNode DUMP[count=" + count + " idx=" + String.valueOf(idx) +
				// "
				// logicalOrdinal=" + String.valueOf(offset + count) + "]: "
				// + XString.prettyPrint(node));
				// nodeInfo.getChildren().add(convert.convertToNodeInfo(sessionContext, session,
				// n,
				// true, true, false, offset + count));
				//
				// if (isWebPage) {
				// processRenderNode(session, req, res, n, n.getPath(), scanToNode, isWebPage);
				// }
				nodeInfo.getChildren().add(
						processRenderNode(session, req, res, n, false, null, isWebPage, offset + count, level + 1));

				if (!isWebPage && count >= ROWS_PER_PAGE) {
					if (!iterator.hasNext()) {
						endReached = true;
						break;
					}
					SubNode finalNode = iterator.next();

					/* break out of while loop, we have enough children to send back */
					break;
				}
			}
		}

		if (idx == 0) {
			log.trace("no child nodes found.");
		}

		if (idxOfNodeFound != -1) {
			res.setOffsetOfNodeFound(idxOfNodeFound);
		}
		res.setEndReached(endReached);
		return nodeInfo;
	}

	public void initNodeEdit(MongoSession session, InitNodeEditRequest req, InitNodeEditResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);

		if (node == null) {
			res.setMessage("Node not found.");
			res.setSuccess(false);
			return;
		}

		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, false, false, true, -1);
		res.setNodeInfo(nodeInfo);
		res.setSuccess(true);
	}

	/*
	 * There is a system defined way for admins to specify what node should be
	 * displayed in the browser when a non-logged in user (i.e. anonymouse user) is
	 * browsing the site, and this method retrieves that page data.
	 */
	public void anonPageLoad(MongoSession session, AnonPageLoadRequest req, AnonPageLoadResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		boolean allowRootAutoPrefix = false;
		String id = null;
		if (id == null) {
			if (!req.isIgnoreUrl() && sessionContext.getUrlId() != null) {
				id = sessionContext.getUrlId();
				allowRootAutoPrefix = true;
			} else {
				id = appProp.getUserLandingPageNode();
			}
		}

		if (!StringUtils.isEmpty(id)) {
			RenderNodeResponse renderNodeRes = new RenderNodeResponse();
			RenderNodeRequest renderNodeReq = new RenderNodeRequest();

			/*
			 * if user specified an ID= parameter on the url, we display that immediately,
			 * or else we display the node that the admin has configured to be the default
			 * landing page node.
			 */
			renderNodeReq.setNodeId(id);
			renderNode(session, renderNodeReq, renderNodeRes, allowRootAutoPrefix);
			res.setRenderNodeResponse(renderNodeRes);
			res.setSuccess(true);
		} else {
			res.setContent("No content available.");
			res.setSuccess(true);
		}
	}
}
