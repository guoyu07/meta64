console.log("running module: edit.js");
var Edit = (function () {
    function Edit() {
        this.showReadOnlyProperties = true;
        this.nodesToMove = null;
        this.parentOfNewNode = null;
        this.editingUnsavedNode = false;
        this.sendNotificationPendingSave = false;
        this.editNode = null;
        this.editNodeDlgInst = null;
        this.nodeInsertTarget = null;
    }
    Edit.prototype._insertBookResponse = function (res) {
        console.log("insertBookResponse running.");
        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    };
    Edit.prototype._deleteNodesResponse = function (res) {
        if (util.checkSuccess("Delete node", res)) {
            meta64.clearSelectedNodes();
            view.refreshTree(null, false);
        }
    };
    Edit.prototype._initNodeEditResponse = function (res) {
        if (util.checkSuccess("Editing node", res)) {
            var node = res.nodeInfo;
            var isRep = node.name.startsWith("rep:") || node.path.contains("/rep:");
            var editingAllowed = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }
            if (editingAllowed) {
                this.editNode = res.nodeInfo;
                this.editNodeDlgInst = new EditNodeDlg();
                this.editNodeDlgInst.open();
            }
            else {
                (new MessageDlg("You cannot edit nodes that you don't own.")).open();
            }
        }
    };
    Edit.prototype._moveNodesResponse = function (res) {
        if (util.checkSuccess("Move nodes", res)) {
            this.nodesToMove = null;
            view.refreshTree(null, false);
        }
    };
    Edit.prototype._setNodePositionResponse = function (res) {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    };
    Edit.prototype._splitContentResponse = function (res) {
        if (util.checkSuccess("Split content", res)) {
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    Edit.prototype.isEditAllowed = function (node) {
        return meta64.editMode && node.path != "/" &&
            (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
            && !props.isNonOwnedNode(node);
    };
    Edit.prototype.isInsertAllowed = function (node) {
        return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
    };
    Edit.prototype.startEditingNewNode = function () {
        this.editingUnsavedNode = false;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.saveNewNode("");
    };
    Edit.prototype.startEditingNewNodeWithName = function () {
        this.editingUnsavedNode = true;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.open();
    };
    Edit.prototype.insertNodeResponse = function (res) {
        if (util.checkSuccess("Insert node", res)) {
            meta64.initNode(res.newNode);
            meta64.highlightNode(res.newNode, true);
            this.runEditNode(res.newNode.uid);
        }
    };
    Edit.prototype.createSubNodeResponse = function (res) {
        if (util.checkSuccess("Create subnode", res)) {
            meta64.initNode(res.newNode);
            this.runEditNode(res.newNode.uid);
        }
    };
    Edit.prototype.saveNodeResponse = function (res, payload) {
        if (util.checkSuccess("Save node", res)) {
            view.refreshTree(null, false, payload.savedId);
            meta64.selectTab("mainTabName");
        }
    };
    Edit.prototype.editMode = function () {
        meta64.editMode = meta64.editMode ? false : true;
        render.renderPageFromData();
        view.scrollToSelectedNode();
    };
    Edit.prototype.splitContent = function () {
        var nodeBelow = this.getNodeBelow(this.editNode);
        util.json("splitNode", {
            "nodeId": this.editNode.id,
            "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id)
        }, this._splitContentResponse, this);
    };
    Edit.prototype.cancelEdit = function () {
        if (meta64.treeDirty) {
            meta64.goToMainPage(true);
        }
        else {
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    Edit.prototype.moveNodeUp = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (node) {
            var nodeAbove = this.getNodeAbove(node);
            if (nodeAbove == null) {
                return;
            }
            util.json("setNodePosition", {
                "parentNodeId": meta64.currentNodeId,
                "nodeId": node.name,
                "siblingId": nodeAbove.name
            }, this._setNodePositionResponse, this);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    Edit.prototype.moveNodeDown = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (node) {
            var nodeBelow = this.getNodeBelow(node);
            if (nodeBelow == null) {
                return;
            }
            util.json("setNodePosition", {
                "parentNodeId": meta64.currentNodeData.node.id,
                "nodeId": nodeBelow.name,
                "siblingId": node.name
            }, this._setNodePositionResponse, this);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    Edit.prototype.getNodeAbove = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        if (ordinal <= 0)
            return null;
        return meta64.currentNodeData.children[ordinal - 1];
    };
    Edit.prototype.getNodeBelow = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        console.log("ordinal = " + ordinal);
        if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
            return null;
        return meta64.currentNodeData.children[ordinal + 1];
    };
    Edit.prototype.runEditNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            this.editNode = null;
            (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
            return;
        }
        this.editingUnsavedNode = false;
        util.json("initNodeEdit", {
            "nodeId": node.id
        }, this._initNodeEditResponse, this);
    };
    Edit.prototype.insertNode = function (uid) {
        this.parentOfNewNode = meta64.currentNode;
        if (!this.parentOfNewNode) {
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
            this.nodeInsertTarget = node;
            this.startEditingNewNode();
        }
    };
    Edit.prototype.createSubNodeUnderHighlight = function () {
        this.parentOfNewNode = meta64.getHighlightedNode();
        if (!this.parentOfNewNode) {
            (new MessageDlg("Tap a node to insert under.")).open();
            return;
        }
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    };
    Edit.prototype.replyToComment = function (uid) {
        this.createSubNode(uid);
    };
    Edit.prototype.createSubNode = function (uid) {
        if (!uid) {
            this.parentOfNewNode = meta64.currentNode;
        }
        else {
            this.parentOfNewNode = meta64.uidToNodeMap[uid];
            if (!this.parentOfNewNode) {
                console.log("Unknown nodeId in createSubNode: " + uid);
                return;
            }
        }
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    };
    Edit.prototype.clearSelections = function () {
        meta64.clearSelectedNodes();
        render.renderPageFromData();
        meta64.selectTab("mainTabName");
    };
    Edit.prototype.deleteSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
            return;
        }
        var thiz = this;
        (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
            util.json("deleteNodes", {
                "nodeIds": selNodesArray
            }, thiz._deleteNodesResponse, thiz);
        })).open();
    };
    Edit.prototype.moveSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
            return;
        }
        var thiz = this;
        (new ConfirmDlg("Confirm Move", "Move " + selNodesArray.length + " node(s) to a new location ?", "Yes, move.", function () {
            thiz.nodesToMove = selNodesArray;
            meta64.selectedNodes = {};
            (new MessageDlg("Identified nodes to move.<p/>To actually move these nodes, browse to the target location, then click 'Finish Moving'<p/>" +
                "The nodes will then be moved to the end of the list of subnodes under the target node. (i.e. The target you select will become the new parent of the nodes)"))
                .open();
            meta64.refreshAllGuiEnablement();
        })).open();
    };
    Edit.prototype.finishMovingSelNodes = function () {
        var thiz = this;
        (new ConfirmDlg("Confirm Move", "Move " + thiz.nodesToMove.length + " node(s) to selected location ?", "Yes, move.", function () {
            var highlightNode = meta64.getHighlightedNode();
            util.json("moveNodes", {
                "targetNodeId": highlightNode.id,
                "targetChildId": highlightNode != null ? highlightNode.id : null,
                "nodeIds": thiz.nodesToMove
            }, thiz._moveNodesResponse, thiz);
        })).open();
    };
    Edit.prototype.insertBookWarAndPeace = function () {
        var thiz = this;
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
                }, thiz._insertBookResponse, thiz);
            }
        })).open();
    };
    return Edit;
}());
if (!window["edit"]) {
    var edit = new Edit();
}
//# sourceMappingURL=edit.js.map