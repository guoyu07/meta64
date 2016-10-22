package com.meta64.mobile.response;

import com.meta64.mobile.response.base.OakResponseBase;

public class GetPlayerInfoResponse extends OakResponseBase {
	private Integer timeOffset;

	public Integer getTimeOffset() {
		return timeOffset;
	}

	public void setTimeOffset(Integer timeOffset) {
		this.timeOffset = timeOffset;
	}
}
