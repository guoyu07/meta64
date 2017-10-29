import { DialogBaseImpl } from "./DialogBaseImpl";
import { PrefsDlg } from "./PrefsDlg";
import { meta64 } from "./Meta64";
import { util } from "./Util";
import * as I from "./Interfaces";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { RadioButton } from "./widget/RadioButton";
import { RadioButtonGroup } from "./widget/RadioButtonGroup";
import { Checkbox } from "./widget/Checkbox";
import { Legend } from "./widget/Legend";
import { Div } from "./widget/Div";

export default class PrefsDlgImpl extends DialogBaseImpl implements PrefsDlg {

    simpleRadioButton: RadioButton;
    advancedRadioButton: RadioButton;
    showMetadataCheckBox: Checkbox;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Preferences"),
            new Div(null, null, [
                new Legend("Edit Mode:"),
                new RadioButtonGroup([
                    this.simpleRadioButton = new RadioButton("Simple", meta64.editModeOption == meta64.MODE_SIMPLE),
                    this.advancedRadioButton = new RadioButton("Advanced", meta64.editModeOption == meta64.MODE_ADVANCED),
                ]),
            ]),
            new Div(null, null, [
                this.showMetadataCheckBox = new Checkbox("Show Row Metadata", meta64.showMetaData),
            ]),
            new Div(null, null, [
                new ButtonBar([
                    new Button("Save", this.savePreferences, null, true, this),
                    new Button("Cancel", null, null, true, this)
                ])
            ])
        ]);
    }

    savePreferences = (): void => {
        meta64.editModeOption = this.simpleRadioButton.getChecked() ? meta64.MODE_SIMPLE
            : meta64.MODE_ADVANCED;
        meta64.showMetaData = this.showMetadataCheckBox.getChecked();

        util.ajax<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            //todo-1: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
            "userPreferences": {
                "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED,
                "editMode": meta64.userPreferences.editMode,
                /* todo-1: how can I flag a property as optional in TypeScript generator ? Would be probably some kind of json/jackson @required annotation */
                "importAllowed": false,
                "exportAllowed": false,
                "showMetaData": meta64.showMetaData
            }
        }, this.savePreferencesResponse);
    }

    savePreferencesResponse = (res: I.SaveUserPreferencesResponse): void => {
        if (util.checkSuccess("Saving Preferences", res)) {
            meta64.selectTab("mainTabName");
            meta64.refresh();
        }
    }
}
