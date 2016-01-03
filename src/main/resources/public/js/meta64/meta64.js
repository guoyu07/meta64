console.log("running module: meta64.js");

/**
 * This is the central instance of the entire application, and assumes it owns
 * the entire browser.
 */
var meta64 = function() {

	var appInitialized = false;
	var curUrlPath = window.location.pathname + window.location.search;

	var _ = {

		/* used as a kind of 'sequence' in the app, when unique vals a needed */
		nextGuid : 0,

		userName : "anonymous",
		deviceWidth : 0,
		deviceHeight : 0,

		/*
		 * User's root node. Top level of what logged in user is allowed to see.
		 */
		homeNodeId : "",
		homeNodePath : "",

		/*
		 * specifies if this is admin user. Server side still protects itself
		 * from all access, even if this variable is hacked by attackers.
		 */
		isAdminUser : false,

		/* always start out as anon user until login */
		isAnonUser : true,
		anonUserLandingPageNode : null,

		/*
		 * signals that data has changed and the next time we go to the main
		 * tree view window we need to refresh data from the server
		 */
		treeDirty : false,

		/*
		 * maps node.uid values to the NodeInfo.java objects
		 * 
		 * The only contract about uid values is that they are unique insofar as
		 * any one of them always maps to the same node. Limited lifetime
		 * however. The server is simply numbering nodes sequentially. Actually
		 * represents the 'instance' of a model object. Very similar to a
		 * 'hashCode' on Java objects.
		 */
		uidToNodeMap : {},

		/*
		 * maps node.id values to NodeInfo.java objects
		 */
		idToNodeMap : {},

		/* counter for local uids */
		nextUid : 1,

		/*
		 * maps node 'identifier' (assigned at server) to uid value which is a
		 * value based off local sequence, and uses nextUid as the counter.
		 */
		identToUidMap : {},

		/*
		 * Under any given node, there can be one active 'selected' node that
		 * has the highlighting, and will be scrolled to whenever the page with
		 * that child is visited, and parentUidToFocusNodeMap holds the map of
		 * "parent uid to selected node (NodeInfo object)", where the key is the
		 * parent node uid, and the value is the currently selected node within
		 * that parent. Note this 'selection state' is only significant on the
		 * client, and only for being able to scroll to the node during
		 * navigating around on the tree.
		 */
		parentUidToFocusNodeMap : {},

		/*
		 * determines if we should render all the editing buttons on each row
		 */
		editMode : false,

		MODE_ADVANCED : "advanced",
		MODE_SIMPLE : "simple",

		/* can be 'simple' or 'advanced' */
		editModeOption : "simple",

		/*
		 * toggled by button, and holds if we are going to show properties or
		 * not on each node in the main view
		 */
		showProperties : false,

		/*
		 * List of node prefixes to flag nodes to not allow to be shown in the
		 * page in simple mode
		 */
		simpleModeNodePrefixBlackList : {
			"rep:" : true
		},

		simpleModePropertyBlackList : {},

		readOnlyPropertyList : {},

		binaryPropertyList : {},

		/*
		 * Property fields are generated dynamically and this maps the DOM IDs
		 * of each field to the property object it edits.
		 */
		fieldIdToPropMap : {},

		/*
		 * maps all node uids to true if selected, otherwise the property should
		 * be deleted (not existing)
		 */
		selectedNodes : {},

		/* RenderNodeResponse.java object */
		currentNodeData : null,

		/*
		 * all variables derivable from currentNodeData, but stored directly for
		 * simpler code/access
		 */
		currentNode : null,
		currentNodeUid : null,
		currentNodeId : null,
		currentNodePath : null,

		/* Maps from dialog module.domId to module instance */
		dialogMap : {},

		/* Maps from guid to Data Object */
		dataObjMap : {},

		/*
		 * contains the dialog objects in stacking order from bottom to topmost.
		 * If empty it means no dialogs currently displaying.
		 */
		dialogStack : [],

		updateMainMenuPanel : function() {
			popupMenuPg.build();
			popupMenuPg.init();
		},

		registerDialog : function(dlg) {
			_.dialogMap[dlg.domId] = dlg;
		},

		registerDataObject : function(data) {
			data.guid = ++_.nextGuid;
			_.dataObjMap[data.guid] = data;
		},

		getObjectByGuid : function(guid) {
			var ret = _.dataObjMap[guid];
			if (!ret) {
				console.log("data object not found: guid=" + guid);
			}
			return ret;
		},

		inSimpleMode : function() {
			return _.editModeOption === _.MODE_SIMPLE;
		},

		goToMainPage : function(rerender, forceServerRefresh) {
			_.jqueryChangePage("mainTabName");

			if (forceServerRefresh) {
				_.treeDirty = true;
			}

			if (rerender || _.treeDirty) {
				if (_.treeDirty) {
					view.refreshTree(null, true);
				} else {
					render.renderPageFromData();
				}
				_.refreshAllGuiEnablement();
			}
			/*
			 * If not re-rendering page (either from server, or from local data,
			 * then we just need to litterally switch page into visible, and
			 * scroll to node)
			 */
			else {
				view.scrollToSelectedNode();
			}
		},

		jqueryChangePage : function(pageName) {
			var ironPages = document.querySelector("#mainIronPages");
			ironPages.select(pageName);
		},

		/*
		 * If data (if provided) must be the instance data for the current
		 * instance of the dialog, and all the dialog methods are of course
		 * singletons that accept this data parameter for any opterations.
		 * (oldschool way of doing OOP with 'this' being first parameter
		 * always).
		 * 
		 * Note: each data instance is required to have a guid numberic
		 * property, unique to it.
		 * 
		 */
		changePage : function(pg, data) {
			if (typeof pg.tabId === 'undefined') {
				console.log("oops, wrong object type passed to changePage function.");
				return null;
			}

			if (pg.tabId != "popup") {
				/* this is the same as setting using mainIronPages?? */
				var paperTabs = document.querySelector("#mainPaperTabs");
				paperTabs.select(pg.tabId);
			}

			/* Opening as a popup dialog */
			if (pg.tabId == "popup") {
				if (data == null) {
					console.log("Warning: No data for popup: " + pg.tabId);
				}

				/*
				 * get container where all dialogs are created (true polymer
				 * dialogs)
				 */
				var modalsContainer = util.polyElm("modalsContainer");

				/* suffix domId for this instance/guid */
				var domId = data ? pg.domId + "-" + data.guid : pg.domId;

				/*
				 * TODO. IMPORTANT: need to put code in to remove this dialog
				 * from the dom once it's closed, AND that same code should
				 * delete the guid's object in map in this module
				 */
				var node = document.createElement("paper-dialog");
				node.setAttribute("modal", "modal");
				node.setAttribute("id", domId);
				modalsContainer.node.appendChild(node);

				Polymer.dom.flush(); // <---- is this needed ? todo
				Polymer.updateStyles();

				/* now we we finally can construct the dialog instance */
				render.buildPage(pg, data);

				console.log("Showing dialog: " + domId);

				/* now open and display polymer dialog we just created */
				var polyElm = util.polyElm(domId);
				polyElm.node.refit();
				polyElm.node.constrain();
				polyElm.node.center();
				polyElm.node.open();
			} 
			//Else a modeless dialog
			else if (pg.tabId == "dialogsTabName") {
				render.buildPage(pg);

				_.setTopDialogStackItem(pg);
				var paperTabs = document.querySelector("#dialogIronPages");
				paperTabs.select(pg.domId);

				pg.visible = true;
				util.setVisibility("#" + pg.domId, pg.visible);
			}
			else {//else will be just an arbitrary panel
				render.buildPage(pg);
			}
		},

		setTopDialogStackItem : function(pg) {
			var idx = _.dialogStack.indexOfObject(pg);

			/* if dialog already top, nothing to do here */
			if (idx == 0) {
				return;
			}
			if (idx != -1) {
				/* deletes item from position idx */
				_.dialogStack.splice(idx, 1);
			}
			// arr.splice(index, 0, item); will insert item into arr at the
			// specified index.
			// todo: implement on prototype.
			/*
			 * Array.prototype.insert = function (index, item) {
			 * this.splice(index, 0, item); };
			 */
			if (_.dialogStack.length == 0) {
				_.dialogStack.push(pg);
			} else {
				_.dialogStack.splice(0, 0, pg);
			}
			console.log("DialogStack: " + _.dialogPath());
		},

		dialogPath : function() {
			var path = '';
			for (var i = 0; i < _.dialogStack.length; i++) {
				var pg = _.dialogStack[i];
				// console.log("STACKITEM["+i+"] "+util.printObject(pg));
				path += "/" + pg.domId;
			}
			return path;
		},

		/* for now this is alias of changePage */
		openDialog : function(pg) {
			return _.changePage(pg);
		},

		/*
		 * Id is optional dialog.domId that can be passed, but if not, simply
		 * cancels dialog first child position
		 */
		cancelDialog : function(domId) {

			/*
			 * if this is the last dialog closing we can go ahead and
			 * auto-select the data view
			 */
			if (_.dialogStack.length == 1) {
				meta64.jqueryChangePage("mainTabName");
				view.scrollToSelectedNode();
			}

			/* get dialog data object (non-element class) from the map */
			var pg = _.dialogMap[domId];
			if (pg == null) {
				console.log("unable to find dialog page for: " + domId);
				return;
			}

			var idx = _.dialogStack.indexOfObject(pg);
			if (idx != -1) {
				/* deletes item from position idx */
				_.dialogStack.splice(idx, 1);
			}

			pg.visible = false;
			util.setVisibility("#" + pg.domId, pg.visible);

			/* now we have to activate that current 'top' dialog */
			if (_.dialogStack.length > 0) {
				_.changePage(_.dialogStack[0]);
			}
		},

		/*
		 * pg is JS module for the dialog (inside /pg/ folder usually)
		 */
		openDialog_unused : function(pg) {
			// [not correct here-->]var paperTabs =
			// Polymer.dom(this.root).querySelector("mainPaperTabs");

			// correct for tab selecting
			// var paperTabs = document.querySelector("#mainPaperTabs");
			// paperTabs.select("dialogTabName");

			render.buildPage(pg);

			/*
			 * I think my problem wiht dialogs may have been i need this:
			 * Polymer.dom(document).querySelector('#someId')
			 */
			var paperDialog = document.querySelector("#" + pg.domId + "DialogContainer");

			/*
			 * without the 'refit' the dialog will go fullscreen on second or
			 * third display cycle
			 */
			paperDialog.autoFitOnAttach = true;
			paperDialog.modal = true;
			paperDialog.withBackdrop = true;
			paperDialog.notifyResize();
			paperDialog.refit();
			paperDialog.center();
			paperDialog.style = "width: 600px; height: 400px";

			paperDialog.open();
		},

		popup : function() {
			render.buildPage(popupMenuPg);
			$("#" + popupMenuPg.domId).popup("open");
		},

		isNodeBlackListed : function(node) {
			if (!_.inSimpleMode())
				return false;

			var prop;
			for (prop in _.simpleModeNodePrefixBlackList) {
				if (_.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
					return true;
				}
			}

			return false;
		},

		getSelectedNodeUidsArray : function() {
			var selArray = [], idx = 0, uid;

			for (uid in _.selectedNodes) {
				if (_.selectedNodes.hasOwnProperty(uid)) {
					selArray[idx++] = uid;
				}
			}
			return selArray;
		},

		getSelectedNodeIdsArray : function() {
			var selArray = [], idx = 0, uid;

			if (!_.selectedNodes) {
				console.log("no selected nodes.");
			} else {
				console.log("selectedNode count: " + _.selectedNodes.length);
			}
			for (uid in _.selectedNodes) {
				if (_.selectedNodes.hasOwnProperty(uid)) {
					var node = _.uidToNodeMap[uid];
					if (!node) {
						console.log("unable to find uidToNodeMap for uid=" + uid);
					} else {
						selArray[idx++] = node.id;
					}
				}
			}
			return selArray;
		},

		/* Gets selected nodes as NodeInfo.java objects array */
		getSelectedNodesArray : function() {
			var selArray = [], idx = 0, uid;
			for (uid in _.selectedNodes) {
				if (_.selectedNodes.hasOwnProperty(uid)) {
					selArray[idx++] = _.uidToNodeMap[uid];
				}
			}
			return selArray;
		},

		clearSelectedNodes : function() {
			_.selectedNodes = {};
		},

		updateNodeInfoResponse : function(res, node) {
			var ownerBuf = '';
			// console.log("****** updateNodeInfoResponse: " +
			// JSON.stringify(res));
			var mine = false;

			if (res.owners) {
				$.each(res.owners, function(index, owner) {
					if (ownerBuf.length > 0) {
						ownerBuf += ",";
					}

					if (owner === meta64.userName) {
						mine = true;
					}

					ownerBuf += owner;
					// console.log("ownerbuf: "+ownerBuf);
				});
			}

			if (ownerBuf.length > 0) {
				node.owner = ownerBuf;
				var elm = $("#ownerDisplay" + node.uid);
				elm.html(" (Manager: " + ownerBuf + ")");
				if (mine) {
					util.changeOrAddClass(elm, "created-by-other", "created-by-me");
				} else {
					util.changeOrAddClass(elm, "created-by-me", "created-by-other");
				}
			}
		},

		updateNodeInfo : function(node) {
			var ironRes = util.json("getNodePrivileges", {
				"nodeId" : node.id,
				"includeAcl" : false,
				"includeOwners" : true
			});

			ironRes.completes.then(function() {
				_.updateNodeInfoResponse(ironRes.response, node);
			});
		},

		/* Returns the node with the given node.id value */
		getNodeFromId : function(id) {
			return _.idToNodeMap[id];
		},

		getPathOfUid : function(uid) {
			var node = _.uidToNodeMap[uid];
			if (!node) {
				return "[path error. invalid uid: " + uid + "]";
			} else {
				return node.path;
			}
		},

		/*
		 * All action function names must end with 'Action', and are prefixed by
		 * the action name.
		 */
		addClickListeners : function() {
			// $("#openLoginPgButton").on("click", user.openLoginPg);
			// $("#navHomeButton").on("click", nav.navHome);
			// $("#navUpLevelButton").on("click", nav.navUpLevel);
			// $("#propsToggleButton").on("click", props.propsToggle);
			$("#deletePropertyButton").on("click", props.deleteProperty);
			// $("#editModeButton").on("click", edit.editMode);
		},

		openDonatePg : function() {
			// poly remove
			// jqueryChangePage("#donatePg");
		},

		getHighlightedNode : function() {
			// console.log("getHighlightedNode looking up: " +
			// _.currentNodeUid);
			var ret = _.parentUidToFocusNodeMap[_.currentNodeUid];
			// console.log(" found it: " + (ret ? true : false));
			return ret;
		},

		highlightRowById : function(id, scroll) {
			var node = _.getNodeFromId(id);
			if (node) {
				_.highlightNode(node, scroll);
			} else {
				console.log("highlightRowById failed to find id: " + id);
			}
		},

		/*
		 * Important: We want this to be the only method that can set values on
		 * 'parentUidToFocusNodeMap', and always setting that value should go
		 * thru this function.
		 */
		highlightNode : function(node, scroll) {
			if (!node)
				return;

			var doneHighlighting = false;

			/* Unhighlight currently highlighted node if any */
			var curHighlightedNode = _.parentUidToFocusNodeMap[_.currentNodeUid];
			if (curHighlightedNode) {
				if (curHighlightedNode.uid === node.uid) {
					// console.log("already highlighted.");
					doneHighlighting = true;
				} else {
					var rowElmId = curHighlightedNode.uid + "_row";
					var rowElm = $("#" + rowElmId);
					util.changeOrAddClass(rowElm, "active-row", "inactive-row");
				}
			}

			if (!doneHighlighting) {
				_.parentUidToFocusNodeMap[_.currentNodeUid] = node;

				var rowElmId = node.uid + "_row";
				var rowElm = $("#" + rowElmId);
				util.changeOrAddClass(rowElm, "inactive-row", "active-row");
			}

			if (scroll) {
				view.scrollToSelectedNode();
			}
		},

		/*
		 * Really need to use pub/sub event to broadcast enablement, and let
		 * each component do this independently and decouple
		 */
		refreshAllGuiEnablement : function() {

//			var selNodeCount = util.getPropertyCount(meta64.selectedNodes);
//			var highlightNode = meta64.getHighlightedNode();
//			var propsToggle = meta64.currentNode && !meta64.isAnonUser;
//			var editMode = meta64.currentNode && !meta64.isAnonUser;
//			var canFinishMoving = !util.nullOrUndef(edit.nodesToMove) && !_.isAnonUser;
			
			/* multiple select nodes */
			var selNodeCount = util.getPropertyCount(_.selectedNodes);
			console.log("selCount=" + selNodeCount);

			var highlightNode = _.getHighlightedNode();

			util.setEnablement("navLogoutButton", !_.isAnonUser);
			util.setEnablement("navHomeButton", true); // _.currentNode &&
			// !nav.displayingHome());
			util.setEnablement("navUpLevelButton", _.currentNode && nav.parentVisibleToUser());

			var propsToggle = _.currentNode && !_.isAnonUser;
			/*
			 * this leaves a hole in the toolbar if you hide it. Need to change
			 * that
			 */
			util.setEnablement("propsToggleButton", propsToggle);

			util.setEnablement("deletePropertyButton", !_.isAnonUser);

			var allowEditMode = _.currentNode && !_.isAnonUser;
			// console.log(">>>>>>>>>>>>>>> currentNode=" + _.currentNode + "
			// anonUser=" + _.anonUser);
			/*
			 * this leaves a hole in the toolbar if you hide it. Need to change
			 * that
			 */
			util.setEnablement("editModeButton", allowEditMode);
			util.setEnablement("moveSelNodesButton", !_.isAnonUser && _.selectedNodes.length > 0);
			util.setEnablement("deleteSelNodesButton", !_.isAnonUser && _.selectedNodes.length > 0);
			util.setEnablement("clearSelectionsButton", !_.isAnonUser && _.selectedNodes.length > 0);
			util.setEnablement("moveSelNodesButton", !_.isAnonUser && _.selectedNodes.length > 0);
			util.setEnablement("finishMovingSelNodesButton", !_.isAnonUser && edit.nodesToMove != null);

			util.setEnablement("insNodeButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("createNodeButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("changePasswordPgButton", !_.isAnonUser);
			util.setEnablement("accountPreferencesPgButton", !_.isAnonUser);
			util.setEnablement("insertBookWarAndPeaceButton", _.isAdminUser);
			util.setEnablement("manageAttachmentsButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("editNodeSharingButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("renameNodePgButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("searchPgButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("timelineButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("showServerInfoButton", _.isAdminUser);
			util.setEnablement("showFullNodeUrlButton", highlightNode != null);
			util.setEnablement("refreshPageButton", !_.isAnonUser); 
			util.setEnablement("findSharedNodesButton", !_.isAnonUser && highlightNode != null); 
			
			util.setVisibility("insertBookWarAndPeaceButton", _.isAdminUser);
			util.setVisibility("propsToggleButton", !_.isAnonUser);
			util.setVisibility("openLoginPgButton", _.isAnonUser); 
			util.setVisibility("openSignupPgButton", _.isAnonUser); 
			util.setVisibility("mainMenuSearchButton", !_.isAnonUser && highlightNode != null);
			util.setVisibility("mainMenuTimelineButton", !_.isAnonUser && highlightNode != null);


			Polymer.dom.flush(); // <---- is this needed ? todo
			Polymer.updateStyles();
		},

		getSingleSelectedNode : function() {
			var uid;
			for (uid in _.selectedNodes) {
				if (_.selectedNodes.hasOwnProperty(uid)) {
					// console.log("found a single Sel NodeID: " + nodeId);
					return _.uidToNodeMap[uid];
				}
			}
			return null;
		},

		/* node = NodeInfo.java object */
		getOrdinalOfNode : function(node) {
			if (!_.currentNodeData || !_.currentNodeData.children)
				return -1;

			for (var i = 0; i < _.currentNodeData.children.length; i++) {
				if (node.id === _.currentNodeData.children[i].id) {
					return i;
				}
			}
			return -1;
		},

		setCurrentNodeData : function(data) {
			_.currentNodeData = data;
			_.currentNode = data.node;
			_.currentNodeUid = data.node.uid;
			_.currentNodeId = data.node.id;
			_.currentNodePath = data.node.path;
		},

		anonPageLoadResponse : function(res) {

			if (res.renderNodeResponse) {

				util.setVisibility("mainNodeContent", true);
				util.setVisibility("mainNodeStatusBar", true);

				render.renderPageFromData(res.renderNodeResponse);

				_.refreshAllGuiEnablement();
			} else {
				util.setVisibility("mainNodeContent", false);
				util.setVisibility("mainNodeStatusBar", false);

				console.log("setting listview to: " + res.content);
				util.setHtmlEnhanced("listView", res.content);
			}
			render.renderMainPageControls();
		},

		removeBinaryByUid : function(uid) {

			for (var i = 0; i < _.currentNodeData.children.length; i++) {
				var node = _.currentNodeData.children[i];
				if (node.uid === uid) {
					node.hasBinary = false;
					break;
				}
			}
		},

		/*
		 * updates client side maps and client-side identifier for new node, so
		 * that this node is 'recognized' by client side code
		 */
		initNode : function(node) {
			if (!node) {
				console.log("initNode has null node");
				return;
			}
			/*
			 * assign a property for detecting this node type, I'll do this
			 * instead of using some kind of custom JS prototype-related
			 * approach
			 */
			node.uid = util.getUidForId(_.identToUidMap, node.id);
			node.properties = props.setPreferredPropertyOrder(node.properties);

			/*
			 * For these two properties that are accessed frequently we go ahead
			 * and lookup the properties in the property array, and assign them
			 * directly as node object properties so to improve performance, and
			 * also simplify code.
			 */
			node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
			node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);

			// console.log("******* initNode uid=" + node.uid);
			_.uidToNodeMap[node.uid] = node;
			_.idToNodeMap[node.id] = node;
		},

		initConstants : function() {
			util.addAll(_.simpleModePropertyBlackList, [ //
			jcrCnst.MIXIN_TYPES, //
			jcrCnst.PRIMARY_TYPE, //
			jcrCnst.POLICY, //
			jcrCnst.IMG_WIDTH,//
			jcrCnst.IMG_HEIGHT, //
			jcrCnst.BIN_VER, //
			jcrCnst.BIN_DATA, //
			jcrCnst.BIN_MIME, //
			jcrCnst.COMMENT_BY, //
			jcrCnst.PUBLIC_APPEND ]);

			util.addAll(_.readOnlyPropertyList, [ //
			jcrCnst.PRIMARY_TYPE, //
			jcrCnst.UUID, //
			jcrCnst.MIXIN_TYPES, //
			jcrCnst.CREATED, //
			jcrCnst.CREATED_BY, //
			jcrCnst.LAST_MODIFIED, //
			jcrCnst.LAST_MODIFIED_BY,//
			jcrCnst.IMG_WIDTH, //
			jcrCnst.IMG_HEIGHT, //
			jcrCnst.BIN_VER, //
			jcrCnst.BIN_DATA, //
			jcrCnst.BIN_MIME, //
			jcrCnst.COMMENT_BY, //
			jcrCnst.PUBLIC_APPEND ]);

			util.addAll(_.binaryPropertyList, [ jcrCnst.BIN_DATA ]);
		},

		initApp : function() {
			if (appInitialized)
				return;

			console.log("initApp running.");
			appInitialized = true;

			_.initConstants();
			_.displaySignupMessage();

			/*
			 * Polymer disabled $(window).on("orientationchange",
			 * _.orientationHandler);
			 */

			$(window).bind("beforeunload", function() {
				return "Leave Meta64 ?";
			});

			/*
			 * I thought this was a good idea, but actually it destroys the
			 * session, when the user is entering an "id=\my\path" type of url
			 * to open a specific node. Need to rethink this. Basically for now
			 * I'm thinking going to a different url shouldn't blow up the
			 * session, which is what 'logout' does.
			 * 
			 * $(window).on("unload", function() { user.logout(false); });
			 */

			/*
			 * Polymer->disabled _.addClickListeners();
			 */

			_.deviceWidth = $(window).width();
			_.deviceHeight = $(window).height();

			/*
			 * This call checks the server to see if we have a session already,
			 * and gets back the login information from the session, and then
			 * renders page content, after that.
			 */
			user.refreshLogin();

			/*
			 * Check for screen size in a timer. We don't want to monitor actual
			 * screen resize events because if a user is expanding a window we
			 * basically want to limit the CPU and chaos that would ensue if we
			 * tried to adjust things every time it changes. So we throttle back
			 * to only reorganizing the screen once per second. This timer is a
			 * throttle sort of. Yes I know how to listen for events. No I'm not
			 * doing it wrong here. This timer is correct in this case and
			 * behaves superior to events.
			 */
			/*
			 * Polymer->disable
			 * 
			 * setInterval(function() { var width = $(window).width();
			 * 
			 * if (width != _.deviceWidth) { // console.log("Screen width
			 * changed: " + width);
			 * 
			 * _.deviceWidth = width; _.deviceHeight = $(window).height();
			 * 
			 * _.screenSizeChange(); } }, 1500);
			 */

			_.updateMainMenuPanel();
			_.refreshAllGuiEnablement();
		},

		displaySignupMessage : function() {
			var signupResponse = $("#signupCodeResponse").text();
			if (signupResponse === "ok") {
				alert("Signup complete. You may now login.");
			}
		},

		screenSizeChange : function() {
			if (_.currentNodeData) {

				if (meta64.currentNode.imgId) {
					render.adjustImageSize(meta64.currentNode);
				}

				$.each(_.currentNodeData.children, function(i, node) {
					if (node.imgId) {
						render.adjustImageSize(node);
					}
				});
			}
		},

		/* Don't need this method yet, and haven't tested to see if works */
		orientationHandler : function(event) {
			// if (event.orientation) {
			// if (event.orientation === 'portrait') {
			// } else if (event.orientation === 'landscape') {
			// }
			// }
		},

		loadAnonPageHome : function(ignoreUrl) {
			util.json("anonPageLoad", {
				"ignoreUrl" : ignoreUrl
			}, _.anonPageLoadResponse);
		}
	};

	console.log("Module ready: meta64.js");
	return _;
}();

//# sourceURL=meta64.js
