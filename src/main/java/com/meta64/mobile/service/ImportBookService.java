package com.meta64.mobile.service;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.request.InsertBookRequest;
import com.meta64.mobile.response.InsertBookResponse;
import com.meta64.mobile.util.ImportWarAndPeace;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;

@Component
@Scope("singleton")
public class ImportBookService {
	private static final Logger log = LoggerFactory.getLogger(ImportBookService.class);

	@Autowired
	private SessionContext sessionContext;

	public void insertBook(Session session, InsertBookRequest req, InsertBookResponse res) throws Exception {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		if (!sessionContext.isAdmin()) {
			throw new Exception("insertBook is an admin-only feature.");
		}

		String nodeId = req.getNodeId();
		Node node = JcrUtil.findNode(session, nodeId);
		JcrUtil.checkNodeCreatedBy(node, session.getUserID());

		/*
		 * for now we don't check book name. Only one book exists: War and Peace
		 */
		// String name = req.getBookName();

		ImportWarAndPeace iwap = SpringContextUtil.getApplicationContext().getBean(ImportWarAndPeace.class);
		iwap.importBook(session, "classpath:war-and-peace.txt", node);

		session.save();
		res.setSuccess(true);
	}
}
