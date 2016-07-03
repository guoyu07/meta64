console.log("running module: jcrCnst.js");

class JcrCnst {

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

if (!window["jcrCnst"]) {
    var jcrCnst: JcrCnst = new JcrCnst();
}
