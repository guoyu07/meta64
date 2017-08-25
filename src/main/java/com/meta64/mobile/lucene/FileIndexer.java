package com.meta64.mobile.lucene;

import org.springframework.stereotype.Component;

/**
 * Recursively scans all files in a folder (and subfolders) and indexes them into Lucene
 */
@Component
public class FileIndexer {
	// private final static SimpleDateFormat DATE_FORMATTER = new SimpleDateFormat("MM/dd/yyyy
	// HH:mm:ss");
	// private static final Logger log = LoggerFactory.getLogger(FileIndexer.class);
	//
	// @Autowired
	// private AppProp appProp;
	//
	// private IndexWriter writer;
	// private FSDirectory fsDir;
	//
	// /* This searcher is used for searching to avoid duplicates before each insert */
	// @Autowired
	// private FileSearcher searcher;
	//
	// private boolean initialized = false;
	//
	// public void index(final String dirToIndex, final String suffix) {
	// init();
	// final long now = System.currentTimeMillis();
	//
	// log.info("Indexing directory: " + dirToIndex);
	// indexDirectory(new File(dirToIndex), suffix);
	//
	// log.info("Indexing completed in {} milliseconds.", System.currentTimeMillis() - now);
	// }
	//
	// private void init() {
	// if (initialized) return;
	// initialized = true;
	// if (StringUtils.isEmpty(appProp.getLuceneDir())) {
	// throw ExUtil.newEx("Lucend Data Dir is not configured.");
	// }
	//
	// try {
	// fsDir = FSDirectory.open(new File(appProp.getLuceneDir()));
	// writer = new IndexWriter(fsDir, FileSearcher.config);
	// }
	// catch (IOException e) {
	// throw ExUtil.newEx(e);
	// }
	// }
	//
	// /**
	// * Method to index a directory recursively.
	// */
	// private void indexDirectory(final File dataDir, final String suffix) {
	// final File[] files = dataDir.listFiles();
	// for (final File f : files) {
	// if (f.isDirectory()) {
	// indexDirectory(f, suffix);
	// }
	// else {
	// indexFile(f, suffix);
	// }
	// }
	// }
	//
	// /**
	// * Index a file by creating a Document and adding fields
	// */
	// private void indexFile(final File f, final String suffix) {
	// if (f.length() > 2 * 1024 * 1024 || f.isHidden() || f.isDirectory() || !f.canRead() ||
	// !f.exists() || //
	// (suffix != null && !f.getName().endsWith(suffix))) {
	// return;
	// }
	//
	// index(f);
	// }
	//
	// private void index(final File file) {
	// try {
	// boolean deletedExisting = false;
	// final Path paths = Paths.get(file.getCanonicalPath());
	// final BasicFileAttributes attr = Files.readAttributes(paths, BasicFileAttributes.class);
	//
	// final String lastModified = getAttrVal(attr, FileProperties.MODIFIED);
	// final String path = file.getCanonicalPath();
	// final String name = file.getName();
	//
	// /*
	// * If a searcher is provided it means we need to use it to avoid if we already have this
	// * file added with an identical timestamp.
	// */
	// if (searcher != null) {
	// Document docFound = searcher.findByFileName(path);
	// if (docFound != null) {
	// /*
	// * If our index has this document with same lastModified time, then return
	// * because the index is up to date, and there's nothing we need to do
	// */
	// if (lastModified.equals(docFound.get("lastModified"))) {
	// log.info("NO CHANGE. file: {}", file.getCanonicalPath());
	// return;
	// }
	// /*
	// * If we found this doc, and it's out of date, we delete the old doc and re-add
	// * below
	// */
	// else {
	// deletedExisting = true;
	// writer.deleteDocuments(new Term("filepath", path));
	// }
	// }
	// }
	//
	// final String created = getAttrVal(attr, FileProperties.CREATED);
	// final String size = String.valueOf(attr.size());
	// final String content = FileUtils.readFileToString(file);
	//
	// final UserPrincipal owner = Files.getOwner(paths);
	// final String username = owner.getName();
	//
	// Document newDoc = newLuceneDoc(content, path, name, username, lastModified, size, created,
	// getDocType(file));
	// writer.addDocument(newDoc);
	//
	// if (deletedExisting) {
	// log.info("UPDATED file: {}", file.getCanonicalPath());
	// }
	// else {
	// log.info("ADDED file: {}", file.getCanonicalPath());
	// }
	// }
	// catch (final Exception e) {
	// log.error("Failed indexing file", e);
	// }
	// }
	//
	// /**
	// * Get date attributes
	// */
	// public static String getAttrVal(final BasicFileAttributes attr, final FileProperties prop) {
	// switch (prop) {
	// case MODIFIED:
	// return DATE_FORMATTER.format((attr.lastModifiedTime().toMillis()));
	// case CREATED:
	// return DATE_FORMATTER.format((attr.creationTime().toMillis()));
	// default:
	// throw new IllegalArgumentException(prop.toString() + "is not supported.");
	// }
	// }
	//
	// /**
	// * Get document type
	// */
	// public static String getDocType(final File f) {
	// final int start = f.getName().lastIndexOf(".");
	// if (start == -1) return "";
	// return f.getName().substring(start + 1);
	// }
	//
	// /**
	// * Create lucene document from file attributes
	// */
	// public static Document newLuceneDoc(final String content, final String path, final String
	// name, final String username, final String modified, final String size,
	// final String created, final String docType) {
	// final Document doc = new Document();
	// doc.add(new Field("contents", content, TextField.TYPE_NOT_STORED));
	// doc.add(new StringField("filepath", path, Field.Store.YES));
	// doc.add(new StringField("author", username, Field.Store.YES));
	// doc.add(new StringField("lastModified", modified, Field.Store.YES));
	// doc.add(new StringField("size", size, Field.Store.YES));
	// doc.add(new StringField("created", created, Field.Store.YES));
	// doc.add(new StringField("doctype", docType, Field.Store.YES));
	//
	// return doc;
	// }
	//
	// @PreDestroy
	// public void close() {
	// closeSearcher();
	// closeIndexWriter();
	// closeFSDirectory();
	// }
	//
	// private void closeSearcher() {
	// if (searcher != null) {
	// searcher.close();
	// searcher = null;
	// }
	// }
	//
	// private void closeIndexWriter() {
	// if (writer != null) {
	// log.info("Shutting down index writer");
	// try {
	// writer.close();
	// writer = null;
	// }
	// catch (final Exception e) {
	// log.error("Failed closing writer", e);
	// }
	// }
	// }
	//
	// private void closeFSDirectory() {
	// if (fsDir != null) {
	// log.info("closing FSDirectory");
	// fsDir.close();
	// fsDir = null;
	// }
	// }
}
