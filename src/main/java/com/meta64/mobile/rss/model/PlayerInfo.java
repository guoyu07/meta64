package com.meta64.mobile.rss.model;

public class PlayerInfo {
	private Integer timeOffset;
	
	/* todo-0: I ended up not needing this so can delete now */
	private String nodePath;

	public Integer getTimeOffset() {
		return timeOffset;
	}

	public void setTimeOffset(Integer timeOffset) {
		this.timeOffset = timeOffset;
	}

	public String getNodePath() {
		return nodePath;
	}

	public void setNodePath(String nodePath) {
		this.nodePath = nodePath;
	}
}
