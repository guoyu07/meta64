console.log("ExportDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ExportDlg } from "./ExportDlg";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { view } from "./View";
import { Factory } from "./Factory";
import { MessageDlg } from "./MessageDlg";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { Help } from "./widget/Help";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { RadioButton } from "./widget/RadioButton";
import { RadioButtonGroup } from "./widget/RadioButtonGroup";
import { Anchor } from "./widget/Anchor";
import { VerticalLayout } from "./widget/VerticalLayout";

export default class ExportDlgImpl extends DialogBaseImpl implements ExportDlg {

    zipRadioButton: RadioButton;
    mdRadioButton: RadioButton;
    //pdfRadioButton: RadioButton;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Export Node"),
            new RadioButtonGroup([
                this.zipRadioButton = new RadioButton("ZIP", false),
                this.mdRadioButton = new RadioButton("MD (Markdown)", false),
                //this.pdfRadioButton = new RadioButton("PDF", false),
            ]),
            new ButtonBar([
                new Button("Export", this.exportNodes, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    exportNodes = (): void => {
        var highlightNode = meta64.getHighlightedNode();
        if (highlightNode) {
            util.ajax<I.ExportRequest, I.ExportResponse>("export", {
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
        // else if (this.pdfRadioButton.getChecked()) {
        //     ret = "pdf";
        // }
        return ret;
    }

    exportResponse = (res: I.ExportResponse): void => {
        let hostAndPort: string = util.getHostAndPort();
        if (util.checkSuccess("Export", res)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            },
                {
                    "message": "Export successful.",
                    "customWidget": new VerticalLayout([
                        new Anchor(hostAndPort + "/file/" + res.fileName + "?disp=inline", "Raw View", { "target": "_blank" }),
                        //new Anchor(hostAndPort + "/view/" + res.fileName, "Formatted View", { "target": "_blank" }),
                        new Anchor(hostAndPort + "/file/" + res.fileName + "?disp=attachment", "Download", null)
                    ])
                });
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }
}
