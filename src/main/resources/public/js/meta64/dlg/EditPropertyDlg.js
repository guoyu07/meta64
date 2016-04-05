console.log("running module: EditPropertyDlg.js");

/*
 * Property Editor Dialog (Edits Node Properties)
 * 
 */
var EditPropertyDlg = function(editNodeDlg) {
	// boiler plate for inheritance
	Dialog.call(this);
	this.editNodeDlg = editNodeDlg;
	this.domId = "EditPropertyDlg";
	if (this.editNodeDlg.domId!="EditNodeDlg") {
		console.log("error: incorrect object for EditNodeDlg");
	}
	//console.log("***************** printKeys.this.EditNodeDlg(in property editor constructorconstructor): "+util.printKeys(editNodeDlg));
}

// more boilerplate for inheritance
EditPropertyDlg.prototype.constructor = EditPropertyDlg;
util.inherit(Dialog, EditPropertyDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
EditPropertyDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Edit Node Property");

	var savePropertyButton = this.makeCloseButton("Save", "savePropertyButton", EditPropertyDlg.prototype.saveProperty,
			this);
	var cancelEditButton = this.makeCloseButton("Cancel", "editPropertyPgCloseButton");

	var buttonBar = render.centeredButtonBar(savePropertyButton + cancelEditButton);

	var internalMainContent = "<div id='" + this.id("editPropertyPathDisplay")
			+ "' class='path-display-in-editor'></div>" + //
			"<div id='" + this.id("addPropertyFieldContainer") + "'></div>";

	return header + internalMainContent + buttonBar;
}

EditPropertyDlg.prototype.populatePropertyEdit = function() {
	var field = '';

	/* Property Name Field */
	{
		var fieldPropNameId = "addPropertyNameTextContent";

		field += render.tag("paper-textarea", {
			"name" : fieldPropNameId,
			"id" : this.id(fieldPropNameId),
			"placeholder" : "Enter property name",
			"label" : "Name"
		}, "", true);
	}

	/* Property Value Field */
	{
		var fieldPropValueId = "addPropertyValueTextContent";

		field += render.tag("paper-textarea", {
			"name" : fieldPropValueId,
			"id" : this.id(fieldPropValueId),
			"placeholder" : "Enter property text",
			"label" : "Value"
		}, "", true);
	}
	
	/* display the node path at the top of the edit page */
	view.initEditPathDisplayById(this.id("editPropertyPathDisplay"));

	util.setHtmlEnhanced(this.id("addPropertyFieldContainer"), field);
}

EditPropertyDlg.prototype.saveProperty = function() {
	var propertyNameData = util.getInputVal(this.id("addPropertyNameTextContent"));
	var propertyValueData = util.getInputVal(this.id("addPropertyValueTextContent"));

	var postData = {
		nodeId : edit.editNode.id,
		propertyName : propertyNameData,
		propertyValue : propertyValueData
	};
	util.json("saveProperty", postData, EditPropertyDlg.prototype.savePropertyResponse, this);
}

/* Warning: don't confuse with EditNodeDlg */
EditPropertyDlg.prototype.savePropertyResponse = function(res) {
	util.checkSuccess("Save properties", res);

	edit.editNode.properties.push(res.propertySaved);
	meta64.treeDirty = true;
	
	if (this.editNodeDlg.domId!="EditNodeDlg") {
		console.log("error: incorrect object for EditNodeDlg");
	}
	this.editNodeDlg.populateEditNodePg();
}

EditPropertyDlg.prototype.init = function() {
	this.populatePropertyEdit();
}

//# sourceURL=EditPropertyDlg.js
