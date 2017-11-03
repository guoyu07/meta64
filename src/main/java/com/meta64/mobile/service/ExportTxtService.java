package com.meta64.mobile.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.ExportPropertyInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.ThreadLocals;

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
	private static final Logger log = LoggerFactory.getLogger(ExportTxtService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private SubNodeUtil util;

	@Autowired
	private AppProp appProp;
	
	@Autowired
	private SessionContext sessionContext;

	private MongoSession session;

	private BufferedOutputStream output = null;
	private String shortFileName;
	private String fullFileName;

	private static final byte[] NL = "\n".getBytes(StandardCharsets.UTF_8);

	private ExportResponse res;

	/*
	 * Exports the node specified in the req. If the node specified is "/", or the repository root,
	 * then we don't expect a filename, because we will generate a timestamped one.
	 */
	public void export(MongoSession session, ExportRequest req, ExportResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		this.res = res;
		this.session = session;
		
		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;
		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw ExUtil.newEx("You are not authorized to export.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			throw ExUtil.newEx("Exporting entire repository is not supported.");
		}
		else {
			log.info("Exporting to Text File");
			exportNodeToFile(session, nodeId);
			res.setFileName(shortFileName);
		}

		res.setSuccess(true);
	}

	private void exportNodeToFile(MongoSession session, String nodeId) {
		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist.");
		}

		shortFileName = "f" + util.getGUID() + ".md";
		fullFileName = appProp.getAdminDataFolder() + File.separator + shortFileName;

		SubNode exportNode = api.getNode(session, nodeId, true);
		try {
			log.debug("Export Node: " + exportNode.getPath() + " to file " + fullFileName);
			output = new BufferedOutputStream(new FileOutputStream(fullFileName));
			recurseNode(exportNode, 0);
			output.flush();
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		finally {
			StreamUtil.close(output);
			(new File(fullFileName)).deleteOnExit();
		}
	}

	private void recurseNode(SubNode node, int level) {
		if (node == null) return;

		/* process the current node */
		processNode(node);

		for (SubNode n : api.getChildren(session, node, true, null)) {
			recurseNode(n, level + 1);
		}
	}

	private void processNode(SubNode node) {
		try {
			if (node.getProperties() != null) {
				node.getProperties().forEach((propName, propVal) -> {
					// log.debug(" PROP: "+propName);

					if (propName.equals(NodeProp.BIN_FILENAME)) {
					}

					if (propName.equals(NodeProp.CONTENT)) {
						print(propVal.getValue().toString());
					}
					else if (propName.equals(NodeProp.BIN_VER)) {
					}
					else {
						ExportPropertyInfo propInfo = new ExportPropertyInfo();
						propInfo.setName(propName);
						propInfo.setVal(propVal.getValue());

					}
				});
			}
			print("\n----");
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	// private List<String> removeIgnoredProps(List<String> list) {
	// return list.stream().filter(item -> !ignoreProperty(item)).collect(Collectors.toList());
	// }
	//
	// private boolean displayProperty(String propName) {
	// if (NodeProp.CONTENT.equals(propName)) {
	// return true;
	// }
	// return false;
	// }

	/*
	 * todo-1: For verification of import/export we need to ignore these, but for DB replication in
	 * P2P we wouldn't. todo-1: need to store these values in a HASH for fast lookup
	 */
	// private boolean ignoreProperty(String propName) {
	// return JcrProp.CREATED.equals(propName) || //
	// JcrProp.LAST_MODIFIED.equals(propName) || //
	// JcrProp.CREATED_BY.equals(propName) || //
	// JcrProp.UUID.equals(propName) || //
	// JcrProp.MERKLE_HASH.equals(propName) || //
	// JcrProp.BIN_VER.equals(propName);
	// }

	// private void writeProperty(Property prop) {
	// try {
	// /* multivalue */
	// if (prop.isMultiple()) {
	// print(prop.getName() + ":");
	// for (Value v : prop.getValues()) {
	// print("* " + v.getString());
	// }
	// }
	// /* else single value */
	// else {
	// if (prop.getName().equals(JcrProp.BIN_DATA)) {
	// // writing a text file, so we ignore binaries...
	// }
	// else {
	// // print(prop.getName() + ":");
	// print(prop.getValue().getString());
	// }
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }

	private void print(String val) {
		try {
			output.write(val.getBytes(StandardCharsets.UTF_8));
			if (!val.endsWith("\n")) {
				output.write(NL);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}
}
