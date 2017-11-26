console.log("Meta64Intf.ts");

import * as I from "../Interfaces";

export interface Meta64Intf {

    menuPanel: any; //todo-0: bring back type -> MenuPanel;
    state: any; //todo-0: create an interface for State properties
    appInitialized: boolean;

    curUrlPath: string;
    urlCmd: string;
    homeNodeOverride: string;

    codeFormatDirty: boolean;

    nextGuid: number;

    userName: string;

    deviceWidth: number;
    deviceHeight: number;

    homeNodeId: string;
    homeNodePath: string;

    isAdminUser: boolean;

    isAnonUser: boolean;
    anonUserLandingPageNode: any;
    allowFileSystemSearch: boolean;

    treeDirty: boolean;

    uidToNodeMap: { [key: string]: I.NodeInfo };

    uidToNodeDataMap: { [key: string]: Object };

    idToNodeMap: { [key: string]: I.NodeInfo };

    aceEditorsById: any;

    nextUid: number;
    identToUidMap: { [key: string]: string };
    parentUidToFocusNodeMap: { [key: string]: I.NodeInfo };
    MODE_ADVANCED: string;
    MODE_SIMPLE: string;
    editModeOption: string;
    showProperties: boolean;
    showMetaData: boolean;

    simpleModeNodePrefixBlackList: any;

    simpleModePropertyBlackList: any;

    readOnlyPropertyList: any;

    binaryPropertyList: any;
    selectedNodes: any;

    expandedAbbrevNodeIds: any;

    currentNodeData: I.RenderNodeResponse;

    renderFunctionsByJcrType: { [key: string]: Function };
    propOrderingFunctionsByJcrType: { [key: string]: Function };

    userPreferences: I.UserPreferences;

    postConstruct(_f: any);
    setNodeData(uid: string, data: Object);
    getNodeData(uid: string, prop: string): any;
    updateMainMenuPanel();
    inSimpleMode(): boolean;
    refresh(): void;
    rebuildIndexes(): void;
    goToMainPage(rerender?: boolean, forceServerRefresh?: boolean): void;
    selectTab(pageName): void;
    changePage(pg?: any, data?: any);
    isNodeBlackListed(node): boolean;
    getSelectedNodeUidsArray(): string[];
    getSelectedNodeIdsArray(): string[];
    getSelectedNodesAsMapById(): Object;
    getSelectedNodesArray(): I.NodeInfo[];
    clearSelectedNodes();
    updateNodeInfoResponse(res, node);
    updateNodeInfo(node: I.NodeInfo);
    getNodeFromId(id: string): I.NodeInfo;
    getPathOfUid(uid: string): string;
    getHighlightedNode(): I.NodeInfo;
    highlightRowById(id, scroll): void;
    highlightNode(node: I.NodeInfo, scroll: boolean): void;
    updateState();
    refreshAllGuiEnablement();
    getSingleSelectedNode(): I.NodeInfo;
    getOrdinalOfNode(node: I.NodeInfo): number;
    getNumChildNodes(): number;
    setCurrentNodeData(data: I.RenderNodeResponse): void;
    anonPageLoadResponse(res: I.AnonPageLoadResponse): void;
    removeBinaryByUid(uid): void;
    initNode(node: I.NodeInfo, updateMaps?: boolean): void;
    initConstants();
    initApp(): void;
    addTypeHandlers(typeName: string, renderFunction: Function, orderingFunction: Function): void;
    initStaticHtmlOnClicks(): void;
    processUrlParams(): void;
    tabChangeEvent(tabName): void
    displaySignupMessage(): void
    screenSizeChange(): void
    loadAnonPageHome(ignoreUrl): void;
    saveUserPreferences(): void;
    openSystemFile(fileName: string);
    clickOnNodeRow(uid): void;
    replyToComment(uid: any): void;
    openNode(uid): void;
    createSubNode(uid?: any, typeName?: string, createAtTop?: boolean): void;
    insertNode(uid?: any, typeName?: string): void;
    runEditNode(uid: any): void;
    moveNodeUp(uid?: string): void;
    moveNodeDown(uid?: string): void;
    clickOnSearchResultRow(rowElm, uid);
    clickSearchNode(uid: string);
    onSignIn(googleUser);
}

