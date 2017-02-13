import {DialogBaseImpl} from "./DialogBaseImpl";
import {PrefsDlg} from "./PrefsDlg";
import {render} from "./Render";
import {meta64} from "./Meta64";
import {util} from "./Util";
import * as I from "./Interfaces";

declare var Polymer;

export default class PrefsDlgImpl  extends DialogBaseImpl implements PrefsDlg {
    constructor() {
        super("PrefsDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Peferences");

        let radioButtons = this.makeRadioButton("Simple", "editModeSimple") + //
            this.makeRadioButton("Advanced", "editModeAdvanced");

        let radioButtonGroup = render.tag("paper-radio-group", {
            "id": this.id("simpleModeRadioGroup"),
            "selected": this.id("editModeSimple")
        }, radioButtons);

        let showMetaDataCheckBox = this.makeCheckBox("Show Row Metadata", "showMetaData", meta64.showMetaData);
        let checkboxBar = render.makeHorzControlGroup(showMetaDataCheckBox);

        let formControls = radioButtonGroup;

        let legend = "<legend>Edit Mode:</legend>";
        let radioBar = render.makeHorzControlGroup(legend + formControls);

        let saveButton = this.makeCloseButton("Save", "savePreferencesButton", this.savePreferences, this);
        let backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");

        let buttonBar = render.centeredButtonBar(saveButton + backButton);
        return header + radioBar + checkboxBar + buttonBar;
    }

    savePreferences = (): void => {
        let polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE
            : meta64.MODE_ADVANCED;

        let showMetaDataCheckbox = util.polyElm(this.id("showMetaData"));
        meta64.showMetaData = showMetaDataCheckbox.node.checked;

        util.json<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            //todo-1: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
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

    savePreferencesResponse = (res: I.SaveUserPreferencesResponse): void => {
        if (util.checkSuccess("Saving Preferences", res)) {
            meta64.selectTab("mainTabName");
            meta64.refresh();
            // todo-2: try and maintain scroll position ? this is going to be async, so watch out.
            // view.scrollToSelectedNode();
        }
    }

    init = (): void => {
        let polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this
            .id("editModeAdvanced"));

        //todo-1: put these two lines in a utility method
        polyElm = util.polyElm(this.id("showMetaData"));
        polyElm.node.checked = meta64.showMetaData;

        Polymer.dom.flush();
    }
}
