package com.meta64.mobile.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodePropVal;
import com.meta64.mobile.mongo.model.UserPreferencesNode;
import com.meta64.mobile.util.XString;

/**
 * MongoDB Testing
 * 
 * On 8/7/2017 the decision was made by the developer of SubNode to phase out the JCR (Jackrabbit
 * Oak). The JCR has been around for a full 10 years now and has failed to gain significant traction
 * among developers. I finally decided JCR is not the "leading edge" thing I had hoped it was but is
 * really just a dead or dying technology for now. I need something that has a massive marketshare
 * and MongoDB is about 100x times as popular as Jackrabbit/Oak, so it's time to throw in the towel
 * with the JCR. This is NOT a rewrite of the app. It will only be 10% of the code at the most that
 * changes beause of the fact that the NoSQL nature of JCR fits perfectly into a MongoDB
 * architecture, so this is really a huge advancement, rather than a step back, because MongoDB does
 * everything in a slightly more modern way than what was envisioned over a decade ago when the JCR
 * was designed.
 * 
 * This class is the experimental testbed where most of the nuts and bolts of MongoDB will be worked
 * out before phasing it into the core product code.
 * 
 * https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
 * https://github.com/spring-projects/spring-data-examples/tree/master/mongodb
 * https://docs.spring.io/spring-data/data-mongo/docs/current/reference/html/
 * http://www.baeldung.com/spring-data-mongodb-index-annotations-converter
 * 
 * to start:
 * 
 * sudo service mongod start
 * 
 * (log file is here: /var/log/mongodb/mongod.log -- which should show a startup message and
 * listening on port 27017)
 * 
 */

// NOTE: I'm disabling the JUnit because for some reason Eclipse refuses to allow the debugger to
// work when running test cases
// so i'm just saying to hell witih JUnit (no time for that), and just running junit as part of
// NORMAL debugging startup
// @RunWith(SpringJUnit4ClassRunner.class)
// @ContextConfiguration(classes = AppServer.class)
// @WebAppConfiguration
// @TestPropertySource({ "classpath:application.properties",
// "file:/home/clay/ferguson/meta64Oak-private/test.properties" })
@Component
public class MongoTest {
	private static final Logger log = LoggerFactory.getLogger(MongoTest.class);

	@Autowired
	private MongoApi api;

	public void wipeDb(MongoSession session) {
		api.dropAllIndexes(session);
		api.dropCollection(session, SubNode.class);
	}

	// @Test
	public void mainTest() {

		log.debug("*****************************************************************************************");
		log.debug("MongoTest Running!");
		long expectedCount = api.getNodeCount();
		MongoSession adminSession = api.getAdminSession();

		SubNode adminNode = api.getUserNodeByUserName(adminSession, "admin");
		if (adminNode == null) {
			throw new RuntimeException("Unable to find admin user node.");
		}

		// ----------Insert a test node
		SubNode node = api.createNode(adminSession, "/usrx");
		node.setProp("testKey", new SubNodePropVal("testVal"));
		api.save(adminSession, node);
		expectedCount++;
		log.debug("inserted first node.");

		SubNode nodeFoundById = api.getNode(adminSession, node.getId());
		if (nodeFoundById == null) {
			throw new RuntimeException("Unable to find node by id.");
		}

		SubNode nodeFoundByStrId = api.getNode(adminSession, node.getId().toHexString());
		if (nodeFoundByStrId == null) {
			throw new RuntimeException("Unable to find node by id: " + node.getId().toHexString());
		}

		node.setProp("testKeyA", new SubNodePropVal("tesetValA"));
		api.save(adminSession, node);
		log.debug("updated first node.");

		String stuffGuyName = "stuffguy";
		SubNode stuffOwnerNode = api.createUser(adminSession, stuffGuyName, "", "passy", true);
		MongoSession stuffSession = MongoSession.createFromNode(stuffOwnerNode);
		expectedCount++;

		SubNode stuffrootNode = api.createNode(stuffSession, "/stuffroot");
		api.save(adminSession, stuffrootNode);
		expectedCount++;
		log.debug("inserted stuffroot node.");

		SubNode stuffNode = api.createNode(stuffSession, "/stuffroot/stuff");
		api.save(adminSession, stuffNode);
		expectedCount++;
		log.debug("inserted stuff node.");

		// ----------Save a node that uses inheritance (SubNode base class)
		UserPreferencesNode userPrefsNode = api.createUserPreferencesNode(adminSession, "/stuffroot/userPrefs");
		userPrefsNode.setUserPrefString("my test pref value");
		api.save(adminSession, userPrefsNode);
		expectedCount++;
		log.debug("inserted userPrefs node: " + XString.prettyPrint(userPrefsNode));

		Iterable<SubNode> nodesIter = api.findAllNodes(adminSession);
		api.dump("Dump check", nodesIter);

		UserPreferencesNode userPrefsNode2 = api.getUserPreference(adminSession, userPrefsNode.getPath());
		if (userPrefsNode2 == null || !userPrefsNode.getUserPrefString().equals(userPrefsNode2.getUserPrefString())) {
			throw new RuntimeException("unable to read UserPrefence test object by path");
		}

		UserPreferencesNode userPrefsNode3 = api.getUserPreference(adminSession, userPrefsNode.getId());
		if (userPrefsNode3 == null) {
			throw new RuntimeException("unable to read UserPrefence test object by ID: " + userPrefsNode.getId());
		}

		if (!userPrefsNode.getUserPrefString().equals(userPrefsNode3.getUserPrefString())) {
			throw new RuntimeException("unable to read UserPrefence test object by ID. Value is not correct.");
		}

		// ----------Dump current data
		nodesIter = api.findAllNodes(adminSession);
		int count1 = api.dump("Dump after first inserts", nodesIter);
		if (count1 != expectedCount) {
			throw new RuntimeException("unable to add first records.");
		}

		// ----------Verify getParent works
		SubNode parent = api.getParent(adminSession, stuffNode);
		if (!parent.getPath().equals("/stuffroot")) {
			throw new RuntimeException("getParent failed.");
		}

		// ----------Verify an attempt to write a duplicate 'path' fails
		boolean uniqueViolationCaught = false;
		try {
			SubNode dupNode = api.createNode(adminSession, "/usrx");
			api.save(adminSession, dupNode);
		}
		catch (Exception e) {
			uniqueViolationCaught = true;
		}

		if (!uniqueViolationCaught) {
			throw new RuntimeException("Failed to catch unique constraint violation.");
		}

		// ----------Insert a sub-node under the existing node
		log.debug("Inserting children next...");
		long childCount = 5;
		addTestChildren(adminSession, node, childCount);
		expectedCount += childCount;

		// ----------Dump current content before any deletes
		Iterable<SubNode> nodesIter1 = api.findAllNodes(adminSession);
		int count = api.dump("Dumping before any deletes", nodesIter1);
		if (count != expectedCount) {
			throw new RuntimeException("unable to add child record.");
		}

		readAllChildrenOneByOne(adminSession, node, childCount);

		// ---------Delete one node
		api.delete(adminSession, node);

		// deleted the node AND all children.
		expectedCount -= (1 + childCount);

		// ----------Check that deletion worked
		Iterable<SubNode> nodesIter2 = api.findAllNodes(adminSession);
		count = api.dump("Dump after deletes", nodesIter2);
		if (count != expectedCount) {
			throw new RuntimeException("unable to delete record, or count is off");
		}

		runBinaryTests(adminSession);

		// api.dropCollection(Node.class);
		log.debug("Mongo Test Ok.");
		log.debug("*****************************************************************************************");
	}

	public void readAllChildrenOneByOne(MongoSession session, SubNode node, long assertCount) {
		log.debug("Getting all children of node at path: " + node.getPath());

		List<Long> ordinalList = new LinkedList<Long>();
		List<ObjectId> idList = new LinkedList<ObjectId>();
		List<String> pathList = new LinkedList<String>();

		/* Make sure we can read the child count from a query */
		long count = api.getChildCount(node);
		if (count != assertCount) {
			throw new RuntimeException("Child count query failed.");
		}
		log.debug("child count query successful.");

		/* check that we can get all the children */
		Iterable<SubNode> childrenIter = api.getChildren(session, node, true, null);
		count = api.dump("Dumping ordered children", childrenIter);

		// ----------Read all ordinals. We don't assume they are all perfectly numbered here. (might
		// be dupliates or missing ones)
		for (SubNode n : childrenIter) {
			ordinalList.add(n.getOrdinal());
		}

		// ---------Read all by indexes.
		for (long i : ordinalList) {
			SubNode n = api.getChildAt(session, node, i);
			if (n == null) {
				throw new RuntimeException("getChildAt " + i + " failed and returned null.");
			}
			if (n.getOrdinal() != i) {
				throw new RuntimeException("Ordinal " + n.getOrdinal() + " found when " + i + " was expected.");
			}
			idList.add(n.getId());
			pathList.add(n.getPath());
		}
		log.debug("random access by idx successful.");

		// ---------Read all by IDs.
		for (ObjectId id : idList) {
			SubNode n = api.getNode(session, id);
			if (!n.getId().equals(id)) {
				throw new RuntimeException("ID " + n.getId() + " found when " + id + " was expected.");
			}
		}
		log.debug("random access by ids successful.");

		// ---------Read all by Paths.
		for (String path : pathList) {
			SubNode n = api.getNode(session, path);
			if (!n.getPath().equals(path)) {
				throw new RuntimeException("Path " + n.getPath() + " found when " + path + " was expected.");
			}
		}
		log.debug("random access by paths successful.");
	}

	public void runBinaryTests(MongoSession session) {
		log.debug("Running binaries tests.");

		try {
			SubNode node = api.createNode(session, "/binaries");
			api.save(session, node);
			api.writeStream(session, node, new FileInputStream("/home/clay/test-image.png"), null, "image/png", null);
			api.save(session, node);

			log.debug("inserted root for binary testing.", null, "image/png", null);

			InputStream inStream = api.getStream(session, node, null);
			FileUtils.copyInputStreamToFile(inStream, new File("/home/clay/test-image2.png"));
			log.debug("completed reading back the file, and writing out a copy.");
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public void addTestChildren(MongoSession session, SubNode node, long count) {
		String parentPath = node.getPath();
		for (int i = 0; i < count; i++) {
			SubNode newNode = api.createNode(session, parentPath + "/subNode" + i);

			/*
			 * we invert ordering 'count-i' (reverse order) so that we can be sure our query testing
			 * for pulling results in order won't accidentally work and is truly ordering in the
			 * query
			 */
			newNode.setOrdinal(count - i - 1);
			api.save(session, newNode);
		}

		Long maxOrdinal = api.getMaxChildOrdinal(session, node);
		if (maxOrdinal == null || maxOrdinal.longValue() != count - 1) {
			throw new RuntimeException("Expected max ordinal of " + (count - 1) + " but found " + maxOrdinal);
		}
	}
}
