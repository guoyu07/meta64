
console.log("running module: attachment.js");

var attachment = function() {

	var _ = {

		/* Node being uploaded to */
		uploadNode : null,

		openUploadFromFileDlg : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				_.uploadNode = null;
				(new MessageDlg("No node is selected.")).open();
				return;
			}

			_.uploadNode = node;
			(new UploadFromFileDlg()).open();
		},

		openUploadFromUrlDlg : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				_.uploadNode = null;
				(new MessageDlg("No node is selected.")).open();
				return;
			}

			_.uploadNode = node;
			(new UploadFromUrlDlg()).open();
		},

		deleteAttachment : function() {
			var node = meta64.getHighlightedNode();

			if (node) {
				(new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.",
						function() {
							util.json("deleteAttachment", {
								"nodeId" : node.id
							}, _.deleteAttachmentResponse, null, node.uid);
						})).open();
			}
		},

		deleteAttachmentResponse : function(res, uid) {
			if (util.checkSuccess("Delete attachment", res)) {
				meta64.removeBinaryByUid(uid);
				// force re-render from local data.
				meta64.goToMainPage(true);
			}
		}
	};

	console.log("Module ready: attachment.js");
	return _;
}();

//# sourceURL=attachment.js
