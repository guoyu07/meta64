package com.meta64.mobile.request;

import com.meta64.mobile.request.base.OakRequestBase;

public class ExpandAbbreviatedNodeRequest extends OakRequestBase {
	private String nodeId;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
}
