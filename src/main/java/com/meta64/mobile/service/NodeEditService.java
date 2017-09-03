package com.meta64.mobile.service;

import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.mail.JcrOutboxMgr;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.PropertyInfo;
import com.meta64.mobile.mongo.CreateNodeLocation;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.request.CreateSubNodeRequest;
import com.meta64.mobile.request.DeletePropertyRequest;
import com.meta64.mobile.request.InsertNodeRequest;
import com.meta64.mobile.request.RenameNodeRequest;
import com.meta64.mobile.request.SaveNodeRequest;
import com.meta64.mobile.request.SavePropertyRequest;
import com.meta64.mobile.response.CreateSubNodeResponse;
import com.meta64.mobile.response.DeletePropertyResponse;
import com.meta64.mobile.response.InsertNodeResponse;
import com.meta64.mobile.response.RenameNodeResponse;
import com.meta64.mobile.response.SaveNodeResponse;
import com.meta64.mobile.response.SavePropertyResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for editing content of nodes. That is, this method updates property values of JCR nodes.
 * As the user is using the application and moving, copy+paste, or editing node content this is the
 * service that performs those operations on the server, directly called from the HTML 'controller'
 */
@Component
public class NodeEditService {
	private static final Logger log = LoggerFactory.getLogger(NodeEditService.class);

	private static final String SPLIT_TAG = "{split}";

	@Autowired
	private Convert convert;

	@Autowired
	private MongoApi api;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private JcrOutboxMgr outboxMgr;

	@Autowired
	private NodeMoveService nodeMoveService;

	/*
	 * Creates a new node as a *child* node of the node specified in the request.
	 */
	public void createSubNode(MongoSession session, CreateSubNodeRequest req, CreateSubNodeResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		
		//boolean createUnderRoot = false;
		/*
		 * if we are moving nodes around on the root, the root belongs to admin and needs special
		 * access (adminRunner)
		 */
//		if (parentPath.equals("/" + NodeName.ROOT + "/" + NodeName.USER + "/" + sessionContext.getUserName() + "/")) {
//			createUnderRoot = true;
//		}

		/*
		 * If this is a publicly appendable node, then we always use admin to append a comment type
		 * node under it. No other type of child node creation is allowed.
		 * 
		 * todo-0: redesign public append logic for mongo
		 */
		// boolean publicAppend = JcrUtil.isPublicAppend(node);
		// boolean asAdminNow = false;
		// if (publicAppend) {
		// // todo-0: everywhere that I'm doing this pattern of logout of active session, and
		// // switch to more powerful admin session,
		// // I should try using the session.impersonate() which i think was designed for this
		// // very purpose I need.
		// log.debug("Switch to admin user.");
		// session.logout();
		// session = oak.newAdminSession();
		// asAdminNow = true;
		// // jcrUtil.impersonateAdminCredentials(session);
		// node = JcrUtil.findNode(session, nodeId);
		// }

		// todo-0: do we need to support user passing node namd during create?
		// String name = StringUtils.isEmpty(req.getNewNodeName()) ? JcrUtil.getGUID() :
		// req.getNewNodeName();

		SubNode newNode = null;

		CreateNodeLocation createLoc = req.isCreateAtTop() ? CreateNodeLocation.FIRST : CreateNodeLocation.LAST;

		// todo-0: bring back node types for mongo
		// if (req.getTypeName() != null &&
		// !SubNodeTypes.UNSTRUCTURED.equalsIgnoreCase(req.getTypeName())) {
		// newNode = node.addNode(name, req.getTypeName());
		// }
		// else {
		newNode = api.createNode(session, node, null, SubNodeTypes.UNSTRUCTURED, 0L, createLoc);
		newNode.setProp(NodeProp.CONTENT, "");
		// }

		// if (publicAppend) {
		// newNode.setProperty(JcrProp.COMMENT_BY, curUser);
		// newNode.setProperty(JcrProp.PUBLIC_APPEND, true);
		// }

		api.save(session, newNode);

		res.setNewNode(convert.convertToNodeInfo(sessionContext, session, newNode, true, true, false));
		res.setSuccess(true);
	}

	/*
	 * Creates a new node that is a sibling (same parent) of and at the same ordinal position as the
	 * node specified in the request.
	 */
	public void insertNode(MongoSession session, InsertNodeRequest req, InsertNodeResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String parentNodeId = req.getParentId();
		log.debug("Inserting under parent: " + parentNodeId);
		SubNode parentNode = api.getNode(session, parentNodeId);

		// IMPORTANT: Only editing actual content requires a "createdBy"
		// checking by JcrUtil.checkNodeCreatedBy

		// String name = StringUtils.isEmpty(req.getNewNodeName()) ? JcrUtil.getGUID() :
		// req.getNewNodeName();
		//
		SubNode newNode = null;
		// if (req.getTypeName() != null &&
		// !JcrConstants.NT_UNSTRUCTURED.equalsIgnoreCase(req.getTypeName())) {
		// newNode = parentNode.addNode(name, req.getTypeName());
		// }
		// else {
		newNode = api.createNode(session, parentNode, null, SubNodeTypes.UNSTRUCTURED, req.getTargetOrdinal(), CreateNodeLocation.ORDINAL);
		newNode.setProp(NodeProp.CONTENT, "");
		// }

		// if (!StringUtils.isEmpty(req.getTargetName())) {
		// parentNode.orderBefore(newNode.getName(), req.getTargetName());
		// }

		api.save(session, newNode);
		res.setNewNode(convert.convertToNodeInfo(sessionContext, session, newNode, true, true, false));
		res.setSuccess(true);
	}

	/*
	 * Renames the node to a new node name specified in the request. In JCR the way you 'rename' a
	 * node is actually by moving it to a new location, which actually under the same parent.
	 */
	public void renameNode(MongoSession session, RenameNodeRequest req, RenameNodeResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);

		api.renameNode(session, node, req.getNewName());
		api.saveSession(session);

		res.setNewId(node.getId().toHexString());
		res.setSuccess(true);
	}

	/*
	 * Saves the value(s) of properties on the node specified in the request.
	 */
	public void saveProperty(MongoSession session, SavePropertyRequest req, SavePropertyResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		node.setProp(req.getPropertyName(), req.getPropertyValue());
		api.save(session, node);

		PropertyInfo propertySaved = new PropertyInfo(null, req.getPropertyName(), req.getPropertyValue(), false);
		res.setPropertySaved(propertySaved);
		res.setSuccess(true);
	}

	/*
	 * Saves the node with new information based on whatever is specified in the request.
	 */
	public void saveNode(MongoSession session, SaveNodeRequest req, SaveNodeResponse res) {

		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String nodeId = req.getNodeId();

		// log.debug("saveNode. nodeId=" + nodeId);
		SubNode node = api.getNode(session, nodeId);

		// String commentBy = JcrUtil.safeGetStringProp(node, JcrProp.COMMENT_BY);
		// if (commentBy != null) {
		// if (!commentBy.equals(session.getUserID())) {
		// throw ExUtil.newEx("You cannot edit someone elses comment.");
		// }
		// session.logout();
		// session = oak.newAdminSession();
		// node = JcrUtil.findNode(session, nodeId);
		// }
		// else {
		// JcrUtil.checkWriteAuthorized(node, session.getUserID());
		// }

		if (req.getProperties() != null) {
			for (PropertyInfo property : req.getProperties()) {

				/*
				 * save only if server determines the property is savable. Just protection. Client
				 * shouldn't be trying to save stuff that is illegal to save, but we have to assume
				 * the worst behavior from client code, for security and robustness.
				 */
				if (SubNodeUtil.isSavableProperty(property.getName())) {
					// log.debug("Property to save: " + property.getName() + "="
					// +
					// property.getValue());
					SubNodeUtil.savePropertyToNode(node, property);
				}
				else {
					/**
					 * TODO: This case indicates that data was sent unnecessarily. fix! (i.e. make
					 * sure this block cannot ever be entered)
					 */
					// log.debug("Ignoring unneeded save attempt on unneeded
					// prop: " + property.getName());
				}
			}

			Calendar lastModified = Calendar.getInstance();
			node.setProp(NodeProp.LAST_MODIFIED, lastModified.getTime());

			if (req.isSendNotification()) {
				// if (commentBy != null) {
				// outboxMgr.sendNotificationForChildNodeCreate(node, commentBy,
				// JcrProp.COMMENT_BY);
				// }
				// else {
				// outboxMgr.sendNotificationForChildNodeCreate(node, sessionContext.getUserName(),
				// JcrProp.CREATED_BY);
				// }
			}

			NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, true, true, false);
			res.setNode(nodeInfo);
			api.saveSession(session);
		}

		res.setSuccess(true);
	}

	/*
	 * Removes the property specified in the request from the node specified in the request
	 */
	public void deleteProperty(MongoSession session, DeletePropertyRequest req, DeletePropertyResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		String propertyName = req.getPropName();
		node.deleteProp(propertyName);
		api.save(session, node);
		res.setSuccess(true);
	}

	//
	// /*
	// * When user pastes in a large amount of text and wants to have this text broken out into
	// * individual nodes one way to do this is put the keyword "{split}" everywhere in the content
	// * you want it cut, and this splitNode method will break it all up into individual nodes.
	// */
	// public void splitNode(Session session, SplitNodeRequest req, SplitNodeResponse res) {
	// try {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	// String nodeId = req.getNodeId();
	// String nodeBelowId = req.getNodeBelowId();
	// Node nodeBelow = null;
	//
	// if (nodeBelowId != null) {
	// nodeBelow = JcrUtil.findNode(session, nodeBelowId);
	// }
	//
	// log.debug("Splitting node: " + nodeId);
	// Node node = JcrUtil.findNode(session, nodeId);
	// Node parentNode = node.getParent();
	//
	// if (!JcrUtil.isUserAccountRoot(sessionContext, node)) {
	// JcrUtil.checkWriteAuthorized(node, session.getUserID());
	// }
	//
	// String content = JcrUtil.getRequiredStringProp(node, JcrProp.CONTENT);
	//
	// /*
	// * If split will have no effect, just return as if successful.
	// */
	// if (!content.contains(SPLIT_TAG)) {
	// res.setSuccess(true);
	// return;
	// }
	//
	// String[] contentParts = StringUtils.splitByWholeSeparator(content, SPLIT_TAG);
	//
	// int idx = 0;
	// for (String part : contentParts) {
	// if (idx == 0) {
	// node.setProperty(JcrProp.CONTENT, part);
	// }
	// else {
	// String newNodeName = JcrUtil.getGUID();
	// Node newNode = parentNode.addNode(newNodeName, JcrConstants.NT_UNSTRUCTURED);
	// newNode.setProperty(JcrProp.CONTENT, part);
	// JcrUtil.timestampNewNode(session, newNode);
	//
	// /*
	// * Because of how 'orderBefore' works (i.e. it 'moves' the bottom node, not the
	// * top node), we always have to continually move the new nodes added into the
	// * location BELOW the node we are splitting, and each time we add a new node it
	// * goes just above this 'nodeBelow' and then in the end everything maintains
	// * proper ordering. Note if 'nodeBelow' is null then that means we are splitting
	// * a node that was already at bottom, so adding all the new nodes as we are here
	// * will make them all end up in the correct locations without us ever calling
	// * 'orderBefore'
	// */
	// if (nodeBelow != null) {
	// parentNode.orderBefore(newNode.getName(), nodeBelow.getName());
	// }
	// }
	// idx++;
	// }
	//
	// JcrUtil.save(session);
	// res.setSuccess(true);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
}
