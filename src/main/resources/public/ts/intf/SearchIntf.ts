console.log("SearchIntf.ts");

import * as I from "../Interfaces";

export interface SearchIntf {

    /* Note this: is not a singleton so we can postConstruct during actual constructor */
    postConstruct(_f: any);

    _UID_ROWID_PREFIX: string;

    searchNodes: any;
    searchPageTitle: string;
    timelinePageTitle: string;

    searchOffset: number;
    timelineOffset: number;

    /*
     * Holds the NodeSearchResponse.java JSON, or null if no search has been done.
     */
    searchResults: any;

    /*
     * Holds the NodeSearchResponse.java JSON, or null if no timeline has been done.
     */
    timelineResults: any;

    /*
     * Will be the last row clicked on (NodeInfo.java object) and having the red highlight bar
     */
    highlightRowNode: I.NodeInfo;

    /*
     * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
     * nextUid as the counter.
     */
    identToUidMap: any;

    /*
     * maps node.uid values to the NodeInfo.java objects
     *
     * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
     * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
     * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
     */
    uidToNodeMap: { [key: string]: I.NodeInfo };

    numSearchResults();

    searchTabActivated();
    searchNodesResponse(res: I.NodeSearchResponse);

    timelineResponse(res: I.NodeSearchResponse);

    searchFilesResponse(res: I.FileSearchResponse);
    timelineByModTime();

    timelineByCreateTime();
    initSearchNode(node: I.NodeInfo);

    populateSearchResultsPage(data, viewName);

    /*
     * Renders a single line of search results on the search results page.
     *
     * node is a NodeInfo.java JSON
     */
    renderSearchResultAsListItem(node, index, count, rowCount);

    makeButtonBarHtml(uid: string);

    clickOnSearchResultRow(rowElm: HTMLElement, uid);

    clickSearchNode(uid: string);
    /*
     * turn of row selection styling of whatever row is currently selected
     */
    unhighlightRow();
}
