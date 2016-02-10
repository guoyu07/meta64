console.log("running module: ConfirmDlg.js");

/*
 * Class constructor
 */
var ConfirmDlg = function(title, message, buttonText, callback) {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ConfirmDlg";
	this.title = title;
	this.message = message;
	this.buttonText = buttonText;
	this.callback = callback;
}

// more boilerplate for inheritance
ConfirmDlg.prototype.constructor = ConfirmDlg;
util.inherit(Dialog, ConfirmDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ConfirmDlg.prototype.build = function() {
	var content = "<h2 id='" + this.id("ConfirmDlgTitle") + "'></h2>" + //
	"<p id='" + this.id("ConfirmDlgMessage") + "'></p>";

	var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.callback)
			+ this.makeCloseButton("No", "ConfirmDlgNoButton");
	content += render.centeredButtonBar(buttons);

	return content;
}

ConfirmDlg.prototype.init = function() {
	this.setHtml(this.title, "ConfirmDlgTitle");
	this.setHtml(this.message, "ConfirmDlgMessage");
	this.setHtml(this.buttonText, "ConfirmDlgYesButton");
}

//# sourceURL=ConfirmDlg.js
