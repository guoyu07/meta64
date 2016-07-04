
console.log("running module: UploadFromFileDlg.js");
//import { cnst } from "../cnst";

class UploadFromFileDlg extends DialogBase {

    constructor() {
        super("UploadFromFileDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Upload File Attachment");

        var uploadPathDisplay = "";

        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += render.tag("div", {//
                "id": this.id("uploadPathDisplay"),
                "class": "path-display-in-editor"
            }, "");
        }

        var uploadFieldContainer = "";

        var formFields = "";

        /*
         * For now I just hard-code in 7 edit fields, but we could theoretically make this dynamic so user can click 'add'
         * button and add new ones one at a time. Just not taking the time to do that yet.
         */
        for (var i = 0; i < 7; i++) {
            var input = render.tag("input", {
                "type": "file",
                "name": "files"
            }, "", true);

            /* wrap in DIV to force vertical align */
            formFields += render.tag("div", {
                "style": "margin-bottom: 10px;"
            }, input);
        }

        formFields += render.tag("input", {
            "id": this.id("uploadFormNodeId"),
            "type": "hidden",
            "name": "nodeId"
        }, "", true);

        /*
         * According to some online posts I should have needed data-ajax="false" on this form but it is working as is
         * without that.
         */
        var form = render.tag("form", {
            "id": this.id("uploadForm"),
            "method": "POST",
            "enctype": "multipart/form-data",
            "data-ajax": "false" // NEW for multiple file upload support???
        }, formFields);

        uploadFieldContainer = render.tag("div", {//
            "id": this.id("uploadFieldContainer")
        }, "<p>Upload from your computer</p>" + form);

        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");

        var buttonBar = render.centeredButtonBar(uploadButton + backButton);

        return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
    }

    uploadFileNow = (): void => {

        /* Upload form has hidden input element for nodeId parameter */
        $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);

        /*
         * This is the only place we do something differently from the normal 'util.json()' calls to the server, because
         * this is highly specialized here for form uploading, and is different from normal ajax calls.
         */
        //////////////////////////////////////////
        var data = new FormData(<HTMLFormElement>($("#" + this.id("uploadForm"))[0]));

        var prms = $.ajax({
            url: postTargetUrl + "upload",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        });

        prms.done(function() {
            meta64.refresh();
        });

        prms.fail(function() {
            (new MessageDlg("Upload failed.")).open();
        });
    }

    init = (): void => {
        /* display the node path at the top of the edit page */
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    }
}
