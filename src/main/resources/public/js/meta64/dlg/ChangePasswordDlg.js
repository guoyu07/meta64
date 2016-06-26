console.log("running module: ChangePasswordDlg.js");
var ChangePasswordDlg = function (passCode) {
    Dialog.call(this);
    this.passCode = passCode;
    this.domId = "ChangePasswordDlg";
};
var ChangePasswordDlg_ = util.inherit(Dialog, ChangePasswordDlg);
ChangePasswordDlg_.build = function () {
    var header = this.makeHeader(this.passCode ? "Password Reset" : "Change Password");
    var message = render.tag("p", {}, "Enter your new password below...");
    var formControls = this.makePasswordField("New Password", "changePassword1");
    var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton", ChangePasswordDlg_.changePassword, this);
    var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");
    var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);
    return header + message + formControls + buttonBar;
};
ChangePasswordDlg_.changePassword = function () {
    this.pwd = this.getInputVal("changePassword1").trim();
    if (this.pwd && this.pwd.length >= 4) {
        util.json("changePassword", {
            "newPassword": this.pwd,
            "passCode": this.passCode
        }, ChangePasswordDlg_.changePasswordResponse, this);
    }
    else {
        (new MessageDlg("Invalid password(s).")).open();
    }
},
    ChangePasswordDlg_.changePasswordResponse = function (res) {
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
ChangePasswordDlg_.init = function () {
    this.focus("changePassword1");
};
//# sourceMappingURL=ChangePasswordDlg.js.map