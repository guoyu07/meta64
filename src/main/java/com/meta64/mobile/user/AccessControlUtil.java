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

				// todo-1: this is a spot that can be optimized. We should be able to send just the
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

		// todo-1: for now we just support the owner privileges:
		MongoPrincipal principal = new MongoPrincipal();
		principal.setUserNodeId(node.getId());
		principal.setAccessLevel("w");
		principals.add(principal);

		return principals;
	}
}
