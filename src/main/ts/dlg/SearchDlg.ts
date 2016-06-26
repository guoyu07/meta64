
console.log("running module: SearchDlg.js");

var SearchDlg = function() {
	Dialog.call(this);
	this.domId = "SearchDlg";
}

var SearchDlg_ = util.inherit(Dialog, SearchDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
SearchDlg_.build = function() {
	var header = this.makeHeader("Search");

	var instructions = this.makeMessageArea("Enter some text to find. All sub-nodes under the selected node are included in the search.");
	var formControls = this.makeEditField("Search", "searchText");

	var searchButton = this.makeCloseButton("Search", "searchNodesButton", SearchDlg_.searchNodes, this);
	var searchTagsButton = this.makeCloseButton("Search Tags", "searchTagsButton", SearchDlg_.searchTags, this);
	var backButton = this.makeCloseButton("Close", "cancelSearchButton");
	var buttonBar = render.centeredButtonBar(searchButton + searchTagsButton + backButton);

	var content = header + instructions + formControls + buttonBar;
	this.bindEnterKey("searchText", srch.searchNodes)
	return content;
}

SearchDlg_.searchNodes = function() {
	return this.searchProperty("jcr:content");
}

SearchDlg_.searchTags = function() {
	return this.searchProperty(jcrCnst.TAGS);
}

SearchDlg_.searchProperty = function(searchProp) {
	if (!util.ajaxReady("searchNodes")) {
		return;
	}

	// until i get better validation
	var node = meta64.getHighlightedNode();
	if (!node) {
		(new MessageDlg("No node is selected to search under.")).open();
		return;
	}

	// until better validation
	var searchText = this.getInputVal("searchText");
	if (util.emptyString(searchText)) {
		(new MessageDlg("Enter search text.")).open();
		return;
	}

	util.json("nodeSearch", {
		"nodeId" : node.id,
		"searchText" : searchText,
		"modSortDesc" : false,
		"searchProp" : searchProp
	}, srch.searchNodesResponse);
}

SearchDlg_.init = function() {
	util.delayedFocus(this.id("searchText"));
}
