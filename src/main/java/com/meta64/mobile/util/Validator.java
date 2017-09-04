package com.meta64.mobile.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.mongo.MongoApi;

@Component
public class Validator {

	@Autowired
	private MongoApi api;
	
	/*
	 * UserName requirements, between 5 and 100 characters (inclusive) long, and only allowing
	 * digits, letters, underscore, dash, and space.
	 * 
	 * Note that part of our requirement is that it must also be a valid substring inside JCR path
	 * names, that are used or looking up things about this user.
	 */
	public void checkUserName(String userName) {
		if (!api.isAllowedUserName(userName)) {
			throw ExUtil.newEx("Invalid or Illegal user name.");
		}
		
		int len = userName.length();
		if (len < 3 || len > 100) throw ExUtil.newEx("Username must be between 3 and 100 characters long.");

		for (int i = 0; i < len; i++) {
			char c = userName.charAt(i);
			if (!(Character.isLetterOrDigit(c) || c == '-' || c == '_' || c == ' ')) {
				throw ExUtil.newEx("Username can contain only letters, digits, dashes, underscores, and spaces. invalid[" + userName + "]");
			}
		}
	}

	/* passwords are only checked for length of 5 thru 100 */
	public void checkPassword(String password) {
		int len = password.length();
		if (len < 5 || len > 40) throw ExUtil.newEx("Password must be between 5 and 40 characters long.");
	}

	public void checkEmail(String email) {
		int len = email.length();
		if (len < 7 || len > 100) throw ExUtil.newEx("Invalid email address");
	}
}
