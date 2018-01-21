import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
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

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class SearchContentDlg extends DialogBase {

    searchTextField: TextField;

    constructor() {
        super("Search Content", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new TextContent("Enter text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search."),
                this.searchTextField = new TextField("Search"),
                new ButtonBar([
                    new Button("Search", this.searchNodes, null, true, this),
                    new Button("Close", null, null, true, this)
                ])
            ])
        ]);

        this.searchTextField.bindEnterKey(this.searchNodes);
    }

    searchNodes = (): void => {
        return this.searchProperty(cnst.CONTENT);
    }

    searchProperty = (searchProp: string) => {
        if (!S.util.ajaxReady("searchNodes")) {
            return;
        }

        // until we have better validation
        let node = S.meta64.getHighlightedNode();
        if (!node) {
            S.util.showMessage("No node is selected to search under.");
            return;
        }

        // until better validation
        let searchText = this.searchTextField.getValue();
        if (S.util.emptyString(searchText)) {
            S.util.showMessage("Enter search text.");
            return;
        }

        S.util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": searchText,
            "sortDir": "",
            "sortField": "",
            "searchProp": searchProp
        }, this.searchNodesResponse);
    }

    searchNodesResponse = (res: I.NodeSearchResponse) => {
        S.srch.searchNodesResponse(res);
        this.cancel();
    }

    init = (): void => {
        this.searchTextField.focus();
    }
}
