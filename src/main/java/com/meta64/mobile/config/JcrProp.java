package com.meta64.mobile.config;

/**
 * JCR Node Property Names (constants), node names, types...
 */
public class JcrProp {

	// public static final String RSS_FEED_ROOT_URLS = "rssFeedRootUrls";

	// ---------------------------------------------
	// BEGIN jcr-types.txt file
	// ---------------------------------------------

	public static final String META6_TYPE_FOLDER = "sn:folder";

	public static final String TYPE_RSS_FEED = "sn:rssfeed";
	public static final String RSS_FEED_TITLE = "sn:rssFeedTitle";
	public static final String RSS_FEED_DESC = "sn:rssFeedDesc";
	public static final String RSS_FEED_URI = "sn:rssFeedUri";
	public static final String RSS_FEED_LINK = "sn:rssFeedLink";
	public static final String RSS_FEED_IMAGE_URL = "sn:rssFeedImageUrl";

	/*
	 * this is the one entered by the admin which DEFINES the feed, and is not to be overwritten
	 * ever by the code
	 */
	public static final String RSS_FEED_SRC = "sn:rssFeedSrc";

	public static final String TYPE_RSS_ITEM = "sn:rssitem";
	public static final String RSS_ITEM_TITLE = "sn:rssItemTitle";
	public static final String RSS_ITEM_DESC = "sn:rssItemDesc";
	public static final String RSS_ITEM_URI = "sn:rssItemUri";
	public static final String RSS_ITEM_LINK = "sn:rssItemLink";
	public static final String RSS_ITEM_AUTHOR = "sn:rssItemAuthor";
	public static final String RSS_ITEM_ENC_TYPE = "sn:rssItemEncType";
	public static final String RSS_ITEM_ENC_LENGTH = "sn:rssItemEncLength";
	public static final String RSS_ITEM_ENC_URL = "sn:rssItemEncUrl";
	// public static final String RSS_ENTRY_IMAGE_URL = "rssEntryImageUrl";

	// ---------------------------------------------
	// END jcr-types.txt file
	// ---------------------------------------------

	public static final String MERKLE_HASH = "sn:merkle";

	/*
	 * "true" means any user can add subnode under the node that has this property
	 */
	public static final String PUBLIC_APPEND = "sn:publicAppend";

	/*
	 * comment nodes are always 'admin owned' in terms of the true credentials, but are flagged as
	 * who the comment was actually posted by using the 'commentBy' property. This way that person
	 * can be allowed to edit the content, but have no other privileges.
	 */
	public static final String COMMENT_BY = "sn:commentBy";

	public static final String USER_PREF_LAST_NODE = "sn:lastNode";
	public static final String USER_PREF_ADV_MODE = "sn:advMode";
	public static final String USER_PREF_EDIT_MODE = "sn:editMode";
	public static final String USER_PREF_SHOW_METADATA = "sn:showMetaData";
	public static final String USER_PREF_IMPORT_ALLOWED = "sn:importAllowed";
	public static final String USER_PREF_EXPORT_ALLOWED = "sn:exportAllowed";
	public static final String USER_PREF_PASSWORD_RESET_AUTHCODE = "sn:pwdResetAuth";

	/*
	 * Goes on node: Paths defined by: JcrUtil.getSystemOutbox(session) + GUID (guid is unique per
	 * outbound email)
	 */
	public static final String EMAIL_CONTENT = "sn:content";
	public static final String EMAIL_RECIP = "sn:recip";
	public static final String EMAIL_SUBJECT = "sn:subject";

	//WARNING: Only the User Account Root nodes have this property of the actual user name. All other nodes reference
	//their OWNER as an OwnerId that points to these nodes.
	public static final String USER = "sn:user";
	
	public static final String CREATED = "sn:created";
	public static final String CONTENT = "sn:content";
	public static final String UUID = "sn:uuid";
	public static final String PRIMARY_TYPE = "sn:primaryType";
	public static final String LAST_MODIFIED = "sn:lastModified";
	public static final String FILENAME = "sn:fileName";
	public static final String NAME = "sn:name";
	public static final String JSON_FILE_SEARCH_RESULT = "sn:jsonFileSearchResult";
	public static final String DISABLE_INSERT = "sn:disableInsert";

	/*
	 * mime type expressed as a file extension. Invented so we can set 'txt' v.s. 'md' to turn off
	 * metadata rendering
	 */
	public static final String MIME_EXT = "sn:ext";

	/*
	 * Sub Properties of Signup node
	 * 
	 * Example Node: /[JcrName.SIGNUP]/[userName]
	 */
	public static final String PASSWORD = "sn:pwd";
	public static final String EMAIL = "sn:email";
	public static final String CODE = "sn:code";

	/*
	 * todo-0: this implementation on the server will not work for my current purposes. Need a TRUE
	 * hash of the binary here instead, although we may be able to get away with a very shortened
	 * one.
	 */
	public static final String BIN_VER = "sn:binVer";

	/*
	 * I want to use jcr namespace for these since they exist and are known
	 * 
	 * I stopped using jcr:data, when I read docs online saying JCR does try to index content in
	 * binaries, and until I can be sure it's not trying to index images I will just turn off
	 * jcr:data, and use a proprietary property not recognized by jcr
	 */
	public static final String BIN_MIME = "sn:mimeType";
	public static final String BIN_FILENAME = "sn:jcrFileName";
	public static final String BIN_SIZE = "sn:size";

	public static final String IMG_WIDTH = "sn:imgWidth";
	public static final String IMG_HEIGHT = "sn:imgHeight";
}
