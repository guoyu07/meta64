console.log("running module: donatePg.js");

/*
 * Runs as Popup. With individal instances created in 'open'
 */

var donatePg = function() {

	var _ = {
		/*
		 * Note: this domId always has an suffix like domId-1, domId-2, etc
		 * driven by guids
		 */
		domId : "donatePg",
		tabId : "popup",

		open : function() {

			/* BEGIN MAKE DATA - create data object with a guid */
			var data = {};
			meta64.registerDataObject(data);
			/* END MAKE DATA */

			meta64.changePage(donatePg, data);
		},

		build : function(data) {
			/*
			 * Warning: Due to apparent bug in polymer the single open/close tag style like </donate-panel> will
			 * cause problems by truncating all content after the donate-panel content.
			 */
			var content = "<donate-panel></donate-panel>";

			content += "<div>";
			content += render.makePopupBackButton("Close", "donatePgCloseButton-" + data.guid, _.domId);
			content += "</div>";
			
			console.log("fields="+content);
			
			util.setHtmlEnhanced(_.domId + "-" + data.guid, content);
		},

		/* todo move to meta64 mod */
		runCallback : function(guid) {
			var dataObj = meta64.getObjectByGuid(guid);
			if (dataObj.callback) {
				dataObj.callback();
			}
		},

		init : function(data) {
			//$("#confirmPgTitle-" + data.guid).text(data.title);
			//$("#confirmPgMessage-" + data.guid).text(data.message);
			//$("#confirmPgYesButton-" + data.guid).text(data.buttonText);
		}
	};

	console.log("Module ready: donatePg.js");
	return _;
}();

// # sourceURL=donatePg.js
