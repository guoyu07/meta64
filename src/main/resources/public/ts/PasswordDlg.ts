console.log("PasswordDlg.ts");

import {DialogBase} from "./DialogBase";

export interface PasswordDlg extends DialogBase {
    getPasswordVal() : string;
}