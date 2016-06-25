
console.log("running module: ManageAccountDlg.js");

var ManageAccountDlg = function() {
	Dialog.call(this);
	this.domId = "ManageAccountDlg";
}

var ManageAccountDlg_ = util.inherit(Dialog, ManageAccountDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ManageAccountDlg_.build = function() {
	var header = this.makeHeader("Manage Account");

	var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
	var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");

	var buttonBar = render.centeredButtonBar(closeAccountButton);

	var bottomButtonBar = render.centeredButtonBar(backButton);
	var bottomButtonBarDiv = render.tag("div", {
		"class" : "close-account-bar"
	}, bottomButtonBar);

	return header + buttonBar + bottomButtonBarDiv;
}

//# sourceURL=ManageAccountDlg.js
