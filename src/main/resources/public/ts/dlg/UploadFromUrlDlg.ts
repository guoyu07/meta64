
console.log("running module: UploadFromUrlDlg.js");
//import { cnst } from "../cnst";

class UploadFromUrlDlg extends DialogBase {

    constructor() {
        super("UploadFromUrlDlg");
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
        var uploadFromUrlDiv = "";

        var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
        uploadFromUrlDiv = render.tag("div", {//
        }, uploadFromUrlField);

        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");

        var buttonBar = render.centeredButtonBar(uploadButton + backButton);

        return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
    }

    uploadFileNow = (): void => {
        var sourceUrl = this.getInputVal("uploadFromUrl");

        /* if uploading from URL */
        if (sourceUrl) {
            util.json("uploadFromUrl", {
                "nodeId": attachment.uploadNode.id,
                "sourceUrl": sourceUrl
            }, this.uploadFromUrlResponse, this);
        }
    }

    uploadFromUrlResponse = (res: any): void => {
        if (util.checkSuccess("Upload from URL", res)) {
            meta64.refresh();
        }
    }

    init = (): void => {
        util.setInputVal(this.id("uploadFromUrl"), "");

        /* display the node path at the top of the edit page */
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    }
}
