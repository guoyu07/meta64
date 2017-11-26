console.log("EditIntf.ts");

import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface EditIntf {
    importTargetNode: any;
    showReadOnlyProperties: boolean;
    nodesToMove: any;
    nodesToMoveSet: Object;
    parentOfNewNode: I.NodeInfo;
    editingUnsavedNode: boolean;
    sendNotificationPendingSave: boolean;
    editNode: I.NodeInfo;
    editNodeDlgInst: any; //todo-1: add this type back -> EditNodeDlg ;
    nodeInsertTarget: any;

    postConstruct(s: Singletons);
    createNode(): void;
    openChangePasswordDlg(): void;
    openManageAccountDlg(): void;
    editPreferences(): void;
    renameNode(): void;
    openImportDlg(): void;
    openExportDlg(): void;
    isEditAllowed(node: any): boolean;
    isInsertAllowed(node: any): boolean;
    startEditingNewNode(typeName?: string, createAtTop?: boolean): void;
    startEditingNewNodeWithName(): void;
    insertNodeResponse(res: I.InsertNodeResponse): void;
    createSubNodeResponse(res: I.CreateSubNodeResponse): void;
    saveNodeResponse(res: I.SaveNodeResponse, payload: any): void;
    editMode(modeVal?: boolean): void;
    moveNodeUp(uid?: string): void;
    moveNodeDown(uid?: string): void;
    moveNodeToTop(uid?: string): void;
    moveNodeToBottom(uid?: string): void;
    getNodeAbove(node: I.NodeInfo): any;
    getNodeBelow(node: I.NodeInfo): I.NodeInfo;
    getFirstChildNode(): any;
    runEditNode(uid: any): void;
    insertNode(uid?: any, typeName?: string): void;
    createSubNode(uid?: any, typeName?: string, createAtTop?: boolean): void;
    replyToComment(uid: any): void;
    clearSelections(): void;
    deleteSelNodes(): void;
    getBestPostDeleteSelNode(): I.NodeInfo;
    cutSelNodes(): void;
    pasteSelNodes(): void;
    insertBookWarAndPeace(): void;
}
