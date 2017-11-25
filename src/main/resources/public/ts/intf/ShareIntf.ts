import * as I from "../Interfaces";
//import { SharingDlg } from "./dlg/SharingDlg";

export interface ShareIntf {
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any)

    sharingNode: I.NodeInfo;

    /*
     * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
     */
    editNodeSharing(): void;
    findSharedNodes(): void;
}
