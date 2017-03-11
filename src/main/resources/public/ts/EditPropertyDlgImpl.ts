console.log("EditPropertyDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { EditPropertyDlg } from "./EditPropertyDlg";
import { cnst } from "./Constants";
import { view } from "./View";
import { util } from "./Util";
import { edit } from "./Edit";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { EditNodeDlg } from "./EditNodeDlg";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextContent } from "./widget/TextContent";
import { Div } from "./widget/Div";
import { Textarea } from "./widget/Textarea";

/*
 * Property Editor Dialog (Edits Node Properties)
 */
export default class EditPropertyDlgImpl extends DialogBaseImpl implements EditPropertyDlg {

    editPropertyPathDisplay: TextContent;
    propertyNameTextarea: Textarea;
    propertyValTextarea: Textarea;

    private editNodeDlg: EditNodeDlg;

    constructor(args: any) {
        super();
        this.editNodeDlg = args.editNodeDlg;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Edit Node Property"),
            cnst.SHOW_PATH_IN_DLGS ?
                this.editPropertyPathDisplay = new TextContent(null, "path-display-in-editor") : null,
            new Div(null, null, [
                this.propertyNameTextarea = new Textarea({
                    "placeholder": "Enter property name",
                    "label": "Name"
                }),
                this.propertyValTextarea = new Textarea({
                    "placeholder": "Enter property text",
                    "label": "Value"
                })
            ]),

            new ButtonBar([
                new Button("Save", this.saveProperty, null, true, this),
                new Button("Cancel", null, null, true, this)
            ])
        ]);
    }

    populatePropertyEdit = (): void => {
        /* display the node path at the top of the edit page */
        view.initEditPathDisplayById(this.editPropertyPathDisplay.getId());
    }

    saveProperty = (): void => {
        //todo-1: need validation
        var propertyNameData = this.propertyNameTextarea.getValue();
        var propertyValueData = this.propertyValTextarea.getValue();

        var postData = {
            nodeId: edit.editNode.id,
            propertyName: propertyNameData,
            propertyValue: propertyValueData
        };
        util.ajax<I.SavePropertyRequest, I.SavePropertyResponse>("saveProperty", postData, this.savePropertyResponse);
    }

    savePropertyResponse = (res: I.SavePropertyResponse): void => {
        util.checkSuccess("Save properties", res);

        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;

        this.editNodeDlg.populateEditNodePg();
    }

    init = (): void => {
        this.populatePropertyEdit();
    }
}
