var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: SharingDlg.js");
var SharingDlg = (function (_super) {
    __extends(SharingDlg, _super);
    function SharingDlg() {
        _super.call(this, "SharingDlg");
    }
    SharingDlg.prototype.build = function () {
        var header = this.makeHeader("Node Sharing");
        var shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton", this.shareNodeToPersonPg, this);
        var makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", this.shareNodeToPublic, this);
        var backButton = this.makeCloseButton("Close", "closeSharingButton");
        var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
        var width = window.innerWidth * 0.6;
        var height = window.innerHeight * 0.4;
        var internalMainContent = "<div id='" + this.id("shareNodeNameDisplay") + "'></div>" +
            "<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
            + this.id("sharingListFieldContainer") + "'></div>";
        return header + internalMainContent + buttonBar;
    };
    SharingDlg.prototype.init = function () {
        this.reload();
    };
    SharingDlg.prototype.reload = function () {
        console.log("Loading node sharing info.");
        util.json("getNodePrivileges", {
            "nodeId": share.sharingNode.id,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse, this);
    };
    SharingDlg.prototype.getNodePrivilegesResponse = function (res) {
        this.populateSharingPg(res);
    };
    SharingDlg.prototype.populateSharingPg = function (res) {
        var html = "";
        var This = this;
        $.each(res.aclEntries, function (index, aclEntry) {
            html += "<h4>User: " + aclEntry.principalName + "</h4>";
            html += render.tag("div", {
                "class": "privilege-list"
            }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
        });
        var thiz = this;
        var publicAppendAttrs = {
            "onClick": "meta64.getObjectByGuid(" + thiz.guid + ").publicCommentingChanged();",
            "name": "allowPublicCommenting",
            "id": this.id("allowPublicCommenting")
        };
        if (res.publicAppend) {
            publicAppendAttrs["checked"] = "checked";
        }
        html += render.tag("paper-checkbox", publicAppendAttrs, "", false);
        html += render.tag("label", {
            "for": this.id("allowPublicCommenting")
        }, "Allow public commenting under this node.", true);
        util.setHtmlEnhanced(this.id("sharingListFieldContainer"), html);
    };
    SharingDlg.prototype.publicCommentingChanged = function () {
        var thiz = this;
        setTimeout(function () {
            var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));
            meta64.treeDirty = true;
            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "publicAppend": polyElm.node.checked ? "true" : "false"
            });
        }, 250);
    };
    SharingDlg.prototype.removePrivilege = function (principal, privilege) {
        meta64.treeDirty = true;
        util.json("removePrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": principal,
            "privilege": privilege
        }, this.removePrivilegeResponse, this);
    };
    SharingDlg.prototype.removePrivilegeResponse = function (res) {
        util.json("getNodePrivileges", {
            "nodeId": share.sharingNode.path,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse, this);
    };
    SharingDlg.prototype.renderAclPrivileges = function (principal, aclEntry) {
        var ret = "";
        var thiz = this;
        $.each(aclEntry.privileges, function (index, privilege) {
            var removeButton = thiz.makeButton("Remove", "removePrivButton", "meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
                + "');");
            var row = render.makeHorizontalFieldSet(removeButton);
            row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";
            ret += render.tag("div", {
                "class": "privilege-entry"
            }, row);
        });
        return ret;
    };
    SharingDlg.prototype.shareNodeToPersonPg = function () {
        (new ShareToPersonDlg()).open();
    };
    SharingDlg.prototype.shareNodeToPublic = function () {
        console.log("Sharing node to public.");
        meta64.treeDirty = true;
        util.json("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": "everyone",
            "privileges": ["read"]
        }, this.reload, this);
    };
    return SharingDlg;
}(DialogBase));
//# sourceMappingURL=SharingDlg.js.map