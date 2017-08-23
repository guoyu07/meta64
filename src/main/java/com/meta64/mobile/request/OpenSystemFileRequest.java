package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

public class OpenSystemFileRequest extends RequestBase {
	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
