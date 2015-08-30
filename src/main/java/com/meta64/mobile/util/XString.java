package com.meta64.mobile.util;

import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;

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
}
