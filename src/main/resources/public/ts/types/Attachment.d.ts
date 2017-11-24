import * as I from "./Interfaces";
export declare class Attachment {
    postConstruct: (_f: any) => void;
    uploadNode: any;
    openUploadFromFileDlg: () => void;
    openUploadFromUrlDlg: () => void;
    deleteAttachment: () => void;
    deleteAttachmentResponse: (res: I.DeleteAttachmentResponse, uid: string) => void;
}
