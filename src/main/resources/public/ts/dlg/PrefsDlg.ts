import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { RadioButton } from "../widget/RadioButton";
import { RadioButtonGroup } from "../widget/RadioButtonGroup";
import { Checkbox } from "../widget/Checkbox";
import { Legend } from "../widget/Legend";
import { Div } from "../widget/Div";
import { UtilIntf as Util } from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { HeaderRe } from "../widget/HeaderRe";
import { Form } from "../widget/Form";
import { Constants as cnst } from "../Constants";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class PrefsDlg extends DialogBase {

    simpleRadioButton: RadioButton;
    advancedRadioButton: RadioButton;
    showMetadataCheckBox: Checkbox;
    showPathCheckBox: Checkbox;

    constructor() {
        super("Preferences");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new Div(null, {
                    "class": "form-group"
                },
                    [
                        this.simpleRadioButton = new RadioButton("Simple", S.meta64.editModeOption == S.meta64.MODE_SIMPLE, "exportRadioGroup"),
                        this.advancedRadioButton = new RadioButton("Advanced", S.meta64.editModeOption == S.meta64.MODE_ADVANCED, "exportRadioGroup"),
                    ]
                ),
                new Div(null, {
                    "class": "form-group"
                },
                    [
                        this.showMetadataCheckBox = new Checkbox("Show Row Metadata", S.meta64.showMetaData),
                        this.showPathCheckBox = new Checkbox("Show Path", S.meta64.showPath),
                    ]
                ),
                new ButtonBar(
                    [
                        new Button("Save", this.savePreferences, null, true, this),
                        new Button("Cancel", null, null, true, this)
                    ])

            ])
        ]);
    }

    savePreferences = (): void => {
        S.meta64.editModeOption = this.simpleRadioButton.getChecked() ? S.meta64.MODE_SIMPLE
            : S.meta64.MODE_ADVANCED;
            S.meta64.showMetaData = this.showMetadataCheckBox.getChecked();
            S.meta64.showPath = this.showPathCheckBox.getChecked();

            S.util.ajax<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            //todo-1: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
            "userPreferences": {
                "advancedMode": S.meta64.editModeOption === S.meta64.MODE_ADVANCED,
                "editMode": S.meta64.userPreferences.editMode,
                /* todo-1: how can I flag a property as optional in TypeScript generator ? Would be probably some kind of json/jackson @required annotation */
                "importAllowed": false,
                "exportAllowed": false,
                "showMetaData": S.meta64.showMetaData,
                "showPath": S.meta64.showPath
            }
        }, this.savePreferencesResponse);
    }

    savePreferencesResponse = (res: I.SaveUserPreferencesResponse): void => {
        if (S.util.checkSuccess("Saving Preferences", res)) {
            S.meta64.selectTab("mainTab");
            S.meta64.refresh();
        }
    }
}
