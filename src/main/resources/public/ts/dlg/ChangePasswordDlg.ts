console.log("running module: ChangePasswordDlg.js");

class ChangePasswordDlg extends DialogBase {

    pwd: string;

    constructor(private passCode: string) {
        super("ChangePasswordDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog.
     *
     * If the user is doing a "Reset Password" we will have a non-null passCode here, and we simply send this to the server
     * where it will validate the passCode, and if it's valid use it to perform the correct password change on the correct
     * user.
     */
    build(): string {

        var header = this.makeHeader(this.passCode ? "Password Reset" : "Change Password");

        var message = render.tag("p", {

        }, "Enter your new password below...");

        var formControls = this.makePasswordField("New Password", "changePassword1");

        var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton",
            this.changePassword, this);
        var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");

        var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);

        return header + message + formControls + buttonBar;
    }

    changePassword(): void {
        this.pwd = this.getInputVal("changePassword1").trim();

        if (this.pwd && this.pwd.length >= 4) {
            util.json("changePassword", {
                "newPassword": this.pwd,
                "passCode": this.passCode
            }, this.changePasswordResponse, this);
        } else {
            (new MessageDlg("Invalid password(s).")).open();
        }
    }

    changePasswordResponse(res: any) {
        if (util.checkSuccess("Change password", res)) {

            var msg = "Password changed successfully.";

            if (this.passCode) {
                msg += "<p>You may now login as <b>" + res.user
                    + "</b> with your new password.";
            }

            var thiz = this;
            (new MessageDlg(msg, "Password Change", function() {
                if (thiz.passCode) {
                    //this login call DOES work, but the reason we don't do this is because the URL still has the passCode on it and we
                    //want to direct the user to a url without that.
                    //user.login(null, res.user, thiz.pwd);

                    window.location.href = window.location.origin;
                }
            })).open();
        }
    }

    init() {
        this.focus("changePassword1");
    }
}
