package com.meta64.mobile.lucene;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.util.Version;

public class LuceneUtils {
	/** lucene version */
	private static final Version VERSION = Version.LUCENE_47;

	/** lucene index config */
	public static final IndexWriterConfig CONFIG = new IndexWriterConfig(VERSION, new StandardAnalyzer(VERSION));

	/** lucene index config */
	private static final QueryParser PARSER = new QueryParser(VERSION, "contents", new StandardAnalyzer(VERSION));

	/** lucene directory */
	public static final String LUCENE_DIR = "/home/clay/ferguson/lucene-index";

	public static QueryParser getQueryParser() {
		return PARSER;
	}
}