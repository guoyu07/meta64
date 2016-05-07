console.log("running module: LoginDlg.js");

/*
 * Class constructor
 */
var LoginDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "LoginDlg";
}

// more boilerplate for inheritance
var LoginDlg_ = util.inherit(Dialog, LoginDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
LoginDlg_.build = function() {
	var header = this.makeHeader("Login");

	var formControls = this.makeEditField("User", "userName") + //
	this.makePasswordField("Password", "password");

	var loginButton = this.makeButton("Login", "loginButton", LoginDlg_.login, this);
	var backButton = this.makeCloseButton("Close", "cancelLoginButton");
	var buttonBar = render.centeredButtonBar(loginButton + backButton);

	/*
	 * Social Login Buttons
	 * 
	 * See server controller. Implementation is about 95% complete, but
	 * not yet fully complete!
	 */
	var twitterButton = this.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
	var socialButtonBar = render.makeHorzControlGroup(twitterButton);

	var divider = "<div><h3>Or Login With...</h3></div>";

	var form = formControls + buttonBar;

	var mainContent = form;
	/*
	 * commenting twitter login during polymer conversion + divider +
	 * socialButtonBar
	 */

	var content = header + mainContent;

	this.bindEnterKey("userName", user.login);
	this.bindEnterKey("password", user.login);
	return content;
}

LoginDlg_.init = function() {
	this.populateFromCookies();
}

LoginDlg_.populateFromCookies = function() {
	var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
	var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

	if (usr) {
		this.setInputVal("userName", usr);
	}
	if (pwd) {
		this.setInputVal("password", pwd);
	}
}

LoginDlg_.login = function() {

	this.cancel();
	
	var usr = this.getInputVal("userName");
	var pwd = this.getInputVal("password");

	var ironRes = util.json("login", {
		"userName" : usr,
		"password" : pwd,
		"tzOffset" : new Date().getTimezoneOffset(),
		"dst" : util.daylightSavingsTime
	});

	var thiz = this;
	ironRes.completes.then(function() {
		user.loginResponse(ironRes.response, usr, pwd, null, thiz);
	});
}

//# sourceURL=LoginDlg.js
