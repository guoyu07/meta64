var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
"use strict";
console.log("running app.js");
var addEvent = function (object, type, callback) {
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
function windowResize() {
}
addEvent(window, "resize", windowResize);
window.addEventListener('polymer-ready', function (e) {
    console.log('polymer-ready event!');
});
console.log("running module: cnst.js");
var m64;
(function (m64) {
    var cnst;
    (function (cnst) {
        cnst.ANON = "anonymous";
        cnst.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
        cnst.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
        cnst.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
        cnst.INSERT_ATTACHMENT = "{{insert-attachment}}";
        cnst.NEW_ON_TOOLBAR = true;
        cnst.INS_ON_TOOLBAR = true;
        cnst.MOVE_UPDOWN_ON_TOOLBAR = true;
        cnst.USE_ACE_EDITOR = false;
        cnst.SHOW_PATH_ON_ROWS = true;
        cnst.SHOW_PATH_IN_DLGS = true;
        cnst.SHOW_CLEAR_BUTTON_IN_EDITOR = false;
    })(cnst = m64.cnst || (m64.cnst = {}));
})(m64 || (m64 = {}));
var m64;
(function (m64) {
    var AdSegment = (function () {
        function AdSegment(beginTime, endTime) {
            this.beginTime = beginTime;
            this.endTime = endTime;
        }
        return AdSegment;
    }());
    m64.AdSegment = AdSegment;
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
    m64.PropEntry = PropEntry;
    var SubProp = (function () {
        function SubProp(id, val) {
            this.id = id;
            this.val = val;
        }
        return SubProp;
    }());
    m64.SubProp = SubProp;
})(m64 || (m64 = {}));
console.log("running module: util.js");
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
;
Array.prototype.clone = function () {
    return this.slice(0);
};
Array.prototype.indexOfItemByProp = function (propName, propVal) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i][propName] === propVal) {
            return i;
        }
    }
    return -1;
};
Array.prototype.arrayMoveItem = function (fromIndex, toIndex) {
    this.splice(toIndex, 0, this.splice(fromIndex, 1)[0]);
};
if (typeof Array.prototype.indexOfObject != 'function') {
    Array.prototype.indexOfObject = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}
;
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Date.prototype.dst = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) === 0;
    };
}
if (typeof String.prototype.stripIfStartsWith != 'function') {
    String.prototype.stripIfStartsWith = function (str) {
        if (this.startsWith(str)) {
            return this.substring(str.length);
        }
        return this;
    };
}
if (typeof String.prototype.contains != 'function') {
    String.prototype.contains = function (str) {
        return this.indexOf(str) != -1;
    };
}
if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (find, replace) {
        return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    };
}
if (typeof String.prototype.unencodeHtml != 'function') {
    String.prototype.unencodeHtml = function () {
        if (!this.contains("&"))
            return this;
        return this.replaceAll('&amp;', '&')
            .replaceAll('&gt;', '>')
            .replaceAll('&lt;', '<')
            .replaceAll('&quot;', '"')
            .replaceAll('&#39;', "'");
    };
}
if (typeof String.prototype.escapeForAttrib != 'function') {
    String.prototype.escapeForAttrib = function () {
        return this.replaceAll("\"", "&quot;");
    };
}
var m64;
(function (m64) {
    var util;
    (function (util) {
        util.logAjax = false;
        util.timeoutMessageShown = false;
        util.offline = false;
        util.waitCounter = 0;
        util.pgrsDlg = null;
        util.assertNotNull = function (varName) {
            if (typeof eval(varName) === 'undefined') {
                (new m64.MessageDlg("Variable not found: " + varName)).open();
            }
        };
        var _ajaxCounter = 0;
        util.daylightSavingsTime = (new Date().dst()) ? true : false;
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
                        util.pgrsDlg = new m64.ProgressDlg();
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
                            (new m64.MessageDlg("Session timed out. Page will refresh.")).open();
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
                    (new m64.MessageDlg(msg)).open();
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
                stack = (new Error()).stack;
            }
            catch (e) { }
            console.error(message + "STACK: " + stack);
            throw message;
        };
        util.logAndReThrow = function (message, exception) {
            var stack = "[stack, not supported]";
            try {
                stack = (new Error()).stack;
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
            }, 1000);
        };
        util.checkSuccess = function (opFriendlyName, res) {
            if (!res.success) {
                (new m64.MessageDlg(opFriendlyName + " failed: " + res.message)).open();
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
                uid = "" + m64.meta64.nextUid++;
                map[id] = uid;
            }
            return uid;
        };
        util.elementExists = function (id) {
            if (id.startsWith("#")) {
                id = id.substring(1);
            }
            if (id.contains("#")) {
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
            if (id.startsWith("#")) {
                id = id.substring(1);
            }
            if (id.contains("#")) {
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
            if (id.startsWith("#")) {
                id = id.substring(1);
            }
            if (id.contains("#")) {
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
                (new m64.MessageDlg(msg)).open();
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
    })(util = m64.util || (m64.util = {}));
})(m64 || (m64 = {}));
console.log("running module: jcrCnst.js");
var m64;
(function (m64) {
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
        jcrCnst.JSON_FILE_SEARCH_RESULT = "jsonFileSearchResult";
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
    })(jcrCnst = m64.jcrCnst || (m64.jcrCnst = {}));
})(m64 || (m64 = {}));
console.log("running module: attachment.js");
var m64;
(function (m64) {
    var attachment;
    (function (attachment) {
        attachment.uploadNode = null;
        attachment.openUploadFromFileDlg = function () {
            var node = m64.meta64.getHighlightedNode();
            console.log("running m64.namespace version!");
            if (!node) {
                attachment.uploadNode = null;
                (new m64.MessageDlg("No node is selected.")).open();
                return;
            }
            attachment.uploadNode = node;
            (new m64.UploadFromFileDropzoneDlg()).open();
        };
        attachment.openUploadFromUrlDlg = function () {
            var node = m64.meta64.getHighlightedNode();
            if (!node) {
                attachment.uploadNode = null;
                (new m64.MessageDlg("No node is selected.")).open();
                return;
            }
            attachment.uploadNode = node;
            (new m64.UploadFromUrlDlg()).open();
        };
        attachment.deleteAttachment = function () {
            var node = m64.meta64.getHighlightedNode();
            if (node) {
                (new m64.ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                    m64.util.json("deleteAttachment", {
                        "nodeId": node.id
                    }, attachment.deleteAttachmentResponse, null, node.uid);
                })).open();
            }
        };
        attachment.deleteAttachmentResponse = function (res, uid) {
            if (m64.util.checkSuccess("Delete attachment", res)) {
                m64.meta64.removeBinaryByUid(uid);
                m64.meta64.goToMainPage(true);
            }
        };
    })(attachment = m64.attachment || (m64.attachment = {}));
})(m64 || (m64 = {}));
console.log("running module: edit.js");
var m64;
(function (m64) {
    var edit;
    (function (edit) {
        edit.createNode = function () {
            (new m64.CreateNodeDlg()).open();
        };
        var insertBookResponse = function (res) {
            console.log("insertBookResponse running.");
            m64.util.checkSuccess("Insert Book", res);
            m64.view.refreshTree(null, false);
            m64.meta64.selectTab("mainTabName");
            m64.view.scrollToSelectedNode();
        };
        var deleteNodesResponse = function (res, payload) {
            if (m64.util.checkSuccess("Delete node", res)) {
                m64.meta64.clearSelectedNodes();
                var highlightId = null;
                if (payload) {
                    var selNode = payload["postDeleteSelNode"];
                    if (selNode) {
                        highlightId = selNode.id;
                    }
                }
                m64.view.refreshTree(null, false, highlightId);
            }
        };
        var initNodeEditResponse = function (res) {
            if (m64.util.checkSuccess("Editing node", res)) {
                var node = res.nodeInfo;
                var isRep = node.name.startsWith("rep:") || node.path.contains("/rep:");
                var editingAllowed = m64.props.isOwnedCommentNode(node);
                if (!editingAllowed) {
                    editingAllowed = (m64.meta64.isAdminUser || !isRep) && !m64.props.isNonOwnedCommentNode(node)
                        && !m64.props.isNonOwnedNode(node);
                }
                if (editingAllowed) {
                    edit.editNode = res.nodeInfo;
                    edit.editNodeDlgInst = new m64.EditNodeDlg();
                    edit.editNodeDlgInst.open();
                }
                else {
                    (new m64.MessageDlg("You cannot edit nodes that you don't own.")).open();
                }
            }
        };
        var moveNodesResponse = function (res) {
            if (m64.util.checkSuccess("Move nodes", res)) {
                edit.nodesToMove = null;
                m64.view.refreshTree(null, false);
            }
        };
        var setNodePositionResponse = function (res) {
            if (m64.util.checkSuccess("Change node position", res)) {
                m64.meta64.refresh();
            }
        };
        edit.showReadOnlyProperties = true;
        edit.nodesToMove = null;
        edit.parentOfNewNode = null;
        edit.editingUnsavedNode = false;
        edit.sendNotificationPendingSave = false;
        edit.editNode = null;
        edit.editNodeDlgInst = null;
        edit.nodeInsertTarget = null;
        edit.isEditAllowed = function (node) {
            return m64.meta64.userPreferences.editMode && node.path != "/" &&
                (!m64.props.isNonOwnedCommentNode(node) || m64.props.isOwnedCommentNode(node))
                && !m64.props.isNonOwnedNode(node);
        };
        edit.isInsertAllowed = function (node) {
            return m64.props.getNodePropertyVal(m64.jcrCnst.DISABLE_INSERT, node) == null;
        };
        edit.startEditingNewNode = function () {
            edit.editingUnsavedNode = false;
            edit.editNode = null;
            edit.editNodeDlgInst = new m64.EditNodeDlg();
            edit.editNodeDlgInst.saveNewNode("");
        };
        edit.startEditingNewNodeWithName = function () {
            edit.editingUnsavedNode = true;
            edit.editNode = null;
            edit.editNodeDlgInst = new m64.EditNodeDlg();
            edit.editNodeDlgInst.open();
        };
        edit.insertNodeResponse = function (res) {
            if (m64.util.checkSuccess("Insert node", res)) {
                m64.meta64.initNode(res.newNode, true);
                m64.meta64.highlightNode(res.newNode, true);
                edit.runEditNode(res.newNode.uid);
            }
        };
        edit.createSubNodeResponse = function (res) {
            if (m64.util.checkSuccess("Create subnode", res)) {
                m64.meta64.initNode(res.newNode, true);
                edit.runEditNode(res.newNode.uid);
            }
        };
        edit.saveNodeResponse = function (res, payload) {
            if (m64.util.checkSuccess("Save node", res)) {
                m64.view.refreshTree(null, false, payload.savedId);
                m64.meta64.selectTab("mainTabName");
            }
        };
        edit.editMode = function (modeVal) {
            if (typeof modeVal != 'undefined') {
                m64.meta64.userPreferences.editMode = modeVal;
            }
            else {
                m64.meta64.userPreferences.editMode = m64.meta64.userPreferences.editMode ? false : true;
            }
            m64.render.renderPageFromData();
            m64.view.scrollToSelectedNode();
            m64.meta64.saveUserPreferences();
        };
        edit.moveNodeUp = function (uid) {
            if (!uid) {
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                var nodeAbove = edit.getNodeAbove(node);
                if (nodeAbove == null) {
                    return;
                }
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": nodeAbove.name
                }, setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        edit.moveNodeDown = function (uid) {
            if (!uid) {
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                var nodeBelow = edit.getNodeBelow(node);
                if (nodeBelow == null) {
                    return;
                }
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeData.node.id,
                    "nodeId": nodeBelow.name,
                    "siblingId": node.name
                }, setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        edit.moveNodeToTop = function (uid) {
            if (!uid) {
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                var topNode = edit.getFirstChildNode();
                if (topNode == null) {
                    return;
                }
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": topNode.name
                }, setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        edit.moveNodeToBottom = function (uid) {
            if (!uid) {
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeData.node.id,
                    "nodeId": node.name,
                    "siblingId": null
                }, setNodePositionResponse);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        edit.getNodeAbove = function (node) {
            var ordinal = m64.meta64.getOrdinalOfNode(node);
            if (ordinal <= 0)
                return null;
            return m64.meta64.currentNodeData.children[ordinal - 1];
        };
        edit.getNodeBelow = function (node) {
            var ordinal = m64.meta64.getOrdinalOfNode(node);
            console.log("ordinal = " + ordinal);
            if (ordinal == -1 || ordinal >= m64.meta64.currentNodeData.children.length - 1)
                return null;
            return m64.meta64.currentNodeData.children[ordinal + 1];
        };
        edit.getFirstChildNode = function () {
            if (!m64.meta64.currentNodeData || !m64.meta64.currentNodeData.children)
                return null;
            return m64.meta64.currentNodeData.children[0];
        };
        edit.runEditNode = function (uid) {
            var node = m64.meta64.uidToNodeMap[uid];
            if (!node) {
                edit.editNode = null;
                (new m64.MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            edit.editingUnsavedNode = false;
            m64.util.json("initNodeEdit", {
                "nodeId": node.id
            }, initNodeEditResponse);
        };
        edit.insertNode = function (uid) {
            edit.parentOfNewNode = m64.meta64.currentNode;
            if (!edit.parentOfNewNode) {
                console.log("Unknown parent");
                return;
            }
            var node = null;
            if (!uid) {
                node = m64.meta64.getHighlightedNode();
            }
            else {
                node = m64.meta64.uidToNodeMap[uid];
            }
            if (node) {
                edit.nodeInsertTarget = node;
                edit.startEditingNewNode();
            }
        };
        edit.createSubNode = function (uid) {
            if (!uid) {
                var highlightNode = m64.meta64.getHighlightedNode();
                if (highlightNode) {
                    edit.parentOfNewNode = highlightNode;
                }
                else {
                    edit.parentOfNewNode = m64.meta64.currentNode;
                }
            }
            else {
                edit.parentOfNewNode = m64.meta64.uidToNodeMap[uid];
                if (!edit.parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }
            edit.nodeInsertTarget = null;
            edit.startEditingNewNode();
        };
        edit.replyToComment = function (uid) {
            edit.createSubNode(uid);
        };
        edit.clearSelections = function () {
            m64.meta64.clearSelectedNodes();
            m64.render.renderPageFromData();
            m64.meta64.selectTab("mainTabName");
        };
        edit.deleteSelNodes = function () {
            var selNodesArray = m64.meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new m64.MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
                return;
            }
            (new m64.ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
                var postDeleteSelNode = edit.getBestPostDeleteSelNode();
                m64.util.json("deleteNodes", {
                    "nodeIds": selNodesArray
                }, deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
            })).open();
        };
        edit.getBestPostDeleteSelNode = function () {
            var nodesMap = m64.meta64.getSelectedNodesAsMapById();
            var bestNode = null;
            var takeNextNode = false;
            for (var i = 0; i < m64.meta64.currentNodeData.children.length; i++) {
                var node = m64.meta64.currentNodeData.children[i];
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
        edit.moveSelNodes = function () {
            var selNodesArray = m64.meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new m64.MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
                return;
            }
            (new m64.ConfirmDlg("Confirm Paste", "Paste " + selNodesArray.length + " node(s) to new location ?", "Yes, move.", function () {
                edit.nodesToMove = selNodesArray;
                m64.meta64.selectedNodes = {};
                m64.meta64.refreshAllGuiEnablement();
            })).open();
        };
        edit.finishMovingSelNodes = function () {
            (new m64.ConfirmDlg("Confirm Move", "Move " + edit.nodesToMove.length + " node(s) to selected location ?", "Yes, move.", function () {
                var highlightNode = m64.meta64.getHighlightedNode();
                m64.util.json("moveNodes", {
                    "targetNodeId": highlightNode.id,
                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                    "nodeIds": edit.nodesToMove
                }, moveNodesResponse);
            })).open();
        };
        edit.insertBookWarAndPeace = function () {
            (new m64.ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function () {
                var node = m64.meta64.getHighlightedNode();
                if (!node) {
                    (new m64.MessageDlg("No node is selected.")).open();
                }
                else {
                    m64.util.json("insertBook", {
                        "nodeId": node.id,
                        "bookName": "War and Peace",
                        "truncated": m64.user.isTestUserAccount()
                    }, insertBookResponse);
                }
            })).open();
        };
    })(edit = m64.edit || (m64.edit = {}));
})(m64 || (m64 = {}));
console.log("running module: meta64.js");
var m64;
(function (m64) {
    var meta64;
    (function (meta64) {
        meta64.appInitialized = false;
        meta64.curUrlPath = window.location.pathname + window.location.search;
        meta64.codeFormatDirty = false;
        meta64.serverMarkdown = true;
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
            m64.menuPanel.build();
            m64.menuPanel.init();
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
        meta64.encodeOnClick = function (callback, ctx, payload) {
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
                    return "m64.meta64.runCallback(" + callback.guid + "," + ctx.guid + "," + payloadStr + ");";
                }
                else {
                    return "m64.meta64.runCallback(" + callback.guid + ");";
                }
            }
            else {
                throw "unexpected callback type in encodeOnClick";
            }
        };
        meta64.runCallback = function (guid, ctx, payload) {
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
                    m64.view.refreshTree(null, true);
                }
                else {
                    m64.render.renderPageFromData();
                    meta64.refreshAllGuiEnablement();
                }
            }
            else {
                m64.view.scrollToSelectedNode();
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
                if (meta64.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                    return true;
                }
            }
            return false;
        };
        meta64.getSelectedNodeUidsArray = function () {
            var selArray = [], idx = 0, uid;
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uid;
                }
            }
            return selArray;
        };
        meta64.getSelectedNodeIdsArray = function () {
            var selArray = [], idx = 0, uid;
            if (!meta64.selectedNodes) {
                console.log("no selected nodes.");
            }
            else {
                console.log("selectedNode count: " + m64.util.getPropertyCount(meta64.selectedNodes));
            }
            for (uid in meta64.selectedNodes) {
                if (meta64.selectedNodes.hasOwnProperty(uid)) {
                    var node = meta64.uidToNodeMap[uid];
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
                var elm = $("#ownerDisplay" + node.uid);
                elm.html(" (Manager: " + ownerBuf + ")");
                if (mine) {
                    m64.util.changeOrAddClass(elm, "created-by-other", "created-by-me");
                }
                else {
                    m64.util.changeOrAddClass(elm, "created-by-me", "created-by-other");
                }
            }
        };
        meta64.updateNodeInfo = function (node) {
            m64.util.json("getNodePrivileges", {
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
                    m64.util.changeOrAddClass(rowElm, "active-row", "inactive-row");
                }
            }
            if (!doneHighlighting) {
                meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;
                var rowElmId = node.uid + "_row";
                var rowElm = $("#" + rowElmId);
                if (!rowElm || rowElm.length == 0) {
                    console.log("Unable to find rowElement to highlight: " + rowElmId);
                }
                m64.util.changeOrAddClass(rowElm, "inactive-row", "active-row");
            }
            if (scroll) {
                m64.view.scrollToSelectedNode();
            }
        };
        meta64.refreshAllGuiEnablement = function () {
            var selNodeCount = m64.util.getPropertyCount(meta64.selectedNodes);
            var highlightNode = meta64.getHighlightedNode();
            var selNodeIsMine = highlightNode && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
            var homeNodeSelected = highlightNode && meta64.homeNodeId == highlightNode.id;
            var importAllowed = meta64.isAdminUser || meta64.userPreferences.importAllowed;
            var exportAllowed = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
            var highlightOrdinal = meta64.getOrdinalOfNode(highlightNode);
            var numChildNodes = meta64.getNumChildNodes();
            var canMoveUp = highlightOrdinal > 0 && numChildNodes > 1;
            var canMoveDown = highlightOrdinal < numChildNodes - 1 && numChildNodes > 1;
            var canCreateNode = meta64.userPreferences.editMode && (meta64.isAdminUser || (!meta64.isAnonUser && selNodeIsMine));
            console.log("enablement: isAnonUser=" + meta64.isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);
            m64.util.setEnablement("navLogoutButton", !meta64.isAnonUser);
            m64.util.setEnablement("openSignupPgButton", meta64.isAnonUser);
            m64.util.setEnablement("openExportDlg", exportAllowed);
            m64.util.setEnablement("openImportDlg", importAllowed);
            var propsToggle = meta64.currentNode && !meta64.isAnonUser;
            m64.util.setEnablement("propsToggleButton", propsToggle);
            var allowEditMode = meta64.currentNode && !meta64.isAnonUser;
            m64.util.setEnablement("editModeButton", allowEditMode);
            m64.util.setEnablement("upLevelButton", meta64.currentNode && m64.nav.parentVisibleToUser());
            m64.util.setEnablement("moveSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            m64.util.setEnablement("deleteSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            m64.util.setEnablement("clearSelectionsButton", !meta64.isAnonUser && selNodeCount > 0);
            m64.util.setEnablement("moveSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            m64.util.setEnablement("finishMovingSelNodesButton", !meta64.isAnonUser && m64.edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));
            m64.util.setEnablement("moveNodeUpButton", canMoveUp);
            m64.util.setEnablement("moveNodeDownButton", canMoveDown);
            m64.util.setEnablement("moveNodeToTopButton", canMoveUp);
            m64.util.setEnablement("moveNodeToBottomButton", canMoveDown);
            m64.util.setEnablement("changePasswordPgButton", !meta64.isAnonUser);
            m64.util.setEnablement("accountPreferencesButton", !meta64.isAnonUser);
            m64.util.setEnablement("manageAccountButton", !meta64.isAnonUser);
            m64.util.setEnablement("insertBookWarAndPeaceButton", meta64.isAdminUser || (m64.user.isTestUserAccount() && selNodeIsMine));
            m64.util.setEnablement("generateRSSButton", meta64.isAdminUser);
            m64.util.setEnablement("uploadFromFileButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("uploadFromUrlButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("deleteAttachmentsButton", !meta64.isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            m64.util.setEnablement("editNodeSharingButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("renameNodePgButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("contentSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("tagSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);
            m64.util.setEnablement("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineCreatedButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineModifiedButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("showServerInfoButton", meta64.isAdminUser);
            m64.util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            m64.util.setEnablement("refreshPageButton", !meta64.isAnonUser);
            m64.util.setEnablement("findSharedNodesButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);
            m64.util.setEnablement("createNodeButton", canCreateNode);
            m64.util.setEnablement("adminMenu", meta64.isAdminUser);
            m64.util.setVisibility("openImportDlg", importAllowed && selNodeIsMine);
            m64.util.setVisibility("openExportDlg", exportAllowed && selNodeIsMine);
            m64.util.setVisibility("editModeButton", allowEditMode);
            m64.util.setVisibility("upLevelButton", meta64.currentNode && m64.nav.parentVisibleToUser());
            m64.util.setVisibility("insertBookWarAndPeaceButton", meta64.isAdminUser || (m64.user.isTestUserAccount() && selNodeIsMine));
            m64.util.setVisibility("generateRSSButton", meta64.isAdminUser);
            m64.util.setVisibility("propsToggleButton", !meta64.isAnonUser);
            m64.util.setVisibility("openLoginDlgButton", meta64.isAnonUser);
            m64.util.setVisibility("navLogoutButton", !meta64.isAnonUser);
            m64.util.setVisibility("openSignupPgButton", meta64.isAnonUser);
            m64.util.setVisibility("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setVisibility("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setVisibility("userPreferencesMainAppButton", !meta64.isAnonUser);
            m64.util.setVisibility("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);
            m64.util.setVisibility("adminMenu", meta64.isAdminUser);
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
                m64.util.setVisibility("mainNodeContent", true);
                m64.render.renderPageFromData(res.renderNodeResponse);
                meta64.refreshAllGuiEnablement();
            }
            else {
                m64.util.setVisibility("mainNodeContent", false);
                console.log("setting listview to: " + res.content);
                m64.util.setHtml("listView", res.content);
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
            node.uid = updateMaps ? m64.util.getUidForId(meta64.identToUidMap, node.id) : meta64.identToUidMap[node.id];
            node.properties = m64.props.getPropertiesInEditingOrder(node.properties);
            node.createdBy = m64.props.getNodePropertyVal(m64.jcrCnst.CREATED_BY, node);
            node.lastModified = new Date(m64.props.getNodePropertyVal(m64.jcrCnst.LAST_MODIFIED, node));
            if (updateMaps) {
                meta64.uidToNodeMap[node.uid] = node;
                meta64.idToNodeMap[node.id] = node;
            }
        };
        meta64.initConstants = function () {
            m64.util.addAll(meta64.simpleModePropertyBlackList, [
                m64.jcrCnst.MIXIN_TYPES,
                m64.jcrCnst.PRIMARY_TYPE,
                m64.jcrCnst.POLICY,
                m64.jcrCnst.IMG_WIDTH,
                m64.jcrCnst.IMG_HEIGHT,
                m64.jcrCnst.BIN_VER,
                m64.jcrCnst.BIN_DATA,
                m64.jcrCnst.BIN_MIME,
                m64.jcrCnst.COMMENT_BY,
                m64.jcrCnst.PUBLIC_APPEND]);
            m64.util.addAll(meta64.readOnlyPropertyList, [
                m64.jcrCnst.PRIMARY_TYPE,
                m64.jcrCnst.UUID,
                m64.jcrCnst.MIXIN_TYPES,
                m64.jcrCnst.CREATED,
                m64.jcrCnst.CREATED_BY,
                m64.jcrCnst.LAST_MODIFIED,
                m64.jcrCnst.LAST_MODIFIED_BY,
                m64.jcrCnst.IMG_WIDTH,
                m64.jcrCnst.IMG_HEIGHT,
                m64.jcrCnst.BIN_VER,
                m64.jcrCnst.BIN_DATA,
                m64.jcrCnst.BIN_MIME,
                m64.jcrCnst.COMMENT_BY,
                m64.jcrCnst.PUBLIC_APPEND]);
            m64.util.addAll(meta64.binaryPropertyList, [m64.jcrCnst.BIN_DATA]);
        };
        meta64.initApp = function () {
            console.log("initApp running.");
            if (meta64.appInitialized)
                return;
            meta64.appInitialized = true;
            var tabs = m64.util.poly("mainIronPages");
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
            m64.user.refreshLogin();
            meta64.updateMainMenuPanel();
            meta64.refreshAllGuiEnablement();
            m64.util.initProgressMonitor();
            meta64.processUrlParams();
        };
        meta64.processUrlParams = function () {
            var passCode = m64.util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function () {
                    (new m64.ChangePasswordDlg(passCode)).open();
                }, 100);
            }
            meta64.urlCmd = m64.util.getParameterByName("cmd");
        };
        meta64.tabChangeEvent = function (tabName) {
            if (tabName == "searchTabName") {
                m64.srch.searchTabActivated();
            }
        };
        meta64.displaySignupMessage = function () {
            var signupResponse = $("#signupCodeResponse").text();
            if (signupResponse === "ok") {
                (new m64.MessageDlg("Signup complete. You may now login.")).open();
            }
        };
        meta64.screenSizeChange = function () {
            if (meta64.currentNodeData) {
                if (meta64.currentNode.imgId) {
                    m64.render.adjustImageSize(meta64.currentNode);
                }
                $.each(meta64.currentNodeData.children, function (i, node) {
                    if (node.imgId) {
                        m64.render.adjustImageSize(node);
                    }
                });
            }
        };
        meta64.orientationHandler = function (event) {
        };
        meta64.loadAnonPageHome = function (ignoreUrl) {
            m64.util.json("anonPageLoad", {
                "ignoreUrl": ignoreUrl
            }, meta64.anonPageLoadResponse);
        };
        meta64.saveUserPreferences = function () {
            m64.util.json("saveUserPreferences", {
                "userPreferences": meta64.userPreferences
            });
        };
        meta64.openSystemFile = function (fileName) {
            m64.util.json("openSystemFile", {
                "fileName": fileName
            });
        };
    })(meta64 = m64.meta64 || (m64.meta64 = {}));
})(m64 || (m64 = {}));
if (!window["meta64"]) {
    var meta64 = m64.meta64;
}
console.log("running module: nav.js");
var m64;
(function (m64) {
    var nav;
    (function (nav) {
        nav._UID_ROWID_SUFFIX = "_row";
        nav.openMainMenuHelp = function () {
            m64.util.json("renderNode", {
                "nodeId": "/meta64/public/help",
                "upLevel": null,
                "renderParentIfLeaf": null
            }, nav.navPageNodeResponse);
        };
        nav.openRssFeedsNode = function () {
            m64.util.json("renderNode", {
                "nodeId": "/rss/feeds",
                "upLevel": null,
                "renderParentIfLeaf": null
            }, nav.navPageNodeResponse);
        };
        nav.expandMore = function (nodeId) {
            m64.meta64.expandedAbbrevNodeIds[nodeId] = true;
            m64.util.json("expandAbbreviatedNode", {
                "nodeId": nodeId
            }, expandAbbreviatedNodeResponse);
        };
        var expandAbbreviatedNodeResponse = function (res) {
            if (m64.util.checkSuccess("ExpandAbbreviatedNode", res)) {
                m64.render.refreshNodeOnPage(res.nodeInfo);
            }
        };
        nav.displayingHome = function () {
            if (m64.meta64.isAnonUser) {
                return m64.meta64.currentNodeId === m64.meta64.anonUserLandingPageNode;
            }
            else {
                return m64.meta64.currentNodeId === m64.meta64.homeNodeId;
            }
        };
        nav.parentVisibleToUser = function () {
            return !nav.displayingHome();
        };
        nav.upLevelResponse = function (res, id) {
            if (!res || !res.node) {
                (new m64.MessageDlg("No data is visible to you above this node.")).open();
            }
            else {
                m64.render.renderPageFromData(res);
                m64.meta64.highlightRowById(id, true);
                m64.meta64.refreshAllGuiEnablement();
            }
        };
        nav.navUpLevel = function () {
            if (!nav.parentVisibleToUser()) {
                return;
            }
            var ironRes = m64.util.json("renderNode", {
                "nodeId": m64.meta64.currentNodeId,
                "upLevel": 1,
                "renderParentIfLeaf": false
            }, function (res) {
                nav.upLevelResponse(ironRes.response, m64.meta64.currentNodeId);
            });
        };
        nav.getSelectedDomElement = function () {
            var currentSelNode = m64.meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = m64.meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                    return m64.util.domElm(nodeId);
                }
            }
            return null;
        };
        nav.getSelectedPolyElement = function () {
            try {
                var currentSelNode = m64.meta64.getHighlightedNode();
                if (currentSelNode) {
                    var node = m64.meta64.uidToNodeMap[currentSelNode.uid];
                    if (node) {
                        console.log("found highlighted node.id=" + node.id);
                        var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                        console.log("looking up using element id: " + nodeId);
                        return m64.util.polyElm(nodeId);
                    }
                }
                else {
                    console.log("no node highlighted");
                }
            }
            catch (e) {
                m64.util.logAndThrow("getSelectedPolyElement failed.");
            }
            return null;
        };
        nav.clickOnNodeRow = function (rowElm, uid) {
            var node = m64.meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                return;
            }
            m64.meta64.highlightNode(node, false);
            if (m64.meta64.userPreferences.editMode) {
                if (!node.owner) {
                    console.log("calling updateNodeInfo");
                    m64.meta64.updateNodeInfo(node);
                }
            }
            m64.meta64.refreshAllGuiEnablement();
        };
        nav.openNode = function (uid) {
            var node = m64.meta64.uidToNodeMap[uid];
            m64.meta64.highlightNode(node, true);
            if (!node) {
                (new m64.MessageDlg("Unknown nodeId in openNode: " + uid)).open();
            }
            else {
                m64.view.refreshTree(node.id, false);
            }
        };
        nav.toggleNodeSel = function (uid) {
            var toggleButton = m64.util.polyElm(uid + "_sel");
            setTimeout(function () {
                if (toggleButton.node.checked) {
                    m64.meta64.selectedNodes[uid] = true;
                }
                else {
                    delete m64.meta64.selectedNodes[uid];
                }
                m64.view.updateStatusBar();
                m64.meta64.refreshAllGuiEnablement();
            }, 500);
        };
        nav.navPageNodeResponse = function (res) {
            m64.meta64.clearSelectedNodes();
            m64.render.renderPageFromData(res);
            m64.view.scrollToTop();
            m64.meta64.refreshAllGuiEnablement();
        };
        nav.navHome = function () {
            if (m64.meta64.isAnonUser) {
                m64.meta64.loadAnonPageHome(true);
            }
            else {
                m64.util.json("renderNode", {
                    "nodeId": m64.meta64.homeNodeId,
                    "upLevel": null,
                    "renderParentIfLeaf": null
                }, nav.navPageNodeResponse);
            }
        };
        nav.navPublicHome = function () {
            m64.meta64.loadAnonPageHome(true);
        };
    })(nav = m64.nav || (m64.nav = {}));
})(m64 || (m64 = {}));
console.log("running module: prefs.js");
var m64;
(function (m64) {
    var prefs;
    (function (prefs) {
        prefs.closeAccountResponse = function (res) {
            $(window).off("beforeunload");
            window.location.href = window.location.origin;
        };
        prefs.closeAccount = function () {
            (new m64.ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
                (new m64.ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                    m64.user.deleteAllUserCookies();
                    m64.util.json("closeAccount", {}, prefs.closeAccountResponse);
                })).open();
            })).open();
        };
    })(prefs = m64.prefs || (m64.prefs = {}));
})(m64 || (m64 = {}));
console.log("running module: props.js");
var m64;
(function (m64) {
    var props;
    (function (props_1) {
        props_1.propsToggle = function () {
            m64.meta64.showProperties = m64.meta64.showProperties ? false : true;
            m64.render.renderPageFromData();
            m64.view.scrollToSelectedNode();
            m64.meta64.selectTab("mainTabName");
        };
        props_1.deletePropertyFromLocalData = function (propertyName) {
            for (var i = 0; i < m64.edit.editNode.properties.length; i++) {
                if (propertyName === m64.edit.editNode.properties[i].name) {
                    m64.edit.editNode.properties.splice(i, 1);
                    break;
                }
            }
        };
        props_1.getPropertiesInEditingOrder = function (props) {
            var propsNew = props.clone();
            var targetIdx = 0;
            var tagIdx = propsNew.indexOfItemByProp("name", m64.jcrCnst.CONTENT);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            tagIdx = propsNew.indexOfItemByProp("name", m64.jcrCnst.TAGS);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            return propsNew;
        };
        props_1.renderProperties = function (properties) {
            if (properties) {
                var table_1 = "";
                var propCount_1 = 0;
                $.each(properties, function (i, property) {
                    if (m64.render.allowPropertyToDisplay(property.name)) {
                        var isBinaryProp = m64.render.isBinaryProperty(property.name);
                        propCount_1++;
                        var td = m64.render.tag("td", {
                            "class": "prop-table-name-col"
                        }, m64.render.sanitizePropertyName(property.name));
                        var val = void 0;
                        if (isBinaryProp) {
                            val = "[binary]";
                        }
                        else if (!property.values) {
                            val = m64.render.wrapHtml(property.htmlValue ? property.htmlValue : property.value);
                        }
                        else {
                            val = props.renderPropertyValues(property.values);
                        }
                        td += m64.render.tag("td", {
                            "class": "prop-table-val-col"
                        }, val);
                        table_1 += m64.render.tag("tr", {
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
                return m64.render.tag("table", {
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
            var createdBy = props_1.getNodePropertyVal(m64.jcrCnst.CREATED_BY, node);
            if (!createdBy) {
                createdBy = "admin";
            }
            return createdBy != m64.meta64.userName;
        };
        props_1.isNonOwnedCommentNode = function (node) {
            var commentBy = props_1.getNodePropertyVal(m64.jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != m64.meta64.userName;
        };
        props_1.isOwnedCommentNode = function (node) {
            var commentBy = props_1.getNodePropertyVal(m64.jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == m64.meta64.userName;
        };
        props_1.renderProperty = function (property) {
            if (!property.values) {
                if (!property.value || property.value.length == 0) {
                    return "";
                }
                return m64.render.wrapHtml(property.htmlValue);
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
                    ret += m64.cnst.BR;
                }
                ret += m64.render.wrapHtml(value);
                count++;
            });
            ret += "</div>";
            return ret;
        };
    })(props = m64.props || (m64.props = {}));
})(m64 || (m64 = {}));
console.log("running module: render.js");
var m64;
(function (m64) {
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
            var commentBy = m64.props.getNodePropertyVal(m64.jcrCnst.COMMENT_BY, node);
            var headerText = "";
            if (m64.cnst.SHOW_PATH_ON_ROWS) {
                headerText += "<div class='path-display'>Path: " + render.formatPath(node) + "</div>";
            }
            headerText += "<div>";
            if (commentBy) {
                var clazz = (commentBy === m64.meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
            }
            else if (node.createdBy) {
                var clazz = (node.createdBy === m64.meta64.userName) ? "created-by-me" : "created-by-other";
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
            if (content.contains("<code")) {
                m64.meta64.codeFormatDirty = true;
                content = render.encodeLanguages(content);
                content = content.replaceAll("</code>", "</pre>");
            }
            return content;
        };
        render.injectSubstitutions = function (content) {
            return content.replaceAll("{{locationOrigin}}", window.location.origin);
        };
        render.encodeLanguages = function (content) {
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = content.replaceAll("<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = content.replaceAll("<code>", "<pre class='prettyprint'>");
            return content;
        };
        render.refreshNodeOnPage = function (node) {
            var uid = m64.meta64.identToUidMap[node.id];
            if (!uid)
                throw "Unable to find nodeId " + node.id + " in uid map";
            m64.meta64.initNode(node, false);
            if (uid != node.uid)
                throw "uid changed unexpectly after initNode";
            var rowContent = render.renderNodeContent(node, true, true, true, true, true);
            $("#" + uid + "_content").html(rowContent);
        };
        render.renderNodeContent = function (node, showPath, showName, renderBin, rowStyling, showHeader) {
            var ret = render.getTopRightImageTag(node);
            if (m64.meta64.showMetaData) {
                ret += showHeader ? render.buildRowHeader(node, showPath, showName) : "";
            }
            if (m64.meta64.showProperties) {
                var properties = m64.props.renderProperties(node.properties);
                if (properties) {
                    ret += properties;
                }
            }
            else {
                var renderComplete = false;
                var searchResultProp = m64.props.getNodeProperty(m64.jcrCnst.JSON_FILE_SEARCH_RESULT, node);
                if (searchResultProp) {
                    var jcrContent = render.renderJsonFileSearchResultProperty(searchResultProp.value);
                    renderComplete = true;
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
                if (!renderComplete) {
                    var func = m64.meta64.renderFunctionsByJcrType[node.primaryTypeName];
                    if (func) {
                        renderComplete = true;
                        ret += func(node, rowStyling);
                    }
                }
                if (!renderComplete) {
                    var contentProp = m64.props.getNodeProperty(m64.jcrCnst.CONTENT, node);
                    if (contentProp) {
                        renderComplete = true;
                        var jcrContent = m64.props.renderProperty(contentProp);
                        jcrContent = "<div>" + jcrContent + "</div>";
                        if (m64.meta64.serverMarkdown) {
                            jcrContent = render.injectCodeFormatting(jcrContent);
                            jcrContent = render.injectSubstitutions(jcrContent);
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
                        else {
                            if (rowStyling) {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += render.tag("script", {
                                    "type": "text/markdown"
                                }, jcrContent);
                            }
                            else {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += render.tag("script", {
                                    "type": "text/markdown"
                                }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                    + jcrContent);
                            }
                            ret += "</div></marked-element>";
                        }
                    }
                }
                if (!renderComplete) {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    var properties_1 = m64.props.renderProperties(node.properties);
                    if (properties_1) {
                        ret += properties_1;
                    }
                }
            }
            if (renderBin && node.hasBinary) {
                var binary = renderBinary(node);
                if (ret.contains(m64.cnst.INSERT_ATTACHMENT)) {
                    ret = ret.replaceAll(m64.cnst.INSERT_ATTACHMENT, binary);
                }
                else {
                    ret += binary;
                }
            }
            var tags = m64.props.getNodePropertyVal(m64.jcrCnst.TAGS, node);
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
                    var fileNameDiv = render.tag("div", {
                        "class": "systemFile",
                    }, entry.fileName);
                    var localOpenLink = render.tag("a", {
                        "onclick": "m64.meta64.openSystemFile('" + entry.fileName + "')"
                    }, "Local Open");
                    var downloadLink = render.tag("a", {
                        "onclick": "m64.meta64.downloadSystemFile('" + entry.fileName + "')"
                    }, "Download");
                    var linksDiv = render.tag("div", {}, localOpenLink + downloadLink);
                    content += render.tag("div", {}, fileNameDiv + linksDiv);
                }
            }
            catch (e) {
                m64.util.logAndReThrow("render failed", e);
                content = "[render failed]";
            }
            return content;
        };
        render.renderNodeAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            var canMoveUp = index > 0 && rowCount > 1;
            var canMoveDown = index < count - 1;
            var isRep = node.name.startsWith("rep:") ||
                node.path.contains("/rep:");
            var editingAllowed = m64.props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (m64.meta64.isAdminUser || !isRep) && !m64.props.isNonOwnedCommentNode(node)
                    && !m64.props.isNonOwnedNode(node);
            }
            var focusNode = m64.meta64.getHighlightedNode();
            var selected = (focusNode && focusNode.uid === uid);
            var buttonBarHtmlRet = render.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            var bkgStyle = render.getNodeBkgImageStyle(node);
            var cssId = uid + "_row";
            return render.tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": "m64.nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId,
                "style": bkgStyle
            }, buttonBarHtmlRet + render.tag("div", {
                "id": uid + "_content"
            }, render.renderNodeContent(node, true, true, true, true, true)));
        };
        render.showNodeUrl = function () {
            var node = m64.meta64.getHighlightedNode();
            if (!node) {
                (new m64.MessageDlg("You must first click on a node.")).open();
                return;
            }
            var path = node.path.stripIfStartsWith("/root");
            var url = window.location.origin + "?id=" + path;
            m64.meta64.selectTab("mainTabName");
            var message = "URL using path: <br>" + url;
            var uuid = m64.props.getNodePropertyVal("jcr:uuid", node);
            if (uuid) {
                message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
            }
            (new m64.MessageDlg(message, "URL of Node")).open();
        };
        render.getTopRightImageTag = function (node) {
            var topRightImg = m64.props.getNodePropertyVal('img.top.right', node);
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
            var bkgImg = m64.props.getNodePropertyVal('img.node.bkg', node);
            var bkgImgStyle = "";
            if (bkgImg) {
                bkgImgStyle = "background-image: url(" + bkgImg + ");";
            }
            return bkgImgStyle;
        };
        render.centeredButtonBar = function (buttons, classes) {
            classes = classes || "";
            return render.tag("div", {
                "class": "horizontal center-justified layout " + classes
            }, buttons);
        };
        render.buttonBar = function (buttons, classes) {
            classes = classes || "";
            return render.tag("div", {
                "class": "horizontal left-justified layout " + classes
            }, buttons);
        };
        render.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
            var createdBy = m64.props.getNodePropertyVal(m64.jcrCnst.CREATED_BY, node);
            var commentBy = m64.props.getNodePropertyVal(m64.jcrCnst.COMMENT_BY, node);
            var publicAppend = m64.props.getNodePropertyVal(m64.jcrCnst.PUBLIC_APPEND, node);
            var openButton = "";
            var selButton = "";
            var createSubNodeButton = "";
            var editNodeButton = "";
            var moveNodeUpButton = "";
            var moveNodeDownButton = "";
            var insertNodeButton = "";
            var replyButton = "";
            if (publicAppend && createdBy != m64.meta64.userName && commentBy != m64.meta64.userName) {
                replyButton = render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.edit.replyToComment('" + node.uid + "');"
                }, "Reply");
            }
            var buttonCount = 0;
            if (render.nodeHasChildren(node.uid)) {
                buttonCount++;
                openButton = render.tag("paper-button", {
                    "style": "background-color: #4caf50;color:white;",
                    "raised": "raised",
                    "onClick": "m64.nav.openNode('" + node.uid + "');"
                }, "Open");
            }
            if (m64.meta64.userPreferences.editMode) {
                var selected = m64.meta64.selectedNodes[node.uid] ? true : false;
                buttonCount++;
                var css = selected ? {
                    "id": node.uid + "_sel",
                    "onClick": "m64.nav.toggleNodeSel('" + node.uid + "');",
                    "checked": "checked",
                    "style": "margin-top: 11px;"
                } :
                    {
                        "id": node.uid + "_sel",
                        "onClick": "m64.nav.toggleNodeSel('" + node.uid + "');",
                        "style": "margin-top: 11px;"
                    };
                selButton = render.tag("paper-checkbox", css, "");
                if (m64.cnst.NEW_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    createSubNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt",
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "m64.edit.createSubNode('" + node.uid + "');"
                    }, "Add");
                }
                if (m64.cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    insertNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture",
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "m64.edit.insertNode('" + node.uid + "');"
                    }, "Ins");
                }
            }
            if (m64.meta64.userPreferences.editMode && editingAllowed) {
                buttonCount++;
                editNodeButton = render.tag("paper-icon-button", {
                    "alt": "Edit node.",
                    "icon": "editor:mode-edit",
                    "raised": "raised",
                    "onClick": "m64.edit.runEditNode('" + node.uid + "');"
                }, "Edit");
                if (m64.cnst.MOVE_UPDOWN_ON_TOOLBAR && m64.meta64.currentNode.childrenOrdered && !commentBy) {
                    if (canMoveUp) {
                        buttonCount++;
                        moveNodeUpButton = render.tag("paper-icon-button", {
                            "icon": "icons:arrow-upward",
                            "raised": "raised",
                            "onClick": "m64.edit.moveNodeUp('" + node.uid + "');"
                        }, "Up");
                    }
                    if (canMoveDown) {
                        buttonCount++;
                        moveNodeDownButton = render.tag("paper-icon-button", {
                            "icon": "icons:arrow-downward",
                            "raised": "raised",
                            "onClick": "m64.edit.moveNodeDown('" + node.uid + "');"
                        }, "Dn");
                    }
                }
            }
            var insertNodeTooltip = "";
            var addNodeTooltip = "";
            var allButtons = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
                + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;
            return allButtons.length > 0 ? render.makeHorizontalFieldSet(allButtons) : "";
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
            var node = m64.meta64.uidToNodeMap[uid];
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
            path = path.replaceAll("/", " / ");
            var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
            var noRootPath = shortPath;
            if (noRootPath.startsWith("/root")) {
                noRootPath = noRootPath.substring(0, 5);
            }
            var ret = m64.meta64.isAdminUser ? shortPath : noRootPath;
            ret += " [" + node.primaryTypeName + "]";
            return ret;
        };
        render.wrapHtml = function (text) {
            return "<div>" + text + "</div>";
        };
        render.renderPageFromData = function (data) {
            m64.meta64.codeFormatDirty = false;
            console.log("m64.render.renderPageFromData()");
            var newData = false;
            if (!data) {
                data = m64.meta64.currentNodeData;
            }
            else {
                newData = true;
            }
            if (!data || !data.node) {
                m64.util.setVisibility("#listView", false);
                $("#mainNodeContent").html("No content is available here.");
                return;
            }
            else {
                m64.util.setVisibility("#listView", true);
            }
            m64.meta64.treeDirty = false;
            if (newData) {
                m64.meta64.uidToNodeMap = {};
                m64.meta64.idToNodeMap = {};
                m64.meta64.identToUidMap = {};
                m64.meta64.selectedNodes = {};
                m64.meta64.parentUidToFocusNodeMap = {};
                m64.meta64.initNode(data.node, true);
                m64.meta64.setCurrentNodeData(data);
            }
            var propCount = m64.meta64.currentNode.properties ? m64.meta64.currentNode.properties.length : 0;
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
                var createdBy = m64.props.getNodePropertyVal(m64.jcrCnst.CREATED_BY, data.node);
                var commentBy = m64.props.getNodePropertyVal(m64.jcrCnst.COMMENT_BY, data.node);
                var publicAppend = m64.props.getNodePropertyVal(m64.jcrCnst.PUBLIC_APPEND, data.node);
                if (publicAppend && createdBy != m64.meta64.userName && commentBy != m64.meta64.userName) {
                    replyButton = render.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "m64.edit.replyToComment('" + data.node.uid + "');"
                    }, "Reply");
                }
                if (m64.meta64.userPreferences.editMode && m64.cnst.NEW_ON_TOOLBAR && m64.edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = render.tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt",
                        "raised": "raised",
                        "onClick": "m64.edit.createSubNode('" + uid + "');"
                    }, "Add");
                }
                if (m64.edit.isEditAllowed(data.node)) {
                    editNodeButton = render.tag("paper-icon-button", {
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": "m64.edit.runEditNode('" + uid + "');"
                    }, "Edit");
                }
                var focusNode = m64.meta64.getHighlightedNode();
                var selected = focusNode && focusNode.uid === uid;
                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar_1 = render.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }
                var content = render.tag("div", {
                    "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                    "onClick": "m64.nav.clickOnNodeRow(this, '" + uid + "');",
                    "id": cssId
                }, buttonBar_1 + mainNodeContent);
                $("#mainNodeContent").show();
                $("#mainNodeContent").html(content);
            }
            else {
                $("#mainNodeContent").hide();
            }
            m64.view.updateStatusBar();
            var rowCount = 0;
            if (data.children) {
                var childCount = data.children.length;
                for (var i = 0; i < data.children.length; i++) {
                    var node = data.children[i];
                    var row = render.generateRow(i, node, newData, childCount, rowCount);
                    if (row.length != 0) {
                        output += row;
                        rowCount++;
                    }
                }
            }
            if (m64.edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !m64.meta64.isAnonUser) {
                    output = getEmptyPagePrompt();
                }
            }
            m64.util.setHtml("listView", output);
            if (m64.meta64.codeFormatDirty) {
                prettyPrint();
            }
            $("a").attr("target", "_blank");
            m64.meta64.screenSizeChange();
            if (!m64.meta64.getHighlightedNode()) {
                m64.view.scrollToTop();
            }
            else {
                m64.view.scrollToSelectedNode();
            }
        };
        render.generateRow = function (i, node, newData, childCount, rowCount) {
            if (m64.meta64.isNodeBlackListed(node))
                return "";
            if (newData) {
                m64.meta64.initNode(node, true);
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
                    if (node.width > m64.meta64.deviceWidth - 80) {
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
                if (node.width > m64.meta64.deviceWidth - 50) {
                    var width = m64.meta64.deviceWidth - 50;
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
                        if (v.contains("'")) {
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
        render.makeButton = function (text, id, callback) {
            var attribs = {
                "raised": "raised",
                "id": id
            };
            if (callback != undefined) {
                attribs["onClick"] = callback;
            }
            return render.tag("paper-button", attribs, text, true);
        };
        render.makeBackButton = function (text, id, domId, callback) {
            if (callback === undefined) {
                callback = "";
            }
            return render.tag("paper-button", {
                "raised": "raised",
                "id": id,
                "onClick": "m64.meta64.cancelDialog('" + domId + "');" + callback
            }, text, true);
        };
        render.allowPropertyToDisplay = function (propName) {
            if (!m64.meta64.inSimpleMode())
                return true;
            return m64.meta64.simpleModePropertyBlackList[propName] == null;
        };
        render.isReadOnlyProperty = function (propName) {
            return m64.meta64.readOnlyPropertyList[propName];
        };
        render.isBinaryProperty = function (propName) {
            return m64.meta64.binaryPropertyList[propName];
        };
        render.sanitizePropertyName = function (propName) {
            if (m64.meta64.editModeOption === "simple") {
                return propName === m64.jcrCnst.CONTENT ? "Content" : propName;
            }
            else {
                return propName;
            }
        };
    })(render = m64.render || (m64.render = {}));
})(m64 || (m64 = {}));
console.log("running module: search.js");
var m64;
(function (m64) {
    var srch;
    (function (srch) {
        srch._UID_ROWID_SUFFIX = "_srch_row";
        srch.searchNodes = null;
        srch.searchPageTitle = "Search Results";
        srch.timelinePageTitle = "Timeline";
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
            if (srch.numSearchResults() == 0 && !m64.meta64.isAnonUser) {
                (new m64.SearchContentDlg()).open();
            }
        };
        srch.searchNodesResponse = function (res) {
            srch.searchResults = res;
            var searchResultsPanel = new m64.SearchResultsPanel();
            var content = searchResultsPanel.build();
            m64.util.setHtml("searchResultsPanel", content);
            searchResultsPanel.init();
            m64.meta64.changePage(searchResultsPanel);
        };
        srch.timelineResponse = function (res) {
            srch.timelineResults = res;
            var timelineResultsPanel = new m64.TimelineResultsPanel();
            var content = timelineResultsPanel.build();
            m64.util.setHtml("timelineResultsPanel", content);
            timelineResultsPanel.init();
            m64.meta64.changePage(timelineResultsPanel);
        };
        srch.searchFilesResponse = function (res) {
            m64.util.json("renderNode", {
                "nodeId": res.searchResultNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null
            }, m64.nav.navPageNodeResponse);
        };
        srch.timelineByModTime = function () {
            var node = m64.meta64.getHighlightedNode();
            if (!node) {
                (new m64.MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            m64.util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": m64.jcrCnst.LAST_MODIFIED,
                "searchProp": m64.jcrCnst.CONTENT
            }, srch.timelineResponse);
        };
        srch.timelineByCreateTime = function () {
            var node = m64.meta64.getHighlightedNode();
            if (!node) {
                (new m64.MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            m64.util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": m64.jcrCnst.CREATED,
                "searchProp": m64.jcrCnst.CONTENT
            }, srch.timelineResponse);
        };
        srch.initSearchNode = function (node) {
            node.uid = m64.util.getUidForId(srch.identToUidMap, node.id);
            srch.uidToNodeMap[node.uid] = node;
        };
        srch.populateSearchResultsPage = function (data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;
            var rowCount = 0;
            $.each(data.searchResults, function (i, node) {
                if (m64.meta64.isNodeBlackListed(node))
                    return;
                srch.initSearchNode(node);
                rowCount++;
                output += srch.renderSearchResultAsListItem(node, i, childCount, rowCount);
            });
            m64.util.setHtml(viewName, output);
        };
        srch.renderSearchResultAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            console.log("renderSearchResult: " + uid);
            var cssId = uid + srch._UID_ROWID_SUFFIX;
            var buttonBarHtml = srch.makeButtonBarHtml("" + uid);
            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = m64.render.renderNodeContent(node, true, true, true, true, true);
            return m64.render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": "m64.srch.clickOnSearchResultRow(this, '" + uid + "');",
                "id": cssId
            }, buttonBarHtml
                + m64.render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        };
        srch.makeButtonBarHtml = function (uid) {
            var gotoButton = m64.render.makeButton("Go to Node", uid, "m64.srch.clickSearchNode('" + uid + "');");
            return m64.render.makeHorizontalFieldSet(gotoButton);
        };
        srch.clickOnSearchResultRow = function (rowElm, uid) {
            srch.unhighlightRow();
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            m64.util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        };
        srch.clickSearchNode = function (uid) {
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            if (!srch.highlightRowNode) {
                throw "Unable to find uid in search results: " + uid;
            }
            m64.view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
            m64.meta64.selectTab("mainTabName");
        };
        srch.unhighlightRow = function () {
            if (!srch.highlightRowNode) {
                return;
            }
            var nodeId = srch.highlightRowNode.uid + srch._UID_ROWID_SUFFIX;
            var elm = m64.util.domElm(nodeId);
            if (elm) {
                m64.util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        };
    })(srch = m64.srch || (m64.srch = {}));
})(m64 || (m64 = {}));
console.log("running module: share.js");
var m64;
(function (m64) {
    var share;
    (function (share) {
        var findSharedNodesResponse = function (res) {
            m64.srch.searchNodesResponse(res);
        };
        share.sharingNode = null;
        share.editNodeSharing = function () {
            var node = m64.meta64.getHighlightedNode();
            if (!node) {
                (new m64.MessageDlg("No node is selected.")).open();
                return;
            }
            share.sharingNode = node;
            (new m64.SharingDlg()).open();
        };
        share.findSharedNodes = function () {
            var focusNode = m64.meta64.getHighlightedNode();
            if (focusNode == null) {
                return;
            }
            m64.srch.searchPageTitle = "Shared Nodes";
            m64.util.json("getSharedNodes", {
                "nodeId": focusNode.id
            }, findSharedNodesResponse);
        };
    })(share = m64.share || (m64.share = {}));
})(m64 || (m64 = {}));
console.log("running module: user.js");
var m64;
(function (m64) {
    var user;
    (function (user) {
        var logoutResponse = function (res) {
            window.location.href = window.location.origin;
        };
        user.isTestUserAccount = function () {
            return m64.meta64.userName.toLowerCase() === "adam" ||
                m64.meta64.userName.toLowerCase() === "bob" ||
                m64.meta64.userName.toLowerCase() === "cory" ||
                m64.meta64.userName.toLowerCase() === "dan";
        };
        user.setTitleUsingLoginResponse = function (res) {
            var title = BRANDING_TITLE_SHORT;
            if (!m64.meta64.isAnonUser) {
                title += ":" + res.userName;
            }
            $("#headerAppName").html(title);
        };
        user.setStateVarsUsingLoginResponse = function (res) {
            if (res.rootNode) {
                m64.meta64.homeNodeId = res.rootNode.id;
                m64.meta64.homeNodePath = res.rootNode.path;
            }
            m64.meta64.userName = res.userName;
            m64.meta64.isAdminUser = res.userName === "admin";
            m64.meta64.isAnonUser = res.userName === "anonymous";
            m64.meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;
            m64.meta64.allowFileSystemSearch = res.allowFileSystemSearch;
            m64.meta64.userPreferences = res.userPreferences;
            m64.meta64.editModeOption = res.userPreferences.advancedMode ? m64.meta64.MODE_ADVANCED : m64.meta64.MODE_SIMPLE;
            m64.meta64.showMetaData = res.userPreferences.showMetaData;
            console.log("from server: meta64.editModeOption=" + m64.meta64.editModeOption);
        };
        user.openSignupPg = function () {
            (new m64.SignupDlg()).open();
        };
        user.writeCookie = function (name, val) {
            $.cookie(name, val, {
                expires: 365,
                path: '/'
            });
        };
        user.openLoginPg = function () {
            var loginDlg = new m64.LoginDlg();
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
                var loginState = $.cookie(m64.cnst.COOKIE_LOGIN_STATE);
                if (loginState === "0") {
                    m64.meta64.loadAnonPageHome(false);
                    return;
                }
                var usr = $.cookie(m64.cnst.COOKIE_LOGIN_USR);
                var pwd = $.cookie(m64.cnst.COOKIE_LOGIN_PWD);
                usingCookies = !m64.util.emptyString(usr) && !m64.util.emptyString(pwd);
                console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);
                callUsr = usr ? usr : "";
                callPwd = pwd ? pwd : "";
            }
            console.log("refreshLogin with name: " + callUsr);
            if (!callUsr) {
                m64.meta64.loadAnonPageHome(false);
            }
            else {
                m64.util.json("login", {
                    "userName": callUsr,
                    "password": callPwd,
                    "tzOffset": new Date().getTimezoneOffset(),
                    "dst": m64.util.daylightSavingsTime
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
            if (m64.meta64.isAnonUser) {
                return;
            }
            $(window).off("beforeunload");
            if (updateLoginStateCookie) {
                user.writeCookie(m64.cnst.COOKIE_LOGIN_STATE, "0");
            }
            m64.util.json("logout", {}, logoutResponse);
        };
        user.login = function (loginDlg, usr, pwd) {
            m64.util.json("login", {
                "userName": usr,
                "password": pwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": m64.util.daylightSavingsTime
            }, function (res) {
                user.loginResponse(res, usr, pwd, null, loginDlg);
            });
        };
        user.deleteAllUserCookies = function () {
            $.removeCookie(m64.cnst.COOKIE_LOGIN_USR);
            $.removeCookie(m64.cnst.COOKIE_LOGIN_PWD);
            $.removeCookie(m64.cnst.COOKIE_LOGIN_STATE);
        };
        user.loginResponse = function (res, usr, pwd, usingCookies, loginDlg) {
            if (m64.util.checkSuccess("Login", res)) {
                console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);
                if (usr != "anonymous") {
                    user.writeCookie(m64.cnst.COOKIE_LOGIN_USR, usr);
                    user.writeCookie(m64.cnst.COOKIE_LOGIN_PWD, pwd);
                    user.writeCookie(m64.cnst.COOKIE_LOGIN_STATE, "1");
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
                if (!m64.util.emptyString(res.homeNodeOverride)) {
                    console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                    id = res.homeNodeOverride;
                    m64.meta64.homeNodeOverride = id;
                }
                else {
                    if (res.userPreferences.lastNode) {
                        console.log("loading lastNode=" + res.userPreferences.lastNode);
                        id = res.userPreferences.lastNode;
                    }
                    else {
                        console.log("loading homeNodeId=" + m64.meta64.homeNodeId);
                        id = m64.meta64.homeNodeId;
                    }
                }
                m64.view.refreshTree(id, false, null, true);
                user.setTitleUsingLoginResponse(res);
            }
            else {
                if (usingCookies) {
                    (new m64.MessageDlg("Cookie login failed.")).open();
                    $.removeCookie(m64.cnst.COOKIE_LOGIN_USR);
                    $.removeCookie(m64.cnst.COOKIE_LOGIN_PWD);
                    user.writeCookie(m64.cnst.COOKIE_LOGIN_STATE, "0");
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
            m64.meta64.loadAnonPageHome(false);
        };
    })(user = m64.user || (m64.user = {}));
})(m64 || (m64 = {}));
console.log("running module: view.js");
var m64;
(function (m64) {
    var view;
    (function (view) {
        view.scrollToSelNodePending = false;
        view.updateStatusBar = function () {
            if (!m64.meta64.currentNodeData)
                return;
            var statusLine = "";
            if (m64.meta64.editModeOption === m64.meta64.MODE_ADVANCED) {
                statusLine += "count: " + m64.meta64.currentNodeData.children.length;
            }
            if (m64.meta64.userPreferences.editMode) {
                statusLine += " Selections: " + m64.util.getPropertyCount(m64.meta64.selectedNodes);
            }
        };
        view.refreshTreeResponse = function (res, targetId) {
            m64.render.renderPageFromData(res);
            if (targetId) {
                m64.meta64.highlightRowById(targetId, true);
            }
            else {
                view.scrollToSelectedNode();
            }
            m64.meta64.refreshAllGuiEnablement();
        };
        view.refreshTree = function (nodeId, renderParentIfLeaf, highlightId, isInitialRender) {
            if (!nodeId) {
                nodeId = m64.meta64.currentNodeId;
            }
            console.log("Refreshing tree: nodeId=" + nodeId);
            if (!highlightId) {
                var currentSelNode = m64.meta64.getHighlightedNode();
                highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
            }
            m64.util.json("renderNode", {
                "nodeId": nodeId,
                "upLevel": null,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false
            }, function (res) {
                view.refreshTreeResponse(res, highlightId);
                if (isInitialRender && m64.meta64.urlCmd == "addNode" && m64.meta64.homeNodeOverride) {
                    m64.edit.editMode(true);
                    m64.edit.createSubNode(m64.meta64.currentNode.uid);
                }
            });
        };
        view.scrollToSelectedNode = function () {
            view.scrollToSelNodePending = true;
            setTimeout(function () {
                view.scrollToSelNodePending = false;
                var elm = m64.nav.getSelectedPolyElement();
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
                else {
                }
            }, 1000);
        };
        view.scrollToTop = function () {
            if (view.scrollToSelNodePending)
                return;
        };
        view.initEditPathDisplayById = function (domId) {
            var node = m64.edit.editNode;
            var e = $("#" + domId);
            if (!e)
                return;
            if (m64.edit.editingUnsavedNode) {
                e.html("");
                e.hide();
            }
            else {
                var pathDisplay = "Path: " + m64.render.formatPath(node);
                if (node.lastModified) {
                    pathDisplay += "<br>Mod: " + node.lastModified;
                }
                e.html(pathDisplay);
                e.show();
            }
        };
        view.showServerInfo = function () {
            m64.util.json("getServerInfo", {}, function (res) {
                (new m64.MessageDlg(res.serverInfo)).open();
            });
        };
    })(view = m64.view || (m64.view = {}));
})(m64 || (m64 = {}));
console.log("running module: menuPanel.js");
var m64;
(function (m64) {
    var menuPanel;
    (function (menuPanel) {
        var makeTopLevelMenu = function (title, content, id) {
            var paperItemAttrs = {
                class: "menu-trigger"
            };
            var paperItem = m64.render.tag("paper-item", paperItemAttrs, title);
            var paperSubmenuAttrs = {
                "label": title
            };
            if (id) {
                paperSubmenuAttrs.id = id;
            }
            return m64.render.tag("paper-submenu", paperSubmenuAttrs, paperItem +
                makeSecondLevelList(content), true);
        };
        var makeSecondLevelList = function (content) {
            return m64.render.tag("paper-menu", {
                "class": "menu-content sublist my-menu-section",
            }, content, true);
        };
        var menuItem = function (name, id, onClick) {
            return m64.render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        };
        var domId = "mainAppMenu";
        menuPanel.build = function () {
            var rssItems = menuItem("Feeds", "mainMenuRss", "m64.nav.openRssFeedsNode();");
            var mainMenuRss = makeTopLevelMenu("RSS", rssItems);
            var editMenuItems = menuItem("Create", "createNodeButton", "m64.edit.createNode();") +
                menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") +
                menuItem("Delete", "deleteSelNodesButton", "m64.edit.deleteSelNodes();") +
                menuItem("Clear Selections", "clearSelectionsButton", "m64.edit.clearSelections();") +
                menuItem("Import", "openImportDlg", "(new m64.ImportDlg()).open();") +
                menuItem("Export", "openExportDlg", "(new m64.ExportDlg()).open();");
            var editMenu = makeTopLevelMenu("Edit", editMenuItems);
            var moveMenuItems = menuItem("Cut", "moveSelNodesButton", "m64.edit.moveSelNodes();") +
                menuItem("Paste", "finishMovingSelNodesButton", "m64.edit.finishMovingSelNodes();") +
                menuItem("Up", "moveNodeUpButton", "m64.edit.moveNodeUp();") +
                menuItem("Down", "moveNodeDownButton", "m64.edit.moveNodeDown();") +
                menuItem("to Top", "moveNodeToTopButton", "m64.edit.moveNodeToTop();") +
                menuItem("to Bottom", "moveNodeToBottomButton", "m64.edit.moveNodeToBottom();");
            var moveMenu = makeTopLevelMenu("Move", moveMenuItems);
            var attachmentMenuItems = menuItem("Upload from File", "uploadFromFileButton", "m64.attachment.openUploadFromFileDlg();") +
                menuItem("Upload from URL", "uploadFromUrlButton", "m64.attachment.openUploadFromUrlDlg();") +
                menuItem("Delete Attachment", "deleteAttachmentsButton", "m64.attachment.deleteAttachment();");
            var attachmentMenu = makeTopLevelMenu("Attach", attachmentMenuItems);
            var sharingMenuItems = menuItem("Edit Node Sharing", "editNodeSharingButton", "m64.share.editNodeSharing();") +
                menuItem("Find Shared Subnodes", "findSharedNodesButton", "m64.share.findSharedNodes();");
            var sharingMenu = makeTopLevelMenu("Share", sharingMenuItems);
            var searchMenuItems = menuItem("Content", "contentSearchDlgButton", "(new m64.SearchContentDlg()).open();") +
                menuItem("Tags", "tagSearchDlgButton", "(new m64.SearchTagsDlg()).open();") +
                menuItem("Files", "fileSearchDlgButton", "(new m64.SearchFilesDlg()).open();");
            var searchMenu = makeTopLevelMenu("Search", searchMenuItems);
            var timelineMenuItems = menuItem("Created", "timelineCreatedButton", "m64.srch.timelineByCreateTime();") +
                menuItem("Modified", "timelineModifiedButton", "m64.srch.timelineByModTime();");
            var timelineMenu = makeTopLevelMenu("Timeline", timelineMenuItems);
            var viewOptionsMenuItems = menuItem("Toggle Properties", "propsToggleButton", "m64.props.propsToggle();") +
                menuItem("Refresh", "refreshPageButton", "m64.meta64.refresh();") +
                menuItem("Show URL", "showFullNodeUrlButton", "m64.render.showNodeUrl();") +
                menuItem("Preferences", "accountPreferencesButton", "(new m64.PrefsDlg()).open();") +
                menuItem("Server Info", "showServerInfoButton", "m64.view.showServerInfo();");
            var viewOptionsMenu = makeTopLevelMenu("View", viewOptionsMenuItems);
            var myAccountItems = menuItem("Change Password", "changePasswordPgButton", "(new m64.ChangePasswordDlg()).open();") +
                menuItem("Manage Account", "manageAccountButton", "(new m64.ManageAccountDlg()).open();") +
                menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "m64.edit.insertBookWarAndPeace();");
            var myAccountMenu = makeTopLevelMenu("Account", myAccountItems);
            var adminItems = menuItem("Generate RSS", "generateRSSButton", "m64.podcast.generateRSS();");
            var adminMenu = makeTopLevelMenu("Admin", adminItems, "adminMenu");
            var helpItems = menuItem("Main Menu Help", "mainMenuHelp", "m64.nav.openMainMenuHelp();");
            var mainMenuHelp = makeTopLevelMenu("Help/Docs", helpItems);
            var content = mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
                + adminMenu + mainMenuHelp;
            m64.util.setHtml(domId, content);
        };
        menuPanel.init = function () {
            m64.meta64.refreshAllGuiEnablement();
        };
    })(menuPanel = m64.menuPanel || (m64.menuPanel = {}));
})(m64 || (m64 = {}));
console.log("running module: podcast.js");
var m64;
(function (m64) {
    var podcast;
    (function (podcast) {
        podcast.player = null;
        podcast.startTimePending = null;
        var uid = null;
        var node = null;
        var adSegments = null;
        var pushTimer = null;
        podcast.generateRSS = function () {
            m64.util.json("generateRSS", {}, generateRSSResponse);
        };
        var generateRSSResponse = function () {
            alert('rss complete.');
        };
        podcast.renderFeedNode = function (node, rowStyling) {
            var ret = "";
            var title = m64.props.getNodeProperty("meta64:rssFeedTitle", node);
            var desc = m64.props.getNodeProperty("meta64:rssFeedDesc", node);
            var imgUrl = m64.props.getNodeProperty("meta64:rssFeedImageUrl", node);
            var feed = "";
            if (title) {
                feed += m64.render.tag("h2", {}, title.value);
            }
            if (desc) {
                feed += m64.render.tag("p", {}, desc.value);
            }
            if (rowStyling) {
                ret += m64.render.tag("div", {
                    "class": "jcr-content"
                }, feed);
            }
            else {
                ret += m64.render.tag("div", {
                    "class": "jcr-root-content"
                }, feed);
            }
            if (imgUrl) {
                ret += m64.render.tag("img", {
                    "style": "max-width: 300px;",
                    "src": imgUrl.value
                }, null, false);
            }
            return ret;
        };
        podcast.renderEntryNode = function (node, rowStyling) {
            var ret = "";
            var rssTitle = m64.props.getNodeProperty("meta64:rssItemTitle", node);
            var rssDesc = m64.props.getNodeProperty("meta64:rssItemDesc", node);
            var rssAuthor = m64.props.getNodeProperty("meta64:rssItemAuthor", node);
            var rssLink = m64.props.getNodeProperty("meta64:rssItemLink", node);
            var entry = "";
            if (rssLink.value.toLowerCase().indexOf(".mp3") != -1) {
                if (rssTitle) {
                    entry += m64.render.tag("h3", {}, rssTitle.value);
                }
                entry += m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');",
                    "class": "standardButton"
                }, "Play");
            }
            else {
                entry += m64.render.tag("a", {
                    "href": rssLink.value
                }, m64.render.tag("h3", {}, rssTitle.value));
            }
            if (rssDesc) {
                entry += m64.render.tag("p", {}, rssDesc.value);
            }
            if (rssAuthor && rssAuthor.value) {
                entry += m64.render.tag("div", {}, "By: " + rssAuthor.value);
            }
            if (rowStyling) {
                ret += m64.render.tag("div", {
                    "class": "jcr-content"
                }, entry);
            }
            else {
                ret += m64.render.tag("div", {
                    "class": "jcr-root-content"
                }, entry);
            }
            return ret;
        };
        podcast.openPlayerDialog = function (_uid) {
            uid = _uid;
            node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                var rssLink_1 = m64.props.getNodeProperty("meta64:rssItemLink", node);
                if (rssLink_1 && rssLink_1.value.toLowerCase().indexOf(".mp3") != -1) {
                    m64.util.json("getPlayerInfo", {
                        "url": rssLink_1.value
                    }, function (res) {
                        parseAdSegmentUid(uid);
                        var dlg = new m64.AudioPlayerDlg(rssLink_1.value, uid, res.timeOffset);
                        dlg.open();
                    });
                }
            }
        };
        var parseAdSegmentUid = function (_uid) {
            if (node) {
                var adSegs = m64.props.getNodeProperty("ad-segments", node);
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
                adSegments.push(new m64.AdSegment(beginSecs, endSecs));
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
                pushTimer = setInterval(podcast.pushTimerFunction, 10000);
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
            console.log("pushTimer");
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
            if (m64.meta64.isAnonUser)
                return;
            m64.util.json("setPlayerInfo", {
                "url": url,
                "timeOffset": timeOffset,
                "nodePath": node.path
            }, setPlayerInfoResponse);
        };
        var setPlayerInfoResponse = function () {
        };
    })(podcast = m64.podcast || (m64.podcast = {}));
})(m64 || (m64 = {}));
m64.meta64.renderFunctionsByJcrType["meta64:rssfeed"] = m64.podcast.renderFeedNode;
m64.meta64.renderFunctionsByJcrType["meta64:rssitem"] = m64.podcast.renderEntryNode;
console.log("running module: DialogBase.js");
var m64;
(function (m64) {
    var DialogBase = (function () {
        function DialogBase(domId) {
            var _this = this;
            this.domId = domId;
            this.init = function () {
            };
            this.closeEvent = function () {
            };
            this.build = function () {
                return "";
            };
            this.open = function () {
                var thiz = _this;
                var modalsContainer = m64.util.polyElm("modalsContainer");
                var id = _this.id(_this.domId);
                var node = document.createElement("paper-dialog");
                node.setAttribute("id", id);
                modalsContainer.node.appendChild(node);
                node.style.border = "3px solid gray";
                Polymer.dom.flush();
                Polymer.updateStyles();
                var content = _this.build();
                m64.util.setHtml(id, content);
                _this.built = true;
                _this.init();
                console.log("Showing dialog: " + id);
                var polyElm = m64.util.polyElm(id);
                polyElm.node.noCancelOnOutsideClick = true;
                polyElm.node.open();
                node.addEventListener('iron-overlay-closed', function (customEvent) {
                    thiz.closeEvent();
                });
            };
            this.id = function (id) {
                if (id == null)
                    return null;
                if (id.contains("_dlgId")) {
                    return id;
                }
                return id + "_dlgId" + _this.data.guid;
            };
            this.makePasswordField = function (text, id) {
                return m64.render.makePasswordField(text, _this.id(id));
            };
            this.makeEditField = function (fieldName, id) {
                id = _this.id(id);
                return m64.render.tag("paper-input", {
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
                return m64.render.tag("p", attrs, message);
            };
            this.makeButton = function (text, id, callback, ctx) {
                var attribs = {
                    "raised": "raised",
                    "id": _this.id(id),
                    "class": "standardButton"
                };
                if (callback != undefined) {
                    attribs["onClick"] = m64.meta64.encodeOnClick(callback, ctx);
                }
                return m64.render.tag("paper-button", attribs, text, true);
            };
            this.makeCloseButton = function (text, id, callback, ctx, initiallyVisible) {
                var attribs = {
                    "raised": "raised",
                    "dialog-confirm": "dialog-confirm",
                    "id": _this.id(id),
                    "class": "standardButton"
                };
                var onClick = "";
                if (callback != undefined) {
                    onClick = m64.meta64.encodeOnClick(callback, ctx);
                }
                onClick += ";" + m64.meta64.encodeOnClick(_this.cancel, _this);
                if (onClick) {
                    attribs["onClick"] = onClick;
                }
                if (initiallyVisible === false) {
                    attribs["style"] = "display:none;";
                }
                return m64.render.tag("paper-button", attribs, text, true);
            };
            this.bindEnterKey = function (id, callback) {
                m64.util.bindEnterKey(_this.id(id), callback);
            };
            this.setInputVal = function (id, val) {
                if (!val) {
                    val = "";
                }
                m64.util.setInputVal(_this.id(id), val);
            };
            this.getInputVal = function (id) {
                return m64.util.getInputVal(_this.id(id)).trim();
            };
            this.setHtml = function (text, id) {
                m64.util.setHtml(_this.id(id), text);
            };
            this.makeRadioButton = function (label, id) {
                id = _this.id(id);
                return m64.render.tag("paper-radio-button", {
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
                var checkbox = m64.render.tag("paper-checkbox", attrs, "", false);
                checkbox += m64.render.tag("label", {
                    "for": id
                }, label, true);
                return checkbox;
            };
            this.makeHeader = function (text, id, centered) {
                var attrs = {
                    "class": "dialog-header " + (centered ? "horizontal center-justified layout" : "")
                };
                if (id) {
                    attrs["id"] = _this.id(id);
                }
                return m64.render.tag("h2", attrs, text);
            };
            this.focus = function (id) {
                if (!id.startsWith("#")) {
                    id = "#" + id;
                }
                id = _this.id(id);
                setTimeout(function () {
                    $(id).focus();
                }, 1000);
            };
            this.data = {};
            m64.meta64.registerDataObject(this);
            m64.meta64.registerDataObject(this.data);
        }
        DialogBase.prototype.cancel = function () {
            var polyElm = m64.util.polyElm(this.id(this.domId));
            polyElm.node.cancel();
        };
        return DialogBase;
    }());
    m64.DialogBase = DialogBase;
})(m64 || (m64 = {}));
console.log("running module: ConfirmDlg.js");
var m64;
(function (m64) {
    var ConfirmDlg = (function (_super) {
        __extends(ConfirmDlg, _super);
        function ConfirmDlg(title, message, buttonText, yesCallback, noCallback) {
            var _this = this;
            _super.call(this, "ConfirmDlg");
            this.title = title;
            this.message = message;
            this.buttonText = buttonText;
            this.yesCallback = yesCallback;
            this.noCallback = noCallback;
            this.build = function () {
                var content = _this.makeHeader("", "ConfirmDlgTitle") + _this.makeMessageArea("", "ConfirmDlgMessage");
                var buttons = _this.makeCloseButton("Yes", "ConfirmDlgYesButton", _this.yesCallback)
                    + _this.makeCloseButton("No", "ConfirmDlgNoButton", _this.noCallback);
                content += m64.render.centeredButtonBar(buttons);
                return content;
            };
            this.init = function () {
                _this.setHtml(_this.title, "ConfirmDlgTitle");
                _this.setHtml(_this.message, "ConfirmDlgMessage");
                _this.setHtml(_this.buttonText, "ConfirmDlgYesButton");
            };
        }
        return ConfirmDlg;
    }(m64.DialogBase));
    m64.ConfirmDlg = ConfirmDlg;
})(m64 || (m64 = {}));
console.log("running module: ProgressDlg.js");
var m64;
(function (m64) {
    var ProgressDlg = (function (_super) {
        __extends(ProgressDlg, _super);
        function ProgressDlg() {
            var _this = this;
            _super.call(this, "ProgressDlg");
            this.build = function () {
                var header = _this.makeHeader("Processing Request", "", true);
                var progressBar = m64.render.tag("paper-progress", {
                    "indeterminate": "indeterminate",
                    "value": "800",
                    "min": "100",
                    "max": "1000"
                });
                var barContainer = m64.render.tag("div", {
                    "style": "width:280px; margin:24px;",
                    "class": "horizontal center-justified layout"
                }, progressBar);
                return header + barContainer;
            };
        }
        return ProgressDlg;
    }(m64.DialogBase));
    m64.ProgressDlg = ProgressDlg;
})(m64 || (m64 = {}));
console.log("running module: MessageDlg.js");
var m64;
(function (m64) {
    var MessageDlg = (function (_super) {
        __extends(MessageDlg, _super);
        function MessageDlg(message, title, callback) {
            var _this = this;
            _super.call(this, "MessageDlg");
            this.message = message;
            this.title = title;
            this.callback = callback;
            this.build = function () {
                var content = _this.makeHeader(_this.title) + "<p>" + _this.message + "</p>";
                content += m64.render.centeredButtonBar(_this.makeCloseButton("Ok", "messageDlgOkButton", _this.callback));
                return content;
            };
            if (!title) {
                title = "Message";
            }
            this.title = title;
        }
        return MessageDlg;
    }(m64.DialogBase));
    m64.MessageDlg = MessageDlg;
})(m64 || (m64 = {}));
console.log("running module: LoginDlg.js");
var m64;
(function (m64) {
    var LoginDlg = (function (_super) {
        __extends(LoginDlg, _super);
        function LoginDlg() {
            var _this = this;
            _super.call(this, "LoginDlg");
            this.build = function () {
                var header = _this.makeHeader("Login");
                var formControls = _this.makeEditField("User", "userName") +
                    _this.makePasswordField("Password", "password");
                var loginButton = _this.makeButton("Login", "loginButton", _this.login, _this);
                var resetPasswordButton = _this.makeButton("Forgot Password", "resetPasswordButton", _this.resetPassword, _this);
                var backButton = _this.makeCloseButton("Close", "cancelLoginButton");
                var buttonBar = m64.render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
                var divider = "<div><h3>Or Login With...</h3></div>";
                var form = formControls + buttonBar;
                var mainContent = form;
                var content = header + mainContent;
                _this.bindEnterKey("userName", m64.user.login);
                _this.bindEnterKey("password", m64.user.login);
                return content;
            };
            this.init = function () {
                _this.populateFromCookies();
            };
            this.populateFromCookies = function () {
                var usr = $.cookie(m64.cnst.COOKIE_LOGIN_USR);
                var pwd = $.cookie(m64.cnst.COOKIE_LOGIN_PWD);
                if (usr) {
                    _this.setInputVal("userName", usr);
                }
                if (pwd) {
                    _this.setInputVal("password", pwd);
                }
            };
            this.login = function () {
                var usr = _this.getInputVal("userName");
                var pwd = _this.getInputVal("password");
                m64.user.login(_this, usr, pwd);
            };
            this.resetPassword = function () {
                var thiz = _this;
                var usr = _this.getInputVal("userName");
                (new m64.ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
                    thiz.cancel();
                    (new m64.ResetPasswordDlg(usr)).open();
                })).open();
            };
        }
        return LoginDlg;
    }(m64.DialogBase));
    m64.LoginDlg = LoginDlg;
})(m64 || (m64 = {}));
console.log("running module: SignupDlg.js");
var m64;
(function (m64) {
    var SignupDlg = (function (_super) {
        __extends(SignupDlg, _super);
        function SignupDlg() {
            var _this = this;
            _super.call(this, "SignupDlg");
            this.build = function () {
                var header = _this.makeHeader(BRANDING_TITLE + " Signup");
                var formControls = _this.makeEditField("User", "signupUserName") +
                    _this.makePasswordField("Password", "signupPassword") +
                    _this.makeEditField("Email", "signupEmail") +
                    _this.makeEditField("Captcha", "signupCaptcha");
                var captchaImage = m64.render.tag("div", {
                    "class": "captcha-image"
                }, m64.render.tag("img", {
                    "id": _this.id("captchaImage"),
                    "class": "captcha",
                    "src": ""
                }, "", false));
                var signupButton = _this.makeButton("Signup", "signupButton", _this.signup, _this);
                var newCaptchaButton = _this.makeButton("Try Different Image", "tryAnotherCaptchaButton", _this.tryAnotherCaptcha, _this);
                var backButton = _this.makeCloseButton("Close", "cancelSignupButton");
                var buttonBar = m64.render.centeredButtonBar(signupButton + newCaptchaButton + backButton);
                return header + formControls + captchaImage + buttonBar;
            };
            this.signup = function () {
                var userName = _this.getInputVal("signupUserName");
                var password = _this.getInputVal("signupPassword");
                var email = _this.getInputVal("signupEmail");
                var captcha = _this.getInputVal("signupCaptcha");
                if (!userName || userName.length == 0 ||
                    !password || password.length == 0 ||
                    !email || email.length == 0 ||
                    !captcha || captcha.length == 0) {
                    (new m64.MessageDlg("Sorry, you cannot leave any fields blank.")).open();
                    return;
                }
                m64.util.json("signup", {
                    "userName": userName,
                    "password": password,
                    "email": email,
                    "captcha": captcha
                }, _this.signupResponse, _this);
            };
            this.signupResponse = function (res) {
                if (m64.util.checkSuccess("Signup new user", res)) {
                    _this.cancel();
                    (new m64.MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
                }
            };
            this.tryAnotherCaptcha = function () {
                var n = m64.util.currentTimeMillis();
                var src = postTargetUrl + "captcha?t=" + n;
                $("#" + _this.id("captchaImage")).attr("src", src);
            };
            this.pageInitSignupPg = function () {
                _this.tryAnotherCaptcha();
            };
            this.init = function () {
                _this.pageInitSignupPg();
                m64.util.delayedFocus("#" + _this.id("signupUserName"));
            };
        }
        return SignupDlg;
    }(m64.DialogBase));
    m64.SignupDlg = SignupDlg;
})(m64 || (m64 = {}));
console.log("running module: PrefsDlg.js");
var m64;
(function (m64) {
    var PrefsDlg = (function (_super) {
        __extends(PrefsDlg, _super);
        function PrefsDlg() {
            var _this = this;
            _super.call(this, "PrefsDlg");
            this.build = function () {
                var header = _this.makeHeader("Peferences");
                var radioButtons = _this.makeRadioButton("Simple", "editModeSimple") +
                    _this.makeRadioButton("Advanced", "editModeAdvanced");
                var radioButtonGroup = m64.render.tag("paper-radio-group", {
                    "id": _this.id("simpleModeRadioGroup"),
                    "selected": _this.id("editModeSimple")
                }, radioButtons);
                var showMetaDataCheckBox = _this.makeCheckBox("Show Row Metadata", "showMetaData", m64.meta64.showMetaData);
                var checkboxBar = m64.render.makeHorzControlGroup(showMetaDataCheckBox);
                var formControls = radioButtonGroup;
                var legend = "<legend>Edit Mode:</legend>";
                var radioBar = m64.render.makeHorzControlGroup(legend + formControls);
                var saveButton = _this.makeCloseButton("Save", "savePreferencesButton", _this.savePreferences, _this);
                var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
                var buttonBar = m64.render.centeredButtonBar(saveButton + backButton);
                return header + radioBar + checkboxBar + buttonBar;
            };
            this.savePreferences = function () {
                var polyElm = m64.util.polyElm(_this.id("simpleModeRadioGroup"));
                m64.meta64.editModeOption = polyElm.node.selected == _this.id("editModeSimple") ? m64.meta64.MODE_SIMPLE
                    : m64.meta64.MODE_ADVANCED;
                var showMetaDataCheckbox = m64.util.polyElm(_this.id("showMetaData"));
                m64.meta64.showMetaData = showMetaDataCheckbox.node.checked;
                m64.util.json("saveUserPreferences", {
                    "userPreferences": {
                        "advancedMode": m64.meta64.editModeOption === m64.meta64.MODE_ADVANCED,
                        "editMode": m64.meta64.userPreferences.editMode,
                        "lastNode": null,
                        "importAllowed": false,
                        "exportAllowed": false,
                        "showMetaData": m64.meta64.showMetaData
                    }
                }, _this.savePreferencesResponse, _this);
            };
            this.savePreferencesResponse = function (res) {
                if (m64.util.checkSuccess("Saving Preferences", res)) {
                    m64.meta64.selectTab("mainTabName");
                    m64.meta64.refresh();
                }
            };
            this.init = function () {
                var polyElm = m64.util.polyElm(_this.id("simpleModeRadioGroup"));
                polyElm.node.select(m64.meta64.editModeOption == m64.meta64.MODE_SIMPLE ? _this.id("editModeSimple") : _this
                    .id("editModeAdvanced"));
                polyElm = m64.util.polyElm(_this.id("showMetaData"));
                polyElm.node.checked = m64.meta64.showMetaData;
                Polymer.dom.flush();
            };
        }
        return PrefsDlg;
    }(m64.DialogBase));
    m64.PrefsDlg = PrefsDlg;
})(m64 || (m64 = {}));
console.log("running module: ManageAccountDlg.js");
var m64;
(function (m64) {
    var ManageAccountDlg = (function (_super) {
        __extends(ManageAccountDlg, _super);
        function ManageAccountDlg() {
            var _this = this;
            _super.call(this, "ManageAccountDlg");
            this.build = function () {
                var header = _this.makeHeader("Manage Account");
                var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
                var closeAccountButton = m64.meta64.isAdminUser ? "Admin Cannot Close Acount" : _this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
                var buttonBar = m64.render.centeredButtonBar(closeAccountButton);
                var bottomButtonBar = m64.render.centeredButtonBar(backButton);
                var bottomButtonBarDiv = m64.render.tag("div", {
                    "class": "close-account-bar"
                }, bottomButtonBar);
                return header + buttonBar + bottomButtonBarDiv;
            };
        }
        return ManageAccountDlg;
    }(m64.DialogBase));
    m64.ManageAccountDlg = ManageAccountDlg;
})(m64 || (m64 = {}));
console.log("running module: ExportDlg.js");
var m64;
(function (m64) {
    var ExportDlg = (function (_super) {
        __extends(ExportDlg, _super);
        function ExportDlg() {
            var _this = this;
            _super.call(this, "ExportDlg");
            this.build = function () {
                var header = _this.makeHeader("Export to XML");
                var formControls = _this.makeEditField("Export to File Name", "exportTargetNodeName");
                var exportButton = _this.makeButton("Export", "exportNodesButton", _this.exportNodes, _this);
                var backButton = _this.makeCloseButton("Close", "cancelExportButton");
                var buttonBar = m64.render.centeredButtonBar(exportButton + backButton);
                return header + formControls + buttonBar;
            };
            this.exportNodes = function () {
                var highlightNode = m64.meta64.getHighlightedNode();
                var targetFileName = _this.getInputVal("exportTargetNodeName");
                if (m64.util.emptyString(targetFileName)) {
                    (new m64.MessageDlg("Please enter a name for the export file.")).open();
                    return;
                }
                if (highlightNode) {
                    m64.util.json("exportToXml", {
                        "nodeId": highlightNode.id,
                        "targetFileName": targetFileName
                    }, _this.exportResponse, _this);
                }
            };
            this.exportResponse = function (res) {
                if (m64.util.checkSuccess("Export", res)) {
                    (new m64.MessageDlg("Export Successful.")).open();
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
        }
        return ExportDlg;
    }(m64.DialogBase));
    m64.ExportDlg = ExportDlg;
})(m64 || (m64 = {}));
console.log("running module: ImportDlg.js");
var m64;
(function (m64) {
    var ImportDlg = (function (_super) {
        __extends(ImportDlg, _super);
        function ImportDlg() {
            var _this = this;
            _super.call(this, "ImportDlg");
            this.build = function () {
                var header = _this.makeHeader("Import from XML");
                var formControls = _this.makeEditField("File name to import", "sourceFileName");
                var importButton = _this.makeButton("Import", "importNodesButton", _this.importNodes, _this);
                var backButton = _this.makeCloseButton("Close", "cancelImportButton");
                var buttonBar = m64.render.centeredButtonBar(importButton + backButton);
                return header + formControls + buttonBar;
            };
            this.importNodes = function () {
                var highlightNode = m64.meta64.getHighlightedNode();
                var sourceFileName = _this.getInputVal("sourceFileName");
                if (m64.util.emptyString(sourceFileName)) {
                    (new m64.MessageDlg("Please enter a name for the import file.")).open();
                    return;
                }
                if (highlightNode) {
                    m64.util.json("import", {
                        "nodeId": highlightNode.id,
                        "sourceFileName": sourceFileName
                    }, _this.importResponse, _this);
                }
            };
            this.importResponse = function (res) {
                if (m64.util.checkSuccess("Import", res)) {
                    (new m64.MessageDlg("Import Successful.")).open();
                    m64.view.refreshTree(null, false);
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
        }
        return ImportDlg;
    }(m64.DialogBase));
    m64.ImportDlg = ImportDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchContentDlg.js");
var m64;
(function (m64) {
    var SearchContentDlg = (function (_super) {
        __extends(SearchContentDlg, _super);
        function SearchContentDlg() {
            var _this = this;
            _super.call(this, "SearchContentDlg");
            this.build = function () {
                var header = _this.makeHeader("Search Content");
                var instructions = _this.makeMessageArea("Enter some text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
                var formControls = _this.makeEditField("Search", "searchText");
                var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchNodes, _this);
                var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            this.searchNodes = function () {
                return _this.searchProperty(m64.jcrCnst.CONTENT);
            };
            this.searchProperty = function (searchProp) {
                if (!m64.util.ajaxReady("searchNodes")) {
                    return;
                }
                var node = m64.meta64.getHighlightedNode();
                if (!node) {
                    (new m64.MessageDlg("No node is selected to search under.")).open();
                    return;
                }
                var searchText = _this.getInputVal("searchText");
                if (m64.util.emptyString(searchText)) {
                    (new m64.MessageDlg("Enter search text.")).open();
                    return;
                }
                m64.util.json("nodeSearch", {
                    "nodeId": node.id,
                    "searchText": searchText,
                    "sortDir": "",
                    "sortField": "",
                    "searchProp": searchProp
                }, m64.srch.searchNodesResponse, m64.srch);
            };
            this.init = function () {
                m64.util.delayedFocus(_this.id("searchText"));
            };
        }
        return SearchContentDlg;
    }(m64.DialogBase));
    m64.SearchContentDlg = SearchContentDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchTagsDlg.js");
var m64;
(function (m64) {
    var SearchTagsDlg = (function (_super) {
        __extends(SearchTagsDlg, _super);
        function SearchTagsDlg() {
            var _this = this;
            _super.call(this, "SearchTagsDlg");
            this.build = function () {
                var header = _this.makeHeader("Search Tags");
                var instructions = _this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
                var formControls = _this.makeEditField("Search", "searchText");
                var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchTags, _this);
                var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            this.searchTags = function () {
                return _this.searchProperty(m64.jcrCnst.TAGS);
            };
            this.searchProperty = function (searchProp) {
                if (!m64.util.ajaxReady("searchNodes")) {
                    return;
                }
                var node = m64.meta64.getHighlightedNode();
                if (!node) {
                    (new m64.MessageDlg("No node is selected to search under.")).open();
                    return;
                }
                var searchText = _this.getInputVal("searchText");
                if (m64.util.emptyString(searchText)) {
                    (new m64.MessageDlg("Enter search text.")).open();
                    return;
                }
                m64.util.json("nodeSearch", {
                    "nodeId": node.id,
                    "searchText": searchText,
                    "sortDir": "",
                    "sortField": "",
                    "searchProp": searchProp
                }, m64.srch.searchNodesResponse, m64.srch);
            };
            this.init = function () {
                m64.util.delayedFocus(_this.id("searchText"));
            };
        }
        return SearchTagsDlg;
    }(m64.DialogBase));
    m64.SearchTagsDlg = SearchTagsDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchFilesDlg.js");
var m64;
(function (m64) {
    var SearchFilesDlg = (function (_super) {
        __extends(SearchFilesDlg, _super);
        function SearchFilesDlg() {
            var _this = this;
            _super.call(this, "SearchFilesDlg");
            this.build = function () {
                var header = _this.makeHeader("Search Files");
                var instructions = _this.makeMessageArea("Enter some text to find.");
                var formControls = _this.makeEditField("Search", "searchText");
                var searchButton = _this.makeCloseButton("Search", "searchButton", _this.searchTags, _this);
                var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            this.searchTags = function () {
                return _this.searchProperty(m64.jcrCnst.TAGS);
            };
            this.searchProperty = function (searchProp) {
                if (!m64.util.ajaxReady("searchFiles")) {
                    return;
                }
                var node = m64.meta64.getHighlightedNode();
                if (!node) {
                    (new m64.MessageDlg("No node is selected to search under.")).open();
                    return;
                }
                var searchText = _this.getInputVal("searchText");
                if (m64.util.emptyString(searchText)) {
                    (new m64.MessageDlg("Enter search text.")).open();
                    return;
                }
                m64.util.json("fileSearch", {
                    "searchText": searchText
                }, m64.srch.searchFilesResponse, m64.srch);
            };
            this.init = function () {
                m64.util.delayedFocus(_this.id("searchText"));
            };
        }
        return SearchFilesDlg;
    }(m64.DialogBase));
    m64.SearchFilesDlg = SearchFilesDlg;
})(m64 || (m64 = {}));
console.log("running module: ChangePasswordDlg.js");
var m64;
(function (m64) {
    var ChangePasswordDlg = (function (_super) {
        __extends(ChangePasswordDlg, _super);
        function ChangePasswordDlg(passCode) {
            var _this = this;
            _super.call(this, "ChangePasswordDlg");
            this.passCode = passCode;
            this.build = function () {
                var header = _this.makeHeader(_this.passCode ? "Password Reset" : "Change Password");
                var message = m64.render.tag("p", {}, "Enter your new password below...");
                var formControls = _this.makePasswordField("New Password", "changePassword1");
                var changePasswordButton = _this.makeCloseButton("Change Password", "changePasswordActionButton", _this.changePassword, _this);
                var backButton = _this.makeCloseButton("Close", "cancelChangePasswordButton");
                var buttonBar = m64.render.centeredButtonBar(changePasswordButton + backButton);
                return header + message + formControls + buttonBar;
            };
            this.changePassword = function () {
                _this.pwd = _this.getInputVal("changePassword1").trim();
                if (_this.pwd && _this.pwd.length >= 4) {
                    m64.util.json("changePassword", {
                        "newPassword": _this.pwd,
                        "passCode": _this.passCode
                    }, _this.changePasswordResponse, _this);
                }
                else {
                    (new m64.MessageDlg("Invalid password(s).")).open();
                }
            };
            this.changePasswordResponse = function (res) {
                if (m64.util.checkSuccess("Change password", res)) {
                    var msg = "Password changed successfully.";
                    if (_this.passCode) {
                        msg += "<p>You may now login as <b>" + res.user
                            + "</b> with your new password.";
                    }
                    var thiz = _this;
                    (new m64.MessageDlg(msg, "Password Change", function () {
                        if (thiz.passCode) {
                            window.location.href = window.location.origin;
                        }
                    })).open();
                }
            };
            this.init = function () {
                _this.focus("changePassword1");
            };
        }
        return ChangePasswordDlg;
    }(m64.DialogBase));
    m64.ChangePasswordDlg = ChangePasswordDlg;
})(m64 || (m64 = {}));
console.log("running module: ResetPasswordDlg.js");
var m64;
(function (m64) {
    var ResetPasswordDlg = (function (_super) {
        __extends(ResetPasswordDlg, _super);
        function ResetPasswordDlg(user) {
            var _this = this;
            _super.call(this, "ResetPasswordDlg");
            this.user = user;
            this.build = function () {
                var header = _this.makeHeader("Reset Password");
                var message = _this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");
                var formControls = _this.makeEditField("User", "userName") +
                    _this.makeEditField("Email Address", "emailAddress");
                var resetPasswordButton = _this.makeCloseButton("Reset my Password", "resetPasswordButton", _this.resetPassword, _this);
                var backButton = _this.makeCloseButton("Close", "cancelResetPasswordButton");
                var buttonBar = m64.render.centeredButtonBar(resetPasswordButton + backButton);
                return header + message + formControls + buttonBar;
            };
            this.resetPassword = function () {
                var userName = _this.getInputVal("userName").trim();
                var emailAddress = _this.getInputVal("emailAddress").trim();
                if (userName && emailAddress) {
                    m64.util.json("resetPassword", {
                        "user": userName,
                        "email": emailAddress
                    }, _this.resetPasswordResponse, _this);
                }
                else {
                    (new m64.MessageDlg("Oops. Try that again.")).open();
                }
            };
            this.resetPasswordResponse = function (res) {
                if (m64.util.checkSuccess("Reset password", res)) {
                    (new m64.MessageDlg("Password reset email was sent. Check your inbox.")).open();
                }
            };
            this.init = function () {
                if (_this.user) {
                    _this.setInputVal("userName", _this.user);
                }
            };
        }
        return ResetPasswordDlg;
    }(m64.DialogBase));
    m64.ResetPasswordDlg = ResetPasswordDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromFileDlg.js");
var m64;
(function (m64) {
    var UploadFromFileDlg = (function (_super) {
        __extends(UploadFromFileDlg, _super);
        function UploadFromFileDlg() {
            var _this = this;
            _super.call(this, "UploadFromFileDlg");
            this.build = function () {
                var header = _this.makeHeader("Upload File Attachment");
                var uploadPathDisplay = "";
                if (m64.cnst.SHOW_PATH_IN_DLGS) {
                    uploadPathDisplay += m64.render.tag("div", {
                        "id": _this.id("uploadPathDisplay"),
                        "class": "path-display-in-editor"
                    }, "");
                }
                var uploadFieldContainer = "";
                var formFields = "";
                for (var i = 0; i < 7; i++) {
                    var input = m64.render.tag("input", {
                        "id": _this.id("upload" + i + "FormInputId"),
                        "type": "file",
                        "name": "files"
                    }, "", true);
                    formFields += m64.render.tag("div", {
                        "style": "margin-bottom: 10px;"
                    }, input);
                }
                formFields += m64.render.tag("input", {
                    "id": _this.id("uploadFormNodeId"),
                    "type": "hidden",
                    "name": "nodeId"
                }, "", true);
                formFields += m64.render.tag("input", {
                    "id": _this.id("explodeZips"),
                    "type": "hidden",
                    "name": "explodeZips"
                }, "", true);
                var form = m64.render.tag("form", {
                    "id": _this.id("uploadForm"),
                    "method": "POST",
                    "enctype": "multipart/form-data",
                    "data-ajax": "false"
                }, formFields);
                uploadFieldContainer = m64.render.tag("div", {
                    "id": _this.id("uploadFieldContainer")
                }, "<p>Upload from your computer</p>" + form);
                var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
                var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                var buttonBar = m64.render.centeredButtonBar(uploadButton + backButton);
                return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
            };
            this.hasAnyZipFiles = function () {
                var ret = false;
                for (var i = 0; i < 7; i++) {
                    var inputVal = $("#" + _this.id("upload" + i + "FormInputId")).val();
                    if (inputVal.toLowerCase().endsWith(".zip")) {
                        return true;
                    }
                }
                return ret;
            };
            this.uploadFileNow = function () {
                var uploadFunc = function (explodeZips) {
                    $("#" + _this.id("uploadFormNodeId")).attr("value", m64.attachment.uploadNode.id);
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
                        m64.meta64.refresh();
                    });
                    prms.fail(function () {
                        (new m64.MessageDlg("Upload failed.")).open();
                    });
                };
                if (_this.hasAnyZipFiles()) {
                    (new m64.ConfirmDlg("Explode Zips?", "Do you want Zip files exploded onto the tree when uploaded?", "Yes, explode zips", function () {
                        uploadFunc(true);
                    }, function () {
                        uploadFunc(false);
                    })).open();
                }
                else {
                    uploadFunc(false);
                }
            };
            this.init = function () {
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
            };
        }
        return UploadFromFileDlg;
    }(m64.DialogBase));
    m64.UploadFromFileDlg = UploadFromFileDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromFileDropzoneDlg.js");
var m64;
(function (m64) {
    var UploadFromFileDropzoneDlg = (function (_super) {
        __extends(UploadFromFileDropzoneDlg, _super);
        function UploadFromFileDropzoneDlg() {
            var _this = this;
            _super.call(this, "UploadFromFileDropzoneDlg");
            this.fileList = null;
            this.zipQuestionAnswered = false;
            this.explodeZips = false;
            this.build = function () {
                var header = _this.makeHeader("Upload File Attachment");
                var uploadPathDisplay = "";
                if (m64.cnst.SHOW_PATH_IN_DLGS) {
                    uploadPathDisplay += m64.render.tag("div", {
                        "id": _this.id("uploadPathDisplay"),
                        "class": "path-display-in-editor"
                    }, "");
                }
                var formFields = "";
                console.log("Upload Action URL: " + postTargetUrl + "upload");
                var hiddenInputContainer = m64.render.tag("div", {
                    "id": _this.id("hiddenInputContainer"),
                    "style": "display: none;"
                }, "");
                var form = m64.render.tag("form", {
                    "action": postTargetUrl + "upload",
                    "autoProcessQueue": false,
                    "class": "dropzone",
                    "id": _this.id("dropzone-form-id")
                }, "");
                var uploadButton = _this.makeCloseButton("Upload", "uploadButton", null, null, false);
                var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                var buttonBar = m64.render.centeredButtonBar(uploadButton + backButton);
                return header + uploadPathDisplay + form + hiddenInputContainer + buttonBar;
            };
            this.configureDropZone = function () {
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
                            formData.append("nodeId", m64.attachment.uploadNode.id);
                            formData.append("explodeZips", this.explodeZips ? "true" : "false");
                            this.zipQuestionAnswered = false;
                        });
                        this.on("queuecomplete", function (file) {
                            m64.meta64.refresh();
                        });
                    }
                };
                $("#" + _this.id("dropzone-form-id")).dropzone(config);
            };
            this.updateFileList = function (dropzoneEvt) {
                var thiz = _this;
                _this.fileList = dropzoneEvt.getAddedFiles();
                _this.fileList = _this.fileList.concat(dropzoneEvt.getQueuedFiles());
                if (!_this.zipQuestionAnswered && _this.hasAnyZipFiles()) {
                    _this.zipQuestionAnswered = true;
                    (new m64.ConfirmDlg("Explode Zips?", "Do you want Zip files exploded onto the tree when uploaded?", "Yes, explode zips", function () {
                        thiz.explodeZips = true;
                    }, function () {
                        thiz.explodeZips = false;
                    })).open();
                }
            };
            this.hasAnyZipFiles = function () {
                var ret = false;
                for (var _i = 0, _a = _this.fileList; _i < _a.length; _i++) {
                    var file = _a[_i];
                    if (file["name"].toLowerCase().endsWith(".zip")) {
                        return true;
                    }
                }
                return ret;
            };
            this.runButtonEnablement = function (dropzoneEvt) {
                if (dropzoneEvt.getAddedFiles().length > 0 ||
                    dropzoneEvt.getQueuedFiles().length > 0) {
                    $("#" + _this.id("uploadButton")).show();
                }
                else {
                    $("#" + _this.id("uploadButton")).hide();
                }
            };
            this.init = function () {
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
                _this.configureDropZone();
            };
        }
        return UploadFromFileDropzoneDlg;
    }(m64.DialogBase));
    m64.UploadFromFileDropzoneDlg = UploadFromFileDropzoneDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromUrlDlg.js");
var m64;
(function (m64) {
    var UploadFromUrlDlg = (function (_super) {
        __extends(UploadFromUrlDlg, _super);
        function UploadFromUrlDlg() {
            var _this = this;
            _super.call(this, "UploadFromUrlDlg");
            this.build = function () {
                var header = _this.makeHeader("Upload File Attachment");
                var uploadPathDisplay = "";
                if (m64.cnst.SHOW_PATH_IN_DLGS) {
                    uploadPathDisplay += m64.render.tag("div", {
                        "id": _this.id("uploadPathDisplay"),
                        "class": "path-display-in-editor"
                    }, "");
                }
                var uploadFieldContainer = "";
                var uploadFromUrlDiv = "";
                var uploadFromUrlField = _this.makeEditField("Upload From URL", "uploadFromUrl");
                uploadFromUrlDiv = m64.render.tag("div", {}, uploadFromUrlField);
                var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
                var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                var buttonBar = m64.render.centeredButtonBar(uploadButton + backButton);
                return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
            };
            this.uploadFileNow = function () {
                var sourceUrl = _this.getInputVal("uploadFromUrl");
                if (sourceUrl) {
                    m64.util.json("uploadFromUrl", {
                        "nodeId": m64.attachment.uploadNode.id,
                        "sourceUrl": sourceUrl
                    }, _this.uploadFromUrlResponse, _this);
                }
            };
            this.uploadFromUrlResponse = function (res) {
                if (m64.util.checkSuccess("Upload from URL", res)) {
                    m64.meta64.refresh();
                }
            };
            this.init = function () {
                m64.util.setInputVal(_this.id("uploadFromUrl"), "");
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
            };
        }
        return UploadFromUrlDlg;
    }(m64.DialogBase));
    m64.UploadFromUrlDlg = UploadFromUrlDlg;
})(m64 || (m64 = {}));
console.log("running module: EditNodeDlg.js");
var m64;
(function (m64) {
    var EditNodeDlg = (function (_super) {
        __extends(EditNodeDlg, _super);
        function EditNodeDlg() {
            var _this = this;
            _super.call(this, "EditNodeDlg");
            this.fieldIdToPropMap = {};
            this.propEntries = new Array();
            this.build = function () {
                var header = _this.makeHeader("Edit Node");
                var saveNodeButton = _this.makeCloseButton("Save", "saveNodeButton", _this.saveNode, _this);
                var addPropertyButton = _this.makeButton("Add Property", "addPropertyButton", _this.addProperty, _this);
                var addTagsPropertyButton = _this.makeButton("Add Tags", "addTagsPropertyButton", _this.addTagsProperty, _this);
                var splitContentButton = _this.makeButton("Split", "splitContentButton", _this.splitContent, _this);
                var cancelEditButton = _this.makeCloseButton("Close", "cancelEditButton", _this.cancelEdit, _this);
                var buttonBar = m64.render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton
                    + splitContentButton + cancelEditButton, "buttons");
                var width = 800;
                var height = 400;
                var internalMainContent = "";
                if (m64.cnst.SHOW_PATH_IN_DLGS) {
                    internalMainContent += m64.render.tag("div", {
                        id: _this.id("editNodePathDisplay"),
                        "class": "path-display-in-editor"
                    });
                }
                internalMainContent += m64.render.tag("div", {
                    id: _this.id("editNodeInstructions")
                }) + m64.render.tag("div", {
                    id: _this.id("propertyEditFieldContainer"),
                    style: "padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll; border:4px solid lightGray;"
                }, "Loading...");
                return header + internalMainContent + buttonBar;
            };
            this.populateEditNodePg = function () {
                m64.view.initEditPathDisplayById(_this.id("editNodePathDisplay"));
                var fields = "";
                var counter = 0;
                _this.fieldIdToPropMap = {};
                _this.propEntries = new Array();
                if (m64.edit.editNode) {
                    console.log("Editing existing node.");
                    var thiz = _this;
                    var editOrderedProps = m64.props.getPropertiesInEditingOrder(m64.edit.editNode.properties);
                    var aceFields = [];
                    $.each(editOrderedProps, function (index, prop) {
                        if (!m64.render.allowPropertyToDisplay(prop.name)) {
                            console.log("Hiding property: " + prop.name);
                            return;
                        }
                        var fieldId = thiz.id("editNodeTextContent" + index);
                        console.log("Creating edit field " + fieldId + " for property " + prop.name);
                        var isMulti = prop.values && prop.values.length > 0;
                        var isReadOnlyProp = m64.render.isReadOnlyProperty(prop.name);
                        var isBinaryProp = m64.render.isBinaryProperty(prop.name);
                        var propEntry = new m64.PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);
                        thiz.fieldIdToPropMap[fieldId] = propEntry;
                        thiz.propEntries.push(propEntry);
                        var buttonBar = "";
                        if (!isReadOnlyProp && !isBinaryProp) {
                            buttonBar = thiz.makePropertyEditButtonBar(prop, fieldId);
                        }
                        var field = buttonBar;
                        if (isMulti) {
                            field += thiz.makeMultiPropEditor(propEntry);
                        }
                        else {
                            field += thiz.makeSinglePropEditor(propEntry, aceFields);
                        }
                        fields += m64.render.tag("div", {
                            "class": ((!isReadOnlyProp && !isBinaryProp) || m64.edit.showReadOnlyProperties ? "propertyEditListItem"
                                : "propertyEditListItemHidden")
                        }, field);
                    });
                }
                else {
                    console.log("Editing new node.");
                    if (m64.cnst.USE_ACE_EDITOR) {
                        var aceFieldId = _this.id("newNodeNameId");
                        fields += m64.render.tag("div", {
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
                        var field = m64.render.tag("paper-textarea", {
                            "id": _this.id("newNodeNameId"),
                            "label": "New Node Name"
                        }, '', true);
                        fields += m64.render.tag("div", {}, field);
                    }
                }
                m64.util.setHtml(_this.id("propertyEditFieldContainer"), fields);
                if (m64.cnst.USE_ACE_EDITOR) {
                    for (var i = 0; i < aceFields.length; i++) {
                        var editor = ace.edit(aceFields[i].id);
                        editor.setValue(aceFields[i].val.unencodeHtml());
                        m64.meta64.aceEditorsById[aceFields[i].id] = editor;
                    }
                }
                var instr = m64.edit.editingUnsavedNode ?
                    "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                    :
                        "";
                $("#" + _this.id("editNodeInstructions")).html(instr);
                m64.util.setVisibility("#" + _this.id("addPropertyButton"), !m64.edit.editingUnsavedNode);
                var tagsPropExists = m64.props.getNodePropertyVal("tags", m64.edit.editNode) != null;
                m64.util.setVisibility("#" + _this.id("addTagsPropertyButton"), !tagsPropExists);
            };
            this.toggleShowReadOnly = function () {
            };
            this.addProperty = function () {
                _this.editPropertyDlgInst = new m64.EditPropertyDlg(_this);
                _this.editPropertyDlgInst.open();
            };
            this.addTagsProperty = function () {
                if (m64.props.getNodePropertyVal(m64.edit.editNode, "tags")) {
                    return;
                }
                var postData = {
                    nodeId: m64.edit.editNode.id,
                    propertyName: "tags",
                    propertyValue: ""
                };
                m64.util.json("saveProperty", postData, _this.addTagsPropertyResponse, _this);
            };
            this.addTagsPropertyResponse = function (res) {
                if (m64.util.checkSuccess("Add Tags Property", res)) {
                    _this.savePropertyResponse(res);
                }
            };
            this.savePropertyResponse = function (res) {
                m64.util.checkSuccess("Save properties", res);
                m64.edit.editNode.properties.push(res.propertySaved);
                m64.meta64.treeDirty = true;
                if (_this.domId != "EditNodeDlg") {
                    console.log("error: incorrect object for EditNodeDlg");
                }
                _this.populateEditNodePg();
            };
            this.makePropertyEditButtonBar = function (prop, fieldId) {
                var buttonBar = "";
                var clearButton = m64.cnst.SHOW_CLEAR_BUTTON_IN_EDITOR ? m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.meta64.getObjectByGuid(" + _this.guid + ").clearProperty('" + fieldId + "');"
                }, "Clear") : "";
                var addMultiButton = "";
                var deleteButton = "";
                if (prop.name !== m64.jcrCnst.CONTENT) {
                    deleteButton = m64.render.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "m64.meta64.getObjectByGuid(" + _this.guid + ").deleteProperty('" + prop.name + "');"
                    }, "Del");
                }
                var allButtons = addMultiButton + clearButton + deleteButton;
                if (allButtons.length > 0) {
                    buttonBar = m64.render.makeHorizontalFieldSet(allButtons, "property-edit-button-bar");
                }
                else {
                    buttonBar = "";
                }
                return buttonBar;
            };
            this.addSubProperty = function (fieldId) {
                var prop = _this.fieldIdToPropMap[fieldId].property;
                var isMulti = m64.util.isObject(prop.values);
                if (!isMulti) {
                    prop.values = [];
                    prop.values.push(prop.value);
                    prop.value = null;
                }
                prop.values.push("");
                _this.populateEditNodePg();
            };
            this.deleteProperty = function (propName) {
                var thiz = _this;
                (new m64.ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
                    thiz.deletePropertyImmediate(propName);
                })).open();
            };
            this.deletePropertyImmediate = function (propName) {
                var thiz = _this;
                m64.util.json("deleteProperty", {
                    "nodeId": m64.edit.editNode.id,
                    "propName": propName
                }, function (res) {
                    thiz.deletePropertyResponse(res, propName);
                });
            };
            this.deletePropertyResponse = function (res, propertyToDelete) {
                if (m64.util.checkSuccess("Delete property", res)) {
                    m64.props.deletePropertyFromLocalData(propertyToDelete);
                    m64.meta64.treeDirty = true;
                    _this.populateEditNodePg();
                }
            };
            this.clearProperty = function (fieldId) {
                if (!m64.cnst.USE_ACE_EDITOR) {
                    m64.util.setInputVal(_this.id(fieldId), "");
                }
                else {
                    var editor = m64.meta64.aceEditorsById[_this.id(fieldId)];
                    if (editor) {
                        editor.setValue("");
                    }
                }
                var counter = 0;
                while (counter < 1000) {
                    if (!m64.cnst.USE_ACE_EDITOR) {
                        if (!m64.util.setInputVal(_this.id(fieldId + "_subProp" + counter), "")) {
                            break;
                        }
                    }
                    else {
                        var editor = m64.meta64.aceEditorsById[_this.id(fieldId + "_subProp" + counter)];
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
            this.saveNode = function () {
                if (m64.edit.editingUnsavedNode) {
                    console.log("saveNewNode.");
                    _this.saveNewNode();
                }
                else {
                    console.log("saveExistingNode.");
                    _this.saveExistingNode();
                }
            };
            this.saveNewNode = function (newNodeName) {
                if (!newNodeName) {
                    newNodeName = m64.util.getInputVal(_this.id("newNodeNameId"));
                }
                if (m64.meta64.userName != m64.edit.parentOfNewNode.createdBy &&
                    m64.edit.parentOfNewNode.createdBy != "admin") {
                    m64.edit.sendNotificationPendingSave = true;
                }
                m64.meta64.treeDirty = true;
                if (m64.edit.nodeInsertTarget) {
                    m64.util.json("insertNode", {
                        "parentId": m64.edit.parentOfNewNode.id,
                        "targetName": m64.edit.nodeInsertTarget.name,
                        "newNodeName": newNodeName,
                        "typeName": "nt:unstructured"
                    }, m64.edit.insertNodeResponse, m64.edit);
                }
                else {
                    m64.util.json("createSubNode", {
                        "nodeId": m64.edit.parentOfNewNode.id,
                        "newNodeName": newNodeName,
                        "typeName": "nt:unstructured"
                    }, m64.edit.createSubNodeResponse, m64.edit);
                }
            };
            this.saveExistingNode = function () {
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
                        if (m64.cnst.USE_ACE_EDITOR) {
                            var editor = m64.meta64.aceEditorsById[prop.id];
                            if (!editor)
                                throw "Unable to find Ace Editor for ID: " + prop.id;
                            propVal = editor.getValue();
                        }
                        else {
                            propVal = m64.util.getTextAreaValById(prop.id);
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
                            if (m64.cnst.USE_ACE_EDITOR) {
                                var editor = m64.meta64.aceEditorsById[subProp.id];
                                if (!editor)
                                    throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                                propVal = editor.getValue();
                            }
                            else {
                                propVal = m64.util.getTextAreaValById(subProp.id);
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
                        nodeId: m64.edit.editNode.id,
                        properties: propertiesList,
                        sendNotification: m64.edit.sendNotificationPendingSave
                    };
                    console.log("calling saveNode(). PostData=" + m64.util.toJson(postData));
                    m64.util.json("saveNode", postData, m64.edit.saveNodeResponse, null, {
                        savedId: m64.edit.editNode.id
                    });
                    m64.edit.sendNotificationPendingSave = false;
                }
                else {
                    console.log("nothing changed. Nothing to save.");
                }
            };
            this.makeMultiPropEditor = function (propEntry) {
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
                    propValStr = propVal.escapeForAttrib();
                    var label = (i == 0 ? propEntry.property.name : "*") + "." + i;
                    console.log("Creating textarea with id=" + id);
                    var subProp = new m64.SubProp(id, propVal);
                    propEntry.subProps.push(subProp);
                    if (propEntry.binary || propEntry.readOnly) {
                        fields += m64.render.tag("paper-textarea", {
                            "id": id,
                            "readonly": "readonly",
                            "disabled": "disabled",
                            "label": label,
                            "value": propValStr
                        }, '', true);
                    }
                    else {
                        fields += m64.render.tag("paper-textarea", {
                            "id": id,
                            "label": label,
                            "value": propValStr
                        }, '', true);
                    }
                }
                return fields;
            };
            this.makeSinglePropEditor = function (propEntry, aceFields) {
                console.log("Property single-type: " + propEntry.property.name);
                var field = "";
                var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
                var label = m64.render.sanitizePropertyName(propEntry.property.name);
                var propValStr = propVal ? propVal : '';
                propValStr = propValStr.escapeForAttrib();
                console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
                    + "] fieldId=" + propEntry.id);
                if (propEntry.readOnly || propEntry.binary) {
                    field += m64.render.tag("paper-textarea", {
                        "id": propEntry.id,
                        "readonly": "readonly",
                        "disabled": "disabled",
                        "label": label,
                        "value": propValStr
                    }, "", true);
                }
                else {
                    if (propEntry.property.name == m64.jcrCnst.CONTENT) {
                        _this.contentFieldDomId = propEntry.id;
                    }
                    if (!m64.cnst.USE_ACE_EDITOR) {
                        field += m64.render.tag("paper-textarea", {
                            "id": propEntry.id,
                            "label": label,
                            "value": propValStr
                        }, '', true);
                    }
                    else {
                        field += m64.render.tag("div", {
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
                return field;
            };
            this.splitContent = function () {
                var nodeBelow = m64.edit.getNodeBelow(m64.edit.editNode);
                m64.util.json("splitNode", {
                    "nodeId": m64.edit.editNode.id,
                    "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
                    "delimiter": null
                }, _this.splitContentResponse);
            };
            this.splitContentResponse = function (res) {
                if (m64.util.checkSuccess("Split content", res)) {
                    _this.cancel();
                    m64.view.refreshTree(null, false);
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            this.cancelEdit = function () {
                _this.cancel();
                if (m64.meta64.treeDirty) {
                    m64.meta64.goToMainPage(true);
                }
                else {
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            this.init = function () {
                console.log("EditNodeDlg.init");
                _this.populateEditNodePg();
                if (_this.contentFieldDomId) {
                    m64.util.delayedFocus("#" + _this.contentFieldDomId);
                }
            };
            this.fieldIdToPropMap = {};
            this.propEntries = new Array();
        }
        return EditNodeDlg;
    }(m64.DialogBase));
    m64.EditNodeDlg = EditNodeDlg;
})(m64 || (m64 = {}));
console.log("running module: EditPropertyDlg.js");
var m64;
(function (m64) {
    var EditPropertyDlg = (function (_super) {
        __extends(EditPropertyDlg, _super);
        function EditPropertyDlg(editNodeDlg) {
            var _this = this;
            _super.call(this, "EditPropertyDlg");
            this.build = function () {
                var header = _this.makeHeader("Edit Node Property");
                var savePropertyButton = _this.makeCloseButton("Save", "savePropertyButton", _this.saveProperty, _this);
                var cancelEditButton = _this.makeCloseButton("Cancel", "editPropertyPgCloseButton");
                var buttonBar = m64.render.centeredButtonBar(savePropertyButton + cancelEditButton);
                var internalMainContent = "";
                if (m64.cnst.SHOW_PATH_IN_DLGS) {
                    internalMainContent += "<div id='" + _this.id("editPropertyPathDisplay")
                        + "' class='path-display-in-editor'></div>";
                }
                internalMainContent += "<div id='" + _this.id("addPropertyFieldContainer") + "'></div>";
                return header + internalMainContent + buttonBar;
            };
            this.populatePropertyEdit = function () {
                var field = '';
                {
                    var fieldPropNameId = "addPropertyNameTextContent";
                    field += m64.render.tag("paper-textarea", {
                        "name": fieldPropNameId,
                        "id": _this.id(fieldPropNameId),
                        "placeholder": "Enter property name",
                        "label": "Name"
                    }, "", true);
                }
                {
                    var fieldPropValueId = "addPropertyValueTextContent";
                    field += m64.render.tag("paper-textarea", {
                        "name": fieldPropValueId,
                        "id": _this.id(fieldPropValueId),
                        "placeholder": "Enter property text",
                        "label": "Value"
                    }, "", true);
                }
                m64.view.initEditPathDisplayById(_this.id("editPropertyPathDisplay"));
                m64.util.setHtml(_this.id("addPropertyFieldContainer"), field);
            };
            this.saveProperty = function () {
                var propertyNameData = m64.util.getInputVal(_this.id("addPropertyNameTextContent"));
                var propertyValueData = m64.util.getInputVal(_this.id("addPropertyValueTextContent"));
                var postData = {
                    nodeId: m64.edit.editNode.id,
                    propertyName: propertyNameData,
                    propertyValue: propertyValueData
                };
                m64.util.json("saveProperty", postData, _this.savePropertyResponse, _this);
            };
            this.savePropertyResponse = function (res) {
                m64.util.checkSuccess("Save properties", res);
                m64.edit.editNode.properties.push(res.propertySaved);
                m64.meta64.treeDirty = true;
                if (_this.editNodeDlg.domId != "EditNodeDlg") {
                    console.log("error: incorrect object for EditNodeDlg");
                }
                _this.editNodeDlg.populateEditNodePg();
            };
            this.init = function () {
                _this.populatePropertyEdit();
            };
        }
        return EditPropertyDlg;
    }(m64.DialogBase));
    m64.EditPropertyDlg = EditPropertyDlg;
})(m64 || (m64 = {}));
console.log("running module: ShareToPersonDlg.js");
var m64;
(function (m64) {
    var ShareToPersonDlg = (function (_super) {
        __extends(ShareToPersonDlg, _super);
        function ShareToPersonDlg() {
            var _this = this;
            _super.call(this, "ShareToPersonDlg");
            this.build = function () {
                var header = _this.makeHeader("Share Node to Person");
                var formControls = _this.makeEditField("User to Share With", "shareToUserName");
                var shareButton = _this.makeCloseButton("Share", "shareNodeToPersonButton", _this.shareNodeToPerson, _this);
                var backButton = _this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
                var buttonBar = m64.render.centeredButtonBar(shareButton + backButton);
                return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                    + buttonBar;
            };
            this.shareNodeToPerson = function () {
                var targetUser = _this.getInputVal("shareToUserName");
                if (!targetUser) {
                    (new m64.MessageDlg("Please enter a username")).open();
                    return;
                }
                m64.meta64.treeDirty = true;
                var thiz = _this;
                m64.util.json("addPrivilege", {
                    "nodeId": m64.share.sharingNode.id,
                    "principal": targetUser,
                    "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
                    "publicAppend": false
                }, thiz.reloadFromShareWithPerson, thiz);
            };
            this.reloadFromShareWithPerson = function (res) {
                if (m64.util.checkSuccess("Share Node with Person", res)) {
                    (new m64.SharingDlg()).open();
                }
            };
        }
        return ShareToPersonDlg;
    }(m64.DialogBase));
    m64.ShareToPersonDlg = ShareToPersonDlg;
})(m64 || (m64 = {}));
console.log("running module: SharingDlg.js");
var m64;
(function (m64) {
    var SharingDlg = (function (_super) {
        __extends(SharingDlg, _super);
        function SharingDlg() {
            var _this = this;
            _super.call(this, "SharingDlg");
            this.build = function () {
                var header = _this.makeHeader("Node Sharing");
                var shareWithPersonButton = _this.makeButton("Share with Person", "shareNodeToPersonPgButton", _this.shareNodeToPersonPg, _this);
                var makePublicButton = _this.makeButton("Share to Public", "shareNodeToPublicButton", _this.shareNodeToPublic, _this);
                var backButton = _this.makeCloseButton("Close", "closeSharingButton");
                var buttonBar = m64.render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
                var width = window.innerWidth * 0.6;
                var height = window.innerHeight * 0.4;
                var internalMainContent = "<div id='" + _this.id("shareNodeNameDisplay") + "'></div>" +
                    "<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
                    + _this.id("sharingListFieldContainer") + "'></div>";
                return header + internalMainContent + buttonBar;
            };
            this.init = function () {
                _this.reload();
            };
            this.reload = function () {
                console.log("Loading node sharing info.");
                m64.util.json("getNodePrivileges", {
                    "nodeId": m64.share.sharingNode.id,
                    "includeAcl": true,
                    "includeOwners": true
                }, _this.getNodePrivilegesResponse, _this);
            };
            this.getNodePrivilegesResponse = function (res) {
                _this.populateSharingPg(res);
            };
            this.populateSharingPg = function (res) {
                var html = "";
                var This = _this;
                $.each(res.aclEntries, function (index, aclEntry) {
                    html += "<h4>User: " + aclEntry.principalName + "</h4>";
                    html += m64.render.tag("div", {
                        "class": "privilege-list"
                    }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
                });
                var publicAppendAttrs = {
                    "onClick": "m64.meta64.getObjectByGuid(" + _this.guid + ").publicCommentingChanged();",
                    "name": "allowPublicCommenting",
                    "id": _this.id("allowPublicCommenting")
                };
                if (res.publicAppend) {
                    publicAppendAttrs["checked"] = "checked";
                }
                html += m64.render.tag("paper-checkbox", publicAppendAttrs, "", false);
                html += m64.render.tag("label", {
                    "for": _this.id("allowPublicCommenting")
                }, "Allow public commenting under this node.", true);
                m64.util.setHtml(_this.id("sharingListFieldContainer"), html);
            };
            this.publicCommentingChanged = function () {
                var thiz = _this;
                setTimeout(function () {
                    var polyElm = m64.util.polyElm(thiz.id("allowPublicCommenting"));
                    m64.meta64.treeDirty = true;
                    m64.util.json("addPrivilege", {
                        "nodeId": m64.share.sharingNode.id,
                        "privileges": null,
                        "principal": null,
                        "publicAppend": (polyElm.node.checked ? true : false)
                    });
                }, 250);
            };
            this.removePrivilege = function (principal, privilege) {
                m64.meta64.treeDirty = true;
                m64.util.json("removePrivilege", {
                    "nodeId": m64.share.sharingNode.id,
                    "principal": principal,
                    "privilege": privilege
                }, _this.removePrivilegeResponse, _this);
            };
            this.removePrivilegeResponse = function (res) {
                m64.util.json("getNodePrivileges", {
                    "nodeId": m64.share.sharingNode.path,
                    "includeAcl": true,
                    "includeOwners": true
                }, _this.getNodePrivilegesResponse, _this);
            };
            this.renderAclPrivileges = function (principal, aclEntry) {
                var ret = "";
                var thiz = _this;
                $.each(aclEntry.privileges, function (index, privilege) {
                    var removeButton = thiz.makeButton("Remove", "removePrivButton", "m64.meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
                        + "');");
                    var row = m64.render.makeHorizontalFieldSet(removeButton);
                    row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";
                    ret += m64.render.tag("div", {
                        "class": "privilege-entry"
                    }, row);
                });
                return ret;
            };
            this.shareNodeToPersonPg = function () {
                (new m64.ShareToPersonDlg()).open();
            };
            this.shareNodeToPublic = function () {
                console.log("Sharing node to public.");
                m64.meta64.treeDirty = true;
                m64.util.json("addPrivilege", {
                    "nodeId": m64.share.sharingNode.id,
                    "principal": "everyone",
                    "privileges": ["read"],
                    "publicAppend": false
                }, _this.reload, _this);
            };
        }
        return SharingDlg;
    }(m64.DialogBase));
    m64.SharingDlg = SharingDlg;
})(m64 || (m64 = {}));
console.log("running module: RenameNodeDlg.js");
var m64;
(function (m64) {
    var RenameNodeDlg = (function (_super) {
        __extends(RenameNodeDlg, _super);
        function RenameNodeDlg() {
            var _this = this;
            _super.call(this, "RenameNodeDlg");
            this.build = function () {
                var header = _this.makeHeader("Rename Node");
                var curNodeNameDisplay = "<h3 id='" + _this.id("curNodeNameDisplay") + "'></h3>";
                var curNodePathDisplay = "<h4 class='path-display' id='" + _this.id("curNodePathDisplay") + "'></h4>";
                var formControls = _this.makeEditField("Enter new name for the node", "newNodeNameEditField");
                var renameNodeButton = _this.makeCloseButton("Rename", "renameNodeButton", _this.renameNode, _this);
                var backButton = _this.makeCloseButton("Close", "cancelRenameNodeButton");
                var buttonBar = m64.render.centeredButtonBar(renameNodeButton + backButton);
                return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
            };
            this.renameNode = function () {
                var newName = _this.getInputVal("newNodeNameEditField");
                if (m64.util.emptyString(newName)) {
                    (new m64.MessageDlg("Please enter a new node name.")).open();
                    return;
                }
                var highlightNode = m64.meta64.getHighlightedNode();
                if (!highlightNode) {
                    (new m64.MessageDlg("Select a node to rename.")).open();
                    return;
                }
                var nodeBelow = m64.edit.getNodeBelow(highlightNode);
                var renamingRootNode = (highlightNode.id === m64.meta64.currentNodeId);
                var thiz = _this;
                m64.util.json("renameNode", {
                    "nodeId": highlightNode.id,
                    "newName": newName
                }, function (res) {
                    thiz.renameNodeResponse(res, renamingRootNode);
                });
            };
            this.renameNodeResponse = function (res, renamingPageRoot) {
                if (m64.util.checkSuccess("Rename node", res)) {
                    if (renamingPageRoot) {
                        m64.view.refreshTree(res.newId, true);
                    }
                    else {
                        m64.view.refreshTree(null, false, res.newId);
                    }
                }
            };
            this.init = function () {
                var highlightNode = m64.meta64.getHighlightedNode();
                if (!highlightNode) {
                    return;
                }
                $("#" + _this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
                $("#" + _this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
            };
        }
        return RenameNodeDlg;
    }(m64.DialogBase));
    m64.RenameNodeDlg = RenameNodeDlg;
})(m64 || (m64 = {}));
console.log("running module: AudioPlayerDlg.js");
var m64;
(function (m64) {
    var AudioPlayerDlg = (function (_super) {
        __extends(AudioPlayerDlg, _super);
        function AudioPlayerDlg(sourceUrl, nodeUid, startTimePending) {
            var _this = this;
            _super.call(this, "AudioPlayerDlg");
            this.sourceUrl = sourceUrl;
            this.nodeUid = nodeUid;
            this.startTimePending = startTimePending;
            this.build = function () {
                var header = _this.makeHeader("Audio Player");
                var node = m64.meta64.uidToNodeMap[_this.nodeUid];
                if (!node) {
                    throw "unknown node uid: " + _this.nodeUid;
                }
                var rssTitle = m64.props.getNodeProperty("meta64:rssItemTitle", node);
                var description = m64.render.tag("p", {}, rssTitle.value);
                var playerAttribs = {
                    "src": _this.sourceUrl,
                    "id": _this.id("audioPlayer"),
                    "style": "width: 95%;",
                    "ontimeupdate": "m64.podcast.onTimeUpdate('" + _this.nodeUid + "', this);",
                    "oncanplay": "m64.podcast.onCanPlay('" + _this.nodeUid + "', this);",
                    "controls": "controls"
                };
                var player = m64.render.tag("audio", playerAttribs);
                var skipBack30Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.skip(-30, '" + _this.nodeUid + "', this);",
                    "class": "standardButton"
                }, "< 30s");
                var skipForward30Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.skip(30, '" + _this.nodeUid + "', this);",
                    "class": "standardButton"
                }, "30s >");
                var speedNormalButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(1.0);",
                    "class": "standardButton"
                }, "Normal");
                var speed15Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(1.5);",
                    "class": "standardButton"
                }, "1.5X");
                var speed2xButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(2);",
                    "class": "standardButton"
                }, "2X");
                var speedButtonBar = m64.render.centeredButtonBar(skipBack30Button + skipForward30Button + speedNormalButton + speed15Button + speed2xButton);
                var pauseButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.pause();",
                    "class": "standardButton"
                }, "Pause");
                var playButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.play();",
                    "class": "playButton"
                }, "Play");
                var closeButton = _this.makeButton("Close", "closeAudioPlayerDlgButton", _this.closeBtn);
                var buttonBar = m64.render.centeredButtonBar(playButton + pauseButton + closeButton);
                return header + description + player + speedButtonBar + buttonBar;
            };
            this.closeEvent = function () {
                m64.podcast.destroyPlayer(null);
            };
            this.closeBtn = function () {
                m64.podcast.destroyPlayer(_this);
            };
            this.init = function () {
            };
            console.log("startTimePending in constructor: " + startTimePending);
            m64.podcast.startTimePending = startTimePending;
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
    }(m64.DialogBase));
    m64.AudioPlayerDlg = AudioPlayerDlg;
})(m64 || (m64 = {}));
console.log("running module: CreateNodeDlg.js");
var m64;
(function (m64) {
    var CreateNodeDlg = (function (_super) {
        __extends(CreateNodeDlg, _super);
        function CreateNodeDlg() {
            var _this = this;
            _super.call(this, "CreateNodeDlg");
            this.build = function () {
                var header = _this.makeHeader("Create New Node");
                var createChildButton = _this.makeCloseButton("Create Child", "createChildButton", _this.createChild, _this);
                var createInlineButton = _this.makeCloseButton("Create Inline", "createInlineButton", _this.createInline, _this);
                var backButton = _this.makeCloseButton("Cancel", "cancelButton");
                var buttonBar = m64.render.centeredButtonBar(createChildButton + createInlineButton + backButton);
                var content = "";
                var typeIdx = 0;
                content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++);
                content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++);
                var mainContent = m64.render.tag("div", {
                    "class": "listBox"
                }, content);
                return header + mainContent + buttonBar;
            };
            this.createChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                debugger;
                m64.edit.createSubNode();
            };
            this.createInline = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                debugger;
                m64.edit.insertNode();
            };
            this.onRowClick = function (payload) {
                debugger;
                var divId = _this.id("typeRow" + payload.typeIdx);
                _this.lastSelTypeName = payload.typeName;
                if (_this.lastSelDomId) {
                    $("#" + _this.lastSelDomId).removeClass("selectedListItem");
                }
                _this.lastSelDomId = divId;
                $("#" + divId).addClass("selectedListItem");
            };
            this.init = function () {
            };
        }
        CreateNodeDlg.prototype.makeListItem = function (val, typeName, typeIdx) {
            debugger;
            var payload = {
                "typeName": typeName,
                "typeIdx": typeIdx
            };
            return m64.render.tag("div", {
                "class": "listItem",
                "id": this.id("typeRow" + typeIdx),
                "onclick": m64.meta64.encodeOnClick(this.onRowClick, this, payload)
            }, val);
        };
        return CreateNodeDlg;
    }(m64.DialogBase));
    m64.CreateNodeDlg = CreateNodeDlg;
})(m64 || (m64 = {}));
console.log("running module: searchResultsPanel.js");
var m64;
(function (m64) {
    var SearchResultsPanel = (function () {
        function SearchResultsPanel() {
            this.domId = "searchResultsPanel";
            this.tabId = "searchTabName";
            this.visible = false;
            this.build = function () {
                var header = "<h2 id='searchPageTitle'></h2>";
                var mainContent = "<div id='searchResultsView'></div>";
                return header + mainContent;
            };
            this.init = function () {
                $("#searchPageTitle").html(m64.srch.searchPageTitle);
                m64.srch.populateSearchResultsPage(m64.srch.searchResults, "searchResultsView");
            };
        }
        return SearchResultsPanel;
    }());
    m64.SearchResultsPanel = SearchResultsPanel;
})(m64 || (m64 = {}));
console.log("running module: timelineResultsPanel.js");
var m64;
(function (m64) {
    var TimelineResultsPanel = (function () {
        function TimelineResultsPanel() {
            this.domId = "timelineResultsPanel";
            this.tabId = "timelineTabName";
            this.visible = false;
            this.build = function () {
                var header = "<h2 id='timelinePageTitle'></h2>";
                var mainContent = "<div id='timelineView'></div>";
                return header + mainContent;
            };
            this.init = function () {
                $("#timelinePageTitle").html(m64.srch.timelinePageTitle);
                m64.srch.populateSearchResultsPage(m64.srch.timelineResults, "timelineView");
            };
        }
        return TimelineResultsPanel;
    }());
    m64.TimelineResultsPanel = TimelineResultsPanel;
})(m64 || (m64 = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvZGxnL0NyZWF0ZU5vZGVEbGcudHMiLCIuLi90cy9wYW5lbC9zZWFyY2hSZXN1bHRzUGFuZWwudHMiLCIuLi90cy9wYW5lbC90aW1lbGluZVJlc3VsdHNQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0FBLFlBQVksQ0FBQztBQUtiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUs5QixJQUFJLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBTUY7QUFFQSxDQUFDO0FB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RSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQTtRQUNMLENBQUM7UUFBRCx5QkFBQztJQUFELENBQUMsQUFoQkQsSUFnQkM7SUFoQlksc0JBQWtCLHFCQWdCOUIsQ0FBQTtBQUNMLENBQUMsRUFsQlMsR0FBRyxLQUFILEdBQUcsUUFrQlo7QUNwQkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBRXZELElBQVUsR0FBRyxDQWtCWjtBQWxCRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBQTtZQUVJLFVBQUssR0FBVyxzQkFBc0IsQ0FBQztZQUN2QyxVQUFLLEdBQVcsaUJBQWlCLENBQUM7WUFDbEMsWUFBTyxHQUFZLEtBQUssQ0FBQztZQUV6QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsa0NBQWtDLENBQUM7Z0JBQ2hELElBQUksV0FBVyxHQUFHLCtCQUErQixDQUFDO2dCQUNsRCxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNyRCxRQUFJLENBQUMseUJBQXlCLENBQUMsUUFBSSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUE7UUFDTCxDQUFDO1FBQUQsMkJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLHdCQUFvQix1QkFnQmhDLENBQUE7QUFDTCxDQUFDLEVBbEJTLEdBQUcsS0FBSCxHQUFHLFFBa0JaIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2VuZXJhdGVkIHVzaW5nIHR5cGVzY3JpcHQtZ2VuZXJhdG9yIHZlcnNpb24gMS4xMC1TTkFQU0hPVCBvbiAyMDE2LTA3LTMxIDIwOjIxOjAxLlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpzb24ge1xuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgICAgICAgICBwcmluY2lwYWxOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBQcml2aWxlZ2VJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IGJvb2xlYW47XG4gICAgICAgICAgICBoYXNCaW5hcnk6IGJvb2xlYW47XG4gICAgICAgICAgICBiaW5hcnlJc0ltYWdlOiBib29sZWFuO1xuICAgICAgICAgICAgYmluVmVyOiBudW1iZXI7XG4gICAgICAgICAgICB3aWR0aDogbnVtYmVyO1xuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgICAgICBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICB1aWQ6IHN0cmluZztcbiAgICAgICAgICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xuICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBEYXRlO1xuICAgICAgICAgICAgaW1nSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgICAgICAgICAgcHJpdmlsZWdlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eUluZm8ge1xuICAgICAgICAgICAgdHlwZTogbnVtYmVyO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgICAgICAgICBodG1sVmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIGFiYnJldmlhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgICAgICAgICBlZGl0TW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGFkdmFuY2VkTW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBpbXBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgICAgICAgICAgZXhwb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgICAgICAgICAgaWdub3JlVXJsOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3NDb2RlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIG5vZGVQYXRoIDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlU3ViTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBuZXdOb2RlTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcE5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldEZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIGluY2x1ZGVBY2w6IGJvb2xlYW47XG4gICAgICAgICAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgYm9va05hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHRydW5jYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgcGFyZW50SWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICB0ek9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgZHN0OiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICB0YXJnZXROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldENoaWxkSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBzb3J0RGlyOiBzdHJpbmc7XG4gICAgICAgICAgICBzb3J0RmllbGQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoUHJvcDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbW92ZVByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmluY2lwYWw6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICB1cExldmVsOiBudW1iZXI7XG4gICAgICAgICAgICByZW5kZXJQYXJlbnRJZkxlYWY6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXI6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVByb3BlcnR5UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIGZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlcXVlc3Qge1xuICAgICAgICAgICAgcGFyZW50Tm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNpYmxpbmdJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaWdudXBSZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgICAgIGNhcHRjaGE6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3BsaXROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVCZWxvd0lkOiBzdHJpbmc7XG4gICAgICAgICAgICBkZWxpbWl0ZXI6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkRnJvbVVybFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzb3VyY2VVcmw6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBbm9uUGFnZUxvYWRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgICAgICAgICByZW5kZXJOb2RlUmVzcG9uc2U6IFJlbmRlck5vZGVSZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVSU1NSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldFBsYXllckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFBsYXllckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICB0aW1lT2Zmc2V0Om51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlU3ViTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIGFjbEVudHJpZXM6IEFjY2Vzc0NvbnRyb2xFbnRyeUluZm9bXTtcbiAgICAgICAgICAgIG93bmVyczogc3RyaW5nW107XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZXJ2ZXJJbmZvOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlSW5mbzogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHJvb3ROb2RlOiBSZWZJbmZvO1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XG4gICAgICAgICAgICB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlcztcbiAgICAgICAgICAgIGFsbG93RmlsZVN5c3RlbVNlYXJjaDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9nb3V0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VhcmNoUmVzdWx0Tm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbW92ZVByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld0lkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlOiBOb2RlSW5mbztcbiAgICAgICAgICAgIGNoaWxkcmVuOiBOb2RlSW5mb1tdO1xuICAgICAgICAgICAgZGlzcGxheWVkUGFyZW50OiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVNhdmVkOiBQcm9wZXJ0eUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNpZ251cFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3BsaXROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc3VjY2VzczogYm9vbGVhbjtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxuY29uc29sZS5sb2coXCJydW5uaW5nIGFwcC5qc1wiKTtcblxuLy8gdmFyIG9ucmVzaXplID0gd2luZG93Lm9ucmVzaXplO1xuLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHsgaWYgKHR5cGVvZiBvbnJlc2l6ZSA9PT0gJ2Z1bmN0aW9uJykgb25yZXNpemUoKTsgLyoqIC4uLiAqLyB9XG5cbnZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChvYmplY3QuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RbXCJvblwiICsgdHlwZV0gPSBjYWxsYmFjaztcbiAgICB9XG59O1xuXG4vKlxuICogV0FSTklORzogVGhpcyBpcyBjYWxsZWQgaW4gcmVhbHRpbWUgd2hpbGUgdXNlciBpcyByZXNpemluZyBzbyBhbHdheXMgdGhyb3R0bGUgYmFjayBhbnkgcHJvY2Vzc2luZyBzbyB0aGF0IHlvdSBkb24ndFxuICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAqL1xuZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiV2luZG93UmVzaXplOiB3PVwiICsgd2luZG93LmlubmVyV2lkdGggKyBcIiBoPVwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemUpO1xuXG4vLyB0aGlzIGNvbW1lbnRlZCBzZWN0aW9uIGlzIG5vdCB3b3JraW5nIGluIG15IG5ldyB4LWFwcCBjb2RlLCBidXQgaXQncyBvayB0byBjb21tZW50IGl0IG91dCBmb3Igbm93LlxuLy9cbi8vIFRoaXMgaXMgb3VyIHRlbXBsYXRlIGVsZW1lbnQgaW4gaW5kZXguaHRtbFxuLy8gdmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4LWFwcCcpO1xuLy8gLy8gTGlzdGVuIGZvciB0ZW1wbGF0ZSBib3VuZCBldmVudCB0byBrbm93IHdoZW4gYmluZGluZ3Ncbi8vIC8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuLy8gYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbi8vICAgICBjb25zb2xlLmxvZygnYXBwIHJlYWR5IGV2ZW50IScpO1xuLy8gfSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2x5bWVyLXJlYWR5JywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xufSk7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBjbnN0LmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgY29va2llUHJlZml4O1xyXG5cclxuLy90b2RvLTA6IHR5cGVzY3JpcHQgd2lsbCBub3cgbGV0IHVzIGp1c3QgZG8gdGhpczogY29uc3QgdmFyPSd2YWx1ZSc7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgY25zdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9VU1I6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Vc3JcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGxvZ2luU3RhdGU9XCIwXCIgaWYgdXNlciBsb2dnZWQgb3V0IGludGVudGlvbmFsbHkuIGxvZ2luU3RhdGU9XCIxXCIgaWYgbGFzdCBrbm93biBzdGF0ZSBvZiB1c2VyIHdhcyAnbG9nZ2VkIGluJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJSOiBcIjxkaXYgY2xhc3M9J3ZlcnQtc3BhY2UnPjwvZGl2PlwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTlNfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZXhwb3J0IGxldCBNT1ZFX1VQRE9XTl9PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIHdvcmtzLCBidXQgSSdtIG5vdCBzdXJlIEkgd2FudCBpdCBmb3IgQUxMIGVkaXRpbmcuIFN0aWxsIHRoaW5raW5nIGFib3V0IGRlc2lnbiBoZXJlLCBiZWZvcmUgSSB0dXJuIHRoaXNcclxuICAgICAgICAgKiBvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IFVTRV9BQ0VfRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIHNob3dpbmcgcGF0aCBvbiByb3dzIGp1c3Qgd2FzdGVzIHNwYWNlIGZvciBvcmRpbmFyeSB1c2Vycy4gTm90IHJlYWxseSBuZWVkZWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfUEFUSF9PTl9ST1dTOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfUEFUSF9JTl9ETEdTOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBTSE9XX0NMRUFSX0JVVFRPTl9JTl9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4iLCJcbm5hbWVzcGFjZSBtNjQge1xuICAgIC8qIFRoZXNlIGFyZSBDbGllbnQtc2lkZSBvbmx5IG1vZGVscywgYW5kIGFyZSBub3Qgc2VlbiBvbiB0aGUgc2VydmVyIHNpZGUgZXZlciAqL1xuXG4gICAgLyogTW9kZWxzIGEgdGltZS1yYW5nZSBpbiBzb21lIG1lZGlhIHdoZXJlIGFuIEFEIHN0YXJ0cyBhbmQgc3RvcHMgKi9cbiAgICBleHBvcnQgY2xhc3MgQWRTZWdtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGJlZ2luVGltZTogbnVtYmVyLC8vXG4gICAgICAgICAgICBwdWJsaWMgZW5kVGltZTogbnVtYmVyKSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvcEVudHJ5IHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgcHJvcGVydHk6IGpzb24uUHJvcGVydHlJbmZvLCAvL1xuICAgICAgICAgICAgcHVibGljIG11bHRpOiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHJlYWRPbmx5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIGJpbmFyeTogYm9vbGVhbiwgLy9cbiAgICAgICAgICAgIHB1YmxpYyBzdWJQcm9wczogU3ViUHJvcFtdKSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU3ViUHJvcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICAgICAgcHVibGljIHZhbDogc3RyaW5nKSB7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB1dGlsLmpzXCIpO1xyXG5cclxuLy90b2RvLTA6IG5lZWQgdG8gZmluZCB0aGUgRGVmaW5pdGVseVR5cGVkIGZpbGUgZm9yIFBvbHltZXIuXHJcbmRlY2xhcmUgdmFyIFBvbHltZXI7XHJcbmRlY2xhcmUgdmFyICQ7IC8vPC0tLS0tLS0tLS0tLS10aGlzIHdhcyBhIHdpbGRhc3MgZ3Vlc3MuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cclxuXHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcclxuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKTtcclxufVxyXG5cclxuaW50ZXJmYWNlIF9IYXNTZWxlY3Qge1xyXG4gICAgc2VsZWN0PzogYW55O1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFycmF5IHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL1dBUk5JTkc6IFRoZXNlIHByb3RvdHlwZSBmdW5jdGlvbnMgbXVzdCBiZSBkZWZpbmVkIG91dHNpZGUgYW55IGZ1bmN0aW9ucy5cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuICAgIGNsb25lKCk6IEFycmF5PFQ+O1xyXG4gICAgaW5kZXhPZkl0ZW1CeVByb3AocHJvcE5hbWUsIHByb3BWYWwpOiBudW1iZXI7XHJcbiAgICBhcnJheU1vdmVJdGVtKGZyb21JbmRleCwgdG9JbmRleCk6IHZvaWQ7XHJcbiAgICBpbmRleE9mT2JqZWN0KG9iajogYW55KTogbnVtYmVyO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwKTtcclxufTtcclxuXHJcbkFycmF5LnByb3RvdHlwZS5pbmRleE9mSXRlbUJ5UHJvcCA9IGZ1bmN0aW9uKHByb3BOYW1lLCBwcm9wVmFsKSB7XHJcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaV1bcHJvcE5hbWVdID09PSBwcm9wVmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufTtcclxuXHJcbi8qIG5lZWQgdG8gdGVzdCBhbGwgY2FsbHMgdG8gdGhpcyBtZXRob2QgYmVjYXVzZSBpIG5vdGljZWQgZHVyaW5nIFR5cGVTY3JpcHQgY29udmVyc2lvbiBpIHdhc24ndCBldmVuIHJldHVybmluZ1xyXG5hIHZhbHVlIGZyb20gdGhpcyBmdW5jdGlvbiEgdG9kby0wXHJcbiovXHJcbkFycmF5LnByb3RvdHlwZS5hcnJheU1vdmVJdGVtID0gZnVuY3Rpb24oZnJvbUluZGV4LCB0b0luZGV4KSB7XHJcbiAgICB0aGlzLnNwbGljZSh0b0luZGV4LCAwLCB0aGlzLnNwbGljZShmcm9tSW5kZXgsIDEpWzBdKTtcclxufTtcclxuXHJcbmlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZPYmplY3QgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERhdGUgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmludGVyZmFjZSBEYXRlIHtcclxuICAgIHN0ZFRpbWV6b25lT2Zmc2V0KCk6IG51bWJlcjtcclxuICAgIGRzdCgpOiBib29sZWFuO1xyXG59O1xyXG5cclxuRGF0ZS5wcm90b3R5cGUuc3RkVGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBqYW4gPSBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xyXG4gICAgdmFyIGp1bCA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgNiwgMSk7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoamFuLmdldFRpbWV6b25lT2Zmc2V0KCksIGp1bC5nZXRUaW1lem9uZU9mZnNldCgpKTtcclxufVxyXG5cclxuRGF0ZS5wcm90b3R5cGUuZHN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIDwgdGhpcy5zdGRUaW1lem9uZU9mZnNldCgpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0cmluZyBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIFN0cmluZyB7XHJcbiAgICBzdGFydHNXaXRoKHN0cjogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIHN0cmlwSWZTdGFydHNXaXRoKHN0cjogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgY29udGFpbnMoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgcmVwbGFjZUFsbChmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZyk6IHN0cmluZztcclxuICAgIHVuZW5jb2RlSHRtbCgpOiBzdHJpbmc7XHJcbiAgICBlc2NhcGVGb3JBdHRyaWIoKTogc3RyaW5nO1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN0cikgPT09IDA7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuc3RyaXBJZlN0YXJ0c1dpdGggIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0c1dpdGgoc3RyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN0cikgIT0gLTE7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbihmaW5kLCByZXBsYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChmaW5kKSwgJ2cnKSwgcmVwbGFjZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS51bmVuY29kZUh0bWwgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS51bmVuY29kZUh0bWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoXCImXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbCgnJmFtcDsnLCAnJicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZndDsnLCAnPicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZsdDsnLCAnPCcpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZxdW90OycsICdcIicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyYjMzk7JywgXCInXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuZXNjYXBlRm9yQXR0cmliICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZXNjYXBlRm9yQXR0cmliID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbChcIlxcXCJcIiwgXCImcXVvdDtcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB1dGlsIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBamF4OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lb3V0TWVzc2FnZVNob3duOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZXhwb3J0IGxldCBvZmZsaW5lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgd2FpdENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCBwZ3JzRGxnOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvL3RoaXMgYmxvd3MgdGhlIGhlbGwgdXAsIG5vdCBzdXJlIHdoeS5cclxuICAgICAgICAvL1x0T2JqZWN0LnByb3RvdHlwZS50b0pzb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL1x0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgNCk7XHJcbiAgICAgICAgLy9cdH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYXNzZXJ0Tm90TnVsbCA9IGZ1bmN0aW9uKHZhck5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmFsKHZhck5hbWUpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVmFyaWFibGUgbm90IGZvdW5kOiBcIiArIHZhck5hbWUpKS5vcGVuKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSB1c2UgdGhpcyB2YXJpYWJsZSB0byBkZXRlcm1pbmUgaWYgd2UgYXJlIHdhaXRpbmcgZm9yIGFuIGFqYXggY2FsbCwgYnV0IHRoZSBzZXJ2ZXIgYWxzbyBlbmZvcmNlcyB0aGF0IGVhY2hcclxuICAgICAgICAgKiBzZXNzaW9uIGlzIG9ubHkgYWxsb3dlZCBvbmUgY29uY3VycmVudCBjYWxsIGFuZCBzaW11bHRhbmVvdXMgY2FsbHMgd291bGQganVzdCBcInF1ZXVlIHVwXCIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9hamF4Q291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGF5bGlnaHRTYXZpbmdzVGltZTogYm9vbGVhbiA9IChuZXcgRGF0ZSgpLmRzdCgpKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b0pzb24gPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgNCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBUaGlzIGNhbWUgZnJvbSBoZXJlOlxyXG5cdFx0ICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZT86IGFueSwgdXJsPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSwgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0c1syXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogU2V0cyB1cCBhbiBpbmhlcml0YW5jZSByZWxhdGlvbnNoaXAgc28gdGhhdCBjaGlsZCBpbmhlcml0cyBmcm9tIHBhcmVudCwgYW5kIHRoZW4gcmV0dXJucyB0aGUgcHJvdG90eXBlIG9mIHRoZVxyXG5cdFx0ICogY2hpbGQgc28gdGhhdCBtZXRob2RzIGNhbiBiZSBhZGRlZCB0byBpdCwgd2hpY2ggd2lsbCBiZWhhdmUgbGlrZSBtZW1iZXIgZnVuY3Rpb25zIGluIGNsYXNzaWMgT09QIHdpdGhcclxuXHRcdCAqIGluaGVyaXRhbmNlIGhpZXJhcmNoaWVzLlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmhlcml0ID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCk6IGFueSB7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQucHJvdG90eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0UHJvZ3Jlc3NNb25pdG9yID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHNldEludGVydmFsKHByb2dyZXNzSW50ZXJ2YWwsIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9ncmVzc0ludGVydmFsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBpc1dhaXRpbmcgPSBpc0FqYXhXYWl0aW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChpc1dhaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHdhaXRDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpZiAod2FpdENvdW50ZXIgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnID0gbmV3IFByb2dyZXNzRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdhaXRDb3VudGVyID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBqc29uID0gZnVuY3Rpb24gPFJlcXVlc3RUeXBlLCBSZXNwb25zZVR5cGU+KHBvc3ROYW1lOiBhbnksIHBvc3REYXRhOiBSZXF1ZXN0VHlwZSwgLy9cclxuICAgICAgICAgICAgY2FsbGJhY2s/OiAocmVzcG9uc2U6IFJlc3BvbnNlVHlwZSwgcGF5bG9hZD86IGFueSkgPT4gYW55LCBjYWxsYmFja1RoaXM/OiBhbnksIGNhbGxiYWNrUGF5bG9hZD86IGFueSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcyA9PT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBST0JBQkxFIEJVRzoganNvbiBjYWxsIGZvciBcIiArIHBvc3ROYW1lICsgXCIgdXNlZCBnbG9iYWwgJ3dpbmRvdycgYXMgJ3RoaXMnLCB3aGljaCBpcyBhbG1vc3QgbmV2ZXIgZ29pbmcgdG8gYmUgY29ycmVjdC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpcm9uQWpheDtcclxuICAgICAgICAgICAgdmFyIGlyb25SZXF1ZXN0O1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvZmZsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvZmZsaW5lOiBpZ25vcmluZyBjYWxsIGZvciBcIiArIHBvc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTT04tUE9TVFtnZW5dOiBbXCIgKyBwb3N0TmFtZSArIFwiXVwiICsgSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBEbyBub3QgZGVsZXRlLCByZXNlYXJjaCB0aGlzIHdheS4uLiAqL1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGlyb25BamF4ID0gdGhpcy4kJChcIiNteUlyb25BamF4XCIpO1xyXG4gICAgICAgICAgICAgICAgLy9pcm9uQWpheCA9IFBvbHltZXIuZG9tKCg8X0hhc1Jvb3Q+KXdpbmRvdy5kb2N1bWVudC5yb290KS5xdWVyeVNlbGVjdG9yKFwiI2lyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4ID0gcG9seUVsbU5vZGUoXCJpcm9uQWpheFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC51cmwgPSBwb3N0VGFyZ2V0VXJsICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC52ZXJib3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5tZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc3BlY2lmeSBhbnkgdXJsIHBhcmFtcyB0aGlzIHdheTpcclxuICAgICAgICAgICAgICAgIC8vIGlyb25BamF4LnBhcmFtcz0ne1wiYWx0XCI6XCJqc29uXCIsIFwicVwiOlwiY2hyb21lXCJ9JztcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5oYW5kbGVBcyA9IFwianNvblwiOyAvLyBoYW5kbGUtYXMgKGlzIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgLyogVGhpcyBub3QgYSByZXF1aXJlZCBwcm9wZXJ0eSAqL1xyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgub25SZXNwb25zZSA9IFwidXRpbC5pcm9uQWpheFJlc3BvbnNlXCI7IC8vIG9uLXJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAvLyAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5kZWJvdW5jZUR1cmF0aW9uID0gXCIzMDBcIjsgLy8gZGVib3VuY2UtZHVyYXRpb24gKGlzXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgICAgIF9hamF4Q291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgaXJvblJlcXVlc3QgPSBpcm9uQWpheC5nZW5lcmF0ZVJlcXVlc3QoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBzdGFydGluZyByZXF1ZXN0OiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBOb3Rlc1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSWYgdXNpbmcgdGhlbiBmdW5jdGlvbjogcHJvbWlzZS50aGVuKHN1Y2Nlc3NGdW5jdGlvbiwgZmFpbEZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIEkgdGhpbmsgdGhlIHdheSB0aGVzZSBwYXJhbWV0ZXJzIGdldCBwYXNzZWQgaW50byBkb25lL2ZhaWwgZnVuY3Rpb25zLCBpcyBiZWNhdXNlIHRoZXJlIGFyZSByZXNvbHZlL3JlamVjdFxyXG4gICAgICAgICAgICAgKiBtZXRob2RzIGdldHRpbmcgY2FsbGVkIHdpdGggdGhlIHBhcmFtZXRlcnMuIEJhc2ljYWxseSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gJ3Jlc29sdmUnIGdldCBkaXN0cmlidXRlZFxyXG4gICAgICAgICAgICAgKiB0byBhbGwgdGhlIHdhaXRpbmcgbWV0aG9kcyBqdXN0IGxpa2UgYXMgaWYgdGhleSB3ZXJlIHN1YnNjcmliaW5nIGluIGEgcHViL3N1YiBtb2RlbC4gU28gdGhlICdwcm9taXNlJ1xyXG4gICAgICAgICAgICAgKiBwYXR0ZXJuIGlzIHNvcnQgb2YgYSBwdWIvc3ViIG1vZGVsIGluIGEgd2F5XHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBUaGUgcmVhc29uIHRvIHJldHVybiBhICdwcm9taXNlLnByb21pc2UoKScgbWV0aG9kIGlzIHNvIG5vIG90aGVyIGNvZGUgY2FuIGNhbGwgcmVzb2x2ZS9yZWplY3QgYnV0IGNhblxyXG4gICAgICAgICAgICAgKiBvbmx5IHJlYWN0IHRvIGEgZG9uZS9mYWlsL2NvbXBsZXRlLlxyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogZGVmZXJyZWQud2hlbihwcm9taXNlMSwgcHJvbWlzZTIpIGNyZWF0ZXMgYSBuZXcgcHJvbWlzZSB0aGF0IGJlY29tZXMgJ3Jlc29sdmVkJyBvbmx5IHdoZW4gYWxsIHByb21pc2VzXHJcbiAgICAgICAgICAgICAqIGFyZSByZXNvbHZlZC4gSXQncyBhIGJpZyBcImFuZCBjb25kaXRpb25cIiBvZiByZXNvbHZlbWVudCwgYW5kIGlmIGFueSBvZiB0aGUgcHJvbWlzZXMgcGFzc2VkIHRvIGl0IGVuZCB1cFxyXG4gICAgICAgICAgICAgKiBmYWlsaW5nLCBpdCBmYWlscyB0aGlzIFwiQU5EZWRcIiBvbmUgYWxzby5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlyb25SZXF1ZXN0LmNvbXBsZXRlcy50aGVuKC8vXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIFN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0ludGVydmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgSlNPTi1SRVNVTFQ6IFwiICsgcG9zdE5hbWUgKyBcIlxcbiAgICBKU09OLVJFU1VMVC1EQVRBOiBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgSlNPTi5zdHJpbmdpZnkoaXJvblJlcXVlc3QucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIGlzIHVnbHkgYmVjYXVzZSBpdCBjb3ZlcnMgYWxsIGZvdXIgY2FzZXMgYmFzZWQgb24gdHdvIGJvb2xlYW5zLCBidXQgaXQncyBzdGlsbCB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpbXBsZXN0IHdheSB0byBkbyB0aGlzLiBXZSBoYXZlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBtYXkgb3IgbWF5IG5vdCBzcGVjaWZ5IGEgJ3RoaXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgYWx3YXlzIGNhbGxzIHdpdGggdGhlICdyZXBvbnNlJyBwYXJhbSBhbmQgb3B0aW9uYWxseSBhIGNhbGxiYWNrUGF5bG9hZCBwYXJhbS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrUGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYW4ndCB3ZSBqdXN0IGxldCBjYWxsYmFja1BheWxvYWQgYmUgdW5kZWZpbmVkLCBhbmQgY2FsbCB0aGUgYWJvdmUgY2FsbGJhY2sgbWV0aG9kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIG5vdCBldmVuIGhhdmUgdGhpcyBlbHNlIGJsb2NrIGhlcmUgYXQgYWxsIChpLmUuIG5vdCBldmVuIGNoZWNrIGlmIGNhbGxiYWNrUGF5bG9hZCBpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbC91bmRlZmluZWQsIGJ1dCBqdXN0IHVzZSBpdCwgYW5kIG5vdCBoYXZlIHRoaXMgaWYgYmxvY2s/KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgaGFuZGxpbmcgcmVzdWx0IG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRmFpbFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiB1dGlsLmpzb25cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXJvblJlcXVlc3Quc3RhdHVzID09IFwiNDAzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiBkZXRlY3RlZCBpbiB1dGlsLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZmxpbmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGltZW91dE1lc3NhZ2VTaG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXRNZXNzYWdlU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlc3Npb24gdGltZWQgb3V0LiBQYWdlIHdpbGwgcmVmcmVzaC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbXNnOiBzdHJpbmcgPSBcIlNlcnZlciByZXF1ZXN0IGZhaWxlZC5cXG5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNhdGNoIGJsb2NrIHNob3VsZCBmYWlsIHNpbGVudGx5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJTdGF0dXM6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzVGV4dCArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJDb2RlOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1cyArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHRoaXMgY2F0Y2ggYmxvY2sgc2hvdWxkIGFsc28gZmFpbCBzaWxlbnRseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIHdhcyBzaG93aW5nIFwiY2xhc3NDYXN0RXhjZXB0aW9uXCIgd2hlbiBJIHRocmV3IGEgcmVndWxhciBcIkV4Y2VwdGlvblwiIGZyb20gc2VydmVyIHNvIGZvciBub3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSdtIGp1c3QgdHVybmluZyB0aGlzIG9mZiBzaW5jZSBpdHMnIG5vdCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtc2cgKz0gXCJSZXNwb25zZTogXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLmV4Y2VwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXJvblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FuZFRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFwiW3N0YWNrLCBub3Qgc3VwcG9ydGVkXVwiO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgKyBcIlNUQUNLOiBcIiArIHN0YWNrKTtcclxuICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQW5kUmVUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZywgZXhjZXB0aW9uOiBhbnkpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFqYXhSZWFkeSA9IGZ1bmN0aW9uKHJlcXVlc3ROYW1lKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChfYWpheENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklnbm9yaW5nIHJlcXVlc3RzOiBcIiArIHJlcXVlc3ROYW1lICsgXCIuIEFqYXggY3VycmVudGx5IGluIHByb2dyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBamF4V2FpdGluZyA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gX2FqYXhDb3VudGVyID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNldCBmb2N1cyB0byBlbGVtZW50IGJ5IGlkIChpZCBtdXN0IHN0YXJ0IHdpdGggIykgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGF5ZWRGb2N1cyA9IGZ1bmN0aW9uKGlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIHNvIHVzZXIgc2VlcyB0aGUgZm9jdXMgZmFzdCB3ZSB0cnkgYXQgLjUgc2Vjb25kcyAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIHRyeSBhZ2FpbiBhIGZ1bGwgc2Vjb25kIGxhdGVyLiBOb3JtYWxseSBub3QgcmVxdWlyZWQsIGJ1dCBuZXZlciB1bmRlc2lyYWJsZSAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBjb3VsZCBoYXZlIHB1dCB0aGlzIGxvZ2ljIGluc2lkZSB0aGUganNvbiBtZXRob2QgaXRzZWxmLCBidXQgSSBjYW4gZm9yc2VlIGNhc2VzIHdoZXJlIHdlIGRvbid0IHdhbnQgYVxyXG5cdFx0ICogbWVzc2FnZSB0byBhcHBlYXIgd2hlbiB0aGUganNvbiByZXNwb25zZSByZXR1cm5zIHN1Y2Nlc3M9PWZhbHNlLCBzbyB3ZSB3aWxsIGhhdmUgdG8gY2FsbCBjaGVja1N1Y2Nlc3MgaW5zaWRlXHJcblx0XHQgKiBldmVyeSByZXNwb25zZSBtZXRob2QgaW5zdGVhZCwgaWYgd2Ugd2FudCB0aGF0IHJlc3BvbnNlIHRvIHByaW50IGEgbWVzc2FnZSB0byB0aGUgdXNlciB3aGVuIGZhaWwgaGFwcGVucy5cclxuXHRcdCAqXHJcblx0XHQgKiByZXF1aXJlczogcmVzLnN1Y2Nlc3MgcmVzLm1lc3NhZ2VcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hlY2tTdWNjZXNzID0gZnVuY3Rpb24ob3BGcmllbmRseU5hbWUsIHJlcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcob3BGcmllbmRseU5hbWUgKyBcIiBmYWlsZWQ6IFwiICsgcmVzLm1lc3NhZ2UpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdWNjZXNzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWRkcyBhbGwgYXJyYXkgb2JqZWN0cyB0byBvYmogYXMgYSBzZXQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFkZEFsbCA9IGZ1bmN0aW9uKG9iaiwgYSk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghYVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJudWxsIGVsZW1lbnQgaW4gYWRkQWxsIGF0IGlkeD1cIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbYVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG51bGxPclVuZGVmID0gZnVuY3Rpb24ob2JqKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG5cdFx0ICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VWlkRm9ySWQgPSBmdW5jdGlvbihtYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLyogbG9vayBmb3IgdWlkIGluIG1hcCAqL1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBcIlwiICsgbWV0YTY0Lm5leHRVaWQrKztcclxuICAgICAgICAgICAgICAgIG1hcFtpZF0gPSB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWxlbWVudEV4aXN0cyA9IGZ1bmN0aW9uKGlkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRha2VzIHRleHRhcmVhIGRvbSBJZCAoIyBvcHRpb25hbCkgYW5kIHJldHVybnMgaXRzIHZhbHVlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUZXh0QXJlYVZhbEJ5SWQgPSBmdW5jdGlvbihpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBkZTogSFRNTEVsZW1lbnQgPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxIVE1MSW5wdXRFbGVtZW50PmRlKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRvbUVsbSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHkgPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seUVsbSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFBvbHltZXIuZG9tKGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtTm9kZSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRSZXF1aXJlZEVsZW1lbnQgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPYmplY3QgPSBmdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5sZW5ndGggIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudFRpbWVNaWxsaXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZW1wdHlTdHJpbmcgPSBmdW5jdGlvbih2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXZhbCB8fCB2YWwubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgd2FzIGZvdW5kLCBvciBmYWxzZSBpZiBlbGVtZW50IG5vdCBmb3VuZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWxtICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRFbnRlcktleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xyXG4gICAgICAgICAgICBiaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnksIGtleUNvZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICAkKGlkKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlDb2RlKSB7IC8vIDEzPT1lbnRlciBrZXkgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBSZW1vdmVkIG9sZENsYXNzIGZyb20gZWxlbWVudCBhbmQgcmVwbGFjZXMgd2l0aCBuZXdDbGFzcywgYW5kIGlmIG9sZENsYXNzIGlzIG5vdCBwcmVzZW50IGl0IHNpbXBseSBhZGRzXHJcblx0XHQgKiBuZXdDbGFzcy4gSWYgb2xkIGNsYXNzIGV4aXN0ZWQsIGluIHRoZSBsaXN0IG9mIGNsYXNzZXMsIHRoZW4gdGhlIG5ldyBjbGFzcyB3aWxsIG5vdyBiZSBhdCB0aGF0IHBvc2l0aW9uLiBJZlxyXG5cdFx0ICogb2xkIGNsYXNzIGRpZG4ndCBleGlzdCwgdGhlbiBuZXcgQ2xhc3MgaXMgYWRkZWQgYXQgZW5kIG9mIGNsYXNzIGxpc3QuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZU9yQWRkQ2xhc3MgPSBmdW5jdGlvbihlbG06IHN0cmluZywgb2xkQ2xhc3M6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWxtZW1lbnQgPSAkKGVsbSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG9sZENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG5ld0NsYXNzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGRpc3BsYXlzIG1lc3NhZ2UgKG1zZykgb2Ygb2JqZWN0IGlzIG5vdCBvZiBzcGVjaWZpZWQgdHlwZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB2ZXJpZnlUeXBlID0gZnVuY3Rpb24ob2JqOiBhbnksIHR5cGU6IGFueSwgbXNnOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldEh0bWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IFBvbHltZXIuZG9tKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAvL0ZvciBQb2x5bWVyIDEuMC4wLCB5b3UgbmVlZCB0aGlzLi4uXHJcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBwb2x5RWxtLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQcm9wZXJ0eUNvdW50ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBudW1iZXIge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvcDtcclxuXHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRPYmplY3QgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCJcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5W1wiICsgY291bnQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gayArIFwiICwgXCIgKyB2ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVyclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRLZXlzID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJywnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsICs9IGs7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgZW5hYmxlZCBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldEVuYWJsZW1lbnQgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCBlbmFibGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRW5hYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNhYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgdmlzaWJsZSBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCB2aXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpcykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICAkKGVsbSkuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoaWRpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgJChlbG0pLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUHJvZ3JhbWF0aWNhbGx5IGNyZWF0ZXMgb2JqZWN0cyBieSBuYW1lLCBzaW1pbGFyIHRvIHdoYXQgSmF2YSByZWZsZWN0aW9uIGRvZXNcclxuXHJcbiAgICAgICAgKiBleDogdmFyIGV4YW1wbGUgPSBJbnN0YW5jZUxvYWRlci5nZXRJbnN0YW5jZTxOYW1lZFRoaW5nPih3aW5kb3csICdFeGFtcGxlQ2xhc3MnLCBhcmdzLi4uKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiA8VD4oY29udGV4dDogT2JqZWN0LCBuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogVCB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoY29udGV4dFtuYW1lXS5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgICAgIHJldHVybiA8VD5pbnN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogamNyQ25zdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqY3JDbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT01NRU5UX0JZOiBzdHJpbmcgPSBcImNvbW1lbnRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFVCTElDX0FQUEVORDogc3RyaW5nID0gXCJwdWJsaWNBcHBlbmRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBSSU1BUllfVFlQRTogc3RyaW5nID0gXCJqY3I6cHJpbWFyeVR5cGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBPTElDWTogc3RyaW5nID0gXCJyZXA6cG9saWN5XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgTUlYSU5fVFlQRVM6IHN0cmluZyA9IFwiamNyOm1peGluVHlwZXNcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9DT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9SRUNJUDogc3RyaW5nID0gXCJyZWNpcFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfU1VCSkVDVDogc3RyaW5nID0gXCJzdWJqZWN0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRDogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRF9CWTogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBUQUdTOiBzdHJpbmcgPSBcInRhZ3NcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFVVSUQ6IHN0cmluZyA9IFwiamNyOnV1aWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRUQ6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRF9CWTogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkQnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEpTT05fRklMRV9TRUFSQ0hfUkVTVUxUOiBzdHJpbmcgPSBcImpzb25GaWxlU2VhcmNoUmVzdWx0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgRElTQUJMRV9JTlNFUlQ6IHN0cmluZyA9IFwiZGlzYWJsZUluc2VydFwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFVTRVI6IHN0cmluZyA9IFwidXNlclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFdEOiBzdHJpbmcgPSBcInB3ZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUw6IHN0cmluZyA9IFwiZW1haWxcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPREU6IHN0cmluZyA9IFwiY29kZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9WRVI6IHN0cmluZyA9IFwiYmluVmVyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fREFUQTogc3RyaW5nID0gXCJqY3JEYXRhXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fTUlNRTogc3RyaW5nID0gXCJqY3I6bWltZVR5cGVcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBJTUdfV0lEVEg6IHN0cmluZyA9IFwiaW1nV2lkdGhcIjtcclxuICAgICAgICBleHBvcnQgbGV0IElNR19IRUlHSFQ6IHN0cmluZyA9IFwiaW1nSGVpZ2h0XCI7XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogYXR0YWNobWVudC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBhdHRhY2htZW50IHtcclxuICAgICAgICAvKiBOb2RlIGJlaW5nIHVwbG9hZGVkIHRvICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGxvYWROb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5VcGxvYWRGcm9tRmlsZURsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgbTY0Lm5hbWVzcGFjZSB2ZXJzaW9uIVwiKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcoKSkub3BlbigpO1xyXG5cclxuICAgICAgICAgICAgLyogTm90ZTogVG8gcnVuIGxlZ2FjeSB1cGxvYWRlciBqdXN0IHB1dCB0aGlzIHZlcnNpb24gb2YgdGhlIGRpYWxvZyBoZXJlLCBhbmRcclxuICAgICAgICAgICAgbm90aGluZyBlbHNlIGlzIHJlcXVpcmVkLiBTZXJ2ZXIgc2lkZSBwcm9jZXNzaW5nIGlzIHN0aWxsIGluIHBsYWNlIGZvciBpdFxyXG5cclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5VcGxvYWRGcm9tVXJsRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbVVybERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUF0dGFjaG1lbnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZSBBdHRhY2htZW50XCIsIFwiRGVsZXRlIHRoZSBBdHRhY2htZW50IG9uIHRoZSBOb2RlP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVBdHRhY2htZW50UmVxdWVzdCwganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2U+KFwiZGVsZXRlQXR0YWNobWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgbnVsbCwgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgdWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIGF0dGFjaG1lbnRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlbW92ZUJpbmFyeUJ5VWlkKHVpZCk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3JjZSByZS1yZW5kZXIgZnJvbSBsb2NhbCBkYXRhLlxyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBlZGl0LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGVkaXQge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZU5vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBtNjQuQ3JlYXRlTm9kZURsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5zZXJ0Qm9va1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydEJvb2tSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEJvb2tSZXNwb25zZSBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IEJvb2tcIiwgcmVzKTtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlbGV0ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZSwgcGF5bG9hZDogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbE5vZGUgPSBwYXlsb2FkW1wicG9zdERlbGV0ZVNlbE5vZGVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBzZWxOb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBoaWdobGlnaHRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbml0Tm9kZUVkaXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFZGl0aW5nIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSBub2RlLm5hbWUuc3RhcnRzV2l0aChcInJlcDpcIikgfHwgLyogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnPyAqL25vZGUucGF0aC5jb250YWlucyhcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUgYW5kIHdlIGFyZSB0aGUgY29tbWVudGVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogU2VydmVyIHdpbGwgaGF2ZSBzZW50IHVzIGJhY2sgdGhlIHJhdyB0ZXh0IGNvbnRlbnQsIHRoYXQgc2hvdWxkIGJlIG1hcmtkb3duIGluc3RlYWQgb2YgYW55IEhUTUwsIHNvXHJcbiAgICAgICAgICAgICAgICAgICAgICogdGhhdCB3ZSBjYW4gZGlzcGxheSB0aGlzIGFuZCBzYXZlLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBjYW5ub3QgZWRpdCBub2RlcyB0aGF0IHlvdSBkb24ndCBvd24uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtb3ZlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Nb3ZlTm9kZXNSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJNb3ZlIG5vZGVzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gbnVsbDsgLy8gcmVzZXRcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UmVhZE9ubHlQcm9wZXJ0aWVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudE9mTmV3Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaW5kaWNhdGVzIGVkaXRvciBpcyBkaXNwbGF5aW5nIGEgbm9kZSB0aGF0IGlzIG5vdCB5ZXQgc2F2ZWQgb24gdGhlIHNlcnZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdGluZ1Vuc2F2ZWROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbm9kZSAoTm9kZUluZm8uamF2YSkgdGhhdCBpcyBiZWluZyBjcmVhdGVkIHVuZGVyIHdoZW4gbmV3IG5vZGUgaXMgY3JlYXRlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTm9kZSBiZWluZyBlZGl0ZWRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMjogdGhpcyBhbmQgc2V2ZXJhbCBvdGhlciB2YXJpYWJsZXMgY2FuIG5vdyBiZSBtb3ZlZCBpbnRvIHRoZSBkaWFsb2cgY2xhc3M/IElzIHRoYXQgZ29vZCBvciBiYWRcclxuICAgICAgICAgKiBjb3VwbGluZy9yZXNwb25zaWJpbGl0eT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlRGxnSW5zdDogRWRpdE5vZGVEbGcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR5cGU9Tm9kZUluZm8uamF2YVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbiBpbnNlcnRpbmcgYSBuZXcgbm9kZSwgdGhpcyBob2xkcyB0aGUgbm9kZSB0aGF0IHdhcyBjbGlja2VkIG9uIGF0IHRoZSB0aW1lIHRoZSBpbnNlcnQgd2FzIHJlcXVlc3RlZCwgYW5kXHJcbiAgICAgICAgICogaXMgc2VudCB0byBzZXJ2ZXIgZm9yIG9yZGluYWwgcG9zaXRpb24gYXNzaWdubWVudCBvZiBuZXcgbm9kZS4gQWxzbyBpZiB0aGlzIHZhciBpcyBudWxsLCBpdCBpbmRpY2F0ZXMgd2UgYXJlXHJcbiAgICAgICAgICogY3JlYXRpbmcgaW4gYSAnY3JlYXRlIHVuZGVyIHBhcmVudCcgbW9kZSwgdmVyc3VzIG5vbi1udWxsIG1lYW5pbmcgJ2luc2VydCBpbmxpbmUnIHR5cGUgb2YgaW5zZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSW5zZXJ0VGFyZ2V0OiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0VkaXRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIG5vZGUucGF0aCAhPSBcIi9cIiAmJlxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICghcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpIHx8IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKSkgLy9cclxuICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGJlc3Qgd2UgY2FuIGRvIGhlcmUgaXMgYWxsb3cgdGhlIGRpc2FibGVJbnNlcnQgcHJvcCB0byBiZSBhYmxlIHRvIHR1cm4gdGhpbmdzIG9mZiwgbm9kZSBieSBub2RlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0luc2VydEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkRJU0FCTEVfSU5TRVJULCBub2RlKSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Quc2F2ZU5ld05vZGUoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNhbGxlZCB0byBkaXNwbGF5IGVkaXRvciB0aGF0IHdpbGwgY29tZSB1cCBCRUZPUkUgYW55IG5vZGUgaXMgc2F2ZWQgb250byB0aGUgc2VydmVyLCBzbyB0aGF0IHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgICogYW55IHNhdmUgaXMgcGVyZm9ybWVkIHdlIHdpbGwgaGF2ZSB0aGUgY29ycmVjdCBub2RlIG5hbWUsIGF0IGxlYXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhpcyB2ZXJzaW9uIGlzIG5vIGxvbmdlciBiZWluZyB1c2VkLCBhbmQgY3VycmVudGx5IHRoaXMgbWVhbnMgJ2VkaXRpbmdVbnNhdmVkTm9kZScgaXMgbm90IGN1cnJlbnRseSBldmVyXHJcbiAgICAgICAgICogdHJpZ2dlcmVkLiBUaGUgbmV3IGFwcHJvYWNoIG5vdyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gJ3JlbmFtZScgbm9kZXMgaXMgdG8ganVzdCBjcmVhdGUgb25lIHdpdGggYVxyXG4gICAgICAgICAqIHJhbmRvbSBuYW1lIGFuIGxldCB1c2VyIHN0YXJ0IGVkaXRpbmcgcmlnaHQgYXdheSBhbmQgdGhlbiByZW5hbWUgdGhlIG5vZGUgSUYgYSBjdXN0b20gbm9kZSBuYW1lIGlzIG5lZWRlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgbWVhbnMgaWYgd2UgY2FsbCB0aGlzIGZ1bmN0aW9uIChzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUpIGluc3RlYWQgb2YgJ3N0YXJ0RWRpdGluZ05ld05vZGUoKSdcclxuICAgICAgICAgKiB0aGF0IHdpbGwgY2F1c2UgdGhlIEdVSSB0byBhbHdheXMgcHJvbXB0IGZvciB0aGUgbm9kZSBuYW1lIGJlZm9yZSBjcmVhdGluZyB0aGUgbm9kZS4gVGhpcyB3YXMgdGhlIG9yaWdpbmFsXHJcbiAgICAgICAgICogZnVuY3Rpb25hbGl0eSBhbmQgc3RpbGwgd29ya3MuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNyZWF0ZSBzdWJub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhdmVOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2F2ZU5vZGVSZXNwb25zZSwgcGF5bG9hZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBiZWNhc3VzZSBJIGRvbid0IHVuZGVyc3RhbmQgJ2VkaXRpbmdVbnNhdmVkTm9kZScgdmFyaWFibGUgYW55IGxvbmdlciB1bnRpbCBpIHJlZnJlc2ggbXkgbWVtb3J5LCBpIHdpbGwgdXNlXHJcbiAgICAgICAgICAgICAgICB0aGUgb2xkIGFwcHJvYWNoIG9mIHJlZnJlc2hpbmcgZW50aXJlIHRyZWUgcmF0aGVyIHRoYW4gbW9yZSBlZmZpY2llbnQgcmVmcmVzbk5vZGVPblBhZ2UsIGJlY3Vhc2UgaXQgcmVxdWlyZXNcclxuICAgICAgICAgICAgICAgIHRoZSBub2RlIHRvIGFscmVhZHkgYmUgb24gdGhlIHBhZ2UsIGFuZCB0aGlzIHJlcXVpcmVzIGluIGRlcHRoIGFuYWx5cyBpJ20gbm90IGdvaW5nIHRvIGRvIHJpZ2h0IHRoaXMgbWludXRlLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlKTtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHBheWxvYWQuc2F2ZWRJZCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE1vZGUgPSBmdW5jdGlvbihtb2RlVmFsPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVWYWwgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtb2RlVmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPyBmYWxzZSA6IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgICAgIC8vIHRoYXQgY2FuIHNob3cgYW4gb24vb2ZmIHN0YXRlLlxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTaW5jZSBlZGl0IG1vZGUgdHVybnMgb24gbG90cyBvZiBidXR0b25zLCB0aGUgbG9jYXRpb24gb2YgdGhlIG5vZGUgd2UgYXJlIHZpZXdpbmcgY2FuIGNoYW5nZSBzbyBtdWNoIGl0XHJcbiAgICAgICAgICAgICAqIGdvZXMgY29tcGxldGVseSBvZmZzY3JlZW4gb3V0IG9mIHZpZXcsIHNvIHdlIHNjcm9sbCBpdCBiYWNrIGludG8gdmlldyBldmVyeSB0aW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQuc2F2ZVVzZXJQcmVmZXJlbmNlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVVwID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVBYm92ZSA9IGdldE5vZGVBYm92ZShub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlQWJvdmUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGVBYm92ZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlRG93biA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlQmVsb3c6IGpzb24uTm9kZUluZm8gPSBnZXROb2RlQmVsb3cobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZUJlbG93ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlQmVsb3cubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb1RvcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BOb2RlID0gZ2V0Rmlyc3RDaGlsZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b3BOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiB0b3BOb2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb0JvdHRvbSA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBhYm92ZSB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgdG9wIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVBYm92ZSA9IGZ1bmN0aW9uKG5vZGUpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsIDw9IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCAtIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGJlbG93IHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSBib3R0b20gbm9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJlbG93ID0gZnVuY3Rpb24obm9kZTogYW55KToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcmRpbmFsID0gXCIgKyBvcmRpbmFsKTtcclxuICAgICAgICAgICAgaWYgKG9yZGluYWwgPT0gLTEgfHwgb3JkaW5hbCA+PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgKyAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Rmlyc3RDaGlsZE5vZGUgPSBmdW5jdGlvbigpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlblswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuRWRpdE5vZGUgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBlZGl0Tm9kZUNsaWNrOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluaXROb2RlRWRpdFJlcXVlc3QsIGpzb24uSW5pdE5vZGVFZGl0UmVzcG9uc2U+KFwiaW5pdE5vZGVFZGl0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgfSwgaW5pdE5vZGVFZGl0UmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnROb2RlID0gZnVuY3Rpb24odWlkPzogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gcGFyZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vIHVpZCBwcm92aWRlZCB3ZSBkZWFmdWx0IHRvIGNyZWF0aW5nIGEgbm9kZSB1bmRlciB0aGUgY3VycmVudGx5IHZpZXdlZCBub2RlIChwYXJlbnQgb2YgY3VycmVudCBwYWdlKSwgb3IgYW55IHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqIG5vZGUgaWYgdGhlcmUgaXMgYSBzZWxlY3RlZCBub2RlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHROb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBoaWdobGlnaHROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIGNyZWF0ZVN1Yk5vZGU6IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRoaXMgaW5kaWNhdGVzIHdlIGFyZSBOT1QgaW5zZXJ0aW5nIGlubGluZS4gQW4gaW5saW5lIGluc2VydCB3b3VsZCBhbHdheXMgaGF2ZSBhIHRhcmdldC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlcGx5VG9Db21tZW50ID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgY3JlYXRlU3ViTm9kZSh1aWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGlvbnMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgY291bGQgd3JpdGUgY29kZSB0aGF0IG9ubHkgc2NhbnMgZm9yIGFsbCB0aGUgXCJTRUxcIiBidXR0b25zIGFuZCB1cGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGVtLCBidXQgZm9yIG5vd1xyXG4gICAgICAgICAgICAgKiB3ZSB0YWtlIHRoZSBzaW1wbGUgYXBwcm9hY2ggYW5kIGp1c3QgcmUtcmVuZGVyIHRoZSBwYWdlLiBUaGVyZSBpcyBubyBjYWxsIHRvIHRoZSBzZXJ2ZXIsIHNvIHRoaXMgaXNcclxuICAgICAgICAgICAgICogYWN0dWFsbHkgdmVyeSBlZmZpY2llbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRGVsZXRlIHRoZSBzaW5nbGUgbm9kZSBpZGVudGlmaWVkIGJ5ICd1aWQnIHBhcmFtZXRlciBpZiB1aWQgcGFyYW1ldGVyIGlzIHBhc3NlZCwgYW5kIGlmIHVpZCBwYXJhbWV0ZXIgaXMgbm90XHJcbiAgICAgICAgICogcGFzc2VkIHRoZW4gdXNlIHRoZSBub2RlIHNlbGVjdGlvbnMgZm9yIG11bHRpcGxlIHNlbGVjdGlvbnMgb24gdGhlIHBhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIGRlbGV0ZSBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc3REZWxldGVTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZU5vZGVzUmVxdWVzdCwganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlPihcImRlbGV0ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IHNlbE5vZGVzQXJyYXlcclxuICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVOb2Rlc1Jlc3BvbnNlLCBudWxsLCB7IFwicG9zdERlbGV0ZVNlbE5vZGVcIjogcG9zdERlbGV0ZVNlbE5vZGUgfSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyB0aGUgbm9kZSB3ZSB3YW50IHRvIHNjcm9sbCB0byBhZnRlciBhIGRlbGV0ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIC8qIFVzZSBhIGhhc2htYXAtdHlwZSBhcHByb2FjaCB0byBzYXZpbmcgYWxsIHNlbGVjdGVkIG5vZGVzIGludG8gYSBsb291cCBtYXAgKi9cclxuICAgICAgICAgICAgbGV0IG5vZGVzTWFwOiBPYmplY3QgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCgpO1xyXG4gICAgICAgICAgICBsZXQgYmVzdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdGFrZU5leHROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgd2Ugc2NhbiB0aGUgY2hpbGRyZW4sIGFuZCB0aGUgbGFzdCBjaGlsZCB3ZSBlbmNvdW50ZXJkIHVwIHVudGlsIHdlIGZpbmQgdGhlIHJpc3Qgb25lbiBpbiBub2Rlc01hcCB3aWxsIGJlIHRoZVxyXG4gICAgICAgICAgICBub2RlIHdlIHdpbGwgd2FudCB0byBzZWxlY3QgYW5kIHNjcm9sbCB0aGUgdXNlciB0byBBRlRFUiB0aGUgZGVsZXRpbmcgaXMgZG9uZSAqL1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFrZU5leHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaXMgdGhpcyBub2RlIG9uZSB0byBiZSBkZWxldGVkICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNNYXBbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlTmV4dE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVzdE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiZXN0Tm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIG1vdmUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcclxuICAgICAgICAgICAgICAgIFwiQ29uZmlybSBQYXN0ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJQYXN0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSB0byBuZXcgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXMsIG1vdmUuXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IHNlbE5vZGVzQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTsgLy8gY2xlYXIgc2VsZWN0aW9ucy5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZpbmlzaE1vdmluZ1NlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gTW92ZVwiLCBcIk1vdmUgXCIgKyBub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHRvIHNlbGVjdGVkIGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzLCBtb3ZlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHBhZ2UuIExhdGVyIG9uIHdlIGNhbiBnZXQgbW9yZSBzcGVjaWZpYyBhYm91dCBhbGxvd2luZyBwcmVjaXNlIGRlc3RpbmF0aW9uIGxvY2F0aW9uIGZvciBtb3ZlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIG5vZGVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk1vdmVOb2Rlc1JlcXVlc3QsIGpzb24uTW92ZU5vZGVzUmVzcG9uc2U+KFwibW92ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROb2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRDaGlsZElkXCI6IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCA/IGhpZ2hsaWdodE5vZGUuaWQgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogbm9kZXNUb01vdmVcclxuICAgICAgICAgICAgICAgICAgICB9LCBtb3ZlTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnRCb29rV2FyQW5kUGVhY2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybVwiLCBcIkluc2VydCBib29rIFdhciBhbmQgUGVhY2U/PHAvPldhcm5pbmc6IFlvdSBzaG91bGQgaGF2ZSBhbiBFTVBUWSBub2RlIHNlbGVjdGVkIG5vdywgdG8gc2VydmUgYXMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgYm9vayFcIiwgXCJZZXMsIGluc2VydCBib29rLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbnNlcnRCb29rUmVxdWVzdCwganNvbi5JbnNlcnRCb29rUmVzcG9uc2U+KFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9va05hbWVcIjogXCJXYXIgYW5kIFBlYWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGluc2VydEJvb2tSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1ldGE2NC5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIEFwcGxpY2F0aW9uIGluc3RhbmNlLCBhbmQgY2VudHJhbCByb290IGxldmVsIG9iamVjdCBmb3IgYWxsIGNvZGUsIGFsdGhvdWdoIGVhY2ggbW9kdWxlIGdlbmVyYWxseSBjb250cmlidXRlcyBvbmVcclxuICogc2luZ2xldG9uIHZhcmlhYmxlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHdpdGggYSBuYW1lIHVzdWFsbHkgaWRlbnRpY2FsIHRvIHRoYXQgZmlsZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZXRhNjQge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFwcEluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VyVXJsUGF0aDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgICBleHBvcnQgbGV0IHVybENtZDogc3RyaW5nO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNvZGVGb3JtYXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VydmVyTWFya2Rvd246IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKiB1c2VkIGFzIGEga2luZCBvZiAnc2VxdWVuY2UnIGluIHRoZSBhcHAsIHdoZW4gdW5pcXVlIHZhbHMgYSBuZWVkZWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRHdWlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKiBuYW1lIG9mIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlck5hbWU6IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcblxyXG4gICAgICAgIC8qIHNjcmVlbiBjYXBhYmlsaXRpZXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZVdpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGV2aWNlSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVzZXIncyByb290IG5vZGUuIFRvcCBsZXZlbCBvZiB3aGF0IGxvZ2dlZCBpbiB1c2VyIGlzIGFsbG93ZWQgdG8gc2VlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVJZDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlUGF0aDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBZG1pblVzZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogYWx3YXlzIHN0YXJ0IG91dCBhcyBhbm9uIHVzZXIgdW50aWwgbG9naW4gKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQW5vblVzZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzaWduYWxzIHRoYXQgZGF0YSBoYXMgY2hhbmdlZCBhbmQgdGhlIG5leHQgdGltZSB3ZSBnbyB0byB0aGUgbWFpbiB0cmVlIHZpZXcgd2luZG93IHdlIG5lZWQgdG8gcmVmcmVzaCBkYXRhXHJcbiAgICAgICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0cmVlRGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1aWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLmlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIGNvdW50ZXIgZm9yIGxvY2FsIHVpZHMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRVaWQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkZW50VG9VaWRNYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVbmRlciBhbnkgZ2l2ZW4gbm9kZSwgdGhlcmUgY2FuIGJlIG9uZSBhY3RpdmUgJ3NlbGVjdGVkJyBub2RlIHRoYXQgaGFzIHRoZSBoaWdobGlnaHRpbmcsIGFuZCB3aWxsIGJlIHNjcm9sbGVkXHJcbiAgICAgICAgICogdG8gd2hlbmV2ZXIgdGhlIHBhZ2Ugd2l0aCB0aGF0IGNoaWxkIGlzIHZpc2l0ZWQsIGFuZCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCBob2xkcyB0aGUgbWFwIG9mIFwicGFyZW50IHVpZCB0b1xyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAgICAgKiBzZWxlY3RlZCBub2RlIHdpdGhpbiB0aGF0IHBhcmVudC4gTm90ZSB0aGlzICdzZWxlY3Rpb24gc3RhdGUnIGlzIG9ubHkgc2lnbmlmaWNhbnQgb24gdGhlIGNsaWVudCwgYW5kIG9ubHkgZm9yXHJcbiAgICAgICAgICogYmVpbmcgYWJsZSB0byBzY3JvbGwgdG8gdGhlIG5vZGUgZHVyaW5nIG5hdmlnYXRpbmcgYXJvdW5kIG9uIHRoZSB0cmVlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIFVzZXItc2VsZWN0YWJsZSB1c2VyLWFjY291bnQgb3B0aW9ucyBlYWNoIHVzZXIgY2FuIHNldCBvbiBoaXMgYWNjb3VudCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9BRFZBTkNFRDogc3RyaW5nID0gXCJhZHZhbmNlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9TSU1QTEU6IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgICAgIC8qIGNhbiBiZSAnc2ltcGxlJyBvciAnYWR2YW5jZWQnICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0TW9kZU9wdGlvbjogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2dnbGVkIGJ5IGJ1dHRvbiwgYW5kIGhvbGRzIGlmIHdlIGFyZSBnb2luZyB0byBzaG93IHByb3BlcnRpZXMgb3Igbm90IG9uIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB2aWV3XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UHJvcGVydGllczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBGbGFnIHRoYXQgaW5kaWNhdGVzIGlmIHdlIGFyZSByZW5kZXJpbmcgcGF0aCwgb3duZXIsIG1vZFRpbWUsIGV0Yy4gb24gZWFjaCByb3cgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dNZXRhRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIExpc3Qgb2Ygbm9kZSBwcmVmaXhlcyB0byBmbGFnIG5vZGVzIHRvIG5vdCBhbGxvdyB0byBiZSBzaG93biBpbiB0aGUgcGFnZSBpbiBzaW1wbGUgbW9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgXCJyZXA6XCI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVhZE9ubHlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmFyeVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBhbGwgbm9kZSB1aWRzIHRvIHRydWUgaWYgc2VsZWN0ZWQsIG90aGVyd2lzZSB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGRlbGV0ZWQgKG5vdCBleGlzdGluZylcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlbGVjdGVkTm9kZXM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBTZXQgb2YgYWxsIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGVkIChmcm9tIHRoZSBhYmJyZXZpYXRlZCBmb3JtKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZXhwYW5kZWRBYmJyZXZOb2RlSWRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogUmVuZGVyTm9kZVJlc3BvbnNlLmphdmEgb2JqZWN0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZURhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYWxsIHZhcmlhYmxlcyBkZXJpdmFibGUgZnJvbSBjdXJyZW50Tm9kZURhdGEsIGJ1dCBzdG9yZWQgZGlyZWN0bHkgZm9yIHNpbXBsZXIgY29kZS9hY2Nlc3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlVWlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVJZDogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlUGF0aDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogTWFwcyBmcm9tIGd1aWQgdG8gRGF0YSBPYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRhdGFPYmpNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlclByZWZlcmVuY2VzOiBqc29uLlVzZXJQcmVmZXJlbmNlcyA9IHtcclxuICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwibGFzdE5vZGVcIjogXCJcIixcclxuICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVNYWluTWVudVBhbmVsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICAgICAqIGZ1dHVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZ2lzdGVyRGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFkYXRhLmd1aWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbmV4dEd1aWQ7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9iamVjdEJ5R3VpZCA9IGZ1bmN0aW9uKGd1aWQpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGRhdGFPYmpNYXBbZ3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGNhbGxiYWNrIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgc2NyaXB0IHRvIHJ1biwgb3IgaWYgaXQncyBhIGZ1bmN0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmVcclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbmV2ZXIgd2UgYXJlIGJ1aWxkaW5nIGFuIG9uQ2xpY2sgc3RyaW5nLCBhbmQgd2UgaGF2ZSB0aGUgYWN0dWFsIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiB0aGUgbmFtZSBvZiB0aGVcclxuICAgICAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAgICAgKiB0byB0aGUgZnVuY3Rpb24gb2JqZWN0LCBhbmQgdGhlbiBlbmNvZGUgYSBjYWxsIHRvIHJ1biB0aGF0IGd1aWQgYnkgY2FsbGluZyBydW5DYWxsYmFjay4gVGhlcmUgaXMgYSBsZXZlbCBvZlxyXG4gICAgICAgICAqIGluZGlyZWN0aW9uIGhlcmUsIGJ1dCB0aGlzIGlzIHRoZSBzaW1wbGVzdCBhcHByb2FjaCB3aGVuIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBtYXAgZnJvbSBhIHN0cmluZyB0byBhXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBjdHg9Y29udGV4dCwgd2hpY2ggaXMgdGhlICd0aGlzJyB0byBjYWxsIHdpdGggaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCBhbmQgaGF2ZSBhICd0aGlzJyBjb250ZXh0IHRvIGJpbmQgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBwYXlsb2FkIGlzIGFueSBkYXRhIG9iamVjdCB0aGF0IG5lZWRzIHRvIGJlIHBhc3NlZCBhdCBydW50aW1lXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZU9uQ2xpY2sgPSBmdW5jdGlvbihjYWxsYmFjazogYW55LCBjdHg/OiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChwYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBheWxvYWRTdHIgPSBwYXlsb2FkID8gcGF5bG9hZC5ndWlkIDogXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm02NC5tZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIsXCIgKyBjdHguZ3VpZCArIFwiLFwiICsgcGF5bG9hZFN0ciArIFwiKTtcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibTY0Lm1ldGE2NC5ydW5DYWxsYmFjayhcIiArIGNhbGxiYWNrLmd1aWQgKyBcIik7XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuZXhwZWN0ZWQgY2FsbGJhY2sgdHlwZSBpbiBlbmNvZGVPbkNsaWNrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFPYmogPSBnZXRPYmplY3RCeUd1aWQoZ3VpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vIHRoYXQgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICBpZiAoZGF0YU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG9yIGVsc2Ugc29tZXRpbWVzIHRoZSByZWdpc3RlcmVkIG9iamVjdCBpdHNlbGYgaXMgdGhlIGZ1bmN0aW9uLFxyXG4gICAgICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFPYmogPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gZ2V0T2JqZWN0QnlHdWlkKGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBheWxvYWRPYmogPSBwYXlsb2FkID8gZ2V0T2JqZWN0QnlHdWlkKHBheWxvYWQpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGwodGhpeiwgcGF5bG9hZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmooKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5hYmxlIHRvIGZpbmQgY2FsbGJhY2sgb24gcmVnaXN0ZXJlZCBndWlkOiBcIiArIGd1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5TaW1wbGVNb2RlID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBlZGl0TW9kZU9wdGlvbiA9PT0gTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2ggPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZ29Ub01haW5QYWdlKHRydWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnb1RvTWFpblBhZ2UgPSBmdW5jdGlvbihyZXJlbmRlcj86IGJvb2xlYW4sIGZvcmNlU2VydmVyUmVmcmVzaD86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIHRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXJlbmRlciB8fCB0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgcmUtcmVuZGVyaW5nIHBhZ2UgKGVpdGhlciBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBkYXRhLCB0aGVuIHdlIGp1c3QgbmVlZCB0byBsaXR0ZXJhbGx5IHN3aXRjaFxyXG4gICAgICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0VGFiID0gZnVuY3Rpb24ocGFnZU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAgICAgKDxfSGFzU2VsZWN0Pmlyb25QYWdlcykuc2VsZWN0KHBhZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgY29kZSBjYW4gYmUgbWFkZSBtb3JlIERSWSwgYnV0IGknbSBqdXN0IHRyeWluZyBpdCBvdXQgZm9yIG5vdywgc28gaSdtIG5vdCBib3RoZXJpbmcgdG8gcGVyZmVjdCBpdCB5ZXQuICovXHJcbiAgICAgICAgICAgIC8vICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGlmIChwYWdlTmFtZSA9PSAnbWFpblRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAnc2VhcmNoVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3RpbWVsaW5lVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgICAgICogbWV0aG9kcyBhcmUgb2YgY291cnNlIHNpbmdsZXRvbnMgdGhhdCBhY2NlcHQgdGhpcyBkYXRhIHBhcmFtZXRlciBmb3IgYW55IG9wdGVyYXRpb25zLiAob2xkc2Nob29sIHdheSBvZiBkb2luZ1xyXG4gICAgICAgICAqIE9PUCB3aXRoICd0aGlzJyBiZWluZyBmaXJzdCBwYXJhbWV0ZXIgYWx3YXlzKS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIE5vdGU6IGVhY2ggZGF0YSBpbnN0YW5jZSBpcyByZXF1aXJlZCB0byBoYXZlIGEgZ3VpZCBudW1iZXJpYyBwcm9wZXJ0eSwgdW5pcXVlIHRvIGl0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGFuZ2VQYWdlID0gZnVuY3Rpb24ocGc/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwZy50YWJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib29wcywgd3Jvbmcgb2JqZWN0IHR5cGUgcGFzc2VkIHRvIGNoYW5nZVBhZ2UgZnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgaXMgdGhlIHNhbWUgYXMgc2V0dGluZyB1c2luZyBtYWluSXJvblBhZ2VzPz8gKi9cclxuICAgICAgICAgICAgdmFyIHBhcGVyVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTsgLy9cIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+cGFwZXJUYWJzKS5zZWxlY3QocGcudGFiSWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vZGVCbGFja0xpc3RlZCA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFpblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wO1xyXG4gICAgICAgICAgICBmb3IgKHByb3AgaW4gc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBub2RlLm5hbWUuc3RhcnRzV2l0aChwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgdmFyIHNlbEFycmF5ID0gW10sIGlkeCA9IDAsIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVJZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgdmFyIHNlbEFycmF5ID0gW10sIGlkeCA9IDAsIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBzZWxlY3RlZCBub2Rlcy5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJuIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIGVhY2ggTm9kZUluZm8gd2hlcmUgdGhlIGtleSBpcyB0aGUgaWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQgPSBmdW5jdGlvbigpOiBPYmplY3Qge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSB0aGlzLmdldFNlbGVjdGVkTm9kZXNBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXRbc2VsQXJyYXlbaV0uaWRdID0gc2VsQXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgc2VsZWN0ZWQgbm9kZXMgYXMgTm9kZUluZm8uamF2YSBvYmplY3RzIGFycmF5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXJyYXkgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGVkTm9kZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzLCBub2RlKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1pbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXIgPT09IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IG93bmVyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxtID0gJChcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktb3RoZXJcIiwgXCJjcmVhdGVkLWJ5LW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBSZXR1cm5zIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIG5vZGUuaWQgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVGcm9tSWQgPSBmdW5jdGlvbihpZDogc3RyaW5nKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZFRvTm9kZU1hcFtpZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhdGhPZlVpZCA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEhpZ2hsaWdodGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dCeUlkID0gZnVuY3Rpb24oaWQsIHNjcm9sbCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaWdobGlnaHRSb3dCeUlkIGZhaWxlZCB0byBmaW5kIGlkOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2Nyb2xsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBkb25lSGlnaGxpZ2h0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICAgICAgbGV0IGN1ckhpZ2hsaWdodGVkTm9kZToganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgPT09IG5vZGUudWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbHJlYWR5IGhpZ2hsaWdodGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkID0gY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkb25lSGlnaGxpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF0gPSBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZDogc3RyaW5nID0gbm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG06IHN0cmluZyA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJvd0VsbSB8fCByb3dFbG0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmaW5kIHJvd0VsZW1lbnQgdG8gaGlnaGxpZ2h0OiBcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlYWxseSBuZWVkIHRvIHVzZSBwdWIvc3ViIGV2ZW50IHRvIGJyb2FkY2FzdCBlbmFibGVtZW50LCBhbmQgbGV0IGVhY2ggY29tcG9uZW50IGRvIHRoaXMgaW5kZXBlbmRlbnRseSBhbmRcclxuICAgICAgICAgKiBkZWNvdXBsZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVJc01pbmU6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICYmIChoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gdXNlck5hbWUgfHwgXCJhZG1pblwiID09PSB1c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGxldCBob21lTm9kZVNlbGVjdGVkOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAmJiBob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGxldCBpbXBvcnRBbGxvd2VkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmltcG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBleHBvcnRBbGxvd2VkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmV4cG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHRPcmRpbmFsOiBudW1iZXIgPSBnZXRPcmRpbmFsT2ZOb2RlKGhpZ2hsaWdodE5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgbnVtQ2hpbGROb2RlczogbnVtYmVyID0gZ2V0TnVtQ2hpbGROb2RlcygpO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gaGlnaGxpZ2h0T3JkaW5hbCA+IDAgJiYgbnVtQ2hpbGROb2RlcyA+IDE7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IGhpZ2hsaWdodE9yZGluYWwgPCBudW1DaGlsZE5vZGVzIC0gMSAmJiBudW1DaGlsZE5vZGVzID4gMTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBuZWVkIHRvIGFkZCB0byB0aGlzIHNlbE5vZGVJc01pbmUgfHwgc2VsUGFyZW50SXNNaW5lO1xyXG4gICAgICAgICAgICBsZXQgY2FuQ3JlYXRlTm9kZSA9IHVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiAoaXNBZG1pblVzZXIgfHwgKCFpc0Fub25Vc2VyICYmIHNlbE5vZGVJc01pbmUpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW5hYmxlbWVudDogaXNBbm9uVXNlcj1cIiArIGlzQW5vblVzZXIgKyBcIiBzZWxOb2RlQ291bnQ9XCIgKyBzZWxOb2RlQ291bnQgKyBcIiBzZWxOb2RlSXNNaW5lPVwiICsgc2VsTm9kZUlzTWluZSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJuYXZMb2dvdXRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0QWxsb3dlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5JbXBvcnREbGdcIiwgaW1wb3J0QWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcHNUb2dnbGU6IGJvb2xlYW4gPSBjdXJyZW50Tm9kZSAmJiAhaXNBbm9uVXNlcjtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgcHJvcHNUb2dnbGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbG93RWRpdE1vZGU6IGJvb2xlYW4gPSBjdXJyZW50Tm9kZSAmJiAhaXNBbm9uVXNlcjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgZWRpdC5ub2Rlc1RvTW92ZSAhPSBudWxsICYmIChzZWxOb2RlSXNNaW5lIHx8IGhvbWVOb2RlU2VsZWN0ZWQpKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVXBCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIGlzQWRtaW5Vc2VyIHx8ICh1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgaGlnaGxpZ2h0Tm9kZS5oYXNCaW5hcnkgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNvbnRlbnRTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTW9kaWZpZWRCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNyZWF0ZU5vZGVCdXR0b25cIiwgY2FuQ3JlYXRlTm9kZSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEFsbG93ZWQgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0QWxsb3dlZCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBpc0FkbWluVXNlciB8fCAodXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5Mb2dpbkRsZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibmF2TG9nb3V0QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIGlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG5cclxuICAgICAgICAgICAgLy9Ub3AgTGV2ZWwgTWVudSBWaXNpYmlsaXR5XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImFkbWluTWVudVwiLCBpc0FkbWluVXNlcik7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTaW5nbGVTZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmb3VuZCBhIHNpbmdsZSBTZWwgTm9kZUlEOiBcIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRPcmRpbmFsT2ZOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSB8fCAhY3VycmVudE5vZGVEYXRhIHx8ICFjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaWQgPT09IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0TnVtQ2hpbGROb2RlcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudE5vZGVEYXRhIHx8ICFjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRDdXJyZW50Tm9kZURhdGEgPSBmdW5jdGlvbihkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gZGF0YS5ub2RlO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVVpZCA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSWQgPSBkYXRhLm5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlUGF0aCA9IGRhdGEubm9kZS5wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhbm9uUGFnZUxvYWRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Bbm9uUGFnZUxvYWRSZXNwb25zZSk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMucmVuZGVyTm9kZVJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgbGlzdHZpZXcgdG86IFwiICsgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbW92ZUJpbmFyeUJ5VWlkID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNCaW5hcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1cGRhdGVzIGNsaWVudCBzaWRlIG1hcHMgYW5kIGNsaWVudC1zaWRlIGlkZW50aWZpZXIgZm9yIG5ldyBub2RlLCBzbyB0aGF0IHRoaXMgbm9kZSBpcyAncmVjb2duaXplZCcgYnkgY2xpZW50XHJcbiAgICAgICAgICogc2lkZSBjb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHVwZGF0ZU1hcHM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0Tm9kZSBoYXMgbnVsbCBub2RlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGFzc2lnbiBhIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgdGhpcyBub2RlIHR5cGUsIEknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHVzaW5nIHNvbWUga2luZCBvZiBjdXN0b20gSlNcclxuICAgICAgICAgICAgICogcHJvdG90eXBlLXJlbGF0ZWQgYXBwcm9hY2hcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUudWlkID0gdXBkYXRlTWFwcyA/IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCkgOiBpZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBub2RlLnByb3BlcnRpZXMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIobm9kZS5wcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEZvciB0aGVzZSB0d28gcHJvcGVydGllcyB0aGF0IGFyZSBhY2Nlc3NlZCBmcmVxdWVudGx5IHdlIGdvIGFoZWFkIGFuZCBsb29rdXAgdGhlIHByb3BlcnRpZXMgaW4gdGhlXHJcbiAgICAgICAgICAgICAqIHByb3BlcnR5IGFycmF5LCBhbmQgYXNzaWduIHRoZW0gZGlyZWN0bHkgYXMgbm9kZSBvYmplY3QgcHJvcGVydGllcyBzbyB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLCBhbmQgYWxzb1xyXG4gICAgICAgICAgICAgKiBzaW1wbGlmeSBjb2RlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZS5jcmVhdGVkQnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbm9kZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5MQVNUX01PRElGSUVELCBub2RlKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXBkYXRlTWFwcykge1xyXG4gICAgICAgICAgICAgICAgdWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZFRvTm9kZU1hcFtub2RlLmlkXSA9IG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdENvbnN0YW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUE9MSUNZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChyZWFkT25seVByb3BlcnR5TGlzdCwgWyAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlVVSUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVEX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVEX0JZLC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChiaW5hcnlQcm9wZXJ0eUxpc3QsIFtqY3JDbnN0LkJJTl9EQVRBXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IHRoaXMgYW5kIGV2ZXJ5IG90aGVyIG1ldGhvZCB0aGF0J3MgY2FsbGVkIGJ5IGEgbGl0c3RlbmVyIG9yIGEgdGltZXIgbmVlZHMgdG8gaGF2ZSB0aGUgJ2ZhdCBhcnJvdycgc3ludGF4IGZvciB0aGlzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0QXBwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdEFwcCBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcHBJbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGFwcEluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YWJzID0gdXRpbC5wb2x5KFwibWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJDaGFuZ2VFdmVudCh0YWJzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpbml0Q29uc3RhbnRzKCk7XHJcbiAgICAgICAgICAgIGRpc3BsYXlTaWdudXBNZXNzYWdlKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAgICAgKiAkKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBfLm9yaWVudGF0aW9uSGFuZGxlcik7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJMZWF2ZSBNZXRhNjQgP1wiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEkgdGhvdWdodCB0aGlzIHdhcyBhIGdvb2QgaWRlYSwgYnV0IGFjdHVhbGx5IGl0IGRlc3Ryb3lzIHRoZSBzZXNzaW9uLCB3aGVuIHRoZSB1c2VyIGlzIGVudGVyaW5nIGFuXHJcbiAgICAgICAgICAgICAqIFwiaWQ9XFxteVxccGF0aFwiIHR5cGUgb2YgdXJsIHRvIG9wZW4gYSBzcGVjaWZpYyBub2RlLiBOZWVkIHRvIHJldGhpbmsgIEJhc2ljYWxseSBmb3Igbm93IEknbSB0aGlua2luZ1xyXG4gICAgICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwidW5sb2FkXCIsIGZ1bmN0aW9uKCkgeyB1c2VyLmxvZ291dChmYWxzZSk7IH0pO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGRldmljZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFRoaXMgY2FsbCBjaGVja3MgdGhlIHNlcnZlciB0byBzZWUgaWYgd2UgaGF2ZSBhIHNlc3Npb24gYWxyZWFkeSwgYW5kIGdldHMgYmFjayB0aGUgbG9naW4gaW5mb3JtYXRpb24gZnJvbVxyXG4gICAgICAgICAgICAgKiB0aGUgc2Vzc2lvbiwgYW5kIHRoZW4gcmVuZGVycyBwYWdlIGNvbnRlbnQsIGFmdGVyIHRoYXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB1c2VyLnJlZnJlc2hMb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogQ2hlY2sgZm9yIHNjcmVlbiBzaXplIGluIGEgdGltZXIuIFdlIGRvbid0IHdhbnQgdG8gbW9uaXRvciBhY3R1YWwgc2NyZWVuIHJlc2l6ZSBldmVudHMgYmVjYXVzZSBpZiBhIHVzZXJcclxuICAgICAgICAgICAgICogaXMgZXhwYW5kaW5nIGEgd2luZG93IHdlIGJhc2ljYWxseSB3YW50IHRvIGxpbWl0IHRoZSBDUFUgYW5kIGNoYW9zIHRoYXQgd291bGQgZW5zdWUgaWYgd2UgdHJpZWQgdG8gYWRqdXN0XHJcbiAgICAgICAgICAgICAqIHRoaW5ncyBldmVyeSB0aW1lIGl0IGNoYW5nZXMuIFNvIHdlIHRocm90dGxlIGJhY2sgdG8gb25seSByZW9yZ2FuaXppbmcgdGhlIHNjcmVlbiBvbmNlIHBlciBzZWNvbmQuIFRoaXNcclxuICAgICAgICAgICAgICogdGltZXIgaXMgYSB0aHJvdHRsZSBzb3J0IG9mLiBZZXMgSSBrbm93IGhvdyB0byBsaXN0ZW4gZm9yIGV2ZW50cy4gTm8gSSdtIG5vdCBkb2luZyBpdCB3cm9uZyBoZXJlLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGNvcnJlY3QgaW4gdGhpcyBjYXNlIGFuZCBiZWhhdmVzIHN1cGVyaW9yIHRvIGV2ZW50cy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFBvbHltZXItPmRpc2FibGVcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IHZhciB3aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBpZiAod2lkdGggIT0gXy5kZXZpY2VXaWR0aCkgeyAvLyBjb25zb2xlLmxvZyhcIlNjcmVlbiB3aWR0aCBjaGFuZ2VkOiBcIiArIHdpZHRoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogXy5kZXZpY2VXaWR0aCA9IHdpZHRoOyBfLmRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogXy5zY3JlZW5TaXplQ2hhbmdlKCk7IH0gfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgdXBkYXRlTWFpbk1lbnVQYW5lbCgpO1xyXG4gICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5pbml0UHJvZ3Jlc3NNb25pdG9yKCk7XHJcblxyXG4gICAgICAgICAgICBwcm9jZXNzVXJsUGFyYW1zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2Nlc3NVcmxQYXJhbXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHBhc3NDb2RlID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJwYXNzQ29kZVwiKTtcclxuICAgICAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgQ2hhbmdlUGFzc3dvcmREbGcocGFzc0NvZGUpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cmxDbWQgPSB1dGlsLmdldFBhcmFtZXRlckJ5TmFtZShcImNtZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGFiQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbih0YWJOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0YWJOYW1lID09IFwic2VhcmNoVGFiTmFtZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFRhYkFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRpc3BsYXlTaWdudXBNZXNzYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBzaWdudXBSZXNwb25zZSA9ICQoXCIjc2lnbnVwQ29kZVJlc3BvbnNlXCIpLnRleHQoKTtcclxuICAgICAgICAgICAgaWYgKHNpZ251cFJlc3BvbnNlID09PSBcIm9rXCIpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2NyZWVuU2l6ZUNoYW5nZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudE5vZGVEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlLmltZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmltZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIERvbid0IG5lZWQgdGhpcyBtZXRob2QgeWV0LCBhbmQgaGF2ZW4ndCB0ZXN0ZWQgdG8gc2VlIGlmIHdvcmtzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcmllbnRhdGlvbkhhbmRsZXIgPSBmdW5jdGlvbihldmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBpZiAoZXZlbnQub3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXZlbnQub3JpZW50YXRpb24gPT09ICdsYW5kc2NhcGUnKSB7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2FkQW5vblBhZ2VIb21lID0gZnVuY3Rpb24oaWdub3JlVXJsKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFub25QYWdlTG9hZFJlcXVlc3QsIGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2U+KFwiYW5vblBhZ2VMb2FkXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWdub3JlVXJsXCI6IGlnbm9yZVVybFxyXG4gICAgICAgICAgICB9LCBhbm9uUGFnZUxvYWRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhdmVVc2VyUHJlZmVyZW5jZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3QsIGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlPihcInNhdmVVc2VyUHJlZmVyZW5jZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICAgICAgXCJ1c2VyUHJlZmVyZW5jZXNcIjogdXNlclByZWZlcmVuY2VzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuU3lzdGVtRmlsZSA9IGZ1bmN0aW9uKGZpbGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uT3BlblN5c3RlbUZpbGVSZXF1ZXN0LCBqc29uLk9wZW5TeXN0ZW1GaWxlUmVzcG9uc2U+KFwib3BlblN5c3RlbUZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBmaWxlTmFtZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIHRvZG8tMDogZm9yIG5vdyBJJ2xsIGp1c3QgZHJvcCB0aGlzIGludG8gYSBnbG9iYWwgdmFyaWFibGUuIEkga25vdyB0aGVyZSdzIGEgYmV0dGVyIHdheS4gVGhpcyBpcyB0aGUgb25seSB2YXJpYWJsZVxyXG53ZSBoYXZlIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlLCBhbmQgaXMgb25seSByZXF1aXJlZCBmb3IgYXBwbGljYXRpb24gaW5pdGlhbGl6YXRpb24gaW4gSlMgb24gdGhlIGluZGV4Lmh0bWwgcGFnZSAqL1xyXG5pZiAoIXdpbmRvd1tcIm1ldGE2NFwiXSkge1xyXG4gICAgdmFyIG1ldGE2NCA9IG02NC5tZXRhNjQ7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbmF2LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG5hdiB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBfVUlEX1JPV0lEX1NVRkZJWDogc3RyaW5nID0gXCJfcm93XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3Blbk1haW5NZW51SGVscCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBcIi9tZXRhNjQvcHVibGljL2hlbHBcIixcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblJzc0ZlZWRzTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBcIi9yc3MvZmVlZHNcIixcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZXhwYW5kTW9yZSA9IGZ1bmN0aW9uKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvKiBJJ20gc2V0dGluZyB0aGlzIGhlcmUgc28gdGhhdCB3ZSBjYW4gY29tZSB1cCB3aXRoIGEgd2F5IHRvIG1ha2UgdGhlIGFiYnJldiBleHBhbmQgc3RhdGUgYmUgcmVtZW1iZXJlZCwgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMgaXMgbG93ZXIgcHJpb3JpdHkgZm9yIG5vdywgc28gaSdtIG5vdCB1c2luZyBpdCB5ZXQgKi9cclxuICAgICAgICAgICAgbWV0YTY0LmV4cGFuZGVkQWJicmV2Tm9kZUlkc1tub2RlSWRdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3QsIGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2U+KFwiZXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZFxyXG4gICAgICAgICAgICB9LCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJWQUw6IFwiK0pTT04uc3RyaW5naWZ5KHJlcy5ub2RlSW5mbykpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlSW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGlzcGxheWluZ0hvbWUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50VmlzaWJsZVRvVXNlciA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIWRpc3BsYXlpbmdIb21lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwTGV2ZWxSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIGlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghcmVzIHx8ICFyZXMubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gZGF0YSBpcyB2aXNpYmxlIHRvIHlvdSBhYm92ZSB0aGlzIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZChpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZVcExldmVsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcmVudFZpc2libGVUb1VzZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBhdCByb290LiBDYW4ndCBnbyB1cC5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiAxLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogZmFsc2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBMZXZlbFJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZERvbUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIitub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZFBvbHlFbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kVGhyb3coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tPbk5vZGVSb3cgcmVjaWV2ZWQgdWlkIHRoYXQgZG9lc24ndCBtYXAgdG8gYW55IG5vZGUuIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vbi1udWxsIGl0J3MgYWxyZWFkeSBkaXNwbGF5aW5nIGFuZCB3ZSBkbyBub3RoaW5nLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgdXBkYXRlTm9kZUluZm9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTm9kZSA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG5vZGUuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAgICAgKiBzaWxseSBsb29raW5nIGFzeW5jIHRpbWVyIGhlcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246IGFueSA9IHV0aWwucG9seUVsbSh1aWQgKyBcIl9zZWxcIik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlBhZ2VOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmhvbWVOb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2UHVibGljSG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJlZnMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJlZnMge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsb3NlQWNjb3VudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiT2ggTm8hXCIsIFwiQ2xvc2UgeW91ciBBY2NvdW50PzxwPiBBcmUgeW91IHN1cmU/XCIsIFwiWWVzLCBDbG9zZSBBY2NvdW50LlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9uZSBtb3JlIENsaWNrXCIsIFwiWW91ciBkYXRhIHdpbGwgYmUgZGVsZXRlZCBhbmQgY2FuIG5ldmVyIGJlIHJlY292ZXJlZC48cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNsb3NlQWNjb3VudFJlcXVlc3QsIGpzb24uQ2xvc2VBY2NvdW50UmVzcG9uc2U+KFwiY2xvc2VBY2NvdW50XCIsIHt9LCBjbG9zZUFjY291bnRSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcm9wcy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwcm9wcyB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc2V0RGF0YUljb25Vc2luZ0lkKFwiI2VkaXRNb2RlQnV0dG9uXCIsIGVkaXRNb2RlID8gXCJlZGl0XCIgOlxyXG4gICAgICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgICAgICAvLyB2YXIgZWxtID0gJChcIiNwcm9wc1RvZ2dsZUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAgICAgKiBub2RlIGFuZCBwdXRzIGl0IG9uIHRoZSB0b3AsIGFuZCB0aGVuIGRvZXMgc2FtZSBmb3IgJ2pjdENuc3QuVEFHUydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlciA9IGZ1bmN0aW9uKHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRJZHg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnSWR4OiBudW1iZXIgPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5DT05URU5UKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFnSWR4ID0gcHJvcHNOZXcuaW5kZXhPZkl0ZW1CeVByb3AoXCJuYW1lXCIsIGpjckNuc3QuVEFHUyk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHByb3BzTmV3LmFycmF5TW92ZUl0ZW0odGFnSWR4LCB0YXJnZXRJZHgrKyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogcHJvcGVydGllcyB3aWxsIGJlIG51bGwgb3IgYSBsaXN0IG9mIFByb3BlcnR5SW5mbyBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcGVydHkubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLW5hbWUtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BlcnR5Lm5hbWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmluYXJ5UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gXCJbYmluYXJ5XVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS5odG1sVmFsdWUgPyBwcm9wZXJ0eS5odG1sVmFsdWUgOiBwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZCArPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtdmFsLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSArPSByZW5kZXIudGFnKFwidHJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtcm93XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcENvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInRhYmxlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlclwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcGVydHktdGFibGVcIlxyXG4gICAgICAgICAgICAgICAgfSwgdGFibGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBicnV0ZSBmb3JjZSBzZWFyY2hlcyBvbiBub2RlIChOb2RlSW5mby5qYXZhKSBvYmplY3QgcHJvcGVydGllcyBsaXN0LCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgcHJvcGVydHlcclxuICAgICAgICAgKiAoUHJvcGVydHlJbmZvLmphdmEpIHdpdGggbmFtZSBtYXRjaGluZyBwcm9wZXJ0eU5hbWUsIGVsc2UgbnVsbC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IGpzb24uUHJvcGVydHlJbmZvIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBub2RlLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5VmFsID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gZ2V0Tm9kZVByb3BlcnR5KHByb3BlcnR5TmFtZSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBrbm93IHdobyBvd25zIHRoaXMgbm9kZSBhc3N1bWUgdGhlIGFkbWluIG93bnMgaXQuXHJcbiAgICAgICAgICAgIGlmICghY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkQnkgPSBcImFkbWluXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFRoaXMgaXMgT1IgY29uZGl0aW9uIGJlY2F1c2Ugb2YgY3JlYXRlZEJ5IGlzIG51bGwgd2UgYXNzdW1lIHdlIGRvIG5vdCBvd24gaXQgKi9cclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSA9PSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHByb3BlcnR5IHZhbHVlLCBldmVuIGlmIG11bHRpcGxlIHByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZSB8fCBwcm9wZXJ0eS52YWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0xOiBtYWtlIHN1cmUgdGhpcyB3cmFwSHRtbCBpc24ndCBjcmVhdGluZyBhbiB1bm5lY2Vzc2FyeSBESVYgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIud3JhcEh0bWwocHJvcGVydHkuaHRtbFZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICQuZWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGNuc3QuQlI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcmVuZGVyLmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgcG9zdFRhcmdldFVybDtcclxuZGVjbGFyZSB2YXIgcHJldHR5UHJpbnQ7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcmVuZGVyIHtcclxuICAgICAgICBsZXQgZGVidWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBjb250ZW50IGRpc3BsYXllZCB3aGVuIHRoZSB1c2VyIHNpZ25zIGluLCBhbmQgd2Ugc2VlIHRoYXQgdGhleSBoYXZlIG5vIGNvbnRlbnQgYmVpbmcgZGlzcGxheWVkLiBXZVxyXG4gICAgICAgICAqIHdhbnQgdG8gZ2l2ZSB0aGVtIHNvbWUgaW5zdHJ1Y3Rpb25zIGFuZCB0aGUgYWJpbGl0eSB0byBhZGQgY29udGVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgZ2V0RW1wdHlQYWdlUHJvbXB0ID0gZnVuY3Rpb24oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPHA+VGhlcmUgYXJlIG5vIHN1Ym5vZGVzIHVuZGVyIHRoaXMgbm9kZS4gPGJyPjxicj5DbGljayAnRURJVCBNT0RFJyBhbmQgdGhlbiB1c2UgdGhlICdBREQnIGJ1dHRvbiB0byBjcmVhdGUgY29udGVudC48L3A+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQmluYXJ5ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGUuYmluYXJ5SXNJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VJbWFnZVRhZyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgYW4gaW1hZ2Ugd2UgcmVuZGVyIGEgbGluayB0byB0aGUgYXR0YWNobWVudCwgc28gdGhhdCBpdCBjYW4gYmUgZG93bmxvYWRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuY2hvcjogc3RyaW5nID0gdGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJocmVmXCI6IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpXHJcbiAgICAgICAgICAgICAgICB9LCBcIltEb3dubG9hZCBBdHRhY2htZW50XVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYmluYXJ5LWxpbmtcIlxyXG4gICAgICAgICAgICAgICAgfSwgYW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQgbGl0dGxlIG1ldGhvZCBoZXJlLiBBbGwgR1VJIHBhZ2UvZGl2cyBhcmUgY3JlYXRlZCB1c2luZyB0aGlzIHNvcnQgb2Ygc3BlY2lmaWNhdGlvbiBoZXJlIHRoYXQgdGhleVxyXG4gICAgICAgICAqIGFsbCBtdXN0IGhhdmUgYSAnYnVpbGQnIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCBmaXJzdCB0aW1lIG9ubHksIGFuZCB0aGVuIHRoZSAnaW5pdCcgbWV0aG9kIGNhbGxlZCBiZWZvcmUgZWFjaFxyXG4gICAgICAgICAqIHRpbWUgdGhlIGNvbXBvbmVudCBnZXRzIGRpc3BsYXllZCB3aXRoIG5ldyBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmICdkYXRhJyBpcyBwcm92aWRlZCwgdGhpcyBpcyB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpZFBhZ2UgPSBmdW5jdGlvbihwZywgZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkUGFnZTogcGcuZG9tSWQ9XCIgKyBwZy5kb21JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBnLmJ1aWx0IHx8IGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHBnLmJ1aWxkKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGcuaW5pdCkge1xyXG4gICAgICAgICAgICAgICAgcGcuaW5pdChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlsZFJvd0hlYWRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoOiBib29sZWFuLCBzaG93TmFtZTogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhlYWRlclRleHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXYgY2xhc3M9J3BhdGgtZGlzcGxheSc+UGF0aDogXCIgKyBmb3JtYXRQYXRoKG5vZGUpICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXY+XCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChjb21tZW50QnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNvbW1lbnQgQnk6IFwiICsgY29tbWVudEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5jcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKG5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5DcmVhdGVkIEJ5OiBcIiArIG5vZGUuY3JlYXRlZEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBpZD0nb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCArIFwiJz48L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIiAgTW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBjb21tZW50aW5nOiBJIGRlY2lkZWQgdXNlcnMgd2lsbCB1bmRlcnN0YW5kIHRoZSBwYXRoIGFzIGEgc2luZ2xlIGxvbmcgZW50aXR5IHdpdGggbGVzcyBjb25mdXNpb24gdGhhblxyXG4gICAgICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIk5hbWU6IFwiICsgbm9kZS5uYW1lICsgXCIgW3VpZD1cIiArIG5vZGUudWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhlYWRlci10ZXh0XCJcclxuICAgICAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyVGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUGVnZG93biBtYXJrZG93biBwcm9jZXNzb3Igd2lsbCBjcmVhdGUgPGNvZGU+IGJsb2NrcyBhbmQgdGhlIGNsYXNzIGlmIHByb3ZpZGVkLCBzbyBpbiBvcmRlciB0byBnZXQgZ29vZ2xlXHJcbiAgICAgICAgICogcHJldHRpZmllciB0byBwcm9jZXNzIGl0IHRoZSByZXN0IG9mIHRoZSB3YXkgKHdoZW4gd2UgY2FsbCBwcmV0dHlQcmludCgpIGZvciB0aGUgd2hvbGUgcGFnZSkgd2Ugbm93IHJ1blxyXG4gICAgICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmplY3RDb2RlRm9ybWF0dGluZyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghY29udGVudCkgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgICAgIC8vIGBgYGpzXHJcbiAgICAgICAgICAgIC8vIHZhciB4ID0gMTA7XHJcbiAgICAgICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgICAgIC8vIGBgYFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBpZiAoY29udGVudC5jb250YWlucyhcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbmNvZGVMYW5ndWFnZXMoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPC9jb2RlPlwiLCBcIjwvcHJlPlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdFN1YnN0aXR1dGlvbnMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudC5yZXBsYWNlQWxsKFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbmNvZGVMYW5ndWFnZXMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICAgICAqIHNvbWV3aGVyZSwgYW5kIGZpbGwgb3V0IGEgbG90IG1vcmUgZmlsZSB0eXBlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjxjb2RlIGNsYXNzPVxcXCJcIiArIGxhbmdzW2ldICsgXCJcXFwiPlwiLCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGU+XCIsIFwiPHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWZ0ZXIgYSBwcm9wZXJ0eSwgb3Igbm9kZSBpcyB1cGRhdGVkIChzYXZlZCkgd2UgY2FuIG5vdyBjYWxsIHRoaXMgbWV0aG9kIGluc3RlYWQgb2YgcmVmcmVzaGluZyB0aGUgZW50aXJlIHBhZ2VcclxuICAgICAgICB3aGljaCBpcyB3aGF0J3MgZG9uZSBpbiBtb3N0IG9mIHRoZSBhcHAsIHdoaWNoIGlzIG11Y2ggbGVzcyBlZmZpY2llbnQgYW5kIHNuYXBweSB2aXN1YWxseSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaE5vZGVPblBhZ2UgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBsb29rdXAgdWlkIGZyb20gTm9kZUluZm8uaWQgdGhlbiBzZXQgdGhlIGNvbnRlbnQgb2YgdGhpcyBkaXYuXHJcbiAgICAgICAgICAgIC8vXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgLy90byB0aGUgdmFsdWUgZnJvbSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtZXRhNjQuaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZUlkIFwiICsgbm9kZS5pZCArIFwiIGluIHVpZCBtYXBcIjtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHVpZCAhPSBub2RlLnVpZCkgdGhyb3cgXCJ1aWQgY2hhbmdlZCB1bmV4cGVjdGx5IGFmdGVyIGluaXROb2RlXCI7XHJcbiAgICAgICAgICAgIGxldCByb3dDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHVpZCArIFwiX2NvbnRlbnRcIikuaHRtbChyb3dDb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZW5kZXJzIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB3aW5kb3cuIFRoZSByZW5kZXJpbmcgaW4gaGVyZSBpcyB2ZXJ5IGNlbnRyYWwgdG8gdGhlXHJcbiAgICAgICAgICogYXBwIGFuZCBpcyB3aGF0IHRoZSB1c2VyIHNlZXMgY292ZXJpbmcgOTAlIG9mIHRoZSBzY3JlZW4gbW9zdCBvZiB0aGUgdGltZS4gVGhlIFwiY29udGVudCogbm9kZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiB0b2RvLTA6IFJhdGhlciB0aGFuIGhhdmluZyB0aGlzIG5vZGUgcmVuZGVyZXIgaXRzZWxmIGJlIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgYWxsIHRoZSBkaWZmZXJlbnQgdHlwZXNcclxuICAgICAgICAgKiBvZiBub2RlcywgbmVlZCBhIG1vcmUgcGx1Z2dhYmxlIGRlc2lnbiwgd2hlcmUgcmVuZGVpbmcgb2YgZGlmZmVyZW50IHRoaW5ncyBpcyBkZWxldGFnZWQgdG8gc29tZVxyXG4gICAgICAgICAqIGFwcHJvcHJpYXRlIG9iamVjdC9zZXJ2aWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQ29udGVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluLCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJldDogc3RyaW5nID0gZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMjogZW5hYmxlIGhlYWRlclRleHQgd2hlbiBhcHByb3ByaWF0ZSBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd01ldGFEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gc2hvd0hlYWRlciA/IGJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkgOiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNob3dQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlbmRlckNvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNwZWNpYWwgUmVuZGVyaW5nIGZvciBTZWFyY2ggUmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkpTT05fRklMRV9TRUFSQ0hfUkVTVUxULCBub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSByZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIE5vZGVzIHRoYXQgaGF2ZSBhIHBsdWdpbi1yZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZnVuYyhub2RlLCByb3dTdHlsaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcHJvcHMucmVuZGVyUHJvcGVydHkoY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gXCI8ZGl2PlwiICsgamNyQ29udGVudCArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnNlcnZlck1hcmtkb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkIHVzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoQWxzbyBuZWVkIHRvIG1ha2UgdGhpcyBhIGNvbmZpZ3VyYWJsZSBvcHRpb24sIGJlY2F1c2Ugb3RoZXIgY2xvbmVzIG9mIG1ldGE2NCBkb24ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3YW50IG15IGdpdGh1YiBsaW5rISlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIGRlY2lkZWQgZm9yIG5vdyBJIGRvbid0IHdhbnQgdG8gc2hvdyB0aGUgZm9yay1tZS1vbi1naXRodWIgaW1hZ2UgYXQgdXBwZXIgcmlnaHQgb2YgYXBwLCBidXQgdW5jb21tZW50aW5nIHRoaXMgbGluZSBpcyBhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoYXQncyByZXF1aXJlZCB0byBicmluZyBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1wiPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZycgY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIitcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSBzcGVudCBob3VycyB0cnlpbmcgdG8gZ2V0IG1hcmtlZC1lbGVtZW50IHRvIHdvcmsuIFVuc3VjY2Vzc2Z1bCBzdGlsbCwgc28gSSBqdXN0IGhhdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogc2VydmVyTWFya2Rvd24gZmxhZyB0aGF0IEkgY2FuIHNldCB0byB0cnVlLCBhbmQgdHVybiB0aGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIG9mZiBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogYWx0ZXJuYXRlIGF0dHJpYnV0ZSB3YXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnQgPSBqY3JDb250ZW50LnJlcGxhY2VBbGwoXCInXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInt7cXVvdH19XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2Rvd249J1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICsgXCInPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwgamNyLWNvbnRlbnQnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPC9kaXY+PC9tYXJrZWQtZWxlbWVudD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwic2NyaXB0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dC9tYXJrZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGlmIChqY3JDb250ZW50Lmxlbmd0aCA+IDApIHsgaWYgKHJvd1N0eWxpbmcpIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLWNvbnRlbnRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBqY3JDb250ZW50KTsgfSBlbHNlIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLXJvb3QtY29udGVudFwiIH0sIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yIHRoaXMgLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLiBcIjxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCIgKyBqY3JDb250ZW50KTsgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiUm9vdCBOb2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXM6IHN0cmluZyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVuZGVyQmluICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmluYXJ5OiBzdHJpbmcgPSByZW5kZXJCaW5hcnkobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgdXNlciBoYXMgcHV0IHt7aW5zZXJ0LWF0dGFjaG1lbnR9fSBpZiB0aGV5IGFyZSB1c2luZyB0aGF0IHRvIG1ha2UgdGhlIGltYWdlIGFwcGVhciBpbiBhIHNwZWNpZmljXHJcbiAgICAgICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChyZXQuY29udGFpbnMoY25zdC5JTlNFUlRfQVRUQUNITUVOVCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQucmVwbGFjZUFsbChjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gYmluYXJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnczogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuVEFHUywgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidGFncy1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiVGFnczogXCIgKyB0YWdzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKGpzb25Db250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjogXCIgKyBqc29uQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdDogYW55W10gPSBKU09OLnBhcnNlKGpzb25Db250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN5c3RlbUZpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LCBlbnRyeS5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbE9wZW5MaW5rID0gdGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBcIm02NC5tZXRhNjQub3BlblN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkxvY2FsIE9wZW5cIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRvd25sb2FkTGluayA9IHRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogXCJtNjQubWV0YTY0LmRvd25sb2FkU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRG93bmxvYWRcIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmtzRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB9LCBsb2NhbE9wZW5MaW5rICsgZG93bmxvYWRMaW5rKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZpbGVOYW1lRGl2ICsgbGlua3NEaXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJyZW5kZXIgZmFpbGVkXCIsIGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiW3JlbmRlciBmYWlsZWRdXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAgICAgKiBjb250ZW50LiBUaGlzIGdlbmVyYXRlcyB0aGUgSFRNTCBmb3IgYSBzaW5nbGUgcm93L25vZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSBpbmRleCA+IDAgJiYgcm93Q291bnQgPiAxO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSBpbmRleCA8IGNvdW50IC0gMTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnP1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gZWRpdGluZ0FsbG93ZWQ9XCIrZWRpdGluZ0FsbG93ZWQpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaWYgbm90IHNlbGVjdGVkIGJ5IGJlaW5nIHRoZSBuZXcgY2hpbGQsIHRoZW4gd2UgdHJ5IHRvIHNlbGVjdCBiYXNlZCBvbiBpZiB0aGlzIG5vZGUgd2FzIHRoZSBsYXN0IG9uZVxyXG4gICAgICAgICAgICAgKiBjbGlja2VkIG9uIGZvciB0aGlzIHBhZ2UuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRlc3Q6IFtcIiArIHBhcmVudElkVG9Gb2N1c0lkTWFwW2N1cnJlbnROb2RlSWRdXHJcbiAgICAgICAgICAgIC8vICtcIl09PVtcIisgbm9kZS5pZCArIFwiXVwiKVxyXG4gICAgICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSAoZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFySHRtbFJldDogc3RyaW5nID0gbWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3dcIiArIChzZWxlY3RlZCA/IFwiIGFjdGl2ZS1yb3dcIiA6IFwiIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWQsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IGJrZ1N0eWxlXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhckh0bWxSZXQgKyB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93Tm9kZVVybCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgbXVzdCBmaXJzdCBjbGljayBvbiBhIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBub2RlLnBhdGguc3RyaXBJZlN0YXJ0c1dpdGgoXCIvcm9vdFwiKTtcclxuICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgcGF0aDtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IFwiVVJMIHVzaW5nIHBhdGg6IDxicj5cIiArIHVybDtcclxuICAgICAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcImpjcjp1dWlkXCIsIG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBcIjxwPlVSTCBmb3IgVVVJRDogPGJyPlwiICsgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgdXVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VG9wUmlnaHRJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy50b3AucmlnaHQnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nVGFnOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgICAgIHRvcFJpZ2h0SW1nVGFnID0gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiB0b3BSaWdodEltZyxcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidG9wLXJpZ2h0LWltYWdlXCJcclxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUmlnaHRJbWdUYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCa2dJbWFnZVN0eWxlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWdTdHlsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGJrZ0ltZykge1xyXG4gICAgICAgICAgICAgICAgYmtnSW1nU3R5bGUgPSBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcIiArIGJrZ0ltZyArIFwiKTtcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmtnSW1nU3R5bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNlbnRlcmVkQnV0dG9uQmFyID0gZnVuY3Rpb24oYnV0dG9ucz86IHN0cmluZywgY2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0IFwiICsgY2xhc3Nlc1xyXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnV0dG9uQmFyID0gZnVuY3Rpb24oYnV0dG9uczogc3RyaW5nLCBjbGFzc2VzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsZWZ0LWp1c3RpZmllZCBsYXlvdXQgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBzZWxCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZVVwQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIG5vZGUudWlkICsgXCInKTtcIiAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYub3Blbk5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgICAgICogaW50ZWxsaWdlbmNlIHRvIHdoZW4gdG8gc2hvdyB0aGVzZSBidXR0b25zIG9yIG5vdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvL3BhZGRpbmcgaXMgYSBiYWNrIGhhY2sgdG8gbWFrZSBjaGVja2JveCBsaW5lIHVwIHdpdGggb3RoZXIgaWNvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL1wiaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0Lmluc2VydE5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy11cHdhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZVVwKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhZGROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gbWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VIb3Jpem9udGFsRmllbGRTZXQgPSBmdW5jdGlvbihjb250ZW50Pzogc3RyaW5nLCBleHRyYUNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCIgKyAoZXh0cmFDbGFzc2VzID8gKFwiIFwiICsgZXh0cmFDbGFzc2VzKSA6IFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcnpDb250cm9sR3JvdXAgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUmFkaW9CdXR0b24gPSBmdW5jdGlvbihsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkXHJcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBub2RlSWQgKHNlZSBtYWtlTm9kZUlkKCkpIE5vZGVJbmZvIG9iamVjdCBoYXMgJ2hhc0NoaWxkcmVuJyB0cnVlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSGFzQ2hpbGRyZW4gPSBmdW5jdGlvbih1aWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIG5vZGVIYXNDaGlsZHJlbjogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZm9ybWF0UGF0aCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgaW5qZWN0IHNwYWNlIGluIGhlcmUgc28gdGhpcyBzdHJpbmcgY2FuIHdyYXAgYW5kIG5vdCBhZmZlY3Qgd2luZG93IHNpemVzIGFkdmVyc2VseSwgb3IgbmVlZCBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZUFsbChcIi9cIiwgXCIgLyBcIik7XHJcbiAgICAgICAgICAgIGxldCBzaG9ydFBhdGg6IHN0cmluZyA9IHBhdGgubGVuZ3RoIDwgNTAgPyBwYXRoIDogcGF0aC5zdWJzdHJpbmcoMCwgNDApICsgXCIuLi5cIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBub1Jvb3RQYXRoOiBzdHJpbmcgPSBzaG9ydFBhdGg7XHJcbiAgICAgICAgICAgIGlmIChub1Jvb3RQYXRoLnN0YXJ0c1dpdGgoXCIvcm9vdFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBzaG9ydFBhdGggOiBub1Jvb3RQYXRoO1xyXG4gICAgICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JhcEh0bWwgPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlbmRlcnMgcGFnZSBhbmQgYWx3YXlzIGFsc28gdGFrZXMgY2FyZSBvZiBzY3JvbGxpbmcgdG8gc2VsZWN0ZWQgbm9kZSBpZiB0aGVyZSBpcyBvbmUgdG8gc2Nyb2xsIHRvXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQYWdlRnJvbURhdGEgPSBmdW5jdGlvbihkYXRhPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibTY0LnJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKFwiTm8gY29udGVudCBpcyBhdmFpbGFibGUgaGVyZS5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudWlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZGVudFRvVWlkTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEknbSBjaG9vc2luZyB0byByZXNldCBzZWxlY3RlZCBub2RlcyB3aGVuIGEgbmV3IHBhZ2UgbG9hZHMsIGJ1dCB0aGlzIGlzIG5vdCBhIHJlcXVpcmVtZW50LiBJIGp1c3RcclxuICAgICAgICAgICAgICAgICAqIGRvbid0IGhhdmUgYSBcImNsZWFyIHNlbGVjdGlvbnNcIiBmZWF0dXJlIHdoaWNoIHdvdWxkIGJlIG5lZWRlZCBzbyB1c2VyIGhhcyBhIHdheSB0byBjbGVhciBvdXQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUoZGF0YS5ub2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzID8gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOT1RFOiBtYWluTm9kZUNvbnRlbnQgaXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYWdlIGNvbnRlbnQsIGFuZCBpcyBhbHdheXMgdGhlIG5vZGUgZGlzcGxheWVkIGF0IHRoZSB0b1xyXG4gICAgICAgICAgICAgKiBvZiB0aGUgcGFnZSBhYm92ZSBhbGwgdGhlIG90aGVyIG5vZGVzIHdoaWNoIGFyZSBpdHMgY2hpbGQgbm9kZXMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbWFpbk5vZGVDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluTm9kZUNvbnRlbnQ6IFwiK21haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWFpbk5vZGVDb250ZW50Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbkJhcjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkQ29tbWVudE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKGRhdGEubm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkTm9kZT1cIitwcm9wcy5pc05vbk93bmVkTm9kZShkYXRhLm5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJ1wiICsgZGF0YS5ub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9pY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJpZFwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJ1bkVkaXROb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcm93SGVhZGVyID0gYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgLy8gJCgnI21haW5Ob2RlQ29udGVudCcpLmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd0NvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkQ291bnQ6IG51bWJlciA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGlsZENvdW50OiBcIiArIGNoaWxkQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb25cclxuICAgICAgICAgICAgICAgICAqIHRoZSBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBkYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3c6IHN0cmluZyA9IGdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvd0NvdW50ID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gZ2V0RW1wdHlQYWdlUHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIG91dHB1dCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmNvZGVGb3JtYXREaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcImFcIikuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFRPRE8tMzogSW5zdGVhZCBvZiBjYWxsaW5nIHNjcmVlblNpemVDaGFuZ2UgaGVyZSBpbW1lZGlhdGVseSwgaXQgd291bGQgYmUgYmV0dGVyIHRvIHNldCB0aGUgaW1hZ2Ugc2l6ZXNcclxuICAgICAgICAgICAgICogZXhhY3RseSBvbiB0aGUgYXR0cmlidXRlcyBvZiBlYWNoIGltYWdlLCBhcyB0aGUgSFRNTCB0ZXh0IGlzIHJlbmRlcmVkIGJlZm9yZSB3ZSBldmVuIGNhbGxcclxuICAgICAgICAgICAgICogc2V0SHRtbCwgc28gdGhhdCBpbWFnZXMgYWx3YXlzIGFyZSBHVUFSQU5URUVEIHRvIHJlbmRlciBjb3JyZWN0bHkgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuc2NyZWVuU2l6ZUNoYW5nZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCkpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJvdyA9IGZ1bmN0aW9uKGk6IG51bWJlciwgbm9kZToganNvbi5Ob2RlSW5mbywgbmV3RGF0YTogYm9vbGVhbiwgY2hpbGRDb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGp1c3RJbWFnZVNpemUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBlbG0uYXR0cihcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2hpY2ggd2Ugd2FudCwgYnV0IHRoZW4gd2UgYWxzbyBsaW1pdCBpdCB3aXRoIG1heC13aWR0aCBzbyBvbiBzbWFsbGVyIHNjcmVlbiBkZXZpY2VzIG9yIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIERPIE5PVCBERUxFVEUgKGZvciBhIGxvbmcgdGltZSBhdCBsZWFzdCkgVGhpcyBpcyB0aGUgb2xkIGxvZ2ljIGZvciByZXNpemluZyBpbWFnZXMgcmVzcG9uc2l2ZWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPVxcXCJcIiArIHYgKyBcIlxcXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiPlwiICsgY29udGVudCArIFwiPC9cIiArIHRhZyArIFwiPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiLz5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVRleHRBcmVhID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlRWRpdEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUGFzc3dvcmRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmliczogT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGRvbUlkIGlzIGlkIG9mIGRpYWxvZyBiZWluZyBjbG9zZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQmFja0J1dHRvbiA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgZG9tSWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5jYW5jZWxEaWFsb2coJ1wiICsgZG9tSWQgKyBcIicpO1wiICsgY2FsbGJhY2tcclxuICAgICAgICAgICAgfSwgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93UHJvcGVydHlUb0Rpc3BsYXkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0W3Byb3BOYW1lXSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1JlYWRPbmx5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0JpbmFyeVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmJpbmFyeVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IFwic2ltcGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2guanNcIik7XHJcblxyXG4vKlxyXG4gKiB0b2RvLTM6IHRyeSB0byByZW5hbWUgdG8gJ3NlYXJjaCcsIGJ1dCByZW1lbWJlciB5b3UgaGFkIGluZXhwbGlhYmxlIHByb2JsZW1zIHRoZSBmaXJzdCB0aW1lIHlvdSB0cmllZCB0byB1c2UgJ3NlYXJjaCdcclxuICogYXMgdGhlIHZhciBuYW1lLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNyY2gge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudW1TZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoICE9IG51bGwgPyAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogamNyQ25zdC5DT05URU5UXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBqY3JDbnN0LkNPTlRFTlRcclxuICAgICAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRTZWFyY2hOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlID0gZnVuY3Rpb24oZGF0YSwgdmlld05hbWUpIHtcclxuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAgICAgKiBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhLnNlYXJjaFJlc3VsdHMsIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHZpZXdOYW1lLCBvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIGEgc2luZ2xlIGxpbmUgb2Ygc2VhcmNoIHJlc3VsdHMgb24gdGhlIHNlYXJjaCByZXN1bHRzIHBhZ2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhckh0bWwgPSBtYWtlQnV0dG9uQmFySHRtbChcIlwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbC8vXHJcbiAgICAgICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfc3JjaF9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICAgICAgdmFyIGdvdG9CdXR0b24gPSByZW5kZXIubWFrZUJ1dHRvbihcIkdvIHRvIE5vZGVcIiwgdWlkLCBcIm02NC5zcmNoLmNsaWNrU2VhcmNoTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uU2VhcmNoUmVzdWx0Um93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpIHtcclxuICAgICAgICAgICAgdW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0Um93Tm9kZSA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja1NlYXJjaE5vZGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgdWlkIGluIHNlYXJjaCByZXN1bHRzOiBcIiArIHVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUsIHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIHN0eWxpbmcgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgIHZhciBub2RlSWQgPSBoaWdobGlnaHRSb3dOb2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8qIGNoYW5nZSBjbGFzcyBvbiBlbGVtZW50ICovXHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2hhcmUuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc2hhcmUge1xyXG5cclxuICAgICAgICBsZXQgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hhcmluZ05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZVNoYXJpbmcgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFNoYXJpbmdEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaW5kU2hhcmVkTm9kZXMgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNoYXJlZE5vZGVzUmVxdWVzdCwganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlPihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHVzZXIuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXNlciB7XHJcblxyXG4gICAgICAgIGxldCBsb2dvdXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmb3IgdGVzdGluZyBwdXJwb3NlcywgSSB3YW50IHRvIGFsbG93IGNlcnRhaW4gdXNlcnMgYWRkaXRpb25hbCBwcml2aWxlZ2VzLiBBIGJpdCBvZiBhIGhhY2sgYmVjYXVzZSBpdCB3aWxsIGdvXHJcbiAgICAgICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1Rlc3RVc2VyQWNjb3VudCA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJib2JcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gQlJBTkRJTkdfVElUTEVfU0hPUlQ7XHJcblxyXG4gICAgICAgICAgICAvKiB0b2RvLTA6IElmIHVzZXJzIGdvIHdpdGggdmVyeSBsb25nIHVzZXJuYW1lcyB0aGlzIGlzIGdvbm5hIGJlIHVnbHkgKi9cclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgKz0gXCI6XCIgKyByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRPRE8tMzogbW92ZSB0aGlzIGludG8gbWV0YTY0IG1vZHVsZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlSWQgPSByZXMucm9vdE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lID0gcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZSA9IHJlcy5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICAgICAgbWV0YTY0LmFsbG93RmlsZVN5c3RlbVNlYXJjaCA9IHJlcy5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2g7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzID0gcmVzLnVzZXJQcmVmZXJlbmNlcztcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5hZHZhbmNlZE1vZGUgPyBtZXRhNjQuTU9ERV9BRFZBTkNFRCA6IG1ldGE2NC5NT0RFX1NJTVBMRTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHJlcy51c2VyUHJlZmVyZW5jZXMuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIHNlcnZlcjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uPVwiICsgbWV0YTY0LmVkaXRNb2RlT3B0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblNpZ251cFBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdyaXRlIGEgY29va2llIHRoYXQgZXhwaXJlcyBpbiBhIHllYXIgZm9yIGFsbCBwYXRocyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JpdGVDb29raWUgPSBmdW5jdGlvbihuYW1lLCB2YWwpOiB2b2lkIHtcclxuICAgICAgICAgICAgJC5jb29raWUobmFtZSwgdmFsLCB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHVnbHkuIEl0IGlzIHRoZSBidXR0b24gdGhhdCBjYW4gYmUgbG9naW4gKm9yKiBsb2dvdXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTG9naW5QZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbG9naW5EbGc6IExvZ2luRGxnID0gbmV3IExvZ2luRGxnKCk7XHJcbiAgICAgICAgICAgIGxvZ2luRGxnLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTG9naW4gPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYWxsVXNyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBjYWxsUHdkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCB1c2luZ0Nvb2tpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobG9naW5TZXNzaW9uUmVhZHkgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IHRydWVcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogdXNpbmcgYmxhbmsgY3JlZGVudGlhbHMgd2lsbCBjYXVzZSBzZXJ2ZXIgdG8gbG9vayBmb3IgYSB2YWxpZCBzZXNzaW9uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSBmYWxzZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbG9naW5TdGF0ZTogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHdlIGhhdmUga25vd24gc3RhdGUgYXMgbG9nZ2VkIG91dCwgdGhlbiBkbyBub3RoaW5nIGhlcmUgKi9cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVzcjogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgIGxldCBwd2Q6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXNpbmdDb29raWVzID0gIXV0aWwuZW1wdHlTdHJpbmcodXNyKSAmJiAhdXRpbC5lbXB0eVN0cmluZyhwd2QpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb29raWVVc2VyPVwiICsgdXNyICsgXCIgdXNpbmdDb29raWVzID0gXCIgKyB1c2luZ0Nvb2tpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBlbXB5dCBjcmVkZW50aWFscyBjYXVzZXMgc2VydmVyIHRvIHRyeSB0byBsb2cgaW4gd2l0aCBhbnkgYWN0aXZlIHNlc3Npb24gY3JlZGVudGlhbHMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IHB3ZCA/IHB3ZCA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY2FsbFVzcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogY2FsbFVzcixcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IGNhbGxQd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaExvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dvdXQgPSBmdW5jdGlvbih1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ291dFJlcXVlc3QsIGpzb24uTG9nb3V0UmVzcG9uc2U+KFwibG9nb3V0XCIsIHt9LCBsb2dvdXRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luID0gZnVuY3Rpb24obG9naW5EbGcsIHVzciwgcHdkKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNyLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIHVzciwgcHdkLCBudWxsLCBsb2dpbkRsZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBbGxVc2VyQ29va2llcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLkxvZ2luUmVzcG9uc2UsIHVzcj86IHN0cmluZywgcHdkPzogc3RyaW5nLCB1c2luZ0Nvb2tpZXM/OiBib29sZWFuLCBsb2dpbkRsZz86IExvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkxvZ2luXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW5SZXNwb25zZTogdXNyPVwiICsgdXNyICsgXCIgaG9tZU5vZGVPdmVycmlkZTogXCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHVzciAhPSBcImFub255bW91c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSLCB1c3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCwgcHdkKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIxXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpbkRsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZTogXCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZSBpcyBudWxsLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBzZXQgSUQgdG8gYmUgdGhlIHBhZ2Ugd2Ugd2FudCB0byBzaG93IHVzZXIgcmlnaHQgYWZ0ZXIgbG9naW4gKi9cclxuICAgICAgICAgICAgICAgIGxldCBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuZW1wdHlTdHJpbmcocmVzLmhvbWVOb2RlT3ZlcnJpZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMuaG9tZU5vZGVPdmVycmlkZTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgbGFzdE5vZGU9XCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZUlkPVwiICsgbWV0YTY0LmhvbWVOb2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKGlkLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkNvb2tpZSBsb2dpbiBmYWlsZWQuXCIpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYmxvdyBhd2F5IGZhaWxlZCBjb29raWUgY3JlZGVudGlhbHMgYW5kIHJlbG9hZCBwYWdlLCBzaG91bGQgcmVzdWx0IGluIGJyYW5kIG5ldyBwYWdlIGxvYWQgYXMgYW5vblxyXG4gICAgICAgICAgICAgICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgICAgICBsZXQgcmVmcmVzaExvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHZpZXcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdmlldyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZVN0YXR1c0JhciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNMaW5lID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiY291bnQ6IFwiICsgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiIFNlbGVjdGlvbnM6IFwiICsgdXRpbC5nZXRQcm9wZXJ0eUNvdW50KG1ldGE2NC5zZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIgd2hpY2gsIGlmIHN1cHBsaWVkLCBzaG91bGQgYmUgdGhlIGlkIHdlIHNjcm9sbCB0byB3aGVuIGZpbmFsbHkgZG9uZSB3aXRoIHRoZVxyXG4gICAgICAgICAqIHJlbmRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgdGFyZ2V0SWQ/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldElkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZCh0YXJnZXRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbmV3SWQgaXMgb3B0aW9uYWwgYW5kIGlmIHNwZWNpZmllZCBtYWtlcyB0aGUgcGFnZSBzY3JvbGwgdG8gYW5kIGhpZ2hsaWdodCB0aGF0IG5vZGUgdXBvbiByZS1yZW5kZXJpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZSA9IGZ1bmN0aW9uKG5vZGVJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBoaWdobGlnaHRJZD86IGFueSwgaXNJbml0aWFsUmVuZGVyPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGVJZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZUlkID0gbWV0YTY0LmN1cnJlbnROb2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVmcmVzaGluZyB0cmVlOiBub2RlSWQ9XCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodElkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IGN1cnJlbnRTZWxOb2RlICE9IG51bGwgPyBjdXJyZW50U2VsTm9kZS5pZCA6IG5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiByZW5kZXJQYXJlbnRJZkxlYWYgPyB0cnVlIDogZmFsc2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIGhpZ2hsaWdodElkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNJbml0aWFsUmVuZGVyICYmIG1ldGE2NC51cmxDbWQgPT0gXCJhZGROb2RlXCIgJiYgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXRNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShtZXRhNjQuY3VycmVudE5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZG8tMzogdGhpcyBzY3JvbGxpbmcgaXMgc2xpZ2h0bHkgaW1wZXJmZWN0LiBzb21ldGltZXMgdGhlIGNvZGUgc3dpdGNoZXMgdG8gYSB0YWIsIHdoaWNoIHRyaWdnZXJzXHJcbiAgICAgICAgICogc2Nyb2xsVG9Ub3AsIGFuZCB0aGVuIHNvbWUgb3RoZXIgY29kZSBzY3JvbGxzIHRvIGEgc3BlY2lmaWMgbG9jYXRpb24gYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlci4gdGhlXHJcbiAgICAgICAgICogJ3BlbmRpbmcnIGJvb2xlYW4gaGVyZSBpcyBhIGNydXRjaCBmb3Igbm93IHRvIGhlbHAgdmlzdWFsIGFwcGVhbCAoaS5lLiBzdG9wIGlmIGZyb20gc2Nyb2xsaW5nIHRvIG9uZSBwbGFjZVxyXG4gICAgICAgICAqIGFuZCB0aGVuIHNjcm9sbGluZyB0byBhIGRpZmZlcmVudCBwbGFjZSBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbG06IGFueSA9IG5hdi5nZXRTZWxlY3RlZFBvbHlFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGZpbmQgYSBzZWxlY3RlZCBub2RlIG9uIHRoaXMgcGFnZSwgc2Nyb2xsIHRvXHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgaW5zdGVhZC5cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAvL3RvZG8tMDogcmVtb3ZlZCBtYWluUGFwZXJUYWJzIGZyb20gdmlzaWJpbGl0eSwgYnV0IHdoYXQgY29kZSBzaG91bGQgZ28gaGVyZSBub3c/XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiBUaGUgZm9sbG93aW5nIHdhcyBpbiBhIHBvbHltZXIgZXhhbXBsZSAoY2FuIEkgdXNlIHRoaXM/KTogYXBwLiQuaGVhZGVyUGFuZWxNYWluLnNjcm9sbFRvVG9wKHRydWUpO1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9Ub3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IG5vdCB1c2luZyBtYWluUGFwZXJUYWJzIGFueSBsb25nZXIgc28gc2h3IHNob3VsZCBnbyBoZXJlIG5vdyA/XHJcbiAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgZWxtOiBhbnkgPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0RWRpdFBhdGhEaXNwbGF5QnlJZCA9IGZ1bmN0aW9uKGRvbUlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBlZGl0LmVkaXROb2RlO1xyXG4gICAgICAgICAgICBsZXQgZTogYW55ID0gJChcIiNcIiArIGRvbUlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICBlLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoRGlzcGxheSA9IFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IERvIHdlIHJlYWxseSBuZWVkIElEIGluIGFkZGl0aW9uIHRvIFBhdGggaGVyZT9cclxuICAgICAgICAgICAgICAgIC8vIHBhdGhEaXNwbGF5ICs9IFwiPGJyPklEOiBcIiArIG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERpc3BsYXkgKz0gXCI8YnI+TW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5odG1sKHBhdGhEaXNwbGF5KTtcclxuICAgICAgICAgICAgICAgIGUuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dTZXJ2ZXJJbmZvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNlcnZlckluZm9SZXF1ZXN0LCBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZT4oXCJnZXRTZXJ2ZXJJbmZvXCIsIHt9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcocmVzLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZW51UGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWVudVBhbmVsIHtcclxuXHJcbiAgICAgICAgbGV0IG1ha2VUb3BMZXZlbE1lbnUgPSBmdW5jdGlvbih0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBhcGVySXRlbUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibWVudS10cmlnZ2VyXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXBlckl0ZW0gPSByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCBwYXBlckl0ZW1BdHRycywgdGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcGVyU3VibWVudUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB0aXRsZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAoPGFueT5wYXBlclN1Ym1lbnVBdHRycykuaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1zdWJtZW51XCIsIHBhcGVyU3VibWVudUF0dHJzXHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1ldGE2NC1tZW51LWhlYWRpbmdcIixcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0XCJcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLCBwYXBlckl0ZW0gKyAvL1wiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VTZWNvbmRMZXZlbExpc3QgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgLy8sXHJcbiAgICAgICAgICAgICAgICAvL1wibXVsdGlcIjogXCJtdWx0aVwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1lbnVJdGVtID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrXHJcbiAgICAgICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRvbUlkOiBzdHJpbmcgPSBcIm1haW5BcHBNZW51XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEkgZW5kZWQgdXAgbm90IHJlYWxseSBsaWtpbmcgdGhpcyB3YXkgb2Ygc2VsZWN0aW5nIHRhYnMuIEkgY2FuIGp1c3QgdXNlIG5vcm1hbCBwb2x5bWVyIHRhYnMuXHJcbiAgICAgICAgICAgIC8vIHZhciBwYWdlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ21haW5UYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwic2VhcmNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZVBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYigndGltZWxpbmVUYWJOYW1lJyk7XCIpO1xyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZlZWRzXCIsIFwibWFpbk1lbnVSc3NcIiwgXCJtNjQubmF2Lm9wZW5Sc3NGZWVkc05vZGUoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1ha2VUb3BMZXZlbE1lbnUoXCJSU1NcIiwgcnNzSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVcIiwgXCJjcmVhdGVOb2RlQnV0dG9uXCIsIFwibTY0LmVkaXQuY3JlYXRlTm9kZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCBcIihuZXcgbTY0LlJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZVwiLCBcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuZGVsZXRlU2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwibTY0LmVkaXQuY2xlYXJTZWxlY3Rpb25zKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW1wb3J0XCIsIFwib3BlbkltcG9ydERsZ1wiLCBcIihuZXcgbTY0LkltcG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRXhwb3J0XCIsIFwib3BlbkV4cG9ydERsZ1wiLCBcIihuZXcgbTY0LkV4cG9ydERsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgZWRpdE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiRWRpdFwiLCBlZGl0TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3V0XCIsIFwibW92ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUGFzdGVcIiwgXCJmaW5pc2hNb3ZpbmdTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmZpbmlzaE1vdmluZ1NlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBcIiwgXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVVcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRvd25cIiwgXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBUb3BcIiwgXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb1RvcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcInRvIEJvdHRvbVwiLCBcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVRvQm90dG9tKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJNb3ZlXCIsIG1vdmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBGaWxlXCIsIFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbUZpbGVEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21VcmxEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGUgQXR0YWNobWVudFwiLCBcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkF0dGFjaFwiLCBhdHRhY2htZW50TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaGFyaW5nTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRWRpdCBOb2RlIFNoYXJpbmdcIiwgXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgXCJtNjQuc2hhcmUuZWRpdE5vZGVTaGFyaW5nKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmluZCBTaGFyZWQgU3Vibm9kZXNcIiwgXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgXCJtNjQuc2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2hhcmVcIiwgc2hhcmluZ01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ29udGVudFwiLCBcImNvbnRlbnRTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogbWFrZSBhIHZlcnNpb24gb2YgdGhlIGRpYWxvZyB0aGF0IGRvZXMgYSB0YWcgc2VhcmNoXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlRhZ3NcIiwgXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hUYWdzRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGaWxlc1wiLCBcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hGaWxlc0RsZygpKS5vcGVuKCk7XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2VhcmNoXCIsIHNlYXJjaE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVkXCIsIFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1vZGlmaWVkXCIsIFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlNb2RUaW1lKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVGltZWxpbmVcIiwgdGltZWxpbmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVG9nZ2xlIFByb3BlcnRpZXNcIiwgXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBcIm02NC5wcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQucmVmcmVzaCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwibTY0LnJlbmRlci5zaG93Tm9kZVVybCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlByZWZlcmVuY2VzXCIsIFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsIFwiKG5ldyBtNjQuUHJlZnNEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYnVnOiBzZXJ2ZXIgaW5mbyBtZW51IGl0ZW0gaXMgc2hvd2luZyB1cCAoYWx0aG91Z2ggY29ycmVjdGx5IGRpc2FibGVkKSBmb3Igbm9uLWFkbWluIHVzZXJzLlxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTZXJ2ZXIgSW5mb1wiLCBcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIFwibTY0LnZpZXcuc2hvd1NlcnZlckluZm8oKTtcIik7IC8vXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVmlld1wiLCB2aWV3T3B0aW9uc01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgbTY0LkNoYW5nZVBhc3N3b3JkRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYW5hZ2UgQWNjb3VudFwiLCBcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgXCIobmV3IG02NC5NYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJJbnNlcnQgQm9vazogV2FyIGFuZCBQZWFjZVwiLCBcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBcIm02NC5lZGl0Lmluc2VydEJvb2tXYXJBbmRQZWFjZSgpO1wiKTsgLy9cclxuICAgICAgICAgICAgLy8gbWVudUl0ZW0oXCJGdWxsIFJlcG9zaXRvcnkgRXhwb3J0XCIsIFwiZnVsbFJlcG9zaXRvcnlFeHBvcnRcIiwgXCJcclxuICAgICAgICAgICAgLy8gZWRpdC5mdWxsUmVwb3NpdG9yeUV4cG9ydCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkbWluSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJHZW5lcmF0ZSBSU1NcIiwgXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBcIm02NC5wb2RjYXN0LmdlbmVyYXRlUlNTKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgYWRtaW5NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFkbWluXCIsIGFkbWluSXRlbXMsIFwiYWRtaW5NZW51XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1haW4gTWVudSBIZWxwXCIsIFwibWFpbk1lbnVIZWxwXCIsIFwibTY0Lm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAvKiBwYWdlTWVudSsgKi8gbWFpbk1lbnVSc3MgKyBlZGl0TWVudSArIG1vdmVNZW51ICsgYXR0YWNobWVudE1lbnUgKyBzaGFyaW5nTWVudSArIHZpZXdPcHRpb25zTWVudSArIHNlYXJjaE1lbnUgKyB0aW1lbGluZU1lbnUgKyBteUFjY291bnRNZW51XHJcbiAgICAgICAgICAgICAgICArIGFkbWluTWVudSArIG1haW5NZW51SGVscDtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChkb21JZCwgY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHBvZGNhc3QuanNcIik7XG5cbi8qXG5OT1RFOiBUaGUgQXVkaW9QbGF5ZXJEbGcgQU5EIHRoaXMgc2luZ2xldG9uLWlzaCBjbGFzcyBib3RoIHNoYXJlIHNvbWUgc3RhdGUgYW5kIGNvb3BlcmF0ZVxuXG5SZWZlcmVuY2U6IGh0dHBzOi8vd3d3LnczLm9yZy8yMDEwLzA1L3ZpZGVvL21lZGlhZXZlbnRzLmh0bWxcbiovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIHBvZGNhc3Qge1xuICAgICAgICBleHBvcnQgbGV0IHBsYXllcjogYW55ID0gbnVsbDtcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIgPSBudWxsO1xuXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcbiAgICAgICAgbGV0IGFkU2VnbWVudHM6IEFkU2VnbWVudFtdID0gbnVsbDtcblxuICAgICAgICBsZXQgcHVzaFRpbWVyOiBhbnkgPSBudWxsO1xuXG4gICAgICAgIGV4cG9ydCBsZXQgZ2VuZXJhdGVSU1MgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdlbmVyYXRlUlNTUmVxdWVzdCwganNvbi5HZW5lcmF0ZVJTU1Jlc3BvbnNlPihcImdlbmVyYXRlUlNTXCIsIHtcbiAgICAgICAgICAgIH0sIGdlbmVyYXRlUlNTUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGdlbmVyYXRlUlNTUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGFsZXJ0KCdyc3MgY29tcGxldGUuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZlZWROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHRpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgZGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZERlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgaW1nVXJsOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIiwgbm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBmZWVkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgICAgIH0sIHRpdGxlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICAgICAgfSwgZGVzYy52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGZlZWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmZWVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGltZ1VybCkge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiaW1nXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1heC13aWR0aDogMzAwcHg7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IGltZ1VybC52YWx1ZVxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRW50cnlOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzRGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbURlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzQXV0aG9yOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc0xpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgZW50cnk6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChyc3NMaW5rLnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIi5tcDNcIikgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAocnNzVGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImgzXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgfSwgcnNzVGl0bGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5vcGVuUGxheWVyRGlhbG9nKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIlBsYXlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHJlZlwiOiByc3NMaW5rLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgcmVuZGVyLnRhZyhcImgzXCIsIHt9LCByc3NUaXRsZS52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocnNzRGVzYykge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCByc3NEZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyc3NBdXRob3IgJiYgcnNzQXV0aG9yLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgXCJCeTogXCIgKyByc3NBdXRob3IudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBlbnRyeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblBsYXllckRpYWxvZyA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdWlkID0gX3VpZDtcbiAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XG5cbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJzc0xpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChyc3NMaW5rICYmIHJzc0xpbmsudmFsdWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiLm1wM1wiKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRQbGF5ZXJJbmZvUmVxdWVzdCwganNvbi5HZXRQbGF5ZXJJbmZvUmVzcG9uc2U+KFwiZ2V0UGxheWVySW5mb1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiOiByc3NMaW5rLnZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRQbGF5ZXJJbmZvUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VWlkKHVpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGxnID0gbmV3IEF1ZGlvUGxheWVyRGxnKHJzc0xpbmsudmFsdWUsIHVpZCwgcmVzLnRpbWVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VWlkID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBhZFNlZ3M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwiYWQtc2VnbWVudHNcIiwgbm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFkU2Vncykge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFRleHQoYWRTZWdzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZSB1aWQ6IFwiICsgdWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VGV4dCA9IGZ1bmN0aW9uKGFkU2Vnczogc3RyaW5nKSB7XG4gICAgICAgICAgICBhZFNlZ21lbnRzID0gW107XG5cbiAgICAgICAgICAgIGxldCBzZWdMaXN0OiBzdHJpbmdbXSA9IGFkU2Vncy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBzZWdMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlZ1RpbWVzOiBzdHJpbmdbXSA9IHNlZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ1RpbWVzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHJhbmdlOiBcIiArIHNlZyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBiZWdpblNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMF0pO1xuICAgICAgICAgICAgICAgIGxldCBlbmRTZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzFdKTtcblxuICAgICAgICAgICAgICAgIGFkU2VnbWVudHMucHVzaChuZXcgQWRTZWdtZW50KGJlZ2luU2VjcywgZW5kU2VjcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogY29udmVydCBmcm9tIGZvbXJhdCBcIm1pbnV0ZXM6c2Vjb250c1wiIHRvIGFic29sdXRlIG51bWJlciBvZiBzZWNvbmRzXG4gICAgICAgICpcbiAgICAgICAgKiB0b2RvLTA6IG1ha2UgdGhpcyBhY2NlcHQganVzdCBzZWNvbmRzLCBvciBtaW46c2VjLCBvciBob3VyOm1pbjpzZWMsIGFuZCBiZSBhYmxlIHRvXG4gICAgICAgICogcGFyc2UgYW55IG9mIHRoZW0gY29ycmVjdGx5LlxuICAgICAgICAqL1xuICAgICAgICBsZXQgY29udmVydFRvU2Vjb25kcyA9IGZ1bmN0aW9uKHRpbWVWYWw6IHN0cmluZykge1xuICAgICAgICAgICAgLyogZW5kIHRpbWUgaXMgZGVzaWduYXRlZCB3aXRoIGFzdGVyaXNrIGJ5IHVzZXIsIGFuZCByZXByZXNlbnRlZCBieSAtMSBpbiB2YXJpYWJsZXMgKi9cbiAgICAgICAgICAgIGlmICh0aW1lVmFsID09ICcqJykgcmV0dXJuIC0xO1xuICAgICAgICAgICAgbGV0IHRpbWVQYXJ0czogc3RyaW5nW10gPSB0aW1lVmFsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICAgIGlmICh0aW1lUGFydHMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSB2YWx1ZTogXCIgKyB0aW1lVmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzBdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzFdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyAqIDYwICsgc2Vjb25kcztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVzdG9yZVN0YXJ0VGltZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogbWFrZXMgcGxheWVyIGFsd2F5cyBzdGFydCB3aGVyZXZlciB0aGUgdXNlciBsYXN0IHdhcyB3aGVuIHRoZXkgY2xpY2tlZCBcInBhdXNlXCIgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgc3RhcnRUaW1lUGVuZGluZykge1xuICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHN0YXJ0VGltZVBlbmRpbmc7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lUGVuZGluZyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9uQ2FuUGxheSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgcGxheWVyID0gZWxtO1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25UaW1lVXBkYXRlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBpZiAoIXB1c2hUaW1lcikge1xuICAgICAgICAgICAgICAgIC8qIHBpbmcgc2VydmVyIG9uY2UgcGVyIG1pbnV0ZSAqL1xuICAgICAgICAgICAgICAgIHB1c2hUaW1lciA9IHNldEludGVydmFsKHB1c2hUaW1lckZ1bmN0aW9uLCAxMDAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ3VycmVudFRpbWU9XCIgKyBlbG0uY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgcGxheWVyID0gZWxtO1xuXG4gICAgICAgICAgICAvKiB0b2RvLTE6IHdlIGNhbGwgcmVzdG9yZVN0YXJ0VGltZSB1cG9uIGxvYWRpbmcgb2YgdGhlIGNvbXBvbmVudCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGhhdmUgdGhlIGVmZmVjdCBkb2luZyBhbnl0aGluZyBhdCBhbGxcbiAgICAgICAgICAgIGFuZCBjYW4ndCBldmVuIHVwZGF0ZSB0aGUgc2xpZGVyIGRpc3BsYXllZCBwb3NpdGlvbiwgdW50aWwgcGxheWlucyBpcyBTVEFSVEVELiBOZWVkIHRvIGNvbWUgYmFjayBhbmQgZml4IHRoaXMgYmVjYXVzZSB1c2Vyc1xuICAgICAgICAgICAgY3VycmVudGx5IGhhdmUgdGhlIGdsaXRjaCBvZiBhbHdheXMgaGVhcmluZyB0aGUgZmlyc3QgZnJhY3Rpb24gb2YgYSBzZWNvbmQgb2YgdmlkZW8sIHdoaWNoIG9mIGNvdXJzZSBhbm90aGVyIHdheSB0byBmaXhcbiAgICAgICAgICAgIHdvdWxkIGJlIGJ5IGFsdGVyaW5nIHRoZSB2b2x1bW4gdG8gemVybyB1bnRpbCByZXN0b3JlU3RhcnRUaW1lIGhhcyBnb25lIGludG8gZWZmZWN0ICovXG4gICAgICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG5cbiAgICAgICAgICAgIGlmICghYWRTZWdtZW50cykgcmV0dXJuO1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnIG9mIGFkU2VnbWVudHMpIHtcbiAgICAgICAgICAgICAgICAvKiBlbmRUaW1lIG9mIC0xIG1lYW5zIHRoZSByZXN0IG9mIHRoZSBtZWRpYSBzaG91bGQgYmUgY29uc2lkZXJlZCBBRHMgKi9cbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmN1cnJlbnRUaW1lID49IHNlZy5iZWdpblRpbWUgJiYgLy9cbiAgICAgICAgICAgICAgICAgICAgKHBsYXllci5jdXJyZW50VGltZSA8PSBzZWcuZW5kVGltZSB8fCBzZWcuZW5kVGltZSA8IDApKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoganVtcCB0byBlbmQgb2YgYXVkaW8gaWYgcmVzdCBpcyBhbiBhZGQsIHdpdGggbG9naWMgb2YgLTMgdG8gZW5zdXJlIHdlIGRvbid0XG4gICAgICAgICAgICAgICAgICAgIGdvIGludG8gYSBsb29wIGp1bXBpbmcgdG8gZW5kIG92ZXIgYW5kIG92ZXIgYWdhaW4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlZy5lbmRUaW1lIDwgMCAmJiBwbGF5ZXIuY3VycmVudFRpbWUgPCBwbGF5ZXIuZHVyYXRpb24gLSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGxhc3QgdG8gc2Vjb25kcyBvZiBhdWRpbywgaSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgcGF1c2luZywgaW4gY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXJlIGFyZSBpcyBtb3JlIGF1ZGlvIGF1dG9tYXRpY2FsbHkgYWJvdXQgdG8gcGxheSwgd2UgZG9uJ3Qgd2FudCB0byBoYWx0IGl0IGFsbCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHBsYXllci5kdXJhdGlvbiAtIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogb3IgZWxzZSB3ZSBhcmUgaW4gYSBjb21lcmNpYWwgc2VnbWVudCBzbyBqdW1wIHRvIG9uZSBzZWNvbmQgcGFzdCBpdCAqL1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHNlZy5lbmRUaW1lICsgMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvLTA6IGZvciBwcm9kdWN0aW9uLCBib29zdCB0aGlzIHVwIHRvIG9uZSBtaW51dGUgKi9cbiAgICAgICAgZXhwb3J0IGxldCBwdXNoVGltZXJGdW5jdGlvbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwdXNoVGltZXJcIik7XG4gICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgICAgLyogdGhlIHB1cnBvc2Ugb2YgdGhpcyB0aW1lciBpcyB0byBiZSBzdXJlIHRoZSBicm93c2VyIHNlc3Npb24gZG9lc24ndCB0aW1lb3V0IHdoaWxlIHVzZXIgaXMgcGxheWluZ1xuICAgICAgICAgICAgYnV0IGlmIHRoZSBtZWRpYSBpcyBwYXVzZWQgd2UgRE8gYWxsb3cgaXQgdG8gdGltZW91dC4gT3Rod2Vyd2lzZSBpZiB1c2VyIGlzIGxpc3RlbmluZyB0byBhdWRpbywgd2VcbiAgICAgICAgICAgIGNvbnRhY3QgdGhlIHNlcnZlciBkdXJpbmcgdGhpcyB0aW1lciB0byB1cGRhdGUgdGhlIHRpbWUgb24gdGhlIHNlcnZlciBBTkQga2VlcCBzZXNzaW9uIGZyb20gdGltaW5nIG91dFxuXG4gICAgICAgICAgICB0b2RvLTA6IHdvdWxkIGV2ZXJ5dGhpbmcgd29yayBpZiAncGxheWVyJyBXQVMgdGhlIGpxdWVyeSBvYmplY3QgYWx3YXlzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgIXBsYXllci5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvKiB0aGlzIHNhZmV0eSBjaGVjayB0byBiZSBzdXJlIG5vIGhpZGRlbiBhdWRpbyBjYW4gc3RpbGwgYmUgcGxheWluZyBzaG91bGQgbm8gbG9uZ2VyIGJlIG5lZWRlZFxuICAgICAgICAgICAgICAgIG5vdyB0aGF0IEkgaGF2ZSB0aGUgY2xvc2UgbGl0ZW5lciBldmVuIG9uIHRoZSBkaWFsb2csIGJ1dCBpJ2xsIGxlYXZlIHRoaXMgaGVyZSBhbnl3YXkuIENhbid0IGh1cnQuICovXG4gICAgICAgICAgICAgICAgaWYgKCEkKHBsYXllcikuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NpbmcgcGxheWVyLCBiZWNhdXNlIGl0IHdhcyBkZXRlY3RlZCBhcyBub3QgdmlzaWJsZS4gcGxheWVyIGRpYWxvZyBnZXQgaGlkZGVuP1wiKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJBdXRvc2F2ZSBwbGF5ZXIgaW5mby5cIik7XG4gICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBwb2RjYXN0IGhhbmRsaW5nIGhhY2sgaXMgb25seSBpbiB0aGlzIGZpbGUgdGVtcG9yYXJpbHlcbiAgICAgICAgZXhwb3J0IGxldCBwYXVzZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGRlc3Ryb3lQbGF5ZXIgPSBmdW5jdGlvbihkbGc6IEF1ZGlvUGxheWVyRGxnKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxQbGF5ZXIgPSAkKHBsYXllcik7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUGxheWVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkbGcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRsZy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDc1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHBsYXkgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzcGVlZCA9IGZ1bmN0aW9uKHJhdGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5YmFja1JhdGUgPSByYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IHNraXAgPSBmdW5jdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lICs9IGRlbHRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzYXZlUGxheWVySW5mbyA9IGZ1bmN0aW9uKHVybDogc3RyaW5nLCB0aW1lT2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikgcmV0dXJuO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXRQbGF5ZXJJbmZvUmVxdWVzdCwganNvbi5TZXRQbGF5ZXJJbmZvUmVzcG9uc2U+KFwic2V0UGxheWVySW5mb1wiLCB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogdXJsLFxuICAgICAgICAgICAgICAgIFwidGltZU9mZnNldFwiOiB0aW1lT2Zmc2V0LFxuICAgICAgICAgICAgICAgIFwibm9kZVBhdGhcIjogbm9kZS5wYXRoXG4gICAgICAgICAgICB9LCBzZXRQbGF5ZXJJbmZvUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNldFBsYXllckluZm9SZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgLy9hbGVydCgnc2F2ZSBjb21wbGV0ZS4nKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubTY0Lm1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzZmVlZFwiXSA9IG02NC5wb2RjYXN0LnJlbmRlckZlZWROb2RlO1xubTY0Lm1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6cnNzaXRlbVwiXSA9IG02NC5wb2RjYXN0LnJlbmRlckVudHJ5Tm9kZTtcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IERpYWxvZ0Jhc2UuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIC8qXG4gICAgICogQmFzZSBjbGFzcyBmb3IgYWxsIGRpYWxvZyBib3hlcy5cbiAgICAgKlxuICAgICAqIHRvZG86IHdoZW4gcmVmYWN0b3JpbmcgYWxsIGRpYWxvZ3MgdG8gdGhpcyBuZXcgYmFzZS1jbGFzcyBkZXNpZ24gSSdtIGFsd2F5c1xuICAgICAqIGNyZWF0aW5nIGEgbmV3IGRpYWxvZyBlYWNoIHRpbWUsIHNvIHRoZSBuZXh0IG9wdGltaXphdGlvbiB3aWxsIGJlIHRvIG1ha2VcbiAgICAgKiBjZXJ0YWluIGRpYWxvZ3MgKGluZGVlZCBtb3N0IG9mIHRoZW0pIGJlIGFibGUgdG8gYmVoYXZlIGFzIHNpbmdsZXRvbnMgb25jZVxuICAgICAqIHRoZXkgaGF2ZSBiZWVuIGNvbnN0cnVjdGVkIHdoZXJlIHRoZXkgbWVyZWx5IGhhdmUgdG8gYmUgcmVzaG93biBhbmRcbiAgICAgKiByZXBvcHVsYXRlZCB0byByZW9wZW4gb25lIG9mIHRoZW0sIGFuZCBjbG9zaW5nIGFueSBvZiB0aGVtIGlzIG1lcmVseSBkb25lIGJ5XG4gICAgICogbWFraW5nIHRoZW0gaW52aXNpYmxlLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBkYXRhOiBhbnk7XG4gICAgICAgIGJ1aWx0OiBib29sZWFuO1xuICAgICAgICBndWlkOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvbUlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2UgcmVnaXN0ZXIgJ3RoaXMnIHNvIHdlIGNhbiBkbyBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogYXMgc3RyaW5ncy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICAgICAgYW55IGRlZmF1bHRzIG9yIHZhbHVlcyBpbiBmb3IgZmllbGRzLCBldGMuIHNob3VsZCBiZSBzZXQgd2hlbiB0aGUgZGlhbG9nIGlzIGRpc3BsYXllZCAqL1xuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VFdmVudCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGlzLmlkKHRoaXMuZG9tSWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICAgICAqIG9uY2UgaXQncyBjbG9zZWQsIEFORCB0aGF0IHNhbWUgY29kZSBzaG91bGQgZGVsZXRlIHRoZSBndWlkJ3Mgb2JqZWN0IGluXG4gICAgICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFwZXItZGlhbG9nXCIpO1xuXG4gICAgICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgICAgICAvL25vZGUuc2V0QXR0cmlidXRlKFwid2l0aC1iYWNrZHJvcFwiLCBcIndpdGgtYmFja2Ryb3BcIik7XG5cbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMzogcHV0IGluIENTUyBub3dcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcblxuICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcbiAgICAgICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGxldCBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKGlkKTtcblxuICAgICAgICAgICAgLy9pIHRyaWVkIHRvIHR3ZWFrIHRoZSBwbGFjZW1lbnQgb2YgdGVoIGRpYWxvZyB1c2luZyBmaXRJbnRvLCBhbmQgaXQgZGlkbid0IHdvcmtcbiAgICAgICAgICAgIC8vc28gSSdtIGp1c3QgdXNpbmcgdGhlIHBhcGVyLWRpYWxvZyBDU1Mgc3R5bGluZyB0byBhbHRlciB0aGUgZGlhbG9nIHNpemUgdG8gZnVsbHNjcmVlblxuICAgICAgICAgICAgLy9sZXQgaXJvblBhZ2VzID0gdXRpbC5wb2x5RWxtKFwibWFpbklyb25QYWdlc1wiKTtcblxuICAgICAgICAgICAgLy9BZnRlciB0aGUgVHlwZVNjcmlwdCBjb252ZXJzaW9uIEkgbm90aWNlZCBoYXZpbmcgYSBtb2RhbCBmbGFnIHdpbGwgY2F1c2VcbiAgICAgICAgICAgIC8vYW4gaW5maW5pdGUgbG9vcCAoY29tcGxldGVseSBoYW5nKSBDaHJvbWUgYnJvd3NlciwgYnV0IHRoaXMgaXNzdWUgaXMgbW9zdCBsaWtlbHlcbiAgICAgICAgICAgIC8vbm90IHJlbGF0ZWQgdG8gVHlwZVNjcmlwdCBhdCBhbGwsIGJ1dCBpJ20ganVzdCBtZW50aW9uIFRTIGp1c3QgaW4gY2FzZSwgYmVjYXVzZVxuICAgICAgICAgICAgLy90aGF0J3Mgd2hlbiBJIG5vdGljZWQgaXQuIERpYWxvZ3MgYXJlIGZpbmUgYnV0IG5vdCBhIGRpYWxvZyBvbiB0b3Agb2YgYW5vdGhlciBkaWFsb2csIHdoaWNoIGlzXG4gICAgICAgICAgICAvL3RoZSBjYXNlIHdoZXJlIGl0IGhhbmdzIGlmIG1vZGVsPXRydWVcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5ub0NhbmNlbE9uT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmhvcml6b250YWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuZml0SW50byA9IGlyb25QYWdlcy5ub2RlO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY29uc3RyYWluKCk7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5vcGVuKCk7XG5cbiAgICAgICAgICAgIC8vdmFyIGRpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkRpYWxvZycpO1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpcm9uLW92ZXJsYXktY2xvc2VkJywgZnVuY3Rpb24oY3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL3ZhciBpZCA9ICg8YW55PmN1c3RvbUV2ZW50LmN1cnJlbnRUYXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKiogRGlhbG9nOiBcIiArIGlkICsgXCIgaXMgY2xvc2VkIVwiKTtcbiAgICAgICAgICAgICAgICB0aGl6LmNsb3NlRXZlbnQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIC8vICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIC8vIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kbzogbmVlZCB0byBjbGVhbnVwIHRoZSByZWdpc3RlcmVkIElEcyB0aGF0IGFyZSBpbiBtYXBzIGZvciB0aGlzIGRpYWxvZyAqL1xuICAgICAgICBwdWJsaWMgY2FuY2VsKCkge1xuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuY2FuY2VsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGdldCB0aGUgdHJ1ZSBpZCB0aGF0IGlzIHNwZWNpZmljIHRvIHRoaXMgZGlhbG9nIChpLmUuIGd1aWRcbiAgICAgICAgICogc3VmZml4IGFwcGVuZGVkKVxuICAgICAgICAgKi9cbiAgICAgICAgaWQgPSAoaWQpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIC8qIGlmIGRpYWxvZyBhbHJlYWR5IHN1ZmZpeGVkICovXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCJfZGxnSWRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQgKyBcIl9kbGdJZFwiICsgdGhpcy5kYXRhLmd1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlUGFzc3dvcmRGaWVsZCh0ZXh0LCB0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VNZXNzYWdlQXJlYSA9IChtZXNzYWdlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLW1lc3NhZ2VcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicFwiLCBhdHRycywgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2RvOiB0aGVyZSdzIGEgbWFrZUJ1dHRvbiAoYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcykgdGhhdCBkb24ndCBoYXZlIHRoZVxuICAgICAgICAvLyBlbmNvZGVDYWxsYmFjayBjYXBhYmlsaXR5IHlldFxuICAgICAgICBtYWtlQnV0dG9uID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSwgY3R4PzogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUNsb3NlQnV0dG9uID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s/OiBhbnksIGN0eD86IGFueSwgaW5pdGlhbGx5VmlzaWJsZT86IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuXG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIC8vIHdhcm5pbmc6IHRoaXMgZGlhbG9nLWNvbmZpcm0gaXMgcmVxdWlyZWQgKGxvZ2ljIGZhaWxzIHdpdGhvdXQpXG4gICAgICAgICAgICAgICAgXCJkaWFsb2ctY29uZmlybVwiOiBcImRpYWxvZy1jb25maXJtXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IG9uQ2xpY2sgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb25DbGljayA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvbkNsaWNrICs9IFwiO1wiICsgbWV0YTY0LmVuY29kZU9uQ2xpY2sodGhpcy5jYW5jZWwsIHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAob25DbGljaykge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gb25DbGljaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluaXRpYWxseVZpc2libGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcInN0eWxlXCJdID0gXCJkaXNwbGF5Om5vbmU7XCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kRW50ZXJLZXkgPSAoaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5iaW5kRW50ZXJLZXkodGhpcy5pZChpZCksIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldElucHV0VmFsID0gKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgICAgIHZhbCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoaWQpLCB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SHRtbCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKGlkKSwgdGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlUmFkaW9CdXR0b24gPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkXG4gICAgICAgICAgICB9LCBsYWJlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2hlY2tCb3ggPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZywgaW5pdGlhbFN0YXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG5cbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICAvL1wib25DbGlja1wiOiBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkKCk7XCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgPHBhcGVyLWNoZWNrYm94IG9uLWNoYW5nZT1cImNoZWNrYm94Q2hhbmdlZFwiPmNsaWNrPC9wYXBlci1jaGVja2JveD5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjaGVja2JveENoYW5nZWQgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAvLyAgICAgaWYoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgaWYgKGluaXRpYWxTdGF0ZSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY2hlY2tib3g6IHN0cmluZyA9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBhdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBjaGVja2JveCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgICAgIFwiZm9yXCI6IGlkXG4gICAgICAgICAgICB9LCBsYWJlbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjaGVja2JveDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VIZWFkZXIgPSAodGV4dDogc3RyaW5nLCBpZD86IHN0cmluZywgY2VudGVyZWQ/OiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLWhlYWRlciBcIiArIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vYWRkIGlkIGlmIG9uZSB3YXMgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJoMlwiLCBhdHRycywgdGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb2N1cyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgaWQgPSBcIiNcIiArIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ29uZmlybURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIENvbmZpcm1EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSB5ZXNDYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgICBwcml2YXRlIG5vQ2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICAgICAgc3VwZXIoXCJDb25maXJtRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBjb250ZW50OiBzdHJpbmcgPSB0aGlzLm1ha2VIZWFkZXIoXCJcIiwgXCJDb25maXJtRGxnVGl0bGVcIikgKyB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIlwiLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiWWVzXCIsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiLCB0aGlzLnllc0NhbGxiYWNrKVxuICAgICAgICAgICAgICAgICsgdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJOb1wiLCBcIkNvbmZpcm1EbGdOb0J1dHRvblwiLCB0aGlzLm5vQ2FsbGJhY2spO1xuICAgICAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYnV0dG9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLnRpdGxlLCBcIkNvbmZpcm1EbGdUaXRsZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLm1lc3NhZ2UsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5idXR0b25UZXh0LCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcm9ncmVzc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFByb2dyZXNzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlByb2dyZXNzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQcm9jZXNzaW5nIFJlcXVlc3RcIiwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHZhciBwcm9ncmVzc0JhciA9IHJlbmRlci50YWcoXCJwYXBlci1wcm9ncmVzc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJpbmRldGVybWluYXRlXCI6IFwiaW5kZXRlcm1pbmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCI4MDBcIixcbiAgICAgICAgICAgICAgICBcIm1pblwiOiBcIjEwMFwiLFxuICAgICAgICAgICAgICAgIFwibWF4XCI6IFwiMTAwMFwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJhckNvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoyODBweDsgbWFyZ2luOjI0cHg7XCIsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXRcIlxuICAgICAgICAgICAgfSwgcHJvZ3Jlc3NCYXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgYmFyQ29udGFpbmVyO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWVzc2FnZURsZy5qc1wiKTtcclxuXHJcbi8qXHJcbiAqIENhbGxiYWNrIGNhbiBiZSBudWxsIGlmIHlvdSBkb24ndCBuZWVkIHRvIHJ1biBhbnkgZnVuY3Rpb24gd2hlbiB0aGUgZGlhbG9nIGlzIGNsb3NlZFxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWVzc2FnZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJNZXNzYWdlRGxnXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aXRsZSkge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBcIk1lc3NhZ2VcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnRpdGxlKSArIFwiPHA+XCIgKyB0aGlzLm1lc3NhZ2UgKyBcIjwvcD5cIjtcclxuICAgICAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJPa1wiLCBcIm1lc3NhZ2VEbGdPa0J1dHRvblwiLCB0aGlzLmNhbGxiYWNrKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBMb2dpbkRsZy5qc1wiKTtcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5L2pxdWVyeS5kLnRzXCIgLz5cblxuLypcbk5vdGU6IFRoZSBqcXVlcnkgY29va2llIGxvb2tzIGZvciBqcXVlcnkgZC50cyBpbiB0aGUgcmVsYXRpdmUgbG9jYXRpb24gXCJcIi4uL2pxdWVyeVwiIHNvIGJld2FyZSBpZiB5b3VyXG50cnkgdG8gcmVvcmdhbml6ZSB0aGUgZm9sZGVyIHN0cnVjdHVyZSBJIGhhdmUgaW4gdHlwZWRlZnMsIHRoaW5ncyB3aWxsIGNlcnRhaW5seSBicmVha1xuKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIExvZ2luRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJMb2dpbkRsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTG9naW5cIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwidXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB2YXIgbG9naW5CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJMb2dpblwiLCBcImxvZ2luQnV0dG9uXCIsIHRoaXMubG9naW4sIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHJlc2V0UGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJGb3Jnb3QgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsIHRoaXMucmVzZXRQYXNzd29yZCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxMb2dpbkJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIobG9naW5CdXR0b24gKyByZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XG4gICAgICAgICAgICB2YXIgZGl2aWRlciA9IFwiPGRpdj48aDM+T3IgTG9naW4gV2l0aC4uLjwvaDM+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHZhciBmb3JtID0gZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBmb3JtO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBtYWluQ29udGVudDtcblxuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJ1c2VyTmFtZVwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwicGFzc3dvcmRcIiwgdXNlci5sb2dpbik7XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVsYXRlRnJvbUNvb2tpZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdXNyID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcbiAgICAgICAgICAgIHZhciBwd2QgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xuXG4gICAgICAgICAgICBpZiAodXNyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInVzZXJOYW1lXCIsIHVzcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHdkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInBhc3N3b3JkXCIsIHB3ZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2dpbiA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwd2QgPSB0aGlzLmdldElucHV0VmFsKFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHVzZXIubG9naW4odGhpcywgdXNyLCBwd2QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXRQYXNzd29yZCA9ICgpOiBhbnkgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcblxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBSZXNldCBQYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgIFwiUmVzZXQgeW91ciBwYXNzd29yZCA/PHA+WW91J2xsIHN0aWxsIGJlIGFibGUgdG8gbG9naW4gd2l0aCB5b3VyIG9sZCBwYXNzd29yZCB1bnRpbCB0aGUgbmV3IG9uZSBpcyBzZXQuXCIsXG4gICAgICAgICAgICAgICAgXCJZZXMsIHJlc2V0LlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBSZXNldFBhc3N3b3JkRGxnKHVzcikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2lnbnVwRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRTtcbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFX1NIT1JUO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2lnbnVwRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNpZ251cERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKEJSQU5ESU5HX1RJVExFICsgXCIgU2lnbnVwXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwic2lnbnVwVXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInNpZ251cFBhc3N3b3JkXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbFwiLCBcInNpZ251cEVtYWlsXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJDYXB0Y2hhXCIsIFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAgICAgdmFyIGNhcHRjaGFJbWFnZSA9IHJlbmRlci50YWcoXCJkaXZcIiwgLy9cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhLWltYWdlXCIgLy9cbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJpbWdcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiY2FwdGNoYUltYWdlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IFwiXCIvL1xuICAgICAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIlwiLCBmYWxzZSkpO1xuXG4gICAgICAgICAgICB2YXIgc2lnbnVwQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2lnbnVwXCIsIFwic2lnbnVwQnV0dG9uXCIsIHRoaXMuc2lnbnVwLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBuZXdDYXB0Y2hhQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiVHJ5IERpZmZlcmVudCBJbWFnZVwiLCBcInRyeUFub3RoZXJDYXB0Y2hhQnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGhpcy50cnlBbm90aGVyQ2FwdGNoYSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaWdudXBCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2lnbnVwQnV0dG9uICsgbmV3Q2FwdGNoYUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgY2FwdGNoYUltYWdlICsgYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogJChcIiNcIiArIF8uZG9tSWQgKyBcIi1tYWluXCIpLmNzcyh7IFwiYmFja2dyb3VuZEltYWdlXCIgOiBcInVybCgvaWJtLTcwMi1icmlnaHQuanBnKTtcIiBcImJhY2tncm91bmQtcmVwZWF0XCIgOlxuICAgICAgICAgICAgICogXCJuby1yZXBlYXQ7XCIsIFwiYmFja2dyb3VuZC1zaXplXCIgOiBcIjEwMCUgYXV0b1wiIH0pO1xuICAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwVXNlck5hbWVcIik7XG4gICAgICAgICAgICB2YXIgcGFzc3dvcmQgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwUGFzc3dvcmRcIik7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwRW1haWxcIik7XG4gICAgICAgICAgICB2YXIgY2FwdGNoYSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICAvKiBubyByZWFsIHZhbGlkYXRpb24geWV0LCBvdGhlciB0aGFuIG5vbi1lbXB0eSAqL1xuICAgICAgICAgICAgaWYgKCF1c2VyTmFtZSB8fCB1c2VyTmFtZS5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFjYXB0Y2hhIHx8IGNhcHRjaGEubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTb3JyeSwgeW91IGNhbm5vdCBsZWF2ZSBhbnkgZmllbGRzIGJsYW5rLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2lnbnVwUmVxdWVzdCxqc29uLlNpZ251cFJlc3BvbnNlPihcInNpZ251cFwiLCB7XG4gICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c2VyTmFtZSxcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWwsXG4gICAgICAgICAgICAgICAgXCJjYXB0Y2hhXCI6IGNhcHRjaGFcbiAgICAgICAgICAgIH0sIHRoaXMuc2lnbnVwUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2lnbnVwUmVzcG9uc2UgPSAocmVzOiBqc29uLlNpZ251cFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTaWdudXAgbmV3IHVzZXJcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAgICAgLyogY2xvc2UgdGhlIHNpZ251cCBkaWFsb2cgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFxuICAgICAgICAgICAgICAgICAgICBcIlVzZXIgSW5mb3JtYXRpb24gQWNjZXB0ZWQuPHAvPkNoZWNrIHlvdXIgZW1haWwgZm9yIHNpZ251cCBjb25maXJtYXRpb24uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiU2lnbnVwXCJcbiAgICAgICAgICAgICAgICApKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cnlBbm90aGVyQ2FwdGNoYSA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdmFyIG4gPSB1dGlsLmN1cnJlbnRUaW1lTWlsbGlzKCk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBlbWJlZCBhIHRpbWUgcGFyYW1ldGVyIGp1c3QgdG8gdGh3YXJ0IGJyb3dzZXIgY2FjaGluZywgYW5kIGVuc3VyZSBzZXJ2ZXIgYW5kIGJyb3dzZXIgd2lsbCBuZXZlciByZXR1cm4gdGhlIHNhbWVcbiAgICAgICAgICAgICAqIGltYWdlIHR3aWNlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgc3JjID0gcG9zdFRhcmdldFVybCArIFwiY2FwdGNoYT90PVwiICsgbjtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY2FwdGNoYUltYWdlXCIpKS5hdHRyKFwic3JjXCIsIHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlSW5pdFNpZ251cFBnID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy50cnlBbm90aGVyQ2FwdGNoYSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFnZUluaXRTaWdudXBQZygpO1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmlkKFwic2lnbnVwVXNlck5hbWVcIikpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUHJlZnNEbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBQcmVmc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihcIlByZWZzRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlBlZmVyZW5jZXNcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFkaW9CdXR0b25zID0gdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJTaW1wbGVcIiwgXCJlZGl0TW9kZVNpbXBsZVwiKSArIC8vXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIkFkdmFuY2VkXCIsIFwiZWRpdE1vZGVBZHZhbmNlZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWRpb0J1dHRvbkdyb3VwID0gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWdyb3VwXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIilcclxuICAgICAgICAgICAgfSwgcmFkaW9CdXR0b25zKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja0JveCA9IHRoaXMubWFrZUNoZWNrQm94KFwiU2hvdyBSb3cgTWV0YWRhdGFcIiwgXCJzaG93TWV0YURhdGFcIiwgbWV0YTY0LnNob3dNZXRhRGF0YSk7XHJcbiAgICAgICAgICAgIHZhciBjaGVja2JveEJhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChzaG93TWV0YURhdGFDaGVja0JveCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gcmFkaW9CdXR0b25Hcm91cDtcclxuXHJcbiAgICAgICAgICAgIHZhciBsZWdlbmQgPSBcIjxsZWdlbmQ+RWRpdCBNb2RlOjwvbGVnZW5kPlwiO1xyXG4gICAgICAgICAgICB2YXIgcmFkaW9CYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAobGVnZW5kICsgZm9ybUNvbnRyb2xzKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzYXZlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByZWZlcmVuY2VzQnV0dG9uXCIsIHRoaXMuc2F2ZVByZWZlcmVuY2VzLCB0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbFByZWZlcmVuY2VzRGxnQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlQnV0dG9uICsgYmFja0J1dHRvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyByYWRpb0JhciArIGNoZWNrYm94QmFyICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2F2ZVByZWZlcmVuY2VzID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSBwb2x5RWxtLm5vZGUuc2VsZWN0ZWQgPT0gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpID8gbWV0YTY0Lk1PREVfU0lNUExFXHJcbiAgICAgICAgICAgICAgICA6IG1ldGE2NC5NT0RFX0FEVkFOQ0VEO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrYm94ID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaG93TWV0YURhdGFcIikpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gc2hvd01ldGFEYXRhQ2hlY2tib3gubm9kZS5jaGVja2VkO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3QsIGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlPihcInNhdmVVc2VyUHJlZmVyZW5jZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IGJvdGggb2YgdGhlc2Ugb3B0aW9ucyBzaG91bGQgY29tZSBmcm9tIG1ldGE2NC51c2VyUHJlZmVybmNlcywgYW5kIG5vdCBiZSBzdG9yZWQgZGlyZWN0bHkgb24gbWV0YTY0IHNjb3BlLlxyXG4gICAgICAgICAgICAgICAgXCJ1c2VyUHJlZmVyZW5jZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYWR2YW5jZWRNb2RlXCI6IG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRvZG8tMTogaG93IGNhbiBJIGZsYWcgYSBwcm9wZXJ0eSBhcyBvcHRpb25hbCBpbiBUeXBlU2NyaXB0IGdlbmVyYXRvciA/IFdvdWxkIGJlIHByb2JhYmx5IHNvbWUga2luZCBvZiBqc29uL2phY2tzb24gQHJlcXVpcmVkIGFubm90YXRpb24gKi9cclxuICAgICAgICAgICAgICAgICAgICBcImxhc3ROb2RlXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZXhwb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNob3dNZXRhRGF0YVwiOiBtZXRhNjQuc2hvd01ldGFEYXRhXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZpbmcgUHJlZmVyZW5jZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMjogdHJ5IGFuZCBtYWludGFpbiBzY3JvbGwgcG9zaXRpb24gPyB0aGlzIGlzIGdvaW5nIHRvIGJlIGFzeW5jLCBzbyB3YXRjaCBvdXQuXHJcbiAgICAgICAgICAgICAgICAvLyB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zZWxlY3QobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09IG1ldGE2NC5NT0RFX1NJTVBMRSA/IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA6IHRoaXNcclxuICAgICAgICAgICAgICAgIC5pZChcImVkaXRNb2RlQWR2YW5jZWRcIikpO1xyXG5cclxuICAgICAgICAgICAgLy90b2RvLTA6IHB1dCB0aGVzZSB0d28gbGluZXMgaW4gYSB1dGlsaXR5IG1ldGhvZFxyXG4gICAgICAgICAgICBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaG93TWV0YURhdGFcIikpO1xyXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuY2hlY2tlZCA9IG1ldGE2NC5zaG93TWV0YURhdGE7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBNYW5hZ2VBY2NvdW50RGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWFuYWdlQWNjb3VudERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJNYW5hZ2VBY2NvdW50RGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk1hbmFnZSBBY2NvdW50XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbFByZWZlcmVuY2VzRGxnQnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgY2xvc2VBY2NvdW50QnV0dG9uID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gXCJBZG1pbiBDYW5ub3QgQ2xvc2UgQWNvdW50XCIgOiB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZSBBY2NvdW50XCIsIFwiY2xvc2VBY2NvdW50QnV0dG9uXCIsIFwicHJlZnMuY2xvc2VBY2NvdW50KCk7XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjbG9zZUFjY291bnRCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJvdHRvbUJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihiYWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgdmFyIGJvdHRvbUJ1dHRvbkJhckRpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNsb3NlLWFjY291bnQtYmFyXCJcclxuICAgICAgICAgICAgfSwgYm90dG9tQnV0dG9uQmFyKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBidXR0b25CYXIgKyBib3R0b21CdXR0b25CYXJEaXY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEV4cG9ydERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEV4cG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRXhwb3J0RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFeHBvcnQgdG8gWE1MXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRXhwb3J0IHRvIEZpbGUgTmFtZVwiLCBcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgICAgICB2YXIgZXhwb3J0QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRXhwb3J0XCIsIFwiZXhwb3J0Tm9kZXNCdXR0b25cIiwgdGhpcy5leHBvcnROb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFeHBvcnRCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGV4cG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIHZhciB0YXJnZXRGaWxlTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcodGFyZ2V0RmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmFtZSBmb3IgdGhlIGV4cG9ydCBmaWxlLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5FeHBvcnRSZXF1ZXN0LCBqc29uLkV4cG9ydFJlc3BvbnNlPihcImV4cG9ydFRvWG1sXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRGaWxlTmFtZVwiOiB0YXJnZXRGaWxlTmFtZVxuICAgICAgICAgICAgICAgIH0sIHRoaXMuZXhwb3J0UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0UmVzcG9uc2UgPSAocmVzOiBqc29uLkV4cG9ydFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkV4cG9ydCBTdWNjZXNzZnVsLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBJbXBvcnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBJbXBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkltcG9ydERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiSW1wb3J0IGZyb20gWE1MXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRmlsZSBuYW1lIHRvIGltcG9ydFwiLCBcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW1wb3J0QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiSW1wb3J0XCIsIFwiaW1wb3J0Tm9kZXNCdXR0b25cIiwgdGhpcy5pbXBvcnROb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxJbXBvcnRCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGltcG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1wb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VGaWxlTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzb3VyY2VGaWxlTmFtZVwiKTtcblxuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc291cmNlRmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmFtZSBmb3IgdGhlIGltcG9ydCBmaWxlLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbXBvcnRSZXF1ZXN0LGpzb24uSW1wb3J0UmVzcG9uc2U+KFwiaW1wb3J0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VGaWxlTmFtZVwiOiBzb3VyY2VGaWxlTmFtZVxuICAgICAgICAgICAgICAgIH0sIHRoaXMuaW1wb3J0UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW1wb3J0UmVzcG9uc2UgPSAocmVzOiBqc29uLkltcG9ydFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbXBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkltcG9ydCBTdWNjZXNzZnVsLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hDb250ZW50RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoQ29udGVudERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTZWFyY2hDb250ZW50RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggQ29udGVudFwiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIE9ubHkgY29udGVudCB0ZXh0IHdpbGwgYmUgc2VhcmNoZWQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaE5vZGVzQnV0dG9uXCIsIHRoaXMuc2VhcmNoTm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoTm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hUYWdzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoVGFnc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTZWFyY2hUYWdzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggVGFnc1wiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIE9ubHkgdGFncyB0ZXh0IHdpbGwgYmUgc2VhcmNoZWQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaE5vZGVzQnV0dG9uXCIsIHRoaXMuc2VhcmNoVGFncywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoRmlsZXNEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hGaWxlc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTZWFyY2hGaWxlc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIEZpbGVzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoQnV0dG9uXCIsIHRoaXMuc2VhcmNoVGFncywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaEZpbGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hGaWxlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDaGFuZ2VQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5nZVBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIHB3ZDogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJDaGFuZ2VQYXNzd29yZERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiB3aGVyZSBpdCB3aWxsIHZhbGlkYXRlIHRoZSBwYXNzQ29kZSwgYW5kIGlmIGl0J3MgdmFsaWQgdXNlIGl0IHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgcGFzc3dvcmQgY2hhbmdlIG9uIHRoZSBjb3JyZWN0XHJcbiAgICAgICAgICogdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnBhc3NDb2RlID8gXCJQYXNzd29yZCBSZXNldFwiIDogXCJDaGFuZ2UgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgICAgIH0sIFwiRW50ZXIgeW91ciBuZXcgcGFzc3dvcmQgYmVsb3cuLi5cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIk5ldyBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxDaGFuZ2VQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHdkID0gdGhpcy5nZXRJbnB1dFZhbChcImNoYW5nZVBhc3N3b3JkMVwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wd2QgJiYgdGhpcy5wd2QubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNoYW5nZVBhc3N3b3JkUmVxdWVzdCxqc29uLkNoYW5nZVBhc3N3b3JkUmVzcG9uc2U+KFwiY2hhbmdlUGFzc3dvcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibmV3UGFzc3dvcmRcIjogdGhpcy5wd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXNzQ29kZVwiOiB0aGlzLnBhc3NDb2RlXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmNoYW5nZVBhc3N3b3JkUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW52YWxpZCBwYXNzd29yZChzKS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2UgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtc2cgPSBcIlBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiPHA+WW91IG1heSBub3cgbG9naW4gYXMgPGI+XCIgKyByZXMudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICArIFwiPC9iPiB3aXRoIHlvdXIgbmV3IHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2csIFwiUGFzc3dvcmQgQ2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGl6LnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBsb2dpbiBjYWxsIERPRVMgd29yaywgYnV0IHRoZSByZWFzb24gd2UgZG9uJ3QgZG8gdGhpcyBpcyBiZWNhdXNlIHRoZSBVUkwgc3RpbGwgaGFzIHRoZSBwYXNzQ29kZSBvbiBpdCBhbmQgd2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy93YW50IHRvIGRpcmVjdCB0aGUgdXNlciB0byBhIHVybCB3aXRob3V0IHRoYXQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlci5sb2dpbihudWxsLCByZXMudXNlciwgdGhpei5wd2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFJlc2V0UGFzc3dvcmREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBSZXNldFBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUmVzZXRQYXNzd29yZERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJSZXNldCBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciB5b3VyIHVzZXIgbmFtZSBhbmQgZW1haWwgYWRkcmVzcyBhbmQgYSBjaGFuZ2UtcGFzc3dvcmQgbGluayB3aWxsIGJlIHNlbnQgdG8geW91XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbCBBZGRyZXNzXCIsIFwiZW1haWxBZGRyZXNzXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc2V0UGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlJlc2V0IG15IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVzZXRQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNldFBhc3N3b3JkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsQWRkcmVzcyA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJlbWFpbEFkZHJlc3NcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVzZXJOYW1lICYmIGVtYWlsQWRkcmVzcykge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVzZXRQYXNzd29yZFJlcXVlc3QsIGpzb24uUmVzZXRQYXNzd29yZFJlc3BvbnNlPihcInJlc2V0UGFzc3dvcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidXNlclwiOiB1c2VyTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5yZXNldFBhc3N3b3JkUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uUmVzZXRQYXNzd29yZFJlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlc2V0IHBhc3N3b3JkXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBhc3N3b3JkIHJlc2V0IGVtYWlsIHdhcyBzZW50LiBDaGVjayB5b3VyIGluYm94LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdGhpcy51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgRHJvcHpvbmU7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRGcm9tRmlsZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRm9yIG5vdyBJIGp1c3QgaGFyZC1jb2RlIGluIDcgZWRpdCBmaWVsZHMsIGJ1dCB3ZSBjb3VsZCB0aGVvcmV0aWNhbGx5IG1ha2UgdGhpcyBkeW5hbWljIHNvIHVzZXIgY2FuIGNsaWNrICdhZGQnXG4gICAgICAgICAgICAgKiBidXR0b24gYW5kIGFkZCBuZXcgb25lcyBvbmUgYXQgYSB0aW1lLiBKdXN0IG5vdCB0YWtpbmcgdGhlIHRpbWUgdG8gZG8gdGhhdCB5ZXQuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogdG9kby0wOiBUaGlzIGlzIHVnbHkgdG8gcHJlLWNyZWF0ZSB0aGVzZSBpbnB1dCBmaWVsZHMuIE5lZWQgdG8gbWFrZSB0aGVtIGFibGUgdG8gYWRkIGR5bmFtaWNhbGx5LlxuICAgICAgICAgICAgICogKFdpbGwgZG8gdGhpcyBtb2RpZmljYXRpb24gb25jZSBJIGdldCB0aGUgZHJhZy1uLWRyb3Agc3R1ZmYgd29ya2luZyBmaXJzdClcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZpbGVzXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8qIHdyYXAgaW4gRElWIHRvIGZvcmNlIHZlcnRpY2FsIGFsaWduICovXG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi1ib3R0b206IDEwcHg7XCJcbiAgICAgICAgICAgICAgICB9LCBpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVJZFwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLyogYm9vbGVhbiBmaWVsZCB0byBzcGVjaWZ5IGlmIHdlIGV4cGxvZGUgemlwIGZpbGVzIG9udG8gdGhlIEpDUiB0cmVlICovXG4gICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhwbG9kZVppcHNcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1cIiksXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJlbmN0eXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuICAgICAgICAgICAgICAgIFwiZGF0YS1hamF4XCI6IFwiZmFsc2VcIiAvLyBORVcgZm9yIG11bHRpcGxlIGZpbGUgdXBsb2FkIHN1cHBvcnQ/Pz9cbiAgICAgICAgICAgIH0sIGZvcm1GaWVsZHMpO1xuXG4gICAgICAgICAgICB1cGxvYWRGaWVsZENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRmllbGRDb250YWluZXJcIilcbiAgICAgICAgICAgIH0sIFwiPHA+VXBsb2FkIGZyb20geW91ciBjb21wdXRlcjwvcD5cIiArIGZvcm0pO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsID0gJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpKS52YWwoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGdW5jID0gKGV4cGxvZGVaaXBzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogVXBsb2FkIGZvcm0gaGFzIGhpZGRlbiBpbnB1dCBlbGVtZW50IGZvciBub2RlSWQgcGFyYW1ldGVyICovXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpKS5hdHRyKFwidmFsdWVcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpKS5hdHRyKFwidmFsdWVcIiwgZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgZG8gc29tZXRoaW5nIGRpZmZlcmVudGx5IGZyb20gdGhlIG5vcm1hbCAndXRpbC5qc29uKCknIGNhbGxzIHRvIHRoZSBzZXJ2ZXIsIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIGhpZ2hseSBzcGVjaWFsaXplZCBoZXJlIGZvciBmb3JtIHVwbG9hZGluZywgYW5kIGlzIGRpZmZlcmVudCBmcm9tIG5vcm1hbCBhamF4IGNhbGxzLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+KCQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSlbMF0pKTtcblxuICAgICAgICAgICAgICAgIGxldCBwcm1zID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVwbG9hZCBmYWlsZWQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgRHJvcHpvbmU7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmaWxlTGlzdDogT2JqZWN0W10gPSBudWxsO1xuICAgICAgICB6aXBRdWVzdGlvbkFuc3dlcmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGV4cGxvZGVaaXBzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBmb3JtRmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWQgQWN0aW9uIFVSTDogXCIgKyBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIik7XG5cbiAgICAgICAgICAgIGxldCBoaWRkZW5JbnB1dENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJkaXNwbGF5OiBub25lO1wiXG4gICAgICAgICAgICB9LCBcIlwiKTtcblxuICAgICAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgXCJhY3Rpb25cIjogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICAgICAgXCJhdXRvUHJvY2Vzc1F1ZXVlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IHdlIGFsc28gaGF2ZSBzb21lIHN0eWxpbmcgaW4gbWV0YTY0LmNzcyBmb3IgJ2Ryb3B6b25lJyAqL1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkcm9wem9uZVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIilcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgbnVsbCwgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyBmb3JtICsgaGlkZGVuSW5wdXRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWd1cmVEcm9wWm9uZSA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgbGV0IGNvbmZpZzogT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIHVybDogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICAgICAgLy8gUHJldmVudHMgRHJvcHpvbmUgZnJvbSB1cGxvYWRpbmcgZHJvcHBlZCBmaWxlcyBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgIGF1dG9Qcm9jZXNzUXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogXCJmaWxlc1wiLFxuICAgICAgICAgICAgICAgIG1heEZpbGVzaXplOiAyLFxuICAgICAgICAgICAgICAgIHBhcmFsbGVsVXBsb2FkczogMTAsXG5cbiAgICAgICAgICAgICAgICAvKiBOb3Qgc3VyZSB3aGF0J3MgdGhpcyBpcyBmb3IsIGJ1dCB0aGUgJ2ZpbGVzJyBwYXJhbWV0ZXIgb24gdGhlIHNlcnZlciBpcyBhbHdheXMgTlVMTCwgdW5sZXNzXG4gICAgICAgICAgICAgICAgdGhlIHVwbG9hZE11bHRpcGxlIGlzIGZhbHNlICovXG4gICAgICAgICAgICAgICAgdXBsb2FkTXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFkZFJlbW92ZUxpbmtzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpY3REZWZhdWx0TWVzc2FnZTogXCJEcmFnICYgRHJvcCBmaWxlcyBoZXJlLCBvciBDbGlja1wiLFxuICAgICAgICAgICAgICAgIGhpZGRlbklucHV0Q29udGFpbmVyOiBcIiNcIiArIHRoaXouaWQoXCJoaWRkZW5JbnB1dENvbnRhaW5lclwiKSxcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgVGhpcyBkb2Vzbid0IHdvcmsgYXQgYWxsLiBEcm9wem9uZSBhcHBhcmVudGx5IGNsYWltcyB0byBzdXBwb3J0IHRoaXMgYnV0IGRvZXNuJ3QuXG4gICAgICAgICAgICAgICAgU2VlIHRoZSBcInNlbmRpbmdcIiBmdW5jdGlvbiBiZWxvdywgd2hlcmUgSSBlbmRlZCB1cCBwYXNzaW5nIHRoZXNlIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgaGVhZGVycyA6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIiA6IGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJleHBsb2RlWmlwc1wiIDogZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZHJvcHpvbmUgPSB0aGlzOyAvLyBjbG9zdXJlXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgdGhpei5pZChcInVwbG9hZEJ1dHRvblwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBnZXQgdXBsb2FkIGJ1dHRvbi5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcHpvbmUucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJhZGRlZGZpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnVwZGF0ZUZpbGVMaXN0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5ydW5CdXR0b25FbmFibGVtZW50KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicmVtb3ZlZGZpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnVwZGF0ZUZpbGVMaXN0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5ydW5CdXR0b25FbmFibGVtZW50KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwic2VuZGluZ1wiLCBmdW5jdGlvbihmaWxlLCB4aHIsIGZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJub2RlSWRcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImV4cGxvZGVaaXBzXCIsIHRoaXMuZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcInF1ZXVlY29tcGxldGVcIiwgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJkcm9wem9uZS1mb3JtLWlkXCIpKS5kcm9wem9uZShjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlRmlsZUxpc3QgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdChkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpKTtcblxuICAgICAgICAgICAgLyogRGV0ZWN0IGlmIGFueSBaSVAgZmlsZXMgYXJlIGN1cnJlbnRseSBzZWxlY3RlZCwgYW5kIGFzayB1c2VyIHRoZSBxdWVzdGlvbiBhYm91dCB3aGV0aGVyIHRoZXlcbiAgICAgICAgICAgIHNob3VsZCBiZSBleHRyYWN0ZWQgYXV0b21hdGljYWxseSBkdXJpbmcgdGhlIHVwbG9hZCwgYW5kIHVwbG9hZGVkIGFzIGluZGl2aWR1YWwgbm9kZXNcbiAgICAgICAgICAgIGZvciBlYWNoIGZpbGUgKi9cbiAgICAgICAgICAgIGlmICghdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkICYmIHRoaXMuaGFzQW55WmlwRmlsZXMoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSwvL1xuICAgICAgICAgICAgICAgICAgICAvL05vIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5leHBsb2RlWmlwcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaGFzQW55WmlwRmlsZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICBsZXQgcmV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBmaWxlIG9mIHRoaXMuZmlsZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZVtcIm5hbWVcIl0udG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bkJ1dHRvbkVuYWJsZW1lbnQgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKS5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgZHJvcHpvbmVFdnQuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkQnV0dG9uXCIpKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJlRHJvcFpvbmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21VcmxEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRGcm9tVXJsRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21VcmxEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRGl2ID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxGaWVsZCA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVwbG9hZCBGcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxcIik7XG4gICAgICAgICAgICB1cGxvYWRGcm9tVXJsRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgIH0sIHVwbG9hZEZyb21VcmxGaWVsZCk7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIHVwbG9hZEZpZWxkQ29udGFpbmVyICsgdXBsb2FkRnJvbVVybERpdiArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlVXJsID0gdGhpcy5nZXRJbnB1dFZhbChcInVwbG9hZEZyb21VcmxcIik7XG5cbiAgICAgICAgICAgIC8qIGlmIHVwbG9hZGluZyBmcm9tIFVSTCAqL1xuICAgICAgICAgICAgaWYgKHNvdXJjZVVybCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlVwbG9hZEZyb21VcmxSZXF1ZXN0LCBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZT4oXCJ1cGxvYWRGcm9tVXJsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVVybFwiOiBzb3VyY2VVcmxcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnVwbG9hZEZyb21VcmxSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRGcm9tVXJsUmVzcG9uc2UgPSAocmVzOiBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiVXBsb2FkIGZyb20gVVJMXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChcInVwbG9hZEZyb21VcmxcIiksIFwiXCIpO1xuXG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXROb2RlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBhY2U7XG5cbi8qXG4gKiBFZGl0b3IgRGlhbG9nIChFZGl0cyBOb2RlcylcbiAqXG4gKi9cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBFZGl0Tm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnRlbnRGaWVsZERvbUlkOiBzdHJpbmc7XG4gICAgICAgIGZpZWxkSWRUb1Byb3BNYXA6IGFueSA9IHt9O1xuICAgICAgICBwcm9wRW50cmllczogQXJyYXk8UHJvcEVudHJ5PiA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIGVkaXRQcm9wZXJ0eURsZ0luc3Q6IGFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCwgdGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZU5vZGVCdXR0b24gKyBhZGRQcm9wZXJ0eUJ1dHRvbiArIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblxuICAgICAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDQwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyB3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDsgYm9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XCJcbiAgICAgICAgICAgIH0sIFwiTG9hZGluZy4uLlwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYWxsIHRoZSBIVE1MIGVkaXQgZmllbGRzIGFuZCBwdXRzIHRoZW0gaW50byB0aGUgRE9NIG1vZGVsIG9mIHRoZSBwcm9wZXJ0eSBlZGl0b3IgZGlhbG9nIGJveC5cbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHBvcHVsYXRlRWRpdE5vZGVQZyA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICAgICAgLyogY2xlYXIgdGhpcyBtYXAgdG8gZ2V0IHJpZCBvZiBvbGQgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcblxuICAgICAgICAgICAgLyogZWRpdE5vZGUgd2lsbCBiZSBudWxsIGlmIHRoaXMgaXMgYSBuZXcgbm9kZSBiZWluZyBjcmVhdGVkICovXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0Tm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBleGlzdGluZyBub2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIC8qIGl0ZXJhdG9yIGZ1bmN0aW9uIHdpbGwgaGF2ZSB0aGUgd3JvbmcgJ3RoaXMnIHNvIHdlIHNhdmUgdGhlIHJpZ2h0IG9uZSAqL1xuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZWRpdE9yZGVyZWRQcm9wcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBQcm9wZXJ0eUluZm8uamF2YSBvYmplY3RzXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBXYXJuaW5nIGVhY2ggaXRlcmF0b3IgbG9vcCBoYXMgaXRzIG93biAndGhpcydcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goZWRpdE9yZGVyZWRQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgKiBpZiBwcm9wZXJ0eSBub3QgYWxsb3dlZCB0byBkaXNwbGF5IHJldHVybiB0byBieXBhc3MgdGhpcyBwcm9wZXJ0eS9pdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcC5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZElkID0gdGhpei5pZChcImVkaXROb2RlVGV4dENvbnRlbnRcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBlZGl0IGZpZWxkIFwiICsgZmllbGRJZCArIFwiIGZvciBwcm9wZXJ0eSBcIiArIHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSBwcm9wLnZhbHVlcyAmJiBwcm9wLnZhbHVlcy5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNSZWFkT25seVByb3AgPSByZW5kZXIuaXNSZWFkT25seVByb3BlcnR5KHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wRW50cnk6IFByb3BFbnRyeSA9IG5ldyBQcm9wRW50cnkoZmllbGRJZCwgcHJvcCwgaXNNdWx0aSwgaXNSZWFkT25seVByb3AsIGlzQmluYXJ5UHJvcCwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpei5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdID0gcHJvcEVudHJ5O1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnByb3BFbnRyaWVzLnB1c2gocHJvcEVudHJ5KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgPSB0aGl6Lm1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIocHJvcCwgZmllbGRJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBidXR0b25CYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZU11bHRpUHJvcEVkaXRvcihwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlU2luZ2xlUHJvcEVkaXRvcihwcm9wRW50cnksIGFjZUZpZWxkcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6ICgoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHx8IGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbUhpZGRlblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJzdHlsZVwiIDogXCJkaXNwbGF5OiBcIisgKCFyZE9ubHkgfHwgbWV0YTY0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcImlubGluZVwiIDogXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgIH0sIGZpZWxkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIEVkaXRpbmcgYSBuZXcgbm9kZSAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiB0aGlzIGVudGlyZSBibG9jayBuZWVkcyByZXZpZXcgbm93IChyZWRlc2lnbilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgbmV3IG5vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkSWQgPSB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmV3IE5vZGUgTmFtZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IEkgY2FuIHJlbW92ZSB0aGlzIGRpdiBub3cgP1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7fSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9JJ20gbm90IHF1aXRlIHJlYWR5IHRvIGFkZCB0aGlzIGJ1dHRvbiB5ZXQuXG4gICAgICAgICAgICAvLyB2YXIgdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikudG9nZ2xlU2hvd1JlYWRPbmx5KCk7XCIgLy9cbiAgICAgICAgICAgIC8vIH0sIC8vXG4gICAgICAgICAgICAvLyAgICAgKGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiSGlkZSBSZWFkLU9ubHkgUHJvcGVydGllc1wiIDogXCJTaG93IFJlYWQtT25seSBQcm9wZXJ0aWVzXCIpKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBmaWVsZHMgKz0gdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b247XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksIGZpZWxkcyk7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGFjZUZpZWxkc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShhY2VGaWVsZHNbaV0udmFsLnVuZW5jb2RlSHRtbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmFjZUVkaXRvcnNCeUlkW2FjZUZpZWxkc1tpXS5pZF0gPSBlZGl0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5zdHIgPSBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA/IC8vXG4gICAgICAgICAgICAgICAgXCJZb3UgbWF5IGxlYXZlIHRoaXMgZmllbGQgYmxhbmsgYW5kIGEgdW5pcXVlIElEIHdpbGwgYmUgYXNzaWduZWQuIFlvdSBvbmx5IG5lZWQgdG8gcHJvdmlkZSBhIG5hbWUgaWYgeW91IHdhbnQgdGhpcyBub2RlIHRvIGhhdmUgYSBtb3JlIG1lYW5pbmdmdWwgVVJMLlwiXG4gICAgICAgICAgICAgICAgOiAvL1xuICAgICAgICAgICAgICAgIFwiXCI7XG5cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIikpLmh0bWwoaW5zdHIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3cgYWRkaW5nIG9mIG5ldyBwcm9wZXJ0aWVzIGFzIGxvbmcgYXMgdGhpcyBpcyBhIHNhdmVkIG5vZGUgd2UgYXJlIGVkaXRpbmcsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBzdGFydFxuICAgICAgICAgICAgICogbWFuYWdpbmcgbmV3IHByb3BlcnRpZXMgb24gdGhlIGNsaWVudCBzaWRlLiBXZSBuZWVkIGEgZ2VudWluZSBub2RlIGFscmVhZHkgc2F2ZWQgb24gdGhlIHNlcnZlciBiZWZvcmUgd2UgYWxsb3dcbiAgICAgICAgICAgICAqIGFueSBwcm9wZXJ0eSBlZGl0aW5nIHRvIGhhcHBlbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5QnV0dG9uXCIpLCAhZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgdGFnc1Byb3BFeGlzdHMgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJ0YWdzXCIsIGVkaXQuZWRpdE5vZGUpICE9IG51bGw7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhhc1RhZ3NQcm9wOiBcIiArIHRhZ3NQcm9wKTtcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIiksICF0YWdzUHJvcEV4aXN0cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVTaG93UmVhZE9ubHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvLyBhbGVydChcIm5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAgICAgLy8gc2VlIHNhdmVFeGlzdGluZ05vZGUgZm9yIGhvdyB0byBpdGVyYXRlIGFsbCBwcm9wZXJ0aWVzLCBhbHRob3VnaCBJIHdvbmRlciB3aHkgSSBkaWRuJ3QganVzdCB1c2UgYSBtYXAvc2V0IG9mXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIGVsZW1lbnRzXG4gICAgICAgICAgICAvLyBpbnN0ZWFkIHNvIEkgZG9uJ3QgbmVlZCB0byBwYXJzZSBhbnkgRE9NIG9yIGRvbUlkcyBpbm9yZGVyIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBvZiB0aGVtPz8/P1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3QgPSBuZXcgRWRpdFByb3BlcnR5RGxnKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0Lm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoZWRpdC5lZGl0Tm9kZSwgXCJ0YWdzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJ0YWdzXCIsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogXCJcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLmFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQWRkIFRhZ3MgUHJvcGVydHlcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTm90ZTogZmllbGRJZCBwYXJhbWV0ZXIgaXMgYWxyZWFkeSBkaWFsb2ctc3BlY2lmaWMgYW5kIGRvZXNuJ3QgbmVlZCBpZCgpIHdyYXBwZXIgZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIG1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIgPSAocHJvcDogYW55LCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBjbGVhckJ1dHRvbiA9IGNuc3QuU0hPV19DTEVBUl9CVVRUT05fSU5fRURJVE9SID8gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5jbGVhclByb3BlcnR5KCdcIiArIGZpZWxkSWQgKyBcIicpO1wiIC8vXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiQ2xlYXJcIikgOiBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgYWRkTXVsdGlCdXR0b24gPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGRlbGV0ZUJ1dHRvbiA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgIT09IGpjckNuc3QuQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdyB3ZSBqdXN0IGdvIHdpdGggdGhlIGRlc2lnbiB3aGVyZSB0aGUgYWN0dWFsIGNvbnRlbnQgcHJvcGVydHkgY2Fubm90IGJlIGRlbGV0ZWQuIFVzZXIgY2FuIGxlYXZlXG4gICAgICAgICAgICAgICAgICogY29udGVudCBibGFuayBidXQgbm90IGRlbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuZGVsZXRlUHJvcGVydHkoJ1wiICsgcHJvcC5uYW1lICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiRGVsXCIpO1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBJIGRvbid0IHRoaW5rIGl0IHJlYWxseSBtYWtlcyBzZW5zZSB0byBhbGxvdyBhIGpjcjpjb250ZW50IHByb3BlcnR5IHRvIGJlIG11bHRpdmFsdWVkLiBJIG1heSBiZSB3cm9uZyBidXRcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIG15IGN1cnJlbnQgYXNzdW1wdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBUaGVyZSdzIGEgYnVnIGluIGVkaXRpbmcgbXVsdGlwbGUtdmFsdWVkIHByb3BlcnRpZXMsIGFuZCBzbyBpJ20ganVzdCB0dXJuaW5nIGl0IG9mZiBmb3Igbm93XG4gICAgICAgICAgICAgICAgLy93aGlsZSBpIGNvbXBsZXRlIHRlc3Rpbmcgb2YgdGhlIHJlc3Qgb2YgdGhlIGFwcC5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGFkZE11bHRpQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuYWRkU3ViUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBcIkFkZCBNdWx0aVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbEJ1dHRvbnMgPSBhZGRNdWx0aUJ1dHRvbiArIGNsZWFyQnV0dG9uICsgZGVsZXRlQnV0dG9uO1xuICAgICAgICAgICAgaWYgKGFsbEJ1dHRvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicHJvcGVydHktZWRpdC1idXR0b24tYmFyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZVByb3BlcnR5UmVxdWVzdCwganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlPihcImRlbGV0ZVByb3BlcnR5XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55LCBwcm9wZXJ0eVRvRGVsZXRlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIGRlbGV0ZWQgcHJvcGVydHkgZnJvbSBjbGllbnQgc2lkZSBzdG9yYWdlLCBzbyB3ZSBjYW4gcmUtcmVuZGVyIHNjcmVlbiB3aXRob3V0IG1ha2luZyBhbm90aGVyIGNhbGwgdG9cbiAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9wcy5kZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlUb0RlbGV0ZSk7XG5cbiAgICAgICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBzY2FuIGZvciBhbGwgbXVsdGktdmFsdWUgcHJvcGVydHkgZmllbGRzIGFuZCBjbGVhciB0aGVtICovXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHNhdmVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIGVkaXRpbmcgYW4gdW5zYXZlZCBub2RlIGl0J3MgdGltZSB0byBydW4gdGhlIGluc2VydE5vZGUsIG9yIGNyZWF0ZVN1Yk5vZGUsIHdoaWNoIGFjdHVhbGx5IHNhdmVzIG9udG8gdGhlXG4gICAgICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVOZXdOb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRWxzZSB3ZSBhcmUgZWRpdGluZyBhIHNhdmVkIG5vZGUsIHdoaWNoIGlzIGFscmVhZHkgc2F2ZWQgb24gc2VydmVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGUuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZU5ld05vZGUgPSAobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBuZXdOb2RlTmFtZSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogSWYgd2UgZGlkbid0IGNyZWF0ZSB0aGUgbm9kZSB3ZSBhcmUgaW5zZXJ0aW5nIHVuZGVyLCBhbmQgbmVpdGhlciBkaWQgXCJhZG1pblwiLCB0aGVuIHdlIG5lZWQgdG8gc2VuZCBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlck5hbWUgIT0gZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICYmIC8vXG4gICAgICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Tm9kZVJlcXVlc3QsIGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlPihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5hbWVcIjogZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIiA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCJcbiAgICAgICAgICAgICAgICB9LCBlZGl0Lmluc2VydE5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNyZWF0ZVN1Yk5vZGVSZXF1ZXN0LCBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZT4oXCJjcmVhdGVTdWJOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIiA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCJcbiAgICAgICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbC5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IHNpbmdsZS10eXBlOiBcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCA/IHByb3BWYWwgOiAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsU3RyLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWtpbmcgc2luZ2xlIHByb3AgZWRpdG9yOiBwcm9wW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIl0gdmFsW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlXG4gICAgICAgICAgICAgICAgKyBcIl0gZmllbGRJZD1cIiArIHByb3BFbnRyeS5pZCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkucmVhZE9ubHkgfHwgcHJvcEVudHJ5LmJpbmFyeSkge1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlZGl0Tm9kZURsZzogYW55KSB7XG4gICAgICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZVByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByb3BlcnR5QnV0dG9uXCIsIHRoaXMuc2F2ZVByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJlZGl0UHJvcGVydHlQZ0Nsb3NlQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgICAgICsgXCInIGNsYXNzPSdwYXRoLWRpc3BsYXktaW4tZWRpdG9yJz48L2Rpdj5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSAnJztcblxuICAgICAgICAgICAgLyogUHJvcGVydHkgTmFtZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BOYW1lSWQgPSBcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wTmFtZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BWYWx1ZUlkID0gXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BWYWx1ZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wVmFsdWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJWYWx1ZVwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCIpKTtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiKSk7XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVEYXRhLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHByb3BlcnR5VmFsdWVEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogV2FybmluZzogZG9uJ3QgY29uZnVzZSB3aXRoIEVkaXROb2RlRGxnICovXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIiA6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgICAgIFwiPGRpdiBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICAgICArIHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIYW5kbGVzIGdldE5vZGVQcml2aWxlZ2VzIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgICAgICpcbiAgICAgICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgICAgICovXG4gICAgICAgIGdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVTaGFyaW5nUGcgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAgICAgJC5lYWNoKHJlcy5hY2xFbnRyaWVzLCBmdW5jdGlvbihpbmRleCwgYWNsRW50cnkpIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWxpc3RcIlxuICAgICAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwdWJsaWNBcHBlbmRBdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFsbG93UHVibGljQ29tbWVudGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJlcy5wdWJsaWNBcHBlbmQpIHtcbiAgICAgICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogdG9kbzogdXNlIGFjdHVhbCBwb2x5bWVyIHBhcGVyLWNoZWNrYm94IGhlcmUgKi9cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWNDb21tZW50aW5nQ2hhbmdlZCA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFVzaW5nIG9uQ2xpY2sgb24gdGhlIGVsZW1lbnQgQU5EIHRoaXMgdGltZW91dCBpcyB0aGUgb25seSBoYWNrIEkgY291bGQgZmluZCB0byBnZXQgZ2V0IHdoYXQgYW1vdW50cyB0byBhIHN0YXRlXG4gICAgICAgICAgICAgKiBjaGFuZ2UgbGlzdGVuZXIgb24gYSBwYXBlci1jaGVja2JveC4gVGhlIGRvY3VtZW50ZWQgb24tY2hhbmdlIGxpc3RlbmVyIHNpbXBseSBkb2Vzbid0IHdvcmsgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGl6LmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpKTtcblxuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCIgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogKHBvbHlFbG0ubm9kZS5jaGVja2VkID8gdHJ1ZSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlUHJpdmlsZWdlID0gKHByaW5jaXBhbDogc3RyaW5nLCBwcml2aWxlZ2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbW92ZVByaXZpbGVnZVJlcXVlc3QsIGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2U+KFwicmVtb3ZlUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiBwcmluY2lwYWwsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VcIjogcHJpdmlsZWdlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbW92ZVByaXZpbGVnZVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUucGF0aCxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlckFjbFByaXZpbGVnZXMgPSAocHJpbmNpcGFsOiBhbnksIGFjbEVudHJ5OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAkLmVhY2goYWNsRW50cnkucHJpdmlsZWdlcywgZnVuY3Rpb24oaW5kZXgsIHByaXZpbGVnZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXoubWFrZUJ1dHRvbihcIlJlbW92ZVwiLCBcInJlbW92ZVByaXZCdXR0b25cIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXouZ3VpZCArIFwiKS5yZW1vdmVQcml2aWxlZ2UoJ1wiICsgcHJpbmNpcGFsICsgXCInLCAnXCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZVxuICAgICAgICAgICAgICAgICAgICArIFwiJyk7XCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICByb3cgKz0gXCI8Yj5cIiArIHByaW5jaXBhbCArIFwiPC9iPiBoYXMgcHJpdmlsZWdlIDxiPlwiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWUgKyBcIjwvYj4gb24gdGhpcyBub2RlLlwiO1xuXG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWVudHJ5XCJcbiAgICAgICAgICAgICAgICB9LCByb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb25QZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIChuZXcgU2hhcmVUb1BlcnNvbkRsZygpKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1B1YmxpYyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hhcmluZyBub2RlIHRvIHB1YmxpYy5cIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWRkIHByaXZpbGVnZSBhbmQgdGhlbiByZWxvYWQgc2hhcmUgbm9kZXMgZGlhbG9nIGZyb20gc2NyYXRjaCBkb2luZyBhbm90aGVyIGNhbGxiYWNrIHRvIHNlcnZlclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRPRE86IHRoaXMgYWRkaXRpb25hbCBjYWxsIGNhbiBiZSBhdm9pZGVkIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCJdLFxuICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbG9hZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZW5hbWVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUmVuYW1lTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVuYW1lIE5vZGVcIik7XG5cbiAgICAgICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZVBhdGhEaXNwbGF5ID0gXCI8aDQgY2xhc3M9J3BhdGgtZGlzcGxheScgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSArIFwiJz48L2g0PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW50ZXIgbmV3IG5hbWUgZm9yIHRoZSBub2RlXCIsIFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZW5hbWVOb2RlQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZW5hbWVOb2RlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKG5ld05hbWUpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmV3IG5vZGUgbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2VsZWN0IGEgbm9kZSB0byByZW5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBpZiBubyBub2RlIGJlbG93IHRoaXMgbm9kZSwgcmV0dXJucyBudWxsICovXG4gICAgICAgICAgICB2YXIgbm9kZUJlbG93ID0gZWRpdC5nZXROb2RlQmVsb3coaGlnaGxpZ2h0Tm9kZSk7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuYW1lTm9kZVJlcXVlc3QsIGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlPihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJuZXdOYW1lXCI6IG5ld05hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGl6LnJlbmFtZU5vZGVSZXNwb25zZShyZXMsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbmFtZU5vZGVSZXNwb25zZSwgcmVuYW1pbmdQYWdlUm9vdDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVuYW1lIG5vZGVcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZW5hbWluZ1BhZ2VSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUocmVzLm5ld0lkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCByZXMubmV3SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSkuaHRtbChcIk5hbWU6IFwiICsgaGlnaGxpZ2h0Tm9kZS5uYW1lKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyBoaWdobGlnaHROb2RlLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQXVkaW9QbGF5ZXJEbGcuanNcIik7XHJcblxyXG4vKiBUaGlzIGlzIGFuIGF1ZGlvIHBsYXllciBkaWFsb2cgdGhhdCBoYXMgYWQtc2tpcHBpbmcgdGVjaG5vbG9neSBwcm92aWRlZCBieSBwb2RjYXN0LnRzICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvUGxheWVyRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc291cmNlVXJsOiBzdHJpbmcsIHByaXZhdGUgbm9kZVVpZDogc3RyaW5nLCBwcml2YXRlIHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzdXBlcihcIkF1ZGlvUGxheWVyRGxnXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0VGltZVBlbmRpbmcgaW4gY29uc3RydWN0b3I6IFwiICsgc3RhcnRUaW1lUGVuZGluZyk7XHJcbiAgICAgICAgICAgIHBvZGNhc3Quc3RhcnRUaW1lUGVuZGluZyA9IHN0YXJ0VGltZVBlbmRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBXaGVuIHRoZSBkaWFsb2cgY2xvc2VzIHdlIG5lZWQgdG8gc3RvcCBhbmQgcmVtb3ZlIHRoZSBwbGF5ZXIgKi9cclxuICAgICAgICBwdWJsaWMgY2FuY2VsKCkge1xyXG4gICAgICAgICAgICBzdXBlci5jYW5jZWwoKTtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9ICQoXCIjXCIgKyB0aGlzLmlkKFwiYXVkaW9QbGF5ZXJcIikpO1xyXG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBmb3Igc29tZSByZWFzb24gdGhlIGF1ZGlvIHBsYXllciBuZWVkcyB0byBiZSBhY2Nlc3NlZCBsaWtlIGl0J3MgYW4gYXJyYXkgKi9cclxuICAgICAgICAgICAgICAgIHBsYXllclswXS5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQXVkaW8gUGxheWVyXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3RoaXMubm9kZVVpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmtub3duIG5vZGUgdWlkOiBcIit0aGlzLm5vZGVVaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyB3aGVyZSBJIG5lZWQgYSBzaG9ydCBuYW1lIG9mIHRoZSBtZWRpYSBiZWluZyBwbGF5ZWQgKi9cclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG4gICAgICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL3JlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvcmVmX2F2X2RvbS5hc3BcclxuICAgICAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgICAgICBsZXQgcGxheWVyQXR0cmliczogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogOTUlO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbnRpbWV1cGRhdGVcIjogXCJtNjQucG9kY2FzdC5vblRpbWVVcGRhdGUoJ1wiICsgdGhpcy5ub2RlVWlkICsgXCInLCB0aGlzKTtcIixcclxuICAgICAgICAgICAgICAgIFwib25jYW5wbGF5XCI6IFwibTY0LnBvZGNhc3Qub25DYW5QbGF5KCdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbnRyb2xzXCI6IFwiY29udHJvbHNcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHJlbmRlci50YWcoXCJhdWRpb1wiLCBwbGF5ZXJBdHRyaWJzKTtcclxuXHJcbiAgICAgICAgICAgIC8vU2tpcHBpbmcgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoLTMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiIDogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjwgMzBzXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBGb3J3YXJkMzBCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5za2lwKDMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiIDogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICAgICAgLy9sZXQgc2tpcEJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihza2lwQmFjazMwQnV0dG9uICsgc2tpcEZvcndhcmQzMEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICAvL1NwZWVkIEJ1dHRvbnNcclxuICAgICAgICAgICAgbGV0IHNwZWVkTm9ybWFsQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc3BlZWQoMS4wKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIiA6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWQxNUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuNSk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCIgOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiMS41WFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGVlZDJ4QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc3BlZWQoMik7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCIgOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiMlhcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWRCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2tpcEJhY2szMEJ1dHRvbiArIHNraXBGb3J3YXJkMzBCdXR0b24gKyBzcGVlZE5vcm1hbEJ1dHRvbiArIHNwZWVkMTVCdXR0b24gKyBzcGVlZDJ4QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vRGlhbG9nIEJ1dHRvbnNcclxuICAgICAgICAgICAgbGV0IHBhdXNlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3QucGF1c2UoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIiA6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJQYXVzZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwbGF5QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3QucGxheSgpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiIDogXCJwbGF5QnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBldmVuIGlmIHRoaXMgYnV0dG9uIGFwcGVhcnMgdG8gd29yaywgSSBuZWVkIGl0IHRvIGV4cGxpY2l0bHkgZW5mb3JjZSB0aGUgc2F2aW5nIG9mIHRoZSB0aW1ldmFsdWUgQU5EIHRoZSByZW1vdmVsIG9mIHRoZSBBVURJTyBlbGVtZW50IGZyb20gdGhlIERPTSAqL1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBkZXNjcmlwdGlvbiArIHBsYXllciAvKiArIHNraXBCdXR0b25CYXIgKi8gKyBzcGVlZEJ1dHRvbkJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcihudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDcmVhdGVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgICAgICBsYXN0U2VsVHlwZU5hbWU6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgICAgICBsZXQgY3JlYXRlQ2hpbGRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBDaGlsZFwiLCBcImNyZWF0ZUNoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlQ2hpbGQsIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGNyZWF0ZUlubGluZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ3JlYXRlIElubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjcmVhdGVDaGlsZEJ1dHRvbiArIGNyZWF0ZUlubGluZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdHlwZUlkeCA9IDA7XG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3RhbmRhcmQgVHlwZVwiLCBcIm50OnVuc3RydWN0dXJlZFwiLCB0eXBlSWR4KyspO1xuICAgICAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlJTUyBGZWVkXCIsIFwibWV0YTY0OnJzc2ZlZWRcIiwgdHlwZUlkeCsrKTtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3RCb3hcIlxuICAgICAgICAgICAgfSwgY29udGVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VMaXN0SXRlbSh2YWw6IHN0cmluZywgdHlwZU5hbWU6IHN0cmluZywgdHlwZUlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgbGV0IHBheWxvYWQ6IE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZUlkeFwiOiB0eXBlSWR4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0SXRlbVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpLFxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLm9uUm93Q2xpY2ssIHRoaXMsIHBheWxvYWQpXG4gICAgICAgICAgICB9LCB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlQ2hpbGQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlSW5saW5lID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICBlZGl0Lmluc2VydE5vZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUm93Q2xpY2sgPSAocGF5bG9hZDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIGxldCBkaXZJZCA9IHRoaXMuaWQoXCJ0eXBlUm93XCIgKyBwYXlsb2FkLnR5cGVJZHgpO1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSBwYXlsb2FkLnR5cGVOYW1lO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0U2VsRG9tSWQpIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5sYXN0U2VsRG9tSWQpLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRMaXN0SXRlbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgICAgICAkKFwiI1wiICsgZGl2SWQpLmFkZENsYXNzKFwic2VsZWN0ZWRMaXN0SXRlbVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2hSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hSZXN1bHRzUGFuZWwge1xyXG5cclxuICAgICAgICBkb21JZDogc3RyaW5nID0gXCJzZWFyY2hSZXN1bHRzUGFuZWxcIjtcclxuICAgICAgICB0YWJJZDogc3RyaW5nID0gXCJzZWFyY2hUYWJOYW1lXCI7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSdzZWFyY2hQYWdlVGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0nc2VhcmNoUmVzdWx0c1ZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgJChcIiNzZWFyY2hQYWdlVGl0bGVcIikuaHRtbChzcmNoLnNlYXJjaFBhZ2VUaXRsZSk7XHJcbiAgICAgICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnNlYXJjaFJlc3VsdHMsIFwic2VhcmNoUmVzdWx0c1ZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHRpbWVsaW5lUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgVGltZWxpbmVSZXN1bHRzUGFuZWwge1xyXG5cclxuICAgICAgICBkb21JZDogc3RyaW5nID0gXCJ0aW1lbGluZVJlc3VsdHNQYW5lbFwiO1xyXG4gICAgICAgIHRhYklkOiBzdHJpbmcgPSBcInRpbWVsaW5lVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0ndGltZWxpbmVQYWdlVGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0ndGltZWxpbmVWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgJChcIiN0aW1lbGluZVBhZ2VUaXRsZVwiKS5odG1sKHNyY2gudGltZWxpbmVQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC50aW1lbGluZVJlc3VsdHMsIFwidGltZWxpbmVWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=