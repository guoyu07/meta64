console.log("running module: timelineResultsPanel.js");

namespace m64 {
    export class TimelineResultsPanel {

        domId: string = "timelineResultsPanel";
        tabId: string = "timelineTabName";
        visible: boolean = false;

        build = () => {
            var header = "<h2 id='timelinePageTitle'></h2>";
            var mainContent = "<div id='timelineView'></div>";
            return header + mainContent;
        }

        init = () => {
            $("#timelinePageTitle").html(srch.timelinePageTitle);
            srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
        }
    }
}
