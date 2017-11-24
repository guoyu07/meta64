console.log("TimelineResultsPanel.ts");

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var srch, util, tag;

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
