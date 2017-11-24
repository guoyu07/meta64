import { DialogBase } from "./DialogBase";
import * as I from "./Interfaces";
import { TextContent } from "./widget/TextContent";
import { Textarea } from "./widget/Textarea";
export declare class EditPropertyDlg extends DialogBase {
    editPropertyPathDisplay: TextContent;
    propertyNameTextarea: Textarea;
    propertyValTextarea: Textarea;
    private editNodeDlg;
    constructor(args: any);
    buildGUI: () => void;
    populatePropertyEdit: () => void;
    saveProperty: () => void;
    savePropertyResponse: (res: I.SavePropertyResponse) => void;
    init: () => void;
}
