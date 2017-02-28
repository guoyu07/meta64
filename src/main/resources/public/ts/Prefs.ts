import { Factory } from "./Factory";
import { ConfirmDlg } from "./ConfirmDlg";
import { user } from "./User";
import { util } from "./Util";
import * as I from "./Interfaces";

class Prefs {

    closeAccountResponse(res: I.CloseAccountResponse): void {
        /* Remove warning dialog to ask user about leaving the page */
        window.onbeforeunload = null;

        /* reloads browser with the query parameters stripped off the path */
        window.location.href = window.location.origin;
    }

    closeAccount(): void {
        Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
            dlg.open();
        }, {
                "title": "Oh No!",
                "message": "Close your Account?<p> Are you sure?",
                "buttonText": "Yes, Close Account.",
                "yesCallback":
                () => {
                    Factory.createDefault("ConfirmDlgImpl", (dlg: ConfirmDlg) => {
                        dlg.open();
                    }, {
                            "title": "One more Click",
                            "message": "Your data will be deleted and can never be recovered.<p> Are you sure?",
                            "buttonText": "Yes, Close Account.",
                            "yesCallback":
                            () => {
                                user.deleteAllUserCookies();
                                util.json<I.CloseAccountRequest, I.CloseAccountResponse>("closeAccount", {}, prefs.closeAccountResponse);
                            }
                        });
                }
            });
    }
}
export let prefs: Prefs = new Prefs();
export default prefs;
