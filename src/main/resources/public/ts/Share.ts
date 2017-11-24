import * as I from "./Interfaces";
import { SharingDlg } from "./SharingDlg";

import { Factory } from "./types/Factory";

import { Meta64 } from "./types/Meta64";
import { Util } from "./types/Util";
import { Search } from "./types/Search";

let meta64: Meta64;
let util: Util;
let srch: Search;

export class Share {
    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any) {
        let f: Factory = _f;
        util = f.getUtil();
        meta64 = f.getMeta64();
        srch = f.getSearch();
    }
    
    private findSharedNodesResponse = (res: I.GetSharedNodesResponse) => {
        srch.searchNodesResponse(res);
    }

    sharingNode: I.NodeInfo = null;

    /*
     * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
     */
    editNodeSharing = (): void => {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (!node) {
            util.showMessage("No node is selected.");
            return;
        }
        this.sharingNode = node;

        new SharingDlg().open();
    }

    findSharedNodes = (): void => {
        let focusNode: I.NodeInfo = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }

        srch.searchPageTitle = "Shared Nodes";

        util.ajax<I.GetSharedNodesRequest, I.GetSharedNodesResponse>("getSharedNodes", {
            "nodeId": focusNode.id
        }, this.findSharedNodesResponse);
    }
}
