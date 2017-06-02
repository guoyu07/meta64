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
import com.meta64.mobile.util.ThreadLocals;

/**
 * Import from XML files.
 * <p>
 * Note: If you have any "mix:referencable" nodes (which will have jcr:uuid set on them) from when
 * you exported from some repository and then you are trying to import that identical data BACK into
 * the same repository at some other location. (Maybe you are testing export/import feature for
 * example), then you will get an exception (because of IMPORT_UUID_COLLISION_THROW), which is
 * CORRECT behavior. This is simply because the JCR will now allow two nodes on the same repo to
 * have the same UUID (for obvious reasons), so the only way to safely import data that will
 * duplicate IDs is that you must first edit the XML of what you are about to import, and just
 * literally put a NEW (i.e. different) value in all of the jcr:uuids. Obviously i need an automated
 * way to do this by machine, by preprocessing the XML file (after prompting the user when uuids are
 * detected), and automatically taking a 'hash of the hash' of the existing hash, before attempting
 * the import.
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

			// adminRunner.run((Session adminSession) -> {
			// try {
			// importFromFileToNode(adminSession, sourceFileName, targetNode);
			// javax.jcr.Value val = adminSession.getValueFactory().createValue(createdBy);
			// nodeEditService.recursiveSetPropertyOnAllNodes(adminSession, targetNode,
			// JcrProp.CREATED_BY, val);
			// } catch (Exception e) {
			// log.debug("failed importing nodes", e);
			// }
			// });

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
			log.debug("Import to Node: " + targetNode.getPath());
			BufferedInputStream in = new BufferedInputStream(new AutoCloseInputStream(new FileInputStream(fullFileName)));

			/*
			 * This REPLACE_EXISTING option has the effect (in my own words) as meaning that even if
			 * the some of the nodes have moved around since they were first exported they will be
			 * updated 'in their current place' as part of this import.
			 * 
			 * This UUID behavior is so interesting and powerful it really needs to be an option
			 * specified at the user level that determines how this should work.
			 */
			session.getWorkspace().importXML(targetNode.getPath(), in,
					// NOTE: I'm not sure if this is a bug yet or not, but if you import using
					// IMPORT_UUID_CREATE_NEW and a node with mix:referencable+jcr:uuid (renamed
					// node)
					// this option brings those nodes in at BOTTOM of treen and then therefore
					// breaks Merkle verification, and compareSubGrap also.
					ImportUUIDBehavior.IMPORT_UUID_COLLISION_THROW); // IMPORT_UUID_COLLISION_REPLACE_EXISTING);
																		// //
																		// IMPORT_UUID_CREATE_NEW);

			/*
			 * since importXML is documented to close the inputstream, we don't need to close it.
			 * This is not a mistake, plus we have AutoCloseInputStream for additional assurance
			 */
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}
}
