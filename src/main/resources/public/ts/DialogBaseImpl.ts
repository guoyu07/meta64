console.log("DialogBaseImpl.ts");

import { DialogImpl } from "./widget/DialogImpl";

export interface DialogBaseImpl {
    init(): void;
    closeEvent(): void;
    open(): Promise<DialogImpl>;
    cancel(): void;
}
