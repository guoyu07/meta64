console.log("running module: MessageDlg.js");

/*
 * Callback can be null if you don't need to run any function when the dialog is closed
 */
var MessageDlg = function(message?: any, title?: any, callback?: any) {
    Dialog.call(this);

    this.domId = "MessageDlg";
    this.message = message;
    this.callback = callback;

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

    content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));

    return content;
}
