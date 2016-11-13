package com.meta64.mobile.lucene;

public class Searcher {
	public static void main(final String[] args) {
		final String query = "coolant";
		final int hits = 100;

		FileSearcher searcher = new FileSearcher();
		try {
			searcher.search(query, hits);
		}
		finally {
			if (searcher != null) {
				searcher.close();
			}
		}
	}
}