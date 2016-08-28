console.log("running module: PrefsDlg.js");

namespace m64 {
    export class PrefsDlg extends DialogBase {
        constructor() {
            super("PrefsDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Peferences");

            var radioButtons = this.makeRadioButton("Simple", "editModeSimple") + //
                this.makeRadioButton("Advanced", "editModeAdvanced");

            var radioButtonGroup = render.tag("paper-radio-group", {
                "id": this.id("simpleModeRadioGroup"),
                "selected": this.id("editModeSimple")
            }, radioButtons);

            let showMetaDataCheckBox = this.makeCheckBox("Show Row Metadata", "showMetaData", meta64.showMetaData);
            var checkboxBar = render.makeHorzControlGroup(showMetaDataCheckBox);

            var formControls = radioButtonGroup;

            var legend = "<legend>Edit Mode:</legend>";
            var radioBar = render.makeHorzControlGroup(legend + formControls);

            var saveButton = this.makeCloseButton("Save", "savePreferencesButton", this.savePreferences, this);
            var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");

            var buttonBar = render.centeredButtonBar(saveButton + backButton);
            return header + radioBar + checkboxBar + buttonBar;
        }

        savePreferences = (): void => {
            var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
            meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE
                : meta64.MODE_ADVANCED;

            //debugger;
            let showMetaDataCheckbox = util.polyElm(this.id("showMetaData"));
            meta64.showMetaData = showMetaDataCheckbox.node.checked;

            //let checked:boolean = $("#"+this.id("showMetaData")).is(":checked");
            //let checked2:boolean = $(showMetaDataCheckbox.node).is(":checked");

            util.json<json.SaveUserPreferencesRequest, json.SaveUserPreferencesResponse>("saveUserPreferences", {
                //todo-0: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
                "userPreferences": {
                    "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED,
                    "editMode": meta64.userPreferences.editMode,
                    /* todo-1: how can I flag a property as optional in TypeScript generator ? Would be probably some kind of json/jackson @required annotation */
                    "lastNode": null,
                    "importAllowed": false,
                    "exportAllowed": false,
                    "showMetaData": meta64.showMetaData
                }
            }, this.savePreferencesResponse, this);
        }

        savePreferencesResponse = (res: json.SaveUserPreferencesResponse): void => {
            if (util.checkSuccess("Saving Preferences", res)) {
                meta64.selectTab("mainTabName");
                meta64.refresh();
                // todo-2: try and maintain scroll position ? this is going to be async, so watch out.
                // view.scrollToSelectedNode();
            }
        }

        init = (): void => {
            //debugger;
            var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
            polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this
                .id("editModeAdvanced"));

            //todo-0: put these two lines in a utility method
            polyElm = util.polyElm(this.id("showMetaData"));
            polyElm.node.checked = meta64.showMetaData;

            Polymer.dom.flush();
        }
    }
}
