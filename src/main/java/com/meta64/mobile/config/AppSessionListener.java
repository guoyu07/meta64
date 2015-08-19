package com.meta64.mobile.config;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * This SessionListener is actually not needed, but I am keeping it because i may need this capability some day.
 */
public class AppSessionListener implements HttpSessionListener {
	private final Logger log = LoggerFactory.getLogger(AppSessionListener.class);

	@Override
	public void sessionCreated(HttpSessionEvent se) {
		log.debug("Session Created");
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		log.debug("Session Destroyed");
	}

}
