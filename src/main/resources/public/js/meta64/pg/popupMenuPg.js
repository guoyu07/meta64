console.log("running module: popupMenuPg.js");

var popupMenuPg = function() {

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

			/*
			 * whatever is commented is only commented for polymer conversion
			 */
			var navItems = //
			_menuItem("Signup", "openSignupPgButton", "user.openSignupPg();") + // 
			_menuItem("Login", "openLoginPgButton", "user.openLoginPg();") + // 

			_menuItem("Logout", "navLogoutButton", "user.logout(true);") + // 
			_menuItem("Home", "navHomeButton", "nav.navHome();") + // 
			_menuItem("Up Level", "navUpLevelButton", "nav.navUpLevel();") + // 
			_menuItem("Insert Node", "insNodeButton", "edit.insertNode();") + // 
			_menuItem("New Node", "createNodeButton", "edit.createSubNodeUnderHighlight();") + // 
			_menuItem("Edit Mode", "editModeButton", "edit.editMode();"); // 
			var navMenu = _makeTopLevelMenu("Navigate", navItems);

			var myAccountItems = //
			_menuItem("Change Password", "changePasswordPgButton", "user.changePasswordPg();") + // 
			_menuItem("Preferences", "accountPreferencesPgButton", "prefs.accountPreferencesPg();") + // 
			_menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();"); // 
			// _menuItem("Full Repository Export", "fullRepositoryExport", "
			// edit.fullRepositoryExport();") + //
			// _menuItem("Donate", "donatePgButton", "meta64.openDonatePg();");
			var myAccountMenu = _makeTopLevelMenu("My Account", myAccountItems);

			var editMenuItems = //
			_menuItem("Attachments", "manageAttachmentsButton", "attachment.openUploadPg();") + //
			_menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") + // 
			_menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") + // 

			/*
			 * todo: polymer code fails. will investigage later.
			 */
			_menuItem("Rename", "renameNodePgButton", "edit.openRenameNodePg();") + //
			_menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") + // 
			_menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();"); // 
			// _menuItem("Import", "openImportPgButton", "edit.openImportPg();")
			// + //
			// _menuItem("Export", "openExportPgButton",
			// "edit.openExportPg();"); //
			var editMenu = _makeTopLevelMenu("Edit", editMenuItems);

			var sharingMenuItems = //
			_menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") + // 
			_menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
			var sharingMenu = _makeTopLevelMenu("Sharing", sharingMenuItems);

			var searchMenuItems = //
			_menuItem("Text Search", "searchPgButton", "srch.searchPg();") + // 
			_menuItem("Timeline", "timelineButton", "srch.timeline();");// 
			var searchMenu = _makeTopLevelMenu("Search", searchMenuItems);

			var viewOptionsMenuItems = //
			_menuToggleItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") + // 
			_menuItem("Refresh", "refreshPageButton", "meta64.goToMainPage(true,true);") + // 
			_menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") + // 
			_menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();"); //
			var viewOptionsMenu = _makeTopLevelMenu("View Options", viewOptionsMenuItems);

			var content = navMenu + myAccountMenu + editMenu + sharingMenu + viewOptionsMenu + searchMenu;
			util.setHtmlEnhanced(_.domId, content);
		},

		init : function() {
			meta64.refreshAllGuiEnablement();
		}
	};

	console.log("Module ready: popupMenuPg.js");
	return _;
}();

//# sourceURL=popupMenuPg.js
