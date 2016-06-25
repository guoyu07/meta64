console.log("running module: search.js");
var srch = function () {
    var _UID_ROWID_SUFFIX = "_srch_row";
    var _ = {
        searchNodes: null,
        searchPageTitle: "Search Results",
        timelinePageTitle: "Timeline",
        searchResults: null,
        timelineResults: null,
        highlightRowNode: null,
        identToUidMap: {},
        uidToNodeMap: {},
        numSearchResults: function () {
            return srch.searchResults != null &&
                srch.searchResults.searchResults != null &&
                srch.searchResults.searchResults.length != null ?
                srch.searchResults.searchResults.length : 0;
        },
        searchTabActivated: function () {
            if (_.numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchDlg()).open();
            }
        },
        searchNodesResponse: function (res) {
            _.searchResults = res;
            var content = searchResultsPanel.build();
            util.setHtmlEnhanced("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        },
        timelineResponse: function (res) {
            _.timelineResults = res;
            var content = timelineResultsPanel.build();
            util.setHtmlEnhanced("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        },
        timeline: function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "modSortDesc": true,
                "searchProp": "jcr:content"
            }, _.timelineResponse);
        },
        initSearchNode: function (node) {
            node.uid = util.getUidForId(_.identToUidMap, node.id);
            _.uidToNodeMap[node.uid] = node;
        },
        populateSearchResultsPage: function (data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;
            var rowCount = 0;
            $.each(data.searchResults, function (i, node) {
                if (meta64.isNodeBlackListed(node))
                    return;
                _.initSearchNode(node);
                rowCount++;
                output += _.renderSearchResultAsListItem(node, i, childCount, rowCount);
            });
            util.setHtmlEnhanced(viewName, output);
        },
        renderSearchResultAsListItem: function (node, index, count, rowCount) {
            var uid = node.uid;
            console.log("renderSearchResult: " + uid);
            var cssId = uid + _UID_ROWID_SUFFIX;
            var buttonBarHtml = "";
            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = render.renderNodeContent(node, true, true, true, true, true);
            return render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": "srch.clickOnSearchResultRow(this, '" + uid + "');",
                "id": cssId
            }, buttonBarHtml
                + render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        },
        makeBttonBarHtml: function (uid) {
            var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
            return render.makeHorizontalFieldSet(gotoButton);
        },
        clickOnSeachResultRow: function (rowElm, uid) {
            _.unhighlightRow();
            _.highlightRowNode = _.uidToNodeMap[uid];
            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        },
        clickSearchNode: function (uid) {
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            view.refreshTree(srch.highlightRowNode.id, true);
            meta64.selectTab("mainTabName");
        },
        unhighlightRow: function () {
            if (!_.highlightRowNode) {
                return;
            }
            var nodeId = _.highlightRowNode.uid + _UID_ROWID_SUFFIX;
            var elm = util.domElm(nodeId);
            if (elm) {
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        }
    };
    console.log("Module ready: search.js");
    return _;
}();
//# sourceMappingURL=search.js.map