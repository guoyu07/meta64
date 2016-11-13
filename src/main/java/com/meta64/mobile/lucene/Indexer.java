package com.meta64.mobile.lucene;

public class Indexer {
	public static void main(final String[] args) {
		final String dirToIndex = "/home/clay/ferguson/knowledge";
		final String suffix = "txt";

		try {
			final FileIndexer indexer = new FileIndexer();
			indexer.index(dirToIndex, suffix);
			indexer.close();
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}