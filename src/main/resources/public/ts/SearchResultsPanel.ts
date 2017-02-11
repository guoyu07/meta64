import {srch} from "./Search";
import {util} from "./Util";

export class SearchResultsPanel {

    domId: string = "searchResultsPanel";
    tabId: string = "searchTabName";
    visible: boolean = false;

    constructor(args:Object) {
    }

    build = () => {
        var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
        var mainContent = "<div id='searchResultsView'></div>";
        return header + mainContent;
    };

    init = () => {
        util.setInnerHTMLById("searchPageTitle", srch.searchPageTitle);
        srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
    }
}
