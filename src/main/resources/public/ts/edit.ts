console.log("running module: edit.js");

class Edit {

    _insertBookResponse(res: any): void {
        console.log("insertBookResponse running.");

        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    }

    _deleteNodesResponse(res: any): void {
        if (util.checkSuccess("Delete node", res)) {
            meta64.clearSelectedNodes();
            view.refreshTree(null, false);
        }
    }

    _initNodeEditResponse(res: any): void {
        if (util.checkSuccess("Editing node", res)) {
            var node = res.nodeInfo;

            var isRep = node.name.startsWith("rep:") || /* meta64.currentNodeData. bug? */node.path.contains("/rep:");

            /* if this is a comment node and we are the commenter */
            var editingAllowed = props.isOwnedCommentNode(node);

            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }

            if (editingAllowed) {
				/*
				 * Server will have sent us back the raw text content, that should be markdown instead of any HTML, so
				 * that we can display this and save.
				 */
                this.editNode = res.nodeInfo;
                this.editNodeDlgInst = new EditNodeDlg();
                this.editNodeDlgInst.open();
            } else {
                (new MessageDlg("You cannot edit nodes that you don't own.")).open();
            }
        }
    }

    _moveNodesResponse(res: any): void {
        if (util.checkSuccess("Move nodes", res)) {
            this.nodesToMove = null; // reset
            view.refreshTree(null, false);
        }
    }

    _setNodePositionResponse(res: void): void {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    }

    _splitContentResponse(res: any): void {
        if (util.checkSuccess("Split content", res)) {
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }

    showReadOnlyProperties: boolean = true;
    /*
     * Node ID array of nodes that are ready to be moved when user clicks 'Finish Moving'
     */
    nodesToMove: any = null;

    parentOfNewNode: any = null;

    /*
     * indicates editor is displaying a node that is not yet saved on the server
     */
    editingUnsavedNode: any = false;

    /*
     * node (NodeInfo.java) that is being created under when new node is created
     */
    sendNotificationPendingSave: any = false;

    /*
     * Node being edited
     *
     * todo-2: this and several other variables can now be moved into the dialog class? Is that good or bad
     * coupling/responsibility?
     */
    editNode: any = null;

    /* Instance of EditNodeDialog: For now creating new one each time */
    editNodeDlgInst: any = null;

    /*
     * type=NodeInfo.java
     *
     * When inserting a new node, this holds the node that was clicked on at the time the insert was requested, and
     * is sent to server for ordinal position assignment of new node. Also if this var is null, it indicates we are
     * creating in a 'create under parent' mode, versus non-null meaning 'insert inline' type of insert.
     *
     */
    nodeInsertTarget: any = null;

    /* returns true if we can 'try to' insert under 'node' or false if not */
    isEditAllowed(node: any): boolean {
        return meta64.editMode && node.path != "/" &&
            /*
             * Check that if we have a commentBy property we are the commenter, before allowing edit button also.
             */
            (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node)) //
            && !props.isNonOwnedNode(node);
    }

    /* best we can do here is allow the disableInsert prop to be able to turn things off, node by node */
    isInsertAllowed(node: any): boolean {
        return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
    }

    startEditingNewNode(): void {
        this.editingUnsavedNode = false;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.saveNewNode("");
    }

    /*
     * called to display editor that will come up BEFORE any node is saved onto the server, so that the first time
     * any save is performed we will have the correct node name, at least.
     *
     * This version is no longer being used, and currently this means 'editingUnsavedNode' is not currently ever
     * triggered. The new approach now that we have the ability to 'rename' nodes is to just create one with a
     * random name an let user start editing right away and then rename the node IF a custom node name is needed.
     *
     * What this means is if we call this function (startEditingNewNodeWithName) instead of 'startEditingNewNode()'
     * that will cause the GUI to always prompt for the node name before creating the node. This was the original
     * functionality and still works.
     */
    startEditingNewNodeWithName(): void {
        this.editingUnsavedNode = true;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.open();
    }

    insertNodeResponse(res: any): void {
        if (util.checkSuccess("Insert node", res)) {
            meta64.initNode(res.newNode);
            meta64.highlightNode(res.newNode, true);
            this.runEditNode(res.newNode.uid);
        }
    }

    createSubNodeResponse(res: any): void {
        if (util.checkSuccess("Create subnode", res)) {
            meta64.initNode(res.newNode);
            this.runEditNode(res.newNode.uid);
        }
    }

    saveNodeResponse(res: any, payload: any): void {
        if (util.checkSuccess("Save node", res)) {
            view.refreshTree(null, false, payload.savedId);
            meta64.selectTab("mainTabName");
        }
    }

    editMode(): void {
        meta64.editMode = meta64.editMode ? false : true;
        // todo-3: really edit mode button needs to be some kind of button
        // that can show an on/off state.
        render.renderPageFromData();

        /*
         * Since edit mode turns on lots of buttons, the location of the node we are viewing can change so much it
         * goes completely offscreen out of view, so we scroll it back into view every time
         */
        view.scrollToSelectedNode();
    }

    splitContent(): void {
        let nodeBelow: NodeInfo = this.getNodeBelow(this.editNode);
        util.json("splitNode", {
            "nodeId": this.editNode.id,
            "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id)
        }, this._splitContentResponse, this);
    }

    cancelEdit(): void {

        if (meta64.treeDirty) {
            meta64.goToMainPage(true);
        } else {
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }

    moveNodeUp(uid: any): void {
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
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    moveNodeDown(uid: any): void {
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
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    /*
     * Returns the node above the specified node or null if node is itself the top node
     */
    getNodeAbove(node): any {
        var ordinal = meta64.getOrdinalOfNode(node);
        if (ordinal <= 0)
            return null;
        return meta64.currentNodeData.children[ordinal - 1];
    }

    /*
     * Returns the node below the specified node or null if node is itself the bottom node
     */
    getNodeBelow(node: any): NodeInfo {
        var ordinal = meta64.getOrdinalOfNode(node);
        console.log("ordinal = " + ordinal);
        if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
            return null;

        return meta64.currentNodeData.children[ordinal + 1];
    }

    // fullRepositoryExport: function() {
    //     util.json("exportToXml", {
    //         "nodeId": "/"
    //     }, this._exportResponse, this);
    // },

    runEditNode(uid: any): void {
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
    }

    insertNode(uid: any): void {

        this.parentOfNewNode = meta64.currentNode;
        if (!this.parentOfNewNode) {
            console.log("Unknown parent");
            return;
        }

        /*
         * We get the node selected for the insert position by using the uid if one was passed in or using the
         * currently highlighted node if no uid was passed.
         */
        var node = null;
        if (!uid) {
            node = meta64.getHighlightedNode();
        } else {
            node = meta64.uidToNodeMap[uid];
        }

        if (node) {
            this.nodeInsertTarget = node;
            this.startEditingNewNode();
        }
    }

    createSubNodeUnderHighlight(): void {

        this.parentOfNewNode = meta64.getHighlightedNode();
        if (!this.parentOfNewNode) {
            (new MessageDlg("Tap a node to insert under.")).open();
            return;
        }

        /*
         * this indicates we are NOT inserting inline. An inline insert would always have a target.
         */
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    }

    replyToComment(uid: any): void {
        this.createSubNode(uid);
    }

    createSubNode(uid: any): void {
        /*
         * If no uid provided we deafult to creating a node under the currently viewed node (parent of current page)
         */
        if (!uid) {
            this.parentOfNewNode = meta64.currentNode;
        } else {
            this.parentOfNewNode = meta64.uidToNodeMap[uid];
            if (!this.parentOfNewNode) {
                console.log("Unknown nodeId in createSubNode: " + uid);
                return;
            }
        }

        /*
         * this indicates we are NOT inserting inline. An inline insert would always have a target.
         */
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    }

    clearSelections(): void {
        meta64.clearSelectedNodes();

        /*
         * We could write code that only scans for all the "SEL" buttons and updates the state of them, but for now
         * we take the simple approach and just re-render the page. There is no call to the server, so this is
         * actually very efficient.
         */
        render.renderPageFromData();
        meta64.selectTab("mainTabName");
    }

    /*
     * Delete the single node identified by 'uid' parameter if uid parameter is passed, and if uid parameter is not
     * passed then use the node selections for multiple selections on the page.
     */
    deleteSelNodes(): void {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
            return;
        }

        var thiz = this;
        (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.",
            function() {
                util.json("deleteNodes", {
                    "nodeIds": selNodesArray
                }, thiz._deleteNodesResponse, thiz);
            })).open();
    }

    moveSelNodes(): void {

        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
            return;
        }

        let thiz = this;
        (new ConfirmDlg(
            "Confirm Move",
            "Move " + selNodesArray.length + " node(s) to a new location ?",
            "Yes, move.",
            function() {
                thiz.nodesToMove = selNodesArray;
                meta64.selectedNodes = {}; // clear selections.
                // No longer need
                // or want any selections.
                (new MessageDlg(
                    "Identified nodes to move.<p/>To actually move these nodes, browse to the target location, then click 'Finish Moving'<p/>" +
                    "The nodes will then be moved to the end of the list of subnodes under the target node. (i.e. The target you select will become the new parent of the nodes)"))
                    .open();
                meta64.refreshAllGuiEnablement();
            })).open();
    }

    finishMovingSelNodes(): void {
        let thiz = this;
        (new ConfirmDlg("Confirm Move", "Move " + thiz.nodesToMove.length + " node(s) to selected location ?",
            "Yes, move.", function() {

                var highlightNode = meta64.getHighlightedNode();

                /*
                 * For now, we will just cram the nodes onto the end of the children of the currently selected
                 * page. Later on we can get more specific about allowing precise destination location for moved
                 * nodes.
                 */
                util.json("moveNodes", {
                    "targetNodeId": highlightNode.id,
                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                    "nodeIds": thiz.nodesToMove
                }, thiz._moveNodesResponse, thiz);
            })).open();
    }

    insertBookWarAndPeace(): void {

        let thiz = this;
        (new ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function() {

            /* inserting under whatever node user has focused */
            var node = meta64.getHighlightedNode();

            if (!node) {
                (new MessageDlg("No node is selected.")).open();
            } else {
                util.json("insertBook", {
                    "nodeId": node.id,
                    "bookName": "War and Peace",
                    "truncated": user.isTestUserAccount()
                }, thiz._insertBookResponse, thiz);
            }
        })).open();
    }
}

if (!window["edit"]) {
    var edit: Edit = new Edit();
}
