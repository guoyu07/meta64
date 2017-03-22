package com.meta64.mobile.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.MimeUtil;
import com.meta64.mobile.util.ThreadLocals;

@Component
@Scope("prototype")
public class ExportZipService {
	private static final Logger log = LoggerFactory.getLogger(ExportZipService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	/* We have varibles specific to this instance of an export run becasue this is a 'prototype' scope bean and so a new
	instance of this bean will be created for each export run */
	private Session session;

	/* This object IS Threadsafe so this is the correct usage 'static final' */
	private static final ObjectWriter jsonWriter = new ObjectMapper().writerWithDefaultPrettyPrinter();
	
	@Autowired
	private AppProp appProp;
	
	@Autowired
	private Convert convert;
	
	@Autowired
	private MimeUtil mimeUtil;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private JsonToJcrService jsonToJcrService;

	@Autowired
	private SessionContext sessionContext;

	public void export(Session session, ExportRequest req, ExportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		this.session = session;

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;

		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw new Exception("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw new Exception("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			// exportEntireRepository(session);
			throw new Exception("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();

			/*
			 * Timestamp-based folder name groups the 4 redundant files we export
			 */
			Date date = new Date();
			String dirName = dateFormat.format(date);
			dirName = FileTools.ensureValidFileNameChars(dirName);

			Node node = JcrUtil.findNode(session, nodeId);
			recurseNode(node, 0);
			
//			/*
//			 * For now, out of an abundance of caution for backups do all for combinations of SYSTEM
//			 * v.s. DOCUMENT export both with and without binaries.
//			 */
//
//			log.info("Exporting System View.");
//			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.SYSTEM, true);
//			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.SYSTEM, false);
//
//			log.info("Exporting Document View.");
//			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.DOCUMENT, true);
//			exportNodeToXMLFile(session, nodeId, dirName, fileName, ExportXMLViewType.DOCUMENT, false);

			// exportNodeToFileSingleTextFile(session, nodeId, fileName);
		}

		res.setSuccess(true);
	}
	
	private void recurseNode(Node node, int level) throws Exception {
		if (node == null) return;
		
		processNodeExport(node);

		NodeIterator nodeIter = node.getNodes();
	
		//String indent = getIndentString(level);
		try {
			while (true) {
				Node n = nodeIter.nextNode();
				//appendContent(n, level, indent, nodeCount, content);
				recurseNode(n, level + 1);
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}
	
	private void processNodeExport(Node node) throws Exception {
		NodeInfo nodeInfo = convert.convertToNodeInfo(sessionContext, session, node, true, true, false);
		String json = jsonWriter.writeValueAsString(nodeInfo);
		log.debug(json);
		log.debug("__________________________________");
	}
}
