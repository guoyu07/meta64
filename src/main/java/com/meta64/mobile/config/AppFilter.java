package com.meta64.mobile.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * This is the correct way to do a Web Filter in Spring Boot, but I ended up not needing it after
 * all. I am detecting timeouts in the controller class itself and returning JSON results to client
 * Ajax calls that indicate a session timeout which is something that can't be done in the filter
 * layer. Since we have Ajax calls that can be operating on a timed out session we can't just do
 * some kind of redirect to a login page in this filter. Regardless I'm keeping this code because
 * some day I'm likely to need a WebFilter for something.
 */
// @Component
public class AppFilter implements Filter {
	private static final Logger log = LoggerFactory.getLogger(AppFilter.class);

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		if (req instanceof HttpServletRequest) {
			HttpServletRequest httpReq = (HttpServletRequest) req;
			HttpSession session = httpReq.getSession(false);
			if (session == null) {
				// log.debug("******** NOT LOGGED IN.");
			}
		}
		// HttpServletResponse response = (HttpServletResponse) res;
		chain.doFilter(req, res);
	}

	@Override
	public void destroy() {
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
}