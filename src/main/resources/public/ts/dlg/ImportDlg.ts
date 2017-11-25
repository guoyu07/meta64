console.log("ImportDlg.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { MessageDlg } from "./MessageDlg";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { Help } from "../widget/Help";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { Util } from "../types/Util";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: any) => {
    util = ctx.util;
});

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, view;  

export class ImportDlg extends DialogBase {

  importFromFileNameTextField: TextField;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Import From XML"),
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
        var highlightNode = meta64.getHighlightedNode();
        var sourceFileName = this.importFromFileNameTextField.getValue();

        if (util.emptyString(sourceFileName)) {
            new MessageDlg({ "message": "Please enter a name for the import file." }).open();
            return;
        }

        if (highlightNode) {
            util.ajax<I.ImportRequest, I.ImportResponse>("import", {
                "nodeId": highlightNode.id,
                "sourceFileName": sourceFileName
            }, this.importResponse);
        }
    }

    importResponse = (res: I.ImportResponse): void => {
        if (util.checkSuccess("Import", res)) {
            new MessageDlg({ "message": "Import Successful" }).open();
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }
}
