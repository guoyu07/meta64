console.log("running module: user.js");

var share = function() {

	/*
	 * Handles getNodePrivileges response.
	 * 
	 * res=json of GetNodePrivilegesResponse.java
	 * 
	 * res.aclEntries = list of AccessControlEntryInfo.java json objects
	 */
	var _getNodePrivilegesResponse = function(res) {
		_.populateSharingPg(res);
	}

	var _findSharedNodesResponse = function(res) {
		srch.searchNodesResponse(res);
	}

	var _renderAclPrivileges = function(principal, aclEntry) {
		var ret = "";
		$.each(aclEntry.privileges, function(index, privilege) {

			var removeButton = render.makeButton("Remove", "removePrivButton", //
			"share.removePrivilege('" + principal + "', '" + privilege.privilegeName + "');");

			var row = render.makeHorizontalFieldSet(removeButton);

			row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";

			ret += render.tag("div", {
				"class" : "privilege-entry"
			}, row);
		});
		return ret;
	}

	var _removePrivilegeResponse = function(res) {

		util.json("getNodePrivileges", {
			"nodeId" : _.sharingNode.path,
			"includeAcl" : true,
			"includeOwners" : true
		}, _getNodePrivilegesResponse);
	}

	var _ = {

		sharingNode : null,

		/*
		 * Processes the response gotten back from the server containing ACL
		 * info so we can populate the sharing page in the gui
		 */
		populateSharingPg : function(res) {

			var html = "";

			$.each(res.aclEntries, function(index, aclEntry) {
				html += "<h4>User: " + aclEntry.principalName + "</h4>";
				html += render.tag("div", {
					"class" : "privilege-list"
				}, _renderAclPrivileges(aclEntry.principalName, aclEntry));
			});

			/* todo: use actual polymer paper-checkbox here */
			html += render.tag("input", {
				"type" : "checkbox",
				"name" : "allowPublicCommenting",
				"id" : "allowPublicCommenting"
			}, "", false);

			html += render.tag("label", {
				"for" : "allowPublicCommenting"
			}, "Allow public commenting under this node.", true);

			/* Example to put checkbox in its own div, with label. */
			// <div class="ui-field-contain">
			// <fieldset data-role="controlgroup">
			// <legend>Agree to the terms:</legend>
			// <input type="checkbox" name="checkbox-2" id="checkbox-2"
			// class="custom">
			// <label for="checkbox-2">I agree</label>
			// </fieldset>
			// </div>
			util.setHtmlEnhanced("sharingListFieldContainer", html);

			util.setCheckboxVal("#allowPublicCommenting", res.publicAppend);
			$("#allowPublicCommenting").bind("change", _.publicCommentingChanged);
		},

		publicCommentingChanged : function() {
			var publicAppend = $("#allowPublicCommenting").is(":checked");

			meta64.treeDirty = true;

			util.json("addPrivilege", {
				"nodeId" : _.sharingNode.id,
				"publicAppend" : publicAppend ? "true" : "false"
			});
		},

		removePrivilege : function(principal, privilege) {
			/*
			 * Trigger going to server at next main page refresh
			 */
			meta64.treeDirty = true;

			util.json("removePrivilege", {
				"nodeId" : _.sharingNode.id,
				"principal" : principal,
				"privilege" : privilege
			}, _removePrivilegeResponse);
		},

		shareNodeToPersonPg : function() {
			meta64.changePage(shareToPersonPg);
		},

		shareNodeToPerson : function() {
			var targetUser = $("#shareToUserName").val();
			if (!targetUser) {
				alert("Please enter a username");
				return;
			}

			/*
			 * Trigger going to server at next main page refresh
			 */
			meta64.treeDirty = true;

			util.json("addPrivilege", {
				"nodeId" : _.sharingNode.id,
				"principal" : targetUser,
				"privileges" : [ "read", "write", "addChildren", "nodeTypeManagement" ]
			}, _.reloadFromShareWithPerson);
		},

		shareNodeToPublic : function() {
			console.log("Sharing node to public.");

			/*
			 * Trigger going to server at next main page refresh
			 */
			meta64.treeDirty = true;

			/*
			 * Add privilege and then reload share nodes dialog from scratch
			 * doing another callback to server
			 * 
			 * TODO: this additional call can be avoided as an optimization some
			 * day
			 */
			util.json("addPrivilege", {
				"nodeId" : _.sharingNode.id,
				"principal" : "everyone",
				"privileges" : [ "read" ]
			}, _.reload);
		},

		/*
		 * Handles 'Sharing' button on a specific node, from button bar above
		 * node display in edit mode
		 */
		editNodeSharing : function() {
			var node = meta64.getHighlightedNode();

			if (!node) {
				alert("No node is selected.");
				return;
			}
			_.sharingNode = node;
			meta64.changePage(sharingPg);
		},

		reloadFromShareWithPerson : function(res) {
			if (util.checkSuccess("Share Node with Person", res)) {
				meta64.changePage(sharingPg);
			}
		},

		/*
		 * Gets privileges from server and displays in GUI also. Assumes gui is
		 * already at correct page.
		 */
		reload : function() {
			console.log("Loading node sharing info.");

			util.json("getNodePrivileges", {
				"nodeId" : _.sharingNode.id,
				"includeAcl" : true,
				"includeOwners" : true
			}, _getNodePrivilegesResponse);
		},

		findSharedNodes : function() {
			var focusNode = meta64.getHighlightedNode();
			if (focusNode == null) {
				return;
			}

			srch.searchPageTitle = "Shared Nodes";

			util.json("getSharedNodes", {
				"nodeId" : focusNode.id
			}, _findSharedNodesResponse);
		},

		closeSharingDlg : function() {
			/*
			 * Go back to main page. If treeDirty has been set everything that
			 * needs to happen happens.
			 */
			meta64.goToMainPage();
		}
	};

	console.log("Module ready: share.js");
	return _;
}();

//# sourceURL=share.js
