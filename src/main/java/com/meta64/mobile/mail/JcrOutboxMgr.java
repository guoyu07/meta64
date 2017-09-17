package com.meta64.mobile.mail;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.ConstantsProvider;
import com.meta64.mobile.config.NodeName;
import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.mongo.model.SubNodeTypes;
import com.meta64.mobile.user.RunAsMongoAdmin;
import com.meta64.mobile.util.SubNodeUtil;

/**
 * Manages the node where we store all emails that are queued up to be sent.
 * <p>
 * The system always sends emails out in a batch operation every 30seconds or so, by emptying out
 * this queue.
 * 
 */
@Component
public class JcrOutboxMgr {

	private static final Logger log = LoggerFactory.getLogger(JcrOutboxMgr.class);

	@Autowired
	MongoApi api;

	@Autowired
	private RunAsMongoAdmin adminRunner;

	@Autowired
	private ConstantsProvider constProvider;

	private String mailBatchSize = "10";

	@Autowired
	private SubNodeUtil jcrUtil;

	/*
	 * node=Node that was created. userName = username of person who just created node.
	 */
	public void sendNotificationForChildNodeCreate(final SubNode node, final String userName) {
		/*
		 * put in a catch block, because nothing going wrong in here should be allowed to blow up
		 * the save operation
		 */
		adminRunner.run(session -> {
			try {
				SubNode parentNode = api.getParent(session, node);

				/*
				 * Check first that we are not creating a node under one WE OWN, becasue we don't
				 * need to send a notification to ourselves.
				 */
				if (parentNode != null && !parentNode.getOwner().equals(node.getOwner())) {
					SubNode userNode = api.getNode(session, parentNode.getOwner());
					String email = userNode.getStringProp(NodeProp.EMAIL);
					log.debug("sending email to: " + email + " because his node was appended under.");

					String content = String.format("User '%s' has created a new subnode under one of your nodes.<p>\n\n" + //
					"%s?id=%s", userName, constProvider.getHostAndPort(), node.getId().toHexString());

					queueMailUsingAdminSession(session, email, "New SubNode Notification", content);
				}
			}
			catch (Exception e) {
				log.debug("failed sending notification", e);
			}
		});
	}

	public void queueEmail(final String recipients, final String subject, final String content) {
		adminRunner.run(session -> {
			queueMailUsingAdminSession(session, recipients, subject, content);
		});
	}

	public void queueMailUsingAdminSession(MongoSession session, final String recipients, final String subject, final String content) {
		SubNode outboxNode = getSystemOutbox(session);
		SubNode outboundEmailNode = api.createNode(session, outboxNode.getPath() + "/?", SubNodeTypes.UNSTRUCTURED);

		outboundEmailNode.setProp(NodeProp.EMAIL_CONTENT, content);
		outboundEmailNode.setProp(NodeProp.EMAIL_SUBJECT, subject);
		outboundEmailNode.setProp(NodeProp.EMAIL_RECIP, recipients);

		api.save(session, outboundEmailNode);
	}

	/*
	 * Loads only up to mailBatchSize emails at a time
	 */
	public List<SubNode> getMailNodes(MongoSession session) {
		SubNode outboxNode = getSystemOutbox(session);

		int mailBatchSizeInt = Integer.parseInt(mailBatchSize);
		return api.getChildrenAsList(session, outboxNode, false, mailBatchSizeInt);
	}

	/*
	 * Get node that contains all preferences for this user, as properties on it.
	 */
	public SubNode getSystemOutbox(MongoSession session) {
		return jcrUtil.ensureNodeExists(session, "/" + NodeName.ROOT + "/" + NodeName.OUTBOX + "/", NodeName.SYSTEM, "System Messages");
	}
}
