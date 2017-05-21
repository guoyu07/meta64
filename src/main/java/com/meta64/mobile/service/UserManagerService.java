package com.meta64.mobile.service;

import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.oak.spi.security.principal.EveryonePrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.ConstantsProvider;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.mail.JcrOutboxMgr;
import com.meta64.mobile.model.RefInfo;
import com.meta64.mobile.model.UserPreferences;
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
import com.meta64.mobile.user.AccessControlUtil;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.user.UserManagerUtil;
import com.meta64.mobile.util.DateUtil;
import com.meta64.mobile.util.Encryptor;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.ValContainer;
import com.meta64.mobile.util.Validator;

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
	private AppProp appProp;

	@Autowired
	private UserManagerUtil userManagerUtil;

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private JcrOutboxMgr outboxMgr;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private NodeSearchService nodeSearchService;

	@Autowired
	private ConstantsProvider constProvider;

	@Autowired
	private Encryptor encryptor;

	/*
	 * Login mechanism is a bit tricky because the OakSession ASPECT (AOP) actually detects the
	 * LoginRequest and performs authentication BEFORE this 'login' method even gets called, so by
	 * the time we are in this method we can safely assume the userName and password resulted in a
	 * successful login. If login fails the getJcrSession() call below will return null also.
	 */
	public void login(Session session, LoginRequest req, LoginResponse res) {

		if (session == null) {
			session = ThreadLocals.getJcrSession();
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
			log.trace("    session==null, using anonymous user");
			/*
			 * Note: This is not an error condition, this happens whenever the page loads for the
			 * first time and the user has no session yet,
			 */
			res.setUserName(JcrPrincipal.ANONYMOUS);
			res.setMessage("not logged in.");
			res.setSuccess(false);
		}
		else {
			RefInfo rootRefInfo = UserManagerUtil.getRootNodeRefInfoForUser(session, userName);
			sessionContext.setRootRefInfo(rootRefInfo);
			res.setRootNode(rootRefInfo);
			res.setUserName(userName);
			res.setAllowFileSystemSearch(appProp.isAllowFileSystemSearch());

			try {
				UserPreferences userPreferences = getUserPreferences();
				sessionContext.setUserPreferences(userPreferences);
				res.setUserPreferences(userPreferences);
			}
			catch (Exception e) {
				/*
				 * If something goes wrong loading preferences just log and continue. Should never
				 * happen but we might as well be resilient here.
				 */
				// log.error("Failed loading preferences: ", e);
			}
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
			try {
				String userName = sessionContext.getUserName();

				/* Remove user from JCR user manager */
				UserManagerUtil.removeUser(session, userName);

				/*
				 * And remove the two nodes on the tree that we have for this user (root and
				 * preferences)
				 */
				Node allUsersRoot = JcrUtil.getNodeByPath(session, "/" + JcrName.ROOT + "/" + userName);
				if (allUsersRoot != null) {
					allUsersRoot.remove();
				}

				Node prefsNode = getPrefsNodeForSessionUser(session, userName);
				if (prefsNode != null) {
					prefsNode.remove();
				}
				JcrUtil.save(session);
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
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
			try {
				Node node = nodeSearchService.findNodeByProperty(session, "/" + JcrName.SIGNUP, //
						JcrProp.CODE, signupCode);

				if (node != null) {
					String userName = JcrUtil.getRequiredStringProp(node, JcrProp.USER);
					String password = JcrUtil.getRequiredStringProp(node, JcrProp.PWD);
					password = encryptor.decrypt(password);
					String email = JcrUtil.getRequiredStringProp(node, JcrProp.EMAIL);

					initNewUser(session, userName, password, email, false);

					/*
					 * allow JavaScript to detect all it needs to detect which is to display a
					 * message to user saying the signup is complete.
					 */
					model.addAttribute("signupCode", "ok");
					node.remove();
					JcrUtil.save(session);
				}
				else {
					throw new RuntimeEx("Signup Code is invalid.");
				}
			}
			catch (Exception e) {
				// need to message back to user signup failed.
			}
		});
	}

	public void initNewUser(Session session, String userName, String password, String email, boolean automated) {
		try {
			if (UserManagerUtil.createUser(session, userName, password, automated)) {
				UserManagerUtil.createUserRootNode(session, userName);

				Node prefsNode = getPrefsNodeForSessionUser(session, userName);
				if (email != null) {
					prefsNode.setProperty(JcrProp.EMAIL, email);
				}

				prefsNode.setProperty(JcrProp.PWD, encryptor.encrypt(password));

				setDefaultUserPreferences(prefsNode);
				JcrUtil.save(session);
				log.debug("Successful signup complete.");
			}
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	public List<String> getOwnerNames(final Node node) {
		final ValContainer<List<String>> ret = new ValContainer<List<String>>();
		adminRunner.run(session -> {
			ret.setVal(AccessControlUtil.getOwnerNames(session, node));
		});
		return ret.getVal();
	}

	public boolean userExists(Session session, String userName, ValContainer<String> passwordContainer) {
		Node prefsNode = JcrUtil.getNodeByPath(session, "/" + JcrName.USER_PREFERENCES + "/" + userName);
		if (prefsNode != null) {
			if (passwordContainer != null) {
				String password = JcrUtil.safeGetStringProp(prefsNode, JcrProp.PWD);
				password = encryptor.decrypt(password);
				passwordContainer.setVal(password);
			}
			return true;
		}
		return false;
	}

	/*
	 * Processes a signup request from a user. The user doesn't immediately get an account, but an
	 * email goes out to them that when they click on the link in the email the signupCode comes
	 * back and actually creates their account at that time.
	 */
	public void signup(Session session, SignupRequest req, SignupResponse res, boolean automated) {

		final String userName = req.getUserName();
		if (userName.equalsIgnoreCase(JcrPrincipal.ADMIN) || userName.equalsIgnoreCase("administrator")) {
			throw new RuntimeEx("Sorry, you can't be the new admin.");
		}

		if (userName.equalsIgnoreCase(EveryonePrincipal.NAME)) {
			throw new RuntimeEx("Sorry, you can't be everyone.");
		}

		final String password = req.getPassword();
		final String email = req.getEmail();
		final String captcha = req.getCaptcha() == null ? "" : req.getCaptcha();

		log.trace("Signup: userName=" + userName + " email=" + email + " captcha=" + captcha);

		/* throw exceptions of the username or password are not valid */
		Validator.checkUserName(userName);
		Validator.checkPassword(password);
		Validator.checkEmail(email);

		if (!automated) {
			/*
			 * test cases will simply pass null, for captcha, and we let that pass
			 */
			if (captcha != null && !captcha.equals(sessionContext.getCaptcha())) {
				log.debug("Captcha match!");
				throw new RuntimeEx("Wrong captcha text.");
			}

			initiateSignup(userName, password, email);
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
	public void initiateSignup(String userName, String password, String email) {

		String signupCode = JcrUtil.getGUID();
		String signupLink = constProvider.getHostAndPort() + "?signupCode=" + signupCode;
		String content = null;

		/*
		 * We print this out so we can use it in DEV mode when no email support may be configured
		 */
		log.debug("Signup URL: " + signupLink);

		content = "Confirmation for new meta64 account: " + userName + //
				"<p>\nGo to this page to complete signup: <br>\n" + signupLink;

		addPendingSignupNode(userName, password, email, signupCode);

		if (!StringUtils.isEmpty(appProp.getMailHost())) {
			outboxMgr.queueEmail(email, "Meta64 Account Signup Confirmation", content);
		}
	}

	/*
	 * Creates the node on the tree that holds the user info pending email validation.
	 */
	public void addPendingSignupNode(final String userName, final String password, final String email, final String signupCode) {

		adminRunner.run(session -> {
			try {
				try {
					session.getNode("/" + JcrName.SIGNUP + "/" + userName);
					throw new RuntimeEx("User name is already pending signup.");
				}
				catch (Exception e) {
					// normal flow. Not an error here.
				}

				Node signupNode = session.getNode("/" + JcrName.SIGNUP);
				if (signupNode == null) {
					throw new RuntimeEx("Signup node not found.");
				}

				Node newNode = signupNode.addNode(userName, JcrConstants.NT_UNSTRUCTURED);
				newNode.setProperty(JcrProp.USER, userName);
				newNode.setProperty(JcrProp.PWD, encryptor.encrypt(password));
				newNode.setProperty(JcrProp.EMAIL, email);
				newNode.setProperty(JcrProp.CODE, signupCode);
				JcrUtil.timestampNewNode(session, newNode);
				JcrUtil.save(session);
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
			}
		});
	}

	/*
	 * Get node that contains all preferences for this user, as properties on it.
	 */
	public static Node getPrefsNodeForSessionUser(Session session, String userName) {
		return JcrUtil.ensureNodeExists(session, "/" + JcrName.USER_PREFERENCES + "/", userName, userName);
	}

	public void setDefaultUserPreferences(Node prefsNode) {
		try {
			prefsNode.setProperty(JcrProp.USER_PREF_ADV_MODE, false);
			prefsNode.setProperty(JcrProp.USER_PREF_EDIT_MODE, false);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	public void saveUserPreferences(final SaveUserPreferencesRequest req, final SaveUserPreferencesResponse res) {

		final String userName = sessionContext.getUserName();

		adminRunner.run(session -> {
			try {
				Node prefsNode = getPrefsNodeForSessionUser(session, userName);

				UserPreferences reqUserPrefs = req.getUserPreferences();

				/*
				 * Assign preferences as properties on this node,
				 */
				boolean advancedMode = reqUserPrefs.isAdvancedMode();
				prefsNode.setProperty(JcrProp.USER_PREF_ADV_MODE, advancedMode);

				boolean editMode = reqUserPrefs.isEditMode();
				prefsNode.setProperty(JcrProp.USER_PREF_EDIT_MODE, editMode);

				boolean showMetaData = reqUserPrefs.isShowMetaData();
				prefsNode.setProperty(JcrProp.USER_PREF_SHOW_METADATA, showMetaData);

				JcrUtil.save(session);

				/*
				 * Also update session-scope object, because server-side functions that need
				 * preference information will get it from there instead of loading it from
				 * repository. The only time we load user preferences from repository is during
				 * login when we can't get it form anywhere else at that time.
				 */
				UserPreferences userPreferences = sessionContext.getUserPreferences();
				userPreferences.setAdvancedMode(advancedMode);
				userPreferences.setEditMode(editMode);
				userPreferences.setShowMetaData(showMetaData);

				res.setSuccess(true);
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
			}
		});
	}

	public UserPreferences getDefaultUserPreferences() {
		return new UserPreferences();
	}

	public UserPreferences getUserPreferences() {
		final String userName = sessionContext.getUserName();
		final UserPreferences userPrefs = new UserPreferences();

		adminRunner.run(session -> {
			Node prefsNode = getPrefsNodeForSessionUser(session, userName);

			/* for polymer conversion, forcing to true here */
			userPrefs.setAdvancedMode(JcrUtil.safeGetBooleanProp(prefsNode, JcrProp.USER_PREF_ADV_MODE));
			userPrefs.setEditMode(JcrUtil.safeGetBooleanProp(prefsNode, JcrProp.USER_PREF_EDIT_MODE));
			userPrefs.setShowMetaData(JcrUtil.safeGetBooleanProp(prefsNode, JcrProp.USER_PREF_SHOW_METADATA));

			userPrefs.setLastNode(JcrUtil.safeGetStringProp(prefsNode, JcrProp.USER_PREF_LAST_NODE));
			userPrefs.setImportAllowed(JcrUtil.safeGetBooleanProp(prefsNode, JcrProp.USER_PREF_IMPORT_ALLOWED));
			userPrefs.setExportAllowed(JcrUtil.safeGetBooleanProp(prefsNode, JcrProp.USER_PREF_EXPORT_ALLOWED));

			// String password = JcrUtil.safeGetStringProp(prefsNode,
			// JcrProp.PWD);
			// log.debug("password: "+encryptor.decrypt(password));
		});

		return userPrefs;
	}

	/*
	 * Each user has a node on the tree that holds all their user preferences. This method retrieves
	 * that node for the user logged into the current HTTP Session (Session Scope Bean)
	 */
	public Node getUserPrefsNode(Session session) {
		try {
			String userName = sessionContext.getUserName();
			Node allUsersRoot = JcrUtil.getNodeByPath(session, "/" + JcrName.ROOT);
			if (allUsersRoot == null) {
				throw new RuntimeEx("/root not found!");
			}

			log.debug("Creating root node, which didn't exist.");

			Node newNode = allUsersRoot.addNode(userName, JcrConstants.NT_UNSTRUCTURED);
			JcrUtil.timestampNewNode(session, newNode);
			if (newNode == null) {
				throw new RuntimeEx("unable to create root");
			}

			if (AccessControlUtil.grantFullAccess(session, newNode, userName)) {
				newNode.setProperty(JcrProp.CONTENT, "Root for User: " + userName);
				JcrUtil.save(session);
			}

			return allUsersRoot;
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	/*
	 * Runs when user is doing the 'change password' or 'reset password'
	 */
	public void changePassword(final ChangePasswordRequest req, ChangePasswordResponse res) {

		adminRunner.run(session -> {
			try {
				String userForPassCode = null;
				String passCode = req.getPassCode();
				if (passCode != null) {
					userForPassCode = getUserFromPassCode(session, passCode);
					if (userForPassCode == null) {
						throw new RuntimeEx("Invalid password reset code.");
					}
				}
				/*
				 * Warning: Always get userName from sessionContext, and not from anything coming
				 * from the browser, or else this would be a wide open security hole. We should
				 * probably be even safer here and require the EXISTING password to be retyped again
				 * by the user, even though we think they are logged in right now.
				 */
				final String userName = userForPassCode != null ? userForPassCode : sessionContext.getUserName();

				String password = req.getNewPassword();
				userManagerUtil.changePassword(session, userName, password);

				Node prefsNode = getPrefsNodeForSessionUser(session, userName);
				prefsNode.setProperty(JcrProp.PWD, encryptor.encrypt(password));

				if (passCode != null) {
					JcrUtil.safeDeleteProperty(prefsNode, JcrProp.USER_PREF_PASSWORD_RESET_AUTHCODE);
				}

				res.setUser(userName);
				JcrUtil.save(session);
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
			}
		});

		sessionContext.setPassword(req.getNewPassword());
		res.setSuccess(true);
	}

	public String getUserFromPassCode(Session session, final String passCode) {
		String userName = null;

		try {
			long passCodeTime = Long.valueOf(passCode);
			if (new Date().getTime() > passCodeTime) {
				throw new RuntimeEx("Password Reset auth code has expired.");
			}

			/* search for the node with passCode property */
			Node node = nodeSearchService.findNodeByProperty(session, "/" + JcrName.USER_PREFERENCES, //
					JcrProp.USER_PREF_PASSWORD_RESET_AUTHCODE, passCode);
			
			if (node != null) {
				/*
				 * it's a bit ugly that the JCR content is the property that holds the user, but
				 * originally this node was not one where I realized I would be looking up names
				 * from. But it works. Just not quite that intuitive to have name in content
				 * property.
				 */
				userName = JcrUtil.getRequiredStringProp(node, JcrProp.CONTENT);
			}
			else {
				throw new RuntimeEx("Signup Code is invalid.");
			}
		}
		catch (Exception e) {
			// need to message back to user signup failed.
		}

		return userName;
	}

	/*
	 * Runs when user is doing the 'reset password'.
	 */
	public void resetPassword(final ResetPasswordRequest req, ResetPasswordResponse res) {

		adminRunner.run(session -> {
			try {
				String user = req.getUser();
				String email = req.getEmail();

				/* make sure username itself is acceptalbe */
				if (!UserManagerUtil.isNormalUserName(user)) {
					res.setMessage("User name is illegal.");
					res.setSuccess(false);
					return;
				}

				/* make sure the user name does exist */
				Authorizable auth = UserManagerUtil.getUser(session, user);
				if (auth == null) {
					res.setMessage("User does not exist.");
					res.setSuccess(false);
					return;
				}

				/* lookup preferences node for this user */
				Node userPrefsNode = JcrUtil.safeFindNode(session, "/" + JcrName.USER_PREFERENCES + "/" + user);
				if (userPrefsNode == null) {
					res.setMessage("User info is missing.");
					res.setSuccess(false);
					return;
				}

				/*
				 * IMPORTANT!
				 * 
				 * verify that the email address provides IS A MATCH to the email address for this
				 * user! Important step here because without this check anyone would be able to
				 * completely hijack anyone else's account simply by issuing a password change to
				 * that account!
				 */
				String nodeEmail = userPrefsNode.getProperty("email").getString();
				if (nodeEmail == null || !nodeEmail.equals(email)) {
					res.setMessage("Wrong user name and/or email.");
					res.setSuccess(false);
					return;
				}

				/*
				 * if we make it to here the user and email are both correct, and we can initiate
				 * the password reset. We pick some random time between 1 and 2 days from now into
				 * the future to serve as the unguessable auth code AND the expire time for it.
				 * Later we can create a deamon processor that cleans up expired authCodes, but for
				 * now we just need to HAVE the auth code.
				 * 
				 * User will be emailed this code and we will perform reset when we see it, and the
				 * user has entered new password we can use.
				 */
				int oneDayMillis = 60 * 60 * 1000;
				long authCode = new Date().getTime() + oneDayMillis + rand.nextInt(oneDayMillis);

				userPrefsNode.setProperty(JcrProp.USER_PREF_PASSWORD_RESET_AUTHCODE, String.valueOf(authCode));
				JcrUtil.save(session);

				String link = constProvider.getHostAndPort() + "?passCode=" + String.valueOf(authCode);
				String content = "Password reset was requested on SubNode account: " + user + //
				"<p>\nGo to this link to reset your password: <br>\n" + link;

				outboxMgr.queueEmail(email, "SubNode Password Reset", content);

				res.setMessage("A password reset link has been sent to your email. Check your inbox in a minute or so.");
				res.setSuccess(true);
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
			}
		});
	}

	/*
	 * Warning: not yet tested. Ended up not needing this yet.
	 */
	public String getPasswordOfUser(final String userName) {
		final ValContainer<String> password = new ValContainer<String>();
		adminRunner.run(session -> {
			Node prefsNode = getPrefsNodeForSessionUser(session, userName);
			String encPwd = JcrUtil.getRequiredStringProp(prefsNode, JcrProp.PWD);
			password.setVal(encryptor.decrypt(encPwd));
		});
		return password.getVal();
	}
}
