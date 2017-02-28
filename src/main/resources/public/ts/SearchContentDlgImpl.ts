import { DialogBaseImpl } from "./DialogBaseImpl";
import { SearchContentDlg } from "./SearchContentDlg";
import { render } from "./Render";
import { util } from "./Util";
import * as I from "./Interfaces";
import { srch } from "./Search";
import { jcrCnst } from "./Constants";
import { meta64 } from "./Meta64";

export default class SearchContentDlgImpl extends DialogBaseImpl implements SearchContentDlg {

    constructor() {
        super("SearchContentDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Search Content");

        let instructions = this.makeMessageArea("Enter text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
        let formControls = this.makeEditField("Search", "searchText");

        let searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes.bind(this));
        let backButton = this.makeCloseButton("Close", "cancelSearchButton");
        let buttonBar = render.centeredButtonBar(searchButton + backButton);

        let content = header + instructions + formControls + buttonBar;
        this.bindEnterKey("searchText", this.searchNodes);
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
        }, this.searchNodesResponse, this);
    }

    searchNodesResponse = (res: I.NodeSearchResponse) => {
        srch.searchNodesResponse(res);
        this.cancel();
    }

    init = (): void => {
        this.focus("searchText");
    }
}
