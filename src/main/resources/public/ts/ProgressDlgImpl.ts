console.log("ProgressDlgImpl.ts");

import {DialogBaseImpl} from "./DialogBaseImpl";
import {ProgressDlg} from "./ProgressDlg";
import {render} from  "./Render";
import {tag} from "./Tag";

export default class ProgressDlgImpl extends DialogBaseImpl implements ProgressDlg {

    constructor() {
        super("ProgressDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        var header = this.makeHeader("Processing Request", "", true);

        var progressBar = render.tag("paper-progress", {
            "indeterminate": "indeterminate",
            "value": "800",
            "min": "100",
            "max": "1000"
        });

        var barContainer = tag.div( {
            "style": "width:280px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
            "class": "horizontal center-justified layout"
        }, progressBar);

        return header + barContainer;
    }
}
