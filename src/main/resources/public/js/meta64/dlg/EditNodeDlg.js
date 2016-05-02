console.log("running module: EditNodeDlg.js");

/*
 * Editor Dialog (Edits Nodes)
 * 
 */
var EditNodeDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);

	this.domId = "EditNodeDlg";
}

// more boilerplate for inheritance
var EditNodeDlg_ = util.inherit(Dialog, EditNodeDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
EditNodeDlg_.build = function() {
	var header = render.makeDialogHeader("Edit Node");

	var saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", EditNodeDlg_.saveNode, this);
	var addPropertyButton = this.makeButton("Add Property", "addPropertyButton", EditNodeDlg_.addProperty, this);
	var addTagsPropertyButton = this.makeButton("Add Tags Property", "addTagsPropertyButton",
			EditNodeDlg_.addTagsProperty, this);
	// this split works afaik, but I don't want it enabled yet.
	// var splitContentButton = this.makeButton("Split Content",
	// "splitContentButton", "edit.splitContent();");
	var cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", "edit.cancelEdit();", this);

	var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton
	/* + splitContentButton */+ cancelEditButton, "buttons");

	var width = window.innerWidth * 0.6;
	var height = window.innerHeight * 0.4;

	var internalMainContent = "<div id='" + this.id("editNodePathDisplay") + "' class='path-display-in-editor'></div>" + //
	"<div id='" + this.id("editNodeInstructions") + "'></div>" + //
	"<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
			+ this.id("propertyEditFieldContainer") + "'>Loading...</div>";

	return header + internalMainContent + buttonBar;
}

/*
 * Generates all the HTML edit fields and puts them into the DOM model of the
 * property editor dialog box.
 * 
 */
EditNodeDlg_.populateEditNodePg = function() {

	/* display the node path at the top of the edit page */
	view.initEditPathDisplayById(this.id("editNodePathDisplay"));

	var fields = '';
	var counter = 0;

	/* clear this map to get rid of old properties */
	meta64.fieldIdToPropMap = {};

	/* editNode will be null if this is a new node being created */
	if (edit.editNode) {

		/* iterator function will have the wrong 'this' so we save the right one */
		var _this = this;
		var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode.properties);

		var aceFields = [];

		// Iterate PropertyInfo.java objects
		/*
		 * Warning each iterator loop has its own 'this'
		 */
		$.each(editOrderedProps, function(index, prop) {

			/*
			 * if property not allowed to display return to bypass this
			 * property/iteration
			 */
			if (!render.allowPropertyToDisplay(prop.name)) {
				// console.log("Hiding property: " + prop.name);
				return;
			}

			var fieldId = _this.id("editNodeTextContent" + counter);
			console.log("Creating edit field " + fieldId + " for property " + prop.name);

			meta64.fieldIdToPropMap[fieldId] = prop;

			var isMulti = prop.values && prop.values.length > 0;

			var isReadOnlyProp = render.isReadOnlyProperty(prop.name);
			var isBinaryProp = render.isBinaryProperty(prop.name);

			/*
			 * this is the way (for now) that we make sure this node won't be
			 * attempted to be saved. If it has RdOnly_ prefix it won't be found
			 * by the saving logic.
			 */
			if (isReadOnlyProp || isBinaryProp) {
				fieldId = "RdOnly_" + fieldId;
			}

			var buttonBar = "";
			if (!isReadOnlyProp && !isBinaryProp) {
				buttonBar = _this.makePropertyEditButtonBar(prop, fieldId);
			}

			var field = buttonBar;

			if (isMulti) {
				field += _this.makeMultiPropEditor(fieldId, prop, isReadOnlyProp, isBinaryProp);
			} else {
				field += _this.makeSinglePropEditor(fieldId, prop, isReadOnlyProp, isBinaryProp, aceFields);
			}

			fields += render.tag("div", {
				"class" : "genericListItem"
			}, field);
			counter++;
		});
	} //
	else {
		if (cnst.USE_ACE_EDITOR) {
			var aceFieldId = this.id("newNodeNameId");

			fields += render.tag("div", {
				"id" : aceFieldId,
				"class" : "ace-edit-panel",
				"html" : "true"
			}, '', true);

			aceFields.push({
				id : aceFieldId,
				val : ""
			});
		} else {
			var field = render.tag("paper-textarea", {
				"id" : this.id("newNodeNameId"),
				"label" : "New Node Name"
			}, '', true);

			// todo-0: I can remove this div now ?
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

	var instr = edit.editingUnsavedNode ? //
	"You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
			: //
			"";

	$("#" + this.id("editNodeInstructions")).html(instr);

	/*
	 * Allow adding of new properties as long as this is a saved node we are
	 * editing, because we don't want to start managing new properties on the
	 * client side. We need a genuine node already saved on the server before we
	 * allow any property editing to happen.
	 */
	util.setVisibility("#" + this.id("addPropertyButton"), !edit.editingUnsavedNode);

	var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
	// console.log("hasTagsProp: " + tagsProp);
	util.setVisibility("#" + this.id("addTagsPropertyButton"), !tagsPropExists);
}

EditNodeDlg_.addProperty = function() {
	this.editPropertyDlgInst = new EditPropertyDlg(this);
	this.editPropertyDlgInst.open();
}

EditNodeDlg_.addTagsProperty = function() {
	if (props.getNodePropertyVal(edit.editNode, "tags")) {
		return;
	}

	var postData = {
		nodeId : edit.editNode.id,
		propertyName : "tags",
		propertyValue : ""
	};
	util.json("saveProperty", postData, EditNodeDlg_.addTagsPropertyResponse, this);
}

/* Warning: don't confuse with EditPropertyDlg */
EditNodeDlg_.addTagsPropertyResponse = function(res) {
	if (util.checkSuccess("Add Tags Property", res)) {
		this.savePropertyResponse(res);
	}
}

/* Warning: don't confuse with EditPropertyDlg */
EditNodeDlg_.savePropertyResponse = function(res) {
	util.checkSuccess("Save properties", res);

	edit.editNode.properties.push(res.propertySaved);
	meta64.treeDirty = true;

	if (this.domId != "EditNodeDlg") {
		console.log("error: incorrect object for EditNodeDlg");
	}
	this.populateEditNodePg();
}

/*
 * Note: fieldId parameter is already dialog-specific and doesn't need id()
 * wrapper function
 */
EditNodeDlg_.makePropertyEditButtonBar = function(prop, fieldId) {
	var buttonBar = "";

	var clearButton = render.tag("paper-button", {
		"raised" : "raised",
		"onClick" : "meta64.getObjectByGuid(" + this.guid + ").clearProperty('" + fieldId + "');" //
	}, //
	"Clear");

	var addMultiButton = "";
	var deleteButton = "";

	if (prop.name !== jcrCnst.CONTENT) {
		/*
		 * For now we just go with the design where the actual content property
		 * cannot be deleted. User can leave content blank but not delete it.
		 */
		deleteButton = render.tag("paper-button", {
			"raised" : "raised",
			"onClick" : "meta64.getObjectByGuid(" + this.guid + ").deleteProperty('" + prop.name + "');" //
		}, //
		"Del");

		/*
		 * I don't think it really makes sense to allow a jcr:content property
		 * to be multivalued. I may be wrong but this is my current assumption
		 */
		addMultiButton = render.tag("paper-button", {
			"raised" : "raised",
			"onClick" : "meta64.getObjectByGuid(" + this.guid + ").addSubProperty('" + fieldId + "');" //
		}, //
		"Add Multi");
	}

	var allButtons = addMultiButton + clearButton + deleteButton;
	if (allButtons.length > 0) {
		buttonBar = render.makeHorizontalFieldSet(allButtons, "property-edit-button-bar");
	} else {
		buttonBar = "";
	}

	return buttonBar;
}

EditNodeDlg_.addSubProperty = function(fieldId) {
	var prop = meta64.fieldIdToPropMap[fieldId];

	var isMulti = util.isObject(prop.values);

	/* convert to multi-type if we need to */
	if (!isMulti) {
		prop.values = [];
		prop.values.push(prop.value);
		prop.value = null;
	}

	/*
	 * now add new empty property and populate it onto the screen
	 * 
	 * TODO-3: for performance we could do something simpler than
	 * 'populateEditNodePg' here, but for now we just rerendering the entire
	 * edit page.
	 */
	prop.values.push('');

	this.populateEditNodePg();
}

/*
 * Deletes the property of the specified name on the node being edited, but
 * first gets confirmation from user
 */
EditNodeDlg_.deleteProperty = function(propName) {
	var _this = this;
	(new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function() {
		_this.deletePropertyImmediate(propName);
	})).open();
}

EditNodeDlg_.deletePropertyImmediate = function(propName) {

	var ironRes = util.json("deleteProperty", {
		"nodeId" : edit.editNode.id,
		"propName" : propName
	});

	var _this = this;

	ironRes.completes.then(function() {
		// not sure if 'this' will be correct here (using _this until I check)
		_this.deletePropertyResponse(ironRes.response, propName);
	});
}

EditNodeDlg_.deletePropertyResponse = function(res, propertyToDelete) {

	if (util.checkSuccess("Delete property", res)) {

		/*
		 * remove deleted property from client side storage, so we can re-render
		 * screen without making another call to server
		 */
		props.deletePropertyFromLocalData(propertyToDelete);

		/* now just re-render screen from local variables */
		meta64.treeDirty = true;

		this.populateEditNodePg();
	}
}

EditNodeDlg_.clearProperty = function(fieldId) {
	if (!cnst.USE_ACE_EDITOR) {
		util.setInputVal(this.id(fieldId), "");
	} else {
		var editor = meta64.aceEditorsById[this.id(fieldId)];
		if (editor) {
			editor.setValue("");
		}
	}

	/* scan for all multi-value property fields and clear them */
	var counter = 0;
	while (counter < 1000) {
		if (!cnst.USE_ACE_EDITOR) {
			if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
				break;
			}
		} else {
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
}

/*
 * for now just let server side choke on invalid things. It has enough security
 * and validation to at least protect itself from any kind of damage.
 */
EditNodeDlg_.saveNode = function() {

	/*
	 * If editing an unsaved node it's time to run the insertNode, or
	 * createSubNode, which actually saves onto the server, and will initiate
	 * further editing like for properties, etc.
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

EditNodeDlg_.saveNewNode = function(newNodeName) {
	if (!newNodeName) {
		newNodeName = util.getInputVal(this.id("newNodeNameId"));
	}

	/*
	 * If we didn't create the node we are inserting under, and neither did
	 * "admin", then we need to send notification email upon saving this new
	 * node.
	 */
	if (meta64.userName != edit.parentOfNewNode.createdBy && //
	edit.parentOfNewNode.createdBy != "admin") {
		edit.sendNotificationPendingSave = true;
	}

	meta64.treeDirty = true;
	if (edit.nodeInsertTarget) {
		util.json("insertNode", {
			"parentId" : edit.parentOfNewNode.id,
			"targetName" : edit.nodeInsertTarget.name,
			"newNodeName" : newNodeName
		}, edit.insertNodeResponse);
	} else {
		util.json("createSubNode", {
			"nodeId" : edit.parentOfNewNode.id,
			"newNodeName" : newNodeName
		}, edit.createSubNodeResponse);
	}
}

EditNodeDlg_.saveExistingNode = function() {
	console.log("saveExistingNode");
	var propertiesList = [];
	var counter = 0;
	var changeCount = 0;

	// iterate for all fields we can find
	while (true) {
		var fieldId = this.id("editNodeTextContent" + counter);

		/*
		 * is this an existing gui edit field, that's savable.
		 */
		if (meta64.fieldIdToPropMap.hasOwnProperty(fieldId)) {

			console.log("Saving property field: " + fieldId);

			/*
			 * Since the Readonly ones are prefixed with RdOnly_ in front of
			 * fieldId, those won't exist and elementExists bypasses them
			 */
			if (util.elementExists(fieldId)) {
				console.log("Element exists: " + fieldId);

				var prop = meta64.fieldIdToPropMap[fieldId];

				var propVal;

				if (cnst.USE_ACE_EDITOR) {
					var editor = meta64.aceEditorsById[fieldId];
					if (!editor)
						throw "Unable to find Ace Editor for ID: " + fieldId;
					propVal = editor.getValue();
					alert("Setting[" + propVal + "]");
				} else {
					propVal = util.getTextAreaValById(fieldId);
				}

				console.log("prop name: " + prop.name);

				var isMulti = prop.values && prop.values.length > 0;
				if (isMulti) {
					alert("multi prop not handled: fieldId=" + fieldId);
				} //
				else if (propVal !== prop.value) {
					console.log("Prop change: " + fieldId + " newVal=" + propVal);
					propertiesList.push({
						"name" : prop.name,
						"value" : propVal
					});

					changeCount++;
				} else {
					console.log("Prop didn't change: " + fieldId);
				}
			} else {
				console.log("Element doesn't exist: " + fieldId + " trying subprops");
				var subPropIdx = 0;
				var propVals = [];
				var prop = meta64.fieldIdToPropMap[fieldId];
				while (true) {
					// remember: fieldId is already dialog-specific
					var subPropId = fieldId + "_subProp" + subPropIdx;

					// note subPropId inherits dialog-specific key from fieldId
					if (util.elementExists(subPropId)) {
						console.log("Element subprop exists: " + subPropId);

						var propVal;
						if (cnst.USE_ACE_EDITOR) {
							var editor = meta64.aceEditorsById[subPropId];
							if (!editor)
								throw "Unable to find Ace Editor for subProp ID: " + subPropId;
							propVal = editor.getValue();
							alert("Setting[" + propVal + "]");
						} else {
							propVal = util.getTextAreaValById(subPropId);
						}

						console.log("prop: " + prop.name + " val[" + subPropIdx + "]=" + propVal);
						propVals.push(propVal);
					} else {
						console.log("Element subprop does not exist: " + subPropId);
						break;
					}
					subPropIdx++;
				}

				propertiesList.push({
					"name" : prop.name,
					"values" : propVals
				});

				changeCount++;
			}
		} else {
			break;
		}
		counter++;
	}

	/* if anything changed, save to server */
	if (changeCount > 0) {
		var postData = {
			nodeId : edit.editNode.id,
			properties : propertiesList,
			sendNotification : edit.sendNotificationPendingSave
		};
		console.log("running saveNode()");
		util.json("saveNode", postData, edit.saveNodeResponse);
		edit.sendNotificationPendingSave = false;
	} else {
		console.log("nothing chaged. Nothing to save.");
	}
}

EditNodeDlg_.makeMultiPropEditor = function(fieldId, prop, isReadOnlyProp, isBinaryProp) {
	console.log("Making Multi Editor: Property multi-type: name=" + prop.name + " count=" + prop.values.length);
	var fields = '';

	var propList = prop.values;
	if (!propList || propList.length == 0) {
		propList = [];
		propList.push("");
	}

	for (var i = 0; i < propList.length; i++) {
		console.log("prop multi-val[" + i + "]=" + propList[i]);
		var id = this.id(fieldId + "_subProp" + i);

		var propVal = isBinaryProp ? "[binary]" : propList[i];
		var propValStr = propVal ? propVal : '';
		propValStr = propVal.escapeForAttrib();
		var label = (i == 0 ? prop.name : "*") + "." + i;

		console.log("Creating textarea with id=" + id);

		if (isBinaryProp || isReadOnlyProp) {
			fields += render.tag("paper-textarea", {
				"id" : id,
				"readonly" : "readonly",
				"disabled" : "disabled",
				"label" : label,
				"value" : propValStr
			}, '', true);
		} else {
			fields += render.tag("paper-textarea", {
				"id" : id,
				"label" : label,
				"value" : propValStr
			}, '', true);
		}
	}
	return fields;
}

EditNodeDlg_.makeSinglePropEditor = function(fieldId, prop, isReadOnlyProp, isBinaryProp, aceFields) {
	console.log("Property single-type: " + prop.name);

	var field = '';

	var propVal = isBinaryProp ? "[binary]" : prop.value;
	var label = render.sanitizePropertyName(prop.name);
	var propValStr = propVal ? propVal : '';
	propValStr = propValStr.escapeForAttrib();
	// console.log("editing: prop[" + prop.name + "] val[" + prop.val + "]");

	if (isReadOnlyProp || isBinaryProp) {
		field += render.tag("paper-textarea", {
			"id" : this.id(fieldId),
			"readonly" : "readonly",
			"disabled" : "disabled",
			"label" : label,
			"value" : propValStr
		}, '', true);
	} else {
		if (!cnst.USE_ACE_EDITOR) {
			field += render.tag("paper-textarea", {
				"id" : this.id(fieldId),
				"label" : label,
				"value" : propValStr
			}, '', true);
		} else {
			var aceFieldId = this.id(fieldId);

			field += render.tag("div", {
				"id" : aceFieldId,
				"class" : "ace-edit-panel",
				"html" : "true"
			}, '', true);

			aceFields.push({
				id : aceFieldId,
				val : propValStr
			});
		}
	}
	return field;
}

EditNodeDlg_.init = function() {
	console.log("EditNodeDlg.init");
	this.populateEditNodePg();
}

// # sourceURL=EditNodeDlg.js
