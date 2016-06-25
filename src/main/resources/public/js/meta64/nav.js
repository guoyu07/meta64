console.log("running module: nav.js");
var nav = function () {
    var _UID_ROWID_SUFFIX = "_row";
    var _ = {
        openMainMenuHelp: function () {
            window.open(window.location.origin + "?id=/meta64/public/help", "_blank");
        },
        displayingHome: function () {
            if (meta64.isAnonUser) {
                return meta64.currentNodeId === meta64.anonUserLandingPageNode;
            }
            else {
                return meta64.currentNodeId === meta64.homeNodeId;
            }
        },
        parentVisibleToUser: function () {
            return !_.displayingHome();
        },
        upLevelResponse: function (res, id) {
            if (!res || !res.node) {
                (new MessageDlg("No data is visible to you above this node.")).open();
            }
            else {
                render.renderPageFromData(res);
                meta64.highlightRowById(id, true);
                meta64.refreshAllGuiEnablement();
            }
        },
        navUpLevel: function () {
            if (!_.parentVisibleToUser()) {
                return;
            }
            var ironRes = util.json("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": 1
            });
            ironRes.completes.then(function () {
                _.upLevelResponse(ironRes.response, meta64.currentNodeId);
            });
        },
        getSelectedDomElement: function () {
            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + _UID_ROWID_SUFFIX;
                    return util.domElm(nodeId);
                }
            }
            return null;
        },
        getSelectedPolyElement: function () {
            try {
                var currentSelNode = meta64.getHighlightedNode();
                if (currentSelNode) {
                    var node = meta64.uidToNodeMap[currentSelNode.uid];
                    if (node) {
                        console.log("found highlighted node.id=" + node.id);
                        var nodeId = node.uid + _UID_ROWID_SUFFIX;
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
        },
        clickOnNodeRow: function (rowElm, uid) {
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
        },
        openNode: function (uid) {
            var node = meta64.uidToNodeMap[uid];
            meta64.highlightNode(node, true);
            if (!node) {
                (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
            }
            else {
                view.refreshTree(node.id, false);
            }
        },
        toggleNodeSel: function (uid) {
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
        },
        navHomeResponse: function (res) {
            meta64.clearSelectedNodes();
            render.renderPageFromData(res);
            view.scrollToTop();
            meta64.refreshAllGuiEnablement();
        },
        navHome: function () {
            if (meta64.isAnonUser) {
                meta64.loadAnonPageHome(true);
            }
            else {
                util.json("renderNode", {
                    "nodeId": meta64.homeNodeId
                }, _.navHomeResponse);
            }
        },
        navPublicHome: function () {
            meta64.loadAnonPageHome(true);
        },
        toggleMainMenu: function () {
        }
    };
    console.log("Module ready: nav.js");
    return _;
}();
//# sourceMappingURL=nav.js.map