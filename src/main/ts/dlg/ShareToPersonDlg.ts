
console.log("running module: ShareToPersonDlg.js");

var ShareToPersonDlg = function() {
	Dialog.call(this);
	this.domId = "ShareToPersonDlg";
}

var ShareToPersonDlg_ = util.inherit(Dialog, ShareToPersonDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ShareToPersonDlg_.build = function() {
	var header = this.makeHeader("Share Node to Person");

	var formControls = this.makeEditField("User to Share With", "shareToUserName");
	var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", ShareToPersonDlg_.shareNodeToPerson,
			this);
	var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
	var buttonBar = render.centeredButtonBar(shareButton + backButton);

	return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
			+ buttonBar;
}

ShareToPersonDlg_.shareNodeToPerson = function() {
	var targetUser = this.getInputVal("shareToUserName");
	if (!targetUser) {
		(new MessageDlg("Please enter a username")).open();
		return;
	}

	/*
	 * Trigger going to server at next main page refresh
	 */
	meta64.treeDirty = true;
	var thiz = this;
	util.json("addPrivilege", {
		"nodeId" : share.sharingNode.id,
		"principal" : targetUser,
		"privileges" : [ "read", "write", "addChildren", "nodeTypeManagement" ]
	}, thiz.reloadFromShareWithPerson);
}

ShareToPersonDlg_.reloadFromShareWithPerson = function(res) {
	if (util.checkSuccess("Share Node with Person", res)) {
		(new SharingDlg()).open();
	}
}

ShareToPersonDlg_.init = function() {
}

//# sourceURL=ShareToPersonDlg.js
