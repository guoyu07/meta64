import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { TextField } from "../widget/TextField";
export declare class SearchContentDlg extends DialogBase {
    searchTextField: TextField;
    constructor();
    buildGUI: () => void;
    searchNodes: () => void;
    searchProperty: (searchProp: string) => void;
    searchNodesResponse: (res: I.NodeSearchResponse) => void;
    init: () => void;
}
