console.log("ManageAccountDlgImpl.ts");

import {DialogBaseImpl} from "./DialogBaseImpl";
import {ManageAccountDlg} from "./ManageAccountDlg";
import {render} from "./Render";
import {meta64} from "./Meta64";

export default class ManageAccountDlgImpl extends DialogBaseImpl implements ManageAccountDlg {

    constructor() {
        super("ManageAccountDlg");
    }

    /*
     * Returns a string that is the HTML content of the dialog
     */
    build = (): string => {
        var header = this.makeHeader("Manage Account");

        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");

        var buttonBar = render.centeredButtonBar(closeAccountButton);

        var bottomButtonBar = render.centeredButtonBar(backButton);
        var bottomButtonBarDiv = render.tag("div", {
            "class": "close-account-bar"
        }, bottomButtonBar);

        return header + buttonBar + bottomButtonBarDiv;
    }
}
