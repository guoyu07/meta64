import { DialogBaseImpl } from "./DialogBaseImpl";
import { SignupDlg } from "./SignupDlg";
import { render } from "./Render";
import { util } from "./Util";
import * as I from "./Interfaces";
import { tag } from "./Tag";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";
import { PasswordTextField } from "./widget/PasswordTextField";
import { Div } from "./widget/Div";
import { Checkbox } from "./widget/Checkbox";
import { Comp } from "./widget/base/Comp";
import { Captcha } from "./widget/Captcha";

declare var postTargetUrl;

export default class SignupDlgImpl extends DialogBaseImpl implements SignupDlg {

    userTextField: TextField;
    passwordTextField: PasswordTextField;
    emailTextField: TextField;
    captchaTextField: TextField;
    captchaImage: Captcha;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Node Sharing"),
            this.userTextField = new TextField("User"),
            this.passwordTextField = new PasswordTextField("Password"),
            this.emailTextField = new TextField("Email"),
            this.captchaTextField = new TextField("Captcha"),
            this.captchaImage = new Captcha(),
            new ButtonBar([
                new Button("Signup", this.signup),
                new Button("Try Different Image", this.tryAnotherCaptcha),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    signup = (): void => {
        let userName = this.userTextField.getValue();
        let password = this.passwordTextField.getValue();
        let email = this.emailTextField.getValue();
        let captcha = this.captchaTextField.getValue();

        /* no real validation yet, other than non-empty */
        if (!userName || userName.length == 0 || //
            !password || password.length == 0 || //
            !email || email.length == 0 || //
            !captcha || captcha.length == 0) {
            util.showMessage("You cannot leave any fields blank.");
            return;
        }

        util.ajax<I.SignupRequest, I.SignupResponse>("signup", {
            "userName": userName,
            "password": password,
            "email": email,
            "captcha": captcha
        }, this.signupResponse);
    }

    signupResponse = (res: I.SignupResponse): void => {
        if (util.checkSuccess("Signup new user", res)) {

            /* close the signup dialog */
            this.cancel();

            util.showMessage(
                "User Information Accepted.<p/>Check your email for signup confirmation."
            );
        }
    }

    tryAnotherCaptcha = (): void => {
        let cacheBuster = util.currentTimeMillis();
        let src = postTargetUrl + "captcha?t=" + cacheBuster;
        this.captchaImage.setSrc(src);
    }

    pageInitSignupPg = (): void => {
        this.tryAnotherCaptcha();
    }

    init = (): void => {
        this.pageInitSignupPg();
        this.userTextField.focus();
    }
}
