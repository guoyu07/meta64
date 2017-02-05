import {DialogBaseImpl} from "./DialogBaseImpl";
import {SearchContentDlg} from "./SearchContentDlg";
import {render} from "./Render";
import {util} from "./Util";
import * as I from "./Interfaces";
import {srch} from "./Search";
import {jcrCnst} from "./Constants";
import {meta64} from "./Meta64";

export default class SearchContentDlgImpl  extends DialogBaseImpl implements SearchContentDlg {

    constructor() {
        super("SearchContentDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Search Content");

        var instructions = this.makeMessageArea("Enter some text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
        var formControls = this.makeEditField("Search", "searchText");

        var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes, this);
        var backButton = this.makeCloseButton("Close", "cancelSearchButton");
        var buttonBar = render.centeredButtonBar(searchButton + backButton);

        var content = header + instructions + formControls + buttonBar;
        this.bindEnterKey("searchText", srch.searchNodes)
        return content;
    }

    searchNodes = (): void => {
        return this.searchProperty(jcrCnst.CONTENT);
    }

    searchProperty = (searchProp: string) => {
        if (!util.ajaxReady("searchNodes")) {
            return;
        }

        // until i get better validation
        var node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to search under.");
            return;
        }

        // until better validation
        var searchText = this.getInputVal("searchText");
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
        //util.delayedFocus(this.id("searchText"));
        this.focus("searchText");
    }
}
