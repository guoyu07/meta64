import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";

console.log("TimelineResultsPanel.ts");

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class TimelineResultsPanel {

    domId: string = "timelineResultsPanel";
    tabId: string = "timelineTabName";
    visible: boolean = false;

    constructor(args: Object) {
    }

    renderHtml = () => {
        let header = S.tag.h2({
            "id": "timelinePageTitle",
            "class": "page-title"
        });
        let mainContent = S.tag.div({
            "id": "timelineView"
        });
        return header + mainContent;
    }

    init = () => {
        S.util.setInnerHTMLById("timelinePageTitle", S.srch.timelinePageTitle);
        S.srch.populateSearchResultsPage(S.srch.timelineResults, "timelineView");
    }
}
