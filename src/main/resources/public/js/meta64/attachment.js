console.log("running module: attachment.js");

var attachment = function() {

	function _deleteAttachmentResponse(res) {
		if (util.checkSuccess("Delete attachment", res)) {

			/*
			 * For some reason just setting hasBinary false on the uploadNode
			 * and then rebuilding the page doesn't work. I had to write the
			 * 'removeBinaryByUid' function to make it take effect. What this
			 * means is that somewhere a 'node' object is getting 'cloned'
			 * somehow such that setting hasBinary to false here doesn't change
			 * the source array that's used in renderPageFromData, but I am
			 * confused, because I'm not cloning any 'node' objects. They get
			 * sent to us from the JSON return value in renderNode, and I never
			 * create any new 'node' objects myself yet we have proof some are
			 * getting created or else setting 'hasBinary' below would work.
			 * Functionally the code works perfectly but IMO I shouldn't have
			 * needed to write the 'removeBinaryByUid' at all.
			 */
			// _.uploadNode.hasBinary = false;
			meta64.removeBinaryByUid(_.uploadNode.uid);

			console.log("removed attachment from node uid: " + _.uploadNode.uid);
			//render.renderPageFromData();
			//_.closeUploadPg();
		
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
			confirmPg.areYouSure("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function() {
				util.json("deleteAttachment", {
					"nodeId" : _.uploadNode.id
				}, _deleteAttachmentResponse);
			});
		},

		uploadFileNow : function() {

			var sourceUrl = $("#uploadFromUrl").val();

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
					alert("Upload failed.");
				});
			}
		},

		openUploadPg : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				_.uploadNode = null;
				alert("No node is selected.");
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

