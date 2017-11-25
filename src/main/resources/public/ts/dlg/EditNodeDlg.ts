console.log("EditNodeDlg.ts");

import * as I from "../Interfaces"
import { DialogBase } from "../DialogBase";
import { EditPropertyDlg } from "./EditPropertyDlg";
import { ConfirmDlg } from "./ConfirmDlg";
import { Button } from "../widget/Button";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Div } from "../widget/Div";
import { Help } from "../widget/Help";
import { Textarea } from "../widget/Textarea";
import { EditPropTextarea } from "../widget/EditPropTextarea";
import { Checkbox } from "../widget/Checkbox";
import { Comp } from "../widget/base/Comp";
import { EditPropsTable } from "../widget/EditPropsTable";
import { EditPropsTableRow } from "../widget/EditPropsTableRow";
import { EditPropsTableCell } from "../widget/EditPropsTableCell";
import { PasswordDlg } from "./PasswordDlg";
import { Constants as cnst} from "../Constants";
import { Util } from "../types/Util";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: any) => {
    util = ctx.util;
});

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, render, edit, view, props, tag, encryption;  

declare var ace;

/*
todo-1 No longer support multi-value property editing. I have a lot of code dedicated to it, but never tested that
after refactoring, so i'm gonna hazard a guess that multi-value properts currently DO NOT work, because i'm unsure
but i know i didn't test it during refactoring, and don't even see buttons in place for management of them
*/
export class EditNodeDlg extends DialogBase {

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
    propEntries: Array<I.PropEntry> = new Array<I.PropEntry>();
    editPropertyDlgInst: any;
    typeName: string;
    createAtTop: boolean;

    constructor(args: Object) {
        super();

        this.typeName = (<any>args).typeName;
        this.createAtTop = (<any>args).createAtTop;

        // /* todo: need something better for this when supporting mobile */

        this.propEntries = new Array<I.PropEntry>();
        this.buildGUI();
    }

    buildGUI = (): void => {
        let width = 800; //window.innerWidth * 0.6;
        let height = 600; //window.innerHeight * 0.4;

        this.setChildren([
            this.header = new Header("Edit Node"),
            this.help = new Help(""),
            this.propertyEditFieldContainer = new Div("", {
                // todo-1: create CSS class for this.
                "style": `padding-left: 0px; max-width:${width}px;height:${height}px;width:100%;overflow:scroll; border:4px solid lightGray;`,
                "class": "vertical-layout-row",
                "sourceClass": "propertyEditFieldContainer"
            }),
            this.pathDisplay = cnst.SHOW_PATH_IN_DLGS ? new Div("", {
                "class": "path-display-in-editor"
            }) : null,
            this.buttonBar = new ButtonBar([
                this.saveNodeButton = new Button("Save", this.saveNode, null, true, this),
                this.addPropertyButton = new Button("Add Property", this.addProperty),
                this.addTagsPropertyButton = new Button("Add Tags", this.addTagsProperty),

                //todo-1: temporarily disabling this until we have it working in mongodb
                //this.splitContentButton = new Button("Split", this.splitContent),
                this.deletePropButton = new Button("Delete", this.deletePropertyButtonClick),
                this.cancelButton = new Button("Cancel", this.cancelEdit)
            ])
        ]);
    }

    /*
     * Generates all the HTML edit fields and puts them into the DOM model of the property editor dialog box.
     *
     */
    populateEditNodePg = (): void => {
        /* display the node path at the top of the edit page */
        view.initEditPathDisplayById(this.pathDisplay.getId());

        let counter = 0;
        //let aceFields = [];

        /* clear this map to get rid of old properties */
        this.propEntries = new Array<I.PropEntry>();
        let editPropsTable = new EditPropsTable();

        /* editNode will be null if this is a new node being created */
        if (edit.editNode) {
            console.log("Editing existing node.");

            /* iterator function will have the wrong 'this' so we save the right one */
            let editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode, edit.editNode.properties);

            // Iterate PropertyInfo.java objects
            util.forEachArrElm(editOrderedProps, (prop: I.PropertyInfo, index) => {

                /*
                 * if property not allowed to display return to bypass this property/iteration
                 */
                if (!render.allowPropertyToDisplay(prop.name)) {
                    console.log("Hiding property: " + prop.name);
                    return;
                }

                console.log("Creating edit field for property " + prop.name);

                let isReadOnlyProp = render.isReadOnlyProperty(prop.name);
                let isBinaryProp = render.isBinaryProperty(prop.name);
                let propEntry: I.PropEntry = new I.PropEntry(/* fieldId */ null, /* checkboxId */ null, prop, isReadOnlyProp, isBinaryProp, null);

                this.propEntries.push(propEntry);

                let tableRow = new EditPropsTableRow({
                    "class": ((!isReadOnlyProp && !isBinaryProp) || edit.showReadOnlyProperties ? "propertyEditListItem"
                        : "propertyEditListItemHidden")
                    // "style" : "display: "+ (!rdOnly || meta64.showReadOnlyProperties ? "inline" : "none")
                });

                this.makeSinglePropEditor(tableRow, propEntry, null /* aceFields */);

                editPropsTable.addChild(tableRow);
            });
        }
        /* Editing a new node */
        else {
            let tableRow = new EditPropsTableRow();

            // todo-1: this entire block needs review now (redesign)
            console.log("Editing new node.");

            if (cnst.USE_ACE_EDITOR) {
                throw "not refactoring for ace yet";
                // let aceFieldId = this.id("newNodeNameId");
                //
                // fields += tag.div({
                //     "id": aceFieldId,
                //     "class": "ace-edit-panel",
                //     "html": "true"
                // }, '');
                //
                // aceFields.push({
                //     id: aceFieldId,
                //     val: ""
                // });
            } else {
                tableRow.addChild(new Textarea({
                    "label": "New Node Name"
                }));
            }

            editPropsTable.addChild(tableRow);
        }

        //I'm not quite ready to add this button yet.
        // var toggleReadonlyVisButton = tag.button({
        //     "raised": "raised",
        //     "onclick": toggleShowReadOnly(); //
        // }, //
        //     (edit.showReadOnlyProperties ? "Hide Read-Only Properties" : "Show Read-Only Properties"));
        //
        // fields += toggleReadonlyVisButton;
        //let row = tag.div( { "display": "table-row" }, left + center + right);

        this.propertyEditFieldContainer.setChildren([editPropsTable]);
        this.propertyEditFieldContainer.renderChildrenToDom();

        if (cnst.USE_ACE_EDITOR) {
            throw "ace editor disabled for now";
            // for (let i = 0; i < aceFields.length; i++) {
            //     let editor = ace.edit(aceFields[i].id);
            //     editor.setValue(util.unencodeHtml(aceFields[i].val));
            //     meta64.aceEditorsById[aceFields[i].id] = editor;
            // }
        }

        let instr = edit.editingUnsavedNode ? //
            "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
            : //
            "";

        this.help.setInnerHTML(instr);

        /*
         * Allow adding of new properties as long as this is a saved node we are editing, because we don't want to start
         * managing new properties on the client side. We need a genuine node already saved on the server before we allow
         * any property editing to happen.
         */
        this.addPropertyButton.setVisible(!edit.editingUnsavedNode);

        let tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
        // console.log("hasTagsProp: " + tagsProp);
        this.addTagsPropertyButton.setVisible(!tagsPropExists);
    }

    toggleShowReadOnly = (): void => {
        // alert("not yet implemented.");
        // see saveExistingNode for how to iterate all properties, although I wonder why I didn't just use a map/set of
        // properties elements
        // instead so I don't need to parse any DOM or domIds inorder to iterate over the list of them????
    }

    addProperty = (): void => {
        let dlg = new EditPropertyDlg({ "editNodeDlg": this });
        this.editPropertyDlgInst = dlg;
        this.editPropertyDlgInst.open();
    }

    addTagsProperty = (): void => {
        if (props.getNodePropertyVal(edit.editNode, "tags")) {
            return;
        }

        let postData = {
            nodeId: edit.editNode.id,
            propertyName: "tags",
            propertyValue: ""
        };
        util.ajax<I.SavePropertyRequest, I.SavePropertyResponse>("saveProperty", postData, this.addTagsPropertyResponse);
    }

    addTagsPropertyResponse(res: I.SavePropertyResponse): void {
        if (util.checkSuccess("Add Tags Property", res)) {
            this.savePropertyResponse(res);
        }
    }

    savePropertyResponse(res: any): void {
        util.checkSuccess("Save properties", res);

        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;

        this.populateEditNodePg();
    }

    /* Note: looks like i'm not even supporting multi-valued property editing currently */
    addSubProperty = (fieldId: string): void => {
        let prop = null; //refactored. need other way to get property here..... was this ---> this.fieldIdToPropMap[fieldId].property; (todo-1)

        let isMulti = util.isObject(prop.values);

        /* convert to multi-type if we need to */
        if (!isMulti) {
            prop.values = [];
            prop.values.push(prop.value);
            prop.value = null;
        }

        /*
         * now add new empty property and populate it onto the screen
         *
         * TODO-3: for performance we could do something simpler than 'populateEditNodePg' here, but for now we just
         * rerendering the entire edit page.
         */
        prop.values.push("");

        this.populateEditNodePg();
    }

    /*
     * Deletes the property of the specified name on the node being edited, but first gets confirmation from user
     */
    deleteProperty(propName: string) {
        console.log("Asking to confirm delete property.");
        new ConfirmDlg({
            "title": "Confirm Delete", "message": "Delete the Property: " + propName,
            "buttonText": "Yes, delete.", "yesCallback":
                () => {
                    this.deletePropertyImmediate(propName);
                }
        }).open();
    }

    deletePropertyImmediate = (propName: string) => {
        util.ajax<I.DeletePropertyRequest, I.DeletePropertyResponse>("deleteProperty", {
            "nodeId": edit.editNode.id,
            "propName": propName
        }, (res) => {
            this.deletePropertyResponse(res, propName);
        });
    }

    deletePropertyResponse = (res: any, propertyToDelete: any) => {

        if (util.checkSuccess("Delete property", res)) {

            /*
             * remove deleted property from client side data, so we can re-render screen without making another call to
             * server
             */
            props.deletePropertyFromLocalData(propertyToDelete);

            /* now just re-render screen from local variables */
            meta64.treeDirty = true;

            this.populateEditNodePg();
        }
    }

    /*
     * for now just let server side choke on invalid things. It has enough security and validation to at least protect
     * itself from any kind of damage.
     */
    saveNode = (): void => {
        /*
         * If editing an unsaved node it's time to run the insertNode, or createSubNode, which actually saves onto the
         * server, and will initiate further editing like for properties, etc.
         */
        if (edit.editingUnsavedNode) {
            // todo-1: need to make this compatible with Ace Editor.
            this.saveNewNode();
        }
        /*
         * Else we are editing a saved node, which is already saved on server.
         */
        else {
            this.saveExistingNode();
        }
    }

    saveNewNode = (newNodeName?: string): void => {
        /*
         * If we didn't create the node we are inserting under, and neither did "admin", then we need to send notification
         * email upon saving this new node.
         */
        if (meta64.userName != edit.parentOfNewNode.owner && //
            edit.parentOfNewNode.owner != "admin") {
            edit.sendNotificationPendingSave = true;
        }

        meta64.treeDirty = true;
        if (edit.nodeInsertTarget) {
            util.ajax<I.InsertNodeRequest, I.InsertNodeResponse>("insertNode", {
                "parentId": edit.parentOfNewNode.id,
                "targetOrdinal": edit.nodeInsertTarget.ordinal,
                "newNodeName": newNodeName,
                "typeName": this.typeName ? this.typeName : "nt:unstructured"
            }, edit.insertNodeResponse);
        } else {
            util.ajax<I.CreateSubNodeRequest, I.CreateSubNodeResponse>("createSubNode", {
                "nodeId": edit.parentOfNewNode.id,
                "newNodeName": newNodeName,
                "typeName": this.typeName ? this.typeName : "nt:unstructured",
                "createAtTop": this.createAtTop
            }, edit.createSubNodeResponse);
        }
    }

    saveExistingNode = (): void => {
        console.log("saveExistingNode");

        /* holds list of properties to send to server. Each one having name+value properties */
        let saveList: I.PropertyInfo[] = [];
        let valPromises: Promise<string>[] = [];

        util.forEachArrElm(this.propEntries, (prop: I.PropEntry, index: number) => {

            /* Ignore this property if it's one that cannot be edited as text */
            if (prop.readOnly || prop.binary)
                return;


            console.log("Saving non-multi property field: " + JSON.stringify(prop));

            let propVal: string;

            if (cnst.USE_ACE_EDITOR) {
                throw "ace refactoring now yet done";
                // let editor = meta64.aceEditorsById[prop.id];
                // if (!editor)
                //     throw "Unable to find Ace Editor for ID: " + prop.id;
                // propVal = editor.getValue();
            } else {
                propVal = util.getTextAreaValById(prop.id);
            }

            if (propVal !== prop.property.value) {
                console.log("Prop changed: propName=" + prop.property.name + " propVal=" + propVal);

                //Note: If this is not a password it returns an already-resolved promise to the val.
                let valPromise = this.encryptIfPassword(prop, propVal);
                valPromise.then((propVal) => {
                    saveList.push({
                        "name": prop.property.name,
                        "value": propVal
                    });
                });

                valPromises.push(valPromise);
            } else {
                console.log("Prop didn't change: " + prop.id);
            }
        });// end iterator

        Promise.all(valPromises).then(() => {
            /* if anything changed, save to server */
            if (saveList.length > 0) {
                let postData = {
                    nodeId: edit.editNode.id,
                    properties: saveList,
                    sendNotification: edit.sendNotificationPendingSave
                };
                //console.log("calling saveNode(). PostData=" + util.toJson(postData));
                util.ajax<I.SaveNodeRequest, I.SaveNodeResponse>("saveNode", postData, (res) => {
                    edit.saveNodeResponse(res, {
                        savedId: edit.editNode.id
                    });
                });
                edit.sendNotificationPendingSave = false;
            } else {
                console.log("nothing changed. Nothing to save.");
            }
        });
    }

    encryptIfPassword = (prop: I.PropEntry, val: string): Promise<string> => {
        if (prop.property.name == cnst.PASSWORD) {
            return encryption.passwordEncryptString(val, util.getPassword());
        }
        return Promise.resolve(val);
    }

    makeSinglePropEditor = (tableRow: EditPropsTableRow, propEntry: I.PropEntry, aceFields: any): void => {
        console.log("Property single-type: " + propEntry.property.name);

        let checkboxTableCell = new EditPropsTableCell({ "class": "edit-prop-checkbox-col" });
        let textareaTableCell = new EditPropsTableCell({ "class": "edit-prop-textfield-col" });

        let propVal = propEntry.binary ? "[binary]" : propEntry.property.value;

        let isPassword = propEntry.property.name == cnst.PASSWORD;
        let label = render.sanitizePropertyName(propEntry.property.name);
        let propValStr = propVal ? propVal : "";
        let isEncrypted = isPassword && util.startsWith(propValStr, "|");
        propValStr = util.escapeForAttrib(propValStr);
        console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
            + "] fieldId=" + propEntry.id);

        if (propEntry.readOnly || propEntry.binary) {
            let textarea = new EditPropTextarea(propEntry, null, {
                "readonly": "readonly",
                "disabled": "disabled",
                "label": label,
                "value": propValStr
            });

            textareaTableCell.addChild(textarea);
        } else {
            let checkbox = new Checkbox();
            propEntry.checkboxId = checkbox.getId();
            checkboxTableCell.addChild(checkbox);

            if (!cnst.USE_ACE_EDITOR) {
                //todo-1: when this is a password, disable it until value it asynchronously set.

                let textarea = new EditPropTextarea(propEntry, null, {
                    "label": label,
                    "value": propValStr
                });

                if (isEncrypted) {
                    let decryptedValPromise = encryption.passwordDecryptString(propValStr, util.getPassword());
                    decryptedValPromise.then((decryptedVal) => {
                        textarea.setValue(decryptedVal);
                    },
                        //if this fails to decrypt it's ok, it may not have been encrypted yet so we just display it 
                        //as is which will be the raw unencrypted data, or worst case scenario the hex value that couldn't be decrypted
                        (err) => {
                            //i think this line is not needed, because we already will have this value set.
                            textarea.setValue(propValStr);

                            //if we failed with this password set back to null so that we end up prompting user again rather
                            //than using this one again and failing again.
                            encryption.masterPassword = null;
                        }
                    );
                }

                textareaTableCell.addChild(textarea);

                if (propEntry.property.name == cnst.CONTENT) {
                    this.contentFieldDomId = textarea.getId();
                }
            } else {
                throw "not doing ace refactoring for now";
                // field += tag.div({
                //     "id": propEntry.id,
                //     "class": "ace-edit-panel",
                //     "html": "true"
                // }, '');
                //
                // aceFields.push({
                //     id: propEntry.id,
                //     val: propValStr
                // });
            }
        }

        tableRow.addChildren([checkboxTableCell, textareaTableCell]);
    }

    deletePropertyButtonClick = (): void => {
        /* Iterate over all properties */
        util.forEachArrElm(this.propEntries, (propEntry: I.PropEntry, index: number) => {

            /* Ignore this property if it's one that cannot be edited as text */
            if (propEntry.readOnly || propEntry.binary)
                return;

            //console.log("checking to delete prop=" + propEntry.property.name);

            if (util.getCheckBoxStateById(propEntry.checkboxId)) {
                //console.log("prop IS CHECKED=" + propEntry.property.name);
                this.deleteProperty(propEntry.property.name);

                /* for now lets' just support deleting one property at a time, and so we can return once we found a
                checked one to delete. Would be easy to extend to allow multiple-selects in the future.
                Returning false stops iteration */
                return false;
            }
        });
    }

    splitContent = (): void => {
        let nodeBelow: I.NodeInfo = edit.getNodeBelow(edit.editNode);
        util.ajax<I.SplitNodeRequest, I.SplitNodeResponse>("splitNode", {
            "nodeId": edit.editNode.id,
            "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
            "delimiter": null
        }, this.splitContentResponse);
    }

    splitContentResponse = (res: I.SplitNodeResponse): void => {
        if (util.checkSuccess("Split content", res)) {
            this.cancel();
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }

    cancelEdit = (): void => {
        this.cancel();
        if (meta64.treeDirty) {
            meta64.goToMainPage(true);
        } else {
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    }

    init = (): void => {
        console.log("EditNodeDlg.init");
        this.populateEditNodePg();
        if (this.contentFieldDomId) {
            util.delayedFocus("#" + this.contentFieldDomId);
        }
    }
}
