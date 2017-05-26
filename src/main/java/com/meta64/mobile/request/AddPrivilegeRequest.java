package com.meta64.mobile.request;

import java.util.List;

import com.meta64.mobile.request.base.OakRequestBase;

public class AddPrivilegeRequest extends OakRequestBase {

	private String nodeId;

	/* for now only 'public' is the only option we support */
	private List<String> privileges;

	private String principal;

	/* if this is null, we ignore it and make no change */
	private Boolean publicAppend;

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getPrincipal() {
		return principal;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	public List<String> getPrivileges() {
		return privileges;
	}

	public void setPrivileges(List<String> privileges) {
		this.privileges = privileges;
	}

	public Boolean getPublicAppend() {
		return publicAppend;
	}

	public void setPublicAppend(Boolean publicAppend) {
		this.publicAppend = publicAppend;
	}
}
