package com.meta64.mobile.mongo;

import java.io.InputStream;
import java.util.Iterator;
import java.util.regex.Pattern;

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
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.image.ImageSize;
import com.meta64.mobile.image.ImageUtil;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeProperty;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.mongo.model.UserPreferencesNode;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
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
	private JcrUtil jcrUtil;

	private static final MongoSession adminSession = MongoSession.createFromUser(JcrPrincipal.ADMIN);
	private static final MongoSession anonSession = MongoSession.createFromUser(JcrPrincipal.ANONYMOUS);

	public MongoSession getAdminSession() {
		return adminSession;
	}

	public MongoSession getAnonSession() {
		return anonSession;
	}

	public void requireAdmin(MongoSession session) {
		if (!session.isAdmin()) throw new RuntimeException("auth fail");
	}

	public void authRead(MongoSession session, SubNode node) {
		// todo-0; implement. Throw Exception if user cannot write
	}

	public void authWrite(MongoSession session, SubNode node) {
		// todo-0; implement. Throw Exception if user cannot write
	}

	public void save(MongoSession session, SubNode node) {
		save(session, node, true);
	}

	public void save(MongoSession session, SubNode node, boolean updateThreadCache) {
		authWrite(session, node);
		//log.debug("MongoApi.save: DATA: " + XString.prettyPrint(node));
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
		return userNode.getStringProp(JcrProp.USER);
	}

	public void renameNode(MongoSession session, SubNode node, String newName) {
		newName = newName.trim();
		if (newName.length() == 0) {
			throw ExUtil.newEx("No node name provided.");
		}

		// todo-0: need a dedicated name validator utility function.
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
	 * todo-0: We could theoretically achieve a level of transactionality here if we were to setup a
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
				authWrite(session, node);
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

		ObjectId ownerId = null;
		if (session.isAdmin() && (path.equals("/") || path.equals("/" + JcrName.USER) || path.equals("/" + JcrName.USER + "/?"))) {
			// ownerId can stay null. bootstrapping new repo.
		}
		else {
			ownerId = getOwnerNodeIdFromSession(session);
		}

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

		for (SubNode child : getChildren(session, node)) {
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
		log.debug("MongoApi.getChildCount");

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
		log.debug("MongoApi.getCount");

		Query query = new Query();
		// Criteria criteria =
		// Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()));
		// query.addCriteria(criteria);

		return ops.count(query, SubNode.class);
	}

	public SubNode getChildAt(MongoSession session, SubNode node, long idx) {
		log.debug("MongoApi.getChildCountAt");

		Query query = new Query();
		Criteria criteria = Criteria.where(//
				SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()))//
				.and(SubNode.FIELD_ORDINAL).is(idx);
		query.addCriteria(criteria);

		SubNode ret = ops.findOne(query, SubNode.class);
		authRead(session, node);
		return ret;
	}

	public void checkParentExists(SubNode node) {
		boolean isRootPath = isRootPath(node.getPath());
		log.debug("IsRoot[" + node.getPath() + "]=" + isRootPath);
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
	 * todo-0: cleaning up GridFS will be done as an async thread. For now we can just let GridFS
	 * binary data get orphaned... BUT I think it might end up being super efficient if we have the
	 * 'path' stored in the GridFS metadata so we can use a 'regex' query to delete all the binaries
	 * which is exacly like the one below for deleting the nodes themselves.
	 * 
	 */
	public void delete(MongoSession session, SubNode node) {
		authWrite(session, node);
		log.debug("MongoApi.remove: id=" + node.getId());

		/*
		 * First delete all the children of the node by using the path, knowing all their paths
		 * 'start with' (as substring) this path. Note how efficient it is that we can delete an
		 * entire subgraph in one single operation! Nice!
		 */
		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).regex(regexRecursiveChildrenOfPath(node.getPath())));

		// todo-0: is this the FASTEST/BEST way to delete all matches to a query?
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
		log.debug("MongoApi.findAllNodes");
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

	public SubNode getNode(MongoSession session, String path) {
		if (path.equals("/")) {
			throw new RuntimeException("SubNode doesn't implement the root node. Root is implicit and never needs an actual node to represent it.");
		}

		if (!path.startsWith("/")) {
			return getNode(session, new ObjectId(path));
		}

		path = XString.stripIfEndsWith(path, "/");
		SubNode ret = null;

		Query query = new Query();
		query.addCriteria(Criteria.where(SubNode.FIELD_PATH).is(path));
		ret = ops.findOne(query, SubNode.class);

		authRead(session, ret);
		return ret;
	}

	public SubNode getNode(MongoSession session, ObjectId objId) {
		SubNode ret = null;
		ret = ops.findById(objId, SubNode.class);
		authRead(session, ret);
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
		authRead(session, ret);
		return ret;
	}

	public boolean isImageAttached(SubNode node) {
		String mime = node.getStringProp(JcrProp.BIN_MIME);
		return ImageUtil.isImageMime(mime);
	}

	public ImageSize getImageSize(SubNode node) {
		return Convert.getImageSize(node);
	}

	/**
	 * Gets children, that are by default ordered
	 */
	public Iterable<SubNode> getChildren(MongoSession session, SubNode node) {
		return getChildren(session, node, true);
	}

	public Iterable<SubNode> getChildren(MongoSession session, SubNode node, boolean ordered) {
		authRead(session, node);
		log.debug("MongoApi.getChildren: ordered=" + ordered);

		Query query = new Query();
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
		Criteria criteria = Criteria.where(SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath(node.getPath()));
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
		authRead(session, node);
		log.debug("MongoApi.getMaxChildOrdinal");

		// todo-0: research if there's a way to query for just one, rather than simply calling
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
		authRead(session, node);
		log.debug("MongoApi.getChildAbove");

		if (node.getOrdinal() == null) {
			throw new RuntimeException("can't get node above node with null ordinal.");
		}

		// todo-0: research if there's a way to query for just one, rather than simply calling
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
		authRead(session, node);
		log.debug("MongoApi.getChildAbove");

		if (node.getOrdinal() == null) {
			throw new RuntimeException("can't get node above node with null ordinal.");
		}

		// todo-0: research if there's a way to query for just one, rather than simply calling
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
		authRead(session, node);
		log.debug("MongoApi.getSubGraph");

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
		authRead(session, node);
		log.debug("MongoApi.searchSubGraph");

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
		log.debug("MongoApi.dump");
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
		log.debug("MongoApi.dropAllIndexes");
		ops.indexOps(SubNode.class).dropAllIndexes();
	}

	public void createUniqueIndex(MongoSession session, Class<?> clazz, String property) {
		requireAdmin(session);
		log.debug("MongoApi.createUniqueIndex");
		ops.indexOps(clazz).ensureIndex(new Index().on(property, Direction.ASC).unique());
	}

	public void createIndex(MongoSession session, Class<?> clazz, String property) {
		requireAdmin(session);
		log.debug("MongoApi.createIndex");
		ops.indexOps(clazz).ensureIndex(new Index().on(property, Direction.ASC));
	}

	public void createIndex(MongoSession session, Class<?> clazz, String property, Direction dir) {
		requireAdmin(session);
		log.debug("MongoApi.createIndex");
		ops.indexOps(clazz).ensureIndex(new Index().on(property, dir));
	}

	public void createTextIndex(MongoSession session, Class<?> clazz) {
		requireAdmin(session);
		log.debug("MongoApi.createTextIndex");

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
		log.debug("MongoApi.dropCollection");
		ops.dropCollection(clazz);
	}

	public void writeStream(MongoSession session, SubNode node, InputStream stream, String fileName, String mimeType, String propName) {
		authWrite(session, node);
		if (propName == null) {
			propName = "bin";
		}

		if (fileName == null) {
			fileName = "file";
		}

		DBObject metaData = new BasicDBObject();
		metaData.put("nodeId", node.getId());
		log.debug("Writing steam to GridFS");
		
		/* Delete any existing grid data stored under this node, before waving new attachment */
		deleteBinary(session, node, null);
		String id = grid.store(stream, fileName, mimeType, metaData).getId().toString();

		/* Now save the node also since the property on it needs to point to GridFS id */
		node.setProp(propName, new SubNodeProperty(id));
		//save(session, node);
		log.debug("Wrote GridFS file id: " + id);
	}

	public void deleteBinary(MongoSession session, SubNode node, String propName) {
		authWrite(session, node);
		if (propName == null) {
			propName = "bin";
		}
		String id = node.getStringProp(propName);
		if (id == null) {
			return;
			//not a problem. allow a delete when there's nothing to delete.
			//throw new RuntimeException("No property found as " + propName);
		}
		grid.delete(new Query(Criteria.where("_id").is(id)));
	}

	public InputStream getStream(MongoSession session, SubNode node, String propName) {
		authRead(session, node);
		if (propName == null) {
			propName = "bin";
		}

		GridFSDBFile gridFile = grid.findOne(new Query(Criteria.where("metadata.nodeId").is(node.getId())));
		if (gridFile == null) return null;
		return gridFile.getInputStream();
	}

	public String regexDirectChildrenOfPath(String path) {
		path = XString.stripIfEndsWith(path, "/");
		return "^" + Pattern.quote(path) + "\\/([^\\/])*$";
	}

	// todo-0:
	// I think now that I'm including the trailing slash after path in this regex that I can remove
	// the (.+) piece?
	// I think i need to write some test cases just to text my regex functions! String in and string
	// out black box.
	public String regexRecursiveChildrenOfPath(String path) {
		path = XString.stripIfEndsWith(path, "/");
		return "^" + Pattern.quote(path) + "\\/(.+)$";
	}

	/*
	 * For proof-of-concept i'm storing actual password, instead of hash of it, which is what would
	 * be done in final production code.
	 * 
	 * todo-0: not yet checking if the user exists. Need to throw error if user exists.
	 */
	public SubNode createUser(MongoSession session, String user, String email, String password) {
		requireAdmin(session);
		SubNode userNode = createNode(session, "/" + JcrName.USER + "/?", null);
		userNode.setProp(JcrProp.USER, user);
		userNode.setProp(JcrProp.EMAIL, email);
		userNode.setProp(JcrProp.PASSWORD, password);
		userNode.setProp(JcrProp.CONTENT, "Root for User: " + user);
		userNode.setProp(JcrProp.USER_PREF_ADV_MODE, false);
		userNode.setProp(JcrProp.USER_PREF_EDIT_MODE, false);

		save(session, userNode);
		// saveSession(session); <------- todo-0: this kind of call would be NICE, but is tricky
		// with NO ID yet to key on.

		/*
		 * The user root nodes are the owners of themselves. todo-0: fix the uglyness of having to
		 * do TWO saves when adding a user.
		 */
		userNode.setOwner(userNode.getId());
		save(session, userNode);

		return userNode;
	}

	public SubNode getUserNodeByUserName(MongoSession session, String user) {
		Query query = new Query();
		Criteria criteria = Criteria.where(//
				SubNode.FIELD_PATH).regex(regexDirectChildrenOfPath("/" + JcrName.USER))//
				.and(SubNode.FIELD_PROPERTIES + "." + JcrProp.USER + ".value").is(user);
		query.addCriteria(criteria);
		SubNode ret = ops.findOne(query, SubNode.class);
		authRead(session, ret);
		return ret;
	}

	public MongoSession login(String userName, String password) {
		MongoSession session = MongoSession.createFromUser(JcrPrincipal.ANONYMOUS);

		/*
		 * If username is null or anonymous, we assume anonymous is acceptable and return anonymous
		 * session or else we check the credentials.
		 */
		if (userName != null && !userName.equals(JcrPrincipal.ANONYMOUS)) {
			SubNode userNode = getUserNodeByUserName(getAdminSession(), userName);
			if (userNode != null && userNode.getStringProp(JcrProp.PASSWORD).equals(password)) {
				session.setUser(userName);
				session.setUserNode(userNode);
			}
		}
		return session;
	}

	/*
	 * Initialize admin user account credentials into repository if not yet done. This should only
	 * get triggered the first time the repository is created, the first time the app is started.
	 */
	public void createAdminUser(MongoSession session) {
		String adminUser = appProp.getMongoAdminUserName();
		String adminPwd = appProp.getMongoAdminPassword();

		SubNode adminNode = getUserNodeByUserName(getAdminSession(), adminUser);
		if (adminNode == null) {
			jcrUtil.ensureNodeExists(session, "/", JcrName.USER, "Root of All Users");
			adminNode = createUser(session, adminUser, null, adminPwd);
		}
	}

	/**
	 * GridFS Notes:
	 * 
	 * <pre>
	 * String id = "5602de6e5d8bba0d6f2e45e4";
	 * GridFSDBFile gridFsdbFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
	 * 
	 * List<GridFSDBFile> gridFsdbFiles = gridFsTemplate.find(new Query(Criteria.where("metadata.nodeId").is("xxxxxx")));
	 * 
	 * String id = "5702deyu6d8bba0d6f2e45e4";
	 * gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
	 *
	 * This searches based on filename pattern, i think which makes me wonder if i should just use the full node path
	 * as this filename ? but that would rule out ever having multiple binaries per node.
	 * 
	 * GridFsResource[] gridFsResource = gridFsTemplate.getResources("test*");
	 * 
	 * The GridFSDBFile API is quite simple as well:
	getInputStream – returns an InputStream from which data can be read
	getFilename – gets the filename of the file
	getMetaData – gets the metadata for the given file
	containsField – determines if the document contains a field with the given name
	get – gets a field from the object by name
	getId – gets the file’s object ID
	keySet – gets the object’s field names
	 * </pre>
	 */
}
