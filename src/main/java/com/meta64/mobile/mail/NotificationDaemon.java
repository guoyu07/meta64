package com.meta64.mobile.mail;

import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.JcrUtil;

/**
 * This is a 'dedicated thread' for sending emails periodically. We need this daemon so that we can
 * do email sending without blocking any of the requests that require emails to be sent. That is,
 * when some service method requires an email to be sent it doesn't send the request or even spawn a
 * thread to send the request. It simply queues up in persistent storage he emails ready to be send
 * and sends them out all in a single mail session all at once. This is the most efficient way for
 * lots of obvious reasons.
 * 
 */
@Component
@Scope("singleton")
public class NotificationDaemon {

	private static final Logger log = LoggerFactory.getLogger(NotificationDaemon.class);

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private JcrOutboxMgr outboxMgr;

	@Autowired
	private MailSender mailSender;

	@Value("${mail.host}")
	public String mailHost;

	private int runCounter = 0;

	/*
	 * Runs every 10 seconds. Note: Spring does correctly protect against concurrent runs. It will
	 * always wait until the last run of this function is completed before running again. So we can
	 * always assume only one thread/deamon of this class is running at at time, because this is a
	 * singleton class.
	 * 
	 * see also: @EnableScheduling (in this project)
	 */
	@Scheduled(fixedDelay = 60 * 1000)
	public void run() {
		if (AppServer.isShuttingDown() || !AppServer.isEnableScheduling()) return;

		/*
		 * spring always calls immediately upon startup and we will ignore the first call
		 */
		if (runCounter++ == 0) {
			return;
		}

		/* fail fast if no mail host is configured. */
		if (StringUtils.isEmpty(mailHost)) {
			if (runCounter < 3) {
				log.debug("NotificationDaemon is disabled, because no mail server is configured.");
			}
			return;
		}

		try {
			adminRunner.run((Session session) -> {
				List<Node> mailNodes = outboxMgr.getMailNodes(session);
				if (mailNodes != null) {
					sendAllMail(session, mailNodes);
				}
			});
		}
		catch (Exception e) {
			log.debug("Failed processing mail.", e);
		}
	}

	private void sendAllMail(Session session, List<Node> nodes) throws Exception {

		boolean sessionDirty = false;

		try {
			mailSender.init();

			for (Node node : nodes) {

				String email = JcrUtil.getRequiredStringProp(node, JcrProp.EMAIL_RECIP);
				String subject = JcrUtil.getRequiredStringProp(node, JcrProp.EMAIL_SUBJECT);
				String content = JcrUtil.getRequiredStringProp(node, JcrProp.EMAIL_CONTENT);

				if (mailSender.sendMail(email, content, subject)) {
					node.remove();
					sessionDirty = true;
				}
			}
		}
		finally {
			try {
				if (sessionDirty) {
					session.save();
				}
			}
			catch (Exception e) {
				log.debug("Failed persisting mail node changes.", e);
				/*
				 * DO NOT rethrow. Don't want to blow up the daemon thread
				 */
			}

			try {
				log.debug("Closing mail sender after sending some mail(s).");
				mailSender.close();
			}
			catch (Exception e) {
				log.debug("Failed closing mail sender object.", e);
				/*
				 * DO NOT rethrow. Don't want to blow up the daemon thread
				 */
			}
		}
	}
}
