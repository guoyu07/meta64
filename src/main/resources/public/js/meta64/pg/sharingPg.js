console.log("running module: sharingPg.js");

var sharingPg = function() {

	var _ = {
		domId : "sharingPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = "<h2>Node Sharing</h2>";

			var shareWithPersonButton = render.makeButton("Share with Person", "shareNodeToPersonPgButton", "share.shareNodeToPersonPg();");
			var makePublicButton = render.makeButton("Share to Public", "shareNodeToPublicButton", "share.shareNodeToPublic();");
			var backButton = render.makeBackButton("Close", "closeSharingButton", _.domId, "share.closeSharingDlg();");
			
			var buttonBar = render.makeHorzControlGroup(shareWithPersonButton + makePublicButton + backButton);

			var internalMainContent = "<div id='shareNodeNameDisplay'></div>" + //
			"<div id='sharingListFieldContainer'></div>";

			var mainContent = internalMainContent + buttonBar;

			var content = header + mainContent;
			util.setHtmlEnhanced("sharingPg", content);
		},

		init : function() {
			share.reload();
		}
	};

	console.log("Module ready: sharingPg.js");
	return _;
}();

//# sourceURL=sharingPg.js
