var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: ManageAccountDlg.js");
var ManageAccountDlg = (function (_super) {
    __extends(ManageAccountDlg, _super);
    function ManageAccountDlg() {
        _super.call(this, "ManageAccountDlg");
    }
    ManageAccountDlg.prototype.build = function () {
        var header = this.makeHeader("Manage Account");
        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
        var buttonBar = render.centeredButtonBar(closeAccountButton);
        var bottomButtonBar = render.centeredButtonBar(backButton);
        var bottomButtonBarDiv = render.tag("div", {
            "class": "close-account-bar"
        }, bottomButtonBar);
        return header + buttonBar + bottomButtonBarDiv;
    };
    return ManageAccountDlg;
}(DialogBase));
//# sourceMappingURL=ManageAccountDlg.js.map