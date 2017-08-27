package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.InputStream;

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
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

@Component
public class ImportService {
	private static final Logger log = LoggerFactory.getLogger(ImportService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private ImportZipService importZipService;	

	/*
	 * Import from User's computer. Standard HTML form-based uploading of a file from user machine
	 */
	public ResponseEntity<?> streamImport(MongoSession session, String nodeId, MultipartFile[] uploadFiles) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		SubNode node = api.getNode(session, nodeId);
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

			if (!fileName.toLowerCase().endsWith(".zip")) {
				throw ExUtil.newEx("Only ZIP files are currently supported for importing via upload stream.");
			}

			try {
				importFromStreamToNode(session, uploadFile.getInputStream(), node);
			}
			catch (Exception ex) {
				throw ExUtil.newEx(ex);
			}
		}

		api.saveSession(session);
		// }
		// catch (Exception e) {
		// log.error(e.getMessage());
		// return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		// }

		return new ResponseEntity<>(HttpStatus.OK);
	}

	// public void importFromXml(MongoSession session, ImportRequest req, ImportResponse res) {
	// if (session == null) {
	// session = ThreadLocals.getMongoSession();
	// }
	//
	// UserPreferences userPreferences = sessionContext.getUserPreferences();
	// boolean importAllowed = userPreferences != null ? userPreferences.isImportAllowed() : false;
	//
	// if (!importAllowed && !sessionContext.isAdmin()) {
	// throw ExUtil.newEx("import is an admin-only feature.");
	// }
	//
	// String nodeId = req.getNodeId();
	//
	// if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
	// throw ExUtil.newEx("adminDataFolder does not exist");
	// }
	//
	// String sourceFileName = req.getSourceFileName();
	//
	// if (nodeId.equals("/") && sourceFileName.startsWith("full-backup-")) {
	//
	// /* See notes above about backing up root not being doable */
	// throw ExUtil.newEx("root restore not supported.");
	// }
	// else {
	// Node targetNode = JcrUtil.findNode(session, nodeId);
	//// String createdBy = JcrUtil.safeGetStringProp(targetNode, JcrProp.CREATED_BY);
	////
	//// /*
	//// * Detect if this node is a comment we "own" (although true security rules make it
	//// * belong to admin user) then we should be able to delete it, so we execute the delete
	//// * under an 'AdminSession'. Also now that we have switched sessions, we set that in the
	//// * return value, so the caller can always, stop processing after this happens. Meaning
	//// * essentialy only *one* comment node can be deleted at a time unless you are admin
	//// * user.
	//// */
	//// if (!session.getUserID().equals(createdBy) &&
	// !JcrPrincipal.ADMIN.equalsIgnoreCase(session.getUserID())) {
	//// throw ExUtil.newEx("You cannot import onto a node you do not own. Including your root.");
	//// }
	//
	// importFromFileToNode(session, sourceFileName, targetNode);
	// }
	//
	// res.setSuccess(true);
	// }

	private void importFromStreamToNode(MongoSession session, InputStream inputStream, SubNode targetNode) {
		BufferedInputStream in = null;
		try {
			log.debug("Import to Node: " + targetNode.getPath());
			in = new BufferedInputStream(new AutoCloseInputStream(inputStream));

			importZipService.inputZipFileFromStream(session, inputStream, targetNode);
			
			/*
			 * TIP: Search this codebase for "SecurityProvider" and "PARAM_IMPORT_BEHAVIOR" if you
			 * are troubleshooting why this import may fail with errors related to security and user
			 * authorizations.
			 */
//			session.getWorkspace().importXML(targetNode.getPath(), in, //
//					// ImportUUIDBehavior.IMPORT_UUID_COLLISION_THROW//
//					ImportUUIDBehavior.IMPORT_UUID_CREATE_NEW //
//			);
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
