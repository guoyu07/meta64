
console.log("running module: SharingDlg.js");

var SharingDlg = function() {
    Dialog.call(this);
    this.domId = "SharingDlg";
}

var SharingDlg_ = util.inherit(Dialog, SharingDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
SharingDlg_.build = function() {
    var header = this.makeHeader("Node Sharing");

    var shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton",
        SharingDlg_.shareNodeToPersonPg, this);
    var makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", SharingDlg_.shareNodeToPublic,
        this);
    var backButton = this.makeCloseButton("Close", "closeSharingButton");

    var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);

    var width = window.innerWidth * 0.6;
    var height = window.innerHeight * 0.4;

    var internalMainContent = "<div id='" + this.id("shareNodeNameDisplay") + "'></div>" + //
        "<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
        + this.id("sharingListFieldContainer") + "'></div>";

    return header + internalMainContent + buttonBar;
}

SharingDlg_.init = function() {
    this.reload();
}

/*
 * Gets privileges from server and displays in GUI also. Assumes gui is already at correct page.
 */
SharingDlg_.reload = function() {
    console.log("Loading node sharing info.");

    util.json("getNodePrivileges", {
        "nodeId": share.sharingNode.id,
        "includeAcl": true,
        "includeOwners": true
    }, SharingDlg_.getNodePrivilegesResponse, this);
}

/*
 * Handles getNodePrivileges response.
 *
 * res=json of GetNodePrivilegesResponse.java
 *
 * res.aclEntries = list of AccessControlEntryInfo.java json objects
 */
SharingDlg_.getNodePrivilegesResponse = function(res) {
    this.populateSharingPg(res);
}

/*
 * Processes the response gotten back from the server containing ACL info so we can populate the sharing page in the gui
 */
SharingDlg_.populateSharingPg = function(res) {
    var html = "";
    var This = this;

    $.each(res.aclEntries, function(index, aclEntry) {
        html += "<h4>User: " + aclEntry.principalName + "</h4>";
        html += render.tag("div", {
            "class": "privilege-list"
        }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
    });

    var thiz = this;
    var publicAppendAttrs = {
        "onClick": "meta64.getObjectByGuid(" + thiz.guid + ").publicCommentingChanged();",
        "name": "allowPublicCommenting",
        "id": this.id("allowPublicCommenting")
    };

    if (res.publicAppend) {
        publicAppendAttrs["checked"] = "checked";
    }

    /* todo: use actual polymer paper-checkbox here */
    html += render.tag("paper-checkbox", publicAppendAttrs, "", false);

    html += render.tag("label", {
        "for": this.id("allowPublicCommenting")
    }, "Allow public commenting under this node.", true);

    util.setHtmlEnhanced(this.id("sharingListFieldContainer"), html);
},

    SharingDlg_.publicCommentingChanged = function() {

        /*
         * Using onClick on the element AND this timeout is the only hack I could find to get get what amounts to a state
         * change listener on a paper-checkbox. The documented on-change listener simply doesn't work and appears to be
         * simply a bug in google code AFAIK.
         */
        var thiz = this;
        setTimeout(function() {
            var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));

            meta64.treeDirty = true;

            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "publicAppend": polyElm.node.checked ? "true" : "false"
            });

        }, 250);
    },

    SharingDlg_.removePrivilege = function(principal, privilege) {
        /*
         * Trigger going to server at next main page refresh
         */
        meta64.treeDirty = true;

        util.json("removePrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": principal,
            "privilege": privilege
        }, SharingDlg_.removePrivilegeResponse, this);
    }

SharingDlg_.removePrivilegeResponse = function(res) {

    util.json("getNodePrivileges", {
        "nodeId": share.sharingNode.path,
        "includeAcl": true,
        "includeOwners": true
    }, SharingDlg_.getNodePrivilegesResponse, this);
}

SharingDlg_.renderAclPrivileges = function(principal, aclEntry) {
    var ret = "";
    var thiz = this;
    $.each(aclEntry.privileges, function(index, privilege) {

        var removeButton = thiz.makeButton("Remove", "removePrivButton", //
            "meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
            + "');");

        var row = render.makeHorizontalFieldSet(removeButton);

        row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";

        ret += render.tag("div", {
            "class": "privilege-entry"
        }, row);
    });
    return ret;
}

SharingDlg_.shareNodeToPersonPg = function() {
    (new ShareToPersonDlg()).open();
}

SharingDlg_.shareNodeToPublic = function() {
    console.log("Sharing node to public.");

	/*
	 * Trigger going to server at next main page refresh
	 */
    meta64.treeDirty = true;

	/*
	 * Add privilege and then reload share nodes dialog from scratch doing another callback to server
	 *
	 * TODO: this additional call can be avoided as an optimization
	 */
    util.json("addPrivilege", {
        "nodeId": share.sharingNode.id,
        "principal": "everyone",
        "privileges": ["read"]
    }, SharingDlg_.reload, this);
}

//# sourceURL=SharingDlg.js
