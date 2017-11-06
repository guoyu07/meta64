package com.meta64.mobile.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;
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
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.LimitedInputStreamEx;
import com.meta64.mobile.util.MimeUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.XString;

/**
 * Import from ZIP files. Imports zip files that have the same type of directory structure and
 * content as the files zip files that are exported from SubNode. The zip file doesn't of course
 * have to have been actually exported from SubNode in order to import it, but merely have the
 * proper layout/content.
 */
@Component
@Scope("prototype")
public class ImportZipService {
	private static final Logger log = LoggerFactory.getLogger(ImportZipService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private MimeUtil mimeUtil;

	@Autowired
	private SubNodeUtil apiUtil;

	@Autowired
	private JsonToSubNodeService jsonToNodeService;
	
	@Autowired
	private SessionContext sessionContext;

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
	private String curFileName = null;
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

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean importAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;
		if (!importAllowed && !sessionContext.isAdmin()) {
			throw ExUtil.newEx("You are not authorized to import.");
		}
		
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
			// save last node (required, it won't get saved without this)
			saveIfPending();
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

	private SubNode ensureNodeExists(String path) {
		SubNode folderNode = folderMap.get(path);
		if (folderNode == null) {
			folderNode = apiUtil.ensureNodeExists(session, targetPath, path, null);
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
		// log.info("HASHED PATH: " + sb.toString());
		return sb.toString();
	}

	private void processFile(ZipEntry entry) {
		String name = entry.getName();
		int lastSlashIdx = name.lastIndexOf("/");
		String fileName = name.substring(lastSlashIdx + 1);
		String path = name.substring(0, lastSlashIdx);
		path = hashizePath(path);

		/*
		 * If the path is changing, that means we're on a new node and need to reset state variables
		 */
		if (curPath == null || !curPath.equals(path)) {
			saveIfPending();
			curNode = null;
			curContent = null;
			curFileName = null;
		}

		curPath = path;

		ByteArrayInputStream bais = null;
		
		/*
		 * todo-1: This value exists in properties file, and also in TypeScript variable. Need to
		 * have better way to define this ONLY in properties file.
		 */
		int maxFileSize = 20 * 1024 * 1024;
		LimitedInputStreamEx bais2 = null;
		
		try {
			if (mimeUtil.isJsonFileType(fileName)) {
				curFileName = fileName;
				String json = IOUtils.toString(zis, "UTF-8");
				curNode = ensureNodeExists(path);
				jsonToNodeService.importJsonContent(json, curNode);
			}
			else if (mimeUtil.isTextTypeFileName(fileName)) {
				curContent = IOUtils.toString(zis, "UTF-8");
			}
			else {
				curNode = ensureNodeExists(path);
				if (curContent == null) {
					curContent = fileName;
				}

				String mimeType = URLConnection.guessContentTypeFromName(fileName);

				/*
				 * the JCR api force closes the stream so for now we just pass a stream that it's ok
				 * to close. Better solution is probably to create an InputStream wrapper that has
				 * an overridden close() method that does nothing, because we cannot close the zip
				 * stream we are reading from!
				 */
				byte[] bytes = IOUtils.toByteArray(zis);
				bais = new ByteArrayInputStream(bytes);
				
				bais2 = new LimitedInputStreamEx(new ByteArrayInputStream(bytes), maxFileSize);

				/* Note: bais stream IS closed inside this method, so we don't close it here */
				attachmentService.attachBinaryFromStream(session, curNode, null, fileName, bytes.length, bais2, mimeType,
						-1, -1, false, false);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		finally {
			StreamUtil.close(bais, bais2);
		}
	}

	/* Saves the current node along with whatver curContent we currently have */
	private void saveIfPending() {
		/*
		 * If we never encountered a metadata content file in the folder, then default to using the
		 * filename we encoutered as the content
		 */
		if (curContent == null && curFileName != null) {
			curContent = curFileName;
		}

		if (curNode != null) {
			curNode.setProp(NodeProp.CONTENT, curContent);
			api.save(session, curNode);
		}
		curNode = null;
	}
}
