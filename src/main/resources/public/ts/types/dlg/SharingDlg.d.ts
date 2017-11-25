import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Div } from "../widget/Div";
export declare class SharingDlg extends DialogBase {
    privsTable: Div;
    constructor();
    buildGUI: () => void;
    init: () => void;
    reload: () => void;
    populate: (res: I.GetNodePrivilegesResponse) => void;
    save: () => void;
    removePrivilege: (principalNodeId: string, privilege: string) => void;
    removePrivilegeResponse: (res: I.RemovePrivilegeResponse) => void;
    shareToPersonDlg: () => void;
    shareNodeToPublic: () => void;
}
