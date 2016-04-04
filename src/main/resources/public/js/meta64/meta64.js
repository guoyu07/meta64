console.log("running module: meta64.js");

/**
 * Main Application instance, and central root level object for all code, although each module generally contributes one
 * singleton variable to the global scope, with a name usually identical to that file.
 */
var meta64 = function() {

	var appInitialized = false;
	var curUrlPath = window.location.pathname + window.location.search;

	var _ = {

		/* used as a kind of 'sequence' in the app, when unique vals a needed */
		nextGuid : 0,

		/* name of currently logged in user */
		userName : "anonymous",
		
		/* screen capabilities */
		deviceWidth : 0,
		deviceHeight : 0,

		/*
		 * User's root node. Top level of what logged in user is allowed to see.
		 */
		homeNodeId : "",
		homeNodePath : "",

		/*
		 * specifies if this is admin user.
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
		 * maps node.uid values to NodeInfo.java objects
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

		/* User-selectable user-account options each user can set on his account */
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

		/* Maps from guid to Data Object */
		dataObjMap : {},

		updateMainMenuPanel : function() {
			console.log("building main menu panel");
			menuPanel.build();
			menuPanel.init();
		},

		/*
		 * Creates a 'guid' on this object, and makes dataObjMap able to look up
		 * the object using that guid in the future.
		 */
		registerDataObject : function(data) {
			if (!data.guid) {
				data.guid = ++_.nextGuid;
				_.dataObjMap[data.guid] = data;
			}
		},

		getObjectByGuid : function(guid) {
			var ret = _.dataObjMap[guid];
			if (!ret) {
				console.log("data object not found: guid=" + guid);
			}
			return ret;
		},

		/*
		 * If callback is a string, it will be interpreted as a script to run,
		 * or if it's a function object that will be the function to run.
		 * 
		 * Whenever we are building an onClick string, and we have the actual
		 * function, rather than the name of the function (i.e. we have the
		 * function object and not a string representation we hande that by
		 * assigning a guid to the function object, and then encode a call to
		 * run that guid by calling runCallback. There is a level of indirection
		 * here, but this is the simplest approach when we need to be able to
		 * map from a string to a function.
		 * 
		 * ctx=context, which is the 'this' to call with if we have a function,
		 * and have a 'this' context to bind to it.
		 */
		encodeOnClick : function(callback, ctx) {
			if (typeof callback == "string") {
				return callback;
			} //
			else if (typeof callback == "function") {
				_.registerDataObject(callback);

				if (ctx) {
					_.registerDataObject(ctx);
					return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
				} else {
					return "meta64.runCallback(" + callback.guid + ");";
				}
			}
		},

		runCallback : function(guid, ctx) {
			var dataObj = _.getObjectByGuid(guid);

			// if this is an object, we expect it to have a 'callback' property
			// that is a function
			if (dataObj.callback) {
				dataObj.callback();
			}
			// or else sometimes the registered object itself is the function,
			// which is ok too
			else if (typeof dataObj == 'function') {
				if (ctx) {
					var thiz = _.getObjectByGuid(ctx);
					dataObj.call(thiz);
				} else {
					dataObj();
				}
			} else {
				alert("unable to find callback on registered guid: " + guid);
			}
		},

		inSimpleMode : function() {
			return _.editModeOption === _.MODE_SIMPLE;
		},

		refresh : function() {
			_.goToMainPage(true, true);
		},
		
		goToMainPage : function(rerender, forceServerRefresh) {

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

		selectTab : function(pageName) {
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

			/* this is the same as setting using mainIronPages?? */
			var paperTabs = document.querySelector("#mainPaperTabs");
			paperTabs.select(pg.tabId);
		},

		/* for now this is alias of changePage */
		openDialog : function(pg) {
			return _.changePage(pg);
		},

		popup : function() {
			alert("popup function: "+menuPanel.domId);
			render.buildPage(menuPanel);
			$("#" + menuPanel.domId).popup("open");
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

			/* multiple select nodes */
			var selNodeCount = util.getPropertyCount(_.selectedNodes);
			var highlightNode = _.getHighlightedNode();

			util.setEnablement("navLogoutButton", !_.isAnonUser);
			util.setEnablement("navLoginButton", _.isAnonUser);
			util.setEnablement("openSignupPgButton", _.isAnonUser);

			var propsToggle = _.currentNode && !_.isAnonUser;
			util.setEnablement("propsToggleButton", propsToggle);

			util.setEnablement("deletePropertyButton", !_.isAnonUser);

			var allowEditMode = _.currentNode && !_.isAnonUser;

			util.setEnablement("editModeButton", allowEditMode);
			util.setEnablement("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
			util.setEnablement("moveSelNodesButton", !_.isAnonUser && selNodeCount > 0);
			util.setEnablement("deleteSelNodesButton", !_.isAnonUser && selNodeCount > 0);
			util.setEnablement("clearSelectionsButton", !_.isAnonUser && selNodeCount > 0);
			util.setEnablement("moveSelNodesButton", !_.isAnonUser && selNodeCount > 0);
			util.setEnablement("finishMovingSelNodesButton", !_.isAnonUser && edit.nodesToMove != null);

			util.setEnablement("changePasswordPgButton", !_.isAnonUser);
			util.setEnablement("accountPreferencesPgButton", !_.isAnonUser);
			util.setEnablement("insertBookWarAndPeaceButton", _.isAdminUser);
			util.setEnablement("uploadFromFileButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("uploadFromUrlButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("deleteAttachmentsButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("editNodeSharingButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("renameNodePgButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("searchDlgButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("timelineButton", !_.isAnonUser && highlightNode != null);
			util.setEnablement("showServerInfoButton", _.isAdminUser);
			util.setEnablement("showFullNodeUrlButton", highlightNode != null);
			util.setEnablement("refreshPageButton", !_.isAnonUser);
			util.setEnablement("findSharedNodesButton", !_.isAnonUser && highlightNode != null);

			util.setVisibility("navHomeButton", !_.isAnonUser);
			util.setVisibility("editModeButton", allowEditMode);
			util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
			util.setVisibility("insertBookWarAndPeaceButton", _.isAdminUser);
			util.setVisibility("propsToggleButton", !_.isAnonUser);
			util.setVisibility("openLoginDlgButton", _.isAnonUser);
			util.setVisibility("navLogoutButton", !_.isAnonUser);
			util.setVisibility("openSignupPgButton", _.isAnonUser);
			util.setVisibility("mainMenuSearchButton", !_.isAnonUser && highlightNode != null);
			util.setVisibility("mainMenuTimelineButton", !_.isAnonUser && highlightNode != null);

			Polymer.dom.flush(); // <---- is this needed ? todo-3
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
			node.properties = props.getPropertiesInEditingOrder(node.properties);

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
			 * todo-3: how does orientationchange need to work for polymer?
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
				(new MessageDlg("Signup complete. You may now login.")).open();
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
