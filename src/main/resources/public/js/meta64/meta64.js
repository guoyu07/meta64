console.log("running module: meta64.js");
var Meta64 = (function () {
    function Meta64() {
        this.appInitialized = false;
        this.curUrlPath = window.location.pathname + window.location.search;
        this.codeFormatDirty = false;
        this.serverMarkdown = true;
        this.nextGuid = 0;
        this.userName = "anonymous";
        this.deviceWidth = 0;
        this.deviceHeight = 0;
        this.homeNodeId = "";
        this.homeNodePath = "";
        this.isAdminUser = false;
        this.isAnonUser = true;
        this.anonUserLandingPageNode = null;
        this.treeDirty = false;
        this.uidToNodeMap = {};
        this.aceEditorsById = {};
        this.idToNodeMap = {};
        this.nextUid = 1;
        this.identToUidMap = {};
        this.parentUidToFocusNodeMap = {};
        this.editMode = false;
        this.MODE_ADVANCED = "advanced";
        this.MODE_SIMPLE = "simple";
        this.editModeOption = "simple";
        this.showProperties = false;
        this.simpleModeNodePrefixBlackList = {
            "rep:": true
        };
        this.simpleModePropertyBlackList = {};
        this.readOnlyPropertyList = {};
        this.binaryPropertyList = {};
        this.selectedNodes = {};
        this.currentNodeData = null;
        this.currentNode = null;
        this.currentNodeUid = null;
        this.currentNodeId = null;
        this.currentNodePath = null;
        this.dataObjMap = {};
    }
    Meta64.prototype.updateMainMenuPanel = function () {
        console.log("building main menu panel");
        menuPanel.build();
        menuPanel.init();
    };
    Meta64.prototype.registerDataObject = function (data) {
        if (!data.guid) {
            data.guid = ++this.nextGuid;
            this.dataObjMap[data.guid] = data;
        }
    };
    Meta64.prototype.getObjectByGuid = function (guid) {
        var ret = this.dataObjMap[guid];
        if (!ret) {
            console.log("data object not found: guid=" + guid);
        }
        return ret;
    };
    Meta64.prototype.encodeOnClick = function (callback, ctx) {
        if (typeof callback == "string") {
            return callback;
        }
        else if (typeof callback == "function") {
            this.registerDataObject(callback);
            if (ctx) {
                this.registerDataObject(ctx);
                return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
            }
            else {
                return "meta64.runCallback(" + callback.guid + ");";
            }
        }
    };
    Meta64.prototype.runCallback = function (guid, ctx) {
        var dataObj = this.getObjectByGuid(guid);
        if (dataObj.callback) {
            dataObj.callback();
        }
        else if (typeof dataObj == 'function') {
            if (ctx) {
                var thiz = this.getObjectByGuid(ctx);
                dataObj.call(thiz);
            }
            else {
                dataObj();
            }
        }
        else {
            alert("unable to find callback on registered guid: " + guid);
        }
    };
    Meta64.prototype.inSimpleMode = function () {
        return this.editModeOption === this.MODE_SIMPLE;
    };
    Meta64.prototype.refresh = function () {
        this.goToMainPage(true, true);
    };
    Meta64.prototype.goToMainPage = function (rerender, forceServerRefresh) {
        if (forceServerRefresh) {
            this.treeDirty = true;
        }
        if (rerender || this.treeDirty) {
            if (this.treeDirty) {
                view.refreshTree(null, true);
            }
            else {
                render.renderPageFromData();
            }
            this.refreshAllGuiEnablement();
        }
        else {
            view.scrollToSelectedNode();
        }
    };
    Meta64.prototype.selectTab = function (pageName) {
        var ironPages = document.querySelector("#mainIronPages");
        ironPages.select(pageName);
    };
    Meta64.prototype.changePage = function (pg, data) {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }
        var paperTabs = document.querySelector("#mainPaperTabs");
        paperTabs.select(pg.tabId);
    };
    Meta64.prototype.isNodeBlackListed = function (node) {
        if (!this.inSimpleMode())
            return false;
        var prop;
        for (prop in this.simpleModeNodePrefixBlackList) {
            if (this.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                return true;
            }
        }
        return false;
    };
    Meta64.prototype.getSelectedNodeUidsArray = function () {
        var selArray = [], idx = 0, uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = uid;
            }
        }
        return selArray;
    };
    Meta64.prototype.getSelectedNodeIdsArray = function () {
        var selArray = [], idx = 0, uid;
        if (!this.selectedNodes) {
            console.log("no selected nodes.");
        }
        else {
            console.log("selectedNode count: " + util.getPropertyCount(this.selectedNodes));
        }
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                var node = this.uidToNodeMap[uid];
                if (!node) {
                    console.log("unable to find uidToNodeMap for uid=" + uid);
                }
                else {
                    selArray[idx++] = node.id;
                }
            }
        }
        return selArray;
    };
    Meta64.prototype.getSelectedNodesArray = function () {
        var selArray = [], idx = 0, uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = this.uidToNodeMap[uid];
            }
        }
        return selArray;
    };
    Meta64.prototype.clearSelectedNodes = function () {
        this.selectedNodes = {};
    };
    Meta64.prototype.updateNodeInfoResponse = function (res, node) {
        var ownerBuf = '';
        var mine = false;
        if (res.owners) {
            $.each(res.owners, function (index, owner) {
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
            }
            else {
                util.changeOrAddClass(elm, "created-by-me", "created-by-other");
            }
        }
    };
    Meta64.prototype.updateNodeInfo = function (node) {
        var ironRes = util.json("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.updateNodeInfoResponse(ironRes.response, node);
        });
    };
    Meta64.prototype.getNodeFromId = function (id) {
        return this.idToNodeMap[id];
    };
    Meta64.prototype.getPathOfUid = function (uid) {
        var node = this.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        }
        else {
            return node.path;
        }
    };
    Meta64.prototype.getHighlightedNode = function () {
        var ret = this.parentUidToFocusNodeMap[this.currentNodeUid];
        return ret;
    };
    Meta64.prototype.highlightRowById = function (id, scroll) {
        var node = this.getNodeFromId(id);
        if (node) {
            this.highlightNode(node, scroll);
        }
        else {
            console.log("highlightRowById failed to find id: " + id);
        }
    };
    Meta64.prototype.highlightNode = function (node, scroll) {
        if (!node)
            return;
        var doneHighlighting = false;
        var curHighlightedNode = this.parentUidToFocusNodeMap[this.currentNodeUid];
        if (curHighlightedNode) {
            if (curHighlightedNode.uid === node.uid) {
                doneHighlighting = true;
            }
            else {
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
    };
    Meta64.prototype.refreshAllGuiEnablement = function () {
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
        Polymer.dom.flush();
        Polymer.updateStyles();
    };
    Meta64.prototype.getSingleSelectedNode = function () {
        var uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                return this.uidToNodeMap[uid];
            }
        }
        return null;
    };
    Meta64.prototype.getOrdinalOfNode = function (node) {
        if (!this.currentNodeData || !this.currentNodeData.children)
            return -1;
        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            if (node.id === this.currentNodeData.children[i].id) {
                return i;
            }
        }
        return -1;
    };
    Meta64.prototype.setCurrentNodeData = function (data) {
        this.currentNodeData = data;
        this.currentNode = data.node;
        this.currentNodeUid = data.node.uid;
        this.currentNodeId = data.node.id;
        this.currentNodePath = data.node.path;
    };
    Meta64.prototype.anonPageLoadResponse = function (res) {
        if (res.renderNodeResponse) {
            util.setVisibility("mainNodeContent", true);
            render.renderPageFromData(res.renderNodeResponse);
            this.refreshAllGuiEnablement();
        }
        else {
            util.setVisibility("mainNodeContent", false);
            console.log("setting listview to: " + res.content);
            util.setHtmlEnhanced("listView", res.content);
        }
        render.renderMainPageControls();
    };
    Meta64.prototype.removeBinaryByUid = function (uid) {
        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            var node = this.currentNodeData.children[i];
            if (node.uid === uid) {
                node.hasBinary = false;
                break;
            }
        }
    };
    Meta64.prototype.initNode = function (node) {
        if (!node) {
            console.log("initNode has null node");
            return;
        }
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        node.properties = props.getPropertiesInEditingOrder(node.properties);
        node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);
        this.uidToNodeMap[node.uid] = node;
        this.idToNodeMap[node.id] = node;
    };
    Meta64.prototype.initConstants = function () {
        util.addAll(this.simpleModePropertyBlackList, [
            jcrCnst.MIXIN_TYPES,
            jcrCnst.PRIMARY_TYPE,
            jcrCnst.POLICY,
            jcrCnst.IMG_WIDTH,
            jcrCnst.IMG_HEIGHT,
            jcrCnst.BIN_VER,
            jcrCnst.BIN_DATA,
            jcrCnst.BIN_MIME,
            jcrCnst.COMMENT_BY,
            jcrCnst.PUBLIC_APPEND]);
        util.addAll(this.readOnlyPropertyList, [
            jcrCnst.PRIMARY_TYPE,
            jcrCnst.UUID,
            jcrCnst.MIXIN_TYPES,
            jcrCnst.CREATED,
            jcrCnst.CREATED_BY,
            jcrCnst.LAST_MODIFIED,
            jcrCnst.LAST_MODIFIED_BY,
            jcrCnst.IMG_WIDTH,
            jcrCnst.IMG_HEIGHT,
            jcrCnst.BIN_VER,
            jcrCnst.BIN_DATA,
            jcrCnst.BIN_MIME,
            jcrCnst.COMMENT_BY,
            jcrCnst.PUBLIC_APPEND]);
        util.addAll(this.binaryPropertyList, [jcrCnst.BIN_DATA]);
    };
    Meta64.prototype.initApp = function () {
        if (this.appInitialized)
            return;
        console.log("initApp running.");
        this.appInitialized = true;
        var tabs = util.poly("mainIronPages");
        var thiz = this;
        tabs.addEventListener("iron-select", function () {
            thiz.tabChangeEvent(tabs.selected);
        });
        this.initConstants();
        this.displaySignupMessage();
        $(window).bind("beforeunload", function () {
            return "Leave Meta64 ?";
        });
        this.deviceWidth = $(window).width();
        this.deviceHeight = $(window).height();
        user.refreshLogin();
        this.updateMainMenuPanel();
        this.refreshAllGuiEnablement();
        util.initProgressMonitor();
        this.processUrlParams();
    };
    Meta64.prototype.processUrlParams = function () {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(function () {
                (new ChangePasswordDlg(passCode)).open();
            }, 100);
        }
    };
    Meta64.prototype.tabChangeEvent = function (tabName) {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    };
    Meta64.prototype.displaySignupMessage = function () {
        var signupResponse = $("#signupCodeResponse").text();
        if (signupResponse === "ok") {
            (new MessageDlg("Signup complete. You may now login.")).open();
        }
    };
    Meta64.prototype.screenSizeChange = function () {
        if (this.currentNodeData) {
            if (meta64.currentNode.imgId) {
                render.adjustImageSize(meta64.currentNode);
            }
            $.each(this.currentNodeData.children, function (i, node) {
                if (node.imgId) {
                    render.adjustImageSize(node);
                }
            });
        }
    };
    Meta64.prototype.orientationHandler = function (event) {
    };
    Meta64.prototype.loadAnonPageHome = function (ignoreUrl) {
        util.json("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, this.anonPageLoadResponse, this);
    };
    return Meta64;
}());
if (!window["meta64"]) {
    var meta64 = new Meta64();
}
//# sourceMappingURL=meta64.js.map