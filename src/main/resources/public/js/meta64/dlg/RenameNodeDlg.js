console.log("running module: RenameNodeDlg.js");

/*
 * Class constructor
 */
var RenameNodeDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "RenameNodeDlg";
}

// more boilerplate for inheritance
var RenameNodeDlg_ = util.inherit(Dialog, RenameNodeDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
RenameNodeDlg_.build = function() {
	var header = this.makeHeader("Rename Node");

	var curNodeNameDisplay = "<h3 id='"+this.id("curNodeNameDisplay")+"'></h3>";

	var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");

	var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", RenameNodeDlg_.renameNode, this);
	var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
	var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);

	return header + curNodeNameDisplay + formControls + buttonBar;
}

RenameNodeDlg_.renameNode = function() {
	var newName = this.getInputVal("newNodeNameEditField");

	if (util.emptyString(newName)) {
		(new MessageDlg("Please enter a new node name.")).open();
		return;
	}

	var highlightNode = meta64.getHighlightedNode();
	if (!highlightNode) {
		(new MessageDlg("Select a node to rename.")).open();
		return;
	}

	/* if no node below this node, returns null */
	var nodeBelow = edit.getNodeBelow(highlightNode);

	var renamingRootNode = (highlightNode.id === meta64.currentNodeId);

	var ironRes = util.json("renameNode", {
		"nodeId" : highlightNode.id,
		"newName" : newName
	});

	var This = this;
	
	ironRes.completes.then(function() {
		This.renameNodeResponse(ironRes.response, renamingRootNode);
	});
}

RenameNodeDlg_.renameNodeResponse = function(res, renamingPageRoot) {
	if (util.checkSuccess("Rename node", res)) {
		if (renamingPageRoot) {
			view.refreshTree(res.newId, true);
		} else {
			view.refreshTree(null, false, res.newId);
		}
		//meta64.selectTab("mainTabName");
	}
}

RenameNodeDlg_.init = function() {
	var highlightNode = meta64.getHighlightedNode();
	if (!highlightNode) {
		return;
	}
	$("#"+this.id("curNodeNameDisplay")).html("Path: " + highlightNode.path + "<br/>Name: " + highlightNode.name);
}


//# sourceURL=RenameNodeDlg.js
