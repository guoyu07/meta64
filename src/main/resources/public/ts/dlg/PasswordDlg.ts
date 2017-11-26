console.log("LoginDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { Constants as cnst} from "../Constants";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var user, util;

export class PasswordDlg extends DialogBase {
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
    }

    getPasswordVal = (): string => {
        return this.password;
    }
}
