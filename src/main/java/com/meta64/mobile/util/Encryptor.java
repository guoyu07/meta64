package com.meta64.mobile.util;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;

/**
 * Symmetric Encryption using AES
 * 
 * It's highly recommended that you put --aeskey=XXXXXXXXXXXXXXXX not in a text file but as a
 * command line parameter when the application is started so that a hacker has to gain access to
 * your actual launch script to see the password.
 * 
 */
@Component
public class Encryptor {

	@Autowired
	public AppProp appProp;

	private Key aesKey = null;
	private Cipher cipher = null;

	synchronized private void init() {
		try {
			if (appProp.getAesKey() == null || appProp.getAesKey().length() != 16) {
				throw ExUtil.newEx("bad aes key configured");
			}
			if (aesKey == null) {
				aesKey = new SecretKeySpec(appProp.getAesKey().getBytes(), "AES");
				cipher = Cipher.getInstance("AES");
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	synchronized public String encrypt(String text) {
		try {
			init();
			cipher.init(Cipher.ENCRYPT_MODE, aesKey);
			return DatatypeConverter.printBase64Binary(cipher.doFinal(text.getBytes()));
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	synchronized public String decrypt(String text) {
		try {
			init();
			cipher.init(Cipher.DECRYPT_MODE, aesKey);
			return new String(cipher.doFinal(DatatypeConverter.parseBase64Binary(text)));
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}
}