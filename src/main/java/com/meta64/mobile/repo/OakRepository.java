package com.meta64.mobile.repo;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PreDestroy;
import javax.jcr.Repository;
import javax.jcr.Session;
import javax.sql.DataSource;

import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.jcr.repository.RepositoryImpl;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeState;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
import org.apache.jackrabbit.oak.plugins.document.rdb.RDBDataSourceFactory;
import org.apache.jackrabbit.oak.plugins.document.rdb.RDBOptions;
import org.apache.jackrabbit.oak.plugins.index.lucene.LuceneIndexEditorProvider;
import org.apache.jackrabbit.oak.plugins.index.lucene.LuceneIndexProvider;
import org.apache.jackrabbit.oak.security.SecurityProviderImpl;
import org.apache.jackrabbit.oak.spi.commit.Observer;
import org.apache.jackrabbit.oak.spi.query.QueryIndexProvider;
import org.apache.jackrabbit.oak.spi.security.ConfigurationParameters;
import org.apache.jackrabbit.oak.spi.security.SecurityProvider;
import org.apache.jackrabbit.oak.spi.security.user.UserConfiguration;
import org.apache.jackrabbit.oak.spi.security.user.UserConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.collect.ImmutableMap;
import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.service.TypeService;
import com.meta64.mobile.user.UserManagerUtil;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoTimeoutException;

/**
 * Instance of a JCR Repository (both RDB and MongoDB are supported).
 * 
 * If you configure db.store.type=="rdb", then set the rdb.* properties in this class. If you
 * configure db.store.type=="mongo", then set the mongo.* properties in this class.
 * 
 * NOTE: Even inside this class always use getRepository() to ensure that the init() has been
 * called.
 */
@Component
public class OakRepository {
	private static final Logger log = LoggerFactory.getLogger(OakRepository.class);

	// hack for now to make RSS deamon wait.
	public static boolean fullInit = false;

	@Autowired
	private IndexUtil indexUtil;

	@Autowired
	private RepositoryUtil repoUtil;

	@Autowired
	private AppProp appProp;

	@Autowired
	private UserManagerUtil userManagerUtil;

	@Autowired
	private JcrUtil jcrUtil;

	private LuceneIndexProvider indexProvider;
	private DocumentNodeStore nodeStore;
	private DocumentNodeState root;
	private ExecutorService executor;
	private Oak oak;
	private Jcr jcr;
	private Repository repository;
	private ConfigurationParameters securityParams;
	private SecurityProvider securityProvider;
	private DB mongoDb;

	// TODO: move this string to properties file.
	public static final String TABLEPREFIX = "jcr_";

	private RDBOptions options;
	private DataSource dataSource;

	/*
	 * Because of the criticality of this variable, I am not using the Spring getter to get it, but
	 * just using a private static. It's slightly safer and better for the purpose of cleanup in the
	 * shutdown hook which is all it's used for.
	 */
	private static OakRepository instance;

	/*
	 * We only need this lock to protect against startup and/or shutdown concurrency. Remember
	 * during debugging, etc the server process can be shutdown (CTRL-C) even while it's in the
	 * startup phase.
	 */
	private static final Object lock = new Object();

	private boolean initialized = false;

	@Autowired
	private TypeService typeService;

	/*
	 * Warning: Spring will NOT be fully initialized in this constructor when this runs.
	 * Use @PostConstruct instead for spring processing.
	 */
	public OakRepository() {
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

	public Repository getRepository() {
		init();
		return repository;
	}

	public Session newAdminSession() {
		try {
			return getRepository().login(jcrUtil.getAdminCredentials());
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	/* Called from SpringContextUtil#setApplicationContext, because we want to call only after all of Spring context is fully initialized */
	public void init() {
		if (initialized) return;

		synchronized (lock) {
			if (initialized) return;

			try {
				DocumentMK.Builder builder = new DocumentMK.Builder()//
						/*
						 * I'm really now sure how to use ClusterID but seems to run fine with just
						 * one node and without setting this.
						 */
						// .setClusterId(1)//
						.memoryCacheSize(10 * 1024 * 1024)//
						.setPersistentCache("target/persistentCache,time");

				/*
				 * Initialize Mongo DB
				 */
				if ("mongo".equalsIgnoreCase(appProp.getDbStoreType())) {
					log.info("Initializing Mongo Repository: " + appProp.getMongoDbName() + " host=" + appProp.getMongoDbHost() + " port=" + appProp.getMongoDbPort());
					mongoDb = new MongoClient(appProp.getMongoDbHost(), appProp.getMongoDbPort()).getDB(appProp.getMongoDbName());
					builder = builder.setMongoDB(mongoDb);
				}
				/*
				 * or else initialize RDBMS
				 */
				else if ("rdb".equalsIgnoreCase(appProp.getDbStoreType())) {
					log.debug("Initializing RDB.");
					options = new RDBOptions().tablePrefix(TABLEPREFIX);

					// For test cases, we could drop tables on close, but this is not a test case
					// options = options.dropTablesOnClose(true);

					// String driver = "org.apache.derby.jdbc.EmbeddedDriver";
					Class.forName(appProp.getRdbDriver()).newInstance();

					log.debug("rdbUrl: " + appProp.getRdbUrl());
					dataSource = RDBDataSourceFactory.forJdbcUrl(appProp.getRdbUrl(), appProp.getRdbUser(), appProp.getRdbPassword());
					builder = builder.setRDBConnection(dataSource, options);

					// This was ORIGINAL way of getting 'repository' with RDB
					// repository = new Jcr(nodeStore)/* .with(getQueryEngineSettings())
					// */.with(getSecurityProvider()).createRepository();
				}
				else if ("filesystem".equalsIgnoreCase(appProp.getDbStoreType())) {
					throw ExUtil.newEx("filesystem storage not yet supported.");
					/*
					 * The below code is just a sample of what I found online which I think works
					 * but I've never tested. Since Java includes DerbyDB support alread built-in, i
					 * haven't seen the need yet to try any filesystem storage for anything nor have
					 * i reserached any capabilities of FileStore yet.
					 */
					// FileStore fileStore = FileStore.newFileStore(new
					// File("target/"+System.currentTimeMillis())).create();
					// nodeStore = new SegmentNodeStore(fileStore);
				}

				nodeStore = builder.getNodeStore();
				root = nodeStore.getRoot();

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown()) return;

				executor = Oak.defaultExecutorService();
				oak = new Oak(nodeStore);
				oak = oak.with(executor);

				jcr = new Jcr(oak);
				jcr = jcr.with(getSecurityProvider());

				if (appProp.isIndexingEnabled()) {
					indexProvider = new LuceneIndexProvider();

					/* JCR code uses 'sync' name here but i'm not sure where they get that from, I Just know it's their default (todo-1: research) */
					jcr = jcr.withAsyncIndexing("async", 5);
					jcr = jcr.with(new LuceneIndexEditorProvider());
					jcr = jcr.with((QueryIndexProvider) indexProvider);
					jcr = jcr.with((Observer) indexProvider);
				}

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown()) return;

				repository = jcr.createRepository();
				log.debug("Db connection ok.");

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown()) return;

				/*
				 * IMPORTANT: Do not move this line below this point. An infinite loop of re-entry
				 * can occur into this method because of calls to getRepository() always doing an
				 * init.
				 */
				initialized = true;

				userManagerUtil.verifyAdminAccountReady(this);
				indexUtil.createIndexes();
				repoUtil.initRequiredNodes();
				repoUtil.createTestAccounts();
				typeService.initNodeTypes();

				log.debug("Repository fully initialized.");
				fullInit = true;
			}
			catch (MongoTimeoutException e) {
				log.error("********** Is the MongoDb or RDBMS Server reachable ? **********", e);
				throw e;
			}
			catch (Exception e) {
				throw ExUtil.newEx(e);
			}
		}
	}

	private SecurityProvider getSecurityProvider() {
		Map<String, Object> userParams = new HashMap<String, Object>();
		userParams.put(UserConstants.PARAM_ADMIN_ID, "admin");
		userParams.put(UserConstants.PARAM_OMIT_ADMIN_PW, false);

		securityParams = ConfigurationParameters.of(ImmutableMap.of(UserConfiguration.NAME, ConfigurationParameters.of(userParams)));
		securityProvider = new SecurityProviderImpl(securityParams);
		return securityProvider;
	}

	public void close() {
		AppServer.setShuttingDown(true);
		if (instance == null) return;

		synchronized (lock) {
			try {
				if (executor != null) {
					log.info("Shutting down Oak Executor");
					executor.shutdown();

					log.info("Awaiting executor shutdown");
					try {
						/* todo-1: If this timeout is too short, what would be the bad consequences of this? Hopefully no data corruption!!!?? */
						executor.awaitTermination(5, TimeUnit.MINUTES);
						log.info("Executor shutdown completed ok.");
					}
					catch (InterruptedException ex) {
						log.error("Executor failed to shutdown gracefully.", ex);
					}

					executor = null;
				}

				if (nodeStore != null) {
					log.info("disposing nodeStore.");
					nodeStore.dispose();
					nodeStore = null;
				}

				if (indexProvider != null) {
					log.info("Closing indexProvider.");
					indexProvider.close();
					indexProvider = null;
				}

				if (repository != null) {
					log.info("Shutting down repository.");
					((RepositoryImpl) repository).shutdown();
					repository = null;
				}

				if (mongoDb != null) {
					log.info("Closing mongo.");
					if (mongoDb.getMongo() != null) {
						mongoDb.getMongo().close();
					}
					mongoDb = null;
				}

				if (dataSource != null && appProp.getRdbShutdown() != null) {
					log.info("Closing RDBMS.");
					dataSource = null;
					try {
						DriverManager.getConnection(appProp.getRdbShutdown());
					}
					catch (SQLException e) {
						/*
						 * This exception is the normal flow, and is expected always, and so we log
						 * a message (not an error)
						 */
						log.info("RDB Shutdown complete.");
					}
				}
			}
			finally {
				instance = null;
			}
		}
	}

	public DocumentNodeState getRoot() {
		return root;
	}
}
