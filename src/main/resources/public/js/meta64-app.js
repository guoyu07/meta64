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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21lZ2EtbWV0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQXlhQSxJQUFVLElBQUksQ0EwQmI7QUExQkQsV0FBVSxJQUFJO0lBRUMsU0FBSSxHQUFXLFdBQVcsQ0FBQztJQUMzQixxQkFBZ0IsR0FBVyxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBQ3JELHFCQUFnQixHQUFXLFlBQVksR0FBRyxVQUFVLENBQUM7SUFJckQsdUJBQWtCLEdBQVcsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUV6RCxzQkFBaUIsR0FBVyx1QkFBdUIsQ0FBQztJQUNwRCxtQkFBYyxHQUFZLEtBQUssQ0FBQztJQUNoQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztJQUNoQywyQkFBc0IsR0FBWSxJQUFJLENBQUM7SUFNdkMsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUFHaEMsc0JBQWlCLEdBQVksSUFBSSxDQUFDO0lBQ2xDLHNCQUFpQixHQUFZLElBQUksQ0FBQztJQUVsQyxnQ0FBMkIsR0FBWSxLQUFLLENBQUM7QUFDNUQsQ0FBQyxFQTFCUyxJQUFJLEtBQUosSUFBSSxRQTBCYjtBQUtEO0lBQ0ksbUJBQW1CLFNBQWlCLEVBQ3pCLE9BQWU7UUFEUCxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3pCLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFDMUIsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDtJQUNJLG1CQUFtQixFQUFVLEVBQ2xCLFFBQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUFpQixFQUNqQixNQUFlLEVBQ2YsUUFBbUI7UUFMWCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLFVBQUssR0FBTCxLQUFLLENBQVM7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDZixhQUFRLEdBQVIs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Q0wsQ0FBQztJQUFELDJCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQUVELE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFwidXNlIHN0cmljdFwiO1xuXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cbmRlY2xhcmUgdmFyIFBvbHltZXI7XG5kZWNsYXJlIHZhciBEcm9wem9uZTtcbmRlY2xhcmUgdmFyIGFjZTtcbmRlY2xhcmUgdmFyIGNvb2tpZVByZWZpeDtcbmRlY2xhcmUgdmFyIHBvc3RUYXJnZXRVcmw7XG5kZWNsYXJlIHZhciBwcmV0dHlQcmludDtcbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFO1xuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEVfU0hPUlQ7XG5cbmludGVyZmFjZSBfSGFzU2VsZWN0IHtcbiAgICBzZWxlY3Q/OiBhbnk7XG59XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBqc29uIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgICAgIHByaW5jaXBhbE5hbWU6IHN0cmluZztcbiAgICAgICAgcHJpdmlsZWdlczogUHJpdmlsZWdlSW5mb1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZUluZm8ge1xuICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgcHJpbWFyeVR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICBoYXNDaGlsZHJlbjogYm9vbGVhbjtcbiAgICAgICAgaGFzQmluYXJ5OiBib29sZWFuO1xuICAgICAgICBiaW5hcnlJc0ltYWdlOiBib29sZWFuO1xuICAgICAgICBiaW5WZXI6IG51bWJlcjtcbiAgICAgICAgd2lkdGg6IG51bWJlcjtcbiAgICAgICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgIGNoaWxkcmVuT3JkZXJlZDogYm9vbGVhbjtcbiAgICAgICAgdWlkOiBzdHJpbmc7XG4gICAgICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xuICAgICAgICBsYXN0TW9kaWZpZWQ6IERhdGU7XG4gICAgICAgIGltZ0lkOiBzdHJpbmc7XG4gICAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcml2aWxlZ2VJbmZvIHtcbiAgICAgICAgcHJpdmlsZWdlTmFtZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHlJbmZvIHtcbiAgICAgICAgdHlwZTogbnVtYmVyO1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgICAgIGFiYnJldmlhdGVkOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmSW5mbyB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIHBhdGg6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgICAgIGVkaXRNb2RlOiBib29sZWFuO1xuICAgICAgICBhZHZhbmNlZE1vZGU6IGJvb2xlYW47XG4gICAgICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgICAgIGltcG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgIGV4cG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgcHJpdmlsZWdlczogc3RyaW5nW107XG4gICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBBbm9uUGFnZUxvYWRSZXF1ZXN0IHtcbiAgICAgICAgaWdub3JlVXJsOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0IHtcbiAgICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgcGFzc0NvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlcXVlc3Qge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVSU1NSZXF1ZXN0IHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNldFBsYXllckluZm9SZXF1ZXN0IHtcbiAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgLy9ub2RlUGF0aDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICB1cmw6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIGNyZWF0ZUF0VG9wOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHByb3BOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHRhcmdldEZpbGVOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1JlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgaW5jbHVkZUFjbDogYm9vbGVhbjtcbiAgICAgICAgaW5jbHVkZU93bmVyczogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXF1ZXN0IHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBzb3VyY2VGaWxlTmFtZTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1JlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgYm9va05hbWU6IHN0cmluZztcbiAgICAgICAgdHJ1bmNhdGVkOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlcXVlc3Qge1xuICAgICAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgICAgICB0YXJnZXROYW1lOiBzdHJpbmc7XG4gICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlcXVlc3Qge1xuICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgICAgICB0ek9mZnNldDogbnVtYmVyO1xuICAgICAgICBkc3Q6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXF1ZXN0IHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1JlcXVlc3Qge1xuICAgICAgICB0YXJnZXROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgdGFyZ2V0Q2hpbGRJZDogc3RyaW5nO1xuICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgc29ydERpcjogc3RyaW5nO1xuICAgICAgICBzb3J0RmllbGQ6IHN0cmluZztcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgc2VhcmNoUHJvcDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsZVNlYXJjaFJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICByZWluZGV4OiBib29sZWFuXG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICBwcml2aWxlZ2U6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIG5ld05hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHVwTGV2ZWw6IG51bWJlcjtcbiAgICAgICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgICAgIHJlbmRlclBhcmVudElmTGVhZjogYm9vbGVhbjtcbiAgICAgICAgZ29Ub0xhc3RQYWdlOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nO1xuICAgICAgICBwcm9wZXJ0eVZhbHVlOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCB7XG4gICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXF1ZXN0IHtcbiAgICAgICAgZmlsZU5hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlcXVlc3Qge1xuICAgICAgICBwYXJlbnROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIHNpYmxpbmdJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgIGNhcHRjaGE6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgbm9kZUJlbG93SWQ6IHN0cmluZztcbiAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVxdWVzdCB7XG4gICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICBzb3VyY2VVcmw6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEJyb3dzZUZvbGRlclJlcXVlc3Qge1xuICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICByZW5kZXJOb2RlUmVzcG9uc2U6IFJlbmRlck5vZGVSZXNwb25zZTtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNldFBsYXllckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB0aW1lT2Zmc2V0OiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZVByb3BlcnR5UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBub2RlSW5mbzogTm9kZUluZm87XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICBvd25lcnM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBzZXJ2ZXJJbmZvOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBHZXRTaGFyZWROb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEltcG9ydFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICByb290Tm9kZTogUmVmSW5mbztcbiAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xuICAgICAgICB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlcztcbiAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9nb3V0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHNlYXJjaFJlc3VsdE5vZGVJZDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICBjaGlsZHJlbjogTm9kZUluZm9bXTtcbiAgICAgICAgb2Zmc2V0T2ZOb2RlRm91bmQ6IG51bWJlcjtcblxuICAgICAgICAvKiBob2xkcyB0cnVlIGlmIHdlIGhpdCB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkIG5vZGVzICovXG4gICAgICAgIGVuZFJlYWNoZWQ6IGJvb2xlYW47XG5cbiAgICAgICAgZGlzcGxheWVkUGFyZW50OiBib29sZWFuO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICBub2RlOiBOb2RlSW5mbztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgcHJvcGVydHlTYXZlZDogUHJvcGVydHlJbmZvO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU3BsaXROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkRnJvbVVybFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEJyb3dzZUZvbGRlclJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgbGlzdGluZ0pzb246IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICB9XG5cbn1cblxubmFtZXNwYWNlIGNuc3Qge1xyXG5cclxuICAgIGV4cG9ydCBsZXQgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1VTUjogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblVzclwiO1xyXG4gICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fUFdEOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luUHdkXCI7XHJcbiAgICAvKlxyXG4gICAgICogbG9naW5TdGF0ZT1cIjBcIiBpZiB1c2VyIGxvZ2dlZCBvdXQgaW50ZW50aW9uYWxseS4gbG9naW5TdGF0ZT1cIjFcIiBpZiBsYXN0IGtub3duIHN0YXRlIG9mIHVzZXIgd2FzICdsb2dnZWQgaW4nXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgIGV4cG9ydCBsZXQgQlI6IFwiPGRpdiBjbGFzcz0ndmVydC1zcGFjZSc+PC9kaXY+XCI7XHJcbiAgICBleHBvcnQgbGV0IElOU0VSVF9BVFRBQ0hNRU5UOiBzdHJpbmcgPSBcInt7aW5zZXJ0LWF0dGFjaG1lbnR9fVwiO1xyXG4gICAgZXhwb3J0IGxldCBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgZXhwb3J0IGxldCBJTlNfT05fVE9PTEJBUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgZXhwb3J0IGxldCBNT1ZFX1VQRE9XTl9PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyB3b3JrcywgYnV0IEknbSBub3Qgc3VyZSBJIHdhbnQgaXQgZm9yIEFMTCBlZGl0aW5nLiBTdGlsbCB0aGlua2luZyBhYm91dCBkZXNpZ24gaGVyZSwgYmVmb3JlIEkgdHVybiB0aGlzXHJcbiAgICAgKiBvbi5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBVU0VfQUNFX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qIHNob3dpbmcgcGF0aCBvbiByb3dzIGp1c3Qgd2FzdGVzIHNwYWNlIGZvciBvcmRpbmFyeSB1c2Vycy4gTm90IHJlYWxseSBuZWVkZWQgKi9cclxuICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZXhwb3J0IGxldCBTSE9XX1BBVEhfSU5fRExHUzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgZXhwb3J0IGxldCBTSE9XX0NMRUFSX0JVVFRPTl9JTl9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cbi8qIFRoZXNlIGFyZSBDbGllbnQtc2lkZSBvbmx5IG1vZGVscywgYW5kIGFyZSBub3Qgc2VlbiBvbiB0aGUgc2VydmVyIHNpZGUgZXZlciAqL1xuXG4vKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuY2xhc3MgQWRTZWdtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgcHVibGljIGVuZFRpbWU6IG51bWJlcikge1xuICAgIH1cbn1cblxuY2xhc3MgUHJvcEVudHJ5IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHByb3BlcnR5OiBqc29uLlByb3BlcnR5SW5mbywgLy9cbiAgICAgICAgcHVibGljIG11bHRpOiBib29sZWFuLCAvL1xuICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyBiaW5hcnk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyBzdWJQcm9wczogU3ViUHJvcFtdKSB7XG4gICAgfVxufVxuXG5jbGFzcyBTdWJQcm9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHZhbDogc3RyaW5nKSB7XG4gICAgfVxufVxuXG5uYW1lc3BhY2UgdXRpbCB7XHJcblxyXG4gICAgZXhwb3J0IGxldCBsb2dBamF4OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBleHBvcnQgbGV0IHRpbWVvdXRNZXNzYWdlU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGV4cG9ydCBsZXQgb2ZmbGluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgd2FpdENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBleHBvcnQgbGV0IHBncnNEbGc6IGFueSA9IG51bGw7XHJcblxuICAgIGV4cG9ydCBsZXQgZXNjYXBlUmVnRXhwID0gZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gXy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgZXNjYXBlRm9yQXR0cmliID0gZnVuY3Rpb24oXykge1xuICAgICAgICByZXR1cm4gdXRpbC5yZXBsYWNlQWxsKF8sIFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgaWYgKCF1dGlsLmNvbnRhaW5zKF8sIFwiJlwiKSlcbiAgICAgICAgICAgIHJldHVybiBfO1xuXG4gICAgICAgIHZhciByZXQgPSBfO1xuICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJmFtcDsnLCAnJicpO1xuICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJmd0OycsICc+Jyk7XG4gICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmbHQ7JywgJzwnKTtcbiAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgJyZxdW90OycsICdcIicpO1xuICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJiMzOTsnLCBcIidcIik7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlcGxhY2VBbGwgPSBmdW5jdGlvbihfLCBmaW5kLCByZXBsYWNlKSB7XG4gICAgICAgIHJldHVybiBfLnJlcGxhY2UobmV3IFJlZ0V4cCh1dGlsLmVzY2FwZVJlZ0V4cChmaW5kKSwgJ2cnKSwgcmVwbGFjZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBjb250YWlucyA9IGZ1bmN0aW9uKF8sIHN0cikge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKHN0cikgIT0gLTE7XG4gICAgfVxuXHJcbiAgICBleHBvcnQgbGV0IHN0YXJ0c1dpdGggPSBmdW5jdGlvbihfLCBzdHIpIHtcclxuICAgICAgICByZXR1cm4gXy5pbmRleE9mKHN0cikgPT09IDA7XHJcbiAgICB9XHJcblxuICAgIGV4cG9ydCBsZXQgc3RyaXBJZlN0YXJ0c1dpdGggPSBmdW5jdGlvbihfLCBzdHIpIHtcbiAgICAgICAgaWYgKF8uc3RhcnRzV2l0aChzdHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF87XG4gICAgfVxuXHJcbiAgICBleHBvcnQgbGV0IGFycmF5Q2xvbmUgPSBmdW5jdGlvbihfOiBhbnlbXSkge1xyXG4gICAgICAgIHJldHVybiBfLnNsaWNlKDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgbGV0IGFycmF5SW5kZXhPZkl0ZW1CeVByb3AgPSBmdW5jdGlvbihfOiBhbnlbXSwgcHJvcE5hbWUsIHByb3BWYWwpIHtcclxuICAgICAgICB2YXIgbGVuID0gXy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoX1tpXVtwcm9wTmFtZV0gPT09IHByb3BWYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcblxyXG4gICAgLyogbmVlZCB0byB0ZXN0IGFsbCBjYWxscyB0byB0aGlzIG1ldGhvZCBiZWNhdXNlIGkgbm90aWNlZCBkdXJpbmcgVHlwZVNjcmlwdCBjb252ZXJzaW9uIGkgd2Fzbid0IGV2ZW4gcmV0dXJuaW5nXHJcbiAgICBhIHZhbHVlIGZyb20gdGhpcyBmdW5jdGlvbiEgdG9kby0wXHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBhcnJheU1vdmVJdGVtID0gZnVuY3Rpb24oXzogYW55W10sIGZyb21JbmRleCwgdG9JbmRleCkge1xyXG4gICAgICAgIF8uc3BsaWNlKHRvSW5kZXgsIDAsIF8uc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHN0ZFRpbWV6b25lT2Zmc2V0ID0gZnVuY3Rpb24oXzogRGF0ZSkge1xyXG4gICAgICAgIHZhciBqYW4gPSBuZXcgRGF0ZShfLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xyXG4gICAgICAgIHZhciBqdWwgPSBuZXcgRGF0ZShfLmdldEZ1bGxZZWFyKCksIDYsIDEpO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZHN0ID0gZnVuY3Rpb24oXzogRGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBfLmdldFRpbWV6b25lT2Zmc2V0KCkgPCBzdGRUaW1lem9uZU9mZnNldChfKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluZGV4T2ZPYmplY3QgPSBmdW5jdGlvbihfOiBhbnlbXSwgb2JqKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChfW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvL3RoaXMgYmxvd3MgdGhlIGhlbGwgdXAsIG5vdCBzdXJlIHdoeS5cclxuICAgIC8vXHRPYmplY3QucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy9cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsIDQpO1xyXG4gICAgLy9cdH07XHJcblxyXG4gICAgZXhwb3J0IGxldCBhc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFyTmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXZhbCh2YXJOYW1lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVmFyaWFibGUgbm90IGZvdW5kOiBcIiArIHZhck5hbWUpKS5vcGVuKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFdlIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgYW4gYWpheCBjYWxsLCBidXQgdGhlIHNlcnZlciBhbHNvIGVuZm9yY2VzIHRoYXQgZWFjaFxyXG4gICAgICogc2Vzc2lvbiBpcyBvbmx5IGFsbG93ZWQgb25lIGNvbmN1cnJlbnQgY2FsbCBhbmQgc2ltdWx0YW5lb3VzIGNhbGxzIHdvdWxkIGp1c3QgXCJxdWV1ZSB1cFwiLlxyXG4gICAgICovXHJcbiAgICBsZXQgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgZGF5bGlnaHRTYXZpbmdzVGltZTogYm9vbGVhbiA9ICh1dGlsLmRzdChuZXcgRGF0ZSgpKSkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgZXhwb3J0IGxldCB0b0pzb24gPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBjYW1lIGZyb20gaGVyZTpcclxuICAgICAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0UGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZT86IGFueSwgdXJsPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgIGlmICghcmVzdWx0cylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcbiAgICAgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG4gICAgICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaW5oZXJpdCA9IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpOiBhbnkge1xyXG4gICAgICAgIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLnByb3RvdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluaXRQcm9ncmVzc01vbml0b3IgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBzZXRJbnRlcnZhbChwcm9ncmVzc0ludGVydmFsLCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHByb2dyZXNzSW50ZXJ2YWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICB2YXIgaXNXYWl0aW5nID0gaXNBamF4V2FpdGluZygpO1xyXG4gICAgICAgIGlmIChpc1dhaXRpbmcpIHtcclxuICAgICAgICAgICAgd2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgaWYgKHdhaXRDb3VudGVyID49IDMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdhaXRDb3VudGVyID0gMDtcclxuICAgICAgICAgICAgaWYgKHBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgIHBncnNEbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICBwZ3JzRGxnID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGpzb24gPSBmdW5jdGlvbiA8UmVxdWVzdFR5cGUsIFJlc3BvbnNlVHlwZT4ocG9zdE5hbWU6IGFueSwgcG9zdERhdGE6IFJlcXVlc3RUeXBlLCAvL1xyXG4gICAgICAgIGNhbGxiYWNrPzogKHJlc3BvbnNlOiBSZXNwb25zZVR5cGUsIHBheWxvYWQ/OiBhbnkpID0+IGFueSwgY2FsbGJhY2tUaGlzPzogYW55LCBjYWxsYmFja1BheWxvYWQ/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrVGhpcyA9PT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUgKyBcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpcm9uQWpheDtcclxuICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChvZmZsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU09OLVBPU1RbZ2VuXTogW1wiICsgcG9zdE5hbWUgKyBcIl1cIiArIEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgIC8vIHZhciBpcm9uQWpheCA9IHRoaXMuJCQoXCIjbXlJcm9uQWpheFwiKTtcclxuICAgICAgICAgICAgLy9pcm9uQWpheCA9IFBvbHltZXIuZG9tKCg8X0hhc1Jvb3Q+KXdpbmRvdy5kb2N1bWVudC5yb290KS5xdWVyeVNlbGVjdG9yKFwiI2lyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgaXJvbkFqYXggPSBwb2x5RWxtTm9kZShcImlyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgaXJvbkFqYXgudXJsID0gcG9zdFRhcmdldFVybCArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICBpcm9uQWpheC52ZXJib3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgaXJvbkFqYXgubWV0aG9kID0gXCJQT1NUXCI7XHJcbiAgICAgICAgICAgIGlyb25BamF4LmNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAvLyBpcm9uQWpheC5wYXJhbXM9J3tcImFsdFwiOlwianNvblwiLCBcInFcIjpcImNocm9tZVwifSc7XHJcblxyXG4gICAgICAgICAgICBpcm9uQWpheC5oYW5kbGVBcyA9IFwianNvblwiOyAvLyBoYW5kbGUtYXMgKGlzIHByb3ApXHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgIC8vIGlyb25BamF4Lm9uUmVzcG9uc2UgPSBcInV0aWwuaXJvbkFqYXhSZXNwb25zZVwiOyAvLyBvbi1yZXNwb25zZVxyXG4gICAgICAgICAgICAvLyAoaXNcclxuICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgaXJvbkFqYXguZGVib3VuY2VEdXJhdGlvbiA9IFwiMzAwXCI7IC8vIGRlYm91bmNlLWR1cmF0aW9uIChpc1xyXG4gICAgICAgICAgICAvLyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgIGlyb25SZXF1ZXN0ID0gaXJvbkFqYXguZ2VuZXJhdGVSZXF1ZXN0KCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwiRmFpbGVkIHN0YXJ0aW5nIHJlcXVlc3Q6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE5vdGVzXHJcbiAgICAgICAgICogPHA+XHJcbiAgICAgICAgICogSWYgdXNpbmcgdGhlbiBmdW5jdGlvbjogcHJvbWlzZS50aGVuKHN1Y2Nlc3NGdW5jdGlvbiwgZmFpbEZ1bmN0aW9uKTtcclxuICAgICAgICAgKiA8cD5cclxuICAgICAgICAgKiBJIHRoaW5rIHRoZSB3YXkgdGhlc2UgcGFyYW1ldGVycyBnZXQgcGFzc2VkIGludG8gZG9uZS9mYWlsIGZ1bmN0aW9ucywgaXMgYmVjYXVzZSB0aGVyZSBhcmUgcmVzb2x2ZS9yZWplY3RcclxuICAgICAgICAgKiBtZXRob2RzIGdldHRpbmcgY2FsbGVkIHdpdGggdGhlIHBhcmFtZXRlcnMuIEJhc2ljYWxseSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gJ3Jlc29sdmUnIGdldCBkaXN0cmlidXRlZFxyXG4gICAgICAgICAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcbiAgICAgICAgICogcGF0dGVybiBpcyBzb3J0IG9mIGEgcHViL3N1YiBtb2RlbCBpbiBhIHdheVxyXG4gICAgICAgICAqIDxwPlxyXG4gICAgICAgICAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcbiAgICAgICAgICogb25seSByZWFjdCB0byBhIGRvbmUvZmFpbC9jb21wbGV0ZS5cclxuICAgICAgICAgKiA8cD5cclxuICAgICAgICAgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuICAgICAgICAgKiBhcmUgcmVzb2x2ZWQuIEl0J3MgYSBiaWcgXCJhbmQgY29uZGl0aW9uXCIgb2YgcmVzb2x2ZW1lbnQsIGFuZCBpZiBhbnkgb2YgdGhlIHByb21pc2VzIHBhc3NlZCB0byBpdCBlbmQgdXBcclxuICAgICAgICAgKiBmYWlsaW5nLCBpdCBmYWlscyB0aGlzIFwiQU5EZWRcIiBvbmUgYWxzby5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpcm9uUmVxdWVzdC5jb21wbGV0ZXMudGhlbigvL1xyXG5cclxuICAgICAgICAgICAgLy8gSGFuZGxlIFN1Y2Nlc3NcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgSlNPTi1SRVNVTFQ6IFwiICsgcG9zdE5hbWUgKyBcIlxcbiAgICBKU09OLVJFU1VMVC1EQVRBOiBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyBpcyB1Z2x5IGJlY2F1c2UgaXQgY292ZXJzIGFsbCBmb3VyIGNhc2VzIGJhc2VkIG9uIHR3byBib29sZWFucywgYnV0IGl0J3Mgc3RpbGwgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpbXBsZXN0IHdheSB0byBkbyB0aGlzLiBXZSBoYXZlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBtYXkgb3IgbWF5IG5vdCBzcGVjaWZ5IGEgJ3RoaXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrUGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhbid0IHdlIGp1c3QgbGV0IGNhbGxiYWNrUGF5bG9hZCBiZSB1bmRlZmluZWQsIGFuZCBjYWxsIHRoZSBhYm92ZSBjYWxsYmFjayBtZXRob2RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBub3QgZXZlbiBoYXZlIHRoaXMgZWxzZSBibG9jayBoZXJlIGF0IGFsbCAoaS5lLiBub3QgZXZlbiBjaGVjayBpZiBjYWxsYmFja1BheWxvYWQgaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbC91bmRlZmluZWQsIGJ1dCBqdXN0IHVzZSBpdCwgYW5kIG5vdCBoYXZlIHRoaXMgaWYgYmxvY2s/KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dBbmRSZVRocm93KFwiRmFpbGVkIGhhbmRsaW5nIHJlc3VsdCBvZjogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gSGFuZGxlIEZhaWxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIHV0aWwuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlyb25SZXF1ZXN0LnN0YXR1cyA9PSBcIjQwM1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiBkZXRlY3RlZCBpbiB1dGlsLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXRNZXNzYWdlU2hvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXRNZXNzYWdlU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2Vzc2lvbiB0aW1lZCBvdXQuIFBhZ2Ugd2lsbCByZWZyZXNoLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBjYXRjaCBibG9jayBzaG91bGQgZmFpbCBzaWxlbnRseSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiQ29kZTogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXMgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHRoaXMgY2F0Y2ggYmxvY2sgc2hvdWxkIGFsc28gZmFpbCBzaWxlbnRseVxyXG4gICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICogVGhpcyB3YXMgc2hvd2luZyBcImNsYXNzQ2FzdEV4Y2VwdGlvblwiIHdoZW4gSSB0aHJldyBhIHJlZ3VsYXIgXCJFeGNlcHRpb25cIiBmcm9tIHNlcnZlciBzbyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICAgICAgICogSSdtIGp1c3QgdHVybmluZyB0aGlzIG9mZiBzaW5jZSBpdHMnIG5vdCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtc2cgKz0gXCJSZXNwb25zZTogXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gaXJvblJlcXVlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBsb2dBbmRUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBzdGFjayA9IFwiW3N0YWNrLCBub3Qgc3VwcG9ydGVkXVwiO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlICsgXCJTVEFDSzogXCIgKyBzdGFjayk7XHJcbiAgICAgICAgdGhyb3cgbWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGxvZ0FuZFJlVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcsIGV4Y2VwdGlvbjogYW55KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgKyBcIlNUQUNLOiBcIiArIHN0YWNrKTtcclxuICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBhamF4UmVhZHkgPSBmdW5jdGlvbihyZXF1ZXN0TmFtZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChfYWpheENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaXNBamF4V2FpdGluZyA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBfYWpheENvdW50ZXIgPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHNldCBmb2N1cyB0byBlbGVtZW50IGJ5IGlkIChpZCBtdXN0IGJlIGFjdHVhbCBqcXVlcnkgc2VsZWN0b3IpICovXHJcbiAgICBleHBvcnQgbGV0IGRlbGF5ZWRGb2N1cyA9IGZ1bmN0aW9uKGlkKTogdm9pZCB7XHJcbiAgICAgICAgLyogc28gdXNlciBzZWVzIHRoZSBmb2N1cyBmYXN0IHdlIHRyeSBhdCAuNSBzZWNvbmRzICovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAvKiB3ZSB0cnkgYWdhaW4gYSBmdWxsIHNlY29uZCBsYXRlci4gTm9ybWFsbHkgbm90IHJlcXVpcmVkLCBidXQgbmV2ZXIgdW5kZXNpcmFibGUgKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiRm9jdXNpbmcgSUQ6IFwiK2lkKTtcclxuICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICB9LCAxMzAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogV2UgY291bGQgaGF2ZSBwdXQgdGhpcyBsb2dpYyBpbnNpZGUgdGhlIGpzb24gbWV0aG9kIGl0c2VsZiwgYnV0IEkgY2FuIGZvcnNlZSBjYXNlcyB3aGVyZSB3ZSBkb24ndCB3YW50IGFcclxuICAgICAqIG1lc3NhZ2UgdG8gYXBwZWFyIHdoZW4gdGhlIGpzb24gcmVzcG9uc2UgcmV0dXJucyBzdWNjZXNzPT1mYWxzZSwgc28gd2Ugd2lsbCBoYXZlIHRvIGNhbGwgY2hlY2tTdWNjZXNzIGluc2lkZVxyXG4gICAgICogZXZlcnkgcmVzcG9uc2UgbWV0aG9kIGluc3RlYWQsIGlmIHdlIHdhbnQgdGhhdCByZXNwb25zZSB0byBwcmludCBhIG1lc3NhZ2UgdG8gdGhlIHVzZXIgd2hlbiBmYWlsIGhhcHBlbnMuXHJcbiAgICAgKlxyXG4gICAgICogcmVxdWlyZXM6IHJlcy5zdWNjZXNzIHJlcy5tZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgY2hlY2tTdWNjZXNzID0gZnVuY3Rpb24ob3BGcmllbmRseU5hbWUsIHJlcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghcmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG9wRnJpZW5kbHlOYW1lICsgXCIgZmFpbGVkOiBcIiArIHJlcy5tZXNzYWdlKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzLnN1Y2Nlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyogYWRkcyBhbGwgYXJyYXkgb2JqZWN0cyB0byBvYmogYXMgYSBzZXQgKi9cclxuICAgIGV4cG9ydCBsZXQgYWRkQWxsID0gZnVuY3Rpb24ob2JqLCBhKTogdm9pZCB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghYVtpXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm51bGwgZWxlbWVudCBpbiBhZGRBbGwgYXQgaWR4PVwiICsgaSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmpbYVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbnVsbE9yVW5kZWYgPSBmdW5jdGlvbihvYmopOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gb2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG4gICAgICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBnZXRVaWRGb3JJZCA9IGZ1bmN0aW9uKG1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgaWQpOiBzdHJpbmcge1xyXG4gICAgICAgIC8qIGxvb2sgZm9yIHVpZCBpbiBtYXAgKi9cclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAvKiBpZiBub3QgZm91bmQsIGdldCBuZXh0IG51bWJlciwgYW5kIGFkZCB0byBtYXAgKi9cclxuICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICB1aWQgPSBcIlwiICsgbWV0YTY0Lm5leHRVaWQrKztcclxuICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVpZDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGVsZW1lbnRFeGlzdHMgPSBmdW5jdGlvbihpZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHJldHVybiBlICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyogVGFrZXMgdGV4dGFyZWEgZG9tIElkICgjIG9wdGlvbmFsKSBhbmQgcmV0dXJucyBpdHMgdmFsdWUgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0VGV4dEFyZWFWYWxCeUlkID0gZnVuY3Rpb24oaWQpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBkZTogSFRNTEVsZW1lbnQgPSBkb21FbG0oaWQpO1xyXG4gICAgICAgIHJldHVybiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZGUpLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGRvbUVsbSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICBpZiAodXRpbC5zdGFydHNXaXRoKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXRpbC5jb250YWlucyhpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBwb2x5ID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHBvbHlFbG0gPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBQb2x5bWVyLmRvbShlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHBvbHlFbG1Ob2RlID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGUgPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICByZXR1cm4gZS5ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBHZXRzIHRoZSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0UmVxdWlyZWRFbGVtZW50ID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICBpZiAoZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0UmVxdWlyZWRFbGVtZW50LiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaXNPYmplY3QgPSBmdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY3VycmVudFRpbWVNaWxsaXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZW1wdHlTdHJpbmcgPSBmdW5jdGlvbih2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhdmFsIHx8IHZhbC5sZW5ndGggPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGUudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyogcmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgd2FzIGZvdW5kLCBvciBmYWxzZSBpZiBlbGVtZW50IG5vdCBmb3VuZCAqL1xyXG4gICAgZXhwb3J0IGxldCBzZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlbG0gPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgIGVsbS5ub2RlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxtICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBiaW5kRW50ZXJLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnkpIHtcclxuICAgICAgICBiaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBiaW5kS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55LCBrZXlDb2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAkKGlkKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuICAgICAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcbiAgICAgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBjaGFuZ2VPckFkZENsYXNzID0gZnVuY3Rpb24oZWxtOiBzdHJpbmcsIG9sZENsYXNzOiBzdHJpbmcsIG5ld0NsYXNzOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWxtZW1lbnQgPSAkKGVsbSk7XHJcbiAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3Mob2xkQ2xhc3MsIGZhbHNlKTtcclxuICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhuZXdDbGFzcywgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGRpc3BsYXlzIG1lc3NhZ2UgKG1zZykgb2Ygb2JqZWN0IGlzIG5vdCBvZiBzcGVjaWZpZWQgdHlwZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHZlcmlmeVR5cGUgPSBmdW5jdGlvbihvYmo6IGFueSwgdHlwZTogYW55LCBtc2c6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZXRIdG1sID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSBkb21FbG0oaWQpO1xyXG4gICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuXHJcbiAgICAgICAgLy9Gb3IgUG9seW1lciAxLjAuMCwgeW91IG5lZWQgdGhpcy4uLlxyXG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgIHBvbHlFbG0uaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydHlDb3VudCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgIHZhciBwcm9wO1xyXG5cclxuICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyBhbmQgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcHJpbnRPYmplY3QgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIlxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5W1wiICsgY291bnQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgdmFsICs9IGsgKyBcIiAsIFwiICsgdiArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJlcnJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyAqL1xyXG4gICAgZXhwb3J0IGxldCBwcmludEtleXMgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgIGlmICghaykge1xyXG4gICAgICAgICAgICAgICAgayA9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhbCArPSAnLCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsICs9IGs7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTWFrZXMgZWxlSWQgZW5hYmxlZCBiYXNlZCBvbiB2aXMgZmxhZ1xyXG4gICAgICpcclxuICAgICAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgc2V0RW5hYmxlbWVudCA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFlbmFibGUpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcbiAgICAgKlxyXG4gICAgICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzZXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgdmlzOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmlzKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICQoZWxtKS5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoaWRpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICQoZWxtKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIFByb2dyYW1hdGljYWxseSBjcmVhdGVzIG9iamVjdHMgYnkgbmFtZSwgc2ltaWxhciB0byB3aGF0IEphdmEgcmVmbGVjdGlvbiBkb2VzXHJcblxyXG4gICAgKiBleDogdmFyIGV4YW1wbGUgPSBJbnN0YW5jZUxvYWRlci5nZXRJbnN0YW5jZTxOYW1lZFRoaW5nPih3aW5kb3csICdFeGFtcGxlQ2xhc3MnLCBhcmdzLi4uKTtcclxuICAgICovXHJcbiAgICBleHBvcnQgbGV0IGdldEluc3RhbmNlID0gZnVuY3Rpb24gPFQ+KGNvbnRleHQ6IE9iamVjdCwgbmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoY29udGV4dFtuYW1lXS5wcm90b3R5cGUpO1xyXG4gICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICByZXR1cm4gPFQ+aW5zdGFuY2U7XHJcbiAgICB9XHJcbn1cclxuXG5uYW1lc3BhY2UgamNyQ25zdCB7XHJcblxyXG4gICAgZXhwb3J0IGxldCBDT01NRU5UX0JZOiBzdHJpbmcgPSBcImNvbW1lbnRCeVwiO1xyXG4gICAgZXhwb3J0IGxldCBQVUJMSUNfQVBQRU5EOiBzdHJpbmcgPSBcInB1YmxpY0FwcGVuZFwiO1xyXG4gICAgZXhwb3J0IGxldCBQUklNQVJZX1RZUEU6IHN0cmluZyA9IFwiamNyOnByaW1hcnlUeXBlXCI7XHJcbiAgICBleHBvcnQgbGV0IFBPTElDWTogc3RyaW5nID0gXCJyZXA6cG9saWN5XCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBNSVhJTl9UWVBFUzogc3RyaW5nID0gXCJqY3I6bWl4aW5UeXBlc1wiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgRU1BSUxfQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgZXhwb3J0IGxldCBFTUFJTF9SRUNJUDogc3RyaW5nID0gXCJyZWNpcFwiO1xyXG4gICAgZXhwb3J0IGxldCBFTUFJTF9TVUJKRUNUOiBzdHJpbmcgPSBcInN1YmplY3RcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IENSRUFURUQ6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRcIjtcclxuICAgIGV4cG9ydCBsZXQgQ1JFQVRFRF9CWTogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZEJ5XCI7XHJcbiAgICBleHBvcnQgbGV0IENPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgIGV4cG9ydCBsZXQgVEFHUzogc3RyaW5nID0gXCJ0YWdzXCI7XHJcbiAgICBleHBvcnQgbGV0IFVVSUQ6IHN0cmluZyA9IFwiamNyOnV1aWRcIjtcclxuICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRDogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkXCI7XHJcbiAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRURfQlk6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZEJ5XCI7XHJcbiAgICBleHBvcnQgbGV0IEpTT05fRklMRV9TRUFSQ0hfUkVTVUxUOiBzdHJpbmcgPSBcIm1ldGE2NDpqc29uXCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBVU0VSOiBzdHJpbmcgPSBcInVzZXJcIjtcclxuICAgIGV4cG9ydCBsZXQgUFdEOiBzdHJpbmcgPSBcInB3ZFwiO1xyXG4gICAgZXhwb3J0IGxldCBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgZXhwb3J0IGxldCBDT0RFOiBzdHJpbmcgPSBcImNvZGVcIjtcclxuXHJcbiAgICBleHBvcnQgbGV0IEJJTl9WRVI6IHN0cmluZyA9IFwiYmluVmVyXCI7XHJcbiAgICBleHBvcnQgbGV0IEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgIGV4cG9ydCBsZXQgQklOX01JTUU6IHN0cmluZyA9IFwiamNyOm1pbWVUeXBlXCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBJTUdfV0lEVEg6IHN0cmluZyA9IFwiaW1nV2lkdGhcIjtcclxuICAgIGV4cG9ydCBsZXQgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxufVxyXG5cbm5hbWVzcGFjZSBhdHRhY2htZW50IHtcclxuICAgIC8qIE5vZGUgYmVpbmcgdXBsb2FkZWQgdG8gKi9cclxuICAgIGV4cG9ydCBsZXQgdXBsb2FkTm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5VcGxvYWRGcm9tRmlsZURsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnKCkpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgLyogTm90ZTogVG8gcnVuIGxlZ2FjeSB1cGxvYWRlciBqdXN0IHB1dCB0aGlzIHZlcnNpb24gb2YgdGhlIGRpYWxvZyBoZXJlLCBhbmRcclxuICAgICAgICBub3RoaW5nIGVsc2UgaXMgcmVxdWlyZWQuIFNlcnZlciBzaWRlIHByb2Nlc3NpbmcgaXMgc3RpbGwgaW4gcGxhY2UgZm9yIGl0XHJcblxyXG4gICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgICovXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgIChuZXcgVXBsb2FkRnJvbVVybERsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJEZWxldGUgdGhlIEF0dGFjaG1lbnQgb24gdGhlIE5vZGU/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVBdHRhY2htZW50UmVxdWVzdCwganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2U+KFwiZGVsZXRlQXR0YWNobWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIG51bGwsIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgdWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgYXR0YWNobWVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZW1vdmVCaW5hcnlCeVVpZCh1aWQpO1xyXG4gICAgICAgICAgICAvLyBmb3JjZSByZS1yZW5kZXIgZnJvbSBsb2NhbCBkYXRhLlxyXG4gICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cbm5hbWVzcGFjZSBlZGl0IHtcclxuXHJcbiAgICBleHBvcnQgbGV0IGNyZWF0ZU5vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENyZWF0ZU5vZGVEbGcoKSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbnNlcnRCb29rUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRCb29rUmVzcG9uc2UgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IEJvb2tcIiwgcmVzKTtcclxuICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkZWxldGVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2UsIHBheWxvYWQ6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZSA9IHBheWxvYWRbXCJwb3N0RGVsZXRlU2VsTm9kZVwiXTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBzZWxOb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBoaWdobGlnaHRJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbml0Tm9kZUVkaXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSB1dGlsLnN0YXJ0c1dpdGgobm9kZS5uYW1lLCBcInJlcDpcIikgfHwgLyogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnPyAqL1xuICAgICAgICAgICAgICAgIHV0aWwuY29udGFpbnMobm9kZS5wYXRoLCBcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSBhbmQgd2UgYXJlIHRoZSBjb21tZW50ZXIgKi9cclxuICAgICAgICAgICAgbGV0IGVkaXRpbmdBbGxvd2VkOiBib29sZWFuID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU2VydmVyIHdpbGwgaGF2ZSBzZW50IHVzIGJhY2sgdGhlIHJhdyB0ZXh0IGNvbnRlbnQsIHRoYXQgc2hvdWxkIGJlIG1hcmtkb3duIGluc3RlYWQgb2YgYW55IEhUTUwsIHNvXHJcbiAgICAgICAgICAgICAgICAgKiB0aGF0IHdlIGNhbiBkaXNwbGF5IHRoaXMgYW5kIHNhdmUuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGNhbm5vdCBlZGl0IG5vZGVzIHRoYXQgeW91IGRvbid0IG93bi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgbW92ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTW92ZU5vZGVzUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJNb3ZlIG5vZGVzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBudWxsOyAvLyByZXNldFxyXG4gICAgICAgICAgICBub2Rlc1RvTW92ZVNldCA9IHt9O1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNldE5vZGVQb3NpdGlvblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNob3dSZWFkT25seVByb3BlcnRpZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLypcclxuICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiB0b2RvLTE6IG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlcmUncyBhIGJldHRlciB3YXkgdG8gZG8gYW4gb3JkZXJlZCBzZXQgaW4gamF2YXNjcmlwdCBzbyBJIGRvbid0IG5lZWRcclxuICAgIGJvdGggbm9kZXNUb01vdmUgYW5kIG5vZGVzVG9Nb3ZlU2V0XHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZVNldDogT2JqZWN0ID0ge307XHJcblxyXG4gICAgZXhwb3J0IGxldCBwYXJlbnRPZk5ld05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBpbmRpY2F0ZXMgZWRpdG9yIGlzIGRpc3BsYXlpbmcgYSBub2RlIHRoYXQgaXMgbm90IHlldCBzYXZlZCBvbiB0aGUgc2VydmVyXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZWRpdGluZ1Vuc2F2ZWROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIG5vZGUgKE5vZGVJbmZvLmphdmEpIHRoYXQgaXMgYmVpbmcgY3JlYXRlZCB1bmRlciB3aGVuIG5ldyBub2RlIGlzIGNyZWF0ZWRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTm9kZSBiZWluZyBlZGl0ZWRcclxuICAgICAqXHJcbiAgICAgKiB0b2RvLTI6IHRoaXMgYW5kIHNldmVyYWwgb3RoZXIgdmFyaWFibGVzIGNhbiBub3cgYmUgbW92ZWQgaW50byB0aGUgZGlhbG9nIGNsYXNzPyBJcyB0aGF0IGdvb2Qgb3IgYmFkXHJcbiAgICAgKiBjb3VwbGluZy9yZXNwb25zaWJpbGl0eT9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBlZGl0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVEbGdJbnN0OiBFZGl0Tm9kZURsZyA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIHR5cGU9Tm9kZUluZm8uamF2YVxyXG4gICAgICpcclxuICAgICAqIFdoZW4gaW5zZXJ0aW5nIGEgbmV3IG5vZGUsIHRoaXMgaG9sZHMgdGhlIG5vZGUgdGhhdCB3YXMgY2xpY2tlZCBvbiBhdCB0aGUgdGltZSB0aGUgaW5zZXJ0IHdhcyByZXF1ZXN0ZWQsIGFuZFxyXG4gICAgICogaXMgc2VudCB0byBzZXJ2ZXIgZm9yIG9yZGluYWwgcG9zaXRpb24gYXNzaWdubWVudCBvZiBuZXcgbm9kZS4gQWxzbyBpZiB0aGlzIHZhciBpcyBudWxsLCBpdCBpbmRpY2F0ZXMgd2UgYXJlXHJcbiAgICAgKiBjcmVhdGluZyBpbiBhICdjcmVhdGUgdW5kZXIgcGFyZW50JyBtb2RlLCB2ZXJzdXMgbm9uLW51bGwgbWVhbmluZyAnaW5zZXJ0IGlubGluZScgdHlwZSBvZiBpbnNlcnQuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IG5vZGVJbnNlcnRUYXJnZXQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyogcmV0dXJucyB0cnVlIGlmIHdlIGNhbiAndHJ5IHRvJyBpbnNlcnQgdW5kZXIgJ25vZGUnIG9yIGZhbHNlIGlmIG5vdCAqL1xyXG4gICAgZXhwb3J0IGxldCBpc0VkaXRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAoIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB8fCBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSkpIC8vXHJcbiAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGFsbG93IHRoZSBkaXNhYmxlSW5zZXJ0IHByb3AgdG8gYmUgYWJsZSB0byB0dXJuIHRoaW5ncyBvZmYsIG5vZGUgYnkgbm9kZSAqL1xyXG4gICAgZXhwb3J0IGxldCBpc0luc2VydEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuRElTQUJMRV9JTlNFUlQsIG5vZGUpID09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlID0gZnVuY3Rpb24odHlwZU5hbWU/OiBzdHJpbmcsIGNyZWF0ZUF0VG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcodHlwZU5hbWUsIGNyZWF0ZUF0VG9wKTtcclxuICAgICAgICBlZGl0Tm9kZURsZ0luc3Quc2F2ZU5ld05vZGUoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGNhbGxlZCB0byBkaXNwbGF5IGVkaXRvciB0aGF0IHdpbGwgY29tZSB1cCBCRUZPUkUgYW55IG5vZGUgaXMgc2F2ZWQgb250byB0aGUgc2VydmVyLCBzbyB0aGF0IHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKiBhbnkgc2F2ZSBpcyBwZXJmb3JtZWQgd2Ugd2lsbCBoYXZlIHRoZSBjb3JyZWN0IG5vZGUgbmFtZSwgYXQgbGVhc3QuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyB2ZXJzaW9uIGlzIG5vIGxvbmdlciBiZWluZyB1c2VkLCBhbmQgY3VycmVudGx5IHRoaXMgbWVhbnMgJ2VkaXRpbmdVbnNhdmVkTm9kZScgaXMgbm90IGN1cnJlbnRseSBldmVyXHJcbiAgICAgKiB0cmlnZ2VyZWQuIFRoZSBuZXcgYXBwcm9hY2ggbm93IHRoYXQgd2UgaGF2ZSB0aGUgYWJpbGl0eSB0byAncmVuYW1lJyBub2RlcyBpcyB0byBqdXN0IGNyZWF0ZSBvbmUgd2l0aCBhXHJcbiAgICAgKiByYW5kb20gbmFtZSBhbiBsZXQgdXNlciBzdGFydCBlZGl0aW5nIHJpZ2h0IGF3YXkgYW5kIHRoZW4gcmVuYW1lIHRoZSBub2RlIElGIGEgY3VzdG9tIG5vZGUgbmFtZSBpcyBuZWVkZWQuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBtZWFucyBpZiB3ZSBjYWxsIHRoaXMgZnVuY3Rpb24gKHN0YXJ0RWRpdGluZ05ld05vZGVXaXRoTmFtZSkgaW5zdGVhZCBvZiAnc3RhcnRFZGl0aW5nTmV3Tm9kZSgpJ1xyXG4gICAgICogdGhhdCB3aWxsIGNhdXNlIHRoZSBHVUkgdG8gYWx3YXlzIHByb21wdCBmb3IgdGhlIG5vZGUgbmFtZSBiZWZvcmUgY3JlYXRpbmcgdGhlIG5vZGUuIFRoaXMgd2FzIHRoZSBvcmlnaW5hbFxyXG4gICAgICogZnVuY3Rpb25hbGl0eSBhbmQgc3RpbGwgd29ya3MuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gdHJ1ZTtcclxuICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc2VydE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ3JlYXRlIHN1Ym5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNhdmVOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2F2ZU5vZGVSZXNwb25zZSwgcGF5bG9hZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgLyogYmVjYXN1c2UgSSBkb24ndCB1bmRlcnN0YW5kICdlZGl0aW5nVW5zYXZlZE5vZGUnIHZhcmlhYmxlIGFueSBsb25nZXIgdW50aWwgaSByZWZyZXNoIG15IG1lbW9yeSwgaSB3aWxsIHVzZVxyXG4gICAgICAgICAgICB0aGUgb2xkIGFwcHJvYWNoIG9mIHJlZnJlc2hpbmcgZW50aXJlIHRyZWUgcmF0aGVyIHRoYW4gbW9yZSBlZmZpY2llbnQgcmVmcmVzbk5vZGVPblBhZ2UsIGJlY3Vhc2UgaXQgcmVxdWlyZXNcclxuICAgICAgICAgICAgdGhlIG5vZGUgdG8gYWxyZWFkeSBiZSBvbiB0aGUgcGFnZSwgYW5kIHRoaXMgcmVxdWlyZXMgaW4gZGVwdGggYW5hbHlzIGknbSBub3QgZ29pbmcgdG8gZG8gcmlnaHQgdGhpcyBtaW51dGUuXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlKTtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcGF5bG9hZC5zYXZlZElkKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGVkaXRNb2RlID0gZnVuY3Rpb24obW9kZVZhbD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1vZGVWYWwgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1vZGVWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgLy8gdGhhdCBjYW4gc2hvdyBhbiBvbi9vZmYgc3RhdGUuXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNpbmNlIGVkaXQgbW9kZSB0dXJucyBvbiBsb3RzIG9mIGJ1dHRvbnMsIHRoZSBsb2NhdGlvbiBvZiB0aGUgbm9kZSB3ZSBhcmUgdmlld2luZyBjYW4gY2hhbmdlIHNvIG11Y2ggaXRcclxuICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgbWV0YTY0LnNhdmVVc2VyUHJlZmVyZW5jZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1vdmVOb2RlVXAgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBcIltub2RlQWJvdmVdXCJcclxuICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVEb3duID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiW25vZGVCZWxvd11cIixcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGUubmFtZVxyXG4gICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvVG9wID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogXCJbdG9wTm9kZV1cIlxyXG4gICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvQm90dG9tID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGFib3ZlIHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSB0b3Agbm9kZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGdldE5vZGVBYm92ZSA9IGZ1bmN0aW9uKG5vZGUpOiBhbnkge1xyXG4gICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICBpZiAob3JkaW5hbCA8PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdGhlIG5vZGUgYmVsb3cgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIGJvdHRvbSBub2RlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJlbG93ID0gZnVuY3Rpb24obm9kZTogYW55KToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib3JkaW5hbCA9IFwiICsgb3JkaW5hbCk7XHJcbiAgICAgICAgaWYgKG9yZGluYWwgPT0gLTEgfHwgb3JkaW5hbCA+PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsICsgMV07XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRGaXJzdENoaWxkTm9kZSA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlblswXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHJ1bkVkaXROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBlZGl0Tm9kZUNsaWNrOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uSW5pdE5vZGVFZGl0UmVxdWVzdCwganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZT4oXCJpbml0Tm9kZUVkaXRcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgfSwgaW5pdE5vZGVFZGl0UmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZSA9IGZ1bmN0aW9uKHVpZD86IGFueSwgdHlwZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBwYXJlbnRcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2UgZ2V0IHRoZSBub2RlIHNlbGVjdGVkIGZvciB0aGUgaW5zZXJ0IHBvc2l0aW9uIGJ5IHVzaW5nIHRoZSB1aWQgaWYgb25lIHdhcyBwYXNzZWQgaW4gb3IgdXNpbmcgdGhlXHJcbiAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBub2RlO1xyXG4gICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKHR5cGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlID0gZnVuY3Rpb24odWlkPzogYW55LCB0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm8gdWlkIHByb3ZpZGVkIHdlIGRlYWZ1bHQgdG8gY3JlYXRpbmcgYSBub2RlIHVuZGVyIHRoZSBjdXJyZW50bHkgdmlld2VkIG5vZGUgKHBhcmVudCBvZiBjdXJyZW50IHBhZ2UpLCBvciBhbnkgc2VsZWN0ZWRcclxuICAgICAgICAgKiBub2RlIGlmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgbm9kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IGhpZ2hsaWdodE5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIGNyZWF0ZVN1Yk5vZGU6IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVwbHlUb0NvbW1lbnQgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNyZWF0ZVN1Yk5vZGUodWlkKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0aW9ucyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSBjb3VsZCB3cml0ZSBjb2RlIHRoYXQgb25seSBzY2FucyBmb3IgYWxsIHRoZSBcIlNFTFwiIGJ1dHRvbnMgYW5kIHVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZW0sIGJ1dCBmb3Igbm93XHJcbiAgICAgICAgICogd2UgdGFrZSB0aGUgc2ltcGxlIGFwcHJvYWNoIGFuZCBqdXN0IHJlLXJlbmRlciB0aGUgcGFnZS4gVGhlcmUgaXMgbm8gY2FsbCB0byB0aGUgc2VydmVyLCBzbyB0aGlzIGlzXHJcbiAgICAgICAgICogYWN0dWFsbHkgdmVyeSBlZmZpY2llbnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogRGVsZXRlIHRoZSBzaW5nbGUgbm9kZSBpZGVudGlmaWVkIGJ5ICd1aWQnIHBhcmFtZXRlciBpZiB1aWQgcGFyYW1ldGVyIGlzIHBhc3NlZCwgYW5kIGlmIHVpZCBwYXJhbWV0ZXIgaXMgbm90XHJcbiAgICAgKiBwYXNzZWQgdGhlbiB1c2UgdGhlIG5vZGUgc2VsZWN0aW9ucyBmb3IgbXVsdGlwbGUgc2VsZWN0aW9ucyBvbiB0aGUgcGFnZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBkZWxldGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIGRlbGV0ZSBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0RGVsZXRlU2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZU5vZGVzUmVxdWVzdCwganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlPihcImRlbGV0ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogc2VsTm9kZXNBcnJheVxyXG4gICAgICAgICAgICAgICAgfSwgZGVsZXRlTm9kZXNSZXNwb25zZSwgbnVsbCwgeyBcInBvc3REZWxldGVTZWxOb2RlXCI6IHBvc3REZWxldGVTZWxOb2RlIH0pO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIEdldHMgdGhlIG5vZGUgd2Ugd2FudCB0byBzY3JvbGwgdG8gYWZ0ZXIgYSBkZWxldGUgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgLyogVXNlIGEgaGFzaG1hcC10eXBlIGFwcHJvYWNoIHRvIHNhdmluZyBhbGwgc2VsZWN0ZWQgbm9kZXMgaW50byBhIGxvb3VwIG1hcCAqL1xyXG4gICAgICAgIGxldCBub2Rlc01hcDogT2JqZWN0ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQoKTtcclxuICAgICAgICBsZXQgYmVzdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGxldCB0YWtlTmV4dE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogbm93IHdlIHNjYW4gdGhlIGNoaWxkcmVuLCBhbmQgdGhlIGxhc3QgY2hpbGQgd2UgZW5jb3VudGVyZCB1cCB1bnRpbCB3ZSBmaW5kIHRoZSByaXN0IG9uZW4gaW4gbm9kZXNNYXAgd2lsbCBiZSB0aGVcclxuICAgICAgICBub2RlIHdlIHdpbGwgd2FudCB0byBzZWxlY3QgYW5kIHNjcm9sbCB0aGUgdXNlciB0byBBRlRFUiB0aGUgZGVsZXRpbmcgaXMgZG9uZSAqL1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICBpZiAodGFrZU5leHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogaXMgdGhpcyBub2RlIG9uZSB0byBiZSBkZWxldGVkICovXHJcbiAgICAgICAgICAgIGlmIChub2Rlc01hcFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgdGFrZU5leHROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJlc3ROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYmVzdE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjdXRTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFxyXG4gICAgICAgICAgICBcIkNvbmZpcm0gQ3V0XCIsXHJcbiAgICAgICAgICAgIFwiQ3V0IFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpLCB0byBwYXN0ZS9tb3ZlIHRvIG5ldyBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgIFwiWWVzXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBzZWxOb2Rlc0FycmF5O1xyXG4gICAgICAgICAgICAgICAgbG9hZE5vZGVzVG9Nb3ZlU2V0KHNlbE5vZGVzQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgYSB3YXkgdG8gZmluZCBhbGwgc2VsZWN0ZWQgY2hlY2tib3hlcyBpbiB0aGUgZ3VpIGFuZCByZXNldCB0aGVtIGFsbCB0byB1bmNoZWNrZWQgKi9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307IC8vIGNsZWFyIHNlbGVjdGlvbnMuXHJcblxyXG4gICAgICAgICAgICAgICAgLyogbm93IHdlIHJlbmRlciBhZ2FpbiBhbmQgdGhlIG5vZGVzIHRoYXQgd2VyZSBjdXQgd2lsbCBkaXNhcHBlYXIgZnJvbSB2aWV3ICovXHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbG9hZE5vZGVzVG9Nb3ZlU2V0ID0gZnVuY3Rpb24obm9kZUlkczogc3RyaW5nW10pIHtcclxuICAgICAgICBub2Rlc1RvTW92ZVNldCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcclxuICAgICAgICAgICAgbm9kZXNUb01vdmVTZXRbaWRdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBwYXN0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBQYXN0ZVwiLCBcIlBhc3RlIFwiICsgbm9kZXNUb01vdmUubGVuZ3RoICsgXCIgbm9kZShzKSB1bmRlciBzZWxlY3RlZCBwYXJlbnQgbm9kZSA/XCIsXHJcbiAgICAgICAgICAgIFwiWWVzLCBwYXN0ZS5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEZvciBub3csIHdlIHdpbGwganVzdCBjcmFtIHRoZSBub2RlcyBvbnRvIHRoZSBlbmQgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAqIHBhZ2UuIExhdGVyIG9uIHdlIGNhbiBnZXQgbW9yZSBzcGVjaWZpYyBhYm91dCBhbGxvd2luZyBwcmVjaXNlIGRlc3RpbmF0aW9uIGxvY2F0aW9uIGZvciBtb3ZlZFxyXG4gICAgICAgICAgICAgICAgICogbm9kZXMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk1vdmVOb2Rlc1JlcXVlc3QsIGpzb24uTW92ZU5vZGVzUmVzcG9uc2U+KFwibW92ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Q2hpbGRJZFwiOiBoaWdobGlnaHROb2RlICE9IG51bGwgPyBoaWdobGlnaHROb2RlLmlkIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogbm9kZXNUb01vdmVcclxuICAgICAgICAgICAgICAgIH0sIG1vdmVOb2Rlc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc2VydEJvb2tXYXJBbmRQZWFjZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Qm9va1JlcXVlc3QsIGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlPihcImluc2VydEJvb2tcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJib29rTmFtZVwiOiBcIldhciBhbmQgUGVhY2VcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRydW5jYXRlZFwiOiB1c2VyLmlzVGVzdFVzZXJBY2NvdW50KClcclxuICAgICAgICAgICAgICAgIH0sIGluc2VydEJvb2tSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG59XHJcblxuY2xhc3MgTWV0YTY0IHtcclxuXHJcbiAgICBhcHBJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGN1clVybFBhdGg6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICB1cmxDbWQ6IHN0cmluZztcclxuICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcclxuXHJcbiAgICBjb2RlRm9ybWF0RGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiB1c2VkIGFzIGEga2luZCBvZiAnc2VxdWVuY2UnIGluIHRoZSBhcHAsIHdoZW4gdW5pcXVlIHZhbHMgYSBuZWVkZWQgKi9cclxuICAgIG5leHRHdWlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qIG5hbWUgb2YgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyICovXHJcbiAgICB1c2VyTmFtZTogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuXHJcbiAgICAvKiBzY3JlZW4gY2FwYWJpbGl0aWVzICovXHJcbiAgICBkZXZpY2VXaWR0aDogbnVtYmVyID0gMDtcclxuICAgIGRldmljZUhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVXNlcidzIHJvb3Qgbm9kZS4gVG9wIGxldmVsIG9mIHdoYXQgbG9nZ2VkIGluIHVzZXIgaXMgYWxsb3dlZCB0byBzZWUuXHJcbiAgICAgKi9cclxuICAgIGhvbWVOb2RlSWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBob21lTm9kZVBhdGg6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLypcclxuICAgICAqIHNwZWNpZmllcyBpZiB0aGlzIGlzIGFkbWluIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIGlzQWRtaW5Vc2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogYWx3YXlzIHN0YXJ0IG91dCBhcyBhbm9uIHVzZXIgdW50aWwgbG9naW4gKi9cclxuICAgIGlzQW5vblVzZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IGFueSA9IG51bGw7XHJcbiAgICBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogc2lnbmFscyB0aGF0IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHRoZSBuZXh0IHRpbWUgd2UgZ28gdG8gdGhlIG1haW4gdHJlZSB2aWV3IHdpbmRvdyB3ZSBuZWVkIHRvIHJlZnJlc2ggZGF0YVxyXG4gICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgKi9cclxuICAgIHRyZWVEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAqXHJcbiAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUuaWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgLyogY291bnRlciBmb3IgbG9jYWwgdWlkcyAqL1xyXG4gICAgbmV4dFVpZDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICovXHJcbiAgICBpZGVudFRvVWlkTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgLyogVXNlci1zZWxlY3RhYmxlIHVzZXItYWNjb3VudCBvcHRpb25zIGVhY2ggdXNlciBjYW4gc2V0IG9uIGhpcyBhY2NvdW50ICovXHJcbiAgICBNT0RFX0FEVkFOQ0VEOiBzdHJpbmcgPSBcImFkdmFuY2VkXCI7XHJcbiAgICBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAvKiBjYW4gYmUgJ3NpbXBsZScgb3IgJ2FkdmFuY2VkJyAqL1xyXG4gICAgZWRpdE1vZGVPcHRpb246IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgLypcclxuICAgICAqIHRvZ2dsZWQgYnkgYnV0dG9uLCBhbmQgaG9sZHMgaWYgd2UgYXJlIGdvaW5nIHRvIHNob3cgcHJvcGVydGllcyBvciBub3Qgb24gZWFjaCBub2RlIGluIHRoZSBtYWluIHZpZXdcclxuICAgICAqL1xyXG4gICAgc2hvd1Byb3BlcnRpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiBGbGFnIHRoYXQgaW5kaWNhdGVzIGlmIHdlIGFyZSByZW5kZXJpbmcgcGF0aCwgb3duZXIsIG1vZFRpbWUsIGV0Yy4gb24gZWFjaCByb3cgKi9cclxuICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaXN0IG9mIG5vZGUgcHJlZml4ZXMgdG8gZmxhZyBub2RlcyB0byBub3QgYWxsb3cgdG8gYmUgc2hvd24gaW4gdGhlIHBhZ2UgaW4gc2ltcGxlIG1vZGVcclxuICAgICAqL1xyXG4gICAgc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3Q6IGFueSA9IHtcclxuICAgICAgICBcInJlcDpcIjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIHJlYWRPbmx5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBiaW5hcnlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIGFsbCBub2RlIHVpZHMgdG8gdHJ1ZSBpZiBzZWxlY3RlZCwgb3RoZXJ3aXNlIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZGVsZXRlZCAobm90IGV4aXN0aW5nKVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RlZE5vZGVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBTZXQgb2YgYWxsIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGVkIChmcm9tIHRoZSBhYmJyZXZpYXRlZCBmb3JtKSAqL1xyXG4gICAgZXhwYW5kZWRBYmJyZXZOb2RlSWRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgIGN1cnJlbnROb2RlRGF0YTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogYWxsIHZhcmlhYmxlcyBkZXJpdmFibGUgZnJvbSBjdXJyZW50Tm9kZURhdGEsIGJ1dCBzdG9yZWQgZGlyZWN0bHkgZm9yIHNpbXBsZXIgY29kZS9hY2Nlc3NcclxuICAgICAqL1xyXG4gICAgY3VycmVudE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZUlkOiBhbnkgPSBudWxsO1xyXG4gICAgY3VycmVudE5vZGVQYXRoOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qIE1hcHMgZnJvbSBndWlkIHRvIERhdGEgT2JqZWN0ICovXHJcbiAgICBkYXRhT2JqTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICByZW5kZXJGdW5jdGlvbnNCeUpjclR5cGU6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9O1xyXG4gICAgcHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICB1c2VyUHJlZmVyZW5jZXM6IGpzb24uVXNlclByZWZlcmVuY2VzID0ge1xyXG4gICAgICAgIFwiZWRpdE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgXCJsYXN0Tm9kZVwiOiBcIlwiLFxyXG4gICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgXCJzaG93TWV0YURhdGFcIjogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgdXBkYXRlTWFpbk1lbnVQYW5lbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIENyZWF0ZXMgYSAnZ3VpZCcgb24gdGhpcyBvYmplY3QsIGFuZCBtYWtlcyBkYXRhT2JqTWFwIGFibGUgdG8gbG9vayB1cCB0aGUgb2JqZWN0IHVzaW5nIHRoYXQgZ3VpZCBpbiB0aGVcclxuICAgICAqIGZ1dHVyZS5cclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJEYXRhT2JqZWN0ID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGlmICghZGF0YS5ndWlkKSB7XHJcbiAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbWV0YTY0Lm5leHRHdWlkO1xyXG4gICAgICAgICAgICBtZXRhNjQuZGF0YU9iak1hcFtkYXRhLmd1aWRdID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T2JqZWN0QnlHdWlkID0gZnVuY3Rpb24oZ3VpZCkge1xyXG4gICAgICAgIHZhciByZXQgPSBtZXRhNjQuZGF0YU9iak1hcFtndWlkXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBjYWxsYmFjayBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIHNjcmlwdCB0byBydW4sIG9yIGlmIGl0J3MgYSBmdW5jdGlvbiBvYmplY3QgdGhhdCB3aWxsIGJlXHJcbiAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICpcclxuICAgICAqIFdoZW5ldmVyIHdlIGFyZSBidWlsZGluZyBhbiBvbkNsaWNrIHN0cmluZywgYW5kIHdlIGhhdmUgdGhlIGFjdHVhbCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gdGhlIG5hbWUgb2YgdGhlXHJcbiAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAqIHRvIHRoZSBmdW5jdGlvbiBvYmplY3QsIGFuZCB0aGVuIGVuY29kZSBhIGNhbGwgdG8gcnVuIHRoYXQgZ3VpZCBieSBjYWxsaW5nIHJ1bkNhbGxiYWNrLiBUaGVyZSBpcyBhIGxldmVsIG9mXHJcbiAgICAgKiBpbmRpcmVjdGlvbiBoZXJlLCBidXQgdGhpcyBpcyB0aGUgc2ltcGxlc3QgYXBwcm9hY2ggd2hlbiB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gbWFwIGZyb20gYSBzdHJpbmcgdG8gYVxyXG4gICAgICogZnVuY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogY3R4PWNvbnRleHQsIHdoaWNoIGlzIHRoZSAndGhpcycgdG8gY2FsbCB3aXRoIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiwgYW5kIGhhdmUgYSAndGhpcycgY29udGV4dCB0byBiaW5kIHRvIGl0LlxyXG4gICAgICpcclxuICAgICAqIHBheWxvYWQgaXMgYW55IGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gYmUgcGFzc2VkIGF0IHJ1bnRpbWVcclxuICAgICAqXHJcbiAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlT25DbGljayA9IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSwgcGF5bG9hZD86IGFueSwgZGVsYXlDYWxsYmFjaz86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgfSAvL1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdChjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHBheWxvYWRTdHIgPSBwYXlsb2FkID8gcGF5bG9hZC5ndWlkIDogXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IHdoeSBpc24ndCBwYXlsb2FkU3RyIGluIHF1b3Rlcz8gSXQgd2FzIGxpa2UgdGhpcyBldmVuIGJlZm9yZSBzd2l0Y2hpbmcgdG8gYmFja3RpY2sgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYG1ldGE2NC5ydW5DYWxsYmFjaygke2NhbGxiYWNrLmd1aWR9LCR7Y3R4Lmd1aWR9LCR7cGF5bG9hZFN0cn0sJHtkZWxheUNhbGxiYWNrfSk7YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgbWV0YTY0LnJ1bkNhbGxiYWNrKCR7Y2FsbGJhY2suZ3VpZH0sbnVsbCxudWxsLCR7ZGVsYXlDYWxsYmFja30pO2A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwidW5leHBlY3RlZCBjYWxsYmFjayB0eXBlIGluIGVuY29kZU9uQ2xpY2tcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQsIGRlbGF5Q2FsbGJhY2s/OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxiYWNrIHJ1bjogXCIgKyBkZWxheUNhbGxiYWNrKTtcclxuICAgICAgICAvKiBkZXBlbmRpbmcgb24gZGVsYXlDYWxsYmFjaywgcnVuIHRoZSBjYWxsYmFjayBlaXRoZXIgaW1tZWRpYXRlbHkgb3Igd2l0aCBhIGRlbGF5ICovXHJcbiAgICAgICAgaWYgKGRlbGF5Q2FsbGJhY2sgPiAwKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgfSwgZGVsYXlDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnJ1bkNhbGxiYWNrSW1tZWRpYXRlKGd1aWQsIGN0eCwgcGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJ1bkNhbGxiYWNrSW1tZWRpYXRlID0gZnVuY3Rpb24oZ3VpZCwgY3R4LCBwYXlsb2FkKSB7XHJcbiAgICAgICAgdmFyIGRhdGFPYmogPSBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gbWV0YTY0LmdldE9iamVjdEJ5R3VpZChjdHgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBheWxvYWRPYmogPSBwYXlsb2FkID8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZChwYXlsb2FkKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGwodGhpeiwgcGF5bG9hZE9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcInVuYWJsZSB0byBmaW5kIGNhbGxiYWNrIG9uIHJlZ2lzdGVyZWQgZ3VpZDogXCIgKyBndWlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub01haW5QYWdlID0gZnVuY3Rpb24ocmVyZW5kZXI/OiBib29sZWFuLCBmb3JjZVNlcnZlclJlZnJlc2g/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVyZW5kZXIgfHwgbWV0YTY0LnRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFRhYiA9IGZ1bmN0aW9uKHBhZ2VOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAvKiB0aGlzIGNvZGUgY2FuIGJlIG1hZGUgbW9yZSBEUlksIGJ1dCBpJ20ganVzdCB0cnlpbmcgaXQgb3V0IGZvciBub3csIHNvIGknbSBub3QgYm90aGVyaW5nIHRvIHBlcmZlY3QgaXQgeWV0LiAqL1xyXG4gICAgICAgIC8vICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgLy8gJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgIC8vICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gaWYgKHBhZ2VOYW1lID09ICdtYWluVGFiTmFtZScpIHtcclxuICAgICAgICAvLyAgICAgJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICdzZWFyY2hUYWJOYW1lJykge1xyXG4gICAgICAgIC8vICAgICAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAndGltZWxpbmVUYWJOYW1lJykge1xyXG4gICAgICAgIC8vICAgICAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgKiBPT1Agd2l0aCAndGhpcycgYmVpbmcgZmlyc3QgcGFyYW1ldGVyIGFsd2F5cykuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VQYWdlID0gZnVuY3Rpb24ocGc/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHBnLnRhYklkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9vcHMsIHdyb25nIG9iamVjdCB0eXBlIHBhc3NlZCB0byBjaGFuZ2VQYWdlIGZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0aGlzIGlzIHRoZSBzYW1lIGFzIHNldHRpbmcgdXNpbmcgbWFpbklyb25QYWdlcz8/ICovXHJcbiAgICAgICAgdmFyIHBhcGVyVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTsgLy9cIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOb2RlQmxhY2tMaXN0ZWQgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgZm9yIChwcm9wIGluIG1ldGE2NC5zaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgc2VsQXJyYXk6IHN0cmluZ1tdID0gW10sIHVpZDtcclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gbWV0YTY0LnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2godWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICBSZXR1cm5zIGEgbmV3bHkgY2xvbmVkIGFycmF5IG9mIGFsbCB0aGUgc2VsZWN0ZWQgbm9kZXMgZWFjaCB0aW1lIGl0J3MgY2FsbGVkLlxyXG4gICAgKi9cclxuICAgIGdldFNlbGVjdGVkTm9kZUlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBzZWxBcnJheTogc3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICBpZiAoIW1ldGE2NC5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gc2VsZWN0ZWQgbm9kZXMuXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gbWV0YTY0LnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2gobm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHJldHVybiBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGZvciBlYWNoIE5vZGVJbmZvIHdoZXJlIHRoZSBrZXkgaXMgdGhlIGlkICovXHJcbiAgICBnZXRTZWxlY3RlZE5vZGVzQXNNYXBCeUlkID0gZnVuY3Rpb24oKTogT2JqZWN0IHtcclxuICAgICAgICBsZXQgcmV0OiBPYmplY3QgPSB7fTtcclxuICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2Rlc0FycmF5KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXRbc2VsQXJyYXlbaV0uaWRdID0gc2VsQXJyYXlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyogR2V0cyBzZWxlY3RlZCBub2RlcyBhcyBOb2RlSW5mby5qYXZhIG9iamVjdHMgYXJyYXkgKi9cclxuICAgIGdldFNlbGVjdGVkTm9kZXNBcnJheSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm9bXSB7XHJcbiAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSBbXTtcclxuICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh1aWQgaW4gbWV0YTY0LnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbEFycmF5W2lkeCsrXSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTZWxlY3RlZE5vZGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzLCBub2RlKSB7XHJcbiAgICAgICAgbGV0IG93bmVyQnVmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCBtaW5lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICQuZWFjaChyZXMub3duZXJzLCBmdW5jdGlvbihpbmRleCwgb3duZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyID09PSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBvd25lcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgIGxldCBlbG1JZCA9IFwiI293bmVyRGlzcGxheVwiICsgbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIHZhciBlbG0gPSAkKGVsbUlkKTtcclxuICAgICAgICAgICAgZWxtLmh0bWwoXCIgKE1hbmFnZXI6IFwiICsgb3duZXJCdWYgKyBcIilcIik7XHJcbiAgICAgICAgICAgIGlmIChtaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtSWQsIFwiY3JlYXRlZC1ieS1vdGhlclwiLCBcImNyZWF0ZWQtYnktbWVcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtSWQsIFwiY3JlYXRlZC1ieS1tZVwiLCBcImNyZWF0ZWQtYnktb3RoZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm9kZUluZm8gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBSZXR1cm5zIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIG5vZGUuaWQgdmFsdWUgKi9cclxuICAgIGdldE5vZGVGcm9tSWQgPSBmdW5jdGlvbihpZDogc3RyaW5nKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5pZFRvTm9kZU1hcFtpZF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aE9mVWlkID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUucGF0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgbGV0IHJldDoganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFttZXRhNjQuY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0Um93QnlJZCA9IGZ1bmN0aW9uKGlkLCBzY3JvbGwpOiB2b2lkIHtcclxuICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXROb2RlRnJvbUlkKGlkKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlnaGxpZ2h0Um93QnlJZCBmYWlsZWQgdG8gZmluZCBpZDogXCIgKyBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgKiBzZXR0aW5nIHRoYXQgdmFsdWUgc2hvdWxkIGdvIHRocnUgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgaGlnaGxpZ2h0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNjcm9sbDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgZG9uZUhpZ2hsaWdodGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICBsZXQgY3VySGlnaGxpZ2h0ZWROb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW21ldGE2NC5jdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWxyZWFkeSBoaWdobGlnaHRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZCA9IGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKFwiI1wiICsgcm93RWxtSWQsIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkb25lSGlnaGxpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFttZXRhNjQuY3VycmVudE5vZGVVaWRdID0gbm9kZTtcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dFbG1JZDogc3RyaW5nID0gbm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gZmluZCByb3dFbGVtZW50IHRvIGhpZ2hsaWdodDogXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKFwiI1wiICsgcm93RWxtSWQsIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVhbGx5IG5lZWQgdG8gdXNlIHB1Yi9zdWIgZXZlbnQgdG8gYnJvYWRjYXN0IGVuYWJsZW1lbnQsIGFuZCBsZXQgZWFjaCBjb21wb25lbnQgZG8gdGhpcyBpbmRlcGVuZGVudGx5IGFuZFxyXG4gICAgICogZGVjb3VwbGVcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICBsZXQgcHJldlBhZ2VFeGlzdHM6IGJvb2xlYW4gPSBuYXYubWFpbk9mZnNldCA+IDA7XHJcbiAgICAgICAgbGV0IG5leHRQYWdlRXhpc3RzOiBib29sZWFuID0gIW5hdi5lbmRSZWFjaGVkO1xyXG4gICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgbGV0IHNlbE5vZGVJc01pbmU6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgKGhpZ2hsaWdodE5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUgfHwgXCJhZG1pblwiID09PSBtZXRhNjQudXNlck5hbWUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgbWV0YTY0LmhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZDtcclxuICAgICAgICBsZXQgaW1wb3J0RmVhdHVyZUVuYWJsZWQgPSBtZXRhNjQuaXNBZG1pblVzZXIgfHwgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5pbXBvcnRBbGxvd2VkO1xyXG4gICAgICAgIGxldCBleHBvcnRGZWF0dXJlRW5hYmxlZCA9IG1ldGE2NC5pc0FkbWluVXNlciB8fCBtZXRhNjQudXNlclByZWZlcmVuY2VzLmV4cG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodE9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKGhpZ2hsaWdodE5vZGUpO1xyXG4gICAgICAgIGxldCBudW1DaGlsZE5vZGVzOiBudW1iZXIgPSBtZXRhNjQuZ2V0TnVtQ2hpbGROb2RlcygpO1xyXG4gICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSAoaGlnaGxpZ2h0T3JkaW5hbCA+IDAgJiYgbnVtQ2hpbGROb2RlcyA+IDEpIHx8IHByZXZQYWdlRXhpc3RzO1xyXG4gICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IChoaWdobGlnaHRPcmRpbmFsIDwgbnVtQ2hpbGROb2RlcyAtIDEgJiYgbnVtQ2hpbGROb2RlcyA+IDEpIHx8IG5leHRQYWdlRXhpc3RzO1xyXG5cclxuICAgICAgICAvL3RvZG8tMDogbmVlZCB0byBhZGQgdG8gdGhpcyBzZWxOb2RlSXNNaW5lIHx8IHNlbFBhcmVudElzTWluZTtcclxuICAgICAgICBsZXQgY2FuQ3JlYXRlTm9kZSA9IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgKG1ldGE2NC5pc0FkbWluVXNlciB8fCAoIW1ldGE2NC5pc0Fub25Vc2VyIC8qICYmIHNlbE5vZGVJc01pbmUgKi8pKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJlbmFibGVtZW50OiBpc0Fub25Vc2VyPVwiICsgbWV0YTY0LmlzQW5vblVzZXIgKyBcIiBzZWxOb2RlQ291bnQ9XCIgKyBzZWxOb2RlQ291bnQgKyBcIiBzZWxOb2RlSXNNaW5lPVwiICsgc2VsTm9kZUlzTWluZSk7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBtZXRhNjQuaXNBbm9uVXNlcik7XHJcblxyXG4gICAgICAgIGxldCBwcm9wc1RvZ2dsZTogYm9vbGVhbiA9IG1ldGE2NC5jdXJyZW50Tm9kZSAmJiAhbWV0YTY0LmlzQW5vblVzZXI7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgcHJvcHNUb2dnbGUpO1xyXG5cclxuICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IG1ldGE2NC5jdXJyZW50Tm9kZSAmJiAhbWV0YTY0LmlzQW5vblVzZXI7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwTGV2ZWxCdXR0b25cIiwgbWV0YTY0LmN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImN1dFNlbE5vZGVzQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicGFzdGVTZWxOb2Rlc0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgZWRpdC5ub2Rlc1RvTW92ZSAhPSBudWxsICYmIChzZWxOb2RlSXNNaW5lIHx8IGhvbWVOb2RlU2VsZWN0ZWQpKTtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVVcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlRG93bkJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjaGFuZ2VQYXNzd29yZFBnQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBtZXRhNjQuaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgbWV0YTY0LmlzQWRtaW5Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICYmIGhpZ2hsaWdodE5vZGUuaGFzQmluYXJ5ICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNvbnRlbnRTZWFyY2hEbGdCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsICFtZXRhNjQuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIG1ldGE2NC5pc0FkbWluVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNyZWF0ZU5vZGVCdXR0b25cIiwgY2FuQ3JlYXRlTm9kZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIG1ldGE2NC5ob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQpKSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIG1ldGE2NC5ob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQpKSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWRtaW5NZW51XCIsIG1ldGE2NC5pc0FkbWluVXNlcik7XHJcblxyXG4gICAgICAgIC8vVklTSUJJTElUWVxyXG5cclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuRXhwb3J0RGxnXCIsIGV4cG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIG1ldGE2NC5jdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgbWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICh1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImdlbmVyYXRlUlNTQnV0dG9uXCIsIG1ldGE2NC5pc0FkbWluVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBtZXRhNjQuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhbWV0YTY0LmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIW1ldGE2NC5pc0Fub25Vc2VyICYmIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG5cclxuICAgICAgICAvL1RvcCBMZXZlbCBNZW51IFZpc2liaWxpdHlcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJhZG1pbk1lbnVcIiwgbWV0YTY0LmlzQWRtaW5Vc2VyKTtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNpbmdsZVNlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZztcclxuICAgICAgICBmb3IgKHVpZCBpbiBtZXRhNjQuc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmb3VuZCBhIHNpbmdsZSBTZWwgTm9kZUlEOiBcIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9yZGluYWxPZk5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoIW5vZGUgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TnVtQ2hpbGROb2RlcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnROb2RlRGF0YSA9IGZ1bmN0aW9uKGRhdGEpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGUgPSBkYXRhLm5vZGU7XHJcbiAgICAgICAgbWV0YTY0LmN1cnJlbnROb2RlVWlkID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICBtZXRhNjQuY3VycmVudE5vZGVQYXRoID0gZGF0YS5ub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLnJlbmRlck5vZGVSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVCaW5hcnlCeVVpZCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChub2RlLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmhhc0JpbmFyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHVwZGF0ZXMgY2xpZW50IHNpZGUgbWFwcyBhbmQgY2xpZW50LXNpZGUgaWRlbnRpZmllciBmb3IgbmV3IG5vZGUsIHNvIHRoYXQgdGhpcyBub2RlIGlzICdyZWNvZ25pemVkJyBieSBjbGllbnRcclxuICAgICAqIHNpZGUgY29kZVxyXG4gICAgICovXHJcbiAgICBpbml0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHVwZGF0ZU1hcHM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGFzc2lnbiBhIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgdGhpcyBub2RlIHR5cGUsIEknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHVzaW5nIHNvbWUga2luZCBvZiBjdXN0b20gSlNcclxuICAgICAgICAgKiBwcm90b3R5cGUtcmVsYXRlZCBhcHByb2FjaFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUudWlkID0gdXBkYXRlTWFwcyA/IHV0aWwuZ2V0VWlkRm9ySWQobWV0YTY0LmlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogbWV0YTY0LmlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRm9yIHRoZXNlIHR3byBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFjY2Vzc2VkIGZyZXF1ZW50bHkgd2UgZ28gYWhlYWQgYW5kIGxvb2t1cCB0aGUgcHJvcGVydGllcyBpbiB0aGVcclxuICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgKiBzaW1wbGlmeSBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgbm9kZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5MQVNUX01PRElGSUVELCBub2RlKSk7XHJcblxyXG4gICAgICAgIGlmICh1cGRhdGVNYXBzKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwW25vZGUuaWRdID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENvbnN0YW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHV0aWwuYWRkQWxsKG1ldGE2NC5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3QsIFsgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUE9MSUNZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgdXRpbC5hZGRBbGwobWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlVVSUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVEX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgIHV0aWwuYWRkQWxsKG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3QsIFtqY3JDbnN0LkJJTl9EQVRBXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdEFwcCBydW5uaW5nLlwiKTtcblxuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBwb2RjYXN0LnJlbmRlckZlZWROb2RlO1xuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBwb2RjYXN0LnJlbmRlckl0ZW1Ob2RlO1xuICAgICAgICBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBwb2RjYXN0LnByb3BPcmRlcmluZ0ZlZWROb2RlO1xuICAgICAgICBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBwb2RjYXN0LnByb3BPcmRlcmluZ0l0ZW1Ob2RlO1xuXG4gICAgICAgIG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gc3lzdGVtZm9sZGVyLnJlbmRlck5vZGU7XG4gICAgICAgIG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gc3lzdGVtZm9sZGVyLnByb3BPcmRlcmluZztcblxuICAgICAgICBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OmZpbGVsaXN0XCJdID0gc3lzdGVtZm9sZGVyLnJlbmRlckZpbGVMaXN0Tm9kZTtcbiAgICAgICAgbWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IHN5c3RlbWZvbGRlci5maWxlTGlzdFByb3BPcmRlcmluZztcblxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4gICAgICAgIC8vIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7IGlmICh0eXBlb2Ygb25yZXNpemUgPT09ICdmdW5jdGlvbicpIG9ucmVzaXplKCk7IC8qKiAuLi4gKi8gfVxuXG4gICAgICAgICg8YW55PndpbmRvdykuYWRkRXZlbnQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFdBUk5JTkc6IFRoaXMgaXMgY2FsbGVkIGluIHJlYWx0aW1lIHdoaWxlIHVzZXIgaXMgcmVzaXppbmcgc28gYWx3YXlzIHRocm90dGxlIGJhY2sgYW55IHByb2Nlc3Npbmcgc28gdGhhdCB5b3UgZG9uJ3RcbiAgICAgICAgICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAgICAgICAgICovXG4gICAgICAgIC8vICg8YW55PndpbmRvdykud2luZG93UmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhcIldpbmRvd1Jlc2l6ZTogdz1cIiArIHdpbmRvdy5pbm5lcldpZHRoICsgXCIgaD1cIiArIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gKDxhbnk+d2luZG93KS5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsICg8YW55PndpbmRvdykud2luZG93UmVzaXplKTtcblxuICAgICAgICAvLyB0aGlzIGNvbW1lbnRlZCBzZWN0aW9uIGlzIG5vdCB3b3JraW5nIGluIG15IG5ldyB4LWFwcCBjb2RlLCBidXQgaXQncyBvayB0byBjb21tZW50IGl0IG91dCBmb3Igbm93LlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGlzIG91ciB0ZW1wbGF0ZSBlbGVtZW50IGluIGluZGV4Lmh0bWxcbiAgICAgICAgLy8gdmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4LWFwcCcpO1xuICAgICAgICAvLyAvLyBMaXN0ZW4gZm9yIHRlbXBsYXRlIGJvdW5kIGV2ZW50IHRvIGtub3cgd2hlbiBiaW5kaW5nc1xuICAgICAgICAvLyAvLyBoYXZlIHJlc29sdmVkIGFuZCBjb250ZW50IGhhcyBiZWVuIHN0YW1wZWQgdG8gdGhlIHBhZ2VcbiAgICAgICAgLy8gYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhcHAgcmVhZHkgZXZlbnQhJyk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgICg8YW55PndpbmRvdykuYWRkRXZlbnRMaXN0ZW5lcigncG9seW1lci1yZWFkeScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogY25zdC5qc1wiKTtcblxuICAgICAgICAvL3RvZG8tMTogdHlwZXNjcmlwdCB3aWxsIG5vdyBsZXQgdXMganVzdCBkbyB0aGlzOiBjb25zdCB2YXI9J3ZhbHVlJztcblxuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5hcHBJbml0aWFsaXplZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBtZXRhNjQuYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC50YWJDaGFuZ2VFdmVudCh0YWJzLnNlbGVjdGVkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbWV0YTY0LmluaXRDb25zdGFudHMoKTtcclxuICAgICAgICBtZXRhNjQuZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgbWV0YTY0LmRldmljZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgbWV0YTY0LmRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgKiB0aGUgc2Vzc2lvbiwgYW5kIHRoZW4gcmVuZGVycyBwYWdlIGNvbnRlbnQsIGFmdGVyIHRoYXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBDaGVjayBmb3Igc2NyZWVuIHNpemUgaW4gYSB0aW1lci4gV2UgZG9uJ3Qgd2FudCB0byBtb25pdG9yIGFjdHVhbCBzY3JlZW4gcmVzaXplIGV2ZW50cyBiZWNhdXNlIGlmIGEgdXNlclxyXG4gICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAqIHRoaW5ncyBldmVyeSB0aW1lIGl0IGNoYW5nZXMuIFNvIHdlIHRocm90dGxlIGJhY2sgdG8gb25seSByZW9yZ2FuaXppbmcgdGhlIHNjcmVlbiBvbmNlIHBlciBzZWNvbmQuIFRoaXNcclxuICAgICAgICAgKiB0aW1lciBpcyBhIHRocm90dGxlIHNvcnQgb2YuIFllcyBJIGtub3cgaG93IHRvIGxpc3RlbiBmb3IgZXZlbnRzLiBObyBJJ20gbm90IGRvaW5nIGl0IHdyb25nIGhlcmUuIFRoaXNcclxuICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsgdmFyIHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBpZiAod2lkdGggIT0gXy5kZXZpY2VXaWR0aCkgeyAvLyBjb25zb2xlLmxvZyhcIlNjcmVlbiB3aWR0aCBjaGFuZ2VkOiBcIiArIHdpZHRoKTtcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBfLnNjcmVlblNpemVDaGFuZ2UoKTsgfSB9LCAxNTAwKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgbWV0YTY0LnVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdXRpbC5pbml0UHJvZ3Jlc3NNb25pdG9yKCk7XHJcblxyXG4gICAgICAgIG1ldGE2NC5wcm9jZXNzVXJsUGFyYW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2Vzc1VybFBhcmFtcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0YTY0LnVybENtZCA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwiY21kXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0YWJOYW1lID09IFwic2VhcmNoVGFiTmFtZVwiKSB7XHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoVGFiQWN0aXZhdGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlTaWdudXBNZXNzYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAobWV0YTY0LmN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShtZXRhNjQuY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmVhY2gobWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgIG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbm9uUGFnZUhvbWUgPSBmdW5jdGlvbihpZ25vcmVVcmwpOiB2b2lkIHtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5Bbm9uUGFnZUxvYWRSZXF1ZXN0LCBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlPihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgIFwiaWdub3JlVXJsXCI6IGlnbm9yZVVybFxyXG4gICAgICAgIH0sIG1ldGE2NC5hbm9uUGFnZUxvYWRSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVVzZXJQcmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiBtZXRhNjQudXNlclByZWZlcmVuY2VzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uT3BlblN5c3RlbUZpbGVSZXF1ZXN0LCBqc29uLk9wZW5TeXN0ZW1GaWxlUmVzcG9uc2U+KFwib3BlblN5c3RlbUZpbGVcIiwge1xyXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IGZpbGVOYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdFN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbmV3IEVkaXRTeXN0ZW1GaWxlRGxnKGZpbGVOYW1lKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxubGV0IG1ldGE2NDpNZXRhNjQgPSBuZXcgTWV0YTY0KCk7XHJcblxubmFtZXNwYWNlIG5hdiB7XHJcbiAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9yb3dcIjtcclxuXHJcbiAgICAvKiB0b2RvLTA6IGV2ZW50dWFsbHkgd2hlbiB3ZSBkbyBwYWdpbmcgZm9yIG90aGVyIGxpc3RzLCB3ZSB3aWxsIG5lZWQgYSBzZXQgb2YgdGhlc2UgdmFyaWFibGVzIGZvciBlYWNoIGxpc3QgZGlzcGxheSAoaS5lLiBzZWFyY2gsIHRpbWVsaW5lLCBldGMpICovXHJcbiAgICBleHBvcnQgbGV0IG1haW5PZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgICBleHBvcnQgbGV0IGVuZFJlYWNoZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qIHRvZG8tMDogbmVlZCB0byBoYXZlIHRoaXMgdmFsdWUgcGFzc2VkIGZyb20gc2VydmVyIHJhdGhlciB0aGFuIGNvZGVkIGluIFR5cGVTY3JpcHQgKi9cclxuICAgIGV4cG9ydCBsZXQgUk9XU19QRVJfUEFHRTogbnVtYmVyID0gMjU7XHJcblxyXG4gICAgZXhwb3J0IGxldCBvcGVuTWFpbk1lbnVIZWxwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvbWV0YTY0L3B1YmxpYy9oZWxwXCIsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICBcIm9mZnNldFwiOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgb3BlblJzc0ZlZWRzTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL3Jzcy9mZWVkc1wiLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbWFpbk9mZnNldCxcclxuICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAvKiBJJ20gc2V0dGluZyB0aGlzIGhlcmUgc28gdGhhdCB3ZSBjYW4gY29tZSB1cCB3aXRoIGEgd2F5IHRvIG1ha2UgdGhlIGFiYnJldiBleHBhbmQgc3RhdGUgYmUgcmVtZW1iZXJlZCwgYnV0dG9uXHJcbiAgICAgICAgdGhpcyBpcyBsb3dlciBwcmlvcml0eSBmb3Igbm93LCBzbyBpJ20gbm90IHVzaW5nIGl0IHlldCAqL1xyXG4gICAgICAgIG1ldGE2NC5leHBhbmRlZEFiYnJldk5vZGVJZHNbbm9kZUlkXSA9IHRydWU7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3QsIGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2U+KFwiZXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkXHJcbiAgICAgICAgfSwgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJWQUw6IFwiK0pTT04uc3RyaW5naWZ5KHJlcy5ub2RlSW5mbykpO1xyXG4gICAgICAgICAgICByZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGVJbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBkaXNwbGF5aW5nSG9tZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHBhcmVudFZpc2libGVUb1VzZXIgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIWRpc3BsYXlpbmdIb21lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCB1cExldmVsUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCBpZCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghcmVzIHx8ICFyZXMubm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBkYXRhIGlzIHZpc2libGUgdG8geW91IGFib3ZlIHRoaXMgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKGlkLCB0cnVlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbmF2VXBMZXZlbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoIXBhcmVudFZpc2libGVUb1VzZXIoKSkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGF0IHJvb3QuIENhbid0IGdvIHVwLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IGZvciBub3cgYW4gdXBsZXZlbCB3aWxsIHJlc2V0IHRvIHplcm8gb2Zmc2V0LCBidXQgZXZlbnR1YWxseSBJIHdhbnQgdG8gaGF2ZSBlYWNoIGxldmVsIG9mIHRoZSB0cmVlLCBiZSBhYmxlIHRvXHJcbiAgICAgICAgcmVtZW1iZXIgd2hpY2ggb2Zmc2V0IGl0IHdhcyBhdCBzbyB3aGVuIHVzZXIgZHJpbGxzIGRvd24sIGFuZCB0aGVuIGNvbWVzIGJhY2sgb3V0LCB0aGV5IHBhZ2UgYmFjayBvdXQgZnJvbSB0aGUgc2FtZSBwYWdlcyB0aGV5XHJcbiAgICAgICAgZHJpbGxlZCBkb3duIGZyb20gKi9cclxuICAgICAgICBtYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiAxLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbWFpbk9mZnNldCxcclxuICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWREb21FbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLnBvbHlFbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbm9kZSBoaWdobGlnaHRlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdXRpbC5sb2dBbmRUaHJvdyhcImdldFNlbGVjdGVkUG9seUVsZW1lbnQgZmFpbGVkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjbGlja09uTm9kZVJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgKi9cclxuICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICogaWYgbm9uLW51bGwgaXQncyBhbHJlYWR5IGRpc3BsYXlpbmcgYW5kIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyB1cGRhdGVOb2RlSW5mb1wiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51cGRhdGVOb2RlSW5mbyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG9wZW5Ob2RlID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gb3Blbk5vZGU6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobm9kZS5pZCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdW5mb3J0dW5hdGVseSB3ZSBoYXZlIHRvIHJlbHkgb24gb25DbGljaywgYmVjYXVzZSBvZiB0aGUgZmFjdCB0aGF0IGV2ZW50cyB0byBjaGVja2JveGVzIGRvbid0IGFwcGVhciB0byB3b3JrXHJcbiAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAqIHNpbGx5IGxvb2tpbmcgYXN5bmMgdGltZXIgaGVyZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHRvZ2dsZUJ1dHRvbjogYW55ID0gdXRpbC5wb2x5RWxtKHVpZCArIFwiX3NlbFwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG5hdlBhZ2VOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbWFpbk9mZnNldCxcclxuICAgICAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG5hdlB1YmxpY0hvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgIH1cclxufVxyXG5cbmNsYXNzIFByZWZzIHtcblxyXG4gICAgY2xvc2VBY2NvdW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ2xvc2VBY2NvdW50UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPaCBObyFcIiwgXCJDbG9zZSB5b3VyIEFjY291bnQ/PHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2xvc2VBY2NvdW50UmVxdWVzdCwganNvbi5DbG9zZUFjY291bnRSZXNwb25zZT4oXCJjbG9zZUFjY291bnRcIiwge30sIHByZWZzLmNsb3NlQWNjb3VudFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG59XHJcbmxldCBwcmVmczpQcmVmcyA9IG5ldyBQcmVmcygpO1xuXG5uYW1lc3BhY2UgcHJvcHMge1xyXG5cclxuICAgIGV4cG9ydCBsZXQgb3JkZXJQcm9wcyA9IGZ1bmN0aW9uKHByb3BPcmRlcjogc3RyaW5nW10sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgbGV0IHByb3BzTmV3OiBqc29uLlByb3BlcnR5SW5mb1tdID0gdXRpbC5hcnJheUNsb25lKHByb3BzKTtcclxuICAgICAgICBsZXQgdGFyZ2V0SWR4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BPcmRlcikge1xyXG4gICAgICAgICAgICB0YXJnZXRJZHggPSBtb3ZlTm9kZVBvc2l0aW9uKHByb3BzTmV3LCB0YXJnZXRJZHgsIHByb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3BzTmV3O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtb3ZlTm9kZVBvc2l0aW9uID0gZnVuY3Rpb24ocHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10sIGlkeDogbnVtYmVyLCB0eXBlTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgdGFnSWR4OiBudW1iZXIgPSB1dGlsLmFycmF5SW5kZXhPZkl0ZW1CeVByb3AocHJvcHMsIFwibmFtZVwiLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICB1dGlsLmFycmF5TW92ZUl0ZW0ocHJvcHMsIHRhZ0lkeCwgaWR4KyspO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUb2dnbGVzIGRpc3BsYXkgb2YgcHJvcGVydGllcyBpbiB0aGUgZ3VpLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIC8vIHNldERhdGFJY29uVXNpbmdJZChcIiNlZGl0TW9kZUJ1dHRvblwiLCBlZGl0TW9kZSA/IFwiZWRpdFwiIDpcclxuICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgLy8gdmFyIGVsbSA9ICQoXCIjcHJvcHNUb2dnbGVCdXR0b25cIik7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzW2ldLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU29ydHMgcHJvcHMgaW5wdXQgYXJyYXkgaW50byB0aGUgcHJvcGVyIG9yZGVyIHRvIHNob3cgZm9yIGVkaXRpbmcuIFNpbXBsZSBhbGdvcml0aG0gZmlyc3QgZ3JhYnMgJ2pjcjpjb250ZW50J1xyXG4gICAgICogbm9kZSBhbmQgcHV0cyBpdCBvbiB0aGUgdG9wLCBhbmQgdGhlbiBkb2VzIHNhbWUgZm9yICdqY3RDbnN0LlRBR1MnXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYyhub2RlLCBwcm9wcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJvcHNOZXc6IGpzb24uUHJvcGVydHlJbmZvW10gPSB1dGlsLmFycmF5Q2xvbmUocHJvcHMpO1xyXG4gICAgICAgIG1vdmVQcm9wc1RvVG9wKFtqY3JDbnN0LkNPTlRFTlQsIGpjckNuc3QuVEFHU10sIHByb3BzTmV3KTtcclxuICAgICAgICBtb3ZlUHJvcHNUb0VuZChbamNyQ25zdC5DUkVBVEVELCBqY3JDbnN0LkNSRUFURURfQlksIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgamNyQ25zdC5MQVNUX01PRElGSUVEX0JZXSwgcHJvcHNOZXcpO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyogTW92ZXMgYWxsIHRoZSBwcm9wZXJ0aWVzIGxpc3RlZCBpbiBwcm9wTGlzdCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIGtlZXBzIHRoZW0gaW4gdGhlIG9yZGVyIHNwZWNpZmllZCAqL1xyXG4gICAgbGV0IG1vdmVQcm9wc1RvVG9wID0gZnVuY3Rpb24ocHJvcHNMaXN0OiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgdGFnSWR4ID0gdXRpbC5hcnJheUluZGV4T2ZJdGVtQnlQcm9wKHByb3BzLCBcIm5hbWVcIiwgcHJvcCk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBNb3ZlcyBhbGwgdGhlIHByb3BlcnRpZXMgbGlzdGVkIGluIHByb3BMaXN0IGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQga2VlcHMgdGhlbSBpbiB0aGUgb3JkZXIgc3BlY2lmaWVkICovXHJcbiAgICBsZXQgbW92ZVByb3BzVG9FbmQgPSBmdW5jdGlvbihwcm9wc0xpc3Q6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSkge1xyXG4gICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCB0YWdJZHggPSB1dGlsLmFycmF5SW5kZXhPZkl0ZW1CeVByb3AocHJvcHMsIFwibmFtZVwiLCBwcm9wKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5hcnJheU1vdmVJdGVtKHByb3BzLCB0YWdJZHgsIHByb3BzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHByb3BlcnRpZXMgd2lsbCBiZSBudWxsIG9yIGEgbGlzdCBvZiBQcm9wZXJ0eUluZm8gb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHJvcGVydGllcyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHByb3BlcnRpZXMsIGZ1bmN0aW9uKGksIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcGVydHkubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtbmFtZS1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNCaW5hcnlQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IFwiW2JpbmFyeV1cIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcmVuZGVyLndyYXBIdG1sKHByb3BlcnR5LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGQgKz0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtdmFsLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGUgKz0gcmVuZGVyLnRhZyhcInRyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtcm93XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCB0ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvcENvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInRhYmxlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiYm9yZGVyXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3BlcnR5LXRhYmxlXCJcclxuICAgICAgICAgICAgfSwgdGFibGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBicnV0ZSBmb3JjZSBzZWFyY2hlcyBvbiBub2RlIChOb2RlSW5mby5qYXZhKSBvYmplY3QgcHJvcGVydGllcyBsaXN0LCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgcHJvcGVydHlcclxuICAgICAqIChQcm9wZXJ0eUluZm8uamF2YSkgd2l0aCBuYW1lIG1hdGNoaW5nIHByb3BlcnR5TmFtZSwgZWxzZSBudWxsLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IGpzb24uUHJvcGVydHlJbmZvIHtcclxuICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucHJvcGVydGllcylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IG5vZGUucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgaWYgKHByb3AubmFtZSA9PT0gcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eVZhbCA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gZ2V0Tm9kZVByb3BlcnR5KHByb3BlcnR5TmFtZSwgbm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHByb3AgPyBwcm9wLnZhbHVlIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0cnVzIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGlzTm9uT3duZWROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBkb24ndCBrbm93IHdobyBvd25zIHRoaXMgbm9kZSBhc3N1bWUgdGhlIGFkbWluIG93bnMgaXQuXHJcbiAgICAgICAgaWYgKCFjcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgY3JlYXRlZEJ5ID0gXCJhZG1pblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGhpcyBpcyBPUiBjb25kaXRpb24gYmVjYXVzZSBvZiBjcmVhdGVkQnkgaXMgbnVsbCB3ZSBhc3N1bWUgd2UgZG8gbm90IG93biBpdCAqL1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaXNOb25Pd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaXNPd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgPT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBwcm9wZXJ0eSB2YWx1ZSwgZXZlbiBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eSk6IHN0cmluZyB7XHJcbiAgICAgICAgLyogSWYgdGhpcyBpcyBhIHNpbmdsZS12YWx1ZSB0eXBlIHByb3BlcnR5ICovXHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIHByb3BlcnR5IGlzIG1pc3NpbmcgcmV0dXJuIGVtcHR5IHN0cmluZyAqL1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlIHx8IHByb3BlcnR5LnZhbHVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiBlbHNlIHJlbmRlciBtdWx0aS12YWx1ZSBwcm9wZXJ0eSAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAkLmVhY2godmFsdWVzLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSByZW5kZXIge1xyXG4gICAgbGV0IGRlYnVnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcbiAgICAgKiB3YW50IHRvIGdpdmUgdGhlbSBzb21lIGluc3RydWN0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gYWRkIGNvbnRlbnQuXHJcbiAgICAgKi9cclxuICAgIGxldCBnZXRFbXB0eVBhZ2VQcm9tcHQgPSBmdW5jdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIjxwPlRoZXJlIGFyZSBubyBzdWJub2RlcyB1bmRlciB0aGlzIG5vZGUuIDxicj48YnI+Q2xpY2sgJ0VESVQgTU9ERScgYW5kIHRoZW4gdXNlIHRoZSAnQUREJyBidXR0b24gdG8gY3JlYXRlIGNvbnRlbnQuPC9wPlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZW5kZXJCaW5hcnkgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChub2RlLmJpbmFyeUlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VJbWFnZVRhZyhub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBub3QgYW4gaW1hZ2Ugd2UgcmVuZGVyIGEgbGluayB0byB0aGUgYXR0YWNobWVudCwgc28gdGhhdCBpdCBjYW4gYmUgZG93bmxvYWRlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFuY2hvcjogc3RyaW5nID0gdGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImhyZWZcIjogZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSlcclxuICAgICAgICAgICAgfSwgXCJbRG93bmxvYWQgQXR0YWNobWVudF1cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJiaW5hcnktbGlua1wiXHJcbiAgICAgICAgICAgIH0sIGFuY2hvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbXBvcnRhbnQgbGl0dGxlIG1ldGhvZCBoZXJlLiBBbGwgR1VJIHBhZ2UvZGl2cyBhcmUgY3JlYXRlZCB1c2luZyB0aGlzIHNvcnQgb2Ygc3BlY2lmaWNhdGlvbiBoZXJlIHRoYXQgdGhleVxyXG4gICAgICogYWxsIG11c3QgaGF2ZSBhICdidWlsZCcgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZpcnN0IHRpbWUgb25seSwgYW5kIHRoZW4gdGhlICdpbml0JyBtZXRob2QgY2FsbGVkIGJlZm9yZSBlYWNoXHJcbiAgICAgKiB0aW1lIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNwbGF5ZWQgd2l0aCBuZXcgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogSWYgJ2RhdGEnIGlzIHByb3ZpZGVkLCB0aGlzIGlzIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgYnVpZFBhZ2UgPSBmdW5jdGlvbihwZywgZGF0YSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRQYWdlOiBwZy5kb21JZD1cIiArIHBnLmRvbUlkKTtcclxuXHJcbiAgICAgICAgaWYgKCFwZy5idWlsdCB8fCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHBnLmJ1aWxkKGRhdGEpO1xyXG4gICAgICAgICAgICBwZy5idWlsdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGcuaW5pdCkge1xyXG4gICAgICAgICAgICBwZy5pbml0KGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGJ1aWxkUm93SGVhZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGg6IGJvb2xlYW4sIHNob3dOYW1lOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlclRleHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9PTl9ST1dTKSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2IGNsYXNzPSdwYXRoLWRpc3BsYXknPlBhdGg6IFwiICsgZm9ybWF0UGF0aChub2RlKSArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdj5cIjtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChjb21tZW50QnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q29tbWVudCBCeTogXCIgKyBjb21tZW50QnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICB9IC8vXHJcbiAgICAgICAgZWxzZSBpZiAobm9kZS5jcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAobm9kZS5jcmVhdGVkQnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q3JlYXRlZCBCeTogXCIgKyBub2RlLmNyZWF0ZWRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyVGV4dCArPSBgPHNwYW4gaWQ9J293bmVyRGlzcGxheSR7bm9kZS51aWR9Jz48L3NwYW4+YDtcclxuICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBgICBNb2Q6ICR7bm9kZS5sYXN0TW9kaWZpZWR9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGVhZGVyVGV4dCArPSBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogY29tbWVudGluZzogSSBkZWNpZGVkIHVzZXJzIHdpbGwgdW5kZXJzdGFuZCB0aGUgcGF0aCBhcyBhIHNpbmdsZSBsb25nIGVudGl0eSB3aXRoIGxlc3MgY29uZnVzaW9uIHRoYW5cclxuICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAqIHRvIGJhYnkgdGhlbS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICogbmFtZSwgc28gd2UgZG9uJ3QgbmVlZCB0byBzaG93IHRoZSBwYXRoIEFORCB0aGUgbmFtZS4gT25lIGlzIGEgc3Vic3RyaW5nIG9mIHRoZSBvdGhlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IGBOYW1lOiAke25vZGUubmFtZX0gW3VpZD0ke25vZGUudWlkfV1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyVGV4dCA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJoZWFkZXItdGV4dFwiXHJcbiAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAqIHByZXR0aWZpZXIgdG8gcHJvY2VzcyBpdCB0aGUgcmVzdCBvZiB0aGUgd2F5ICh3aGVuIHdlIGNhbGwgcHJldHR5UHJpbnQoKSBmb3IgdGhlIHdob2xlIHBhZ2UpIHdlIG5vdyBydW5cclxuICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaW5qZWN0Q29kZUZvcm1hdHRpbmcgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghY29udGVudCkgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAvLyBgYGBqc1xyXG4gICAgICAgIC8vIHZhciB4ID0gMTA7XHJcbiAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAvLyBgYGBcclxuICAgICAgICAvL1xyXG4gICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGNvbnRlbnQsIFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBlbmNvZGVMYW5ndWFnZXMoY29udGVudCk7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbmplY3RTdWJzdGl0dXRpb25zID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdXRpbC5yZXBsYWNlQWxsKGNvbnRlbnQsIFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZW5jb2RlTGFuZ3VhZ2VzID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZG8tMTogbmVlZCB0byBwcm92aWRlIHNvbWUgd2F5IG9mIGhhdmluZyB0aGVzZSBsYW5ndWFnZSB0eXBlcyBjb25maWd1cmFibGUgaW4gYSBwcm9wZXJ0aWVzIGZpbGVcclxuICAgICAgICAgKiBzb21ld2hlcmUsIGFuZCBmaWxsIG91dCBhIGxvdCBtb3JlIGZpbGUgdHlwZXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIGxhbmdzID0gW1wianNcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCJdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFuZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29udGVudCA9IHV0aWwucmVwbGFjZUFsbChjb250ZW50LCBcIjxjb2RlIGNsYXNzPVxcXCJcIiArIGxhbmdzW2ldICsgXCJcXFwiPlwiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCI8P3ByZXR0aWZ5IGxhbmc9XCIgKyBsYW5nc1tpXSArIFwiPz48cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZW50ID0gdXRpbC5yZXBsYWNlQWxsKGNvbnRlbnQsIFwiPGNvZGU+XCIsIFwiPHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyogYWZ0ZXIgYSBwcm9wZXJ0eSwgb3Igbm9kZSBpcyB1cGRhdGVkIChzYXZlZCkgd2UgY2FuIG5vdyBjYWxsIHRoaXMgbWV0aG9kIGluc3RlYWQgb2YgcmVmcmVzaGluZyB0aGUgZW50aXJlIHBhZ2VcclxuICAgIHdoaWNoIGlzIHdoYXQncyBkb25lIGluIG1vc3Qgb2YgdGhlIGFwcCwgd2hpY2ggaXMgbXVjaCBsZXNzIGVmZmljaWVudCBhbmQgc25hcHB5IHZpc3VhbGx5ICovXHJcbiAgICBleHBvcnQgbGV0IHJlZnJlc2hOb2RlT25QYWdlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHZvaWQge1xyXG4gICAgICAgIC8vbmVlZCB0byBsb29rdXAgdWlkIGZyb20gTm9kZUluZm8uaWQgdGhlbiBzZXQgdGhlIGNvbnRlbnQgb2YgdGhpcyBkaXYuXHJcbiAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgIC8vdG8gdGhlIHZhbHVlIGZyb20gcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtZXRhNjQuaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICBpZiAoIXVpZCkgdGhyb3cgYFVuYWJsZSB0byBmaW5kIG5vZGVJZCAke25vZGUuaWR9IGluIHVpZCBtYXBgO1xyXG4gICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlLCBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHVpZCAhPSBub2RlLnVpZCkgdGhyb3cgXCJ1aWQgY2hhbmdlZCB1bmV4cGVjdGx5IGFmdGVyIGluaXROb2RlXCI7XHJcbiAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICQoXCIjXCIgKyB1aWQgKyBcIl9jb250ZW50XCIpLmh0bWwocm93Q29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmVuZGVycyBlYWNoIG5vZGUgaW4gdGhlIG1haW4gd2luZG93LiBUaGUgcmVuZGVyaW5nIGluIGhlcmUgaXMgdmVyeSBjZW50cmFsIHRvIHRoZVxyXG4gICAgICogYXBwIGFuZCBpcyB3aGF0IHRoZSB1c2VyIHNlZXMgY292ZXJpbmcgOTAlIG9mIHRoZSBzY3JlZW4gbW9zdCBvZiB0aGUgdGltZS4gVGhlIFwiY29udGVudCogbm9kZXMuXHJcbiAgICAgKlxyXG4gICAgICogdG9kby0wOiBSYXRoZXIgdGhhbiBoYXZpbmcgdGhpcyBub2RlIHJlbmRlcmVyIGl0c2VsZiBiZSByZXNwb25zaWJsZSBmb3IgcmVuZGVyaW5nIGFsbCB0aGUgZGlmZmVyZW50IHR5cGVzXHJcbiAgICAgKiBvZiBub2RlcywgbmVlZCBhIG1vcmUgcGx1Z2dhYmxlIGRlc2lnbiwgd2hlcmUgcmVuZGVpbmcgb2YgZGlmZmVyZW50IHRoaW5ncyBpcyBkZWxldGFnZWQgdG8gc29tZVxyXG4gICAgICogYXBwcm9wcmlhdGUgb2JqZWN0L3NlcnZpY2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQ29udGVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluLCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSBnZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTI6IGVuYWJsZSBoZWFkZXJUZXh0IHdoZW4gYXBwcm9wcmlhdGUgaGVyZSAqL1xyXG4gICAgICAgIGlmIChtZXRhNjQuc2hvd01ldGFEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gYnVpbGRSb3dIZWFkZXIobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWV0YTY0LnNob3dQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJlbmRlckNvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTcGVjaWFsIFJlbmRlcmluZyBmb3IgTm9kZXMgdGhhdCBoYXZlIGEgcGx1Z2luLXJlbmRlcmVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBmdW5jKG5vZGUsIHJvd1N0eWxpbmcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50UHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5DT05URU5ULCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHByb3BzLnJlbmRlclByb3BlcnR5KGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKiBqY3JDb250ZW50IGZvciBNQVJLRE9XTjpcXG5cIitqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlZENvbnRlbnQgPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwnPjwvZGl2PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8c2NyaXB0IHR5cGU9J3RleHQvbWFya2Rvd24nPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zY3JpcHQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vV2hlbiBkb2luZyBzZXJ2ZXItc2lkZSBtYXJrZG93biB3ZSBoYWQgdGhpcyBwcm9jZXNzaW5nIHRoZSBIVE1MIHRoYXQgd2FzIGdlbmVyYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vYnV0IEkgaGF2ZW4ndCBsb29rZWQgaW50byBob3cgdG8gZ2V0IHRoaXMgYmFjayBub3cgdGhhdCB3ZSBhcmUgZG9pbmcgbWFya2Rvd24gb24gY2xpZW50LlxyXG4gICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdENvZGVGb3JtYXR0aW5nKGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdFN1YnN0aXR1dGlvbnMoamNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgbWFya2VkQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG1hcmtlZENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCJSb290IE5vZGVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydGllczogc3RyaW5nID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZW5kZXJCaW4gJiYgbm9kZS5oYXNCaW5hcnkpIHtcclxuICAgICAgICAgICAgbGV0IGJpbmFyeTogc3RyaW5nID0gcmVuZGVyQmluYXJ5KG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgYXBwZW5kIHRoZSBiaW5hcnkgaW1hZ2Ugb3IgcmVzb3VyY2UgbGluayBlaXRoZXIgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dCBvciBhdCB0aGUgbG9jYXRpb24gd2hlcmVcclxuICAgICAgICAgICAgICogdGhlIHVzZXIgaGFzIHB1dCB7e2luc2VydC1hdHRhY2htZW50fX0gaWYgdGhleSBhcmUgdXNpbmcgdGhhdCB0byBtYWtlIHRoZSBpbWFnZSBhcHBlYXIgaW4gYSBzcGVjaWZpY1xyXG4gICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jb250YWlucyhyZXQsIGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCBjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IGJpbmFyeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRhZ3M6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlRBR1MsIG5vZGUpO1xyXG4gICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRhZ3MtY29udGVudFwiXHJcbiAgICAgICAgICAgIH0sIFwiVGFnczogXCIgKyB0YWdzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCByZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5ID0gZnVuY3Rpb24oanNvbkNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uOiBcIiArIGpzb25Db250ZW50KTtcclxuICAgICAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gSlNPTi5wYXJzZShqc29uQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN5c3RlbUZpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogYG1ldGE2NC5lZGl0U3lzdGVtRmlsZSgnJHtlbnRyeS5maWxlTmFtZX0nKWBcclxuICAgICAgICAgICAgICAgIH0sIGVudHJ5LmZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBvcGVuU3lzdGVtRmlsZSB3b3JrZWQgb24gbGludXgsIGJ1dCBpJ20gc3dpdGNoaW5nIHRvIGZ1bGwgdGV4dCBmaWxlIGVkaXQgY2FwYWJpbGl0eSBvbmx5IGFuZCBkb2luZyB0aGF0XHJcbiAgICAgICAgICAgICAgICBpbnNpZGUgbWV0YTY0IGZyb20gbm93IG9uLCBzbyBvcGVuU3lzdGVtRmlsZSBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxvY2FsT3BlbkxpbmsgPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibWV0YTY0Lm9wZW5TeXN0ZW1GaWxlKCdcIiArIGVudHJ5LmZpbGVOYW1lICsgXCInKVwiXHJcbiAgICAgICAgICAgICAgICAvLyB9LCBcIkxvY2FsIE9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGRvd25sb2FkTGluayA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAvL2hhdmVuJ3QgaW1wbGVtZW50ZWQgZG93bmxvYWQgY2FwYWJpbGl0eSB5ZXQuXHJcbiAgICAgICAgICAgICAgICAvLyB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibWV0YTY0LmRvd25sb2FkU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJEb3dubG9hZFwiKVxyXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxpbmtzRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGxvY2FsT3BlbkxpbmsgKyBkb3dubG9hZExpbmspO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnRlbnQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGZpbGVOYW1lRGl2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJyZW5kZXIgZmFpbGVkXCIsIGUpO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gXCJbcmVuZGVyIGZhaWxlZF1cIlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZUFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBpbmRleDogbnVtYmVyLCBjb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbm9kZS51aWQ7XHJcbiAgICAgICAgbGV0IHByZXZQYWdlRXhpc3RzOiBib29sZWFuID0gbmF2Lm1haW5PZmZzZXQgPiAwO1xyXG4gICAgICAgIGxldCBuZXh0UGFnZUV4aXN0czogYm9vbGVhbiA9ICFuYXYuZW5kUmVhY2hlZDtcclxuICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gKGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDEpIHx8IHByZXZQYWdlRXhpc3RzO1xyXG4gICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IChpbmRleCA8IGNvdW50IC0gMSkgfHwgbmV4dFBhZ2VFeGlzdHM7XHJcblxyXG4gICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIFwicmVwOlwiKSB8fCAvKlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnP1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICovdXRpbC5jb250YWlucyhub2RlLnBhdGgsIFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gZWRpdGluZ0FsbG93ZWQ9XCIrZWRpdGluZ0FsbG93ZWQpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGlmIG5vdCBzZWxlY3RlZCBieSBiZWluZyB0aGUgbmV3IGNoaWxkLCB0aGVuIHdlIHRyeSB0byBzZWxlY3QgYmFzZWQgb24gaWYgdGhpcyBub2RlIHdhcyB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgKiBjbGlja2VkIG9uIGZvciB0aGlzIHBhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0ZXN0OiBbXCIgKyBwYXJlbnRJZFRvRm9jdXNJZE1hcFtjdXJyZW50Tm9kZUlkXVxyXG4gICAgICAgIC8vICtcIl09PVtcIisgbm9kZS5pZCArIFwiXVwiKVxyXG4gICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gKGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQpO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uQmFySHRtbFJldDogc3RyaW5nID0gbWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpO1xyXG4gICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnJHt1aWR9Jyk7YCwgLy9cclxuICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgXCJzdHlsZVwiOiBia2dTdHlsZVxyXG4gICAgICAgIH0sLy9cclxuICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2hvd05vZGVVcmwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IG11c3QgZmlyc3QgY2xpY2sgb24gYSBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gdXRpbC5zdHJpcElmU3RhcnRzV2l0aChub2RlLnBhdGgsIFwiL3Jvb3RcIik7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgcGF0aDtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlOiBzdHJpbmcgPSBcIlVSTCB1c2luZyBwYXRoOiA8YnI+XCIgKyB1cmw7XHJcbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcImpjcjp1dWlkXCIsIG5vZGUpO1xyXG4gICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cD5VUkwgZm9yIFVVSUQ6IDxicj5cIiArIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIj9pZD1cIiArIHV1aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAobmV3IE1lc3NhZ2VEbGcobWVzc2FnZSwgXCJVUkwgb2YgTm9kZVwiKSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2V0VG9wUmlnaHRJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgIGxldCB0b3BSaWdodEltZ1RhZzogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdG9wUmlnaHRJbWcsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidG9wLXJpZ2h0LWltYWdlXCJcclxuICAgICAgICAgICAgfSwgXCJcIiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9wUmlnaHRJbWdUYWc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXROb2RlQmtnSW1hZ2VTdHlsZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBia2dJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGlmIChia2dJbWcpIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGFzIEkgd2FzIGNvbnZlcnRpbmdpIHNvbWUgc3RyaW5ncyB0byBiYWNrdGljayBpIG5vdGljZWQgdGhpcyBVUkwgbWlzc2luZyB0aGUgcXVvdGVzIGFyb3VuZCB0aGUgc3RyaW5nLiBJcyB0aGlzIGEgYnVnP1xyXG4gICAgICAgICAgICBia2dJbWdTdHlsZSA9IGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtia2dJbWd9KTtgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYmtnSW1nU3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjZW50ZXJlZEJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM/OiBzdHJpbmcsIGNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dCB2ZXJ0aWNhbC1sYXlvdXQtcm93IFwiICsgY2xhc3Nlc1xyXG4gICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2VudGVyQ29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZywgd2lkdGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGRpdjogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwic3R5bGVcIjogYHdpZHRoOiR7d2lkdGh9cHg7YCB9LCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGF0dHJzID0ge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dCB2ZXJ0aWNhbC1sYXlvdXQtcm93XCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCBhdHRycywgZGl2LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICBsZXQgb3BlbkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgc2VsQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgbW92ZU5vZGVVcEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCBpbnNlcnROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBTaG93IFJlcGx5IGJ1dHRvbiBpZiB0aGlzIGlzIGEgcHVibGljbHkgYXBwZW5kYWJsZSBub2RlIGFuZCBub3QgY3JlYXRlZCBieSBjdXJyZW50IHVzZXIsXHJcbiAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJlcGx5VG9Db21tZW50KCcke25vZGUudWlkfScpO2AgLy9cclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8qIENvbnN0cnVjdCBPcGVuIEJ1dHRvbiAqL1xyXG4gICAgICAgIGlmIChub2RlSGFzQ2hpbGRyZW4obm9kZS51aWQpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBvcGVuQnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBGb3Igc29tZSB1bmtub3duIHJlYXNvbiB0aGUgYWJpbGl0eSB0byBzdHlsZSB0aGlzIHdpdGggdGhlIGNsYXNzIGJyb2tlLCBhbmQgZXZlblxyXG4gICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgIGEgaHVuZHJlZCB0aW1lcyBhbmQgc3RpbGwgZG9uJ3Qga25vdyB3aGF0IEknbSBkb2luZyB3cm9uZy4uLkkganVzdCBmaW5hbGx5IHB1dCB0aGUgZ29kIGRhbW4gZnVja2luZyBzdHlsZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgIGhlcmUgdG8gYWNjb21wbGlzaCB0aGUgc2FtZSB0aGluZyAqL1xyXG4gICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJiYWNrZ3JvdW5kLWNvbG9yOiAjNGNhZjUwO2NvbG9yOndoaXRlO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbmF2Lm9wZW5Ob2RlKCcke25vZGUudWlkfScpO2AvL1xyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgKiB0aGV5IGRvbid0IGhhdmUgcHJpdmlsZWdlcyB0aGUgc2VydmVyIHNpZGUgc2VjdXJpdHkgd2lsbCBsZXQgdGhlbSBrbm93LiBJbiB0aGUgZnV0dXJlIHdlIGNhbiBhZGQgbW9yZVxyXG4gICAgICAgICAqIGludGVsbGlnZW5jZSB0byB3aGVuIHRvIHNob3cgdGhlc2UgYnV0dG9ucyBvciBub3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFZGl0aW5nIGFsbG93ZWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIG5vZGVJZCBcIiArIG5vZGUudWlkICsgXCIgc2VsZWN0ZWQ9XCIgKyBzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBuYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgXCJjaGVja2VkXCI6IFwiY2hlY2tlZFwiLFxyXG4gICAgICAgICAgICAgICAgLy9wYWRkaW5nIGlzIGEgYmFjayBoYWNrIHRvIG1ha2UgY2hlY2tib3ggbGluZSB1cCB3aXRoIG90aGVyIGljb25zLlxyXG4gICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi10b3A6IDExcHg7XCJcclxuICAgICAgICAgICAgfSA6IC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLnVpZCArIFwiX3NlbFwiLC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBuYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0Lk5FV19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9cImljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZVwiLCAvL1wiaWNvbnM6bW9yZS1ob3JpelwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0Lmluc2VydE5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwgLy9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYGVkaXQucnVuRWRpdE5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZVVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVVcEJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctdXB3YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgZWRpdC5tb3ZlTm9kZVVwKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlRG93bkJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0Lm1vdmVOb2RlRG93bignJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJEblwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBIb3dldmVyIHRvb2x0aXBzIEFMV0FZUyBjYXVzZSBwcm9ibGVtcy4gTXlzdGVyeSBmb3Igbm93LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBpbnNlcnROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAvL1x0XHRcdCB0YWcoXCJwYXBlci10b29sdGlwXCIsIHtcclxuICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgLy9cdFx0XHQgfSwgXCJJTlNFUlRTIGEgbmV3IG5vZGUgYXQgdGhlIGN1cnJlbnQgdHJlZSBwb3NpdGlvbi4gQXMgYSBzaWJsaW5nIG9uIHRoaXMgbGV2ZWwuXCIpO1xyXG5cclxuICAgICAgICBsZXQgYWRkTm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgIC8vXHRcdFx0IH0sIFwiQUREUyBhIG5ldyBub2RlIGluc2lkZSB0aGUgY3VycmVudCBub2RlLCBhcyBhIGNoaWxkIG9mIGl0LlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICsgYWRkTm9kZVRvb2x0aXAgKyBlZGl0Tm9kZUJ1dHRvbiArIG1vdmVOb2RlVXBCdXR0b24gKyBtb3ZlTm9kZURvd25CdXR0b24gKyByZXBseUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEJ1dHRvbnMubGVuZ3RoID4gMCA/IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoYWxsQnV0dG9ucywgXCJyb3ctdG9vbGJhclwiKSA6IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0ID0gZnVuY3Rpb24oY29udGVudD86IHN0cmluZywgZXh0cmFDbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwgLy9cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCIgKyAoZXh0cmFDbGFzc2VzID8gKFwiIFwiICsgZXh0cmFDbGFzc2VzKSA6IFwiXCIpXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZUhvcnpDb250cm9sR3JvdXAgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIlxyXG4gICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZVJhZGlvQnV0dG9uID0gZnVuY3Rpb24obGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBpZFxyXG4gICAgICAgIH0sIGxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBub2RlSWQgKHNlZSBtYWtlTm9kZUlkKCkpIE5vZGVJbmZvIG9iamVjdCBoYXMgJ2hhc0NoaWxkcmVuJyB0cnVlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgbm9kZUhhc0NoaWxkcmVuID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBub2RlSGFzQ2hpbGRyZW46IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGZvcm1hdFBhdGggPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgIHBhdGggPSB1dGlsLnJlcGxhY2VBbGwocGF0aCwgXCIvXCIsIFwiIC8gXCIpO1xyXG4gICAgICAgIGxldCBzaG9ydFBhdGg6IHN0cmluZyA9IHBhdGgubGVuZ3RoIDwgNTAgPyBwYXRoIDogcGF0aC5zdWJzdHJpbmcoMCwgNDApICsgXCIuLi5cIjtcclxuXHJcbiAgICAgICAgbGV0IG5vUm9vdFBhdGg6IHN0cmluZyA9IHNob3J0UGF0aDtcclxuICAgICAgICBpZiAodXRpbC5zdGFydHNXaXRoKG5vUm9vdFBhdGgsIFwiL3Jvb3RcIikpIHtcclxuICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gc2hvcnRQYXRoIDogbm9Sb290UGF0aDtcclxuICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgd3JhcEh0bWwgPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIjxkaXY+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVuZGVycyBwYWdlIGFuZCBhbHdheXMgYWxzbyB0YWtlcyBjYXJlIG9mIHNjcm9sbGluZyB0byBzZWxlY3RlZCBub2RlIGlmIHRoZXJlIGlzIG9uZSB0byBzY3JvbGwgdG9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZW5kZXJQYWdlRnJvbURhdGEgPSBmdW5jdGlvbihkYXRhPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIHNjcm9sbFRvVG9wPzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpXCIpO1xyXG5cclxuICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICBkYXRhID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdEYXRhID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5hdi5lbmRSZWFjaGVkID0gZGF0YSAmJiBkYXRhLmVuZFJlYWNoZWQ7XHJcblxyXG4gICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5ub2RlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoXCJObyBjb250ZW50IGlzIGF2YWlsYWJsZSBoZXJlLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnVpZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICBtZXRhNjQuaWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkZW50VG9VaWRNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEknbSBjaG9vc2luZyB0byByZXNldCBzZWxlY3RlZCBub2RlcyB3aGVuIGEgbmV3IHBhZ2UgbG9hZHMsIGJ1dCB0aGlzIGlzIG5vdCBhIHJlcXVpcmVtZW50LiBJIGp1c3RcclxuICAgICAgICAgICAgICogZG9uJ3QgaGF2ZSBhIFwiY2xlYXIgc2VsZWN0aW9uc1wiIGZlYXR1cmUgd2hpY2ggd291bGQgYmUgbmVlZGVkIHNvIHVzZXIgaGFzIGEgd2F5IHRvIGNsZWFyIG91dC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKGRhdGEubm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcyA/IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA6IDA7XHJcblxyXG4gICAgICAgIGlmIChkZWJ1Zykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFTkRFUiBOT0RFOiBcIiArIGRhdGEubm9kZS5pZCArIFwiIHByb3BDb3VudD1cIiArIHByb3BDb3VudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUoZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOT1RFOiBtYWluTm9kZUNvbnRlbnQgaXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYWdlIGNvbnRlbnQsIGFuZCBpcyBhbHdheXMgdGhlIG5vZGUgZGlzcGxheWVkIGF0IHRoZSB0b1xyXG4gICAgICAgICAqIG9mIHRoZSBwYWdlIGFib3ZlIGFsbCB0aGUgb3RoZXIgbm9kZXMgd2hpY2ggYXJlIGl0cyBjaGlsZCBub2Rlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgbWFpbk5vZGVDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKG1haW5Ob2RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXI6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZE5vZGUoZGF0YS5ub2RlKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYGVkaXQucmVwbHlUb0NvbW1lbnQoJyR7ZGF0YS5ub2RlLnVpZH0nKTtgIC8vXHJcbiAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmUtYWx0XCIsIC8vaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYGVkaXQuY3JlYXRlU3ViTm9kZSgnJHt1aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIEFkZCBlZGl0IGJ1dHRvbiBpZiBlZGl0IG1vZGUgYW5kIHRoaXMgaXNuJ3QgdGhlIHJvb3QgKi9cclxuICAgICAgICAgICAgaWYgKGVkaXQuaXNFZGl0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBlZGl0LnJ1bkVkaXROb2RlKCcke3VpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZDtcclxuICAgICAgICAgICAgLy8gdmFyIHJvd0hlYWRlciA9IGJ1aWxkUm93SGVhZGVyKGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gbWFrZUhvcml6b250YWxGaWVsZFNldChjcmVhdGVTdWJOb2RlQnV0dG9uICsgZWRpdE5vZGVCdXR0b24gKyByZXBseUJ1dHRvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoc2VsZWN0ZWQgPyBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGFjdGl2ZS1yb3dcIiA6IFwibWFpbk5vZGVDb250ZW50U3R5bGUgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBuYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJyR7dWlkfScpO2AsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgIC8vJChcImFcIikuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTsgPC0tLS0gdGhpcyBkb2Vzbid0IHdvcmsuXHJcbiAgICAgICAgICAgIC8vICQoJyNtYWluTm9kZUNvbnRlbnQnKS5maW5kKFwiYVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZSBzdGF0dXMgYmFyLlwiKTtcclxuICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICBpZiAobmF2Lm1haW5PZmZzZXQgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBmaXJzdEJ1dHRvbjogc3RyaW5nID0gbWFrZUJ1dHRvbihcIkZpcnN0IFBhZ2VcIiwgXCJmaXJzdFBhZ2VCdXR0b25cIiwgZmlyc3RQYWdlKTtcclxuICAgICAgICAgICAgbGV0IHByZXZCdXR0b246IHN0cmluZyA9IG1ha2VCdXR0b24oXCJQcmV2IFBhZ2VcIiwgXCJwcmV2UGFnZUJ1dHRvblwiLCBwcmV2UGFnZSk7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSBjZW50ZXJlZEJ1dHRvbkJhcihmaXJzdEJ1dHRvbiArIHByZXZCdXR0b24sIFwicGFnaW5nLWJ1dHRvbi1iYXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcm93Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkQ291bnQ6IG51bWJlciA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoaWxkQ291bnQ6IFwiICsgY2hpbGRDb3VudCk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb25cclxuICAgICAgICAgICAgICogdGhlIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGlmICghZWRpdC5ub2Rlc1RvTW92ZVNldFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3c6IHN0cmluZyA9IGdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICBpZiAocm93Q291bnQgPT0gMCAmJiAhbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dCA9IGdldEVtcHR5UGFnZVByb21wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEuZW5kUmVhY2hlZCkge1xyXG4gICAgICAgICAgICBsZXQgbmV4dEJ1dHRvbiA9IG1ha2VCdXR0b24oXCJOZXh0IFBhZ2VcIiwgXCJuZXh0UGFnZUJ1dHRvblwiLCBuZXh0UGFnZSk7XHJcbiAgICAgICAgICAgIGxldCBsYXN0QnV0dG9uID0gbWFrZUJ1dHRvbihcIkxhc3QgUGFnZVwiLCBcImxhc3RQYWdlQnV0dG9uXCIsIGxhc3RQYWdlKTtcclxuICAgICAgICAgICAgb3V0cHV0ICs9IGNlbnRlcmVkQnV0dG9uQmFyKG5leHRCdXR0b24gKyBsYXN0QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgb3V0cHV0KTtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5jb2RlRm9ybWF0RGlydHkpIHtcclxuICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVE9ETy0zOiBJbnN0ZWFkIG9mIGNhbGxpbmcgc2NyZWVuU2l6ZUNoYW5nZSBoZXJlIGltbWVkaWF0ZWx5LCBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gc2V0IHRoZSBpbWFnZSBzaXplc1xyXG4gICAgICAgICAqIGV4YWN0bHkgb24gdGhlIGF0dHJpYnV0ZXMgb2YgZWFjaCBpbWFnZSwgYXMgdGhlIEhUTUwgdGV4dCBpcyByZW5kZXJlZCBiZWZvcmUgd2UgZXZlbiBjYWxsXHJcbiAgICAgICAgICogc2V0SHRtbCwgc28gdGhhdCBpbWFnZXMgYWx3YXlzIGFyZSBHVUFSQU5URUVEIHRvIHJlbmRlciBjb3JyZWN0bHkgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWV0YTY0LnNjcmVlblNpemVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgaWYgKHNjcm9sbFRvVG9wIHx8ICFtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCkpIHtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBmaXJzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkZpcnN0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICB2aWV3LmZpcnN0UGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcHJldlBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlByZXYgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgIHZpZXcucHJldlBhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXh0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICB2aWV3Lm5leHRQYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBsYXN0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTGFzdCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgdmlldy5sYXN0UGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZ2VuZXJhdGVSb3cgPSBmdW5jdGlvbihpOiBudW1iZXIsIG5vZGU6IGpzb24uTm9kZUluZm8sIG5ld0RhdGE6IGJvb2xlYW4sIGNoaWxkQ291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIFJFTkRFUiBST1dbXCIgKyBpICsgXCJdOiBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd0NvdW50Kys7IC8vIHdhcm5pbmc6IHRoaXMgaXMgdGhlIGxvY2FsIHZhcmlhYmxlL3BhcmFtZXRlclxyXG4gICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3dbXCIgKyByb3dDb3VudCArIFwiXT1cIiArIHJvdyk7XHJcbiAgICAgICAgcmV0dXJuIHJvdztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGdldFVybEZvck5vZGVBdHRhY2htZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHBvc3RUYXJnZXRVcmwgKyBcImJpbi9maWxlLW5hbWU/bm9kZUlkPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG5vZGUucGF0aCkgKyBcIiZ2ZXI9XCIgKyBub2RlLmJpblZlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKiBzZWUgYWxzbzogbWFrZUltYWdlVGFnKCkgKi9cclxuICAgIGV4cG9ydCBsZXQgYWRqdXN0SW1hZ2VTaXplID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHZvaWQge1xyXG5cclxuICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gZWxtLmF0dHIoXCJ3aWR0aFwiKTtcclxuICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndpZHRoPVwiICsgd2lkdGggKyBcIiBoZWlnaHQ9XCIgKyBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogTmV3IExvZ2ljIGlzIHRyeSB0byBkaXNwbGF5IGltYWdlIGF0IDE1MCUgbWVhbmluZyBpdCBjYW4gZ28gb3V0c2lkZSB0aGUgY29udGVudCBkaXYgaXQncyBpbixcclxuICAgICAgICAgICAgICAgICAqIHdoaWNoIHdlIHdhbnQsIGJ1dCB0aGVuIHdlIGFsc28gbGltaXQgaXQgd2l0aCBtYXgtd2lkdGggc28gb24gc21hbGxlciBzY3JlZW4gZGV2aWNlcyBvciBzbWFsbFxyXG4gICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICogY2xpcHBlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTUwJVwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBETyBOT1QgREVMRVRFIChmb3IgYSBsb25nIHRpbWUgYXQgbGVhc3QpIFRoaXMgaXMgdGhlIG9sZCBsb2dpYyBmb3IgcmVzaXppbmcgaW1hZ2VzIHJlc3BvbnNpdmVseSxcclxuICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgKiBrZWVwIHRoaXMgb2xkIGNvZGUgZm9yIG5vdy4uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICBleHBvcnQgbGV0IG1ha2VJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICBsZXQgc3JjOiBzdHJpbmcgPSBnZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKTtcclxuICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFllcywgaXQgd291bGQgaGF2ZSBiZWVuIHNpbXBsZXIgdG8ganVzdCB1c2Ugc29tZXRoaW5nIGxpa2Ugd2lkdGg9MTAwJSBmb3IgdGhlIGltYWdlIHdpZHRoIGJ1dCB0aGVuXHJcbiAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgKiB0aGUgZWZmZWN0aXZlIHNjcm9sbCBwb3NpdGlvbiBvZiBlYWNoIHJvdyB3aWxsIGJlIGluY3JlYXNpbmcgZWFjaCB0aW1lIHRoZSBVUkwgcmVxdWVzdCBmb3IgYSBuZXdcclxuICAgICAgICAgICAgICogaW1hZ2UgY29tcGxldGVzLiBXaGF0IHdlIHdhbnQgaXMgdG8gaGF2ZSBpdCBzbyB0aGF0IG9uY2Ugd2Ugc2V0IHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gc2Nyb2xsIGFcclxuICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAqIGluIGFzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogd2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogbm9kZS53aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogY3JlYXRlcyBIVE1MIHRhZyB3aXRoIGFsbCBhdHRyaWJ1dGVzL3ZhbHVlcyBzcGVjaWZpZWQgaW4gYXR0cmlidXRlcyBvYmplY3QsIGFuZCBjbG9zZXMgdGhlIHRhZyBhbHNvIGlmXHJcbiAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdGFnID0gZnVuY3Rpb24odGFnOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBPYmplY3QsIGNvbnRlbnQ/OiBzdHJpbmcsIGNsb3NlVGFnPzogYm9vbGVhbik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgIGlmICh0eXBlb2YgKGNsb3NlVGFnKSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIGNsb3NlVGFnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8XCIgKyB0YWc7XHJcblxyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gU3RyaW5nKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiB3ZSBpbnRlbGxpZ2VudGx5IHdyYXAgc3RyaW5ncyB0aGF0IGNvbnRhaW4gc2luZ2xlIHF1b3RlcyBpbiBkb3VibGUgcXVvdGVzIGFuZCB2aWNlIHZlcnNhXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWwuY29udGFpbnModiwgXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0ICs9IGsgKyBcIj1cXFwiXCIgKyB2ICsgXCJcXFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gYCR7a309XCIke3Z9XCIgYDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JldCArPSBrICsgXCI9J1wiICsgdiArIFwiJyBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGAke2t9PScke3Z9JyBgO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGsgKyBcIiBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3JldCArPSBcIj5cIiArIGNvbnRlbnQgKyBcIjwvXCIgKyB0YWcgKyBcIj5cIjtcclxuICAgICAgICAgICAgcmV0ICs9IGA+JHtjb250ZW50fTwvJHt0YWd9PmA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0ICs9IFwiLz5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlVGV4dEFyZWEgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFrZUVkaXRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlUGFzc3dvcmRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IGF0dHJpYnMgPSB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBhbGxvd1Byb3BlcnR5VG9EaXNwbGF5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdFtwcm9wTmFtZV0gPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGlzUmVhZE9ubHlQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGlzQmluYXJ5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2FuaXRpemVQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBcInNpbXBsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSBzcmNoIHtcclxuICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZWFyY2hOb2RlczogYW55ID0gbnVsbDtcclxuICAgIGV4cG9ydCBsZXQgc2VhcmNoUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlNlYXJjaCBSZXN1bHRzXCI7XHJcbiAgICBleHBvcnQgbGV0IHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZWFyY2hPZmZzZXQgPSAwO1xyXG4gICAgZXhwb3J0IGxldCB0aW1lbGluZU9mZnNldCA9IDA7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHNlYXJjaCBoYXMgYmVlbiBkb25lLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHNlYXJjaFJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdGltZWxpbmVSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBXaWxsIGJlIHRoZSBsYXN0IHJvdyBjbGlja2VkIG9uIChOb2RlSW5mby5qYXZhIG9iamVjdCkgYW5kIGhhdmluZyB0aGUgcmVkIGhpZ2hsaWdodCBiYXJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGlkZW50VG9VaWRNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byB0aGUgTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgIGV4cG9ydCBsZXQgbnVtU2VhcmNoUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCAhPSBudWxsID8gLy9cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNlYXJjaFRhYkFjdGl2YXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgYSBsb2dnZWQgaW4gdXNlciBjbGlja3MgdGhlIHNlYXJjaCB0YWIsIGFuZCBubyBzZWFyY2ggcmVzdWx0cyBhcmUgY3VycmVudGx5IGRpc3BsYXlpbmcsIHRoZW4gZ28gYWhlYWRcclxuICAgICAgICAgKiBhbmQgb3BlbiB1cCB0aGUgc2VhcmNoIGRpYWxvZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAobnVtU2VhcmNoUmVzdWx0cygpID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIChuZXcgU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgIGxldCBzZWFyY2hSZXN1bHRzUGFuZWwgPSBuZXcgU2VhcmNoUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBzZWFyY2hSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgc2VhcmNoUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZShzZWFyY2hSZXN1bHRzUGFuZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgdGltZWxpbmVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICB0aW1lbGluZVJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbChcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZSh0aW1lbGluZVJlc3VsdHNQYW5lbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHJlcy5zZWFyY2hSZXN1bHROb2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICBcIm9mZnNldFwiOiAwLFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHRpbWVsaW5lQnlNb2RUaW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gJ3RpbWVsaW5lJyB1bmRlci5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiREVTQ1wiLFxyXG4gICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBudWxsXHJcbiAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5DUkVBVEVELFxyXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5pdFNlYXJjaE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgbm9kZS51aWQgPSB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpO1xyXG4gICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZSA9IGZ1bmN0aW9uKGRhdGEsIHZpZXdOYW1lKSB7XHJcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgIHZhciBjaGlsZENvdW50ID0gZGF0YS5zZWFyY2hSZXN1bHRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAqIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaW5pdFNlYXJjaE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbCh2aWV3TmFtZSwgb3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVuZGVycyBhIHNpbmdsZSBsaW5lIG9mIHNlYXJjaCByZXN1bHRzIG9uIHRoZSBzZWFyY2ggcmVzdWx0cyBwYWdlLlxyXG4gICAgICpcclxuICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkge1xyXG5cclxuICAgICAgICB2YXIgdWlkID0gbm9kZS51aWQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJTZWFyY2hSZXN1bHQ6IFwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSB3aXRoIGlkOiBcIiArY3NzSWQpXHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXJIdG1sID0gbWFrZUJ1dHRvbkJhckh0bWwoXCJcIiArIHVpZCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBzcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJyR7dWlkfScpO2AsIC8vXHJcbiAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgIGJ1dHRvbkJhckh0bWwvL1xyXG4gICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9zcmNoX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKHVpZCkge1xyXG4gICAgICAgIHZhciBnb3RvQnV0dG9uID0gcmVuZGVyLm1ha2VCdXR0b24oXCJHbyB0byBOb2RlXCIsIHVpZCwgYHNyY2guY2xpY2tTZWFyY2hOb2RlKCcke3VpZH0nKTtgKTtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoZ290b0J1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBjbGlja09uU2VhcmNoUmVzdWx0Um93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpIHtcclxuICAgICAgICB1bmhpZ2hsaWdodFJvdygpO1xyXG4gICAgICAgIGhpZ2hsaWdodFJvd05vZGUgPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuXHJcbiAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2xpY2tTZWFyY2hOb2RlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVwZGF0ZSBoaWdobGlnaHQgbm9kZSB0byBwb2ludCB0byB0aGUgbm9kZSBjbGlja2VkIG9uLCBqdXN0IHRvIHBlcnNpc3QgaXQgZm9yIGxhdGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIXNyY2guaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIHVpZCBpbiBzZWFyY2ggcmVzdWx0czogXCIgKyB1aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCwgdHJ1ZSwgc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkKTtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBzdHlsaW5nIG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCB1bmhpZ2hsaWdodFJvdyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZiAoIWhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgIHZhciBub2RlSWQgPSBoaWdobGlnaHRSb3dOb2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG5cclxuICAgICAgICB2YXIgZWxtID0gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgIC8qIGNoYW5nZSBjbGFzcyBvbiBlbGVtZW50ICovXHJcbiAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubmFtZXNwYWNlIHNoYXJlIHtcclxuXHJcbiAgICBsZXQgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZShyZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2hhcmluZ05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIYW5kbGVzICdTaGFyaW5nJyBidXR0b24gb24gYSBzcGVjaWZpYyBub2RlLCBmcm9tIGJ1dHRvbiBiYXIgYWJvdmUgbm9kZSBkaXNwbGF5IGluIGVkaXQgbW9kZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGVkaXROb2RlU2hhcmluZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFyaW5nTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGZpbmRTaGFyZWROb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2hhcmVkTm9kZXNSZXF1ZXN0LCBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2U+KFwiZ2V0U2hhcmVkTm9kZXNcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBmb2N1c05vZGUuaWRcclxuICAgICAgICB9LCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxubmFtZXNwYWNlIHVzZXIge1xyXG5cclxuICAgIGxldCBsb2dvdXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZm9yIHRlc3RpbmcgcHVycG9zZXMsIEkgd2FudCB0byBhbGxvdyBjZXJ0YWluIHVzZXJzIGFkZGl0aW9uYWwgcHJpdmlsZWdlcy4gQSBiaXQgb2YgYSBoYWNrIGJlY2F1c2UgaXQgd2lsbCBnb1xyXG4gICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgKiB1c2UgdGhlc2UgbmFtZXNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBpc1Rlc3RVc2VyQWNjb3VudCA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhZGFtXCIgfHwgLy9cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYm9iXCIgfHwgLy9cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRhblwiO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMpOiB2b2lkIHtcclxuICAgICAgICB2YXIgdGl0bGUgPSBCUkFORElOR19USVRMRV9TSE9SVDtcclxuXHJcbiAgICAgICAgLyogdG9kby0wOiBJZiB1c2VycyBnbyB3aXRoIHZlcnkgbG9uZyB1c2VybmFtZXMgdGhpcyBpcyBnb25uYSBiZSB1Z2x5ICovXHJcbiAgICAgICAgaWYgKCFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICB0aXRsZSArPSBcIjpcIiArIHJlcy51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBUT0RPLTM6IG1vdmUgdGhpcyBpbnRvIG1ldGE2NCBtb2R1bGUgKi9cclxuICAgIGV4cG9ydCBsZXQgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBpZiAocmVzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZUlkID0gcmVzLnJvb3ROb2RlLmlkO1xyXG4gICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGE2NC51c2VyTmFtZSA9IHJlcy51c2VyTmFtZTtcclxuICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuICAgICAgICBtZXRhNjQuaXNBbm9uVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGUgPSByZXMuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgbWV0YTY0LmFsbG93RmlsZVN5c3RlbVNlYXJjaCA9IHJlcy5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2g7XHJcblxyXG4gICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMgPSByZXMudXNlclByZWZlcmVuY2VzO1xyXG4gICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHJlcy51c2VyUHJlZmVyZW5jZXMuYWR2YW5jZWRNb2RlID8gbWV0YTY0Lk1PREVfQURWQU5DRUQgOiBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHJlcy51c2VyUHJlZmVyZW5jZXMuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gc2VydmVyOiBtZXRhNjQuZWRpdE1vZGVPcHRpb249XCIgKyBtZXRhNjQuZWRpdE1vZGVPcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgb3BlblNpZ251cFBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgKG5ldyBTaWdudXBEbGcoKSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFdyaXRlIGEgY29va2llIHRoYXQgZXhwaXJlcyBpbiBhIHllYXIgZm9yIGFsbCBwYXRocyAqL1xyXG4gICAgZXhwb3J0IGxldCB3cml0ZUNvb2tpZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbCk6IHZvaWQge1xyXG4gICAgICAgICQuY29va2llKG5hbWUsIHZhbCwge1xyXG4gICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1Z2x5LiBJdCBpcyB0aGUgYnV0dG9uIHRoYXQgY2FuIGJlIGxvZ2luICpvciogbG9nb3V0LlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IG9wZW5Mb2dpblBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxvZ2luRGxnOiBMb2dpbkRsZyA9IG5ldyBMb2dpbkRsZygpO1xyXG4gICAgICAgIGxvZ2luRGxnLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcclxuICAgICAgICBsb2dpbkRsZy5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCByZWZyZXNoTG9naW4gPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG5cclxuICAgICAgICBsZXQgY2FsbFVzcjogc3RyaW5nO1xyXG4gICAgICAgIGxldCBjYWxsUHdkOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IHVzaW5nQ29va2llczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgbG9naW5TZXNzaW9uUmVhZHkgPSAkKFwiI2xvZ2luU2Vzc2lvblJlYWR5XCIpLnRleHQoKTtcclxuICAgICAgICBpZiAobG9naW5TZXNzaW9uUmVhZHkgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gdHJ1ZVwiKTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdXNpbmcgYmxhbmsgY3JlZGVudGlhbHMgd2lsbCBjYXVzZSBzZXJ2ZXIgdG8gbG9vayBmb3IgYSB2YWxpZCBzZXNzaW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjYWxsVXNyID0gXCJcIjtcclxuICAgICAgICAgICAgY2FsbFB3ZCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHVzaW5nQ29va2llcyA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSBmYWxzZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsb2dpblN0YXRlOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIGtub3duIHN0YXRlIGFzIGxvZ2dlZCBvdXQsIHRoZW4gZG8gbm90aGluZyBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNyOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICBsZXQgcHdkOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG5cclxuICAgICAgICAgICAgdXNpbmdDb29raWVzID0gIXV0aWwuZW1wdHlTdHJpbmcodXNyKSAmJiAhdXRpbC5lbXB0eVN0cmluZyhwd2QpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvb2tpZVVzZXI9XCIgKyB1c3IgKyBcIiB1c2luZ0Nvb2tpZXMgPSBcIiArIHVzaW5nQ29va2llcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBlbXB5dCBjcmVkZW50aWFscyBjYXVzZXMgc2VydmVyIHRvIHRyeSB0byBsb2cgaW4gd2l0aCBhbnkgYWN0aXZlIHNlc3Npb24gY3JlZGVudGlhbHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjYWxsVXNyID0gdXNyID8gdXNyIDogXCJcIjtcclxuICAgICAgICAgICAgY2FsbFB3ZCA9IHB3ZCA/IHB3ZCA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbiB3aXRoIG5hbWU6IFwiICsgY2FsbFVzcik7XHJcblxyXG4gICAgICAgIGlmICghY2FsbFVzcikge1xyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiBjYWxsVXNyLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBjYWxsUHdkLFxyXG4gICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgY2FsbFVzciwgY2FsbFB3ZCwgdXNpbmdDb29raWVzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaExvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbG9nb3V0ID0gZnVuY3Rpb24odXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgIGlmICh1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dvdXRSZXF1ZXN0LCBqc29uLkxvZ291dFJlc3BvbnNlPihcImxvZ291dFwiLCB7fSwgbG9nb3V0UmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbG9naW4gPSBmdW5jdGlvbihsb2dpbkRsZywgdXNyLCBwd2QpIHtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNyLFxyXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IHB3ZCxcclxuICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGxvZ2luUmVzcG9uc2UocmVzLCB1c3IsIHB3ZCwgbnVsbCwgbG9naW5EbGcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgZGVsZXRlQWxsVXNlckNvb2tpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uTG9naW5SZXNwb25zZSwgdXNyPzogc3RyaW5nLCBwd2Q/OiBzdHJpbmcsIHVzaW5nQ29va2llcz86IGJvb2xlYW4sIGxvZ2luRGxnPzogTG9naW5EbGcpIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJMb2dpblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW5SZXNwb25zZTogdXNyPVwiICsgdXNyICsgXCIgaG9tZU5vZGVPdmVycmlkZTogXCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNyICE9IFwiYW5vbnltb3VzXCIpIHtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUiwgdXNyKTtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCwgcHdkKTtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjFcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsb2dpbkRsZykge1xyXG4gICAgICAgICAgICAgICAgbG9naW5EbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGU6IFwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlIGlzIG51bGwuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBzZXQgSUQgdG8gYmUgdGhlIHBhZ2Ugd2Ugd2FudCB0byBzaG93IHVzZXIgcmlnaHQgYWZ0ZXIgbG9naW4gKi9cclxuICAgICAgICAgICAgbGV0IGlkOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1dGlsLmVtcHR5U3RyaW5nKHJlcy5ob21lTm9kZU92ZXJyaWRlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUgPSBpZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGxhc3ROb2RlPVwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVJZD1cIiArIG1ldGE2NC5ob21lTm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKGlkLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiQ29va2llIGxvZ2luIGZhaWxlZC5cIikpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogYmxvdyBhd2F5IGZhaWxlZCBjb29raWUgY3JlZGVudGlhbHMgYW5kIHJlbG9hZCBwYWdlLCBzaG91bGQgcmVzdWx0IGluIGJyYW5kIG5ldyBwYWdlIGxvYWQgYXMgYW5vblxyXG4gICAgICAgICAgICAgICAgICogdXNlci5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVzIGlzIEpTT04gcmVzcG9uc2Ugb2JqZWN0IGZyb20gc2VydmVyLlxyXG4gICAgbGV0IHJlZnJlc2hMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgdXNlci5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcbm5hbWVzcGFjZSB2aWV3IHtcclxuXHJcbiAgICBleHBvcnQgbGV0IHNjcm9sbFRvU2VsTm9kZVBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBleHBvcnQgbGV0IHVwZGF0ZVN0YXR1c0JhciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzdGF0dXNMaW5lID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQpIHtcclxuICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcImNvdW50OiBcIiArIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcIiBTZWxlY3Rpb25zOiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIgd2hpY2gsIGlmIHN1cHBsaWVkLCBzaG91bGQgYmUgdGhlIGlkIHdlIHNjcm9sbCB0byB3aGVuIGZpbmFsbHkgZG9uZSB3aXRoIHRoZVxyXG4gICAgICogcmVuZGVyLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgdGFyZ2V0SWQ/OiBhbnksIHNjcm9sbFRvVG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLCBzY3JvbGxUb1RvcCk7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxUb1RvcCkge1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjbWFpbk5vZGVDb250ZW50XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBhbmQgaWYgc3BlY2lmaWVkIG1ha2VzIHRoZSBwYWdlIHNjcm9sbCB0byBhbmQgaGlnaGxpZ2h0IHRoYXQgbm9kZSB1cG9uIHJlLXJlbmRlcmluZy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZSA9IGZ1bmN0aW9uKG5vZGVJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBoaWdobGlnaHRJZD86IGFueSwgaXNJbml0aWFsUmVuZGVyPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgIG5vZGVJZCA9IG1ldGE2NC5jdXJyZW50Tm9kZUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKCFoaWdobGlnaHRJZCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodElkID0gY3VycmVudFNlbE5vZGUgIT0gbnVsbCA/IGN1cnJlbnRTZWxOb2RlLmlkIDogbm9kZUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBJIGRvbid0IGtub3cgb2YgYW55IHJlYXNvbiAncmVmcmVzaFRyZWUnIHNob3VsZCBpdHNlbGYgcmVzZXQgdGhlIG9mZnNldCwgYnV0IEkgbGVhdmUgdGhpcyBjb21tZW50IGhlcmVcclxuICAgICAgICBhcyBhIGhpbnQgZm9yIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiByZW5kZXJQYXJlbnRJZkxlYWYgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgIFwib2Zmc2V0XCI6IG5hdi5tYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5vZmZzZXRPZk5vZGVGb3VuZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IHJlcy5vZmZzZXRPZk5vZGVGb3VuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWZyZXNoVHJlZVJlc3BvbnNlKHJlcywgaGlnaGxpZ2h0SWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlbmRlciAmJiBtZXRhNjQudXJsQ21kID09IFwiYWRkTm9kZVwiICYmIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0LmVkaXRNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG1ldGE2NC5jdXJyZW50Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBmaXJzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgZmlyc3RQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICBsb2FkUGFnZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBwcmV2UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBwcmV2UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICBuYXYubWFpbk9mZnNldCAtPSBuYXYuUk9XU19QRVJfUEFHRTtcclxuICAgICAgICBpZiAobmF2Lm1haW5PZmZzZXQgPCAwKSB7XHJcbiAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbmV4dFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgbmV4dFBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgbmF2Lm1haW5PZmZzZXQgKz0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgbG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgbGFzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgbGFzdFBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgLy9uYXYubWFpbk9mZnNldCArPSBuYXYuUk9XU19QRVJfUEFHRTtcclxuICAgICAgICBsb2FkUGFnZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbG9hZFBhZ2UgPSBmdW5jdGlvbihnb1RvTGFzdFBhZ2U6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogdHJ1ZSxcclxuICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGdvVG9MYXN0UGFnZVxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKGdvVG9MYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5vZmZzZXRPZk5vZGVGb3VuZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSByZXMub2Zmc2V0T2ZOb2RlRm91bmQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIG51bGwsIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0b2RvLTM6IHRoaXMgc2Nyb2xsaW5nIGlzIHNsaWdodGx5IGltcGVyZmVjdC4gc29tZXRpbWVzIHRoZSBjb2RlIHN3aXRjaGVzIHRvIGEgdGFiLCB3aGljaCB0cmlnZ2Vyc1xyXG4gICAgICogc2Nyb2xsVG9Ub3AsIGFuZCB0aGVuIHNvbWUgb3RoZXIgY29kZSBzY3JvbGxzIHRvIGEgc3BlY2lmaWMgbG9jYXRpb24gYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlci4gdGhlXHJcbiAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgKiBhbmQgdGhlbiBzY3JvbGxpbmcgdG8gYSBkaWZmZXJlbnQgcGxhY2UgYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlcilcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWxtOiBhbnkgPSBuYXYuZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGZpbmQgYSBzZWxlY3RlZCBub2RlIG9uIHRoaXMgcGFnZSwgc2Nyb2xsIHRvXHJcbiAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogcmVtb3ZlZCBtYWluUGFwZXJUYWJzIGZyb20gdmlzaWJpbGl0eSwgYnV0IHdoYXQgY29kZSBzaG91bGQgZ28gaGVyZSBub3c/XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHNjcm9sbFRvVG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy9sZXQgZSA9ICQoXCIjbWFpbkNvbnRhaW5lclwiKTtcclxuICAgICAgICAkKFwiI21haW5Db250YWluZXJcIikuc2Nyb2xsVG9wKDApO1xyXG5cclxuICAgICAgICAvL3RvZG8tMDogbm90IHVzaW5nIG1haW5QYXBlclRhYnMgYW55IGxvbmdlciBzbyBzaHcgc2hvdWxkIGdvIGhlcmUgbm93ID9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgJChcIiNtYWluQ29udGFpbmVyXCIpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluaXRFZGl0UGF0aERpc3BsYXlCeUlkID0gZnVuY3Rpb24oZG9tSWQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZWRpdC5lZGl0Tm9kZTtcclxuICAgICAgICBsZXQgZTogYW55ID0gJChcIiNcIiArIGRvbUlkKTtcclxuICAgICAgICBpZiAoIWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XHJcbiAgICAgICAgICAgIGUuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgZS5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBhdGhEaXNwbGF5ID0gXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gdG9kby0yOiBEbyB3ZSByZWFsbHkgbmVlZCBJRCBpbiBhZGRpdGlvbiB0byBQYXRoIGhlcmU/XHJcbiAgICAgICAgICAgIC8vIHBhdGhEaXNwbGF5ICs9IFwiPGJyPklEOiBcIiArIG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhdGhEaXNwbGF5ICs9IFwiPGJyPk1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLmh0bWwocGF0aERpc3BsYXkpO1xyXG4gICAgICAgICAgICBlLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBzaG93U2VydmVySW5mbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNlcnZlckluZm9SZXF1ZXN0LCBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZT4oXCJnZXRTZXJ2ZXJJbmZvXCIsIHt9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhyZXMuc2VydmVySW5mbykpLm9wZW4oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5uYW1lc3BhY2UgbWVudVBhbmVsIHtcclxuXHJcbiAgICBsZXQgbWFrZVRvcExldmVsTWVudSA9IGZ1bmN0aW9uKHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBwYXBlckl0ZW1BdHRycyA9IHtcclxuICAgICAgICAgICAgY2xhc3M6IFwibWVudS10cmlnZ2VyXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGFwZXJJdGVtID0gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwgcGFwZXJJdGVtQXR0cnMsIHRpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHBhcGVyU3VibWVudUF0dHJzID0ge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IHRpdGxlLFxyXG4gICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICAoPGFueT5wYXBlclN1Ym1lbnVBdHRycykuaWQgPSBpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItc3VibWVudVwiLCBwYXBlclN1Ym1lbnVBdHRyc1xyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy9cImxhYmVsXCI6IHRpdGxlLFxyXG4gICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZXRhNjQtbWVudS1oZWFkaW5nXCIsXHJcbiAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0XCJcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICwgcGFwZXJJdGVtICsgLy9cIjxwYXBlci1pdGVtIGNsYXNzPSdtZW51LXRyaWdnZXInPlwiICsgdGl0bGUgKyBcIjwvcGFwZXItaXRlbT5cIiArIC8vXHJcbiAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtYWtlU2Vjb25kTGV2ZWxMaXN0ID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibWVudS1jb250ZW50IHN1Ymxpc3QgbXktbWVudS1zZWN0aW9uXCIsXHJcbiAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgIC8vLFxyXG4gICAgICAgICAgICAvL1wibXVsdGlcIjogXCJtdWx0aVwiXHJcbiAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1lbnVJdGVtID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrLFxyXG4gICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkb21JZDogc3RyaW5nID0gXCJtYWluQXBwTWVudVwiO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gSSBlbmRlZCB1cCBub3QgcmVhbGx5IGxpa2luZyB0aGlzIHdheSBvZiBzZWxlY3RpbmcgdGFicy4gSSBjYW4ganVzdCB1c2Ugbm9ybWFsIHBvbHltZXIgdGFicy5cclxuICAgICAgICAvLyB2YXIgcGFnZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibWV0YTY0LnNlbGVjdFRhYignbWFpblRhYk5hbWUnKTtcIikgKyAvL1xyXG4gICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcInNlYXJjaFBhZ2VCdXR0b25cIiwgXCJtZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJUaW1lbGluZVwiLCBcInRpbWVsaW5lUGFnZUJ1dHRvblwiLCBcIm1ldGE2NC5zZWxlY3RUYWIoJ3RpbWVsaW5lVGFiTmFtZScpO1wiKTtcclxuICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHJzc0l0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJGZWVkc1wiLCBcIm1haW5NZW51UnNzXCIsIFwibmF2Lm9wZW5Sc3NGZWVkc05vZGUoKTtcIik7XHJcbiAgICAgICAgdmFyIG1haW5NZW51UnNzID0gbWFrZVRvcExldmVsTWVudShcIlJTU1wiLCByc3NJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBlZGl0TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVcIiwgXCJjcmVhdGVOb2RlQnV0dG9uXCIsIFwiZWRpdC5jcmVhdGVOb2RlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgXCIobmV3IFJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3V0XCIsIFwiY3V0U2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LmN1dFNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJQYXN0ZVwiLCBcInBhc3RlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LnBhc3RlU2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkNsZWFyIFNlbGVjdGlvbnNcIiwgXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgXCJlZGl0LmNsZWFyU2VsZWN0aW9ucygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiSW1wb3J0XCIsIFwib3BlbkltcG9ydERsZ1wiLCBcIihuZXcgSW1wb3J0RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IEV4cG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGVcIiwgXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCBcImVkaXQuZGVsZXRlU2VsTm9kZXMoKTtcIik7XHJcbiAgICAgICAgdmFyIGVkaXRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkVkaXRcIiwgZWRpdE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBtb3ZlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJVcFwiLCBcIm1vdmVOb2RlVXBCdXR0b25cIiwgXCJlZGl0Lm1vdmVOb2RlVXAoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIkRvd25cIiwgXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgXCJlZGl0Lm1vdmVOb2RlRG93bigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gVG9wXCIsIFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBcImVkaXQubW92ZU5vZGVUb1RvcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gQm90dG9tXCIsIFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBcImVkaXQubW92ZU5vZGVUb0JvdHRvbSgpO1wiKTsvL1xyXG4gICAgICAgIHZhciBtb3ZlTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJNb3ZlXCIsIG1vdmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgYXR0YWNobWVudE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gRmlsZVwiLCBcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsIFwiYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbUZpbGVEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgXCJhdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tVXJsRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGUgQXR0YWNobWVudFwiLCBcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsIFwiYXR0YWNobWVudC5kZWxldGVBdHRhY2htZW50KCk7XCIpO1xyXG4gICAgICAgIHZhciBhdHRhY2htZW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBdHRhY2hcIiwgYXR0YWNobWVudE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBzaGFyaW5nTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJFZGl0IE5vZGUgU2hhcmluZ1wiLCBcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCBcInNoYXJlLmVkaXROb2RlU2hhcmluZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiRmluZCBTaGFyZWQgU3Vibm9kZXNcIiwgXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgXCJzaGFyZS5maW5kU2hhcmVkTm9kZXMoKTtcIik7XHJcbiAgICAgICAgdmFyIHNoYXJpbmdNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNoYXJlXCIsIHNoYXJpbmdNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgc2VhcmNoTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJDb250ZW50XCIsIFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAvL3RvZG8tMDogbWFrZSBhIHZlcnNpb24gb2YgdGhlIGRpYWxvZyB0aGF0IGRvZXMgYSB0YWcgc2VhcmNoXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiVGFnc1wiLCBcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgU2VhcmNoVGFnc0RsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJGaWxlc1wiLCBcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IFNlYXJjaEZpbGVzRGxnKHRydWUpKS5vcGVuKCk7XCIpO1xyXG5cclxuICAgICAgICB2YXIgc2VhcmNoTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTZWFyY2hcIiwgc2VhcmNoTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbWVsaW5lTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVkXCIsIFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsIFwic3JjaC50aW1lbGluZUJ5Q3JlYXRlVGltZSgpO1wiKSArLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJNb2RpZmllZFwiLCBcInRpbWVsaW5lTW9kaWZpZWRCdXR0b25cIiwgXCJzcmNoLnRpbWVsaW5lQnlNb2RUaW1lKCk7XCIpOy8vXHJcbiAgICAgICAgdmFyIHRpbWVsaW5lTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJUaW1lbGluZVwiLCB0aW1lbGluZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiVG9nZ2xlIFByb3BlcnRpZXNcIiwgXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBcInByb3BzLnByb3BzVG9nZ2xlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJSZWZyZXNoXCIsIFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgXCJtZXRhNjQucmVmcmVzaCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiU2hvdyBVUkxcIiwgXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgXCJyZW5kZXIuc2hvd05vZGVVcmwoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICBtZW51SXRlbShcIlByZWZlcmVuY2VzXCIsIFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsIFwiKG5ldyBQcmVmc0RsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG4gICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVmlld1wiLCB2aWV3T3B0aW9uc01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIC8vIFdPUksgSU4gUFJPR1JFU1MgKCBkbyBub3QgZGVsZXRlKVxyXG4gICAgICAgIC8vIHZhciBmaWxlU3lzdGVtTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJSZWluZGV4XCIsIFwiZmlsZVN5c1JlaW5kZXhCdXR0b25cIiwgXCJzeXN0ZW1mb2xkZXIucmVpbmRleCgpO1wiKSArIC8vXHJcbiAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwiZmlsZVN5c1NlYXJjaEJ1dHRvblwiLCBcInN5c3RlbWZvbGRlci5zZWFyY2goKTtcIik7IC8vXHJcbiAgICAgICAgLy8gICAgIC8vbWVudUl0ZW0oXCJCcm93c2VcIiwgXCJmaWxlU3lzQnJvd3NlQnV0dG9uXCIsIFwic3lzdGVtZm9sZGVyLmJyb3dzZSgpO1wiKTtcclxuICAgICAgICAvLyB2YXIgZmlsZVN5c3RlbU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiRmlsZVN5c1wiLCBmaWxlU3lzdGVtTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBteUFjY291bnRJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgQ2hhbmdlUGFzc3dvcmREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFuYWdlIEFjY291bnRcIiwgXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsIFwiKG5ldyBNYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIik7IC8vXHJcblxyXG4gICAgICAgIC8vIG1lbnVJdGVtKFwiRnVsbCBSZXBvc2l0b3J5IEV4cG9ydFwiLCBcImZ1bGxSZXBvc2l0b3J5RXhwb3J0XCIsIFwiXHJcbiAgICAgICAgLy8gZWRpdC5mdWxsUmVwb3NpdG9yeUV4cG9ydCgpO1wiKSArIC8vXHJcbiAgICAgICAgdmFyIG15QWNjb3VudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQWNjb3VudFwiLCBteUFjY291bnRJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBhZG1pbkl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJHZW5lcmF0ZSBSU1NcIiwgXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBcInBvZGNhc3QuZ2VuZXJhdGVSU1MoKTtcIikgKy8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiU2VydmVyIEluZm9cIiwgXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBcInZpZXcuc2hvd1NlcnZlckluZm8oKTtcIikgKy8vXHJcbiAgICAgICAgICAgIG1lbnVJdGVtKFwiSW5zZXJ0IEJvb2s6IFdhciBhbmQgUGVhY2VcIiwgXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgXCJlZGl0Lmluc2VydEJvb2tXYXJBbmRQZWFjZSgpO1wiKTsgLy9cclxuICAgICAgICB2YXIgYWRtaW5NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFkbWluXCIsIGFkbWluSXRlbXMsIFwiYWRtaW5NZW51XCIpO1xyXG5cclxuICAgICAgICB2YXIgaGVscEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgbWVudUl0ZW0oXCJNYWluIE1lbnUgSGVscFwiLCBcIm1haW5NZW51SGVscFwiLCBcIm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgIHZhciBtYWluTWVudUhlbHAgPSBtYWtlVG9wTGV2ZWxNZW51KFwiSGVscC9Eb2NzXCIsIGhlbHBJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gLyogcGFnZU1lbnUrICovIG1haW5NZW51UnNzICsgZWRpdE1lbnUgKyBtb3ZlTWVudSArIGF0dGFjaG1lbnRNZW51ICsgc2hhcmluZ01lbnUgKyB2aWV3T3B0aW9uc01lbnUgLyogKyBmaWxlU3lzdGVtTWVudSAqLyArIHNlYXJjaE1lbnUgKyB0aW1lbGluZU1lbnUgKyBteUFjY291bnRNZW51XHJcbiAgICAgICAgICAgICsgYWRtaW5NZW51ICsgbWFpbk1lbnVIZWxwO1xyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWwoZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5pdCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgfVxyXG59XHJcblxuLypcbk5PVEU6IFRoZSBBdWRpb1BsYXllckRsZyBBTkQgdGhpcyBzaW5nbGV0b24taXNoIGNsYXNzIGJvdGggc2hhcmUgc29tZSBzdGF0ZSBhbmQgY29vcGVyYXRlXG5cblJlZmVyZW5jZTogaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxuKi9cbm5hbWVzcGFjZSBwb2RjYXN0IHtcbiAgICBleHBvcnQgbGV0IHBsYXllcjogYW55ID0gbnVsbDtcbiAgICBleHBvcnQgbGV0IHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlciA9IG51bGw7XG5cbiAgICBsZXQgdWlkOiBzdHJpbmcgPSBudWxsO1xuICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcbiAgICBsZXQgYWRTZWdtZW50czogQWRTZWdtZW50W10gPSBudWxsO1xuXG4gICAgbGV0IHB1c2hUaW1lcjogYW55ID0gbnVsbDtcblxuICAgIGV4cG9ydCBsZXQgZ2VuZXJhdGVSU1MgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdXRpbC5qc29uPGpzb24uR2VuZXJhdGVSU1NSZXF1ZXN0LCBqc29uLkdlbmVyYXRlUlNTUmVzcG9uc2U+KFwiZ2VuZXJhdGVSU1NcIiwge1xuICAgICAgICB9LCBnZW5lcmF0ZVJTU1Jlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBsZXQgZ2VuZXJhdGVSU1NSZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBhbGVydCgncnNzIGNvbXBsZXRlLicpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVuZGVyRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgbGV0IHRpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgIGxldCBkZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkRGVzY1wiLCBub2RlKTtcbiAgICAgICAgbGV0IGltZ1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCIsIG5vZGUpO1xuXG4gICAgICAgIGxldCBmZWVkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcImgyXCIsIHtcbiAgICAgICAgICAgIH0sIHRpdGxlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICB9LCBkZXNjLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgIH0sIGZlZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmVlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1nVXJsKSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImltZ1wiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1heC13aWR0aDogMjAwcHg7XCIsXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogaW1nVXJsLnZhbHVlXG4gICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xuICAgICAgICBsZXQgbGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgIGlmIChsaW5rICYmIGxpbmsudmFsdWUgJiYgdXRpbC5jb250YWlucyhsaW5rLnZhbHVlLnRvTG93ZXJDYXNlKCksIFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmsudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuICAgICAgICBpZiAodXJpICYmIHVyaS52YWx1ZSAmJiB1dGlsLmNvbnRhaW5zKHVyaS52YWx1ZS50b0xvd2VyQ2FzZSgpLCBcIi5tcDNcIikpIHtcbiAgICAgICAgICAgIHJldHVybiB1cmkudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW5jVXJsOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRW5jVXJsXCIsIG5vZGUpO1xuICAgICAgICBpZiAoZW5jVXJsICYmIGVuY1VybC52YWx1ZSkge1xuICAgICAgICAgICAgbGV0IGVuY1R5cGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1FbmNUeXBlXCIsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKGVuY1R5cGUgJiYgZW5jVHlwZS52YWx1ZSAmJiB1dGlsLnN0YXJ0c1dpdGgoZW5jVHlwZS52YWx1ZSwgXCJhdWRpby9cIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jVXJsLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCByZW5kZXJJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBsZXQgcnNzVGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLCBub2RlKTtcbiAgICAgICAgbGV0IHJzc0Rlc2M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1EZXNjXCIsIG5vZGUpO1xuICAgICAgICBsZXQgcnNzQXV0aG9yOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCIsIG5vZGUpO1xuICAgICAgICBsZXQgcnNzTGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgIGxldCByc3NVcmk6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1VcmlcIiwgbm9kZSk7XG5cbiAgICAgICAgbGV0IGVudHJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGlmIChyc3NMaW5rICYmIHJzc0xpbmsudmFsdWUgJiYgcnNzVGl0bGUgJiYgcnNzVGl0bGUudmFsdWUpIHtcbiAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICBcImhyZWZcIjogcnNzTGluay52YWx1ZVxuICAgICAgICAgICAgfSwgcmVuZGVyLnRhZyhcImgzXCIsIHt9LCByc3NUaXRsZS52YWx1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBsYXllclVybCA9IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUobm9kZSk7XG4gICAgICAgIGlmIChwbGF5ZXJVcmwpIHtcbiAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwicG9kY2FzdC5vcGVuUGxheWVyRGlhbG9nKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIlBsYXlcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocnNzRGVzYyAmJiByc3NEZXNjLnZhbHVlKSB7XG4gICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICB9LCByc3NEZXNjLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyc3NBdXRob3IgJiYgcnNzQXV0aG9yLnZhbHVlKSB7XG4gICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIH0sIFwiQnk6IFwiICsgcnNzQXV0aG9yLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgIH0sIGVudHJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVudHJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRUaXRsZVwiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZERlc2NcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRMaW5rXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVXJpXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkU3JjXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0l0ZW1Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsXG4gICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLFxuICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1VcmlcIixcbiAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1BdXRob3JcIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IG9wZW5QbGF5ZXJEaWFsb2cgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgdWlkID0gX3VpZDtcbiAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcblxuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbGV0IG1wM1VybCA9IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICBpZiAobXAzVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0UGxheWVySW5mb1JlcXVlc3QsIGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlPihcImdldFBsYXllckluZm9cIiwge1xuICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBtcDNVcmxcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VWlkKHVpZCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkbGcgPSBuZXcgQXVkaW9QbGF5ZXJEbGcobXAzVXJsLCB1aWQsIHJlcy50aW1lT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgZGxnLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwYXJzZUFkU2VnbWVudFVpZCA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbGV0IGFkU2VnczoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJhZC1zZWdtZW50c1wiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChhZFNlZ3MpIHtcbiAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFRleHQoYWRTZWdzLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZSB1aWQ6IFwiICsgdWlkO1xuICAgIH1cblxuICAgIGxldCBwYXJzZUFkU2VnbWVudFRleHQgPSBmdW5jdGlvbihhZFNlZ3M6IHN0cmluZykge1xuICAgICAgICBhZFNlZ21lbnRzID0gW107XG5cbiAgICAgICAgbGV0IHNlZ0xpc3Q6IHN0cmluZ1tdID0gYWRTZWdzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICBmb3IgKGxldCBzZWcgb2Ygc2VnTGlzdCkge1xuICAgICAgICAgICAgbGV0IHNlZ1RpbWVzOiBzdHJpbmdbXSA9IHNlZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBpZiAoc2VnVGltZXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSByYW5nZTogXCIgKyBzZWcpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmVnaW5TZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzBdKTtcbiAgICAgICAgICAgIGxldCBlbmRTZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzFdKTtcblxuICAgICAgICAgICAgYWRTZWdtZW50cy5wdXNoKG5ldyBBZFNlZ21lbnQoYmVnaW5TZWNzLCBlbmRTZWNzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBjb252ZXJ0IGZyb20gZm9tcmF0IFwibWludXRlczpzZWNvbnRzXCIgdG8gYWJzb2x1dGUgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAqXG4gICAgKiB0b2RvLTA6IG1ha2UgdGhpcyBhY2NlcHQganVzdCBzZWNvbmRzLCBvciBtaW46c2VjLCBvciBob3VyOm1pbjpzZWMsIGFuZCBiZSBhYmxlIHRvXG4gICAgKiBwYXJzZSBhbnkgb2YgdGhlbSBjb3JyZWN0bHkuXG4gICAgKi9cbiAgICBsZXQgY29udmVydFRvU2Vjb25kcyA9IGZ1bmN0aW9uKHRpbWVWYWw6IHN0cmluZykge1xuICAgICAgICAvKiBlbmQgdGltZSBpcyBkZXNpZ25hdGVkIHdpdGggYXN0ZXJpc2sgYnkgdXNlciwgYW5kIHJlcHJlc2VudGVkIGJ5IC0xIGluIHZhcmlhYmxlcyAqL1xuICAgICAgICBpZiAodGltZVZhbCA9PSAnKicpIHJldHVybiAtMTtcbiAgICAgICAgbGV0IHRpbWVQYXJ0czogc3RyaW5nW10gPSB0aW1lVmFsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgaWYgKHRpbWVQYXJ0cy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgdmFsdWU6IFwiICsgdGltZVZhbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1pbnV0ZXMgPSBuZXcgTnVtYmVyKHRpbWVQYXJ0c1swXSkudmFsdWVPZigpO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzFdKS52YWx1ZU9mKCk7XG4gICAgICAgIHJldHVybiBtaW51dGVzICogNjAgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVzdG9yZVN0YXJ0VGltZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKiBtYWtlcyBwbGF5ZXIgYWx3YXlzIHN0YXJ0IHdoZXJldmVyIHRoZSB1c2VyIGxhc3Qgd2FzIHdoZW4gdGhleSBjbGlja2VkIFwicGF1c2VcIiAqL1xuICAgICAgICBpZiAocGxheWVyICYmIHN0YXJ0VGltZVBlbmRpbmcpIHtcbiAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHN0YXJ0VGltZVBlbmRpbmc7XG4gICAgICAgICAgICBzdGFydFRpbWVQZW5kaW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgb25DYW5QbGF5ID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgIHBsYXllciA9IGVsbTtcbiAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgb25UaW1lVXBkYXRlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICghcHVzaFRpbWVyKSB7XG4gICAgICAgICAgICAvKiBwaW5nIHNlcnZlciBvbmNlIGV2ZXJ5IGZpdmUgbWludXRlcyAqL1xuICAgICAgICAgICAgcHVzaFRpbWVyID0gc2V0SW50ZXJ2YWwocHVzaFRpbWVyRnVuY3Rpb24sIDUgKiA2MCAqIDEwMDApO1xuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJDdXJyZW50VGltZT1cIiArIGVsbS5jdXJyZW50VGltZSk7XG4gICAgICAgIHBsYXllciA9IGVsbTtcblxuICAgICAgICAvKiB0b2RvLTE6IHdlIGNhbGwgcmVzdG9yZVN0YXJ0VGltZSB1cG9uIGxvYWRpbmcgb2YgdGhlIGNvbXBvbmVudCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGhhdmUgdGhlIGVmZmVjdCBkb2luZyBhbnl0aGluZyBhdCBhbGxcbiAgICAgICAgYW5kIGNhbid0IGV2ZW4gdXBkYXRlIHRoZSBzbGlkZXIgZGlzcGxheWVkIHBvc2l0aW9uLCB1bnRpbCBwbGF5aW5zIGlzIFNUQVJURUQuIE5lZWQgdG8gY29tZSBiYWNrIGFuZCBmaXggdGhpcyBiZWNhdXNlIHVzZXJzXG4gICAgICAgIGN1cnJlbnRseSBoYXZlIHRoZSBnbGl0Y2ggb2YgYWx3YXlzIGhlYXJpbmcgdGhlIGZpcnN0IGZyYWN0aW9uIG9mIGEgc2Vjb25kIG9mIHZpZGVvLCB3aGljaCBvZiBjb3Vyc2UgYW5vdGhlciB3YXkgdG8gZml4XG4gICAgICAgIHdvdWxkIGJlIGJ5IGFsdGVyaW5nIHRoZSB2b2x1bW4gdG8gemVybyB1bnRpbCByZXN0b3JlU3RhcnRUaW1lIGhhcyBnb25lIGludG8gZWZmZWN0ICovXG4gICAgICAgIHJlc3RvcmVTdGFydFRpbWUoKTtcblxuICAgICAgICBpZiAoIWFkU2VnbWVudHMpIHJldHVybjtcbiAgICAgICAgZm9yIChsZXQgc2VnIG9mIGFkU2VnbWVudHMpIHtcbiAgICAgICAgICAgIC8qIGVuZFRpbWUgb2YgLTEgbWVhbnMgdGhlIHJlc3Qgb2YgdGhlIG1lZGlhIHNob3VsZCBiZSBjb25zaWRlcmVkIEFEcyAqL1xuICAgICAgICAgICAgaWYgKHBsYXllci5jdXJyZW50VGltZSA+PSBzZWcuYmVnaW5UaW1lICYmIC8vXG4gICAgICAgICAgICAgICAgKHBsYXllci5jdXJyZW50VGltZSA8PSBzZWcuZW5kVGltZSB8fCBzZWcuZW5kVGltZSA8IDApKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGVuZCBvZiBhdWRpbyBpZiByZXN0IGlzIGFuIGFkZCwgd2l0aCBsb2dpYyBvZiAtMyB0byBlbnN1cmUgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICBnbyBpbnRvIGEgbG9vcCBqdW1waW5nIHRvIGVuZCBvdmVyIGFuZCBvdmVyIGFnYWluICovXG4gICAgICAgICAgICAgICAgaWYgKHNlZy5lbmRUaW1lIDwgMCAmJiBwbGF5ZXIuY3VycmVudFRpbWUgPCBwbGF5ZXIuZHVyYXRpb24gLSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gbGFzdCB0byBzZWNvbmRzIG9mIGF1ZGlvLCBpJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiBwYXVzaW5nLCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICB0aGVyZSBhcmUgaXMgbW9yZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGFib3V0IHRvIHBsYXksIHdlIGRvbid0IHdhbnQgdG8gaGFsdCBpdCBhbGwgKi9cbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gcGxheWVyLmR1cmF0aW9uIC0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogb3IgZWxzZSB3ZSBhcmUgaW4gYSBjb21lcmNpYWwgc2VnbWVudCBzbyBqdW1wIHRvIG9uZSBzZWNvbmQgcGFzdCBpdCAqL1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzZWcuZW5kVGltZSArIDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogdG9kby0wOiBmb3IgcHJvZHVjdGlvbiwgYm9vc3QgdGhpcyB1cCB0byBvbmUgbWludXRlICovXG4gICAgZXhwb3J0IGxldCBwdXNoVGltZXJGdW5jdGlvbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwicHVzaFRpbWVyXCIpO1xuICAgICAgICAvKiB0aGUgcHVycG9zZSBvZiB0aGlzIHRpbWVyIGlzIHRvIGJlIHN1cmUgdGhlIGJyb3dzZXIgc2Vzc2lvbiBkb2Vzbid0IHRpbWVvdXQgd2hpbGUgdXNlciBpcyBwbGF5aW5nXG4gICAgICAgIGJ1dCBpZiB0aGUgbWVkaWEgaXMgcGF1c2VkIHdlIERPIGFsbG93IGl0IHRvIHRpbWVvdXQuIE90aHdlcndpc2UgaWYgdXNlciBpcyBsaXN0ZW5pbmcgdG8gYXVkaW8sIHdlXG4gICAgICAgIGNvbnRhY3QgdGhlIHNlcnZlciBkdXJpbmcgdGhpcyB0aW1lciB0byB1cGRhdGUgdGhlIHRpbWUgb24gdGhlIHNlcnZlciBBTkQga2VlcCBzZXNzaW9uIGZyb20gdGltaW5nIG91dFxuXG4gICAgICAgIHRvZG8tMDogd291bGQgZXZlcnl0aGluZyB3b3JrIGlmICdwbGF5ZXInIFdBUyB0aGUganF1ZXJ5IG9iamVjdCBhbHdheXMuXG4gICAgICAgICovXG4gICAgICAgIGlmIChwbGF5ZXIgJiYgIXBsYXllci5wYXVzZWQpIHtcbiAgICAgICAgICAgIC8qIHRoaXMgc2FmZXR5IGNoZWNrIHRvIGJlIHN1cmUgbm8gaGlkZGVuIGF1ZGlvIGNhbiBzdGlsbCBiZSBwbGF5aW5nIHNob3VsZCBubyBsb25nZXIgYmUgbmVlZGVkXG4gICAgICAgICAgICBub3cgdGhhdCBJIGhhdmUgdGhlIGNsb3NlIGxpdGVuZXIgZXZlbiBvbiB0aGUgZGlhbG9nLCBidXQgaSdsbCBsZWF2ZSB0aGlzIGhlcmUgYW55d2F5LiBDYW4ndCBodXJ0LiAqL1xuICAgICAgICAgICAgaWYgKCEkKHBsYXllcikuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2luZyBwbGF5ZXIsIGJlY2F1c2UgaXQgd2FzIGRldGVjdGVkIGFzIG5vdCB2aXNpYmxlLiBwbGF5ZXIgZGlhbG9nIGdldCBoaWRkZW4/XCIpO1xuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkF1dG9zYXZlIHBsYXllciBpbmZvLlwiKTtcbiAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgZXhwb3J0IGxldCBwYXVzZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IGRlc3Ryb3lQbGF5ZXIgPSBmdW5jdGlvbihkbGc6IEF1ZGlvUGxheWVyRGxnKTogdm9pZCB7XG4gICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxvY2FsUGxheWVyID0gJChwbGF5ZXIpO1xuICAgICAgICAgICAgICAgIHBsYXllciA9IG51bGw7XG4gICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGxnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRsZy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBwbGF5ID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHNwZWVkID0gZnVuY3Rpb24ocmF0ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllci5wbGF5YmFja1JhdGUgPSByYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgIGV4cG9ydCBsZXQgc2tpcCA9IGZ1bmN0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lICs9IGRlbHRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBzYXZlUGxheWVySW5mbyA9IGZ1bmN0aW9uKHVybDogc3RyaW5nLCB0aW1lT2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0UGxheWVySW5mb1JlcXVlc3QsIGpzb24uU2V0UGxheWVySW5mb1Jlc3BvbnNlPihcInNldFBsYXllckluZm9cIiwge1xuICAgICAgICAgICAgXCJ1cmxcIjogdXJsLFxuICAgICAgICAgICAgXCJ0aW1lT2Zmc2V0XCI6IHRpbWVPZmZzZXQgLy8sXG4gICAgICAgICAgICAvL1wibm9kZVBhdGhcIjogbm9kZS5wYXRoXG4gICAgICAgIH0sIHNldFBsYXllckluZm9SZXNwb25zZSk7XG4gICAgfVxuXG4gICAgbGV0IHNldFBsYXllckluZm9SZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAvL2FsZXJ0KCdzYXZlIGNvbXBsZXRlLicpO1xuICAgIH1cbn1cbm5hbWVzcGFjZSBzeXN0ZW1mb2xkZXIge1xuXG4gICAgZXhwb3J0IGxldCByZW5kZXJOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBwYXRoUHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cGF0aFwiLCBub2RlKTtcbiAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHBhdGhQcm9wKSB7XG4gICAgICAgICAgICBwYXRoICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICB9LCBwYXRoUHJvcC52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBUaGlzIHdhcyBhbiBleHBlcmltZW50IHRvIGxvYWQgYSBub2RlIHByb3BlcnR5IHdpdGggdGhlIHJlc3VsdHMgb2YgYSBkaXJlY3RvcnkgbGlzdGluZywgYnV0IEkgZGVjaWRlZCB0aGF0XG4gICAgICAgIHJlYWxseSBpZiBJIHdhbnQgdG8gaGF2ZSBhIGZpbGUgYnJvd3NlciwgdGhlIHJpZ2h0IHdheSB0byBkbyB0aGF0IGlzIHRvIGhhdmUgYSBkZWRpY2F0ZWQgdGFiIHRoYXQgY2FuIGRvIGl0XG4gICAgICAgIGp1c3QgbGlrZSB0aGUgb3RoZXIgdG9wLWxldmVsIHRhYnMgKi9cbiAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmdQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpqc29uXCIsIG5vZGUpO1xuICAgICAgICAvL2xldCBmaWxlTGlzdGluZyA9IGZpbGVMaXN0aW5nUHJvcCA/IHJlbmRlci5yZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KGZpbGVMaXN0aW5nUHJvcC52YWx1ZSkgOiBcIlwiO1xuXG4gICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgIH0sIHBhdGggLyogKyBmaWxlTGlzdGluZyAqLyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoIC8qICsgZmlsZUxpc3RpbmcgKi8pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlbmRlckZpbGVMaXN0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkpTT05fRklMRV9TRUFSQ0hfUkVTVUxULCBub2RlKTtcbiAgICAgICAgaWYgKHNlYXJjaFJlc3VsdFByb3ApIHtcbiAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcmVuZGVyLnJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkoc2VhcmNoUmVzdWx0UHJvcC52YWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBmaWxlTGlzdFByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgIFwibWV0YTY0Ompzb25cIl07XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IHJlaW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5GaWxlU2VhcmNoUmVxdWVzdCwganNvbi5GaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInJlaW5kZXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogbnVsbFxuICAgICAgICAgICAgfSwgcmVpbmRleFJlc3BvbnNlLCBzeXN0ZW1mb2xkZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBicm93c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVGhpcyBicm93c2UgZnVuY3Rpb24gd29ya3MsIGJ1dCBpJ20gZGlzYWJsaW5nIGl0LCBmb3Igbm93IGJlY2F1c2Ugd2hhdCBJJ2xsIGJlIGRvaW5nIGluc3RlYWQgaXMgbWFraW5nIGl0XG4gICAgICAgIC8vIHN3aXRjaCB0byBhIEZpbGVCcm93c2VyIFRhYiAobWFpbiB0YWIpIHdoZXJlIGJyb3dzaW5nIHdpbGwgYWxsIGJlIGRvbmUuIE5vIEpDUiBub2RlcyB3aWxsIGJlIHVwZGF0ZWQgZHVyaW5nXG4gICAgICAgIC8vIHRoZSBwcm9jZXNzIG9mIGJyb3dzaW5nIGFuZCBlZGl0aW5nIGZpbGVzIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAvLyBpZiAoc2VsTm9kZSkge1xuICAgICAgICAvLyAgICAgdXRpbC5qc29uPGpzb24uQnJvd3NlRm9sZGVyUmVxdWVzdCwganNvbi5Ccm93c2VGb2xkZXJSZXNwb25zZT4oXCJicm93c2VGb2xkZXJcIiwge1xuICAgICAgICAvLyAgICAgICAgIFwibm9kZUlkXCI6IHNlbE5vZGUucGF0aFxuICAgICAgICAvLyAgICAgfSwgc3lzdGVtZm9sZGVyLnJlZnJlc2hSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcmVmcmVzaFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkJyb3dzZUZvbGRlclJlc3BvbnNlKSB7XG4gICAgICAgIC8vbmF2Lm1haW5PZmZzZXQgPSAwO1xuICAgICAgICAvLyB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XG4gICAgICAgIC8vICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxuICAgICAgICAvLyAgICAgXCJ1cExldmVsXCI6IG51bGwsXG4gICAgICAgIC8vICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxuICAgICAgICAvLyAgICAgXCJvZmZzZXRcIjogMCxcbiAgICAgICAgLy8gICAgIFwiZ29Ub0xhc3RQYWdlXCIgOiBmYWxzZVxuICAgICAgICAvLyB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCByZWluZGV4UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlKSB7XG4gICAgICAgIGFsZXJ0KFwiUmVpbmRleCBjb21wbGV0ZS5cIik7XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBzZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgKG5ldyBTZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgXCJtZXRhNjQ6cGF0aFwiXTtcblxuICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgIH1cbn1cbi8qXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICpcbiAqIHRvZG86IHdoZW4gcmVmYWN0b3JpbmcgYWxsIGRpYWxvZ3MgdG8gdGhpcyBuZXcgYmFzZS1jbGFzcyBkZXNpZ24gSSdtIGFsd2F5c1xuICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICogY2VydGFpbiBkaWFsb2dzIChpbmRlZWQgbW9zdCBvZiB0aGVtKSBiZSBhYmxlIHRvIGJlaGF2ZSBhcyBzaW5nbGV0b25zIG9uY2VcbiAqIHRoZXkgaGF2ZSBiZWVuIGNvbnN0cnVjdGVkIHdoZXJlIHRoZXkgbWVyZWx5IGhhdmUgdG8gYmUgcmVzaG93biBhbmRcbiAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAqIG1ha2luZyB0aGVtIGludmlzaWJsZS5cbiAqL1xuY2xhc3MgRGlhbG9nQmFzZSB7XG5cbiAgICBwcml2YXRlIGhvcml6Q2VudGVyRGxnQ29udGVudDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBkYXRhOiBhbnk7XG4gICAgYnVpbHQ6IGJvb2xlYW47XG4gICAgZ3VpZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvbUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgLypcbiAgICAgICAgICogV2UgcmVnaXN0ZXIgJ3RoaXMnIHNvIHdlIGNhbiBkbyBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgKiBvbiB0aGUgZGlhbG9nIGFuZCBiZSBhYmxlIHRvIGhhdmUgJ3RoaXMnIGF2YWlsYWJsZSB0byB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGVuY29kZWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAqIGFzIHN0cmluZ3MuXG4gICAgICAgICAqL1xuICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMpO1xuICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMuZGF0YSk7XG4gICAgfVxuXG4gICAgLyogdGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbnRlbnQgb2YgdGhlIGRpYWxvZyB3aGVuIGl0J3MgZGlzcGxheWVkLCBhbmQgc2hvdWxkIGJlIHRoZSBwbGFjZSB3aGVyZVxuICAgIGFueSBkZWZhdWx0cyBvciB2YWx1ZXMgaW4gZm9yIGZpZWxkcywgZXRjLiBzaG91bGQgYmUgc2V0IHdoZW4gdGhlIGRpYWxvZyBpcyBkaXNwbGF5ZWQgKi9cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cblxuICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgfVxuXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICB9O1xuXG4gICAgb3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICAvKlxuICAgICAgICAgKiBnZXQgY29udGFpbmVyIHdoZXJlIGFsbCBkaWFsb2dzIGFyZSBjcmVhdGVkICh0cnVlIHBvbHltZXIgZGlhbG9ncylcbiAgICAgICAgICovXG4gICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgLyogc3VmZml4IGRvbUlkIGZvciB0aGlzIGluc3RhbmNlL2d1aWQgKi9cbiAgICAgICAgbGV0IGlkID0gdGhpcy5pZCh0aGlzLmRvbUlkKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBUT0RPLiBJTVBPUlRBTlQ6IG5lZWQgdG8gcHV0IGNvZGUgaW4gdG8gcmVtb3ZlIHRoaXMgZGlhbG9nIGZyb20gdGhlIGRvbVxuICAgICAgICAgKiBvbmNlIGl0J3MgY2xvc2VkLCBBTkQgdGhhdCBzYW1lIGNvZGUgc2hvdWxkIGRlbGV0ZSB0aGUgZ3VpZCdzIG9iamVjdCBpblxuICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBhcGVyLWRpYWxvZ1wiKTtcblxuICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAvL3NldCB0aGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSAncG9seUVsbS5ub2RlJyBiZWxvdy5cbiAgICAgICAgLy9ub2RlLnNldEF0dHJpYnV0ZShcIndpdGgtYmFja2Ryb3BcIiwgXCJ3aXRoLWJhY2tkcm9wXCIpO1xuXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICBtb2RhbHNDb250YWluZXIubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgICAgICAvLyB0b2RvLTM6IHB1dCBpbiBDU1Mgbm93XG4gICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXG4gICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XG5cblxuICAgICAgICBpZiAodGhpcy5ob3JpekNlbnRlckRsZ0NvbnRlbnQpIHtcblxuICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9XG4gICAgICAgICAgICAgICAgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIC8vaG93dG86IGV4YW1wbGUgb2YgaG93IHRvIGNlbnRlciBhIGRpdiBpbiBhbm90aGVyIGRpdi4gVGhpcyBkaXYgaXMgdGhlIG9uZSBiZWluZyBjZW50ZXJlZC5cbiAgICAgICAgICAgICAgICAgICAgLy9UaGUgdHJpY2sgdG8gZ2V0dGluZyB0aGUgbGF5b3V0IHdvcmtpbmcgd2FzIE5PVCBzZXR0aW5nIHRoaXMgd2lkdGggdG8gMTAwJSBldmVuIHRob3VnaCBzb21laG93XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIGxheW91dCBkb2VzIHJlc3VsdCBpbiBpdCBiZWluZyAxMDAlIGkgdGhpbmsuXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW46IDAgYXV0bzsgbWF4LXdpZHRoOiA4MDBweDtcIiAvL1wibWFyZ2luOiAwIGF1dG87IHdpZHRoOiA4MDBweDtcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoaWQsIGNvbnRlbnQpO1xuXG4gICAgICAgICAgICAvLyBsZXQgbGVmdCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgLy8gfSwgXCJsZWZ0XCIpO1xuICAgICAgICAgICAgLy8gbGV0IGNlbnRlciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgLy8gfSwgdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgIC8vIGxldCByaWdodCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgLy8gfSwgXCJyaWdodFwiKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBsZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gbGV0IHRhYmxlOiBzdHJpbmcgPSByZW5kZXIudGFnKFwiZGl2XCIsXG4gICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZVwiLFxuICAgICAgICAgICAgLy8gICAgIH0sIHJvdyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gdXRpbC5zZXRIdG1sKGlkLCB0YWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKiB0b2RvLTA6IGxvb2t1cCBwYXBlci1kaWFsb2ctc2Nyb2xsYWJsZSwgZm9yIGV4YW1wbGVzIG9uIGhvdyB3ZSBjYW4gaW1wbGVtZW50IGhlYWRlciBhbmQgZm9vdGVyIHRvIGJ1aWxkXG4gICAgICAgICAgICBhIG11Y2ggYmV0dGVyIGRpYWxvZy4gKi9cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5idWlsZCgpO1xuICAgICAgICAgICAgLy8gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAvLyAgICAgXCJjbGFzc1wiIDogXCJtYWluLWRpYWxvZy1jb250ZW50XCJcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5idWlsdCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgIC8qIG5vdyBvcGVuIGFuZCBkaXNwbGF5IHBvbHltZXIgZGlhbG9nIHdlIGp1c3QgY3JlYXRlZCAqL1xuICAgICAgICBsZXQgcG9seUVsbSA9IHV0aWwucG9seUVsbShpZCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaSB0cmllZCB0byB0d2VhayB0aGUgcGxhY2VtZW50IG9mIHRoZSBkaWFsb2cgdXNpbmcgZml0SW50bywgYW5kIGl0IGRpZG4ndCB3b3JrXG4gICAgICAgIHNvIEknbSBqdXN0IHVzaW5nIHRoZSBwYXBlci1kaWFsb2cgQ1NTIHN0eWxpbmcgdG8gYWx0ZXIgdGhlIGRpYWxvZyBzaXplIHRvIGZ1bGxzY3JlZW5cbiAgICAgICAgbGV0IGlyb25QYWdlcyA9IHV0aWwucG9seUVsbShcIm1haW5Jcm9uUGFnZXNcIik7XG5cbiAgICAgICAgQWZ0ZXIgdGhlIFR5cGVTY3JpcHQgY29udmVyc2lvbiBJIG5vdGljZWQgaGF2aW5nIGEgbW9kYWwgZmxhZyB3aWxsIGNhdXNlXG4gICAgICAgIGFuIGluZmluaXRlIGxvb3AgKGNvbXBsZXRlbHkgaGFuZykgQ2hyb21lIGJyb3dzZXIsIGJ1dCB0aGlzIGlzc3VlIGlzIG1vc3QgbGlrZWx5XG4gICAgICAgIG5vdCByZWxhdGVkIHRvIFR5cGVTY3JpcHQgYXQgYWxsLCBidXQgaSdtIGp1c3QgbWVudGlvbiBUUyBqdXN0IGluIGNhc2UsIGJlY2F1c2VcbiAgICAgICAgdGhhdCdzIHdoZW4gSSBub3RpY2VkIGl0LiBEaWFsb2dzIGFyZSBmaW5lIGJ1dCBub3QgYSBkaWFsb2cgb24gdG9wIG9mIGFub3RoZXIgZGlhbG9nLCB3aGljaCBpc1xuICAgICAgICB0aGUgY2FzZSB3aGVyZSBpdCBoYW5ncyBpZiBtb2RlbD10cnVlXG4gICAgICAgICovXG4gICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICAvL3BvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICBwb2x5RWxtLm5vZGUubm9DYW5jZWxPbk91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmhvcml6b250YWxPZmZzZXQgPSAwO1xuICAgICAgICAvL3BvbHlFbG0ubm9kZS52ZXJ0aWNhbE9mZnNldCA9IDA7XG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmZpdEludG8gPSBpcm9uUGFnZXMubm9kZTtcbiAgICAgICAgLy9wb2x5RWxtLm5vZGUuY29uc3RyYWluKCk7XG4gICAgICAgIC8vcG9seUVsbS5ub2RlLmNlbnRlcigpO1xuICAgICAgICBwb2x5RWxtLm5vZGUub3BlbigpO1xuXG4gICAgICAgIC8vdmFyIGRpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkRpYWxvZycpO1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lyb24tb3ZlcmxheS1jbG9zZWQnLCBmdW5jdGlvbihjdXN0b21FdmVudCkge1xuICAgICAgICAgICAgLy92YXIgaWQgPSAoPGFueT5jdXN0b21FdmVudC5jdXJyZW50VGFyZ2V0KS5pZDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKiogRGlhbG9nOiBcIiArIGlkICsgXCIgaXMgY2xvc2VkIVwiKTtcbiAgICAgICAgICAgIHRoaXouY2xvc2VFdmVudCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICBzZXR0aW5nIHRvIHplcm8gbWFyZ2luIGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhbG1vc3QgaW1tZWRpYXRlbHksIGFuZCB0aGVuIGFmdGUgMS41IHNlY29uZHNcbiAgICAgICAgaXMgYSByZWFsbHkgdWdseSBoYWNrLCBidXQgSSBjb3VsZG4ndCBmaW5kIHRoZSByaWdodCBzdHlsZSBjbGFzcyBvciB3YXkgb2YgZG9pbmcgdGhpcyBpbiB0aGUgZ29vZ2xlXG4gICAgICAgIGRvY3Mgb24gdGhlIGRpYWxvZyBjbGFzcy5cbiAgICAgICAgKi9cbiAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuXG4gICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgLyogSSdtIGRvaW5nIHRoaXMgaW4gZGVzcGFyYXRpb24uIG5vdGhpbmcgZWxzZSBzZWVtcyB0byBnZXQgcmlkIG9mIHRoZSBtYXJnaW4gKi9cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgIH0sIDE1MDApO1xuICAgIH1cblxuICAgIC8qIHRvZG86IG5lZWQgdG8gY2xlYW51cCB0aGUgcmVnaXN0ZXJlZCBJRHMgdGhhdCBhcmUgaW4gbWFwcyBmb3IgdGhpcyBkaWFsb2cgKi9cbiAgICBwdWJsaWMgY2FuY2VsKCkge1xuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHRoaXMuZG9tSWQpKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLmNhbmNlbCgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGVscGVyIG1ldGhvZCB0byBnZXQgdGhlIHRydWUgaWQgdGhhdCBpcyBzcGVjaWZpYyB0byB0aGlzIGRpYWxvZyAoaS5lLiBndWlkXG4gICAgICogc3VmZml4IGFwcGVuZGVkKVxuICAgICAqL1xuICAgIGlkID0gKGlkKTogc3RyaW5nID0+IHtcbiAgICAgICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAvKiBpZiBkaWFsb2cgYWxyZWFkeSBzdWZmaXhlZCAqL1xuICAgICAgICBpZiAodXRpbC5jb250YWlucyhpZCwgXCJfZGxnSWRcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWQgKyBcIl9kbGdJZFwiICsgdGhpcy5kYXRhLmd1aWQ7XG4gICAgfVxuXG4gICAgZWwgPSAoaWQpOiBhbnkgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiNcIiArIHRoaXMuaWQoaWQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAkKHRoaXMuaWQoaWQpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VQYXNzd29yZEZpZWxkID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiByZW5kZXIubWFrZVBhc3N3b3JkRmllbGQodGV4dCwgdGhpcy5pZChpZCkpO1xuICAgIH1cblxuICAgIG1ha2VFZGl0RmllbGQgPSAoZmllbGROYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XG4gICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgbWFrZU1lc3NhZ2VBcmVhID0gKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLW1lc3NhZ2VcIlxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBcIiwgYXR0cnMsIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgLy8gZW5jb2RlQ2FsbGJhY2sgY2FwYWJpbGl0eSB5ZXRcbiAgICBtYWtlQnV0dG9uID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSwgY3R4PzogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKSxcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgIH1cblxuICAgIC8qIFRoZSByZWFzb24gZGVsYXlDbG9zZUNhbGxiYWNrIGlzIGhlcmUgaXMgc28gdGhhdCB3ZSBjYW4gZW5jb2RlIGEgYnV0dG9uIHRvIHBvcHVwIGEgbmV3IGRpYWxvZyBvdmVyIHRoZSB0b3Agb2ZcbiAgICBhbiBleGlzdGluZyBkaWFsb2csIGFuZCBoYXZlIHRoYXQgaGFwcGVuIGluc3RhbnRseSwgcmF0aGVyIHRoYW4gbGV0dGluZyBpdCBjbG9zZSwgYW5kIFRIRU4gcG9waW5nIHVwIGEgc2Vjb25kIGRpYWxvZyxcbiAgICBiZWNhc3VlIHVzaW5nIHRoZSBkZWxheSBtZWFucyB0aGF0IHRoZSBvbmUgYmVpbmcgaGlkZGVuIGlzIG5vdCBhYmxlIHRvIGJlY29tZSBoaWRkZW4gYmVmb3JlIHRoZSBvbmUgY29tZXMgdXAgYmVjYXVzZVxuICAgIHRoYXQgY3JlYXRlcyBhbiB1Z2x5bmVzcy4gSXQncyBiZXR0ZXIgdG8gcG9wdXAgb25lIHJpZ2h0IG92ZXIgdGhlIG90aGVyIGFuZCBubyBmbGlja2VyIGhhcHBlbnMgaW4gdGhhdCBjYXNlLiAqL1xuICAgIG1ha2VDbG9zZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogYW55LCBjdHg/OiBhbnksIGluaXRpYWxseVZpc2libGU6IGJvb2xlYW4gPSB0cnVlLCBkZWxheUNsb3NlQ2FsbGJhY2s6IG51bWJlciA9IDApOiBzdHJpbmcgPT4ge1xuXG4gICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcblxuICAgICAgICAgICAgLyogd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSB3aWxsIGNhdXNlIGdvb2dsZSBwb2x5bWVyIHRvIGNsb3NlIHRoZSBkaWFsb2cgaW5zdGFudGx5IHdoZW4gdGhlIGJ1dHRvblxuICAgICAgICAgICAgIGlzIGNsaWNrZWQgYW5kIHNvbWV0aW1lcyB3ZSBkb24ndCB3YW50IHRoYXQsIGxpa2UgZm9yIGV4YW1wbGUsIHdoZW4gd2Ugb3BlbiBhIGRpYWxvZyBvdmVyIGFub3RoZXIgZGlhbG9nLFxuICAgICAgICAgICAgIHdlIGRvbid0IHdhbnQgdGhlIGluc3RhbnRhbmVvdXMgY2xvc2UgYW5kIGRpc3BsYXkgb2YgYmFja2dyb3VuZC4gSXQgY3JlYXRlcyBhIGZsaWNrZXIgZWZmZWN0LlxuXG4gICAgICAgICAgICBcImRpYWxvZy1jb25maXJtXCI6IFwiZGlhbG9nLWNvbmZpcm1cIixcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBvbkNsaWNrID0gXCJcIjtcblxuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvbkNsaWNrID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkNsaWNrICs9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKHRoaXMuY2FuY2VsLCB0aGlzLCBudWxsLCBkZWxheUNsb3NlQ2FsbGJhY2spO1xuXG4gICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG9uQ2xpY2s7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWluaXRpYWxseVZpc2libGUpIHtcbiAgICAgICAgICAgIGF0dHJpYnNbXCJzdHlsZVwiXSA9IFwiZGlzcGxheTpub25lO1wiXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBiaW5kRW50ZXJLZXkgPSAoaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHNldElucHV0VmFsID0gKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICB2YWwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgfVxuXG4gICAgZ2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgfVxuXG4gICAgc2V0SHRtbCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBtYWtlUmFkaW9CdXR0b24gPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgfSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG1ha2VDaGVja0JveCA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nLCBpbml0aWFsU3RhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuXG4gICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgIC8vXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgXCJpZFwiOiBpZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuICAgICAgICAvLyAgICAgICAgICAgICA8cGFwZXItY2hlY2tib3ggb24tY2hhbmdlPVwiY2hlY2tib3hDaGFuZ2VkXCI+Y2xpY2s8L3BhcGVyLWNoZWNrYm94PlxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgICAgICBjaGVja2JveENoYW5nZWQgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vICAgICBpZihldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgaWYgKGluaXRpYWxTdGF0ZSkge1xuICAgICAgICAgICAgYXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2hlY2tib3g6IHN0cmluZyA9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBhdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgIGNoZWNrYm94ICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICBcImZvclwiOiBpZFxuICAgICAgICB9LCBsYWJlbCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGNoZWNrYm94O1xuICAgIH1cblxuICAgIG1ha2VIZWFkZXIgPSAodGV4dDogc3RyaW5nLCBpZD86IHN0cmluZywgY2VudGVyZWQ/OiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiAvKlwiZGlhbG9nLWhlYWRlciBcIiArKi8gKGNlbnRlcmVkID8gXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCIgOiBcIlwiKSArIFwiIGRpYWxvZy1oZWFkZXJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIC8vYWRkIGlkIGlmIG9uZSB3YXMgcHJvdmlkZWRcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBtYWtpbmcgdGhpcyBIMiB0YWcgY2F1c2VzIGdvb2dsZSB0byBkcmFnIGluIGEgYnVuY2ggb2YgaXRzIG93biBzdHlsZXMgYW5kIGFyZSBoYXJkIHRvIG92ZXJyaWRlICovXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIGF0dHJzLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBmb2N1cyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdXRpbC5zdGFydHNXaXRoKGlkLCBcIiNcIikpIHtcbiAgICAgICAgICAgIGlkID0gXCIjXCIgKyBpZDtcbiAgICAgICAgfVxuICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhpZCk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICAvLyB9LCAxMDAwKTtcbiAgICB9XG59XG5jbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgXCJpbmRldGVybWluYXRlXCI6IFwiaW5kZXRlcm1pbmF0ZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgIFwibWF4XCI6IFwiMTAwMFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoyODBweDsgbWFyZ2luOiAwIGF1dG87IG1hcmdpbi10b3A6MjRweDsgbWFyZ2luLWJvdHRvbToyNHB4O1wiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXRcIlxuICAgICAgICB9LCBwcm9ncmVzc0Jhcik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGJhckNvbnRhaW5lcjtcbiAgICB9XG59XG5jbGFzcyBDb25maXJtRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSB5ZXNDYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgIHByaXZhdGUgbm9DYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgICAgIHN1cGVyKFwiQ29uZmlybURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgY29udGVudDogc3RyaW5nID0gdGhpcy5tYWtlSGVhZGVyKFwiXCIsIFwiQ29uZmlybURsZ1RpdGxlXCIpICsgdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJcIiwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgY29udGVudCA9IHJlbmRlci5jZW50ZXJDb250ZW50KGNvbnRlbnQsIDMwMCk7XG5cbiAgICAgICAgdmFyIGJ1dHRvbnMgPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlllc1wiLCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIiwgdGhpcy55ZXNDYWxsYmFjaylcbiAgICAgICAgICAgICsgdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJOb1wiLCBcIkNvbmZpcm1EbGdOb0J1dHRvblwiLCB0aGlzLm5vQ2FsbGJhY2spO1xuICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnNldEh0bWwodGhpcy50aXRsZSwgXCJDb25maXJtRGxnVGl0bGVcIik7XG4gICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLm1lc3NhZ2UsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG4gICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLmJ1dHRvblRleHQsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiKTtcbiAgICB9XG59XG5cbmNsYXNzIEVkaXRTeXN0ZW1GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoXCJFZGl0U3lzdGVtRmlsZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCI8aDI+RmlsZSBFZGl0b3I6IFwiICsgdGhpcy5maWxlTmFtZSArIFwiPC9oMj5cIjtcblxuICAgICAgICBsZXQgYnV0dG9ucyA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcIlNhdmVGaWxlQnV0dG9uXCIsIHRoaXMuc2F2ZUVkaXQpXG4gICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiQ2FuY2VsRmlsZUVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0KTtcbiAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYnV0dG9ucyk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgc2F2ZUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZS5cIik7XG4gICAgfVxuXG4gICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYW5jZWwuXCIpO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgfVxufVxuXHJcbi8qXHJcbiAqIENhbGxiYWNrIGNhbiBiZSBudWxsIGlmIHlvdSBkb24ndCBuZWVkIHRvIHJ1biBhbnkgZnVuY3Rpb24gd2hlbiB0aGUgZGlhbG9nIGlzIGNsb3NlZFxyXG4gKi9cclxuY2xhc3MgTWVzc2FnZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZT86IGFueSwgcHJpdmF0ZSB0aXRsZT86IGFueSwgcHJpdmF0ZSBjYWxsYmFjaz86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKFwiTWVzc2FnZURsZ1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aXRsZSkge1xyXG4gICAgICAgICAgICB0aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnRpdGxlKSArIFwiPHA+XCIgKyB0aGlzLm1lc3NhZ2UgKyBcIjwvcD5cIjtcclxuICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxufVxyXG5jbGFzcyBMb2dpbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkxvZ2luRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJMb2dpblwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgIHZhciBsb2dpbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkxvZ2luXCIsIFwibG9naW5CdXR0b25cIiwgdGhpcy5sb2dpbiwgdGhpcyk7XG4gICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRm9yZ290IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLCB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxMb2dpbkJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihsb2dpbkJ1dHRvbiArIHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcbiAgICAgICAgdmFyIGRpdmlkZXIgPSBcIjxkaXY+PGgzPk9yIExvZ2luIFdpdGguLi48L2gzPjwvZGl2PlwiO1xuXG4gICAgICAgIHZhciBmb3JtID0gZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuXG4gICAgICAgIHZhciBtYWluQ29udGVudCA9IGZvcm07XG4gICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XG5cbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJ1c2VyTmFtZVwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJwYXNzd29yZFwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVGcm9tQ29va2llcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHVzciA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XG4gICAgICAgIHZhciBwd2QgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xuXG4gICAgICAgIGlmICh1c3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB1c3IpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwd2QpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiLCBwd2QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9naW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcbiAgICAgICAgdmFyIHB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiKTtcblxuICAgICAgICB1c2VyLmxvZ2luKHRoaXMsIHVzciwgcHdkKTtcbiAgICB9XG5cbiAgICByZXNldFBhc3N3b3JkID0gKCk6IGFueSA9PiB7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcblxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFJlc2V0IFBhc3N3b3JkXCIsXG4gICAgICAgICAgICBcIlJlc2V0IHlvdXIgcGFzc3dvcmQgPzxwPllvdSdsbCBzdGlsbCBiZSBhYmxlIHRvIGxvZ2luIHdpdGggeW91ciBvbGQgcGFzc3dvcmQgdW50aWwgdGhlIG5ldyBvbmUgaXMgc2V0LlwiLFxuICAgICAgICAgICAgXCJZZXMsIHJlc2V0LlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIChuZXcgUmVzZXRQYXNzd29yZERsZyh1c3IpKS5vcGVuKCk7XG4gICAgICAgICAgICB9KSkub3BlbigpO1xuICAgIH1cbn1cbmNsYXNzIFNpZ251cERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwic2lnbnVwVXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWxcIiwgXCJzaWdudXBFbWFpbFwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJDYXB0Y2hhXCIsIFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhLWltYWdlXCIgLy9cbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICByZW5kZXIudGFnKFwiaW1nXCIsIC8vXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IFwiXCIvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJcIiwgZmFsc2UpKTtcblxuICAgICAgICB2YXIgc2lnbnVwQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2lnbnVwXCIsIFwic2lnbnVwQnV0dG9uXCIsIHRoaXMuc2lnbnVwLCB0aGlzKTtcbiAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaWdudXBCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGNhcHRjaGFJbWFnZSArIGJ1dHRvbkJhcjtcblxuICAgICAgICAvKlxuICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAqIFwibm8tcmVwZWF0O1wiLCBcImJhY2tncm91bmQtc2l6ZVwiIDogXCIxMDAlIGF1dG9cIiB9KTtcbiAgICAgICAgICovXG4gICAgfVxuXG4gICAgc2lnbnVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwVXNlck5hbWVcIik7XG4gICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cEVtYWlsXCIpO1xuICAgICAgICB2YXIgY2FwdGNoYSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgIC8qIG5vIHJlYWwgdmFsaWRhdGlvbiB5ZXQsIG90aGVyIHRoYW4gbm9uLWVtcHR5ICovXG4gICAgICAgIGlmICghdXNlck5hbWUgfHwgdXNlck5hbWUubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAhY2FwdGNoYSB8fCBjYXB0Y2hhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTb3JyeSwgeW91IGNhbm5vdCBsZWF2ZSBhbnkgZmllbGRzIGJsYW5rLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uU2lnbnVwUmVxdWVzdCwganNvbi5TaWdudXBSZXNwb25zZT4oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c2VyTmFtZSxcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgXCJjYXB0Y2hhXCI6IGNhcHRjaGFcbiAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgc2lnbnVwUmVzcG9uc2UgPSAocmVzOiBqc29uLlNpZ251cFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgIC8qIGNsb3NlIHRoZSBzaWdudXAgZGlhbG9nICovXG4gICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgXCJVc2VyIEluZm9ybWF0aW9uIEFjY2VwdGVkLjxwLz5DaGVjayB5b3VyIGVtYWlsIGZvciBzaWdudXAgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgIFwiU2lnbnVwXCJcbiAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHZhciBuID0gdXRpbC5jdXJyZW50VGltZU1pbGxpcygpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgKiBpbWFnZSB0d2ljZS5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSkuYXR0cihcInNyY1wiLCBzcmMpO1xuICAgIH1cblxuICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnBhZ2VJbml0U2lnbnVwUGcoKTtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmlkKFwic2lnbnVwVXNlck5hbWVcIikpO1xuICAgIH1cbn1cbmNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIlByZWZzRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlBlZmVyZW5jZXNcIik7XHJcblxyXG4gICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJBZHZhbmNlZFwiLCBcImVkaXRNb2RlQWR2YW5jZWRcIik7XHJcblxyXG4gICAgICAgIHZhciByYWRpb0J1dHRvbkdyb3VwID0gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWdyb3VwXCIsIHtcclxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpXHJcbiAgICAgICAgfSwgcmFkaW9CdXR0b25zKTtcclxuXHJcbiAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrQm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJTaG93IFJvdyBNZXRhZGF0YVwiLCBcInNob3dNZXRhRGF0YVwiLCBtZXRhNjQuc2hvd01ldGFEYXRhKTtcclxuICAgICAgICB2YXIgY2hlY2tib3hCYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAoc2hvd01ldGFEYXRhQ2hlY2tCb3gpO1xyXG5cclxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gcmFkaW9CdXR0b25Hcm91cDtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgdmFyIHJhZGlvQmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKGxlZ2VuZCArIGZvcm1Db250cm9scyk7XHJcblxyXG4gICAgICAgIHZhciBzYXZlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByZWZlcmVuY2VzQnV0dG9uXCIsIHRoaXMuc2F2ZVByZWZlcmVuY2VzLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyByYWRpb0JhciArIGNoZWNrYm94QmFyICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQcmVmZXJlbmNlcyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgOiBtZXRhNjQuTU9ERV9BRFZBTkNFRDtcclxuXHJcbiAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrYm94ID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaG93TWV0YURhdGFcIikpO1xyXG4gICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSBzaG93TWV0YURhdGFDaGVja2JveC5ub2RlLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VELFxyXG4gICAgICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlLFxyXG4gICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogbWV0YTY0LnNob3dNZXRhRGF0YVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgLy8gdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAuaWQoXCJlZGl0TW9kZUFkdmFuY2VkXCIpKTtcclxuXHJcbiAgICAgICAgLy90b2RvLTA6IHB1dCB0aGVzZSB0d28gbGluZXMgaW4gYSB1dGlsaXR5IG1ldGhvZFxyXG4gICAgICAgIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgcG9seUVsbS5ub2RlLmNoZWNrZWQgPSBtZXRhNjQuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIE1hbmFnZUFjY291bnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuICAgICAgICB2YXIgY2xvc2VBY2NvdW50QnV0dG9uID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gXCJBZG1pbiBDYW5ub3QgQ2xvc2UgQWNvdW50XCIgOiB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZSBBY2NvdW50XCIsIFwiY2xvc2VBY2NvdW50QnV0dG9uXCIsIFwicHJlZnMuY2xvc2VBY2NvdW50KCk7XCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHZhciBib3R0b21CdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYmFja0J1dHRvbik7XHJcbiAgICAgICAgdmFyIGJvdHRvbUJ1dHRvbkJhckRpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgIH0sIGJvdHRvbUJ1dHRvbkJhcik7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBidXR0b25CYXIgKyBib3R0b21CdXR0b25CYXJEaXY7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgRXhwb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiRXhwb3J0RGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFeHBvcnQgdG8gWE1MXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFeHBvcnQgdG8gRmlsZSBOYW1lXCIsIFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgdmFyIGV4cG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkV4cG9ydFwiLCBcImV4cG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuZXhwb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFeHBvcnRCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoZXhwb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBleHBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIHZhciB0YXJnZXRGaWxlTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyh0YXJnZXRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBleHBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5FeHBvcnRSZXF1ZXN0LCBqc29uLkV4cG9ydFJlc3BvbnNlPihcImV4cG9ydFRvWG1sXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgIH0sIHRoaXMuZXhwb3J0UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0UmVzcG9uc2UgPSAocmVzOiBqc29uLkV4cG9ydFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFeHBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIEltcG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkltcG9ydERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiSW1wb3J0IGZyb20gWE1MXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJGaWxlIG5hbWUgdG8gaW1wb3J0XCIsIFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgdmFyIGltcG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkltcG9ydFwiLCBcImltcG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuaW1wb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxJbXBvcnRCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBpbXBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIHZhciBzb3VyY2VGaWxlTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzb3VyY2VGaWxlTmFtZVwiKTtcblxuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBpbXBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbXBvcnRSZXF1ZXN0LCBqc29uLkltcG9ydFJlc3BvbnNlPihcImltcG9ydFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICB9LCB0aGlzLmltcG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltcG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5JbXBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbXBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFNlYXJjaENvbnRlbnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBPbmx5IGNvbnRlbnQgdGV4dCB3aWxsIGJlIHNlYXJjaGVkLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHNlYXJjaE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQpO1xuICAgIH1cblxuICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvL3V0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgdGhpcy5mb2N1cyhcInNlYXJjaFRleHRcIik7XG4gICAgfVxufVxuY2xhc3MgU2VhcmNoVGFnc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2VhcmNoVGFnc0RsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIFRhZ3NcIik7XG5cbiAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIE9ubHkgdGFncyB0ZXh0IHdpbGwgYmUgc2VhcmNoZWQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgIH1cblxuICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgfVxufVxuY2xhc3MgU2VhcmNoRmlsZXNEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbHVjZW5lOiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKFwiU2VhcmNoRmlsZXNEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBGaWxlc1wiKTtcblxuICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC5cIik7XG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaEJ1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgIH1cblxuICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoRmlsZXNcIikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICBub2RlSWQgPSBzZWxOb2RlLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uRmlsZVNlYXJjaFJlcXVlc3QsIGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlPihcImZpbGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxuICAgICAgICAgICAgXCJyZWluZGV4XCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHRcbiAgICAgICAgfSwgc3JjaC5zZWFyY2hGaWxlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgfVxufVxuY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBwd2Q6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAqIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy5wYXNzQ29kZSA/IFwiUGFzc3dvcmQgUmVzZXRcIiA6IFwiQ2hhbmdlIFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJOZXcgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcblxyXG4gICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsQ2hhbmdlUGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHdkICYmIHRoaXMucHdkLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNoYW5nZVBhc3N3b3JkUmVxdWVzdCwganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlPihcImNoYW5nZVBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmV3UGFzc3dvcmRcIjogdGhpcy5wd2QsXHJcbiAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgfSwgdGhpcy5jaGFuZ2VQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIHBhc3N3b3JkXCIsIHJlcykpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBcIlBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIG1zZyArPSBcIjxwPllvdSBtYXkgbm93IGxvZ2luIGFzIDxiPlwiICsgcmVzLnVzZXJcclxuICAgICAgICAgICAgICAgICAgICArIFwiPC9iPiB3aXRoIHlvdXIgbmV3IHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2csIFwiUGFzc3dvcmQgQ2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbG9naW4gY2FsbCBET0VTIHdvcmssIGJ1dCB0aGUgcmVhc29uIHdlIGRvbid0IGRvIHRoaXMgaXMgYmVjYXVzZSB0aGUgVVJMIHN0aWxsIGhhcyB0aGUgcGFzc0NvZGUgb24gaXQgYW5kIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy93YW50IHRvIGRpcmVjdCB0aGUgdXNlciB0byBhIHVybCB3aXRob3V0IHRoYXQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLmZvY3VzKFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFJlc2V0UGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVzZXI6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKFwiUmVzZXRQYXNzd29yZERsZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJSZXNldCBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHlvdXIgdXNlciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIGFuZCBhIGNoYW5nZS1wYXNzd29yZCBsaW5rIHdpbGwgYmUgc2VudCB0byB5b3VcIik7XHJcblxyXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwidXNlck5hbWVcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbCBBZGRyZXNzXCIsIFwiZW1haWxBZGRyZXNzXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVzZXQgbXkgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVzZXRQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKS50cmltKCk7XHJcbiAgICAgICAgdmFyIGVtYWlsQWRkcmVzcyA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJlbWFpbEFkZHJlc3NcIikudHJpbSgpO1xyXG5cclxuICAgICAgICBpZiAodXNlck5hbWUgJiYgZW1haWxBZGRyZXNzKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlc2V0UGFzc3dvcmRSZXF1ZXN0LCBqc29uLlJlc2V0UGFzc3dvcmRSZXNwb25zZT4oXCJyZXNldFBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlclwiOiB1c2VyTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWxBZGRyZXNzXHJcbiAgICAgICAgICAgIH0sIHRoaXMucmVzZXRQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJPb3BzLiBUcnkgdGhhdCBhZ2Fpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZXNldCBwYXNzd29yZFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBhc3N3b3JkIHJlc2V0IGVtYWlsIHdhcyBzZW50LiBDaGVjayB5b3VyIGluYm94LlwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInVzZXJOYW1lXCIsIHRoaXMudXNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEZvciBub3cgSSBqdXN0IGhhcmQtY29kZSBpbiA3IGVkaXQgZmllbGRzLCBidXQgd2UgY291bGQgdGhlb3JldGljYWxseSBtYWtlIHRoaXMgZHluYW1pYyBzbyB1c2VyIGNhbiBjbGljayAnYWRkJ1xuICAgICAgICAgKiBidXR0b24gYW5kIGFkZCBuZXcgb25lcyBvbmUgYXQgYSB0aW1lLiBKdXN0IG5vdCB0YWtpbmcgdGhlIHRpbWUgdG8gZG8gdGhhdCB5ZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIHRvZG8tMDogVGhpcyBpcyB1Z2x5IHRvIHByZS1jcmVhdGUgdGhlc2UgaW5wdXQgZmllbGRzLiBOZWVkIHRvIG1ha2UgdGhlbSBhYmxlIHRvIGFkZCBkeW5hbWljYWxseS5cbiAgICAgICAgICogKFdpbGwgZG8gdGhpcyBtb2RpZmljYXRpb24gb25jZSBJIGdldCB0aGUgZHJhZy1uLWRyb3Agc3R1ZmYgd29ya2luZyBmaXJzdClcbiAgICAgICAgICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaW5wdXQgPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmlsZVwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZpbGVzXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiB3cmFwIGluIERJViB0byBmb3JjZSB2ZXJ0aWNhbCBhbGlnbiAqL1xuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgfSwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybU5vZGVJZFwiKSxcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgLyogYm9vbGVhbiBmaWVsZCB0byBzcGVjaWZ5IGlmIHdlIGV4cGxvZGUgemlwIGZpbGVzIG9udG8gdGhlIEpDUiB0cmVlICovXG4gICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJleHBsb2RlWmlwc1wiXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgIGxldCBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiUE9TVFwiLFxuICAgICAgICAgICAgXCJlbmN0eXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICB9LCBmb3JtRmllbGRzKTtcblxuICAgICAgICB1cGxvYWRGaWVsZENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICB9LCBcIjxwPlVwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXI8L3A+XCIgKyBmb3JtKTtcblxuICAgICAgICBsZXQgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgaGFzQW55WmlwRmlsZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbCA9ICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkXCIgKyBpICsgXCJGb3JtSW5wdXRJZFwiKSkudmFsKCk7XG4gICAgICAgICAgICBpZiAoaW5wdXRWYWwudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgbGV0IHVwbG9hZEZ1bmMgPSAoZXhwbG9kZVppcHMpID0+IHtcbiAgICAgICAgICAgIC8qIFVwbG9hZCBmb3JtIGhhcyBoaWRkZW4gaW5wdXQgZWxlbWVudCBmb3Igbm9kZUlkIHBhcmFtZXRlciAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpKS5hdHRyKFwidmFsdWVcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIikpLmF0dHIoXCJ2YWx1ZVwiLCBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgZG8gc29tZXRoaW5nIGRpZmZlcmVudGx5IGZyb20gdGhlIG5vcm1hbCAndXRpbC5qc29uKCknIGNhbGxzIHRvIHRoZSBzZXJ2ZXIsIGJlY2F1c2VcbiAgICAgICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+KCQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSlbMF0pKTtcblxuICAgICAgICAgICAgbGV0IHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm1zLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm1zLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkV4cGxvZGUgWmlwcz9cIixcbiAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgIC8vWWVzIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSwvL1xuICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICB9XG59XG5jbGFzcyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnXCIpO1xuICAgIH1cblxuICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgemlwUXVlc3Rpb25BbnN3ZXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGV4cGxvZGVaaXBzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkIEFjdGlvbiBVUkw6IFwiICsgcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIpO1xuXG4gICAgICAgIGxldCBoaWRkZW5JbnB1dENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICBcInN0eWxlXCI6IFwiZGlzcGxheTogbm9uZTtcIlxuICAgICAgICB9LCBcIlwiKTtcblxuICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgXCJhdXRvUHJvY2Vzc1F1ZXVlXCI6IGZhbHNlLFxuICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZHJvcHpvbmVcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIilcbiAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgbGV0IHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIG51bGwsIG51bGwsIGZhbHNlKTtcbiAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgZm9ybSArIGhpZGRlbklucHV0Q29udGFpbmVyICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgbGV0IGNvbmZpZzogT2JqZWN0ID0ge1xuICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgIC8vIFByZXZlbnRzIERyb3B6b25lIGZyb20gdXBsb2FkaW5nIGRyb3BwZWQgZmlsZXMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGF1dG9Qcm9jZXNzUXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICBtYXhGaWxlc2l6ZTogMixcbiAgICAgICAgICAgIHBhcmFsbGVsVXBsb2FkczogMTAsXG5cbiAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgIHRoZSB1cGxvYWRNdWx0aXBsZSBpcyBmYWxzZSAqL1xuICAgICAgICAgICAgdXBsb2FkTXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6IFwiRHJhZyAmIERyb3AgZmlsZXMgaGVyZSwgb3IgQ2xpY2tcIixcbiAgICAgICAgICAgIGhpZGRlbklucHV0Q29udGFpbmVyOiBcIiNcIiArIHRoaXouaWQoXCJoaWRkZW5JbnB1dENvbnRhaW5lclwiKSxcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIFRoaXMgZG9lc24ndCB3b3JrIGF0IGFsbC4gRHJvcHpvbmUgYXBwYXJlbnRseSBjbGFpbXMgdG8gc3VwcG9ydCB0aGlzIGJ1dCBkb2Vzbid0LlxuICAgICAgICAgICAgU2VlIHRoZSBcInNlbmRpbmdcIiBmdW5jdGlvbiBiZWxvdywgd2hlcmUgSSBlbmRlZCB1cCBwYXNzaW5nIHRoZXNlIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCIgOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJleHBsb2RlWmlwc1wiIDogZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXouaWQoXCJ1cGxvYWRCdXR0b25cIikpO1xuICAgICAgICAgICAgICAgIGlmICghc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGRyb3B6b25lLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei51cGRhdGVGaWxlTGlzdCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5ydW5CdXR0b25FbmFibGVtZW50KHRoaXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbihcInJlbW92ZWRmaWxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnVwZGF0ZUZpbGVMaXN0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uKFwic2VuZGluZ1wiLCBmdW5jdGlvbihmaWxlLCB4aHIsIGZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJleHBsb2RlWmlwc1wiLCB0aGlzLmV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub24oXCJxdWV1ZWNvbXBsZXRlXCIsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAoPGFueT4kKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpKS5kcm9wem9uZShjb25maWcpO1xuICAgIH1cblxuICAgIHVwZGF0ZUZpbGVMaXN0ID0gKGRyb3B6b25lRXZ0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICB0aGlzLmZpbGVMaXN0ID0gZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpO1xuICAgICAgICB0aGlzLmZpbGVMaXN0ID0gdGhpcy5maWxlTGlzdC5jb25jYXQoZHJvcHpvbmVFdnQuZ2V0UXVldWVkRmlsZXMoKSk7XG5cbiAgICAgICAgLyogRGV0ZWN0IGlmIGFueSBaSVAgZmlsZXMgYXJlIGN1cnJlbnRseSBzZWxlY3RlZCwgYW5kIGFzayB1c2VyIHRoZSBxdWVzdGlvbiBhYm91dCB3aGV0aGVyIHRoZXlcbiAgICAgICAgc2hvdWxkIGJlIGV4dHJhY3RlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyB0aGUgdXBsb2FkLCBhbmQgdXBsb2FkZWQgYXMgaW5kaXZpZHVhbCBub2Rlc1xuICAgICAgICBmb3IgZWFjaCBmaWxlICovXG4gICAgICAgIGlmICghdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkICYmIHRoaXMuaGFzQW55WmlwRmlsZXMoKSkge1xuICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkV4cGxvZGUgWmlwcz9cIixcbiAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgIC8vWWVzIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAvL05vIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzQW55WmlwRmlsZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLmZpbGVMaXN0KSB7XG4gICAgICAgICAgICBpZiAoZmlsZVtcIm5hbWVcIl0udG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHJ1bkJ1dHRvbkVuYWJsZW1lbnQgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgIGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkQnV0dG9uXCIpKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuXG4gICAgICAgIHRoaXMuY29uZmlndXJlRHJvcFpvbmUoKTtcbiAgICB9XG59XG5jbGFzcyBVcGxvYWRGcm9tVXJsRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tVXJsRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgIHZhciB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICB2YXIgdXBsb2FkRnJvbVVybERpdiA9IFwiXCI7XG5cbiAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxGaWVsZCA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVwbG9hZCBGcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxcIik7XG4gICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICB9LCB1cGxvYWRGcm9tVXJsRmllbGQpO1xuXG4gICAgICAgIHZhciB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIHVwbG9hZEZpZWxkQ29udGFpbmVyICsgdXBsb2FkRnJvbVVybERpdiArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICB1cGxvYWRGaWxlTm93ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgc291cmNlVXJsID0gdGhpcy5nZXRJbnB1dFZhbChcInVwbG9hZEZyb21VcmxcIik7XG5cbiAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgIGlmIChzb3VyY2VVcmwpIHtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlVwbG9hZEZyb21VcmxSZXF1ZXN0LCBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZT4oXCJ1cGxvYWRGcm9tVXJsXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzb3VyY2VVcmxcIjogc291cmNlVXJsXG4gICAgICAgICAgICB9LCB0aGlzLnVwbG9hZEZyb21VcmxSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGxvYWRGcm9tVXJsUmVzcG9uc2UgPSAocmVzOiBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChcInVwbG9hZEZyb21VcmxcIiksIFwiXCIpO1xuXG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgfVxufVxuY2xhc3MgRWRpdE5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnRlbnRGaWVsZERvbUlkOiBzdHJpbmc7XG4gICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgcHJvcEVudHJpZXM6IEFycmF5PFByb3BFbnRyeT4gPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuICAgIGVkaXRQcm9wZXJ0eURsZ0luc3Q6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZU5hbWU/OiBzdHJpbmcsIHByaXZhdGUgY3JlYXRlQXRUb3A/OiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUHJvcGVydHkgZmllbGRzIGFyZSBnZW5lcmF0ZWQgZHluYW1pY2FsbHkgYW5kIHRoaXMgbWFwcyB0aGUgRE9NIElEcyBvZiBlYWNoIGZpZWxkIHRvIHRoZSBwcm9wZXJ0eSBvYmplY3QgaXRcbiAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICB2YXIgc2F2ZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlTm9kZUJ1dHRvblwiLCB0aGlzLnNhdmVOb2RlLCB0aGlzKTtcbiAgICAgICAgdmFyIGFkZFByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQWRkIFByb3BlcnR5XCIsIFwiYWRkUHJvcGVydHlCdXR0b25cIiwgdGhpcy5hZGRQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgdGhpcy5hZGRUYWdzUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgc3BsaXRDb250ZW50QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU3BsaXRcIiwgXCJzcGxpdENvbnRlbnRCdXR0b25cIiwgdGhpcy5zcGxpdENvbnRlbnQsIHRoaXMpO1xuICAgICAgICB2YXIgZGVsZXRlUHJvcEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkRlbGV0ZVwiLCBcImRlbGV0ZVByb3BCdXR0b25cIiwgdGhpcy5kZWxldGVQcm9wZXJ0eUJ1dHRvbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgdmFyIGNhbmNlbEVkaXRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRWRpdEJ1dHRvblwiLCB0aGlzLmNhbmNlbEVkaXQsIHRoaXMpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZU5vZGVCdXR0b24gKyBhZGRQcm9wZXJ0eUJ1dHRvbiArIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvbiArIGRlbGV0ZVByb3BCdXR0b25cbiAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgIC8qIHRvZG86IG5lZWQgc29tZXRoaW5nIGJldHRlciBmb3IgdGhpcyB3aGVuIHN1cHBvcnRpbmcgbW9iaWxlICovXG4gICAgICAgIHZhciB3aWR0aCA9IDgwMDsgLy93aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgdmFyIGhlaWdodCA9IDYwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgIH0pICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLFxuICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgc3R5bGU6IFwicGFkZGluZy1sZWZ0OiAwcHg7IG1heC13aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O3dpZHRoOjEwMCU7IG92ZXJmbG93OnNjcm9sbDsgYm9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XCIsXG4gICAgICAgICAgICBjbGFzczogXCJ2ZXJ0aWNhbC1sYXlvdXQtcm93XCJcbiAgICAgICAgICAgIC8vXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiXG4gICAgICAgIH0sIFwiTG9hZGluZy4uLlwiKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbmVyYXRlcyBhbGwgdGhlIEhUTUwgZWRpdCBmaWVsZHMgYW5kIHB1dHMgdGhlbSBpbnRvIHRoZSBET00gbW9kZWwgb2YgdGhlIHByb3BlcnR5IGVkaXRvciBkaWFsb2cgYm94LlxuICAgICAqXG4gICAgICovXG4gICAgcG9wdWxhdGVFZGl0Tm9kZVBnID0gKCkgPT4ge1xuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgLyogY2xlYXIgdGhpcyBtYXAgdG8gZ2V0IHJpZCBvZiBvbGQgcHJvcGVydGllcyAqL1xuICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgLyogZWRpdE5vZGUgd2lsbCBiZSBudWxsIGlmIHRoaXMgaXMgYSBuZXcgbm9kZSBiZWluZyBjcmVhdGVkICovXG4gICAgICAgIGlmIChlZGl0LmVkaXROb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgIC8qIGl0ZXJhdG9yIGZ1bmN0aW9uIHdpbGwgaGF2ZSB0aGUgd3JvbmcgJ3RoaXMnIHNvIHdlIHNhdmUgdGhlIHJpZ2h0IG9uZSAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZSwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIHZhciBhY2VGaWVsZHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBQcm9wZXJ0eUluZm8uamF2YSBvYmplY3RzXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2FybmluZyBlYWNoIGl0ZXJhdG9yIGxvb3AgaGFzIGl0cyBvd24gJ3RoaXMnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBpZiBwcm9wZXJ0eSBub3QgYWxsb3dlZCB0byBkaXNwbGF5IHJldHVybiB0byBieXBhc3MgdGhpcyBwcm9wZXJ0eS9pdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3AubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmaWVsZElkID0gdGhpei5pZChcImVkaXROb2RlVGV4dENvbnRlbnRcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIHZhciBpc011bHRpID0gcHJvcC52YWx1ZXMgJiYgcHJvcC52YWx1ZXMubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICB2YXIgaXNSZWFkT25seVByb3AgPSByZW5kZXIuaXNSZWFkT25seVByb3BlcnR5KHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcHJvcEVudHJ5OiBQcm9wRW50cnkgPSBuZXcgUHJvcEVudHJ5KGZpZWxkSWQsIHByb3AsIGlzTXVsdGksIGlzUmVhZE9ubHlQcm9wLCBpc0JpbmFyeVByb3AsIG51bGwpO1xuXG4gICAgICAgICAgICAgICAgdGhpei5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdID0gcHJvcEVudHJ5O1xuICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VNdWx0aVByb3BFZGl0b3IocHJvcEVudHJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeSwgYWNlRmllbGRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKCghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkgfHwgZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1IaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJzdHlsZVwiIDogXCJkaXNwbGF5OiBcIisgKCFyZE9ubHkgfHwgbWV0YTY0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcImlubGluZVwiIDogXCJub25lXCIpXG4gICAgICAgICAgICAgICAgfSwgZmllbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogRWRpdGluZyBhIG5ldyBub2RlICovXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdG9kby0wOiB0aGlzIGVudGlyZSBibG9jayBuZWVkcyByZXZpZXcgbm93IChyZWRlc2lnbilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBuZXcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkSWQgPSB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKTtcblxuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBcIlwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOZXcgTm9kZSBOYW1lXCJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSSdtIG5vdCBxdWl0ZSByZWFkeSB0byBhZGQgdGhpcyBidXR0b24geWV0LlxuICAgICAgICAvLyB2YXIgdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgIC8vICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnRvZ2dsZVNob3dSZWFkT25seSgpO1wiIC8vXG4gICAgICAgIC8vIH0sIC8vXG4gICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAvL1xuICAgICAgICAvLyBmaWVsZHMgKz0gdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b247XG5cbiAgICAgICAgLy9sZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG5cbiAgICAgICAgbGV0IHByb3BUYWJsZTogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlXCIsXG4gICAgICAgICAgICB9LCBmaWVsZHMpO1xuXG5cbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSwgcHJvcFRhYmxlKTtcblxuICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoYWNlRmllbGRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUodXRpbC51bmVuY29kZUh0bWwoYWNlRmllbGRzW2ldLnZhbCkpO1xuICAgICAgICAgICAgICAgIG1ldGE2NC5hY2VFZGl0b3JzQnlJZFthY2VGaWVsZHNbaV0uaWRdID0gZWRpdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluc3RyID0gZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUgPyAvL1xuICAgICAgICAgICAgXCJZb3UgbWF5IGxlYXZlIHRoaXMgZmllbGQgYmxhbmsgYW5kIGEgdW5pcXVlIElEIHdpbGwgYmUgYXNzaWduZWQuIFlvdSBvbmx5IG5lZWQgdG8gcHJvdmlkZSBhIG5hbWUgaWYgeW91IHdhbnQgdGhpcyBub2RlIHRvIGhhdmUgYSBtb3JlIG1lYW5pbmdmdWwgVVJMLlwiXG4gICAgICAgICAgICA6IC8vXG4gICAgICAgICAgICBcIlwiO1xuXG4gICAgICAgIHRoaXMuZWwoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKS5odG1sKGluc3RyKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBBbGxvdyBhZGRpbmcgb2YgbmV3IHByb3BlcnRpZXMgYXMgbG9uZyBhcyB0aGlzIGlzIGEgc2F2ZWQgbm9kZSB3ZSBhcmUgZWRpdGluZywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YXJ0XG4gICAgICAgICAqIG1hbmFnaW5nIG5ldyBwcm9wZXJ0aWVzIG9uIHRoZSBjbGllbnQgc2lkZS4gV2UgbmVlZCBhIGdlbnVpbmUgbm9kZSBhbHJlYWR5IHNhdmVkIG9uIHRoZSBzZXJ2ZXIgYmVmb3JlIHdlIGFsbG93XG4gICAgICAgICAqIGFueSBwcm9wZXJ0eSBlZGl0aW5nIHRvIGhhcHBlbi5cbiAgICAgICAgICovXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUJ1dHRvblwiKSwgIWVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKTtcblxuICAgICAgICB2YXIgdGFnc1Byb3BFeGlzdHMgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJ0YWdzXCIsIGVkaXQuZWRpdE5vZGUpICE9IG51bGw7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGFzVGFnc1Byb3A6IFwiICsgdGFnc1Byb3ApO1xuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIpLCAhdGFnc1Byb3BFeGlzdHMpO1xuICAgIH1cblxuICAgIHRvZ2dsZVNob3dSZWFkT25seSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLy8gYWxlcnQoXCJub3QgeWV0IGltcGxlbWVudGVkLlwiKTtcbiAgICAgICAgLy8gc2VlIHNhdmVFeGlzdGluZ05vZGUgZm9yIGhvdyB0byBpdGVyYXRlIGFsbCBwcm9wZXJ0aWVzLCBhbHRob3VnaCBJIHdvbmRlciB3aHkgSSBkaWRuJ3QganVzdCB1c2UgYSBtYXAvc2V0IG9mXG4gICAgICAgIC8vIHByb3BlcnRpZXMgZWxlbWVudHNcbiAgICAgICAgLy8gaW5zdGVhZCBzbyBJIGRvbid0IG5lZWQgdG8gcGFyc2UgYW55IERPTSBvciBkb21JZHMgaW5vcmRlciB0byBpdGVyYXRlIG92ZXIgdGhlIGxpc3Qgb2YgdGhlbT8/Pz9cbiAgICB9XG5cbiAgICBhZGRQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0ID0gbmV3IEVkaXRQcm9wZXJ0eURsZyh0aGlzKTtcbiAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0Lm9wZW4oKTtcbiAgICB9XG5cbiAgICBhZGRUYWdzUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoZWRpdC5lZGl0Tm9kZSwgXCJ0YWdzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IFwidGFnc1wiLFxuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogXCJcIlxuICAgICAgICB9O1xuICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5hZGRUYWdzUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkFkZCBUYWdzIFByb3BlcnR5XCIsIHJlcykpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBpZiAodGhpcy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdLnByb3BlcnR5O1xuXG4gICAgICAgIHZhciBpc011bHRpID0gdXRpbC5pc09iamVjdChwcm9wLnZhbHVlcyk7XG5cbiAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgaWYgKCFpc011bHRpKSB7XG4gICAgICAgICAgICBwcm9wLnZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgIHByb3AudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogbm93IGFkZCBuZXcgZW1wdHkgcHJvcGVydHkgYW5kIHBvcHVsYXRlIGl0IG9udG8gdGhlIHNjcmVlblxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICogcmVyZW5kZXJpbmcgdGhlIGVudGlyZSBlZGl0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZWxldGVzIHRoZSBwcm9wZXJ0eSBvZiB0aGUgc3BlY2lmaWVkIG5hbWUgb24gdGhlIG5vZGUgYmVpbmcgZWRpdGVkLCBidXQgZmlyc3QgZ2V0cyBjb25maXJtYXRpb24gZnJvbSB1c2VyXG4gICAgICovXG4gICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIHRoZSBQcm9wZXJ0eTogXCIgKyBwcm9wTmFtZSwgXCJZZXMsIGRlbGV0ZS5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZT4oXCJkZWxldGVQcm9wZXJ0eVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgXCJwcm9wTmFtZVwiOiBwcm9wTmFtZVxuICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkZWxldGVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55LCBwcm9wZXJ0eVRvRGVsZXRlOiBhbnkpID0+IHtcblxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgcHJvcGVydHlcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogcmVtb3ZlIGRlbGV0ZWQgcHJvcGVydHkgZnJvbSBjbGllbnQgc2lkZSBkYXRhLCBzbyB3ZSBjYW4gcmUtcmVuZGVyIHNjcmVlbiB3aXRob3V0IG1ha2luZyBhbm90aGVyIGNhbGwgdG9cbiAgICAgICAgICAgICAqIHNlcnZlclxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wcy5kZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlUb0RlbGV0ZSk7XG5cbiAgICAgICAgICAgIC8qIG5vdyBqdXN0IHJlLXJlbmRlciBzY3JlZW4gZnJvbSBsb2NhbCB2YXJpYWJsZXMgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCksIFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQpXTtcbiAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBzY2FuIGZvciBhbGwgbXVsdGktdmFsdWUgcHJvcGVydHkgZmllbGRzIGFuZCBjbGVhciB0aGVtICovXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkICsgXCJfc3ViUHJvcFwiICsgY291bnRlciksIFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBmb3Igbm93IGp1c3QgbGV0IHNlcnZlciBzaWRlIGNob2tlIG9uIGludmFsaWQgdGhpbmdzLiBJdCBoYXMgZW5vdWdoIHNlY3VyaXR5IGFuZCB2YWxpZGF0aW9uIHRvIGF0IGxlYXN0IHByb3RlY3RcbiAgICAgKiBpdHNlbGYgZnJvbSBhbnkga2luZCBvZiBkYW1hZ2UuXG4gICAgICovXG4gICAgc2F2ZU5vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIGVkaXRpbmcgYW4gdW5zYXZlZCBub2RlIGl0J3MgdGltZSB0byBydW4gdGhlIGluc2VydE5vZGUsIG9yIGNyZWF0ZVN1Yk5vZGUsIHdoaWNoIGFjdHVhbGx5IHNhdmVzIG9udG8gdGhlXG4gICAgICAgICAqIHNlcnZlciwgYW5kIHdpbGwgaW5pdGlhdGUgZnVydGhlciBlZGl0aW5nIGxpa2UgZm9yIHByb3BlcnRpZXMsIGV0Yy5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlTmV3Tm9kZS5cIik7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMDogbmVlZCB0byBtYWtlIHRoaXMgY29tcGF0aWJsZSB3aXRoIEFjZSBFZGl0b3IuXG4gICAgICAgICAgICB0aGlzLnNhdmVOZXdOb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgICogRWxzZSB3ZSBhcmUgZWRpdGluZyBhIHNhdmVkIG5vZGUsIHdoaWNoIGlzIGFscmVhZHkgc2F2ZWQgb24gc2VydmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGUuXCIpO1xuICAgICAgICAgICAgdGhpcy5zYXZlRXhpc3RpbmdOb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlTmV3Tm9kZSA9IChuZXdOb2RlTmFtZT86IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIW5ld05vZGVOYW1lKSB7XG4gICAgICAgICAgICBuZXdOb2RlTmFtZSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSWYgd2UgZGlkbid0IGNyZWF0ZSB0aGUgbm9kZSB3ZSBhcmUgaW5zZXJ0aW5nIHVuZGVyLCBhbmQgbmVpdGhlciBkaWQgXCJhZG1pblwiLCB0aGVuIHdlIG5lZWQgdG8gc2VuZCBub3RpZmljYXRpb25cbiAgICAgICAgICogZW1haWwgdXBvbiBzYXZpbmcgdGhpcyBuZXcgbm9kZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZXRhNjQudXNlck5hbWUgIT0gZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICYmIC8vXG4gICAgICAgICAgICBlZGl0LnBhcmVudE9mTmV3Tm9kZS5jcmVhdGVkQnkgIT0gXCJhZG1pblwiKSB7XG4gICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGVkaXQubm9kZUluc2VydFRhcmdldCkge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Tm9kZVJlcXVlc3QsIGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlPihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwicGFyZW50SWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJ0YXJnZXROYW1lXCI6IGVkaXQubm9kZUluc2VydFRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0aGlzLnR5cGVOYW1lID8gdGhpcy50eXBlTmFtZSA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCJcbiAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNyZWF0ZVN1Yk5vZGVSZXF1ZXN0LCBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZT4oXCJjcmVhdGVTdWJOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlQXRUb3BcIjogdGhpcy5jcmVhdGVBdFRvcFxuICAgICAgICAgICAgfSwgZWRpdC5jcmVhdGVTdWJOb2RlUmVzcG9uc2UsIGVkaXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZUV4aXN0aW5nTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgIC8qIGhvbGRzIGxpc3Qgb2YgcHJvcGVydGllcyB0byBzZW5kIHRvIHNlcnZlci4gRWFjaCBvbmUgaGF2aW5nIG5hbWUrdmFsdWUgcHJvcGVydGllcyAqL1xuICAgICAgICB2YXIgcHJvcGVydGllc0xpc3QgPSBbXTtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLnByb3BFbnRyaWVzLCBmdW5jdGlvbihpbmRleDogbnVtYmVyLCBwcm9wOiBhbnkpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0gR2V0dGluZyBwcm9wIGlkeDogXCIgKyBpbmRleCk7XG5cbiAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICBpZiAocHJvcC5yZWFkT25seSB8fCBwcm9wLmJpbmFyeSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG5vbi1tdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcblxuICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbcHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwcm9wVmFsICE9PSBwcm9wLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5wcm9wZXJ0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBtdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChwcm9wLnN1YlByb3BzLCBmdW5jdGlvbihpbmRleCwgc3ViUHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3ViUHJvcFtcIiArIGluZGV4ICsgXCJdOiBcIiArIEpTT04uc3RyaW5naWZ5KHN1YlByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbc3ViUHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIHN1YlByb3AgSUQ6IFwiICsgc3ViUHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQoc3ViUHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBzdWJQcm9wW1wiICsgaW5kZXggKyBcIl0gb2YgXCIgKyBwcm9wLm5hbWUgKyBcIiB2YWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHMucHVzaChwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgIC8qIGlmIGFueXRoaW5nIGNoYW5nZWQsIHNhdmUgdG8gc2VydmVyICovXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNMaXN0LFxuICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHNhdmVOb2RlKCkuIFBvc3REYXRhPVwiICsgdXRpbC50b0pzb24ocG9zdERhdGEpKTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICBzYXZlZElkOiBlZGl0LmVkaXROb2RlLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdGhpbmcgY2hhbmdlZC4gTm90aGluZyB0byBzYXZlLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ha2VNdWx0aVByb3BFZGl0b3IgPSAocHJvcEVudHJ5OiBQcm9wRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXMubGVuZ3RoKTtcbiAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgdmFyIHByb3BMaXN0ID0gcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlcztcbiAgICAgICAgaWYgKCFwcm9wTGlzdCB8fCBwcm9wTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgIHByb3BMaXN0LnB1c2goXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb3AgbXVsdGktdmFsW1wiICsgaSArIFwiXT1cIiArIHByb3BMaXN0W2ldKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuaWQocHJvcEVudHJ5LmlkICsgXCJfc3ViUHJvcFwiICsgaSk7XG5cbiAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsIHx8ICcnO1xuICAgICAgICAgICAgcHJvcFZhbFN0ciA9IHV0aWwuZXNjYXBlRm9yQXR0cmliKHByb3BWYWwpO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gKGkgPT0gMCA/IHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lIDogXCIqXCIpICsgXCIuXCIgKyBpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzLnB1c2goc3ViUHJvcCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb2wgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJkaXNwbGF5OiB0YWJsZS1jZWxsO1wiXG4gICAgICAgIH0sIGZpZWxkcyk7XG5cbiAgICAgICAgcmV0dXJuIGNvbDtcbiAgICB9XG5cbiAgICBtYWtlU2luZ2xlUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSwgYWNlRmllbGRzOiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IHNpbmdsZS10eXBlOiBcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZTtcbiAgICAgICAgdmFyIGxhYmVsID0gcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsID8gcHJvcFZhbCA6ICcnO1xuICAgICAgICBwcm9wVmFsU3RyID0gdXRpbC5lc2NhcGVGb3JBdHRyaWIocHJvcFZhbFN0cik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFraW5nIHNpbmdsZSBwcm9wIGVkaXRvcjogcHJvcFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCJdIHZhbFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgICAgKyBcIl0gZmllbGRJZD1cIiArIHByb3BFbnRyeS5pZCk7XG5cbiAgICAgICAgbGV0IHByb3BTZWxDaGVja2JveDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcFNlbENoZWNrYm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJcIiwgXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkucHJvcGVydHkubmFtZSA9PSBqY3JDbnN0LkNPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRGaWVsZERvbUlkID0gcHJvcEVudHJ5LmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWxDb2wgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogNDBweDsgZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweDtcIlxuICAgICAgICB9LCBwcm9wU2VsQ2hlY2tib3gpO1xuXG4gICAgICAgIGxldCBlZGl0Q29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6IDEwMCU7IGRpc3BsYXk6IHRhYmxlLWNlbGw7IHBhZGRpbmc6IDEwcHg7XCJcbiAgICAgICAgfSwgZmllbGQpO1xuXG4gICAgICAgIHJldHVybiBzZWxDb2wgKyBlZGl0Q29sO1xuICAgIH1cblxuICAgIGRlbGV0ZVByb3BlcnR5QnV0dG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgLyogSXRlcmF0ZSBvdmVyIGFsbCBwcm9wZXJ0aWVzICovXG4gICAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuZmllbGRJZFRvUHJvcE1hcCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRJZFRvUHJvcE1hcC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgIC8qIGdldCBQcm9wRW50cnkgZm9yIHRoaXMgaXRlbSAqL1xuICAgICAgICAgICAgICAgIGxldCBwcm9wRW50cnk6IFByb3BFbnRyeSA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtpZF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHJvcD1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbFByb3BEb21JZCA9IFwic2VsUHJvcF9cIiArIHByb3BFbnRyeS5pZDtcblxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICBHZXQgY2hlY2tib3ggY29udHJvbCBhbmQgaXRzIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHRvZG8tMTogZ2V0dGluZyB2YWx1ZSBvZiBjaGVja2JveCBzaG91bGQgYmUgaW4gc29tZSBzaGFyZWQgdXRpbGl0eSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbENoZWNrYm94ID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoc2VsUHJvcERvbUlkKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxDaGVja2JveCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQ6IGJvb2xlYW4gPSBzZWxDaGVja2JveC5ub2RlLmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcm9wIElTIENIRUNLRUQ9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcm9wZXJ0eShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBmb3Igbm93IGxldHMnIGp1c3Qgc3VwcG9ydCBkZWxldGluZyBvbmUgcHJvcGVydHkgYXQgYSB0aW1lLCBhbmQgc28gd2UgY2FuIHJldHVybiBvbmNlIHdlIGZvdW5kIGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkIG9uZSB0byBkZWxldGUuIFdvdWxkIGJlIGVhc3kgdG8gZXh0ZW5kIHRvIGFsbG93IG11bHRpcGxlLXNlbGVjdHMgaW4gdGhlIGZ1dHVyZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJwcm9wRW50cnkgbm90IGZvdW5kIGZvciBpZDogXCIgKyBpZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcHJvcGVydHk6IFwiKVxuICAgIH1cblxuICAgIHNwbGl0Q29udGVudCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICB1dGlsLmpzb248anNvbi5TcGxpdE5vZGVSZXF1ZXN0LCBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlPihcInNwbGl0Tm9kZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgIFwiZGVsaW1pdGVyXCI6IG51bGxcbiAgICAgICAgfSwgdGhpcy5zcGxpdENvbnRlbnRSZXNwb25zZSk7XG4gICAgfVxuXG4gICAgc3BsaXRDb250ZW50UmVzcG9uc2UgPSAocmVzOiBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNwbGl0IGNvbnRlbnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgaWYgKG1ldGE2NC50cmVlRGlydHkpIHtcbiAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXROb2RlRGxnLmluaXRcIik7XG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuY29udGVudEZpZWxkRG9tSWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKlxuICogUHJvcGVydHkgRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZSBQcm9wZXJ0aWVzKVxuICovXG5jbGFzcyBFZGl0UHJvcGVydHlEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgIHZhciBzYXZlUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJvcGVydHlCdXR0b25cIiwgdGhpcy5zYXZlUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgKyBcIicgY2xhc3M9J3BhdGgtZGlzcGxheS1pbi1lZGl0b3InPjwvZGl2PlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBmaWVsZCA9ICcnO1xuXG4gICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZpZWxkUHJvcE5hbWVJZCA9IFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BOYW1lSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcFZhbHVlSWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlZhbHVlXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZCk7XG4gICAgfVxuXG4gICAgc2F2ZVByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCIpKTtcbiAgICAgICAgdmFyIHByb3BlcnR5VmFsdWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCIpKTtcblxuICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZURhdGEsXG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBwcm9wZXJ0eVZhbHVlRGF0YVxuICAgICAgICB9O1xuICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBpZiAodGhpcy5lZGl0Tm9kZURsZy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuZWRpdE5vZGVEbGcucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVByb3BlcnR5RWRpdCgpO1xuICAgIH1cbn1cbmNsYXNzIFNoYXJlVG9QZXJzb25EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNoYXJlVG9QZXJzb25EbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNoYXJlIE5vZGUgdG8gUGVyc29uXCIpO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyIHRvIFNoYXJlIFdpdGhcIiwgXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNoYXJlTm9kZVRvUGVyc29uQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIFwiPHA+RW50ZXIgdGhlIHVzZXJuYW1lIG9mIHRoZSBwZXJzb24geW91IHdhbnQgdG8gc2hhcmUgdGhpcyBub2RlIHdpdGg6PC9wPlwiICsgZm9ybUNvbnRyb2xzXG4gICAgICAgICAgICArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBzaGFyZU5vZGVUb1BlcnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHRhcmdldFVzZXIgPSB0aGlzLmdldElucHV0VmFsKFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIHVzZXJuYW1lXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAqL1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IHRhcmdldFVzZXIsXG4gICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgIH1cblxuICAgIHJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24gPSAocmVzOiBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFNoYXJpbmdEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNoYXJpbmdEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk5vZGUgU2hhcmluZ1wiKTtcblxuICAgICAgICB2YXIgc2hhcmVXaXRoUGVyc29uQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2hhcmUgd2l0aCBQZXJzb25cIiwgXCJzaGFyZU5vZGVUb1BlcnNvblBnQnV0dG9uXCIsXG4gICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICB2YXIgbWFrZVB1YmxpY0J1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHRvIFB1YmxpY1wiLCBcInNoYXJlTm9kZVRvUHVibGljQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QdWJsaWMsXG4gICAgICAgICAgICB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVXaXRoUGVyc29uQnV0dG9uICsgbWFrZVB1YmxpY0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJzaGFyZU5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2Rpdj5cIiArIC8vXG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J3ZlcnRpY2FsLWxheW91dC1yb3cnIHN0eWxlPVxcXCJ3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDtib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcXFwiIGlkPSdcIlxuICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICovXG4gICAgcmVsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGFuZGxlcyBnZXROb2RlUHJpdmlsZWdlcyByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIHJlcz1qc29uIG9mIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UuamF2YVxuICAgICAqXG4gICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgKi9cbiAgICBnZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAqL1xuICAgIHBvcHVsYXRlU2hhcmluZ1BnID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgdmFyIFRoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuZWFjaChyZXMuYWNsRW50cmllcywgZnVuY3Rpb24oaW5kZXgsIGFjbEVudHJ5KSB7XG4gICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1saXN0XCJcbiAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHVibGljQXBwZW5kQXR0cnMgPSB7XG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkKCk7XCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChyZXMucHVibGljQXBwZW5kKSB7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG86IHVzZSBhY3R1YWwgcG9seW1lciBwYXBlci1jaGVja2JveCBoZXJlICovXG4gICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgXCJmb3JcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpLCBodG1sKTtcbiAgICB9XG5cbiAgICBwdWJsaWNDb21tZW50aW5nQ2hhbmdlZCA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBVc2luZyBvbkNsaWNrIG9uIHRoZSBlbGVtZW50IEFORCB0aGlzIHRpbWVvdXQgaXMgdGhlIG9ubHkgaGFjayBJIGNvdWxkIGZpbmQgdG8gZ2V0IGdldCB3aGF0IGFtb3VudHMgdG8gYSBzdGF0ZVxuICAgICAgICAgKiBjaGFuZ2UgbGlzdGVuZXIgb24gYSBwYXBlci1jaGVja2JveC4gVGhlIGRvY3VtZW50ZWQgb24tY2hhbmdlIGxpc3RlbmVyIHNpbXBseSBkb2Vzbid0IHdvcmsgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICogc2ltcGx5IGEgYnVnIGluIGdvb2dsZSBjb2RlIEFGQUlLLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpei5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKSk7XG5cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiAocG9seUVsbS5ub2RlLmNoZWNrZWQgPyB0cnVlIDogZmFsc2UpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCAyNTApO1xuICAgIH1cblxuICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCwganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZT4oXCJyZW1vdmVQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICBcInByaW5jaXBhbFwiOiBwcmluY2lwYWwsXG4gICAgICAgICAgICBcInByaXZpbGVnZVwiOiBwcml2aWxlZ2VcbiAgICAgICAgfSwgdGhpcy5yZW1vdmVQcml2aWxlZ2VSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlKTogdm9pZCA9PiB7XG5cbiAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUucGF0aCxcbiAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZW5kZXJBY2xQcml2aWxlZ2VzID0gKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXoubWFrZUJ1dHRvbihcIlJlbW92ZVwiLCBcInJlbW92ZVByaXZCdXR0b25cIiwgLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICArIFwiJyk7XCIpO1xuXG4gICAgICAgICAgICB2YXIgcm93ID0gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQocmVtb3ZlQnV0dG9uKTtcblxuICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtZW50cnlcIlxuICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QZXJzb25QZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgKG5ldyBTaGFyZVRvUGVyc29uRGxnKCkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBzaGFyZU5vZGVUb1B1YmxpYyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTaGFyaW5nIG5vZGUgdG8gcHVibGljLlwiKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAqL1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBBZGQgcHJpdmlsZWdlIGFuZCB0aGVuIHJlbG9hZCBzaGFyZSBub2RlcyBkaWFsb2cgZnJvbSBzY3JhdGNoIGRvaW5nIGFub3RoZXIgY2FsbGJhY2sgdG8gc2VydmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE86IHRoaXMgYWRkaXRpb25hbCBjYWxsIGNhbiBiZSBhdm9pZGVkIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICBcInByaW5jaXBhbFwiOiBcImV2ZXJ5b25lXCIsXG4gICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiXSxcbiAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IGZhbHNlXG4gICAgICAgIH0sIHRoaXMucmVsb2FkLCB0aGlzKTtcbiAgICB9XG59XG5jbGFzcyBSZW5hbWVOb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiUmVuYW1lTm9kZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVuYW1lIE5vZGVcIik7XG5cbiAgICAgICAgdmFyIGN1ck5vZGVOYW1lRGlzcGxheSA9IFwiPGgzIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9oMz5cIjtcbiAgICAgICAgdmFyIGN1ck5vZGVQYXRoRGlzcGxheSA9IFwiPGg0IGNsYXNzPSdwYXRoLWRpc3BsYXknIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikgKyBcIic+PC9oND5cIjtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW50ZXIgbmV3IG5hbWUgZm9yIHRoZSBub2RlXCIsIFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgdmFyIHJlbmFtZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVCdXR0b25cIiwgdGhpcy5yZW5hbWVOb2RlLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVuYW1lTm9kZUJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZW5hbWVOb2RlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGN1ck5vZGVOYW1lRGlzcGxheSArIGN1ck5vZGVQYXRoRGlzcGxheSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICByZW5hbWVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgbmV3TmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJuZXdOb2RlTmFtZUVkaXRGaWVsZFwiKTtcblxuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmV3IG5vZGUgbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlbGVjdCBhIG5vZGUgdG8gcmVuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogaWYgbm8gbm9kZSBiZWxvdyB0aGlzIG5vZGUsIHJldHVybnMgbnVsbCAqL1xuICAgICAgICB2YXIgbm9kZUJlbG93ID0gZWRpdC5nZXROb2RlQmVsb3coaGlnaGxpZ2h0Tm9kZSk7XG5cbiAgICAgICAgdmFyIHJlbmFtaW5nUm9vdE5vZGUgPSAoaGlnaGxpZ2h0Tm9kZS5pZCA9PT0gbWV0YTY0LmN1cnJlbnROb2RlSWQpO1xuXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuYW1lTm9kZVJlcXVlc3QsIGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlPihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXoucmVuYW1lTm9kZVJlc3BvbnNlKHJlcywgcmVuYW1pbmdSb290Tm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmFtZU5vZGVSZXNwb25zZSA9IChyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlLCByZW5hbWluZ1BhZ2VSb290OiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlbmFtZSBub2RlXCIsIHJlcykpIHtcbiAgICAgICAgICAgIGlmIChyZW5hbWluZ1BhZ2VSb290KSB7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShyZXMubmV3SWQsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCByZXMubmV3SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpKS5odG1sKFwiTmFtZTogXCIgKyBoaWdobGlnaHROb2RlLm5hbWUpO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgaGlnaGxpZ2h0Tm9kZS5wYXRoKTtcbiAgICB9XG59XG5cclxuLyogVGhpcyBpcyBhbiBhdWRpbyBwbGF5ZXIgZGlhbG9nIHRoYXQgaGFzIGFkLXNraXBwaW5nIHRlY2hub2xvZ3kgcHJvdmlkZWQgYnkgcG9kY2FzdC50cyAqL1xyXG5jbGFzcyBBdWRpb1BsYXllckRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc291cmNlVXJsOiBzdHJpbmcsIHByaXZhdGUgbm9kZVVpZDogc3RyaW5nLCBwcml2YXRlIHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKFwiQXVkaW9QbGF5ZXJEbGdcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHN0YXJ0VGltZVBlbmRpbmcgaW4gY29uc3RydWN0b3I6ICR7c3RhcnRUaW1lUGVuZGluZ31gKTtcclxuICAgICAgICBwb2RjYXN0LnN0YXJ0VGltZVBlbmRpbmcgPSBzdGFydFRpbWVQZW5kaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFdoZW4gdGhlIGRpYWxvZyBjbG9zZXMgd2UgbmVlZCB0byBzdG9wIGFuZCByZW1vdmUgdGhlIHBsYXllciAqL1xyXG4gICAgcHVibGljIGNhbmNlbCgpIHtcclxuICAgICAgICBzdXBlci5jYW5jZWwoKTtcclxuICAgICAgICBsZXQgcGxheWVyID0gJChcIiNcIiArIHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSk7XHJcbiAgICAgICAgaWYgKHBsYXllciAmJiBwbGF5ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvKiBmb3Igc29tZSByZWFzb24gdGhlIGF1ZGlvIHBsYXllciBuZWVkcyB0byBiZSBhY2Nlc3NlZCBsaWtlIGl0J3MgYW4gYXJyYXkgKi9cclxuICAgICAgICAgICAgKDxhbnk+cGxheWVyWzBdKS5wYXVzZSgpO1xyXG4gICAgICAgICAgICBwbGF5ZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkF1ZGlvIFBsYXllclwiKTtcclxuXHJcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3RoaXMubm9kZVVpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHRocm93IGB1bmtub3duIG5vZGUgdWlkOiAke3RoaXMubm9kZVVpZH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XHJcblxyXG4gICAgICAgIC8qIFRoaXMgaXMgd2hlcmUgSSBuZWVkIGEgc2hvcnQgbmFtZSBvZiB0aGUgbWVkaWEgYmVpbmcgcGxheWVkICovXHJcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG4gICAgICAgIH0sIHJzc1RpdGxlLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy9yZWZlcmVuY2VzOlxyXG4gICAgICAgIC8vaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvcmVmX2F2X2RvbS5hc3BcclxuICAgICAgICAvL2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQXVkaW9fQVBJXHJcbiAgICAgICAgbGV0IHBsYXllckF0dHJpYnM6IGFueSA9IHtcclxuICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpLFxyXG4gICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6IDEwMCU7IHBhZGRpbmc6MHB4OyBtYXJnaW4tdG9wOiAwcHg7IG1hcmdpbi1sZWZ0OiAwcHg7IG1hcmdpbi1yaWdodDogMHB4O1wiLFxyXG4gICAgICAgICAgICBcIm9udGltZXVwZGF0ZVwiOiBgcG9kY2FzdC5vblRpbWVVcGRhdGUoJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgIFwib25jYW5wbGF5XCI6IGBwb2RjYXN0Lm9uQ2FuUGxheSgnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgXCJjb250cm9sc1wiOiBcImNvbnRyb2xzXCIsXHJcbiAgICAgICAgICAgIFwicHJlbG9hZFwiOiBcImF1dG9cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBwbGF5ZXIgPSByZW5kZXIudGFnKFwiYXVkaW9cIiwgcGxheWVyQXR0cmlicyk7XHJcblxyXG4gICAgICAgIC8vU2tpcHBpbmcgQnV0dG9uc1xyXG4gICAgICAgIGxldCBza2lwQmFjazMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBgcG9kY2FzdC5za2lwKC0zMCwgJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCI8IDMwc1wiKTtcclxuXHJcbiAgICAgICAgbGV0IHNraXBGb3J3YXJkMzBCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBwb2RjYXN0LnNraXAoMzAsICcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiMzBzID5cIik7XHJcblxyXG4gICAgICAgIGxldCBza2lwQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNraXBCYWNrMzBCdXR0b24gKyBza2lwRm9yd2FyZDMwQnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy9TcGVlZCBCdXR0b25zXHJcbiAgICAgICAgbGV0IHNwZWVkTm9ybWFsQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3Quc3BlZWQoMS4wKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIk5vcm1hbFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwZWVkMTVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwicG9kY2FzdC5zcGVlZCgxLjUpO1wiLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiMS41WFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwZWVkMnhCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwicG9kY2FzdC5zcGVlZCgyKTtcIixcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICBcIjJYXCIpO1xyXG5cclxuICAgICAgICBsZXQgc3BlZWRCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc3BlZWROb3JtYWxCdXR0b24gKyBzcGVlZDE1QnV0dG9uICsgc3BlZWQyeEJ1dHRvbik7XHJcblxyXG4gICAgICAgIC8vRGlhbG9nIEJ1dHRvbnNcclxuICAgICAgICBsZXQgcGF1c2VCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwicG9kY2FzdC5wYXVzZSgpO1wiLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgIFwiUGF1c2VcIik7XHJcblxyXG4gICAgICAgIGxldCBwbGF5QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcInBvZGNhc3QucGxheSgpO1wiLFxyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwicGxheUJ1dHRvblwiXHJcbiAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgXCJQbGF5XCIpO1xyXG5cclxuICAgICAgICAvL3RvZG8tMDogZXZlbiBpZiB0aGlzIGJ1dHRvbiBhcHBlYXJzIHRvIHdvcmssIEkgbmVlZCBpdCB0byBleHBsaWNpdGx5IGVuZm9yY2UgdGhlIHNhdmluZyBvZiB0aGUgdGltZXZhbHVlIEFORCB0aGUgcmVtb3ZhbCBvZiB0aGUgQVVESU8gZWxlbWVudCBmcm9tIHRoZSBET00gKi9cclxuICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocGxheUJ1dHRvbiArIHBhdXNlQnV0dG9uICsgY2xvc2VCdXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgZGVzY3JpcHRpb24gKyBwbGF5ZXIgKyBza2lwQnV0dG9uQmFyICsgc3BlZWRCdXR0b25CYXIgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VFdmVudCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VCdG4gPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgQ3JlYXRlTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgbGFzdFNlbERvbUlkOiBzdHJpbmc7XG4gICAgbGFzdFNlbFR5cGVOYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJDcmVhdGVOb2RlRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJDcmVhdGUgTmV3IE5vZGVcIik7XG5cbiAgICAgICAgbGV0IGNyZWF0ZUZpcnN0Q2hpbGRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkZpcnN0XCIsIFwiY3JlYXRlRmlyc3RDaGlsZEJ1dHRvblwiLCB0aGlzLmNyZWF0ZUZpcnN0Q2hpbGQsIHRoaXMsIHRydWUsIDEwMDApO1xuICAgICAgICBsZXQgY3JlYXRlTGFzdENoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJMYXN0XCIsIFwiY3JlYXRlTGFzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlTGFzdENoaWxkLCB0aGlzKTtcbiAgICAgICAgbGV0IGNyZWF0ZUlubGluZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiSW5saW5lXCIsIFwiY3JlYXRlSW5saW5lQnV0dG9uXCIsIHRoaXMuY3JlYXRlSW5saW5lLCB0aGlzKTtcbiAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbEJ1dHRvblwiKTtcbiAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjcmVhdGVGaXJzdENoaWxkQnV0dG9uICsgY3JlYXRlTGFzdENoaWxkQnV0dG9uICsgY3JlYXRlSW5saW5lQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgbGV0IGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBsZXQgdHlwZUlkeCA9IDA7XG4gICAgICAgIC8qIHRvZG8tMTogbmVlZCBhIGJldHRlciB3YXkgdG8gZW51bWVyYXRlIGFuZCBhZGQgdGhlIHR5cGVzIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBzZWFyY2ggKi9cbiAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlN0YW5kYXJkIFR5cGVcIiwgXCJudDp1bnN0cnVjdHVyZWRcIiwgdHlwZUlkeCsrLCB0cnVlKTtcbiAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlJTUyBGZWVkXCIsIFwibWV0YTY0OnJzc2ZlZWRcIiwgdHlwZUlkeCsrLCBmYWxzZSk7XG4gICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTeXN0ZW0gRm9sZGVyXCIsIFwibWV0YTY0OnN5c3RlbWZvbGRlclwiLCB0eXBlSWR4KyssIGZhbHNlKTtcblxuICAgICAgICB2YXIgbGlzdEJveCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3RCb3hcIlxuICAgICAgICB9LCBjb250ZW50KTtcblxuICAgICAgICB2YXIgbWFpbkNvbnRlbnQ6IHN0cmluZyA9IGxpc3RCb3g7XG5cbiAgICAgICAgdmFyIGNlbnRlcmVkSGVhZGVyOiBzdHJpbmcgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjZW50ZXJlZFRpdGxlXCJcbiAgICAgICAgfSwgaGVhZGVyKTtcblxuICAgICAgICByZXR1cm4gY2VudGVyZWRIZWFkZXIgKyBtYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBtYWtlTGlzdEl0ZW0odmFsOiBzdHJpbmcsIHR5cGVOYW1lOiBzdHJpbmcsIHR5cGVJZHg6IG51bWJlciwgaW5pdGlhbGx5U2VsZWN0ZWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcGF5bG9hZDogT2JqZWN0ID0ge1xuICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0eXBlTmFtZSxcbiAgICAgICAgICAgIFwidHlwZUlkeFwiOiB0eXBlSWR4XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGRpdklkOiBzdHJpbmcgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgdHlwZUlkeCk7XG5cbiAgICAgICAgaWYgKGluaXRpYWxseVNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxUeXBlTmFtZSA9IHR5cGVOYW1lO1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsRG9tSWQgPSBkaXZJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0SXRlbVwiICsgKGluaXRpYWxseVNlbGVjdGVkID8gXCIgc2VsZWN0ZWRMaXN0SXRlbVwiIDogXCJcIiksXG4gICAgICAgICAgICBcImlkXCI6IGRpdklkLFxuICAgICAgICAgICAgXCJvbmNsaWNrXCI6IG1ldGE2NC5lbmNvZGVPbkNsaWNrKHRoaXMub25Sb3dDbGljaywgdGhpcywgcGF5bG9hZClcbiAgICAgICAgfSwgdmFsKTtcbiAgICB9XG5cbiAgICBjcmVhdGVGaXJzdENoaWxkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlTGFzdENoaWxkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZUlubGluZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlZGl0Lmluc2VydE5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUpO1xuICAgIH1cblxuICAgIG9uUm93Q2xpY2sgPSAocGF5bG9hZDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGxldCBkaXZJZCA9IHRoaXMuaWQoXCJ0eXBlUm93XCIgKyBwYXlsb2FkLnR5cGVJZHgpO1xuICAgICAgICB0aGlzLmxhc3RTZWxUeXBlTmFtZSA9IHBheWxvYWQudHlwZU5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMubGFzdFNlbERvbUlkKSB7XG4gICAgICAgICAgICB0aGlzLmVsKHRoaXMubGFzdFNlbERvbUlkKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0U2VsRG9tSWQgPSBkaXZJZDtcbiAgICAgICAgdGhpcy5lbChkaXZJZCkuYWRkQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgbGV0IGNhbkluc2VydElubGluZTogYm9vbGVhbiA9IG1ldGE2NC5ob21lTm9kZUlkICE9IG5vZGUuaWQ7XG4gICAgICAgICAgICBpZiAoY2FuSW5zZXJ0SW5saW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbChcImNyZWF0ZUlubGluZUJ1dHRvblwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsKFwiY3JlYXRlSW5saW5lQnV0dG9uXCIpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFNlYXJjaFJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICB0YWJJZDogc3RyaW5nID0gXCJzZWFyY2hUYWJOYW1lXCI7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSdzZWFyY2hQYWdlVGl0bGUnIGNsYXNzPSdwYWdlLXRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0nc2VhcmNoUmVzdWx0c1ZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgIH07XHJcblxyXG4gICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC5zZWFyY2hSZXN1bHRzLCBcInNlYXJjaFJlc3VsdHNWaWV3XCIpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFRpbWVsaW5lUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICBkb21JZDogc3RyaW5nID0gXCJ0aW1lbGluZVJlc3VsdHNQYW5lbFwiO1xyXG4gICAgdGFiSWQ6IHN0cmluZyA9IFwidGltZWxpbmVUYWJOYW1lXCI7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZScgY2xhc3M9J3BhZ2UtdGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSd0aW1lbGluZVZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC50aW1lbGluZVJlc3VsdHMsIFwidGltZWxpbmVWaWV3XCIpO1xyXG4gICAgfVxyXG59XG5cbm1ldGE2NC5pbml0QXBwKCk7XG4iXX0=