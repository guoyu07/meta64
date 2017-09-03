package com.meta64.mobile.mongo.model;

import java.util.Date;

public class NodePropertyTypes {
	public static final String DATE = "d";
	public static final String BOOLEAN = "b";
	public static final String STRING = "s";
	public static final String INTEGER = "i";
	public static final String FLOAT = "f";
	
	public static String getTypeOfObject(Object obj) {
		String ret = STRING;
		if (obj instanceof String) {
			//default is already STRING
		}
		else if (obj instanceof Integer) {
			ret = INTEGER;
		}
		else if (obj instanceof Date) {
			ret = DATE;
		}
		return ret;
	}
}
