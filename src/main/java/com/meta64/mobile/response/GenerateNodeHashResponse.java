package com.meta64.mobile.response;

import com.meta64.mobile.response.base.OakResponseBase;

public class GenerateNodeHashResponse extends OakResponseBase {
	private String hashInfo;

	public String getHashInfo() {
		return hashInfo;
	}

	public void setHashInfo(String hashInfo) {
		this.hashInfo = hashInfo;
	}
}
