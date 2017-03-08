import { DialogBase } from "./DialogBase";

export interface SharingDlg extends DialogBase {
    removePrivilege(principal: string, privilege: string): void;
    reload() : void;
}
