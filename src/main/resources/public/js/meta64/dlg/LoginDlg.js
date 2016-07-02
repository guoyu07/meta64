var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: LoginDlg.js");
var LoginDlg = (function (_super) {
    __extends(LoginDlg, _super);
    function LoginDlg() {
        _super.call(this, "LoginDlg");
    }
    LoginDlg.prototype.build = function () {
        var header = this.makeHeader("Login");
        var formControls = this.makeEditField("User", "userName") +
            this.makePasswordField("Password", "password");
        var loginButton = this.makeButton("Login", "loginButton", this.login, this);
        var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", this.resetPassword, this);
        var backButton = this.makeCloseButton("Close", "cancelLoginButton");
        var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
        var twitterButton = this.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
        var socialButtonBar = render.makeHorzControlGroup(twitterButton);
        var divider = "<div><h3>Or Login With...</h3></div>";
        var form = formControls + buttonBar;
        var mainContent = form;
        var content = header + mainContent;
        this.bindEnterKey("userName", user.login);
        this.bindEnterKey("password", user.login);
        return content;
    };
    LoginDlg.prototype.init = function () {
        this.populateFromCookies();
    };
    LoginDlg.prototype.populateFromCookies = function () {
        var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
        var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
        if (usr) {
            this.setInputVal("userName", usr);
        }
        if (pwd) {
            this.setInputVal("password", pwd);
        }
    };
    LoginDlg.prototype.login = function () {
        var usr = this.getInputVal("userName");
        var pwd = this.getInputVal("password");
        user.login(this, usr, pwd);
    };
    LoginDlg.prototype.resetPassword = function () {
        var thiz = this;
        var usr = this.getInputVal("userName");
        (new ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
            thiz.cancel();
            (new ResetPasswordDlg(usr)).open();
        })).open();
    };
    return LoginDlg;
}(DialogBase));
//# sourceMappingURL=LoginDlg.js.map