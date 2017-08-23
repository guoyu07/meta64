package com.meta64.mobile.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppFilter;
import com.meta64.mobile.config.AppSessionListener;
import com.meta64.mobile.util.DateUtil;

/**
 * Service methods for System related functions. Admin functions.
 */
@Component
public class SystemService {
	private static final long ONE_MB = 1024 * 1024;
	private static final Logger log = LoggerFactory.getLogger(SystemService.class);

	@Autowired
	private RssService rssService;

	/*
	 * We are using VisualVM to monitor memory usage on the server and so for now I want to be able
	 * to have GC called regularly (despite that being completely unnecessary from a functional
	 * perspective), so that I get a more flat line looking chart of memory consumption unless
	 * memory is actual leaking. If memory is NOT leaking we should see a flat line chart over time,
	 * all things being equal
	 */
	@Scheduled(fixedDelay = 5 * DateUtil.MINUTE_MILLIS)
	public void runGarbageCollector() {
		if (AppServer.isShuttingDown()) return;
		System.gc();

		/* GC is async so we can just wait a reasonable 5 seconds */
		try {
			Thread.sleep(5 * DateUtil.SECOND_MILLIS);
		}
		catch (InterruptedException e) {
			// do nothing here, intentionally
		}
		logMemory();
	}

	public static void logMemory() {
		Runtime runtime = Runtime.getRuntime();
		long freeMem = runtime.freeMemory() / ONE_MB;
		long maxMem = runtime.maxMemory() / ONE_MB;
		log.info(String.format("GC Cycle. FreeMem=%dMB, MaxMem=%dMB", freeMem, maxMem));
	}

	public String getSystemInfo() {
		StringBuilder sb = new StringBuilder();
		Runtime runtime = Runtime.getRuntime();
		runtime.gc();
		long freeMem = runtime.freeMemory() / ONE_MB;
		sb.append(String.format("Free Memory %dMB<br>", freeMem));
		sb.append(String.format("Session Count: %d<br>", AppSessionListener.getSessionCounter()));
		//jcr
//		sb.append("<hr>");
//		sb.append(rssService.getStatusText());
//		sb.append("<hr>");
		sb.append(getIpReport());
		return sb.toString();
	}

	private static String getIpReport() {
		return "Number of Unique IPs since startup: " + AppFilter.getUniqueIpHits().size();
		// StringBuilder sb = new StringBuilder();
		// sb.append("Unique IPs During Run<br>");
		// int count = 0;
		// HashMap<String, Integer> map = AppFilter.getUniqueIpHits();
		// synchronized (map) {
		// for (String key : map.keySet()) {
		// int hits = map.get(key);
		// sb.append("IP=" + key + " hits=" + hits);
		// sb.append("<br>");
		// count++;
		// }
		// }
		// sb.append("count=" + count + "<br>");
		// return sb.toString();
	}
}
