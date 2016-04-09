console.log("running module: UploadFromUrlDlg.js");

var UploadFromUrlDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	this.domId = "UploadFromUrlDlg";
}

// more boilerplate for inheritance
UploadFromUrlDlg.prototype.constructor = UploadFromUrlDlg;
util.inherit(Dialog, UploadFromUrlDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
UploadFromUrlDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Upload File Attachment");

	var uploadPathDisplay = render.tag("div", {//
		"id" : this.id("uploadPathDisplay"),
		"class" : "path-display-in-editor"
	}, "");

	var uploadFieldContainer = "";
	var uploadFromUrlDiv = "";

	var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
	uploadFromUrlDiv = render.tag("div", {//
	}, uploadFromUrlField);

	var uploadButton = this.makeCloseButton("Upload", "uploadButton", UploadFromUrlDlg.prototype.uploadFileNow, this);
	var backButton = this.makeCloseButton("Close", "closeUploadButton");

	var buttonBar = render.centeredButtonBar(uploadButton + backButton);

	return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
}

UploadFromUrlDlg.prototype.uploadFileNow = function() {
	var sourceUrl = this.getInputVal("uploadFromUrl");

	/* if uploading from URL */
	if (sourceUrl) {
		util.json("uploadFromUrl", {
			"nodeId" : attachment.uploadNode.id,
			"sourceUrl" : sourceUrl
		}, UploadFromUrlDlg.prototype.uploadFromUrlResponse, this);
	}
}

UploadFromUrlDlg.prototype.uploadFromUrlResponse = function(res) {
	if (util.checkSuccess("Upload from URL", res)) {
		meta64.refresh();
	}
}

UploadFromUrlDlg.prototype.init = function() {
	util.setInputVal(this.id("uploadFromUrl"), "");

	/* display the node path at the top of the edit page */
	$("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
}

// # sourceURL=UploadFromUrlDlg.js
