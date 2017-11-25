import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { TextField } from "../widget/TextField";
import { PasswordTextField } from "../widget/PasswordTextField";
import { Captcha } from "../widget/Captcha";
export declare class SignupDlg extends DialogBase {
    userTextField: TextField;
    passwordTextField: PasswordTextField;
    emailTextField: TextField;
    captchaTextField: TextField;
    captchaImage: Captcha;
    constructor();
    buildGUI: () => void;
    signup: () => void;
    signupResponse: (res: I.SignupResponse) => void;
    tryAnotherCaptcha: () => void;
    pageInitSignupPg: () => void;
    init: () => void;
}
