package com.meta64.mobile.response;

import com.meta64.mobile.response.base.ResponseBase;

public class RenameNodeResponse extends ResponseBase {
	private String newId;

	public String getNewId() {
		return newId;
	}

	public void setNewId(String newId) {
		this.newId = newId;
	}
}
