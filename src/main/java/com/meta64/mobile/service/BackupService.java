package com.meta64.mobile.service;

import java.io.File;

import org.apache.jackrabbit.oak.plugins.backup.FileStoreBackup;
import org.apache.jackrabbit.oak.plugins.backup.FileStoreRestore;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.RuntimeEx;
import com.mongodb.DB;
import com.mongodb.MongoClient;

/**
 * This class is experimental and is not yet working!
 * 
 * Currently, what happens when I run a 'restore' is the following exception gets thrown inside OAK
 * code because the "NodeBuilder" that Oak creates for it's own use in the restore ends up choking
 * itself here. So as far as I can determine this is an Oak bug, because it creates this object and
 * then blows up on it's own object.
 * 
 * private static DocumentRootBuilder asDocumentRootBuilder(NodeBuilder builder) throws
 * IllegalArgumentException { if (!(builder instanceof DocumentRootBuilder)) { throw new
 * IllegalArgumentException( "builder must be a " + DocumentRootBuilder.class.getName()); } return
 * (DocumentRootBuilder) builder; }
 */
@Component
public class BackupService {
	private static final Logger log = LoggerFactory.getLogger(BackupService.class);

	@Autowired
	private AppProp appProp;

	private DocumentNodeStore nodeStore;
	private DB db;

	public void runCommandLine() {
		String cmd = appProp.getProp("cmd");
		if ("backup".equals(cmd)) {
			backup();
		}
		else if ("restore".equals(cmd)) {
			restore();
		}
	}

	public void backup() {
		try {
			connect(appProp.getMongoDbName());
			if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
				throw new RuntimeEx("adminDataFolder does not exist: " + appProp.getAdminDataFolder());
			}
			String targetFolder = appProp.getAdminDataFolder() + File.separator + "BK" + System.currentTimeMillis();
			log.debug("Backing up to: " + targetFolder);
			FileTools.createDirectory(targetFolder);
			FileStoreBackup.backup(nodeStore, new File(targetFolder));
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
		finally {
			disconnect();
		}
	}

	public void restore() {
		try {
			String restoreToMongoDbName = appProp.getProp("restoreToMongoDbName");
			if (restoreToMongoDbName == null) {
				throw new RuntimeEx("Missing 'restoreToMongoDbName' parameter.");
			}

			connect(restoreToMongoDbName);
			String srcFolder = appProp.getProp("restoreFromFolder");

			if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
				throw new RuntimeEx("adminDataFolder does not exist: " + appProp.getAdminDataFolder());
			}
			String fullSrcFolder = appProp.getAdminDataFolder() + File.separator + srcFolder;
			log.debug("Restoring from folder: " + fullSrcFolder);

			if (!FileTools.dirExists(fullSrcFolder)) {
				throw new RuntimeEx("adminDataFolder does not exist: " + fullSrcFolder);
			}

			FileStoreRestore.restore(new File(fullSrcFolder), nodeStore);
		}
		finally {
			disconnect();
		}
	}

	private void connect(String mongoName) {
		if (db != null || nodeStore != null) {
			throw new RuntimeEx("already connected.");
		}
		try {
			db = new MongoClient(appProp.getMongoDbHost(), appProp.getMongoDbPort()).getDB(mongoName);
			nodeStore = new DocumentMK.Builder().setMongoDB(db).getNodeStore();
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	private void disconnect() {
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
