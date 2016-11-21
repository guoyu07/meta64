package com.meta64.mobile.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.service.RssService;

/**
 * Manages certain aspects of Spring application context.
 */
@Component
public class SpringContextUtil implements ApplicationContextAware {
	private static final Logger log = LoggerFactory.getLogger(SpringContextUtil.class);

	private static ApplicationContext context;

	@Autowired
	private OakRepository oakRepository;
	
	@Autowired
	private RssService rssService;

	@Override
	public void setApplicationContext(ApplicationContext context) throws BeansException {
		log.debug("SpringContextUtil initialized context.");
		this.context = context;

		try {
			oakRepository.init();
			rssService.parseTest("https://twit.tv/node/feed");
		}
		catch (Exception e) {
			log.error("application startup failed.");
			throw new RuntimeException(e);
		}
	}

	public static ApplicationContext getApplicationContext() {
		return context;
	}

	public static Object getBean(Class clazz) {
		if (context == null) {
			throw new RuntimeException("SpringContextUtil accessed before spring initialized.");
		}

		return context.getBean(clazz);
	}

	public static Object getBean(String name) {
		if (context == null) {
			throw new RuntimeException("SpringContextUtil accessed before spring initialized.");
		}

		return context.getBean(name);
	}
}
