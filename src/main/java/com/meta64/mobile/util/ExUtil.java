package com.meta64.mobile.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExUtil {
	private static final Logger log = LoggerFactory.getLogger(ExUtil.class);
	
	public static RuntimeEx newEx(Throwable ex) {
		log.error("logAndRethrow", ex);
		throw new RuntimeEx(ex);
	}
	
	public static RuntimeEx newEx(String msg) {
		RuntimeEx ex = new RuntimeEx(msg);
		log.error("logThrow", ex);
		return ex;
	}
}
