package com.meta64.mobile.lucene;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.UserPrincipal;
import java.text.SimpleDateFormat;

import org.apache.commons.io.FileUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;

public class DocumentUtil {
	private final static SimpleDateFormat DATE_FORMATTER = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

	/**
	 * Create lucene document from file attributes
	 */
	public static Document newLuceneDoc(final String content, final String path, final String name, final String username, final String modified, final String size,
			final String created, final String docType) {
		final Document doc = new Document();
		doc.add(new Field("contents", content, TextField.TYPE_NOT_STORED));
		doc.add(new StringField("filepath", path, Field.Store.YES));
		doc.add(new StringField("filename", name, Field.Store.YES));
		doc.add(new StringField("author", username, Field.Store.YES));
		doc.add(new StringField("lastModified", modified, Field.Store.YES));
		doc.add(new StringField("size", size, Field.Store.YES));
		doc.add(new StringField("created", created, Field.Store.YES));
		doc.add(new StringField("doctype", docType, Field.Store.YES));

		return doc;
	}

	/**
	 * Get date attributes
	 */
	public static String getAttrVal(final BasicFileAttributes attr, final FileProperties prop) {
		switch (prop) {
		case MODIFIED:
			return DATE_FORMATTER.format((attr.lastModifiedTime().toMillis()));
		case CREATED:
			return DATE_FORMATTER.format((attr.creationTime().toMillis()));
		default:
			throw new IllegalArgumentException(prop.toString() + "is not supported.");
		}
	}

	/**
	 * Get document type
	 */
	public static String getDocType(final File f) {
		final int start = f.getName().lastIndexOf(".");
		return f.getName().substring(start + 1);
	}
}
