console.log("running module: Dialog.js");

var Dialog = function() {
	this.data = {};
	meta64.registerDataObject(this.data);
}
Dialog.prototype.constructor = Dialog;

Dialog.prototype.open = function () {

	/*
	 * get container where all dialogs are created (true polymer
	 * dialogs)
	 */
	var modalsContainer = util.polyElm("modalsContainer");

	/* suffix domId for this instance/guid */
	var domId = this.domId + "-" + this.data.guid;

	/*
	 * TODO. IMPORTANT: need to put code in to remove this dialog
	 * from the dom once it's closed, AND that same code should
	 * delete the guid's object in map in this module
	 */
	var node = document.createElement("paper-dialog");
	node.setAttribute("modal", "modal");
	node.setAttribute("id", domId);
	modalsContainer.node.appendChild(node);

	Polymer.dom.flush(); // <---- is this needed ? todo
	Polymer.updateStyles();

	/* now we we finally can construct the dialog instance */
	///////////////
	//if (!pg.built || data) {
		var content = this.build();
		util.setHtmlEnhanced(this.domId + "-" + this.data.guid, content);
		this.built = true;
	//}

	if (this.init) {
		this.init();
	}
	///////////////

	console.log("Showing dialog: " + domId);

	/* now open and display polymer dialog we just created */
	var polyElm = util.polyElm(domId);
	polyElm.node.refit();
	polyElm.node.constrain();
	polyElm.node.center();
	polyElm.node.open();
}

/*
 * Helper method to get the true id that is specific to this dialog (i.e. guid suffix appended)
 */
Dialog.prototype.id = function(id) {
	return id + "-" + this.data.guid;
}

Dialog.prototype.makePasswordField = function(text, id) {
	return render.makePasswordField(text, this.id(id));
}

Dialog.prototype.makeCloseButton = function(text, id, callback) {

	if (callback === undefined) {
		callback = "";
	}

	return render.tag("paper-button", {
		"raised" : "raised",
		"dialog-confirm" : "dialog-confirm",
		"id" : this.id(id),
		"onClick" : callback
	}, text, true);
}

Dialog.prototype.setHtml = function(text, id) {
	util.setHtml(this.id(id), text);
}

//# sourceURL=Dialog.js