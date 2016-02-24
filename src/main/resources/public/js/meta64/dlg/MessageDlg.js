console.log("running module: MessageDlg.js");

/*
 * Class constructor
 */
var MessageDlg = function(message, title) {
	// boiler plate for inheritance
	Dialog.call(this);

	this.domId = "MessageDlg";
	this.message = message;
	if (title == null) {
		title = "Message";
	}
	this.title = title;
}

// more boilerplate for inheritance
MessageDlg.prototype.constructor = MessageDlg;
util.inherit(Dialog, MessageDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
MessageDlg.prototype.build = function() {
	var content = "<h2>" + this.title + "</h2>" + //
	"<p>" + this.message + "</p>";

	content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton"));

	return content;
}

//# sourceURL=MessageDlg.js
