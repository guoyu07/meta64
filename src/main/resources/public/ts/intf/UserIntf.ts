console.log("UserIntf.ts");

import * as I from "../Interfaces";
import { LoginDlg } from "../dlg/LoginDlg";
import {Singletons} from "../Singletons";

export interface UserIntf {
    postConstruct(s: Singletons);
    closeAccountResponse(res: I.CloseAccountResponse): void;
    closeAccount(): void;
    isTestUserAccount(): boolean;
    setTitleUsingLoginResponse(res): void;
    setStateVarsUsingLoginResponse(res: I.LoginResponse): void;
    openSignupPg(): void;
    openLoginPg(): void;
    refreshLogin(): void;
    logout(updateLoginStateCookie);
    login(loginDlg, usr, pwd);
    deleteAllUserCookies();
    loginResponse(res?: I.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg);
}
