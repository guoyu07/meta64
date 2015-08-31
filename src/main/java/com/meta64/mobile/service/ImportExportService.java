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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;

/**
 * Import and Export to and from XML files, as well as the special processing to import the book War
 * and Peace in it's special format.
 */
@Component
@Scope("singleton")
public class ImportExportService {
	private static final Logger log = LoggerFactory.getLogger(ImportExportService.class);

	public static final int BUF_SIZE = 1024 * 4;
	private byte[] byteBuf = new byte[BUF_SIZE];

	@Autowired
	private OakRepository oak;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Value("${adminDataFolder}")
	private String adminDataFolder;

	/*
	 * This will be made optional in the future, but for my purposes I don't want the zip file name
	 * being the controller of the JCR names. I'd rather just generate JCR names ad GUIDS, so I have
	 * to be able to map them
	 */
	private Map<String, String> zipToJcrNameMap = new HashMap<String, String>();

	/*
	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
	 * then we don't expect a filename, because we will generate a timestamped one.
	 */
	public void exportToXml(Session session, ExportRequest req, ExportResponse res) throws Exception {
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
			exportIdToFile(session, nodeId, fileName);
		}

		res.setSuccess(true);
	}

	/*
	 * Unfortunately the Apache Oak fails with errors related to UUID any time you try to import
	 * something at the root like "/jcr:system" (confirmed by other users online also, this is not a
	 * mistake I'm making but a mistake made by the Oak developers). As a second last ditch effort I
	 * tried to backup one level down (activities, nodeTypes, and versionStorage), but that also
	 * results in exception getting thrown from inside Oak. Not my fault. They just don't have this
	 * stuff working. I will leave this in place to show what has been tried, but for now, it seems
	 * the only way to backup a reposity is to back up the actual MongoDB files themselves, which is
	 * not a tragedy, but is definitely "bad" because we cannot back up in ASCII.
	 */
	private void exportEntireRepository(Session session) throws Exception {
		long time = System.currentTimeMillis();

		String fileName = String.format("full-backup-%d-jcr_systemActivities", time);
		exportIdToFile(session, "/jcr:system/jcr:activities", fileName);

		fileName = String.format("full-backup-%d-jcr_systemNodeTypes", time);
		exportIdToFile(session, "/jcr:system/jcr:nodeTypes", fileName);

		fileName = String.format("full-backup-%d-jcr_systemVersionStorage", time);
		exportIdToFile(session, "/jcr:system/jcr:versionStorage", fileName);

		fileName = String.format("full-backup-%d-rep_security", time);
		exportIdToFile(session, "/rep:security", fileName);

		fileName = String.format("full-backup-%d-oak_index", time);
		exportIdToFile(session, "/oak:index", fileName);

		fileName = String.format("full-backup-%d-meta64", time);
		exportIdToFile(session, "/meta64", fileName);

		fileName = String.format("full-backup-%d-userPreferences", time);
		exportIdToFile(session, "/userPreferences", fileName);

		fileName = String.format("full-backup-%d-root", time);
		exportIdToFile(session, "/root", fileName);
	}

	private void exportIdToFile(Session session, String nodeId, String fileName) throws Exception {

		fileName = fileName.replace(".", "_");
		fileName = fileName.replace(File.separator, "_");
		String fullFileName = adminDataFolder + File.separator + fileName + ".xml";

		if (FileTools.fileExists(fullFileName)) {
			throw new Exception("File already exists.");
		}

		Node exportNode = JcrUtil.findNode(session, nodeId);
		log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);

		BufferedOutputStream output = null;
		try {
			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
			session.exportSystemView(exportNode.getPath(), output, false, false);

			/*
			 * Need to investigate whether there is any reason to ever give the user the option to
			 * export as document view instead if system view, and what are the
			 * advantages/disadvantages.
			 */
			// session.exportDocumentView(exportNode.getPath(), output, false, false);
			output.flush();
		}
		finally {
			if (output != null) {
				output.close();
			}
		}
	}

	public void importFromXml(Session session, ImportRequest req, ImportResponse res) throws Exception {
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

			// importFromFileToNode(session, sourceFileName + "-jcr_systemNodeTypes.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-jcr_systemVersionStorage.xml",
			// nodeId);
			// importFromFileToNode(session, sourceFileName + "-jcr_systemActivities.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-rep_security.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-oak_index.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-userPreferences.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-root.xml", nodeId);
			// importFromFileToNode(session, sourceFileName + "-meta64.xml", nodeId);
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
		BufferedInputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(fullFileName));

			/*
			 * This REPLACE_EXISTING option has the effect (in my own words) as meaning that even if
			 * the some of the nodes have moved around since they were first exported they will be
			 * updated 'in their current place' as part of this import.
			 * 
			 * This UUID behavior is so interesting and powerful it really needs to be an option
			 * specified at the user level that determines how this should work.
			 */
			session.getWorkspace().importXML(importNode.getPath(), in,
			// ImportUUIDBehavior.IMPORT_UUID_COLLISION_REMOVE_EXISTING);
					ImportUUIDBehavior.IMPORT_UUID_COLLISION_REPLACE_EXISTING);

			/*
			 * since importXML is documented to close the inputstream we set it to null here,
			 * because there's nothing left for us to do with it. In the exception case we go ahead
			 * and try to close it.
			 */
			in = null;
		}
		finally {
			if (in != null) {
				in.close();
			}
		}
	}

	public void importFromZip(Session session, ImportRequest req, ImportResponse res) throws Exception {
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
			ZipEntry entry;

			zis = new ZipInputStream(bis);

			while ((entry = zis.getNextEntry()) != null) {
				importZipEntry(zis, entry, importNode, session);
			}
		}
		finally {
			if (zis != null) {
				zis.close();
			}
		}

		res.setSuccess(true);
	}

	public void importZipEntry(ZipInputStream zis, ZipEntry zipEntry, Node importNode, Session session) throws Exception {
		String name = zipEntry.getName();

		if (zipEntry.isDirectory()) {
			/*
			 * We are using an approach where we ignore folder entries in the zip file, because
			 * folders have no actual content
			 */
			// log.debug("ZIP D: " + name);
			// ensureNodeExistsForZipFolder(importNode, name, session);
		}
		else {
			log.debug("ZIP F: " + name);
			importFileFromZip(zis, zipEntry, importNode, session);
		}
	}

	private void importFileFromZip(ZipInputStream zis, ZipEntry zipEntry, Node importNode, Session session) throws Exception {
		String name = zipEntry.getName();

		StringBuilder buffer = new StringBuilder();
		synchronized (byteBuf) {
			int n = -1;
			while ((n = zis.read(byteBuf)) != -1) {
				if (n > 0) {
					buffer.append(new String(byteBuf, 0, n));
				}
			}
		}

		Node newNode = ensureNodeExistsForZipFolder(importNode, name, session);
		String val = buffer.toString();

		/*
		 * I had a special need to rip HTML tags out of the data I was importing, so I'm commenting
		 * out this hack but leaving it in place so show where and how you can do some processing of
		 * the data as it's imported. Ideally of course this capability would be some kind of
		 * "extension point" (Eclipse plugin terminology) in a production JCR Browder for
		 * filteringinput data, or else this entire class could be pluggable via inteface and IoC.
		 */
		// val = val.replace("<p>", "\n\n");
		// val = val.replace("<br>", "\n");
		// val = ripTags(val);
		newNode.setProperty(JcrProp.CONTENT, val.trim());
		// }
	}

	public static String ripTags(String text) {
		StringTokenizer t = new StringTokenizer(text, "<>", true);
		String token;
		boolean inTag = false;
		StringBuilder ret = new StringBuilder();

		while (t.hasMoreTokens()) {
			token = t.nextToken();
			if (token.equals("<")) {
				inTag = true;
			}
			else if (token.equals(">")) {
				inTag = false;
			}
			else {
				if (!inTag) {
					ret.append(token);
				}
			}
		}

		return ret.toString();
	}

	/*
	 * Builds a node assuming root is a starting path, and 'path' is a ZipFile folder name.
	 * 
	 * Revision: the path is not a file name path.
	 */
	private Node ensureNodeExistsForZipFolder(Node root, String path, Session session) throws Exception {
		String[] tokens = path.split("/");
		String curPath = root.getPath();
		Node curNode = root;
		int tokenIdx = 0;
		int maxTokenIdx = tokens.length - 1;
		for (String token : tokens) {

			/*
			 * This actually is assuming that the path is a file name, and we ignore the file name
			 * part
			 */
			if (tokenIdx >= maxTokenIdx) {
				break;
			}
			String guid = zipToJcrNameMap.get(token);
			if (guid == null) {
				guid = JcrUtil.getGUID();
				zipToJcrNameMap.put(token, guid);
			}

			String jcrName = guid;
			curPath += "/" + jcrName;
			try {
				// log.debug("Checking for path: " + curPath);
				curNode = session.getNode(curPath);
			}
			catch (Exception e) {
				// log.debug("path not found, creating");
				// not an error condition. Simply indicates note at curPath does not exist, so we
				// create it and continue as part of the algorithm. We will actually build as many
				// parents as we need to here.
				curNode = createChildNode(curNode, jcrName, token, session);

				// log.debug("new node now has path: " + curNode.getPath());
			}
			tokenIdx++;
		}
		return curNode;
	}

	private Node createChildNode(Node node, String jcrName, String content, Session session) throws Exception {
		try {
			Node newNode = node.addNode(jcrName, JcrConstants.NT_UNSTRUCTURED);
			/*
			 * Note we don't set content here, but instead set it in the method that calls this one.
			 */
			// newNode.setProperty("jcr:content", content);
			JcrUtil.timestampNewNode(session, newNode);
			return newNode;
		}
		catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}
