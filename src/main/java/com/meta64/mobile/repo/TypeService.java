package com.meta64.mobile.repo;

import java.util.Arrays;

import javax.jcr.NamespaceRegistry;
import javax.jcr.Session;
import javax.jcr.Workspace;
import javax.jcr.nodetype.NodeType;
import javax.jcr.nodetype.NodeTypeManager;
import javax.jcr.nodetype.NodeTypeTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.meta64.mobile.user.RunAsJcrAdmin;
import com.meta64.mobile.util.JcrUtil;

@Component
public class TypeService {
	
	private static final Logger log = LoggerFactory.getLogger(OakRepository.class);
	
	@Autowired
	private RunAsJcrAdmin adminRunner;
	
	/* New experimental code, to create types. Not using this yet */
	public void initNodeTypes() throws Exception {
		adminRunner.run((Session session) -> {

			Workspace workspace = session.getWorkspace();

			NamespaceRegistry registry = workspace.getNamespaceRegistry();

			if (!Arrays.asList(registry.getPrefixes()).contains("meta64")) {
				registry.registerNamespace("meta64", "http://meta64.com/jcr/");
			}

			NodeTypeManager mgr = workspace.getNodeTypeManager();

//			if (dumpTypesAtStartup) {
//				log.info("Dumping NodeTypes:");
//				NodeTypeIterator iter = mgr.getAllNodeTypes();
//				while (iter.hasNext()) {
//					NodeType nodeType = iter.nextNodeType();
//					String nodeTypeName = nodeType.getName();
//					log.info("NodeType: " + nodeTypeName);
//				}
//			}

			NodeType checkNode = JcrUtil.safeGetNodeType(mgr, "meta64:newtype");
			if (checkNode != null) {
				log.info("Node type already found.");
				return;
			}

			// Create a template for the node type ...
			NodeTypeTemplate type = mgr.createNodeTypeTemplate();
			type.setName("meta64:newtype");
			// type.setDeclaredSuperTypeNames(declaredSuperTypes);
			// type.setAbstract(false);
			// type.setOrderableChildNodes(true);
			// type.setMixin(mixin);
			// type.setQueryable(queryable);
			mgr.registerNodeType(type, true);

			session.save();
		});
	}

}
