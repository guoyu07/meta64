package com.meta64.mobile.service;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import com.meta64.mobile.model.ExportPropertyInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.XString;

/*
 * This class is still a work in progress but aside from some tweaking filenames, and writing 'content' text into a separate
 * file and minor things it's basically complete.
 * 
 * Writing binary attachment is not yet done (todo-0), but is actually trivial.
 * 
 */
@Component
@Scope("prototype")
public class ExportZipService {
	private static final Logger log = LoggerFactory.getLogger(ExportZipService.class);
	private SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.DATE_FORMAT_NO_TIMEZONE, DateUtil.DATE_FORMAT_LOCALE);

	/*
	 * We have varibles specific to this instance of an export run becasue this is a 'prototype'
	 * scope bean and so a new instance of this bean will be created for each export run
	 */
	private Session session;

	private ZipOutputStream zos;

	/* This object IS Threadsafe so this is the correct usage 'static final' */
	private static final ObjectMapper objectMapper = new ObjectMapper();
	static {
		objectMapper.setSerializationInclusion(Include.NON_NULL);
	}
	private static final ObjectWriter jsonWriter = objectMapper.writerWithDefaultPrettyPrinter();

	@Autowired
	private AppProp appProp;

	@Autowired
	private SessionContext sessionContext;

	public void export(Session session, ExportRequest req, ExportResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		this.session = session;

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

				/*
				 * Timestamp-based folder name groups the 4 redundant files we export
				 */
				Date date = new Date();
				String dirName = dateFormat.format(date);
				dirName = FileTools.ensureValidFileNameChars(dirName);

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

		/*
		 * Top preference for fileName is the nodeName if there is one todo-0: need to add valid
		 * characters conversion if necessary.
		 */
		String fileName = generateFileNameFromNode(node);

		while (propsIter.hasNext()) {
			Property prop = propsIter.nextProperty();
			processProperty(prop, allProps);
		}

		String json = jsonWriter.writeValueAsString(allProps);

		ZipEntry zi = new ZipEntry(parentFolder + "/" + fileName + "/json.txt");
		zos.putNextEntry(zi);
		zos.write(json.getBytes());
		zos.closeEntry();

		return fileName;
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
			fileName = XString.truncateAfter(fileName, "\n");
			fileName = XString.truncateAfter(fileName, "\r");
		}

		if (StringUtils.isEmpty(fileName)) {
			fileName = node.getName();
		}

		// log.debug(" nodePath="+node.getPath()+" ident="+node.getIdentifier()+"
		// fileName=["+fileName+"]");
		return fileName;
	}

	private void processProperty(Property prop, List<ExportPropertyInfo> allProps) throws Exception {
		ExportPropertyInfo propInfo = new ExportPropertyInfo();

		propInfo.setName(prop.getName());

		// todo-0: do I need type names?: probably should be an export option.
		// propInfo.setType(type);

		/* multivalue */
		if (prop.isMultiple()) {
			// log.trace(String.format("prop[%s] isMultiple", prop.getName()));
			propInfo.setValues(new LinkedList<String>());

			// int valIdx = 0;
			for (Value v : prop.getValues()) {
				String strVal = formatValue(sessionContext, v);
				// log.trace(String.format(" val[%d]=%s", valIdx, strVal));
				propInfo.getValues().add(strVal);
				// valIdx++;
			}
		}
		/* else single value */
		else {
			if (prop.getName().equals(JcrProp.BIN_DATA)) {
				// log.trace(String.format("prop[%s] isBinary", prop.getName()));
				propInfo.setValue("[bin]");
			}
			else
			// if (prop.getName().equals(JcrProp.CONTENT))
			{
				propInfo.setValue(formatValue(sessionContext, prop.getValue()));
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
