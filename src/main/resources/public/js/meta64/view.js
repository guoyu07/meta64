console.log("running module: view.js");
var View = (function () {
    function View() {
        this.scrollToSelNodePending = false;
    }
    View.prototype.updateStatusBar = function () {
        if (!meta64.currentNodeData)
            return;
        var statusLine = "";
        if (meta64.editModeOption === meta64.MODE_ADVANCED) {
            statusLine += "count: " + meta64.currentNodeData.children.length;
        }
        if (meta64.editMode) {
            statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
        }
    };
    View.prototype.refreshTreeResponse = function (res, targetId, renderParentIfLeaf, newId) {
        render.renderPageFromData(res);
        if (newId) {
            meta64.highlightRowById(newId, true);
        }
        else {
            if (targetId && renderParentIfLeaf && res.displayedParent) {
                meta64.highlightRowById(targetId, true);
            }
            else {
                this.scrollToSelectedNode();
            }
        }
        meta64.refreshAllGuiEnablement();
    };
    View.prototype.refreshTree = function (nodeId, renderParentIfLeaf, newId) {
        if (!nodeId) {
            nodeId = meta64.currentNodeId;
        }
        console.log("Refreshing tree: nodeId=" + nodeId);
        var ironRes = util.json("renderNode", {
            "nodeId": nodeId,
            "renderParentIfLeaf": renderParentIfLeaf ? true : false
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
        });
    };
    View.prototype.scrollToSelectedNode = function () {
        this.scrollToSelNodePending = true;
        var thiz = this;
        setTimeout(function () {
            thiz.scrollToSelNodePending = false;
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
    };
    View.prototype.scrollToTop = function () {
        if (this.scrollToSelNodePending)
            return;
        var thiz = this;
        setTimeout(function () {
            if (thiz.scrollToSelNodePending)
                return;
            var elm = util.polyElm("mainPaperTabs");
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
        }, 1000);
    };
    View.prototype.initEditPathDisplayById = function (domId) {
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
    };
    View.prototype.showServerInfo = function () {
        var ironRes = util.json("getServerInfo", {});
        ironRes.completes.then(function () {
            (new MessageDlg(ironRes.response.serverInfo)).open();
        });
    };
    return View;
}());
if (!window["view"]) {
    var view = new View();
}
//# sourceMappingURL=view.js.map