console.log("running module: SearchDlg.js");

/*
 * Class constructor
 */
var SearchDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "SearchDlg";
}

// more boilerplate for inheritance
SearchDlg.prototype.constructor = SearchDlg;
util.inherit(Dialog, SearchDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
SearchDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Search");

	var instructions = "<p>Enter some text to find. All sub-nodes under the selected node are included in the search.</p>";
	var formControls = this.makeEditField("Search", "searchText");

	var searchButton = this.makeCloseButton("Search", "searchNodesButton", SearchDlg.prototype.searchNodes, this);
	var backButton = this.makeCloseButton("Close", "cancelSearchButton");
	var buttonBar = render.centeredButtonBar(searchButton + backButton);

	var content = header + instructions + formControls + buttonBar;
	this.bindEnterKey("searchText", srch.searchNodes)
	return content;
}

SearchDlg.prototype.searchNodes = function() {
	if (!util.ajaxReady("searchNodes")) {
		return;
	}

	var node = meta64.getHighlightedNode();
	if (!node) {
		(new MessageDlg("No node is selected to search under.")).open();
		return;
	}

	var searchText = this.getInputVal("searchText");
	if (util.emptyString(searchText)) {
		(new MessageDlg("Enter search text.")).open();
		return;
	}

	util.json("nodeSearch", {
		"nodeId" : node.id,
		"searchText" : searchText,
		"modSortDesc" : false
	}, srch.searchNodesResponse);
}

SearchDlg.prototype.init = function() {
	//todo-2: put in base class.
	util.delayedFocus(this.id("searchText"));
}

//# sourceURL=SearchDlg.js
