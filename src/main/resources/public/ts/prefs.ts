console.log("running module: prefs.js");

namespace m64 {
    export namespace prefs {

        export let closeAccountResponse = function(res: json.CloseAccountResponse): void {
            /* Remove warning dialog to ask user about leaving the page */
            $(window).off("beforeunload");

            /* reloads browser with the query parameters stripped off the path */
            window.location.href = window.location.origin;
        }

        export let closeAccount = function(): void {
            (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function() {
                (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function() {
                    user.deleteAllUserCookies();
                    util.jsonG<json.CloseAccountRequest, json.CloseAccountResponse>("closeAccount", {}, closeAccountResponse);
                })).open();
            })).open();
        }
    }
}
