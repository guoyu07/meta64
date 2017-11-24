console.log("LoginDlg.ts");

import { DialogBase } from "./DialogBase";
import { ConfirmDlg } from "./ConfirmDlg";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { Header } from "./widget/Header";
import { HeaderRe } from "./widget/HeaderRe";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBarRe } from "./widget/ButtonBarRe";
import { ButtonRe } from "./widget/ButtonRe";
import { TextField } from "./widget/TextField";
import { Constants as cnst} from "./Constants";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var user, util;

export class LoginDlg extends DialogBase {

    userTextField: TextField;
    passwordTextField: PasswordTextField;

    constructor(paramsTest: Object) {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new HeaderRe("Login"),
            this.userTextField = new TextField("User"),
            this.passwordTextField = new PasswordTextField("Password"),
            new ButtonBarRe([
                new ButtonRe("Login", this.login, null, true, this),
                new ButtonRe("Forgot Password", this.resetPassword, null, true, this),
                new ButtonRe("Close", null, null, true, this)
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

        new ConfirmDlg({
                "title": "Confirm Reset Password",
                "message": "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
                "buttonText": "Yes, reset.", "yesCallback":
                () => {
                    this.cancel();
                    new ResetPasswordDlg( { "user": usr }).open();
                }
            }).open();
    }
}
