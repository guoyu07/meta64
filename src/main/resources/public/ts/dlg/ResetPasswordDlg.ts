
console.log("running module: ResetPasswordDlg.js");

var ResetPasswordDlg = function(user) {
    Dialog.call(this);

    this.user = user;
    this.domId = "ResetPasswordDlg";
}

var ResetPasswordDlg_ = util.inherit(Dialog, ResetPasswordDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ResetPasswordDlg_.build = function() {
    var header = this.makeHeader("Reset Password");

    var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");

    var formControls = this.makeEditField("User", "userName") + //
        this.makeEditField("Email Address", "emailAddress");

    var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton",
        ResetPasswordDlg_.resetPassword, this);
    var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");

    var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);

    return header + message + formControls + buttonBar;
}

ResetPasswordDlg_.resetPassword = function() {

    var userName = this.getInputVal("userName").trim();
    var emailAddress = this.getInputVal("emailAddress").trim();

    if (userName && emailAddress) {
        util.json("resetPassword", {
            "user": userName,
            "email": emailAddress
        }, ResetPasswordDlg_.resetPasswordResponse, this);
    } else {
        (new MessageDlg("Oops. Try that again.")).open();
    }
},

    ResetPasswordDlg_.resetPasswordResponse = function(res) {
        if (util.checkSuccess("Reset password", res)) {
            (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
        }
    }

ResetPasswordDlg_.init = function() {
    if (this.user) {
        this.setInputVal("userName", this.user);
    }
}
