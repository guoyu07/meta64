package com.meta64.mobile.mongo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.mongo.model.SubNode;

public class MongoSession {
	private static final Logger log = LoggerFactory.getLogger(SubNode.class);
	
	private String user;
	private SubNode userNode;

	private MongoSession() {
	}

	public static MongoSession createFromUser(String user) {
		MongoSession session = new MongoSession();
		session.setUser(user);
		return session;
	}

	public static MongoSession createFromNode(SubNode userNode) {
		MongoSession session = new MongoSession();
		session.setUserNode(userNode);
		return session;
	}

	public boolean isAdmin() {
		return NodePrincipal.ADMIN.equals(user);
	}

	public boolean isAnon() {
		return NodePrincipal.ANONYMOUS.equals(user);
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public SubNode getUserNode() {
		if (isAnon()) {
			log.debug("Attempted to get UserNode on anonymous session. This is almost always a bug/unintentional");
		}
		return userNode;
	}

	public void setUserNode(SubNode userNode) {
		this.userNode = userNode;
	}
}
