console.log("running module: UploadFromUrlDlg.js");
var UploadFromUrlDlg = function () {
    Dialog.call(this);
    this.domId = "UploadFromUrlDlg";
};
var UploadFromUrlDlg_ = util.inherit(Dialog, UploadFromUrlDlg);
UploadFromUrlDlg_.build = function () {
    var header = this.makeHeader("Upload File Attachment");
    var uploadPathDisplay = "";
    if (cnst.SHOW_PATH_IN_DLGS) {
        uploadPathDisplay += render.tag("div", {
            "id": this.id("uploadPathDisplay"),
            "class": "path-display-in-editor"
        }, "");
    }
    var uploadFieldContainer = "";
    var uploadFromUrlDiv = "";
    var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
    uploadFromUrlDiv = render.tag("div", {}, uploadFromUrlField);
    var uploadButton = this.makeCloseButton("Upload", "uploadButton", UploadFromUrlDlg_.uploadFileNow, this);
    var backButton = this.makeCloseButton("Close", "closeUploadButton");
    var buttonBar = render.centeredButtonBar(uploadButton + backButton);
    return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
};
UploadFromUrlDlg_.uploadFileNow = function () {
    var sourceUrl = this.getInputVal("uploadFromUrl");
    if (sourceUrl) {
        util.json("uploadFromUrl", {
            "nodeId": attachment.uploadNode.id,
            "sourceUrl": sourceUrl
        }, UploadFromUrlDlg_.uploadFromUrlResponse, this);
    }
};
UploadFromUrlDlg_.uploadFromUrlResponse = function (res) {
    if (util.checkSuccess("Upload from URL", res)) {
        meta64.refresh();
    }
};
UploadFromUrlDlg_.init = function () {
    util.setInputVal(this.id("uploadFromUrl"), "");
    $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
};
//# sourceMappingURL=UploadFromUrlDlg.js.map