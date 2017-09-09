package com.meta64.mobile.service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
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
	 * Since the TXT file could be encountered BEFORE the JSON file, we have to use this variable to
	 * hold the content because we cannot create the actual node we will write to UNTIL we see the
	 * JSON file so we can get the correct path constructed from that. If this is null, it means
	 * there was no content file or else it has already been written out.
	 */
	private String curContent = null;
	private SubNode curNode = null;

	/*
	 * Since Zip files don't in all cases support Directories (only Files) we have to check the path
	 * on each file, and whenever we see a new path part of any file then THAT is the only reliable
	 * tway to determine that a new folder is being processed, so this curPath is how we do this.
	 */
	private String curPath = null;

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
					/*
					 * WARNING: This method is here for clarity but usually will NOT BE CALLED. The
					 * Zip file format doesn't require folders to be stored but only FILES, and most
					 * Java implementations ignore Folders. So. Do not put any logic in
					 * processDirectory ever.
					 */
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
	 * WARNING: This NEVER GETS CALLED, and it's by design. Zip Files aren't required to have
	 * callbacks for folders usually DON'T!
	 */
	private void processDirectory(ZipEntry entry) {
	}

	private SubNode ensureNodeExists(String path, String curContent) {
		SubNode folderNode = folderMap.get(path);
		if (folderNode == null) {
			folderNode = jcrUtil.ensureNodeExists(session, targetPath, path, curContent != null ? curContent : "path: " + path);
		}

		if (folderNode == null) {
			throw ExUtil.newEx("Unable to create node: " + path);
		}

		log.debug("Path Node created: " + path);
		folderMap.put(path, folderNode);
		return folderNode;
	}

	private String hashizePath(String path) {
		List<String> pathItems = XString.tokenize(path, "/", true);
		StringBuilder sb = new StringBuilder();
		for (String pathPart : pathItems) {
			sb.append("/" + String.valueOf(Math.abs(pathPart.hashCode())));
		}
		log.info("HASHED PATH: " + sb.toString());
		return sb.toString();
	}

	private void processFile(ZipEntry entry) {
		String name = entry.getName();
		int lastSlashIdx = name.lastIndexOf("/");
		String fileName = name.substring(lastSlashIdx + 1);
		String path = name.substring(0, lastSlashIdx);
		path = hashizePath(path);

		if (curPath == null || !curPath.equals(path)) {
			curNode = null;
			curContent = null;
		}

		curPath = path;

		try {
			if (mimeUtil.isJsonFileType(fileName)) {
				String json = IOUtils.toString(zis, "UTF-8");
				curNode = ensureNodeExists(path, curContent);
				jsonToJcrService.importJsonContent(json, curNode);
				curContent = null;
			}
			else if (mimeUtil.isTextTypeFileName(fileName)) {
				String text = IOUtils.toString(zis, "UTF-8");

				/*
				 * depending of if we already saw the JSON file or not we may or may not have the
				 * node ready, so we either write content onto the node or hold it in curContent
				 * variable
				 */
				if (curNode != null) {
					curNode.setProp(NodeProp.CONTENT, text);
					api.save(session, curNode);
				}
				else {
					curContent = text;
				}
			}
			else {
				// newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				// newNode.setProperty(JcrProp.CONTENT, fileName);
				//
				// String mimeType = URLConnection.guessContentTypeFromName(fileName);
				//
				// /*
				// * the JCR api force closes the stream so for now we just pass a stream that it's
				// ok
				// * to close. Better solution is probably to create an InputStream wrapper that has
				// * an overridden close() method that does nothing, because we cannot close the zip
				// * stream we are reading from!
				// */
				// byte[] bytes = IOUtils.toByteArray(zis);
				// ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
				//
				// /* Note: bais stream IS closed inside this method, so we don't close it here */
				// attachmentService.saveBinaryStreamToNode(session, bais, mimeType, fileName, -1,
				// -1,
				// newNode);
			}
		}
		catch (Exception e) {
			log.error("Failed importing node", e);
		}
	}
}
