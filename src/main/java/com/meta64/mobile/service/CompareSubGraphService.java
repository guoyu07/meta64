package com.meta64.mobile.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.Session;
import javax.jcr.Value;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.meta64.mobile.config.JcrProp;
import com.meta64.mobile.request.CompareSubGraphRequest;
import com.meta64.mobile.response.CompareSubGraphResponse;
import com.meta64.mobile.util.CompareFailedException;
import com.meta64.mobile.util.ExUtil;
import com.meta64.mobile.util.JcrUtil;
import com.meta64.mobile.util.RuntimeEx;
import com.meta64.mobile.util.ThreadLocals;

/**
 * Recurses into two separate tree subgraphs to see if the two trees are identical or not, possibly
 * ignoring certain things like timestamp, etc.
 */
@Component
@Scope("prototype")
public class CompareSubGraphService {
	private static final Logger log = LoggerFactory.getLogger(CompareSubGraphService.class);

	public void compare(Session session, CompareSubGraphRequest req, CompareSubGraphResponse res) {
		if (session == null) {
			session = ThreadLocals.getJcrSession();
		}

		String nodeIdA = req.getNodeIdA();
		String nodeIdB = req.getNodeIdB();

		/* validate nodes IDs were sent */
		if (StringUtils.isEmpty(nodeIdA) || StringUtils.isEmpty(nodeIdB)) {
			throw new RuntimeEx("Must specify two nodes to compare.");
		}

		nodeIdA = nodeIdA.trim();
		nodeIdB = nodeIdB.trim();

		if (nodeIdA.equals(nodeIdB)) {
			throw new RuntimeEx("Cannot compare node to itself. Please supply two different nodes.");
		}

		/*
		 * todo-1: if we wanted to we could also run a search to be sure none of the parent nodes of
		 * A is B, and vice versa just for one more sanity check before we start processing to be
		 * sure user doesn't have a case where A is a SubGraph of B or vice versa
		 */

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

		/*
		 * Success here indicates nothing failed about how the compare was done, and is not the same
		 * as saying the nodes are identical or not.
		 */
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

			int oddEven = 0;
			try {
				while (true) {
					Node nA = nodeIterA.nextNode();
					oddEven++;
					Node nB = nodeIterB.nextNode();
					oddEven++;
					recurseNode(nA, nB, level + 1);
				}
			}
			catch (NoSuchElementException ex) {
				// not an error. Normal iterator end condition.
				// but we check oddEven to verify child counts were identical.
				if (oddEven % 2 != 0) {
					throw new CompareFailedException("child nodes are not same count");
				}
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

			/*
			 * todo: add code to actually check property names all match too (i.e. identical list
			 * condition)
			 */
			if (propNamesA.size() != propNamesB.size()) {
				throw new CompareFailedException("Property cound difference detected.");
			}

			for (String propName : propNamesA) {
				if (!ignoreProperty(propName)) {
					/* get this property value on both nodes */
					Property propA = nodeA.getProperty(propName);
					Property propB = nodeB.getProperty(propName);

					/* verify property data is identical */
					compareProperties(propA, propB);
				}
			}

			/*
			 * Check primary node types identical. todo-0: we can add mix-ins, to be more strict
			 * about the definition of truely identical types
			 */
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
			if (!propA.getName().equals(propB.getName())) {
				throw new RuntimeEx("bug in compare code. Property names different.");
			}

			/* multivalue */
			if (propA.isMultiple()) {
				if (!propB.isMultiple()) {
					throw new CompareFailedException("multiplicity difference");
				}

				Value[] vA = propA.getValues();
				Value[] vB = propB.getValues();
				compareValArrays(vA, vB);
			}
			/* else single value */
			else {
				// todo-0: add binary stream compare. Skipping for now. The code for stream handling
				// can be easily be gleaned
				// from Sha256Service class which is similar to this class.
				compareVals(propA.getValue(), propB.getValue());
			}
		}
		catch (Exception ex) {
			throw ExUtil.newEx(ex);
		}
	}

	private void compareValArrays(Value[] vA, Value[] vB) {
		if (vA.length != vB.length) {
			throw new CompareFailedException("multi value count mismatch");
		}

		for (int i = 0; i < vA.length; i++) {
			compareVals(vA[i], vB[i]);
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
}
