package com.meta64.mobile;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Standard SpringBoot entry point. Starts up entire application, which will run an instance of
 * Tomcat embedded and open the port specified in the properties file and start serving up requests.
 */
@SpringBootApplication
@EnableScheduling
@ServletComponentScan
public class AppServer {

	private static boolean shuttingDown;
	private static boolean enableScheduling;

	public static void main(String[] args) {
		/*
		 * If we are running AppServer then enableScheduling, otherwise we may be running some
		 * command line service such as BackupUtil, in which case deamons need to be deactivated.
		 */
		enableScheduling = true;
		SpringApplication.run(AppServer.class, args);
		hookEclipseShutdown(args);
	}

	/*
	 * The 'args' search in this method is not ideal but I wanted this to be as simple as possibible
	 * and portabe to shart with other java developers and able to work just from calling this one
	 * static method.
	 */
	private static void hookEclipseShutdown(String[] args) {
		boolean inEclipse = false;
		for (String arg : args) {
			if (arg.contains("RUNNING_IN_ECLIPSE")) {
				inEclipse = true;
				break;
			}
		}
		if (!inEclipse) return;

		boolean loopz = true;
		InputStreamReader isr = null;
		BufferedReader br = null;
		try {
			isr = new InputStreamReader(System.in);
			br = new BufferedReader(isr);
			while (loopz) {
				String userInput = br.readLine();
				System.out.println("input => " + userInput);
				if (userInput.equalsIgnoreCase("q")) {
					shuttingDown = true;
					System.exit(0);
				}
			}
		}
		catch (Exception er) {
			er.printStackTrace();
			loopz = false;
		}
		finally {
			try {
				if (br != null) {
					br.close();
				}
			}
			catch (Exception e) {
			}

			try {
				if (isr != null) {
					isr.close();
				}
			}
			catch (Exception e) {
			}
		}
	}

	public static boolean isShuttingDown() {
		return shuttingDown;
	}

	public static void setShuttingDown(boolean shuttingDown) {
		AppServer.shuttingDown = shuttingDown;
	}

	public static boolean isEnableScheduling() {
		return enableScheduling;
	}
}
