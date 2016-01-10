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
			 * cause problems by truncating all content after the donate-panel content, so leave this as separate
			 * open/close tags.
			 */
			var content = "<donate-panel></donate-panel>";

			content += render.centeredButtonBar(render.makePopupBackButton("Close", "donatePgCloseButton-" + data.guid, _.domId));
			
			console.log("fields="+content);
			
			util.setHtmlEnhanced(_.domId + "-" + data.guid, content);
		},

		init : function(data) {
		}
	};

	console.log("Module ready: donatePg.js");
	return _;
}();

// # sourceURL=donatePg.js
