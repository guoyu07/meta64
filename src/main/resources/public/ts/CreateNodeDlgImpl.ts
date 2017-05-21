console.log("CreateNodeDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { CreateNodeDlg } from "./CreateNodeDlg";
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
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Create New Node"),
            new ListBox({"style" : "width:500px;height:500px;"}, [
                new ListBoxRow("Standard Type", () => { this.selType = "nt:unstructured"; }, true),
                /* Note: the isAdminUser is a temporary hack, and there will be a better way to do this eventually (i.e. types themselves
                   probably will specify what roles of users they are available on or something like that) */
                !meta64.isAdminUser ? null : new ListBoxRow("RSS Feed(a)", () => { this.selType = "meta64:rssfeed"; }, false),
                !meta64.isAdminUser ? null : new ListBoxRow("RSS Item", () => { this.selType = "meta64:rssitem"; }, false),
                !meta64.isAdminUser ? null : new ListBoxRow("System Folder", () => { this.selType = "meta64:systemfolder"; }, false)
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
            this.inlineButton.setVisible(canInsertInline);
        }
    }
}
