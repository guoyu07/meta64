
console.log("running module: search.js");

/*
 * todo-3: try to rename to 'search', but remember you had inexpliable problems the first time you tried to use 'search'
 * as the var name.
 */
var srch = function() {

    var _UID_ROWID_SUFFIX = "_srch_row";

    var _ = {

        searchNodes: null,
        searchPageTitle: "Search Results",
        timelinePageTitle: "Timeline",

		/*
		 * Holds the NodeSearchResponse.java JSON, or null if no search has been done.
		 */
        searchResults: null,

		/*
		 * Holds the NodeSearchResponse.java JSON, or null if no timeline has been done.
		 */
        timelineResults: null,

		/*
		 * Will be the last row clicked on (NodeInfo.java object) and having the red highlight bar
		 */
        highlightRowNode: null,

		/*
		 * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
		 * nextUid as the counter.
		 */
        identToUidMap: {},

		/*
		 * maps node.uid values to the NodeInfo.java objects
		 *
		 * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
		 * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
		 * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
		 */
        uidToNodeMap: {},

        numSearchResults: function() {
            return srch.searchResults != null && //
                srch.searchResults.searchResults != null && //
                srch.searchResults.searchResults.length != null ? //
                srch.searchResults.searchResults.length : 0;
        },

        searchTabActivated: function() {
			/*
			 * If a logged in user clicks the search tab, and no search results are currently displaying, then go ahead
			 * and open up the search dialog.
			 */
            if (_.numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchDlg()).open();
            }
        },

        searchNodesResponse: function(res) {
            _.searchResults = res;
            var content = searchResultsPanel.build();
            util.setHtmlEnhanced("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        },

        timelineResponse: function(res) {
            _.timelineResults = res;
            var content = timelineResultsPanel.build();
            util.setHtmlEnhanced("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        },

        timeline: function() {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }

            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "modSortDesc": true,
                "searchProp": "jcr:content" // should have no effect, for
                // timeline?
            }, _.timelineResponse);
        },

        initSearchNode: function(node) {
            node.uid = util.getUidForId(_.identToUidMap, node.id);
            _.uidToNodeMap[node.uid] = node;
        },

        populateSearchResultsPage: function(data, viewName) {
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

                _.initSearchNode(node);

                rowCount++;
                output += _.renderSearchResultAsListItem(node, i, childCount, rowCount);
            });

            util.setHtmlEnhanced(viewName, output);
        },

		/*
		 * Renders a single line of search results on the search results page.
		 *
		 * node is a NodeInfo.java JSON
		 */
        renderSearchResultAsListItem: function(node, index, count, rowCount) {

            var uid = node.uid;
            console.log("renderSearchResult: " + uid);

            var cssId = uid + _UID_ROWID_SUFFIX;
            // console.log("Rendering Node Row[" + index + "] with id: " +cssId)

            //deleting this line because _makeButtonBarHtml is gone... ??? todo-0
            var buttonBarHtml = _.makeButtonBarHtml("" + uid);

            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = render.renderNodeContent(node, true, true, true, true, true);

            return render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": "srch.clickOnSearchResultRow(this, '" + uid + "');", //
                "id": cssId
            },//
                buttonBarHtml//
                + render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        },

        makeButtonBarHtml: function(uid) {
            var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
            return render.makeHorizontalFieldSet(gotoButton);
        },

        clickOnSearchResultRow: function(rowElm, uid) {

            _.unhighlightRow();
            _.highlightRowNode = _.uidToNodeMap[uid];

            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        },

        clickSearchNode: function(uid) {
			/*
			 * update highlight node to point to the node clicked on, just to persist it for later
			 */
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            view.refreshTree(srch.highlightRowNode.id, true);
            meta64.selectTab("mainTabName");
        },

		/*
		 * turn of row selection styling of whatever row is currently selected
		 */
        unhighlightRow: function() {

            if (!_.highlightRowNode) {
                return;
            }

            /* now make CSS id from node */
            var nodeId = _.highlightRowNode.uid + _UID_ROWID_SUFFIX;

            var elm = util.domElm(nodeId);
            if (elm) {
                /* change class on element */
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        }
    };

    console.log("Module ready: search.js");
    return _;
} ();

//# sourceURL=search.js
