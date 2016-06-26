console.log("running module: UploadFromFileDlg.js");
var UploadFromFileDlg = function () {
    Dialog.call(this);
    this.domId = "UploadFromFileDlg";
};
var UploadFromFileDlg_ = util.inherit(Dialog, UploadFromFileDlg);
UploadFromFileDlg_.build = function () {
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
    var uploadButton = this.makeCloseButton("Upload", "uploadButton", UploadFromFileDlg_.uploadFileNow, this);
    var backButton = this.makeCloseButton("Close", "closeUploadButton");
    var buttonBar = render.centeredButtonBar(uploadButton + backButton);
    return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
};
UploadFromFileDlg_.uploadFileNow = function () {
    $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
    var data = new FormData();
    var thiz = this;
    var filesObj = $("#" + this.id("uploadForm"))[0];
    $.each(filesObj.files, function (i, file) {
        data.append(thiz.id("file-" + i), file);
    });
    var prms = $.ajax({
        url: postTargetUrl + "upload",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
    });
    prms.done(function () {
        meta64.refresh();
    });
    prms.fail(function () {
        (new MessageDlg("Upload failed.")).open();
    });
};
UploadFromFileDlg_.init = function () {
    $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
};
//# sourceMappingURL=UploadFromFileDlg.js.map