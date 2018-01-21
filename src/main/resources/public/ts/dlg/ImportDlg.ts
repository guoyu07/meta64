console.log("ImportDlg.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { MessageDlg } from "./MessageDlg";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { UtilIntf as Util} from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class ImportDlg extends DialogBase {

  importFromFileNameTextField: TextField;

    constructor() {
        super("Import from XML", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            this.importFromFileNameTextField = new TextField("File Name to import"),
            new ButtonBar([
                new Button("Import", this.importNodes, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    // render = (): string => {
    //     var header = this.makeHeader("Import from XML");
    //
    //     var formControls = this.makeEditField("File name to import", "sourceFileName");
    //
    //     var importButton = this.makeButton("Import", "importNodesButton", this.importNodes);
    //     var backButton = this.makeCloseButton("Close", "cancelImportButton");
    //     var buttonBar = render.centeredButtonBar(importButton + backButton);
    //
    //     return header + formControls + buttonBar;
    // }

    importNodes = (): void => {
        var highlightNode = S.meta64.getHighlightedNode();
        var sourceFileName = this.importFromFileNameTextField.getValue();

        if (S.util.emptyString(sourceFileName)) {
            new MessageDlg({ "message": "Please enter a name for the import file." }).open();
            return;
        }

        if (highlightNode) {
            S.util.ajax<I.ImportRequest, I.ImportResponse>("import", {
                "nodeId": highlightNode.id,
                "sourceFileName": sourceFileName
            }, this.importResponse);
        }
    }

    importResponse = (res: I.ImportResponse): void => {
        if (S.util.checkSuccess("Import", res)) {
            new MessageDlg({ "message": "Import Successful" }).open();
            S.view.refreshTree(null, false);
            S.meta64.selectTab("mainTab");
            S.view.scrollToSelectedNode();
        }
    }
}
