package com.meta64.mobile.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.request.CompareSubGraphsRequest;
import com.meta64.mobile.response.CompareSubGraphsResponse;
import com.meta64.mobile.util.CompareFailedException;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.ThreadLocals;

/* 
 * WARNING WARNING WARNING
 * 
 * i pounded this code out in one sitting, and it is not tested OR EVEN PROOFREAD yet!
 * 
 * Very much a work in progress, where i left off eod 5/29/2017
 * 
 */

/**
 * Recurses into two separate tree subgraphs to see if the two trees are identical or not, possibly
 * ignoring certain unimportant things like timestamp, etc.
 */
@Component
@Scope("prototype")
public class CompareSubGraphs {
	private static final Logger log = LoggerFactory.getLogger(CompareSubGraphs.class);

	public void generateNodeHash(Session session, CompareSubGraphsRequest req, CompareSubGraphsResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeIdA = req.getNodeIdA();
		String nodeIdB = req.getNodeIdB();
		boolean success = false;
		try {
			Node nodeA = JcrUtil.findNode(session, nodeIdA);
			Node nodeB = JcrUtil.findNode(session, nodeIdB);
			recurseNode(nodeA, nodeB, 0);
			success = true;
		}
		/*
		 * This exception is how we detect that the SubGraphs are not equal and report back to the
		 * user. This is more of a normal flow than an error condition.
		 */
		catch (CompareFailedException ex) {
			String compareInfo = "Compare Failed: " + ex.getMessage();
			res.setCompareInfo(compareInfo);
			success = true;
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}

		res.setSuccess(success);
	}

	private void recurseNode(Node nodeA, Node nodeB, int level) {
		if (nodeA == null) return;

		try {
			/* process the current node */
			processNode(nodeA, nodeB);

			/* then recursively process all children of the current node */
			NodeIterator nodeIterA, nodeIterB;
			try {
				nodeIterA = JcrUtil.getNodes(nodeA);
				nodeIterB = JcrUtil.getNodes(nodeB);
			}
			catch (Exception ex) {
				throw ExUtil.newEx(ex);
			}

			try {
				while (true) {
					Node nA = nodeIterA.nextNode();
					Node nB = nodeIterB.nextNode();
					recurseNode(nA, nB, level + 1);
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

	private void processNode(Node nodeA, Node nodeB) {
		try {
			log.debug("Processing NodeA: " + nodeA.getPath());

			/* Get ordered set of property names. Ordering is significant for SHA256 obviously */
			List<String> propNamesA = JcrUtil.getPropertyNames(nodeA, true);
			List<String> propNamesB = JcrUtil.getPropertyNames(nodeB, true);

			/* todo: add code to actually check property names all match too */
			if (propNamesA.size() != propNamesB.size()) {
				throw new CompareFailedException("Property cound difference detected.");
			}

			for (String propName : propNamesA) {
				if (!ignoreProperty(propName)) {
					Property propA = nodeA.getProperty(propName);
					Property propB = nodeB.getProperty(propName);
					compareProperties(propA, propB);
				}
			}

			String typeA = nodeA.getPrimaryNodeType().getName();
			String typeB = nodeB.getPrimaryNodeType().getName();
			if (!typeA.equals(typeB)) {
				throw new CompareFailedException("types mismatched.");
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private boolean ignoreProperty(String propName) {
		return JcrProp.CREATED.equals(propName) || JcrProp.LAST_MODIFIED.equals(propName);
	}

	private void compareProperties(Property propA, Property propB) {
		try {
			// updateDigest(prop.getName());

			/* multivalue */
			if (propA.isMultiple()) {
				if (!propB.isMultiple()) {
					throw new CompareFailedException("multiplicity difference");
				}

				Value[] vA = propA.getValues();
				Value[] vB = propB.getValues();

				if (vA.length != vB.length) {
					throw new CompareFailedException("multi value count mismatch");
				}

				for (int i = 0; i < vA.length; i++) {
					compareVals(vA[i], vB[i]);
				}
			}
			/* else single value */
			else {
				// todo-0: add binary stream compare. Skipping for now.
				// if (prop.getName().equals(JcrProp.BIN_DATA)) {
				// //updateDigest(prop.getValue().getBinary().getStream());
				// }
				// else {
				compareVals(propA.getValue(), propB.getValue());
				// }
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void compareVals(Value valueA, Value valueB) {
		try {
			if (!valueA.getString().equals(valueB.getString())) {
				throw new CompareFailedException("values compare failed");
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	/* digest entire stream AND close the stream. */
	// private long updateDigest(InputStream inputStream) {
	// long dataLen = 0;
	// try {
	// try {
	// byte[] bytes = IOUtils.toByteArray(inputStream);
	// dataLen = bytes.length;
	// // updateDigest(bytes);
	// }
	// finally {
	// StreamUtil.close(inputStream);
	// }
	// }
	// catch (IOException ex) {
	// throw ExUtil.newEx(ex);
	// }
	// return dataLen;
	// }

}
