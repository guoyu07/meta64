package com.meta64.mobile.user;

import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.MongoPrincipal;
import com.meta64.mobile.mongo.model.SubNode;

/**
 * Utility methods for changing access controls on nodes. That is: who can read nodes, modify nodes,
 * delete nodes, etc. Standard access privileges provided by JCR specification.
 * 
 * http://jackrabbit.apache.org/oak/docs/security/accesscontrol/editing.html
 * 
 */
@Component
public class AccessControlUtil {
	private static final Logger log = LoggerFactory.getLogger(AccessControlUtil.class);

	@Autowired
	private MongoApi api;

	// public static String interpretPrivilegeName(String name) {
	// if (name.equalsIgnoreCase("read")) {
	// return Privilege.JCR_READ;
	// }
	// if (name.equalsIgnoreCase("write")) {
	// return Privilege.JCR_WRITE;
	// }
	// if (name.equalsIgnoreCase("addChildren")) {
	// return Privilege.JCR_ADD_CHILD_NODES;
	// }
	// if (name.equalsIgnoreCase("nodeTypeManagement")) {
	// return Privilege.JCR_NODE_TYPE_MANAGEMENT;
	// }
	// return name;
	// }
	//
	// public static void makeNodePublic(Session session, Node node) {
	// List<String> privileges = new LinkedList<String>();
	// privileges.add(Privilege.JCR_READ);
	// grantPrivileges(session, node, EveryonePrincipal.getInstance(), privileges);
	// }
	//
	// public static Privilege[] makePrivilegesFromNames(AccessControlManager acMgr, List<String>
	// names) {
	// try {
	// List<Privilege> privileges = new LinkedList<Privilege>();
	//
	// for (String name : names) {
	// name = interpretPrivilegeName(name);
	// privileges.add(acMgr.privilegeFromName(name));
	// }
	//
	// Privilege[] privArr = new Privilege[privileges.size()];
	// return privileges.toArray(privArr);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * I tried this as a replacement for my grantPrivileges (below) which works perfectly but this
	// * new one doesn't work. Keeping it here anyway, and will look into this later.
	// */
	// public static boolean grantPrivileges_new(Session session, Node node, Principal principal,
	// List<String> privilegeNames) {
	// try {
	// return AccessControlUtils.allow(node, principal.getName(), privilegeNames.toArray(new
	// String[privilegeNames.size()]));
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static boolean grantPrivileges(Session session, Node node, Principal principal,
	// List<String> privilegeNames) {
	// try {
	// AccessControlList acl = getAccessControlList(session, node);
	//
	// if (acl != null) {
	// AccessControlManager acMgr = session.getAccessControlManager();
	// Privilege[] privileges = makePrivilegesFromNames(acMgr, privilegeNames);
	// acl.addAccessControlEntry(principal, privileges);
	// acMgr.setPolicy(node.getPath(), (AccessControlPolicy) acl);
	// return true;
	// }
	// else {
	// throw ExUtil.newEx("Unable to find AccessControlList");
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	public List<String> getOwnerNames(MongoSession session, SubNode node) {
		Set<String> ownerSet = new HashSet<String>();
		/*
		 * We walk up the tree util we get to the root, or find ownership on node, or any of it's
		 * parents
		 */

		int sanityCheck = 0;
		while (++sanityCheck < 100) {
			List<MongoPrincipal> principals = getNodePrincipals(session, node);
			for (MongoPrincipal p : principals) {

				// todo-0: this is a spot that can be optimized. We should be able to send just the
				// userNodeId back to client, and the client
				// should be able to deal with that (i think). depends on how much ownership info we
				// need to show user.
				// ownerSet.add(p.getUserNodeId());
				SubNode userNode = api.getNode(session, p.getUserNodeId());
				String userName = userNode.getStringProp(NodeProp.USER);
				ownerSet.add(userName);
			}

			if (principals.size() == 0) {
				node = api.getParent(session, node);
				if (node == null) break;
			}
			else {
				break;
			}
		}

		List<String> ownerList = new LinkedList<String>(ownerSet);
		Collections.sort(ownerList);
		return ownerList;
	}

	public static List<MongoPrincipal> getNodePrincipals(MongoSession session, SubNode node) {
		List<MongoPrincipal> principals = new LinkedList<MongoPrincipal>();

		// todo-0: for now we just support the owner privileges:
		MongoPrincipal principal = new MongoPrincipal();
		principal.setUserNodeId(node.getId());
		principal.setAccessLevel("w");
		principals.add(principal);

		return principals;
	}
	//
	// public static AccessControlEntry[] getAccessControlEntries(Session session, Node node) {
	// try {
	// AccessControlList acl = getAccessControlList(session, node);
	//
	// if (acl != null) {
	// log.debug(dumpPrivileges(acl.getAccessControlEntries()));
	// }
	//
	// return acl != null ? acl.getAccessControlEntries() : null;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static AccessControlList getAccessControlList(Session session, Node node) {
	// try {
	// String path = node.getPath();
	// AccessControlManager acMgr = session.getAccessControlManager();
	//
	// AccessControlPolicyIterator iter = acMgr.getApplicablePolicies(path);
	// if (iter != null) {
	// while (iter.hasNext()) {
	// AccessControlPolicy policy = iter.nextAccessControlPolicy();
	// // log.debug("policy: " + policy.getClass().getName());
	//
	// if (policy instanceof AccessControlList) {
	// return (AccessControlList) policy;
	// }
	// }
	// }
	//
	// AccessControlPolicy[] list = acMgr.getPolicies(path);
	// if (list != null) {
	// for (AccessControlPolicy policy : list) {
	// // log.debug("policy: " + policy.getClass().getName());
	//
	// if (policy instanceof AccessControlList) {
	// return (AccessControlList) policy;
	// }
	// }
	// }
	//
	// /* No access control list found */
	// log.debug("No modifyable ACL found on node.");
	// return null;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static String dumpPrivileges(AccessControlEntry[] aclEntries) {
	// StringBuilder sb = new StringBuilder();
	//
	// if (aclEntries != null) {
	// for (AccessControlEntry aclEntry : aclEntries) {
	// sb.append("PRINCIPAL: ");
	// sb.append(aclEntry.getPrincipal().getName());
	// sb.append("[");
	// for (Privilege priv : aclEntry.getPrivileges()) {
	// sb.append(priv.getName());
	// sb.append(" ");
	// }
	// sb.append("]");
	// }
	// }
	//
	// return sb.toString();
	// }
	//
	// /*
	// * search for removePolicy in commented code below for a better way to do this
	// */
	// public static boolean removeAclEntry(Session session, Node node, String principle, String
	// privilege) {
	// try {
	// boolean policyChanged = false;
	// String path = node.getPath();
	//
	// log.trace("Privileges for node: " + path + " ");
	//
	// AccessControlList acl = getAccessControlList(session, node);
	// AccessControlEntry[] aclArray = acl.getAccessControlEntries();
	// log.trace("ACL entry count: " + (aclArray == null ? 0 : aclArray.length));
	//
	// if (aclArray != null) {
	// for (AccessControlEntry ace : aclArray) {
	// log.trace("ACL entry (principal name): " + ace.getPrincipal().getName());
	// if (ace.getPrincipal().getName().equals(principle)) {
	// log.trace(" Found PRINCIPLE to remove priv for: " + principle);
	// Privilege[] privileges = ace.getPrivileges();
	//
	// if (privileges != null) {
	// for (Privilege priv : privileges) {
	// if (priv.getName().equals(privilege)) {
	// log.trace(" Found PRIVILEGE to remove: " + principle);
	//
	// /*
	// * we remove the entire 'ace' from the 'acl' here. I don't know
	// * of a more find-grained way to remove privileges than to
	// * remove entire 'ace' which can have multiple privileges on it.
	// * :(
	// */
	// acl.removeAccessControlEntry(ace);
	// policyChanged = true;
	//
	// /*
	// * break out of privileges scanning, this entire 'ace' is dead
	// * now
	// */
	// break;
	// }
	// }
	// }
	// }
	//
	// if (policyChanged) {
	// AccessControlManager acMgr = session.getAccessControlManager();
	// acMgr.setPolicy(path, (AccessControlPolicy) acl);
	// }
	// }
	// }
	// return policyChanged;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static boolean grantFullAccess(Session session, Node node, final String ownerName) {
	// Principal principal = new PrincipalImpl(ownerName);
	// List<String> privs = new LinkedList<String>();
	// privs.add(Privilege.JCR_ALL);
	// return grantPrivileges(session, node, principal, privs);
	// }
	//
	// public static String[] namesFromPrivileges(Privilege... privileges) {
	// if (privileges == null || privileges.length == 0) {
	// return new String[0];
	// }
	// else {
	// String[] names = new String[privileges.length];
	// for (int i = 0; i < privileges.length; i++) {
	// names[i] = privileges[i].getName();
	// }
	// return names;
	// }
	// }
}
