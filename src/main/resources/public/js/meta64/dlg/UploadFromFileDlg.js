var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: UploadFromFileDlg.js");
var UploadFromFileDlg = (function (_super) {
    __extends(UploadFromFileDlg, _super);
    function UploadFromFileDlg() {
        _super.call(this, "UploadFromFileDlg");
    }
    UploadFromFileDlg.prototype.build = function () {
        var header = this.makeHeader("Upload File Attachment");
        var uploadPathDisplay = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += render.tag("div", {
                "id": this.id("uploadPathDisplay"),
                "class": "path-display-in-editor"
            }, "");
        }
        var uploadFieldContainer = "";
        var formFields = "";
        for (var i = 0; i < 7; i++) {
            var input = render.tag("input", {
                "type": "file",
                "name": "files"
            }, "", true);
            formFields += render.tag("div", {
                "style": "margin-bottom: 10px;"
            }, input);
        }
        formFields += render.tag("input", {
            "id": this.id("uploadFormNodeId"),
            "type": "hidden",
            "name": "nodeId"
        }, "", true);
        var form = render.tag("form", {
            "id": this.id("uploadForm"),
            "method": "POST",
            "enctype": "multipart/form-data",
            "data-ajax": "false"
        }, formFields);
        uploadFieldContainer = render.tag("div", {
            "id": this.id("uploadFieldContainer")
        }, "<p>Upload from your computer</p>" + form);
        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");
        var buttonBar = render.centeredButtonBar(uploadButton + backButton);
        return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
    };
    UploadFromFileDlg.prototype.uploadFileNow = function () {
        $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
        var data = new FormData(($("#" + this.id("uploadForm"))[0]));
        var prms = $.ajax({
            url: postTargetUrl + "upload",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        });
        prms.done(function () {
            meta64.refresh();
        });
        prms.fail(function () {
            (new MessageDlg("Upload failed.")).open();
        });
    };
    UploadFromFileDlg.prototype.init = function () {
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    };
    return UploadFromFileDlg;
}(DialogBase));
//# sourceMappingURL=UploadFromFileDlg.js.map