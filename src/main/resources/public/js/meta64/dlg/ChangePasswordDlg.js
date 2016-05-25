console.log("running module: ChangePasswordDlg.js");

var ChangePasswordDlg = function() {
	Dialog.call(this);

	this.domId = "ChangePasswordDlg";
}

var ChangePasswordDlg_ = util.inherit(Dialog, ChangePasswordDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ChangePasswordDlg_.build = function() {
	var header = this.makeHeader("Change Password");

	var formControls = this.makePasswordField("Password", "changePassword1") + //
	this.makePasswordField("Repeat Password", "changePassword2");

	var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton",
			ChangePasswordDlg_.changePassword, this);
	var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");

	var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);

	return header + formControls + buttonBar;
}

ChangePasswordDlg_.changePassword = function() {
	var pwd1 = this.getInputVal("changePassword1").trim();
	var pwd2 = this.getInputVal("changePassword2").trim();

	debugger;
	if (pwd1 && pwd1.length >= 4 && pwd1 === pwd2) {
		util.json("changePassword", {
			"newPassword" : pwd1
		}, ChangePasswordDlg_.changePasswordResponse, this);
	} else {
		(new MessageDlg("Invalid password(s).")).open();
	}
},

ChangePasswordDlg_.changePasswordResponse = function(res) {
	if (util.checkSuccess("Change password", res)) {
		(new MessageDlg("Password changed successfully.")).open();
	}
}

ChangePasswordDlg_.init = function() {
	this.focus("changePassword1");
}

//# sourceURL=ChangePasswordDlg.js
