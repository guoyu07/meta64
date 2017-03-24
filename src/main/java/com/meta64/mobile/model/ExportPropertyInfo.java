package com.meta64.mobile.model;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ExportPropertyInfo {
	private String name;

	/*
	 * Only one of these will be non-null. The property is either multi-valued or single valued
	 * 
	 * Also the 'value' is the actual text stored in the DB, and is assumed to be markdown for
	 * content nodes.
	 */
	private String val;
	private List<String> vals;
	
	public String getVal() {
		return val;
	}

	public void setVal(String val) {
		this.val = val;
	}

	public List<String> getVals() {
		return vals;
	}

	public void setVals(List<String> vals) {
		this.vals = vals;
	}

	@JsonIgnore
	public boolean isEmpty() {
		return StringUtils.isEmpty(val) && (vals == null || vals.size() == 0);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
