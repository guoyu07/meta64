package com.meta64.mobile.util;

import java.util.Collections;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.image.ImageSize;
import com.meta64.mobile.model.NodeInfo;
import com.meta64.mobile.model.PropertyInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodePropVal;
import com.meta64.mobile.mongo.model.SubNodePropertyMap;

/**
 * Converting objects from one type to another, and formatting.
 */
@Component
public class Convert {
	@Autowired
	private MongoApi api;
	//
	// /*
	// * We have to use full annotation here because we already have a different Value class in the
	// * imports section
	// */
	// @org.springframework.beans.factory.annotation.Value("${donateButton}")
	// private String donateButton;
	//
	public static final PropertyInfoComparator propertyInfoComparator = new PropertyInfoComparator();

	private static final Logger log = LoggerFactory.getLogger(Convert.class);

	public static String JsonStringify(Object obj) {
		/*
		 * I haven't investigated the overhead of creating an ObjectMapper here, instead of using an
		 * already created one or pooling pattern for them, but I do know they aren't threadsafe, so
		 * just using a global one would not be good.
		 */
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		try {
			return mapper.writeValueAsString(obj);
		}
		catch (JsonProcessingException e) {
			throw ExUtil.newEx(e);
		}
	}

	public NodeInfo convertToNodeInfo(SessionContext sessionContext, MongoSession session, SubNode node, boolean htmlOnly, boolean allowAbbreviated,
			boolean initNodeEdit) {
		boolean hasBinary = false;
		boolean binaryIsImage = false;
		ImageSize imageSize = null;

		long binVer = node.getIntProp(NodeProp.BIN_VER);
		if (binVer > 0) {
			hasBinary = true;
			binaryIsImage = api.isImageAttached(node);

			if (binaryIsImage) {
				imageSize = api.getImageSize(node);
			}
		}

		UserPreferences userPreferences = sessionContext.getUserPreferences();
		boolean advancedMode = userPreferences != null ? userPreferences.isAdvancedMode() : false;
		boolean hasNodes = (api.getChildCount(node) > 0);
		// log.trace("hasNodes=" + hasNodes + " path=" + node.getPath());

		List<PropertyInfo> propList = buildPropertyInfoList(sessionContext, node, htmlOnly, allowAbbreviated, initNodeEdit);

		/*
		 * log.debug("convertNodeInfo: " + node.getPath() + node.getName() + " type: " +
		 * primaryTypeName + " hasBinary=" + hasBinary);
		 */

		// todo-0: this is a spot that can be optimized. We should be able to send just the
		// userNodeId back to client, and the client
		// should be able to deal with that (i think). depends on how much ownership info we need to
		// show user.
		SubNode userNode = api.getNode(session, node.getOwner(), false);
		String owner = userNode==null ? "?" : userNode.getStringProp(NodeProp.USER);

		NodeInfo nodeInfo = new NodeInfo(node.jsonId(), node.getPath(), node.getName(), owner, node.getOrdinal(), //
				node.getModifyTime(), propList, hasNodes, hasBinary, binaryIsImage, binVer, //
				imageSize != null ? imageSize.getWidth() : 0, //
				imageSize != null ? imageSize.getHeight() : 0, //
				node.getType());
		return nodeInfo;
	}

	public static ImageSize getImageSize(SubNode node) {

		ImageSize imageSize = new ImageSize();

		Long width = node.getIntProp(NodeProp.IMG_WIDTH);
		if (width != null) {
			imageSize.setWidth(width.intValue());
		}

		Long height = node.getIntProp(NodeProp.IMG_HEIGHT);
		if (height != null) {
			imageSize.setHeight(height.intValue());
		}

		return imageSize;
	}

	public List<PropertyInfo> buildPropertyInfoList(SessionContext sessionContext, SubNode node, //
			boolean htmlOnly, boolean allowAbbreviated, boolean initNodeEdit) {
		try {
			List<PropertyInfo> props = null;
			SubNodePropertyMap propMap = node.getProperties();
			PropertyInfo contentPropInfo = null;

			for (Map.Entry<String, SubNodePropVal> entry : propMap.entrySet()) {
				String propName = entry.getKey();
				SubNodePropVal p = entry.getValue();

				/* lazy create props */
				if (props == null) {
					props = new LinkedList<PropertyInfo>();
				}

				PropertyInfo propInfo = convertToPropertyInfo(sessionContext, node, propName, p, htmlOnly, allowAbbreviated, initNodeEdit);
				// log.debug(" PROP Name: " + p.getName());

				/*
				 * grab the content property, and don't put it in the return list YET, because we
				 * will be sorting the list and THEN putting the content at the top of that sorted
				 * list.
				 */
				if (propName.equals(NodeProp.CONTENT)) {
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
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	public PropertyInfo convertToPropertyInfo(SessionContext sessionContext, SubNode node, String propName, SubNodePropVal prop, boolean htmlOnly,
			boolean allowAbbreviated, boolean initNodeEdit) {
		try {
			String value = null;
			boolean abbreviated = false;
			List<String> values = null;

			/*
			 * multivalue
			 * 
			 * meh, not sure i even want the mongo api to support multivalue properties. We can just
			 * have a property value of type array ?
			 */
			// if (prop.isMultiple()) {
			// // log.trace(String.format("prop[%s] isMultiple", prop.getName()));
			// values = new LinkedList<String>();
			//
			// // int valIdx = 0;
			// for (Value v : prop.getValues()) {
			// String strVal = formatValue(sessionContext, v, false, initNodeEdit);
			// // log.trace(String.format(" val[%d]=%s", valIdx, strVal));
			// values.add(strVal);
			// // valIdx++;
			// }
			// }
			// /* else single value */
			// else {
			if (propName.equals(NodeProp.CONTENT)) {
				value = formatValue(sessionContext, prop.getValue(), htmlOnly, initNodeEdit);
				/* log.trace(String.format("prop[%s]=%s", prop.getName(), value)); */
			}
			else {
				value = formatValue(sessionContext, prop.getValue(), false, initNodeEdit);
				/* log.trace(String.format("prop[%s]=%s", prop.getName(), value)); */
			}
			// }

			PropertyInfo propInfo = new PropertyInfo(prop.getType(), propName, value, abbreviated, values);
			return propInfo;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	public String basicTextFormatting(String val) {
		val = val.replace("\n\r", "<p>");
		val = val.replace("\n", "<p>");
		val = val.replace("\r", "<p>");
		return val;
	}

	//
	// public String formatValue(SessionContext sessionContext, Value value, boolean convertToHtml,
	// boolean initNodeEdit) {
	// try {
	// if (value.getType() == PropertyType.DATE) {
	// return sessionContext.formatTime(value.getDate().getTime());
	// }
	// else {
	// String ret = value.getString();
	//
	// /*
	// * If we are doing an initNodeEdit we don't do this, because we want the text to
	// * render to the user exactly as they had typed it and not with links converted.
	// */
	// if (!initNodeEdit) {
	// ret = convertLinksToMarkdown(ret);
	// }
	//
	// // may need to revisit this (todo-2)
	// // ret = finalTagReplace(ret);
	// // ret = basicTextFormatting(ret);
	//
	// return ret;
	// }
	// }
	// catch (Exception e) {
	// return "";
	// }
	// }
	//
	public String formatValue(SessionContext sessionContext, Object value, boolean convertToHtml, boolean initNodeEdit) {
		try {
			if (value instanceof Date) {
				return sessionContext.formatTime((Date) value);
			}
			else {
				String ret = value.toString();

				/*
				 * If we are doing an initNodeEdit we don't do this, because we want the text to
				 * render to the user exactly as they had typed it and not with links converted.
				 */
				if (!initNodeEdit) {
					ret = convertLinksToMarkdown(ret);
				}

				// may need to revisit this (todo-2)
				// ret = finalTagReplace(ret);
				// ret = basicTextFormatting(ret);

				return ret;
			}
		}
		catch (Exception e) {
			return "";
		}
	}

	/**
	 * Searches in 'val' anywhere there is a line that begins with http:// (or https), and replaces
	 * that with the normal way of doing a link in markdown. So we are injecting a snippet of
	 * markdown (not html)
	 * 
	 * todo-1: i noticed this method gets called during the 'saveNode' processing and then is called
	 * again when the server refreshes the whole page. This is something that is a slight bit of
	 * wasted processing.
	 */
	public static String convertLinksToMarkdown(String val) {
		while (true) {
			/* find http after newline character */
			int startOfLink = val.indexOf("\nhttp://");

			/* or else find one after return char */
			if (startOfLink == -1) {
				startOfLink = val.indexOf("\rhttp://");
			}

			/* or else find one after return char */
			if (startOfLink == -1) {
				startOfLink = val.indexOf("\nhttps://");
			}

			/* or else find one after return char */
			if (startOfLink == -1) {
				startOfLink = val.indexOf("\rhttps://");
			}

			/* nothing found we're all done here */
			if (startOfLink == -1) break;

			/*
			 * locate end of link via \n or \r
			 */
			int endOfLink = val.indexOf("\n", startOfLink + 1);
			if (endOfLink == -1) {
				endOfLink = val.indexOf("\r", startOfLink + 1);
			}
			if (endOfLink == -1) {
				endOfLink = val.length();
			}

			String link = val.substring(startOfLink + 1, endOfLink);

			String left = val.substring(0, startOfLink + 1);
			String right = val.substring(endOfLink);
			val = left + "[" + link + "](" + link + ")" + right;
		}
		return val;
	}

	public static String finalTagReplace(String val) {
		val = val.replace("[pre]<p></p>", "<pre class='customPre'>");
		val = val.replace("[pre]<p>", "<pre class='customPre'>");
		val = val.replace("[pre]", "<pre class='customPre'>");
		val = val.replace("[/pre]", "</pre>");
		return val;
	}
}
