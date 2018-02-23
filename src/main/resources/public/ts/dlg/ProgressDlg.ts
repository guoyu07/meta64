console.log("ProgressDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { Progress } from "../widget/Progress";
import { Div } from "../widget/Div";

export class ProgressDlg extends DialogBase {

    constructor() {
        super("Processing...", "modal-sm");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Div(null, {
               class : "progress"
            }, [new Progress()])
        ]);
    }
}
