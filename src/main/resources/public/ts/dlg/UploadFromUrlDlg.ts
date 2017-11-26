import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Div } from "../widget/Div";
import { Comp } from "../widget/base/Comp";
import { Constants } from "../Constants";
import { Meta64Intf as Meta64 } from "../intf/Meta64Intf";
import { UtilIntf as Util } from "../intf/UtilIntf";
import { AttachmentIntf as Attachment } from "../intf/AttachmentIntf";
import { RenderIntf as Render } from "../intf/RenderIntf";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let meta64: Meta64;
let util: Util;
let attachment: Attachment;
let render: Render;

debugger;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    debugger;
    meta64 = ctx.meta64;
    util = ctx.util;
    attachment = ctx.attachment;
    render = ctx.render;
});

export class UploadFromUrlDlg extends DialogBase {

    uploadFromUrlTextField: TextField;
    uploadButton: Button;

    constructor() {
        super();
        debugger;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Upload File"),
            Constants.SHOW_PATH_IN_DLGS ? new TextContent("Path: " + attachment.uploadNode.path, "path-display-in-editor") : null,
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
            //todo-0: hacked out template params for circular ref
            util.ajax /* <I.UploadFromUrlRequest, I.UploadFromUrlResponse> */("uploadFromUrl", {
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
