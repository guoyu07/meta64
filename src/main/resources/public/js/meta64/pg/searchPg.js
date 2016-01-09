console.log("running module: searchPg.js");

var searchPg = function() {

	var _ = {
		domId : "searchPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = "<h2>Search</h2>";

			var formControls = render.makeEditField("Search", "searchText");

			var searchButton = render.makeButton("Search", "searchNodesButton", "srch.searchNodes();");
			var backButton = render.makeBackButton("Close", "cancelSearchButton", _.domId);
			var buttonBar = render.makeHorzControlGroup(searchButton + backButton);

			var form = render.tag("div", //
			{
				"class" : "ui-field-contain" //
			}, //
			formControls + buttonBar);

			var internalMainContent = "";
			var mainContent = internalMainContent + form;

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);

			util.bindEnterKey("#searchText", srch.searchNodes)
		},

		init : function() {
			util.delayedFocus("#searchText");
		}
	};

	console.log("Module ready: searchPg.js");
	return _;
}();

//# sourceURL=searchPg.js
