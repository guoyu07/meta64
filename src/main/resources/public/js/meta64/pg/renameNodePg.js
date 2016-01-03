console.log("running module: renameNodePg.js");

var renameNodePg = function() {

	var _ = {
		domId : "renameNodePg",
		tabId : "dialogsTabName",
		visible : false,
		
		build : function() {

			var header = "<h2>Rename Node</h2>";

			var curNodeNameDisplay = "<h3 id='curNodeNameDisplay'></h3>";

			var formControls = render.makeEditField("Enter new name for the node", "newNodeNameEditField");

			var renameNodeButton = render.makeButton("Rename", "renameNodeButton", "edit.renameNode();");
			var backButton = render.makeBackButton("Close", "cancelRenameNodeButton", _.domId);
			var buttonBar = render.makeHorzControlGroup(renameNodeButton + backButton);

			var form = formControls + buttonBar;

			var mainContent = curNodeNameDisplay + form;

			var content = header + mainContent;
			util.setHtmlEnhanced("renameNodePg", content);
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
