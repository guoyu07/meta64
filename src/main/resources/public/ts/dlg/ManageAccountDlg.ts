console.log("running module: ManageAccountDlg.js");

namespace m64 {
    export class ManageAccountDlg extends DialogBase {

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
}
