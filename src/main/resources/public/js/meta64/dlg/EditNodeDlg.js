console.log("running module: EditNodeDlg.js");
var EditNodeDlg = function () {
    Dialog.call(this);
    this.domId = "EditNodeDlg";
    this.fieldIdToPropMap = {};
    this.propEntries = new Array();
};
var EditNodeDlg_ = util.inherit(Dialog, EditNodeDlg);
EditNodeDlg_.build = function () {
    var header = this.makeHeader("Edit Node");
    var saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", EditNodeDlg_.saveNode, this);
    var addPropertyButton = this.makeButton("Add Property", "addPropertyButton", EditNodeDlg_.addProperty, this);
    var addTagsPropertyButton = this.makeButton("Add Tags Property", "addTagsPropertyButton", EditNodeDlg_.addTagsProperty, this);
    var cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", "edit.cancelEdit();", this);
    var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton
        + cancelEditButton, "buttons");
    var width = window.innerWidth * 0.6;
    var height = window.innerHeight * 0.4;
    var internalMainContent = "";
    if (cnst.SHOW_PATH_IN_DLGS) {
        internalMainContent += render.tag("div", {
            id: this.id("editNodePathDisplay"),
            "class": "path-display-in-editor"
        });
    }
    internalMainContent += render.tag("div", {
        id: this.id("editNodeInstructions")
    }) + render.tag("div", {
        id: this.id("propertyEditFieldContainer"),
        style: "padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll;"
    }, "Loading...");
    return header + internalMainContent + buttonBar;
};
EditNodeDlg_.populateEditNodePg = function () {
    view.initEditPathDisplayById(this.id("editNodePathDisplay"));
    var fields = "";
    var counter = 0;
    this.fieldIdToPropMap = {};
    this.propEntries = new Array();
    if (edit.editNode) {
        console.log("Editing existing node.");
        var _this = this;
        var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode.properties);
        var aceFields = [];
        $.each(editOrderedProps, function (index, prop) {
            if (!render.allowPropertyToDisplay(prop.name)) {
                console.log("Hiding property: " + prop.name);
                return;
            }
            var fieldId = _this.id("editNodeTextContent" + index);
            console.log("Creating edit field " + fieldId + " for property " + prop.name);
            var isMulti = prop.values && prop.values.length > 0;
            var isReadOnlyProp = render.isReadOnlyProperty(prop.name);
            var isBinaryProp = render.isBinaryProperty(prop.name);
            var propEntry = new PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);
            _this.fieldIdToPropMap[fieldId] = propEntry;
            _this.propEntries.push(propEntry);
            var buttonBar = "";
            if (!isReadOnlyProp && !isBinaryProp) {
                buttonBar = _this.makePropertyEditButtonBar(prop, fieldId);
            }
            var field = buttonBar;
            if (isMulti) {
                field += _this.makeMultiPropEditor(propEntry);
            }
            else {
                field += _this.makeSinglePropEditor(propEntry, aceFields);
            }
            fields += render.tag("div", {
                "class": ((!isReadOnlyProp && !isBinaryProp) || edit.showReadOnlyProperties ? "propertyEditListItem"
                    : "propertyEditListItemHidden")
            }, field);
        });
    }
    else {
        console.log("Editing new node.");
        if (cnst.USE_ACE_EDITOR) {
            var aceFieldId = this.id("newNodeNameId");
            fields += render.tag("div", {
                "id": aceFieldId,
                "class": "ace-edit-panel",
                "html": "true"
            }, '', true);
            aceFields.push({
                id: aceFieldId,
                val: ""
            });
        }
        else {
            var field = render.tag("paper-textarea", {
                "id": this.id("newNodeNameId"),
                "label": "New Node Name"
            }, '', true);
            fields += render.tag("div", {}, field);
        }
    }
    util.setHtmlEnhanced(this.id("propertyEditFieldContainer"), fields);
    if (cnst.USE_ACE_EDITOR) {
        for (var i = 0; i < aceFields.length; i++) {
            var editor = ace.edit(aceFields[i].id);
            editor.setValue(aceFields[i].val.unencodeHtml());
            meta64.aceEditorsById[aceFields[i].id] = editor;
        }
    }
    var instr = edit.editingUnsavedNode ?
        "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
        :
            "";
    $("#" + this.id("editNodeInstructions")).html(instr);
    util.setVisibility("#" + this.id("addPropertyButton"), !edit.editingUnsavedNode);
    var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
    util.setVisibility("#" + this.id("addTagsPropertyButton"), !tagsPropExists);
};
EditNodeDlg_.toggleShowReadOnly = function () {
};
EditNodeDlg_.addProperty = function () {
    this.editPropertyDlgInst = new EditPropertyDlg(this);
    this.editPropertyDlgInst.open();
};
EditNodeDlg_.addTagsProperty = function () {
    if (props.getNodePropertyVal(edit.editNode, "tags")) {
        return;
    }
    var postData = {
        nodeId: edit.editNode.id,
        propertyName: "tags",
        propertyValue: ""
    };
    util.json("saveProperty", postData, EditNodeDlg_.addTagsPropertyResponse, this);
};
EditNodeDlg_.addTagsPropertyResponse = function (res) {
    if (util.checkSuccess("Add Tags Property", res)) {
        this.savePropertyResponse(res);
    }
};
EditNodeDlg_.savePropertyResponse = function (res) {
    util.checkSuccess("Save properties", res);
    edit.editNode.properties.push(res.propertySaved);
    meta64.treeDirty = true;
    if (this.domId != "EditNodeDlg") {
        console.log("error: incorrect object for EditNodeDlg");
    }
    this.populateEditNodePg();
};
EditNodeDlg_.makePropertyEditButtonBar = function (prop, fieldId) {
    var buttonBar = "";
    var clearButton = render.tag("paper-button", {
        "raised": "raised",
        "onClick": "meta64.getObjectByGuid(" + this.guid + ").clearProperty('" + fieldId + "');"
    }, "Clear");
    var addMultiButton = "";
    var deleteButton = "";
    if (prop.name !== jcrCnst.CONTENT) {
        deleteButton = render.tag("paper-button", {
            "raised": "raised",
            "onClick": "meta64.getObjectByGuid(" + this.guid + ").deleteProperty('" + prop.name + "');"
        }, "Del");
    }
    var allButtons = addMultiButton + clearButton + deleteButton;
    if (allButtons.length > 0) {
        buttonBar = render.makeHorizontalFieldSet(allButtons, "property-edit-button-bar");
    }
    else {
        buttonBar = "";
    }
    return buttonBar;
};
EditNodeDlg_.addSubProperty = function (fieldId) {
    var prop = this.fieldIdToPropMap[fieldId].property;
    var isMulti = util.isObject(prop.values);
    if (!isMulti) {
        prop.values = [];
        prop.values.push(prop.value);
        prop.value = null;
    }
    prop.values.push("");
    this.populateEditNodePg();
};
EditNodeDlg_.deleteProperty = function (propName) {
    var _this = this;
    (new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
        _this.deletePropertyImmediate(propName);
    })).open();
};
EditNodeDlg_.deletePropertyImmediate = function (propName) {
    var ironRes = util.json("deleteProperty", {
        "nodeId": edit.editNode.id,
        "propName": propName
    });
    var _this = this;
    ironRes.completes.then(function () {
        _this.deletePropertyResponse(ironRes.response, propName);
    });
};
EditNodeDlg_.deletePropertyResponse = function (res, propertyToDelete) {
    if (util.checkSuccess("Delete property", res)) {
        props.deletePropertyFromLocalData(propertyToDelete);
        meta64.treeDirty = true;
        this.populateEditNodePg();
    }
};
EditNodeDlg_.clearProperty = function (fieldId) {
    if (!cnst.USE_ACE_EDITOR) {
        util.setInputVal(this.id(fieldId), "");
    }
    else {
        var editor = meta64.aceEditorsById[this.id(fieldId)];
        if (editor) {
            editor.setValue("");
        }
    }
    var counter = 0;
    while (counter < 1000) {
        if (!cnst.USE_ACE_EDITOR) {
            if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
                break;
            }
        }
        else {
            var editor = meta64.aceEditorsById[this.id(fieldId + "_subProp" + counter)];
            if (editor) {
                editor.setValue("");
            }
            else {
                break;
            }
        }
        counter++;
    }
};
EditNodeDlg_.saveNode = function () {
    if (edit.editingUnsavedNode) {
        console.log("saveNewNode.");
        this.saveNewNode();
    }
    else {
        console.log("saveExistingNode.");
        this.saveExistingNode();
    }
};
EditNodeDlg_.saveNewNode = function (newNodeName) {
    if (!newNodeName) {
        newNodeName = util.getInputVal(this.id("newNodeNameId"));
    }
    if (meta64.userName != edit.parentOfNewNode.createdBy &&
        edit.parentOfNewNode.createdBy != "admin") {
        edit.sendNotificationPendingSave = true;
    }
    meta64.treeDirty = true;
    if (edit.nodeInsertTarget) {
        util.json("insertNode", {
            "parentId": edit.parentOfNewNode.id,
            "targetName": edit.nodeInsertTarget.name,
            "newNodeName": newNodeName
        }, edit.insertNodeResponse);
    }
    else {
        util.json("createSubNode", {
            "nodeId": edit.parentOfNewNode.id,
            "newNodeName": newNodeName
        }, edit.createSubNodeResponse);
    }
};
EditNodeDlg_.saveExistingNode = function () {
    console.log("saveExistingNode");
    var propertiesList = [];
    var _this = this;
    $.each(this.propEntries, function (index, prop) {
        console.log("--------------- Getting prop idx: " + index);
        if (prop.readOnly || prop.binary)
            return;
        if (!prop.multi) {
            console.log("Saving non-multi property field: " + JSON.stringify(prop));
            var propVal;
            if (cnst.USE_ACE_EDITOR) {
                var editor = meta64.aceEditorsById[prop.id];
                if (!editor)
                    throw "Unable to find Ace Editor for ID: " + prop.id;
                propVal = editor.getValue();
            }
            else {
                propVal = util.getTextAreaValById(prop.id);
            }
            if (propVal !== prop.value) {
                console.log("Prop changed: propName=" + prop.property.name + " propVal=" + propVal);
                propertiesList.push({
                    "name": prop.property.name,
                    "value": propVal
                });
            }
            else {
                console.log("Prop didn't change: " + prop.id);
            }
        }
        else {
            console.log("Saving multi property field: " + JSON.stringify(prop));
            var propVals = [];
            $.each(prop.subProps, function (index, subProp) {
                console.log("subProp[" + index + "]: " + JSON.stringify(subProp));
                var propVal;
                if (cnst.USE_ACE_EDITOR) {
                    var editor = meta64.aceEditorsById[subProp.id];
                    if (!editor)
                        throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                    propVal = editor.getValue();
                }
                else {
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
    });
    if (propertiesList.length > 0) {
        var postData = {
            nodeId: edit.editNode.id,
            properties: propertiesList,
            sendNotification: edit.sendNotificationPendingSave
        };
        console.log("calling saveNode(). PostData=" + util.toJson(postData));
        util.json("saveNode", postData, edit.saveNodeResponse, null, {
            savedId: edit.editNode.id
        });
        edit.sendNotificationPendingSave = false;
    }
    else {
        console.log("nothing changed. Nothing to save.");
    }
};
EditNodeDlg_.makeMultiPropEditor = function (propEntry) {
    console.log("Making Multi Editor: Property multi-type: name=" + propEntry.property.name + " count="
        + propEntry.property.values.length);
    var fields = "";
    propEntry.subProps = [];
    var propList = propEntry.property.values;
    if (!propList || propList.length == 0) {
        propList = [];
        propList.push("");
    }
    for (var i = 0; i < propList.length; i++) {
        console.log("prop multi-val[" + i + "]=" + propList[i]);
        var id = this.id(propEntry.id + "_subProp" + i);
        var propVal = propEntry.binary ? "[binary]" : propList[i];
        var propValStr = propVal || '';
        propValStr = propVal.escapeForAttrib();
        var label = (i == 0 ? propEntry.property.name : "*") + "." + i;
        console.log("Creating textarea with id=" + id);
        var subProp = new SubProp(id, propVal);
        propEntry.subProps.push(subProp);
        if (propEntry.binary || propEntry.readOnly) {
            fields += render.tag("paper-textarea", {
                "id": id,
                "readonly": "readonly",
                "disabled": "disabled",
                "label": label,
                "value": propValStr
            }, '', true);
        }
        else {
            fields += render.tag("paper-textarea", {
                "id": id,
                "label": label,
                "value": propValStr
            }, '', true);
        }
    }
    return fields;
};
EditNodeDlg_.makeSinglePropEditor = function (propEntry, aceFields) {
    console.log("Property single-type: " + propEntry.property.name);
    var field = "";
    var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
    var label = render.sanitizePropertyName(propEntry.property.name);
    var propValStr = propVal ? propVal : '';
    propValStr = propValStr.escapeForAttrib();
    console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.val
        + "] fieldId=" + propEntry.id);
    if (propEntry.readOnly || propEntry.binary) {
        field += render.tag("paper-textarea", {
            "id": propEntry.id,
            "readonly": "readonly",
            "disabled": "disabled",
            "label": label,
            "value": propValStr
        }, "", true);
    }
    else {
        if (!cnst.USE_ACE_EDITOR) {
            field += render.tag("paper-textarea", {
                "id": propEntry.id,
                "label": label,
                "value": propValStr
            }, '', true);
        }
        else {
            field += render.tag("div", {
                "id": propEntry.id,
                "class": "ace-edit-panel",
                "html": "true"
            }, '', true);
            aceFields.push({
                id: propEntry.id,
                val: propValStr
            });
        }
    }
    return field;
};
EditNodeDlg_.init = function () {
    console.log("EditNodeDlg.init");
    this.populateEditNodePg();
};
//# sourceMappingURL=EditNodeDlg.js.map