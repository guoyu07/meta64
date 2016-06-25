console.log("running module: view.js");
var view = function () {
    var scrollToSelNodePending = false;
    var _ = {
        updateStatusBar: function () {
            if (!meta64.currentNodeData)
                return;
            var statusLine = "";
            if (meta64.editModeOption === meta64.MODE_ADVANCED) {
                statusLine += "count: " + meta64.currentNodeData.children.length;
            }
            if (meta64.editMode) {
                statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
            }
        },
        refreshTreeResponse: function (res, targetId, renderParentIfLeaf, newId) {
            render.renderPageFromData(res);
            if (newId) {
                meta64.highlightRowById(newId, true);
            }
            else {
                if (targetId && renderParentIfLeaf && res.displayedParent) {
                    meta64.highlightRowById(targetId, true);
                }
                else {
                    _.scrollToSelectedNode();
                }
            }
            meta64.refreshAllGuiEnablement();
        },
        refreshTree: function (nodeId, renderParentIfLeaf, newId) {
            if (!nodeId) {
                nodeId = meta64.currentNodeId;
            }
            console.log("Refreshing tree: nodeId=" + nodeId);
            var ironRes = util.json("renderNode", {
                "nodeId": nodeId,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false
            });
            ironRes.completes.then(function () {
                _.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
            });
        },
        scrollToSelectedNode: function () {
            scrollToSelNodePending = true;
            setTimeout(function () {
                scrollToSelNodePending = false;
                var elm = nav.getSelectedPolyElement();
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
                else {
                    elm = util.polyElm("mainPaperTabs");
                    if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                        elm.node.scrollIntoView();
                    }
                }
            }, 1000);
        },
        scrollToTop: function () {
            if (scrollToSelNodePending)
                return;
            setTimeout(function () {
                if (scrollToSelNodePending)
                    return;
                var elm = util.polyElm("mainPaperTabs");
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
            }, 1000);
        },
        initEditPathDisplayById: function (domId) {
            var node = edit.editNode;
            var e = $("#" + domId);
            if (!e)
                return;
            if (edit.editingUnsavedNode) {
                e.html("");
                e.hide();
            }
            else {
                var pathDisplay = "Path: " + render.formatPath(node);
                if (node.lastModified) {
                    pathDisplay += "<br>Mod: " + node.lastModified;
                }
                e.html(pathDisplay);
                e.show();
            }
        },
        showServerInfo: function () {
            var ironRes = util.json("getServerInfo", {});
            ironRes.completes.then(function () {
                (new MessageDlg(ironRes.response.serverInfo)).open();
            });
        }
    };
    console.log("Module ready: view.js");
    return _;
}();
//# sourceMappingURL=view.js.map