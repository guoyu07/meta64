package com.meta64.mobile.aspect;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.NodePrincipal;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.request.ChangePasswordRequest;
import com.meta64.mobile.request.LoginRequest;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.request.base.RequestBase;
import com.meta64.mobile.response.LoginResponse;
import com.meta64.mobile.response.base.ResponseBase;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.MongoRunnableEx;
import com.meta64.mobile.util.NotLoggedInException;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.VarUtil;
import com.meta64.mobile.util.XString;

/* This is the new replacement for OakSessionAspect (maybe, still undecided), because i am moving away from Aspects (AOP) and using
 * Java Lambdas, because they can accomplish the same cross-cutting concern in a cleaner way. This CallProcessor
 * is only being used in one place so far to prove it works (it did) and so next i'll be putting it everywhere
 * and deleting OakSessionAspect completely, soon.
 */
@Component
public class CallProcessor {
	private static final Logger log = LoggerFactory.getLogger(CallProcessor.class);

	@Autowired
	private MongoApi api;

	private static final boolean logRequests = false;

	public Object run(String command, RequestBase req, MongoRunnableEx runner) {
		logRequest(command, req);

		if (AppServer.isShuttingDown()) {
			throw ExUtil.newEx("Server is shutting down.");
		}

		Object ret = null;
		MongoSession mongoSession = null;
		SessionContext sessionContext = (SessionContext) SpringContextUtil.getBean(SessionContext.class);
		try {
			if (sessionContext != null) {
				sessionContext.getLock().lock();
			}

			mongoSession = login(req, sessionContext);
			ThreadLocals.setMongoSession(mongoSession);
			checkHttpSession();
			ret = runner.run(mongoSession);
		}
		catch (NotLoggedInException e1) {
			HttpServletResponse res = ThreadLocals.getServletResponse();
			try {
				if (res != null) {
					res.sendError(HttpServletResponse.SC_FORBIDDEN);
				}
			}
			catch (Exception e) {
				ExUtil.error(log, "exception in aspect", e);
			}
		}
		catch (Exception e) {
			ExUtil.error(log, "exception in aspect", e);

			/*
			 * if exception was thrown we get response from threadlocal, but really if we wanted to
			 * we should always be able to retrieve from threadlocal.
			 */
			ret = ThreadLocals.getResponse();

			if (ret instanceof ResponseBase) {
				ResponseBase orb = (ResponseBase) ret;
				if (orb != null) {
					orb.setSuccess(false);

					/*
					 * for now, we can just send back the actual exception message
					 */
					orb.setMessage(e.getMessage());
				}
			}
		}
		finally {
			/* cleanup this thread, servers reuse threads */
			ThreadLocals.setMongoSession(null);
			ThreadLocals.setResponse(null);

			if (sessionContext != null) {
				if (sessionContext.getLock() != null) {
					sessionContext.getLock().unlock();
				}

				if (sessionContext.getHttpSessionToInvalidate() != null) {
					sessionContext.getHttpSessionToInvalidate().invalidate();
					sessionContext.setHttpSessionToInvalidate(null);
				}
			}
		}
		logResponse(ret);
		return ret;
	}

	/* Creates a logged in session for any method call for this join point */
	private MongoSession login(RequestBase req /* final Object[] args */, SessionContext sessionContext) {

		String userName = NodePrincipal.ANONYMOUS;
		String password = NodePrincipal.ANONYMOUS;

		LoginResponse res = null;
		if (req instanceof LoginRequest) {
			res = new LoginResponse();
			res.setUserPreferences(new UserPreferences());
			ThreadLocals.setResponse(res);

			LoginRequest loginRequest = (LoginRequest) req;
			userName = loginRequest.getUserName();
			password = loginRequest.getPassword();

			if (userName.equals("")) {
				userName = sessionContext.getUserName();
				password = sessionContext.getPassword();
			}

			/* not logged in and page load is checking for logged in session */
			if (userName == null) {
				return null;
			}
		}
		else if (req instanceof ChangePasswordRequest && ((ChangePasswordRequest) req).getPassCode() != null) {
			/*
			 * we will have no session for user here, return null;
			 */
			return null;
		}
		else if (req instanceof SignupRequest) {
			/*
			 * we will have no session for user for signup request, so return null
			 */
			return null;
		}
		else {
			userName = sessionContext.getUserName();
			password = sessionContext.getPassword();

			if (userName == null) {
				userName = NodePrincipal.ANONYMOUS;
			}
			if (password == null) {
				password = NodePrincipal.ANONYMOUS;
			}
		}

		try {
			MongoSession session = api.login(userName, password);
			return session;
		}
		catch (Exception e) {
			if (res != null) {
				res.setSuccess(false);
				res.setMessage("Wrong username/password.");
			}
			throw ExUtil.newEx(e);
		}
	}

	private static void logRequest(String url, Object req) {
		if (logRequests) {
			log.trace("REQ=" + url + " " + (req == null ? "none" : XString.prettyPrint(req)));
		}
	}

	private static void logResponse(Object res) {
		if (logRequests) {
			log.trace("RES=" + (res == null ? "none" : XString.prettyPrint(res)));
		}
	}

	private void checkHttpSession() throws NotLoggedInException {
		if (!VarUtil.safeBooleanVal(ThreadLocals.getInitialSessionExisted())) {
			throw new NotLoggedInException();
		}
	}
}
