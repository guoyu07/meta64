console.log("Constants.ts");

declare var cookiePrefix;

class Constants {

    ANON: string = "anonymous";
    COOKIE_LOGIN_USR: string = cookiePrefix + "loginUsr";
    COOKIE_LOGIN_PWD: string = cookiePrefix + "loginPwd";
    /*
     * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
     */
    COOKIE_LOGIN_STATE: string = cookiePrefix + "loginState";
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

    COMMENT_BY: string = "commentBy";
    PUBLIC_APPEND: string = "publicAppend";
    PRIMARY_TYPE: string = "jcr:primaryType";
    POLICY: string = "rep:policy";

    MIXIN_TYPES: string = "jcr:mixinTypes";

    EMAIL_CONTENT: string = "jcr:content";
    EMAIL_RECIP: string = "recip";
    EMAIL_SUBJECT: string = "subject";

    CREATED: string = "jcr:created";
    CREATED_BY: string = "jcr:createdBy";
    CONTENT: string = "jcr:content";
    TAGS: string = "tags";
    UUID: string = "jcr:uuid";
    LAST_MODIFIED: string = "jcr:lastModified";
    LAST_MODIFIED_BY: string = "jcr:lastModifiedBy";
    JSON_FILE_SEARCH_RESULT: string = "meta64:json";

    DISABLE_INSERT: string = "disableInsert";

    USER: string = "user";
    PWD: string = "pwd";
    EMAIL: string = "email";
    CODE: string = "code";

    BIN_VER: string = "binVer";
    BIN_DATA: string = "jcrData";
    BIN_MIME: string = "jcr:mimeType";

    IMG_WIDTH: string = "imgWidth";
    IMG_HEIGHT: string = "imgHeight";
}
export let jcrCnst: JCRConstants = new JCRConstants();
