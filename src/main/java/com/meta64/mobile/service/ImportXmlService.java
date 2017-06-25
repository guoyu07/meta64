package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import javax.jcr.ImportUUIDBehavior;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.io.input.AutoCloseInputStream;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Import from XML files.
 * <p>
 * Note: If you have any "mix:referencable" nodes (which will have jcr:uuid set on them) from when
 * you exported from some repository and then you are trying to import that identical data BACK into
 * the same repository at some other location. (Maybe you are testing export/import feature for
 * example), then you will get an exception (if using IMPORT_UUID_COLLISION_THROW), which is CORRECT
 * behavior. This is simply because the JCR will not allow two nodes on the same repo to have the
 * same UUID (for obvious reasons), so the only way to safely import data that will duplicate IDs is
 * that you must first edit the XML of what you are about to import, and just literally put a NEW
 * (i.e. different) value in all of the jcr:uuids (or automate doing that somehow). However, after
 * writing the above, upon further testing I see now that IMPORT_UUID_CREATE_NEW doe seem to work
 * properly although I had originally wondered if it was going to be able to maintain ordering of
 * nodes, but despite my original conclusion CREATE_NEW seems to work fine, and that is the setting
 * i'm leaving this at now.
 * <p>
 * NOTE: This does not import arbitrary XML but only xml that was exported from
 * ExportXmlService.java in SubNode.
 */
@Component
public class ImportXmlService {
	private static final Logger log = LoggerFactory.getLogger(ImportXmlService.class);

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private AppProp appProp;

	/*
	 * Import from User's computer. Standard HTML form-based uploading of a file from user machine
	 */
	public ResponseEntity<?> streamImport(Session session, String nodeId, MultipartFile[] uploadFiles) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
			}

			Node node = JcrUtil.findNode(session, nodeId);
			if (node == null) {
				throw ExUtil.newEx("Node not found.");
			}

			if (uploadFiles.length != 1) {
				throw ExUtil.newEx("Multiple file import not allowed");
			}

			MultipartFile uploadFile = uploadFiles[0];

			String fileName = uploadFile.getOriginalFilename();
			if (!StringUtils.isEmpty(fileName)) {
				log.debug("Uploading file: " + fileName);

				if (!fileName.toLowerCase().endsWith(".xml")) {
					throw ExUtil.newEx("Only XML files are currently supported for importing via upload stream.");
				}

				try {
					importFromStreamToNode(session, uploadFile.getInputStream(), node);
				}
				catch (Exception ex) {
					throw ExUtil.newEx(ex);
				}
			}

			JcrUtil.save(session);
		}
		catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	public void importFromXml(Session session, ImportRequest req, ImportResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean importAllowed = userPreferences != null ? userPreferences.isImportAllowed() : false;

		if (!importAllowed && !sessionContext.isAdmin()) {
			throw ExUtil.newEx("import is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist");
		}

		String sourceFileName = req.getSourceFileName();

		if (nodeId.equals("/") && sourceFileName.startsWith("full-backup-")) {

			/* See notes above about backing up root not being doable */
			throw ExUtil.newEx("root restore not supported.");
		}
		else {
			Node targetNode = JcrUtil.findNode(session, nodeId);
			String createdBy = JcrUtil.safeGetStringProp(targetNode, JcrProp.CREATED_BY);

			/*
			 * Detect if this node is a comment we "own" (although true security rules make it
			 * belong to admin user) then we should be able to delete it, so we execute the delete
			 * under an 'AdminSession'. Also now that we have switched sessions, we set that in the
			 * return value, so the caller can always, stop processing after this happens. Meaning
			 * essentialy only *one* comment node can be deleted at a time unless you are admin
			 * user.
			 */
			if (!session.getUserID().equals(createdBy) && !JcrPrincipal.ADMIN.equalsIgnoreCase(session.getUserID())) {
				throw ExUtil.newEx("You cannot import onto a node you do not own. Including your root.");
			}

			importFromFileToNode(session, sourceFileName, targetNode);
		}

		res.setSuccess(true);
	}

	private void importFromFileToNode(Session session, String sourceFileName, Node targetNode) {
		sourceFileName = sourceFileName.replace(File.separator, "_");

		String fullFileName = appProp.getAdminDataFolder() + File.separator + sourceFileName;

		if (!FileTools.fileExists(fullFileName)) {
			throw ExUtil.newEx("Import file not found.");
		}

		try {
			importFromStreamToNode(session, new FileInputStream(fullFileName), targetNode);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void importFromStreamToNode(Session session, InputStream inputStream, Node targetNode) {
		BufferedInputStream in = null;
		try {
			log.debug("Import to Node: " + targetNode.getPath());
			in = new BufferedInputStream(new AutoCloseInputStream(inputStream));

			/*
			 * TIP: Search this codebase for "SecurityProvider" and "PARAM_IMPORT_BEHAVIOR" if you
			 * are troubleshooting why this import may with errors related to security and user
			 * authorizations.
			 */

			session.getWorkspace().importXML(targetNode.getPath(), in, //
					// ImportUUIDBehavior.IMPORT_UUID_COLLISION_THROW//
					ImportUUIDBehavior.IMPORT_UUID_CREATE_NEW //
			);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		finally {
			/* The importXML should have already closed, but we add here just to be sure */
			StreamUtil.close(in);
		}
	}
}
