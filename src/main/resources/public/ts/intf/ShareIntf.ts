import * as I from "../Interfaces";

import {Singletons} from "../Singletons";

export interface ShareIntf {
    postConstruct(s: Singletons)

    sharingNode: I.NodeInfo;
    editNodeSharing(): void;
    findSharedNodes(): void;
}
