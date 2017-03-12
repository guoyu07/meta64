console.log("ManageAccountDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ManageAccountDlg } from "./ManageAccountDlg";
import { meta64 } from "./Meta64";
import { prefs } from "./Prefs";
import { Header } from "./widget/Header";
import { PasswordTextField } from "./widget/PasswordTextField";
import { ButtonBar } from "./widget/ButtonBar";
import { Button } from "./widget/Button";
import { TextField } from "./widget/TextField";

export default class ManageAccountDlgImpl extends DialogBaseImpl implements ManageAccountDlg {

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
