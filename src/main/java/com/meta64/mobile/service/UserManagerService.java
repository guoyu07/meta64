package com.meta64.mobile.service;

import java.util.Date;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.ConstantsProvider;
import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.mail.JcrOutboxMgr;
import com.meta64.mobile.model.RefInfo;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.AccessControlUtil;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.RunAsMongoAdmin;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.ChangePasswordRequest;
import com.meta64.mobile.request.CloseAccountRequest;
import com.meta64.mobile.request.LoginRequest;
import com.meta64.mobile.request.ResetPasswordRequest;
import com.meta64.mobile.request.SaveUserPreferencesRequest;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.ChangePasswordResponse;
import com.meta64.mobile.response.CloseAccountResponse;
import com.meta64.mobile.response.LoginResponse;
import com.meta64.mobile.response.ResetPasswordResponse;
import com.meta64.mobile.response.SaveUserPreferencesResponse;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.Encryptor;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.SubNodeUtil;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.Validator;
import com.meta64.mobile.util.XString;

/**
 * Service methods for processing user management functions. Login, logout, signup, user
 * preferences, and settings persisted per-user
 * 
 */
@Component
public class UserManagerService {
	private static final Logger log = LoggerFactory.getLogger(UserManagerService.class);

	private static final Random rand = new Random();

	@Autowired
	private MongoApi api;

	@Autowired
	private AppProp appProp;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private JcrOutboxMgr outboxMgr;

	@Autowired
	private RunAsMongoAdmin adminRunner;

	@Autowired
	private NodeSearchService nodeSearchService;

	@Autowired
	private ConstantsProvider constProvider;

	@Autowired
	private SubNodeUtil jcrUtil;

	@Autowired
	private AccessControlUtil acu;

	@Autowired
	private Encryptor encryptor;
	
	@Autowired
	private Validator validator;

	/*
	 * Login mechanism is a bit tricky because the OakSession ASPECT (AOP) actually detects the
	 * LoginRequest and performs authentication BEFORE this 'login' method even gets called, so by
	 * the time we are in this method we can safely assume the userName and password resulted in a
	 * successful login. If login fails the getJcrSession() call below will return null also.
	 */
	public void login(MongoSession session, LoginRequest req, LoginResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		String userName = req.getUserName();
		String password = req.getPassword();
		log.trace("login: user=" + userName);

		/*
		 * We have to get timezone information from the user's browser, so that all times on all
		 * nodes always show up in their precise local time!
		 */
		sessionContext.setTimezone(DateUtil.getTimezoneFromOffset(req.getTzOffset()));
		sessionContext.setTimeZoneAbbrev(DateUtil.getUSTimezone(-req.getTzOffset() / 60, req.isDst()));

		if (userName.equals("")) {
			userName = sessionContext.getUserName();
		}
		else {
			sessionContext.setUserName(userName);
			sessionContext.setPassword(password);
		}

		if (session == null) {
			log.trace("session==null, using anonymous user");
			/*
			 * Note: This is not an error condition, this happens whenever the page loads for the
			 * first time and the user has no session yet,
			 */
			res.setUserName(NodePrincipal.ANONYMOUS);
			res.setMessage("not logged in.");
			res.setSuccess(false);
		}
		else {
			SubNode userNode = api.getUserNodeByUserName(session, userName);
			if (userNode == null) {
				throw new RuntimeException("User not found: " + userName);
			}

			RefInfo rootRefInfo = new RefInfo(userNode.getId().toHexString(), userNode.getPath());
			sessionContext.setRootRefInfo(rootRefInfo);
			res.setRootNode(rootRefInfo);
			res.setUserName(userName);
			res.setAllowFileSystemSearch(appProp.isAllowFileSystemSearch());

			UserPreferences userPreferences = getUserPreferences();
			sessionContext.setUserPreferences(userPreferences);
			res.setUserPreferences(userPreferences);
			res.setSuccess(true);
		}

		res.setAnonUserLandingPageNode(appProp.getUserLandingPageNode());
		log.debug("Processing Login: urlId=" + (sessionContext.getUrlId() != null ? sessionContext.getUrlId() : "null"));
		res.setHomeNodeOverride(sessionContext.getUrlId());

		if (res.getUserPreferences() == null) {
			res.setUserPreferences(getDefaultUserPreferences());
		}
	}

	public void closeAccount(CloseAccountRequest req, CloseAccountResponse res) {
		log.debug("Closing Account: " + sessionContext.getUserName());
		adminRunner.run(session -> {
			String userName = sessionContext.getUserName();

			SubNode ownerNode = api.getUserNodeByUserName(session, userName);
			if (ownerNode != null) {
				api.delete(session, ownerNode);
			}
		});
	}

	/*
	 * Processes last step of signup, which is validation of registration code. This means user has
	 * clicked the link they were sent during the signup email verification, and they are sending in
	 * a signupCode that will turn on their account and actually create their account.
	 */
	public void processSignupCode(final String signupCode, final Model model) {
		log.debug("User is trying signupCode: " + signupCode);
		adminRunner.run(session -> {
			SubNode node = api.getNode(session, signupCode);

			if (node != null) {
				if (!node.getBooleanProp(NodeProp.SIGNUP_PENDING)) {
					throw ExUtil.newEx("Signup was already completed.");
				}

				String userName = node.getStringProp(NodeProp.USER);
				String password = node.getStringProp(NodeProp.PASSWORD);

				// &&& password encryption was disabled when removing JCR so that's now not working,
				// so this will fail right now.
				// password = encryptor.decrypt(password);

				String email = node.getStringProp(NodeProp.EMAIL);

				initNewUser(session, userName, password, email, false);

				/*
				 * allow JavaScript to detect all it needs to detect which is to display a message
				 * to user saying the signup is complete.
				 */
				model.addAttribute("signupCode", "ok");

				node.deleteProp(NodeProp.SIGNUP_PENDING);
				api.save(session, node);
			}
			else {
				throw ExUtil.newEx("Signup Code is invalid.");
			}
		});
	}

	public void initNewUser(MongoSession session, String userName, String password, String email, boolean automated) {
		SubNode userNode = api.createUser(session, userName, email, password, automated);
		if (userNode != null) {
			log.debug("Successful signup complete.");
		}
	}

	public List<String> getOwnerNames(SubNode node) {
		final ValContainer<List<String>> ret = new ValContainer<List<String>>();
		adminRunner.run(session -> {
			ret.setVal(acu.getOwnerNames(session, node));
		});
		return ret.getVal();
	}

	/*
	 * Processes a signup request from a user. We create the user root node in a pending state, and
	 * like all other user accounts all information specific to that user that we currently know is
	 * held in that node (i.e. preferences)
	 */
	public void signup(SignupRequest req, SignupResponse res, boolean automated) {
		MongoSession session = api.getAdminSession();

		final String userName = req.getUserName().trim();
		final String password = req.getPassword();
		final String email = req.getEmail();
		final String captcha = req.getCaptcha() == null ? "" : req.getCaptcha();

		log.trace("Signup: userName=" + userName + " email=" + email + " captcha=" + captcha);

		/* throw exceptions of the username or password are not valid */
		validator.checkUserName(userName);
		validator.checkPassword(password);
		validator.checkEmail(email);

		if (!automated) {
			/*
			 * test cases will simply pass null, for captcha, and we let that pass
			 */
			if (captcha != null && !captcha.equals(sessionContext.getCaptcha())) {
				log.debug("Captcha match!");
				throw ExUtil.newEx("Wrong captcha text.");
			}

			initiateSignup(session, userName, password, email);
		}
		else {
			initNewUser(session, userName, password, email, automated);
		}

		res.setMessage("success: " + String.valueOf(++sessionContext.counter));
		res.setSuccess(true);
	}

	/*
	 * Adds user to the JCR list of pending accounts and they will stay in pending status until
	 * their signupCode has been used to validate their email address.
	 */
	public void initiateSignup(MongoSession session, String userName, String password, String email) {
		
		SubNode ownerNode = api.getUserNodeByUserName(session, userName);
		if (ownerNode != null) {
			throw new RuntimeException("User already exists.");
		}
		
		SubNode newUserNode = api.createUser(session, userName, email, password, false);

		/*
		 * It's easiest to use the actua new UserNode ID as the 'signup code' to send to the user,
		 * because it's random and tied to this user by definition
		 */
		String signupCode = newUserNode.getId().toHexString();
		String signupLink = constProvider.getHostAndPort() + "?signupCode=" + signupCode;
		String content = null;

		/*
		 * We print this out so we can use it in DEV mode when no email support may be configured
		 */
		log.debug("Signup URL: " + signupLink);

		content = "Confirmation for new meta64 account: " + userName + //
				"<p>\nGo to this page to complete signup: <br>\n" + signupLink;

		if (!StringUtils.isEmpty(appProp.getMailHost())) {
			outboxMgr.queueEmail(email, "Meta64 Account Signup Confirmation", content);
		}
	}

	public void setDefaultUserPreferences(SubNode prefsNode) {
		prefsNode.setProp(NodeProp.USER_PREF_ADV_MODE, false);
		prefsNode.setProp(NodeProp.USER_PREF_EDIT_MODE, false);
	}

	public void saveUserPreferences(final SaveUserPreferencesRequest req, final SaveUserPreferencesResponse res) {
		final String userName = sessionContext.getUserName();

		adminRunner.run(session -> {
			SubNode prefsNode = api.getUserNodeByUserName(session, userName);

			UserPreferences reqUserPrefs = req.getUserPreferences();

			/*
			 * Assign preferences as properties on this node,
			 */
			boolean advancedMode = reqUserPrefs.isAdvancedMode();
			prefsNode.setProp(NodeProp.USER_PREF_ADV_MODE, advancedMode);

			boolean editMode = reqUserPrefs.isEditMode();
			prefsNode.setProp(NodeProp.USER_PREF_EDIT_MODE, editMode);

			boolean showMetaData = reqUserPrefs.isShowMetaData();
			prefsNode.setProp(NodeProp.USER_PREF_SHOW_METADATA, showMetaData);
			
			/*
			 * Also update session-scope object, because server-side functions that need preference
			 * information will get it from there instead of loading it from repository. The only
			 * time we load user preferences from repository is during login when we can't get it
			 * from anywhere else at that time.
			 */
			UserPreferences userPreferences = sessionContext.getUserPreferences();
			userPreferences.setAdvancedMode(advancedMode);
			userPreferences.setEditMode(editMode);
			userPreferences.setShowMetaData(showMetaData);

			res.setSuccess(true);
		});
	}

	public UserPreferences getDefaultUserPreferences() {
		return new UserPreferences();
	}

	public UserPreferences getUserPreferences() {
		final String userName = sessionContext.getUserName();
		final UserPreferences userPrefs = new UserPreferences();

		adminRunner.run(session -> {
			SubNode prefsNode = api.getUserNodeByUserName(session, userName);

			userPrefs.setAdvancedMode(prefsNode.getBooleanProp(NodeProp.USER_PREF_ADV_MODE));
			userPrefs.setEditMode(prefsNode.getBooleanProp(NodeProp.USER_PREF_EDIT_MODE));
			userPrefs.setShowMetaData(prefsNode.getBooleanProp(NodeProp.USER_PREF_SHOW_METADATA));
			userPrefs.setImportAllowed(prefsNode.getBooleanProp(NodeProp.USER_PREF_IMPORT_ALLOWED));
			userPrefs.setExportAllowed(prefsNode.getBooleanProp(NodeProp.USER_PREF_EXPORT_ALLOWED));
		});

		return userPrefs;
	}

	/*
	 * Runs when user is doing the 'change password' or 'reset password'
	 */
	public void changePassword(MongoSession session, final ChangePasswordRequest req, ChangePasswordResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}

		SubNode userNode = null;
		String passCode = req.getPassCode();
		if (passCode != null) {
			String userNodeId = XString.truncateAfterFirst(passCode, "-");
			userNode = api.getNode(session, userNodeId);
			
			if (userNode == null) {
				throw ExUtil.newEx("Invald password reset code.");
			}
			
			String codePart = XString.parseAfterLast(passCode, "-");

			String nodeCodePart = userNode.getStringProp(NodeProp.USER_PREF_PASSWORD_RESET_AUTHCODE);
			if (!codePart.equals(nodeCodePart)) {
				throw ExUtil.newEx("Invald password reset code.");
			}			
		}
		else {
			userNode = api.getUserNodeByUserName(session, session.getUser());
			
			if (userNode == null) {
				throw ExUtil.newEx("changePassword cannot find user.");
			}
		}

		String password = req.getNewPassword();
		String userName = userNode.getStringProp(NodeProp.USER);

		userNode.setProp(NodeProp.PASSWORD, password); // encryptor.encrypt(password));
		userNode.deleteProp(NodeProp.USER_PREF_PASSWORD_RESET_AUTHCODE);

		res.setUser(userName);
		api.save(session, userNode);

		sessionContext.setPassword(req.getNewPassword());
		res.setSuccess(true);
	}

	public boolean isNormalUserName(String userName) {
		userName = userName.trim();
		return !userName.equalsIgnoreCase(NodePrincipal.ADMIN) && !userName.equalsIgnoreCase(NodePrincipal.ANONYMOUS);
	}	
	
	public void resetPassword(final ResetPasswordRequest req, ResetPasswordResponse res) {
		adminRunner.run(session -> {

			String user = req.getUser();
			String email = req.getEmail();

			/* make sure username itself is acceptalbe */
			if (!isNormalUserName(user)) {
				res.setMessage("User name is illegal.");
				res.setSuccess(false);
				return;
			}

			SubNode ownerNode = api.getUserNodeByUserName(session, user);
			if (ownerNode == null) {
				res.setMessage("User does not exist.");
				res.setSuccess(false);
				return;
			}

			/*
			 * IMPORTANT!
			 *
			 * verify that the email address provides IS A MATCH to the email address for this user!
			 * Important step here because without this check anyone would be able to completely
			 * hijack anyone else's account simply by issuing a password change to that account!
			 */
			String nodeEmail = ownerNode.getStringProp(NodeProp.EMAIL);
			if (nodeEmail == null || !nodeEmail.equals(email)) {
				res.setMessage("Wrong user name and/or email.");
				res.setSuccess(false);
				return;
			}

			/*
			 * if we make it to here the user and email are both correct, and we can initiate the
			 * password reset. We pick some random time between 1 and 2 days from now into the
			 * future to serve as the unguessable auth code AND the expire time for it. Later we can
			 * create a deamon processor that cleans up expired authCodes, but for now we just need
			 * to HAVE the auth code.
			 *
			 * User will be emailed this code and we will perform reset when we see it, and the user
			 * has entered new password we can use.
			 */
			int oneDayMillis = 60 * 60 * 1000;
			long authCode = new Date().getTime() + oneDayMillis + rand.nextInt(oneDayMillis);

			ownerNode.setProp(NodeProp.USER_PREF_PASSWORD_RESET_AUTHCODE, String.valueOf(authCode));
			api.save(session, ownerNode);

			String passCode = ownerNode.getId().toHexString() + "-" + String.valueOf(authCode);

			String link = constProvider.getHostAndPort() + "?passCode=" + passCode;
			String content = "Password reset was requested on SubNode account: " + user + //
			"<p>\nGo to this link to reset your password: <br>\n" + link;

			outboxMgr.queueEmail(email, "SubNode Password Reset", content);

			res.setMessage("A password reset link has been sent to your email. Check your inbox in a minute or so.");
			res.setSuccess(true);
		});
	}
}
