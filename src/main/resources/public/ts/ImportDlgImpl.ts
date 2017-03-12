console.log("ImportDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ImportDlg } from "./ImportDlg";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { view } from "./View";
import { Factory } from "./Factory";
import { MessageDlg } from "./MessageDlg";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { Help } from "./widget/Help";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";

export default class ImportDlgImpl extends DialogBaseImpl implements ImportDlg {

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
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Please enter a name for the import file." });

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
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Import Successful" });
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }
}
