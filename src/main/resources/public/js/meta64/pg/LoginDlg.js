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
LoginDlg.prototype.constructor = LoginDlg;
util.inherit(Dialog, LoginDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
LoginDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Login");

	var formControls = this.makeEditField("User", "userName") + //
	this.makePasswordField("Password", "password");

	var loginButton = this.makeButton("Login", "loginButton", LoginDlg.prototype.login, this);
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

LoginDlg.prototype.init = function() {
	this.populateFromCookies();
}

LoginDlg.prototype.populateFromCookies = function() {
	var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
	var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

	if (usr) {
		this.setInputVal("userName", usr);
	}
	if (pwd) {
		this.setInputVal("password", pwd);
	}
}

LoginDlg.prototype.login = function() {

	this.cancel();
	
	var usr = this.getInputVal("userName");
	var pwd = this.getInputVal("password");

	var ironRes = util.json("login", {
		"userName" : usr,
		"password" : pwd,
		"tzOffset" : new Date().getTimezoneOffset(),
		"dst" : util.daylightSavingsTime
	});

	var This = this;
	ironRes.completes.then(function() {
		console.log("this: "+util.printObject(this));
		console.log("This: "+util.printObject(This));
		
		user.loginResponse(ironRes.response, usr, pwd, null, This);
	});
}

//# sourceURL=LoginDlg.js
