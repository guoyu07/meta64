console.log("running module: messagePg.js");

/* this is a popup dialog */
var messagePg = function() {

	var _ = {
		domId : "messagePg",
		tabId : "popup",

		alert : function(message) {
			_.showMessage(null, message, null);
		},

		showMessage : function(title, message, callback) {

			/* BEGIN MAKE DATA - create data object with a guid */
			var data = {};
			data.title = title;
			data.message = message;
			data.callback = callback;
			meta64.registerDataObject(data);
			/* END MAKE DATA */

			meta64.changePage(messagePg, data);
		},

		build : function(data) {

			var fields = "<h2 id='messagePgTitle-" + data.guid + "'></h2>" + //
			"<p id='messagePgMessage-" + data.guid + "'></p>";
			fields += render.makePopupBackButton("Ok", "messagePgOkButton-" + data.guid, _.domId,
					"messagePg.runCallback(" + data.guid + ");");

			util.setHtmlEnhanced("messagePg-" + data.guid, fields);
		},

		/* todo move to meta64 mod */
		runCallback : function(guid) {
			var dataObj = meta64.getObjectByGuid(guid);
			if (dataObj.callback) {
				dataObj.callback();
			}
		},

		init : function(data) {
			if (data.title) {
				$("#messagePgTitle-" + data.guid).text(data.title);
			}
			$("#messagePgMessage-" + data.guid).html(data.message);
		}
	};

	console.log("Module ready: messagePg.js");
	return _;
}();

// # sourceURL=messagePg.js
