console.log("UserIntf.ts");

import * as I from "../Interfaces";
import { LoginDlg } from "../dlg/LoginDlg";
//import { MessageDlg } from "./dlg/MessageDlg";
//import { SignupDlg } from "./dlg/SignupDlg";
//import { ConfirmDlg } from "./dlg/ConfirmDlg";
//import { Constants as cnst } from "./Constants";

export interface UserIntf {

    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any);

    closeAccountResponse(res: I.CloseAccountResponse): void;

    closeAccount(): void;

    /*
     * for testing purposes, I want to allow certain users additional privileges. A bit of a hack because it will go
     * into production, but on my own production these are my "testUserAccounts", so no real user will be able to
     * use these names
     */
    isTestUserAccount(): boolean;

    setTitleUsingLoginResponse(res): void;

    /* TODO-3: move this into meta64 module */
    setStateVarsUsingLoginResponse(res: I.LoginResponse): void;
    openSignupPg(): void;

    /*
     * This method is ugly. It is the button that can be login *or* logout.
     */
    openLoginPg(): void;

    refreshLogin(): void;
    logout(updateLoginStateCookie);


    login(loginDlg, usr, pwd);

    deleteAllUserCookies();

    loginResponse(res?: I.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg);
}
