import { DialogBaseImpl } from "./DialogBaseImpl";
import { RenameNodeDlg } from "./RenameNodeDlg";
import { render } from "./Render";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import { edit } from "./Edit";
import { view } from "./View";
import * as I from "./Interfaces";

export default class RenameNodeDlgImpl extends DialogBaseImpl implements RenameNodeDlg {
    constructor(args: Object) {
        super("RenameNodeDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Rename Node");

        let curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
        let curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";

        let formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");

        let renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", this.renameNode.bind(this));
        let backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
        let buttonBar = render.centeredButtonBar(renameNodeButton + backButton);

        return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
    }

    renameNode = (): void => {
        let newName = this.getInputVal("newNodeNameEditField");

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

    init = (): void => {
        let highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            return;
        }
        this.setInnerHTML("curNodeNameDisplay", "Name: " + highlightNode.name);
        this.setInnerHTML("curNodePathDisplay", "Path: " + highlightNode.path);
    }
}
