import { DialogBase } from "../DialogBase";
import * as I from "../Interfaces";
import { SharingDlg } from "./SharingDlg";
import { Header } from "../widget/Header";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { TextContent } from "../widget/TextContent";
import { UtilIntf as Util } from "../intf/UtilIntf";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { Form } from "../widget/Form";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class ShareToPersonDlg extends DialogBase {

    shareToUserTextField: TextField;
    sharingDlg: SharingDlg;

    constructor(args: Object) {
        super("Share Node to Person", "modal-md");
        this.sharingDlg = (<any>args).sharingDlg;
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Form(null, [
                new TextContent("Enter the username of the person you want to share this node with:"),
                this.shareToUserTextField = new TextField("User to Share with"),
                new ButtonBar([
                    new Button("Share", this.shareNodeToPerson, null, true, this),
                    new Button("Close", null, null, true, this)
                ])
            ])
        ]);

        this.shareToUserTextField.bindEnterKey(this.shareNodeToPerson);
    }

    shareNodeToPerson = (): void => {
        let targetUser = this.shareToUserTextField.getValue();
        if (!targetUser) {
            S.util.showMessage("Please enter a username");
            return;
        }

        /* Trigger update from server at next main page refresh */
        S.meta64.treeDirty = true;

        S.util.ajax<I.AddPrivilegeRequest, I.AddPrivilegeResponse>("addPrivilege", {
            "nodeId": S.share.sharingNode.id,
            "principal": targetUser,
            "privileges": ["rd", "wr"],
            "publicAppend": false
        }, this.reloadFromShareWithPerson);
    }

    reloadFromShareWithPerson = (res: I.AddPrivilegeResponse): void => {
        if (S.util.checkSuccess("Share Node with Person", res)) {
            this.sharingDlg.reload();
        }
    }
}
