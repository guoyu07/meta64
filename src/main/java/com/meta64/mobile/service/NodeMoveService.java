package com.meta64.mobile.service;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.DeleteNodesRequest;
import com.meta64.mobile.request.MoveNodesRequest;
import com.meta64.mobile.request.SetNodePositionRequest;
import com.meta64.mobile.response.DeleteNodesResponse;
import com.meta64.mobile.response.MoveNodesResponse;
import com.meta64.mobile.response.SetNodePositionResponse;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.VarUtil;

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
	private OakRepository oak;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	/*
	 * Ensures this node is the first child under its parent, moving it and does nothing if this
	 * node already IS the first child.
	 */
	public void moveNodeToTop(Session session, Node node, boolean immediateSave, boolean isSessionThread) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		Node parentNode = node.getParent();
		Node firstChild = JcrUtil.getFirstChild(session, parentNode);
		if (firstChild.getIdentifier().equals(node.getIdentifier())) {
			return;
		}
		setNodePosition(session, parentNode, node.getName(), firstChild.getName(), immediateSave, isSessionThread);
	}

	/*
	 * Moves the the node to a new ordinal/position location (relative to parent)
	 * 
	 * We allow the special case of req.siblingId="[topNode]" and that indicates move the node to be
	 * the first node under its parent.
	 */
	public void setNodePosition(Session session, SetNodePositionRequest req, SetNodePositionResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		String parentNodeId = req.getParentNodeId();
		String nodeId = req.getNodeId();
		String siblingId = req.getSiblingId();

		Node parentNode = JcrUtil.findNode(session, parentNodeId);

		nodeId = translateNodeName(session, parentNode, siblingId, nodeId);
		siblingId = translateNodeName(session, parentNode, nodeId, siblingId);

		setNodePosition(session, parentNode, nodeId, siblingId, true, true);

		res.setSuccess(true);
	}

	public String translateNodeName(Session session, Node parentNode, String nodeId, String translateName) throws Exception {
		if (translateName==null) return null;
		if (translateName.equalsIgnoreCase("[nodeBelow]")) {
			Node nodeBelow = JcrUtil.getNodeBelow(session, parentNode, null, nodeId);
			if (nodeBelow == null) {
				throw new Exception("no next sibling found.");
			}
			translateName = nodeBelow.getName();
		}
		else if (translateName.equalsIgnoreCase("[nodeAbove]")) {
			Node nodeAbove = JcrUtil.getNodeAbove(session, parentNode, null, nodeId);
			if (nodeAbove == null) {
				throw new Exception("no previous sibling found.");
			}
			translateName = nodeAbove.getName();
		}
		else if (translateName.equalsIgnoreCase("[topNode]")) {
			Node topNode = JcrUtil.getFirstChild(session, parentNode);
			if (topNode == null) {
				throw new Exception("no first child found under parent node.");
			}
			translateName = topNode.getName();
		}
		return translateName;
	}
	
	private void setNodePosition(Session session, Node parentNode, String nodePath, String siblingPath, boolean immediateSave, boolean isSessionThread) throws Exception {
		String parentPath = parentNode.getPath() + "/";

		/*
		 * if we are moving nodes around on the root, the root belongs to admin and needs special
		 * access (adminRunner)
		 */
		if (isSessionThread && parentPath.equals("/" + JcrName.ROOT + "/" + sessionContext.getUserName() + "/")) {
			adminRunner.run((Session adminSession) -> {
				Node parentNode2 = JcrUtil.findNode(adminSession, parentNode.getIdentifier());
				JcrUtil.checkWriteAuthorized(parentNode2, adminSession.getUserID());
				parentNode2.orderBefore(nodePath, siblingPath);
				if (immediateSave) {
					adminSession.save();
				}
			});
		}
		else {
			JcrUtil.checkWriteAuthorized(parentNode, session.getUserID());
			parentNode.orderBefore(nodePath, siblingPath);
			if (immediateSave) {
				session.save();
			}
		}
	}

	/*
	 * Deletes the set of nodes specified in the request
	 */
	public void deleteNodes(Session session, DeleteNodesRequest req, DeleteNodesResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		ValContainer<Boolean> switchedToAdminSession = new ValContainer<Boolean>();

		for (String nodeId : req.getNodeIds()) {
			deleteNode(session, nodeId, switchedToAdminSession);

			/* did we switch to admin session ? */
			if (VarUtil.safeBooleanVal(switchedToAdminSession.getVal())) {
				break;
			}
		}

		/*
		 * This is kinda ugly but the logic is that if 'deleteNode' conducted the delete as the
		 * admin session then we expect it to also have done a save, so this 'session' in this local
		 * scope is now logged out and unuable actually.
		 */
		if (!VarUtil.safeBooleanVal(switchedToAdminSession.getVal())) {
			session.save();
		}
		res.setSuccess(true);
	}

	/*
	 * Deletes a single node by nodeId
	 */
	private void deleteNode(Session session, String nodeId, ValContainer<Boolean> switchedToAdminSession) throws Exception {
		Node node = JcrUtil.findNode(session, nodeId);
		String commentBy = JcrUtil.safeGetStringProp(node, JcrProp.COMMENT_BY);

		/*
		 * Detect if this node is a comment we "own" (although true security rules make it belong to
		 * admin user) then we should be able to delete it, so we execute the delete under an
		 * 'AdminSession'. Also now that we have switched sessions, we set that in the return value,
		 * so the caller can always, stop processing after this happens. Meaning essentialy only
		 * *one* comment node can be deleted at a time unless you are admin user.
		 */
		if (session.getUserID().equals(commentBy)) {
			session.logout();
			session = oak.newAdminSession();
			node = JcrUtil.findNode(session, nodeId);

			/* notify caller what just happened */
			if (switchedToAdminSession != null) {
				switchedToAdminSession.setVal(true);
			}
			node.remove();
			session.save();
		}
		else {
			JcrUtil.checkWriteAuthorized(node, session.getUserID());
			node.remove();
		}
	}

	/*
	 * Moves a set of nodes to a new location, underneath (i.e. children of) the target node
	 * specified.
	 */
	public void moveNodes(Session session, MoveNodesRequest req, MoveNodesResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String targetId = req.getTargetNodeId();
		Node targetNode = JcrUtil.findNode(session, targetId);
		String targetPath = targetNode.getPath() + "/";

		/*
		 * If the user is moving nodes to his root note, that root node will be owned by admin so we
		 * must run the processing using adminRunner session
		 */
		if (targetPath.equals("/" + JcrName.ROOT + "/" + sessionContext.getUserName() + "/")) {
			adminRunner.run((Session adminSession) -> {
				moveNodesInternal(adminSession, req, res);
			});
		}
		/*
		 * Otherwise this user is just moving a node somewhere other than their root and we can use
		 * their own actual session
		 */
		else {
			moveNodesInternal(session, req, res);
		}
	}

	/* Uses session passed unmodified */
	private void moveNodesInternal(Session session, MoveNodesRequest req, MoveNodesResponse res) throws Exception {

		String targetId = req.getTargetNodeId();
		Node targetNode = JcrUtil.findNode(session, targetId);
		String targetPath = targetNode.getPath() + "/";

		for (String nodeId : req.getNodeIds()) {
			// log.debug("Moving ID: " + nodeId);
			try {
				Node node = JcrUtil.findNode(session, nodeId);
				JcrUtil.checkWriteAuthorized(node, session.getUserID());
				/*
				 * This code moves the copied nodes to the bottom of child list underneath the
				 * target node (i.e. targetNode being the parent) for the new node locations.
				 */

				String srcPath = node.getPath();
				String dstPath = targetPath + node.getName();
				// log.debug("MOVE: srcPath[" + srcPath + "] targetPath[" +
				// dstPath + "]");
				session.move(srcPath, dstPath);
			}
			catch (Exception e) {
				// silently ignore if node cannot be found.
			}
		}
		session.save();
		res.setSuccess(true);
	}
}
