console.log("running module: meta64.js");
var meta64 = function () {
    var appInitialized = false;
    var curUrlPath = window.location.pathname + window.location.search;
    var _ = {
        codeFormatDirty: false,
        serverMarkdown: true,
        nextGuid: 0,
        userName: "anonymous",
        deviceWidth: 0,
        deviceHeight: 0,
        homeNodeId: "",
        homeNodePath: "",
        isAdminUser: false,
        isAnonUser: true,
        anonUserLandingPageNode: null,
        treeDirty: false,
        uidToNodeMap: {},
        aceEditorsById: {},
        idToNodeMap: {},
        nextUid: 1,
        identToUidMap: {},
        parentUidToFocusNodeMap: {},
        editMode: false,
        MODE_ADVANCED: "advanced",
        MODE_SIMPLE: "simple",
        editModeOption: "simple",
        showProperties: false,
        simpleModeNodePrefixBlackList: {
            "rep:": true
        },
        simpleModePropertyBlackList: {},
        readOnlyPropertyList: {},
        binaryPropertyList: {},
        selectedNodes: {},
        currentNodeData: null,
        currentNode: null,
        currentNodeUid: null,
        currentNodeId: null,
        currentNodePath: null,
        dataObjMap: {},
        updateMainMenuPanel: function () {
            console.log("building main menu panel");
            menuPanel.build();
            menuPanel.init();
        },
        registerDataObject: function (data) {
            if (!data.guid) {
                data.guid = ++_.nextGuid;
                _.dataObjMap[data.guid] = data;
            }
        },
        getObjectByGuid: function (guid) {
            var ret = _.dataObjMap[guid];
            if (!ret) {
                console.log("data object not found: guid=" + guid);
            }
            return ret;
        },
        encodeOnClick: function (callback, ctx) {
            if (typeof callback == "string") {
                return callback;
            }
            else if (typeof callback == "function") {
                _.registerDataObject(callback);
                if (ctx) {
                    _.registerDataObject(ctx);
                    return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
                }
                else {
                    return "meta64.runCallback(" + callback.guid + ");";
                }
            }
        },
        runCallback: function (guid, ctx) {
            var dataObj = _.getObjectByGuid(guid);
            if (dataObj.callback) {
                dataObj.callback();
            }
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = _.getObjectByGuid(ctx);
                    dataObj.call(thiz);
                }
                else {
                    dataObj();
                }
            }
            else {
                alert("unable to find callback on registered guid: " + guid);
            }
        },
        inSimpleMode: function () {
            return _.editModeOption === _.MODE_SIMPLE;
        },
        refresh: function () {
            _.goToMainPage(true, true);
        },
        goToMainPage: function (rerender, forceServerRefresh) {
            if (forceServerRefresh) {
                _.treeDirty = true;
            }
            if (rerender || _.treeDirty) {
                if (_.treeDirty) {
                    view.refreshTree(null, true);
                }
                else {
                    render.renderPageFromData();
                }
                _.refreshAllGuiEnablement();
            }
            else {
                view.scrollToSelectedNode();
            }
        },
        selectTab: function (pageName) {
            var ironPages = document.querySelector("#mainIronPages");
            ironPages.select(pageName);
        },
        changePage: function (pg, data) {
            if (typeof pg.tabId === 'undefined') {
                console.log("oops, wrong object type passed to changePage function.");
                return null;
            }
            var paperTabs = document.querySelector("#mainPaperTabs");
            paperTabs.select(pg.tabId);
        },
        isNodeBlackListed: function (node) {
            if (!_.inSimpleMode())
                return false;
            var prop;
            for (prop in _.simpleModeNodePrefixBlackList) {
                if (_.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                    return true;
                }
            }
            return false;
        },
        getSelectedNodeUidsArray: function () {
            var selArray = [], idx = 0, uid;
            for (uid in _.selectedNodes) {
                if (_.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uid;
                }
            }
            return selArray;
        },
        getSelectedNodeIdsArray: function () {
            var selArray = [], idx = 0, uid;
            if (!_.selectedNodes) {
                console.log("no selected nodes.");
            }
            else {
                console.log("selectedNode count: " + util.getPropertyCount(_.selectedNodes));
            }
            for (uid in _.selectedNodes) {
                if (_.selectedNodes.hasOwnProperty(uid)) {
                    var node = _.uidToNodeMap[uid];
                    if (!node) {
                        console.log("unable to find uidToNodeMap for uid=" + uid);
                    }
                    else {
                        selArray[idx++] = node.id;
                    }
                }
            }
            return selArray;
        },
        getSelectedNodesArray: function () {
            var selArray = [], idx = 0, uid;
            for (uid in _.selectedNodes) {
                if (_.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = _.uidToNodeMap[uid];
                }
            }
            return selArray;
        },
        clearSelectedNodes: function () {
            _.selectedNodes = {};
        },
        updateNodeInfoResponse: function (res, node) {
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
        },
        updateNodeInfo: function (node) {
            var ironRes = util.json("getNodePrivileges", {
                "nodeId": node.id,
                "includeAcl": false,
                "includeOwners": true
            });
            ironRes.completes.then(function () {
                _.updateNodeInfoResponse(ironRes.response, node);
            });
        },
        getNodeFromId: function (id) {
            return _.idToNodeMap[id];
        },
        getPathOfUid: function (uid) {
            var node = _.uidToNodeMap[uid];
            if (!node) {
                return "[path error. invalid uid: " + uid + "]";
            }
            else {
                return node.path;
            }
        },
        getHighlightedNode: function () {
            var ret = _.parentUidToFocusNodeMap[_.currentNodeUid];
            return ret;
        },
        highlightRowById: function (id, scroll) {
            var node = _.getNodeFromId(id);
            if (node) {
                _.highlightNode(node, scroll);
            }
            else {
                console.log("highlightRowById failed to find id: " + id);
            }
        },
        highlightNode: function (node, scroll) {
            if (!node)
                return;
            var doneHighlighting = false;
            var curHighlightedNode = _.parentUidToFocusNodeMap[_.currentNodeUid];
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
                _.parentUidToFocusNodeMap[_.currentNodeUid] = node;
                var rowElmId = node.uid + "_row";
                var rowElm = $("#" + rowElmId);
                util.changeOrAddClass(rowElm, "inactive-row", "active-row");
            }
            if (scroll) {
                view.scrollToSelectedNode();
            }
        },
        refreshAllGuiEnablement: function () {
            var selNodeCount = util.getPropertyCount(_.selectedNodes);
            var highlightNode = _.getHighlightedNode();
            var selNodeIsMine = highlightNode != null && highlightNode.createdBy === meta64.userName;
            util.setEnablement("navLogoutButton", !_.isAnonUser);
            util.setEnablement("openSignupPgButton", _.isAnonUser);
            util.setEnablement("openExportDlg", _.isAdminUser);
            util.setEnablement("openImportDlg", _.isAdminUser);
            var propsToggle = _.currentNode && !_.isAnonUser;
            util.setEnablement("propsToggleButton", propsToggle);
            var allowEditMode = _.currentNode && !_.isAnonUser;
            util.setEnablement("editModeButton", allowEditMode);
            util.setEnablement("upLevelButton", _.currentNode && nav.parentVisibleToUser());
            util.setEnablement("moveSelNodesButton", !_.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("deleteSelNodesButton", !_.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("clearSelectionsButton", !_.isAnonUser && selNodeCount > 0);
            util.setEnablement("moveSelNodesButton", !_.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("finishMovingSelNodesButton", !_.isAnonUser && edit.nodesToMove != null && selNodeIsMine);
            util.setEnablement("changePasswordPgButton", !_.isAnonUser);
            util.setEnablement("accountPreferencesButton", !_.isAnonUser);
            util.setEnablement("manageAccountButton", !_.isAnonUser);
            util.setEnablement("insertBookWarAndPeaceButton", _.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
            util.setEnablement("uploadFromFileButton", !_.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("uploadFromUrlButton", !_.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("deleteAttachmentsButton", !_.isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            util.setEnablement("editNodeSharingButton", !_.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("renameNodePgButton", !_.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("searchDlgButton", !_.isAnonUser && highlightNode != null);
            util.setEnablement("timelineButton", !_.isAnonUser && highlightNode != null);
            util.setEnablement("showServerInfoButton", _.isAdminUser);
            util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            util.setEnablement("refreshPageButton", !_.isAnonUser);
            util.setEnablement("findSharedNodesButton", !_.isAnonUser && highlightNode != null);
            util.setVisibility("openImportDlg", _.isAdminUser && selNodeIsMine);
            util.setVisibility("openExportDlg", _.isAdminUser && selNodeIsMine);
            util.setVisibility("navHomeButton", !_.isAnonUser);
            util.setVisibility("editModeButton", allowEditMode);
            util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
            util.setVisibility("insertBookWarAndPeaceButton", _.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
            util.setVisibility("propsToggleButton", !_.isAnonUser);
            util.setVisibility("openLoginDlgButton", _.isAnonUser);
            util.setVisibility("navLogoutButton", !_.isAnonUser);
            util.setVisibility("openSignupPgButton", _.isAnonUser);
            Polymer.dom.flush();
            Polymer.updateStyles();
        },
        getSingleSelectedNode: function () {
            var uid;
            for (uid in _.selectedNodes) {
                if (_.selectedNodes.hasOwnProperty(uid)) {
                    return _.uidToNodeMap[uid];
                }
            }
            return null;
        },
        getOrdinalOfNode: function (node) {
            if (!_.currentNodeData || !_.currentNodeData.children)
                return -1;
            for (var i = 0; i < _.currentNodeData.children.length; i++) {
                if (node.id === _.currentNodeData.children[i].id) {
                    return i;
                }
            }
            return -1;
        },
        setCurrentNodeData: function (data) {
            _.currentNodeData = data;
            _.currentNode = data.node;
            _.currentNodeUid = data.node.uid;
            _.currentNodeId = data.node.id;
            _.currentNodePath = data.node.path;
        },
        anonPageLoadResponse: function (res) {
            if (res.renderNodeResponse) {
                util.setVisibility("mainNodeContent", true);
                render.renderPageFromData(res.renderNodeResponse);
                _.refreshAllGuiEnablement();
            }
            else {
                util.setVisibility("mainNodeContent", false);
                console.log("setting listview to: " + res.content);
                util.setHtmlEnhanced("listView", res.content);
            }
            render.renderMainPageControls();
        },
        removeBinaryByUid: function (uid) {
            for (var i = 0; i < _.currentNodeData.children.length; i++) {
                var node = _.currentNodeData.children[i];
                if (node.uid === uid) {
                    node.hasBinary = false;
                    break;
                }
            }
        },
        initNode: function (node) {
            if (!node) {
                console.log("initNode has null node");
                return;
            }
            node.uid = util.getUidForId(_.identToUidMap, node.id);
            node.properties = props.getPropertiesInEditingOrder(node.properties);
            node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);
            _.uidToNodeMap[node.uid] = node;
            _.idToNodeMap[node.id] = node;
        },
        initConstants: function () {
            util.addAll(_.simpleModePropertyBlackList, [
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
            util.addAll(_.readOnlyPropertyList, [
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
            util.addAll(_.binaryPropertyList, [jcrCnst.BIN_DATA]);
        },
        initApp: function () {
            if (appInitialized)
                return;
            console.log("initApp running.");
            appInitialized = true;
            var tabs = util.poly("mainIronPages");
            tabs.addEventListener("iron-select", function () {
                _.tabChangeEvent(tabs.selected);
            });
            _.initConstants();
            _.displaySignupMessage();
            $(window).bind("beforeunload", function () {
                return "Leave Meta64 ?";
            });
            _.deviceWidth = $(window).width();
            _.deviceHeight = $(window).height();
            user.refreshLogin();
            _.updateMainMenuPanel();
            _.refreshAllGuiEnablement();
            util.initProgressMonitor();
            _.processUrlParams();
        },
        processUrlParams: function () {
            var passCode = util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function () {
                    (new ChangePasswordDlg(passCode)).open();
                }, 100);
            }
        },
        tabChangeEvent: function (tabName) {
            if (tabName == "searchTabName") {
				srch.searchTabActivated();
            }
        },
        displaySignupMessage: function () {
            var signupResponse = $("#signupCodeResponse").text();
            if (signupResponse === "ok") {
                (new MessageDlg("Signup complete. You may now login.")).open();
            }
        },
        screenSizeChange: function () {
            if (_.currentNodeData) {
                if (meta64.currentNode.imgId) {
                    render.adjustImageSize(meta64.currentNode);
                }
                $.each(_.currentNodeData.children, function (i, node) {
                    if (node.imgId) {
                        render.adjustImageSize(node);
                    }
                });
            }
        },
        orientationHandler: function (event) {
        },
        loadAnonPageHome: function (ignoreUrl) {
            util.json("anonPageLoad", {
                "ignoreUrl": ignoreUrl
            }, _.anonPageLoadResponse);
        }
    };
    console.log("Module ready: meta64.js");
    return _;
}();
//# sourceMappingURL=meta64.js.map