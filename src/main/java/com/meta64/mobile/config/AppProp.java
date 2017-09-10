package com.meta64.mobile.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Primary class for accessing application properties.
 * <p>
 * NOTE: We could use EnvironmentAware but under normal circumstances apps can just Autowire the
 * Env, so that's what we do.
 */
@Component
public class AppProp /* implements EnvironmentAware */ {
	private static final Logger log = LoggerFactory.getLogger(AppProp.class);

	@Autowired
	private Environment env;

	public String getMetaHost() {
		return env.getProperty("metaHost");
	}

	public String getServerPort() {
		return env.getProperty("server.port");
	}

	public String getProfileName() {
		return env.getProperty("profileName");
	}

	public String getMongoDbHost() {
		return env.getProperty("mongodb.host");
	}

	public Integer getMongoDbPort() {
		return Integer.parseInt(env.getProperty("mongodb.port"));
	}

	public String getMongoDbName() {
		return env.getProperty("mongodb.name");
	}

	public String getAdminDataFolder() {
		return getPathProperty("adminDataFolder");
	}

	public String getTestUserAccounts() {
		return env.getProperty("testUserAccounts");
	}

	public String getMongoAdminUserName() {
		return env.getProperty("mongoAdminUserName");
	}

	public boolean getMongoTest() {
		return "true".equals(env.getProperty("mongoTest"));
	}

	public String getMongoAdminPassword() {
		return env.getProperty("mongoAdminPassword");
	}

	public String getUserLandingPageNode() {
		return env.getProperty("anonUserLandingPageNode");
	}

	public String getHelpNode() {
		return env.getProperty("helpNode");
	}

	public String getBrandingMetaContent() {
		return env.getProperty("brandingMetaContent");
	}

	public String getJsBaseFolder() {
		return env.getProperty("jsBaseFolder");
	}

	public String getSolrSearchHost() {
		return env.getProperty("solr.search.host");
	}

	public String getMailHost() {
		return env.getProperty("mail.host");
	}

	public String getMailPort() {
		return env.getProperty("mail.port");
	}

	public String getMailUser() {
		return env.getProperty("mail.user");
	}

	public String getMailPassword() {
		return env.getProperty("mail.password");
	}

	public String getAesKey() {
		return env.getProperty("aeskey");
	}

	public boolean isAllowFileSystemSearch() {
		return getBooleanProp("allowFileSystemSearch");
	}

	public boolean isEnableRssDaemon() {
		return getBooleanProp("enableRssDaemon");
	}

	/* considers property 'true' if it starts with letter 't', 'y' (yes), or 1 */
	public boolean getBooleanProp(String propName) {
		String val = env.getProperty(propName);
		if (val == null) return false;
		val = val.toLowerCase();
		return val.startsWith("t") || val.startsWith("y") || val.startsWith("1");
	}

	public String getProp(String propName) {
		return env.getProperty(propName);
	}

	public String getPathProperty(String propName) {
		return translateDirs(env.getProperty(propName));
	}

	public String translateDirs(String folder) {
		if (folder == null) return folder;
		String userDir = System.getProperty("user.dir");
		return folder.replace("{user.dir}", userDir);
	}
}
