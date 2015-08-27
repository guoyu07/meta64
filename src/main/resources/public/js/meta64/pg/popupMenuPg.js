console.log("running module: popupMenuPg.js");

var popupMenuPg = function() {

	function _makeTopLevelMenu(title, content) {
		return render.tag("div", {
			"style" : "margin: 0px; padding: 0px;",
			"data-role" : "collapsible",
			// "data-inset" : "false",
			// "data-mini" : "true",
			// "data-theme" : "b",
			// "data-content-theme" : "a",
			"data-iconpos" : "right",
			"data-shadow" : "false",
			"data-corners" : "false"
		}, "<h2 style='margin: 0px; padding: 0px;'>" + title + "</h2>" + //
		_makeSecondLevelList(content));
	}

	function _makeSecondLevelList(content) {
		return render.tag("ul", {
			"style" : "margin: 0px; padding: 0px;",
			"data-role" : "listview",
			// "data-mini" : "true",
			"data-inset" : "true",
			"data-shadow" : "false",
			"data-corners" : "false"
		}, content);
	}

	function _menuItem(name, id, onClick) {
		var anchor = render.tag("a", {
			// "data-mini" : "true", //
			"id" : id,
			"onclick" : onClick
		}, name);

		return render.tag("li", {
			// "data-mini" : "true", //
			"data-icon" : "false"
		}, anchor);
	}

	var _ = {
		domId : "popupMenuPg",

		build : function() {

			var myAccountItems = //
			_menuItem("Change Password", "changePasswordPgButton", "user.changePasswordPg();") + //
			_menuItem("Preferences", "accountPreferencesPgButton", "prefs.accountPreferencesPg();") + //
			_menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();") + //
			_menuItem("Full Repository Export", "fullRepositoryExport", " edit.fullRepositoryExport();") + //
			_menuItem("Donate", "donatePgButton", "meta64.openDonatePg();");
			var myAccountMenu = _makeTopLevelMenu("My Account", myAccountItems);

			var editMenuItems = //
			_menuItem("Attachments", "manageAttachmentsButton", "attachment.openUploadPg();") + // 
			_menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") + // 
			_menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") + // 
			_menuItem("Rename", "renameNodePgButton", "edit.openRenameNodePg();") + //
			_menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") + // 
			_menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") + // 
			_menuItem("Import", "openImportPgButton", "edit.openImportPg();") + // 
			_menuItem("Export", "openExportPgButton", "edit.openExportPg();"); // 
			var editMenu = _makeTopLevelMenu("Edit", editMenuItems);
			
			var sharingMenuItems = //
			_menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") + // 
			_menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
			var sharingMenu = _makeTopLevelMenu("Sharing", sharingMenuItems);

			// var searchMenuItems = //
			// _menuItem("Text Search", "searchPgButton", "srch.searchPg();") +
			// _menuItem("Timeline", "timelineButton", "srch.timeline();");//
			// var searchMenu = _makeTopLevelMenu("Search", searchMenuItems);

			var viewOptionsMenuItems = //
			_menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") + // 
			_menuItem("Refresh", "refreshPageButton", "view.refreshPage();") + // 
			_menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") + //
			_menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();");
			var viewOptionsMenu = _makeTopLevelMenu("View Options", viewOptionsMenuItems);

			var content = render.tag("div", {
				"style" : "margin: 0; min-width: 300px; position: fixed; top: 2em; left: 2em;",
				"data-role" : "collapsible-set"
			}, myAccountMenu + editMenu + sharingMenu + viewOptionsMenu/* + searchMenu */);

			util.setHtmlEnhanced($("#popupMenuPg"), content);
		},

		init : function() {

			// console.log("**************** init menu.");

			var selNodeCount = util.getPropertyCount(meta64.selectedNodes);
			var highlightNode = meta64.getHighlightedNode();
			var propsToggle = meta64.currentNode && !meta64.isAnonUser;
			var editMode = meta64.currentNode && !meta64.isAnonUser;
			var canFinishMoving = !util.nullOrUndef(edit.nodesToMove) && !_.isAnonUser;

			util.setEnablement($("#changePasswordPgButton"), !meta64.isAnonUser);
			util.setEnablement($("#accountPreferencesPgButton"), !meta64.isAnonUser);
			util.setEnablement($("#insertBookWarAndPeaceButton"), meta64.isAdminUser && highlightNode != null, meta64.isAdminUser);
			util.setEnablement($("#fullRepositoryExport"), meta64.isAdminUser, meta64.isAdminUser);
			util.setEnablement($("#donatePgButton"), true);
			util.setEnablement($("#manageAttachmentsButton"), highlightNode != null && !meta64.isAnonUser);
			util.setEnablement($("#editNodeSharingButton"), highlightNode != null && !meta64.isAnonUser);
			util.setEnablement($("#findSharedNodesButton"), highlightNode != null && !meta64.isAnonUser);
			util.setEnablement($("#moveSelNodesButton"), highlightNode != null && !meta64.isAnonUser);
			util.setEnablement($("#renameNodePgButton"), highlightNode != null && !meta64.isAnonUser);
			util.setEnablement($("#finishMovingSelNodesButton"), canFinishMoving, canFinishMoving);
			util.setEnablement($("#openExportPgButton"), meta64.isAdminUser, meta64.isAdminUser);
			util.setEnablement($("#openImportPgButton"), meta64.isAdminUser, meta64.isAdminUser);
			util.setEnablement($("#showServerInfoButton"), meta64.isAdminUser, meta64.isAdminUser);
			util.setEnablement($("#deleteSelNodesButton"), selNodeCount);
			// util.setEnablement($("#searchPgButton"), highlightNode != null);
			// util.setEnablement($("#timelineButton"), highlightNode != null);
		}
	};

	console.log("Module ready: popupMenuPg.js");
	return _;
}();

//# sourceURL=popupMenuPg.js
