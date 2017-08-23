package com.meta64.mobile.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.InsertBookRequest;
import com.meta64.mobile.response.InsertBookResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.ImportWarAndPeace;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.VarUtil;
import com.meta64.mobile.util.XString;

/**
 * Special-purpose code for importing the book War and Peace which ships with SubNode, and is used
 * for demonstration purposes to show how browsing, searching, etc. works, and for testing with a
 * reasonable sized chunk of data (i.e. the entire book)
 */
@Component
public class ImportBookService {
	private static final Logger log = LoggerFactory.getLogger(ImportBookService.class);

	@Autowired
	private MongoApi api;
	
	@Autowired
	private SessionContext sessionContext;

	public void insertBook(MongoSession session, InsertBookRequest req, InsertBookResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		if (!sessionContext.isAdmin() && !sessionContext.isTestAccount()) {
			throw ExUtil.newEx("insertBook is an admin-only feature.");
		}

		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		log.debug("Insert Root: "+XString.prettyPrint(node));

		/*
		 * for now we don't check book name. Only one book exists: War and Peace
		 */
		// String name = req.getBookName();

		ImportWarAndPeace iwap = SpringContextUtil.getApplicationContext().getBean(ImportWarAndPeace.class);
		iwap.importBook(session, "classpath:war-and-peace.txt", node, VarUtil.safeBooleanVal(req.getTruncated()) ? 2 : Integer.MAX_VALUE);

		api.saveSession(session);
		res.setSuccess(true);
	}
}
