console.log("Constants.ts");

class Constants {

    ANON: string = "anonymous";
    COOKIE_LOGIN_USR: string = "loginUsr";
    COOKIE_LOGIN_PWD: string = "loginPwd";
    /*
     * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
     */
    COOKIE_LOGIN_STATE: string = "loginState";
    INSERT_ATTACHMENT: string = "{{insert-attachment}}";
    NEW_ON_TOOLBAR: boolean = false;
    INS_ON_TOOLBAR: boolean = false;
    MOVE_UPDOWN_ON_TOOLBAR: boolean = true;

    /*
     * This works, but I'm not sure I want it for ALL editing. Still thinking about design here, before I turn this
     * on.
     */
    USE_ACE_EDITOR: boolean = false;

    /* showing path on rows just wastes space for ordinary users. Not really needed */
    SHOW_PATH_ON_ROWS: boolean = true;
    SHOW_PATH_IN_DLGS: boolean = true;

    SHOW_CLEAR_BUTTON_IN_EDITOR: boolean = false;
}
export let cnst: Constants = new Constants();
(<any>window).cnst = cnst;

class JCRConstants {

    COMMENT_BY: string = "sn:commentBy";
    PUBLIC_APPEND: string = "sn:publicAppend";
    PRIMARY_TYPE: string = "sn:primaryType";

    EMAIL_CONTENT: string = "sn:content";
    EMAIL_RECIP: string = "sn:recip";
    EMAIL_SUBJECT: string = "sn:subject";

    CONTENT: string = "sn:content";
    TAGS: string = "sn:tags";
    UUID: string = "sn:uuid";
    JSON_FILE_SEARCH_RESULT: string = "sn:json";

    DISABLE_INSERT: string = "sn:disableInsert";

    PWD: string = "sn:pwd";
    EMAIL: string = "sn:email";
    CODE: string = "sn:code";

    BIN_VER: string = "sn:binVer";
    BIN_DATA: string = "sn:jcrData";
    BIN_MIME: string = "sn::mimeType";

    IMG_WIDTH: string = "sn:imgWidth";
    IMG_HEIGHT: string = "sn:imgHeight";
}
export let jcrCnst: JCRConstants = new JCRConstants();
