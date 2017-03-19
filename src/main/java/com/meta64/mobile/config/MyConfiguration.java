package com.meta64.mobile.config;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/* 
 * The Environment stuff commented out in here is not needed because we just Autowire Environment wherever we need to.
 */
@Configuration
public class MyConfiguration extends WebMvcConfigurerAdapter {

	private static final Logger log = LoggerFactory.getLogger(MyConfiguration.class);
		
	@Value("${jsBaseFolder}")
	private String jsBaseFolder;

	// @Override
	// public void addViewControllers(ViewControllerRegistry registry) {
	// /* can use redirect or forward */
	// registry.addViewController("/").setViewName("redirect:/index.html");
	// }

	// DO NOT DELETE.
	// Leave as another way to show how to provide a bean by name in the spring
	// context
	// @Bean(name = "constantsProvider")
	// public ConstantsProvider constantsProvider() {
	// //return new ConstantsProviderImpl();
	// return (ConstantsProvider)
	// SpringContextUtil.getBean(ConstantsProviderImpl.class);
	// }

	// @Bean
	// public WebMvcConfigurerAdapter forwardToIndex() {
	// return new WebMvcConfigurerAdapter() {
	// @Override
	// public void addViewControllers(ViewControllerRegistry registry) {
	// // forward requests to /admin and /user to their index.html
	// registry.addViewController("/").setViewName("forward:/index.html");
	// // registry.addViewController("/user").setViewName(
	// // "forward:/user/index.html");
	// }
	// };
	// }

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		/*
		 * This is how we enable the JS files to be edited and tested without doing a rebuild and
		 * restart of server code. We can just run TSC compile to generate the new JS files, and
		 * then refresh the browser to reload them, and that works! This jsBaseFolder should of
		 * course be empty (unused) in production environment, or any time the JAR (build) should be
		 * used exclusively at runtime
		 */
		if (!StringUtils.isEmpty(jsBaseFolder)) {
			registry.addResourceHandler("/js/**").addResourceLocations(jsBaseFolder);
		}

		super.addResourceHandlers(registry);
	}
}