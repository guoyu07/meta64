package com.meta64.mobile.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SpringContextUtil;

/**
 * Reads the special proprietary-formatted file of the book 'War and Peace' to load into the
 * repository, because we use this book as sample/example content.
 */
@Component
@Scope("prototype")
public class ImportWarAndPeace {
	private static final Logger log = LoggerFactory.getLogger(ImportWarAndPeace.class);

	private int maxLines = Integer.MAX_VALUE;
	private int maxBooks = Integer.MAX_VALUE;

	private boolean debug = false;
	private Node root;
	private Node curBook;
	private Node curChapter;

	StringBuilder paragraph = new StringBuilder();

	private int globalBook = 0;
	private int globalChapter = 0;
	private int globalVerse = 0;
	private boolean halt;
	private Session session;

	public void importBook(Session session, String resourceName, Node root, int maxBooks) {
		try {
			this.root = root;
			this.session = session;
			this.maxBooks = maxBooks;
			Resource resource = SpringContextUtil.getApplicationContext().getResource(resourceName);
			InputStream is = resource.getInputStream();
			BufferedReader in = new BufferedReader(new InputStreamReader(is));

			try {
				String line;
				int lineCount = 0;

				while (!halt && (line = in.readLine()) != null) {
					line = line.trim();

					/*
					 * if we see a blank line we add the current paragraph text as a node and
					 * continue
					 */
					if (line.length() == 0) {
						if (paragraph.length() > 0) {
							addParagraph();
						}
						continue;
					}

					if (debug) {
						log.debug("INPUT: " + line);
					}

					/*
					 * if we processed the chapter, the last paragraph is also added before starting
					 * the new chapter
					 */
					if (processChapter(line)) {
						continue;
					}

					/*
					 * if we processed the book, the last paragraph is also added before starting
					 * the new book
					 */
					if (processBook(line)) {
						continue;
					}
					if (globalBook > maxBooks) break;

					/* keep appending each line to the current paragraph */
					if (paragraph.length() > 0) {
						paragraph.append(" ");
					}
					paragraph.append(line);

					if (++lineCount > maxLines) break;
				}
			}
			finally {
				StreamUtil.close(in);
			}
			log.debug("book import successful.");
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private boolean processChapter(String line) {
		try {
			if (line.startsWith("CHAPTER ")) {
				globalChapter++;
				log.debug("Processing Chapter: " + line);
				if (curBook == null) throw ExUtil.newEx("book is null.");

				addParagraph();

				curChapter = curBook.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				curChapter.setProperty(JcrProp.CONTENT, "C" + String.valueOf(globalChapter) + ". " + line);
				JcrUtil.timestampNewNode(session, curChapter);
				return true;
			}

			return false;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private boolean addParagraph() {
		try {
			String line = paragraph.toString();

			/*
			 * remove any places where my algorithm stuffed an extra space that just happened to be
			 * at a sentence end
			 */
			line = line.replace(".   ", ".  ");

			if (line.length() == 0) return false;
			if (curChapter == null || curBook == null) return false;
			globalVerse++;

			// line = XString.injectForQuotations(line);

			Node paraNode = curChapter.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
			paraNode.setProperty(JcrProp.CONTENT, "VS" + globalVerse + ". " + line);
			JcrUtil.timestampNewNode(session, paraNode);
			paragraph.setLength(0);
			return true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private boolean anyEpilogue(String line) {
		return line.startsWith("FIRST EPILOGUE") || //
				line.startsWith("SECOND EPILOGUE") || //
				line.startsWith("THIRD EPILOGUE") || //
				line.startsWith("FOURTH EPILOGUE");
	}

	private boolean processBook(String line) {
		try {
			if (line.startsWith("BOOK ") || anyEpilogue(line)) {
				globalBook++;
				if (globalBook > maxBooks) return false;
				addParagraph();

				curBook = root.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				curBook.setProperty(JcrProp.CONTENT, "B" + String.valueOf(globalBook) + ". " + line);
				JcrUtil.timestampNewNode(session, curBook);
				return true;
			}
			return false;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}
}
