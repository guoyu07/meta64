package com.meta64.mobile.util;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.activation.MimetypesFileTypeMap;

public class FileUtils {

	public static String getMimeType(File file) {
		String ret = null;

		try {
			String ext = getFileNameExtension(file.getCanonicalPath());
			if (ext.equalsIgnoreCase("md")) {
				ret = "text/plain";
			}
			else {
				ret = MimetypesFileTypeMap.getDefaultFileTypeMap().getContentType(file);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		return ret;
	}

	public static String readFile(String path) throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, StandardCharsets.UTF_8);
	}

	public static String getFileNameExtension(String fileName) {
		File f = new File(fileName);
		String shortName = f.getName();
		int index = shortName.lastIndexOf(".");
		String ext = "";
		if (index != -1) {
			ext = shortName.substring(index + 1);
		}

		return ext;
	}
}
