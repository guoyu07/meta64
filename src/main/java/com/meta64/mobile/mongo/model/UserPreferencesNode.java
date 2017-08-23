package com.meta64.mobile.mongo.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.TypeAlias;

@TypeAlias("usrPref")
public class UserPreferencesNode extends SubNode {
	private String userPrefString;
	
	public UserPreferencesNode(ObjectId owner, String path, String type) {
		super(owner, path, type, null);
	}

	public String getUserPrefString() {
		return userPrefString;
	}

	public void setUserPrefString(String userPrefString) {
		this.userPrefString = userPrefString;
	}
}
