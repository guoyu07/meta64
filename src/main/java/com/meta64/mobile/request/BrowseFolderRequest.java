package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

public class BrowseFolderRequest extends RequestBase {

	private String nodeId;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
}
