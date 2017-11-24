import { DialogBase } from "./DialogBase";
import * as I from "./Interfaces";
import { TextField } from "./widget/TextField";
export declare class RenameNodeDlg extends DialogBase {
    newNameTextField: TextField;
    constructor(args: Object);
    buildGUI: () => void;
    renameNode: () => void;
    renameNodeResponse: (res: I.RenameNodeResponse, renamingPageRoot: boolean) => void;
}
