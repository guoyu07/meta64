import { DialogBaseImpl } from "./DialogBaseImpl";
import { SharingDlg } from "./SharingDlg";
import { share } from "./Share";
import { util } from "./Util";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { Factory } from "./Factory";
import { ShareToPersonDlg } from "./ShareToPersonDlg";
import { tag } from "./Tag";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";
import { Div } from "./widget/Div";
import { Checkbox } from "./widget/Checkbox";
import { Comp } from "./widget/base/Comp";
import { EditPrivsTable } from "./widget/EditPrivsTable";
import { EditPrivsTableRow } from "./widget/EditPrivsTableRow";

export default class SharingDlgImpl extends DialogBaseImpl implements SharingDlg {

    privsTable: Div;
    publicCommentingCheckbox: Checkbox;

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Node Sharing"),
            this.privsTable = new EditPrivsTable(),
            this.publicCommentingCheckbox = new Checkbox("Allow Public Commenting"),
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

        this.privsTable.renderToDom();

        this.publicCommentingCheckbox.setChecked(res.publicAppend);
    }

    /* Note: this really only saves the checkbox value because the other list modifications are made as soon as user does them */
    save = (): void => {
        meta64.treeDirty = true;
        util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "privileges": null,
            "principal": null,
            "publicAppend": this.publicCommentingCheckbox.getChecked()
        });
    }

    removePrivilege = (principal: string, privilege: string): void => {
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
        }, this.populate);
    }

    shareToPersonDlg = (): void => {
        Factory.createDefault("ShareToPersonDlgImpl", (dlg: ShareToPersonDlg) => {
            dlg.open();
        }, {"sharingDlg" : this});
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
            "principal": "everyone",
            "privileges": ["read"],
            "publicAppend": false
        }, this.reload);
    }
}
