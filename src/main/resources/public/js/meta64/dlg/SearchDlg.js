var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
console.log("running module: SearchDlg.js");
var SearchDlg = (function (_super) {
    __extends(SearchDlg, _super);
    function SearchDlg() {
        _super.call(this, "SearchDlg");
    }
    SearchDlg.prototype.build = function () {
        var header = this.makeHeader("Search");
        var instructions = this.makeMessageArea("Enter some text to find. All sub-nodes under the selected node are included in the search.");
        var formControls = this.makeEditField("Search", "searchText");
        var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes, this);
        var searchTagsButton = this.makeCloseButton("Search Tags", "searchTagsButton", this.searchTags, this);
        var backButton = this.makeCloseButton("Close", "cancelSearchButton");
        var buttonBar = render.centeredButtonBar(searchButton + searchTagsButton + backButton);
        var content = header + instructions + formControls + buttonBar;
        this.bindEnterKey("searchText", srch.searchNodes);
        return content;
    };
    SearchDlg.prototype.searchNodes = function () {
        return this.searchProperty("jcr:content");
    };
    SearchDlg.prototype.searchTags = function () {
        return this.searchProperty(jcrCnst.TAGS);
    };
    SearchDlg.prototype.searchProperty = function (searchProp) {
        if (!util.ajaxReady("searchNodes")) {
            return;
        }
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("No node is selected to search under.")).open();
            return;
        }
        var searchText = this.getInputVal("searchText");
        if (util.emptyString(searchText)) {
            (new MessageDlg("Enter search text.")).open();
            return;
        }
        util.json("nodeSearch", {
            "nodeId": node.id,
            "searchText": searchText,
            "modSortDesc": false,
            "searchProp": searchProp
        }, srch.searchNodesResponse);
    };
    SearchDlg.prototype.init = function () {
        util.delayedFocus(this.id("searchText"));
    };
    return SearchDlg;
}(DialogBase));
//# sourceMappingURL=SearchDlg.js.map