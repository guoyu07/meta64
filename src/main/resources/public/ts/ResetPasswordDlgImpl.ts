import { DialogBaseImpl } from "./DialogBaseImpl";
import { ResetPasswordDlg } from "./ResetPasswordDlg";
import { render } from "./Render";
import { util } from "./Util";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";

export default class ResetPasswordDlgImpl extends DialogBaseImpl implements ResetPasswordDlg {

    userTextField: TextField;
    emailTextField: TextField;

    private user: string;

    constructor(args: Object) {
        super("ResetPasswordDlg");
        this.user = (<any>args).user;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header("Reset Password"),
            new TextContent("Enter your user name and email address and a change-password link will be sent to you"),
            new TextField("User"),
            new TextField("Email Address"),
            new ButtonBar([
                new Button("Reset my Password", this.resetPassword, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    resetPassword = (): void => {
        var userName = this.userTextField.getValue();
        var emailAddress = this.emailTextField.getValue();

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
            this.userTextField.setValue(this.user);
        }
    }
}
