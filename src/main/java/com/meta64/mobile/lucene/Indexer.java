package com.meta64.mobile.lucene;

public class Indexer {
	public static void main(final String[] args) {
		final String dirToIndex = "/home/clay/ferguson/knowledge";
		final String suffix = "txt";
		FileIndexer indexer = null;
		try {
			indexer = new FileIndexer();
			indexer.index(dirToIndex, suffix);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			if (indexer != null) {
				indexer.close();
			}
		}
	}
}