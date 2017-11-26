import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { ShareToPersonDlg } from "./ShareToPersonDlg";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { Div } from "../widget/Div";
import { Checkbox } from "../widget/Checkbox";
import { Comp } from "../widget/base/Comp";
import { EditPrivsTable } from "../widget/EditPrivsTable";
import { EditPrivsTableRow } from "../widget/EditPrivsTableRow";
import { UtilIntf as Util} from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";

let util: Util;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    util = ctx.util;
});

//todo-1: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var share, meta64, tag;

export class SharingDlg extends DialogBase {

    privsTable: Div;
    //publicCommentingCheckbox: Checkbox;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Node Sharing"),
            this.privsTable = new EditPrivsTable(),
            //todo-1: disabling this for now
            //this.publicCommentingCheckbox = new Checkbox("Allow Public Commenting"),
            new ButtonBar([
                new Button("Share with Person", this.shareToPersonDlg),
                new Button("Share to Public", this.shareNodeToPublic),
                new Button("Save", this.save, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);
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
        }, this.populate);
    }

    /*
     * Processes the response gotten back from the server containing ACL info so we can populate the sharing page in the gui
     */
    populate = (res: I.GetNodePrivilegesResponse): void => {
        this.privsTable.removeAllChildren();

        util.forEachArrElm(res.aclEntries, (aclEntry, index) => {
            this.privsTable.addChild(new EditPrivsTableRow(this, aclEntry));
        });

        this.privsTable.renderChildrenToDom();

        //this.publicCommentingCheckbox.setChecked(res.publicAppend);
    }

    /* Note: this really only saves the checkbox value because the other list modifications are made as soon as user does them */
    save = (): void => {
        meta64.treeDirty = true;
        util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "privileges": null,
            "principal": null,
            "publicAppend": false //this.publicCommentingCheckbox.getChecked()
        });
    }

    removePrivilege = (principalNodeId: string, privilege: string): void => {
        meta64.treeDirty = true;
        util.ajax<I.RemovePrivilegeRequest, I.RemovePrivilegeResponse>("removePrivilege", {
            "nodeId": share.sharingNode.id,
            "principalNodeId": principalNodeId,
            "privilege": privilege
        }, this.removePrivilegeResponse);
    }

    removePrivilegeResponse = (res: I.RemovePrivilegeResponse): void => {
        util.ajax<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": share.sharingNode.path,
            "includeAcl": true,
            "includeOwners": true
        }, this.populate);
    }

    shareToPersonDlg = (): void => {
       new ShareToPersonDlg({"sharingDlg" : this}).open();
    }

    shareNodeToPublic = (): void => {
        console.log("Sharing node to public.");
        meta64.treeDirty = true;

        /*
         * Add privilege and then reload share nodes dialog from scratch doing another callback to server
         *
         * TODO: this additional call can be avoided as an optimization
         */
        util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": "public",
            "privileges": ["rd"],
            "publicAppend": false
        }, this.reload);
    }
}
