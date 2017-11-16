console.log("TimelineResultsPanel.ts");

import { srch } from "./Search";
import { util } from "./Util";
import { tag } from "./Tag";

export class TimelineResultsPanel {

    domId: string = "timelineResultsPanel";
    tabId: string = "timelineTabName";
    visible: boolean = false;

    constructor(args: Object) {
    }

    renderHtml = () => {
        let header = tag.h2({
            "id": "timelinePageTitle",
            "class": "page-title"
        });
        let mainContent = tag.div({
            "id": "timelineView"
        });
        return header + mainContent;
    }

    init = () => {
        util.setInnerHTMLById("timelinePageTitle", srch.timelinePageTitle);
        srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
    }
}
