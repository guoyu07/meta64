console.log("running module: ResetPasswordDlg.js");

namespace m64 {
    export class ResetPasswordDlg extends DialogBase {

        constructor(private user: string) {
            super("ResetPasswordDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Reset Password");

            var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");

            var formControls = this.makeEditField("User", "userName") + //
                this.makeEditField("Email Address", "emailAddress");

            var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton",
                this.resetPassword, this);
            var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");

            var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);

            return header + message + formControls + buttonBar;
        }

        resetPassword = (): void => {

            var userName = this.getInputVal("userName").trim();
            var emailAddress = this.getInputVal("emailAddress").trim();

            if (userName && emailAddress) {
                util.json("resetPassword", {
                    "user": userName,
                    "email": emailAddress
                }, this.resetPasswordResponse, this);
            } else {
                (new MessageDlg("Oops. Try that again.")).open();
            }
        }

        resetPasswordResponse = (res: any): void => {
            if (util.checkSuccess("Reset password", res)) {
                (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
            }
        }

        init = (): void => {
            if (this.user) {
                this.setInputVal("userName", this.user);
            }
        }
    }
}
