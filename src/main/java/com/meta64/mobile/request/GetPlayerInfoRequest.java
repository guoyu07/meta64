package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

public class GetPlayerInfoRequest extends RequestBase {

	/* media being played */
	private String url;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
