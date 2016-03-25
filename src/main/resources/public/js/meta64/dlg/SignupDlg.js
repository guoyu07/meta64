console.log("running module: SignupDlg.js");

/*
 * Class constructor
 */
var SignupDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);

	this.domId = "SignupDlg";
}

// more boilerplate for inheritance
SignupDlg.prototype.constructor = SignupDlg;
util.inherit(Dialog, SignupDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
SignupDlg.prototype.build = function() {
	var header = render.makeDialogHeader(BRANDING_TITLE + " Signup");

	var formControls = //
	this.makeEditField("User", "signupUserName") + //
	this.makePasswordField("Password", "signupPassword") + //
	this.makeEditField("Email", "signupEmail") + //
	this.makeEditField("Captcha", "signupCaptcha");

	var captchaImage = render.tag("div", //
	{
		"class" : "captcha-image" //
	}, //
	render.tag("img", //
	{
		"id" : this.id("captchaImage"),
		"class" : "captcha",
		"src" : ""//
	}, //
	"", false));

	var signupButton = this.makeButton("Signup", "signupButton", SignupDlg.prototype.signup, this);
	var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton",
			SignupDlg.prototype.tryAnotherCaptcha, this);
	var backButton = this.makeCloseButton("Close", "cancelSignupButton");

	var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);

	return header + formControls + captchaImage + buttonBar;

	/*
	 * $("#" + _.domId + "-main").css({ "backgroundImage" :
	 * "url(/ibm-702-bright.jpg);" "background-repeat" : "no-repeat;",
	 * "background-size" : "100% auto" });
	 */
}

SignupDlg.prototype.signup = function() {
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
		"userName" : userName,
		"password" : password,
		"email" : email,
		"captcha" : captcha
	}, SignupDlg.prototype.signupResponse, this);
}

SignupDlg.prototype.signupResponse = function(res) {
	if (util.checkSuccess("Signup new user", res)) {
		var loginDlg = new LoginDlg();
		loginDlg.populateFromCookies();
		loginDlg.open();

		(new MessageDlg(
				"User Information Accepted. \n\nCheck your email for signup confirmation. (Can take up to 1 minute)"))
				.open();
	}
}

SignupDlg.prototype.tryAnotherCaptcha = function() {

	var n = util.currentTimeMillis();

	/*
	 * embed a time parameter just to thwart browser caching, and ensure server
	 * and browser will never return the same image twice.
	 */
	var src = postTargetUrl + "captcha?t=" + n;
	$("#" + this.id("captchaImage")).attr("src", src);
}

SignupDlg.prototype.pageInitSignupPg = function() {
	this.tryAnotherCaptcha();
}

SignupDlg.prototype.init = function() {
	this.pageInitSignupPg();
	util.delayedFocus("#" + this.id("signupUserName"));
}

//# sourceURL=SignupDlg.js
