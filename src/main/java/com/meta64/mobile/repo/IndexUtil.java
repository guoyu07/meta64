package com.meta64.mobile.repo;

import java.io.File;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.io.FileUtils;
import org.apache.jackrabbit.oak.plugins.index.lucene.LuceneIndexConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.FileTools;
import com.meta64.mobile.util.JcrConst;
import com.meta64.mobile.util.JcrUtil;

/**
 * Utilities to perform index management of the JCR Repository
 *
 */
@Component
public class IndexUtil {
	private static final Logger log = LoggerFactory.getLogger(IndexUtil.class);

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private AppProp appProp;

	public void createIndexes() {
		adminRunner.run((Session session) -> {

			String luceneIndexesDir = appProp.getAdminDataFolder() + File.separator + "luceneIndexes";

			/*
			 * If we are going to be rebuilding indexes, let's blow away the actual files also.
			 * Probably not required but definitely will be sure no outdated indexes can ever be
			 * used again!
			 */
			if (appProp.isForceIndexRebuild()) {
				try {
					FileUtils.deleteDirectory(new File(luceneIndexesDir));
				}
				catch (Exception e) {
					throw ExUtil.newEx(e);
				}
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
	 * repository rather than on the file system.
	 * 
	 * NOTE: To force a rebuild of the indexes, set forceIndexRebuid to 'true' in the properties
	 * file, and restart the server.
	 */
	public void createIndex(Session session, String indexName, boolean ordered, boolean fulltext, String sortPropName, String sortPropType, String targetType) {
		Node indexNode = JcrUtil.findNode(session, JcrConst.PATH_INDEX);
		Node indexDefNode = JcrUtil.safeFindNode(session, JcrConst.PATH_INDEX + "/" + indexName);
		if (indexDefNode != null) {
			if (appProp.isForceIndexRebuild()) {
				log.info("Forcing new index definition for " + indexName + " and overwriting previous definition");
				try {
					indexDefNode.remove();
				}
				catch (Exception e) {
					throw ExUtil.newEx(e);
				}
			}
			else {
				log.info("Index definition for " + indexName + " exists. Not creating.");
				return;
			}
		}
		log.info("Creating index definition: " + indexName);

		try {
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

			JcrUtil.save(session);
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	private void enableFulltextIndex(Node propNode, String propertyName) {
		try {
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
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}
}
