package com.meta64.mobile.mail;

import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.event.TransportEvent;
import javax.mail.event.TransportListener;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.util.RuntimeEx;

/*
 * Implements and processes the sending of emails.
 */
@Component
public class MailSender implements TransportListener {

	private static final Logger log = LoggerFactory.getLogger(MailSender.class);

	@Autowired
	private AppProp appProp;

	public static final String MIME_HTML = "text/html";
	public int TIMEOUT = 10000; // ten seconds
	public int TIMESLICE = 250; // quarter second

	public boolean debug = true;
	public boolean success = false;
	public boolean waiting = false;

	private Properties props;
	private Session mailSession;
	private Transport transport;

	/*
	 * This method can and should be called before sending mails, close() method should be called
	 * after mail is sent
	 */
	public void init() {

		if (props == null) {
			log.debug("Initializing mail sender.");

			props = new Properties();
			props.put("mail.transport.protocol", "smtp");
			props.put("mail.host", appProp.getMailHost());

			/*
			 * how did I end up with 'put' instead of 'setProperty' here? Cut-n-paste from somewhere
			 */
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.port", appProp.getMailPort());

			props.put("mail.user", appProp.getMailUser());
			props.put("mail.password", appProp.getMailPassword());
		}

		/* close any existing mail transport */
		close();

		if (mailSession == null) {
			mailSession = Session.getDefaultInstance(props, null);
			mailSession.setDebug(debug);
		}

		try {
			transport = mailSession.getTransport("smtp");
			transport.addTransportListener(this);
			transport.connect(appProp.getMailHost(), appProp.getMailUser(), appProp.getMailPassword());
		}
		catch (Exception e) {
			throw new RuntimeEx(e);
		}
	}

	public void close() {
		if (transport != null) {
			success = false;
			waiting = false;

			try {
			transport.close();
			}
			catch (Exception e) {
				throw new RuntimeEx(e);
			}
			transport = null;
		}
	}

	public boolean isBusy() {
		return waiting;
	}

	public boolean sendMail(String sendToAddress, String content, String subjectLine) {

		if (transport == null) {
			throw new RuntimeEx("Tried to use MailSender after close() call or without initializing.");
		}

		if (waiting) {
			throw new RuntimeEx("concurrency must be done via 'isBusy' before each call");
		}

		log.debug("send mail to address [" + sendToAddress + "]");

		MimeMessage message = new MimeMessage(mailSession);
		try{
		message.setSentDate(new Date());
		message.setSubject(subjectLine);
		message.setFrom(new InternetAddress(appProp.getMailUser()));
		message.setRecipient(Message.RecipientType.TO, new InternetAddress(sendToAddress));
		}
		catch (Exception e) {
			throw new RuntimeEx(e);
		}
		// MULTIPART
		// ---------------
		// MimeMultipart multipart = new MimeMultipart("part");
		// BodyPart messageBodyPart = new MimeBodyPart();
		// messageBodyPart.setContent(content, "text/html");
		// multipart.addBodyPart(messageBodyPart);
		// message.setContent(multipart);

		// SIMPLE (no multipart)
		// ---------------
		try {
		message.setContent(content, MIME_HTML);
		}
		catch (Exception e) {
			throw new RuntimeEx(e);
		}
		
		// can get alreadyconnected exception here ??
		// transport.connect(mailHost, mailUser, mailPassword);

		success = false;

		/*
		 * important: while inside this 'sendMessage' method, the 'messageDelivered' callback will
		 * get called if the send is successful, so we can return the value below, even though we do
		 * not set it in this method
		 */
		int timeRemaining = TIMEOUT;
		waiting = true;
		try {
		transport.sendMessage(message, message.getRecipients(Message.RecipientType.TO));
		while (waiting && timeRemaining > 0) {
			Thread.sleep(TIMESLICE);
			timeRemaining -= TIMESLICE;
		}
		}
		catch (Exception e) {
			throw new RuntimeEx(e);
		}
		
		/* if we are still pending, that means a timeout so we give up */
		if (waiting) {
			waiting = false;
			log.debug("mail send failed.");
			throw new RuntimeEx("mail system is not responding.  Email send failed.");
		}

		return success;
	}

	@Override
	public void messageDelivered(TransportEvent arg) {
		success = true;
		waiting = false;
	}

	@Override
	public void messageNotDelivered(TransportEvent arg) {
		success = false;
		waiting = false;
	}

	@Override
	public void messagePartiallyDelivered(TransportEvent arg) {
		success = false;
		waiting = false;
	}
}
