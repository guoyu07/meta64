console.log("running module: attachment.js");
var Attachment = (function () {
    function Attachment() {
        this.uploadNode = null;
    }
    Attachment.prototype.openUploadFromFileDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.uploadNode = node;
        (new UploadFromFileDlg()).open();
    };
    Attachment.prototype.openUploadFromUrlDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.uploadNode = node;
        (new UploadFromUrlDlg()).open();
    };
    Attachment.prototype.deleteAttachment = function () {
        var node = meta64.getHighlightedNode();
        var thiz = this;
        if (node) {
            (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                util.json("deleteAttachment", {
                    "nodeId": node.id
                }, thiz.deleteAttachmentResponse, thiz, node.uid);
            })).open();
        }
    };
    Attachment.prototype.deleteAttachmentResponse = function (res, uid) {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            meta64.goToMainPage(true);
        }
    };
    return Attachment;
}());
if (!window["attachment"]) {
    var attachment = new Attachment();
}
//# sourceMappingURL=attachment.js.map