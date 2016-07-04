
console.log("running module: SignupDlg.js");

declare var BRANDING_TITLE;

class SignupDlg extends DialogBase {

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

        var signupButton = this.makeButton("Signup", "signupButton", this.signup, this);
        var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton",
            this.tryAnotherCaptcha, this);
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
            (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
            return;
        }

        util.json("signup", {
            "useName": userName,
            "pasword": password,
            "mail": email,
            "catcha": captcha
        }, this.signupResponse, this);
    }

    signupResponse = (res: any): void => {
        if (util.checkSuccess("Signup new user", res)) {

            /* close the signup dialog */
            this.cancel();

            (new MessageDlg(
                "User Information Accepted.<p/>Check your email for signup confirmation.",
                "Signup"
            )).open();
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
