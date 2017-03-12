import { DialogBaseImpl } from "./DialogBaseImpl";
import { RenameNodeDlg } from "./RenameNodeDlg";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import { edit } from "./Edit";
import { view } from "./View";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";

export default class RenameNodeDlgImpl extends DialogBaseImpl implements RenameNodeDlg {

    newNameTextField: TextField;

    constructor(args: Object) {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        let highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            return;
        }

        this.setChildren([
            new Header("Rename Node"),
            new TextContent("Name: " + highlightNode.name),
            new TextContent("Path: " + highlightNode.path, "path-display"),
            this.newNameTextField = new TextField("Enter new name for the node"),
            new ButtonBar([
                new Button("Rename", this.renameNode, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
    }

    renameNode = (): void => {
        let newName = this.newNameTextField.getValue();

        if (util.emptyString(newName)) {
            util.showMessage("Please enter a new node name.");
            return;
        }

        let highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            util.showMessage("Select a node to rename.");
            return;
        }

        /* if no node below this node, returns null */
        let nodeBelow = edit.getNodeBelow(highlightNode);

        let renamingRootNode = (highlightNode.id === meta64.currentNodeId);

        util.ajax<I.RenameNodeRequest, I.RenameNodeResponse>("renameNode", {
            "nodeId": highlightNode.id,
            "newName": newName
        }, (res: I.RenameNodeResponse) => {
            this.renameNodeResponse(res, renamingRootNode);
        });
    }

    renameNodeResponse = (res: I.RenameNodeResponse, renamingPageRoot: boolean): void => {
        if (util.checkSuccess("Rename node", res)) {
            if (renamingPageRoot) {
                view.refreshTree(res.newId, true);
            } else {
                view.refreshTree(null, false, res.newId);
            }
            // meta64.selectTab("mainTabName");
        }
    }
}
