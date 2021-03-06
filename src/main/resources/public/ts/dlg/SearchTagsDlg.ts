import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Constants as cnst } from "../Constants";
import { UtilIntf as Util } from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { Form } from "../widget/Form";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    util = ctx.util;
});

declare var meta64, srch;

export class SearchTagsDlg extends DialogBase {
    searchTextField: TextField;

    constructor() {
        super("Search Tags", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new TextContent("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search."),
                this.searchTextField = new TextField("Search"),
                new ButtonBar([
                    new Button("Search", this.searchTags, null, true, this),
                    new Button("Close", null, null, true, this)
                ])
            ])
        ]);

        this.searchTextField.bindEnterKey(this.searchTags);
    }

    searchTags = (): void => {
        return this.searchProperty(cnst.TAGS);
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
