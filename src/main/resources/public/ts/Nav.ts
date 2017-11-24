console.log("Nav.ts");

import * as I from "./Interfaces";
import { LoginDlg } from "./LoginDlg";
import { PrefsDlg } from "./PrefsDlg";
import { SearchContentDlg } from "./SearchContentDlg";
import { SearchTagsDlg } from "./SearchTagsDlg";
import { SearchFilesDlg } from "./SearchFilesDlg";

import { Factory } from "./types/Factory";

import { Meta64 } from "./types/Meta64";
import { Util } from "./types/Util";
import { Render } from "./types/Render";
import { View } from "./types/View";
import { User } from "./types/User";
import { Edit } from "./types/Edit";
import { Share } from "./types/Share";
import { Search } from "./types/Search";

let meta64: Meta64;
let util: Util;
let render: Render;
let user: User;
let srch: Search;
let view: View;
let edit : Edit;

export class Nav {
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f : any) {
        let f: Factory = _f;
        util = f.getUtil();
        meta64 = f.getMeta64();
        render = f.getRender();
        user = f.getUser();
        view = f.getView();
        edit = f.getEdit();
        srch = f.getSearch();
    }
    
    _UID_ROWID_PREFIX: string = "row_";

    /* todo-1: eventually when we do paging for other lists, we will need a set of these variables for each list display (i.e. search, timeline, etc) */
    mainOffset: number = 0;
    endReached: boolean = true;

    /* todo-1: need to have this value passed from server rather than coded in TypeScript, however for now 
    this MUST match this.ROWS_PER_PAGE variable in TypeScript */
    ROWS_PER_PAGE: number = 25;

    search = (): void => {
        new SearchContentDlg().open();
    }

    searchTags = (): void => {
        new SearchTagsDlg().open();
    }

    searchFiles = (): void => {
        new SearchFilesDlg().open();
    }

    editMode = (): void => {
        edit.editMode();
    }

    login = (): void => {
        let dlg = new LoginDlg(null);
        dlg.populateFromCookies();
        dlg.open();
    }

    logout = (): void => {
        user.logout(true);
    }

    signup = (): void => {
        user.openSignupPg();
    }

    preferences = (): void => {
        new PrefsDlg().open();
    }

    openMainMenuHelp = (): void => {
        this.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/r/public/help",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": this.mainOffset,
            "goToLastPage": false
        }, this.navPageNodeResponse);
    }

    openRssFeedsNode = (): void => {
        this.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/r/public/feeds",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": this.mainOffset,
            "goToLastPage": false
        }, this.navPageNodeResponse);
    }

    browseSampleContent = (): void => {
        this.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": "/r/public/war-and-peace",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": this.mainOffset,
            "goToLastPage": false
        }, this.navPageNodeResponse);
    }

    displayingHome = (): boolean => {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        } else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    }

    parentVisibleToUser = (): boolean => {
        return !this.displayingHome();
    }

    upLevelResponse = (res: I.RenderNodeResponse, id): void => {
        if (!res || !res.node) {
            util.showMessage("No data is visible to you above this node.");
        } else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    }

    navUpLevel = (): void => {

        if (!this.parentVisibleToUser()) {
            // Already at root. Can't go up.
            return;
        }

        /* todo-1: for now an uplevel will reset to zero offset, but eventually I want to have each level of the tree, be able to
        remember which offset it was at so when user drills down, and then comes back out, they page back out from the same pages they
        drilled down from */
        this.mainOffset = 0;
        var ironRes = util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1,
            "renderParentIfLeaf": false,
            "offset": this.mainOffset,
            "goToLastPage": false
        }, (res: I.RenderNodeResponse) => {
            this.upLevelResponse(ironRes.response, meta64.currentNodeId);
        });
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedDomElement = (): HTMLElement => {

        var currentSelNode = meta64.getHighlightedNode();
        if (currentSelNode) {

            /* get node by node identifier */
            let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

            if (node) {
                console.log("found highlighted node.id=" + node.id);

                /* now make CSS id from node */
                let nodeId: string = this._UID_ROWID_PREFIX + node.uid;
                // console.log("looking up using element id: "+nodeId);

                return util.domElm(nodeId);
            }
        }

        return null;
    }

    /*
     * turn of row selection DOM element of whatever row is currently selected
     */
    getSelectedPolyElement = (): any => {
        try {
            let currentSelNode: I.NodeInfo = meta64.getHighlightedNode();
            if (currentSelNode) {

                /* get node by node identifier */
                let node: I.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                if (node) {
                    console.log("found highlighted node.id=" + node.id);

                    /* now make CSS id from node */
                    let nodeId: string = this._UID_ROWID_PREFIX + node.uid;
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

    clickOnNodeRow = (uid: string): void => {
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

    openNode = (uid): void => {
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);

        if (!node) {
            util.showMessage("Unknown nodeId in openNode: " + uid);
        } else {
            view.refreshTree(node.id, false);
        }
    }

    toggleNodeSel = (selected: boolean, uid: string): void => {
        if (selected) {
            meta64.selectedNodes[uid] = true;
        } else {
            delete meta64.selectedNodes[uid];
        }

        view.updateStatusBar();
        meta64.refreshAllGuiEnablement();
    }

    navPageNodeResponse = (res: I.RenderNodeResponse): void => {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    }

    navHome = (): void => {
        if (meta64.isAnonUser) {
            meta64.loadAnonPageHome(true);
            // window.location.href = window.location.origin;
        } else {
            this.mainOffset = 0;
            util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.homeNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": this.mainOffset,
                "goToLastPage": false
            }, this.navPageNodeResponse);
        }
    }

    navPublicHome = (): void => {
        meta64.loadAnonPageHome(true);
    }
}
