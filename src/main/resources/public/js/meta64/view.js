console.log("running module: view.js");

var view = function() {

	var scrollToSelNodePending = false;

	var _ = {
		updateStatusBar : function() {
			if (!meta64.currentNodeData)
				return;
			var statusLine = "";

			if (meta64.editModeOption === meta64.MODE_ADVANCED) {
				statusLine += "count: " + meta64.currentNodeData.children.length;
			}

			if (meta64.editMode) {
				statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
			}

			var visible = statusLine.length > 0;
			util.setVisibility("mainNodeStatusBar", visible);

			if (visible) {
				util.setHtmlEnhanced("mainNodeStatusBar", statusLine);
			}
		},

		/*
		 * newId is optional parameter which, if supplied, should be the id we
		 * scroll to when finally done with the render.
		 */
		refreshTreeResponse : function(res, targetId, renderParentIfLeaf, newId) {

			render.renderPageFromData(res);

			if (newId) {
				meta64.highlightRowById(newId, true);
			} else {
				/*
				 * TODO-3: Why wasn't this just based on targetId ? This if
				 * condition is too confusing.
				 */
				if (targetId && renderParentIfLeaf && res.displayedParent) {
					meta64.highlightRowById(targetId, true);
				} else {
					_.scrollToSelectedNode();
				}
			}
			meta64.refreshAllGuiEnablement();
		},

		/*
		 * newId is optional and if specified makes the page scroll to and
		 * highlight that node upon re-rendering.
		 */
		refreshTree : function(nodeId, renderParentIfLeaf, newId) {
			if (!nodeId) {
				nodeId = meta64.currentNodeId;
			}

			console.log("Refreshing tree: nodeId=" + nodeId);

			var ironRes = util.json("renderNode", {
				"nodeId" : nodeId,
				"renderParentIfLeaf" : renderParentIfLeaf ? true : false
			});

			ironRes.completes.then(function() {
				_.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
			});
		},

		/*
		 * todo-3: this scrolling is slightly imperfect. sometimes the code
		 * switches to a tab, which triggers scrollToTop, and then some other
		 * code scrolls to a specific location a fraction of a second later. the
		 * 'pending' boolean here is a crutch for now to help visual appeal
		 * (i.e. stop if from scrolling to one place and then scrolling to a
		 * different place a fraction of a second later)
		 */
		scrollToSelectedNode : function() {
			scrollToSelNodePending = true;

			setTimeout(function() {
				scrollToSelNodePending = false;

				var elm = nav.getSelectedPolyElement();
				if (elm && elm.node && typeof elm.node.scrollIntoView =='function') {
					elm.node.scrollIntoView();
				}
				// If we couldn't find a selected node on this page, scroll to
				// top instead.
				else {
					elm = util.polyElm("mainPaperTabs");
					if (elm && elm.node && typeof elm.node.scrollIntoView =='function') {
						elm.node.scrollIntoView();
					}
				}
			}, 1000);
		},

		/*
		 * todo-3: The following was in a polymer example (can I use this?):
		 * app.$.headerPanelMain.scrollToTop(true);
		 */
		scrollToTop : function() {
			if (scrollToSelNodePending)
				return;

			setTimeout(function() {
				if (scrollToSelNodePending)
					return;

				var elm = util.polyElm("mainPaperTabs");
				if (elm && elm.node && typeof elm.node.scrollIntoView =='function') {
					elm.node.scrollIntoView();
				}
			}, 1000);
		},

		initEditPathDisplayById : function(domId) {
			debugger;
			var node = edit.editNode;
			var e = $("#"+domId);
			if (edit.editingUnsavedNode) {
				e.html("");
				e.hide();
			} else {
				var pathDisplay = "Path: " + render.formatPath(node);
				pathDisplay += "<br>ID: " + node.id;
				if (node.lastModified) {
					pathDisplay += "<br>Modified: " + node.lastModified;
				}
				e.html(pathDisplay);
				e.show();
			}
		},

		showServerInfo : function() {
			var ironRes = util.json("getServerInfo", {});

			ironRes.completes.then(function() {
				(new MessageDlg(ironRes.response.serverInfo)).open();
			});
		}
	};

	console.log("Module ready: view.js");
	return _;
}();

//# sourceURL=view.js
