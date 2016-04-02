console.log("running module: UploadDlg.js");

/*
 * Class constructor
 * 
 * srcOption = url | file
 * 
 * todo-2: instead of the srcOption switch i was planning on eventually
 * splitting this into two separate classes
 */
var UploadDlg = function(srcOption) {
	// boiler plate for inheritance
	Dialog.call(this);
	this.srcOption = srcOption;
	this.domId = "UploadDlg";
}

// more boilerplate for inheritance
UploadDlg.prototype.constructor = UploadDlg;
util.inherit(Dialog, UploadDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
UploadDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Upload File Attachment");

	var uploadPathDisplay = render.tag("div", {//
		"id" : this.id("uploadPathDisplay"),
		"class" : "path-display-in-editor"
	}, "");

	var uploadFieldContainer = "";

	if (this.srcOption === "file") {
		var formFields = "";

		/*
		 * For now I just hard-code in 7 edit fields, but we could theoretically
		 * make this dynamic so user can click 'add' button and add new ones one
		 * at a time. Just not taking the time to do that yet.
		 */
		for (var i = 0; i < 7; i++) {
			var input = render.tag("input", {
				"type" : "file",
				"name" : "files"
			}, "", true);

			/* wrap in DIV to force vertical align */
			formFields += render.tag("div", {
				"style" : "margin-bottom: 10px;"
			}, input);
		}

		formFields += render.tag("input", {
			"id" : this.id("uploadFormNodeId"),
			"type" : "hidden",
			"name" : "nodeId"
		}, "", true);

		/*
		 * According to some online posts I should have needed data-ajax="false"
		 * on this form but it is working as is without that.
		 */
		var form = render.tag("form", {
			"id" : this.id("uploadForm"),
			"method" : "POST",
			"enctype" : "multipart/form-data",
			"data-ajax" : "false" // NEW for multiple file upload support???
		}, formFields);

		uploadFieldContainer = render.tag("div", {//
			"id" : this.id("uploadFieldContainer")
		}, "<p>Upload from your computer</p>" + form);
	}

	var uploadFromUrlDiv = "";

	if (this.srcOption === "url") {
		var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
		uploadFromUrlDiv = render.tag("div", {//
		}, uploadFromUrlField);
	}

	var uploadButton = this.makeCloseButton("Upload", "uploadButton", UploadDlg.prototype.uploadFileNow, this);
	var deleteButton = this.makeButton("Delete", "deleteAttachmentButton", UploadDlg.prototype.deleteAttachment, this);
	var backButton = this.makeCloseButton("Close", "closeUploadButton");

	var buttonBar = render.centeredButtonBar(uploadButton + deleteButton + backButton);

	return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
}

UploadDlg.prototype.uploadFileNow = function() {

	if (this.srcOption === "url") {
		var sourceUrl = this.getInputVal("uploadFromUrl");

		/* if uploading from URL */
		if (sourceUrl) {
			util.json("uploadFromUrl", {
				"nodeId" : attachment.uploadNode.id,
				"sourceUrl" : sourceUrl
			}, UploadDlg.prototype.uploadFromUrlResponse, this);
		}
	}
	/* Else uploading from local computer */
	else if (this.srcOption === "file") {

		/* Upload form has hidden input element for nodeId parameter */
		$("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);

		/*
		 * This is the only place we do something differently from the normal
		 * 'util.json()' calls to the server, because this is highly specialized
		 * here for form uploading, and is different from normal ajax calls.
		 */
		var prms = $.ajax({
			url : postTargetUrl + "upload",
			type : "POST",
			data : new FormData($("#" + this.id("uploadForm"))[0]),
			enctype : 'multipart/form-data',
			processData : false,
			contentType : false,
			cache : false
		});

		prms.done(function() {
			meta64.goToMainPage(true, true);
		});

		prms.fail(function() {
			(new MessageDlg("Upload failed.")).open();
		});
	}
}

UploadDlg.prototype.uploadFromUrlResponse = function(res) {
	if (util.checkSuccess("Upload from URL", res)) {
		meta64.goToMainPage(true, true);
	}
}

UploadDlg.prototype.init = function() {
	util.setInputVal(this.id("uploadFromUrl"), "");

	/* display the node path at the top of the edit page */
	$("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
}

// # sourceURL=UploadDlg.js
