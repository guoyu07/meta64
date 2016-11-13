package com.meta64.mobile.lucene;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileSearcher {
	private static final Logger log = LoggerFactory.getLogger(FileSearcher.class);

	/** lucene version */
	private static final Version VERSION = Version.LUCENE_47;
	
	private FSDirectory fsDir;
	private DirectoryReader reader;
	private IndexSearcher searcher;
	
	public static final IndexWriterConfig CONFIG = new IndexWriterConfig(VERSION, new StandardAnalyzer(VERSION));

	private static final QueryParser PARSER = new QueryParser(VERSION, "contents", new StandardAnalyzer(VERSION));

	/** lucene directory */
	public static final String LUCENE_DIR = "/home/clay/ferguson/lucene-index";
	
	public FileSearcher() throws Exception {
		init();
	}

	private void init() throws Exception {
		fsDir = FSDirectory.open(new File(LUCENE_DIR));
		reader = DirectoryReader.open(fsDir);
		searcher = new IndexSearcher(reader);
	}

	public Document findByFileName(String filePath) throws Exception {
		BooleanQuery matchingQuery = new BooleanQuery();

		// todo-0: do we really need the 'SHOULD' there. Is that simplest way ?
		matchingQuery.add(new TermQuery(new Term("filepath", filePath)), Occur.SHOULD);
		TopDocs topDocs = searcher.search(matchingQuery, 1);

		if (topDocs.totalHits > 0) {
			for (final ScoreDoc d : topDocs.scoreDocs) {
				Document doc = searcher.doc(d.doc);
				return doc;
			}
		}
		return null;
	}

	/**
	 * Search the index for given query and return only specified hits.
	 */
	public void search(final String queryStr, final int maxHits) throws Exception {
		final long now = System.currentTimeMillis();

		final Query query = PARSER.parse(queryStr);
		final ScoreDoc[] hits = searcher.search(query, null, maxHits).scoreDocs;

		log.info("Search took {} milli seconds...found {} documents matching the query: {}", System.currentTimeMillis() - now, hits.length, queryStr);

		printSearchResults(hits);
	}

	/**
	 * Log the search results
	 */
	private void printSearchResults(final ScoreDoc[] hits) throws Exception {
		if (hits.length > 0) {
			log.info("Search results:");
			for (final ScoreDoc d : hits) {
				Document doc = searcher.doc(d.doc);
				log.info(doc.get("filepath"));
			}
		}
	}

	public void close() {
		closeIndexReader();
		closeFSDirectory();
	}

	private void closeIndexReader() {
		if (reader != null) {
			log.info("closing lucene index reader");
			try {
				reader.close();
			}
			catch (final IOException e) {
				throw new RuntimeException(e);
			}
		}
	}

	private void closeFSDirectory() {
		if (fsDir != null) {
			log.info("closing FSDirectory");
			fsDir.close();
		}
	}
}
