package com.meta64.mobile.repo;

import java.util.HashSet;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.user.AccessControlUtil;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.XString;

@Component
public class RepositoryUtil {
	private static final Logger log = LoggerFactory.getLogger(RepositoryUtil.class);

	@Autowired
	private UserManagerService userManagerService;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private AppProp appProp;

	private HashSet<String> testAccountNames = new HashSet<String>();

	public void initRequiredNodes() {
		adminRunner.run(session -> {

			/*
			 * todo-1: need to make all these markdown files able to be specified in a properties
			 * file, and also need to make the DB aware of time stamp so it can just check timestamp
			 * of file to determine if it needs to be loaded into DB or is already up to date
			 */
			Node landingPageNode = JcrUtil.ensureNodeExists(session, "/", appProp.getUserLandingPageNode(), "Landing Page");
			initPageNodeFromClasspath(session, landingPageNode, "classpath:/public/doc/landing-page.md");

			JcrUtil.ensureNodeExists(session, "/", JcrName.ROOT, "Root of All Users");
			JcrUtil.ensureNodeExists(session, "/", JcrName.USER_PREFERENCES, "Preferences of All Users");
			JcrUtil.ensureNodeExists(session, "/", JcrName.OUTBOX, "System Email Outbox");
			JcrUtil.ensureNodeExists(session, "/", JcrName.SIGNUP, "Pending Signups");
		});
	}

	private void initPageNodeFromClasspath(Session session, Node node, String classpath) {
		try {
			Resource resource = SpringContextUtil.getApplicationContext().getResource(classpath);
			String content = XString.loadResourceIntoString(resource);
			node.setProperty(JcrProp.CONTENT, content);
			AccessControlUtil.makeNodePublic(session, node);
			node.setProperty(JcrProp.DISABLE_INSERT, "y");
			JcrUtil.save(session);
		}
		catch (Exception e) {
			// IMPORTANT: don't rethrow from here, or this could blow up app
			// initialization.
			e.printStackTrace();
		}
	}

	/*
	 * We create these users just so there's an easy way to start doing multi-user testing (sharing
	 * nodes from user to user, etc) without first having to manually register users.
	 */
	public void createTestAccounts() {
		/*
		 * The testUserAccounts is a comma delimited list of user accounts where each user account
		 * is a colon-delimited list like username:password:email.
		 * 
		 * todo-1: could change the format of this info to JSON.
		 */
		final List<String> testUserAccountsList = XString.tokenize(appProp.getTestUserAccounts(), ",", true);
		if (testUserAccountsList == null) {
			return;
		}

		adminRunner.run((Session session) -> {
			for (String accountInfo : testUserAccountsList) {
				final List<String> accountInfoList = XString.tokenize(accountInfo, ":", true);
				if (accountInfoList == null || accountInfoList.size() != 3) {
					log.debug("Invalid User Info substring: " + accountInfo);
					continue;
				}

				String userName = accountInfoList.get(0);

				SignupRequest signupReq = new SignupRequest();
				signupReq.setUserName(userName);
				signupReq.setPassword(accountInfoList.get(1));
				signupReq.setEmail(accountInfoList.get(2));

				SignupResponse res = new SignupResponse();
				userManagerService.signup(session, signupReq, res, true);

				/*
				 * keep track of these names, because some API methods need to know if a given
				 * account is a test account
				 */
				testAccountNames.add(userName);
			}
		});
	}

	public boolean isTestAccountName(String userName) {
		return testAccountNames.contains(userName);
	}
}
