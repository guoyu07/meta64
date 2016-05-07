console.log("running module: ChangePasswordDlg.js");

var ChangePasswordDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ChangePasswordDlg";
}

// more boilerplate for inheritance
var ChangePasswordDlg_ = util.inherit(Dialog, ChangePasswordDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ChangePasswordDlg_.build = function() {
	var header = render.makeDialogHeader("Change Password");

	var formControls = this.makePasswordField("Password", "changePassword1") + //
	this.makePasswordField("Repeat Password", "changePassword2");

	var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton",
			"user.changePassword();");
	var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");

	var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);

	return header + formControls + buttonBar;
}

ChangePasswordDlg_.init = function() {
	this.focus("changePassword1");
}

//# sourceURL=ChangePasswordDlg.js
