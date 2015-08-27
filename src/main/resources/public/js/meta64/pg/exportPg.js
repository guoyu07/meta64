console.log("running module: exportPg.js");

var exportPg = function() {

	var _ = {
			domId : "exportPg",
			
		build : function() {

			var header = render.tag("div", //
			{
				"data-role" : "header"//,
				//"data-position" : "fixed",
				//"data-tap-toggle" : "false"
			}, //
			"<h2>" + BRANDING_TITLE + " - Export to XML</h2>");

			var formControls = render.makeEditField("Export to File Name", "exportTargetNodeName");

			var exportButton = render.makeButton("Export", "exportNodesButton", "b");
			var backButton = render.makeBackButton("Close", "cancelExportButton", "a");
			var buttonBar = render.makeHorzControlGroup(exportButton + backButton);

			var form = render.tag("div", //
			{
				"class" : "ui-field-contain" //
			}, //
			formControls + buttonBar);

			var internalMainContent = "";
			var mainContent = render.tag("div", //
			{
				"role" : "main", //
				"class" : "ui-content dialog-content"
			}, //
			internalMainContent + form);

			var content = header + mainContent;
			util.setHtmlEnhanced($("#exportPg"), content);

			$("#exportNodesButton").on("click", edit.exportNodes);
		}
	};

	console.log("Module ready: exportPg.js");
	return _;
}();

//# sourceURL=exortPg.js
