package com.meta64.mobile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.service.BackupService;

/**
 * Standard SpringBoot entry point. Starts up entire application, which will run an instance of
 * Tomcat embedded and open the port specified in the properties file and start serving up requests.
 */
@SpringBootApplication
// @EnableScheduling
public class BackupUtil {

	private static final Logger log = LoggerFactory.getLogger(BackupUtil.class);
	
	/*
	 * WARNING: This backup/restore stuff is new and untested at this point. It appears to work, but has not 
	 * been fully verified, and the restore function has not yet been completed.
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackupUtil.class, args);
		log.debug("App Started, and will shutdown now.");

		try {
			BackupService backupService = (BackupService) SpringContextUtil.getBean(BackupService.class);
			backupService.backup();
			
			/* BE CAREFUL 
			 * 
			 * Don't overwrite your good data!
			 * */
			//backupService.restore();
		}
		catch (Exception e) {
			log.error("Backup failed.", e);
		}
		System.exit(0);
	}

}
