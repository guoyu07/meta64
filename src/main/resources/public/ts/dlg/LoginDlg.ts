console.log("running module: LoginDlg.js");

/// <reference path="./tyepdefs/jquery/jquery.d.ts" />

//import { cnst2 } from "../cnst";


/*
Note: The jquery cookie looks for jquery d.ts in the relative location ""../jquery" so beware if your
try to reorganize the folder structure I have in typedefs, things will certainly break
*/
/// <reference path="./tyepdefs/jquery.cookie/jquery.cookie.d.ts" />

class LoginDlg extends DialogBase {
    constructor() {
        super("LoginDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build(): string {
        var header = this.makeHeader("Login");

        var formControls = this.makeEditField("User", "userName") + //
            this.makePasswordField("Password", "password");

        var loginButton = this.makeButton("Login", "loginButton", this.login, this);
        var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", this.resetPassword, this);
        var backButton = this.makeCloseButton("Close", "cancelLoginButton");
        var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);

        /*
         * Social Login Buttons
         *
         * See server controller. Implementation is about 95% complete, but not yet fully complete!
         */
        var twitterButton = this.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
        var socialButtonBar = render.makeHorzControlGroup(twitterButton);

        var divider = "<div><h3>Or Login With...</h3></div>";

        var form = formControls + buttonBar;

        var mainContent = form;
        /*
         * commenting twitter login during polymer conversion + divider + socialButtonBar
         */

        var content = header + mainContent;

        this.bindEnterKey("userName", user.login);
        this.bindEnterKey("password", user.login);
        return content;
    }

    init(): void {
        this.populateFromCookies();
    }

    populateFromCookies(): void {
        var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
        var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

        if (usr) {
            this.setInputVal("userName", usr);
        }
        if (pwd) {
            this.setInputVal("password", pwd);
        }
    }

    login(): void {

        var usr = this.getInputVal("userName");
        var pwd = this.getInputVal("password");

        user.login(this, usr, pwd);
    }

    resetPassword(): any {
        var thiz = this;
        var usr = this.getInputVal("userName");

        (new ConfirmDlg("Confirm Reset Password",
            "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
            "Yes, reset.", function() {
                thiz.cancel();
                (new ResetPasswordDlg(usr)).open();
            })).open();
    }
}
