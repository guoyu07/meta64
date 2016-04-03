console.log("running module: Dialog.js");

/*
 * Base class for all dialog boxes.
 * 
 * todo: when refactoring all dialogs to this new base-class design I'm always
 * creating a new dialog each time, so the next optimization will be to make
 * certain dialogs (indeed most of them) be able to behave as singletons once
 * they have been constructed where they merely have to be reshown and
 * repopulated to reopen one of them, and closing any of them is merely done by
 * making them invisible.
 */
var Dialog = function() {
	this.data = {};

	/*
	 * We register 'this' so we can do meta64.getObjectByGuid in onClick methods
	 * on the dialog and be able to have 'this'available to the functions.
	 */
	meta64.registerDataObject(this);
	meta64.registerDataObject(this.data);
}

Dialog.prototype.constructor = Dialog;

Dialog.prototype.open = function() {

	/*
	 * get container where all dialogs are created (true polymer dialogs)
	 */
	var modalsContainer = util.polyElm("modalsContainer");

	/* suffix domId for this instance/guid */
	var id = this.id(this.domId);

	/*
	 * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
	 * once it's closed, AND that same code should delete the guid's object in
	 * map in this module
	 */
	var node = document.createElement("paper-dialog");

	/*
	 * Unfortunately Google Polymer totally hangs if you try to open a dialog on
	 * top of another dialog if they are modal so we have to do without the
	 * modal flag until google fixes this.
	 */
	// node.setAttribute("modal", "modal");
	node.setAttribute("id", id);
	modalsContainer.node.appendChild(node);
	
	//todo-3: this was an experiment. do it correctly now.
	node.style.border = "8px solid gray";

	Polymer.dom.flush(); // <---- is this needed ? todo
	Polymer.updateStyles();

	// try {
	var content = this.build();
	util.setHtmlEnhanced(id, content);
	this.built = true;

	if (this.init) {
		console.log("init() for dialog domId=" + this.domId);
		this.init();
		console.log("init() complete for dialog domId=" + this.domId);
	}
	// } catch (ex) {
	// (console.error || console.log).call(console, ex.stack || ex);
	// }
	console.log("Showing dialog: " + id);

	/* now open and display polymer dialog we just created */
	var polyElm = util.polyElm(id);
	polyElm.node.refit();
	polyElm.node.constrain();
	polyElm.node.center();
	polyElm.node.open();
}

/* todo: need to cleanup the registered IDs that are in maps for this dialog */
Dialog.prototype.cancel = function() {
	var polyElm = util.polyElm(this.id(this.domId));
	polyElm.node.cancel();
}

/*
 * Helper method to get the true id that is specific to this dialog (i.e. guid
 * suffix appended)
 */
Dialog.prototype.id = function(id) {
	if (id == null)
		return null;

	/* if dialog already suffixed */
	if (id.contains("_dlgId")) {
		return id;
	}
	return id + "_dlgId" + this.data.guid;
}

Dialog.prototype.makePasswordField = function(text, id) {
	return render.makePasswordField(text, this.id(id));
}

Dialog.prototype.makeEditField = function(fieldName, id) {
	return render.tag("paper-input", {
		"name" : this.id(id),
		"label" : fieldName,
		"id" : this.id(id)
	}, "", true);
}

// todo: there's a makeButton (and other similar methods) that don't have the
// encodeCallback capability yet
Dialog.prototype.makeButton = function(text, id, callback, ctx) {
	var attribs = {
		"raised" : "raised",
		"id" : this.id(id)
	};

	if (callback != undefined) {
		attribs.onClick = meta64.encodeOnClick(callback, ctx);
	}

	return render.tag("paper-button", attribs, text, true);
}

Dialog.prototype.makeCloseButton = function(text, id, callback, ctx) {

	var attribs = {
		"raised" : "raised",
		//warning: this dialog-confirm is required (logic fails without)
		"dialog-confirm" : "dialog-confirm",
		"id" : this.id(id)
	};

	if (callback != undefined) {
		attribs.onClick = meta64.encodeOnClick(callback, ctx);
	}

	return render.tag("paper-button", attribs, text, true);
}

Dialog.prototype.bindEnterKey = function(id, callback) {
	util.bindEnterKey(this.id(id), callback);
}

Dialog.prototype.setInputVal = function(id, val) {
	if (!val) {
		val = "";
	}
	util.setInputVal(this.id(id), val);
}

Dialog.prototype.getInputVal = function(id) {
	return util.getInputVal(this.id(id)).trim();
}

Dialog.prototype.setHtml = function(text, id) {
	util.setHtml(this.id(id), text);
}

Dialog.prototype.makeRadioButton = function(label, id) {
	return render.tag("paper-radio-button", //
	{
		"id" : this.id(id),
		"name" : this.id(id)
	}, label);
}

//# sourceURL=Dialog.js
