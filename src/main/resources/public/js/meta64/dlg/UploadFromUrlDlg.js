var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: UploadFromUrlDlg.js");
var UploadFromUrlDlg = (function (_super) {
    __extends(UploadFromUrlDlg, _super);
    function UploadFromUrlDlg() {
        _super.call(this, "UploadFromUrlDlg");
    }
    UploadFromUrlDlg.prototype.build = function () {
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
        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");
        var buttonBar = render.centeredButtonBar(uploadButton + backButton);
        return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
    };
    UploadFromUrlDlg.prototype.uploadFileNow = function () {
        var sourceUrl = this.getInputVal("uploadFromUrl");
        if (sourceUrl) {
            util.json("uploadFromUrl", {
                "nodeId": attachment.uploadNode.id,
                "sourceUrl": sourceUrl
            }, this.uploadFromUrlResponse, this);
        }
    };
    UploadFromUrlDlg.prototype.uploadFromUrlResponse = function (res) {
        if (util.checkSuccess("Upload from URL", res)) {
            meta64.refresh();
        }
    };
    UploadFromUrlDlg.prototype.init = function () {
        util.setInputVal(this.id("uploadFromUrl"), "");
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    };
    return UploadFromUrlDlg;
}(DialogBase));
//# sourceMappingURL=UploadFromUrlDlg.js.map