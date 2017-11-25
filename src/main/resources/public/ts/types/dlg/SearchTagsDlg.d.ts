import { DialogBase } from "../DialogBase";
import { TextField } from "../widget/TextField";
export declare class SearchTagsDlg extends DialogBase {
    searchTextField: TextField;
    constructor();
    buildGUI: () => void;
    searchTags: () => void;
    searchProperty: (searchProp: any) => void;
    init: () => void;
}
