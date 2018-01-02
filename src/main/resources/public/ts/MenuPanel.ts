console.log("MenuPanel.ts");

import { Comp } from "./widget/base/Comp";
import { Menu } from "./widget/Menu";
import { MenuItem } from "./widget/MenuItem";
import { Div } from "./widget/Div";
import { Factory } from "./Factory";

import { Meta64Intf as Meta64 } from "./intf/Meta64Intf";
import { UtilIntf as Util } from "./intf/UtilIntf";
import { RenderIntf as Render } from "./intf/RenderIntf";
import { ViewIntf as View } from "./intf/ViewIntf";
import { NavIntf as Nav } from "./intf/NavIntf";
import { PropsIntf as Props } from "./intf/PropsIntf";
import { UserIntf as User } from "./intf/UserIntf";
import { EditIntf as Edit } from "./intf/EditIntf";
import { ShareIntf as Share } from "./intf/ShareIntf";
import { AttachmentIntf as Attachment } from "./intf/AttachmentIntf";
import { SearchIntf as Search } from "./intf/SearchIntf";
import { PodcastIntf as Podcast } from "./intf/PodcastIntf";
import { EncryptionIntf as Encryption } from "./intf/EncryptionIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";

let meta64: Meta64;
let util: Util;
let nav: Nav;
let props: Props;
let render: Render;
let user: User;
let srch: Search;
let view: View;
let edit: Edit;
let share: Share;
let attachment: Attachment;
let podcast: Podcast;
let encryption: Encryption;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    util = s.util;
    meta64 = s.meta64;
    nav = s.nav;
    props = s.props;
    render = s.render;
    user = s.user;
    view = s.view;
    edit = s.edit;
    share = s.share;
    attachment = s.attachment;
    srch = s.srch;
    podcast = s.podcast;
    encryption = s.encryption;
});

export class MenuPanel extends Comp {

    constructor() {
        super(null);
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([

            new Menu("Bookmarks", [
                new MenuItem("SubNode Home", () => { meta64.loadAnonPageHome(true) }),
                new MenuItem("Your Home", nav.navHome),

                //todo-1: disabled during mongo conversion
                new MenuItem("RSS Feeds", nav.openRssFeedsNode),

                /* currently this Sample Content is the book 'War and Peace' */
                new MenuItem("Sample Content", nav.browseSampleContent)
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
                new MenuItem("Up", () => { edit.moveNodeUp(); }, () => { return meta64.state.canMoveUp; }), //
                new MenuItem("Down", () => { edit.moveNodeDown(); }, () => { return meta64.state.canMoveDown; }, () => { return true; }, true), //
                new MenuItem("to Top", () => { edit.moveNodeToTop(); }, () => { return meta64.state.canMoveUp; }), //
                new MenuItem("to Bottom", () => { edit.moveNodeToBottom(); }, () => { return meta64.state.canMoveDown; })//
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
                //todo-1: temporarily disabling this during mongo conversion
                //new MenuItem("Find Shared Subnodes", share.findSharedNodes, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null })
            ]),
            new Menu("Search", [
                new MenuItem("Content", nav.search, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null })//, //
                //todo-1: disaled during mongo conversion
                //new MenuItem("Tags", nav.searchTags, () => { return !meta64.isAnonUser && meta64.state.highlightNode != null }), //
                //new MenuItem("Files", nav.searchFiles, () => { return !meta64.isAnonUser && meta64.allowFileSystemSearch },
                //    () => { return !meta64.isAnonUser && meta64.allowFileSystemSearch })
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
            ]),
            new Menu("Tools", [
                new MenuItem("Import", edit.openImportDlg, //
                    () => { return meta64.state.importFeatureEnabled && (meta64.state.selNodeIsMine || (meta64.state.highlightNode != null && meta64.homeNodeId == meta64.state.highlightNode.id)) },//
                    () => { return meta64.state.importFeatureEnabled }), //
                new MenuItem("Export", edit.openExportDlg, //
                    () => { return meta64.state.exportFeatureEnabled && (meta64.state.selNodeIsMine || (meta64.state.highlightNode != null && meta64.homeNodeId == meta64.state.highlightNode.id)) },
                    () => { return meta64.state.exportFeatureEnabled },
                    true//
                ), //
                //todo-1: disabled during mongo conversion
                //new MenuItem("Set Node A", view.setCompareNodeA, () => { return meta64.isAdminUser && meta64.state.highlightNode != null }, () => { return meta64.isAdminUser }), //
                //new MenuItem("Compare as B (to A)", view.compareAsBtoA, //
                //    () => { return meta64.isAdminUser && meta64.state.highlightNode != null }, //
                //    () => { return meta64.isAdminUser }, //
                //    true
                //), //
                //new MenuItem("Generate Hashes", () => { view.processNodeHashes(false); }, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
                //new MenuItem("Verify Hashes", () => { view.processNodeHashes(true); }, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
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
                new MenuItem("Preferences", edit.editPreferences, () => { return !meta64.isAnonUser }), //
                new MenuItem("Change Password", edit.openChangePasswordDlg, () => { return !meta64.isAnonUser }), //
                new MenuItem("Manage Account", edit.openManageAccountDlg, () => { return !meta64.isAnonUser }), //
                // menuItem("Full Repository Export", "fullRepositoryExport", "
                // edit.fullRepositoryExport();") + //
            ]),
            new Menu("Admin", [
                new MenuItem("Generate RSS", podcast.generateRSS, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
                new MenuItem("Server Info", view.showServerInfo, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
                new MenuItem("Insert Book: War and Peace", edit.insertBookWarAndPeace,
                    () => { return meta64.isAdminUser || (user.isTestUserAccount() && meta64.state.selNodeIsMine) },
                    () => { return meta64.isAdminUser || (user.isTestUserAccount() && meta64.state.selNodeIsMine) }
                ),
                new MenuItem("Rebuild Indexes", meta64.rebuildIndexes, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }) //
                //new MenuItem("JS Encryption Tests", () => {new Encryption().test()}, () => { return meta64.isAdminUser }, () => { return meta64.isAdminUser }), //
            ]),
            new Menu("Help/Docs", [
                new MenuItem("Main Menu Help", nav.openMainMenuHelp)
            ])
        ]);
    }

    renderHtml = (): string => {

        let menuPanel =
            new Div(null,
                {
                    id: "accordion",
                    role: "tablist"
                },
                this.children
            );

        return menuPanel.renderHtml();
    }
}
