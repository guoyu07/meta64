import { Constants } from "./Constants";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class SearchResultsPanel {

    domId: string = "searchResultsPanel";
    tabId: string = "searchTabName";
    visible: boolean = false;

    constructor(args: Object) {
    }

    renderHtml = () => {
        var header = S.tag.h2({
            "id": "searchPageTitle",
            "class": "page-title"
        });
        var mainContent = S.tag.div({
            "id": "searchResultsView"
        });
        return header + mainContent;
    };

    init = () => {
        S.util.setInnerHTMLById("searchPageTitle", S.srch.searchPageTitle);
        S.srch.populateSearchResultsPage(S.srch.searchResults, "searchResultsView");
    }
}
