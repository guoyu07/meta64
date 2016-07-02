var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ImportDlg.js");
var ImportDlg = (function (_super) {
    __extends(ImportDlg, _super);
    function ImportDlg() {
        _super.call(this, "ImportDlg");
    }
    ImportDlg.prototype.build = function () {
        var header = this.makeHeader("Import from XML");
        var formControls = this.makeEditField("Import Target Node Name", "importTargetNodeName");
        var importButton = this.makeButton("Import", "importNodesButton", this.importNodes, this);
        var backButton = this.makeCloseButton("Close", "cancelImportButton");
        var buttonBar = render.centeredButtonBar(importButton + backButton);
        return header + formControls + buttonBar;
    };
    ImportDlg.prototype.importNodes = function () {
        var highlightNode = meta64.getHighlightedNode();
        var sourceFileName = this.getInputVal("importTargetNodeName");
        if (util.emptyString(sourceFileName)) {
            (new MessageDlg("Please enter a name for the import file.")).open();
            return;
        }
        if (highlightNode) {
            util.json("import", {
                "nodeId": highlightNode.id,
                "sourceFileName": sourceFileName
            }, this.importResponse);
        }
    };
    ImportDlg.prototype.importResponse = function (res) {
        if (util.checkSuccess("Import", res)) {
            (new MessageDlg("Import Successful.")).open();
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    return ImportDlg;
}(DialogBase));
//# sourceMappingURL=ImportDlg.js.map