console.log("ExportDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ExportDlg } from "./ExportDlg";
import { render } from "./Render";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { view } from "./View";
import { Factory } from "./Factory";
import { MessageDlg } from "./MessageDlg";


export default class ExportDlgImpl extends DialogBaseImpl implements ExportDlg {
    constructor() {
        super("ExportDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        var header = this.makeHeader("Export to XML");

        var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");

        var exportButton = this.makeButton("Export", "exportNodesButton", this.exportNodes);
        var backButton = this.makeCloseButton("Close", "cancelExportButton");
        var buttonBar = render.centeredButtonBar(exportButton + backButton);

        return header + formControls + buttonBar;
    }

    exportNodes = (): void => {
        var highlightNode = meta64.getHighlightedNode();
        var targetFileName = this.getInputVal("exportTargetNodeName");

        if (util.emptyString(targetFileName)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Please enter a name for the export file." });
            return;
        }

        if (highlightNode) {
            util.json<I.ExportRequest, I.ExportResponse>("exportToXml", {
                "nodeId": highlightNode.id,
                "targetFileName": targetFileName
            }, this.exportResponse, this);
        }
    }

    exportResponse = (res: I.ExportResponse): void => {
        if (util.checkSuccess("Export", res)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Export successful." });
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }
}
