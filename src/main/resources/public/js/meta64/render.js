console.log("running module: render.js");

var render = function() {
	var _debug = false;

	/*
	 * This is the content displayed when the user signs in, and we see that
	 * they have no content being displayed. We want to give them some
	 * instructions and the ability to add content.
	 */
	function _getEmptyPagePrompt() {
		/* Construct Create Subnode Button */
		var createSubNodeButton = _.tag("paper-button", //
		{
			"raised" : "raised",
			"onClick" : "edit.createSubNode();"
		}, "Create Content");

		return createSubNodeButton;
	}

	function _renderBinary(node) {
		/*
		 * If this is an image render the image directly onto the page as a
		 * visible image
		 */
		if (node.binaryIsImage) {
			return _.makeImageTag(node);
		}
		/*
		 * If not an image we render a link to the attachment, so that it can be
		 * downloaded.
		 */
		else {
			var anchor = _.tag("a", {
				"href" : _.getUrlForNodeAttachment(node)
			}, "[Download Attachment]");

			return _.tag("div", {
				"class" : "binary-link"
			}, anchor);
		}
	}

	var _ = {
		/*
		 * Important little method here. All GUI page/divs are created using
		 * this sort of specification here that they all must have a 'build'
		 * method that is called first time only, and then the 'init' method
		 * called before each time the component gets displayed with new
		 * information.
		 * 
		 * If 'data' is provided, this is the instance data for the dialog
		 */
		buildPage : function(pg, data) {
			console.log("buildPage: pg.domId=" + pg.domId);

			if (!pg.built || data) {
				pg.build(data);
				pg.built = true;
			}

			if (!data) {
				meta64.registerDialog(pg);
			}

			if (pg.init) {
				pg.init(data);
			}
		},

		/*
		 * node: JSON of NodeInfo.java
		 */
		renderNodeContent : function(node, showPath, showName, renderBinary, rowStyling) {
			var headerText = "";
			var ret = "";

			ret += _.getTopRightImageTag(node);

			var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);

			// I think path on always for now
			showPath = true;
			// if (showPath && meta64.editMode) {

			headerText += "<div class='path-display'>Path: " + _.formatPath(node) + "</div>";
			headerText += "<div>";

			if (commentBy) {
				var clazz = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
				headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
			} //
			else if (node.createdBy) {
				var clazz = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
				headerText += "<span class='" + clazz + "'>Created By: " + node.createdBy + "</span>";
			}

			headerText += "<span id='ownerDisplay" + node.uid + "'></span>";
			if (node.lastModified) {
				headerText += "  Modified: " + node.lastModified;
			}
			headerText += "</div>";
			// }

			/*
			 * on root node name will be empty string so don't show that
			 * 
			 * commenting: I decided users will understand the path as a single
			 * long entity with less confusion than breaking out the name for
			 * them. They already unserstand internet URLs. This is the same
			 * concept. No need to baby them.
			 * 
			 * The !showPath condition here is because if we are showing the
			 * path then the end of that is always the name, so we don't need to
			 * show the path AND the name. One is a substring of the other.
			 */
			if (showName && !showPath && node.name) {
				headerText += "Name: " + node.name + " [uid=" + node.uid + "]";
			}

			if (headerText) {
				ret += _.tag("div", {
					"class" : "header-text"
				}, headerText);
			}

			if (meta64.showProperties) {
				// console.log("showProperties = " +
				// meta64.showProperties);
				var properties = props.renderProperties(node.properties);
				if (properties) {
					ret += /* "<br>" + */properties;
				}
			} else {
				var contentProp = props.getNodeProperty(jcrCnst.CONTENT, node);
				// console.log("contentProp: " + contentProp);
				if (contentProp) {

					var jcrContent = props.renderProperty(contentProp);

					if (jcrContent.length > 0) {
						if (rowStyling) {
							ret += _.tag("div", {
								"class" : "jcr-content"
							}, jcrContent);
						} else {
							ret += _.tag("div", {
								"class" : "jcr-root-content"
							}, jcrContent);
						}
					}
				}
			}

			if (renderBinary && node.hasBinary) {
				var binary = _renderBinary(node);

				/*
				 * We append the binary image or resource link either at the end
				 * of the text or at the location where the user has put
				 * {{insert-attachment}} if they are using that to make the
				 * image appear in a specific locatio in the content text.
				 */
				if (ret.contains(cnst.INSERT_ATTACHMENT)) {
					ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
				} else {
					ret += binary;
				}
			}

			/*
			 * If this is a comment node, but not by the current user (because
			 * they cannot reply to themselves) then add a reply button, so they
			 * can reply to some other use.
			 */
			if (commentBy && commentBy != meta64.userName) {
				var replyButton = _.tag("a", //
				{
					"onClick" : "edit.replyToComment('" + node.uid + "');" //
				}, //
				"Reply");
				ret += replyButton;
			}
			/*
			 * Otherwise check if this is a publicly appendable node and show a
			 * button that does same as above but is labeled "Add Comment"
			 * instead of "Reply". Note the check against userName, makes sure
			 * the button doesn't show up on nodes we own, so we never are asked
			 * to "Add Comment" to our own content.
			 */
			else {
				var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, node);
				if (publicAppend && commentBy != meta64.userName) {
					var addCommentButton = _.tag("a", //
					{
						"onClick" : "edit.replyToComment('" + node.uid + "');" //
					}, //
					"Add Comment");

					var addCommentDiv = _.tag("div", {}, addCommentButton);
					ret += addCommentDiv;
				}
			}

			return ret;
		},

		/*
		 * This is the primary method for rendering each node (like a row) on
		 * the main HTML page that displays node content. This generates the
		 * HTML for a single row/node.
		 * 
		 * node is a NodeInfo.java JSON
		 */
		renderNodeAsListItem : function(node, index, count, rowCount) {

			var uid = node.uid;
			var canMoveUp = index > 0 && rowCount > 1;
			var canMoveDown = index < count - 1;

			/*
			 * TODO: this checking of "rep:" is just a hack for now to stop from
			 * deleting things I won't want to allow to delete, but I will
			 * design this better later.
			 */
			var isRep = node.name.startsWith("rep:") || meta64.currentNodeData.node.path.contains("/rep:");
			var editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
					&& !props.isNonOwnedNode(node);

			/*
			 * if not selected by being the new child, then we try to select
			 * based on if this node was the last one clicked on for this page.
			 */
			// console.log("test: [" + parentIdToFocusIdMap[currentNodeId]
			// +"]==["+ node.id + "]")
			var focusNode = meta64.getHighlightedNode();
			var selected = (focusNode && focusNode.uid === uid);

			var buttonBarHtml = _.makeRowButtonBarHtml(uid, canMoveUp, canMoveDown, editingAllowed);
			var bkgStyle = _.getNodeBkgImageStyle(node);

			var cssId = uid + "_row";
			// console.log("Rendering Node Row[" + index + "] with id: " +cssId)
			return _.tag("div", //
			{
				"class" : "node-table-row" + (selected ? " active-row" : " inactive-row"),
				"onClick" : "nav.clickOnNodeRow(this, '" + uid + "');", //
				"id" : cssId,
				"style" : bkgStyle
			},// 
			buttonBarHtml + _.tag("div", //
			{
				"id" : uid + "_content"
			}, _.renderNodeContent(node, true, true, true, true)));
		},

		showNodeUrl : function() {
			var node = meta64.getHighlightedNode();
			if (!node) {
				messagePg.alert("You must first click on a node.");
				return;
			}
			var url = window.location.origin + "?id=" + node.path;
			meta64.jqueryChangePage("mainTabName");

			var message = "URL using path: <br>" + url;
			var uuid = props.getNodePropertyVal("jcr:uuid", node);
			if (uuid) {
				message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
			}

			messagePg.showMessage("URL of Node", message);
		},

		getTopRightImageTag : function(node) {
			var topRightImg = props.getNodePropertyVal('img.top.right', node);
			var topRightImgTag = "";
			if (topRightImg) {
				topRightImgTag = _.tag("img", {
					"src" : topRightImg,
					"class" : "top-right-image"
				}, "", false);
			}
			return topRightImgTag;
		},

		getNodeBkgImageStyle : function(node) {
			var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
			var bkgImgStyle = "";
			if (bkgImg) {
				bkgImgStyle = "background-image: url(" + bkgImg + ");";
			}
			return bkgImgStyle;
		},

		makeRowButtonBarHtml : function(uid, canMoveUp, canMoveDown, editingAllowed) {

			var openButton = selButton = createSubNodeButton = editNodeButton = //
			moveNodeUpButton = moveNodeDownButton = insertNodeButton = "";

			/* Construct Open Button */
			if (_.nodeHasChildren(uid)) {
				openButton = _.tag("paper-button", //
				{
					"class" : "highlight-button",
					"raised" : "raised",
					"onClick" : "nav.openNode('" + uid + "');"//
				}, //
				"Open");
			}

			/*
			 * If in edit mode we always at least create the potential (buttons)
			 * for a user to insert content, and if they don't have privileges
			 * the server side security will let them know. In the future we can
			 * add more intelligence to when to show these buttons or not.
			 */
			if (meta64.editMode) {
				// console.log("Editing allowed: " + nodeId);

				var selected = meta64.selectedNodes[uid] == true ? "true" : "false";

				console.log("      nodeId " + uid + " selected=" + selected);

				selButton = _.tag("paper-button", //
				{
					"class" : "custom-toggle",
					"toggles" : "toggles",
					"raised" : "raised",
					"id" : uid + "_sel",//
					"onClick" : "nav.toggleNodeSel('" + uid + "');",
					"active" : selected
				}, "Sel");

				if (cnst.NEW_ON_TOOLBAR) {
					/* Construct Create Subnode Button */
					createSubNodeButton = _.tag("paper-button", //
					{
						"raised" : "raised",
						"onClick" : "edit.createSubNode('" + uid + "');"
					}, "Add");
				}

				if (cnst.INS_ON_TOOLBAR) {
					/* Construct Create Subnode Button */
					insertNodeButton = _.tag("paper-button", //
					{
						"raised" : "raised",
						"onClick" : "edit.insertNode('" + uid + "');"
					}, "Ins");
				}
			}

			if (meta64.editMode && editingAllowed) {

				/* Construct Create Subnode Button */
				editNodeButton = _.tag("paper-button", //
				{
					"raised" : "raised",
					"onClick" : "edit.runEditNode('" + uid + "');"
				}, "Edit");

				if (meta64.currentNode.childrenOrdered) {

					if (canMoveUp) {
						/* Construct Create Subnode Button */
						moveNodeUpButton = _.tag("paper-button", //
						{
							"raised" : "raised",
							"onClick" : "edit.moveNodeUp('" + uid + "');"
						}, "Up");
					}

					if (canMoveDown) {
						/* Construct Create Subnode Button */
						moveNodeDownButton = _.tag("paper-button", //
						{
							"raised" : "raised",
							"onClick" : "edit.moveNodeDown('" + uid + "');"
						}, "Dn");
					}
				}
			}

			var allButtons = selButton + openButton + insertNodeButton + createSubNodeButton + editNodeButton
					+ moveNodeUpButton + moveNodeDownButton;

			if (allButtons.length > 0) {
				return _.makeHorizontalFieldSet(allButtons);
			} else {
				return "";
			}
		},

		makeDialogHeader : function(text) {
			return _.tag("h2", {}, text);
		},
		
		makeHorizontalFieldSet : function(content, extraClasses) {

			/* Now build entire control bar */
			return _.tag("div", //
			{
				"class" : "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
			}, content, true);
		},

		makeHorzControlGroup : function(content) {
			return _.tag("div", {
				"class" : "horizontal layout"
			}, content, true);
		},

		/*
		 * this is not yet used, and paper-checkbox is not polymer imported yet
		 * makeCheckBox : function(name, id, on) { return
		 * _.tag("paper-checkbox", // { "id" : id, "checked" : on ? "checked" :
		 * "unchecked" }, "", true) + //
		 * 
		 * _.tag("label", { "for" : id }, name); },
		 */

		makeRadioButton : function(label, id) {
			return _.tag("paper-radio-button", //
			{
				"id" : id,
				"name" : id
			}, label);
		},

		/*
		 * Returns true if the nodeId (see makeNodeId()) NodeInfo object has
		 * 'hasChildren' true
		 */
		nodeHasChildren : function(uid) {
			var node = meta64.uidToNodeMap[uid];
			if (!node) {
				console.log("Unknown nodeId in nodeHasChildren: " + uid);
				return false;
			} else {
				return node.hasChildren;
			}
		},

		formatPath : function(node) {
			var path = node.path;
			/*
			 * TODO: This will fail now that jcr: is removed because it can
			 * match and corrupt any path that happens to start with root!
			 * BEWARE! FIX!
			 */
			var ret = meta64.isAdminUser ? path : path.replaceAll("/root", "");
			ret += " [" + node.primaryTypeName + "]";
			return ret;
		},

		wrapHtml : function(text) {
			return "<div>" + text + "</div>";
		},

		/*
		 * Each page can show buttons at the top of it (not main header buttons
		 * but additional buttons just for that page only, and this generates
		 * that content for that entire control bar.
		 */
		renderMainPageControls : function() {
			var html = '';

			var hasContent = html.length > 0;
			if (hasContent) {
				util.setHtmlEnhanced("mainPageControls", html);
			}

			util.setVisibility("#mainPageControls", hasContent)
		},

		/*
		 * Renders page and always also takes care of scrolling to selected node
		 * if there is one to scroll to
		 */
		renderPageFromData : function(data) {

			console.log("render.renderPageFromData()");

			var newData = false;
			if (!data) {
				data = meta64.currentNodeData;
			} else {
				newData = true;
			}

			if (!data || !data.node) {
				util.setVisibility("#listView", false);
				$("#mainNodeContent").html("No content is available here.");
				return;
			} else {
				util.setVisibility("#listView", true);
			}

			_.renderMainPageControls();
			meta64.treeDirty = false;

			if (newData) {
				meta64.uidToNodeMap = {};
				meta64.idToNodeMap = {};

				/*
				 * I'm choosing to reset selected nodes when a new page loads,
				 * but this is not a requirement. I just don't have a "clear
				 * selections" feature which would be needed so user has a way
				 * to clear out.
				 */
				meta64.selectedNodes = {};

				meta64.initNode(data.node);
				meta64.setCurrentNodeData(data);
			}

			var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;

			if (_debug) {
				console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
			}

			var output = '';
			var bkgStyle = _.getNodeBkgImageStyle(data.node);

			// String mainNodePath =_.formatPath(data.node);
			// now set to content at dom id mainSubHeading

			/*
			 * NOTE: mainNodeContent is the parent node of the page content, and
			 * is always the node displayed at the to of the page above all the
			 * other nodes which are its child nodes.
			 */
			var mainNodeContent = _.renderNodeContent(data.node, true, true, true, false);

			// console.log("mainNodeContent: "+mainNodeContent);
			if (mainNodeContent.length > 0) {
				var uid = data.node.uid;
				var cssId = uid + "_row";
				var buttonBar = "";
				var upLevelButton = "";
				var editNodeButton = "";

				/* Add edit button if edit mode and this isn't the root */
				if (meta64.editMode && data.node.path != "/" &&
				/*
				 * Check that if we have a commentBy property we are the
				 * commenter, before allowing edit button also.
				 */
				!props.isNonOwnedCommentNode(data.node) && //
				!props.isNonOwnedNode(data.node)) {

					/* Construct Create Subnode Button */
					editNodeButton = _.tag("paper-button", //
					{
						"raised" : "raised",
						"onClick" : "edit.runEditNode('" + uid + "');"
					}, "Edit");
				}

				var focusNode = meta64.getHighlightedNode();
				var selected = focusNode && focusNode.uid === uid;
				
				if (meta64.currentNode && nav.parentVisibleToUser()) {

					/* Construct Create Subnode Button */
					upLevelButton = _.tag("paper-button", //
					{
						"class" : "highlight-button",
						"raised" : "raised",
						"onClick" : "nav.navUpLevel();"
					}, "Up Level");
				}

				if (upLevelButton || editNodeButton) {
					buttonBar = _.makeHorizontalFieldSet(upLevelButton + editNodeButton);
				}

				var content = _.tag("div", //
				{
					"class" : (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
					"onClick" : "nav.clickOnNodeRow(this, '" + uid + "');",
					"id" : cssId
				},// 
				buttonBar + mainNodeContent);

				$("#mainNodeContent").show();
				$("#mainNodeContent").html(content);
			} else {
				$("#mainNodeContent").hide();
			}

			// console.log("update status bar.");
			view.updateStatusBar();

			// console.log("rendering page controls.");
			_.renderMainPageControls();

			if (data.children) {
				var childCount = data.children.length;
				// console.log("childCount: " + childCount);
				/*
				 * Number of rows that have actually made it onto the page to
				 * far. Note: some nodes get filtered out on the client side for
				 * various reasons.
				 */
				var rowCount = 0;

				for (var i = 0; i < data.children.length; i++) {
					var node = data.children[i];
					var row = _.generateRow(i, node, newData, childCount, rowCount);
					if (row.length != 0) {
						output += row;
						rowCount++;
					}
				}
			}

			if (output.length == 0 && !meta64.isAnonUser) {
				output = _getEmptyPagePrompt();
			}

			util.setHtmlEnhanced("listView", output);

			/*
			 * TODO: Instead of calling screenSizeChange here immediately, it
			 * would be better to set the image sizes exactly on the attributes
			 * of each image, as the HTML text is rendered before we even call
			 * setHtmlEnhancedById, so that images always are GUARANTEED to
			 * render correctly immediately.
			 */
			meta64.screenSizeChange();

			if (!meta64.getHighlightedNode()) {
				view.scrollToTop();
			} else {
				view.scrollToSelectedNode();
			}
		},

		generateRow : function(i, node, newData, childCount, rowCount) {

			if (meta64.isNodeBlackListed(node))
				return "";

			if (newData) {
				meta64.initNode(node);

				if (_debug) {
					console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
				}
			}

			rowCount++; // warning: this is the local variable/parameter
			var row = _.renderNodeAsListItem(node, i, childCount, rowCount);
			// console.log("row[" + rowCount + "]=" + row);
			return row;
		},

		getUrlForNodeAttachment : function(node) {
			return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
		},

		/* see also: makeImageTag() */
		adjustImageSize : function(node) {

			var elm = $("#" + node.imgId);
			if (elm) {
				// var width = elm.attr("width");
				// var height = elm.attr("height");
				// console.log("width=" + width + " height=" + height);

				if (node.width && node.height) {

					/*
					 * New Logic is try to display image at 150% meaning it can
					 * go outside the content div it's in, which we want, but
					 * then we also limit it with max-width so on smaller screen
					 * devices or small window resizings even on desktop
					 * browsers the image will always be entirely visible and
					 * not clipped.
					 */
					// var maxWidth = meta64.deviceWidth - 80;
					// elm.attr("width", "150%");
					// elm.attr("height", "auto");
					// elm.attr("style", "max-width: " + maxWidth + "px;");
					/*
					 * DO NOT DELETE (for a long time at least) This is the old
					 * logic for resizing images responsively, and it works fine
					 * but my new logic is better, with limiting max width based
					 * on screen size. But keep this old code for now..
					 */
					if (node.width > meta64.deviceWidth - 80) {

						/* set the width we want to go for */
						// var width = meta64.deviceWidth - 80;
						/*
						 * and set the height to the value it needs to be at for
						 * same w/h ratio (no image stretching)
						 */
						// var height = width * node.height / node.width;
						elm.attr("width", "100%");
						elm.attr("height", "auto");
						// elm.attr("style", "max-width: " + maxWidth + "px;");
					}
					/*
					 * Image does fit on screen so render it at it's exact size
					 */
					else {
						elm.attr("width", node.width);
						elm.attr("height", node.height);
					}
				}
			}
		},

		/* see also: adjustImageSize() */
		makeImageTag : function(node) {
			var src = _.getUrlForNodeAttachment(node);
			node.imgId = "imgUid_" + node.uid;

			if (node.width && node.height) {

				/*
				 * if image won't fit on screen we want to size it down to fit
				 * 
				 * Yes, it would have been simpler to just use something like
				 * width=100% for the image width but then the hight would not
				 * be set explicitly and that would mean that as images are
				 * loading into the page, the effective scroll position of each
				 * row will be increasing each time the URL request for a new
				 * image completes. What we want is to have it so that once we
				 * set the scroll position to scroll a particular row into view,
				 * it will stay the correct scroll location EVEN AS the images
				 * are streaming in asynchronously.
				 * 
				 */
				if (node.width > meta64.deviceWidth - 50) {

					/* set the width we want to go for */
					var width = meta64.deviceWidth - 50;

					/*
					 * and set the height to the value it needs to be at for
					 * same w/h ratio (no image stretching)
					 */
					var height = width * node.height / node.width;

					return _.tag("img", {
						"src" : src,
						"id" : node.imgId,
						"width" : width + "px",
						"height" : height + "px"
					}, null, false);
				}
				/* Image does fit on screen so render it at it's exact size */
				else {
					return _.tag("img", {
						"src" : src,
						"id" : node.imgId,
						"width" : node.width + "px",
						"height" : node.height + "px"
					}, null, false);
				}
			} else {
				return _.tag("img", {
					"src" : src,
					"id" : node.imgId
				}, null, false);
			}
		},

		/*
		 * creates HTML tag with all attributes/values specified in attributes
		 * object, and closes the tag also if content is non-null
		 */
		tag : function(tag, attributes, content, closeTag) {

			/* default parameter values */
			if (typeof (closeTag) === 'undefined')
				closeTag = true;

			/* HTML tag itself */
			var ret = "<" + tag;

			if (attributes) {
				ret += " ";
				$.each(attributes, function(k, v) {
					/*
					 * we intelligently wrap strings that contain single quotes
					 * in double quotes and vice versa
					 */
					if (v.contains("'")) {
						ret += k + "=\"" + v + "\" ";
					} else {
						ret += k + "='" + v + "' ";
					}
				});
			}

			if (closeTag) {
				ret += ">" + content + "</" + tag + ">";
			} else {
				ret += "/>";
			}

			return ret;
		},

		makeTextArea : function(fieldName, fieldId) {
			return _.tag("paper-textarea", {
				"name" : fieldId,
				"label" : fieldName,
				"id" : fieldId
			}, "", true);
		},

		makeEditField : function(fieldName, fieldId) {
			return _.tag("paper-input", {
				"name" : fieldId,
				"label" : fieldName,
				"id" : fieldId
			}, "", true);
		},

		makePasswordField : function(fieldName, fieldId) {
			return _.tag("paper-input", {
				"type" : "password",
				"name" : fieldId,
				"label" : fieldName,
				"id" : fieldId
			}, "", true);
		},

		makeButton : function(text, id, callback) {
			var attribs = {
				"raised" : "raised",
				"id" : id
			};

			if (callback != undefined) {
				attribs.onClick = callback;
			}

			return _.tag("paper-button", attribs, text, true);
		},

		/*
		 * domId is id of dialog being closed.
		 */
		makeBackButton : function(text, id, domId, callback) {

			if (callback === undefined) {
				callback = "";
			}

			return _.tag("paper-button", {
				"raised" : "raised",
				"id" : id,
				"onClick" : "meta64.cancelDialog('" + domId + "');" + callback
			}, text, true);
		},

		/*
		 * domId is id of dialog being closed.
		 */
		makePopupBackButton : function(text, id, domId, callback) {

			if (callback === undefined) {
				callback = "";
			}

			return _.tag("paper-button", {
				"raised" : "raised",
				"dialog-confirm" : "dialog-confirm",
				"id" : id,
				"onClick" : callback
			}, text, true);
		},

		allowPropertyToDisplay : function(propName) {
			if (!meta64.inSimpleMode())
				return true;
			return meta64.simpleModePropertyBlackList[propName] == null;
		},

		isReadOnlyProperty : function(propName) {
			return meta64.readOnlyPropertyList[propName];
		},

		isBinaryProperty : function(propName) {
			return meta64.binaryPropertyList[propName];
		},

		sanitizePropertyName : function(propName) {
			if (meta64.editModeOption === "simple") {
				return propName === jcrCnst.CONTENT ? "Content" : propName;
			} else {
				return propName;
			}
		}
	};

	console.log("Module ready: render.js");
	return _;
}();

// # sourceUrl=render.js
