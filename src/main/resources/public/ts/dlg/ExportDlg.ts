console.log("running module: ExportDlg.js");

namespace m64 {
    class ExportDlg extends DialogBase {
        constructor() {
            super("ExportDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Export to XML");

            var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");

            var exportButton = this.makeButton("Export", "exportNodesButton", this.exportNodes, this);
            var backButton = this.makeCloseButton("Close", "cancelExportButton");
            var buttonBar = render.centeredButtonBar(exportButton + backButton);

            return header + formControls + buttonBar;
        }

        exportNodes = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            var targetFileName = this.getInputVal("exportTargetNodeName");

            if (util.emptyString(targetFileName)) {
                (new MessageDlg("Please enter a name for the export file.")).open();
                return;
            }

            if (highlightNode) {
                util.json("exportToXml", {
                    "nodeId": highlightNode.id,
                    "targetFileName": targetFileName
                }, this.exportResponse, this);
            }
        }

        exportResponse = (res: any): void => {
            if (util.checkSuccess("Export", res)) {
                (new MessageDlg("Export Successful.")).open();
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }
    }
}
