var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ResetPasswordDlg.js");
var ResetPasswordDlg = (function (_super) {
    __extends(ResetPasswordDlg, _super);
    function ResetPasswordDlg(user) {
        _super.call(this, "ResetPasswordDlg");
        this.user = user;
    }
    ResetPasswordDlg.prototype.build = function () {
        var header = this.makeHeader("Reset Password");
        var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");
        var formControls = this.makeEditField("User", "userName") +
            this.makeEditField("Email Address", "emailAddress");
        var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton", this.resetPassword, this);
        var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");
        var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);
        return header + message + formControls + buttonBar;
    };
    ResetPasswordDlg.prototype.resetPassword = function () {
        var userName = this.getInputVal("userName").trim();
        var emailAddress = this.getInputVal("emailAddress").trim();
        if (userName && emailAddress) {
            util.json("resetPassword", {
                "user": userName,
                "email": emailAddress
            }, this.resetPasswordResponse, this);
        }
        else {
            (new MessageDlg("Oops. Try that again.")).open();
        }
    };
    ResetPasswordDlg.prototype.resetPasswordResponse = function (res) {
        if (util.checkSuccess("Reset password", res)) {
            (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
        }
    };
    ResetPasswordDlg.prototype.init = function () {
        if (this.user) {
            this.setInputVal("userName", this.user);
        }
    };
    return ResetPasswordDlg;
}(DialogBase));
//# sourceMappingURL=ResetPasswordDlg.js.map