console.log("ManageAccountDlg.ts");

import { DialogBase } from "./DialogBase";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";

//todo-0: don't worry, this way of getting singletons is only temporary, because i haven't converted
//this file over to using the Factory yet
declare var meta64, prefs;

export class ManageAccountDlg extends DialogBase {

    constructor() {
        super();
        this.buildGUI();
    }

    buildGUI = (): void => {
        this.setChildren([
            new Header("Manage Account"),
            new ButtonBar([
                new Button("Close Account", this.closeAccount, null, true, this),
                new Button("Cancel", null, null, true, this)
            ])
        ]);
    }

    closeAccount = (): void => {
        prefs.closeAccount();
    }
}
