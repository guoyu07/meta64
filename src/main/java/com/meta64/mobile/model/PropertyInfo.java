package com.meta64.mobile.model;

/**
 * Holds the value of a single JCR property (i.e. a 'value' on a JCR Node)
 */
public class PropertyInfo {
	private String type;
	private String name;

	/*
	 * Only one of these will be non-null. The property is either multi-valued or single valued
	 * 
	 * Also the 'value' is the actual text stored in the DB, and is assumed to be markdown for
	 * content nodes.
	 */
	private String value;

	private boolean abbreviated;

	public PropertyInfo() {
	}

	public PropertyInfo(String type, String name, String value, boolean abbreviated) {
		this.type = type;
		this.name = name;
		this.value = value;
		this.abbreviated = abbreviated;
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

	public boolean isAbbreviated() {
		return abbreviated;
	}

	public void setAbbreviated(boolean abbreviated) {
		this.abbreviated = abbreviated;
	}

	public String getType() {
		return type;
	}

	public void setTypeStr(String type) {
		this.type = type;
	}
}
