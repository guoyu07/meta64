console.log("DialogBase.ts");

import { Dialog } from "./widget/Dialog";

export interface DialogBase {
    init(): void;
    closeEvent(): void;
    open(): Promise<Dialog>;
    cancel(): void;
}
