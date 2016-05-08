console.log("running module: MessageDlg.js");

var MessageDlg = function(message, title) {
	Dialog.call(this);

	this.domId = "MessageDlg";
	this.message = message;
	if (title == null) {
		title = "Message";
	}
	this.title = title;
}

var MessageDlg_ = util.inherit(Dialog, MessageDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
MessageDlg_.build = function() {
	var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";

	content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton"));

	return content;
}

//# sourceURL=MessageDlg.js
