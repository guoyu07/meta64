console.log("running module: MessageDlg.js");
var MessageDlg = function (message, title, callback) {
    Dialog.call(this);
    this.domId = "MessageDlg";
    this.message = message;
    this.callback = callback;
    if (title == null) {
        title = "Message";
    }
    this.title = title;
};
var MessageDlg_ = util.inherit(Dialog, MessageDlg);
MessageDlg_.build = function () {
    var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
    content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
    return content;
};
//# sourceMappingURL=MessageDlg.js.map