package com.meta64.mobile.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * SubNode uses RuntimeExceptions primarily for all exception handling, throughout the app because
 * of the cleanness of the API when it doesn't have to declare checked exceptions everywhere, and
 * this utility encapsulates the convertion of most checked exceptions to RuntimeExceptions.
 * <p>
 * Note: This code doesn't ignore exceptions or alter our ability to properly handle ALL exceptions
 * of both types, but it just makes the code cleaner, by doing what he Java-language SHOULD have
 * done to begin with. 
 */
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
