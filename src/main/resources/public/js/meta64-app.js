var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Constants = (function () {
    function Constants() {
        this.ANON = "anonymous";
        this.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
        this.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
        this.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
        this.INSERT_ATTACHMENT = "{{insert-attachment}}";
        this.NEW_ON_TOOLBAR = false;
        this.INS_ON_TOOLBAR = false;
        this.MOVE_UPDOWN_ON_TOOLBAR = true;
        this.USE_ACE_EDITOR = false;
        this.SHOW_PATH_ON_ROWS = true;
        this.SHOW_PATH_IN_DLGS = true;
        this.SHOW_CLEAR_BUTTON_IN_EDITOR = false;
    }
    return Constants;
}());
var cnst = new Constants();
var AdSegment = (function () {
    function AdSegment(beginTime, endTime) {
        this.beginTime = beginTime;
        this.endTime = endTime;
    }
    return AdSegment;
}());
var PropEntry = (function () {
    function PropEntry(id, property, multi, readOnly, binary, subProps) {
        this.id = id;
        this.property = property;
        this.multi = multi;
        this.readOnly = readOnly;
        this.binary = binary;
        this.subProps = subProps;
    }
    return PropEntry;
}());
var SubProp = (function () {
    function SubProp(id, val) {
        this.id = id;
        this.val = val;
    }
    return SubProp;
}());
var Util = (function () {
    function Util() {
        this.logAjax = false;
        this.timeoutMessageShown = false;
        this.offline = false;
        this.waitCounter = 0;
        this.pgrsDlg = null;
        this.escapeRegExp = function (_) {
            return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        };
        this.escapeForAttrib = function (_) {
            return util.replaceAll(_, "\"", "&quot;");
        };
        this.unencodeHtml = function (_) {
            if (!util.contains(_, "&"))
                return _;
            var ret = _;
            ret = util.replaceAll(ret, '&amp;', '&');
            ret = util.replaceAll(ret, '&gt;', '>');
            ret = util.replaceAll(ret, '&lt;', '<');
            ret = util.replaceAll(ret, '&quot;', '"');
            ret = util.replaceAll(ret, '&#39;', "'");
            return ret;
        };
        this.replaceAll = function (_, find, replace) {
            return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
        };
        this.contains = function (_, str) {
            return _.indexOf(str) != -1;
        };
        this.startsWith = function (_, str) {
            return _.indexOf(str) === 0;
        };
        this.stripIfStartsWith = function (_, str) {
            if (_.startsWith(str)) {
                return _.substring(str.length);
            }
            return _;
        };
        this.arrayClone = function (_) {
            return _.slice(0);
        };
        this.arrayIndexOfItemByProp = function (_, propName, propVal) {
            var len = _.length;
            for (var i = 0; i < len; i++) {
                if (_[i][propName] === propVal) {
                    return i;
                }
            }
            return -1;
        };
        this.arrayMoveItem = function (_, fromIndex, toIndex) {
            _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
        };
        this.indexOfObject = function (_, obj) {
            for (var i = 0; i < _.length; i++) {
                if (_[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
        this.assertNotNull = function (varName) {
            if (typeof eval(varName) === 'undefined') {
                (new MessageDlg("Variable not found: " + varName)).open();
            }
        };
        this._ajaxCounter = 0;
        this.daylightSavingsTime = (Util.dst(new Date())) ? true : false;
        this.toJson = function (obj) {
            return JSON.stringify(obj, null, 4);
        };
        this.getParameterByName = function (name, url) {
            if (!url)
                url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        this.inherit = function (parent, child) {
            child.prototype.constructor = child;
            child.prototype = Object.create(parent.prototype);
            return child.prototype;
        };
        this.initProgressMonitor = function () {
            setInterval(util.progressInterval, 1000);
        };
        this.progressInterval = function () {
            var isWaiting = util.isAjaxWaiting();
            if (isWaiting) {
                util.waitCounter++;
                if (util.waitCounter >= 3) {
                    if (!util.pgrsDlg) {
                        util.pgrsDlg = new ProgressDlg();
                        util.pgrsDlg.open();
                    }
                }
            }
            else {
                util.waitCounter = 0;
                if (util.pgrsDlg) {
                    util.pgrsDlg.cancel();
                    util.pgrsDlg = null;
                }
            }
        };
        this.json = function (postName, postData, callback, callbackThis, callbackPayload) {
            if (callbackThis === window) {
                console.log("PROBABLE BUG: json call for " + postName + " used global 'window' as 'this', which is almost never going to be correct.");
            }
            var ironAjax;
            var ironRequest;
            try {
                if (util.offline) {
                    console.log("offline: ignoring call for " + postName);
                    return;
                }
                if (util.logAjax) {
                    console.log("JSON-POST[gen]: [" + postName + "]" + JSON.stringify(postData));
                }
                ironAjax = util.polyElmNode("ironAjax");
                ironAjax.url = postTargetUrl + postName;
                ironAjax.verbose = true;
                ironAjax.body = JSON.stringify(postData);
                ironAjax.method = "POST";
                ironAjax.contentType = "application/json";
                ironAjax.handleAs = "json";
                ironAjax.debounceDuration = "300";
                util._ajaxCounter++;
                ironRequest = ironAjax.generateRequest();
            }
            catch (ex) {
                util.logAndReThrow("Failed starting request: " + postName, ex);
            }
            ironRequest.completes.then(function () {
                try {
                    util._ajaxCounter--;
                    util.progressInterval();
                    if (util.logAjax) {
                        console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
                            + JSON.stringify(ironRequest.response));
                    }
                    if (typeof callback == "function") {
                        if (callbackPayload) {
                            if (callbackThis) {
                                callback.call(callbackThis, ironRequest.response, callbackPayload);
                            }
                            else {
                                callback(ironRequest.response, callbackPayload);
                            }
                        }
                        else {
                            if (callbackThis) {
                                callback.call(callbackThis, ironRequest.response);
                            }
                            else {
                                callback(ironRequest.response);
                            }
                        }
                    }
                }
                catch (ex) {
                    util.logAndReThrow("Failed handling result of: " + postName, ex);
                }
            }, function () {
                try {
                    util._ajaxCounter--;
                    util.progressInterval();
                    console.log("Error in util.json");
                    if (ironRequest.status == "403") {
                        console.log("Not logged in detected in util.");
                        util.offline = true;
                        if (!util.timeoutMessageShown) {
                            util.timeoutMessageShown = true;
                            (new MessageDlg("Session timed out. Page will refresh.")).open();
                        }
                        $(window).off("beforeunload");
                        window.location.href = window.location.origin;
                        return;
                    }
                    var msg = "Server request failed.\n\n";
                    try {
                        msg += "Status: " + ironRequest.statusText + "\n";
                        msg += "Code: " + ironRequest.status + "\n";
                    }
                    catch (ex) {
                    }
                    (new MessageDlg(msg)).open();
                }
                catch (ex) {
                    util.logAndReThrow("Failed processing server-side fail of: " + postName, ex);
                }
            });
            return ironRequest;
        };
        this.logAndThrow = function (message) {
            var stack = "[stack, not supported]";
            try {
                stack = new Error().stack;
            }
            catch (e) { }
            console.error(message + "STACK: " + stack);
            throw message;
        };
        this.logAndReThrow = function (message, exception) {
            var stack = "[stack, not supported]";
            try {
                stack = new Error().stack;
            }
            catch (e) { }
            console.error(message + "STACK: " + stack);
            throw exception;
        };
        this.ajaxReady = function (requestName) {
            if (util._ajaxCounter > 0) {
                console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
                return false;
            }
            return true;
        };
        this.isAjaxWaiting = function () {
            return util._ajaxCounter > 0;
        };
        this.delayedFocus = function (id) {
            setTimeout(function () {
                $(id).focus();
            }, 500);
            setTimeout(function () {
                $(id).focus();
            }, 1300);
        };
        this.checkSuccess = function (opFriendlyName, res) {
            if (!res.success) {
                (new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
            }
            return res.success;
        };
        this.addAll = function (obj, a) {
            for (var i = 0; i < a.length; i++) {
                if (!a[i]) {
                    console.error("null element in addAll at idx=" + i);
                }
                else {
                    obj[a[i]] = true;
                }
            }
        };
        this.nullOrUndef = function (obj) {
            return obj === null || obj === undefined;
        };
        this.getUidForId = function (map, id) {
            var uid = map[id];
            if (!uid) {
                uid = "" + meta64.nextUid++;
                map[id] = uid;
            }
            return uid;
        };
        this.elementExists = function (id) {
            if (util.startsWith(id, "#")) {
                id = id.substring(1);
            }
            if (util.contains(id, "#")) {
                console.log("Invalid # in domElm");
                return null;
            }
            var e = document.getElementById(id);
            return e != null;
        };
        this.getTextAreaValById = function (id) {
            var de = util.domElm(id);
            return de.value;
        };
        this.domElm = function (id) {
            if (util.startsWith(id, "#")) {
                id = id.substring(1);
            }
            if (util.contains(id, "#")) {
                console.log("Invalid # in domElm");
                return null;
            }
            var e = document.getElementById(id);
            if (!e) {
                console.log("domElm Error. Required element id not found: " + id);
            }
            return e;
        };
        this.poly = function (id) {
            return util.polyElm(id).node;
        };
        this.polyElm = function (id) {
            if (util.startsWith(id, "#")) {
                id = id.substring(1);
            }
            if (util.contains(id, "#")) {
                console.log("Invalid # in domElm");
                return null;
            }
            var e = document.getElementById(id);
            if (!e) {
                console.log("domElm Error. Required element id not found: " + id);
            }
            return Polymer.dom(e);
        };
        this.polyElmNode = function (id) {
            var e = util.polyElm(id);
            return e.node;
        };
        this.getRequiredElement = function (id) {
            var e = $(id);
            if (e == null) {
                console.log("getRequiredElement. Required element id not found: " + id);
            }
            return e;
        };
        this.isObject = function (obj) {
            return obj && obj.length != 0;
        };
        this.currentTimeMillis = function () {
            return new Date().getMilliseconds();
        };
        this.emptyString = function (val) {
            return !val || val.length == 0;
        };
        this.getInputVal = function (id) {
            return util.polyElm(id).node.value;
        };
        this.setInputVal = function (id, val) {
            if (val == null) {
                val = "";
            }
            var elm = util.polyElm(id);
            if (elm) {
                elm.node.value = val;
            }
            return elm != null;
        };
        this.bindEnterKey = function (id, func) {
            util.bindKey(id, func, 13);
        };
        this.bindKey = function (id, func, keyCode) {
            $(id).keypress(function (e) {
                if (e.which == keyCode) {
                    func();
                    return false;
                }
            });
            return false;
        };
        this.changeOrAddClass = function (elm, oldClass, newClass) {
            var elmement = $(elm);
            elmement.toggleClass(oldClass, false);
            elmement.toggleClass(newClass, true);
        };
        this.verifyType = function (obj, type, msg) {
            if (typeof obj !== type) {
                (new MessageDlg(msg)).open();
                return false;
            }
            return true;
        };
        this.setHtml = function (id, content) {
            if (content == null) {
                content = "";
            }
            var elm = util.domElm(id);
            var polyElm = Polymer.dom(elm);
            polyElm.innerHTML = content;
            Polymer.dom.flush();
            Polymer.updateStyles();
        };
        this.getPropertyCount = function (obj) {
            var count = 0;
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    count++;
                }
            }
            return count;
        };
        this.printObject = function (obj) {
            if (!obj) {
                return "null";
            }
            var val = "";
            try {
                var count = 0;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        console.log("Property[" + count + "]");
                        count++;
                    }
                }
                $.each(obj, function (k, v) {
                    val += k + " , " + v + "\n";
                });
            }
            catch (err) {
                return "err";
            }
            return val;
        };
        this.printKeys = function (obj) {
            if (!obj)
                return "null";
            var val = "";
            $.each(obj, function (k, v) {
                if (!k) {
                    k = "null";
                }
                if (val.length > 0) {
                    val += ',';
                }
                val += k;
            });
            return val;
        };
        this.setEnablement = function (elmId, enable) {
            var elm = null;
            if (typeof elmId == "string") {
                elm = util.domElm(elmId);
            }
            else {
                elm = elmId;
            }
            if (elm == null) {
                console.log("setVisibility couldn't find item: " + elmId);
                return;
            }
            if (!enable) {
                elm.disabled = true;
            }
            else {
                elm.disabled = false;
            }
        };
        this.setVisibility = function (elmId, vis) {
            var elm = null;
            if (typeof elmId == "string") {
                elm = util.domElm(elmId);
            }
            else {
                elm = elmId;
            }
            if (elm == null) {
                console.log("setVisibility couldn't find item: " + elmId);
                return;
            }
            if (vis) {
                $(elm).show();
            }
            else {
                $(elm).hide();
            }
        };
        this.getInstance = function (context, name) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var instance = Object.create(context[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        };
    }
    return Util;
}());
Util.stdTimezoneOffset = function (_) {
    var jan = new Date(_.getFullYear(), 0, 1);
    var jul = new Date(_.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Util.dst = function (_) {
    return _.getTimezoneOffset() < Util.stdTimezoneOffset(_);
};
var util = new Util();
var JCRConstants = (function () {
    function JCRConstants() {
        this.COMMENT_BY = "commentBy";
        this.PUBLIC_APPEND = "publicAppend";
        this.PRIMARY_TYPE = "jcr:primaryType";
        this.POLICY = "rep:policy";
        this.MIXIN_TYPES = "jcr:mixinTypes";
        this.EMAIL_CONTENT = "jcr:content";
        this.EMAIL_RECIP = "recip";
        this.EMAIL_SUBJECT = "subject";
        this.CREATED = "jcr:created";
        this.CREATED_BY = "jcr:createdBy";
        this.CONTENT = "jcr:content";
        this.TAGS = "tags";
        this.UUID = "jcr:uuid";
        this.LAST_MODIFIED = "jcr:lastModified";
        this.LAST_MODIFIED_BY = "jcr:lastModifiedBy";
        this.JSON_FILE_SEARCH_RESULT = "meta64:json";
        this.DISABLE_INSERT = "disableInsert";
        this.USER = "user";
        this.PWD = "pwd";
        this.EMAIL = "email";
        this.CODE = "code";
        this.BIN_VER = "binVer";
        this.BIN_DATA = "jcrData";
        this.BIN_MIME = "jcr:mimeType";
        this.IMG_WIDTH = "imgWidth";
        this.IMG_HEIGHT = "imgHeight";
    }
    return JCRConstants;
}());
var jcrCnst = new JCRConstants();
var Attachment = (function () {
    function Attachment() {
        this.uploadNode = null;
        this.openUploadFromFileDlg = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                attachment.uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            attachment.uploadNode = node;
            (new UploadFromFileDropzoneDlg()).open();
        };
        this.openUploadFromUrlDlg = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                attachment.uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            attachment.uploadNode = node;
            (new UploadFromUrlDlg()).open();
        };
        this.deleteAttachment = function () {
            var node = meta64.getHighlightedNode();
            if (node) {
                (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                    util.json("deleteAttachment", {
                        "nodeId": node.id
                    }, attachment.deleteAttachmentResponse, null, node.uid);
                })).open();
            }
        };
        this.deleteAttachmentResponse = function (res, uid) {
            if (util.checkSuccess("Delete attachment", res)) {
                meta64.removeBinaryByUid(uid);
                meta64.goToMainPage(true);
            }
        };
    }
    return Attachment;
}());
var attachment = new Attachment();
var Edit = (function () {
    function Edit() {
        this.createNode = function () {
            (new CreateNodeDlg()).open();
        };
        this.insertBookResponse = function (res) {
            console.log("insertBookResponse running.");
            util.checkSuccess("Insert Book", res);
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        };
        this.deleteNodesResponse = function (res, payload) {
            if (util.checkSuccess("Delete node", res)) {
                meta64.clearSelectedNodes();
                var highlightId = null;
                if (payload) {
                    var selNode = payload["postDeleteSelNode"];
                    if (selNode) {
                        highlightId = selNode.id;
                    }
                }
                view.refreshTree(null, false, highlightId);
            }
        };
        this.initNodeEditResponse = function (res) {
            if (util.checkSuccess("Editing node", res)) {
                var node = res.nodeInfo;
                var isRep = util.startsWith(node.name, "rep:") ||
                    util.contains(node.path, "/rep:");
                var editingAllowed = props.isOwnedCommentNode(node);
                if (!editingAllowed) {
                    editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                        && !props.isNonOwnedNode(node);
                }
                if (editingAllowed) {
                    edit.editNode = res.nodeInfo;
                    edit.editNodeDlgInst = new EditNodeDlg();
                    edit.editNodeDlgInst.open();
                }
                else {
                    (new MessageDlg("You cannot edit nodes that you don't own.")).open();
                }
            }
        };
        this.moveNodesResponse = function (res) {
            if (util.checkSuccess("Move nodes", res)) {
                edit.nodesToMove = null;
                edit.nodesToMoveSet = {};
                view.refreshTree(null, false);
            }
        };
        this.setNodePositionResponse = function (res) {
            if (util.checkSuccess("Change node position", res)) {
                meta64.refresh();
            }
        };
        this.showReadOnlyProperties = true;
        this.nodesToMove = null;
        this.nodesToMoveSet = {};
        this.parentOfNewNode = null;
        this.editingUnsavedNode = false;
        this.sendNotificationPendingSave = false;
        this.editNode = null;
        this.editNodeDlgInst = null;
        this.nodeInsertTarget = null;
        this.isEditAllowed = function (node) {
            return meta64.userPreferences.editMode && node.path != "/" &&
                (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
                && !props.isNonOwnedNode(node);
        };
        this.isInsertAllowed = function (node) {
            return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
        };
        this.startEditingNewNode = function (typeName, createAtTop) {
            edit.editingUnsavedNode = false;
            edit.editNode = null;
            edit.editNodeDlgInst = new EditNodeDlg(typeName, createAtTop);
            edit.editNodeDlgInst.saveNewNode("");
        };
        this.startEditingNewNodeWithName = function () {
            edit.editingUnsavedNode = true;
            edit.editNode = null;
            edit.editNodeDlgInst = new EditNodeDlg();
            edit.editNodeDlgInst.open();
        };
        this.insertNodeResponse = function (res) {
            if (util.checkSuccess("Insert node", res)) {
                meta64.initNode(res.newNode, true);
                meta64.highlightNode(res.newNode, true);
                edit.runEditNode(res.newNode.uid);
            }
        };
        this.createSubNodeResponse = function (res) {
            if (util.checkSuccess("Create subnode", res)) {
                meta64.initNode(res.newNode, true);
                edit.runEditNode(res.newNode.uid);
            }
        };
        this.saveNodeResponse = function (res, payload) {
            if (util.checkSuccess("Save node", res)) {
                view.refreshTree(null, false, payload.savedId);
                meta64.selectTab("mainTabName");
            }
        };
        this.editMode = function (modeVal) {
            if (typeof modeVal != 'undefined') {
                meta64.userPreferences.editMode = modeVal;
            }
            else {
                meta64.userPreferences.editMode = meta64.userPreferences.editMode ? false : true;
            }
            render.renderPageFromData();
            view.scrollToSelectedNode();
            meta64.saveUserPreferences();
        };
        this.moveNodeUp = function (uid) {
            if (!uid) {
                var selNode = meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": "[nodeAbove]"
                }, edit.setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        this.moveNodeDown = function (uid) {
            if (!uid) {
                var selNode = meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": "[nodeBelow]",
                    "siblingId": node.name
                }, edit.setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        this.moveNodeToTop = function (uid) {
            if (!uid) {
                var selNode = meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": "[topNode]"
                }, edit.setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        this.moveNodeToBottom = function (uid) {
            if (!uid) {
                var selNode = meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": node.name,
                    "siblingId": null
                }, edit.setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        this.getNodeAbove = function (node) {
            var ordinal = meta64.getOrdinalOfNode(node);
            if (ordinal <= 0)
                return null;
            return meta64.currentNodeData.children[ordinal - 1];
        };
        this.getNodeBelow = function (node) {
            var ordinal = meta64.getOrdinalOfNode(node);
            console.log("ordinal = " + ordinal);
            if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
                return null;
            return meta64.currentNodeData.children[ordinal + 1];
        };
        this.getFirstChildNode = function () {
            if (!meta64.currentNodeData || !meta64.currentNodeData.children)
                return null;
            return meta64.currentNodeData.children[0];
        };
        this.runEditNode = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                edit.editNode = null;
                (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            edit.editingUnsavedNode = false;
            util.json("initNodeEdit", {
                "nodeId": node.id
            }, edit.initNodeEditResponse);
        };
        this.insertNode = function (uid, typeName) {
            edit.parentOfNewNode = meta64.currentNode;
            if (!edit.parentOfNewNode) {
                console.log("Unknown parent");
                return;
            }
            var node = null;
            if (!uid) {
                node = meta64.getHighlightedNode();
            }
            else {
                node = meta64.uidToNodeMap[uid];
            }
            if (node) {
                edit.nodeInsertTarget = node;
                edit.startEditingNewNode(typeName);
            }
        };
        this.createSubNode = function (uid, typeName, createAtTop) {
            if (!uid) {
                var highlightNode = meta64.getHighlightedNode();
                if (highlightNode) {
                    edit.parentOfNewNode = highlightNode;
                }
                else {
                    edit.parentOfNewNode = meta64.currentNode;
                }
            }
            else {
                edit.parentOfNewNode = meta64.uidToNodeMap[uid];
                if (!edit.parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }
            edit.nodeInsertTarget = null;
            edit.startEditingNewNode(typeName, createAtTop);
        };
        this.replyToComment = function (uid) {
            edit.createSubNode(uid);
        };
        this.clearSelections = function () {
            meta64.clearSelectedNodes();
            render.renderPageFromData();
            meta64.selectTab("mainTabName");
        };
        this.deleteSelNodes = function () {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
                return;
            }
            (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
                var postDeleteSelNode = edit.getBestPostDeleteSelNode();
                util.json("deleteNodes", {
                    "nodeIds": selNodesArray
                }, edit.deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
            })).open();
        };
        this.getBestPostDeleteSelNode = function () {
            var nodesMap = meta64.getSelectedNodesAsMapById();
            var bestNode = null;
            var takeNextNode = false;
            for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                var node = meta64.currentNodeData.children[i];
                if (takeNextNode) {
                    return node;
                }
                if (nodesMap[node.id]) {
                    takeNextNode = true;
                }
                else {
                    bestNode = node;
                }
            }
            return bestNode;
        };
        this.cutSelNodes = function () {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes first.")).open();
                return;
            }
            (new ConfirmDlg("Confirm Cut", "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?", "Yes", function () {
                edit.nodesToMove = selNodesArray;
                edit.loadNodesToMoveSet(selNodesArray);
                meta64.selectedNodes = {};
                render.renderPageFromData();
                meta64.refreshAllGuiEnablement();
            })).open();
        };
        this.loadNodesToMoveSet = function (nodeIds) {
            edit.nodesToMoveSet = {};
            for (var _i = 0, nodeIds_1 = nodeIds; _i < nodeIds_1.length; _i++) {
                var id = nodeIds_1[_i];
                edit.nodesToMoveSet[id] = true;
            }
        };
        this.pasteSelNodes = function () {
            (new ConfirmDlg("Confirm Paste", "Paste " + edit.nodesToMove.length + " node(s) under selected parent node ?", "Yes, paste.", function () {
                var highlightNode = meta64.getHighlightedNode();
                util.json("moveNodes", {
                    "targetNodeId": highlightNode.id,
                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                    "nodeIds": edit.nodesToMove
                }, edit.moveNodesResponse);
            })).open();
        };
        this.insertBookWarAndPeace = function () {
            (new ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function () {
                var node = meta64.getHighlightedNode();
                if (!node) {
                    (new MessageDlg("No node is selected.")).open();
                }
                else {
                    util.json("insertBook", {
                        "nodeId": node.id,
                        "bookName": "War and Peace",
                        "truncated": user.isTestUserAccount()
                    }, edit.insertBookResponse);
                }
            })).open();
        };
    }
    return Edit;
}());
var edit = new Edit();
var Meta64 = (function () {
    function Meta64() {
        this.appInitialized = false;
        this.curUrlPath = window.location.pathname + window.location.search;
        this.codeFormatDirty = false;
        this.nextGuid = 0;
        this.userName = "anonymous";
        this.deviceWidth = 0;
        this.deviceHeight = 0;
        this.homeNodeId = "";
        this.homeNodePath = "";
        this.isAdminUser = false;
        this.isAnonUser = true;
        this.anonUserLandingPageNode = null;
        this.allowFileSystemSearch = false;
        this.treeDirty = false;
        this.uidToNodeMap = {};
        this.idToNodeMap = {};
        this.aceEditorsById = {};
        this.nextUid = 1;
        this.identToUidMap = {};
        this.parentUidToFocusNodeMap = {};
        this.MODE_ADVANCED = "advanced";
        this.MODE_SIMPLE = "simple";
        this.editModeOption = "simple";
        this.showProperties = false;
        this.showMetaData = false;
        this.simpleModeNodePrefixBlackList = {
            "rep:": true
        };
        this.simpleModePropertyBlackList = {};
        this.readOnlyPropertyList = {};
        this.binaryPropertyList = {};
        this.selectedNodes = {};
        this.expandedAbbrevNodeIds = {};
        this.currentNodeData = null;
        this.currentNode = null;
        this.currentNodeUid = null;
        this.currentNodeId = null;
        this.currentNodePath = null;
        this.dataObjMap = {};
        this.renderFunctionsByJcrType = {};
        this.propOrderingFunctionsByJcrType = {};
        this.userPreferences = {
            "editMode": false,
            "advancedMode": false,
            "lastNode": "",
            "importAllowed": false,
            "exportAllowed": false,
            "showMetaData": false
        };
        this.updateMainMenuPanel = function () {
            console.log("building main menu panel");
            menuPanel.build();
            menuPanel.init();
        };
        this.registerDataObject = function (data) {
            if (!data.guid) {
                data.guid = ++meta64.nextGuid;
                meta64.dataObjMap[data.guid] = data;
            }
        };
        this.getObjectByGuid = function (guid) {
            var ret = meta64.dataObjMap[guid];
            if (!ret) {
                console.log("data object not found: guid=" + guid);
            }
            return ret;
        };
        this.encodeOnClick = function (callback, ctx, payload, delayCallback) {
            if (typeof callback == "string") {
                return callback;
            }
            else if (typeof callback == "function") {
                meta64.registerDataObject(callback);
                if (ctx) {
                    meta64.registerDataObject(ctx);
                    if (payload) {
                        meta64.registerDataObject(payload);
                    }
                    var payloadStr = payload ? payload.guid : "null";
                    return "meta64.runCallback(" + callback.guid + "," + ctx.guid + "," + payloadStr + "," + delayCallback + ");";
                }
                else {
                    return "meta64.runCallback(" + callback.guid + ",null,null," + delayCallback + ");";
                }
            }
            else {
                throw "unexpected callback type in encodeOnClick";
            }
        };
        this.runCallback = function (guid, ctx, payload, delayCallback) {
            console.log("callback run: " + delayCallback);
            if (delayCallback > 0) {
                setTimeout(function () {
                    meta64.runCallbackImmediate(guid, ctx, payload);
                }, delayCallback);
            }
            else {
                return meta64.runCallbackImmediate(guid, ctx, payload);
            }
        };
        this.runCallbackImmediate = function (guid, ctx, payload) {
            var dataObj = meta64.getObjectByGuid(guid);
            if (dataObj.callback) {
                dataObj.callback();
            }
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = meta64.getObjectByGuid(ctx);
                    var payloadObj = payload ? meta64.getObjectByGuid(payload) : null;
                    dataObj.call(thiz, payloadObj);
                }
                else {
                    dataObj();
                }
            }
            else {
                throw "unable to find callback on registered guid: " + guid;
            }
        };
        this.inSimpleMode = function () {
            return meta64.editModeOption === meta64.MODE_SIMPLE;
        };
        this.refresh = function () {
            meta64.goToMainPage(true, true);
        };
        this.goToMainPage = function (rerender, forceServerRefresh) {
            if (forceServerRefresh) {
                meta64.treeDirty = true;
            }
            if (rerender || meta64.treeDirty) {
                if (meta64.treeDirty) {
                    view.refreshTree(null, true);
                }
                else {
                    render.renderPageFromData();
                    meta64.refreshAllGuiEnablement();
                }
            }
            else {
                view.scrollToSelectedNode();
            }
        };
        this.selectTab = function (pageName) {
            var ironPages = document.querySelector("#mainIronPages");
            ironPages.select(pageName);
        };
        this.changePage = function (pg, data) {
            if (typeof pg.tabId === 'undefined') {
                console.log("oops, wrong object type passed to changePage function.");
                return null;
            }
            var paperTabs = document.querySelector("#mainIronPages");
            paperTabs.select(pg.tabId);
        };
        this.isNodeBlackListed = function (node) {
            if (!meta64.inSimpleMode())
                return false;
            var prop;
            for (prop in meta64.simpleModeNodePrefixBlackList) {
                if (meta64.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && util.startsWith(node.name, prop)) {
                    return true;
                }
            }
            return false;
        };
        this.getSelectedNodeUidsArray = function () {
            var selArray = [], uid;
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    selArray.push(uid);
                }
            }
            return selArray;
        };
        this.getSelectedNodeIdsArray = function () {
            var selArray = [], uid;
            if (!meta64.selectedNodes) {
                console.log("no selected nodes.");
            }
            else {
                console.log("selectedNode count: " + util.getPropertyCount(meta64.selectedNodes));
            }
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    var node = meta64.uidToNodeMap[uid];
                    if (!node) {
                        console.log("unable to find uidToNodeMap for uid=" + uid);
                    }
                    else {
                        selArray.push(node.id);
                    }
                }
            }
            return selArray;
        };
        this.getSelectedNodesAsMapById = function () {
            var ret = {};
            var selArray = this.getSelectedNodesArray();
            for (var i = 0; i < selArray.length; i++) {
                ret[selArray[i].id] = selArray[i];
            }
            return ret;
        };
        this.getSelectedNodesArray = function () {
            var selArray = [];
            var idx = 0;
            var uid = "";
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = meta64.uidToNodeMap[uid];
                }
            }
            return selArray;
        };
        this.clearSelectedNodes = function () {
            meta64.selectedNodes = {};
        };
        this.updateNodeInfoResponse = function (res, node) {
            var ownerBuf = "";
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
                var elmId = "#ownerDisplay" + node.uid;
                var elm = $(elmId);
                elm.html(" (Manager: " + ownerBuf + ")");
                if (mine) {
                    util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
                }
                else {
                    util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
                }
            }
        };
        this.updateNodeInfo = function (node) {
            util.json("getNodePrivileges", {
                "nodeId": node.id,
                "includeAcl": false,
                "includeOwners": true
            }, function (res) {
                meta64.updateNodeInfoResponse(res, node);
            });
        };
        this.getNodeFromId = function (id) {
            return meta64.idToNodeMap[id];
        };
        this.getPathOfUid = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                return "[path error. invalid uid: " + uid + "]";
            }
            else {
                return node.path;
            }
        };
        this.getHighlightedNode = function () {
            var ret = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
            return ret;
        };
        this.highlightRowById = function (id, scroll) {
            var node = meta64.getNodeFromId(id);
            if (node) {
                meta64.highlightNode(node, scroll);
            }
            else {
                console.log("highlightRowById failed to find id: " + id);
            }
        };
        this.highlightNode = function (node, scroll) {
            if (!node)
                return;
            var doneHighlighting = false;
            var curHighlightedNode = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
            if (curHighlightedNode) {
                if (curHighlightedNode.uid === node.uid) {
                    doneHighlighting = true;
                }
                else {
                    var rowElmId = curHighlightedNode.uid + "_row";
                    var rowElm = $("#" + rowElmId);
                    util.changeOrAddClass("#" + rowElmId, "active-row", "inactive-row");
                }
            }
            if (!doneHighlighting) {
                meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;
                var rowElmId = node.uid + "_row";
                var rowElm = $("#" + rowElmId);
                if (!rowElm || rowElm.length == 0) {
                    console.log("Unable to find rowElement to highlight: " + rowElmId);
                }
                util.changeOrAddClass("#" + rowElmId, "inactive-row", "active-row");
            }
            if (scroll) {
                view.scrollToSelectedNode();
            }
        };
        this.refreshAllGuiEnablement = function () {
            var prevPageExists = nav.mainOffset > 0;
            var nextPageExists = !nav.endReached;
            var selNodeCount = util.getPropertyCount(meta64.selectedNodes);
            var highlightNode = meta64.getHighlightedNode();
            var selNodeIsMine = highlightNode != null && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
            var homeNodeSelected = highlightNode != null && meta64.homeNodeId == highlightNode.id;
            var importFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.importAllowed;
            var exportFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
            var highlightOrdinal = meta64.getOrdinalOfNode(highlightNode);
            var numChildNodes = meta64.getNumChildNodes();
            var canMoveUp = (highlightOrdinal > 0 && numChildNodes > 1) || prevPageExists;
            var canMoveDown = (highlightOrdinal < numChildNodes - 1 && numChildNodes > 1) || nextPageExists;
            var canCreateNode = meta64.userPreferences.editMode && (meta64.isAdminUser || (!meta64.isAnonUser));
            console.log("enablement: isAnonUser=" + meta64.isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);
            util.setEnablement("navLogoutButton", !meta64.isAnonUser);
            util.setEnablement("openSignupPgButton", meta64.isAnonUser);
            var propsToggle = meta64.currentNode && !meta64.isAnonUser;
            util.setEnablement("propsToggleButton", propsToggle);
            var allowEditMode = meta64.currentNode && !meta64.isAnonUser;
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
            util.setVisibility("adminMenu", meta64.isAdminUser);
            Polymer.dom.flush();
            Polymer.updateStyles();
        };
        this.getSingleSelectedNode = function () {
            var uid;
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    return meta64.uidToNodeMap[uid];
                }
            }
            return null;
        };
        this.getOrdinalOfNode = function (node) {
            if (!node || !meta64.currentNodeData || !meta64.currentNodeData.children)
                return -1;
            for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                if (node.id === meta64.currentNodeData.children[i].id) {
                    return i;
                }
            }
            return -1;
        };
        this.getNumChildNodes = function () {
            if (!meta64.currentNodeData || !meta64.currentNodeData.children)
                return 0;
            return meta64.currentNodeData.children.length;
        };
        this.setCurrentNodeData = function (data) {
            meta64.currentNodeData = data;
            meta64.currentNode = data.node;
            meta64.currentNodeUid = data.node.uid;
            meta64.currentNodeId = data.node.id;
            meta64.currentNodePath = data.node.path;
        };
        this.anonPageLoadResponse = function (res) {
            if (res.renderNodeResponse) {
                util.setVisibility("mainNodeContent", true);
                render.renderPageFromData(res.renderNodeResponse);
                meta64.refreshAllGuiEnablement();
            }
            else {
                util.setVisibility("mainNodeContent", false);
                console.log("setting listview to: " + res.content);
                util.setHtml("listView", res.content);
            }
        };
        this.removeBinaryByUid = function (uid) {
            for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                var node = meta64.currentNodeData.children[i];
                if (node.uid === uid) {
                    node.hasBinary = false;
                    break;
                }
            }
        };
        this.initNode = function (node, updateMaps) {
            if (!node) {
                console.log("initNode has null node");
                return;
            }
            node.uid = updateMaps ? util.getUidForId(meta64.identToUidMap, node.id) : meta64.identToUidMap[node.id];
            node.properties = props.getPropertiesInEditingOrder(node, node.properties);
            node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            node.lastModified = new Date(props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node));
            if (updateMaps) {
                meta64.uidToNodeMap[node.uid] = node;
                meta64.idToNodeMap[node.id] = node;
            }
        };
        this.initConstants = function () {
            util.addAll(meta64.simpleModePropertyBlackList, [
                jcrCnst.MIXIN_TYPES,
                jcrCnst.PRIMARY_TYPE,
                jcrCnst.POLICY,
                jcrCnst.IMG_WIDTH,
                jcrCnst.IMG_HEIGHT,
                jcrCnst.BIN_VER,
                jcrCnst.BIN_DATA,
                jcrCnst.BIN_MIME,
                jcrCnst.COMMENT_BY,
                jcrCnst.PUBLIC_APPEND
            ]);
            util.addAll(meta64.readOnlyPropertyList, [
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
                jcrCnst.PUBLIC_APPEND
            ]);
            util.addAll(meta64.binaryPropertyList, [jcrCnst.BIN_DATA]);
        };
        this.initApp = function () {
            console.log("initApp running.");
            meta64.renderFunctionsByJcrType["meta64:rssfeed"] = podcast.renderFeedNode;
            meta64.renderFunctionsByJcrType["meta64:rssitem"] = podcast.renderItemNode;
            meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = podcast.propOrderingFeedNode;
            meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = podcast.propOrderingItemNode;
            meta64.renderFunctionsByJcrType["meta64:systemfolder"] = systemfolder.renderNode;
            meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = systemfolder.propOrdering;
            meta64.renderFunctionsByJcrType["meta64:filelist"] = systemfolder.renderFileListNode;
            meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = systemfolder.fileListPropOrdering;
            window.addEvent = function (object, type, callback) {
                if (object == null || typeof (object) == 'undefined')
                    return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                }
                else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                }
                else {
                    object["on" + type] = callback;
                }
            };
            window.addEventListener('polymer-ready', function (e) {
                console.log('polymer-ready event!');
            });
            console.log("running module: cnst.js");
            if (meta64.appInitialized)
                return;
            meta64.appInitialized = true;
            var tabs = util.poly("mainIronPages");
            tabs.addEventListener("iron-select", function () {
                meta64.tabChangeEvent(tabs.selected);
            });
            meta64.initConstants();
            meta64.displaySignupMessage();
            $(window).bind("beforeunload", function () {
                return "Leave Meta64 ?";
            });
            meta64.deviceWidth = $(window).width();
            meta64.deviceHeight = $(window).height();
            user.refreshLogin();
            meta64.updateMainMenuPanel();
            meta64.refreshAllGuiEnablement();
            util.initProgressMonitor();
            meta64.processUrlParams();
        };
        this.processUrlParams = function () {
            var passCode = util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function () {
                    (new ChangePasswordDlg(passCode)).open();
                }, 100);
            }
            meta64.urlCmd = util.getParameterByName("cmd");
        };
        this.tabChangeEvent = function (tabName) {
            if (tabName == "searchTabName") {
                srch.searchTabActivated();
            }
        };
        this.displaySignupMessage = function () {
            var signupResponse = $("#signupCodeResponse").text();
            if (signupResponse === "ok") {
                (new MessageDlg("Signup complete. You may now login.")).open();
            }
        };
        this.screenSizeChange = function () {
            if (meta64.currentNodeData) {
                if (meta64.currentNode.imgId) {
                    render.adjustImageSize(meta64.currentNode);
                }
                $.each(meta64.currentNodeData.children, function (i, node) {
                    if (node.imgId) {
                        render.adjustImageSize(node);
                    }
                });
            }
        };
        this.orientationHandler = function (event) {
        };
        this.loadAnonPageHome = function (ignoreUrl) {
            util.json("anonPageLoad", {
                "ignoreUrl": ignoreUrl
            }, meta64.anonPageLoadResponse);
        };
        this.saveUserPreferences = function () {
            util.json("saveUserPreferences", {
                "userPreferences": meta64.userPreferences
            });
        };
        this.openSystemFile = function (fileName) {
            util.json("openSystemFile", {
                "fileName": fileName
            });
        };
        this.editSystemFile = function (fileName) {
            new EditSystemFileDlg(fileName).open();
        };
    }
    return Meta64;
}());
var meta64 = new Meta64();
var Nav = (function () {
    function Nav() {
        this._UID_ROWID_SUFFIX = "_row";
        this.mainOffset = 0;
        this.endReached = true;
        this.ROWS_PER_PAGE = 25;
        this.openMainMenuHelp = function () {
            nav.mainOffset = 0;
            util.json("renderNode", {
                "nodeId": "/meta64/public/help",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        };
        this.openRssFeedsNode = function () {
            nav.mainOffset = 0;
            util.json("renderNode", {
                "nodeId": "/rss/feeds",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        };
        this.expandMore = function (nodeId) {
            meta64.expandedAbbrevNodeIds[nodeId] = true;
            util.json("expandAbbreviatedNode", {
                "nodeId": nodeId
            }, nav.expandAbbreviatedNodeResponse);
        };
        this.expandAbbreviatedNodeResponse = function (res) {
            if (util.checkSuccess("ExpandAbbreviatedNode", res)) {
                render.refreshNodeOnPage(res.nodeInfo);
            }
        };
        this.displayingHome = function () {
            if (meta64.isAnonUser) {
                return meta64.currentNodeId === meta64.anonUserLandingPageNode;
            }
            else {
                return meta64.currentNodeId === meta64.homeNodeId;
            }
        };
        this.parentVisibleToUser = function () {
            return !nav.displayingHome();
        };
        this.upLevelResponse = function (res, id) {
            if (!res || !res.node) {
                (new MessageDlg("No data is visible to you above this node.")).open();
            }
            else {
                render.renderPageFromData(res);
                meta64.highlightRowById(id, true);
                meta64.refreshAllGuiEnablement();
            }
        };
        this.navUpLevel = function () {
            if (!nav.parentVisibleToUser()) {
                return;
            }
            nav.mainOffset = 0;
            var ironRes = util.json("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": 1,
                "renderParentIfLeaf": false,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, function (res) {
                nav.upLevelResponse(ironRes.response, meta64.currentNodeId);
            });
        };
        this.getSelectedDomElement = function () {
            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                    return util.domElm(nodeId);
                }
            }
            return null;
        };
        this.getSelectedPolyElement = function () {
            try {
                var currentSelNode = meta64.getHighlightedNode();
                if (currentSelNode) {
                    var node = meta64.uidToNodeMap[currentSelNode.uid];
                    if (node) {
                        console.log("found highlighted node.id=" + node.id);
                        var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                        console.log("looking up using element id: " + nodeId);
                        return util.polyElm(nodeId);
                    }
                }
                else {
                    console.log("no node highlighted");
                }
            }
            catch (e) {
                util.logAndThrow("getSelectedPolyElement failed.");
            }
            return null;
        };
        this.clickOnNodeRow = function (rowElm, uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                return;
            }
            meta64.highlightNode(node, false);
            if (meta64.userPreferences.editMode) {
                if (!node.owner) {
                    console.log("calling updateNodeInfo");
                    meta64.updateNodeInfo(node);
                }
            }
            meta64.refreshAllGuiEnablement();
        };
        this.openNode = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            meta64.highlightNode(node, true);
            if (!node) {
                (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
            }
            else {
                view.refreshTree(node.id, false);
            }
        };
        this.toggleNodeSel = function (uid) {
            var toggleButton = util.polyElm(uid + "_sel");
            setTimeout(function () {
                if (toggleButton.node.checked) {
                    meta64.selectedNodes[uid] = true;
                }
                else {
                    delete meta64.selectedNodes[uid];
                }
                view.updateStatusBar();
                meta64.refreshAllGuiEnablement();
            }, 500);
        };
        this.navPageNodeResponse = function (res) {
            meta64.clearSelectedNodes();
            render.renderPageFromData(res);
            view.scrollToTop();
            meta64.refreshAllGuiEnablement();
        };
        this.navHome = function () {
            if (meta64.isAnonUser) {
                meta64.loadAnonPageHome(true);
            }
            else {
                nav.mainOffset = 0;
                util.json("renderNode", {
                    "nodeId": meta64.homeNodeId,
                    "upLevel": null,
                    "renderParentIfLeaf": null,
                    "offset": nav.mainOffset,
                    "goToLastPage": false
                }, nav.navPageNodeResponse);
            }
        };
        this.navPublicHome = function () {
            meta64.loadAnonPageHome(true);
        };
    }
    return Nav;
}());
var nav = new Nav();
var Prefs = (function () {
    function Prefs() {
        this.closeAccountResponse = function (res) {
            $(window).off("beforeunload");
            window.location.href = window.location.origin;
        };
        this.closeAccount = function () {
            (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
                (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                    user.deleteAllUserCookies();
                    util.json("closeAccount", {}, prefs.closeAccountResponse);
                })).open();
            })).open();
        };
    }
    return Prefs;
}());
var prefs = new Prefs();
var Props = (function () {
    function Props() {
        this.orderProps = function (propOrder, _props) {
            var propsNew = util.arrayClone(_props);
            var targetIdx = 0;
            for (var _i = 0, propOrder_1 = propOrder; _i < propOrder_1.length; _i++) {
                var prop = propOrder_1[_i];
                targetIdx = props.moveNodePosition(propsNew, targetIdx, prop);
            }
            return propsNew;
        };
        this.moveNodePosition = function (props, idx, typeName) {
            var tagIdx = util.arrayIndexOfItemByProp(props, "name", typeName);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, idx++);
            }
            return idx;
        };
        this.propsToggle = function () {
            meta64.showProperties = meta64.showProperties ? false : true;
            render.renderPageFromData();
            view.scrollToSelectedNode();
            meta64.selectTab("mainTabName");
        };
        this.deletePropertyFromLocalData = function (propertyName) {
            for (var i = 0; i < edit.editNode.properties.length; i++) {
                if (propertyName === edit.editNode.properties[i].name) {
                    edit.editNode.properties.splice(i, 1);
                    break;
                }
            }
        };
        this.getPropertiesInEditingOrder = function (node, _props) {
            var func = meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
            if (func) {
                return func(node, _props);
            }
            var propsNew = util.arrayClone(_props);
            props.movePropsToTop([jcrCnst.CONTENT, jcrCnst.TAGS], propsNew);
            props.movePropsToEnd([jcrCnst.CREATED, jcrCnst.CREATED_BY, jcrCnst.LAST_MODIFIED, jcrCnst.LAST_MODIFIED_BY], propsNew);
            return propsNew;
        };
        this.movePropsToTop = function (propsList, props) {
            for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
                var prop = propsList_1[_i];
                var tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    util.arrayMoveItem(props, tagIdx, 0);
                }
            }
        };
        this.movePropsToEnd = function (propsList, props) {
            for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
                var prop = propsList_2[_i];
                var tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    util.arrayMoveItem(props, tagIdx, props.length);
                }
            }
        };
        this.renderProperties = function (properties) {
            if (properties) {
                var table_1 = "";
                var propCount_1 = 0;
                $.each(properties, function (i, property) {
                    if (render.allowPropertyToDisplay(property.name)) {
                        var isBinaryProp = render.isBinaryProperty(property.name);
                        propCount_1++;
                        var td = render.tag("td", {
                            "class": "prop-table-name-col"
                        }, render.sanitizePropertyName(property.name));
                        var val = void 0;
                        if (isBinaryProp) {
                            val = "[binary]";
                        }
                        else if (!property.values) {
                            val = render.wrapHtml(property.value);
                        }
                        else {
                            val = props.renderPropertyValues(property.values);
                        }
                        td += render.tag("td", {
                            "class": "prop-table-val-col"
                        }, val);
                        table_1 += render.tag("tr", {
                            "class": "prop-table-row"
                        }, td);
                    }
                    else {
                        console.log("Hiding property: " + property.name);
                    }
                });
                if (propCount_1 == 0) {
                    return "";
                }
                return render.tag("table", {
                    "border": "1",
                    "class": "property-table"
                }, table_1);
            }
            else {
                return undefined;
            }
        };
        this.getNodeProperty = function (propertyName, node) {
            if (!node || !node.properties)
                return null;
            for (var i = 0; i < node.properties.length; i++) {
                var prop = node.properties[i];
                if (prop.name === propertyName) {
                    return prop;
                }
            }
            return null;
        };
        this.getNodePropertyVal = function (propertyName, node) {
            var prop = props.getNodeProperty(propertyName, node);
            return prop ? prop.value : null;
        };
        this.isNonOwnedNode = function (node) {
            var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            if (!createdBy) {
                createdBy = "admin";
            }
            return createdBy != meta64.userName;
        };
        this.isNonOwnedCommentNode = function (node) {
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != meta64.userName;
        };
        this.isOwnedCommentNode = function (node) {
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == meta64.userName;
        };
        this.renderProperty = function (property) {
            if (!property.values) {
                if (!property.value || property.value.length == 0) {
                    return "";
                }
                return property.value;
            }
            else {
                return props.renderPropertyValues(property.values);
            }
        };
        this.renderPropertyValues = function (values) {
            var ret = "<div>";
            var count = 0;
            $.each(values, function (i, value) {
                if (count > 0) {
                    ret += cnst.BR;
                }
                ret += render.wrapHtml(value);
                count++;
            });
            ret += "</div>";
            return ret;
        };
    }
    return Props;
}());
var props = new Props();
var Render = (function () {
    function Render() {
        this.debug = false;
        this.getEmptyPagePrompt = function () {
            return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
        };
        this.renderBinary = function (node) {
            if (node.binaryIsImage) {
                return render.makeImageTag(node);
            }
            else {
                var anchor = render.tag("a", {
                    "href": render.getUrlForNodeAttachment(node)
                }, "[Download Attachment]");
                return render.tag("div", {
                    "class": "binary-link"
                }, anchor);
            }
        };
        this.buidPage = function (pg, data) {
            console.log("buildPage: pg.domId=" + pg.domId);
            if (!pg.built || data) {
                pg.build(data);
                pg.built = true;
            }
            if (pg.init) {
                pg.init(data);
            }
        };
        this.buildRowHeader = function (node, showPath, showName) {
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            var headerText = "";
            if (cnst.SHOW_PATH_ON_ROWS) {
                headerText += "<div class='path-display'>Path: " + render.formatPath(node) + "</div>";
            }
            headerText += "<div>";
            if (commentBy) {
                var clazz = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
            }
            else if (node.createdBy) {
                var clazz = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Created By: " + node.createdBy + "</span>";
            }
            headerText += "<span id='ownerDisplay" + node.uid + "'></span>";
            if (node.lastModified) {
                headerText += "  Mod: " + node.lastModified;
            }
            headerText += "</div>";
            if (showName && !showPath && node.name) {
                headerText += "Name: " + node.name + " [uid=" + node.uid + "]";
            }
            headerText = render.tag("div", {
                "class": "header-text"
            }, headerText);
            return headerText;
        };
        this.injectCodeFormatting = function (content) {
            if (!content)
                return content;
            if (util.contains(content, "<code")) {
                meta64.codeFormatDirty = true;
                content = render.encodeLanguages(content);
                content = util.replaceAll(content, "</code>", "</pre>");
            }
            return content;
        };
        this.injectSubstitutions = function (content) {
            return util.replaceAll(content, "{{locationOrigin}}", window.location.origin);
        };
        this.encodeLanguages = function (content) {
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = util.replaceAll(content, "<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = util.replaceAll(content, "<code>", "<pre class='prettyprint'>");
            return content;
        };
        this.refreshNodeOnPage = function (node) {
            var uid = meta64.identToUidMap[node.id];
            if (!uid)
                throw "Unable to find nodeId " + node.id + " in uid map";
            meta64.initNode(node, false);
            if (uid != node.uid)
                throw "uid changed unexpectly after initNode";
            var rowContent = render.renderNodeContent(node, true, true, true, true, true);
            $("#" + uid + "_content").html(rowContent);
        };
        this.renderNodeContent = function (node, showPath, showName, renderBin, rowStyling, showHeader) {
            var ret = render.getTopRightImageTag(node);
            if (meta64.showMetaData) {
                ret += showHeader ? render.buildRowHeader(node, showPath, showName) : "";
            }
            if (meta64.showProperties) {
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += properties;
                }
            }
            else {
                var renderComplete = false;
                if (!renderComplete) {
                    var func = meta64.renderFunctionsByJcrType[node.primaryTypeName];
                    if (func) {
                        renderComplete = true;
                        ret += func(node, rowStyling);
                    }
                }
                if (!renderComplete) {
                    var contentProp = props.getNodeProperty(jcrCnst.CONTENT, node);
                    if (contentProp) {
                        renderComplete = true;
                        var jcrContent = props.renderProperty(contentProp);
                        var markedContent = "<marked-element sanitize='true'>" +
                            "<div class='markdown-html'></div>" +
                            "<script type='text/markdown'>\n" +
                            jcrContent +
                            "</script>" +
                            "</marked-element>";
                        if (rowStyling) {
                            ret += render.tag("div", {
                                "class": "jcr-content"
                            }, markedContent);
                        }
                        else {
                            ret += render.tag("div", {
                                "class": "jcr-root-content"
                            }, markedContent);
                        }
                    }
                }
                if (!renderComplete) {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    var properties_1 = props.renderProperties(node.properties);
                    if (properties_1) {
                        ret += properties_1;
                    }
                }
            }
            if (renderBin && node.hasBinary) {
                var binary = render.renderBinary(node);
                if (util.contains(ret, cnst.INSERT_ATTACHMENT)) {
                    ret = util.replaceAll(ret, cnst.INSERT_ATTACHMENT, binary);
                }
                else {
                    ret += binary;
                }
            }
            var tags = props.getNodePropertyVal(jcrCnst.TAGS, node);
            if (tags) {
                ret += render.tag("div", {
                    "class": "tags-content"
                }, "Tags: " + tags);
            }
            return ret;
        };
        this.renderJsonFileSearchResultProperty = function (jsonContent) {
            var content = "";
            try {
                console.log("json: " + jsonContent);
                var list = JSON.parse(jsonContent);
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var entry = list_1[_i];
                    content += render.tag("div", {
                        "class": "systemFile",
                        "onclick": "meta64.editSystemFile('" + entry.fileName + "')"
                    }, entry.fileName);
                }
            }
            catch (e) {
                util.logAndReThrow("render failed", e);
                content = "[render failed]";
            }
            return content;
        };
        this.renderNodeAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            var prevPageExists = nav.mainOffset > 0;
            var nextPageExists = !nav.endReached;
            var canMoveUp = (index > 0 && rowCount > 1) || prevPageExists;
            var canMoveDown = (index < count - 1) || nextPageExists;
            var isRep = util.startsWith(node.name, "rep:") ||
                util.contains(node.path, "/rep:");
            var editingAllowed = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }
            var focusNode = meta64.getHighlightedNode();
            var selected = (focusNode && focusNode.uid === uid);
            var buttonBarHtmlRet = render.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            var bkgStyle = render.getNodeBkgImageStyle(node);
            var cssId = uid + "_row";
            return render.tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId,
                "style": bkgStyle
            }, buttonBarHtmlRet + render.tag("div", {
                "id": uid + "_content"
            }, render.renderNodeContent(node, true, true, true, true, true)));
        };
        this.showNodeUrl = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("You must first click on a node.")).open();
                return;
            }
            var path = util.stripIfStartsWith(node.path, "/root");
            var url = window.location.origin + "?id=" + path;
            meta64.selectTab("mainTabName");
            var message = "URL using path: <br>" + url;
            var uuid = props.getNodePropertyVal("jcr:uuid", node);
            if (uuid) {
                message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
            }
            (new MessageDlg(message, "URL of Node")).open();
        };
        this.getTopRightImageTag = function (node) {
            var topRightImg = props.getNodePropertyVal('img.top.right', node);
            var topRightImgTag = "";
            if (topRightImg) {
                topRightImgTag = render.tag("img", {
                    "src": topRightImg,
                    "class": "top-right-image"
                }, "", false);
            }
            return topRightImgTag;
        };
        this.getNodeBkgImageStyle = function (node) {
            var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
            var bkgImgStyle = "";
            if (bkgImg) {
                bkgImgStyle = "background-image: url(" + bkgImg + ");";
            }
            return bkgImgStyle;
        };
        this.centeredButtonBar = function (buttons, classes) {
            classes = classes || "";
            return render.tag("div", {
                "class": "horizontal center-justified layout vertical-layout-row " + classes
            }, buttons);
        };
        this.centerContent = function (content, width) {
            var div = render.tag("div", { "style": "width:" + width + "px;" }, content);
            var attrs = {
                "class": "horizontal center-justified layout vertical-layout-row"
            };
            return render.tag("div", attrs, div, true);
        };
        this.buttonBar = function (buttons, classes) {
            classes = classes || "";
            return render.tag("div", {
                "class": "horizontal left-justified layout vertical-layout-row " + classes
            }, buttons);
        };
        this.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
            var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, node);
            var openButton = "";
            var selButton = "";
            var createSubNodeButton = "";
            var editNodeButton = "";
            var moveNodeUpButton = "";
            var moveNodeDownButton = "";
            var insertNodeButton = "";
            var replyButton = "";
            if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                replyButton = render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + node.uid + "');"
                }, "Reply");
            }
            var buttonCount = 0;
            if (render.nodeHasChildren(node.uid)) {
                buttonCount++;
                openButton = render.tag("paper-button", {
                    "style": "background-color: #4caf50;color:white;",
                    "raised": "raised",
                    "onClick": "nav.openNode('" + node.uid + "');"
                }, "Open");
            }
            if (meta64.userPreferences.editMode) {
                var selected = meta64.selectedNodes[node.uid] ? true : false;
                buttonCount++;
                var css = selected ? {
                    "id": node.uid + "_sel",
                    "onClick": "nav.toggleNodeSel('" + node.uid + "');",
                    "checked": "checked",
                    "style": "margin-top: 11px;"
                } :
                    {
                        "id": node.uid + "_sel",
                        "onClick": "nav.toggleNodeSel('" + node.uid + "');",
                        "style": "margin-top: 11px;"
                    };
                selButton = render.tag("paper-checkbox", css, "");
                if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    createSubNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt",
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + node.uid + "');"
                    }, "Add");
                }
                if (cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    insertNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture",
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.insertNode('" + node.uid + "');"
                    }, "Ins");
                }
            }
            if (meta64.userPreferences.editMode && editingAllowed) {
                buttonCount++;
                editNodeButton = render.tag("paper-icon-button", {
                    "alt": "Edit node.",
                    "icon": "editor:mode-edit",
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + node.uid + "');"
                }, "Edit");
                if (cnst.MOVE_UPDOWN_ON_TOOLBAR && meta64.currentNode.childrenOrdered && !commentBy) {
                    if (canMoveUp) {
                        buttonCount++;
                        moveNodeUpButton = render.tag("paper-icon-button", {
                            "icon": "icons:arrow-upward",
                            "raised": "raised",
                            "onClick": "edit.moveNodeUp('" + node.uid + "');"
                        }, "Up");
                    }
                    if (canMoveDown) {
                        buttonCount++;
                        moveNodeDownButton = render.tag("paper-icon-button", {
                            "icon": "icons:arrow-downward",
                            "raised": "raised",
                            "onClick": "edit.moveNodeDown('" + node.uid + "');"
                        }, "Dn");
                    }
                }
            }
            var insertNodeTooltip = "";
            var addNodeTooltip = "";
            var allButtons = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
                + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;
            return allButtons.length > 0 ? render.makeHorizontalFieldSet(allButtons, "row-toolbar") : "";
        };
        this.makeHorizontalFieldSet = function (content, extraClasses) {
            return render.tag("div", {
                "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
            }, content, true);
        };
        this.makeHorzControlGroup = function (content) {
            return render.tag("div", {
                "class": "horizontal layout"
            }, content, true);
        };
        this.makeRadioButton = function (label, id) {
            return render.tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        };
        this.nodeHasChildren = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("Unknown nodeId in nodeHasChildren: " + uid);
                return false;
            }
            else {
                return node.hasChildren;
            }
        };
        this.formatPath = function (node) {
            var path = node.path;
            path = util.replaceAll(path, "/", " / ");
            var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
            var noRootPath = shortPath;
            if (util.startsWith(noRootPath, "/root")) {
                noRootPath = noRootPath.substring(0, 5);
            }
            var ret = meta64.isAdminUser ? shortPath : noRootPath;
            ret += " [" + node.primaryTypeName + "]";
            return ret;
        };
        this.wrapHtml = function (text) {
            return "<div>" + text + "</div>";
        };
        this.renderPageFromData = function (data, scrollToTop) {
            meta64.codeFormatDirty = false;
            console.log("render.renderPageFromData()");
            var newData = false;
            if (!data) {
                data = meta64.currentNodeData;
            }
            else {
                newData = true;
            }
            nav.endReached = data && data.endReached;
            if (!data || !data.node) {
                util.setVisibility("#listView", false);
                $("#mainNodeContent").html("No content is available here.");
                return;
            }
            else {
                util.setVisibility("#listView", true);
            }
            meta64.treeDirty = false;
            if (newData) {
                meta64.uidToNodeMap = {};
                meta64.idToNodeMap = {};
                meta64.identToUidMap = {};
                meta64.selectedNodes = {};
                meta64.parentUidToFocusNodeMap = {};
                meta64.initNode(data.node, true);
                meta64.setCurrentNodeData(data);
            }
            var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;
            if (render.debug) {
                console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
            }
            var output = "";
            var bkgStyle = render.getNodeBkgImageStyle(data.node);
            var mainNodeContent = render.renderNodeContent(data.node, true, true, true, false, true);
            if (mainNodeContent.length > 0) {
                var uid = data.node.uid;
                var cssId = uid + "_row";
                var buttonBar = "";
                var editNodeButton = "";
                var createSubNodeButton = "";
                var replyButton = "";
                var createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, data.node);
                var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, data.node);
                var publicAppend = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, data.node);
                if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                    replyButton = render.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.replyToComment('" + data.node.uid + "');"
                    }, "Reply");
                }
                if (meta64.userPreferences.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt",
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + uid + "');"
                    }, "Add");
                }
                if (edit.isEditAllowed(data.node)) {
                    editNodeButton = render.tag("paper-icon-button", {
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": "edit.runEditNode('" + uid + "');"
                    }, "Edit");
                }
                var focusNode = meta64.getHighlightedNode();
                var selected = focusNode && focusNode.uid === uid;
                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar = render.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }
                var content = render.tag("div", {
                    "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                    "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                    "id": cssId
                }, buttonBar + mainNodeContent);
                $("#mainNodeContent").show();
                $("#mainNodeContent").html(content);
            }
            else {
                $("#mainNodeContent").hide();
            }
            view.updateStatusBar();
            if (nav.mainOffset > 0) {
                var firstButton = render.makeButton("First Page", "firstPageButton", render.firstPage);
                var prevButton = render.makeButton("Prev Page", "prevPageButton", render.prevPage);
                output += render.centeredButtonBar(firstButton + prevButton, "paging-button-bar");
            }
            var rowCount = 0;
            if (data.children) {
                var childCount = data.children.length;
                for (var i = 0; i < data.children.length; i++) {
                    var node = data.children[i];
                    if (!edit.nodesToMoveSet[node.id]) {
                        var row = render.generateRow(i, node, newData, childCount, rowCount);
                        if (row.length != 0) {
                            output += row;
                            rowCount++;
                        }
                    }
                }
            }
            if (edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !meta64.isAnonUser) {
                    output = render.getEmptyPagePrompt();
                }
            }
            if (!data.endReached) {
                var nextButton = render.makeButton("Next Page", "nextPageButton", render.nextPage);
                var lastButton = render.makeButton("Last Page", "lastPageButton", render.lastPage);
                output += render.centeredButtonBar(nextButton + lastButton, "paging-button-bar");
            }
            util.setHtml("listView", output);
            if (meta64.codeFormatDirty) {
                prettyPrint();
            }
            $("a").attr("target", "_blank");
            meta64.screenSizeChange();
            if (scrollToTop || !meta64.getHighlightedNode()) {
                view.scrollToTop();
            }
            else {
                view.scrollToSelectedNode();
            }
        };
        this.firstPage = function () {
            console.log("First page button click.");
            view.firstPage();
        };
        this.prevPage = function () {
            console.log("Prev page button click.");
            view.prevPage();
        };
        this.nextPage = function () {
            console.log("Next page button click.");
            view.nextPage();
        };
        this.lastPage = function () {
            console.log("Last page button click.");
            view.lastPage();
        };
        this.generateRow = function (i, node, newData, childCount, rowCount) {
            if (meta64.isNodeBlackListed(node))
                return "";
            if (newData) {
                meta64.initNode(node, true);
                if (render.debug) {
                    console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                }
            }
            rowCount++;
            var row = render.renderNodeAsListItem(node, i, childCount, rowCount);
            return row;
        };
        this.getUrlForNodeAttachment = function (node) {
            return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
        };
        this.adjustImageSize = function (node) {
            var elm = $("#" + node.imgId);
            if (elm) {
                if (node.width && node.height) {
                    if (node.width > meta64.deviceWidth - 80) {
                        elm.attr("width", "100%");
                        elm.attr("height", "auto");
                    }
                    else {
                        elm.attr("width", node.width);
                        elm.attr("height", node.height);
                    }
                }
            }
        };
        this.makeImageTag = function (node) {
            var src = render.getUrlForNodeAttachment(node);
            node.imgId = "imgUid_" + node.uid;
            if (node.width && node.height) {
                if (node.width > meta64.deviceWidth - 50) {
                    var width = meta64.deviceWidth - 50;
                    var height = width * node.height / node.width;
                    return render.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": width + "px",
                        "height": height + "px"
                    }, null, false);
                }
                else {
                    return render.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": node.width + "px",
                        "height": node.height + "px"
                    }, null, false);
                }
            }
            else {
                return render.tag("img", {
                    "src": src,
                    "id": node.imgId
                }, null, false);
            }
        };
        this.tag = function (tag, attributes, content, closeTag) {
            if (typeof (closeTag) === 'undefined')
                closeTag = true;
            var ret = "<" + tag;
            if (attributes) {
                ret += " ";
                $.each(attributes, function (k, v) {
                    if (v) {
                        if (typeof v !== 'string') {
                            v = String(v);
                        }
                        if (util.contains(v, "'")) {
                            ret += k + "=\"" + v + "\" ";
                        }
                        else {
                            ret += k + "='" + v + "' ";
                        }
                    }
                    else {
                        ret += k + " ";
                    }
                });
            }
            if (closeTag) {
                if (!content) {
                    content = "";
                }
                ret += ">" + content + "</" + tag + ">";
            }
            else {
                ret += "/>";
            }
            return ret;
        };
        this.makeTextArea = function (fieldName, fieldId) {
            return render.tag("paper-textarea", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        };
        this.makeEditField = function (fieldName, fieldId) {
            return render.tag("paper-input", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        };
        this.makePasswordField = function (fieldName, fieldId) {
            return render.tag("paper-input", {
                "type": "password",
                "name": fieldId,
                "label": fieldName,
                "id": fieldId,
                "class": "meta64-input"
            }, "", true);
        };
        this.makeButton = function (text, id, callback, ctx) {
            var attribs = {
                "raised": "raised",
                "id": id,
                "class": "standardButton"
            };
            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }
            return render.tag("paper-button", attribs, text, true);
        };
        this.allowPropertyToDisplay = function (propName) {
            if (!meta64.inSimpleMode())
                return true;
            return meta64.simpleModePropertyBlackList[propName] == null;
        };
        this.isReadOnlyProperty = function (propName) {
            return meta64.readOnlyPropertyList[propName];
        };
        this.isBinaryProperty = function (propName) {
            return meta64.binaryPropertyList[propName];
        };
        this.sanitizePropertyName = function (propName) {
            if (meta64.editModeOption === "simple") {
                return propName === jcrCnst.CONTENT ? "Content" : propName;
            }
            else {
                return propName;
            }
        };
    }
    return Render;
}());
var render = new Render();
var Search = (function () {
    function Search() {
        this._UID_ROWID_SUFFIX = "_srch_row";
        this.searchNodes = null;
        this.searchPageTitle = "Search Results";
        this.timelinePageTitle = "Timeline";
        this.searchOffset = 0;
        this.timelineOffset = 0;
        this.searchResults = null;
        this.timelineResults = null;
        this.highlightRowNode = null;
        this.identToUidMap = {};
        this.uidToNodeMap = {};
        this.numSearchResults = function () {
            return srch.searchResults != null &&
                srch.searchResults.searchResults != null &&
                srch.searchResults.searchResults.length != null ?
                srch.searchResults.searchResults.length : 0;
        };
        this.searchTabActivated = function () {
            if (srch.numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchContentDlg()).open();
            }
        };
        this.searchNodesResponse = function (res) {
            srch.searchResults = res;
            var searchResultsPanel = new SearchResultsPanel();
            var content = searchResultsPanel.build();
            util.setHtml("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        };
        this.timelineResponse = function (res) {
            srch.timelineResults = res;
            var timelineResultsPanel = new TimelineResultsPanel();
            var content = timelineResultsPanel.build();
            util.setHtml("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        };
        this.searchFilesResponse = function (res) {
            nav.mainOffset = 0;
            util.json("renderNode", {
                "nodeId": res.searchResultNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": 0,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        };
        this.timelineByModTime = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.LAST_MODIFIED,
                "searchProp": null
            }, srch.timelineResponse);
        };
        this.timelineByCreateTime = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.CREATED,
                "searchProp": null
            }, srch.timelineResponse);
        };
        this.initSearchNode = function (node) {
            node.uid = util.getUidForId(srch.identToUidMap, node.id);
            srch.uidToNodeMap[node.uid] = node;
        };
        this.populateSearchResultsPage = function (data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;
            var rowCount = 0;
            $.each(data.searchResults, function (i, node) {
                if (meta64.isNodeBlackListed(node))
                    return;
                srch.initSearchNode(node);
                rowCount++;
                output += srch.renderSearchResultAsListItem(node, i, childCount, rowCount);
            });
            util.setHtml(viewName, output);
        };
        this.renderSearchResultAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            console.log("renderSearchResult: " + uid);
            var cssId = uid + srch._UID_ROWID_SUFFIX;
            var buttonBarHtml = srch.makeButtonBarHtml("" + uid);
            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = render.renderNodeContent(node, true, true, true, true, true);
            return render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": "srch.clickOnSearchResultRow(this, '" + uid + "');",
                "id": cssId
            }, buttonBarHtml
                + render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        };
        this.makeButtonBarHtml = function (uid) {
            var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
            return render.makeHorizontalFieldSet(gotoButton);
        };
        this.clickOnSearchResultRow = function (rowElm, uid) {
            srch.unhighlightRow();
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        };
        this.clickSearchNode = function (uid) {
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            if (!srch.highlightRowNode) {
                throw "Unable to find uid in search results: " + uid;
            }
            view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
            meta64.selectTab("mainTabName");
        };
        this.unhighlightRow = function () {
            if (!srch.highlightRowNode) {
                return;
            }
            var nodeId = srch.highlightRowNode.uid + srch._UID_ROWID_SUFFIX;
            var elm = util.domElm(nodeId);
            if (elm) {
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        };
    }
    return Search;
}());
var srch = new Search();
var Share = (function () {
    function Share() {
        this.findSharedNodesResponse = function (res) {
            srch.searchNodesResponse(res);
        };
        this.sharingNode = null;
        this.editNodeSharing = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            share.sharingNode = node;
            (new SharingDlg()).open();
        };
        this.findSharedNodes = function () {
            var focusNode = meta64.getHighlightedNode();
            if (focusNode == null) {
                return;
            }
            srch.searchPageTitle = "Shared Nodes";
            util.json("getSharedNodes", {
                "nodeId": focusNode.id
            }, share.findSharedNodesResponse);
        };
    }
    return Share;
}());
var share = new Share();
var User = (function () {
    function User() {
        this.logoutResponse = function (res) {
            window.location.href = window.location.origin;
        };
        this.isTestUserAccount = function () {
            return meta64.userName.toLowerCase() === "adam" ||
                meta64.userName.toLowerCase() === "bob" ||
                meta64.userName.toLowerCase() === "cory" ||
                meta64.userName.toLowerCase() === "dan";
        };
        this.setTitleUsingLoginResponse = function (res) {
            var title = BRANDING_TITLE_SHORT;
            if (!meta64.isAnonUser) {
                title += ":" + res.userName;
            }
            $("#headerAppName").html(title);
        };
        this.setStateVarsUsingLoginResponse = function (res) {
            if (res.rootNode) {
                meta64.homeNodeId = res.rootNode.id;
                meta64.homeNodePath = res.rootNode.path;
            }
            meta64.userName = res.userName;
            meta64.isAdminUser = res.userName === "admin";
            meta64.isAnonUser = res.userName === "anonymous";
            meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;
            meta64.allowFileSystemSearch = res.allowFileSystemSearch;
            meta64.userPreferences = res.userPreferences;
            meta64.editModeOption = res.userPreferences.advancedMode ? meta64.MODE_ADVANCED : meta64.MODE_SIMPLE;
            meta64.showMetaData = res.userPreferences.showMetaData;
            console.log("from server: meta64.editModeOption=" + meta64.editModeOption);
        };
        this.openSignupPg = function () {
            (new SignupDlg()).open();
        };
        this.writeCookie = function (name, val) {
            $.cookie(name, val, {
                expires: 365,
                path: '/'
            });
        };
        this.openLoginPg = function () {
            var loginDlg = new LoginDlg();
            loginDlg.populateFromCookies();
            loginDlg.open();
        };
        this.refreshLogin = function () {
            console.log("refreshLogin.");
            var callUsr;
            var callPwd;
            var usingCookies = false;
            var loginSessionReady = $("#loginSessionReady").text();
            if (loginSessionReady === "true") {
                console.log("    loginSessionReady = true");
                callUsr = "";
                callPwd = "";
                usingCookies = true;
            }
            else {
                console.log("    loginSessionReady = false");
                var loginState = $.cookie(cnst.COOKIE_LOGIN_STATE);
                if (loginState === "0") {
                    meta64.loadAnonPageHome(false);
                    return;
                }
                var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
                var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
                usingCookies = !util.emptyString(usr) && !util.emptyString(pwd);
                console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);
                callUsr = usr ? usr : "";
                callPwd = pwd ? pwd : "";
            }
            console.log("refreshLogin with name: " + callUsr);
            if (!callUsr) {
                meta64.loadAnonPageHome(false);
            }
            else {
                util.json("login", {
                    "userName": callUsr,
                    "password": callPwd,
                    "tzOffset": new Date().getTimezoneOffset(),
                    "dst": util.daylightSavingsTime
                }, function (res) {
                    if (usingCookies) {
                        user.loginResponse(res, callUsr, callPwd, usingCookies);
                    }
                    else {
                        user.refreshLoginResponse(res);
                    }
                });
            }
        };
        this.logout = function (updateLoginStateCookie) {
            if (meta64.isAnonUser) {
                return;
            }
            $(window).off("beforeunload");
            if (updateLoginStateCookie) {
                user.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
            }
            util.json("logout", {}, user.logoutResponse);
        };
        this.login = function (loginDlg, usr, pwd) {
            util.json("login", {
                "userName": usr,
                "password": pwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": util.daylightSavingsTime
            }, function (res) {
                user.loginResponse(res, usr, pwd, null, loginDlg);
            });
        };
        this.deleteAllUserCookies = function () {
            $.removeCookie(cnst.COOKIE_LOGIN_USR);
            $.removeCookie(cnst.COOKIE_LOGIN_PWD);
            $.removeCookie(cnst.COOKIE_LOGIN_STATE);
        };
        this.loginResponse = function (res, usr, pwd, usingCookies, loginDlg) {
            if (util.checkSuccess("Login", res)) {
                console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);
                if (usr != "anonymous") {
                    user.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
                    user.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                    user.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
                }
                if (loginDlg) {
                    loginDlg.cancel();
                }
                user.setStateVarsUsingLoginResponse(res);
                if (res.userPreferences.lastNode) {
                    console.log("lastNode: " + res.userPreferences.lastNode);
                }
                else {
                    console.log("lastNode is null.");
                }
                var id = null;
                if (!util.emptyString(res.homeNodeOverride)) {
                    console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                    id = res.homeNodeOverride;
                    meta64.homeNodeOverride = id;
                }
                else {
                    if (res.userPreferences.lastNode) {
                        console.log("loading lastNode=" + res.userPreferences.lastNode);
                        id = res.userPreferences.lastNode;
                    }
                    else {
                        console.log("loading homeNodeId=" + meta64.homeNodeId);
                        id = meta64.homeNodeId;
                    }
                }
                view.refreshTree(id, false, null, true);
                user.setTitleUsingLoginResponse(res);
            }
            else {
                if (usingCookies) {
                    (new MessageDlg("Cookie login failed.")).open();
                    $.removeCookie(cnst.COOKIE_LOGIN_USR);
                    $.removeCookie(cnst.COOKIE_LOGIN_PWD);
                    user.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
                    location.reload();
                }
            }
        };
        this.refreshLoginResponse = function (res) {
            console.log("refreshLoginResponse");
            if (res.success) {
                user.setStateVarsUsingLoginResponse(res);
                user.setTitleUsingLoginResponse(res);
            }
            meta64.loadAnonPageHome(false);
        };
    }
    return User;
}());
var user = new User();
var View = (function () {
    function View() {
        this.scrollToSelNodePending = false;
        this.updateStatusBar = function () {
            if (!meta64.currentNodeData)
                return;
            var statusLine = "";
            if (meta64.editModeOption === meta64.MODE_ADVANCED) {
                statusLine += "count: " + meta64.currentNodeData.children.length;
            }
            if (meta64.userPreferences.editMode) {
                statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
            }
        };
        this.refreshTreeResponse = function (res, targetId, scrollToTop) {
            render.renderPageFromData(res, scrollToTop);
            if (scrollToTop) {
            }
            else {
                if (targetId) {
                    meta64.highlightRowById(targetId, true);
                }
                else {
                    view.scrollToSelectedNode();
                }
            }
            meta64.refreshAllGuiEnablement();
            util.delayedFocus("#mainNodeContent");
        };
        this.refreshTree = function (nodeId, renderParentIfLeaf, highlightId, isInitialRender) {
            if (!nodeId) {
                nodeId = meta64.currentNodeId;
            }
            console.log("Refreshing tree: nodeId=" + nodeId);
            if (!highlightId) {
                var currentSelNode = meta64.getHighlightedNode();
                highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
            }
            util.json("renderNode", {
                "nodeId": nodeId,
                "upLevel": null,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, function (res) {
                if (res.offsetOfNodeFound > -1) {
                    nav.mainOffset = res.offsetOfNodeFound;
                }
                view.refreshTreeResponse(res, highlightId);
                if (isInitialRender && meta64.urlCmd == "addNode" && meta64.homeNodeOverride) {
                    edit.editMode(true);
                    edit.createSubNode(meta64.currentNode.uid);
                }
            });
        };
        this.firstPage = function () {
            console.log("Running firstPage Query");
            nav.mainOffset = 0;
            view.loadPage(false);
        };
        this.prevPage = function () {
            console.log("Running prevPage Query");
            nav.mainOffset -= nav.ROWS_PER_PAGE;
            if (nav.mainOffset < 0) {
                nav.mainOffset = 0;
            }
            view.loadPage(false);
        };
        this.nextPage = function () {
            console.log("Running nextPage Query");
            nav.mainOffset += nav.ROWS_PER_PAGE;
            view.loadPage(false);
        };
        this.lastPage = function () {
            console.log("Running lastPage Query");
            view.loadPage(true);
        };
        this.loadPage = function (goToLastPage) {
            util.json("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": null,
                "renderParentIfLeaf": true,
                "offset": nav.mainOffset,
                "goToLastPage": goToLastPage
            }, function (res) {
                if (goToLastPage) {
                    if (res.offsetOfNodeFound > -1) {
                        nav.mainOffset = res.offsetOfNodeFound;
                    }
                }
                view.refreshTreeResponse(res, null, true);
            });
        };
        this.scrollToSelectedNode = function () {
            view.scrollToSelNodePending = true;
            setTimeout(function () {
                view.scrollToSelNodePending = false;
                var elm = nav.getSelectedPolyElement();
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
                else {
                    $("#mainContainer").scrollTop(0);
                }
            }, 1000);
        };
        this.scrollToTop = function () {
            if (view.scrollToSelNodePending)
                return;
            $("#mainContainer").scrollTop(0);
            setTimeout(function () {
                if (view.scrollToSelNodePending)
                    return;
                $("#mainContainer").scrollTop(0);
            }, 1000);
        };
        this.initEditPathDisplayById = function (domId) {
            var node = edit.editNode;
            var e = $("#" + domId);
            if (!e)
                return;
            if (edit.editingUnsavedNode) {
                e.html("");
                e.hide();
            }
            else {
                var pathDisplay = "Path: " + render.formatPath(node);
                if (node.lastModified) {
                    pathDisplay += "<br>Mod: " + node.lastModified;
                }
                e.html(pathDisplay);
                e.show();
            }
        };
        this.showServerInfo = function () {
            util.json("getServerInfo", {}, function (res) {
                (new MessageDlg(res.serverInfo)).open();
            });
        };
    }
    return View;
}());
var view = new View();
var MenuPanel = (function () {
    function MenuPanel() {
        this.makeTopLevelMenu = function (title, content, id) {
            var paperItemAttrs = {
                class: "menu-trigger"
            };
            var paperItem = render.tag("paper-item", paperItemAttrs, title);
            var paperSubmenuAttrs = {
                "label": title,
                "selectable": ""
            };
            if (id) {
                paperSubmenuAttrs.id = id;
            }
            return render.tag("paper-submenu", paperSubmenuAttrs, paperItem +
                menuPanel.makeSecondLevelList(content), true);
        };
        this.makeSecondLevelList = function (content) {
            return render.tag("paper-menu", {
                "class": "menu-content sublist my-menu-section",
                "selectable": ""
            }, content, true);
        };
        this.menuItem = function (name, id, onClick) {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick,
                "selectable": ""
            }, name, true);
        };
        this.domId = "mainAppMenu";
        this.build = function () {
            var rssItems = menuPanel.menuItem("Feeds", "mainMenuRss", "nav.openRssFeedsNode();");
            var mainMenuRss = menuPanel.makeTopLevelMenu("RSS", rssItems);
            var editMenuItems = menuPanel.menuItem("Create", "createNodeButton", "edit.createNode();") +
                menuPanel.menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
                menuPanel.menuItem("Cut", "cutSelNodesButton", "edit.cutSelNodes();") +
                menuPanel.menuItem("Paste", "pasteSelNodesButton", "edit.pasteSelNodes();") +
                menuPanel.menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
                menuPanel.menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
                menuPanel.menuItem("Export", "openExportDlg", "(new ExportDlg()).open();") +
                menuPanel.menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();");
            var editMenu = menuPanel.makeTopLevelMenu("Edit", editMenuItems);
            var moveMenuItems = menuPanel.menuItem("Up", "moveNodeUpButton", "edit.moveNodeUp();") +
                menuPanel.menuItem("Down", "moveNodeDownButton", "edit.moveNodeDown();") +
                menuPanel.menuItem("to Top", "moveNodeToTopButton", "edit.moveNodeToTop();") +
                menuPanel.menuItem("to Bottom", "moveNodeToBottomButton", "edit.moveNodeToBottom();");
            var moveMenu = menuPanel.makeTopLevelMenu("Move", moveMenuItems);
            var attachmentMenuItems = menuPanel.menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
                menuPanel.menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
                menuPanel.menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
            var attachmentMenu = menuPanel.makeTopLevelMenu("Attach", attachmentMenuItems);
            var sharingMenuItems = menuPanel.menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
                menuPanel.menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
            var sharingMenu = menuPanel.makeTopLevelMenu("Share", sharingMenuItems);
            var searchMenuItems = menuPanel.menuItem("Content", "contentSearchDlgButton", "(new SearchContentDlg()).open();") +
                menuPanel.menuItem("Tags", "tagSearchDlgButton", "(new SearchTagsDlg()).open();") +
                menuPanel.menuItem("Files", "fileSearchDlgButton", "(new SearchFilesDlg(true)).open();");
            var searchMenu = menuPanel.makeTopLevelMenu("Search", searchMenuItems);
            var timelineMenuItems = menuPanel.menuItem("Created", "timelineCreatedButton", "srch.timelineByCreateTime();") +
                menuPanel.menuItem("Modified", "timelineModifiedButton", "srch.timelineByModTime();");
            var timelineMenu = menuPanel.makeTopLevelMenu("Timeline", timelineMenuItems);
            var viewOptionsMenuItems = menuPanel.menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
                menuPanel.menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
                menuPanel.menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
                menuPanel.menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();");
            var viewOptionsMenu = menuPanel.makeTopLevelMenu("View", viewOptionsMenuItems);
            var myAccountItems = menuPanel.menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
                menuPanel.menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();");
            var myAccountMenu = menuPanel.makeTopLevelMenu("Account", myAccountItems);
            var adminItems = menuPanel.menuItem("Generate RSS", "generateRSSButton", "podcast.generateRSS();") +
                menuPanel.menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();") +
                menuPanel.menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "edit.insertBookWarAndPeace();");
            var adminMenu = menuPanel.makeTopLevelMenu("Admin", adminItems, "adminMenu");
            var helpItems = menuPanel.menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
            var mainMenuHelp = menuPanel.makeTopLevelMenu("Help/Docs", helpItems);
            var content = mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
                + adminMenu + mainMenuHelp;
            util.setHtml(menuPanel.domId, content);
        };
        this.init = function () {
            meta64.refreshAllGuiEnablement();
        };
    }
    return MenuPanel;
}());
var menuPanel = new MenuPanel();
var Podcast = (function () {
    function Podcast() {
        this.player = null;
        this.startTimePending = null;
        this.uid = null;
        this.node = null;
        this.adSegments = null;
        this.pushTimer = null;
        this.generateRSS = function () {
            util.json("generateRSS", {}, podcast.generateRSSResponse);
        };
        this.generateRSSResponse = function () {
            alert('rss complete.');
        };
        this.renderFeedNode = function (node, rowStyling) {
            var ret = "";
            var title = props.getNodeProperty("meta64:rssFeedTitle", node);
            var desc = props.getNodeProperty("meta64:rssFeedDesc", node);
            var imgUrl = props.getNodeProperty("meta64:rssFeedImageUrl", node);
            var feed = "";
            if (title) {
                feed += render.tag("h2", {}, title.value);
            }
            if (desc) {
                feed += render.tag("p", {}, desc.value);
            }
            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, feed);
            }
            else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                }, feed);
            }
            if (imgUrl) {
                ret += render.tag("img", {
                    "style": "max-width: 200px;",
                    "src": imgUrl.value
                }, null, false);
            }
            return ret;
        };
        this.getMediaPlayerUrlFromNode = function (node) {
            var link = props.getNodeProperty("meta64:rssItemLink", node);
            if (link && link.value && util.contains(link.value.toLowerCase(), ".mp3")) {
                return link.value;
            }
            var uri = props.getNodeProperty("meta64:rssItemUri", node);
            if (uri && uri.value && util.contains(uri.value.toLowerCase(), ".mp3")) {
                return uri.value;
            }
            var encUrl = props.getNodeProperty("meta64:rssItemEncUrl", node);
            if (encUrl && encUrl.value) {
                var encType = props.getNodeProperty("meta64:rssItemEncType", node);
                if (encType && encType.value && util.startsWith(encType.value, "audio/")) {
                    return encUrl.value;
                }
            }
            return null;
        };
        this.renderItemNode = function (node, rowStyling) {
            var ret = "";
            var rssTitle = props.getNodeProperty("meta64:rssItemTitle", node);
            var rssDesc = props.getNodeProperty("meta64:rssItemDesc", node);
            var rssAuthor = props.getNodeProperty("meta64:rssItemAuthor", node);
            var rssLink = props.getNodeProperty("meta64:rssItemLink", node);
            var rssUri = props.getNodeProperty("meta64:rssItemUri", node);
            var entry = "";
            if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
                entry += render.tag("a", {
                    "href": rssLink.value
                }, render.tag("h3", {}, rssTitle.value));
            }
            var playerUrl = podcast.getMediaPlayerUrlFromNode(node);
            if (playerUrl) {
                entry += render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "podcast.openPlayerDialog('" + node.uid + "');",
                    "class": "standardButton"
                }, "Play");
            }
            if (rssDesc && rssDesc.value) {
                entry += render.tag("p", {}, rssDesc.value);
            }
            if (rssAuthor && rssAuthor.value) {
                entry += render.tag("div", {}, "By: " + rssAuthor.value);
            }
            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, entry);
            }
            else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                }, entry);
            }
            return ret;
        };
        this.propOrderingFeedNode = function (node, properties) {
            var propOrder = [
                "meta64:rssFeedTitle",
                "meta64:rssFeedDesc",
                "meta64:rssFeedLink",
                "meta64:rssFeedUri",
                "meta64:rssFeedSrc",
                "meta64:rssFeedImageUrl"
            ];
            return props.orderProps(propOrder, properties);
        };
        this.propOrderingItemNode = function (node, properties) {
            var propOrder = [
                "meta64:rssItemTitle",
                "meta64:rssItemDesc",
                "meta64:rssItemLink",
                "meta64:rssItemUri",
                "meta64:rssItemAuthor"
            ];
            return props.orderProps(propOrder, properties);
        };
        this.openPlayerDialog = function (_uid) {
            podcast.uid = _uid;
            podcast.node = meta64.uidToNodeMap[podcast.uid];
            if (podcast.node) {
                var mp3Url_1 = podcast.getMediaPlayerUrlFromNode(podcast.node);
                if (mp3Url_1) {
                    util.json("getPlayerInfo", {
                        "url": mp3Url_1
                    }, function (res) {
                        podcast.parseAdSegmentUid(podcast.uid);
                        var dlg = new AudioPlayerDlg(mp3Url_1, podcast.uid, res.timeOffset);
                        dlg.open();
                    });
                }
            }
        };
        this.parseAdSegmentUid = function (_uid) {
            if (podcast.node) {
                var adSegs = props.getNodeProperty("ad-segments", podcast.node);
                if (adSegs) {
                    podcast.parseAdSegmentText(adSegs.value);
                }
            }
            else
                throw "Unable to find node uid: " + podcast.uid;
        };
        this.parseAdSegmentText = function (adSegs) {
            podcast.adSegments = [];
            var segList = adSegs.split("\n");
            for (var _i = 0, segList_1 = segList; _i < segList_1.length; _i++) {
                var seg = segList_1[_i];
                var segTimes = seg.split(",");
                if (segTimes.length != 2) {
                    console.log("invalid time range: " + seg);
                    continue;
                }
                var beginSecs = podcast.convertToSeconds(segTimes[0]);
                var endSecs = podcast.convertToSeconds(segTimes[1]);
                podcast.adSegments.push(new AdSegment(beginSecs, endSecs));
            }
        };
        this.convertToSeconds = function (timeVal) {
            if (timeVal == '*')
                return -1;
            var timeParts = timeVal.split(":");
            if (timeParts.length != 2) {
                console.log("invalid time value: " + timeVal);
                return;
            }
            var minutes = new Number(timeParts[0]).valueOf();
            var seconds = new Number(timeParts[1]).valueOf();
            return minutes * 60 + seconds;
        };
        this.restoreStartTime = function () {
            if (podcast.player && podcast.startTimePending) {
                podcast.player.currentTime = podcast.startTimePending;
                podcast.startTimePending = null;
            }
        };
        this.onCanPlay = function (uid, elm) {
            podcast.player = elm;
            podcast.restoreStartTime();
            podcast.player.play();
        };
        this.onTimeUpdate = function (uid, elm) {
            if (!podcast.pushTimer) {
                podcast.pushTimer = setInterval(podcast.pushTimerFunction, 5 * 60 * 1000);
            }
            podcast.player = elm;
            podcast.restoreStartTime();
            if (!podcast.adSegments)
                return;
            for (var _i = 0, _a = podcast.adSegments; _i < _a.length; _i++) {
                var seg = _a[_i];
                if (podcast.player.currentTime >= seg.beginTime &&
                    (podcast.player.currentTime <= seg.endTime || seg.endTime < 0)) {
                    if (seg.endTime < 0 && podcast.player.currentTime < podcast.player.duration - 3) {
                        podcast.player.loop = false;
                        podcast.player.currentTime = podcast.player.duration - 2;
                    }
                    else {
                        podcast.player.currentTime = seg.endTime + 1;
                    }
                    return;
                }
            }
        };
        this.pushTimerFunction = function () {
            if (podcast.player && !podcast.player.paused) {
                if (!$(podcast.player).is(":visible")) {
                    console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                    podcast.player.pause();
                }
                podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
            }
        };
        this.pause = function () {
            if (podcast.player) {
                podcast.player.pause();
                podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
            }
        };
        this.destroyPlayer = function (dlg) {
            if (podcast.player) {
                podcast.player.pause();
                setTimeout(function () {
                    podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
                    var localPlayer = $(podcast.player);
                    podcast.player = null;
                    localPlayer.remove();
                    if (dlg) {
                        dlg.cancel();
                    }
                }, 750);
            }
        };
        this.play = function () {
            if (podcast.player) {
                podcast.player.play();
            }
        };
        this.speed = function (rate) {
            if (podcast.player) {
                podcast.player.playbackRate = rate;
            }
        };
        this.skip = function (delta) {
            if (podcast.player) {
                podcast.player.currentTime += delta;
            }
        };
        this.savePlayerInfo = function (url, timeOffset) {
            if (meta64.isAnonUser)
                return;
            util.json("setPlayerInfo", {
                "url": url,
                "timeOffset": timeOffset
            }, podcast.setPlayerInfoResponse);
        };
        this.setPlayerInfoResponse = function () {
        };
    }
    return Podcast;
}());
var podcast = new Podcast();
var SystemFolder = (function () {
    function SystemFolder() {
        this.renderNode = function (node, rowStyling) {
            var ret = "";
            var pathProp = props.getNodeProperty("meta64:path", node);
            var path = "";
            if (pathProp) {
                path += render.tag("h2", {}, pathProp.value);
            }
            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, path);
            }
            else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                }, path);
            }
            return ret;
        };
        this.renderFileListNode = function (node, rowStyling) {
            var ret = "";
            var searchResultProp = props.getNodeProperty(jcrCnst.JSON_FILE_SEARCH_RESULT, node);
            if (searchResultProp) {
                var jcrContent = render.renderJsonFileSearchResultProperty(searchResultProp.value);
                if (rowStyling) {
                    ret += render.tag("div", {
                        "class": "jcr-content"
                    }, jcrContent);
                }
                else {
                    ret += render.tag("div", {
                        "class": "jcr-root-content"
                    }, jcrContent);
                }
            }
            return ret;
        };
        this.fileListPropOrdering = function (node, properties) {
            var propOrder = [
                "meta64:json"
            ];
            return props.orderProps(propOrder, properties);
        };
        this.reindex = function () {
            var selNode = meta64.getHighlightedNode();
            if (selNode) {
                util.json("fileSearch", {
                    "nodeId": selNode.id,
                    "reindex": true,
                    "searchText": null
                }, systemfolder.reindexResponse, systemfolder);
            }
        };
        this.browse = function () {
        };
        this.refreshResponse = function (res) {
        };
        this.reindexResponse = function (res) {
            alert("Reindex complete.");
        };
        this.search = function () {
            (new SearchFilesDlg(true)).open();
        };
        this.propOrdering = function (node, properties) {
            var propOrder = [
                "meta64:path"
            ];
            return props.orderProps(propOrder, properties);
        };
    }
    return SystemFolder;
}());
var systemfolder = new SystemFolder();
var DialogBase = (function () {
    function DialogBase(domId) {
        var _this = this;
        this.domId = domId;
        this.horizCenterDlgContent = true;
        this.init = function () {
        };
        this.closeEvent = function () {
        };
        this.build = function () {
            return "";
        };
        this.open = function () {
            var thiz = _this;
            var modalsContainer = util.polyElm("modalsContainer");
            var id = _this.id(_this.domId);
            var node = document.createElement("paper-dialog");
            node.setAttribute("id", id);
            modalsContainer.node.appendChild(node);
            node.style.border = "3px solid gray";
            Polymer.dom.flush();
            Polymer.updateStyles();
            if (_this.horizCenterDlgContent) {
                var content = render.tag("div", {
                    "style": "margin: 0 auto; max-width: 800px;"
                }, _this.build());
                util.setHtml(id, content);
            }
            else {
                var content = _this.build();
                util.setHtml(id, content);
            }
            _this.built = true;
            _this.init();
            console.log("Showing dialog: " + id);
            var polyElm = util.polyElm(id);
            polyElm.node.noCancelOnOutsideClick = true;
            polyElm.node.open();
            node.addEventListener('iron-overlay-closed', function (customEvent) {
                thiz.closeEvent();
            });
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();
            setTimeout(function () {
                polyElm.node.style.margin = "0px";
                polyElm.node.refit();
            }, 10);
            setTimeout(function () {
                polyElm.node.style.margin = "0px";
                polyElm.node.refit();
            }, 1500);
        };
        this.id = function (id) {
            if (id == null)
                return null;
            if (util.contains(id, "_dlgId")) {
                return id;
            }
            return id + "_dlgId" + _this.data.guid;
        };
        this.el = function (id) {
            if (!util.startsWith(id, "#")) {
                return $("#" + _this.id(id));
            }
            else {
                return $(_this.id(id));
            }
        };
        this.makePasswordField = function (text, id) {
            return render.makePasswordField(text, _this.id(id));
        };
        this.makeEditField = function (fieldName, id) {
            id = _this.id(id);
            return render.tag("paper-input", {
                "name": id,
                "label": fieldName,
                "id": id,
                "class": "meta64-input"
            }, "", true);
        };
        this.makeMessageArea = function (message, id) {
            var attrs = {
                "class": "dialog-message"
            };
            if (id) {
                attrs["id"] = _this.id(id);
            }
            return render.tag("p", attrs, message);
        };
        this.makeButton = function (text, id, callback, ctx) {
            var attribs = {
                "raised": "raised",
                "id": _this.id(id),
                "class": "standardButton"
            };
            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }
            return render.tag("paper-button", attribs, text, true);
        };
        this.makeCloseButton = function (text, id, callback, ctx, initiallyVisible, delayCloseCallback) {
            if (initiallyVisible === void 0) { initiallyVisible = true; }
            if (delayCloseCallback === void 0) { delayCloseCallback = 0; }
            var attribs = {
                "raised": "raised",
                "id": _this.id(id),
                "class": "standardButton"
            };
            var onClick = "";
            if (callback != undefined) {
                onClick = meta64.encodeOnClick(callback, ctx);
            }
            onClick += meta64.encodeOnClick(_this.cancel, _this, null, delayCloseCallback);
            if (onClick) {
                attribs["onClick"] = onClick;
            }
            if (!initiallyVisible) {
                attribs["style"] = "display:none;";
            }
            return render.tag("paper-button", attribs, text, true);
        };
        this.bindEnterKey = function (id, callback) {
            util.bindEnterKey(_this.id(id), callback);
        };
        this.setInputVal = function (id, val) {
            if (!val) {
                val = "";
            }
            util.setInputVal(_this.id(id), val);
        };
        this.getInputVal = function (id) {
            return util.getInputVal(_this.id(id)).trim();
        };
        this.setHtml = function (text, id) {
            util.setHtml(_this.id(id), text);
        };
        this.makeRadioButton = function (label, id) {
            id = _this.id(id);
            return render.tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        };
        this.makeCheckBox = function (label, id, initialState) {
            id = _this.id(id);
            var attrs = {
                "name": id,
                "id": id
            };
            if (initialState) {
                attrs["checked"] = "checked";
            }
            var checkbox = render.tag("paper-checkbox", attrs, "", false);
            checkbox += render.tag("label", {
                "for": id
            }, label, true);
            return checkbox;
        };
        this.makeHeader = function (text, id, centered) {
            var attrs = {
                "class": (centered ? "horizontal center-justified layout" : "") + " dialog-header"
            };
            if (id) {
                attrs["id"] = _this.id(id);
            }
            return render.tag("div", attrs, text);
        };
        this.focus = function (id) {
            if (!util.startsWith(id, "#")) {
                id = "#" + id;
            }
            id = _this.id(id);
            util.delayedFocus(id);
        };
        this.data = {};
        meta64.registerDataObject(this);
        meta64.registerDataObject(this.data);
    }
    DialogBase.prototype.cancel = function () {
        var polyElm = util.polyElm(this.id(this.domId));
        polyElm.node.cancel();
    };
    return DialogBase;
}());
var ProgressDlg = (function (_super) {
    __extends(ProgressDlg, _super);
    function ProgressDlg() {
        var _this = _super.call(this, "ProgressDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Processing Request", "", true);
            var progressBar = render.tag("paper-progress", {
                "indeterminate": "indeterminate",
                "value": "800",
                "min": "100",
                "max": "1000"
            });
            var barContainer = render.tag("div", {
                "style": "width:280px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
                "class": "horizontal center-justified layout"
            }, progressBar);
            return header + barContainer;
        };
        return _this;
    }
    return ProgressDlg;
}(DialogBase));
var ConfirmDlg = (function (_super) {
    __extends(ConfirmDlg, _super);
    function ConfirmDlg(title, message, buttonText, yesCallback, noCallback) {
        var _this = _super.call(this, "ConfirmDlg") || this;
        _this.title = title;
        _this.message = message;
        _this.buttonText = buttonText;
        _this.yesCallback = yesCallback;
        _this.noCallback = noCallback;
        _this.build = function () {
            var content = _this.makeHeader("", "ConfirmDlgTitle") + _this.makeMessageArea("", "ConfirmDlgMessage");
            content = render.centerContent(content, 300);
            var buttons = _this.makeCloseButton("Yes", "ConfirmDlgYesButton", _this.yesCallback)
                + _this.makeCloseButton("No", "ConfirmDlgNoButton", _this.noCallback);
            content += render.centeredButtonBar(buttons);
            return content;
        };
        _this.init = function () {
            _this.setHtml(_this.title, "ConfirmDlgTitle");
            _this.setHtml(_this.message, "ConfirmDlgMessage");
            _this.setHtml(_this.buttonText, "ConfirmDlgYesButton");
        };
        return _this;
    }
    return ConfirmDlg;
}(DialogBase));
var EditSystemFileDlg = (function (_super) {
    __extends(EditSystemFileDlg, _super);
    function EditSystemFileDlg(fileName) {
        var _this = _super.call(this, "EditSystemFileDlg") || this;
        _this.fileName = fileName;
        _this.build = function () {
            var content = "<h2>File Editor: " + _this.fileName + "</h2>";
            var buttons = _this.makeCloseButton("Save", "SaveFileButton", _this.saveEdit)
                + _this.makeCloseButton("Cancel", "CancelFileEditButton", _this.cancelEdit);
            content += render.centeredButtonBar(buttons);
            return content;
        };
        _this.saveEdit = function () {
            console.log("save.");
        };
        _this.cancelEdit = function () {
            console.log("cancel.");
        };
        _this.init = function () {
        };
        return _this;
    }
    return EditSystemFileDlg;
}(DialogBase));
var MessageDlg = (function (_super) {
    __extends(MessageDlg, _super);
    function MessageDlg(message, title, callback) {
        var _this = _super.call(this, "MessageDlg") || this;
        _this.message = message;
        _this.title = title;
        _this.callback = callback;
        _this.build = function () {
            var content = _this.makeHeader(_this.title) + "<p>" + _this.message + "</p>";
            content += render.centeredButtonBar(_this.makeCloseButton("Ok", "messageDlgOkButton", _this.callback));
            return content;
        };
        if (!title) {
            title = "Message";
        }
        _this.title = title;
        return _this;
    }
    return MessageDlg;
}(DialogBase));
var LoginDlg = (function (_super) {
    __extends(LoginDlg, _super);
    function LoginDlg() {
        var _this = _super.call(this, "LoginDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Login");
            var formControls = _this.makeEditField("User", "userName") +
                _this.makePasswordField("Password", "password");
            var loginButton = _this.makeButton("Login", "loginButton", _this.login, _this);
            var resetPasswordButton = _this.makeButton("Forgot Password", "resetPasswordButton", _this.resetPassword, _this);
            var backButton = _this.makeCloseButton("Close", "cancelLoginButton");
            var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
            var divider = "<div><h3>Or Login With...</h3></div>";
            var form = formControls + buttonBar;
            var mainContent = form;
            var content = header + mainContent;
            _this.bindEnterKey("userName", user.login);
            _this.bindEnterKey("password", user.login);
            return content;
        };
        _this.init = function () {
            _this.populateFromCookies();
        };
        _this.populateFromCookies = function () {
            var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
            var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
            if (usr) {
                _this.setInputVal("userName", usr);
            }
            if (pwd) {
                _this.setInputVal("password", pwd);
            }
        };
        _this.login = function () {
            var usr = _this.getInputVal("userName");
            var pwd = _this.getInputVal("password");
            user.login(_this, usr, pwd);
        };
        _this.resetPassword = function () {
            var thiz = _this;
            var usr = _this.getInputVal("userName");
            (new ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
                thiz.cancel();
                (new ResetPasswordDlg(usr)).open();
            })).open();
        };
        return _this;
    }
    return LoginDlg;
}(DialogBase));
var SignupDlg = (function (_super) {
    __extends(SignupDlg, _super);
    function SignupDlg() {
        var _this = _super.call(this, "SignupDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader(BRANDING_TITLE + " Signup");
            var formControls = _this.makeEditField("User", "signupUserName") +
                _this.makePasswordField("Password", "signupPassword") +
                _this.makeEditField("Email", "signupEmail") +
                _this.makeEditField("Captcha", "signupCaptcha");
            var captchaImage = render.tag("div", {
                "class": "captcha-image"
            }, render.tag("img", {
                "id": _this.id("captchaImage"),
                "class": "captcha",
                "src": ""
            }, "", false));
            var signupButton = _this.makeButton("Signup", "signupButton", _this.signup, _this);
            var newCaptchaButton = _this.makeButton("Try Different Image", "tryAnotherCaptchaButton", _this.tryAnotherCaptcha, _this);
            var backButton = _this.makeCloseButton("Close", "cancelSignupButton");
            var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);
            return header + formControls + captchaImage + buttonBar;
        };
        _this.signup = function () {
            var userName = _this.getInputVal("signupUserName");
            var password = _this.getInputVal("signupPassword");
            var email = _this.getInputVal("signupEmail");
            var captcha = _this.getInputVal("signupCaptcha");
            if (!userName || userName.length == 0 ||
                !password || password.length == 0 ||
                !email || email.length == 0 ||
                !captcha || captcha.length == 0) {
                (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
                return;
            }
            util.json("signup", {
                "userName": userName,
                "password": password,
                "email": email,
                "captcha": captcha
            }, _this.signupResponse, _this);
        };
        _this.signupResponse = function (res) {
            if (util.checkSuccess("Signup new user", res)) {
                _this.cancel();
                (new MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
            }
        };
        _this.tryAnotherCaptcha = function () {
            var n = util.currentTimeMillis();
            var src = postTargetUrl + "captcha?t=" + n;
            $("#" + _this.id("captchaImage")).attr("src", src);
        };
        _this.pageInitSignupPg = function () {
            _this.tryAnotherCaptcha();
        };
        _this.init = function () {
            _this.pageInitSignupPg();
            util.delayedFocus("#" + _this.id("signupUserName"));
        };
        return _this;
    }
    return SignupDlg;
}(DialogBase));
var PrefsDlg = (function (_super) {
    __extends(PrefsDlg, _super);
    function PrefsDlg() {
        var _this = _super.call(this, "PrefsDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Peferences");
            var radioButtons = _this.makeRadioButton("Simple", "editModeSimple") +
                _this.makeRadioButton("Advanced", "editModeAdvanced");
            var radioButtonGroup = render.tag("paper-radio-group", {
                "id": _this.id("simpleModeRadioGroup"),
                "selected": _this.id("editModeSimple")
            }, radioButtons);
            var showMetaDataCheckBox = _this.makeCheckBox("Show Row Metadata", "showMetaData", meta64.showMetaData);
            var checkboxBar = render.makeHorzControlGroup(showMetaDataCheckBox);
            var formControls = radioButtonGroup;
            var legend = "<legend>Edit Mode:</legend>";
            var radioBar = render.makeHorzControlGroup(legend + formControls);
            var saveButton = _this.makeCloseButton("Save", "savePreferencesButton", _this.savePreferences, _this);
            var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
            var buttonBar = render.centeredButtonBar(saveButton + backButton);
            return header + radioBar + checkboxBar + buttonBar;
        };
        _this.savePreferences = function () {
            var polyElm = util.polyElm(_this.id("simpleModeRadioGroup"));
            meta64.editModeOption = polyElm.node.selected == _this.id("editModeSimple") ? meta64.MODE_SIMPLE
                : meta64.MODE_ADVANCED;
            var showMetaDataCheckbox = util.polyElm(_this.id("showMetaData"));
            meta64.showMetaData = showMetaDataCheckbox.node.checked;
            util.json("saveUserPreferences", {
                "userPreferences": {
                    "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED,
                    "editMode": meta64.userPreferences.editMode,
                    "lastNode": null,
                    "importAllowed": false,
                    "exportAllowed": false,
                    "showMetaData": meta64.showMetaData
                }
            }, _this.savePreferencesResponse, _this);
        };
        _this.savePreferencesResponse = function (res) {
            if (util.checkSuccess("Saving Preferences", res)) {
                meta64.selectTab("mainTabName");
                meta64.refresh();
            }
        };
        _this.init = function () {
            var polyElm = util.polyElm(_this.id("simpleModeRadioGroup"));
            polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? _this.id("editModeSimple") : _this
                .id("editModeAdvanced"));
            polyElm = util.polyElm(_this.id("showMetaData"));
            polyElm.node.checked = meta64.showMetaData;
            Polymer.dom.flush();
        };
        return _this;
    }
    return PrefsDlg;
}(DialogBase));
var ManageAccountDlg = (function (_super) {
    __extends(ManageAccountDlg, _super);
    function ManageAccountDlg() {
        var _this = _super.call(this, "ManageAccountDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Manage Account");
            var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
            var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : _this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
            var buttonBar = render.centeredButtonBar(closeAccountButton);
            var bottomButtonBar = render.centeredButtonBar(backButton);
            var bottomButtonBarDiv = render.tag("div", {
                "class": "close-account-bar"
            }, bottomButtonBar);
            return header + buttonBar + bottomButtonBarDiv;
        };
        return _this;
    }
    return ManageAccountDlg;
}(DialogBase));
var ExportDlg = (function (_super) {
    __extends(ExportDlg, _super);
    function ExportDlg() {
        var _this = _super.call(this, "ExportDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Export to XML");
            var formControls = _this.makeEditField("Export to File Name", "exportTargetNodeName");
            var exportButton = _this.makeButton("Export", "exportNodesButton", _this.exportNodes, _this);
            var backButton = _this.makeCloseButton("Close", "cancelExportButton");
            var buttonBar = render.centeredButtonBar(exportButton + backButton);
            return header + formControls + buttonBar;
        };
        _this.exportNodes = function () {
            var highlightNode = meta64.getHighlightedNode();
            var targetFileName = _this.getInputVal("exportTargetNodeName");
            if (util.emptyString(targetFileName)) {
                (new MessageDlg("Please enter a name for the export file.")).open();
                return;
            }
            if (highlightNode) {
                util.json("exportToXml", {
                    "nodeId": highlightNode.id,
                    "targetFileName": targetFileName
                }, _this.exportResponse, _this);
            }
        };
        _this.exportResponse = function (res) {
            if (util.checkSuccess("Export", res)) {
                (new MessageDlg("Export Successful.")).open();
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        return _this;
    }
    return ExportDlg;
}(DialogBase));
var ImportDlg = (function (_super) {
    __extends(ImportDlg, _super);
    function ImportDlg() {
        var _this = _super.call(this, "ImportDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Import from XML");
            var formControls = _this.makeEditField("File name to import", "sourceFileName");
            var importButton = _this.makeButton("Import", "importNodesButton", _this.importNodes, _this);
            var backButton = _this.makeCloseButton("Close", "cancelImportButton");
            var buttonBar = render.centeredButtonBar(importButton + backButton);
            return header + formControls + buttonBar;
        };
        _this.importNodes = function () {
            var highlightNode = meta64.getHighlightedNode();
            var sourceFileName = _this.getInputVal("sourceFileName");
            if (util.emptyString(sourceFileName)) {
                (new MessageDlg("Please enter a name for the import file.")).open();
                return;
            }
            if (highlightNode) {
                util.json("import", {
                    "nodeId": highlightNode.id,
                    "sourceFileName": sourceFileName
                }, _this.importResponse, _this);
            }
        };
        _this.importResponse = function (res) {
            if (util.checkSuccess("Import", res)) {
                (new MessageDlg("Import Successful.")).open();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        return _this;
    }
    return ImportDlg;
}(DialogBase));
var SearchContentDlg = (function (_super) {
    __extends(SearchContentDlg, _super);
    function SearchContentDlg() {
        var _this = _super.call(this, "SearchContentDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Search Content");
            var instructions = _this.makeMessageArea("Enter some text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
            var formControls = _this.makeEditField("Search", "searchText");
            var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchNodes, _this);
            var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);
            var content = header + instructions + formControls + buttonBar;
            _this.bindEnterKey("searchText", srch.searchNodes);
            return content;
        };
        _this.searchNodes = function () {
            return _this.searchProperty(jcrCnst.CONTENT);
        };
        _this.searchProperty = function (searchProp) {
            if (!util.ajaxReady("searchNodes")) {
                return;
            }
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }
            var searchText = _this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": searchText,
                "sortDir": "",
                "sortField": "",
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        };
        _this.init = function () {
            _this.focus("searchText");
        };
        return _this;
    }
    return SearchContentDlg;
}(DialogBase));
var SearchTagsDlg = (function (_super) {
    __extends(SearchTagsDlg, _super);
    function SearchTagsDlg() {
        var _this = _super.call(this, "SearchTagsDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Search Tags");
            var instructions = _this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
            var formControls = _this.makeEditField("Search", "searchText");
            var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchTags, _this);
            var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);
            var content = header + instructions + formControls + buttonBar;
            _this.bindEnterKey("searchText", srch.searchNodes);
            return content;
        };
        _this.searchTags = function () {
            return _this.searchProperty(jcrCnst.TAGS);
        };
        _this.searchProperty = function (searchProp) {
            if (!util.ajaxReady("searchNodes")) {
                return;
            }
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }
            var searchText = _this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": searchText,
                "sortDir": "",
                "sortField": "",
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        };
        _this.init = function () {
            util.delayedFocus(_this.id("searchText"));
        };
        return _this;
    }
    return SearchTagsDlg;
}(DialogBase));
var SearchFilesDlg = (function (_super) {
    __extends(SearchFilesDlg, _super);
    function SearchFilesDlg(lucene) {
        var _this = _super.call(this, "SearchFilesDlg") || this;
        _this.lucene = lucene;
        _this.build = function () {
            var header = _this.makeHeader("Search Files");
            var instructions = _this.makeMessageArea("Enter some text to find.");
            var formControls = _this.makeEditField("Search", "searchText");
            var searchButton = _this.makeCloseButton("Search", "searchButton", _this.searchTags, _this);
            var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);
            var content = header + instructions + formControls + buttonBar;
            _this.bindEnterKey("searchText", srch.searchNodes);
            return content;
        };
        _this.searchTags = function () {
            return _this.searchProperty(jcrCnst.TAGS);
        };
        _this.searchProperty = function (searchProp) {
            if (!util.ajaxReady("searchFiles")) {
                return;
            }
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }
            var searchText = _this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }
            var nodeId = null;
            var selNode = meta64.getHighlightedNode();
            if (selNode) {
                nodeId = selNode.id;
            }
            util.json("fileSearch", {
                "nodeId": nodeId,
                "reindex": false,
                "searchText": searchText
            }, srch.searchFilesResponse, srch);
        };
        _this.init = function () {
            util.delayedFocus(_this.id("searchText"));
        };
        return _this;
    }
    return SearchFilesDlg;
}(DialogBase));
var ChangePasswordDlg = (function (_super) {
    __extends(ChangePasswordDlg, _super);
    function ChangePasswordDlg(passCode) {
        var _this = _super.call(this, "ChangePasswordDlg") || this;
        _this.passCode = passCode;
        _this.build = function () {
            var header = _this.makeHeader(_this.passCode ? "Password Reset" : "Change Password");
            var message = render.tag("p", {}, "Enter your new password below...");
            var formControls = _this.makePasswordField("New Password", "changePassword1");
            var changePasswordButton = _this.makeCloseButton("Change Password", "changePasswordActionButton", _this.changePassword, _this);
            var backButton = _this.makeCloseButton("Close", "cancelChangePasswordButton");
            var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);
            return header + message + formControls + buttonBar;
        };
        _this.changePassword = function () {
            _this.pwd = _this.getInputVal("changePassword1").trim();
            if (_this.pwd && _this.pwd.length >= 4) {
                util.json("changePassword", {
                    "newPassword": _this.pwd,
                    "passCode": _this.passCode
                }, _this.changePasswordResponse, _this);
            }
            else {
                (new MessageDlg("Invalid password(s).")).open();
            }
        };
        _this.changePasswordResponse = function (res) {
            if (util.checkSuccess("Change password", res)) {
                var msg = "Password changed successfully.";
                if (_this.passCode) {
                    msg += "<p>You may now login as <b>" + res.user
                        + "</b> with your new password.";
                }
                var thiz = _this;
                (new MessageDlg(msg, "Password Change", function () {
                    if (thiz.passCode) {
                        window.location.href = window.location.origin;
                    }
                })).open();
            }
        };
        _this.init = function () {
            _this.focus("changePassword1");
        };
        return _this;
    }
    return ChangePasswordDlg;
}(DialogBase));
var ResetPasswordDlg = (function (_super) {
    __extends(ResetPasswordDlg, _super);
    function ResetPasswordDlg(user) {
        var _this = _super.call(this, "ResetPasswordDlg") || this;
        _this.user = user;
        _this.build = function () {
            var header = _this.makeHeader("Reset Password");
            var message = _this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");
            var formControls = _this.makeEditField("User", "userName") +
                _this.makeEditField("Email Address", "emailAddress");
            var resetPasswordButton = _this.makeCloseButton("Reset my Password", "resetPasswordButton", _this.resetPassword, _this);
            var backButton = _this.makeCloseButton("Close", "cancelResetPasswordButton");
            var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);
            return header + message + formControls + buttonBar;
        };
        _this.resetPassword = function () {
            var userName = _this.getInputVal("userName").trim();
            var emailAddress = _this.getInputVal("emailAddress").trim();
            if (userName && emailAddress) {
                util.json("resetPassword", {
                    "user": userName,
                    "email": emailAddress
                }, _this.resetPasswordResponse, _this);
            }
            else {
                (new MessageDlg("Oops. Try that again.")).open();
            }
        };
        _this.resetPasswordResponse = function (res) {
            if (util.checkSuccess("Reset password", res)) {
                (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
            }
        };
        _this.init = function () {
            if (_this.user) {
                _this.setInputVal("userName", _this.user);
            }
        };
        return _this;
    }
    return ResetPasswordDlg;
}(DialogBase));
var UploadFromFileDlg = (function (_super) {
    __extends(UploadFromFileDlg, _super);
    function UploadFromFileDlg() {
        var _this = _super.call(this, "UploadFromFileDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Upload File Attachment");
            var uploadPathDisplay = "";
            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {
                    "id": _this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }
            var uploadFieldContainer = "";
            var formFields = "";
            for (var i = 0; i < 7; i++) {
                var input = render.tag("input", {
                    "id": _this.id("upload" + i + "FormInputId"),
                    "type": "file",
                    "name": "files"
                }, "", true);
                formFields += render.tag("div", {
                    "style": "margin-bottom: 10px;"
                }, input);
            }
            formFields += render.tag("input", {
                "id": _this.id("uploadFormNodeId"),
                "type": "hidden",
                "name": "nodeId"
            }, "", true);
            formFields += render.tag("input", {
                "id": _this.id("explodeZips"),
                "type": "hidden",
                "name": "explodeZips"
            }, "", true);
            var form = render.tag("form", {
                "id": _this.id("uploadForm"),
                "method": "POST",
                "enctype": "multipart/form-data",
                "data-ajax": "false"
            }, formFields);
            uploadFieldContainer = render.tag("div", {
                "id": _this.id("uploadFieldContainer")
            }, "<p>Upload from your computer</p>" + form);
            var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
            var backButton = _this.makeCloseButton("Close", "closeUploadButton");
            var buttonBar = render.centeredButtonBar(uploadButton + backButton);
            return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
        };
        _this.hasAnyZipFiles = function () {
            var ret = false;
            for (var i = 0; i < 7; i++) {
                var inputVal = $("#" + _this.id("upload" + i + "FormInputId")).val();
                if (inputVal.toLowerCase().endsWith(".zip")) {
                    return true;
                }
            }
            return ret;
        };
        _this.uploadFileNow = function () {
            var uploadFunc = function (explodeZips) {
                $("#" + _this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
                $("#" + _this.id("explodeZips")).attr("value", explodeZips ? "true" : "false");
                var data = new FormData(($("#" + _this.id("uploadForm"))[0]));
                var prms = $.ajax({
                    url: postTargetUrl + "upload",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST'
                });
                prms.done(function () {
                    meta64.refresh();
                });
                prms.fail(function () {
                    (new MessageDlg("Upload failed.")).open();
                });
            };
            if (_this.hasAnyZipFiles()) {
                (new ConfirmDlg("Explode Zips?", "Do you want Zip files exploded onto the tree when uploaded?", "Yes, explode zips", function () {
                    uploadFunc(true);
                }, function () {
                    uploadFunc(false);
                })).open();
            }
            else {
                uploadFunc(false);
            }
        };
        _this.init = function () {
            $("#" + _this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        };
        return _this;
    }
    return UploadFromFileDlg;
}(DialogBase));
var UploadFromFileDropzoneDlg = (function (_super) {
    __extends(UploadFromFileDropzoneDlg, _super);
    function UploadFromFileDropzoneDlg() {
        var _this = _super.call(this, "UploadFromFileDropzoneDlg") || this;
        _this.fileList = null;
        _this.zipQuestionAnswered = false;
        _this.explodeZips = false;
        _this.build = function () {
            var header = _this.makeHeader("Upload File Attachment");
            var uploadPathDisplay = "";
            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {
                    "id": _this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }
            var formFields = "";
            console.log("Upload Action URL: " + postTargetUrl + "upload");
            var hiddenInputContainer = render.tag("div", {
                "id": _this.id("hiddenInputContainer"),
                "style": "display: none;"
            }, "");
            var form = render.tag("form", {
                "action": postTargetUrl + "upload",
                "autoProcessQueue": false,
                "class": "dropzone",
                "id": _this.id("dropzone-form-id")
            }, "");
            var uploadButton = _this.makeCloseButton("Upload", "uploadButton", null, null, false);
            var backButton = _this.makeCloseButton("Close", "closeUploadButton");
            var buttonBar = render.centeredButtonBar(uploadButton + backButton);
            return header + uploadPathDisplay + form + hiddenInputContainer + buttonBar;
        };
        _this.configureDropZone = function () {
            var thiz = _this;
            var config = {
                url: postTargetUrl + "upload",
                autoProcessQueue: false,
                paramName: "files",
                maxFilesize: 2,
                parallelUploads: 10,
                uploadMultiple: false,
                addRemoveLinks: true,
                dictDefaultMessage: "Drag & Drop files here, or Click",
                hiddenInputContainer: "#" + thiz.id("hiddenInputContainer"),
                init: function () {
                    var dropzone = this;
                    var submitButton = document.querySelector("#" + thiz.id("uploadButton"));
                    if (!submitButton) {
                        console.log("Unable to get upload button.");
                    }
                    submitButton.addEventListener("click", function (e) {
                        dropzone.processQueue();
                    });
                    this.on("addedfile", function () {
                        thiz.updateFileList(this);
                        thiz.runButtonEnablement(this);
                    });
                    this.on("removedfile", function () {
                        thiz.updateFileList(this);
                        thiz.runButtonEnablement(this);
                    });
                    this.on("sending", function (file, xhr, formData) {
                        formData.append("nodeId", attachment.uploadNode.id);
                        formData.append("explodeZips", this.explodeZips ? "true" : "false");
                        this.zipQuestionAnswered = false;
                    });
                    this.on("queuecomplete", function (file) {
                        meta64.refresh();
                    });
                }
            };
            $("#" + _this.id("dropzone-form-id")).dropzone(config);
        };
        _this.updateFileList = function (dropzoneEvt) {
            var thiz = _this;
            _this.fileList = dropzoneEvt.getAddedFiles();
            _this.fileList = _this.fileList.concat(dropzoneEvt.getQueuedFiles());
            if (!_this.zipQuestionAnswered && _this.hasAnyZipFiles()) {
                _this.zipQuestionAnswered = true;
                (new ConfirmDlg("Explode Zips?", "Do you want Zip files exploded onto the tree when uploaded?", "Yes, explode zips", function () {
                    thiz.explodeZips = true;
                }, function () {
                    thiz.explodeZips = false;
                })).open();
            }
        };
        _this.hasAnyZipFiles = function () {
            var ret = false;
            for (var _i = 0, _a = _this.fileList; _i < _a.length; _i++) {
                var file = _a[_i];
                if (file["name"].toLowerCase().endsWith(".zip")) {
                    return true;
                }
            }
            return ret;
        };
        _this.runButtonEnablement = function (dropzoneEvt) {
            if (dropzoneEvt.getAddedFiles().length > 0 ||
                dropzoneEvt.getQueuedFiles().length > 0) {
                $("#" + _this.id("uploadButton")).show();
            }
            else {
                $("#" + _this.id("uploadButton")).hide();
            }
        };
        _this.init = function () {
            $("#" + _this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
            _this.configureDropZone();
        };
        return _this;
    }
    return UploadFromFileDropzoneDlg;
}(DialogBase));
var UploadFromUrlDlg = (function (_super) {
    __extends(UploadFromUrlDlg, _super);
    function UploadFromUrlDlg() {
        var _this = _super.call(this, "UploadFromUrlDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Upload File Attachment");
            var uploadPathDisplay = "";
            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {
                    "id": _this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }
            var uploadFieldContainer = "";
            var uploadFromUrlDiv = "";
            var uploadFromUrlField = _this.makeEditField("Upload From URL", "uploadFromUrl");
            uploadFromUrlDiv = render.tag("div", {}, uploadFromUrlField);
            var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
            var backButton = _this.makeCloseButton("Close", "closeUploadButton");
            var buttonBar = render.centeredButtonBar(uploadButton + backButton);
            return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
        };
        _this.uploadFileNow = function () {
            var sourceUrl = _this.getInputVal("uploadFromUrl");
            if (sourceUrl) {
                util.json("uploadFromUrl", {
                    "nodeId": attachment.uploadNode.id,
                    "sourceUrl": sourceUrl
                }, _this.uploadFromUrlResponse, _this);
            }
        };
        _this.uploadFromUrlResponse = function (res) {
            if (util.checkSuccess("Upload from URL", res)) {
                meta64.refresh();
            }
        };
        _this.init = function () {
            util.setInputVal(_this.id("uploadFromUrl"), "");
            $("#" + _this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        };
        return _this;
    }
    return UploadFromUrlDlg;
}(DialogBase));
var EditNodeDlg = (function (_super) {
    __extends(EditNodeDlg, _super);
    function EditNodeDlg(typeName, createAtTop) {
        var _this = _super.call(this, "EditNodeDlg") || this;
        _this.typeName = typeName;
        _this.createAtTop = createAtTop;
        _this.fieldIdToPropMap = {};
        _this.propEntries = new Array();
        _this.build = function () {
            var header = _this.makeHeader("Edit Node");
            var saveNodeButton = _this.makeCloseButton("Save", "saveNodeButton", _this.saveNode, _this);
            var addPropertyButton = _this.makeButton("Add Property", "addPropertyButton", _this.addProperty, _this);
            var addTagsPropertyButton = _this.makeButton("Add Tags", "addTagsPropertyButton", _this.addTagsProperty, _this);
            var splitContentButton = _this.makeButton("Split", "splitContentButton", _this.splitContent, _this);
            var deletePropButton = _this.makeButton("Delete", "deletePropButton", _this.deletePropertyButtonClick, _this);
            var cancelEditButton = _this.makeCloseButton("Close", "cancelEditButton", _this.cancelEdit, _this);
            var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton + deletePropButton
                + splitContentButton + cancelEditButton, "buttons");
            var width = 800;
            var height = 600;
            var internalMainContent = "";
            if (cnst.SHOW_PATH_IN_DLGS) {
                internalMainContent += render.tag("div", {
                    id: _this.id("editNodePathDisplay"),
                    "class": "path-display-in-editor"
                });
            }
            internalMainContent += render.tag("div", {
                id: _this.id("editNodeInstructions")
            }) + render.tag("div", {
                id: _this.id("propertyEditFieldContainer"),
                style: "padding-left: 0px; max-width:" + width + "px;height:" + height + "px;width:100%; overflow:scroll; border:4px solid lightGray;",
                class: "vertical-layout-row"
            }, "Loading...");
            return header + internalMainContent + buttonBar;
        };
        _this.populateEditNodePg = function () {
            view.initEditPathDisplayById(_this.id("editNodePathDisplay"));
            var fields = "";
            var counter = 0;
            _this.fieldIdToPropMap = {};
            _this.propEntries = new Array();
            if (edit.editNode) {
                console.log("Editing existing node.");
                var thiz = _this;
                var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode, edit.editNode.properties);
                var aceFields = [];
                $.each(editOrderedProps, function (index, prop) {
                    if (!render.allowPropertyToDisplay(prop.name)) {
                        console.log("Hiding property: " + prop.name);
                        return;
                    }
                    var fieldId = thiz.id("editNodeTextContent" + index);
                    console.log("Creating edit field " + fieldId + " for property " + prop.name);
                    var isMulti = prop.values && prop.values.length > 0;
                    var isReadOnlyProp = render.isReadOnlyProperty(prop.name);
                    var isBinaryProp = render.isBinaryProperty(prop.name);
                    var propEntry = new PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);
                    thiz.fieldIdToPropMap[fieldId] = propEntry;
                    thiz.propEntries.push(propEntry);
                    var field = "";
                    if (isMulti) {
                        field += thiz.makeMultiPropEditor(propEntry);
                    }
                    else {
                        field += thiz.makeSinglePropEditor(propEntry, aceFields);
                    }
                    fields += render.tag("div", {
                        "class": ((!isReadOnlyProp && !isBinaryProp) || edit.showReadOnlyProperties ? "propertyEditListItem"
                            : "propertyEditListItemHidden")
                    }, field);
                });
            }
            else {
                console.log("Editing new node.");
                if (cnst.USE_ACE_EDITOR) {
                    var aceFieldId = _this.id("newNodeNameId");
                    fields += render.tag("div", {
                        "id": aceFieldId,
                        "class": "ace-edit-panel",
                        "html": "true"
                    }, '', true);
                    aceFields.push({
                        id: aceFieldId,
                        val: ""
                    });
                }
                else {
                    var field = render.tag("paper-textarea", {
                        "id": _this.id("newNodeNameId"),
                        "label": "New Node Name"
                    }, '', true);
                    fields += render.tag("div", { "display": "table-row" }, field);
                }
            }
            var propTable = render.tag("div", {
                "display": "table",
            }, fields);
            util.setHtml(_this.id("propertyEditFieldContainer"), propTable);
            if (cnst.USE_ACE_EDITOR) {
                for (var i = 0; i < aceFields.length; i++) {
                    var editor = ace.edit(aceFields[i].id);
                    editor.setValue(util.unencodeHtml(aceFields[i].val));
                    meta64.aceEditorsById[aceFields[i].id] = editor;
                }
            }
            var instr = edit.editingUnsavedNode ?
                "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                :
                    "";
            _this.el("editNodeInstructions").html(instr);
            util.setVisibility("#" + _this.id("addPropertyButton"), !edit.editingUnsavedNode);
            var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
            util.setVisibility("#" + _this.id("addTagsPropertyButton"), !tagsPropExists);
        };
        _this.toggleShowReadOnly = function () {
        };
        _this.addProperty = function () {
            _this.editPropertyDlgInst = new EditPropertyDlg(_this);
            _this.editPropertyDlgInst.open();
        };
        _this.addTagsProperty = function () {
            if (props.getNodePropertyVal(edit.editNode, "tags")) {
                return;
            }
            var postData = {
                nodeId: edit.editNode.id,
                propertyName: "tags",
                propertyValue: ""
            };
            util.json("saveProperty", postData, _this.addTagsPropertyResponse, _this);
        };
        _this.addTagsPropertyResponse = function (res) {
            if (util.checkSuccess("Add Tags Property", res)) {
                _this.savePropertyResponse(res);
            }
        };
        _this.savePropertyResponse = function (res) {
            util.checkSuccess("Save properties", res);
            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;
            _this.populateEditNodePg();
        };
        _this.addSubProperty = function (fieldId) {
            var prop = _this.fieldIdToPropMap[fieldId].property;
            var isMulti = util.isObject(prop.values);
            if (!isMulti) {
                prop.values = [];
                prop.values.push(prop.value);
                prop.value = null;
            }
            prop.values.push("");
            _this.populateEditNodePg();
        };
        _this.deleteProperty = function (propName) {
            var thiz = _this;
            (new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
                thiz.deletePropertyImmediate(propName);
            })).open();
        };
        _this.deletePropertyImmediate = function (propName) {
            var thiz = _this;
            util.json("deleteProperty", {
                "nodeId": edit.editNode.id,
                "propName": propName
            }, function (res) {
                thiz.deletePropertyResponse(res, propName);
            });
        };
        _this.deletePropertyResponse = function (res, propertyToDelete) {
            if (util.checkSuccess("Delete property", res)) {
                props.deletePropertyFromLocalData(propertyToDelete);
                meta64.treeDirty = true;
                _this.populateEditNodePg();
            }
        };
        _this.clearProperty = function (fieldId) {
            if (!cnst.USE_ACE_EDITOR) {
                util.setInputVal(_this.id(fieldId), "");
            }
            else {
                var editor = meta64.aceEditorsById[_this.id(fieldId)];
                if (editor) {
                    editor.setValue("");
                }
            }
            var counter = 0;
            while (counter < 1000) {
                if (!cnst.USE_ACE_EDITOR) {
                    if (!util.setInputVal(_this.id(fieldId + "_subProp" + counter), "")) {
                        break;
                    }
                }
                else {
                    var editor = meta64.aceEditorsById[_this.id(fieldId + "_subProp" + counter)];
                    if (editor) {
                        editor.setValue("");
                    }
                    else {
                        break;
                    }
                }
                counter++;
            }
        };
        _this.saveNode = function () {
            if (edit.editingUnsavedNode) {
                console.log("saveNewNode.");
                _this.saveNewNode();
            }
            else {
                console.log("saveExistingNode.");
                _this.saveExistingNode();
            }
        };
        _this.saveNewNode = function (newNodeName) {
            if (!newNodeName) {
                newNodeName = util.getInputVal(_this.id("newNodeNameId"));
            }
            if (meta64.userName != edit.parentOfNewNode.createdBy &&
                edit.parentOfNewNode.createdBy != "admin") {
                edit.sendNotificationPendingSave = true;
            }
            meta64.treeDirty = true;
            if (edit.nodeInsertTarget) {
                util.json("insertNode", {
                    "parentId": edit.parentOfNewNode.id,
                    "targetName": edit.nodeInsertTarget.name,
                    "newNodeName": newNodeName,
                    "typeName": _this.typeName ? _this.typeName : "nt:unstructured"
                }, edit.insertNodeResponse, edit);
            }
            else {
                util.json("createSubNode", {
                    "nodeId": edit.parentOfNewNode.id,
                    "newNodeName": newNodeName,
                    "typeName": _this.typeName ? _this.typeName : "nt:unstructured",
                    "createAtTop": _this.createAtTop
                }, edit.createSubNodeResponse, edit);
            }
        };
        _this.saveExistingNode = function () {
            console.log("saveExistingNode");
            var propertiesList = [];
            var thiz = _this;
            $.each(_this.propEntries, function (index, prop) {
                console.log("--------------- Getting prop idx: " + index);
                if (prop.readOnly || prop.binary)
                    return;
                if (!prop.multi) {
                    console.log("Saving non-multi property field: " + JSON.stringify(prop));
                    var propVal;
                    if (cnst.USE_ACE_EDITOR) {
                        var editor = meta64.aceEditorsById[prop.id];
                        if (!editor)
                            throw "Unable to find Ace Editor for ID: " + prop.id;
                        propVal = editor.getValue();
                    }
                    else {
                        propVal = util.getTextAreaValById(prop.id);
                    }
                    if (propVal !== prop.value) {
                        console.log("Prop changed: propName=" + prop.property.name + " propVal=" + propVal);
                        propertiesList.push({
                            "name": prop.property.name,
                            "value": propVal
                        });
                    }
                    else {
                        console.log("Prop didn't change: " + prop.id);
                    }
                }
                else {
                    console.log("Saving multi property field: " + JSON.stringify(prop));
                    var propVals = [];
                    $.each(prop.subProps, function (index, subProp) {
                        console.log("subProp[" + index + "]: " + JSON.stringify(subProp));
                        var propVal;
                        if (cnst.USE_ACE_EDITOR) {
                            var editor = meta64.aceEditorsById[subProp.id];
                            if (!editor)
                                throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                            propVal = editor.getValue();
                        }
                        else {
                            propVal = util.getTextAreaValById(subProp.id);
                        }
                        console.log("    subProp[" + index + "] of " + prop.name + " val=" + propVal);
                        propVals.push(propVal);
                    });
                    propertiesList.push({
                        "name": prop.name,
                        "values": propVals
                    });
                }
            });
            if (propertiesList.length > 0) {
                var postData = {
                    nodeId: edit.editNode.id,
                    properties: propertiesList,
                    sendNotification: edit.sendNotificationPendingSave
                };
                console.log("calling saveNode(). PostData=" + util.toJson(postData));
                util.json("saveNode", postData, edit.saveNodeResponse, null, {
                    savedId: edit.editNode.id
                });
                edit.sendNotificationPendingSave = false;
            }
            else {
                console.log("nothing changed. Nothing to save.");
            }
        };
        _this.makeMultiPropEditor = function (propEntry) {
            console.log("Making Multi Editor: Property multi-type: name=" + propEntry.property.name + " count="
                + propEntry.property.values.length);
            var fields = "";
            propEntry.subProps = [];
            var propList = propEntry.property.values;
            if (!propList || propList.length == 0) {
                propList = [];
                propList.push("");
            }
            for (var i = 0; i < propList.length; i++) {
                console.log("prop multi-val[" + i + "]=" + propList[i]);
                var id = _this.id(propEntry.id + "_subProp" + i);
                var propVal = propEntry.binary ? "[binary]" : propList[i];
                var propValStr = propVal || '';
                propValStr = util.escapeForAttrib(propVal);
                var label = (i == 0 ? propEntry.property.name : "*") + "." + i;
                console.log("Creating textarea with id=" + id);
                var subProp = new SubProp(id, propVal);
                propEntry.subProps.push(subProp);
                if (propEntry.binary || propEntry.readOnly) {
                    fields += render.tag("paper-textarea", {
                        "id": id,
                        "readonly": "readonly",
                        "disabled": "disabled",
                        "label": label,
                        "value": propValStr
                    }, '', true);
                }
                else {
                    fields += render.tag("paper-textarea", {
                        "id": id,
                        "label": label,
                        "value": propValStr
                    }, '', true);
                }
            }
            var col = render.tag("div", {
                "style": "display: table-cell;"
            }, fields);
            return col;
        };
        _this.makeSinglePropEditor = function (propEntry, aceFields) {
            console.log("Property single-type: " + propEntry.property.name);
            var field = "";
            var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
            var label = render.sanitizePropertyName(propEntry.property.name);
            var propValStr = propVal ? propVal : '';
            propValStr = util.escapeForAttrib(propValStr);
            console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
                + "] fieldId=" + propEntry.id);
            var propSelCheckbox = "";
            if (propEntry.readOnly || propEntry.binary) {
                field += render.tag("paper-textarea", {
                    "id": propEntry.id,
                    "readonly": "readonly",
                    "disabled": "disabled",
                    "label": label,
                    "value": propValStr
                }, "", true);
            }
            else {
                propSelCheckbox = _this.makeCheckBox("", "selProp_" + propEntry.id, false);
                if (propEntry.property.name == jcrCnst.CONTENT) {
                    _this.contentFieldDomId = propEntry.id;
                }
                if (!cnst.USE_ACE_EDITOR) {
                    field += render.tag("paper-textarea", {
                        "id": propEntry.id,
                        "label": label,
                        "value": propValStr
                    }, '', true);
                }
                else {
                    field += render.tag("div", {
                        "id": propEntry.id,
                        "class": "ace-edit-panel",
                        "html": "true"
                    }, '', true);
                    aceFields.push({
                        id: propEntry.id,
                        val: propValStr
                    });
                }
            }
            var selCol = render.tag("div", {
                "style": "width: 40px; display: table-cell; padding: 10px;"
            }, propSelCheckbox);
            var editCol = render.tag("div", {
                "style": "width: 100%; display: table-cell; padding: 10px;"
            }, field);
            return selCol + editCol;
        };
        _this.deletePropertyButtonClick = function () {
            for (var id in _this.fieldIdToPropMap) {
                if (_this.fieldIdToPropMap.hasOwnProperty(id)) {
                    var propEntry = _this.fieldIdToPropMap[id];
                    if (propEntry) {
                        var selPropDomId = "selProp_" + propEntry.id;
                        var selCheckbox = util.polyElm(_this.id(selPropDomId));
                        if (selCheckbox) {
                            var checked = selCheckbox.node.checked;
                            if (checked) {
                                _this.deleteProperty(propEntry.property.name);
                                return;
                            }
                        }
                    }
                    else {
                        throw "propEntry not found for id: " + id;
                    }
                }
            }
            console.log("Delete property: ");
        };
        _this.splitContent = function () {
            var nodeBelow = edit.getNodeBelow(edit.editNode);
            util.json("splitNode", {
                "nodeId": edit.editNode.id,
                "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
                "delimiter": null
            }, _this.splitContentResponse);
        };
        _this.splitContentResponse = function (res) {
            if (util.checkSuccess("Split content", res)) {
                _this.cancel();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        _this.cancelEdit = function () {
            _this.cancel();
            if (meta64.treeDirty) {
                meta64.goToMainPage(true);
            }
            else {
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        _this.init = function () {
            console.log("EditNodeDlg.init");
            _this.populateEditNodePg();
            if (_this.contentFieldDomId) {
                util.delayedFocus("#" + _this.contentFieldDomId);
            }
        };
        _this.fieldIdToPropMap = {};
        _this.propEntries = new Array();
        return _this;
    }
    return EditNodeDlg;
}(DialogBase));
var EditPropertyDlg = (function (_super) {
    __extends(EditPropertyDlg, _super);
    function EditPropertyDlg(editNodeDlg) {
        var _this = _super.call(this, "EditPropertyDlg") || this;
        _this.editNodeDlg = editNodeDlg;
        _this.build = function () {
            var header = _this.makeHeader("Edit Node Property");
            var savePropertyButton = _this.makeCloseButton("Save", "savePropertyButton", _this.saveProperty, _this);
            var cancelEditButton = _this.makeCloseButton("Cancel", "editPropertyPgCloseButton");
            var buttonBar = render.centeredButtonBar(savePropertyButton + cancelEditButton);
            var internalMainContent = "";
            if (cnst.SHOW_PATH_IN_DLGS) {
                internalMainContent += "<div id='" + _this.id("editPropertyPathDisplay")
                    + "' class='path-display-in-editor'></div>";
            }
            internalMainContent += "<div id='" + _this.id("addPropertyFieldContainer") + "'></div>";
            return header + internalMainContent + buttonBar;
        };
        _this.populatePropertyEdit = function () {
            var field = '';
            {
                var fieldPropNameId = "addPropertyNameTextContent";
                field += render.tag("paper-textarea", {
                    "name": fieldPropNameId,
                    "id": _this.id(fieldPropNameId),
                    "placeholder": "Enter property name",
                    "label": "Name"
                }, "", true);
            }
            {
                var fieldPropValueId = "addPropertyValueTextContent";
                field += render.tag("paper-textarea", {
                    "name": fieldPropValueId,
                    "id": _this.id(fieldPropValueId),
                    "placeholder": "Enter property text",
                    "label": "Value"
                }, "", true);
            }
            view.initEditPathDisplayById(_this.id("editPropertyPathDisplay"));
            util.setHtml(_this.id("addPropertyFieldContainer"), field);
        };
        _this.saveProperty = function () {
            var propertyNameData = util.getInputVal(_this.id("addPropertyNameTextContent"));
            var propertyValueData = util.getInputVal(_this.id("addPropertyValueTextContent"));
            var postData = {
                nodeId: edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: propertyValueData
            };
            util.json("saveProperty", postData, _this.savePropertyResponse, _this);
        };
        _this.savePropertyResponse = function (res) {
            util.checkSuccess("Save properties", res);
            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;
            _this.editNodeDlg.populateEditNodePg();
        };
        _this.init = function () {
            _this.populatePropertyEdit();
        };
        return _this;
    }
    return EditPropertyDlg;
}(DialogBase));
var ShareToPersonDlg = (function (_super) {
    __extends(ShareToPersonDlg, _super);
    function ShareToPersonDlg() {
        var _this = _super.call(this, "ShareToPersonDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Share Node to Person");
            var formControls = _this.makeEditField("User to Share With", "shareToUserName");
            var shareButton = _this.makeCloseButton("Share", "shareNodeToPersonButton", _this.shareNodeToPerson, _this);
            var backButton = _this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
            var buttonBar = render.centeredButtonBar(shareButton + backButton);
            return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                + buttonBar;
        };
        _this.shareNodeToPerson = function () {
            var targetUser = _this.getInputVal("shareToUserName");
            if (!targetUser) {
                (new MessageDlg("Please enter a username")).open();
                return;
            }
            meta64.treeDirty = true;
            var thiz = _this;
            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": targetUser,
                "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
                "publicAppend": false
            }, thiz.reloadFromShareWithPerson, thiz);
        };
        _this.reloadFromShareWithPerson = function (res) {
            if (util.checkSuccess("Share Node with Person", res)) {
                (new SharingDlg()).open();
            }
        };
        return _this;
    }
    return ShareToPersonDlg;
}(DialogBase));
var SharingDlg = (function (_super) {
    __extends(SharingDlg, _super);
    function SharingDlg() {
        var _this = _super.call(this, "SharingDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Node Sharing");
            var shareWithPersonButton = _this.makeButton("Share with Person", "shareNodeToPersonPgButton", _this.shareNodeToPersonPg, _this);
            var makePublicButton = _this.makeButton("Share to Public", "shareNodeToPublicButton", _this.shareNodeToPublic, _this);
            var backButton = _this.makeCloseButton("Close", "closeSharingButton");
            var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
            var width = window.innerWidth * 0.6;
            var height = window.innerHeight * 0.4;
            var internalMainContent = "<div id='" + _this.id("shareNodeNameDisplay") + "'></div>" +
                "<div class='vertical-layout-row' style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
                + _this.id("sharingListFieldContainer") + "'></div>";
            return header + internalMainContent + buttonBar;
        };
        _this.init = function () {
            _this.reload();
        };
        _this.reload = function () {
            console.log("Loading node sharing info.");
            util.json("getNodePrivileges", {
                "nodeId": share.sharingNode.id,
                "includeAcl": true,
                "includeOwners": true
            }, _this.getNodePrivilegesResponse, _this);
        };
        _this.getNodePrivilegesResponse = function (res) {
            _this.populateSharingPg(res);
        };
        _this.populateSharingPg = function (res) {
            var html = "";
            var This = _this;
            $.each(res.aclEntries, function (index, aclEntry) {
                html += "<h4>User: " + aclEntry.principalName + "</h4>";
                html += render.tag("div", {
                    "class": "privilege-list"
                }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
            });
            var publicAppendAttrs = {
                "onClick": "meta64.getObjectByGuid(" + _this.guid + ").publicCommentingChanged();",
                "name": "allowPublicCommenting",
                "id": _this.id("allowPublicCommenting")
            };
            if (res.publicAppend) {
                publicAppendAttrs["checked"] = "checked";
            }
            html += render.tag("paper-checkbox", publicAppendAttrs, "", false);
            html += render.tag("label", {
                "for": _this.id("allowPublicCommenting")
            }, "Allow public commenting under this node.", true);
            util.setHtml(_this.id("sharingListFieldContainer"), html);
        };
        _this.publicCommentingChanged = function () {
            var thiz = _this;
            setTimeout(function () {
                var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));
                meta64.treeDirty = true;
                util.json("addPrivilege", {
                    "nodeId": share.sharingNode.id,
                    "privileges": null,
                    "principal": null,
                    "publicAppend": (polyElm.node.checked ? true : false)
                });
            }, 250);
        };
        _this.removePrivilege = function (principal, privilege) {
            meta64.treeDirty = true;
            util.json("removePrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": principal,
                "privilege": privilege
            }, _this.removePrivilegeResponse, _this);
        };
        _this.removePrivilegeResponse = function (res) {
            util.json("getNodePrivileges", {
                "nodeId": share.sharingNode.path,
                "includeAcl": true,
                "includeOwners": true
            }, _this.getNodePrivilegesResponse, _this);
        };
        _this.renderAclPrivileges = function (principal, aclEntry) {
            var ret = "";
            var thiz = _this;
            $.each(aclEntry.privileges, function (index, privilege) {
                var removeButton = thiz.makeButton("Remove", "removePrivButton", "meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
                    + "');");
                var row = render.makeHorizontalFieldSet(removeButton);
                row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";
                ret += render.tag("div", {
                    "class": "privilege-entry"
                }, row);
            });
            return ret;
        };
        _this.shareNodeToPersonPg = function () {
            (new ShareToPersonDlg()).open();
        };
        _this.shareNodeToPublic = function () {
            console.log("Sharing node to public.");
            meta64.treeDirty = true;
            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": "everyone",
                "privileges": ["read"],
                "publicAppend": false
            }, _this.reload, _this);
        };
        return _this;
    }
    return SharingDlg;
}(DialogBase));
var RenameNodeDlg = (function (_super) {
    __extends(RenameNodeDlg, _super);
    function RenameNodeDlg() {
        var _this = _super.call(this, "RenameNodeDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Rename Node");
            var curNodeNameDisplay = "<h3 id='" + _this.id("curNodeNameDisplay") + "'></h3>";
            var curNodePathDisplay = "<h4 class='path-display' id='" + _this.id("curNodePathDisplay") + "'></h4>";
            var formControls = _this.makeEditField("Enter new name for the node", "newNodeNameEditField");
            var renameNodeButton = _this.makeCloseButton("Rename", "renameNodeButton", _this.renameNode, _this);
            var backButton = _this.makeCloseButton("Close", "cancelRenameNodeButton");
            var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);
            return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
        };
        _this.renameNode = function () {
            var newName = _this.getInputVal("newNodeNameEditField");
            if (util.emptyString(newName)) {
                (new MessageDlg("Please enter a new node name.")).open();
                return;
            }
            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                (new MessageDlg("Select a node to rename.")).open();
                return;
            }
            var nodeBelow = edit.getNodeBelow(highlightNode);
            var renamingRootNode = (highlightNode.id === meta64.currentNodeId);
            var thiz = _this;
            util.json("renameNode", {
                "nodeId": highlightNode.id,
                "newName": newName
            }, function (res) {
                thiz.renameNodeResponse(res, renamingRootNode);
            });
        };
        _this.renameNodeResponse = function (res, renamingPageRoot) {
            if (util.checkSuccess("Rename node", res)) {
                if (renamingPageRoot) {
                    view.refreshTree(res.newId, true);
                }
                else {
                    view.refreshTree(null, false, res.newId);
                }
            }
        };
        _this.init = function () {
            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                return;
            }
            $("#" + _this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
            $("#" + _this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
        };
        return _this;
    }
    return RenameNodeDlg;
}(DialogBase));
var AudioPlayerDlg = (function (_super) {
    __extends(AudioPlayerDlg, _super);
    function AudioPlayerDlg(sourceUrl, nodeUid, startTimePending) {
        var _this = _super.call(this, "AudioPlayerDlg") || this;
        _this.sourceUrl = sourceUrl;
        _this.nodeUid = nodeUid;
        _this.startTimePending = startTimePending;
        _this.build = function () {
            var header = _this.makeHeader("Audio Player");
            var node = meta64.uidToNodeMap[_this.nodeUid];
            if (!node) {
                throw "unknown node uid: " + _this.nodeUid;
            }
            var rssTitle = props.getNodeProperty("meta64:rssItemTitle", node);
            var description = render.tag("p", {}, rssTitle.value);
            var playerAttribs = {
                "src": _this.sourceUrl,
                "id": _this.id("audioPlayer"),
                "style": "width: 100%; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
                "ontimeupdate": "podcast.onTimeUpdate('" + _this.nodeUid + "', this);",
                "oncanplay": "podcast.onCanPlay('" + _this.nodeUid + "', this);",
                "controls": "controls",
                "preload": "auto"
            };
            var player = render.tag("audio", playerAttribs);
            var skipBack30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.skip(-30, '" + _this.nodeUid + "', this);",
                "class": "standardButton"
            }, "< 30s");
            var skipForward30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.skip(30, '" + _this.nodeUid + "', this);",
                "class": "standardButton"
            }, "30s >");
            var skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);
            var speedNormalButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.speed(1.0);",
                "class": "standardButton"
            }, "Normal");
            var speed15Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.speed(1.5);",
                "class": "standardButton"
            }, "1.5X");
            var speed2xButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.speed(2);",
                "class": "standardButton"
            }, "2X");
            var speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);
            var pauseButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.pause();",
                "class": "standardButton"
            }, "Pause");
            var playButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "podcast.play();",
                "class": "playButton"
            }, "Play");
            var closeButton = _this.makeButton("Close", "closeAudioPlayerDlgButton", _this.closeBtn);
            var buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);
            return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
        };
        _this.closeEvent = function () {
            podcast.destroyPlayer(null);
        };
        _this.closeBtn = function () {
            podcast.destroyPlayer(_this);
        };
        _this.init = function () {
        };
        console.log("startTimePending in constructor: " + startTimePending);
        podcast.startTimePending = startTimePending;
        return _this;
    }
    AudioPlayerDlg.prototype.cancel = function () {
        _super.prototype.cancel.call(this);
        var player = $("#" + this.id("audioPlayer"));
        if (player && player.length > 0) {
            player[0].pause();
            player.remove();
        }
    };
    return AudioPlayerDlg;
}(DialogBase));
var CreateNodeDlg = (function (_super) {
    __extends(CreateNodeDlg, _super);
    function CreateNodeDlg() {
        var _this = _super.call(this, "CreateNodeDlg") || this;
        _this.build = function () {
            var header = _this.makeHeader("Create New Node");
            var createFirstChildButton = _this.makeCloseButton("First", "createFirstChildButton", _this.createFirstChild, _this, true, 1000);
            var createLastChildButton = _this.makeCloseButton("Last", "createLastChildButton", _this.createLastChild, _this);
            var createInlineButton = _this.makeCloseButton("Inline", "createInlineButton", _this.createInline, _this);
            var backButton = _this.makeCloseButton("Cancel", "cancelButton");
            var buttonBar = render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);
            var content = "";
            var typeIdx = 0;
            content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
            content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
            content += _this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);
            var listBox = render.tag("div", {
                "class": "listBox"
            }, content);
            var mainContent = listBox;
            var centeredHeader = render.tag("div", {
                "class": "centeredTitle"
            }, header);
            return centeredHeader + mainContent + buttonBar;
        };
        _this.createFirstChild = function () {
            if (!_this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, _this.lastSelTypeName, true);
        };
        _this.createLastChild = function () {
            if (!_this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, _this.lastSelTypeName, false);
        };
        _this.createInline = function () {
            if (!_this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.insertNode(null, _this.lastSelTypeName);
        };
        _this.onRowClick = function (payload) {
            var divId = _this.id("typeRow" + payload.typeIdx);
            _this.lastSelTypeName = payload.typeName;
            if (_this.lastSelDomId) {
                _this.el(_this.lastSelDomId).removeClass("selectedListItem");
            }
            _this.lastSelDomId = divId;
            _this.el(divId).addClass("selectedListItem");
        };
        _this.init = function () {
            var node = meta64.getHighlightedNode();
            if (node) {
                var canInsertInline = meta64.homeNodeId != node.id;
                if (canInsertInline) {
                    _this.el("createInlineButton").show();
                }
                else {
                    _this.el("createInlineButton").hide();
                }
            }
        };
        return _this;
    }
    CreateNodeDlg.prototype.makeListItem = function (val, typeName, typeIdx, initiallySelected) {
        var payload = {
            "typeName": typeName,
            "typeIdx": typeIdx
        };
        var divId = this.id("typeRow" + typeIdx);
        if (initiallySelected) {
            this.lastSelTypeName = typeName;
            this.lastSelDomId = divId;
        }
        return render.tag("div", {
            "class": "listItem" + (initiallySelected ? " selectedListItem" : ""),
            "id": divId,
            "onclick": meta64.encodeOnClick(this.onRowClick, this, payload)
        }, val);
    };
    return CreateNodeDlg;
}(DialogBase));
var SearchResultsPanel = (function () {
    function SearchResultsPanel() {
        this.domId = "searchResultsPanel";
        this.tabId = "searchTabName";
        this.visible = false;
        this.build = function () {
            var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
            var mainContent = "<div id='searchResultsView'></div>";
            return header + mainContent;
        };
        this.init = function () {
            $("#searchPageTitle").html(srch.searchPageTitle);
            srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
        };
    }
    return SearchResultsPanel;
}());
var TimelineResultsPanel = (function () {
    function TimelineResultsPanel() {
        this.domId = "timelineResultsPanel";
        this.tabId = "timelineTabName";
        this.visible = false;
        this.build = function () {
            var header = "<h2 id='timelinePageTitle' class='page-title'></h2>";
            var mainContent = "<div id='timelineView'></div>";
            return header + mainContent;
        };
        this.init = function () {
            $("#timelinePageTitle").html(srch.timelinePageTitle);
            srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
        };
    }
    return TimelineResultsPanel;
}());
meta64.initApp();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21lZ2EtbWV0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQWthQTtJQUFBO1FBRUksU0FBSSxHQUFXLFdBQVcsQ0FBQztRQUMzQixxQkFBZ0IsR0FBVyxZQUFZLEdBQUcsVUFBVSxDQUFDO1FBQ3JELHFCQUFnQixHQUFXLFlBQVksR0FBRyxVQUFVLENBQUM7UUFJckQsdUJBQWtCLEdBQVcsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUV6RCxzQkFBaUIsR0FBVyx1QkFBdUIsQ0FBQztRQUNwRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQywyQkFBc0IsR0FBWSxJQUFJLENBQUM7UUFNdkMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFHaEMsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBQ2xDLHNCQUFpQixHQUFZLElBQUksQ0FBQztRQUVsQyxnQ0FBMkIsR0FBWSxLQUFLLENBQUM7SUFDakQsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQUNELElBQUksSUFBSSxHQUFhLElBQUksU0FBUyxFQUFFLENBQUM7QUFLckM7SUFDSSxtQkFBbUIsU0FBaUIsRUFDekIsT0FBZTtRQURQLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDekIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUMxQixDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEO0lBQ0ksbUJBQW1CLEVBQVUsRUFDbEIsUUFBc0IsRUFDdEIsS0FBYyxFQUNkLFFBQWlCLEVBQ2pCLE1BQWUsRUFDZixRQUFtQjtRQUxYLE9BQUUsR0FBRixFQUFFLENBQVE7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQUN0QixVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUM5QixDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEO0lBQ0ksaUJBQW1CLEVBQVUsRUFDbEIsR0FBVztRQURILE9BQUUsR0FBRixFQUFFLENBQVE7UUFDbEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUN0QixDQUFDO0lBQ0wsY0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7SUFBQTtRQUVJLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsd0JBQW1CLEdBQVksS0FBSyxDQUFDO1FBQ3JDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsWUFBTyxHQUFRLElBQUksQ0FBQztRQUVwQixpQkFBWSxHQUFHLFVBQVMsQ0FBQztZQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUE7UUFFRCxvQkFBZSxHQUFHLFVBQVMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQTtRQUVELGlCQUFZLEdBQUcsVUFBUyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFYixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFekMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztZQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQTtRQUVELGFBQVEsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1lBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVELGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1lBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBUyxDQUFRO1lBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUVGLDJCQUFzQixHQUFHLFVBQVMsQ0FBUSxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ3pELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUM7UUFLRixrQkFBYSxHQUFHLFVBQVMsQ0FBUSxFQUFFLFNBQVMsRUFBRSxPQUFPO1lBQ2pELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQVlGLGtCQUFhLEdBQUcsVUFBUyxDQUFRLEVBQUUsR0FBRztZQUNsQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQU9ELGtCQUFhLEdBQUcsVUFBUyxPQUFPO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUM3RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTU8saUJBQVksR0FBVyxDQUFDLENBQUM7UUFFakMsd0JBQW1CLEdBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFFckUsV0FBTSxHQUFHLFVBQVMsR0FBRztZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQU1ELHVCQUFrQixHQUFHLFVBQVMsSUFBVSxFQUFFLEdBQVM7WUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFBO1FBT0QsWUFBTyxHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUs7WUFDNUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRUQsd0JBQW1CLEdBQUc7WUFDbEIsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFFRCxxQkFBZ0IsR0FBRztZQUNmLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3hCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsU0FBSSxHQUFHLFVBQXFDLFFBQWEsRUFBRSxRQUFxQixFQUM1RSxRQUF5RCxFQUFFLFlBQWtCLEVBQUUsZUFBcUI7WUFFcEcsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsUUFBUSxHQUFHLDZFQUE2RSxDQUFDLENBQUM7WUFDM0ksQ0FBQztZQUVELElBQUksUUFBUSxDQUFDO1lBQ2IsSUFBSSxXQUFXLENBQUM7WUFFaEIsSUFBSSxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEdBQUcsUUFBUSxDQUFDLENBQUM7b0JBQ3RELE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pGLENBQUM7Z0JBTUQsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRXhDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztnQkFDeEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUM7Z0JBSzFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQU0zQixRQUFRLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUdsQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3BCLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDN0MsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsR0FBRyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkUsQ0FBQztZQW1CRCxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FHdEI7Z0JBQ0ksSUFBSSxDQUFDO29CQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBRXhCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxHQUFHLDBCQUEwQjs4QkFDakUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQU1oQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dDQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUNyRixDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLFFBQVEsQ0FBZSxXQUFXLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUNsRSxDQUFDO3dCQUNMLENBQUM7d0JBS0QsSUFBSSxDQUFDLENBQUM7NEJBQ0YsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQ0FDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBZ0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUNwRSxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLFFBQVEsQ0FBZSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ2pELENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDVixJQUFJLENBQUMsYUFBYSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDckUsQ0FBQztZQUVMLENBQUMsRUFFRDtnQkFDSSxJQUFJLENBQUM7b0JBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUVsQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7d0JBRXBCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs0QkFDNUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQzs0QkFDaEMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3JFLENBQUM7d0JBRUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQzlDLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUVELElBQUksR0FBRyxHQUFXLDRCQUE0QixDQUFDO29CQUcvQyxJQUFJLENBQUM7d0JBQ0QsR0FBRyxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzt3QkFDbEQsR0FBRyxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDaEQsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNkLENBQUM7b0JBYUQsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNqQyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsR0FBRyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pGLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVQLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRyxVQUFTLE9BQWU7WUFDbEMsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLENBQUM7WUFDckMsSUFBSSxDQUFDO2dCQUNELEtBQUssR0FBUyxJQUFJLEtBQUssRUFBRyxDQUFDLEtBQUssQ0FBQztZQUNyQyxDQUFDO1lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxPQUFPLENBQUM7UUFDbEIsQ0FBQyxDQUFBO1FBRUQsa0JBQWEsR0FBRyxVQUFTLE9BQWUsRUFBRSxTQUFjO1lBQ3BELElBQUksS0FBSyxHQUFHLHdCQUF3QixDQUFDO1lBQ3JDLElBQUksQ0FBQztnQkFDRCxLQUFLLEdBQVMsSUFBSSxLQUFLLEVBQUcsQ0FBQyxLQUFLLENBQUM7WUFDckMsQ0FBQztZQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzNDLE1BQU0sU0FBUyxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVELGNBQVMsR0FBRyxVQUFTLFdBQVc7WUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLFdBQVcsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO2dCQUNuRixNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUc7WUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFBO1FBR0QsaUJBQVksR0FBRyxVQUFTLEVBQUU7WUFFdEIsVUFBVSxDQUFDO2dCQUNQLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFHUixVQUFVLENBQUM7Z0JBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQTtRQVNELGlCQUFZLEdBQUcsVUFBUyxjQUFjLEVBQUUsR0FBRztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLENBQUMsSUFBSSxVQUFVLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4RSxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBR0QsV0FBTSxHQUFHLFVBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRyxVQUFTLEdBQUc7WUFDdEIsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFNRCxnQkFBVyxHQUFHLFVBQVMsR0FBOEIsRUFBRSxFQUFFO1lBRXJELElBQUksR0FBRyxHQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUcxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDbEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQVMsRUFBRTtZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRUQsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNyQixDQUFDLENBQUE7UUFHRCx1QkFBa0IsR0FBRyxVQUFTLEVBQUU7WUFDNUIsSUFBSSxFQUFFLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFvQixFQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQUtELFdBQU0sR0FBRyxVQUFTLEVBQUU7WUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFRCxTQUFJLEdBQUcsVUFBUyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pDLENBQUMsQ0FBQTtRQUtELFlBQU8sR0FBRyxVQUFTLEVBQVU7WUFFekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUcsVUFBUyxFQUFVO1lBQzdCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQyxDQUFBO1FBS0QsdUJBQWtCLEdBQUcsVUFBUyxFQUFVO1lBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMscURBQXFELEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUUsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUcsVUFBUyxHQUFRO1lBQ3hCLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUc7WUFDaEIsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRyxVQUFTLEdBQVc7WUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUcsVUFBUyxFQUFVO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBR0QsZ0JBQVcsR0FBRyxVQUFTLEVBQVUsRUFBRSxHQUFXO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixDQUFDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUN6QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRyxVQUFTLEVBQVUsRUFBRSxJQUFTO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUE7UUFFRCxZQUFPLEdBQUcsVUFBUyxFQUFVLEVBQUUsSUFBUyxFQUFFLE9BQVk7WUFDbEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFTLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxFQUFFLENBQUM7b0JBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFPRCxxQkFBZ0IsR0FBRyxVQUFTLEdBQVcsRUFBRSxRQUFnQixFQUFFLFFBQWdCO1lBQ3ZFLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUE7UUFLRCxlQUFVLEdBQUcsVUFBUyxHQUFRLEVBQUUsSUFBUyxFQUFFLEdBQVc7WUFDbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVELFlBQU8sR0FBRyxVQUFTLEVBQVUsRUFBRSxPQUFlO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFLL0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBUyxHQUFXO1lBQ25DLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksSUFBSSxDQUFDO1lBRVQsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUssRUFBRSxDQUFDO2dCQUNaLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFLRCxnQkFBVyxHQUFHLFVBQVMsR0FBVztZQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFBO1lBQ3BCLElBQUksQ0FBQztnQkFDRCxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ3ZDLEtBQUssRUFBRSxDQUFDO29CQUNaLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDO29CQUNyQixHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFHRCxjQUFTLEdBQUcsVUFBUyxHQUFXO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFFbEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUNmLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixHQUFHLElBQUksR0FBRyxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQU9ELGtCQUFhLEdBQUcsVUFBUyxLQUFhLEVBQUUsTUFBZTtZQUVuRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFFVixHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRUosR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDekIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU9ELGtCQUFhLEdBQUcsVUFBUyxLQUFhLEVBQUUsR0FBWTtZQUVoRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBR04sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFHSixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELGdCQUFXLEdBQUcsVUFBYSxPQUFlLEVBQUUsSUFBWTtZQUFFLGNBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCw2QkFBYzs7WUFDcEUsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBSSxRQUFRLENBQUM7UUFDdkIsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELFdBQUM7QUFBRCxDQUFDLEFBN3JCRDtBQXVFVyxzQkFBaUIsR0FBRyxVQUFTLENBQU87SUFDdkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDdEUsQ0FBQyxDQUFBO0FBRU0sUUFBRyxHQUFHLFVBQVMsQ0FBTztJQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQTtBQSttQkwsSUFBSSxJQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUU1QjtJQUFBO1FBRUksZUFBVSxHQUFXLFdBQVcsQ0FBQztRQUNqQyxrQkFBYSxHQUFXLGNBQWMsQ0FBQztRQUN2QyxpQkFBWSxHQUFXLGlCQUFpQixDQUFDO1FBQ3pDLFdBQU0sR0FBVyxZQUFZLENBQUM7UUFFOUIsZ0JBQVcsR0FBVyxnQkFBZ0IsQ0FBQztRQUV2QyxrQkFBYSxHQUFXLGFBQWEsQ0FBQztRQUN0QyxnQkFBVyxHQUFXLE9BQU8sQ0FBQztRQUM5QixrQkFBYSxHQUFXLFNBQVMsQ0FBQztRQUVsQyxZQUFPLEdBQVcsYUFBYSxDQUFDO1FBQ2hDLGVBQVUsR0FBVyxlQUFlLENBQUM7UUFDckMsWUFBTyxHQUFXLGFBQWEsQ0FBQztRQUNoQyxTQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFNBQUksR0FBVyxVQUFVLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxrQkFBa0IsQ0FBQztRQUMzQyxxQkFBZ0IsR0FBVyxvQkFBb0IsQ0FBQztRQUNoRCw0QkFBdUIsR0FBVyxhQUFhLENBQUM7UUFFaEQsbUJBQWMsR0FBVyxlQUFlLENBQUM7UUFFekMsU0FBSSxHQUFXLE1BQU0sQ0FBQztRQUN0QixRQUFHLEdBQVcsS0FBSyxDQUFDO1FBQ3BCLFVBQUssR0FBVyxPQUFPLENBQUM7UUFDeEIsU0FBSSxHQUFXLE1BQU0sQ0FBQztRQUV0QixZQUFPLEdBQVcsUUFBUSxDQUFDO1FBQzNCLGFBQVEsR0FBVyxTQUFTLENBQUM7UUFDN0IsYUFBUSxHQUFXLGNBQWMsQ0FBQztRQUVsQyxjQUFTLEdBQVcsVUFBVSxDQUFDO1FBQy9CLGVBQVUsR0FBVyxXQUFXLENBQUM7SUFDckMsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQUNELElBQUksT0FBTyxHQUFnQixJQUFJLFlBQVksRUFBRSxDQUFDO0FBRTlDO0lBQUE7UUFFSSxlQUFVLEdBQVEsSUFBSSxDQUFDO1FBRXZCLDBCQUFxQixHQUFHO1lBQ3BCLElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDN0IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUM3QixDQUFDLElBQUkseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBTzdDLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHO1lBQ25CLElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDN0IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUM3QixDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHO1lBQ2YsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFakQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLElBQUksVUFBVSxDQUFDLDJCQUEyQixFQUFFLG9DQUFvQyxFQUFFLGNBQWMsRUFDN0Y7b0JBQ0ksSUFBSSxDQUFDLElBQUksQ0FBb0Qsa0JBQWtCLEVBQUU7d0JBQzdFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtxQkFDcEIsRUFBRSxVQUFVLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsNkJBQXdCLEdBQUcsVUFBUyxHQUE2QixFQUFFLEdBQVE7WUFDdkUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFOUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQXZERCxJQXVEQztBQUNELElBQUksVUFBVSxHQUFlLElBQUksVUFBVSxFQUFFLENBQUM7QUFFOUM7SUFBQTtRQUVJLGVBQVUsR0FBRztZQUNULENBQUMsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pDLENBQUMsQ0FBQTtRQUVPLHVCQUFrQixHQUFHLFVBQVMsR0FBdUI7WUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRU8sd0JBQW1CLEdBQUcsVUFBUyxHQUF3QixFQUFFLE9BQWU7WUFDNUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUM3QixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFTyx5QkFBb0IsR0FBRyxVQUFTLEdBQXlCO1lBQzdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxJQUFJLEdBQWEsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDbEMsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztvQkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUd0QyxJQUFJLGNBQWMsR0FBWSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsY0FBYyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQzsyQkFDOUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBS2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO29CQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLENBQUMsSUFBSSxVQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6RSxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVPLHNCQUFpQixHQUFHLFVBQVMsR0FBc0I7WUFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFTyw0QkFBdUIsR0FBRyxVQUFTLEdBQTRCO1lBQ25FLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELDJCQUFzQixHQUFZLElBQUksQ0FBQztRQUl2QyxnQkFBVyxHQUFRLElBQUksQ0FBQztRQUt4QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUU1QixvQkFBZSxHQUFhLElBQUksQ0FBQztRQUtqQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFLcEMsZ0NBQTJCLEdBQVksS0FBSyxDQUFDO1FBUTdDLGFBQVEsR0FBYSxJQUFJLENBQUM7UUFHMUIsb0JBQWUsR0FBZ0IsSUFBSSxDQUFDO1FBVXBDLHFCQUFnQixHQUFRLElBQUksQ0FBQztRQUc3QixrQkFBYSxHQUFHLFVBQVMsSUFBUztZQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHO2dCQUl0RCxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzttQkFDbkUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQTtRQUdELG9CQUFlLEdBQUcsVUFBUyxJQUFTO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDMUUsQ0FBQyxDQUFBO1FBRUQsd0JBQW1CLEdBQUcsVUFBUyxRQUFpQixFQUFFLFdBQXFCO1lBQ25FLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO1FBY0QsZ0NBQTJCLEdBQUc7WUFDMUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFFRCx1QkFBa0IsR0FBRyxVQUFTLEdBQXVCO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsMEJBQXFCLEdBQUcsVUFBUyxHQUEwQjtZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHLFVBQVMsR0FBcUIsRUFBRSxPQUFZO1lBQzNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFNdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsYUFBUSxHQUFHLFVBQVMsT0FBaUI7WUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQzlDLENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3JGLENBQUM7WUFHRCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQU01QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUU1QixNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBUyxHQUFZO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBYSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDcEQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsSUFBSSxDQUFrRCxpQkFBaUIsRUFBRTtvQkFDMUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxhQUFhO29CQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLFdBQVcsRUFBRSxhQUFhO2lCQUM3QixFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHLFVBQVMsR0FBWTtZQUVoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxPQUFPLEdBQWEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3BELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLElBQUksQ0FBa0QsaUJBQWlCLEVBQUU7b0JBQzFFLGNBQWMsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM5QyxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUN6QixFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQVMsR0FBWTtZQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxPQUFPLEdBQWEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3BELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLElBQUksQ0FBa0QsaUJBQWlCLEVBQUU7b0JBQzFFLGNBQWMsRUFBRSxNQUFNLENBQUMsYUFBYTtvQkFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixXQUFXLEVBQUUsV0FBVztpQkFDM0IsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBUyxHQUFZO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBYSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDcEQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsSUFBSSxDQUFrRCxpQkFBaUIsRUFBRTtvQkFDMUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsV0FBVyxFQUFFLElBQUk7aUJBQ3BCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUtELGlCQUFZLEdBQUcsVUFBUyxJQUFJO1lBQ3hCLElBQUksT0FBTyxHQUFXLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUE7UUFLRCxpQkFBWSxHQUFHLFVBQVMsSUFBUztZQUM3QixJQUFJLE9BQU8sR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRWhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUc7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM3RSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRyxVQUFTLEdBQVE7WUFDM0IsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUMsSUFBSSxVQUFVLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBNEMsY0FBYyxFQUFFO2dCQUNqRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7YUFDcEIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBUyxHQUFTLEVBQUUsUUFBaUI7WUFFOUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQU1ELElBQUksSUFBSSxHQUFhLElBQUksQ0FBQztZQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dCQUM3QixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUcsVUFBUyxHQUFTLEVBQUUsUUFBaUIsRUFBRSxXQUFxQjtZQU14RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxhQUFhLEdBQWEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO2dCQUN6QyxDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDOUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELE1BQU0sQ0FBQztnQkFDWCxDQUFDO1lBQ0wsQ0FBQztZQUtELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsR0FBUTtZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUc7WUFDZCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQU81QixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQU1ELG1CQUFjLEdBQUc7WUFDYixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsSUFBSSxVQUFVLENBQUMsZ0VBQWdFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMxRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxZQUFZLEVBQUUsY0FBYyxFQUM3RjtnQkFDSSxJQUFJLGlCQUFpQixHQUFhLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO2dCQUVsRSxJQUFJLENBQUMsSUFBSSxDQUEwQyxhQUFhLEVBQUU7b0JBQzlELFNBQVMsRUFBRSxhQUFhO2lCQUMzQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFHRCw2QkFBd0IsR0FBRztZQUV2QixJQUFJLFFBQVEsR0FBVyxNQUFNLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUMxRCxJQUFJLFFBQVEsR0FBYSxJQUFJLENBQUM7WUFDOUIsSUFBSSxZQUFZLEdBQVksS0FBSyxDQUFDO1lBSWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlELElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV4RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBR0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUc7WUFFVixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsSUFBSSxVQUFVLENBQUMsc0RBQXNELENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsQ0FBQyxJQUFJLFVBQVUsQ0FDWCxhQUFhLEVBQ2IsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsMkNBQTJDLEVBQzNFLEtBQUssRUFDTDtnQkFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQztnQkFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUV2QyxNQUFNLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFHMUIsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRU8sdUJBQWtCLEdBQUcsVUFBUyxPQUFpQjtZQUNuRCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUN6QixHQUFHLENBQUMsQ0FBVyxVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87Z0JBQWpCLElBQUksRUFBRSxnQkFBQTtnQkFDUCxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNsQztRQUNMLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUc7WUFDWixDQUFDLElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsdUNBQXVDLEVBQ3pHLGFBQWEsRUFBRTtnQkFFWCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFPaEQsSUFBSSxDQUFDLElBQUksQ0FBc0MsV0FBVyxFQUFFO29CQUN4RCxjQUFjLEVBQUUsYUFBYSxDQUFDLEVBQUU7b0JBQ2hDLGVBQWUsRUFBRSxhQUFhLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxFQUFFLEdBQUcsSUFBSTtvQkFDaEUsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXO2lCQUM5QixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsMEJBQXFCLEdBQUc7WUFDcEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsMkhBQTJILEVBQUUsbUJBQW1CLEVBQUU7Z0JBR3pLLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBd0MsWUFBWSxFQUFFO3dCQUMzRCxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQ2pCLFVBQVUsRUFBRSxlQUFlO3dCQUMzQixXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFO3FCQUN4QyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCxXQUFDO0FBQUQsQ0FBQyxBQTFmRCxJQTBmQztBQUNELElBQUksSUFBSSxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7QUFFNUI7SUFBQTtRQUVJLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBRWhDLGVBQVUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUl2RSxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUdqQyxhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBR3JCLGFBQVEsR0FBVyxXQUFXLENBQUM7UUFHL0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFLekIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUsxQixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUc3QixlQUFVLEdBQVksSUFBSSxDQUFDO1FBQzNCLDRCQUF1QixHQUFRLElBQUksQ0FBQztRQUNwQywwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFNdkMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQVMzQixpQkFBWSxHQUFnQyxFQUFFLENBQUM7UUFLL0MsZ0JBQVcsR0FBZ0MsRUFBRSxDQUFDO1FBRzlDLG1CQUFjLEdBQVEsRUFBRSxDQUFDO1FBR3pCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFNcEIsa0JBQWEsR0FBOEIsRUFBRSxDQUFDO1FBUzlDLDRCQUF1QixHQUFnQyxFQUFFLENBQUM7UUFHMUQsa0JBQWEsR0FBVyxVQUFVLENBQUM7UUFDbkMsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFHL0IsbUJBQWMsR0FBVyxRQUFRLENBQUM7UUFLbEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFHaEMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFLOUIsa0NBQTZCLEdBQVE7WUFDakMsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDO1FBRUYsZ0NBQTJCLEdBQVEsRUFBRSxDQUFDO1FBRXRDLHlCQUFvQixHQUFRLEVBQUUsQ0FBQztRQUUvQix1QkFBa0IsR0FBUSxFQUFFLENBQUM7UUFLN0Isa0JBQWEsR0FBUSxFQUFFLENBQUM7UUFHeEIsMEJBQXFCLEdBQVEsRUFBRSxDQUFDO1FBR2hDLG9CQUFlLEdBQVEsSUFBSSxDQUFDO1FBSzVCLGdCQUFXLEdBQWEsSUFBSSxDQUFDO1FBQzdCLG1CQUFjLEdBQVEsSUFBSSxDQUFDO1FBQzNCLGtCQUFhLEdBQVEsSUFBSSxDQUFDO1FBQzFCLG9CQUFlLEdBQVEsSUFBSSxDQUFDO1FBRzVCLGVBQVUsR0FBUSxFQUFFLENBQUM7UUFFckIsNkJBQXdCLEdBQWdDLEVBQUUsQ0FBQztRQUMzRCxtQ0FBOEIsR0FBZ0MsRUFBRSxDQUFDO1FBRWpFLG9CQUFlLEdBQW9CO1lBQy9CLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsZUFBZSxFQUFFLEtBQUs7WUFDdEIsZUFBZSxFQUFFLEtBQUs7WUFDdEIsY0FBYyxFQUFFLEtBQUs7U0FDeEIsQ0FBQztRQUVGLHdCQUFtQixHQUFHO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN4QyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEIsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQU1ELHVCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUM5QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUcsVUFBUyxJQUFJO1lBQzNCLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFrQkQsa0JBQWEsR0FBRyxVQUFTLFFBQWEsRUFBRSxHQUFTLEVBQUUsT0FBYSxFQUFFLGFBQXNCO1lBQ3BGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXBDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUUvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdkMsQ0FBQztvQkFDRCxJQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7b0JBR2pELE1BQU0sQ0FBQyx3QkFBc0IsUUFBUSxDQUFDLElBQUksU0FBSSxHQUFHLENBQUMsSUFBSSxTQUFJLFVBQVUsU0FBSSxhQUFhLE9BQUksQ0FBQztnQkFDOUYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsd0JBQXNCLFFBQVEsQ0FBQyxJQUFJLG1CQUFjLGFBQWEsT0FBSSxDQUFDO2dCQUM5RSxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sMkNBQTJDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxhQUFzQjtZQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixVQUFVLENBQUM7b0JBQ1AsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCx5QkFBb0IsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTztZQUM5QyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBSTNDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUdELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbEUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLDhDQUE4QyxHQUFHLElBQUksQ0FBQztZQUNoRSxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRztZQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDeEQsQ0FBQyxDQUFBO1FBRUQsWUFBTyxHQUFHO1lBQ04sTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRyxVQUFTLFFBQWtCLEVBQUUsa0JBQTRCO1lBRXBFLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDNUIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUM1QixNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDckMsQ0FBQztZQUNMLENBQUM7WUFLRCxJQUFJLENBQUMsQ0FBQztnQkFDRixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsY0FBUyxHQUFHLFVBQVMsUUFBUTtZQUN6QixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDNUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQWdCN0MsQ0FBQyxDQUFBO1FBVUQsZUFBVSxHQUFHLFVBQVMsRUFBUSxFQUFFLElBQVU7WUFDdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztnQkFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBR0QsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLFNBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELHNCQUFpQixHQUFHLFVBQVMsSUFBSTtZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUVqQixJQUFJLElBQUksQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFFRCw2QkFBd0IsR0FBRztZQUN2QixJQUFJLFFBQVEsR0FBYSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBRWpDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBS0QsNEJBQXVCLEdBQUc7WUFDdEIsSUFBSSxRQUFRLEdBQWEsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLENBQUM7WUFFRCxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUdELDhCQUF5QixHQUFHO1lBQ3hCLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBZSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFHRCwwQkFBcUIsR0FBRztZQUNwQixJQUFJLFFBQVEsR0FBZSxFQUFFLENBQUM7WUFDOUIsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVELHVCQUFrQixHQUFHO1lBQ2pCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUVELDJCQUFzQixHQUFHLFVBQVMsR0FBRyxFQUFFLElBQUk7WUFDdkMsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO1lBQzFCLElBQUksSUFBSSxHQUFZLEtBQUssQ0FBQztZQUUxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBUyxLQUFLLEVBQUUsS0FBSztvQkFDcEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixRQUFRLElBQUksR0FBRyxDQUFDO29CQUNwQixDQUFDO29CQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDaEIsQ0FBQztvQkFFRCxRQUFRLElBQUksS0FBSyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUN0QixJQUFJLEtBQUssR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDdkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELG1CQUFjLEdBQUcsVUFBUyxJQUFjO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQXNELG1CQUFtQixFQUFFO2dCQUNoRixRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pCLFlBQVksRUFBRSxLQUFLO2dCQUNuQixlQUFlLEVBQUUsSUFBSTthQUN4QixFQUFFLFVBQVMsR0FBOEI7Z0JBQ3RDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFHRCxrQkFBYSxHQUFHLFVBQVMsRUFBVTtZQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHLFVBQVMsR0FBVztZQUMvQixJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNwRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHVCQUFrQixHQUFHO1lBQ2pCLElBQUksR0FBRyxHQUFhLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHLFVBQVMsRUFBRSxFQUFFLE1BQU07WUFDbEMsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUM7UUFDTCxDQUFDLENBQUE7UUFNRCxrQkFBYSxHQUFHLFVBQVMsSUFBYyxFQUFFLE1BQWU7WUFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ04sTUFBTSxDQUFDO1lBRVgsSUFBSSxnQkFBZ0IsR0FBWSxLQUFLLENBQUM7WUFHdEMsSUFBSSxrQkFBa0IsR0FBYSxNQUFNLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV0QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztvQkFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxRQUFRLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFFN0QsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7Z0JBQ3pDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDdkUsQ0FBQztnQkFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELDRCQUF1QixHQUFHO1lBRXRCLElBQUksY0FBYyxHQUFZLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2pELElBQUksY0FBYyxHQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksYUFBYSxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFELElBQUksYUFBYSxHQUFZLGFBQWEsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxRQUFRLElBQUksT0FBTyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVuSSxJQUFJLGdCQUFnQixHQUFZLGFBQWEsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDO1lBQy9GLElBQUksb0JBQW9CLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztZQUN0RixJQUFJLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUM7WUFDdEYsSUFBSSxnQkFBZ0IsR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEUsSUFBSSxhQUFhLEdBQVcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDdEQsSUFBSSxTQUFTLEdBQVksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztZQUN2RixJQUFJLFdBQVcsR0FBWSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztZQUd6RyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQXdCLENBQUMsQ0FBQztZQUUzSCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLEdBQUcsWUFBWSxHQUFHLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBRWpJLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFNUQsSUFBSSxXQUFXLEdBQVksTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVyRCxJQUFJLGFBQWEsR0FBWSxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUV0RSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztZQUNyRixJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ2pHLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUM7WUFDcEcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUVqSSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRTFELElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztZQUN6RyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ3hHLElBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJO21CQUNsRixhQUFhLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLENBQUM7WUFDMUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztZQUN2RyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzlGLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsYUFBYSxDQUFDLDhCQUE4QixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pKLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUlwRCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNySCxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ3ZGLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsYUFBYSxDQUFDLDhCQUE4QixFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRzlGLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVwRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUE7UUFFRCwwQkFBcUIsR0FBRztZQUNwQixJQUFJLEdBQVcsQ0FBQztZQUNoQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxxQkFBZ0IsR0FBRyxVQUFTLElBQWM7WUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3JFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHO1lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFYixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQUVELHVCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUM5QixNQUFNLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM5QixNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDL0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUN0QyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDNUMsQ0FBQyxDQUFBO1FBRUQseUJBQW9CLEdBQUcsVUFBUyxHQUF5QjtZQUVyRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUV6QixJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU1QyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBRWxELE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxVQUFTLEdBQUc7WUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUQsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3ZCLEtBQUssQ0FBQztnQkFDVixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELGFBQVEsR0FBRyxVQUFTLElBQWMsRUFBRSxVQUFvQjtZQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBS0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBTzNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXBGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDdkMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUc7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRTtnQkFDNUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25CLE9BQU8sQ0FBQyxZQUFZO2dCQUNwQixPQUFPLENBQUMsTUFBTTtnQkFDZCxPQUFPLENBQUMsU0FBUztnQkFDakIsT0FBTyxDQUFDLFVBQVU7Z0JBQ2xCLE9BQU8sQ0FBQyxPQUFPO2dCQUNmLE9BQU8sQ0FBQyxRQUFRO2dCQUNoQixPQUFPLENBQUMsUUFBUTtnQkFDaEIsT0FBTyxDQUFDLFVBQVU7Z0JBQ2xCLE9BQU8sQ0FBQyxhQUFhO2FBQUMsQ0FBQyxDQUFDO1lBRTVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFO2dCQUNyQyxPQUFPLENBQUMsWUFBWTtnQkFDcEIsT0FBTyxDQUFDLElBQUk7Z0JBQ1osT0FBTyxDQUFDLFdBQVc7Z0JBQ25CLE9BQU8sQ0FBQyxPQUFPO2dCQUNmLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQixPQUFPLENBQUMsYUFBYTtnQkFDckIsT0FBTyxDQUFDLGdCQUFnQjtnQkFDeEIsT0FBTyxDQUFDLFNBQVM7Z0JBQ2pCLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQixPQUFPLENBQUMsT0FBTztnQkFDZixPQUFPLENBQUMsUUFBUTtnQkFDaEIsT0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQixPQUFPLENBQUMsYUFBYTthQUFDLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQTtRQUdELFlBQU8sR0FBRztZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVoQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDM0UsTUFBTSxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQ3ZGLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztZQUV2RixNQUFNLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQ2pGLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7WUFFekYsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixDQUFDLEdBQUcsWUFBWSxDQUFDLGtCQUFrQixDQUFDO1lBQ3JGLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQztZQU92RixNQUFPLENBQUMsUUFBUSxHQUFHLFVBQVMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRO2dCQUNwRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7b0JBQ2pELE1BQU0sQ0FBQztnQkFDWCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDbkMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQXNCSSxNQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFVBQVMsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBT3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQztZQUVYLE1BQU0sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRTdCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRTtnQkFDakMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFPOUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzNCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztZQVVILE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBTXpDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQXFCcEIsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDN0IsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFFakMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFM0IsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUc7WUFDZixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxVQUFVLENBQUM7b0JBQ1AsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsT0FBTztZQUM3QixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHO1lBQ25CLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixDQUFDLElBQUksVUFBVSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuRSxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUc7WUFDZixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFFekIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMzQixNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFFLElBQUk7b0JBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNiLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBR0QsdUJBQWtCLEdBQUcsVUFBUyxLQUFLO1FBTW5DLENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHLFVBQVMsU0FBUztZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUE0QyxjQUFjLEVBQUU7Z0JBQ2pFLFdBQVcsRUFBRSxTQUFTO2FBQ3pCLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsd0JBQW1CLEdBQUc7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBMEQscUJBQXFCLEVBQUU7Z0JBRXRGLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxlQUFlO2FBQzVDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUVELG1CQUFjLEdBQUcsVUFBUyxRQUFnQjtZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFnRCxnQkFBZ0IsRUFBRTtnQkFDdkUsVUFBVSxFQUFFLFFBQVE7YUFDdkIsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsbUJBQWMsR0FBRyxVQUFTLFFBQWdCO1lBQ3RDLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBdjVCRCxJQXU1QkM7QUFDRCxJQUFJLE1BQU0sR0FBVyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBRWxDO0lBQUE7UUFDSSxzQkFBaUIsR0FBVyxNQUFNLENBQUM7UUFHbkMsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRzNCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBRTNCLHFCQUFnQixHQUFHO1lBQ2YsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBd0MsWUFBWSxFQUFFO2dCQUMzRCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixTQUFTLEVBQUUsSUFBSTtnQkFDZixvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVU7Z0JBQ3hCLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUc7WUFDZixHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsSUFBSSxDQUF3QyxZQUFZLEVBQUU7Z0JBQzNELFFBQVEsRUFBRSxZQUFZO2dCQUN0QixTQUFTLEVBQUUsSUFBSTtnQkFDZixvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVU7Z0JBQ3hCLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQsZUFBVSxHQUFHLFVBQVMsTUFBYztZQUloQyxNQUFNLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRTVDLElBQUksQ0FBQyxJQUFJLENBQThELHVCQUF1QixFQUFFO2dCQUM1RixRQUFRLEVBQUUsTUFBTTthQUNuQixFQUFFLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUVPLGtDQUE2QixHQUFHLFVBQVMsR0FBa0M7WUFDL0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELG1CQUFjLEdBQUc7WUFDYixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssTUFBTSxDQUFDLHVCQUF1QixDQUFDO1lBQ25FLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3RELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRztZQUNsQixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFBO1FBRUQsb0JBQWUsR0FBRyxVQUFTLEdBQXVCLEVBQUUsRUFBRTtZQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixDQUFDLElBQUksVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsZUFBVSxHQUFHO1lBRVQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFLRCxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNuQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUF3QyxZQUFZLEVBQUU7Z0JBQ3pFLFFBQVEsRUFBRSxNQUFNLENBQUMsYUFBYTtnQkFDOUIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osb0JBQW9CLEVBQUUsS0FBSztnQkFDM0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVO2dCQUN4QixjQUFjLEVBQUUsS0FBSzthQUN4QixFQUFFLFVBQVMsR0FBdUI7Z0JBQy9CLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFLRCwwQkFBcUIsR0FBRztZQUVwQixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUdqQixJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFN0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFHcEQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7b0JBR3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBS0QsMkJBQXNCLEdBQUc7WUFDckIsSUFBSSxDQUFDO2dCQUNELElBQUksY0FBYyxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMzRCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUdqQixJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFN0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFHcEQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7d0JBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsTUFBTSxDQUFDLENBQUM7d0JBRXRELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNoQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO1lBQ0wsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVELG1CQUFjLEdBQUcsVUFBUyxNQUFNLEVBQUUsR0FBRztZQUVqQyxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGdFQUFnRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBS0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUtsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUcsVUFBUyxHQUFHO1lBRW5CLElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxVQUFVLENBQUMsOEJBQThCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFPRCxrQkFBYSxHQUFHLFVBQVMsR0FBRztZQUN4QixJQUFJLFlBQVksR0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUNuRCxVQUFVLENBQUM7Z0JBQ1AsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1QixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRyxVQUFTLEdBQXVCO1lBQ2xELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFBO1FBRUQsWUFBTyxHQUFHO1lBQ04sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtvQkFDM0QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO29CQUMzQixTQUFTLEVBQUUsSUFBSTtvQkFDZixvQkFBb0IsRUFBRSxJQUFJO29CQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVU7b0JBQ3hCLGNBQWMsRUFBRSxLQUFLO2lCQUN4QixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHO1lBQ1osTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCxVQUFDO0FBQUQsQ0FBQyxBQXZPRCxJQXVPQztBQUNELElBQUksR0FBRyxHQUFRLElBQUksR0FBRyxFQUFFLENBQUM7QUFFekI7SUFBQTtRQUVJLHlCQUFvQixHQUFHLFVBQVMsR0FBeUI7WUFFckQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUc5QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHO1lBQ1gsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsc0NBQXNDLEVBQUUscUJBQXFCLEVBQUU7Z0JBQ3JGLENBQUMsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsd0VBQXdFLEVBQUUscUJBQXFCLEVBQUU7b0JBQy9ILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QixJQUFJLENBQUMsSUFBSSxDQUE0QyxjQUFjLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUN6RyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCxZQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQUNELElBQUksS0FBSyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7QUFFL0I7SUFBQTtRQUVJLGVBQVUsR0FBRyxVQUFTLFNBQW1CLEVBQUUsTUFBc0I7WUFDN0QsSUFBSSxRQUFRLEdBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1lBRTFCLEdBQUcsQ0FBQyxDQUFhLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztnQkFBckIsSUFBSSxJQUFJLGtCQUFBO2dCQUNULFNBQVMsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNqRTtZQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBUyxLQUFxQixFQUFFLEdBQVcsRUFBRSxRQUFnQjtZQUM1RSxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBS0QsZ0JBQVcsR0FBRztZQUNWLE1BQU0sQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBUzdELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsZ0NBQTJCLEdBQUcsVUFBUyxZQUFZO1lBQy9DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUVwRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxLQUFLLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNRCxnQ0FBMkIsR0FBRyxVQUFTLElBQWMsRUFBRSxNQUFzQjtZQUN6RSxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUVELElBQUksUUFBUSxHQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdkgsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFHTyxtQkFBYyxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUFxQjtZQUN4RSxHQUFHLENBQUMsQ0FBYSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7Z0JBQXJCLElBQUksSUFBSSxrQkFBQTtnQkFDVCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7YUFDSjtRQUNMLENBQUMsQ0FBQTtRQUdPLG1CQUFjLEdBQUcsVUFBUyxTQUFtQixFQUFFLEtBQXFCO1lBQ3hFLEdBQUcsQ0FBQyxDQUFhLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztnQkFBckIsSUFBSSxJQUFJLGtCQUFBO2dCQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELENBQUM7YUFDSjtRQUNMLENBQUMsQ0FBQTtRQUtELHFCQUFnQixHQUFHLFVBQVMsVUFBVTtZQUNsQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksT0FBSyxHQUFXLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxXQUFTLEdBQVcsQ0FBQyxDQUFDO2dCQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBRSxRQUFRO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFFMUQsV0FBUyxFQUFFLENBQUM7d0JBQ1osSUFBSSxFQUFFLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQzlCLE9BQU8sRUFBRSxxQkFBcUI7eUJBQ2pDLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUUvQyxJQUFJLEdBQUcsU0FBUSxDQUFDO3dCQUNoQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNmLEdBQUcsR0FBRyxVQUFVLENBQUM7d0JBQ3JCLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQzFCLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDMUMsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEQsQ0FBQzt3QkFFRCxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQ25CLE9BQU8sRUFBRSxvQkFBb0I7eUJBQ2hDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRVIsT0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFOzRCQUN0QixPQUFPLEVBQUUsZ0JBQWdCO3lCQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUVYLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JELENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsV0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQ3ZCLFFBQVEsRUFBRSxHQUFHO29CQUNiLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQUUsT0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTUQsb0JBQWUsR0FBRyxVQUFTLFlBQVksRUFBRSxJQUFJO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUVoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksSUFBSSxHQUFpQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCx1QkFBa0IsR0FBRyxVQUFTLFlBQVksRUFBRSxJQUFJO1lBQzVDLElBQUksSUFBSSxHQUFpQixLQUFLLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQU1ELG1CQUFjLEdBQUcsVUFBUyxJQUFJO1lBQzFCLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRzNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDYixTQUFTLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLENBQUM7WUFHRCxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBTUQsMEJBQXFCLEdBQUcsVUFBUyxJQUFJO1lBQ2pDLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdELENBQUMsQ0FBQTtRQUVELHVCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUM5QixJQUFJLFNBQVMsR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM3RCxDQUFDLENBQUE7UUFLRCxtQkFBYyxHQUFHLFVBQVMsUUFBUTtZQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUduQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzFCLENBQUM7WUFFRCxJQUFJLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQseUJBQW9CLEdBQUcsVUFBUyxNQUFNO1lBQ2xDLElBQUksR0FBRyxHQUFXLE9BQU8sQ0FBQztZQUMxQixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBUyxDQUFDLEVBQUUsS0FBSztnQkFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0QsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlCLEtBQUssRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLElBQUksUUFBUSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7SUFDTCxDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUEvTkQsSUErTkM7QUFDRCxJQUFJLEtBQUssR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO0FBRS9CO0lBQUE7UUFDWSxVQUFLLEdBQVksS0FBSyxDQUFDO1FBTXZCLHVCQUFrQixHQUFHO1lBQ3pCLE1BQU0sQ0FBQywwSEFBMEgsQ0FBQztRQUN0SSxDQUFDLENBQUE7UUFFTyxpQkFBWSxHQUFHLFVBQVMsSUFBYztZQUkxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQztZQUlELElBQUksQ0FBQyxDQUFDO2dCQUNGLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNqQyxNQUFNLEVBQUUsTUFBTSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQztpQkFDL0MsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUU1QixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2lCQUN6QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2YsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQVNELGFBQVEsR0FBRyxVQUFTLEVBQUUsRUFBRSxJQUFJO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsSUFBYyxFQUFFLFFBQWlCLEVBQUUsUUFBaUI7WUFDMUUsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0UsSUFBSSxVQUFVLEdBQVcsRUFBRSxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFVBQVUsSUFBSSxrQ0FBa0MsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUMxRixDQUFDO1lBRUQsVUFBVSxJQUFJLE9BQU8sQ0FBQztZQUV0QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksS0FBSyxHQUFXLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7Z0JBQzNGLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDckYsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLEdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7Z0JBQ2hHLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzFGLENBQUM7WUFFRCxVQUFVLElBQUksMkJBQXlCLElBQUksQ0FBQyxHQUFHLGNBQVcsQ0FBQztZQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsVUFBVSxJQUFJLFlBQVUsSUFBSSxDQUFDLFlBQWMsQ0FBQztZQUNoRCxDQUFDO1lBQ0QsVUFBVSxJQUFJLFFBQVEsQ0FBQztZQVl2QixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLFVBQVUsSUFBSSxXQUFTLElBQUksQ0FBQyxJQUFJLGNBQVMsSUFBSSxDQUFDLEdBQUcsTUFBRyxDQUFDO1lBQ3pELENBQUM7WUFFRCxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLE9BQU8sRUFBRSxhQUFhO2FBQ3pCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFZixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUMsQ0FBQTtRQU9ELHlCQUFvQixHQUFHLFVBQVMsT0FBZTtZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBTzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLE9BQU8sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELHdCQUFtQixHQUFHLFVBQVMsT0FBZTtZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUE7UUFFRCxvQkFBZSxHQUFHLFVBQVMsT0FBZTtZQUt0QyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFDbEUsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLDZCQUE2QixDQUFDLENBQUM7WUFDdkUsQ0FBQztZQUNELE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUlELHNCQUFpQixHQUFHLFVBQVMsSUFBYztZQUl2QyxJQUFJLEdBQUcsR0FBVyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLDJCQUF5QixJQUFJLENBQUMsRUFBRSxnQkFBYSxDQUFDO1lBQzlELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sdUNBQXVDLENBQUM7WUFDbkUsSUFBSSxVQUFVLEdBQVcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQTtRQVVELHNCQUFpQixHQUFHLFVBQVMsSUFBYyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVO1lBQzlGLElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUduRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsR0FBRyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzdFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDYixHQUFHLElBQWtCLFVBQVUsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLGNBQWMsR0FBWSxLQUFLLENBQUM7Z0JBS3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDM0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxjQUFjLEdBQUcsSUFBSSxDQUFDO3dCQUN0QixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtvQkFDakMsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxXQUFXLEdBQWlCLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFHN0UsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxjQUFjLEdBQUcsSUFBSSxDQUFDO3dCQUV0QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUduRCxJQUFJLGFBQWEsR0FBRyxrQ0FBa0M7NEJBQ2xELG1DQUFtQzs0QkFDbkMsaUNBQWlDOzRCQUNqQyxVQUFVOzRCQUNWLFdBQVc7NEJBQ1gsbUJBQW1CLENBQUM7d0JBT3hCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7NEJBQ2IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dDQUNyQixPQUFPLEVBQUUsYUFBYTs2QkFDekIsRUFBRSxhQUFhLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0NBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7NkJBQzlCLEVBQUUsYUFBYSxDQUFDLENBQUM7d0JBQ3RCLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixHQUFHLElBQUksV0FBVyxDQUFDO29CQUN2QixDQUFDO29CQUVELElBQUksWUFBVSxHQUFXLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLFlBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsR0FBRyxJQUFrQixZQUFVLENBQUM7b0JBQ3BDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBTy9DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLElBQUksTUFBTSxDQUFDO2dCQUNsQixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksSUFBSSxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsY0FBYztpQkFDMUIsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCx1Q0FBa0MsR0FBRyxVQUFTLFdBQW1CO1lBQzdELElBQUksT0FBTyxHQUFXLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksSUFBSSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRTFDLEdBQUcsQ0FBQyxDQUFjLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJO29CQUFqQixJQUFJLEtBQUssYUFBQTtvQkFDVixPQUFPLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3pCLE9BQU8sRUFBRSxZQUFZO3dCQUNyQixTQUFTLEVBQUUsNEJBQTBCLEtBQUssQ0FBQyxRQUFRLE9BQUk7cUJBQzFELEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQW9CdEI7WUFDTCxDQUFDO1lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsT0FBTyxHQUFHLGlCQUFpQixDQUFBO1lBQy9CLENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQVFELHlCQUFvQixHQUFHLFVBQVMsSUFBYyxFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQUUsUUFBZ0I7WUFFMUYsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMzQixJQUFJLGNBQWMsR0FBWSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNqRCxJQUFJLGNBQWMsR0FBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDOUMsSUFBSSxTQUFTLEdBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUM7WUFDdkUsSUFBSSxXQUFXLEdBQVksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztZQUVqRSxJQUFJLEtBQUssR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2dCQUU5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFM0MsSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsY0FBYyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQzt1QkFDOUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFVRCxJQUFJLFNBQVMsR0FBYSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN0RCxJQUFJLFFBQVEsR0FBWSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRTdELElBQUksZ0JBQWdCLEdBQVcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pHLElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6RCxJQUFJLEtBQUssR0FBVyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDckIsT0FBTyxFQUFFLGdCQUFnQixHQUFHLENBQUMsUUFBUSxHQUFHLGFBQWEsR0FBRyxlQUFlLENBQUM7Z0JBQ3hFLFNBQVMsRUFBRSwrQkFBNkIsR0FBRyxRQUFLO2dCQUNoRCxJQUFJLEVBQUUsS0FBSztnQkFDWCxPQUFPLEVBQUUsUUFBUTthQUNwQixFQUNHLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxJQUFJLEVBQUUsR0FBRyxHQUFHLFVBQVU7YUFDekIsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFBO1FBRUQsZ0JBQVcsR0FBRztZQUNWLElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0QsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlELElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDekQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVoQyxJQUFJLE9BQU8sR0FBVyxzQkFBc0IsR0FBRyxHQUFHLENBQUM7WUFDbkQsSUFBSSxJQUFJLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sSUFBSSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2hGLENBQUM7WUFFRCxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BELENBQUMsQ0FBQTtRQUVELHdCQUFtQixHQUFHLFVBQVMsSUFBYztZQUN6QyxJQUFJLFdBQVcsR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksY0FBYyxHQUFXLEVBQUUsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNkLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDL0IsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLE9BQU8sRUFBRSxpQkFBaUI7aUJBQzdCLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHLFVBQVMsSUFBYztZQUMxQyxJQUFJLE1BQU0sR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BFLElBQUksV0FBVyxHQUFXLEVBQUUsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUVULFdBQVcsR0FBRywyQkFBeUIsTUFBTSxPQUFJLENBQUM7WUFDdEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsVUFBUyxPQUFnQixFQUFFLE9BQWdCO1lBQzNELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDckIsT0FBTyxFQUFFLHlEQUF5RCxHQUFHLE9BQU87YUFDL0UsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQVMsT0FBZSxFQUFFLEtBQWE7WUFDbkQsSUFBSSxHQUFHLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBUyxLQUFLLFFBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRS9FLElBQUksS0FBSyxHQUFHO2dCQUNSLE9BQU8sRUFBRSx3REFBd0Q7YUFDcEUsQ0FBQztZQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQTtRQUVELGNBQVMsR0FBRyxVQUFTLE9BQWUsRUFBRSxPQUFlO1lBQ2pELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDckIsT0FBTyxFQUFFLHVEQUF1RCxHQUFHLE9BQU87YUFDN0UsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCx5QkFBb0IsR0FBRyxVQUFTLElBQWMsRUFBRSxTQUFrQixFQUFFLFdBQW9CLEVBQUUsY0FBdUI7WUFFN0csSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0UsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0UsSUFBSSxZQUFZLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakYsSUFBSSxVQUFVLEdBQVcsRUFBRSxDQUFDO1lBQzVCLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztZQUMzQixJQUFJLG1CQUFtQixHQUFXLEVBQUUsQ0FBQztZQUNyQyxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFDaEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxrQkFBa0IsR0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1lBTTdCLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDckMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSwwQkFBd0IsSUFBSSxDQUFDLEdBQUcsUUFBSztpQkFDbkQsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUNqQixDQUFDO1lBRUQsSUFBSSxXQUFXLEdBQVcsQ0FBQyxDQUFDO1lBRzVCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsV0FBVyxFQUFFLENBQUM7Z0JBRWQsVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQU9wQyxPQUFPLEVBQUUsd0NBQXdDO29CQUNqRCxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLG1CQUFpQixJQUFJLENBQUMsR0FBRyxRQUFLO2lCQUM1QyxFQUNHLE1BQU0sQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFPRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBR2xDLElBQUksUUFBUSxHQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBR3RFLFdBQVcsRUFBRSxDQUFDO2dCQUVkLElBQUksR0FBRyxHQUFXLFFBQVEsR0FBRztvQkFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTTtvQkFDdkIsU0FBUyxFQUFFLHdCQUFzQixJQUFJLENBQUMsR0FBRyxRQUFLO29CQUM5QyxTQUFTLEVBQUUsU0FBUztvQkFHcEIsT0FBTyxFQUFFLG1CQUFtQjtpQkFDL0I7b0JBQ0c7d0JBQ0ksSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTTt3QkFDdkIsU0FBUyxFQUFFLHdCQUFzQixJQUFJLENBQUMsR0FBRyxRQUFLO3dCQUM5QyxPQUFPLEVBQUUsbUJBQW1CO3FCQUMvQixDQUFDO2dCQUVOLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFbEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBRXBDLFdBQVcsRUFBRSxDQUFDO29CQUNkLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUU7d0JBQ2xELE1BQU0sRUFBRSw4QkFBOEI7d0JBQ3RDLElBQUksRUFBRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRzt3QkFDbEMsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFNBQVMsRUFBRSx5QkFBdUIsSUFBSSxDQUFDLEdBQUcsUUFBSztxQkFDbEQsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxXQUFXLEVBQUUsQ0FBQztvQkFFZCxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUMvQyxNQUFNLEVBQUUsMEJBQTBCO3dCQUNsQyxJQUFJLEVBQUUsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUc7d0JBQ3JDLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsc0JBQW9CLElBQUksQ0FBQyxHQUFHLFFBQUs7cUJBQy9DLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFJRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxXQUFXLEVBQUUsQ0FBQztnQkFFZCxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFDM0M7b0JBQ0ksS0FBSyxFQUFFLFlBQVk7b0JBQ25CLE1BQU0sRUFBRSxrQkFBa0I7b0JBQzFCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsdUJBQXFCLElBQUksQ0FBQyxHQUFHLFFBQUs7aUJBQ2hELEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFbEYsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDWixXQUFXLEVBQUUsQ0FBQzt3QkFFZCxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFOzRCQUMvQyxNQUFNLEVBQUUsb0JBQW9COzRCQUM1QixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsU0FBUyxFQUFFLHNCQUFvQixJQUFJLENBQUMsR0FBRyxRQUFLO3lCQUMvQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNiLENBQUM7b0JBRUQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxXQUFXLEVBQUUsQ0FBQzt3QkFFZCxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFOzRCQUNqRCxNQUFNLEVBQUUsc0JBQXNCOzRCQUM5QixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsU0FBUyxFQUFFLHdCQUFzQixJQUFJLENBQUMsR0FBRyxRQUFLO3lCQUNqRCxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNiLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFPRCxJQUFJLGlCQUFpQixHQUFXLEVBQUUsQ0FBQztZQUtuQyxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFLaEMsSUFBSSxVQUFVLEdBQVcsU0FBUyxHQUFHLFVBQVUsR0FBRyxnQkFBZ0IsR0FBRyxtQkFBbUIsR0FBRyxpQkFBaUI7a0JBQ3RHLGNBQWMsR0FBRyxjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1lBRTVGLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqRyxDQUFDLENBQUE7UUFFRCwyQkFBc0IsR0FBRyxVQUFTLE9BQWdCLEVBQUUsWUFBcUI7WUFHckUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUNuQjtnQkFDSSxPQUFPLEVBQUUsbUJBQW1CLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzVFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHLFVBQVMsT0FBZTtZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxtQkFBbUI7YUFDL0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsb0JBQWUsR0FBRyxVQUFTLEtBQWEsRUFBRSxFQUFVO1lBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFO2dCQUNwQyxJQUFJLEVBQUUsRUFBRTtnQkFDUixNQUFNLEVBQUUsRUFBRTthQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUE7UUFLRCxvQkFBZSxHQUFHLFVBQVMsR0FBVztZQUNsQyxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsZUFBVSxHQUFHLFVBQVMsSUFBYztZQUNoQyxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRzdCLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVoRixJQUFJLFVBQVUsR0FBVyxTQUFTLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsQ0FBQztZQUVELElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM5RCxHQUFHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUcsVUFBUyxJQUFZO1lBQzVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNyQyxDQUFDLENBQUE7UUFLRCx1QkFBa0IsR0FBRyxVQUFTLElBQXlCLEVBQUUsV0FBcUI7WUFDMUUsTUFBTSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRTNDLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQztZQUVELEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7WUFFekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUVELE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBRXpCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFNMUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7Z0JBRXBDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxJQUFJLFNBQVMsR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBRWpHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUM1RSxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFNOUQsSUFBSSxlQUFlLEdBQVcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBSWpHLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ2hDLElBQUksS0FBSyxHQUFXLEdBQUcsR0FBRyxNQUFNLENBQUM7Z0JBQ2pDLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxjQUFjLEdBQVcsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLG1CQUFtQixHQUFXLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO2dCQU03QixJQUFJLFNBQVMsR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hGLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxZQUFZLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQU90RixFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7d0JBQ3JDLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsMEJBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFLO3FCQUN4RCxFQUNHLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RixtQkFBbUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUNsRCxNQUFNLEVBQUUsOEJBQThCO3dCQUN0QyxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLHlCQUF1QixHQUFHLFFBQUs7cUJBQzdDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFHRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBR2hDLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUM3QyxNQUFNLEVBQUUsa0JBQWtCO3dCQUMxQixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLHVCQUFxQixHQUFHLFFBQUs7cUJBQzNDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2YsQ0FBQztnQkFHRCxJQUFJLFNBQVMsR0FBYSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDdEQsSUFBSSxRQUFRLEdBQVksU0FBUyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDO2dCQUczRCxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsSUFBSSxjQUFjLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDdkQsU0FBUyxHQUFHLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQ2xHLENBQUM7Z0JBRUQsSUFBSSxPQUFPLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3BDLE9BQU8sRUFBRSxDQUFDLFFBQVEsR0FBRyxpQ0FBaUMsR0FBRyxtQ0FBbUMsQ0FBQztvQkFDN0YsU0FBUyxFQUFFLCtCQUE2QixHQUFHLFFBQUs7b0JBQ2hELElBQUksRUFBRSxLQUFLO2lCQUNkLEVBQ0csU0FBUyxHQUFHLGVBQWUsQ0FBQyxDQUFDO2dCQUVqQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBT3hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNqQyxDQUFDO1lBR0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxXQUFXLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvRixJQUFJLFVBQVUsR0FBVyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNGLE1BQU0sSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RGLENBQUM7WUFFRCxJQUFJLFFBQVEsR0FBVyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksVUFBVSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQU05QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQzVDLElBQUksSUFBSSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxJQUFJLEdBQUcsR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDN0UsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixNQUFNLElBQUksR0FBRyxDQUFDOzRCQUNkLFFBQVEsRUFBRSxDQUFDO3dCQUNmLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25GLE1BQU0sSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDekIsV0FBVyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUVELENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBT2hDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRTFCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsY0FBUyxHQUFHO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUc7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVELGFBQVEsR0FBRztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRUQsYUFBUSxHQUFHO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFRCxnQkFBVyxHQUFHLFVBQVMsQ0FBUyxFQUFFLElBQWMsRUFBRSxPQUFnQixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7WUFFcEcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDO1lBRWQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFNUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzlELENBQUM7WUFDTCxDQUFDO1lBRUQsUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFckUsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELDRCQUF1QixHQUFHLFVBQVMsSUFBYztZQUM3QyxNQUFNLENBQUMsYUFBYSxHQUFHLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzRyxDQUFDLENBQUE7UUFHRCxvQkFBZSxHQUFHLFVBQVMsSUFBYztZQUVyQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUtOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBaUI1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFRdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUUvQixDQUFDO29CQUlELElBQUksQ0FBQyxDQUFDO3dCQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNwQyxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBR0QsaUJBQVksR0FBRyxVQUFTLElBQWM7WUFDbEMsSUFBSSxHQUFHLEdBQVcsTUFBTSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFFbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFhNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBR3ZDLElBQUksS0FBSyxHQUFXLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO29CQUs1QyxJQUFJLE1BQU0sR0FBVyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUV0RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3JCLEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSzt3QkFDaEIsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJO3dCQUNyQixRQUFRLEVBQUUsTUFBTSxHQUFHLElBQUk7cUJBQzFCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixDQUFDO2dCQUVELElBQUksQ0FBQyxDQUFDO29CQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDckIsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJO3dCQUMxQixRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJO3FCQUMvQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLEtBQUssRUFBRSxHQUFHO29CQUNWLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSztpQkFDbkIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELFFBQUcsR0FBRyxVQUFTLEdBQVcsRUFBRSxVQUFtQixFQUFFLE9BQWdCLEVBQUUsUUFBa0I7WUFHakYsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFdBQVcsQ0FBQztnQkFDbEMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUdwQixJQUFJLEdBQUcsR0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsR0FBRyxJQUFJLEdBQUcsQ0FBQztnQkFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDO29CQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNKLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLENBQUM7d0JBS0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUV4QixHQUFHLElBQU8sQ0FBQyxXQUFLLENBQUMsUUFBSSxDQUFDO3dCQUMxQixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUVKLEdBQUcsSUFBTyxDQUFDLFVBQUssQ0FBQyxPQUFJLENBQUM7d0JBQzFCLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDbkIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWCxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVELEdBQUcsSUFBSSxNQUFJLE9BQU8sVUFBSyxHQUFHLE1BQUcsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELGlCQUFZLEdBQUcsVUFBUyxTQUFpQixFQUFFLE9BQWU7WUFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2hDLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixJQUFJLEVBQUUsT0FBTzthQUNoQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1lBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtnQkFDN0IsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2FBQ2hCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVELHNCQUFpQixHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1lBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtnQkFDN0IsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixPQUFPLEVBQUUsY0FBYzthQUMxQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBUyxJQUFZLEVBQUUsRUFBVSxFQUFFLFFBQWEsRUFBRSxHQUFTO1lBQ3BFLElBQUksT0FBTyxHQUFHO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUE7UUFFRCwyQkFBc0IsR0FBRyxVQUFTLFFBQWdCO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ2hFLENBQUMsQ0FBQTtRQUVELHVCQUFrQixHQUFHLFVBQVMsUUFBZ0I7WUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUE7UUFFRCxxQkFBZ0IsR0FBRyxVQUFTLFFBQWdCO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFBO1FBRUQseUJBQW9CLEdBQUcsVUFBUyxRQUFnQjtZQUM1QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9ELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBQUQsYUFBQztBQUFELENBQUMsQUEzakNELElBMmpDQztBQUNELElBQUksTUFBTSxHQUFXLElBQUksTUFBTSxFQUFFLENBQUM7QUFFbEM7SUFBQTtRQUNJLHNCQUFpQixHQUFXLFdBQVcsQ0FBQztRQUV4QyxnQkFBVyxHQUFRLElBQUksQ0FBQztRQUN4QixvQkFBZSxHQUFXLGdCQUFnQixDQUFDO1FBQzNDLHNCQUFpQixHQUFXLFVBQVUsQ0FBQztRQUV2QyxpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUtuQixrQkFBYSxHQUFRLElBQUksQ0FBQztRQUsxQixvQkFBZSxHQUFRLElBQUksQ0FBQztRQUs1QixxQkFBZ0IsR0FBYSxJQUFJLENBQUM7UUFNbEMsa0JBQWEsR0FBUSxFQUFFLENBQUM7UUFTeEIsaUJBQVksR0FBZ0MsRUFBRSxDQUFDO1FBRS9DLHFCQUFnQixHQUFHO1lBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSTtnQkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSTtnQkFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUk7Z0JBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBRUQsdUJBQWtCLEdBQUc7WUFLakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHdCQUFtQixHQUFHLFVBQVMsR0FBdUI7WUFDbEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDekIsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7WUFDbEQsSUFBSSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBUyxHQUF1QjtZQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztZQUMzQixJQUFJLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztZQUN0RCxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFRCx3QkFBbUIsR0FBRyxVQUFTLEdBQXVCO1lBQ2xELEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0I7Z0JBQ2hDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLFFBQVEsRUFBRSxDQUFDO2dCQUNYLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUc7WUFDaEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBd0MsWUFBWSxFQUFFO2dCQUMzRCxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pCLFlBQVksRUFBRSxFQUFFO2dCQUNoQixTQUFTLEVBQUUsTUFBTTtnQkFDakIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhO2dCQUNsQyxZQUFZLEVBQUUsSUFBSTthQUNyQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHO1lBQ25CLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksVUFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDNUIsWUFBWSxFQUFFLElBQUk7YUFDckIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsSUFBYztZQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLENBQUMsQ0FBQTtRQUVELDhCQUF5QixHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVE7WUFDL0MsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBTTNDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUVqQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBUyxDQUFDLEVBQUUsSUFBSTtnQkFDdkMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBRVgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFMUIsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsTUFBTSxJQUFJLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtRQU9ELGlDQUE0QixHQUFHLFVBQVMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUTtZQUVoRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFMUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUd6QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRXJELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDOUMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsNkJBQTZCO2dCQUN0QyxTQUFTLEVBQUUsd0NBQXNDLEdBQUcsUUFBSztnQkFDekQsSUFBSSxFQUFFLEtBQUs7YUFDZCxFQUNHLGFBQWE7a0JBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxHQUFHLEdBQUcsZUFBZTtpQkFDOUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQUVELHNCQUFpQixHQUFHLFVBQVMsR0FBRztZQUM1QixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsMkJBQXlCLEdBQUcsUUFBSyxDQUFDLENBQUM7WUFDekYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUE7UUFFRCwyQkFBc0IsR0FBRyxVQUFTLE1BQU0sRUFBRSxHQUFHO1lBQ3pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUE7UUFFRCxvQkFBZSxHQUFHLFVBQVMsR0FBVztZQUlsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sd0NBQXdDLEdBQUcsR0FBRyxDQUFDO1lBQ3pELENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzRSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUtELG1CQUFjLEdBQUc7WUFFYixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUVoRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRU4sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDN0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBQyxBQTFORCxJQTBOQztBQUNELElBQUksSUFBSSxHQUFXLElBQUksTUFBTSxFQUFFLENBQUM7QUFFaEM7SUFBQTtRQUVZLDRCQUF1QixHQUFHLFVBQVMsR0FBMkI7WUFDbEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQWEsSUFBSSxDQUFDO1FBSzdCLG9CQUFlLEdBQUc7WUFDZCxJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUVqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN6QixDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFFRCxvQkFBZSxHQUFHO1lBQ2QsSUFBSSxTQUFTLEdBQWEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztZQUV0QyxJQUFJLENBQUMsSUFBSSxDQUFnRCxnQkFBZ0IsRUFBRTtnQkFDdkUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO2FBQ3pCLEVBQUUsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELFlBQUM7QUFBRCxDQUFDLEFBbENELElBa0NDO0FBQ0QsSUFBSSxLQUFLLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUUvQjtJQUFBO1FBRVksbUJBQWMsR0FBRyxVQUFTLEdBQW1CO1lBRWpELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQU9ELHNCQUFpQixHQUFHO1lBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU07Z0JBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSztnQkFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNO2dCQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztRQUNoRCxDQUFDLENBQUE7UUFFRCwrQkFBMEIsR0FBRyxVQUFTLEdBQUc7WUFDckMsSUFBSSxLQUFLLEdBQUcsb0JBQW9CLENBQUM7WUFHakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDckIsS0FBSyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ2hDLENBQUM7WUFFRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBR0QsbUNBQThCLEdBQUcsVUFBUyxHQUFrQjtZQUN4RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzVDLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDL0IsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQztZQUM5QyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDN0QsTUFBTSxDQUFDLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztZQUV6RCxNQUFNLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDN0MsTUFBTSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDckcsTUFBTSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztZQUV2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHO1lBQ1gsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBR0QsZ0JBQVcsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHO1lBQzVCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osSUFBSSxFQUFFLEdBQUc7YUFDWixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFLRCxnQkFBVyxHQUFHO1lBQ1YsSUFBSSxRQUFRLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUN4QyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMvQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRztZQUVYLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFN0IsSUFBSSxPQUFlLENBQUM7WUFDcEIsSUFBSSxPQUFlLENBQUM7WUFDcEIsSUFBSSxZQUFZLEdBQVksS0FBSyxDQUFDO1lBRWxDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkQsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2dCQUk1QyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNiLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUczRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUVsRCxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxDQUFDO2dCQUtyRSxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUM3QixDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUE4QixPQUFPLEVBQUU7b0JBQzVDLFVBQVUsRUFBRSxPQUFPO29CQUNuQixVQUFVLEVBQUUsT0FBTztvQkFDbkIsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7b0JBQzFDLEtBQUssRUFBRSxJQUFJLENBQUMsbUJBQW1CO2lCQUNsQyxFQUFFLFVBQVMsR0FBa0I7b0JBQzFCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDNUQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25DLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsV0FBTSxHQUFHLFVBQVMsc0JBQXNCO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBR0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU5QixFQUFFLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFnQyxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUE7UUFFRCxVQUFLLEdBQUcsVUFBUyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUc7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBOEIsT0FBTyxFQUFFO2dCQUM1QyxVQUFVLEVBQUUsR0FBRztnQkFDZixVQUFVLEVBQUUsR0FBRztnQkFDZixVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUMsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7YUFDbEMsRUFBRSxVQUFTLEdBQWtCO2dCQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHO1lBQ25CLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUcsVUFBUyxHQUFtQixFQUFFLEdBQVksRUFBRSxHQUFZLEVBQUUsWUFBc0IsRUFBRSxRQUFtQjtZQUNqSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsR0FBRyxHQUFHLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUV4RixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztnQkFFRCxJQUFJLENBQUMsOEJBQThCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXpDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBR0QsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDO2dCQUV0QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNoRSxFQUFFLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDO29CQUMxQixNQUFNLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2dCQUNqQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNoRSxFQUFFLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7b0JBQ3RDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQ3ZELEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQU1oRCxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN0QyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDL0MsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdPLHlCQUFvQixHQUFHLFVBQVMsR0FBa0I7WUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNkLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELFdBQUM7QUFBRCxDQUFDLEFBdk9ELElBdU9DO0FBQ0QsSUFBSSxJQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUU1QjtJQUFBO1FBRUksMkJBQXNCLEdBQVksS0FBSyxDQUFDO1FBRXhDLG9CQUFlLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNYLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUVwQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxVQUFVLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNyRSxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxVQUFVLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEYsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELHdCQUFtQixHQUFHLFVBQVMsR0FBd0IsRUFBRSxRQUFjLEVBQUUsV0FBcUI7WUFDMUYsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUU1QyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRWxCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUtELGdCQUFXLEdBQUcsVUFBUyxNQUFZLEVBQUUsa0JBQXdCLEVBQUUsV0FBaUIsRUFBRSxlQUF5QjtZQUN2RyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7WUFDbEMsQ0FBQztZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksY0FBYyxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMzRCxXQUFXLEdBQUcsY0FBYyxJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUN0RSxDQUFDO1lBT0QsSUFBSSxDQUFDLElBQUksQ0FBd0MsWUFBWSxFQUFFO2dCQUMzRCxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEtBQUs7Z0JBQ3ZELFFBQVEsRUFBRSxHQUFHLENBQUMsVUFBVTtnQkFDeEIsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxVQUFTLEdBQXVCO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUUzQyxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDM0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFRCxjQUFTLEdBQUc7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdkMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUc7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEMsR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFBO1FBRUQsYUFBUSxHQUFHO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQztZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtRQUVELGFBQVEsR0FBRztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQTtRQUVPLGFBQVEsR0FBRyxVQUFTLFlBQXFCO1lBQzdDLElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhO2dCQUM5QixTQUFTLEVBQUUsSUFBSTtnQkFDZixvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVU7Z0JBQ3hCLGNBQWMsRUFBRSxZQUFZO2FBQy9CLEVBQUUsVUFBUyxHQUF1QjtnQkFDL0IsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDZixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDM0MsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBUUQseUJBQW9CLEdBQUc7WUFDbkIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztZQUVuQyxVQUFVLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztnQkFFcEMsSUFBSSxHQUFHLEdBQVEsR0FBRyxDQUFDLHNCQUFzQixFQUFFLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDbEUsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztnQkFHRCxJQUFJLENBQUMsQ0FBQztvQkFDRixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBTXJDLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFRCxnQkFBVyxHQUFHO1lBQ1YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2dCQUM1QixNQUFNLENBQUM7WUFHWCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFHakMsVUFBVSxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztvQkFDNUIsTUFBTSxDQUFDO2dCQUNYLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFRCw0QkFBdUIsR0FBRyxVQUFTLEtBQWE7WUFDNUMsSUFBSSxJQUFJLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBUSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQztZQUVYLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksV0FBVyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUtyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsV0FBVyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNuRCxDQUFDO2dCQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBOEMsZUFBZSxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQTBCO2dCQUMzRyxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELFdBQUM7QUFBRCxDQUFDLEFBaE1ELElBZ01DO0FBQ0QsSUFBSSxJQUFJLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUU1QjtJQUFBO1FBRVkscUJBQWdCLEdBQUcsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLEVBQVc7WUFDM0UsSUFBSSxjQUFjLEdBQUc7Z0JBQ2pCLEtBQUssRUFBRSxjQUFjO2FBQ3hCLENBQUM7WUFFRixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFaEUsSUFBSSxpQkFBaUIsR0FBRztnQkFDcEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsWUFBWSxFQUFFLEVBQUU7YUFDbkIsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ0MsaUJBQWtCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQU05QyxTQUFTO2dCQUNYLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUE7UUFFTyx3QkFBbUIsR0FBRyxVQUFTLE9BQWU7WUFDbEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO2dCQUM1QixPQUFPLEVBQUUsc0NBQXNDO2dCQUMvQyxZQUFZLEVBQUUsRUFBRTthQUduQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUE7UUFFTyxhQUFRLEdBQUcsVUFBUyxJQUFZLEVBQUUsRUFBVSxFQUFFLE9BQVk7WUFDOUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO2dCQUM1QixJQUFJLEVBQUUsRUFBRTtnQkFDUixTQUFTLEVBQUUsT0FBTztnQkFDbEIsWUFBWSxFQUFFLEVBQUU7YUFDbkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRU8sVUFBSyxHQUFXLGFBQWEsQ0FBQztRQUV0QyxVQUFLLEdBQUc7WUFTSixJQUFJLFFBQVEsR0FDUixTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUMxRSxJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTlELElBQUksYUFBYSxHQUNiLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDO2dCQUN0RSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSwrQkFBK0IsQ0FBQztnQkFDbkYsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLENBQUM7Z0JBQ3JFLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHVCQUF1QixDQUFDO2dCQUMzRSxTQUFTLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLHlCQUF5QixDQUFDO2dCQUMxRixTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsMkJBQTJCLENBQUM7Z0JBQzFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQztnQkFDMUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUNuRixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRWpFLElBQUksYUFBYSxHQUNiLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDO2dCQUNsRSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsQ0FBQztnQkFDeEUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsdUJBQXVCLENBQUM7Z0JBQzVFLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLHdCQUF3QixFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFDMUYsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUVqRSxJQUFJLG1CQUFtQixHQUNuQixTQUFTLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLHFDQUFxQyxDQUFDO2dCQUNyRyxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLG9DQUFvQyxDQUFDO2dCQUNsRyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLGdDQUFnQyxDQUFDLENBQUM7WUFDekcsSUFBSSxjQUFjLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRS9FLElBQUksZ0JBQWdCLEdBQ2hCLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUUsMEJBQTBCLENBQUM7Z0JBQzVGLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsdUJBQXVCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUNwRyxJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFeEUsSUFBSSxlQUFlLEdBQ2YsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsa0NBQWtDLENBQUM7Z0JBRTNGLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLCtCQUErQixDQUFDO2dCQUNqRixTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBRTdGLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFdkUsSUFBSSxpQkFBaUIsR0FDakIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsOEJBQThCLENBQUM7Z0JBQ3RGLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLHdCQUF3QixFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFDMUYsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBRTdFLElBQUksb0JBQW9CLEdBQ3BCLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ3BGLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO2dCQUN2RSxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFBRSx1QkFBdUIsQ0FBQztnQkFDaEYsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsMEJBQTBCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUM5RixJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFZL0UsSUFBSSxjQUFjLEdBQ2QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSx3QkFBd0IsRUFBRSxtQ0FBbUMsQ0FBQztnQkFDcEcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO1lBSXBHLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFMUUsSUFBSSxVQUFVLEdBQ1YsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsd0JBQXdCLENBQUM7Z0JBQ2pGLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUFFLHdCQUF3QixDQUFDO2dCQUNuRixTQUFTLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFLDZCQUE2QixFQUFFLCtCQUErQixDQUFDLENBQUM7WUFDckgsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFN0UsSUFBSSxTQUFTLEdBQ1QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUNwRixJQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXRFLElBQUksT0FBTyxHQUFtQixXQUFXLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxjQUFjLEdBQUcsV0FBVyxHQUFHLGVBQWUsR0FBMEIsVUFBVSxHQUFHLFlBQVksR0FBRyxhQUFhO2tCQUM3SyxTQUFTLEdBQUcsWUFBWSxDQUFDO1lBRS9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUE7UUFFRCxTQUFJLEdBQUc7WUFDSCxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUFDLEFBbEpELElBa0pDO0FBQ0QsSUFBSSxTQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQU8zQztJQUFBO1FBQ0ksV0FBTSxHQUFRLElBQUksQ0FBQztRQUNuQixxQkFBZ0IsR0FBVyxJQUFJLENBQUM7UUFFeEIsUUFBRyxHQUFXLElBQUksQ0FBQztRQUNuQixTQUFJLEdBQWEsSUFBSSxDQUFDO1FBQ3RCLGVBQVUsR0FBZ0IsSUFBSSxDQUFDO1FBRS9CLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFFOUIsZ0JBQVcsR0FBRztZQUNWLElBQUksQ0FBQyxJQUFJLENBQTBDLGFBQWEsRUFBRSxFQUNqRSxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUVPLHdCQUFtQixHQUFHO1lBQzFCLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsSUFBYyxFQUFFLFVBQW1CO1lBQ3pELElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLEtBQUssR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3RSxJQUFJLElBQUksR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxJQUFJLE1BQU0sR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRixJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFDeEIsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQ3ZCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCO2lCQUM5QixFQUNHLElBQUksQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsbUJBQW1CO29CQUM1QixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7aUJBQ3RCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsOEJBQXlCLEdBQUcsVUFBUyxJQUFjO1lBQy9DLElBQUksSUFBSSxHQUFpQixLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQWlCLEtBQUssQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0UsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakYsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxtQkFBYyxHQUFHLFVBQVMsSUFBYyxFQUFFLFVBQW1CO1lBQ3pELElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRixJQUFJLE9BQU8sR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RSxJQUFJLFNBQVMsR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFJLE9BQU8sR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RSxJQUFJLE1BQU0sR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU1RSxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7WUFFdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ3JCLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSztpQkFDeEIsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUVELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDaEMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7b0JBQzFELE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQ0csTUFBTSxDQUFDLENBQUM7WUFDaEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQ3hCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUMxQixFQUFFLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsYUFBYTtpQkFDekIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNkLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzlCLEVBQ0csS0FBSyxDQUFDLENBQUM7WUFDZixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELHlCQUFvQixHQUFHLFVBQVMsSUFBYyxFQUFFLFVBQTBCO1lBQ3RFLElBQUksU0FBUyxHQUFhO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjtnQkFDcEIsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLG1CQUFtQjtnQkFDbkIsd0JBQXdCO2FBQUMsQ0FBQztZQUU5QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRUQseUJBQW9CLEdBQUcsVUFBUyxJQUFjLEVBQUUsVUFBMEI7WUFDdEUsSUFBSSxTQUFTLEdBQWE7Z0JBQ3RCLHFCQUFxQjtnQkFDckIsb0JBQW9CO2dCQUNwQixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsc0JBQXNCO2FBQUMsQ0FBQztZQUU1QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBUyxJQUFZO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFaEQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxRQUFNLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0QsRUFBRSxDQUFDLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsSUFBSSxDQUE4QyxlQUFlLEVBQUU7d0JBQ3BFLEtBQUssRUFBRSxRQUFNO3FCQUNoQixFQUFFLFVBQVMsR0FBMEI7d0JBQ2xDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3ZDLElBQUksR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLFFBQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDbEUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRU8sc0JBQWlCLEdBQUcsVUFBUyxJQUFZO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksTUFBTSxHQUFpQixLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1QsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0MsQ0FBQztZQUNMLENBQUM7WUFDRCxJQUFJO2dCQUFDLE1BQU0sMkJBQTJCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUN6RCxDQUFDLENBQUE7UUFFTyx1QkFBa0IsR0FBRyxVQUFTLE1BQWM7WUFDaEQsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFeEIsSUFBSSxPQUFPLEdBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxHQUFHLENBQUMsQ0FBWSxVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87Z0JBQWxCLElBQUksR0FBRyxnQkFBQTtnQkFDUixJQUFJLFFBQVEsR0FBYSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQzFDLFFBQVEsQ0FBQztnQkFDYixDQUFDO2dCQUVELElBQUksU0FBUyxHQUFXLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxPQUFPLEdBQVcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RCxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUM5RDtRQUNMLENBQUMsQ0FBQTtRQU9PLHFCQUFnQixHQUFHLFVBQVMsT0FBZTtZQUUvQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLFNBQVMsR0FBYSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pELElBQUksT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFRCxxQkFBZ0IsR0FBRztZQUVmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO2dCQUN0RCxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQ3BDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxjQUFTLEdBQUcsVUFBUyxHQUFXLEVBQUUsR0FBUTtZQUN0QyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNyQixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVELGlCQUFZLEdBQUcsVUFBUyxHQUFXLEVBQUUsR0FBUTtZQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUVyQixPQUFPLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUM5RSxDQUFDO1lBRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFNckIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNoQyxHQUFHLENBQUMsQ0FBWSxVQUFrQixFQUFsQixLQUFBLE9BQU8sQ0FBQyxVQUFVLEVBQWxCLGNBQWtCLEVBQWxCLElBQWtCO2dCQUE3QixJQUFJLEdBQUcsU0FBQTtnQkFFUixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsU0FBUztvQkFDM0MsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUlqRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUc5RSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7d0JBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFFRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakQsQ0FBQztvQkFDRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQzthQUNKO1FBQ0wsQ0FBQyxDQUFBO1FBR0Qsc0JBQWlCLEdBQUc7WUFRaEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFHM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUZBQW1GLENBQUMsQ0FBQztvQkFDakcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFFRCxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0UsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdELFVBQUssR0FBRztZQUNKLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN2QixPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0UsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELGtCQUFhLEdBQUcsVUFBUyxHQUFtQjtZQUN4QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFdkIsVUFBVSxDQUFDO29CQUNQLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDdkUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ3RCLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFFckIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDTixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELFNBQUksR0FBRztZQUNILEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxVQUFLLEdBQUcsVUFBUyxJQUFZO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDdkMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdELFNBQUksR0FBRyxVQUFTLEtBQWE7WUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsbUJBQWMsR0FBRyxVQUFTLEdBQVcsRUFBRSxVQUFrQjtZQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUU5QixJQUFJLENBQUMsSUFBSSxDQUE4QyxlQUFlLEVBQUU7Z0JBQ3BFLEtBQUssRUFBRSxHQUFHO2dCQUNWLFlBQVksRUFBRSxVQUFVO2FBRTNCLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFBO1FBRU8sMEJBQXFCLEdBQUc7UUFFaEMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBeFZELElBd1ZDO0FBQ0QsSUFBSSxPQUFPLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUVyQztJQUFBO1FBRUksZUFBVSxHQUFHLFVBQVMsSUFBYyxFQUFFLFVBQW1CO1lBQ3JELElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEUsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1lBRXRCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQ3hCLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFRRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsSUFBSSxDQUFxQixDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzlCLEVBQ0csSUFBSSxDQUFxQixDQUFDO1lBQ2xDLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsdUJBQWtCLEdBQUcsVUFBUyxJQUFjLEVBQUUsVUFBbUI7WUFDN0QsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBRXJCLElBQUksZ0JBQWdCLEdBQWlCLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xHLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVuRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNiLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDckIsT0FBTyxFQUFFLGFBQWE7cUJBQ3pCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ25CLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQixPQUFPLEVBQUUsa0JBQWtCO3FCQUM5QixFQUNHLFVBQVUsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCx5QkFBb0IsR0FBRyxVQUFTLElBQWMsRUFBRSxVQUEwQjtZQUN0RSxJQUFJLFNBQVMsR0FBYTtnQkFDdEIsYUFBYTthQUFDLENBQUM7WUFFbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtRQUVELFlBQU8sR0FBRztZQUNOLElBQUksT0FBTyxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLElBQUksQ0FBd0MsWUFBWSxFQUFFO29CQUMzRCxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUU7b0JBQ3BCLFNBQVMsRUFBRSxJQUFJO29CQUNmLFlBQVksRUFBRSxJQUFJO2lCQUNyQixFQUFFLFlBQVksQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELFdBQU0sR0FBRztRQVdULENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUcsVUFBUyxHQUF5QjtRQVNwRCxDQUFDLENBQUE7UUFFRCxvQkFBZSxHQUFHLFVBQVMsR0FBdUI7WUFDOUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFBO1FBRUQsV0FBTSxHQUFHO1lBQ0wsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLENBQUMsQ0FBQTtRQUVELGlCQUFZLEdBQUcsVUFBUyxJQUFjLEVBQUUsVUFBMEI7WUFDOUQsSUFBSSxTQUFTLEdBQWE7Z0JBQ3RCLGFBQWE7YUFBQyxDQUFDO1lBRW5CLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBOUdELElBOEdDO0FBQ0QsSUFBSSxZQUFZLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7QUFXcEQ7SUFRSSxvQkFBc0IsS0FBYTtRQUFuQyxpQkFVQztRQVZxQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBTjNCLDBCQUFxQixHQUFZLElBQUksQ0FBQztRQW9COUMsU0FBSSxHQUFHO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsZUFBVSxHQUFHO1FBQ2IsQ0FBQyxDQUFBO1FBRUQsVUFBSyxHQUFHO1lBQ0osTUFBTSxDQUFDLEVBQUUsQ0FBQTtRQUNiLENBQUMsQ0FBQztRQUVGLFNBQUksR0FBRztZQUNILElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUloQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFHdEQsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFPN0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQU1sRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QixlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUd2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztZQUVyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUd2QixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO2dCQUU3QixJQUFJLE9BQU8sR0FDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFJZCxPQUFPLEVBQUUsbUNBQW1DO2lCQUMvQyxFQUNHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQXVCOUIsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUdGLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFLM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUdELEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWxCLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFHckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQWdCL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7WUFNM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUdwQixJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsVUFBUyxXQUFXO2dCQUc3RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFPSCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFHckIsVUFBVSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBR1AsVUFBVSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFBO1FBWUQsT0FBRSxHQUFHLFVBQUMsRUFBRTtZQUNKLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztZQUdoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEVBQUUsR0FBRyxRQUFRLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRUQsT0FBRSxHQUFHLFVBQUMsRUFBRTtZQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQUMsU0FBaUIsRUFBRSxFQUFVO1lBQzFDLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtnQkFDN0IsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxjQUFjO2FBQzFCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUcsVUFBQyxPQUFlLEVBQUUsRUFBVztZQUMzQyxJQUFJLEtBQUssR0FBRztnQkFDUixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUlELGVBQVUsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYSxFQUFFLEdBQVM7WUFDNUQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDakIsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBTUQsb0JBQWUsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYyxFQUFFLEdBQVMsRUFBRSxnQkFBZ0MsRUFBRSxrQkFBOEI7WUFBaEUsaUNBQUEsRUFBQSx1QkFBZ0M7WUFBRSxtQ0FBQSxFQUFBLHNCQUE4QjtZQUVwSSxJQUFJLE9BQU8sR0FBRztnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFTbEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFFRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFN0UsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGVBQWUsQ0FBQTtZQUN0QyxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRyxVQUFDLEVBQVUsRUFBRSxRQUFhO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFFRCxnQkFBVyxHQUFHLFVBQUMsRUFBVSxFQUFFLEdBQVc7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixDQUFDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUcsVUFBQyxFQUFVO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoRCxDQUFDLENBQUE7UUFFRCxZQUFPLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVTtZQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsb0JBQWUsR0FBRyxVQUFDLEtBQWEsRUFBRSxFQUFVO1lBQ3hDLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFO2dCQUNwQyxJQUFJLEVBQUUsRUFBRTtnQkFDUixNQUFNLEVBQUUsRUFBRTthQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHLFVBQUMsS0FBYSxFQUFFLEVBQVUsRUFBRSxZQUFxQjtZQUM1RCxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVqQixJQUFJLEtBQUssR0FBRztnQkFFUixNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsRUFBRTthQUNYLENBQUM7WUFZRixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDakMsQ0FBQztZQUVELElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV0RSxRQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQzVCLEtBQUssRUFBRSxFQUFFO2FBQ1osRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVyxFQUFFLFFBQWtCO1lBQ3ZELElBQUksS0FBSyxHQUFHO2dCQUNSLE9BQU8sRUFBeUIsQ0FBQyxRQUFRLEdBQUcsb0NBQW9DLEdBQUcsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCO2FBQzVHLENBQUM7WUFHRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFHRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUVELFVBQUssR0FBRyxVQUFDLEVBQVU7WUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUNELEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFJMUIsQ0FBQyxDQUFBO1FBN1ZHLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBT2YsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQXNKTSwyQkFBTSxHQUFiO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQTRMTCxpQkFBQztBQUFELENBQUMsQUF2V0QsSUF1V0M7QUFDRDtJQUEwQiwrQkFBVTtJQUVoQztRQUFBLFlBQ0ksa0JBQU0sYUFBYSxDQUFDLFNBQ3ZCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFN0QsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDM0MsZUFBZSxFQUFFLGVBQWU7Z0JBQ2hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxNQUFNO2FBQ2hCLENBQUMsQ0FBQztZQUVILElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxPQUFPLEVBQUUsbUVBQW1FO2dCQUM1RSxPQUFPLEVBQUUsb0NBQW9DO2FBQ2hELEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7UUFDakMsQ0FBQyxDQUFBOztJQXJCRCxDQUFDO0lBc0JMLGtCQUFDO0FBQUQsQ0FBQyxBQTFCRCxDQUEwQixVQUFVLEdBMEJuQztBQUNEO0lBQXlCLDhCQUFVO0lBRS9CLG9CQUFvQixLQUFhLEVBQVUsT0FBZSxFQUFVLFVBQWtCLEVBQVUsV0FBcUIsRUFDekcsVUFBcUI7UUFEakMsWUFFSSxrQkFBTSxZQUFZLENBQUMsU0FDdEI7UUFIbUIsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQUFVLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLGlCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ3pHLGdCQUFVLEdBQVYsVUFBVSxDQUFXO1FBT2pDLFdBQUssR0FBRztZQUNKLElBQUksT0FBTyxHQUFXLEtBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUM3RyxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFN0MsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQztrQkFDNUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUM1QyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNoRCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUE7O0lBcEJELENBQUM7SUFxQkwsaUJBQUM7QUFBRCxDQUFDLEFBMUJELENBQXlCLFVBQVUsR0EwQmxDO0FBRUQ7SUFBZ0MscUNBQVU7SUFFdEMsMkJBQW9CLFFBQWdCO1FBQXBDLFlBQ0ksa0JBQU0sbUJBQW1CLENBQUMsU0FDN0I7UUFGbUIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQU9wQyxXQUFLLEdBQUc7WUFDSixJQUFJLE9BQU8sR0FBVyxtQkFBbUIsR0FBRyxLQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUVwRSxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDO2tCQUNyRSxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU3QyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGNBQVEsR0FBRztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1FBQ1AsQ0FBQyxDQUFBOztJQXhCRCxDQUFDO0lBeUJMLHdCQUFDO0FBQUQsQ0FBQyxBQTdCRCxDQUFnQyxVQUFVLEdBNkJ6QztBQUtEO0lBQXlCLDhCQUFVO0lBRS9CLG9CQUFvQixPQUFhLEVBQVUsS0FBVyxFQUFVLFFBQWM7UUFBOUUsWUFDSSxrQkFBTSxZQUFZLENBQUMsU0FNdEI7UUFQbUIsYUFBTyxHQUFQLE9BQU8sQ0FBTTtRQUFVLFdBQUssR0FBTCxLQUFLLENBQU07UUFBVSxjQUFRLEdBQVIsUUFBUSxDQUFNO1FBWTlFLFdBQUssR0FBRztZQUNKLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUMxRSxPQUFPLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBYkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN0QixDQUFDO1FBQ0QsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0lBQ3ZCLENBQUM7SUFVTCxpQkFBQztBQUFELENBQUMsQUFuQkQsQ0FBeUIsVUFBVSxHQW1CbEM7QUFDRDtJQUF1Qiw0QkFBVTtJQUM3QjtRQUFBLFlBQ0ksa0JBQU0sVUFBVSxDQUFDLFNBQ3BCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFbkQsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDNUUsSUFBSSxtQkFBbUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQ3pGLElBQUksT0FBTyxHQUFHLHNDQUFzQyxDQUFDO1lBRXJELElBQUksSUFBSSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7WUFFcEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFFbkMsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHO1lBQ2xCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxXQUFLLEdBQUc7WUFFSixJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUc7WUFDWixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsSUFBSSxHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV2QyxDQUFDLElBQUksVUFBVSxDQUFDLHdCQUF3QixFQUNwQyx3R0FBd0csRUFDeEcsYUFBYSxFQUFFO2dCQUNYLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZCxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQTs7SUE3REQsQ0FBQztJQThETCxlQUFDO0FBQUQsQ0FBQyxBQWpFRCxDQUF1QixVQUFVLEdBaUVoQztBQUNEO0lBQXdCLDZCQUFVO0lBRTlCO1FBQUEsWUFDSSxrQkFBTSxXQUFXLENBQUMsU0FDckI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUV6RCxJQUFJLFlBQVksR0FDWixLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDcEQsS0FBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2dCQUMxQyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUVuRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDL0I7Z0JBQ0ksT0FBTyxFQUFFLGVBQWU7YUFDM0IsRUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDWjtnQkFDSSxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixLQUFLLEVBQUUsRUFBRTthQUNaLEVBQ0QsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFcEIsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDaEYsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLHlCQUF5QixFQUNuRixLQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUVyRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXZGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7UUFNNUQsQ0FBQyxDQUFBO1FBRUQsWUFBTSxHQUFHO1lBQ0wsSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVDLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7WUFHaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQ2pDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDM0IsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLElBQUksVUFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQWdDLFFBQVEsRUFBRTtnQkFDL0MsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxTQUFTLEVBQUUsT0FBTzthQUNyQixFQUFFLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQW1CO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUc1QyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRWQsQ0FBQyxJQUFJLFVBQVUsQ0FDWCx5RUFBeUUsRUFDekUsUUFBUSxDQUNYLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCx1QkFBaUIsR0FBRztZQUVoQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQU1qQyxJQUFJLEdBQUcsR0FBRyxhQUFhLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQTtRQUVELHNCQUFnQixHQUFHO1lBQ2YsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFBOztJQWhHRCxDQUFDO0lBaUdMLGdCQUFDO0FBQUQsQ0FBQyxBQXJHRCxDQUF3QixVQUFVLEdBcUdqQztBQUNEO0lBQXVCLDRCQUFVO0lBQzdCO1FBQUEsWUFDSSxrQkFBTSxVQUFVLENBQUMsU0FDcEI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTNDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDO2dCQUMvRCxLQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRXpELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbkQsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3JDLFVBQVUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQ3hDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakIsSUFBSSxvQkFBb0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkcsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFcEUsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7WUFFcEMsSUFBSSxNQUFNLEdBQUcsNkJBQTZCLENBQUM7WUFDM0MsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQztZQUVsRSxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ25HLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFFOUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ3ZELENBQUMsQ0FBQTtRQUVELHFCQUFlLEdBQUc7WUFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXO2tCQUN6RixNQUFNLENBQUMsYUFBYSxDQUFDO1lBRTNCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRXhELElBQUksQ0FBQyxJQUFJLENBQTBELHFCQUFxQixFQUFFO2dCQUV0RixpQkFBaUIsRUFBRTtvQkFDZixjQUFjLEVBQUUsTUFBTSxDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsYUFBYTtvQkFDOUQsVUFBVSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUTtvQkFFM0MsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLGVBQWUsRUFBRSxLQUFLO29CQUN0QixlQUFlLEVBQUUsS0FBSztvQkFDdEIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxZQUFZO2lCQUN0QzthQUNKLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUVELDZCQUF1QixHQUFHLFVBQUMsR0FBZ0M7WUFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUdyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUk7aUJBQzdGLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFHN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUE7O0lBeEVELENBQUM7SUF5RUwsZUFBQztBQUFELENBQUMsQUE1RUQsQ0FBdUIsVUFBVSxHQTRFaEM7QUFDRDtJQUErQixvQ0FBVTtJQUVyQztRQUFBLFlBQ0ksa0JBQU0sa0JBQWtCLENBQUMsU0FDNUI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFL0MsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUM5RSxJQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsMkJBQTJCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUU1SixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUU3RCxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0QsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDdkMsT0FBTyxFQUFFLG1CQUFtQjthQUMvQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRXBCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQ25ELENBQUMsQ0FBQTs7SUFuQkQsQ0FBQztJQW9CTCx1QkFBQztBQUFELENBQUMsQUF4QkQsQ0FBK0IsVUFBVSxHQXdCeEM7QUFDRDtJQUF3Qiw2QkFBVTtJQUM5QjtRQUFBLFlBQ0ksa0JBQU0sV0FBVyxDQUFDLFNBQ3JCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUU5QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFFckYsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBZ0MsYUFBYSxFQUFFO29CQUNwRCxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUU7b0JBQzFCLGdCQUFnQixFQUFFLGNBQWM7aUJBQ25DLEVBQUUsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQW1CO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7O0lBeENELENBQUM7SUF5Q0wsZ0JBQUM7QUFBRCxDQUFDLEFBNUNELENBQXdCLFVBQVUsR0E0Q2pDO0FBQ0Q7SUFBd0IsNkJBQVU7SUFDOUI7UUFBQSxZQUNJLGtCQUFNLFdBQVcsQ0FBQyxTQUNyQjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVoRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFL0UsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBZ0MsUUFBUSxFQUFFO29CQUMvQyxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUU7b0JBQzFCLGdCQUFnQixFQUFFLGNBQWM7aUJBQ25DLEVBQUUsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQW1CO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBOztJQXpDRCxDQUFDO0lBMENMLGdCQUFDO0FBQUQsQ0FBQyxBQTdDRCxDQUF3QixVQUFVLEdBNkNqQztBQUNEO0lBQStCLG9DQUFVO0lBRXJDO1FBQUEsWUFDSSxrQkFBTSxrQkFBa0IsQ0FBQyxTQUM1QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUvQyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGdJQUFnSSxDQUFDLENBQUM7WUFDMUssSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFOUQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMvRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixNQUFNLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWtCO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsWUFBWSxFQUFFLFVBQVU7YUFDM0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBRUgsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7O0lBdkRELENBQUM7SUF3REwsdUJBQUM7QUFBRCxDQUFDLEFBNURELENBQStCLFVBQVUsR0E0RHhDO0FBQ0Q7SUFBNEIsaUNBQVU7SUFFbEM7UUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyw2SEFBNkgsQ0FBQyxDQUFDO1lBQ3ZLLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRTlELElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUNyRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXBFLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxZQUFZLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUMvRCxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxnQkFBVSxHQUFHO1lBQ1QsTUFBTSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUcsVUFBQyxVQUFlO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsWUFBWSxFQUFFLFVBQVU7YUFDM0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBOztJQXRERCxDQUFDO0lBdURMLG9CQUFDO0FBQUQsQ0FBQyxBQTNERCxDQUE0QixVQUFVLEdBMkRyQztBQUNEO0lBQTZCLGtDQUFVO0lBRW5DLHdCQUFvQixNQUFlO1FBQW5DLFlBQ0ksa0JBQU0sZ0JBQWdCLENBQUMsU0FDMUI7UUFGbUIsWUFBTSxHQUFOLE1BQU0sQ0FBUztRQU9uQyxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTdDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNwRSxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUN6RixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGdCQUFVLEdBQUc7WUFDVCxNQUFNLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWU7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksVUFBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLENBQUMsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM5QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDO1lBQzFCLElBQUksT0FBTyxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixZQUFZLEVBQUUsVUFBVTthQUMzQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7O0lBMURELENBQUM7SUEyREwscUJBQUM7QUFBRCxDQUFDLEFBL0RELENBQTZCLFVBQVUsR0ErRHRDO0FBQ0Q7SUFBZ0MscUNBQVU7SUFJdEMsMkJBQW9CLFFBQWdCO1FBQXBDLFlBQ0ksa0JBQU0sbUJBQW1CLENBQUMsU0FDN0I7UUFGbUIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQVdwQyxXQUFLLEdBQUc7WUFFSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztZQUVuRixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUU3QixFQUFFLGtDQUFrQyxDQUFDLENBQUM7WUFFdkMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBRTdFLElBQUksb0JBQW9CLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSw0QkFBNEIsRUFDM0YsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1lBRTdFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUU1RSxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQ3ZELENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUc7WUFDYixLQUFJLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV0RCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQWdELGdCQUFnQixFQUFFO29CQUN2RSxhQUFhLEVBQUUsS0FBSSxDQUFDLEdBQUc7b0JBQ3ZCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUTtpQkFDNUIsRUFBRSxLQUFJLENBQUMsc0JBQXNCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3BELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCw0QkFBc0IsR0FBRyxVQUFDLEdBQTJCO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLEdBQUcsR0FBRyxnQ0FBZ0MsQ0FBQztnQkFFM0MsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLEdBQUcsSUFBSSw2QkFBNkIsR0FBRyxHQUFHLENBQUMsSUFBSTswQkFDekMsOEJBQThCLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtvQkFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBS2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO29CQUNsRCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsS0FBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTs7SUFsRUQsQ0FBQztJQW1FTCx3QkFBQztBQUFELENBQUMsQUF6RUQsQ0FBZ0MsVUFBVSxHQXlFekM7QUFDRDtJQUErQixvQ0FBVTtJQUVyQywwQkFBb0IsSUFBWTtRQUFoQyxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1FBRm1CLFVBQUksR0FBSixJQUFJLENBQVE7UUFPaEMsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRS9DLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsdUZBQXVGLENBQUMsQ0FBQztZQUU1SCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBRXhELElBQUksbUJBQW1CLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsRUFDckYsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBRTVFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQ3ZELENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUc7WUFFWixJQUFJLFFBQVEsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25ELElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFM0QsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQThDLGVBQWUsRUFBRTtvQkFDcEUsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE9BQU8sRUFBRSxZQUFZO2lCQUN4QixFQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxJQUFJLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELDJCQUFxQixHQUFHLFVBQUMsR0FBMEI7WUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUMsSUFBSSxVQUFVLENBQUMsa0RBQWtELENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hGLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDWixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQTs7SUEvQ0QsQ0FBQztJQWdETCx1QkFBQztBQUFELENBQUMsQUFwREQsQ0FBK0IsVUFBVSxHQW9EeEM7QUFDRDtJQUFnQyxxQ0FBVTtJQUV0QztRQUFBLFlBQ0ksa0JBQU0sbUJBQW1CLENBQUMsU0FDN0I7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFdkQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDekIsaUJBQWlCLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ25DLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsd0JBQXdCO2lCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksb0JBQW9CLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQVNwQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtvQkFDNUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUM7b0JBQzNDLE1BQU0sRUFBRSxNQUFNO29CQUNkLE1BQU0sRUFBRSxPQUFPO2lCQUNsQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFHYixVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQzVCLE9BQU8sRUFBRSxzQkFBc0I7aUJBQ2xDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBRUQsVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO2dCQUM5QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDakMsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ25CLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBR2IsVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO2dCQUM5QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzVCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixNQUFNLEVBQUUsYUFBYTthQUN4QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO2dCQUMxQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQzNCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixTQUFTLEVBQUUscUJBQXFCO2dCQUNoQyxXQUFXLEVBQUUsT0FBTzthQUN2QixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRWYsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQ3hDLEVBQUUsa0NBQWtDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFOUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDNUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1FBQ3pFLENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUc7WUFDYixJQUFJLEdBQUcsR0FBWSxLQUFLLENBQUM7WUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDcEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUc7WUFFWixJQUFJLFVBQVUsR0FBRyxVQUFDLFdBQVc7Z0JBRXpCLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUM7Z0JBTTlFLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxDQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFOUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDZCxHQUFHLEVBQUUsYUFBYSxHQUFHLFFBQVE7b0JBQzdCLElBQUksRUFBRSxJQUFJO29CQUNWLEtBQUssRUFBRSxLQUFLO29CQUNaLFdBQVcsRUFBRSxLQUFLO29CQUNsQixXQUFXLEVBQUUsS0FBSztvQkFDbEIsSUFBSSxFQUFFLE1BQU07aUJBQ2YsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ04sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNOLENBQUMsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM5QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsSUFBSSxVQUFVLENBQUMsZUFBZSxFQUMzQiw2REFBNkQsRUFDN0QsbUJBQW1CLEVBRW5CO29CQUNJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsQ0FBQyxFQUVEO29CQUNJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFFSCxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNwRyxDQUFDLENBQUE7O0lBdElELENBQUM7SUF1SUwsd0JBQUM7QUFBRCxDQUFDLEFBM0lELENBQWdDLFVBQVUsR0EySXpDO0FBQ0Q7SUFBd0MsNkNBQVU7SUFFOUM7UUFBQSxZQUNJLGtCQUFNLDJCQUEyQixDQUFDLFNBQ3JDO1FBRUQsY0FBUSxHQUFhLElBQUksQ0FBQztRQUMxQix5QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFDckMsaUJBQVcsR0FBWSxLQUFLLENBQUM7UUFFN0IsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRXZELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNuQyxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLHdCQUF3QjtpQkFDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxhQUFhLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFFOUQsSUFBSSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDekMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3JDLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVQLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO2dCQUMxQixRQUFRLEVBQUUsYUFBYSxHQUFHLFFBQVE7Z0JBQ2xDLGtCQUFrQixFQUFFLEtBQUs7Z0JBRXpCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRVAsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztRQUNoRixDQUFDLENBQUE7UUFFRCx1QkFBaUIsR0FBRztZQUVoQixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsSUFBSSxNQUFNLEdBQVc7Z0JBQ2pCLEdBQUcsRUFBRSxhQUFhLEdBQUcsUUFBUTtnQkFFN0IsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxFQUFFO2dCQUluQixjQUFjLEVBQUUsS0FBSztnQkFDckIsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLGtCQUFrQixFQUFFLGtDQUFrQztnQkFDdEQsb0JBQW9CLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7Z0JBVzNELElBQUksRUFBRTtvQkFDRixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3BCLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDekUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7b0JBQ2hELENBQUM7b0JBRUQsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUM7d0JBRTdDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDNUIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUU7d0JBQ2pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7d0JBQ25CLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVE7d0JBQzNDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BELFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxVQUFTLElBQUk7d0JBQ2xDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDckIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQzthQUNKLENBQUM7WUFFSSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUE7UUFFRCxvQkFBYyxHQUFHLFVBQUMsV0FBZ0I7WUFDOUIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLEtBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzVDLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFLbkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsbUJBQW1CLElBQUksS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckQsS0FBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztnQkFDaEMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxlQUFlLEVBQzNCLDZEQUE2RCxFQUM3RCxtQkFBbUIsRUFFbkI7b0JBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLENBQUMsRUFFRDtvQkFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRztZQUNiLElBQUksR0FBRyxHQUFZLEtBQUssQ0FBQztZQUN6QixHQUFHLENBQUMsQ0FBYSxVQUFhLEVBQWIsS0FBQSxLQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhO2dCQUF6QixJQUFJLElBQUksU0FBQTtnQkFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQzthQUNKO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHLFVBQUMsV0FBZ0I7WUFDbkMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUN0QyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVDLENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDRixDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFaEcsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFBOztJQTNKRCxDQUFDO0lBNEpMLGdDQUFDO0FBQUQsQ0FBQyxBQWhLRCxDQUF3QyxVQUFVLEdBZ0tqRDtBQUNEO0lBQStCLG9DQUFVO0lBRXJDO1FBQUEsWUFDSSxrQkFBTSxrQkFBa0IsQ0FBQyxTQUM1QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUV2RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixpQkFBaUIsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDbkMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSx3QkFBd0I7aUJBQ3BDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7WUFDOUIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFFMUIsSUFBSSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2hGLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQ3BDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUV2QixJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM1RixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRXBFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxvQkFBb0IsR0FBRyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7UUFDNUYsQ0FBQyxDQUFBO1FBRUQsbUJBQWEsR0FBRztZQUNaLElBQUksU0FBUyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7WUFHbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsSUFBSSxDQUE4QyxlQUFlLEVBQUU7b0JBQ3BFLFFBQVEsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ2xDLFdBQVcsRUFBRSxTQUFTO2lCQUN6QixFQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsMkJBQXFCLEdBQUcsVUFBQyxHQUEwQjtZQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFHL0MsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDcEcsQ0FBQyxDQUFBOztJQXZERCxDQUFDO0lBd0RMLHVCQUFDO0FBQUQsQ0FBQyxBQTVERCxDQUErQixVQUFVLEdBNER4QztBQUNEO0lBQTBCLCtCQUFVO0lBT2hDLHFCQUFvQixRQUFpQixFQUFVLFdBQXFCO1FBQXBFLFlBQ0ksa0JBQU0sYUFBYSxDQUFDLFNBUXZCO1FBVG1CLGNBQVEsR0FBUixRQUFRLENBQVM7UUFBVSxpQkFBVyxHQUFYLFdBQVcsQ0FBVTtRQUpwRSxzQkFBZ0IsR0FBUSxFQUFFLENBQUM7UUFDM0IsaUJBQVcsR0FBcUIsSUFBSSxLQUFLLEVBQWEsQ0FBQztRQWlCdkQsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxQyxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ3pGLElBQUksaUJBQWlCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNyRyxJQUFJLHFCQUFxQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHVCQUF1QixFQUMzRSxLQUFJLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNqRyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMzRyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFFaEcsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsR0FBRyxpQkFBaUIsR0FBRyxxQkFBcUIsR0FBRyxnQkFBZ0I7a0JBQ2hILGtCQUFrQixHQUFHLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBR3hELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFFakIsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFFN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDekIsbUJBQW1CLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JDLEVBQUUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsd0JBQXdCO2lCQUNwQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsbUJBQW1CLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JDLEVBQUUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQ3RDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDbkIsRUFBRSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUM7Z0JBRXpDLEtBQUssRUFBRSwrQkFBK0IsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyw2REFBNkQ7Z0JBQ3RJLEtBQUssRUFBRSxxQkFBcUI7YUFFL0IsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUVqQixNQUFNLENBQUMsTUFBTSxHQUFHLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztRQUNwRCxDQUFDLENBQUE7UUFNRCx3QkFBa0IsR0FBRztZQUVqQixJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFFN0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUdoQixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1lBQzNCLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQztZQUcxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUd0QyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbEcsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQU1uQixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFVBQVMsS0FBSyxFQUFFLElBQUk7b0JBS3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLENBQUM7b0JBQ1gsQ0FBQztvQkFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRTdFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV0RCxJQUFJLFNBQVMsR0FBYyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUVyRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDakMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUVmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YsS0FBSyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDakQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixLQUFLLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFFRCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3hCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCOzhCQUM5Riw0QkFBNEIsQ0FBQztxQkFFdEMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxJQUFJLENBQUMsQ0FBQztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBRWpDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUUxQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3hCLElBQUksRUFBRSxVQUFVO3dCQUNoQixPQUFPLEVBQUUsZ0JBQWdCO3dCQUN6QixNQUFNLEVBQUUsTUFBTTtxQkFDakIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRWIsU0FBUyxDQUFDLElBQUksQ0FBQzt3QkFDWCxFQUFFLEVBQUUsVUFBVTt3QkFDZCxHQUFHLEVBQUUsRUFBRTtxQkFDVixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO3dCQUNyQyxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7d0JBQzlCLE9BQU8sRUFBRSxlQUFlO3FCQUMzQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFYixNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ25FLENBQUM7WUFDTCxDQUFDO1lBYUQsSUFBSSxTQUFTLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQ3BDO2dCQUNJLFNBQVMsRUFBRSxPQUFPO2FBQ3JCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFHZixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUvRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3hDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDcEQsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCO2dCQUMvQix1SkFBdUo7O29CQUV2SixFQUFFLENBQUM7WUFFUCxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBTzVDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRWpGLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUU3RSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUE7UUFFRCx3QkFBa0IsR0FBRztRQUtyQixDQUFDLENBQUE7UUFFRCxpQkFBVyxHQUFHO1lBQ1YsS0FBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksZUFBZSxDQUFDLEtBQUksQ0FBQyxDQUFDO1lBQ3JELEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFFRCxxQkFBZSxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxRQUFRLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDeEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLGFBQWEsRUFBRSxFQUFFO2FBQ3BCLENBQUM7WUFDRixJQUFJLENBQUMsSUFBSSxDQUE0QyxjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUksQ0FBQyx1QkFBdUIsRUFBRSxLQUFJLENBQUMsQ0FBQztRQUN2SCxDQUFDLENBQUE7UUFFRCw2QkFBdUIsR0FBRyxVQUFDLEdBQXlCO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELDBCQUFvQixHQUFHLFVBQUMsR0FBUTtZQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFLeEIsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLE9BQWU7WUFDN0IsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUVuRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUd6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDdEIsQ0FBQztZQVFELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXJCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUtELG9CQUFjLEdBQUcsVUFBQyxRQUFnQjtZQUM5QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBdUIsR0FBRyxRQUFRLEVBQUUsY0FBYyxFQUFFO2dCQUNsRixJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELDZCQUF1QixHQUFHLFVBQUMsUUFBZ0I7WUFFdkMsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQWdELGdCQUFnQixFQUFFO2dCQUN2RSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQixVQUFVLEVBQUUsUUFBUTthQUN2QixFQUFFLFVBQVMsR0FBMkI7Z0JBQ25DLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFRCw0QkFBc0IsR0FBRyxVQUFDLEdBQVEsRUFBRSxnQkFBcUI7WUFFckQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBTTVDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUdwRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFFeEIsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUcsVUFBQyxPQUFlO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztZQUNMLENBQUM7WUFHRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsT0FBTyxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqRSxLQUFLLENBQUM7b0JBQ1YsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixLQUFLLENBQUM7b0JBQ1YsQ0FBQztnQkFDTCxDQUFDO2dCQUNELE9BQU8sRUFBRSxDQUFDO1lBQ2QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELGNBQVEsR0FBRztZQUtQLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRzVCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixDQUFDO1lBSUQsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNqQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsaUJBQVcsR0FBRyxVQUFDLFdBQW9CO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDZixXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsQ0FBQztZQU1ELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTO2dCQUNqRCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDO1lBQzVDLENBQUM7WUFFRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsSUFBSSxDQUF3QyxZQUFZLEVBQUU7b0JBQzNELFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7b0JBQ25DLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSTtvQkFDeEMsYUFBYSxFQUFFLFdBQVc7b0JBQzFCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQWlCO2lCQUNoRSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBOEMsZUFBZSxFQUFFO29CQUNwRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO29CQUNqQyxhQUFhLEVBQUUsV0FBVztvQkFDMUIsVUFBVSxFQUFFLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsR0FBRyxpQkFBaUI7b0JBQzdELGFBQWEsRUFBRSxLQUFJLENBQUMsV0FBVztpQkFDbEMsRUFBRSxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHNCQUFnQixHQUFHO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBR2hDLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztZQUN4QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFFaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQVMsS0FBYSxFQUFFLElBQVM7Z0JBRXRELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBRzFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDN0IsTUFBTSxDQUFDO2dCQUVYLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBRXhFLElBQUksT0FBTyxDQUFDO29CQUVaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7NEJBQ1IsTUFBTSxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUN6RCxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNoQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMvQyxDQUFDO29CQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUM7d0JBQ3BGLGNBQWMsQ0FBQyxJQUFJLENBQUM7NEJBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7NEJBQzFCLE9BQU8sRUFBRSxPQUFPO3lCQUNuQixDQUFDLENBQUM7b0JBQ1AsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEQsQ0FBQztnQkFDTCxDQUFDO2dCQUVELElBQUksQ0FBQyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUVwRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7b0JBRWxCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO3dCQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFFbEUsSUFBSSxPQUFPLENBQUM7d0JBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQ0FDUixNQUFNLDRDQUE0QyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7NEJBQ3BFLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBRWhDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2xELENBQUM7d0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQzt3QkFDOUUsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDM0IsQ0FBQyxDQUFDLENBQUM7b0JBRUgsY0FBYyxDQUFDLElBQUksQ0FBQzt3QkFDaEIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO3dCQUNqQixRQUFRLEVBQUUsUUFBUTtxQkFDckIsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFFTCxDQUFDLENBQUMsQ0FBQztZQUdILEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxRQUFRLEdBQUc7b0JBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDeEIsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLGdCQUFnQixFQUFFLElBQUksQ0FBQywyQkFBMkI7aUJBQ3JELENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxJQUFJLENBQW9DLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTtvQkFDNUYsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtpQkFDNUIsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUM7WUFDN0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNyRCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQseUJBQW1CLEdBQUcsVUFBQyxTQUFvQjtZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVM7a0JBQzdGLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUVoQixTQUFTLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUV4QixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFaEQsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLFVBQVUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO2dCQUMvQixVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBRS9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBRS9DLElBQUksT0FBTyxHQUFZLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRWpDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO3dCQUNuQyxJQUFJLEVBQUUsRUFBRTt3QkFDUixVQUFVLEVBQUUsVUFBVTt3QkFDdEIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRSxVQUFVO3FCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbkMsSUFBSSxFQUFFLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsT0FBTyxFQUFFLFVBQVU7cUJBQ3RCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUN4QixPQUFPLEVBQUUsc0JBQXNCO2FBQ2xDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFWCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsMEJBQW9CLEdBQUcsVUFBQyxTQUFvQixFQUFFLFNBQWM7WUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWhFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUVmLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3ZFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pFLElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ3hDLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSztrQkFDeEcsWUFBWSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVuQyxJQUFJLGVBQWUsR0FBVyxFQUFFLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ2xDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtvQkFDbEIsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLFVBQVUsRUFBRSxVQUFVO29CQUN0QixPQUFPLEVBQUUsS0FBSztvQkFDZCxPQUFPLEVBQUUsVUFBVTtpQkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGVBQWUsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxVQUFVLEdBQUcsU0FBUyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFMUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzdDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMxQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO3dCQUNsQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUU7d0JBQ2xCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRSxVQUFVO3FCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3ZCLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTt3QkFDbEIsT0FBTyxFQUFFLGdCQUFnQjt3QkFDekIsTUFBTSxFQUFFLE1BQU07cUJBQ2pCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUViLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQ1gsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFO3dCQUNoQixHQUFHLEVBQUUsVUFBVTtxQkFDbEIsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLE9BQU8sRUFBRSxrREFBa0Q7YUFDOUQsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUVwQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDNUIsT0FBTyxFQUFFLGtEQUFrRDthQUM5RCxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRVYsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDNUIsQ0FBQyxDQUFBO1FBRUQsK0JBQXlCLEdBQUc7WUFHeEIsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRzNDLElBQUksU0FBUyxHQUFjLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDckQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFFWixJQUFJLFlBQVksR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQzt3QkFNN0MsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ3RELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQ2QsSUFBSSxPQUFPLEdBQVksV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7NEJBQ2hELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0NBRVYsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUk3QyxNQUFNLENBQUM7NEJBQ1gsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7b0JBQ0QsSUFBSSxDQUFDLENBQUM7d0JBQ0YsTUFBTSw4QkFBOEIsR0FBRyxFQUFFLENBQUM7b0JBQzlDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsa0JBQVksR0FBRztZQUNYLElBQUksU0FBUyxHQUFhLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxJQUFJLENBQXNDLFdBQVcsRUFBRTtnQkFDeEQsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDMUIsYUFBYSxFQUFFLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDeEQsV0FBVyxFQUFFLElBQUk7YUFDcEIsRUFBRSxLQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFRCwwQkFBb0IsR0FBRyxVQUFDLEdBQXNCO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2hDLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BELENBQUM7UUFDTCxDQUFDLENBQUE7UUFwb0JHLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEtBQUssRUFBYSxDQUFDOztJQUM5QyxDQUFDO0lBbW9CTCxrQkFBQztBQUFELENBQUMsQUFucEJELENBQTBCLFVBQVUsR0FtcEJuQztBQUtEO0lBQThCLG1DQUFVO0lBRXBDLHlCQUFvQixXQUFnQjtRQUFwQyxZQUNJLGtCQUFNLGlCQUFpQixDQUFDLFNBQzNCO1FBRm1CLGlCQUFXLEdBQVgsV0FBVyxDQUFLO1FBT3BDLFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVuRCxJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDckcsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBRW5GLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRWhGLElBQUksbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLG1CQUFtQixJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO3NCQUNqRSx5Q0FBeUMsQ0FBQztZQUNwRCxDQUFDO1lBRUQsbUJBQW1CLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsR0FBRyxVQUFVLENBQUM7WUFFdkYsTUFBTSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBRUQsMEJBQW9CLEdBQUc7WUFDbkIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBR2YsQ0FBQztnQkFDRyxJQUFJLGVBQWUsR0FBRyw0QkFBNEIsQ0FBQztnQkFFbkQsS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ2xDLE1BQU0sRUFBRSxlQUFlO29CQUN2QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQzlCLGFBQWEsRUFBRSxxQkFBcUI7b0JBQ3BDLE9BQU8sRUFBRSxNQUFNO2lCQUNsQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQixDQUFDO1lBR0QsQ0FBQztnQkFDRyxJQUFJLGdCQUFnQixHQUFHLDZCQUE2QixDQUFDO2dCQUVyRCxLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDbEMsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQy9CLGFBQWEsRUFBRSxxQkFBcUI7b0JBQ3BDLE9BQU8sRUFBRSxPQUFPO2lCQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQixDQUFDO1lBR0QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQTtRQUVELGtCQUFZLEdBQUc7WUFDWCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1lBRWpGLElBQUksUUFBUSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3hCLFlBQVksRUFBRSxnQkFBZ0I7Z0JBQzlCLGFBQWEsRUFBRSxpQkFBaUI7YUFDbkMsQ0FBQztZQUNGLElBQUksQ0FBQyxJQUFJLENBQTRDLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSSxDQUFDLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQ3BILENBQUMsQ0FBQTtRQUVELDBCQUFvQixHQUFHLFVBQUMsR0FBeUI7WUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUUxQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBS3hCLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQyxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUE7O0lBcEZELENBQUM7SUFxRkwsc0JBQUM7QUFBRCxDQUFDLEFBekZELENBQThCLFVBQVUsR0F5RnZDO0FBQ0Q7SUFBK0Isb0NBQVU7SUFFckM7UUFBQSxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBRXJELElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUMvRSxJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxLQUFJLENBQUMsaUJBQWlCLEVBQzdGLEtBQUksQ0FBQyxDQUFDO1lBQ1YsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUNoRixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRW5FLE1BQU0sQ0FBQyxNQUFNLEdBQUcsMkVBQTJFLEdBQUcsWUFBWTtrQkFDcEcsU0FBUyxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVELHVCQUFpQixHQUFHO1lBQ2hCLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFLRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBNEMsY0FBYyxFQUFFO2dCQUNqRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUM5QixXQUFXLEVBQUUsVUFBVTtnQkFDdkIsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsb0JBQW9CLENBQUM7Z0JBQ3BFLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELCtCQUF5QixHQUFHLFVBQUMsR0FBeUI7WUFDbEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDLENBQUE7O0lBMUNELENBQUM7SUEyQ0wsdUJBQUM7QUFBRCxDQUFDLEFBL0NELENBQStCLFVBQVUsR0ErQ3hDO0FBQ0Q7SUFBeUIsOEJBQVU7SUFFL0I7UUFBQSxZQUNJLGtCQUFNLFlBQVksQ0FBQyxTQUN0QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFN0MsSUFBSSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLDJCQUEyQixFQUN4RixLQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDcEMsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxpQkFBaUIsRUFDdkcsS0FBSSxDQUFDLENBQUM7WUFDVixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBRXJFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsR0FBRyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUVoRyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztZQUNwQyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUV0QyxJQUFJLG1CQUFtQixHQUFHLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsVUFBVTtnQkFDaEYsaURBQWlELEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxNQUFNLEdBQUcsdURBQXVEO2tCQUN6SSxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsVUFBVSxDQUFDO1lBRXhELE1BQU0sQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO1FBQ3BELENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUE7UUFLRCxZQUFNLEdBQUc7WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLElBQUksQ0FBc0QsbUJBQW1CLEVBQUU7Z0JBQ2hGLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzlCLFlBQVksRUFBRSxJQUFJO2dCQUNsQixlQUFlLEVBQUUsSUFBSTthQUN4QixFQUFFLEtBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFTRCwrQkFBeUIsR0FBRyxVQUFDLEdBQThCO1lBQ3ZELEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFLRCx1QkFBaUIsR0FBRyxVQUFDLEdBQThCO1lBQy9DLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUVoQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsUUFBUTtnQkFDM0MsSUFBSSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztnQkFDeEQsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUN0QixPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLGlCQUFpQixHQUFHO2dCQUNwQixTQUFTLEVBQUUseUJBQXlCLEdBQUcsS0FBSSxDQUFDLElBQUksR0FBRyw4QkFBOEI7Z0JBQ2pGLE1BQU0sRUFBRSx1QkFBdUI7Z0JBQy9CLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2FBQ3pDLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQzdDLENBQUM7WUFHRCxJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbkUsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO2dCQUN4QixLQUFLLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzthQUMxQyxFQUFFLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXJELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQTtRQUVELDZCQUF1QixHQUFHO1lBT3RCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUNoQixVQUFVLENBQUM7Z0JBQ1AsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztnQkFFN0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBRXhCLElBQUksQ0FBQyxJQUFJLENBQTRDLGNBQWMsRUFBRTtvQkFDakUsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDOUIsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLFdBQVcsRUFBRSxJQUFJO29CQUNqQixjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO2lCQUN4RCxDQUFDLENBQUM7WUFFUCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUE7UUFFRCxxQkFBZSxHQUFHLFVBQUMsU0FBaUIsRUFBRSxTQUFpQjtZQUluRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsSUFBSSxDQUFrRCxpQkFBaUIsRUFBRTtnQkFDMUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDOUIsV0FBVyxFQUFFLFNBQVM7Z0JBQ3RCLFdBQVcsRUFBRSxTQUFTO2FBQ3pCLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUVELDZCQUF1QixHQUFHLFVBQUMsR0FBNEI7WUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBc0QsbUJBQW1CLEVBQUU7Z0JBQ2hGLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUk7Z0JBQ2hDLFlBQVksRUFBRSxJQUFJO2dCQUNsQixlQUFlLEVBQUUsSUFBSTthQUN4QixFQUFFLEtBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFFRCx5QkFBbUIsR0FBRyxVQUFDLFNBQWMsRUFBRSxRQUFhO1lBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsU0FBUztnQkFFakQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQzNELHlCQUF5QixHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLEdBQUcsU0FBUyxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYTtzQkFDMUcsS0FBSyxDQUFDLENBQUM7Z0JBRWIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUV0RCxHQUFHLElBQUksS0FBSyxHQUFHLFNBQVMsR0FBRyx3QkFBd0IsR0FBRyxTQUFTLENBQUMsYUFBYSxHQUFHLG9CQUFvQixDQUFDO2dCQUVyRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxpQkFBaUI7aUJBQzdCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCx5QkFBbUIsR0FBRztZQUNsQixDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUVELHVCQUFpQixHQUFHO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUt2QyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQU94QixJQUFJLENBQUMsSUFBSSxDQUE0QyxjQUFjLEVBQUU7Z0JBQ2pFLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzlCLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUE7O0lBaExELENBQUM7SUFpTEwsaUJBQUM7QUFBRCxDQUFDLEFBckxELENBQXlCLFVBQVUsR0FxTGxDO0FBQ0Q7SUFBNEIsaUNBQVU7SUFDbEM7UUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUNoRixJQUFJLGtCQUFrQixHQUFHLCtCQUErQixHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxTQUFTLENBQUM7WUFFckcsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBRTdGLElBQUksZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNqRyxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3pFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsTUFBTSxHQUFHLGtCQUFrQixHQUFHLGtCQUFrQixHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7UUFDdkYsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUV2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxJQUFJLFVBQVUsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLENBQUMsSUFBSSxVQUFVLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBR0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVqRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFbkUsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQXdDLFlBQVksRUFBRTtnQkFDM0QsUUFBUSxFQUFFLGFBQWEsQ0FBQyxFQUFFO2dCQUMxQixTQUFTLEVBQUUsT0FBTzthQUNyQixFQUFFLFVBQVMsR0FBdUI7Z0JBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUVELHdCQUFrQixHQUFHLFVBQUMsR0FBdUIsRUFBRSxnQkFBeUI7WUFDcEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO1lBRUwsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7O0lBbEVELENBQUM7SUFtRUwsb0JBQUM7QUFBRCxDQUFDLEFBdEVELENBQTRCLFVBQVUsR0FzRXJDO0FBR0Q7SUFBNkIsa0NBQVU7SUFFbkMsd0JBQW9CLFNBQWlCLEVBQVUsT0FBZSxFQUFVLGdCQUF3QjtRQUFoRyxZQUNJLGtCQUFNLGdCQUFnQixDQUFDLFNBRzFCO1FBSm1CLGVBQVMsR0FBVCxTQUFTLENBQVE7UUFBVSxhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsc0JBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1FBb0JoRyxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTdDLElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLHVCQUFxQixLQUFJLENBQUMsT0FBUyxDQUFDO1lBQzlDLENBQUM7WUFFRCxJQUFJLFFBQVEsR0FBaUIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUdoRixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNqQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUtuQixJQUFJLGFBQWEsR0FBUTtnQkFDckIsS0FBSyxFQUFFLEtBQUksQ0FBQyxTQUFTO2dCQUNyQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxpRkFBaUY7Z0JBQzFGLGNBQWMsRUFBRSwyQkFBeUIsS0FBSSxDQUFDLE9BQU8sY0FBVztnQkFDaEUsV0FBVyxFQUFFLHdCQUFzQixLQUFJLENBQUMsT0FBTyxjQUFXO2dCQUMxRCxVQUFVLEVBQUUsVUFBVTtnQkFDdEIsU0FBUyxFQUFFLE1BQU07YUFDcEIsQ0FBQztZQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBR2hELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQzlDLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsd0JBQXNCLEtBQUksQ0FBQyxPQUFPLGNBQVc7Z0JBQ3hELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2pELFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsdUJBQXFCLEtBQUksQ0FBQyxPQUFPLGNBQVc7Z0JBQ3ZELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1lBR3JGLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQy9DLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUscUJBQXFCO2dCQUNoQyxPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLEVBQ0csUUFBUSxDQUFDLENBQUM7WUFFZCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDM0MsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxxQkFBcUI7Z0JBQ2hDLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUVaLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO2dCQUMzQyxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLG1CQUFtQjtnQkFDOUIsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixFQUNHLElBQUksQ0FBQyxDQUFDO1lBRVYsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQztZQUdqRyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDekMsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO2dCQUN4QyxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLGlCQUFpQjtnQkFDNUIsT0FBTyxFQUFFLFlBQVk7YUFDeEIsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUdaLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV2RixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUVqRixNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLEdBQUcsYUFBYSxHQUFHLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDdEYsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQsY0FBUSxHQUFHO1lBQ1AsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7UUFDUCxDQUFDLENBQUE7UUF4SEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBb0MsZ0JBQWtCLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7O0lBQ2hELENBQUM7SUFHTSwrQkFBTSxHQUFiO1FBQ0ksaUJBQU0sTUFBTSxXQUFFLENBQUM7UUFDZixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEIsQ0FBQztJQUNMLENBQUM7SUE0R0wscUJBQUM7QUFBRCxDQUFDLEFBN0hELENBQTZCLFVBQVUsR0E2SHRDO0FBQ0Q7SUFBNEIsaUNBQVU7SUFLbEM7UUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVoRCxJQUFJLHNCQUFzQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlILElBQUkscUJBQXFCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDdkcsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDaEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixHQUFHLHFCQUFxQixHQUFHLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRTNILElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFFaEIsT0FBTyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3RSxPQUFPLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFdkYsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRSxTQUFTO2FBQ3JCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFWixJQUFJLFdBQVcsR0FBVyxPQUFPLENBQUM7WUFFbEMsSUFBSSxjQUFjLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLE9BQU8sRUFBRSxlQUFlO2FBQzNCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFWCxNQUFNLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBc0JELHNCQUFnQixHQUFHO1lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQTtRQUVELHFCQUFlLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFBO1FBRUQsa0JBQVksR0FBRztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQTtRQUVELGdCQUFVLEdBQUcsVUFBQyxPQUFZO1lBQ3RCLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxLQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxFQUFFLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFDRCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILElBQUksSUFBSSxHQUFhLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxlQUFlLEdBQVksTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUM1RCxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUNsQixLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTs7SUFwR0QsQ0FBQztJQWtDRCxvQ0FBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLGlCQUEwQjtRQUNuRixJQUFJLE9BQU8sR0FBVztZQUNsQixVQUFVLEVBQUUsUUFBUTtZQUNwQixTQUFTLEVBQUUsT0FBTztTQUNyQixDQUFDO1FBRUYsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFakQsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzlCLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDckIsT0FBTyxFQUFFLFVBQVUsR0FBRyxDQUFDLGlCQUFpQixHQUFHLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztZQUNwRSxJQUFJLEVBQUUsS0FBSztZQUNYLFNBQVMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUNsRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQWlETCxvQkFBQztBQUFELENBQUMsQUE1R0QsQ0FBNEIsVUFBVSxHQTRHckM7QUFDRDtJQUFBO1FBRUksVUFBSyxHQUFXLG9CQUFvQixDQUFDO1FBQ3JDLFVBQUssR0FBVyxlQUFlLENBQUM7UUFDaEMsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixVQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxtREFBbUQsQ0FBQztZQUNqRSxJQUFJLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQztZQUN2RCxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxDQUFDLENBQUM7UUFFRixTQUFJLEdBQUc7WUFDSCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQUNEO0lBQUE7UUFFSSxVQUFLLEdBQVcsc0JBQXNCLENBQUM7UUFDdkMsVUFBSyxHQUFXLGlCQUFpQixDQUFDO1FBQ2xDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFekIsVUFBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcscURBQXFELENBQUM7WUFDbkUsSUFBSSxXQUFXLEdBQUcsK0JBQStCLENBQUM7WUFDbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQsU0FBSSxHQUFHO1lBQ0gsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFFRCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBQb2x5bWVyO1xuZGVjbGFyZSB2YXIgRHJvcHpvbmU7XG5kZWNsYXJlIHZhciBhY2U7XG5kZWNsYXJlIHZhciBjb29raWVQcmVmaXg7XG5kZWNsYXJlIHZhciBwb3N0VGFyZ2V0VXJsO1xuZGVjbGFyZSB2YXIgcHJldHR5UHJpbnQ7XG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRTtcbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFX1NIT1JUO1xuXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XG4gICAgc2VsZWN0PzogYW55O1xufVxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkvanF1ZXJ5LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5pbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgcHJpbmNpcGFsTmFtZTogc3RyaW5nO1xuICAgIHByaXZpbGVnZXM6IFByaXZpbGVnZUluZm9bXTtcbn1cblxuaW50ZXJmYWNlIE5vZGVJbmZvIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcHJpbWFyeVR5cGVOYW1lOiBzdHJpbmc7XG4gICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgaGFzQ2hpbGRyZW46IGJvb2xlYW47XG4gICAgaGFzQmluYXJ5OiBib29sZWFuO1xuICAgIGJpbmFyeUlzSW1hZ2U6IGJvb2xlYW47XG4gICAgYmluVmVyOiBudW1iZXI7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW47XG4gICAgdWlkOiBzdHJpbmc7XG4gICAgY3JlYXRlZEJ5OiBzdHJpbmc7XG4gICAgbGFzdE1vZGlmaWVkOiBEYXRlO1xuICAgIGltZ0lkOiBzdHJpbmc7XG4gICAgb3duZXI6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgIHByaXZpbGVnZU5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFByb3BlcnR5SW5mbyB7XG4gICAgdHlwZTogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgYWJicmV2aWF0ZWQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZWZJbmZvIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHBhdGg6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgZWRpdE1vZGU6IGJvb2xlYW47XG4gICAgYWR2YW5jZWRNb2RlOiBib29sZWFuO1xuICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgaW1wb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICBleHBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgIGlnbm9yZVVybDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVxdWVzdCB7XG4gICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICBwYXNzQ29kZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ2xvc2VBY2NvdW50UmVxdWVzdCB7XG59XG5cbmludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xufVxuXG5pbnRlcmZhY2UgU2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgIHVybDogc3RyaW5nO1xuICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAvL25vZGVQYXRoOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgdXJsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgIGNyZWF0ZUF0VG9wOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXF1ZXN0IHtcbiAgICBub2RlSWRzOiBzdHJpbmdbXTtcbn1cblxuaW50ZXJmYWNlIERlbGV0ZVByb3BlcnR5UmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgcHJvcE5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRXhwb3J0UmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgdGFyZ2V0RmlsZU5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgaW5jbHVkZUFjbDogYm9vbGVhbjtcbiAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgR2V0U2VydmVySW5mb1JlcXVlc3Qge1xufVxuXG5pbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEltcG9ydFJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEluc2VydEJvb2tSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBib29rTmFtZTogc3RyaW5nO1xuICAgIHRydW5jYXRlZDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEluc2VydE5vZGVSZXF1ZXN0IHtcbiAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICBuZXdOb2RlTmFtZTogc3RyaW5nO1xuICAgIHR5cGVOYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBMb2dpblJlcXVlc3Qge1xuICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICB0ek9mZnNldDogbnVtYmVyO1xuICAgIGRzdDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIExvZ291dFJlcXVlc3Qge1xufVxuXG5pbnRlcmZhY2UgTW92ZU5vZGVzUmVxdWVzdCB7XG4gICAgdGFyZ2V0Tm9kZUlkOiBzdHJpbmc7XG4gICAgdGFyZ2V0Q2hpbGRJZDogc3RyaW5nO1xuICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xufVxuXG5pbnRlcmZhY2UgTm9kZVNlYXJjaFJlcXVlc3Qge1xuICAgIHNvcnREaXI6IHN0cmluZztcbiAgICBzb3J0RmllbGQ6IHN0cmluZztcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgc2VhcmNoUHJvcDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRmlsZVNlYXJjaFJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICByZWluZGV4OiBib29sZWFuXG59XG5cbmludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBwcmluY2lwYWw6IHN0cmluZztcbiAgICBwcml2aWxlZ2U6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBuZXdOYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBSZW5kZXJOb2RlUmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgdXBMZXZlbDogbnVtYmVyO1xuICAgIG9mZnNldDogbnVtYmVyO1xuICAgIHJlbmRlclBhcmVudElmTGVhZjogYm9vbGVhbjtcbiAgICBnb1RvTGFzdFBhZ2U6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgdXNlcjogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTYXZlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgICBwcm9wZXJ0eVZhbHVlOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCB7XG4gICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG59XG5cbmludGVyZmFjZSBPcGVuU3lzdGVtRmlsZVJlcXVlc3Qge1xuICAgIGZpbGVOYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICBwYXJlbnROb2RlSWQ6IHN0cmluZztcbiAgICBub2RlSWQ6IHN0cmluZztcbiAgICBzaWJsaW5nSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNpZ251cFJlcXVlc3Qge1xuICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIGNhcHRjaGE6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIG5vZGVCZWxvd0lkOiBzdHJpbmc7XG4gICAgZGVsaW1pdGVyOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVxdWVzdCB7XG4gICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgc291cmNlVXJsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBCcm93c2VGb2xkZXJSZXF1ZXN0IHtcbiAgICBub2RlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbn1cblxuaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG59XG5cbmludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB1c2VyOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBHZW5lcmF0ZVJTU1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbn1cblxuaW50ZXJmYWNlIFNldFBsYXllckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgbmV3Tm9kZTogTm9kZUluZm87XG59XG5cbmludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xufVxuXG5pbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbn1cblxuaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBub2RlSW5mbzogTm9kZUluZm87XG59XG5cbmludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBhY2xFbnRyaWVzOiBBY2Nlc3NDb250cm9sRW50cnlJbmZvW107XG4gICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIHNlcnZlckluZm86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG59XG5cbmludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgbm9kZUluZm86IE5vZGVJbmZvO1xufVxuXG5pbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBuZXdOb2RlOiBOb2RlSW5mbztcbn1cblxuaW50ZXJmYWNlIEluc2VydE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgbmV3Tm9kZTogTm9kZUluZm87XG59XG5cbmludGVyZmFjZSBMb2dpblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICByb290Tm9kZTogUmVmSW5mbztcbiAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgIGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBzdHJpbmc7XG4gICAgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xuICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgIGFsbG93RmlsZVN5c3RlbVNlYXJjaDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIExvZ291dFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbn1cblxuaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbn1cblxuaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbn1cblxuaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgc2VhcmNoUmVzdWx0Tm9kZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIG5ld0lkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBSZW5kZXJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgIGNoaWxkcmVuOiBOb2RlSW5mb1tdO1xuICAgIG9mZnNldE9mTm9kZUZvdW5kOiBudW1iZXI7XG5cbiAgICAvKiBob2xkcyB0cnVlIGlmIHdlIGhpdCB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkIG5vZGVzICovXG4gICAgZW5kUmVhY2hlZDogYm9vbGVhbjtcblxuICAgIGRpc3BsYXllZFBhcmVudDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBTYXZlTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBub2RlOiBOb2RlSW5mbztcbn1cblxuaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICBwcm9wZXJ0eVNhdmVkOiBQcm9wZXJ0eUluZm87XG59XG5cbmludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xufVxuXG5pbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBTaWdudXBSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG59XG5cbmludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xufVxuXG5pbnRlcmZhY2UgQnJvd3NlRm9sZGVyUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIGxpc3RpbmdKc29uOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBPYWtSZXNwb25zZUJhc2Uge1xuICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgbWVzc2FnZTogc3RyaW5nO1xufVxuXG5jbGFzcyBDb25zdGFudHMge1xyXG5cclxuICAgIEFOT046IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcbiAgICBDT09LSUVfTE9HSU5fVVNSOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luVXNyXCI7XHJcbiAgICBDT09LSUVfTE9HSU5fUFdEOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luUHdkXCI7XHJcbiAgICAvKlxyXG4gICAgICogbG9naW5TdGF0ZT1cIjBcIiBpZiB1c2VyIGxvZ2dlZCBvdXQgaW50ZW50aW9uYWxseS4gbG9naW5TdGF0ZT1cIjFcIiBpZiBsYXN0IGtub3duIHN0YXRlIG9mIHVzZXIgd2FzICdsb2dnZWQgaW4nXHJcbiAgICAgKi9cclxuICAgIENPT0tJRV9MT0dJTl9TVEFURTogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblN0YXRlXCI7XHJcbiAgICBCUjogXCI8ZGl2IGNsYXNzPSd2ZXJ0LXNwYWNlJz48L2Rpdj5cIjtcclxuICAgIElOU0VSVF9BVFRBQ0hNRU5UOiBzdHJpbmcgPSBcInt7aW5zZXJ0LWF0dGFjaG1lbnR9fVwiO1xyXG4gICAgTkVXX09OX1RPT0xCQVI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIElOU19PTl9UT09MQkFSOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBNT1ZFX1VQRE9XTl9PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyB3b3JrcywgYnV0IEknbSBub3Qgc3VyZSBJIHdhbnQgaXQgZm9yIEFMTCBlZGl0aW5nLiBTdGlsbCB0aGlua2luZyBhYm91dCBkZXNpZ24gaGVyZSwgYmVmb3JlIEkgdHVybiB0aGlzXHJcbiAgICAgKiBvbi5cclxuICAgICAqL1xyXG4gICAgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiBzaG93aW5nIHBhdGggb24gcm93cyBqdXN0IHdhc3RlcyBzcGFjZSBmb3Igb3JkaW5hcnkgdXNlcnMuIE5vdCByZWFsbHkgbmVlZGVkICovXHJcbiAgICBTSE9XX1BBVEhfT05fUk9XUzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBTSE9XX1BBVEhfSU5fRExHUzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgU0hPV19DTEVBUl9CVVRUT05fSU5fRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxubGV0IGNuc3Q6Q29uc3RhbnRzID0gbmV3IENvbnN0YW50cygpO1xyXG5cbi8qIFRoZXNlIGFyZSBDbGllbnQtc2lkZSBvbmx5IG1vZGVscywgYW5kIGFyZSBub3Qgc2VlbiBvbiB0aGUgc2VydmVyIHNpZGUgZXZlciAqL1xuXG4vKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuY2xhc3MgQWRTZWdtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgcHVibGljIGVuZFRpbWU6IG51bWJlcikge1xuICAgIH1cbn1cblxuY2xhc3MgUHJvcEVudHJ5IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHByb3BlcnR5OiBQcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgIHB1YmxpYyBtdWx0aTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIHJlYWRPbmx5OiBib29sZWFuLCAvL1xuICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICBwdWJsaWMgc3ViUHJvcHM6IFN1YlByb3BbXSkge1xuICAgIH1cbn1cblxuY2xhc3MgU3ViUHJvcCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyB2YWw6IHN0cmluZykge1xuICAgIH1cbn1cblxuY2xhc3MgVXRpbCB7XHJcblxyXG4gICAgbG9nQWpheDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgdGltZW91dE1lc3NhZ2VTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgb2ZmbGluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHdhaXRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcGdyc0RsZzogYW55ID0gbnVsbDtcclxuXG4gICAgZXNjYXBlUmVnRXhwID0gZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gXy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xuICAgIH1cblxuICAgIGVzY2FwZUZvckF0dHJpYiA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgcmV0dXJuIHV0aWwucmVwbGFjZUFsbChfLCBcIlxcXCJcIiwgXCImcXVvdDtcIik7XG4gICAgfVxuXG4gICAgdW5lbmNvZGVIdG1sID0gZnVuY3Rpb24oXykge1xuICAgICAgICBpZiAoIXV0aWwuY29udGFpbnMoXywgXCImXCIpKVxuICAgICAgICAgICAgcmV0dXJuIF87XG5cbiAgICAgICAgdmFyIHJldCA9IF87XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmYW1wOycsICcmJyk7XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmZ3Q7JywgJz4nKTtcbiAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgJyZsdDsnLCAnPCcpO1xuICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJnF1b3Q7JywgJ1wiJyk7XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmIzM5OycsIFwiJ1wiKTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHJlcGxhY2VBbGwgPSBmdW5jdGlvbihfLCBmaW5kLCByZXBsYWNlKSB7XG4gICAgICAgIHJldHVybiBfLnJlcGxhY2UobmV3IFJlZ0V4cCh1dGlsLmVzY2FwZVJlZ0V4cChmaW5kKSwgJ2cnKSwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgY29udGFpbnMgPSBmdW5jdGlvbihfLCBzdHIpIHtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihzdHIpICE9IC0xO1xuICAgIH1cblxyXG4gICAgc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKF8sIHN0cikge1xyXG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH1cclxuXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGggPSBmdW5jdGlvbihfLCBzdHIpIHtcbiAgICAgICAgaWYgKF8uc3RhcnRzV2l0aChzdHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF87XG4gICAgfVxuXHJcbiAgICBhcnJheUNsb25lID0gZnVuY3Rpb24oXzogYW55W10pIHtcclxuICAgICAgICByZXR1cm4gXy5zbGljZSgwKTtcclxuICAgIH07XHJcblxyXG4gICAgYXJyYXlJbmRleE9mSXRlbUJ5UHJvcCA9IGZ1bmN0aW9uKF86IGFueVtdLCBwcm9wTmFtZSwgcHJvcFZhbCkge1xyXG4gICAgICAgIHZhciBsZW4gPSBfLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChfW2ldW3Byb3BOYW1lXSA9PT0gcHJvcFZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBuZWVkIHRvIHRlc3QgYWxsIGNhbGxzIHRvIHRoaXMgbWV0aG9kIGJlY2F1c2UgaSBub3RpY2VkIGR1cmluZyBUeXBlU2NyaXB0IGNvbnZlcnNpb24gaSB3YXNuJ3QgZXZlbiByZXR1cm5pbmdcclxuICAgIGEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuICAgICovXHJcbiAgICBhcnJheU1vdmVJdGVtID0gZnVuY3Rpb24oXzogYW55W10sIGZyb21JbmRleCwgdG9JbmRleCkge1xyXG4gICAgICAgIF8uc3BsaWNlKHRvSW5kZXgsIDAsIF8uc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgc3RkVGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbihfOiBEYXRlKSB7XHJcbiAgICAgICAgdmFyIGphbiA9IG5ldyBEYXRlKF8uZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICAgICAgdmFyIGp1bCA9IG5ldyBEYXRlKF8uZ2V0RnVsbFllYXIoKSwgNiwgMSk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGphbi5nZXRUaW1lem9uZU9mZnNldCgpLCBqdWwuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRzdCA9IGZ1bmN0aW9uKF86IERhdGUpIHtcclxuICAgICAgICByZXR1cm4gXy5nZXRUaW1lem9uZU9mZnNldCgpIDwgVXRpbC5zdGRUaW1lem9uZU9mZnNldChfKTtcclxuICAgIH1cclxuXHJcbiAgICBpbmRleE9mT2JqZWN0ID0gZnVuY3Rpb24oXzogYW55W10sIG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgXy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoX1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy90aGlzIGJsb3dzIHRoZSBoZWxsIHVwLCBub3Qgc3VyZSB3aHkuXHJcbiAgICAvL1x0T2JqZWN0LnByb3RvdHlwZS50b0pzb24gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgIC8vXHR9O1xyXG5cclxuICAgIGFzc2VydE5vdE51bGwgPSBmdW5jdGlvbih2YXJOYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBldmFsKHZhck5hbWUpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcbiAgICAgKiBzZXNzaW9uIGlzIG9ubHkgYWxsb3dlZCBvbmUgY29uY3VycmVudCBjYWxsIGFuZCBzaW11bHRhbmVvdXMgY2FsbHMgd291bGQganVzdCBcInF1ZXVlIHVwXCIuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGRheWxpZ2h0U2F2aW5nc1RpbWU6IGJvb2xlYW4gPSAoVXRpbC5kc3QobmV3IERhdGUoKSkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgIHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGNhbWUgZnJvbSBoZXJlOlxyXG4gICAgICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuICAgICAqL1xyXG4gICAgZ2V0UGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZT86IGFueSwgdXJsPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgIGlmICghcmVzdWx0cylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcbiAgICAgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG4gICAgICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcbiAgICAgKi9cclxuICAgIGluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKTogYW55IHtcclxuICAgICAgICBjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG4gICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFByb2dyZXNzTW9uaXRvciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHNldEludGVydmFsKHV0aWwucHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvZ3Jlc3NJbnRlcnZhbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBpc1dhaXRpbmcgPSB1dGlsLmlzQWpheFdhaXRpbmcoKTtcclxuICAgICAgICBpZiAoaXNXYWl0aW5nKSB7XHJcbiAgICAgICAgICAgIHV0aWwud2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgaWYgKHV0aWwud2FpdENvdW50ZXIgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLnBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLnBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLnBncnNEbGcub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbC53YWl0Q291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLnBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwucGdyc0RsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgIHV0aWwucGdyc0RsZyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAganNvbiA9IGZ1bmN0aW9uIDxSZXF1ZXN0VHlwZSwgUmVzcG9uc2VUeXBlPihwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogUmVxdWVzdFR5cGUsIC8vXHJcbiAgICAgICAgY2FsbGJhY2s/OiAocmVzcG9uc2U6IFJlc3BvbnNlVHlwZSwgcGF5bG9hZD86IGFueSkgPT4gYW55LCBjYWxsYmFja1RoaXM/OiBhbnksIGNhbGxiYWNrUGF5bG9hZD86IGFueSkge1xyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUk9CQUJMRSBCVUc6IGpzb24gY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSArIFwiIHVzZWQgZ2xvYmFsICd3aW5kb3cnIGFzICd0aGlzJywgd2hpY2ggaXMgYWxtb3N0IG5ldmVyIGdvaW5nIHRvIGJlIGNvcnJlY3QuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgIHZhciBpcm9uUmVxdWVzdDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwub2ZmbGluZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvZmZsaW5lOiBpZ25vcmluZyBjYWxsIGZvciBcIiArIHBvc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHV0aWwubG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU09OLVBPU1RbZ2VuXTogW1wiICsgcG9zdE5hbWUgKyBcIl1cIiArIEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgIC8vIHZhciBpcm9uQWpheCA9IHRoaXMuJCQoXCIjbXlJcm9uQWpheFwiKTtcclxuICAgICAgICAgICAgLy9pcm9uQWpheCA9IFBvbHltZXIuZG9tKCg8X0hhc1Jvb3Q+KXdpbmRvdy5kb2N1bWVudC5yb290KS5xdWVyeVNlbGVjdG9yKFwiI2lyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgaXJvbkFqYXggPSB1dGlsLnBvbHlFbG1Ob2RlKFwiaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICBpcm9uQWpheC51cmwgPSBwb3N0VGFyZ2V0VXJsICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICBpcm9uQWpheC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpO1xyXG4gICAgICAgICAgICBpcm9uQWpheC5tZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgIC8vIHNwZWNpZnkgYW55IHVybCBwYXJhbXMgdGhpcyB3YXk6XHJcbiAgICAgICAgICAgIC8vIGlyb25BamF4LnBhcmFtcz0ne1wiYWx0XCI6XCJqc29uXCIsIFwicVwiOlwiY2hyb21lXCJ9JztcclxuXHJcbiAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgIC8qIFRoaXMgbm90IGEgcmVxdWlyZWQgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgLy8gaXJvbkFqYXgub25SZXNwb25zZSA9IFwidXRpbC5pcm9uQWpheFJlc3BvbnNlXCI7IC8vIG9uLXJlc3BvbnNlXHJcbiAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAvLyBwcm9wKVxyXG4gICAgICAgICAgICBpcm9uQWpheC5kZWJvdW5jZUR1cmF0aW9uID0gXCIzMDBcIjsgLy8gZGVib3VuY2UtZHVyYXRpb24gKGlzXHJcbiAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICB1dGlsLl9hamF4Q291bnRlcisrO1xyXG4gICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgIHV0aWwubG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBzdGFydGluZyByZXF1ZXN0OiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBOb3Rlc1xyXG4gICAgICAgICAqIDxwPlxyXG4gICAgICAgICAqIElmIHVzaW5nIHRoZW4gZnVuY3Rpb246IHByb21pc2UudGhlbihzdWNjZXNzRnVuY3Rpb24sIGZhaWxGdW5jdGlvbik7XHJcbiAgICAgICAgICogPHA+XHJcbiAgICAgICAgICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcbiAgICAgICAgICogbWV0aG9kcyBnZXR0aW5nIGNhbGxlZCB3aXRoIHRoZSBwYXJhbWV0ZXJzLiBCYXNpY2FsbHkgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvICdyZXNvbHZlJyBnZXQgZGlzdHJpYnV0ZWRcclxuICAgICAgICAgKiB0byBhbGwgdGhlIHdhaXRpbmcgbWV0aG9kcyBqdXN0IGxpa2UgYXMgaWYgdGhleSB3ZXJlIHN1YnNjcmliaW5nIGluIGEgcHViL3N1YiBtb2RlbC4gU28gdGhlICdwcm9taXNlJ1xyXG4gICAgICAgICAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuICAgICAgICAgKiA8cD5cclxuICAgICAgICAgKiBUaGUgcmVhc29uIHRvIHJldHVybiBhICdwcm9taXNlLnByb21pc2UoKScgbWV0aG9kIGlzIHNvIG5vIG90aGVyIGNvZGUgY2FuIGNhbGwgcmVzb2x2ZS9yZWplY3QgYnV0IGNhblxyXG4gICAgICAgICAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcbiAgICAgICAgICogPHA+XHJcbiAgICAgICAgICogZGVmZXJyZWQud2hlbihwcm9taXNlMSwgcHJvbWlzZTIpIGNyZWF0ZXMgYSBuZXcgcHJvbWlzZSB0aGF0IGJlY29tZXMgJ3Jlc29sdmVkJyBvbmx5IHdoZW4gYWxsIHByb21pc2VzXHJcbiAgICAgICAgICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcbiAgICAgICAgICogZmFpbGluZywgaXQgZmFpbHMgdGhpcyBcIkFORGVkXCIgb25lIGFsc28uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBTdWNjZXNzXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLl9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwucHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodXRpbC5sb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIEpTT04tUkVTVUxUOiBcIiArIHBvc3ROYW1lICsgXCJcXG4gICAgSlNPTi1SRVNVTFQtREFUQTogXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgSlNPTi5zdHJpbmdpZnkoaXJvblJlcXVlc3QucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBzaW1wbGVzdCB3YXkgdG8gZG8gdGhpcy4gV2UgaGF2ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgbWF5IG9yIG1heSBub3Qgc3BlY2lmeSBhICd0aGlzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgYWx3YXlzIGNhbGxzIHdpdGggdGhlICdyZXBvbnNlJyBwYXJhbSBhbmQgb3B0aW9uYWxseSBhIGNhbGxiYWNrUGF5bG9hZCBwYXJhbS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1BheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDYW4ndCB3ZSBqdXN0IGxldCBjYWxsYmFja1BheWxvYWQgYmUgdW5kZWZpbmVkLCBhbmQgY2FsbCB0aGUgYWJvdmUgY2FsbGJhY2sgbWV0aG9kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmQgbm90IGV2ZW4gaGF2ZSB0aGlzIGVsc2UgYmxvY2sgaGVyZSBhdCBhbGwgKGkuZS4gbm90IGV2ZW4gY2hlY2sgaWYgY2FsbGJhY2tQYXlsb2FkIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwvdW5kZWZpbmVkLCBidXQganVzdCB1c2UgaXQsIGFuZCBub3QgaGF2ZSB0aGlzIGlmIGJsb2NrPylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwiRmFpbGVkIGhhbmRsaW5nIHJlc3VsdCBvZjogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gSGFuZGxlIEZhaWxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5wcm9ncmVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiB1dGlsLmpzb25cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpcm9uUmVxdWVzdC5zdGF0dXMgPT0gXCI0MDNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgaW4gZGV0ZWN0ZWQgaW4gdXRpbC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwub2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXV0aWwudGltZW91dE1lc3NhZ2VTaG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC50aW1lb3V0TWVzc2FnZVNob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlc3Npb24gdGltZWQgb3V0LiBQYWdlIHdpbGwgcmVmcmVzaC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbXNnOiBzdHJpbmcgPSBcIlNlcnZlciByZXF1ZXN0IGZhaWxlZC5cXG5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJTdGF0dXM6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzVGV4dCArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiB0aGlzIGNhdGNoIGJsb2NrIHNob3VsZCBhbHNvIGZhaWwgc2lsZW50bHlcclxuICAgICAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAqIEknbSBqdXN0IHR1cm5pbmcgdGhpcyBvZmYgc2luY2UgaXRzJyBub3QgZGlzcGxheWluZyB0aGUgY29ycmVjdCBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbXNnICs9IFwiUmVzcG9uc2U6IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAvLyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLmV4Y2VwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaXJvblJlcXVlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nQW5kVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgIHRocm93IG1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nQW5kUmVUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZywgZXhjZXB0aW9uOiBhbnkpIHtcclxuICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBhamF4UmVhZHkgPSBmdW5jdGlvbihyZXF1ZXN0TmFtZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh1dGlsLl9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZ25vcmluZyByZXF1ZXN0czogXCIgKyByZXF1ZXN0TmFtZSArIFwiLiBBamF4IGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBamF4V2FpdGluZyA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB1dGlsLl9hamF4Q291bnRlciA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3QgYmUgYWN0dWFsIGpxdWVyeSBzZWxlY3RvcikgKi9cclxuICAgIGRlbGF5ZWRGb2N1cyA9IGZ1bmN0aW9uKGlkKTogdm9pZCB7XHJcbiAgICAgICAgLyogc28gdXNlciBzZWVzIHRoZSBmb2N1cyBmYXN0IHdlIHRyeSBhdCAuNSBzZWNvbmRzICovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAvKiB3ZSB0cnkgYWdhaW4gYSBmdWxsIHNlY29uZCBsYXRlci4gTm9ybWFsbHkgbm90IHJlcXVpcmVkLCBidXQgbmV2ZXIgdW5kZXNpcmFibGUgKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRm9jdXNpbmcgSUQ6IFwiK2lkKTtcclxuICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICB9LCAxMzAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogV2UgY291bGQgaGF2ZSBwdXQgdGhpcyBsb2dpYyBpbnNpZGUgdGhlIGpzb24gbWV0aG9kIGl0c2VsZiwgYnV0IEkgY2FuIGZvcnNlZSBjYXNlcyB3aGVyZSB3ZSBkb24ndCB3YW50IGFcclxuICAgICAqIG1lc3NhZ2UgdG8gYXBwZWFyIHdoZW4gdGhlIGpzb24gcmVzcG9uc2UgcmV0dXJucyBzdWNjZXNzPT1mYWxzZSwgc28gd2Ugd2lsbCBoYXZlIHRvIGNhbGwgY2hlY2tTdWNjZXNzIGluc2lkZVxyXG4gICAgICogZXZlcnkgcmVzcG9uc2UgbWV0aG9kIGluc3RlYWQsIGlmIHdlIHdhbnQgdGhhdCByZXNwb25zZSB0byBwcmludCBhIG1lc3NhZ2UgdG8gdGhlIHVzZXIgd2hlbiBmYWlsIGhhcHBlbnMuXHJcbiAgICAgKlxyXG4gICAgICogcmVxdWlyZXM6IHJlcy5zdWNjZXNzIHJlcy5tZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNoZWNrU3VjY2VzcyA9IGZ1bmN0aW9uKG9wRnJpZW5kbHlOYW1lLCByZXMpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhvcEZyaWVuZGx5TmFtZSArIFwiIGZhaWxlZDogXCIgKyByZXMubWVzc2FnZSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdWNjZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGFkZHMgYWxsIGFycmF5IG9iamVjdHMgdG8gb2JqIGFzIGEgc2V0ICovXHJcbiAgICBhZGRBbGwgPSBmdW5jdGlvbihvYmosIGEpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibnVsbCBlbGVtZW50IGluIGFkZEFsbCBhdCBpZHg9XCIgKyBpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbnVsbE9yVW5kZWYgPSBmdW5jdGlvbihvYmopOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gb2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG4gICAgICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuICAgICAqL1xyXG4gICAgZ2V0VWlkRm9ySWQgPSBmdW5jdGlvbihtYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGlkKTogc3RyaW5nIHtcclxuICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbWFwW2lkXTtcclxuXHJcbiAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgdWlkID0gXCJcIiArIG1ldGE2NC5uZXh0VWlkKys7XHJcbiAgICAgICAgICAgIG1hcFtpZF0gPSB1aWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1aWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudEV4aXN0cyA9IGZ1bmN0aW9uKGlkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBUYWtlcyB0ZXh0YXJlYSBkb20gSWQgKCMgb3B0aW9uYWwpIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAqL1xyXG4gICAgZ2V0VGV4dEFyZWFWYWxCeUlkID0gZnVuY3Rpb24oaWQpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBkZTogSFRNTEVsZW1lbnQgPSB1dGlsLmRvbUVsbShpZCk7XHJcbiAgICAgICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kZSkudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcbiAgICAgKi9cclxuICAgIGRvbUVsbSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICBpZiAodXRpbC5zdGFydHNXaXRoKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXRpbC5jb250YWlucyhpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICB9XHJcblxyXG4gICAgcG9seSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG4gICAgICovXHJcbiAgICBwb2x5RWxtID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmICh1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUG9seW1lci5kb20oZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9seUVsbU5vZGUgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgZSA9IHV0aWwucG9seUVsbShpZCk7XHJcbiAgICAgICAgcmV0dXJuIGUubm9kZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogR2V0cyB0aGUgZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBnZXRSZXF1aXJlZEVsZW1lbnQgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgZSA9ICQoaWQpO1xyXG4gICAgICAgIGlmIChlID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNPYmplY3QgPSBmdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbnRUaW1lTWlsbGlzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBlbXB0eVN0cmluZyA9IGZ1bmN0aW9uKHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF2YWwgfHwgdmFsLmxlbmd0aCA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHV0aWwucG9seUVsbShpZCkubm9kZS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICBzZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlbG0gPSB1dGlsLnBvbHlFbG0oaWQpO1xyXG4gICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgZWxtLm5vZGUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbG0gIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRW50ZXJLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnkpIHtcclxuICAgICAgICB1dGlsLmJpbmRLZXkoaWQsIGZ1bmMsIDEzKTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55LCBrZXlDb2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAkKGlkKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuICAgICAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcbiAgICAgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuICAgICAqL1xyXG4gICAgY2hhbmdlT3JBZGRDbGFzcyA9IGZ1bmN0aW9uKGVsbTogc3RyaW5nLCBvbGRDbGFzczogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsbWVtZW50ID0gJChlbG0pO1xyXG4gICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG9sZENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3MobmV3Q2xhc3MsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBkaXNwbGF5cyBtZXNzYWdlIChtc2cpIG9mIG9iamVjdCBpcyBub3Qgb2Ygc3BlY2lmaWVkIHR5cGVcclxuICAgICAqL1xyXG4gICAgdmVyaWZ5VHlwZSA9IGZ1bmN0aW9uKG9iajogYW55LCB0eXBlOiBhbnksIG1zZzogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRIdG1sID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSB1dGlsLmRvbUVsbShpZCk7XHJcbiAgICAgICAgdmFyIHBvbHlFbG0gPSBQb2x5bWVyLmRvbShlbG0pO1xyXG5cclxuICAgICAgICAvL0ZvciBQb2x5bWVyIDEuMC4wLCB5b3UgbmVlZCB0aGlzLi4uXHJcbiAgICAgICAgLy9wb2x5RWxtLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgcG9seUVsbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvcGVydHlDb3VudCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgIHZhciBwcm9wO1xyXG5cclxuICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyBhbmQgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIHByaW50T2JqZWN0ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCJcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eVtcIiArIGNvdW50ICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIHZhbCArPSBrICsgXCIgLCBcIiArIHYgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZXJyXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgKi9cclxuICAgIHByaW50S2V5cyA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgaWYgKCFrKSB7XHJcbiAgICAgICAgICAgICAgICBrID0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFsICs9ICcsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWwgKz0gaztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNYWtlcyBlbGVJZCBlbmFibGVkIGJhc2VkIG9uIHZpcyBmbGFnXHJcbiAgICAgKlxyXG4gICAgICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuICAgICAqL1xyXG4gICAgc2V0RW5hYmxlbWVudCA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgZWxtID0gdXRpbC5kb21FbG0oZWxtSWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVuYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE1ha2VzIGVsZUlkIHZpc2libGUgYmFzZWQgb24gdmlzIGZsYWdcclxuICAgICAqXHJcbiAgICAgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG4gICAgICovXHJcbiAgICBzZXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgdmlzOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbG0gPSB1dGlsLmRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2aXMpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgJChlbG0pLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhpZGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgJChlbG0pLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogUHJvZ3JhbWF0aWNhbGx5IGNyZWF0ZXMgb2JqZWN0cyBieSBuYW1lLCBzaW1pbGFyIHRvIHdoYXQgSmF2YSByZWZsZWN0aW9uIGRvZXNcclxuXHJcbiAgICAqIGV4OiB2YXIgZXhhbXBsZSA9IEluc3RhbmNlTG9hZGVyLmdldEluc3RhbmNlPE5hbWVkVGhpbmc+KHdpbmRvdywgJ0V4YW1wbGVDbGFzcycsIGFyZ3MuLi4pO1xyXG4gICAgKi9cclxuICAgIGdldEluc3RhbmNlID0gZnVuY3Rpb24gPFQ+KGNvbnRleHQ6IE9iamVjdCwgbmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoY29udGV4dFtuYW1lXS5wcm90b3R5cGUpO1xyXG4gICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICByZXR1cm4gPFQ+aW5zdGFuY2U7XHJcbiAgICB9XHJcbn1cclxubGV0IHV0aWw6IFV0aWwgPSBuZXcgVXRpbCgpO1xuXG5jbGFzcyBKQ1JDb25zdGFudHMge1xyXG5cclxuICAgIENPTU1FTlRfQlk6IHN0cmluZyA9IFwiY29tbWVudEJ5XCI7XHJcbiAgICBQVUJMSUNfQVBQRU5EOiBzdHJpbmcgPSBcInB1YmxpY0FwcGVuZFwiO1xyXG4gICAgUFJJTUFSWV9UWVBFOiBzdHJpbmcgPSBcImpjcjpwcmltYXJ5VHlwZVwiO1xyXG4gICAgUE9MSUNZOiBzdHJpbmcgPSBcInJlcDpwb2xpY3lcIjtcclxuXHJcbiAgICBNSVhJTl9UWVBFUzogc3RyaW5nID0gXCJqY3I6bWl4aW5UeXBlc1wiO1xyXG5cclxuICAgIEVNQUlMX0NPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgIEVNQUlMX1JFQ0lQOiBzdHJpbmcgPSBcInJlY2lwXCI7XHJcbiAgICBFTUFJTF9TVUJKRUNUOiBzdHJpbmcgPSBcInN1YmplY3RcIjtcclxuXHJcbiAgICBDUkVBVEVEOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkXCI7XHJcbiAgICBDUkVBVEVEX0JZOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkQnlcIjtcclxuICAgIENPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgIFRBR1M6IHN0cmluZyA9IFwidGFnc1wiO1xyXG4gICAgVVVJRDogc3RyaW5nID0gXCJqY3I6dXVpZFwiO1xyXG4gICAgTEFTVF9NT0RJRklFRDogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkXCI7XHJcbiAgICBMQVNUX01PRElGSUVEX0JZOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRCeVwiO1xyXG4gICAgSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQ6IHN0cmluZyA9IFwibWV0YTY0Ompzb25cIjtcclxuXHJcbiAgICBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgIEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgIEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgIElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxufVxyXG5sZXQgamNyQ25zdDpKQ1JDb25zdGFudHMgPSBuZXcgSkNSQ29uc3RhbnRzKCk7XHJcblxuY2xhc3MgQXR0YWNobWVudCB7XHJcbiAgICAvKiBOb2RlIGJlaW5nIHVwbG9hZGVkIHRvICovXHJcbiAgICB1cGxvYWROb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIG9wZW5VcGxvYWRGcm9tRmlsZURsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgYXR0YWNobWVudC51cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXR0YWNobWVudC51cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcoKSkub3BlbigpO1xyXG5cclxuICAgICAgICAvKiBOb3RlOiBUbyBydW4gbGVnYWN5IHVwbG9hZGVyIGp1c3QgcHV0IHRoaXMgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIGhlcmUsIGFuZFxyXG4gICAgICAgIG5vdGhpbmcgZWxzZSBpcyByZXF1aXJlZC4gU2VydmVyIHNpZGUgcHJvY2Vzc2luZyBpcyBzdGlsbCBpbiBwbGFjZSBmb3IgaXRcclxuXHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgKi9cclxuICAgIH1cclxuXHJcbiAgICBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnQudXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF0dGFjaG1lbnQudXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZSBBdHRhY2htZW50XCIsIFwiRGVsZXRlIHRoZSBBdHRhY2htZW50IG9uIHRoZSBOb2RlP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPERlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0LCBEZWxldGVBdHRhY2htZW50UmVzcG9uc2U+KFwiZGVsZXRlQXR0YWNobWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICB9LCBhdHRhY2htZW50LmRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgbnVsbCwgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBEZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIGF0dGFjaG1lbnRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQucmVtb3ZlQmluYXJ5QnlVaWQodWlkKTtcclxuICAgICAgICAgICAgLy8gZm9yY2UgcmUtcmVuZGVyIGZyb20gbG9jYWwgZGF0YS5cclxuICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubGV0IGF0dGFjaG1lbnQ6IEF0dGFjaG1lbnQgPSBuZXcgQXR0YWNobWVudCgpO1xyXG5cbmNsYXNzIEVkaXQge1xyXG5cclxuICAgIGNyZWF0ZU5vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENyZWF0ZU5vZGVEbGcoKSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5zZXJ0Qm9va1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBJbnNlcnRCb29rUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEJvb2tSZXNwb25zZSBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWxldGVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBEZWxldGVOb2Rlc1Jlc3BvbnNlLCBwYXlsb2FkOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGUgPSBwYXlsb2FkW1wicG9zdERlbGV0ZVNlbE5vZGVcIl07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gc2VsTm9kZS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgaGlnaGxpZ2h0SWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBJbml0Tm9kZUVkaXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gdXRpbC5zdGFydHNXaXRoKG5vZGUubmFtZSwgXCJyZXA6XCIpIHx8IC8qIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz8gKi9cbiAgICAgICAgICAgICAgICB1dGlsLmNvbnRhaW5zKG5vZGUucGF0aCwgXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUgYW5kIHdlIGFyZSB0aGUgY29tbWVudGVyICovXHJcbiAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNlcnZlciB3aWxsIGhhdmUgc2VudCB1cyBiYWNrIHRoZSByYXcgdGV4dCBjb250ZW50LCB0aGF0IHNob3VsZCBiZSBtYXJrZG93biBpbnN0ZWFkIG9mIGFueSBIVE1MLCBzb1xyXG4gICAgICAgICAgICAgICAgICogdGhhdCB3ZSBjYW4gZGlzcGxheSB0aGlzIGFuZCBzYXZlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBjYW5ub3QgZWRpdCBub2RlcyB0aGF0IHlvdSBkb24ndCBvd24uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczogTW92ZU5vZGVzUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJNb3ZlIG5vZGVzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgZWRpdC5ub2Rlc1RvTW92ZSA9IG51bGw7IC8vIHJlc2V0XHJcbiAgICAgICAgICAgIGVkaXQubm9kZXNUb01vdmVTZXQgPSB7fTtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IFNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93UmVhZE9ubHlQcm9wZXJ0aWVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8qXHJcbiAgICAgKiBOb2RlIElEIGFycmF5IG9mIG5vZGVzIHRoYXQgYXJlIHJlYWR5IHRvIGJlIG1vdmVkIHdoZW4gdXNlciBjbGlja3MgJ0ZpbmlzaCBNb3ZpbmcnXHJcbiAgICAgKi9cclxuICAgIG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qIHRvZG8tMTogbmVlZCB0byBmaW5kIG91dCBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0byBkbyBhbiBvcmRlcmVkIHNldCBpbiBqYXZhc2NyaXB0IHNvIEkgZG9uJ3QgbmVlZFxyXG4gICAgYm90aCBub2Rlc1RvTW92ZSBhbmQgbm9kZXNUb01vdmVTZXRcclxuICAgICovXHJcbiAgICBub2Rlc1RvTW92ZVNldDogT2JqZWN0ID0ge307XHJcblxyXG4gICAgcGFyZW50T2ZOZXdOb2RlOiBOb2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIGluZGljYXRlcyBlZGl0b3IgaXMgZGlzcGxheWluZyBhIG5vZGUgdGhhdCBpcyBub3QgeWV0IHNhdmVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgZWRpdGluZ1Vuc2F2ZWROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIG5vZGUgKE5vZGVJbmZvLmphdmEpIHRoYXQgaXMgYmVpbmcgY3JlYXRlZCB1bmRlciB3aGVuIG5ldyBub2RlIGlzIGNyZWF0ZWRcclxuICAgICAqL1xyXG4gICAgc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIE5vZGUgYmVpbmcgZWRpdGVkXHJcbiAgICAgKlxyXG4gICAgICogdG9kby0yOiB0aGlzIGFuZCBzZXZlcmFsIG90aGVyIHZhcmlhYmxlcyBjYW4gbm93IGJlIG1vdmVkIGludG8gdGhlIGRpYWxvZyBjbGFzcz8gSXMgdGhhdCBnb29kIG9yIGJhZFxyXG4gICAgICogY291cGxpbmcvcmVzcG9uc2liaWxpdHk/XHJcbiAgICAgKi9cclxuICAgIGVkaXROb2RlOiBOb2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgIGVkaXROb2RlRGxnSW5zdDogRWRpdE5vZGVEbGcgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0eXBlPU5vZGVJbmZvLmphdmFcclxuICAgICAqXHJcbiAgICAgKiBXaGVuIGluc2VydGluZyBhIG5ldyBub2RlLCB0aGlzIGhvbGRzIHRoZSBub2RlIHRoYXQgd2FzIGNsaWNrZWQgb24gYXQgdGhlIHRpbWUgdGhlIGluc2VydCB3YXMgcmVxdWVzdGVkLCBhbmRcclxuICAgICAqIGlzIHNlbnQgdG8gc2VydmVyIGZvciBvcmRpbmFsIHBvc2l0aW9uIGFzc2lnbm1lbnQgb2YgbmV3IG5vZGUuIEFsc28gaWYgdGhpcyB2YXIgaXMgbnVsbCwgaXQgaW5kaWNhdGVzIHdlIGFyZVxyXG4gICAgICogY3JlYXRpbmcgaW4gYSAnY3JlYXRlIHVuZGVyIHBhcmVudCcgbW9kZSwgdmVyc3VzIG5vbi1udWxsIG1lYW5pbmcgJ2luc2VydCBpbmxpbmUnIHR5cGUgb2YgaW5zZXJ0LlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgbm9kZUluc2VydFRhcmdldDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICBpc0VkaXRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAoIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB8fCBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSkpIC8vXHJcbiAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGFsbG93IHRoZSBkaXNhYmxlSW5zZXJ0IHByb3AgdG8gYmUgYWJsZSB0byB0dXJuIHRoaW5ncyBvZmYsIG5vZGUgYnkgbm9kZSAqL1xyXG4gICAgaXNJbnNlcnRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkRJU0FCTEVfSU5TRVJULCBub2RlKSA9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0RWRpdGluZ05ld05vZGUgPSBmdW5jdGlvbih0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICBlZGl0LmVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICBlZGl0LmVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZyh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgICAgIGVkaXQuZWRpdE5vZGVEbGdJbnN0LnNhdmVOZXdOb2RlKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBjYWxsZWQgdG8gZGlzcGxheSBlZGl0b3IgdGhhdCB3aWxsIGNvbWUgdXAgQkVGT1JFIGFueSBub2RlIGlzIHNhdmVkIG9udG8gdGhlIHNlcnZlciwgc28gdGhhdCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICogYW55IHNhdmUgaXMgcGVyZm9ybWVkIHdlIHdpbGwgaGF2ZSB0aGUgY29ycmVjdCBub2RlIG5hbWUsIGF0IGxlYXN0LlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgdmVyc2lvbiBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCwgYW5kIGN1cnJlbnRseSB0aGlzIG1lYW5zICdlZGl0aW5nVW5zYXZlZE5vZGUnIGlzIG5vdCBjdXJyZW50bHkgZXZlclxyXG4gICAgICogdHJpZ2dlcmVkLiBUaGUgbmV3IGFwcHJvYWNoIG5vdyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gJ3JlbmFtZScgbm9kZXMgaXMgdG8ganVzdCBjcmVhdGUgb25lIHdpdGggYVxyXG4gICAgICogcmFuZG9tIG5hbWUgYW4gbGV0IHVzZXIgc3RhcnQgZWRpdGluZyByaWdodCBhd2F5IGFuZCB0aGVuIHJlbmFtZSB0aGUgbm9kZSBJRiBhIGN1c3RvbSBub2RlIG5hbWUgaXMgbmVlZGVkLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgbWVhbnMgaWYgd2UgY2FsbCB0aGlzIGZ1bmN0aW9uIChzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUpIGluc3RlYWQgb2YgJ3N0YXJ0RWRpdGluZ05ld05vZGUoKSdcclxuICAgICAqIHRoYXQgd2lsbCBjYXVzZSB0aGUgR1VJIHRvIGFsd2F5cyBwcm9tcHQgZm9yIHRoZSBub2RlIG5hbWUgYmVmb3JlIGNyZWF0aW5nIHRoZSBub2RlLiBUaGlzIHdhcyB0aGUgb3JpZ2luYWxcclxuICAgICAqIGZ1bmN0aW9uYWxpdHkgYW5kIHN0aWxsIHdvcmtzLlxyXG4gICAgICovXHJcbiAgICBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA9IHRydWU7XHJcbiAgICAgICAgZWRpdC5lZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgZWRpdC5lZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICBlZGl0LmVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5zZXJ0Tm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBJbnNlcnROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgZWRpdC5ydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IENyZWF0ZVN1Yk5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNyZWF0ZSBzdWJub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgZWRpdC5ydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzYXZlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBTYXZlTm9kZVJlc3BvbnNlLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAvKiBiZWNhc3VzZSBJIGRvbid0IHVuZGVyc3RhbmQgJ2VkaXRpbmdVbnNhdmVkTm9kZScgdmFyaWFibGUgYW55IGxvbmdlciB1bnRpbCBpIHJlZnJlc2ggbXkgbWVtb3J5LCBpIHdpbGwgdXNlXHJcbiAgICAgICAgICAgIHRoZSBvbGQgYXBwcm9hY2ggb2YgcmVmcmVzaGluZyBlbnRpcmUgdHJlZSByYXRoZXIgdGhhbiBtb3JlIGVmZmljaWVudCByZWZyZXNuTm9kZU9uUGFnZSwgYmVjdWFzZSBpdCByZXF1aXJlc1xyXG4gICAgICAgICAgICB0aGUgbm9kZSB0byBhbHJlYWR5IGJlIG9uIHRoZSBwYWdlLCBhbmQgdGhpcyByZXF1aXJlcyBpbiBkZXB0aCBhbmFseXMgaSdtIG5vdCBnb2luZyB0byBkbyByaWdodCB0aGlzIG1pbnV0ZS5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy9yZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGUpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRNb2RlID0gZnVuY3Rpb24obW9kZVZhbD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1vZGVWYWwgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1vZGVWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgLy8gdGhhdCBjYW4gc2hvdyBhbiBvbi9vZmYgc3RhdGUuXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNpbmNlIGVkaXQgbW9kZSB0dXJucyBvbiBsb3RzIG9mIGJ1dHRvbnMsIHRoZSBsb2NhdGlvbiBvZiB0aGUgbm9kZSB3ZSBhcmUgdmlld2luZyBjYW4gY2hhbmdlIHNvIG11Y2ggaXRcclxuICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgbWV0YTY0LnNhdmVVc2VyUHJlZmVyZW5jZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTm9kZVVwID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPFNldE5vZGVQb3NpdGlvblJlcXVlc3QsIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IFwiW25vZGVBYm92ZV1cIlxyXG4gICAgICAgICAgICB9LCBlZGl0LnNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTm9kZURvd24gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248U2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwgU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiW25vZGVCZWxvd11cIixcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGUubmFtZVxyXG4gICAgICAgICAgICB9LCBlZGl0LnNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTm9kZVRvVG9wID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPFNldE5vZGVQb3NpdGlvblJlcXVlc3QsIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IFwiW3RvcE5vZGVdXCJcclxuICAgICAgICAgICAgfSwgZWRpdC5zZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZU5vZGVUb0JvdHRvbSA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxTZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBTZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCBlZGl0LnNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9kZSBhYm92ZSB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgdG9wIG5vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9kZUFib3ZlID0gZnVuY3Rpb24obm9kZSk6IGFueSB7XHJcbiAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgIGlmIChvcmRpbmFsIDw9IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9kZSBiZWxvdyB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgYm90dG9tIG5vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9kZUJlbG93ID0gZnVuY3Rpb24obm9kZTogYW55KTogTm9kZUluZm8ge1xyXG4gICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGluYWwgPSBcIiArIG9yZGluYWwpO1xyXG4gICAgICAgIGlmIChvcmRpbmFsID09IC0xIHx8IG9yZGluYWwgPj0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCArIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0Q2hpbGROb2RlID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bkVkaXROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBlZGl0Tm9kZUNsaWNrOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB1dGlsLmpzb248SW5pdE5vZGVFZGl0UmVxdWVzdCwgSW5pdE5vZGVFZGl0UmVzcG9uc2U+KFwiaW5pdE5vZGVFZGl0XCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgIH0sIGVkaXQuaW5pdE5vZGVFZGl0UmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGluc2VydE5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgIGlmICghZWRpdC5wYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIHBhcmVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGVkaXQubm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgIGVkaXQuc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVN1Yk5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nLCBjcmVhdGVBdFRvcD86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSksIG9yIGFueSBzZWxlY3RlZFxyXG4gICAgICAgICAqIG5vZGUgaWYgdGhlcmUgaXMgYSBzZWxlY3RlZCBub2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHROb2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlID0gaGlnaGxpZ2h0Tm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghZWRpdC5wYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gY3JlYXRlU3ViTm9kZTogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRoaXMgaW5kaWNhdGVzIHdlIGFyZSBOT1QgaW5zZXJ0aW5nIGlubGluZS4gQW4gaW5saW5lIGluc2VydCB3b3VsZCBhbHdheXMgaGF2ZSBhIHRhcmdldC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBlZGl0Lm5vZGVJbnNlcnRUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgIGVkaXQuc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGx5VG9Db21tZW50ID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUodWlkKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGlvbnMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2UgY291bGQgd3JpdGUgY29kZSB0aGF0IG9ubHkgc2NhbnMgZm9yIGFsbCB0aGUgXCJTRUxcIiBidXR0b25zIGFuZCB1cGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGVtLCBidXQgZm9yIG5vd1xyXG4gICAgICAgICAqIHdlIHRha2UgdGhlIHNpbXBsZSBhcHByb2FjaCBhbmQganVzdCByZS1yZW5kZXIgdGhlIHBhZ2UuIFRoZXJlIGlzIG5vIGNhbGwgdG8gdGhlIHNlcnZlciwgc28gdGhpcyBpc1xyXG4gICAgICAgICAqIGFjdHVhbGx5IHZlcnkgZWZmaWNpZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIERlbGV0ZSB0aGUgc2luZ2xlIG5vZGUgaWRlbnRpZmllZCBieSAndWlkJyBwYXJhbWV0ZXIgaWYgdWlkIHBhcmFtZXRlciBpcyBwYXNzZWQsIGFuZCBpZiB1aWQgcGFyYW1ldGVyIGlzIG5vdFxyXG4gICAgICogcGFzc2VkIHRoZW4gdXNlIHRoZSBub2RlIHNlbGVjdGlvbnMgZm9yIG11bHRpcGxlIHNlbGVjdGlvbnMgb24gdGhlIHBhZ2UuXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gZGVsZXRlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSA/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvc3REZWxldGVTZWxOb2RlOiBOb2RlSW5mbyA9IGVkaXQuZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPERlbGV0ZU5vZGVzUmVxdWVzdCwgRGVsZXRlTm9kZXNSZXNwb25zZT4oXCJkZWxldGVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IHNlbE5vZGVzQXJyYXlcclxuICAgICAgICAgICAgICAgIH0sIGVkaXQuZGVsZXRlTm9kZXNSZXNwb25zZSwgbnVsbCwgeyBcInBvc3REZWxldGVTZWxOb2RlXCI6IHBvc3REZWxldGVTZWxOb2RlIH0pO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIEdldHMgdGhlIG5vZGUgd2Ugd2FudCB0byBzY3JvbGwgdG8gYWZ0ZXIgYSBkZWxldGUgKi9cclxuICAgIGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSA9IGZ1bmN0aW9uKCk6IE5vZGVJbmZvIHtcclxuICAgICAgICAvKiBVc2UgYSBoYXNobWFwLXR5cGUgYXBwcm9hY2ggdG8gc2F2aW5nIGFsbCBzZWxlY3RlZCBub2RlcyBpbnRvIGEgbG9vdXAgbWFwICovXHJcbiAgICAgICAgbGV0IG5vZGVzTWFwOiBPYmplY3QgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCgpO1xyXG4gICAgICAgIGxldCBiZXN0Tm9kZTogTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGxldCB0YWtlTmV4dE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogbm93IHdlIHNjYW4gdGhlIGNoaWxkcmVuLCBhbmQgdGhlIGxhc3QgY2hpbGQgd2UgZW5jb3VudGVyZCB1cCB1bnRpbCB3ZSBmaW5kIHRoZSByaXN0IG9uZW4gaW4gbm9kZXNNYXAgd2lsbCBiZSB0aGVcclxuICAgICAgICBub2RlIHdlIHdpbGwgd2FudCB0byBzZWxlY3QgYW5kIHNjcm9sbCB0aGUgdXNlciB0byBBRlRFUiB0aGUgZGVsZXRpbmcgaXMgZG9uZSAqL1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRha2VOZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIGlzIHRoaXMgbm9kZSBvbmUgdG8gYmUgZGVsZXRlZCAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZXNNYXBbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgIHRha2VOZXh0Tm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBiZXN0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJlc3ROb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGN1dFNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgIFwiQ29uZmlybSBDdXRcIixcclxuICAgICAgICAgICAgXCJDdXQgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocyksIHRvIHBhc3RlL21vdmUgdG8gbmV3IGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgXCJZZXNcIixcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0Lm5vZGVzVG9Nb3ZlID0gc2VsTm9kZXNBcnJheTtcclxuICAgICAgICAgICAgICAgIGVkaXQubG9hZE5vZGVzVG9Nb3ZlU2V0KHNlbE5vZGVzQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgYSB3YXkgdG8gZmluZCBhbGwgc2VsZWN0ZWQgY2hlY2tib3hlcyBpbiB0aGUgZ3VpIGFuZCByZXNldCB0aGVtIGFsbCB0byB1bmNoZWNrZWQgKi9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307IC8vIGNsZWFyIHNlbGVjdGlvbnMuXHJcblxyXG4gICAgICAgICAgICAgICAgLyogbm93IHdlIHJlbmRlciBhZ2FpbiBhbmQgdGhlIG5vZGVzIHRoYXQgd2VyZSBjdXQgd2lsbCBkaXNhcHBlYXIgZnJvbSB2aWV3ICovXHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWROb2Rlc1RvTW92ZVNldCA9IGZ1bmN0aW9uKG5vZGVJZHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgZWRpdC5ub2Rlc1RvTW92ZVNldCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcclxuICAgICAgICAgICAgZWRpdC5ub2Rlc1RvTW92ZVNldFtpZF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXN0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBQYXN0ZVwiLCBcIlBhc3RlIFwiICsgZWRpdC5ub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHVuZGVyIHNlbGVjdGVkIHBhcmVudCBub2RlID9cIixcclxuICAgICAgICAgICAgXCJZZXMsIHBhc3RlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICogcGFnZS4gTGF0ZXIgb24gd2UgY2FuIGdldCBtb3JlIHNwZWNpZmljIGFib3V0IGFsbG93aW5nIHByZWNpc2UgZGVzdGluYXRpb24gbG9jYXRpb24gZm9yIG1vdmVkXHJcbiAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPE1vdmVOb2Rlc1JlcXVlc3QsIE1vdmVOb2Rlc1Jlc3BvbnNlPihcIm1vdmVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROb2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldENoaWxkSWRcIjogaGlnaGxpZ2h0Tm9kZSAhPSBudWxsID8gaGlnaGxpZ2h0Tm9kZS5pZCA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IGVkaXQubm9kZXNUb01vdmVcclxuICAgICAgICAgICAgICAgIH0sIGVkaXQubW92ZU5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluc2VydEJvb2tXYXJBbmRQZWFjZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPEluc2VydEJvb2tSZXF1ZXN0LCBJbnNlcnRCb29rUmVzcG9uc2U+KFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgfSwgZWRpdC5pbnNlcnRCb29rUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxufVxyXG5sZXQgZWRpdDogRWRpdCA9IG5ldyBFZGl0KCk7XG5cbmNsYXNzIE1ldGE2NCB7XHJcblxyXG4gICAgYXBwSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjdXJVcmxQYXRoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgdXJsQ21kOiBzdHJpbmc7XHJcbiAgICBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XHJcblxyXG4gICAgY29kZUZvcm1hdERpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICBuZXh0R3VpZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKiBuYW1lIG9mIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciAqL1xyXG4gICAgdXNlck5hbWU6IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcblxyXG4gICAgLyogc2NyZWVuIGNhcGFiaWxpdGllcyAqL1xyXG4gICAgZGV2aWNlV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICBkZXZpY2VIZWlnaHQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLypcclxuICAgICAqIFVzZXIncyByb290IG5vZGUuIFRvcCBsZXZlbCBvZiB3aGF0IGxvZ2dlZCBpbiB1c2VyIGlzIGFsbG93ZWQgdG8gc2VlLlxyXG4gICAgICovXHJcbiAgICBob21lTm9kZUlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgaG9tZU5vZGVQYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICovXHJcbiAgICBpc0FkbWluVXNlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qIGFsd2F5cyBzdGFydCBvdXQgYXMgYW5vbiB1c2VyIHVudGlsIGxvZ2luICovXHJcbiAgICBpc0Fub25Vc2VyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG4gICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIHNpZ25hbHMgdGhhdCBkYXRhIGhhcyBjaGFuZ2VkIGFuZCB0aGUgbmV4dCB0aW1lIHdlIGdvIHRvIHRoZSBtYWluIHRyZWUgdmlldyB3aW5kb3cgd2UgbmVlZCB0byByZWZyZXNoIGRhdGFcclxuICAgICAqIGZyb20gdGhlIHNlcnZlclxyXG4gICAgICovXHJcbiAgICB0cmVlRGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBOb2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZS5pZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IE5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgLyogY291bnRlciBmb3IgbG9jYWwgdWlkcyAqL1xyXG4gICAgbmV4dFVpZDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICovXHJcbiAgICBpZGVudFRvVWlkTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IHsgW2tleTogc3RyaW5nXTogTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgIC8qIFVzZXItc2VsZWN0YWJsZSB1c2VyLWFjY291bnQgb3B0aW9ucyBlYWNoIHVzZXIgY2FuIHNldCBvbiBoaXMgYWNjb3VudCAqL1xyXG4gICAgTU9ERV9BRFZBTkNFRDogc3RyaW5nID0gXCJhZHZhbmNlZFwiO1xyXG4gICAgTU9ERV9TSU1QTEU6IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgLyogY2FuIGJlICdzaW1wbGUnIG9yICdhZHZhbmNlZCcgKi9cclxuICAgIGVkaXRNb2RlT3B0aW9uOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0b2dnbGVkIGJ5IGJ1dHRvbiwgYW5kIGhvbGRzIGlmIHdlIGFyZSBnb2luZyB0byBzaG93IHByb3BlcnRpZXMgb3Igbm90IG9uIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB2aWV3XHJcbiAgICAgKi9cclxuICAgIHNob3dQcm9wZXJ0aWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogRmxhZyB0aGF0IGluZGljYXRlcyBpZiB3ZSBhcmUgcmVuZGVyaW5nIHBhdGgsIG93bmVyLCBtb2RUaW1lLCBldGMuIG9uIGVhY2ggcm93ICovXHJcbiAgICBzaG93TWV0YURhdGE6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTGlzdCBvZiBub2RlIHByZWZpeGVzIHRvIGZsYWcgbm9kZXMgdG8gbm90IGFsbG93IHRvIGJlIHNob3duIGluIHRoZSBwYWdlIGluIHNpbXBsZSBtb2RlXHJcbiAgICAgKi9cclxuICAgIHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0OiBhbnkgPSB7XHJcbiAgICAgICAgXCJyZXA6XCI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICByZWFkT25seVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgYmluYXJ5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBhbGwgbm9kZSB1aWRzIHRvIHRydWUgaWYgc2VsZWN0ZWQsIG90aGVyd2lzZSB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGRlbGV0ZWQgKG5vdCBleGlzdGluZylcclxuICAgICAqL1xyXG4gICAgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgLyogU2V0IG9mIGFsbCBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZCAoZnJvbSB0aGUgYWJicmV2aWF0ZWQgZm9ybSkgKi9cclxuICAgIGV4cGFuZGVkQWJicmV2Tm9kZUlkczogYW55ID0ge307XHJcblxyXG4gICAgLyogUmVuZGVyTm9kZVJlc3BvbnNlLmphdmEgb2JqZWN0ICovXHJcbiAgICBjdXJyZW50Tm9kZURhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIGFsbCB2YXJpYWJsZXMgZGVyaXZhYmxlIGZyb20gY3VycmVudE5vZGVEYXRhLCBidXQgc3RvcmVkIGRpcmVjdGx5IGZvciBzaW1wbGVyIGNvZGUvYWNjZXNzXHJcbiAgICAgKi9cclxuICAgIGN1cnJlbnROb2RlOiBOb2RlSW5mbyA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZVVpZDogYW55ID0gbnVsbDtcclxuICAgIGN1cnJlbnROb2RlSWQ6IGFueSA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZVBhdGg6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyogTWFwcyBmcm9tIGd1aWQgdG8gRGF0YSBPYmplY3QgKi9cclxuICAgIGRhdGFPYmpNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIHJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcbiAgICBwcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGU6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9O1xyXG5cclxuICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzID0ge1xyXG4gICAgICAgIFwiZWRpdE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJsYXN0Tm9kZVwiOiBcIlwiLFxyXG4gICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgXCJzaG93TWV0YURhdGFcIjogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTWFpbk1lbnVQYW5lbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIENyZWF0ZXMgYSAnZ3VpZCcgb24gdGhpcyBvYmplY3QsIGFuZCBtYWtlcyBkYXRhT2JqTWFwIGFibGUgdG8gbG9vayB1cCB0aGUgb2JqZWN0IHVzaW5nIHRoYXQgZ3VpZCBpbiB0aGVcclxuICAgICAqIGZ1dHVyZS5cclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJEYXRhT2JqZWN0ID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGlmICghZGF0YS5ndWlkKSB7XHJcbiAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbWV0YTY0Lm5leHRHdWlkO1xyXG4gICAgICAgICAgICBtZXRhNjQuZGF0YU9iak1hcFtkYXRhLmd1aWRdID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T2JqZWN0QnlHdWlkID0gZnVuY3Rpb24oZ3VpZCkge1xyXG4gICAgICAgIHZhciByZXQgPSBtZXRhNjQuZGF0YU9iak1hcFtndWlkXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBjYWxsYmFjayBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIHNjcmlwdCB0byBydW4sIG9yIGlmIGl0J3MgYSBmdW5jdGlvbiBvYmplY3QgdGhhdCB3aWxsIGJlXHJcbiAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICpcclxuICAgICAqIFdoZW5ldmVyIHdlIGFyZSBidWlsZGluZyBhbiBvbkNsaWNrIHN0cmluZywgYW5kIHdlIGhhdmUgdGhlIGFjdHVhbCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gdGhlIG5hbWUgb2YgdGhlXHJcbiAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAqIHRvIHRoZSBmdW5jdGlvbiBvYmplY3QsIGFuZCB0aGVuIGVuY29kZSBhIGNhbGwgdG8gcnVuIHRoYXQgZ3VpZCBieSBjYWxsaW5nIHJ1bkNhbGxiYWNrLiBUaGVyZSBpcyBhIGxldmVsIG9mXHJcbiAgICAgKiBpbmRpcmVjdGlvbiBoZXJlLCBidXQgdGhpcyBpcyB0aGUgc2ltcGxlc3QgYXBwcm9hY2ggd2hlbiB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gbWFwIGZyb20gYSBzdHJpbmcgdG8gYVxyXG4gICAgICogZnVuY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogY3R4PWNvbnRleHQsIHdoaWNoIGlzIHRoZSAndGhpcycgdG8gY2FsbCB3aXRoIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiwgYW5kIGhhdmUgYSAndGhpcycgY29udGV4dCB0byBiaW5kIHRvIGl0LlxyXG4gICAgICpcclxuICAgICAqIHBheWxvYWQgaXMgYW55IGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gYmUgcGFzc2VkIGF0IHJ1bnRpbWVcclxuICAgICAqXHJcbiAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlT25DbGljayA9IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSwgcGF5bG9hZD86IGFueSwgZGVsYXlDYWxsYmFjaz86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgfSAvL1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdChjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHBheWxvYWRTdHIgPSBwYXlsb2FkID8gcGF5bG9hZC5ndWlkIDogXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IHdoeSBpc24ndCBwYXlsb2FkU3RyIGluIHF1b3Rlcz8gSXQgd2FzIGxpa2UgdGhpcyBldmVuIGJlZm9yZSBzd2l0Y2hpbmcgdG8gYmFja3RpY2sgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYG1ldGE2NC5ydW5DYWxsYmFjaygke2NhbGxiYWNrLmd1aWR9LCR7Y3R4Lmd1aWR9LCR7cGF5bG9hZFN0cn0sJHtkZWxheUNhbGxiYWNrfSk7YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgbWV0YTY0LnJ1bkNhbGxiYWNrKCR7Y2FsbGJhY2suZ3VpZH0sbnVsbCxudWxsLCR7ZGVsYXlDYWxsYmFja30pO2A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwidW5leHBlY3RlZCBjYWxsYmFjayB0eXBlIGluIGVuY29kZU9uQ2xpY2tcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQsIGRlbGF5Q2FsbGJhY2s/OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxiYWNrIHJ1bjogXCIgKyBkZWxheUNhbGxiYWNrKTtcclxuICAgICAgICAvKiBkZXBlbmRpbmcgb24gZGVsYXlDYWxsYmFjaywgcnVuIHRoZSBjYWxsYmFjayBlaXRoZXIgaW1tZWRpYXRlbHkgb3Igd2l0aCBhIGRlbGF5ICovXHJcbiAgICAgICAgaWYgKGRlbGF5Q2FsbGJhY2sgPiAwKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgfSwgZGVsYXlDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnJ1bkNhbGxiYWNrSW1tZWRpYXRlKGd1aWQsIGN0eCwgcGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJ1bkNhbGxiYWNrSW1tZWRpYXRlID0gZnVuY3Rpb24oZ3VpZCwgY3R4LCBwYXlsb2FkKSB7XHJcbiAgICAgICAgdmFyIGRhdGFPYmogPSBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gbWV0YTY0LmdldE9iamVjdEJ5R3VpZChjdHgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBheWxvYWRPYmogPSBwYXlsb2FkID8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZChwYXlsb2FkKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGwodGhpeiwgcGF5bG9hZE9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcInVuYWJsZSB0byBmaW5kIGNhbGxiYWNrIG9uIHJlZ2lzdGVyZWQgZ3VpZDogXCIgKyBndWlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub01haW5QYWdlID0gZnVuY3Rpb24ocmVyZW5kZXI/OiBib29sZWFuLCBmb3JjZVNlcnZlclJlZnJlc2g/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVyZW5kZXIgfHwgbWV0YTY0LnRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFRhYiA9IGZ1bmN0aW9uKHBhZ2VOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAvKiB0aGlzIGNvZGUgY2FuIGJlIG1hZGUgbW9yZSBEUlksIGJ1dCBpJ20ganVzdCB0cnlpbmcgaXQgb3V0IGZvciBub3csIHNvIGknbSBub3QgYm90aGVyaW5nIHRvIHBlcmZlY3QgaXQgeWV0LiAqL1xyXG4gICAgICAgIC8vICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgLy8gJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgIC8vICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gaWYgKHBhZ2VOYW1lID09ICdtYWluVGFiTmFtZScpIHtcclxuICAgICAgICAvLyAgICAgJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICdzZWFyY2hUYWJOYW1lJykge1xyXG4gICAgICAgIC8vICAgICAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAndGltZWxpbmVUYWJOYW1lJykge1xyXG4gICAgICAgIC8vICAgICAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgKiBPT1Agd2l0aCAndGhpcycgYmVpbmcgZmlyc3QgcGFyYW1ldGVyIGFsd2F5cykuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VQYWdlID0gZnVuY3Rpb24ocGc/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHBnLnRhYklkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9vcHMsIHdyb25nIG9iamVjdCB0eXBlIHBhc3NlZCB0byBjaGFuZ2VQYWdlIGZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0aGlzIGlzIHRoZSBzYW1lIGFzIHNldHRpbmcgdXNpbmcgbWFpbklyb25QYWdlcz8/ICovXHJcbiAgICAgICAgdmFyIHBhcGVyVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTsgLy9cIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOb2RlQmxhY2tMaXN0ZWQgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgZm9yIChwcm9wIGluIG1ldGE2NC5zaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgc2VsQXJyYXk6IHN0cmluZ1tdID0gW10sIHVpZDtcclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gbWV0YTY0LnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2godWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBSZXR1cm5zIGEgbmV3bHkgY2xvbmVkIGFycmF5IG9mIGFsbCB0aGUgc2VsZWN0ZWQgbm9kZXMgZWFjaCB0aW1lIGl0J3MgY2FsbGVkLlxyXG4gICAgKi9cclxuICAgIGdldFNlbGVjdGVkTm9kZUlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBzZWxBcnJheTogc3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICBpZiAoIW1ldGE2NC5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gc2VsZWN0ZWQgbm9kZXMuXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gbWV0YTY0LnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5hYmxlIHRvIGZpbmQgdWlkVG9Ob2RlTWFwIGZvciB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheS5wdXNoKG5vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiByZXR1cm4gYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgZWFjaCBOb2RlSW5mbyB3aGVyZSB0aGUga2V5IGlzIHRoZSBpZCAqL1xyXG4gICAgZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCA9IGZ1bmN0aW9uKCk6IE9iamVjdCB7XHJcbiAgICAgICAgbGV0IHJldDogT2JqZWN0ID0ge307XHJcbiAgICAgICAgbGV0IHNlbEFycmF5OiBOb2RlSW5mb1tdID0gdGhpcy5nZXRTZWxlY3RlZE5vZGVzQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJldFtzZWxBcnJheVtpXS5pZF0gPSBzZWxBcnJheVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBHZXRzIHNlbGVjdGVkIG5vZGVzIGFzIE5vZGVJbmZvLmphdmEgb2JqZWN0cyBhcnJheSAqL1xyXG4gICAgZ2V0U2VsZWN0ZWROb2Rlc0FycmF5ID0gZnVuY3Rpb24oKTogTm9kZUluZm9bXSB7XHJcbiAgICAgICAgbGV0IHNlbEFycmF5OiBOb2RlSW5mb1tdID0gW107XHJcbiAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodWlkIGluIG1ldGE2NC5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2VsZWN0ZWROb2RlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm9kZUluZm9SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcywgbm9kZSkge1xyXG4gICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgbWluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAocmVzLm93bmVycykge1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gb3duZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbm9kZS5vd25lciA9IG93bmVyQnVmO1xyXG4gICAgICAgICAgICBsZXQgZWxtSWQgPSBcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkO1xyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChlbG1JZCk7XHJcbiAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbUlkLCBcImNyZWF0ZWQtYnktb3RoZXJcIiwgXCJjcmVhdGVkLWJ5LW1lXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbUlkLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU5vZGVJbmZvID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8pIHtcclxuICAgICAgICB1dGlsLmpzb248R2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczogR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBtZXRhNjQudXBkYXRlTm9kZUluZm9SZXNwb25zZShyZXMsIG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgZ2V0Tm9kZUZyb21JZCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBOb2RlSW5mbyB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5pZFRvTm9kZU1hcFtpZF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aE9mVWlkID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiW3BhdGggZXJyb3IuIGludmFsaWQgdWlkOiBcIiArIHVpZCArIFwiXVwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEhpZ2hsaWdodGVkTm9kZSA9IGZ1bmN0aW9uKCk6IE5vZGVJbmZvIHtcclxuICAgICAgICBsZXQgcmV0OiBOb2RlSW5mbyA9IG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFttZXRhNjQuY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0Um93QnlJZCA9IGZ1bmN0aW9uKGlkLCBzY3JvbGwpOiB2b2lkIHtcclxuICAgICAgICB2YXIgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0Tm9kZUZyb21JZChpZCk7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgc2Nyb2xsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpZ2hsaWdodFJvd0J5SWQgZmFpbGVkIHRvIGZpbmQgaWQ6IFwiICsgaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSW1wb3J0YW50OiBXZSB3YW50IHRoaXMgdG8gYmUgdGhlIG9ubHkgbWV0aG9kIHRoYXQgY2FuIHNldCB2YWx1ZXMgb24gJ3BhcmVudFVpZFRvRm9jdXNOb2RlTWFwJywgYW5kIGFsd2F5c1xyXG4gICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIGhpZ2hsaWdodE5vZGUgPSBmdW5jdGlvbihub2RlOiBOb2RlSW5mbywgc2Nyb2xsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBkb25lSGlnaGxpZ2h0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIFVuaGlnaGxpZ2h0IGN1cnJlbnRseSBoaWdobGlnaHRlZCBub2RlIGlmIGFueSAqL1xyXG4gICAgICAgIGxldCBjdXJIaWdobGlnaHRlZE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW21ldGE2NC5jdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWxyZWFkeSBoaWdobGlnaHRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZCA9IGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKFwiI1wiICsgcm93RWxtSWQsIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkb25lSGlnaGxpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFttZXRhNjQuY3VycmVudE5vZGVVaWRdID0gbm9kZTtcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dFbG1JZDogc3RyaW5nID0gbm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gZmluZCByb3dFbGVtZW50IHRvIGhpZ2hsaWdodDogXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKFwiI1wiICsgcm93RWxtSWQsIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVhbGx5IG5lZWQgdG8gdXNlIHB1Yi9zdWIgZXZlbnQgdG8gYnJvYWRjYXN0IGVuYWJsZW1lbnQsIGFuZCBsZXQgZWFjaCBjb21wb25lbnQgZG8gdGhpcyBpbmRlcGVuZGVudGx5IGFuZFxyXG4gICAgICogZGVjb3VwbGVcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICBsZXQgcHJldlBhZ2VFeGlzdHM6IGJvb2xlYW4gPSBuYXYubWFpbk9mZnNldCA+IDA7XHJcbiAgICAgICAgbGV0IG5leHRQYWdlRXhpc3RzOiBib29sZWFuID0gIW5hdi5lbmRSZWFjaGVkO1xyXG4gICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGxldCBzZWxOb2RlSXNNaW5lOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIChoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lIHx8IFwiYWRtaW5cIiA9PT0gbWV0YTY0LnVzZXJOYW1lKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiaG9tZU5vZGVJZD1cIittZXRhNjQuaG9tZU5vZGVJZCtcIiBoaWdobGlnaHROb2RlLmlkPVwiK2hpZ2hsaWdodE5vZGUuaWQpO1xyXG4gICAgICAgIGxldCBob21lTm9kZVNlbGVjdGVkOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIG1ldGE2NC5ob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgbGV0IGltcG9ydEZlYXR1cmVFbmFibGVkID0gbWV0YTY0LmlzQWRtaW5Vc2VyIHx8IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuaW1wb3J0QWxsb3dlZDtcclxuICAgICAgICBsZXQgZXhwb3J0RmVhdHVyZUVuYWJsZWQgPSBtZXRhNjQuaXNBZG1pblVzZXIgfHwgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5leHBvcnRBbGxvd2VkO1xyXG4gICAgICAgIGxldCBoaWdobGlnaHRPcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShoaWdobGlnaHROb2RlKTtcclxuICAgICAgICBsZXQgbnVtQ2hpbGROb2RlczogbnVtYmVyID0gbWV0YTY0LmdldE51bUNoaWxkTm9kZXMoKTtcclxuICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gKGhpZ2hsaWdodE9yZGluYWwgPiAwICYmIG51bUNoaWxkTm9kZXMgPiAxKSB8fCBwcmV2UGFnZUV4aXN0cztcclxuICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSAoaGlnaGxpZ2h0T3JkaW5hbCA8IG51bUNoaWxkTm9kZXMgLSAxICYmIG51bUNoaWxkTm9kZXMgPiAxKSB8fCBuZXh0UGFnZUV4aXN0cztcclxuXHJcbiAgICAgICAgLy90b2RvLTA6IG5lZWQgdG8gYWRkIHRvIHRoaXMgc2VsTm9kZUlzTWluZSB8fCBzZWxQYXJlbnRJc01pbmU7XHJcbiAgICAgICAgbGV0IGNhbkNyZWF0ZU5vZGUgPSBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIChtZXRhNjQuaXNBZG1pblVzZXIgfHwgKCFtZXRhNjQuaXNBbm9uVXNlciAvKiAmJiBzZWxOb2RlSXNNaW5lICovKSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5hYmxlbWVudDogaXNBbm9uVXNlcj1cIiArIG1ldGE2NC5pc0Fub25Vc2VyICsgXCIgc2VsTm9kZUNvdW50PVwiICsgc2VsTm9kZUNvdW50ICsgXCIgc2VsTm9kZUlzTWluZT1cIiArIHNlbE5vZGVJc01pbmUpO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJuYXZMb2dvdXRCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgbWV0YTY0LmlzQW5vblVzZXIpO1xyXG5cclxuICAgICAgICBsZXQgcHJvcHNUb2dnbGU6IGJvb2xlYW4gPSBtZXRhNjQuY3VycmVudE5vZGUgJiYgIW1ldGE2NC5pc0Fub25Vc2VyO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInByb3BzVG9nZ2xlQnV0dG9uXCIsIHByb3BzVG9nZ2xlKTtcclxuXHJcbiAgICAgICAgbGV0IGFsbG93RWRpdE1vZGU6IGJvb2xlYW4gPSBtZXRhNjQuY3VycmVudE5vZGUgJiYgIW1ldGE2NC5pc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cExldmVsQnV0dG9uXCIsIG1ldGE2NC5jdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjdXRTZWxOb2Rlc0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInBhc3RlU2VsTm9kZXNCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGVkaXQubm9kZXNUb01vdmUgIT0gbnVsbCAmJiAoc2VsTm9kZUlzTWluZSB8fCBob21lTm9kZVNlbGVjdGVkKSk7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVXBCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgbWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICh1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIG1ldGE2NC5pc0FkbWluVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbFxyXG4gICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBtZXRhNjQuYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBtZXRhNjQuaXNBZG1pblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlZnJlc2hQYWdlQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjcmVhdGVOb2RlQnV0dG9uXCIsIGNhbkNyZWF0ZU5vZGUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5JbXBvcnREbGdcIiwgaW1wb3J0RmVhdHVyZUVuYWJsZWQgJiYgKHNlbE5vZGVJc01pbmUgfHwgKGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBtZXRhNjQuaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkKSkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0RmVhdHVyZUVuYWJsZWQgJiYgKHNlbE5vZGVJc01pbmUgfHwgKGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBtZXRhNjQuaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkKSkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFkbWluTWVudVwiLCBtZXRhNjQuaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAvL1ZJU0lCSUxJVFlcclxuXHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXBMZXZlbEJ1dHRvblwiLCBtZXRhNjQuY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIG1ldGE2NC5pc0FkbWluVXNlciB8fCAodXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBtZXRhNjQuaXNBZG1pblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInByb3BzVG9nZ2xlQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkxvZ2luRGxnQnV0dG9uXCIsIG1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJuYXZMb2dvdXRCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBtZXRhNjQuYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgLy9Ub3AgTGV2ZWwgTWVudSBWaXNpYmlsaXR5XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiYWRtaW5NZW51XCIsIG1ldGE2NC5pc0FkbWluVXNlcik7XHJcblxyXG4gICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXHJcbiAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTaW5nbGVTZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpOiBOb2RlSW5mbyB7XHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nO1xyXG4gICAgICAgIGZvciAodWlkIGluIG1ldGE2NC5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvdW5kIGEgc2luZ2xlIFNlbCBOb2RlSUQ6IFwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T3JkaW5hbE9mTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoIW5vZGUgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TnVtQ2hpbGROb2RlcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnROb2RlRGF0YSA9IGZ1bmN0aW9uKGRhdGEpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGUgPSBkYXRhLm5vZGU7XHJcbiAgICAgICAgbWV0YTY0LmN1cnJlbnROb2RlVWlkID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVQYXRoID0gZGF0YS5ub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IEFub25QYWdlTG9hZFJlc3BvbnNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBsaXN0dmlldyB0bzogXCIgKyByZXMuY29udGVudCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQmluYXJ5QnlVaWQgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUudWlkID09PSB1aWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUuaGFzQmluYXJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdXBkYXRlcyBjbGllbnQgc2lkZSBtYXBzIGFuZCBjbGllbnQtc2lkZSBpZGVudGlmaWVyIGZvciBuZXcgbm9kZSwgc28gdGhhdCB0aGlzIG5vZGUgaXMgJ3JlY29nbml6ZWQnIGJ5IGNsaWVudFxyXG4gICAgICogc2lkZSBjb2RlXHJcbiAgICAgKi9cclxuICAgIGluaXROb2RlID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHVwZGF0ZU1hcHM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGFzc2lnbiBhIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgdGhpcyBub2RlIHR5cGUsIEknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHVzaW5nIHNvbWUga2luZCBvZiBjdXN0b20gSlNcclxuICAgICAgICAgKiBwcm90b3R5cGUtcmVsYXRlZCBhcHByb2FjaFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUudWlkID0gdXBkYXRlTWFwcyA/IHV0aWwuZ2V0VWlkRm9ySWQobWV0YTY0LmlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogbWV0YTY0LmlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRm9yIHRoZXNlIHR3byBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFjY2Vzc2VkIGZyZXF1ZW50bHkgd2UgZ28gYWhlYWQgYW5kIGxvb2t1cCB0aGUgcHJvcGVydGllcyBpbiB0aGVcclxuICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgKiBzaW1wbGlmeSBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgbm9kZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5MQVNUX01PRElGSUVELCBub2RlKSk7XHJcblxyXG4gICAgICAgIGlmICh1cGRhdGVNYXBzKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwW25vZGUuaWRdID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENvbnN0YW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHV0aWwuYWRkQWxsKG1ldGE2NC5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3QsIFsgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUE9MSUNZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgdXRpbC5hZGRBbGwobWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlVVSUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVEX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgIHV0aWwuYWRkQWxsKG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3QsIFtqY3JDbnN0LkJJTl9EQVRBXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdEFwcCBydW5uaW5nLlwiKTtcblxuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBwb2RjYXN0LnJlbmRlckZlZWROb2RlO1xuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBwb2RjYXN0LnJlbmRlckl0ZW1Ob2RlO1xuICAgICAgICBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBwb2RjYXN0LnByb3BPcmRlcmluZ0ZlZWROb2RlO1xuICAgICAgICBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBwb2RjYXN0LnByb3BPcmRlcmluZ0l0ZW1Ob2RlO1xuXG4gICAgICAgIG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gc3lzdGVtZm9sZGVyLnJlbmRlck5vZGU7XG4gICAgICAgIG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gc3lzdGVtZm9sZGVyLnByb3BPcmRlcmluZztcblxuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OmZpbGVsaXN0XCJdID0gc3lzdGVtZm9sZGVyLnJlbmRlckZpbGVMaXN0Tm9kZTtcbiAgICAgICAgbWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IHN5c3RlbWZvbGRlci5maWxlTGlzdFByb3BPcmRlcmluZztcblxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4gICAgICAgIC8vIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7IGlmICh0eXBlb2Ygb25yZXNpemUgPT09ICdmdW5jdGlvbicpIG9ucmVzaXplKCk7IC8qKiAuLi4gKi8gfVxuXG4gICAgICAgICg8YW55PndpbmRvdykuYWRkRXZlbnQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFdBUk5JTkc6IFRoaXMgaXMgY2FsbGVkIGluIHJlYWx0aW1lIHdoaWxlIHVzZXIgaXMgcmVzaXppbmcgc28gYWx3YXlzIHRocm90dGxlIGJhY2sgYW55IHByb2Nlc3Npbmcgc28gdGhhdCB5b3UgZG9uJ3RcbiAgICAgICAgICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAgICAgICAgICovXG4gICAgICAgIC8vICg8YW55PndpbmRvdykud2luZG93UmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhcIldpbmRvd1Jlc2l6ZTogdz1cIiArIHdpbmRvdy5pbm5lcldpZHRoICsgXCIgaD1cIiArIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gKDxhbnk+d2luZG93KS5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsICg8YW55PndpbmRvdykud2luZG93UmVzaXplKTtcblxuICAgICAgICAvLyB0aGlzIGNvbW1lbnRlZCBzZWN0aW9uIGlzIG5vdCB3b3JraW5nIGluIG15IG5ldyB4LWFwcCBjb2RlLCBidXQgaXQncyBvayB0byBjb21tZW50IGl0IG91dCBmb3Igbm93LlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGlzIG91ciB0ZW1wbGF0ZSBlbGVtZW50IGluIGluZGV4Lmh0bWxcbiAgICAgICAgLy8gdmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4LWFwcCcpO1xuICAgICAgICAvLyAvLyBMaXN0ZW4gZm9yIHRlbXBsYXRlIGJvdW5kIGV2ZW50IHRvIGtub3cgd2hlbiBiaW5kaW5nc1xuICAgICAgICAvLyAvLyBoYXZlIHJlc29sdmVkIGFuZCBjb250ZW50IGhhcyBiZWVuIHN0YW1wZWQgdG8gdGhlIHBhZ2VcbiAgICAgICAgLy8gYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhcHAgcmVhZHkgZXZlbnQhJyk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgICg8YW55PndpbmRvdykuYWRkRXZlbnRMaXN0ZW5lcigncG9seW1lci1yZWFkeScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogY25zdC5qc1wiKTtcblxuICAgICAgICAvL3RvZG8tMTogdHlwZXNjcmlwdCB3aWxsIG5vdyBsZXQgdXMganVzdCBkbyB0aGlzOiBjb25zdCB2YXI9J3ZhbHVlJztcblxuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5hcHBJbml0aWFsaXplZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBtZXRhNjQuYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC50YWJDaGFuZ2VFdmVudCh0YWJzLnNlbGVjdGVkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbWV0YTY0LmluaXRDb25zdGFudHMoKTtcclxuICAgICAgICBtZXRhNjQuZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgbWV0YTY0LmRldmljZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgbWV0YTY0LmRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgKiB0aGUgc2Vzc2lvbiwgYW5kIHRoZW4gcmVuZGVycyBwYWdlIGNvbnRlbnQsIGFmdGVyIHRoYXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBDaGVjayBmb3Igc2NyZWVuIHNpemUgaW4gYSB0aW1lci4gV2UgZG9uJ3Qgd2FudCB0byBtb25pdG9yIGFjdHVhbCBzY3JlZW4gcmVzaXplIGV2ZW50cyBiZWNhdXNlIGlmIGEgdXNlclxyXG4gICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAqIHRoaW5ncyBldmVyeSB0aW1lIGl0IGNoYW5nZXMuIFNvIHdlIHRocm90dGxlIGJhY2sgdG8gb25seSByZW9yZ2FuaXppbmcgdGhlIHNjcmVlbiBvbmNlIHBlciBzZWNvbmQuIFRoaXNcclxuICAgICAgICAgKiB0aW1lciBpcyBhIHRocm90dGxlIHNvcnQgb2YuIFllcyBJIGtub3cgaG93IHRvIGxpc3RlbiBmb3IgZXZlbnRzLiBObyBJJ20gbm90IGRvaW5nIGl0IHdyb25nIGhlcmUuIFRoaXNcclxuICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsgdmFyIHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBpZiAod2lkdGggIT0gXy5kZXZpY2VXaWR0aCkgeyAvLyBjb25zb2xlLmxvZyhcIlNjcmVlbiB3aWR0aCBjaGFuZ2VkOiBcIiArIHdpZHRoKTtcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBfLnNjcmVlblNpemVDaGFuZ2UoKTsgfSB9LCAxNTAwKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgbWV0YTY0LnVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdXRpbC5pbml0UHJvZ3Jlc3NNb25pdG9yKCk7XHJcblxyXG4gICAgICAgIG1ldGE2NC5wcm9jZXNzVXJsUGFyYW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2Vzc1VybFBhcmFtcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0YTY0LnVybENtZCA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwiY21kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0YWJOYW1lID09IFwic2VhcmNoVGFiTmFtZVwiKSB7XHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoVGFiQWN0aXZhdGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlTaWdudXBNZXNzYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAobWV0YTY0LmN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShtZXRhNjQuY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmVhY2gobWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgIG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbm9uUGFnZUhvbWUgPSBmdW5jdGlvbihpZ25vcmVVcmwpOiB2b2lkIHtcclxuICAgICAgICB1dGlsLmpzb248QW5vblBhZ2VMb2FkUmVxdWVzdCwgQW5vblBhZ2VMb2FkUmVzcG9uc2U+KFwiYW5vblBhZ2VMb2FkXCIsIHtcclxuICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgfSwgbWV0YTY0LmFub25QYWdlTG9hZFJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlVXNlclByZWZlcmVuY2VzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdXRpbC5qc29uPFNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBTYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgXCJ1c2VyUHJlZmVyZW5jZXNcIjogbWV0YTY0LnVzZXJQcmVmZXJlbmNlc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5TeXN0ZW1GaWxlID0gZnVuY3Rpb24oZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHV0aWwuanNvbjxPcGVuU3lzdGVtRmlsZVJlcXVlc3QsIE9wZW5TeXN0ZW1GaWxlUmVzcG9uc2U+KFwib3BlblN5c3RlbUZpbGVcIiwge1xyXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IGZpbGVOYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdFN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbmV3IEVkaXRTeXN0ZW1GaWxlRGxnKGZpbGVOYW1lKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxubGV0IG1ldGE2NDogTWV0YTY0ID0gbmV3IE1ldGE2NCgpO1xyXG5cbmNsYXNzIE5hdiB7XHJcbiAgICBfVUlEX1JPV0lEX1NVRkZJWDogc3RyaW5nID0gXCJfcm93XCI7XHJcblxyXG4gICAgLyogdG9kby0wOiBldmVudHVhbGx5IHdoZW4gd2UgZG8gcGFnaW5nIGZvciBvdGhlciBsaXN0cywgd2Ugd2lsbCBuZWVkIGEgc2V0IG9mIHRoZXNlIHZhcmlhYmxlcyBmb3IgZWFjaCBsaXN0IGRpc3BsYXkgKGkuZS4gc2VhcmNoLCB0aW1lbGluZSwgZXRjKSAqL1xyXG4gICAgbWFpbk9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIGVuZFJlYWNoZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qIHRvZG8tMDogbmVlZCB0byBoYXZlIHRoaXMgdmFsdWUgcGFzc2VkIGZyb20gc2VydmVyIHJhdGhlciB0aGFuIGNvZGVkIGluIFR5cGVTY3JpcHQgKi9cclxuICAgIFJPV1NfUEVSX1BBR0U6IG51bWJlciA9IDI1O1xyXG5cclxuICAgIG9wZW5NYWluTWVudUhlbHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdXRpbC5qc29uPFJlbmRlck5vZGVSZXF1ZXN0LCBSZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL21ldGE2NC9wdWJsaWMvaGVscFwiLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5Sc3NGZWVkc05vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdXRpbC5qc29uPFJlbmRlck5vZGVSZXF1ZXN0LCBSZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL3Jzcy9mZWVkc1wiLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAvKiBJJ20gc2V0dGluZyB0aGlzIGhlcmUgc28gdGhhdCB3ZSBjYW4gY29tZSB1cCB3aXRoIGEgd2F5IHRvIG1ha2UgdGhlIGFiYnJldiBleHBhbmQgc3RhdGUgYmUgcmVtZW1iZXJlZCwgYnV0dG9uXHJcbiAgICAgICAgdGhpcyBpcyBsb3dlciBwcmlvcml0eSBmb3Igbm93LCBzbyBpJ20gbm90IHVzaW5nIGl0IHlldCAqL1xyXG4gICAgICAgIG1ldGE2NC5leHBhbmRlZEFiYnJldk5vZGVJZHNbbm9kZUlkXSA9IHRydWU7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0LCBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZT4oXCJleHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWRcclxuICAgICAgICB9LCBuYXYuZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlZBTDogXCIrSlNPTi5zdHJpbmdpZnkocmVzLm5vZGVJbmZvKSk7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZUluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5aW5nSG9tZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJlbnRWaXNpYmxlVG9Vc2VyID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICFuYXYuZGlzcGxheWluZ0hvbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cExldmVsUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IFJlbmRlck5vZGVSZXNwb25zZSwgaWQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLm5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gZGF0YSBpcyB2aXNpYmxlIHRvIHlvdSBhYm92ZSB0aGlzIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZChpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZVcExldmVsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICghbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGF0IHJvb3QuIENhbid0IGdvIHVwLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IGZvciBub3cgYW4gdXBsZXZlbCB3aWxsIHJlc2V0IHRvIHplcm8gb2Zmc2V0LCBidXQgZXZlbnR1YWxseSBJIHdhbnQgdG8gaGF2ZSBlYWNoIGxldmVsIG9mIHRoZSB0cmVlLCBiZSBhYmxlIHRvXHJcbiAgICAgICAgcmVtZW1iZXIgd2hpY2ggb2Zmc2V0IGl0IHdhcyBhdCBzbyB3aGVuIHVzZXIgZHJpbGxzIGRvd24sIGFuZCB0aGVuIGNvbWVzIGJhY2sgb3V0LCB0aGV5IHBhZ2UgYmFjayBvdXQgZnJvbSB0aGUgc2FtZSBwYWdlcyB0aGV5XHJcbiAgICAgICAgZHJpbGxlZCBkb3duIGZyb20gKi9cclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb248UmVuZGVyTm9kZVJlcXVlc3QsIFJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiAxLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBSZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgbmF2LnVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGdldFNlbGVjdGVkRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBuYXYuX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGdldFNlbGVjdGVkUG9seUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIG5hdi5fVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHV0aWwubG9nQW5kVGhyb3coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgKi9cclxuICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICogaWYgbm9uLW51bGwgaXQncyBhbHJlYWR5IGRpc3BsYXlpbmcgYW5kIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyB1cGRhdGVOb2RlSW5mb1wiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51cGRhdGVOb2RlSW5mbyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuTm9kZSA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShub2RlLmlkLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAqIGluIFBvbG1lciBhdCBhbGwsIGFuZCBzaW5jZSBvbkNsaWNrIHJ1bnMgQkVGT1JFIHRoZSBzdGF0ZSBjaGFuZ2UgaXMgY29tcGxldGVkLCB0aGF0IGlzIHRoZSByZWFzb24gZm9yIHRoZVxyXG4gICAgICogc2lsbHkgbG9va2luZyBhc3luYyB0aW1lciBoZXJlLlxyXG4gICAgICovXHJcbiAgICB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHRvZ2dsZUJ1dHRvbjogYW55ID0gdXRpbC5wb2x5RWxtKHVpZCArIFwiX3NlbFwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZQYWdlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBSZW5kZXJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB1dGlsLmpzb248UmVuZGVyTm9kZVJlcXVlc3QsIFJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdlB1YmxpY0hvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgIH1cclxufVxyXG5sZXQgbmF2OiBOYXYgPSBuZXcgTmF2KCk7XHJcblxuY2xhc3MgUHJlZnMge1xuXHJcbiAgICBjbG9zZUFjY291bnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczogQ2xvc2VBY2NvdW50UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPaCBObyFcIiwgXCJDbG9zZSB5b3VyIEFjY291bnQ/PHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPENsb3NlQWNjb3VudFJlcXVlc3QsIENsb3NlQWNjb3VudFJlc3BvbnNlPihcImNsb3NlQWNjb3VudFwiLCB7fSwgcHJlZnMuY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxubGV0IHByZWZzOiBQcmVmcyA9IG5ldyBQcmVmcygpO1xuXG5jbGFzcyBQcm9wcyB7XHJcblxyXG4gICAgb3JkZXJQcm9wcyA9IGZ1bmN0aW9uKHByb3BPcmRlcjogc3RyaW5nW10sIF9wcm9wczogUHJvcGVydHlJbmZvW10pOiBQcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgbGV0IHByb3BzTmV3OiBQcm9wZXJ0eUluZm9bXSA9IHV0aWwuYXJyYXlDbG9uZShfcHJvcHMpO1xyXG4gICAgICAgIGxldCB0YXJnZXRJZHg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcE9yZGVyKSB7XHJcbiAgICAgICAgICAgIHRhcmdldElkeCA9IHByb3BzLm1vdmVOb2RlUG9zaXRpb24ocHJvcHNOZXcsIHRhcmdldElkeCwgcHJvcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZU5vZGVQb3NpdGlvbiA9IGZ1bmN0aW9uKHByb3BzOiBQcm9wZXJ0eUluZm9bXSwgaWR4OiBudW1iZXIsIHR5cGVOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHV0aWwuYXJyYXlJbmRleE9mSXRlbUJ5UHJvcChwcm9wcywgXCJuYW1lXCIsIHR5cGVOYW1lKTtcclxuICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCBpZHgrKyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRvZ2dsZXMgZGlzcGxheSBvZiBwcm9wZXJ0aWVzIGluIHRoZSBndWkuXHJcbiAgICAgKi9cclxuICAgIHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIC8vIHNldERhdGFJY29uVXNpbmdJZChcIiNlZGl0TW9kZUJ1dHRvblwiLCBlZGl0TW9kZSA/IFwiZWRpdFwiIDpcclxuICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgLy8gdmFyIGVsbSA9ICQoXCIjcHJvcHNUb2dnbGVCdXR0b25cIik7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSk6IHZvaWQge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IGVkaXQuZWRpdE5vZGUucHJvcGVydGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpY2UgaXMgaG93IHlvdSBkZWxldGUgYXJyYXkgZWxlbWVudHMgaW4ganMuXHJcbiAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAqIG5vZGUgYW5kIHB1dHMgaXQgb24gdGhlIHRvcCwgYW5kIHRoZW4gZG9lcyBzYW1lIGZvciAnamN0Q25zdC5UQUdTJ1xyXG4gICAgICovXHJcbiAgICBnZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIgPSBmdW5jdGlvbihub2RlOiBOb2RlSW5mbywgX3Byb3BzOiBQcm9wZXJ0eUluZm9bXSk6IFByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYyhub2RlLCBfcHJvcHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3BzTmV3OiBQcm9wZXJ0eUluZm9bXSA9IHV0aWwuYXJyYXlDbG9uZShfcHJvcHMpO1xyXG4gICAgICAgIHByb3BzLm1vdmVQcm9wc1RvVG9wKFtqY3JDbnN0LkNPTlRFTlQsIGpjckNuc3QuVEFHU10sIHByb3BzTmV3KTtcclxuICAgICAgICBwcm9wcy5tb3ZlUHJvcHNUb0VuZChbamNyQ25zdC5DUkVBVEVELCBqY3JDbnN0LkNSRUFURURfQlksIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgamNyQ25zdC5MQVNUX01PRElGSUVEX0JZXSwgcHJvcHNOZXcpO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyogTW92ZXMgYWxsIHRoZSBwcm9wZXJ0aWVzIGxpc3RlZCBpbiBwcm9wTGlzdCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIGtlZXBzIHRoZW0gaW4gdGhlIG9yZGVyIHNwZWNpZmllZCAqL1xyXG4gICAgcHJpdmF0ZSBtb3ZlUHJvcHNUb1RvcCA9IGZ1bmN0aW9uKHByb3BzTGlzdDogc3RyaW5nW10sIHByb3BzOiBQcm9wZXJ0eUluZm9bXSkge1xyXG4gICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCB0YWdJZHggPSB1dGlsLmFycmF5SW5kZXhPZkl0ZW1CeVByb3AocHJvcHMsIFwibmFtZVwiLCBwcm9wKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5hcnJheU1vdmVJdGVtKHByb3BzLCB0YWdJZHgsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIE1vdmVzIGFsbCB0aGUgcHJvcGVydGllcyBsaXN0ZWQgaW4gcHJvcExpc3QgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCBrZWVwcyB0aGVtIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgKi9cclxuICAgIHByaXZhdGUgbW92ZVByb3BzVG9FbmQgPSBmdW5jdGlvbihwcm9wc0xpc3Q6IHN0cmluZ1tdLCBwcm9wczogUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgdGFnSWR4ID0gdXRpbC5hcnJheUluZGV4T2ZJdGVtQnlQcm9wKHByb3BzLCBcIm5hbWVcIiwgcHJvcCk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCBwcm9wcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbCBvciBhIGxpc3Qgb2YgUHJvcGVydHlJbmZvIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIHJlbmRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihwcm9wZXJ0aWVzKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBsZXQgdGFibGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wZXJ0eS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRkOiBzdHJpbmcgPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1uYW1lLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BlcnR5Lm5hbWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0JpbmFyeVByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gXCJbYmluYXJ5XVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSByZW5kZXIud3JhcEh0bWwocHJvcGVydHkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHByb3BzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0ZCArPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS12YWwtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YWJsZSArPSByZW5kZXIudGFnKFwidHJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1yb3dcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHRkKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3BlcnR5Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm9wQ291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwidGFibGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJib3JkZXJcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcGVydHktdGFibGVcIlxyXG4gICAgICAgICAgICB9LCB0YWJsZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGJydXRlIGZvcmNlIHNlYXJjaGVzIG9uIG5vZGUgKE5vZGVJbmZvLmphdmEpIG9iamVjdCBwcm9wZXJ0aWVzIGxpc3QsIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBwcm9wZXJ0eVxyXG4gICAgICogKFByb3BlcnR5SW5mby5qYXZhKSB3aXRoIG5hbWUgbWF0Y2hpbmcgcHJvcGVydHlOYW1lLCBlbHNlIG51bGwuXHJcbiAgICAgKi9cclxuICAgIGdldE5vZGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IFByb3BlcnR5SW5mbyB7XHJcbiAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcHJvcDogUHJvcGVydHlJbmZvID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAocHJvcC5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVQcm9wZXJ0eVZhbCA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHByb3A6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAqL1xyXG4gICAgaXNOb25Pd25lZE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGRvbid0IGtub3cgd2hvIG93bnMgdGhpcyBub2RlIGFzc3VtZSB0aGUgYWRtaW4gb3ducyBpdC5cclxuICAgICAgICBpZiAoIWNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkQnkgPSBcImFkbWluXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUaGlzIGlzIE9SIGNvbmRpdGlvbiBiZWNhdXNlIG9mIGNyZWF0ZWRCeSBpcyBudWxsIHdlIGFzc3VtZSB3ZSBkbyBub3Qgb3duIGl0ICovXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAqL1xyXG4gICAgaXNOb25Pd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGlzT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICByZW5kZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5KTogc3RyaW5nIHtcclxuICAgICAgICAvKiBJZiB0aGlzIGlzIGEgc2luZ2xlLXZhbHVlIHR5cGUgcHJvcGVydHkgKi9cclxuICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG5cclxuICAgICAgICAgICAgLyogaWYgcHJvcGVydHkgaXMgbWlzc2luZyByZXR1cm4gZW1wdHkgc3RyaW5nICovXHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWUgfHwgcHJvcGVydHkudmFsdWUubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydHkudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGVsc2UgcmVuZGVyIG11bHRpLXZhbHVlIHByb3BlcnR5ICovXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAkLmVhY2godmFsdWVzLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbmxldCBwcm9wczogUHJvcHMgPSBuZXcgUHJvcHMoKTtcclxuXHJcbmNsYXNzIFJlbmRlciB7XHJcbiAgICBwcml2YXRlIGRlYnVnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcbiAgICAgKiB3YW50IHRvIGdpdmUgdGhlbSBzb21lIGluc3RydWN0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gYWRkIGNvbnRlbnQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0RW1wdHlQYWdlUHJvbXB0ID0gZnVuY3Rpb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlckJpbmFyeSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChub2RlLmJpbmFyeUlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSW1hZ2VUYWcobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IGFuIGltYWdlIHdlIHJlbmRlciBhIGxpbmsgdG8gdGhlIGF0dGFjaG1lbnQsIHNvIHRoYXQgaXQgY2FuIGJlIGRvd25sb2FkZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3I6IHN0cmluZyA9IHJlbmRlci50YWcoXCJhXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaHJlZlwiOiByZW5kZXIuZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSlcclxuICAgICAgICAgICAgfSwgXCJbRG93bmxvYWQgQXR0YWNobWVudF1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYmluYXJ5LWxpbmtcIlxyXG4gICAgICAgICAgICB9LCBhbmNob3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSW1wb3J0YW50IGxpdHRsZSBtZXRob2QgaGVyZS4gQWxsIEdVSSBwYWdlL2RpdnMgYXJlIGNyZWF0ZWQgdXNpbmcgdGhpcyBzb3J0IG9mIHNwZWNpZmljYXRpb24gaGVyZSB0aGF0IHRoZXlcclxuICAgICAqIGFsbCBtdXN0IGhhdmUgYSAnYnVpbGQnIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCBmaXJzdCB0aW1lIG9ubHksIGFuZCB0aGVuIHRoZSAnaW5pdCcgbWV0aG9kIGNhbGxlZCBiZWZvcmUgZWFjaFxyXG4gICAgICogdGltZSB0aGUgY29tcG9uZW50IGdldHMgZGlzcGxheWVkIHdpdGggbmV3IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIElmICdkYXRhJyBpcyBwcm92aWRlZCwgdGhpcyBpcyB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlkUGFnZSA9IGZ1bmN0aW9uKHBnLCBkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidWlsZFBhZ2U6IHBnLmRvbUlkPVwiICsgcGcuZG9tSWQpO1xyXG5cclxuICAgICAgICBpZiAoIXBnLmJ1aWx0IHx8IGRhdGEpIHtcclxuICAgICAgICAgICAgcGcuYnVpbGQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBnLmJ1aWx0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwZy5pbml0KSB7XHJcbiAgICAgICAgICAgIHBnLmluaXQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkUm93SGVhZGVyID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHNob3dQYXRoOiBib29sZWFuLCBzaG93TmFtZTogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2PlwiO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKGNvbW1lbnRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5Db21tZW50IEJ5OiBcIiArIGNvbW1lbnRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgIH0gLy9cclxuICAgICAgICBlbHNlIGlmIChub2RlLmNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChub2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5DcmVhdGVkIEJ5OiBcIiArIG5vZGUuY3JlYXRlZEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ICs9IGA8c3BhbiBpZD0nb3duZXJEaXNwbGF5JHtub2RlLnVpZH0nPjwvc3Bhbj5gO1xyXG4gICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IGAgIE1vZDogJHtub2RlLmxhc3RNb2RpZmllZH1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogb24gcm9vdCBub2RlIG5hbWUgd2lsbCBiZSBlbXB0eSBzdHJpbmcgc28gZG9uJ3Qgc2hvdyB0aGF0XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBjb21tZW50aW5nOiBJIGRlY2lkZWQgdXNlcnMgd2lsbCB1bmRlcnN0YW5kIHRoZSBwYXRoIGFzIGEgc2luZ2xlIGxvbmcgZW50aXR5IHdpdGggbGVzcyBjb25mdXNpb24gdGhhblxyXG4gICAgICAgICAqIGJyZWFraW5nIG91dCB0aGUgbmFtZSBmb3IgdGhlbS4gVGhleSBhbHJlYWR5IHVuc2Vyc3RhbmQgaW50ZXJuZXQgVVJMcy4gVGhpcyBpcyB0aGUgc2FtZSBjb25jZXB0LiBObyBuZWVkXHJcbiAgICAgICAgICogdG8gYmFieSB0aGVtLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlICFzaG93UGF0aCBjb25kaXRpb24gaGVyZSBpcyBiZWNhdXNlIGlmIHdlIGFyZSBzaG93aW5nIHRoZSBwYXRoIHRoZW4gdGhlIGVuZCBvZiB0aGF0IGlzIGFsd2F5cyB0aGVcclxuICAgICAgICAgKiBuYW1lLCBzbyB3ZSBkb24ndCBuZWVkIHRvIHNob3cgdGhlIHBhdGggQU5EIHRoZSBuYW1lLiBPbmUgaXMgYSBzdWJzdHJpbmcgb2YgdGhlIG90aGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChzaG93TmFtZSAmJiAhc2hvd1BhdGggJiYgbm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gYE5hbWU6ICR7bm9kZS5uYW1lfSBbdWlkPSR7bm9kZS51aWR9XWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJoZWFkZXItdGV4dFwiXHJcbiAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAqIHByZXR0aWZpZXIgdG8gcHJvY2VzcyBpdCB0aGUgcmVzdCBvZiB0aGUgd2F5ICh3aGVuIHdlIGNhbGwgcHJldHR5UHJpbnQoKSBmb3IgdGhlIHdob2xlIHBhZ2UpIHdlIG5vdyBydW5cclxuICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgKi9cclxuICAgIGluamVjdENvZGVGb3JtYXR0aW5nID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIWNvbnRlbnQpIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgLy8gYGBganNcclxuICAgICAgICAvLyB2YXIgeCA9IDEwO1xyXG4gICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgLy9cclxuICAgICAgICBpZiAodXRpbC5jb250YWlucyhjb250ZW50LCBcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gcmVuZGVyLmVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgY29udGVudCA9IHV0aWwucmVwbGFjZUFsbChjb250ZW50LCBcIjwvY29kZT5cIiwgXCI8L3ByZT5cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBpbmplY3RTdWJzdGl0dXRpb25zID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdXRpbC5yZXBsYWNlQWxsKGNvbnRlbnQsIFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCI8Y29kZSBjbGFzcz1cXFwiXCIgKyBsYW5nc1tpXSArIFwiXFxcIj5cIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGVudCA9IHV0aWwucmVwbGFjZUFsbChjb250ZW50LCBcIjxjb2RlPlwiLCBcIjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGFmdGVyIGEgcHJvcGVydHksIG9yIG5vZGUgaXMgdXBkYXRlZCAoc2F2ZWQpIHdlIGNhbiBub3cgY2FsbCB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIHJlZnJlc2hpbmcgdGhlIGVudGlyZSBwYWdlXHJcbiAgICB3aGljaCBpcyB3aGF0J3MgZG9uZSBpbiBtb3N0IG9mIHRoZSBhcHAsIHdoaWNoIGlzIG11Y2ggbGVzcyBlZmZpY2llbnQgYW5kIHNuYXBweSB2aXN1YWxseSAqL1xyXG4gICAgcmVmcmVzaE5vZGVPblBhZ2UgPSBmdW5jdGlvbihub2RlOiBOb2RlSW5mbyk6IHZvaWQge1xyXG4gICAgICAgIC8vbmVlZCB0byBsb29rdXAgdWlkIGZyb20gTm9kZUluZm8uaWQgdGhlbiBzZXQgdGhlIGNvbnRlbnQgb2YgdGhpcyBkaXYuXHJcbiAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgIC8vdG8gdGhlIHZhbHVlIGZyb20gcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtZXRhNjQuaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICBpZiAoIXVpZCkgdGhyb3cgYFVuYWJsZSB0byBmaW5kIG5vZGVJZCAke25vZGUuaWR9IGluIHVpZCBtYXBgO1xyXG4gICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlLCBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHVpZCAhPSBub2RlLnVpZCkgdGhyb3cgXCJ1aWQgY2hhbmdlZCB1bmV4cGVjdGx5IGFmdGVyIGluaXROb2RlXCI7XHJcbiAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAqIGFwcCBhbmQgaXMgd2hhdCB0aGUgdXNlciBzZWVzIGNvdmVyaW5nIDkwJSBvZiB0aGUgc2NyZWVuIG1vc3Qgb2YgdGhlIHRpbWUuIFRoZSBcImNvbnRlbnQqIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIHRvZG8tMDogUmF0aGVyIHRoYW4gaGF2aW5nIHRoaXMgbm9kZSByZW5kZXJlciBpdHNlbGYgYmUgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyBhbGwgdGhlIGRpZmZlcmVudCB0eXBlc1xyXG4gICAgICogb2Ygbm9kZXMsIG5lZWQgYSBtb3JlIHBsdWdnYWJsZSBkZXNpZ24sIHdoZXJlIHJlbmRlaW5nIG9mIGRpZmZlcmVudCB0aGluZ3MgaXMgZGVsZXRhZ2VkIHRvIHNvbWVcclxuICAgICAqIGFwcHJvcHJpYXRlIG9iamVjdC9zZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIHJlbmRlck5vZGVDb250ZW50ID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluLCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSByZW5kZXIuZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKTtcclxuXHJcbiAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICBpZiAobWV0YTY0LnNob3dNZXRhRGF0YSkge1xyXG4gICAgICAgICAgICByZXQgKz0gc2hvd0hlYWRlciA/IHJlbmRlci5idWlsZFJvd0hlYWRlcihub2RlLCBzaG93UGF0aCwgc2hvd05hbWUpIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuc2hvd1Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmVuZGVyQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNwZWNpYWwgUmVuZGVyaW5nIGZvciBOb2RlcyB0aGF0IGhhdmUgYSBwbHVnaW4tcmVuZGVyZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbbm9kZS5wcmltYXJ5VHlwZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGZ1bmMobm9kZSwgcm93U3R5bGluZylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRQcm9wOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5DT05URU5ULCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHByb3BzLnJlbmRlclByb3BlcnR5KGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKiBqY3JDb250ZW50IGZvciBNQVJLRE9XTjpcXG5cIitqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlZENvbnRlbnQgPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwnPjwvZGl2PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c2NyaXB0IHR5cGU9J3RleHQvbWFya2Rvd24nPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zY3JpcHQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vV2hlbiBkb2luZyBzZXJ2ZXItc2lkZSBtYXJrZG93biB3ZSBoYWQgdGhpcyBwcm9jZXNzaW5nIHRoZSBIVE1MIHRoYXQgd2FzIGdlbmVyYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vYnV0IEkgaGF2ZW4ndCBsb29rZWQgaW50byBob3cgdG8gZ2V0IHRoaXMgYmFjayBub3cgdGhhdCB3ZSBhcmUgZG9pbmcgbWFya2Rvd24gb24gY2xpZW50LlxyXG4gICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdENvZGVGb3JtYXR0aW5nKGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdFN1YnN0aXR1dGlvbnMoamNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG1hcmtlZENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgbWFya2VkQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXRoLnRyaW0oKSA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBcIlJvb3QgTm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPGRpdj5bTm8gQ29udGVudCBQcm9wZXJ0eV08L2Rpdj5cIjtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzOiBzdHJpbmcgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbmRlckJpbiAmJiBub2RlLmhhc0JpbmFyeSkge1xyXG4gICAgICAgICAgICBsZXQgYmluYXJ5OiBzdHJpbmcgPSByZW5kZXIucmVuZGVyQmluYXJ5KG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgYXBwZW5kIHRoZSBiaW5hcnkgaW1hZ2Ugb3IgcmVzb3VyY2UgbGluayBlaXRoZXIgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dCBvciBhdCB0aGUgbG9jYXRpb24gd2hlcmVcclxuICAgICAgICAgICAgICogdGhlIHVzZXIgaGFzIHB1dCB7e2luc2VydC1hdHRhY2htZW50fX0gaWYgdGhleSBhcmUgdXNpbmcgdGhhdCB0byBtYWtlIHRoZSBpbWFnZSBhcHBlYXIgaW4gYSBzcGVjaWZpY1xyXG4gICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jb250YWlucyhyZXQsIGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCBjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IGJpbmFyeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRhZ3M6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlRBR1MsIG5vZGUpO1xyXG4gICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0YWdzLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBcIlRhZ3M6IFwiICsgdGFncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkgPSBmdW5jdGlvbihqc29uQ29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb246IFwiICsganNvbkNvbnRlbnQpO1xyXG4gICAgICAgICAgICBsZXQgbGlzdDogYW55W10gPSBKU09OLnBhcnNlKGpzb25Db250ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVudHJ5IG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN5c3RlbUZpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogYG1ldGE2NC5lZGl0U3lzdGVtRmlsZSgnJHtlbnRyeS5maWxlTmFtZX0nKWBcclxuICAgICAgICAgICAgICAgIH0sIGVudHJ5LmZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBvcGVuU3lzdGVtRmlsZSB3b3JrZWQgb24gbGludXgsIGJ1dCBpJ20gc3dpdGNoaW5nIHRvIGZ1bGwgdGV4dCBmaWxlIGVkaXQgY2FwYWJpbGl0eSBvbmx5IGFuZCBkb2luZyB0aGF0XHJcbiAgICAgICAgICAgICAgICBpbnNpZGUgbWV0YTY0IGZyb20gbm93IG9uLCBzbyBvcGVuU3lzdGVtRmlsZSBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxvY2FsT3BlbkxpbmsgPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibWV0YTY0Lm9wZW5TeXN0ZW1GaWxlKCdcIiArIGVudHJ5LmZpbGVOYW1lICsgXCInKVwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LCBcIkxvY2FsIE9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGRvd25sb2FkTGluayA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAvL2hhdmVuJ3QgaW1wbGVtZW50ZWQgZG93bmxvYWQgY2FwYWJpbGl0eSB5ZXQuXHJcbiAgICAgICAgICAgICAgICAvLyB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibWV0YTY0LmRvd25sb2FkU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJEb3dubG9hZFwiKVxyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxpbmtzRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGxvY2FsT3BlbkxpbmsgKyBkb3dubG9hZExpbmspO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnRlbnQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGZpbGVOYW1lRGl2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJyZW5kZXIgZmFpbGVkXCIsIGUpO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gXCJbcmVuZGVyIGZhaWxlZF1cIlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgKi9cclxuICAgIHJlbmRlck5vZGVBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBub2RlLnVpZDtcclxuICAgICAgICBsZXQgcHJldlBhZ2VFeGlzdHM6IGJvb2xlYW4gPSBuYXYubWFpbk9mZnNldCA+IDA7XHJcbiAgICAgICAgbGV0IG5leHRQYWdlRXhpc3RzOiBib29sZWFuID0gIW5hdi5lbmRSZWFjaGVkO1xyXG4gICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSAoaW5kZXggPiAwICYmIHJvd0NvdW50ID4gMSkgfHwgcHJldlBhZ2VFeGlzdHM7XHJcbiAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gKGluZGV4IDwgY291bnQgLSAxKSB8fCBuZXh0UGFnZUV4aXN0cztcclxuXHJcbiAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gdXRpbC5zdGFydHNXaXRoKG5vZGUubmFtZSwgXCJyZXA6XCIpIHx8IC8qXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKi91dGlsLmNvbnRhaW5zKG5vZGUucGF0aCwgXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGVkaXRpbmdBbGxvd2VkOiBib29sZWFuID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG4gICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSBlZGl0aW5nQWxsb3dlZD1cIitlZGl0aW5nQWxsb3dlZCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaWYgbm90IHNlbGVjdGVkIGJ5IGJlaW5nIHRoZSBuZXcgY2hpbGQsIHRoZW4gd2UgdHJ5IHRvIHNlbGVjdCBiYXNlZCBvbiBpZiB0aGlzIG5vZGUgd2FzIHRoZSBsYXN0IG9uZVxyXG4gICAgICAgICAqIGNsaWNrZWQgb24gZm9yIHRoaXMgcGFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRlc3Q6IFtcIiArIHBhcmVudElkVG9Gb2N1c0lkTWFwW2N1cnJlbnROb2RlSWRdXHJcbiAgICAgICAgLy8gK1wiXT09W1wiKyBub2RlLmlkICsgXCJdXCIpXHJcbiAgICAgICAgbGV0IGZvY3VzTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gKGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQpO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uQmFySHRtbFJldDogc3RyaW5nID0gcmVuZGVyLm1ha2VSb3dCdXR0b25CYXJIdG1sKG5vZGUsIGNhbk1vdmVVcCwgY2FuTW92ZURvd24sIGVkaXRpbmdBbGxvd2VkKTtcclxuICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IHJlbmRlci5nZXROb2RlQmtnSW1hZ2VTdHlsZShub2RlKTtcclxuXHJcbiAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnJHt1aWR9Jyk7YCwgLy9cclxuICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgXCJzdHlsZVwiOiBia2dTdHlsZVxyXG4gICAgICAgIH0sLy9cclxuICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgfSwgcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd05vZGVVcmwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IHV0aWwuc3RyaXBJZlN0YXJ0c1dpdGgobm9kZS5wYXRoLCBcIi9yb290XCIpO1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIj9pZD1cIiArIHBhdGg7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgIGxldCB1dWlkOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJqY3I6dXVpZFwiLCBub2RlKTtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb3BSaWdodEltYWdlVGFnID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8pIHtcclxuICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgIGxldCB0b3BSaWdodEltZ1RhZzogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSByZW5kZXIudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRvcC1yaWdodC1pbWFnZVwiXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvcFJpZ2h0SW1nVGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVCa2dJbWFnZVN0eWxlID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBia2dJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGlmIChia2dJbWcpIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGFzIEkgd2FzIGNvbnZlcnRpbmdpIHNvbWUgc3RyaW5ncyB0byBiYWNrdGljayBpIG5vdGljZWQgdGhpcyBVUkwgbWlzc2luZyB0aGUgcXVvdGVzIGFyb3VuZCB0aGUgc3RyaW5nLiBJcyB0aGlzIGEgYnVnP1xyXG4gICAgICAgICAgICBia2dJbWdTdHlsZSA9IGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtia2dJbWd9KTtgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYmtnSW1nU3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2VudGVyQ29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZywgd2lkdGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGRpdjogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwic3R5bGVcIjogYHdpZHRoOiR7d2lkdGh9cHg7YCB9LCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGF0dHJzID0ge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dCB2ZXJ0aWNhbC1sYXlvdXQtcm93XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCBhdHRycywgZGl2LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zOiBzdHJpbmcsIGNsYXNzZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsZWZ0LWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvdyBcIiArIGNsYXNzZXNcclxuICAgICAgICB9LCBidXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCBjYW5Nb3ZlVXA6IGJvb2xlYW4sIGNhbk1vdmVEb3duOiBib29sZWFuLCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBub2RlKTtcclxuXHJcbiAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHNlbEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IG1vdmVOb2RlVXBCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IG1vdmVOb2RlRG93bkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgcmVwbHlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYGVkaXQucmVwbHlUb0NvbW1lbnQoJyR7bm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBidXR0b25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLyogQ29uc3RydWN0IE9wZW4gQnV0dG9uICovXHJcbiAgICAgICAgaWYgKHJlbmRlci5ub2RlSGFzQ2hpbGRyZW4obm9kZS51aWQpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBvcGVuQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRm9yIHNvbWUgdW5rbm93biByZWFzb24gdGhlIGFiaWxpdHkgdG8gc3R5bGUgdGhpcyB3aXRoIHRoZSBjbGFzcyBicm9rZSwgYW5kIGV2ZW5cclxuICAgICAgICAgICAgICAgIGFmdGVyIGRlZGljYXRpbmcgc2V2ZXJhbCBob3VycyB0cnlpbmcgdG8gZmlndXJlIG91dCB3aHkgSSdtIHN0aWxsIGJhZmZsZWQuIEkgY2hlY2tlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICBoZXJlIHRvIGFjY29tcGxpc2ggdGhlIHNhbWUgdGhpbmcgKi9cclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG5hdi5vcGVuTm9kZSgnJHtub2RlLnVpZH0nKTtgLy9cclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiT3BlblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgaW4gZWRpdCBtb2RlIHdlIGFsd2F5cyBhdCBsZWFzdCBjcmVhdGUgdGhlIHBvdGVudGlhbCAoYnV0dG9ucykgZm9yIGEgdXNlciB0byBpbnNlcnQgY29udGVudCwgYW5kIGlmXHJcbiAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgKiBpbnRlbGxpZ2VuY2UgdG8gd2hlbiB0byBzaG93IHRoZXNlIGJ1dHRvbnMgb3Igbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRWRpdGluZyBhbGxvd2VkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1tub2RlLnVpZF0gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNzczogT2JqZWN0ID0gc2VsZWN0ZWQgPyB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2LnRvZ2dsZU5vZGVTZWwoJyR7bm9kZS51aWR9Jyk7YCxcclxuICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgIC8vcGFkZGluZyBpcyBhIGJhY2sgaGFjayB0byBtYWtlIGNoZWNrYm94IGxpbmUgdXAgd2l0aCBvdGhlciBpY29ucy5cclxuICAgICAgICAgICAgICAgIC8vKGkgd2lsbCBwcm9iYWJseSBlbmQgdXAgdXNpbmcgYSBwYXBlci1pY29uLWJ1dHRvbiB0aGF0IHRvZ2dsZXMgaGVyZSwgaW5zdGVhZCBvZiBjaGVja2JveClcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgIH0gOiAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2LnRvZ2dsZU5vZGVTZWwoJyR7bm9kZS51aWR9Jyk7YCxcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBjc3MsIFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgIWNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9cImljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5pbnNlcnROb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgIH0sIFwiSW5zXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1BvbG1lciBJY29ucyBSZWZlcmVuY2U6IGh0dHBzOi8vZWxlbWVudHMucG9seW1lci1wcm9qZWN0Lm9yZy9lbGVtZW50cy9pcm9uLWljb25zP3ZpZXc9ZGVtbzpkZW1vL2luZGV4Lmh0bWxcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYWx0XCI6IFwiRWRpdCBub2RlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImVkaXRvcjptb2RlLWVkaXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5ydW5FZGl0Tm9kZSgnJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5NT1ZFX1VQRE9XTl9PTl9UT09MQkFSICYmIG1ldGE2NC5jdXJyZW50Tm9kZS5jaGlsZHJlbk9yZGVyZWQgJiYgIWNvbW1lbnRCeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlVXApIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZVVwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctdXB3YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5tb3ZlTm9kZVVwKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlRG93bkJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LWRvd253YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5tb3ZlTm9kZURvd24oJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaSB3aWxsIGJlIGZpbmRpbmcgYSByZXVzYWJsZS9EUlkgd2F5IG9mIGRvaW5nIHRvb2x0b3BzIHNvb24sIHRoaXMgaXMganVzdCBteSBmaXJzdCBleHBlcmltZW50LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSG93ZXZlciB0b29sdGlwcyBBTFdBWVMgY2F1c2UgcHJvYmxlbXMuIE15c3RlcnkgZm9yIG5vdy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGFkZE5vZGVUb29sdGlwOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAvL1x0XHRcdCB9LCBcIkFERFMgYSBuZXcgbm9kZSBpbnNpZGUgdGhlIGN1cnJlbnQgbm9kZSwgYXMgYSBjaGlsZCBvZiBpdC5cIik7XHJcblxyXG4gICAgICAgIGxldCBhbGxCdXR0b25zOiBzdHJpbmcgPSBzZWxCdXR0b24gKyBvcGVuQnV0dG9uICsgaW5zZXJ0Tm9kZUJ1dHRvbiArIGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBpbnNlcnROb2RlVG9vbHRpcFxyXG4gICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgIHJldHVybiBhbGxCdXR0b25zLmxlbmd0aCA+IDAgPyByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zLCBcInJvdy10b29sYmFyXCIpIDogXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0ID0gZnVuY3Rpb24oY29udGVudD86IHN0cmluZywgZXh0cmFDbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiICsgKGV4dHJhQ2xhc3NlcyA/IChcIiBcIiArIGV4dHJhQ2xhc3NlcykgOiBcIlwiKVxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlSG9yekNvbnRyb2xHcm91cCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIlxyXG4gICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VSYWRpb0J1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGlkXHJcbiAgICAgICAgfSwgbGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5vZGVJZCAoc2VlIG1ha2VOb2RlSWQoKSkgTm9kZUluZm8gb2JqZWN0IGhhcyAnaGFzQ2hpbGRyZW4nIHRydWVcclxuICAgICAqL1xyXG4gICAgbm9kZUhhc0NoaWxkcmVuID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gbm9kZUhhc0NoaWxkcmVuOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNDaGlsZHJlbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0UGF0aCA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgIHBhdGggPSB1dGlsLnJlcGxhY2VBbGwocGF0aCwgXCIvXCIsIFwiIC8gXCIpO1xyXG4gICAgICAgIGxldCBzaG9ydFBhdGg6IHN0cmluZyA9IHBhdGgubGVuZ3RoIDwgNTAgPyBwYXRoIDogcGF0aC5zdWJzdHJpbmcoMCwgNDApICsgXCIuLi5cIjtcclxuXHJcbiAgICAgICAgbGV0IG5vUm9vdFBhdGg6IHN0cmluZyA9IHNob3J0UGF0aDtcclxuICAgICAgICBpZiAodXRpbC5zdGFydHNXaXRoKG5vUm9vdFBhdGgsIFwiL3Jvb3RcIikpIHtcclxuICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gc2hvcnRQYXRoIDogbm9Sb290UGF0aDtcclxuICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHdyYXBIdG1sID0gZnVuY3Rpb24odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbmRlcnMgcGFnZSBhbmQgYWx3YXlzIGFsc28gdGFrZXMgY2FyZSBvZiBzY3JvbGxpbmcgdG8gc2VsZWN0ZWQgbm9kZSBpZiB0aGVyZSBpcyBvbmUgdG8gc2Nyb2xsIHRvXHJcbiAgICAgKi9cclxuICAgIHJlbmRlclBhZ2VGcm9tRGF0YSA9IGZ1bmN0aW9uKGRhdGE/OiBSZW5kZXJOb2RlUmVzcG9uc2UsIHNjcm9sbFRvVG9wPzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpXCIpO1xyXG5cclxuICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdEYXRhID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5hdi5lbmRSZWFjaGVkID0gZGF0YSAmJiBkYXRhLmVuZFJlYWNoZWQ7XHJcblxyXG4gICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5ub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoXCJObyBjb250ZW50IGlzIGF2YWlsYWJsZSBoZXJlLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnVpZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICBtZXRhNjQuaWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkZW50VG9VaWRNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEknbSBjaG9vc2luZyB0byByZXNldCBzZWxlY3RlZCBub2RlcyB3aGVuIGEgbmV3IHBhZ2UgbG9hZHMsIGJ1dCB0aGlzIGlzIG5vdCBhIHJlcXVpcmVtZW50LiBJIGp1c3RcclxuICAgICAgICAgICAgICogZG9uJ3QgaGF2ZSBhIFwiY2xlYXIgc2VsZWN0aW9uc1wiIGZlYXR1cmUgd2hpY2ggd291bGQgYmUgbmVlZGVkIHNvIHVzZXIgaGFzIGEgd2F5IHRvIGNsZWFyIG91dC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKGRhdGEubm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcyA/IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA6IDA7XHJcblxyXG4gICAgICAgIGlmIChyZW5kZXIuZGVidWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dHB1dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IHJlbmRlci5nZXROb2RlQmtnSW1hZ2VTdHlsZShkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5PVEU6IG1haW5Ob2RlQ29udGVudCBpcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhZ2UgY29udGVudCwgYW5kIGlzIGFsd2F5cyB0aGUgbm9kZSBkaXNwbGF5ZWQgYXQgdGhlIHRvXHJcbiAgICAgICAgICogb2YgdGhlIHBhZ2UgYWJvdmUgYWxsIHRoZSBvdGhlciBub2RlcyB3aGljaCBhcmUgaXRzIGNoaWxkIG5vZGVzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBtYWluTm9kZUNvbnRlbnQ6IHN0cmluZyA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKG1haW5Ob2RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXI6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZE5vZGUoZGF0YS5ub2RlKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJlcGx5VG9Db21tZW50KCcke2RhdGEubm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBjbnN0Lk5FV19PTl9UT09MQkFSICYmIGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9pY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5jcmVhdGVTdWJOb2RlKCcke3VpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogQWRkIGVkaXQgYnV0dG9uIGlmIGVkaXQgbW9kZSBhbmQgdGhpcyBpc24ndCB0aGUgcm9vdCAqL1xyXG4gICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJ1bkVkaXROb2RlKCcke3VpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgbGV0IGZvY3VzTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgIC8vIHZhciByb3dIZWFkZXIgPSBidWlsZFJvd0hlYWRlcihkYXRhLm5vZGUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNyZWF0ZVN1Yk5vZGVCdXR0b24gfHwgZWRpdE5vZGVCdXR0b24gfHwgcmVwbHlCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBlZGl0Tm9kZUJ1dHRvbiArIHJlcGx5QnV0dG9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoc2VsZWN0ZWQgPyBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGFjdGl2ZS1yb3dcIiA6IFwibWFpbk5vZGVDb250ZW50U3R5bGUgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBuYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJyR7dWlkfScpO2AsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgIC8vJChcImFcIikuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTsgPC0tLS0gdGhpcyBkb2Vzbid0IHdvcmsuXHJcbiAgICAgICAgICAgIC8vICQoJyNtYWluTm9kZUNvbnRlbnQnKS5maW5kKFwiYVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZSBzdGF0dXMgYmFyLlwiKTtcclxuICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICBpZiAobmF2Lm1haW5PZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdEJ1dHRvbjogc3RyaW5nID0gcmVuZGVyLm1ha2VCdXR0b24oXCJGaXJzdCBQYWdlXCIsIFwiZmlyc3RQYWdlQnV0dG9uXCIsIHJlbmRlci5maXJzdFBhZ2UpO1xyXG4gICAgICAgICAgICBsZXQgcHJldkJ1dHRvbjogc3RyaW5nID0gcmVuZGVyLm1ha2VCdXR0b24oXCJQcmV2IFBhZ2VcIiwgXCJwcmV2UGFnZUJ1dHRvblwiLCByZW5kZXIucHJldlBhZ2UpO1xyXG4gICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGZpcnN0QnV0dG9uICsgcHJldkJ1dHRvbiwgXCJwYWdpbmctYnV0dG9uLWJhclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByb3dDb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRDb3VudDogbnVtYmVyID0gZGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hpbGRDb3VudDogXCIgKyBjaGlsZENvdW50KTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvblxyXG4gICAgICAgICAgICAgKiB0aGUgY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGlmICghZWRpdC5ub2Rlc1RvTW92ZVNldFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3c6IHN0cmluZyA9IHJlbmRlci5nZW5lcmF0ZVJvdyhpLCBub2RlLCBuZXdEYXRhLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgaWYgKHJvd0NvdW50ID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSByZW5kZXIuZ2V0RW1wdHlQYWdlUHJvbXB0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YS5lbmRSZWFjaGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXh0QnV0dG9uID0gcmVuZGVyLm1ha2VCdXR0b24oXCJOZXh0IFBhZ2VcIiwgXCJuZXh0UGFnZUJ1dHRvblwiLCByZW5kZXIubmV4dFBhZ2UpO1xyXG4gICAgICAgICAgICBsZXQgbGFzdEJ1dHRvbiA9IHJlbmRlci5tYWtlQnV0dG9uKFwiTGFzdCBQYWdlXCIsIFwibGFzdFBhZ2VCdXR0b25cIiwgcmVuZGVyLmxhc3RQYWdlKTtcclxuICAgICAgICAgICAgb3V0cHV0ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihuZXh0QnV0dG9uICsgbGFzdEJ1dHRvbiwgXCJwYWdpbmctYnV0dG9uLWJhclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIG91dHB1dCk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRPRE8tMzogSW5zdGVhZCBvZiBjYWxsaW5nIHNjcmVlblNpemVDaGFuZ2UgaGVyZSBpbW1lZGlhdGVseSwgaXQgd291bGQgYmUgYmV0dGVyIHRvIHNldCB0aGUgaW1hZ2Ugc2l6ZXNcclxuICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAqIHNldEh0bWwsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxUb1RvcCB8fCAhbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZpcnN0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlyc3QgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgIHZpZXcuZmlyc3RQYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldlBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXYgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgIHZpZXcucHJldlBhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV4dCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgdmlldy5uZXh0UGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxhc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMYXN0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICB2aWV3Lmxhc3RQYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVSb3cgPSBmdW5jdGlvbihpOiBudW1iZXIsIG5vZGU6IE5vZGVJbmZvLCBuZXdEYXRhOiBib29sZWFuLCBjaGlsZENvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlbmRlci5kZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5yZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3dbXCIgKyByb3dDb3VudCArIFwiXT1cIiArIHJvdyk7XHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuXHJcbiAgICBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHNlZSBhbHNvOiBtYWtlSW1hZ2VUYWcoKSAqL1xyXG4gICAgYWRqdXN0SW1hZ2VTaXplID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9ICQoXCIjXCIgKyBub2RlLmltZ0lkKTtcclxuICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IGVsbS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSBlbG0uYXR0cihcImhlaWdodFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgKiB3aGljaCB3ZSB3YW50LCBidXQgdGhlbiB3ZSBhbHNvIGxpbWl0IGl0IHdpdGggbWF4LXdpZHRoIHNvIG9uIHNtYWxsZXIgc2NyZWVuIGRldmljZXMgb3Igc21hbGxcclxuICAgICAgICAgICAgICAgICAqIHdpbmRvdyByZXNpemluZ3MgZXZlbiBvbiBkZXNrdG9wIGJyb3dzZXJzIHRoZSBpbWFnZSB3aWxsIGFsd2F5cyBiZSBlbnRpcmVseSB2aXNpYmxlIGFuZCBub3RcclxuICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vIHZhciBtYXhXaWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRE8gTk9UIERFTEVURSAoZm9yIGEgbG9uZyB0aW1lIGF0IGxlYXN0KSBUaGlzIGlzIHRoZSBvbGQgbG9naWMgZm9yIHJlc2l6aW5nIGltYWdlcyByZXNwb25zaXZlbHksXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgaXQgd29ya3MgZmluZSBidXQgbXkgbmV3IGxvZ2ljIGlzIGJldHRlciwgd2l0aCBsaW1pdGluZyBtYXggd2lkdGggYmFzZWQgb24gc2NyZWVuIHNpemUuIEJ1dFxyXG4gICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgbm9kZS53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHNlZSBhbHNvOiBhZGp1c3RJbWFnZVNpemUoKSAqL1xyXG4gICAgbWFrZUltYWdlVGFnID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8pIHtcclxuICAgICAgICBsZXQgc3JjOiBzdHJpbmcgPSByZW5kZXIuZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSk7XHJcbiAgICAgICAgbm9kZS5pbWdJZCA9IFwiaW1nVWlkX1wiICsgbm9kZS51aWQ7XHJcblxyXG4gICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBpbWFnZSB3b24ndCBmaXQgb24gc2NyZWVuIHdlIHdhbnQgdG8gc2l6ZSBpdCBkb3duIHRvIGZpdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBZZXMsIGl0IHdvdWxkIGhhdmUgYmVlbiBzaW1wbGVyIHRvIGp1c3QgdXNlIHNvbWV0aGluZyBsaWtlIHdpZHRoPTEwMCUgZm9yIHRoZSBpbWFnZSB3aWR0aCBidXQgdGhlblxyXG4gICAgICAgICAgICAgKiB0aGUgaGlnaHQgd291bGQgbm90IGJlIHNldCBleHBsaWNpdGx5IGFuZCB0aGF0IHdvdWxkIG1lYW4gdGhhdCBhcyBpbWFnZXMgYXJlIGxvYWRpbmcgaW50byB0aGUgcGFnZSxcclxuICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAqIGltYWdlIGNvbXBsZXRlcy4gV2hhdCB3ZSB3YW50IGlzIHRvIGhhdmUgaXQgc28gdGhhdCBvbmNlIHdlIHNldCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHNjcm9sbCBhXHJcbiAgICAgICAgICAgICAqIHBhcnRpY3VsYXIgcm93IGludG8gdmlldywgaXQgd2lsbCBzdGF5IHRoZSBjb3JyZWN0IHNjcm9sbCBsb2NhdGlvbiBFVkVOIEFTIHRoZSBpbWFnZXMgYXJlIHN0cmVhbWluZ1xyXG4gICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBzZXQgdGhlIHdpZHRoIHdlIHdhbnQgdG8gZ28gZm9yICovXHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiBJbWFnZSBkb2VzIGZpdCBvbiBzY3JlZW4gc28gcmVuZGVyIGl0IGF0IGl0J3MgZXhhY3Qgc2l6ZSAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogbm9kZS53aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkXHJcbiAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGNyZWF0ZXMgSFRNTCB0YWcgd2l0aCBhbGwgYXR0cmlidXRlcy92YWx1ZXMgc3BlY2lmaWVkIGluIGF0dHJpYnV0ZXMgb2JqZWN0LCBhbmQgY2xvc2VzIHRoZSB0YWcgYWxzbyBpZlxyXG4gICAgICogY29udGVudCBpcyBub24tbnVsbFxyXG4gICAgICovXHJcbiAgICB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgLyogZGVmYXVsdCBwYXJhbWV0ZXIgdmFsdWVzICovXHJcbiAgICAgICAgaWYgKHR5cGVvZiAoY2xvc2VUYWcpID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAvKiBIVE1MIHRhZyBpdHNlbGYgKi9cclxuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIjxcIiArIHRhZztcclxuXHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgcmV0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBTdHJpbmcodik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHdlIGludGVsbGlnZW50bHkgd3JhcCBzdHJpbmdzIHRoYXQgY29udGFpbiBzaW5nbGUgcXVvdGVzIGluIGRvdWJsZSBxdW90ZXMgYW5kIHZpY2UgdmVyc2FcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAodXRpbC5jb250YWlucyh2LCBcIidcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXQgKz0gayArIFwiPVxcXCJcIiArIHYgKyBcIlxcXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBgJHtrfT1cIiR7dn1cIiBgO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0ICs9IGsgKyBcIj0nXCIgKyB2ICsgXCInIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gYCR7a309JyR7dn0nIGA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbG9zZVRhZykge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcmV0ICs9IFwiPlwiICsgY29udGVudCArIFwiPC9cIiArIHRhZyArIFwiPlwiO1xyXG4gICAgICAgICAgICByZXQgKz0gYD4ke2NvbnRlbnR9PC8ke3RhZ30+YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXQgKz0gXCIvPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlVGV4dEFyZWEgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlRWRpdEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZVBhc3N3b3JkRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZXRhNjQtaW5wdXRcIlxyXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGF0dHJpYnMgPSB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWxsb3dQcm9wZXJ0eVRvRGlzcGxheSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3RbcHJvcE5hbWVdID09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaXNSZWFkT25seVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQmluYXJ5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gXCJzaW1wbGVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcE5hbWUgPT09IGpjckNuc3QuQ09OVEVOVCA/IFwiQ29udGVudFwiIDogcHJvcE5hbWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BOYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5sZXQgcmVuZGVyOiBSZW5kZXIgPSBuZXcgUmVuZGVyKCk7XHJcblxyXG5jbGFzcyBTZWFyY2gge1xyXG4gICAgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgIHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgc2VhcmNoT2Zmc2V0ID0gMDtcclxuICAgIHRpbWVsaW5lT2Zmc2V0ID0gMDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgKi9cclxuICAgIHNlYXJjaFJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgKi9cclxuICAgIHRpbWVsaW5lUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgKi9cclxuICAgIGhpZ2hsaWdodFJvd05vZGU6IE5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICovXHJcbiAgICBpZGVudFRvVWlkTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICpcclxuICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICB1aWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXTogTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgIG51bVNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3JjaC5zZWFyY2hSZXN1bHRzICE9IG51bGwgJiYgLy9cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggIT0gbnVsbCA/IC8vXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBhIGxvZ2dlZCBpbiB1c2VyIGNsaWNrcyB0aGUgc2VhcmNoIHRhYiwgYW5kIG5vIHNlYXJjaCByZXN1bHRzIGFyZSBjdXJyZW50bHkgZGlzcGxheWluZywgdGhlbiBnbyBhaGVhZFxyXG4gICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChzcmNoLm51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAobmV3IFNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBOb2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdHNQYW5lbCA9IG5ldyBTZWFyY2hSZXN1bHRzUGFuZWwoKTtcclxuICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbChcInNlYXJjaFJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICBzZWFyY2hSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZWxpbmVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczogTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgc3JjaC50aW1lbGluZVJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbChcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZSh0aW1lbGluZVJlc3VsdHNQYW5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoRmlsZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczogRmlsZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgIHV0aWwuanNvbjxSZW5kZXJOb2RlUmVxdWVzdCwgUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogMCxcclxuICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb248Tm9kZVNlYXJjaFJlcXVlc3QsIE5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5MQVNUX01PRElGSUVELFxyXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgIH0sIHNyY2gudGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZWxpbmVCeUNyZWF0ZVRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb248Tm9kZVNlYXJjaFJlcXVlc3QsIE5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5DUkVBVEVELFxyXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgIH0sIHNyY2gudGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNlYXJjaE5vZGUgPSBmdW5jdGlvbihub2RlOiBOb2RlSW5mbykge1xyXG4gICAgICAgIG5vZGUudWlkID0gdXRpbC5nZXRVaWRGb3JJZChzcmNoLmlkZW50VG9VaWRNYXAsIG5vZGUuaWQpO1xyXG4gICAgICAgIHNyY2gudWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZSA9IGZ1bmN0aW9uKGRhdGEsIHZpZXdOYW1lKSB7XHJcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgIHZhciBjaGlsZENvdW50ID0gZGF0YS5zZWFyY2hSZXN1bHRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAqIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3JjaC5pbml0U2VhcmNoTm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSBzcmNoLnJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWwodmlld05hbWUsIG91dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbmRlcnMgYSBzaW5nbGUgbGluZSBvZiBzZWFyY2ggcmVzdWx0cyBvbiB0aGUgc2VhcmNoIHJlc3VsdHMgcGFnZS5cclxuICAgICAqXHJcbiAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgKi9cclxuICAgIHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlLCBpbmRleCwgY291bnQsIHJvd0NvdW50KSB7XHJcblxyXG4gICAgICAgIHZhciB1aWQgPSBub2RlLnVpZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyBzcmNoLl9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFySHRtbCA9IHNyY2gubWFrZUJ1dHRvbkJhckh0bWwoXCJcIiArIHVpZCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBzcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJyR7dWlkfScpO2AsIC8vXHJcbiAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgIGJ1dHRvbkJhckh0bWwvL1xyXG4gICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9zcmNoX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICB2YXIgZ290b0J1dHRvbiA9IHJlbmRlci5tYWtlQnV0dG9uKFwiR28gdG8gTm9kZVwiLCB1aWQsIGBzcmNoLmNsaWNrU2VhcmNoTm9kZSgnJHt1aWR9Jyk7YCk7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrT25TZWFyY2hSZXN1bHRSb3cgPSBmdW5jdGlvbihyb3dFbG0sIHVpZCkge1xyXG4gICAgICAgIHNyY2gudW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICBzcmNoLmhpZ2hsaWdodFJvd05vZGUgPSBzcmNoLnVpZFRvTm9kZU1hcFt1aWRdO1xyXG5cclxuICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImluYWN0aXZlLXJvd1wiLCBcImFjdGl2ZS1yb3dcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2tTZWFyY2hOb2RlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVwZGF0ZSBoaWdobGlnaHQgbm9kZSB0byBwb2ludCB0byB0aGUgbm9kZSBjbGlja2VkIG9uLCBqdXN0IHRvIHBlcnNpc3QgaXQgZm9yIGxhdGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIXNyY2guaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIHVpZCBpbiBzZWFyY2ggcmVzdWx0czogXCIgKyB1aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCwgdHJ1ZSwgc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkKTtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBzdHlsaW5nIG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAqL1xyXG4gICAgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgIHZhciBub2RlSWQgPSBzcmNoLmhpZ2hsaWdodFJvd05vZGUudWlkICsgc3JjaC5fVUlEX1JPV0lEX1NVRkZJWDtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAvKiBjaGFuZ2UgY2xhc3Mgb24gZWxlbWVudCAqL1xyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmxldCBzcmNoOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XHJcblxyXG5jbGFzcyBTaGFyZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczogR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZShyZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNoYXJpbmdOb2RlOiBOb2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgKi9cclxuICAgIGVkaXROb2RlU2hhcmluZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBOb2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmUuc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFNoYXJlZE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGZvY3VzTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgdXRpbC5qc29uPEdldFNoYXJlZE5vZGVzUmVxdWVzdCwgR2V0U2hhcmVkTm9kZXNSZXNwb25zZT4oXCJnZXRTaGFyZWROb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgIH0sIHNoYXJlLmZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5sZXQgc2hhcmU6IFNoYXJlID0gbmV3IFNoYXJlKCk7XHJcblxyXG5jbGFzcyBVc2VyIHtcclxuXHJcbiAgICBwcml2YXRlIGxvZ291dFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBMb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZm9yIHRlc3RpbmcgcHVycG9zZXMsIEkgd2FudCB0byBhbGxvdyBjZXJ0YWluIHVzZXJzIGFkZGl0aW9uYWwgcHJpdmlsZWdlcy4gQSBiaXQgb2YgYSBoYWNrIGJlY2F1c2UgaXQgd2lsbCBnb1xyXG4gICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgKiB1c2UgdGhlc2UgbmFtZXNcclxuICAgICAqL1xyXG4gICAgaXNUZXN0VXNlckFjY291bnQgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImJvYlwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNvcnlcIiB8fCAvL1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcyk6IHZvaWQge1xyXG4gICAgICAgIHZhciB0aXRsZSA9IEJSQU5ESU5HX1RJVExFX1NIT1JUO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IElmIHVzZXJzIGdvIHdpdGggdmVyeSBsb25nIHVzZXJuYW1lcyB0aGlzIGlzIGdvbm5hIGJlIHVnbHkgKi9cclxuICAgICAgICBpZiAoIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIHRpdGxlICs9IFwiOlwiICsgcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiNoZWFkZXJBcHBOYW1lXCIpLmh0bWwodGl0bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFRPRE8tMzogbW92ZSB0aGlzIGludG8gbWV0YTY0IG1vZHVsZSAqL1xyXG4gICAgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBMb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVJZCA9IHJlcy5yb290Tm9kZS5pZDtcclxuICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlUGF0aCA9IHJlcy5yb290Tm9kZS5wYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQudXNlck5hbWUgPSByZXMudXNlck5hbWU7XHJcbiAgICAgICAgbWV0YTY0LmlzQWRtaW5Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFkbWluXCI7XHJcbiAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlID0gcmVzLmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2ggPSByZXMuYWxsb3dGaWxlU3lzdGVtU2VhcmNoO1xyXG5cclxuICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzID0gcmVzLnVzZXJQcmVmZXJlbmNlcztcclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG4gICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSByZXMudXNlclByZWZlcmVuY2VzLnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIHNlcnZlcjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uPVwiICsgbWV0YTY0LmVkaXRNb2RlT3B0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuU2lnbnVwUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IFNpZ251cERsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogV3JpdGUgYSBjb29raWUgdGhhdCBleHBpcmVzIGluIGEgeWVhciBmb3IgYWxsIHBhdGhzICovXHJcbiAgICB3cml0ZUNvb2tpZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbCk6IHZvaWQge1xyXG4gICAgICAgICQuY29va2llKG5hbWUsIHZhbCwge1xyXG4gICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1Z2x5LiBJdCBpcyB0aGUgYnV0dG9uIHRoYXQgY2FuIGJlIGxvZ2luICpvciogbG9nb3V0LlxyXG4gICAgICovXHJcbiAgICBvcGVuTG9naW5QZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsb2dpbkRsZzogTG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICBsb2dpbkRsZy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XHJcbiAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hMb2dpbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbi5cIik7XHJcblxyXG4gICAgICAgIGxldCBjYWxsVXNyOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGNhbGxQd2Q6IHN0cmluZztcclxuICAgICAgICBsZXQgdXNpbmdDb29raWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSB0cnVlXCIpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgdXNpbmdDb29raWVzID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxvZ2luU3RhdGU6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIHdlIGhhdmUga25vd24gc3RhdGUgYXMgbG9nZ2VkIG91dCwgdGhlbiBkbyBub3RoaW5nIGhlcmUgKi9cclxuICAgICAgICAgICAgaWYgKGxvZ2luU3RhdGUgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB1c3I6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgIGxldCBwd2Q6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29va2llVXNlcj1cIiArIHVzciArIFwiIHVzaW5nQ29va2llcyA9IFwiICsgdXNpbmdDb29raWVzKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248TG9naW5SZXF1ZXN0LCBMb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogY2FsbFVzcixcclxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogY2FsbFB3ZCxcclxuICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczogTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIubG9naW5SZXNwb25zZShyZXMsIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIucmVmcmVzaExvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCA9IGZ1bmN0aW9uKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICB1c2VyLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb248TG9nb3V0UmVxdWVzdCwgTG9nb3V0UmVzcG9uc2U+KFwibG9nb3V0XCIsIHt9LCB1c2VyLmxvZ291dFJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRGxnLCB1c3IsIHB3ZCkge1xyXG4gICAgICAgIHV0aWwuanNvbjxMb2dpblJlcXVlc3QsIExvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzcixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IExvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdXNlci5sb2dpblJlc3BvbnNlKHJlcywgdXNyLCBwd2QsIG51bGwsIGxvZ2luRGxnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVBbGxVc2VyQ29va2llcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IExvZ2luUmVzcG9uc2UsIHVzcj86IHN0cmluZywgcHdkPzogc3RyaW5nLCB1c2luZ0Nvb2tpZXM/OiBib29sZWFuLCBsb2dpbkRsZz86IExvZ2luRGxnKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTG9naW5cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luUmVzcG9uc2U6IHVzcj1cIiArIHVzciArIFwiIGhvbWVOb2RlT3ZlcnJpZGU6IFwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVzciAhPSBcImFub255bW91c1wiKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUiwgdXNyKTtcclxuICAgICAgICAgICAgICAgIHVzZXIud3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdELCBwd2QpO1xyXG4gICAgICAgICAgICAgICAgdXNlci53cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIxXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobG9naW5EbGcpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1c2VyLnNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGU6IFwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlIGlzIG51bGwuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBzZXQgSUQgdG8gYmUgdGhlIHBhZ2Ugd2Ugd2FudCB0byBzaG93IHVzZXIgcmlnaHQgYWZ0ZXIgbG9naW4gKi9cclxuICAgICAgICAgICAgbGV0IGlkOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1dGlsLmVtcHR5U3RyaW5nKHJlcy5ob21lTm9kZU92ZXJyaWRlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUgPSBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGxhc3ROb2RlPVwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVJZD1cIiArIG1ldGE2NC5ob21lTm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKGlkLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHVzZXIuc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJDb29raWUgbG9naW4gZmFpbGVkLlwiKSkub3BlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBibG93IGF3YXkgZmFpbGVkIGNvb2tpZSBjcmVkZW50aWFscyBhbmQgcmVsb2FkIHBhZ2UsIHNob3VsZCByZXN1bHQgaW4gYnJhbmQgbmV3IHBhZ2UgbG9hZCBhcyBhbm9uXHJcbiAgICAgICAgICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAgICAgICAgIHVzZXIud3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgIHByaXZhdGUgcmVmcmVzaExvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IExvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgdXNlci5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcbmxldCB1c2VyOiBVc2VyID0gbmV3IFVzZXIoKTtcclxuXHJcbmNsYXNzIFZpZXcge1xyXG5cclxuICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICB1cGRhdGVTdGF0dXNCYXIgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgc3RhdHVzTGluZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCIgU2VsZWN0aW9uczogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQobWV0YTY0LnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogbmV3SWQgaXMgb3B0aW9uYWwgcGFyYW1ldGVyIHdoaWNoLCBpZiBzdXBwbGllZCwgc2hvdWxkIGJlIHRoZSBpZCB3ZSBzY3JvbGwgdG8gd2hlbiBmaW5hbGx5IGRvbmUgd2l0aCB0aGVcclxuICAgICAqIHJlbmRlci5cclxuICAgICAqL1xyXG4gICAgcmVmcmVzaFRyZWVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IFJlbmRlck5vZGVSZXNwb25zZSwgdGFyZ2V0SWQ/OiBhbnksIHNjcm9sbFRvVG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLCBzY3JvbGxUb1RvcCk7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxUb1RvcCkge1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNtYWluTm9kZUNvbnRlbnRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIGFuZCBpZiBzcGVjaWZpZWQgbWFrZXMgdGhlIHBhZ2Ugc2Nyb2xsIHRvIGFuZCBoaWdobGlnaHQgdGhhdCBub2RlIHVwb24gcmUtcmVuZGVyaW5nLlxyXG4gICAgICovXHJcbiAgICByZWZyZXNoVHJlZSA9IGZ1bmN0aW9uKG5vZGVJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBoaWdobGlnaHRJZD86IGFueSwgaXNJbml0aWFsUmVuZGVyPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgIG5vZGVJZCA9IG1ldGE2NC5jdXJyZW50Tm9kZUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKCFoaWdobGlnaHRJZCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBoaWdobGlnaHRJZCA9IGN1cnJlbnRTZWxOb2RlICE9IG51bGwgPyBjdXJyZW50U2VsTm9kZS5pZCA6IG5vZGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgSSBkb24ndCBrbm93IG9mIGFueSByZWFzb24gJ3JlZnJlc2hUcmVlJyBzaG91bGQgaXRzZWxmIHJlc2V0IHRoZSBvZmZzZXQsIGJ1dCBJIGxlYXZlIHRoaXMgY29tbWVudCBoZXJlXHJcbiAgICAgICAgYXMgYSBoaW50IGZvciB0aGUgZnV0dXJlLlxyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAqL1xyXG4gICAgICAgIHV0aWwuanNvbjxSZW5kZXJOb2RlUmVxdWVzdCwgUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiByZW5kZXJQYXJlbnRJZkxlYWYgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IG5hdi5tYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczogUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSByZXMub2Zmc2V0T2ZOb2RlRm91bmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZVJlc3BvbnNlKHJlcywgaGlnaGxpZ2h0SWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlbmRlciAmJiBtZXRhNjQudXJsQ21kID09IFwiYWRkTm9kZVwiICYmIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0LmVkaXRNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG1ldGE2NC5jdXJyZW50Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlyc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGZpcnN0UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdmlldy5sb2FkUGFnZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldlBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgcHJldlBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgLT0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0IDwgMCkge1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZpZXcubG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHRQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ICs9IG5hdi5ST1dTX1BFUl9QQUdFO1xyXG4gICAgICAgIHZpZXcubG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGxhc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGxhc3RQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgIC8vbmF2Lm1haW5PZmZzZXQgKz0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgdmlldy5sb2FkUGFnZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRQYWdlID0gZnVuY3Rpb24oZ29Ub0xhc3RQYWdlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdXRpbC5qc29uPFJlbmRlck5vZGVSZXF1ZXN0LCBSZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogdHJ1ZSxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGdvVG9MYXN0UGFnZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczogUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChnb1RvTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gcmVzLm9mZnNldE9mTm9kZUZvdW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIG51bGwsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0b2RvLTM6IHRoaXMgc2Nyb2xsaW5nIGlzIHNsaWdodGx5IGltcGVyZmVjdC4gc29tZXRpbWVzIHRoZSBjb2RlIHN3aXRjaGVzIHRvIGEgdGFiLCB3aGljaCB0cmlnZ2Vyc1xyXG4gICAgICogc2Nyb2xsVG9Ub3AsIGFuZCB0aGVuIHNvbWUgb3RoZXIgY29kZSBzY3JvbGxzIHRvIGEgc3BlY2lmaWMgbG9jYXRpb24gYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlci4gdGhlXHJcbiAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgKiBhbmQgdGhlbiBzY3JvbGxpbmcgdG8gYSBkaWZmZXJlbnQgcGxhY2UgYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlcilcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsVG9TZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlbG06IGFueSA9IG5hdi5nZXRTZWxlY3RlZFBvbHlFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgLy8gdG9wIGluc3RlYWQuXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluQ29udGFpbmVyXCIpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiByZW1vdmVkIG1haW5QYXBlclRhYnMgZnJvbSB2aXNpYmlsaXR5LCBidXQgd2hhdCBjb2RlIHNob3VsZCBnbyBoZXJlIG5vdz9cclxuICAgICAgICAgICAgICAgIC8vIGVsbSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHNjcm9sbFRvVG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHZpZXcuc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvL2xldCBlID0gJChcIiNtYWluQ29udGFpbmVyXCIpO1xyXG4gICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcblxyXG4gICAgICAgIC8vdG9kby0wOiBub3QgdXNpbmcgbWFpblBhcGVyVGFicyBhbnkgbG9uZ2VyIHNvIHNodyBzaG91bGQgZ28gaGVyZSBub3cgP1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh2aWV3LnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQgPSBmdW5jdGlvbihkb21JZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IG5vZGU6IE5vZGVJbmZvID0gZWRpdC5lZGl0Tm9kZTtcclxuICAgICAgICBsZXQgZTogYW55ID0gJChcIiNcIiArIGRvbUlkKTtcclxuICAgICAgICBpZiAoIWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XHJcbiAgICAgICAgICAgIGUuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgZS5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhEaXNwbGF5ID0gXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gdG9kby0yOiBEbyB3ZSByZWFsbHkgbmVlZCBJRCBpbiBhZGRpdGlvbiB0byBQYXRoIGhlcmU/XHJcbiAgICAgICAgICAgIC8vIHBhdGhEaXNwbGF5ICs9IFwiPGJyPklEOiBcIiArIG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhdGhEaXNwbGF5ICs9IFwiPGJyPk1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLmh0bWwocGF0aERpc3BsYXkpO1xyXG4gICAgICAgICAgICBlLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NlcnZlckluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB1dGlsLmpzb248R2V0U2VydmVySW5mb1JlcXVlc3QsIEdldFNlcnZlckluZm9SZXNwb25zZT4oXCJnZXRTZXJ2ZXJJbmZvXCIsIHt9LCBmdW5jdGlvbihyZXM6IEdldFNlcnZlckluZm9SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcocmVzLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxubGV0IHZpZXc6IFZpZXcgPSBuZXcgVmlldygpO1xyXG5cclxuY2xhc3MgTWVudVBhbmVsIHtcclxuXHJcbiAgICBwcml2YXRlIG1ha2VUb3BMZXZlbE1lbnUgPSBmdW5jdGlvbih0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcGFwZXJJdGVtQXR0cnMgPSB7XHJcbiAgICAgICAgICAgIGNsYXNzOiBcIm1lbnUtdHJpZ2dlclwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcGVySXRlbSA9IHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHBhcGVySXRlbUF0dHJzLCB0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBwYXBlclN1Ym1lbnVBdHRycyA9IHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaWQpIHtcclxuICAgICAgICAgICAgKDxhbnk+cGFwZXJTdWJtZW51QXR0cnMpLmlkID0gaWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXN1Ym1lbnVcIiwgcGFwZXJTdWJtZW51QXR0cnNcclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwibWV0YTY0LW1lbnUtaGVhZGluZ1wiLFxyXG4gICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdFwiXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAsIHBhcGVySXRlbSArIC8vXCI8cGFwZXItaXRlbSBjbGFzcz0nbWVudS10cmlnZ2VyJz5cIiArIHRpdGxlICsgXCI8L3BhcGVyLWl0ZW0+XCIgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWFrZVNlY29uZExldmVsTGlzdChjb250ZW50KSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYWtlU2Vjb25kTGV2ZWxMaXN0ID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibWVudS1jb250ZW50IHN1Ymxpc3QgbXktbWVudS1zZWN0aW9uXCIsXHJcbiAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgIC8vLFxyXG4gICAgICAgICAgICAvL1wibXVsdGlcIjogXCJtdWx0aVwiXHJcbiAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtZW51SXRlbSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGljayxcclxuICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRvbUlkOiBzdHJpbmcgPSBcIm1haW5BcHBNZW51XCI7XHJcblxyXG4gICAgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gSSBlbmRlZCB1cCBub3QgcmVhbGx5IGxpa2luZyB0aGlzIHdheSBvZiBzZWxlY3RpbmcgdGFicy4gSSBjYW4ganVzdCB1c2Ugbm9ybWFsIHBvbHltZXIgdGFicy5cclxuICAgICAgICAvLyB2YXIgcGFnZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibWV0YTY0LnNlbGVjdFRhYignbWFpblRhYk5hbWUnKTtcIikgKyAvL1xyXG4gICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcInNlYXJjaFBhZ2VCdXR0b25cIiwgXCJtZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJUaW1lbGluZVwiLCBcInRpbWVsaW5lUGFnZUJ1dHRvblwiLCBcIm1ldGE2NC5zZWxlY3RUYWIoJ3RpbWVsaW5lVGFiTmFtZScpO1wiKTtcclxuICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHJzc0l0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiRmVlZHNcIiwgXCJtYWluTWVudVJzc1wiLCBcIm5hdi5vcGVuUnNzRmVlZHNOb2RlKCk7XCIpO1xyXG4gICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1lbnVQYW5lbC5tYWtlVG9wTGV2ZWxNZW51KFwiUlNTXCIsIHJzc0l0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJDcmVhdGVcIiwgXCJjcmVhdGVOb2RlQnV0dG9uXCIsIFwiZWRpdC5jcmVhdGVOb2RlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsIFwiKG5ldyBSZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJDdXRcIiwgXCJjdXRTZWxOb2Rlc0J1dHRvblwiLCBcImVkaXQuY3V0U2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJQYXN0ZVwiLCBcInBhc3RlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LnBhc3RlU2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwiZWRpdC5jbGVhclNlbGVjdGlvbnMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJJbXBvcnRcIiwgXCJvcGVuSW1wb3J0RGxnXCIsIFwiKG5ldyBJbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IEV4cG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiRGVsZXRlXCIsIFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpO1xyXG4gICAgICAgIHZhciBlZGl0TWVudSA9IG1lbnVQYW5lbC5tYWtlVG9wTGV2ZWxNZW51KFwiRWRpdFwiLCBlZGl0TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIG1vdmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJVcFwiLCBcIm1vdmVOb2RlVXBCdXR0b25cIiwgXCJlZGl0Lm1vdmVOb2RlVXAoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJEb3duXCIsIFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIFwiZWRpdC5tb3ZlTm9kZURvd24oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJ0byBUb3BcIiwgXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIFwiZWRpdC5tb3ZlTm9kZVRvVG9wKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwidG8gQm90dG9tXCIsIFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBcImVkaXQubW92ZU5vZGVUb0JvdHRvbSgpO1wiKTsvL1xyXG4gICAgICAgIHZhciBtb3ZlTWVudSA9IG1lbnVQYW5lbC5tYWtlVG9wTGV2ZWxNZW51KFwiTW92ZVwiLCBtb3ZlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBGaWxlXCIsIFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgXCJhdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tRmlsZURsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIlVwbG9hZCBmcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgXCJhdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tVXJsRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcImF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICB2YXIgYXR0YWNobWVudE1lbnUgPSBtZW51UGFuZWwubWFrZVRvcExldmVsTWVudShcIkF0dGFjaFwiLCBhdHRhY2htZW50TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXJpbmdNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJFZGl0IE5vZGUgU2hhcmluZ1wiLCBcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCBcInNoYXJlLmVkaXROb2RlU2hhcmluZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwic2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgIHZhciBzaGFyaW5nTWVudSA9IG1lbnVQYW5lbC5tYWtlVG9wTGV2ZWxNZW51KFwiU2hhcmVcIiwgc2hhcmluZ01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBzZWFyY2hNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJDb250ZW50XCIsIFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAvL3RvZG8tMDogbWFrZSBhIHZlcnNpb24gb2YgdGhlIGRpYWxvZyB0aGF0IGRvZXMgYSB0YWcgc2VhcmNoXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIlRhZ3NcIiwgXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IFNlYXJjaFRhZ3NEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIkZpbGVzXCIsIFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgU2VhcmNoRmlsZXNEbGcodHJ1ZSkpLm9wZW4oKTtcIik7XHJcblxyXG4gICAgICAgIHZhciBzZWFyY2hNZW51ID0gbWVudVBhbmVsLm1ha2VUb3BMZXZlbE1lbnUoXCJTZWFyY2hcIiwgc2VhcmNoTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbWVsaW5lTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiQ3JlYXRlZFwiLCBcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCBcInNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIk1vZGlmaWVkXCIsIFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCBcInNyY2gudGltZWxpbmVCeU1vZFRpbWUoKTtcIik7Ly9cclxuICAgICAgICB2YXIgdGltZWxpbmVNZW51ID0gbWVudVBhbmVsLm1ha2VUb3BMZXZlbE1lbnUoXCJUaW1lbGluZVwiLCB0aW1lbGluZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIlRvZ2dsZSBQcm9wZXJ0aWVzXCIsIFwicHJvcHNUb2dnbGVCdXR0b25cIiwgXCJwcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm1ldGE2NC5yZWZyZXNoKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiU2hvdyBVUkxcIiwgXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgXCJyZW5kZXIuc2hvd05vZGVVcmwoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJQcmVmZXJlbmNlc1wiLCBcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCBcIihuZXcgUHJlZnNEbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gbWVudVBhbmVsLm1ha2VUb3BMZXZlbE1lbnUoXCJWaWV3XCIsIHZpZXdPcHRpb25zTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgLy8gV09SSyBJTiBQUk9HUkVTUyAoIGRvIG5vdCBkZWxldGUpXHJcbiAgICAgICAgLy8gdmFyIGZpbGVTeXN0ZW1NZW51SXRlbXMgPSAvL1xyXG4gICAgICAgIC8vICAgICBtZW51SXRlbShcIlJlaW5kZXhcIiwgXCJmaWxlU3lzUmVpbmRleEJ1dHRvblwiLCBcInN5c3RlbWZvbGRlci5yZWluZGV4KCk7XCIpICsgLy9cclxuICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJTZWFyY2hcIiwgXCJmaWxlU3lzU2VhcmNoQnV0dG9uXCIsIFwic3lzdGVtZm9sZGVyLnNlYXJjaCgpO1wiKTsgLy9cclxuICAgICAgICAvLyAgICAgLy9tZW51SXRlbShcIkJyb3dzZVwiLCBcImZpbGVTeXNCcm93c2VCdXR0b25cIiwgXCJzeXN0ZW1mb2xkZXIuYnJvd3NlKCk7XCIpO1xyXG4gICAgICAgIC8vIHZhciBmaWxlU3lzdGVtTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJGaWxlU3lzXCIsIGZpbGVTeXN0ZW1NZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHdoYXRldmVyIGlzIGNvbW1lbnRlZCBpcyBvbmx5IGNvbW1lbnRlZCBmb3IgcG9seW1lciBjb252ZXJzaW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgQ2hhbmdlUGFzc3dvcmREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIk1hbmFnZSBBY2NvdW50XCIsIFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCBcIihuZXcgTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG5cclxuICAgICAgICAvLyBtZW51SXRlbShcIkZ1bGwgUmVwb3NpdG9yeSBFeHBvcnRcIiwgXCJmdWxsUmVwb3NpdG9yeUV4cG9ydFwiLCBcIlxyXG4gICAgICAgIC8vIGVkaXQuZnVsbFJlcG9zaXRvcnlFeHBvcnQoKTtcIikgKyAvL1xyXG4gICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWVudVBhbmVsLm1ha2VUb3BMZXZlbE1lbnUoXCJBY2NvdW50XCIsIG15QWNjb3VudEl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGFkbWluSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJHZW5lcmF0ZSBSU1NcIiwgXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBcInBvZGNhc3QuZ2VuZXJhdGVSU1MoKTtcIikgKy8vXHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5tZW51SXRlbShcIlNlcnZlciBJbmZvXCIsIFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgXCJ2aWV3LnNob3dTZXJ2ZXJJbmZvKCk7XCIpICsvL1xyXG4gICAgICAgICAgICBtZW51UGFuZWwubWVudUl0ZW0oXCJJbnNlcnQgQm9vazogV2FyIGFuZCBQZWFjZVwiLCBcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBcImVkaXQuaW5zZXJ0Qm9va1dhckFuZFBlYWNlKCk7XCIpOyAvL1xyXG4gICAgICAgIHZhciBhZG1pbk1lbnUgPSBtZW51UGFuZWwubWFrZVRvcExldmVsTWVudShcIkFkbWluXCIsIGFkbWluSXRlbXMsIFwiYWRtaW5NZW51XCIpO1xyXG5cclxuICAgICAgICB2YXIgaGVscEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudVBhbmVsLm1lbnVJdGVtKFwiTWFpbiBNZW51IEhlbHBcIiwgXCJtYWluTWVudUhlbHBcIiwgXCJuYXYub3Blbk1haW5NZW51SGVscCgpO1wiKTtcclxuICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWVudVBhbmVsLm1ha2VUb3BMZXZlbE1lbnUoXCJIZWxwL0RvY3NcIiwgaGVscEl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSAvKiBwYWdlTWVudSsgKi8gbWFpbk1lbnVSc3MgKyBlZGl0TWVudSArIG1vdmVNZW51ICsgYXR0YWNobWVudE1lbnUgKyBzaGFyaW5nTWVudSArIHZpZXdPcHRpb25zTWVudSAvKiArIGZpbGVTeXN0ZW1NZW51ICovICsgc2VhcmNoTWVudSArIHRpbWVsaW5lTWVudSArIG15QWNjb3VudE1lbnVcclxuICAgICAgICAgICAgKyBhZG1pbk1lbnUgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbChtZW51UGFuZWwuZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxufVxyXG5sZXQgbWVudVBhbmVsOiBNZW51UGFuZWwgPSBuZXcgTWVudVBhbmVsKCk7XHJcblxuLypcbk5PVEU6IFRoZSBBdWRpb1BsYXllckRsZyBBTkQgdGhpcyBzaW5nbGV0b24taXNoIGNsYXNzIGJvdGggc2hhcmUgc29tZSBzdGF0ZSBhbmQgY29vcGVyYXRlXG5cblJlZmVyZW5jZTogaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxuKi9cbmNsYXNzIFBvZGNhc3Qge1xuICAgIHBsYXllcjogYW55ID0gbnVsbDtcbiAgICBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSB1aWQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBub2RlOiBOb2RlSW5mbyA9IG51bGw7XG4gICAgcHJpdmF0ZSBhZFNlZ21lbnRzOiBBZFNlZ21lbnRbXSA9IG51bGw7XG5cbiAgICBwcml2YXRlIHB1c2hUaW1lcjogYW55ID0gbnVsbDtcblxuICAgIGdlbmVyYXRlUlNTID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIHV0aWwuanNvbjxHZW5lcmF0ZVJTU1JlcXVlc3QsIEdlbmVyYXRlUlNTUmVzcG9uc2U+KFwiZ2VuZXJhdGVSU1NcIiwge1xuICAgICAgICB9LCBwb2RjYXN0LmdlbmVyYXRlUlNTUmVzcG9uc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVSU1NSZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBhbGVydCgncnNzIGNvbXBsZXRlLicpO1xuICAgIH1cblxuICAgIHJlbmRlckZlZWROb2RlID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgdGl0bGU6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgIGxldCBkZXNjOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZERlc2NcIiwgbm9kZSk7XG4gICAgICAgIGxldCBpbWdVcmw6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIiwgbm9kZSk7XG5cbiAgICAgICAgbGV0IGZlZWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgfSwgdGl0bGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgIH0sIGRlc2MudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgfSwgZmVlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbWdVcmwpIHtcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiaW1nXCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWF4LXdpZHRoOiAyMDBweDtcIixcbiAgICAgICAgICAgICAgICBcInNyY1wiOiBpbWdVcmwudmFsdWVcbiAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGxpbms6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtTGlua1wiLCBub2RlKTtcbiAgICAgICAgaWYgKGxpbmsgJiYgbGluay52YWx1ZSAmJiB1dGlsLmNvbnRhaW5zKGxpbmsudmFsdWUudG9Mb3dlckNhc2UoKSwgXCIubXAzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbGluay52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB1cmk6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuICAgICAgICBpZiAodXJpICYmIHVyaS52YWx1ZSAmJiB1dGlsLmNvbnRhaW5zKHVyaS52YWx1ZS50b0xvd2VyQ2FzZSgpLCBcIi5tcDNcIikpIHtcbiAgICAgICAgICAgIHJldHVybiB1cmkudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW5jVXJsOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1VybFwiLCBub2RlKTtcbiAgICAgICAgaWYgKGVuY1VybCAmJiBlbmNVcmwudmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBlbmNUeXBlOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1R5cGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAoZW5jVHlwZSAmJiBlbmNUeXBlLnZhbHVlICYmIHV0aWwuc3RhcnRzV2l0aChlbmNUeXBlLnZhbHVlLCBcImF1ZGlvL1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNVcmwudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZW5kZXJJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IHJzc1RpdGxlOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xuICAgICAgICBsZXQgcnNzRGVzYzogUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1EZXNjXCIsIG5vZGUpO1xuICAgICAgICBsZXQgcnNzQXV0aG9yOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUF1dGhvclwiLCBub2RlKTtcbiAgICAgICAgbGV0IHJzc0xpbms6IFByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtTGlua1wiLCBub2RlKTtcbiAgICAgICAgbGV0IHJzc1VyaTogUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1VcmlcIiwgbm9kZSk7XG5cbiAgICAgICAgbGV0IGVudHJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGlmIChyc3NMaW5rICYmIHJzc0xpbmsudmFsdWUgJiYgcnNzVGl0bGUgJiYgcnNzVGl0bGUudmFsdWUpIHtcbiAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICBcImhyZWZcIjogcnNzTGluay52YWx1ZVxuICAgICAgICAgICAgfSwgcmVuZGVyLnRhZyhcImgzXCIsIHt9LCByc3NUaXRsZS52YWx1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBsYXllclVybCA9IHBvZGNhc3QuZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZShub2RlKTtcbiAgICAgICAgaWYgKHBsYXllclVybCkge1xuICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJwb2RjYXN0Lm9wZW5QbGF5ZXJEaWFsb2coJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyc3NEZXNjICYmIHJzc0Rlc2MudmFsdWUpIHtcbiAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgIH0sIHJzc0Rlc2MudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJzc0F1dGhvciAmJiByc3NBdXRob3IudmFsdWUpIHtcbiAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgfSwgXCJCeTogXCIgKyByc3NBdXRob3IudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgfSwgZW50cnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW50cnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwcm9wT3JkZXJpbmdGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXSk6IFByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRUaXRsZVwiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZERlc2NcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRMaW5rXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVXJpXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkU3JjXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm9wT3JkZXJpbmdJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXSk6IFByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbURlc2NcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtVXJpXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCJdO1xuXG4gICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgb3BlblBsYXllckRpYWxvZyA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICBwb2RjYXN0LnVpZCA9IF91aWQ7XG4gICAgICAgIHBvZGNhc3Qubm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbcG9kY2FzdC51aWRdO1xuXG4gICAgICAgIGlmIChwb2RjYXN0Lm5vZGUpIHtcbiAgICAgICAgICAgIGxldCBtcDNVcmwgPSBwb2RjYXN0LmdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUocG9kY2FzdC5ub2RlKTtcbiAgICAgICAgICAgIGlmIChtcDNVcmwpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248R2V0UGxheWVySW5mb1JlcXVlc3QsIEdldFBsYXllckluZm9SZXNwb25zZT4oXCJnZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogbXAzVXJsXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9kY2FzdC5wYXJzZUFkU2VnbWVudFVpZChwb2RjYXN0LnVpZCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkbGcgPSBuZXcgQXVkaW9QbGF5ZXJEbGcobXAzVXJsLCBwb2RjYXN0LnVpZCwgcmVzLnRpbWVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBkbGcub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZUFkU2VnbWVudFVpZCA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICBpZiAocG9kY2FzdC5ub2RlKSB7XG4gICAgICAgICAgICBsZXQgYWRTZWdzOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJhZC1zZWdtZW50c1wiLCBwb2RjYXN0Lm5vZGUpO1xuICAgICAgICAgICAgaWYgKGFkU2Vncykge1xuICAgICAgICAgICAgICAgIHBvZGNhc3QucGFyc2VBZFNlZ21lbnRUZXh0KGFkU2Vncy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIG5vZGUgdWlkOiBcIiArIHBvZGNhc3QudWlkO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VBZFNlZ21lbnRUZXh0ID0gZnVuY3Rpb24oYWRTZWdzOiBzdHJpbmcpIHtcbiAgICAgICAgcG9kY2FzdC5hZFNlZ21lbnRzID0gW107XG5cbiAgICAgICAgbGV0IHNlZ0xpc3Q6IHN0cmluZ1tdID0gYWRTZWdzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICBmb3IgKGxldCBzZWcgb2Ygc2VnTGlzdCkge1xuICAgICAgICAgICAgbGV0IHNlZ1RpbWVzOiBzdHJpbmdbXSA9IHNlZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBpZiAoc2VnVGltZXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSByYW5nZTogXCIgKyBzZWcpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmVnaW5TZWNzOiBudW1iZXIgPSBwb2RjYXN0LmNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMF0pO1xuICAgICAgICAgICAgbGV0IGVuZFNlY3M6IG51bWJlciA9IHBvZGNhc3QuY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1sxXSk7XG5cbiAgICAgICAgICAgIHBvZGNhc3QuYWRTZWdtZW50cy5wdXNoKG5ldyBBZFNlZ21lbnQoYmVnaW5TZWNzLCBlbmRTZWNzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBjb252ZXJ0IGZyb20gZm9tcmF0IFwibWludXRlczpzZWNvbnRzXCIgdG8gYWJzb2x1dGUgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAqXG4gICAgKiB0b2RvLTA6IG1ha2UgdGhpcyBhY2NlcHQganVzdCBzZWNvbmRzLCBvciBtaW46c2VjLCBvciBob3VyOm1pbjpzZWMsIGFuZCBiZSBhYmxlIHRvXG4gICAgKiBwYXJzZSBhbnkgb2YgdGhlbSBjb3JyZWN0bHkuXG4gICAgKi9cbiAgICBwcml2YXRlIGNvbnZlcnRUb1NlY29uZHMgPSBmdW5jdGlvbih0aW1lVmFsOiBzdHJpbmcpIHtcbiAgICAgICAgLyogZW5kIHRpbWUgaXMgZGVzaWduYXRlZCB3aXRoIGFzdGVyaXNrIGJ5IHVzZXIsIGFuZCByZXByZXNlbnRlZCBieSAtMSBpbiB2YXJpYWJsZXMgKi9cbiAgICAgICAgaWYgKHRpbWVWYWwgPT0gJyonKSByZXR1cm4gLTE7XG4gICAgICAgIGxldCB0aW1lUGFydHM6IHN0cmluZ1tdID0gdGltZVZhbC5zcGxpdChcIjpcIik7XG4gICAgICAgIGlmICh0aW1lUGFydHMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHZhbHVlOiBcIiArIHRpbWVWYWwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMF0pLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IHNlY29uZHMgPSBuZXcgTnVtYmVyKHRpbWVQYXJ0c1sxXSkudmFsdWVPZigpO1xuICAgICAgICByZXR1cm4gbWludXRlcyAqIDYwICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXN0b3JlU3RhcnRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qIG1ha2VzIHBsYXllciBhbHdheXMgc3RhcnQgd2hlcmV2ZXIgdGhlIHVzZXIgbGFzdCB3YXMgd2hlbiB0aGV5IGNsaWNrZWQgXCJwYXVzZVwiICovXG4gICAgICAgIGlmIChwb2RjYXN0LnBsYXllciAmJiBwb2RjYXN0LnN0YXJ0VGltZVBlbmRpbmcpIHtcbiAgICAgICAgICAgIHBvZGNhc3QucGxheWVyLmN1cnJlbnRUaW1lID0gcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nO1xuICAgICAgICAgICAgcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2FuUGxheSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICBwb2RjYXN0LnBsYXllciA9IGVsbTtcbiAgICAgICAgcG9kY2FzdC5yZXN0b3JlU3RhcnRUaW1lKCk7XG4gICAgICAgIHBvZGNhc3QucGxheWVyLnBsYXkoKTtcbiAgICB9XG5cbiAgICBvblRpbWVVcGRhdGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZywgZWxtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFwb2RjYXN0LnB1c2hUaW1lcikge1xuICAgICAgICAgICAgLyogcGluZyBzZXJ2ZXIgb25jZSBldmVyeSBmaXZlIG1pbnV0ZXMgKi9cbiAgICAgICAgICAgIHBvZGNhc3QucHVzaFRpbWVyID0gc2V0SW50ZXJ2YWwocG9kY2FzdC5wdXNoVGltZXJGdW5jdGlvbiwgNSAqIDYwICogMTAwMCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkN1cnJlbnRUaW1lPVwiICsgZWxtLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgcG9kY2FzdC5wbGF5ZXIgPSBlbG07XG5cbiAgICAgICAgLyogdG9kby0xOiB3ZSBjYWxsIHJlc3RvcmVTdGFydFRpbWUgdXBvbiBsb2FkaW5nIG9mIHRoZSBjb21wb25lbnQgYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBoYXZlIHRoZSBlZmZlY3QgZG9pbmcgYW55dGhpbmcgYXQgYWxsXG4gICAgICAgIGFuZCBjYW4ndCBldmVuIHVwZGF0ZSB0aGUgc2xpZGVyIGRpc3BsYXllZCBwb3NpdGlvbiwgdW50aWwgcGxheWlucyBpcyBTVEFSVEVELiBOZWVkIHRvIGNvbWUgYmFjayBhbmQgZml4IHRoaXMgYmVjYXVzZSB1c2Vyc1xuICAgICAgICBjdXJyZW50bHkgaGF2ZSB0aGUgZ2xpdGNoIG9mIGFsd2F5cyBoZWFyaW5nIHRoZSBmaXJzdCBmcmFjdGlvbiBvZiBhIHNlY29uZCBvZiB2aWRlbywgd2hpY2ggb2YgY291cnNlIGFub3RoZXIgd2F5IHRvIGZpeFxuICAgICAgICB3b3VsZCBiZSBieSBhbHRlcmluZyB0aGUgdm9sdW1uIHRvIHplcm8gdW50aWwgcmVzdG9yZVN0YXJ0VGltZSBoYXMgZ29uZSBpbnRvIGVmZmVjdCAqL1xuICAgICAgICBwb2RjYXN0LnJlc3RvcmVTdGFydFRpbWUoKTtcblxuICAgICAgICBpZiAoIXBvZGNhc3QuYWRTZWdtZW50cykgcmV0dXJuO1xuICAgICAgICBmb3IgKGxldCBzZWcgb2YgcG9kY2FzdC5hZFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAvKiBlbmRUaW1lIG9mIC0xIG1lYW5zIHRoZSByZXN0IG9mIHRoZSBtZWRpYSBzaG91bGQgYmUgY29uc2lkZXJlZCBBRHMgKi9cbiAgICAgICAgICAgIGlmIChwb2RjYXN0LnBsYXllci5jdXJyZW50VGltZSA+PSBzZWcuYmVnaW5UaW1lICYmIC8vXG4gICAgICAgICAgICAgICAgKHBvZGNhc3QucGxheWVyLmN1cnJlbnRUaW1lIDw9IHNlZy5lbmRUaW1lIHx8IHNlZy5lbmRUaW1lIDwgMCkpIHtcblxuICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gZW5kIG9mIGF1ZGlvIGlmIHJlc3QgaXMgYW4gYWRkLCB3aXRoIGxvZ2ljIG9mIC0zIHRvIGVuc3VyZSB3ZSBkb24ndFxuICAgICAgICAgICAgICAgIGdvIGludG8gYSBsb29wIGp1bXBpbmcgdG8gZW5kIG92ZXIgYW5kIG92ZXIgYWdhaW4gKi9cbiAgICAgICAgICAgICAgICBpZiAoc2VnLmVuZFRpbWUgPCAwICYmIHBvZGNhc3QucGxheWVyLmN1cnJlbnRUaW1lIDwgcG9kY2FzdC5wbGF5ZXIuZHVyYXRpb24gLSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gbGFzdCB0byBzZWNvbmRzIG9mIGF1ZGlvLCBpJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiBwYXVzaW5nLCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICB0aGVyZSBhcmUgaXMgbW9yZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGFib3V0IHRvIHBsYXksIHdlIGRvbid0IHdhbnQgdG8gaGFsdCBpdCBhbGwgKi9cbiAgICAgICAgICAgICAgICAgICAgcG9kY2FzdC5wbGF5ZXIubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBwb2RjYXN0LnBsYXllci5jdXJyZW50VGltZSA9IHBvZGNhc3QucGxheWVyLmR1cmF0aW9uIC0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogb3IgZWxzZSB3ZSBhcmUgaW4gYSBjb21lcmNpYWwgc2VnbWVudCBzbyBqdW1wIHRvIG9uZSBzZWNvbmQgcGFzdCBpdCAqL1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwb2RjYXN0LnBsYXllci5jdXJyZW50VGltZSA9IHNlZy5lbmRUaW1lICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogdG9kby0wOiBmb3IgcHJvZHVjdGlvbiwgYm9vc3QgdGhpcyB1cCB0byBvbmUgbWludXRlICovXG4gICAgcHVzaFRpbWVyRnVuY3Rpb24gPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInB1c2hUaW1lclwiKTtcbiAgICAgICAgLyogdGhlIHB1cnBvc2Ugb2YgdGhpcyB0aW1lciBpcyB0byBiZSBzdXJlIHRoZSBicm93c2VyIHNlc3Npb24gZG9lc24ndCB0aW1lb3V0IHdoaWxlIHVzZXIgaXMgcGxheWluZ1xuICAgICAgICBidXQgaWYgdGhlIG1lZGlhIGlzIHBhdXNlZCB3ZSBETyBhbGxvdyBpdCB0byB0aW1lb3V0LiBPdGh3ZXJ3aXNlIGlmIHVzZXIgaXMgbGlzdGVuaW5nIHRvIGF1ZGlvLCB3ZVxuICAgICAgICBjb250YWN0IHRoZSBzZXJ2ZXIgZHVyaW5nIHRoaXMgdGltZXIgdG8gdXBkYXRlIHRoZSB0aW1lIG9uIHRoZSBzZXJ2ZXIgQU5EIGtlZXAgc2Vzc2lvbiBmcm9tIHRpbWluZyBvdXRcblxuICAgICAgICB0b2RvLTA6IHdvdWxkIGV2ZXJ5dGhpbmcgd29yayBpZiAncGxheWVyJyBXQVMgdGhlIGpxdWVyeSBvYmplY3QgYWx3YXlzLlxuICAgICAgICAqL1xuICAgICAgICBpZiAocG9kY2FzdC5wbGF5ZXIgJiYgIXBvZGNhc3QucGxheWVyLnBhdXNlZCkge1xuICAgICAgICAgICAgLyogdGhpcyBzYWZldHkgY2hlY2sgdG8gYmUgc3VyZSBubyBoaWRkZW4gYXVkaW8gY2FuIHN0aWxsIGJlIHBsYXlpbmcgc2hvdWxkIG5vIGxvbmdlciBiZSBuZWVkZWRcbiAgICAgICAgICAgIG5vdyB0aGF0IEkgaGF2ZSB0aGUgY2xvc2UgbGl0ZW5lciBldmVuIG9uIHRoZSBkaWFsb2csIGJ1dCBpJ2xsIGxlYXZlIHRoaXMgaGVyZSBhbnl3YXkuIENhbid0IGh1cnQuICovXG4gICAgICAgICAgICBpZiAoISQocG9kY2FzdC5wbGF5ZXIpLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NpbmcgcGxheWVyLCBiZWNhdXNlIGl0IHdhcyBkZXRlY3RlZCBhcyBub3QgdmlzaWJsZS4gcGxheWVyIGRpYWxvZyBnZXQgaGlkZGVuP1wiKTtcbiAgICAgICAgICAgICAgICBwb2RjYXN0LnBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkF1dG9zYXZlIHBsYXllciBpbmZvLlwiKTtcbiAgICAgICAgICAgIHBvZGNhc3Quc2F2ZVBsYXllckluZm8ocG9kY2FzdC5wbGF5ZXIuc3JjLCBwb2RjYXN0LnBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgcGF1c2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHBvZGNhc3QucGxheWVyKSB7XG4gICAgICAgICAgICBwb2RjYXN0LnBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgcG9kY2FzdC5zYXZlUGxheWVySW5mbyhwb2RjYXN0LnBsYXllci5zcmMsIHBvZGNhc3QucGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3lQbGF5ZXIgPSBmdW5jdGlvbihkbGc6IEF1ZGlvUGxheWVyRGxnKTogdm9pZCB7XG4gICAgICAgIGlmIChwb2RjYXN0LnBsYXllcikge1xuICAgICAgICAgICAgcG9kY2FzdC5wbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb2RjYXN0LnNhdmVQbGF5ZXJJbmZvKHBvZGNhc3QucGxheWVyLnNyYywgcG9kY2FzdC5wbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocG9kY2FzdC5wbGF5ZXIpO1xuICAgICAgICAgICAgICAgIHBvZGNhc3QucGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsb2NhbFBsYXllci5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIGlmIChkbGcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGxnLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDc1MCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5ID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmIChwb2RjYXN0LnBsYXllcikge1xuICAgICAgICAgICAgcG9kY2FzdC5wbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3BlZWQgPSBmdW5jdGlvbihyYXRlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHBvZGNhc3QucGxheWVyKSB7XG4gICAgICAgICAgICBwb2RjYXN0LnBsYXllci5wbGF5YmFja1JhdGUgPSByYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgIHNraXAgPSBmdW5jdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChwb2RjYXN0LnBsYXllcikge1xuICAgICAgICAgICAgcG9kY2FzdC5wbGF5ZXIuY3VycmVudFRpbWUgKz0gZGVsdGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlUGxheWVySW5mbyA9IGZ1bmN0aW9uKHVybDogc3RyaW5nLCB0aW1lT2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgdXRpbC5qc29uPFNldFBsYXllckluZm9SZXF1ZXN0LCBTZXRQbGF5ZXJJbmZvUmVzcG9uc2U+KFwic2V0UGxheWVySW5mb1wiLCB7XG4gICAgICAgICAgICBcInVybFwiOiB1cmwsXG4gICAgICAgICAgICBcInRpbWVPZmZzZXRcIjogdGltZU9mZnNldCAvLyxcbiAgICAgICAgICAgIC8vXCJub2RlUGF0aFwiOiBub2RlLnBhdGhcbiAgICAgICAgfSwgcG9kY2FzdC5zZXRQbGF5ZXJJbmZvUmVzcG9uc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0UGxheWVySW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIC8vYWxlcnQoJ3NhdmUgY29tcGxldGUuJyk7XG4gICAgfVxufVxubGV0IHBvZGNhc3Q6IFBvZGNhc3QgPSBuZXcgUG9kY2FzdCgpO1xuXG5jbGFzcyBTeXN0ZW1Gb2xkZXIge1xuXG4gICAgcmVuZGVyTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IHBhdGhQcm9wOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cGF0aFwiLCBub2RlKTtcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHBhdGhQcm9wKSB7XG4gICAgICAgICAgICBwYXRoICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICB9LCBwYXRoUHJvcC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBUaGlzIHdhcyBhbiBleHBlcmltZW50IHRvIGxvYWQgYSBub2RlIHByb3BlcnR5IHdpdGggdGhlIHJlc3VsdHMgb2YgYSBkaXJlY3RvcnkgbGlzdGluZywgYnV0IEkgZGVjaWRlZCB0aGF0XG4gICAgICAgIHJlYWxseSBpZiBJIHdhbnQgdG8gaGF2ZSBhIGZpbGUgYnJvd3NlciwgdGhlIHJpZ2h0IHdheSB0byBkbyB0aGF0IGlzIHRvIGhhdmUgYSBkZWRpY2F0ZWQgdGFiIHRoYXQgY2FuIGRvIGl0XG4gICAgICAgIGp1c3QgbGlrZSB0aGUgb3RoZXIgdG9wLWxldmVsIHRhYnMgKi9cbiAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmdQcm9wOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6anNvblwiLCBub2RlKTtcbiAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmcgPSBmaWxlTGlzdGluZ1Byb3AgPyByZW5kZXIucmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eShmaWxlTGlzdGluZ1Byb3AudmFsdWUpIDogXCJcIjtcblxuICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICB9LCBwYXRoIC8qICsgZmlsZUxpc3RpbmcgKi8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0aCAvKiArIGZpbGVMaXN0aW5nICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcmVuZGVyRmlsZUxpc3ROb2RlID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5KU09OX0ZJTEVfU0VBUkNIX1JFU1VMVCwgbm9kZSk7XG4gICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XG4gICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHJlbmRlci5yZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGZpbGVMaXN0UHJvcE9yZGVyaW5nID0gZnVuY3Rpb24obm9kZTogTm9kZUluZm8sIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdKTogUHJvcGVydHlJbmZvW10ge1xuICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgXCJtZXRhNjQ6anNvblwiXTtcblxuICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHJlaW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHNlbE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPEZpbGVTZWFyY2hSZXF1ZXN0LCBGaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInJlaW5kZXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogbnVsbFxuICAgICAgICAgICAgfSwgc3lzdGVtZm9sZGVyLnJlaW5kZXhSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJyb3dzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUaGlzIGJyb3dzZSBmdW5jdGlvbiB3b3JrcywgYnV0IGknbSBkaXNhYmxpbmcgaXQsIGZvciBub3cgYmVjYXVzZSB3aGF0IEknbGwgYmUgZG9pbmcgaW5zdGVhZCBpcyBtYWtpbmcgaXRcbiAgICAgICAgLy8gc3dpdGNoIHRvIGEgRmlsZUJyb3dzZXIgVGFiIChtYWluIHRhYikgd2hlcmUgYnJvd3Npbmcgd2lsbCBhbGwgYmUgZG9uZS4gTm8gSkNSIG5vZGVzIHdpbGwgYmUgdXBkYXRlZCBkdXJpbmdcbiAgICAgICAgLy8gdGhlIHByb2Nlc3Mgb2YgYnJvd3NpbmcgYW5kIGVkaXRpbmcgZmlsZXMgb24gdGhlIHNlcnZlci5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gbGV0IHNlbE5vZGU6IE5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAvLyBpZiAoc2VsTm9kZSkge1xuICAgICAgICAvLyAgICAgdXRpbC5qc29uPEJyb3dzZUZvbGRlclJlcXVlc3QsIEJyb3dzZUZvbGRlclJlc3BvbnNlPihcImJyb3dzZUZvbGRlclwiLCB7XG4gICAgICAgIC8vICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5wYXRoXG4gICAgICAgIC8vICAgICB9LCBzeXN0ZW1mb2xkZXIucmVmcmVzaFJlc3BvbnNlLCBzeXN0ZW1mb2xkZXIpO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG4gICAgcmVmcmVzaFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBCcm93c2VGb2xkZXJSZXNwb25zZSkge1xuICAgICAgICAvL25hdi5tYWluT2Zmc2V0ID0gMDtcbiAgICAgICAgLy8gdXRpbC5qc29uPFJlbmRlck5vZGVSZXF1ZXN0LCBSZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XG4gICAgICAgIC8vICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxuICAgICAgICAvLyAgICAgXCJ1cExldmVsXCI6IG51bGwsXG4gICAgICAgIC8vICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxuICAgICAgICAvLyAgICAgXCJvZmZzZXRcIjogMCxcbiAgICAgICAgLy8gICAgIFwiZ29Ub0xhc3RQYWdlXCIgOiBmYWxzZVxuICAgICAgICAvLyB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XG4gICAgfVxuXG4gICAgcmVpbmRleFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBGaWxlU2VhcmNoUmVzcG9uc2UpIHtcbiAgICAgICAgYWxlcnQoXCJSZWluZGV4IGNvbXBsZXRlLlwiKTtcbiAgICB9XG5cbiAgICBzZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgKG5ldyBTZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1xuICAgIH1cblxuICAgIHByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IE5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXSk6IFByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnBhdGhcIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5sZXQgc3lzdGVtZm9sZGVyOiBTeXN0ZW1Gb2xkZXIgPSBuZXcgU3lzdGVtRm9sZGVyKCk7XG4vKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIGRpYWxvZyBib3hlcy5cbiAqXG4gKiB0b2RvOiB3aGVuIHJlZmFjdG9yaW5nIGFsbCBkaWFsb2dzIHRvIHRoaXMgbmV3IGJhc2UtY2xhc3MgZGVzaWduIEknbSBhbHdheXNcbiAqIGNyZWF0aW5nIGEgbmV3IGRpYWxvZyBlYWNoIHRpbWUsIHNvIHRoZSBuZXh0IG9wdGltaXphdGlvbiB3aWxsIGJlIHRvIG1ha2VcbiAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gKiB0aGV5IGhhdmUgYmVlbiBjb25zdHJ1Y3RlZCB3aGVyZSB0aGV5IG1lcmVseSBoYXZlIHRvIGJlIHJlc2hvd24gYW5kXG4gKiByZXBvcHVsYXRlZCB0byByZW9wZW4gb25lIG9mIHRoZW0sIGFuZCBjbG9zaW5nIGFueSBvZiB0aGVtIGlzIG1lcmVseSBkb25lIGJ5XG4gKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gKi9cbmNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgcHJpdmF0ZSBob3JpekNlbnRlckRsZ0NvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgZGF0YTogYW55O1xuICAgIGJ1aWx0OiBib29sZWFuO1xuICAgIGd1aWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkb21JZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFdlIHJlZ2lzdGVyICd0aGlzJyBzbyB3ZSBjYW4gZG8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZCBpbiBvbkNsaWNrIG1ldGhvZHNcbiAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgKiBhcyBzdHJpbmdzLlxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICBhbnkgZGVmYXVsdHMgb3IgdmFsdWVzIGluIGZvciBmaWVsZHMsIGV0Yy4gc2hvdWxkIGJlIHNldCB3aGVuIHRoZSBkaWFsb2cgaXMgZGlzcGxheWVkICovXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICB9XG5cbiAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cblxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfTtcblxuICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgLypcbiAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbW9kYWxzQ29udGFpbmVyID0gdXRpbC5wb2x5RWxtKFwibW9kYWxzQ29udGFpbmVyXCIpO1xuXG4gICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgIGxldCBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICogbWFwIGluIHRoaXMgbW9kdWxlXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgLy9OT1RFOiBUaGlzIHdvcmtzLCBidXQgaXMgYW4gZXhhbXBsZSBvZiB3aGF0IE5PVCB0byBkbyBhY3R1YWxseS4gSW5zdGVhZCBhbHdheXNcbiAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICBub2RlLnN0eWxlLmJvcmRlciA9IFwiM3B4IHNvbGlkIGdyYXlcIjtcblxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuaG9yaXpDZW50ZXJEbGdDb250ZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAvL2hvd3RvOiBleGFtcGxlIG9mIGhvdyB0byBjZW50ZXIgYSBkaXYgaW4gYW5vdGhlciBkaXYuIFRoaXMgZGl2IGlzIHRoZSBvbmUgYmVpbmcgY2VudGVyZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vVGhlIHRyaWNrIHRvIGdldHRpbmcgdGhlIGxheW91dCB3b3JraW5nIHdhcyBOT1Qgc2V0dGluZyB0aGlzIHdpZHRoIHRvIDEwMCUgZXZlbiB0aG91Z2ggc29tZWhvd1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBsYXlvdXQgZG9lcyByZXN1bHQgaW4gaXQgYmVpbmcgMTAwJSBpIHRoaW5rLlxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luOiAwIGF1dG87IG1heC13aWR0aDogODAwcHg7XCIgLy9cIm1hcmdpbjogMCBhdXRvOyB3aWR0aDogODAwcHg7XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcblxuICAgICAgICAgICAgLy8gbGV0IGxlZnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIFwibGVmdFwiKTtcbiAgICAgICAgICAgIC8vIGxldCBjZW50ZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAvLyBsZXQgcmlnaHQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIFwicmlnaHRcIik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gbGV0IHJvdyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBsZWZ0ICsgY2VudGVyICsgcmlnaHQpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGxldCB0YWJsZTogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLFxuICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGVcIixcbiAgICAgICAgICAgIC8vICAgICB9LCByb3cpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIHV0aWwuc2V0SHRtbChpZCwgdGFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGlhbG9nOiBcIiArIGlkKTtcblxuICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgbGV0IHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0oaWQpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGkgdHJpZWQgdG8gdHdlYWsgdGhlIHBsYWNlbWVudCBvZiB0aGUgZGlhbG9nIHVzaW5nIGZpdEludG8sIGFuZCBpdCBkaWRuJ3Qgd29ya1xuICAgICAgICBzbyBJJ20ganVzdCB1c2luZyB0aGUgcGFwZXItZGlhbG9nIENTUyBzdHlsaW5nIHRvIGFsdGVyIHRoZSBkaWFsb2cgc2l6ZSB0byBmdWxsc2NyZWVuXG4gICAgICAgIGxldCBpcm9uUGFnZXMgPSB1dGlsLnBvbHlFbG0oXCJtYWluSXJvblBhZ2VzXCIpO1xuXG4gICAgICAgIEFmdGVyIHRoZSBUeXBlU2NyaXB0IGNvbnZlcnNpb24gSSBub3RpY2VkIGhhdmluZyBhIG1vZGFsIGZsYWcgd2lsbCBjYXVzZVxuICAgICAgICBhbiBpbmZpbml0ZSBsb29wIChjb21wbGV0ZWx5IGhhbmcpIENocm9tZSBicm93c2VyLCBidXQgdGhpcyBpc3N1ZSBpcyBtb3N0IGxpa2VseVxuICAgICAgICBub3QgcmVsYXRlZCB0byBUeXBlU2NyaXB0IGF0IGFsbCwgYnV0IGknbSBqdXN0IG1lbnRpb24gVFMganVzdCBpbiBjYXNlLCBiZWNhdXNlXG4gICAgICAgIHRoYXQncyB3aGVuIEkgbm90aWNlZCBpdC4gRGlhbG9ncyBhcmUgZmluZSBidXQgbm90IGEgZGlhbG9nIG9uIHRvcCBvZiBhbm90aGVyIGRpYWxvZywgd2hpY2ggaXNcbiAgICAgICAgdGhlIGNhc2Ugd2hlcmUgaXQgaGFuZ3MgaWYgbW9kZWw9dHJ1ZVxuICAgICAgICAqL1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLm5vQ2FuY2VsT25PdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5ob3Jpem9udGFsT2Zmc2V0ID0gMDtcbiAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5maXRJbnRvID0gaXJvblBhZ2VzLm5vZGU7XG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLm9wZW4oKTtcblxuICAgICAgICAvL3ZhciBkaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5EaWFsb2cnKTtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpcm9uLW92ZXJsYXktY2xvc2VkJywgZnVuY3Rpb24oY3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgIC8vdmFyIGlkID0gKDxhbnk+Y3VzdG9tRXZlbnQuY3VycmVudFRhcmdldCkuaWQ7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqIERpYWxvZzogXCIgKyBpZCArIFwiIGlzIGNsb3NlZCFcIik7XG4gICAgICAgICAgICB0aGl6LmNsb3NlRXZlbnQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgc2V0dGluZyB0byB6ZXJvIG1hcmdpbiBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWxtb3N0IGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhZnRlIDEuNSBzZWNvbmRzXG4gICAgICAgIGlzIGEgcmVhbGx5IHVnbHkgaGFjaywgYnV0IEkgY291bGRuJ3QgZmluZCB0aGUgcmlnaHQgc3R5bGUgY2xhc3Mgb3Igd2F5IG9mIGRvaW5nIHRoaXMgaW4gdGhlIGdvb2dsZVxuICAgICAgICBkb2NzIG9uIHRoZSBkaWFsb2cgY2xhc3MuXG4gICAgICAgICovXG4gICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcblxuICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgfSwgMTApO1xuXG4gICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9XG5cbiAgICAvKiB0b2RvOiBuZWVkIHRvIGNsZWFudXAgdGhlIHJlZ2lzdGVyZWQgSURzIHRoYXQgYXJlIGluIG1hcHMgZm9yIHRoaXMgZGlhbG9nICovXG4gICAgcHVibGljIGNhbmNlbCgpIHtcbiAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAqIHN1ZmZpeCBhcHBlbmRlZClcbiAgICAgKi9cbiAgICBpZCA9IChpZCk6IHN0cmluZyA9PiB7XG4gICAgICAgIGlmIChpZCA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiX2RsZ0lkXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkICsgXCJfZGxnSWRcIiArIHRoaXMuZGF0YS5ndWlkO1xuICAgIH1cblxuICAgIGVsID0gKGlkKTogYW55ID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjXCIgKyB0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICB9XG5cbiAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgIH1cblxuICAgIG1ha2VNZXNzYWdlQXJlYSA9IChtZXNzYWdlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1tZXNzYWdlXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvOiB0aGVyZSdzIGEgbWFrZUJ1dHRvbiAoYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcykgdGhhdCBkb24ndCBoYXZlIHRoZVxuICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgbWFrZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKiBUaGUgcmVhc29uIGRlbGF5Q2xvc2VDYWxsYmFjayBpcyBoZXJlIGlzIHNvIHRoYXQgd2UgY2FuIGVuY29kZSBhIGJ1dHRvbiB0byBwb3B1cCBhIG5ldyBkaWFsb2cgb3ZlciB0aGUgdG9wIG9mXG4gICAgYW4gZXhpc3RpbmcgZGlhbG9nLCBhbmQgaGF2ZSB0aGF0IGhhcHBlbiBpbnN0YW50bHksIHJhdGhlciB0aGFuIGxldHRpbmcgaXQgY2xvc2UsIGFuZCBUSEVOIHBvcGluZyB1cCBhIHNlY29uZCBkaWFsb2csXG4gICAgYmVjYXN1ZSB1c2luZyB0aGUgZGVsYXkgbWVhbnMgdGhhdCB0aGUgb25lIGJlaW5nIGhpZGRlbiBpcyBub3QgYWJsZSB0byBiZWNvbWUgaGlkZGVuIGJlZm9yZSB0aGUgb25lIGNvbWVzIHVwIGJlY2F1c2VcbiAgICB0aGF0IGNyZWF0ZXMgYW4gdWdseW5lc3MuIEl0J3MgYmV0dGVyIHRvIHBvcHVwIG9uZSByaWdodCBvdmVyIHRoZSBvdGhlciBhbmQgbm8gZmxpY2tlciBoYXBwZW5zIGluIHRoYXQgY2FzZS4gKi9cbiAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlOiBib29sZWFuID0gdHJ1ZSwgZGVsYXlDbG9zZUNhbGxiYWNrOiBudW1iZXIgPSAwKTogc3RyaW5nID0+IHtcblxuICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG5cbiAgICAgICAgICAgIC8qIHdhcm5pbmc6IHRoaXMgZGlhbG9nLWNvbmZpcm0gd2lsbCBjYXVzZSBnb29nbGUgcG9seW1lciB0byBjbG9zZSB0aGUgZGlhbG9nIGluc3RhbnRseSB3aGVuIHRoZSBidXR0b25cbiAgICAgICAgICAgICBpcyBjbGlja2VkIGFuZCBzb21ldGltZXMgd2UgZG9uJ3Qgd2FudCB0aGF0LCBsaWtlIGZvciBleGFtcGxlLCB3aGVuIHdlIG9wZW4gYSBkaWFsb2cgb3ZlciBhbm90aGVyIGRpYWxvZyxcbiAgICAgICAgICAgICB3ZSBkb24ndCB3YW50IHRoZSBpbnN0YW50YW5lb3VzIGNsb3NlIGFuZCBkaXNwbGF5IG9mIGJhY2tncm91bmQuIEl0IGNyZWF0ZXMgYSBmbGlja2VyIGVmZmVjdC5cblxuICAgICAgICAgICAgXCJkaWFsb2ctY29uZmlybVwiOiBcImRpYWxvZy1jb25maXJtXCIsXG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb25DbGljayA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb25DbGljayA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25DbGljayArPSBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcywgbnVsbCwgZGVsYXlDbG9zZUNhbGxiYWNrKTtcblxuICAgICAgICBpZiAob25DbGljaykge1xuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBvbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbml0aWFsbHlWaXNpYmxlKSB7XG4gICAgICAgICAgICBhdHRyaWJzW1wic3R5bGVcIl0gPSBcImRpc3BsYXk6bm9uZTtcIlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYmluZEVudGVyS2V5ID0gKGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5iaW5kRW50ZXJLZXkodGhpcy5pZChpZCksIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBzZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoaWQpLCB2YWwpO1xuICAgIH1cblxuICAgIGdldElucHV0VmFsID0gKGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICByZXR1cm4gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSkudHJpbSgpO1xuICAgIH1cblxuICAgIHNldEh0bWwgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKGlkKSwgdGV4dCk7XG4gICAgfVxuXG4gICAgbWFrZVJhZGlvQnV0dG9uID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgXCJuYW1lXCI6IGlkXG4gICAgICAgIH0sIGxhYmVsKTtcbiAgICB9XG5cbiAgICBtYWtlQ2hlY2tCb3ggPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZywgaW5pdGlhbFN0YXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcblxuICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAvL1wib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgPHBhcGVyLWNoZWNrYm94IG9uLWNoYW5nZT1cImNoZWNrYm94Q2hhbmdlZFwiPmNsaWNrPC9wYXBlci1jaGVja2JveD5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgY2hlY2tib3hDaGFuZ2VkIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvLyAgICAgaWYoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgICAgICAgIGF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoZWNrYm94OiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgYXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICBjaGVja2JveCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgXCJmb3JcIjogaWRcbiAgICAgICAgfSwgbGFiZWwsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBjaGVja2JveDtcbiAgICB9XG5cbiAgICBtYWtlSGVhZGVyID0gKHRleHQ6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNlbnRlcmVkPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogLypcImRpYWxvZy1oZWFkZXIgXCIgKyovIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIikgKyBcIiBkaWFsb2ctaGVhZGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogbWFraW5nIHRoaXMgSDIgdGFnIGNhdXNlcyBnb29nbGUgdG8gZHJhZyBpbiBhIGJ1bmNoIG9mIGl0cyBvd24gc3R5bGVzIGFuZCBhcmUgaGFyZCB0byBvdmVycmlkZSAqL1xuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCBhdHRycywgdGV4dCk7XG4gICAgfVxuXG4gICAgZm9jdXMgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XG4gICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoaWQpO1xuICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgJChpZCkuZm9jdXMoKTtcbiAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgfVxufVxuY2xhc3MgUHJvZ3Jlc3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlByb2dyZXNzRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQcm9jZXNzaW5nIFJlcXVlc3RcIiwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gcmVuZGVyLnRhZyhcInBhcGVyLXByb2dyZXNzXCIsIHtcbiAgICAgICAgICAgIFwiaW5kZXRlcm1pbmF0ZVwiOiBcImluZGV0ZXJtaW5hdGVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCI4MDBcIixcbiAgICAgICAgICAgIFwibWluXCI6IFwiMTAwXCIsXG4gICAgICAgICAgICBcIm1heFwiOiBcIjEwMDBcIlxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYmFyQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MjgwcHg7IG1hcmdpbjogMCBhdXRvOyBtYXJnaW4tdG9wOjI0cHg7IG1hcmdpbi1ib3R0b206MjRweDtcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgfSwgcHJvZ3Jlc3NCYXIpO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBiYXJDb250YWluZXI7XG4gICAgfVxufVxuY2xhc3MgQ29uZmlybURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB0aXRsZTogc3RyaW5nLCBwcml2YXRlIG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZSBidXR0b25UZXh0OiBzdHJpbmcsIHByaXZhdGUgeWVzQ2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICBwcml2YXRlIG5vQ2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICBzdXBlcihcIkNvbmZpcm1EbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGNvbnRlbnQ6IHN0cmluZyA9IHRoaXMubWFrZUhlYWRlcihcIlwiLCBcIkNvbmZpcm1EbGdUaXRsZVwiKSArIHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiXCIsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG4gICAgICAgIGNvbnRlbnQgPSByZW5kZXIuY2VudGVyQ29udGVudChjb250ZW50LCAzMDApO1xuXG4gICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIiwgdGhpcy5ub0NhbGxiYWNrKTtcbiAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYnV0dG9ucyk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5tZXNzYWdlLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5idXR0b25UZXh0LCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIik7XG4gICAgfVxufVxuXG5jbGFzcyBFZGl0U3lzdGVtRmlsZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdFN5c3RlbUZpbGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiPGgyPkZpbGUgRWRpdG9yOiBcIiArIHRoaXMuZmlsZU5hbWUgKyBcIjwvaDI+XCI7XG5cbiAgICAgICAgbGV0IGJ1dHRvbnMgPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJTYXZlRmlsZUJ1dHRvblwiLCB0aGlzLnNhdmVFZGl0KVxuICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcIkNhbmNlbEZpbGVFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCk7XG4gICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHNhdmVFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmUuXCIpO1xuICAgIH1cblxuICAgIGNhbmNlbEVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FuY2VsLlwiKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cbn1cblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbmNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBcIk1lc3NhZ2VcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy50aXRsZSkgKyBcIjxwPlwiICsgdGhpcy5tZXNzYWdlICsgXCI8L3A+XCI7XHJcbiAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJPa1wiLCBcIm1lc3NhZ2VEbGdPa0J1dHRvblwiLCB0aGlzLmNhbGxiYWNrKSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJMb2dpbkRsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTG9naW5cIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICB2YXIgbG9naW5CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJMb2dpblwiLCBcImxvZ2luQnV0dG9uXCIsIHRoaXMubG9naW4sIHRoaXMpO1xuICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIobG9naW5CdXR0b24gKyByZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XG4gICAgICAgIHZhciBkaXZpZGVyID0gXCI8ZGl2PjxoMz5PciBMb2dpbiBXaXRoLi4uPC9oMz48L2Rpdj5cIjtcblxuICAgICAgICB2YXIgZm9ybSA9IGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcblxuICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBmb3JtO1xuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwicGFzc3dvcmRcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlRnJvbUNvb2tpZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICBpZiAodXNyKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHdkKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgIHZhciBwd2QgPSB0aGlzLmdldElucHV0VmFsKFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgfVxuXG4gICAgcmVzZXRQYXNzd29yZCA9ICgpOiBhbnkgPT4ge1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBSZXNldCBQYXNzd29yZFwiLFxuICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpei5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG59XG5jbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNpZ251cERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKEJSQU5ESU5HX1RJVExFICsgXCIgU2lnbnVwXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInNpZ251cFVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInNpZ251cFBhc3N3b3JkXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiQ2FwdGNoYVwiLCBcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgdmFyIGNhcHRjaGFJbWFnZSA9IHJlbmRlci50YWcoXCJkaXZcIiwgLy9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYS1pbWFnZVwiIC8vXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiY2FwdGNoYUltYWdlXCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIlwiLy9cbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgdmFyIHNpZ251cEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNpZ251cFwiLCBcInNpZ251cEJ1dHRvblwiLCB0aGlzLnNpZ251cCwgdGhpcyk7XG4gICAgICAgIHZhciBuZXdDYXB0Y2hhQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiVHJ5IERpZmZlcmVudCBJbWFnZVwiLCBcInRyeUFub3RoZXJDYXB0Y2hhQnV0dG9uXCIsXG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2lnbnVwQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2lnbnVwQnV0dG9uICsgbmV3Q2FwdGNoYUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogJChcIiNcIiArIF8uZG9tSWQgKyBcIi1tYWluXCIpLmNzcyh7IFwiYmFja2dyb3VuZEltYWdlXCIgOiBcInVybCgvaWJtLTcwMi1icmlnaHQuanBnKTtcIiBcImJhY2tncm91bmQtcmVwZWF0XCIgOlxuICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAqL1xuICAgIH1cblxuICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFVzZXJOYW1lXCIpO1xuICAgICAgICB2YXIgcGFzc3dvcmQgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwUGFzc3dvcmRcIik7XG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgdmFyIGNhcHRjaGEgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAvKiBubyByZWFsIHZhbGlkYXRpb24geWV0LCBvdGhlciB0aGFuIG5vbi1lbXB0eSAqL1xuICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAhcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU29ycnksIHlvdSBjYW5ub3QgbGVhdmUgYW55IGZpZWxkcyBibGFuay5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxTaWdudXBSZXF1ZXN0LCBTaWdudXBSZXNwb25zZT4oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c2VyTmFtZSxcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgXCJjYXB0Y2hhXCI6IGNhcHRjaGFcbiAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgc2lnbnVwUmVzcG9uc2UgPSAocmVzOiBTaWdudXBSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTaWdudXAgbmV3IHVzZXJcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFxuICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICApKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnlBbm90aGVyQ2FwdGNoYSA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBlbWJlZCBhIHRpbWUgcGFyYW1ldGVyIGp1c3QgdG8gdGh3YXJ0IGJyb3dzZXIgY2FjaGluZywgYW5kIGVuc3VyZSBzZXJ2ZXIgYW5kIGJyb3dzZXIgd2lsbCBuZXZlciByZXR1cm4gdGhlIHNhbWVcbiAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc3JjID0gcG9zdFRhcmdldFVybCArIFwiY2FwdGNoYT90PVwiICsgbjtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICB9XG5cbiAgICBwYWdlSW5pdFNpZ251cFBnID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICB9XG59XG5jbGFzcyBQcmVmc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQZWZlcmVuY2VzXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmFkaW9CdXR0b25zID0gdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJTaW1wbGVcIiwgXCJlZGl0TW9kZVNpbXBsZVwiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmFkaW9CdXR0b25Hcm91cCA9IHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1ncm91cFwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpLFxyXG4gICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgIH0sIHJhZGlvQnV0dG9ucyk7XHJcblxyXG4gICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja0JveCA9IHRoaXMubWFrZUNoZWNrQm94KFwiU2hvdyBSb3cgTWV0YWRhdGFcIiwgXCJzaG93TWV0YURhdGFcIiwgbWV0YTY0LnNob3dNZXRhRGF0YSk7XHJcbiAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgIHZhciBsZWdlbmQgPSBcIjxsZWdlbmQ+RWRpdCBNb2RlOjwvbGVnZW5kPlwiO1xyXG4gICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbFByZWZlcmVuY2VzRGxnQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBjaGVja2JveEJhciArIGJ1dHRvbkJhcjtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSBwb2x5RWxtLm5vZGUuc2VsZWN0ZWQgPT0gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpID8gbWV0YTY0Lk1PREVfU0lNUExFXHJcbiAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gc2hvd01ldGFEYXRhQ2hlY2tib3gubm9kZS5jaGVja2VkO1xyXG5cclxuICAgICAgICB1dGlsLmpzb248U2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3QsIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VELFxyXG4gICAgICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlLFxyXG4gICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogbWV0YTY0LnNob3dNZXRhRGF0YVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UgPSAocmVzOiBTYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZpbmcgUHJlZmVyZW5jZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMjogdHJ5IGFuZCBtYWludGFpbiBzY3JvbGwgcG9zaXRpb24gPyB0aGlzIGlzIGdvaW5nIHRvIGJlIGFzeW5jLCBzbyB3YXRjaCBvdXQuXHJcbiAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgIHBvbHlFbG0ubm9kZS5zZWxlY3QobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09IG1ldGE2NC5NT0RFX1NJTVBMRSA/IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA6IHRoaXNcclxuICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgIC8vdG9kby0wOiBwdXQgdGhlc2UgdHdvIGxpbmVzIGluIGEgdXRpbGl0eSBtZXRob2RcclxuICAgICAgICBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaG93TWV0YURhdGFcIikpO1xyXG4gICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJNYW5hZ2VBY2NvdW50RGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk1hbmFnZSBBY2NvdW50XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjbG9zZUFjY291bnRCdXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNsb3NlLWFjY291bnQtYmFyXCJcclxuICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIEV4cG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRXhwb3J0IHRvIEZpbGUgTmFtZVwiLCBcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGV4cG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgZXhwb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcodGFyZ2V0RmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPEV4cG9ydFJlcXVlc3QsIEV4cG9ydFJlc3BvbnNlPihcImV4cG9ydFRvWG1sXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgIH0sIHRoaXMuZXhwb3J0UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0UmVzcG9uc2UgPSAocmVzOiBFeHBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBJbXBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRmlsZSBuYW1lIHRvIGltcG9ydFwiLCBcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsSW1wb3J0QnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGltcG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgaW1wb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICB2YXIgc291cmNlRmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc291cmNlRmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPEltcG9ydFJlcXVlc3QsIEltcG9ydFJlc3BvbnNlPihcImltcG9ydFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICB9LCB0aGlzLmltcG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltcG9ydFJlc3BvbnNlID0gKHJlczogSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW1wb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkltcG9ydCBTdWNjZXNzZnVsLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTZWFyY2hDb250ZW50RGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggQ29udGVudFwiKTtcblxuICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaE5vZGVzQnV0dG9uXCIsIHRoaXMuc2VhcmNoTm9kZXMsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5DT05URU5UKTtcbiAgICB9XG5cbiAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxOb2RlU2VhcmNoUmVxdWVzdCwgTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvL3V0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgdGhpcy5mb2N1cyhcInNlYXJjaFRleHRcIik7XG4gICAgfVxufVxuY2xhc3MgU2VhcmNoVGFnc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2VhcmNoVGFnc0RsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIFRhZ3NcIik7XG5cbiAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIE9ubHkgdGFncyB0ZXh0IHdpbGwgYmUgc2VhcmNoZWQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgIH1cblxuICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPE5vZGVTZWFyY2hSZXF1ZXN0LCBOb2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IFwiXCIsXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICB9XG59XG5jbGFzcyBTZWFyY2hGaWxlc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsdWNlbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgc3VwZXIoXCJTZWFyY2hGaWxlc0RsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIEZpbGVzXCIpO1xuXG4gICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLlwiKTtcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoQnV0dG9uXCIsIHRoaXMuc2VhcmNoVGFncywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgfVxuXG4gICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hGaWxlc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBsZXQgc2VsTm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICBub2RlSWQgPSBzZWxOb2RlLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPEZpbGVTZWFyY2hSZXF1ZXN0LCBGaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXG4gICAgICAgICAgICBcInJlaW5kZXhcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dFxuICAgICAgICB9LCBzcmNoLnNlYXJjaEZpbGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICB9XG59XG5jbGFzcyBDaGFuZ2VQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIHB3ZDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFzc0NvZGU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKFwiQ2hhbmdlUGFzc3dvcmREbGdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2cuXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIHVzZXIgaXMgZG9pbmcgYSBcIlJlc2V0IFBhc3N3b3JkXCIgd2Ugd2lsbCBoYXZlIGEgbm9uLW51bGwgcGFzc0NvZGUgaGVyZSwgYW5kIHdlIHNpbXBseSBzZW5kIHRoaXMgdG8gdGhlIHNlcnZlclxyXG4gICAgICogd2hlcmUgaXQgd2lsbCB2YWxpZGF0ZSB0aGUgcGFzc0NvZGUsIGFuZCBpZiBpdCdzIHZhbGlkIHVzZSBpdCB0byBwZXJmb3JtIHRoZSBjb3JyZWN0IHBhc3N3b3JkIGNoYW5nZSBvbiB0aGUgY29ycmVjdFxyXG4gICAgICogdXNlci5cclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnBhc3NDb2RlID8gXCJQYXNzd29yZCBSZXNldFwiIDogXCJDaGFuZ2UgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgIHZhciBtZXNzYWdlID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG5cclxuICAgICAgICB9LCBcIkVudGVyIHlvdXIgbmV3IHBhc3N3b3JkIGJlbG93Li4uXCIpO1xyXG5cclxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIk5ldyBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGNoYW5nZVBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZEFjdGlvbkJ1dHRvblwiLFxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxDaGFuZ2VQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjaGFuZ2VQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLnB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJjaGFuZ2VQYXNzd29yZDFcIikudHJpbSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wd2QgJiYgdGhpcy5wd2QubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPENoYW5nZVBhc3N3b3JkUmVxdWVzdCwgQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5ld1Bhc3N3b3JkXCI6IHRoaXMucHdkLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzQ29kZVwiOiB0aGlzLnBhc3NDb2RlXHJcbiAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW52YWxpZCBwYXNzd29yZChzKS5cIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IENoYW5nZVBhc3N3b3JkUmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2UgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1zZyA9IFwiUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgbXNnICs9IFwiPHA+WW91IG1heSBub3cgbG9naW4gYXMgPGI+XCIgKyByZXMudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICsgXCI8L2I+IHdpdGggeW91ciBuZXcgcGFzc3dvcmQuXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZywgXCJQYXNzd29yZCBDaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpei5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBsb2dpbiBjYWxsIERPRVMgd29yaywgYnV0IHRoZSByZWFzb24gd2UgZG9uJ3QgZG8gdGhpcyBpcyBiZWNhdXNlIHRoZSBVUkwgc3RpbGwgaGFzIHRoZSBwYXNzQ29kZSBvbiBpdCBhbmQgd2VcclxuICAgICAgICAgICAgICAgICAgICAvL3dhbnQgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIGEgdXJsIHdpdGhvdXQgdGhhdC5cclxuICAgICAgICAgICAgICAgICAgICAvL3VzZXIubG9naW4obnVsbCwgcmVzLnVzZXIsIHRoaXoucHdkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHRoaXMuZm9jdXMoXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgUmVzZXRQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgeW91ciB1c2VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgYW5kIGEgY2hhbmdlLXBhc3N3b3JkIGxpbmsgd2lsbCBiZSBzZW50IHRvIHlvdVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZXNldCBteSBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpLnRyaW0oKTtcclxuICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgIGlmICh1c2VyTmFtZSAmJiBlbWFpbEFkZHJlc3MpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPFJlc2V0UGFzc3dvcmRSZXF1ZXN0LCBSZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IFJlc2V0UGFzc3dvcmRSZXNwb25zZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlc2V0IHBhc3N3b3JkXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdGhpcy51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVXBsb2FkRnJvbUZpbGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRm9yIG5vdyBJIGp1c3QgaGFyZC1jb2RlIGluIDcgZWRpdCBmaWVsZHMsIGJ1dCB3ZSBjb3VsZCB0aGVvcmV0aWNhbGx5IG1ha2UgdGhpcyBkeW5hbWljIHNvIHVzZXIgY2FuIGNsaWNrICdhZGQnXG4gICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICpcbiAgICAgICAgICogdG9kby0wOiBUaGlzIGlzIHVnbHkgdG8gcHJlLWNyZWF0ZSB0aGVzZSBpbnB1dCBmaWVsZHMuIE5lZWQgdG8gbWFrZSB0aGVtIGFibGUgdG8gYWRkIGR5bmFtaWNhbGx5LlxuICAgICAgICAgKiAoV2lsbCBkbyB0aGlzIG1vZGlmaWNhdGlvbiBvbmNlIEkgZ2V0IHRoZSBkcmFnLW4tZHJvcCBzdHVmZiB3b3JraW5nIGZpcnN0KVxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkXCIgKyBpICsgXCJGb3JtSW5wdXRJZFwiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmaWxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmlsZXNcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8qIHdyYXAgaW4gRElWIHRvIGZvcmNlIHZlcnRpY2FsIGFsaWduICovXG4gICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tYm90dG9tOiAxMHB4O1wiXG4gICAgICAgICAgICB9LCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlSWRcIlxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAvKiBib29sZWFuIGZpZWxkIHRvIHNwZWNpZnkgaWYgd2UgZXhwbG9kZSB6aXAgZmlsZXMgb250byB0aGUgSkNSIHRyZWUgKi9cbiAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIiksXG4gICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImV4cGxvZGVaaXBzXCJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpLFxuICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICBcImVuY3R5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICAgICAgICBcImRhdGEtYWpheFwiOiBcImZhbHNlXCIgLy8gTkVXIGZvciBtdWx0aXBsZSBmaWxlIHVwbG9hZCBzdXBwb3J0Pz8/XG4gICAgICAgIH0sIGZvcm1GaWVsZHMpO1xuXG4gICAgICAgIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZpZWxkQ29udGFpbmVyXCIpXG4gICAgICAgIH0sIFwiPHA+VXBsb2FkIGZyb20geW91ciBjb21wdXRlcjwvcD5cIiArIGZvcm0pO1xuXG4gICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsID0gJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpKS52YWwoKTtcbiAgICAgICAgICAgIGlmIChpbnB1dFZhbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICBsZXQgdXBsb2FkRnVuYyA9IChleHBsb2RlWmlwcykgPT4ge1xuICAgICAgICAgICAgLyogVXBsb2FkIGZvcm0gaGFzIGhpZGRlbiBpbnB1dCBlbGVtZW50IGZvciBub2RlSWQgcGFyYW1ldGVyICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSkuYXR0cihcInZhbHVlXCIsIGV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSBkbyBzb21ldGhpbmcgZGlmZmVyZW50bHkgZnJvbSB0aGUgbm9ybWFsICd1dGlsLmpzb24oKScgY2FsbHMgdG8gdGhlIHNlcnZlciwgYmVjYXVzZVxuICAgICAgICAgICAgICogdGhpcyBpcyBoaWdobHkgc3BlY2lhbGl6ZWQgaGVyZSBmb3IgZm9ybSB1cGxvYWRpbmcsIGFuZCBpcyBkaWZmZXJlbnQgZnJvbSBub3JtYWwgYWpheCBjYWxscy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgICAgICBsZXQgcHJtcyA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVcGxvYWQgZmFpbGVkLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzQW55WmlwRmlsZXMoKSkge1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICBcIlllcywgZXhwbG9kZSB6aXBzXCIsIC8vXG4gICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkRnVuYyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgIH1cbn1cbmNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGdcIik7XG4gICAgfVxuXG4gICAgZmlsZUxpc3Q6IE9iamVjdFtdID0gbnVsbDtcbiAgICB6aXBRdWVzdGlvbkFuc3dlcmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWQgQWN0aW9uIFVSTDogXCIgKyBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIik7XG5cbiAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJoaWRkZW5JbnB1dENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJkaXNwbGF5OiBub25lO1wiXG4gICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgIGxldCBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgXCJhY3Rpb25cIjogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAvKiBOb3RlOiB3ZSBhbHNvIGhhdmUgc29tZSBzdHlsaW5nIGluIG1ldGE2NC5jc3MgZm9yICdkcm9wem9uZScgKi9cbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkcm9wem9uZVwiLFxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICB9LCBcIlwiKTtcblxuICAgICAgICBsZXQgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgbnVsbCwgbnVsbCwgZmFsc2UpO1xuICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyBmb3JtICsgaGlkZGVuSW5wdXRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgY29uZmlndXJlRHJvcFpvbmUgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgLy8gUHJldmVudHMgRHJvcHpvbmUgZnJvbSB1cGxvYWRpbmcgZHJvcHBlZCBmaWxlcyBpbW1lZGlhdGVseVxuICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJhbU5hbWU6IFwiZmlsZXNcIixcbiAgICAgICAgICAgIG1heEZpbGVzaXplOiAyLFxuICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgLyogTm90IHN1cmUgd2hhdCdzIHRoaXMgaXMgZm9yLCBidXQgdGhlICdmaWxlcycgcGFyYW1ldGVyIG9uIHRoZSBzZXJ2ZXIgaXMgYWx3YXlzIE5VTEwsIHVubGVzc1xuICAgICAgICAgICAgdGhlIHVwbG9hZE11bHRpcGxlIGlzIGZhbHNlICovXG4gICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICBhZGRSZW1vdmVMaW5rczogdHJ1ZSxcbiAgICAgICAgICAgIGRpY3REZWZhdWx0TWVzc2FnZTogXCJEcmFnICYgRHJvcCBmaWxlcyBoZXJlLCBvciBDbGlja1wiLFxuICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgVGhpcyBkb2Vzbid0IHdvcmsgYXQgYWxsLiBEcm9wem9uZSBhcHBhcmVudGx5IGNsYWltcyB0byBzdXBwb3J0IHRoaXMgYnV0IGRvZXNuJ3QuXG4gICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgIGhlYWRlcnMgOiB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIiA6IGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRyb3B6b25lID0gdGhpczsgLy8gY2xvc3VyZVxuICAgICAgICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgdGhpei5pZChcInVwbG9hZEJ1dHRvblwiKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gZ2V0IHVwbG9hZCBidXR0b24uXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvL2UucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcHpvbmUucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uKFwiYWRkZWRmaWxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnVwZGF0ZUZpbGVMaXN0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uKFwicmVtb3ZlZGZpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucnVuQnV0dG9uRW5hYmxlbWVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwibm9kZUlkXCIsIGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImV4cGxvZGVaaXBzXCIsIHRoaXMuZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbihcInF1ZXVlY29tcGxldGVcIiwgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICg8YW55PiQoXCIjXCIgKyB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKSkpLmRyb3B6b25lKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgdXBkYXRlRmlsZUxpc3QgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZmlsZUxpc3QgPSBkcm9wem9uZUV2dC5nZXRBZGRlZEZpbGVzKCk7XG4gICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdChkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpKTtcblxuICAgICAgICAvKiBEZXRlY3QgaWYgYW55IFpJUCBmaWxlcyBhcmUgY3VycmVudGx5IHNlbGVjdGVkLCBhbmQgYXNrIHVzZXIgdGhlIHF1ZXN0aW9uIGFib3V0IHdoZXRoZXIgdGhleVxuICAgICAgICBzaG91bGQgYmUgZXh0cmFjdGVkIGF1dG9tYXRpY2FsbHkgZHVyaW5nIHRoZSB1cGxvYWQsIGFuZCB1cGxvYWRlZCBhcyBpbmRpdmlkdWFsIG5vZGVzXG4gICAgICAgIGZvciBlYWNoIGZpbGUgKi9cbiAgICAgICAgaWYgKCF0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgJiYgdGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICB0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICBcIlllcywgZXhwbG9kZSB6aXBzXCIsIC8vXG4gICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5leHBsb2RlWmlwcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSwvL1xuICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5leHBsb2RlWmlwcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIHRoaXMuZmlsZUxpc3QpIHtcbiAgICAgICAgICAgIGlmIChmaWxlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcnVuQnV0dG9uRW5hYmxlbWVudCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChkcm9wem9uZUV2dC5nZXRBZGRlZEZpbGVzKCkubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgZHJvcHpvbmVFdnQuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmVEcm9wWm9uZSgpO1xuICAgIH1cbn1cbmNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21VcmxEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRGl2ID0gXCJcIjtcblxuICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgdXBsb2FkRnJvbVVybERpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgIH0sIHVwbG9hZEZyb21VcmxGaWVsZCk7XG5cbiAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAvKiBpZiB1cGxvYWRpbmcgZnJvbSBVUkwgKi9cbiAgICAgICAgaWYgKHNvdXJjZVVybCkge1xuICAgICAgICAgICAgdXRpbC5qc29uPFVwbG9hZEZyb21VcmxSZXF1ZXN0LCBVcGxvYWRGcm9tVXJsUmVzcG9uc2U+KFwidXBsb2FkRnJvbVVybFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgfSwgdGhpcy51cGxvYWRGcm9tVXJsUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBsb2FkRnJvbVVybFJlc3BvbnNlID0gKHJlczogVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlVwbG9hZCBmcm9tIFVSTFwiLCByZXMpKSB7XG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICB9XG59XG5jbGFzcyBFZGl0Tm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICBmaWVsZElkVG9Qcm9wTWFwOiBhbnkgPSB7fTtcbiAgICBwcm9wRW50cmllczogQXJyYXk8UHJvcEVudHJ5PiA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB0eXBlTmFtZT86IHN0cmluZywgcHJpdmF0ZSBjcmVhdGVBdFRvcD86IGJvb2xlYW4pIHtcbiAgICAgICAgc3VwZXIoXCJFZGl0Tm9kZURsZ1wiKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgKiBlZGl0cy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlXCIpO1xuXG4gICAgICAgIHZhciBzYXZlTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVOb2RlQnV0dG9uXCIsIHRoaXMuc2F2ZU5vZGUsIHRoaXMpO1xuICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgdmFyIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBUYWdzXCIsIFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIsXG4gICAgICAgICAgICB0aGlzLmFkZFRhZ3NQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgIHZhciBkZWxldGVQcm9wQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRGVsZXRlXCIsIFwiZGVsZXRlUHJvcEJ1dHRvblwiLCB0aGlzLmRlbGV0ZVByb3BlcnR5QnV0dG9uQ2xpY2ssIHRoaXMpO1xuICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCwgdGhpcyk7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uICsgZGVsZXRlUHJvcEJ1dHRvblxuICAgICAgICAgICAgKyBzcGxpdENvbnRlbnRCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uLCBcImJ1dHRvbnNcIik7XG5cbiAgICAgICAgLyogdG9kbzogbmVlZCBzb21ldGhpbmcgYmV0dGVyIGZvciB0aGlzIHdoZW4gc3VwcG9ydGluZyBtb2JpbGUgKi9cbiAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICB2YXIgaGVpZ2h0ID0gNjAwOyAvL3dpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIilcbiAgICAgICAgfSkgKyByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAvLyB0b2RvLTA6IGNyZWF0ZSBDU1MgY2xhc3MgZm9yIHRoaXMuXG4gICAgICAgICAgICBzdHlsZTogXCJwYWRkaW5nLWxlZnQ6IDBweDsgbWF4LXdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7d2lkdGg6MTAwJTsgb3ZlcmZsb3c6c2Nyb2xsOyBib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcIixcbiAgICAgICAgICAgIGNsYXNzOiBcInZlcnRpY2FsLWxheW91dC1yb3dcIlxuICAgICAgICAgICAgLy9cInBhZGRpbmctbGVmdDogMHB4OyB3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDsgYm9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XCJcbiAgICAgICAgfSwgXCJMb2FkaW5nLi4uXCIpO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogR2VuZXJhdGVzIGFsbCB0aGUgSFRNTCBlZGl0IGZpZWxkcyBhbmQgcHV0cyB0aGVtIGludG8gdGhlIERPTSBtb2RlbCBvZiB0aGUgcHJvcGVydHkgZWRpdG9yIGRpYWxvZyBib3guXG4gICAgICpcbiAgICAgKi9cbiAgICBwb3B1bGF0ZUVkaXROb2RlUGcgPSAoKSA9PiB7XG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICAvKiBjbGVhciB0aGlzIG1hcCB0byBnZXQgcmlkIG9mIG9sZCBwcm9wZXJ0aWVzICovXG4gICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcblxuICAgICAgICAvKiBlZGl0Tm9kZSB3aWxsIGJlIG51bGwgaWYgdGhpcyBpcyBhIG5ldyBub2RlIGJlaW5nIGNyZWF0ZWQgKi9cbiAgICAgICAgaWYgKGVkaXQuZWRpdE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBleGlzdGluZyBub2RlLlwiKTtcblxuICAgICAgICAgICAgLyogaXRlcmF0b3IgZnVuY3Rpb24gd2lsbCBoYXZlIHRoZSB3cm9uZyAndGhpcycgc28gd2Ugc2F2ZSB0aGUgcmlnaHQgb25lICovXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgZWRpdE9yZGVyZWRQcm9wcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihlZGl0LmVkaXROb2RlLCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgdmFyIGFjZUZpZWxkcyA9IFtdO1xuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBXYXJuaW5nIGVhY2ggaXRlcmF0b3IgbG9vcCBoYXMgaXRzIG93biAndGhpcydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJC5lYWNoKGVkaXRPcmRlcmVkUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBwcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghcmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcC5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgZWRpdCBmaWVsZCBcIiArIGZpZWxkSWQgKyBcIiBmb3IgcHJvcGVydHkgXCIgKyBwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSBwcm9wLnZhbHVlcyAmJiBwcm9wLnZhbHVlcy5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIGxldCBwcm9wRW50cnk6IFByb3BFbnRyeSA9IG5ldyBQcm9wRW50cnkoZmllbGRJZCwgcHJvcCwgaXNNdWx0aSwgaXNSZWFkT25seVByb3AsIGlzQmluYXJ5UHJvcCwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgdGhpei5wcm9wRW50cmllcy5wdXNoKHByb3BFbnRyeSk7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGlmIChpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZU11bHRpUHJvcEVkaXRvcihwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZVNpbmdsZVByb3BFZGl0b3IocHJvcEVudHJ5LCBhY2VGaWVsZHMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB8fCBlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcInByb3BlcnR5RWRpdExpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbUhpZGRlblwiKVxuICAgICAgICAgICAgICAgICAgICAvLyBcInN0eWxlXCIgOiBcImRpc3BsYXk6IFwiKyAoIXJkT25seSB8fCBtZXRhNjQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiaW5saW5lXCIgOiBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICB9LCBmaWVsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiBFZGl0aW5nIGEgbmV3IG5vZGUgKi9cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0b2RvLTA6IHRoaXMgZW50aXJlIGJsb2NrIG5lZWRzIHJldmlldyBub3cgKHJlZGVzaWduKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIG5ldyBub2RlLlwiKTtcblxuICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRJZCA9IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IFwiXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5ldyBOb2RlIE5hbWVcIlxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsgXCJkaXNwbGF5XCI6IFwidGFibGUtcm93XCIgfSwgZmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9JJ20gbm90IHF1aXRlIHJlYWR5IHRvIGFkZCB0aGlzIGJ1dHRvbiB5ZXQuXG4gICAgICAgIC8vIHZhciB0b2dnbGVSZWFkb25seVZpc0J1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikudG9nZ2xlU2hvd1JlYWRPbmx5KCk7XCIgLy9cbiAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgLy8gICAgIChlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcIkhpZGUgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIiA6IFwiU2hvdyBSZWFkLU9ubHkgUHJvcGVydGllc1wiKSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIGZpZWxkcyArPSB0b2dnbGVSZWFkb25seVZpc0J1dHRvbjtcblxuICAgICAgICAvL2xldCByb3cgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsgXCJkaXNwbGF5XCI6IFwidGFibGUtcm93XCIgfSwgbGVmdCArIGNlbnRlciArIHJpZ2h0KTtcblxuICAgICAgICBsZXQgcHJvcFRhYmxlOiBzdHJpbmcgPSByZW5kZXIudGFnKFwiZGl2XCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGVcIixcbiAgICAgICAgICAgIH0sIGZpZWxkcyk7XG5cblxuICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLCBwcm9wVGFibGUpO1xuXG4gICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChhY2VGaWVsZHNbaV0uaWQpO1xuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZSh1dGlsLnVuZW5jb2RlSHRtbChhY2VGaWVsZHNbaV0udmFsKSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LmFjZUVkaXRvcnNCeUlkW2FjZUZpZWxkc1tpXS5pZF0gPSBlZGl0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5zdHIgPSBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA/IC8vXG4gICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgIDogLy9cbiAgICAgICAgICAgIFwiXCI7XG5cbiAgICAgICAgdGhpcy5lbChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpLmh0bWwoaW5zdHIpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFsbG93IGFkZGluZyBvZiBuZXcgcHJvcGVydGllcyBhcyBsb25nIGFzIHRoaXMgaXMgYSBzYXZlZCBub2RlIHdlIGFyZSBlZGl0aW5nLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gc3RhcnRcbiAgICAgICAgICogbWFuYWdpbmcgbmV3IHByb3BlcnRpZXMgb24gdGhlIGNsaWVudCBzaWRlLiBXZSBuZWVkIGEgZ2VudWluZSBub2RlIGFscmVhZHkgc2F2ZWQgb24gdGhlIHNlcnZlciBiZWZvcmUgd2UgYWxsb3dcbiAgICAgICAgICogYW55IHByb3BlcnR5IGVkaXRpbmcgdG8gaGFwcGVuLlxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5QnV0dG9uXCIpLCAhZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpO1xuXG4gICAgICAgIHZhciB0YWdzUHJvcEV4aXN0cyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcInRhZ3NcIiwgZWRpdC5lZGl0Tm9kZSkgIT0gbnVsbDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJoYXNUYWdzUHJvcDogXCIgKyB0YWdzUHJvcCk7XG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIiksICF0YWdzUHJvcEV4aXN0cyk7XG4gICAgfVxuXG4gICAgdG9nZ2xlU2hvd1JlYWRPbmx5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvLyBhbGVydChcIm5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAvLyBzZWUgc2F2ZUV4aXN0aW5nTm9kZSBmb3IgaG93IHRvIGl0ZXJhdGUgYWxsIHByb3BlcnRpZXMsIGFsdGhvdWdoIEkgd29uZGVyIHdoeSBJIGRpZG4ndCBqdXN0IHVzZSBhIG1hcC9zZXQgb2ZcbiAgICAgICAgLy8gcHJvcGVydGllcyBlbGVtZW50c1xuICAgICAgICAvLyBpbnN0ZWFkIHNvIEkgZG9uJ3QgbmVlZCB0byBwYXJzZSBhbnkgRE9NIG9yIGRvbUlkcyBpbm9yZGVyIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBvZiB0aGVtPz8/P1xuICAgIH1cblxuICAgIGFkZFByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3QgPSBuZXcgRWRpdFByb3BlcnR5RGxnKHRoaXMpO1xuICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3Qub3BlbigpO1xuICAgIH1cblxuICAgIGFkZFRhZ3NQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChlZGl0LmVkaXROb2RlLCBcInRhZ3NcIikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJ0YWdzXCIsXG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBcIlwiXG4gICAgICAgIH07XG4gICAgICAgIHV0aWwuanNvbjxTYXZlUHJvcGVydHlSZXF1ZXN0LCBTYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogU2F2ZVByb3BlcnR5UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQWRkIFRhZ3MgUHJvcGVydHlcIiwgcmVzKSkge1xuICAgICAgICAgICAgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZShyZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIGlmICh0aGlzLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICB9XG5cbiAgICBhZGRTdWJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0ucHJvcGVydHk7XG5cbiAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAvKiBjb252ZXJ0IHRvIG11bHRpLXR5cGUgaWYgd2UgbmVlZCB0byAqL1xuICAgICAgICBpZiAoIWlzTXVsdGkpIHtcbiAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKHByb3AudmFsdWUpO1xuICAgICAgICAgICAgcHJvcC52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBub3cgYWRkIG5ldyBlbXB0eSBwcm9wZXJ0eSBhbmQgcG9wdWxhdGUgaXQgb250byB0aGUgc2NyZWVuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE8tMzogZm9yIHBlcmZvcm1hbmNlIHdlIGNvdWxkIGRvIHNvbWV0aGluZyBzaW1wbGVyIHRoYW4gJ3BvcHVsYXRlRWRpdE5vZGVQZycgaGVyZSwgYnV0IGZvciBub3cgd2UganVzdFxuICAgICAgICAgKiByZXJlbmRlcmluZyB0aGUgZW50aXJlIGVkaXQgcGFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHByb3AudmFsdWVzLnB1c2goXCJcIik7XG5cbiAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERlbGV0ZXMgdGhlIHByb3BlcnR5IG9mIHRoZSBzcGVjaWZpZWQgbmFtZSBvbiB0aGUgbm9kZSBiZWluZyBlZGl0ZWQsIGJ1dCBmaXJzdCBnZXRzIGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcbiAgICAgKi9cbiAgICBkZWxldGVQcm9wZXJ0eSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlJbW1lZGlhdGUocHJvcE5hbWUpO1xuICAgICAgICB9KSkub3BlbigpO1xuICAgIH1cblxuICAgIGRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlID0gKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHV0aWwuanNvbjxEZWxldGVQcm9wZXJ0eVJlcXVlc3QsIERlbGV0ZVByb3BlcnR5UmVzcG9uc2U+KFwiZGVsZXRlUHJvcGVydHlcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5UmVzcG9uc2UocmVzLCBwcm9wTmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnksIHByb3BlcnR5VG9EZWxldGU6IGFueSkgPT4ge1xuXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBwcm9wZXJ0eVwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiByZW1vdmUgZGVsZXRlZCBwcm9wZXJ0eSBmcm9tIGNsaWVudCBzaWRlIGRhdGEsIHNvIHdlIGNhbiByZS1yZW5kZXIgc2NyZWVuIHdpdGhvdXQgbWFraW5nIGFub3RoZXIgY2FsbCB0b1xuICAgICAgICAgICAgICogc2VydmVyXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHByb3BzLmRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YShwcm9wZXJ0eVRvRGVsZXRlKTtcblxuICAgICAgICAgICAgLyogbm93IGp1c3QgcmUtcmVuZGVyIHNjcmVlbiBmcm9tIGxvY2FsIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCldO1xuICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHNjYW4gZm9yIGFsbCBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBmaWVsZHMgYW5kIGNsZWFyIHRoZW0gKi9cbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGlmICghdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKSwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIGZvciBub3cganVzdCBsZXQgc2VydmVyIHNpZGUgY2hva2Ugb24gaW52YWxpZCB0aGluZ3MuIEl0IGhhcyBlbm91Z2ggc2VjdXJpdHkgYW5kIHZhbGlkYXRpb24gdG8gYXQgbGVhc3QgcHJvdGVjdFxuICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgKi9cbiAgICBzYXZlTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICogSWYgZWRpdGluZyBhbiB1bnNhdmVkIG5vZGUgaXQncyB0aW1lIHRvIHJ1biB0aGUgaW5zZXJ0Tm9kZSwgb3IgY3JlYXRlU3ViTm9kZSwgd2hpY2ggYWN0dWFsbHkgc2F2ZXMgb250byB0aGVcbiAgICAgICAgICogc2VydmVyLCBhbmQgd2lsbCBpbml0aWF0ZSBmdXJ0aGVyIGVkaXRpbmcgbGlrZSBmb3IgcHJvcGVydGllcywgZXRjLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVOZXdOb2RlLlwiKTtcblxuICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgIHRoaXMuc2F2ZU5ld05vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBFbHNlIHdlIGFyZSBlZGl0aW5nIGEgc2F2ZWQgbm9kZSwgd2hpY2ggaXMgYWxyZWFkeSBzYXZlZCBvbiBzZXJ2ZXIuXG4gICAgICAgICAqL1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZS5cIik7XG4gICAgICAgICAgICB0aGlzLnNhdmVFeGlzdGluZ05vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVOZXdOb2RlID0gKG5ld05vZGVOYW1lPzogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgIG5ld05vZGVOYW1lID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJZiB3ZSBkaWRuJ3QgY3JlYXRlIHRoZSBub2RlIHdlIGFyZSBpbnNlcnRpbmcgdW5kZXIsIGFuZCBuZWl0aGVyIGRpZCBcImFkbWluXCIsIHRoZW4gd2UgbmVlZCB0byBzZW5kIG5vdGlmaWNhdGlvblxuICAgICAgICAgKiBlbWFpbCB1cG9uIHNhdmluZyB0aGlzIG5ldyBub2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1ldGE2NC51c2VyTmFtZSAhPSBlZGl0LnBhcmVudE9mTmV3Tm9kZS5jcmVhdGVkQnkgJiYgLy9cbiAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAhPSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICB1dGlsLmpzb248SW5zZXJ0Tm9kZVJlcXVlc3QsIEluc2VydE5vZGVSZXNwb25zZT4oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0TmFtZVwiOiBlZGl0Lm5vZGVJbnNlcnRUYXJnZXQubmFtZSxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiXG4gICAgICAgICAgICB9LCBlZGl0Lmluc2VydE5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsLmpzb248Q3JlYXRlU3ViTm9kZVJlcXVlc3QsIENyZWF0ZVN1Yk5vZGVSZXNwb25zZT4oXCJjcmVhdGVTdWJOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQXRUb3BcIjogdGhpcy5jcmVhdGVBdFRvcFxuICAgICAgICAgICAgfSwgZWRpdC5jcmVhdGVTdWJOb2RlUmVzcG9uc2UsIGVkaXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZUV4aXN0aW5nTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgIC8qIGhvbGRzIGxpc3Qgb2YgcHJvcGVydGllcyB0byBzZW5kIHRvIHNlcnZlci4gRWFjaCBvbmUgaGF2aW5nIG5hbWUrdmFsdWUgcHJvcGVydGllcyAqL1xuICAgICAgICB2YXIgcHJvcGVydGllc0xpc3QgPSBbXTtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLnByb3BFbnRyaWVzLCBmdW5jdGlvbihpbmRleDogbnVtYmVyLCBwcm9wOiBhbnkpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0gR2V0dGluZyBwcm9wIGlkeDogXCIgKyBpbmRleCk7XG5cbiAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICBpZiAocHJvcC5yZWFkT25seSB8fCBwcm9wLmJpbmFyeSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG5vbi1tdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcblxuICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbcHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwcm9wVmFsICE9PSBwcm9wLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5wcm9wZXJ0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBtdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChwcm9wLnN1YlByb3BzLCBmdW5jdGlvbihpbmRleCwgc3ViUHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3ViUHJvcFtcIiArIGluZGV4ICsgXCJdOiBcIiArIEpTT04uc3RyaW5naWZ5KHN1YlByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbc3ViUHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIHN1YlByb3AgSUQ6IFwiICsgc3ViUHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQoc3ViUHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBzdWJQcm9wW1wiICsgaW5kZXggKyBcIl0gb2YgXCIgKyBwcm9wLm5hbWUgKyBcIiB2YWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHMucHVzaChwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgIC8qIGlmIGFueXRoaW5nIGNoYW5nZWQsIHNhdmUgdG8gc2VydmVyICovXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNMaXN0LFxuICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHNhdmVOb2RlKCkuIFBvc3REYXRhPVwiICsgdXRpbC50b0pzb24ocG9zdERhdGEpKTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxTYXZlTm9kZVJlcXVlc3QsIFNhdmVOb2RlUmVzcG9uc2U+KFwic2F2ZU5vZGVcIiwgcG9zdERhdGEsIGVkaXQuc2F2ZU5vZGVSZXNwb25zZSwgbnVsbCwge1xuICAgICAgICAgICAgICAgIHNhdmVkSWQ6IGVkaXQuZWRpdE5vZGUuaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWFraW5nIE11bHRpIEVkaXRvcjogUHJvcGVydHkgbXVsdGktdHlwZTogbmFtZT1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCIgY291bnQ9XCJcbiAgICAgICAgICAgICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlcy5sZW5ndGgpO1xuICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMgPSBbXTtcblxuICAgICAgICB2YXIgcHJvcExpc3QgPSBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzO1xuICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBwcm9wTGlzdCA9IFtdO1xuICAgICAgICAgICAgcHJvcExpc3QucHVzaChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJvcCBtdWx0aS12YWxbXCIgKyBpICsgXCJdPVwiICsgcHJvcExpc3RbaV0pO1xuICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcExpc3RbaV07XG4gICAgICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgfHwgJyc7XG4gICAgICAgICAgICBwcm9wVmFsU3RyID0gdXRpbC5lc2NhcGVGb3JBdHRyaWIocHJvcFZhbCk7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgdGV4dGFyZWEgd2l0aCBpZD1cIiArIGlkKTtcblxuICAgICAgICAgICAgbGV0IHN1YlByb3A6IFN1YlByb3AgPSBuZXcgU3ViUHJvcChpZCwgcHJvcFZhbCk7XG4gICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5iaW5hcnkgfHwgcHJvcEVudHJ5LnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCI6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IHRhYmxlLWNlbGw7XCJcbiAgICAgICAgfSwgZmllbGRzKTtcblxuICAgICAgICByZXR1cm4gY29sO1xuICAgIH1cblxuICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHkgc2luZ2xlLXR5cGU6IFwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICB2YXIgbGFiZWwgPSByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgPyBwcm9wVmFsIDogJyc7XG4gICAgICAgIHByb3BWYWxTdHIgPSB1dGlsLmVzY2FwZUZvckF0dHJpYihwcm9wVmFsU3RyKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJtYWtpbmcgc2luZ2xlIHByb3AgZWRpdG9yOiBwcm9wW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIl0gdmFsW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlXG4gICAgICAgICAgICArIFwiXSBmaWVsZElkPVwiICsgcHJvcEVudHJ5LmlkKTtcblxuICAgICAgICBsZXQgcHJvcFNlbENoZWNrYm94OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGlmIChwcm9wRW50cnkucmVhZE9ubHkgfHwgcHJvcEVudHJ5LmJpbmFyeSkge1xuICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICBcImRpc2FibGVkXCI6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wU2VsQ2hlY2tib3ggPSB0aGlzLm1ha2VDaGVja0JveChcIlwiLCBcInNlbFByb3BfXCIgKyBwcm9wRW50cnkuaWQsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lID09IGpjckNuc3QuQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbENvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiA0MHB4OyBkaXNwbGF5OiB0YWJsZS1jZWxsOyBwYWRkaW5nOiAxMHB4O1wiXG4gICAgICAgIH0sIHByb3BTZWxDaGVja2JveCk7XG5cbiAgICAgICAgbGV0IGVkaXRDb2wgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweDtcIlxuICAgICAgICB9LCBmaWVsZCk7XG5cbiAgICAgICAgcmV0dXJuIHNlbENvbCArIGVkaXRDb2w7XG4gICAgfVxuXG4gICAgZGVsZXRlUHJvcGVydHlCdXR0b25DbGljayA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAvKiBJdGVyYXRlIG92ZXIgYWxsIHByb3BlcnRpZXMgKi9cbiAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5maWVsZElkVG9Qcm9wTWFwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWVsZElkVG9Qcm9wTWFwLmhhc093blByb3BlcnR5KGlkKSkge1xuXG4gICAgICAgICAgICAgICAgLyogZ2V0IFByb3BFbnRyeSBmb3IgdGhpcyBpdGVtICovXG4gICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2lkXTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcm9wPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsUHJvcERvbUlkID0gXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIEdldCBjaGVja2JveCBjb250cm9sIGFuZCBpdHMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdG9kby0xOiBnZXR0aW5nIHZhbHVlIG9mIGNoZWNrYm94IHNob3VsZCBiZSBpbiBzb21lIHNoYXJlZCB1dGlsaXR5IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsQ2hlY2tib3ggPSB1dGlsLnBvbHlFbG0odGhpcy5pZChzZWxQcm9wRG9tSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbENoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hlY2tlZDogYm9vbGVhbiA9IHNlbENoZWNrYm94Lm5vZGUuY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3AgSVMgQ0hFQ0tFRD1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVByb3BlcnR5KHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGZvciBub3cgbGV0cycganVzdCBzdXBwb3J0IGRlbGV0aW5nIG9uZSBwcm9wZXJ0eSBhdCBhIHRpbWUsIGFuZCBzbyB3ZSBjYW4gcmV0dXJuIG9uY2Ugd2UgZm91bmQgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgb25lIHRvIGRlbGV0ZS4gV291bGQgYmUgZWFzeSB0byBleHRlbmQgdG8gYWxsb3cgbXVsdGlwbGUtc2VsZWN0cyBpbiB0aGUgZnV0dXJlICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInByb3BFbnRyeSBub3QgZm91bmQgZm9yIGlkOiBcIiArIGlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZSBwcm9wZXJ0eTogXCIpXG4gICAgfVxuXG4gICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgbm9kZUJlbG93OiBOb2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICB1dGlsLmpzb248U3BsaXROb2RlUmVxdWVzdCwgU3BsaXROb2RlUmVzcG9uc2U+KFwic3BsaXROb2RlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICBcIm5vZGVCZWxvd0lkXCI6IChub2RlQmVsb3cgPT0gbnVsbCA/IG51bGwgOiBub2RlQmVsb3cuaWQpLFxuICAgICAgICAgICAgXCJkZWxpbWl0ZXJcIjogbnVsbFxuICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBzcGxpdENvbnRlbnRSZXNwb25zZSA9IChyZXM6IFNwbGl0Tm9kZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNwbGl0IGNvbnRlbnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgaWYgKG1ldGE2NC50cmVlRGlydHkpIHtcbiAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXROb2RlRGxnLmluaXRcIik7XG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuY29udGVudEZpZWxkRG9tSWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKlxuICogUHJvcGVydHkgRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZSBQcm9wZXJ0aWVzKVxuICovXG5jbGFzcyBFZGl0UHJvcGVydHlEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgIHZhciBzYXZlUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJvcGVydHlCdXR0b25cIiwgdGhpcy5zYXZlUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgKyBcIicgY2xhc3M9J3BhdGgtZGlzcGxheS1pbi1lZGl0b3InPjwvZGl2PlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBmaWVsZCA9ICcnO1xuXG4gICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZpZWxkUHJvcE5hbWVJZCA9IFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BOYW1lSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcFZhbHVlSWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlZhbHVlXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZCk7XG4gICAgfVxuXG4gICAgc2F2ZVByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCIpKTtcbiAgICAgICAgdmFyIHByb3BlcnR5VmFsdWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCIpKTtcblxuICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZURhdGEsXG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBwcm9wZXJ0eVZhbHVlRGF0YVxuICAgICAgICB9O1xuICAgICAgICB1dGlsLmpzb248U2F2ZVByb3BlcnR5UmVxdWVzdCwgU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBzYXZlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IFNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBpZiAodGhpcy5lZGl0Tm9kZURsZy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuZWRpdE5vZGVEbGcucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVByb3BlcnR5RWRpdCgpO1xuICAgIH1cbn1cbmNsYXNzIFNoYXJlVG9QZXJzb25EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNoYXJlVG9QZXJzb25EbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNoYXJlIE5vZGUgdG8gUGVyc29uXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyIHRvIFNoYXJlIFdpdGhcIiwgXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNoYXJlTm9kZVRvUGVyc29uQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIFwiPHA+RW50ZXIgdGhlIHVzZXJuYW1lIG9mIHRoZSBwZXJzb24geW91IHdhbnQgdG8gc2hhcmUgdGhpcyBub2RlIHdpdGg6PC9wPlwiICsgZm9ybUNvbnRyb2xzXG4gICAgICAgICAgICArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBzaGFyZU5vZGVUb1BlcnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHRhcmdldFVzZXIgPSB0aGlzLmdldElucHV0VmFsKFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIHVzZXJuYW1lXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAqL1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICB1dGlsLmpzb248QWRkUHJpdmlsZWdlUmVxdWVzdCwgQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCIsIFwid3JpdGVcIiwgXCJhZGRDaGlsZHJlblwiLCBcIm5vZGVUeXBlTWFuYWdlbWVudFwiXSxcbiAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IGZhbHNlXG4gICAgICAgIH0sIHRoaXoucmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiwgdGhpeik7XG4gICAgfVxuXG4gICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IEFkZFByaXZpbGVnZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFNoYXJpbmdEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNoYXJpbmdEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk5vZGUgU2hhcmluZ1wiKTtcblxuICAgICAgICB2YXIgc2hhcmVXaXRoUGVyc29uQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2hhcmUgd2l0aCBQZXJzb25cIiwgXCJzaGFyZU5vZGVUb1BlcnNvblBnQnV0dG9uXCIsXG4gICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICB2YXIgbWFrZVB1YmxpY0J1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHRvIFB1YmxpY1wiLCBcInNoYXJlTm9kZVRvUHVibGljQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QdWJsaWMsXG4gICAgICAgICAgICB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVXaXRoUGVyc29uQnV0dG9uICsgbWFrZVB1YmxpY0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJzaGFyZU5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2Rpdj5cIiArIC8vXG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3ZlcnRpY2FsLWxheW91dC1yb3cnIHN0eWxlPVxcXCJ3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDtib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcXFwiIGlkPSdcIlxuICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICovXG4gICAgcmVsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgIHV0aWwuanNvbjxHZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBIYW5kbGVzIGdldE5vZGVQcml2aWxlZ2VzIHJlc3BvbnNlLlxuICAgICAqXG4gICAgICogcmVzPWpzb24gb2YgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZS5qYXZhXG4gICAgICpcbiAgICAgKiByZXMuYWNsRW50cmllcyA9IGxpc3Qgb2YgQWNjZXNzQ29udHJvbEVudHJ5SW5mby5qYXZhIGpzb24gb2JqZWN0c1xuICAgICAqL1xuICAgIGdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgPSAocmVzOiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAqL1xuICAgIHBvcHVsYXRlU2hhcmluZ1BnID0gKHJlczogR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAkLmVhY2gocmVzLmFjbEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4LCBhY2xFbnRyeSkge1xuICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtbGlzdFwiXG4gICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHB1YmxpY0FwcGVuZEF0dHJzID0ge1xuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIsXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAocmVzLnB1YmxpY0FwcGVuZCkge1xuICAgICAgICAgICAgcHVibGljQXBwZW5kQXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvOiB1c2UgYWN0dWFsIHBvbHltZXIgcGFwZXItY2hlY2tib3ggaGVyZSAqL1xuICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBwdWJsaWNBcHBlbmRBdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgIFwiZm9yXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgfSwgXCJBbGxvdyBwdWJsaWMgY29tbWVudGluZyB1bmRlciB0aGlzIG5vZGUuXCIsIHRydWUpO1xuXG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgfVxuXG4gICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVXNpbmcgb25DbGljayBvbiB0aGUgZWxlbWVudCBBTkQgdGhpcyB0aW1lb3V0IGlzIHRoZSBvbmx5IGhhY2sgSSBjb3VsZCBmaW5kIHRvIGdldCBnZXQgd2hhdCBhbW91bnRzIHRvIGEgc3RhdGVcbiAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXouaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIikpO1xuXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPEFkZFByaXZpbGVnZVJlcXVlc3QsIEFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiAocG9seUVsbS5ub2RlLmNoZWNrZWQgPyB0cnVlIDogZmFsc2UpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCAyNTApO1xuICAgIH1cblxuICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdXRpbC5qc29uPFJlbW92ZVByaXZpbGVnZVJlcXVlc3QsIFJlbW92ZVByaXZpbGVnZVJlc3BvbnNlPihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IHByaW5jaXBhbCxcbiAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICB9LCB0aGlzLnJlbW92ZVByaXZpbGVnZVJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IFJlbW92ZVByaXZpbGVnZVJlc3BvbnNlKTogdm9pZCA9PiB7XG5cbiAgICAgICAgdXRpbC5qc29uPEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5wYXRoLFxuICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHJlbmRlckFjbFByaXZpbGVnZXMgPSAocHJpbmNpcGFsOiBhbnksIGFjbEVudHJ5OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAkLmVhY2goYWNsRW50cnkucHJpdmlsZWdlcywgZnVuY3Rpb24oaW5kZXgsIHByaXZpbGVnZSkge1xuXG4gICAgICAgICAgICB2YXIgcmVtb3ZlQnV0dG9uID0gdGhpei5tYWtlQnV0dG9uKFwiUmVtb3ZlXCIsIFwicmVtb3ZlUHJpdkJ1dHRvblwiLCAvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXouZ3VpZCArIFwiKS5yZW1vdmVQcml2aWxlZ2UoJ1wiICsgcHJpbmNpcGFsICsgXCInLCAnXCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZVxuICAgICAgICAgICAgICAgICsgXCInKTtcIik7XG5cbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICByb3cgKz0gXCI8Yj5cIiArIHByaW5jaXBhbCArIFwiPC9iPiBoYXMgcHJpdmlsZWdlIDxiPlwiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWUgKyBcIjwvYj4gb24gdGhpcyBub2RlLlwiO1xuXG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1lbnRyeVwiXG4gICAgICAgICAgICB9LCByb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBzaGFyZU5vZGVUb1BlcnNvblBnID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAobmV3IFNoYXJlVG9QZXJzb25EbGcoKSkub3BlbigpO1xuICAgIH1cblxuICAgIHNoYXJlTm9kZVRvUHVibGljID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNoYXJpbmcgbm9kZSB0byBwdWJsaWMuXCIpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICovXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFkZCBwcml2aWxlZ2UgYW5kIHRoZW4gcmVsb2FkIHNoYXJlIG5vZGVzIGRpYWxvZyBmcm9tIHNjcmF0Y2ggZG9pbmcgYW5vdGhlciBjYWxsYmFjayB0byBzZXJ2ZXJcbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETzogdGhpcyBhZGRpdGlvbmFsIGNhbGwgY2FuIGJlIGF2b2lkZWQgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLmpzb248QWRkUHJpdmlsZWdlUmVxdWVzdCwgQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IFtcInJlYWRcIl0sXG4gICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICB9LCB0aGlzLnJlbG9hZCwgdGhpcyk7XG4gICAgfVxufVxuY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgIHZhciBjdXJOb2RlUGF0aERpc3BsYXkgPSBcIjxoNCBjbGFzcz0ncGF0aC1kaXNwbGF5JyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpICsgXCInPjwvaDQ+XCI7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlbmFtZU5vZGVCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZWxlY3QgYSBub2RlIHRvIHJlbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGlmIG5vIG5vZGUgYmVsb3cgdGhpcyBub2RlLCByZXR1cm5zIG51bGwgKi9cbiAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHV0aWwuanNvbjxSZW5hbWVOb2RlUmVxdWVzdCwgUmVuYW1lTm9kZVJlc3BvbnNlPihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczogUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGl6LnJlbmFtZU5vZGVSZXNwb25zZShyZXMsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBSZW5hbWVOb2RlUmVzcG9uc2UsIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVuYW1lIG5vZGVcIiwgcmVzKSkge1xuICAgICAgICAgICAgaWYgKHJlbmFtaW5nUGFnZVJvb3QpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHJlcy5uZXdJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyBoaWdobGlnaHROb2RlLnBhdGgpO1xuICAgIH1cbn1cblxyXG4vKiBUaGlzIGlzIGFuIGF1ZGlvIHBsYXllciBkaWFsb2cgdGhhdCBoYXMgYWQtc2tpcHBpbmcgdGVjaG5vbG9neSBwcm92aWRlZCBieSBwb2RjYXN0LnRzICovXHJcbmNsYXNzIEF1ZGlvUGxheWVyRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzb3VyY2VVcmw6IHN0cmluZywgcHJpdmF0ZSBub2RlVWlkOiBzdHJpbmcsIHByaXZhdGUgc3RhcnRUaW1lUGVuZGluZzogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoXCJBdWRpb1BsYXllckRsZ1wiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgc3RhcnRUaW1lUGVuZGluZyBpbiBjb25zdHJ1Y3RvcjogJHtzdGFydFRpbWVQZW5kaW5nfWApO1xyXG4gICAgICAgIHBvZGNhc3Quc3RhcnRUaW1lUGVuZGluZyA9IHN0YXJ0VGltZVBlbmRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyogV2hlbiB0aGUgZGlhbG9nIGNsb3NlcyB3ZSBuZWVkIHRvIHN0b3AgYW5kIHJlbW92ZSB0aGUgcGxheWVyICovXHJcbiAgICBwdWJsaWMgY2FuY2VsKCkge1xyXG4gICAgICAgIHN1cGVyLmNhbmNlbCgpO1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSAkKFwiI1wiICsgdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpKTtcclxuICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8qIGZvciBzb21lIHJlYXNvbiB0aGUgYXVkaW8gcGxheWVyIG5lZWRzIHRvIGJlIGFjY2Vzc2VkIGxpa2UgaXQncyBhbiBhcnJheSAqL1xyXG4gICAgICAgICAgICAoPGFueT5wbGF5ZXJbMF0pLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIHBsYXllci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQXVkaW8gUGxheWVyXCIpO1xyXG5cclxuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3RoaXMubm9kZVVpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IGB1bmtub3duIG5vZGUgdWlkOiAke3RoaXMubm9kZVVpZH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJzc1RpdGxlOiBQcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAvKiBUaGlzIGlzIHdoZXJlIEkgbmVlZCBhIHNob3J0IG5hbWUgb2YgdGhlIG1lZGlhIGJlaW5nIHBsYXllZCAqL1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vcmVmZXJlbmNlczpcclxuICAgICAgICAvL2h0dHA6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL3JlZl9hdl9kb20uYXNwXHJcbiAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgIGxldCBwbGF5ZXJBdHRyaWJzOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIFwic3JjXCI6IHRoaXMuc291cmNlVXJsLFxyXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiAxMDAlOyBwYWRkaW5nOjBweDsgbWFyZ2luLXRvcDogMHB4OyBtYXJnaW4tbGVmdDogMHB4OyBtYXJnaW4tcmlnaHQ6IDBweDtcIixcclxuICAgICAgICAgICAgXCJvbnRpbWV1cGRhdGVcIjogYHBvZGNhc3Qub25UaW1lVXBkYXRlKCcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICBcIm9uY2FucGxheVwiOiBgcG9kY2FzdC5vbkNhblBsYXkoJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgIFwiY29udHJvbHNcIjogXCJjb250cm9sc1wiLFxyXG4gICAgICAgICAgICBcInByZWxvYWRcIjogXCJhdXRvXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyID0gcmVuZGVyLnRhZyhcImF1ZGlvXCIsIHBsYXllckF0dHJpYnMpO1xyXG5cclxuICAgICAgICAvL1NraXBwaW5nIEJ1dHRvbnNcclxuICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogYHBvZGNhc3Quc2tpcCgtMzAsICcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiPCAzMHNcIik7XHJcblxyXG4gICAgICAgIGxldCBza2lwRm9yd2FyZDMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBgcG9kY2FzdC5za2lwKDMwLCAnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICBsZXQgc2tpcEJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihza2lwQmFjazMwQnV0dG9uICsgc2tpcEZvcndhcmQzMEJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vU3BlZWQgQnV0dG9uc1xyXG4gICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJwb2RjYXN0LnNwZWVkKDEuMCk7XCIsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGVlZDE1QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Quc3BlZWQoMS41KTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIjEuNVhcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGVlZDJ4QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Quc3BlZWQoMik7XCIsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCIyWFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAvL0RpYWxvZyBCdXR0b25zXHJcbiAgICAgICAgbGV0IHBhdXNlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3QucGF1c2UoKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIlBhdXNlXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGxheUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJwb2RjYXN0LnBsYXkoKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBsYXlCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgLy90b2RvLTA6IGV2ZW4gaWYgdGhpcyBidXR0b24gYXBwZWFycyB0byB3b3JrLCBJIG5lZWQgaXQgdG8gZXhwbGljaXRseSBlbmZvcmNlIHRoZSBzYXZpbmcgb2YgdGhlIHRpbWV2YWx1ZSBBTkQgdGhlIHJlbW92YWwgb2YgdGhlIEFVRElPIGVsZW1lbnQgZnJvbSB0aGUgRE9NICovXHJcbiAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZUF1ZGlvUGxheWVyRGxnQnV0dG9uXCIsIHRoaXMuY2xvc2VCdG4pO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGRlc2NyaXB0aW9uICsgcGxheWVyICsgc2tpcEJ1dHRvbkJhciArIHNwZWVkQnV0dG9uQmFyICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENyZWF0ZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgIGxhc3RTZWxUeXBlTmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgIGxldCBjcmVhdGVGaXJzdENoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJGaXJzdFwiLCBcImNyZWF0ZUZpcnN0Q2hpbGRCdXR0b25cIiwgdGhpcy5jcmVhdGVGaXJzdENoaWxkLCB0aGlzLCB0cnVlLCAxMDAwKTtcbiAgICAgICAgbGV0IGNyZWF0ZUxhc3RDaGlsZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTGFzdFwiLCBcImNyZWF0ZUxhc3RDaGlsZEJ1dHRvblwiLCB0aGlzLmNyZWF0ZUxhc3RDaGlsZCwgdGhpcyk7XG4gICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIklubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxCdXR0b25cIik7XG4gICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY3JlYXRlRmlyc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUxhc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUlubGluZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIGxldCBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgbGV0IHR5cGVJZHggPSAwO1xuICAgICAgICAvKiB0b2RvLTE6IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGVudW1lcmF0ZSBhbmQgYWRkIHRoZSB0eXBlcyB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoICovXG4gICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTdGFuZGFyZCBUeXBlXCIsIFwibnQ6dW5zdHJ1Y3R1cmVkXCIsIHR5cGVJZHgrKywgdHJ1ZSk7XG4gICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJSU1MgRmVlZFwiLCBcIm1ldGE2NDpyc3NmZWVkXCIsIHR5cGVJZHgrKywgZmFsc2UpO1xuICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3lzdGVtIEZvbGRlclwiLCBcIm1ldGE2NDpzeXN0ZW1mb2xkZXJcIiwgdHlwZUlkeCsrLCBmYWxzZSk7XG5cbiAgICAgICAgdmFyIGxpc3RCb3ggPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0Qm94XCJcbiAgICAgICAgfSwgY29udGVudCk7XG5cbiAgICAgICAgdmFyIG1haW5Db250ZW50OiBzdHJpbmcgPSBsaXN0Qm94O1xuXG4gICAgICAgIHZhciBjZW50ZXJlZEhlYWRlcjogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiY2VudGVyZWRUaXRsZVwiXG4gICAgICAgIH0sIGhlYWRlcik7XG5cbiAgICAgICAgcmV0dXJuIGNlbnRlcmVkSGVhZGVyICsgbWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgbWFrZUxpc3RJdGVtKHZhbDogc3RyaW5nLCB0eXBlTmFtZTogc3RyaW5nLCB0eXBlSWR4OiBudW1iZXIsIGluaXRpYWxseVNlbGVjdGVkOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHBheWxvYWQ6IE9iamVjdCA9IHtcbiAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdHlwZU5hbWUsXG4gICAgICAgICAgICBcInR5cGVJZHhcIjogdHlwZUlkeFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBkaXZJZDogc3RyaW5nID0gdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpO1xuXG4gICAgICAgIGlmIChpbml0aWFsbHlTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSB0eXBlTmFtZTtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEl0ZW1cIiArIChpbml0aWFsbHlTZWxlY3RlZCA/IFwiIHNlbGVjdGVkTGlzdEl0ZW1cIiA6IFwiXCIpLFxuICAgICAgICAgICAgXCJpZFwiOiBkaXZJZCxcbiAgICAgICAgICAgIFwib25jbGlja1wiOiBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLm9uUm93Q2xpY2ssIHRoaXMsIHBheWxvYWQpXG4gICAgICAgIH0sIHZhbCk7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlyc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIHRydWUpO1xuICAgIH1cblxuICAgIGNyZWF0ZUxhc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGVJbmxpbmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWRpdC5pbnNlcnROb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lKTtcbiAgICB9XG5cbiAgICBvblJvd0NsaWNrID0gKHBheWxvYWQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgZGl2SWQgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgcGF5bG9hZC50eXBlSWR4KTtcbiAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSBwYXlsb2FkLnR5cGVOYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmxhc3RTZWxEb21JZCkge1xuICAgICAgICAgICAgdGhpcy5lbCh0aGlzLmxhc3RTZWxEb21JZCkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgIHRoaXMuZWwoZGl2SWQpLmFkZENsYXNzKFwic2VsZWN0ZWRMaXN0SXRlbVwiKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgbm9kZTogTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBsZXQgY2FuSW5zZXJ0SW5saW5lOiBib29sZWFuID0gbWV0YTY0LmhvbWVOb2RlSWQgIT0gbm9kZS5pZDtcbiAgICAgICAgICAgIGlmIChjYW5JbnNlcnRJbmxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsKFwiY3JlYXRlSW5saW5lQnV0dG9uXCIpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWwoXCJjcmVhdGVJbmxpbmVCdXR0b25cIikuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICBkb21JZDogc3RyaW5nID0gXCJzZWFyY2hSZXN1bHRzUGFuZWxcIjtcclxuICAgIHRhYklkOiBzdHJpbmcgPSBcInNlYXJjaFRhYk5hbWVcIjtcclxuICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3NlYXJjaFBhZ2VUaXRsZScgY2xhc3M9J3BhZ2UtdGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICQoXCIjc2VhcmNoUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC5zZWFyY2hQYWdlVGl0bGUpO1xyXG4gICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnNlYXJjaFJlc3VsdHMsIFwic2VhcmNoUmVzdWx0c1ZpZXdcIik7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgVGltZWxpbmVSZXN1bHRzUGFuZWwge1xyXG5cclxuICAgIGRvbUlkOiBzdHJpbmcgPSBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCI7XHJcbiAgICB0YWJJZDogc3RyaW5nID0gXCJ0aW1lbGluZVRhYk5hbWVcIjtcclxuICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3RpbWVsaW5lUGFnZVRpdGxlJyBjbGFzcz0ncGFnZS10aXRsZSc+PC9oMj5cIjtcclxuICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3RpbWVsaW5lVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgJChcIiN0aW1lbGluZVBhZ2VUaXRsZVwiKS5odG1sKHNyY2gudGltZWxpbmVQYWdlVGl0bGUpO1xyXG4gICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnRpbWVsaW5lUmVzdWx0cywgXCJ0aW1lbGluZVZpZXdcIik7XHJcbiAgICB9XHJcbn1cblxubWV0YTY0LmluaXRBcHAoKTtcbiJdfQ==