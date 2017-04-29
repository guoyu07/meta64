package com.meta64.mobile.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Import and Export to and from XML files
 */
@Component
public class ExportXmlService {
	private static final Logger log = LoggerFactory.getLogger(ExportXmlService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	@Autowired
	private AppProp appProp;

	public enum ExportXMLViewType {
		SYSTEM, DOCUMENT
	};

	@Autowired
	private SessionContext sessionContext;

	/*
	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
	 * then we don't expect a filename, because we will generate a timestamped one.
	 */
	public void export(Session session, ExportRequest req, ExportResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;

		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw new RuntimeEx("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw new RuntimeEx("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			// exportEntireRepository(session);
			throw new RuntimeEx("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();

			/*
			 * Timestamp-based folder name groups the 4 redundant files we export
			 */
			Date date = new Date();
			String dirName = dateFormat.format(date);
			dirName = FileTools.ensureValidFileNameChars(dirName);

			/*
			 * For now, out of an abundance of caution for backups do all for combinations of SYSTEM
			 * v.s. DOCUMENT export both with and without binaries.
			 */

			log.info("Exporting System View.");
			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.SYSTEM, true);
			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.SYSTEM, false);

			log.info("Exporting Document View.");
			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.DOCUMENT, true);
			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.DOCUMENT, false);

			// exportNodeToFileSingleTextFile(session, nodeId, fileName);
		}

		res.setSuccess(true);
	}

	/*
	 * Unfortunately the Apache Oak fails with errors related to UUID any time we try to import
	 * something at the root like "/jcr:system" (confirmed by other users online also, this is not a
	 * mistake I'm making but a mistake made by the Oak developers). As a second last ditch effort I
	 * tried to backup one level down deeper (activities, nodeTypes, and versionStorage), but that
	 * also results in exception getting thrown from inside Oak. Not my fault. They just don't have
	 * this stuff working. I will leave this in place to show what has been tried, but for now, it
	 * seems the only way to backup a reposity is to back up the actual MongoDB files themselves,
	 * which is not a tragedy, but is definitely "bad" because we cannot back up in ASCII.
	 */
	// private void exportEntireRepository(Session session) {
	// long time = System.currentTimeMillis();
	//
	// String fileName = String.format("full-backup-%d-jcr_systemActivities",
	// time);
	// exportNodeToXMLFile(session, "/jcr:system/jcr:activities", fileName);
	//
	// fileName = String.format("full-backup-%d-jcr_systemNodeTypes", time);
	// exportNodeToXMLFile(session, "/jcr:system/jcr:nodeTypes", fileName);
	//
	// fileName = String.format("full-backup-%d-jcr_systemVersionStorage",
	// time);
	// exportNodeToXMLFile(session, "/jcr:system/jcr:versionStorage", fileName);
	//
	// fileName = String.format("full-backup-%d-rep_security", time);
	// exportNodeToXMLFile(session, "/rep:security", fileName);
	//
	// fileName = String.format("full-backup-%d-oak_index", time);
	// exportNodeToXMLFile(session, "/oak:index", fileName);
	//
	// fileName = String.format("full-backup-%d-meta64", time);
	// exportNodeToXMLFile(session, "/meta64", fileName);
	//
	// fileName = String.format("full-backup-%d-userPreferences", time);
	// exportNodeToXMLFile(session, "/userPreferences", fileName);
	//
	// fileName = String.format("full-backup-%d-root", time);
	// exportNodeToXMLFile(session, "/root", fileName);
	// }

	private void exportNodeToXMLFile(Session session, String nodeId, String dirName, String fileName, ExportXMLViewType formatType, boolean includeBinaries) {

		String fileNameSuffix = null;
		switch (formatType) {
		case SYSTEM:
			fileNameSuffix = "SYSVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		case DOCUMENT:
			fileNameSuffix = "DOCVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		default:
			throw new RuntimeEx("Invalid format type");
		}

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw new RuntimeEx("adminDataFolder does not exist.");
		}

		fileName = fileName.replace(".", "_");
		fileName = fileName.replace(File.separator, "_");

		/* not a bug, I'm including the fileName onto part of dirName */
		String fullDir = appProp.getAdminDataFolder() + File.separator + dirName + "-" + fileName;
		FileTools.createDirectory(fullDir);
		String fullFileName = fullDir + File.separator + fileName + "-" + fileNameSuffix + ".xml";

		if (FileTools.fileExists(fullFileName)) {
			throw new RuntimeEx("File already exists.");
		}

		Node exportNode = JcrUtil.findNode(session, nodeId);
		try {
			log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);

			BufferedOutputStream output = null;
			try {
				output = new BufferedOutputStream(new FileOutputStream(fullFileName));
				String exportPath = exportNode.getPath();

				/*
				 * Refer to JCR 2.0 Spec regarding difference between SYSTEM v.s. DOCUMENT XML
				 * format, but in a nutshell SYSTEM is better for serializing export data for backup
				 * or specifically for reimporting later onto a JCR repository. DOCUMENT is more for
				 * compatibility with XML standards itself and is helpful if something other than a
				 * JCR DB might need to process the XML
				 */
				switch (formatType) {
				case SYSTEM:
					session.exportSystemView(exportPath, output, !includeBinaries, false);
					break;
				case DOCUMENT:
					session.exportDocumentView(exportPath, output, !includeBinaries, false);
					break;
				default:
					throw new RuntimeEx("Invalid format type");
				}
				output.flush();
			}
			finally {
				StreamUtil.close(output);
			}
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}
}
