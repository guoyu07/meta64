import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Div } from "../widget/Div";
import { Comp } from "../widget/base/Comp";
import { Constants as cnst} from "../Constants";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, attachment, render; 

export class UploadFromUrlDlg extends DialogBase {

    uploadFromUrlTextField : TextField;
    uploadButton : Button;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Upload File"),
            cnst.SHOW_PATH_IN_DLGS ? new TextContent("Path: " + attachment.uploadNode.path, "path-display-in-editor") : null,
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
            util.ajax /* <I.UploadFromUrlRequest, I.UploadFromUrlResponse> */ ("uploadFromUrl", {
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
