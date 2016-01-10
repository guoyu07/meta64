console.log("running module: signupPg.js");

var signupPg = function() {

	var _ = {
		domId : "signupPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = render.makeDialogHeader(BRANDING_TITLE + " Signup");

			var formControls = //
			render.makeEditField("User", "signupUserName") + //
			render.makePasswordField("Password", "signupPassword") + //
			render.makeEditField("Email", "signupEmail") + //
			render.makeEditField("Captcha", "signupCaptcha");

			var captchaImage = render.tag("div", //
			{
				"class" : "captcha-image" //
			}, //
			render.tag("img", //
			{
				"id" : "captchaImage",
				"class" : "captcha",
				"src" : ""//
			}, //
			"", false));

			var signupButton = render.makeButton("Signup", "signupButton", "user.signup();");
			var newCaptchaButton = render.makeButton("Try Different Image", "tryAnotherCaptchaButton",
					"user.tryAnotherCaptcha();");
			var backButton = render.makeBackButton("Close", "cancelSignupButton", _.domId);

			var buttonBar = render.makeHorzControlGroup(signupButton + newCaptchaButton + backButton);

			var form = formControls + captchaImage + buttonBar;

			var mainContent = render.tag("div", //
			{
				"id" : _.domId + "-main"
			}, //
			form);

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

			/*
			 * $("#" + _.domId + "-main").css({ "backgroundImage" :
			 * "url(/ibm-702-bright.jpg);" "background-repeat" : "no-repeat;",
			 * "background-size" : "100% auto" });
			 */
		},

		init : function() {
			user.pageInitSignupPg();
			util.delayedFocus("#signupUserName");
		}
	};

	console.log("Module ready: signupPg.js");
	return _;
}();

//# sourceURL=signupPg.js
