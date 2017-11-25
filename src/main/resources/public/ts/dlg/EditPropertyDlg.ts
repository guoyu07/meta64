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
import { Util } from "../types/Util";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: any) => {
    debugger;
    util = ctx.util;
});

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, view, edit, encryption;  

/*
 * Property Editor Dialog (Edits Node Properties)
 */
export class EditPropertyDlg extends DialogBase {

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
        let propertyNameData = this.propertyNameTextarea.getValue();
        let propertyValueData = this.propertyValTextarea.getValue();

        let valPromise: Promise<string> = null;
        if (propertyNameData == cnst.PASSWORD) {
            valPromise = encryption.passwordEncryptString(propertyValueData, util.getPassword());
        }
        else {
            valPromise = Promise.resolve(propertyValueData);
        }

        valPromise.then((saveVal) => {
            var postData = {
                nodeId: edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: saveVal
            };
            util.ajax<I.SavePropertyRequest, I.SavePropertyResponse>("saveProperty", postData, this.savePropertyResponse);
        });
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
