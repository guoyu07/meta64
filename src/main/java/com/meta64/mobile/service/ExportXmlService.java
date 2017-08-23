package com.meta64.mobile.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Export to and from XML files
 */
@Component
@Scope("prototype")
public class ExportXmlService {
//	private static final Logger log = LoggerFactory.getLogger(ExportXmlService.class);
//
//	@Autowired
//	private AppProp appProp;
//
//	@Autowired
//	private ConstantsProvider constProvider;
//	
//	private String shortFileName;
//	private String fullFileName;
//
//	public enum ExportXMLViewType {
//		SYSTEM, DOCUMENT
//	};
//
//	@Autowired
//	private SessionContext sessionContext;
//
//	/*
//	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
//	 * then we don't expect a filename, because we will generate a timestamped one.
//	 */
//	public void export(Session session, ExportRequest req, ExportResponse res) {
//		if (session == null) {
//			session = ThreadLocals.getJcrSession();
//		}
//
//		UserPreferences userPreferences = sessionContext.getUserPreferences();
//		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;
//
//		if (!exportAllowed && !sessionContext.isAdmin()) {
//			throw ExUtil.newEx("export is an admin-only feature.");
//		}
//
//		String nodeId = req.getNodeId();
//
//		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
//			throw ExUtil.newEx("adminDataFolder does not exist");
//		}
//
//		if (nodeId.equals("/")) {
//			throw ExUtil.newEx("Exporting entire repository is not supported.");
//		}
//		else {
//			shortFileName = "f" + JcrUtil.getGUID() + ".xml";
//
//			// Date date = new Date();
//			// String dirName = dateFormat.format(date);
//			// dirName = FileTools.ensureValidFileNameChars(dirName);
//
//			/*
//			 * For now, out of an abundance of caution for backups do all for combinations of SYSTEM
//			 * v.s. DOCUMENT export both with and without binaries.
//			 */
//
//			log.info("Exporting System View.");
//			exportNodeToXMLFile(session, nodeId, ExportXMLViewType.SYSTEM, true);
//			res.setFileName(shortFileName);
//			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.SYSTEM, false);
//
//			// log.info("Exporting Document View.");
//			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.DOCUMENT, true);
//			// exportNodeToXMLFile(session, nodeId, fileName, ExportXMLViewType.DOCUMENT, false);
//		}
//
//		res.setSuccess(true);
//	}
//
//	private void exportNodeToXMLFile(Session session, String nodeId, ExportXMLViewType formatType, boolean includeBinaries) {
//
//		// String fileNameSuffix = null;
//		// switch (formatType) {
//		// case SYSTEM:
//		// fileNameSuffix = "SYSVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
//		// break;
//		// case DOCUMENT:
//		// fileNameSuffix = "DOCVIEW" + (includeBinaries ? "_BIN" : "_NOBIN");
//		// break;
//		// default:
//		// throw ExUtil.newEx("Invalid format type");
//		// }
//
//		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
//			throw ExUtil.newEx("adminDataFolder does not exist.");
//		}
//
//		fullFileName = appProp.getAdminDataFolder() + File.separator + shortFileName;
//
//		Node exportNode = JcrUtil.findNode(session, nodeId);
//
//		BufferedOutputStream output = null;
//		try {
//			log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);
//			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
//			String exportPath = exportNode.getPath();
//
//			/*
//			 * Refer to JCR 2.0 Spec regarding difference between SYSTEM v.s. DOCUMENT XML format,
//			 * but in a nutshell SYSTEM is better for serializing export data for backup or
//			 * specifically for reimporting later onto a JCR repository. DOCUMENT is more for
//			 * compatibility with XML standards itself and is helpful if something other than a JCR
//			 * DB might need to process the XML.
//			 * 
//			 */
//			switch (formatType) {
//			case SYSTEM:
//				session.exportSystemView(exportPath, output, !includeBinaries, false);
//				break;
//			case DOCUMENT:
//				session.exportDocumentView(exportPath, output, !includeBinaries, false);
//				break;
//			default:
//				throw ExUtil.newEx("Invalid format type");
//			}
//			output.flush();
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//		finally {
//			StreamUtil.close(output);
//		}
//
//	}
}
