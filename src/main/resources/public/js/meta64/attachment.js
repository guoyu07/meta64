console.log("running module: attachment.js");

var attachment = function() {

	function _deleteAttachmentResponse(res) {
		if (util.checkSuccess("Delete attachment", res)) {

			/*
			 * TODO: Does just setting hasBinary false not work? 
			 */
			// _.uploadNode.hasBinary = false;
			meta64.removeBinaryByUid(_.uploadNode.uid);

			console
					.log("removed attachment from node uid: "
							+ _.uploadNode.uid);
			// render.renderPageFromData();
			// _.closeUploadPg();

			meta64.goToMainPage(true);
		}
	}

	function _uploadFromUrlResponse(res) {
		if (util.checkSuccess("Upload from URL", res)) {
			meta64.goToMainPage(true, true);
		}
	}

	var _ = {

		/* Node being uploaded to */
		uploadNode : null,

		deleteAttachment : function() {
			(new ConfirmDlg("Confirm Delete Attachment",
					"Delete the Attachment on the Node?", "Yes, delete.",
					function() {
						util.json("deleteAttachment", {
							"nodeId" : _.uploadNode.id
						}, _deleteAttachmentResponse);
					})).open();
		},

		uploadFileNow : function() {

			var sourceUrl = util.getInputVal("uploadFromUrl");

			/* if uploading from URL */
			if (sourceUrl) {
				util.json("uploadFromUrl", {
					"nodeId" : _.uploadNode.id,
					"sourceUrl" : sourceUrl
				}, _uploadFromUrlResponse);
			}
			/* Else uploading from local computer */
			else {

				/* Upload form has hidden input element for nodeId parameter */
				$("#uploadFormNodeId").attr("value", _.uploadNode.id);

				/*
				 * This is the only place we do something differently from the
				 * normal 'util.json()' calls to the server, because this is
				 * highly specialized here for form uploading, and is different
				 * from normal ajax calls.
				 */
				var prms = $.ajax({
					url : postTargetUrl + "upload",
					type : "POST",
					data : new FormData($("#uploadForm")[0]),
					enctype : 'multipart/form-data',
					processData : false,
					contentType : false,
					cache : false
				});

				prms.done(function() {
					meta64.goToMainPage(true, true);
				});

				prms.fail(function() {
					messagePg.alert("Upload failed.");
				});
			}
		},

		openUploadPg : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				_.uploadNode = null;
				messagePg.alert("No node is selected.");
				return;
			}

			_.uploadNode = node;
			meta64.changePage(uploadPg);
		}
	};

	console.log("Module ready: attachment.js");
	return _;
}();

//# sourceURL=attachment.js

