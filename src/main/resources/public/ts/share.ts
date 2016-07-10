console.log("running module: share.js");

namespace m64 {
    export namespace share {

        let _findSharedNodesResponse = function(res) {
            srch.searchNodesResponse(res);
        }

        export let sharingNode: any = null;

        /*
         * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
         */
        export let editNodeSharing = function() {
            var node = meta64.getHighlightedNode();

            if (!node) {
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            sharingNode = node;
            (new SharingDlg()).open();
        }

        export let findSharedNodes = function() {
            var focusNode = meta64.getHighlightedNode();
            if (focusNode == null) {
                return;
            }

            srch.searchPageTitle = "Shared Nodes";

            util.json("getSharedNodes", {
                "nodeId": focusNode.id
            }, _findSharedNodesResponse);
        }
    }
}
