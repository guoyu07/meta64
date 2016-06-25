console.log("running module: menuPanel.js");
var menuPanel = function () {
    function _makeTopLevelMenu(title, content) {
        return render.tag("paper-submenu", {
            "class": "meta64-menu-heading"
        }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" +
            _makeSecondLevelList(content), true);
    }
    function _makeSecondLevelList(content) {
        return render.tag("paper-menu", {
            "class": "menu-content my-menu-section",
            "multi": "multi"
        }, content, true);
    }
    function _menuItem(name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    }
    function _menuToggleItem(name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    }
    var _ = {
        domId: "mainNavBar",
        build: function () {
            var editMenuItems = _menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") +
                _menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") +
                _menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
                _menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") +
                _menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
                _menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
                _menuItem("Export", "openExportDlg", "(new ExportDlg()).open();");
            var editMenu = _makeTopLevelMenu("Edit", editMenuItems);
            var attachmentMenuItems = _menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
                _menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
                _menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
            var attachmentMenu = _makeTopLevelMenu("Attach", attachmentMenuItems);
            var sharingMenuItems = _menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
                _menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
            var sharingMenu = _makeTopLevelMenu("Share", sharingMenuItems);
            var searchMenuItems = _menuItem("Text Search", "searchDlgButton", "(new SearchDlg()).open();") +
                _menuItem("Timeline", "timelineButton", "srch.timeline();");
            var searchMenu = _makeTopLevelMenu("Search", searchMenuItems);
            var viewOptionsMenuItems = _menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
                _menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
                _menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
                _menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();");
            var viewOptionsMenu = _makeTopLevelMenu("View", viewOptionsMenuItems);
            var myAccountItems = _menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
                _menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();") +
                _menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();") +
                _menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();");
            var myAccountMenu = _makeTopLevelMenu("Account", myAccountItems);
            var helpItems = _menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
            var mainMenuHelp = _makeTopLevelMenu("Help/Docs", helpItems);
            var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu
                + mainMenuHelp;
            util.setHtmlEnhanced(_.domId, content);
        },
        init: function () {
            meta64.refreshAllGuiEnablement();
        }
    };
    console.log("Module ready: menuPanel.js");
    return _;
}();
//# sourceMappingURL=menu.js.map