console.log("running module: menuPanel.js");

var menuPanel = function() {

	function _makeTopLevelMenu(title, content) {
		return render.tag("paper-submenu", {}, "<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
		_makeSecondLevelList(content), true);
	}

	function _makeSecondLevelList(content) {
		return render.tag("paper-menu", {
			"class" : "menu-content my-menu-section",
			"multi" : "multi"
		}, content, true);
	}

	function _menuItem(name, id, onClick) {
		return render.tag("paper-item", {
			"id" : id,
			"onclick" : onClick
		}, name, true);
	}

	function _menuToggleItem(name, id, onClick) {
		return render.tag("paper-item", {
			"id" : id,
			"onclick" : onClick
		/*
		 * for now, I won't need this... (polymer conversion)
		 */
		// "toggles" : "true"
		}, name, true);
	}

	var _ = {
		domId : "mainNavBar",

		build : function() {

			var editMenuItems = //
			_menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") + // 
			_menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") + // 
			_menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") + //
			_menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") + // 
			_menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();"); // 
			//_menuItem("Import", "openImportPgButton", "edit.openImportPg();") +
			//_menuItem("Export", "openExportPgButton", "edit.openExportPg();"); //
			var editMenu = _makeTopLevelMenu("Edit", editMenuItems);
			
			var attachmentMenuItems = //
			_menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadPg('file');") + //
			_menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadPg('url');") + //
			_menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");	
			var attachmentMenu = _makeTopLevelMenu("Attachments", attachmentMenuItems);
			
			var sharingMenuItems = //
			_menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") + // 
			_menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
			var sharingMenu = _makeTopLevelMenu("Sharing", sharingMenuItems);

			var searchMenuItems = //
			_menuItem("Text Search", "searchDlgButton", "(new SearchDlg()).open();") + // 
			_menuItem("Timeline", "timelineButton", "srch.timeline();");// 
			var searchMenu = _makeTopLevelMenu("Search", searchMenuItems);

			var viewOptionsMenuItems = //
			_menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") + // 
			_menuItem("Refresh", "refreshPageButton", "meta64.refresh();") + // 
			_menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") + // 
			_menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();"); //
			var viewOptionsMenu = _makeTopLevelMenu("View Options", viewOptionsMenuItems);

			/*
			 * whatever is commented is only commented for polymer conversion
			 */
			var myAccountItems = //
			_menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") + // 
			_menuItem("Preferences", "accountPreferencesPgButton", "(new PrefsDlg()).open();") + // 
			_menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();") + // 
			// _menuItem("Full Repository Export", "fullRepositoryExport", "
			// edit.fullRepositoryExport();") + //
			_menuItem("Donate", "DonateDlgButton", "(new DonateDlg()).open();");
			var myAccountMenu = _makeTopLevelMenu("My Account", myAccountItems);

			var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu;
			util.setHtmlEnhanced(_.domId, content);
		},

		init : function() {
			meta64.refreshAllGuiEnablement();
		}
	};

	console.log("Module ready: menuPanel.js");
	return _;
}();

//# sourceURL=menuPanel.js
