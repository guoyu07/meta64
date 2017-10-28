package com.meta64.mobile.mongo;

import javax.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Component;

import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.test.MongoTest;

@Component
public class MongoRepository {
	private static final Logger log = LoggerFactory.getLogger(MongoRepository.class);

	// hack for now to make RSS deamon wait.
	public static boolean fullInit = false;

	@Autowired
	private AppProp appProp;

	@Autowired
	private RepositoryUtil repoUtil;

	@Autowired
	private MongoTest mongoTest;

	@Autowired
	private MongoApi api;

	/*
	 * Because of the criticality of this variable, I am not using the Spring getter to get it, but
	 * just using a private static. It's slightly safer and better for the purpose of cleanup in the
	 * shutdown hook which is all it's used for.
	 */
	private static MongoRepository instance;

	/*
	 * We only need this lock to protect against startup and/or shutdown concurrency. Remember
	 * during debugging, etc the server process can be shutdown (CTRL-C) even while it's in the
	 * startup phase.
	 */
	private static final Object lock = new Object();

	private boolean initialized = false;

	/*
	 * Warning: Spring will NOT be fully initialized in this constructor when this runs.
	 * Use @PostConstruct instead for spring processing.
	 */
	public MongoRepository() {
		instance = this;

		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				if (instance != null) {
					instance.close();
				}
			}
		}));
	}

	@PreDestroy
	public void preDestroy() {
		close();
	}

	/*
	 * Called from SpringContextUtil#setApplicationContext, because we want to call only after all
	 * of Spring context is fully initialized
	 */
	public void init() {
		if (initialized) return;

		synchronized (lock) {
			if (initialized) return;

			/* can shutdown during startup. */
			if (AppServer.isShuttingDown()) return;

			/*
			 * IMPORTANT: Do not move this line below this point. An infinite loop of re-entry can
			 * occur into this method because of calls to getRepository() always doing an init.
			 */
			initialized = true;

			MongoSession adminSession = api.getAdminSession();

			if (appProp.getMongoTest()) {
				mongoTest.wipeDb(adminSession);
			}

			if (appProp.getForceIndexRebuild()) {
				api.dropAllIndexes(adminSession);
			}
			
			if (appProp.getReSaveAll()) {
				api.reSaveAll(adminSession);
			}
			
			api.createAllIndexes(adminSession);

			api.createAdminUser(adminSession);
			repoUtil.createTestAccounts();

			if (appProp.getMongoTest()) {
				mongoTest.mainTest();
			}

			log.debug("MongoRepository fully initialized.");
			fullInit = true;
		}
	}

	public void close() {
		AppServer.setShuttingDown(true);
		if (instance == null) return;

		synchronized (lock) {
			try {
				// code here evaporated. but i'll leave this slot for it anyway.
			}
			finally {
				instance = null;
			}
		}
	}
}
