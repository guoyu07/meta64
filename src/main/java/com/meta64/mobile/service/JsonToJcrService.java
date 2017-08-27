package com.meta64.mobile.service;

import java.io.IOException;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.ExUtil;

/**
 * Utility to read JSON and store into JCR automatically.
 * <p>
 * Work in progress. Developing a way to import structured content out of JSON files stored in the
 * uploaded zips so that the JSON files in zips result in importing properties onto the node. The
 * immediate plan and need for this is to be able to load RSS Feed definitions without having to
 * manually create them by hand. The exported XML that can be exported from a repository is not very
 * convenient to work with but the JSON will be perfect and only take a few more lines of code to
 * accomplish.
 */
@Component
public class JsonToJcrService {
	private static final Logger log = LoggerFactory.getLogger(JsonToJcrService.class);

	private static final ObjectMapper jsonMapper = new ObjectMapper();

	public SubNode importJsonContent(String json, SubNode parentNode) {

		try {
			HashMap map = jsonMapper.readValue(json, HashMap.class);
			// JcrTypedObjBase obj = jsonMapper.convertValue(map, JcrTypedObjBase.class);
			return loadJcrNodeFromMap(map, parentNode);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	/* There will be a better map-lookup implementation for this eventually */
	public SubNode loadJcrNodeFromMap(HashMap map, SubNode parentNode) {
//		String jcrType = (String) map.get("jcrType");
//		log.debug("JcrType detected: " + jcrType);
//
//		SubNode newNode = null;
//		if ("meta64:rssfeed".equalsIgnoreCase(jcrType)) {
//			newNode = parentNode.addNode(JcrUtil.getGUID(), "meta64:rssfeed");
//			loadJcrRssFeedNode(map, newNode);
//		}
//		else {
//			throw ExUtil.newEx("no JCROM class known for type: " + jcrType);
//		}
//		return newNode;
		return null;
	}

	public void loadJcrRssFeedNode(HashMap map, SubNode node) {
		setMapPropOnNode(map, node, "meta64:rssFeedSrc");
	}

	public void setMapPropOnNode(HashMap map, SubNode node, String propName) {
		node.setProp(propName, (String) map.get(propName));
	}
}
