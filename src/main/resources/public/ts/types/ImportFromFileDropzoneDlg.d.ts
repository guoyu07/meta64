import { DialogBase } from "./DialogBase";
import { Button } from "./widget/Button";
import { Div } from "./widget/Div";
import { Form } from "./widget/Form";
export declare class ImportFromFileDropzoneDlg extends DialogBase {
    hiddenInputContaier: Div;
    form: Form;
    uploadButton: Button;
    fileList: Object[];
    dropzone: any;
    constructor();
    buildGUI: () => void;
    upload: () => void;
    configureDropZone: () => void;
    updateFileList: (dropzoneEvt: any) => void;
    runButtonEnablement: (dropzoneEvt: any) => void;
    init: () => void;
}
