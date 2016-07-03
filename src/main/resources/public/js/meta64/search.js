console.log("running module: search.js");
var Srch = (function () {
    function Srch() {
        this._UID_ROWID_SUFFIX = "_srch_row";
        this.searchNodes = null;
        this.searchPageTitle = "Search Results";
        this.timelinePageTitle = "Timeline";
        this.searchResults = null;
        this.timelineResults = null;
        this.highlightRowNode = null;
        this.identToUidMap = {};
        this.uidToNodeMap = {};
    }
    Srch.prototype.numSearchResults = function () {
        return srch.searchResults != null &&
            srch.searchResults.searchResults != null &&
            srch.searchResults.searchResults.length != null ?
            srch.searchResults.searchResults.length : 0;
    };
    Srch.prototype.searchTabActivated = function () {
        if (this.numSearchResults() == 0 && !meta64.isAnonUser) {
            (new SearchDlg()).open();
        }
    };
    Srch.prototype.searchNodesResponse = function (res) {
        this.searchResults = res;
        var content = searchResultsPanel.build();
        util.setHtmlEnhanced("searchResultsPanel", content);
        searchResultsPanel.init();
        meta64.changePage(searchResultsPanel);
    };
    Srch.prototype.timelineResponse = function (res) {
        this.timelineResults = res;
        var content = timelineResultsPanel.build();
        util.setHtmlEnhanced("timelineResultsPanel", content);
        timelineResultsPanel.init();
        meta64.changePage(timelineResultsPanel);
    };
    Srch.prototype.timeline = function () {
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
        }, this.timelineResponse);
    };
    Srch.prototype.initSearchNode = function (node) {
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        this.uidToNodeMap[node.uid] = node;
    };
    Srch.prototype.populateSearchResultsPage = function (data, viewName) {
        var output = '';
        var childCount = data.searchResults.length;
        var rowCount = 0;
        var thiz = this;
        $.each(data.searchResults, function (i, node) {
            if (meta64.isNodeBlackListed(node))
                return;
            thiz.initSearchNode(node);
            rowCount++;
            output += thiz.renderSearchResultAsListItem(node, i, childCount, rowCount);
        });
        util.setHtmlEnhanced(viewName, output);
    };
    Srch.prototype.renderSearchResultAsListItem = function (node, index, count, rowCount) {
        var uid = node.uid;
        console.log("renderSearchResult: " + uid);
        var cssId = uid + this._UID_ROWID_SUFFIX;
        var buttonBarHtml = this.makeButtonBarHtml("" + uid);
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
    };
    Srch.prototype.makeButtonBarHtml = function (uid) {
        var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
        return render.makeHorizontalFieldSet(gotoButton);
    };
    Srch.prototype.clickOnSearchResultRow = function (rowElm, uid) {
        this.unhighlightRow();
        this.highlightRowNode = this.uidToNodeMap[uid];
        util.changeOrAddClass(rowElm, "inactive-row", "active-row");
    };
    Srch.prototype.clickSearchNode = function (uid) {
        srch.highlightRowNode = srch.uidToNodeMap[uid];
        view.refreshTree(srch.highlightRowNode.id, true);
        meta64.selectTab("mainTabName");
    };
    Srch.prototype.unhighlightRow = function () {
        if (!this.highlightRowNode) {
            return;
        }
        var nodeId = this.highlightRowNode.uid + this._UID_ROWID_SUFFIX;
        var elm = util.domElm(nodeId);
        if (elm) {
            util.changeOrAddClass(elm, "active-row", "inactive-row");
        }
    };
    return Srch;
}());
if (!window["srch"]) {
    var srch = new Srch();
}
//# sourceMappingURL=search.js.map