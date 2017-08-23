package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

public class AnonPageLoadRequest extends RequestBase {
	private boolean ignoreUrl;

	public boolean isIgnoreUrl() {
		return ignoreUrl;
	}

	public void setIgnoreUrl(boolean ignoreUrl) {
		this.ignoreUrl = ignoreUrl;
	}
}
