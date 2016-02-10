console.log("running module: EditNodeDlg.js");

/*
 * Editor Dialog (Edits Nodes)
 * 
 * 
 */
var EditNodeDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);

	this.domId = "EditNodeDlg";
}

// more boilerplate for inheritance
EditNodeDlg.prototype.constructor = EditNodeDlg;
util.inherit(Dialog, EditNodeDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
EditNodeDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Edit Node");

	var saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", EditNodeDlg.prototype.saveNode, this);
	var addPropertyButton = this.makeButton("Add Property", "addPropertyButton", EditNodeDlg.prototype.addProperty, this);
	var makeNodeReferencableButton = this.makeButton("Make Node Referencable", "makeNodeReferencableButton",
			"edit.makeNodeReferencable();");
	var splitContentButton = this.makeButton("Split Content", "splitContentButton", "edit.splitContent();");
	var cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", "edit.cancelEdit();");

	var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + makeNodeReferencableButton
			+ splitContentButton + cancelEditButton);

	var width = window.innerWidth * 0.6;
	var height = window.innerHeight * 0.4;

	var internalMainContent = "<div id='" + this.id("editNodePathDisplay") + "' class='path-display-in-editor'></div>" + //
	"<div id='"+this.id("editNodeInstructions")+"'></div>" + //
	"<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;\" id='"
			+ this.id("propertyEditFieldContainer") + "'>Loading propertyEditFieldContainer...</div>";

	return header + internalMainContent + buttonBar;
}

/*
 * Generates all the HTML edit fields and puts them into the DOM model of the
 * property editor dialog box.
 * 
 */
EditNodeDlg.prototype.populateEditNodePg = function() {
	
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
		
		// Iterate PropertyInfo.java objects
		$.each(edit.editNode.properties, function(index, prop) {

			/*
			 * if property not allowed to display return to bypass this
			 * property/iteration
			 */
			if (!render.allowPropertyToDisplay(prop.name)) {
				console.log("Hiding property: " + prop.name);
				return;
			}

			// todo: search other parts of code and make sure dialog-specific id is used where needed (only on element access)
			var fieldId = "editNodeTextContent" + counter;

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
				debugger;
				buttonBar = _this.makePropertyEditButtonBar(prop, fieldId);
			}

			var field = buttonBar;

			if (isMulti) {
				field += _this.makeMultiPropEditor(fieldId, prop, isReadOnlyProp, isBinaryProp);
			} else {
				field += _this.makeSinglePropEditor(fieldId, prop, isReadOnlyProp, isBinaryProp);
			}

			fields += render.tag("div", {
				"class" : "genericListItem"
			}, field);
			counter++;
		});
	} //
	else {
		var field = render.tag("paper-textarea", {
			"id" : this.id("newNodeNameId"),
			"label" : "New Node Name"
		}, '', true);

		fields += render.tag("div", {}, field);
	}

	util.setHtmlEnhanced(this.id("propertyEditFieldContainer"), fields);

	var instr = edit.editingUnsavedNode ? //
	"You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
			: //
			"";

	$("#"+this.id("editNodeInstructions")).html(instr);

	/*
	 * Allow adding of new properties as long as this is a saved node we are
	 * editing, because we don't want to start managing new properties on the
	 * client side. We need a genuine node already saved on the server before we
	 * allow any property editing to happen.
	 */
	util.setVisibility("#"+this.id("addPropertyButton"), !edit.editingUnsavedNode);

	var isUuid = edit.editNode && edit.editNode.id && !edit.editNode.id.startsWith("/");
	// console.log("isUuid: " + isUuid);
	util.setVisibility("#"+this.id("makeNodeReferencableButton"), edit.editNode && !isUuid && !edit.editingUnsavedNode);
}

EditNodeDlg.prototype.addProperty = function() {
	(new EditPropertyDlg(this)).open();
}

/*
 * Note: fieldId parameter is already dialog-specific and doesn't need id()
 * wrapper function
 */
EditNodeDlg.prototype.makePropertyEditButtonBar = function(prop, fieldId) {
	var buttonBar = "";
	
	
	var clearButton = render.tag("paper-button", //
	{
		"raised" : "raised",
		"onClick" : "meta64.getObjectByGuid("+this.guid+").clearProperty('" + fieldId + "');" //
	}, //
	"Clear");

	var addMultiButton = "";
	var deleteButton = "";

	if (prop.name !== jcrCnst.CONTENT) {
		/*
		 * For now we just go with the design where the actual content property
		 * cannot be deleted. User can leave content blank but not delete it.
		 */
		deleteButton = render.tag("paper-button", //
		{
			"raised" : "raised",
			"onClick" : "meta64.getObjectByGuid("+this.guid+").deleteProperty('" + prop.name + "');" //
		}, //
		"Del");

		/*
		 * I don't think it really makes sense to allow a jcr:content property
		 * to be multivalued. I may be wrong but this is my current assumption
		 */
		addMultiButton = render.tag("paper-button", //
		{
			"raised" : "raised",
			"onClick" : "meta64.getObjectByGuid("+this.guid+").addSubProperty('" + fieldId + "');" //
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

EditNodeDlg.prototype.addSubProperty = function(fieldId) {
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
	 * TODO: for performance we could do something simpler than
	 * 'populateEditNodePg' here, but for now we just rerendering the
	 * entire edit page.
	 */
	prop.values.push('');
	
	this.populateEditNodePg();
}

/*
 * Deletes the property of the specified name on the node being edited,
 * but first gets confirmation from user
 */
EditNodeDlg.prototype.deleteProperty = function(propName) {
	var _this = this;
	(new ConfirmDlg("Confirm Delete", "Delete the Property", "Yes, delete.", function() {
		_this.deletePropertyImmediate(propName);
	})).open();
}

EditNodeDlg.prototype.deletePropertyImmediate = function(propName) {

	var ironRes = util.json("deleteProperty", {
		"nodeId" : edit.editNode.id,
		"propName" : propName
	});

	var _this = this;
	
	ironRes.completes.then(function() {
		//todo: not sure if 'this' will be correct here (using _this until I check)
		_this.deletePropertyResponse(ironRes.response, propName);
	});
}

EditNodeDlg.prototype.deletePropertyResponse = function(res, propertyToDelete) {

	if (util.checkSuccess("Delete property", res)) {

		/*
		 * remove deleted property from client side storage, so we can
		 * re-render screen without making another call to server
		 */
		props.deletePropertyFromLocalData(propertyToDelete);

		/* now just re-render screen from local variables */
		meta64.treeDirty = true;
		
		this.populateEditNodePg();
	}
}

EditNodeDlg.prototype.clearProperty = function(fieldId) {
	util.setInputVal(this.id(fieldId), "");
	
	/* scan for all multi-value property fields and clear them */
	var counter = 0;
	while (counter < 1000) {
		if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
			break;
		}
		counter++;
	}
}

/*
 * for now just let server side choke on invalid things. It has enough
 * security and validation to at least protect itself from any kind of
 * damage.
 */
EditNodeDlg.prototype.saveNode = function() {

	/*
	 * If editing an unsaved node it's time to run the insertNode, or
	 * createSubNode, which actually saves onto the server, and will
	 * initiate further editing like for properties, etc.
	 */
	if (edit.editingUnsavedNode) {
		this.saveNewNode();
	}
	/*
	 * Else we are editing a saved node, which is already saved on
	 * server.
	 */
	else {
		this.saveExistingNode();
	}
}

EditNodeDlg.prototype.saveNewNode = function(newNodeName) {
	debugger;
	if (!newNodeName) {
		newNodeName = util.getInputVal(this.id("newNodeNameId"));
	}

	/*
	 * If we didn't create the node we are inserting under, and neither
	 * did "admin", then we need to send notification email upon saving
	 * this new node.
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

EditNodeDlg.prototype.saveExistingNode = function() {
	console.log("**************** saveExistingNode");
	debugger;
	var propertiesList = [];
	var counter = 0;
	var changeCount = 0;

	// iterate for all fields we can find
	while (true) {
		//todo: this id needs this.id() for it for dialog-specific value.
		var fieldId = "editNodeTextContent" + counter;

		/*
		 * is this an existing gui edit field, that's savable.
		 */
		if (meta64.fieldIdToPropMap.hasOwnProperty(fieldId)) {

			console.log("Saving property field: " + fieldId);

			/*
			 * Since the Readonly ones are prefixed with RdOnly_ in
			 * front of fieldId, those won't exist and elementExists
			 * bypasses them
			 */
			if (util.elementExists(this.id(fieldId))) {
				console.log("Element exists: " + fieldId);

				var prop = meta64.fieldIdToPropMap[fieldId];
				var propVal = util.getTextAreaValById(this.id(fieldId));

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
					//todo: find other places where _subProp is used and make sure id is dialog-relative
					var subPropId = fieldId + "_subProp" + subPropIdx;
					if (util.elementExists(this.id(subPropId))) {
						console.log("Element subprop exists: " + subPropId);

						var propVal = util.getTextAreaValById(this.id(subPropId));
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
		util.json("saveNode", postData, edit.saveNodeResponse);
		edit.sendNotificationPendingSave = false;
	} else {
		console.log("nothing chaged. Nothing to save.");
	}
}

EditNodeDlg.prototype.makeMultiPropEditor = function(fieldId, prop, isReadOnlyProp, isBinaryProp) {
	console.log("************* Making Multi Editor: Property multi-type: name=" + prop.name + " count="
			+ prop.values.length);
	var fields = '';

	var propList = prop.values;
	if (!propList || propList.length == 0) {
		propList = [];
		propList.push("");
	}

	for (var i = 0; i < propList.length; i++) {
		console.log("prop multi-val[" + i + "]=" + propList[i]);
		var id = fieldId + "_subProp" + i;

		var propVal = isBinaryProp ? "[binary]" : propList[i];
		var propValStr = propVal ? propVal : '';
		propValStr = propVal.escapeForAttrib();
		var label = (i == 0 ? prop.name : "*") + "." + i;

		console.log("Creating textarea with id=" + id);

		if (isBinaryProp || isReadOnlyProp) {
			fields += render.tag("paper-textarea", {
				"id" : this.id(id),
				"readonly" : "readonly",
				"disabled" : "disabled",
				"label" : label,
				"value" : propValStr
			}, '', true);
		} else {
			fields += render.tag("paper-textarea", {
				"id" : this.id(id),
				"label" : label,
				"value" : propValStr
			}, '', true);
		}
	}
	return fields;
}

EditNodeDlg.prototype.makeSinglePropEditor = function(fieldId, prop, isReadOnlyProp, isBinaryProp) {
	console.log("Property single-type: " + prop.name);

	var field = '';

	var propVal = isBinaryProp ? "[binary]" : prop.value;
	var label = render.sanitizePropertyName(prop.name);
	var propValStr = propVal ? propVal : '';
	propValStr = propValStr.escapeForAttrib();
	console.log("editing: prop[" + prop.name + "] val[" + prop.val + "]");

	if (isReadOnlyProp || isBinaryProp) {
		field += render.tag("paper-textarea", {
			"id" : this.id(fieldId),
			"readonly" : "readonly",
			"disabled" : "disabled",
			"label" : label,
			"value" : propValStr
		}, '', true);
	} else {
		field += render.tag("paper-textarea", {
			"id" : this.id(fieldId),
			"label" : label,
			"value" : propValStr
		}, '', true);
	}
	return field;
}

EditNodeDlg.prototype.init = function() {
	console.log("EditNodeDlg.init");
	this.populateEditNodePg();
}

// # sourceURL=EditNodeDlg.js
