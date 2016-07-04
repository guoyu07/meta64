
console.log("running module: prefs.js");

class Prefs {

    closeAccountResponse = (): void => {
        /* Remove warning dialog to ask user about leaving the page */
        $(window).off("beforeunload");

        /* reloads browser with the query parameters stripped off the path */
        window.location.href = window.location.origin;
    }

    closeAccount = (): void => {
        //todo-0: see if there's a better way to do thiz.
        var thiz: Prefs = this;

        (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function() {
            (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function() {
                user.deleteAllUserCookies();
                util.json("closeAccount", {}, thiz.closeAccountResponse);
            })).open();
        })).open();
    }
}

if (!window["prefs"]) {
    var prefs: Prefs = new Prefs();
}
