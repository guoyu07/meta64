console.log("running module: loginPg.js");

var loginPg = function() {

	var _ = {
		domId : "loginPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = render.makeDialogHeader("Login");

			// todo: trying this binding now.
			var formControls = render.makeEditField("User", "userName") + //
			render.makePasswordField("Password", "password");

			var loginButton = render.makeButton("Login", "loginButton", "user.login();");
			var backButton = render.makeBackButton("Close", "cancelLoginButton", _.domId);
			var buttonBar = render.centeredButtonBar(loginButton + backButton);

			/*
			 * Social Login Buttons
			 * 
			 * See server controller. Implementation is about 95% complete, but
			 * not yet fully complete!
			 */
			var twitterButton = render.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
			var socialButtonBar = render.makeHorzControlGroup(twitterButton);

			var divider = "<div><h3>Or Login With...</h3></div>";

			var form = formControls + buttonBar;

			var mainContent = form;
			/*
			 * commenting twitter login during polymer conversion + divider +
			 * socialButtonBar
			 */

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

			util.bindEnterKey("#userName", user.login);
			util.bindEnterKey("#password", user.login);
		},

		init : function() {
			_.populateFromCookies();

			// polymer experiment removing
			// util.delayedFocus("#userName");
		},

		populateFromCookies : function() {
			var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
			var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

			if (usr) {
				util.setInputVal("userName", usr);
			}
			if (pwd) {
				util.setInputVal("password", pwd);
			}
		}
	};

	console.log("Module ready: loginPg.js");
	return _;
}();

//# sourceURL=loginPg.js
