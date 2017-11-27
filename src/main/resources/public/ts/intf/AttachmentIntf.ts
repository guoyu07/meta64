console.log("AttachmentIntf.ts");

import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface AttachmentIntf {
    uploadNode: any;

    openUploadFromFileDlg(): void;
    openUploadFromUrlDlg(): void;
    deleteAttachment(): void;
    deleteAttachmentResponse(res: I.DeleteAttachmentResponse, uid: string): void;
}