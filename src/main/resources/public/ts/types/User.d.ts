import * as I from "./Interfaces";
import { LoginDlg } from "./dlg/LoginDlg";
export declare class User {
    postConstruct(_f: any): void;
    private logoutResponse;
    closeAccountResponse: (res: I.CloseAccountResponse) => void;
    closeAccount: () => void;
    isTestUserAccount: () => boolean;
    setTitleUsingLoginResponse: (res: any) => void;
    setStateVarsUsingLoginResponse: (res: I.LoginResponse) => void;
    openSignupPg: () => void;
    openLoginPg: () => void;
    refreshLogin: () => void;
    logout: (updateLoginStateCookie: any) => void;
    login: (loginDlg: any, usr: any, pwd: any) => void;
    deleteAllUserCookies: () => void;
    loginResponse: (res?: I.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg) => void;
    private refreshLoginResponse;
}
