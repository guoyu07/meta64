var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: PrefsDlg.js");
var PrefsDlg = (function (_super) {
    __extends(PrefsDlg, _super);
    function PrefsDlg() {
        _super.call(this, "PrefsDlg");
    }
    PrefsDlg.prototype.build = function () {
        var header = this.makeHeader("Account Peferences");
        var radioButtons = this.makeRadioButton("Simple", "editModeSimple") +
            this.makeRadioButton("Advanced", "editModeAdvanced");
        var radioButtonGroup = render.tag("paper-radio-group", {
            "id": this.id("simpleModeRadioGroup"),
            "selected": this.id("editModeSimple")
        }, radioButtons);
        var formControls = radioButtonGroup;
        var legend = "<legend>Edit Mode:</legend>";
        var radioBar = render.makeHorzControlGroup(legend + formControls);
        var saveButton = this.makeCloseButton("Save", "savePreferencesButton", this.savePreferences, this);
        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var buttonBar = render.centeredButtonBar(saveButton + backButton);
        return header + radioBar + buttonBar;
    };
    PrefsDlg.prototype.savePreferences = function () {
        var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE
            : meta64.MODE_ADVANCED;
        util.json("saveUserPreferences", {
            "userPreferences": {
                "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED
            }
        }, this.savePreferencesResponse, this);
    };
    PrefsDlg.prototype.savePreferencesResponse = function (res) {
        if (util.checkSuccess("Saving Preferences", res)) {
            meta64.selectTab("mainTabName");
            meta64.refresh();
        }
    };
    PrefsDlg.prototype.init = function () {
        var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this
            .id("editModeAdvanced"));
        Polymer.dom.flush();
    };
    return PrefsDlg;
}(DialogBase));
//# sourceMappingURL=PrefsDlg.js.map