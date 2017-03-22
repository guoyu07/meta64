package com.meta64.mobile.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/* NOTE: We could use EnvironmentAware but under normal circumstances apps can just Autowire the Env, so that's what we do. */
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
	
	public String getDbStoreType() {
		return env.getProperty("db.store.type");
	}

	public String getRdbDriver() {
		return env.getProperty("rdb.driver");
	}

	public String getRdbUser() {
		return env.getProperty("rdb.user");
	}
	
	public String getRdbPassword() {
		return env.getProperty("rdb.password");
	}
	
	public String getAdminDataFolder() {
		return getPathProperty("adminDataFolder");
	}

	public String getRdbUrl() {
		return getPathProperty("rdb.url");
	}

	public String getRdbShutdown() {
		return getPathProperty("rdb.shutdown");
	}

	public boolean isForceIndexRebuild() {
		return getBooleanProp("forceIndexRebuild");
	}

	public boolean isIndexingEnabled() {
		return getBooleanProp("indexingEnabled");
	}
	
	public String getTestUserAccounts() {
		return env.getProperty("testUserAccounts");
	}

	public String getJcrAdminUserName() {
		return env.getProperty("jcrAdminUserName");
	}

	public String getJcrAdminPassword() {
		return env.getProperty("jcrAdminPassword");
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
	
	public String getLuceneDir() {
		return env.getProperty("lucene.index.dir");
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
