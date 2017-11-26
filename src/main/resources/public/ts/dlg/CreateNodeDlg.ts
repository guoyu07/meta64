console.log("CreateNodeDlg.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { TextContent } from "../widget/TextContent";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { ListBox } from "../widget/ListBox";
import { ListBoxRow } from "../widget/ListBoxRow";
import { Dialog } from "../widget/Dialog";
import { Meta64 } from "../Meta64";
import { DialogBaseImpl } from "../DialogBaseImpl";

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, util, edit, tag;

export class CreateNodeDlg extends DialogBase {

    selType: string = "nt:unstructured";
    inlineButton: Button;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Create New Node"),
            new ListBox({ "style": "width:500px;height:500px;" }, [
                new ListBoxRow("Standard Type", () => { this.selType = "nt:unstructured"; }, true),
                /* Note: the isAdminUser is a temporary hack, and there will be a better way to do this eventually (i.e. types themselves
                   probably will specify what roles of users they are available on or something like that) */
                !meta64.isAdminUser ? null : new ListBoxRow("RSS Feed", () => { this.selType = "sn:rssfeed"; }, false),
                !meta64.isAdminUser ? null : new ListBoxRow("RSS Item", () => { this.selType = "sb:rssitem"; }, false),
                //!meta64.isAdminUser ? null : new ListBoxRow("System Folder", () => { this.selType = "meta64:systemfolder"; }, false)
            ]),
            new ButtonBar([
                new Button("First", this.createFirstChild, null, true, this, true, 1500),
                new Button("Last", this.createLastChild, null, true, this, true, 1500),
                this.inlineButton = new Button("Inline", this.createInline, null, true, this, true, 1500),
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
