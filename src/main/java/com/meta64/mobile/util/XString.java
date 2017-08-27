package com.meta64.mobile.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;

import org.springframework.core.io.Resource;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

/**
 * General string utilities.
 */
public class XString {

	private static ObjectMapper jsonMapper = new ObjectMapper();
	static {
		jsonMapper.setSerializationInclusion(Include.NON_NULL);
	}
	private static ObjectWriter jsonPrettyWriter = jsonMapper.writerWithDefaultPrettyPrinter();

	public static String prettyPrint(Object obj) {
		try {
			return jsonPrettyWriter.writeValueAsString(obj);
		}
		catch (JsonProcessingException e) {
			return "";
		}
	}

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

	public static HashSet<String> tokenizeToSet(String val, String delimiter, boolean trim) {
		HashSet<String> list = null;
		StringTokenizer t = new StringTokenizer(val, delimiter, false);
		while (t.hasMoreTokens()) {
			if (list == null) {
				list = new HashSet<String>();
			}
			list.add(trim ? t.nextToken().trim() : t.nextToken());
		}
		return list;
	}

	public static String trimToMaxLen(String val, int maxLen) {
		if (val == null) return null;
		if (val.length() <= maxLen) return val;
		return val.substring(0, maxLen - 1);
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
			StreamUtil.close(in);
		}
		return sb.toString();
	}

	/* Truncates after delimiter including truncating the delimiter */
	public final static String truncateAfterFirst(String text, String delim) {
		if (text == null) return null;

		int idx = text.indexOf(delim);
		if (idx != -1) {
			text = text.substring(0, idx);
		}
		return text;
	}

	public static String stripIfEndsWith(String val, String suffix) {
		if (val.endsWith(suffix)) {
			val = val.substring(0, val.length() - suffix.length());
		}
		return val;
	}

	public static String removeLastChar(String str) {
		return str.substring(0, str.length() - 1);
	}

	public final static String truncateAfterLast(String text, String delim) {
		if (text == null) return null;

		int idx = text.lastIndexOf(delim);
		if (idx != -1) {
			text = text.substring(0, idx);
		}
		return text;
	}

	public final static String parseAfterLast(String text, String delim) {
		if (text == null) return null;

		int idx = text.lastIndexOf(delim);
		if (idx != -1) {
			text = text.substring(idx + delim.length());
		}
		return text;
	}

}
