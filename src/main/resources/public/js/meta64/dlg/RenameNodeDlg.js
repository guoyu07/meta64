console.log("running module: RenameNodeDlg.js");
var RenameNodeDlg = function () {
    Dialog.call(this);
    this.domId = "RenameNodeDlg";
};
var RenameNodeDlg_ = util.inherit(Dialog, RenameNodeDlg);
RenameNodeDlg_.build = function () {
    var header = this.makeHeader("Rename Node");
    var curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
    var curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";
    var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");
    var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", RenameNodeDlg_.renameNode, this);
    var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
    var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);
    return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
};
RenameNodeDlg_.renameNode = function () {
    var newName = this.getInputVal("newNodeNameEditField");
    if (util.emptyString(newName)) {
        (new MessageDlg("Please enter a new node name.")).open();
        return;
    }
    var highlightNode = meta64.getHighlightedNode();
    if (!highlightNode) {
        (new MessageDlg("Select a node to rename.")).open();
        return;
    }
    var nodeBelow = edit.getNodeBelow(highlightNode);
    var renamingRootNode = (highlightNode.id === meta64.currentNodeId);
    var ironRes = util.json("renameNode", {
        "nodeId": highlightNode.id,
        "newName": newName
    });
    var This = this;
    ironRes.completes.then(function () {
        This.renameNodeResponse(ironRes.response, renamingRootNode);
    });
};
RenameNodeDlg_.renameNodeResponse = function (res, renamingPageRoot) {
    if (util.checkSuccess("Rename node", res)) {
        if (renamingPageRoot) {
            view.refreshTree(res.newId, true);
        }
        else {
            view.refreshTree(null, false, res.newId);
        }
    }
};
RenameNodeDlg_.init = function () {
    var highlightNode = meta64.getHighlightedNode();
    if (!highlightNode) {
        return;
    }
    $("#" + this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
    $("#" + this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
};
//# sourceMappingURL=RenameNodeDlg.js.map