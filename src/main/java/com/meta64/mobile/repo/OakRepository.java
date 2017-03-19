package com.meta64.mobile.repo;

import static com.google.common.collect.Lists.newArrayList;
import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;

import java.io.File;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.jcr.Node;
import javax.jcr.Repository;
import javax.jcr.Session;
import javax.sql.DataSource;

import org.apache.commons.io.FileUtils;
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
import org.apache.jackrabbit.oak.plugins.index.lucene.LuceneIndexConstants;
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
import com.meta64.mobile.config.AppProp;
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
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrConst;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.XString;
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
	private AppProp appProp;

	@Value("${forceIndexRebuild}")
	private boolean forceIndexRebuild;

	@Value("${indexingEnabled}")
	private boolean indexingEnabled;

	@Value("${db.store.type}")
	private String dbStoreType;

	@Value("${rdb.driver}")
	private String rdbDriver;

	@Value("${rdb.user}")
	private String rdbUser;

	@Value("${rdb.password}")
	private String rdbPassword;

	@Autowired
	private UserManagerService userManagerService;

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

	/*
	 * Warning: Spring will NOT be fully initialized in this constructor when this runs.
	 * Use @PostConstruct instead for spring processing.
	 */
	public OakRepository() {
		instance = this;

		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				instance.close();
			}
		}));
	}

	@PreDestroy
	public void preDestroy() {
		close();
	}

//	@PostConstruct
//	public void postConstruct() {
//		//adminDataFolder = FileTools.translateDirs(adminDataFolder);
//		//rdbUrl = FileTools.translateDirs(rdbUrl);
//		//rdbShutdown = FileTools.translateDirs(rdbShutdown);
//
//		String test = appProp.getAdminDataFolder();
//		//String test = env.getProperty("adminDataFolder");
//		log.debug("adminDataFolder=" + test);
//	}

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
		return getRepository().login(jcrUtil.getAdminCredentials());
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
						.memoryCacheSize(10 * 1024 * 1024)//
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

					log.debug("rdbUrl: " + appProp.getRdbUrl());
					dataSource = RDBDataSourceFactory.forJdbcUrl(appProp.getRdbUrl(), rdbUser, rdbPassword);
					builder = builder.setRDBConnection(dataSource, options);

					// This was ORIGINAL way of getting 'repository' with RDB
					// repository = new Jcr(nodeStore)/* .with(getQueryEngineSettings())
					// */.with(getSecurityProvider()).createRepository();
				}
				else if ("filesystem".equalsIgnoreCase(dbStoreType)) {
					throw new Exception("filesystem storage not yet supported.");
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

				if (indexingEnabled) {
					indexProvider = new LuceneIndexProvider();

					jcr = jcr.withAsyncIndexing();
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

				UserManagerUtil.verifyAdminAccountReady(this);
				createIndexes();
				initRequiredNodes();
				createTestAccounts();
				typeService.initNodeTypes();

				log.debug("Repository fully initialized.");
				fullInit = true;
			}
			catch (MongoTimeoutException e) {
				log.error("********** Is the MongoDb or RDBMS Server reachable ? **********", e);
				throw e;
			}
		}
	}

	public void createIndexes() throws Exception {
		adminRunner.run((Session session) -> {

			String luceneIndexesDir = appProp.getAdminDataFolder() + File.separator + "luceneIndexes";

			/*
			 * If we are going to be rebuilding indexes, let's blow away the actual files also.
			 * Probably not required but definitely will be sure no outdated indexes can ever be
			 * used again!
			 */
			if (forceIndexRebuild) {
				FileUtils.deleteDirectory(new File(luceneIndexesDir));
			}

			FileTools.createDirectory(luceneIndexesDir);

			/* Create indexes to support timeline query (order by dates) */
			createIndex(session, "lastModified", true, false, JcrProp.LAST_MODIFIED, "Date", "nt:base");
			createIndex(session, "created", true, false, JcrProp.CREATED, "Date", "nt:base");

			/* Indexes for lookups involved in user registration and password changes */
			createIndex(session, "codeIndex", false, false, JcrProp.CODE, null, "nt:base");
			createIndex(session, "pwdResetAuthIndex", false, false, JcrProp.USER_PREF_PASSWORD_RESET_AUTHCODE, null, "nt:base");

			/* Index all properties of all nodes for fulltext search capability */
			createIndex(session, "fullText", false, true, null, null, "nt:base");
		});
	}

	/**
	 * Creates the index definition. This code is capable of creating property indexes that do
	 * sorting or searching for exact matches of properties OR else defining an index that does full
	 * text search on ALL properties.
	 * 
	 * For sorting capability to make "ORDER BY" queries work on the specified 'sortPropName',
	 * specify ordered=true, otherwise false.
	 * 
	 * If you have ordered=false, then you can specify fulltext=true, and it will configure for a
	 * fulltext index on ALL properties, so in that case the sortPropName can be null, and will be
	 * ignored.
	 * 
	 * You must specify one of ordered or fulltext as true but not both.
	 * 
	 * You can remove the 'persistence' and 'path' properties if you want the data stored in the
	 * repository rather than on the file system. This code currently uses file system so that
	 * forcing a rebuild of indexes is as simple as deleting the index folders and restarting the
	 * server. (i.e. deleting folders WHILE server is shutdown first) Indexes get rebuild when the
	 * server starts if the folders are missing.
	 */
	public void createIndex(Session session, String indexName, boolean ordered, boolean fulltext, String sortPropName, String sortPropType, String targetType)
			throws Exception {
		Node indexNode = JcrUtil.findNode(session, JcrConst.PATH_INDEX);
		Node indexDefNode = JcrUtil.safeFindNode(session, JcrConst.PATH_INDEX + "/" + indexName);
		if (indexDefNode != null) {
			if (forceIndexRebuild) {
				log.info("Forcing new index definition for " + indexName + " and overwriting previous definition");
				indexDefNode.remove();
			}
			else {
				log.info("Index definition for " + indexName + " exists. Not creating.");
				return;
			}
		}
		log.info("Creating index definition: " + indexName);

		indexDefNode = indexNode.addNode(indexName, "oak:QueryIndexDefinition");

		/* properties required for all indexes */
		indexDefNode.setProperty("compatVersion", 2);
		indexDefNode.setProperty("type", "lucene");
		indexDefNode.setProperty("async", "async");
		indexDefNode.setProperty("reindex", true);

		if (fulltext) {
			indexDefNode.setProperty(LuceneIndexConstants.EVALUATE_PATH_RESTRICTION, true);
		}

		/* using filesystem */
		indexDefNode.setProperty("persistence", "file");
		indexDefNode.setProperty("path", appProp.getAdminDataFolder() + File.separator + "luceneIndexes" + File.separator + indexName);

		Node indexRulesNode = indexDefNode.addNode("indexRules", "nt:unstructured");
		Node ntBaseNode = indexRulesNode.addNode(targetType);
		Node propertiesNode = ntBaseNode.addNode("properties", "nt:unstructured");

		Node propNode = propertiesNode.addNode(indexName);

		if (!fulltext) {
			propNode.setProperty("name", sortPropName);
			propNode.setProperty("propertyIndex", true);

			if (ordered) {
				propNode.setProperty("ordered", true);
			}

			if (sortPropType != null) {
				propNode.setProperty("type", sortPropType);
			}
		}
		else {
			enableFulltextIndex(propNode, null);
		}

		session.save();
	}

	private void enableFulltextIndex(Node propNode, String propertyName) throws Exception {
		propNode.setProperty(LuceneIndexConstants.PROP_NODE_SCOPE_INDEX, true);

		if (propertyName == null) {
			/* This codepath IS tested */
			propNode.setProperty(LuceneIndexConstants.PROP_NAME, LuceneIndexConstants.REGEX_ALL_PROPS);
			propNode.setProperty(LuceneIndexConstants.PROP_IS_REGEX, true);
		}
		else {
			/* WARNING: this codepath is untested */
			propNode.setProperty(LuceneIndexConstants.PROP_NAME, propertyName);
			propNode.setProperty(LuceneIndexConstants.PROP_IS_REGEX, false);
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
		AppServer.setShuttingDown(true);
		if (instance == null) return;

		synchronized (lock) {
			try {
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
