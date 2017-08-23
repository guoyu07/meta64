package com.meta64.mobile.service;

import org.springframework.stereotype.Component;

/**
 * Service methods for File System related functions.
 * <p>
 * Very much an experimental work in progress, and not part of any features that are yet ready to be
 * used.
 */
@Component
public class FileSystemService {
//	private static final Logger log = LoggerFactory.getLogger(FileSystemService.class);
//
//	private static final ObjectMapper jsonMapper = new ObjectMapper();
//
//	public void browseFolder(Session session, BrowseFolderRequest req, BrowseFolderResponse res) {
//		if (session == null) {
//			session = ThreadLocals.getJcrSession();
//		}
//
//		FileLister lister = new FileLister(false, true, true);
//		Node folderNode = JcrUtil.findNode(session, req.getNodeId());
//		String folderName = JcrUtil.getRequiredStringProp(folderNode, "meta64:path");
//
//		List<FileSearchResult> results = new LinkedList<FileSearchResult>();
//
//		class FileListingCallback implements IFileListingCallback {
//			@Override
//			public void update(File f) {
//				// log.debug("FILE: " + f);
//				FileSearchResult fsr = new FileSearchResult();
//				try {
//					fsr.setFileName(f.getCanonicalPath());
//				}
//				catch (IOException e) {
//					fsr.setFileName("[error]");
//				}
//				results.add(fsr);
//			}
//		}
//
//		FileListingCallback callback = new FileListingCallback();
//		lister.setCallback(callback);
//		lister.list(folderName);
//
//		try {
//			String json = jsonMapper.writeValueAsString(results);
//			// log.debug("RESULT STRING: " + json);
//
//			folderNode.setProperty("meta64:json", json);
//			JcrUtil.timestampNewNode(session, folderNode);
//			JcrUtil.save(session);
//		}
//		catch (Exception ex) {
//			throw ExUtil.newEx(ex);
//		}
//	}
}
