package com.meta64.mobile.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.meta64.mobile.util.ThreadLocals;

@Component
public class AppFilter implements Filter {
	private static final Logger log = LoggerFactory.getLogger(AppFilter.class);

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {

		boolean initialSessionExisted = false;

		if (req instanceof HttpServletRequest) {
			HttpServletRequest httpReq = (HttpServletRequest) req;
			HttpSession session = httpReq.getSession(false);
			if (session == null) {
				log.debug("******** NO SESSION.");
			}
			else {
				initialSessionExisted = true;
			}
		}

		ThreadLocals.setInitialSessionExisted(initialSessionExisted);

		if (res instanceof HttpServletResponse) {
			ThreadLocals.setServletResponse((HttpServletResponse) res);
		}
		chain.doFilter(req, res);
	}

	@Override
	public void destroy() {
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
}