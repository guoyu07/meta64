console.log("Meta64.ts");

/// <reference path="/node_moduels/@tyeps/jquery/index.d.ts" />

import { Factory } from "./Factory";
import * as I from "./Interfaces";
import { Span } from "./widget/Span";
import { MenuPanel } from "./MenuPanel";
import { ChangePasswordDlg } from "./dlg/ChangePasswordDlg";
import { Constants as cnst } from "./Constants";
import { DomBindIntf as DomBind } from "./intf/DomBindIntf";
import { RenderIntf as Render } from "./intf/RenderIntf";
import { SearchIntf as Search } from "./intf/SearchIntf";
import { UserIntf as User } from "./intf/UserIntf";
import { ViewIntf as View } from "./intf/ViewIntf";
import { RssPlugin } from "./plugins/RssPlugin";
import { UtilIntf as Util } from "./intf/UtilIntf";
import { EditIntf as Edit } from "./intf/EditIntf";
import { NavIntf as Nav } from "./intf/NavIntf";
import { PropsIntf as Props } from "./intf/PropsIntf";
import { CoreTypesPluginIntf as CoreTypesPlugin } from "./intf/CoreTypesPluginIntf";
import { Meta64Intf } from "./intf/Meta64Intf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";

//declare var $;

let util: Util;
let edit: Edit;
let nav: Nav;
let props: Props;
let render: Render;
let srch: Search;
let user: User;
let view: View;
let domBind: DomBind;
let rssPlugin: RssPlugin;
let coreTypesPlugin: CoreTypesPlugin;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    util = s.util;
    edit = s.edit;
    nav = s.nav;
    props = s.props;
    render = s.render;
    srch = s.srch;
    user = s.user;
    view = s.view;
    domBind = s.domBind;
    rssPlugin = s.rssPlugin;
    coreTypesPlugin = s.coreTypesPlugin;
});

export class Meta64 implements Meta64Intf {

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

    /* NodeData is a 'client-state' only object that holds information per-node that is in an object
    that is never used on server but only on client
    */
    uidToNodeDataMap: { [key: string]: Object } = {};

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

    /* Flag that indicates if we are rendering owner, modTime, etc. on each row */
    showMetaData: boolean = false;

    /* Flag that indicates if we are rendering path on each row */
    showPath: boolean = false;

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
    currentNodeData: I.RenderNodeResponse = null;

    renderFunctionsByJcrType: { [key: string]: Function } = {};
    propOrderingFunctionsByJcrType: { [key: string]: Function } = {};

    userPreferences: I.UserPreferences = {
        "editMode": false,
        "advancedMode": false,
        "importAllowed": false,
        "exportAllowed": false,
        "showMetaData": false,
        "showPath": false
    };

    setNodeData = (uid: string, data: Object) => {
        /* lookup object by uid */
        let foundObj = this.uidToNodeDataMap[uid];

        /* if no object found for uid, then create one and put it in map */
        if (!foundObj) {
            foundObj = {};
            this.uidToNodeDataMap[uid] = foundObj;
        }

        /* now we can add data properties onto foundObj */
        util.mergeProps(foundObj, data);
    }

    /* gets the value associated with the given uid and property */
    getNodeData = (uid: string, prop: string): any => {
        let foundObj = this.uidToNodeDataMap[uid];
        return foundObj != null ? foundObj[prop] : null;
    }

    rebuildMainMenu = () => {
        this.menuPanel = new MenuPanel();
        util.setHtml("mainAppMenu", this.menuPanel.renderHtml());
        this.refreshAllGuiEnablement();
    }

    updateMainMenuPanel = () => {
        // console.log("building main menu panel");

        /* create menuPanel, only upon first need for it. I think really I should be creating right in the initializer code instead here, but leaving
        in this legacy location for now */
        if (!this.menuPanel) {
            this.rebuildMainMenu();
        }
        else {
            this.refreshAllGuiEnablement();
        }
    }

    inSimpleMode = (): boolean => {
        return this.editModeOption === this.MODE_SIMPLE;
    }

    refresh = (): void => {
        this.goToMainPage(true, true);
    }

    rebuildIndexes = (): void => {
        util.ajax<I.RebuildIndexesRequest, I.RebuildIndexesResponse>("rebuildIndexes", {}, function (res: I.RebuildIndexesResponse) {
            util.showMessage("Index rebuild complete.");
        });
    }

    goToMainPage = (rerender?: boolean, forceServerRefresh?: boolean): void => {

        if (forceServerRefresh) {
            this.treeDirty = true;
        }

        if (rerender || this.treeDirty) {
            if (this.treeDirty) {
                view.refreshTree(null, true);
            } else {
                render.renderPageFromData();
                this.refreshAllGuiEnablement();
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

    selectTab = (tabName): void => {
        console.log("selectTab: " + tabName);
        let tabElm = $("[href='#" + tabName + "']");
        (<any>tabElm).tab('show');
    }

    isNodeBlackListed = (node): boolean => {
        if (!this.inSimpleMode())
            return false;

        let ret = false;

        util.forEachProp(this.simpleModeNodePrefixBlackList, (prop, val): boolean => {
            if (util.startsWith(node.name, prop)) {
                ret = true;
                //teminate iteration with false return
                return false;
            }
            return true;
        });

        return ret;
    }

    getSelectedNodeUidsArray = (): string[] => {
        let selArray: string[] = [];
        util.forEachProp(this.selectedNodes, (uid, val): boolean => {
            selArray.push(uid);
            return true;
        });
        return selArray;
    }

    /**
    Returns a newly cloned array of all the selected nodes each time it's called.
    */
    getSelectedNodeIdsArray = (): string[] => {
        let selArray: string[] = [];

        if (!this.selectedNodes) {
            console.log("no selected nodes.");
        } else {
            console.log("selectedNode count: " + util.getPropertyCount(this.selectedNodes));
        }

        util.forEachProp(this.selectedNodes, (uid, val): boolean => {
            let node: I.NodeInfo = this.uidToNodeMap[uid];
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
    getSelectedNodesAsMapById = (): Object => {
        let ret: Object = {};
        let selArray: I.NodeInfo[] = this.getSelectedNodesArray();
        if (!selArray) return ret;
        for (let i = 0; i < selArray.length; i++) {
            ret[selArray[i].id] = selArray[i];
        }
        return ret;
    }

    /* Gets selected nodes as NodeInfo.java objects array */
    getSelectedNodesArray = (): I.NodeInfo[] => {
        let selArray: I.NodeInfo[] = [];
        util.forEachProp(this.selectedNodes, (uid, val): boolean => {
            let node = this.uidToNodeMap[uid];
            if (node) {
                selArray.push(node);
            }
            return true;
        });
        return selArray;
    }

    clearSelectedNodes = () => {
        this.selectedNodes = {};
    }

    updateNodeInfoResponse = (res, node) => {
        let ownerBuf: string = "";
        let mine: boolean = false;

        if (res.owners) {
            util.forEachArrElm(res.owners, (owner, index) => {
                if (ownerBuf.length > 0) {
                    ownerBuf += ",";
                }

                if (owner === this.userName) {
                    mine = true;
                }

                ownerBuf += owner;
            });
        }

        if (ownerBuf.length > 0) {
            node.owner = ownerBuf;
            // let elmId = "#ownerDisplay" + node.uid;
            // let elm = document.querySelector(elmId);
            // if (elm) {
            //     elm.innerHTML = " (Manager: " + ownerBuf + ")";
            //     if (mine) {
            //         util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
            //     } else {
            //         util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
            //     }
            // }
            let elm = <Span>this.getNodeData(node.uid, "ownerDisplaySpan");
            if (elm) {
                elm.content = " (Manager: " + ownerBuf + ")";

                /* this class may not persist after other updates, because class info is not currently persisted INSIDE the widget
                properties, so this code needs work/testing, but i'll to ahead and leave as is for now, since this is basically
                a nice-to-see background color chagne and not critical. (toto-1) */
                if (mine) {
                    util.changeOrAddClass(elm.getId(), "created-by-other", "created-by-me");
                } else {
                    util.changeOrAddClass(elm.getId(), "created-by-me", "created-by-other");
                }
                elm.renderToDom();
            }
        }
    }

    updateNodeInfo = (node: I.NodeInfo) => {
        util.ajax<I.GetNodePrivilegesRequest, I.GetNodePrivilegesResponse>("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        }, (res: I.GetNodePrivilegesResponse) => {
            this.updateNodeInfoResponse(res, node);
        });
    }

    /* Returns the node with the given node.id value */
    getNodeFromId = (id: string): I.NodeInfo => {
        return this.idToNodeMap[id];
    }

    getPathOfUid = (uid: string): string => {
        let node: I.NodeInfo = this.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        } else {
            return node.path;
        }
    }

    getHighlightedNode = (): I.NodeInfo => {
        if (!this.currentNodeData || !this.currentNodeData.node) return null;
        let ret: I.NodeInfo = this.parentUidToFocusNodeMap[this.currentNodeData.node.uid];
        return ret;
    }

    highlightRowById = (id, scroll): void => {
        let node: I.NodeInfo = this.getNodeFromId(id);
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
    highlightNode = (node: I.NodeInfo, scroll: boolean): void => {
        if (!node) {
            console.log("ignoring null noode.");
            return;
        }

        //console.log("Setting lastNode (in highlight)="+node.id);
        localStorage.setItem("lastNode", node.id);

        let doneHighlighting: boolean = false;

        /* Unhighlight currently highlighted node if any */
        let curHighlightedNode: I.NodeInfo = this.parentUidToFocusNodeMap[this.currentNodeData.node.uid];
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
            this.parentUidToFocusNodeMap[this.currentNodeData.node.uid] = node;

            let rowElmId: string = "row_" + node.uid;
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
    updateState = () => {
        /* multiple select nodes */
        this.state.prevPageExists = nav.mainOffset > 0;
        this.state.nextPageExists = !nav.endReached;
        this.state.selNodeCount = util.getPropertyCount(this.selectedNodes);
        this.state.highlightNode = this.getHighlightedNode();
        this.state.selNodeIsMine = this.state.highlightNode != null && (this.state.highlightNode.owner === this.userName || "admin" === this.userName);

        this.state.homeNodeSelected = this.state.highlightNode != null && this.homeNodeId == this.state.highlightNode.id;

        //for now, allowing all users to import+export (todo-2)
        this.state.importFeatureEnabled = true; //this.isAdminUser || this.userPreferences.importAllowed;
        this.state.exportFeatureEnabled = true; //this.isAdminUser || this.userPreferences.exportAllowed;

        this.state.highlightOrdinal = this.getOrdinalOfNode(this.state.highlightNode);
        this.state.numChildNodes = this.getNumChildNodes();
        this.state.canMoveUp = (this.state.highlightOrdinal > 0 && this.state.numChildNodes > 1) || this.state.prevPageExists;
        this.state.canMoveDown = (this.state.highlightOrdinal < this.state.numChildNodes - 1 && this.state.numChildNodes > 1) || this.state.nextPageExists;

        //todo-1: need to add to this selNodeIsMine || selParentIsMine;
        this.state.canCreateNode = this.userPreferences.editMode && (this.isAdminUser || (!this.isAnonUser /* && selNodeIsMine */));
        this.state.propsToggle = this.currentNodeData && this.currentNodeData.node && !this.isAnonUser;
        this.state.allowEditMode = this.currentNodeData && this.currentNodeData.node && !this.isAnonUser;
    }

    refreshAllGuiEnablement = () => {
        this.updateState();

        //for now we simply tolerate a null menuPanel here before it's initialized.
        if (this.menuPanel) {
            /* refreh all enablement and visibility under entire menu with this recursive call! */
            //this.menuPanel.refreshState();
            debugger;
            PubSub.pub(Constants.PUBSUB_RefreshEnablement, {});
        }

        util.setEnablement("navLogoutButton", !this.isAnonUser);
        util.setEnablement("openSignupPgButton", this.isAnonUser);
        util.setEnablement("editModeButton", this.state.allowEditMode);
        util.setEnablement("upLevelButton", this.currentNodeData && this.currentNodeData.node && nav.parentVisibleToUser());
        util.setEnablement("searchMainAppButton", !this.isAnonUser && this.state.highlightNode != null);
        util.setEnablement("timelineMainAppButton", !this.isAnonUser && this.state.highlightNode != null);
        util.setEnablement("userPreferencesMainAppButton", !this.isAnonUser);

        util.setElmDisplayById("editModeButton", this.state.allowEditMode);
        util.setElmDisplayById("upLevelButton", this.currentNodeData && this.currentNodeData.node && nav.parentVisibleToUser());
        util.setElmDisplayById("openLoginDlgButton", this.isAnonUser);
        util.setElmDisplayById("navLogoutButton", !this.isAnonUser);
        util.setElmDisplayById("openSignupPgButton", this.isAnonUser);
        util.setElmDisplayById("searchMainAppButton", !this.isAnonUser && this.state.highlightNode != null);
        util.setElmDisplayById("timelineMainAppButton", !this.isAnonUser && this.state.highlightNode != null);
        util.setElmDisplayById("userPreferencesMainAppButton", !this.isAnonUser);
    }

    /* WARNING: This is NOT the highlighted node. This is whatever node has the CHECKBOX selection */
    getSingleSelectedNode = (): I.NodeInfo => {
        let ret = null;
        util.forEachProp(this.selectedNodes, (uid, val): boolean => {
            // console.log("found a single Sel NodeID: " + nodeId);
            ret = this.uidToNodeMap[uid];
            return false;
        });
        return ret;
    }

    getOrdinalOfNode = (node: I.NodeInfo): number => {
        let ret = -1;

        if (!node || !this.currentNodeData || !this.currentNodeData.node.children)
            return ret;

        util.forEachArrElm(this.currentNodeData.node.children, (iterNode, idx): boolean => {
            if (node.id === iterNode.id) {
                ret = idx;
                return false; //stop iterating.
            }
            return true;
        });
        return ret;
    }

    getNumChildNodes = (): number => {
        if (!this.currentNodeData || !this.currentNodeData.node.children)
            return 0;

        return this.currentNodeData.node.children.length;
    }

    setCurrentNodeData = (data: I.RenderNodeResponse): void => {
        this.currentNodeData = data;
    }

    anonPageLoadResponse = (res: I.AnonPageLoadResponse): void => {
        domBind.whenElm("listView", (elm) => {
            if (res.renderNodeResponse) {
                util.setElmDisplayById("mainNodeContent", true);
                if (res.renderNodeResponse.noDataResponse) {
                    util.setHtml("listView", res.renderNodeResponse.noDataResponse);
                }
                else {
                    render.renderPageFromData(res.renderNodeResponse);
                }
                this.refreshAllGuiEnablement();
            } else {
                util.setElmDisplayById("mainNodeContent", false);
                console.log("setting listview to: " + res.content);
                util.setHtml("listView", res.content);
            }
        });
    }

    removeBinaryByUid = (uid): void => {
        for (var i = 0; i < this.currentNodeData.node.children.length; i++) {
            let node: I.NodeInfo = this.currentNodeData.node.children[i];
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
    initNode = (node: I.NodeInfo, updateMaps?: boolean): void => {
        if (!node) {
            console.log("initNode has null node");
            return;
        }
        /*
         * assign a property for detecting this node type, I'll do this instead of using some kind of custom JS
         * prototype-related approach
         */
        node.uid = updateMaps ? util.getUidForId(this.identToUidMap, node.id) : this.identToUidMap[node.id];
        node.properties = props.getPropertiesInEditingOrder(node, node.properties);

        if (updateMaps) {
            this.uidToNodeMap[node.uid] = node;
            this.idToNodeMap[node.id] = node;
        }
    }

    initConstants = () => {
        util.addAll(this.simpleModePropertyBlackList, [ //
            cnst.PRIMARY_TYPE, //
            cnst.IMG_WIDTH,//
            cnst.IMG_HEIGHT, //
            cnst.BIN_VER, //
            cnst.BIN_DATA, //
            cnst.BIN_MIME, //
            cnst.COMMENT_BY, //
            cnst.PUBLIC_APPEND]);

        util.addAll(this.readOnlyPropertyList, [ //
            cnst.PRIMARY_TYPE, //
            cnst.UUID, //
            cnst.IMG_WIDTH, //
            cnst.IMG_HEIGHT, //
            cnst.BIN_VER, //
            cnst.BIN_DATA, //
            cnst.BIN_MIME, //
            cnst.COMMENT_BY, //
            cnst.PUBLIC_APPEND]);

        util.addAll(this.binaryPropertyList, [cnst.BIN_DATA]);
    }

    initApp = (): void => {
        console.log("initApp running.");

        rssPlugin.init();
        coreTypesPlugin.init();

        // SystemFolder and File handling stuff is disabled for now (todo-1), but will eventually be brought
        // back as a plugin similar to rssPlugin, coreTypesPlugin, etc.
        //
        // this.renderFunctionsByJcrType["meta64:systemfolder"] = systemfolder.renderNode;
        // this.propOrderingFunctionsByJcrType["meta64:systemfolder"] = systemfolder.propOrdering;
        //
        // this.renderFunctionsByJcrType["meta64:filelist"] = systemfolder.renderFileListNode;
        // this.propOrderingFunctionsByJcrType["meta64:filelist"] = systemfolder.fileListPropOrdering;

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

        if (this.appInitialized)
            return;

        this.appInitialized = true;

        this.initConstants();
        this.displaySignupMessage();

        /*
         * todo-3: how does orientationchange need to work for polymer? Polymer disabled
         * $ (window).on("orientationchange", _.orientationHandler);
         */

        //todo-1: actually this is a nuisance unless user is actually EDITING a node right now
        //so until i make it able to detect if user is editing i'm removing this.
        // window.onbeforeunload = () => {
        //     return "Leave Meta64 ?";
        // };

        /*
         * I thought this was a good idea, but actually it destroys the session, when the user is entering an
         * "id=\my\path" type of url to open a specific node. Need to rethink  Basically for now I'm thinking
         * going to a different url shouldn't blow up the session, which is what 'logout' does.
         *
         * $ (window).on("unload", function() { user.logout(false); });
         */

        this.deviceWidth = window.innerWidth;
        this.deviceHeight = window.innerHeight;

        /*
         * This call checks the server to see if we have a session already, and gets back the login information from
         * the session, and then renders page content, after that.
         */

        //this.pingServer();
        user.refreshLogin();

        this.updateMainMenuPanel();

        util.initProgressMonitor(); 
        this.processUrlParams();
        // this.initStaticHtmlOnClicks();

        this.initTabClicks();

        console.log("initApp complete.");
    }

    initTabClicks = () => {
        $('[href="#mainTab"]').click(function (e) {
            e.preventDefault();
            (<any>$(this)).tab('show'); //setTab
        });

        $('[href="#searchTab"]').click(function (e) {
            e.preventDefault();
            (<any>$(this)).tab('show'); //setTab
        });

        $('[href="#timelineTab"]').click(function (e) {
            e.preventDefault();
            (<any>$(this)).tab('show'); //setTab
        });
    }

    pingServer = () => {
        util.ajax<I.PingRequest, I.PingResponse>("ping", {},
            (res: I.PingResponse) => {
                console.log("Server Info: " + res.serverInfo);
            });
    }

    addTypeHandlers = (typeName: string, renderFunction: Function, orderingFunction: Function): void => {
        if (renderFunction) {
            this.renderFunctionsByJcrType[typeName] = renderFunction;
        }
        if (orderingFunction) {
            this.propOrderingFunctionsByJcrType[typeName] = orderingFunction;
        }
    }

    processUrlParams = (): void => {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(() => {
                new ChangePasswordDlg({ "passCode": passCode }).open();
            }, 100);
        }

        this.urlCmd = util.getParameterByName("cmd");
    }

    tabChangeEvent = (tabName): void => {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    }

    displaySignupMessage = (): void => {
        let signupElm = util.domElm("#signupCodeResponse");
        if (signupElm) {
            let signupResponse = signupElm.textContent;
            if (signupResponse === "ok") {
                util.showMessage("Signup complete. You may now login.");
            }
        }
    }

    screenSizeChange = (): void => {
        if (this.currentNodeData) {

            if (this.currentNodeData.node.imgId) {
                render.adjustImageSize(this.currentNodeData.node);
            }

            util.forEachArrElm(this.currentNodeData.node.children, (node, i) => {
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

    loadAnonPageHome = (ignoreUrl): void => {
        util.ajax<I.AnonPageLoadRequest, I.AnonPageLoadResponse>("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, this.anonPageLoadResponse);
    }

    saveUserPreferences = (): void => {
        util.ajax<I.SaveUserPreferencesRequest, I.SaveUserPreferencesResponse>("saveUserPreferences", {
            "userPreferences": this.userPreferences
        });
    }

    openSystemFile = (fileName: string) => {
        util.ajax<I.OpenSystemFileRequest, I.OpenSystemFileResponse>("openSystemFile", {
            "fileName": fileName
        });
    }

    // /* This is a wrapper around System.import, to make future refactoring needs easier, and also make the code a bit cleaner */
    // modRun(modName: string, callback: Function) {
    //     System.import("/js/" + modName).then((mod) => {
    //         callback(mod);
    //     });
    // }

    clickOnNodeRow = (uid): void => {
        nav.clickOnNodeRow(uid);
    }

    replyToComment = (uid: any): void => {
        edit.replyToComment(uid);
    }

    openNode = (uid): void => {
        nav.openNode(uid);
    }

    createSubNode = (uid?: any, typeName?: string, createAtTop?: boolean): void => {
        edit.createSubNode(uid, typeName, createAtTop);
    }

    insertNode = (uid?: any, typeName?: string): void => {
        edit.insertNode(uid, typeName);
    }

    runEditNode = (uid: any): void => {
        edit.runEditNode(uid);
    }

    moveNodeUp = (uid?: string): void => {
        edit.moveNodeUp(uid);
    }

    moveNodeDown = (uid?: string): void => {
        edit.moveNodeDown(uid);
    }

    clickOnSearchResultRow = (rowElm, uid) => {
        srch.clickOnSearchResultRow(rowElm, uid);
    }

    clickSearchNode = (uid: string) => {
        srch.clickSearchNode(uid);
    }

    //google signon is a work in progress, not functional yet.
    onSignIn = (googleUser) => {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    // editSystemFile(fileName: string) {
    //     new EditSystemFileDlg(fileName).open();
    // }
}

