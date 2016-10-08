console.log("running module: search.js");

/*
 * todo-3: try to rename to 'search', but remember you had inexpliable problems the first time you tried to use 'search'
 * as the var name.
 */
namespace m64 {
    export namespace srch {
        export let _UID_ROWID_SUFFIX: string = "_srch_row";

        export let searchNodes: any = null;
        export let searchPageTitle: string = "Search Results";
        export let timelinePageTitle: string = "Timeline";

        /*
         * Holds the NodeSearchResponse.java JSON, or null if no search has been done.
         */
        export let searchResults: any = null;

        /*
         * Holds the NodeSearchResponse.java JSON, or null if no timeline has been done.
         */
        export let timelineResults: any = null;

        /*
         * Will be the last row clicked on (NodeInfo.java object) and having the red highlight bar
         */
        export let highlightRowNode: json.NodeInfo = null;

        /*
         * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
         * nextUid as the counter.
         */
        export let identToUidMap: any = {};

        /*
         * maps node.uid values to the NodeInfo.java objects
         *
         * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
         * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
         * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
         */
        export let uidToNodeMap: { [key: string]: json.NodeInfo } = {};

        export let numSearchResults = function() {
            return srch.searchResults != null && //
                srch.searchResults.searchResults != null && //
                srch.searchResults.searchResults.length != null ? //
                srch.searchResults.searchResults.length : 0;
        }

        export let searchTabActivated = function() {
            /*
             * If a logged in user clicks the search tab, and no search results are currently displaying, then go ahead
             * and open up the search dialog.
             */
            if (numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchContentDlg()).open();
            }
        }

        export let searchNodesResponse = function(res: json.NodeSearchResponse) {
            searchResults = res;
            let searchResultsPanel = new SearchResultsPanel();
            var content = searchResultsPanel.build();
            util.setHtml("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        }

        export let timelineResponse = function(res: json.NodeSearchResponse) {
            timelineResults = res;
            let timelineResultsPanel = new TimelineResultsPanel();
            var content = timelineResultsPanel.build();
            util.setHtml("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        }

        export let searchFilesResponse = function(res: json.FileSearchResponse) {
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": res.searchResultNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null
            }, nav.navPageNodeResponse);
        }

        export let timelineByModTime = function() {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.LAST_MODIFIED,
                "searchProp": jcrCnst.CONTENT
            }, timelineResponse);
        }

        export let timelineByCreateTime = function() {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.CREATED,
                "searchProp": jcrCnst.CONTENT
            }, timelineResponse);
        }

        export let initSearchNode = function(node: json.NodeInfo) {
            node.uid = util.getUidForId(identToUidMap, node.id);
            uidToNodeMap[node.uid] = node;
        }

        export let populateSearchResultsPage = function(data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;

            /*
             * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on the
             * client side for various reasons.
             */
            var rowCount = 0;

            $.each(data.searchResults, function(i, node) {
                if (meta64.isNodeBlackListed(node))
                    return;

                initSearchNode(node);

                rowCount++;
                output += renderSearchResultAsListItem(node, i, childCount, rowCount);
            });

            util.setHtml(viewName, output);
        }

        /*
         * Renders a single line of search results on the search results page.
         *
         * node is a NodeInfo.java JSON
         */
        export let renderSearchResultAsListItem = function(node, index, count, rowCount) {

            var uid = node.uid;
            console.log("renderSearchResult: " + uid);

            var cssId = uid + _UID_ROWID_SUFFIX;
            // console.log("Rendering Node Row[" + index + "] with id: " +cssId)

            var buttonBarHtml = makeButtonBarHtml("" + uid);

            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = render.renderNodeContent(node, true, true, true, true, true);

            return render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": "m64.srch.clickOnSearchResultRow(this, '" + uid + "');", //
                "id": cssId
            },//
                buttonBarHtml//
                + render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        }

        export let makeButtonBarHtml = function(uid) {
            var gotoButton = render.makeButton("Go to Node", uid, "m64.srch.clickSearchNode('" + uid + "');");
            return render.makeHorizontalFieldSet(gotoButton);
        }

        export let clickOnSearchResultRow = function(rowElm, uid) {
            unhighlightRow();
            highlightRowNode = uidToNodeMap[uid];

            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        }

        export let clickSearchNode = function(uid: string) {
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
        export let unhighlightRow = function() {

            if (!highlightRowNode) {
                return;
            }

            /* now make CSS id from node */
            var nodeId = highlightRowNode.uid + _UID_ROWID_SUFFIX;

            var elm = util.domElm(nodeId);
            if (elm) {
                /* change class on element */
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        }
    }
}
