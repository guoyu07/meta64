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

		// removing logging, because some exception throwing is intentional (not error)
		// log.error("logAndRethrow", ex);
		if (ex instanceof RuntimeEx) {
			return (RuntimeEx) ex;
		}
		return new RuntimeEx(ex);
	}

	public static RuntimeEx newEx(String msg) {
		RuntimeEx ex = new RuntimeEx(msg);
		// removing logging, because some exception throwing is intentional (not error)
		// log.error("logThrow", ex);
		return ex;
	}

	public static void error(Logger logger, String msg, Throwable e) {
		logger.error(msg, e);

		/* Not showing all sub-causes in the chain, but just the immediate one */
		if (e.getCause() != null) {
			logger.error("cause:", e);
		}
	}
}
