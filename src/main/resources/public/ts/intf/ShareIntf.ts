import * as I from "../Interfaces";

export interface ShareIntf {
    postConstruct(_f: any)

    sharingNode: I.NodeInfo;
    editNodeSharing(): void;
    findSharedNodes(): void;
}
