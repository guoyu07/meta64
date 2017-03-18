package com.meta64.mobile.service;

import java.io.ByteArrayInputStream;
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

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.MimeUtil;
import com.meta64.mobile.util.XString;

@Component
@Scope("prototype")
public class ImportZipStreamService {
	private static final Logger log = LoggerFactory.getLogger(ImportZipStreamService.class);

	@Autowired
	private MimeUtil mimeUtil;

	@Autowired
	private AttachmentService attachmentService;
	
	@Autowired
	private JsonToJcrService jsonToJcrService;

	private String targetPath;

	private ZipInputStream zis = null;
	private Session session;

	/*
	 * for performance we create a map of folders (relative names, directly from the zip file, as
	 * the key)
	 */
	private HashMap<String, Node> folderMap = new HashMap<String, Node>();

	public void inputZipFileFromStream(Session session, InputStream is, Node node) throws Exception {

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

	private void processDirectory(ZipEntry entry) throws Exception {
		String name = entry.getName();
		String nameNoSlash = XString.truncateAfterLast(name, "/");
		String lastPart = XString.parseAfterLast(nameNoSlash, "/");
		log.info("DIR: " + name);
			
		Node node = JcrUtil.ensureNodeExists(session, targetPath, name, null /* lastPart */, "meta64:folder", false);
		node.setProperty(JcrProp.NAME, lastPart);
		JcrUtil.timestampNewNode(session, node);
		if (node == null) throw new Exception("Failed to create directory node");

		/* Note: these entries end with "/" because they are all folders */
		folderMap.put(entry.getName(), node);
	}

	private void processFile(ZipEntry entry) throws Exception {
		String name = entry.getName();
		log.info("FILE: " + entry.getName());
		String fileName = name.substring(name.lastIndexOf("/") + 1);
		String folderNoSlash = XString.truncateAfterLast(name, "/");
		Node folderNode = folderMap.get(folderNoSlash + "/");
		if (folderNode == null) throw new Exception("unable to find folder node: " + folderNoSlash + "/");

		Node newNode = null;

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
			 * the JCR api force closes the stream so for now we just pass a stream that it's ok to
			 * close. Better solution is probably to create an InputStream wrapper that has an
			 * overridden close() method that does nothing, because we cannot close the zip stream
			 * we are reading from!
			 */
			byte[] bytes = IOUtils.toByteArray(zis);
			ByteArrayInputStream bais = new ByteArrayInputStream(bytes);

			attachmentService.saveBinaryStreamToNode(session, bais, mimeType, fileName, -1, -1, newNode);
		}
		newNode.setProperty(JcrProp.FILENAME, fileName);
		JcrUtil.timestampNewNode(session, newNode);
	}
}

