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
 * Generates SHA256 Hash of the given node, recursively including all subnodes. Note: As a prototype
 * bean all the class properties are per-run. Objects of this instance are not reused. This is not a
 * singleton.
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

	private long nodeCount = 0;
	private long propertyCount = 0;
	private long binaryCount = 0;
	private long nonBinarySize = 0;
	private long binarySize = 0;

	/*
	 * This is the 'full-scan' digester only used when doing a full tree scan in one single shot,
	 * for a full brute-force calculation of a hash of an entire tree branch. This will NOT match
	 * the root has you would get when doing a Merkle-style scan which is eventually what will also
	 * be done in here.
	 */
	private MessageDigest globalDigester;

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
			String hash = Hex.encodeHexString(hashBytes);
			log.debug("Hash=" + hash + "\n   nodeCount=" + nodeCount + "\n   propCount=" + propertyCount);
			res.setHashInfo(hash);
			success = true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}

		res.setSuccess(success);
	}

	private void recurseNode(Node node, int level) {
		if (node == null) return;
		nodeCount++;

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

	private void processNode(Node node) {
		try {
			//log.debug("Processing Node: " + node.getPath());

			/* Get ordered set of property names. Ordering is significant for SHA256 obviously */
			List<String> propNames = JcrUtil.getPropertyNames(node, true);
			for (String propName : propNames) {
				if (!ignoreProperty(propName)) {
					propertyCount++;
					Property prop = node.getProperty(propName);
					digestProperty(prop);
				}
			}

			updateDigest("type");
			updateDigest(node.getPrimaryNodeType().getName());
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private boolean ignoreProperty(String propName) {
		return JcrProp.CREATED.equals(propName) || JcrProp.LAST_MODIFIED.equals(propName);
	}

	private void digestProperty(Property prop) {
		try {
			updateDigest(prop.getName());

			/* multivalue */
			if (prop.isMultiple()) {
				for (Value v : prop.getValues()) {
					nonBinarySize += updateDigest(v);
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
					binaryCount++;
					binarySize += updateDigest(prop.getValue().getBinary().getStream());
				}
				else {
					nonBinarySize += updateDigest(prop.getValue());
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
	private long updateDigest(InputStream inputStream) {
		long dataLen = 0;
		try {
			try {
				byte[] bytes = IOUtils.toByteArray(inputStream);
				dataLen = bytes.length;
				updateDigest(bytes);
			}
			finally {
				StreamUtil.close(inputStream);
			}
		}
		catch (IOException ex) {
			throw ExUtil.newEx(ex);
		}
		return dataLen;
	}

	private long updateDigest(Value v) {
		byte[] bytes = valueToBytes(v);
		updateDigest(bytes);
		return bytes.length;
	}

	private void updateDigest(String val) {
		val = val.trim();
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
