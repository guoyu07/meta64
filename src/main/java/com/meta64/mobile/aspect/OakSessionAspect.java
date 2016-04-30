package com.meta64.mobile.aspect;

import javax.jcr.Credentials;
import javax.jcr.GuestCredentials;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletResponse;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrPrincipal;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.model.UserPreferences;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.LoginRequest;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.LoginResponse;
import com.meta64.mobile.response.base.OakResponseBase;
import com.meta64.mobile.util.NotLoggedInException;
import com.meta64.mobile.util.ThreadLocals;

/**
 * This is the core (and maybe only) chunk of AOP that we use in this app, that wraps the processing
 * of a JSON call and handles all the boilerplate for performing a JSON call on the server which
 * comes from the JQuery ajax calls from the client. Primarily we use the cross cutting concerns of
 * user login, and JCR session lifecycle.
 * 
 * Remember, Spring AOP is a bit awkward because of the use of Proxies. Problems WILL occur if you
 * have a method in a bean that's not annotated calling a method in a bean that IS annotated,
 * because in this case the AOP aspects that the annotations would imply WILL always happen actually
 * will NOT happen. This is because of the fact that when calling a proxied object from some other
 * object than itself, the proxy will be used, but when a method already on the proxied object calls
 * a method on the same proxied object, the AOP expects that the 'wrapping' of AOP will have already
 * been performed and will not perform it again. That is, when you have an @Around annotation like
 * this the wrapping (around stuff) only happens when the proxy is FIRST entered into on any given
 * callstack, and when calling the same proxy again, reentrantly, it will not call the @Around
 * processing again. And this nuance is not 'true to AOP' in general, but is a just an
 * implementation choice made by the Spring developers.
 * 
 */
@Aspect
@Component
public class OakSessionAspect {

	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private OakRepository oak;

	@Around("@annotation(com.meta64.mobile.aspect.OakSession)")
	public Object call(final ProceedingJoinPoint joinPoint) throws Throwable {

		// ServletRequestAttributes attr = (ServletRequestAttributes)
		// RequestContextHolder.currentRequestAttributes();
		// HttpSession httpSession = attr.getRequest().getSession();

		Object ret = null;
		Session session = null;
		SessionContext sessionContext = (SessionContext) SpringContextUtil.getBean(SessionContext.class);
		try {
			if (sessionContext != null) {
				sessionContext.getLock().lock();
			}
			session = loginFromJoinPoint(joinPoint, sessionContext);

			ThreadLocals.setJcrSession(session);
			ret = joinPoint.proceed();
		}
		catch (NotLoggedInException e1) {
			HttpServletResponse res = ThreadLocals.getServletResponse();
			if (res != null) {
				res.sendError(HttpServletResponse.SC_FORBIDDEN);
			}
		}
		catch (Exception e) {
			log.error("exception: " + e.getMessage());

			/*
			 * if exception was thrown we get response from threadlocal, but really if we wanted to
			 * we should always be able to retrieve from threadlocal.
			 */
			ret = ThreadLocals.getResponse();

			if (ret instanceof OakResponseBase) {
				OakResponseBase orb = (OakResponseBase) ret;
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
			if (session != null) {
				session.logout();
				session = null;
			}

			/* cleanup this thread, servers reuse threads */
			ThreadLocals.setJcrSession(null);
			ThreadLocals.setResponse(null);

			if (sessionContext != null) {
				sessionContext.getLock().unlock();
			}
		}
		return ret;
	}

	/* Creates a logged in session for any method call for this join point */
	private Session loginFromJoinPoint(final ProceedingJoinPoint joinPoint, SessionContext sessionContext)
			throws Exception {
		Object[] args = joinPoint.getArgs();
		String userName = JcrPrincipal.ANONYMOUS;
		String password = JcrPrincipal.ANONYMOUS;

		Object req = (args != null && args.length > 0) ? args[0] : null;

		LoginResponse res = null;
		if (req instanceof LoginRequest) {
			res = new LoginResponse();
			res.setUserPreferences(new UserPreferences());
			ThreadLocals.setResponse(res);

			LoginRequest loginRequest = (LoginRequest) args[0];
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
				userName = JcrPrincipal.ANONYMOUS;
			}
			if (password == null) {
				password = JcrPrincipal.ANONYMOUS;
			}
		}

		try {
			Credentials cred = userName.equals(JcrPrincipal.ANONYMOUS) ? new GuestCredentials()
					: new SimpleCredentials(userName, password.toCharArray());
			Session session = oak.getRepository().login(cred);
			return session;
		}
		catch (Exception e) {
			if (res != null) {
				res.setSuccess(false);
				res.setMessage("Wrong username/password.");
			}
			throw e;
		}
	}
}
