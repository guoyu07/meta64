console.log("EditNodeDlgImpl.ts");

import * as I from "./Interfaces"
import { DialogBaseImpl } from "./DialogBaseImpl";
import { EditNodeDlg } from "./EditNodeDlg";
import { EditPropertyDlg } from "./EditPropertyDlg";
import { ConfirmDlg } from "./ConfirmDlg";
import { render } from "./Render";
import { Factory } from "./Factory";
import { cnst, jcrCnst } from "./Constants";
import { edit } from "./Edit";
import { view } from "./View";
import { props } from "./Props";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import { tag } from "./Tag";

declare var ace;

export default class EditNodeDlgImpl extends DialogBaseImpl implements EditNodeDlg {

    contentFieldDomId: string;
    fieldIdToPropMap: any = {};
    propEntries: Array<I.PropEntry> = new Array<I.PropEntry>();
    editPropertyDlgInst: any;
    typeName: string;
    createAtTop: boolean;

    constructor(args: Object) {
        super("EditNodeDlg");

        this.typeName = (<any>args).typeName;
        this.createAtTop = (<any>args).createAtTop;

        /*
         * Property fields are generated dynamically and this maps the DOM IDs of each field to the property object it
         * edits.
         */
        this.fieldIdToPropMap = {};
        this.propEntries = new Array<I.PropEntry>();
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Edit Node");

        let saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", this.saveNode.bind(this));
        let addPropertyButton = this.makeButton("Add Property", "addPropertyButton", this.addProperty);
        let addTagsPropertyButton = this.makeButton("Add Tags", "addTagsPropertyButton",
            this.addTagsProperty);
        let splitContentButton = this.makeButton("Split", "splitContentButton", this.splitContent);
        let deletePropButton = this.makeButton("Delete", "deletePropButton", this.deletePropertyButtonClick);
        let cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", this.cancelEdit.bind(this));

        let buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton + deletePropButton
            + splitContentButton + cancelEditButton, "buttons");

        /* todo: need something better for this when supporting mobile */
        let width = 800; //window.innerWidth * 0.6;
        let height = 600; //window.innerHeight * 0.4;

        let internalMainContent = "";

        if (cnst.SHOW_PATH_IN_DLGS) {
            internalMainContent += tag.div({
                id: this.id("editNodePathDisplay"),
                "class": "path-display-in-editor"
            });
        }

        internalMainContent += tag.div({
            id: this.id("editNodeInstructions")
        }) + tag.div({
            id: this.id("propertyEditFieldContainer"),
            // todo-1: create CSS class for this.
            style: `padding-left: 0px; max-width:${width}px;height:${height}px;width:100%; overflow:scroll; border:4px solid lightGray;`,
            class: "vertical-layout-row"
            //"padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll; border:4px solid lightGray;"
        }, "Loading...");

        return header + internalMainContent + buttonBar;
    }

    /*
     * Generates all the HTML edit fields and puts them into the DOM model of the property editor dialog box.
     *
     */
    populateEditNodePg = () => {
        /* display the node path at the top of the edit page */
        view.initEditPathDisplayById(this.id("editNodePathDisplay"));

        let fields = "";
        let counter = 0;
        let aceFields = [];

        /* clear this map to get rid of old properties */
        this.fieldIdToPropMap = {};
        this.propEntries = new Array<I.PropEntry>();

        /* editNode will be null if this is a new node being created */
        if (edit.editNode) {
            console.log("Editing existing node.");

            /* iterator function will have the wrong 'this' so we save the right one */
            let thiz = this;
            let editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode, edit.editNode.properties);


            // Iterate PropertyInfo.java objects
            /*
             * Warning each iterator loop has its own 'this'
             */
            util.forEachArrElm(editOrderedProps, function(prop, index) {

                /*
                 * if property not allowed to display return to bypass this property/iteration
                 */
                if (!render.allowPropertyToDisplay(prop.name)) {
                    console.log("Hiding property: " + prop.name);
                    return;
                }

                let fieldId = thiz.id("editNodeTextContent" + index);
                console.log("Creating edit field " + fieldId + " for property " + prop.name);

                let isMulti = prop.values && prop.values.length > 0;
                let isReadOnlyProp = render.isReadOnlyProperty(prop.name);
                let isBinaryProp = render.isBinaryProperty(prop.name);

                let propEntry: I.PropEntry = new I.PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);

                thiz.fieldIdToPropMap[fieldId] = propEntry;
                thiz.propEntries.push(propEntry);
                let field = "";

                if (isMulti) {
                    field += thiz.makeMultiPropEditor(propEntry);
                } else {
                    field += thiz.makeSinglePropEditor(propEntry, aceFields);
                }

                fields += tag.div({
                    "class": ((!isReadOnlyProp && !isBinaryProp) || edit.showReadOnlyProperties ? "propertyEditListItem"
                        : "propertyEditListItemHidden")
                    // "style" : "display: "+ (!rdOnly || meta64.showReadOnlyProperties ? "inline" : "none")
                }, field);
            });
        }
        /* Editing a new node */
        else {
            // todo-1: this entire block needs review now (redesign)
            console.log("Editing new node.");

            if (cnst.USE_ACE_EDITOR) {
                let aceFieldId = this.id("newNodeNameId");

                fields += tag.div({
                    "id": aceFieldId,
                    "class": "ace-edit-panel",
                    "html": "true"
                }, '');

                aceFields.push({
                    id: aceFieldId,
                    val: ""
                });
            } else {
                let field = tag.textarea({
                    "id": this.id("newNodeNameId"),
                    "label": "New Node Name"
                });

                fields += tag.div({ "display": "table-row" }, field);
            }
        }

        //not w-pack
        //I'm not quite ready to add this button yet.
        // var toggleReadonlyVisButton = tag.button({
        //     "raised": "raised",
        //     "onClick": toggleShowReadOnly(); //
        // }, //
        //     (edit.showReadOnlyProperties ? "Hide Read-Only Properties" : "Show Read-Only Properties"));
        //
        // fields += toggleReadonlyVisButton;
        //let row = tag.div( { "display": "table-row" }, left + center + right);

        let propTable: string = tag.div(
            {
                "display": "table",
            }, fields);


        util.setHtml(this.id("propertyEditFieldContainer"), propTable);

        if (cnst.USE_ACE_EDITOR) {
            for (let i = 0; i < aceFields.length; i++) {
                let editor = ace.edit(aceFields[i].id);
                editor.setValue(util.unencodeHtml(aceFields[i].val));
                meta64.aceEditorsById[aceFields[i].id] = editor;
            }
        }

        let instr = edit.editingUnsavedNode ? //
            "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
            : //
            "";

        this.setInnerHTML("editNodeInstructions", instr);

        /*
         * Allow adding of new properties as long as this is a saved node we are editing, because we don't want to start
         * managing new properties on the client side. We need a genuine node already saved on the server before we allow
         * any property editing to happen.
         */
        this.setElmDisplayById("addPropertyButton", !edit.editingUnsavedNode);

        let tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
        // console.log("hasTagsProp: " + tagsProp);
        this.setElmDisplayById("addTagsPropertyButton", !tagsPropExists);
    }

    toggleShowReadOnly = (): void => {
        //not w-pack
        // alert("not yet implemented.");
        // see saveExistingNode for how to iterate all properties, although I wonder why I didn't just use a map/set of
        // properties elements
        // instead so I don't need to parse any DOM or domIds inorder to iterate over the list of them????
    }

    addProperty = (): void => {
        Factory.createDefault("EditPropertyDlgImpl", (dlg: EditPropertyDlg) => {
            this.editPropertyDlgInst = dlg;
            this.editPropertyDlgInst.open();
        }, { "EditNodeDlgInstance": this });
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
        util.json<I.SavePropertyRequest, I.SavePropertyResponse>("saveProperty", postData, this.addTagsPropertyResponse, this);
    }

    addTagsPropertyResponse = (res: I.SavePropertyResponse): void => {
        if (util.checkSuccess("Add Tags Property", res)) {
            this.savePropertyResponse(res);
        }
    }

    savePropertyResponse = (res: any): void => {
        util.checkSuccess("Save properties", res);

        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;

        // if (this.domId != "EditNodeDlg") {
        //     console.log("error: incorrect object for EditNodeDlg");
        // }
        this.populateEditNodePg();
    }

    addSubProperty = (fieldId: string): void => {
        let prop = this.fieldIdToPropMap[fieldId].property;

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
    deleteProperty = (propName: string) => {
        let thiz = this;
        Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
            dlg.open();
        }, {
                "title": "Confirm Delete", "message": "Delete the Property: " + propName,
                "buttonText": "Yes, delete.", "yesCallback":
                function() {
                    thiz.deletePropertyImmediate(propName);
                }
            });
    }

    deletePropertyImmediate = (propName: string) => {

        let thiz = this;
        util.json<I.DeletePropertyRequest, I.DeletePropertyResponse>("deleteProperty", {
            "nodeId": edit.editNode.id,
            "propName": propName
        }, function(res: I.DeletePropertyResponse) {
            thiz.deletePropertyResponse(res, propName);
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

    clearProperty = (fieldId: string): void => {
        if (!cnst.USE_ACE_EDITOR) {
            util.setInputVal(this.id(fieldId), "");
        } else {
            let editor = meta64.aceEditorsById[this.id(fieldId)];
            if (editor) {
                editor.setValue("");
            }
        }

        /* scan for all multi-value property fields and clear them */
        let counter = 0;
        while (counter < 1000) {
            if (!cnst.USE_ACE_EDITOR) {
                if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
                    break;
                }
            } else {
                let editor = meta64.aceEditorsById[this.id(fieldId + "_subProp" + counter)];
                if (editor) {
                    editor.setValue("");
                } else {
                    break;
                }
            }
            counter++;
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
            console.log("saveNewNode.");

            // todo-0: need to make this compatible with Ace Editor.
            this.saveNewNode();
        }
        /*
         * Else we are editing a saved node, which is already saved on server.
         */
        else {
            console.log("saveExistingNode.");
            this.saveExistingNode();
        }
    }

    saveNewNode = (newNodeName?: string): void => {
        if (!newNodeName) {
            newNodeName = util.getInputVal(this.id("newNodeNameId"));
        }

        /*
         * If we didn't create the node we are inserting under, and neither did "admin", then we need to send notification
         * email upon saving this new node.
         */
        if (meta64.userName != edit.parentOfNewNode.createdBy && //
            edit.parentOfNewNode.createdBy != "admin") {
            edit.sendNotificationPendingSave = true;
        }

        meta64.treeDirty = true;
        if (edit.nodeInsertTarget) {
            util.json<I.InsertNodeRequest, I.InsertNodeResponse>("insertNode", {
                "parentId": edit.parentOfNewNode.id,
                "targetName": edit.nodeInsertTarget.name,
                "newNodeName": newNodeName,
                "typeName": this.typeName ? this.typeName : "nt:unstructured"
            }, edit.insertNodeResponse, edit);
        } else {
            util.json<I.CreateSubNodeRequest, I.CreateSubNodeResponse>("createSubNode", {
                "nodeId": edit.parentOfNewNode.id,
                "newNodeName": newNodeName,
                "typeName": this.typeName ? this.typeName : "nt:unstructured",
                "createAtTop": this.createAtTop
            }, edit.createSubNodeResponse, edit);
        }
    }

    saveExistingNode = (): void => {
        console.log("saveExistingNode");

        /* holds list of properties to send to server. Each one having name+value properties */
        let propertiesList = [];
        let thiz = this;

        util.forEachArrElm(this.propEntries, function(prop: any, index: number) {

            console.log("--------------- Getting prop idx: " + index);

            /* Ignore this property if it's one that cannot be edited as text */
            if (prop.readOnly || prop.binary)
                return;

            if (!prop.multi) {
                console.log("Saving non-multi property field: " + JSON.stringify(prop));

                let propVal;

                if (cnst.USE_ACE_EDITOR) {
                    let editor = meta64.aceEditorsById[prop.id];
                    if (!editor)
                        throw "Unable to find Ace Editor for ID: " + prop.id;
                    propVal = editor.getValue();
                } else {
                    propVal = util.getTextAreaValById(prop.id);
                }

                if (propVal !== prop.value) {
                    console.log("Prop changed: propName=" + prop.property.name + " propVal=" + propVal);
                    propertiesList.push({
                        "name": prop.property.name,
                        "value": propVal
                    });
                } else {
                    console.log("Prop didn't change: " + prop.id);
                }
            }
            /* Else this is a MULTI property */
            else {
                console.log("Saving multi property field: " + JSON.stringify(prop));

                let propVals = [];

                util.forEachArrElm(prop.subProps, function(subProp, index) {

                    console.log("subProp[" + index + "]: " + JSON.stringify(subProp));

                    let propVal;
                    if (cnst.USE_ACE_EDITOR) {
                        let editor = meta64.aceEditorsById[subProp.id];
                        if (!editor)
                            throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                        propVal = editor.getValue();
                        // alert("Setting[" + propVal + "]");
                    } else {
                        propVal = util.getTextAreaValById(subProp.id);
                    }

                    console.log("    subProp[" + index + "] of " + prop.name + " val=" + propVal);
                    propVals.push(propVal);
                });

                propertiesList.push({
                    "name": prop.name,
                    "values": propVals
                });
            }

        });// end iterator

        /* if anything changed, save to server */
        if (propertiesList.length > 0) {
            let postData = {
                nodeId: edit.editNode.id,
                properties: propertiesList,
                sendNotification: edit.sendNotificationPendingSave
            };
            console.log("calling saveNode(). PostData=" + util.toJson(postData));
            util.json<I.SaveNodeRequest, I.SaveNodeResponse>("saveNode", postData, edit.saveNodeResponse, null, {
                savedId: edit.editNode.id
            });
            edit.sendNotificationPendingSave = false;
        } else {
            console.log("nothing changed. Nothing to save.");
        }
    }

    makeMultiPropEditor = (propEntry: I.PropEntry): string => {
        console.log("Making Multi Editor: Property multi-type: name=" + propEntry.property.name + " count="
            + propEntry.property.values.length);
        let fields = "";

        propEntry.subProps = [];

        let propList = propEntry.property.values;
        if (!propList || propList.length == 0) {
            propList = [];
            propList.push("");
        }

        for (let i = 0; i < propList.length; i++) {
            console.log("prop multi-val[" + i + "]=" + propList[i]);
            let id = this.id(propEntry.id + "_subProp" + i);

            let propVal = propEntry.binary ? "[binary]" : propList[i];
            let propValStr = propVal || '';
            propValStr = util.escapeForAttrib(propVal);
            let label = (i == 0 ? propEntry.property.name : "*") + "." + i;

            console.log("Creating textarea with id=" + id);

            let subProp: I.SubProp = new I.SubProp(id, propVal);
            propEntry.subProps.push(subProp);

            if (propEntry.binary || propEntry.readOnly) {
                fields += tag.textarea({
                    "id": id,
                    "readonly": "readonly",
                    "disabled": "disabled",
                    "label": label,
                    "value": propValStr
                });
            } else {
                fields += tag.textarea({
                    "id": id,
                    "label": label,
                    "value": propValStr
                });
            }
        }

        let col = tag.div({
            "style": "display: table-cell;"
        }, fields);

        return col;
    }

    makeSinglePropEditor = (propEntry: I.PropEntry, aceFields: any): string => {
        console.log("Property single-type: " + propEntry.property.name);

        let field = "";

        let propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
        let label = render.sanitizePropertyName(propEntry.property.name);
        let propValStr = propVal ? propVal : '';
        propValStr = util.escapeForAttrib(propValStr);
        console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
            + "] fieldId=" + propEntry.id);

        let propSelCheckbox: string = "";

        if (propEntry.readOnly || propEntry.binary) {
            field += tag.textarea({
                "id": propEntry.id,
                "readonly": "readonly",
                "disabled": "disabled",
                "label": label,
                "value": propValStr
            });
        } else {
            propSelCheckbox = this.makeCheckBox("", "selProp_" + propEntry.id, false);

            if (propEntry.property.name == jcrCnst.CONTENT) {
                this.contentFieldDomId = propEntry.id;
            }
            if (!cnst.USE_ACE_EDITOR) {
                field += tag.textarea({
                    "id": propEntry.id,
                    "label": label,
                    "value": propValStr
                });
            } else {
                field += tag.div({
                    "id": propEntry.id,
                    "class": "ace-edit-panel",
                    "html": "true"
                }, '');

                aceFields.push({
                    id: propEntry.id,
                    val: propValStr
                });
            }
        }

        let selCol = tag.div({
            "style": "width: 40px; display: table-cell; padding: 10px;"
        }, propSelCheckbox);

        let editCol = tag.div({
            "style": "width: 100%; display: table-cell; padding: 10px;"
        }, field);

        return selCol + editCol;
    }

    deletePropertyButtonClick = (): void => {

        /* Iterate over all properties */
        for (let id in this.fieldIdToPropMap) {
            if (this.fieldIdToPropMap.hasOwnProperty(id)) {

                /* get PropEntry for this item */
                let propEntry: I.PropEntry = this.fieldIdToPropMap[id];
                if (propEntry) {
                    //console.log("prop=" + propEntry.property.name);
                    let selPropDomId = "selProp_" + propEntry.id;

                    /*
                    Get checkbox control and its value
                    todo-1: getting value of checkbox should be in some shared utility method
                    */
                    let selCheckbox = util.polyElm(this.id(selPropDomId));
                    if (selCheckbox) {
                        let checked: boolean = selCheckbox.node.checked;
                        if (checked) {
                            //console.log("prop IS CHECKED=" + propEntry.property.name);
                            this.deleteProperty(propEntry.property.name);

                            /* for now lets' just support deleting one property at a time, and so we can return once we found a
                            checked one to delete. Would be easy to extend to allow multiple-selects in the future */
                            return;
                        }
                    }
                }
                else {
                    throw "propEntry not found for id: " + id;
                }
            }
        }
        console.log("Delete property: ")
    }

    splitContent = (): void => {
        let nodeBelow: I.NodeInfo = edit.getNodeBelow(edit.editNode);
        util.json<I.SplitNodeRequest, I.SplitNodeResponse>("splitNode", {
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
