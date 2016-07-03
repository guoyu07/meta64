console.log("running module: nav.js");
var Nav = (function () {
    function Nav() {
        this._UID_ROWID_SUFFIX = "_row";
    }
    Nav.prototype.openMainMenuHelp = function () {
        window.open(window.location.origin + "?id=/meta64/public/help", "_blank");
    };
    Nav.prototype.displayingHome = function () {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        }
        else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    };
    Nav.prototype.parentVisibleToUser = function () {
        return !this.displayingHome();
    };
    Nav.prototype.upLevelResponse = function (res, id) {
        if (!res || !res.node) {
            (new MessageDlg("No data is visible to you above this node.")).open();
        }
        else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    };
    Nav.prototype.navUpLevel = function () {
        if (!this.parentVisibleToUser()) {
            return;
        }
        var ironRes = util.json("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.upLevelResponse(ironRes.response, meta64.currentNodeId);
        });
    };
    Nav.prototype.getSelectedDomElement = function () {
        var currentSelNode = meta64.getHighlightedNode();
        if (currentSelNode) {
            var node = meta64.uidToNodeMap[currentSelNode.uid];
            if (node) {
                console.log("found highlighted node.id=" + node.id);
                var nodeId = node.uid + this._UID_ROWID_SUFFIX;
                return util.domElm(nodeId);
            }
        }
        return null;
    };
    Nav.prototype.getSelectedPolyElement = function () {
        try {
            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + this._UID_ROWID_SUFFIX;
                    console.log("looking up using element id: " + nodeId);
                    return util.polyElm(nodeId);
                }
            }
            else {
                console.log("no node highlighted");
            }
        }
        catch (e) {
            console.log("getSelectedPolyElement failed.");
        }
        return null;
    };
    Nav.prototype.clickOnNodeRow = function (rowElm, uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
            return;
        }
        meta64.highlightNode(node, false);
        if (meta64.editMode) {
            if (!node.owner) {
                console.log("calling updateNodeInfo");
                meta64.updateNodeInfo(node);
            }
        }
        meta64.refreshAllGuiEnablement();
    };
    Nav.prototype.openNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);
        if (!node) {
            (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
        }
        else {
            view.refreshTree(node.id, false);
        }
    };
    Nav.prototype.toggleNodeSel = function (uid) {
        var toggleButton = util.polyElm(uid + "_sel");
        setTimeout(function () {
            if (toggleButton.node.checked) {
                meta64.selectedNodes[uid] = true;
            }
            else {
                delete meta64.selectedNodes[uid];
            }
            view.updateStatusBar();
            meta64.refreshAllGuiEnablement();
        }, 500);
    };
    Nav.prototype.navHomeResponse = function (res) {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    };
    Nav.prototype.navHome = function () {
        if (meta64.isAnonUser) {
            meta64.loadAnonPageHome(true);
        }
        else {
            util.json("renderNode", {
                "nodeId": meta64.homeNodeId
            }, this.navHomeResponse);
        }
    };
    Nav.prototype.navPublicHome = function () {
        meta64.loadAnonPageHome(true);
    };
    Nav.prototype.toggleMainMenu = function () {
    };
    return Nav;
}());
if (!window["nav"]) {
    var nav = new Nav();
}
//# sourceMappingURL=nav.js.map