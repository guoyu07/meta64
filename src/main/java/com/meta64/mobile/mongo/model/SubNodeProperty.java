package com.meta64.mobile.mongo.model;

import java.util.Date;

public class SubNodeProperty {
	private String type;
	private Object value;

	public SubNodeProperty() {
	}

	public SubNodeProperty(Long val) {
		value = val;
		type = NodePropertyTypes.INTEGER;
	}

	public SubNodeProperty(String val) {
		value = val;
		type = NodePropertyTypes.STRING;
	}

	public SubNodeProperty(Date val) {
		value = val;
		type = NodePropertyTypes.DATE;
	}

	public SubNodeProperty(Boolean val) {
		value = val;
		type = NodePropertyTypes.BOOLEAN;
	}

	public SubNodeProperty(Double val) {
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
