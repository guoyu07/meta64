package com.meta64.mobile.util;

public class RuntimeEx extends RuntimeException {

	public RuntimeEx() {
		super();
	}

	public RuntimeEx(String msg) {
		super(msg);
	}

	public RuntimeEx(Throwable ex) {
		super(ex);
	}
}
