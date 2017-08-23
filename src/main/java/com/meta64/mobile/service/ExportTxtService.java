package com.meta64.mobile.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Export to Text file
 * 
 * todo-1: add options user can select like whether or not to include property names (divider line),
 * etc. For now we hardcode to include properties.
 * 
 * todo-1: there should be some ORDERING of properties, like 'content' maybe always at the top etc.
 * 
 * todo-1: need to add better mechanism for deleting files after a certain amount of time.
 * 
 */
@Component
@Scope("prototype")
public class ExportTxtService {
//	private static final Logger log = LoggerFactory.getLogger(ExportTxtService.class);
//
//	@Autowired
//	private AppProp appProp;
//
//	@Autowired
//	private ConstantsProvider constProvider;
//
//	private BufferedOutputStream output = null;
//	private String shortFileName;
//	private String fullFileName;
//
//	private static final byte[] NL = "\n".getBytes(StandardCharsets.UTF_8);
//
//	private ExportResponse res;
//
//	/*
//	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
//	 * then we don't expect a filename, because we will generate a timestamped one.
//	 */
//	public void export(Session session, ExportRequest req, ExportResponse res) {
//		if (session == null) {
//			session = ThreadLocals.getJcrSession();
//		}
//		this.res = res;
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
//			log.info("Exporting to Text File");
//			exportNodeToFile(session, nodeId);
//			res.setFileName(shortFileName);
//		}
//
//		res.setSuccess(true);
//	}
//
//	private void exportNodeToFile(Session session, String nodeId) {
//		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
//			throw ExUtil.newEx("adminDataFolder does not exist.");
//		}
//
//		shortFileName = "f" + JcrUtil.getGUID() + ".md";
//		fullFileName = appProp.getAdminDataFolder() + File.separator + shortFileName;
//
//		Node exportNode = JcrUtil.findNode(session, nodeId);
//		try {
//			log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);
//			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
//			recurseNode(exportNode);
//			output.flush();
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//		finally {
//			StreamUtil.close(output);
//			(new File(fullFileName)).deleteOnExit();
//		}
//	}
//
//	private void recurseNode(Node node) {
//		if (node == null) return;
//
//		if (JcrUtil.isProtectedNode(node)) {
//			return;
//		}
//
//		/* process the current node */
//		processNode(node);
//
//		try {
//			/* then recursively process all children of the current node */
//			NodeIterator nodeIter;
//			try {
//				nodeIter = JcrUtil.getNodes(node);
//			}
//			catch (Exception ex) {
//				throw ExUtil.newEx(ex);
//			}
//
//			try {
//				while (true) {
//					Node n = nodeIter.nextNode();
//					recurseNode(n);
//				}
//			}
//			catch (NoSuchElementException ex) {
//				// not an error. Normal iterator end condition.
//			}
//		}
//		catch (Exception e) {
//			throw ExUtil.newEx(e);
//		}
//	}
//
//	private void processNode(Node node) {
//		try {
//			/* Get ordered set of property names. Ordering is significant for SHA256 obviously */
//			List<String> propNames = JcrUtil.getPropertyNames(node, true);
//			// propNames = removeIgnoredProps(propNames);
//
//			for (String propName : propNames) {
//				if (displayProperty(propName)) {
//					Property prop = node.getProperty(propName);
//					writeProperty(prop);
//				}
//			}
//			print("\n----");
//
//			// updateDigest(digester, "type");
//			// updateDigest(digester, node.getPrimaryNodeType().getName());
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
//
//	private List<String> removeIgnoredProps(List<String> list) {
//		return list.stream().filter(item -> !ignoreProperty(item)).collect(Collectors.toList());
//	}
//
//	private boolean displayProperty(String propName) {
//		if (JcrProp.CONTENT.equals(propName)) {
//			return true;
//		}
//		return false;
//	}
//	
//	/*
//	 * todo-1: For verification of import/export we need to ignore these, but for DB replication in
//	 * P2P we wouldn't. todo-1: need to store these values in a HASH for fast lookup
//	 */
//	private boolean ignoreProperty(String propName) {
//		return JcrProp.CREATED.equals(propName) || //
//				JcrProp.LAST_MODIFIED.equals(propName) || //
//				JcrProp.CREATED_BY.equals(propName) || //
//				JcrProp.UUID.equals(propName) || //
//				JcrProp.MERKLE_HASH.equals(propName) || //
//				JcrProp.BIN_VER.equals(propName);
//	}
//
//	private void writeProperty(Property prop) {
//		try {
//			/* multivalue */
//			if (prop.isMultiple()) {
//				print(prop.getName() + ":");
//				for (Value v : prop.getValues()) {
//					print("* " + v.getString());
//				}
//			}
//			/* else single value */
//			else {
//				if (prop.getName().equals(JcrProp.BIN_DATA)) {
//					// writing a text file, so we ignore binaries...
//				}
//				else {
//					//print(prop.getName() + ":");
//					print(prop.getValue().getString());
//				}
//			}
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
//
//	private void print(String val) {
//		try {
//			output.write(val.getBytes(StandardCharsets.UTF_8));
//			if (!val.endsWith("\n")) {
//				output.write(NL);
//			}
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
}
