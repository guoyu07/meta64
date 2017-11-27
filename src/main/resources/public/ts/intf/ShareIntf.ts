import * as I from "../Interfaces";

import {Singletons} from "../Singletons";

export interface ShareIntf {

    sharingNode: I.NodeInfo;
    editNodeSharing(): void;
    findSharedNodes(): void;
}
