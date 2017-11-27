console.log("SearchIntf.ts");

import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface SearchIntf {
    _UID_ROWID_PREFIX: string;

    searchNodes: any;
    searchPageTitle: string;
    timelinePageTitle: string;

    searchOffset: number;
    timelineOffset: number;

    searchResults: any;
    timelineResults: any;
    highlightRowNode: I.NodeInfo;
    identToUidMap: any;

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
    renderSearchResultAsListItem(node, index, count, rowCount);
    makeButtonBarHtml(uid: string);
    clickOnSearchResultRow(rowElm: HTMLElement, uid);
    clickSearchNode(uid: string);
    unhighlightRow();
}
