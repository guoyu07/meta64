package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.zip.ZipInputStream;

import javax.jcr.ImportUUIDBehavior;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Import and Export to and from XML files, as well as the special processing to import the book War
 * and Peace in it's special format.
 */
@Component
public class ImportExportService {
	private static final Logger log = LoggerFactory.getLogger(ImportExportService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	public enum ExportXMLViewType {
		SYSTEM, DOCUMENT
	};

	@Autowired
	private SessionContext sessionContext;

	@Value("${adminDataFolder}")
	private String adminDataFolder;

	/*
	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
	 * then we don't expect a filename, because we will generate a timestamped one.
	 */
	public void exportToXml(Session session, ExportRequest req, ExportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		if (!sessionContext.isAdmin()) {
			throw new Exception("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(adminDataFolder)) {
			throw new Exception("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			// exportEntireRepository(session);
			throw new Exception("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();

			/* Timestamp-based folder name groups the 4 redundant files we export */
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
	// private void exportEntireRepository(Session session) throws Exception {
	// long time = System.currentTimeMillis();
	//
	// String fileName = String.format("full-backup-%d-jcr_systemActivities", time);
	// exportNodeToXMLFile(session, "/jcr:system/jcr:activities", fileName);
	//
	// fileName = String.format("full-backup-%d-jcr_systemNodeTypes", time);
	// exportNodeToXMLFile(session, "/jcr:system/jcr:nodeTypes", fileName);
	//
	// fileName = String.format("full-backup-%d-jcr_systemVersionStorage", time);
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

	private void exportNodeToXMLFile(Session session, String nodeId, String dirName, String fileName, ExportXMLViewType formatType, boolean includeBinaries)
			throws Exception {

		String fileNameSuffix = null;
		switch (formatType) {
		case SYSTEM:
			fileNameSuffix = "SYSVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		case DOCUMENT:
			fileNameSuffix = "DOCVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
			break;
		default:
			throw new Exception("Invalid format type");
		}

		if (!FileTools.dirExists(adminDataFolder)) {
			throw new Exception("adminDataFolder does not exist.");
		}

		fileName = fileName.replace(".", "_");
		fileName = fileName.replace(File.separator, "_");

		/* not a bug, I'm including the fileName onto part of dirName */
		String fullDir = adminDataFolder + File.separator + dirName + "-" + fileName;
		FileTools.createDirectory(fullDir);
		String fullFileName = fullDir + File.separator + fileName + "-" + fileNameSuffix + ".xml";

		if (FileTools.fileExists(fullFileName)) {
			throw new Exception("File already exists.");
		}

		Node exportNode = JcrUtil.findNode(session, nodeId);
		log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);

		BufferedOutputStream output = null;
		try {
			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
			String exportPath = exportNode.getPath();

			switch (formatType) {
			case SYSTEM:
				session.exportSystemView(exportPath, output, !includeBinaries, false);
				break;
			case DOCUMENT:
				session.exportDocumentView(exportPath, output, !includeBinaries, false);
				break;
			default:
				throw new Exception("Invalid format type");
			}
			output.flush();
		}
		finally {
			if (output != null) {
				output.close();
			}
		}
	}

	/*
	 * todo: move to string utils class
	 */
	private String getIndentString(int level) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < level * 4; i++) {
			sb.append(" ");
		}
		return sb.toString();
	}

	private void recurseNode(Node node, int level, StringBuilder content) throws Exception {
		if (node == null) return;

		NodeIterator nodeIter = node.getNodes();
		int nodeCount = 0;
		String indent = getIndentString(level);
		try {
			while (true) {
				Node n = nodeIter.nextNode();

				appendContent(n, level, indent, nodeCount, content);
				recurseNode(n, level + 1, content);

				nodeCount++;
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}

	private void appendContent(Node node, int level, String indent, int nodeCount, StringBuilder content) throws Exception {
		log.info(indent + "node[" + nodeCount + "] path: " + node.getPath());

		Property contentProp = JcrUtil.getProperty(node, JcrProp.CONTENT);
		if (contentProp != null) {

			String contentText = contentProp.getString();
			if (contentText != null) {

				if (content.length() > 0) {
					content.append("\n[" + String.valueOf(level) + "]__________\n\n");
				}
				content.append(contentText);
			}
		}
	}

	public void importFromXml(Session session, ImportRequest req, ImportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		if (!sessionContext.isAdmin()) {
			throw new Exception("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(adminDataFolder)) {
			throw new Exception("adminDataFolder does not exist");
		}

		String sourceFileName = req.getSourceFileName();

		if (nodeId.equals("/") && sourceFileName.startsWith("full-backup-")) {

			// JcrUtil.removeRootNodes(session);

			/* See notes above about backing up root not being doable */
			throw new Exception("root restore not supported.");

			// importFromFileToNode(session, sourceFileName +
			// "-jcr_systemNodeTypes.xml", nodeId);
			// importFromFileToNode(session, sourceFileName +
			// "-jcr_systemVersionStorage.xml",
			// nodeId);
			// importFromFileToNode(session, sourceFileName +
			// "-jcr_systemActivities.xml", nodeId);
			// importFromFileToNode(session, sourceFileName +
			// "-rep_security.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-oak_index.xml",
			// nodeId);
			// importFromFileToNode(session, sourceFileName +
			// "-userPreferences.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-root.xml",
			// nodeId);
			// importFromFileToNode(session, sourceFileName + "-meta64.xml",
			// nodeId);
		}
		else {
			importFromFileToNode(session, sourceFileName, nodeId);
		}

		res.setSuccess(true);
	}

	private void importFromFileToNode(Session session, String sourceFileName, String nodeId) throws Exception {

		// sourceFileName = sourceFileName.replace(".", "_");
		sourceFileName = sourceFileName.replace(File.separator, "_");

		String fullFileName = adminDataFolder + File.separator + sourceFileName;

		if (!FileTools.fileExists(fullFileName)) {
			throw new Exception("Import file not found.");
		}

		Node importNode = JcrUtil.findNode(session, nodeId);
		log.debug("Import to Node: " + importNode.getPath());
		BufferedInputStream in = new BufferedInputStream(new FileInputStream(fullFileName));

		/*
		 * This REPLACE_EXISTING option has the effect (in my own words) as meaning that even if the
		 * some of the nodes have moved around since they were first exported they will be updated
		 * 'in their current place' as part of this import.
		 * 
		 * This UUID behavior is so interesting and powerful it really needs to be an option
		 * specified at the user level that determines how this should work.
		 */
		session.getWorkspace().importXML(importNode.getPath(), in,
				// ImportUUIDBehavior.IMPORT_UUID_COLLISION_REMOVE_EXISTING);
				ImportUUIDBehavior.IMPORT_UUID_COLLISION_REPLACE_EXISTING);

		/*
		 * since importXML is documented to close the inputstream, we don't need to close it. This
		 * is not a mistake.
		 */
	}

	public void importFromZip(Session session, ImportRequest req, ImportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		if (!sessionContext.isAdmin()) {
			throw new Exception("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();
		Node importNode = JcrUtil.findNode(session, nodeId);
		log.debug("Import to Node: " + importNode.getPath());

		if (!FileTools.dirExists(adminDataFolder)) {
			throw new Exception("adminDataFolder does not exist");
		}

		String fileName = req.getSourceFileName();
		fileName = fileName.replace(".", "_");
		fileName = fileName.replace(File.separator, "_");
		String fullFileName = adminDataFolder + File.separator + req.getSourceFileName();

		if (!FileTools.fileExists(fullFileName)) {
			throw new Exception("Import file not found.");
		}

		ZipInputStream zis = null;
		try {
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(fullFileName));

			/*
			 * todo-1: Currently we only support importing a zip by using the upload featuer (not
			 * direct file reading as is here) but I can call the method in
			 * ImportZipStreamService.inputZipFileFromStream to import from a file here. I just
			 * don't have time to put that line of code here and test it but adding that one line
			 * here should theoretically 'just work'
			 */
		}
		finally {
			if (zis != null) {
				zis.close();
			}
		}

		res.setSuccess(true);
	}

}
