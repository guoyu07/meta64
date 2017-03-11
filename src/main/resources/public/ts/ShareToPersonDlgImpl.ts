import { DialogBaseImpl } from "./DialogBaseImpl";
import { ShareToPersonDlg } from "./ShareToPersonDlg";
import { share } from "./Share";
import { util } from "./Util";
import { render } from "./Render";
import { meta64 } from "./Meta64";
import * as I from "./Interfaces";
import { Factory } from "./Factory";
import { SharingDlg } from "./SharingDlg";
import { Header } from "./widget/Header";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";
import { TextContent } from "./widget/TextContent";

export default class ShareToPersonDlgImpl extends DialogBaseImpl implements ShareToPersonDlg {

    shareToUserTextField: TextField;
    sharingDlg: SharingDlg;

    constructor(args: Object) {
        super();
        this.sharingDlg = (<any>args).sharingDlg;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Share Node to Person"),
            new TextContent("Enter the username of the person you want to share this node with:"),
            this.shareToUserTextField = new TextField("User to Share with"),
            new ButtonBar([
                new Button("Share", this.shareNodeToPerson, null, true, this),
                new Button("Close", null, null, true, this)
            ])
        ]);

        this.shareToUserTextField.bindEnterKey(this.shareNodeToPerson);
    }

    shareNodeToPerson = (): void => {
        let targetUser = this.shareToUserTextField.getValue();
        if (!targetUser) {
            util.showMessage("Please enter a username");
            return;
        }

        /* Trigger update from server at next main page refresh */
        meta64.treeDirty = true;

        util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": targetUser,
            "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
            "publicAppend": false
        }, this.reloadFromShareWithPerson);
    }

    reloadFromShareWithPerson = (res: I.AddPrivilegeResponse): void => {
        if (util.checkSuccess("Share Node with Person", res)) {
            this.sharingDlg.reload();
        }
    }
}
