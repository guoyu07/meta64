package com.meta64.mobile.request;

import com.meta64.mobile.request.base.OakRequestBase;

public class DeletePropertyRequest extends OakRequestBase {
	private String nodeId;
	private String propName;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getPropName() {
		return propName;
	}

	public void setPropName(String propName) {
		this.propName = propName;
	}
}
