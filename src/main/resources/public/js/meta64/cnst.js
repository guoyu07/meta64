console.log("running module: cnst.js");
var Cnst = (function () {
    function Cnst() {
        this.ANON = "anonymous";
        this.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
        this.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
        this.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
        this.INSERT_ATTACHMENT = "{{insert-attachment}}";
        this.NEW_ON_TOOLBAR = true;
        this.INS_ON_TOOLBAR = true;
        this.USE_ACE_EDITOR = false;
        this.SHOW_PATH_ON_ROWS = true;
        this.SHOW_PATH_IN_DLGS = true;
    }
    return Cnst;
}());
if (!window["cnst"]) {
    var cnst = new Cnst();
}
//# sourceMappingURL=cnst.js.map