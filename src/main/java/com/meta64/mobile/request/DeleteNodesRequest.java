package com.meta64.mobile.request;

import java.util.List;

import com.meta64.mobile.request.base.OakRequestBase;

public class DeleteNodesRequest extends OakRequestBase {
	private List<String> nodeIds;

	public List<String> getNodeIds() {
		return nodeIds;
	}

	public void setNodeIds(List<String> nodeIds) {
		this.nodeIds = nodeIds;
	}
}
