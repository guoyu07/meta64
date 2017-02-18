console.log("MenuPanel.ts");

import { util } from "./Util";
import { render } from "./Render";
import { edit } from "./Edit";
import { nav } from "./Nav";
import { share } from "./Share";
import { attachment } from "./Attachment";
import { srch } from "./Search";
import { props } from "./Props";
import { meta64 } from "./Meta64";
import { podcast } from "./Podcast";
import { view } from "./View";
import { domBind } from "./DomBind";
import { tag } from "./Tag";

class MenuPanel {
    private makeTopLevelMenu = function(title: string, content: string, id?: string): string {
        let paperItemAttrs = {
            class: "menu-trigger"
        };

        let paperItem = tag.item(paperItemAttrs, title);

        let paperSubmenuAttrs = {
            "label": title,
            "selectable": ""
        };

        if (id) {
            (<any>paperSubmenuAttrs).id = id;
        }

        return tag.subMenu(paperSubmenuAttrs
            //not w-pack
            //{
            //"label": title,
            //"class": "meta64-menu-heading",
            //"class": "menu-content sublist"
            //}
            , paperItem + //"<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
            menuPanel.makeSecondLevelList(content));
    }

    private makeSecondLevelList = function(content: string): string {
        return tag.menu({
            "class": "menu-content sublist my-menu-section",
            "selectable": ""
            // not w-pack
            //,
            //"multi": "multi"
        }, content);
    }

    private menuItem = function(name: string, id: string, onClick: Function): string {
        let html = tag.item({
            "id": id,
            "selectable": ""
        }, name);

        /* It's ok to register this onClick way ahead of even the time that the DOM element even
        gets created, so we do it here in the most obvious place to do it
        */
        domBind.addOnClick(id, onClick);

        return html;
    }

    private domId: string = "mainAppMenu";

    render = function(): void {

        //not w-pack
        // I ended up not really liking this way of selecting tabs. I can just use normal polymer tabs.
        // let pageMenuItems = //
        //     menuItem("Main", "mainPageButton", "meta64.selectTab('mainTabName');") + //
        //     menuItem("Search", "searchPageButton", "meta64.selectTab('searchTabName');") + //
        //     menuItem("Timeline", "timelinePageButton", "meta64.selectTab('timelineTabName');");
        // let pageMenu = makeTopLevelMenu("Page", pageMenuItems);

        let rssItems = //
            menuPanel.menuItem("Feeds", "mainMenuRss", nav.openRssFeedsNode);
        let mainMenuRss = menuPanel.makeTopLevelMenu("RSS", rssItems);

        //Tip: If you ever need to encode these callbacks without actually importing the code it calls, the following
        //pattern will work: "meta64.modRun('Edit', function (m) {m.edit.createNode();});"

        let editMenuItems = //
            menuPanel.menuItem("Create", "createNodeButton", edit.createNode) + //
            menuPanel.menuItem("Rename", "renameNodePgButton", edit.renameNode) + //
            menuPanel.menuItem("Cut", "cutSelNodesButton", edit.cutSelNodes) + //
            menuPanel.menuItem("Paste", "pasteSelNodesButton", edit.pasteSelNodes) + //
            menuPanel.menuItem("Clear Selections", "clearSelectionsButton", edit.clearSelections) + //
            menuPanel.menuItem("Import", "openImportDlg", edit.openImportDlg) + //
            menuPanel.menuItem("Export", "openExportDlg", edit.openExportDlg) + //
            menuPanel.menuItem("Delete", "deleteSelNodesButton", edit.deleteSelNodes);
        let editMenu = menuPanel.makeTopLevelMenu("Edit", editMenuItems);

        let moveMenuItems = //
            menuPanel.menuItem("Up", "moveNodeUpButton", edit.moveNodeUp) + //
            menuPanel.menuItem("Down", "moveNodeDownButton", edit.moveNodeDown) + //
            menuPanel.menuItem("to Top", "moveNodeToTopButton", edit.moveNodeToTop) + //
            menuPanel.menuItem("to Bottom", "moveNodeToBottomButton", edit.moveNodeToBottom);//
        let moveMenu = menuPanel.makeTopLevelMenu("Move", moveMenuItems);

        let attachmentMenuItems = //
            menuPanel.menuItem("Upload from File", "uploadFromFileButton", attachment.openUploadFromFileDlg) + //
            menuPanel.menuItem("Upload from URL", "uploadFromUrlButton", attachment.openUploadFromUrlDlg) + //
            menuPanel.menuItem("Delete Attachment", "deleteAttachmentsButton", attachment.deleteAttachment);
        let attachmentMenu = menuPanel.makeTopLevelMenu("Attach", attachmentMenuItems);

        let sharingMenuItems = //
            menuPanel.menuItem("Edit Node Sharing", "editNodeSharingButton", share.editNodeSharing) + //
            menuPanel.menuItem("Find Shared Subnodes", "findSharedNodesButton", share.findSharedNodes);
        let sharingMenu = menuPanel.makeTopLevelMenu("Share", sharingMenuItems);

        let searchMenuItems = //
            menuPanel.menuItem("Content", "contentSearchDlgButton", nav.search) +//
            menuPanel.menuItem("Tags", "tagSearchDlgButton", nav.searchTags) + //
            menuPanel.menuItem("Files", "fileSearchDlgButton", nav.searchFiles);
        let searchMenu = menuPanel.makeTopLevelMenu("Search", searchMenuItems);

        let timelineMenuItems = //
            menuPanel.menuItem("Created", "timelineCreatedButton", srch.timelineByCreateTime) +//
            menuPanel.menuItem("Modified", "timelineModifiedButton", srch.timelineByModTime);//
        let timelineMenu = menuPanel.makeTopLevelMenu("Timeline", timelineMenuItems);

        let viewOptionsMenuItems = //
            menuPanel.menuItem("Toggle Properties", "propsToggleButton", props.propsToggle) + //
            menuPanel.menuItem("Refresh", "refreshPageButton", meta64.refresh) + //
            menuPanel.menuItem("Show URL", "showFullNodeUrlButton", render.showNodeUrl) + //
            menuPanel.menuItem("Preferences", "accountPreferencesButton", edit.editPreferences); //
        let viewOptionsMenu = menuPanel.makeTopLevelMenu("View", viewOptionsMenuItems);

        //not w-pack
        // WORK IN PROGRESS ( do not delete)
        // let fileSystemMenuItems = //
        //     menuItem("Reindex", "fileSysReindexButton", "systemfolder.reindex();") + //
        //     menuItem("Search", "fileSysSearchButton", "systemfolder.search();"); //
        //     //menuItem("Browse", "fileSysBrowseButton", "systemfolder.browse();");
        // let fileSystemMenu = makeTopLevelMenu("FileSys", fileSystemMenuItems);

        /*
         * whatever is commented is only commented for polymer conversion
         */
        let myAccountItems = //
            menuPanel.menuItem("Change Password", "changePasswordPgButton", edit.openChangePasswordDlg) + //
            menuPanel.menuItem("Manage Account", "manageAccountButton", edit.openManageAccountDlg); //

        // menuItem("Full Repository Export", "fullRepositoryExport", "
        // edit.fullRepositoryExport();") + //
        let myAccountMenu = menuPanel.makeTopLevelMenu("Account", myAccountItems);

        let adminItems = //
            menuPanel.menuItem("Generate RSS", "generateRSSButton", podcast.generateRSS) +//
            menuPanel.menuItem("Server Info", "showServerInfoButton", view.showServerInfo) +//
            menuPanel.menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", edit.insertBookWarAndPeace); //
        let adminMenu = menuPanel.makeTopLevelMenu("Admin", adminItems, "adminMenu");

        let helpItems = //
            menuPanel.menuItem("Main Menu Help", "mainMenuHelp", nav.openMainMenuHelp);
        let mainMenuHelp = menuPanel.makeTopLevelMenu("Help/Docs", helpItems);

        let content = /* pageMenu+ */ mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu /* + fileSystemMenu */ + searchMenu + timelineMenu + myAccountMenu
            + adminMenu + mainMenuHelp;

        util.setHtml(menuPanel.domId, content);
    }
    //
    // init = function(): void {
    //     meta64.refreshAllGuiEnablement();
    // }
}
export let menuPanel: MenuPanel = new MenuPanel();
