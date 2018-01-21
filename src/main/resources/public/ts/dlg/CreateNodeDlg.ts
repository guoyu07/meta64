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
import { Form } from "../widget/Form";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class CreateNodeDlg extends DialogBase {

    selType: string = "nt:unstructured";
    inlineButton: Button;

    constructor() {
        super("Create New Node");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new ListBox({ /* "style": "width:500px;height:500px;" */ }, [
                    new ListBoxRow("Standard Type", () => { this.selType = "nt:unstructured"; }, true),
                    /* Note: the isAdminUser is a temporary hack, and there will be a better way to do this eventually (i.e. types themselves
                       probably will specify what roles of users they are available on or something like that) */
                    !S.meta64.isAdminUser ? null : new ListBoxRow("RSS Feed", () => { this.selType = "sn:rssfeed"; }, false),
                    !S.meta64.isAdminUser ? null : new ListBoxRow("RSS Item", () => { this.selType = "sb:rssitem"; }, false),
                    //!meta64.isAdminUser ? null : new ListBoxRow("System Folder", () => { this.selType = "meta64:systemfolder"; }, false)
                ]),
                new ButtonBar([
                    new Button("First", this.createFirstChild, null, true, this, true, 1500),
                    new Button("Last", this.createLastChild, null, true, this, true, 1500),
                    this.inlineButton = new Button("Inline", this.createInline, null, true, this, true, 1500),
                    new Button("Cancel", null, null, true, this)
                ])
            ])
        ]);
    }

    createFirstChild = (): void => {
        S.edit.createSubNode(null, this.selType, true);
    }

    createLastChild = (): void => {
        S.edit.createSubNode(null, this.selType, false);
    }

    createInline = (): void => {
        S.edit.insertNode(null, this.selType);
    }

    init = (): void => {
        let node: I.NodeInfo = S.meta64.getHighlightedNode();
        if (node) {
            let canInsertInline: boolean = S.meta64.homeNodeId != node.id;
            this.inlineButton.setVisible(canInsertInline);
        }
    }
}
