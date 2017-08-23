package com.meta64.mobile.model;

/**
 * Models a Referenceable node.
 * 
 * NOTE: It was a coincidence that the JCR interpretation of this is the SAME as the Mongo one: That is, we have an ID
 * that is distinct from the path in both situations, so this class works for both.
 *
 */
public class RefInfo {
	private String id;
	private String path;

	public RefInfo(String id, String path) {
		this.id = id;
		this.path = path;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}
