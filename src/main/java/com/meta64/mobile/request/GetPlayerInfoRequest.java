package com.meta64.mobile.request;

import com.meta64.mobile.response.base.OakResponseBase;

public class GetPlayerInfoRequest extends OakResponseBase {
	
	/* media being played */
	private String url;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
