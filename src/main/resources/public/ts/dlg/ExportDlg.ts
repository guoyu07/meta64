console.log("ExportDlgImpl.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { MessageDlg } from "./MessageDlg";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { RadioButton } from "../widget/RadioButton";
import { RadioButtonGroup } from "../widget/RadioButtonGroup";
import { Anchor } from "../widget/Anchor";
import { VerticalLayout } from "../widget/VerticalLayout";
import { UtilIntf as Util} from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class ExportDlg extends DialogBase {

    zipRadioButton: RadioButton;
    mdRadioButton: RadioButton;
    pdfRadioButton: RadioButton;

    constructor() {
        super("Export", "modal-md");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Export Node"),
            new RadioButtonGroup([
                this.zipRadioButton = new RadioButton("ZIP", false, "exportTypeGroup"),
                this.mdRadioButton = new RadioButton("MD (Markdown)", false, "exportTypeGroup"),
                //had to disable PDF, because PDFBox hangs in Java, and until they fix that bug
                //there's nothing i can do other than ditch PDF box completely, which i'm not ready to do yet.
                //this.pdfRadioButton = new RadioButton("PDF", false),
            ]),
            new ButtonBar([
                new Button("Export", this.exportNodes, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    exportNodes = (): void => {
        var highlightNode = S.meta64.getHighlightedNode();
        if (highlightNode) {
            S.util.ajax<I.ExportRequest, I.ExportResponse>("export", {
                "nodeId": highlightNode.id,
                "exportExt": this.getSelectedFormat()
            }, (res: I.ExportResponse) => {
                this.exportResponse(res);
            });
        }
    }

    getSelectedFormat = (): string => {
        let ret = "";
        if (this.zipRadioButton.getChecked()) {
            ret = "zip";
        }
        else if (this.mdRadioButton.getChecked()) {
            ret = "md";
        }
        else if (this.pdfRadioButton.getChecked()) {
            ret = "pdf";
        }
        return ret;
    }

    exportResponse = (res: I.ExportResponse): void => {
        let hostAndPort: string = S.util.getHostAndPort();
        if (S.util.checkSuccess("Export", res)) {
            new MessageDlg({
                "message": "Export successful.",
                "customWidget": new VerticalLayout([
                    new Anchor(hostAndPort + "/file/" + res.fileName + "?disp=inline", "Raw View", { "target": "_blank" }),
                    //new Anchor(hostAndPort + "/view/" + res.fileName, "Formatted View", { "target": "_blank" }),
                    new Anchor(hostAndPort + "/file/" + res.fileName + "?disp=attachment", "Download", null)
                ])
            }).open();
            S.meta64.selectTab("mainTab");
            S.view.scrollToSelectedNode();
        }
    }
}
