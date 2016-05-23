console.log("running module: cnst.js");

var cnst = function() {
	var _ = {
		ANON : "anonymous",
		COOKIE_LOGIN_USR : cookiePrefix + "loginUsr",
		COOKIE_LOGIN_PWD : cookiePrefix + "loginPwd",
		/*
		 * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
		 */
		COOKIE_LOGIN_STATE : cookiePrefix + "loginState",
		BR : "<div class='vert-space'></div>",
		INSERT_ATTACHMENT : "{{insert-attachment}}",
		NEW_ON_TOOLBAR : true,
		INS_ON_TOOLBAR : true,

		/*
		 * This works, but I'm not sure I want it for ALL editing. Still thinking about design here, before I turn this
		 * on.
		 */
		USE_ACE_EDITOR : false,

		/* showing path on rows just wastes space for ordinary users. Not really needed */
		SHOW_PATH_ON_ROWS : true,
		SHOW_PATH_IN_DLGS : true
	};

	console.log("Module ready: cnst.js");
	return _;
}();

//# sourceURL=cnst.js
