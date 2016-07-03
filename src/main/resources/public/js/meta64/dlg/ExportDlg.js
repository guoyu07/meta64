var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ExportDlg.js");
var ExportDlg = (function (_super) {
    __extends(ExportDlg, _super);
    function ExportDlg() {
        _super.call(this, "ExportDlg");
    }
    ExportDlg.prototype.build = function () {
        var header = this.makeHeader("Export to XML");
        var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");
        var exportButton = this.makeButton("Export", "exportNodesButton", this.exportNodes, this);
        var backButton = this.makeCloseButton("Close", "cancelExportButton");
        var buttonBar = render.centeredButtonBar(exportButton + backButton);
        return header + formControls + buttonBar;
    };
    ExportDlg.prototype.exportNodes = function () {
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
    };
    ExportDlg.prototype.exportResponse = function (res) {
        if (util.checkSuccess("Export", res)) {
            (new MessageDlg("Export Successful.")).open();
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    return ExportDlg;
}(DialogBase));
//# sourceMappingURL=ExportDlg.js.map