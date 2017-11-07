package com.meta64.mobile.service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.AutoCloseInputStream;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.ExportNodeInfo;
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
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.XString;

/**
 * Export to Zip file format
 * <p>
 * todo-1: need to alphabetically sort the properties in the output JSON text file
 */
@Component
@Scope("prototype")
public class ExportZipService {
	private static final Logger log = LoggerFactory.getLogger(ExportZipService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private SubNodeUtil util;

	private ZipOutputStream zos;

	private String shortFileName;
	private String fullFileName;

	/* This object is Threadsafe so this is the correct usage 'static final' */
	private static final ObjectMapper objectMapper = new ObjectMapper();
	static {
		objectMapper.setSerializationInclusion(Include.NON_NULL);
	}
	private static final ObjectWriter jsonWriter = objectMapper.writerWithDefaultPrettyPrinter();

	/*
	 * It's possible that nodes recursively contained under a given node can have same name, so we
	 * have to detect that and number them, so we use this hashset to detect existing filenames.
	 */
	private HashSet<String> fileNameSet = new HashSet<String>();

	@Autowired
	private AppProp appProp;
	
	@Autowired
	private SessionContext sessionContext;

	private MongoSession session;

	public void export(MongoSession session, ExportRequest req, ExportResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		this.session = session;

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;
		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw ExUtil.newEx("You are not authorized to export.");
		}

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist: " + appProp.getAdminDataFolder());
		}

		String nodeId = req.getNodeId();

		shortFileName = "f" + util.getGUID() + ".zip";
		fullFileName = appProp.getAdminDataFolder() + File.separator + shortFileName;

		boolean success = false;
		try {
			zos = new ZipOutputStream(new FileOutputStream(fullFileName));

			SubNode node = api.getNode(session, nodeId);
			api.authRequireOwnerOfNode(session, node);
			recurseNode("", node, 0);
			res.setFileName(shortFileName);
			success = true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
		finally {
			StreamUtil.close(zos);

			if (!success) {
				FileTools.deleteFile(fullFileName);
			}
		}

		res.setSuccess(true);
	}

	private void recurseNode(String parentFolder, SubNode node, int level) {
		if (node == null) return;

		/* process the current node */
		String folder = processNodeExport(parentFolder, node);

		for (SubNode n : api.getChildren(session, node, true, null)) {
			recurseNode(parentFolder + "/" + folder, n, level + 1);
		}
	}

	/*
	 * NOTE: It's correct that there's no finally block in here enforcing the closeEntry, becasue we
	 * let exceptions bubble all the way up to abort and even cause the zip file itself (to be
	 * deleted) since it was unable to be written to.
	 */
	private String processNodeExport(String parentFolder, SubNode node) {
		try {
			// log.debug("Processing Node: " + node.getPath());

			String fileName = generateFileNameFromNode(node);

			/*
			 * the processProperty calls in the while loop below loads into these variables, in
			 * addition to doing what it does.
			 */
			List<ExportPropertyInfo> allProps = new LinkedList<ExportPropertyInfo>();
			ValContainer<String> contentText = new ValContainer<String>();
			ValContainer<String> binVerProp = new ValContainer<String>();
			ValContainer<String> binFileNameProp = new ValContainer<String>();

			// todo-1: isn't there some CollectionUtils method to iterate that supports built in
			// "null collection" capability?
			if (node.getProperties() != null) {
				node.getProperties().forEach((propName, propVal) -> {

					// log.debug(" PROP: "+propName);

					if (propName.equals(NodeProp.BIN_FILENAME)) {
						binFileNameProp.setVal(propVal.getValue().toString());
					}

					if (propName.equals(NodeProp.CONTENT)) {
						contentText.setVal(propVal.getValue().toString());
					}
					else if (propName.equals(NodeProp.BIN_VER)) {
						binVerProp.setVal(propVal.getValue().toString());
					}
					else {
						ExportPropertyInfo propInfo = new ExportPropertyInfo();
						propInfo.setName(propName);
						propInfo.setVal(propVal.getValue());

						// I decided we should just infer the type from the property name and not
						// store it in the file.
						// propInfo.setType(NodePropertyTypes.getTypeOfObject(propVal.getValue()));

						allProps.add(propInfo);
					}
				});
			}

			ExportNodeInfo expInfo = new ExportNodeInfo();
			expInfo.setPath(node.getPath());
			expInfo.setId(node.getId().toHexString());
			expInfo.setType(node.getType());
			expInfo.setProps(allProps);
			String json = jsonWriter.writeValueAsString(expInfo);

			addFileEntry(parentFolder + "/" + fileName + "/props.json", json.getBytes(StandardCharsets.UTF_8));

			/* If content property was found write it into separate file */
			if (contentText.getVal() != null) {
				addFileEntry(parentFolder + "/" + fileName + "/content.md", contentText.getVal().getBytes(StandardCharsets.UTF_8));
			}

			/*
			 * If we had a binary property on this node we write the binary file into a separate
			 * file
			 */
			if (binVerProp.getVal() != null) {
				String binFileNameStr = binFileNameProp.getVal() != null ? binFileNameProp.getVal() : "binary";
				AutoCloseInputStream is = null;

				is = api.getAutoClosingStream(session, node, null);
				// long size = node.getIntProp(NodeProp.BIN_SIZE);
				addFileEntry(parentFolder + "/" + fileName + "/" + binFileNameStr, IOUtils.toByteArray(is));
			}

			return fileName;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private String cleanupFileName(String fileName) {
		fileName = fileName.trim();
		fileName = FileTools.ensureValidFileNameChars(fileName);

		while (fileName.startsWith("-")) {
			fileName = fileName.substring(1);
			fileName = fileName.trim();
		}

		while (fileName.endsWith("-")) {
			fileName = fileName.substring(0, fileName.length() - 1);
			fileName = fileName.trim();
		}

		return fileName;
	}

	private void addFileEntry(String fileName, byte[] bytes) {
		/* If we have duplicated a filename, number it sequentially to create a unique file */
		if (fileNameSet.contains(fileName)) {
			int idx = 1;
			String numberedFileName = fileName + String.valueOf(idx);
			while (fileNameSet.contains(numberedFileName)) {
				numberedFileName = fileName + String.valueOf(++idx);
			}
			fileName = numberedFileName;
		}

		fileNameSet.add(fileName);

		// log.debug("ZIPENTRY: " + fileName);
		ZipEntry zi = new ZipEntry(fileName);
		try {
			zos.putNextEntry(zi);
			zos.write(bytes);
			zos.closeEntry();
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private String generateFileNameFromNode(SubNode node) {
		String fileName = null;

		// if ("meta64:folder".equalsIgnoreCase(node.getPrimaryNodeType().getName())) {
		// fileName = JcrUtil.safeGetStringProp(node, JcrProp.META6_TYPE_FOLDER);
		// }

		if (StringUtils.isEmpty(fileName)) {
			fileName = node.getStringProp(NodeProp.CONTENT);
			if (fileName != null) {
				fileName = fileName.trim();
				fileName = XString.truncateAfterFirst(fileName, "\n");
				fileName = XString.truncateAfterFirst(fileName, "\r");
			}
		}

		if (StringUtils.isEmpty(fileName)) {
			fileName = node.getName();
		}

		fileName = cleanupFileName(fileName);

		// log.debug(" nodePath="+node.getPath()+" ident="+node.getIdentifier()+"
		// fileName=["+fileName+"]");
		fileName = XString.trimToMaxLen(fileName, 120);
		return fileName;
	}
}
