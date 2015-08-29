package com.meta64.mobile.util;

import java.io.File;

public class FileTools {

	public static boolean fileExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isFile();
	}

	public static boolean dirExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isDirectory();
	}

	public static boolean createDirectory(String dir) {
		File file = new File(dir);
		if (file.isDirectory()) return true;
		boolean success = file.mkdirs();
		return success;
	}
}
