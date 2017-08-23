package com.meta64.mobile.mongo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.WriteResultChecking;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;

/* 
 * todo-0: thgere are two places i'm specifying basePackages here. Are both required ?
 */

@Configuration
@EnableMongoRepositories(basePackages = "com.meta64.mobile.mongo")
public class MongoAppConfig extends AbstractMongoConfiguration {
	private static final Logger log = LoggerFactory.getLogger(MongoAppConfig.class);

	private String mongoUser = "admin";
	private String databaseName = "database";
	private String mongoPass = "mega_monster_mongo";
	private String mongoHost = "127.0.0.1";
	private int mongoPort = 27017;
	private MongoClient mongoClient;

	@Bean
	public MongoDbFactory mongoDbFactory() throws Exception {
		SimpleMongoDbFactory simpleMongoDbFactory = new SimpleMongoDbFactory(getMongoClient(), databaseName);
		return simpleMongoDbFactory;
	}

	@Bean
	public MongoEventListener userCascadingMongoEventListener() {
	    return new MongoEventListener();
	}
	
	private MongoClient getMongoClient() {
		// Mongo Client
		if (mongoClient == null) {

			// todo-0: to make credentials work we need to CREATE the user, after first checking to
			// see if it exists already. skipping for now.

			// Set credentials
			// MongoCredential credential = MongoCredential.createCredential(mongoUser,
			// databaseName, mongoPass.toCharArray());
			// ServerAddress serverAddress = new ServerAddress(mongoHost, mongoPort);

			// mongoClient = new MongoClient(serverAddress, Arrays.asList(credential));
			mongoClient = new MongoClient();
		}
		return mongoClient;
	}

	/**
	 * MongoTemplate is thread-safe and can be reused everywhere in all threads.
	 */
	@Bean
	public MongoTemplate mongoTemplate() throws Exception {
		MongoTemplate mt = new MongoTemplate(mongoDbFactory());
		mt.setWriteResultChecking(WriteResultChecking.EXCEPTION);
		return mt;
	}

	@Override
	protected String getDatabaseName() {
		return databaseName;
	}

	@Override
	public MongoClient mongo() throws Exception {
		return getMongoClient();
	}

	@Override
	protected String getMappingBasePackage() {
		return "com.meta64.mobile.mongo";
	}
	
	@Bean
	public GridFsTemplate gridFsTemplate() throws Exception {
	    return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
	}
}
