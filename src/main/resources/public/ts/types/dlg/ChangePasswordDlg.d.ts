import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { PasswordTextField } from "../widget/PasswordTextField";
export declare class ChangePasswordDlg extends DialogBase {
    passwordField: PasswordTextField;
    pwd: string;
    private passCode;
    constructor(args: Object);
    buildGUI: () => void;
    changePassword: () => void;
    changePasswordResponse: (res: I.ChangePasswordResponse) => void;
    init: () => void;
}
