package com.meta64.mobile.rss.model;

public class FeedNodeInfo {
	private String url;
	private String nodeId;
	private boolean inProgress;
	private int entryCount;
	private int entriesComplete;

	public int getEntriesComplete() {
		return entriesComplete;
	}

	public void setEntriesComplete(int entriesComplete) {
		this.entriesComplete = entriesComplete;
	}

	public int getEntryCount() {
		return entryCount;
	}

	public void setEntryCount(int entryCount) {
		this.entryCount = entryCount;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public boolean isInProgress() {
		return inProgress;
	}

	public void setInProgress(boolean inProgress) {
		this.inProgress = inProgress;
	}

	public String getStatus() {
		return ("URL: " + url + " nodeId=" + nodeId + " inProgress=" + inProgress + " entryCount=" + entryCount + " entriesComplete=" + entriesComplete);
	}
}
