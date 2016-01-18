console.log("running module: ChangePasswordDlg.js");

/*
 * IMPORTANT! This is the new way all dialogs will be done. Most of the modules, in /meta64/pg/*.js are going 
 * to become dialog boxes using the same design pattern as used in this class. This class (ChangePasswordDlg
 * was the first prototype of this type of design, and works great using inheritance and a base class!)
 */

var ChangePasswordDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ChangePasswordDlg";
}

// more boilerplate for inheritance
ChangePasswordDlg.prototype.constructor = ChangePasswordDlg;
util.inherit(Dialog, ChangePasswordDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ChangePasswordDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Change Password");

	var formControls = this.makePasswordField("Password", "changePassword1") + //
	this.makePasswordField("Repeat Password", "changePassword2");

	var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton",
			"user.changePassword();");
	var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");

	var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);

	return header + formControls + buttonBar;
}

ChangePasswordDlg.prototype.init = function() {
	//util.delayedFocus("#changePassword1");
}

//# sourceURL=ChangePasswordDlg.js
