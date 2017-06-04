package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.jcr.ImportUUIDBehavior;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.io.input.AutoCloseInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.response.ImportResponse;
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
				throw ExUtil.newEx("You cannot import onto a node you do not own.");
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

		BufferedInputStream in = null;
		try {
			log.debug("Import to Node: " + targetNode.getPath());
			in = new BufferedInputStream(new AutoCloseInputStream(new FileInputStream(fullFileName)));

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
