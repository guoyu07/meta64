package com.meta64.mobile.response;

import com.meta64.mobile.response.base.OakResponseBase;

public class FileSearchResponse extends OakResponseBase {

	private String searchResultNodeId;

	public String getSearchResultNodeId() {
		return searchResultNodeId;
	}

	public void setSearchResultNodeId(String searchResultNodeId) {
		this.searchResultNodeId = searchResultNodeId;
	}
}
