console.log("running module: shareToPersonPg.js");

var shareToPersonPg = function() {

	var _ = {
		domId : "shareToPersonPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = render.makeDialogHeader("Share Node to Person");

			var formControls = render.makeEditField("User to Share With", "shareToUserName");

			var shareButton = render.makeBackButton("Share", "shareNodeToPersonButton", _.domId, "share.shareNodeToPerson();");
			var backButton = render.makeBackButton("Close", "cancelShareNodeToPersonButton", _.domId);
			var buttonBar = render.centeredButtonBar(shareButton + backButton);

			var form = formControls + buttonBar;

			var internalMainContent = "Enter the username of the person you want to share this node with:";
			var mainContent = internalMainContent + form;

			var content = header + mainContent;
			util.setHtmlEnhanced(_.domId, content);
		}
	};

	console.log("Module ready: shareToPersonPg.js");
	return _;
}();

//# sourceURL=shareToPersonPg.js
