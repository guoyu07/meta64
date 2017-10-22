package com.meta64.mobile.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.DateUtil;

/**
 * Utility to read JSON and store into SubNode automatically.
 */
@Component
public class JsonToSubNodeService {
	private static final Logger log = LoggerFactory.getLogger(JsonToSubNodeService.class);
	private static final ObjectMapper jsonMapper = new ObjectMapper();

	public void importJsonContent(String json, SubNode parentNode) {
		try {
			HashMap<String, ?> map = jsonMapper.readValue(json, HashMap.class);
			setPropsFromMap(map, parentNode);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void setProp(SubNode node, String propName, Object propVal) {
		if (propName == null || propVal == null) return;

		/* Translate old format properties before saving */
		if (propName.equalsIgnoreCase("jcr:created")) {
			propName = SubNode.FIELD_CREATE_TIME;
			Date date = parseJankDate((String) propVal);
			node.setCreateTime(date);
			return;
		}
		else if (propName.equalsIgnoreCase("jcr:lastModified")) {
			propName = SubNode.FIELD_MODIFY_TIME;
			Date date = parseJankDate((String) propVal);
			node.setModifyTime(date);
			/*
			 * set this flag so we don't overwrite the mod time we are trying to import when the
			 * mongo event listener handles this object for a save.
			 */
			node.setUpdateModTimeOnSave(false);
			return;
		}

		if (propName.startsWith("jcr:") || propName.startsWith("meta64:")) {
			return;
		}
		
		if (propVal instanceof String) {
			node.setProp(propName, (String) propVal);
		}
		else if (propVal instanceof Date) {
			node.setProp(propName, (Date) propVal);
		}
		else if (propVal instanceof Integer) {
			node.setProp(propName, (Integer)propVal);
		}
		else if (propVal instanceof Long) {
			node.setProp(propName, (Long)propVal);
		}
		// todo-0: put in rest of types.
		else {
			throw new RuntimeException("Type not yet handled: " + propVal.getClass().getName() + " propName: " + propName);
		}
	}

	private Date parseJankDate(String dateStr) {
		/* due to bug in older code we fix a formatting error where there was a missing space */
		dateStr = dateStr.replace("PMCDT", "PM");
		dateStr = dateStr.replace("PMCST", "PM");
		dateStr = dateStr.replace("AMCDT", "AM");
		dateStr = dateStr.replace("AMCST", "AM");
		return DateUtil.parse(dateStr);
	}

	/* There will be a better map-lookup implementation for this eventually */
	public void setPropsFromMap(HashMap<String, ?> map, SubNode node) {
		//log.debug("_____");
		Object props = map.get("props");
		if (props instanceof ArrayList<?>) {
			for (Object elm : (ArrayList<?>) props) {
				if (elm instanceof LinkedHashMap) {
					LinkedHashMap<String, String> lhm = (LinkedHashMap<String, String>) elm;
					setProp(node, lhm.get("name"), lhm.get("val"));
				}
			}
		}
	}
}
