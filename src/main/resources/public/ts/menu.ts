console.log("running module: menuPanel.js");

namespace m64 {
    export namespace menuPanel {

        let makeTopLevelMenu = function(title: string, content: string): string {
            return render.tag("paper-submenu", {
                "class": "meta64-menu-heading"
            }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
                makeSecondLevelList(content), true);
        }

        let makeSecondLevelList = function(content: string): string {
            return render.tag("paper-menu", {
                "class": "menu-content my-menu-section",
                "multi": "multi"
            }, content, true);
        }

        let menuItem = function(name: string, id: string, onClick: any): string {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        }

        let domId: string = "mainNavBar";

        export let build = function(): void {

            var editMenuItems = //
                menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") + //
                menuItem("Delete", "deleteSelNodesButton", "m64.edit.deleteSelNodes();") + //
                menuItem("Clear Selections", "clearSelectionsButton", "m64.edit.clearSelections();") + //
                menuItem("Import", "openImportDlg", "(new m64.ImportDlg()).open();") + //
                menuItem("Export", "openExportDlg", "(new m64.ExportDlg()).open();"); //
            var editMenu = makeTopLevelMenu("Edit", editMenuItems);

            var moveMenuItems = //
                menuItem("Cut", "moveSelNodesButton", "m64.edit.moveSelNodes();") + //
                menuItem("Paste", "finishMovingSelNodesButton", "m64.edit.finishMovingSelNodes();") + //
                menuItem("Up", "moveNodeUpButton", "m64.edit.moveNodeUp();") + //
                menuItem("Down", "moveNodeDownButton", "m64.edit.moveNodeDown();") + //
                menuItem("to Top", "moveNodeToTopButton", "m64.edit.moveNodeToTop();") + //
                menuItem("to Bottom", "moveNodeToBottomButton", "m64.edit.moveNodeToBottom();");//
            var moveMenu = makeTopLevelMenu("Move", moveMenuItems);

            var attachmentMenuItems = //
                menuItem("Upload from File", "uploadFromFileButton", "m64.attachment.openUploadFromFileDlg();") + //
                menuItem("Upload from URL", "uploadFromUrlButton", "m64.attachment.openUploadFromUrlDlg();") + //
                menuItem("Delete Attachment", "deleteAttachmentsButton", "m64.attachment.deleteAttachment();");
            var attachmentMenu = makeTopLevelMenu("Attach", attachmentMenuItems);

            var sharingMenuItems = //
                menuItem("Edit Node Sharing", "editNodeSharingButton", "m64.share.editNodeSharing();") + //
                menuItem("Find Shared Subnodes", "findSharedNodesButton", "m64.share.findSharedNodes();");
            var sharingMenu = makeTopLevelMenu("Share", sharingMenuItems);

            var searchMenuItems = //
                menuItem("Content", "searchDlgButton", "(new m64.SearchContentDlg()).open();") +//
                //todo-0: make a version of the dialog that does a tag search
                menuItem("Tags", "searchDlgButton", "(new m64.SearchTagsDlg()).open();");
            var searchMenu = makeTopLevelMenu("Search", searchMenuItems);

            var timelineMenuItems = //
                menuItem("Created", "timelineCreatedButton", "m64.srch.timelineByCreateTime();") +//
                menuItem("Modified", "timelineModifiedButton", "m64.srch.timelineByModTime();");//
            var timelineMenu = makeTopLevelMenu("Timeline", timelineMenuItems);

            var viewOptionsMenuItems = //
                menuItem("Toggle Properties", "propsToggleButton", "m64.props.propsToggle();") + //
                menuItem("Refresh", "refreshPageButton", "m64.meta64.refresh();") + //
                menuItem("Show URL", "showFullNodeUrlButton", "m64.render.showNodeUrl();") + //
                menuItem("Preferences", "accountPreferencesButton", "(new m64.PrefsDlg()).open();") + //
                //todo-0: bug: server info menu item is showing up (although correctly disabled) for non-admin users.
                menuItem("Server Info", "showServerInfoButton", "m64.view.showServerInfo();"); //
            var viewOptionsMenu = makeTopLevelMenu("View", viewOptionsMenuItems);

            /*
             * whatever is commented is only commented for polymer conversion
             */
            var myAccountItems = //
                menuItem("Change Password", "changePasswordPgButton", "(new m64.ChangePasswordDlg()).open();") + //
                menuItem("Manage Account", "manageAccountButton", "(new m64.ManageAccountDlg()).open();") + //
                menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "m64.edit.insertBookWarAndPeace();"); //
            // menuItem("Full Repository Export", "fullRepositoryExport", "
            // edit.fullRepositoryExport();") + //
            var myAccountMenu = makeTopLevelMenu("Account", myAccountItems);

            var helpItems = //
                menuItem("Main Menu Help", "mainMenuHelp", "m64.nav.openMainMenuHelp();");
            var mainMenuHelp = makeTopLevelMenu("Help/Docs", helpItems);

            var content = editMenu + moveMenu+ attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
                + mainMenuHelp;

            util.setHtmlEnhanced(domId, content);
        }

        export let init = function(): void {
            meta64.refreshAllGuiEnablement();
        }
    }
}
