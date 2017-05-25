package com.meta64.mobile.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileTools {
	private static final Logger log = LoggerFactory.getLogger(FileTools.class);

	public static boolean fileExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isFile();
	}

	public static boolean dirExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isDirectory();
	}

	public static boolean deleteFile(String fileName) {
		File f = new File(fileName);
		boolean exists = f.exists();
		if (!exists) return true;
		return f.delete();
	}

	public static boolean createDirectory(String dir) {
		File file = new File(dir);
		if (file.isDirectory()) return true;
		boolean success = file.mkdirs();
		log.debug("Created folder: " + dir + ". success=" + success);
		return success;
	}

	public static void writeEntireFile(String fileName, String content) {
		try {
			BufferedWriter out = new BufferedWriter(new FileWriter(fileName));
			try {
				out.write(content);
				out.flush();
			}
			finally {
				StreamUtil.close(out);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	public static String ensureValidFileNameChars(String text) {
		if (text == null) return null;

		int length = text.length();
		StringBuilder ret = new StringBuilder();
		char c;

		for (int i = 0; i < length; i++) {
			c = text.charAt(i);

			if (Character.isLetter(c) || Character.isDigit(c) || c == '.' || c == ' ' || c == '-' || c == '_') {
				ret.append(c);
			}
			else {
				ret.append('-');
			}
		}

		return ret.toString();
	}
}
