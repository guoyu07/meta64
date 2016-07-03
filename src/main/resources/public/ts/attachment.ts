
console.log("running module: attachment.js");

class Attachment {

    /* Node being uploaded to */
    uploadNode: any = null;

    openUploadFromFileDlg() :void{
        var node = meta64.getHighlightedNode();

        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }

        this.uploadNode = node;
        (new UploadFromFileDlg()).open();
    }

    openUploadFromUrlDlg() :void{
        var node = meta64.getHighlightedNode();

        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }

        this.uploadNode = node;
        (new UploadFromUrlDlg()).open();
    }

    deleteAttachment() :void {
        var node = meta64.getHighlightedNode();
        var thiz: Attachment = this;
        if (node) {
            (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.",
                function() {
                    util.json("deleteAttachment", {
                        "nodeId": node.id
                    }, thiz.deleteAttachmentResponse, thiz, node.uid);
                })).open();
        }
    }

    deleteAttachmentResponse(res: any, uid: any)  :void{
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            // force re-render from local data.
            meta64.goToMainPage(true);
        }
    }
}

if (!window["attachment"]) {
    var attachment: Attachment = new Attachment();
}
