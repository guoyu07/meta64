package com.meta64.mobile.request;

public class CreateSubNodeRequest {
	private String nodeId;
	private String newNodeName;
	private String typeName;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getNewNodeName() {
		return newNodeName;
	}

	public void setNewNodeName(String newNodeName) {
		this.newNodeName = newNodeName;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
}
