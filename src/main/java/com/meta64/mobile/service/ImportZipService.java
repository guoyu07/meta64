package com.meta64.mobile.service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.MimeUtil;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.XString;

/**
 * Import from ZIP files.
 */
@Component
@Scope("prototype")
public class ImportZipService {
	private static final Logger log = LoggerFactory.getLogger(ImportZipService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private MimeUtil mimeUtil;

	@Autowired
	private SubNodeUtil jcrUtil;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private JsonToSubNodeService jsonToJcrService;

	private String targetPath;

	private ZipInputStream zis = null;
	private MongoSession session;

	/*
	 * for performance we create a map of folders (relative names, directly from the zip file, as
	 * the key), and only the PARTIAL path (paths from Zip) rather than full path which would
	 * include targetPath prefix.
	 */
	private HashMap<String, SubNode> folderMap = new HashMap<String, SubNode>();

	public void inputZipFileFromStream(MongoSession session, InputStream is, SubNode node) {
		// todo-0: re-enable authorization for imports
		// UserPreferences userPreferences = sessionContext.getUserPreferences();
		// boolean importAllowed = userPreferences != null ? userPreferences.isImportAllowed() :
		// false;
		//
		// if (!importAllowed && !sessionContext.isAdmin()) {
		// throw ExUtil.newEx("import is an admin-only feature.");
		// }

		try {
			targetPath = node.getPath();
			this.session = session;

			zis = new ZipInputStream(is);
			ZipEntry entry;
			while ((entry = zis.getNextEntry()) != null) {
				if (entry.isDirectory()) {
					processDirectory(entry);
				}
				else {
					processFile(entry);
				}
				zis.closeEntry();
			}
			zis.close();
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/*
	 * Since we construct directories on demand, we don't need to process any actual directory
	 * entries. The file entries have full paths that we use.
	 */
	private void processDirectory(ZipEntry entry) {
		String name = entry.getName();
		log.info("DIR: " + name);
	}

	private SubNode ensureNodeExists(String path) {
		SubNode folderNode = folderMap.get(path);
		if (folderNode == null) {
			folderNode = jcrUtil.ensureNodeExists(session, targetPath, path, "path: " + path);
		}

		if (folderNode == null) {
			throw ExUtil.newEx("Unable to create node: " + path);
		}

		log.debug("Path Node created: " + path);
		folderMap.put(path, folderNode);
		return folderNode;
	}

	private void processFile(ZipEntry entry) {
		String name = entry.getName();
		log.info("FILE: " + entry.getName());
		String fileName = name.substring(name.lastIndexOf("/") + 1);
		String folderNoSlash = XString.truncateAfterLast(name, "/");
		SubNode node = ensureNodeExists(folderNoSlash);

		try {
			if (mimeUtil.isJsonFileType(fileName)) {
				//todo-0: bring back ability to import the JSON also
				// String json = null;
				// json = IOUtils.toString(zis, "UTF-8");
				// jsonToJcrService.importJsonContent(json, node);
			}
			else if (mimeUtil.isTextTypeFileName(fileName)) {
				String text = IOUtils.toString(zis, "UTF-8");
				node.setProp(NodeProp.CONTENT, text);
				api.save(session, node);
			}
			else {
//				 newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
//				 newNode.setProperty(JcrProp.CONTENT, fileName);
//				
//				 String mimeType = URLConnection.guessContentTypeFromName(fileName);
//				
//				 /*
//				 * the JCR api force closes the stream so for now we just pass a stream that it's
//				 ok
//				 * to close. Better solution is probably to create an InputStream wrapper that has
//				 * an overridden close() method that does nothing, because we cannot close the zip
//				 * stream we are reading from!
//				 */
//				 byte[] bytes = IOUtils.toByteArray(zis);
//				 ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
//				
//				 /* Note: bais stream IS closed inside this method, so we don't close it here */
//				 attachmentService.saveBinaryStreamToNode(session, bais, mimeType, fileName, -1,
//				 -1,
//				 newNode);
			}
		}
		catch (Exception e) {
			log.error("Failed importing node", e);
		}
	}
}
