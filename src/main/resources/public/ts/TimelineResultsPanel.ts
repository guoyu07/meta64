console.log("TimelineResultsPanel.ts");

import {srch} from "./Search";
import {util} from "./Util";

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
        util.setInnerHTMLById("timelinePageTitle", srch.timelinePageTitle);
        srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
    }
}
