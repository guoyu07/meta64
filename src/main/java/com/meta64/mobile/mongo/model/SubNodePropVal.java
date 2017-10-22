package com.meta64.mobile.mongo.model;

import java.util.Date;

public class SubNodePropVal {
	private String type;
	private Object value;

	public SubNodePropVal() {
	}

	public SubNodePropVal(Long val) {
		value = val;
		type = NodePropertyTypes.INTEGER;
	}
	
	public SubNodePropVal(Integer val) {
		value = val;
		type = NodePropertyTypes.INTEGER;
	}

	public SubNodePropVal(String val) {
		value = val;
		type = NodePropertyTypes.STRING;
	}

	public SubNodePropVal(Date val) {
		value = val;
		type = NodePropertyTypes.DATE;
	}

	public SubNodePropVal(Boolean val) {
		value = val;
		type = NodePropertyTypes.BOOLEAN;
	}

	public SubNodePropVal(Double val) {
		value = val;
		type = NodePropertyTypes.FLOAT;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
}
