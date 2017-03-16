package com.meta64.mobile.util;

import org.springframework.stereotype.Component;

@Component
public class MimeUtil {

	public boolean isTextTypeFileName(String fileName) {
		if (!fileName.contains(".")) return false;

		String ext = XString.parseAfterLast(fileName, ".");

		// todo-2: will be getting these from a properties file eventually
		if (ext.equalsIgnoreCase("txt") || //
				ext.equalsIgnoreCase("md") ||
				ext.equalsIgnoreCase("json")) {
			return true;
		}
		return false;
	}
	
	public boolean isJsonFileType(String fileName) {
		if (!fileName.contains(".")) return false;
		if (fileName.toLowerCase().endsWith(".json.txt")) return true;
		String ext = XString.parseAfterLast(fileName, ".");
		return ext.equalsIgnoreCase("json");
	}
}
