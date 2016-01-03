console.log("running module: uploadPg.js");

var uploadPg = function() {

	var _ = {
		domId : "uploadPg",
		tabId : "dialogsTabName",
		visible : false,

		build : function() {

			var header = "<h2>Upload File Attachment</h2>";

			var uploadPathDisplay = render.tag("div", {//
				"id" : "uploadPathDisplay",
				"class" : "path-display-in-editor"
			}, "");

			var formFields = "";

			/*
			 * For now I just hard-code in 7 edit fields, but we could
			 * theoretically make this dynamic so user can click 'add' button
			 * and add new ones one at a time. Just not taking the time to do
			 * that yet.
			 */
			for (var i = 0; i < 7; i++) {
				formFields += render.tag("input", {
					"type" : "file",
					"name" : "files"
				}, "", true);
			}

			formFields += render.tag("input", {
				"id" : "uploadFormNodeId",
				"type" : "hidden",
				"name" : "nodeId"
			}, "", true);

			/*
			 * According to some online posts I should have needed
			 * data-ajax="false" on this form but it is working as is without
			 * that.
			 */
			var form = render.tag("form", {
				"id" : "uploadForm",
				"method" : "POST",
				"enctype" : "multipart/form-data",
				"data-ajax" : "false" // NEW for multiple file upload
			// support???
			}, formFields);

			var uploadFieldContainer = render.tag("div", {//
				"id" : "uploadFieldContainer"
			}, "<p>Upload from your computer</p>" + form);

			var divider = "<div><h3>-- OR --</h3></div>";

			var uploadFromUrlField = render.makeEditField("Upload From URL", "uploadFromUrl");
			var uploadFromUrlDiv = render.tag("div", {//
			}, uploadFromUrlField);

			var uploadButton = render.makeButton("Upload", "uploadButton", "attachment.uploadFileNow();");
			var deleteButton = render.makeButton("Delete", "deleteAttachmentButton", "attachment.deleteAttachment();");
			var backButton = render.makeBackButton("Close", "closeUploadButton", _.domId);
			
			var buttonBar = render.makeHorzControlGroup(uploadButton + deleteButton + backButton);

			var mainContent = render.tag("div", //
			{
			}, //
			uploadPathDisplay + uploadFieldContainer + divider + uploadFromUrlDiv + buttonBar);

			util.setHtmlEnhanced("uploadPg", header + mainContent);
		},

		init : function() {

			$("#uploadFromUrl").val("");

			/* display the node path at the top of the edit page */
			$("#uploadPathDisplay").html("Path: " + render.formatPath(attachment.uploadNode));
		}
	};

	console.log("Module ready: uploadPg.js");
	return _;
}();

// # sourceUrl=uploadPg.js
