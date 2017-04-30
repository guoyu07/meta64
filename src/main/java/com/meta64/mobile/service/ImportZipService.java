package com.meta64.mobile.service;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.io.IOUtils;
import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.MimeUtil;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.XString;

@Component
@Scope("prototype")
public class ImportZipService {
	private static final Logger log = LoggerFactory.getLogger(ImportZipService.class);

	@Autowired
	private AppProp appProp;

	@Autowired
	private MimeUtil mimeUtil;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private JsonToJcrService jsonToJcrService;

	@Autowired
	private SessionContext sessionContext;

	private String targetPath;

	private ZipInputStream zis = null;
	private Session session;

	/*
	 * for performance we create a map of folders (relative names, directly from the zip file, as
	 * the key)
	 */
	private HashMap<String, Node> folderMap = new HashMap<String, Node>();

	public void inputZipFileFromStream(Session session, InputStream is, Node node) {

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
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	private void processDirectory(ZipEntry entry) {
		String name = entry.getName();
		String nameNoSlash = XString.truncateAfterLast(name, "/");
		String lastPart = XString.parseAfterLast(nameNoSlash, "/");
		log.info("DIR: " + name);

		Node node = JcrUtil.ensureNodeExists(session, targetPath, name, null, "meta64:folder", false);
		try {
			node.setProperty(JcrProp.NAME, lastPart);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
		JcrUtil.timestampNewNode(session, node);
		if (node == null) throw new RuntimeEx("Failed to create directory node");

		/* Note: these entries end with "/" because they are all folders */
		folderMap.put(entry.getName(), node);
	}

	private void processFile(ZipEntry entry) {
		String name = entry.getName();
		log.info("FILE: " + entry.getName());
		String fileName = name.substring(name.lastIndexOf("/") + 1);
		String folderNoSlash = XString.truncateAfterLast(name, "/");
		Node folderNode = folderMap.get(folderNoSlash + "/");
		if (folderNode == null) throw new RuntimeEx("unable to find folder node: " + folderNoSlash + "/");

		Node newNode = null;

		try {
			if (mimeUtil.isJsonFileType(fileName)) {
				String json = IOUtils.toString(zis, "UTF-8");
				newNode = jsonToJcrService.importJsonFile(json, folderNode);
			}
			else if (mimeUtil.isTextTypeFileName(fileName)) {
				newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				String text = IOUtils.toString(zis, "UTF-8");
				newNode.setProperty(JcrProp.CONTENT, fileName + "\n\n" + text);
			}
			else {
				newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				newNode.setProperty(JcrProp.CONTENT, fileName);

				String mimeType = URLConnection.guessContentTypeFromName(fileName);

				/*
				 * the JCR api force closes the stream so for now we just pass a stream that it's ok
				 * to close. Better solution is probably to create an InputStream wrapper that has
				 * an overridden close() method that does nothing, because we cannot close the zip
				 * stream we are reading from!
				 */
				byte[] bytes = IOUtils.toByteArray(zis);
				ByteArrayInputStream bais = new ByteArrayInputStream(bytes);

				attachmentService.saveBinaryStreamToNode(session, bais, mimeType, fileName, -1, -1, newNode);
			}

			newNode.setProperty(JcrProp.FILENAME, fileName);
			JcrUtil.timestampNewNode(session, newNode);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	/*
	 * todo-0: this is older code written before the rest of the code in this class, that I just
	 * haven't reenabled yet, which reads from an actual file-system source. Will bring this back
	 * online soon. This would be used for admin purposes in order to load into the repository data
	 * from a zip file located on a filesystem directly visible to the server.
	 */
	public void importFromZip(Session session, ImportRequest req, ImportResponse res) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
			}

			if (!sessionContext.isAdmin()) {
				throw new RuntimeEx("import is an admin-only feature.");
			}

			String nodeId = req.getNodeId();
			Node importNode = JcrUtil.findNode(session, nodeId);
			log.debug("Import to Node: " + importNode.getPath());

			if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
				throw new RuntimeEx("adminDataFolder does not exist");
			}

			String fileName = req.getSourceFileName();
			fileName = fileName.replace(".", "_");
			fileName = fileName.replace(File.separator, "_");
			String fullFileName = appProp.getAdminDataFolder() + File.separator + req.getSourceFileName();

			if (!FileTools.fileExists(fullFileName)) {
				throw new RuntimeEx("Import file not found.");
			}

			ZipInputStream zis = null;
			try {
				BufferedInputStream bis = new BufferedInputStream(new FileInputStream(fullFileName));

				/*
				 * todo-1: Currently we only support importing a zip by using the upload featuer
				 * (not direct file reading as is here) but I can call the method in
				 * ImportZipStreamService.inputZipFileFromStream to import from a file here. I just
				 * don't have time to put that line of code here and test it but adding that one
				 * line here should theoretically 'just work'
				 */
			}
			finally {
				StreamUtil.close(zis);
			}

			res.setSuccess(true);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

}
