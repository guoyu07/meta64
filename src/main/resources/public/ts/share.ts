console.log("running module: share.js");

namespace m64 {
    export namespace share {

        let findSharedNodesResponse = function(res: json.GetSharedNodesResponse) {
            srch.searchNodesResponse(res);
        }

        export let sharingNode: json.NodeInfo = null;

        /*
         * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
         */
        export let editNodeSharing = function() : void {
            let node:json.NodeInfo = meta64.getHighlightedNode();

            if (!node) {
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            sharingNode = node;
            (new SharingDlg()).open();
        }

        export let findSharedNodes = function() : void {
            let focusNode:json.NodeInfo = meta64.getHighlightedNode();
            if (focusNode == null) {
                return;
            }

            srch.searchPageTitle = "Shared Nodes";

            util.json<json.GetSharedNodesRequest, json.GetSharedNodesResponse>("getSharedNodes", {
                "nodeId": focusNode.id
            }, findSharedNodesResponse);
        }
    }
}
