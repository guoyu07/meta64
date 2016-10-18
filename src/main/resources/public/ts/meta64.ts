console.log("running module: meta64.js");

/**
 * Main Application instance, and central root level object for all code, although each module generally contributes one
 * singleton variable to the global scope, with a name usually identical to that file.
 */
namespace m64 {
    export namespace meta64 {

        export let appInitialized: boolean = false;

        export let curUrlPath: string = window.location.pathname + window.location.search;
        export let urlCmd: string;
        export let homeNodeOverride: string;

        export let codeFormatDirty: boolean = false;
        export let serverMarkdown: boolean = true;

        /* used as a kind of 'sequence' in the app, when unique vals a needed */
        export let nextGuid: number = 0;

        /* name of currently logged in user */
        export let userName: string = "anonymous";

        /* screen capabilities */
        export let deviceWidth: number = 0;
        export let deviceHeight: number = 0;

        /*
         * User's root node. Top level of what logged in user is allowed to see.
         */
        export let homeNodeId: string = "";
        export let homeNodePath: string = "";

        /*
         * specifies if this is admin user.
         */
        export let isAdminUser: boolean = false;

        /* always start out as anon user until login */
        export let isAnonUser: boolean = true;
        export let anonUserLandingPageNode: any = null;
        export let allowFileSystemSearch: boolean = false;

        /*
         * signals that data has changed and the next time we go to the main tree view window we need to refresh data
         * from the server
         */
        export let treeDirty: boolean = false;

        /*
         * maps node.uid values to NodeInfo.java objects
         *
         * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
         * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
         * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
         */
        export let uidToNodeMap: { [key: string]: json.NodeInfo } = {};

        /*
         * maps node.id values to NodeInfo.java objects
         */
        export let idToNodeMap: { [key: string]: json.NodeInfo } = {};

        /* Maps from the DOM ID to the editor javascript instance (Ace Editor instance) */
        export let aceEditorsById: any = {};

        /* counter for local uids */
        export let nextUid: number = 1;

        /*
         * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
         * nextUid as the counter.
         */
        export let identToUidMap: { [key: string]: string } = {};

        /*
         * Under any given node, there can be one active 'selected' node that has the highlighting, and will be scrolled
         * to whenever the page with that child is visited, and parentUidToFocusNodeMap holds the map of "parent uid to
         * selected node (NodeInfo object)", where the key is the parent node uid, and the value is the currently
         * selected node within that parent. Note this 'selection state' is only significant on the client, and only for
         * being able to scroll to the node during navigating around on the tree.
         */
        export let parentUidToFocusNodeMap: { [key: string]: json.NodeInfo } = {};

        /* User-selectable user-account options each user can set on his account */
        export let MODE_ADVANCED: string = "advanced";
        export let MODE_SIMPLE: string = "simple";

        /* can be 'simple' or 'advanced' */
        export let editModeOption: string = "simple";

        /*
         * toggled by button, and holds if we are going to show properties or not on each node in the main view
         */
        export let showProperties: boolean = false;

        /* Flag that indicates if we are rendering path, owner, modTime, etc. on each row */
        export let showMetaData: boolean = false;

        /*
         * List of node prefixes to flag nodes to not allow to be shown in the page in simple mode
         */
        export let simpleModeNodePrefixBlackList: any = {
            "rep:": true
        };

        export let simpleModePropertyBlackList: any = {};

        export let readOnlyPropertyList: any = {};

        export let binaryPropertyList: any = {};

        /*
         * maps all node uids to true if selected, otherwise the property should be deleted (not existing)
         */
        export let selectedNodes: any = {};

        /* Set of all nodes that have been expanded (from the abbreviated form) */
        export let expandedAbbrevNodeIds: any = {};

        /* RenderNodeResponse.java object */
        export let currentNodeData: any = null;

        /*
         * all variables derivable from currentNodeData, but stored directly for simpler code/access
         */
        export let currentNode: json.NodeInfo = null;
        export let currentNodeUid: any = null;
        export let currentNodeId: any = null;
        export let currentNodePath: any = null;

        /* Maps from guid to Data Object */
        export let dataObjMap: any = {};

        export let userPreferences: json.UserPreferences = {
            "editMode": false,
            "advancedMode": false,
            "lastNode": "",
            "importAllowed": false,
            "exportAllowed": false,
            "showMetaData": false
        };

        export let updateMainMenuPanel = function() {
            console.log("building main menu panel");
            menuPanel.build();
            menuPanel.init();
        }

        /*
         * Creates a 'guid' on this object, and makes dataObjMap able to look up the object using that guid in the
         * future.
         */
        export let registerDataObject = function(data) {
            if (!data.guid) {
                data.guid = ++nextGuid;
                dataObjMap[data.guid] = data;
            }
        }

        export let getObjectByGuid = function(guid) {
            var ret = dataObjMap[guid];
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
         */
        export let encodeOnClick = function(callback: any, ctx?: any) {
            if (typeof callback == "string") {
                return callback;
            } //
            else if (typeof callback == "function") {
                registerDataObject(callback);

                if (ctx) {
                    registerDataObject(ctx);
                    return "m64.meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
                } else {
                    return "m64.meta64.runCallback(" + callback.guid + ");";
                }
            }
            else {
                throw "unexpected callback type in encodeOnClick";
            }
        }

        export let runCallback = function(guid, ctx) {
            var dataObj = getObjectByGuid(guid);

            // if this is an object, we expect it to have a 'callback' property
            // that is a function
            if (dataObj.callback) {
                dataObj.callback();
            }
            // or else sometimes the registered object itself is the function,
            // which is ok too
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = getObjectByGuid(ctx);
                    dataObj.call(thiz);
                } else {
                    dataObj();
                }
            } else {
                throw "unable to find callback on registered guid: " + guid;
            }
        }

        export let inSimpleMode = function(): boolean {
            return editModeOption === MODE_SIMPLE;
        }

        export let refresh = function(): void {
            goToMainPage(true, true);
        }

        export let goToMainPage = function(rerender?: boolean, forceServerRefresh?: boolean): void {

            if (forceServerRefresh) {
                treeDirty = true;
            }

            if (rerender || treeDirty) {
                if (treeDirty) {
                    view.refreshTree(null, true);
                } else {
                    render.renderPageFromData();
                    refreshAllGuiEnablement();
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

        export let selectTab = function(pageName): void {
            var ironPages = document.querySelector("#mainIronPages");
            (<_HasSelect>ironPages).select(pageName);

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
        export let changePage = function(pg?: any, data?: any) {
            if (typeof pg.tabId === 'undefined') {
                console.log("oops, wrong object type passed to changePage function.");
                return null;
            }

            /* this is the same as setting using mainIronPages?? */
            var paperTabs = document.querySelector("#mainIronPages"); //"#mainPaperTabs");
            (<_HasSelect>paperTabs).select(pg.tabId);
        }

        export let isNodeBlackListed = function(node): boolean {
            if (!inSimpleMode())
                return false;

            let prop;
            for (prop in simpleModeNodePrefixBlackList) {
                if (simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                    return true;
                }
            }

            return false;
        }

        export let getSelectedNodeUidsArray = function(): string[] {
            var selArray = [], idx = 0, uid;

            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uid;
                }
            }
            return selArray;
        }

        export let getSelectedNodeIdsArray = function(): string[] {
            var selArray = [], idx = 0, uid;

            if (!selectedNodes) {
                console.log("no selected nodes.");
            } else {
                console.log("selectedNode count: " + util.getPropertyCount(selectedNodes));
            }

            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    let node: json.NodeInfo = uidToNodeMap[uid];
                    if (!node) {
                        console.log("unable to find uidToNodeMap for uid=" + uid);
                    } else {
                        selArray[idx++] = node.id;
                    }
                }
            }
            return selArray;
        }

        /* return an object with properties for each NodeInfo where the key is the id */
        export let getSelectedNodesAsMapById = function(): Object {
            let ret: Object = {};
            let selArray: json.NodeInfo[] = this.getSelectedNodesArray();
            for (var i = 0; i < selArray.length; i++) {
                ret[selArray[i].id] = selArray[i];
            }
            return ret;
        }

        /* Gets selected nodes as NodeInfo.java objects array */
        export let getSelectedNodesArray = function(): json.NodeInfo[] {
            let selArray: json.NodeInfo[] = [];
            let idx: number = 0;
            let uid: string = "";
            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uidToNodeMap[uid];
                }
            }
            return selArray;
        }

        export let clearSelectedNodes = function() {
            selectedNodes = {};
        }

        export let updateNodeInfoResponse = function(res, node) {
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
                var elm = $("#ownerDisplay" + node.uid);
                elm.html(" (Manager: " + ownerBuf + ")");
                if (mine) {
                    util.changeOrAddClass(elm, "created-by-other", "created-by-me");
                } else {
                    util.changeOrAddClass(elm, "created-by-me", "created-by-other");
                }
            }
        }

        export let updateNodeInfo = function(node: json.NodeInfo) {
            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": node.id,
                "includeAcl": false,
                "includeOwners": true
            }, function(res: json.GetNodePrivilegesResponse) {
                updateNodeInfoResponse(res, node);
            });
        }

        /* Returns the node with the given node.id value */
        export let getNodeFromId = function(id: string): json.NodeInfo {
            return idToNodeMap[id];
        }

        export let getPathOfUid = function(uid: string): string {
            let node: json.NodeInfo = uidToNodeMap[uid];
            if (!node) {
                return "[path error. invalid uid: " + uid + "]";
            } else {
                return node.path;
            }
        }

        export let getHighlightedNode = function(): json.NodeInfo {
            let ret: json.NodeInfo = parentUidToFocusNodeMap[currentNodeUid];
            return ret;
        }

        export let highlightRowById = function(id, scroll): void {
            var node: json.NodeInfo = getNodeFromId(id);
            if (node) {
                highlightNode(node, scroll);
            } else {
                console.log("highlightRowById failed to find id: " + id);
            }
        }

        /*
         * Important: We want this to be the only method that can set values on 'parentUidToFocusNodeMap', and always
         * setting that value should go thru this function.
         */
        export let highlightNode = function(node: json.NodeInfo, scroll: boolean): void {
            if (!node)
                return;

            let doneHighlighting: boolean = false;

            /* Unhighlight currently highlighted node if any */
            let curHighlightedNode: json.NodeInfo = parentUidToFocusNodeMap[currentNodeUid];
            if (curHighlightedNode) {
                if (curHighlightedNode.uid === node.uid) {
                    // console.log("already highlighted.");
                    doneHighlighting = true;
                } else {
                    let rowElmId = curHighlightedNode.uid + "_row";
                    let rowElm = $("#" + rowElmId);
                    util.changeOrAddClass(rowElm, "active-row", "inactive-row");
                }
            }

            if (!doneHighlighting) {
                parentUidToFocusNodeMap[currentNodeUid] = node;

                let rowElmId: string = node.uid + "_row";
                let rowElm: string = $("#" + rowElmId);
                if (!rowElm || rowElm.length == 0) {
                    console.log("Unable to find rowElement to highlight: " + rowElmId);
                }
                util.changeOrAddClass(rowElm, "inactive-row", "active-row");
            }

            if (scroll) {
                view.scrollToSelectedNode();
            }
        }

        /*
         * Really need to use pub/sub event to broadcast enablement, and let each component do this independently and
         * decouple
         */
        export let refreshAllGuiEnablement = function() {
            /* multiple select nodes */
            let selNodeCount: number = util.getPropertyCount(selectedNodes);
            let highlightNode: json.NodeInfo = getHighlightedNode();
            let selNodeIsMine: boolean = highlightNode && (highlightNode.createdBy === userName || "admin" === userName);
            //console.log("homeNodeId="+meta64.homeNodeId+" highlightNode.id="+highlightNode.id);
            let homeNodeSelected: boolean = highlightNode && homeNodeId == highlightNode.id;
            let importAllowed = isAdminUser || userPreferences.importAllowed;
            let exportAllowed = isAdminUser || userPreferences.exportAllowed;
            let highlightOrdinal: number = getOrdinalOfNode(highlightNode);
            let numChildNodes: number = getNumChildNodes();
            let canMoveUp: boolean = highlightOrdinal > 0 && numChildNodes > 1;
            let canMoveDown: boolean = highlightOrdinal < numChildNodes - 1 && numChildNodes > 1;

            console.log("enablement: isAnonUser=" + isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);

            util.setEnablement("navLogoutButton", !isAnonUser);
            util.setEnablement("openSignupPgButton", isAnonUser);
            util.setEnablement("openExportDlg", exportAllowed);
            util.setEnablement("openImportDlg", importAllowed);

            let propsToggle: boolean = currentNode && !isAnonUser;
            util.setEnablement("propsToggleButton", propsToggle);

            let allowEditMode: boolean = currentNode && !isAnonUser;

            util.setEnablement("editModeButton", allowEditMode);
            util.setEnablement("upLevelButton", currentNode && nav.parentVisibleToUser());
            util.setEnablement("moveSelNodesButton", !isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("deleteSelNodesButton", !isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("clearSelectionsButton", !isAnonUser && selNodeCount > 0);
            util.setEnablement("moveSelNodesButton", !isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("finishMovingSelNodesButton", !isAnonUser && edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));

            util.setEnablement("moveNodeUpButton", canMoveUp);
            util.setEnablement("moveNodeDownButton", canMoveDown);
            util.setEnablement("moveNodeToTopButton", canMoveUp);
            util.setEnablement("moveNodeToBottomButton", canMoveDown);

            util.setEnablement("changePasswordPgButton", !isAnonUser);
            util.setEnablement("accountPreferencesButton", !isAnonUser);
            util.setEnablement("manageAccountButton", !isAnonUser);
            util.setEnablement("insertBookWarAndPeaceButton", isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
            util.setEnablement("generateRSSButton", isAdminUser);
            util.setEnablement("uploadFromFileButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("uploadFromUrlButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("deleteAttachmentsButton", !isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            util.setEnablement("editNodeSharingButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("renameNodePgButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("contentSearchDlgButton", !isAnonUser && highlightNode != null);
            util.setEnablement("tagSearchDlgButton", !isAnonUser && highlightNode != null);
            util.setEnablement("fileSearchDlgButton", !isAnonUser && allowFileSystemSearch);
            util.setEnablement("timelineButton", !isAnonUser && highlightNode != null);
            util.setEnablement("searchMainAppButton", !isAnonUser && highlightNode != null);
            util.setEnablement("timelineMainAppButton", !isAnonUser && highlightNode != null);
            util.setEnablement("showServerInfoButton", isAdminUser);
            util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            util.setEnablement("refreshPageButton", !isAnonUser);
            util.setEnablement("findSharedNodesButton", !isAnonUser && highlightNode != null);
            util.setEnablement("userPreferencesMainAppButton", !isAnonUser);

            util.setEnablement("adminMenu", isAdminUser);

            //VISIBILITY

            util.setVisibility("openImportDlg", importAllowed && selNodeIsMine);
            util.setVisibility("openExportDlg", exportAllowed && selNodeIsMine);
            util.setVisibility("navHomeButton", !isAnonUser);
            util.setVisibility("editModeButton", allowEditMode);
            util.setVisibility("upLevelButton", currentNode && nav.parentVisibleToUser());
            util.setVisibility("insertBookWarAndPeaceButton", isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
            util.setVisibility("generateRSSButton", isAdminUser);
            util.setVisibility("propsToggleButton", !isAnonUser);
            util.setVisibility("openLoginDlgButton", isAnonUser);
            util.setVisibility("navLogoutButton", !isAnonUser);
            util.setVisibility("openSignupPgButton", isAnonUser);
            util.setVisibility("searchMainAppButton", !isAnonUser && highlightNode != null);
            util.setVisibility("timelineMainAppButton", !isAnonUser && highlightNode != null);
            util.setVisibility("userPreferencesMainAppButton", !isAnonUser);
            util.setVisibility("fileSearchDlgButton", !isAnonUser && allowFileSystemSearch);

            util.setVisibility("adminMenu", isAdminUser);

            Polymer.dom.flush(); // <---- is this needed ? todo-3
            Polymer.updateStyles();
        }

        export let getSingleSelectedNode = function(): json.NodeInfo {
            let uid: string;
            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    // console.log("found a single Sel NodeID: " + nodeId);
                    return uidToNodeMap[uid];
                }
            }
            return null;
        }

        export let getOrdinalOfNode = function(node: json.NodeInfo): number {
            if (!currentNodeData || !currentNodeData.children)
                return -1;

            for (var i = 0; i < currentNodeData.children.length; i++) {
                if (node.id === currentNodeData.children[i].id) {
                    return i;
                }
            }
            return -1;
        }

        export let getNumChildNodes = function(): number {
            if (!currentNodeData || !currentNodeData.children)
                return 0;

            return currentNodeData.children.length;
        }

        export let setCurrentNodeData = function(data): void {
            currentNodeData = data;
            currentNode = data.node;
            currentNodeUid = data.node.uid;
            currentNodeId = data.node.id;
            currentNodePath = data.node.path;
        }

        export let anonPageLoadResponse = function(res: json.AnonPageLoadResponse): void {

            if (res.renderNodeResponse) {

                util.setVisibility("mainNodeContent", true);

                render.renderPageFromData(res.renderNodeResponse);

                refreshAllGuiEnablement();
            } else {
                util.setVisibility("mainNodeContent", false);

                console.log("setting listview to: " + res.content);
                util.setHtml("listView", res.content);
            }
        }

        export let removeBinaryByUid = function(uid): void {
            for (var i = 0; i < currentNodeData.children.length; i++) {
                let node: json.NodeInfo = currentNodeData.children[i];
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
        export let initNode = function(node: json.NodeInfo, updateMaps?: boolean): void {
            if (!node) {
                console.log("initNode has null node");
                return;
            }
            /*
             * assign a property for detecting this node type, I'll do this instead of using some kind of custom JS
             * prototype-related approach
             */
            node.uid = updateMaps ? util.getUidForId(identToUidMap, node.id) : identToUidMap[node.id];
            node.properties = props.getPropertiesInEditingOrder(node.properties);

            /*
             * For these two properties that are accessed frequently we go ahead and lookup the properties in the
             * property array, and assign them directly as node object properties so to improve performance, and also
             * simplify code.
             */
            node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            node.lastModified = new Date(props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node));

            if (updateMaps) {
                uidToNodeMap[node.uid] = node;
                idToNodeMap[node.id] = node;
            }
        }

        export let initConstants = function() {
            util.addAll(simpleModePropertyBlackList, [ //
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

            util.addAll(readOnlyPropertyList, [ //
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

            util.addAll(binaryPropertyList, [jcrCnst.BIN_DATA]);
        }

        /* todo-0: this and every other method that's called by a litstener or a timer needs to have the 'fat arrow' syntax for this */
        export let initApp = function(): void {
            console.log("initApp running.");

            if (appInitialized)
                return;

            appInitialized = true;

            var tabs = util.poly("mainIronPages");
            tabs.addEventListener("iron-select", function() {
                tabChangeEvent(tabs.selected);
            });

            initConstants();
            displaySignupMessage();

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

            deviceWidth = $(window).width();
            deviceHeight = $(window).height();

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
             *
             * setInterval(function() { var width = $(window).width();
             *
             * if (width != _.deviceWidth) { // console.log("Screen width changed: " + width);
             *
             * _.deviceWidth = width; _.deviceHeight = $(window).height();
             *
             * _.screenSizeChange(); } }, 1500);
             */

            updateMainMenuPanel();
            refreshAllGuiEnablement();

            util.initProgressMonitor();

            processUrlParams();
        }

        export let processUrlParams = function(): void {
            var passCode = util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function() {
                    (new ChangePasswordDlg(passCode)).open();
                }, 100);
            }

            urlCmd = util.getParameterByName("cmd");
        }

        export let tabChangeEvent = function(tabName): void {
            if (tabName == "searchTabName") {
                srch.searchTabActivated();
            }
        }

        export let displaySignupMessage = function(): void {
            var signupResponse = $("#signupCodeResponse").text();
            if (signupResponse === "ok") {
                (new MessageDlg("Signup complete. You may now login.")).open();
            }
        }

        export let screenSizeChange = function(): void {
            if (currentNodeData) {

                if (currentNode.imgId) {
                    render.adjustImageSize(currentNode);
                }

                $.each(currentNodeData.children, function(i, node) {
                    if (node.imgId) {
                        render.adjustImageSize(node);
                    }
                });
            }
        }

        /* Don't need this method yet, and haven't tested to see if works */
        export let orientationHandler = function(event): void {
            // if (event.orientation) {
            // if (event.orientation === 'portrait') {
            // } else if (event.orientation === 'landscape') {
            // }
            // }
        }

        export let loadAnonPageHome = function(ignoreUrl): void {
            util.json<json.AnonPageLoadRequest, json.AnonPageLoadResponse>("anonPageLoad", {
                "ignoreUrl": ignoreUrl
            }, anonPageLoadResponse);
        }

        export let saveUserPreferences = function(): void {
            util.json<json.SaveUserPreferencesRequest, json.SaveUserPreferencesResponse>("saveUserPreferences", {
                //todo-0: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
                "userPreferences": userPreferences
            });
        }

        export let openSystemFile = function(fileName: string) {
            util.json<json.OpenSystemFileRequest, json.OpenSystemFileResponse>("openSystemFile", {
                "fileName": fileName
            });
        }
    }
}

/* todo-0: for now I'll just drop this into a global variable. I know there's a better way. This is the only variable
we have on the global namespace, and is only required for application initialization in JS on the index.html page */
if (!window["meta64"]) {
    var meta64 = m64.meta64;
}
