console.log("CreateNodeDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { CreateNodeDlg } from "./CreateNodeDlg";
import { render } from "./Render";
import { meta64 } from "./Meta64";
import { util } from "./Util";
import { edit } from "./Edit";
import * as I from "./Interfaces";
import { tag } from "./Tag";
import { Header } from "./widget/Header";
import { TextContent } from "./widget/TextContent";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { ListBox } from "./widget/ListBox";
import { ListBoxRow } from "./widget/ListBoxRow";

export default class CreateNodeDlgImpl extends DialogBaseImpl implements CreateNodeDlg {

    selType: string = "nt:unstructured";
    inlineButton: Button;

    constructor() {
        super("CreateNodeDlg");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.getComponent().setChildren([
            new Header("Create New Node"),
            new ListBox([
                new ListBoxRow("Standard Type", () => { this.selType = "nt:unstructured"; }, true),
                new ListBoxRow("RSS Feed", () => { this.selType = "meta64:rssfeed"; }, false),
                new ListBoxRow("System Folder", () => { this.selType = "meta64:systemfolder"; }, false)
            ]),
            new ButtonBar([
                new Button("First", this.createFirstChild, null, true, this),
                new Button("Last", this.createLastChild, null, true, this),
                this.inlineButton = new Button("Inline", this.createInline, null, true, this),
                new Button("Cancel", null, null, true, this)
            ])
        ]);
    }

    createFirstChild = (): void => {
        debugger;
        edit.createSubNode(null, this.selType, true);
    }

    createLastChild = (): void => {
        edit.createSubNode(null, this.selType, false);
    }

    createInline = (): void => {
        edit.insertNode(null, this.selType);
    }

    init = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();
        if (node) {
            let canInsertInline: boolean = meta64.homeNodeId != node.id;
            this.inlineButton.setDisplay(canInsertInline);
        }
    }
}
