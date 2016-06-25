console.log("running module: prefs.js");
var prefs = function () {
    var _ = {
        closeAccountResponse: function () {
            $(window).off("beforeunload");
            window.location.href = window.location.origin;
        },
        closeAccount: function () {
            (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
                (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                    user.deleteAllUserCookies();
                    util.json("closeAccount", {}, _.closeAccountResponse);
                })).open();
            })).open();
        }
    };
    console.log("Module ready: prefs.js");
    return _;
}();
//# sourceMappingURL=prefs.js.map