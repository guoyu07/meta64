console.log("EditIntf.ts");

import * as I from "../Interfaces";

export interface EditIntf {

    postConstruct(_f: any) ;

    /* Node being uploaded to */
    importTargetNode: any;

    createNode (): void ;

    openChangePasswordDlg (): void ;

    openManageAccountDlg (): void ;

    editPreferences (): void ;

    renameNode (): void ;

    openImportDlg (): void ;
    openExportDlg (): void ;


    showReadOnlyProperties: boolean;
    /*
     * Node ID array of nodes that are ready to be moved when user clicks 'Finish Moving'
     */
    nodesToMove: any ;

    /* todo-1: need to find out if there's a better way to do an ordered set in javascript so I don't need
    both nodesToMove and nodesToMoveSet
    */
    nodesToMoveSet: Object ;

    parentOfNewNode: I.NodeInfo ;

    /*
     * indicates editor is displaying a node that is not yet saved on the server
     */
    editingUnsavedNode: boolean ;

    /*
     * node (NodeInfo.java) that is being created under when new node is created
     */
    sendNotificationPendingSave: boolean ;

    /*
     * Node being edited
     *
     * todo-2: this and several other variables can now be moved into the dialog class? Is that good or bad
     * coupling/responsibility?
     */
    editNode: I.NodeInfo;

    /* Instance of EditNodeDialog: For now creating new one each time */
    editNodeDlgInst: any; //todo-0: add this type back -> EditNodeDlg ;

    /*
     * type=NodeInfo.java
     *
     * When inserting a new node, this holds the node that was clicked on at the time the insert was requested, and
     * is sent to server for ordinal position assignment of new node. Also if this var is null, it indicates we are
     * creating in a 'create under parent' mode, versus non-null meaning 'insert inline' type of insert.
     *
     */
    nodeInsertTarget: any ;

    /* returns true if we can 'try to' insert under 'node' or false if not */
    isEditAllowed (node: any): boolean ;

    /* best we can do here is allow the disableInsert prop to be able to turn things off, node by node */
    isInsertAllowed (node: any): boolean ;

    startEditingNewNode (typeName?: string, createAtTop?: boolean): void ;

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
    startEditingNewNodeWithName (): void ;

    insertNodeResponse (res: I.InsertNodeResponse): void ;

    createSubNodeResponse (res: I.CreateSubNodeResponse): void ;

    saveNodeResponse (res: I.SaveNodeResponse, payload: any): void ;
    editMode (modeVal?: boolean): void ;

    moveNodeUp (uid?: string): void ;
    moveNodeDown (uid?: string): void ;

    moveNodeToTop (uid?: string): void ;

    moveNodeToBottom (uid?: string): void ;
    /*
     * Returns the node above the specified node or null if node is itself the top node
     */
    getNodeAbove (node : I.NodeInfo): any ;

    /*
     * Returns the node below the specified node or null if node is itself the bottom node
     */
    getNodeBelow (node: I.NodeInfo): I.NodeInfo ;

    getFirstChildNode (): any ;

    runEditNode (uid: any): void ;
    insertNode (uid?: any, typeName?: string): void ;
    createSubNode (uid?: any, typeName?: string, createAtTop?: boolean): void ;

    replyToComment (uid: any): void ;

    clearSelections (): void ;

    /*
     * Delete the single node identified by 'uid' parameter if uid parameter is passed, and if uid parameter is not
     * passed then use the node selections for multiple selections on the page.
     */
    deleteSelNodes (): void ;

    /* Gets the node we want to scroll to after a delete */
    getBestPostDeleteSelNode (): I.NodeInfo ;
    cutSelNodes (): void ;

    pasteSelNodes (): void ;

    insertBookWarAndPeace (): void ;
}
