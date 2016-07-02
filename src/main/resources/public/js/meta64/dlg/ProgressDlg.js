var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ProgressDlg.js");
var ProgressDlg = (function (_super) {
    __extends(ProgressDlg, _super);
    function ProgressDlg() {
        _super.call(this, "ProgressDlg");
    }
    ProgressDlg.prototype.build = function () {
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
    };
    return ProgressDlg;
}(DialogBase));
//# sourceMappingURL=ProgressDlg.js.map