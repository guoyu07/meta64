console.log("Meta64Intf.ts");

import * as I from "../Interfaces";

export interface Meta64Intf {

    menuPanel: any; //todo-0: bring back type -> MenuPanel;

    /* This is the state that all enablement and visibility must reference to determine how to enable gui */
    state: any; //todo-0: create an interface for State properties

    appInitialized: boolean;

    curUrlPath: string;
    urlCmd: string;
    homeNodeOverride: string;

    codeFormatDirty: boolean;

    /* used as a kind of 'sequence' in the app, when unique vals a needed */
    nextGuid: number;

    /* name of currently logged in user */
    userName: string;

    /* screen capabilities */
    deviceWidth: number;
    deviceHeight: number;

    /*
     * User's root node. Top level of what logged in user is allowed to see.
     */
    homeNodeId: string;
    homeNodePath: string;

    /*
     * specifies if this is admin user.
     */
    isAdminUser: boolean;

    /* always start out as anon user until login */
    isAnonUser: boolean;
    anonUserLandingPageNode: any;
    allowFileSystemSearch: boolean;

    /*
     * signals that data has changed and the next time we go to the main tree view window we need to refresh data
     * from the server
     */
    treeDirty: boolean;

    /*
     * maps node.uid values to NodeInfo.java objects
     *
     * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
     * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
     * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
     */
    uidToNodeMap: { [key: string]: I.NodeInfo };

    /* NodeData is a 'client-state' only object that holds information per-node that is in an object
    that is never used on server but only on client
    */
    uidToNodeDataMap: { [key: string]: Object };

    /*
     * maps node.id values to NodeInfo.java objects
     */
    idToNodeMap: { [key: string]: I.NodeInfo };

    /* Maps from the DOM ID to the editor javascript instance (Ace Editor instance) */
    aceEditorsById: any;

    /* counter for local uids */
    nextUid: number;

    /*
     * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
     * nextUid as the counter.
     */
    identToUidMap: { [key: string]: string };

    /*
     * Under any given node, there can be one active 'selected' node that has the highlighting, and will be scrolled
     * to whenever the page with that child is visited, and parentUidToFocusNodeMap holds the map of "parent uid to
     * selected node (NodeInfo object)", where the key is the parent node uid, and the value is the currently
     * selected node within that parent. Note this 'selection state' is only significant on the client, and only for
     * being able to scroll to the node during navigating around on the tree.
     */
    parentUidToFocusNodeMap: { [key: string]: I.NodeInfo };

    /* User-selectable user-account options each user can set on his account */
    MODE_ADVANCED: string;
    MODE_SIMPLE: string;

    /* can be 'simple' or 'advanced' */
    editModeOption: string;

    /*
     * toggled by button, and holds if we are going to show properties or not on each node in the main view
     */
    showProperties: boolean;

    /* Flag that indicates if we are rendering path, owner, modTime, etc. on each row */
    showMetaData: boolean;

    /*
     * List of node prefixes to flag nodes to not allow to be shown in the page in simple mode
     */
    simpleModeNodePrefixBlackList: any;

    simpleModePropertyBlackList: any;

    readOnlyPropertyList: any;

    binaryPropertyList: any;

    /*
     * maps all node uids to true if selected, otherwise the property should be deleted (not existing)
     */
    selectedNodes: any;

    /* Set of all nodes that have been expanded (from the abbreviated form) */
    expandedAbbrevNodeIds: any;

    /* RenderNodeResponse.java object */
    currentNodeData: I.RenderNodeResponse;

    renderFunctionsByJcrType: { [key: string]: Function };
    propOrderingFunctionsByJcrType: { [key: string]: Function };

    userPreferences: I.UserPreferences;

    postConstruct(_f: any);

    setNodeData(uid: string, data: Object);

    /* gets the value associated with the given uid and property */
    getNodeData(uid: string, prop: string): any;

    updateMainMenuPanel();

    inSimpleMode(): boolean;

    refresh(): void;

    rebuildIndexes(): void;

    goToMainPage(rerender?: boolean, forceServerRefresh?: boolean): void;

    selectTab(pageName): void;

    /*
     * If data (if provided) must be the instance data for the current instance of the dialog, and all the dialog
     * methods are of course singletons that accept this data parameter for any opterations. (oldschool way of doing
     * OOP with 'this' being first parameter always).
     *
     * Note: each data instance is required to have a guid numberic property, unique to it.
     *
     */
    changePage(pg?: any, data?: any);

    isNodeBlackListed(node): boolean;

    getSelectedNodeUidsArray(): string[];

    /**
    Returns a newly cloned array of all the selected nodes each time it's called.
    */
    getSelectedNodeIdsArray(): string[];

    /* return an object with properties for each NodeInfo where the key is the id */
    getSelectedNodesAsMapById(): Object;

    /* Gets selected nodes as NodeInfo.java objects array */
    getSelectedNodesArray(): I.NodeInfo[];

    clearSelectedNodes();

    updateNodeInfoResponse(res, node);

    updateNodeInfo(node: I.NodeInfo);

    /* Returns the node with the given node.id value */
    getNodeFromId(id: string): I.NodeInfo;

    getPathOfUid(uid: string): string;

    getHighlightedNode(): I.NodeInfo;

    highlightRowById(id, scroll): void;
    /*
     * Important: We want this to be the only method that can set values on 'parentUidToFocusNodeMap', and always
     * setting that value should go thru this function.
     */
    highlightNode(node: I.NodeInfo, scroll: boolean): void;
    /*
     * Really need to use pub/sub event to broadcast enablement, and let each component do this independently and
     * decouple
     */
    updateState();

    refreshAllGuiEnablement();

    /* WARNING: This is NOT the highlighted node. This is whatever node has the CHECKBOX selection */
    getSingleSelectedNode(): I.NodeInfo;

    getOrdinalOfNode(node: I.NodeInfo): number;

    getNumChildNodes(): number;

    setCurrentNodeData(data: I.RenderNodeResponse): void;

    anonPageLoadResponse(res: I.AnonPageLoadResponse): void;

    removeBinaryByUid(uid): void;

    /*
     * updates client side maps and client-side identifier for new node, so that this node is 'recognized' by client
     * side code
     */
    initNode(node: I.NodeInfo, updateMaps?: boolean): void;

    initConstants();

    initApp(): void;

    addTypeHandlers(typeName: string, renderFunction: Function, orderingFunction: Function): void;

    /* Eventually i'll refactor to have all these domIds in a component, and the component will contain the assignment of the onclicks */
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

    //google signon is a work in progress, not functional yet.
    onSignIn(googleUser);
}

