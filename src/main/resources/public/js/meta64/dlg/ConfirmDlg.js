console.log("running module: ConfirmDlg.js");

var ConfirmDlg = function(title, message, buttonText, callback) {
	Dialog.call(this);

	this.domId = "ConfirmDlg";
	this.title = title;
	this.message = message;
	this.buttonText = buttonText;
	this.callback = callback;
}

var ConfirmDlg_ = util.inherit(Dialog, ConfirmDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ConfirmDlg_.build = function() {
	var content = this.makeHeader("", "ConfirmDlgTitle") + //
	render.tag("p", {
		id : this.id("ConfirmDlgMessage")
	});

	var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton",
			this.callback)
			+ this.makeCloseButton("No", "ConfirmDlgNoButton");
	content += render.centeredButtonBar(buttons);

	return content;
}

ConfirmDlg_.init = function() {
	this.setHtml(this.title, "ConfirmDlgTitle");
	this.setHtml(this.message, "ConfirmDlgMessage");
	this.setHtml(this.buttonText, "ConfirmDlgYesButton");
}

// # sourceURL=ConfirmDlg.js
