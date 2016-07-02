var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ShareToPersonDlg.js");
var ShareToPersonDlg = (function (_super) {
    __extends(ShareToPersonDlg, _super);
    function ShareToPersonDlg() {
        _super.call(this, "ShareToPersonDlg");
    }
    ShareToPersonDlg.prototype.build = function () {
        var header = this.makeHeader("Share Node to Person");
        var formControls = this.makeEditField("User to Share With", "shareToUserName");
        var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", this.shareNodeToPerson, this);
        var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
        var buttonBar = render.centeredButtonBar(shareButton + backButton);
        return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
            + buttonBar;
    };
    ShareToPersonDlg.prototype.shareNodeToPerson = function () {
        var targetUser = this.getInputVal("shareToUserName");
        if (!targetUser) {
            (new MessageDlg("Please enter a username")).open();
            return;
        }
        meta64.treeDirty = true;
        var thiz = this;
        util.json("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": targetUser,
            "privileges": ["read", "write", "addChildren", "nodeTypeManagement"]
        }, thiz.reloadFromShareWithPerson);
    };
    ShareToPersonDlg.prototype.reloadFromShareWithPerson = function (res) {
        if (util.checkSuccess("Share Node with Person", res)) {
            (new SharingDlg()).open();
        }
    };
    return ShareToPersonDlg;
}(DialogBase));
//# sourceMappingURL=ShareToPersonDlg.js.map