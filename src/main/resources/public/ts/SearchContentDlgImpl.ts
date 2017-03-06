import { DialogBaseImpl } from "./DialogBaseImpl";
import { SearchContentDlg } from "./SearchContentDlg";
import { render } from "./Render";
import { util } from "./Util";
import * as I from "./Interfaces";
import { srch } from "./Search";
import { jcrCnst } from "./Constants";
import { meta64 } from "./Meta64";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";

export default class SearchContentDlgImpl extends DialogBaseImpl implements SearchContentDlg {

    searchTextField: TextField;

    constructor() {
        super("SearchContentDlg");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header("Search Content"),
            new TextContent("Enter text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search."),
            this.searchTextField = new TextField("Search"),
            new ButtonBar([
                new Button("Search", this.searchNodes, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);

        this.searchTextField.bindEnterKey(this.searchNodes);
    }

    searchNodes = (): void => {
        return this.searchProperty(jcrCnst.CONTENT);
    }

    searchProperty = (searchProp: string) => {
        if (!util.ajaxReady("searchNodes")) {
            return;
        }

        // until we have better validation
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to search under.");
            return;
        }

        // until better validation
        let searchText = this.searchTextField.getValue();
        if (util.emptyString(searchText)) {
            util.showMessage("Enter search text.");
            return;
        }

        util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": searchText,
            "sortDir": "",
            "sortField": "",
            "searchProp": searchProp
        }, this.searchNodesResponse);
    }

    searchNodesResponse = (res: I.NodeSearchResponse) => {
        srch.searchNodesResponse(res);
        this.cancel();
    }

    init = (): void => {
        this.searchTextField.focus();
    }
}
