console.log("Edit.ts");

import * as I from "./Interfaces";
import { EditNodeDlg } from "./dlg/EditNodeDlg";
import { ConfirmDlg } from "./dlg/ConfirmDlg";
import { CreateNodeDlg } from "./dlg/CreateNodeDlg";
import { RenameNodeDlg } from "./dlg/RenameNodeDlg";
import { ImportDlg } from "./dlg/ImportDlg";
import { ExportDlg } from "./dlg/ExportDlg";
import { PrefsDlg } from "./PrefsDlg";
import { ChangePasswordDlg } from "./dlg/ChangePasswordDlg";
import { ManageAccountDlg } from "./dlg/ManageAccountDlg";
import { ImportFromFileDropzoneDlg } from "./dlg/ImportFromFileDropzoneDlg";
import { Constants as cnst } from "./Constants";

import { Factory } from "./types/Factory";
import { Meta64 } from "./types/Meta64";
import { Util } from "./types/Util";
import { Render } from "./types/Render";
import { View } from "./types/View";
import { Nav } from "./types/Nav";
import { Props } from "./types/Props";
import { User } from "./types/User";

let meta64: Meta64;
let util: Util;
let nav: Nav;
let props: Props;
let render: Render;
let user: User;
let view: View;

export class Edit {

    postConstruct(_f: any) {
        let f = <Factory>_f;
        util = f.getUtil();
        meta64 = f.getMeta64();
        nav = f.getNav();
        props = f.getProps();
        render = f.getRender();
        user = f.getUser();
        view = f.getView();
    }

    /* Node being uploaded to */
    importTargetNode: any = null;

    createNode = (): void => {
        new CreateNodeDlg().open();
    }

    openChangePasswordDlg = (): void => {
        new ChangePasswordDlg({}).open();
    }

    openManageAccountDlg = (): void => {
        new ManageAccountDlg().open();
    }

    editPreferences = (): void => {
        new PrefsDlg().open();
    }

    renameNode = (): void => {
        new RenameNodeDlg(null).open();
    }

    openImportDlg = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();
        if (!node) {
            this.importTargetNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        this.importTargetNode = node;

        new ImportFromFileDropzoneDlg().open();

        /* This dialog is no longer needed, now that we support uploading from a stream. This older dialog imports a file
        as specified by the admin by filename, but has the limitation of requiring that file to already exist
        in the server admin folder ON the actual server where the webapp is running.
        Factory.createDefault("ImportDlgImpl", (dlg: ImportDlg) => {
            dlg.open();
        })
        */
    }

    openExportDlg = (): void => {
        new ExportDlg().open();
    }

    private insertBookResponse = (res: I.InsertBookResponse): void => {
        console.log("insertBookResponse running.");

        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    }

    private deleteNodesResponse = (res: I.DeleteNodesResponse, payload: Object): void => {
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

    private initNodeEditResponse = (res: I.InitNodeEditResponse): void => {
        if (util.checkSuccess("Editing node", res)) {
            let node: I.NodeInfo = res.nodeInfo;

            /* if this is a comment node and we are the commenter */
            let editingAllowed: boolean = props.isOwnedCommentNode(node);

            if (!editingAllowed) {
                editingAllowed = meta64.isAdminUser || (!props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node));
            }

            if (editingAllowed) {
                /*
                 * Server will have sent us back the raw text content, that should be markdown instead of any HTML, so
                 * that we can display this and save.
                 */
                this.editNode = res.nodeInfo;

                let dlg = new EditNodeDlg({});
                this.editNodeDlgInst = dlg;
                dlg.open();


            } else {
                util.showMessage("You cannot edit nodes that you don't own.");
            }
        }
    }

    private moveNodesResponse = (res: I.MoveNodesResponse): void => {
        if (util.checkSuccess("Move nodes", res)) {
            this.nodesToMove = null; // reset
            this.nodesToMoveSet = {};
            view.refreshTree(null, false);
        }
    }

    private setNodePositionResponse = (res: I.SetNodePositionResponse): void => {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    }

    showReadOnlyProperties: boolean = true;
    /*
     * Node ID array of nodes that are ready to be moved when user clicks 'Finish Moving'
     */
    nodesToMove: any = null;

    /* todo-1: need to find out if there's a better way to do an ordered set in javascript so I don't need
    both nodesToMove and nodesToMoveSet
    */
    nodesToMoveSet: Object = {};

    parentOfNewNode: I.NodeInfo = null;

    /*
     * indicates editor is displaying a node that is not yet saved on the server
     */
    editingUnsavedNode: boolean = false;

    /*
     * node (NodeInfo.java) that is being created under when new node is created
     */
    sendNotificationPendingSave: boolean = false;

    /*
     * Node being edited
     *
     * todo-2: this and several other variables can now be moved into the dialog class? Is that good or bad
     * coupling/responsibility?
     */
    editNode: I.NodeInfo = null;

    /* Instance of EditNodeDialog: For now creating new one each time */
    editNodeDlgInst: EditNodeDlg = null;

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
    isEditAllowed = (node: any): boolean => {
        return meta64.userPreferences.editMode && node.path != "/" &&
            /*
             * Check that if we have a commentBy property we are the commenter, before allowing edit button also.
             */
            (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node)) //
            && !props.isNonOwnedNode(node);
    }

    /* best we can do here is allow the disableInsert prop to be able to turn things off, node by node */
    isInsertAllowed = (node: any): boolean => {
        return props.getNodePropertyVal(cnst.DISABLE_INSERT, node) == null;
    }

    startEditingNewNode = (typeName?: string, createAtTop?: boolean): void => {
        this.editingUnsavedNode = false;
        this.editNode = null;
        let dlg = new EditNodeDlg({ "typeName": typeName, "createAtTop": createAtTop });
        this.editNodeDlgInst = dlg;
        dlg.saveNewNode("");

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
    startEditingNewNodeWithName = (): void => {
        this.editingUnsavedNode = true;
        this.editNode = null;
        let dlg = new EditNodeDlg({});
        this.editNodeDlgInst = dlg;
        dlg.saveNewNode("");
    }

    insertNodeResponse = (res: I.InsertNodeResponse): void => {
        if (util.checkSuccess("Insert node", res)) {
            meta64.initNode(res.newNode, true);
            meta64.highlightNode(res.newNode, true);
            this.runEditNode(res.newNode.uid);
        }
    }

    createSubNodeResponse = (res: I.CreateSubNodeResponse): void => {
        if (util.checkSuccess("Create subnode", res)) {
            meta64.initNode(res.newNode, true);
            this.runEditNode(res.newNode.uid);
        }
    }

    saveNodeResponse = (res: I.SaveNodeResponse, payload: any): void => {
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

    editMode = (modeVal?: boolean): void => {
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

    moveNodeUp = (uid?: string): void => {
        if (!uid) {
            let selNode: I.NodeInfo = meta64.getHighlightedNode();
            uid = selNode.uid;
        }

        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (node) {
            util.ajax<I.SetNodePositionRequest, I.SetNodePositionResponse>("setNodePosition", {
                "nodeId": node.id,
                "targetName": "up"
            }, this.setNodePositionResponse);
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    moveNodeDown = (uid?: string): void => {
        if (!uid) {
            let selNode: I.NodeInfo = meta64.getHighlightedNode();
            uid = selNode.uid;
        }

        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (node) {
            util.ajax<I.SetNodePositionRequest, I.SetNodePositionResponse>("setNodePosition", {
                "nodeId": node.id,
                "targetName": "down"
            }, this.setNodePositionResponse);
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    moveNodeToTop = (uid?: string): void => {
        if (!uid) {
            let selNode: I.NodeInfo = meta64.getHighlightedNode();
            uid = selNode.uid;
        }
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (node) {
            util.ajax<I.SetNodePositionRequest, I.SetNodePositionResponse>("setNodePosition", {
                "nodeId": node.id,
                "targetName": "top"
            }, this.setNodePositionResponse);
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    moveNodeToBottom = (uid?: string): void => {
        if (!uid) {
            let selNode: I.NodeInfo = meta64.getHighlightedNode();
            uid = selNode.uid;
        }
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (node) {
            util.ajax<I.SetNodePositionRequest, I.SetNodePositionResponse>("setNodePosition", {
                "nodeId": node.id,
                "targetName": "bottom"
            }, this.setNodePositionResponse);
        } else {
            console.log("idToNodeMap does not contain " + uid);
        }
    }

    /*
     * Returns the node above the specified node or null if node is itself the top node
     */
    getNodeAbove = (node): any => {
        let ordinal: number = meta64.getOrdinalOfNode(node);
        if (ordinal <= 0)
            return null;
        return meta64.currentNodeData.children[ordinal - 1];
    }

    /*
     * Returns the node below the specified node or null if node is itself the bottom node
     */
    getNodeBelow = (node: any): I.NodeInfo => {
        let ordinal: number = meta64.getOrdinalOfNode(node);
        console.log("ordinal = " + ordinal);
        if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
            return null;

        return meta64.currentNodeData.children[ordinal + 1];
    }

    getFirstChildNode = (): any => {
        if (!meta64.currentNodeData || !meta64.currentNodeData.children) return null;
        return meta64.currentNodeData.children[0];
    }

    runEditNode = (uid: any): void => {
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (!node) {
            this.editNode = null;
            util.showMessage("Unknown nodeId in editNodeClick: " + uid);
            return;
        }
        this.editingUnsavedNode = false;

        util.ajax<I.InitNodeEditRequest, I.InitNodeEditResponse>("initNodeEdit", {
            "nodeId": node.id
        }, this.initNodeEditResponse);
    }

    insertNode = (uid?: any, typeName?: string): void => {

        this.parentOfNewNode = meta64.currentNode;
        if (!this.parentOfNewNode) {
            console.log("Unknown parent");
            return;
        }

        /*
         * We get the node selected for the insert position by using the uid if one was passed in or using the
         * currently highlighted node if no uid was passed.
         */
        let node: I.NodeInfo = null;
        if (!uid) {
            node = meta64.getHighlightedNode();
        } else {
            node = meta64.uidToNodeMap[uid];
        }

        if (node) {
            this.nodeInsertTarget = node;
            this.startEditingNewNode(typeName);
        }
    }

    createSubNode = (uid?: any, typeName?: string, createAtTop?: boolean): void => {
        /*
         * If no uid provided we deafult to creating a node under the currently viewed node (parent of current page), or any selected
         * node if there is a selected node.
         */
        if (!uid) {
            let highlightNode: I.NodeInfo = meta64.getHighlightedNode();
            if (highlightNode) {
                this.parentOfNewNode = highlightNode;
            }
            else {
                this.parentOfNewNode = meta64.currentNode;
            }
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
        this.startEditingNewNode(typeName, createAtTop);
    }

    replyToComment = (uid: any): void => {
        this.createSubNode(uid);
    }

    clearSelections = (): void => {
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
    deleteSelNodes = (): void => {
        let selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            util.showMessage("You have not selected any nodes. Select nodes to delete first.");
            return;
        }

        new ConfirmDlg({
            "title": "Confirm Delete", "message": "Delete " + selNodesArray.length + " node(s) ?", "buttonText": "Yes, delete.", "yesCallback":
                () => {
                    let postDeleteSelNode: I.NodeInfo = this.getBestPostDeleteSelNode();

                    util.ajax<I.DeleteNodesRequest, I.DeleteNodesResponse>("deleteNodes", {
                        "nodeIds": selNodesArray
                    }, (res: I.DeleteNodesResponse) => {
                        this.deleteNodesResponse(res, { "postDeleteSelNode": postDeleteSelNode });
                    });
                }
        }).open();
    }

    /* Gets the node we want to scroll to after a delete */
    getBestPostDeleteSelNode = (): I.NodeInfo => {
        /* Use a hashmap-type approach to saving all selected nodes into a looup map */
        let nodesMap: Object = meta64.getSelectedNodesAsMapById();
        let bestNode: I.NodeInfo = null;
        let takeNextNode: boolean = false;

        /* now we scan the children, and the last child we encounterd up until we find the rist onen in nodesMap will be the
        node we will want to select and scroll the user to AFTER the deleting is done */
        for (let i = 0; i < meta64.currentNodeData.children.length; i++) {
            let node: I.NodeInfo = meta64.currentNodeData.children[i];

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

    cutSelNodes = (): void => {

        let selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            util.showMessage("You have not selected any nodes. Select nodes first.");
            return;
        }

        new ConfirmDlg({
            "title": "Confirm Cut", "message": "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?", "buttonText": "Yes", "yesCallback":
                () => {
                    this.nodesToMove = selNodesArray;
                    this.loadNodesToMoveSet(selNodesArray);
                    /* todo-1: need to have a way to find all selected checkboxes in the gui and reset them all to unchecked */
                    meta64.selectedNodes = {}; // clear selections.

                    /* now we render again and the nodes that were cut will disappear from view */
                    render.renderPageFromData();
                    meta64.refreshAllGuiEnablement();
                }
        }).open();
    }

    private loadNodesToMoveSet = (nodeIds: string[]) => {
        this.nodesToMoveSet = {};
        for (let id of nodeIds) {
            this.nodesToMoveSet[id] = true;
        }
    }

    pasteSelNodes = (): void => {
        new ConfirmDlg({
            "title": "Confirm Paste", "message": "Paste " + this.nodesToMove.length + " node(s) under selected parent node ?", "buttonText": "Yes, paste", "yesCallback":
                () => {
                    let highlightNode = meta64.getHighlightedNode();
                    /*
                     * For now, we will just cram the nodes onto the end of the children of the currently selected
                     * page. Later on we can get more specific about allowing precise destination location for moved
                     * nodes.
                     */
                    util.ajax<I.MoveNodesRequest, I.MoveNodesResponse>("moveNodes", {
                        "targetNodeId": highlightNode.id,
                        "targetChildId": highlightNode != null ? highlightNode.id : null,
                        "nodeIds": this.nodesToMove
                    }, this.moveNodesResponse);
                }
        }).open();
    }

    insertBookWarAndPeace = (): void => {
        new ConfirmDlg({
            "title": "Confirm", "message": "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!",
            "buttonText": "Yes, insert book.", "yesCallback":
                () => {
                    /* inserting under whatever node user has focused */
                    var node = meta64.getHighlightedNode();

                    if (!node) {
                        util.showMessage("No node is selected.");
                    } else {
                        util.ajax<I.InsertBookRequest, I.InsertBookResponse>("insertBook", {
                            "nodeId": node.id,
                            "bookName": "War and Peace",
                            "truncated": user.isTestUserAccount()
                        }, this.insertBookResponse);
                    }
                }
        }).open();
    }
}
