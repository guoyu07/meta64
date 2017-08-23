package com.meta64.mobile.response;

import com.meta64.mobile.model.PropertyInfo;
import com.meta64.mobile.response.base.ResponseBase;

public class SavePropertyResponse extends ResponseBase {
	private PropertyInfo propertySaved;

	public PropertyInfo getPropertySaved() {
		return propertySaved;
	}

	public void setPropertySaved(PropertyInfo propertySaved) {
		this.propertySaved = propertySaved;
	}
}
