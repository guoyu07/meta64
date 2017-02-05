console.log("Attachment.ts");

import {meta64} from "./Meta64";
import {util} from "./Util";
import {Factory} from "./Factory";
import {ConfirmDlg} from "./ConfirmDlg";
import {UploadFromFileDropzoneDlg} from "./UploadFromFileDropzoneDlg";
import {UploadFromUrlDlg} from "./UploadFromUrlDlg";
import * as I from "./Interfaces";

class Attachment {
    /* Node being uploaded to */
    uploadNode: any = null;

    openUploadFromFileDlg = function(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();
        if (!node) {
            attachment.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        attachment.uploadNode = node;

        Factory.create("UploadFromFileDropzoneDlg", (dlg: UploadFromFileDropzoneDlg) => {
          dlg.open();
        })

        /* Note: To run legacy uploader just put this version of the dialog here, and
        nothing else is required. Server side processing is still in place for it
        (new UploadFromFileDlg()).open();
        */
    }

    openUploadFromUrlDlg = function(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (!node) {
            attachment.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        attachment.uploadNode = node;

        Factory.create("UploadFromUrlDlg", (dlg: UploadFromUrlDlg) => {
          dlg.open();
        })
    }

    deleteAttachment = function(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (node) {
          Factory.create("ConfirmDlg", (dlg: ConfirmDlg) => {
              dlg.open();
          }, {
                  "title": "Confirm Delete Attachment", "message": "Delete the Attachment on the Node?", "buttonText": "Yes, delete.", "yesCallback":
                  function() {
                    util.json<I.DeleteAttachmentRequest, I.DeleteAttachmentResponse>("deleteAttachment", {
                               "nodeId": node.id
                           }, attachment.deleteAttachmentResponse, null, node.uid);
                  }
              });
        }
    }

    deleteAttachmentResponse = function(res: I.DeleteAttachmentResponse, uid: any): void {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            // force re-render from local data.
            meta64.goToMainPage(true);
        }
    }
}
export let attachment: Attachment = new Attachment();
export default attachment;
