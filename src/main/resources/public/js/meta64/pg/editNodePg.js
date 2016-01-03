console.log("running module: editNodePg.js");

var editNodePg = function() {

	var _ = {
		domId : "editNodePg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = "<h2>Edit Node</h2>";

			var saveNodeButton = render.makeBackButton("Save", "saveNodeButton", _.domId, "edit.saveNode();");
			var addPropertyButton = render.makeButton("Add Property", "addPropertyButton", "props.addProperty();");

			/*
			 * commented for polymer 
			 * 
			 * 
			 * var makeNodeReferencableButton =
			 * render.makeButton("Make Node Referencable",
			 * "makeNodeReferencableButton", "edit.makeNodeReferencable();");
			 * var splitContentButton = render.makeButton("Split Content",
			 * "splitContentButton", "edit.splitContent();");
			 */

			var cancelEditButton = render.makeBackButton("Close", "cancelEditButton", _.domId, "edit.cancelEdit();");

			var buttonBar = render.makeHorzControlGroup(saveNodeButton + addPropertyButton
			// + makeNodeReferencableButton
			// + splitContentButton
			+ cancelEditButton);

			var internalMainContent = "<div id='editNodePathDisplay' class='path-display-in-editor'></div>" + //
			"<div id='editNodeInstructions'></div>" + //
			"<div id='propertyEditFieldContainer'>Loading propertyEditFieldContainer...</div>";

			var content = header + internalMainContent + buttonBar;
			util.setHtmlEnhanced(_.domId, content);
		},

		init : function() {
			edit.populateEditNodePg();
		}
	};

	console.log("Module ready: editNodePg.js");
	return _;
}();

//# sourceURL=editNodePg.js
