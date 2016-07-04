console.log("running module: meta64.js");

/**
 * Main Application instance, and central root level object for all code, although each module generally contributes one
 * singleton variable to the global scope, with a name usually identical to that file.
 */
class Meta64 {

    appInitialized: boolean = false;

    curUrlPath: string = window.location.pathname + window.location.search;

    codeFormatDirty: boolean = false;
    serverMarkdown: boolean = true;

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
    uidToNodeMap: any = {};

    /* Maps from the DOM ID to the editor javascript instance (Ace Editor instance) */
    aceEditorsById: any = {};

    /*
     * maps node.id values to NodeInfo.java objects
     */
    idToNodeMap: any = {};

    /* counter for local uids */
    nextUid: number = 1;

    /*
     * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
     * nextUid as the counter.
     */
    identToUidMap: any = {};

    /*
     * Under any given node, there can be one active 'selected' node that has the highlighting, and will be scrolled
     * to whenever the page with that child is visited, and parentUidToFocusNodeMap holds the map of "parent uid to
     * selected node (NodeInfo object)", where the key is the parent node uid, and the value is the currently
     * selected node within that parent. Note this 'selection state' is only significant on the client, and only for
     * being able to scroll to the node during navigating around on the tree.
     */
    parentUidToFocusNodeMap: any = {};

    /*
     * determines if we should render all the editing buttons on each row
     */
    editMode: boolean = false;

    /* User-selectable user-account options each user can set on his account */
    MODE_ADVANCED: string = "advanced";
    MODE_SIMPLE: string = "simple";

    /* can be 'simple' or 'advanced' */
    editModeOption: string = "simple";

    /*
     * toggled by button, and holds if we are going to show properties or not on each node in the main view
     */
    showProperties: boolean = false;

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

    /* RenderNodeResponse.java object */
    currentNodeData: any = null;

    /*
     * all variables derivable from currentNodeData, but stored directly for simpler code/access
     */
    currentNode: any = null;
    currentNodeUid: any = null;
    currentNodeId: any = null;
    currentNodePath: any = null;

    /* Maps from guid to Data Object */
    dataObjMap: any = {};

    updateMainMenuPanel = () => {
        console.log("building main menu panel");
        menuPanel.build();
        menuPanel.init();
    }

    /*
     * Creates a 'guid' on this object, and makes dataObjMap able to look up the object using that guid in the
     * future.
     */
    registerDataObject = (data) => {
        if (!data.guid) {
            data.guid = ++this.nextGuid;
            this.dataObjMap[data.guid] = data;
        }
    }

    getObjectByGuid = (guid) => {
        var ret = this.dataObjMap[guid];
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
    encodeOnClick = (callback, ctx) => {
        if (typeof callback == "string") {
            return callback;
        } //
        else if (typeof callback == "function") {
            this.registerDataObject(callback);

            if (ctx) {
                this.registerDataObject(ctx);
                return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
            } else {
                return "meta64.runCallback(" + callback.guid + ");";
            }
        }
    }

    runCallback = (guid, ctx) => {
        var dataObj = this.getObjectByGuid(guid);

        // if this is an object, we expect it to have a 'callback' property
        // that is a function
        if (dataObj.callback) {
            dataObj.callback();
        }
        // or else sometimes the registered object itself is the function,
        // which is ok too
        else if (typeof dataObj == 'function') {
            if (ctx) {
                var thiz = this.getObjectByGuid(ctx);
                dataObj.call(thiz);
            } else {
                dataObj();
            }
        } else {
            alert("unable to find callback on registered guid: " + guid);
        }
    }

    inSimpleMode = () => {
        return this.editModeOption === this.MODE_SIMPLE;
    }

    refresh = () => {
        this.goToMainPage(true, true);
    }

    goToMainPage = (rerender?: boolean, forceServerRefresh?: boolean) => {

        if (forceServerRefresh) {
            this.treeDirty = true;
        }

        if (rerender || this.treeDirty) {
            if (this.treeDirty) {
                view.refreshTree(null, true);
            } else {
                render.renderPageFromData();
            }
            this.refreshAllGuiEnablement();
        }
        /*
         * If not re-rendering page (either from server, or from local data, then we just need to litterally switch
         * page into visible, and scroll to node)
         */
        else {
            view.scrollToSelectedNode();
        }
    }

    selectTab = (pageName) => {
        var ironPages = document.querySelector("#mainIronPages");
        (<_HasSelect>ironPages).select(pageName);
    }

    /*
     * If data (if provided) must be the instance data for the current instance of the dialog, and all the dialog
     * methods are of course singletons that accept this data parameter for any opterations. (oldschool way of doing
     * OOP with 'this' being first parameter always).
     *
     * Note: each data instance is required to have a guid numberic property, unique to it.
     *
     */
    changePage = (pg?: any, data?: any) => {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }

        /* this is the same as setting using mainIronPages?? */
        var paperTabs = document.querySelector("#mainPaperTabs");
        (<_HasSelect>paperTabs).select(pg.tabId);
    }

    isNodeBlackListed = (node) => {
        if (!this.inSimpleMode())
            return false;

        var prop;
        for (prop in this.simpleModeNodePrefixBlackList) {
            if (this.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                return true;
            }
        }

        return false;
    }

    getSelectedNodeUidsArray = () => {
        var selArray = [], idx = 0, uid;

        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = uid;
            }
        }
        return selArray;
    }

    getSelectedNodeIdsArray = () => {
        var selArray = [], idx = 0, uid;

        if (!this.selectedNodes) {
            console.log("no selected nodes.");
        } else {
            console.log("selectedNode count: " + util.getPropertyCount(this.selectedNodes));
        }

        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                var node = this.uidToNodeMap[uid];
                if (!node) {
                    console.log("unable to find uidToNodeMap for uid=" + uid);
                } else {
                    selArray[idx++] = node.id;
                }
            }
        }
        return selArray;
    }

    /* Gets selected nodes as NodeInfo.java objects array */
    getSelectedNodesArray = () => {
        var selArray = [], idx = 0, uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = this.uidToNodeMap[uid];
            }
        }
        return selArray;
    }

    clearSelectedNodes = () => {
        this.selectedNodes = {};
    }

    updateNodeInfoResponse = (res, node) => {
        var ownerBuf = '';
        var mine = false;

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

    updateNodeInfo = (node) => {
        var ironRes = util.json("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        });

        var thiz = this;
        ironRes.completes.then(function() {
            thiz.updateNodeInfoResponse(ironRes.response, node);
        });
    }

    /* Returns the node with the given node.id value */
    getNodeFromId = (id) => {
        return this.idToNodeMap[id];
    }

    getPathOfUid = (uid) => {
        var node = this.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        } else {
            return node.path;
        }
    }

    getHighlightedNode = () => {
        var ret = this.parentUidToFocusNodeMap[this.currentNodeUid];
        return ret;
    }

    highlightRowById = (id, scroll) => {
        var node = this.getNodeFromId(id);
        if (node) {
            this.highlightNode(node, scroll);
        } else {
            console.log("highlightRowById failed to find id: " + id);
        }
    }

    /*
     * Important: We want this to be the only method that can set values on 'parentUidToFocusNodeMap', and always
     * setting that value should go thru this function.
     */
    highlightNode = (node, scroll) => {
        if (!node)
            return;

        var doneHighlighting = false;

        /* Unhighlight currently highlighted node if any */
        var curHighlightedNode = this.parentUidToFocusNodeMap[this.currentNodeUid];
        if (curHighlightedNode) {
            if (curHighlightedNode.uid === node.uid) {
                // console.log("already highlighted.");
                doneHighlighting = true;
            } else {
                var rowElmId = curHighlightedNode.uid + "_row";
                var rowElm = $("#" + rowElmId);
                util.changeOrAddClass(rowElm, "active-row", "inactive-row");
            }
        }

        if (!doneHighlighting) {
            this.parentUidToFocusNodeMap[this.currentNodeUid] = node;

            var rowElmId = node.uid + "_row";
            var rowElm = $("#" + rowElmId);
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
    refreshAllGuiEnablement = () => {

        /* multiple select nodes */
        var selNodeCount = util.getPropertyCount(this.selectedNodes);
        var highlightNode = this.getHighlightedNode();
        var selNodeIsMine = highlightNode != null && highlightNode.createdBy === meta64.userName;

        util.setEnablement("navLogoutButton", !this.isAnonUser);
        util.setEnablement("openSignupPgButton", this.isAnonUser);
        util.setEnablement("openExportDlg", this.isAdminUser);
        util.setEnablement("openImportDlg", this.isAdminUser);

        var propsToggle = this.currentNode && !this.isAnonUser;
        util.setEnablement("propsToggleButton", propsToggle);

        var allowEditMode = this.currentNode && !this.isAnonUser;

        util.setEnablement("editModeButton", allowEditMode);
        util.setEnablement("upLevelButton", this.currentNode && nav.parentVisibleToUser());
        util.setEnablement("moveSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("deleteSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("clearSelectionsButton", !this.isAnonUser && selNodeCount > 0);
        util.setEnablement("moveSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("finishMovingSelNodesButton", !this.isAnonUser && edit.nodesToMove != null && selNodeIsMine);

        util.setEnablement("changePasswordPgButton", !this.isAnonUser);
        util.setEnablement("accountPreferencesButton", !this.isAnonUser);
        util.setEnablement("manageAccountButton", !this.isAnonUser);
        util.setEnablement("insertBookWarAndPeaceButton", this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
        util.setEnablement("uploadFromFileButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("uploadFromUrlButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);

        util.setEnablement("deleteAttachmentsButton", !this.isAnonUser && highlightNode != null
            && highlightNode.hasBinary && selNodeIsMine);
        util.setEnablement("editNodeSharingButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("renameNodePgButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("searchDlgButton", !this.isAnonUser && highlightNode != null);
        util.setEnablement("timelineButton", !this.isAnonUser && highlightNode != null);
        util.setEnablement("showServerInfoButton", this.isAdminUser);
        util.setEnablement("showFullNodeUrlButton", highlightNode != null);
        util.setEnablement("refreshPageButton", !this.isAnonUser);
        util.setEnablement("findSharedNodesButton", !this.isAnonUser && highlightNode != null);

        util.setVisibility("openImportDlg", this.isAdminUser && selNodeIsMine);
        util.setVisibility("openExportDlg", this.isAdminUser && selNodeIsMine);
        util.setVisibility("navHomeButton", !this.isAnonUser);
        util.setVisibility("editModeButton", allowEditMode);
        util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setVisibility("insertBookWarAndPeaceButton", this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
        util.setVisibility("propsToggleButton", !this.isAnonUser);
        util.setVisibility("openLoginDlgButton", this.isAnonUser);
        util.setVisibility("navLogoutButton", !this.isAnonUser);
        util.setVisibility("openSignupPgButton", this.isAnonUser);

        Polymer.dom.flush(); // <---- is this needed ? todo-3
        Polymer.updateStyles();
    }

    getSingleSelectedNode = () => {
        var uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                // console.log("found a single Sel NodeID: " + nodeId);
                return this.uidToNodeMap[uid];
            }
        }
        return null;
    }

    /* node = NodeInfo.java object */
    getOrdinalOfNode = (node) => {
        if (!this.currentNodeData || !this.currentNodeData.children)
            return -1;

        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            if (node.id === this.currentNodeData.children[i].id) {
                return i;
            }
        }
        return -1;
    }

    setCurrentNodeData = (data) => {
        this.currentNodeData = data;
        this.currentNode = data.node;
        this.currentNodeUid = data.node.uid;
        this.currentNodeId = data.node.id;
        this.currentNodePath = data.node.path;
    }

    anonPageLoadResponse = (res) => {

        if (res.renderNodeResponse) {

            util.setVisibility("mainNodeContent", true);

            render.renderPageFromData(res.renderNodeResponse);

            this.refreshAllGuiEnablement();
        } else {
            util.setVisibility("mainNodeContent", false);

            console.log("setting listview to: " + res.content);
            util.setHtmlEnhanced("listView", res.content);
        }
        render.renderMainPageControls();
    }

    removeBinaryByUid = (uid) => {
        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            var node = this.currentNodeData.children[i];
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
    initNode = (node) => {
        if (!node) {
            console.log("initNode has null node");
            return;
        }
        /*
         * assign a property for detecting this node type, I'll do this instead of using some kind of custom JS
         * prototype-related approach
         */
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        node.properties = props.getPropertiesInEditingOrder(node.properties);

        /*
         * For these two properties that are accessed frequently we go ahead and lookup the properties in the
         * property array, and assign them directly as node object properties so to improve performance, and also
         * simplify code.
         */
        node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);

        this.uidToNodeMap[node.uid] = node;
        this.idToNodeMap[node.id] = node;
    }

    initConstants = () => {
        util.addAll(this.simpleModePropertyBlackList, [ //
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

        util.addAll(this.readOnlyPropertyList, [ //
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

        util.addAll(this.binaryPropertyList, [jcrCnst.BIN_DATA]);
    }

    /* todo-0: this and every other method that's called by a litstener or a timer needs to have the 'fat arrow' syntax for this */
    initApp = () => {
        console.log("initApp running.");

        if (this.appInitialized)
            return;

        this.appInitialized = true;

        var tabs = util.poly("mainIronPages");
        var thiz = this;
        tabs.addEventListener("iron-select", function() {
            thiz.tabChangeEvent(tabs.selected);
        });

        this.initConstants();
        this.displaySignupMessage();

        /*
         * todo-3: how does orientationchange need to work for polymer? Polymer disabled
         * $(window).on("orientationchange", _.orientationHandler);
         */

        $(window).bind("beforeunload", function() {
            return "Leave Meta64 ?";
        });

        /*
         * I thought this was a good idea, but actually it destroys the session, when the user is entering an
         * "id=\my\path" type of url to open a specific node. Need to rethink this. Basically for now I'm thinking
         * going to a different url shouldn't blow up the session, which is what 'logout' does.
         *
         * $(window).on("unload", function() { user.logout(false); });
         */

        this.deviceWidth = $(window).width();
        this.deviceHeight = $(window).height();

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

        this.updateMainMenuPanel();
        this.refreshAllGuiEnablement();

        util.initProgressMonitor();

        this.processUrlParams();
    }

    processUrlParams = () => {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(function() {
                (new ChangePasswordDlg(passCode)).open();
            }, 100);
        }
    }

    tabChangeEvent = (tabName) => {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    }

    displaySignupMessage = () => {
        var signupResponse = $("#signupCodeResponse").text();
        if (signupResponse === "ok") {
            (new MessageDlg("Signup complete. You may now login.")).open();
        }
    }

    screenSizeChange = () => {
        if (this.currentNodeData) {

            if (meta64.currentNode.imgId) {
                render.adjustImageSize(meta64.currentNode);
            }

            $.each(this.currentNodeData.children, function(i, node) {
                if (node.imgId) {
                    render.adjustImageSize(node);
                }
            });
        }
    }

    /* Don't need this method yet, and haven't tested to see if works */
    orientationHandler = (event) => {
        // if (event.orientation) {
        // if (event.orientation === 'portrait') {
        // } else if (event.orientation === 'landscape') {
        // }
        // }
    }

    loadAnonPageHome = (ignoreUrl) => {
        util.json("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, this.anonPageLoadResponse, this);
    }
}

if (!window["meta64"]) {
    var meta64: Meta64 = new Meta64();
}
