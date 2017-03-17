package com.meta64.mobile.service;

import java.util.HashMap;

import javax.jcr.Node;

import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.util.JcrUtil;

/* 
 * Work in progress. Developing a way to import structured content out of JSON files stored in the uploaded zips so that the JSON 
 * files in zips result in importing properties onto the node. The immediate plan and need for this is to be able to load RSS Feed definitions
 * without having to manually create them by hand. The exported XML that can be exported from a repository is not very convenient to work with
 * but the JSON will be perfect and only take a few more lines of code to accomplish.
 * 
 * I am aware of JCROM which could be used in this code, but my needs are so simple at this point I will just use a getter 
 * on the jsonMapper-created object instead of a fullblown ORM api.
 */
@Component
public class JsonToJcrService {
	private static final Logger log = LoggerFactory.getLogger(JsonToJcrService.class);

	private static final ObjectMapper jsonMapper = new ObjectMapper();

	public Node importJsonFile(String json, Node parentNode) {
		try {
			HashMap map = jsonMapper.readValue(json, HashMap.class);
			//JcrTypedObjBase obj = jsonMapper.convertValue(map, JcrTypedObjBase.class);
			return loadJcrNodeFromMap(map, parentNode);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	/* There will be a better map-lookup implementation for this eventually */
	public Node loadJcrNodeFromMap(HashMap map, Node parentNode) throws Exception {
		String jcrType = (String) map.get("jcrType");
		log.debug("JcrType detected: " + jcrType);

		Node newNode = null;
		if ("meta64:rssfeed".equalsIgnoreCase(jcrType)) {
			newNode = parentNode.addNode(JcrUtil.getGUID(), "meta64:rssfeed");
			loadJcrRssFeedNode(map, newNode);
		}
		else {
			throw new Exception("no JCROM class known for type: " + jcrType);
		}
		return newNode;
	}

	public void loadJcrRssFeedNode(HashMap map, Node node) throws Exception {
		setMapPropOnNode(map, node, "meta64:rssFeedSrc");
	}

	public void setMapPropOnNode(HashMap map, Node node, String propName) throws Exception {
		node.setProperty(propName, (String) map.get(propName));
	}
}
