import { DialogBase } from "../DialogBase";
import { PasswordTextField } from "../widget/PasswordTextField";
import { TextField } from "../widget/TextField";
export declare class LoginDlg extends DialogBase {
    userTextField: TextField;
    passwordTextField: PasswordTextField;
    constructor(paramsTest: Object);
    buildGUI: () => void;
    init: () => void;
    populateFromCookies: () => void;
    login: () => void;
    resetPassword: () => any;
}
