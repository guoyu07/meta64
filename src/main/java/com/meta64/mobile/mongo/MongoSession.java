package com.meta64.mobile.mongo;

import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.mongo.model.SubNode;

public class MongoSession {
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
		return JcrPrincipal.ADMIN.equals(user);
	}

	public boolean isAnon() {
		return JcrPrincipal.ANONYMOUS.equals(user);
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public SubNode getUserNode() {
		return userNode;
	}

	public void setUserNode(SubNode userNode) {
		this.userNode = userNode;
	}
}
