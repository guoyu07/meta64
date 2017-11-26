console.log("AttachmentIntf.ts");

import * as I from "../Interfaces";

export interface AttachmentIntf {
    uploadNode: any;

    postConstruct(_f: any);
    openUploadFromFileDlg(): void;
    openUploadFromUrlDlg(): void;
    deleteAttachment(): void;
    deleteAttachmentResponse(res: I.DeleteAttachmentResponse, uid: string): void;
}