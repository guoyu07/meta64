package com.meta64.mobile.response;

import com.meta64.mobile.response.base.OakResponseBase;

public class GetServerInfoResponse extends OakResponseBase {
	private String serverInfo;

	public String getServerInfo() {
		return serverInfo;
	}

	public void setServerInfo(String serverInfo) {
		this.serverInfo = serverInfo;
	}
	
}
