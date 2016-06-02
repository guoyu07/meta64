console.log("running module: user.js");

var share = function() {

	var _findSharedNodesResponse = function(res) {
		srch.searchNodesResponse(res);
	}

	var _ = {

		sharingNode : null,

		/*
		 * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
		 */
		editNodeSharing : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				(new MessageDlg("No node is selected.")).open();
				return;
			}
			_.sharingNode = node;
			(new SharingDlg()).open();
		},

		findSharedNodes : function() {
			var focusNode = meta64.getHighlightedNode();
			if (focusNode == null) {
				return;
			}

			srch.searchPageTitle = "Shared Nodes";

			util.json("getSharedNodes", {
				"nodeId" : focusNode.id
			}, _findSharedNodesResponse);
		}
	};

	console.log("Module ready: share.js");
	return _;
}();

//# sourceURL=share.js
