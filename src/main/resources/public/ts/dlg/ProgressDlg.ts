console.log("running module: ProgressDlg.js");

class ProgressDlg extends DialogBase {

    constructor() {
        super("ProgressDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Processing Request", "", true);

        var progressBar = render.tag("paper-progress", {
            "indeterminate": "indeterminate",
            "value": "800",
            "min": "100",
            "max": "1000"
        });

        var barContainer = render.tag("div", {
            "style": "width:280px; margin:24px;",
            "class": "horizontal center-justified layout"
        }, progressBar);

        return header + barContainer;
    }
}
