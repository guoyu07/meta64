package com.meta64.mobile.util;

import com.meta64.mobile.mongo.MongoSession;

/**
 * Runs a unit of work in a specific mongo session. Used in Java-8 "Lambda" call pattern.
 */
public interface MongoRunnable {
	public void run(MongoSession session);
}
