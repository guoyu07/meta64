package com.meta64.mobile.lucene;

public class Searcher {
	public static void main(final String[] args) {
		final String query = "coolant";
		final int hits = 100;

		FileSearcher searcher = null;
		try {
			searcher = new FileSearcher();
			searcher.search(query, hits);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			if (searcher != null) {
				searcher.close();
			}
		}
	}
}