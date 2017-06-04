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
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Export to and from XML files
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
			throw ExUtil.newEx("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			throw ExUtil.newEx("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();

			// Date date = new Date();
			// String dirName = dateFormat.format(date);
			// dirName = FileTools.ensureValidFileNameChars(dirName);

			/*
			 * For now, out of an abundance of caution for backups do all for combinations of SYSTEM
			 * v.s. DOCUMENT export both with and without binaries.
			 */

			log.info("Exporting System View.");
			exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.SYSTEM, true);
			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.SYSTEM, false);

			// log.info("Exporting Document View.");
			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.DOCUMENT, true);
			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.DOCUMENT, false);
		}

		res.setSuccess(true);
	}

	private void exportNodeToXMLFile(Session session, String nodeId, String fileName, ExportXMLViewType formatType, boolean includeBinaries) {

		String fileNameSuffix = null;
		switch (formatType) {
		case SYSTEM:
			fileNameSuffix = "SYSVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		case DOCUMENT:
			fileNameSuffix = "DOCVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		default:
			throw ExUtil.newEx("Invalid format type");
		}

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist.");
		}

		fileName = fileName.replace(".", "_");
		fileName = fileName.replace(File.separator, "_");

		String fullFileName = appProp.getAdminDataFolder() + File.separator + fileName + "-" + fileNameSuffix + ".xml";

		if (FileTools.fileExists(fullFileName)) {
			throw ExUtil.newEx("File already exists.");
		}

		Node exportNode = JcrUtil.findNode(session, nodeId);

		BufferedOutputStream output = null;
		try {
			log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);
			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
			String exportPath = exportNode.getPath();

			/*
			 * Refer to JCR 2.0 Spec regarding difference between SYSTEM v.s. DOCUMENT XML format,
			 * but in a nutshell SYSTEM is better for serializing export data for backup or
			 * specifically for reimporting later onto a JCR repository. DOCUMENT is more for
			 * compatibility with XML standards itself and is helpful if something other than a JCR
			 * DB might need to process the XML.
			 * 
			 */
			switch (formatType) {
			case SYSTEM:
				session.exportSystemView(exportPath, output, !includeBinaries, false);
				break;
			case DOCUMENT:
				session.exportDocumentView(exportPath, output, !includeBinaries, false);
				break;
			default:
				throw ExUtil.newEx("Invalid format type");
			}
			output.flush();
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		finally {
			StreamUtil.close(output);
		}

	}
}
