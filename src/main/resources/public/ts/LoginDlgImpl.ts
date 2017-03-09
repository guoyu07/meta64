console.log("LoginDlg.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { LoginDlg } from "./LoginDlg";
import { ConfirmDlg } from "./ConfirmDlg";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { user } from "./User";
import { cnst } from "./Constants";
import { util } from "./Util";
import { Factory } from "./Factory";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";

export default class LoginDlgImpl extends DialogBaseImpl implements LoginDlg {

    userTextField: TextField;
    passwordTextField: PasswordTextField;

    constructor(paramsTest: Object) {
        super("LoginDlgImpl");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header("Login"),
            this.userTextField = new TextField("User"),
            this.passwordTextField = new PasswordTextField("Password"),
            new ButtonBar([
                new Button("Login", this.login, null, true, this),
                new Button("Forgot Password", this.resetPassword, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);

        this.userTextField.bindEnterKey(this.login);
        this.passwordTextField.bindEnterKey(this.login);
    }

    init = (): void => {
        this.populateFromCookies();
    }

    populateFromCookies = (): void => {
        this.userTextField.setValue(util.getCookie(cnst.COOKIE_LOGIN_USR));
        this.passwordTextField.setValue(util.getCookie(cnst.COOKIE_LOGIN_PWD));
    }

    login = (): void => {
        let usr = this.userTextField.getValue();
        let pwd = this.passwordTextField.getValue();

        user.login(this, usr, pwd);
    }

    resetPassword = (): any => {
        let usr = this.userTextField.getValue();

        Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
            dlg.open();
        }, {
                "title": "Confirm Reset Password",
                "message": "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
                "buttonText": "Yes, reset.", "yesCallback":
                () => {
                    this.cancel();
                    Factory.createDefault("ResetPasswordDlgImpl", (dlg: ResetPasswordDlg) => {
                        dlg.open();
                    }, { "user": usr });
                }
            });
    }
}
