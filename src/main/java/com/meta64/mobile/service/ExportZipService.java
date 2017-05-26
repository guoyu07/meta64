package com.meta64.mobile.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.model.ExportNodeInfo;
import com.meta64.mobile.model.ExportPropertyInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.XString;

/**
 * todo-0: need to alphabetically sort the properties in the output JSON text file
 */
@Component
@Scope("prototype")
public class ExportZipService {
	private static final Logger log = LoggerFactory.getLogger(ExportZipService.class);

	private ZipOutputStream zos;

	/* This object IS Threadsafe so this is the correct usage 'static final' */
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

	/**
	 * Exports the node specified in 'req' into a zip file.
	 * 
	 * @param session
	 * @param req
	 * @param res
	 */
	public void export(Session session, ExportRequest req, ExportResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;

		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw ExUtil.newEx("export is an admin-only feature.");
		}

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw ExUtil.newEx("adminDataFolder does not exist");
		}

		String nodeId = req.getNodeId();

		if (nodeId.equals("/")) {
			throw ExUtil.newEx("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();
			String fullZipName = appProp.getAdminDataFolder() + File.separator + fileName;

			// append zip extension if not provided
			if (!fullZipName.toLowerCase().endsWith(".zip")) {
				fullZipName += ".zip";
			}

			/*
			 * We don't support overwriting existing files, since exported files are so important,
			 * so we always require a filename that does not already exist.
			 */
			if (FileTools.fileExists(fullZipName)) {
				throw ExUtil.newEx("File already exists: " + fullZipName);
			}

			boolean success = false;
			try {
				zos = new ZipOutputStream(new FileOutputStream(fullZipName));

				Node node = JcrUtil.findNode(session, nodeId);
				recurseNode("", node, 0);
				success = true;
			}
			catch (Exception ex) {
				throw ExUtil.newEx(ex);
			}
			finally {
				StreamUtil.close(zos);

				if (!success) {
					FileTools.deleteFile(fullZipName);
				}
			}
		}

		res.setSuccess(true);
	}

	private void recurseNode(String parentFolder, Node node, int level) {
		if (node == null) return;

		/* process the current node */
		String folder = processNodeExport(parentFolder, node);

		/* then recursively process all children of the current node */
		NodeIterator nodeIter;
		try {
			nodeIter = JcrUtil.getNodes(node);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}

		try {
			while (true) {
				Node n = nodeIter.nextNode();
				recurseNode(parentFolder + "/" + folder, n, level + 1);
			}
		}
		catch (NoSuchElementException ex) {
			// not an error. Normal iterator end condition.
		}
	}

	/*
	 * NOTE: It's correct that there's no finally block in here enforcing the closeEntry, becasue we
	 * let exceptions bubble all the way up to abort and even cause the zip file itself (to be
	 * deleted) since it was unable to be written to.
	 */
	private String processNodeExport(String parentFolder, Node node) {
		try {
			PropertyIterator propsIter = node.getProperties();

			log.debug("Processing Node: " + node.getPath());

			String fileName = generateFileNameFromNode(node);

			/*
			 * the processProperty calls in the while loop below loads into these variables, in
			 * addition to doing what it does.
			 */
			List<ExportPropertyInfo> allProps = new LinkedList<ExportPropertyInfo>();
			ValContainer<String> contentText = new ValContainer<String>();
			ValContainer<Property> binDataProp = new ValContainer<Property>();
			ValContainer<String> binFileName = new ValContainer<String>();

			while (propsIter.hasNext()) {
				Property prop = propsIter.nextProperty();
				processProperty(prop, allProps, contentText, binDataProp, binFileName);
			}

			ExportNodeInfo expInfo = new ExportNodeInfo();
			expInfo.setPath(node.getPath());
			expInfo.setId(node.getIdentifier());
			expInfo.setType(node.getPrimaryNodeType().getName());
			expInfo.setProps(allProps);
			String json = jsonWriter.writeValueAsString(expInfo);

			addFileEntry(parentFolder + "/" + fileName + "/" + fileName + ".json", json.getBytes());

			/* If content property was found write it into separate file */
			if (contentText.getVal() != null) {
				/*
				 * In situations where the fileName happens to equal the contentText we do not even
				 * write the content text file because it would be redundant.
				 */
				if (!fileName.trim().equals(contentText.getVal().trim())) {
					addFileEntry(parentFolder + "/" + fileName + "/" + fileName + ".txt", contentText.getVal().getBytes());
				}
			}

			/*
			 * If we had a binary property on this node we write the binary file into a separate
			 * file
			 */
			if (binDataProp.getVal() != null) {
				String binFileNameStr = binFileName.getVal() == null ? "binary" : binFileName.getVal();

				InputStream is = null;
				try {
					is = binDataProp.getVal().getBinary().getStream();
					addFileEntry(parentFolder + "/" + fileName + "/" + binFileNameStr, IOUtils.toByteArray(is));
				}
				finally {
					StreamUtil.close(is);
				}
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

		log.debug("ZIPENTRY: " + fileName);
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

	private String generateFileNameFromNode(Node node) {
		String fileName = null;
		try {
			if ("meta64:folder".equalsIgnoreCase(node.getPrimaryNodeType().getName())) {
				fileName = JcrUtil.safeGetStringProp(node, JcrProp.META6_TYPE_FOLDER);
			}

			/*
			 * The only way I know to tell if the 'node.getName()' will return something the user
			 * named it to (meaning not some long hex code GUID), is by checking if we set
			 * referencable or not. Not sure if this is a good long term solution but is good for
			 * now.
			 */
			if (StringUtils.isEmpty(fileName) && node.isNodeType(JcrConstants.MIX_REFERENCEABLE)) {
				fileName = node.getName();
			}

			if (StringUtils.isEmpty(fileName)) {
				fileName = JcrUtil.safeGetStringProp(node, JcrProp.CONTENT);
				fileName = fileName.trim();
				fileName = XString.truncateAfter(fileName, "\n");
				fileName = XString.truncateAfter(fileName, "\r");
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
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/*
	 * Adds prop to allProps, unless it's sent back in contentText because content property will be
	 * written to a separate file.
	 */
	private void processProperty(Property prop, List<ExportPropertyInfo> allProps, ValContainer<String> contentText, ValContainer<Property> binDataProp,
			ValContainer<String> binFileName) {
		try {
			ExportPropertyInfo propInfo = new ExportPropertyInfo();

			propInfo.setName(prop.getName());

			/* multivalue */
			if (prop.isMultiple()) {
				// log.trace(String.format("prop[%s] isMultiple", prop.getName()));
				propInfo.setVals(new LinkedList<String>());

				// int valIdx = 0;
				for (Value v : prop.getValues()) {
					String strVal = formatValue(sessionContext, v);
					// log.trace(String.format(" val[%d]=%s", valIdx, strVal));
					propInfo.getVals().add(strVal);
					// valIdx++;
				}
			}
			/* else single value */
			else {
				if (prop.getName().equals(JcrProp.CONTENT)) {
					contentText.setVal(formatValue(sessionContext, prop.getValue()));
				}
				else if (prop.getName().equals(JcrProp.BIN_DATA)) {
					// log.trace(String.format("prop[%s] isBinary", prop.getName()));
					binDataProp.setVal(prop);
				}
				else if (prop.getName().equals(JcrProp.BIN_FILENAME)) {
					binFileName.setVal(formatValue(sessionContext, prop.getValue()));
				}
				else {
					propInfo.setVal(formatValue(sessionContext, prop.getValue()));
					/* log.trace(String.format("prop[%s]=%s", prop.getName(), value)); */
				}
			}

			if (!propInfo.isEmpty()) {
				allProps.add(propInfo);
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	public String formatValue(SessionContext sessionContext, Value value) {
		try {
			if (value.getType() == PropertyType.DATE) {
				return sessionContext.formatTime(value.getDate().getTime());
			}
			else {
				String ret = value.getString();
				return ret;
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}
}
