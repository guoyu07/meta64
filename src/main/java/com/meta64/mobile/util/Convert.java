package com.meta64.mobile.util;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.nodetype.NodeType;
import javax.jcr.security.AccessControlEntry;
import javax.jcr.security.Privilege;

import org.apache.commons.lang3.StringEscapeUtils;
import org.pegdown.Extensions;
import org.pegdown.PegDownProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

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
@Component
public class Convert {

	public static final int MAX_INLINE_CHARS = 500;
	public static final boolean ALLOW_ROW_TRUCATION = false;

	/*
	 * We have to use full annotation here because we already have a different Value class in the
	 * imports section
	 */
	@org.springframework.beans.factory.annotation.Value("${donateButton}")
	private String donateButton;

	public static final boolean serverMarkdown = true;
	public static final boolean defaultToMarkdown = true;

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
	public NodeInfo convertToNodeInfo(SessionContext sessionContext, Session session, Node node, boolean htmlOnly, boolean allowAbbreviated) throws Exception {
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
		// log.trace("hasNodes=" + hasNodes + " path=" + node.getPath());

		List<PropertyInfo> propList = buildPropertyInfoList(sessionContext, node, htmlOnly, allowAbbreviated);

		NodeType nodeType = JcrUtil.safeGetPrimaryNodeType(node);
		String primaryTypeName = nodeType == null ? "n/a" : nodeType.getName();
		/*
		 * log.debug("convertNodeInfo: " + node.getPath() + node.getName() + " type: " +
		 * primaryTypeName + " hasBinary=" + hasBinary);
		 */

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

	/*
	 * todo-0: need to document what's going on in this method, and eventually add a checkbox called
	 * "plaintext" to set ext=txt
	 */
	public boolean shouldUseMarkdownRendering(Node node) throws Exception {
		String fileName = JcrUtil.safeGetStringProp(node, JcrProp.FILENAME);

		/* if there's a file name it's extension takes precidence */
		if (fileName == null) {

			/* otherwise look for just ext property alone and use it if found */
			String ext = JcrUtil.safeGetStringProp(node, JcrProp.MIME_EXT);
			if ("md".equalsIgnoreCase(ext)) {
				return true;
			}
			if ("txt".equalsIgnoreCase(ext)) {
				return false;
			}
			return defaultToMarkdown;
		}
		else {
			return fileName.toLowerCase().endsWith(".md");
		}
	}

	public List<PropertyInfo> buildPropertyInfoList(SessionContext sessionContext, Node node, //
			boolean htmlOnly, boolean allowAbbreviated) throws Exception {
		List<PropertyInfo> props = null;
		PropertyIterator propsIter = node.getProperties();
		PropertyInfo contentPropInfo = null;

		boolean useMarkdown = shouldUseMarkdownRendering(node);

		while (propsIter.hasNext()) {
			/* lazy create props */
			if (props == null) {
				props = new LinkedList<PropertyInfo>();
			}
			Property p = propsIter.nextProperty();

			PropertyInfo propInfo = convertToPropertyInfo(sessionContext, node, p, htmlOnly, allowAbbreviated, useMarkdown);
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

	public PropertyInfo convertToPropertyInfo(SessionContext sessionContext, Node node, Property prop, boolean htmlOnly, boolean allowAbbreviated, boolean useMarkdown)
			throws Exception {
		String value = null;
		String htmlValue = null;
		boolean abbreviated = false;
		List<String> values = null;

		/* multivalue */
		if (prop.isMultiple()) {
			// log.trace(String.format("prop[%s] isMultiple", prop.getName()));
			values = new LinkedList<String>();

			// int valIdx = 0;
			for (Value v : prop.getValues()) {
				String strVal = formatValue(sessionContext, v, false, useMarkdown);
				// log.trace(String.format(" val[%d]=%s", valIdx, strVal));
				values.add(strVal);
				// valIdx++;
			}
		}
		/* else single value */
		else {
			if (prop.getName().equals(JcrProp.BIN_DATA)) {
				// log.trace(String.format("prop[%s] isBinary", prop.getName()));
				value = "[binary data]";
			}
			else if (prop.getName().equals(JcrProp.CONTENT)) {

				String val = prop.getValue().getString();

				/*
				 * truncate text if too long, and allowAbbreviated=true
				 * 
				 * I have this disabled ALLOW_ROW_TRUCATION=false, becasue I decided truncating text
				 * is not something that can really cleanly be done. What I'll do instead,
				 * eventually, is just make each node hight be limited wherever it would make sense
				 * but will still contain the full rendered content if the DIV its in is resized.
				 */
				if (ALLOW_ROW_TRUCATION && allowAbbreviated && val.length() > MAX_INLINE_CHARS) {
					abbreviated = true;
					val = XString.truncateAfter(val, "\n");
					val = XString.truncateAfter(val, "\r");
					if (val.length() > MAX_INLINE_CHARS) {
						val = val.substring(0, MAX_INLINE_CHARS);
					}
					val = StringEscapeUtils.escapeHtml4(val);
					val += "..." + buildMoreLink(node);

					/* log.trace(String.format("prop[%s] isContent", prop.getName())); */
					if (htmlOnly) {
						htmlValue = val;
						/*
						 * I can't remember what this n/r is for but it BREAKS app if it's not set
						 * to this
						 */
						value = "n/r";

						/* log.trace("prop[" + prop.getName() + "]=HTML: " + htmlValue); */
					}
					else {
						/*
						 * I can't remember what this n/r is for but it BREAKS app if it's not set
						 * to this
						 */
						htmlValue = "n/r";

						value = val;
						/* log.trace("prop[" + prop.getName() + "]=NON-HTML:" + value); */
					}
				}
				/* otherwise render full text */
				else {
					// log.trace(String.format("prop[%s] isContent", prop.getName()) + "
					// useMarkdown=" + useMarkdown);
					if (htmlOnly) {
						htmlValue = formatValue(sessionContext, prop.getValue(), true, useMarkdown);
						/*
						 * I can't remember what this n/r is for but it BREAKS app if it's not set
						 * to this
						 */
						value = "n/r";

						/* log.trace("prop[" + prop.getName() + "]=HTML: " + htmlValue); */
					}
					else {
						/*
						 * I can't remember what this n/r is for but it BREAKS app if it's not set
						 * to this
						 */
						htmlValue = "n/r";

						value = formatValue(sessionContext, prop.getValue(), false, useMarkdown);
						/* log.trace("prop[" + prop.getName() + "]=NON-HTML:" + value); */
					}
				}
			}
			else {
				value = formatValue(sessionContext, prop.getValue(), false, useMarkdown);
				/* log.trace(String.format("prop[%s]=%s", prop.getName(), value)); */
			}
		}
		PropertyInfo propInfo = new PropertyInfo(prop.getType(), prop.getName(), value, htmlValue, abbreviated, values);
		return propInfo;
	}

	public String buildMoreLink(Node node) throws Exception {
		StringBuilder sb = new StringBuilder();
		sb.append("<a class=\"moreLinkStyle\" onclick=\"m64.nav.expandMore('" + node.getIdentifier() + "');\">[more]</a>");
		return sb.toString();
	}

	public String basicTextFormatting(String val) {
		val = val.replace("\n\r", "<p>");
		val = val.replace("\n", "<p>");
		val = val.replace("\r", "<p>");
		return val;
	}

	public String formatValue(SessionContext sessionContext, Value value, boolean convertToHtml, boolean useMarkdown) {
		try {
			if (value.getType() == PropertyType.DATE) {
				return sessionContext.formatTime(value.getDate().getTime());
			}
			else {
				String ret = null;

				if (convertToHtml && serverMarkdown) {
					ret = StringEscapeUtils.escapeHtml4(value.getString());

					if (useMarkdown) {
						ret = getMarkdownProc().markdownToHtml(ret);
					}
					else {
						ret = basicTextFormatting(ret);
					}

				}
				else {
					ret = value.getString();
				}

				/* need this to go only on the renderable text. not the SAVED text. */
				if (convertToHtml) {
					ret = ret.replace("{{donateButton}}", donateButton);
					ret = finalTagReplace(ret);
				}

				return ret;
			}
		}
		catch (Exception e) {
			return "";
		}
	}

	public static String finalTagReplace(String val) {
		val = val.replace("[pre]<p></p>", "<pre class='customPre'>");
		val = val.replace("[pre]<p>", "<pre class='customPre'>");
		val = val.replace("[pre]", "<pre class='customPre'>");
		val = val.replace("[/pre]", "</pre>");
		return val;
	}

	/*
	 * PegDownProcessor is not threadsafe, and also I don't want to create more of them than
	 * necessary so we simply attach one to each thread, and the thread-safety is no longer an
	 * issue.
	 */
	public static PegDownProcessor getMarkdownProc() {
		PegDownProcessor proc = ThreadLocals.getMarkdownProc();
		if (proc == null) {
			proc = new PegDownProcessor(Extensions.FENCED_CODE_BLOCKS);
			ThreadLocals.setMarkdownProc(proc);
		}
		return proc;
	}
}
