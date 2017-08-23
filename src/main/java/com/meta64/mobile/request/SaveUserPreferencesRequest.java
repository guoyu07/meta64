package com.meta64.mobile.request;

import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.base.RequestBase;

public class SaveUserPreferencesRequest extends RequestBase {
	private UserPreferences userPreferences;

	public UserPreferences getUserPreferences() {
		return userPreferences;
	}

	public void setUserPreferences(UserPreferences userPreferences) {
		this.userPreferences = userPreferences;
	}
}
