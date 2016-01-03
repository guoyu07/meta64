console.log("running module: timelinePg.js");

var timelinePg = function() {

	var _ = {
		domId : "timelinePg",
		tabId : "timelineTabName",
		visible : false,

		build : function() {
			var header = render.makeButton("Back to Content", "cancelTimelineButton") + //
			"<h2 id='timelinePageTitle'></h2>";

			var mainContent = "<div id='timelineView'></div>";

			var content = header + mainContent;
			util.setHtmlEnhanced("timelinePg", content);

			$("#cancelTimelineButton").on("click", function() {
				meta64.jqueryChangePage("mainTabName");
				view.scrollToSelectedNode();
			});
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
