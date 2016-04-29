console.log("running module: ExportDlg.js");

/*
 * Class constructor
 */
var ExportDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ExportDlg";
}

// more boilerplate for inheritance
ExportDlg.prototype.constructor = ExportDlg;
util.inherit(Dialog, ExportDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ExportDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Export to XML");

	var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");

	var exportButton = this.makeButton("Export", "exportNodesButton", ExportDlg.prototype.exportNodes, this);
	var backButton = this.makeCloseButton("Close", "cancelExportButton");
	var buttonBar = render.centeredButtonBar(exportButton + backButton);

	return header + formControls + buttonBar;
}

ExportDlg.prototype.exportNodes = function() {
	var highlightNode = meta64.getHighlightedNode();
	var targetFileName = this.getInputVal("exportTargetNodeName");

	if (util.emptyString(targetFileName)) {
		(new MessageDlg("Please enter a name for the export file.")).open();
		return;
	}

	if (highlightNode) {
		util.json("exportToXml", {
			"nodeId" : highlightNode.id,
			"targetFileName" : targetFileName
		}, ExportDlg.prototype.exportResponse);
	}
}

ExportDlg.prototype.exportResponse = function(res) {
	if (util.checkSuccess("Export", res)) {
		(new MessageDlg("Export Successful.")).open();
		meta64.selectTab("mainTabName");
		view.scrollToSelectedNode();
	}
}

ExportDlg.prototype.init = function() {
}

//# sourceURL=ExportDlg.js
