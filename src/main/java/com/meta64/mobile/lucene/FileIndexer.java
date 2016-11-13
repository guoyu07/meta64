package com.meta64.mobile.lucene;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.UserPrincipal;

import org.apache.commons.io.FileUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileIndexer {
	private static final Logger log = LoggerFactory.getLogger(FileIndexer.class);

	/*
	 * todo-0: I saw online someone said the lass IndexModifier is better because it combines being
	 * a reader and a writer into one class. Check if using that is better.
	 */

	private IndexWriter writer;
	private FSDirectory fsDir;

	/* This searcher is used for searching to avoid duplicates before each insert */
	private FileSearcher searcher;

	public FileIndexer() throws Exception {
		init();
	}

	private void init() throws Exception {
		fsDir = FSDirectory.open(new File(LuceneUtils.LUCENE_DIR));
		writer = new IndexWriter(fsDir, LuceneUtils.CONFIG);

		File luceneDir = new File(LuceneUtils.LUCENE_DIR);
		if (luceneDir.exists()) {
			searcher = new FileSearcher();
		}
	}

	public void index(final String dirToIndex, final String suffix) {
		final long now = System.currentTimeMillis();

		indexDirectory(new File(dirToIndex), suffix);

		log.info("Indexed {} files in {} milli seconds.", writer.maxDoc(), System.currentTimeMillis() - now);
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

	private void index(final File file) {
		try {
			final Path paths = Paths.get(file.getCanonicalPath());
			final BasicFileAttributes attr = Files.readAttributes(paths, BasicFileAttributes.class);

			final String lastModified = DocumentUtil.getAttrVal(attr, FileProperties.MODIFIED);
			final String path = file.getCanonicalPath();
			final String name = file.getName();

			/*
			 * If a searcher is provided it means we need to use it to avoid if we already have this
			 * file added with an identical timestamp.
			 */
			if (searcher != null) {
				Document docFound = searcher.findByFileName(path, name);
				if (docFound != null) {
					/*
					 * If our index has this document with same lastModified time, then return
					 * because the index is up to date, and there's nothing we need to do
					 */
					if (lastModified.equals(docFound.get("lastModified"))) {
						log.info("NO CHANGE. file: {}", file.getCanonicalPath());
						return;
					}
					/*
					 * If we found this doc, and it's out of date, we delete the old doc and re-add
					 * below
					 */
					else {
						log.info("REMOVING EXISTING. file: {}", file.getCanonicalPath());
						//&&& This is not done yet.
					}
				}
			}

			final String created = DocumentUtil.getAttrVal(attr, FileProperties.CREATED);
			final String size = String.valueOf(attr.size());
			final String content = FileUtils.readFileToString(file);

			final UserPrincipal owner = Files.getOwner(paths);
			final String username = owner.getName();

			Document newDoc = DocumentUtil.newLuceneDoc(content, path, name, username, lastModified, size, created, DocumentUtil.getDocType(file));

			log.info("ADDED file: {}", file.getCanonicalPath());
			writer.addDocument(newDoc);

		}
		catch (final Exception e) {
			log.error("Failed indexing file", e);
		}
	}

	public void close() {
		if (searcher != null) {
			searcher.close();
			searcher = null;
		}
		closeIndexWriter();
		closeFSDirectory();
	}

	/**
	 * close index writer
	 */
	private void closeIndexWriter() {
		if (writer != null) {
			log.info("Shutting down index writer");
			try {
				writer.close();
				writer = null;
			}
			catch (final Exception e) {
				log.error("Failed closing writer", e);
			}
		}
	}

	/**
	 * close fs directory index
	 */
	private void closeFSDirectory() {
		if (fsDir != null) {
			log.info("closing FSDirectory");
			fsDir.close();
			fsDir = null;
		}
	}
}
