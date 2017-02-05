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
    build = (): string => {
        var header = this.makeHeader("Share Node to Person");

        var formControls = this.makeEditField("User to Share With", "shareToUserName");
        var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", this.shareNodeToPerson,
            this);
        var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
        var buttonBar = render.centeredButtonBar(shareButton + backButton);

        return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
            + buttonBar;
    }

    shareNodeToPerson = (): void => {
        var targetUser = this.getInputVal("shareToUserName");
        if (!targetUser) {
            util.showMessage("Please enter a username");
            return;
        }

        /*
         * Trigger going to server at next main page refresh
         */
        meta64.treeDirty = true;
        var thiz = this;
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
