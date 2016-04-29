console.log("running module: ImportDlg.js");

/*
 * Class constructor
 */
var ImportDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ImportDlg";
}

// more boilerplate for inheritance
ImportDlg.prototype.constructor = ImportDlg;
util.inherit(Dialog, ImportDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ImportDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Import from XML");

	var formControls = this.makeEditField("Import Target Node Name", "importTargetNodeName");

	var importButton = this.makeButton("Import", "importNodesButton", ImportDlg.prototype.importNodes, this);
	var backButton = this.makeCloseButton("Close", "cancelImportButton");
	var buttonBar = render.centeredButtonBar(importButton + backButton);

	return header + formControls + buttonBar;
}

ImportDlg.prototype.importNodes = function() {
	debugger;
	var highlightNode = meta64.getHighlightedNode();
	var sourceFileName = this.getInputVal("importTargetNodeName");

	if (util.emptyString(sourceFileName)) {
		(new MessageDlg("Please enter a name for the import file.")).open();
		return;
	}

	if (highlightNode) {
		util.json("import", {
			"nodeId" : highlightNode.id,
			"sourceFileName" : sourceFileName
		}, ImportDlg.prototype.importResponse);
	}
}

ImportDlg.prototype.importResponse = function(res) {
	if (util.checkSuccess("Import", res)) {
		(new MessageDlg("Import Successful.")).open();
		view.refreshTree(null, false);
		meta64.selectTab("mainTabName");
		view.scrollToSelectedNode();
	}
}

ImportDlg.prototype.init = function() {
}

//# sourceURL=ImportDlg.js
