console.log("ChangePasswordDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ChangePasswordDlg } from "./ChangePasswordDlg";
import { Factory } from "./Factory";
import { MessageDlg } from "./MessageDlg";
import { util } from "./Util";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { Help } from "./widget/Help";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";

export default class ChangePasswordDlgImpl extends DialogBaseImpl implements ChangePasswordDlg {

    passwordField: PasswordTextField;
    pwd: string;
    private passCode: string;

    constructor(args: Object) {
        super("ChangePasswordDlg");
        this.passCode = (<any>args).passCode;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header(this.passCode ? "Password Reset" : "Change Password"),
            new Help("Enter your new password below..."),
            this.passwordField = new PasswordTextField("New Password"),
            new ButtonBar([
                new Button("Change Password", this.changePassword, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    /*
     * If the user is doing a "Reset Password" we will have a non-null passCode here, and we simply send this to the server
     * where it will validate the passCode, and if it's valid use it to perform the correct password change on the correct
     * user.
     */
    changePassword = (): void => {
        this.pwd = this.passwordField.getValue();

        if (this.pwd && this.pwd.length >= 4) {
            util.ajax<I.ChangePasswordRequest, I.ChangePasswordResponse>("changePassword", {
                "newPassword": this.pwd,
                "passCode": this.passCode
            }, this.changePasswordResponse);
        } else {
            util.showMessage("Invalid password(s).");
        }
    }

    changePasswordResponse = (res: I.ChangePasswordResponse) => {
        if (util.checkSuccess("Change password", res)) {
            let msg = "Password changed successfully.";

            if (this.passCode) {
                msg += `<p>You may now login as <b>${res.user}</b> with your new password.`;
            }

            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }
                , {
                    "message" : msg,
                    "title": "Password Change", callback: () => {
                        if (this.passCode) {
                            window.location.href = window.location.origin;
                        }
                    }
                });
        }
    }

    init = (): void => {
        this.passwordField.focus();
    }
}
