console.log("View.ts");

import { MessageDlg } from "./dlg/MessageDlg";
import * as I from "./Interfaces";

import { Factory } from "./types/Factory";

import { Meta64 } from "./types/Meta64";
import { Util } from "./types/Util";
import { Render } from "./types/Render";
import { Nav } from "./types/Nav";
import { Edit } from "./types/Edit";

let meta64: Meta64;
let util: Util;
let nav: Nav;
let render: Render;
let edit: Edit;

export class View {
    
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any) {
        let f: Factory = _f;
        util = f.getUtil();
        meta64 = f.getMeta64();
        nav = f.getNav();
        render = f.getRender();
        edit = f.getEdit();
    }

    compareNodeA: I.NodeInfo;
    scrollToSelNodePending: boolean = false;

    updateStatusBar = (): void => {
        if (!meta64.currentNodeData)
            return;
        var statusLine = "";

        if (meta64.editModeOption === meta64.MODE_ADVANCED) {
            statusLine += "count: " + meta64.currentNodeData.children.length;
        }

        if (meta64.userPreferences.editMode) {
            statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
        }
    }

    /*
     * newId is optional parameter which, if supplied, should be the id we scroll to when finally done with the
     * render.
     */
    refreshTreeResponse = (res?: I.RenderNodeResponse, targetId?: any, scrollToTop?: boolean): void => {
        render.renderPageFromData(res, scrollToTop);

        if (scrollToTop) {

        } else {
            if (targetId) {
                meta64.highlightRowById(targetId, true);
            } else {
                this.scrollToSelectedNode();
            }
        }
        meta64.refreshAllGuiEnablement();
        util.delayedFocus("#mainNodeContent");
    }

    /*
     * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
     */
    refreshTree = (nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void => {
        if (!nodeId) {
            nodeId = meta64.currentNodeId;
        }

        console.log("Refreshing tree: nodeId=" + nodeId);
        if (!highlightId) {
            let currentSelNode: I.NodeInfo = meta64.getHighlightedNode();
            highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
        }

        /*
        I don't know of any reason 'refreshTree' should itself reset the offset, but I leave this comment here
        as a hint for the future.
        nav.mainOffset = 0;
        */
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": nodeId,
            "upLevel": null,
            "renderParentIfLeaf": renderParentIfLeaf ? true : false,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, (res: I.RenderNodeResponse) => {
            if (res.offsetOfNodeFound > -1) {
                nav.mainOffset = res.offsetOfNodeFound;
            }
            this.refreshTreeResponse(res, highlightId);

            if (isInitialRender && meta64.urlCmd == "addNode" && meta64.homeNodeOverride) {
                edit.editMode(true);
                edit.createSubNode(meta64.currentNode.uid);
            }
        });
    }

    firstPage = (): void => {
        console.log("Running firstPage Query");
        nav.mainOffset = 0;
        this.loadPage(false);
    }

    prevPage = (): void => {
        console.log("Running prevPage Query");
        nav.mainOffset -= nav.ROWS_PER_PAGE;
        if (nav.mainOffset < 0) {
            nav.mainOffset = 0;
        }
        this.loadPage(false);
    }

    nextPage = (): void => {
        console.log("Running nextPage Query");
        nav.mainOffset += nav.ROWS_PER_PAGE;
        this.loadPage(false);
    }

    lastPage = (): void => {
        console.log("Running lastPage Query");
        //nav.mainOffset += nav.ROWS_PER_PAGE;
        this.loadPage(true);
    }

    private loadPage = (goToLastPage: boolean): void => {
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": null,
            "renderParentIfLeaf": true,
            "offset": nav.mainOffset,
            "goToLastPage": goToLastPage
        }, (res: I.RenderNodeResponse) => {
            if (goToLastPage) {
                if (res.offsetOfNodeFound > -1) {
                    nav.mainOffset = res.offsetOfNodeFound;
                }
            }
            this.refreshTreeResponse(res, null, true);
        });
    }

    /*
     * todo-3: this scrolling is slightly imperfect. sometimes the code switches to a tab, which triggers
     * scrollToTop, and then some other code scrolls to a specific location a fraction of a second later. the
     * 'pending' boolean here is a crutch for now to help visual appeal (i.e. stop if from scrolling to one place
     * and then scrolling to a different place a fraction of a second later)
     */
    scrollToSelectedNode = () => {
        this.scrollToSelNodePending = true;

        setTimeout(() => {
            this.scrollToSelNodePending = false;

            let elm: any = nav.getSelectedPolyElement();
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
            // If we couldn't find a selected node on this page, scroll to
            // top instead.
            else {
                //sets vertical top position of scrollbar to zero (top)
                util.domElm("#mainContainer").scrollTop = 0;
                //todo-1: removed mainPaperTabs from visibility, but what code should go here now?
                // elm = util.polyElm("mainPaperTabs");
                // if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                //     elm.node.scrollIntoView();
                // }
            }
        }, 1000);
    }

    scrollToTop = () => {
        if (this.scrollToSelNodePending)
            return;

        util.domElm("#mainContainer").scrollTop = 0;

        //todo-1: not using mainPaperTabs any longer so shw should go here now ?
        setTimeout(() => {
            if (this.scrollToSelNodePending)
                return;
            util.domElm("#mainContainer").scrollTop = 0;
        }, 1000);
    }

    initEditPathDisplayById = (domId: string) => {
        let node: I.NodeInfo = edit.editNode;
        let e: any = util.domElm(domId);
        if (!e)
            return;

        if (edit.editingUnsavedNode) {
            util.setInnerHTML(e, "");
            util.setElmDisplay(e, false);
        } else {
            var pathDisplay = "Path: " + node.path;

            // todo-2: Do we really need ID in addition to Path here?
            // pathDisplay += "<br>ID: " + node.id;

            if (node.lastModified) {
                pathDisplay += "<br>Mod: " + node.lastModified;
            }
            util.setInnerHTML(e, pathDisplay);
            util.setElmDisplay(e, true);
        }
    }

    showServerInfo = () => {
        util.ajax<I.GetServerInfoRequest, I.GetServerInfoResponse>("getServerInfo", {},
            (res: I.GetServerInfoResponse) => {
                util.showMessage(res.serverInfo);
            });
    }

    setCompareNodeA = () => {
        this.compareNodeA = meta64.getHighlightedNode();
    }

    compareAsBtoA = () => {
        let nodeB = meta64.getHighlightedNode();
        if (nodeB) {
            if (this.compareNodeA.id && nodeB.id) {
                util.ajax<I.CompareSubGraphRequest, I.CompareSubGraphResponse>("compareSubGraphs", //
                    { "nodeIdA": this.compareNodeA.id, "nodeIdB": nodeB.id }, //
                    (res: I.CompareSubGraphResponse) => {
                        util.showMessage(res.compareInfo);
                    });
            }
        }
    }

    processNodeHashes = (verify: boolean) => {
        let node = meta64.getHighlightedNode();
        if (node) {
            let nodeId: string = node.id;
            util.ajax<I.GenerateNodeHashRequest, I.GenerateNodeHashResponse>("generateNodeHash", { "nodeId": nodeId, "verify": verify },
                (res: I.GenerateNodeHashResponse) => {
                    util.showMessage(res.hashInfo);
                });
        }
    }
}