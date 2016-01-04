console.log("running module: timelinePg.js");

var timelinePg = function() {

	var _ = {
		domId : "timelinePg",
		tabId : "timelineTabName",
		visible : false,

		build : function() {
			var header = "<h2 id='timelinePageTitle'></h2>";
			var mainContent = "<div id='timelineView'></div>";

			var content = header + mainContent;
			util.setHtmlEnhanced("timelinePg", content);
		},

		init : function() {
			$("#timelinePageTitle").html(srch.timelinePageTitle);
			srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
		}
	};

	console.log("Module ready: timelinePg.js");
	return _;
}();

//# sourceURL=timelinePg.js
