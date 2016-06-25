
console.log("running module: prefs.js");

var prefs = function() {

	var _ = {
		closeAccountResponse : function() {
			/* Remove warning dialog to ask user about leaving the page */
			$(window).off("beforeunload");

			/* reloads browser with the query parameters stripped off the path */
			window.location.href = window.location.origin;
		},

		closeAccount : function() {
			(new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function() {
				(new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function() {
					user.deleteAllUserCookies();
					util.json("closeAccount", {}, _.closeAccountResponse);
				})).open();
			})).open();
		}
	};

	console.log("Module ready: prefs.js");
	return _;
}();

//# sourceURL=prefs.js
