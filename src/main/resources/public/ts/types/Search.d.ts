import * as I from "./Interfaces";
export declare class Search {
    postConstruct(_f: any): void;
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
    uidToNodeMap: {
        [key: string]: I.NodeInfo;
    };
    numSearchResults: () => any;
    searchTabActivated: () => void;
    searchNodesResponse: (res: I.NodeSearchResponse) => void;
    timelineResponse: (res: I.NodeSearchResponse) => void;
    searchFilesResponse: (res: I.FileSearchResponse) => void;
    timelineByModTime: () => void;
    timelineByCreateTime: () => void;
    initSearchNode: (node: I.NodeInfo) => void;
    populateSearchResultsPage: (data: any, viewName: any) => void;
    renderSearchResultAsListItem: (node: any, index: any, count: any, rowCount: any) => string;
    makeButtonBarHtml: (uid: string) => string;
    clickOnSearchResultRow: (rowElm: HTMLElement, uid: any) => void;
    clickSearchNode: (uid: string) => void;
    unhighlightRow: () => void;
}
