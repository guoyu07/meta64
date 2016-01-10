console.log("running module: confirmPg.js");

/*
 * Runs as Popup. With individal instances created in 'areYouSure'
 */

var confirmPg = function() {

	var _ = {
		/*
		 * Note: this domId always has an suffix like domId-1, domId-2, etc
		 * driven by guids
		 */
		domId : "confirmPg",
		tabId : "popup",

		areYouSure : function(title, message, buttonText, callback) {

			/* BEGIN MAKE DATA - create data object with a guid */
			var data = {};
			data.title = title;
			data.message = message;
			data.buttonText = buttonText;
			data.callback = callback;
			meta64.registerDataObject(data);
			/* END MAKE DATA */

			meta64.changePage(confirmPg, data);
		},

		build : function(data) {

			var content = "<h2 id='confirmPgTitle-" + data.guid + "'></h2>" + //
			"<p id='confirmPgMessage-" + data.guid + "'></p>";

			var buttons = render.makePopupBackButton("Yes", "confirmPgYesButton-" + data.guid, _.domId,
					"meta64.runCallback(" + data.guid + ");")
					+ render.makePopupBackButton("No", "confirmPgNoButton-" + data.guid, _.domId);
			content += render.centeredButtonBar(buttons);

			util.setHtmlEnhanced(_.domId + "-" + data.guid, content);
		},

		init : function(data) {
			$("#confirmPgTitle-" + data.guid).text(data.title);
			$("#confirmPgMessage-" + data.guid).text(data.message);
			$("#confirmPgYesButton-" + data.guid).text(data.buttonText);
		}
	};

	console.log("Module ready: confirmPg.js");
	return _;
}();

//# sourceURL=confirmPg.js
