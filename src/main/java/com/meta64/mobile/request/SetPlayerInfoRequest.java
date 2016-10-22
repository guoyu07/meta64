package com.meta64.mobile.request;

import com.meta64.mobile.response.base.OakResponseBase;

public class SetPlayerInfoRequest extends OakResponseBase {
	
	/* media being played */
	private String url;
	
	/* current time offset user was last positioned at */
	private Integer timeOffset;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getTimeOffset() {
		return timeOffset;
	}

	public void setTimeOffset(Integer timeOffset) {
		this.timeOffset = timeOffset;
	}
}
