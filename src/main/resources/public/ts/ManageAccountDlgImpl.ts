console.log("ManageAccountDlgImpl.ts");

import { DialogBaseImpl } from "./DialogBaseImpl";
import { ManageAccountDlg } from "./ManageAccountDlg";
import { render } from "./Render";
import { meta64 } from "./Meta64";
import { prefs } from "./Prefs";
import { tag } from "./Tag";

/*
NOTE: This dialog is not yet converted to new Widget Architecture (see ChangePasswordDlgImpl.ts for a working example of the
new architecture)
*/
export default class ManageAccountDlgImpl extends DialogBaseImpl implements ManageAccountDlg {

    constructor() {
        super("ManageAccountDlg");
    }

    closeAccount = (): void => {
        prefs.closeAccount();
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    render = (): string => {
        var header = this.makeHeader("Manage Account");

        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", this.closeAccount);

        var buttonBar = render.centeredButtonBar(closeAccountButton);

        var bottomButtonBar = render.centeredButtonBar(backButton);
        var bottomButtonBarDiv = tag.div({
            "class": "close-account-bar"
        }, bottomButtonBar);

        return header + buttonBar + bottomButtonBarDiv;
    }
}
