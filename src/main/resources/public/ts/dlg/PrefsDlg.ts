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

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    util = ctx.util;
});

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64;

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
                        this.simpleRadioButton = new RadioButton("Simple", meta64.editModeOption == meta64.MODE_SIMPLE, "exportRadioGroup"),
                        this.advancedRadioButton = new RadioButton("Advanced", meta64.editModeOption == meta64.MODE_ADVANCED, "exportRadioGroup"),
                    ]
                ),
                new Div(null, {
                    "class": "form-group"
                },
                    [
                        this.showMetadataCheckBox = new Checkbox("Show Row Metadata", meta64.showMetaData),
                        this.showPathCheckBox = new Checkbox("Show Path", meta64.showPath),
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
        meta64.editModeOption = this.simpleRadioButton.getChecked() ? meta64.MODE_SIMPLE
            : meta64.MODE_ADVANCED;
        meta64.showMetaData = this.showMetadataCheckBox.getChecked();
        meta64.showPath = this.showPathCheckBox.getChecked();

        util.ajax<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            //todo-1: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
            "userPreferences": {
                "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED,
                "editMode": meta64.userPreferences.editMode,
                /* todo-1: how can I flag a property as optional in TypeScript generator ? Would be probably some kind of json/jackson @required annotation */
                "importAllowed": false,
                "exportAllowed": false,
                "showMetaData": meta64.showMetaData,
                "showPath": meta64.showPath
            }
        }, this.savePreferencesResponse);
    }

    savePreferencesResponse = (res: I.SaveUserPreferencesResponse): void => {
        if (util.checkSuccess("Saving Preferences", res)) {
            meta64.selectTab("mainTab");
            meta64.refresh();
        }
    }
}
