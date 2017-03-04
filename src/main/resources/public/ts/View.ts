console.log("View.ts");

import { meta64 } from "./Meta64"
import { util } from "./Util";
import { nav } from "./Nav";
import { render } from "./Render";
import { edit } from "./Edit";
import { MessageDlg } from "./MessageDlg";
import * as I from "./Interfaces";

class View {

    scrollToSelNodePending: boolean = false;

    updateStatusBar(): void {
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
    refreshTreeResponse(res?: I.RenderNodeResponse, targetId?: any, scrollToTop?: boolean): void {
        render.renderPageFromData(res, scrollToTop);

        if (scrollToTop) {

        } else {
            if (targetId) {
                meta64.highlightRowById(targetId, true);
            } else {
                view.scrollToSelectedNode();
            }
        }
        meta64.refreshAllGuiEnablement();
        util.delayedFocus("#mainNodeContent");
    }

    /*
     * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
     */
    refreshTree(nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void {
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
        }, function(res: I.RenderNodeResponse) {
            if (res.offsetOfNodeFound > -1) {
                nav.mainOffset = res.offsetOfNodeFound;
            }
            view.refreshTreeResponse(res, highlightId);

            if (isInitialRender && meta64.urlCmd == "addNode" && meta64.homeNodeOverride) {
                edit.editMode(true);
                edit.createSubNode(meta64.currentNode.uid);
            }
        });
    }

    firstPage(): void {
        console.log("Running firstPage Query");
        nav.mainOffset = 0;
        view.loadPage(false);
    }

    prevPage(): void {
        console.log("Running prevPage Query");
        nav.mainOffset -= nav.ROWS_PER_PAGE;
        if (nav.mainOffset < 0) {
            nav.mainOffset = 0;
        }
        view.loadPage(false);
    }

    nextPage(): void {
        console.log("Running nextPage Query");
        nav.mainOffset += nav.ROWS_PER_PAGE;
        view.loadPage(false);
    }

    lastPage(): void {
        console.log("Running lastPage Query");
        //nav.mainOffset += nav.ROWS_PER_PAGE;
        view.loadPage(true);
    }

    private loadPage(goToLastPage: boolean): void {
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": null,
            "renderParentIfLeaf": true,
            "offset": nav.mainOffset,
            "goToLastPage": goToLastPage
        }, function(res: I.RenderNodeResponse) {
            if (goToLastPage) {
                if (res.offsetOfNodeFound > -1) {
                    nav.mainOffset = res.offsetOfNodeFound;
                }
            }
            view.refreshTreeResponse(res, null, true);
        });
    }

    /*
     * todo-3: this scrolling is slightly imperfect. sometimes the code switches to a tab, which triggers
     * scrollToTop, and then some other code scrolls to a specific location a fraction of a second later. the
     * 'pending' boolean here is a crutch for now to help visual appeal (i.e. stop if from scrolling to one place
     * and then scrolling to a different place a fraction of a second later)
     */
    scrollToSelectedNode() {
        view.scrollToSelNodePending = true;

        setTimeout(function() {
            view.scrollToSelNodePending = false;

            let elm: any = nav.getSelectedPolyElement();
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
            // If we couldn't find a selected node on this page, scroll to
            // top instead.
            else {
                //sets vertical top position of scrollbar to zero (top)
                util.domElm("#mainContainer").scrollTop = 0;
                //todo-0: removed mainPaperTabs from visibility, but what code should go here now?
                // elm = util.polyElm("mainPaperTabs");
                // if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                //     elm.node.scrollIntoView();
                // }
            }
        }, 1000);
    }

    scrollToTop() {
        if (view.scrollToSelNodePending)
            return;

        util.domElm("#mainContainer").scrollTop = 0;

        //todo-0: not using mainPaperTabs any longer so shw should go here now ?
        setTimeout(function() {
            if (view.scrollToSelNodePending)
                return;
            util.domElm("#mainContainer").scrollTop = 0;
        }, 1000);
    }

    initEditPathDisplayById(domId: string) {
        let node: I.NodeInfo = edit.editNode;
        let e: any = util.domElm(domId);
        if (!e)
            return;

        if (edit.editingUnsavedNode) {
            util.setInnerHTML(e, "");
            util.setElmDisplay(e, false);
        } else {
            var pathDisplay = "Path: " + render.formatPath(node);

            // todo-2: Do we really need ID in addition to Path here?
            // pathDisplay += "<br>ID: " + node.id;

            if (node.lastModified) {
                pathDisplay += "<br>Mod: " + node.lastModified;
            }
            util.setInnerHTML(e, pathDisplay);
            util.setElmDisplay(e, true);
        }
    }

    showServerInfo() {
        util.ajax<I.GetServerInfoRequest, I.GetServerInfoResponse>("getServerInfo", {}, function(res: I.GetServerInfoResponse) {
            util.showMessage(res.serverInfo);
        });
    }
}
export let view: View = new View();
export default view;
