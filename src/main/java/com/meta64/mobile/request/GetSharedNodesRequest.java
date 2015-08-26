package com.meta64.mobile.request;

public class GetSharedNodesRequest {

	/* can be node id or path. server interprets correctly no matter which */
	private String nodeId;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
}
