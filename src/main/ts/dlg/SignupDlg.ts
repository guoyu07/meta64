
console.log("running module: SignupDlg.js");

declare var BRANDING_TITLE;

var SignupDlg = function() {
    Dialog.call(this);
    this.domId = "SignupDlg";
}

var SignupDlg_ = util.inherit(Dialog, SignupDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
SignupDlg_.build = function() {
    var header = this.makeHeader(BRANDING_TITLE + " Signup");

    var formControls = //
        this.makeEditField("User", "signupUserName") + //
        this.makePasswordField("Password", "signupPassword") + //
        this.makeEditField("Email", "signupEmail") + //
        this.makeEditField("Captcha", "signupCaptcha");

    var captchaImage = render.tag("div", //
        {
            "class": "captcha-image" //
        }, //
        render.tag("img", //
            {
                "id": this.id("captchaImage"),
                "class": "captcha",
                "src": ""//
            }, //
            "", false));

    var signupButton = this.makeButton("Signup", "signupButton", SignupDlg_.signup, this);
    var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton",
        SignupDlg_.tryAnotherCaptcha, this);
    var backButton = this.makeCloseButton("Close", "cancelSignupButton");

    var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);

    return header + formControls + captchaImage + buttonBar;

	/*
	 * $("#" + _.domId + "-main").css({ "backgroundImage" : "url(/ibm-702-bright.jpg);" "background-repeat" :
	 * "no-repeat;", "background-size" : "100% auto" });
	 */
}

SignupDlg_.signup = function() {
    var userName = this.getInputVal("signupUserName");
    var password = this.getInputVal("signupPassword");
    var email = this.getInputVal("signupEmail");
    var captcha = this.getInputVal("signupCaptcha");

    /* no real validation yet, other than non-empty */
    if (util.anyEmpty(userName, password, email, captcha)) {
        (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
        return;
    }

    util.json("signup", {
        "useName": userName,
        "pasword": password,
        "mail": email,
        "catcha": captcha
    }, SignupDlg_.signupResponse, this);
}

SignupDlg_.signupResponse = function(res) {
    if (util.checkSuccess("Signup new user", res)) {

        /* close the signup dialog */
        this.cancel();

        (new MessageDlg(
            "User Information Accepted.<p/>Check your email for signup confirmation.",
            "Signup"
        )).open();
    }
}

SignupDlg_.tryAnotherCaptcha = function() {

    var n = util.currentTimeMillis();

	/*
	 * embed a time parameter just to thwart browser caching, and ensure server and browser will never return the same
	 * image twice.
	 */
    var src = postTargetUrl + "captcha?t=" + n;
    $("#" + this.id("captchaImage")).attr("src", src);
}

SignupDlg_.pageInitSignupPg = function() {
    this.tryAnotherCaptcha();
}

SignupDlg_.init = function() {
    this.pageInitSignupPg();
    util.delayedFocus("#" + this.id("signupUserName"));
}

//# sourceURL=SignupDlg.js
