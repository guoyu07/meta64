package com.meta64.mobile.config;

/**
 * JCR Node Property Names (constants), node names, types...
 */
public class JcrProp {

	// public static final String RSS_FEED_ROOT_URLS = "rssFeedRootUrls";

	// ---------------------------------------------
	// BEGIN jcr-types.txt file
	// ---------------------------------------------

	public static final String META6_TYPE_FOLDER = "meta64:folder";

	public static final String TYPE_RSS_FEED = "meta64:rssfeed";
	public static final String RSS_FEED_TITLE = "meta64:rssFeedTitle";
	public static final String RSS_FEED_DESC = "meta64:rssFeedDesc";
	public static final String RSS_FEED_URI = "meta64:rssFeedUri";
	public static final String RSS_FEED_LINK = "meta64:rssFeedLink";
	public static final String RSS_FEED_IMAGE_URL = "meta64:rssFeedImageUrl";

	/*
	 * this is the one entered by the admin which DEFINES the feed, and is not to be overwritten
	 * ever by the code
	 */
	public static final String RSS_FEED_SRC = "meta64:rssFeedSrc";

	public static final String TYPE_RSS_ITEM = "meta64:rssitem";
	public static final String RSS_ITEM_TITLE = "meta64:rssItemTitle";
	public static final String RSS_ITEM_DESC = "meta64:rssItemDesc";
	public static final String RSS_ITEM_URI = "meta64:rssItemUri";
	public static final String RSS_ITEM_LINK = "meta64:rssItemLink";
	public static final String RSS_ITEM_AUTHOR = "meta64:rssItemAuthor";
	public static final String RSS_ITEM_ENC_TYPE = "meta64:rssItemEncType";
	public static final String RSS_ITEM_ENC_LENGTH = "meta64:rssItemEncLength";
	public static final String RSS_ITEM_ENC_URL = "meta64:rssItemEncUrl";
	// public static final String RSS_ENTRY_IMAGE_URL = "rssEntryImageUrl";

	// ---------------------------------------------
	// END jcr-types.txt file
	// ---------------------------------------------

	public static final String MERKLE_HASH = "meta64:merkle";

	/*
	 * "true" means any user can add subnode under the node that has this property
	 */
	public static final String PUBLIC_APPEND = "publicAppend";

	/*
	 * comment nodes are always 'admin owned' in terms of the true credentials, but are flagged as
	 * who the comment was actually posted by using the 'commentBy' property. This way that person
	 * can be allowed to edit the content, but have no other privileges.
	 */
	public static final String COMMENT_BY = "commentBy";

	public static final String MIXIN_TYPES = "jcr:mixinTypes";

	public static final String USER_PREF_LAST_NODE = "lastNode";
	public static final String USER_PREF_ADV_MODE = "advMode";
	public static final String USER_PREF_EDIT_MODE = "editMode";
	public static final String USER_PREF_SHOW_METADATA = "showMetaData";
	public static final String USER_PREF_IMPORT_ALLOWED = "importAllowed";
	public static final String USER_PREF_EXPORT_ALLOWED = "exportAllowed";
	public static final String USER_PREF_PASSWORD_RESET_AUTHCODE = "pwdResetAuth";

	/*
	 * Goes on node: Paths defined by: JcrUtil.getSystemOutbox(session) + GUID (guid is unique per
	 * outbound email)
	 */
	public static final String EMAIL_CONTENT = "jcr:content";
	public static final String EMAIL_RECIP = "recip";
	public static final String EMAIL_SUBJECT = "subject";

	public static final String CREATED = "jcr:created";
	public static final String CREATED_BY = "jcr:createdBy";
	public static final String CONTENT = "jcr:content";
	public static final String UUID = "jcr:uuid";
	public static final String PRIMARY_TYPE = "jcr:primaryType";
	public static final String LAST_MODIFIED = "jcr:lastModified";
	public static final String LAST_MODIFIED_BY = "jcr:lastModifiedBy";
	public static final String FILENAME = "fileName";
	public static final String NAME = "meta64:name";
	public static final String JSON_FILE_SEARCH_RESULT = "jsonFileSearchResult";
	public static final String DISABLE_INSERT = "disableInsert";

	/*
	 * mime type expressed as a file extension. Invented so we can set 'txt' v.s. 'md' to turn off
	 * metadata rendering
	 */
	public static final String MIME_EXT = "ext";

	/*
	 * Sub Properties of Signup node
	 * 
	 * Example Node: /[JcrName.SIGNUP]/[userName]
	 */
	public static final String USER = "user";
	public static final String PWD = "pwd";
	public static final String EMAIL = "email";
	public static final String CODE = "code";

	/*
	 * todo-0: this implementation on the server will not work for my current purposes. Need a TRUE
	 * hash of the binary here instead, although we may be able to get away with a very shortened
	 * one.
	 */
	public static final String BIN_VER = "binVer";

	/*
	 * I want to use jcr namespace for these since they exist and are known
	 * 
	 * I stopped using jcr:data, when I read docs online saying JCR does try to index content in
	 * binaries, and until I can be sure it's not trying to index images I will just turn off
	 * jcr:data, and use a proprietary property not recognized by jcr
	 */
	public static final String BIN_DATA = "jcrData";
	public static final String BIN_MIME = "jcr:mimeType";
	public static final String BIN_FILENAME = "jcrFileName";

	public static final String IMG_WIDTH = "imgWidth";
	public static final String IMG_HEIGHT = "imgHeight";
}
