import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { TextField } from "../widget/TextField";
export declare class ResetPasswordDlg extends DialogBase {
    userTextField: TextField;
    emailTextField: TextField;
    private user;
    constructor(args: Object);
    buildGUI: () => void;
    resetPassword: () => void;
    resetPasswordResponse: (res: I.ResetPasswordResponse) => void;
    init: () => void;
}
