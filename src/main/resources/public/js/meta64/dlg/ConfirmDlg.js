var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ConfirmDlg.js");
var ConfirmDlg = (function (_super) {
    __extends(ConfirmDlg, _super);
    function ConfirmDlg(title, message, buttonText, callback) {
        _super.call(this, "ConfirmDlg");
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.callback = callback;
    }
    ConfirmDlg.prototype.build = function () {
        var content = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");
        var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.callback)
            + this.makeCloseButton("No", "ConfirmDlgNoButton");
        content += render.centeredButtonBar(buttons);
        return content;
    };
    ConfirmDlg.prototype.init = function () {
        this.setHtml(this.title, "ConfirmDlgTitle");
        this.setHtml(this.message, "ConfirmDlgMessage");
        this.setHtml(this.buttonText, "ConfirmDlgYesButton");
    };
    return ConfirmDlg;
}(DialogBase));
//# sourceMappingURL=ConfirmDlg.js.map