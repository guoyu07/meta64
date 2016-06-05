console.log("running module: user.js");

var user = function() {

	// res is JSON response object from server.
	var _refreshLoginResponse = function(res) {
		console.log("refreshLoginResponse");

		if (res.success) {
			_setStateVarsUsingLoginResponse(res);
			_setTitleUsingLoginResponse(res);
		}

		meta64.loadAnonPageHome(false);
	}

	var _logoutResponse = function(res) {
		/* reloads browser with the query parameters stripped off the path */
		window.location.href = window.location.origin;
	}

	var _twitterLoginResponse = function(res) {
		console.log("twitter Login response recieved.");
	}

	var _ = {
		/*
		 * for testing purposes, I want to allow certain users additional privileges. A bit of a hack because it will go
		 * into production, but on my own production these are my "testUserAccounts", so no real user will be able to
		 * use these names
		 */
		isTestUserAccount : function() {
			return meta64.userName.toLowerCase() === "adam" || //
			meta64.userName.toLowerCase() === "bob" || //
			meta64.userName.toLowerCase() === "cory" || //
			meta64.userName.toLowerCase() === "dan";
		},

		setTitleUsingLoginResponse : function(res) {
			var title = BRANDING_TITLE;
			if (!meta64.isAnonUser) {
				title += " - " + res.userName;
			}

			$("#headerAppName").html(title);
		},

		/* TODO-3: move this into meta64 module */
		setStateVarsUsingLoginResponse : function(res) {
			if (res.rootNode) {
				meta64.homeNodeId = res.rootNode.id;
				meta64.homeNodePath = res.rootNode.path;
			}
			meta64.userName = res.userName;
			meta64.isAdminUser = res.userName === "admin";

			meta64.isAnonUser = res.userName === "anonymous";
			meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;

			meta64.editModeOption = res.userPreferences.advancedMode ? meta64.MODE_ADVANCED : meta64.MODE_SIMPLE;

			console.log("from server: meta64.editModeOption=" + meta64.editModeOption);
		},

		twitterLogin : function() {
			(new MessageDlg("not yet implemented.")).open();
			return;

			/*
			 * polymer Remove warning dialog to ask user about leaving the page $(window).off("beforeunload");
			 * window.location.href = window.location.origin + "/twitterLogin";
			 */
		},

		openSignupPg : function() {
			(new SignupDlg()).open();
		},

		/* Write a cookie that expires in a year for all paths */
		writeCookie : function(name, val) {
			$.cookie(name, val, {
				expires : 365,
				path : '/'
			});
		},

		/*
		 * This method is ugly. It is the button that can be login *or* logout.
		 */
		openLoginPg : function() {
			var loginDlg = new LoginDlg();
			loginDlg.populateFromCookies();
			loginDlg.open();
		},

		refreshLogin : function() {

			console.log("refreshLogin.");

			var callUsr, callPwd, usingCookies = false;
			var loginSessionReady = $("#loginSessionReady").text();
			if (loginSessionReady === "true") {
				console.log("    loginSessionReady = true");
				/*
				 * using blank credentials will cause server to look for a valid session
				 */
				callUsr = "";
				callPwd = "";
				usingCookies = true;
			} else {
				console.log("    loginSessionReady = false");

				var loginState = $.cookie(cnst.COOKIE_LOGIN_STATE);

				/* if we have known state as logged out, then do nothing here */
				if (loginState === "0") {
					meta64.loadAnonPageHome(false);
					return;
				}

				var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
				var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

				usingCookies = !util.emptyString(usr) && !util.emptyString(pwd);
				console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);

				/*
				 * empyt credentials causes server to try to log in with any active session credentials.
				 */
				callUsr = usr ? usr : "";
				callPwd = pwd ? pwd : "";
			}

			console.log("refreshLogin with name: " + callUsr);
			
			if (!callUsr) {
				meta64.loadAnonPageHome(false);
			} else {

				var ironRes = util.json("login", {
					"userName" : callUsr,
					"password" : callPwd,
					"tzOffset" : new Date().getTimezoneOffset(),
					"dst" : util.daylightSavingsTime
				});

				ironRes.completes.then(function() {

					if (usingCookies) {
						_.loginResponse(ironRes.response, callUsr, callPwd, usingCookies);
					} else {
						_refreshLoginResponse(ironRes.response);
					}
				});
			}
		},

		logout : function(updateLoginStateCookie) {
			if (meta64.isAnonUser) {
				return;
			}

			/* Remove warning dialog to ask user about leaving the page */
			$(window).off("beforeunload");

			if (updateLoginStateCookie) {
				_.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
			}

			util.json("logout", {}, _logoutResponse);
		},

		login : function(loginDlg, usr, pwd) {
			var ironRes = util.json("login", {
				"userName" : usr,
				"password" : pwd,
				"tzOffset" : new Date().getTimezoneOffset(),
				"dst" : util.daylightSavingsTime
			});

			ironRes.completes.then(function() {
				_.loginResponse(ironRes.response, usr, pwd, null, loginDlg);
			});
		},

		deleteAllUserCookies : function() {
			$.removeCookie(cnst.COOKIE_LOGIN_USR);
			$.removeCookie(cnst.COOKIE_LOGIN_PWD);
			$.removeCookie(cnst.COOKIE_LOGIN_STATE);
		},

		loginResponse : function(res, usr, pwd, usingCookies, loginDlg) {
			if (util.checkSuccess("Login", res)) {
				console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

				if (usr != "anonymous") {
					_.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
					_.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
					_.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
				}

				if (loginDlg) {
					loginDlg.cancel();
				}

				_.setStateVarsUsingLoginResponse(res);

				if (res.userPreferences.lastNode) {
					console.log("lastNode: " + res.userPreferences.lastNode);
				} else {
					console.log("lastNode is null.");
				}

				/* set ID to be the page we want to show user right after login */
				var id = null;

				if (!util.emptyString(res.homeNodeOverride)) {
					console.log("loading homeNodeOverride=" + res.homeNodeOverride);
					id = res.homeNodeOverride;
				} else {
					if (res.userPreferences.lastNode) {
						console.log("loading lastNode=" + res.userPreferences.lastNode);
						id = res.userPreferences.lastNode;
					} else {
						console.log("loading homeNodeId=" + meta64.homeNodeId);
						id = meta64.homeNodeId;
					}
				}

				view.refreshTree(id, false);
				_.setTitleUsingLoginResponse(res);
			} else {
				if (usingCookies) {
					(new MessageDlg("Cookie login failed.")).open();

					/*
					 * blow away failed cookie credentials and reload page, should result in brand new page load as anon
					 * user.
					 */
					$.removeCookie(cnst.COOKIE_LOGIN_USR);
					$.removeCookie(cnst.COOKIE_LOGIN_PWD);
					$.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
					location.reload();
				}
			}
		}

	};

	console.log("Module ready: user.js");
	return _;
}();

//# sourceURL=user.js
