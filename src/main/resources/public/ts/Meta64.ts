console.log("Meta64.ts");

import * as I from "./Interfaces";
import { cnst, jcrCnst } from "./Constants";
import { util } from "./Util";
import { attachment } from "./Attachment";
import { edit } from "./Edit";
import { nav } from "./Nav";
import { prefs } from "./Prefs";
import { props } from "./Props";
import { render } from "./Render";
import { srch } from "./Search";
import { share } from "./Share";
import { user } from "./User";
import { view } from "./View";
import { MenuPanel } from "./MenuPanel";
import { podcast } from "./Podcast";
import { systemfolder } from "./SystemFolder";
import { ChangePasswordDlg } from "./ChangePasswordDlg";
import { Factory } from "./Factory";
import { domBind } from "./DomBind";
import { rssPlugin } from "./plugins/RssPlugin";
import { coreTypesPlugin } from "./plugins/CoreTypesPlugin";

declare const System: any;

//need to declare Polymer using *.d.ts file.
declare var Polymer;

class Meta64 {

    menuPanel: MenuPanel;

    /* This is the state that all enablement and visibility must reference to determine how to enable gui */
    state = {
        prevPageExists: false,
        nextPageExists: false,
        selNodeCount: 0,
        highlightNode: null,
        selNodeIsMine: false,
        homeNodeSelected: false,
        importFeatureEnabled: false,
        exportFeatureEnabled: false,
        highlightOrdinal: 0,
        numChildNodes: 0,
        canMoveUp: false,
        canMoveDown: false,
        canCreateNode: false,
        propsToggle: false,
        allowEditMode: false
    };

    appInitialized: boolean = false;

    curUrlPath: string = window.location.pathname + window.location.search;
    urlCmd: string;
    homeNodeOverride: string;

    codeFormatDirty: boolean = false;

    /* used as a kind of 'sequence' in the app, when unique vals a needed */
    nextGuid: number = 0;

    /* name of currently logged in user */
    userName: string = "anonymous";

    /* screen capabilities */
    deviceWidth: number = 0;
    deviceHeight: number = 0;

    /*
     * User's root node. Top level of what logged in user is allowed to see.
     */
    homeNodeId: string = "";
    homeNodePath: string = "";

    /*
     * specifies if this is admin user.
     */
    isAdminUser: boolean = false;

    /* always start out as anon user until login */
    isAnonUser: boolean = true;
    anonUserLandingPageNode: any = null;
    allowFileSystemSearch: boolean = false;

    /*
     * signals that data has changed and the next time we go to the main tree view window we need to refresh data
     * from the server
     */
    treeDirty: boolean = false;

    /*
     * maps node.uid values to NodeInfo.java objects
     *
     * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
     * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
     * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
     */
    uidToNodeMap: { [key: string]: I.NodeInfo } = {};

    /*
     * maps node.id values to NodeInfo.java objects
     */
    idToNodeMap: { [key: string]: I.NodeInfo } = {};

    /* Maps from the DOM ID to the editor javascript instance (Ace Editor instance) */
    aceEditorsById: any = {};

    /* counter for local uids */
    nextUid: number = 1;

    /*
     * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
     * nextUid as the counter.
     */
    identToUidMap: { [key: string]: string } = {};

    /*
     * Under any given node, there can be one active 'selected' node that has the highlighting, and will be scrolled
     * to whenever the page with that child is visited, and parentUidToFocusNodeMap holds the map of "parent uid to
     * selected node (NodeInfo object)", where the key is the parent node uid, and the value is the currently
     * selected node within that parent. Note this 'selection state' is only significant on the client, and only for
     * being able to scroll to the node during navigating around on the tree.
     */
    parentUidToFocusNodeMap: { [key: string]: I.NodeInfo } = {};

    /* User-selectable user-account options each user can set on his account */
    MODE_ADVANCED: string = "advanced";
    MODE_SIMPLE: string = "simple";

    /* can be 'simple' or 'advanced' */
    editModeOption: string = "simple";

    /*
     * toggled by button, and holds if we are going to show properties or not on each node in the main view
     */
    showProperties: boolean = false;

    /* Flag that indicates if we are rendering path, owner, modTime, etc. on each row */
    showMetaData: boolean = false;

    /*
     * List of node prefixes to flag nodes to not allow to be shown in the page in simple mode
     */
    simpleModeNodePrefixBlackList: any = {
        "rep:": true
    };

    simpleModePropertyBlackList: any = {};

    readOnlyPropertyList: any = {};

    binaryPropertyList: any = {};

    /*
     * maps all node uids to true if selected, otherwise the property should be deleted (not existing)
     */
    selectedNodes: any = {};

    /* Set of all nodes that have been expanded (from the abbreviated form) */
    expandedAbbrevNodeIds: any = {};

    /* RenderNodeResponse.java object */
    currentNodeData: any = null;

    /*
     * all variables derivable from currentNodeData, but stored directly for simpler code/access
     */
    currentNode: I.NodeInfo = null;
    currentNodeUid: any = null;
    currentNodeId: any = null;
    currentNodePath: any = null;

    renderFunctionsByJcrType: { [key: string]: Function } = {};
    propOrderingFunctionsByJcrType: { [key: string]: Function } = {};

    userPreferences: I.UserPreferences = {
        "editMode": false,
        "advancedMode": false,
        "lastNode": "",
        "importAllowed": false,
        "exportAllowed": false,
        "showMetaData": false
    };

    updateMainMenuPanel() {
        console.log("building main menu panel");

        /* create menuPanel, only upon first need for it. I think really I should be creating right in the initializer code instead here, but leaving
        in this legacy location for now */
        if (!this.menuPanel) {
            /* We have to use Factory here even on this non-Dialog class because SystemJS (despite the claims of its developers) doesn't
            handle the particular type of circular reference this causes if not loaded async by Factory */
            Factory.createDefault("MenuPanelImpl", (menuPanel: MenuPanel) => {
                this.menuPanel = menuPanel;
                util.setHtml("mainAppMenu", menuPanel.render());
                meta64.refreshAllGuiEnablement();
            });
        }
        else {
            meta64.refreshAllGuiEnablement();
        }
    }

    inSimpleMode(): boolean {
        return meta64.editModeOption === meta64.MODE_SIMPLE;
    }

    refresh(): void {
        meta64.goToMainPage(true, true);
    }

    goToMainPage(rerender?: boolean, forceServerRefresh?: boolean): void {

        if (forceServerRefresh) {
            meta64.treeDirty = true;
        }

        if (rerender || meta64.treeDirty) {
            if (meta64.treeDirty) {
                view.refreshTree(null, true);
            } else {
                render.renderPageFromData();
                meta64.refreshAllGuiEnablement();
            }
        }
        /*
         * If not re-rendering page (either from server, or from local data, then we just need to litterally switch
         * page into visible, and scroll to node)
         */
        else {
            view.scrollToSelectedNode();
        }
    }

    selectTab(pageName): void {
        let ironPages = document.querySelector("#mainIronPages") as any;
        ironPages.select(pageName);

        /* this code can be made more DRY, but i'm just trying it out for now, so i'm not bothering to perfect it yet. */
        // $ ("#mainPageButton").css("border-left", "");
        // $ ("#searchPageButton").css("border-left", "");
        // $ ("#timelinePageButton").css("border-left", "");
        //
        // if (pageName == 'mainTabName') {
        //     $ ("#mainPageButton").css("border-left", "8px solid red");
        // }
        // else if (pageName == 'searchTabName') {
        //     $ ("#searchPageButton").css("border-left", "8px solid red");
        // }
        // else if (pageName == 'timelineTabName') {
        //     $ ("#timelinePageButton").css("border-left", "8px solid red");
        // }
    }


    /*
     * If data (if provided) must be the instance data for the current instance of the dialog, and all the dialog
     * methods are of course singletons that accept this data parameter for any opterations. (oldschool way of doing
     * OOP with 'this' being first parameter always).
     *
     * Note: each data instance is required to have a guid numberic property, unique to it.
     *
     */
    changePage(pg?: any, data?: any) {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }

        /* this is the same as setting using mainIronPages?? */
        let paperTabs = document.querySelector("#mainIronPages") as any;
        paperTabs.select(pg.tabId);
    }

    isNodeBlackListed(node): boolean {
        if (!meta64.inSimpleMode())
            return false;

        let ret = false;

        util.forEachProp(meta64.simpleModeNodePrefixBlackList, (prop, val): boolean => {
            if (util.startsWith(node.name, prop)) {
                ret = true;
                //teminate iteration with false return
                return false;
            }
            return true;
        });

        return ret;
    }

    getSelectedNodeUidsArray(): string[] {
        let selArray: string[] = [];
        util.forEachProp(meta64.selectedNodes, (uid, val): boolean => {
            selArray.push(uid);
            return true;
        });
        return selArray;
    }

    /**
    Returns a newly cloned array of all the selected nodes each time it's called.
    */
    getSelectedNodeIdsArray(): string[] {
        let selArray: string[] = [];

        if (!meta64.selectedNodes) {
            console.log("no selected nodes.");
        } else {
            console.log("selectedNode count: " + util.getPropertyCount(meta64.selectedNodes));
        }

        util.forEachProp(meta64.selectedNodes, (uid, val): boolean => {
            let node: I.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("unable to find uidToNodeMap for uid=" + uid);
            } else {
                selArray.push(node.id);
            }
            return true;
        });
        return selArray;
    }

    /* return an object with properties for each NodeInfo where the key is the id */
    getSelectedNodesAsMapById(): Object {
        let ret: Object = {};
        let selArray: I.NodeInfo[] = this.getSelectedNodesArray();
        if (!selArray) return ret;
        for (let i = 0; i < selArray.length; i++) {
            ret[selArray[i].id] = selArray[i];
        }
        return ret;
    }

    /* Gets selected nodes as NodeInfo.java objects array */
    getSelectedNodesArray(): I.NodeInfo[] {
        let selArray: I.NodeInfo[] = [];
        util.forEachProp(meta64.selectedNodes, (uid, val): boolean => {
            let node = meta64.uidToNodeMap[uid];
            if (node) {
                selArray.push(node);
            }
            return true;
        });
        return selArray;
    }

    clearSelectedNodes() {
        meta64.selectedNodes = {};
    }

    updateNodeInfoResponse(res, node) {
        let ownerBuf: string = "";
        let mine: boolean = false;

        if (res.owners) {
            util.forEachArrElm(res.owners, (owner, index) => {
                if (ownerBuf.length > 0) {
                    ownerBuf += ",";
                }

                if (owner === meta64.userName) {
                    mine = true;
                }

                ownerBuf += owner;
            });
        }

        if (ownerBuf.length > 0) {
            node.owner = ownerBuf;
            let elmId = "#ownerDisplay" + node.uid;
            let elm = document.querySelector(elmId);
            if (elm) {
                elm.innerHTML = " (Manager: " + ownerBuf + ")";
                if (mine) {
                    util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
                } else {
                    util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
                }
            }
        }
    }

    updateNodeInfo(node: I.NodeInfo) {
        util.ajax<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        }, (res: I.GetNodePrivilegesResponse) => {
            meta64.updateNodeInfoResponse(res, node);
        });
    }

    /* Returns the node with the given node.id value */
    getNodeFromId(id: string): I.NodeInfo {
        return meta64.idToNodeMap[id];
    }

    getPathOfUid(uid: string): string {
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        } else {
            return node.path;
        }
    }

    getHighlightedNode(): I.NodeInfo {
        let ret: I.NodeInfo = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
        return ret;
    }

    highlightRowById(id, scroll): void {
        let node: I.NodeInfo = meta64.getNodeFromId(id);
        if (node) {
            meta64.highlightNode(node, scroll);
        } else {
            console.log("highlightRowById failed to find id: " + id);
        }
    }

    /*
     * Important: We want this to be the only method that can set values on 'parentUidToFocusNodeMap', and always
     * setting that value should go thru this function.
     */
    highlightNode(node: I.NodeInfo, scroll: boolean): void {
        if (!node) {
            console.log("ignoring null noode.");
            return;
        }

        let doneHighlighting: boolean = false;

        /* Unhighlight currently highlighted node if any */
        let curHighlightedNode: I.NodeInfo = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
        if (curHighlightedNode) {
            //console.log("already had a highlighted node.");
            if (curHighlightedNode.uid === node.uid) {
                //console.log("nodeid " + node.uid + " was already highlighted.");
                doneHighlighting = true;
            } else {
                //console.log("highlighting(1).");
                let rowElmId = "row_" + curHighlightedNode.uid;
                util.changeOrAddClass(rowElmId, "active-row", "inactive-row");
            }
        }

        if (!doneHighlighting) {
            meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;

            let rowElmId: string = "row_" + node.uid;
            //console.log("highlighting(2): to row: "+rowElmId);
            util.changeOrAddClass(rowElmId, "inactive-row", "active-row");
        }

        if (scroll) {
            view.scrollToSelectedNode();
        }
    }

    /*
     * Really need to use pub/sub event to broadcast enablement, and let each component do this independently and
     * decouple
     */
    updateState() {
        /* multiple select nodes */
        meta64.state.prevPageExists = nav.mainOffset > 0;
        meta64.state.nextPageExists = !nav.endReached;
        meta64.state.selNodeCount = util.getPropertyCount(meta64.selectedNodes);
        meta64.state.highlightNode = meta64.getHighlightedNode();
        meta64.state.selNodeIsMine = meta64.state.highlightNode != null && (meta64.state.highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);

        meta64.state.homeNodeSelected = meta64.state.highlightNode != null && meta64.homeNodeId == meta64.state.highlightNode.id;
        meta64.state.importFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.importAllowed;
        meta64.state.exportFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
        meta64.state.highlightOrdinal = meta64.getOrdinalOfNode(meta64.state.highlightNode);
        meta64.state.numChildNodes = meta64.getNumChildNodes();
        meta64.state.canMoveUp = (meta64.state.highlightOrdinal > 0 && meta64.state.numChildNodes > 1) || meta64.state.prevPageExists;
        meta64.state.canMoveDown = (meta64.state.highlightOrdinal < meta64.state.numChildNodes - 1 && meta64.state.numChildNodes > 1) || meta64.state.nextPageExists;

        //todo-1: need to add to this selNodeIsMine || selParentIsMine;
        meta64.state.canCreateNode = meta64.userPreferences.editMode && (meta64.isAdminUser || (!meta64.isAnonUser /* && selNodeIsMine */));
        meta64.state.propsToggle = meta64.currentNode && !meta64.isAnonUser;
        meta64.state.allowEditMode = meta64.currentNode && !meta64.isAnonUser;
    }

    refreshAllGuiEnablement() {
        this.updateState();

        //for now we simply tolerate a null menuPanel here before it's initialized.
        if (this.menuPanel) {
            /* refreh all enablement and visibility under entire menu with this recursive call! */
            this.menuPanel.refreshState();
        }

        util.setEnablement("navLogoutButton", !meta64.isAnonUser);
        util.setEnablement("openSignupPgButton", meta64.isAnonUser);
        util.setEnablement("editModeButton", meta64.state.allowEditMode);
        util.setEnablement("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setEnablement("manageAccountButton", !meta64.isAnonUser);
        util.setEnablement("searchMainAppButton", !meta64.isAnonUser && meta64.state.highlightNode != null);
        util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && meta64.state.highlightNode != null);
        util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);

        util.setElmDisplayById("editModeButton", meta64.state.allowEditMode);
        util.setElmDisplayById("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setElmDisplayById("openLoginDlgButton", meta64.isAnonUser);
        util.setElmDisplayById("navLogoutButton", !meta64.isAnonUser);
        util.setElmDisplayById("openSignupPgButton", meta64.isAnonUser);
        util.setElmDisplayById("searchMainAppButton", !meta64.isAnonUser && meta64.state.highlightNode != null);
        util.setElmDisplayById("timelineMainAppButton", !meta64.isAnonUser && meta64.state.highlightNode != null);
        util.setElmDisplayById("userPreferencesMainAppButton", !meta64.isAnonUser);

        Polymer.dom.flush(); // <---- is this needed ? todo-3
        Polymer.updateStyles();
    }

    getSingleSelectedNode(): I.NodeInfo {
        let ret = null;
        util.forEachProp(meta64.selectedNodes, (uid, val): boolean => {
            // console.log("found a single Sel NodeID: " + nodeId);
            ret = meta64.uidToNodeMap[uid];
            return false;
        });
        return ret;
    }

    getOrdinalOfNode(node: I.NodeInfo): number {
        let ret = -1;

        if (!node || !meta64.currentNodeData || !meta64.currentNodeData.children)
            return ret;

        util.forEachArrElm(meta64.currentNodeData.children, (iterNode, idx): boolean => {
            if (node.id === iterNode.id) {
                ret = idx;
                return false; //stop iterating.
            }
            return true;
        });
        return ret;
    }

    getNumChildNodes(): number {
        if (!meta64.currentNodeData || !meta64.currentNodeData.children)
            return 0;

        return meta64.currentNodeData.children.length;
    }

    setCurrentNodeData(data): void {
        meta64.currentNodeData = data;
        meta64.currentNode = data.node;
        meta64.currentNodeUid = data.node.uid;
        meta64.currentNodeId = data.node.id;
        meta64.currentNodePath = data.node.path;
    }

    anonPageLoadResponse(res: I.AnonPageLoadResponse): void {

        if (res.renderNodeResponse) {

            util.setElmDisplayById("mainNodeContent", true);

            render.renderPageFromData(res.renderNodeResponse);

            meta64.refreshAllGuiEnablement();
        } else {
            util.setElmDisplayById("mainNodeContent", false);

            console.log("setting listview to: " + res.content);
            util.setHtml("listView", res.content);
        }
    }

    removeBinaryByUid(uid): void {
        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
            let node: I.NodeInfo = meta64.currentNodeData.children[i];
            if (node.uid === uid) {
                node.hasBinary = false;
                break;
            }
        }
    }

    /*
     * updates client side maps and client-side identifier for new node, so that this node is 'recognized' by client
     * side code
     */
    initNode(node: I.NodeInfo, updateMaps?: boolean): void {
        if (!node) {
            console.log("initNode has null node");
            return;
        }
        /*
         * assign a property for detecting this node type, I'll do this instead of using some kind of custom JS
         * prototype-related approach
         */
        node.uid = updateMaps ? util.getUidForId(meta64.identToUidMap, node.id) : meta64.identToUidMap[node.id];
        node.properties = props.getPropertiesInEditingOrder(node, node.properties);

        /*
         * For these two properties that are accessed frequently we go ahead and lookup the properties in the
         * property array, and assign them directly as node object properties so to improve performance, and also
         * simplify code.
         */
        node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        node.lastModified = new Date(props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node));

        if (updateMaps) {
            meta64.uidToNodeMap[node.uid] = node;
            meta64.idToNodeMap[node.id] = node;
        }
    }

    initConstants() {
        util.addAll(meta64.simpleModePropertyBlackList, [ //
            jcrCnst.MIXIN_TYPES, //
            jcrCnst.PRIMARY_TYPE, //
            jcrCnst.POLICY, //
            jcrCnst.IMG_WIDTH,//
            jcrCnst.IMG_HEIGHT, //
            jcrCnst.BIN_VER, //
            jcrCnst.BIN_DATA, //
            jcrCnst.BIN_MIME, //
            jcrCnst.COMMENT_BY, //
            jcrCnst.PUBLIC_APPEND]);

        util.addAll(meta64.readOnlyPropertyList, [ //
            jcrCnst.PRIMARY_TYPE, //
            jcrCnst.UUID, //
            jcrCnst.MIXIN_TYPES, //
            jcrCnst.CREATED, //
            jcrCnst.CREATED_BY, //
            jcrCnst.LAST_MODIFIED, //
            jcrCnst.LAST_MODIFIED_BY,//
            jcrCnst.IMG_WIDTH, //
            jcrCnst.IMG_HEIGHT, //
            jcrCnst.BIN_VER, //
            jcrCnst.BIN_DATA, //
            jcrCnst.BIN_MIME, //
            jcrCnst.COMMENT_BY, //
            jcrCnst.PUBLIC_APPEND]);

        util.addAll(meta64.binaryPropertyList, [jcrCnst.BIN_DATA]);
    }

    initApp(): void {
        console.log("initApp running.");

        rssPlugin.init();
        coreTypesPlugin.init();

        // SystemFolder and File handling stuff is disabled for now (todo-0), but will eventually be brought
        // back as a plugin similar to rssPlugin, coreTypesPlugin, etc.
        //
        // meta64.renderFunctionsByJcrType["meta64:systemfolder"] = systemfolder.renderNode;
        // meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = systemfolder.propOrdering;
        //
        // meta64.renderFunctionsByJcrType["meta64:filelist"] = systemfolder.renderFileListNode;
        // meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = systemfolder.fileListPropOrdering;

        // var onresize = window.onresize;
        // window.onresize = function(event) { if (typeof onresize === 'function') onresize(); /** ... */ }

        (window as any).addEvent = (object, type, callback) => {
            if (object == null || typeof (object) == 'undefined')
                return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        };

        // /*
        //  * WARNING: This is called in realtime while user is resizing so always throttle back any processing so that you don't
        //  * do any actual processing in here unless you want it VERY live, because it is.
        //  */
        // (<any>window).windowResize = function() {
        //     // console.log("WindowResize: w=" + window.innerWidth + " h=" + window.innerHeight);
        // }
        //
        // (<any>window).addEvent(window, "resize", (<any>window).windowResize);
        //
        // this commented section is not working in my new x-app code, but it's ok to comment it out for now.
        //
        // This is our template element in index.html
        // var app = document.querySelector('#x-app');
        // // Listen for template bound event to know when bindings
        // // have resolved and content has been stamped to the page
        // app.addEventListener('dom-change', function() {
        //     console.log('app ready event!');
        // });

        (window as any).addEventListener('polymer-ready', (e) => {
            console.log('polymer-ready event!');
        });
        console.log("running module: cnst.js");

        if (meta64.appInitialized)
            return;

        meta64.appInitialized = true;

        let tabs = util.poly("mainIronPages");
        tabs.addEventListener("iron-select", () => {
            meta64.tabChangeEvent(tabs.selected);
        });

        meta64.initConstants();
        meta64.displaySignupMessage();

        /*
         * todo-3: how does orientationchange need to work for polymer? Polymer disabled
         * $ (window).on("orientationchange", _.orientationHandler);
         */
        window.onbeforeunload = () => {
            return "Leave Meta64 ?";
        };

        /*
         * I thought this was a good idea, but actually it destroys the session, when the user is entering an
         * "id=\my\path" type of url to open a specific node. Need to rethink  Basically for now I'm thinking
         * going to a different url shouldn't blow up the session, which is what 'logout' does.
         *
         * $ (window).on("unload", function() { user.logout(false); });
         */

        meta64.deviceWidth = window.innerWidth;
        meta64.deviceHeight = window.innerHeight;

        /*
         * This call checks the server to see if we have a session already, and gets back the login information from
         * the session, and then renders page content, after that.
         */
        user.refreshLogin();

        /*
         * Check for screen size in a timer. We don't want to monitor actual screen resize events because if a user
         * is expanding a window we basically want to limit the CPU and chaos that would ensue if we tried to adjust
         * things every time it changes. So we throttle back to only reorganizing the screen once per second. This
         * timer is a throttle sort of. Yes I know how to listen for events. No I'm not doing it wrong here. This
         * timer is correct in this case and behaves superior to events.
         */
        /*
         * Polymer->disable
         * setInterval(function() { var width = $ (window).width();
         * if (width != _.deviceWidth) { // console.log("Screen width changed: " + width);
         * _.deviceWidth = width; _.deviceHeight = $ (window).height();
         * _.screenSizeChange(); } }, 1500);
         */
        meta64.updateMainMenuPanel();
        meta64.refreshAllGuiEnablement();
        util.initProgressMonitor();
        meta64.processUrlParams();
        this.initStaticHtmlOnClicks();

        console.log("initApp complete.");
    }

    addTypeHandlers(typeName: string, renderFunction: Function, orderingFunction: Function): void {
        if (renderFunction) {
            meta64.renderFunctionsByJcrType[typeName] = renderFunction;
        }
        if (orderingFunction) {
            meta64.propOrderingFunctionsByJcrType[typeName] = orderingFunction;
        }
    }

    /* Eventually i'll refactor to have all these domIds in a component, and the component will contain the assignment of the onclicks */
    initStaticHtmlOnClicks(): void {
        domBind.addOnClick("headerAppName", nav.navPublicHome);
        domBind.addOnClick("navHomeButton", nav.navHome);
        domBind.addOnClick("upLevelButton", nav.navUpLevel);
        domBind.addOnClick("editModeButton", nav.editMode);
        domBind.addOnClick("searchMainAppButton", nav.search);
        domBind.addOnClick("timelineMainAppButton", srch.timelineByModTime);
        domBind.addOnClick("userPreferencesMainAppButton", nav.preferences);
        domBind.addOnClick("openLoginDlgButton", nav.login);
        domBind.addOnClick("navLogoutButton", nav.logout);
        domBind.addOnClick("openSignupPgButton", nav.signup);
    }

    processUrlParams(): void {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(() => {
                Factory.createDefault("ChangePasswordDlgImpl", (dlg: ChangePasswordDlg) => {
                    dlg.open();
                }, { "passCode": passCode })
            }, 100);
        }

        meta64.urlCmd = util.getParameterByName("cmd");
    }

    tabChangeEvent(tabName): void {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    }

    displaySignupMessage(): void {
        let signupElm = util.domElm("#signupCodeResponse");
        if (signupElm) {
            let signupResponse = signupElm.textContent;
            if (signupResponse === "ok") {
                util.showMessage("Signup complete. You may now login.");
            }
        }
    }

    screenSizeChange(): void {
        if (meta64.currentNodeData) {

            if (meta64.currentNode.imgId) {
                render.adjustImageSize(meta64.currentNode);
            }

            util.forEachArrElm(meta64.currentNodeData.children, (node, i) => {
                if (node.imgId) {
                    render.adjustImageSize(node);
                }
            });
        }
    }

    //
    // /* Don't need this method yet, and haven't tested to see if works */
    // orientationHandler = function(event): void {
    //     // if (event.orientation) {
    //     // if (event.orientation === 'portrait') {
    //     // } else if (event.orientation === 'landscape') {
    //     // }
    //     // }
    // }
    //

    loadAnonPageHome(ignoreUrl): void {
        util.ajax<I.AnonPageLoadRequest, I.AnonPageLoadResponse>("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, meta64.anonPageLoadResponse);
    }

    saveUserPreferences(): void {
        util.ajax<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            "userPreferences": meta64.userPreferences
        });
    }

    openSystemFile(fileName: string) {
        util.ajax<I.OpenSystemFileRequest, I.OpenSystemFileResponse>("openSystemFile", {
            "fileName": fileName
        });
    }

    /* This is a wrapper around System.import, to make future refactoring needs easier, and also make the code a bit cleaner */
    modRun(modName: string, callback: Function) {
        System.import("/js/" + modName).then((mod) => {
            callback(mod);
        });
    }

    clickOnNodeRow(uid): void {
        nav.clickOnNodeRow(uid);
    }

    replyToComment(uid: any): void {
        edit.replyToComment(uid);
    }

    openNode(uid): void {
        nav.openNode(uid);
    }

    toggleNodeSel(uid): void {
        nav.toggleNodeSel(uid);
    }

    createSubNode(uid?: any, typeName?: string, createAtTop?: boolean): void {
        edit.createSubNode(uid, typeName, createAtTop);
    }

    insertNode(uid?: any, typeName?: string): void {
        edit.insertNode(uid, typeName);
    }

    runEditNode(uid: any): void {
        edit.runEditNode(uid);
    }

    moveNodeUp(uid?: string): void {
        edit.moveNodeUp();
    }

    moveNodeDown(uid?: string): void {
        edit.moveNodeDown();
    }

    clickOnSearchResultRow(rowElm, uid) {
        srch.clickOnSearchResultRow(rowElm, uid);
    }

    clickSearchNode(uid: string) {
        srch.clickSearchNode(uid);
    }

    //webpack
    // editSystemFile(fileName: string) {
    //     new EditSystemFileDlg(fileName).open();
    // }
}

export let meta64: Meta64 = new Meta64();
(window as any).meta64 = meta64;
