console.log("Attachment.ts");

import { meta64 } from "./Meta64";
import { util } from "./Util";
import { Factory } from "./Factory";
import { ConfirmDlg } from "./ConfirmDlg";
import { UploadFromFileDropzoneDlg } from "./UploadFromFileDropzoneDlg";
import { UploadFromUrlDlg } from "./UploadFromUrlDlg";
import * as I from "./Interfaces";

class Attachment {
    /* Node being uploaded to */
    uploadNode: any = null;

    openUploadFromFileDlg(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();
        if (!node) {
            attachment.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        attachment.uploadNode = node;

        Factory.createDefault("UploadFromFileDropzoneDlgImpl", (dlg: UploadFromFileDropzoneDlg) => {
            dlg.open();
        })

        /* Note: To run legacy uploader just put this version of the dialog here, and
        nothing else is required. Server side processing is still in place for it
        (new UploadFromFileDlg()).open();
        */
    }

    openUploadFromUrlDlg(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (!node) {
            attachment.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        attachment.uploadNode = node;

        Factory.createDefault("UploadFromUrlDlgImpl", (dlg: UploadFromUrlDlg) => {
            dlg.open();
        })
    }

    deleteAttachment(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (node) {
            Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
                dlg.open();
            }, {
                    "title": "Confirm Delete Attachment", "message": "Delete the Attachment on the Node?", "buttonText": "Yes, delete.", "yesCallback":
                    () => {
                        util.ajax<I.DeleteAttachmentRequest, I.DeleteAttachmentResponse>("deleteAttachment", {
                            "nodeId": node.id
                        }, (res : I.DeleteAttachmentResponse) : void => { attachment.deleteAttachmentResponse(res, node.uid) });
                    }
                });
        }
    }

    deleteAttachmentResponse(res: I.DeleteAttachmentResponse, uid: string): void {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            // force re-render from local data.
            meta64.goToMainPage(true, true);
        }
    }
}
export let attachment: Attachment = new Attachment();
export default attachment;
