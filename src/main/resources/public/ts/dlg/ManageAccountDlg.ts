console.log("ManageAccountDlg.ts");

import { DialogBase } from "../DialogBase";
import { Header } from "../widget/Header";
import { PasswordTextField } from "../widget/PasswordTextField";
import { ButtonBar } from "../widget/ButtonBar";
import { Button } from "../widget/Button";
import { TextField } from "../widget/TextField";
import { Constants } from "../Constants";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";

let S : Singletons;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (ctx: Singletons) => {
    S = ctx;
});

export class ManageAccountDlg extends DialogBase {

    constructor() {
        super("Manage Account");
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new ButtonBar([
                new Button("Close Account", this.closeAccount, null, true, this),
                new Button("Cancel", null, null, true, this)
            ])
        ]);
    }

    closeAccount = (): void => {
        S.user.closeAccount();
    }
}
