import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { SharingDlg } from "./SharingDlg";
import { TextField } from "../widget/TextField";
export declare class ShareToPersonDlg extends DialogBase {
    shareToUserTextField: TextField;
    sharingDlg: SharingDlg;
    constructor(args: Object);
    buildGUI: () => void;
    shareNodeToPerson: () => void;
    reloadFromShareWithPerson: (res: I.AddPrivilegeResponse) => void;
}
