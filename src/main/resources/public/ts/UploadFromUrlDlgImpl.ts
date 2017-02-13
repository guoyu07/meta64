import {DialogBaseImpl} from "./DialogBaseImpl";
import {UploadFromUrlDlg} from "./UploadFromUrlDlg";
import {cnst} from "./Constants";
import {render} from "./Render";
import {util} from "./Util";
import {attachment} from "./Attachment";
import {meta64} from "./Meta64";
import * as I from "./Interfaces";
import {tag} from "./Tag";

export default class UploadFromUrlDlgImpl extends DialogBaseImpl implements UploadFromUrlDlg {

    constructor() {
        super("UploadFromUrlDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Upload File Attachment");

        let uploadPathDisplay = "";

        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += tag.div( {//
                "id": this.id("uploadPathDisplay"),
                "class": "path-display-in-editor"
            }, "");
        }

        let uploadFieldContainer = "";
        let uploadFromUrlDiv = "";

        let uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
        uploadFromUrlDiv = tag.div( {//
        }, uploadFromUrlField);

        let uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        let backButton = this.makeCloseButton("Close", "closeUploadButton");

        let buttonBar = render.centeredButtonBar(uploadButton + backButton);

        return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
    }

    uploadFileNow = (): void => {
        let sourceUrl = this.getInputVal("uploadFromUrl");

        /* if uploading from URL */
        if (sourceUrl) {
            util.json<I.UploadFromUrlRequest, I.UploadFromUrlResponse>("uploadFromUrl", {
                "nodeId": attachment.uploadNode.id,
                "sourceUrl": sourceUrl
            }, this.uploadFromUrlResponse, this);
        }
    }

    uploadFromUrlResponse = (res: I.UploadFromUrlResponse): void => {
        if (util.checkSuccess("Upload from URL", res)) {
            meta64.refresh();
        }
    }

    init = (): void => {
        util.setInputVal(this.id("uploadFromUrl"), "");

        /* display the node path at the top of the edit page */
        this.setInnerHTML("uploadPathDisplay", "Path: " + render.formatPath(attachment.uploadNode));
    }
}
