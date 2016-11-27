package com.meta64.mobile.model;

import java.util.List;

public class PropertyInfo {
	private int type;
	private String name;

	/*
	 * Only one of these will be non-null. The property is either multi-valued or single valued
	 * 
	 * Also the 'value' is the actual text stored in the DB, and is assumed to be markdown for
	 * content nodes.
	 */
	private String value;
	private List<String> values;

	private boolean abbreviated;

	public PropertyInfo() {
	}

	public PropertyInfo(int type, String name, String value, boolean abbreviated, List<String> values) {
		this.type = type;
		this.name = name;
		this.value = value;
		this.values = values;
		this.abbreviated = abbreviated;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getValues() {
		return values;
	}

	public void setValues(List<String> values) {
		this.values = values;
	}

	public boolean isAbbreviated() {
		return abbreviated;
	}

	public void setAbbreviated(boolean abbreviated) {
		this.abbreviated = abbreviated;
	}
}
