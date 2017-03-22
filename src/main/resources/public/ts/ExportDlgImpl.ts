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

export default class ExportDlgImpl extends DialogBaseImpl implements ExportDlg {

    exportToFileNameTextField: TextField;
    zipRadioButton: RadioButton;
    xmlRadioButton: RadioButton;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Export Node"),
            this.exportToFileNameTextField = new TextField("Export to File Name"),
            new RadioButtonGroup([
                this.xmlRadioButton = new RadioButton("Output to XML", true),
                this.zipRadioButton = new RadioButton("Output to ZIP", false),
            ]),
            new ButtonBar([
                new Button("Export", this.exportNodes, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    exportNodes = (): void => {
        var highlightNode = meta64.getHighlightedNode();
        var targetFileName = this.exportToFileNameTextField.getValue();

        if (util.emptyString(targetFileName)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Please enter a name for the export file." });
            return;
        }

        if (highlightNode) {
            util.ajax<I.ExportRequest, I.ExportResponse>("export", {
                "nodeId": highlightNode.id,
                "targetFileName": targetFileName,
                "exportExt": this.xmlRadioButton.getChecked() ? "xml" : "zip"
            }, this.exportResponse);
        }
    }

    exportResponse = (res: I.ExportResponse): void => {
        if (util.checkSuccess("Export", res)) {
            Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "Export successful." });
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }
}
