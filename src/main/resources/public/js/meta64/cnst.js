console.log("running module: cnst.js");
var cnst = function () {
    var _ = {
        ANON: "anonymous",
        COOKIE_LOGIN_USR: cookiePrefix + "loginUsr",
        COOKIE_LOGIN_PWD: cookiePrefix + "loginPwd",
        COOKIE_LOGIN_STATE: cookiePrefix + "loginState",
        BR: "<div class='vert-space'></div>",
        INSERT_ATTACHMENT: "{{insert-attachment}}",
        NEW_ON_TOOLBAR: true,
        INS_ON_TOOLBAR: true,
        USE_ACE_EDITOR: false,
        SHOW_PATH_ON_ROWS: true,
        SHOW_PATH_IN_DLGS: true
    };
    console.log("Module ready: cnst.js");
    return _;
}();
//# sourceMappingURL=cnst.js.map