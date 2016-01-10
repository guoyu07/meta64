console.log("running module: importPg.js");

var importPg = function() {

	var _ = {
		domId : "importPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = render.makeDialogHeader("Import from XML");

			var formControls = render.makeEditField("Import Target Node Name", "importTargetNodeName");

			var importButton = render.makeButton("Import", "importNodesButton");
			var backButton = render.makeBackButton("Close", "cancelImportButton", _.domId);
			var buttonBar = render.centeredButtonBar(importButton + backButton);

			var form = formControls + buttonBar;

			var internalMainContent = "";
			var mainContent = internalMainContent + form;

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

			$("#importNodesButton").on("click", edit.importNodes);
		}
	};

	console.log("Module ready: importPg.js");
	return _;
}();

//# sourceURL=importPg.js
