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

	private void importFromStreamToNode(MongoSession session, InputStream inputStream, SubNode targetNode) {
		BufferedInputStream in = null;
		try {
			log.debug("Import to Node: " + targetNode.getPath());
			in = new BufferedInputStream(new AutoCloseInputStream(inputStream));
			importZipService.inputZipFileFromStream(session, inputStream, targetNode);			
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
