package com.meta64.mobile.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.StreamUtil;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Generates SHA256 Hash of the given node, recursively including all subnodes. Note: As a prototype
 * bean all the class properties are per-run. Objects of this instance are not reused. This is not a
 * singleton.
 * <p>
 * The current version of this doesn't not store the hash at each node but only the top node being
 * calculated. Need to make this optional. Eventually to be Merkle-like we will store a Hash at ever
 * node on the tree which represents a unique GUID that will change any time that node properties
 * changes or any of the children (recursively deep) have any properties changed.
 * <p>
 * Warning/Caveat: <br>
 * Current implementation stores nodeID+hash in a java HashMap (nodeHashes) in memory list before
 * writing them all out onto each node as a final step which will be done in some kind of delayed
 * writing thread, that saves in batches of 10 or 100 writes at a time likely. This in-memory hash
 * will have to change for large data sets (millions of nodes)
 */
@Component
@Scope("prototype")
public class Sha256Service {
	private static final Logger log = LoggerFactory.getLogger(Sha256Service.class);
	private static final String SHA_ALGO = "SHA-256";

	// private final boolean trace = true;
	// private final StringBuilder traceReport = new StringBuilder();

	private long nodeCount = 0;
	private long binaryCount = 0;
	private long binarySize = 0;
	private long nonBinaryCount = 0;
	private long nonBinarySize = 0;

	private HashMap<String, byte[]> nodeIdToHashMap = new HashMap<String, byte[]>();

	/*
	 * This is the 'full-scan' digester only used when doing a full tree scan in one single shot,
	 * for a full brute-force calculation of a hash of an entire tree branch. This will NOT match
	 * the root has you would get when doing a Merkle-style scan which is eventually what will also
	 * be done in here.
	 * 
	 * todo-0: Once i'm done transitioning to merkle-type hashing i will be able to either not use
	 * this globalDigester at all or else make it optional.
	 */
	// private MessageDigest globalDigester;

	public void generateNodeHash(Session session, GenerateNodeHashRequest req, GenerateNodeHashResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeId = req.getNodeId();
		boolean success = false;
		try {
			// globalDigester = MessageDigest.getInstance(SHA_ALGO);
			Node node = JcrUtil.findNode(session, nodeId);
			byte[] rootHash = recurseNode(node);

			// log.debug("TRACE: " + traceReport.toString());

			/*
			 * Note: rootHash will be correct even before any nodeIdToHashMap values are written out
			 * onto the tree
			 */

			// byte[] hashBytes = globalDigester.digest();
			String hash = Hex.encodeHexString(rootHash);
			log.debug("Hash=" + hash + "\n   nodeCount=" + nodeCount + "\n   dataPointCount=" + (nonBinaryCount + binaryCount));
			res.setHashInfo(hash);
			success = true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}

		res.setSuccess(success);
	}

	/*
	 * This is a depth-first recursion, so we hash all the children before we can has the node
	 * itself. Basic Merkle-type algorithm, with the exception that Merkle doesn't normally include
	 * node data in each hash, but we do here. Each recursion returns the hash of the 'node'.
	 */
	private byte[] recurseNode(Node node) {
		if (node == null) return null;
		nodeCount++;

		try {
			MessageDigest digester = MessageDigest.getInstance(SHA_ALGO);

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
					byte[] hashBytes = recurseNode(n);

					/*
					 * Currently since each node doesn't internally store the hashes of all its
					 * children, our live-updating (realtime-updating) of any node will be slow, to
					 * the extent that when a node is rehashed at least its immediate children will
					 * need to be collected and all their hash properties pulled. But i'm leaving
					 * that for later as it is essentially an optimization step.
					 */
					digester.update(hashBytes);
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
			}

			/* process the current node */
			processNode(digester, node);

			byte[] hashBytes = digester.digest();

			/* make sure this ID is unique. JCR should never allow but we still check. */
			if (nodeIdToHashMap.put(node.getIdentifier(), hashBytes) != null) {
				throw new RuntimeEx("unexpected dupliate identifier encountered: " + node.getIdentifier());
			}
			return hashBytes;
		}
		catch (Exception e) {
			throw ExUtil.newEx(e);
		}
	}

	private void processNode(MessageDigest digester, Node node) {
		try {
			// if (trace) {
			// traceReport.append("Processing Node:\n"); // + node.getIdentifier()+"\n");
			// }

			/* Get ordered set of property names. Ordering is significant for SHA256 obviously */
			List<String> propNames = JcrUtil.getPropertyNames(node, true);
			propNames = removeIgnoredProps(propNames);

			for (String propName : propNames) {
				Property prop = node.getProperty(propName);
				digestProperty(digester, prop);
			}

			updateDigest(digester, "type");
			updateDigest(digester, node.getPrimaryNodeType().getName());
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private List<String> removeIgnoredProps(List<String> list) {
		return list.stream().filter(item -> !ignoreProperty(item)).collect(Collectors.toList());
	}

	/*
	 * todo-1: For verification of import/export we need to ignore these, but for DB replication in
	 * P2P we wouldn't
	 */
	private boolean ignoreProperty(String propName) {
		return JcrProp.CREATED.equals(propName) || JcrProp.LAST_MODIFIED.equals(propName) || JcrProp.CREATED_BY.equals(propName) || "jcr:uuid".equals(propName);
	}

	private void digestProperty(MessageDigest digester, Property prop) {
		try {
			updateDigest(digester, prop.getName());
			// if (trace) {
			// traceReport.append(" prop=" + prop.getName() + "\n");
			// }

			/* multivalue */
			if (prop.isMultiple()) {

				for (Value v : prop.getValues()) {
					nonBinaryCount++;
					nonBinarySize += updateDigest(digester, v);
					// if (trace) {
					// traceReport.append(" multiVal=" + v.getString() + "\n");
					// }
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
					long thisBinarySize = updateDigest(digester, prop.getValue().getBinary().getStream());
					binarySize += thisBinarySize;
					// if (trace) {
					// traceReport.append(" binarySize=" + thisBinarySize + "\n");
					// }
				}
				else {
					nonBinaryCount++;
					nonBinarySize += updateDigest(digester, prop.getValue());
					// if (trace) {
					// traceReport.append(" Val=" + prop.getValue().getString() + "\n");
					// }
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
	private long updateDigest(MessageDigest digester, InputStream inputStream) {
		long dataLen = 0;
		try {
			try {
				byte[] bytes = IOUtils.toByteArray(inputStream);
				dataLen = bytes.length;
				updateDigest(digester, bytes);
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

	private long updateDigest(MessageDigest digester, Value v) {
		byte[] bytes = valueToBytes(v);
		updateDigest(digester, bytes);
		return bytes.length;
	}

	private void updateDigest(MessageDigest digester, String val) {
		val = val.trim();
		try {
			updateDigest(digester, val.getBytes(StandardCharsets.UTF_8));
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void updateDigest(MessageDigest digester, byte[] bytes) {
		// globalDigester.update(bytes);
		digester.update(bytes);
	}
}
