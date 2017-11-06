package com.meta64.mobile.mongo;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.StringTokenizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.AddPrivilegeRequest;
import com.meta64.mobile.request.GetNodePrivilegesRequest;
import com.meta64.mobile.request.RemovePrivilegeRequest;
import com.meta64.mobile.response.AddPrivilegeResponse;
import com.meta64.mobile.response.GetNodePrivilegesResponse;
import com.meta64.mobile.response.RemovePrivilegeResponse;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.XString;

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

		if (req.isIncludeAcl()) {
			res.setAclEntries(api.getAclEntries(session, node));
		}

		if (req.isIncludeOwners()) {
			List<String> owners = userManagerService.getOwnerNames(node);
			// log.info("Owner Count: " + owners.size());
			res.setOwners(owners);
		}

		res.setSuccess(true);
	}

	/*
	 * I made this privilege capable of doing either a 'publicAppend' update, or actual privileges
	 * update. Only one at a time will be done, usually, if not always.
	 *
	 * Adds a new privilege to a node. Request object is self explanatory.
	 */
	public void addPrivilege(MongoSession session, AddPrivilegeRequest req, AddPrivilegeResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		api.authRequireOwnerOfNode(session, node);

		boolean success = false;
		String principal = req.getPrincipal();
		if (principal != null) {
			String mapKey = null;

			/* If we are sharing to public, then that's the map key */
			if (principal.equalsIgnoreCase(NodePrincipal.PUBLIC)) {
				mapKey = NodePrincipal.PUBLIC;
			}
			/* otherwise sharing to a person so their userNodeId is the map key in this case */
			else {
				SubNode principleNode = api.getUserNodeByUserName(api.getAdminSession(), principal);
				if (principleNode == null) {
					res.setMessage("Unknown user name: " + principal);
					res.setSuccess(false);
					return;
				}
				mapKey = principleNode.getId().toHexString();
			}

			HashMap<String, String> acl = node.getAcl();
			if (acl == null) {
				acl = new HashMap<String, String>();
			}
			String authForPrinciple = acl.get(mapKey);
			if (authForPrinciple == null) {
				authForPrinciple = "";
			}

			boolean authAdded = false;
			List<String> privileges = req.getPrivileges();
			for (String priv : privileges) {
				if (authForPrinciple.indexOf(priv) == -1) {
					authAdded = true;
					if (authForPrinciple.length() > 0) {
						authForPrinciple += ",";
					}
					authForPrinciple += priv;
				}
			}

			if (authAdded) {
				acl.put(mapKey, authForPrinciple);
				node.setAcl(acl);
				api.save(session, node);
			}

			success = true;
		}

		if (req.getPublicAppend() != null) {
			// boolean publicAppend = req.getPublicAppend().booleanValue();
			// if (!publicAppend) {
			// JcrUtil.safeDeleteProperty(node, JcrProp.PUBLIC_APPEND);
			// }
			// else {
			// node.setProperty(JcrProp.PUBLIC_APPEND, true);
			// }
			// success = true;
		}

		res.setSuccess(success);
	}

	public void removeAclEntry(MongoSession session, SubNode node, String principleNodeId, String privToRemove) {
		HashSet<String> setToRemove = XString.tokenizeToSet(privToRemove, ",", true);

		HashMap<String, String> acl = node.getAcl();
		if (acl == null) return;
		String privs = acl.get(principleNodeId);
		if (privs == null) {
			log.debug("ACL didn't contain principleNodeId " + principleNodeId + "\nACL DUMP: " + XString.prettyPrint(acl));
			return;
		}
		StringTokenizer t = new StringTokenizer(privs, ",", false);
		String newPrivs = "";
		boolean removed = false;

		while (t.hasMoreTokens()) {
			String tok = t.nextToken().trim();
			if (setToRemove.contains(tok)) {
				removed = true;
				continue;
			}
			if (newPrivs.length() > 0) {
				newPrivs += ",";
			}
			newPrivs += tok;
		}

		if (removed) {
			/*
			 * If there are no privileges left for this principle, then remove the principle entry
			 * completely from the ACL. We don't store empty ones.
			 */
			if (newPrivs.equals("")) {
				acl.remove(principleNodeId);
			}
			else {
				acl.put(principleNodeId, newPrivs);
			}

			/*
			 * if there are now no acls at all left set the ACL to null, so it is completely removed
			 * from the node
			 */
			if (acl.isEmpty()) {
				node.setAcl(null);
			}
			else {
				node.setAcl(acl);
			}

			api.save(session, node);
		}
	}

	/*
	 * Removes the privilege specified in the request from the node specified in the request
	 */
	public void removePrivilege(MongoSession session, RemovePrivilegeRequest req, RemovePrivilegeResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		api.authRequireOwnerOfNode(session, node);

		String principalNodeId = req.getPrincipalNodeId();
		String privilege = req.getPrivilege();

		removeAclEntry(session, node, principalNodeId, privilege);
		res.setSuccess(true);
	}
}
