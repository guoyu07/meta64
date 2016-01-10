console.log("running module: changePasswordPg.js");

var changePasswordPg = function() {

	var _ = {
		domId : "changePasswordPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {
			var header = render.makeDialogHeader("Change Password");

			var formControls = render.makePasswordField("Password", "changePassword1") + //
			render.makePasswordField("Repeat Password", "changePassword2");

			var changePasswordButton = render.makeButton("Change Password", "changePasswordActionButton",
					"user.changePassword();");
			var backButton = render.makeBackButton("Close", "cancelChangePasswordButton", _.domId);

			var buttonBar = render.makeHorzControlGroup(changePasswordButton + backButton);

			var content = header + formControls + buttonBar;
			util.setHtmlEnhanced(_.domId, content);
		},

		init : function() {
			util.delayedFocus("#changePassword1");
		}
	};

	console.log("Module ready: changePasswordPg.js");
	return _;
}();

// # sourceURL=changePasswordPg.js
