package com.meta64.mobile.response;

import com.meta64.mobile.response.base.ResponseBase;

public class RebuildIndexesResponse extends ResponseBase {
	private String serverInfo;

	public String getServerInfo() {
		return serverInfo;
	}

	public void setServerInfo(String serverInfo) {
		this.serverInfo = serverInfo;
	}

}
