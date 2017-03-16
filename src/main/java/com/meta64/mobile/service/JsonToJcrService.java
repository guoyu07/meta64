package com.meta64.mobile.service;

import javax.jcr.Node;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.model.JcrTypedObjBase;

/* 
 * Work in progress. Developing a way to import structured content out of JSON files stored in the uploaded zips so that the JSON 
 * files in zips result in importing properties onto the node. The immediate plan and need for this is to be able to load RSS Feed definitions
 * without having to manually create them by hand. The exported XML that can be exported from a repository is not very convenient to work with
 * but the JSON will be perfect and only take a few more lines of code to accomplish.
 */
@Component
public class JsonToJcrService {
	private static final Logger log = LoggerFactory.getLogger(JsonToJcrService.class);

	private static final ObjectMapper jsonMapper = new ObjectMapper();
	
	public void importJsonFile(String json, Node fileNode) {
		try {
			JcrTypedObjBase obj = jsonMapper.readValue(json, JcrTypedObjBase.class);
			log.debug("JcrType detected: "+obj.getJcrType()); 
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
