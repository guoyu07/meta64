console.log("running module: menuPanel.js");
var MenuPanel = (function () {
    function MenuPanel() {
        this.domId = "mainNavBar";
    }
    MenuPanel.prototype._makeTopLevelMenu = function (title, content) {
        return render.tag("paper-submenu", {
            "class": "meta64-menu-heading"
        }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" +
            this._makeSecondLevelList(content), true);
    };
    MenuPanel.prototype._makeSecondLevelList = function (content) {
        return render.tag("paper-menu", {
            "class": "menu-content my-menu-section",
            "multi": "multi"
        }, content, true);
    };
    MenuPanel.prototype._menuItem = function (name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    };
    MenuPanel.prototype._menuToggleItem = function (name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    };
    MenuPanel.prototype.build = function () {
        var editMenuItems = this._menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") +
            this._menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") +
            this._menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
            this._menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") +
            this._menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
            this._menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
            this._menuItem("Export", "openExportDlg", "(new ExportDlg()).open();");
        var editMenu = this._makeTopLevelMenu("Edit", editMenuItems);
        var attachmentMenuItems = this._menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
            this._menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
            this._menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
        var attachmentMenu = this._makeTopLevelMenu("Attach", attachmentMenuItems);
        var sharingMenuItems = this._menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
            this._menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
        var sharingMenu = this._makeTopLevelMenu("Share", sharingMenuItems);
        var searchMenuItems = this._menuItem("Text Search", "searchDlgButton", "(new SearchDlg()).open();") +
            this._menuItem("Timeline", "timelineButton", "srch.timeline();");
        var searchMenu = this._makeTopLevelMenu("Search", searchMenuItems);
        var viewOptionsMenuItems = this._menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
            this._menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
            this._menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
            this._menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();");
        var viewOptionsMenu = this._makeTopLevelMenu("View", viewOptionsMenuItems);
        var myAccountItems = this._menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
            this._menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();") +
            this._menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();") +
            this._menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();");
        var myAccountMenu = this._makeTopLevelMenu("Account", myAccountItems);
        var helpItems = this._menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
        var mainMenuHelp = this._makeTopLevelMenu("Help/Docs", helpItems);
        var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu
            + mainMenuHelp;
        util.setHtmlEnhanced(this.domId, content);
    };
    MenuPanel.prototype.init = function () {
        meta64.refreshAllGuiEnablement();
    };
    return MenuPanel;
}());
if (!window["menuPanel"]) {
    var menuPanel = new MenuPanel();
}
//# sourceMappingURL=menu.js.map