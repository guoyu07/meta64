package com.meta64.mobile.config;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Standard Spring WebMvcConfigurerAdapter-derived class.
 */
@Configuration
public class AppConfiguration extends WebMvcConfigurerAdapter {
	private static final Logger log = LoggerFactory.getLogger(AppConfiguration.class);

	@Autowired
	private AppProp appProp;

	/*
	 * To avoid error message during startup
	 * "No qualifying bean of type 'org.springframework.scheduling.TaskScheduler' available" we have
	 * to provide spring with a Task Scheduler.
	 */
	@Bean
	public TaskScheduler taskScheduler() {
		return new ConcurrentTaskScheduler(); // single threaded by default
	}

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
		if (!StringUtils.isEmpty(appProp.getJsBaseFolder())) {
			registry.addResourceHandler("/js/**").addResourceLocations(appProp.getJsBaseFolder());
		}

		super.addResourceHandlers(registry);
	}
	
	// @PostConstruct
		// public void extension() {
		//// FileTemplateResolver resolver = new FileTemplateResolver();
		//// resolver.setPrefix("D:\\templates\\");
		//// resolver.setSuffix(".html");
		//// resolver.setTemplateMode("HTML5");
		//// resolver.setOrder(templateEngine.getTemplateResolvers().size());
		//// resolver.setCacheable(false);
		//
		// ServletContextTemplateResolver webTemplateResolver = new ServletContextTemplateResolver();
		// webTemplateResolver.setPrefix("/templates/");
		// webTemplateResolver.setSuffix(".xml");
		// webTemplateResolver.setTemplateMode("HTML5");
		// webTemplateResolver.setCharacterEncoding("UTF-8");
		// webTemplateResolver.setOrder(1);
		// //templatesResolvers.add(webTemplateResolver);
		//
		// templateEngine.addTemplateResolver(webTemplateResolver);
		// }
}