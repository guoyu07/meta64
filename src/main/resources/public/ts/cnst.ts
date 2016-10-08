console.log("running module: cnst.js");

declare var cookiePrefix;

//todo-0: typescript will now let us just do this: const var='value';

namespace m64 {
    export namespace cnst {

        export let ANON: string = "anonymous";
        export let COOKIE_LOGIN_USR: string = cookiePrefix + "loginUsr";
        export let COOKIE_LOGIN_PWD: string = cookiePrefix + "loginPwd";
        /*
         * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
         */
        export let COOKIE_LOGIN_STATE: string = cookiePrefix + "loginState";
        export let BR: "<div class='vert-space'></div>";
        export let INSERT_ATTACHMENT: string = "{{insert-attachment}}";
        export let NEW_ON_TOOLBAR: boolean = true;
        export let INS_ON_TOOLBAR: boolean = true;
        export let MOVE_UPDOWN_ON_TOOLBAR: boolean = true;

        /*
         * This works, but I'm not sure I want it for ALL editing. Still thinking about design here, before I turn this
         * on.
         */
        export let USE_ACE_EDITOR: boolean = false;

        /* showing path on rows just wastes space for ordinary users. Not really needed */
        export let SHOW_PATH_ON_ROWS: boolean = true;
        export let SHOW_PATH_IN_DLGS: boolean = true;
    }
}
