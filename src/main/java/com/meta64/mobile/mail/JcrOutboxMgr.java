package com.meta64.mobile.mail;

import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.ConstantsProvider;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;

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
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private ConstantsProvider constProvider;

	private String mailBatchSize = "10";

	/*
	 * node=Node that was created. userName = username of person who just created node.
	 */
	public void sendNotificationForChildNodeCreate(final Node node, final String userName, final String parentProp) {
		/*
		 * put in a catch block, because nothing going wrong in here should be allowed to blow up
		 * the save operation
		 */
		adminRunner.run(session -> {
			try {
				Node parentNode = node.getParent();
				if (parentNode != null) {
					String parentCreator = JcrUtil.getRequiredStringProp(parentNode, parentProp);
					if (!parentCreator.equals(userName)) {
						Node prefsNode = UserManagerService.getPrefsNodeForSessionUser(session, parentCreator);
						String email = JcrUtil.getRequiredStringProp(prefsNode, JcrProp.EMAIL);
						log.debug("sending email to: " + email + " because his node was appended under.");

						String content = String.format("User '%s' has created a new subnode under one of your nodes.<br>\n\n" + //
						"Here is a link to the new node: %s?id=%s", //
								userName, constProvider.getHostAndPort(), node.getPath());

						queueMailUsingAdminSession(session, email, "Meta64 New Content Notification", content);
					}
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

	public void queueMailUsingAdminSession(Session session, final String recipients, final String subject, final String content) {
		Node outboxNode = getSystemOutbox(session);

		String name = JcrUtil.getGUID();
		try {
			Node newNode = outboxNode.addNode(name, JcrConstants.NT_UNSTRUCTURED);
			newNode.setProperty(JcrProp.EMAIL_CONTENT, content);
			newNode.setProperty(JcrProp.EMAIL_SUBJECT, subject);
			newNode.setProperty(JcrProp.EMAIL_RECIP, recipients);
			JcrUtil.timestampNewNode(session, newNode);
			JcrUtil.save(session);
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	/*
	 * Loads only up to mailBatchSize emails at a time
	 */
	public List<Node> getMailNodes(Session session) {
		List<Node> mailNodes = null;

		Node outboxNode = getSystemOutbox(session);

		try {
			NodeIterator nodeIter = JcrUtil.getNodes(outboxNode);

			try {
				int nodeCount = 0;
				int mailBatchSizeInt = Integer.parseInt(mailBatchSize);
				while (nodeCount++ < mailBatchSizeInt) {
					Node n = nodeIter.nextNode();

					if (mailNodes == null) {
						mailNodes = new LinkedList<Node>();
					}
					mailNodes.add(n);
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
			}
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
		return mailNodes;
	}

	/*
	 * Get node that contains all preferences for this user, as properties on it.
	 */
	public static Node getSystemOutbox(Session session) {
		return JcrUtil.ensureNodeExists(session, "/" + JcrName.OUTBOX + "/", JcrName.SYSTEM, "System Messages");
	}
}
