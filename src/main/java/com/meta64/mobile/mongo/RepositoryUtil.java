package com.meta64.mobile.mongo;

import java.util.HashSet;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.XString;

/**
 * Utilities related to management of the JCR Repository
 *
 */
@Component
public class RepositoryUtil {
	private static final Logger log = LoggerFactory.getLogger(RepositoryUtil.class);

	@Autowired
	private MongoApi api;
	
	@Autowired
	private UserManagerService userManagerService;

	@Autowired
	private RunAsMongoAdmin mongoAdminRunner;

	@Autowired
	private AppProp appProp;

	@Autowired
	private SubNodeUtil jcrUtil;

	private HashSet<String> testAccountNames = new HashSet<String>();

	// jcr
	// private void initPageNodeFromClasspath(Session session, Node node, String classpath) {
	// try {
	// Resource resource = SpringContextUtil.getApplicationContext().getResource(classpath);
	// String content = XString.loadResourceIntoString(resource);
	// node.setProperty(JcrProp.CONTENT, content);
	// AccessControlUtil.makeNodePublic(session, node);
	// node.setProperty(JcrProp.DISABLE_INSERT, "y");
	// JcrUtil.save(session);
	// }
	// catch (Exception e) {
	// // IMPORTANT: don't rethrow from here, or this could blow up app
	// // initialization.
	// e.printStackTrace();
	// }
	// }

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

		mongoAdminRunner.run((MongoSession session) -> {
			for (String accountInfo : testUserAccountsList) {
				final List<String> accountInfoList = XString.tokenize(accountInfo, ":", true);
				if (accountInfoList == null || accountInfoList.size() != 3) {
					log.debug("Invalid User Info substring: " + accountInfo);
					continue;
				}

				String userName = accountInfoList.get(0);

				SubNode ownerNode = api.getUserNodeByUserName(session, userName);
				if (ownerNode == null) {

					SignupRequest signupReq = new SignupRequest();
					signupReq.setUserName(userName);
					signupReq.setPassword(accountInfoList.get(1));
					signupReq.setEmail(accountInfoList.get(2));

					SignupResponse res = new SignupResponse();
					userManagerService.signup(signupReq, res, true);
				}

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
