console.log("EditPropertyDlg.ts");

import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { EditNodeDlg } from "./EditNodeDlg";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextContent } from "../widget/TextContent";
import { Div } from "../widget/Div";
import { Textarea } from "../widget/Textarea";
import { Constants as cnst} from "../Constants";
import { UtilIntf as Util} from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});


/*
 * Property Editor Dialog (Edits Node Properties)
 */
export class EditPropertyDlg extends DialogBase {

    editPropertyPathDisplay: TextContent;
    propertyNameTextarea: Textarea;
    propertyValTextarea: Textarea;

    private editNodeDlg: EditNodeDlg;

    constructor(args: any) {
        super("Edit Node Property");
        this.editNodeDlg = args.editNodeDlg;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
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
        S.view.initEditPathDisplayById(this.editPropertyPathDisplay.getId());
    }

    saveProperty = (): void => {
        let propertyNameData = this.propertyNameTextarea.getValue();
        let propertyValueData = this.propertyValTextarea.getValue();

        let valPromise: Promise<string> = null;
        if (propertyNameData == cnst.PASSWORD) {
            valPromise = S.encryption.passwordEncryptString(propertyValueData, S.util.getPassword());
        }
        else {
            valPromise = Promise.resolve(propertyValueData);
        }

        valPromise.then((saveVal) => {
            var postData = {
                nodeId: S.edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: saveVal
            };
            S.util.ajax<I.SavePropertyRequest, I.SavePropertyResponse>("saveProperty", postData, this.savePropertyResponse);
        });
    }

    savePropertyResponse = (res: I.SavePropertyResponse): void => {
        S.util.checkSuccess("Save properties", res);

        S.edit.editNode.properties.push(res.propertySaved);
        S.meta64.treeDirty = true;

        this.editNodeDlg.populateEditNodePg();
    }

    init = (): void => {
        this.populatePropertyEdit();
    }
}
