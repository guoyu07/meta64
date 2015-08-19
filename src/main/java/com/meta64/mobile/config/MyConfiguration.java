package com.meta64.mobile.config;

import javax.servlet.http.HttpSessionListener;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Keeping this for future reference.
 */
@Configuration
public class MyConfiguration {

	@Bean
	public HttpSessionListener httpSessionListener() {

		/*
		 * TODO: It's preferrable (if possible) to just annotate the AppSessionListener class itself
		 * instead of using this @Bean in a @Configuration class.
		 */
		return new AppSessionListener();
	}

	// DO NOT DELETE.
	// Leave as another way to show how to provide a bean by name in the spring context
	// @Bean(name = "constantsProvider")
	// public ConstantsProvider constantsProvider() {
	// //return new ConstantsProviderImpl();
	// return (ConstantsProvider) SpringContextUtil.getBean(ConstantsProviderImpl.class);
	// }
}