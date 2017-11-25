import * as I from "../Interfaces";
import { DialogBase } from "../DialogBase";
import { Button } from "../widget/Button";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Div } from "../widget/Div";
import { Help } from "../widget/Help";
import { EditPropsTableRow } from "../widget/EditPropsTableRow";
export declare class EditNodeDlg extends DialogBase {
    header: Header;
    buttonBar: ButtonBar;
    pathDisplay: Div;
    help: Help;
    propertyEditFieldContainer: Div;
    saveNodeButton: Button;
    addPropertyButton: Button;
    addTagsPropertyButton: Button;
    splitContentButton: Button;
    deletePropButton: Button;
    cancelButton: Button;
    contentFieldDomId: string;
    propEntries: Array<I.PropEntry>;
    editPropertyDlgInst: any;
    typeName: string;
    createAtTop: boolean;
    constructor(args: Object);
    buildGUI: () => void;
    populateEditNodePg: () => void;
    toggleShowReadOnly: () => void;
    addProperty: () => void;
    addTagsProperty: () => void;
    addTagsPropertyResponse(res: I.SavePropertyResponse): void;
    savePropertyResponse(res: any): void;
    addSubProperty: (fieldId: string) => void;
    deleteProperty(propName: string): void;
    deletePropertyImmediate: (propName: string) => void;
    deletePropertyResponse: (res: any, propertyToDelete: any) => void;
    saveNode: () => void;
    saveNewNode: (newNodeName?: string) => void;
    saveExistingNode: () => void;
    encryptIfPassword: (prop: I.PropEntry, val: string) => Promise<string>;
    makeSinglePropEditor: (tableRow: EditPropsTableRow, propEntry: I.PropEntry, aceFields: any) => void;
    deletePropertyButtonClick: () => void;
    splitContent: () => void;
    splitContentResponse: (res: I.SplitNodeResponse) => void;
    cancelEdit: () => void;
    init: () => void;
}
