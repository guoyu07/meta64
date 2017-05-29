package com.meta64.mobile.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.request.GenerateNodeHashRequest;
import com.meta64.mobile.response.GenerateNodeHashResponse;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Generates SHA256 Hash of the given node, recursively including all subnodes.
 * <p>
 * The current version of this doesn not store the hash at each node but only the top node being
 * calculated. Need to make this optional. Eventually to be Merkle-like we will store a Hash at ever
 * node on the tree which represents a unique GUID that will change any time that node properties
 * changes or any of the children (recursively deep) have any properties changed.
 */
@Component
@Scope("prototype")
public class Sha256Service {
	private static final Logger log = LoggerFactory.getLogger(Sha256Service.class);
	private static final String SHA_ALGO = "SHA-256";

	/*
	 * This is the 'full-scan' digester only used when doing a full tree scan in one single shot,
	 * for a full brute-force calculation of a hash of an entire tree branch. This will NOT match
	 * the root has you would get when doing a Merkle-style scan which is eventually what will also
	 * be done in here.
	 */
	MessageDigest globalDigester;

	public void generateNodeHash(Session session, GenerateNodeHashRequest req, GenerateNodeHashResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeId = req.getNodeId();
		boolean success = false;
		try {
			globalDigester = MessageDigest.getInstance(SHA_ALGO);
			Node node = JcrUtil.findNode(session, nodeId);
			recurseNode(node, 0);

			byte[] hashBytes = globalDigester.digest();
			res.setHashInfo(Hex.encodeHexString(hashBytes));
			success = true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}

		res.setSuccess(success);
	}

	private void recurseNode(Node node, int level) {
		if (node == null) return;

		try {
			/* process the current node */
			processNode(node);

			/* then recursively process all children of the current node */
			NodeIterator nodeIter;
			try {
				nodeIter = JcrUtil.getNodes(node);
			}
			catch (Exception ex) {
				throw ExUtil.newEx(ex);
			}

			try {
				while (true) {
					Node n = nodeIter.nextNode();
					recurseNode(n, level + 1);
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
			}
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	/*
	 * NOTE: It's correct that there's no finally block in here enforcing the closeEntry, becasue we
	 * let exceptions bubble all the way up to abort and even cause the zip file itself (to be
	 * deleted) since it was unable to be written to.
	 */
	private void processNode(Node node) {
		try {
			log.debug("Processing Node: " + node.getPath());

			/* Get ordered set of property names. Ordering is significant for SHA256 obviously */
			List<String> propNames = JcrUtil.getPropertyNames(node, true);
			for (String propName : propNames) {
				Property prop = node.getProperty(propName);
				digestProperty(prop);
			}

			updateDigest("id");
			updateDigest(node.getIdentifier());
			updateDigest("type");
			updateDigest(node.getPrimaryNodeType().getName());
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void digestProperty(Property prop) {
		try {
			updateDigest(prop.getName());

			/* multivalue */
			if (prop.isMultiple()) {
				for (Value v : prop.getValues()) {
					updateDigest(v);
				}
			}
			/* else single value */
			else {
				/*
				 * We only support detecting the SubNode app specific binary node property, and so
				 * currently this code will not work as completely general-purpose on any JCR tree
				 * with arbitrary binary nodes.
				 */
				if (prop.getName().equals(JcrProp.BIN_DATA)) {
					updateDigest(prop.getValue().getBinary().getStream());
				}
				else {
					updateDigest(prop.getValue());
				}
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/*
	 * For now we use a simple 'getString' but in the future we need to get exact binary data so
	 * that even floating point values are seen, not as strings, but arrays of bytes. (todo-0, fix)
	 */
	private byte[] valueToBytes(Value value) {
		try {
			return value.getString().getBytes(StandardCharsets.UTF_8);
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/* digest entire stream AND close the stream. */
	private void updateDigest(InputStream inputStream) {
		try {
			try {
				updateDigest(IOUtils.toByteArray(inputStream));
			}
			finally {
				StreamUtil.close(inputStream);
			}
		}
		catch (IOException ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void updateDigest(Value v) {
		updateDigest(valueToBytes(v));
	}

	private void updateDigest(String val) {
		try {
			updateDigest(val.getBytes(StandardCharsets.UTF_8));
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void updateDigest(byte[] bytes) {
		globalDigester.update(bytes);
	}
}
