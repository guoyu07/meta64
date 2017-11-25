import { DialogBase } from "../DialogBase";
import { PasswordTextField } from "../widget/PasswordTextField";
export declare class PasswordDlg extends DialogBase {
    passwordTextField: PasswordTextField;
    password: string;
    constructor(paramsTest: Object);
    buildGUI(): void;
    okButton: () => void;
    getPasswordVal: () => string;
}
