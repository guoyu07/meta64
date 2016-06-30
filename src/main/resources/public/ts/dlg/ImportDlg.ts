
console.log("running module: ImportDlg.js");

var ImportDlg = function() {
    Dialog.call(this);
    this.domId = "ImportDlg";
}

var ImportDlg_ = util.inherit(Dialog, ImportDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ImportDlg_.build = function() {
    var header = this.makeHeader("Import from XML");

    var formControls = this.makeEditField("Import Target Node Name", "importTargetNodeName");

    var importButton = this.makeButton("Import", "importNodesButton", ImportDlg_.importNodes, this);
    var backButton = this.makeCloseButton("Close", "cancelImportButton");
    var buttonBar = render.centeredButtonBar(importButton + backButton);

    return header + formControls + buttonBar;
}

ImportDlg_.importNodes = function() {
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
        }, ImportDlg_.importResponse);
    }
}

ImportDlg_.importResponse = function(res) {
    if (util.checkSuccess("Import", res)) {
        (new MessageDlg("Import Successful.")).open();
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    }
}

ImportDlg_.init = function() {
}
