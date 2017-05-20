package com.meta64.mobile.user;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;

import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.model.RefInfo;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;

/**
 * Utilities related to user management.
 *
 */
@Component
public class UserManagerUtil {
	private static final Logger log = LoggerFactory.getLogger(UserManagerUtil.class);

	@Autowired
	private AppProp appProp;

	public static boolean isNormalUserName(String userName) {
		userName = userName.trim();
		return !userName.equalsIgnoreCase("admin") && !userName.equalsIgnoreCase("everyone");
	}

	public static Authorizable getUser(Session session, String userName) {
		try {
			UserManager userManager = ((JackrabbitSession) session).getUserManager();
			Authorizable authorizable = userManager.getAuthorizable(userName);
			return authorizable;
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	// public static boolean userExists(Session session, String userName) {
	// boolean ret = false;
	// UserManager userManager = ((JackrabbitSession) session).getUserManager();
	// Authorizable authorizable = userManager.getAuthorizable(userName);
	// if (authorizable != null) {
	// ret = true;
	// }
	// return ret;
	// }

	public static boolean createUser(Session session, String userName, String password, boolean automated) {
		try {
			boolean ret = false;
			UserManager userManager = ((JackrabbitSession) session).getUserManager();
			Authorizable authorizable = userManager.getAuthorizable(userName);
			if (authorizable == null) {
				User user = userManager.createUser(userName, password);
				if (user != null) {
					JcrUtil.save(session);
					ret = true;
				}
			}
			else {
				/*
				 * if this is an automated signup then we don't need to throw an exception if the
				 * user already exist, because during most startups when the DB already exists, this
				 * is going to be the normal flow. Test accounts already exist, etc.
				 */
				if (automated) {
					log.trace("Account Verified to Exist: " + userName);
				}
				else {
					//todo-0: i get this failure obviously even after removing the nodes representing the user, because the user is STILL in the JCR!!!
					//I had been mistakenly thinking i can just delete a user's SubNode root node, and that removes the user, but this is not the case
					//because the JCR itself has the user registered.
					throw new RuntimeEx("UserName is already taken."); 
				}
			}
			return ret;
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	public static boolean removeUser(Session session, String userName) {
		try {
			boolean ret = false;
			UserManager userManager = ((JackrabbitSession) session).getUserManager();
			Authorizable authorizable = userManager.getAuthorizable(userName);
			if (authorizable != null) {
				authorizable.remove();
			}
			else {
				// if user not found we just do nothing, and throw no exception so
				// that the rest
				// of the clean up of the account will continue
			}
			return ret;
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	public static RefInfo getRootNodeRefInfoForUser(Session session, String userName) {
		Node rootNode = null;

		try {
			if (userName.equalsIgnoreCase(JcrPrincipal.ADMIN)) {
				rootNode = session.getRootNode();
			}
			else {
				rootNode = session.getNode("/" + JcrName.ROOT + "/" + userName);
			}
			return new RefInfo(rootNode.getIdentifier(), rootNode.getPath());
		}
		catch (Exception e) {
			throw new RuntimeEx(e);
		}
	}

	public static boolean createUserRootNode(Session session, String userName) {
		try {
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

			return true;
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	public void changePassword(Session session, String userId, String newPassword) {
		try {
			UserManager userManager = ((JackrabbitSession) session).getUserManager();
			Authorizable authorizable = userManager.getAuthorizable(userId);
			((User) authorizable).changePassword(newPassword);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	/*
	 * Initialize admin user account credentials into repository if not yet done. This should only
	 * get triggered the first time the repository is created, the first time the app is started.
	 */
	public void verifyAdminAccountReady(OakRepository oak) {
		Session session = null;

		try {
			session = oak.getRepository().login(new SimpleCredentials(appProp.getJcrAdminUserName(), appProp.getJcrAdminPassword().toCharArray()));
			log.debug("Admin user login verified, on first attempt.");
		}
		catch (Exception e) {
			log.debug("Admin account credentials not working. Trying with default admin/admin.");

			try {
				session = oak.getRepository().login(new SimpleCredentials(JcrPrincipal.ADMIN, "admin".toCharArray()));
				log.debug("Admin user login verified, using defaults.");

				changePassword(session, JcrPrincipal.ADMIN, appProp.getJcrAdminPassword());
				JcrUtil.save(session);
			}
			catch (Exception e2) {
				log.debug("Admin user login failed with configured credentials AND default. Unable to connect. Server will fail.");
				throw new RuntimeEx(e2);
			}
		}
		finally {
			if (session != null) {
				session.logout();
			}
		}
	}
}
