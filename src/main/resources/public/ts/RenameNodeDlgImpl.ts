import {DialogBaseImpl} from "./DialogBaseImpl";
import {RenameNodeDlg} from "./RenameNodeDlg";
import {render} from "./Render";
import {util} from "./Util";
import {meta64} from "./Meta64";
import {edit} from "./Edit";
import {view} from "./View";
import * as I from "./Interfaces";

export default class RenameNodeDlgImpl  extends DialogBaseImpl implements RenameNodeDlg {
    constructor(args:Object) {
        super("RenameNodeDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Rename Node");

        var curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
        var curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";

        var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");

        var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", this.renameNode, this);
        var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
        var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);

        return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
    }

    renameNode = (): void => {
        var newName = this.getInputVal("newNodeNameEditField");

        if (util.emptyString(newName)) {
            util.showMessage("Please enter a new node name.");
            return;
        }

        var highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            util.showMessage("Select a node to rename.");
            return;
        }

        /* if no node below this node, returns null */
        var nodeBelow = edit.getNodeBelow(highlightNode);

        var renamingRootNode = (highlightNode.id === meta64.currentNodeId);

        var thiz = this;
        util.json<I.RenameNodeRequest, I.RenameNodeResponse>("renameNode", {
            "nodeId": highlightNode.id,
            "newName": newName
        }, function(res: I.RenameNodeResponse) {
            thiz.renameNodeResponse(res, renamingRootNode);
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
        var highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            return;
        }
        this.setInnerHTML("curNodeNameDisplay", "Name: " + highlightNode.name);
        this.setInnerHTML("curNodePathDisplay", "Path: " + highlightNode.path);
    }
}
