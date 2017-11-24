import { DialogBase } from "./DialogBase";
import * as I from "./Interfaces";
import { RadioButton } from "./widget/RadioButton";
export declare class ExportDlg extends DialogBase {
    zipRadioButton: RadioButton;
    mdRadioButton: RadioButton;
    pdfRadioButton: RadioButton;
    constructor();
    buildGUI: () => void;
    exportNodes: () => void;
    getSelectedFormat: () => string;
    exportResponse: (res: I.ExportResponse) => void;
}
