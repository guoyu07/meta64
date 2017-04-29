package com.meta64.mobile.model;

import java.util.List;

public class ExportNodeInfo {
	private String id;
	private String type;
	private String path;

	private List<ExportPropertyInfo> props;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<ExportPropertyInfo> getProps() {
		return props;
	}

	public void setProps(List<ExportPropertyInfo> props) {
		this.props = props;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}
