import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Util } from "../types/Util";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: any) => {
    util = ctx.util;
});

export class ResetPasswordDlg extends DialogBase {

    userTextField: TextField;
    emailTextField: TextField;

    private user: string;

    constructor(args: Object) {
        super();
        this.user = (<any>args).user;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Reset Password"),
            new TextContent("Enter your user name and email address and a change-password link will be sent to you"),
            this.userTextField = new TextField("User"),
            this.emailTextField = new TextField("Email Address"),
            new ButtonBar([
                new Button("Reset my Password", this.resetPassword, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    resetPassword = (): void => {
        var userName = this.userTextField.getValue();
        var emailAddress = this.emailTextField.getValue();

        /* Note: Admin check is done also on server, so no browser hacking can get around this */
        if (userName && emailAddress && userName.toLowerCase()!="admin") {
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
