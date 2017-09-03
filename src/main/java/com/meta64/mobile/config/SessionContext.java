package com.meta64.mobile.config;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.concurrent.locks.ReentrantLock;

import javax.annotation.PreDestroy;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import com.meta64.mobile.model.RefInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.RepositoryUtil;
import com.meta64.mobile.util.DateUtil;

/**
 * Wrapper for holding variables that we need to maintain server state of for a session. Basic
 * session state storage is all collected here.
 * <p>
 * The ScopedProxyMode.TARGET_CLASS annotation allows this session bean to be available on
 * singletons or other beans that are not themselves session scoped.
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SessionContext {
	private static final Logger log = LoggerFactory.getLogger(SessionContext.class);

	@Autowired
	RepositoryUtil repoUtil;

	/*
	 * This lock ensures that only one server side function can be running at a time for any give
	 * session. Although WebUtils.getSessionMutex is also available for the same purpose we use our
	 * own lock here because we want a ReentrantLock, rather than using a synchronized block, so we
	 * have the full concurrency support provided by that ReentrantLock
	 */
	private ReentrantLock lock = new ReentrantLock();

	/* Identification of user's account root node */
	private RefInfo rootRefInfo;

	private String userName;
	private String password;
	private String captcha;
	private String timezone;
	private String timeZoneAbbrev;

	private UserPreferences userPreferences;

	/* Note: this object is Session-specific to the timezone will be per user */
	private SimpleDateFormat dateFormat;

	/* Initial id param parsed from first URL request */
	private String urlId;
	private String urlCmd;

	public int counter;

	private HttpSession httpSessionToInvalidate;

	public SessionContext() {
		log.trace(String.format("Creating Session object hashCode[%d]", hashCode()));
	}

	@PreDestroy
	public void preDestroy() {
		log.trace(String.format("Destroying Session object hashCode[%d] of user %s", hashCode(), userName));
	}

	public boolean isAdmin() {
		return NodePrincipal.ADMIN.equalsIgnoreCase(userName);
	}

	public boolean isAnonUser() {
		return NodePrincipal.ANONYMOUS.equalsIgnoreCase(userName);
	}

	public boolean isTestAccount() {
		return repoUtil.isTestAccountName(userName);
	}

	public String formatTime(Date date) {

		/* If we have a short timezone abbreviation display timezone with it */
		if (getTimeZoneAbbrev() != null) {
			if (dateFormat == null) {
				dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);
				dateFormat.setTimeZone(TimeZone.getTimeZone(getTimezone()));
			}
			return dateFormat.format(date) + " " + getTimeZoneAbbrev();
		}
		/* else display timezone in standard GMT format */
		else {
			if (dateFormat == null) {
				dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_WITH_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);
				dateFormat.setTimeZone(TimeZone.getTimeZone(getTimezone()));
			}
			return dateFormat.format(date);
		}
	}

	/*
	 * This can create nasty bugs. I should bet always getting user name from the actual session
	 * object itself in all the logic... in most every case except maybe login process.
	 */
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
	}

	public String getUrlId() {
		return urlId;
	}

	public void setUrlId(String urlId) {
		this.urlId = urlId;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public String getTimeZoneAbbrev() {
		return timeZoneAbbrev;
	}

	public void setTimeZoneAbbrev(String timeZoneAbbrev) {
		this.timeZoneAbbrev = timeZoneAbbrev;
	}

	public RefInfo getRootRefInfo() {
		return rootRefInfo;
	}

	public void setRootRefInfo(RefInfo rootRefInfo) {
		this.rootRefInfo = rootRefInfo;
	}

	public ReentrantLock getLock() {
		return lock;
	}

	public void setLock(ReentrantLock lock) {
		this.lock = lock;
	}

	public UserPreferences getUserPreferences() {
		return userPreferences;
	}

	public void setUserPreferences(UserPreferences userPreferences) {
		this.userPreferences = userPreferences;
	}

	public HttpSession getHttpSessionToInvalidate() {
		return httpSessionToInvalidate;
	}

	public void setHttpSessionToInvalidate(HttpSession httpSessionToInvalidate) {
		this.httpSessionToInvalidate = httpSessionToInvalidate;
	}

	public String getUrlCmd() {
		return urlCmd;
	}

	public void setUrlCmd(String urlCmd) {
		this.urlCmd = urlCmd;
	}
}
