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
import { menuPanel } from "./MenuPanel";
import { podcast } from "./Podcast";
import { systemfolder } from "./SystemFolder";
import { ChangePasswordDlg } from "./ChangePasswordDlg";
import { Factory } from "./Factory";
import { bindClick } from "./BindClick";

// / <reference path="./tyepdefs/jquery/jquery.d.ts" />
// / <reference path="./tyepdefs/jquery.cookie/jquery.cookie.d.ts" />

declare const System: any;
declare var Polymer;


class Meta64 {

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

    /* Maps from guid to Data Object */
    dataObjMap: any = {};

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

    updateMainMenuPanel = function() {
        console.log("building main menu panel");
        menuPanel.build();
        meta64.refreshAllGuiEnablement();
    }

    /*
     * Creates a 'guid' on this object, and makes dataObjMap able to look up the object using that guid in the
     * future.
     */
    registerDataObject = function(data) {
        if (!data.guid) {
            data.guid = ++meta64.nextGuid;
            meta64.dataObjMap[data.guid] = data;
        }
    }

    getObjectByGuid = function(guid) {
        var ret = meta64.dataObjMap[guid];
        if (!ret) {
            console.log("data object not found: guid=" + guid);
        }
        return ret;
    }

    /*
     * If callback is a string, it will be interpreted as a script to run, or if it's a function object that will be
     * the function to run.
     *
     * Whenever we are building an onClick string, and we have the actual function, rather than the name of the
     * function (i.e. we have the function object and not a string representation we hande that by assigning a guid
     * to the function object, and then encode a call to run that guid by calling runCallback. There is a level of
     * indirection here, but this is the simplest approach when we need to be able to map from a string to a
     * function.
     *
     * ctx=context, which is the 'this' to call with if we have a function, and have a 'this' context to bind to it.
     *
     * payload is any data object that needs to be passed at runtime
     *
     * note: doesn't currently support having a null ctx and non-null payload.
     *
     * todo-0: use obj.bind(this) for the 'callback' parameter passing then then get rid of 'ctx' parameter, but
     * be careful with the logic, it will be tricky.
     */
    encodeOnClick = function(callback: any, ctx?: any, payload?: any, delayCallback?: number) {
        if (typeof callback == "string") {
            return callback;
        } //
        else if (typeof callback == "function") {
            meta64.registerDataObject(callback);

            if (ctx) {
                meta64.registerDataObject(ctx);

                if (payload) {
                    meta64.registerDataObject(payload);
                }
                let payloadStr = payload ? payload.guid : "null";
                return `meta64.runCallback(${callback.guid},${ctx.guid},${payloadStr},${delayCallback});`;
            } else {
                return `meta64.runCallback(${callback.guid},null,null,${delayCallback});`;
            }
        }
        else {
            throw "unexpected callback type in encodeOnClick";
        }
    }

    runCallback = function(guid, ctx, payload, delayCallback?: number) {
        console.log("callback run: " + delayCallback);
        /* depending on delayCallback, run the callback either immediately or with a delay */
        if (delayCallback > 0) {
            setTimeout(function() {
                meta64.runCallbackImmediate(guid, ctx, payload);
            }, delayCallback);
        }
        else {
            return meta64.runCallbackImmediate(guid, ctx, payload);
        }
    }

    runCallbackImmediate = function(guid, ctx, payload) {
        var dataObj = meta64.getObjectByGuid(guid);

        // if this is an object, we expect it to have a 'callback' property
        // that is a function
        if (dataObj.callback) {
            dataObj.callback();
        }
        // or else sometimes the registered object itself is the function,
        // which is ok too
        else if (typeof dataObj == 'function') {
            if (ctx) {
                var thiz = meta64.getObjectByGuid(ctx);
                var payloadObj = payload ? meta64.getObjectByGuid(payload) : null;
                dataObj.call(thiz, payloadObj);
            } else {
                dataObj();
            }
        } else {
            throw "unable to find callback on registered guid: " + guid;
        }
    }

    inSimpleMode = function(): boolean {
        return meta64.editModeOption === meta64.MODE_SIMPLE;
    }

    refresh = function(): void {
        meta64.goToMainPage(true, true);
    }

    goToMainPage = function(rerender?: boolean, forceServerRefresh?: boolean): void {

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

    selectTab = function(pageName): void {
        let ironPages = document.querySelector("#mainIronPages") as any;
        ironPages.select(pageName);

        /* this code can be made more DRY, but i'm just trying it out for now, so i'm not bothering to perfect it yet. */
        // $("#mainPageButton").css("border-left", "");
        // $("#searchPageButton").css("border-left", "");
        // $("#timelinePageButton").css("border-left", "");
        //
        // if (pageName == 'mainTabName') {
        //     $("#mainPageButton").css("border-left", "8px solid red");
        // }
        // else if (pageName == 'searchTabName') {
        //     $("#searchPageButton").css("border-left", "8px solid red");
        // }
        // else if (pageName == 'timelineTabName') {
        //     $("#timelinePageButton").css("border-left", "8px solid red");
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
    changePage = function(pg?: any, data?: any) {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }

        /* this is the same as setting using mainIronPages?? */
        var paperTabs = document.querySelector("#mainIronPages") as any; //"#mainPaperTabs");
        paperTabs.select(pg.tabId);
    }

    isNodeBlackListed = function(node): boolean {
        if (!meta64.inSimpleMode())
            return false;

        let prop;
        for (prop in meta64.simpleModeNodePrefixBlackList) {
            if (meta64.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && util.startsWith(node.name, prop)) {
                return true;
            }
        }

        return false;
    }

    getSelectedNodeUidsArray = function(): string[] {
        let selArray: string[] = [], uid;

        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                selArray.push(uid);
            }
        }
        return selArray;
    }

    /**
    Returns a newly cloned array of all the selected nodes each time it's called.
    */
    getSelectedNodeIdsArray = function(): string[] {
        let selArray: string[] = [], uid;

        if (!meta64.selectedNodes) {
            console.log("no selected nodes.");
        } else {
            console.log("selectedNode count: " + util.getPropertyCount(meta64.selectedNodes));
        }

        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                let node: I.NodeInfo = meta64.uidToNodeMap[uid];
                if (!node) {
                    console.log("unable to find uidToNodeMap for uid=" + uid);
                } else {
                    selArray.push(node.id);
                }
            }
        }
        return selArray;
    }

    /* return an object with properties for each NodeInfo where the key is the id */
    getSelectedNodesAsMapById = function(): Object {
        let ret: Object = {};
        let selArray: I.NodeInfo[] = this.getSelectedNodesArray();
        for (var i = 0; i < selArray.length; i++) {
            ret[selArray[i].id] = selArray[i];
        }
        return ret;
    }

    /* Gets selected nodes as NodeInfo.java objects array */
    getSelectedNodesArray = function(): I.NodeInfo[] {
        let selArray: I.NodeInfo[] = [];
        let idx: number = 0;
        let uid: string = "";
        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = meta64.uidToNodeMap[uid];
            }
        }
        return selArray;
    }

    clearSelectedNodes = function() {
        meta64.selectedNodes = {};
    }

    updateNodeInfoResponse = function(res, node) {
        let ownerBuf: string = "";
        let mine: boolean = false;

        if (res.owners) {
            $.each(res.owners, function(index, owner) {
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
            var elm = $(elmId);
            elm.html(" (Manager: " + ownerBuf + ")");
            if (mine) {
                util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
            } else {
                util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
            }
        }
    }

    updateNodeInfo = function(node: I.NodeInfo) {
        util.json<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        }, function(res: I.GetNodePrivilegesResponse) {
            meta64.updateNodeInfoResponse(res, node);
        });
    }

    /* Returns the node with the given node.id value */
    getNodeFromId = function(id: string): I.NodeInfo {
        return meta64.idToNodeMap[id];
    }

    getPathOfUid = function(uid: string): string {
        let node: I.NodeInfo = meta64.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        } else {
            return node.path;
        }
    }

    getHighlightedNode = function(): I.NodeInfo {
        let ret: I.NodeInfo = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
        return ret;
    }

    highlightRowById = function(id, scroll): void {
        var node: I.NodeInfo = meta64.getNodeFromId(id);
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
    highlightNode = function(node: I.NodeInfo, scroll: boolean): void {
        if (!node)
            return;

        let doneHighlighting: boolean = false;

        /* Unhighlight currently highlighted node if any */
        let curHighlightedNode: I.NodeInfo = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
        if (curHighlightedNode) {
            if (curHighlightedNode.uid === node.uid) {
                // console.log("already highlighted.");
                doneHighlighting = true;
            } else {
                let rowElmId = curHighlightedNode.uid + "_row";
                let rowElm = $("#" + rowElmId);
                util.changeOrAddClass("#" + rowElmId, "active-row", "inactive-row");
            }
        }

        if (!doneHighlighting) {
            meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;

            let rowElmId: string = node.uid + "_row";
            let rowElm = $("#" + rowElmId);
            if (!rowElm || rowElm.length == 0) {
                console.log("Unable to find rowElement to highlight: " + rowElmId);
            }
            util.changeOrAddClass("#" + rowElmId, "inactive-row", "active-row");
        }

        if (scroll) {
            view.scrollToSelectedNode();
        }
    }

    /*
     * Really need to use pub/sub event to broadcast enablement, and let each component do this independently and
     * decouple
     */

    refreshAllGuiEnablement = function() {
        /* multiple select nodes */
        let prevPageExists: boolean = nav.mainOffset > 0;
        let nextPageExists: boolean = !nav.endReached;
        let selNodeCount: number = util.getPropertyCount(meta64.selectedNodes);
        let highlightNode: I.NodeInfo = meta64.getHighlightedNode();
        let selNodeIsMine: boolean = highlightNode != null && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
        //console.log("homeNodeId="+meta64.homeNodeId+" highlightNode.id="+highlightNode.id);
        let homeNodeSelected: boolean = highlightNode != null && meta64.homeNodeId == highlightNode.id;
        let importFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.importAllowed;
        let exportFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
        let highlightOrdinal: number = meta64.getOrdinalOfNode(highlightNode);
        let numChildNodes: number = meta64.getNumChildNodes();
        let canMoveUp: boolean = (highlightOrdinal > 0 && numChildNodes > 1) || prevPageExists;
        let canMoveDown: boolean = (highlightOrdinal < numChildNodes - 1 && numChildNodes > 1) || nextPageExists;

        //todo-1: need to add to this selNodeIsMine || selParentIsMine;
        let canCreateNode = meta64.userPreferences.editMode && (meta64.isAdminUser || (!meta64.isAnonUser /* && selNodeIsMine */));

        console.log("enablement: isAnonUser=" + meta64.isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);

        util.setEnablement("navLogoutButton", !meta64.isAnonUser);
        util.setEnablement("openSignupPgButton", meta64.isAnonUser);

        let propsToggle: boolean = meta64.currentNode && !meta64.isAnonUser;
        util.setEnablement("propsToggleButton", propsToggle);

        let allowEditMode: boolean = meta64.currentNode && !meta64.isAnonUser;

        util.setEnablement("editModeButton", allowEditMode);
        util.setEnablement("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setEnablement("cutSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("deleteSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("clearSelectionsButton", !meta64.isAnonUser && selNodeCount > 0);

        util.setEnablement("pasteSelNodesButton", !meta64.isAnonUser && edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));

        util.setEnablement("moveNodeUpButton", canMoveUp);
        util.setEnablement("moveNodeDownButton", canMoveDown);
        util.setEnablement("moveNodeToTopButton", canMoveUp);
        util.setEnablement("moveNodeToBottomButton", canMoveDown);

        util.setEnablement("changePasswordPgButton", !meta64.isAnonUser);
        util.setEnablement("accountPreferencesButton", !meta64.isAnonUser);
        util.setEnablement("manageAccountButton", !meta64.isAnonUser);
        util.setEnablement("insertBookWarAndPeaceButton", meta64.isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
        util.setEnablement("generateRSSButton", meta64.isAdminUser);
        util.setEnablement("uploadFromFileButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("uploadFromUrlButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("deleteAttachmentsButton", !meta64.isAnonUser && highlightNode != null
            && highlightNode.hasBinary && selNodeIsMine);
        util.setEnablement("editNodeSharingButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("renameNodePgButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("contentSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("tagSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);
        util.setEnablement("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("timelineCreatedButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("timelineModifiedButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("showServerInfoButton", meta64.isAdminUser);
        util.setEnablement("showFullNodeUrlButton", highlightNode != null);
        util.setEnablement("refreshPageButton", !meta64.isAnonUser);
        util.setEnablement("findSharedNodesButton", !meta64.isAnonUser && highlightNode != null);
        util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);
        util.setEnablement("createNodeButton", canCreateNode);
        util.setEnablement("openImportDlg", importFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
        util.setEnablement("openExportDlg", exportFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
        util.setEnablement("adminMenu", meta64.isAdminUser);

        //VISIBILITY
        util.setVisibility("openImportDlg", importFeatureEnabled);
        util.setVisibility("openExportDlg", exportFeatureEnabled);
        util.setVisibility("editModeButton", allowEditMode);
        util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setVisibility("insertBookWarAndPeaceButton", meta64.isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
        util.setVisibility("generateRSSButton", meta64.isAdminUser);
        util.setVisibility("propsToggleButton", !meta64.isAnonUser);
        util.setVisibility("openLoginDlgButton", meta64.isAnonUser);
        util.setVisibility("navLogoutButton", !meta64.isAnonUser);
        util.setVisibility("openSignupPgButton", meta64.isAnonUser);
        util.setVisibility("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
        util.setVisibility("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
        util.setVisibility("userPreferencesMainAppButton", !meta64.isAnonUser);
        util.setVisibility("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);

        //Top Level Menu Visibility
        util.setVisibility("adminMenu", meta64.isAdminUser);

        Polymer.dom.flush(); // <---- is this needed ? todo-3
        Polymer.updateStyles();
    }

    getSingleSelectedNode = function(): I.NodeInfo {
        let uid: string;
        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                // console.log("found a single Sel NodeID: " + nodeId);
                return meta64.uidToNodeMap[uid];
            }
        }
        return null;
    }

    getOrdinalOfNode = function(node: I.NodeInfo): number {
        if (!node || !meta64.currentNodeData || !meta64.currentNodeData.children)
            return -1;

        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
            if (node.id === meta64.currentNodeData.children[i].id) {
                return i;
            }
        }
        return -1;
    }

    getNumChildNodes = function(): number {
        if (!meta64.currentNodeData || !meta64.currentNodeData.children)
            return 0;

        return meta64.currentNodeData.children.length;
    }

    setCurrentNodeData = function(data): void {
        meta64.currentNodeData = data;
        meta64.currentNode = data.node;
        meta64.currentNodeUid = data.node.uid;
        meta64.currentNodeId = data.node.id;
        meta64.currentNodePath = data.node.path;
    }

    anonPageLoadResponse = function(res: I.AnonPageLoadResponse): void {

        if (res.renderNodeResponse) {

            util.setVisibility("mainNodeContent", true);

            render.renderPageFromData(res.renderNodeResponse);

            meta64.refreshAllGuiEnablement();
        } else {
            util.setVisibility("mainNodeContent", false);

            console.log("setting listview to: " + res.content);
            util.setHtml("listView", res.content);
        }
    }

    removeBinaryByUid = function(uid): void {
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
    initNode = function(node: I.NodeInfo, updateMaps?: boolean): void {
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

    initConstants = function() {
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

    initApp = function(): void {
        console.log("initApp running.");

        meta64.renderFunctionsByJcrType["meta64:rssfeed"] = podcast.renderFeedNode;
        meta64.renderFunctionsByJcrType["meta64:rssitem"] = podcast.renderItemNode;
        meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = podcast.propOrderingFeedNode;
        meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = podcast.propOrderingItemNode;

        //SystemFolder and File handling stuff is disabled for now (todo-0)
        // meta64.renderFunctionsByJcrType["meta64:systemfolder"] = systemfolder.renderNode;
        // meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = systemfolder.propOrdering;
        //
        // meta64.renderFunctionsByJcrType["meta64:filelist"] = systemfolder.renderFileListNode;
        // meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = systemfolder.fileListPropOrdering;

        //NOT w-pack
        // var onresize = window.onresize;
        // window.onresize = function(event) { if (typeof onresize === 'function') onresize(); /** ... */ }

        (window as any).addEvent = function(object, type, callback) {
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

        //NOT w-pack comment
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

        (window as any).addEventListener('polymer-ready', function(e) {
            console.log('polymer-ready event!');
        });
        console.log("running module: cnst.js");

        if (meta64.appInitialized)
            return;

        meta64.appInitialized = true;

        var tabs = util.poly("mainIronPages");
        tabs.addEventListener("iron-select", function() {
            meta64.tabChangeEvent(tabs.selected);
        });

        meta64.initConstants();
        meta64.displaySignupMessage();

        /*
         * todo-3: how does orientationchange need to work for polymer? Polymer disabled
         * $(window).on("orientationchange", _.orientationHandler);
         */

        $(window).bind("beforeunload", function() {
            return "Leave Meta64 ?";
        });

        /*
         * I thought this was a good idea, but actually it destroys the session, when the user is entering an
         * "id=\my\path" type of url to open a specific node. Need to rethink  Basically for now I'm thinking
         * going to a different url shouldn't blow up the session, which is what 'logout' does.
         *
         * $(window).on("unload", function() { user.logout(false); });
         */

        meta64.deviceWidth = $(window).width();
        meta64.deviceHeight = $(window).height();

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
         * setInterval(function() { var width = $(window).width();
         * if (width != _.deviceWidth) { // console.log("Screen width changed: " + width);
         * _.deviceWidth = width; _.deviceHeight = $(window).height();
         * _.screenSizeChange(); } }, 1500);
         */
        meta64.updateMainMenuPanel();
        meta64.refreshAllGuiEnablement();
        util.initProgressMonitor();
        meta64.processUrlParams();
        this.initStaticHtmlOnClicks();

        console.log("initApp complete.");
    }

    /* Eventually i'll refactor to have all these domIds in a component, and the component will contain the assignment of the onclicks */
    initStaticHtmlOnClicks = function(): void {
        bindClick.addOnClick("headerAppName", nav.navPublicHome);
        bindClick.addOnClick("navHomeButton", nav.navHome);
        bindClick.addOnClick("upLevelButton", nav.navUpLevel);
        bindClick.addOnClick("editModeButton", nav.editMode);
        bindClick.addOnClick("searchMainAppButton", nav.search);
        bindClick.addOnClick("timelineMainAppButton", srch.timelineByModTime);
        bindClick.addOnClick("userPreferencesMainAppButton", nav.preferences);
        bindClick.addOnClick("openLoginDlgButton", nav.login);
        bindClick.addOnClick("navLogoutButton", nav.logout);
        bindClick.addOnClick("openSignupPgButton", nav.signup);
    }

    processUrlParams = function(): void {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(function() {
                Factory.createDefault("ChangePasswordDlgImpl", (dlg: ChangePasswordDlg) => {
                    dlg.open();
                }, { "passCode": passCode })
            }, 100);
        }

        meta64.urlCmd = util.getParameterByName("cmd");
    }

    tabChangeEvent = function(tabName): void {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    }

    displaySignupMessage = function(): void {
        var signupResponse = $("#signupCodeResponse").text();
        if (signupResponse === "ok") {
            util.showMessage("Signup complete. You may now login.");
        }
    }

    screenSizeChange = function(): void {
        if (meta64.currentNodeData) {

            if (meta64.currentNode.imgId) {
                render.adjustImageSize(meta64.currentNode);
            }

            $.each(meta64.currentNodeData.children, function(i, node) {
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

    loadAnonPageHome = function(ignoreUrl): void {
        util.json<I.AnonPageLoadRequest, I.AnonPageLoadResponse>("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, meta64.anonPageLoadResponse);
    }

    saveUserPreferences = function(): void {
        util.json<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            //todo-0: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
            "userPreferences": meta64.userPreferences
        });
    }

    openSystemFile = function(fileName: string) {
        util.json<I.OpenSystemFileRequest, I.OpenSystemFileResponse>("openSystemFile", {
            "fileName": fileName
        });
    }

    /* This is a wrapper around System.import, to make future refactoring needs easier, and also make the code a bit cleaner */
    modRun = function(modName: string, callback: Function) {
        System.import("/js/" + modName).then(function(mod) {
            callback(mod);
        });
    }

    clickOnNodeRow = function(rowElm, uid): void {
        nav.clickOnNodeRow(rowElm, uid);
    }

    replyToComment = function(uid: any): void {
        edit.replyToComment(uid);
    }

    openNode = function(uid): void {
        nav.openNode(uid);
    }

    toggleNodeSel = function(uid): void {
        nav.toggleNodeSel(uid);
    }

    createSubNode = function(uid?: any, typeName?: string, createAtTop?: boolean): void {
        edit.createSubNode(uid, typeName, createAtTop);
    }

    insertNode = function(uid?: any, typeName?: string): void {
        edit.insertNode(uid, typeName);
    }

    runEditNode = function(uid: any): void {
        edit.runEditNode(uid);
    }

    moveNodeUp = function(uid?: string): void {
        edit.moveNodeUp();
    }

    moveNodeDown = function(uid?: string): void {
        edit.moveNodeDown();
    }

    clickOnSearchResultRow = function(rowElm, uid) {
        srch.clickOnSearchResultRow(rowElm, uid);
    }

    clickSearchNode = function(uid: string) {
        srch.clickSearchNode(uid);
    }

    //webpack
    // editSystemFile = function(fileName: string) {
    //     new EditSystemFileDlg(fileName).open();
    // }
}

export let meta64: Meta64 = new Meta64();
(window as any).meta64 = meta64;
