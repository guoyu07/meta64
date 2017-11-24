console.log("DialogBaseImpl.ts");

// import { Div } from "./widget/Div";
// import { Comp } from "./widget/base/Comp";
import { DialogImpl } from "./widget/DialogImpl";

export interface DialogBaseImpl {
   // constructor();
    init(): void;
    closeEvent(): void;
    open(): Promise<DialogImpl>;
    cancel(): void;
}
