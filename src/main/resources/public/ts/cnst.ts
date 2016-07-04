console.log("running module: cnst.js");

declare var cookiePrefix;

//todo-0: typescript will now let us just do this: const var='value';
class Cnst {
    constructor(varName:string) {
        alert("creating cnst varName ="+varName);
    }
    ANON: string = "anonymous";
    COOKIE_LOGIN_USR: string = cookiePrefix + "loginUsr";
    COOKIE_LOGIN_PWD: string = cookiePrefix + "loginPwd";
    /*
     * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
     */
    COOKIE_LOGIN_STATE: string = cookiePrefix + "loginState";
    BR: "<div class='vert-space'></div>";
    INSERT_ATTACHMENT: string = "{{insert-attachment}}";
    NEW_ON_TOOLBAR: boolean = true;
    INS_ON_TOOLBAR: boolean = true;

    /*
     * This works, but I'm not sure I want it for ALL editing. Still thinking about design here, before I turn this
     * on.
     */
    USE_ACE_EDITOR: boolean = false;

    /* showing path on rows just wastes space for ordinary users. Not really needed */
    SHOW_PATH_ON_ROWS: boolean = true;
    SHOW_PATH_IN_DLGS: boolean = true;
}

if (!window["cnst"]) {
    var cnst: Cnst = new Cnst("cnst");
}

//export var cnst2: Cnst = new Cnst("cnst2");
