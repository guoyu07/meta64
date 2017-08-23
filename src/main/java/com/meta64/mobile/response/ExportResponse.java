package com.meta64.mobile.response;

import com.meta64.mobile.response.base.ResponseBase;

public class ExportResponse extends ResponseBase {
	
	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
