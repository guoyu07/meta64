console.log("running module: searchResultsPanel.js");
var searchResultsPanel = function () {
    var _ = {
        domId: "searchResultsPanel",
        tabId: "searchTabName",
        visible: false,
        build: function () {
            var header = "<h2 id='searchPageTitle'></h2>";
            var mainContent = "<div id='searchResultsView'></div>";
            return header + mainContent;
        },
        init: function () {
            $("#searchPageTitle").html(srch.searchPageTitle);
            srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
        }
    };
    console.log("Module ready: searchResultsPanel.js");
    return _;
}();
//# sourceMappingURL=searchResultsPanel.js.map