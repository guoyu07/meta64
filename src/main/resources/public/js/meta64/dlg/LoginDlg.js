console.log("running module: LoginDlg.js");
var LoginDlg = function () {
    Dialog.call(this);
    this.domId = "LoginDlg";
};
var LoginDlg_ = util.inherit(Dialog, LoginDlg);
LoginDlg_.build = function () {
    var header = this.makeHeader("Login");
    var formControls = this.makeEditField("User", "userName") +
        this.makePasswordField("Password", "password");
    var loginButton = this.makeButton("Login", "loginButton", LoginDlg_.login, this);
    var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", LoginDlg_.resetPassword, this);
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
LoginDlg_.init = function () {
    this.populateFromCookies();
};
LoginDlg_.populateFromCookies = function () {
    var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
    var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
    if (usr) {
        this.setInputVal("userName", usr);
    }
    if (pwd) {
        this.setInputVal("password", pwd);
    }
};
LoginDlg_.login = function () {
    var usr = this.getInputVal("userName");
    var pwd = this.getInputVal("password");
    user.login(this, usr, pwd);
};
LoginDlg_.resetPassword = function () {
    var thiz = this;
    var usr = this.getInputVal("userName");
    (new ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
        thiz.cancel();
        (new ResetPasswordDlg(usr)).open();
    })).open();
};
//# sourceMappingURL=LoginDlg.js.map