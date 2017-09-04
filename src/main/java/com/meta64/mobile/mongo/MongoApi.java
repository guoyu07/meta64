package com.meta64.mobile.mongo;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;
import java.util.regex.Pattern;

import org.apache.commons.io.input.AutoCloseInputStream;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.data.mongodb.core.index.TextIndexDefinition.TextIndexDefinitionBuilder;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeName;
import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.image.ImageSize;
import com.meta64.mobile.image.ImageUtil;
import com.meta64.mobile.model.AccessControlEntryInfo;
import com.meta64.mobile.model.PrivilegeInfo;
import com.meta64.mobile.mongo.model.PrivilegeType;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodePropVal;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.mongo.model.UserPreferencesNode;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.XString;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;

/**
 * NOTE: regex test site: http://reg-exp.com/
 */
@Component
public class MongoApi {
	private static final Logger log = LoggerFactory.getLogger(MongoApi.class);

	@Autowired
	private MongoTemplate ops;

	@Autowired
	private GridFsTemplate grid;

	@Autowired
	private AppProp appProp;

	@Autowired
	private SubNodeUtil jcrUtil;

	private static final MongoSession adminSession = MongoSession.createFromUser(NodePrincipal.ADMIN);
	private static final MongoSession anonSession = MongoSession.createFromUser(NodePrincipal.ANONYMOUS);

	public MongoSession getAdminSession() {
		return adminSession;
	}

	public MongoSession getAnonSession() {
		return anonSession;
	}

	public boolean isAllowedUserName(String userName) {
		return !userName.equalsIgnoreCase(NodePrincipal.ADMIN) && //
				!userName.equalsIgnoreCase(NodePrincipal.PUBLIC) && //
				!userName.equalsIgnoreCase(NodePrincipal.ANONYMOUS);
	}

	public void authRequireOwnerOfNode(MongoSession session, SubNode node) {
		if (!session.getUserNode().getId().equals(node.getOwner())) {
			throw new RuntimeException("Auth Failed. Node ownership required.");
		}
	}

	public void requireAdmin(MongoSession session) {
		if (!session.isAdmin()) throw new RuntimeException("auth fail");
	}

	public void auth(MongoSession session, SubNode node, PrivilegeType... privs) {
		auth(session, node, Arrays.asList(privs));
	}

	/* Returns true if this user on this session has privType access to 'node' */
	public void auth(MongoSession session, SubNode node, List<PrivilegeType> priv) {
		if (priv == null || priv.size() == 0) {
			throw new RuntimeException("privileges not specified.");
		}

		// admin has full power over all nodes
		if (node == null || session.isAdmin()) return;

		if (node.getOwner() == null) {
			throw new RuntimeException("node had no owner: " + node.getPath());
		}

		if (!session.isAnon()) {
			// if this session user is the owner of this node, then they have full power
			if (session.getUserNode().getId().equals(node.getOwner())) return;
		}

		// Find any ancestor that has priv shared to this user.
		if (ancestorAuth(session, node, priv)) return;

		throw new RuntimeException("Unauthorized");
	}

	/* NOTE: this should ONLY ever be called from 'auth()' method of this class */
	private boolean ancestorAuth(MongoSession session, SubNode node, List<PrivilegeType> privs) {

		/* get the non-null sessionUserNodeId if not anonymous user */
		String sessionUserNodeId = session.isAnon() ? null : session.getUserNode().getId().toHexString();

		String path = node.getPath();
		StringBuilder fullPath = new StringBuilder();
		StringTokenizer t = new StringTokenizer(path, "/", false);
		boolean ret = false;
		while (t.hasMoreTokens()) {
			String pathPart = t.nextToken().trim();
			fullPath.append("/");
			fullPath.append(pathPart);

			// todo-1: remove concats and let NodeName have static finals for these full paths.
			if (pathPart.equals("/" + NodeName.ROOT)) continue;
			if (pathPart.equals("/" + NodeName.ROOT + "/" + NodeName.USER)) continue;

			// I'm putting the caching of ACL results on hold, because this is only a performance
			// enhancement and can wait.
			// Boolean knownAuthResult =
			// MongoThreadLocal.aclResults().get(buildAclThreadLocalKey(sessionUserNodeId, fullPath,
			// privs));

			SubNode tryNode = getNode(session, fullPath.toString(), false);
			if (tryNode == null) {
				throw new RuntimeException("Tree corrupt! path not found: " + fullPath.toString());
			}

			if (nodeAuth(tryNode, sessionUserNodeId, privs)) {
				ret = true;
				break;
			}
		}

		return ret;
	}

	// private String buildAclThreadLocalKey(String userNodeId, String path, List<PrivilegeType>
	// privs) {
	// //work in progress.
	// }

	/*
	 * NOTE: It is the normal flow that we expect sessionUserNodeId to be null for any anonymous
	 * requests and this is fine because we are basically going to only be pulling 'public' acl to
	 * check, and this is by design.
	 */
	public boolean nodeAuth(SubNode node, String sessionUserNodeId, List<PrivilegeType> privs) {
		HashMap<String, String> acl = node.getAcl();
		if (acl == null) return false;
		String allPrivs = "";

		String privsForUserId = (sessionUserNodeId == null ? null : acl.get(sessionUserNodeId));
		if (privsForUserId != null) {
			allPrivs += privsForUserId;
		}

		/*
		 * We always add on any privileges assigned to the PUBLIC when checking privs for this user,
		 * becasue the auth equivalent is really the union of this set.
		 */
		String privsForPublic = acl.get(NodePrincipal.PUBLIC);
		if (privsForPublic != null) {
			allPrivs += "," + privsForPublic;
		}

		if (allPrivs.length() > 0) {
			for (PrivilegeType priv : privs) {
				if (allPrivs.indexOf(priv.name) == -1) {
					/* if any priv is missing we fail the auth */
					return false;
				}
			}
			/* if we looped thru all privs ok, auth is successful */
			return true;
		}
		return false;
	}

	public void save(MongoSession session, SubNode node) {
		save(session, node, true);
	}

	public void save(MongoSession session, SubNode node, boolean updateThreadCache) {
		auth(session, node, PrivilegeType.WRITE);
		// log.debug("MongoApi.save: DATA: " + XString.prettyPrint(node));
		node.setWriting(true);
		ops.save(node);

		if (updateThreadCache) {
			MongoThreadLocal.autoCleanup(session);
		}
	}

	/**
	 * Gets account name from the root node associated with whoever owns 'node'
	 */
	public String getNodeOwner(MongoSession session, SubNode node) {
		if (node.getOwner() == null) {
			throw new RuntimeException("Node has null owner: " + XString.prettyPrint(node));
		}
		SubNode userNode = getNode(session, node.getOwner());
		return userNode.getStringProp(NodeProp.USER);
	}

	public void renameNode(MongoSession session, SubNode node, String newName) {
		auth(session, node, PrivilegeType.WRITE);

		newName = newName.trim();
		if (newName.length() == 0) {
			throw ExUtil.newEx("No node name provided.");
		}

		// todo-1: need a dedicated name validator utility function.
		if (newName.contains("/")) {
			throw ExUtil.newEx("Invalid node name characters.");
		}

		log.debug("Renaming node: " + node.getId().toHexString());

		int nodePathLen = node.getPath().length();
		String newPathPrefix = node.getParentPath() + "/" + newName;

		SubNode checkExists = getNode(session, newPathPrefix);
		if (checkExists != null) {
			throw ExUtil.newEx("Node already exists");
		}

		// change all paths of all children (recursively) to start with the new path
		for (SubNode n : getSubGraph(session, node)) {
			String path = n.getPath();
			String chopPath = path.substring(nodePathLen);
			String newPath = newPathPrefix + chopPath;
			n.setPath(newPath);
			n.setDisableParentCheck(true);
		}

		node.setPath(newPathPrefix);
	}

	/*
	 * todo-1: We could theoretically achieve a level of transactionality here if we were to setup a
	 * try/catch/finally block here and detect if any 'save' call fails, and if so, proceed to
	 * attempt to set all the nodes BACK to their original values. But before i start getting that
	 * 'creative' i need to research what the rest of the mongodb community thinks about this kind
	 * of thing, and research if there is a way to let Spring api, batch these. Actually this is
	 * probably already solved in some sort of BATCHING API already written.
	 * 
	 * UPDATE: I have a full and complete design for a Two-Phase commit, that actually offers
	 * rollback to any prior point in time also, which will be what i do regarding the above
	 * notes...
	 * 
	 * An enhancement here would be to have 'values' maintain the order in which the first
	 * modification was made so that there is no risk of errors like it saying you can't create a
	 * node before the parent node exists, because you created some new subgraph all in on 'commit'
	 */
	public void saveSession(MongoSession session) {
		synchronized (session) {
			if (MongoThreadLocal.getDirtyNodes() == null || MongoThreadLocal.getDirtyNodes().values() == null) {
				return;
			}
			/*
			 * check that we are allowed to write all, before we start writing any, to be more
			 * efficient 'transactionally'
			 */
			for (SubNode node : MongoThreadLocal.getDirtyNodes().values()) {
				auth(session, node, PrivilegeType.WRITE);
			}

			for (SubNode node : MongoThreadLocal.getDirtyNodes().values()) {
				save(session, node, false);
			}
			MongoThreadLocal.cleanAll();
		}
	}

	public UserPreferencesNode createUserPreferencesNode(MongoSession session, String path) {
		ObjectId ownerId = getOwnerNodeIdFromSession(session);
		return new UserPreferencesNode(ownerId, path, SubNodeTypes.UNSTRUCTURED);
	}

	public SubNode createNode(MongoSession session, SubNode parent, String type, Long ordinal, CreateNodeLocation location) {
		return createNode(session, parent, null, type, ordinal, location);
	}

	public SubNode createNode(MongoSession session, String path) {
		ObjectId ownerId = getOwnerNodeIdFromSession(session);
		SubNode node = new SubNode(ownerId, path, SubNodeTypes.UNSTRUCTURED, null);
		return node;
	}

	public SubNode createNode(MongoSession session, String path, String type, String ownerName) {
		if (type == null) {
			type = SubNodeTypes.UNSTRUCTURED;
		}
		ObjectId ownerId = getOwnerNodeIdFromSession(session);
		SubNode node = new SubNode(ownerId, path, type, null);
		return node;
	}

	public SubNode createNode(MongoSession session, String path, String type) {
		if (type == null) {
			type = SubNodeTypes.UNSTRUCTURED;
		}
		ObjectId ownerId = getOwnerNodeIdFromSession(session);
		SubNode node = new SubNode(ownerId, path, type, null);
		return node;
	}

	/*
	 * Creates a node, but does NOT persist it. If parent==null it assumes it's adding a root node.
	 * This is required, because all the nodes at the root level have no parent. That is, there is
	 * no ROOT node. Only nodes considered to be on the root.
	 * 
	 * relPath can be null if no path is known
	 */
	public SubNode createNode(MongoSession session, SubNode parent, String relPath, String type, Long ordinal, CreateNodeLocation location) {
		if (relPath == null) {
			/*
			 * Adding a node ending in '?' will trigger for the system to generate a leaf node
			 * automatically.
			 */
			relPath = "?";
		}

		if (type == null) {
			type = SubNodeTypes.UNSTRUCTURED;
		}

		String path = (parent == null ? "" : parent.getPath()) + "/" + relPath;

		ObjectId ownerId = getOwnerNodeIdFromSession(session);

		// for now not worried about ordinals for root nodes.
		if (parent == null) {
			ordinal = 0L;
		}
		else {
			ordinal = prepOrdinalForLocation(session, location, parent, ordinal);
		}

		SubNode node = new SubNode(ownerId, path, type, ordinal);
		return node;
	}

	private Long prepOrdinalForLocation(MongoSession session, CreateNodeLocation location, SubNode parent, Long ordinal) {
		switch (location) {
		case FIRST:
			ordinal = 0L;
			insertOrdinal(session, parent, 0L);
			saveSession(session);
			break;
		case LAST:
			ordinal = getMaxChildOrdinal(session, parent) + 1;
			parent.setMaxChildOrdinal(ordinal);
			break;
		case ORDINAL:
			insertOrdinal(session, parent, ordinal);
			saveSession(session);
			// leave ordinal same and return it.
			break;
		}
		return ordinal;
	}

	/*
	 * Shifts all child ordinals down (increments them) to make a slot for the new ordinal
	 * 
	 * todo-1: Future optimization: If inserting ordinal at position zero that means simply adding
	 * one to all children so the query to load them up can be an 'unsorted' query in that special
	 * case, because we CAN process them all in an unordered way in that case.
	 */
	public void insertOrdinal(MongoSession session, SubNode node, long ordinal) {
		long maxOrdinal = 0;

		for (SubNode child : getChildren(session, node, true, null)) {
			Long childOrdinal = child.getOrdinal();
			long childOrdinalInt = childOrdinal == null ? 0L : childOrdinal.longValue();

			if (childOrdinalInt >= ordinal) {
				childOrdinalInt++;
				child.setOrdinal(childOrdinalInt);
			}

			if (childOrdinalInt > maxOrdinal) {
				maxOrdinal = childOrdinalInt;
			}
		}

		node.setMaxChildOrdinal(maxOrdinal);
	}

	public ObjectId getOwnerNodeIdFromSession(MongoSession session) {
		ObjectId ownerId = null;

		if (session.getUserNode() != null) {
			ownerId = session.getUserNode().getOwner();
		}
		else {
			SubNode ownerNode = getUserNodeByUserName(adminSession, session.getUser());
			if (ownerNode == null) {
				/*
				 * slight mod to help bootstrapping when the admin doesn't initially have an
				 * ownernode until created
				 */
				if (!session.isAdmin()) {
					throw new RuntimeException("No user node found for user: " + session.getUser());
				}
				else
					return null;
			}
			else {
				ownerId = ownerNode.getOwner();
			}
		}

		if (ownerId == null) {
			throw new RuntimeException("Unable to get ownerId from the session.");
		}

		// if we return null, it indicates the owner is Admin.
		return ownerId;
	}

	public String getParentPath(SubNode node) {
		return XString.truncateAfterLast(node.getPath(), "/");
	}

	public long getChildCount(SubNode node) {
		// log.debug("MongoApi.getChildCount");

		Query query = new Query();
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()));
		query.addCriteria(criteria);

		return ops.count(query, SubNode.class);
	}

	/*
	 * I find it odd that MongoTemplate no count for the whole collection. A query is always
	 * required? Strange oversight on their part.
	 */
	public long getNodeCount() {
		Query query = new Query();
		// Criteria criteria =
		// Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()));
		// query.addCriteria(criteria);

		return ops.count(query, SubNode.class);
	}

	public SubNode getChildAt(MongoSession session, SubNode node, long idx) {
		auth(session, node, PrivilegeType.READ);
		Query query = new Query();
		Criteria criteria = Criteria.where(//
				SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()))//
				.and(SubNode.FIELD_ORDINAL).is(idx);
		query.addCriteria(criteria);

		SubNode ret = ops.findOne(query, SubNode.class);
		return ret;
	}

	public void checkParentExists(SubNode node) {
		boolean isRootPath = isRootPath(node.getPath());
		if (node.isDisableParentCheck() || isRootPath) return;

		String parentPath = getParentPath(node);
		if (parentPath == null || parentPath.equals("") || parentPath.equals("/")) return;

		log.debug("Verifying parent path exists: " + parentPath);
		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).is(parentPath));

		if (!ops.exists(query, SubNode.class)) {
			throw new RuntimeException("Attempted to add a node before its parent exists: " + parentPath);
		}
	}

	/* Root path will start with '/' and then contain no other slashes */
	public boolean isRootPath(String path) {
		return path.startsWith("/") && path.substring(1).indexOf("/") == -1;
	}

	/**
	 * todo-1: cleaning up GridFS will be done as an async thread. For now we can just let GridFS
	 * binaries data get orphaned... BUT I think it might end up being super efficient if we have
	 * the 'path' stored in the GridFS metadata so we can use a 'regex' query to delete all the
	 * binaries which is exacly like the one below for deleting the nodes themselves.
	 */
	public void delete(MongoSession session, SubNode node) {
		authRequireOwnerOfNode(session, node);

		/*
		 * First delete all the children of the node by using the path, knowing all their paths
		 * 'start with' (as substring) this path. Note how efficient it is that we can delete an
		 * entire subgraph in one single operation! Nice!
		 */
		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).regex(regexRecursiveChildrenOfPath(node.getPath())));

		ops.remove(query, SubNode.class);

		/*
		 * Yes we DO have to remove the node itself separate from the remove of all it's subgraph,
		 * because in order to be perfectly safe the recursive subgraph regex MUST designate the
		 * slash AFTER the root path to be sure we get the correct node, other wise deleting /ab
		 * would also delete /abc for example. so we must have our recursive delete identify
		 * deleting "/ab" as starting with "/ab/"
		 */

		// we call clean to be sure we don't end up writing the node BACK out AFTER we delete it.
		// MongoThreadLocal.clean(node);
		node.setDeleted(true);
		ops.remove(node);
	}

	/* Warning: This won't scale */
	public Iterable<SubNode> findAllNodes(MongoSession session) {
		requireAdmin(session);
		return ops.findAll(SubNode.class);
	}

	/* todo-0: add auth check */
	public UserPreferencesNode getUserPreference(MongoSession session, String path) {
		if (path.equals("/")) {
			throw new RuntimeException("SubNode doesn't implement the root node. Root is implicit and never needs an actual node to represent it.");
		}

		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).is(path));
		return ops.findOne(query, UserPreferencesNode.class);
	}

	/* todo-0: add auth check */
	public UserPreferencesNode getUserPreference(MongoSession session, ObjectId objId) {
		return ops.findById(objId, UserPreferencesNode.class);
	}

	public List<AccessControlEntryInfo> getAclEntries(MongoSession session, SubNode node) {
		HashMap<String, String> aclMap = node.getAcl();
		if (aclMap == null) {
			return null;
		}
		final List<AccessControlEntryInfo> ret = new LinkedList<AccessControlEntryInfo>();

		aclMap.forEach((k, v) -> {
			AccessControlEntryInfo acei = createAccessControlEntryInfo(session, k, v);
			if (acei != null) {
				ret.add(acei);
			}
		});

		return ret.size() == 0 ? null : ret;
	}

	public AccessControlEntryInfo createAccessControlEntryInfo(MongoSession session, String principalId, String authType) {
		String principalName = null;

		/* If this is a share to public we don't need to looup a user name */
		if (principalId.equalsIgnoreCase(NodePrincipal.PUBLIC)) {
			principalName = NodePrincipal.PUBLIC;
		}
		/* else we need the user name */
		else {
			SubNode principalNode = getNode(session, principalId, false);
			if (principalNode == null) {
				return null;
			}
			principalName = principalNode.getStringProp(NodeProp.USER);
		}

		AccessControlEntryInfo info = new AccessControlEntryInfo(principalName, principalId);
		info.addPrivilege(new PrivilegeInfo(authType));
		return info;
	}

	public SubNode getNode(MongoSession session, String path) {
		return getNode(session, path, true);
	}

	public SubNode getNode(MongoSession session, String path, boolean allowAuth) {
		if (path.equals("/")) {
			throw new RuntimeException("SubNode doesn't implement the root node. Root is implicit and never needs an actual node to represent it.");
		}

		if (!path.startsWith("/")) {
			return getNode(session, new ObjectId(path), allowAuth);
		}

		path = XString.stripIfEndsWith(path, "/");
		SubNode ret = null;

		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).is(path));
		ret = ops.findOne(query, SubNode.class);

		if (allowAuth) {
			auth(session, ret, PrivilegeType.READ);
		}
		return ret;
	}

	public SubNode getNode(MongoSession session, ObjectId objId) {
		return getNode(session, objId, true);
	}

	public SubNode getNode(MongoSession session, ObjectId objId, boolean allowAuth) {
		SubNode ret = null;
		ret = ops.findById(objId, SubNode.class);
		if (allowAuth) {
			auth(session, ret, PrivilegeType.READ);
		}
		return ret;
	}

	public SubNode getParent(MongoSession session, SubNode node) {
		String path = node.getPath();
		if ("/".equals(path)) {
			return null;
		}
		String parentPath = XString.truncateAfterLast(path, "/");
		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).is(parentPath));
		SubNode ret = ops.findOne(query, SubNode.class);
		auth(session, ret, PrivilegeType.READ);
		return ret;
	}

	public boolean isImageAttached(SubNode node) {
		String mime = node.getStringProp(NodeProp.BIN_MIME);
		return ImageUtil.isImageMime(mime);
	}

	public ImageSize getImageSize(SubNode node) {
		return Convert.getImageSize(node);
	}

	public List<SubNode> getChildrenAsList(MongoSession session, SubNode node, boolean ordered, Integer limit) {
		Iterable<SubNode> iter = getChildren(session, node, ordered, limit);
		List<SubNode> list = new LinkedList<SubNode>();
		iter.forEach(list::add);
		return list;
	}

	/*
	 * If node is null it's path is considered empty string, and it represents the 'root' of the
	 * tree. There is no actual NODE that is root node
	 */
	public Iterable<SubNode> getChildren(MongoSession session, SubNode node, boolean ordered, Integer limit) {
		auth(session, node, PrivilegeType.READ);

		Query query = new Query();
		if (limit != null) {
			query.limit(limit.intValue());
		}
		/*
		 * This regex finds all that START WITH "path/" and then end with some other string that
		 * does NOT contain "/", so that we know it's not at a deeper level of the tree, but is
		 * immediate children of 'node'
		 * 
		 * ^:aa:bb:([^:])*$
		 * 
		 * example: To find all DIRECT children (non-recursive) under path /aa/bb regex is
		 * ^\/aa\/bb\/([^\/])*$ (Note that in the java string the \ becomes \\ below...)
		 * 
		 */
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node == null ? "" : node.getPath()));
		if (ordered) {
			query.with(new Sort(Sort.Direction.ASC, SubNode.FIELD_ORDINAL));
		}
		query.addCriteria(criteria);

		return ops.find(query, SubNode.class);
	}

	/*
	 * All we need to do here is query for children an do a "max(ordinal)" operation on that, but
	 * digging the information off the web for how to do this appears to be something that may take
	 * a few hours so i'm skipping it for now and just doing an inverse sort on ORDER and pulling
	 * off the top one and using that for my MAX operation. AFAIK this might even be the most
	 * efficient approach. Who knows. MongoDb is stil the wild wild west of databases.
	 */
	public Long getMaxChildOrdinal(MongoSession session, SubNode node) {
		// Do not delete this commented garbage. Can be helpful to get aggregates working.
		// MatchOperation match = new MatchOperation(Criteria.where("quantity").gt(quantity));
		// GroupOperation group = Aggregation.group("giftCard").sum("giftCard").as("count");
		// Aggregation aggregate = Aggregation.newAggregation(match, group);
		// Order is drprecated
		// AggregationResults<Order> orderAggregate = ops.aggregate(aggregate, "order",
		// Order.class);
		// Aggregation agg = Aggregation.newAggregation(//
		// Aggregation.match(Criteria.where("quantity").gt(1)), //
		// Aggregation.group(SubNode.FIELD_ORDINAL).max().as("count"));
		//
		// AggregationResults<SubNode> results = ops.aggregate(agg, "order", SubNode.class);
		// List<SubNode> orderCount = results.getMappedResults();
		auth(session, node, PrivilegeType.READ);

		// todo-1: research if there's a way to query for just one, rather than simply calling
		// findOne at the end? What's best practice here?
		Query query = new Query();
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()));
		query.with(new Sort(Sort.Direction.DESC, SubNode.FIELD_ORDINAL));
		query.addCriteria(criteria);

		SubNode nodeFound = ops.findOne(query, SubNode.class);
		if (nodeFound == null) {
			return 0L;
		}
		return nodeFound.getOrdinal();
	}

	public SubNode getSiblingAbove(MongoSession session, SubNode node) {
		auth(session, node, PrivilegeType.READ);

		if (node.getOrdinal() == null) {
			throw new RuntimeException("can't get node above node with null ordinal.");
		}

		// todo-1: research if there's a way to query for just one, rather than simply calling
		// findOne at the end? What's best practice here?
		Query query = new Query();
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getParentPath()));
		query.with(new Sort(Sort.Direction.DESC, SubNode.FIELD_ORDINAL));
		query.addCriteria(criteria);

		// leave this example. you can do a RANGE like this.
		// query.addCriteria(Criteria.where(SubNode.FIELD_ORDINAL).lt(50).gt(20));
		query.addCriteria(Criteria.where(SubNode.FIELD_ORDINAL).lt(node.getOrdinal()));

		SubNode nodeFound = ops.findOne(query, SubNode.class);
		return nodeFound;
	}

	public SubNode getSiblingBelow(MongoSession session, SubNode node) {
		auth(session, node, PrivilegeType.READ);
		if (node.getOrdinal() == null) {
			throw new RuntimeException("can't get node above node with null ordinal.");
		}

		// todo-1: research if there's a way to query for just one, rather than simply calling
		// findOne at the end? What's best practice here?
		Query query = new Query();
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getParentPath()));
		query.with(new Sort(Sort.Direction.ASC, SubNode.FIELD_ORDINAL));
		query.addCriteria(criteria);

		// leave this example. you can do a RANGE like this.
		// query.addCriteria(Criteria.where(SubNode.FIELD_ORDINAL).lt(50).gt(20));
		query.addCriteria(Criteria.where(SubNode.FIELD_ORDINAL).gt(node.getOrdinal()));

		SubNode nodeFound = ops.findOne(query, SubNode.class);
		return nodeFound;
	}

	public int skip(Iterator<SubNode> iter, int count) {
		int iterCount = 0;
		for (int i = 0; i < count; i++) {
			if (!iter.hasNext()) {
				break;
			}
			iter.next();
			iterCount++;
		}
		return iterCount;
	}

	/*
	 * Gets (recursively) all nodes under 'node', by using all paths starting with the path of that
	 * node
	 * 
	 * todo-0: Haven't written a test case for this yet.
	 */
	public Iterable<SubNode> getSubGraph(MongoSession session, SubNode node) {
		auth(session, node, PrivilegeType.READ);

		Query query = new Query();
		/*
		 * This regex finds all that START WITH path, have some characters after path, before the
		 * end of the string. Without the trailing (.+)$ we would be including the node itself in
		 * addition to all its children.
		 */
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexRecursiveChildrenOfPath(node.getPath()));
		query.addCriteria(criteria);

		return ops.find(query, SubNode.class);
	}

	public Iterable<SubNode> searchSubGraph(MongoSession session, SubNode node, String text, String sortField, int limit) {
		auth(session, node, PrivilegeType.READ);

		Query query = new Query();
		query.limit(limit);
		/*
		 * This regex finds all that START WITH path, have some characters after path, before the
		 * end of the string. Without the trailing (.+)$ we would be including the node itself in
		 * addition to all its children.
		 */
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexRecursiveChildrenOfPath(node.getPath()));
		query.addCriteria(criteria);

		if (!StringUtils.isEmpty(text)) {
			TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matching(text).caseSensitive(false);
			query.addCriteria(textCriteria);
		}

		if (!StringUtils.isEmpty(sortField)) {
			query.with(new Sort(Sort.Direction.DESC, sortField));
		}

		return ops.find(query, SubNode.class);
	}

	public int dump(String message, Iterable<SubNode> iter) {
		int count = 0;
		log.debug("    " + message);
		for (SubNode node : iter) {
			log.debug("    DUMP node: " + XString.prettyPrint(node));
			count++;
		}
		log.debug("DUMP count=" + count);
		return count;
	}

	public void dropAllIndexes(MongoSession session) {
		requireAdmin(session);
		ops.indexOps(SubNode.class).dropAllIndexes();
	}

	public void createUniqueIndex(MongoSession session, Class<?> clazz, String property) {
		requireAdmin(session);
		ops.indexOps(clazz).ensureIndex(new Index().on(property, Direction.ASC).unique());
	}

	public void createIndex(MongoSession session, Class<?> clazz, String property) {
		requireAdmin(session);
		ops.indexOps(clazz).ensureIndex(new Index().on(property, Direction.ASC));
	}

	public void createIndex(MongoSession session, Class<?> clazz, String property, Direction dir) {
		requireAdmin(session);
		ops.indexOps(clazz).ensureIndex(new Index().on(property, dir));
	}

	public void createTextIndex(MongoSession session, Class<?> clazz) {
		requireAdmin(session);

		TextIndexDefinition textIndex = new TextIndexDefinitionBuilder().onAllFields()
				// .onField(property)
				// .onField("middleName")
				// .onField("lastName")
				// .onField("emailId")
				.build();

		ops.indexOps(clazz).ensureIndex(textIndex);
	}

	public void dropCollection(MongoSession session, Class<?> clazz) {
		requireAdmin(session);
		ops.dropCollection(clazz);
	}

	public void writeStream(MongoSession session, SubNode node, InputStream stream, String fileName, String mimeType, String propName) {
		auth(session, node, PrivilegeType.WRITE);
		if (propName == null) {
			propName = "bin";
		}

		if (fileName == null) {
			fileName = "file";
		}

		DBObject metaData = new BasicDBObject();
		metaData.put("nodeId", node.getId());

		/* Delete any existing grid data stored under this node, before waving new attachment */
		deleteBinary(session, node, null);
		String id = grid.store(stream, fileName, mimeType, metaData).getId().toString();

		/* Now save the node also since the property on it needs to point to GridFS id */
		node.setProp(propName, new SubNodePropVal(id));
	}

	public void deleteBinary(MongoSession session, SubNode node, String propName) {
		auth(session, node, PrivilegeType.WRITE);
		if (propName == null) {
			propName = "bin";
		}
		String id = node.getStringProp(propName);
		if (id == null) {
			return;
			// not a problem. allow a delete when there's nothing to delete.
			// throw new RuntimeException("No property found as " + propName);
		}
		grid.delete(new Query(Criteria.where("_id").is(id)));
	}

	public InputStream getStream(MongoSession session, SubNode node, String propName) {
		auth(session, node, PrivilegeType.READ);
		if (propName == null) {
			propName = "bin";
		}

		GridFSDBFile gridFile = grid.findOne(new Query(Criteria.where("metadata.nodeId").is(node.getId())));
		if (gridFile == null) return null;
		return gridFile.getInputStream();
	}

	public AutoCloseInputStream getAutoClosingStream(MongoSession session, SubNode node, String propName) {
		return new AutoCloseInputStream(new BufferedInputStream(getStream(session, node, propName)));
	}

	public String regexDirectChildrenOfPath(String path) {
		path = XString.stripIfEndsWith(path, "/");
		return "^" + Pattern.quote(path) + "\\/([^\\/])*$";
	}

	// todo-1:
	// I think now that I'm including the trailing slash after path in this regex that I can remove
	// the (.+) piece?
	// I think i need to write some test cases just to text my regex functions!
	public String regexRecursiveChildrenOfPath(String path) {
		path = XString.stripIfEndsWith(path, "/");
		return "^" + Pattern.quote(path) + "\\/(.+)$";
	}

	/*
	 * For proof-of-concept i'm storing actual password, instead of a hash of it, which is what will
	 * be done in final production code.
	 * 
	 * todo-0: not yet checking if the user exists. Need to throw error if user exists.
	 */
	public SubNode createUser(MongoSession session, String user, String email, String password, boolean automated) {
		requireAdmin(session);
		SubNode userNode = createNode(session, "/" + NodeName.ROOT + "/" + NodeName.USER + "/?", null);
		userNode.setProp(NodeProp.USER, user);
		userNode.setProp(NodeProp.EMAIL, email);
		userNode.setProp(NodeProp.PASSWORD, password);
		userNode.setProp(NodeProp.CONTENT, "Root for User: " + user);
		userNode.setProp(NodeProp.USER_PREF_ADV_MODE, false);
		userNode.setProp(NodeProp.USER_PREF_EDIT_MODE, false);

		if (!automated) {
			userNode.setProp(NodeProp.SIGNUP_PENDING, true);
		}

		save(session, userNode);

		/*
		 * The user root nodes are the owners of themselves.
		 * 
		 * todo-0: fix the uglyness of having to do TWO saves when adding a user.
		 */
		userNode.setOwner(userNode.getId());
		save(session, userNode);

		return userNode;
	}

	public SubNode getUserNodeByUserName(MongoSession session, String user) {
		if (NodePrincipal.ADMIN.equalsIgnoreCase(user)) {
			return getNode(session, "/" + NodeName.ROOT);
		}

		Query query = new Query();
		Criteria criteria = Criteria.where(//
				SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath("/" + NodeName.ROOT + "/" + NodeName.USER))//
				.and(SubNode.FIELD_PROPERTIES + "." + NodeProp.USER + ".value").is(user);
		query.addCriteria(criteria);
		SubNode ret = ops.findOne(query, SubNode.class);
		auth(session, ret, PrivilegeType.READ);
		return ret;
	}

	public MongoSession login(String userName, String password) {
		MongoSession session = MongoSession.createFromUser(NodePrincipal.ANONYMOUS);

		/*
		 * If username is null or anonymous, we assume anonymous is acceptable and return anonymous
		 * session or else we check the credentials.
		 */
		if (userName != null && !userName.equals(NodePrincipal.ANONYMOUS)) {
			SubNode userNode = getUserNodeByUserName(getAdminSession(), userName);
			if (userNode != null && userNode.getStringProp(NodeProp.PASSWORD).equals(password)) {
				session.setUser(userName);
				session.setUserNode(userNode);
			}
		}
		return session;
	}

	/*
	 * Initialize admin user account credentials into repository if not yet done. This should only
	 * get triggered the first time the repository is created, the first time the app is started.
	 * 
	 * The admin node is also the repository root node, so it owns all other nodes, by the
	 * definition of they way security is inheritive.
	 */
	public void createAdminUser(MongoSession session) {
		// todo-0: major inconsistency: is admin name defined in properties file or in
		// NodePrincipal.ADMIN const ? Need to decide.
		String adminUser = appProp.getMongoAdminUserName();
		String adminPwd = appProp.getMongoAdminPassword();

		SubNode adminNode = getUserNodeByUserName(getAdminSession(), adminUser);
		if (adminNode == null) {
			adminNode = jcrUtil.ensureNodeExists(session, "/", NodeName.ROOT, "Repository Root");

			adminNode.setProp(NodeProp.USER, NodePrincipal.ADMIN);
			adminNode.setProp(NodeProp.PASSWORD, adminPwd);
			adminNode.setProp(NodeProp.USER_PREF_ADV_MODE, false);
			adminNode.setProp(NodeProp.USER_PREF_EDIT_MODE, false);
			save(session, adminNode);

			jcrUtil.ensureNodeExists(session, "/" + NodeName.ROOT, NodeName.USER, "Root of All Users");
			jcrUtil.ensureNodeExists(session, "/" + NodeName.ROOT, NodeName.OUTBOX, "System Email Outbox");
		}
	}
}
