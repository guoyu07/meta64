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
import { Comp } from "./widget/base/Comp";
import { Menu } from "./widget/Menu";
import { MenuItem } from "./widget/MenuItem";
import { user } from "./User";

export default class MenuPanel extends Comp {

    constructor() {
        super(null);
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([

            // I ended up not really liking this way of selecting tabs. I can just use normal polymer tabs.
            // let pageMenuItems = //
            //     menuItem("Main", "mainPageButton", "meta64.selectTab('mainTabName');") + //
            //     menuItem("Search", "searchPageButton", "meta64.selectTab('searchTabName');") + //
            //     menuItem("Timeline", "timelinePageButton", "meta64.selectTab('timelineTabName');");
            // let pageMenu = makeTopLevelMenu("Page", pageMenuItems);

            new Menu("RSS", [
                new MenuItem("Feeds", nav.openRssFeedsNode)
            ]),
            new Menu("Edit", [
                new MenuItem("Create", edit.createNode, () => { return meta64.state.canCreateNode }), //
                new MenuItem("Rename", edit.renameNode, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null && meta64.state.selNodeIsMine }), //
                new MenuItem("Cut", edit.cutSelNodes, () => { return !meta64.isAnonUser && meta64.state.selNodeCount > 0 && meta64.state.selNodeIsMine }), //
                new MenuItem("Paste", edit.pasteSelNodes, () => { return !meta64.isAnonUser && edit.nodesToMove != null && (meta64.state.selNodeIsMine || meta64.state.homeNodeSelected) }), //
                new MenuItem("Clear Selections", edit.clearSelections, () => { return !meta64.isAnonUser && meta64.state.selNodeCount > 0 }), //
                new MenuItem("Delete", edit.deleteSelNodes, () => { return !meta64.isAnonUser && meta64.state.selNodeCount > 0 && meta64.state.selNodeIsMine })
            ]),
            new Menu("Move", [
                new MenuItem("Up", edit.moveNodeUp, () => { return meta64.state.canMoveUp; }), //
                new MenuItem("Down", edit.moveNodeDown, () => { return meta64.state.canMoveDown; }), //
                new MenuItem("to Top", edit.moveNodeToTop, () => { return meta64.state.canMoveUp; }), //
                new MenuItem("to Bottom", edit.moveNodeToBottom, () => { return meta64.state.canMoveDown; })//
            ]),
            new Menu("Attach", [
                new MenuItem("Upload from File", attachment.openUploadFromFileDlg, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null && meta64.state.selNodeIsMine }), //
                new MenuItem("Upload from URL", attachment.openUploadFromUrlDlg, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null && meta64.state.selNodeIsMine }), //
                new MenuItem("Delete Attachment", attachment.deleteAttachment, () => {
                    return !meta64.isAnonUser && meta64.state.highlightNode != null
                        && meta64.state.highlightNode.hasBinary && meta64.state.selNodeIsMine
                })
            ]),
            new Menu("Share", [
                new MenuItem("Edit Node Sharing", share.editNodeSharing, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null && meta64.state.selNodeIsMine }), //
                new MenuItem("Find Shared Subnodes", share.findSharedNodes, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null })
            ]),
            new Menu("Search", [
                new MenuItem("Content", nav.search, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null }), //
                new MenuItem("Tags", nav.searchTags, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null }), //
                new MenuItem("Files", nav.searchFiles, () => { return !meta64.isAnonUser && meta64.allowFileSystemSearch },
                    () => { return !meta64.isAnonUser && meta64.allowFileSystemSearch })
            ]),
            new Menu("Timeline", [
                new MenuItem("Created", srch.timelineByCreateTime, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null }), //
                new MenuItem("Modified", srch.timelineByModTime, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null }), //
            ]),
            new Menu("View", [
                //todo-1: properties toggle really should be a preferences setting i think, and not a menu option here.
                new MenuItem("Toggle Properties", props.propsToggle, () => { return meta64.state.propsToggle }, () => { return !meta64.isAnonUser }), //
                new MenuItem("Refresh", meta64.refresh), //
                new MenuItem("Show URL", render.showNodeUrl, () => { return meta64.state.highlightNode != null }), //
                new MenuItem("Preferences", edit.editPreferences, () => { return !meta64.isAnonUser }) //
            ]),
            // WORK IN PROGRESS ( do not delete)
            // let fileSystemMenuItems = //
            //     menuItem("Reindex", "fileSysReindexButton", "systemfolder.reindex();") + //
            //     menuItem("Search", "fileSysSearchButton", "systemfolder.search();"); //
            //     //menuItem("Browse", "fileSysBrowseButton", "systemfolder.browse();");
            // let fileSystemMenu = makeTopLevelMenu("FileSys", fileSystemMenuItems);

            /*
             * whatever is commented is only commented for polymer conversion
             */
            new Menu("Account", [
                new MenuItem("Change Password", edit.openChangePasswordDlg, () => { return !meta64.isAnonUser }), //
                new MenuItem("Manage Account", edit.openManageAccountDlg, () => { return !meta64.isAnonUser }), //
                new MenuItem("Import", edit.openImportDlg, //
                    () => { return meta64.state.importFeatureEnabled && (meta64.state.selNodeIsMine || (meta64.state.highlightNode != null && meta64.homeNodeId == meta64.state.highlightNode.id)) },//
                    () => { return meta64.state.importFeatureEnabled }), //
                new MenuItem("Export", edit.openExportDlg, //
                    () => { return meta64.state.exportFeatureEnabled && (meta64.state.selNodeIsMine || (meta64.state.highlightNode != null && meta64.homeNodeId == meta64.state.highlightNode.id)) },
                    () => { return meta64.state.exportFeatureEnabled }
                ), //
                // menuItem("Full Repository Export", "fullRepositoryExport", "
                // edit.fullRepositoryExport();") + //
            ]),
            new Menu("Admin", [
                new MenuItem("Generate RSS", podcast.generateRSS, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
                new MenuItem("Server Info", view.showServerInfo, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
                new MenuItem("Insert Book: War and Peace", edit.insertBookWarAndPeace,
                    () => { return meta64.isAdminUser || (user.isTestUserAccount() && meta64.state.selNodeIsMine) },
                    () => { return meta64.isAdminUser || (user.isTestUserAccount() && meta64.state.selNodeIsMine) }
                )
            ]),
            new Menu("Help/Docs", [
                new MenuItem("Main Menu Help", nav.openMainMenuHelp)
            ])
        ]);
    }
}
