import * as I from "./Interfaces";
import { SharingDlg } from "./dlg/SharingDlg";
import { Factory } from "./Factory";
import { Meta64Intf as Meta64 } from "./intf/Meta64Intf";
import { UtilIntf as Util } from "./intf/UtilIntf";
import { SearchIntf as Search } from "./intf/SearchIntf";
import { ShareIntf } from "./intf/ShareIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";


let meta64: Meta64;
let util: Util;
let srch: Search;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    util = s.util;
    meta64 = s.meta64;
    srch = s.srch;
});

export class Share implements ShareIntf {

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
