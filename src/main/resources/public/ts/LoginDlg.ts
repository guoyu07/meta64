console.log("LoginDlg.ts");

import {DialogBase} from "./DialogBase";

export interface LoginDlg extends DialogBase {
    build();
    init();
    populateFromCookies();
    login();
    resetPassword();
}
