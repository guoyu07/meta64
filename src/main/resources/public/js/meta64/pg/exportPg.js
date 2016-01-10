console.log("running module: exportPg.js");

var exportPg = function() {

	var _ = {
		domId : "exportPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = render.makeDialogHeader("Export to XML");

			var formControls = render.makeEditField("Export to File Name", "exportTargetNodeName");

			var exportButton = render.makeButton("Export", "exportNodesButton");
			var backButton = render.makeBackButton("Close", "cancelExportButton", _.domId);
			var buttonBar = render.centeredButtonBar(exportButton + backButton);

			var form = formControls + buttonBar;

			var internalMainContent = "";
			var mainContent = internalMainContent + form;

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

			$("#exportNodesButton").on("click", edit.exportNodes);
		}
	};

	console.log("Module ready: exportPg.js");
	return _;
}();

//# sourceURL=exortPg.js
