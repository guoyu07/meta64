console.log("AttachmentIntf.ts");

import * as I from "../Interfaces";

export interface AttachmentIntf {

    postConstruct (_f : any) ;

    /* Node being uploaded to */
    uploadNode: any;

    openUploadFromFileDlg(): void ;

    openUploadFromUrlDlg(): void ;
    deleteAttachment(): void ;

    deleteAttachmentResponse(res: I.DeleteAttachmentResponse, uid: string): void ;
}