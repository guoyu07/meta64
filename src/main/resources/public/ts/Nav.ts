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
    _UID_ROWID_PREFIX: string = "row_";

    /* todo-1: eventually when we do paging for other lists, we will need a set of these variables for each list display (i.e. search, timeline, etc) */
    mainOffset: number = 0;
    endReached: boolean = true;

    /* todo-1: need to have this value passed from server rather than coded in TypeScript, however for now 
    this MUST match nav.ROWS_PER_PAGE variable in TypeScript */ 
    ROWS_PER_PAGE: number = 25;

    continueReadingResponse(res: I.RenderNodeResponse, id): void {
        if (!res || !res.node) {
            util.showMessage("No data is visible to you above this node.");
        } else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    }

    /*
    When user is simply trying to read thru all the content in order under a subgraph, the continue reading automates all the tree
    traversal for the user. For example, the 'War and Peace' book is a multi-level tree (graph), but could nonetheless be read in order
    sentence by sentence using the 'continue reading' button
    */
    continueReading(): void {

        if (!nav.parentVisibleToUser()) {
            // Already at root. Can't go up.
            //1: need to display a message to user here.
            return;
        }

        /* todo-1: for now an uplevel will reset to zero offset, but eventually I want to have each level of the tree, be able to
        remember which offset it was at so when user drills down, and then comes back out, they page back out from the same pages they
        drilled down from */
        nav.mainOffset = 0;
        var ironRes = util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1,
            "renderParentIfLeaf": false,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, (res: I.RenderNodeResponse) => {
            nav.continueReadingResponse(ironRes.response, meta64.currentNodeId);
        });
    }

    search(): void {
        Factory.createDefault("SearchContentDlgImpl", (dlg: SearchContentDlg) => {
            dlg.open();
        });
    }

    searchTags(): void {
        Factory.createDefault("SearchTagsDlgImpl", (dlg: SearchTagsDlg) => {
            dlg.open();
        });
    }

    searchFiles(): void {
        Factory.createDefault("SearchFilesDlgImpl", (dlg: SearchFilesDlg) => {
            dlg.open();
        });
    }

    editMode(): void {
        edit.editMode();
    }

    login(): void {
        Factory.createDefault("LoginDlgImpl", (dlg: LoginDlg) => {
            dlg.populateFromCookies();
            dlg.open();
        });
    }

    logout(): void {
        user.logout(true);
    }

    signup(): void {
        user.openSignupPg();
    }

    preferences(): void {
        Factory.createDefault("PrefsDlgImpl", (dlg: PrefsDlg) => {
            dlg.open();
        });
    }

    openMainMenuHelp(): void {
        nav.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/r/public/help",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    openRssFeedsNode(): void {
        nav.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/rss/feeds",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    browseSampleContent(): void {
        nav.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/r/public/war-and-peace",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    displayingHome(): boolean {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        } else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    }

    parentVisibleToUser(): boolean {
        return !nav.displayingHome();
    }

    upLevelResponse(res: I.RenderNodeResponse, id): void {
        if (!res || !res.node) {
            util.showMessage("No data is visible to you above this node.");
        } else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    }

    navUpLevel(): void {

        if (!nav.parentVisibleToUser()) {
            // Already at root. Can't go up.
            return;
        }

        /* todo-1: for now an uplevel will reset to zero offset, but eventually I want to have each level of the tree, be able to
        remember which offset it was at so when user drills down, and then comes back out, they page back out from the same pages they
        drilled down from */
        nav.mainOffset = 0;
        var ironRes = util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1,
            "renderParentIfLeaf": false,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, (res: I.RenderNodeResponse) => {
            nav.upLevelResponse(ironRes.response, meta64.currentNodeId);
        });
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedDomElement(): HTMLElement {

        var currentSelNode = meta64.getHighlightedNode();
        if (currentSelNode) {

            /* get node by node identifier */
            let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

            if (node) {
                console.log("found highlighted node.id=" + node.id);

                /* now make CSS id from node */
                let nodeId: string = nav._UID_ROWID_PREFIX + node.uid;
                // console.log("looking up using element id: "+nodeId);

                return util.domElm(nodeId);
            }
        }

        return null;
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedPolyElement(): any {
        try {
            let currentSelNode: I.NodeInfo = meta64.getHighlightedNode();
            if (currentSelNode) {

                /* get node by node identifier */
                let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                if (node) {
                    console.log("found highlighted node.id=" + node.id);

                    /* now make CSS id from node */
                    let nodeId: string = nav._UID_ROWID_PREFIX + node.uid;
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

    clickOnNodeRow(uid: string): void {
        console.log("clickOnNodeRow: uid=" + uid);
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
                //console.log("calling updateNodeInfo");
                meta64.updateNodeInfo(node);
            }
        }
        meta64.refreshAllGuiEnablement();
    }

    openNode(uid): void {

        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);

        if (!node) {
            util.showMessage("Unknown nodeId in openNode: " + uid);
        } else {
            view.refreshTree(node.id, false);
        }
    }

    toggleNodeSel(selected: boolean, uid: string): void {
        if (selected) { 
            meta64.selectedNodes[uid] = true;
        } else {
            delete meta64.selectedNodes[uid];
        }

        view.updateStatusBar();
        meta64.refreshAllGuiEnablement();
    }

    navPageNodeResponse(res: I.RenderNodeResponse): void {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    }

    navHome(): void {
        if (meta64.isAnonUser) {
            meta64.loadAnonPageHome(true);
            // window.location.href = window.location.origin;
        } else {
            nav.mainOffset = 0;
            util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.homeNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        }
    }

    navPublicHome(): void {
        meta64.loadAnonPageHome(true);
    }
}

export let nav: Nav = new Nav();
export default nav;
