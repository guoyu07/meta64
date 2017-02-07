console.log("LoginDlg.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { LoginDlg } from "./LoginDlg";
import { ConfirmDlg } from "./ConfirmDlg";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { render } from "./Render";
import { user } from "./User";
import { cnst } from "./Constants";
import { Factory } from "./Factory";

declare var $;

export default class LoginDlgImpl extends DialogBaseImpl implements LoginDlg {
    constructor(paramsTest: Object) {
        super("LoginDlgImpl");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Login");

        var formControls = this.makeEditField("User", "userName") + //
            this.makePasswordField("Password", "password");

        var loginButton = this.makeButton("Login", "loginButton", this.login);
        var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", this.resetPassword);
        var backButton = this.makeCloseButton("Close", "cancelLoginButton");
        var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
        var divider = "<div><h3>Or Login With...</h3></div>";

        var form = formControls + buttonBar;

        var mainContent = form;
        var content = header + mainContent;

        this.bindEnterKey("userName", user.login);
        this.bindEnterKey("password", user.login);
        return content;
    }

    init = (): void => {
        this.populateFromCookies();
    }

    populateFromCookies = (): void => {
        var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
        var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

        if (usr) {
            this.setInputVal("userName", usr);
        }
        if (pwd) {
            this.setInputVal("password", pwd);
        }
    }

    login = (): void => {

        var usr = this.getInputVal("userName");
        var pwd = this.getInputVal("password");

        user.login(this, usr, pwd);
    }

    resetPassword = (): any => {
        var thiz = this;
        var usr = this.getInputVal("userName");

        Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
            dlg.open();
        }, {
                "title": "Confirm Reset Password",
                "message": "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
                "buttonText": "Yes, reset.", "yesCallback":
                function() {
                    thiz.cancel();
                    Factory.createDefault("ResetPasswordDlgImpl", (dlg: ResetPasswordDlg) => {
                        dlg.open();
                    }, { "user": usr });
                }
            });
    }
}
