package com.meta64.mobile.lucene;

public class Searcher {
	public static void main(final String[] args) {
		final String query = "coolant";
		final int hits = 100;

		final FileSearcher searcher = new FileSearcher();
		searcher.search(query, hits);
		searcher.close();
	}
}