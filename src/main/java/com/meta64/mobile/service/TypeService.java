package com.meta64.mobile.service;

import org.springframework.stereotype.Component;

/**
 * Utility service for managing custom 'JCR Node Types' that are specific to and defined by SubNode
 * app. References:
 * 
 * https://www.onehippo.org/library/concepts/content-repository/defining-node-types.html
 * http://jackrabbit.apache.org/jcr/node-type-notation.html
 * http://jackrabbit.apache.org/jcr/node-types.html#NodeTypes-RegisteringNodeTypes
 */

@Component
public class TypeService {
	// private static final Logger log = LoggerFactory.getLogger(OakRepository.class);
	//
	// @Autowired
	// private RunAsJcrAdmin adminRunner;
	//
	// private boolean dumpTypesAtStartup = false;
	//
	// /* New experimental code, to create types. Not using this yet */
	// public void initNodeTypes() {
	// adminRunner.run(session -> {
	// try {
	// Workspace workspace = session.getWorkspace();
	// NamespaceRegistry registry = workspace.getNamespaceRegistry();
	//
	// if (!Arrays.asList(registry.getPrefixes()).contains("meta64")) {
	// registry.registerNamespace("meta64", "http://meta64.com/jcr/");
	// }
	//
	// NodeTypeManager mgr = workspace.getNodeTypeManager();
	// loadCNDTypeFile(session);
	// JcrUtil.save(session);
	//
	// if (dumpTypesAtStartup) {
	// log.info("Dumping NodeTypes:");
	// NodeTypeIterator iter = mgr.getAllNodeTypes();
	// while (iter.hasNext()) {
	// NodeType nodeType = iter.nextNodeType();
	// String nodeTypeName = nodeType.getName();
	// log.info("NodeType: " + nodeTypeName);
	// }
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// });
	// }
	//
	// /**
	// * http://jackrabbit.apache.org/jcr/node-type-notation.html
	// */
	// public void loadCNDTypeFile(Session session) {
	// try {
	// Resource resource =
	// SpringContextUtil.getApplicationContext().getResource("classpath:jcr-types.txt");
	// InputStream is = resource.getInputStream();
	// BufferedReader in = new BufferedReader(new InputStreamReader(is));
	//
	// try {
	// NodeType[] nodeTypes = CndImporter.registerNodeTypes(in, session, true /* reregisterExisting
	// */);
	// if (nodeTypes != null) {
	// log.info("Registered " + nodeTypes.length + " JCR types.");
	// }
	// }
	// finally {
	// StreamUtil.close(in);
	// }
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }
	//
	// /**
	// * This method was experimental way of creating a type without using the CND file
	// * (jcr-types.txt), but now that we have all types being defined in jcr-types.txt file we
	// don't
	// * need any Java-based registration other than what the CndImporter already does with the Type
	// * file
	// */
	// public void createPodcastTypes(NodeTypeManager mgr) {
	// try {
	// String typeName = "podcast";
	//
	// NodeType checkNode = JcrUtil.safeGetNodeType(mgr, "meta64:" + typeName);
	// if (checkNode != null) {
	// log.info("Node type already found.");
	// return;
	// }
	//
	// // Create a template for the node type ...
	// NodeTypeTemplate type = mgr.createNodeTypeTemplate();
	// type.setName("meta64:" + typeName);
	// // type.setDeclaredSuperTypeNames(declaredSuperTypes);
	// // type.setAbstract(false);
	// // type.setOrderableChildNodes(true);
	// // type.setMixin(mixin);
	// // type.setQueryable(queryable);
	// mgr.registerNodeType(type, true);
	// }
	// catch (Exception ex) {
	// throw ExUtil.newEx(ex);
	// }
	// }

}
