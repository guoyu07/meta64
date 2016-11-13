package com.meta64.mobile.lucene;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.meta64.mobile.config.AppFilter;

public class FileIndexer {
	private static final Logger log = LoggerFactory.getLogger(FileIndexer.class);

	private IndexWriter iWriter;
	private FSDirectory fsDir;

	public FileIndexer() throws Exception {
		init();
	}

	private void init() throws Exception {
		fsDir = FSDirectory.open(new File(LuceneUtils.LUCENE_DIR));
		iWriter = new IndexWriter(fsDir, LuceneUtils.CONFIG);
	}

	public void index(final String dirToIndex, final String suffix) {
		final long now = System.currentTimeMillis();

		indexDirectory(new File(dirToIndex), suffix);

		log.info("Indexed {} files in {} milli seconds.", iWriter.maxDoc(), System.currentTimeMillis() - now);
	}

	/**
	 * Method to index a directory recursively.
	 */
	private void indexDirectory(final File dataDir, final String suffix) {
		final File[] files = dataDir.listFiles();
		for (final File f : files) {
			if (f.isDirectory()) {
				indexDirectory(f, suffix);
			}
			else {
				indexFile(f, suffix);
			}
		}
	}

	/**
	 * Index a file by creating a Document and adding fields
	 */
	private void indexFile(final File f, final String suffix) {
		if (f.isHidden() || f.isDirectory() || !f.canRead() || !f.exists() || (suffix != null && !f.getName().endsWith(suffix))) {
			return;
		}

		index(f);
	}

	private void index(final File f) {
		try {
			log.info("Indexing file: {}", f.getCanonicalPath());
			final Document doc = DocumentUtil.fileToLuceneDoc(f);
			iWriter.addDocument(doc);
		}
		catch (final IOException e) {
			throw new RuntimeException(e);
		}
	}

	public void close() {
		closeIndexWriter();
		closeFSDirectory();
	}

	/**
	 * close index writer
	 */
	private void closeIndexWriter() {
		if (iWriter != null) {
			log.info("Shutting down index writer...");
			try {
				iWriter.close();
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
