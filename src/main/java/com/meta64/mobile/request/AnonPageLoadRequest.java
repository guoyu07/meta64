package com.meta64.mobile.request;

import com.meta64.mobile.request.base.OakRequestBase;

public class AnonPageLoadRequest extends OakRequestBase {
	private boolean ignoreUrl;

	public boolean isIgnoreUrl() {
		return ignoreUrl;
	}

	public void setIgnoreUrl(boolean ignoreUrl) {
		this.ignoreUrl = ignoreUrl;
	}
}
