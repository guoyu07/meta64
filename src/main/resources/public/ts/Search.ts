console.log("Search.ts");

import { cnst, jcrCnst } from "./Constants";
import { meta64 } from "./Meta64";
import { util } from "./Util";
import { render } from "./Render";
import * as I from "./Interfaces";
import { MessageDlg } from "./MessageDlg";
import { view } from "./View";
import { nav } from "./Nav";
import { Factory } from "./Factory";
import { SearchContentDlg } from "./SearchContentDlg";
import { TimelineResultsPanel } from "./TimelineResultsPanel";
import { SearchResultsPanel } from "./SearchResultsPanel";
import { tag } from "./Tag";

export class Search {
    _UID_ROWID_PREFIX: string = "srch_row_";

    searchNodes: any = null;
    searchPageTitle: string = "Search Results";
    timelinePageTitle: string = "Timeline";

    searchOffset = 0;
    timelineOffset = 0;

    /*
     * Holds the NodeSearchResponse.java JSON, or null if no search has been done.
     */
    searchResults: any = null;

    /*
     * Holds the NodeSearchResponse.java JSON, or null if no timeline has been done.
     */
    timelineResults: any = null;

    /*
     * Will be the last row clicked on (NodeInfo.java object) and having the red highlight bar
     */
    highlightRowNode: I.NodeInfo = null;

    /*
     * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
     * nextUid as the counter.
     */
    identToUidMap: any = {};

    /*
     * maps node.uid values to the NodeInfo.java objects
     *
     * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
     * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
     * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
     */
    uidToNodeMap: { [key: string]: I.NodeInfo } = {};

    numSearchResults() {
        return srch.searchResults != null && //
            srch.searchResults.searchResults != null && //
            srch.searchResults.searchResults.length != null ? //
            srch.searchResults.searchResults.length : 0;
    }

    searchTabActivated() {
    }

    searchNodesResponse(res: I.NodeSearchResponse) {
        srch.searchResults = res;

        if (this.numSearchResults() == 0) {
            Factory.createDefault("MessageDlgImpl",(dlg: MessageDlg) => {
                dlg.open();
            }, { "message": "No search results found." });
            return;
        }

        Factory.create("SearchResultsPanel", (panel: SearchResultsPanel) => {
            let content = panel.render();
            util.setHtml("searchResultsPanel", content);
            panel.init();
            meta64.changePage(panel);
        });
    }

    timelineResponse(res: I.NodeSearchResponse) {
        srch.timelineResults = res;
        Factory.create("TimelineResultsPanel", (panel: TimelineResultsPanel) => {
            let content = panel.render();
            util.setHtml("timelineResultsPanel", content);
            panel.init();
            meta64.changePage(panel);
        });
    }

    searchFilesResponse(res: I.FileSearchResponse) {
        nav.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": res.searchResultNodeId,
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": 0,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    timelineByModTime() {
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to 'timeline' under.");
            return;
        }

        util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": "",
            "sortDir": "DESC",
            //todo-0: need something other than hardcoding 'mtm' here
            "sortField": "mtm",
            "searchProp": null
        }, srch.timelineResponse);
    }

    timelineByCreateTime() {
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to 'timeline' under.");
            return;
        }

        util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": "",
            //todo-0: need something other than hardcoding 'ctm' here
            "sortDir": "DESC",
            "sortField" : "ctm",
            "searchProp": null
        }, srch.timelineResponse);
    }

    initSearchNode(node: I.NodeInfo) {
        node.uid = util.getUidForId(srch.identToUidMap, node.id);
        srch.uidToNodeMap[node.uid] = node;
    }

    populateSearchResultsPage(data, viewName) {
        let output = '';
        let childCount = data.searchResults.length;

        /*
         * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on the
         * client side for various reasons.
         */
        let rowCount = 0;

        util.forEachArrElm(data.searchResults, (node, i) => {
            if (meta64.isNodeBlackListed(node))
                return;

            srch.initSearchNode(node);

            rowCount++;
            output += srch.renderSearchResultAsListItem(node, i, childCount, rowCount);
        });

        util.setHtml(viewName, output);
    }

    /*
     * Renders a single line of search results on the search results page.
     *
     * node is a NodeInfo.java JSON
     */
    renderSearchResultAsListItem(node, index, count, rowCount) {
        let uid = node.uid;
        console.log("renderSearchResult: " + uid);

        let cssId = srch._UID_ROWID_PREFIX + uid;
        // console.log("Rendering Node Row[" + index + "] with id: " +cssId)

        let buttonBarHtml = srch.makeButtonBarHtml("" + uid);

        console.log("buttonBarHtml=" + buttonBarHtml);
        let content = render.renderNodeContent(node, true, true, true, true, true);
        let thiz = this;
        return tag.div({
            "class": "node-table-row inactive-row",
            "onclick": () => {
                meta64.clickOnSearchResultRow(this, uid);
            }, //
            "id": cssId
        },//
            buttonBarHtml//
            + tag.div({
                "id": "srch_content_" + uid
            }, content));
    }

    makeButtonBarHtml(uid: string) {
        let gotoButton = render.makeButton("Go to Node", "go-to-" + uid, () => {
            meta64.clickSearchNode(uid);
        });
        return render.makeHorizontalFieldSet(gotoButton);
    }

    clickOnSearchResultRow(rowElm: HTMLElement, uid) {
        srch.unhighlightRow();
        srch.highlightRowNode = srch.uidToNodeMap[uid];

        util.changeOrAddClassToElm(rowElm, "inactive-row", "active-row");
    }

    clickSearchNode(uid: string) {
        /*
         * update highlight node to point to the node clicked on, just to persist it for later
         */
        srch.highlightRowNode = srch.uidToNodeMap[uid];
        if (!srch.highlightRowNode) {
            throw "Unable to find uid in search results: " + uid;
        }

        view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
        meta64.selectTab("mainTabName");
    }

    /*
     * turn of row selection styling of whatever row is currently selected
     */
    unhighlightRow() {

        if (!srch.highlightRowNode) {
            return;
        }

        /* now make CSS id from node */
        let nodeId = srch._UID_ROWID_PREFIX + srch.highlightRowNode.uid;

        let elm: HTMLElement = util.domElm(nodeId);
        if (elm) {
            /* change class on element */
            util.changeOrAddClassToElm(elm, "active-row", "inactive-row");
        }
    }
}
export let srch: Search = new Search();
export default srch;
