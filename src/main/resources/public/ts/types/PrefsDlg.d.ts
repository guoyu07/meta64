import { DialogBase } from "./DialogBase";
import * as I from "./Interfaces";
import { RadioButton } from "./widget/RadioButton";
import { Checkbox } from "./widget/Checkbox";
export declare class PrefsDlg extends DialogBase {
    simpleRadioButton: RadioButton;
    advancedRadioButton: RadioButton;
    showMetadataCheckBox: Checkbox;
    constructor();
    buildGUI: () => void;
    savePreferences: () => void;
    savePreferencesResponse: (res: I.SaveUserPreferencesResponse) => void;
}
