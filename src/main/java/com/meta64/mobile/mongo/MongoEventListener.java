package com.meta64.mobile.mongo;

import java.util.Date;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;

import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.util.XString;
import com.mongodb.DBObject;

public class MongoEventListener extends AbstractMongoEventListener<SubNode> {

	private static final Logger log = LoggerFactory.getLogger(MongoEventListener.class);

	@Autowired
	private MongoApi api;

	/**
	 * What we are doing in this method is assigning the ObjectId ourselves, because our path must
	 * include this id at the very end, since the path itself must be unique. So we assign this
	 * prior to persisting so that when we persist everything is perfect.
	 * 
	 * WARNING: updating properties on 'node' in here has NO EFFECT. Always update dbObj only!
	 */
	@Override
	public void onBeforeSave(BeforeSaveEvent<SubNode> event) {
		SubNode node = event.getSource();
		node.setWriting(true);

		if (node.getOwner() == null) {
			// remove hard-coded path names from here (todo-0)
			if (!node.getPath().equals("/usr") && !node.getPath().equals("/usr/?")) {
				throw new RuntimeException("Attempted to create node with no owner: " + XString.prettyPrint(node));
			}
		}

		DBObject dbObj = event.getDBObject();
		ObjectId id = node.getId();
		dbObj.put(SubNode.FIELD_ID, id);

		if (id == null) {
			id = new ObjectId();
			dbObj.put(SubNode.FIELD_ID, id);
			node.setId(id);
			log.debug("New Node ID generated: " + id);
		}

		api.checkParentExists(node);

		/*
		 * New nodes can be given a path where they will allow the ID to play the role of the leaf
		 * 'name' part of the path
		 */
		if (node.getPath().endsWith("/?")) {
			String path = XString.removeLastChar(node.getPath()) + id;
			dbObj.put(SubNode.FIELD_PATH, path);
			node.setPath(path);
		}

		Date now = new Date();
		if (node.getCreateTime() == null) {
			dbObj.put(SubNode.FIELD_CREATE_TIME, now);
			node.setCreateTime(now);
		}

		dbObj.put(SubNode.FIELD_MODIFY_TIME, now);
		node.setModifyTime(now);
	}

	@Override
	public void onAfterSave(AfterSaveEvent<SubNode> event) {
		SubNode node = event.getSource();
		node.setWriting(false);
	}

	// @Override
	// public void onAfterDelete(AfterDeleteEvent<SubNode> event) {
	// SubNode node = event.getSource();
	// node.setWriting(false);
	// }
}
