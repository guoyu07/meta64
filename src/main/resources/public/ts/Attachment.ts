console.log("Attachment.ts");

import { ConfirmDlg } from "./ConfirmDlg";
import { UploadFromFileDropzoneDlg } from "./UploadFromFileDropzoneDlg";
import { UploadFromUrlDlg } from "./UploadFromUrlDlg";
import * as I from "./Interfaces";
import { Factory } from "./types/Factory";
import { Util } from "./types/Util";
import { Meta64 } from "./types/Meta64";

console.log("Creating attachment class");

let util: Util;
let meta64: Meta64;

export class Attachment {

    postConstruct = (_f : any) => {
        let f = <Factory>_f;
        util = f.getUtil();
        meta64 = f.getMeta64();
    }

    /* Node being uploaded to */
    uploadNode: any = null;

    openUploadFromFileDlg = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();
        if (!node) {
            this.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        this.uploadNode = node;

        let dlg = new UploadFromFileDropzoneDlg();
        dlg.open();

        /* Note: To run legacy uploader just put this version of the dialog here, and
        nothing else is required. Server side processing is still in place for it
        (new UploadFromFileDlg()).open();
        */
    }

    openUploadFromUrlDlg = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (!node) {
            this.uploadNode = null;
            util.showMessage("No node is selected.");
            return;
        }

        this.uploadNode = node;

        let dlg = new UploadFromUrlDlg();
        dlg.open();
    }

    deleteAttachment = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (node) {
            let dlg = new ConfirmDlg({
                "title": "Confirm Delete Attachment", //
                "message": "Delete the Attachment on the Node?", //
                "buttonText": "Yes, delete.", //
                "yesCallback":
                    () => {
                        util.ajax<I.DeleteAttachmentRequest, I.DeleteAttachmentResponse>("deleteAttachment", {
                            "nodeId": node.id
                        }, (res: I.DeleteAttachmentResponse): void => { this.deleteAttachmentResponse(res, node.uid) });
                    }
            });
            dlg.open();
        }
    }

    deleteAttachmentResponse = (res: I.DeleteAttachmentResponse, uid: string): void => {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            // force re-render from local data.
            meta64.goToMainPage(true, true);
        }
    }
}