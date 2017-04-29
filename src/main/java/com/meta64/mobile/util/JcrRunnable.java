package com.meta64.mobile.util;

import javax.jcr.Session;

/**
 * Runs a unit of work in a specific JCR session.
 */
public interface JcrRunnable {
	public void run(Session session);
}
