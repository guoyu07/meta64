import { DialogBaseImpl } from "./DialogBaseImpl";
import { SharingDlg } from "./SharingDlg";
import { share } from "./Share";
import { util } from "./Util";
import { render } from "./Render";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { Factory } from "./Factory";
import { ShareToPersonDlg } from "./ShareToPersonDlg";
import { tag } from "./Tag";

/*
NOTE: This dialog is not yet converted to new Widget Architecture (see ChangePasswordDlgImpl.ts for a working example of the
new architecture)
*/
export default class SharingDlgImpl extends DialogBaseImpl implements SharingDlg {

    constructor() {
        super("SharingDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Node Sharing");

        let shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton",
            this.shareNodeToPersonPg);
        let makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", this.shareNodeToPublic);
        let backButton = this.makeCloseButton("Close", "closeSharingButton");

        let buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);

        let width = window.innerWidth * 0.6;
        let height = window.innerHeight * 0.4;

        let internalMainContent = tag.div({
            "id": this.id("shareNodeNameDisplay")
        }) + //
            tag.div({
                "class": "vertical-layout-row",
                "style": `width:${width}px;height:${height}px;overflow:scroll;border:4px solid lightGray;`,
                "id": this.id("sharingListFieldContainer")
            });

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

        util.ajax<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": share.sharingNode.id,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse);
    }

    /*
     * Handles getNodePrivileges response.
     *
     * res=json of GetNodePrivilegesResponse.java
     *
     * res.aclEntries = list of AccessControlEntryInfo.java json objects
     */
    getNodePrivilegesResponse = (res: I.GetNodePrivilegesResponse): void => {
        this.populateSharingPg(res);
    }

    /*
     * Processes the response gotten back from the server containing ACL info so we can populate the sharing page in the gui
     */
    populateSharingPg = (res: I.GetNodePrivilegesResponse): void => {
        let html = "";

        util.forEachArrElm(res.aclEntries, (aclEntry, index) => {
            html += "<h4>User: " + aclEntry.principalName + "</h4>";
            html += tag.div({
                "class": "privilege-list"
            }, this.renderAclPrivileges(aclEntry.principalName, aclEntry));
            return true;
        });

        let publicAppendAttrs = {
            "onClick": this.publicCommentingChanged.bind(this),
            "name": "allowPublicCommenting",
            "id": this.id("allowPublicCommenting")
        };

        if (res.publicAppend) {
            publicAppendAttrs["checked"] = "checked";
        }

        html += tag.checkbox(publicAppendAttrs);

        html += render.tag("label", {
            "for": this.id("allowPublicCommenting")
        }, "Allow public commenting under this node.", true);

        util.setHtml(this.id("sharingListFieldContainer"), html);
    }

    publicCommentingChanged = (): void => {
        /*
         * Using onClick on the element AND this timeout is the only hack I could find to get get what amounts to a state
         * change listener on a paper-checkbox. The documented on-change listener simply doesn't work and appears to be
         * simply a bug in google code AFAIK.
         */
        let thiz = this;
        setTimeout(function() {
            let polyElm = util.polyElm(thiz.id("allowPublicCommenting"));

            meta64.treeDirty = true;

            util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "privileges": null,
                "principal": null,
                "publicAppend": (polyElm.node.checked ? true : false)
            });

        }, 250);
    }

    removePrivilege = (principal: string, privilege: string): void => {
        /*
         * Trigger going to server at next main page refresh
         */
        meta64.treeDirty = true;

        util.ajax<I.RemovePrivilegeRequest, I.RemovePrivilegeResponse>("removePrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": principal,
            "privilege": privilege
        }, this.removePrivilegeResponse);
    }

    removePrivilegeResponse = (res: I.RemovePrivilegeResponse): void => {
        util.ajax<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": share.sharingNode.path,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse);
    }

    renderAclPrivileges = (principal: any, aclEntry: any): string => {
        let ret = "";
        let thiz = this;
        util.forEachArrElm(aclEntry.privileges, function(privilege, index) {
            let removeButton = thiz.makeButton("Remove", "removePrivButton", () => {
                this.removePrivilege(principal, privilege.privilegeName);
            });

            let row = render.makeHorizontalFieldSet(removeButton);

            row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";

            ret += tag.div({
                "class": "privilege-entry"
            }, row);
        });
        return ret;
    }

    shareNodeToPersonPg = (): void => {
        Factory.createDefault("ShareToPersonDlgImpl", (dlg: ShareToPersonDlg) => {
            dlg.open();
        })
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
        util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": "everyone",
            "privileges": ["read"],
            "publicAppend": false
        }, this.reload);
    }
}
