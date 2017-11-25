console.log("User.ts");

import * as I from "./Interfaces";
import { LoginDlg } from "./dlg/LoginDlg";
import { MessageDlg } from "./dlg/MessageDlg";
import { SignupDlg } from "./dlg/SignupDlg";
import { ConfirmDlg } from "./dlg/ConfirmDlg";
import { Constants as cnst } from "./Constants";
import { UserIntf} from "./intf/UserIntf";

import { Factory } from "./Factory";

import { Meta64Intf as Meta64} from "./intf/Meta64Intf";
import { UtilIntf as Util} from "./intf/UtilIntf";
import { ViewIntf as View } from "./intf/ViewIntf";

let meta64: Meta64;
let util: Util;
let view: View;

export class User implements UserIntf {
    
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any) {
        let f: Factory = (<any>window).factory;
        util = f.getUtil();
        meta64 = f.getMeta64();
        view = f.getView();
    }

    private logoutResponse = (res: I.LogoutResponse): void => {
        /* reloads browser with the query parameters stripped off the path */
        window.location.href = window.location.origin;
    }

    closeAccountResponse = (res: I.CloseAccountResponse): void => {
        /* Remove warning dialog to ask user about leaving the page */
        window.onbeforeunload = null;

        /* reloads browser with the query parameters stripped off the path */
        window.location.href = window.location.origin;
    }

    closeAccount = (): void => {
        new ConfirmDlg({
            "title": "Oh No!",
            "message": "Close your Account?<p> Are you sure?",
            "buttonText": "Yes, Close Account.",
            "yesCallback":
                () => {
                    new ConfirmDlg({
                        "title": "One more Click",
                        "message": "Your data will be deleted and can never be recovered.<p> Are you sure?",
                        "buttonText": "Yes, Close Account.",
                        "yesCallback":
                            () => {
                                this.deleteAllUserCookies();
                                util.ajax<I.CloseAccountRequest, I.CloseAccountResponse>("closeAccount", {}, this.closeAccountResponse);
                            }
                    }).open();
                }
        }).open();
    }

    /*
     * for testing purposes, I want to allow certain users additional privileges. A bit of a hack because it will go
     * into production, but on my own production these are my "testUserAccounts", so no real user will be able to
     * use these names
     */
    isTestUserAccount = (): boolean => {
        return meta64.userName.toLowerCase() === "adam" || //
            meta64.userName.toLowerCase() === "bob" || //
            meta64.userName.toLowerCase() === "cory" || //
            meta64.userName.toLowerCase() === "dan";
    }

    setTitleUsingLoginResponse = (res): void => {
        var title = "SubNode";

        /* todo-1: If users go with very long usernames this is gonna be ugly */
        if (!meta64.isAnonUser) {
            title += ": " + res.userName;
        }

        util.setInnerHTMLById("headerAppName", title);
    }

    /* TODO-3: move this into meta64 module */
    setStateVarsUsingLoginResponse = (res: I.LoginResponse): void => {
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

    openSignupPg = (): void => {
        new SignupDlg().open();
    }

    /*
     * This method is ugly. It is the button that can be login *or* logout.
     */
    openLoginPg = (): void => {
        let dlg = new LoginDlg(null);
        dlg.populateFromCookies();
        dlg.open();
    }

    refreshLogin = (): void => {
        console.log("refreshLogin.");

        let callUsr: string;
        let callPwd: string;
        let usingCookies: boolean = false;

        let readyElm = util.domElm("#loginSessionReady");
        let loginSessionReady = !readyElm ? null : readyElm.textContent;
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

            let loginState: string = util.getCookie(cnst.COOKIE_LOGIN_STATE);

            /* if we have known state as logged out, then do nothing here */
            if (loginState === "0") {
                meta64.loadAnonPageHome(false);
                return;
            }

            let usr: string = util.getCookie(cnst.COOKIE_LOGIN_USR);
            let pwd: string = util.getCookie(cnst.COOKIE_LOGIN_PWD);

            usingCookies = !util.emptyString(usr) && !util.emptyString(pwd);
            console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);

            /*
             * empyt credentials causes server to try to log in with any active session credentials.
             */
            callUsr = usr || "";
            callPwd = pwd || "";
        }

        console.log("refreshLogin with name: " + callUsr);

        if (!callUsr) {
            meta64.loadAnonPageHome(false);
        } else {
            util.ajax<I.LoginRequest, I.LoginResponse>("login", {
                "userName": callUsr,
                "password": callPwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": util.daylightSavingsTime
            }, (res: I.LoginResponse) => {
                debugger;
                if (usingCookies) {
                    this.loginResponse(res, callUsr, callPwd, usingCookies);
                } else {
                    this.refreshLoginResponse(res);
                }
            });
        }
    }

    logout = (updateLoginStateCookie) => {
        if (meta64.isAnonUser) {
            return;
        }

        /* Remove warning dialog to ask user about leaving the page */
        window.onbeforeunload = null;

        if (updateLoginStateCookie) {
            util.setCookie(cnst.COOKIE_LOGIN_STATE, "0");
        }

        util.ajax<I.LogoutRequest, I.LogoutResponse>("logout", {}, this.logoutResponse);
    }


    login = (loginDlg, usr, pwd) => {
        util.ajax<I.LoginRequest, I.LoginResponse>("login", {
            "userName": usr,
            "password": pwd,
            "tzOffset": new Date().getTimezoneOffset(),
            "dst": util.daylightSavingsTime
        }, (res: I.LoginResponse) => {
            this.loginResponse(res, usr, pwd, null, loginDlg);
        });
    }

    deleteAllUserCookies = () => {
        util.deleteCookie(cnst.COOKIE_LOGIN_USR);
        util.deleteCookie(cnst.COOKIE_LOGIN_PWD);
        util.deleteCookie(cnst.COOKIE_LOGIN_STATE);
    }

    loginResponse = (res?: I.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg) => {
        if (util.checkSuccess("Login", res)) {
            console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

            if (usr != "anonymous") {
                util.setCookie(cnst.COOKIE_LOGIN_USR, usr);
                util.setCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                util.setCookie(cnst.COOKIE_LOGIN_STATE, "1");
            }

            if (loginDlg) {
                loginDlg.cancel();
            }

            this.setStateVarsUsingLoginResponse(res);

            /* set ID to be the page we want to show user right after login */
            let id: string = null;

            if (!util.emptyString(res.homeNodeOverride)) {
                console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                id = res.homeNodeOverride;
                meta64.homeNodeOverride = id;
            } else {
                let lastNode = localStorage.getItem("lastNode");
                if (lastNode) {
                    console.log("loading lastNode=" + lastNode);
                    id = lastNode;
                } else {
                    console.log("loading homeNodeId=" + meta64.homeNodeId);
                    id = meta64.homeNodeId;
                }
            }

            view.refreshTree(id, false, null, true);
            this.setTitleUsingLoginResponse(res);
        } else {
            if (usingCookies) {
                util.showMessage("Cookie login failed.");

                /*
                 * blow away failed cookie credentials and reload page, should result in brand new page load as anon
                 * this.
                 */
                util.deleteCookie(cnst.COOKIE_LOGIN_USR);
                util.deleteCookie(cnst.COOKIE_LOGIN_PWD);
                util.setCookie(cnst.COOKIE_LOGIN_STATE, "0");
                location.reload();
            }
        }
    }

    // res is JSON response object from server.
    private refreshLoginResponse = (res: I.LoginResponse): void => {
        console.log("refreshLoginResponse");

        if (res.success) {
            this.setStateVarsUsingLoginResponse(res);
            this.setTitleUsingLoginResponse(res);
        }

        meta64.loadAnonPageHome(false);
    }
}
