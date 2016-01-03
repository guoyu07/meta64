package com.meta64.mobile.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;

@Component
@Scope("singleton")
public class BrandingUtil {

	@Value("${brandingTitle}")
	private String brandingTitle;

	@Value("${brandingMetaContent}")
	private String brandingMetaContent;

	//poly-TODO: these are hardcoded in Polymer
	public void addBrandingAttributes(Model model) {
		model.addAttribute("brandingTitle", brandingTitle);
		model.addAttribute("brandingMetaContent", brandingMetaContent);
	}
}
