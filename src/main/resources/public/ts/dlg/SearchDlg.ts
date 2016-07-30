console.log("running module: SearchDlg.js");

namespace m64 {
    export class SearchDlg extends DialogBase {

        constructor() {
            super("SearchDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Search");

            var instructions = this.makeMessageArea("Enter some text to find. All sub-nodes under the selected node are included in the search.");
            var formControls = this.makeEditField("Search", "searchText");

            var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes, this);
            var searchTagsButton = this.makeCloseButton("Search Tags", "searchTagsButton", this.searchTags, this);
            var backButton = this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + searchTagsButton + backButton);

            var content = header + instructions + formControls + buttonBar;
            this.bindEnterKey("searchText", srch.searchNodes)
            return content;
        }

        searchNodes = (): void => {
            return this.searchProperty("jcr:content");
        }

        searchTags = (): void => {
            return this.searchProperty(jcrCnst.TAGS);
        }

        searchProperty = (searchProp: any) => {
            if (!util.ajaxReady("searchNodes")) {
                return;
            }

            // until i get better validation
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }

            // until better validation
            var searchText = this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": searchText,
                "modSortDesc": false,
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        }

        init = (): void => {
            util.delayedFocus(this.id("searchText"));
        }
    }
}
