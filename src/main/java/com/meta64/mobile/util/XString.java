package com.meta64.mobile.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;

import org.springframework.core.io.Resource;

/**
 * General string utilities and validations.
 */
public class XString {

	public static List<String> tokenize(String val, String delimiter, boolean trim) {
		List<String> list = null;
		StringTokenizer t = new StringTokenizer(val, delimiter, false);
		while (t.hasMoreTokens()) {
			if (list == null) {
				list = new LinkedList<String>();
			}
			list.add(trim ? t.nextToken().trim() : t.nextToken());
		}
		return list;
	}

	public static String loadResourceIntoString(Resource resource) {
		BufferedReader in = null;
		StringBuilder sb = new StringBuilder();

		try {
			in = new BufferedReader(new InputStreamReader(resource.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				sb.append(line);
				sb.append("\n");
			}
		}
		catch (Exception e) {
			sb.setLength(0);
		}
		finally {
			if (in != null) {
				try {
					in.close();
				}
				catch (IOException e) {
				}
			}
		}
		return sb.toString();
	}
}
