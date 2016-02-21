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

	var formControls = render.makeEditField("Export to File Name", "exportTargetNodeName");

	var exportButton = this.makeButton("Export", "exportNodesButton");
	var backButton = this.makeCloseButton("Close", "cancelExportButton");
	var buttonBar = render.centeredButtonBar(exportButton + backButton);

	//This feature is currently disabled pending completion of some refactoring
	//$("#"+this.id("exportNodesButton")).on("click", edit.exportNodes);
	return header + formControls + buttonBar;
}

ExportDlg.prototype.init = function() {
	
}


//# sourceURL=ExportDlg.js
