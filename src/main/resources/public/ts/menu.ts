console.log("running module: menuPanel.js");

namespace m64 {
    export namespace menuPanel {

        let _makeTopLevelMenu = function(title: string, content: string): string {
            return render.tag("paper-submenu", {
                "class": "meta64-menu-heading"
            }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
                _makeSecondLevelList(content), true);
        }

        let _makeSecondLevelList = function(content: string): string {
            return render.tag("paper-menu", {
                "class": "menu-content my-menu-section",
                "multi": "multi"
            }, content, true);
        }

        let _menuItem = function(name: string, id: string, onClick: any): string {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        }

        let _menuToggleItem = function(name: string, id: string, onClick: any): string {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        }

        let domId: string = "mainNavBar";

        export let build = function(): void {

            var editMenuItems = //
                _menuItem("Move", "moveSelNodesButton", "m64.edit.moveSelNodes();") + //
                _menuItem("Finish Moving", "finishMovingSelNodesButton", "m64.edit.finishMovingSelNodes();") + //
                _menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") + //
                _menuItem("Delete", "deleteSelNodesButton", "m64.edit.deleteSelNodes();") + //
                _menuItem("Clear Selections", "clearSelectionsButton", "m64.edit.clearSelections();") + //
                _menuItem("Import", "openImportDlg", "(new m64.ImportDlg()).open();") + //
                _menuItem("Export", "openExportDlg", "(new m64.ExportDlg()).open();"); //
            var editMenu = _makeTopLevelMenu("Edit", editMenuItems);

            var attachmentMenuItems = //
                _menuItem("Upload from File", "uploadFromFileButton", "m64.attachment.openUploadFromFileDlg();") + //
                _menuItem("Upload from URL", "uploadFromUrlButton", "m64.attachment.openUploadFromUrlDlg();") + //
                _menuItem("Delete Attachment", "deleteAttachmentsButton", "m64.attachment.deleteAttachment();");
            var attachmentMenu = _makeTopLevelMenu("Attach", attachmentMenuItems);

            var sharingMenuItems = //
                _menuItem("Edit Node Sharing", "editNodeSharingButton", "m64.share.editNodeSharing();") + //
                _menuItem("Find Shared Subnodes", "findSharedNodesButton", "m64.share.findSharedNodes();");
            var sharingMenu = _makeTopLevelMenu("Share", sharingMenuItems);

            var searchMenuItems = //
                _menuItem("Text Search", "searchDlgButton", "(new m64.SearchDlg()).open();") + //
                _menuItem("Timeline", "timelineButton", "m64.srch.timeline();");//
            var searchMenu = _makeTopLevelMenu("Search", searchMenuItems);

            var viewOptionsMenuItems = //
                _menuItem("Toggle Properties", "propsToggleButton", "m64.props.propsToggle();") + //
                _menuItem("Refresh", "refreshPageButton", "m64.meta64.refresh();") + //
                _menuItem("Show URL", "showFullNodeUrlButton", "m64.render.showNodeUrl();") + //
                //todo-0: bug: server info menu item is showing up (although correctly disabled) for non-admin users.
                _menuItem("Server Info", "showServerInfoButton", "m64.view.showServerInfo();"); //
            var viewOptionsMenu = _makeTopLevelMenu("View", viewOptionsMenuItems);

            /*
             * whatever is commented is only commented for polymer conversion
             */
            var myAccountItems = //
                _menuItem("Change Password", "changePasswordPgButton", "(new m64.ChangePasswordDlg()).open();") + //
                _menuItem("Preferences", "accountPreferencesButton", "(new m64.PrefsDlg()).open();") + //
                _menuItem("Manage Account", "manageAccountButton", "(new m64.ManageAccountDlg()).open();") + //
                _menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "m64.edit.insertBookWarAndPeace();"); //
            // _menuItem("Full Repository Export", "fullRepositoryExport", "
            // edit.fullRepositoryExport();") + //
            var myAccountMenu = _makeTopLevelMenu("Account", myAccountItems);

            var helpItems = //
                _menuItem("Main Menu Help", "mainMenuHelp", "m64.nav.openMainMenuHelp();");
            var mainMenuHelp = _makeTopLevelMenu("Help/Docs", helpItems);

            var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu
                + mainMenuHelp;

            util.setHtmlEnhanced(domId, content);
        }

        export let init = function(): void {
            meta64.refreshAllGuiEnablement();
        }
    }
}
