package com.meta64.mobile.lucene;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileSearcher {
	private static final Logger log = LoggerFactory.getLogger(FileSearcher.class);

	private FSDirectory fsDir;
	private DirectoryReader reader;
	private IndexSearcher searcher;

	public FileSearcher() {
		init();
	}

	private void init() {
		try {
			fsDir = FSDirectory.open(new File(LuceneUtils.LUCENE_DIR));
			reader = DirectoryReader.open(fsDir);
		}
		catch (final IOException e) {
			throw new RuntimeException(e);
		}
		searcher = new IndexSearcher(reader);
	}

	public void search(final String queryStr, final int maxHits) {
		searchIndex(queryStr, maxHits);
	}

	public Document findByFileName(String filePath, String fileName) throws Exception {
		BooleanQuery matchingQuery = new BooleanQuery();
		matchingQuery.add(new TermQuery(new Term("filepath", filePath)), Occur.SHOULD);
		matchingQuery.add(new TermQuery(new Term("filename", fileName)), Occur.SHOULD);

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
	private void searchIndex(final String queryStr, final int maxHits) {
		final long now = System.currentTimeMillis();

		final Query query = parseQuery(queryStr);
		final ScoreDoc[] hits = search(query, maxHits);

		log.info("Search took {} milli seconds...found {} documents matching the query: {}", System.currentTimeMillis() - now, hits.length, queryStr);

		printSearchResults(hits);
	}

	private Query parseQuery(final String queryStr) {
		Query query = null;
		try {
			query = LuceneUtils.getQueryParser().parse(queryStr);
		}
		catch (final ParseException e) {
			throw new RuntimeException(e);
		}
		return query;
	}

	private ScoreDoc[] search(final Query query, final int maxHits) {
		ScoreDoc[] hits = null;
		try {
			hits = searcher.search(query, null, maxHits).scoreDocs;
		}
		catch (final IOException e) {
			throw new RuntimeException(e);
		}
		return hits;
	}

	/**
	 * Log the search results
	 */
	private void printSearchResults(final ScoreDoc[] hits) {
		if (hits.length > 0) {
			log.info("Search results:");
			for (final ScoreDoc d : hits) {
				try {
					Document doc = searcher.doc(d.doc);
					log.info(doc.get("filepath"));
				}
				catch (final IOException e) {
					throw new RuntimeException(e);
				}
			}
		}
	}

	public void close() {
		closeIndexReader();
		closeFSDirectory();
	}

	/**
	 * close lucene index reader
	 */
	private void closeIndexReader() {
		if (reader != null) {
			log.info("closing lucene index reader...");
			try {
				reader.close();
			}
			catch (final IOException e) {
				throw new RuntimeException(e);
			}
		}
	}

	/**
	 * close fs directory index
	 */
	private void closeFSDirectory() {
		if (fsDir != null) {
			log.info("closing FSDirectory...");
			fsDir.close();
		}
	}
}
