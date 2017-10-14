console.log("LoginDlg.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { PasswordDlg } from "./PasswordDlg";
import { user } from "./User";
import { cnst } from "./Constants";
import { util } from "./Util";
import { Factory } from "./Factory";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";

export default class PasswordDlgImpl extends DialogBaseImpl implements PasswordDlg {

    passwordPromise: Promise<string>;
    passwordTextField: PasswordTextField;
    password: string;

    constructor(paramsTest: Object) {
        super();
        this.buildGUI();
    }

    buildGUI(): void {
        this.setChildren([
            new Header("Encryption Password"),
            this.passwordTextField = new PasswordTextField("Password"),
            new ButtonBar([
                new Button("Ok", this.okButton, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);

        this.passwordTextField.bindEnterKey(this.okButton);
    }

    okButton = (): void => {
        this.password = this.passwordTextField.getValue();
        alert("pwd=" + this.password);
    }

    getPasswordVal = (): string => {
        return this.password;
    }
}
