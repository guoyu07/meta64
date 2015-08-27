console.log("running module: renameNodePg.js");

var renameNodePg = function() {

	var _ = {
		domId : "renameNodePg",

		build : function() {

			var header = render.tag("div", //
			{
				"data-role" : "header"// ,
			// "data-position" : "fixed",
			// "data-tap-toggle" : "false"
			}, //
			"<h2>" + BRANDING_TITLE + " - Rename Node</h2>");

			var curNodeNameDisplay = "<h3 id='curNodeNameDisplay'></h3>";

			var formControls = render.makeEditField("Enter new name for the node", "newNodeNameEditField");

			var renameNodeButton = render.makeButton("Rename", "renameNodeButton", "b");
			var backButton = render.makeBackButton("Close", "cancelRenameNodeButton", "a");
			var buttonBar = render.makeHorzControlGroup(renameNodeButton + backButton);

			var form = render.tag("div", //
			{
				"class" : "ui-field-contain" //
			}, //
			formControls + buttonBar);

			var mainContent = render.tag("div", //
			{
				"role" : "main", //
				"class" : "ui-content dialog-content"
			}, //
			curNodeNameDisplay + form);

			var content = header + mainContent;
			util.setHtmlEnhanced($("#renameNodePg"), content);

			$("#renameNodeButton").on("click", edit.renameNode);
		},

		init : function() {
			var highlightNode = meta64.getHighlightedNode();
			if (!highlightNode) {
				return;
			}
			$("#curNodeNameDisplay").html("Path: " + highlightNode.path + "<br/>Name: " + highlightNode.name);
		}
	};

	console.log("Module ready: renameNodePg.js");
	return _;
}();

//# sourceURL=renameNodePg.js
