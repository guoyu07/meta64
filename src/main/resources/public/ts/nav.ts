console.log("running module: nav.js");

namespace m64 {
    export namespace nav {
        export let _UID_ROWID_SUFFIX: string = "_row";

        export let expandMore = function(nodeId: string) : void {

            /* I'm setting this here so that we can come up with a way to make the abbrev expand state be remembered, button
            this is lower priority for now, so i'm not using it yet */
            meta64.expandedAbbrevNodeIds[nodeId] = true;

            util.json<json.ExpandAbbreviatedNodeRequest, json.ExpandAbbreviatedNodeResponse>("expandAbbreviatedNode", {
                "nodeId": nodeId
            }, expandAbbreviatedNodeResponse);
        }

        let expandAbbreviatedNodeResponse = function(res: json.ExpandAbbreviatedNodeResponse): void {
            if (util.checkSuccess("ExpandAbbreviatedNode", res)) {
                //console.log("VAL: "+JSON.stringify(res.nodeInfo));
                render.refreshNodeOnPage(res.nodeInfo);
            }
        }

        export let displayingHome = function() : boolean{
            if (meta64.isAnonUser) {
                return meta64.currentNodeId === meta64.anonUserLandingPageNode;
            } else {
                return meta64.currentNodeId === meta64.homeNodeId;
            }
        }

        export let parentVisibleToUser = function() : boolean{
            return !displayingHome();
        }

        export let upLevelResponse = function(res: json.RenderNodeResponse, id) : void{
            if (!res || !res.node) {
                (new MessageDlg("No data is visible to you above this node.")).open();
            } else {
                render.renderPageFromData(res);
                meta64.highlightRowById(id, true);
                meta64.refreshAllGuiEnablement();
            }
        }

        export let navUpLevel = function() : void{

            if (!parentVisibleToUser()) {
                // Already at root. Can't go up.
                return;
            }

            var ironRes = util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": 1,
                "renderParentIfLeaf": false
            }, function(res: json.RenderNodeResponse) {
                upLevelResponse(ironRes.response, meta64.currentNodeId);
            });
        }

        /*
         * turn of row selection DOM element of whatever row is currently selected
         */
        export let getSelectedDomElement = function() : any {

            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {

                /* get node by node identifier */
                let node: json.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                if (node) {
                    console.log("found highlighted node.id=" + node.id);

                    /* now make CSS id from node */
                    let nodeId:string = node.uid + _UID_ROWID_SUFFIX;
                    // console.log("looking up using element id: "+nodeId);

                    return util.domElm(nodeId);
                }
            }

            return null;
        }

        /*
         * turn of row selection DOM element of whatever row is currently selected
         */
        export let getSelectedPolyElement = function() : any{
            try {
                var currentSelNode = meta64.getHighlightedNode();
                if (currentSelNode) {

                    /* get node by node identifier */
                    let node: json.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                    if (node) {
                        console.log("found highlighted node.id=" + node.id);

                        /* now make CSS id from node */
                        let nodeId:string = node.uid + _UID_ROWID_SUFFIX;
                        console.log("looking up using element id: " + nodeId);

                        return util.polyElm(nodeId);
                    }
                } else {
                    console.log("no node highlighted");
                }
            } catch (e) {
                console.log("getSelectedPolyElement failed.");
            }
            return null;
        }

        export let clickOnNodeRow = function(rowElm, uid) : void {

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                return;
            }

            /*
             * sets which node is selected on this page (i.e. parent node of this page being the 'key')
             */
            meta64.highlightNode(node, false);

            if (meta64.editMode) {

                /*
                 * if node.owner is currently null, that means we have not retrieved the owner from the server yet, but
                 * if non-null it's already displaying and we do nothing.
                 */
                if (!node.owner) {
                    console.log("calling updateNodeInfo");
                    meta64.updateNodeInfo(node);
                }
            }
            meta64.refreshAllGuiEnablement();
        }

        export let openNode = function(uid) : void {

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            meta64.highlightNode(node, true);

            if (!node) {
                (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
            } else {
                view.refreshTree(node.id, false);
            }
        }

        /*
         * unfortunately we have to rely on onClick, because of the fact that events to checkboxes don't appear to work
         * in Polmer at all, and since onClick runs BEFORE the state change is completed, that is the reason for the
         * silly looking async timer here.
         */
        export let toggleNodeSel = function(uid) : void{
            let toggleButton:any = util.polyElm(uid + "_sel");
            setTimeout(function() {
                if (toggleButton.node.checked) {
                    meta64.selectedNodes[uid] = true;
                } else {
                    delete meta64.selectedNodes[uid];
                }

                view.updateStatusBar();
                meta64.refreshAllGuiEnablement();
            }, 500);
        }

        export let navHomeResponse = function(res: json.RenderNodeResponse) : void{
            meta64.clearSelectedNodes();
            render.renderPageFromData(res);
            view.scrollToTop();
            meta64.refreshAllGuiEnablement();
        }

        export let navHome = function() :void {
            if (meta64.isAnonUser) {
                meta64.loadAnonPageHome(true);
                // window.location.href = window.location.origin;
            } else {
                util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                    "nodeId": meta64.homeNodeId,
                    "upLevel": null,
                    "renderParentIfLeaf": null
                }, navHomeResponse);
            }
        }

        export let navPublicHome = function() : void {
            meta64.loadAnonPageHome(true);
        }
    }
}
