package com.meta64.mobile.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.DeleteNodesRequest;
import com.meta64.mobile.request.MoveNodesRequest;
import com.meta64.mobile.request.SetNodePositionRequest;
import com.meta64.mobile.response.DeleteNodesResponse;
import com.meta64.mobile.response.MoveNodesResponse;
import com.meta64.mobile.response.SetNodePositionResponse;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for controlling the positions (ordinals) of nodes relative to their parents and/or moving
 * nodes to locate them under a different parent. This is similar type of functionality to
 * cut-and-paste in file systems. Currently there is no way to 'clone' or copy nodes, but user can
 * move any existing nodes they have to any new location they want, subject to security constraints
 * of course.
 */
@Component
public class NodeMoveService {
	private static final Logger log = LoggerFactory.getLogger(NodeMoveService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private RunAsMongoAdmin adminRunner;

	/*
	 * Moves the the node to a new ordinal/position location (relative to parent)
	 *
	 * We allow the special case of req.siblingId="[topNode]" and that indicates move the node to be
	 * the first node under its parent.
	 */
	public void setNodePosition(MongoSession session, SetNodePositionRequest req, SetNodePositionResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();

		SubNode node = api.getNode(session, nodeId);
		if (node == null) {
			throw new RuntimeException("Node not found: " + nodeId);
		}

		if ("up".equals(req.getTargetName())) {
			moveNodeUp(session, node);
		}
		else if ("down".equals(req.getTargetName())) {
			moveNodeDown(session, node);
		}
		else if ("top".equals(req.getTargetName())) {
			moveNodeToTop(session, node);
		}
		else if ("bottom".equals(req.getTargetName())) {
			moveNodeToBottom(session, node);
		}
		else {
			throw new RuntimeException("Invalid target type: " + req.getTargetName());
		}

		res.setSuccess(true);
	}

	public void moveNodeUp(MongoSession session, SubNode node) {
		SubNode nodeAbove = api.getSiblingAbove(session, node);
		if (nodeAbove != null) {
			Long saveOrdinal = nodeAbove.getOrdinal();
			nodeAbove.setOrdinal(node.getOrdinal());
			node.setOrdinal(saveOrdinal);
		}
		api.saveSession(session);
	}

	public void moveNodeDown(MongoSession session, SubNode node) {
		SubNode nodeBelow = api.getSiblingBelow(session, node);
		if (nodeBelow != null) {
			Long saveOrdinal = nodeBelow.getOrdinal();
			nodeBelow.setOrdinal(node.getOrdinal());
			node.setOrdinal(saveOrdinal);
		}
		api.saveSession(session);
	}

	public void moveNodeToTop(MongoSession session, SubNode node) {
		SubNode parentNode = api.getParent(session, node);
		if (parentNode == null) {
			return;
		}
		api.insertOrdinal(session, parentNode, 0L);

		// todo-1: there is a slight ineffieiency here in that 'node' does end up getting saved
		// both as part of the insertOrdinal, and also then with the setting of it to zero. Will be
		// easy to fix when I get to it, but is low priority for now.
		api.saveSession(session);

		node.setOrdinal(0L);
		api.saveSession(session);
	}

	public void moveNodeToBottom(MongoSession session, SubNode node) {
		SubNode parentNode = api.getParent(session, node);
		if (parentNode == null) {
			return;
		}
		long ordinal = api.getMaxChildOrdinal(session, parentNode) + 1L;
		node.setOrdinal(ordinal);
		parentNode.setMaxChildOrdinal(ordinal);
		api.saveSession(session);
	}

	/*
	 * Deletes the set of nodes specified in the request
	 */
	public void deleteNodes(MongoSession session, DeleteNodesRequest req, DeleteNodesResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		for (String nodeId : req.getNodeIds()) {
			deleteNode(session, nodeId);
		}

		// no need to save session after deletes.
		// api.saveSession(session);
		res.setSuccess(true);
	}

	private void deleteNode(MongoSession session, String nodeId) {
		SubNode node = api.getNode(session, nodeId);
		api.delete(session, node);
	}

	/*
	 * Moves a set of nodes to a new location, underneath (i.e. children of) the target node
	 * specified.
	 */
	public void moveNodes(MongoSession session, MoveNodesRequest req, MoveNodesResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		moveNodesInternal(session, req, res);
	}

	private void moveNodesInternal(MongoSession session, MoveNodesRequest req, MoveNodesResponse res) {
		String targetId = req.getTargetNodeId();
		log.debug("moveNodesInternal: targetId=" + targetId);
		SubNode targetNode = api.getNode(session, targetId);
		api.authRequireOwnerOfNode(session, targetNode);
		String targetPath = targetNode.getPath();
		log.debug("targetPath: " + targetPath);
		Long curTargetOrdinal = targetNode.getMaxChildOrdinal() == null ? 0 : targetNode.getMaxChildOrdinal();

		for (String nodeId : req.getNodeIds()) {
			log.debug("Moving ID: " + nodeId);
			try {
				SubNode node = api.getNode(session, nodeId);
				api.authRequireOwnerOfNode(session, node);
				changePathOfSubGraph(session, node, targetPath);

				node.setPath(targetPath + "/" + node.getName());
				node.setOrdinal(curTargetOrdinal);
				node.setDisableParentCheck(true);

				curTargetOrdinal++;
			}
			catch (Exception e) {
				// silently ignore if node cannot be found.
			}
		}
		api.saveSession(session);
		res.setSuccess(true);
	}

	private void changePathOfSubGraph(MongoSession session, SubNode graphRoot, String newPathPrefix) {
		String originalPath = graphRoot.getPath();
		log.debug("originalPath (graphRoot.path): " + originalPath);
		int originalParentPathLen = graphRoot.getParentPath().length();

		for (SubNode node : api.getSubGraph(session, graphRoot)) {
			if (!node.getPath().startsWith(originalPath)) {
				throw new RuntimeException("Algorighm failure: path " + node.getPath() + " should have started with " + originalPath);
			}
			log.debug("PROCESSING MOVE: oldPath: " + node.getPath());

			String newPath = newPathPrefix + "/" + node.getPath().substring(originalParentPathLen + 1);
			log.debug("    newPath: " + newPath);
			node.setPath(newPath);
			node.setDisableParentCheck(true);
		}
	}
}
