console.log("EditNodeDlg.ts");

import {DialogBase} from "./DialogBase";

export interface EditNodeDlg extends DialogBase {
    saveNewNode(newNodeName?: string): void;
    populateEditNodePg() : void;
}
