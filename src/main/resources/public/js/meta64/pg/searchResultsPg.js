console.log("running module: searchResultsPg.js");

var searchResultsPg = function() {

	var _ = {
		domId : "searchResultsPg",
		build : function() {

			var header = render.tag("div", //
			{
				"data-role" : "header"// ,
			// "data-position" : "fixed",
			// "data-tap-toggle" : "false"
			}, //
			render.makeButton("Back to Content", "cancelSearchResultsButton", "b") + //
			"<h2 id='searchPageTitle'></h2>");

			var internalMainContent = "<div id='searchResultsView'></div>";
			var mainContent = render.tag("div", //
			{
				"role" : "main", //
				"class" : "ui-content"
			}, //
			internalMainContent);

			var content = header + mainContent;
			util.setHtmlEnhanced($("#searchResultsPg"), content);

			$("#cancelSearchResultsButton").on("click", function() {
				meta64.jqueryChangePage("#mainPage");
				view.scrollToSelectedNode();
			});
		},

		init : function() {
			$("#searchPageTitle").html(BRANDING_TITLE+" - "+srch.searchPageTitle);
			srch.populateSearchResultsPage();
		}
	};

	console.log("Module ready: searchResultsPg.js");
	return _;
}();

//# sourceURL=searchResultsPg.js
