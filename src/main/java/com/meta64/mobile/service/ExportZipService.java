package com.meta64.mobile.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
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
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.XString;

/*
 * todo-0: need to alphabetically sort the properties in the outpout JSON text file
 *
 */
@Component
@Scope("prototype")
public class ExportZipService {
	private static final Logger log = LoggerFactory.getLogger(ExportZipService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	private ZipOutputStream zos;

	/* This object IS Threadsafe so this is the correct usage 'static final' */
	private static final ObjectMapper objectMapper = new ObjectMapper();
	static {
		objectMapper.setSerializationInclusion(Include.NON_NULL);
	}
	private static final ObjectWriter jsonWriter = objectMapper.writerWithDefaultPrettyPrinter();

	/*
	 * It's possible that nodes under a given node can have same name, so we have to detect that and
	 * number them, so we use this hashset to detect existing filenames.
	 */
	private HashSet<String> fileNameSet = new HashSet<String>();

	@Autowired
	private AppProp appProp;

	@Autowired
	private SessionContext sessionContext;

	public void export(Session session, ExportRequest req, ExportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean exportAllowed = userPreferences != null ? userPreferences.isExportAllowed() : false;

		if (!exportAllowed && !sessionContext.isAdmin()) {
			throw new Exception("export is an admin-only feature.");
		}

		String nodeId = req.getNodeId();

		if (!FileTools.dirExists(appProp.getAdminDataFolder())) {
			throw new Exception("adminDataFolder does not exist");
		}

		if (nodeId.equals("/")) {
			throw new Exception("Backing up entire repository is not supported.");
		}
		else {
			String fileName = req.getTargetFileName();
			String fullZipName = appProp.getAdminDataFolder() + File.separator + fileName;
			if (!fullZipName.toLowerCase().endsWith(".zip")) {
				fullZipName += ".zip";
			}
			boolean success = false;
			try {
				zos = new ZipOutputStream(new FileOutputStream(fullZipName));

				Node node = JcrUtil.findNode(session, nodeId);
				recurseNode("", node, 0);
				success = true;
			}
			finally {
				if (zos != null) {
					zos.close();
				}

				if (!success) {
					// todo-0: delete the file we failed to write here in case it exists.
				}
			}
		}

		res.setSuccess(true);
	}

	private void recurseNode(String parentFolder, Node node, int level) throws Exception {
		if (node == null) return;

		String folder = processNodeExport(parentFolder, node);
		NodeIterator nodeIter = node.getNodes();

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
	 * let exceptions bubble all the way up to abort and even cause the zip file itself to be
	 * deleted since it was unable to be written to.
	 */
	private String processNodeExport(String parentFolder, Node node) throws Exception {
		PropertyIterator propsIter = node.getProperties();
		List<ExportPropertyInfo> allProps = new LinkedList<ExportPropertyInfo>();

		log.debug("Processing Node: " + node.getPath());

		/*
		 * Top preference for fileName is the nodeName if there is one todo-0: need to add valid
		 * characters conversion if necessary.
		 */
		String fileName = generateFileNameFromNode(node);

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
			 * In situations where the fileName happens to equal the contentText it is desirable to
			 * not even write the content text file because it would be redundant.
			 */
			if (!fileName.trim().equals(contentText.getVal().trim())) {
				addFileEntry(parentFolder + "/" + fileName + "/" + fileName + ".txt", contentText.getVal().getBytes());
			}
		}

		if (binDataProp.getVal() != null) {
			String binFileNameStr = binFileName.getVal() == null ? "binary" : binFileName.getVal();

			InputStream is = null;
			try {
				is = binDataProp.getVal().getBinary().getStream();
				addFileEntry(parentFolder + "/" + fileName + "/" + binFileNameStr, IOUtils.toByteArray(is));
			}
			finally {
				if (is != null) {
					is.close();
				}
			}
		}

		return fileName;
	}

	private String cleanupFileName(String fileName) {
		fileName = fileName.trim();
		fileName = FileTools.ensureValidFileNameChars(fileName);
		
		while (fileName.startsWith("-")) {
			fileName = fileName.substring(1);
			fileName = fileName.trim();
		}
		
		while (fileName.endsWith("-")) {
			fileName = fileName.substring(0, fileName.length()-1);
			fileName = fileName.trim();
		}
		
		return fileName;
	}
	
	private void addFileEntry(String fileName, byte[] bytes) throws Exception {
		/* If we have dupliated a filename, number it */
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
		zos.putNextEntry(zi);
		zos.write(bytes);
		zos.closeEntry();
	}

	private String generateFileNameFromNode(Node node) throws Exception {
		String fileName = null;

		if ("meta64:folder".equalsIgnoreCase(node.getPrimaryNodeType().getName())) {
			fileName = JcrUtil.safeGetStringProp(node, JcrProp.META6_TYPE_FOLDER);
		}

		/*
		 * The only way I know to tell if the 'node.getName()' will return something the user named
		 * it to (meaning not some long hex code GUI), is by checking if we set referencable or not.
		 * Not sure if this is a good long term solution but is good for now
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

	/*
	 * Adds prop to allProps, unless it's sent back in contentText because content property will be
	 * written to a separate file.
	 */
	private void processProperty(Property prop, List<ExportPropertyInfo> allProps, ValContainer<String> contentText, ValContainer<Property> binDataProp,
			ValContainer<String> binFileName) throws Exception {
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

	public String formatValue(SessionContext sessionContext, Value value) throws Exception {
		if (value.getType() == PropertyType.DATE) {
			return sessionContext.formatTime(value.getDate().getTime());
		}
		else {
			String ret = value.getString();
			return ret;
		}
	}
}
