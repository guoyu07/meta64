import {DialogBaseImpl} from "./DialogBaseImpl";
import {SignupDlg} from "./SignupDlg";
import {render} from "./Render";
import {util} from "./Util";
import * as I from "./Interfaces";

declare var BRANDING_TITLE;
declare var postTargetUrl;

export default class SignupDlgImpl  extends DialogBaseImpl implements SignupDlg {

    constructor() {
        super("SignupDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader(BRANDING_TITLE + " Signup");

        var formControls = //
            this.makeEditField("User", "signupUserName") + //
            this.makePasswordField("Password", "signupPassword") + //
            this.makeEditField("Email", "signupEmail") + //
            this.makeEditField("Captcha", "signupCaptcha");

        var captchaImage = render.tag("div", //
            {
                "class": "captcha-image" //
            }, //
            render.tag("img", //
                {
                    "id": this.id("captchaImage"),
                    "class": "captcha",
                    "src": ""//
                }, //
                "", false));

        var signupButton = this.makeButton("Signup", "signupButton", this.signup);
        var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton",
            this.tryAnotherCaptcha);
        var backButton = this.makeCloseButton("Close", "cancelSignupButton");

        var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);

        return header + formControls + captchaImage + buttonBar;

        /*
         * $("#" + _.domId + "-main").css({ "backgroundImage" : "url(/ibm-702-bright.jpg);" "background-repeat" :
         * "no-repeat;", "background-size" : "100% auto" });
         */
    }

    signup = (): void => {
        var userName = this.getInputVal("signupUserName");
        var password = this.getInputVal("signupPassword");
        var email = this.getInputVal("signupEmail");
        var captcha = this.getInputVal("signupCaptcha");

        /* no real validation yet, other than non-empty */
        if (!userName || userName.length == 0 || //
            !password || password.length == 0 || //
            !email || email.length == 0 || //
            !captcha || captcha.length == 0) {
            util.showMessage("You cannot leave any fields blank.");
            return;
        }

        util.json<I.SignupRequest, I.SignupResponse>("signup", {
            "userName": userName,
            "password": password,
            "email": email,
            "captcha": captcha
        }, this.signupResponse, this);
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
        var n = util.currentTimeMillis();

        /*
         * embed a time parameter just to thwart browser caching, and ensure server and browser will never return the same
         * image twice.
         */
        var src = postTargetUrl + "captcha?t=" + n;
        $("#" + this.id("captchaImage")).attr("src", src);
    }

    pageInitSignupPg = (): void => {
        this.tryAnotherCaptcha();
    }

    init = (): void => {
        this.pageInitSignupPg();
        util.delayedFocus("#" + this.id("signupUserName"));
    }
}
