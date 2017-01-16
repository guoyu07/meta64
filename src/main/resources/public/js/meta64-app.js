var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cnst;
(function (cnst) {
    cnst.ANON = "anonymous";
    cnst.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
    cnst.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
    cnst.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
    cnst.INSERT_ATTACHMENT = "{{insert-attachment}}";
    cnst.NEW_ON_TOOLBAR = false;
    cnst.INS_ON_TOOLBAR = false;
    cnst.MOVE_UPDOWN_ON_TOOLBAR = true;
    cnst.USE_ACE_EDITOR = false;
    cnst.SHOW_PATH_ON_ROWS = true;
    cnst.SHOW_PATH_IN_DLGS = true;
    cnst.SHOW_CLEAR_BUTTON_IN_EDITOR = false;
})(cnst || (cnst = {}));
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
var util;
(function (util) {
    util.logAjax = false;
    util.timeoutMessageShown = false;
    util.offline = false;
    util.waitCounter = 0;
    util.pgrsDlg = null;
    util.escapeRegExp = function (_) {
        return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
    util.escapeForAttrib = function (_) {
        return util.replaceAll(_, "\"", "&quot;");
    };
    util.unencodeHtml = function (_) {
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
    util.replaceAll = function (_, find, replace) {
        return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
    };
    util.contains = function (_, str) {
        return _.indexOf(str) != -1;
    };
    util.startsWith = function (_, str) {
        return _.indexOf(str) === 0;
    };
    util.stripIfStartsWith = function (_, str) {
        if (_.startsWith(str)) {
            return _.substring(str.length);
        }
        return _;
    };
    util.arrayClone = function (_) {
        return _.slice(0);
    };
    util.arrayIndexOfItemByProp = function (_, propName, propVal) {
        var len = _.length;
        for (var i = 0; i < len; i++) {
            if (_[i][propName] === propVal) {
                return i;
            }
        }
        return -1;
    };
    util.arrayMoveItem = function (_, fromIndex, toIndex) {
        _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
    };
    util.stdTimezoneOffset = function (_) {
        var jan = new Date(_.getFullYear(), 0, 1);
        var jul = new Date(_.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };
    util.dst = function (_) {
        return _.getTimezoneOffset() < util.stdTimezoneOffset(_);
    };
    util.indexOfObject = function (_, obj) {
        for (var i = 0; i < _.length; i++) {
            if (_[i] === obj) {
                return i;
            }
        }
        return -1;
    };
    util.assertNotNull = function (varName) {
        if (typeof eval(varName) === 'undefined') {
            (new MessageDlg("Variable not found: " + varName)).open();
        }
    };
    var _ajaxCounter = 0;
    util.daylightSavingsTime = (util.dst(new Date())) ? true : false;
    util.toJson = function (obj) {
        return JSON.stringify(obj, null, 4);
    };
    util.getParameterByName = function (name, url) {
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
    util.inherit = function (parent, child) {
        child.prototype.constructor = child;
        child.prototype = Object.create(parent.prototype);
        return child.prototype;
    };
    util.initProgressMonitor = function () {
        setInterval(util.progressInterval, 1000);
    };
    util.progressInterval = function () {
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
    util.json = function (postName, postData, callback, callbackThis, callbackPayload) {
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
            _ajaxCounter++;
            ironRequest = ironAjax.generateRequest();
        }
        catch (ex) {
            util.logAndReThrow("Failed starting request: " + postName, ex);
        }
        ironRequest.completes.then(function () {
            try {
                _ajaxCounter--;
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
                _ajaxCounter--;
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
    util.logAndThrow = function (message) {
        var stack = "[stack, not supported]";
        try {
            stack = new Error().stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw message;
    };
    util.logAndReThrow = function (message, exception) {
        var stack = "[stack, not supported]";
        try {
            stack = new Error().stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw exception;
    };
    util.ajaxReady = function (requestName) {
        if (_ajaxCounter > 0) {
            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
            return false;
        }
        return true;
    };
    util.isAjaxWaiting = function () {
        return _ajaxCounter > 0;
    };
    util.delayedFocus = function (id) {
        setTimeout(function () {
            $(id).focus();
        }, 500);
        setTimeout(function () {
            $(id).focus();
        }, 1300);
    };
    util.checkSuccess = function (opFriendlyName, res) {
        if (!res.success) {
            (new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
        }
        return res.success;
    };
    util.addAll = function (obj, a) {
        for (var i = 0; i < a.length; i++) {
            if (!a[i]) {
                console.error("null element in addAll at idx=" + i);
            }
            else {
                obj[a[i]] = true;
            }
        }
    };
    util.nullOrUndef = function (obj) {
        return obj === null || obj === undefined;
    };
    util.getUidForId = function (map, id) {
        var uid = map[id];
        if (!uid) {
            uid = "" + meta64.nextUid++;
            map[id] = uid;
        }
        return uid;
    };
    util.elementExists = function (id) {
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
    util.getTextAreaValById = function (id) {
        var de = util.domElm(id);
        return de.value;
    };
    util.domElm = function (id) {
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
    util.poly = function (id) {
        return util.polyElm(id).node;
    };
    util.polyElm = function (id) {
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
    util.polyElmNode = function (id) {
        var e = util.polyElm(id);
        return e.node;
    };
    util.getRequiredElement = function (id) {
        var e = $(id);
        if (e == null) {
            console.log("getRequiredElement. Required element id not found: " + id);
        }
        return e;
    };
    util.isObject = function (obj) {
        return obj && obj.length != 0;
    };
    util.currentTimeMillis = function () {
        return new Date().getMilliseconds();
    };
    util.emptyString = function (val) {
        return !val || val.length == 0;
    };
    util.getInputVal = function (id) {
        return util.polyElm(id).node.value;
    };
    util.setInputVal = function (id, val) {
        if (val == null) {
            val = "";
        }
        var elm = util.polyElm(id);
        if (elm) {
            elm.node.value = val;
        }
        return elm != null;
    };
    util.bindEnterKey = function (id, func) {
        util.bindKey(id, func, 13);
    };
    util.bindKey = function (id, func, keyCode) {
        $(id).keypress(function (e) {
            if (e.which == keyCode) {
                func();
                return false;
            }
        });
        return false;
    };
    util.changeOrAddClass = function (elm, oldClass, newClass) {
        var elmement = $(elm);
        elmement.toggleClass(oldClass, false);
        elmement.toggleClass(newClass, true);
    };
    util.verifyType = function (obj, type, msg) {
        if (typeof obj !== type) {
            (new MessageDlg(msg)).open();
            return false;
        }
        return true;
    };
    util.setHtml = function (id, content) {
        if (content == null) {
            content = "";
        }
        var elm = util.domElm(id);
        var polyElm = Polymer.dom(elm);
        polyElm.innerHTML = content;
        Polymer.dom.flush();
        Polymer.updateStyles();
    };
    util.getPropertyCount = function (obj) {
        var count = 0;
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    };
    util.printObject = function (obj) {
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
    util.printKeys = function (obj) {
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
    util.setEnablement = function (elmId, enable) {
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
    util.setVisibility = function (elmId, vis) {
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
    util.getInstance = function (context, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    };
})(util || (util = {}));
var jcrCnst;
(function (jcrCnst) {
    jcrCnst.COMMENT_BY = "commentBy";
    jcrCnst.PUBLIC_APPEND = "publicAppend";
    jcrCnst.PRIMARY_TYPE = "jcr:primaryType";
    jcrCnst.POLICY = "rep:policy";
    jcrCnst.MIXIN_TYPES = "jcr:mixinTypes";
    jcrCnst.EMAIL_CONTENT = "jcr:content";
    jcrCnst.EMAIL_RECIP = "recip";
    jcrCnst.EMAIL_SUBJECT = "subject";
    jcrCnst.CREATED = "jcr:created";
    jcrCnst.CREATED_BY = "jcr:createdBy";
    jcrCnst.CONTENT = "jcr:content";
    jcrCnst.TAGS = "tags";
    jcrCnst.UUID = "jcr:uuid";
    jcrCnst.LAST_MODIFIED = "jcr:lastModified";
    jcrCnst.LAST_MODIFIED_BY = "jcr:lastModifiedBy";
    jcrCnst.JSON_FILE_SEARCH_RESULT = "meta64:json";
    jcrCnst.DISABLE_INSERT = "disableInsert";
    jcrCnst.USER = "user";
    jcrCnst.PWD = "pwd";
    jcrCnst.EMAIL = "email";
    jcrCnst.CODE = "code";
    jcrCnst.BIN_VER = "binVer";
    jcrCnst.BIN_DATA = "jcrData";
    jcrCnst.BIN_MIME = "jcr:mimeType";
    jcrCnst.IMG_WIDTH = "imgWidth";
    jcrCnst.IMG_HEIGHT = "imgHeight";
})(jcrCnst || (jcrCnst = {}));
var attachment;
(function (attachment) {
    attachment.uploadNode = null;
    attachment.openUploadFromFileDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            attachment.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        attachment.uploadNode = node;
        (new UploadFromFileDropzoneDlg()).open();
    };
    attachment.openUploadFromUrlDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            attachment.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        attachment.uploadNode = node;
        (new UploadFromUrlDlg()).open();
    };
    attachment.deleteAttachment = function () {
        var node = meta64.getHighlightedNode();
        if (node) {
            (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                util.json("deleteAttachment", {
                    "nodeId": node.id
                }, attachment.deleteAttachmentResponse, null, node.uid);
            })).open();
        }
    };
    attachment.deleteAttachmentResponse = function (res, uid) {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            meta64.goToMainPage(true);
        }
    };
})(attachment || (attachment = {}));
var edit;
(function (edit) {
    edit.createNode = function () {
        (new CreateNodeDlg()).open();
    };
    var insertBookResponse = function (res) {
        console.log("insertBookResponse running.");
        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    };
    var deleteNodesResponse = function (res, payload) {
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
    var initNodeEditResponse = function (res) {
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
    var moveNodesResponse = function (res) {
        if (util.checkSuccess("Move nodes", res)) {
            edit.nodesToMove = null;
            edit.nodesToMoveSet = {};
            view.refreshTree(null, false);
        }
    };
    var setNodePositionResponse = function (res) {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    };
    edit.showReadOnlyProperties = true;
    edit.nodesToMove = null;
    edit.nodesToMoveSet = {};
    edit.parentOfNewNode = null;
    edit.editingUnsavedNode = false;
    edit.sendNotificationPendingSave = false;
    edit.editNode = null;
    edit.editNodeDlgInst = null;
    edit.nodeInsertTarget = null;
    edit.isEditAllowed = function (node) {
        return meta64.userPreferences.editMode && node.path != "/" &&
            (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
            && !props.isNonOwnedNode(node);
    };
    edit.isInsertAllowed = function (node) {
        return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
    };
    edit.startEditingNewNode = function (typeName, createAtTop) {
        edit.editingUnsavedNode = false;
        edit.editNode = null;
        edit.editNodeDlgInst = new EditNodeDlg(typeName, createAtTop);
        edit.editNodeDlgInst.saveNewNode("");
    };
    edit.startEditingNewNodeWithName = function () {
        edit.editingUnsavedNode = true;
        edit.editNode = null;
        edit.editNodeDlgInst = new EditNodeDlg();
        edit.editNodeDlgInst.open();
    };
    edit.insertNodeResponse = function (res) {
        if (util.checkSuccess("Insert node", res)) {
            meta64.initNode(res.newNode, true);
            meta64.highlightNode(res.newNode, true);
            edit.runEditNode(res.newNode.uid);
        }
    };
    edit.createSubNodeResponse = function (res) {
        if (util.checkSuccess("Create subnode", res)) {
            meta64.initNode(res.newNode, true);
            edit.runEditNode(res.newNode.uid);
        }
    };
    edit.saveNodeResponse = function (res, payload) {
        if (util.checkSuccess("Save node", res)) {
            view.refreshTree(null, false, payload.savedId);
            meta64.selectTab("mainTabName");
        }
    };
    edit.editMode = function (modeVal) {
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
    edit.moveNodeUp = function (uid) {
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
            }, setNodePositionResponse);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    edit.moveNodeDown = function (uid) {
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
            }, setNodePositionResponse);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    edit.moveNodeToTop = function (uid) {
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
            }, setNodePositionResponse);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    edit.moveNodeToBottom = function (uid) {
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
            }, setNodePositionResponse);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    edit.getNodeAbove = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        if (ordinal <= 0)
            return null;
        return meta64.currentNodeData.children[ordinal - 1];
    };
    edit.getNodeBelow = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        console.log("ordinal = " + ordinal);
        if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
            return null;
        return meta64.currentNodeData.children[ordinal + 1];
    };
    edit.getFirstChildNode = function () {
        if (!meta64.currentNodeData || !meta64.currentNodeData.children)
            return null;
        return meta64.currentNodeData.children[0];
    };
    edit.runEditNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            edit.editNode = null;
            (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
            return;
        }
        edit.editingUnsavedNode = false;
        util.json("initNodeEdit", {
            "nodeId": node.id
        }, initNodeEditResponse);
    };
    edit.insertNode = function (uid, typeName) {
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
    edit.createSubNode = function (uid, typeName, createAtTop) {
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
    edit.replyToComment = function (uid) {
        edit.createSubNode(uid);
    };
    edit.clearSelections = function () {
        meta64.clearSelectedNodes();
        render.renderPageFromData();
        meta64.selectTab("mainTabName");
    };
    edit.deleteSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
            return;
        }
        (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
            var postDeleteSelNode = edit.getBestPostDeleteSelNode();
            util.json("deleteNodes", {
                "nodeIds": selNodesArray
            }, deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
        })).open();
    };
    edit.getBestPostDeleteSelNode = function () {
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
    edit.cutSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes first.")).open();
            return;
        }
        (new ConfirmDlg("Confirm Cut", "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?", "Yes", function () {
            edit.nodesToMove = selNodesArray;
            loadNodesToMoveSet(selNodesArray);
            meta64.selectedNodes = {};
            render.renderPageFromData();
            meta64.refreshAllGuiEnablement();
        })).open();
    };
    var loadNodesToMoveSet = function (nodeIds) {
        edit.nodesToMoveSet = {};
        for (var _i = 0, nodeIds_1 = nodeIds; _i < nodeIds_1.length; _i++) {
            var id = nodeIds_1[_i];
            edit.nodesToMoveSet[id] = true;
        }
    };
    edit.pasteSelNodes = function () {
        (new ConfirmDlg("Confirm Paste", "Paste " + edit.nodesToMove.length + " node(s) under selected parent node ?", "Yes, paste.", function () {
            var highlightNode = meta64.getHighlightedNode();
            util.json("moveNodes", {
                "targetNodeId": highlightNode.id,
                "targetChildId": highlightNode != null ? highlightNode.id : null,
                "nodeIds": edit.nodesToMove
            }, moveNodesResponse);
        })).open();
    };
    edit.insertBookWarAndPeace = function () {
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
                }, insertBookResponse);
            }
        })).open();
    };
})(edit || (edit = {}));
var meta64;
(function (meta64) {
    meta64.appInitialized = false;
    meta64.curUrlPath = window.location.pathname + window.location.search;
    meta64.codeFormatDirty = false;
    meta64.nextGuid = 0;
    meta64.userName = "anonymous";
    meta64.deviceWidth = 0;
    meta64.deviceHeight = 0;
    meta64.homeNodeId = "";
    meta64.homeNodePath = "";
    meta64.isAdminUser = false;
    meta64.isAnonUser = true;
    meta64.anonUserLandingPageNode = null;
    meta64.allowFileSystemSearch = false;
    meta64.treeDirty = false;
    meta64.uidToNodeMap = {};
    meta64.idToNodeMap = {};
    meta64.aceEditorsById = {};
    meta64.nextUid = 1;
    meta64.identToUidMap = {};
    meta64.parentUidToFocusNodeMap = {};
    meta64.MODE_ADVANCED = "advanced";
    meta64.MODE_SIMPLE = "simple";
    meta64.editModeOption = "simple";
    meta64.showProperties = false;
    meta64.showMetaData = false;
    meta64.simpleModeNodePrefixBlackList = {
        "rep:": true
    };
    meta64.simpleModePropertyBlackList = {};
    meta64.readOnlyPropertyList = {};
    meta64.binaryPropertyList = {};
    meta64.selectedNodes = {};
    meta64.expandedAbbrevNodeIds = {};
    meta64.currentNodeData = null;
    meta64.currentNode = null;
    meta64.currentNodeUid = null;
    meta64.currentNodeId = null;
    meta64.currentNodePath = null;
    meta64.dataObjMap = {};
    meta64.renderFunctionsByJcrType = {};
    meta64.propOrderingFunctionsByJcrType = {};
    meta64.userPreferences = {
        "editMode": false,
        "advancedMode": false,
        "lastNode": "",
        "importAllowed": false,
        "exportAllowed": false,
        "showMetaData": false
    };
    meta64.updateMainMenuPanel = function () {
        console.log("building main menu panel");
        menuPanel.build();
        menuPanel.init();
    };
    meta64.registerDataObject = function (data) {
        if (!data.guid) {
            data.guid = ++meta64.nextGuid;
            meta64.dataObjMap[data.guid] = data;
        }
    };
    meta64.getObjectByGuid = function (guid) {
        var ret = meta64.dataObjMap[guid];
        if (!ret) {
            console.log("data object not found: guid=" + guid);
        }
        return ret;
    };
    meta64.encodeOnClick = function (callback, ctx, payload, delayCallback) {
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
    meta64.runCallback = function (guid, ctx, payload, delayCallback) {
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
    meta64.runCallbackImmediate = function (guid, ctx, payload) {
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
    meta64.inSimpleMode = function () {
        return meta64.editModeOption === meta64.MODE_SIMPLE;
    };
    meta64.refresh = function () {
        meta64.goToMainPage(true, true);
    };
    meta64.goToMainPage = function (rerender, forceServerRefresh) {
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
    meta64.selectTab = function (pageName) {
        var ironPages = document.querySelector("#mainIronPages");
        ironPages.select(pageName);
    };
    meta64.changePage = function (pg, data) {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }
        var paperTabs = document.querySelector("#mainIronPages");
        paperTabs.select(pg.tabId);
    };
    meta64.isNodeBlackListed = function (node) {
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
    meta64.getSelectedNodeUidsArray = function () {
        var selArray = [], uid;
        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                selArray.push(uid);
            }
        }
        return selArray;
    };
    meta64.getSelectedNodeIdsArray = function () {
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
    meta64.getSelectedNodesAsMapById = function () {
        var ret = {};
        var selArray = this.getSelectedNodesArray();
        for (var i = 0; i < selArray.length; i++) {
            ret[selArray[i].id] = selArray[i];
        }
        return ret;
    };
    meta64.getSelectedNodesArray = function () {
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
    meta64.clearSelectedNodes = function () {
        meta64.selectedNodes = {};
    };
    meta64.updateNodeInfoResponse = function (res, node) {
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
    meta64.updateNodeInfo = function (node) {
        util.json("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        }, function (res) {
            meta64.updateNodeInfoResponse(res, node);
        });
    };
    meta64.getNodeFromId = function (id) {
        return meta64.idToNodeMap[id];
    };
    meta64.getPathOfUid = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        }
        else {
            return node.path;
        }
    };
    meta64.getHighlightedNode = function () {
        var ret = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
        return ret;
    };
    meta64.highlightRowById = function (id, scroll) {
        var node = meta64.getNodeFromId(id);
        if (node) {
            meta64.highlightNode(node, scroll);
        }
        else {
            console.log("highlightRowById failed to find id: " + id);
        }
    };
    meta64.highlightNode = function (node, scroll) {
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
    meta64.refreshAllGuiEnablement = function () {
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
    meta64.getSingleSelectedNode = function () {
        var uid;
        for (uid in meta64.selectedNodes) {
            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                return meta64.uidToNodeMap[uid];
            }
        }
        return null;
    };
    meta64.getOrdinalOfNode = function (node) {
        if (!node || !meta64.currentNodeData || !meta64.currentNodeData.children)
            return -1;
        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
            if (node.id === meta64.currentNodeData.children[i].id) {
                return i;
            }
        }
        return -1;
    };
    meta64.getNumChildNodes = function () {
        if (!meta64.currentNodeData || !meta64.currentNodeData.children)
            return 0;
        return meta64.currentNodeData.children.length;
    };
    meta64.setCurrentNodeData = function (data) {
        meta64.currentNodeData = data;
        meta64.currentNode = data.node;
        meta64.currentNodeUid = data.node.uid;
        meta64.currentNodeId = data.node.id;
        meta64.currentNodePath = data.node.path;
    };
    meta64.anonPageLoadResponse = function (res) {
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
    meta64.removeBinaryByUid = function (uid) {
        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
            var node = meta64.currentNodeData.children[i];
            if (node.uid === uid) {
                node.hasBinary = false;
                break;
            }
        }
    };
    meta64.initNode = function (node, updateMaps) {
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
    meta64.initConstants = function () {
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
    meta64.initApp = function () {
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
    meta64.processUrlParams = function () {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(function () {
                (new ChangePasswordDlg(passCode)).open();
            }, 100);
        }
        meta64.urlCmd = util.getParameterByName("cmd");
    };
    meta64.tabChangeEvent = function (tabName) {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    };
    meta64.displaySignupMessage = function () {
        var signupResponse = $("#signupCodeResponse").text();
        if (signupResponse === "ok") {
            (new MessageDlg("Signup complete. You may now login.")).open();
        }
    };
    meta64.screenSizeChange = function () {
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
    meta64.orientationHandler = function (event) {
    };
    meta64.loadAnonPageHome = function (ignoreUrl) {
        util.json("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, meta64.anonPageLoadResponse);
    };
    meta64.saveUserPreferences = function () {
        util.json("saveUserPreferences", {
            "userPreferences": meta64.userPreferences
        });
    };
    meta64.openSystemFile = function (fileName) {
        util.json("openSystemFile", {
            "fileName": fileName
        });
    };
    meta64.editSystemFile = function (fileName) {
        new EditSystemFileDlg(fileName).open();
    };
})(meta64 || (meta64 = {}));
var nav;
(function (nav) {
    nav._UID_ROWID_SUFFIX = "_row";
    nav.mainOffset = 0;
    nav.endReached = true;
    nav.ROWS_PER_PAGE = 25;
    nav.openMainMenuHelp = function () {
        nav.mainOffset = 0;
        util.json("renderNode", {
            "nodeId": "/meta64/public/help",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    };
    nav.openRssFeedsNode = function () {
        nav.mainOffset = 0;
        util.json("renderNode", {
            "nodeId": "/rss/feeds",
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": nav.mainOffset,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    };
    nav.expandMore = function (nodeId) {
        meta64.expandedAbbrevNodeIds[nodeId] = true;
        util.json("expandAbbreviatedNode", {
            "nodeId": nodeId
        }, expandAbbreviatedNodeResponse);
    };
    var expandAbbreviatedNodeResponse = function (res) {
        if (util.checkSuccess("ExpandAbbreviatedNode", res)) {
            render.refreshNodeOnPage(res.nodeInfo);
        }
    };
    nav.displayingHome = function () {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        }
        else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    };
    nav.parentVisibleToUser = function () {
        return !nav.displayingHome();
    };
    nav.upLevelResponse = function (res, id) {
        if (!res || !res.node) {
            (new MessageDlg("No data is visible to you above this node.")).open();
        }
        else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    };
    nav.navUpLevel = function () {
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
    nav.getSelectedDomElement = function () {
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
    nav.getSelectedPolyElement = function () {
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
    nav.clickOnNodeRow = function (rowElm, uid) {
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
    nav.openNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);
        if (!node) {
            (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
        }
        else {
            view.refreshTree(node.id, false);
        }
    };
    nav.toggleNodeSel = function (uid) {
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
    nav.navPageNodeResponse = function (res) {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    };
    nav.navHome = function () {
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
    nav.navPublicHome = function () {
        meta64.loadAnonPageHome(true);
    };
})(nav || (nav = {}));
var prefs;
(function (prefs) {
    prefs.closeAccountResponse = function (res) {
        $(window).off("beforeunload");
        window.location.href = window.location.origin;
    };
    prefs.closeAccount = function () {
        (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
            (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                user.deleteAllUserCookies();
                util.json("closeAccount", {}, prefs.closeAccountResponse);
            })).open();
        })).open();
    };
})(prefs || (prefs = {}));
var props;
(function (props_1) {
    props_1.orderProps = function (propOrder, props) {
        var propsNew = util.arrayClone(props);
        var targetIdx = 0;
        for (var _i = 0, propOrder_1 = propOrder; _i < propOrder_1.length; _i++) {
            var prop = propOrder_1[_i];
            targetIdx = moveNodePosition(propsNew, targetIdx, prop);
        }
        return propsNew;
    };
    var moveNodePosition = function (props, idx, typeName) {
        var tagIdx = util.arrayIndexOfItemByProp(props, "name", typeName);
        if (tagIdx != -1) {
            util.arrayMoveItem(props, tagIdx, idx++);
        }
        return idx;
    };
    props_1.propsToggle = function () {
        meta64.showProperties = meta64.showProperties ? false : true;
        render.renderPageFromData();
        view.scrollToSelectedNode();
        meta64.selectTab("mainTabName");
    };
    props_1.deletePropertyFromLocalData = function (propertyName) {
        for (var i = 0; i < edit.editNode.properties.length; i++) {
            if (propertyName === edit.editNode.properties[i].name) {
                edit.editNode.properties.splice(i, 1);
                break;
            }
        }
    };
    props_1.getPropertiesInEditingOrder = function (node, props) {
        var func = meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
        if (func) {
            return func(node, props);
        }
        var propsNew = util.arrayClone(props);
        movePropsToTop([jcrCnst.CONTENT, jcrCnst.TAGS], propsNew);
        movePropsToEnd([jcrCnst.CREATED, jcrCnst.CREATED_BY, jcrCnst.LAST_MODIFIED, jcrCnst.LAST_MODIFIED_BY], propsNew);
        return propsNew;
    };
    var movePropsToTop = function (propsList, props) {
        for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
            var prop = propsList_1[_i];
            var tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, 0);
            }
        }
    };
    var movePropsToEnd = function (propsList, props) {
        for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
            var prop = propsList_2[_i];
            var tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, props.length);
            }
        }
    };
    props_1.renderProperties = function (properties) {
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
    props_1.getNodeProperty = function (propertyName, node) {
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
    props_1.getNodePropertyVal = function (propertyName, node) {
        var prop = props_1.getNodeProperty(propertyName, node);
        return prop ? prop.value : null;
    };
    props_1.isNonOwnedNode = function (node) {
        var createdBy = props_1.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        if (!createdBy) {
            createdBy = "admin";
        }
        return createdBy != meta64.userName;
    };
    props_1.isNonOwnedCommentNode = function (node) {
        var commentBy = props_1.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy != meta64.userName;
    };
    props_1.isOwnedCommentNode = function (node) {
        var commentBy = props_1.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy == meta64.userName;
    };
    props_1.renderProperty = function (property) {
        if (!property.values) {
            if (!property.value || property.value.length == 0) {
                return "";
            }
            return property.value;
        }
        else {
            return props_1.renderPropertyValues(property.values);
        }
    };
    props_1.renderPropertyValues = function (values) {
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
})(props || (props = {}));
var render;
(function (render) {
    var debug = false;
    var getEmptyPagePrompt = function () {
        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
    };
    var renderBinary = function (node) {
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
    render.buidPage = function (pg, data) {
        console.log("buildPage: pg.domId=" + pg.domId);
        if (!pg.built || data) {
            pg.build(data);
            pg.built = true;
        }
        if (pg.init) {
            pg.init(data);
        }
    };
    render.buildRowHeader = function (node, showPath, showName) {
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
    render.injectCodeFormatting = function (content) {
        if (!content)
            return content;
        if (util.contains(content, "<code")) {
            meta64.codeFormatDirty = true;
            content = render.encodeLanguages(content);
            content = util.replaceAll(content, "</code>", "</pre>");
        }
        return content;
    };
    render.injectSubstitutions = function (content) {
        return util.replaceAll(content, "{{locationOrigin}}", window.location.origin);
    };
    render.encodeLanguages = function (content) {
        var langs = ["js", "html", "htm", "css"];
        for (var i = 0; i < langs.length; i++) {
            content = util.replaceAll(content, "<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
        }
        content = util.replaceAll(content, "<code>", "<pre class='prettyprint'>");
        return content;
    };
    render.refreshNodeOnPage = function (node) {
        var uid = meta64.identToUidMap[node.id];
        if (!uid)
            throw "Unable to find nodeId " + node.id + " in uid map";
        meta64.initNode(node, false);
        if (uid != node.uid)
            throw "uid changed unexpectly after initNode";
        var rowContent = render.renderNodeContent(node, true, true, true, true, true);
        $("#" + uid + "_content").html(rowContent);
    };
    render.renderNodeContent = function (node, showPath, showName, renderBin, rowStyling, showHeader) {
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
            var binary = renderBinary(node);
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
    render.renderJsonFileSearchResultProperty = function (jsonContent) {
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
    render.renderNodeAsListItem = function (node, index, count, rowCount) {
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
    render.showNodeUrl = function () {
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
    render.getTopRightImageTag = function (node) {
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
    render.getNodeBkgImageStyle = function (node) {
        var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
        var bkgImgStyle = "";
        if (bkgImg) {
            bkgImgStyle = "background-image: url(" + bkgImg + ");";
        }
        return bkgImgStyle;
    };
    render.centeredButtonBar = function (buttons, classes) {
        classes = classes || "";
        return render.tag("div", {
            "class": "horizontal center-justified layout vertical-layout-row " + classes
        }, buttons);
    };
    render.centerContent = function (content, width) {
        var div = render.tag("div", { "style": "width:" + width + "px;" }, content);
        var attrs = {
            "class": "horizontal center-justified layout vertical-layout-row"
        };
        return render.tag("div", attrs, div, true);
    };
    render.buttonBar = function (buttons, classes) {
        classes = classes || "";
        return render.tag("div", {
            "class": "horizontal left-justified layout vertical-layout-row " + classes
        }, buttons);
    };
    render.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
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
    render.makeHorizontalFieldSet = function (content, extraClasses) {
        return render.tag("div", {
            "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
        }, content, true);
    };
    render.makeHorzControlGroup = function (content) {
        return render.tag("div", {
            "class": "horizontal layout"
        }, content, true);
    };
    render.makeRadioButton = function (label, id) {
        return render.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    };
    render.nodeHasChildren = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("Unknown nodeId in nodeHasChildren: " + uid);
            return false;
        }
        else {
            return node.hasChildren;
        }
    };
    render.formatPath = function (node) {
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
    render.wrapHtml = function (text) {
        return "<div>" + text + "</div>";
    };
    render.renderPageFromData = function (data, scrollToTop) {
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
        if (debug) {
            console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
        }
        var output = "";
        var bkgStyle = render.getNodeBkgImageStyle(data.node);
        var mainNodeContent = render.renderNodeContent(data.node, true, true, true, false, true);
        if (mainNodeContent.length > 0) {
            var uid = data.node.uid;
            var cssId = uid + "_row";
            var buttonBar_1 = "";
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
                buttonBar_1 = render.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
            }
            var content = render.tag("div", {
                "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId
            }, buttonBar_1 + mainNodeContent);
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
                output = getEmptyPagePrompt();
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
    render.firstPage = function () {
        console.log("First page button click.");
        view.firstPage();
    };
    render.prevPage = function () {
        console.log("Prev page button click.");
        view.prevPage();
    };
    render.nextPage = function () {
        console.log("Next page button click.");
        view.nextPage();
    };
    render.lastPage = function () {
        console.log("Last page button click.");
        view.lastPage();
    };
    render.generateRow = function (i, node, newData, childCount, rowCount) {
        if (meta64.isNodeBlackListed(node))
            return "";
        if (newData) {
            meta64.initNode(node, true);
            if (debug) {
                console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
            }
        }
        rowCount++;
        var row = render.renderNodeAsListItem(node, i, childCount, rowCount);
        return row;
    };
    render.getUrlForNodeAttachment = function (node) {
        return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
    };
    render.adjustImageSize = function (node) {
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
    render.makeImageTag = function (node) {
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
    render.tag = function (tag, attributes, content, closeTag) {
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
    render.makeTextArea = function (fieldName, fieldId) {
        return render.tag("paper-textarea", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    render.makeEditField = function (fieldName, fieldId) {
        return render.tag("paper-input", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    render.makePasswordField = function (fieldName, fieldId) {
        return render.tag("paper-input", {
            "type": "password",
            "name": fieldId,
            "label": fieldName,
            "id": fieldId,
            "class": "meta64-input"
        }, "", true);
    };
    render.makeButton = function (text, id, callback, ctx) {
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
    render.allowPropertyToDisplay = function (propName) {
        if (!meta64.inSimpleMode())
            return true;
        return meta64.simpleModePropertyBlackList[propName] == null;
    };
    render.isReadOnlyProperty = function (propName) {
        return meta64.readOnlyPropertyList[propName];
    };
    render.isBinaryProperty = function (propName) {
        return meta64.binaryPropertyList[propName];
    };
    render.sanitizePropertyName = function (propName) {
        if (meta64.editModeOption === "simple") {
            return propName === jcrCnst.CONTENT ? "Content" : propName;
        }
        else {
            return propName;
        }
    };
})(render || (render = {}));
var srch;
(function (srch) {
    srch._UID_ROWID_SUFFIX = "_srch_row";
    srch.searchNodes = null;
    srch.searchPageTitle = "Search Results";
    srch.timelinePageTitle = "Timeline";
    srch.searchOffset = 0;
    srch.timelineOffset = 0;
    srch.searchResults = null;
    srch.timelineResults = null;
    srch.highlightRowNode = null;
    srch.identToUidMap = {};
    srch.uidToNodeMap = {};
    srch.numSearchResults = function () {
        return srch.searchResults != null &&
            srch.searchResults.searchResults != null &&
            srch.searchResults.searchResults.length != null ?
            srch.searchResults.searchResults.length : 0;
    };
    srch.searchTabActivated = function () {
        if (srch.numSearchResults() == 0 && !meta64.isAnonUser) {
            (new SearchContentDlg()).open();
        }
    };
    srch.searchNodesResponse = function (res) {
        srch.searchResults = res;
        var searchResultsPanel = new SearchResultsPanel();
        var content = searchResultsPanel.build();
        util.setHtml("searchResultsPanel", content);
        searchResultsPanel.init();
        meta64.changePage(searchResultsPanel);
    };
    srch.timelineResponse = function (res) {
        srch.timelineResults = res;
        var timelineResultsPanel = new TimelineResultsPanel();
        var content = timelineResultsPanel.build();
        util.setHtml("timelineResultsPanel", content);
        timelineResultsPanel.init();
        meta64.changePage(timelineResultsPanel);
    };
    srch.searchFilesResponse = function (res) {
        nav.mainOffset = 0;
        util.json("renderNode", {
            "nodeId": res.searchResultNodeId,
            "upLevel": null,
            "renderParentIfLeaf": null,
            "offset": 0,
            "goToLastPage": false
        }, nav.navPageNodeResponse);
    };
    srch.timelineByModTime = function () {
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
    srch.timelineByCreateTime = function () {
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
    srch.initSearchNode = function (node) {
        node.uid = util.getUidForId(srch.identToUidMap, node.id);
        srch.uidToNodeMap[node.uid] = node;
    };
    srch.populateSearchResultsPage = function (data, viewName) {
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
    srch.renderSearchResultAsListItem = function (node, index, count, rowCount) {
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
    srch.makeButtonBarHtml = function (uid) {
        var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
        return render.makeHorizontalFieldSet(gotoButton);
    };
    srch.clickOnSearchResultRow = function (rowElm, uid) {
        srch.unhighlightRow();
        srch.highlightRowNode = srch.uidToNodeMap[uid];
        util.changeOrAddClass(rowElm, "inactive-row", "active-row");
    };
    srch.clickSearchNode = function (uid) {
        srch.highlightRowNode = srch.uidToNodeMap[uid];
        if (!srch.highlightRowNode) {
            throw "Unable to find uid in search results: " + uid;
        }
        view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
        meta64.selectTab("mainTabName");
    };
    srch.unhighlightRow = function () {
        if (!srch.highlightRowNode) {
            return;
        }
        var nodeId = srch.highlightRowNode.uid + srch._UID_ROWID_SUFFIX;
        var elm = util.domElm(nodeId);
        if (elm) {
            util.changeOrAddClass(elm, "active-row", "inactive-row");
        }
    };
})(srch || (srch = {}));
var share;
(function (share) {
    var findSharedNodesResponse = function (res) {
        srch.searchNodesResponse(res);
    };
    share.sharingNode = null;
    share.editNodeSharing = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        share.sharingNode = node;
        (new SharingDlg()).open();
    };
    share.findSharedNodes = function () {
        var focusNode = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }
        srch.searchPageTitle = "Shared Nodes";
        util.json("getSharedNodes", {
            "nodeId": focusNode.id
        }, findSharedNodesResponse);
    };
})(share || (share = {}));
var user;
(function (user) {
    var logoutResponse = function (res) {
        window.location.href = window.location.origin;
    };
    user.isTestUserAccount = function () {
        return meta64.userName.toLowerCase() === "adam" ||
            meta64.userName.toLowerCase() === "bob" ||
            meta64.userName.toLowerCase() === "cory" ||
            meta64.userName.toLowerCase() === "dan";
    };
    user.setTitleUsingLoginResponse = function (res) {
        var title = BRANDING_TITLE_SHORT;
        if (!meta64.isAnonUser) {
            title += ":" + res.userName;
        }
        $("#headerAppName").html(title);
    };
    user.setStateVarsUsingLoginResponse = function (res) {
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
    user.openSignupPg = function () {
        (new SignupDlg()).open();
    };
    user.writeCookie = function (name, val) {
        $.cookie(name, val, {
            expires: 365,
            path: '/'
        });
    };
    user.openLoginPg = function () {
        var loginDlg = new LoginDlg();
        loginDlg.populateFromCookies();
        loginDlg.open();
    };
    user.refreshLogin = function () {
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
                    refreshLoginResponse(res);
                }
            });
        }
    };
    user.logout = function (updateLoginStateCookie) {
        if (meta64.isAnonUser) {
            return;
        }
        $(window).off("beforeunload");
        if (updateLoginStateCookie) {
            user.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
        }
        util.json("logout", {}, logoutResponse);
    };
    user.login = function (loginDlg, usr, pwd) {
        util.json("login", {
            "userName": usr,
            "password": pwd,
            "tzOffset": new Date().getTimezoneOffset(),
            "dst": util.daylightSavingsTime
        }, function (res) {
            user.loginResponse(res, usr, pwd, null, loginDlg);
        });
    };
    user.deleteAllUserCookies = function () {
        $.removeCookie(cnst.COOKIE_LOGIN_USR);
        $.removeCookie(cnst.COOKIE_LOGIN_PWD);
        $.removeCookie(cnst.COOKIE_LOGIN_STATE);
    };
    user.loginResponse = function (res, usr, pwd, usingCookies, loginDlg) {
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
    var refreshLoginResponse = function (res) {
        console.log("refreshLoginResponse");
        if (res.success) {
            user.setStateVarsUsingLoginResponse(res);
            user.setTitleUsingLoginResponse(res);
        }
        meta64.loadAnonPageHome(false);
    };
})(user || (user = {}));
var view;
(function (view) {
    view.scrollToSelNodePending = false;
    view.updateStatusBar = function () {
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
    view.refreshTreeResponse = function (res, targetId, scrollToTop) {
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
    view.refreshTree = function (nodeId, renderParentIfLeaf, highlightId, isInitialRender) {
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
    view.firstPage = function () {
        console.log("Running firstPage Query");
        nav.mainOffset = 0;
        loadPage(false);
    };
    view.prevPage = function () {
        console.log("Running prevPage Query");
        nav.mainOffset -= nav.ROWS_PER_PAGE;
        if (nav.mainOffset < 0) {
            nav.mainOffset = 0;
        }
        loadPage(false);
    };
    view.nextPage = function () {
        console.log("Running nextPage Query");
        nav.mainOffset += nav.ROWS_PER_PAGE;
        loadPage(false);
    };
    view.lastPage = function () {
        console.log("Running lastPage Query");
        loadPage(true);
    };
    var loadPage = function (goToLastPage) {
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
    view.scrollToSelectedNode = function () {
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
    view.scrollToTop = function () {
        if (view.scrollToSelNodePending)
            return;
        $("#mainContainer").scrollTop(0);
        setTimeout(function () {
            if (view.scrollToSelNodePending)
                return;
            $("#mainContainer").scrollTop(0);
        }, 1000);
    };
    view.initEditPathDisplayById = function (domId) {
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
    view.showServerInfo = function () {
        util.json("getServerInfo", {}, function (res) {
            (new MessageDlg(res.serverInfo)).open();
        });
    };
})(view || (view = {}));
var menuPanel;
(function (menuPanel) {
    var makeTopLevelMenu = function (title, content, id) {
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
            makeSecondLevelList(content), true);
    };
    var makeSecondLevelList = function (content) {
        return render.tag("paper-menu", {
            "class": "menu-content sublist my-menu-section",
            "selectable": ""
        }, content, true);
    };
    var menuItem = function (name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick,
            "selectable": ""
        }, name, true);
    };
    var domId = "mainAppMenu";
    menuPanel.build = function () {
        var rssItems = menuItem("Feeds", "mainMenuRss", "nav.openRssFeedsNode();");
        var mainMenuRss = makeTopLevelMenu("RSS", rssItems);
        var editMenuItems = menuItem("Create", "createNodeButton", "edit.createNode();") +
            menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
            menuItem("Cut", "cutSelNodesButton", "edit.cutSelNodes();") +
            menuItem("Paste", "pasteSelNodesButton", "edit.pasteSelNodes();") +
            menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
            menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
            menuItem("Export", "openExportDlg", "(new ExportDlg()).open();") +
            menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();");
        var editMenu = makeTopLevelMenu("Edit", editMenuItems);
        var moveMenuItems = menuItem("Up", "moveNodeUpButton", "edit.moveNodeUp();") +
            menuItem("Down", "moveNodeDownButton", "edit.moveNodeDown();") +
            menuItem("to Top", "moveNodeToTopButton", "edit.moveNodeToTop();") +
            menuItem("to Bottom", "moveNodeToBottomButton", "edit.moveNodeToBottom();");
        var moveMenu = makeTopLevelMenu("Move", moveMenuItems);
        var attachmentMenuItems = menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
            menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
            menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
        var attachmentMenu = makeTopLevelMenu("Attach", attachmentMenuItems);
        var sharingMenuItems = menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
            menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
        var sharingMenu = makeTopLevelMenu("Share", sharingMenuItems);
        var searchMenuItems = menuItem("Content", "contentSearchDlgButton", "(new SearchContentDlg()).open();") +
            menuItem("Tags", "tagSearchDlgButton", "(new SearchTagsDlg()).open();") +
            menuItem("Files", "fileSearchDlgButton", "(new SearchFilesDlg(true)).open();");
        var searchMenu = makeTopLevelMenu("Search", searchMenuItems);
        var timelineMenuItems = menuItem("Created", "timelineCreatedButton", "srch.timelineByCreateTime();") +
            menuItem("Modified", "timelineModifiedButton", "srch.timelineByModTime();");
        var timelineMenu = makeTopLevelMenu("Timeline", timelineMenuItems);
        var viewOptionsMenuItems = menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
            menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
            menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
            menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();");
        var viewOptionsMenu = makeTopLevelMenu("View", viewOptionsMenuItems);
        var myAccountItems = menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
            menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();");
        var myAccountMenu = makeTopLevelMenu("Account", myAccountItems);
        var adminItems = menuItem("Generate RSS", "generateRSSButton", "podcast.generateRSS();") +
            menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();") +
            menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "edit.insertBookWarAndPeace();");
        var adminMenu = makeTopLevelMenu("Admin", adminItems, "adminMenu");
        var helpItems = menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
        var mainMenuHelp = makeTopLevelMenu("Help/Docs", helpItems);
        var content = mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
            + adminMenu + mainMenuHelp;
        util.setHtml(domId, content);
    };
    menuPanel.init = function () {
        meta64.refreshAllGuiEnablement();
    };
})(menuPanel || (menuPanel = {}));
var podcast;
(function (podcast) {
    podcast.player = null;
    podcast.startTimePending = null;
    var uid = null;
    var node = null;
    var adSegments = null;
    var pushTimer = null;
    podcast.generateRSS = function () {
        util.json("generateRSS", {}, generateRSSResponse);
    };
    var generateRSSResponse = function () {
        alert('rss complete.');
    };
    podcast.renderFeedNode = function (node, rowStyling) {
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
    podcast.getMediaPlayerUrlFromNode = function (node) {
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
    podcast.renderItemNode = function (node, rowStyling) {
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
    podcast.propOrderingFeedNode = function (node, properties) {
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
    podcast.propOrderingItemNode = function (node, properties) {
        var propOrder = [
            "meta64:rssItemTitle",
            "meta64:rssItemDesc",
            "meta64:rssItemLink",
            "meta64:rssItemUri",
            "meta64:rssItemAuthor"
        ];
        return props.orderProps(propOrder, properties);
    };
    podcast.openPlayerDialog = function (_uid) {
        uid = _uid;
        node = meta64.uidToNodeMap[uid];
        if (node) {
            var mp3Url_1 = podcast.getMediaPlayerUrlFromNode(node);
            if (mp3Url_1) {
                util.json("getPlayerInfo", {
                    "url": mp3Url_1
                }, function (res) {
                    parseAdSegmentUid(uid);
                    var dlg = new AudioPlayerDlg(mp3Url_1, uid, res.timeOffset);
                    dlg.open();
                });
            }
        }
    };
    var parseAdSegmentUid = function (_uid) {
        if (node) {
            var adSegs = props.getNodeProperty("ad-segments", node);
            if (adSegs) {
                parseAdSegmentText(adSegs.value);
            }
        }
        else
            throw "Unable to find node uid: " + uid;
    };
    var parseAdSegmentText = function (adSegs) {
        adSegments = [];
        var segList = adSegs.split("\n");
        for (var _i = 0, segList_1 = segList; _i < segList_1.length; _i++) {
            var seg = segList_1[_i];
            var segTimes = seg.split(",");
            if (segTimes.length != 2) {
                console.log("invalid time range: " + seg);
                continue;
            }
            var beginSecs = convertToSeconds(segTimes[0]);
            var endSecs = convertToSeconds(segTimes[1]);
            adSegments.push(new AdSegment(beginSecs, endSecs));
        }
    };
    var convertToSeconds = function (timeVal) {
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
    podcast.restoreStartTime = function () {
        if (podcast.player && podcast.startTimePending) {
            podcast.player.currentTime = podcast.startTimePending;
            podcast.startTimePending = null;
        }
    };
    podcast.onCanPlay = function (uid, elm) {
        podcast.player = elm;
        podcast.restoreStartTime();
        podcast.player.play();
    };
    podcast.onTimeUpdate = function (uid, elm) {
        if (!pushTimer) {
            pushTimer = setInterval(podcast.pushTimerFunction, 5 * 60 * 1000);
        }
        podcast.player = elm;
        podcast.restoreStartTime();
        if (!adSegments)
            return;
        for (var _i = 0, adSegments_1 = adSegments; _i < adSegments_1.length; _i++) {
            var seg = adSegments_1[_i];
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
    podcast.pushTimerFunction = function () {
        if (podcast.player && !podcast.player.paused) {
            if (!$(podcast.player).is(":visible")) {
                console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                podcast.player.pause();
            }
            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
        }
    };
    podcast.pause = function () {
        if (podcast.player) {
            podcast.player.pause();
            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
        }
    };
    podcast.destroyPlayer = function (dlg) {
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
    podcast.play = function () {
        if (podcast.player) {
            podcast.player.play();
        }
    };
    podcast.speed = function (rate) {
        if (podcast.player) {
            podcast.player.playbackRate = rate;
        }
    };
    podcast.skip = function (delta) {
        if (podcast.player) {
            podcast.player.currentTime += delta;
        }
    };
    podcast.savePlayerInfo = function (url, timeOffset) {
        if (meta64.isAnonUser)
            return;
        util.json("setPlayerInfo", {
            "url": url,
            "timeOffset": timeOffset
        }, setPlayerInfoResponse);
    };
    var setPlayerInfoResponse = function () {
    };
})(podcast || (podcast = {}));
var systemfolder;
(function (systemfolder) {
    systemfolder.renderNode = function (node, rowStyling) {
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
    systemfolder.renderFileListNode = function (node, rowStyling) {
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
    systemfolder.fileListPropOrdering = function (node, properties) {
        var propOrder = [
            "meta64:json"
        ];
        return props.orderProps(propOrder, properties);
    };
    systemfolder.reindex = function () {
        var selNode = meta64.getHighlightedNode();
        if (selNode) {
            util.json("fileSearch", {
                "nodeId": selNode.id,
                "reindex": true,
                "searchText": null
            }, systemfolder.reindexResponse, systemfolder);
        }
    };
    systemfolder.browse = function () {
    };
    systemfolder.refreshResponse = function (res) {
    };
    systemfolder.reindexResponse = function (res) {
        alert("Reindex complete.");
    };
    systemfolder.search = function () {
        (new SearchFilesDlg(true)).open();
    };
    systemfolder.propOrdering = function (node, properties) {
        var propOrder = [
            "meta64:path"
        ];
        return props.orderProps(propOrder, properties);
    };
})(systemfolder || (systemfolder = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21lZ2EtbWV0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQXlhQSxJQUFVLElBQUksQ0EwQmI7QUExQkQsV0FBVSxJQUFJO0lBRUMsU0FBSSxHQUFXLFdBQVcsQ0FBQztJQUMzQixxQkFBZ0IsR0FBVyxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBQ3JELHFCQUFnQixHQUFXLFlBQVksR0FBRyxVQUFVLENBQUM7SUFJckQsdUJBQWtCLEdBQVcsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUV6RCxzQkFBaUIsR0FBVyx1QkFBdUIsQ0FBQztJQUNwRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztJQUNoQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztJQUNoQywyQkFBc0IsR0FBWSxJQUFJLENBQUM7SUFNdkMsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUFHaEMsc0JBQWlCLEdBQVksSUFBSSxDQUFDO0lBQ2xDLHNCQUFpQixHQUFZLElBQUksQ0FBQztJQUVsQyxnQ0FBMkIsR0FBWSxLQUFLLENBQUM7QUFDNUQsQ0FBQyxFQTFCUyxJQUFJLEtBQUosSUFBSSxRQTBCYjtBQUtEO0lBQ0ksbUJBQW1CLFNBQWlCLEVBQ3pCLE9BQWU7UUFEUCxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3pCLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFDMUIsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDtJQUNJLG1CQUFtQixFQUFVLEVBQ2xCLFFBQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUFpQixFQUNqQixNQUFlLEVBQ2YsUUFBbUI7UUFMWCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLFVBQUssR0FBTCxLQUFLLENBQVM7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQzlCLENBQUM7SUFDTCxnQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7SUFDSSxpQkFBbUIsRUFBVSxFQUNsQixHQUFXO1FBREgsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNsQixRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQ3RCLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRCxJQUFVLElBQUksQ0E2ckJiO0FBN3JCRCxXQUFVLElBQUk7SUFFQyxZQUFPLEdBQVksS0FBSyxDQUFDO0lBQ3pCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztJQUNyQyxZQUFPLEdBQVksS0FBSyxDQUFDO0lBRXpCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFlBQU8sR0FBUSxJQUFJLENBQUM7SUFFcEIsaUJBQVksR0FBRyxVQUFTLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFBO0lBRVUsb0JBQWUsR0FBRyxVQUFTLENBQUM7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUE7SUFFVSxpQkFBWSxHQUFHLFVBQVMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFYixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDWixHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFekMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQTtJQUVVLGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztRQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQTtJQUVVLGFBQVEsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQTtJQUVVLGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUE7SUFFVSxzQkFBaUIsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQTtJQUVVLGVBQVUsR0FBRyxVQUFTLENBQVE7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDO0lBRVMsMkJBQXNCLEdBQUcsVUFBUyxDQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU87UUFDcEUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNuQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUM7SUFLUyxrQkFBYSxHQUFHLFVBQVMsQ0FBUSxFQUFFLFNBQVMsRUFBRSxPQUFPO1FBQzVELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQztJQUVTLHNCQUFpQixHQUFHLFVBQVMsQ0FBTztRQUMzQyxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUE7SUFFVSxRQUFHLEdBQUcsVUFBUyxDQUFPO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxLQUFBLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQTtJQUVVLGtCQUFhLEdBQUcsVUFBUyxDQUFRLEVBQUUsR0FBRztRQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUE7SUFPVSxrQkFBYSxHQUFHLFVBQVMsT0FBTztRQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUM3RCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBTUQsSUFBSSxZQUFZLEdBQVcsQ0FBQyxDQUFDO0lBRWxCLHdCQUFtQixHQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBRXJFLFdBQU0sR0FBRyxVQUFTLEdBQUc7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUE7SUFNVSx1QkFBa0IsR0FBRyxVQUFTLElBQVUsRUFBRSxHQUFTO1FBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQTtJQU9VLFlBQU8sR0FBRyxVQUFTLE1BQU0sRUFBRSxLQUFLO1FBQ3ZDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUNwQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUMsQ0FBQTtJQUVVLHdCQUFtQixHQUFHO1FBQzdCLFdBQVcsQ0FBQyxLQUFBLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQTtJQUVVLHFCQUFnQixHQUFHO1FBQzFCLElBQUksU0FBUyxHQUFHLEtBQUEsYUFBYSxFQUFFLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNaLEtBQUEsV0FBVyxFQUFFLENBQUM7WUFDZCxFQUFFLENBQUMsQ0FBQyxLQUFBLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWCxLQUFBLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO29CQUM1QixLQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixLQUFBLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsS0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEtBQUEsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNqQixLQUFBLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxTQUFJLEdBQUcsVUFBcUMsUUFBYSxFQUFFLFFBQXFCLEVBQ3ZGLFFBQXlELEVBQUUsWUFBa0IsRUFBRSxlQUFxQjtRQUVwRyxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixHQUFHLFFBQVEsR0FBRyw2RUFBNkUsQ0FBQyxDQUFDO1FBQzNJLENBQUM7UUFFRCxJQUFJLFFBQVEsQ0FBQztRQUNiLElBQUksV0FBVyxDQUFDO1FBRWhCLElBQUksQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakYsQ0FBQztZQU1ELFFBQVEsR0FBRyxLQUFBLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVuQyxRQUFRLENBQUMsR0FBRyxHQUFHLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFDeEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDeEIsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3pCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUM7WUFLMUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7WUFNM0IsUUFBUSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUdsQyxZQUFZLEVBQUUsQ0FBQztZQUNmLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0MsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLDJCQUEyQixHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBbUJELFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUd0QjtZQUNJLElBQUksQ0FBQztnQkFDRCxZQUFZLEVBQUUsQ0FBQztnQkFDZixLQUFBLGdCQUFnQixFQUFFLENBQUM7Z0JBRW5CLEVBQUUsQ0FBQyxDQUFDLEtBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLFFBQVEsR0FBRywwQkFBMEI7MEJBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFNaEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBZ0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDckYsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixRQUFRLENBQWUsV0FBVyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDbEUsQ0FBQztvQkFDTCxDQUFDO29CQUtELElBQUksQ0FBQyxDQUFDO3dCQUNGLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQWdCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDcEUsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixRQUFRLENBQWUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEtBQUEsYUFBYSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNoRSxDQUFDO1FBRUwsQ0FBQyxFQUVEO1lBQ0ksSUFBSSxDQUFDO2dCQUNELFlBQVksRUFBRSxDQUFDO2dCQUNmLEtBQUEsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUVsQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDL0MsS0FBQSxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUVmLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBQSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLEtBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO3dCQUMzQixDQUFDLElBQUksVUFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDckUsQ0FBQztvQkFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztvQkFDOUMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxHQUFHLEdBQVcsNEJBQTRCLENBQUM7Z0JBRy9DLElBQUksQ0FBQztvQkFDRCxHQUFHLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUNsRCxHQUFHLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNoRCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFhRCxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakMsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsS0FBQSxhQUFhLENBQUMseUNBQXlDLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQyxDQUFBO0lBRVUsZ0JBQVcsR0FBRyxVQUFTLE9BQWU7UUFDN0MsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLENBQUM7UUFDckMsSUFBSSxDQUFDO1lBQ0QsS0FBSyxHQUFTLElBQUksS0FBSyxFQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUE7SUFFVSxrQkFBYSxHQUFHLFVBQVMsT0FBZSxFQUFFLFNBQWM7UUFDL0QsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLENBQUM7UUFDckMsSUFBSSxDQUFDO1lBQ0QsS0FBSyxHQUFTLElBQUksS0FBSyxFQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLFNBQVMsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFFVSxjQUFTLEdBQUcsVUFBUyxXQUFXO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsV0FBVyxHQUFHLCtCQUErQixDQUFDLENBQUM7WUFDbkYsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUE7SUFFVSxrQkFBYSxHQUFHO1FBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQTtJQUdVLGlCQUFZLEdBQUcsVUFBUyxFQUFFO1FBRWpDLFVBQVUsQ0FBQztZQUNQLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHUixVQUFVLENBQUM7WUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFBO0lBU1UsaUJBQVksR0FBRyxVQUFTLGNBQWMsRUFBRSxHQUFHO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZixDQUFDLElBQUksVUFBVSxDQUFDLGNBQWMsR0FBRyxXQUFXLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEUsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQTtJQUdVLFdBQU0sR0FBRyxVQUFTLEdBQUcsRUFBRSxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQUc7UUFDakMsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsQ0FBQztJQUM3QyxDQUFDLENBQUE7SUFNVSxnQkFBVyxHQUFHLFVBQVMsR0FBOEIsRUFBRSxFQUFFO1FBRWhFLElBQUksR0FBRyxHQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUcxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUCxHQUFHLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QixHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsa0JBQWEsR0FBRyxVQUFTLEVBQUU7UUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFBO0lBR1UsdUJBQWtCLEdBQUcsVUFBUyxFQUFFO1FBQ3ZDLElBQUksRUFBRSxHQUFnQixLQUFBLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQW9CLEVBQUcsQ0FBQyxLQUFLLENBQUM7SUFDeEMsQ0FBQyxDQUFBO0lBS1UsV0FBTSxHQUFHLFVBQVMsRUFBRTtRQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFBO0lBRVUsU0FBSSxHQUFHLFVBQVMsRUFBRTtRQUN6QixNQUFNLENBQUMsS0FBQSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUMsQ0FBQTtJQUtVLFlBQU8sR0FBRyxVQUFTLEVBQVU7UUFFcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFBO0lBRVUsZ0JBQVcsR0FBRyxVQUFTLEVBQVU7UUFDeEMsSUFBSSxDQUFDLEdBQUcsS0FBQSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQyxDQUFBO0lBS1UsdUJBQWtCLEdBQUcsVUFBUyxFQUFVO1FBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQTtJQUVVLGFBQVEsR0FBRyxVQUFTLEdBQVE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUE7SUFFVSxzQkFBaUIsR0FBRztRQUMzQixNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QyxDQUFDLENBQUE7SUFFVSxnQkFBVyxHQUFHLFVBQVMsR0FBVztRQUN6QyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFBO0lBRVUsZ0JBQVcsR0FBRyxVQUFTLEVBQVU7UUFDeEMsTUFBTSxDQUFDLEtBQUEsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQyxDQUFBO0lBR1UsZ0JBQVcsR0FBRyxVQUFTLEVBQVUsRUFBRSxHQUFXO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFDRCxJQUFJLEdBQUcsR0FBRyxLQUFBLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztJQUN2QixDQUFDLENBQUE7SUFFVSxpQkFBWSxHQUFHLFVBQVMsRUFBVSxFQUFFLElBQVM7UUFDcEQsS0FBQSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUE7SUFFVSxZQUFPLEdBQUcsVUFBUyxFQUFVLEVBQUUsSUFBUyxFQUFFLE9BQVk7UUFDN0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFTLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLEVBQUUsQ0FBQztnQkFDUCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQyxDQUFBO0lBT1UscUJBQWdCLEdBQUcsVUFBUyxHQUFXLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUNsRixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBS1UsZUFBVSxHQUFHLFVBQVMsR0FBUSxFQUFFLElBQVMsRUFBRSxHQUFXO1FBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBRVUsWUFBTyxHQUFHLFVBQVMsRUFBVSxFQUFFLE9BQWU7UUFDckQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBQSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUsvQixPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUU1QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUE7SUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQVc7UUFDOUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLENBQUM7UUFFVCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLEVBQUUsQ0FBQztZQUNaLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUE7SUFLVSxnQkFBVyxHQUFHLFVBQVMsR0FBVztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFFRCxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDO1lBQ0QsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLEtBQUssRUFBRSxDQUFDO2dCQUNaLENBQUM7WUFDTCxDQUFDO1lBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBUyxDQUFDLEVBQUUsQ0FBQztnQkFDckIsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQTtJQUdVLGNBQVMsR0FBRyxVQUFTLEdBQVc7UUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRWxCLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ2YsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsR0FBRyxJQUFJLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFDRCxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBT1Usa0JBQWEsR0FBRyxVQUFTLEtBQWEsRUFBRSxNQUFlO1FBRTlELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztRQUNmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsR0FBRyxHQUFHLEtBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDaEIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRVYsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDeEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBRUosR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQU9VLGtCQUFhLEdBQUcsVUFBUyxLQUFhLEVBQUUsR0FBWTtRQUUzRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEdBQUcsR0FBRyxLQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFHTixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBR0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFNVSxnQkFBVyxHQUFHLFVBQWEsT0FBZSxFQUFFLElBQVk7UUFBRSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDZCQUFjOztRQUMvRSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFJLFFBQVEsQ0FBQztJQUN2QixDQUFDLENBQUE7QUFDTCxDQUFDLEVBN3JCUyxJQUFJLEtBQUosSUFBSSxRQTZyQmI7QUFFRCxJQUFVLE9BQU8sQ0FtQ2hCO0FBbkNELFdBQVUsT0FBTztJQUVGLGtCQUFVLEdBQVcsV0FBVyxDQUFDO0lBQ2pDLHFCQUFhLEdBQVcsY0FBYyxDQUFDO0lBQ3ZDLG9CQUFZLEdBQVcsaUJBQWlCLENBQUM7SUFDekMsY0FBTSxHQUFXLFlBQVksQ0FBQztJQUU5QixtQkFBVyxHQUFXLGdCQUFnQixDQUFDO0lBRXZDLHFCQUFhLEdBQVcsYUFBYSxDQUFDO0lBQ3RDLG1CQUFXLEdBQVcsT0FBTyxDQUFDO0lBQzlCLHFCQUFhLEdBQVcsU0FBUyxDQUFDO0lBRWxDLGVBQU8sR0FBVyxhQUFhLENBQUM7SUFDaEMsa0JBQVUsR0FBVyxlQUFlLENBQUM7SUFDckMsZUFBTyxHQUFXLGFBQWEsQ0FBQztJQUNoQyxZQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ3RCLFlBQUksR0FBVyxVQUFVLENBQUM7SUFDMUIscUJBQWEsR0FBVyxrQkFBa0IsQ0FBQztJQUMzQyx3QkFBZ0IsR0FBVyxvQkFBb0IsQ0FBQztJQUNoRCwrQkFBdUIsR0FBVyxhQUFhLENBQUM7SUFFaEQsc0JBQWMsR0FBVyxlQUFlLENBQUM7SUFFekMsWUFBSSxHQUFXLE1BQU0sQ0FBQztJQUN0QixXQUFHLEdBQVcsS0FBSyxDQUFDO0lBQ3BCLGFBQUssR0FBVyxPQUFPLENBQUM7SUFDeEIsWUFBSSxHQUFXLE1BQU0sQ0FBQztJQUV0QixlQUFPLEdBQVcsUUFBUSxDQUFDO0lBQzNCLGdCQUFRLEdBQVcsU0FBUyxDQUFDO0lBQzdCLGdCQUFRLEdBQVcsY0FBYyxDQUFDO0lBRWxDLGlCQUFTLEdBQVcsVUFBVSxDQUFDO0lBQy9CLGtCQUFVLEdBQVcsV0FBVyxDQUFDO0FBQ2hELENBQUMsRUFuQ1MsT0FBTyxLQUFQLE9BQU8sUUFtQ2hCO0FBRUQsSUFBVSxVQUFVLENBdURuQjtBQXZERCxXQUFVLFVBQVU7SUFFTCxxQkFBVSxHQUFRLElBQUksQ0FBQztJQUV2QixnQ0FBcUIsR0FBRztRQUMvQixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsV0FBQSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxXQUFBLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsQ0FBQyxJQUFJLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQU83QyxDQUFDLENBQUE7SUFFVSwrQkFBb0IsR0FBRztRQUM5QixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsV0FBQSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLENBQUMsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxXQUFBLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsQ0FBQyxJQUFJLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDLENBQUE7SUFFVSwyQkFBZ0IsR0FBRztRQUMxQixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsSUFBSSxVQUFVLENBQUMsMkJBQTJCLEVBQUUsb0NBQW9DLEVBQUUsY0FBYyxFQUM3RjtnQkFDSSxJQUFJLENBQUMsSUFBSSxDQUE4RCxrQkFBa0IsRUFBRTtvQkFDdkYsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2lCQUNwQixFQUFFLFdBQUEsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxtQ0FBd0IsR0FBRyxVQUFTLEdBQWtDLEVBQUUsR0FBUTtRQUN2RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxFQXZEUyxVQUFVLEtBQVYsVUFBVSxRQXVEbkI7QUFFRCxJQUFVLElBQUksQ0EwZmI7QUExZkQsV0FBVSxJQUFJO0lBRUMsZUFBVSxHQUFHO1FBQ3BCLENBQUMsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQTtJQUVELElBQUksa0JBQWtCLEdBQUcsVUFBUyxHQUE0QjtRQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDLENBQUE7SUFFRCxJQUFJLG1CQUFtQixHQUFHLFVBQVMsR0FBNkIsRUFBRSxPQUFlO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixJQUFJLFdBQVcsR0FBVyxJQUFJLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixXQUFXLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVELElBQUksb0JBQW9CLEdBQUcsVUFBUyxHQUE4QjtRQUM5RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQWtCLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDdkMsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztnQkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBR3RDLElBQUksY0FBYyxHQUFZLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3RCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7dUJBQzlFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFLakIsS0FBQSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDeEIsS0FBQSxlQUFlLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztnQkFDcEMsS0FBQSxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsSUFBSSxVQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pFLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRUQsSUFBSSxpQkFBaUIsR0FBRyxVQUFTLEdBQTJCO1FBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxLQUFBLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDbkIsS0FBQSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFRCxJQUFJLHVCQUF1QixHQUFHLFVBQVMsR0FBaUM7UUFDcEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSwyQkFBc0IsR0FBWSxJQUFJLENBQUM7SUFJdkMsZ0JBQVcsR0FBUSxJQUFJLENBQUM7SUFLeEIsbUJBQWMsR0FBVyxFQUFFLENBQUM7SUFFNUIsb0JBQWUsR0FBa0IsSUFBSSxDQUFDO0lBS3RDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztJQUtwQyxnQ0FBMkIsR0FBWSxLQUFLLENBQUM7SUFRN0MsYUFBUSxHQUFrQixJQUFJLENBQUM7SUFHL0Isb0JBQWUsR0FBZ0IsSUFBSSxDQUFDO0lBVXBDLHFCQUFnQixHQUFRLElBQUksQ0FBQztJQUc3QixrQkFBYSxHQUFHLFVBQVMsSUFBUztRQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHO1lBSXRELENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ25FLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUE7SUFHVSxvQkFBZSxHQUFHLFVBQVMsSUFBUztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQzFFLENBQUMsQ0FBQTtJQUVVLHdCQUFtQixHQUFHLFVBQVMsUUFBaUIsRUFBRSxXQUFxQjtRQUM5RSxLQUFBLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMzQixLQUFBLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsS0FBQSxlQUFlLEdBQUcsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELEtBQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUE7SUFjVSxnQ0FBMkIsR0FBRztRQUNyQyxLQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUMxQixLQUFBLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsS0FBQSxlQUFlLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNwQyxLQUFBLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUE7SUFFVSx1QkFBa0IsR0FBRyxVQUFTLEdBQTRCO1FBQ2pFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLEtBQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLDBCQUFxQixHQUFHLFVBQVMsR0FBK0I7UUFDdkUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLEtBQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLHFCQUFnQixHQUFHLFVBQVMsR0FBMEIsRUFBRSxPQUFZO1FBQzNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQU10QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLGFBQVEsR0FBRyxVQUFTLE9BQWlCO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQzlDLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDckYsQ0FBQztRQUdELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBTTVCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQTtJQUVVLGVBQVUsR0FBRyxVQUFTLEdBQVk7UUFFekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxPQUFPLEdBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7Z0JBQ3BGLGNBQWMsRUFBRSxNQUFNLENBQUMsYUFBYTtnQkFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixXQUFXLEVBQUUsYUFBYTthQUM3QixFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsaUJBQVksR0FBRyxVQUFTLEdBQVk7UUFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxPQUFPLEdBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7Z0JBQ3BGLGNBQWMsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QyxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ3pCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxrQkFBYSxHQUFHLFVBQVMsR0FBWTtRQUU1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLE9BQU8sR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDekQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdEIsQ0FBQztRQUVELElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsSUFBSSxDQUE0RCxpQkFBaUIsRUFBRTtnQkFDcEYsY0FBYyxFQUFFLE1BQU0sQ0FBQyxhQUFhO2dCQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxXQUFXO2FBQzNCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQVk7UUFFL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxPQUFPLEdBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7Z0JBQ3BGLGNBQWMsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxJQUFJO2FBQ3BCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDTCxDQUFDLENBQUE7SUFLVSxpQkFBWSxHQUFHLFVBQVMsSUFBSTtRQUNuQyxJQUFJLE9BQU8sR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUE7SUFLVSxpQkFBWSxHQUFHLFVBQVMsSUFBUztRQUN4QyxJQUFJLE9BQU8sR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUE7SUFFVSxzQkFBaUIsR0FBRztRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDN0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQTtJQUVVLGdCQUFXLEdBQUcsVUFBUyxHQUFRO1FBQ3RDLElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLEtBQUEsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNoQixDQUFDLElBQUksVUFBVSxDQUFDLG1DQUFtQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkUsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELEtBQUEsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBRTNCLElBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRTtZQUMzRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7U0FDcEIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQTtJQUVVLGVBQVUsR0FBRyxVQUFTLEdBQVMsRUFBRSxRQUFpQjtRQUV6RCxLQUFBLGVBQWUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBQSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUM7UUFDWCxDQUFDO1FBTUQsSUFBSSxJQUFJLEdBQWtCLElBQUksQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxLQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUN4QixLQUFBLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxrQkFBYSxHQUFHLFVBQVMsR0FBUyxFQUFFLFFBQWlCLEVBQUUsV0FBcUI7UUFNbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxhQUFhLEdBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLEtBQUEsZUFBZSxHQUFHLGFBQWEsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsS0FBQSxlQUFlLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osS0FBQSxlQUFlLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUEsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFLRCxLQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUN4QixLQUFBLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUE7SUFFVSxtQkFBYyxHQUFHLFVBQVMsR0FBUTtRQUN6QyxLQUFBLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUE7SUFFVSxvQkFBZSxHQUFHO1FBQ3pCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBTzVCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFBO0lBTVUsbUJBQWMsR0FBRztRQUN4QixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUYsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELENBQUMsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsWUFBWSxFQUFFLGNBQWMsRUFDN0Y7WUFDSSxJQUFJLGlCQUFpQixHQUFrQixLQUFBLHdCQUF3QixFQUFFLENBQUM7WUFFbEUsSUFBSSxDQUFDLElBQUksQ0FBb0QsYUFBYSxFQUFFO2dCQUN4RSxTQUFTLEVBQUUsYUFBYTthQUMzQixFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQTtJQUdVLDZCQUF3QixHQUFHO1FBRWxDLElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQzFELElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7UUFDbkMsSUFBSSxZQUFZLEdBQVksS0FBSyxDQUFDO1FBSWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUQsSUFBSSxJQUFJLEdBQWtCLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBR0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDeEIsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUMsQ0FBQTtJQUVVLGdCQUFXLEdBQUc7UUFFckIsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLENBQUMsSUFBSSxVQUFVLENBQUMsc0RBQXNELENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hGLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxDQUFDLElBQUksVUFBVSxDQUNYLGFBQWEsRUFDYixNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRywyQ0FBMkMsRUFDM0UsS0FBSyxFQUNMO1lBQ0ksS0FBQSxXQUFXLEdBQUcsYUFBYSxDQUFDO1lBQzVCLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBRzFCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFBO0lBRUQsSUFBSSxrQkFBa0IsR0FBRyxVQUFTLE9BQWlCO1FBQy9DLEtBQUEsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUNwQixHQUFHLENBQUMsQ0FBVyxVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBakIsSUFBSSxFQUFFLGdCQUFBO1lBQ1AsS0FBQSxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsa0JBQWEsR0FBRztRQUN2QixDQUFDLElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRSxRQUFRLEdBQUcsS0FBQSxXQUFXLENBQUMsTUFBTSxHQUFHLHVDQUF1QyxFQUNwRyxhQUFhLEVBQUU7WUFFWCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQU9oRCxJQUFJLENBQUMsSUFBSSxDQUFnRCxXQUFXLEVBQUU7Z0JBQ2xFLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFBRTtnQkFDaEMsZUFBZSxFQUFFLGFBQWEsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLEVBQUUsR0FBRyxJQUFJO2dCQUNoRSxTQUFTLEVBQUUsS0FBQSxXQUFXO2FBQ3pCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQTtJQUVVLDBCQUFxQixHQUFHO1FBQy9CLENBQUMsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLDJIQUEySCxFQUFFLG1CQUFtQixFQUFFO1lBR3pLLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO29CQUNyRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2pCLFVBQVUsRUFBRSxlQUFlO29CQUMzQixXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2lCQUN4QyxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDM0IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZixDQUFDLENBQUE7QUFDTCxDQUFDLEVBMWZTLElBQUksS0FBSixJQUFJLFFBMGZiO0FBRUQsSUFBVSxNQUFNLENBdTVCZjtBQXY1QkQsV0FBVSxNQUFNO0lBRUQscUJBQWMsR0FBWSxLQUFLLENBQUM7SUFFaEMsaUJBQVUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUl2RSxzQkFBZSxHQUFZLEtBQUssQ0FBQztJQUdqQyxlQUFRLEdBQVcsQ0FBQyxDQUFDO0lBR3JCLGVBQVEsR0FBVyxXQUFXLENBQUM7SUFHL0Isa0JBQVcsR0FBVyxDQUFDLENBQUM7SUFDeEIsbUJBQVksR0FBVyxDQUFDLENBQUM7SUFLekIsaUJBQVUsR0FBVyxFQUFFLENBQUM7SUFDeEIsbUJBQVksR0FBVyxFQUFFLENBQUM7SUFLMUIsa0JBQVcsR0FBWSxLQUFLLENBQUM7SUFHN0IsaUJBQVUsR0FBWSxJQUFJLENBQUM7SUFDM0IsOEJBQXVCLEdBQVEsSUFBSSxDQUFDO0lBQ3BDLDRCQUFxQixHQUFZLEtBQUssQ0FBQztJQU12QyxnQkFBUyxHQUFZLEtBQUssQ0FBQztJQVMzQixtQkFBWSxHQUFxQyxFQUFFLENBQUM7SUFLcEQsa0JBQVcsR0FBcUMsRUFBRSxDQUFDO0lBR25ELHFCQUFjLEdBQVEsRUFBRSxDQUFDO0lBR3pCLGNBQU8sR0FBVyxDQUFDLENBQUM7SUFNcEIsb0JBQWEsR0FBOEIsRUFBRSxDQUFDO0lBUzlDLDhCQUF1QixHQUFxQyxFQUFFLENBQUM7SUFHL0Qsb0JBQWEsR0FBVyxVQUFVLENBQUM7SUFDbkMsa0JBQVcsR0FBVyxRQUFRLENBQUM7SUFHL0IscUJBQWMsR0FBVyxRQUFRLENBQUM7SUFLbEMscUJBQWMsR0FBWSxLQUFLLENBQUM7SUFHaEMsbUJBQVksR0FBWSxLQUFLLENBQUM7SUFLOUIsb0NBQTZCLEdBQVE7UUFDNUMsTUFBTSxFQUFFLElBQUk7S0FDZixDQUFDO0lBRVMsa0NBQTJCLEdBQVEsRUFBRSxDQUFDO0lBRXRDLDJCQUFvQixHQUFRLEVBQUUsQ0FBQztJQUUvQix5QkFBa0IsR0FBUSxFQUFFLENBQUM7SUFLN0Isb0JBQWEsR0FBUSxFQUFFLENBQUM7SUFHeEIsNEJBQXFCLEdBQVEsRUFBRSxDQUFDO0lBR2hDLHNCQUFlLEdBQVEsSUFBSSxDQUFDO0lBSzVCLGtCQUFXLEdBQWtCLElBQUksQ0FBQztJQUNsQyxxQkFBYyxHQUFRLElBQUksQ0FBQztJQUMzQixvQkFBYSxHQUFRLElBQUksQ0FBQztJQUMxQixzQkFBZSxHQUFRLElBQUksQ0FBQztJQUc1QixpQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUVyQiwrQkFBd0IsR0FBZ0MsRUFBRSxDQUFDO0lBQzNELHFDQUE4QixHQUFnQyxFQUFFLENBQUM7SUFFakUsc0JBQWUsR0FBeUI7UUFDL0MsVUFBVSxFQUFFLEtBQUs7UUFDakIsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLEVBQUU7UUFDZCxlQUFlLEVBQUUsS0FBSztRQUN0QixlQUFlLEVBQUUsS0FBSztRQUN0QixjQUFjLEVBQUUsS0FBSztLQUN4QixDQUFDO0lBRVMsMEJBQW1CLEdBQUc7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3hDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsQ0FBQyxDQUFBO0lBTVUseUJBQWtCLEdBQUcsVUFBUyxJQUFJO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsT0FBQSxRQUFRLENBQUM7WUFDdkIsT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNqQyxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsc0JBQWUsR0FBRyxVQUFTLElBQUk7UUFDdEMsSUFBSSxHQUFHLEdBQUcsT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQTtJQWtCVSxvQkFBYSxHQUFHLFVBQVMsUUFBYSxFQUFFLEdBQVMsRUFBRSxPQUFhLEVBQUUsYUFBc0I7UUFDL0YsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyQyxPQUFBLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sT0FBQSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFBLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztnQkFHakQsTUFBTSxDQUFDLHdCQUFzQixRQUFRLENBQUMsSUFBSSxTQUFJLEdBQUcsQ0FBQyxJQUFJLFNBQUksVUFBVSxTQUFJLGFBQWEsT0FBSSxDQUFDO1lBQzlGLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsd0JBQXNCLFFBQVEsQ0FBQyxJQUFJLG1CQUFjLGFBQWEsT0FBSSxDQUFDO1lBQzlFLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixNQUFNLDJDQUEyQyxDQUFDO1FBQ3RELENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxrQkFBVyxHQUFHLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsYUFBc0I7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixVQUFVLENBQUM7Z0JBQ1AsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixNQUFNLENBQUMsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSwyQkFBb0IsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTztRQUN6RCxJQUFJLE9BQU8sR0FBRyxPQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUlwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUdELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxJQUFJLEdBQUcsT0FBQSxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFBLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLDhDQUE4QyxHQUFHLElBQUksQ0FBQztRQUNoRSxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsbUJBQVksR0FBRztRQUN0QixNQUFNLENBQUMsT0FBQSxjQUFjLEtBQUssT0FBQSxXQUFXLENBQUM7SUFDMUMsQ0FBQyxDQUFBO0lBRVUsY0FBTyxHQUFHO1FBQ2pCLE9BQUEsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUE7SUFFVSxtQkFBWSxHQUFHLFVBQVMsUUFBa0IsRUFBRSxrQkFBNEI7UUFFL0UsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE9BQUEsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQUEsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFBLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUM1QixPQUFBLHVCQUF1QixFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFLRCxJQUFJLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxnQkFBUyxHQUFHLFVBQVMsUUFBUTtRQUNwQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDNUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQWdCN0MsQ0FBQyxDQUFBO0lBVVUsaUJBQVUsR0FBRyxVQUFTLEVBQVEsRUFBRSxJQUFVO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztZQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFHRCxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDNUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFBO0lBRVUsd0JBQWlCLEdBQUcsVUFBUyxJQUFJO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBQSxZQUFZLEVBQUUsQ0FBQztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWpCLElBQUksSUFBSSxDQUFDO1FBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQUEsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLE9BQUEsNkJBQTZCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUMsQ0FBQTtJQUVVLCtCQUF3QixHQUFHO1FBQ2xDLElBQUksUUFBUSxHQUFhLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFFakMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFLVSw4QkFBdUIsR0FBRztRQUNqQyxJQUFJLFFBQVEsR0FBYSxFQUFFLEVBQUUsR0FBRyxDQUFDO1FBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBQSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBQSxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxJQUFJLEdBQWtCLE9BQUEsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDOUQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDM0IsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFHVSxnQ0FBeUIsR0FBRztRQUNuQyxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7UUFDckIsSUFBSSxRQUFRLEdBQW9CLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBR1UsNEJBQXFCLEdBQUc7UUFDL0IsSUFBSSxRQUFRLEdBQW9CLEVBQUUsQ0FBQztRQUNuQyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7UUFDcEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBQSxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsT0FBQSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUMsQ0FBQTtJQUVVLHlCQUFrQixHQUFHO1FBQzVCLE9BQUEsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDLENBQUE7SUFFVSw2QkFBc0IsR0FBRyxVQUFTLEdBQUcsRUFBRSxJQUFJO1FBQ2xELElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQztRQUMxQixJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7UUFFMUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBUyxLQUFLLEVBQUUsS0FBSztnQkFDcEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixRQUFRLElBQUksR0FBRyxDQUFDO2dCQUNwQixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFFRCxRQUFRLElBQUksS0FBSyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUN0QixJQUFJLEtBQUssR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUN2QyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN0RSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUN0RSxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLHFCQUFjLEdBQUcsVUFBUyxJQUFtQjtRQUNwRCxJQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtZQUMxRixRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDakIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsZUFBZSxFQUFFLElBQUk7U0FDeEIsRUFBRSxVQUFTLEdBQW1DO1lBQzNDLE9BQUEsc0JBQXNCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBR1Usb0JBQWEsR0FBRyxVQUFTLEVBQVU7UUFDMUMsTUFBTSxDQUFDLE9BQUEsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQTtJQUVVLG1CQUFZLEdBQUcsVUFBUyxHQUFXO1FBQzFDLElBQUksSUFBSSxHQUFrQixPQUFBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixNQUFNLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUseUJBQWtCLEdBQUc7UUFDNUIsSUFBSSxHQUFHLEdBQWtCLE9BQUEsdUJBQXVCLENBQUMsT0FBQSxjQUFjLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsdUJBQWdCLEdBQUcsVUFBUyxFQUFFLEVBQUUsTUFBTTtRQUM3QyxJQUFJLElBQUksR0FBa0IsT0FBQSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLE9BQUEsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDTCxDQUFDLENBQUE7SUFNVSxvQkFBYSxHQUFHLFVBQVMsSUFBbUIsRUFBRSxNQUFlO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ04sTUFBTSxDQUFDO1FBRVgsSUFBSSxnQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFHdEMsSUFBSSxrQkFBa0IsR0FBa0IsT0FBQSx1QkFBdUIsQ0FBQyxPQUFBLGNBQWMsQ0FBQyxDQUFDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXRDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztnQkFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxRQUFRLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3hFLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDcEIsT0FBQSx1QkFBdUIsQ0FBQyxPQUFBLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUUvQyxJQUFJLFFBQVEsR0FBVyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztZQUN6QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUN2RSxDQUFDO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxRQUFRLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDaEMsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQU1VLDhCQUF1QixHQUFHO1FBRWpDLElBQUksY0FBYyxHQUFZLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksY0FBYyxHQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBQSxhQUFhLENBQUMsQ0FBQztRQUNoRSxJQUFJLGFBQWEsR0FBa0IsT0FBQSxrQkFBa0IsRUFBRSxDQUFDO1FBQ3hELElBQUksYUFBYSxHQUFZLGFBQWEsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxLQUFLLE9BQUEsUUFBUSxJQUFJLE9BQU8sS0FBSyxPQUFBLFFBQVEsQ0FBQyxDQUFDO1FBRXJILElBQUksZ0JBQWdCLEdBQVksYUFBYSxJQUFJLElBQUksSUFBSSxPQUFBLFVBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQ3hGLElBQUksb0JBQW9CLEdBQUcsT0FBQSxXQUFXLElBQUksT0FBQSxlQUFlLENBQUMsYUFBYSxDQUFDO1FBQ3hFLElBQUksb0JBQW9CLEdBQUcsT0FBQSxXQUFXLElBQUksT0FBQSxlQUFlLENBQUMsYUFBYSxDQUFDO1FBQ3hFLElBQUksZ0JBQWdCLEdBQVcsT0FBQSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvRCxJQUFJLGFBQWEsR0FBVyxPQUFBLGdCQUFnQixFQUFFLENBQUM7UUFDL0MsSUFBSSxTQUFTLEdBQVksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztRQUN2RixJQUFJLFdBQVcsR0FBWSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztRQUd6RyxJQUFJLGFBQWEsR0FBRyxPQUFBLGVBQWUsQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFBLFdBQVcsSUFBSSxDQUFDLENBQUMsT0FBQSxVQUFVLENBQXdCLENBQUMsQ0FBQztRQUV0RyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLE9BQUEsVUFBVSxHQUFHLGdCQUFnQixHQUFHLFlBQVksR0FBRyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsQ0FBQztRQUUxSCxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLE9BQUEsVUFBVSxDQUFDLENBQUM7UUFFckQsSUFBSSxXQUFXLEdBQVksT0FBQSxXQUFXLElBQUksQ0FBQyxPQUFBLFVBQVUsQ0FBQztRQUN0RCxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXJELElBQUksYUFBYSxHQUFZLE9BQUEsV0FBVyxJQUFJLENBQUMsT0FBQSxVQUFVLENBQUM7UUFFeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxPQUFBLFdBQVcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUUxSCxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsT0FBQSxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsT0FBQSxXQUFXLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztRQUNsRyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztRQUNqRyxJQUFJLENBQUMsYUFBYSxDQUFDLHlCQUF5QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUk7ZUFDM0UsYUFBYSxDQUFDLFNBQVMsSUFBSSxhQUFhLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztRQUNoRyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLE9BQUEscUJBQXFCLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsT0FBQSxXQUFXLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxJQUFJLE9BQUEsVUFBVSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxJQUFJLE9BQUEsVUFBVSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsT0FBQSxXQUFXLENBQUMsQ0FBQztRQUk3QyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxPQUFBLFdBQVcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsT0FBQSxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsT0FBQSxXQUFXLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLE9BQUEsVUFBVSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxPQUFBLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsYUFBYSxDQUFDLDhCQUE4QixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksT0FBQSxxQkFBcUIsQ0FBQyxDQUFDO1FBR2hGLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLE9BQUEsV0FBVyxDQUFDLENBQUM7UUFFN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUFBO0lBRVUsNEJBQXFCLEdBQUc7UUFDL0IsSUFBSSxHQUFXLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVwQyxNQUFNLENBQUMsT0FBQSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQTtJQUVVLHVCQUFnQixHQUFHLFVBQVMsSUFBbUI7UUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFBLGVBQWUsSUFBSSxDQUFDLE9BQUEsZUFBZSxDQUFDLFFBQVEsQ0FBQztZQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQUEsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQUEsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUE7SUFFVSx1QkFBZ0IsR0FBRztRQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQUEsZUFBZSxJQUFJLENBQUMsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFYixNQUFNLENBQUMsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxDQUFDLENBQUE7SUFFVSx5QkFBa0IsR0FBRyxVQUFTLElBQUk7UUFDekMsT0FBQSxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQUEsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDeEIsT0FBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDL0IsT0FBQSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsT0FBQSxlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckMsQ0FBQyxDQUFBO0lBRVUsMkJBQW9CLEdBQUcsVUFBUyxHQUE4QjtRQUVyRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBRXpCLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFNUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRWxELE9BQUEsdUJBQXVCLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsd0JBQWlCLEdBQUcsVUFBUyxHQUFHO1FBQ3ZDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZELElBQUksSUFBSSxHQUFrQixPQUFBLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDLENBQUE7SUFNVSxlQUFRLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW9CO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBS0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFBLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBQSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFPM0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFcEYsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNiLE9BQUEsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDOUIsT0FBQSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsb0JBQWEsR0FBRztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQUEsMkJBQTJCLEVBQUU7WUFDckMsT0FBTyxDQUFDLFdBQVc7WUFDbkIsT0FBTyxDQUFDLFlBQVk7WUFDcEIsT0FBTyxDQUFDLE1BQU07WUFDZCxPQUFPLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsVUFBVTtZQUNsQixPQUFPLENBQUMsT0FBTztZQUNmLE9BQU8sQ0FBQyxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxVQUFVO1lBQ2xCLE9BQU8sQ0FBQyxhQUFhO1NBQUMsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBQSxvQkFBb0IsRUFBRTtZQUM5QixPQUFPLENBQUMsWUFBWTtZQUNwQixPQUFPLENBQUMsSUFBSTtZQUNaLE9BQU8sQ0FBQyxXQUFXO1lBQ25CLE9BQU8sQ0FBQyxPQUFPO1lBQ2YsT0FBTyxDQUFDLFVBQVU7WUFDbEIsT0FBTyxDQUFDLGFBQWE7WUFDckIsT0FBTyxDQUFDLGdCQUFnQjtZQUN4QixPQUFPLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsVUFBVTtZQUNsQixPQUFPLENBQUMsT0FBTztZQUNmLE9BQU8sQ0FBQyxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxVQUFVO1lBQ2xCLE9BQU8sQ0FBQyxhQUFhO1NBQUMsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBQSxrQkFBa0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQTtJQUdVLGNBQU8sR0FBRztRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFaEMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUMzRSxNQUFNLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQzNFLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUN2RixNQUFNLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUM7UUFFdkYsTUFBTSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUNqRixNQUFNLENBQUMsOEJBQThCLENBQUMscUJBQXFCLENBQUMsR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDO1FBRXpGLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQztRQUNyRixNQUFNLENBQUMsOEJBQThCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxZQUFZLENBQUMsb0JBQW9CLENBQUM7UUFPdkYsTUFBTyxDQUFDLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtZQUNwRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQXNCSSxNQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFVBQVMsQ0FBQztZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFPdkMsRUFBRSxDQUFDLENBQUMsT0FBQSxjQUFjLENBQUM7WUFDZixNQUFNLENBQUM7UUFFWCxPQUFBLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFFdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFO1lBQ2pDLE9BQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQUEsYUFBYSxFQUFFLENBQUM7UUFDaEIsT0FBQSxvQkFBb0IsRUFBRSxDQUFDO1FBT3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQVVILE9BQUEsV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyxPQUFBLFlBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFNbEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBcUJwQixPQUFBLG1CQUFtQixFQUFFLENBQUM7UUFDdEIsT0FBQSx1QkFBdUIsRUFBRSxDQUFDO1FBRTFCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTNCLE9BQUEsZ0JBQWdCLEVBQUUsQ0FBQztJQUN2QixDQUFDLENBQUE7SUFFVSx1QkFBZ0IsR0FBRztRQUMxQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLFVBQVUsQ0FBQztnQkFDUCxDQUFDLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3QyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDO1FBRUQsT0FBQSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQTtJQUVVLHFCQUFjLEdBQUcsVUFBUyxPQUFPO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSwyQkFBb0IsR0FBRztRQUM5QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLElBQUksVUFBVSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuRSxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsdUJBQWdCLEdBQUc7UUFDMUIsRUFBRSxDQUFDLENBQUMsT0FBQSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBRWxCLEVBQUUsQ0FBQyxDQUFDLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBQSxXQUFXLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFBLGVBQWUsQ0FBQyxRQUFRLEVBQUUsVUFBUyxDQUFDLEVBQUUsSUFBSTtnQkFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2IsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUdVLHlCQUFrQixHQUFHLFVBQVMsS0FBSztJQU05QyxDQUFDLENBQUE7SUFFVSx1QkFBZ0IsR0FBRyxVQUFTLFNBQVM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO1lBQzNFLFdBQVcsRUFBRSxTQUFTO1NBQ3pCLEVBQUUsT0FBQSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQTtJQUVVLDBCQUFtQixHQUFHO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQW9FLHFCQUFxQixFQUFFO1lBRWhHLGlCQUFpQixFQUFFLE9BQUEsZUFBZTtTQUNyQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFVSxxQkFBYyxHQUFHLFVBQVMsUUFBZ0I7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBMEQsZ0JBQWdCLEVBQUU7WUFDakYsVUFBVSxFQUFFLFFBQVE7U0FDdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBRVUscUJBQWMsR0FBRyxVQUFTLFFBQWdCO1FBQ2pELElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0MsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxFQXY1QlMsTUFBTSxLQUFOLE1BQU0sUUF1NUJmO0FBRUQsSUFBVSxHQUFHLENBdU9aO0FBdk9ELFdBQVUsR0FBRztJQUNFLHFCQUFpQixHQUFXLE1BQU0sQ0FBQztJQUduQyxjQUFVLEdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLGNBQVUsR0FBWSxJQUFJLENBQUM7SUFHM0IsaUJBQWEsR0FBVyxFQUFFLENBQUM7SUFFM0Isb0JBQWdCLEdBQUc7UUFDMUIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO1lBQ3JFLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsU0FBUyxFQUFFLElBQUk7WUFDZixvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLFFBQVEsRUFBRSxJQUFBLFVBQVU7WUFDcEIsY0FBYyxFQUFFLEtBQUs7U0FDeEIsRUFBRSxJQUFBLG1CQUFtQixDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFBO0lBRVUsb0JBQWdCLEdBQUc7UUFDMUIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO1lBQ3JFLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFNBQVMsRUFBRSxJQUFJO1lBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixRQUFRLEVBQUUsSUFBQSxVQUFVO1lBQ3BCLGNBQWMsRUFBRSxLQUFLO1NBQ3hCLEVBQUUsSUFBQSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQTtJQUVVLGNBQVUsR0FBRyxVQUFTLE1BQWM7UUFJM0MsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztRQUU1QyxJQUFJLENBQUMsSUFBSSxDQUF3RSx1QkFBdUIsRUFBRTtZQUN0RyxRQUFRLEVBQUUsTUFBTTtTQUNuQixFQUFFLDZCQUE2QixDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFBO0lBRUQsSUFBSSw2QkFBNkIsR0FBRyxVQUFTLEdBQXVDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLGtCQUFjLEdBQUc7UUFDeEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssTUFBTSxDQUFDLHVCQUF1QixDQUFDO1FBQ25FLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxLQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEQsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLHVCQUFtQixHQUFHO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLElBQUEsY0FBYyxFQUFFLENBQUM7SUFDN0IsQ0FBQyxDQUFBO0lBRVUsbUJBQWUsR0FBRyxVQUFTLEdBQTRCLEVBQUUsRUFBRTtRQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsSUFBSSxVQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxjQUFVLEdBQUc7UUFFcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXpCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFLRCxJQUFBLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7WUFDbkYsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQzlCLFNBQVMsRUFBRSxDQUFDO1lBQ1osb0JBQW9CLEVBQUUsS0FBSztZQUMzQixRQUFRLEVBQUUsSUFBQSxVQUFVO1lBQ3BCLGNBQWMsRUFBRSxLQUFLO1NBQ3hCLEVBQUUsVUFBUyxHQUE0QjtZQUNwQyxJQUFBLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUtVLHlCQUFxQixHQUFHO1FBRS9CLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFHakIsSUFBSSxJQUFJLEdBQWtCLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWxFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBR3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxpQkFBaUIsQ0FBQztnQkFHbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQTtJQUtVLDBCQUFzQixHQUFHO1FBQ2hDLElBQUksQ0FBQztZQUNELElBQUksY0FBYyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUdqQixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWxFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBR3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxpQkFBaUIsQ0FBQztvQkFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUE7SUFFVSxrQkFBYyxHQUFHLFVBQVMsTUFBTSxFQUFFLEdBQUc7UUFFNUMsSUFBSSxJQUFJLEdBQWtCLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnRUFBZ0UsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNwRixNQUFNLENBQUM7UUFDWCxDQUFDO1FBS0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBS2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFDckMsQ0FBQyxDQUFBO0lBRVUsWUFBUSxHQUFHLFVBQVMsR0FBRztRQUU5QixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLElBQUksVUFBVSxDQUFDLDhCQUE4QixHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFPVSxpQkFBYSxHQUFHLFVBQVMsR0FBRztRQUNuQyxJQUFJLFlBQVksR0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNuRCxVQUFVLENBQUM7WUFDUCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3JDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsQ0FBQztZQUVELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDWixDQUFDLENBQUE7SUFFVSx1QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1FBQ2xFLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFDckMsQ0FBQyxDQUFBO0lBRVUsV0FBTyxHQUFHO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFBLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxNQUFNLENBQUMsVUFBVTtnQkFDM0IsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsUUFBUSxFQUFFLElBQUEsVUFBVTtnQkFDcEIsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxJQUFBLG1CQUFtQixDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLGlCQUFhLEdBQUc7UUFDdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQTtBQUNMLENBQUMsRUF2T1MsR0FBRyxLQUFILEdBQUcsUUF1T1o7QUFFRCxJQUFVLEtBQUssQ0FrQmQ7QUFsQkQsV0FBVSxLQUFLO0lBRUEsMEJBQW9CLEdBQUcsVUFBUyxHQUE4QjtRQUVyRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ2xELENBQUMsQ0FBQTtJQUVVLGtCQUFZLEdBQUc7UUFDdEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsc0NBQXNDLEVBQUUscUJBQXFCLEVBQUU7WUFDckYsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSx3RUFBd0UsRUFBRSxxQkFBcUIsRUFBRTtnQkFDL0gsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRSxFQUFFLEVBQUUsTUFBQSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzdHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxFQWxCUyxLQUFLLEtBQUwsS0FBSyxRQWtCZDtBQUVELElBQVUsS0FBSyxDQStOZDtBQS9ORCxXQUFVLE9BQUs7SUFFQSxrQkFBVSxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUEwQjtRQUM1RSxJQUFJLFFBQVEsR0FBd0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7UUFFMUIsR0FBRyxDQUFDLENBQWEsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1lBQXJCLElBQUksSUFBSSxrQkFBQTtZQUNULFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNEO1FBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFFRCxJQUFJLGdCQUFnQixHQUFHLFVBQVMsS0FBMEIsRUFBRSxHQUFXLEVBQUUsUUFBZ0I7UUFDckYsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUUsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBS1UsbUJBQVcsR0FBRztRQUNyQixNQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQVM3RCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQTtJQUVVLG1DQUEyQixHQUFHLFVBQVMsWUFBWTtRQUMxRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxLQUFLLENBQUM7WUFDVixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQU1VLG1DQUEyQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxLQUEwQjtRQUM3RixJQUFJLElBQUksR0FBYSxNQUFNLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQXdCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFakgsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFHRCxJQUFJLGNBQWMsR0FBRyxVQUFTLFNBQW1CLEVBQUUsS0FBMEI7UUFDekUsR0FBRyxDQUFDLENBQWEsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1lBQXJCLElBQUksSUFBSSxrQkFBQTtZQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7U0FDSjtJQUNMLENBQUMsQ0FBQTtJQUdELElBQUksY0FBYyxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUEwQjtRQUN6RSxHQUFHLENBQUMsQ0FBYSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7WUFBckIsSUFBSSxJQUFJLGtCQUFBO1lBQ1QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELENBQUM7U0FDSjtJQUNMLENBQUMsQ0FBQTtJQUtVLHdCQUFnQixHQUFHLFVBQVMsVUFBVTtRQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxPQUFLLEdBQVcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksV0FBUyxHQUFXLENBQUMsQ0FBQztZQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBRSxRQUFRO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFMUQsV0FBUyxFQUFFLENBQUM7b0JBQ1osSUFBSSxFQUFFLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQzlCLE9BQU8sRUFBRSxxQkFBcUI7cUJBQ2pDLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUUvQyxJQUFJLEdBQUcsU0FBUSxDQUFDO29CQUNoQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNmLEdBQUcsR0FBRyxVQUFVLENBQUM7b0JBQ3JCLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzFCLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsQ0FBQztvQkFFRCxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQ25CLE9BQU8sRUFBRSxvQkFBb0I7cUJBQ2hDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRVIsT0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO3dCQUN0QixPQUFPLEVBQUUsZ0JBQWdCO3FCQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVYLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxDQUFDLFdBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2QsQ0FBQztZQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDdkIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixFQUFFLE9BQUssQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBTVUsdUJBQWUsR0FBRyxVQUFTLFlBQVksRUFBRSxJQUFJO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxJQUFJLElBQUksR0FBc0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQTtJQUVVLDBCQUFrQixHQUFHLFVBQVMsWUFBWSxFQUFFLElBQUk7UUFDdkQsSUFBSSxJQUFJLEdBQXNCLFFBQUEsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLENBQUMsQ0FBQTtJQU1VLHNCQUFjLEdBQUcsVUFBUyxJQUFJO1FBQ3JDLElBQUksU0FBUyxHQUFXLFFBQUEsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUdyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDYixTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLENBQUM7UUFHRCxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQyxDQUFBO0lBTVUsNkJBQXFCLEdBQUcsVUFBUyxJQUFJO1FBQzVDLElBQUksU0FBUyxHQUFXLFFBQUEsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM3RCxDQUFDLENBQUE7SUFFVSwwQkFBa0IsR0FBRyxVQUFTLElBQUk7UUFDekMsSUFBSSxTQUFTLEdBQVcsUUFBQSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzdELENBQUMsQ0FBQTtJQUtVLHNCQUFjLEdBQUcsVUFBUyxRQUFRO1FBRXpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFHbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDO1lBQ0YsTUFBTSxDQUFDLFFBQUEsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSw0QkFBb0IsR0FBRyxVQUFTLE1BQU07UUFDN0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxDQUFDO1FBQzFCLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFTLENBQUMsRUFBRSxLQUFLO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ25CLENBQUM7WUFDRCxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxFQS9OUyxLQUFLLEtBQUwsS0FBSyxRQStOZDtBQUNELElBQVUsTUFBTSxDQTJqQ2Y7QUEzakNELFdBQVUsTUFBTTtJQUNaLElBQUksS0FBSyxHQUFZLEtBQUssQ0FBQztJQU0zQixJQUFJLGtCQUFrQixHQUFHO1FBQ3JCLE1BQU0sQ0FBQywwSEFBMEgsQ0FBQztJQUN0SSxDQUFDLENBQUE7SUFFRCxJQUFJLFlBQVksR0FBRyxVQUFTLElBQW1CO1FBSTNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxPQUFBLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBSUQsSUFBSSxDQUFDLENBQUM7WUFDRixJQUFJLE1BQU0sR0FBVyxPQUFBLEdBQUcsQ0FBQyxHQUFHLEVBQUU7Z0JBQzFCLE1BQU0sRUFBRSxPQUFBLHVCQUF1QixDQUFDLElBQUksQ0FBQzthQUN4QyxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFFNUIsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsYUFBYTthQUN6QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2YsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQVNVLGVBQVEsR0FBRyxVQUFTLEVBQUUsRUFBRSxJQUFJO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxxQkFBYyxHQUFHLFVBQVMsSUFBbUIsRUFBRSxRQUFpQixFQUFFLFFBQWlCO1FBQzFGLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNFLElBQUksVUFBVSxHQUFXLEVBQUUsQ0FBQztRQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLFVBQVUsSUFBSSxrQ0FBa0MsR0FBRyxPQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDbkYsQ0FBQztRQUVELFVBQVUsSUFBSSxPQUFPLENBQUM7UUFFdEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUksS0FBSyxHQUFXLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7WUFDM0YsVUFBVSxJQUFJLGVBQWUsR0FBRyxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUNyRixDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksS0FBSyxHQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsZUFBZSxHQUFHLGtCQUFrQixDQUFDO1lBQ2hHLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzFGLENBQUM7UUFFRCxVQUFVLElBQUksMkJBQXlCLElBQUksQ0FBQyxHQUFHLGNBQVcsQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwQixVQUFVLElBQUksWUFBVSxJQUFJLENBQUMsWUFBYyxDQUFDO1FBQ2hELENBQUM7UUFDRCxVQUFVLElBQUksUUFBUSxDQUFDO1FBWXZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyxVQUFVLElBQUksV0FBUyxJQUFJLENBQUMsSUFBSSxjQUFTLElBQUksQ0FBQyxHQUFHLE1BQUcsQ0FBQztRQUN6RCxDQUFDO1FBRUQsVUFBVSxHQUFHLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNwQixPQUFPLEVBQUUsYUFBYTtTQUN6QixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWYsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDLENBQUE7SUFPVSwyQkFBb0IsR0FBRyxVQUFTLE9BQWU7UUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBTzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM5QixPQUFPLEdBQUcsT0FBQSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDLENBQUE7SUFFVSwwQkFBbUIsR0FBRyxVQUFTLE9BQWU7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEYsQ0FBQyxDQUFBO0lBRVUsc0JBQWUsR0FBRyxVQUFTLE9BQWU7UUFLakQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFDbEUsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLDZCQUE2QixDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUNELE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUUxRSxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUMsQ0FBQTtJQUlVLHdCQUFpQixHQUFHLFVBQVMsSUFBbUI7UUFJdkQsSUFBSSxHQUFHLEdBQVcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLDJCQUF5QixJQUFJLENBQUMsRUFBRSxnQkFBYSxDQUFDO1FBQzlELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSx1Q0FBdUMsQ0FBQztRQUNuRSxJQUFJLFVBQVUsR0FBVyxPQUFBLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQTtJQVVVLHdCQUFpQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVTtRQUM5RyxJQUFJLEdBQUcsR0FBVyxPQUFBLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRzVDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsSUFBSSxVQUFVLEdBQUcsT0FBQSxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQWtCLFVBQVUsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDO1lBS3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxJQUFJLEdBQWEsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDM0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUN0QixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtnQkFDakMsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksV0FBVyxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBR2xGLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFFdEIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFHbkQsSUFBSSxhQUFhLEdBQUcsa0NBQWtDO3dCQUNsRCxtQ0FBbUM7d0JBQ25DLGlDQUFpQzt3QkFDakMsVUFBVTt3QkFDVixXQUFXO3dCQUNYLG1CQUFtQixDQUFDO29CQU94QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNiLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7NEJBQ2QsT0FBTyxFQUFFLGFBQWE7eUJBQ3pCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3RCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTs0QkFDZCxPQUFPLEVBQUUsa0JBQWtCO3lCQUM5QixFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUN0QixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLEdBQUcsSUFBSSxXQUFXLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBSSxZQUFVLEdBQVcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDakUsRUFBRSxDQUFDLENBQUMsWUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDYixHQUFHLElBQWtCLFlBQVUsQ0FBQztnQkFDcEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksTUFBTSxHQUFXLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQU94QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsSUFBSSxNQUFNLENBQUM7WUFDbEIsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLElBQUksR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsY0FBYzthQUMxQixFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQTtJQUVVLHlDQUFrQyxHQUFHLFVBQVMsV0FBbUI7UUFDeEUsSUFBSSxPQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1lBQ3BDLElBQUksSUFBSSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUMsR0FBRyxDQUFDLENBQWMsVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUk7Z0JBQWpCLElBQUksS0FBSyxhQUFBO2dCQUNWLE9BQU8sSUFBSSxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2xCLE9BQU8sRUFBRSxZQUFZO29CQUNyQixTQUFTLEVBQUUsNEJBQTBCLEtBQUssQ0FBQyxRQUFRLE9BQUk7aUJBQzFELEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBb0J0QjtRQUNMLENBQUM7UUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsT0FBTyxHQUFHLGlCQUFpQixDQUFBO1FBQy9CLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUMsQ0FBQTtJQVFVLDJCQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLFFBQWdCO1FBRTFHLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDM0IsSUFBSSxjQUFjLEdBQVksR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDakQsSUFBSSxjQUFjLEdBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQzlDLElBQUksU0FBUyxHQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDO1FBQ3ZFLElBQUksV0FBVyxHQUFZLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUM7UUFFakUsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUU5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFM0MsSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNsQixjQUFjLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDO21CQUM5RSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQVVELElBQUksU0FBUyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzRCxJQUFJLFFBQVEsR0FBWSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRTdELElBQUksZ0JBQWdCLEdBQVcsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNsRyxJQUFJLFFBQVEsR0FBVyxPQUFBLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxELElBQUksS0FBSyxHQUFXLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDakMsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sRUFBRSxnQkFBZ0IsR0FBRyxDQUFDLFFBQVEsR0FBRyxhQUFhLEdBQUcsZUFBZSxDQUFDO1lBQ3hFLFNBQVMsRUFBRSwrQkFBNkIsR0FBRyxRQUFLO1lBQ2hELElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLFFBQVE7U0FDcEIsRUFDRyxnQkFBZ0IsR0FBRyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDMUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxVQUFVO1NBQ3pCLEVBQUUsT0FBQSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUE7SUFFVSxrQkFBVyxHQUFHO1FBQ3JCLElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLElBQUksVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzRCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUQsSUFBSSxHQUFHLEdBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWhDLElBQUksT0FBTyxHQUFXLHNCQUFzQixHQUFHLEdBQUcsQ0FBQztRQUNuRCxJQUFJLElBQUksR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxPQUFPLElBQUksdUJBQXVCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNoRixDQUFDO1FBRUQsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwRCxDQUFDLENBQUE7SUFFVSwwQkFBbUIsR0FBRyxVQUFTLElBQW1CO1FBQ3pELElBQUksV0FBVyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUUsSUFBSSxjQUFjLEdBQVcsRUFBRSxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDZCxjQUFjLEdBQUcsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUN4QixLQUFLLEVBQUUsV0FBVztnQkFDbEIsT0FBTyxFQUFFLGlCQUFpQjthQUM3QixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUMxQixDQUFDLENBQUE7SUFFVSwyQkFBb0IsR0FBRyxVQUFTLElBQW1CO1FBQzFELElBQUksTUFBTSxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFVCxXQUFXLEdBQUcsMkJBQXlCLE1BQU0sT0FBSSxDQUFDO1FBQ3RELENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQTtJQUVVLHdCQUFpQixHQUFHLFVBQVMsT0FBZ0IsRUFBRSxPQUFnQjtRQUN0RSxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV4QixNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQ2QsT0FBTyxFQUFFLHlEQUF5RCxHQUFHLE9BQU87U0FDL0UsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUE7SUFFVSxvQkFBYSxHQUFHLFVBQVMsT0FBZSxFQUFFLEtBQWE7UUFDOUQsSUFBSSxHQUFHLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBUyxLQUFLLFFBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRS9FLElBQUksS0FBSyxHQUFHO1lBQ1IsT0FBTyxFQUFFLHdEQUF3RDtTQUNwRSxDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFBO0lBRVUsZ0JBQVMsR0FBRyxVQUFTLE9BQWUsRUFBRSxPQUFlO1FBQzVELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXhCLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDZCxPQUFPLEVBQUUsdURBQXVELEdBQUcsT0FBTztTQUM3RSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBQTtJQUVVLDJCQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxTQUFrQixFQUFFLFdBQW9CLEVBQUUsY0FBdUI7UUFFN0gsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxZQUFZLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakYsSUFBSSxVQUFVLEdBQVcsRUFBRSxDQUFDO1FBQzVCLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztRQUMzQixJQUFJLG1CQUFtQixHQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDbEMsSUFBSSxrQkFBa0IsR0FBVyxFQUFFLENBQUM7UUFDcEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDbEMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1FBTTdCLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDL0UsV0FBVyxHQUFHLE9BQUEsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSwwQkFBd0IsSUFBSSxDQUFDLEdBQUcsUUFBSzthQUNuRCxFQUNHLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7UUFHNUIsRUFBRSxDQUFDLENBQUMsT0FBQSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixXQUFXLEVBQUUsQ0FBQztZQUVkLFVBQVUsR0FBRyxPQUFBLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBTzdCLE9BQU8sRUFBRSx3Q0FBd0M7Z0JBQ2pELFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsbUJBQWlCLElBQUksQ0FBQyxHQUFHLFFBQUs7YUFDNUMsRUFDRyxNQUFNLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBT0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBR2xDLElBQUksUUFBUSxHQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7WUFHdEUsV0FBVyxFQUFFLENBQUM7WUFFZCxJQUFJLEdBQUcsR0FBVyxRQUFRLEdBQUc7Z0JBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU07Z0JBQ3ZCLFNBQVMsRUFBRSx3QkFBc0IsSUFBSSxDQUFDLEdBQUcsUUFBSztnQkFDOUMsU0FBUyxFQUFFLFNBQVM7Z0JBR3BCLE9BQU8sRUFBRSxtQkFBbUI7YUFDL0I7Z0JBQ0c7b0JBQ0ksSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTTtvQkFDdkIsU0FBUyxFQUFFLHdCQUFzQixJQUFJLENBQUMsR0FBRyxRQUFLO29CQUM5QyxPQUFPLEVBQUUsbUJBQW1CO2lCQUMvQixDQUFDO1lBRU4sU0FBUyxHQUFHLE9BQUEsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUUzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFcEMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsbUJBQW1CLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7b0JBQzNDLE1BQU0sRUFBRSw4QkFBOEI7b0JBQ3RDLElBQUksRUFBRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRztvQkFDbEMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSx5QkFBdUIsSUFBSSxDQUFDLEdBQUcsUUFBSztpQkFDbEQsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNkLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsV0FBVyxFQUFFLENBQUM7Z0JBRWQsZ0JBQWdCLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7b0JBQ3hDLE1BQU0sRUFBRSwwQkFBMEI7b0JBQ2xDLElBQUksRUFBRSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsR0FBRztvQkFDckMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSxzQkFBb0IsSUFBSSxDQUFDLEdBQUcsUUFBSztpQkFDL0MsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBSUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwRCxXQUFXLEVBQUUsQ0FBQztZQUVkLGNBQWMsR0FBRyxPQUFBLEdBQUcsQ0FBQyxtQkFBbUIsRUFDcEM7Z0JBQ0ksS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsdUJBQXFCLElBQUksQ0FBQyxHQUFHLFFBQUs7YUFDaEQsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osV0FBVyxFQUFFLENBQUM7b0JBRWQsZ0JBQWdCLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7d0JBQ3hDLE1BQU0sRUFBRSxvQkFBb0I7d0JBQzVCLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsc0JBQW9CLElBQUksQ0FBQyxHQUFHLFFBQUs7cUJBQy9DLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNkLFdBQVcsRUFBRSxDQUFDO29CQUVkLGtCQUFrQixHQUFHLE9BQUEsR0FBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUMxQyxNQUFNLEVBQUUsc0JBQXNCO3dCQUM5QixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLHdCQUFzQixJQUFJLENBQUMsR0FBRyxRQUFLO3FCQUNqRCxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQU9ELElBQUksaUJBQWlCLEdBQVcsRUFBRSxDQUFDO1FBS25DLElBQUksY0FBYyxHQUFXLEVBQUUsQ0FBQztRQUtoQyxJQUFJLFVBQVUsR0FBVyxTQUFTLEdBQUcsVUFBVSxHQUFHLGdCQUFnQixHQUFHLG1CQUFtQixHQUFHLGlCQUFpQjtjQUN0RyxjQUFjLEdBQUcsY0FBYyxHQUFHLGdCQUFnQixHQUFHLGtCQUFrQixHQUFHLFdBQVcsQ0FBQztRQUU1RixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsT0FBQSxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFGLENBQUMsQ0FBQTtJQUVVLDZCQUFzQixHQUFHLFVBQVMsT0FBZ0IsRUFBRSxZQUFxQjtRQUdoRixNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUNaO1lBQ0ksT0FBTyxFQUFFLG1CQUFtQixHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUM1RSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUE7SUFFVSwyQkFBb0IsR0FBRyxVQUFTLE9BQWU7UUFDdEQsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sRUFBRSxtQkFBbUI7U0FDL0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFBO0lBRVUsc0JBQWUsR0FBRyxVQUFTLEtBQWEsRUFBRSxFQUFVO1FBQzNELE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixJQUFJLEVBQUUsRUFBRTtZQUNSLE1BQU0sRUFBRSxFQUFFO1NBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNkLENBQUMsQ0FBQTtJQUtVLHNCQUFlLEdBQUcsVUFBUyxHQUFXO1FBQzdDLElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUM1QixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsaUJBQVUsR0FBRyxVQUFTLElBQW1CO1FBQ2hELElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7UUFHN0IsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVMsR0FBVyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRWhGLElBQUksVUFBVSxHQUFXLFNBQVMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxJQUFJLEdBQUcsR0FBVyxNQUFNLENBQUMsV0FBVyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDOUQsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztRQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsZUFBUSxHQUFHLFVBQVMsSUFBWTtRQUN2QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7SUFDckMsQ0FBQyxDQUFBO0lBS1UseUJBQWtCLEdBQUcsVUFBUyxJQUE4QixFQUFFLFdBQXFCO1FBQzFGLE1BQU0sQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUUzQyxJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osT0FBTyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDO1FBRUQsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUV6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFFRCxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUV6QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFNMUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDMUIsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztZQUVwQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLFNBQVMsR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWpHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxhQUFhLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVELElBQUksTUFBTSxHQUFXLEVBQUUsQ0FBQztRQUN4QixJQUFJLFFBQVEsR0FBVyxPQUFBLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQU12RCxJQUFJLGVBQWUsR0FBVyxPQUFBLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBSTFGLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNoQyxJQUFJLEtBQUssR0FBVyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLElBQUksV0FBUyxHQUFXLEVBQUUsQ0FBQztZQUMzQixJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFDaEMsSUFBSSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7WUFDckMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1lBTTdCLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRixJQUFJLFNBQVMsR0FBVyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEYsSUFBSSxZQUFZLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBT3RGLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLFdBQVcsR0FBRyxPQUFBLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQzlCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsMEJBQXdCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFLO2lCQUN4RCxFQUNHLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsbUJBQW1CLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7b0JBQzNDLE1BQU0sRUFBRSw4QkFBOEI7b0JBQ3RDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUseUJBQXVCLEdBQUcsUUFBSztpQkFDN0MsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNkLENBQUM7WUFHRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBR2hDLGNBQWMsR0FBRyxPQUFBLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDdEMsTUFBTSxFQUFFLGtCQUFrQjtvQkFDMUIsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSx1QkFBcUIsR0FBRyxRQUFLO2lCQUMzQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2YsQ0FBQztZQUdELElBQUksU0FBUyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMzRCxJQUFJLFFBQVEsR0FBWSxTQUFTLElBQUksU0FBUyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUM7WUFHM0QsRUFBRSxDQUFDLENBQUMsbUJBQW1CLElBQUksY0FBYyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELFdBQVMsR0FBRyxPQUFBLHNCQUFzQixDQUFDLG1CQUFtQixHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUMzRixDQUFDO1lBRUQsSUFBSSxPQUFPLEdBQVcsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxRQUFRLEdBQUcsaUNBQWlDLEdBQUcsbUNBQW1DLENBQUM7Z0JBQzdGLFNBQVMsRUFBRSwrQkFBNkIsR0FBRyxRQUFLO2dCQUNoRCxJQUFJLEVBQUUsS0FBSzthQUNkLEVBQ0csV0FBUyxHQUFHLGVBQWUsQ0FBQyxDQUFDO1lBRWpDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQU94QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBR0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXZCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLFdBQVcsR0FBVyxPQUFBLFVBQVUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsT0FBQSxTQUFTLENBQUMsQ0FBQztZQUNqRixJQUFJLFVBQVUsR0FBVyxPQUFBLFVBQVUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsT0FBQSxRQUFRLENBQUMsQ0FBQztZQUM3RSxNQUFNLElBQUksT0FBQSxpQkFBaUIsQ0FBQyxXQUFXLEdBQUcsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELElBQUksUUFBUSxHQUFXLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQU05QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzVDLElBQUksSUFBSSxHQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxHQUFHLEdBQVcsT0FBQSxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN0RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLE1BQU0sSUFBSSxHQUFHLENBQUM7d0JBQ2QsUUFBUSxFQUFFLENBQUM7b0JBQ2YsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxVQUFVLEdBQUcsT0FBQSxVQUFVLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQUEsUUFBUSxDQUFDLENBQUM7WUFDckUsSUFBSSxVQUFVLEdBQUcsT0FBQSxVQUFVLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQUEsUUFBUSxDQUFDLENBQUM7WUFDckUsTUFBTSxJQUFJLE9BQUEsaUJBQWlCLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN6QixXQUFXLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBRUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFPaEMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFMUIsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsZ0JBQVMsR0FBRztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUMsQ0FBQTtJQUVVLGVBQVEsR0FBRztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQTtJQUVVLGVBQVEsR0FBRztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQTtJQUVVLGVBQVEsR0FBRztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQTtJQUVVLGtCQUFXLEdBQUcsVUFBUyxDQUFTLEVBQUUsSUFBbUIsRUFBRSxPQUFnQixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7UUFFcEgsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFZCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5RCxDQUFDO1FBQ0wsQ0FBQztRQUVELFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxHQUFHLEdBQUcsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUU5RCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsOEJBQXVCLEdBQUcsVUFBUyxJQUFtQjtRQUM3RCxNQUFNLENBQUMsYUFBYSxHQUFHLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMzRyxDQUFDLENBQUE7SUFHVSxzQkFBZSxHQUFHLFVBQVMsSUFBbUI7UUFFckQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUtOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBaUI1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFRdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUUvQixDQUFDO2dCQUlELElBQUksQ0FBQyxDQUFDO29CQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDLENBQUE7SUFHVSxtQkFBWSxHQUFHLFVBQVMsSUFBbUI7UUFDbEQsSUFBSSxHQUFHLEdBQVcsT0FBQSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBRWxDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFhNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBR3ZDLElBQUksS0FBSyxHQUFXLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUs1QyxJQUFJLE1BQU0sR0FBVyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUV0RCxNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNkLEtBQUssRUFBRSxHQUFHO29CQUNWLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDaEIsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJO29CQUNyQixRQUFRLEVBQUUsTUFBTSxHQUFHLElBQUk7aUJBQzFCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFFRCxJQUFJLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNkLEtBQUssRUFBRSxHQUFHO29CQUNWLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSTtvQkFDMUIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSTtpQkFDL0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEIsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ25CLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFNVSxVQUFHLEdBQUcsVUFBUyxHQUFXLEVBQUUsVUFBbUIsRUFBRSxPQUFnQixFQUFFLFFBQWtCO1FBRzVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxXQUFXLENBQUM7WUFDbEMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUdwQixJQUFJLEdBQUcsR0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixHQUFHLElBQUksR0FBRyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBUyxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixDQUFDO29CQUtELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFeEIsR0FBRyxJQUFPLENBQUMsV0FBSyxDQUFDLFFBQUksQ0FBQztvQkFDMUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFFSixHQUFHLElBQU8sQ0FBQyxVQUFLLENBQUMsT0FBSSxDQUFDO29CQUMxQixDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ25CLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDakIsQ0FBQztZQUVELEdBQUcsSUFBSSxNQUFJLE9BQU8sVUFBSyxHQUFHLE1BQUcsQ0FBQztRQUNsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLElBQUksSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsbUJBQVksR0FBRyxVQUFTLFNBQWlCLEVBQUUsT0FBZTtRQUNqRSxNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsT0FBTztTQUNoQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUE7SUFFVSxvQkFBYSxHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1FBQ2xFLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxhQUFhLEVBQUU7WUFDdEIsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsT0FBTztTQUNoQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUE7SUFFVSx3QkFBaUIsR0FBRyxVQUFTLFNBQWlCLEVBQUUsT0FBZTtRQUN0RSxNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsYUFBYSxFQUFFO1lBQ3RCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxPQUFPO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsY0FBYztTQUMxQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUE7SUFFVSxpQkFBVSxHQUFHLFVBQVMsSUFBWSxFQUFFLEVBQVUsRUFBRSxRQUFhLEVBQUUsR0FBUztRQUMvRSxJQUFJLE9BQU8sR0FBRztZQUNWLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLElBQUksRUFBRSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGdCQUFnQjtTQUM1QixDQUFDO1FBRUYsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUE7SUFFVSw2QkFBc0IsR0FBRyxVQUFTLFFBQWdCO1FBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDaEUsQ0FBQyxDQUFBO0lBRVUseUJBQWtCLEdBQUcsVUFBUyxRQUFnQjtRQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQTtJQUVVLHVCQUFnQixHQUFHLFVBQVMsUUFBZ0I7UUFDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUE7SUFFVSwyQkFBb0IsR0FBRyxVQUFTLFFBQWdCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMvRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7SUFDTCxDQUFDLENBQUE7QUFDTCxDQUFDLEVBM2pDUyxNQUFNLEtBQU4sTUFBTSxRQTJqQ2Y7QUFDRCxJQUFVLElBQUksQ0EwTmI7QUExTkQsV0FBVSxJQUFJO0lBQ0Msc0JBQWlCLEdBQVcsV0FBVyxDQUFDO0lBRXhDLGdCQUFXLEdBQVEsSUFBSSxDQUFDO0lBQ3hCLG9CQUFlLEdBQVcsZ0JBQWdCLENBQUM7SUFDM0Msc0JBQWlCLEdBQVcsVUFBVSxDQUFDO0lBRXZDLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO0lBS25CLGtCQUFhLEdBQVEsSUFBSSxDQUFDO0lBSzFCLG9CQUFlLEdBQVEsSUFBSSxDQUFDO0lBSzVCLHFCQUFnQixHQUFrQixJQUFJLENBQUM7SUFNdkMsa0JBQWEsR0FBUSxFQUFFLENBQUM7SUFTeEIsaUJBQVksR0FBcUMsRUFBRSxDQUFDO0lBRXBELHFCQUFnQixHQUFHO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUk7WUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSTtZQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksSUFBSTtZQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQTtJQUVVLHVCQUFrQixHQUFHO1FBSzVCLEVBQUUsQ0FBQyxDQUFDLEtBQUEsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSx3QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1FBQ2xFLEtBQUEsYUFBYSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNsRCxJQUFJLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUE7SUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQTRCO1FBQy9ELEtBQUEsZUFBZSxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN0RCxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUE7SUFFVSx3QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1FBQ2xFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtZQUNyRSxRQUFRLEVBQUUsR0FBRyxDQUFDLGtCQUFrQjtZQUNoQyxTQUFTLEVBQUUsSUFBSTtZQUNmLG9CQUFvQixFQUFFLElBQUk7WUFDMUIsUUFBUSxFQUFFLENBQUM7WUFDWCxjQUFjLEVBQUUsS0FBSztTQUN4QixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQTtJQUVVLHNCQUFpQixHQUFHO1FBQzNCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3BFLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7WUFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ2pCLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYTtZQUNsQyxZQUFZLEVBQUUsSUFBSTtTQUNyQixFQUFFLEtBQUEsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUE7SUFFVSx5QkFBb0IsR0FBRztRQUM5QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLElBQUksVUFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwRSxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO1lBQ3JFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNqQixZQUFZLEVBQUUsRUFBRTtZQUNoQixTQUFTLEVBQUUsTUFBTTtZQUNqQixXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDNUIsWUFBWSxFQUFFLElBQUk7U0FDckIsRUFBRSxLQUFBLGdCQUFnQixDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFBO0lBRVUsbUJBQWMsR0FBRyxVQUFTLElBQW1CO1FBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFBLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsS0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNsQyxDQUFDLENBQUE7SUFFVSw4QkFBeUIsR0FBRyxVQUFTLElBQUksRUFBRSxRQUFRO1FBQzFELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQU0zQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVMsQ0FBQyxFQUFFLElBQUk7WUFDdkMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUM7WUFFWCxLQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVyQixRQUFRLEVBQUUsQ0FBQztZQUNYLE1BQU0sSUFBSSxLQUFBLDRCQUE0QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFBO0lBT1UsaUNBQTRCLEdBQUcsVUFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRO1FBRTNFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBQSxpQkFBaUIsQ0FBQztRQUdwQyxJQUFJLGFBQWEsR0FBRyxLQUFBLGlCQUFpQixDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVoRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNyQixPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLFNBQVMsRUFBRSx3Q0FBc0MsR0FBRyxRQUFLO1lBQ3pELElBQUksRUFBRSxLQUFLO1NBQ2QsRUFDRyxhQUFhO2NBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hCLElBQUksRUFBRSxHQUFHLEdBQUcsZUFBZTthQUM5QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQyxDQUFBO0lBRVUsc0JBQWlCLEdBQUcsVUFBUyxHQUFHO1FBQ3ZDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSwyQkFBeUIsR0FBRyxRQUFLLENBQUMsQ0FBQztRQUN6RixNQUFNLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQTtJQUVVLDJCQUFzQixHQUFHLFVBQVMsTUFBTSxFQUFFLEdBQUc7UUFDcEQsS0FBQSxjQUFjLEVBQUUsQ0FBQztRQUNqQixLQUFBLGdCQUFnQixHQUFHLEtBQUEsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQTtJQUVVLG9CQUFlLEdBQUcsVUFBUyxHQUFXO1FBSTdDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLHdDQUF3QyxHQUFHLEdBQUcsQ0FBQztRQUN6RCxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUE7SUFLVSxtQkFBYyxHQUFHO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBQSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUdELElBQUksTUFBTSxHQUFHLEtBQUEsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLEtBQUEsaUJBQWlCLENBQUM7UUFFdEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRU4sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNMLENBQUMsQ0FBQTtBQUNMLENBQUMsRUExTlMsSUFBSSxLQUFKLElBQUksUUEwTmI7QUFDRCxJQUFVLEtBQUssQ0FrQ2Q7QUFsQ0QsV0FBVSxLQUFLO0lBRVgsSUFBSSx1QkFBdUIsR0FBRyxVQUFTLEdBQWdDO1FBQ25FLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUE7SUFFVSxpQkFBVyxHQUFrQixJQUFJLENBQUM7SUFLbEMscUJBQWUsR0FBRztRQUN6QixJQUFJLElBQUksR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELE1BQUEsV0FBVyxHQUFHLElBQUksQ0FBQztRQUNuQixDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixDQUFDLENBQUE7SUFFVSxxQkFBZSxHQUFHO1FBQ3pCLElBQUksU0FBUyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFFdEMsSUFBSSxDQUFDLElBQUksQ0FBMEQsZ0JBQWdCLEVBQUU7WUFDakYsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1NBQ3pCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUE7QUFDTCxDQUFDLEVBbENTLEtBQUssS0FBTCxLQUFLLFFBa0NkO0FBQ0QsSUFBVSxJQUFJLENBdU9iO0FBdk9ELFdBQVUsSUFBSTtJQUVWLElBQUksY0FBYyxHQUFHLFVBQVMsR0FBd0I7UUFFbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDbEQsQ0FBQyxDQUFBO0lBT1Usc0JBQWlCLEdBQUc7UUFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTTtZQUMzQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUs7WUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNO1lBQ3hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUMsQ0FBQTtJQUVVLCtCQUEwQixHQUFHLFVBQVMsR0FBRztRQUNoRCxJQUFJLEtBQUssR0FBRyxvQkFBb0IsQ0FBQztRQUdqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxDQUFDO1FBRUQsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQTtJQUdVLG1DQUE4QixHQUFHLFVBQVMsR0FBdUI7UUFDeEUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDNUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztRQUM3RCxNQUFNLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDO1FBRXpELE1BQU0sQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUM3QyxNQUFNLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNyRyxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO1FBRXZELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQTtJQUVVLGlCQUFZLEdBQUc7UUFDdEIsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQyxDQUFBO0lBR1UsZ0JBQVcsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHO1FBQ3ZDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNoQixPQUFPLEVBQUUsR0FBRztZQUNaLElBQUksRUFBRSxHQUFHO1NBQ1osQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBS1UsZ0JBQVcsR0FBRztRQUNyQixJQUFJLFFBQVEsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFFVSxpQkFBWSxHQUFHO1FBRXRCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFN0IsSUFBSSxPQUFlLENBQUM7UUFDcEIsSUFBSSxPQUFlLENBQUM7UUFDcEIsSUFBSSxZQUFZLEdBQVksS0FBSyxDQUFDO1FBRWxDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFJNUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUU3QyxJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRzNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xELElBQUksR0FBRyxHQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFbEQsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxDQUFDO1lBS3JFLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUN6QixPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxJQUFJLENBQXdDLE9BQU8sRUFBRTtnQkFDdEQsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUMsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7YUFDbEMsRUFBRSxVQUFTLEdBQXVCO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLEtBQUEsYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsV0FBTSxHQUFHLFVBQVMsc0JBQXNCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFHRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTlCLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUN6QixLQUFBLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQTBDLFFBQVEsRUFBRSxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDckYsQ0FBQyxDQUFBO0lBRVUsVUFBSyxHQUFHLFVBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQXdDLE9BQU8sRUFBRTtZQUN0RCxVQUFVLEVBQUUsR0FBRztZQUNmLFVBQVUsRUFBRSxHQUFHO1lBQ2YsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUI7U0FDbEMsRUFBRSxVQUFTLEdBQXVCO1lBQy9CLEtBQUEsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtJQUVVLHlCQUFvQixHQUFHO1FBQzlCLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQTtJQUVVLGtCQUFhLEdBQUcsVUFBUyxHQUF3QixFQUFFLEdBQVksRUFBRSxHQUFZLEVBQUUsWUFBc0IsRUFBRSxRQUFtQjtRQUNqSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLEdBQUcscUJBQXFCLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEYsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEtBQUEsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsS0FBQSxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxLQUFBLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFFRCxLQUFBLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFHRCxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUM7WUFFdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDaEUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUNqQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hFLEVBQUUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztnQkFDdEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDdkQsRUFBRSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQzNCLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QyxLQUFBLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBTWhELENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3RDLEtBQUEsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBR0QsSUFBSSxvQkFBb0IsR0FBRyxVQUFTLEdBQXVCO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUE7QUFDTCxDQUFDLEVBdk9TLElBQUksS0FBSixJQUFJLFFBdU9iO0FBQ0QsSUFBVSxJQUFJLENBZ01iO0FBaE1ELFdBQVUsSUFBSTtJQUVDLDJCQUFzQixHQUFZLEtBQUssQ0FBQztJQUV4QyxvQkFBZSxHQUFHO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUN4QixNQUFNLENBQUM7UUFDWCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNqRCxVQUFVLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNyRSxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLFVBQVUsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBTVUsd0JBQW1CLEdBQUcsVUFBUyxHQUE2QixFQUFFLFFBQWMsRUFBRSxXQUFxQjtRQUMxRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFBLG9CQUFvQixFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFBO0lBS1UsZ0JBQVcsR0FBRyxVQUFTLE1BQVksRUFBRSxrQkFBd0IsRUFBRSxXQUFpQixFQUFFLGVBQXlCO1FBQ2xILEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksY0FBYyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRSxXQUFXLEdBQUcsY0FBYyxJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUN0RSxDQUFDO1FBT0QsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO1lBQ3JFLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFNBQVMsRUFBRSxJQUFJO1lBQ2Ysb0JBQW9CLEVBQUUsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEtBQUs7WUFDdkQsUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVO1lBQ3hCLGNBQWMsRUFBRSxLQUFLO1NBQ3hCLEVBQUUsVUFBUyxHQUE0QjtZQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsS0FBQSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsZUFBZSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7SUFFVSxjQUFTLEdBQUc7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFFVSxhQUFRLEdBQUc7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUE7SUFFVSxhQUFRLEdBQUc7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFBO0lBRVUsYUFBUSxHQUFHO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUV0QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFBO0lBRUQsSUFBSSxRQUFRLEdBQUcsVUFBUyxZQUFxQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7WUFDckUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQzlCLFNBQVMsRUFBRSxJQUFJO1lBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVU7WUFDeEIsY0FBYyxFQUFFLFlBQVk7U0FDL0IsRUFBRSxVQUFTLEdBQTRCO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7Z0JBQzNDLENBQUM7WUFDTCxDQUFDO1lBQ0QsS0FBQSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0lBUVUseUJBQW9CLEdBQUc7UUFDOUIsS0FBQSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFFOUIsVUFBVSxDQUFDO1lBQ1AsS0FBQSxzQkFBc0IsR0FBRyxLQUFLLENBQUM7WUFFL0IsSUFBSSxHQUFHLEdBQVEsR0FBRyxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFHRCxJQUFJLENBQUMsQ0FBQztnQkFDRixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFNckMsQ0FBQztRQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQTtJQUVVLGdCQUFXLEdBQUc7UUFDckIsRUFBRSxDQUFDLENBQUMsS0FBQSxzQkFBc0IsQ0FBQztZQUN2QixNQUFNLENBQUM7UUFHWCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHakMsVUFBVSxDQUFDO1lBQ1AsRUFBRSxDQUFDLENBQUMsS0FBQSxzQkFBc0IsQ0FBQztnQkFDdkIsTUFBTSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQTtJQUVVLDRCQUF1QixHQUFHLFVBQVMsS0FBYTtRQUN2RCxJQUFJLElBQUksR0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBUSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDO1FBRVgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxXQUFXLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFLckQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLFdBQVcsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNuRCxDQUFDO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsbUJBQWMsR0FBRztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUUsRUFBRSxFQUFFLFVBQVMsR0FBK0I7WUFDMUgsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQTtBQUNMLENBQUMsRUFoTVMsSUFBSSxLQUFKLElBQUksUUFnTWI7QUFDRCxJQUFVLFNBQVMsQ0FrSmxCO0FBbEpELFdBQVUsU0FBUztJQUVmLElBQUksZ0JBQWdCLEdBQUcsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLEVBQVc7UUFDdkUsSUFBSSxjQUFjLEdBQUc7WUFDakIsS0FBSyxFQUFFLGNBQWM7U0FDeEIsQ0FBQztRQUVGLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVoRSxJQUFJLGlCQUFpQixHQUFHO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsWUFBWSxFQUFFLEVBQUU7U0FDbkIsQ0FBQztRQUVGLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDQyxpQkFBa0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLEVBTTlDLFNBQVM7WUFDWCxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUE7SUFFRCxJQUFJLG1CQUFtQixHQUFHLFVBQVMsT0FBZTtRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFDNUIsT0FBTyxFQUFFLHNDQUFzQztZQUMvQyxZQUFZLEVBQUUsRUFBRTtTQUduQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUE7SUFFRCxJQUFJLFFBQVEsR0FBRyxVQUFTLElBQVksRUFBRSxFQUFVLEVBQUUsT0FBWTtRQUMxRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFDNUIsSUFBSSxFQUFFLEVBQUU7WUFDUixTQUFTLEVBQUUsT0FBTztZQUNsQixZQUFZLEVBQUUsRUFBRTtTQUNuQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUE7SUFFRCxJQUFJLEtBQUssR0FBVyxhQUFhLENBQUM7SUFFdkIsZUFBSyxHQUFHO1FBU2YsSUFBSSxRQUFRLEdBQ1IsUUFBUSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUNoRSxJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFcEQsSUFBSSxhQUFhLEdBQ2IsUUFBUSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQztZQUM1RCxRQUFRLENBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFFLCtCQUErQixDQUFDO1lBQ3pFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLENBQUM7WUFDM0QsUUFBUSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx1QkFBdUIsQ0FBQztZQUNqRSxRQUFRLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLEVBQUUseUJBQXlCLENBQUM7WUFDaEYsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsMkJBQTJCLENBQUM7WUFDaEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsMkJBQTJCLENBQUM7WUFDaEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3pFLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUV2RCxJQUFJLGFBQWEsR0FDYixRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDO1lBQ3hELFFBQVEsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsc0JBQXNCLENBQUM7WUFDOUQsUUFBUSxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSx1QkFBdUIsQ0FBQztZQUNsRSxRQUFRLENBQUMsV0FBVyxFQUFFLHdCQUF3QixFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDaEYsSUFBSSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXZELElBQUksbUJBQW1CLEdBQ25CLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxxQ0FBcUMsQ0FBQztZQUMzRixRQUFRLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUUsb0NBQW9DLENBQUM7WUFDeEYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFDL0YsSUFBSSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFckUsSUFBSSxnQkFBZ0IsR0FDaEIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHVCQUF1QixFQUFFLDBCQUEwQixDQUFDO1lBQ2xGLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSx1QkFBdUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQzFGLElBQUksV0FBVyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTlELElBQUksZUFBZSxHQUNmLFFBQVEsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsa0NBQWtDLENBQUM7WUFFakYsUUFBUSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSwrQkFBK0IsQ0FBQztZQUN2RSxRQUFRLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFFbkYsSUFBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRTdELElBQUksaUJBQWlCLEdBQ2pCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsOEJBQThCLENBQUM7WUFDNUUsUUFBUSxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQ2hGLElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRW5FLElBQUksb0JBQW9CLEdBQ3BCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQztZQUMxRSxRQUFRLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO1lBQzdELFFBQVEsQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsdUJBQXVCLENBQUM7WUFDdEUsUUFBUSxDQUFDLGFBQWEsRUFBRSwwQkFBMEIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQ3BGLElBQUksZUFBZSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBWXJFLElBQUksY0FBYyxHQUNkLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSx3QkFBd0IsRUFBRSxtQ0FBbUMsQ0FBQztZQUMxRixRQUFRLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztRQUkxRixJQUFJLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFaEUsSUFBSSxVQUFVLEdBQ1YsUUFBUSxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSx3QkFBd0IsQ0FBQztZQUN2RSxRQUFRLENBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUFFLHdCQUF3QixDQUFDO1lBQ3pFLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSw2QkFBNkIsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1FBQzNHLElBQUksU0FBUyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbkUsSUFBSSxTQUFTLEdBQ1QsUUFBUSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQzFFLElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU1RCxJQUFJLE9BQU8sR0FBbUIsV0FBVyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsY0FBYyxHQUFHLFdBQVcsR0FBRyxlQUFlLEdBQTBCLFVBQVUsR0FBRyxZQUFZLEdBQUcsYUFBYTtjQUM3SyxTQUFTLEdBQUcsWUFBWSxDQUFDO1FBRS9CLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQTtJQUVVLGNBQUksR0FBRztRQUNkLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ3JDLENBQUMsQ0FBQTtBQUNMLENBQUMsRUFsSlMsU0FBUyxLQUFULFNBQVMsUUFrSmxCO0FBT0QsSUFBVSxPQUFPLENBd1ZoQjtBQXhWRCxXQUFVLE9BQU87SUFDRixjQUFNLEdBQVEsSUFBSSxDQUFDO0lBQ25CLHdCQUFnQixHQUFXLElBQUksQ0FBQztJQUUzQyxJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUM7SUFDdkIsSUFBSSxJQUFJLEdBQWtCLElBQUksQ0FBQztJQUMvQixJQUFJLFVBQVUsR0FBZ0IsSUFBSSxDQUFDO0lBRW5DLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztJQUVmLG1CQUFXLEdBQUc7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBb0QsYUFBYSxFQUFFLEVBQzNFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUE7SUFFRCxJQUFJLG1CQUFtQixHQUFHO1FBQ3RCLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUE7SUFFVSxzQkFBYyxHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUFtQjtRQUN6RSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7UUFDckIsSUFBSSxLQUFLLEdBQXNCLEtBQUssQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEYsSUFBSSxJQUFJLEdBQXNCLEtBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEYsSUFBSSxNQUFNLEdBQXNCLEtBQUssQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdEYsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFDeEIsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFDdkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2FBQ3pCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7YUFDOUIsRUFDRyxJQUFJLENBQUMsQ0FBQztRQUNkLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7YUFDdEIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDLENBQUE7SUFFVSxpQ0FBeUIsR0FBRyxVQUFTLElBQW1CO1FBQy9ELElBQUksSUFBSSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQUVELElBQUksR0FBRyxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDckIsQ0FBQztRQUVELElBQUksTUFBTSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLE9BQU8sR0FBc0IsS0FBSyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN4QixDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBRVUsc0JBQWMsR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBbUI7UUFDekUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLElBQUksUUFBUSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JGLElBQUksT0FBTyxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25GLElBQUksU0FBUyxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZGLElBQUksT0FBTyxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25GLElBQUksTUFBTSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpGLElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQztRQUV2QixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekQsS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNyQixNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUs7YUFDeEIsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELElBQUksU0FBUyxHQUFHLFFBQUEseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNaLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDaEMsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7Z0JBQzFELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxNQUFNLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUN4QixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUMxQixFQUFFLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2FBQ3pCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7YUFDOUIsRUFDRyxLQUFLLENBQUMsQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsNEJBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1FBQzNGLElBQUksU0FBUyxHQUFhO1lBQ3RCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsb0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixtQkFBbUI7WUFDbkIsd0JBQXdCO1NBQUMsQ0FBQztRQUU5QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFBO0lBRVUsNEJBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1FBQzNGLElBQUksU0FBUyxHQUFhO1lBQ3RCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsb0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixzQkFBc0I7U0FBQyxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUE7SUFFVSx3QkFBZ0IsR0FBRyxVQUFTLElBQVk7UUFDL0MsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNYLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLFFBQU0sR0FBRyxRQUFBLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFFBQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLElBQUksQ0FBd0QsZUFBZSxFQUFFO29CQUM5RSxLQUFLLEVBQUUsUUFBTTtpQkFDaEIsRUFBRSxVQUFTLEdBQStCO29CQUN2QyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUMsUUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzFELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRUQsSUFBSSxpQkFBaUIsR0FBRyxVQUFTLElBQVk7UUFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLElBQUksTUFBTSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUk7WUFBQyxNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFFRCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsTUFBYztRQUM1QyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBRWhCLElBQUksT0FBTyxHQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsR0FBRyxDQUFDLENBQVksVUFBTyxFQUFQLG1CQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQWxCLElBQUksR0FBRyxnQkFBQTtZQUNSLElBQUksUUFBUSxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQyxRQUFRLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxTQUFTLEdBQVcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxPQUFPLEdBQVcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUMsQ0FBQTtJQU9ELElBQUksZ0JBQWdCLEdBQUcsVUFBUyxPQUFlO1FBRTNDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxTQUFTLEdBQWEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakQsSUFBSSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakQsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ2xDLENBQUMsQ0FBQTtJQUVVLHdCQUFnQixHQUFHO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLFFBQUEsTUFBTSxJQUFJLFFBQUEsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFFBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFBLGdCQUFnQixDQUFDO1lBQ3RDLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxpQkFBUyxHQUFHLFVBQVMsR0FBVyxFQUFFLEdBQVE7UUFDakQsUUFBQSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2IsUUFBQSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLFFBQUEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xCLENBQUMsQ0FBQTtJQUVVLG9CQUFZLEdBQUcsVUFBUyxHQUFXLEVBQUUsR0FBUTtRQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFFYixTQUFTLEdBQUcsV0FBVyxDQUFDLFFBQUEsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsUUFBQSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBTWIsUUFBQSxnQkFBZ0IsRUFBRSxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxDQUFZLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVTtZQUFyQixJQUFJLEdBQUcsbUJBQUE7WUFFUixFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFNBQVM7Z0JBQ25DLENBQUMsUUFBQSxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBSXpELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLFFBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFBLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFHOUQsUUFBQSxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDcEIsUUFBQSxNQUFNLENBQUMsV0FBVyxHQUFHLFFBQUEsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLENBQUM7Z0JBRUQsSUFBSSxDQUFDLENBQUM7b0JBQ0YsUUFBQSxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO2dCQUN4QyxDQUFDO2dCQUNELE1BQU0sQ0FBQztZQUNYLENBQUM7U0FDSjtJQUNMLENBQUMsQ0FBQTtJQUdVLHlCQUFpQixHQUFHO1FBUTNCLEVBQUUsQ0FBQyxDQUFDLFFBQUEsTUFBTSxJQUFJLENBQUMsUUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUczQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUZBQW1GLENBQUMsQ0FBQztnQkFDakcsUUFBQSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsQ0FBQztZQUVELFFBQUEsY0FBYyxDQUFDLFFBQUEsTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBR1UsYUFBSyxHQUFHO1FBQ2YsRUFBRSxDQUFDLENBQUMsUUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsUUFBQSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixRQUFBLGNBQWMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLHFCQUFhLEdBQUcsVUFBUyxHQUFtQjtRQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxRQUFBLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVmLFVBQVUsQ0FBQztnQkFDUCxRQUFBLGNBQWMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQy9DLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixRQUFBLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxZQUFJLEdBQUc7UUFDZCxFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxRQUFBLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQyxDQUFBO0lBRVUsYUFBSyxHQUFHLFVBQVMsSUFBWTtRQUNwQyxFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxRQUFBLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDLENBQUE7SUFHVSxZQUFJLEdBQUcsVUFBUyxLQUFhO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLFFBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNULFFBQUEsTUFBTSxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUM7UUFDaEMsQ0FBQztJQUNMLENBQUMsQ0FBQTtJQUVVLHNCQUFjLEdBQUcsVUFBUyxHQUFXLEVBQUUsVUFBa0I7UUFDaEUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUU5QixJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7WUFDOUUsS0FBSyxFQUFFLEdBQUc7WUFDVixZQUFZLEVBQUUsVUFBVTtTQUUzQixFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFBO0lBRUQsSUFBSSxxQkFBcUIsR0FBRztJQUU1QixDQUFDLENBQUE7QUFDTCxDQUFDLEVBeFZTLE9BQU8sS0FBUCxPQUFPLFFBd1ZoQjtBQUNELElBQVUsWUFBWSxDQThHckI7QUE5R0QsV0FBVSxZQUFZO0lBRVAsdUJBQVUsR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBbUI7UUFDckUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLElBQUksUUFBUSxHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RSxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7UUFFdEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUN4QixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBUUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNiLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDckIsT0FBTyxFQUFFLGFBQWE7YUFDekIsRUFBRSxJQUFJLENBQXFCLENBQUM7UUFDakMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsa0JBQWtCO2FBQzlCLEVBQ0csSUFBSSxDQUFxQixDQUFDO1FBQ2xDLENBQUM7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQyxDQUFBO0lBRVUsK0JBQWtCLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW1CO1FBQzdFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztRQUVyQixJQUFJLGdCQUFnQixHQUFzQixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRW5GLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsYUFBYTtpQkFDekIsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNuQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCO2lCQUM5QixFQUNHLFVBQVUsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQTtJQUVVLGlDQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUErQjtRQUMzRixJQUFJLFNBQVMsR0FBYTtZQUN0QixhQUFhO1NBQUMsQ0FBQztRQUVuQixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFBO0lBRVUsb0JBQU8sR0FBRztRQUNqQixJQUFJLE9BQU8sR0FBa0IsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQixTQUFTLEVBQUUsSUFBSTtnQkFDZixZQUFZLEVBQUUsSUFBSTthQUNyQixFQUFFLGFBQUEsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDLENBQUE7SUFFVSxtQkFBTSxHQUFHO0lBV3BCLENBQUMsQ0FBQTtJQUVVLDRCQUFlLEdBQUcsVUFBUyxHQUE4QjtJQVNwRSxDQUFDLENBQUE7SUFFVSw0QkFBZSxHQUFHLFVBQVMsR0FBNEI7UUFDOUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFBO0lBRVUsbUJBQU0sR0FBRztRQUNoQixDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFBO0lBRVUseUJBQVksR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBK0I7UUFDbkYsSUFBSSxTQUFTLEdBQWE7WUFDdEIsYUFBYTtTQUFDLENBQUM7UUFFbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQTtBQUNMLENBQUMsRUE5R1MsWUFBWSxLQUFaLFlBQVksUUE4R3JCO0FBV0Q7SUFRSSxvQkFBc0IsS0FBYTtRQUFuQyxpQkFVQztRQVZxQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBTjNCLDBCQUFxQixHQUFZLElBQUksQ0FBQztRQW9COUMsU0FBSSxHQUFHO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsZUFBVSxHQUFHO1FBQ2IsQ0FBQyxDQUFBO1FBRUQsVUFBSyxHQUFHO1lBQ0osTUFBTSxDQUFDLEVBQUUsQ0FBQTtRQUNiLENBQUMsQ0FBQztRQUVGLFNBQUksR0FBRztZQUNILElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUloQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFHdEQsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFPN0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQU1sRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QixlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUd2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztZQUVyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUd2QixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO2dCQUU3QixJQUFJLE9BQU8sR0FDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFJZCxPQUFPLEVBQUUsbUNBQW1DO2lCQUMvQyxFQUNHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQXVCOUIsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUdGLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFLM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUdELEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWxCLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFHckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQWdCL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7WUFNM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUdwQixJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsVUFBUyxXQUFXO2dCQUc3RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFPSCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFHckIsVUFBVSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBR1AsVUFBVSxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFBO1FBWUQsT0FBRSxHQUFHLFVBQUMsRUFBRTtZQUNKLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztZQUdoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDZCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEVBQUUsR0FBRyxRQUFRLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRUQsT0FBRSxHQUFHLFVBQUMsRUFBRTtZQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUE7UUFFRCxrQkFBYSxHQUFHLFVBQUMsU0FBaUIsRUFBRSxFQUFVO1lBQzFDLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtnQkFDN0IsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxjQUFjO2FBQzFCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVELG9CQUFlLEdBQUcsVUFBQyxPQUFlLEVBQUUsRUFBVztZQUMzQyxJQUFJLEtBQUssR0FBRztnQkFDUixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUlELGVBQVUsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYSxFQUFFLEdBQVM7WUFDNUQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDakIsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBTUQsb0JBQWUsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYyxFQUFFLEdBQVMsRUFBRSxnQkFBZ0MsRUFBRSxrQkFBOEI7WUFBaEUsaUNBQUEsRUFBQSx1QkFBZ0M7WUFBRSxtQ0FBQSxFQUFBLHNCQUE4QjtZQUVwSSxJQUFJLE9BQU8sR0FBRztnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFTbEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNqQixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFFRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFN0UsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGVBQWUsQ0FBQTtZQUN0QyxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRyxVQUFDLEVBQVUsRUFBRSxRQUFhO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFFRCxnQkFBVyxHQUFHLFVBQUMsRUFBVSxFQUFFLEdBQVc7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixDQUFDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQTtRQUVELGdCQUFXLEdBQUcsVUFBQyxFQUFVO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoRCxDQUFDLENBQUE7UUFFRCxZQUFPLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVTtZQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsb0JBQWUsR0FBRyxVQUFDLEtBQWEsRUFBRSxFQUFVO1lBQ3hDLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFO2dCQUNwQyxJQUFJLEVBQUUsRUFBRTtnQkFDUixNQUFNLEVBQUUsRUFBRTthQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUE7UUFFRCxpQkFBWSxHQUFHLFVBQUMsS0FBYSxFQUFFLEVBQVUsRUFBRSxZQUFxQjtZQUM1RCxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVqQixJQUFJLEtBQUssR0FBRztnQkFFUixNQUFNLEVBQUUsRUFBRTtnQkFDVixJQUFJLEVBQUUsRUFBRTthQUNYLENBQUM7WUFZRixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDakMsQ0FBQztZQUVELElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV0RSxRQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQzVCLEtBQUssRUFBRSxFQUFFO2FBQ1osRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFRCxlQUFVLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVyxFQUFFLFFBQWtCO1lBQ3ZELElBQUksS0FBSyxHQUFHO2dCQUNSLE9BQU8sRUFBeUIsQ0FBQyxRQUFRLEdBQUcsb0NBQW9DLEdBQUcsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCO2FBQzVHLENBQUM7WUFHRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFHRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUVELFVBQUssR0FBRyxVQUFDLEVBQVU7WUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUNELEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFJMUIsQ0FBQyxDQUFBO1FBN1ZHLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBT2YsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQXNKTSwyQkFBTSxHQUFiO1FBQ0ksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQTRMTCxpQkFBQztBQUFELENBQUMsQUF2V0QsSUF1V0M7QUFDRDtJQUEwQiwrQkFBVTtJQUVoQztRQUFBLFlBQ0ksa0JBQU0sYUFBYSxDQUFDLFNBQ3ZCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFN0QsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDM0MsZUFBZSxFQUFFLGVBQWU7Z0JBQ2hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxNQUFNO2FBQ2hCLENBQUMsQ0FBQztZQUVILElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxPQUFPLEVBQUUsbUVBQW1FO2dCQUM1RSxPQUFPLEVBQUUsb0NBQW9DO2FBQ2hELEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7UUFDakMsQ0FBQyxDQUFBOztJQXJCRCxDQUFDO0lBc0JMLGtCQUFDO0FBQUQsQ0FBQyxBQTFCRCxDQUEwQixVQUFVLEdBMEJuQztBQUNEO0lBQXlCLDhCQUFVO0lBRS9CLG9CQUFvQixLQUFhLEVBQVUsT0FBZSxFQUFVLFVBQWtCLEVBQVUsV0FBcUIsRUFDekcsVUFBcUI7UUFEakMsWUFFSSxrQkFBTSxZQUFZLENBQUMsU0FDdEI7UUFIbUIsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQUFVLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLGlCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ3pHLGdCQUFVLEdBQVYsVUFBVSxDQUFXO1FBT2pDLFdBQUssR0FBRztZQUNKLElBQUksT0FBTyxHQUFXLEtBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUM3RyxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFN0MsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQztrQkFDNUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUM1QyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNoRCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUE7O0lBcEJELENBQUM7SUFxQkwsaUJBQUM7QUFBRCxDQUFDLEFBMUJELENBQXlCLFVBQVUsR0EwQmxDO0FBRUQ7SUFBZ0MscUNBQVU7SUFFdEMsMkJBQW9CLFFBQWdCO1FBQXBDLFlBQ0ksa0JBQU0sbUJBQW1CLENBQUMsU0FDN0I7UUFGbUIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQU9wQyxXQUFLLEdBQUc7WUFDSixJQUFJLE9BQU8sR0FBVyxtQkFBbUIsR0FBRyxLQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUVwRSxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDO2tCQUNyRSxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU3QyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGNBQVEsR0FBRztZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1FBQ1AsQ0FBQyxDQUFBOztJQXhCRCxDQUFDO0lBeUJMLHdCQUFDO0FBQUQsQ0FBQyxBQTdCRCxDQUFnQyxVQUFVLEdBNkJ6QztBQUtEO0lBQXlCLDhCQUFVO0lBRS9CLG9CQUFvQixPQUFhLEVBQVUsS0FBVyxFQUFVLFFBQWM7UUFBOUUsWUFDSSxrQkFBTSxZQUFZLENBQUMsU0FNdEI7UUFQbUIsYUFBTyxHQUFQLE9BQU8sQ0FBTTtRQUFVLFdBQUssR0FBTCxLQUFLLENBQU07UUFBVSxjQUFRLEdBQVIsUUFBUSxDQUFNO1FBWTlFLFdBQUssR0FBRztZQUNKLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUMxRSxPQUFPLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBYkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN0QixDQUFDO1FBQ0QsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0lBQ3ZCLENBQUM7SUFVTCxpQkFBQztBQUFELENBQUMsQUFuQkQsQ0FBeUIsVUFBVSxHQW1CbEM7QUFDRDtJQUF1Qiw0QkFBVTtJQUM3QjtRQUFBLFlBQ0ksa0JBQU0sVUFBVSxDQUFDLFNBQ3BCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFbkQsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDNUUsSUFBSSxtQkFBbUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUcsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQ3pGLElBQUksT0FBTyxHQUFHLHNDQUFzQyxDQUFDO1lBRXJELElBQUksSUFBSSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7WUFFcEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFFbkMsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHO1lBQ2xCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxXQUFLLEdBQUc7WUFFSixJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUc7WUFDWixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsSUFBSSxHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV2QyxDQUFDLElBQUksVUFBVSxDQUFDLHdCQUF3QixFQUNwQyx3R0FBd0csRUFDeEcsYUFBYSxFQUFFO2dCQUNYLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZCxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQTs7SUE3REQsQ0FBQztJQThETCxlQUFDO0FBQUQsQ0FBQyxBQWpFRCxDQUF1QixVQUFVLEdBaUVoQztBQUNEO0lBQXdCLDZCQUFVO0lBRTlCO1FBQUEsWUFDSSxrQkFBTSxXQUFXLENBQUMsU0FDckI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUV6RCxJQUFJLFlBQVksR0FDWixLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDcEQsS0FBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO2dCQUMxQyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUVuRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDL0I7Z0JBQ0ksT0FBTyxFQUFFLGVBQWU7YUFDM0IsRUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDWjtnQkFDSSxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixLQUFLLEVBQUUsRUFBRTthQUNaLEVBQ0QsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFcEIsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDaEYsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLHlCQUF5QixFQUNuRixLQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUVyRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXZGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7UUFNNUQsQ0FBQyxDQUFBO1FBRUQsWUFBTSxHQUFHO1lBQ0wsSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVDLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7WUFHaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNqQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQ2pDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDM0IsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDLElBQUksVUFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQTBDLFFBQVEsRUFBRTtnQkFDekQsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxTQUFTLEVBQUUsT0FBTzthQUNyQixFQUFFLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQXdCO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUc1QyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRWQsQ0FBQyxJQUFJLFVBQVUsQ0FDWCx5RUFBeUUsRUFDekUsUUFBUSxDQUNYLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCx1QkFBaUIsR0FBRztZQUVoQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQU1qQyxJQUFJLEdBQUcsR0FBRyxhQUFhLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQTtRQUVELHNCQUFnQixHQUFHO1lBQ2YsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFBOztJQWhHRCxDQUFDO0lBaUdMLGdCQUFDO0FBQUQsQ0FBQyxBQXJHRCxDQUF3QixVQUFVLEdBcUdqQztBQUNEO0lBQXVCLDRCQUFVO0lBQzdCO1FBQUEsWUFDSSxrQkFBTSxVQUFVLENBQUMsU0FDcEI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRTNDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDO2dCQUMvRCxLQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRXpELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbkQsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3JDLFVBQVUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQ3hDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakIsSUFBSSxvQkFBb0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkcsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFcEUsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7WUFFcEMsSUFBSSxNQUFNLEdBQUcsNkJBQTZCLENBQUM7WUFDM0MsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQztZQUVsRSxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ25HLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFFOUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ3ZELENBQUMsQ0FBQTtRQUVELHFCQUFlLEdBQUc7WUFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXO2tCQUN6RixNQUFNLENBQUMsYUFBYSxDQUFDO1lBRTNCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBRXhELElBQUksQ0FBQyxJQUFJLENBQW9FLHFCQUFxQixFQUFFO2dCQUVoRyxpQkFBaUIsRUFBRTtvQkFDZixjQUFjLEVBQUUsTUFBTSxDQUFDLGNBQWMsS0FBSyxNQUFNLENBQUMsYUFBYTtvQkFDOUQsVUFBVSxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUTtvQkFFM0MsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLGVBQWUsRUFBRSxLQUFLO29CQUN0QixlQUFlLEVBQUUsS0FBSztvQkFDdEIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxZQUFZO2lCQUN0QzthQUNKLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUVELDZCQUF1QixHQUFHLFVBQUMsR0FBcUM7WUFDNUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUdyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUk7aUJBQzdGLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFHN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUE7O0lBeEVELENBQUM7SUF5RUwsZUFBQztBQUFELENBQUMsQUE1RUQsQ0FBdUIsVUFBVSxHQTRFaEM7QUFDRDtJQUErQixvQ0FBVTtJQUVyQztRQUFBLFlBQ0ksa0JBQU0sa0JBQWtCLENBQUMsU0FDNUI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFL0MsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUM5RSxJQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsMkJBQTJCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUU1SixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUU3RCxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0QsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDdkMsT0FBTyxFQUFFLG1CQUFtQjthQUMvQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRXBCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQ25ELENBQUMsQ0FBQTs7SUFuQkQsQ0FBQztJQW9CTCx1QkFBQztBQUFELENBQUMsQUF4QkQsQ0FBK0IsVUFBVSxHQXdCeEM7QUFDRDtJQUF3Qiw2QkFBVTtJQUM5QjtRQUFBLFlBQ0ksa0JBQU0sV0FBVyxDQUFDLFNBQ3JCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUU5QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFFckYsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBMEMsYUFBYSxFQUFFO29CQUM5RCxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUU7b0JBQzFCLGdCQUFnQixFQUFFLGNBQWM7aUJBQ25DLEVBQUUsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQXdCO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7O0lBeENELENBQUM7SUF5Q0wsZ0JBQUM7QUFBRCxDQUFDLEFBNUNELENBQXdCLFVBQVUsR0E0Q2pDO0FBQ0Q7SUFBd0IsNkJBQVU7SUFDOUI7UUFBQSxZQUNJLGtCQUFNLFdBQVcsQ0FBQyxTQUNyQjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVoRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFL0UsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsSUFBSSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBMEMsUUFBUSxFQUFFO29CQUN6RCxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUU7b0JBQzFCLGdCQUFnQixFQUFFLGNBQWM7aUJBQ25DLEVBQUUsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQXdCO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBOztJQXpDRCxDQUFDO0lBMENMLGdCQUFDO0FBQUQsQ0FBQyxBQTdDRCxDQUF3QixVQUFVLEdBNkNqQztBQUNEO0lBQStCLG9DQUFVO0lBRXJDO1FBQUEsWUFDSSxrQkFBTSxrQkFBa0IsQ0FBQyxTQUM1QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUvQyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGdJQUFnSSxDQUFDLENBQUM7WUFDMUssSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFOUQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMvRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUc7WUFDVixNQUFNLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWtCO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsWUFBWSxFQUFFLFVBQVU7YUFDM0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBRUgsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7O0lBdkRELENBQUM7SUF3REwsdUJBQUM7QUFBRCxDQUFDLEFBNURELENBQStCLFVBQVUsR0E0RHhDO0FBQ0Q7SUFBNEIsaUNBQVU7SUFFbEM7UUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyw2SEFBNkgsQ0FBQyxDQUFDO1lBQ3ZLLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRTlELElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUNyRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXBFLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxZQUFZLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUMvRCxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxnQkFBVSxHQUFHO1lBQ1QsTUFBTSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUcsVUFBQyxVQUFlO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLEVBQUU7Z0JBQ2YsWUFBWSxFQUFFLFVBQVU7YUFDM0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBOztJQXRERCxDQUFDO0lBdURMLG9CQUFDO0FBQUQsQ0FBQyxBQTNERCxDQUE0QixVQUFVLEdBMkRyQztBQUNEO0lBQTZCLGtDQUFVO0lBRW5DLHdCQUFvQixNQUFlO1FBQW5DLFlBQ0ksa0JBQU0sZ0JBQWdCLENBQUMsU0FDMUI7UUFGbUIsWUFBTSxHQUFOLE1BQU0sQ0FBUztRQU9uQyxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTdDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNwRSxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUN6RixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUVELGdCQUFVLEdBQUc7WUFDVCxNQUFNLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWU7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksVUFBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLENBQUMsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM5QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDO1lBQzFCLElBQUksT0FBTyxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3hCLENBQUM7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsWUFBWSxFQUFFLFVBQVU7YUFDM0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBOztJQTFERCxDQUFDO0lBMkRMLHFCQUFDO0FBQUQsQ0FBQyxBQS9ERCxDQUE2QixVQUFVLEdBK0R0QztBQUNEO0lBQWdDLHFDQUFVO0lBSXRDLDJCQUFvQixRQUFnQjtRQUFwQyxZQUNJLGtCQUFNLG1CQUFtQixDQUFDLFNBQzdCO1FBRm1CLGNBQVEsR0FBUixRQUFRLENBQVE7UUFXcEMsV0FBSyxHQUFHO1lBRUosSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDLENBQUM7WUFFbkYsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFFN0IsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO1lBRXZDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUU3RSxJQUFJLG9CQUFvQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsNEJBQTRCLEVBQzNGLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUU3RSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFNUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUN2RCxDQUFDLENBQUE7UUFFRCxvQkFBYyxHQUFHO1lBQ2IsS0FBSSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLEdBQUcsSUFBSSxLQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUEwRCxnQkFBZ0IsRUFBRTtvQkFDakYsYUFBYSxFQUFFLEtBQUksQ0FBQyxHQUFHO29CQUN2QixVQUFVLEVBQUUsS0FBSSxDQUFDLFFBQVE7aUJBQzVCLEVBQUUsS0FBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwRCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsNEJBQXNCLEdBQUcsVUFBQyxHQUFnQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFNUMsSUFBSSxHQUFHLEdBQUcsZ0NBQWdDLENBQUM7Z0JBRTNDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNoQixHQUFHLElBQUksNkJBQTZCLEdBQUcsR0FBRyxDQUFDLElBQUk7MEJBQ3pDLDhCQUE4QixDQUFDO2dCQUN6QyxDQUFDO2dCQUVELElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUtoQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztvQkFDbEQsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILEtBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7O0lBbEVELENBQUM7SUFtRUwsd0JBQUM7QUFBRCxDQUFDLEFBekVELENBQWdDLFVBQVUsR0F5RXpDO0FBQ0Q7SUFBK0Isb0NBQVU7SUFFckMsMEJBQW9CLElBQVk7UUFBaEMsWUFDSSxrQkFBTSxrQkFBa0IsQ0FBQyxTQUM1QjtRQUZtQixVQUFJLEdBQUosSUFBSSxDQUFRO1FBT2hDLFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUUvQyxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLHVGQUF1RixDQUFDLENBQUM7WUFFNUgsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO2dCQUNyRCxLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RCxJQUFJLG1CQUFtQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLEVBQ3JGLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztZQUU1RSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFM0UsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUN2RCxDQUFDLENBQUE7UUFFRCxtQkFBYSxHQUFHO1lBRVosSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRTNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7b0JBQzlFLE1BQU0sRUFBRSxRQUFRO29CQUNoQixPQUFPLEVBQUUsWUFBWTtpQkFDeEIsRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLENBQUMsSUFBSSxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCwyQkFBcUIsR0FBRyxVQUFDLEdBQStCO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLElBQUksVUFBVSxDQUFDLGtEQUFrRCxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoRixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1osS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDLENBQUE7O0lBL0NELENBQUM7SUFnREwsdUJBQUM7QUFBRCxDQUFDLEFBcERELENBQStCLFVBQVUsR0FvRHhDO0FBQ0Q7SUFBZ0MscUNBQVU7SUFFdEM7UUFBQSxZQUNJLGtCQUFNLG1CQUFtQixDQUFDLFNBQzdCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRXZELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNuQyxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLHdCQUF3QjtpQkFDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztZQUM5QixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFTcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQzVCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUMzQyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxNQUFNLEVBQUUsT0FBTztpQkFDbEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBR2IsVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLEVBQUUsc0JBQXNCO2lCQUNsQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUVELFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixNQUFNLEVBQUUsUUFBUTthQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUdiLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUM1QixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLGFBQWE7YUFDeEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFYixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtnQkFDMUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUMzQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsU0FBUyxFQUFFLHFCQUFxQjtnQkFDaEMsV0FBVyxFQUFFLE9BQU87YUFDdkIsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVmLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQyxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUN4QyxFQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRTlDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUFJLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzVGLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDcEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztZQUVwRSxNQUFNLENBQUMsTUFBTSxHQUFHLGlCQUFpQixHQUFHLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztRQUN6RSxDQUFDLENBQUE7UUFFRCxvQkFBYyxHQUFHO1lBQ2IsSUFBSSxHQUFHLEdBQVksS0FBSyxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCxtQkFBYSxHQUFHO1lBRVosSUFBSSxVQUFVLEdBQUcsVUFBQyxXQUFXO2dCQUV6QixDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQU05RSxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ2QsR0FBRyxFQUFFLGFBQWEsR0FBRyxRQUFRO29CQUM3QixJQUFJLEVBQUUsSUFBSTtvQkFDVixLQUFLLEVBQUUsS0FBSztvQkFDWixXQUFXLEVBQUUsS0FBSztvQkFDbEIsV0FBVyxFQUFFLEtBQUs7b0JBQ2xCLElBQUksRUFBRSxNQUFNO2lCQUNmLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNOLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDTixDQUFDLElBQUksVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixDQUFDLElBQUksVUFBVSxDQUFDLGVBQWUsRUFDM0IsNkRBQTZELEVBQzdELG1CQUFtQixFQUVuQjtvQkFDSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsRUFFRDtvQkFDSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDcEcsQ0FBQyxDQUFBOztJQXRJRCxDQUFDO0lBdUlMLHdCQUFDO0FBQUQsQ0FBQyxBQTNJRCxDQUFnQyxVQUFVLEdBMkl6QztBQUNEO0lBQXdDLDZDQUFVO0lBRTlDO1FBQUEsWUFDSSxrQkFBTSwyQkFBMkIsQ0FBQyxTQUNyQztRQUVELGNBQVEsR0FBYSxJQUFJLENBQUM7UUFDMUIseUJBQW1CLEdBQVksS0FBSyxDQUFDO1FBQ3JDLGlCQUFXLEdBQVksS0FBSyxDQUFDO1FBRTdCLFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUV2RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixpQkFBaUIsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDbkMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSx3QkFBd0I7aUJBQ3BDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBRXBCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBRTlELElBQUksb0JBQW9CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNyQyxPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFUCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtnQkFDMUIsUUFBUSxFQUFFLGFBQWEsR0FBRyxRQUFRO2dCQUNsQyxrQkFBa0IsRUFBRSxLQUFLO2dCQUV6QixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUM7YUFDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVQLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JGLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDcEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztZQUVwRSxNQUFNLENBQUMsTUFBTSxHQUFHLGlCQUFpQixHQUFHLElBQUksR0FBRyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7UUFDaEYsQ0FBQyxDQUFBO1FBRUQsdUJBQWlCLEdBQUc7WUFFaEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLElBQUksTUFBTSxHQUFXO2dCQUNqQixHQUFHLEVBQUUsYUFBYSxHQUFHLFFBQVE7Z0JBRTdCLGdCQUFnQixFQUFFLEtBQUs7Z0JBQ3ZCLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixXQUFXLEVBQUUsQ0FBQztnQkFDZCxlQUFlLEVBQUUsRUFBRTtnQkFJbkIsY0FBYyxFQUFFLEtBQUs7Z0JBQ3JCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixrQkFBa0IsRUFBRSxrQ0FBa0M7Z0JBQ3RELG9CQUFvQixFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQVczRCxJQUFJLEVBQUU7b0JBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNwQixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO29CQUNoRCxDQUFDO29CQUVELFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDO3dCQUU3QyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQzVCLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ25DLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO3dCQUNuQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ25DLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRO3dCQUMzQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNwRCxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQzt3QkFDcEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztvQkFDckMsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBUyxJQUFJO3dCQUNsQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7YUFDSixDQUFDO1lBRUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFBO1FBRUQsb0JBQWMsR0FBRyxVQUFDLFdBQWdCO1lBQzlCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUNoQixLQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM1QyxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBS25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLG1CQUFtQixJQUFJLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLENBQUMsSUFBSSxVQUFVLENBQUMsZUFBZSxFQUMzQiw2REFBNkQsRUFDN0QsbUJBQW1CLEVBRW5CO29CQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixDQUFDLEVBRUQ7b0JBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUc7WUFDYixJQUFJLEdBQUcsR0FBWSxLQUFLLENBQUM7WUFDekIsR0FBRyxDQUFDLENBQWEsVUFBYSxFQUFiLEtBQUEsS0FBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYTtnQkFBekIsSUFBSSxJQUFJLFNBQUE7Z0JBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7YUFDSjtZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCx5QkFBbUIsR0FBRyxVQUFDLFdBQWdCO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDdEMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUVILENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRWhHLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQTs7SUEzSkQsQ0FBQztJQTRKTCxnQ0FBQztBQUFELENBQUMsQUFoS0QsQ0FBd0MsVUFBVSxHQWdLakQ7QUFDRDtJQUErQixvQ0FBVTtJQUVyQztRQUFBLFlBQ0ksa0JBQU0sa0JBQWtCLENBQUMsU0FDNUI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFdkQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDekIsaUJBQWlCLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ25DLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsd0JBQXdCO2lCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksb0JBQW9CLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1lBRTFCLElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNoRixnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUNwQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFFdkIsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDNUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUVwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsb0JBQW9CLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1FBQzVGLENBQUMsQ0FBQTtRQUVELG1CQUFhLEdBQUc7WUFDWixJQUFJLFNBQVMsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBR2xELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBd0QsZUFBZSxFQUFFO29CQUM5RSxRQUFRLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNsQyxXQUFXLEVBQUUsU0FBUztpQkFDekIsRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELDJCQUFxQixHQUFHLFVBQUMsR0FBK0I7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRy9DLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLENBQUMsQ0FBQTs7SUF2REQsQ0FBQztJQXdETCx1QkFBQztBQUFELENBQUMsQUE1REQsQ0FBK0IsVUFBVSxHQTREeEM7QUFDRDtJQUEwQiwrQkFBVTtJQU9oQyxxQkFBb0IsUUFBaUIsRUFBVSxXQUFxQjtRQUFwRSxZQUNJLGtCQUFNLGFBQWEsQ0FBQyxTQVF2QjtRQVRtQixjQUFRLEdBQVIsUUFBUSxDQUFTO1FBQVUsaUJBQVcsR0FBWCxXQUFXLENBQVU7UUFKcEUsc0JBQWdCLEdBQVEsRUFBRSxDQUFDO1FBQzNCLGlCQUFXLEdBQXFCLElBQUksS0FBSyxFQUFhLENBQUM7UUFpQnZELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUMsSUFBSSxjQUFjLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSSxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUN6RixJQUFJLGlCQUFpQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDckcsSUFBSSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFDM0UsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDakcsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMseUJBQXlCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDM0csSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBRWhHLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLEdBQUcscUJBQXFCLEdBQUcsZ0JBQWdCO2tCQUNoSCxrQkFBa0IsR0FBRyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUd4RCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDaEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRWpCLElBQUksbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLG1CQUFtQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQyxFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLHdCQUF3QjtpQkFDcEMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVELG1CQUFtQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQyxFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUN0QyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ25CLEVBQUUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixDQUFDO2dCQUV6QyxLQUFLLEVBQUUsK0JBQStCLEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxNQUFNLEdBQUcsNkRBQTZEO2dCQUN0SSxLQUFLLEVBQUUscUJBQXFCO2FBRS9CLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBTUQsd0JBQWtCLEdBQUc7WUFFakIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBRTdELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFHaEIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUMzQixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7WUFHMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFHdEMsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2xHLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFNbkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLEtBQUssRUFBRSxJQUFJO29CQUt6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDN0MsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU3RSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDcEQsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFdEQsSUFBSSxTQUFTLEdBQWMsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFckcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFFZixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLEtBQUssSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzdELENBQUM7b0JBRUQsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN4QixPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQjs4QkFDOUYsNEJBQTRCLENBQUM7cUJBRXRDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsSUFBSSxDQUFDLENBQUM7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUVqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFMUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN4QixJQUFJLEVBQUUsVUFBVTt3QkFDaEIsT0FBTyxFQUFFLGdCQUFnQjt3QkFDekIsTUFBTSxFQUFFLE1BQU07cUJBQ2pCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUViLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQ1gsRUFBRSxFQUFFLFVBQVU7d0JBQ2QsR0FBRyxFQUFFLEVBQUU7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDckMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDO3dCQUM5QixPQUFPLEVBQUUsZUFBZTtxQkFDM0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRWIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRSxDQUFDO1lBQ0wsQ0FBQztZQWFELElBQUksU0FBUyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUNwQztnQkFDSSxTQUFTLEVBQUUsT0FBTzthQUNyQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBR2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFL0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN4QyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQ3BELENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQjtnQkFDL0IsdUpBQXVKOztvQkFFdkosRUFBRSxDQUFDO1lBRVAsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQU81QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVqRixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7WUFFN0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFBO1FBRUQsd0JBQWtCLEdBQUc7UUFLckIsQ0FBQyxDQUFBO1FBRUQsaUJBQVcsR0FBRztZQUNWLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBQyxLQUFJLENBQUMsQ0FBQztZQUNyRCxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQscUJBQWUsR0FBRztZQUNkLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksUUFBUSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3hCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixhQUFhLEVBQUUsRUFBRTthQUNwQixDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDakksQ0FBQyxDQUFBO1FBRUQsNkJBQXVCLEdBQUcsVUFBQyxHQUE4QjtZQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsS0FBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCwwQkFBb0IsR0FBRyxVQUFDLEdBQVE7WUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUUxQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBS3hCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUVELG9CQUFjLEdBQUcsVUFBQyxPQUFlO1lBQzdCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFFbkQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFHekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLENBQUM7WUFRRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyQixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFLRCxvQkFBYyxHQUFHLFVBQUMsUUFBZ0I7WUFDOUIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLENBQUMsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsdUJBQXVCLEdBQUcsUUFBUSxFQUFFLGNBQWMsRUFBRTtnQkFDbEYsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUE7UUFFRCw2QkFBdUIsR0FBRyxVQUFDLFFBQWdCO1lBRXZDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUEwRCxnQkFBZ0IsRUFBRTtnQkFDakYsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDMUIsVUFBVSxFQUFFLFFBQVE7YUFDdkIsRUFBRSxVQUFTLEdBQWdDO2dCQUN4QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsNEJBQXNCLEdBQUcsVUFBQyxHQUFRLEVBQUUsZ0JBQXFCO1lBRXJELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQU01QyxLQUFLLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFHcEQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBRXhCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxtQkFBYSxHQUFHLFVBQUMsT0FBZTtZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1lBR0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sT0FBTyxHQUFHLElBQUksRUFBRSxDQUFDO2dCQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakUsS0FBSyxDQUFDO29CQUNWLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1RSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNULE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxDQUFDO29CQUNWLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNRCxjQUFRLEdBQUc7WUFLUCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUc1QixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUlELElBQUksQ0FBQyxDQUFDO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDakMsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDNUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELGlCQUFXLEdBQUcsVUFBQyxXQUFvQjtZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFNRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUztnQkFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQztZQUM1QyxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO29CQUNyRSxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO29CQUNuQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUk7b0JBQ3hDLGFBQWEsRUFBRSxXQUFXO29CQUMxQixVQUFVLEVBQUUsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsUUFBUSxHQUFHLGlCQUFpQjtpQkFDaEUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRTtvQkFDOUUsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFDakMsYUFBYSxFQUFFLFdBQVc7b0JBQzFCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQWlCO29CQUM3RCxhQUFhLEVBQUUsS0FBSSxDQUFDLFdBQVc7aUJBQ2xDLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxzQkFBZ0IsR0FBRztZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUdoQyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBRWhCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxVQUFTLEtBQWEsRUFBRSxJQUFTO2dCQUV0RCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUcxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQzdCLE1BQU0sQ0FBQztnQkFFWCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUV4RSxJQUFJLE9BQU8sQ0FBQztvQkFFWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDdEIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOzRCQUNSLE1BQU0sb0NBQW9DLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDekQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDaEMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDL0MsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDO3dCQUNwRixjQUFjLENBQUMsSUFBSSxDQUFDOzRCQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJOzRCQUMxQixPQUFPLEVBQUUsT0FBTzt5QkFDbkIsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xELENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLENBQUMsQ0FBQztvQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFFcEUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUVsQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTzt3QkFFekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBRWxFLElBQUksT0FBTyxDQUFDO3dCQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0NBQ1IsTUFBTSw0Q0FBNEMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOzRCQUNwRSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUVoQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNsRCxDQUFDO3dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUM7d0JBQzlFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzNCLENBQUMsQ0FBQyxDQUFDO29CQUVILGNBQWMsQ0FBQyxJQUFJLENBQUM7d0JBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDakIsUUFBUSxFQUFFLFFBQVE7cUJBQ3JCLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQUM7WUFHSCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksUUFBUSxHQUFHO29CQUNYLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLFVBQVUsRUFBRSxjQUFjO29CQUMxQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsMkJBQTJCO2lCQUNyRCxDQUFDO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLENBQUMsSUFBSSxDQUE4QyxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7b0JBQ3RHLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7aUJBQzVCLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDO1lBQzdDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDckQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHLFVBQUMsU0FBb0I7WUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxTQUFTO2tCQUM3RixTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFFaEIsU0FBUyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFFeEIsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUVELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRWhELElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxVQUFVLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDL0IsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUUvRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLE9BQU8sR0FBWSxJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2hELFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbkMsSUFBSSxFQUFFLEVBQUU7d0JBQ1IsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLFVBQVUsRUFBRSxVQUFVO3dCQUN0QixPQUFPLEVBQUUsS0FBSzt3QkFDZCxPQUFPLEVBQUUsVUFBVTtxQkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7d0JBQ25DLElBQUksRUFBRSxFQUFFO3dCQUNSLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRSxVQUFVO3FCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDeEIsT0FBTyxFQUFFLHNCQUFzQjthQUNsQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRVgsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELDBCQUFvQixHQUFHLFVBQUMsU0FBb0IsRUFBRSxTQUFjO1lBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFFZixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUN2RSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRSxJQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUN4QyxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUs7a0JBQ3hHLFlBQVksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFbkMsSUFBSSxlQUFlLEdBQVcsRUFBRSxDQUFDO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO29CQUNsQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFBRSxVQUFVO29CQUN0QixVQUFVLEVBQUUsVUFBVTtvQkFDdEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsT0FBTyxFQUFFLFVBQVU7aUJBQ3RCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixlQUFlLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRTFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUN2QixLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO3dCQUNsQixPQUFPLEVBQUUsS0FBSzt3QkFDZCxPQUFPLEVBQUUsVUFBVTtxQkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osS0FBSyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUU7d0JBQ2xCLE9BQU8sRUFBRSxnQkFBZ0I7d0JBQ3pCLE1BQU0sRUFBRSxNQUFNO3FCQUNqQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFYixTQUFTLENBQUMsSUFBSSxDQUFDO3dCQUNYLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRTt3QkFDaEIsR0FBRyxFQUFFLFVBQVU7cUJBQ2xCLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUMzQixPQUFPLEVBQUUsa0RBQWtEO2FBQzlELEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFcEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRSxrREFBa0Q7YUFDOUQsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVWLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQzVCLENBQUMsQ0FBQTtRQUVELCtCQUF5QixHQUFHO1lBR3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUczQyxJQUFJLFNBQVMsR0FBYyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3JELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBRVosSUFBSSxZQUFZLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7d0JBTTdDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUNkLElBQUksT0FBTyxHQUFZLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNoRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUVWLEtBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FJN0MsTUFBTSxDQUFDOzRCQUNYLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO29CQUNELElBQUksQ0FBQyxDQUFDO3dCQUNGLE1BQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFDO29CQUM5QyxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3BDLENBQUMsQ0FBQTtRQUVELGtCQUFZLEdBQUc7WUFDWCxJQUFJLFNBQVMsR0FBa0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBZ0QsV0FBVyxFQUFFO2dCQUNsRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQixhQUFhLEVBQUUsQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUN4RCxXQUFXLEVBQUUsSUFBSTthQUNwQixFQUFFLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUVELDBCQUFvQixHQUFHLFVBQUMsR0FBMkI7WUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxnQkFBVSxHQUFHO1lBQ1QsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDaEMsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQXBvQkcsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7O0lBQzlDLENBQUM7SUFtb0JMLGtCQUFDO0FBQUQsQ0FBQyxBQW5wQkQsQ0FBMEIsVUFBVSxHQW1wQm5DO0FBS0Q7SUFBOEIsbUNBQVU7SUFFcEMseUJBQW9CLFdBQWdCO1FBQXBDLFlBQ0ksa0JBQU0saUJBQWlCLENBQUMsU0FDM0I7UUFGbUIsaUJBQVcsR0FBWCxXQUFXLENBQUs7UUFPcEMsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRW5ELElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNyRyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFFbkYsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLENBQUM7WUFFaEYsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFFN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDekIsbUJBQW1CLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUM7c0JBQ2pFLHlDQUF5QyxDQUFDO1lBQ3BELENBQUM7WUFFRCxtQkFBbUIsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLFVBQVUsQ0FBQztZQUV2RixNQUFNLENBQUMsTUFBTSxHQUFHLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztRQUNwRCxDQUFDLENBQUE7UUFFRCwwQkFBb0IsR0FBRztZQUNuQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFHZixDQUFDO2dCQUNHLElBQUksZUFBZSxHQUFHLDRCQUE0QixDQUFDO2dCQUVuRCxLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDbEMsTUFBTSxFQUFFLGVBQWU7b0JBQ3ZCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDOUIsYUFBYSxFQUFFLHFCQUFxQjtvQkFDcEMsT0FBTyxFQUFFLE1BQU07aUJBQ2xCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFHRCxDQUFDO2dCQUNHLElBQUksZ0JBQWdCLEdBQUcsNkJBQTZCLENBQUM7Z0JBRXJELEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO29CQUNsQyxNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDL0IsYUFBYSxFQUFFLHFCQUFxQjtvQkFDcEMsT0FBTyxFQUFFLE9BQU87aUJBQ25CLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFHRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7WUFFakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFBO1FBRUQsa0JBQVksR0FBRztZQUNYLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztZQUMvRSxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7WUFFakYsSUFBSSxRQUFRLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDeEIsWUFBWSxFQUFFLGdCQUFnQjtnQkFDOUIsYUFBYSxFQUFFLGlCQUFpQjthQUNuQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDOUgsQ0FBQyxDQUFBO1FBRUQsMEJBQW9CLEdBQUcsVUFBQyxHQUE4QjtZQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFLeEIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQTs7SUFwRkQsQ0FBQztJQXFGTCxzQkFBQztBQUFELENBQUMsQUF6RkQsQ0FBOEIsVUFBVSxHQXlGdkM7QUFDRDtJQUErQixvQ0FBVTtJQUVyQztRQUFBLFlBQ0ksa0JBQU0sa0JBQWtCLENBQUMsU0FDNUI7UUFLRCxXQUFLLEdBQUc7WUFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFckQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9FLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxpQkFBaUIsRUFDN0YsS0FBSSxDQUFDLENBQUM7WUFDVixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1lBQ2hGLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFbkUsTUFBTSxDQUFDLE1BQU0sR0FBRywyRUFBMkUsR0FBRyxZQUFZO2tCQUNwRyxTQUFTLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRUQsdUJBQWlCLEdBQUc7WUFDaEIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDZCxDQUFDLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUtELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7Z0JBQzNFLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzlCLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztnQkFDcEUsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBO1FBRUQsK0JBQXlCLEdBQUcsVUFBQyxHQUE4QjtZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQTs7SUExQ0QsQ0FBQztJQTJDTCx1QkFBQztBQUFELENBQUMsQUEvQ0QsQ0FBK0IsVUFBVSxHQStDeEM7QUFDRDtJQUF5Qiw4QkFBVTtJQUUvQjtRQUFBLFlBQ0ksa0JBQU0sWUFBWSxDQUFDLFNBQ3RCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUU3QyxJQUFJLHFCQUFxQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUUsMkJBQTJCLEVBQ3hGLEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUseUJBQXlCLEVBQUUsS0FBSSxDQUFDLGlCQUFpQixFQUN2RyxLQUFJLENBQUMsQ0FBQztZQUNWLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFFckUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixHQUFHLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRWhHLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1lBQ3BDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBRXRDLElBQUksbUJBQW1CLEdBQUcsV0FBVyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsR0FBRyxVQUFVO2dCQUNoRixpREFBaUQsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyx1REFBdUQ7a0JBQ3pJLEtBQUksQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsR0FBRyxVQUFVLENBQUM7WUFFeEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUtELFlBQU0sR0FBRztZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtnQkFDMUYsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDOUIsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLGVBQWUsRUFBRSxJQUFJO2FBQ3hCLEVBQUUsS0FBSSxDQUFDLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQVNELCtCQUF5QixHQUFHLFVBQUMsR0FBbUM7WUFDNUQsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUtELHVCQUFpQixHQUFHLFVBQUMsR0FBbUM7WUFDcEQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBRWhCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxRQUFRO2dCQUMzQyxJQUFJLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO2dCQUN4RCxJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksaUJBQWlCLEdBQUc7Z0JBQ3BCLFNBQVMsRUFBRSx5QkFBeUIsR0FBRyxLQUFJLENBQUMsSUFBSSxHQUFHLDhCQUE4QjtnQkFDakYsTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7YUFDekMsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDN0MsQ0FBQztZQUdELElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVuRSxJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3hCLEtBQUssRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2FBQzFDLEVBQUUsMENBQTBDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFBO1FBRUQsNkJBQXVCLEdBQUc7WUFPdEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLFVBQVUsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUU3RCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFFeEIsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO29CQUMzRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUM5QixZQUFZLEVBQUUsSUFBSTtvQkFDbEIsV0FBVyxFQUFFLElBQUk7b0JBQ2pCLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7aUJBQ3hELENBQUMsQ0FBQztZQUVQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQTtRQUVELHFCQUFlLEdBQUcsVUFBQyxTQUFpQixFQUFFLFNBQWlCO1lBSW5ELE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBRXhCLElBQUksQ0FBQyxJQUFJLENBQTRELGlCQUFpQixFQUFFO2dCQUNwRixRQUFRLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUM5QixXQUFXLEVBQUUsU0FBUztnQkFDdEIsV0FBVyxFQUFFLFNBQVM7YUFDekIsRUFBRSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBO1FBRUQsNkJBQXVCLEdBQUcsVUFBQyxHQUFpQztZQUV4RCxJQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtnQkFDMUYsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtnQkFDaEMsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLGVBQWUsRUFBRSxJQUFJO2FBQ3hCLEVBQUUsS0FBSSxDQUFDLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHLFVBQUMsU0FBYyxFQUFFLFFBQWE7WUFDaEQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxTQUFTO2dCQUVqRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFDM0QseUJBQXlCLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhO3NCQUMxRyxLQUFLLENBQUMsQ0FBQztnQkFFYixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRXRELEdBQUcsSUFBSSxLQUFLLEdBQUcsU0FBUyxHQUFHLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7Z0JBRXJHLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGlCQUFpQjtpQkFDN0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELHlCQUFtQixHQUFHO1lBQ2xCLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRUQsdUJBQWlCLEdBQUc7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBS3ZDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBT3hCLElBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRTtnQkFDM0UsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDOUIsV0FBVyxFQUFFLFVBQVU7Z0JBQ3ZCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQTs7SUFoTEQsQ0FBQztJQWlMTCxpQkFBQztBQUFELENBQUMsQUFyTEQsQ0FBeUIsVUFBVSxHQXFMbEM7QUFDRDtJQUE0QixpQ0FBVTtJQUNsQztRQUFBLFlBQ0ksa0JBQU0sZUFBZSxDQUFDLFNBQ3pCO1FBS0QsV0FBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUU1QyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ2hGLElBQUksa0JBQWtCLEdBQUcsK0JBQStCLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUVyRyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLDZCQUE2QixFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFFN0YsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ2pHLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDekUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRXhFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUN2RixDQUFDLENBQUE7UUFFRCxnQkFBVSxHQUFHO1lBQ1QsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBRXZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixDQUFDLElBQUksVUFBVSxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxJQUFJLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWpELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVuRSxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO2dCQUNyRSxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUU7Z0JBQzFCLFNBQVMsRUFBRSxPQUFPO2FBQ3JCLEVBQUUsVUFBUyxHQUE0QjtnQkFDcEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsd0JBQWtCLEdBQUcsVUFBQyxHQUE0QixFQUFFLGdCQUF5QjtZQUN6RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLENBQUM7WUFFTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBSSxHQUFHO1lBQ0gsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQTs7SUFsRUQsQ0FBQztJQW1FTCxvQkFBQztBQUFELENBQUMsQUF0RUQsQ0FBNEIsVUFBVSxHQXNFckM7QUFHRDtJQUE2QixrQ0FBVTtJQUVuQyx3QkFBb0IsU0FBaUIsRUFBVSxPQUFlLEVBQVUsZ0JBQXdCO1FBQWhHLFlBQ0ksa0JBQU0sZ0JBQWdCLENBQUMsU0FHMUI7UUFKbUIsZUFBUyxHQUFULFNBQVMsQ0FBUTtRQUFVLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxzQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFvQmhHLFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFN0MsSUFBSSxJQUFJLEdBQWtCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixNQUFNLHVCQUFxQixLQUFJLENBQUMsT0FBUyxDQUFDO1lBQzlDLENBQUM7WUFFRCxJQUFJLFFBQVEsR0FBc0IsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUdyRixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNqQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUtuQixJQUFJLGFBQWEsR0FBUTtnQkFDckIsS0FBSyxFQUFFLEtBQUksQ0FBQyxTQUFTO2dCQUNyQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxpRkFBaUY7Z0JBQzFGLGNBQWMsRUFBRSwyQkFBeUIsS0FBSSxDQUFDLE9BQU8sY0FBVztnQkFDaEUsV0FBVyxFQUFFLHdCQUFzQixLQUFJLENBQUMsT0FBTyxjQUFXO2dCQUMxRCxVQUFVLEVBQUUsVUFBVTtnQkFDdEIsU0FBUyxFQUFFLE1BQU07YUFDcEIsQ0FBQztZQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBR2hELElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQzlDLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsd0JBQXNCLEtBQUksQ0FBQyxPQUFPLGNBQVc7Z0JBQ3hELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2pELFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsdUJBQXFCLEtBQUksQ0FBQyxPQUFPLGNBQVc7Z0JBQ3ZELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1lBR3JGLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQy9DLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUscUJBQXFCO2dCQUNoQyxPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLEVBQ0csUUFBUSxDQUFDLENBQUM7WUFFZCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDM0MsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxxQkFBcUI7Z0JBQ2hDLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUVaLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO2dCQUMzQyxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLG1CQUFtQjtnQkFDOUIsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixFQUNHLElBQUksQ0FBQyxDQUFDO1lBRVYsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQztZQUdqRyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDekMsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSxrQkFBa0I7Z0JBQzdCLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztZQUViLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO2dCQUN4QyxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLGlCQUFpQjtnQkFDNUIsT0FBTyxFQUFFLFlBQVk7YUFDeEIsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUdaLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV2RixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUVqRixNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLEdBQUcsYUFBYSxHQUFHLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDdEYsQ0FBQyxDQUFBO1FBRUQsZ0JBQVUsR0FBRztZQUNULE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFBO1FBRUQsY0FBUSxHQUFHO1lBQ1AsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFFRCxVQUFJLEdBQUc7UUFDUCxDQUFDLENBQUE7UUF4SEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBb0MsZ0JBQWtCLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7O0lBQ2hELENBQUM7SUFHTSwrQkFBTSxHQUFiO1FBQ0ksaUJBQU0sTUFBTSxXQUFFLENBQUM7UUFDZixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEIsQ0FBQztJQUNMLENBQUM7SUE0R0wscUJBQUM7QUFBRCxDQUFDLEFBN0hELENBQTZCLFVBQVUsR0E2SHRDO0FBQ0Q7SUFBNEIsaUNBQVU7SUFLbEM7UUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtRQUtELFdBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVoRCxJQUFJLHNCQUFzQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlILElBQUkscUJBQXFCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDdkcsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDaEUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixHQUFHLHFCQUFxQixHQUFHLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBRTNILElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFFaEIsT0FBTyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3RSxPQUFPLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFdkYsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRSxTQUFTO2FBQ3JCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFWixJQUFJLFdBQVcsR0FBVyxPQUFPLENBQUM7WUFFbEMsSUFBSSxjQUFjLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLE9BQU8sRUFBRSxlQUFlO2FBQzNCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFWCxNQUFNLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBc0JELHNCQUFnQixHQUFHO1lBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQTtRQUVELHFCQUFlLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFBO1FBRUQsa0JBQVksR0FBRztZQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQTtRQUVELGdCQUFVLEdBQUcsVUFBQyxPQUFZO1lBQ3RCLElBQUksS0FBSyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxLQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxFQUFFLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFDRCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQTtRQUVELFVBQUksR0FBRztZQUNILElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksZUFBZSxHQUFZLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDNUQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QyxDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7O0lBcEdELENBQUM7SUFrQ0Qsb0NBQVksR0FBWixVQUFhLEdBQVcsRUFBRSxRQUFnQixFQUFFLE9BQWUsRUFBRSxpQkFBMEI7UUFDbkYsSUFBSSxPQUFPLEdBQVc7WUFDbEIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsU0FBUyxFQUFFLE9BQU87U0FDckIsQ0FBQztRQUVGLElBQUksS0FBSyxHQUFXLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxVQUFVLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDcEUsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7U0FDbEUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFpREwsb0JBQUM7QUFBRCxDQUFDLEFBNUdELENBQTRCLFVBQVUsR0E0R3JDO0FBQ0Q7SUFBQTtRQUVJLFVBQUssR0FBVyxvQkFBb0IsQ0FBQztRQUNyQyxVQUFLLEdBQVcsZUFBZSxDQUFDO1FBQ2hDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFekIsVUFBSyxHQUFHO1lBQ0osSUFBSSxNQUFNLEdBQUcsbURBQW1ELENBQUM7WUFDakUsSUFBSSxXQUFXLEdBQUcsb0NBQW9DLENBQUM7WUFDdkQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBRUYsU0FBSSxHQUFHO1lBQ0gsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFBRCx5QkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFDRDtJQUFBO1FBRUksVUFBSyxHQUFXLHNCQUFzQixDQUFDO1FBQ3ZDLFVBQUssR0FBVyxpQkFBaUIsQ0FBQztRQUNsQyxZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLFVBQUssR0FBRztZQUNKLElBQUksTUFBTSxHQUFHLHFEQUFxRCxDQUFDO1lBQ25FLElBQUksV0FBVyxHQUFHLCtCQUErQixDQUFDO1lBQ2xELE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVELFNBQUksR0FBRztZQUNILENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUE7SUFDTCxDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBRUQsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vdG9kby0wOiBuZWVkIHRvIGZpbmQgdGhlIERlZmluaXRlbHlUeXBlZCBmaWxlIGZvciBQb2x5bWVyLlxuZGVjbGFyZSB2YXIgUG9seW1lcjtcbmRlY2xhcmUgdmFyIERyb3B6b25lO1xuZGVjbGFyZSB2YXIgYWNlO1xuZGVjbGFyZSB2YXIgY29va2llUHJlZml4O1xuZGVjbGFyZSB2YXIgcG9zdFRhcmdldFVybDtcbmRlY2xhcmUgdmFyIHByZXR0eVByaW50O1xuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEU7XG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRV9TSE9SVDtcblxuaW50ZXJmYWNlIF9IYXNTZWxlY3Qge1xuICAgIHNlbGVjdD86IGFueTtcbn1cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5L2pxdWVyeS5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxubmFtZXNwYWNlIGpzb24ge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBBY2Nlc3NDb250cm9sRW50cnlJbmZvIHtcbiAgICAgICAgcHJpbmNpcGFsTmFtZTogc3RyaW5nO1xuICAgICAgICBwcml2aWxlZ2VzOiBQcml2aWxlZ2VJbmZvW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBOb2RlSW5mbyB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIHBhdGg6IHN0cmluZztcbiAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgIGhhc0NoaWxkcmVuOiBib29sZWFuO1xuICAgICAgICBoYXNCaW5hcnk6IGJvb2xlYW47XG4gICAgICAgIGJpbmFyeUlzSW1hZ2U6IGJvb2xlYW47XG4gICAgICAgIGJpblZlcjogbnVtYmVyO1xuICAgICAgICB3aWR0aDogbnVtYmVyO1xuICAgICAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICAgICAgY2hpbGRyZW5PcmRlcmVkOiBib29sZWFuO1xuICAgICAgICB1aWQ6IHN0cmluZztcbiAgICAgICAgY3JlYXRlZEJ5OiBzdHJpbmc7XG4gICAgICAgIGxhc3RNb2RpZmllZDogRGF0ZTtcbiAgICAgICAgaW1nSWQ6IHN0cmluZztcbiAgICAgICAgb3duZXI6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgICAgICBwcml2aWxlZ2VOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eUluZm8ge1xuICAgICAgICB0eXBlOiBudW1iZXI7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgdmFsdWVzOiBzdHJpbmdbXTtcbiAgICAgICAgYWJicmV2aWF0ZWQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZWZJbmZvIHtcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVXNlclByZWZlcmVuY2VzIHtcbiAgICAgICAgZWRpdE1vZGU6IGJvb2xlYW47XG4gICAgICAgIGFkdmFuY2VkTW9kZTogYm9vbGVhbjtcbiAgICAgICAgbGFzdE5vZGU6IHN0cmluZztcbiAgICAgICAgaW1wb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgZXhwb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgc2hvd01ldGFEYXRhOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBwcml2aWxlZ2VzOiBzdHJpbmdbXTtcbiAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgICAgICBpZ25vcmVVcmw6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICBuZXdQYXNzd29yZDogc3RyaW5nO1xuICAgICAgICBwYXNzQ29kZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VBY2NvdW50UmVxdWVzdCB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICAvL25vZGVQYXRoOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgIHVybDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlU3ViTm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgdHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgY3JlYXRlQXRUb3A6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkczogc3RyaW5nW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgcHJvcE5hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgdGFyZ2V0RmlsZU5hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBpbmNsdWRlQWNsOiBib29sZWFuO1xuICAgICAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1JlcXVlc3Qge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnRCb29rUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBib29rTmFtZTogc3RyaW5nO1xuICAgICAgICB0cnVuY2F0ZWQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVxdWVzdCB7XG4gICAgICAgIHBhcmVudElkOiBzdHJpbmc7XG4gICAgICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgdHlwZU5hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVxdWVzdCB7XG4gICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgIHR6T2Zmc2V0OiBudW1iZXI7XG4gICAgICAgIGRzdDogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIExvZ291dFJlcXVlc3Qge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgIHRhcmdldE5vZGVJZDogc3RyaW5nO1xuICAgICAgICB0YXJnZXRDaGlsZElkOiBzdHJpbmc7XG4gICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlcXVlc3Qge1xuICAgICAgICBzb3J0RGlyOiBzdHJpbmc7XG4gICAgICAgIHNvcnRGaWVsZDogc3RyaW5nO1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICBzZWFyY2hQcm9wOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgIHJlaW5kZXg6IGJvb2xlYW5cbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbW92ZVByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgIHByaXZpbGVnZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgbmV3TmFtZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgdXBMZXZlbDogbnVtYmVyO1xuICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgcmVuZGVyUGFyZW50SWZMZWFmOiBib29sZWFuO1xuICAgICAgICBnb1RvTGFzdFBhZ2U6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgIHVzZXI6IHN0cmluZztcbiAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gICAgICAgIHByb3BlcnR5VmFsdWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0IHtcbiAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBPcGVuU3lzdGVtRmlsZVJlcXVlc3Qge1xuICAgICAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCB7XG4gICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgc2libGluZ0lkOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTaWdudXBSZXF1ZXN0IHtcbiAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgY2FwdGNoYTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3BsaXROb2RlUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICBkZWxpbWl0ZXI6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHNvdXJjZVVybDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlRm9sZGVyUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgICAgIHJlbmRlck5vZGVSZXNwb25zZTogUmVuZGVyTm9kZVJlc3BvbnNlO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHVzZXI6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldFBsYXllckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBhY2xFbnRyaWVzOiBBY2Nlc3NDb250cm9sRW50cnlJbmZvW107XG4gICAgICAgIG93bmVyczogc3RyaW5nW107XG4gICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBub2RlSW5mbzogTm9kZUluZm87XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnRCb29rUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9naW5SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHJvb3ROb2RlOiBSZWZJbmZvO1xuICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICBhbm9uVXNlckxhbmRpbmdQYWdlTm9kZTogc3RyaW5nO1xuICAgICAgICBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XG4gICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBOb2RlU2VhcmNoUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgc2VhcmNoUmVzdWx0Tm9kZUlkOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBuZXdJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIGNoaWxkcmVuOiBOb2RlSW5mb1tdO1xuICAgICAgICBvZmZzZXRPZk5vZGVGb3VuZDogbnVtYmVyO1xuXG4gICAgICAgIC8qIGhvbGRzIHRydWUgaWYgd2UgaGl0IHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgY2hpbGQgbm9kZXMgKi9cbiAgICAgICAgZW5kUmVhY2hlZDogYm9vbGVhbjtcblxuICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZU5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVByb3BlcnR5UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBwcm9wZXJ0eVNhdmVkOiBQcm9wZXJ0eUluZm87XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTaWdudXBSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlRm9sZGVyUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBsaXN0aW5nSnNvbjogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgc3VjY2VzczogYm9vbGVhbjtcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIH1cblxufVxuXG5uYW1lc3BhY2UgY25zdCB7XHJcblxyXG4gICAgZXhwb3J0IGxldCBBTk9OOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG4gICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fVVNSOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luVXNyXCI7XHJcbiAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgIC8qXHJcbiAgICAgKiBsb2dpblN0YXRlPVwiMFwiIGlmIHVzZXIgbG9nZ2VkIG91dCBpbnRlbnRpb25hbGx5LiBsb2dpblN0YXRlPVwiMVwiIGlmIGxhc3Qga25vd24gc3RhdGUgb2YgdXNlciB3YXMgJ2xvZ2dlZCBpbidcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fU1RBVEU6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5TdGF0ZVwiO1xyXG4gICAgZXhwb3J0IGxldCBCUjogXCI8ZGl2IGNsYXNzPSd2ZXJ0LXNwYWNlJz48L2Rpdj5cIjtcclxuICAgIGV4cG9ydCBsZXQgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICBleHBvcnQgbGV0IE5FV19PTl9UT09MQkFSOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBleHBvcnQgbGV0IElOU19PTl9UT09MQkFSOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIHdvcmtzLCBidXQgSSdtIG5vdCBzdXJlIEkgd2FudCBpdCBmb3IgQUxMIGVkaXRpbmcuIFN0aWxsIHRoaW5raW5nIGFib3V0IGRlc2lnbiBoZXJlLCBiZWZvcmUgSSB0dXJuIHRoaXNcclxuICAgICAqIG9uLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IFVTRV9BQ0VfRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgZXhwb3J0IGxldCBTSE9XX1BBVEhfT05fUk9XUzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBleHBvcnQgbGV0IFNIT1dfUEFUSF9JTl9ETEdTOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBleHBvcnQgbGV0IFNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcblxuLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbi8qIE1vZGVscyBhIHRpbWUtcmFuZ2UgaW4gc29tZSBtZWRpYSB3aGVyZSBhbiBBRCBzdGFydHMgYW5kIHN0b3BzICovXG5jbGFzcyBBZFNlZ21lbnQge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiZWdpblRpbWU6IG51bWJlciwvL1xuICAgICAgICBwdWJsaWMgZW5kVGltZTogbnVtYmVyKSB7XG4gICAgfVxufVxuXG5jbGFzcyBQcm9wRW50cnkge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgcHJvcGVydHk6IGpzb24uUHJvcGVydHlJbmZvLCAvL1xuICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyByZWFkT25seTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIGJpbmFyeTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICB9XG59XG5cbmNsYXNzIFN1YlByb3Age1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICB9XG59XG5cbm5hbWVzcGFjZSB1dGlsIHtcclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ0FqYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGV4cG9ydCBsZXQgdGltZW91dE1lc3NhZ2VTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgZXhwb3J0IGxldCBvZmZsaW5lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgZXhwb3J0IGxldCB3YWl0Q291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIGV4cG9ydCBsZXQgcGdyc0RsZzogYW55ID0gbnVsbDtcclxuXG4gICAgZXhwb3J0IGxldCBlc2NhcGVSZWdFeHAgPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIHJldHVybiBfLnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBlc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbihfKSB7XG4gICAgICAgIHJldHVybiB1dGlsLnJlcGxhY2VBbGwoXywgXCJcXFwiXCIsIFwiJnF1b3Q7XCIpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgdW5lbmNvZGVIdG1sID0gZnVuY3Rpb24oXykge1xuICAgICAgICBpZiAoIXV0aWwuY29udGFpbnMoXywgXCImXCIpKVxuICAgICAgICAgICAgcmV0dXJuIF87XG5cbiAgICAgICAgdmFyIHJldCA9IF87XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmYW1wOycsICcmJyk7XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmZ3Q7JywgJz4nKTtcbiAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgJyZsdDsnLCAnPCcpO1xuICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJnF1b3Q7JywgJ1wiJyk7XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmIzM5OycsIFwiJ1wiKTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVwbGFjZUFsbCA9IGZ1bmN0aW9uKF8sIGZpbmQsIHJlcGxhY2UpIHtcbiAgICAgICAgcmV0dXJuIF8ucmVwbGFjZShuZXcgUmVnRXhwKHV0aWwuZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IGNvbnRhaW5zID0gZnVuY3Rpb24oXywgc3RyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yoc3RyKSAhPSAtMTtcbiAgICB9XG5cclxuICAgIGV4cG9ydCBsZXQgc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKF8sIHN0cikge1xyXG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH1cclxuXG4gICAgZXhwb3J0IGxldCBzdHJpcElmU3RhcnRzV2l0aCA9IGZ1bmN0aW9uKF8sIHN0cikge1xuICAgICAgICBpZiAoXy5zdGFydHNXaXRoKHN0cikpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXztcbiAgICB9XG5cclxuICAgIGV4cG9ydCBsZXQgYXJyYXlDbG9uZSA9IGZ1bmN0aW9uKF86IGFueVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uc2xpY2UoMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBsZXQgYXJyYXlJbmRleE9mSXRlbUJ5UHJvcCA9IGZ1bmN0aW9uKF86IGFueVtdLCBwcm9wTmFtZSwgcHJvcFZhbCkge1xyXG4gICAgICAgIHZhciBsZW4gPSBfLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChfW2ldW3Byb3BOYW1lXSA9PT0gcHJvcFZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBuZWVkIHRvIHRlc3QgYWxsIGNhbGxzIHRvIHRoaXMgbWV0aG9kIGJlY2F1c2UgaSBub3RpY2VkIGR1cmluZyBUeXBlU2NyaXB0IGNvbnZlcnNpb24gaSB3YXNuJ3QgZXZlbiByZXR1cm5pbmdcclxuICAgIGEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuICAgICovXHJcbiAgICBleHBvcnQgbGV0IGFycmF5TW92ZUl0ZW0gPSBmdW5jdGlvbihfOiBhbnlbXSwgZnJvbUluZGV4LCB0b0luZGV4KSB7XHJcbiAgICAgICAgXy5zcGxpY2UodG9JbmRleCwgMCwgXy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBsZXQgc3RkVGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbihfOiBEYXRlKSB7XHJcbiAgICAgICAgdmFyIGphbiA9IG5ldyBEYXRlKF8uZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICAgICAgdmFyIGp1bCA9IG5ldyBEYXRlKF8uZ2V0RnVsbFllYXIoKSwgNiwgMSk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGphbi5nZXRUaW1lem9uZU9mZnNldCgpLCBqdWwuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBkc3QgPSBmdW5jdGlvbihfOiBEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZ2V0VGltZXpvbmVPZmZzZXQoKSA8IHN0ZFRpbWV6b25lT2Zmc2V0KF8pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5kZXhPZk9iamVjdCA9IGZ1bmN0aW9uKF86IGFueVtdLCBvYmopIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF8ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKF9baV0gPT09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgLy9cdE9iamVjdC5wcm90b3R5cGUudG9Kc29uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvL1x0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgNCk7XHJcbiAgICAvL1x0fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IGFzc2VydE5vdE51bGwgPSBmdW5jdGlvbih2YXJOYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBldmFsKHZhck5hbWUpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcbiAgICAgKiBzZXNzaW9uIGlzIG9ubHkgYWxsb3dlZCBvbmUgY29uY3VycmVudCBjYWxsIGFuZCBzaW11bHRhbmVvdXMgY2FsbHMgd291bGQganVzdCBcInF1ZXVlIHVwXCIuXHJcbiAgICAgKi9cclxuICAgIGxldCBfYWpheENvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKHV0aWwuZHN0KG5ldyBEYXRlKCkpKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGNhbWUgZnJvbSBoZXJlOlxyXG4gICAgICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lPzogYW55LCB1cmw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdXJsKVxyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAoIXJlc3VsdHNbMl0pXHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNldHMgdXAgYW4gaW5oZXJpdGFuY2UgcmVsYXRpb25zaGlwIHNvIHRoYXQgY2hpbGQgaW5oZXJpdHMgZnJvbSBwYXJlbnQsIGFuZCB0aGVuIHJldHVybnMgdGhlIHByb3RvdHlwZSBvZiB0aGVcclxuICAgICAqIGNoaWxkIHNvIHRoYXQgbWV0aG9kcyBjYW4gYmUgYWRkZWQgdG8gaXQsIHdoaWNoIHdpbGwgYmVoYXZlIGxpa2UgbWVtYmVyIGZ1bmN0aW9ucyBpbiBjbGFzc2ljIE9PUCB3aXRoXHJcbiAgICAgKiBpbmhlcml0YW5jZSBoaWVyYXJjaGllcy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpbmhlcml0ID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCk6IGFueSB7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuICAgICAgICByZXR1cm4gY2hpbGQucHJvdG90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5pdFByb2dyZXNzTW9uaXRvciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHNldEludGVydmFsKHByb2dyZXNzSW50ZXJ2YWwsIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcHJvZ3Jlc3NJbnRlcnZhbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBpc1dhaXRpbmcgPSBpc0FqYXhXYWl0aW5nKCk7XHJcbiAgICAgICAgaWYgKGlzV2FpdGluZykge1xyXG4gICAgICAgICAgICB3YWl0Q291bnRlcisrO1xyXG4gICAgICAgICAgICBpZiAod2FpdENvdW50ZXIgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGdyc0RsZyA9IG5ldyBQcm9ncmVzc0RsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2FpdENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAocGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgcGdyc0RsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgIHBncnNEbGcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQganNvbiA9IGZ1bmN0aW9uIDxSZXF1ZXN0VHlwZSwgUmVzcG9uc2VUeXBlPihwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogUmVxdWVzdFR5cGUsIC8vXHJcbiAgICAgICAgY2FsbGJhY2s/OiAocmVzcG9uc2U6IFJlc3BvbnNlVHlwZSwgcGF5bG9hZD86IGFueSkgPT4gYW55LCBjYWxsYmFja1RoaXM/OiBhbnksIGNhbGxiYWNrUGF5bG9hZD86IGFueSkge1xyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUk9CQUJMRSBCVUc6IGpzb24gY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSArIFwiIHVzZWQgZ2xvYmFsICd3aW5kb3cnIGFzICd0aGlzJywgd2hpY2ggaXMgYWxtb3N0IG5ldmVyIGdvaW5nIHRvIGJlIGNvcnJlY3QuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgIHZhciBpcm9uUmVxdWVzdDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKG9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib2ZmbGluZTogaWdub3JpbmcgY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTT04tUE9TVFtnZW5dOiBbXCIgKyBwb3N0TmFtZSArIFwiXVwiICsgSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogRG8gbm90IGRlbGV0ZSwgcmVzZWFyY2ggdGhpcyB3YXkuLi4gKi9cclxuICAgICAgICAgICAgLy8gdmFyIGlyb25BamF4ID0gdGhpcy4kJChcIiNteUlyb25BamF4XCIpO1xyXG4gICAgICAgICAgICAvL2lyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD4pd2luZG93LmRvY3VtZW50LnJvb3QpLnF1ZXJ5U2VsZWN0b3IoXCIjaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICBpcm9uQWpheCA9IHBvbHlFbG1Ob2RlKFwiaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICBpcm9uQWpheC51cmwgPSBwb3N0VGFyZ2V0VXJsICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICBpcm9uQWpheC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpO1xyXG4gICAgICAgICAgICBpcm9uQWpheC5tZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgIC8vIHNwZWNpZnkgYW55IHVybCBwYXJhbXMgdGhpcyB3YXk6XHJcbiAgICAgICAgICAgIC8vIGlyb25BamF4LnBhcmFtcz0ne1wiYWx0XCI6XCJqc29uXCIsIFwicVwiOlwiY2hyb21lXCJ9JztcclxuXHJcbiAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgIC8qIFRoaXMgbm90IGEgcmVxdWlyZWQgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgLy8gaXJvbkFqYXgub25SZXNwb25zZSA9IFwidXRpbC5pcm9uQWpheFJlc3BvbnNlXCI7IC8vIG9uLXJlc3BvbnNlXHJcbiAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAvLyBwcm9wKVxyXG4gICAgICAgICAgICBpcm9uQWpheC5kZWJvdW5jZUR1cmF0aW9uID0gXCIzMDBcIjsgLy8gZGVib3VuY2UtZHVyYXRpb24gKGlzXHJcbiAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICBfYWpheENvdW50ZXIrKztcclxuICAgICAgICAgICAgaXJvblJlcXVlc3QgPSBpcm9uQWpheC5nZW5lcmF0ZVJlcXVlc3QoKTtcclxuICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgc3RhcnRpbmcgcmVxdWVzdDogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTm90ZXNcclxuICAgICAgICAgKiA8cD5cclxuICAgICAgICAgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG4gICAgICAgICAqIDxwPlxyXG4gICAgICAgICAqIEkgdGhpbmsgdGhlIHdheSB0aGVzZSBwYXJhbWV0ZXJzIGdldCBwYXNzZWQgaW50byBkb25lL2ZhaWwgZnVuY3Rpb25zLCBpcyBiZWNhdXNlIHRoZXJlIGFyZSByZXNvbHZlL3JlamVjdFxyXG4gICAgICAgICAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcbiAgICAgICAgICogdG8gYWxsIHRoZSB3YWl0aW5nIG1ldGhvZHMganVzdCBsaWtlIGFzIGlmIHRoZXkgd2VyZSBzdWJzY3JpYmluZyBpbiBhIHB1Yi9zdWIgbW9kZWwuIFNvIHRoZSAncHJvbWlzZSdcclxuICAgICAgICAgKiBwYXR0ZXJuIGlzIHNvcnQgb2YgYSBwdWIvc3ViIG1vZGVsIGluIGEgd2F5XHJcbiAgICAgICAgICogPHA+XHJcbiAgICAgICAgICogVGhlIHJlYXNvbiB0byByZXR1cm4gYSAncHJvbWlzZS5wcm9taXNlKCknIG1ldGhvZCBpcyBzbyBubyBvdGhlciBjb2RlIGNhbiBjYWxsIHJlc29sdmUvcmVqZWN0IGJ1dCBjYW5cclxuICAgICAgICAgKiBvbmx5IHJlYWN0IHRvIGEgZG9uZS9mYWlsL2NvbXBsZXRlLlxyXG4gICAgICAgICAqIDxwPlxyXG4gICAgICAgICAqIGRlZmVycmVkLndoZW4ocHJvbWlzZTEsIHByb21pc2UyKSBjcmVhdGVzIGEgbmV3IHByb21pc2UgdGhhdCBiZWNvbWVzICdyZXNvbHZlZCcgb25seSB3aGVuIGFsbCBwcm9taXNlc1xyXG4gICAgICAgICAqIGFyZSByZXNvbHZlZC4gSXQncyBhIGJpZyBcImFuZCBjb25kaXRpb25cIiBvZiByZXNvbHZlbWVudCwgYW5kIGlmIGFueSBvZiB0aGUgcHJvbWlzZXMgcGFzc2VkIHRvIGl0IGVuZCB1cFxyXG4gICAgICAgICAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlyb25SZXF1ZXN0LmNvbXBsZXRlcy50aGVuKC8vXHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGlyb25SZXF1ZXN0LnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIGlzIHVnbHkgYmVjYXVzZSBpdCBjb3ZlcnMgYWxsIGZvdXIgY2FzZXMgYmFzZWQgb24gdHdvIGJvb2xlYW5zLCBidXQgaXQncyBzdGlsbCB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIGFsd2F5cyBjYWxscyB3aXRoIHRoZSAncmVwb25zZScgcGFyYW0gYW5kIG9wdGlvbmFsbHkgYSBjYWxsYmFja1BheWxvYWQgcGFyYW0uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FuJ3Qgd2UganVzdCBsZXQgY2FsbGJhY2tQYXlsb2FkIGJlIHVuZGVmaW5lZCwgYW5kIGNhbGwgdGhlIGFib3ZlIGNhbGxiYWNrIG1ldGhvZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kIG5vdCBldmVuIGhhdmUgdGhpcyBlbHNlIGJsb2NrIGhlcmUgYXQgYWxsIChpLmUuIG5vdCBldmVuIGNoZWNrIGlmIGNhbGxiYWNrUGF5bG9hZCBpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsL3VuZGVmaW5lZCwgYnV0IGp1c3QgdXNlIGl0LCBhbmQgbm90IGhhdmUgdGhpcyBpZiBibG9jaz8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgaGFuZGxpbmcgcmVzdWx0IG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgRmFpbFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gdXRpbC5qc29uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXJvblJlcXVlc3Quc3RhdHVzID09IFwiNDAzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluIGRldGVjdGVkIGluIHV0aWwuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZsaW5lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGltZW91dE1lc3NhZ2VTaG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dE1lc3NhZ2VTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZXNzaW9uIHRpbWVkIG91dC4gUGFnZSB3aWxsIHJlZnJlc2guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1zZzogc3RyaW5nID0gXCJTZXJ2ZXIgcmVxdWVzdCBmYWlsZWQuXFxuXFxuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIGNhdGNoIGJsb2NrIHNob3VsZCBmYWlsIHNpbGVudGx5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiU3RhdHVzOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1c1RleHQgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJDb2RlOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1cyArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIHdhcyBzaG93aW5nIFwiY2xhc3NDYXN0RXhjZXB0aW9uXCIgd2hlbiBJIHRocmV3IGEgcmVndWxhciBcIkV4Y2VwdGlvblwiIGZyb20gc2VydmVyIHNvIGZvciBub3dcclxuICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5leGNlcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBpcm9uUmVxdWVzdDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ0FuZFRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgKyBcIlNUQUNLOiBcIiArIHN0YWNrKTtcclxuICAgICAgICB0aHJvdyBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbG9nQW5kUmVUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZywgZXhjZXB0aW9uOiBhbnkpIHtcclxuICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGFqYXhSZWFkeSA9IGZ1bmN0aW9uKHJlcXVlc3ROYW1lKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKF9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZ25vcmluZyByZXF1ZXN0czogXCIgKyByZXF1ZXN0TmFtZSArIFwiLiBBamF4IGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpc0FqYXhXYWl0aW5nID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIF9hamF4Q291bnRlciA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3QgYmUgYWN0dWFsIGpxdWVyeSBzZWxlY3RvcikgKi9cclxuICAgIGV4cG9ydCBsZXQgZGVsYXllZEZvY3VzID0gZnVuY3Rpb24oaWQpOiB2b2lkIHtcclxuICAgICAgICAvKiBzbyB1c2VyIHNlZXMgdGhlIGZvY3VzIGZhc3Qgd2UgdHJ5IGF0IC41IHNlY29uZHMgKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIC8qIHdlIHRyeSBhZ2FpbiBhIGZ1bGwgc2Vjb25kIGxhdGVyLiBOb3JtYWxseSBub3QgcmVxdWlyZWQsIGJ1dCBuZXZlciB1bmRlc2lyYWJsZSAqL1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJGb2N1c2luZyBJRDogXCIraWQpO1xyXG4gICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgIH0sIDEzMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBXZSBjb3VsZCBoYXZlIHB1dCB0aGlzIGxvZ2ljIGluc2lkZSB0aGUganNvbiBtZXRob2QgaXRzZWxmLCBidXQgSSBjYW4gZm9yc2VlIGNhc2VzIHdoZXJlIHdlIGRvbid0IHdhbnQgYVxyXG4gICAgICogbWVzc2FnZSB0byBhcHBlYXIgd2hlbiB0aGUganNvbiByZXNwb25zZSByZXR1cm5zIHN1Y2Nlc3M9PWZhbHNlLCBzbyB3ZSB3aWxsIGhhdmUgdG8gY2FsbCBjaGVja1N1Y2Nlc3MgaW5zaWRlXHJcbiAgICAgKiBldmVyeSByZXNwb25zZSBtZXRob2QgaW5zdGVhZCwgaWYgd2Ugd2FudCB0aGF0IHJlc3BvbnNlIHRvIHByaW50IGEgbWVzc2FnZSB0byB0aGUgdXNlciB3aGVuIGZhaWwgaGFwcGVucy5cclxuICAgICAqXHJcbiAgICAgKiByZXF1aXJlczogcmVzLnN1Y2Nlc3MgcmVzLm1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBjaGVja1N1Y2Nlc3MgPSBmdW5jdGlvbihvcEZyaWVuZGx5TmFtZSwgcmVzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcob3BGcmllbmRseU5hbWUgKyBcIiBmYWlsZWQ6IFwiICsgcmVzLm1lc3NhZ2UpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMuc3VjY2VzcztcclxuICAgIH1cclxuXHJcbiAgICAvKiBhZGRzIGFsbCBhcnJheSBvYmplY3RzIHRvIG9iaiBhcyBhIHNldCAqL1xyXG4gICAgZXhwb3J0IGxldCBhZGRBbGwgPSBmdW5jdGlvbihvYmosIGEpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibnVsbCBlbGVtZW50IGluIGFkZEFsbCBhdCBpZHg9XCIgKyBpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBudWxsT3JVbmRlZiA9IGZ1bmN0aW9uKG9iaik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFdlIGhhdmUgdG8gYmUgYWJsZSB0byBtYXAgYW55IGlkZW50aWZpZXIgdG8gYSB1aWQsIHRoYXQgd2lsbCBiZSByZXBlYXRhYmxlLCBzbyB3ZSBoYXZlIHRvIHVzZSBhIGxvY2FsXHJcbiAgICAgKiAnaGFzaHNldC10eXBlJyBpbXBsZW1lbnRhdGlvblxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGdldFVpZEZvcklkID0gZnVuY3Rpb24obWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgLyogbG9vayBmb3IgdWlkIGluIG1hcCAqL1xyXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1hcFtpZF07XHJcblxyXG4gICAgICAgIC8qIGlmIG5vdCBmb3VuZCwgZ2V0IG5leHQgbnVtYmVyLCBhbmQgYWRkIHRvIG1hcCAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIHVpZCA9IFwiXCIgKyBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICBtYXBbaWRdID0gdWlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZWxlbWVudEV4aXN0cyA9IGZ1bmN0aW9uKGlkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBUYWtlcyB0ZXh0YXJlYSBkb20gSWQgKCMgb3B0aW9uYWwpIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRUZXh0QXJlYVZhbEJ5SWQgPSBmdW5jdGlvbihpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGRlOiBIVE1MRWxlbWVudCA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kZSkudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZG9tRWxtID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgIGlmICh1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHBvbHkgPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcG9seUVsbSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgICAgICBpZiAodXRpbC5zdGFydHNXaXRoKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXRpbC5jb250YWlucyhpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFBvbHltZXIuZG9tKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcG9seUVsbU5vZGUgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgZSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgIHJldHVybiBlLm5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEdldHMgdGhlIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRSZXF1aXJlZEVsZW1lbnQgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgZSA9ICQoaWQpO1xyXG4gICAgICAgIGlmIChlID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpc09iamVjdCA9IGZ1bmN0aW9uKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoubGVuZ3RoICE9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjdXJyZW50VGltZU1pbGxpcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBlbXB0eVN0cmluZyA9IGZ1bmN0aW9uKHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF2YWwgfHwgdmFsLmxlbmd0aCA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gcG9seUVsbShpZCkubm9kZS52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICBleHBvcnQgbGV0IHNldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodmFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFsID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGVsbSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgZWxtLm5vZGUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbG0gIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGJpbmRFbnRlcktleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xyXG4gICAgICAgIGJpbmRLZXkoaWQsIGZ1bmMsIDEzKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGJpbmRLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnksIGtleUNvZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICQoaWQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5Q29kZSkgeyAvLyAxMz09ZW50ZXIga2V5IGNvZGVcclxuICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVtb3ZlZCBvbGRDbGFzcyBmcm9tIGVsZW1lbnQgYW5kIHJlcGxhY2VzIHdpdGggbmV3Q2xhc3MsIGFuZCBpZiBvbGRDbGFzcyBpcyBub3QgcHJlc2VudCBpdCBzaW1wbHkgYWRkc1xyXG4gICAgICogbmV3Q2xhc3MuIElmIG9sZCBjbGFzcyBleGlzdGVkLCBpbiB0aGUgbGlzdCBvZiBjbGFzc2VzLCB0aGVuIHRoZSBuZXcgY2xhc3Mgd2lsbCBub3cgYmUgYXQgdGhhdCBwb3NpdGlvbi4gSWZcclxuICAgICAqIG9sZCBjbGFzcyBkaWRuJ3QgZXhpc3QsIHRoZW4gbmV3IENsYXNzIGlzIGFkZGVkIGF0IGVuZCBvZiBjbGFzcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGNoYW5nZU9yQWRkQ2xhc3MgPSBmdW5jdGlvbihlbG06IHN0cmluZywgb2xkQ2xhc3M6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBlbG1lbWVudCA9ICQoZWxtKTtcclxuICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhvbGRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG5ld0NsYXNzLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZGlzcGxheXMgbWVzc2FnZSAobXNnKSBvZiBvYmplY3QgaXMgbm90IG9mIHNwZWNpZmllZCB0eXBlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdmVyaWZ5VHlwZSA9IGZ1bmN0aW9uKG9iajogYW55LCB0eXBlOiBhbnksIG1zZzogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNldEh0bWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAoY29udGVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGVsbSA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgdmFyIHBvbHlFbG0gPSBQb2x5bWVyLmRvbShlbG0pO1xyXG5cclxuICAgICAgICAvL0ZvciBQb2x5bWVyIDEuMC4wLCB5b3UgbmVlZCB0aGlzLi4uXHJcbiAgICAgICAgLy9wb2x5RWxtLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgcG9seUVsbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRQcm9wZXJ0eUNvdW50ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgdmFyIHByb3A7XHJcblxyXG4gICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBwcmludE9iamVjdCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHlbXCIgKyBjb3VudCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgKz0gayArIFwiICwgXCIgKyB2ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImVyclwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzICovXHJcbiAgICBleHBvcnQgbGV0IHByaW50S2V5cyA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgaWYgKCFrKSB7XHJcbiAgICAgICAgICAgICAgICBrID0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFsICs9ICcsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWwgKz0gaztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNYWtlcyBlbGVJZCBlbmFibGVkIGJhc2VkIG9uIHZpcyBmbGFnXHJcbiAgICAgKlxyXG4gICAgICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzZXRFbmFibGVtZW50ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgZW5hYmxlOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVuYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIE1ha2VzIGVsZUlkIHZpc2libGUgYmFzZWQgb24gdmlzIGZsYWdcclxuICAgICAqXHJcbiAgICAgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCB2aXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2aXMpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgJChlbG0pLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhpZGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgJChlbG0pLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogUHJvZ3JhbWF0aWNhbGx5IGNyZWF0ZXMgb2JqZWN0cyBieSBuYW1lLCBzaW1pbGFyIHRvIHdoYXQgSmF2YSByZWZsZWN0aW9uIGRvZXNcclxuXHJcbiAgICAqIGV4OiB2YXIgZXhhbXBsZSA9IEluc3RhbmNlTG9hZGVyLmdldEluc3RhbmNlPE5hbWVkVGhpbmc+KHdpbmRvdywgJ0V4YW1wbGVDbGFzcycsIGFyZ3MuLi4pO1xyXG4gICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiA8VD4oY29udGV4dDogT2JqZWN0LCBuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogVCB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShjb250ZXh0W25hbWVdLnByb3RvdHlwZSk7XHJcbiAgICAgICAgaW5zdGFuY2UuY29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIHJldHVybiA8VD5pbnN0YW5jZTtcclxuICAgIH1cclxufVxyXG5cbm5hbWVzcGFjZSBqY3JDbnN0IHtcclxuXHJcbiAgICBleHBvcnQgbGV0IENPTU1FTlRfQlk6IHN0cmluZyA9IFwiY29tbWVudEJ5XCI7XHJcbiAgICBleHBvcnQgbGV0IFBVQkxJQ19BUFBFTkQ6IHN0cmluZyA9IFwicHVibGljQXBwZW5kXCI7XHJcbiAgICBleHBvcnQgbGV0IFBSSU1BUllfVFlQRTogc3RyaW5nID0gXCJqY3I6cHJpbWFyeVR5cGVcIjtcclxuICAgIGV4cG9ydCBsZXQgUE9MSUNZOiBzdHJpbmcgPSBcInJlcDpwb2xpY3lcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IE1JWElOX1RZUEVTOiBzdHJpbmcgPSBcImpjcjptaXhpblR5cGVzXCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBFTUFJTF9DT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICBleHBvcnQgbGV0IEVNQUlMX1JFQ0lQOiBzdHJpbmcgPSBcInJlY2lwXCI7XHJcbiAgICBleHBvcnQgbGV0IEVNQUlMX1NVQkpFQ1Q6IHN0cmluZyA9IFwic3ViamVjdFwiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgQ1JFQVRFRDogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZFwiO1xyXG4gICAgZXhwb3J0IGxldCBDUkVBVEVEX0JZOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkQnlcIjtcclxuICAgIGV4cG9ydCBsZXQgQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgZXhwb3J0IGxldCBUQUdTOiBzdHJpbmcgPSBcInRhZ3NcIjtcclxuICAgIGV4cG9ydCBsZXQgVVVJRDogc3RyaW5nID0gXCJqY3I6dXVpZFwiO1xyXG4gICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRcIjtcclxuICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRF9CWTogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkQnlcIjtcclxuICAgIGV4cG9ydCBsZXQgSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQ6IHN0cmluZyA9IFwibWV0YTY0Ompzb25cIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IERJU0FCTEVfSU5TRVJUOiBzdHJpbmcgPSBcImRpc2FibGVJbnNlcnRcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IFVTRVI6IHN0cmluZyA9IFwidXNlclwiO1xyXG4gICAgZXhwb3J0IGxldCBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICBleHBvcnQgbGV0IEVNQUlMOiBzdHJpbmcgPSBcImVtYWlsXCI7XHJcbiAgICBleHBvcnQgbGV0IENPREU6IHN0cmluZyA9IFwiY29kZVwiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgIGV4cG9ydCBsZXQgQklOX0RBVEE6IHN0cmluZyA9IFwiamNyRGF0YVwiO1xyXG4gICAgZXhwb3J0IGxldCBCSU5fTUlNRTogc3RyaW5nID0gXCJqY3I6bWltZVR5cGVcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgZXhwb3J0IGxldCBJTUdfSEVJR0hUOiBzdHJpbmcgPSBcImltZ0hlaWdodFwiO1xyXG59XHJcblxubmFtZXNwYWNlIGF0dGFjaG1lbnQge1xyXG4gICAgLyogTm9kZSBiZWluZyB1cGxvYWRlZCB0byAqL1xyXG4gICAgZXhwb3J0IGxldCB1cGxvYWROb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21GaWxlRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcoKSkub3BlbigpO1xyXG5cclxuICAgICAgICAvKiBOb3RlOiBUbyBydW4gbGVnYWN5IHVwbG9hZGVyIGp1c3QgcHV0IHRoaXMgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIGhlcmUsIGFuZFxyXG4gICAgICAgIG5vdGhpbmcgZWxzZSBpcyByZXF1aXJlZC4gU2VydmVyIHNpZGUgcHJvY2Vzc2luZyBpcyBzdGlsbCBpbiBwbGFjZSBmb3IgaXRcclxuXHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgKi9cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5VcGxvYWRGcm9tVXJsRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGRlbGV0ZUF0dGFjaG1lbnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGUgQXR0YWNobWVudFwiLCBcIkRlbGV0ZSB0aGUgQXR0YWNobWVudCBvbiB0aGUgTm9kZT9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0LCBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZT4oXCJkZWxldGVBdHRhY2htZW50XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgbnVsbCwgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCB1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBhdHRhY2htZW50XCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlbW92ZUJpbmFyeUJ5VWlkKHVpZCk7XHJcbiAgICAgICAgICAgIC8vIGZvcmNlIHJlLXJlbmRlciBmcm9tIGxvY2FsIGRhdGEuXHJcbiAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxubmFtZXNwYWNlIGVkaXQge1xyXG5cclxuICAgIGV4cG9ydCBsZXQgY3JlYXRlTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIChuZXcgQ3JlYXRlTm9kZURsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGluc2VydEJvb2tSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnRCb29rUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEJvb2tSZXNwb25zZSBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRlbGV0ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZSwgcGF5bG9hZDogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlID0gcGF5bG9hZFtcInBvc3REZWxldGVTZWxOb2RlXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IHNlbE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIGhpZ2hsaWdodElkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRWRpdGluZyBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIFwicmVwOlwiKSB8fCAvKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/ICovXG4gICAgICAgICAgICAgICAgdXRpbC5jb250YWlucyhub2RlLnBhdGgsIFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICAvKiBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlIGFuZCB3ZSBhcmUgdGhlIGNvbW1lbnRlciAqL1xyXG4gICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBTZXJ2ZXIgd2lsbCBoYXZlIHNlbnQgdXMgYmFjayB0aGUgcmF3IHRleHQgY29udGVudCwgdGhhdCBzaG91bGQgYmUgbWFya2Rvd24gaW5zdGVhZCBvZiBhbnkgSFRNTCwgc29cclxuICAgICAgICAgICAgICAgICAqIHRoYXQgd2UgY2FuIGRpc3BsYXkgdGhpcyBhbmQgc2F2ZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGUgPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgY2Fubm90IGVkaXQgbm9kZXMgdGhhdCB5b3UgZG9uJ3Qgb3duLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBtb3ZlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Nb3ZlTm9kZXNSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIk1vdmUgbm9kZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBub2Rlc1RvTW92ZSA9IG51bGw7IC8vIHJlc2V0XHJcbiAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0ID0ge307XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2Ugbm9kZSBwb3NpdGlvblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2hvd1JlYWRPbmx5UHJvcGVydGllczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvKlxyXG4gICAgICogTm9kZSBJRCBhcnJheSBvZiBub2RlcyB0aGF0IGFyZSByZWFkeSB0byBiZSBtb3ZlZCB3aGVuIHVzZXIgY2xpY2tzICdGaW5pc2ggTW92aW5nJ1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qIHRvZG8tMTogbmVlZCB0byBmaW5kIG91dCBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0byBkbyBhbiBvcmRlcmVkIHNldCBpbiBqYXZhc2NyaXB0IHNvIEkgZG9uJ3QgbmVlZFxyXG4gICAgYm90aCBub2Rlc1RvTW92ZSBhbmQgbm9kZXNUb01vdmVTZXRcclxuICAgICovXHJcbiAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlU2V0OiBPYmplY3QgPSB7fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHBhcmVudE9mTmV3Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIGluZGljYXRlcyBlZGl0b3IgaXMgZGlzcGxheWluZyBhIG5vZGUgdGhhdCBpcyBub3QgeWV0IHNhdmVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBlZGl0aW5nVW5zYXZlZE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbm9kZSAoTm9kZUluZm8uamF2YSkgdGhhdCBpcyBiZWluZyBjcmVhdGVkIHVuZGVyIHdoZW4gbmV3IG5vZGUgaXMgY3JlYXRlZFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBOb2RlIGJlaW5nIGVkaXRlZFxyXG4gICAgICpcclxuICAgICAqIHRvZG8tMjogdGhpcyBhbmQgc2V2ZXJhbCBvdGhlciB2YXJpYWJsZXMgY2FuIG5vdyBiZSBtb3ZlZCBpbnRvIHRoZSBkaWFsb2cgY2xhc3M/IElzIHRoYXQgZ29vZCBvciBiYWRcclxuICAgICAqIGNvdXBsaW5nL3Jlc3BvbnNpYmlsaXR5P1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGVkaXROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAvKiBJbnN0YW5jZSBvZiBFZGl0Tm9kZURpYWxvZzogRm9yIG5vdyBjcmVhdGluZyBuZXcgb25lIGVhY2ggdGltZSAqL1xyXG4gICAgZXhwb3J0IGxldCBlZGl0Tm9kZURsZ0luc3Q6IEVkaXROb2RlRGxnID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogdHlwZT1Ob2RlSW5mby5qYXZhXHJcbiAgICAgKlxyXG4gICAgICogV2hlbiBpbnNlcnRpbmcgYSBuZXcgbm9kZSwgdGhpcyBob2xkcyB0aGUgbm9kZSB0aGF0IHdhcyBjbGlja2VkIG9uIGF0IHRoZSB0aW1lIHRoZSBpbnNlcnQgd2FzIHJlcXVlc3RlZCwgYW5kXHJcbiAgICAgKiBpcyBzZW50IHRvIHNlcnZlciBmb3Igb3JkaW5hbCBwb3NpdGlvbiBhc3NpZ25tZW50IG9mIG5ldyBub2RlLiBBbHNvIGlmIHRoaXMgdmFyIGlzIG51bGwsIGl0IGluZGljYXRlcyB3ZSBhcmVcclxuICAgICAqIGNyZWF0aW5nIGluIGEgJ2NyZWF0ZSB1bmRlciBwYXJlbnQnIG1vZGUsIHZlcnN1cyBub24tbnVsbCBtZWFuaW5nICdpbnNlcnQgaW5saW5lJyB0eXBlIG9mIGluc2VydC5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgbm9kZUluc2VydFRhcmdldDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICBleHBvcnQgbGV0IGlzRWRpdEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBub2RlLnBhdGggIT0gXCIvXCIgJiZcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogQ2hlY2sgdGhhdCBpZiB3ZSBoYXZlIGEgY29tbWVudEJ5IHByb3BlcnR5IHdlIGFyZSB0aGUgY29tbWVudGVyLCBiZWZvcmUgYWxsb3dpbmcgZWRpdCBidXR0b24gYWxzby5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICghcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpIHx8IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKSkgLy9cclxuICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGJlc3Qgd2UgY2FuIGRvIGhlcmUgaXMgYWxsb3cgdGhlIGRpc2FibGVJbnNlcnQgcHJvcCB0byBiZSBhYmxlIHRvIHR1cm4gdGhpbmdzIG9mZiwgbm9kZSBieSBub2RlICovXHJcbiAgICBleHBvcnQgbGV0IGlzSW5zZXJ0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5ESVNBQkxFX0lOU0VSVCwgbm9kZSkgPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGUgPSBmdW5jdGlvbih0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcbiAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZyh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgICAgIGVkaXROb2RlRGxnSW5zdC5zYXZlTmV3Tm9kZShcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogY2FsbGVkIHRvIGRpc3BsYXkgZWRpdG9yIHRoYXQgd2lsbCBjb21lIHVwIEJFRk9SRSBhbnkgbm9kZSBpcyBzYXZlZCBvbnRvIHRoZSBzZXJ2ZXIsIHNvIHRoYXQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqIGFueSBzYXZlIGlzIHBlcmZvcm1lZCB3ZSB3aWxsIGhhdmUgdGhlIGNvcnJlY3Qgbm9kZSBuYW1lLCBhdCBsZWFzdC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHZlcnNpb24gaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQsIGFuZCBjdXJyZW50bHkgdGhpcyBtZWFucyAnZWRpdGluZ1Vuc2F2ZWROb2RlJyBpcyBub3QgY3VycmVudGx5IGV2ZXJcclxuICAgICAqIHRyaWdnZXJlZC4gVGhlIG5ldyBhcHByb2FjaCBub3cgdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvICdyZW5hbWUnIG5vZGVzIGlzIHRvIGp1c3QgY3JlYXRlIG9uZSB3aXRoIGFcclxuICAgICAqIHJhbmRvbSBuYW1lIGFuIGxldCB1c2VyIHN0YXJ0IGVkaXRpbmcgcmlnaHQgYXdheSBhbmQgdGhlbiByZW5hbWUgdGhlIG5vZGUgSUYgYSBjdXN0b20gbm9kZSBuYW1lIGlzIG5lZWRlZC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIG1lYW5zIGlmIHdlIGNhbGwgdGhpcyBmdW5jdGlvbiAoc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lKSBpbnN0ZWFkIG9mICdzdGFydEVkaXRpbmdOZXdOb2RlKCknXHJcbiAgICAgKiB0aGF0IHdpbGwgY2F1c2UgdGhlIEdVSSB0byBhbHdheXMgcHJvbXB0IGZvciB0aGUgbm9kZSBuYW1lIGJlZm9yZSBjcmVhdGluZyB0aGUgbm9kZS4gVGhpcyB3YXMgdGhlIG9yaWdpbmFsXHJcbiAgICAgKiBmdW5jdGlvbmFsaXR5IGFuZCBzdGlsbCB3b3Jrcy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDcmVhdGUgc3Vibm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2F2ZU5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5TYXZlTm9kZVJlc3BvbnNlLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAvKiBiZWNhc3VzZSBJIGRvbid0IHVuZGVyc3RhbmQgJ2VkaXRpbmdVbnNhdmVkTm9kZScgdmFyaWFibGUgYW55IGxvbmdlciB1bnRpbCBpIHJlZnJlc2ggbXkgbWVtb3J5LCBpIHdpbGwgdXNlXHJcbiAgICAgICAgICAgIHRoZSBvbGQgYXBwcm9hY2ggb2YgcmVmcmVzaGluZyBlbnRpcmUgdHJlZSByYXRoZXIgdGhhbiBtb3JlIGVmZmljaWVudCByZWZyZXNuTm9kZU9uUGFnZSwgYmVjdWFzZSBpdCByZXF1aXJlc1xyXG4gICAgICAgICAgICB0aGUgbm9kZSB0byBhbHJlYWR5IGJlIG9uIHRoZSBwYWdlLCBhbmQgdGhpcyByZXF1aXJlcyBpbiBkZXB0aCBhbmFseXMgaSdtIG5vdCBnb2luZyB0byBkbyByaWdodCB0aGlzIG1pbnV0ZS5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy9yZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGUpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZWRpdE1vZGUgPSBmdW5jdGlvbihtb2RlVmFsPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbW9kZVZhbCAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbW9kZVZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0b2RvLTM6IHJlYWxseSBlZGl0IG1vZGUgYnV0dG9uIG5lZWRzIHRvIGJlIHNvbWUga2luZCBvZiBidXR0b25cclxuICAgICAgICAvLyB0aGF0IGNhbiBzaG93IGFuIG9uL29mZiBzdGF0ZS5cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU2luY2UgZWRpdCBtb2RlIHR1cm5zIG9uIGxvdHMgb2YgYnV0dG9ucywgdGhlIGxvY2F0aW9uIG9mIHRoZSBub2RlIHdlIGFyZSB2aWV3aW5nIGNhbiBjaGFuZ2Ugc28gbXVjaCBpdFxyXG4gICAgICAgICAqIGdvZXMgY29tcGxldGVseSBvZmZzY3JlZW4gb3V0IG9mIHZpZXcsIHNvIHdlIHNjcm9sbCBpdCBiYWNrIGludG8gdmlldyBldmVyeSB0aW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG5cclxuICAgICAgICBtZXRhNjQuc2F2ZVVzZXJQcmVmZXJlbmNlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVVcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IFwiW25vZGVBYm92ZV1cIlxyXG4gICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtb3ZlTm9kZURvd24gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCJbbm9kZUJlbG93XVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbm9kZS5uYW1lXHJcbiAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Ub3AgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBcIlt0b3BOb2RlXVwiXHJcbiAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Cb3R0b20gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdGhlIG5vZGUgYWJvdmUgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIHRvcCBub2RlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUFib3ZlID0gZnVuY3Rpb24obm9kZSk6IGFueSB7XHJcbiAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgIGlmIChvcmRpbmFsIDw9IDApXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9kZSBiZWxvdyB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgYm90dG9tIG5vZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXROb2RlQmVsb3cgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvcmRpbmFsID0gXCIgKyBvcmRpbmFsKTtcclxuICAgICAgICBpZiAob3JkaW5hbCA9PSAtMSB8fCBvcmRpbmFsID49IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgKyAxXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldEZpcnN0Q2hpbGROb2RlID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcnVuRWRpdE5vZGUgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVua25vd24gbm9kZUlkIGluIGVkaXROb2RlQ2xpY2s6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB1dGlsLmpzb248anNvbi5Jbml0Tm9kZUVkaXRSZXF1ZXN0LCBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlPihcImluaXROb2RlRWRpdFwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICB9LCBpbml0Tm9kZUVkaXRSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnNlcnROb2RlID0gZnVuY3Rpb24odWlkPzogYW55LCB0eXBlTmFtZT86IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIHBhcmVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHN0YXJ0RWRpdGluZ05ld05vZGUodHlwZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nLCBjcmVhdGVBdFRvcD86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSksIG9yIGFueSBzZWxlY3RlZFxyXG4gICAgICAgICAqIG5vZGUgaWYgdGhlcmUgaXMgYSBzZWxlY3RlZCBub2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHROb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gaGlnaGxpZ2h0Tm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gY3JlYXRlU3ViTm9kZTogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRoaXMgaW5kaWNhdGVzIHdlIGFyZSBOT1QgaW5zZXJ0aW5nIGlubGluZS4gQW4gaW5saW5lIGluc2VydCB3b3VsZCBhbHdheXMgaGF2ZSBhIHRhcmdldC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKHR5cGVOYW1lLCBjcmVhdGVBdFRvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCByZXBseVRvQ29tbWVudCA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY3JlYXRlU3ViTm9kZSh1aWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3Rpb25zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIGNvdWxkIHdyaXRlIGNvZGUgdGhhdCBvbmx5IHNjYW5zIGZvciBhbGwgdGhlIFwiU0VMXCIgYnV0dG9ucyBhbmQgdXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlbSwgYnV0IGZvciBub3dcclxuICAgICAgICAgKiB3ZSB0YWtlIHRoZSBzaW1wbGUgYXBwcm9hY2ggYW5kIGp1c3QgcmUtcmVuZGVyIHRoZSBwYWdlLiBUaGVyZSBpcyBubyBjYWxsIHRvIHRoZSBzZXJ2ZXIsIHNvIHRoaXMgaXNcclxuICAgICAgICAgKiBhY3R1YWxseSB2ZXJ5IGVmZmljaWVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBEZWxldGUgdGhlIHNpbmdsZSBub2RlIGlkZW50aWZpZWQgYnkgJ3VpZCcgcGFyYW1ldGVyIGlmIHVpZCBwYXJhbWV0ZXIgaXMgcGFzc2VkLCBhbmQgaWYgdWlkIHBhcmFtZXRlciBpcyBub3RcclxuICAgICAqIHBhc3NlZCB0aGVuIHVzZSB0aGUgbm9kZSBzZWxlY3Rpb25zIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25zIG9uIHRoZSBwYWdlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGRlbGV0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gZGVsZXRlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSA/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvc3REZWxldGVTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlTm9kZXNSZXF1ZXN0LCBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2U+KFwiZGVsZXRlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBzZWxOb2Rlc0FycmF5XHJcbiAgICAgICAgICAgICAgICB9LCBkZWxldGVOb2Rlc1Jlc3BvbnNlLCBudWxsLCB7IFwicG9zdERlbGV0ZVNlbE5vZGVcIjogcG9zdERlbGV0ZVNlbE5vZGUgfSk7XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogR2V0cyB0aGUgbm9kZSB3ZSB3YW50IHRvIHNjcm9sbCB0byBhZnRlciBhIGRlbGV0ZSAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRCZXN0UG9zdERlbGV0ZVNlbE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAvKiBVc2UgYSBoYXNobWFwLXR5cGUgYXBwcm9hY2ggdG8gc2F2aW5nIGFsbCBzZWxlY3RlZCBub2RlcyBpbnRvIGEgbG9vdXAgbWFwICovXHJcbiAgICAgICAgbGV0IG5vZGVzTWFwOiBPYmplY3QgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCgpO1xyXG4gICAgICAgIGxldCBiZXN0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgbGV0IHRha2VOZXh0Tm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBub3cgd2Ugc2NhbiB0aGUgY2hpbGRyZW4sIGFuZCB0aGUgbGFzdCBjaGlsZCB3ZSBlbmNvdW50ZXJkIHVwIHVudGlsIHdlIGZpbmQgdGhlIHJpc3Qgb25lbiBpbiBub2Rlc01hcCB3aWxsIGJlIHRoZVxyXG4gICAgICAgIG5vZGUgd2Ugd2lsbCB3YW50IHRvIHNlbGVjdCBhbmQgc2Nyb2xsIHRoZSB1c2VyIHRvIEFGVEVSIHRoZSBkZWxldGluZyBpcyBkb25lICovXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YWtlTmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBpcyB0aGlzIG5vZGUgb25lIHRvIGJlIGRlbGV0ZWQgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVzTWFwW25vZGUuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICB0YWtlTmV4dE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYmVzdE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBiZXN0Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGN1dFNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgIFwiQ29uZmlybSBDdXRcIixcclxuICAgICAgICAgICAgXCJDdXQgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocyksIHRvIHBhc3RlL21vdmUgdG8gbmV3IGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgXCJZZXNcIixcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IHNlbE5vZGVzQXJyYXk7XHJcbiAgICAgICAgICAgICAgICBsb2FkTm9kZXNUb01vdmVTZXQoc2VsTm9kZXNBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAvKiB0b2RvLTA6IG5lZWQgdG8gaGF2ZSBhIHdheSB0byBmaW5kIGFsbCBzZWxlY3RlZCBjaGVja2JveGVzIGluIHRoZSBndWkgYW5kIHJlc2V0IHRoZW0gYWxsIHRvIHVuY2hlY2tlZCAqL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTsgLy8gY2xlYXIgc2VsZWN0aW9ucy5cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBub3cgd2UgcmVuZGVyIGFnYWluIGFuZCB0aGUgbm9kZXMgdGhhdCB3ZXJlIGN1dCB3aWxsIGRpc2FwcGVhciBmcm9tIHZpZXcgKi9cclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBsb2FkTm9kZXNUb01vdmVTZXQgPSBmdW5jdGlvbihub2RlSWRzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIG5vZGVzVG9Nb3ZlU2V0ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xyXG4gICAgICAgICAgICBub2Rlc1RvTW92ZVNldFtpZF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHBhc3RlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFBhc3RlXCIsIFwiUGFzdGUgXCIgKyBub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHVuZGVyIHNlbGVjdGVkIHBhcmVudCBub2RlID9cIixcclxuICAgICAgICAgICAgXCJZZXMsIHBhc3RlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICogcGFnZS4gTGF0ZXIgb24gd2UgY2FuIGdldCBtb3JlIHNwZWNpZmljIGFib3V0IGFsbG93aW5nIHByZWNpc2UgZGVzdGluYXRpb24gbG9jYXRpb24gZm9yIG1vdmVkXHJcbiAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTW92ZU5vZGVzUmVxdWVzdCwganNvbi5Nb3ZlTm9kZXNSZXNwb25zZT4oXCJtb3ZlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Tm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRDaGlsZElkXCI6IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCA/IGhpZ2hsaWdodE5vZGUuaWQgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBub2Rlc1RvTW92ZVxyXG4gICAgICAgICAgICAgICAgfSwgbW92ZU5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zZXJ0Qm9va1dhckFuZFBlYWNlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybVwiLCBcIkluc2VydCBib29rIFdhciBhbmQgUGVhY2U/PHAvPldhcm5pbmc6IFlvdSBzaG91bGQgaGF2ZSBhbiBFTVBUWSBub2RlIHNlbGVjdGVkIG5vdywgdG8gc2VydmUgYXMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgYm9vayFcIiwgXCJZZXMsIGluc2VydCBib29rLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGluc2VydGluZyB1bmRlciB3aGF0ZXZlciBub2RlIHVzZXIgaGFzIGZvY3VzZWQgKi9cclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbnNlcnRCb29rUmVxdWVzdCwganNvbi5JbnNlcnRCb29rUmVzcG9uc2U+KFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgfSwgaW5zZXJ0Qm9va1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxuXG5uYW1lc3BhY2UgbWV0YTY0IHtcclxuXHJcbiAgICBleHBvcnQgbGV0IGFwcEluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgZXhwb3J0IGxldCBjdXJVcmxQYXRoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgZXhwb3J0IGxldCB1cmxDbWQ6IHN0cmluZztcclxuICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgY29kZUZvcm1hdERpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICBleHBvcnQgbGV0IG5leHRHdWlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qIG5hbWUgb2YgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyICovXHJcbiAgICBleHBvcnQgbGV0IHVzZXJOYW1lOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG5cclxuICAgIC8qIHNjcmVlbiBjYXBhYmlsaXRpZXMgKi9cclxuICAgIGV4cG9ydCBsZXQgZGV2aWNlV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICBleHBvcnQgbGV0IGRldmljZUhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVXNlcidzIHJvb3Qgbm9kZS4gVG9wIGxldmVsIG9mIHdoYXQgbG9nZ2VkIGluIHVzZXIgaXMgYWxsb3dlZCB0byBzZWUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVJZDogc3RyaW5nID0gXCJcIjtcclxuICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVQYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGlzQWRtaW5Vc2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogYWx3YXlzIHN0YXJ0IG91dCBhcyBhbm9uIHVzZXIgdW50aWwgbG9naW4gKi9cclxuICAgIGV4cG9ydCBsZXQgaXNBbm9uVXNlcjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBleHBvcnQgbGV0IGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG4gICAgZXhwb3J0IGxldCBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogc2lnbmFscyB0aGF0IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHRoZSBuZXh0IHRpbWUgd2UgZ28gdG8gdGhlIG1haW4gdHJlZSB2aWV3IHdpbmRvdyB3ZSBuZWVkIHRvIHJlZnJlc2ggZGF0YVxyXG4gICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdHJlZURpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICpcclxuICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLmlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICBleHBvcnQgbGV0IGFjZUVkaXRvcnNCeUlkOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBjb3VudGVyIGZvciBsb2NhbCB1aWRzICovXHJcbiAgICBleHBvcnQgbGV0IG5leHRVaWQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKiBVc2VyLXNlbGVjdGFibGUgdXNlci1hY2NvdW50IG9wdGlvbnMgZWFjaCB1c2VyIGNhbiBzZXQgb24gaGlzIGFjY291bnQgKi9cclxuICAgIGV4cG9ydCBsZXQgTU9ERV9BRFZBTkNFRDogc3RyaW5nID0gXCJhZHZhbmNlZFwiO1xyXG4gICAgZXhwb3J0IGxldCBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAvKiBjYW4gYmUgJ3NpbXBsZScgb3IgJ2FkdmFuY2VkJyAqL1xyXG4gICAgZXhwb3J0IGxldCBlZGl0TW9kZU9wdGlvbjogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgICogdG9nZ2xlZCBieSBidXR0b24sIGFuZCBob2xkcyBpZiB3ZSBhcmUgZ29pbmcgdG8gc2hvdyBwcm9wZXJ0aWVzIG9yIG5vdCBvbiBlYWNoIG5vZGUgaW4gdGhlIG1haW4gdmlld1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHNob3dQcm9wZXJ0aWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogRmxhZyB0aGF0IGluZGljYXRlcyBpZiB3ZSBhcmUgcmVuZGVyaW5nIHBhdGgsIG93bmVyLCBtb2RUaW1lLCBldGMuIG9uIGVhY2ggcm93ICovXHJcbiAgICBleHBvcnQgbGV0IHNob3dNZXRhRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaXN0IG9mIG5vZGUgcHJlZml4ZXMgdG8gZmxhZyBub2RlcyB0byBub3QgYWxsb3cgdG8gYmUgc2hvd24gaW4gdGhlIHBhZ2UgaW4gc2ltcGxlIG1vZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdDogYW55ID0ge1xyXG4gICAgICAgIFwicmVwOlwiOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHJlYWRPbmx5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IGJpbmFyeVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgYWxsIG5vZGUgdWlkcyB0byB0cnVlIGlmIHNlbGVjdGVkLCBvdGhlcndpc2UgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBkZWxldGVkIChub3QgZXhpc3RpbmcpXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgLyogU2V0IG9mIGFsbCBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZCAoZnJvbSB0aGUgYWJicmV2aWF0ZWQgZm9ybSkgKi9cclxuICAgIGV4cG9ydCBsZXQgZXhwYW5kZWRBYmJyZXZOb2RlSWRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVEYXRhOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBhbGwgdmFyaWFibGVzIGRlcml2YWJsZSBmcm9tIGN1cnJlbnROb2RlRGF0YSwgYnV0IHN0b3JlZCBkaXJlY3RseSBmb3Igc2ltcGxlciBjb2RlL2FjY2Vzc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlSWQ6IGFueSA9IG51bGw7XHJcbiAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlUGF0aDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiBNYXBzIGZyb20gZ3VpZCB0byBEYXRhIE9iamVjdCAqL1xyXG4gICAgZXhwb3J0IGxldCBkYXRhT2JqTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcbiAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcblxyXG4gICAgZXhwb3J0IGxldCB1c2VyUHJlZmVyZW5jZXM6IGpzb24uVXNlclByZWZlcmVuY2VzID0ge1xyXG4gICAgICAgIFwiZWRpdE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJsYXN0Tm9kZVwiOiBcIlwiLFxyXG4gICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgXCJzaG93TWV0YURhdGFcIjogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgZXhwb3J0IGxldCB1cGRhdGVNYWluTWVudVBhbmVsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidWlsZGluZyBtYWluIG1lbnUgcGFuZWxcIik7XHJcbiAgICAgICAgbWVudVBhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICogZnV0dXJlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHJlZ2lzdGVyRGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBpZiAoIWRhdGEuZ3VpZCkge1xyXG4gICAgICAgICAgICBkYXRhLmd1aWQgPSArK25leHRHdWlkO1xyXG4gICAgICAgICAgICBkYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldE9iamVjdEJ5R3VpZCA9IGZ1bmN0aW9uKGd1aWQpIHtcclxuICAgICAgICB2YXIgcmV0ID0gZGF0YU9iak1hcFtndWlkXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBjYWxsYmFjayBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIHNjcmlwdCB0byBydW4sIG9yIGlmIGl0J3MgYSBmdW5jdGlvbiBvYmplY3QgdGhhdCB3aWxsIGJlXHJcbiAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICpcclxuICAgICAqIFdoZW5ldmVyIHdlIGFyZSBidWlsZGluZyBhbiBvbkNsaWNrIHN0cmluZywgYW5kIHdlIGhhdmUgdGhlIGFjdHVhbCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gdGhlIG5hbWUgb2YgdGhlXHJcbiAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAqIHRvIHRoZSBmdW5jdGlvbiBvYmplY3QsIGFuZCB0aGVuIGVuY29kZSBhIGNhbGwgdG8gcnVuIHRoYXQgZ3VpZCBieSBjYWxsaW5nIHJ1bkNhbGxiYWNrLiBUaGVyZSBpcyBhIGxldmVsIG9mXHJcbiAgICAgKiBpbmRpcmVjdGlvbiBoZXJlLCBidXQgdGhpcyBpcyB0aGUgc2ltcGxlc3QgYXBwcm9hY2ggd2hlbiB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gbWFwIGZyb20gYSBzdHJpbmcgdG8gYVxyXG4gICAgICogZnVuY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogY3R4PWNvbnRleHQsIHdoaWNoIGlzIHRoZSAndGhpcycgdG8gY2FsbCB3aXRoIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiwgYW5kIGhhdmUgYSAndGhpcycgY29udGV4dCB0byBiaW5kIHRvIGl0LlxyXG4gICAgICpcclxuICAgICAqIHBheWxvYWQgaXMgYW55IGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gYmUgcGFzc2VkIGF0IHJ1bnRpbWVcclxuICAgICAqXHJcbiAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBlbmNvZGVPbkNsaWNrID0gZnVuY3Rpb24oY2FsbGJhY2s6IGFueSwgY3R4PzogYW55LCBwYXlsb2FkPzogYW55LCBkZWxheUNhbGxiYWNrPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgICAgICB9IC8vXHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QocGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF5bG9hZFN0ciA9IHBheWxvYWQgPyBwYXlsb2FkLmd1aWQgOiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogd2h5IGlzbid0IHBheWxvYWRTdHIgaW4gcXVvdGVzPyBJdCB3YXMgbGlrZSB0aGlzIGV2ZW4gYmVmb3JlIHN3aXRjaGluZyB0byBiYWNrdGljayBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBgbWV0YTY0LnJ1bkNhbGxiYWNrKCR7Y2FsbGJhY2suZ3VpZH0sJHtjdHguZ3VpZH0sJHtwYXlsb2FkU3RyfSwke2RlbGF5Q2FsbGJhY2t9KTtgO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGBtZXRhNjQucnVuQ2FsbGJhY2soJHtjYWxsYmFjay5ndWlkfSxudWxsLG51bGwsJHtkZWxheUNhbGxiYWNrfSk7YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJ1bmV4cGVjdGVkIGNhbGxiYWNrIHR5cGUgaW4gZW5jb2RlT25DbGlja1wiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHJ1bkNhbGxiYWNrID0gZnVuY3Rpb24oZ3VpZCwgY3R4LCBwYXlsb2FkLCBkZWxheUNhbGxiYWNrPzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjYWxsYmFjayBydW46IFwiICsgZGVsYXlDYWxsYmFjayk7XHJcbiAgICAgICAgLyogZGVwZW5kaW5nIG9uIGRlbGF5Q2FsbGJhY2ssIHJ1biB0aGUgY2FsbGJhY2sgZWl0aGVyIGltbWVkaWF0ZWx5IG9yIHdpdGggYSBkZWxheSAqL1xyXG4gICAgICAgIGlmIChkZWxheUNhbGxiYWNrID4gMCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgfSwgZGVsYXlDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBydW5DYWxsYmFja0ltbWVkaWF0ZSA9IGZ1bmN0aW9uKGd1aWQsIGN0eCwgcGF5bG9hZCkge1xyXG4gICAgICAgIHZhciBkYXRhT2JqID0gZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gZ2V0T2JqZWN0QnlHdWlkKGN0eCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF5bG9hZE9iaiA9IHBheWxvYWQgPyBnZXRPYmplY3RCeUd1aWQocGF5bG9hZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsKHRoaXosIHBheWxvYWRPYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iaigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJ1bmFibGUgdG8gZmluZCBjYWxsYmFjayBvbiByZWdpc3RlcmVkIGd1aWQ6IFwiICsgZ3VpZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gZWRpdE1vZGVPcHRpb24gPT09IE1PREVfU0lNUExFO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGdvVG9NYWluUGFnZSh0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdvVG9NYWluUGFnZSA9IGZ1bmN0aW9uKHJlcmVuZGVyPzogYm9vbGVhbiwgZm9yY2VTZXJ2ZXJSZWZyZXNoPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoZm9yY2VTZXJ2ZXJSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVyZW5kZXIgfHwgdHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICh0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2VsZWN0VGFiID0gZnVuY3Rpb24ocGFnZU5hbWUpOiB2b2lkIHtcclxuICAgICAgICB2YXIgaXJvblBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICg8X0hhc1NlbGVjdD5pcm9uUGFnZXMpLnNlbGVjdChwYWdlTmFtZSk7XHJcblxyXG4gICAgICAgIC8qIHRoaXMgY29kZSBjYW4gYmUgbWFkZSBtb3JlIERSWSwgYnV0IGknbSBqdXN0IHRyeWluZyBpdCBvdXQgZm9yIG5vdywgc28gaSdtIG5vdCBib3RoZXJpbmcgdG8gcGVyZmVjdCBpdCB5ZXQuICovXHJcbiAgICAgICAgLy8gJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAvLyAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgLy8gJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAocGFnZU5hbWUgPT0gJ21haW5UYWJOYW1lJykge1xyXG4gICAgICAgIC8vICAgICAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3NlYXJjaFRhYk5hbWUnKSB7XHJcbiAgICAgICAgLy8gICAgICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICd0aW1lbGluZVRhYk5hbWUnKSB7XHJcbiAgICAgICAgLy8gICAgICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIElmIGRhdGEgKGlmIHByb3ZpZGVkKSBtdXN0IGJlIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgZGlhbG9nLCBhbmQgYWxsIHRoZSBkaWFsb2dcclxuICAgICAqIG1ldGhvZHMgYXJlIG9mIGNvdXJzZSBzaW5nbGV0b25zIHRoYXQgYWNjZXB0IHRoaXMgZGF0YSBwYXJhbWV0ZXIgZm9yIGFueSBvcHRlcmF0aW9ucy4gKG9sZHNjaG9vbCB3YXkgb2YgZG9pbmdcclxuICAgICAqIE9PUCB3aXRoICd0aGlzJyBiZWluZyBmaXJzdCBwYXJhbWV0ZXIgYWx3YXlzKS5cclxuICAgICAqXHJcbiAgICAgKiBOb3RlOiBlYWNoIGRhdGEgaW5zdGFuY2UgaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIGd1aWQgbnVtYmVyaWMgcHJvcGVydHksIHVuaXF1ZSB0byBpdC5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgY2hhbmdlUGFnZSA9IGZ1bmN0aW9uKHBnPzogYW55LCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwZy50YWJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvb3BzLCB3cm9uZyBvYmplY3QgdHlwZSBwYXNzZWQgdG8gY2hhbmdlUGFnZSBmdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHVzaW5nIG1haW5Jcm9uUGFnZXM/PyAqL1xyXG4gICAgICAgIHZhciBwYXBlclRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7IC8vXCIjbWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAoPF9IYXNTZWxlY3Q+cGFwZXJUYWJzKS5zZWxlY3QocGcudGFiSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaXNOb2RlQmxhY2tMaXN0ZWQgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFpblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgcHJvcDtcclxuICAgICAgICBmb3IgKHByb3AgaW4gc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QpIHtcclxuICAgICAgICAgICAgaWYgKHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlVWlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBzZWxBcnJheTogc3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2godWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBSZXR1cm5zIGEgbmV3bHkgY2xvbmVkIGFycmF5IG9mIGFsbCB0aGUgc2VsZWN0ZWQgbm9kZXMgZWFjaCB0aW1lIGl0J3MgY2FsbGVkLlxyXG4gICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkgPSBmdW5jdGlvbigpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgbGV0IHNlbEFycmF5OiBzdHJpbmdbXSA9IFtdLCB1aWQ7XHJcblxyXG4gICAgICAgIGlmICghc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHNlbGVjdGVkIG5vZGVzLlwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2gobm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHJldHVybiBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGZvciBlYWNoIE5vZGVJbmZvIHdoZXJlIHRoZSBrZXkgaXMgdGhlIGlkICovXHJcbiAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQgPSBmdW5jdGlvbigpOiBPYmplY3Qge1xyXG4gICAgICAgIGxldCByZXQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gdGhpcy5nZXRTZWxlY3RlZE5vZGVzQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJldFtzZWxBcnJheVtpXS5pZF0gPSBzZWxBcnJheVtpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBHZXRzIHNlbGVjdGVkIG5vZGVzIGFzIE5vZGVJbmZvLmphdmEgb2JqZWN0cyBhcnJheSAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXJyYXkgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvW10ge1xyXG4gICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gW107XHJcbiAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3RlZE5vZGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm9SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcywgbm9kZSkge1xyXG4gICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgbWluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAocmVzLm93bmVycykge1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gb3duZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbm9kZS5vd25lciA9IG93bmVyQnVmO1xyXG4gICAgICAgICAgICBsZXQgZWxtSWQgPSBcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkO1xyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChlbG1JZCk7XHJcbiAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbUlkLCBcImNyZWF0ZWQtYnktb3RoZXJcIiwgXCJjcmVhdGVkLWJ5LW1lXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbUlkLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm8gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdXBkYXRlTm9kZUluZm9SZXNwb25zZShyZXMsIG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXROb2RlRnJvbUlkID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgIHJldHVybiBpZFRvTm9kZU1hcFtpZF07XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRQYXRoT2ZVaWQgPSBmdW5jdGlvbih1aWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiW3BhdGggZXJyb3IuIGludmFsaWQgdWlkOiBcIiArIHVpZCArIFwiXVwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgbGV0IHJldDoganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Um93QnlJZCA9IGZ1bmN0aW9uKGlkLCBzY3JvbGwpOiB2b2lkIHtcclxuICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodE5vZGUobm9kZSwgc2Nyb2xsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpZ2hsaWdodFJvd0J5SWQgZmFpbGVkIHRvIGZpbmQgaWQ6IFwiICsgaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSW1wb3J0YW50OiBXZSB3YW50IHRoaXMgdG8gYmUgdGhlIG9ubHkgbWV0aG9kIHRoYXQgY2FuIHNldCB2YWx1ZXMgb24gJ3BhcmVudFVpZFRvRm9jdXNOb2RlTWFwJywgYW5kIGFsd2F5c1xyXG4gICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNjcm9sbDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgZG9uZUhpZ2hsaWdodGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICBsZXQgY3VySGlnaGxpZ2h0ZWROb2RlOiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgIGlmIChjdXJIaWdobGlnaHRlZE5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgPT09IG5vZGUudWlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFscmVhZHkgaGlnaGxpZ2h0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgZG9uZUhpZ2hsaWdodGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQgPSBjdXJIaWdobGlnaHRlZE5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhcIiNcIiArIHJvd0VsbUlkLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZG9uZUhpZ2hsaWdodGluZykge1xyXG4gICAgICAgICAgICBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF0gPSBub2RlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd0VsbUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICBsZXQgcm93RWxtID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgaWYgKCFyb3dFbG0gfHwgcm93RWxtLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmaW5kIHJvd0VsZW1lbnQgdG8gaGlnaGxpZ2h0OiBcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoXCIjXCIgKyByb3dFbG1JZCwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZWFsbHkgbmVlZCB0byB1c2UgcHViL3N1YiBldmVudCB0byBicm9hZGNhc3QgZW5hYmxlbWVudCwgYW5kIGxldCBlYWNoIGNvbXBvbmVudCBkbyB0aGlzIGluZGVwZW5kZW50bHkgYW5kXHJcbiAgICAgKiBkZWNvdXBsZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHJlZnJlc2hBbGxHdWlFbmFibGVtZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgbGV0IHByZXZQYWdlRXhpc3RzOiBib29sZWFuID0gbmF2Lm1haW5PZmZzZXQgPiAwO1xyXG4gICAgICAgIGxldCBuZXh0UGFnZUV4aXN0czogYm9vbGVhbiA9ICFuYXYuZW5kUmVhY2hlZDtcclxuICAgICAgICBsZXQgc2VsTm9kZUNvdW50OiBudW1iZXIgPSB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBsZXQgc2VsTm9kZUlzTWluZTogYm9vbGVhbiA9IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiAoaGlnaGxpZ2h0Tm9kZS5jcmVhdGVkQnkgPT09IHVzZXJOYW1lIHx8IFwiYWRtaW5cIiA9PT0gdXNlck5hbWUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkO1xyXG4gICAgICAgIGxldCBpbXBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5pbXBvcnRBbGxvd2VkO1xyXG4gICAgICAgIGxldCBleHBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5leHBvcnRBbGxvd2VkO1xyXG4gICAgICAgIGxldCBoaWdobGlnaHRPcmRpbmFsOiBudW1iZXIgPSBnZXRPcmRpbmFsT2ZOb2RlKGhpZ2hsaWdodE5vZGUpO1xyXG4gICAgICAgIGxldCBudW1DaGlsZE5vZGVzOiBudW1iZXIgPSBnZXROdW1DaGlsZE5vZGVzKCk7XHJcbiAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IChoaWdobGlnaHRPcmRpbmFsID4gMCAmJiBudW1DaGlsZE5vZGVzID4gMSkgfHwgcHJldlBhZ2VFeGlzdHM7XHJcbiAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gKGhpZ2hsaWdodE9yZGluYWwgPCBudW1DaGlsZE5vZGVzIC0gMSAmJiBudW1DaGlsZE5vZGVzID4gMSkgfHwgbmV4dFBhZ2VFeGlzdHM7XHJcblxyXG4gICAgICAgIC8vdG9kby0wOiBuZWVkIHRvIGFkZCB0byB0aGlzIHNlbE5vZGVJc01pbmUgfHwgc2VsUGFyZW50SXNNaW5lO1xyXG4gICAgICAgIGxldCBjYW5DcmVhdGVOb2RlID0gdXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIChpc0FkbWluVXNlciB8fCAoIWlzQW5vblVzZXIgLyogJiYgc2VsTm9kZUlzTWluZSAqLykpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImVuYWJsZW1lbnQ6IGlzQW5vblVzZXI9XCIgKyBpc0Fub25Vc2VyICsgXCIgc2VsTm9kZUNvdW50PVwiICsgc2VsTm9kZUNvdW50ICsgXCIgc2VsTm9kZUlzTWluZT1cIiArIHNlbE5vZGVJc01pbmUpO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJuYXZMb2dvdXRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgbGV0IHByb3BzVG9nZ2xlOiBib29sZWFuID0gY3VycmVudE5vZGUgJiYgIWlzQW5vblVzZXI7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgcHJvcHNUb2dnbGUpO1xyXG5cclxuICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImN1dFNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicGFzdGVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVTZWxlY3RlZCkpO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIGlzQWRtaW5Vc2VyIHx8ICh1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICYmIGhpZ2hsaWdodE5vZGUuaGFzQmluYXJ5ICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlZnJlc2hQYWdlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjcmVhdGVOb2RlQnV0dG9uXCIsIGNhbkNyZWF0ZU5vZGUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5JbXBvcnREbGdcIiwgaW1wb3J0RmVhdHVyZUVuYWJsZWQgJiYgKHNlbE5vZGVJc01pbmUgfHwgKGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQpKSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZCkpKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAvL1ZJU0lCSUxJVFlcclxuXHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXBMZXZlbEJ1dHRvblwiLCBjdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInByb3BzVG9nZ2xlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibmF2TG9nb3V0QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgLy9Ub3AgTGV2ZWwgTWVudSBWaXNpYmlsaXR5XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiYWRtaW5NZW51XCIsIGlzQWRtaW5Vc2VyKTtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2luZ2xlU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nO1xyXG4gICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmb3VuZCBhIHNpbmdsZSBTZWwgTm9kZUlEOiBcIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRPcmRpbmFsT2ZOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKCFub2RlIHx8ICFjdXJyZW50Tm9kZURhdGEgfHwgIWN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXROdW1DaGlsZE5vZGVzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZXRDdXJyZW50Tm9kZURhdGEgPSBmdW5jdGlvbihkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICBjdXJyZW50Tm9kZSA9IGRhdGEubm9kZTtcclxuICAgICAgICBjdXJyZW50Tm9kZVVpZCA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICBjdXJyZW50Tm9kZVBhdGggPSBkYXRhLm5vZGUucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGFub25QYWdlTG9hZFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHJlbW92ZUJpbmFyeUJ5VWlkID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChub2RlLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmhhc0JpbmFyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHVwZGF0ZXMgY2xpZW50IHNpZGUgbWFwcyBhbmQgY2xpZW50LXNpZGUgaWRlbnRpZmllciBmb3IgbmV3IG5vZGUsIHNvIHRoYXQgdGhpcyBub2RlIGlzICdyZWNvZ25pemVkJyBieSBjbGllbnRcclxuICAgICAqIHNpZGUgY29kZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGluaXROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgdXBkYXRlTWFwcz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0Tm9kZSBoYXMgbnVsbCBub2RlXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYXNzaWduIGEgcHJvcGVydHkgZm9yIGRldGVjdGluZyB0aGlzIG5vZGUgdHlwZSwgSSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgdXNpbmcgc29tZSBraW5kIG9mIGN1c3RvbSBKU1xyXG4gICAgICAgICAqIHByb3RvdHlwZS1yZWxhdGVkIGFwcHJvYWNoXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbm9kZS51aWQgPSB1cGRhdGVNYXBzID8gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKSA6IGlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRm9yIHRoZXNlIHR3byBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFjY2Vzc2VkIGZyZXF1ZW50bHkgd2UgZ28gYWhlYWQgYW5kIGxvb2t1cCB0aGUgcHJvcGVydGllcyBpbiB0aGVcclxuICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgKiBzaW1wbGlmeSBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgbm9kZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5MQVNUX01PRElGSUVELCBub2RlKSk7XHJcblxyXG4gICAgICAgIGlmICh1cGRhdGVNYXBzKSB7XHJcbiAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICBpZFRvTm9kZU1hcFtub2RlLmlkXSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5pdENvbnN0YW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHV0aWwuYWRkQWxsKHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdCwgWyAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QT0xJQ1ksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICB1dGlsLmFkZEFsbChyZWFkT25seVByb3BlcnR5TGlzdCwgWyAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNSRUFURUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVELCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlksLy9cclxuICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICB1dGlsLmFkZEFsbChiaW5hcnlQcm9wZXJ0eUxpc3QsIFtqY3JDbnN0LkJJTl9EQVRBXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgZXhwb3J0IGxldCBpbml0QXBwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbml0QXBwIHJ1bm5pbmcuXCIpO1xuXG4gICAgICAgIG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzZmVlZFwiXSA9IHBvZGNhc3QucmVuZGVyRmVlZE5vZGU7XG4gICAgICAgIG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzaXRlbVwiXSA9IHBvZGNhc3QucmVuZGVySXRlbU5vZGU7XG4gICAgICAgIG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzZmVlZFwiXSA9IHBvZGNhc3QucHJvcE9yZGVyaW5nRmVlZE5vZGU7XG4gICAgICAgIG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzaXRlbVwiXSA9IHBvZGNhc3QucHJvcE9yZGVyaW5nSXRlbU5vZGU7XG5cbiAgICAgICAgbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpzeXN0ZW1mb2xkZXJcIl0gPSBzeXN0ZW1mb2xkZXIucmVuZGVyTm9kZTtcbiAgICAgICAgbWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpzeXN0ZW1mb2xkZXJcIl0gPSBzeXN0ZW1mb2xkZXIucHJvcE9yZGVyaW5nO1xuXG4gICAgICAgIG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6ZmlsZWxpc3RcIl0gPSBzeXN0ZW1mb2xkZXIucmVuZGVyRmlsZUxpc3ROb2RlO1xuICAgICAgICBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OmZpbGVsaXN0XCJdID0gc3lzdGVtZm9sZGVyLmZpbGVMaXN0UHJvcE9yZGVyaW5nO1xuXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIHZhciBvbnJlc2l6ZSA9IHdpbmRvdy5vbnJlc2l6ZTtcbiAgICAgICAgLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHsgaWYgKHR5cGVvZiBvbnJlc2l6ZSA9PT0gJ2Z1bmN0aW9uJykgb25yZXNpemUoKTsgLyoqIC4uLiAqLyB9XG5cbiAgICAgICAgKDxhbnk+d2luZG93KS5hZGRFdmVudCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCB0eXBlb2YgKG9iamVjdCkgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W1wib25cIiArIHR5cGVdID0gY2FsbGJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLypcbiAgICAgICAgICogV0FSTklORzogVGhpcyBpcyBjYWxsZWQgaW4gcmVhbHRpbWUgd2hpbGUgdXNlciBpcyByZXNpemluZyBzbyBhbHdheXMgdGhyb3R0bGUgYmFjayBhbnkgcHJvY2Vzc2luZyBzbyB0aGF0IHlvdSBkb24ndFxuICAgICAgICAgKiBkbyBhbnkgYWN0dWFsIHByb2Nlc3NpbmcgaW4gaGVyZSB1bmxlc3MgeW91IHdhbnQgaXQgVkVSWSBsaXZlLCBiZWNhdXNlIGl0IGlzLlxuICAgICAgICAgKi9cbiAgICAgICAgLy8gKDxhbnk+d2luZG93KS53aW5kb3dSZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKFwiV2luZG93UmVzaXplOiB3PVwiICsgd2luZG93LmlubmVyV2lkdGggKyBcIiBoPVwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvL1xuICAgICAgICAvLyAoPGFueT53aW5kb3cpLmFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgKDxhbnk+d2luZG93KS53aW5kb3dSZXNpemUpO1xuXG4gICAgICAgIC8vIHRoaXMgY29tbWVudGVkIHNlY3Rpb24gaXMgbm90IHdvcmtpbmcgaW4gbXkgbmV3IHgtYXBwIGNvZGUsIGJ1dCBpdCdzIG9rIHRvIGNvbW1lbnQgaXQgb3V0IGZvciBub3cuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoaXMgaXMgb3VyIHRlbXBsYXRlIGVsZW1lbnQgaW4gaW5kZXguaHRtbFxuICAgICAgICAvLyB2YXIgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3gtYXBwJyk7XG4gICAgICAgIC8vIC8vIExpc3RlbiBmb3IgdGVtcGxhdGUgYm91bmQgZXZlbnQgdG8ga25vdyB3aGVuIGJpbmRpbmdzXG4gICAgICAgIC8vIC8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuICAgICAgICAvLyBhcHAuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FwcCByZWFkeSBldmVudCEnKTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgKDxhbnk+d2luZG93KS5hZGRFdmVudExpc3RlbmVyKCdwb2x5bWVyLXJlYWR5JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BvbHltZXItcmVhZHkgZXZlbnQhJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBjbnN0LmpzXCIpO1xuXG4gICAgICAgIC8vdG9kby0xOiB0eXBlc2NyaXB0IHdpbGwgbm93IGxldCB1cyBqdXN0IGRvIHRoaXM6IGNvbnN0IHZhcj0ndmFsdWUnO1xuXG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cclxuICAgICAgICBpZiAoYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRhYkNoYW5nZUV2ZW50KHRhYnMuc2VsZWN0ZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbml0Q29uc3RhbnRzKCk7XHJcbiAgICAgICAgZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgZGV2aWNlV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICBkZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBjYWxsIGNoZWNrcyB0aGUgc2VydmVyIHRvIHNlZSBpZiB3ZSBoYXZlIGEgc2Vzc2lvbiBhbHJlYWR5LCBhbmQgZ2V0cyBiYWNrIHRoZSBsb2dpbiBpbmZvcm1hdGlvbiBmcm9tXHJcbiAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVzZXIucmVmcmVzaExvZ2luKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ2hlY2sgZm9yIHNjcmVlbiBzaXplIGluIGEgdGltZXIuIFdlIGRvbid0IHdhbnQgdG8gbW9uaXRvciBhY3R1YWwgc2NyZWVuIHJlc2l6ZSBldmVudHMgYmVjYXVzZSBpZiBhIHVzZXJcclxuICAgICAgICAgKiBpcyBleHBhbmRpbmcgYSB3aW5kb3cgd2UgYmFzaWNhbGx5IHdhbnQgdG8gbGltaXQgdGhlIENQVSBhbmQgY2hhb3MgdGhhdCB3b3VsZCBlbnN1ZSBpZiB3ZSB0cmllZCB0byBhZGp1c3RcclxuICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICogdGltZXIgaXMgYSB0aHJvdHRsZSBzb3J0IG9mLiBZZXMgSSBrbm93IGhvdyB0byBsaXN0ZW4gZm9yIGV2ZW50cy4gTm8gSSdtIG5vdCBkb2luZyBpdCB3cm9uZyBoZXJlLiBUaGlzXHJcbiAgICAgICAgICogdGltZXIgaXMgY29ycmVjdCBpbiB0aGlzIGNhc2UgYW5kIGJlaGF2ZXMgc3VwZXJpb3IgdG8gZXZlbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUG9seW1lci0+ZGlzYWJsZVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IHZhciB3aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBfLmRldmljZVdpZHRoID0gd2lkdGg7IF8uZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXy5zY3JlZW5TaXplQ2hhbmdlKCk7IH0gfSwgMTUwMCk7XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG5cclxuICAgICAgICB1dGlsLmluaXRQcm9ncmVzc01vbml0b3IoKTtcclxuXHJcbiAgICAgICAgcHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcHJvY2Vzc1VybFBhcmFtcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXJsQ21kID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJjbWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCB0YWJDaGFuZ2VFdmVudCA9IGZ1bmN0aW9uKHRhYk5hbWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFRhYkFjdGl2YXRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGRpc3BsYXlTaWdudXBNZXNzYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2NyZWVuU2l6ZUNoYW5nZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZURhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZWFjaChjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmltZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIERvbid0IG5lZWQgdGhpcyBtZXRob2QgeWV0LCBhbmQgaGF2ZW4ndCB0ZXN0ZWQgdG8gc2VlIGlmIHdvcmtzICovXHJcbiAgICBleHBvcnQgbGV0IG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbG9hZEFub25QYWdlSG9tZSA9IGZ1bmN0aW9uKGlnbm9yZVVybCk6IHZvaWQge1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkFub25QYWdlTG9hZFJlcXVlc3QsIGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2U+KFwiYW5vblBhZ2VMb2FkXCIsIHtcclxuICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgfSwgYW5vblBhZ2VMb2FkUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2F2ZVVzZXJQcmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB1c2VyUHJlZmVyZW5jZXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5TeXN0ZW1GaWxlID0gZnVuY3Rpb24oZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLk9wZW5TeXN0ZW1GaWxlUmVxdWVzdCwganNvbi5PcGVuU3lzdGVtRmlsZVJlc3BvbnNlPihcIm9wZW5TeXN0ZW1GaWxlXCIsIHtcclxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBmaWxlTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZWRpdFN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbmV3IEVkaXRTeXN0ZW1GaWxlRGxnKGZpbGVOYW1lKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxuXG5uYW1lc3BhY2UgbmF2IHtcclxuICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgIC8qIHRvZG8tMDogZXZlbnR1YWxseSB3aGVuIHdlIGRvIHBhZ2luZyBmb3Igb3RoZXIgbGlzdHMsIHdlIHdpbGwgbmVlZCBhIHNldCBvZiB0aGVzZSB2YXJpYWJsZXMgZm9yIGVhY2ggbGlzdCBkaXNwbGF5IChpLmUuIHNlYXJjaCwgdGltZWxpbmUsIGV0YykgKi9cclxuICAgIGV4cG9ydCBsZXQgbWFpbk9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIGV4cG9ydCBsZXQgZW5kUmVhY2hlZDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgdGhpcyB2YWx1ZSBwYXNzZWQgZnJvbSBzZXJ2ZXIgcmF0aGVyIHRoYW4gY29kZWQgaW4gVHlwZVNjcmlwdCAqL1xyXG4gICAgZXhwb3J0IGxldCBST1dTX1BFUl9QQUdFOiBudW1iZXIgPSAyNTtcclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5NYWluTWVudUhlbHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBcIi9tZXRhNjQvcHVibGljL2hlbHBcIixcclxuICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IG1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBvcGVuUnNzRmVlZHNOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvcnNzL2ZlZWRzXCIsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICBcIm9mZnNldFwiOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZXhwYW5kTW9yZSA9IGZ1bmN0aW9uKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8qIEknbSBzZXR0aW5nIHRoaXMgaGVyZSBzbyB0aGF0IHdlIGNhbiBjb21lIHVwIHdpdGggYSB3YXkgdG8gbWFrZSB0aGUgYWJicmV2IGV4cGFuZCBzdGF0ZSBiZSByZW1lbWJlcmVkLCBidXR0b25cclxuICAgICAgICB0aGlzIGlzIGxvd2VyIHByaW9yaXR5IGZvciBub3csIHNvIGknbSBub3QgdXNpbmcgaXQgeWV0ICovXHJcbiAgICAgICAgbWV0YTY0LmV4cGFuZGVkQWJicmV2Tm9kZUlkc1tub2RlSWRdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCwganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZT4oXCJleHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWRcclxuICAgICAgICB9LCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlZBTDogXCIrSlNPTi5zdHJpbmdpZnkocmVzLm5vZGVJbmZvKSk7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZUluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGRpc3BsYXlpbmdIb21lID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcGFyZW50VmlzaWJsZVRvVXNlciA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhZGlzcGxheWluZ0hvbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHVwTGV2ZWxSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIGlkKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFyZXMgfHwgIXJlcy5ub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIGRhdGEgaXMgdmlzaWJsZSB0byB5b3UgYWJvdmUgdGhpcyBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQoaWQsIHRydWUpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBuYXZVcExldmVsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICghcGFyZW50VmlzaWJsZVRvVXNlcigpKSB7XHJcbiAgICAgICAgICAgIC8vIEFscmVhZHkgYXQgcm9vdC4gQ2FuJ3QgZ28gdXAuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogZm9yIG5vdyBhbiB1cGxldmVsIHdpbGwgcmVzZXQgdG8gemVybyBvZmZzZXQsIGJ1dCBldmVudHVhbGx5IEkgd2FudCB0byBoYXZlIGVhY2ggbGV2ZWwgb2YgdGhlIHRyZWUsIGJlIGFibGUgdG9cclxuICAgICAgICByZW1lbWJlciB3aGljaCBvZmZzZXQgaXQgd2FzIGF0IHNvIHdoZW4gdXNlciBkcmlsbHMgZG93biwgYW5kIHRoZW4gY29tZXMgYmFjayBvdXQsIHRoZXkgcGFnZSBiYWNrIG91dCBmcm9tIHRoZSBzYW1lIHBhZ2VzIHRoZXlcclxuICAgICAgICBkcmlsbGVkIGRvd24gZnJvbSAqL1xyXG4gICAgICAgIG1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgXCJ1cExldmVsXCI6IDEsXHJcbiAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcIm9mZnNldFwiOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdXBMZXZlbFJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZERvbUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG5cclxuICAgICAgICB2YXIgY3VycmVudFNlbE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIitub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZFBvbHlFbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGhpZ2hsaWdodGVkIG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIHVwIHVzaW5nIGVsZW1lbnQgaWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwucG9seUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBub2RlIGhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB1dGlsLmxvZ0FuZFRocm93KFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tPbk5vZGVSb3cgcmVjaWV2ZWQgdWlkIHRoYXQgZG9lc24ndCBtYXAgdG8gYW55IG5vZGUuIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc2V0cyB3aGljaCBub2RlIGlzIHNlbGVjdGVkIG9uIHRoaXMgcGFnZSAoaS5lLiBwYXJlbnQgbm9kZSBvZiB0aGlzIHBhZ2UgYmVpbmcgdGhlICdrZXknKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaWYgbm9kZS5vd25lciBpcyBjdXJyZW50bHkgbnVsbCwgdGhhdCBtZWFucyB3ZSBoYXZlIG5vdCByZXRyaWV2ZWQgdGhlIG93bmVyIGZyb20gdGhlIHNlcnZlciB5ZXQsIGJ1dFxyXG4gICAgICAgICAgICAgKiBpZiBub24tbnVsbCBpdCdzIGFscmVhZHkgZGlzcGxheWluZyBhbmQgd2UgZG8gbm90aGluZy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghbm9kZS5vd25lcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHVwZGF0ZU5vZGVJbmZvXCIpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgb3Blbk5vZGUgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShub2RlLmlkLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAqIGluIFBvbG1lciBhdCBhbGwsIGFuZCBzaW5jZSBvbkNsaWNrIHJ1bnMgQkVGT1JFIHRoZSBzdGF0ZSBjaGFuZ2UgaXMgY29tcGxldGVkLCB0aGF0IGlzIHRoZSByZWFzb24gZm9yIHRoZVxyXG4gICAgICogc2lsbHkgbG9va2luZyBhc3luYyB0aW1lciBoZXJlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHRvZ2dsZU5vZGVTZWwgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuICAgICAgICBsZXQgdG9nZ2xlQnV0dG9uOiBhbnkgPSB1dGlsLnBvbHlFbG0odWlkICsgXCJfc2VsXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0b2dnbGVCdXR0b24ubm9kZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbmF2UGFnZU5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG5hdkhvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmhvbWVOb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbmF2UHVibGljSG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgfVxyXG59XHJcblxubmFtZXNwYWNlIHByZWZzIHtcclxuXHJcbiAgICBleHBvcnQgbGV0IGNsb3NlQWNjb3VudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPaCBObyFcIiwgXCJDbG9zZSB5b3VyIEFjY291bnQ/PHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2xvc2VBY2NvdW50UmVxdWVzdCwganNvbi5DbG9zZUFjY291bnRSZXNwb25zZT4oXCJjbG9zZUFjY291bnRcIiwge30sIGNsb3NlQWNjb3VudFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG59XHJcblxubmFtZXNwYWNlIHByb3BzIHtcclxuXHJcbiAgICBleHBvcnQgbGV0IG9yZGVyUHJvcHMgPSBmdW5jdGlvbihwcm9wT3JkZXI6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xyXG4gICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHV0aWwuYXJyYXlDbG9uZShwcm9wcyk7XHJcbiAgICAgICAgbGV0IHRhcmdldElkeDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wT3JkZXIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0SWR4ID0gbW92ZU5vZGVQb3NpdGlvbihwcm9wc05ldywgdGFyZ2V0SWR4LCBwcm9wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbW92ZU5vZGVQb3NpdGlvbiA9IGZ1bmN0aW9uKHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdLCBpZHg6IG51bWJlciwgdHlwZU5hbWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHRhZ0lkeDogbnVtYmVyID0gdXRpbC5hcnJheUluZGV4T2ZJdGVtQnlQcm9wKHByb3BzLCBcIm5hbWVcIiwgdHlwZU5hbWUpO1xyXG4gICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgdXRpbC5hcnJheU1vdmVJdGVtKHByb3BzLCB0YWdJZHgsIGlkeCsrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBwcm9wc1RvZ2dsZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAvLyBzZXREYXRhSWNvblVzaW5nSWQoXCIjZWRpdE1vZGVCdXR0b25cIiwgZWRpdE1vZGUgPyBcImVkaXRcIiA6XHJcbiAgICAgICAgLy8gXCJmb3JiaWRkZW5cIik7XHJcblxyXG4gICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgIC8vIHZhciBlbG0gPSAkKFwiI3Byb3BzVG9nZ2xlQnV0dG9uXCIpO1xyXG4gICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZ3JpZFwiLCBtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG4gICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSk6IHZvaWQge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IGVkaXQuZWRpdE5vZGUucHJvcGVydGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpY2UgaXMgaG93IHlvdSBkZWxldGUgYXJyYXkgZWxlbWVudHMgaW4ganMuXHJcbiAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAqIG5vZGUgYW5kIHB1dHMgaXQgb24gdGhlIHRvcCwgYW5kIHRoZW4gZG9lcyBzYW1lIGZvciAnamN0Q25zdC5UQUdTJ1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmMobm9kZSwgcHJvcHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3BzTmV3OiBqc29uLlByb3BlcnR5SW5mb1tdID0gdXRpbC5hcnJheUNsb25lKHByb3BzKTtcclxuICAgICAgICBtb3ZlUHJvcHNUb1RvcChbamNyQ25zdC5DT05URU5ULCBqY3JDbnN0LlRBR1NdLCBwcm9wc05ldyk7XHJcbiAgICAgICAgbW92ZVByb3BzVG9FbmQoW2pjckNuc3QuQ1JFQVRFRCwgamNyQ25zdC5DUkVBVEVEX0JZLCBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWV0sIHByb3BzTmV3KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3BzTmV3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIE1vdmVzIGFsbCB0aGUgcHJvcGVydGllcyBsaXN0ZWQgaW4gcHJvcExpc3QgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCBrZWVwcyB0aGVtIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgKi9cclxuICAgIGxldCBtb3ZlUHJvcHNUb1RvcCA9IGZ1bmN0aW9uKHByb3BzTGlzdDogc3RyaW5nW10sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wc0xpc3QpIHtcclxuICAgICAgICAgICAgbGV0IHRhZ0lkeCA9IHV0aWwuYXJyYXlJbmRleE9mSXRlbUJ5UHJvcChwcm9wcywgXCJuYW1lXCIsIHByb3ApO1xyXG4gICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmFycmF5TW92ZUl0ZW0ocHJvcHMsIHRhZ0lkeCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogTW92ZXMgYWxsIHRoZSBwcm9wZXJ0aWVzIGxpc3RlZCBpbiBwcm9wTGlzdCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIGtlZXBzIHRoZW0gaW4gdGhlIG9yZGVyIHNwZWNpZmllZCAqL1xyXG4gICAgbGV0IG1vdmVQcm9wc1RvRW5kID0gZnVuY3Rpb24ocHJvcHNMaXN0OiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgdGFnSWR4ID0gdXRpbC5hcnJheUluZGV4T2ZJdGVtQnlQcm9wKHByb3BzLCBcIm5hbWVcIiwgcHJvcCk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCBwcm9wcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbCBvciBhIGxpc3Qgb2YgUHJvcGVydHlJbmZvIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGxldCB0YWJsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3BlcnR5Lm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcm9wQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGQ6IHN0cmluZyA9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLW5hbWUtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcGVydHkubmFtZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmluYXJ5UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBcIltiaW5hcnldXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcHJvcHMucmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRkICs9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXZhbC1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhYmxlICs9IHJlbmRlci50YWcoXCJ0clwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXJvd1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3BDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJ0YWJsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImJvcmRlclwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wZXJ0eS10YWJsZVwiXHJcbiAgICAgICAgICAgIH0sIHRhYmxlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogYnJ1dGUgZm9yY2Ugc2VhcmNoZXMgb24gbm9kZSAoTm9kZUluZm8uamF2YSkgb2JqZWN0IHByb3BlcnRpZXMgbGlzdCwgYW5kIHJldHVybnMgdGhlIGZpcnN0IHByb3BlcnR5XHJcbiAgICAgKiAoUHJvcGVydHlJbmZvLmphdmEpIHdpdGggbmFtZSBtYXRjaGluZyBwcm9wZXJ0eU5hbWUsIGVsc2UgbnVsbC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBqc29uLlByb3BlcnR5SW5mbyB7XHJcbiAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBub2RlLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgPT09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHlWYWwgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IGdldE5vZGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpc05vbk93bmVkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgLy8gaWYgd2UgZG9uJ3Qga25vdyB3aG8gb3ducyB0aGlzIG5vZGUgYXNzdW1lIHRoZSBhZG1pbiBvd25zIGl0LlxyXG4gICAgICAgIGlmICghY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRCeSA9IFwiYWRtaW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRoaXMgaXMgT1IgY29uZGl0aW9uIGJlY2F1c2Ugb2YgY3JlYXRlZEJ5IGlzIG51bGwgd2UgYXNzdW1lIHdlIGRvIG5vdCBvd24gaXQgKi9cclxuICAgICAgICByZXR1cm4gY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGlzTm9uT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGlzT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgIC8qIElmIHRoaXMgaXMgYSBzaW5nbGUtdmFsdWUgdHlwZSBwcm9wZXJ0eSAqL1xyXG4gICAgICAgIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBpZiBwcm9wZXJ0eSBpcyBtaXNzaW5nIHJldHVybiBlbXB0eSBzdHJpbmcgKi9cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZSB8fCBwcm9wZXJ0eS52YWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogZWxzZSByZW5kZXIgbXVsdGktdmFsdWUgcHJvcGVydHkgKi9cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbih2YWx1ZXMpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPGRpdj5cIjtcclxuICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgJC5lYWNoKHZhbHVlcywgZnVuY3Rpb24oaSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IGNuc3QuQlI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci53cmFwSHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2UgcmVuZGVyIHtcclxuICAgIGxldCBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBjb250ZW50IGRpc3BsYXllZCB3aGVuIHRoZSB1c2VyIHNpZ25zIGluLCBhbmQgd2Ugc2VlIHRoYXQgdGhleSBoYXZlIG5vIGNvbnRlbnQgYmVpbmcgZGlzcGxheWVkLiBXZVxyXG4gICAgICogd2FudCB0byBnaXZlIHRoZW0gc29tZSBpbnN0cnVjdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIGFkZCBjb250ZW50LlxyXG4gICAgICovXHJcbiAgICBsZXQgZ2V0RW1wdHlQYWdlUHJvbXB0ID0gZnVuY3Rpb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVuZGVyQmluYXJ5ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiB0aGlzIGlzIGFuIGltYWdlIHJlbmRlciB0aGUgaW1hZ2UgZGlyZWN0bHkgb250byB0aGUgcGFnZSBhcyBhIHZpc2libGUgaW1hZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAobm9kZS5iaW5hcnlJc0ltYWdlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlSW1hZ2VUYWcobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IGFuIGltYWdlIHdlIHJlbmRlciBhIGxpbmsgdG8gdGhlIGF0dGFjaG1lbnQsIHNvIHRoYXQgaXQgY2FuIGJlIGRvd25sb2FkZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3I6IHN0cmluZyA9IHRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJocmVmXCI6IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpXHJcbiAgICAgICAgICAgIH0sIFwiW0Rvd25sb2FkIEF0dGFjaG1lbnRdXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYmluYXJ5LWxpbmtcIlxyXG4gICAgICAgICAgICB9LCBhbmNob3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSW1wb3J0YW50IGxpdHRsZSBtZXRob2QgaGVyZS4gQWxsIEdVSSBwYWdlL2RpdnMgYXJlIGNyZWF0ZWQgdXNpbmcgdGhpcyBzb3J0IG9mIHNwZWNpZmljYXRpb24gaGVyZSB0aGF0IHRoZXlcclxuICAgICAqIGFsbCBtdXN0IGhhdmUgYSAnYnVpbGQnIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCBmaXJzdCB0aW1lIG9ubHksIGFuZCB0aGVuIHRoZSAnaW5pdCcgbWV0aG9kIGNhbGxlZCBiZWZvcmUgZWFjaFxyXG4gICAgICogdGltZSB0aGUgY29tcG9uZW50IGdldHMgZGlzcGxheWVkIHdpdGggbmV3IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIElmICdkYXRhJyBpcyBwcm92aWRlZCwgdGhpcyBpcyB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGJ1aWRQYWdlID0gZnVuY3Rpb24ocGcsIGRhdGEpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkUGFnZTogcGcuZG9tSWQ9XCIgKyBwZy5kb21JZCk7XHJcblxyXG4gICAgICAgIGlmICghcGcuYnVpbHQgfHwgZGF0YSkge1xyXG4gICAgICAgICAgICBwZy5idWlsZChkYXRhKTtcclxuICAgICAgICAgICAgcGcuYnVpbHQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBnLmluaXQpIHtcclxuICAgICAgICAgICAgcGcuaW5pdChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBidWlsZFJvd0hlYWRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoOiBib29sZWFuLCBzaG93TmFtZTogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIGZvcm1hdFBhdGgobm9kZSkgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXY+XCI7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAoY29tbWVudEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNvbW1lbnQgQnk6IFwiICsgY29tbWVudEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgfSAvL1xyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUuY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKG5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNyZWF0ZWQgQnk6IFwiICsgbm9kZS5jcmVhdGVkQnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gYDxzcGFuIGlkPSdvd25lckRpc3BsYXkke25vZGUudWlkfSc+PC9zcGFuPmA7XHJcbiAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gYCAgTW9kOiAke25vZGUubGFzdE1vZGlmaWVkfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBvbiByb290IG5vZGUgbmFtZSB3aWxsIGJlIGVtcHR5IHN0cmluZyBzbyBkb24ndCBzaG93IHRoYXRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGNvbW1lbnRpbmc6IEkgZGVjaWRlZCB1c2VycyB3aWxsIHVuZGVyc3RhbmQgdGhlIHBhdGggYXMgYSBzaW5nbGUgbG9uZyBlbnRpdHkgd2l0aCBsZXNzIGNvbmZ1c2lvbiB0aGFuXHJcbiAgICAgICAgICogYnJlYWtpbmcgb3V0IHRoZSBuYW1lIGZvciB0aGVtLiBUaGV5IGFscmVhZHkgdW5zZXJzdGFuZCBpbnRlcm5ldCBVUkxzLiBUaGlzIGlzIHRoZSBzYW1lIGNvbmNlcHQuIE5vIG5lZWRcclxuICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgIXNob3dQYXRoIGNvbmRpdGlvbiBoZXJlIGlzIGJlY2F1c2UgaWYgd2UgYXJlIHNob3dpbmcgdGhlIHBhdGggdGhlbiB0aGUgZW5kIG9mIHRoYXQgaXMgYWx3YXlzIHRoZVxyXG4gICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHNob3dOYW1lICYmICFzaG93UGF0aCAmJiBub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBgTmFtZTogJHtub2RlLm5hbWV9IFt1aWQ9JHtub2RlLnVpZH1dYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaGVhZGVyLXRleHRcIlxyXG4gICAgICAgIH0sIGhlYWRlclRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUGVnZG93biBtYXJrZG93biBwcm9jZXNzb3Igd2lsbCBjcmVhdGUgPGNvZGU+IGJsb2NrcyBhbmQgdGhlIGNsYXNzIGlmIHByb3ZpZGVkLCBzbyBpbiBvcmRlciB0byBnZXQgZ29vZ2xlXHJcbiAgICAgKiBwcmV0dGlmaWVyIHRvIHByb2Nlc3MgaXQgdGhlIHJlc3Qgb2YgdGhlIHdheSAod2hlbiB3ZSBjYWxsIHByZXR0eVByaW50KCkgZm9yIHRoZSB3aG9sZSBwYWdlKSB3ZSBub3cgcnVuXHJcbiAgICAgKiBhbm90aGVyIHN0YWdlIG9mIHRyYW5zZm9ybWF0aW9uIHRvIGdldCB0aGUgPHByZT4gdGFnIHB1dCBpbiB3aXRoICdwcmV0dHlwcmludCcgZXRjLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGluamVjdENvZGVGb3JtYXR0aW5nID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIWNvbnRlbnQpIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgLy8gYGBganNcclxuICAgICAgICAvLyB2YXIgeCA9IDEwO1xyXG4gICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgLy9cclxuICAgICAgICBpZiAodXRpbC5jb250YWlucyhjb250ZW50LCBcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gZW5jb2RlTGFuZ3VhZ2VzKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gdXRpbC5yZXBsYWNlQWxsKGNvbnRlbnQsIFwiPC9jb2RlPlwiLCBcIjwvcHJlPlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5qZWN0U3Vic3RpdHV0aW9ucyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHV0aWwucmVwbGFjZUFsbChjb250ZW50LCBcInt7bG9jYXRpb25PcmlnaW59fVwiLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCI8Y29kZSBjbGFzcz1cXFwiXCIgKyBsYW5nc1tpXSArIFwiXFxcIj5cIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGVudCA9IHV0aWwucmVwbGFjZUFsbChjb250ZW50LCBcIjxjb2RlPlwiLCBcIjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGFmdGVyIGEgcHJvcGVydHksIG9yIG5vZGUgaXMgdXBkYXRlZCAoc2F2ZWQpIHdlIGNhbiBub3cgY2FsbCB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIHJlZnJlc2hpbmcgdGhlIGVudGlyZSBwYWdlXHJcbiAgICB3aGljaCBpcyB3aGF0J3MgZG9uZSBpbiBtb3N0IG9mIHRoZSBhcHAsIHdoaWNoIGlzIG11Y2ggbGVzcyBlZmZpY2llbnQgYW5kIHNuYXBweSB2aXN1YWxseSAqL1xyXG4gICAgZXhwb3J0IGxldCByZWZyZXNoTm9kZU9uUGFnZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuICAgICAgICAvL25lZWQgdG8gbG9va3VwIHVpZCBmcm9tIE5vZGVJbmZvLmlkIHRoZW4gc2V0IHRoZSBjb250ZW50IG9mIHRoaXMgZGl2LlxyXG4gICAgICAgIC8vXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAvL3RvIHRoZSB2YWx1ZSBmcm9tIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbWV0YTY0LmlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgaWYgKCF1aWQpIHRocm93IGBVbmFibGUgdG8gZmluZCBub2RlSWQgJHtub2RlLmlkfSBpbiB1aWQgbWFwYDtcclxuICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgZmFsc2UpO1xyXG4gICAgICAgIGlmICh1aWQgIT0gbm9kZS51aWQpIHRocm93IFwidWlkIGNoYW5nZWQgdW5leHBlY3RseSBhZnRlciBpbml0Tm9kZVwiO1xyXG4gICAgICAgIGxldCByb3dDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAqIGFwcCBhbmQgaXMgd2hhdCB0aGUgdXNlciBzZWVzIGNvdmVyaW5nIDkwJSBvZiB0aGUgc2NyZWVuIG1vc3Qgb2YgdGhlIHRpbWUuIFRoZSBcImNvbnRlbnQqIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIHRvZG8tMDogUmF0aGVyIHRoYW4gaGF2aW5nIHRoaXMgbm9kZSByZW5kZXJlciBpdHNlbGYgYmUgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyBhbGwgdGhlIGRpZmZlcmVudCB0eXBlc1xyXG4gICAgICogb2Ygbm9kZXMsIG5lZWQgYSBtb3JlIHBsdWdnYWJsZSBkZXNpZ24sIHdoZXJlIHJlbmRlaW5nIG9mIGRpZmZlcmVudCB0aGluZ3MgaXMgZGVsZXRhZ2VkIHRvIHNvbWVcclxuICAgICAqIGFwcHJvcHJpYXRlIG9iamVjdC9zZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZUNvbnRlbnQgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzaG93UGF0aCwgc2hvd05hbWUsIHJlbmRlckJpbiwgcm93U3R5bGluZywgc2hvd0hlYWRlcik6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJldDogc3RyaW5nID0gZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKTtcclxuXHJcbiAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICBpZiAobWV0YTY0LnNob3dNZXRhRGF0YSkge1xyXG4gICAgICAgICAgICByZXQgKz0gc2hvd0hlYWRlciA/IGJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5zaG93UHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByZW5kZXJDb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIE5vZGVzIHRoYXQgaGF2ZSBhIHBsdWdpbi1yZW5kZXJlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gZnVuYyhub2RlLCByb3dTdHlsaW5nKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbnRlbnRQcm9wOiBcIiArIGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eShjb250ZW50UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKiogamNyQ29udGVudCBmb3IgTUFSS0RPV046XFxuXCIramNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXJrZWRDb250ZW50ID0gXCI8bWFya2VkLWVsZW1lbnQgc2FuaXRpemU9J3RydWUnPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz48L2Rpdj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNjcmlwdCB0eXBlPSd0ZXh0L21hcmtkb3duJz5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvc2NyaXB0PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L21hcmtlZC1lbGVtZW50PlwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1doZW4gZG9pbmcgc2VydmVyLXNpZGUgbWFya2Rvd24gd2UgaGFkIHRoaXMgcHJvY2Vzc2luZyB0aGUgSFRNTCB0aGF0IHdhcyBnZW5lcmF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAvL2J1dCBJIGhhdmVuJ3QgbG9va2VkIGludG8gaG93IHRvIGdldCB0aGlzIGJhY2sgbm93IHRoYXQgd2UgYXJlIGRvaW5nIG1hcmtkb3duIG9uIGNsaWVudC5cclxuICAgICAgICAgICAgICAgICAgICAvL2pjckNvbnRlbnQgPSBpbmplY3RDb2RlRm9ybWF0dGluZyhqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAvL2pjckNvbnRlbnQgPSBpbmplY3RTdWJzdGl0dXRpb25zKGpjckNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG1hcmtlZENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBtYXJrZWRDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhdGgudHJpbSgpID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiUm9vdCBOb2RlXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXQgKz0gXCI8ZGl2PltObyBDb250ZW50IFByb3BlcnR5XTwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXM6IHN0cmluZyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVuZGVyQmluICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBiaW5hcnk6IHN0cmluZyA9IHJlbmRlckJpbmFyeShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAqIHRoZSB1c2VyIGhhcyBwdXQge3tpbnNlcnQtYXR0YWNobWVudH19IGlmIHRoZXkgYXJlIHVzaW5nIHRoYXQgdG8gbWFrZSB0aGUgaW1hZ2UgYXBwZWFyIGluIGEgc3BlY2lmaWNcclxuICAgICAgICAgICAgICogbG9jYXRpbyBpbiB0aGUgY29udGVudCB0ZXh0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHV0aWwuY29udGFpbnMocmV0LCBjbnN0LklOU0VSVF9BVFRBQ0hNRU5UKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgY25zdC5JTlNFUlRfQVRUQUNITUVOVCwgYmluYXJ5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBiaW5hcnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0YWdzOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5UQUdTLCBub2RlKTtcclxuICAgICAgICBpZiAodGFncykge1xyXG4gICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0YWdzLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBcIlRhZ3M6IFwiICsgdGFncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKGpzb25Db250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjogXCIgKyBqc29uQ29udGVudCk7XHJcbiAgICAgICAgICAgIGxldCBsaXN0OiBhbnlbXSA9IEpTT04ucGFyc2UoanNvbkNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzeXN0ZW1GaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IGBtZXRhNjQuZWRpdFN5c3RlbUZpbGUoJyR7ZW50cnkuZmlsZU5hbWV9JylgXHJcbiAgICAgICAgICAgICAgICB9LCBlbnRyeS5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogb3BlblN5c3RlbUZpbGUgd29ya2VkIG9uIGxpbnV4LCBidXQgaSdtIHN3aXRjaGluZyB0byBmdWxsIHRleHQgZmlsZSBlZGl0IGNhcGFiaWxpdHkgb25seSBhbmQgZG9pbmcgdGhhdFxyXG4gICAgICAgICAgICAgICAgaW5zaWRlIG1ldGE2NCBmcm9tIG5vdyBvbiwgc28gb3BlblN5c3RlbUZpbGUgaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQgKi9cclxuICAgICAgICAgICAgICAgIC8vIGxldCBsb2NhbE9wZW5MaW5rID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25jbGlja1wiOiBcIm1ldGE2NC5vcGVuU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJMb2NhbCBPcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIGxldCBkb3dubG9hZExpbmsgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgLy9oYXZlbid0IGltcGxlbWVudGVkIGRvd25sb2FkIGNhcGFiaWxpdHkgeWV0LlxyXG4gICAgICAgICAgICAgICAgLy8gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25jbGlja1wiOiBcIm1ldGE2NC5kb3dubG9hZFN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgIC8vIH0sIFwiRG93bmxvYWRcIilcclxuICAgICAgICAgICAgICAgIC8vIGxldCBsaW5rc0RpdiA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBsb2NhbE9wZW5MaW5rICsgZG93bmxvYWRMaW5rKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBmaWxlTmFtZURpdik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwicmVuZGVyIGZhaWxlZFwiLCBlKTtcclxuICAgICAgICAgICAgY29udGVudCA9IFwiW3JlbmRlciBmYWlsZWRdXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgaXMgdGhlIHByaW1hcnkgbWV0aG9kIGZvciByZW5kZXJpbmcgZWFjaCBub2RlIChsaWtlIGEgcm93KSBvbiB0aGUgbWFpbiBIVE1MIHBhZ2UgdGhhdCBkaXNwbGF5cyBub2RlXHJcbiAgICAgKiBjb250ZW50LiBUaGlzIGdlbmVyYXRlcyB0aGUgSFRNTCBmb3IgYSBzaW5nbGUgcm93L25vZGUuXHJcbiAgICAgKlxyXG4gICAgICogbm9kZSBpcyBhIE5vZGVJbmZvLmphdmEgSlNPTlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG5vZGUudWlkO1xyXG4gICAgICAgIGxldCBwcmV2UGFnZUV4aXN0czogYm9vbGVhbiA9IG5hdi5tYWluT2Zmc2V0ID4gMDtcclxuICAgICAgICBsZXQgbmV4dFBhZ2VFeGlzdHM6IGJvb2xlYW4gPSAhbmF2LmVuZFJlYWNoZWQ7XHJcbiAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IChpbmRleCA+IDAgJiYgcm93Q291bnQgPiAxKSB8fCBwcmV2UGFnZUV4aXN0cztcclxuICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSAoaW5kZXggPCBjb3VudCAtIDEpIHx8IG5leHRQYWdlRXhpc3RzO1xyXG5cclxuICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSB1dGlsLnN0YXJ0c1dpdGgobm9kZS5uYW1lLCBcInJlcDpcIikgfHwgLypcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz9cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqL3V0aWwuY29udGFpbnMobm9kZS5wYXRoLCBcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBOb2RlIFJvd1tcIiArIGluZGV4ICsgXCJdIGVkaXRpbmdBbGxvd2VkPVwiK2VkaXRpbmdBbGxvd2VkKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICogY2xpY2tlZCBvbiBmb3IgdGhpcyBwYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAvLyArXCJdPT1bXCIrIG5vZGUuaWQgKyBcIl1cIilcclxuICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbkJhckh0bWxSZXQ6IHN0cmluZyA9IG1ha2VSb3dCdXR0b25CYXJIdG1sKG5vZGUsIGNhbk1vdmVVcCwgY2FuTW92ZURvd24sIGVkaXRpbmdBbGxvd2VkKTtcclxuICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKG5vZGUpO1xyXG5cclxuICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3dcIiArIChzZWxlY3RlZCA/IFwiIGFjdGl2ZS1yb3dcIiA6IFwiIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBuYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJyR7dWlkfScpO2AsIC8vXHJcbiAgICAgICAgICAgIFwiaWRcIjogY3NzSWQsXHJcbiAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgIGJ1dHRvbkJhckh0bWxSZXQgKyB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgfSwgcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNob3dOb2RlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IHV0aWwuc3RyaXBJZlN0YXJ0c1dpdGgobm9kZS5wYXRoLCBcIi9yb290XCIpO1xyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIj9pZD1cIiArIHBhdGg7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG5cclxuICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgIGxldCB1dWlkOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJqY3I6dXVpZFwiLCBub2RlKTtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldFRvcFJpZ2h0SW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgbGV0IHRvcFJpZ2h0SW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy50b3AucmlnaHQnLCBub2RlKTtcclxuICAgICAgICBsZXQgdG9wUmlnaHRJbWdUYWc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRvcFJpZ2h0SW1nKSB7XHJcbiAgICAgICAgICAgIHRvcFJpZ2h0SW1nVGFnID0gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRvcC1yaWdodC1pbWFnZVwiXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvcFJpZ2h0SW1nVGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgYmtnSW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy5ub2RlLmJrZycsIG5vZGUpO1xyXG4gICAgICAgIGxldCBia2dJbWdTdHlsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBhcyBJIHdhcyBjb252ZXJ0aW5naSBzb21lIHN0cmluZ3MgdG8gYmFja3RpY2sgaSBub3RpY2VkIHRoaXMgVVJMIG1pc3NpbmcgdGhlIHF1b3RlcyBhcm91bmQgdGhlIHN0cmluZy4gSXMgdGhpcyBhIGJ1Zz9cclxuICAgICAgICAgICAgYmtnSW1nU3R5bGUgPSBgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7YmtnSW1nfSk7YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJrZ0ltZ1N0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvdyBcIiArIGNsYXNzZXNcclxuICAgICAgICB9LCBidXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNlbnRlckNvbnRlbnQgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcsIHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBkaXY6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcInN0eWxlXCI6IGB3aWR0aDoke3dpZHRofXB4O2AgfSwgY29udGVudCk7XHJcblxyXG4gICAgICAgIGxldCBhdHRycyA9IHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvd1wiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwgYXR0cnMsIGRpdiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBidXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zOiBzdHJpbmcsIGNsYXNzZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxlZnQtanVzdGlmaWVkIGxheW91dCB2ZXJ0aWNhbC1sYXlvdXQtcm93IFwiICsgY2xhc3Nlc1xyXG4gICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZVJvd0J1dHRvbkJhckh0bWwgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBjYW5Nb3ZlVXA6IGJvb2xlYW4sIGNhbk1vdmVEb3duOiBib29sZWFuLCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBub2RlKTtcclxuXHJcbiAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHNlbEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IG1vdmVOb2RlVXBCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IG1vdmVOb2RlRG93bkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5yZXBseVRvQ29tbWVudCgnJHtub2RlLnVpZH0nKTtgIC8vXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICBpZiAobm9kZUhhc0NoaWxkcmVuKG5vZGUudWlkKSkge1xyXG4gICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRm9yIHNvbWUgdW5rbm93biByZWFzb24gdGhlIGFiaWxpdHkgdG8gc3R5bGUgdGhpcyB3aXRoIHRoZSBjbGFzcyBicm9rZSwgYW5kIGV2ZW5cclxuICAgICAgICAgICAgICAgIGFmdGVyIGRlZGljYXRpbmcgc2V2ZXJhbCBob3VycyB0cnlpbmcgdG8gZmlndXJlIG91dCB3aHkgSSdtIHN0aWxsIGJhZmZsZWQuIEkgY2hlY2tlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICBoZXJlIHRvIGFjY29tcGxpc2ggdGhlIHNhbWUgdGhpbmcgKi9cclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG5hdi5vcGVuTm9kZSgnJHtub2RlLnVpZH0nKTtgLy9cclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiT3BlblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgaW4gZWRpdCBtb2RlIHdlIGFsd2F5cyBhdCBsZWFzdCBjcmVhdGUgdGhlIHBvdGVudGlhbCAoYnV0dG9ucykgZm9yIGEgdXNlciB0byBpbnNlcnQgY29udGVudCwgYW5kIGlmXHJcbiAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgKiBpbnRlbGxpZ2VuY2UgdG8gd2hlbiB0byBzaG93IHRoZXNlIGJ1dHRvbnMgb3Igbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRWRpdGluZyBhbGxvd2VkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1tub2RlLnVpZF0gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNzczogT2JqZWN0ID0gc2VsZWN0ZWQgPyB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2LnRvZ2dsZU5vZGVTZWwoJyR7bm9kZS51aWR9Jyk7YCxcclxuICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgIC8vcGFkZGluZyBpcyBhIGJhY2sgaGFjayB0byBtYWtlIGNoZWNrYm94IGxpbmUgdXAgd2l0aCBvdGhlciBpY29ucy5cclxuICAgICAgICAgICAgICAgIC8vKGkgd2lsbCBwcm9iYWJseSBlbmQgdXAgdXNpbmcgYSBwYXBlci1pY29uLWJ1dHRvbiB0aGF0IHRvZ2dsZXMgaGVyZSwgaW5zdGVhZCBvZiBjaGVja2JveClcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgIH0gOiAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2LnRvZ2dsZU5vZGVTZWwoJyR7bm9kZS51aWR9Jyk7YCxcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbEJ1dHRvbiA9IHRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGNzcywgXCJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmUtYWx0XCIsIC8vXCJpY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5jcmVhdGVTdWJOb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5JTlNfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5pbnNlcnROb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgIH0sIFwiSW5zXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1BvbG1lciBJY29ucyBSZWZlcmVuY2U6IGh0dHBzOi8vZWxlbWVudHMucG9seW1lci1wcm9qZWN0Lm9yZy9lbGVtZW50cy9pcm9uLWljb25zP3ZpZXc9ZGVtbzpkZW1vL2luZGV4Lmh0bWxcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbHRcIjogXCJFZGl0IG5vZGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJ1bkVkaXROb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgIH0sIFwiRWRpdFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0Lk1PVkVfVVBET1dOX09OX1RPT0xCQVIgJiYgbWV0YTY0LmN1cnJlbnROb2RlLmNoaWxkcmVuT3JkZXJlZCAmJiAhY29tbWVudEJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LXVwd2FyZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYGVkaXQubW92ZU5vZGVVcCgnJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJVcFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZURvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZURvd25CdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LWRvd253YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5tb3ZlTm9kZURvd24oJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaSB3aWxsIGJlIGZpbmRpbmcgYSByZXVzYWJsZS9EUlkgd2F5IG9mIGRvaW5nIHRvb2x0b3BzIHNvb24sIHRoaXMgaXMganVzdCBteSBmaXJzdCBleHBlcmltZW50LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSG93ZXZlciB0b29sdGlwcyBBTFdBWVMgY2F1c2UgcHJvYmxlbXMuIE15c3RlcnkgZm9yIG5vdy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGFkZE5vZGVUb29sdGlwOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAvL1x0XHRcdCB9LCBcIkFERFMgYSBuZXcgbm9kZSBpbnNpZGUgdGhlIGN1cnJlbnQgbm9kZSwgYXMgYSBjaGlsZCBvZiBpdC5cIik7XHJcblxyXG4gICAgICAgIGxldCBhbGxCdXR0b25zOiBzdHJpbmcgPSBzZWxCdXR0b24gKyBvcGVuQnV0dG9uICsgaW5zZXJ0Tm9kZUJ1dHRvbiArIGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBpbnNlcnROb2RlVG9vbHRpcFxyXG4gICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgIHJldHVybiBhbGxCdXR0b25zLmxlbmd0aCA+IDAgPyBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicm93LXRvb2xiYXJcIikgOiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZUhvcml6b250YWxGaWVsZFNldCA9IGZ1bmN0aW9uKGNvbnRlbnQ/OiBzdHJpbmcsIGV4dHJhQ2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIC8qIE5vdyBidWlsZCBlbnRpcmUgY29udHJvbCBiYXIgKi9cclxuICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiICsgKGV4dHJhQ2xhc3NlcyA/IChcIiBcIiArIGV4dHJhQ2xhc3NlcykgOiBcIlwiKVxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1ha2VIb3J6Q29udHJvbEdyb3VwID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCJcclxuICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1ha2VSYWRpb0J1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcIm5hbWVcIjogaWRcclxuICAgICAgICB9LCBsYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbm9kZUlkIChzZWUgbWFrZU5vZGVJZCgpKSBOb2RlSW5mbyBvYmplY3QgaGFzICdoYXNDaGlsZHJlbicgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IG5vZGVIYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gbm9kZUhhc0NoaWxkcmVuOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNDaGlsZHJlbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBmb3JtYXRQYXRoID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aDtcclxuXHJcbiAgICAgICAgLyogd2UgaW5qZWN0IHNwYWNlIGluIGhlcmUgc28gdGhpcyBzdHJpbmcgY2FuIHdyYXAgYW5kIG5vdCBhZmZlY3Qgd2luZG93IHNpemVzIGFkdmVyc2VseSwgb3IgbmVlZCBzY3JvbGxpbmcgKi9cclxuICAgICAgICBwYXRoID0gdXRpbC5yZXBsYWNlQWxsKHBhdGgsIFwiL1wiLCBcIiAvIFwiKTtcclxuICAgICAgICBsZXQgc2hvcnRQYXRoOiBzdHJpbmcgPSBwYXRoLmxlbmd0aCA8IDUwID8gcGF0aCA6IHBhdGguc3Vic3RyaW5nKDAsIDQwKSArIFwiLi4uXCI7XHJcblxyXG4gICAgICAgIGxldCBub1Jvb3RQYXRoOiBzdHJpbmcgPSBzaG9ydFBhdGg7XHJcbiAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChub1Jvb3RQYXRoLCBcIi9yb290XCIpKSB7XHJcbiAgICAgICAgICAgIG5vUm9vdFBhdGggPSBub1Jvb3RQYXRoLnN1YnN0cmluZygwLCA1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IG1ldGE2NC5pc0FkbWluVXNlciA/IHNob3J0UGF0aCA6IG5vUm9vdFBhdGg7XHJcbiAgICAgICAgcmV0ICs9IFwiIFtcIiArIG5vZGUucHJpbWFyeVR5cGVOYW1lICsgXCJdXCI7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHdyYXBIdG1sID0gZnVuY3Rpb24odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbmRlcnMgcGFnZSBhbmQgYWx3YXlzIGFsc28gdGFrZXMgY2FyZSBvZiBzY3JvbGxpbmcgdG8gc2VsZWN0ZWQgbm9kZSBpZiB0aGVyZSBpcyBvbmUgdG8gc2Nyb2xsIHRvXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyUGFnZUZyb21EYXRhID0gZnVuY3Rpb24oZGF0YT86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCBzY3JvbGxUb1RvcD86IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSBmYWxzZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKVwiKTtcclxuXHJcbiAgICAgICAgbGV0IG5ld0RhdGE6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuYXYuZW5kUmVhY2hlZCA9IGRhdGEgJiYgZGF0YS5lbmRSZWFjaGVkO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZSkge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKFwiTm8gY29udGVudCBpcyBhdmFpbGFibGUgaGVyZS5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgIG1ldGE2NC5pZGVudFRvVWlkTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJJ20gY2hvb3NpbmcgdG8gcmVzZXQgc2VsZWN0ZWQgbm9kZXMgd2hlbiBhIG5ldyBwYWdlIGxvYWRzLCBidXQgdGhpcyBpcyBub3QgYSByZXF1aXJlbWVudC4gSSBqdXN0XHJcbiAgICAgICAgICAgICAqIGRvbid0IGhhdmUgYSBcImNsZWFyIHNlbGVjdGlvbnNcIiBmZWF0dXJlIHdoaWNoIHdvdWxkIGJlIG5lZWRlZCBzbyB1c2VyIGhhcyBhIHdheSB0byBjbGVhciBvdXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgICAgICBtZXRhNjQucGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShkYXRhLm5vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2V0Q3VycmVudE5vZGVEYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMgPyBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG91dHB1dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTk9URTogbWFpbk5vZGVDb250ZW50IGlzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFnZSBjb250ZW50LCBhbmQgaXMgYWx3YXlzIHRoZSBub2RlIGRpc3BsYXllZCBhdCB0aGUgdG9cclxuICAgICAgICAgKiBvZiB0aGUgcGFnZSBhYm92ZSBhbGwgdGhlIG90aGVyIG5vZGVzIHdoaWNoIGFyZSBpdHMgY2hpbGQgbm9kZXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IG1haW5Ob2RlQ29udGVudDogc3RyaW5nID0gcmVuZGVyTm9kZUNvbnRlbnQoZGF0YS5ub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluTm9kZUNvbnRlbnQ6IFwiK21haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgIGlmIChtYWluTm9kZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGEubm9kZS5wYXRoPVwiK2RhdGEubm9kZS5wYXRoKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkQ29tbWVudE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKGRhdGEubm9kZSkpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWROb2RlKGRhdGEubm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgbGV0IHB1YmxpY0FwcGVuZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJlcGx5VG9Db21tZW50KCcke2RhdGEubm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBjbnN0Lk5FV19PTl9UT09MQkFSICYmIGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL2ljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7dWlkfScpO2BcclxuICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmlzRWRpdEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImVkaXRvcjptb2RlLWVkaXRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5ydW5FZGl0Tm9kZSgnJHt1aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgIC8vIHZhciByb3dIZWFkZXIgPSBidWlsZFJvd0hlYWRlcihkYXRhLm5vZGUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNyZWF0ZVN1Yk5vZGVCdXR0b24gfHwgZWRpdE5vZGVCdXR0b24gfHwgcmVwbHlCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICcke3VpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgKyBtYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgLyogZm9yY2UgYWxsIGxpbmtzIHRvIG9wZW4gYSBuZXcgd2luZG93L3RhYiAqL1xyXG4gICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAvLyAkKCcjbWFpbk5vZGVDb250ZW50JykuZmluZChcImFcIikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gICAgICQodGhpcykuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ1cGRhdGUgc3RhdHVzIGJhci5cIik7XHJcbiAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgZmlyc3RCdXR0b246IHN0cmluZyA9IG1ha2VCdXR0b24oXCJGaXJzdCBQYWdlXCIsIFwiZmlyc3RQYWdlQnV0dG9uXCIsIGZpcnN0UGFnZSk7XHJcbiAgICAgICAgICAgIGxldCBwcmV2QnV0dG9uOiBzdHJpbmcgPSBtYWtlQnV0dG9uKFwiUHJldiBQYWdlXCIsIFwicHJldlBhZ2VCdXR0b25cIiwgcHJldlBhZ2UpO1xyXG4gICAgICAgICAgICBvdXRwdXQgKz0gY2VudGVyZWRCdXR0b25CYXIoZmlyc3RCdXR0b24gKyBwcmV2QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJvd0NvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZENvdW50OiBudW1iZXIgPSBkYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGlsZENvdW50OiBcIiArIGNoaWxkQ291bnQpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uXHJcbiAgICAgICAgICAgICAqIHRoZSBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGRhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWVkaXQubm9kZXNUb01vdmVTZXRbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93OiBzdHJpbmcgPSBnZW5lcmF0ZVJvdyhpLCBub2RlLCBuZXdEYXRhLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgaWYgKHJvd0NvdW50ID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBnZXRFbXB0eVBhZ2VQcm9tcHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhLmVuZFJlYWNoZWQpIHtcclxuICAgICAgICAgICAgbGV0IG5leHRCdXR0b24gPSBtYWtlQnV0dG9uKFwiTmV4dCBQYWdlXCIsIFwibmV4dFBhZ2VCdXR0b25cIiwgbmV4dFBhZ2UpO1xyXG4gICAgICAgICAgICBsZXQgbGFzdEJ1dHRvbiA9IG1ha2VCdXR0b24oXCJMYXN0IFBhZ2VcIiwgXCJsYXN0UGFnZUJ1dHRvblwiLCBsYXN0UGFnZSk7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSBjZW50ZXJlZEJ1dHRvbkJhcihuZXh0QnV0dG9uICsgbGFzdEJ1dHRvbiwgXCJwYWdpbmctYnV0dG9uLWJhclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIG91dHB1dCk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRPRE8tMzogSW5zdGVhZCBvZiBjYWxsaW5nIHNjcmVlblNpemVDaGFuZ2UgaGVyZSBpbW1lZGlhdGVseSwgaXQgd291bGQgYmUgYmV0dGVyIHRvIHNldCB0aGUgaW1hZ2Ugc2l6ZXNcclxuICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAqIHNldEh0bWwsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxUb1RvcCB8fCAhbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZmlyc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGaXJzdCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgdmlldy5maXJzdFBhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHByZXZQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQcmV2IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICB2aWV3LnByZXZQYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBuZXh0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV4dCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgdmlldy5uZXh0UGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbGFzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkxhc3QgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgIHZpZXcubGFzdFBhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdlbmVyYXRlUm93ID0gZnVuY3Rpb24oaTogbnVtYmVyLCBub2RlOiBqc29uLk5vZGVJbmZvLCBuZXdEYXRhOiBib29sZWFuLCBjaGlsZENvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiBSRU5ERVIgUk9XW1wiICsgaSArIFwiXTogbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3dDb3VudCsrOyAvLyB3YXJuaW5nOiB0aGlzIGlzIHRoZSBsb2NhbCB2YXJpYWJsZS9wYXJhbWV0ZXJcclxuICAgICAgICB2YXIgcm93ID0gcmVuZGVyTm9kZUFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBwb3N0VGFyZ2V0VXJsICsgXCJiaW4vZmlsZS1uYW1lP25vZGVJZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChub2RlLnBhdGgpICsgXCImdmVyPVwiICsgbm9kZS5iaW5WZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICBleHBvcnQgbGV0IGFkanVzdEltYWdlU2l6ZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9ICQoXCIjXCIgKyBub2RlLmltZ0lkKTtcclxuICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IGVsbS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSBlbG0uYXR0cihcImhlaWdodFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgKiB3aGljaCB3ZSB3YW50LCBidXQgdGhlbiB3ZSBhbHNvIGxpbWl0IGl0IHdpdGggbWF4LXdpZHRoIHNvIG9uIHNtYWxsZXIgc2NyZWVuIGRldmljZXMgb3Igc21hbGxcclxuICAgICAgICAgICAgICAgICAqIHdpbmRvdyByZXNpemluZ3MgZXZlbiBvbiBkZXNrdG9wIGJyb3dzZXJzIHRoZSBpbWFnZSB3aWxsIGFsd2F5cyBiZSBlbnRpcmVseSB2aXNpYmxlIGFuZCBub3RcclxuICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vIHZhciBtYXhXaWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRE8gTk9UIERFTEVURSAoZm9yIGEgbG9uZyB0aW1lIGF0IGxlYXN0KSBUaGlzIGlzIHRoZSBvbGQgbG9naWMgZm9yIHJlc2l6aW5nIGltYWdlcyByZXNwb25zaXZlbHksXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgaXQgd29ya3MgZmluZSBidXQgbXkgbmV3IGxvZ2ljIGlzIGJldHRlciwgd2l0aCBsaW1pdGluZyBtYXggd2lkdGggYmFzZWQgb24gc2NyZWVuIHNpemUuIEJ1dFxyXG4gICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgbm9kZS53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHNlZSBhbHNvOiBhZGp1c3RJbWFnZVNpemUoKSAqL1xyXG4gICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgbGV0IHNyYzogc3RyaW5nID0gZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSk7XHJcbiAgICAgICAgbm9kZS5pbWdJZCA9IFwiaW1nVWlkX1wiICsgbm9kZS51aWQ7XHJcblxyXG4gICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBpbWFnZSB3b24ndCBmaXQgb24gc2NyZWVuIHdlIHdhbnQgdG8gc2l6ZSBpdCBkb3duIHRvIGZpdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBZZXMsIGl0IHdvdWxkIGhhdmUgYmVlbiBzaW1wbGVyIHRvIGp1c3QgdXNlIHNvbWV0aGluZyBsaWtlIHdpZHRoPTEwMCUgZm9yIHRoZSBpbWFnZSB3aWR0aCBidXQgdGhlblxyXG4gICAgICAgICAgICAgKiB0aGUgaGlnaHQgd291bGQgbm90IGJlIHNldCBleHBsaWNpdGx5IGFuZCB0aGF0IHdvdWxkIG1lYW4gdGhhdCBhcyBpbWFnZXMgYXJlIGxvYWRpbmcgaW50byB0aGUgcGFnZSxcclxuICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAqIGltYWdlIGNvbXBsZXRlcy4gV2hhdCB3ZSB3YW50IGlzIHRvIGhhdmUgaXQgc28gdGhhdCBvbmNlIHdlIHNldCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHNjcm9sbCBhXHJcbiAgICAgICAgICAgICAqIHBhcnRpY3VsYXIgcm93IGludG8gdmlldywgaXQgd2lsbCBzdGF5IHRoZSBjb3JyZWN0IHNjcm9sbCBsb2NhdGlvbiBFVkVOIEFTIHRoZSBpbWFnZXMgYXJlIHN0cmVhbWluZ1xyXG4gICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBzZXQgdGhlIHdpZHRoIHdlIHdhbnQgdG8gZ28gZm9yICovXHJcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IG5vZGUud2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogbm9kZS5oZWlnaHQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkXHJcbiAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGNyZWF0ZXMgSFRNTCB0YWcgd2l0aCBhbGwgYXR0cmlidXRlcy92YWx1ZXMgc3BlY2lmaWVkIGluIGF0dHJpYnV0ZXMgb2JqZWN0LCBhbmQgY2xvc2VzIHRoZSB0YWcgYWxzbyBpZlxyXG4gICAgICogY29udGVudCBpcyBub24tbnVsbFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHRhZyA9IGZ1bmN0aW9uKHRhZzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogT2JqZWN0LCBjb250ZW50Pzogc3RyaW5nLCBjbG9zZVRhZz86IGJvb2xlYW4pOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAvKiBkZWZhdWx0IHBhcmFtZXRlciB2YWx1ZXMgKi9cclxuICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBjbG9zZVRhZyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qIEhUTUwgdGFnIGl0c2VsZiAqL1xyXG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICBpZiAoYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICByZXQgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKHYsIFwiJ1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGAke2t9PVwiJHt2fVwiIGA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBgJHtrfT0nJHt2fScgYDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNsb3NlVGFnKSB7XHJcbiAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgICAgIHJldCArPSBgPiR7Y29udGVudH08LyR7dGFnfT5gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldCArPSBcIi8+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZVRleHRBcmVhID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1ha2VFZGl0RmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZVBhc3N3b3JkRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXHJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uID0gZnVuY3Rpb24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBhdHRyaWJzID0ge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgYWxsb3dQcm9wZXJ0eVRvRGlzcGxheSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3RbcHJvcE5hbWVdID09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpc1JlYWRPbmx5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5yZWFkT25seVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpc0JpbmFyeVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuYmluYXJ5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gXCJzaW1wbGVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcE5hbWUgPT09IGpjckNuc3QuQ09OVEVOVCA/IFwiQ29udGVudFwiIDogcHJvcE5hbWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BOYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2Ugc3JjaCB7XHJcbiAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9zcmNoX3Jvd1wiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICBleHBvcnQgbGV0IHNlYXJjaFBhZ2VUaXRsZTogc3RyaW5nID0gXCJTZWFyY2ggUmVzdWx0c1wiO1xyXG4gICAgZXhwb3J0IGxldCB0aW1lbGluZVBhZ2VUaXRsZTogc3RyaW5nID0gXCJUaW1lbGluZVwiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgc2VhcmNoT2Zmc2V0ID0gMDtcclxuICAgIGV4cG9ydCBsZXQgdGltZWxpbmVPZmZzZXQgPSAwO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyBzZWFyY2ggaGFzIGJlZW4gZG9uZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyB0aW1lbGluZSBoYXMgYmVlbiBkb25lLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Um93Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICpcclxuICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICBleHBvcnQgbGV0IG51bVNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gc3JjaC5zZWFyY2hSZXN1bHRzICE9IG51bGwgJiYgLy9cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggIT0gbnVsbCA/IC8vXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZWFyY2hUYWJBY3RpdmF0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICogYW5kIG9wZW4gdXAgdGhlIHNlYXJjaCBkaWFsb2cuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAobmV3IFNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgc2VhcmNoUmVzdWx0cyA9IHJlcztcclxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gc2VhcmNoUmVzdWx0c1BhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgdXRpbC5zZXRIdG1sKFwic2VhcmNoUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2Uoc2VhcmNoUmVzdWx0c1BhbmVsKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgdGltZWxpbmVSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgIGxldCB0aW1lbGluZVJlc3VsdHNQYW5lbCA9IG5ldyBUaW1lbGluZVJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICB1dGlsLnNldEh0bWwoXCJ0aW1lbGluZVJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICB0aW1lbGluZVJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2VhcmNoRmlsZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5GaWxlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogMCxcclxuICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5TW9kVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5MQVNUX01PRElGSUVELFxyXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeUNyZWF0ZVRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IG51bGxcclxuICAgICAgICB9LCB0aW1lbGluZVJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluaXRTZWFyY2hOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgIG5vZGUudWlkID0gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKTtcclxuICAgICAgICB1aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2UgPSBmdW5jdGlvbihkYXRhLCB2aWV3TmFtZSkge1xyXG4gICAgICAgIHZhciBvdXRwdXQgPSAnJztcclxuICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvbiB0aGVcclxuICAgICAgICAgKiBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciByb3dDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICQuZWFjaChkYXRhLnNlYXJjaFJlc3VsdHMsIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgb3V0cHV0ICs9IHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWwodmlld05hbWUsIG91dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbmRlcnMgYSBzaW5nbGUgbGluZSBvZiBzZWFyY2ggcmVzdWx0cyBvbiB0aGUgc2VhcmNoIHJlc3VsdHMgcGFnZS5cclxuICAgICAqXHJcbiAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGUsIGluZGV4LCBjb3VudCwgcm93Q291bnQpIHtcclxuXHJcbiAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyU2VhcmNoUmVzdWx0OiBcIiArIHVpZCk7XHJcblxyXG4gICAgICAgIHZhciBjc3NJZCA9IHVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFySHRtbCA9IG1ha2VCdXR0b25CYXJIdG1sKFwiXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ1dHRvbkJhckh0bWw9XCIgKyBidXR0b25CYXJIdG1sKTtcclxuICAgICAgICB2YXIgY29udGVudCA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3cgaW5hY3RpdmUtcm93XCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBgc3JjaC5jbGlja09uU2VhcmNoUmVzdWx0Um93KHRoaXMsICcke3VpZH0nKTtgLCAvL1xyXG4gICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICBidXR0b25CYXJIdG1sLy9cclxuICAgICAgICAgICAgKyByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfc3JjaF9jb250ZW50XCJcclxuICAgICAgICAgICAgfSwgY29udGVudCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICB2YXIgZ290b0J1dHRvbiA9IHJlbmRlci5tYWtlQnV0dG9uKFwiR28gdG8gTm9kZVwiLCB1aWQsIGBzcmNoLmNsaWNrU2VhcmNoTm9kZSgnJHt1aWR9Jyk7YCk7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2xpY2tPblNlYXJjaFJlc3VsdFJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKSB7XHJcbiAgICAgICAgdW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICBoaWdobGlnaHRSb3dOb2RlID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNsaWNrU2VhcmNoTm9kZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNyY2guaGlnaGxpZ2h0Um93Tm9kZSA9IHNyY2gudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCB1aWQgaW4gc2VhcmNoIHJlc3VsdHM6IFwiICsgdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUsIHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gc3R5bGluZyBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYgKCFoaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICB2YXIgbm9kZUlkID0gaGlnaGxpZ2h0Um93Tm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAvKiBjaGFuZ2UgY2xhc3Mgb24gZWxlbWVudCAqL1xyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSBzaGFyZSB7XHJcblxyXG4gICAgbGV0IGZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2UpIHtcclxuICAgICAgICBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNoYXJpbmdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogSGFuZGxlcyAnU2hhcmluZycgYnV0dG9uIG9uIGEgc3BlY2lmaWMgbm9kZSwgZnJvbSBidXR0b24gYmFyIGFib3ZlIG5vZGUgZGlzcGxheSBpbiBlZGl0IG1vZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBlZGl0Tm9kZVNoYXJpbmcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBmaW5kU2hhcmVkTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmIChmb2N1c05vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzcmNoLnNlYXJjaFBhZ2VUaXRsZSA9IFwiU2hhcmVkIE5vZGVzXCI7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNoYXJlZE5vZGVzUmVxdWVzdCwganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlPihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogZm9jdXNOb2RlLmlkXHJcbiAgICAgICAgfSwgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UpO1xyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSB1c2VyIHtcclxuXHJcbiAgICBsZXQgbG9nb3V0UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9nb3V0UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCBJIHdhbnQgdG8gYWxsb3cgY2VydGFpbiB1c2VycyBhZGRpdGlvbmFsIHByaXZpbGVnZXMuIEEgYml0IG9mIGEgaGFjayBiZWNhdXNlIGl0IHdpbGwgZ29cclxuICAgICAqIGludG8gcHJvZHVjdGlvbiwgYnV0IG9uIG15IG93biBwcm9kdWN0aW9uIHRoZXNlIGFyZSBteSBcInRlc3RVc2VyQWNjb3VudHNcIiwgc28gbm8gcmVhbCB1c2VyIHdpbGwgYmUgYWJsZSB0b1xyXG4gICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaXNUZXN0VXNlckFjY291bnQgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImJvYlwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNvcnlcIiB8fCAvL1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gQlJBTkRJTkdfVElUTEVfU0hPUlQ7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogSWYgdXNlcnMgZ28gd2l0aCB2ZXJ5IGxvbmcgdXNlcm5hbWVzIHRoaXMgaXMgZ29ubmEgYmUgdWdseSAqL1xyXG4gICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgdGl0bGUgKz0gXCI6XCIgKyByZXMudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiI2hlYWRlckFwcE5hbWVcIikuaHRtbCh0aXRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogVE9ETy0zOiBtb3ZlIHRoaXMgaW50byBtZXRhNjQgbW9kdWxlICovXHJcbiAgICBleHBvcnQgbGV0IHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVJZCA9IHJlcy5yb290Tm9kZS5pZDtcclxuICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlUGF0aCA9IHJlcy5yb290Tm9kZS5wYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQudXNlck5hbWUgPSByZXMudXNlck5hbWU7XHJcbiAgICAgICAgbWV0YTY0LmlzQWRtaW5Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFkbWluXCI7XHJcbiAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlID0gcmVzLmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2ggPSByZXMuYWxsb3dGaWxlU3lzdGVtU2VhcmNoO1xyXG5cclxuICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzID0gcmVzLnVzZXJQcmVmZXJlbmNlcztcclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG4gICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSByZXMudXNlclByZWZlcmVuY2VzLnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIHNlcnZlcjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uPVwiICsgbWV0YTY0LmVkaXRNb2RlT3B0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5TaWdudXBQZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBXcml0ZSBhIGNvb2tpZSB0aGF0IGV4cGlyZXMgaW4gYSB5ZWFyIGZvciBhbGwgcGF0aHMgKi9cclxuICAgIGV4cG9ydCBsZXQgd3JpdGVDb29raWUgPSBmdW5jdGlvbihuYW1lLCB2YWwpOiB2b2lkIHtcclxuICAgICAgICAkLmNvb2tpZShuYW1lLCB2YWwsIHtcclxuICAgICAgICAgICAgZXhwaXJlczogMzY1LFxyXG4gICAgICAgICAgICBwYXRoOiAnLydcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBtZXRob2QgaXMgdWdseS4gSXQgaXMgdGhlIGJ1dHRvbiB0aGF0IGNhbiBiZSBsb2dpbiAqb3IqIGxvZ291dC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBvcGVuTG9naW5QZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsb2dpbkRsZzogTG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICBsb2dpbkRsZy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XHJcbiAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVmcmVzaExvZ2luID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luLlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNhbGxVc3I6IHN0cmluZztcclxuICAgICAgICBsZXQgY2FsbFB3ZDogc3RyaW5nO1xyXG4gICAgICAgIGxldCB1c2luZ0Nvb2tpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdmFyIGxvZ2luU2Vzc2lvblJlYWR5ID0gJChcIiNsb2dpblNlc3Npb25SZWFkeVwiKS50ZXh0KCk7XHJcbiAgICAgICAgaWYgKGxvZ2luU2Vzc2lvblJlYWR5ID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IHRydWVcIik7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHVzaW5nIGJsYW5rIGNyZWRlbnRpYWxzIHdpbGwgY2F1c2Ugc2VydmVyIHRvIGxvb2sgZm9yIGEgdmFsaWQgc2Vzc2lvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2FsbFVzciA9IFwiXCI7XHJcbiAgICAgICAgICAgIGNhbGxQd2QgPSBcIlwiO1xyXG4gICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gZmFsc2VcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbG9naW5TdGF0ZTogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgd2UgaGF2ZSBrbm93biBzdGF0ZSBhcyBsb2dnZWQgb3V0LCB0aGVuIGRvIG5vdGhpbmcgaGVyZSAqL1xyXG4gICAgICAgICAgICBpZiAobG9naW5TdGF0ZSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHVzcjogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgbGV0IHB3ZDogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuXHJcbiAgICAgICAgICAgIHVzaW5nQ29va2llcyA9ICF1dGlsLmVtcHR5U3RyaW5nKHVzcikgJiYgIXV0aWwuZW1wdHlTdHJpbmcocHdkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb29raWVVc2VyPVwiICsgdXNyICsgXCIgdXNpbmdDb29raWVzID0gXCIgKyB1c2luZ0Nvb2tpZXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogZW1weXQgY3JlZGVudGlhbHMgY2F1c2VzIHNlcnZlciB0byB0cnkgdG8gbG9nIGluIHdpdGggYW55IGFjdGl2ZSBzZXNzaW9uIGNyZWRlbnRpYWxzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2FsbFVzciA9IHVzciA/IHVzciA6IFwiXCI7XHJcbiAgICAgICAgICAgIGNhbGxQd2QgPSBwd2QgPyBwd2QgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4gd2l0aCBuYW1lOiBcIiArIGNhbGxVc3IpO1xyXG5cclxuICAgICAgICBpZiAoIWNhbGxVc3IpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogY2FsbFVzcixcclxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogY2FsbFB3ZCxcclxuICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ291dCA9IGZ1bmN0aW9uKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uTG9nb3V0UmVxdWVzdCwganNvbi5Mb2dvdXRSZXNwb25zZT4oXCJsb2dvdXRcIiwge30sIGxvZ291dFJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ2luID0gZnVuY3Rpb24obG9naW5EbGcsIHVzciwgcHdkKSB7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzcixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgdXNyLCBwd2QsIG51bGwsIGxvZ2luRGxnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGRlbGV0ZUFsbFVzZXJDb29raWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLkxvZ2luUmVzcG9uc2UsIHVzcj86IHN0cmluZywgcHdkPzogc3RyaW5nLCB1c2luZ0Nvb2tpZXM/OiBib29sZWFuLCBsb2dpbkRsZz86IExvZ2luRGxnKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTG9naW5cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luUmVzcG9uc2U6IHVzcj1cIiArIHVzciArIFwiIGhvbWVOb2RlT3ZlcnJpZGU6IFwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVzciAhPSBcImFub255bW91c1wiKSB7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IsIHVzcik7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QsIHB3ZCk7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIxXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobG9naW5EbGcpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlOiBcIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZSBpcyBudWxsLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogc2V0IElEIHRvIGJlIHRoZSBwYWdlIHdlIHdhbnQgdG8gc2hvdyB1c2VyIHJpZ2h0IGFmdGVyIGxvZ2luICovXHJcbiAgICAgICAgICAgIGxldCBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdXRpbC5lbXB0eVN0cmluZyhyZXMuaG9tZU5vZGVPdmVycmlkZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZU92ZXJyaWRlPVwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG4gICAgICAgICAgICAgICAgaWQgPSByZXMuaG9tZU5vZGVPdmVycmlkZTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlID0gaWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBsYXN0Tm9kZT1cIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlSWQ9XCIgKyBtZXRhNjQuaG9tZU5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShpZCwgZmFsc2UsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkNvb2tpZSBsb2dpbiBmYWlsZWQuXCIpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGJsb3cgYXdheSBmYWlsZWQgY29va2llIGNyZWRlbnRpYWxzIGFuZCByZWxvYWQgcGFnZSwgc2hvdWxkIHJlc3VsdCBpbiBicmFuZCBuZXcgcGFnZSBsb2FkIGFzIGFub25cclxuICAgICAgICAgICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgIGxldCByZWZyZXNoTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW5SZXNwb25zZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHVzZXIuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIHVzZXIuc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2UgdmlldyB7XHJcblxyXG4gICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgZXhwb3J0IGxldCB1cGRhdGVTdGF0dXNCYXIgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgc3RhdHVzTGluZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCIgU2VsZWN0aW9uczogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQobWV0YTY0LnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogbmV3SWQgaXMgb3B0aW9uYWwgcGFyYW1ldGVyIHdoaWNoLCBpZiBzdXBwbGllZCwgc2hvdWxkIGJlIHRoZSBpZCB3ZSBzY3JvbGwgdG8gd2hlbiBmaW5hbGx5IGRvbmUgd2l0aCB0aGVcclxuICAgICAqIHJlbmRlci5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIHRhcmdldElkPzogYW55LCBzY3JvbGxUb1RvcD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcywgc2Nyb2xsVG9Ub3ApO1xyXG5cclxuICAgICAgICBpZiAoc2Nyb2xsVG9Ub3ApIHtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldElkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZCh0YXJnZXRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI21haW5Ob2RlQ29udGVudFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogbmV3SWQgaXMgb3B0aW9uYWwgYW5kIGlmIHNwZWNpZmllZCBtYWtlcyB0aGUgcGFnZSBzY3JvbGwgdG8gYW5kIGhpZ2hsaWdodCB0aGF0IG5vZGUgdXBvbiByZS1yZW5kZXJpbmcuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWUgPSBmdW5jdGlvbihub2RlSWQ/OiBhbnksIHJlbmRlclBhcmVudElmTGVhZj86IGFueSwgaGlnaGxpZ2h0SWQ/OiBhbnksIGlzSW5pdGlhbFJlbmRlcj86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIW5vZGVJZCkge1xyXG4gICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVmcmVzaGluZyB0cmVlOiBub2RlSWQ9XCIgKyBub2RlSWQpO1xyXG4gICAgICAgIGlmICghaGlnaGxpZ2h0SWQpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBoaWdobGlnaHRJZCA9IGN1cnJlbnRTZWxOb2RlICE9IG51bGwgPyBjdXJyZW50U2VsTm9kZS5pZCA6IG5vZGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgSSBkb24ndCBrbm93IG9mIGFueSByZWFzb24gJ3JlZnJlc2hUcmVlJyBzaG91bGQgaXRzZWxmIHJlc2V0IHRoZSBvZmZzZXQsIGJ1dCBJIGxlYXZlIHRoaXMgY29tbWVudCBoZXJlXHJcbiAgICAgICAgYXMgYSBoaW50IGZvciB0aGUgZnV0dXJlLlxyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAqL1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogcmVuZGVyUGFyZW50SWZMZWFmID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICBcIm9mZnNldFwiOiBuYXYubWFpbk9mZnNldCxcclxuICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSByZXMub2Zmc2V0T2ZOb2RlRm91bmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIGhpZ2hsaWdodElkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0luaXRpYWxSZW5kZXIgJiYgbWV0YTY0LnVybENtZCA9PSBcImFkZE5vZGVcIiAmJiBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdC5lZGl0TW9kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShtZXRhNjQuY3VycmVudE5vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZmlyc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGZpcnN0UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgbG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcHJldlBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgcHJldlBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgLT0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0IDwgMCkge1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvYWRQYWdlKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHRQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ICs9IG5hdi5ST1dTX1BFUl9QQUdFO1xyXG4gICAgICAgIGxvYWRQYWdlKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxhc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGxhc3RQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgIC8vbmF2Lm1haW5PZmZzZXQgKz0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgbG9hZFBhZ2UodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGxvYWRQYWdlID0gZnVuY3Rpb24oZ29Ub0xhc3RQYWdlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IHRydWUsXHJcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IG5hdi5tYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBnb1RvTGFzdFBhZ2VcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChnb1RvTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gcmVzLm9mZnNldE9mTm9kZUZvdW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlZnJlc2hUcmVlUmVzcG9uc2UocmVzLCBudWxsLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAqIHNjcm9sbFRvVG9wLCBhbmQgdGhlbiBzb21lIG90aGVyIGNvZGUgc2Nyb2xscyB0byBhIHNwZWNpZmljIGxvY2F0aW9uIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIuIHRoZVxyXG4gICAgICogJ3BlbmRpbmcnIGJvb2xlYW4gaGVyZSBpcyBhIGNydXRjaCBmb3Igbm93IHRvIGhlbHAgdmlzdWFsIGFwcGVhbCAoaS5lLiBzdG9wIGlmIGZyb20gc2Nyb2xsaW5nIHRvIG9uZSBwbGFjZVxyXG4gICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsbTogYW55ID0gbmF2LmdldFNlbGVjdGVkUG9seUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBmaW5kIGEgc2VsZWN0ZWQgbm9kZSBvbiB0aGlzIHBhZ2UsIHNjcm9sbCB0b1xyXG4gICAgICAgICAgICAvLyB0b3AgaW5zdGVhZC5cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Db250YWluZXJcIikuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IHJlbW92ZWQgbWFpblBhcGVyVGFicyBmcm9tIHZpc2liaWxpdHksIGJ1dCB3aGF0IGNvZGUgc2hvdWxkIGdvIGhlcmUgbm93P1xyXG4gICAgICAgICAgICAgICAgLy8gZWxtID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vbGV0IGUgPSAkKFwiI21haW5Db250YWluZXJcIik7XHJcbiAgICAgICAgJChcIiNtYWluQ29udGFpbmVyXCIpLnNjcm9sbFRvcCgwKTtcclxuXHJcbiAgICAgICAgLy90b2RvLTA6IG5vdCB1c2luZyBtYWluUGFwZXJUYWJzIGFueSBsb25nZXIgc28gc2h3IHNob3VsZCBnbyBoZXJlIG5vdyA/XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbml0RWRpdFBhdGhEaXNwbGF5QnlJZCA9IGZ1bmN0aW9uKGRvbUlkOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGVkaXQuZWRpdE5vZGU7XHJcbiAgICAgICAgbGV0IGU6IGFueSA9ICQoXCIjXCIgKyBkb21JZCk7XHJcbiAgICAgICAgaWYgKCFlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xyXG4gICAgICAgICAgICBlLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIGUuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoRGlzcGxheSA9IFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRvZG8tMjogRG8gd2UgcmVhbGx5IG5lZWQgSUQgaW4gYWRkaXRpb24gdG8gUGF0aCBoZXJlP1xyXG4gICAgICAgICAgICAvLyBwYXRoRGlzcGxheSArPSBcIjxicj5JRDogXCIgKyBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoRGlzcGxheSArPSBcIjxicj5Nb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5odG1sKHBhdGhEaXNwbGF5KTtcclxuICAgICAgICAgICAgZS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2hvd1NlcnZlckluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5HZXRTZXJ2ZXJJbmZvUmVxdWVzdCwganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2U+KFwiZ2V0U2VydmVySW5mb1wiLCB7fSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcocmVzLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxubmFtZXNwYWNlIG1lbnVQYW5lbCB7XHJcblxyXG4gICAgbGV0IG1ha2VUb3BMZXZlbE1lbnUgPSBmdW5jdGlvbih0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcGFwZXJJdGVtQXR0cnMgPSB7XHJcbiAgICAgICAgICAgIGNsYXNzOiBcIm1lbnUtdHJpZ2dlclwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBhcGVySXRlbSA9IHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHBhcGVySXRlbUF0dHJzLCB0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBwYXBlclN1Ym1lbnVBdHRycyA9IHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaWQpIHtcclxuICAgICAgICAgICAgKDxhbnk+cGFwZXJTdWJtZW51QXR0cnMpLmlkID0gaWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXN1Ym1lbnVcIiwgcGFwZXJTdWJtZW51QXR0cnNcclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwibWV0YTY0LW1lbnUtaGVhZGluZ1wiLFxyXG4gICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdFwiXHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAsIHBhcGVySXRlbSArIC8vXCI8cGFwZXItaXRlbSBjbGFzcz0nbWVudS10cmlnZ2VyJz5cIiArIHRpdGxlICsgXCI8L3BhcGVyLWl0ZW0+XCIgKyAvL1xyXG4gICAgICAgICAgICBtYWtlU2Vjb25kTGV2ZWxMaXN0KGNvbnRlbnQpLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWFrZVNlY29uZExldmVsTGlzdCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1tZW51XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICAvLyxcclxuICAgICAgICAgICAgLy9cIm11bHRpXCI6IFwibXVsdGlcIlxyXG4gICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtZW51SXRlbSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGljayxcclxuICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZG9tSWQ6IHN0cmluZyA9IFwibWFpbkFwcE1lbnVcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IGJ1aWxkID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIEkgZW5kZWQgdXAgbm90IHJlYWxseSBsaWtpbmcgdGhpcyB3YXkgb2Ygc2VsZWN0aW5nIHRhYnMuIEkgY2FuIGp1c3QgdXNlIG5vcm1hbCBwb2x5bWVyIHRhYnMuXHJcbiAgICAgICAgLy8gdmFyIHBhZ2VNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgIC8vICAgICBtZW51SXRlbShcIk1haW5cIiwgXCJtYWluUGFnZUJ1dHRvblwiLCBcIm1ldGE2NC5zZWxlY3RUYWIoJ21haW5UYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJTZWFyY2hcIiwgXCJzZWFyY2hQYWdlQnV0dG9uXCIsIFwibWV0YTY0LnNlbGVjdFRhYignc2VhcmNoVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZVBhZ2VCdXR0b25cIiwgXCJtZXRhNjQuc2VsZWN0VGFiKCd0aW1lbGluZVRhYk5hbWUnKTtcIik7XHJcbiAgICAgICAgLy8gdmFyIHBhZ2VNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlBhZ2VcIiwgcGFnZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciByc3NJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRmVlZHNcIiwgXCJtYWluTWVudVJzc1wiLCBcIm5hdi5vcGVuUnNzRmVlZHNOb2RlKCk7XCIpO1xyXG4gICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1ha2VUb3BMZXZlbE1lbnUoXCJSU1NcIiwgcnNzSXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgZWRpdE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlXCIsIFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBcImVkaXQuY3JlYXRlTm9kZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsIFwiKG5ldyBSZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkN1dFwiLCBcImN1dFNlbE5vZGVzQnV0dG9uXCIsIFwiZWRpdC5jdXRTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiUGFzdGVcIiwgXCJwYXN0ZVNlbE5vZGVzQnV0dG9uXCIsIFwiZWRpdC5wYXN0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwiZWRpdC5jbGVhclNlbGVjdGlvbnMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IEltcG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJFeHBvcnRcIiwgXCJvcGVuRXhwb3J0RGxnXCIsIFwiKG5ldyBFeHBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlXCIsIFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpO1xyXG4gICAgICAgIHZhciBlZGl0TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJFZGl0XCIsIGVkaXRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgbW92ZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBcIiwgXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIFwiZWRpdC5tb3ZlTm9kZVVwKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJEb3duXCIsIFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIFwiZWRpdC5tb3ZlTm9kZURvd24oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcInRvIFRvcFwiLCBcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgXCJlZGl0Lm1vdmVOb2RlVG9Ub3AoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcInRvIEJvdHRvbVwiLCBcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgXCJlZGl0Lm1vdmVOb2RlVG9Cb3R0b20oKTtcIik7Ly9cclxuICAgICAgICB2YXIgbW92ZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiTW92ZVwiLCBtb3ZlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIEZpbGVcIiwgXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCBcImF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21GaWxlRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsIFwiYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbVVybERsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcImF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICB2YXIgYXR0YWNobWVudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQXR0YWNoXCIsIGF0dGFjaG1lbnRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcmluZ01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRWRpdCBOb2RlIFNoYXJpbmdcIiwgXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgXCJzaGFyZS5lZGl0Tm9kZVNoYXJpbmcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwic2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgIHZhciBzaGFyaW5nTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTaGFyZVwiLCBzaGFyaW5nTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHNlYXJjaE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiQ29udGVudFwiLCBcImNvbnRlbnRTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IFNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1wiKSArLy9cclxuICAgICAgICAgICAgLy90b2RvLTA6IG1ha2UgYSB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgdGhhdCBkb2VzIGEgdGFnIHNlYXJjaFxyXG4gICAgICAgICAgICBtZW51SXRlbShcIlRhZ3NcIiwgXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IFNlYXJjaFRhZ3NEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRmlsZXNcIiwgXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBTZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHNlYXJjaE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2VhcmNoXCIsIHNlYXJjaE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciB0aW1lbGluZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlZFwiLCBcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCBcInNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiTW9kaWZpZWRcIiwgXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsIFwic3JjaC50aW1lbGluZUJ5TW9kVGltZSgpO1wiKTsvL1xyXG4gICAgICAgIHZhciB0aW1lbGluZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVGltZWxpbmVcIiwgdGltZWxpbmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlRvZ2dsZSBQcm9wZXJ0aWVzXCIsIFwicHJvcHNUb2dnbGVCdXR0b25cIiwgXCJwcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiUmVmcmVzaFwiLCBcInJlZnJlc2hQYWdlQnV0dG9uXCIsIFwibWV0YTY0LnJlZnJlc2goKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwicmVuZGVyLnNob3dOb2RlVXJsKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJQcmVmZXJlbmNlc1wiLCBcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCBcIihuZXcgUHJlZnNEbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlZpZXdcIiwgdmlld09wdGlvbnNNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAvLyBXT1JLIElOIFBST0dSRVNTICggZG8gbm90IGRlbGV0ZSlcclxuICAgICAgICAvLyB2YXIgZmlsZVN5c3RlbU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiUmVpbmRleFwiLCBcImZpbGVTeXNSZWluZGV4QnV0dG9uXCIsIFwic3lzdGVtZm9sZGVyLnJlaW5kZXgoKTtcIikgKyAvL1xyXG4gICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcImZpbGVTeXNTZWFyY2hCdXR0b25cIiwgXCJzeXN0ZW1mb2xkZXIuc2VhcmNoKCk7XCIpOyAvL1xyXG4gICAgICAgIC8vICAgICAvL21lbnVJdGVtKFwiQnJvd3NlXCIsIFwiZmlsZVN5c0Jyb3dzZUJ1dHRvblwiLCBcInN5c3RlbWZvbGRlci5icm93c2UoKTtcIik7XHJcbiAgICAgICAgLy8gdmFyIGZpbGVTeXN0ZW1NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkZpbGVTeXNcIiwgZmlsZVN5c3RlbU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogd2hhdGV2ZXIgaXMgY29tbWVudGVkIGlzIG9ubHkgY29tbWVudGVkIGZvciBwb2x5bWVyIGNvbnZlcnNpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgbXlBY2NvdW50SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgXCIobmV3IENoYW5nZVBhc3N3b3JkRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIk1hbmFnZSBBY2NvdW50XCIsIFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCBcIihuZXcgTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG5cclxuICAgICAgICAvLyBtZW51SXRlbShcIkZ1bGwgUmVwb3NpdG9yeSBFeHBvcnRcIiwgXCJmdWxsUmVwb3NpdG9yeUV4cG9ydFwiLCBcIlxyXG4gICAgICAgIC8vIGVkaXQuZnVsbFJlcG9zaXRvcnlFeHBvcnQoKTtcIikgKyAvL1xyXG4gICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgYWRtaW5JdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiR2VuZXJhdGUgUlNTXCIsIFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgXCJwb2RjYXN0LmdlbmVyYXRlUlNTKCk7XCIpICsvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlNlcnZlciBJbmZvXCIsIFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgXCJ2aWV3LnNob3dTZXJ2ZXJJbmZvKCk7XCIpICsvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkluc2VydCBCb29rOiBXYXIgYW5kIFBlYWNlXCIsIFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIFwiZWRpdC5pbnNlcnRCb29rV2FyQW5kUGVhY2UoKTtcIik7IC8vXHJcbiAgICAgICAgdmFyIGFkbWluTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBZG1pblwiLCBhZG1pbkl0ZW1zLCBcImFkbWluTWVudVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFpbiBNZW51IEhlbHBcIiwgXCJtYWluTWVudUhlbHBcIiwgXCJuYXYub3Blbk1haW5NZW51SGVscCgpO1wiKTtcclxuICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IC8qIHBhZ2VNZW51KyAqLyBtYWluTWVudVJzcyArIGVkaXRNZW51ICsgbW92ZU1lbnUgKyBhdHRhY2htZW50TWVudSArIHNoYXJpbmdNZW51ICsgdmlld09wdGlvbnNNZW51IC8qICsgZmlsZVN5c3RlbU1lbnUgKi8gKyBzZWFyY2hNZW51ICsgdGltZWxpbmVNZW51ICsgbXlBY2NvdW50TWVudVxyXG4gICAgICAgICAgICArIGFkbWluTWVudSArIG1haW5NZW51SGVscDtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRIdG1sKGRvbUlkLCBjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluaXQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxufVxyXG5cbi8qXG5OT1RFOiBUaGUgQXVkaW9QbGF5ZXJEbGcgQU5EIHRoaXMgc2luZ2xldG9uLWlzaCBjbGFzcyBib3RoIHNoYXJlIHNvbWUgc3RhdGUgYW5kIGNvb3BlcmF0ZVxuXG5SZWZlcmVuY2U6IGh0dHBzOi8vd3d3LnczLm9yZy8yMDEwLzA1L3ZpZGVvL21lZGlhZXZlbnRzLmh0bWxcbiovXG5uYW1lc3BhY2UgcG9kY2FzdCB7XG4gICAgZXhwb3J0IGxldCBwbGF5ZXI6IGFueSA9IG51bGw7XG4gICAgZXhwb3J0IGxldCBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIgPSBudWxsO1xuXG4gICAgbGV0IHVpZDogc3RyaW5nID0gbnVsbDtcbiAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XG4gICAgbGV0IGFkU2VnbWVudHM6IEFkU2VnbWVudFtdID0gbnVsbDtcblxuICAgIGxldCBwdXNoVGltZXI6IGFueSA9IG51bGw7XG5cbiAgICBleHBvcnQgbGV0IGdlbmVyYXRlUlNTID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIHV0aWwuanNvbjxqc29uLkdlbmVyYXRlUlNTUmVxdWVzdCwganNvbi5HZW5lcmF0ZVJTU1Jlc3BvbnNlPihcImdlbmVyYXRlUlNTXCIsIHtcbiAgICAgICAgfSwgZ2VuZXJhdGVSU1NSZXNwb25zZSk7XG4gICAgfVxuXG4gICAgbGV0IGdlbmVyYXRlUlNTUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgYWxlcnQoJ3JzcyBjb21wbGV0ZS4nKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlbmRlckZlZWROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCB0aXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZFRpdGxlXCIsIG5vZGUpO1xuICAgICAgICBsZXQgZGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZERlc2NcIiwgbm9kZSk7XG4gICAgICAgIGxldCBpbWdVcmw6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWRJbWFnZVVybFwiLCBub2RlKTtcblxuICAgICAgICBsZXQgZmVlZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICB9LCB0aXRsZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgfSwgZGVzYy52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICB9LCBmZWVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltZ1VybCkge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXgtd2lkdGg6IDIwMHB4O1wiLFxuICAgICAgICAgICAgICAgIFwic3JjXCI6IGltZ1VybC52YWx1ZVxuICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGxpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICBpZiAobGluayAmJiBsaW5rLnZhbHVlICYmIHV0aWwuY29udGFpbnMobGluay52YWx1ZS50b0xvd2VyQ2FzZSgpLCBcIi5tcDNcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVyaToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLCBub2RlKTtcbiAgICAgICAgaWYgKHVyaSAmJiB1cmkudmFsdWUgJiYgdXRpbC5jb250YWlucyh1cmkudmFsdWUudG9Mb3dlckNhc2UoKSwgXCIubXAzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJpLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVuY1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1VybFwiLCBub2RlKTtcbiAgICAgICAgaWYgKGVuY1VybCAmJiBlbmNVcmwudmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBlbmNUeXBlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRW5jVHlwZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChlbmNUeXBlICYmIGVuY1R5cGUudmFsdWUgJiYgdXRpbC5zdGFydHNXaXRoKGVuY1R5cGUudmFsdWUsIFwiYXVkaW8vXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY1VybC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVuZGVySXRlbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgIGxldCByc3NEZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLCBub2RlKTtcbiAgICAgICAgbGV0IHJzc0F1dGhvcjoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUF1dGhvclwiLCBub2RlKTtcbiAgICAgICAgbGV0IHJzc0xpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICBsZXQgcnNzVXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuXG4gICAgICAgIGxldCBlbnRyeTogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICBpZiAocnNzTGluayAmJiByc3NMaW5rLnZhbHVlICYmIHJzc1RpdGxlICYmIHJzc1RpdGxlLnZhbHVlKSB7XG4gICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJocmVmXCI6IHJzc0xpbmsudmFsdWVcbiAgICAgICAgICAgIH0sIHJlbmRlci50YWcoXCJoM1wiLCB7fSwgcnNzVGl0bGUudmFsdWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwbGF5ZXJVcmwgPSBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlKG5vZGUpO1xuICAgICAgICBpZiAocGxheWVyVXJsKSB7XG4gICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Qub3BlblBsYXllckRpYWxvZygnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJQbGF5XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJzc0Rlc2MgJiYgcnNzRGVzYy52YWx1ZSkge1xuICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgfSwgcnNzRGVzYy52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocnNzQXV0aG9yICYmIHJzc0F1dGhvci52YWx1ZSkge1xuICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICB9LCBcIkJ5OiBcIiArIHJzc0F1dGhvci52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICB9LCBlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbnRyeSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWREZXNjXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkTGlua1wiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFVyaVwiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFNyY1wiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCJdO1xuXG4gICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbURlc2NcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtVXJpXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCJdO1xuXG4gICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBvcGVuUGxheWVyRGlhbG9nID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgIHVpZCA9IF91aWQ7XG4gICAgICAgIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XG5cbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGxldCBtcDNVcmwgPSBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKG1wM1VybCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLkdldFBsYXllckluZm9SZXNwb25zZT4oXCJnZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogbXAzVXJsXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFBsYXllckluZm9SZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFVpZCh1aWQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGxnID0gbmV3IEF1ZGlvUGxheWVyRGxnKG1wM1VybCwgdWlkLCByZXMudGltZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGRsZy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcGFyc2VBZFNlZ21lbnRVaWQgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGxldCBhZFNlZ3M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwiYWQtc2VnbWVudHNcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAoYWRTZWdzKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VBZFNlZ21lbnRUZXh0KGFkU2Vncy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIG5vZGUgdWlkOiBcIiArIHVpZDtcbiAgICB9XG5cbiAgICBsZXQgcGFyc2VBZFNlZ21lbnRUZXh0ID0gZnVuY3Rpb24oYWRTZWdzOiBzdHJpbmcpIHtcbiAgICAgICAgYWRTZWdtZW50cyA9IFtdO1xuXG4gICAgICAgIGxldCBzZWdMaXN0OiBzdHJpbmdbXSA9IGFkU2Vncy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgZm9yIChsZXQgc2VnIG9mIHNlZ0xpc3QpIHtcbiAgICAgICAgICAgIGxldCBzZWdUaW1lczogc3RyaW5nW10gPSBzZWcuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgaWYgKHNlZ1RpbWVzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgcmFuZ2U6IFwiICsgc2VnKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGJlZ2luU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1swXSk7XG4gICAgICAgICAgICBsZXQgZW5kU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1sxXSk7XG5cbiAgICAgICAgICAgIGFkU2VnbWVudHMucHVzaChuZXcgQWRTZWdtZW50KGJlZ2luU2VjcywgZW5kU2VjcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogY29udmVydCBmcm9tIGZvbXJhdCBcIm1pbnV0ZXM6c2Vjb250c1wiIHRvIGFic29sdXRlIG51bWJlciBvZiBzZWNvbmRzXG4gICAgKlxuICAgICogdG9kby0wOiBtYWtlIHRoaXMgYWNjZXB0IGp1c3Qgc2Vjb25kcywgb3IgbWluOnNlYywgb3IgaG91cjptaW46c2VjLCBhbmQgYmUgYWJsZSB0b1xuICAgICogcGFyc2UgYW55IG9mIHRoZW0gY29ycmVjdGx5LlxuICAgICovXG4gICAgbGV0IGNvbnZlcnRUb1NlY29uZHMgPSBmdW5jdGlvbih0aW1lVmFsOiBzdHJpbmcpIHtcbiAgICAgICAgLyogZW5kIHRpbWUgaXMgZGVzaWduYXRlZCB3aXRoIGFzdGVyaXNrIGJ5IHVzZXIsIGFuZCByZXByZXNlbnRlZCBieSAtMSBpbiB2YXJpYWJsZXMgKi9cbiAgICAgICAgaWYgKHRpbWVWYWwgPT0gJyonKSByZXR1cm4gLTE7XG4gICAgICAgIGxldCB0aW1lUGFydHM6IHN0cmluZ1tdID0gdGltZVZhbC5zcGxpdChcIjpcIik7XG4gICAgICAgIGlmICh0aW1lUGFydHMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHZhbHVlOiBcIiArIHRpbWVWYWwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMF0pLnZhbHVlT2YoKTtcbiAgICAgICAgbGV0IHNlY29uZHMgPSBuZXcgTnVtYmVyKHRpbWVQYXJ0c1sxXSkudmFsdWVPZigpO1xuICAgICAgICByZXR1cm4gbWludXRlcyAqIDYwICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlc3RvcmVTdGFydFRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLyogbWFrZXMgcGxheWVyIGFsd2F5cyBzdGFydCB3aGVyZXZlciB0aGUgdXNlciBsYXN0IHdhcyB3aGVuIHRoZXkgY2xpY2tlZCBcInBhdXNlXCIgKi9cbiAgICAgICAgaWYgKHBsYXllciAmJiBzdGFydFRpbWVQZW5kaW5nKSB7XG4gICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzdGFydFRpbWVQZW5kaW5nO1xuICAgICAgICAgICAgc3RhcnRUaW1lUGVuZGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IG9uQ2FuUGxheSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICBwbGF5ZXIgPSBlbG07XG4gICAgICAgIHJlc3RvcmVTdGFydFRpbWUoKTtcbiAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IG9uVGltZVVwZGF0ZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIXB1c2hUaW1lcikge1xuICAgICAgICAgICAgLyogcGluZyBzZXJ2ZXIgb25jZSBldmVyeSBmaXZlIG1pbnV0ZXMgKi9cbiAgICAgICAgICAgIHB1c2hUaW1lciA9IHNldEludGVydmFsKHB1c2hUaW1lckZ1bmN0aW9uLCA1ICogNjAgKiAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ3VycmVudFRpbWU9XCIgKyBlbG0uY3VycmVudFRpbWUpO1xuICAgICAgICBwbGF5ZXIgPSBlbG07XG5cbiAgICAgICAgLyogdG9kby0xOiB3ZSBjYWxsIHJlc3RvcmVTdGFydFRpbWUgdXBvbiBsb2FkaW5nIG9mIHRoZSBjb21wb25lbnQgYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBoYXZlIHRoZSBlZmZlY3QgZG9pbmcgYW55dGhpbmcgYXQgYWxsXG4gICAgICAgIGFuZCBjYW4ndCBldmVuIHVwZGF0ZSB0aGUgc2xpZGVyIGRpc3BsYXllZCBwb3NpdGlvbiwgdW50aWwgcGxheWlucyBpcyBTVEFSVEVELiBOZWVkIHRvIGNvbWUgYmFjayBhbmQgZml4IHRoaXMgYmVjYXVzZSB1c2Vyc1xuICAgICAgICBjdXJyZW50bHkgaGF2ZSB0aGUgZ2xpdGNoIG9mIGFsd2F5cyBoZWFyaW5nIHRoZSBmaXJzdCBmcmFjdGlvbiBvZiBhIHNlY29uZCBvZiB2aWRlbywgd2hpY2ggb2YgY291cnNlIGFub3RoZXIgd2F5IHRvIGZpeFxuICAgICAgICB3b3VsZCBiZSBieSBhbHRlcmluZyB0aGUgdm9sdW1uIHRvIHplcm8gdW50aWwgcmVzdG9yZVN0YXJ0VGltZSBoYXMgZ29uZSBpbnRvIGVmZmVjdCAqL1xuICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG5cbiAgICAgICAgaWYgKCFhZFNlZ21lbnRzKSByZXR1cm47XG4gICAgICAgIGZvciAobGV0IHNlZyBvZiBhZFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAvKiBlbmRUaW1lIG9mIC0xIG1lYW5zIHRoZSByZXN0IG9mIHRoZSBtZWRpYSBzaG91bGQgYmUgY29uc2lkZXJlZCBBRHMgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIuY3VycmVudFRpbWUgPj0gc2VnLmJlZ2luVGltZSAmJiAvL1xuICAgICAgICAgICAgICAgIChwbGF5ZXIuY3VycmVudFRpbWUgPD0gc2VnLmVuZFRpbWUgfHwgc2VnLmVuZFRpbWUgPCAwKSkge1xuXG4gICAgICAgICAgICAgICAgLyoganVtcCB0byBlbmQgb2YgYXVkaW8gaWYgcmVzdCBpcyBhbiBhZGQsIHdpdGggbG9naWMgb2YgLTMgdG8gZW5zdXJlIHdlIGRvbid0XG4gICAgICAgICAgICAgICAgZ28gaW50byBhIGxvb3AganVtcGluZyB0byBlbmQgb3ZlciBhbmQgb3ZlciBhZ2FpbiAqL1xuICAgICAgICAgICAgICAgIGlmIChzZWcuZW5kVGltZSA8IDAgJiYgcGxheWVyLmN1cnJlbnRUaW1lIDwgcGxheWVyLmR1cmF0aW9uIC0gMykge1xuICAgICAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGxhc3QgdG8gc2Vjb25kcyBvZiBhdWRpbywgaSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgcGF1c2luZywgaW4gY2FzZVxuICAgICAgICAgICAgICAgICAgICAgdGhlcmUgYXJlIGlzIG1vcmUgYXVkaW8gYXV0b21hdGljYWxseSBhYm91dCB0byBwbGF5LCB3ZSBkb24ndCB3YW50IHRvIGhhbHQgaXQgYWxsICovXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHBsYXllci5kdXJhdGlvbiAtIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIG9yIGVsc2Ugd2UgYXJlIGluIGEgY29tZXJjaWFsIHNlZ21lbnQgc28ganVtcCB0byBvbmUgc2Vjb25kIHBhc3QgaXQgKi9cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc2VnLmVuZFRpbWUgKyAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qIHRvZG8tMDogZm9yIHByb2R1Y3Rpb24sIGJvb3N0IHRoaXMgdXAgdG8gb25lIG1pbnV0ZSAqL1xuICAgIGV4cG9ydCBsZXQgcHVzaFRpbWVyRnVuY3Rpb24gPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcInB1c2hUaW1lclwiKTtcbiAgICAgICAgLyogdGhlIHB1cnBvc2Ugb2YgdGhpcyB0aW1lciBpcyB0byBiZSBzdXJlIHRoZSBicm93c2VyIHNlc3Npb24gZG9lc24ndCB0aW1lb3V0IHdoaWxlIHVzZXIgaXMgcGxheWluZ1xuICAgICAgICBidXQgaWYgdGhlIG1lZGlhIGlzIHBhdXNlZCB3ZSBETyBhbGxvdyBpdCB0byB0aW1lb3V0LiBPdGh3ZXJ3aXNlIGlmIHVzZXIgaXMgbGlzdGVuaW5nIHRvIGF1ZGlvLCB3ZVxuICAgICAgICBjb250YWN0IHRoZSBzZXJ2ZXIgZHVyaW5nIHRoaXMgdGltZXIgdG8gdXBkYXRlIHRoZSB0aW1lIG9uIHRoZSBzZXJ2ZXIgQU5EIGtlZXAgc2Vzc2lvbiBmcm9tIHRpbWluZyBvdXRcblxuICAgICAgICB0b2RvLTA6IHdvdWxkIGV2ZXJ5dGhpbmcgd29yayBpZiAncGxheWVyJyBXQVMgdGhlIGpxdWVyeSBvYmplY3QgYWx3YXlzLlxuICAgICAgICAqL1xuICAgICAgICBpZiAocGxheWVyICYmICFwbGF5ZXIucGF1c2VkKSB7XG4gICAgICAgICAgICAvKiB0aGlzIHNhZmV0eSBjaGVjayB0byBiZSBzdXJlIG5vIGhpZGRlbiBhdWRpbyBjYW4gc3RpbGwgYmUgcGxheWluZyBzaG91bGQgbm8gbG9uZ2VyIGJlIG5lZWRlZFxuICAgICAgICAgICAgbm93IHRoYXQgSSBoYXZlIHRoZSBjbG9zZSBsaXRlbmVyIGV2ZW4gb24gdGhlIGRpYWxvZywgYnV0IGknbGwgbGVhdmUgdGhpcyBoZXJlIGFueXdheS4gQ2FuJ3QgaHVydC4gKi9cbiAgICAgICAgICAgIGlmICghJChwbGF5ZXIpLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NpbmcgcGxheWVyLCBiZWNhdXNlIGl0IHdhcyBkZXRlY3RlZCBhcyBub3QgdmlzaWJsZS4gcGxheWVyIGRpYWxvZyBnZXQgaGlkZGVuP1wiKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJBdXRvc2F2ZSBwbGF5ZXIgaW5mby5cIik7XG4gICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgIGV4cG9ydCBsZXQgcGF1c2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBkZXN0cm95UGxheWVyID0gZnVuY3Rpb24oZGxnOiBBdWRpb1BsYXllckRsZyk6IHZvaWQge1xuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocGxheWVyKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxvY2FsUGxheWVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRsZykge1xuICAgICAgICAgICAgICAgICAgICBkbGcuY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcGxheSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBzcGVlZCA9IGZ1bmN0aW9uKHJhdGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIucGxheWJhY2tSYXRlID0gcmF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vVGhpcyBwb2RjYXN0IGhhbmRsaW5nIGhhY2sgaXMgb25seSBpbiB0aGlzIGZpbGUgdGVtcG9yYXJpbHlcbiAgICBleHBvcnQgbGV0IHNraXAgPSBmdW5jdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSArPSBkZWx0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgc2F2ZVBsYXllckluZm8gPSBmdW5jdGlvbih1cmw6IHN0cmluZywgdGltZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikgcmV0dXJuO1xuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlNldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLlNldFBsYXllckluZm9SZXNwb25zZT4oXCJzZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgIFwidXJsXCI6IHVybCxcbiAgICAgICAgICAgIFwidGltZU9mZnNldFwiOiB0aW1lT2Zmc2V0IC8vLFxuICAgICAgICAgICAgLy9cIm5vZGVQYXRoXCI6IG5vZGUucGF0aFxuICAgICAgICB9LCBzZXRQbGF5ZXJJbmZvUmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGxldCBzZXRQbGF5ZXJJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgLy9hbGVydCgnc2F2ZSBjb21wbGV0ZS4nKTtcbiAgICB9XG59XG5uYW1lc3BhY2Ugc3lzdGVtZm9sZGVyIHtcblxuICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgcGF0aFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnBhdGhcIiwgbm9kZSk7XG4gICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGlmIChwYXRoUHJvcCkge1xuICAgICAgICAgICAgcGF0aCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgfSwgcGF0aFByb3AudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogVGhpcyB3YXMgYW4gZXhwZXJpbWVudCB0byBsb2FkIGEgbm9kZSBwcm9wZXJ0eSB3aXRoIHRoZSByZXN1bHRzIG9mIGEgZGlyZWN0b3J5IGxpc3RpbmcsIGJ1dCBJIGRlY2lkZWQgdGhhdFxuICAgICAgICByZWFsbHkgaWYgSSB3YW50IHRvIGhhdmUgYSBmaWxlIGJyb3dzZXIsIHRoZSByaWdodCB3YXkgdG8gZG8gdGhhdCBpcyB0byBoYXZlIGEgZGVkaWNhdGVkIHRhYiB0aGF0IGNhbiBkbyBpdFxuICAgICAgICBqdXN0IGxpa2UgdGhlIG90aGVyIHRvcC1sZXZlbCB0YWJzICovXG4gICAgICAgIC8vbGV0IGZpbGVMaXN0aW5nUHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6anNvblwiLCBub2RlKTtcbiAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmcgPSBmaWxlTGlzdGluZ1Byb3AgPyByZW5kZXIucmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eShmaWxlTGlzdGluZ1Byb3AudmFsdWUpIDogXCJcIjtcblxuICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICB9LCBwYXRoIC8qICsgZmlsZUxpc3RpbmcgKi8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0aCAvKiArIGZpbGVMaXN0aW5nICovKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCByZW5kZXJGaWxlTGlzdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0UHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5KU09OX0ZJTEVfU0VBUkNIX1JFU1VMVCwgbm9kZSk7XG4gICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XG4gICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHJlbmRlci5yZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgZmlsZUxpc3RQcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICBcIm1ldGE2NDpqc29uXCJdO1xuXG4gICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCByZWluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRmlsZVNlYXJjaFJlcXVlc3QsIGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlPihcImZpbGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNlbE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IG51bGxcbiAgICAgICAgICAgIH0sIHJlaW5kZXhSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgYnJvd3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRoaXMgYnJvd3NlIGZ1bmN0aW9uIHdvcmtzLCBidXQgaSdtIGRpc2FibGluZyBpdCwgZm9yIG5vdyBiZWNhdXNlIHdoYXQgSSdsbCBiZSBkb2luZyBpbnN0ZWFkIGlzIG1ha2luZyBpdFxuICAgICAgICAvLyBzd2l0Y2ggdG8gYSBGaWxlQnJvd3NlciBUYWIgKG1haW4gdGFiKSB3aGVyZSBicm93c2luZyB3aWxsIGFsbCBiZSBkb25lLiBObyBKQ1Igbm9kZXMgd2lsbCBiZSB1cGRhdGVkIGR1cmluZ1xuICAgICAgICAvLyB0aGUgcHJvY2VzcyBvZiBicm93c2luZyBhbmQgZWRpdGluZyBmaWxlcyBvbiB0aGUgc2VydmVyLlxuICAgICAgICAvL1xuICAgICAgICAvLyBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgLy8gaWYgKHNlbE5vZGUpIHtcbiAgICAgICAgLy8gICAgIHV0aWwuanNvbjxqc29uLkJyb3dzZUZvbGRlclJlcXVlc3QsIGpzb24uQnJvd3NlRm9sZGVyUmVzcG9uc2U+KFwiYnJvd3NlRm9sZGVyXCIsIHtcbiAgICAgICAgLy8gICAgICAgICBcIm5vZGVJZFwiOiBzZWxOb2RlLnBhdGhcbiAgICAgICAgLy8gICAgIH0sIHN5c3RlbWZvbGRlci5yZWZyZXNoUmVzcG9uc2UsIHN5c3RlbWZvbGRlcik7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlZnJlc2hSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ccm93c2VGb2xkZXJSZXNwb25zZSkge1xuICAgICAgICAvL25hdi5tYWluT2Zmc2V0ID0gMDtcbiAgICAgICAgLy8gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xuICAgICAgICAvLyAgICAgXCJub2RlSWRcIjogcmVzLnNlYXJjaFJlc3VsdE5vZGVJZCxcbiAgICAgICAgLy8gICAgIFwidXBMZXZlbFwiOiBudWxsLFxuICAgICAgICAvLyAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcbiAgICAgICAgLy8gICAgIFwib2Zmc2V0XCI6IDAsXG4gICAgICAgIC8vICAgICBcImdvVG9MYXN0UGFnZVwiIDogZmFsc2VcbiAgICAgICAgLy8gfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVpbmRleFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xuICAgICAgICBhbGVydChcIlJlaW5kZXggY29tcGxldGUuXCIpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgc2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIChuZXcgU2VhcmNoRmlsZXNEbGcodHJ1ZSkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnBhdGhcIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG4vKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIGRpYWxvZyBib3hlcy5cbiAqXG4gKiB0b2RvOiB3aGVuIHJlZmFjdG9yaW5nIGFsbCBkaWFsb2dzIHRvIHRoaXMgbmV3IGJhc2UtY2xhc3MgZGVzaWduIEknbSBhbHdheXNcbiAqIGNyZWF0aW5nIGEgbmV3IGRpYWxvZyBlYWNoIHRpbWUsIHNvIHRoZSBuZXh0IG9wdGltaXphdGlvbiB3aWxsIGJlIHRvIG1ha2VcbiAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gKiB0aGV5IGhhdmUgYmVlbiBjb25zdHJ1Y3RlZCB3aGVyZSB0aGV5IG1lcmVseSBoYXZlIHRvIGJlIHJlc2hvd24gYW5kXG4gKiByZXBvcHVsYXRlZCB0byByZW9wZW4gb25lIG9mIHRoZW0sIGFuZCBjbG9zaW5nIGFueSBvZiB0aGVtIGlzIG1lcmVseSBkb25lIGJ5XG4gKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gKi9cbmNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgcHJpdmF0ZSBob3JpekNlbnRlckRsZ0NvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgZGF0YTogYW55O1xuICAgIGJ1aWx0OiBib29sZWFuO1xuICAgIGd1aWQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkb21JZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFdlIHJlZ2lzdGVyICd0aGlzJyBzbyB3ZSBjYW4gZG8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZCBpbiBvbkNsaWNrIG1ldGhvZHNcbiAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgKiBhcyBzdHJpbmdzLlxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICBhbnkgZGVmYXVsdHMgb3IgdmFsdWVzIGluIGZvciBmaWVsZHMsIGV0Yy4gc2hvdWxkIGJlIHNldCB3aGVuIHRoZSBkaWFsb2cgaXMgZGlzcGxheWVkICovXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICB9XG5cbiAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cblxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfTtcblxuICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgLypcbiAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbW9kYWxzQ29udGFpbmVyID0gdXRpbC5wb2x5RWxtKFwibW9kYWxzQ29udGFpbmVyXCIpO1xuXG4gICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgIGxldCBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICogbWFwIGluIHRoaXMgbW9kdWxlXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgLy9OT1RFOiBUaGlzIHdvcmtzLCBidXQgaXMgYW4gZXhhbXBsZSBvZiB3aGF0IE5PVCB0byBkbyBhY3R1YWxseS4gSW5zdGVhZCBhbHdheXNcbiAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICBub2RlLnN0eWxlLmJvcmRlciA9IFwiM3B4IHNvbGlkIGdyYXlcIjtcblxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuaG9yaXpDZW50ZXJEbGdDb250ZW50KSB7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAvL2hvd3RvOiBleGFtcGxlIG9mIGhvdyB0byBjZW50ZXIgYSBkaXYgaW4gYW5vdGhlciBkaXYuIFRoaXMgZGl2IGlzIHRoZSBvbmUgYmVpbmcgY2VudGVyZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vVGhlIHRyaWNrIHRvIGdldHRpbmcgdGhlIGxheW91dCB3b3JraW5nIHdhcyBOT1Qgc2V0dGluZyB0aGlzIHdpZHRoIHRvIDEwMCUgZXZlbiB0aG91Z2ggc29tZWhvd1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBsYXlvdXQgZG9lcyByZXN1bHQgaW4gaXQgYmVpbmcgMTAwJSBpIHRoaW5rLlxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luOiAwIGF1dG87IG1heC13aWR0aDogODAwcHg7XCIgLy9cIm1hcmdpbjogMCBhdXRvOyB3aWR0aDogODAwcHg7XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcblxuICAgICAgICAgICAgLy8gbGV0IGxlZnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIFwibGVmdFwiKTtcbiAgICAgICAgICAgIC8vIGxldCBjZW50ZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAvLyBsZXQgcmlnaHQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgIC8vIH0sIFwicmlnaHRcIik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gbGV0IHJvdyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBsZWZ0ICsgY2VudGVyICsgcmlnaHQpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGxldCB0YWJsZTogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLFxuICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGVcIixcbiAgICAgICAgICAgIC8vICAgICB9LCByb3cpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIHV0aWwuc2V0SHRtbChpZCwgdGFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGlhbG9nOiBcIiArIGlkKTtcblxuICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgbGV0IHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0oaWQpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGkgdHJpZWQgdG8gdHdlYWsgdGhlIHBsYWNlbWVudCBvZiB0aGUgZGlhbG9nIHVzaW5nIGZpdEludG8sIGFuZCBpdCBkaWRuJ3Qgd29ya1xuICAgICAgICBzbyBJJ20ganVzdCB1c2luZyB0aGUgcGFwZXItZGlhbG9nIENTUyBzdHlsaW5nIHRvIGFsdGVyIHRoZSBkaWFsb2cgc2l6ZSB0byBmdWxsc2NyZWVuXG4gICAgICAgIGxldCBpcm9uUGFnZXMgPSB1dGlsLnBvbHlFbG0oXCJtYWluSXJvblBhZ2VzXCIpO1xuXG4gICAgICAgIEFmdGVyIHRoZSBUeXBlU2NyaXB0IGNvbnZlcnNpb24gSSBub3RpY2VkIGhhdmluZyBhIG1vZGFsIGZsYWcgd2lsbCBjYXVzZVxuICAgICAgICBhbiBpbmZpbml0ZSBsb29wIChjb21wbGV0ZWx5IGhhbmcpIENocm9tZSBicm93c2VyLCBidXQgdGhpcyBpc3N1ZSBpcyBtb3N0IGxpa2VseVxuICAgICAgICBub3QgcmVsYXRlZCB0byBUeXBlU2NyaXB0IGF0IGFsbCwgYnV0IGknbSBqdXN0IG1lbnRpb24gVFMganVzdCBpbiBjYXNlLCBiZWNhdXNlXG4gICAgICAgIHRoYXQncyB3aGVuIEkgbm90aWNlZCBpdC4gRGlhbG9ncyBhcmUgZmluZSBidXQgbm90IGEgZGlhbG9nIG9uIHRvcCBvZiBhbm90aGVyIGRpYWxvZywgd2hpY2ggaXNcbiAgICAgICAgdGhlIGNhc2Ugd2hlcmUgaXQgaGFuZ3MgaWYgbW9kZWw9dHJ1ZVxuICAgICAgICAqL1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLm5vQ2FuY2VsT25PdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5ob3Jpem9udGFsT2Zmc2V0ID0gMDtcbiAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5maXRJbnRvID0gaXJvblBhZ2VzLm5vZGU7XG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLm9wZW4oKTtcblxuICAgICAgICAvL3ZhciBkaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5EaWFsb2cnKTtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpcm9uLW92ZXJsYXktY2xvc2VkJywgZnVuY3Rpb24oY3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgIC8vdmFyIGlkID0gKDxhbnk+Y3VzdG9tRXZlbnQuY3VycmVudFRhcmdldCkuaWQ7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqIERpYWxvZzogXCIgKyBpZCArIFwiIGlzIGNsb3NlZCFcIik7XG4gICAgICAgICAgICB0aGl6LmNsb3NlRXZlbnQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgc2V0dGluZyB0byB6ZXJvIG1hcmdpbiBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWxtb3N0IGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhZnRlIDEuNSBzZWNvbmRzXG4gICAgICAgIGlzIGEgcmVhbGx5IHVnbHkgaGFjaywgYnV0IEkgY291bGRuJ3QgZmluZCB0aGUgcmlnaHQgc3R5bGUgY2xhc3Mgb3Igd2F5IG9mIGRvaW5nIHRoaXMgaW4gdGhlIGdvb2dsZVxuICAgICAgICBkb2NzIG9uIHRoZSBkaWFsb2cgY2xhc3MuXG4gICAgICAgICovXG4gICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcblxuICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgfSwgMTApO1xuXG4gICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9XG5cbiAgICAvKiB0b2RvOiBuZWVkIHRvIGNsZWFudXAgdGhlIHJlZ2lzdGVyZWQgSURzIHRoYXQgYXJlIGluIG1hcHMgZm9yIHRoaXMgZGlhbG9nICovXG4gICAgcHVibGljIGNhbmNlbCgpIHtcbiAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAqIHN1ZmZpeCBhcHBlbmRlZClcbiAgICAgKi9cbiAgICBpZCA9IChpZCk6IHN0cmluZyA9PiB7XG4gICAgICAgIGlmIChpZCA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiX2RsZ0lkXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkICsgXCJfZGxnSWRcIiArIHRoaXMuZGF0YS5ndWlkO1xuICAgIH1cblxuICAgIGVsID0gKGlkKTogYW55ID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjXCIgKyB0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICB9XG5cbiAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgIH1cblxuICAgIG1ha2VNZXNzYWdlQXJlYSA9IChtZXNzYWdlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1tZXNzYWdlXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvOiB0aGVyZSdzIGEgbWFrZUJ1dHRvbiAoYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcykgdGhhdCBkb24ndCBoYXZlIHRoZVxuICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgbWFrZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKiBUaGUgcmVhc29uIGRlbGF5Q2xvc2VDYWxsYmFjayBpcyBoZXJlIGlzIHNvIHRoYXQgd2UgY2FuIGVuY29kZSBhIGJ1dHRvbiB0byBwb3B1cCBhIG5ldyBkaWFsb2cgb3ZlciB0aGUgdG9wIG9mXG4gICAgYW4gZXhpc3RpbmcgZGlhbG9nLCBhbmQgaGF2ZSB0aGF0IGhhcHBlbiBpbnN0YW50bHksIHJhdGhlciB0aGFuIGxldHRpbmcgaXQgY2xvc2UsIGFuZCBUSEVOIHBvcGluZyB1cCBhIHNlY29uZCBkaWFsb2csXG4gICAgYmVjYXN1ZSB1c2luZyB0aGUgZGVsYXkgbWVhbnMgdGhhdCB0aGUgb25lIGJlaW5nIGhpZGRlbiBpcyBub3QgYWJsZSB0byBiZWNvbWUgaGlkZGVuIGJlZm9yZSB0aGUgb25lIGNvbWVzIHVwIGJlY2F1c2VcbiAgICB0aGF0IGNyZWF0ZXMgYW4gdWdseW5lc3MuIEl0J3MgYmV0dGVyIHRvIHBvcHVwIG9uZSByaWdodCBvdmVyIHRoZSBvdGhlciBhbmQgbm8gZmxpY2tlciBoYXBwZW5zIGluIHRoYXQgY2FzZS4gKi9cbiAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlOiBib29sZWFuID0gdHJ1ZSwgZGVsYXlDbG9zZUNhbGxiYWNrOiBudW1iZXIgPSAwKTogc3RyaW5nID0+IHtcblxuICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG5cbiAgICAgICAgICAgIC8qIHdhcm5pbmc6IHRoaXMgZGlhbG9nLWNvbmZpcm0gd2lsbCBjYXVzZSBnb29nbGUgcG9seW1lciB0byBjbG9zZSB0aGUgZGlhbG9nIGluc3RhbnRseSB3aGVuIHRoZSBidXR0b25cbiAgICAgICAgICAgICBpcyBjbGlja2VkIGFuZCBzb21ldGltZXMgd2UgZG9uJ3Qgd2FudCB0aGF0LCBsaWtlIGZvciBleGFtcGxlLCB3aGVuIHdlIG9wZW4gYSBkaWFsb2cgb3ZlciBhbm90aGVyIGRpYWxvZyxcbiAgICAgICAgICAgICB3ZSBkb24ndCB3YW50IHRoZSBpbnN0YW50YW5lb3VzIGNsb3NlIGFuZCBkaXNwbGF5IG9mIGJhY2tncm91bmQuIEl0IGNyZWF0ZXMgYSBmbGlja2VyIGVmZmVjdC5cblxuICAgICAgICAgICAgXCJkaWFsb2ctY29uZmlybVwiOiBcImRpYWxvZy1jb25maXJtXCIsXG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb25DbGljayA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb25DbGljayA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25DbGljayArPSBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcywgbnVsbCwgZGVsYXlDbG9zZUNhbGxiYWNrKTtcblxuICAgICAgICBpZiAob25DbGljaykge1xuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBvbkNsaWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpbml0aWFsbHlWaXNpYmxlKSB7XG4gICAgICAgICAgICBhdHRyaWJzW1wic3R5bGVcIl0gPSBcImRpc3BsYXk6bm9uZTtcIlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgYmluZEVudGVyS2V5ID0gKGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5iaW5kRW50ZXJLZXkodGhpcy5pZChpZCksIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBzZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoaWQpLCB2YWwpO1xuICAgIH1cblxuICAgIGdldElucHV0VmFsID0gKGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICByZXR1cm4gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSkudHJpbSgpO1xuICAgIH1cblxuICAgIHNldEh0bWwgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKGlkKSwgdGV4dCk7XG4gICAgfVxuXG4gICAgbWFrZVJhZGlvQnV0dG9uID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgXCJuYW1lXCI6IGlkXG4gICAgICAgIH0sIGxhYmVsKTtcbiAgICB9XG5cbiAgICBtYWtlQ2hlY2tCb3ggPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZywgaW5pdGlhbFN0YXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcblxuICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAvL1wib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgPHBhcGVyLWNoZWNrYm94IG9uLWNoYW5nZT1cImNoZWNrYm94Q2hhbmdlZFwiPmNsaWNrPC9wYXBlci1jaGVja2JveD5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICAgICAgY2hlY2tib3hDaGFuZ2VkIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvLyAgICAgaWYoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgICAgICAgIGF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoZWNrYm94OiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgYXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICBjaGVja2JveCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgXCJmb3JcIjogaWRcbiAgICAgICAgfSwgbGFiZWwsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBjaGVja2JveDtcbiAgICB9XG5cbiAgICBtYWtlSGVhZGVyID0gKHRleHQ6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNlbnRlcmVkPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogLypcImRpYWxvZy1oZWFkZXIgXCIgKyovIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIikgKyBcIiBkaWFsb2ctaGVhZGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogbWFraW5nIHRoaXMgSDIgdGFnIGNhdXNlcyBnb29nbGUgdG8gZHJhZyBpbiBhIGJ1bmNoIG9mIGl0cyBvd24gc3R5bGVzIGFuZCBhcmUgaGFyZCB0byBvdmVycmlkZSAqL1xuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCBhdHRycywgdGV4dCk7XG4gICAgfVxuXG4gICAgZm9jdXMgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XG4gICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoaWQpO1xuICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgJChpZCkuZm9jdXMoKTtcbiAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgfVxufVxuY2xhc3MgUHJvZ3Jlc3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlByb2dyZXNzRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQcm9jZXNzaW5nIFJlcXVlc3RcIiwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gcmVuZGVyLnRhZyhcInBhcGVyLXByb2dyZXNzXCIsIHtcbiAgICAgICAgICAgIFwiaW5kZXRlcm1pbmF0ZVwiOiBcImluZGV0ZXJtaW5hdGVcIixcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCI4MDBcIixcbiAgICAgICAgICAgIFwibWluXCI6IFwiMTAwXCIsXG4gICAgICAgICAgICBcIm1heFwiOiBcIjEwMDBcIlxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYmFyQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MjgwcHg7IG1hcmdpbjogMCBhdXRvOyBtYXJnaW4tdG9wOjI0cHg7IG1hcmdpbi1ib3R0b206MjRweDtcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgfSwgcHJvZ3Jlc3NCYXIpO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBiYXJDb250YWluZXI7XG4gICAgfVxufVxuY2xhc3MgQ29uZmlybURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB0aXRsZTogc3RyaW5nLCBwcml2YXRlIG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZSBidXR0b25UZXh0OiBzdHJpbmcsIHByaXZhdGUgeWVzQ2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICBwcml2YXRlIG5vQ2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICBzdXBlcihcIkNvbmZpcm1EbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGNvbnRlbnQ6IHN0cmluZyA9IHRoaXMubWFrZUhlYWRlcihcIlwiLCBcIkNvbmZpcm1EbGdUaXRsZVwiKSArIHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiXCIsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG4gICAgICAgIGNvbnRlbnQgPSByZW5kZXIuY2VudGVyQ29udGVudChjb250ZW50LCAzMDApO1xuXG4gICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIiwgdGhpcy5ub0NhbGxiYWNrKTtcbiAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYnV0dG9ucyk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5tZXNzYWdlLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5idXR0b25UZXh0LCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIik7XG4gICAgfVxufVxuXG5jbGFzcyBFZGl0U3lzdGVtRmlsZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdFN5c3RlbUZpbGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiPGgyPkZpbGUgRWRpdG9yOiBcIiArIHRoaXMuZmlsZU5hbWUgKyBcIjwvaDI+XCI7XG5cbiAgICAgICAgbGV0IGJ1dHRvbnMgPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJTYXZlRmlsZUJ1dHRvblwiLCB0aGlzLnNhdmVFZGl0KVxuICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcIkNhbmNlbEZpbGVFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCk7XG4gICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHNhdmVFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmUuXCIpO1xuICAgIH1cblxuICAgIGNhbmNlbEVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FuY2VsLlwiKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cbn1cblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbmNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBcIk1lc3NhZ2VcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy50aXRsZSkgKyBcIjxwPlwiICsgdGhpcy5tZXNzYWdlICsgXCI8L3A+XCI7XHJcbiAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJPa1wiLCBcIm1lc3NhZ2VEbGdPa0J1dHRvblwiLCB0aGlzLmNhbGxiYWNrKSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJMb2dpbkRsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTG9naW5cIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICB2YXIgbG9naW5CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJMb2dpblwiLCBcImxvZ2luQnV0dG9uXCIsIHRoaXMubG9naW4sIHRoaXMpO1xuICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIobG9naW5CdXR0b24gKyByZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XG4gICAgICAgIHZhciBkaXZpZGVyID0gXCI8ZGl2PjxoMz5PciBMb2dpbiBXaXRoLi4uPC9oMz48L2Rpdj5cIjtcblxuICAgICAgICB2YXIgZm9ybSA9IGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcblxuICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBmb3JtO1xuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwicGFzc3dvcmRcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlRnJvbUNvb2tpZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICBpZiAodXNyKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHdkKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgIHZhciBwd2QgPSB0aGlzLmdldElucHV0VmFsKFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgfVxuXG4gICAgcmVzZXRQYXNzd29yZCA9ICgpOiBhbnkgPT4ge1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBSZXNldCBQYXNzd29yZFwiLFxuICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpei5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG59XG5jbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNpZ251cERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKEJSQU5ESU5HX1RJVExFICsgXCIgU2lnbnVwXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInNpZ251cFVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInNpZ251cFBhc3N3b3JkXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiQ2FwdGNoYVwiLCBcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgdmFyIGNhcHRjaGFJbWFnZSA9IHJlbmRlci50YWcoXCJkaXZcIiwgLy9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYS1pbWFnZVwiIC8vXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiY2FwdGNoYUltYWdlXCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIlwiLy9cbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgdmFyIHNpZ251cEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNpZ251cFwiLCBcInNpZ251cEJ1dHRvblwiLCB0aGlzLnNpZ251cCwgdGhpcyk7XG4gICAgICAgIHZhciBuZXdDYXB0Y2hhQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiVHJ5IERpZmZlcmVudCBJbWFnZVwiLCBcInRyeUFub3RoZXJDYXB0Y2hhQnV0dG9uXCIsXG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2lnbnVwQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2lnbnVwQnV0dG9uICsgbmV3Q2FwdGNoYUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogJChcIiNcIiArIF8uZG9tSWQgKyBcIi1tYWluXCIpLmNzcyh7IFwiYmFja2dyb3VuZEltYWdlXCIgOiBcInVybCgvaWJtLTcwMi1icmlnaHQuanBnKTtcIiBcImJhY2tncm91bmQtcmVwZWF0XCIgOlxuICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAqL1xuICAgIH1cblxuICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFVzZXJOYW1lXCIpO1xuICAgICAgICB2YXIgcGFzc3dvcmQgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwUGFzc3dvcmRcIik7XG4gICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgdmFyIGNhcHRjaGEgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAvKiBubyByZWFsIHZhbGlkYXRpb24geWV0LCBvdGhlciB0aGFuIG5vbi1lbXB0eSAqL1xuICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAhcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU29ycnksIHlvdSBjYW5ub3QgbGVhdmUgYW55IGZpZWxkcyBibGFuay5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlNpZ251cFJlcXVlc3QsIGpzb24uU2lnbnVwUmVzcG9uc2U+KFwic2lnbnVwXCIsIHtcbiAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNlck5hbWUsXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IHBhc3N3b3JkLFxuICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbCxcbiAgICAgICAgICAgIFwiY2FwdGNoYVwiOiBjYXB0Y2hhXG4gICAgICAgIH0sIHRoaXMuc2lnbnVwUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHNpZ251cFJlc3BvbnNlID0gKHJlczoganNvbi5TaWdudXBSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTaWdudXAgbmV3IHVzZXJcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFxuICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICApKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnlBbm90aGVyQ2FwdGNoYSA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBlbWJlZCBhIHRpbWUgcGFyYW1ldGVyIGp1c3QgdG8gdGh3YXJ0IGJyb3dzZXIgY2FjaGluZywgYW5kIGVuc3VyZSBzZXJ2ZXIgYW5kIGJyb3dzZXIgd2lsbCBuZXZlciByZXR1cm4gdGhlIHNhbWVcbiAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc3JjID0gcG9zdFRhcmdldFVybCArIFwiY2FwdGNoYT90PVwiICsgbjtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICB9XG5cbiAgICBwYWdlSW5pdFNpZ251cFBnID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICB9XG59XG5jbGFzcyBQcmVmc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQZWZlcmVuY2VzXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmFkaW9CdXR0b25zID0gdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJTaW1wbGVcIiwgXCJlZGl0TW9kZVNpbXBsZVwiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmFkaW9CdXR0b25Hcm91cCA9IHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1ncm91cFwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpLFxyXG4gICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgIH0sIHJhZGlvQnV0dG9ucyk7XHJcblxyXG4gICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja0JveCA9IHRoaXMubWFrZUNoZWNrQm94KFwiU2hvdyBSb3cgTWV0YWRhdGFcIiwgXCJzaG93TWV0YURhdGFcIiwgbWV0YTY0LnNob3dNZXRhRGF0YSk7XHJcbiAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgIHZhciBsZWdlbmQgPSBcIjxsZWdlbmQ+RWRpdCBNb2RlOjwvbGVnZW5kPlwiO1xyXG4gICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbFByZWZlcmVuY2VzRGxnQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBjaGVja2JveEJhciArIGJ1dHRvbkJhcjtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSBwb2x5RWxtLm5vZGUuc2VsZWN0ZWQgPT0gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpID8gbWV0YTY0Lk1PREVfU0lNUExFXHJcbiAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gc2hvd01ldGFEYXRhQ2hlY2tib3gubm9kZS5jaGVja2VkO1xyXG5cclxuICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgXCJ1c2VyUHJlZmVyZW5jZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCxcclxuICAgICAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSxcclxuICAgICAgICAgICAgICAgIC8qIHRvZG8tMTogaG93IGNhbiBJIGZsYWcgYSBwcm9wZXJ0eSBhcyBvcHRpb25hbCBpbiBUeXBlU2NyaXB0IGdlbmVyYXRvciA/IFdvdWxkIGJlIHByb2JhYmx5IHNvbWUga2luZCBvZiBqc29uL2phY2tzb24gQHJlcXVpcmVkIGFubm90YXRpb24gKi9cclxuICAgICAgICAgICAgICAgIFwibGFzdE5vZGVcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwiZXhwb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IG1ldGE2NC5zaG93TWV0YURhdGFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMuc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlID0gKHJlczoganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZpbmcgUHJlZmVyZW5jZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMjogdHJ5IGFuZCBtYWludGFpbiBzY3JvbGwgcG9zaXRpb24gPyB0aGlzIGlzIGdvaW5nIHRvIGJlIGFzeW5jLCBzbyB3YXRjaCBvdXQuXHJcbiAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgIHBvbHlFbG0ubm9kZS5zZWxlY3QobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09IG1ldGE2NC5NT0RFX1NJTVBMRSA/IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA6IHRoaXNcclxuICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgIC8vdG9kby0wOiBwdXQgdGhlc2UgdHdvIGxpbmVzIGluIGEgdXRpbGl0eSBtZXRob2RcclxuICAgICAgICBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaG93TWV0YURhdGFcIikpO1xyXG4gICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJNYW5hZ2VBY2NvdW50RGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk1hbmFnZSBBY2NvdW50XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjbG9zZUFjY291bnRCdXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNsb3NlLWFjY291bnQtYmFyXCJcclxuICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIEV4cG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRXhwb3J0IHRvIEZpbGUgTmFtZVwiLCBcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGV4cG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgZXhwb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcodGFyZ2V0RmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwb3J0UmVxdWVzdCwganNvbi5FeHBvcnRSZXNwb25zZT4oXCJleHBvcnRUb1htbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInRhcmdldEZpbGVOYW1lXCI6IHRhcmdldEZpbGVOYW1lXG4gICAgICAgICAgICB9LCB0aGlzLmV4cG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5FeHBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBJbXBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRmlsZSBuYW1lIHRvIGltcG9ydFwiLCBcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsSW1wb3J0QnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGltcG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgaW1wb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICB2YXIgc291cmNlRmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc291cmNlRmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW1wb3J0UmVxdWVzdCwganNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzb3VyY2VGaWxlTmFtZVwiOiBzb3VyY2VGaWxlTmFtZVxuICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW1wb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkltcG9ydCBTdWNjZXNzZnVsLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTZWFyY2hDb250ZW50RGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggQ29udGVudFwiKTtcblxuICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaE5vZGVzQnV0dG9uXCIsIHRoaXMuc2VhcmNoTm9kZXMsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5DT05URU5UKTtcbiAgICB9XG5cbiAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLy91dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIHRoaXMuZm9jdXMoXCJzZWFyY2hUZXh0XCIpO1xuICAgIH1cbn1cbmNsYXNzIFNlYXJjaFRhZ3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBPbmx5IHRhZ3MgdGV4dCB3aWxsIGJlIHNlYXJjaGVkLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICB9XG5cbiAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgIH1cbn1cbmNsYXNzIFNlYXJjaEZpbGVzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGx1Y2VuZTogYm9vbGVhbikge1xuICAgICAgICBzdXBlcihcIlNlYXJjaEZpbGVzRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggRmlsZXNcIik7XG5cbiAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuXCIpO1xuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICB9XG5cbiAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaEZpbGVzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgbm9kZUlkID0gc2VsTm9kZS5pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcbiAgICAgICAgICAgIFwicmVpbmRleFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0XG4gICAgICAgIH0sIHNyY2guc2VhcmNoRmlsZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgIH1cbn1cbmNsYXNzIENoYW5nZVBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgcHdkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXNzQ29kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJDaGFuZ2VQYXNzd29yZERsZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZy5cclxuICAgICAqXHJcbiAgICAgKiBJZiB0aGUgdXNlciBpcyBkb2luZyBhIFwiUmVzZXQgUGFzc3dvcmRcIiB3ZSB3aWxsIGhhdmUgYSBub24tbnVsbCBwYXNzQ29kZSBoZXJlLCBhbmQgd2Ugc2ltcGx5IHNlbmQgdGhpcyB0byB0aGUgc2VydmVyXHJcbiAgICAgKiB3aGVyZSBpdCB3aWxsIHZhbGlkYXRlIHRoZSBwYXNzQ29kZSwgYW5kIGlmIGl0J3MgdmFsaWQgdXNlIGl0IHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgcGFzc3dvcmQgY2hhbmdlIG9uIHRoZSBjb3JyZWN0XHJcbiAgICAgKiB1c2VyLlxyXG4gICAgICovXHJcbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMucGFzc0NvZGUgPyBcIlBhc3N3b3JkIFJlc2V0XCIgOiBcIkNoYW5nZSBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSByZW5kZXIudGFnKFwicFwiLCB7XHJcblxyXG4gICAgICAgIH0sIFwiRW50ZXIgeW91ciBuZXcgcGFzc3dvcmQgYmVsb3cuLi5cIik7XHJcblxyXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiTmV3IFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG5cclxuICAgICAgICB2YXIgY2hhbmdlUGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkQWN0aW9uQnV0dG9uXCIsXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbENoYW5nZVBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNoYW5nZVBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBhc3N3b3JkID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHRoaXMucHdkID0gdGhpcy5nZXRJbnB1dFZhbChcImNoYW5nZVBhc3N3b3JkMVwiKS50cmltKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnB3ZCAmJiB0aGlzLnB3ZC5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5DaGFuZ2VQYXNzd29yZFJlcXVlc3QsIGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5ld1Bhc3N3b3JkXCI6IHRoaXMucHdkLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzQ29kZVwiOiB0aGlzLnBhc3NDb2RlXHJcbiAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW52YWxpZCBwYXNzd29yZChzKS5cIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBwYXNzd29yZFwiLCByZXMpKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbXNnID0gXCJQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5cIjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBtc2cgKz0gXCI8cD5Zb3UgbWF5IG5vdyBsb2dpbiBhcyA8Yj5cIiArIHJlcy51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIjwvYj4gd2l0aCB5b3VyIG5ldyBwYXNzd29yZC5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnLCBcIlBhc3N3b3JkIENoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGl6LnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzIGxvZ2luIGNhbGwgRE9FUyB3b3JrLCBidXQgdGhlIHJlYXNvbiB3ZSBkb24ndCBkbyB0aGlzIGlzIGJlY2F1c2UgdGhlIFVSTCBzdGlsbCBoYXMgdGhlIHBhc3NDb2RlIG9uIGl0IGFuZCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vd2FudCB0byBkaXJlY3QgdGhlIHVzZXIgdG8gYSB1cmwgd2l0aG91dCB0aGF0LlxyXG4gICAgICAgICAgICAgICAgICAgIC8vdXNlci5sb2dpbihudWxsLCByZXMudXNlciwgdGhpei5wd2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdGhpcy5mb2N1cyhcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBSZXNldFBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB1c2VyOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcIlJlc2V0UGFzc3dvcmREbGdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVzZXQgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciB5b3VyIHVzZXIgbmFtZSBhbmQgZW1haWwgYWRkcmVzcyBhbmQgYSBjaGFuZ2UtcGFzc3dvcmQgbGluayB3aWxsIGJlIHNlbnQgdG8geW91XCIpO1xyXG5cclxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWwgQWRkcmVzc1wiLCBcImVtYWlsQWRkcmVzc1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlc2V0UGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlJlc2V0IG15IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLFxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlc2V0UGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFBhc3N3b3JkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIikudHJpbSgpO1xyXG4gICAgICAgIHZhciBlbWFpbEFkZHJlc3MgPSB0aGlzLmdldElucHV0VmFsKFwiZW1haWxBZGRyZXNzXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHVzZXJOYW1lICYmIGVtYWlsQWRkcmVzcykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZXNldFBhc3N3b3JkUmVxdWVzdCwganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uUmVzZXRQYXNzd29yZFJlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVzZXQgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQYXNzd29yZCByZXNldCBlbWFpbCB3YXMgc2VudC4gQ2hlY2sgeW91ciBpbmJveC5cIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodGhpcy51c2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jbGFzcyBVcGxvYWRGcm9tRmlsZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgbGV0IHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgIGxldCBmb3JtRmllbGRzID0gXCJcIjtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICogYnV0dG9uIGFuZCBhZGQgbmV3IG9uZXMgb25lIGF0IGEgdGltZS4gSnVzdCBub3QgdGFraW5nIHRoZSB0aW1lIHRvIGRvIHRoYXQgeWV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiB0b2RvLTA6IFRoaXMgaXMgdWdseSB0byBwcmUtY3JlYXRlIHRoZXNlIGlucHV0IGZpZWxkcy4gTmVlZCB0byBtYWtlIHRoZW0gYWJsZSB0byBhZGQgZHluYW1pY2FsbHkuXG4gICAgICAgICAqIChXaWxsIGRvIHRoaXMgbW9kaWZpY2F0aW9uIG9uY2UgSSBnZXQgdGhlIGRyYWctbi1kcm9wIHN0dWZmIHdvcmtpbmcgZmlyc3QpXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgbGV0IGlucHV0ID0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJmaWxlc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi1ib3R0b206IDEwcHg7XCJcbiAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVJZFwiXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgIC8qIGJvb2xlYW4gZmllbGQgdG8gc3BlY2lmeSBpZiB3ZSBleHBsb2RlIHppcCBmaWxlcyBvbnRvIHRoZSBKQ1IgdHJlZSAqL1xuICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSxcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhwbG9kZVppcHNcIlxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1cIiksXG4gICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgIFwiZW5jdHlwZVwiOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIixcbiAgICAgICAgICAgIFwiZGF0YS1hamF4XCI6IFwiZmFsc2VcIiAvLyBORVcgZm9yIG11bHRpcGxlIGZpbGUgdXBsb2FkIHN1cHBvcnQ/Pz9cbiAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgdXBsb2FkRmllbGRDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRmllbGRDb250YWluZXJcIilcbiAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgbGV0IHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIHVwbG9hZEZpZWxkQ29udGFpbmVyICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBsZXQgcmV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWwgPSAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIikpLnZhbCgpO1xuICAgICAgICAgICAgaWYgKGlucHV0VmFsLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoXCIuemlwXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICB1cGxvYWRGaWxlTm93ID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIGxldCB1cGxvYWRGdW5jID0gKGV4cGxvZGVaaXBzKSA9PiB7XG4gICAgICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybU5vZGVJZFwiKSkuYXR0cihcInZhbHVlXCIsIGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCk7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpKS5hdHRyKFwidmFsdWVcIiwgZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUaGlzIGlzIHRoZSBvbmx5IHBsYWNlIHdlIGRvIHNvbWV0aGluZyBkaWZmZXJlbnRseSBmcm9tIHRoZSBub3JtYWwgJ3V0aWwuanNvbigpJyBjYWxscyB0byB0aGUgc2VydmVyLCBiZWNhdXNlXG4gICAgICAgICAgICAgKiB0aGlzIGlzIGhpZ2hseSBzcGVjaWFsaXplZCBoZXJlIGZvciBmb3JtIHVwbG9hZGluZywgYW5kIGlzIGRpZmZlcmVudCBmcm9tIG5vcm1hbCBhamF4IGNhbGxzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PigkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1cIikpWzBdKSk7XG5cbiAgICAgICAgICAgIGxldCBwcm1zID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJtcy5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJtcy5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVwbG9hZCBmYWlsZWQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgXCJEbyB5b3Ugd2FudCBaaXAgZmlsZXMgZXhwbG9kZWQgb250byB0aGUgdHJlZSB3aGVuIHVwbG9hZGVkP1wiLFxuICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKHRydWUpO1xuICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAvL05vIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgfVxufVxuY2xhc3MgVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICB9XG5cbiAgICBmaWxlTGlzdDogT2JqZWN0W10gPSBudWxsO1xuICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBleHBsb2RlWmlwczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgbGV0IHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtRmllbGRzID0gXCJcIjtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICBsZXQgaGlkZGVuSW5wdXRDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgIFwiYXV0b1Byb2Nlc3NRdWV1ZVwiOiBmYWxzZSxcbiAgICAgICAgICAgIC8qIE5vdGU6IHdlIGFsc28gaGF2ZSBzb21lIHN0eWxpbmcgaW4gbWV0YTY0LmNzcyBmb3IgJ2Ryb3B6b25lJyAqL1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJkcm9wem9uZS1mb3JtLWlkXCIpXG4gICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBjb25maWd1cmVEcm9wWm9uZSA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgIGxldCBjb25maWc6IE9iamVjdCA9IHtcbiAgICAgICAgICAgIHVybDogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcmFtTmFtZTogXCJmaWxlc1wiLFxuICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICBwYXJhbGxlbFVwbG9hZHM6IDEwLFxuXG4gICAgICAgICAgICAvKiBOb3Qgc3VyZSB3aGF0J3MgdGhpcyBpcyBmb3IsIGJ1dCB0aGUgJ2ZpbGVzJyBwYXJhbWV0ZXIgb24gdGhlIHNlcnZlciBpcyBhbHdheXMgTlVMTCwgdW5sZXNzXG4gICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgIHVwbG9hZE11bHRpcGxlOiBmYWxzZSxcbiAgICAgICAgICAgIGFkZFJlbW92ZUxpbmtzOiB0cnVlLFxuICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICBoaWRkZW5JbnB1dENvbnRhaW5lcjogXCIjXCIgKyB0aGl6LmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgIFNlZSB0aGUgXCJzZW5kaW5nXCIgZnVuY3Rpb24gYmVsb3csIHdoZXJlIEkgZW5kZWQgdXAgcGFzc2luZyB0aGVzZSBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgaGVhZGVycyA6IHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwiZXhwbG9kZVppcHNcIiA6IGV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgZHJvcHpvbmUgPSB0aGlzOyAvLyBjbG9zdXJlXG4gICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICBpZiAoIXN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBnZXQgdXBsb2FkIGJ1dHRvbi5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub24oXCJhZGRlZGZpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucnVuQnV0dG9uRW5hYmxlbWVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei51cGRhdGVGaWxlTGlzdCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5ydW5CdXR0b25FbmFibGVtZW50KHRoaXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbihcInNlbmRpbmdcIiwgZnVuY3Rpb24oZmlsZSwgeGhyLCBmb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJub2RlSWRcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgKDxhbnk+JChcIiNcIiArIHRoaXMuaWQoXCJkcm9wem9uZS1mb3JtLWlkXCIpKSkuZHJvcHpvbmUoY29uZmlnKTtcbiAgICB9XG5cbiAgICB1cGRhdGVGaWxlTGlzdCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgdGhpcy5maWxlTGlzdCA9IGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKTtcbiAgICAgICAgdGhpcy5maWxlTGlzdCA9IHRoaXMuZmlsZUxpc3QuY29uY2F0KGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkpO1xuXG4gICAgICAgIC8qIERldGVjdCBpZiBhbnkgWklQIGZpbGVzIGFyZSBjdXJyZW50bHkgc2VsZWN0ZWQsIGFuZCBhc2sgdXNlciB0aGUgcXVlc3Rpb24gYWJvdXQgd2hldGhlciB0aGV5XG4gICAgICAgIHNob3VsZCBiZSBleHRyYWN0ZWQgYXV0b21hdGljYWxseSBkdXJpbmcgdGhlIHVwbG9hZCwgYW5kIHVwbG9hZGVkIGFzIGluZGl2aWR1YWwgbm9kZXNcbiAgICAgICAgZm9yIGVhY2ggZmlsZSAqL1xuICAgICAgICBpZiAoIXRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCAmJiB0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgXCJEbyB5b3Ugd2FudCBaaXAgZmlsZXMgZXhwbG9kZWQgb250byB0aGUgdHJlZSB3aGVuIHVwbG9hZGVkP1wiLFxuICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBsZXQgcmV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgdGhpcy5maWxlTGlzdCkge1xuICAgICAgICAgICAgaWYgKGZpbGVbXCJuYW1lXCJdLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoXCIuemlwXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBydW5CdXR0b25FbmFibGVtZW50ID0gKGRyb3B6b25lRXZ0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKS5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkQnV0dG9uXCIpKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcblxuICAgICAgICB0aGlzLmNvbmZpZ3VyZURyb3Bab25lKCk7XG4gICAgfVxufVxuY2xhc3MgVXBsb2FkRnJvbVVybERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICB2YXIgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRmllbGQgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVcGxvYWQgRnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsXCIpO1xuICAgICAgICB1cGxvYWRGcm9tVXJsRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICB2YXIgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIHVwbG9hZEZyb21VcmxEaXYgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHNvdXJjZVVybCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1cGxvYWRGcm9tVXJsXCIpO1xuXG4gICAgICAgIC8qIGlmIHVwbG9hZGluZyBmcm9tIFVSTCAqL1xuICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5VcGxvYWRGcm9tVXJsUmVxdWVzdCwganNvbi5VcGxvYWRGcm9tVXJsUmVzcG9uc2U+KFwidXBsb2FkRnJvbVVybFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgfSwgdGhpcy51cGxvYWRGcm9tVXJsUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBsb2FkRnJvbVVybFJlc3BvbnNlID0gKHJlczoganNvbi5VcGxvYWRGcm9tVXJsUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiVXBsb2FkIGZyb20gVVJMXCIsIHJlcykpIHtcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoXCJ1cGxvYWRGcm9tVXJsXCIpLCBcIlwiKTtcblxuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgIH1cbn1cbmNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb250ZW50RmllbGREb21JZDogc3RyaW5nO1xuICAgIGZpZWxkSWRUb1Byb3BNYXA6IGFueSA9IHt9O1xuICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICBlZGl0UHJvcGVydHlEbGdJbnN0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR5cGVOYW1lPzogc3RyaW5nLCBwcml2YXRlIGNyZWF0ZUF0VG9wPzogYm9vbGVhbikge1xuICAgICAgICBzdXBlcihcIkVkaXROb2RlRGxnXCIpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb3BlcnR5IGZpZWxkcyBhcmUgZ2VuZXJhdGVkIGR5bmFtaWNhbGx5IGFuZCB0aGlzIG1hcHMgdGhlIERPTSBJRHMgb2YgZWFjaCBmaWVsZCB0byB0aGUgcHJvcGVydHkgb2JqZWN0IGl0XG4gICAgICAgICAqIGVkaXRzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgIHRoaXMucHJvcEVudHJpZXMgPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFZGl0IE5vZGVcIik7XG5cbiAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgIHZhciBhZGRQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBQcm9wZXJ0eVwiLCBcImFkZFByb3BlcnR5QnV0dG9uXCIsIHRoaXMuYWRkUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgYWRkVGFnc1Byb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQWRkIFRhZ3NcIiwgXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIixcbiAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgdmFyIHNwbGl0Q29udGVudEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNwbGl0XCIsIFwic3BsaXRDb250ZW50QnV0dG9uXCIsIHRoaXMuc3BsaXRDb250ZW50LCB0aGlzKTtcbiAgICAgICAgdmFyIGRlbGV0ZVByb3BCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJEZWxldGVcIiwgXCJkZWxldGVQcm9wQnV0dG9uXCIsIHRoaXMuZGVsZXRlUHJvcGVydHlCdXR0b25DbGljaywgdGhpcyk7XG4gICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVOb2RlQnV0dG9uICsgYWRkUHJvcGVydHlCdXR0b24gKyBhZGRUYWdzUHJvcGVydHlCdXR0b24gKyBkZWxldGVQcm9wQnV0dG9uXG4gICAgICAgICAgICArIHNwbGl0Q29udGVudEJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24sIFwiYnV0dG9uc1wiKTtcblxuICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICB2YXIgd2lkdGggPSA4MDA7IC8vd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgIHZhciBoZWlnaHQgPSA2MDA7IC8vd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKVxuICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgIC8vIHRvZG8tMDogY3JlYXRlIENTUyBjbGFzcyBmb3IgdGhpcy5cbiAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyBtYXgtd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDt3aWR0aDoxMDAlOyBvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiLFxuICAgICAgICAgICAgY2xhc3M6IFwidmVydGljYWwtbGF5b3V0LXJvd1wiXG4gICAgICAgICAgICAvL1wicGFkZGluZy1sZWZ0OiAwcHg7IHdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsOyBib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcIlxuICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHZW5lcmF0ZXMgYWxsIHRoZSBIVE1MIGVkaXQgZmllbGRzIGFuZCBwdXRzIHRoZW0gaW50byB0aGUgRE9NIG1vZGVsIG9mIHRoZSBwcm9wZXJ0eSBlZGl0b3IgZGlhbG9nIGJveC5cbiAgICAgKlxuICAgICAqL1xuICAgIHBvcHVsYXRlRWRpdE5vZGVQZyA9ICgpID0+IHtcbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIC8qIGNsZWFyIHRoaXMgbWFwIHRvIGdldCByaWQgb2Ygb2xkIHByb3BlcnRpZXMgKi9cbiAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgIHRoaXMucHJvcEVudHJpZXMgPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuXG4gICAgICAgIC8qIGVkaXROb2RlIHdpbGwgYmUgbnVsbCBpZiB0aGlzIGlzIGEgbmV3IG5vZGUgYmVpbmcgY3JlYXRlZCAqL1xuICAgICAgICBpZiAoZWRpdC5lZGl0Tm9kZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIGV4aXN0aW5nIG5vZGUuXCIpO1xuXG4gICAgICAgICAgICAvKiBpdGVyYXRvciBmdW5jdGlvbiB3aWxsIGhhdmUgdGhlIHdyb25nICd0aGlzJyBzbyB3ZSBzYXZlIHRoZSByaWdodCBvbmUgKi9cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBlZGl0T3JkZXJlZFByb3BzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKGVkaXQuZWRpdE5vZGUsIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcyk7XG4gICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgUHJvcGVydHlJbmZvLmphdmEgb2JqZWN0c1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkLmVhY2goZWRpdE9yZGVyZWRQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHByb3ApIHtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogaWYgcHJvcGVydHkgbm90IGFsbG93ZWQgdG8gZGlzcGxheSByZXR1cm4gdG8gYnlwYXNzIHRoaXMgcHJvcGVydHkvaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZmllbGRJZCA9IHRoaXouaWQoXCJlZGl0Tm9kZVRleHRDb250ZW50XCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBlZGl0IGZpZWxkIFwiICsgZmllbGRJZCArIFwiIGZvciBwcm9wZXJ0eSBcIiArIHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgdmFyIGlzUmVhZE9ubHlQcm9wID0gcmVuZGVyLmlzUmVhZE9ubHlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgIHRoaXouZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXSA9IHByb3BFbnRyeTtcbiAgICAgICAgICAgICAgICB0aGl6LnByb3BFbnRyaWVzLnB1c2gocHJvcEVudHJ5KTtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlTXVsdGlQcm9wRWRpdG9yKHByb3BFbnRyeSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlU2luZ2xlUHJvcEVkaXRvcihwcm9wRW50cnksIGFjZUZpZWxkcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6ICgoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHx8IGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcInByb3BlcnR5RWRpdExpc3RJdGVtSGlkZGVuXCIpXG4gICAgICAgICAgICAgICAgICAgIC8vIFwic3R5bGVcIiA6IFwiZGlzcGxheTogXCIrICghcmRPbmx5IHx8IG1ldGE2NC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJpbmxpbmVcIiA6IFwibm9uZVwiKVxuICAgICAgICAgICAgICAgIH0sIGZpZWxkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qIEVkaXRpbmcgYSBuZXcgbm9kZSAqL1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRvZG8tMDogdGhpcyBlbnRpcmUgYmxvY2sgbmVlZHMgcmV2aWV3IG5vdyAocmVkZXNpZ24pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgbmV3IG5vZGUuXCIpO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHZhciBhY2VGaWVsZElkID0gdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIik7XG5cbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgIHZhbDogXCJcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmV3IE5vZGUgTmFtZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgLy8gdmFyIHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAvLyB9LCAvL1xuICAgICAgICAvLyAgICAgKGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiSGlkZSBSZWFkLU9ubHkgUHJvcGVydGllc1wiIDogXCJTaG93IFJlYWQtT25seSBQcm9wZXJ0aWVzXCIpKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gZmllbGRzICs9IHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uO1xuXG4gICAgICAgIC8vbGV0IHJvdyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBsZWZ0ICsgY2VudGVyICsgcmlnaHQpO1xuXG4gICAgICAgIGxldCBwcm9wVGFibGU6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZVwiLFxuICAgICAgICAgICAgfSwgZmllbGRzKTtcblxuXG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksIHByb3BUYWJsZSk7XG5cbiAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGFjZUZpZWxkc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKHV0aWwudW5lbmNvZGVIdG1sKGFjZUZpZWxkc1tpXS52YWwpKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgIFwiWW91IG1heSBsZWF2ZSB0aGlzIGZpZWxkIGJsYW5rIGFuZCBhIHVuaXF1ZSBJRCB3aWxsIGJlIGFzc2lnbmVkLiBZb3Ugb25seSBuZWVkIHRvIHByb3ZpZGUgYSBuYW1lIGlmIHlvdSB3YW50IHRoaXMgbm9kZSB0byBoYXZlIGEgbW9yZSBtZWFuaW5nZnVsIFVSTC5cIlxuICAgICAgICAgICAgOiAvL1xuICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICB0aGlzLmVsKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIikuaHRtbChpbnN0cik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQWxsb3cgYWRkaW5nIG9mIG5ldyBwcm9wZXJ0aWVzIGFzIGxvbmcgYXMgdGhpcyBpcyBhIHNhdmVkIG5vZGUgd2UgYXJlIGVkaXRpbmcsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBzdGFydFxuICAgICAgICAgKiBtYW5hZ2luZyBuZXcgcHJvcGVydGllcyBvbiB0aGUgY2xpZW50IHNpZGUuIFdlIG5lZWQgYSBnZW51aW5lIG5vZGUgYWxyZWFkeSBzYXZlZCBvbiB0aGUgc2VydmVyIGJlZm9yZSB3ZSBhbGxvd1xuICAgICAgICAgKiBhbnkgcHJvcGVydHkgZWRpdGluZyB0byBoYXBwZW4uXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlCdXR0b25cIiksICFlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSk7XG5cbiAgICAgICAgdmFyIHRhZ3NQcm9wRXhpc3RzID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwidGFnc1wiLCBlZGl0LmVkaXROb2RlKSAhPSBudWxsO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhhc1RhZ3NQcm9wOiBcIiArIHRhZ3NQcm9wKTtcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiKSwgIXRhZ3NQcm9wRXhpc3RzKTtcbiAgICB9XG5cbiAgICB0b2dnbGVTaG93UmVhZE9ubHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIC8vIGFsZXJ0KFwibm90IHlldCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgIC8vIHNlZSBzYXZlRXhpc3RpbmdOb2RlIGZvciBob3cgdG8gaXRlcmF0ZSBhbGwgcHJvcGVydGllcywgYWx0aG91Z2ggSSB3b25kZXIgd2h5IEkgZGlkbid0IGp1c3QgdXNlIGEgbWFwL3NldCBvZlxuICAgICAgICAvLyBwcm9wZXJ0aWVzIGVsZW1lbnRzXG4gICAgICAgIC8vIGluc3RlYWQgc28gSSBkb24ndCBuZWVkIHRvIHBhcnNlIGFueSBET00gb3IgZG9tSWRzIGlub3JkZXIgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IG9mIHRoZW0/Pz8/XG4gICAgfVxuXG4gICAgYWRkUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdCA9IG5ldyBFZGl0UHJvcGVydHlEbGcodGhpcyk7XG4gICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdC5vcGVuKCk7XG4gICAgfVxuXG4gICAgYWRkVGFnc1Byb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGVkaXQuZWRpdE5vZGUsIFwidGFnc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcInRhZ3NcIixcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IFwiXCJcbiAgICAgICAgfTtcbiAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCByZXMpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlKHJlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIGFkZFN1YlByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICB2YXIgaXNNdWx0aSA9IHV0aWwuaXNPYmplY3QocHJvcC52YWx1ZXMpO1xuXG4gICAgICAgIC8qIGNvbnZlcnQgdG8gbXVsdGktdHlwZSBpZiB3ZSBuZWVkIHRvICovXG4gICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHByb3AudmFsdWVzLnB1c2gocHJvcC52YWx1ZSk7XG4gICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETy0zOiBmb3IgcGVyZm9ybWFuY2Ugd2UgY291bGQgZG8gc29tZXRoaW5nIHNpbXBsZXIgdGhhbiAncG9wdWxhdGVFZGl0Tm9kZVBnJyBoZXJlLCBidXQgZm9yIG5vdyB3ZSBqdXN0XG4gICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvcC52YWx1ZXMucHVzaChcIlwiKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAqL1xuICAgIGRlbGV0ZVByb3BlcnR5ID0gKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSB0aGUgUHJvcGVydHk6IFwiICsgcHJvcE5hbWUsIFwiWWVzLCBkZWxldGUuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eUltbWVkaWF0ZShwcm9wTmFtZSk7XG4gICAgICAgIH0pKS5vcGVuKCk7XG4gICAgfVxuXG4gICAgZGVsZXRlUHJvcGVydHlJbW1lZGlhdGUgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlUHJvcGVydHlSZXF1ZXN0LCBqc29uLkRlbGV0ZVByb3BlcnR5UmVzcG9uc2U+KFwiZGVsZXRlUHJvcGVydHlcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZVByb3BlcnR5UmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlSZXNwb25zZShyZXMsIHByb3BOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVsZXRlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSwgcHJvcGVydHlUb0RlbGV0ZTogYW55KSA9PiB7XG5cbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIHJlbW92ZSBkZWxldGVkIHByb3BlcnR5IGZyb20gY2xpZW50IHNpZGUgZGF0YSwgc28gd2UgY2FuIHJlLXJlbmRlciBzY3JlZW4gd2l0aG91dCBtYWtpbmcgYW5vdGhlciBjYWxsIHRvXG4gICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJvcHMuZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhKHByb3BlcnR5VG9EZWxldGUpO1xuXG4gICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQpLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogc2NhbiBmb3IgYWxsIG11bHRpLXZhbHVlIHByb3BlcnR5IGZpZWxkcyBhbmQgY2xlYXIgdGhlbSAqL1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlIChjb3VudGVyIDwgMTAwMCkge1xuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkICsgXCJfc3ViUHJvcFwiICsgY291bnRlcildO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICogaXRzZWxmIGZyb20gYW55IGtpbmQgb2YgZGFtYWdlLlxuICAgICAqL1xuICAgIHNhdmVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgKiBJZiBlZGl0aW5nIGFuIHVuc2F2ZWQgbm9kZSBpdCdzIHRpbWUgdG8gcnVuIHRoZSBpbnNlcnROb2RlLCBvciBjcmVhdGVTdWJOb2RlLCB3aGljaCBhY3R1YWxseSBzYXZlcyBvbnRvIHRoZVxuICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAvLyB0b2RvLTA6IG5lZWQgdG8gbWFrZSB0aGlzIGNvbXBhdGlibGUgd2l0aCBBY2UgRWRpdG9yLlxuICAgICAgICAgICAgdGhpcy5zYXZlTmV3Tm9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIEVsc2Ugd2UgYXJlIGVkaXRpbmcgYSBzYXZlZCBub2RlLCB3aGljaCBpcyBhbHJlYWR5IHNhdmVkIG9uIHNlcnZlci5cbiAgICAgICAgICovXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZU5ld05vZGUgPSAobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFuZXdOb2RlTmFtZSkge1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWUgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHdlIGRpZG4ndCBjcmVhdGUgdGhlIG5vZGUgd2UgYXJlIGluc2VydGluZyB1bmRlciwgYW5kIG5laXRoZXIgZGlkIFwiYWRtaW5cIiwgdGhlbiB3ZSBuZWVkIHRvIHNlbmQgbm90aWZpY2F0aW9uXG4gICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWV0YTY0LnVzZXJOYW1lICE9IGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAmJiAvL1xuICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgIGlmIChlZGl0Lm5vZGVJbnNlcnRUYXJnZXQpIHtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydE5vZGVSZXF1ZXN0LCBqc29uLkluc2VydE5vZGVSZXNwb25zZT4oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0TmFtZVwiOiBlZGl0Lm5vZGVJbnNlcnRUYXJnZXQubmFtZSxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiXG4gICAgICAgICAgICB9LCBlZGl0Lmluc2VydE5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5DcmVhdGVTdWJOb2RlUmVxdWVzdCwganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2U+KFwiY3JlYXRlU3ViTm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZSxcbiAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZUF0VG9wXCI6IHRoaXMuY3JlYXRlQXRUb3BcbiAgICAgICAgICAgIH0sIGVkaXQuY3JlYXRlU3ViTm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVFeGlzdGluZ05vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZVwiKTtcblxuICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcblxuICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tIEdldHRpbmcgcHJvcCBpZHg6IFwiICsgaW5kZXgpO1xuXG4gICAgICAgICAgICAvKiBJZ25vcmUgdGhpcyBwcm9wZXJ0eSBpZiBpdCdzIG9uZSB0aGF0IGNhbm5vdCBiZSBlZGl0ZWQgYXMgdGV4dCAqL1xuICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoIXByb3AubXVsdGkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgQWNlIEVkaXRvciBmb3IgSUQ6IFwiICsgcHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChwcm9wLmlkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcFZhbCAhPT0gcHJvcC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3AgY2hhbmdlZDogcHJvcE5hbWU9XCIgKyBwcm9wLnByb3BlcnR5Lm5hbWUgKyBcIiBwcm9wVmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AucHJvcGVydHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3AgZGlkbid0IGNoYW5nZTogXCIgKyBwcm9wLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBFbHNlIHRoaXMgaXMgYSBNVUxUSSBwcm9wZXJ0eSAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWxzID0gW107XG5cbiAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1YlByb3BbXCIgKyBpbmRleCArIFwiXTogXCIgKyBKU09OLnN0cmluZ2lmeShzdWJQcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BWYWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3N1YlByb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIlNldHRpbmdbXCIgKyBwcm9wVmFsICsgXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHN1YlByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWxzLnB1c2gocHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZXNcIjogcHJvcFZhbHNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTsvLyBlbmQgaXRlcmF0b3JcblxuICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICBpZiAocHJvcGVydGllc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzTGlzdCxcbiAgICAgICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uOiBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyBzYXZlTm9kZSgpLiBQb3N0RGF0YT1cIiArIHV0aWwudG9Kc29uKHBvc3REYXRhKSk7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlTm9kZVJlcXVlc3QsIGpzb24uU2F2ZU5vZGVSZXNwb25zZT4oXCJzYXZlTm9kZVwiLCBwb3N0RGF0YSwgZWRpdC5zYXZlTm9kZVJlc3BvbnNlLCBudWxsLCB7XG4gICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIGNoYW5nZWQuIE5vdGhpbmcgdG8gc2F2ZS5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlTXVsdGlQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgTXVsdGkgRWRpdG9yOiBQcm9wZXJ0eSBtdWx0aS10eXBlOiBuYW1lPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIiBjb3VudD1cIlxuICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcyA9IFtdO1xuXG4gICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgIGlmICghcHJvcExpc3QgfHwgcHJvcExpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHByb3BMaXN0ID0gW107XG4gICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKHByb3BFbnRyeS5pZCArIFwiX3N1YlByb3BcIiArIGkpO1xuXG4gICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSB1dGlsLmVzY2FwZUZvckF0dHJpYihwcm9wVmFsKTtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IChpID09IDAgPyBwcm9wRW50cnkucHJvcGVydHkubmFtZSA6IFwiKlwiKSArIFwiLlwiICsgaTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyB0ZXh0YXJlYSB3aXRoIGlkPVwiICsgaWQpO1xuXG4gICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcy5wdXNoKHN1YlByb3ApO1xuXG4gICAgICAgICAgICBpZiAocHJvcEVudHJ5LmJpbmFyeSB8fCBwcm9wRW50cnkucmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcInN0eWxlXCI6IFwiZGlzcGxheTogdGFibGUtY2VsbDtcIlxuICAgICAgICB9LCBmaWVsZHMpO1xuXG4gICAgICAgIHJldHVybiBjb2w7XG4gICAgfVxuXG4gICAgbWFrZVNpbmdsZVByb3BFZGl0b3IgPSAocHJvcEVudHJ5OiBQcm9wRW50cnksIGFjZUZpZWxkczogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eSBzaW5nbGUtdHlwZTogXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wRW50cnkucHJvcGVydHkudmFsdWU7XG4gICAgICAgIHZhciBsYWJlbCA9IHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCA/IHByb3BWYWwgOiAnJztcbiAgICAgICAgcHJvcFZhbFN0ciA9IHV0aWwuZXNjYXBlRm9yQXR0cmliKHByb3BWYWxTdHIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1ha2luZyBzaW5nbGUgcHJvcCBlZGl0b3I6IHByb3BbXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiXSB2YWxbXCIgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVcbiAgICAgICAgICAgICsgXCJdIGZpZWxkSWQ9XCIgKyBwcm9wRW50cnkuaWQpO1xuXG4gICAgICAgIGxldCBwcm9wU2VsQ2hlY2tib3g6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHByb3BFbnRyeS5yZWFkT25seSB8fCBwcm9wRW50cnkuYmluYXJ5KSB7XG4gICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BTZWxDaGVja2JveCA9IHRoaXMubWFrZUNoZWNrQm94KFwiXCIsIFwic2VsUHJvcF9cIiArIHByb3BFbnRyeS5pZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RmllbGREb21JZCA9IHByb3BFbnRyeS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VsQ29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6IDQwcHg7IGRpc3BsYXk6IHRhYmxlLWNlbGw7IHBhZGRpbmc6IDEwcHg7XCJcbiAgICAgICAgfSwgcHJvcFNlbENoZWNrYm94KTtcblxuICAgICAgICBsZXQgZWRpdENvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiAxMDAlOyBkaXNwbGF5OiB0YWJsZS1jZWxsOyBwYWRkaW5nOiAxMHB4O1wiXG4gICAgICAgIH0sIGZpZWxkKTtcblxuICAgICAgICByZXR1cm4gc2VsQ29sICsgZWRpdENvbDtcbiAgICB9XG5cbiAgICBkZWxldGVQcm9wZXJ0eUJ1dHRvbkNsaWNrID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIC8qIEl0ZXJhdGUgb3ZlciBhbGwgcHJvcGVydGllcyAqL1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmZpZWxkSWRUb1Byb3BNYXApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkSWRUb1Byb3BNYXAuaGFzT3duUHJvcGVydHkoaWQpKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBnZXQgUHJvcEVudHJ5IGZvciB0aGlzIGl0ZW0gKi9cbiAgICAgICAgICAgICAgICBsZXQgcHJvcEVudHJ5OiBQcm9wRW50cnkgPSB0aGlzLmZpZWxkSWRUb1Byb3BNYXBbaWRdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3A9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxQcm9wRG9tSWQgPSBcInNlbFByb3BfXCIgKyBwcm9wRW50cnkuaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgR2V0IGNoZWNrYm94IGNvbnRyb2wgYW5kIGl0cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB0b2RvLTE6IGdldHRpbmcgdmFsdWUgb2YgY2hlY2tib3ggc2hvdWxkIGJlIGluIHNvbWUgc2hhcmVkIHV0aWxpdHkgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHNlbFByb3BEb21JZCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsQ2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGVja2VkOiBib29sZWFuID0gc2VsQ2hlY2tib3gubm9kZS5jaGVja2VkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHJvcCBJUyBDSEVDS0VEPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJvcGVydHkocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZm9yIG5vdyBsZXRzJyBqdXN0IHN1cHBvcnQgZGVsZXRpbmcgb25lIHByb3BlcnR5IGF0IGEgdGltZSwgYW5kIHNvIHdlIGNhbiByZXR1cm4gb25jZSB3ZSBmb3VuZCBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCBvbmUgdG8gZGVsZXRlLiBXb3VsZCBiZSBlYXN5IHRvIGV4dGVuZCB0byBhbGxvdyBtdWx0aXBsZS1zZWxlY3RzIGluIHRoZSBmdXR1cmUgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwicHJvcEVudHJ5IG5vdCBmb3VuZCBmb3IgaWQ6IFwiICsgaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRlIHByb3BlcnR5OiBcIilcbiAgICB9XG5cbiAgICBzcGxpdENvbnRlbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGxldCBub2RlQmVsb3c6IGpzb24uTm9kZUluZm8gPSBlZGl0LmdldE5vZGVCZWxvdyhlZGl0LmVkaXROb2RlKTtcbiAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwibm9kZUJlbG93SWRcIjogKG5vZGVCZWxvdyA9PSBudWxsID8gbnVsbCA6IG5vZGVCZWxvdy5pZCksXG4gICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgIH0sIHRoaXMuc3BsaXRDb250ZW50UmVzcG9uc2UpO1xuICAgIH1cblxuICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTcGxpdCBjb250ZW50XCIsIHJlcykpIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbmNlbEVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIGlmIChtZXRhNjQudHJlZURpcnR5KSB7XG4gICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICBpZiAodGhpcy5jb250ZW50RmllbGREb21JZCkge1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xuY2xhc3MgRWRpdFByb3BlcnR5RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXROb2RlRGxnOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoXCJFZGl0UHJvcGVydHlEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZSBQcm9wZXJ0eVwiKTtcblxuICAgICAgICB2YXIgc2F2ZVByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByb3BlcnR5QnV0dG9uXCIsIHRoaXMuc2F2ZVByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgdmFyIGNhbmNlbEVkaXRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImVkaXRQcm9wZXJ0eVBnQ2xvc2VCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlUHJvcGVydHlCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uKTtcblxuICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKVxuICAgICAgICAgICAgICAgICsgXCInIGNsYXNzPSdwYXRoLWRpc3BsYXktaW4tZWRpdG9yJz48L2Rpdj5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIHBvcHVsYXRlUHJvcGVydHlFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgZmllbGQgPSAnJztcblxuICAgICAgICAvKiBQcm9wZXJ0eSBOYW1lIEZpZWxkICovXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmaWVsZFByb3BOYW1lSWQgPSBcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcE5hbWVJZCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wTmFtZUlkKSxcbiAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgbmFtZVwiLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOYW1lXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogUHJvcGVydHkgVmFsdWUgRmllbGQgKi9cbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZpZWxkUHJvcFZhbHVlSWQgPSBcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BWYWx1ZUlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BWYWx1ZUlkKSxcbiAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgdGV4dFwiLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJWYWx1ZVwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSwgZmllbGQpO1xuICAgIH1cblxuICAgIHNhdmVQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiKSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiKSk7XG5cbiAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVEYXRhLFxuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogcHJvcGVydHlWYWx1ZURhdGFcbiAgICAgICAgfTtcbiAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuZWRpdE5vZGVEbGcuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLmVkaXROb2RlRGxnLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVQcm9wZXJ0eUVkaXQoKTtcbiAgICB9XG59XG5jbGFzcyBTaGFyZVRvUGVyc29uRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlciB0byBTaGFyZSBXaXRoXCIsIFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICB2YXIgc2hhcmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNoYXJlXCIsIFwic2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIiwgdGhpcy5zaGFyZU5vZGVUb1BlcnNvbixcbiAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaGFyZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciB0YXJnZXRVc2VyID0gdGhpcy5nZXRJbnB1dFZhbChcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgaWYgKCF0YXJnZXRVc2VyKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICBcInByaW5jaXBhbFwiOiB0YXJnZXRVc2VyLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IFtcInJlYWRcIiwgXCJ3cml0ZVwiLCBcImFkZENoaWxkcmVuXCIsIFwibm9kZVR5cGVNYW5hZ2VtZW50XCJdLFxuICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogZmFsc2VcbiAgICAgICAgfSwgdGhpei5yZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uLCB0aGl6KTtcbiAgICB9XG5cbiAgICByZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uID0gKHJlczoganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTaGFyZSBOb2RlIHdpdGggUGVyc29uXCIsIHJlcykpIHtcbiAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBTaGFyaW5nRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgdmFyIHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHdpdGggUGVyc29uXCIsIFwic2hhcmVOb2RlVG9QZXJzb25QZ0J1dHRvblwiLFxuICAgICAgICAgICAgdGhpcy5zaGFyZU5vZGVUb1BlcnNvblBnLCB0aGlzKTtcbiAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlU2hhcmluZ0J1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSd2ZXJ0aWNhbC1sYXlvdXQtcm93JyBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICsgdGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdldHMgcHJpdmlsZWdlcyBmcm9tIHNlcnZlciBhbmQgZGlzcGxheXMgaW4gR1VJIGFsc28uIEFzc3VtZXMgZ3VpIGlzIGFscmVhZHkgYXQgY29ycmVjdCBwYWdlLlxuICAgICAqL1xuICAgIHJlbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5vZGUgc2hhcmluZyBpbmZvLlwiKTtcblxuICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhhbmRsZXMgZ2V0Tm9kZVByaXZpbGVnZXMgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgKlxuICAgICAqIHJlcy5hY2xFbnRyaWVzID0gbGlzdCBvZiBBY2Nlc3NDb250cm9sRW50cnlJbmZvLmphdmEganNvbiBvYmplY3RzXG4gICAgICovXG4gICAgZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSA9IChyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnBvcHVsYXRlU2hhcmluZ1BnKHJlcyk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGdvdHRlbiBiYWNrIGZyb20gdGhlIHNlcnZlciBjb250YWluaW5nIEFDTCBpbmZvIHNvIHdlIGNhbiBwb3B1bGF0ZSB0aGUgc2hhcmluZyBwYWdlIGluIHRoZSBndWlcbiAgICAgKi9cbiAgICBwb3B1bGF0ZVNoYXJpbmdQZyA9IChyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAkLmVhY2gocmVzLmFjbEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4LCBhY2xFbnRyeSkge1xuICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtbGlzdFwiXG4gICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHB1YmxpY0FwcGVuZEF0dHJzID0ge1xuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIsXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAocmVzLnB1YmxpY0FwcGVuZCkge1xuICAgICAgICAgICAgcHVibGljQXBwZW5kQXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvOiB1c2UgYWN0dWFsIHBvbHltZXIgcGFwZXItY2hlY2tib3ggaGVyZSAqL1xuICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBwdWJsaWNBcHBlbmRBdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgIFwiZm9yXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgfSwgXCJBbGxvdyBwdWJsaWMgY29tbWVudGluZyB1bmRlciB0aGlzIG5vZGUuXCIsIHRydWUpO1xuXG4gICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgfVxuXG4gICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVXNpbmcgb25DbGljayBvbiB0aGUgZWxlbWVudCBBTkQgdGhpcyB0aW1lb3V0IGlzIHRoZSBvbmx5IGhhY2sgSSBjb3VsZCBmaW5kIHRvIGdldCBnZXQgd2hhdCBhbW91bnRzIHRvIGEgc3RhdGVcbiAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXouaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIikpO1xuXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogKHBvbHlFbG0ubm9kZS5jaGVja2VkID8gdHJ1ZSA6IGZhbHNlKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgMjUwKTtcbiAgICB9XG5cbiAgICByZW1vdmVQcml2aWxlZ2UgPSAocHJpbmNpcGFsOiBzdHJpbmcsIHByaXZpbGVnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICovXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlJlbW92ZVByaXZpbGVnZVJlcXVlc3QsIGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2U+KFwicmVtb3ZlUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VcIjogcHJpdmlsZWdlXG4gICAgICAgIH0sIHRoaXMucmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHJlbW92ZVByaXZpbGVnZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmVuZGVyQWNsUHJpdmlsZWdlcyA9IChwcmluY2lwYWw6IGFueSwgYWNsRW50cnk6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICQuZWFjaChhY2xFbnRyeS5wcml2aWxlZ2VzLCBmdW5jdGlvbihpbmRleCwgcHJpdmlsZWdlKSB7XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpei5ndWlkICsgXCIpLnJlbW92ZVByaXZpbGVnZSgnXCIgKyBwcmluY2lwYWwgKyBcIicsICdcIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lXG4gICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgIHJvdyArPSBcIjxiPlwiICsgcHJpbmNpcGFsICsgXCI8L2I+IGhhcyBwcml2aWxlZ2UgPGI+XCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZSArIFwiPC9iPiBvbiB0aGlzIG5vZGUuXCI7XG5cbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWVudHJ5XCJcbiAgICAgICAgICAgIH0sIHJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIChuZXcgU2hhcmVUb1BlcnNvbkRsZygpKS5vcGVuKCk7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2hhcmluZyBub2RlIHRvIHB1YmxpYy5cIik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQWRkIHByaXZpbGVnZSBhbmQgdGhlbiByZWxvYWQgc2hhcmUgbm9kZXMgZGlhbG9nIGZyb20gc2NyYXRjaCBkb2luZyBhbm90aGVyIGNhbGxiYWNrIHRvIHNlcnZlclxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IFtcInJlYWRcIl0sXG4gICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICB9LCB0aGlzLnJlbG9hZCwgdGhpcyk7XG4gICAgfVxufVxuY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgIHZhciBjdXJOb2RlUGF0aERpc3BsYXkgPSBcIjxoNCBjbGFzcz0ncGF0aC1kaXNwbGF5JyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpICsgXCInPjwvaDQ+XCI7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlbmFtZU5vZGVCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZWxlY3QgYSBub2RlIHRvIHJlbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGlmIG5vIG5vZGUgYmVsb3cgdGhpcyBub2RlLCByZXR1cm5zIG51bGwgKi9cbiAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmFtZU5vZGVSZXF1ZXN0LCBqc29uLlJlbmFtZU5vZGVSZXNwb25zZT4oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICBcIm5ld05hbWVcIjogbmV3TmFtZVxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGl6LnJlbmFtZU5vZGVSZXNwb25zZShyZXMsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbmFtZU5vZGVSZXNwb25zZSwgcmVuYW1pbmdQYWdlUm9vdDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZW5hbWUgbm9kZVwiLCByZXMpKSB7XG4gICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUocmVzLm5ld0lkLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSkuaHRtbChcIk5hbWU6IFwiICsgaGlnaGxpZ2h0Tm9kZS5uYW1lKTtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIGhpZ2hsaWdodE5vZGUucGF0aCk7XG4gICAgfVxufVxuXHJcbi8qIFRoaXMgaXMgYW4gYXVkaW8gcGxheWVyIGRpYWxvZyB0aGF0IGhhcyBhZC1za2lwcGluZyB0ZWNobm9sb2d5IHByb3ZpZGVkIGJ5IHBvZGNhc3QudHMgKi9cclxuY2xhc3MgQXVkaW9QbGF5ZXJEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVVybDogc3RyaW5nLCBwcml2YXRlIG5vZGVVaWQ6IHN0cmluZywgcHJpdmF0ZSBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcIkF1ZGlvUGxheWVyRGxnXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBzdGFydFRpbWVQZW5kaW5nIGluIGNvbnN0cnVjdG9yOiAke3N0YXJ0VGltZVBlbmRpbmd9YCk7XHJcbiAgICAgICAgcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nID0gc3RhcnRUaW1lUGVuZGluZztcclxuICAgIH1cclxuXHJcbiAgICAvKiBXaGVuIHRoZSBkaWFsb2cgY2xvc2VzIHdlIG5lZWQgdG8gc3RvcCBhbmQgcmVtb3ZlIHRoZSBwbGF5ZXIgKi9cclxuICAgIHB1YmxpYyBjYW5jZWwoKSB7XHJcbiAgICAgICAgc3VwZXIuY2FuY2VsKCk7XHJcbiAgICAgICAgbGV0IHBsYXllciA9ICQoXCIjXCIgKyB0aGlzLmlkKFwiYXVkaW9QbGF5ZXJcIikpO1xyXG4gICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLyogZm9yIHNvbWUgcmVhc29uIHRoZSBhdWRpbyBwbGF5ZXIgbmVlZHMgdG8gYmUgYWNjZXNzZWQgbGlrZSBpdCdzIGFuIGFycmF5ICovXHJcbiAgICAgICAgICAgICg8YW55PnBsYXllclswXSkucGF1c2UoKTtcclxuICAgICAgICAgICAgcGxheWVyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJBdWRpbyBQbGF5ZXJcIik7XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt0aGlzLm5vZGVVaWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBgdW5rbm93biBub2RlIHVpZDogJHt0aGlzLm5vZGVVaWR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAvKiBUaGlzIGlzIHdoZXJlIEkgbmVlZCBhIHNob3J0IG5hbWUgb2YgdGhlIG1lZGlhIGJlaW5nIHBsYXllZCAqL1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vcmVmZXJlbmNlczpcclxuICAgICAgICAvL2h0dHA6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL3JlZl9hdl9kb20uYXNwXHJcbiAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgIGxldCBwbGF5ZXJBdHRyaWJzOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIFwic3JjXCI6IHRoaXMuc291cmNlVXJsLFxyXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiAxMDAlOyBwYWRkaW5nOjBweDsgbWFyZ2luLXRvcDogMHB4OyBtYXJnaW4tbGVmdDogMHB4OyBtYXJnaW4tcmlnaHQ6IDBweDtcIixcclxuICAgICAgICAgICAgXCJvbnRpbWV1cGRhdGVcIjogYHBvZGNhc3Qub25UaW1lVXBkYXRlKCcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICBcIm9uY2FucGxheVwiOiBgcG9kY2FzdC5vbkNhblBsYXkoJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgIFwiY29udHJvbHNcIjogXCJjb250cm9sc1wiLFxyXG4gICAgICAgICAgICBcInByZWxvYWRcIjogXCJhdXRvXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyID0gcmVuZGVyLnRhZyhcImF1ZGlvXCIsIHBsYXllckF0dHJpYnMpO1xyXG5cclxuICAgICAgICAvL1NraXBwaW5nIEJ1dHRvbnNcclxuICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogYHBvZGNhc3Quc2tpcCgtMzAsICcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiPCAzMHNcIik7XHJcblxyXG4gICAgICAgIGxldCBza2lwRm9yd2FyZDMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBgcG9kY2FzdC5za2lwKDMwLCAnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICBsZXQgc2tpcEJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihza2lwQmFjazMwQnV0dG9uICsgc2tpcEZvcndhcmQzMEJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vU3BlZWQgQnV0dG9uc1xyXG4gICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJwb2RjYXN0LnNwZWVkKDEuMCk7XCIsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGVlZDE1QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Quc3BlZWQoMS41KTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIjEuNVhcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGVlZDJ4QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Quc3BlZWQoMik7XCIsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCIyWFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAvL0RpYWxvZyBCdXR0b25zXHJcbiAgICAgICAgbGV0IHBhdXNlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3QucGF1c2UoKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIlBhdXNlXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGxheUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJwb2RjYXN0LnBsYXkoKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBsYXlCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgLy90b2RvLTA6IGV2ZW4gaWYgdGhpcyBidXR0b24gYXBwZWFycyB0byB3b3JrLCBJIG5lZWQgaXQgdG8gZXhwbGljaXRseSBlbmZvcmNlIHRoZSBzYXZpbmcgb2YgdGhlIHRpbWV2YWx1ZSBBTkQgdGhlIHJlbW92YWwgb2YgdGhlIEFVRElPIGVsZW1lbnQgZnJvbSB0aGUgRE9NICovXHJcbiAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZUF1ZGlvUGxheWVyRGxnQnV0dG9uXCIsIHRoaXMuY2xvc2VCdG4pO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGRlc2NyaXB0aW9uICsgcGxheWVyICsgc2tpcEJ1dHRvbkJhciArIHNwZWVkQnV0dG9uQmFyICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENyZWF0ZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgIGxhc3RTZWxUeXBlTmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgIGxldCBjcmVhdGVGaXJzdENoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJGaXJzdFwiLCBcImNyZWF0ZUZpcnN0Q2hpbGRCdXR0b25cIiwgdGhpcy5jcmVhdGVGaXJzdENoaWxkLCB0aGlzLCB0cnVlLCAxMDAwKTtcbiAgICAgICAgbGV0IGNyZWF0ZUxhc3RDaGlsZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTGFzdFwiLCBcImNyZWF0ZUxhc3RDaGlsZEJ1dHRvblwiLCB0aGlzLmNyZWF0ZUxhc3RDaGlsZCwgdGhpcyk7XG4gICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIklubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxCdXR0b25cIik7XG4gICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY3JlYXRlRmlyc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUxhc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUlubGluZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIGxldCBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgbGV0IHR5cGVJZHggPSAwO1xuICAgICAgICAvKiB0b2RvLTE6IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGVudW1lcmF0ZSBhbmQgYWRkIHRoZSB0eXBlcyB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoICovXG4gICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTdGFuZGFyZCBUeXBlXCIsIFwibnQ6dW5zdHJ1Y3R1cmVkXCIsIHR5cGVJZHgrKywgdHJ1ZSk7XG4gICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJSU1MgRmVlZFwiLCBcIm1ldGE2NDpyc3NmZWVkXCIsIHR5cGVJZHgrKywgZmFsc2UpO1xuICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3lzdGVtIEZvbGRlclwiLCBcIm1ldGE2NDpzeXN0ZW1mb2xkZXJcIiwgdHlwZUlkeCsrLCBmYWxzZSk7XG5cbiAgICAgICAgdmFyIGxpc3RCb3ggPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0Qm94XCJcbiAgICAgICAgfSwgY29udGVudCk7XG5cbiAgICAgICAgdmFyIG1haW5Db250ZW50OiBzdHJpbmcgPSBsaXN0Qm94O1xuXG4gICAgICAgIHZhciBjZW50ZXJlZEhlYWRlcjogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiY2VudGVyZWRUaXRsZVwiXG4gICAgICAgIH0sIGhlYWRlcik7XG5cbiAgICAgICAgcmV0dXJuIGNlbnRlcmVkSGVhZGVyICsgbWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgbWFrZUxpc3RJdGVtKHZhbDogc3RyaW5nLCB0eXBlTmFtZTogc3RyaW5nLCB0eXBlSWR4OiBudW1iZXIsIGluaXRpYWxseVNlbGVjdGVkOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHBheWxvYWQ6IE9iamVjdCA9IHtcbiAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdHlwZU5hbWUsXG4gICAgICAgICAgICBcInR5cGVJZHhcIjogdHlwZUlkeFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBkaXZJZDogc3RyaW5nID0gdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpO1xuXG4gICAgICAgIGlmIChpbml0aWFsbHlTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSB0eXBlTmFtZTtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEl0ZW1cIiArIChpbml0aWFsbHlTZWxlY3RlZCA/IFwiIHNlbGVjdGVkTGlzdEl0ZW1cIiA6IFwiXCIpLFxuICAgICAgICAgICAgXCJpZFwiOiBkaXZJZCxcbiAgICAgICAgICAgIFwib25jbGlja1wiOiBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLm9uUm93Q2xpY2ssIHRoaXMsIHBheWxvYWQpXG4gICAgICAgIH0sIHZhbCk7XG4gICAgfVxuXG4gICAgY3JlYXRlRmlyc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIHRydWUpO1xuICAgIH1cblxuICAgIGNyZWF0ZUxhc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGVJbmxpbmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWRpdC5pbnNlcnROb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lKTtcbiAgICB9XG5cbiAgICBvblJvd0NsaWNrID0gKHBheWxvYWQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgZGl2SWQgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgcGF5bG9hZC50eXBlSWR4KTtcbiAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSBwYXlsb2FkLnR5cGVOYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmxhc3RTZWxEb21JZCkge1xuICAgICAgICAgICAgdGhpcy5lbCh0aGlzLmxhc3RTZWxEb21JZCkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgIHRoaXMuZWwoZGl2SWQpLmFkZENsYXNzKFwic2VsZWN0ZWRMaXN0SXRlbVwiKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGxldCBjYW5JbnNlcnRJbmxpbmU6IGJvb2xlYW4gPSBtZXRhNjQuaG9tZU5vZGVJZCAhPSBub2RlLmlkO1xuICAgICAgICAgICAgaWYgKGNhbkluc2VydElubGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZWwoXCJjcmVhdGVJbmxpbmVCdXR0b25cIikuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbChcImNyZWF0ZUlubGluZUJ1dHRvblwiKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBTZWFyY2hSZXN1bHRzUGFuZWwge1xyXG5cclxuICAgIGRvbUlkOiBzdHJpbmcgPSBcInNlYXJjaFJlc3VsdHNQYW5lbFwiO1xyXG4gICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJyBjbGFzcz0ncGFnZS10aXRsZSc+PC9oMj5cIjtcclxuICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3NlYXJjaFJlc3VsdHNWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgJChcIiNzZWFyY2hQYWdlVGl0bGVcIikuaHRtbChzcmNoLnNlYXJjaFBhZ2VUaXRsZSk7XHJcbiAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBUaW1lbGluZVJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgZG9tSWQ6IHN0cmluZyA9IFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIjtcclxuICAgIHRhYklkOiBzdHJpbmcgPSBcInRpbWVsaW5lVGFiTmFtZVwiO1xyXG4gICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0ndGltZWxpbmVQYWdlVGl0bGUnIGNsYXNzPSdwYWdlLXRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0ndGltZWxpbmVWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAkKFwiI3RpbWVsaW5lUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC50aW1lbGluZVBhZ2VUaXRsZSk7XHJcbiAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgIH1cclxufVxuXG5tZXRhNjQuaW5pdEFwcCgpO1xuIl19