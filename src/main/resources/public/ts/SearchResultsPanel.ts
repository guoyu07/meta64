//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var srch, util, tag;

export class SearchResultsPanel {

    domId: string = "searchResultsPanel";
    tabId: string = "searchTabName";
    visible: boolean = false;

    constructor(args: Object) {
    }

    renderHtml = () => {
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
