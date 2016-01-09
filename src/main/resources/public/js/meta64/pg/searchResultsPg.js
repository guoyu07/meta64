console.log("running module: searchResultsPg.js");

var searchResultsPg = function() {

	var _ = {
		domId : "searchResultsPg",
		tabId : "searchTabName",
		visible : false,

		build : function() {
			var header = "<h2 id='searchPageTitle'></h2>";

			var mainContent = "<div id='searchResultsView'></div>";

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

		},

		init : function() {
			$("#searchPageTitle").html(srch.searchPageTitle);
			srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
		}
	};

	console.log("Module ready: searchResultsPg.js");
	return _;
}();

//# sourceURL=searchResultsPg.js
