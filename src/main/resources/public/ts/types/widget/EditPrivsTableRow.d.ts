import { Comp } from "./base/Comp";
import * as I from "../Interfaces";
import { Div } from "./Div";
import { SharingDlg } from "../dlg/SharingDlg";
export declare class EditPrivsTableRow extends Comp {
    sharingDlg: SharingDlg;
    aclEntry: I.AccessControlEntryInfo;
    constructor(sharingDlg: SharingDlg, aclEntry: I.AccessControlEntryInfo);
    renderAclPrivileges: (div: Div, aclEntry: I.AccessControlEntryInfo) => void;
    renderHtml: () => string;
}
