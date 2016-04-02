package com.meta64.mobile.repo;

import static com.google.common.collect.Lists.newArrayList;
import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PreDestroy;
import javax.jcr.Node;
import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;

import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.jcr.repository.RepositoryImpl;
import org.apache.jackrabbit.oak.plugins.document.DocumentMK;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeState;
import org.apache.jackrabbit.oak.plugins.document.DocumentNodeStore;
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
import org.springframework.context.annotation.Scope;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.google.common.collect.ImmutableMap;
import com.meta64.mobile.AppServer;
import com.meta64.mobile.config.JcrName;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SpringContextUtil;
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
 * NOTE: Even inside this class always use getRepository() to ensure that the
 * init() has been called.
 */
@Component
@Scope("singleton")
public class OakRepository {

	private static final Logger log = LoggerFactory.getLogger(OakRepository.class);

	@Value("${indexingEnabled}")
	private boolean indexingEnabled;

	private LuceneIndexProvider indexProvider;
	private DocumentNodeStore nodeStore;
	private DocumentNodeState root;
	private ExecutorService executor;
	private Oak oak;
	private Jcr jcr;
	private Repository repository;
	private ConfigurationParameters securityParams;
	private SecurityProvider securityProvider;
	private DB db;

	/*
	 * Because of the criticality of this variable, I am not using the Spring
	 * getter to get it, but just using a private static. It's slightly safer
	 * and better for the purpose of cleanup in the shutdown hook which is all
	 * it's used for.
	 */
	private static OakRepository instance;

	/*
	 * We only need this lock to protect against startup and/or shutdown
	 * concurrency. Remember during debugging, etc the server process can be
	 * shutdown (CTRL-C) even while it's in the startup phase.
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

	/*
	 * JCR Info
	 */
	@Value("${jcrAdminUserName}")
	private String jcrAdminUserName;

	@Value("${jcrAdminPassword}")
	private String jcrAdminPassword;

	@Value("${anonUserLandingPageNode}")
	private String userLandingPageNode;

	@Autowired
	private RunAsJcrAdmin adminRunner;

	public OakRepository() {
		instance = this;

		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				/*
				 * I know this tight coupling is going to be upsetting to some
				 * developers, but this is a good design despite that. I don't
				 * want a complex PUB/SUB or indirection to get in the way of
				 * this working perfectly and being dead simple!
				 */
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
			Node landingPageNode = JcrUtil.ensureNodeExists(session, "/", userLandingPageNode, null);
			initLandingPage(session, landingPageNode);

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

	private void init() throws Exception {
		if (initialized)
			return;

		synchronized (lock) {
			if (initialized)
				return;

			try {
				db = new MongoClient(mongoDbHost, mongoDbPort).getDB(mongoDbName);
				nodeStore = new DocumentMK.Builder().setMongoDB(db).getNodeStore();

				root = nodeStore.getRoot();

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown())
					return;

				executor = Oak.defaultExecutorService();
				oak = new Oak(nodeStore);
				oak = oak.with(executor);

				jcr = new Jcr(oak);
				jcr = jcr.with(getSecurityProvider());

				if (indexingEnabled) {
					/*
					 * WARNING: Not all valid SQL will work with these lucene
					 * queries. Namely the contains() method fails so always use
					 * '=' operator for exact string matches or LIKE
					 * %something%, instead of using the contains method.
					 */
					indexProvider = new LuceneIndexProvider();
					indexProvider = indexProvider.with(getNodeAggregator());
					jcr = jcr.with(new LuceneFullTextInitializer("contentIndex", "jcr:content"));
					jcr = jcr.with(new LuceneFullTextInitializer("tagsIndex", "tags"));
					jcr = jcr.with(new LuceneSortInitializer("lastModifiedIndex", "jcr:lastModified"));
					jcr = jcr.with(new LuceneSortInitializer("codeIndex", "code"));
					jcr = jcr.with((QueryIndexProvider) indexProvider);
					jcr = jcr.with((Observer) indexProvider);
					jcr = jcr.with(new LuceneIndexEditorProvider());
					jcr = jcr.withAsyncIndexing();
				}

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown())
					return;

				repository = jcr.createRepository();

				log.debug("MongoDb connection ok.");

				/* can shutdown during startup. */
				if (AppServer.isShuttingDown())
					return;

				/*
				 * IMPORTANT: Do not move this line below this point. An
				 * infinite loop of re-entry can occur into this method because
				 * of calls to getRepository() always doing an init.
				 */
				initialized = true;

				UserManagerUtil.verifyAdminAccountReady(this);
				initRequiredNodes();

				log.debug("Repository fully initialized.");
			} catch (MongoTimeoutException e) {
				log.error("********** Did you forget to start MongoDb Server? **********", e);
				throw e;
			}
		}
	}

	private void initLandingPage(Session session, Node node) {
		try {
			Resource resource = SpringContextUtil.getApplicationContext()
					.getResource("classpath:/static/landing-page.md");
			String content = XString.loadResourceIntoString(resource);
			node.setProperty(JcrProp.CONTENT, content);
			AccessControlUtil.makeNodePublic(session, node);
			node.setProperty(JcrProp.DISABLE_INSERT, "y");
			session.save();
		} catch (Exception e) {
			// IMPORTANT: don't rethrow from here, or this could blow up app
			// initialization.
			e.printStackTrace();
		}
	}

	/*
	 * I don't fully understand what this aggregator is for. Need to research
	 * this some.
	 */
	private static NodeAggregator getNodeAggregator() {
		return new SimpleNodeAggregator().newRuleWithName(JcrConstants.NT_UNSTRUCTURED, //
				newArrayList(JCR_CONTENT, JCR_CONTENT + "/*"));
	}

	private SecurityProvider getSecurityProvider() {
		Map<String, Object> userParams = new HashMap<String, Object>();
		userParams.put(UserConstants.PARAM_ADMIN_ID, "admin");
		userParams.put(UserConstants.PARAM_OMIT_ADMIN_PW, false);

		securityParams = ConfigurationParameters
				.of(ImmutableMap.of(UserConfiguration.NAME, ConfigurationParameters.of(userParams)));
		securityProvider = new SecurityProviderImpl(securityParams);
		return securityProvider;
	}

	public void close() {
		synchronized (lock) {

			if (executor != null) {
				log.debug("Shutting down Oak Executor");
				executor.shutdown();

				log.debug("Awaiting executor shutdown");
				try {
					executor.awaitTermination(5, TimeUnit.MINUTES);
					log.debug("Executor shutdown completed ok.");
				} catch (InterruptedException ex) {
					log.error("Executor failed to shutdown gracefully.", ex);
				}

				executor = null;
			}

			if (nodeStore != null) {
				log.debug("disposing nodeStore.");
				nodeStore.dispose();
				nodeStore = null;
			}

			if (indexProvider != null) {
				log.debug("Closing indexProvider.");
				indexProvider.close();
				indexProvider = null;
			}

			if (repository != null) {
				log.debug("Shutting down repository.");
				((RepositoryImpl) repository).shutdown();
				repository = null;
			}

			if (db != null) {
				if (db.getMongo() != null) {
					db.getMongo().close();
				}
				db = null;
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
}
