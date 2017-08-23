package com.meta64.mobile.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Import from ZIP files.
 */
@Component
@Scope("prototype")
public class ImportZipService {
//	private static final Logger log = LoggerFactory.getLogger(ImportZipService.class);
//
//	@Autowired
//	private AppProp appProp;
//
//	@Autowired
//	private MimeUtil mimeUtil;
//
//	@Autowired
//	private AttachmentService attachmentService;
//
//	@Autowired
//	private JsonToJcrService jsonToJcrService;
//
//	@Autowired
//	private SessionContext sessionContext;
//
//	private String targetPath;
//
//	private ZipInputStream zis = null;
//	private Session session;
//
//	/*
//	 * for performance we create a map of folders (relative names, directly from the zip file, as
//	 * the key)
//	 */
//	private HashMap<String, Node> folderMap = new HashMap<String, Node>();
//
//	public void inputZipFileFromStream(Session session, InputStream is, Node node) {
//
//		try {
//			targetPath = node.getPath();
//			this.session = session;
//
//			zis = new ZipInputStream(is);
//			ZipEntry entry;
//			while ((entry = zis.getNextEntry()) != null) {
//				if (entry.isDirectory()) {
//					processDirectory(entry);
//				}
//				else {
//					processFile(entry);
//				}
//				zis.closeEntry();
//			}
//			zis.close();
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
//
//	private void processDirectory(ZipEntry entry) {
//		String name = entry.getName();
//		String nameNoSlash = XString.truncateAfterLast(name, "/");
//		String lastPart = XString.parseAfterLast(nameNoSlash, "/");
//		log.info("DIR: " + name);
//
//		Node node = JcrUtil.ensureNodeExists(session, targetPath, name, null, "meta64:folder", false);
//		if (node == null) throw ExUtil.newEx("Failed to create directory node");
//
//		try {
//			node.setProperty(JcrProp.NAME, lastPart);
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//		JcrUtil.timestampNewNode(session, node);
//
//		/* Note: these entries end with "/" because they are all folders */
//		folderMap.put(entry.getName(), node);
//	}
//
//	private void processFile(ZipEntry entry) {
//		String name = entry.getName();
//		log.info("FILE: " + entry.getName());
//		String fileName = name.substring(name.lastIndexOf("/") + 1);
//		String folderNoSlash = XString.truncateAfterLast(name, "/");
//		Node folderNode = folderMap.get(folderNoSlash + "/");
//		if (folderNode == null) throw ExUtil.newEx("unable to find folder node: " + folderNoSlash + "/");
//
//		Node newNode = null;
//
//		try {
//			if (mimeUtil.isJsonFileType(fileName)) {
//				String json = IOUtils.toString(zis, "UTF-8");
//				newNode = jsonToJcrService.importJsonFile(json, folderNode);
//			}
//			else if (mimeUtil.isTextTypeFileName(fileName)) {
//				newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
//				String text = IOUtils.toString(zis, "UTF-8");
//				newNode.setProperty(JcrProp.CONTENT, fileName + "\n\n" + text);
//			}
//			else {
//				newNode = folderNode.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
//				newNode.setProperty(JcrProp.CONTENT, fileName);
//
//				String mimeType = URLConnection.guessContentTypeFromName(fileName);
//
//				/*
//				 * the JCR api force closes the stream so for now we just pass a stream that it's ok
//				 * to close. Better solution is probably to create an InputStream wrapper that has
//				 * an overridden close() method that does nothing, because we cannot close the zip
//				 * stream we are reading from!
//				 */
//				byte[] bytes = IOUtils.toByteArray(zis);
//				ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
//
//				/* Note: bais stream IS closed inside this method, so we don't close it here */
//				attachmentService.saveBinaryStreamToNode(session, bais, mimeType, fileName, -1, -1, newNode);
//			}
//
//			newNode.setProperty(JcrProp.FILENAME, fileName);
//			JcrUtil.timestampNewNode(session, newNode);
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
//
//	public void importFromLocalZipFile(Session session, ImportRequest req, ImportResponse res) {
//		try {
//			if (session == null) {
//				session = ThreadLocals.getJcrSession();
//			}
//
//			UserPreferences userPreferences = sessionContext.getUserPreferences();
//			boolean importAllowed = userPreferences != null ? userPreferences.isImportAllowed() : false;
//
//			if (!importAllowed && !sessionContext.isAdmin()) {
//				throw ExUtil.newEx("import is an admin-only feature.");
//			}
//
//			String nodeId = req.getNodeId();
//			Node importNode = JcrUtil.findNode(session, nodeId);
//			log.debug("Import to Node: " + importNode.getPath());
//
//			if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
//				throw ExUtil.newEx("adminDataFolder does not exist");
//			}
//
//			String fileName = req.getSourceFileName();
//			fileName = fileName.replace(".", "_");
//			fileName = fileName.replace(File.separator, "_");
//			String fullFileName = appProp.getAdminDataFolder() + File.separator + req.getSourceFileName();
//
//			if (!FileTools.fileExists(fullFileName)) {
//				throw ExUtil.newEx("Import file not found.");
//			}
//
//			BufferedInputStream bis = null;
//			try {
//				bis = new BufferedInputStream(new FileInputStream(fullFileName));
//				inputZipFileFromStream(session, bis, importNode);
//			}
//			finally {
//				StreamUtil.close(zis);
//			}
//
//			res.setSuccess(true);
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}

}
