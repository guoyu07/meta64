console.log("Nav.ts");

import { meta64 } from "./Meta64"
import { util } from "./Util";
import { edit } from "./Edit";
import { srch } from "./Search";
import { user } from "./User";
import { render } from "./Render";
import { view } from "./View";
import * as I from "./Interfaces";
import { Factory } from "./Factory";
import { LoginDlg } from "./LoginDlg";
import { PrefsDlg } from "./PrefsDlg";
import { SearchContentDlg } from "./SearchContentDlg";
import { SearchTagsDlg } from "./SearchTagsDlg";
import { SearchFilesDlg } from "./SearchFilesDlg";

class Nav {
    _UID_ROWID_SUFFIX: string = "_row";
    _UID_ROWID_PREFIX: string = "row_";

    /* todo-0: eventually when we do paging for other lists, we will need a set of these variables for each list display (i.e. search, timeline, etc) */
    mainOffset: number = 0;
    endReached: boolean = true;

    /* todo-0: need to have this value passed from server rather than coded in TypeScript */
    ROWS_PER_PAGE: number = 25;

    search = function(): void {
        Factory.createDefault("SearchContentDlgImpl", (dlg: SearchContentDlg) => {
            dlg.open();
        });
    }

    searchTags = function(): void {
        Factory.createDefault("SearchTagsDlgImpl", (dlg: SearchTagsDlg) => {
            dlg.open();
        });
    }

    searchFiles = function(): void {
        Factory.createDefault("SearchFilesDlgImpl", (dlg: SearchFilesDlg) => {
            dlg.open();
        });
    }

    editMode = function(): void {
        edit.editMode();
    }

    login = function(): void {
        Factory.createDefault("LoginDlgImpl", (dlg: LoginDlg) => {
            //todo-0: this call was always missing pupulateFromCookies, is this right ?
            //dlg.populateFromCookies();
            dlg.open();
        });
    }

    logout = function(): void {
        user.logout(true);
    }

    signup = function(): void {
        user.openSignupPg();
    }


    preferences = function(): void {
        Factory.createDefault("PrefsDlgImpl", (dlg: PrefsDlg) => {
            dlg.open();
        });
    }

    openMainMenuHelp = function(): void {
        nav.mainOffset = 0;
        util.json<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/meta64/public/help",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    openRssFeedsNode = function(): void {
        nav.mainOffset = 0;
        util.json<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/rss/feeds",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    expandMore = function(nodeId: string): void {

        /* I'm setting this here so that we can come up with a way to make the abbrev expand state be remembered, button
        this is lower priority for now, so i'm not using it yet */
        meta64.expandedAbbrevNodeIds[nodeId] = true;

        util.json<I.ExpandAbbreviatedNodeRequest, I.ExpandAbbreviatedNodeResponse>("expandAbbreviatedNode", {
            "nodeId": nodeId
        }, nav.expandAbbreviatedNodeResponse);
    }

    private expandAbbreviatedNodeResponse = function(res: I.ExpandAbbreviatedNodeResponse): void {
        if (util.checkSuccess("ExpandAbbreviatedNode", res)) {
            //console.log("VAL: "+JSON.stringify(res.nodeInfo));
            render.refreshNodeOnPage(res.nodeInfo);
        }
    }

    displayingHome = function(): boolean {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        } else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    }

    parentVisibleToUser = function(): boolean {
        return !nav.displayingHome();
    }

    upLevelResponse = function(res: I.RenderNodeResponse, id): void {
        if (!res || !res.node) {
            util.showMessage("No data is visible to you above this node.");
        } else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    }

    navUpLevel = function(): void {

        if (!nav.parentVisibleToUser()) {
            // Already at root. Can't go up.
            return;
        }

        /* todo-0: for now an uplevel will reset to zero offset, but eventually I want to have each level of the tree, be able to
        remember which offset it was at so when user drills down, and then comes back out, they page back out from the same pages they
        drilled down from */
        nav.mainOffset = 0;
        var ironRes = util.json<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1,
            "renderParentIfLeaf": false,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, function(res: I.RenderNodeResponse) {
            nav.upLevelResponse(ironRes.response, meta64.currentNodeId);
        });
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedDomElement = function(): any {

        var currentSelNode = meta64.getHighlightedNode();
        if (currentSelNode) {

            /* get node by node identifier */
            let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

            if (node) {
                console.log("found highlighted node.id=" + node.id);

                /* now make CSS id from node */
                let nodeId: string = nav._UID_ROWID_PREFIX + node.uid /*+ nav._UID_ROWID_SUFFIX*/;
                // console.log("looking up using element id: "+nodeId);

                return util.domElm(nodeId);
            }
        }

        return null;
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedPolyElement = function(): any {
        try {
            let currentSelNode: I.NodeInfo = meta64.getHighlightedNode();
            if (currentSelNode) {

                /* get node by node identifier */
                let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                if (node) {
                    console.log("found highlighted node.id=" + node.id);

                    /* now make CSS id from node */
                    let nodeId: string = nav._UID_ROWID_PREFIX + node.uid /*+ nav._UID_ROWID_SUFFIX*/;
                    console.log("looking up using element id: " + nodeId);

                    return util.polyElm(nodeId);
                }
            } else {
                console.log("no node highlighted");
            }
        } catch (e) {
            util.logAndThrow("getSelectedPolyElement failed.");
        }
        return null;
    }

    clickOnNodeRow = function(rowElm, uid): void {

        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
            return;
        }

        /*
         * sets which node is selected on this page (i.e. parent node of this page being the 'key')
         */
        meta64.highlightNode(node, false);

        if (meta64.userPreferences.editMode) {
            /*
             * if node.owner is currently null, that means we have not retrieved the owner from the server yet, but
             * if non-null it's already displaying and we do nothing.
             */
            if (!node.owner) {
                console.log("calling updateNodeInfo");
                meta64.updateNodeInfo(node);
            }
        }
        meta64.refreshAllGuiEnablement();
    }

    openNode = function(uid): void {

        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);

        if (!node) {
            util.showMessage("Unknown nodeId in openNode: " + uid);
        } else {
            view.refreshTree(node.id, false);
        }
    }

    /*
     * unfortunately we have to rely on onClick, because of the fact that events to checkboxes don't appear to work
     * in Polmer at all, and since onClick runs BEFORE the state change is completed, that is the reason for the
     * silly looking async timer here.
     */
    toggleNodeSel = function(uid): void {
        let toggleButton: any = util.polyElm(uid + "_sel");
        setTimeout(function() {
            if (toggleButton.node.checked) {
                meta64.selectedNodes[uid] = true;
            } else {
                delete meta64.selectedNodes[uid];
            }

            view.updateStatusBar();
            meta64.refreshAllGuiEnablement();
        }, 500);
    }

    navPageNodeResponse = function(res: I.RenderNodeResponse): void {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    }

    navHome = function(): void {
        if (meta64.isAnonUser) {
            meta64.loadAnonPageHome(true);
            // window.location.href = window.location.origin;
        } else {
            nav.mainOffset = 0;
            util.json<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.homeNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        }
    }

    navPublicHome = function(): void {
        meta64.loadAnonPageHome(true);
    }
}

export let nav: Nav = new Nav();
export default nav;
