console.log("running module: ImportDlg.js");

namespace m64 {
    export class ImportDlg extends DialogBase {
        constructor() {
            super("ImportDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Import from XML");

            var formControls = this.makeEditField("Import Target Node Name", "importTargetNodeName");

            var importButton = this.makeButton("Import", "importNodesButton", this.importNodes, this);
            var backButton = this.makeCloseButton("Close", "cancelImportButton");
            var buttonBar = render.centeredButtonBar(importButton + backButton);

            return header + formControls + buttonBar;
        }

        importNodes = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            var sourceFileName = this.getInputVal("importTargetNodeName");

            if (util.emptyString(sourceFileName)) {
                (new MessageDlg("Please enter a name for the import file.")).open();
                return;
            }

            if (highlightNode) {
                util.json<json.ImportRequest,json.ImportResponse>("import", {
                    "nodeId": highlightNode.id,
                    "sourceFileName": sourceFileName
                }, this.importResponse, this);
            }
        }

        importResponse = (res: json.ImportResponse): void => {
            if (util.checkSuccess("Import", res)) {
                (new MessageDlg("Import Successful.")).open();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }
    }
}
