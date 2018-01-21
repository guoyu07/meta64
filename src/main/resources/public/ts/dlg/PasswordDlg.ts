console.log("LoginDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class PasswordDlg extends DialogBase {
    passwordTextField: PasswordTextField;
    password: string;

    constructor(paramsTest: Object) {
        super("Encryption Password", "modal-md");
        this.buildGUI();
    }

    buildGUI(): void {
        this.setChildren([
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
