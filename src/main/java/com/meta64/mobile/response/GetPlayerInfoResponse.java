package com.meta64.mobile.response;

import com.meta64.mobile.response.base.ResponseBase;

public class GetPlayerInfoResponse extends ResponseBase {
	private Integer timeOffset;

	public Integer getTimeOffset() {
		return timeOffset;
	}

	public void setTimeOffset(Integer timeOffset) {
		this.timeOffset = timeOffset;
	}
}
