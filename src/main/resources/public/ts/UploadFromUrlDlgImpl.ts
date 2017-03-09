import { DialogBaseImpl } from "./DialogBaseImpl";
import { UploadFromUrlDlg } from "./UploadFromUrlDlg";
import { cnst } from "./Constants";
import { render } from "./Render";
import { util } from "./Util";
import { attachment } from "./Attachment";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";
import { Div } from "./widget/Div";
import { Comp } from "./widget/base/Comp";

export default class UploadFromUrlDlgImpl extends DialogBaseImpl implements UploadFromUrlDlg {

    uploadFromUrlTextField : TextField;
    uploadButton : Button;

    constructor() {
        super("UploadFromUrlDlg");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header("Upload File Attachment"),
            cnst.SHOW_PATH_IN_DLGS ? new TextContent("Path: " + render.formatPath(attachment.uploadNode), "path-display-in-editor") : null,
            this.uploadFromUrlTextField = new TextField("Upload from URL"),
            new ButtonBar([
                this.uploadButton = new Button("Upload", this.upload),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    upload = (): void => {
        let sourceUrl = this.uploadFromUrlTextField.getValue();

        if (sourceUrl) {
            util.ajax<I.UploadFromUrlRequest, I.UploadFromUrlResponse>("uploadFromUrl", {
                "nodeId": attachment.uploadNode.id,
                "sourceUrl": sourceUrl
            }, this.uploadFromUrlResponse);
        }
    }

    uploadFromUrlResponse = (res: I.UploadFromUrlResponse): void => {
        if (util.checkSuccess("Upload from URL", res)) {
            this.cancel();
            meta64.refresh();
        }
    }
}
