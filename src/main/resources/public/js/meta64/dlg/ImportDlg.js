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

	var importButton = this.makeButton("Import", "importNodesButton");
	var backButton = this.makeCloseButton("Close", "cancelImportButton");
	var buttonBar = render.centeredButtonBar(importButton + backButton);

	//disabled, pending some other refactoring.
	//$("#importNodesButton").on("click", edit.importNodes);
	return header + formControls + buttonBar;
}

ImportDlg.prototype.init = function() {
	
}

//# sourceURL=ImportDlg.js
