import {srch} from "./Search";
import {util} from "./Util";
import {meta64} from "./Meta64";
import * as I from "./Interfaces";
import {Factory} from "./Factory";
import {SharingDlg} from "./SharingDlg";

class Share {

    private findSharedNodesResponse = function(res: I.GetSharedNodesResponse) {
        srch.searchNodesResponse(res);
    }

    sharingNode: I.NodeInfo = null;

    /*
     * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
     */
    editNodeSharing = function(): void {
        let node: I.NodeInfo = meta64.getHighlightedNode();

        if (!node) {
            util.showMessage("No node is selected.");
            return;
        }
        share.sharingNode = node;

        Factory.createDefault("SharingDlgImpl", (dlg:SharingDlg) => {
          dlg.open();
        })
    }

    findSharedNodes = function(): void {
        let focusNode: I.NodeInfo = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }

        srch.searchPageTitle = "Shared Nodes";

        util.json<I.GetSharedNodesRequest, I.GetSharedNodesResponse>("getSharedNodes", {
            "nodeId": focusNode.id
        }, share.findSharedNodesResponse);
    }
}
export let share: Share = new Share();
export default share;
