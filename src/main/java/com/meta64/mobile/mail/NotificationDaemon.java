package com.meta64.mobile.mail;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;

/**
 * Deamon for sending emails periodically.
 * <p>
 * We need this daemon so that we can do email sending without blocking any of the requests that
 * require emails to be sent. That is, when some service method requires an email to be sent it
 * doesn't send the request or even spawn a thread to send the request. It simply queues up in
 * persistent storage he emails ready to be send and sends them out all in a single mail session all
 * at once. This is the most efficient way for lots of obvious reasons.
 * 
 */
@Component
public class NotificationDaemon {

	private static final Logger log = LoggerFactory.getLogger(NotificationDaemon.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private AppProp appProp;

	@Autowired
	private RunAsMongoAdmin adminRunner;

	@Autowired
	private JcrOutboxMgr outboxMgr;

	@Autowired
	private MailSender mailSender;

	private int runCounter = 0;

	/*
	 * Note: Spring does correctly protect against concurrent runs. It will always wait until the
	 * last run of this function is completed before running again. So we can always assume only one
	 * thread/deamon of this class is running at at time, because this is a singleton class.
	 * 
	 * see also: @EnableScheduling (in this project)
	 * 
	 * @Scheduled value is in milliseconds.
	 */
	@Scheduled(fixedDelay = 3 * 60 * 1000)
	public void run() {
		if (AppServer.isShuttingDown() || !AppServer.isEnableScheduling()) return;

		/*
		 * spring always calls immediately upon startup and we will ignore the first call
		 */
		if (runCounter++ == 0) {
			return;
		}

		/* fail fast if no mail host is configured. */
		if (StringUtils.isEmpty(appProp.getMailHost())) {
			if (runCounter < 3) {
				log.debug("NotificationDaemon is disabled, because no mail server is configured.");
			}
			return;
		}

		adminRunner.run((MongoSession session) -> {
			List<SubNode> mailNodes = outboxMgr.getMailNodes(session);
			if (mailNodes != null) {
				sendAllMail(session, mailNodes);
			}
		});
	}

	private void sendAllMail(MongoSession session, List<SubNode> nodes) {
		try {
			if (CollectionUtils.isEmpty(nodes)) return;
			mailSender.init();

			for (SubNode node : nodes) {
				String email = node.getStringProp(NodeProp.EMAIL_RECIP);
				String subject = node.getStringProp(NodeProp.EMAIL_SUBJECT);
				String content = node.getStringProp(NodeProp.EMAIL_CONTENT);

				log.debug("Found mail to send to: " + email);
				if (mailSender.sendMail(email, content, subject)) {
					api.delete(session, node);
				}
			}
		}
		finally {
			log.debug("Closing mail sender after mail cycle.");
			mailSender.close();
		}
	}
}
