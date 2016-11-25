package com.meta64.mobile.repo;

import static com.google.common.collect.Lists.newArrayList;
import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PreDestroy;
import javax.jcr.Node;
import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.sql.DataSource;

import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.jcr.repository.RepositoryImpl;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeState;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
import org.apache.jackrabbit.oak.plugins.document.rdb.RDBDataSourceFactory;
import org.apache.jackrabbit.oak.plugins.document.rdb.RDBOptions;
import org.apache.jackrabbit.oak.plugins.index.aggregate.NodeAggregator;
import org.apache.jackrabbit.oak.plugins.index.aggregate.SimpleNodeAggregator;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.google.common.collect.ImmutableMap;
import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.service.TypeService;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.user.AccessControlUtil;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.user.UserManagerUtil;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.XString;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoTimeoutException;

/**
 * Instance of a MonboDB-based Repository.
 * 
 * NOTE: Even inside this class always use getRepository() to ensure that the init() has been
 * called.
 */
@Component
public class OakRepository {

	private static final Logger log = LoggerFactory.getLogger(OakRepository.class);

	@Value("${indexingEnabled}")
	private boolean indexingEnabled;

	@Value("${db.store.type}")
	private String dbStoreType;

	@Value("${rdb.driver}")
	private String rdbDriver;

	@Value("${rdb.url}")
	private String rdbUrl;

	@Value("${rdb.shutdown}")
	private String rdbShutdown;

	@Value("${rdb.user}")
	private String rdbUser;

	@Value("${rdb.password}")
	private String rdbPassword;

	@Autowired
	private UserManagerService userManagerService;

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

	private HashSet<String> testAccountNames = new HashSet<String>();

	/*
	 * We only need this lock to protect against startup and/or shutdown concurrency. Remember
	 * during debugging, etc the server process can be shutdown (CTRL-C) even while it's in the
	 * startup phase.
	 */
	private static final Object lock = new Object();

	private boolean initialized = false;

	/*
	 * MongoDb Server Connection Info
	 */
	@Value("${mongodb.host}")
	private String mongoDbHost;

	@Value("${mongodb.port}")
	private Integer mongoDbPort;

	@Value("${mongodb.name}")
	private String mongoDbName;

	@Value("${testUserAccounts}")
	private String testUserAccounts;

	/*
	 * JCR Info
	 */
	@Value("${jcrAdminUserName}")
	private String jcrAdminUserName;

	@Value("${jcrAdminPassword}")
	private String jcrAdminPassword;

	@Value("${anonUserLandingPageNode}")
	private String userLandingPageNode;

	@Value("${helpNode}")
	private String helpNode;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private TypeService typeService;

	public OakRepository() {
		instance = this;

		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				AppServer.setShuttingDown(true);
				instance.close();
			}
		}));
	}

	@PreDestroy
	public void preDestroy() {
		close();
	}

	public void initRequiredNodes() throws Exception {
		adminRunner.run((Session session) -> {

			/*
			 * todo-1: need to make all these markdown files able to be specified in a properties
			 * file, and also need to make the DB aware of time stamp so it can just check timestamp
			 * of file to determine if it needs to be loaded into DB or is already up to date
			 */
			Node landingPageNode = JcrUtil.ensureNodeExists(session, "/", userLandingPageNode, "Landing Page");
			initPageNodeFromClasspath(session, landingPageNode, "classpath:/public/doc/landing-page.md");

			JcrUtil.ensureNodeExists(session, "/", JcrName.ROOT, "Root of All Users");
			JcrUtil.ensureNodeExists(session, "/", JcrName.USER_PREFERENCES, "Preferences of All Users");
			JcrUtil.ensureNodeExists(session, "/", JcrName.OUTBOX, "System Email Outbox");
			JcrUtil.ensureNodeExists(session, "/", JcrName.SIGNUP, "Pending Signups");
		});
	}

	public Repository getRepository() throws Exception {
		init();
		return repository;
	}

	public Session newAdminSession() throws Exception {
		return getRepository().login(new SimpleCredentials(getJcrAdminUserName(), getJcrAdminPassword().toCharArray()));
	}

	public void init() throws Exception {
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
						.memoryCacheSize(64 * 1024 * 1024)//
						.setPersistentCache("target/persistentCache,time");

				/*
				 * Initialize Mongo DB
				 */
				if ("mongo".equalsIgnoreCase(dbStoreType)) {
					log.info("Initializing Mongo Repository: " + mongoDbName + " host=" + mongoDbHost + " port=" + mongoDbPort);
					mongoDb = new MongoClient(mongoDbHost, mongoDbPort).getDB(mongoDbName);
					builder = builder.setMongoDB(mongoDb);
				}
				/*
				 * or else initialize RDBMS
				 */
				else if ("rdb".equalsIgnoreCase(dbStoreType)) {
					log.debug("Initializing RDB.");
					options = new RDBOptions().tablePrefix(TABLEPREFIX);

					// For test cases, we could drop tables on close, but this is not a test case
					// options = options.dropTablesOnClose(true);

					// String driver = "org.apache.derby.jdbc.EmbeddedDriver";
					Class.forName(rdbDriver).newInstance();

					String userDir = System.getProperty("user.dir");
					String url = rdbUrl.replace("{user.dir}", userDir);

					// todo-0: investigate if we are supposed to call 'close' on something to
					// release this dataSource ?
					dataSource = RDBDataSourceFactory.forJdbcUrl(url, rdbUser, rdbPassword);
					builder = builder.setRDBConnection(dataSource, options);

					// This was ORIGINAL way of getting 'repository' with RDB
					// repository = new Jcr(nodeStore)/* .with(getQueryEngineSettings())
					// */.with(getSecurityProvider()).createRepository();
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

				if (indexingEnabled) {
					/*
					 * WARNING: Not all valid SQL will work with these lucene queries. Namely the
					 * contains() method fails so always use '=' operator for exact string matches
					 * or LIKE %something%, instead of using the contains method.
					 */
					indexProvider = new LuceneIndexProvider();
					indexProvider = indexProvider.with(getNodeAggregator());

					jcr = jcr.with(new LuceneFullTextInitializer("contentIndex", "jcr:content"));
					jcr = jcr.with(new LuceneFullTextInitializer("tagsIndex", "tags"));

					jcr = jcr.with(new LuceneSortInitializer("createdIndex", "jcr:created"));
					jcr = jcr.with(new LuceneSortInitializer("lastModifiedIndex", "jcr:lastModified"));
					jcr = jcr.with(new LuceneSortInitializer("codeIndex", JcrProp.CODE));
					jcr = jcr.with(new LuceneSortInitializer("pwdResetAuthIndex", JcrProp.USER_PREF_PASSWORD_RESET_AUTHCODE));

					jcr = jcr.with((QueryIndexProvider) indexProvider);
					jcr = jcr.with((Observer) indexProvider);
					jcr = jcr.with(new LuceneIndexEditorProvider());
					jcr = jcr.withAsyncIndexing();
				}

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown()) return;

				repository = jcr.createRepository();
				log.debug("MongoDb connection ok.");

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown()) return;

				/*
				 * IMPORTANT: Do not move this line below this point. An infinite loop of re-entry
				 * can occur into this method because of calls to getRepository() always doing an
				 * init.
				 */
				initialized = true;

				UserManagerUtil.verifyAdminAccountReady(this);
				initRequiredNodes();
				createTestAccounts();
				typeService.initNodeTypes();

				log.debug("Repository fully initialized.");
			}
			catch (MongoTimeoutException e) {
				log.error("********** Is the MongoDb Server reachable ? **********", e);
				throw e;
			}
		}
	}

	/*
	 * We create these users just so there's an easy way to start doing multi-user testing (sharing
	 * nodes from user to user, etc) without first having to manually register users.
	 */
	private void createTestAccounts() throws Exception {
		/*
		 * The testUserAccounts is a comma delimited list of user accounts where each user account
		 * is a colon-delimited list like username:password:email.
		 * 
		 * todo-1: could change the format of this info to JSON.
		 */
		final List<String> testUserAccountsList = XString.tokenize(testUserAccounts, ",", true);
		if (testUserAccountsList == null) {
			return;
		}

		adminRunner.run((Session session) -> {
			for (String accountInfo : testUserAccountsList) {
				final List<String> accountInfoList = XString.tokenize(accountInfo, ":", true);
				if (accountInfoList == null || accountInfoList.size() != 3) {
					log.debug("Invalid User Info substring: " + accountInfo);
					continue;
				}

				String userName = accountInfoList.get(0);

				SignupRequest signupReq = new SignupRequest();
				signupReq.setUserName(userName);
				signupReq.setPassword(accountInfoList.get(1));
				signupReq.setEmail(accountInfoList.get(2));

				SignupResponse res = new SignupResponse();
				userManagerService.signup(session, signupReq, res, true);

				/*
				 * keep track of these names, because some API methods need to know if a given
				 * account is a test account
				 */
				testAccountNames.add(userName);
			}
		});
	}

	private void initPageNodeFromClasspath(Session session, Node node, String classpath) {
		try {
			Resource resource = SpringContextUtil.getApplicationContext().getResource(classpath);
			String content = XString.loadResourceIntoString(resource);
			node.setProperty(JcrProp.CONTENT, content);
			AccessControlUtil.makeNodePublic(session, node);
			node.setProperty(JcrProp.DISABLE_INSERT, "y");
			session.save();
		}
		catch (Exception e) {
			// IMPORTANT: don't rethrow from here, or this could blow up app
			// initialization.
			e.printStackTrace();
		}
	}

	/*
	 * I don't fully understand what this aggregator is for. Need to research this some.
	 */
	private static NodeAggregator getNodeAggregator() {
		return new SimpleNodeAggregator().newRuleWithName(JcrConstants.NT_UNSTRUCTURED, //
				newArrayList(JCR_CONTENT, JCR_CONTENT + "/*"));
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
		synchronized (lock) {

			if (executor != null) {
				log.info("Shutting down Oak Executor");
				executor.shutdown();

				log.info("Awaiting executor shutdown");
				try {
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

			if (dataSource != null && rdbShutdown != null) {
				dataSource = null;
				try {
					DriverManager.getConnection(rdbShutdown);
				}
				catch (SQLException e) {
					/*
					 * This exception is the normal flow, and is expected always, and so we log a
					 * message (not an error)
					 */
					log.info("RDB Shutdown complete.");
				}
			}
		}
	}

	public DocumentNodeState getRoot() throws Exception {
		return root;
	}

	public String getJcrAdminUserName() {
		return jcrAdminUserName;
	}

	public String getJcrAdminPassword() {
		return jcrAdminPassword;
	}

	public String getHelpNode() {
		return helpNode;
	}

	public void setHelpNode(String helpNode) {
		this.helpNode = helpNode;
	}

	public boolean isTestAccountName(String userName) {
		return testAccountNames.contains(userName);
	}
}
