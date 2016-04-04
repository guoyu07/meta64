console.log("running module: jcrCnst.js");

var jcrCnst = function() {

	var _ = {
		COMMENT_BY : "commentBy",
		PUBLIC_APPEND : "publicAppend",
		PRIMARY_TYPE : "jcr:primaryType",
		POLICY : "rep:policy",

		MIXIN_TYPES : "jcr:mixinTypes",

		EMAIL_CONTENT : "jcr:content",
		EMAIL_RECIP : "recip",
		EMAIL_SUBJECT : "subject",

		CREATED : "jcr:created",
		CREATED_BY : "jcr:createdBy",
		CONTENT : "jcr:content",
		TAGS : "tags",
		UUID : "jcr:uuid",
		LAST_MODIFIED : "jcr:lastModified",
		LAST_MODIFIED_BY : "jcr:lastModifiedBy",
		
		DISABLE_INSERT : "disableInsert",

		USER : "user",
		PWD : "pwd",
		EMAIL : "email",
		CODE : "code",

		BIN_VER : "binVer",
		BIN_DATA : "jcrData",
		BIN_MIME : "jcr:mimeType",

		IMG_WIDTH : "imgWidth",
		IMG_HEIGHT : "imgHeight"
	};

	console.log("Module ready: jcrCnst.js");
	return _;
}();

//# sourceURL=jcrCnst.js
