package com.meta64.mobile.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.Session;

import org.apache.commons.io.input.AutoCloseInputStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.jackrabbit.JcrConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.net.HttpHeaders;
import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.image.ImageUtil;
import com.meta64.mobile.request.DeleteAttachmentRequest;
import com.meta64.mobile.request.UploadFromUrlRequest;
import com.meta64.mobile.response.DeleteAttachmentResponse;
import com.meta64.mobile.response.UploadFromUrlResponse;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.ImageSize;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.LimitedInputStreamEx;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Service for editing node attachments. Node attachments are binary attachments that the user can
 * opload onto a node. Each node allows either zero or one attachments. Uploading a new attachment
 * wipes out and replaces the previous attachment. If the attachment is an 'image' type then it gets
 * displayed right on the page. Otherwise a download link is what gets displayed on the node.
 */
@Component
public class AttachmentService {
	private static final Logger log = LoggerFactory.getLogger(AttachmentService.class);

	@Autowired
	private JcrUtil jcrUtil;

	/*
	 * Upload from User's computer. Standard HTML form-based uploading of a file from user machine
	 */
	public ResponseEntity<?> uploadMultipleFiles(Session session, String nodeId, MultipartFile[] uploadFiles, boolean explodeZips) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
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
			Node node = JcrUtil.findNode(session, nodeId);
			if (node == null) {
				throw new RuntimeEx("Node not found.");
			}
			boolean addAsChildren = Convert.getBinaryVersion(node) > 0;

			for (MultipartFile uploadFile : uploadFiles) {
				String fileName = uploadFile.getOriginalFilename();
				if (!StringUtils.isEmpty(fileName)) {
					log.debug("Uploading file: " + fileName);
					attachBinaryFromStream(session, node, nodeId, fileName, uploadFile.getInputStream(), null, -1, -1, addAsChildren, explodeZips);
				}
			}
			JcrUtil.save(session);
		}
		catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	private int countFileUploads(MultipartFile[] uploadFiles) {
		int count = 0;
		for (MultipartFile uploadFile : uploadFiles) {
			String fileName = uploadFile.getOriginalFilename();
			if (!StringUtils.isEmpty(fileName)) {
				count++;
			}
		}
		return count;
	}

	/*
	 * Gets the binary attachment from a supplied stream and loads it into the repository on the
	 * node specified in 'nodeId'
	 */
	private void attachBinaryFromStream(Session session, Node node, String nodeId, String fileName, InputStream is, String mimeType, int width, int height,
			boolean addAsChild, boolean explodeZips) {

		/* If caller already has 'node' it can pass node, and avoid looking up node again */
		if (node == null && nodeId != null) {
			node = JcrUtil.findNode(session, nodeId);
		}

		JcrUtil.checkWriteAuthorized(node, session.getUserID());
		/*
		 * Multiple file uploads always attach children for each file uploaded
		 */
		if (addAsChild) {
			/* NT_UNSTRUCTURED IS ORDERABLE */
			try {
				Node newNode = node.addNode(JcrUtil.getGUID(), JcrConstants.NT_UNSTRUCTURED);
				newNode.setProperty(JcrProp.CONTENT, "File: " + fileName);
				JcrUtil.timestampNewNode(session, newNode);
				node = newNode;
			}
			catch (Exception ex) {
				throw new RuntimeEx(ex);
			}
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
			ImportZipService importZipStreamService = (ImportZipService) SpringContextUtil.getBean(ImportZipService.class);

			importZipStreamService.inputZipFileFromStream(session, is, node);
		}
		else {
			saveBinaryStreamToNode(session, is, mimeType, fileName, width, height, node);
		}

		// DO NOT DELETE (this code can be used to test uploading)
		// String directory = "c:/temp-upload";
		// String filepath = Paths.get(directory, fileName).toString();
		// BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new
		// File(filepath)));
		// stream.write(uploadfile.getBytes());
		// stream.close();
	}

	public void saveBinaryStreamToNode(Session session, InputStream is, String mimeType, String fileName, int width, int height, Node node) {
		try {
			long version = System.currentTimeMillis();
			Property binVerProp = JcrUtil.getProperty(node, JcrProp.BIN_VER);
			if (binVerProp != null) {
				version = binVerProp.getValue().getLong();
			}

			Binary binary = session.getValueFactory().createBinary(is);

			/*
			 * The above 'createBinary' call will have already read the entire stream so we can now
			 * assume all data is present and width/height of image will ba available.
			 */
			if (ImageUtil.isImageMime(mimeType)) {
				if (width == -1 || height == -1) {
					ImageSize size = jcrUtil.getImageSizeFromBinary(binary);
					width = size.width;
					height = size.height;
				}

				node.setProperty(JcrProp.IMG_WIDTH, String.valueOf(width));
				node.setProperty(JcrProp.IMG_HEIGHT, String.valueOf(height));
			}

			node.setProperty(JcrProp.BIN_DATA, binary);
			node.setProperty(JcrProp.BIN_MIME, mimeType);
			if (fileName != null) {
				node.setProperty(JcrProp.BIN_FILENAME, fileName);
			}
			node.setProperty(JcrProp.BIN_VER, version + 1);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	/*
	 * Removes the attachment from the node specified in the request.
	 */
	public void deleteAttachment(Session session, DeleteAttachmentRequest req, DeleteAttachmentResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		String nodeId = req.getNodeId();
		Node node = JcrUtil.findNode(session, nodeId);
		JcrUtil.checkWriteAuthorized(node, session.getUserID());
		deleteAllBinaryProperties(node);
		JcrUtil.save(session);
		res.setSuccess(true);
	}

	/*
	 * Deletes all the binary-related properties from a node
	 */
	private void deleteAllBinaryProperties(Node node) {
		JcrUtil.safeDeleteProperty(node, JcrProp.IMG_WIDTH);
		JcrUtil.safeDeleteProperty(node, JcrProp.IMG_HEIGHT);
		JcrUtil.safeDeleteProperty(node, JcrProp.BIN_DATA);
		JcrUtil.safeDeleteProperty(node, JcrProp.BIN_MIME);
		JcrUtil.safeDeleteProperty(node, JcrProp.BIN_VER);
		JcrUtil.safeDeleteProperty(node, JcrProp.BIN_FILENAME);
	}

	/*
	 * Returns data for an attachment (Could be an image request, or any type of request for binary
	 * data from a node). This is the method that services all calls from the browser to get the
	 * data for the attachment to download/display the attachment.
	 */
	public ResponseEntity<InputStreamResource> getBinary(Session session, String nodeId) {
		try {
			if (session == null) {
				session = ThreadLocals.getJcrSession();
			}
			Node node = JcrUtil.findNode(session, nodeId);

			Property mimeTypeProp = node.getProperty(JcrProp.BIN_MIME);
			if (mimeTypeProp == null) {
				throw new RuntimeEx("unable to find mimeType property");
			}
			// log.debug("Retrieving mime: " +
			// mimeTypeProp.getValue().getString());

			Property dataProp = node.getProperty(JcrProp.BIN_DATA);
			if (dataProp == null) {
				throw new RuntimeEx("unable to find data property");
			}

			Binary binary = dataProp.getBinary();
			// log.debug("Retrieving binary bytes: " + binary.getSize());

			String fileName = JcrUtil.safeGetStringProp(node, JcrProp.BIN_FILENAME);
			if (fileName == null) {
				fileName = "filename";
			}

			return ResponseEntity.ok().contentLength(binary.getSize())//
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")//
					.contentType(MediaType.parseMediaType(mimeTypeProp.getValue().getString()))//
					.body(new InputStreamResource(new AutoCloseInputStream(binary.getStream())));
		}
		catch (Exception e) {
			log.error(e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	/*
	 * Uploads an image attachment not from the user's machine but from some arbitrary internet URL
	 * they have provided, that could be pointing to an image or any other kind of content actually.
	 */
	public void uploadFromUrl(Session session, UploadFromUrlRequest req, UploadFromUrlResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}
		String nodeId = req.getNodeId();
		String sourceUrl = req.getSourceUrl();
		String FAKE_USER_AGENT = "Mozilla/5.0";
		int maxFileSize = 20 * 1024 * 1024;

		try {
			URL url = new URL(sourceUrl);
			InputStream uis = null;

			try {
				String mimeType = URLConnection.guessContentTypeFromName(sourceUrl);

				/*
				 * if this is an image extension, handle it in a special way, mainly to extract the
				 * width, height from it
				 */
				if (ImageUtil.isImageMime(mimeType)) {

					/*
					 * DO NOT DELETE
					 * 
					 * Basic version without masquerading as a web browser can cause a 403 error
					 * because some sites don't want just any old stream reading from them. Leave
					 * this note here as a warning and explanation
					 */
					HttpClient client = HttpClientBuilder.create().build();
					HttpGet request = new HttpGet(sourceUrl);
					request.addHeader("User-Agent", FAKE_USER_AGENT);
					HttpResponse response = client.execute(request);
					log.debug("Response Code: " + response.getStatusLine().getStatusCode() + " reason=" + response.getStatusLine().getReasonPhrase());
					InputStream is = response.getEntity().getContent();

					uis = new AutoCloseInputStream(new LimitedInputStreamEx(is, maxFileSize));
					attachBinaryFromStream(session, null, nodeId, sourceUrl, uis, mimeType, -1, -1, false, false);
				}
				/*
				 * if not an image extension, we can just stream directly into the database, but we
				 * want to try to get the mime type first, from calling detectImage so that if we do
				 * detect its an image we can handle it as one.
				 */
				else {
					if (!detectAndSaveImage(session, nodeId, sourceUrl, url)) {
						HttpClient client = HttpClientBuilder.create().build();
						HttpGet request = new HttpGet(sourceUrl);
						request.addHeader("User-Agent", FAKE_USER_AGENT);
						HttpResponse response = client.execute(request);
						log.debug("Response Code: " + response.getStatusLine().getStatusCode() + " reason=" + response.getStatusLine().getReasonPhrase());
						InputStream is = response.getEntity().getContent();
						uis = new AutoCloseInputStream(new LimitedInputStreamEx(is, maxFileSize));
						attachBinaryFromStream(session, null, nodeId, sourceUrl, is, "", -1, -1, false, false);
					}
				}
			}
			/* finally block just for extra safety */
			finally {
				StreamUtil.close(uis);
			}
			JcrUtil.save(session);
			res.setSuccess(true);
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
	}

	// FYI: Warning: this way of getting content type doesn't work.
	// String mimeType = URLConnection.guessContentTypeFromStream(inputStream);
	//
	/* returns true if it was detected AND saved as an image */
	private boolean detectAndSaveImage(Session session, String nodeId, String fileName, URL url) {
		ImageInputStream is = null;
		InputStream is2 = null;
		ImageReader reader = null;

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
					is2 = new ByteArrayInputStream(os.toByteArray());

					attachBinaryFromStream(session, null, nodeId, fileName, is2, mimeType, bufImg.getWidth(null), bufImg.getHeight(null), false, false);
					return true;
				}
			}
		}
		catch (Exception ex) {
			throw new RuntimeEx(ex);
		}
		finally {
			StreamUtil.close(is, is2, reader);
		}

		return false;
	}
}
