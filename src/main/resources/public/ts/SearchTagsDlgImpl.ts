import { DialogBaseImpl } from "./DialogBaseImpl";
import { SearchTagsDlg } from "./SearchTagsDlg";
import { srch } from "./Search";
import { jcrCnst } from "./Constants";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";

export default class SearchTagsDlgImpl extends DialogBaseImpl implements SearchTagsDlg {
    searchTextField: TextField;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Search Tags"),
            new TextContent("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search."),
            this.searchTextField = new TextField("Search"),
            new ButtonBar([
                new Button("Search", this.searchTags, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);

        this.searchTextField.bindEnterKey(this.searchTags);
    }

    searchTags = (): void => {
        return this.searchProperty(jcrCnst.TAGS);
    }

    searchProperty = (searchProp: any) => {
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
        }, srch.searchNodesResponse);
    }

    init = (): void => {
        this.searchTextField.focus();
    }
}
