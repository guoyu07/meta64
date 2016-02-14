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

	var _changePasswordResponse = function(res) {
		if (util.checkSuccess("Change password", res)) {
			(new MessageDlg("Password changed successfully.")).open();
		}
	}

	var _twitterLoginResponse = function(res) {
		console.log("twitter Login response recieved.");
	}

	var _ = {
		setTitleUsingLoginResponse : function(res) {
			var title = BRANDING_TITLE;
			if (!meta64.isAnonUser) {
				title += " - " + res.userName;
			}

			$("#headerAppName").html(title);
		},

		/* TODO: move this into meta64 module */
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
			 * polymer Remove warning dialog to ask user about leaving the page
			 * $(window).off("beforeunload"); window.location.href =
			 * window.location.origin + "/twitterLogin";
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
				 * using blank credentials will cause server to look for a valid
				 * session
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
				 * empyt credentials causes server to try to log in with any
				 * active session credentials.
				 */
				callUsr = usr ? usr : "";
				callPwd = pwd ? pwd : "";
			}

			console.log("refreshLogin with name: " + callUsr);

			var ironRes = util.json("login", {
				"userName" : callUsr,
				"password" : callPwd,
				"tzOffset" : new Date().getTimezoneOffset(),
				"dst" : util.daylightSavingsTime
			});

			ironRes.completes.then(function() {

				if (usingCookies) {
					user.loginResponse(ironRes.response, callUsr, callPwd, usingCookies);
				} else {
					_refreshLoginResponse(ironRes.response);
				}
			});
		},

		logout : function(updateLoginStateCookie) {
			if (meta64.isAnonUser) {
				return;
			}

			/* Remove warning dialog to ask user about leaving the page */
			$(window).off("beforeunload");

			if (updateLoginStateCookie) {
				user.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
			}

			util.json("logout", {}, _logoutResponse);
		},

		changePassword : function() {
			var pwd1 = util.getInputVal("changePassword1").trim();
			var pwd2 = util.getInputVal("changePassword2").trim();

			if (pwd1 && pwd1.length >= 4 && pwd1 === pwd2) {
				util.json("changePassword", {
					"newPassword" : pwd1
				}, _changePasswordResponse);
			} else {
				(new MessageDlg("Invalid password(s).")).open();
			}
		},

		loginResponse : function(res, usr, pwd, usingCookies, loginDlg) {
			if (util.checkSuccess("Login", res)) {
				console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

				if (usr != "anonymous") {
					user.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
					user.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
					user.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
				}

				if (loginDlg) {
					loginDlg.cancel();
				}

				user.setStateVarsUsingLoginResponse(res);

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
				user.setTitleUsingLoginResponse(res);
			} else {
				if (usingCookies) {
					(new MessageDlg("Cookie login failed.")).open();

					/*
					 * blow away failed cookie credentials and reload page,
					 * should result in brand new page load as anon user.
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
