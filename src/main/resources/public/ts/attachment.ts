console.log("running module: attachment.js");

namespace m64 {
    export namespace attachment {
        /* Node being uploaded to */
        export let uploadNode: any = null;

        export let openUploadFromFileDlg = function(): void {
            let node:json.NodeInfo = meta64.getHighlightedNode();
            console.log("running m64.namespace version!");
            if (!node) {
                uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }

            uploadNode = node;
            (new UploadFromFileDlg()).open();
        }

        export let openUploadFromUrlDlg = function(): void {
            let node:json.NodeInfo = meta64.getHighlightedNode();

            if (!node) {
                uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }

            uploadNode = node;
            (new UploadFromUrlDlg()).open();
        }

        export let deleteAttachment = function(): void {
            let node:json.NodeInfo = meta64.getHighlightedNode();

            if (node) {
                (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.",
                    function() {
                        util.json<json.DeleteAttachmentRequest, json.DeleteAttachmentResponse>("deleteAttachment", {
                            "nodeId": node.id
                        }, deleteAttachmentResponse, null, node.uid);
                    })).open();
            }
        }

        export let deleteAttachmentResponse = function(res: json.DeleteAttachmentResponse, uid: any): void {
            if (util.checkSuccess("Delete attachment", res)) {
                meta64.removeBinaryByUid(uid);
                // force re-render from local data.
                meta64.goToMainPage(true);
            }
        }
    }
}
