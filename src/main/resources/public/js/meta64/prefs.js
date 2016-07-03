console.log("running module: prefs.js");
var Prefs = (function () {
    function Prefs() {
    }
    Prefs.prototype.closeAccountResponse = function () {
        $(window).off("beforeunload");
        window.location.href = window.location.origin;
    };
    Prefs.prototype.closeAccount = function () {
        var thiz = this;
        (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
            (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                user.deleteAllUserCookies();
                util.json("closeAccount", {}, thiz.closeAccountResponse);
            })).open();
        })).open();
    };
    return Prefs;
}());
if (!window["prefs"]) {
    var prefs = new Prefs();
}
//# sourceMappingURL=prefs.js.map