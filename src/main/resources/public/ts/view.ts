
console.log("running module: view.js");

class View {

    scrollToSelNodePending: boolean = false;

    updateStatusBar = () => {
        if (!meta64.currentNodeData)
            return;
        var statusLine = "";

        if (meta64.editModeOption === meta64.MODE_ADVANCED) {
            statusLine += "count: " + meta64.currentNodeData.children.length;
        }

        if (meta64.editMode) {
            statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
        }
    }

    /*
     * newId is optional parameter which, if supplied, should be the id we scroll to when finally done with the
     * render.
     */
    refreshTreeResponse = (res?: any, targetId?: any, renderParentIfLeaf?: any, newId?: any) => {

        render.renderPageFromData(res);

        if (newId) {
            meta64.highlightRowById(newId, true);
        } else {
            /*
             * TODO-3: Why wasn't this just based on targetId ? This if condition is too confusing.
             */
            if (targetId && renderParentIfLeaf && res.displayedParent) {
                meta64.highlightRowById(targetId, true);
            } else {
                this.scrollToSelectedNode();
            }
        }
        meta64.refreshAllGuiEnablement();
    }

    /*
     * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
     */
    refreshTree = (nodeId?: any, renderParentIfLeaf?: any, newId?: any) => {
        if (!nodeId) {
            nodeId = meta64.currentNodeId;
        }

        console.log("Refreshing tree: nodeId=" + nodeId);

        var ironRes = util.json("renderNode", {
            "nodeId": nodeId,
            "renderParentIfLeaf": renderParentIfLeaf ? true : false
        });

        var thiz = this;
        ironRes.completes.then(function() {
            thiz.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
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
        var thiz = this;
        setTimeout(function() {
            thiz.scrollToSelNodePending = false;

            var elm = nav.getSelectedPolyElement();
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
            // If we couldn't find a selected node on this page, scroll to
            // top instead.
            else {
                elm = util.polyElm("mainPaperTabs");
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
            }
        }, 1000);
    }

    /*
     * todo-3: The following was in a polymer example (can I use this?): app.$.headerPanelMain.scrollToTop(true);
     */
    scrollToTop = () => {
        if (this.scrollToSelNodePending)
            return;
        var thiz = this;
        setTimeout(function() {
            if (thiz.scrollToSelNodePending)
                return;

            var elm = util.polyElm("mainPaperTabs");
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
        }, 1000);
    }

    initEditPathDisplayById = (domId) => {
        var node = edit.editNode;
        var e = $("#" + domId);
        if (!e)
            return;

        if (edit.editingUnsavedNode) {
            e.html("");
            e.hide();
        } else {
            var pathDisplay = "Path: " + render.formatPath(node);

            // todo-2: Do we really need ID in addition to Path here?
            // pathDisplay += "<br>ID: " + node.id;

            if (node.lastModified) {
                pathDisplay += "<br>Mod: " + node.lastModified;
            }
            e.html(pathDisplay);
            e.show();
        }
    }

    showServerInfo = () => {
        var ironRes = util.json("getServerInfo", {});

        ironRes.completes.then(function() {
            (new MessageDlg(ironRes.response.serverInfo)).open();
        });
    }
}

if (!window["view"]) {
    var view: View = new View();
}
