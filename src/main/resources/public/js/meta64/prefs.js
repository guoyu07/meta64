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
				util.json("closeAccount", {}, _.closeAccountResponse);
			})).open();
		}
	};

	console.log("Module ready: prefs.js");
	return _;
}();

//# sourceURL=prefs.js
