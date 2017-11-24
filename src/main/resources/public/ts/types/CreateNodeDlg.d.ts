import { DialogBase } from "./DialogBase";
import { Button } from "./widget/Button";
export declare class CreateNodeDlg extends DialogBase {
    selType: string;
    inlineButton: Button;
    constructor();
    buildGUI: () => void;
    createFirstChild: () => void;
    createLastChild: () => void;
    createInline: () => void;
    init: () => void;
}
