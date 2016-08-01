console.log("running module: SearchTagsDlg.js");

namespace m64 {
    export class SearchTagsDlg extends DialogBase {

        constructor() {
            super("SearchTagsDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Search Tags");

            var instructions = this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
            var formControls = this.makeEditField("Search", "searchText");

            var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchTags, this);
            var backButton = this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);

            var content = header + instructions + formControls + buttonBar;
            this.bindEnterKey("searchText", srch.searchNodes)
            return content;
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
                "sortDir": "",
                "sortField": "",
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        }

        init = (): void => {
            util.delayedFocus(this.id("searchText"));
        }
    }
}
