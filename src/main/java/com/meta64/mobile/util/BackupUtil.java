package com.meta64.mobile.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.service.BackupService;

/*
 * This backup utility DOES NOT WORK YET, due to Oak bug acknowledged by Oak developers on their 
 * mailing list.
 */
@SpringBootApplication
// @EnableScheduling
public class BackupUtil {

	private static final Logger log = LoggerFactory.getLogger(BackupUtil.class);

	public static void main(String[] args) {
		SpringApplication.run(BackupUtil.class, args);
		log.debug("App Started, and will shutdown now.");

		try {
			BackupService backupService = (BackupService) SpringContextUtil.getBean(BackupService.class);
			backupService.runCommandLine();
		}
		catch (Exception e) {
			log.error("Backup failed.", e);
		}
		System.exit(0);
	}
}
