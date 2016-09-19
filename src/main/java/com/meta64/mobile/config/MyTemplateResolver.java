package com.meta64.mobile.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

//@Configuration
public class MyTemplateResolver {

//	@Autowired
//	private SpringTemplateEngine templateEngine;
//
//	@PostConstruct
//	public void extension() {
////		FileTemplateResolver resolver = new FileTemplateResolver();
////		resolver.setPrefix("D:\\templates\\");
////		resolver.setSuffix(".html");
////		resolver.setTemplateMode("HTML5");
////		resolver.setOrder(templateEngine.getTemplateResolvers().size());
////		resolver.setCacheable(false);
//		
//		ServletContextTemplateResolver webTemplateResolver = new ServletContextTemplateResolver();
//        webTemplateResolver.setPrefix("/templates/");
//        webTemplateResolver.setSuffix(".xml");
//        webTemplateResolver.setTemplateMode("HTML5");
//        webTemplateResolver.setCharacterEncoding("UTF-8");
//        webTemplateResolver.setOrder(1);
//        //templatesResolvers.add(webTemplateResolver);
//		
//		templateEngine.addTemplateResolver(webTemplateResolver);
//	}
}