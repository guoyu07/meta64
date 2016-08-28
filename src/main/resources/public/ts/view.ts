console.log("running module: view.js");

namespace m64 {
    export namespace view {

        export let scrollToSelNodePending: boolean = false;

        export let updateStatusBar = function(): void {
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
        export let refreshTreeResponse = function(res?: json.RenderNodeResponse, targetId?: any): void {
            render.renderPageFromData(res);

            if (targetId) {
                meta64.highlightRowById(targetId, true);
            } else {
                scrollToSelectedNode();
            }

            meta64.refreshAllGuiEnablement();
        }

        /*
         * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
         */
        export let refreshTree = function(nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void {
            if (!nodeId) {
                nodeId = meta64.currentNodeId;
            }

            console.log("Refreshing tree: nodeId=" + nodeId);
            if (!highlightId) {
                let currentSelNode: json.NodeInfo = meta64.getHighlightedNode();
                highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
            }

            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": nodeId,
                "upLevel": null,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false
            }, function(res: json.RenderNodeResponse) {
                refreshTreeResponse(res, highlightId);

                if (isInitialRender && meta64.urlCmd == "addNode" && meta64.homeNodeOverride) {
                    edit.editMode(true);
                    edit.createSubNode(meta64.currentNode.uid);
                }
            });
        }

        /*
         * todo-3: this scrolling is slightly imperfect. sometimes the code switches to a tab, which triggers
         * scrollToTop, and then some other code scrolls to a specific location a fraction of a second later. the
         * 'pending' boolean here is a crutch for now to help visual appeal (i.e. stop if from scrolling to one place
         * and then scrolling to a different place a fraction of a second later)
         */
        export let scrollToSelectedNode = function() {
            scrollToSelNodePending = true;

            setTimeout(function() {
                scrollToSelNodePending = false;

                let elm: any = nav.getSelectedPolyElement();
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
        export let scrollToTop = function() {
            if (scrollToSelNodePending)
                return;

            setTimeout(function() {
                if (scrollToSelNodePending)
                    return;

                let elm: any = util.polyElm("mainPaperTabs");
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
            }, 1000);
        }

        export let initEditPathDisplayById = function(domId: string) {
            let node: json.NodeInfo = edit.editNode;
            let e: any = $("#" + domId);
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

        export let showServerInfo = function() {
            util.json<json.GetServerInfoRequest, json.GetServerInfoResponse>("getServerInfo", {}, function(res: json.GetServerInfoResponse) {
                (new MessageDlg(res.serverInfo)).open();
            });
        }
    }
}
