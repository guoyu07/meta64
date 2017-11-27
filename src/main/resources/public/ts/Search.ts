console.log("Search.ts");

import * as I from "./Interfaces";
import { MessageDlg } from "./dlg/MessageDlg";
import { SearchContentDlg } from "./dlg/SearchContentDlg";
import { TimelineResultsPanel } from "./TimelineResultsPanel";
import { SearchResultsPanel } from "./SearchResultsPanel";
import { Constants as cnst } from "./Constants";

import { Factory } from "./Factory";

import { Meta64Intf as Meta64 } from "./intf/Meta64Intf";
import { UtilIntf as Util } from "./intf/UtilIntf";
import { RenderIntf as Render } from "./intf/RenderIntf";
import { ViewIntf as View } from "./intf/ViewIntf";
import { NavIntf as Nav } from "./intf/NavIntf";
import { TagIntf as Tag } from "./intf/TagIntf";
import { SearchIntf } from "./intf/SearchIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";


let meta64: Meta64;
let util: Util;
let nav: Nav;
let render: Render;
let view: View;
let tag: Tag;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    util = s.util;
    meta64 = s.meta64;
    nav = s.nav;
    render = s.render;
    view = s.view;
    tag = s.tag;
});

export class Search implements SearchIntf {

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

    numSearchResults = () => {
        return this.searchResults != null && //
            this.searchResults.searchResults != null && //
            this.searchResults.searchResults.length != null ? //
            this.searchResults.searchResults.length : 0;
    }

    searchTabActivated = () => {
    }

    searchNodesResponse = (res: I.NodeSearchResponse) => {
        this.searchResults = res;

        if (this.numSearchResults() == 0) {
            new MessageDlg({ "message": "No search results found." }).open();
            return;
        }

        let panel = new SearchResultsPanel(null);
        let content = panel.renderHtml();
        util.setHtml("searchResultsPanel", content);
        panel.init();
        meta64.changePage(panel);
    }

    timelineResponse = (res: I.NodeSearchResponse) => {
        this.timelineResults = res;
        let panel = new TimelineResultsPanel(null);
        let content = panel.renderHtml();
        util.setHtml("timelineResultsPanel", content);
        panel.init();
        meta64.changePage(panel);

    }

    searchFilesResponse = (res: I.FileSearchResponse) => {
        nav.mainOffset = 0;
        util.ajax<I.RenderNodeRequest, I.RenderNodeResponse>("renderNode", {
            "nodeId": res.searchResultNodeId,
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": 0,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    }

    timelineByModTime = () => {
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to 'timeline' under.");
            return;
        }

        util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": "",
            "sortDir": "DESC",
            //todo-1: need something other than hardcoding 'mtm' here
            "sortField": "mtm",
            "searchProp": null
        }, this.timelineResponse);
    }

    timelineByCreateTime = () => {
        let node = meta64.getHighlightedNode();
        if (!node) {
            util.showMessage("No node is selected to 'timeline' under.");
            return;
        }

        util.ajax<I.NodeSearchRequest, I.NodeSearchResponse>("nodeSearch", {
            "nodeId": node.id,
            "searchText": "",
            //todo-1: need something other than hardcoding 'ctm' here
            "sortDir": "DESC",
            "sortField": "ctm",
            "searchProp": null
        }, this.timelineResponse);
    }

    initSearchNode = (node: I.NodeInfo) => {
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        this.uidToNodeMap[node.uid] = node;
    }

    populateSearchResultsPage = (data, viewName) => {
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

            this.initSearchNode(node);

            rowCount++;
            output += this.renderSearchResultAsListItem(node, i, childCount, rowCount);
        });

        util.setHtml(viewName, output);
    }

    /*
     * Renders a single line of search results on the search results page.
     *
     * node is a NodeInfo.java JSON
     */
    renderSearchResultAsListItem = (node, index, count, rowCount) => {
        let uid = node.uid;
        console.log("renderSearchResult: " + uid);

        let cssId = this._UID_ROWID_PREFIX + uid;
        // console.log("Rendering Node Row[" + index + "] with id: " +cssId)

        let buttonBarHtml = this.makeButtonBarHtml("" + uid);

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

    makeButtonBarHtml = (uid: string) => {
        let gotoButton = render.makeButton("Go to Node", "go-to-" + uid, () => {
            meta64.clickSearchNode(uid);
        });
        return render.makeHorizontalFieldSet(gotoButton);
    }

    clickOnSearchResultRow = (rowElm: HTMLElement, uid) => {
        this.unhighlightRow();
        this.highlightRowNode = this.uidToNodeMap[uid];

        util.changeOrAddClassToElm(rowElm, "inactive-row", "active-row");
    }

    clickSearchNode = (uid: string) => {
        /*
         * update highlight node to point to the node clicked on, just to persist it for later
         */
        this.highlightRowNode = this.uidToNodeMap[uid];
        if (!this.highlightRowNode) {
            throw "Unable to find uid in search results: " + uid;
        }

        view.refreshTree(this.highlightRowNode.id, true, this.highlightRowNode.id);
        meta64.selectTab("mainTabName");
    }

    /*
     * turn of row selection styling of whatever row is currently selected
     */
    unhighlightRow = () => {

        if (!this.highlightRowNode) {
            return;
        }

        /* now make CSS id from node */
        let nodeId = this._UID_ROWID_PREFIX + this.highlightRowNode.uid;

        let elm: HTMLElement = util.domElm(nodeId);
        if (elm) {
            /* change class on element */
            util.changeOrAddClassToElm(elm, "active-row", "inactive-row");
        }
    }
}
