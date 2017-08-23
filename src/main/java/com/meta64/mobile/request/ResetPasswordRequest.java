package com.meta64.mobile.request;

import com.meta64.mobile.request.base.RequestBase;

public class ResetPasswordRequest extends RequestBase {
	private String user;
	private String email;

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
