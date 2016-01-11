package com.meta64.mobile.service;

import java.io.File;

import org.apache.jackrabbit.oak.plugins.backup.FileStoreBackup;
import org.apache.jackrabbit.oak.plugins.backup.FileStoreRestore;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.meta64.mobile.util.FileTools;
import com.mongodb.DB;
import com.mongodb.MongoClient;

/**
 * This class is experimental and is not yet working!
 * 
 * Currently, what happens when I run a 'restore' is the following exception
 * gets thrown inside OAK code because the "NodeBuilder" that Oak creates for
 * it's own use in the restore ends up choking itself here. So as far as I can
 * determine this is an Oak bug, because it creates this object and then blows
 * up on it's own object.
 * 
 * private static DocumentRootBuilder asDocumentRootBuilder(NodeBuilder builder)
 * throws IllegalArgumentException { if (!(builder instanceof
 * DocumentRootBuilder)) { throw new IllegalArgumentException(
 * "builder must be a " + DocumentRootBuilder.class.getName()); } return
 * (DocumentRootBuilder) builder; }
 */
@Component
@Scope("singleton")
public class BackupService {
	private static final Logger log = LoggerFactory.getLogger(BackupService.class);

	@Value("${adminDataFolder}")
	private String adminDataFolder;

	/*
	 * MongoDb Server Connection Info
	 */
	@Value("${mongodb.host}")
	private String mongoDbHost;

	@Value("${mongodb.port}")
	private Integer mongoDbPort;

	@Value("${mongodb.name}")
	private String mongoDbName;

	private DocumentNodeStore nodeStore;
	private DB db;

	@Autowired
	private Environment env;

	public void runCommandLine() throws Exception {
		String cmd = env.getProperty("cmd");
		if ("backup".equals(cmd)) {
			backup();
		} else if ("restore".equals(cmd)) {
			restore();
		}
	}

	public void backup() throws Exception {
		try {
			connect(mongoDbName);
			if (!FileTools.dirExists(adminDataFolder)) {
				throw new Exception("adminDataFolder does not exist: " + adminDataFolder);
			}
			String targetFolder = adminDataFolder + File.separator + "BK" + System.currentTimeMillis();
			log.debug("Backing up to: " + targetFolder);
			FileTools.createDirectory(targetFolder);
			FileStoreBackup.backup(nodeStore, new File(targetFolder));
		} finally {
			disconnect();
		}
	}

	public void restore() throws Exception {
		try {
			String restoreToMongoDbName = env.getProperty("restoreToMongoDbName");
			if (restoreToMongoDbName == null) {
				throw new Exception("Missing 'restoreToMongoDbName' parameter.");
			}

			connect(restoreToMongoDbName);
			String srcFolder = env.getProperty("restoreFromFolder");

			if (!FileTools.dirExists(adminDataFolder)) {
				throw new Exception("adminDataFolder does not exist: " + adminDataFolder);
			}
			String fullSrcFolder = adminDataFolder + File.separator + srcFolder;
			log.debug("Restoring from folder: " + fullSrcFolder);

			if (!FileTools.dirExists(fullSrcFolder)) {
				throw new Exception("adminDataFolder does not exist: " + fullSrcFolder);
			}

			FileStoreRestore.restore(new File(fullSrcFolder), nodeStore);
		} finally {
			disconnect();
		}
	}

	private void connect(String mongoName) throws Exception {
		if (db != null || nodeStore != null) {
			throw new Exception("already connected.");
		}
		db = new MongoClient(mongoDbHost, mongoDbPort).getDB(mongoName);
		nodeStore = new DocumentMK.Builder().setMongoDB(db).getNodeStore();
	}

	private void disconnect() throws Exception {
		if (nodeStore != null) {
			log.debug("disposing nodeStore.");
			nodeStore.dispose();
			nodeStore = null;
		}

		if (db != null) {
			if (db.getMongo() != null) {
				db.getMongo().close();
			}
			db = null;
		}
	}
}
