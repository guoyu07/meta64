
console.log("running module: share.js");

class Share {

    _findSharedNodesResponse=(res)  => {
        srch.searchNodesResponse(res);
    }

    sharingNode: any = null;

    /*
     * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
     */
    editNodeSharing=()  => {
        var node = meta64.getHighlightedNode();

        if (!node) {
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.sharingNode = node;
        (new SharingDlg()).open();
    }

    findSharedNodes=()  => {
        var focusNode = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }

        srch.searchPageTitle = "Shared Nodes";

        util.json("getSharedNodes", {
            "nodeId": focusNode.id
        }, this._findSharedNodesResponse, this);
    }
}

if (!window["share"]) {
    var share: Share = new Share();
}
