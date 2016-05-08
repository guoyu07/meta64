package com.meta64.mobile.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Keeping this for future reference.
 */
//todo-0: don't checkin dev file hardcoded here, bc this will break production
@Configuration

/*
 * IMPORTANT: I added this @PropertySource here to run JUnit testing. This is not the ideal place and has to be commented out 
 * in order to be able to run the app normally. todo-0, fix this. Do it the right way. Can I add this annotation directoy onto the Junit class? 
 * 
 */
//@PropertySource({"classpath:application.properties", "classpath:application-dev.properties", "file:/home/clay/ferguson/meta64Oak-private/test.properties"})
public class MyConfiguration extends WebMvcConfigurerAdapter {

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
}