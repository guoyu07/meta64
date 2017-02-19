import { DialogBaseImpl } from "./DialogBaseImpl";
import { SearchTagsDlg } from "./SearchTagsDlg";
import { srch } from "./Search";
import { render } from "./Render";
import { jcrCnst } from "./Constants";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";

export default class SearchTagsDlgImpl extends DialogBaseImpl implements SearchTagsDlg {

    constructor() {
        super("SearchTagsDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Search Tags");

        let instructions = this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
        let formControls = this.makeEditField("Search", "searchText");

        let searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchTags, this);
        let backButton = this.makeCloseButton("Close", "cancelSearchButton");
        let buttonBar = render.centeredButtonBar(searchButton + backButton);

        let content = header + instructions + formControls + buttonBar;
        this.bindEnterKey("searchText", this.searchTags)
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
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to search under.");
            return;
        }

        // until better validation
        let searchText = this.getInputVal("searchText");
        if (util.emptyString(searchText)) {
            util.showMessage("Enter search text.");
            return;
        }

        util.json<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
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
