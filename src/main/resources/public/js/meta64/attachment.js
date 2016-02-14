console.log("running module: attachment.js");

var attachment = function() {

	var _ = {

		/* Node being uploaded to */
		uploadNode : null,

		openUploadPg : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				_.uploadNode = null;
				(new MessageDlg("No node is selected.")).open();
				return;
			}

			_.uploadNode = node;
			(new UploadDlg()).open();
		}
	};

	console.log("Module ready: attachment.js");
	return _;
}();

//# sourceURL=attachment.js

