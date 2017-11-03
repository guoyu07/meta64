package com.meta64.mobile.util;

import com.meta64.mobile.mongo.MongoSession;

/**
 * Runs a unit of work in a specific mongo session, and return an object. Used in Java-8 "Lambda" call pattern.
 */
public interface MongoRunnableEx {
	public Object run(MongoSession session);
}
