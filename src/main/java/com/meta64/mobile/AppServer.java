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

	/* Java Main entry point for meta64 application */
	public static void main(String[] args) {
		/*
		 * If we are running AppServer then enableScheduling, otherwise we may be running some
		 * command line service such as BackupUtil, in which case deamons need to be deactivated.
		 */
		enableScheduling = true;
		SpringApplication.run(AppServer.class, args);
		hookEclipseShutdown(args);

		// Note: See SpringContextUtil.java for more code that runs at startup time.
	}

	/*
	 * The 'args' search in this method is not ideal but I wanted this to be as simple as possible
	 * and portable to share with other java developers and able to work just from calling this one
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
				if (userInput.equalsIgnoreCase("q")) {
					System.out.println("Terminating, at user request.");
					// despite call to exit(0), this does cause a graceful shutdown, because of
					// shutdown hook.
					shuttingDown = true;
					System.exit(0);
				}
			}
			Thread.sleep(3000);
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
