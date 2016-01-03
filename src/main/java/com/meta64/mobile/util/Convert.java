package com.meta64.mobile.util;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlEntry;
import javax.jcr.security.Privilege;

import org.pegdown.PegDownProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.image.ImageSize;
import com.meta64.mobile.image.ImageUtil;
import com.meta64.mobile.model.AccessControlEntryInfo;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.PrivilegeInfo;
import com.meta64.mobile.model.PropertyInfo;
import com.meta64.mobile.model.UserPreferences;

/**
 * Converting objects from one type to another, and formatting.
 */
public class Convert {

	public static final PropertyInfoComparator propertyInfoComparator = new PropertyInfoComparator();

	private static final Logger log = LoggerFactory.getLogger(Convert.class);

	public static String JsonStringify(Object obj) throws Exception {
		/*
		 * I haven't investigated the overhead of creating an ObjectMapper here, instead of using an
		 * already created one or pooling pattern for them, but I do know they aren't threadsafe, so
		 * just using a global one would not be good.
		 */
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		return mapper.writeValueAsString(obj);
	}

	public static List<AccessControlEntryInfo> convertToAclListInfo(AccessControlEntry[] aclEntries) {
		List<AccessControlEntryInfo> aclEntriesInfo = new LinkedList<AccessControlEntryInfo>();

		if (aclEntries != null) {
			for (AccessControlEntry ace : aclEntries) {
				AccessControlEntryInfo aceInfo = new AccessControlEntryInfo();
				aceInfo.setPrincipalName(ace.getPrincipal().getName());

				List<PrivilegeInfo> privInfoList = new LinkedList<PrivilegeInfo>();
				for (Privilege privilege : ace.getPrivileges()) {

					PrivilegeInfo privInfo = new PrivilegeInfo();
					privInfo.setPrivilegeName(privilege.getName());
					privInfoList.add(privInfo);
				}

				aceInfo.setPrivileges(privInfoList);
				aclEntriesInfo.add(aceInfo);
			}
		}

		return aclEntriesInfo;
	}

	/*
	 * WARNING: skips the check for ordered children and just assigns false for performance reasons
	 */
	public static NodeInfo convertToNodeInfo(SessionContext sessionContext, Session session, Node node, boolean htmlOnly) throws Exception {
		boolean hasBinary = false;
		boolean binaryIsImage = false;
		long binVer = 0;
		ImageSize imageSize = null;
		try {
			binVer = getBinaryVersion(node);
			if (binVer > 0) {

				/* if we didn't get an exception, we know we have a binary */
				hasBinary = true;
				binaryIsImage = isImageAttached(node);

				if (binaryIsImage) {
					imageSize = getImageSize(node);
				}
			}
		}
		catch (Exception e) {
			// not an error. means node has no binary subnode.
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean advancedMode = userPreferences != null ? userPreferences.isAdvancedMode() : false;
		boolean hasNodes = JcrUtil.hasDisplayableNodes(advancedMode, node);
		log.trace("hasNodes=" + hasNodes + " path=" + node.getPath());

		List<PropertyInfo> propList = buildPropertyInfoList(sessionContext, node, htmlOnly);

		NodeType nodeType = JcrUtil.safeGetPrimaryNodeType(node);
		String primaryTypeName = nodeType == null ? "n/a" : nodeType.getName();
		// log.debug("Node: "+node.getPath()+node.getName()+" type:
		// "+primaryTypeName);

		NodeInfo nodeInfo = new NodeInfo(node.getIdentifier(), node.getPath(), node.getName(), propList, hasNodes, false, hasBinary, binaryIsImage, binVer, //
				imageSize != null ? imageSize.getWidth() : 0, //
				imageSize != null ? imageSize.getHeight() : 0, //
				primaryTypeName);
		return nodeInfo;
	}

	public static long getBinaryVersion(Node node) throws Exception {
		Property versionProperty = node.getProperty(JcrProp.BIN_VER);
		if (versionProperty != null) {
			return versionProperty.getValue().getLong();
		}
		return 0;
	}

	public static ImageSize getImageSize(Node node) throws Exception {
		ImageSize imageSize = new ImageSize();

		Property widthProperty = node.getProperty(JcrProp.IMG_WIDTH);
		if (widthProperty != null) {
			imageSize.setWidth((int) widthProperty.getValue().getLong());
		}

		Property heightProperty = node.getProperty(JcrProp.IMG_HEIGHT);
		if (heightProperty != null) {
			imageSize.setHeight((int) heightProperty.getValue().getLong());
		}
		return imageSize;
	}

	public static boolean isImageAttached(Node node) throws Exception {
		Property mimeTypeProp = node.getProperty(JcrProp.BIN_MIME);
		return (mimeTypeProp != null && //
				mimeTypeProp.getValue() != null && //
				ImageUtil.isImageMime(mimeTypeProp.getValue().getString()));
	}

	public static List<PropertyInfo> buildPropertyInfoList(SessionContext sessionContext, Node node, //
			boolean htmlOnly) throws RepositoryException {
		List<PropertyInfo> props = null;
		PropertyIterator iter = node.getProperties();
		PropertyInfo contentPropInfo = null;

		while (iter.hasNext()) {
			/* lazy create props */
			if (props == null) {
				props = new LinkedList<PropertyInfo>();
			}
			Property p = iter.nextProperty();

			PropertyInfo propInfo = convertToPropertyInfo(sessionContext, p, htmlOnly);
			// log.debug(" PROP Name: " + p.getName());

			/*
			 * grab the content property, and don't put it in the return list YET, because we will
			 * be sorting the list and THEN putting the content at the top of that sorted list.
			 */
			if (p.getName().equals(JcrProp.CONTENT)) {
				contentPropInfo = propInfo;
			}
			else {
				props.add(propInfo);
			}
		}

		if (props != null) {
			Collections.sort(props, propertyInfoComparator);

			/* put content prop always at top of list */
			if (contentPropInfo != null) {
				props.add(0, contentPropInfo);
			}
		}
		return props;
	}

	public static PropertyInfo convertToPropertyInfo(SessionContext sessionContext, Property prop, boolean htmlOnly) throws RepositoryException {
		String value = null;
		String htmlValue = null;
		List<String> values = null;

		/* multivalue */
		if (prop.isMultiple()) {
			log.trace(String.format("prop[%s] isMultiple", prop.getName()));
			values = new LinkedList<String>();

			int valIdx = 0;
			for (Value v : prop.getValues()) {
				String strVal = formatValue(sessionContext, v, false);
				log.trace(String.format("     val[%d]=%s", valIdx, strVal));
				values.add(strVal);
				valIdx++;
			}
		}
		/* else single value */
		else {
			if (prop.getName().equals(JcrProp.BIN_DATA)) {
				log.trace(String.format("prop[%s] isBinary", prop.getName()));
				value = "[binary data]";
			}
			else if (prop.getName().equals(JcrProp.CONTENT)) {
				log.trace(String.format("prop[%s] isContent", prop.getName()));
				if (htmlOnly) {
					htmlValue = formatValue(sessionContext, prop.getValue(), true);
					value = "n/r";
				}
				else {
					htmlValue = "n/r";
					value = formatValue(sessionContext, prop.getValue(), false);
				}
			}
			else {
				value = formatValue(sessionContext, prop.getValue(), false);
				log.trace(String.format("prop[%s]=%s", prop.getName(), value));
			}
		}
		PropertyInfo propInfo = new PropertyInfo(prop.getType(), prop.getName(), value, htmlValue, values);
		return propInfo;
	}

	public static String formatValue(SessionContext sessionContext, Value value, boolean convertToHtml) {
		try {
			if (value.getType() == PropertyType.DATE) {
				return sessionContext.formatTime(value.getDate().getTime());
			}
			else {
				if (convertToHtml) {
					return getMarkdownProc().markdownToHtml(value.getString());
				}
				else {
					return value.getString();
				}
			}
		}
		catch (Exception e) {
			return "";
		}
	}

	/*
	 * PegDownProcessor is not threadsafe, and also I don't want to create more of them than
	 * necessary so we simply attach one to each thread, and the thread-safey is no longer an issue.
	 */
	public static PegDownProcessor getMarkdownProc() {
		PegDownProcessor proc = ThreadLocals.getMarkdownProc();
		if (proc == null) {
			proc = new PegDownProcessor();
			ThreadLocals.setMarkdownProc(proc);
		}
		return proc;
	}
}
