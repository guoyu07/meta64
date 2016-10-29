console.log("running module: edit.js");

namespace m64 {
    export namespace edit {

        export let createNode = function(): void {
            (new m64.CreateNodeDlg()).open();
        }

        let insertBookResponse = function(res: json.InsertBookResponse): void {
            console.log("insertBookResponse running.");

            util.checkSuccess("Insert Book", res);
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }

        let deleteNodesResponse = function(res: json.DeleteNodesResponse, payload: Object): void {
            if (util.checkSuccess("Delete node", res)) {
                meta64.clearSelectedNodes();
                let highlightId: string = null;
                if (payload) {
                    let selNode = payload["postDeleteSelNode"];
                    if (selNode) {
                        highlightId = selNode.id;
                    }
                }

                view.refreshTree(null, false, highlightId);
            }
        }

        let initNodeEditResponse = function(res: json.InitNodeEditResponse): void {
            if (util.checkSuccess("Editing node", res)) {
                let node: json.NodeInfo = res.nodeInfo;
                let isRep: boolean = node.name.startsWith("rep:") || /* meta64.currentNodeData. bug? */node.path.contains("/rep:");

                /* if this is a comment node and we are the commenter */
                let editingAllowed: boolean = props.isOwnedCommentNode(node);

                if (!editingAllowed) {
                    editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                        && !props.isNonOwnedNode(node);
                }

                if (editingAllowed) {
                    /*
                     * Server will have sent us back the raw text content, that should be markdown instead of any HTML, so
                     * that we can display this and save.
                     */
                    editNode = res.nodeInfo;
                    editNodeDlgInst = new EditNodeDlg();
                    editNodeDlgInst.open();
                } else {
                    (new MessageDlg("You cannot edit nodes that you don't own.")).open();
                }
            }
        }

        let moveNodesResponse = function(res: json.MoveNodesResponse): void {
            if (util.checkSuccess("Move nodes", res)) {
                nodesToMove = null; // reset
                view.refreshTree(null, false);
            }
        }

        let setNodePositionResponse = function(res: json.SetNodePositionResponse): void {
            if (util.checkSuccess("Change node position", res)) {
                meta64.refresh();
            }
        }

        export let showReadOnlyProperties: boolean = true;
        /*
         * Node ID array of nodes that are ready to be moved when user clicks 'Finish Moving'
         */
        export let nodesToMove: any = null;

        export let parentOfNewNode: json.NodeInfo = null;

        /*
         * indicates editor is displaying a node that is not yet saved on the server
         */
        export let editingUnsavedNode: boolean = false;

        /*
         * node (NodeInfo.java) that is being created under when new node is created
         */
        export let sendNotificationPendingSave: boolean = false;

        /*
         * Node being edited
         *
         * todo-2: this and several other variables can now be moved into the dialog class? Is that good or bad
         * coupling/responsibility?
         */
        export let editNode: json.NodeInfo = null;

        /* Instance of EditNodeDialog: For now creating new one each time */
        export let editNodeDlgInst: EditNodeDlg = null;

        /*
         * type=NodeInfo.java
         *
         * When inserting a new node, this holds the node that was clicked on at the time the insert was requested, and
         * is sent to server for ordinal position assignment of new node. Also if this var is null, it indicates we are
         * creating in a 'create under parent' mode, versus non-null meaning 'insert inline' type of insert.
         *
         */
        export let nodeInsertTarget: any = null;

        /* returns true if we can 'try to' insert under 'node' or false if not */
        export let isEditAllowed = function(node: any): boolean {
            return meta64.userPreferences.editMode && node.path != "/" &&
                /*
                 * Check that if we have a commentBy property we are the commenter, before allowing edit button also.
                 */
                (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node)) //
                && !props.isNonOwnedNode(node);
        }

        /* best we can do here is allow the disableInsert prop to be able to turn things off, node by node */
        export let isInsertAllowed = function(node: any): boolean {
            return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
        }

        export let startEditingNewNode = function(): void {
            editingUnsavedNode = false;
            editNode = null;
            editNodeDlgInst = new EditNodeDlg();
            editNodeDlgInst.saveNewNode("");
        }

        /*
         * called to display editor that will come up BEFORE any node is saved onto the server, so that the first time
         * any save is performed we will have the correct node name, at least.
         *
         * This version is no longer being used, and currently this means 'editingUnsavedNode' is not currently ever
         * triggered. The new approach now that we have the ability to 'rename' nodes is to just create one with a
         * random name an let user start editing right away and then rename the node IF a custom node name is needed.
         *
         * This means if we call this function (startEditingNewNodeWithName) instead of 'startEditingNewNode()'
         * that will cause the GUI to always prompt for the node name before creating the node. This was the original
         * functionality and still works.
         */
        export let startEditingNewNodeWithName = function(): void {
            editingUnsavedNode = true;
            editNode = null;
            editNodeDlgInst = new EditNodeDlg();
            editNodeDlgInst.open();
        }

        export let insertNodeResponse = function(res: json.InsertNodeResponse): void {
            if (util.checkSuccess("Insert node", res)) {
                meta64.initNode(res.newNode, true);
                meta64.highlightNode(res.newNode, true);
                runEditNode(res.newNode.uid);
            }
        }

        export let createSubNodeResponse = function(res: json.CreateSubNodeResponse): void {
            if (util.checkSuccess("Create subnode", res)) {
                meta64.initNode(res.newNode, true);
                runEditNode(res.newNode.uid);
            }
        }

        export let saveNodeResponse = function(res: json.SaveNodeResponse, payload: any): void {
            if (util.checkSuccess("Save node", res)) {
                /* becasuse I don't understand 'editingUnsavedNode' variable any longer until i refresh my memory, i will use
                the old approach of refreshing entire tree rather than more efficient refresnNodeOnPage, becuase it requires
                the node to already be on the page, and this requires in depth analys i'm not going to do right this minute.
                */
                //render.refreshNodeOnPage(res.node);
                view.refreshTree(null, false, payload.savedId);
                meta64.selectTab("mainTabName");
            }
        }

        export let editMode = function(modeVal?: boolean): void {
            if (typeof modeVal != 'undefined') {
                meta64.userPreferences.editMode = modeVal;
            }
            else {
                meta64.userPreferences.editMode = meta64.userPreferences.editMode ? false : true;
            }
            // todo-3: really edit mode button needs to be some kind of button
            // that can show an on/off state.
            render.renderPageFromData();

            /*
             * Since edit mode turns on lots of buttons, the location of the node we are viewing can change so much it
             * goes completely offscreen out of view, so we scroll it back into view every time
             */
            view.scrollToSelectedNode();

            meta64.saveUserPreferences();
        }

        export let moveNodeUp = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                var nodeAbove = getNodeAbove(node);
                if (nodeAbove == null) {
                    return;
                }

                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": nodeAbove.name
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeDown = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                let nodeBelow: json.NodeInfo = getNodeBelow(node);
                if (nodeBelow == null) {
                    return;
                }

                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": nodeBelow.name,
                    "siblingId": node.name
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeToTop = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                var topNode = getFirstChildNode();
                if (topNode == null) {
                    return;
                }

                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": topNode.name
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeToBottom = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": node.name,
                    "siblingId": null
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        /*
         * Returns the node above the specified node or null if node is itself the top node
         */
        export let getNodeAbove = function(node): any {
            let ordinal: number = meta64.getOrdinalOfNode(node);
            if (ordinal <= 0)
                return null;
            return meta64.currentNodeData.children[ordinal - 1];
        }

        /*
         * Returns the node below the specified node or null if node is itself the bottom node
         */
        export let getNodeBelow = function(node: any): json.NodeInfo {
            let ordinal: number = meta64.getOrdinalOfNode(node);
            console.log("ordinal = " + ordinal);
            if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
                return null;

            return meta64.currentNodeData.children[ordinal + 1];
        }

        export let getFirstChildNode = function(): any {
            if (!meta64.currentNodeData || !meta64.currentNodeData.children) return null;
            return meta64.currentNodeData.children[0];
        }

        export let runEditNode = function(uid: any): void {
            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                editNode = null;
                (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            editingUnsavedNode = false;

            util.json<json.InitNodeEditRequest, json.InitNodeEditResponse>("initNodeEdit", {
                "nodeId": node.id
            }, initNodeEditResponse);
        }

        export let insertNode = function(uid?: any): void {

            parentOfNewNode = meta64.currentNode;
            if (!parentOfNewNode) {
                console.log("Unknown parent");
                return;
            }

            /*
             * We get the node selected for the insert position by using the uid if one was passed in or using the
             * currently highlighted node if no uid was passed.
             */
            let node: json.NodeInfo = null;
            if (!uid) {
                node = meta64.getHighlightedNode();
            } else {
                node = meta64.uidToNodeMap[uid];
            }

            if (node) {
                nodeInsertTarget = node;
                startEditingNewNode();
            }
        }

        export let createSubNode = function(uid?: any): void {

            /*
             * If no uid provided we deafult to creating a node under the currently viewed node (parent of current page), or any selected
             * node if there is a selected node.
             */
            if (!uid) {
                let highlightNode: json.NodeInfo = meta64.getHighlightedNode();
                if (highlightNode) {
                    parentOfNewNode = highlightNode;
                }
                else {
                    parentOfNewNode = meta64.currentNode;
                }
            } else {
                parentOfNewNode = meta64.uidToNodeMap[uid];
                if (!parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }

            /*
             * this indicates we are NOT inserting inline. An inline insert would always have a target.
             */
            nodeInsertTarget = null;
            startEditingNewNode();
        }

        export let replyToComment = function(uid: any): void {
            createSubNode(uid);
        }

        export let clearSelections = function(): void {
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
        export let deleteSelNodes = function(): void {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
                return;
            }

            (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.",
                function() {
                    let postDeleteSelNode: json.NodeInfo = getBestPostDeleteSelNode();

                    util.json<json.DeleteNodesRequest, json.DeleteNodesResponse>("deleteNodes", {
                        "nodeIds": selNodesArray
                    }, deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
                })).open();
        }

        /* Gets the node we want to scroll to after a delete */
        export let getBestPostDeleteSelNode = function(): json.NodeInfo {
            /* Use a hashmap-type approach to saving all selected nodes into a looup map */
            let nodesMap: Object = meta64.getSelectedNodesAsMapById();
            let bestNode: json.NodeInfo = null;
            let takeNextNode: boolean = false;

            /* now we scan the children, and the last child we encounterd up until we find the rist onen in nodesMap will be the
            node we will want to select and scroll the user to AFTER the deleting is done */
            for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                let node: json.NodeInfo = meta64.currentNodeData.children[i];

                if (takeNextNode) {
                    return node;
                }

                /* is this node one to be deleted */
                if (nodesMap[node.id]) {
                    takeNextNode = true;
                }
                else {
                    bestNode = node;
                }
            }
            return bestNode;
        }

        export let moveSelNodes = function(): void {

            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
                return;
            }

            (new ConfirmDlg(
                "Confirm Paste",
                "Paste " + selNodesArray.length + " node(s) to new location ?",
                "Yes, move.",
                function() {
                    nodesToMove = selNodesArray;
                    meta64.selectedNodes = {}; // clear selections.
                    meta64.refreshAllGuiEnablement();
                })).open();
        }

        export let finishMovingSelNodes = function(): void {
            (new ConfirmDlg("Confirm Move", "Move " + nodesToMove.length + " node(s) to selected location ?",
                "Yes, move.", function() {

                    var highlightNode = meta64.getHighlightedNode();

                    /*
                     * For now, we will just cram the nodes onto the end of the children of the currently selected
                     * page. Later on we can get more specific about allowing precise destination location for moved
                     * nodes.
                     */
                    util.json<json.MoveNodesRequest, json.MoveNodesResponse>("moveNodes", {
                        "targetNodeId": highlightNode.id,
                        "targetChildId": highlightNode != null ? highlightNode.id : null,
                        "nodeIds": nodesToMove
                    }, moveNodesResponse);
                })).open();
        }

        export let insertBookWarAndPeace = function(): void {
            (new ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function() {

                /* inserting under whatever node user has focused */
                var node = meta64.getHighlightedNode();

                if (!node) {
                    (new MessageDlg("No node is selected.")).open();
                } else {
                    util.json<json.InsertBookRequest, json.InsertBookResponse>("insertBook", {
                        "nodeId": node.id,
                        "bookName": "War and Peace",
                        "truncated": user.isTestUserAccount()
                    }, insertBookResponse);
                }
            })).open();
        }
    }
}
