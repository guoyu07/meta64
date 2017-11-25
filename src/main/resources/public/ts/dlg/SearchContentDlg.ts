import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Constants as cnst} from "../Constants";
import { Util } from "../types/Util";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: any) => {
    debugger;
    util = ctx.util;
});

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, srch;  

export class SearchContentDlg extends DialogBase {

    searchTextField: TextField;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
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
        return this.searchProperty(cnst.CONTENT);
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
