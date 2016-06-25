console.log("running module: timelineResultsPanel.js");
var timelineResultsPanel = function () {
    var _ = {
        domId: "timelineResultsPanel",
        tabId: "timelineTabName",
        visible: false,
        build: function () {
            var header = "<h2 id='timelinePageTitle'></h2>";
            var mainContent = "<div id='timelineView'></div>";
            return header + mainContent;
        },
        init: function () {
            $("#timelinePageTitle").html(srch.timelinePageTitle);
            srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
        }
    };
    console.log("Module ready: timelineResultsPanel.js");
    return _;
}();
//# sourceMappingURL=timelineResultsPanel.js.map