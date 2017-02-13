import {DialogBaseImpl} from "./DialogBaseImpl";
import {ShareToPersonDlg} from "./ShareToPersonDlg";
import {share} from "./Share";
import {util} from "./Util";
import {render} from "./Render";
import {meta64} from "./Meta64";
import * as I from "./Interfaces";
import {Factory} from "./Factory";
import {SharingDlg} from "./SharingDlg";

export default class ShareToPersonDlgImpl  extends DialogBaseImpl implements ShareToPersonDlg {

    constructor() {
        super("ShareToPersonDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        let header = this.makeHeader("Share Node to Person");

        let formControls = this.makeEditField("User to Share With", "shareToUserName");
        let shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", this.shareNodeToPerson,
            this);
        let backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
        let buttonBar = render.centeredButtonBar(shareButton + backButton);

        return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
            + buttonBar;
    }

    shareNodeToPerson = (): void => {
        let targetUser = this.getInputVal("shareToUserName");
        if (!targetUser) {
            util.showMessage("Please enter a username");
            return;
        }

        /*
         * Trigger going to server at next main page refresh
         */
        meta64.treeDirty = true;
        let thiz = this;
        util.json<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": targetUser,
            "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
            "publicAppend": false
        }, thiz.reloadFromShareWithPerson, thiz);
    }

    reloadFromShareWithPerson = (res: I.AddPrivilegeResponse): void => {
        if (util.checkSuccess("Share Node with Person", res)) {
            Factory.createDefault("SharingDlgImpl", (dlg:SharingDlg) => {
              dlg.open();
            });
        }
    }
}
