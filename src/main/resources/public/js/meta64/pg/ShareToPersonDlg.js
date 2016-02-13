console.log("running module: ShareToPersonDlg.js");

/*
 * Class constructor
 */
var ShareToPersonDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "ShareToPersonDlg";
}

// more boilerplate for inheritance
ShareToPersonDlg.prototype.constructor = ShareToPersonDlg;
util.inherit(Dialog, ShareToPersonDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ShareToPersonDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Share Node to Person");

	var formControls = this.makeEditField("User to Share With", "shareToUserName");
	var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", ShareToPersonDlg.prototype.shareNodeToPerson, this);
	var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
	var buttonBar = render.centeredButtonBar(shareButton + backButton);

	return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls + buttonBar;
}

ShareToPersonDlg.prototype.shareNodeToPerson = function() {
	var targetUser = this.getInputVal("shareToUserName");
	if (!targetUser) {
		(new MessageDlg("Please enter a username")).open();
		return;
	}

	/*
	 * Trigger going to server at next main page refresh
	 */
	meta64.treeDirty = true;
	var This = this;
	util.json("addPrivilege", {
		"nodeId" : share.sharingNode.id,
		"principal" : targetUser,
		"privileges" : [ "read", "write", "addChildren", "nodeTypeManagement" ]
	}, This.reloadFromShareWithPerson);
}

ShareToPersonDlg.prototype.reloadFromShareWithPerson = function(res) {
	if (util.checkSuccess("Share Node with Person", res)) {
		meta64.changePage(sharingPg);
	}
}

ShareToPersonDlg.prototype.init = function() {
}

//# sourceURL=ShareToPersonDlg.js
