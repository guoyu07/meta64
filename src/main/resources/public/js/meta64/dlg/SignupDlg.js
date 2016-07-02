var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: SignupDlg.js");
var SignupDlg = (function (_super) {
    __extends(SignupDlg, _super);
    function SignupDlg() {
        _super.call(this, "SignupDlg");
    }
    SignupDlg.prototype.build = function () {
        var header = this.makeHeader(BRANDING_TITLE + " Signup");
        var formControls = this.makeEditField("User", "signupUserName") +
            this.makePasswordField("Password", "signupPassword") +
            this.makeEditField("Email", "signupEmail") +
            this.makeEditField("Captcha", "signupCaptcha");
        var captchaImage = render.tag("div", {
            "class": "captcha-image"
        }, render.tag("img", {
            "id": this.id("captchaImage"),
            "class": "captcha",
            "src": ""
        }, "", false));
        var signupButton = this.makeButton("Signup", "signupButton", this.signup, this);
        var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton", this.tryAnotherCaptcha, this);
        var backButton = this.makeCloseButton("Close", "cancelSignupButton");
        var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);
        return header + formControls + captchaImage + buttonBar;
    };
    SignupDlg.prototype.signup = function () {
        var userName = this.getInputVal("signupUserName");
        var password = this.getInputVal("signupPassword");
        var email = this.getInputVal("signupEmail");
        var captcha = this.getInputVal("signupCaptcha");
        if (util.anyEmpty(userName, password, email, captcha)) {
            (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
            return;
        }
        util.json("signup", {
            "useName": userName,
            "pasword": password,
            "mail": email,
            "catcha": captcha
        }, this.signupResponse, this);
    };
    SignupDlg.prototype.signupResponse = function (res) {
        if (util.checkSuccess("Signup new user", res)) {
            this.cancel();
            (new MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
        }
    };
    SignupDlg.prototype.tryAnotherCaptcha = function () {
        var n = util.currentTimeMillis();
        var src = postTargetUrl + "captcha?t=" + n;
        $("#" + this.id("captchaImage")).attr("src", src);
    };
    SignupDlg.prototype.pageInitSignupPg = function () {
        this.tryAnotherCaptcha();
    };
    SignupDlg.prototype.init = function () {
        this.pageInitSignupPg();
        util.delayedFocus("#" + this.id("signupUserName"));
    };
    return SignupDlg;
}(DialogBase));
//# sourceMappingURL=SignupDlg.js.map