console.log("ImportDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ImportDlg } from "./ImportDlg";
import { render } from "./Render";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { view } from "./View";
import { Factory } from "./Factory";
import { MessageDlg } from "./MessageDlg";

export default class ImportDlgImpl extends DialogBaseImpl implements ImportDlg {
    constructor() {
        super("ImportDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Import from XML");

        var formControls = this.makeEditField("File name to import", "sourceFileName");

        var importButton = this.makeButton("Import", "importNodesButton", this.importNodes);
        var backButton = this.makeCloseButton("Close", "cancelImportButton");
        var buttonBar = render.centeredButtonBar(importButton + backButton);

        return header + formControls + buttonBar;
    }

    importNodes = (): void => {
        var highlightNode = meta64.getHighlightedNode();
        var sourceFileName = this.getInputVal("sourceFileName");

        if (util.emptyString(sourceFileName)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Please enter a name for the import file." });

            return;
        }

        if (highlightNode) {
            util.json<I.ImportRequest, I.ImportResponse>("import", {
                "nodeId": highlightNode.id,
                "sourceFileName": sourceFileName
            }, this.importResponse, this);
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
