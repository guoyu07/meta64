console.log("running module: ExportDlg.js");

var ExportDlg = function() {
	Dialog.call(this);	
	this.domId = "ExportDlg";
}

var ExportDlg_ = util.inherit(Dialog, ExportDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ExportDlg_.build = function() {
	var header = this.makeHeader("Export to XML");

	var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");

	var exportButton = this.makeButton("Export", "exportNodesButton", ExportDlg_.exportNodes, this);
	var backButton = this.makeCloseButton("Close", "cancelExportButton");
	var buttonBar = render.centeredButtonBar(exportButton + backButton);

	return header + formControls + buttonBar;
}

ExportDlg_.exportNodes = function() {
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
		}, ExportDlg_.exportResponse);
	}
}

ExportDlg_.exportResponse = function(res) {
	if (util.checkSuccess("Export", res)) {
		(new MessageDlg("Export Successful.")).open();
		meta64.selectTab("mainTabName");
		view.scrollToSelectedNode();
	}
}

ExportDlg_.init = function() {
}

//# sourceURL=ExportDlg.js
