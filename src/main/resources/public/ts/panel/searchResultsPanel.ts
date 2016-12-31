console.log("running module: searchResultsPanel.js");

namespace m64 {
    export class SearchResultsPanel {

        domId: string = "searchResultsPanel";
        tabId: string = "searchTabName";
        visible: boolean = false;

        build = () => {
            var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
            var mainContent = "<div id='searchResultsView'></div>";
            return header + mainContent;
        };

        init = () => {
            $("#searchPageTitle").html(srch.searchPageTitle);
            srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
        }
    }
}
