var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: MessageDlg.js");
var MessageDlg = (function (_super) {
    __extends(MessageDlg, _super);
    function MessageDlg(message, title, callback) {
        _super.call(this, "MessageDlg");
        this.message = message;
        this.title = title;
        this.callback = callback;
        if (this.title == null) {
            this.title = "Message";
        }
        this.title = title;
    }
    MessageDlg.prototype.build = function () {
        var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
        content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
        return content;
    };
    return MessageDlg;
}(DialogBase));
//# sourceMappingURL=MessageDlg.js.map