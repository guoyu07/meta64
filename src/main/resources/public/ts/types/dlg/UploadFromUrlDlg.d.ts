import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
export declare class UploadFromUrlDlg extends DialogBase {
    uploadFromUrlTextField: TextField;
    uploadButton: Button;
    constructor();
    buildGUI: () => void;
    upload: () => void;
    uploadFromUrlResponse: (res: I.UploadFromUrlResponse) => void;
}
