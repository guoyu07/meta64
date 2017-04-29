package com.meta64.mobile.service;

import java.io.File;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meta64.mobile.model.FileSearchResult;
import com.meta64.mobile.request.BrowseFolderRequest;
import com.meta64.mobile.response.BrowseFolderResponse;
import com.meta64.mobile.util.FileLister;
import com.meta64.mobile.util.IFileListingCallback;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service methods for File System related functions.
 */
@Component
public class FileSystemService {
	private static final Logger log = LoggerFactory.getLogger(FileSystemService.class);

	private static final ObjectMapper jsonMapper = new ObjectMapper();

	public void browseFolder(Session session, BrowseFolderRequest req, BrowseFolderResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		FileLister lister = new FileLister(false, true, true);
		Node folderNode = JcrUtil.findNode(session, req.getNodeId());
		String folderName = JcrUtil.getRequiredStringProp(folderNode, "meta64:path");

		List<FileSearchResult> results = new LinkedList<FileSearchResult>();

		class FileListingCallback implements IFileListingCallback {
			@Override
			public void update(File f) {
				// log.debug("FILE: " + f);
				FileSearchResult fsr = new FileSearchResult();
				try {
					fsr.setFileName(f.getCanonicalPath());
				}
				catch (IOException e) {
					fsr.setFileName("[error]");
				}
				results.add(fsr);
			}
		}

		FileListingCallback callback = new FileListingCallback();
		lister.setCallback(callback);
		lister.list(folderName);

		try {
			String json = jsonMapper.writeValueAsString(results);
			// log.debug("RESULT STRING: " + json);

			folderNode.setProperty("meta64:json", json);
			JcrUtil.timestampNewNode(session, folderNode);
			session.save();
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}
}
