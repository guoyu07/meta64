console.log("LoginDlg.ts");

import { DialogBase } from "../DialogBase";
import { ConfirmDlg } from "./ConfirmDlg";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { Header } from "../widget/Header";
import { HeaderRe } from "../widget/HeaderRe";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { Form } from "../widget/Form";
import { Div } from "../widget/Div";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class LoginDlg extends DialogBase {

    userTextField: TextField;
    passwordTextField: PasswordTextField;

    constructor(paramsTest: Object) {
        super("Login", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new Div(null, {
                    "class": "form-group"
                },
                    [
                        this.userTextField = new TextField("User"),
                        this.passwordTextField = new PasswordTextField("Password"),
                    ]
                ),
                new ButtonBar(
                    [
                        new Button("Login", this.login, null, true, this),
                        new Button("Forgot Password", this.resetPassword, null, true, this),
                        new Button("Close", null, null, true, this)
                    ])

            ])
        ]);

        this.userTextField.bindEnterKey(this.login);
        this.passwordTextField.bindEnterKey(this.login);
    }

    init = (): void => {
        this.populateFromCookies();
    }

    populateFromCookies = (): void => {
        this.userTextField.setValue(S.util.getCookie(Constants.COOKIE_LOGIN_USR));
        this.passwordTextField.setValue(S.util.getCookie(Constants.COOKIE_LOGIN_PWD));
    }

    login = (): void => {
        let usr = this.userTextField.getValue();
        let pwd = this.passwordTextField.getValue();
        S.user.login(this, usr, pwd);
    }

    resetPassword = (): any => {
        let usr = this.userTextField.getValue();

        new ConfirmDlg({
            "title": "Confirm Reset Password",
            "message": "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
            "buttonText": "Yes, reset.", "yesCallback":
                () => {
                    this.cancel();
                    new ResetPasswordDlg({ "user": usr }).open();
                }
        }).open();
    }
}
