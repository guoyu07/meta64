console.log("TimelineResultsPanel.ts");

import {srch} from "./Search";



export class TimelineResultsPanel {

    domId: string = "timelineResultsPanel";
    tabId: string = "timelineTabName";
    visible: boolean = false;

    constructor(args:Object) {
    }

    build = () => {
        var header = "<h2 id='timelinePageTitle' class='page-title'></h2>";
        var mainContent = "<div id='timelineView'></div>";
        return header + mainContent;
    }

    init = () => {
        $("#timelinePageTitle").html(srch.timelinePageTitle);
        srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
    }
}
