package com.meta64.mobile.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/* NOTE: We could use EnvironmentAware but under normal circumstances apps can just Autowire the Env, so that's what we do. */
@Component
public class AppProp /* implements EnvironmentAware */ {
	private static final Logger log = LoggerFactory.getLogger(AppProp.class);

	@Autowired
	private Environment env;

	public String getAdminDataFolder() {
		return getPathProperty("adminDataFolder");
	}
	
	public String getRdbUrl() {
		return getPathProperty("rdb.url");
	}

	public String getRdbShutdown() {
		return getPathProperty("rdb.shutdown");
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
