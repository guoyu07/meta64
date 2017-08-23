package com.meta64.mobile.service;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.apache.commons.io.input.AutoCloseInputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.meta64.mobile.config.AppProp;
import com.meta64.mobile.config.NodeProp;
import com.meta64.mobile.image.ImageUtil;
import com.meta64.mobile.mongo.MongoApi;
import com.meta64.mobile.mongo.MongoSession;
import com.meta64.mobile.mongo.model.SubNode;
import com.meta64.mobile.request.DeleteAttachmentRequest;
import com.meta64.mobile.request.UploadFromUrlRequest;
import com.meta64.mobile.response.DeleteAttachmentResponse;
import com.meta64.mobile.response.UploadFromUrlResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.LimitedInputStreamEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for managing node attachments.
 * <p>
 * Node attachments are binary attachments that the user can opload onto a node. Each node allows
 * either zero or one attachments. Uploading a new attachment wipes out and replaces the previous
 * attachment. If the attachment is an 'image' type then it gets displayed right on the page.
 * Otherwise a download link is what gets displayed on the node.
 */
@Component
public class AttachmentService {
	private static final Logger log = LoggerFactory.getLogger(AttachmentService.class);

	@Autowired
	private MongoApi api;

	@Autowired
	private AppProp appProp;

	/*
	 * Upload from User's computer. Standard HTML form-based uploading of a file from user machine
	 */
	public ResponseEntity<?> uploadMultipleFiles(MongoSession session, String nodeId, MultipartFile[] uploadFiles, boolean explodeZips) {
		try {
			if (session == null) {
				session = ThreadLocals.getMongoSession();
			}

			/*
			 * OLD LOGIC: Uploading a single file attaches to the current node, but uploading
			 * multiple files creates each file on it's own subnode (child nodes)
			 */
			// boolean addAsChildren = countFileUploads(uploadFiles) > 1;

			/*
			 * NEW LOGIC: If the node itself currently has an attachment, leave it alone and just
			 * upload UNDERNEATH this current node.
			 */
			SubNode node = api.getNode(session, nodeId);
			if (node == null) {
				throw ExUtil.newEx("Node not found.");
			}
			boolean addAsChildren = false; //node.getIntProp(JcrProp.BIN_VER) > 0;
			int maxFileSize = 20 * 1024 * 1024;

			for (MultipartFile uploadFile : uploadFiles) {
				String fileName = uploadFile.getOriginalFilename();
				long size = uploadFile.getSize();
				if (!StringUtils.isEmpty(fileName)) {
					log.debug("Uploading file: " + fileName);

					LimitedInputStreamEx limitedIs = null;
					try {
						limitedIs = new LimitedInputStreamEx(uploadFile.getInputStream(), maxFileSize);
						attachBinaryFromStream(session, node, nodeId, fileName, size, limitedIs, null, -1, -1, addAsChildren, explodeZips);
					}
					finally {
						StreamUtil.close(limitedIs);
					}
				}
			}
			api.saveSession(session);
		}
		catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	//
	// private int countFileUploads(MultipartFile[] uploadFiles) {
	// int count = 0;
	// for (MultipartFile uploadFile : uploadFiles) {
	// String fileName = uploadFile.getOriginalFilename();
	// if (!StringUtils.isEmpty(fileName)) {
	// count++;
	// }
	// }
	// return count;
	// }
	//
	/*
	 * Gets the binary attachment from a supplied stream and loads it into the repository on the
	 * node specified in 'nodeId'
	 */
	private void attachBinaryFromStream(MongoSession session, SubNode node, String nodeId, String fileName, long size, LimitedInputStreamEx is, String mimeType,
			int width, int height, boolean addAsChild, boolean explodeZips) {

		/* If caller already has 'node' it can pass node, and avoid looking up node again */
		if (node == null && nodeId != null) {
			node = api.getNode(session, nodeId);
		}

		// JcrUtil.checkWriteAuthorized(node, session.getUserID());
		/*
		 * Multiple file uploads always attach children for each file uploaded
		 */
		if (addAsChild) {
			throw new RuntimeException("Not supported.");
			// /* NT_UNSTRUCTURED IS ORDERABLE */
			// try {
			// Node newNode = node.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
			// newNode.setProperty(JcrProp.CONTENT, "File: " + fileName);
			// JcrUtil.timestampNewNode(session, newNode);
			// node = newNode;
			// }
			// catch (Exception ex) {
			// throw ExUtil.newEx(ex);
			// }
		}

		/* mimeType can be passed as null if it's not yet determined */
		if (mimeType == null) {
			mimeType = URLConnection.guessContentTypeFromName(fileName);
		}

		/*
		 * Hack/Fix for ms word. Not sure why the URLConnection fails for this, but it's new. I need
		 * to grab my old mime type map from legacy meta64 and put in this project. Clearly the
		 * guessContentTypeFromName implementation provided by URLConnection has a screw loose.
		 */
		if (mimeType == null) {
			if (fileName.toLowerCase().endsWith(".doc")) {
				mimeType = "application/msword";
			}
		}

		/* fallback to at lest some acceptable mime type */
		if (mimeType == null) {
			mimeType = "application/octet-stream";
		}

		if (explodeZips && "application/zip".equalsIgnoreCase(mimeType)) {
			/* This is a prototype bean, with state for processing one import at a time */

			throw new RuntimeException("Not enabled yet in mongo architecture.");
			// ImportZipService importZipStreamService = (ImportZipService)
			// SpringContextUtil.getBean(ImportZipService.class);
			// importZipStreamService.inputZipFileFromStream(session, is, node);
		}
		else {
			saveBinaryStreamToNode(session, is, mimeType, fileName, size, width, height, node);
		}

		// DO NOT DELETE (this code can be used to test uploading)
		// String directory = "c:/temp-upload";
		// String filepath = Paths.get(directory, fileName).toString();
		// BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new
		// File(filepath)));
		// stream.write(uploadfile.getBytes());
		// stream.close();
	}

	public void saveBinaryStreamToNode(MongoSession session, LimitedInputStreamEx inputStream, String mimeType, String fileName, long size, int width, int height, SubNode node) {

		long version = node.getIntProp(NodeProp.BIN_VER);
		if (version == 0L) {
			version = 1L;
		}

		/*
		 * NOTE: 'inputStream' stream IS is closed inside 'createBinary' so we don't close it here
		 */
		// Binary binary = session.getValueFactory().createBinary(inputStream);

		/*
		 * The above 'createBinary' call will have already read the entire stream so we can now
		 * assume all data is present and width/height of image will ba available.
		 */
		// todo-0: need to bring back image size capability.
		// if (ImageUtil.isImageMime(mimeType)) {
		// if (width == -1 || height == -1) {
		// ImageSize size = jcrUtil.getImageSizeFromBinary(binary);
		// width = size.width;
		// height = size.height;
		// }
		//
		// node.setProperty(JcrProp.IMG_WIDTH, String.valueOf(width));
		// node.setProperty(JcrProp.IMG_HEIGHT, String.valueOf(height));
		// }

		node.setProp(NodeProp.BIN_MIME, mimeType);
		if (fileName != null) {
			node.setProp(NodeProp.BIN_FILENAME, fileName);
		}

		if (size > 0) {
			node.setProp(NodeProp.BIN_SIZE, size);
		}
		node.setProp(NodeProp.BIN_VER, version + 1);

		api.writeStream(session, node, inputStream, null, mimeType, null);
		
		if (size <= 0) {
			node.setProp(NodeProp.BIN_SIZE, inputStream.getCount());
		}
		
		api.save(session, node);
	}

	/*
	 * Removes the attachment from the node specified in the request.
	 */
	public void deleteAttachment(MongoSession session, DeleteAttachmentRequest req, DeleteAttachmentResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String nodeId = req.getNodeId();
		SubNode node = api.getNode(session, nodeId);
		api.deleteBinary(session, node, null);
		deleteAllBinaryProperties(node);
		api.saveSession(session);
		res.setSuccess(true);
	}

	/*
	 * Deletes all the binary-related properties from a node
	 */
	private void deleteAllBinaryProperties(SubNode node) {
		node.deleteProp(NodeProp.IMG_WIDTH);
		node.deleteProp(NodeProp.IMG_HEIGHT);
		node.deleteProp(NodeProp.BIN_MIME);
		node.deleteProp(NodeProp.BIN_VER);
		node.deleteProp(NodeProp.BIN_FILENAME);
		node.deleteProp(NodeProp.BIN_SIZE);
	}

	/*
	 * Returns data for an attachment (Could be an image request, or any type of request for binary
	 * data from a node). This is the method that services all calls from the browser to get the
	 * data for the attachment to download/display the attachment.
	 */
	public ResponseEntity<InputStreamResource> getBinary(MongoSession session, String nodeId) {
		try {
			if (session == null) {
				session = ThreadLocals.getMongoSession();
			}
			SubNode node = api.getNode(session, nodeId);

			String mimeTypeProp = node.getStringProp(NodeProp.BIN_MIME);
			if (mimeTypeProp == null) {
				throw ExUtil.newEx("unable to find mimeType property");
			}
			// log.debug("Retrieving mime: " +
			// mimeTypeProp.getValue().getString());

			// Property dataProp = node.getProperty(JcrProp.BIN_DATA);
			// if (dataProp == null) {
			// throw ExUtil.newEx("unable to find data property");
			// }
			//
			// Binary binary = dataProp.getBinary();
			// log.debug("Retrieving binary bytes: " + binary.getSize());

			String fileName = node.getStringProp(NodeProp.BIN_FILENAME);
			if (fileName == null) {
				fileName = "filename";
			}

			InputStream inStream = api.getStream(session, node, null);
			long size = node.getIntProp(NodeProp.BIN_SIZE);

			return ResponseEntity.ok().contentLength(size)//
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")//
					.contentType(MediaType.parseMediaType(mimeTypeProp))//
					.body(new InputStreamResource(new AutoCloseInputStream(new BufferedInputStream(inStream))));
		}
		catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	// public String getFileContent(Session session, String fileName) {
	// if (fileName.contains("..")) throw ExUtil.newEx("bad request.");
	//
	// try {
	// String fullFileName = appProp.getAdminDataFolder() + File.separator + fileName;
	// File file = new File(fullFileName);
	// String checkPath = file.getCanonicalPath();
	// // todo-0: for better security make a REAL '/file/' folder under admin folder and assert
	// // that the file is in there directly
	// if (!checkPath.startsWith(appProp.getAdminDataFolder())) throw ExUtil.newEx("bad request.");
	//
	// if (!file.isFile()) throw ExUtil.newEx("file not found.");
	// return FileUtils.readFile(fullFileName);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }

	// /* formatted==true indicates we will be sending back actually an HTML response that does the
	// bare minimum to load the
	// * markdown into the google marked component and render it.
	// */
	// public ResponseEntity<InputStreamResource> getFile(Session session, String fileName, String
	// disposition, boolean formatted) {
	// if (fileName.contains("..")) throw ExUtil.newEx("bad request.");
	//
	// try {
	// String fullFileName = appProp.getAdminDataFolder() + File.separator + fileName;
	// File file = new File(fullFileName);
	// String checkPath = file.getCanonicalPath();
	// // todo-0: for better security make a REAL '/file/' folder under admin folder and assert
	// // that the file is in there directly
	// if (!checkPath.startsWith(appProp.getAdminDataFolder())) throw ExUtil.newEx("bad request.");
	//
	// if (!file.isFile()) throw ExUtil.newEx("file not found.");
	//
	// /*
	// * Alternative is: return new FileSystemResource(...)
	// */
	// BufferedInputStream bis = new BufferedInputStream(new FileInputStream(fullFileName));
	// String mimeType = FileUtils.getMimeType(file);
	// if (disposition == null) {
	// disposition = "inline";
	// }
	//
	// return ResponseEntity.ok().contentLength(file.length())//
	// .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + fileName + "\"")//
	// .contentType(MediaType.parseMediaType(mimeType))//
	// .body(new InputStreamResource(new AutoCloseInputStream(bis)));
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	/*
	 * Uploads an image attachment not from the user's machine but from some arbitrary internet URL
	 * they have provided, that could be pointing to an image or any other kind of content actually.
	 */
	public void uploadFromUrl(MongoSession session, UploadFromUrlRequest req, UploadFromUrlResponse res) {
		if (session == null) {
			session = ThreadLocals.getMongoSession();
		}
		String nodeId = req.getNodeId();
		String sourceUrl = req.getSourceUrl();
		String FAKE_USER_AGENT = "Mozilla/5.0";

		/*
		 * todo-0: This value exists in properties file, and also in TypeScript variable. Need to
		 * have better way to define this ONLY in properties file.
		 */
		int maxFileSize = 20 * 1024 * 1024;
		LimitedInputStreamEx limitedIs = null;

		try {
			URL url = new URL(sourceUrl);

			String mimeType = URLConnection.guessContentTypeFromName(sourceUrl);

			/*
			 * if this is an image extension, handle it in a special way, mainly to extract the
			 * width, height from it
			 */
			if (ImageUtil.isImageMime(mimeType)) {

				/*
				 * DO NOT DELETE
				 *
				 * Basic version without masquerading as a web browser can cause a 403 error because
				 * some sites don't want just any old stream reading from them. Leave this note here
				 * as a warning and explanation
				 */
				HttpClient client = HttpClientBuilder.create().build();
				HttpGet request = new HttpGet(sourceUrl);
				request.addHeader("User-Agent", FAKE_USER_AGENT);
				HttpResponse response = client.execute(request);
				log.debug("Response Code: " + response.getStatusLine().getStatusCode() + " reason=" + response.getStatusLine().getReasonPhrase());
				InputStream is = response.getEntity().getContent();

				limitedIs = new LimitedInputStreamEx(is, maxFileSize);

				// insert 0L for size now, because we don't know it yet
				attachBinaryFromStream(session, null, nodeId, sourceUrl, 0L, limitedIs, mimeType, -1, -1, false, false);
			}
			/*
			 * if not an image extension, we can just stream directly into the database, but we want
			 * to try to get the mime type first, from calling detectImage so that if we do detect
			 * its an image we can handle it as one.
			 */
			else {
				if (!detectAndSaveImage(session, nodeId, sourceUrl, url)) {
					HttpClient client = HttpClientBuilder.create().build();
					HttpGet request = new HttpGet(sourceUrl);
					request.addHeader("User-Agent", FAKE_USER_AGENT);
					HttpResponse response = client.execute(request);
					log.debug("Response Code: " + response.getStatusLine().getStatusCode() + " reason=" + response.getStatusLine().getReasonPhrase());
					InputStream is = response.getEntity().getContent();

					limitedIs = new LimitedInputStreamEx(is, maxFileSize);

					// insert 0L for size now, because we don't know it yet
					attachBinaryFromStream(session, null, nodeId, sourceUrl, 0L, limitedIs, "", -1, -1, false, false);
				}
			}
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
		/* finally block just for extra safety */
		finally {
			StreamUtil.close(limitedIs);
		}

		api.saveSession(session);
		res.setSuccess(true);
	}

	// FYI: Warning: this way of getting content type doesn't work.
	// String mimeType = URLConnection.guessContentTypeFromStream(inputStream);
	//
	/* returns true if it was detected AND saved as an image */
	private boolean detectAndSaveImage(MongoSession session, String nodeId, String fileName, URL url) {
		ImageInputStream is = null;
		LimitedInputStreamEx is2 = null;
		ImageReader reader = null;
		int maxFileSize = 20 * 1024 * 1024;

		try {
			is = ImageIO.createImageInputStream(url.openStream());
			Iterator<ImageReader> readers = ImageIO.getImageReaders(is);

			if (readers.hasNext()) {
				reader = readers.next();
				String formatName = reader.getFormatName();

				if (formatName != null) {
					formatName = formatName.toLowerCase();
					// log.debug("determined format name of image url: " +
					// formatName);
					reader.setInput(is, true, false);
					BufferedImage bufImg = reader.read(0);
					String mimeType = "image/" + formatName;

					ByteArrayOutputStream os = new ByteArrayOutputStream();
					ImageIO.write(bufImg, formatName, os);
					byte[] bytes = os.toByteArray();
					is2 = new LimitedInputStreamEx(new ByteArrayInputStream(bytes), maxFileSize);

					attachBinaryFromStream(session, null, nodeId, fileName, bytes.length, is2, mimeType, bufImg.getWidth(null), bufImg.getHeight(null), false, false);
					return true;
				}
			}
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
		finally {
			StreamUtil.close(is, is2, reader);
		}

		return false;
	}
}
