import { DialogBaseImpl } from "./DialogBaseImpl";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { render } from "./Render";
import { util } from "./Util";
import * as I from "./Interfaces";

export default class ResetPasswordDlgImpl extends DialogBaseImpl implements ResetPasswordDlg {

    private user: string;

    constructor(args: Object) {
        super("ResetPasswordDlg");
        this.user = (<any>args).user;
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        var header = this.makeHeader("Reset Password");

        var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");

        var formControls = this.makeEditField("User", "userName") + //
            this.makeEditField("Email Address", "emailAddress");

        var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton",
            this.resetPassword.bind(this));
        var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");

        var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);

        return header + message + formControls + buttonBar;
    }

    resetPassword = (): void => {

        var userName = this.getInputVal("userName").trim();
        var emailAddress = this.getInputVal("emailAddress").trim();

        if (userName && emailAddress) {
            util.ajax<I.ResetPasswordRequest, I.ResetPasswordResponse>("resetPassword", {
                "user": userName,
                "email": emailAddress
            }, this.resetPasswordResponse);
        } else {
            util.showMessage("Oops. Try that again.");
        }
    }

    resetPasswordResponse = (res: I.ResetPasswordResponse): void => {
        if (util.checkSuccess("Reset password", res)) {
            util.showMessage("Password reset email was sent. Check your inbox.");
        }
    }

    init = (): void => {
        if (this.user) {
            this.setInputVal("userName", this.user);
        }
    }
}
