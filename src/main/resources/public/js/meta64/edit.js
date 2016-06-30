console.log("running module: edit.js");
var edit = function () {
    var _insertBookResponse = function (res) {
        console.log("insertBookResponse running.");
        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    };
    var _deleteNodesResponse = function (res) {
        if (util.checkSuccess("Delete node", res)) {
            meta64.clearSelectedNodes();
            view.refreshTree(null, false);
        }
    };
    var _initNodeEditResponse = function (res) {
        if (util.checkSuccess("Editing node", res)) {
            var node = res.nodeInfo;
            var isRep = node.name.startsWith("rep:") || node.path.contains("/rep:");
            var editingAllowed = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }
            if (editingAllowed) {
                _.editNode = res.nodeInfo;
                _.editNodeDlgInst = new EditNodeDlg();
                _.editNodeDlgInst.open();
            }
            else {
                (new MessageDlg("You cannot edit nodes that you don't own.")).open();
            }
        }
    };
    var _moveNodesResponse = function (res) {
        if (util.checkSuccess("Move nodes", res)) {
            _.nodesToMove = null;
            view.refreshTree(null, false);
        }
    };
    var _setNodePositionResponse = function (res) {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    };
    var _splitContentResponse = function (res) {
        if (util.checkSuccess("Split content", res)) {
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    var _ = {
        showReadOnlyProperties: true,
        nodesToMove: null,
        parentOfNewNode: null,
        editingUnsavedNode: false,
        sendNotificationPendingSave: false,
        editNode: null,
        editNodeDlgInst: null,
        nodeInsertTarget: null,
        isEditAllowed: function (node) {
            return meta64.editMode && node.path != "/" &&
                (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
                && !props.isNonOwnedNode(node);
        },
        isInsertAllowed: function (node) {
            return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
        },
        startEditingNewNode: function () {
            debugger;
            _.editingUnsavedNode = false;
            _.editNode = null;
            _.editNodeDlgInst = new EditNodeDlg();
            _.editNodeDlgInst.saveNewNode("");
        },
        startEditingNewNodeWithName: function () {
            _.editingUnsavedNode = true;
            _.editNode = null;
            _.editNodeDlgInst = new EditNodeDlg();
            _.editNodeDlgInst.open();
        },
        insertNodeResponse: function (res) {
            if (util.checkSuccess("Insert node", res)) {
                meta64.initNode(res.newNode);
                meta64.highlightNode(res.newNode, true);
                _.runEditNode(res.newNode.uid);
            }
        },
        createSubNodeResponse: function (res) {
            if (util.checkSuccess("Create subnode", res)) {
                meta64.initNode(res.newNode);
                _.runEditNode(res.newNode.uid);
            }
        },
        saveNodeResponse: function (res, payload) {
            if (util.checkSuccess("Save node", res)) {
                view.refreshTree(null, false, payload.savedId);
                meta64.selectTab("mainTabName");
            }
        },
        editMode: function () {
            meta64.editMode = meta64.editMode ? false : true;
            render.renderPageFromData();
            view.scrollToSelectedNode();
        },
        splitContent: function () {
            var nodeBelow = _.getNodeBelow(_.editNode);
            util.json("splitNode", {
                "nodeId": _.editNode.id,
                "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id)
            }, _splitContentResponse);
        },
        cancelEdit: function () {
            if (meta64.treeDirty) {
                meta64.goToMainPage(true);
            }
            else {
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        },
        moveNodeUp: function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                var nodeAbove = _.getNodeAbove(node);
                if (nodeAbove == null) {
                    return;
                }
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": nodeAbove.name
                }, _setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        },
        moveNodeDown: function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                var nodeBelow = _.getNodeBelow(node);
                if (nodeBelow == null) {
                    return;
                }
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": nodeBelow.name,
                    "siblingId": node.name
                }, _setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        },
        getNodeAbove: function (node) {
            var ordinal = meta64.getOrdinalOfNode(node);
            if (ordinal <= 0)
                return null;
            return meta64.currentNodeData.children[ordinal - 1];
        },
        getNodeBelow: function (node) {
            var ordinal = meta64.getOrdinalOfNode(node);
            console.log("ordinal = " + ordinal);
            if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
                return null;
            return meta64.currentNodeData.children[ordinal + 1];
        },
        runEditNode: function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                _.editNode = null;
                (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            _.editingUnsavedNode = false;
            util.json("initNodeEdit", {
                "nodeId": node.id
            }, _initNodeEditResponse);
        },
        insertNode: function (uid) {
            _.parentOfNewNode = meta64.currentNode;
            if (!_.parentOfNewNode) {
                console.log("Unknown parent");
                return;
            }
            var node = null;
            if (!uid) {
                node = meta64.getHighlightedNode();
            }
            else {
                node = meta64.uidToNodeMap[uid];
            }
            if (node) {
                _.nodeInsertTarget = node;
                _.startEditingNewNode();
            }
        },
        createSubNodeUnderHighlight: function () {
            _.parentOfNewNode = meta64.getHighlightedNode();
            if (!_.parentOfNewNode) {
                (new MessageDlg("Tap a node to insert under.")).open();
                return;
            }
            _.nodeInsertTarget = null;
            _.startEditingNewNode();
        },
        replyToComment: function (uid) {
            _.createSubNode(uid);
        },
        createSubNode: function (uid) {
            if (!uid) {
                _.parentOfNewNode = meta64.currentNode;
            }
            else {
                _.parentOfNewNode = meta64.uidToNodeMap[uid];
                if (!_.parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }
            _.nodeInsertTarget = null;
            _.startEditingNewNode();
        },
        clearSelections: function () {
            meta64.clearSelectedNodes();
            render.renderPageFromData();
            meta64.selectTab("mainTabName");
        },
        deleteSelNodes: function () {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
                return;
            }
            (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
                util.json("deleteNodes", {
                    "nodeIds": selNodesArray
                }, _deleteNodesResponse);
            })).open();
        },
        moveSelNodes: function () {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
                return;
            }
            (new ConfirmDlg("Confirm Move", "Move " + selNodesArray.length + " node(s) to a new location ?", "Yes, move.", function () {
                _.nodesToMove = selNodesArray;
                meta64.selectedNodes = {};
                (new MessageDlg("Identified nodes to move.<p/>To actually move these nodes, browse to the target location, then click 'Finish Moving'<p/>" +
                    "The nodes will then be moved to the end of the list of subnodes under the target node. (i.e. The target you select will become the new parent of the nodes)"))
                    .open();
                meta64.refreshAllGuiEnablement();
            })).open();
        },
        finishMovingSelNodes: function () {
            (new ConfirmDlg("Confirm Move", "Move " + _.nodesToMove.length + " node(s) to selected location ?", "Yes, move.", function () {
                var highlightNode = meta64.getHighlightedNode();
                util.json("moveNodes", {
                    "targetNodeId": highlightNode.id,
                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                    "nodeIds": _.nodesToMove
                }, _moveNodesResponse);
            })).open();
        },
        insertBookWarAndPeace: function () {
            (new ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function () {
                var node = meta64.getHighlightedNode();
                if (!node) {
                    (new MessageDlg("No node is selected.")).open();
                }
                else {
                    util.json("insertBook", {
                        "nodeId": node.id,
                        "bookName": "War and Peace",
                        "truncated": user.isTestUserAccount()
                    }, _insertBookResponse);
                }
            })).open();
        }
    };
    console.log("Module ready: edit.js");
    return _;
}();
//# sourceMappingURL=edit.js.map