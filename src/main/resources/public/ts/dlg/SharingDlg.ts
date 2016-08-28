console.log("running module: SharingDlg.js");

namespace m64 {
    export class SharingDlg extends DialogBase {

        constructor() {
            super("SharingDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Node Sharing");

            var shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton",
                this.shareNodeToPersonPg, this);
            var makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", this.shareNodeToPublic,
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

        init = (): void => {
            this.reload();
        }

        /*
         * Gets privileges from server and displays in GUI also. Assumes gui is already at correct page.
         */
        reload = (): void => {
            console.log("Loading node sharing info.");

            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": share.sharingNode.id,
                "includeAcl": true,
                "includeOwners": true
            }, this.getNodePrivilegesResponse, this);
        }

        /*
         * Handles getNodePrivileges response.
         *
         * res=json of GetNodePrivilegesResponse.java
         *
         * res.aclEntries = list of AccessControlEntryInfo.java json objects
         */
        getNodePrivilegesResponse = (res: json.GetNodePrivilegesResponse): void => {
            this.populateSharingPg(res);
        }

        /*
         * Processes the response gotten back from the server containing ACL info so we can populate the sharing page in the gui
         */
        populateSharingPg = (res: json.GetNodePrivilegesResponse): void => {
            var html = "";
            var This = this;

            $.each(res.aclEntries, function(index, aclEntry) {
                html += "<h4>User: " + aclEntry.principalName + "</h4>";
                html += render.tag("div", {
                    "class": "privilege-list"
                }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
            });

            var publicAppendAttrs = {
                "onClick": "m64.meta64.getObjectByGuid(" + this.guid + ").publicCommentingChanged();",
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
        }

        publicCommentingChanged = (): void => {

            /*
             * Using onClick on the element AND this timeout is the only hack I could find to get get what amounts to a state
             * change listener on a paper-checkbox. The documented on-change listener simply doesn't work and appears to be
             * simply a bug in google code AFAIK.
             */
            var thiz = this;
            setTimeout(function() {
                var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));

                meta64.treeDirty = true;

                util.json<json.AddPrivilegeRequest, json.AddPrivilegeResponse>("addPrivilege", {
                    "nodeId": share.sharingNode.id,
                    "privileges" : null,
                    "principal" : null,
                    "publicAppend": (polyElm.node.checked ? true : false)
                });

            }, 250);
        }

        removePrivilege = (principal: string, privilege: string): void => {
            /*
             * Trigger going to server at next main page refresh
             */
            meta64.treeDirty = true;

            util.json<json.RemovePrivilegeRequest, json.RemovePrivilegeResponse>("removePrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": principal,
                "privilege": privilege
            }, this.removePrivilegeResponse, this);
        }

        removePrivilegeResponse = (res: json.RemovePrivilegeResponse): void => {

            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": share.sharingNode.path,
                "includeAcl": true,
                "includeOwners": true
            }, this.getNodePrivilegesResponse, this);
        }

        renderAclPrivileges = (principal: any, aclEntry: any): string => {
            var ret = "";
            var thiz = this;
            $.each(aclEntry.privileges, function(index, privilege) {

                var removeButton = thiz.makeButton("Remove", "removePrivButton", //
                    "m64.meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
                    + "');");

                var row = render.makeHorizontalFieldSet(removeButton);

                row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";

                ret += render.tag("div", {
                    "class": "privilege-entry"
                }, row);
            });
            return ret;
        }

        shareNodeToPersonPg = (): void => {
            (new ShareToPersonDlg()).open();
        }

        shareNodeToPublic = (): void => {
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
            util.json<json.AddPrivilegeRequest, json.AddPrivilegeResponse>("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": "everyone",
                "privileges": ["read"],
                "publicAppend": false
            }, this.reload, this);
        }
    }
}
