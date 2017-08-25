package com.meta64.mobile.util;

import java.util.HashSet;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.model.PropertyInfo;
import com.meta64.mobile.mongo.CreateNodeLocation;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeTypes;

/**
 * Assorted general utility functions related to JCR nodes.
 * <p>
 * todo-1: there's a lot of code calling these static methods, but need to transition to singleton
 * scope bean and non-static methods.
 */
@Component
public class SubNodeUtil {
	private static final Logger log = LoggerFactory.getLogger(SubNodeUtil.class);

	@Autowired
	private AppProp appProp;

	@Autowired
	private MongoApi api;

	/*
	 * These are properties we should never allow the client to send back as part of a save
	 * operation.
	 */
	private static HashSet<String> nonSavableProperties = new HashSet<String>();

	static {
		nonSavableProperties.add(NodeProp.UUID);
		nonSavableProperties.add(NodeProp.PRIMARY_TYPE);

		nonSavableProperties.add(NodeProp.COMMENT_BY);
		nonSavableProperties.add(NodeProp.PUBLIC_APPEND);

		nonSavableProperties.add(NodeProp.CREATED);
		nonSavableProperties.add(NodeProp.LAST_MODIFIED);

		nonSavableProperties.add(NodeProp.BIN_VER);
		nonSavableProperties.add(NodeProp.BIN_MIME);
		nonSavableProperties.add(NodeProp.IMG_HEIGHT);
		nonSavableProperties.add(NodeProp.IMG_WIDTH);
	}

	//
	// // todo-1: could I be using the same instance everywhere here (like singleton pattern?)
	// public SimpleCredentials getAdminCredentials() {
	// return new SimpleCredentials(appProp.getJcrAdminUserName(),
	// appProp.getJcrAdminPassword().toCharArray());
	// }
	//
	// // public void impersonateAdminCredentials(Session session) {
	// // /* if already as admin creds, just return */
	// // if (JcrPrincipal.ADMIN.equalsIgnoreCase(session.getUserID())) {
	// // return;
	// // }
	// // log.debug("Impersonating admin on session.");
	// // //&&&
	// // //oops this is tricky. need to grant impersonation first, and i'm not going to get side
	// // tracked into that right now.
	// // session.impersonate(getAdminCredentials());
	// // }
	//
	// public static NodeType safeGetNodeType(NodeTypeManager mgr, String nodeTypeName) {
	// try {
	// return mgr.getNodeType(nodeTypeName);
	// }
	// catch (Exception e) {
	// return null;
	// }
	// }

	// public ImageSize getImageSizeFromBinary(Binary binary) {
	// try {
	// InputStream is = null;
	// try {
	// is = binary.getStream();
	// BufferedImage image = ImageIO.read(is);
	// ImageSize ret = new ImageSize();
	// ret.width = image.getWidth();
	// ret.height = image.getHeight();
	// return ret;
	// }
	// finally {
	// StreamUtil.close(is);
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }

	//
	// public static boolean isPublicAppend(Node node) {
	// return JcrUtil.safeGetBooleanProp(node, JcrProp.PUBLIC_APPEND);
	// }
	//
	// public static void checkWriteAuthorized(Node node, String userName) {
	// if (JcrPrincipal.ADMIN.equals(userName)) return;
	//
	// if (userName == null || !userName.equals(getRequiredStringProp(node, JcrProp.CREATED_BY)))
	// throw ExUtil.newEx("Access failed.");
	// }
	//
	// public static boolean isUserAccountRoot(SessionContext sessionContext, Node node) {
	// try {
	// RefInfo refInfo = sessionContext.getRootRefInfo();
	// return node.getPath().equals(refInfo.getPath()) || node.getPath().equals(refInfo.getId());
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static Node findNode(Session session, String id) {
	// try {
	// return id.startsWith("/") ? session.getNode(id) : session.getNodeByIdentifier(id);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static NodeType safeGetPrimaryNodeType(Node node) {
	// try {
	// return node.getPrimaryNodeType();
	// }
	// catch (Exception e) {
	// return null;
	// }
	// }
	//
	// /**
	// * Wrapper around findNode that will return null if not found instead of throwing exception
	// *
	// * @param session
	// * @param id
	// * @return null if not found.
	// */
	// public static Node safeFindNode(Session session, String id) {
	// try {
	// return findNode(session, id);
	// }
	// catch (Exception e) {
	// return null;
	// }
	// }
	//
	// public static NodeIterator getNodes(Node node) {
	// try {
	// return node.getNodes();
	// }
	// catch (Exception e) {
	// throw ExUtil.newEx(e);
	// }
	// }
	//
	// public static Node getFirstChild(Session session, Node parentNode, boolean
	// includeSystemNodes) {
	// try {
	// NodeIterator nodeIter = getNodes(parentNode);
	// Node node = null;
	// try {
	// while (true) {
	// Node n = nodeIter.nextNode();
	//
	// if (!includeSystemNodes) {
	// NodeType nodeType = n.getPrimaryNodeType();
	// if (nodeType.getName().startsWith("rep:")) {
	// continue;
	// }
	// }
	//
	// node = n;
	// break;
	// }
	// }
	// catch (NoSuchElementException ex) {
	// // not an error. Normal iterator end condition.
	// }
	//
	// return node;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /**
	// * Check if this is a node that can only be modified by JCR API internals, and not even allow
	// to
	// * be changed directly by admins.
	// *
	// * @param node
	// * @return true if a protected node.
	// */
	// public static boolean isProtectedNode(Node node) {
	// try {
	// return node.getPrimaryNodeType().getName().startsWith("rep:");
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * Returns the node that is below this node in the siblings list. If parent node happens to
	// * already be available you can pass it in, but if you pass a null parent instead that works
	// too
	// * because it can just find the parent easily from the node.
	// *
	// * Note: We don't support or expect to find multiple nodes of the same name under any given
	// * parent even though that's technically supported by the JCR (for some strange reason)
	// */
	// public static Node getNodeBelow(Session session, Node parentNode, Node node, String nodeName)
	// {
	// try {
	// Node ret = null;
	// if (parentNode == null) {
	// parentNode = node.getParent();
	// }
	//
	// if (nodeName == null) {
	// nodeName = node.getName();
	// }
	//
	// // log.debug("Finding node below node: " + nodeName);
	// NodeIterator nodeIter = getNodes(parentNode);
	// boolean foundNode = false;
	//
	// try {
	// while (true) {
	// Node n = nodeIter.nextNode();
	// // log.debug(" NAME: " + n.getName());
	// if (foundNode) {
	// ret = n;
	// break;
	// }
	// if (n.getName().equals(nodeName)) {
	// foundNode = true;
	// }
	// }
	// }
	// catch (NoSuchElementException ex) {
	// // not an error. Normal iterator end condition.
	// }
	// if (ret == null) {
	// log.debug("didn't find a node below: " + nodeName);
	// }
	// return ret;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * You can either pass node, or nodeName.
	// */
	// public static Node getNodeAbove(Session session, Node parentNode, Node node, String nodeName)
	// {
	// try {
	// Node ret = null;
	// if (parentNode == null) {
	// parentNode = node.getParent();
	// }
	//
	// if (nodeName == null) {
	// nodeName = node.getName();
	// }
	//
	// // log.debug("Finding node below node: " + nodeName);
	// NodeIterator nodeIter = getNodes(parentNode);
	// Node lastNode = null;
	//
	// try {
	// while (true) {
	// Node n = nodeIter.nextNode();
	// // log.debug(" NAME: " + n.getName());
	// if (n.getName().equals(nodeName)) {
	// ret = lastNode;
	// break;
	// }
	// lastNode = n;
	// }
	// }
	// catch (NoSuchElementException ex) {
	// // not an error. Normal iterator end condition.
	// }
	//
	// if (ret == null) {
	// log.debug("didn't find a node above: " + nodeName);
	// }
	// return ret;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * Currently there's a bug in the client code where it sends nulls for some nonsavable types,
	// so
	// * before even fixing the client I decided to just make the server side block those. This is
	// * more secure to always have the server allow misbehaving javascript for security reasons.
	// */
	public static boolean isSavableProperty(String propertyName) {
		return !nonSavableProperties.contains(propertyName);
	}

	//
	public static void savePropertyToNode(SubNode node, PropertyInfo property) {
		/* if multi-valued */
		// if (property.getValues() != null) {
		// String[] values = new String[property.getValues().size()];
		// int idx = 0;
		// for (String val : property.getValues()) {
		// values[idx++] = val;
		// }
		//
		// /*
		// * Because jackrabbit s if you try to set a single-valued property to multi-valued
		// * property without nulling it out first, we have to do that check.
		// */
		// Property prop = JcrUtil.getProperty(node, property.getName());
		// if (prop != null && !prop.isMultiple()) {
		// node.setProperty(property.getName(), (String) null);
		// }
		// node.setProperty(property.getName(), values);
		// }
		// /* else is single valued */
		// else {
		/*
		 * Because jackrabbit s if you try to set a multi-valued property to single-valued property
		 * without nulling it out first, we have to do that check.
		 */
		// Property prop = JcrUtil.getProperty(node, property.getName());
		// if (prop != null && prop.isMultiple()) {
		// node.setProperty(property.getName(), (String) null);
		// }

		// todo-0: for now we can only set string properties, right here.
		node.setProp(property.getName(), property.getValue());
		// }
	}

	//
	// public static void timestampNewNode(Session session, Node node) {
	// try {
	// // mix:created -> jcr:created + jcr:createdBy
	// if (!node.hasProperty(JcrProp.CREATED)) {
	// node.addMixin("mix:created");
	// }
	//
	// // mix:lastModified -> jcr:lastModified + jcr:lastModifiedBy
	// if (!node.hasProperty(JcrProp.LAST_MODIFIED)) {
	// node.addMixin("mix:lastModified");
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//

	public SubNode ensureNodeExists(MongoSession session, String parentPath, String name, String defaultContent) {
		return ensureNodeExists(session, parentPath, name, defaultContent, SubNodeTypes.UNSTRUCTURED, true);
	}

	public boolean hasDisplayableNodes(boolean isAdvancedEditingMode, SubNode node) {
		return (api.getChildCount(node) > 0);
	}

	//
	// public static boolean nodeVisibleInSimpleMode(Node node) {
	// try {
	// if (node == null) return false;
	//
	// String name = node.getName();
	//
	// /*
	// * Note: Mainly it's 'rep:policy' we will get here but all 'rep:*' items would imply
	// * same logic.
	// */
	// if (name.startsWith("rep:")) {
	// return false;
	// }
	//
	// String typeName = node.getPrimaryNodeType().getName();
	// if (name.equals("allow") && typeName.contains("rep:GrantACE")) {
	// return false;
	// }
	//
	// return true;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /*
	// * If name contains '/' then it's split and this method ends up creating all the subnodes
	// * required to make the path exist,
	// */
	// public static Node ensureNodeExists(Session session, String parentPath, String name, String
	// defaultContent, String primaryTypeName, boolean saveImmediate) {
	// try {
	// if (!parentPath.endsWith("/")) {
	// parentPath += "/";
	// }
	//
	// // log.debug("Looking up node by path: "+(parentPath+name));
	// Node node = JcrUtil.getNodeByPath(session, fixPath(parentPath + name));
	// if (node != null) {
	// return node;
	// }
	//
	// List<String> nameTokens = XString.tokenize(name, "/", true);
	// if (nameTokens == null) {
	// return null;
	// }
	//
	// Node parent = session.getNode(parentPath);
	// if (parent == null) {
	// throw ExUtil.newEx("Expected parent not found: " + parentPath);
	// }
	//
	// boolean nodesCreated = false;
	// for (String nameToken : nameTokens) {
	//
	// String path = fixPath(parentPath + nameToken);
	// log.debug("ensuring node exists: parentPath=" + path);
	// node = JcrUtil.getNodeByPath(session, path);
	//
	// /*
	// * if this node is found continue on, using it as current parent to build on
	// */
	// if (node != null) {
	// parent = node;
	// }
	// else {
	// log.debug("Creating " + nameToken + " node, which didn't exist.");
	//
	// parent = parent.addNode(nameToken, primaryTypeName);
	// if (parent == null) {
	// throw ExUtil.newEx("unable to create " + nameToken);
	// }
	// nodesCreated = true;
	//
	// parent.setProperty(JcrProp.CONTENT, "");
	// }
	// parentPath += nameToken + "/";
	// }
	//
	// if (defaultContent != null) {
	// parent.setProperty(JcrProp.CONTENT, defaultContent);
	// }
	//
	// if (saveImmediate && nodesCreated) {
	// JcrUtil.save(session);
	// }
	// return parent;
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	public SubNode ensureNodeExists(MongoSession session, String parentPath, String name, String defaultContent, String primaryTypeName, boolean saveImmediate) {
		if (!parentPath.endsWith("/")) {
			parentPath += "/";
		}

		// log.debug("Looking up node by path: "+(parentPath+name));
		SubNode node = api.getNode(session, fixPath(parentPath + name));
		if (node != null) {
			return node;
		}

		List<String> nameTokens = XString.tokenize(name, "/", true);
		if (nameTokens == null) {
			return null;
		}

		SubNode parent = null;

		if (!parentPath.equals("/")) {
			parent = api.getNode(session, parentPath);
			if (parent == null) {
				throw ExUtil.newEx("Expected parent not found: " + parentPath);
			}
		}

		boolean nodesCreated = false;
		for (String nameToken : nameTokens) {

			String path = fixPath(parentPath + nameToken);
			log.debug("ensuring node exists: parentPath=" + path);
			node = api.getNode(session, path);

			/*
			 * if this node is found continue on, using it as current parent to build on
			 */
			if (node != null) {
				parent = node;
			}
			else {
				log.debug("Creating " + nameToken + " node, which didn't exist.");

				/* Note if parent PARAMETER here is null we are adding a root node */
				parent = api.createNode(session, parent, nameToken, primaryTypeName, 0L, CreateNodeLocation.LAST);

				if (parent == null) {
					throw ExUtil.newEx("unable to create " + nameToken);
				}
				nodesCreated = true;

				parent.setProp(NodeProp.CONTENT, "");
				api.save(session, parent);
			}
			parentPath += nameToken + "/";
		}

		if (defaultContent != null) {
			parent.setProp(NodeProp.CONTENT, defaultContent);
		}

		if (saveImmediate && nodesCreated) {
			api.saveSession(session);
		}
		return parent;
	}

	//
	// public static void save(Session session) {
	// try {
	// session.save();
	// }
	// catch (Exception e) {
	// throw ExUtil.newEx(e);
	// }
	// }
	//
	public static String fixPath(String path) {
		return path.replace("//", "/");
	}
	//
	// public static Node getNodeByPath(Session session, String path) {
	// try {
	// return session.getNode(path);
	// }
	// catch (Exception e) {
	// // do nothing. Not error condition. Means allUsersRoot is not found,
	// // so will still be
	// // null.
	// return null;
	// }
	// }
	//
	// /*
	// * This fails. Doesnt' work.
	// */
	// public static void removeRootNodes(Session session) {
	// safeRemoveNode(session, "/jcr:system");
	// safeRemoveNode(session, "/rep:security");
	// safeRemoveNode(session, "/oak:index");
	// safeRemoveNode(session, "/userPreferences");
	// safeRemoveNode(session, "/root");
	// safeRemoveNode(session, "/meta64");
	//
	// save(session);
	// }
	//
	// public static void safeRemoveNode(Session session, String nodeId) {
	// Node node = JcrUtil.safeFindNode(session, nodeId);
	// if (node != null) {
	// log.debug("Removing Node: " + nodeId);
	// try {
	// node.remove();
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	// }
	//
	// /*
	// * Gets property or returns null of no propery by that name can be retrieved
	// */
	// public static void safeDeleteProperty(Node node, String propName) {
	// try {
	// Property prop = node.getProperty(propName);
	// prop.remove();
	// }
	// catch (Exception e) {
	// // do nothing. property wasn't found.
	// }
	// }
	//
	// /*
	// * Gets property or returns null of no property by that name can be retrieved
	// */
	// public static Property getProperty(Node node, String propName) {
	// try {
	// return node.getProperty(propName);
	// }
	// catch (Exception e) {
	// return null;
	// }
	// }
	//
	// /*
	// * Gets string property from node. of anything goes wrong
	// */
	// public static String getRequiredStringProp(Node node, String propName) {
	// try {
	// return node.getProperty(propName).getValue().getString();
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static String safeGetStringProp(Node node, String propName) {
	// try {
	// return getRequiredStringProp(node, propName);
	// }
	// catch (Exception e) {
	// return null;
	// }
	// }
	//
	// public static boolean getRequiredBooleanProp(Node node, String propName) {
	// try {
	// return node.getProperty(propName).getValue().getBoolean();
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// public static boolean safeGetBooleanProp(Node node, String propName) {
	// try {
	// return getRequiredBooleanProp(node, propName);
	// }
	// catch (Exception e) {
	// return false;
	// }
	// }
	//
	// /* Returns list of property names or null of there are none */
	// public static List<String> getPropertyNames(Node node, boolean ordered) throws
	// RepositoryException {
	// List<String> names = null;
	// PropertyIterator iter = node.getProperties();
	// while (iter.hasNext()) {
	// Property prop = iter.nextProperty();
	//
	// /* lazy create reutn value */
	// if (names == null) {
	// names = new LinkedList<String>();
	// }
	// names.add(prop.getName());
	// }
	//
	// if (ordered) {
	// Collections.sort(names);
	// }
	//
	// return names;
	// }
	//
	// public static int getPropertyCount(Node node) throws RepositoryException {
	// PropertyIterator iter = node.getProperties();
	// int count = 0;
	// while (iter.hasNext()) {
	// iter.nextProperty();
	// count++;
	// }
	// return count;
	// }
	//
	// /*
	// * I have decided 64bits of randomness is good enough, instead of 128, thus we are dicing up
	// the
	// * string to use every other character. If you want to modify this method to return a full
	// UUID
	// * that will not cause any problems, other than default node names being the full string,
	// which
	// * is kind of long
	// */
	// public static String getGUID() {
	// String uid = UUID.randomUUID().toString();
	// StringBuilder sb = new StringBuilder();
	// int len = uid.length();
	//
	// /* chop length in half by using every other character */
	// for (int i = 0; i < len; i += 2) {
	// char c = uid.charAt(i);
	// if (c == '-') {
	// i--;// account for the fact we jump by tow, and start just after
	// // dash.
	// }
	// else {
	// sb.append(c);
	// }
	// }
	//
	// return sb.toString();
	// // here's another way to generate a random 64bit number...
	// // if (prng == null) {
	// // prng = SecureRandom.getInstance("SHA1PRNG");
	// // }
	// //
	// // return String.valueOf(prng.nextLong());
	// }
}
