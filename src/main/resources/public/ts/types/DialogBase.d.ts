import { Dialog } from "./widget/Dialog";
import { DialogBaseImpl } from "./DialogBaseImpl";
export declare abstract class DialogBase extends Dialog implements DialogBaseImpl {
    built: boolean;
    constructor();
    init: () => void;
    closeEvent: () => void;
    open: () => Promise<Dialog>;
    cancel(): void;
}
