package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.jcr.ImportUUIDBehavior;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.oak.plugins.backup.FileStoreBackup;
import org.apache.jackrabbit.oak.plugins.backup.FileStoreRestore;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.request.InsertBookRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.response.InsertBookResponse;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.ImportWarAndPeace;
import com.meta64.mobile.util.JcrUtil;
import com.mongodb.DB;
import com.mongodb.MongoClient;

/**
 * Import and Export to and from XML files, as well as the special processing to import the book War
 * and Peace in it's special format.
 * 
 * TODO: We probably should separate out the book import part into a seperate service file.
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

	public void backup() throws Exception {
		try {
			connect();
			FileStoreBackup.backup(nodeStore, new File("c:\\repo-backup"));
		}
		finally {
			disconnect();
		}
	}

	public void restore() throws Exception {
		try {
			connect();
			/*
			 * Completely untested as of right now.
			 */
			//FileStoreRestore.restore(new File("c:\\repo-backup"), nodeStore);
		}
		finally {
			disconnect();
		}
	}

	private void connect() throws Exception {
		if (db != null || nodeStore != null) {
			throw new Exception("already connected.");
		}
		db = new MongoClient(mongoDbHost, mongoDbPort).getDB(mongoDbName);
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
