console.log("running module: user.js");
var Share = (function () {
    function Share() {
        this.sharingNode = null;
    }
    Share.prototype._findSharedNodesResponse = function (res) {
        srch.searchNodesResponse(res);
    };
    Share.prototype.editNodeSharing = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.sharingNode = node;
        (new SharingDlg()).open();
    };
    Share.prototype.findSharedNodes = function () {
        var focusNode = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }
        srch.searchPageTitle = "Shared Nodes";
        util.json("getSharedNodes", {
            "nodeId": focusNode.id
        }, this._findSharedNodesResponse, this);
    };
    return Share;
}());
if (!window["share"]) {
    var share = new Share();
}
//# sourceMappingURL=share.js.map