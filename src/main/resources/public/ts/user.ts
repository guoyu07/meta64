console.log("running module: user.js");

namespace m64 {
    export namespace user {

        let logoutResponse = function(res: json.LogoutResponse): void {
            /* reloads browser with the query parameters stripped off the path */
            window.location.href = window.location.origin;
        }

        /*
         * for testing purposes, I want to allow certain users additional privileges. A bit of a hack because it will go
         * into production, but on my own production these are my "testUserAccounts", so no real user will be able to
         * use these names
         */
        export let isTestUserAccount = function(): boolean {
            return meta64.userName.toLowerCase() === "adam" || //
                meta64.userName.toLowerCase() === "bob" || //
                meta64.userName.toLowerCase() === "cory" || //
                meta64.userName.toLowerCase() === "dan";
        }

        export let setTitleUsingLoginResponse = function(res): void {
            var title = BRANDING_TITLE_SHORT;

            /* todo-0: If users go with very long usernames this is gonna be ugly */
            if (!meta64.isAnonUser) {
                title += ":" + res.userName;
            }

            $("#headerAppName").html(title);
        }

        /* TODO-3: move this into meta64 module */
        export let setStateVarsUsingLoginResponse = function(res: json.LoginResponse): void {
            if (res.rootNode) {
                meta64.homeNodeId = res.rootNode.id;
                meta64.homeNodePath = res.rootNode.path;
            }
            meta64.userName = res.userName;
            meta64.isAdminUser = res.userName === "admin";
            meta64.isAnonUser = res.userName === "anonymous";
            meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;
            meta64.allowFileSystemSearch = res.allowFileSystemSearch;

            meta64.userPreferences = res.userPreferences;
            meta64.editModeOption = res.userPreferences.advancedMode ? meta64.MODE_ADVANCED : meta64.MODE_SIMPLE;
            meta64.showMetaData = res.userPreferences.showMetaData;

            console.log("from server: meta64.editModeOption=" + meta64.editModeOption);
        }

        export let openSignupPg = function(): void {
            (new SignupDlg()).open();
        }

        /* Write a cookie that expires in a year for all paths */
        export let writeCookie = function(name, val): void {
            $.cookie(name, val, {
                expires: 365,
                path: '/'
            });
        }

        /*
         * This method is ugly. It is the button that can be login *or* logout.
         */
        export let openLoginPg = function(): void {
            let loginDlg: LoginDlg = new LoginDlg();
            loginDlg.populateFromCookies();
            loginDlg.open();
        }

        export let refreshLogin = function(): void {

            console.log("refreshLogin.");

            let callUsr: string;
            let callPwd: string;
            let usingCookies: boolean = false;

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

                let loginState: string = $.cookie(cnst.COOKIE_LOGIN_STATE);

                /* if we have known state as logged out, then do nothing here */
                if (loginState === "0") {
                    meta64.loadAnonPageHome(false);
                    return;
                }

                let usr: string = $.cookie(cnst.COOKIE_LOGIN_USR);
                let pwd: string = $.cookie(cnst.COOKIE_LOGIN_PWD);

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
                util.json<json.LoginRequest, json.LoginResponse>("login", {
                    "userName": callUsr,
                    "password": callPwd,
                    "tzOffset": new Date().getTimezoneOffset(),
                    "dst": util.daylightSavingsTime
                }, function(res: json.LoginResponse) {
                    if (usingCookies) {
                        loginResponse(res, callUsr, callPwd, usingCookies);
                    } else {
                        refreshLoginResponse(res);
                    }
                });
            }
        }

        export let logout = function(updateLoginStateCookie) {
            if (meta64.isAnonUser) {
                return;
            }

            /* Remove warning dialog to ask user about leaving the page */
            $(window).off("beforeunload");

            if (updateLoginStateCookie) {
                writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
            }

            util.json<json.LogoutRequest, json.LogoutResponse>("logout", {}, logoutResponse);
        }

        export let login = function(loginDlg, usr, pwd) {
            util.json<json.LoginRequest, json.LoginResponse>("login", {
                "userName": usr,
                "password": pwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": util.daylightSavingsTime
            }, function(res: json.LoginResponse) {
                loginResponse(res, usr, pwd, null, loginDlg);
            });
        }

        export let deleteAllUserCookies = function() {
            $.removeCookie(cnst.COOKIE_LOGIN_USR);
            $.removeCookie(cnst.COOKIE_LOGIN_PWD);
            $.removeCookie(cnst.COOKIE_LOGIN_STATE);
        }

        export let loginResponse = function(res?: json.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg) {
            if (util.checkSuccess("Login", res)) {
                console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

                if (usr != "anonymous") {
                    writeCookie(cnst.COOKIE_LOGIN_USR, usr);
                    writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                    writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
                }

                if (loginDlg) {
                    loginDlg.cancel();
                }

                setStateVarsUsingLoginResponse(res);

                if (res.userPreferences.lastNode) {
                    console.log("lastNode: " + res.userPreferences.lastNode);
                } else {
                    console.log("lastNode is null.");
                }

                /* set ID to be the page we want to show user right after login */
                let id: string = null;

                if (!util.emptyString(res.homeNodeOverride)) {
                    console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                    id = res.homeNodeOverride;
                    meta64.homeNodeOverride = id;
                } else {
                    if (res.userPreferences.lastNode) {
                        console.log("loading lastNode=" + res.userPreferences.lastNode);
                        id = res.userPreferences.lastNode;
                    } else {
                        console.log("loading homeNodeId=" + meta64.homeNodeId);
                        id = meta64.homeNodeId;
                    }
                }

                view.refreshTree(id, false, null, true);
                setTitleUsingLoginResponse(res);
            } else {
                if (usingCookies) {
                    (new MessageDlg("Cookie login failed.")).open();

                    /*
                     * blow away failed cookie credentials and reload page, should result in brand new page load as anon
                     * user.
                     */
                    $.removeCookie(cnst.COOKIE_LOGIN_USR);
                    $.removeCookie(cnst.COOKIE_LOGIN_PWD);
                    writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
                    location.reload();
                }
            }
        }

        // res is JSON response object from server.
        let refreshLoginResponse = function(res: json.LoginResponse): void {
            console.log("refreshLoginResponse");

            if (res.success) {
                user.setStateVarsUsingLoginResponse(res);
                user.setTitleUsingLoginResponse(res);
            }

            meta64.loadAnonPageHome(false);
        }
    }
}
