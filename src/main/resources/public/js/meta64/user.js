console.log("running module: user.js");

var user = function() {

	var _setTitleUsingLoginResponse = function(res) {
		var title = BRANDING_TITLE;
		if (!meta64.isAnonUser) {
			title += " - " + res.userName;
		}

		$("#headerAppName").html(title);

		/*
		 * todo: commented for polymer var loginEnable = meta64.isAnonUser;
		 * $("#openLoginPgButton").text(loginEnable ? "Login" : "Logout");
		 */
	}

	/* TODO: move this into meta64 module */
	var _setStateVarsUsingLoginResponse = function(res) {
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
	}

	/* ret is LoginResponse.java */
	var _loginResponse = function(res, usr, pwd, usingCookies) {
		if (util.checkSuccess("Login", res)) {
			console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

			if (usr != "anonymous") {
				_.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
				_.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
				_.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
			}

			meta64.cancelDialog(loginPg.domId);
			meta64.jqueryChangePage("mainTabName");

			_setStateVarsUsingLoginResponse(res);

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
			_setTitleUsingLoginResponse(res);
		} else {
			if (usingCookies) {
				messagePg.alert("Cookie login failed.");

				/*
				 * blow away failed cookie credentials and reload page, should
				 * result in brand new page load as anon user.
				 */
				$.removeCookie(cnst.COOKIE_LOGIN_USR);
				$.removeCookie(cnst.COOKIE_LOGIN_PWD);
				$.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
				location.reload();
			}
		}
	}

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
			messagePg.alert("Password changed successfully.");
		}
	}

	var _signupResponse = function(res) {
		if (util.checkSuccess("Signup new user", res)) {
			user.populateLoginPgFromCookies();
			meta64.changePage(loginPg);
			messagePg.alert("User Information Accepted. \n\nCheck your email for signup confirmation. (Can take up to 1 minute)");
		}
	}

	var _twitterLoginResponse = function(res) {
		console.log("twitter Login response recieved.");
	}

	var _ = {

		twitterLogin : function() {
			messagePg.alert('not yet implemented.');
			return;

			/*
			 * polymer Remove warning dialog to ask user about leaving the page
			 * $(window).off("beforeunload"); window.location.href =
			 * window.location.origin + "/twitterLogin";
			 */
		},

		openSignupPg : function() {
			meta64.changePage(signupPg);
		},

		/* Write a cookie that expires in a year for all paths */
		writeCookie : function(name, val) {
			$.cookie(name, val, {
				expires : 365,
				path : '/'
			});
		},

		populateLoginPgFromCookies : function() {
			var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
			var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

			if (usr) {
				$("#userName").val(usr);
			}
			if (pwd) {
				$("#password").val(pwd);
			}
		},

		/*
		 * This method is ugly. It is the button that can be login *or* logout.
		 */
		openLoginPg : function() {
			meta64.openDialog(loginPg);
		},

		signup : function() {
			var userName = util.getInputVal("signupUserName");
			var password = util.getInputVal("signupPassword");
			var email = util.getInputVal("signupEmail");
			var captcha = util.getInputVal("signupCaptcha");

			/* no real validation yet, other than non-empty */
			if (util.anyEmpty(userName, password, email, captcha)) {
				messagePg.alert('Sorry, you cannot leave any fields blank.');
				return;
			}

			util.json("signup", {
				"userName" : userName,
				"password" : password,
				"email" : email,
				"captcha" : captcha
			}, _signupResponse);
		},

		pageInitSignupPg : function() {
			user.tryAnotherCaptcha();
		},

		tryAnotherCaptcha : function() {

			var n = util.currentTimeMillis();

			/*
			 * embed a time parameter just to thwart browser caching, and ensure
			 * server and browser will never return the same image twice.
			 */
			var src = postTargetUrl + "captcha?t=" + n;
			$("#captchaImage").attr("src", src);
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
					_loginResponse(ironRes.response, callUsr, callPwd, usingCookies);
				} else {
					_refreshLoginResponse(ironRes.response);
				}
			});
		},

		login : function() {

			meta64.cancelDialog(loginPg.domId);
			
			var usr = util.getInputVal("userName").trim();
			var pwd = util.getInputVal("password").trim();

			var ironRes = util.json("login", {
				"userName" : usr,
				"password" : pwd,
				"tzOffset" : new Date().getTimezoneOffset(),
				"dst" : util.daylightSavingsTime
			});

			ironRes.completes.then(function() {
				_loginResponse(ironRes.response, usr, pwd);
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
				messagePg.alert("Invalid password(s).");
			}
		},

		changePasswordPg : function() {
			meta64.changePage(changePasswordPg);
		}
	};

	console.log("Module ready: user.js");
	return _;
}();

//# sourceURL=user.js
