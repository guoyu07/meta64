console.log("running module: jcrCnst.js");
var JcrCnst = (function () {
    function JcrCnst() {
        this.COMMENT_BY = "commentBy";
        this.PUBLIC_APPEND = "publicAppend";
        this.PRIMARY_TYPE = "jcr:primaryType";
        this.POLICY = "rep:policy";
        this.MIXIN_TYPES = "jcr:mixinTypes";
        this.EMAIL_CONTENT = "jcr:content";
        this.EMAIL_RECIP = "recip";
        this.EMAIL_SUBJECT = "subject";
        this.CREATED = "jcr:created";
        this.CREATED_BY = "jcr:createdBy";
        this.CONTENT = "jcr:content";
        this.TAGS = "tags";
        this.UUID = "jcr:uuid";
        this.LAST_MODIFIED = "jcr:lastModified";
        this.LAST_MODIFIED_BY = "jcr:lastModifiedBy";
        this.DISABLE_INSERT = "disableInsert";
        this.USER = "user";
        this.PWD = "pwd";
        this.EMAIL = "email";
        this.CODE = "code";
        this.BIN_VER = "binVer";
        this.BIN_DATA = "jcrData";
        this.BIN_MIME = "jcr:mimeType";
        this.IMG_WIDTH = "imgWidth";
        this.IMG_HEIGHT = "imgHeight";
    }
    return JcrCnst;
}());
if (!window["jcrCnst"]) {
    var jcrCnst = new JcrCnst();
}
//# sourceMappingURL=jcrCnst.js.map