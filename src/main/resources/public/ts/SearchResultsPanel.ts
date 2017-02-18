import { srch } from "./Search";
import { util } from "./Util";
import { tag } from "./Tag";

export class SearchResultsPanel {

    domId: string = "searchResultsPanel";
    tabId: string = "searchTabName";
    visible: boolean = false;

    constructor(args: Object) {
    }

    render = () => {
        var header = tag.h2({
            "id": "searchPageTitle",
            "class": "page-title"
        });
        var mainContent = tag.div({
            "id": "searchResultsView"
        });
        return header + mainContent;
    };

    init = () => {
        util.setInnerHTMLById("searchPageTitle", srch.searchPageTitle);
        srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
    }
}
