package com.meta64.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.GetNodePrivilegesRequest;
import com.meta64.mobile.response.GetNodePrivilegesResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service methods for (ACL): processing security, privileges, and Access Control List information
 * on nodes.
 * 
 */
@Component
public class AclService {
	private static final Logger log = LoggerFactory.getLogger(AclService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private UserManagerService userManagerService;

	/**
	 * Returns the privileges that exist on the node identified in the request.
	 */
	public void getNodePrivileges(MongoSession session, GetNodePrivilegesRequest req, GetNodePrivilegesResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);

		if (!req.isIncludeAcl() && !req.isIncludeOwners()) {
			throw ExUtil.newEx("no specific information requested for getNodePrivileges");
		}

		// if (req.isIncludeAcl()) {
		// AccessControlEntry[] aclEntries = AccessControlUtil.getAccessControlEntries(session,
		// node);
		// List<AccessControlEntryInfo> aclEntriesInfo = Convert.convertToAclListInfo(aclEntries);
		// res.setAclEntries(aclEntriesInfo);
		// log.info("ACL Count: " + aclEntriesInfo.size());
		// }

		if (req.isIncludeOwners()) {
			List<String> owners = userManagerService.getOwnerNames(node);
			// log.info("Owner Count: " + owners.size());
			res.setOwners(owners);
		}

		res.setSuccess(true);
	}
	//
	// /*
	// * I made this privilege capable of doing either a 'publicAppend' update, or actual privileges
	// * update. Only one at a time will be done, usually, if not always.
	// *
	// * Adds a new privilege to a node. Request object is self explanatory.
	// */
	// public void addPrivilege(Session session, AddPrivilegeRequest req, AddPrivilegeResponse res)
	// {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	//
	// String nodeId = req.getNodeId();
	// Node node = JcrUtil.findNode(session, nodeId);
	// JcrUtil.checkWriteAuthorized(node, session.getUserID());
	//
	// boolean success = false;
	// String principal = req.getPrincipal();
	// if (principal != null) {
	// List<String> privileges = req.getPrivileges();
	// Principal principalObj = null;
	//
	// if (principal.equalsIgnoreCase(EveryonePrincipal.NAME)) {
	// principalObj = EveryonePrincipal.getInstance();
	// }
	// else {
	// principalObj = new PrincipalImpl(principal);
	// }
	//
	// try {
	// success = AccessControlUtil.grantPrivileges(session, node, principalObj, privileges);
	// }
	// catch (Exception e) {
	// // leave success==false and continue.
	// }
	// }
	//
	// try {
	// if (req.getPublicAppend() != null) {
	// boolean publicAppend = req.getPublicAppend().booleanValue();
	// if (!publicAppend) {
	// JcrUtil.safeDeleteProperty(node, JcrProp.PUBLIC_APPEND);
	// }
	// else {
	// node.setProperty(JcrProp.PUBLIC_APPEND, true);
	// }
	// success = true;
	// }
	//
	// if (success) {
	// JcrUtil.save(session);
	// }
	// else {
	// res.setMessage("Unable to alter privileges on node.");
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// res.setSuccess(success);
	// }
	//
	// /*
	// * Removes the privilege specified in the request from the node specified in the request
	// */
	// public void removePrivilege(Session session, RemovePrivilegeRequest req,
	// RemovePrivilegeResponse res) {
	// if (session == null) {
	// session = ThreadLocals.getJcrSession();
	// }
	//
	// String nodeId = req.getNodeId();
	// Node node = JcrUtil.findNode(session, nodeId);
	// JcrUtil.checkWriteAuthorized(node, session.getUserID());
	//
	// String principal = req.getPrincipal();
	// String privilege = req.getPrivilege();
	//
	// boolean success = AccessControlUtil.removeAclEntry(session, node, principal, privilege);
	//
	// JcrUtil.save(session);
	// res.setSuccess(success);
	// }
}
