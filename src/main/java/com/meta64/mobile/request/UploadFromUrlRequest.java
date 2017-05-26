package com.meta64.mobile.request;

import com.meta64.mobile.request.base.OakRequestBase;

public class UploadFromUrlRequest extends OakRequestBase {

	private String nodeId;
	private String sourceUrl;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getSourceUrl() {
		return sourceUrl;
	}

	public void setSourceUrl(String sourceUrl) {
		this.sourceUrl = sourceUrl;
	}
}
