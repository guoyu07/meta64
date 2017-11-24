import * as I from "./Interfaces";
export declare class Share {
    postConstruct(_f: any): void;
    private findSharedNodesResponse;
    sharingNode: I.NodeInfo;
    editNodeSharing: () => void;
    findSharedNodes: () => void;
}
