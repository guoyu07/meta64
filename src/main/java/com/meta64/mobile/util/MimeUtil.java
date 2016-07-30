package com.meta64.mobile.util;

import org.springframework.stereotype.Component;

@Component
public class MimeUtil {

	public boolean isTextTypeFileName(String fileName) {
		if (!fileName.contains(".")) return false;

		String ext = XString.parseAfterLast(fileName, ".");

		// todo-0: will be getting these from a properties file eventually
		if (ext.equalsIgnoreCase("txt") || //
				ext.equalsIgnoreCase("md")) {
			return true;
		}
		return false;
	}
}
