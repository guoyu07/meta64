console.log("ProgressDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ProgressDlg } from "./ProgressDlg";
import { Header } from "./widget/Header";
import { Progress } from "./widget/Progress";
import { Div } from "./widget/Div";

export default class ProgressDlgImpl extends DialogBaseImpl implements ProgressDlg {

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Processing..."),
            new Div(null, {
                "style": "width:300px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
                "class": "horizontal center-justified layout"
            }, [new Progress()])
        ]);
    }
}
