console.log("ImportDlgImpl.ts");

import {DialogBaseImpl} from "./DialogBaseImpl";
import {ImportDlg} from "./ImportDlg";

export default class ImportDlgImpl extends DialogBaseImpl implements ImportDlg {
    // constructor() {
    //     super("ImportDlg");
    // }
    //
    // /*
    //  * Returns a string that is the HTML content of the dialog
    //  */
    // build = (): string => {
    //     var header = this.makeHeader("Import from XML");
    //
    //     var formControls = this.makeEditField("File name to import", "sourceFileName");
    //
    //     var importButton = this.makeButton("Import", "importNodesButton", this.importNodes, this);
    //     var backButton = this.makeCloseButton("Close", "cancelImportButton");
    //     var buttonBar = render.centeredButtonBar(importButton + backButton);
    //
    //     return header + formControls + buttonBar;
    // }
    //
    // importNodes = (): void => {
    //     var highlightNode = meta64.getHighlightedNode();
    //     var sourceFileName = this.getInputVal("sourceFileName");
    //
    //     if (util.emptyString(sourceFileName)) {
    //         (new MessageDlg("Please enter a name for the import file.")).open();
    //         return;
    //     }
    //
    //     if (highlightNode) {
    //         util.json<ImportRequest, ImportResponse>("import", {
    //             "nodeId": highlightNode.id,
    //             "sourceFileName": sourceFileName
    //         }, this.importResponse, this);
    //     }
    // }
    //
    // importResponse = (res: ImportResponse): void => {
    //     if (util.checkSuccess("Import", res)) {
    //         (new MessageDlg("Import Successful.")).open();
    //         view.refreshTree(null, false);
    //         meta64.selectTab("mainTabName");
    //         view.scrollToSelectedNode();
    //     }
    // }
}
