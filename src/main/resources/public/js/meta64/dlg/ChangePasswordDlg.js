var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ChangePasswordDlg.js");
var ChangePasswordDlg = (function (_super) {
    __extends(ChangePasswordDlg, _super);
    function ChangePasswordDlg(passCode) {
        _super.call(this, "ChangePasswordDlg");
        this.passCode = passCode;
    }
    ChangePasswordDlg.prototype.build = function () {
        var header = this.makeHeader(this.passCode ? "Password Reset" : "Change Password");
        var message = render.tag("p", {}, "Enter your new password below...");
        var formControls = this.makePasswordField("New Password", "changePassword1");
        var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton", this.changePassword, this);
        var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");
        var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);
        return header + message + formControls + buttonBar;
    };
    ChangePasswordDlg.prototype.changePassword = function () {
        this.pwd = this.getInputVal("changePassword1").trim();
        if (this.pwd && this.pwd.length >= 4) {
            util.json("changePassword", {
                "newPassword": this.pwd,
                "passCode": this.passCode
            }, this.changePasswordResponse, this);
        }
        else {
            (new MessageDlg("Invalid password(s).")).open();
        }
    };
    ChangePasswordDlg.prototype.changePasswordResponse = function (res) {
        if (util.checkSuccess("Change password", res)) {
            var msg = "Password changed successfully.";
            if (this.passCode) {
                msg += "<p>You may now login as <b>" + res.user
                    + "</b> with your new password.";
            }
            var thiz = this;
            (new MessageDlg(msg, "Password Change", function () {
                if (thiz.passCode) {
                    window.location.href = window.location.origin;
                }
            })).open();
        }
    };
    ChangePasswordDlg.prototype.init = function () {
        this.focus("changePassword1");
    };
    return ChangePasswordDlg;
}(DialogBase));
//# sourceMappingURL=ChangePasswordDlg.js.map