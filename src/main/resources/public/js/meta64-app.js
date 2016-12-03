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
                edit.nodesToMoveSet = {};
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
        edit.nodesToMoveSet = {};
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
        edit.startEditingNewNode = function (typeName, createAtTop) {
            edit.editingUnsavedNode = false;
            edit.editNode = null;
            edit.editNodeDlgInst = new m64.EditNodeDlg(typeName, createAtTop);
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
        edit.insertNode = function (uid, typeName) {
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
                edit.startEditingNewNode(typeName);
            }
        };
        edit.createSubNode = function (uid, typeName, createAtTop) {
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
            edit.startEditingNewNode(typeName, createAtTop);
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
        edit.cutSelNodes = function () {
            var selNodesArray = m64.meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new m64.MessageDlg("You have not selected any nodes. Select nodes first.")).open();
                return;
            }
            (new m64.ConfirmDlg("Confirm Cut", "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?", "Yes", function () {
                edit.nodesToMove = selNodesArray;
                loadNodesToMoveSet(selNodesArray);
                m64.meta64.selectedNodes = {};
                m64.render.renderPageFromData();
                m64.meta64.refreshAllGuiEnablement();
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
            (new m64.ConfirmDlg("Confirm Paste", "Paste " + edit.nodesToMove.length + " node(s) under selected parent node ?", "Yes, paste.", function () {
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
                console.log("selectedNode count: " + m64.util.getPropertyCount(meta64.selectedNodes));
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
            var selNodeIsMine = highlightNode != null && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
            var homeNodeSelected = highlightNode != null && meta64.homeNodeId == highlightNode.id;
            var importFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.importAllowed;
            var exportFeatureEnabled = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
            var highlightOrdinal = meta64.getOrdinalOfNode(highlightNode);
            var numChildNodes = meta64.getNumChildNodes();
            var canMoveUp = highlightOrdinal > 0 && numChildNodes > 1;
            var canMoveDown = highlightOrdinal < numChildNodes - 1 && numChildNodes > 1;
            var canCreateNode = meta64.userPreferences.editMode && (meta64.isAdminUser || (!meta64.isAnonUser && selNodeIsMine));
            console.log("enablement: isAnonUser=" + meta64.isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);
            m64.util.setEnablement("navLogoutButton", !meta64.isAnonUser);
            m64.util.setEnablement("openSignupPgButton", meta64.isAnonUser);
            var propsToggle = meta64.currentNode && !meta64.isAnonUser;
            m64.util.setEnablement("propsToggleButton", propsToggle);
            var allowEditMode = meta64.currentNode && !meta64.isAnonUser;
            m64.util.setEnablement("editModeButton", allowEditMode);
            m64.util.setEnablement("upLevelButton", meta64.currentNode && m64.nav.parentVisibleToUser());
            m64.util.setEnablement("cutSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            m64.util.setEnablement("deleteSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            m64.util.setEnablement("clearSelectionsButton", !meta64.isAnonUser && selNodeCount > 0);
            m64.util.setEnablement("pasteSelNodesButton", !meta64.isAnonUser && m64.edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));
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
            m64.util.setEnablement("openImportDlg", importFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
            m64.util.setEnablement("openExportDlg", exportFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
            m64.util.setEnablement("adminMenu", meta64.isAdminUser);
            m64.util.setVisibility("openImportDlg", importFeatureEnabled);
            m64.util.setVisibility("openExportDlg", exportFeatureEnabled);
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
            node.properties = m64.props.getPropertiesInEditingOrder(node, node.properties);
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
        nav.mainOffset = 0;
        nav.ROWS_PER_PAGE = 25;
        nav.openMainMenuHelp = function () {
            nav.mainOffset = 0;
            m64.util.json("renderNode", {
                "nodeId": "/meta64/public/help",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset
            }, nav.navPageNodeResponse);
        };
        nav.openRssFeedsNode = function () {
            nav.mainOffset = 0;
            m64.util.json("renderNode", {
                "nodeId": "/rss/feeds",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset
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
            nav.mainOffset = 0;
            var ironRes = m64.util.json("renderNode", {
                "nodeId": m64.meta64.currentNodeId,
                "upLevel": 1,
                "renderParentIfLeaf": false,
                "offset": nav.mainOffset
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
                nav.mainOffset = 0;
                m64.util.json("renderNode", {
                    "nodeId": m64.meta64.homeNodeId,
                    "upLevel": null,
                    "renderParentIfLeaf": null,
                    "offset": nav.mainOffset
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
        props_1.orderProps = function (propOrder, props) {
            var propsNew = props.clone();
            var targetIdx = 0;
            for (var _i = 0, propOrder_1 = propOrder; _i < propOrder_1.length; _i++) {
                var prop = propOrder_1[_i];
                targetIdx = moveNodePosition(propsNew, targetIdx, prop);
            }
            return propsNew;
        };
        var moveNodePosition = function (props, idx, typeName) {
            var tagIdx = props.indexOfItemByProp("name", typeName);
            if (tagIdx != -1) {
                props.arrayMoveItem(tagIdx, idx++);
            }
            return idx;
        };
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
        props_1.getPropertiesInEditingOrder = function (node, props) {
            var func = m64.meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
            if (func) {
                return func(node, props);
            }
            var propsNew = props.clone();
            movePropsToTop([m64.jcrCnst.CONTENT, m64.jcrCnst.TAGS], propsNew);
            movePropsToEnd([m64.jcrCnst.CREATED, m64.jcrCnst.CREATED_BY, m64.jcrCnst.LAST_MODIFIED, m64.jcrCnst.LAST_MODIFIED_BY], propsNew);
            return propsNew;
        };
        var movePropsToTop = function (propsList, props) {
            for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
                var prop = propsList_1[_i];
                var tagIdx = props.indexOfItemByProp("name", prop);
                if (tagIdx != -1) {
                    props.arrayMoveItem(tagIdx, 0);
                }
            }
        };
        var movePropsToEnd = function (propsList, props) {
            for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
                var prop = propsList_2[_i];
                var tagIdx = props.indexOfItemByProp("name", prop);
                if (tagIdx != -1) {
                    props.arrayMoveItem(tagIdx, props.length);
                }
            }
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
                            val = m64.render.wrapHtml(property.value);
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
                    var localOpenLink = render.tag("paper-button", {
                        "raised": "raised",
                        "onclick": "m64.meta64.openSystemFile('" + entry.fileName + "')"
                    }, "Local Open");
                    var downloadLink = "";
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
                "class": "horizontal center-justified layout vertical-layout-row " + classes
            }, buttons);
        };
        render.buttonBar = function (buttons, classes) {
            classes = classes || "";
            return render.tag("div", {
                "class": "horizontal left-justified layout vertical-layout-row " + classes
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
            if (m64.nav.mainOffset > 0) {
                var prevButton = render.makeButton("Prev Page", "prevPageButton", render.prevPage);
                output += render.centeredButtonBar(prevButton, "paging-button-bar");
            }
            var rowCount = 0;
            if (data.children) {
                var childCount = data.children.length;
                for (var i = 0; i < data.children.length; i++) {
                    var node = data.children[i];
                    if (!m64.edit.nodesToMoveSet[node.id]) {
                        var row = render.generateRow(i, node, newData, childCount, rowCount);
                        if (row.length != 0) {
                            output += row;
                            rowCount++;
                        }
                    }
                }
            }
            if (m64.edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !m64.meta64.isAnonUser) {
                    output = getEmptyPagePrompt();
                }
            }
            if (!data.endReached) {
                var nextButton = render.makeButton("Next Page", "nextPageButton", render.nextPage);
                output += render.centeredButtonBar(nextButton, "paging-button-bar");
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
        render.prevPage = function () {
            console.log("Prev page button click.");
            m64.view.prevPage();
        };
        render.nextPage = function () {
            console.log("Next page button click.");
            m64.view.nextPage();
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
        render.makeButton = function (text, id, callback, ctx) {
            var attribs = {
                "raised": "raised",
                "id": id,
                "class": "standardButton"
            };
            if (callback != undefined) {
                attribs["onClick"] = m64.meta64.encodeOnClick(callback, ctx);
            }
            return render.tag("paper-button", attribs, text, true);
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
            m64.nav.mainOffset = 0;
            m64.util.json("renderNode", {
                "nodeId": res.searchResultNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": srch.searchOffset
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
                "searchProp": null
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
                "searchProp": null
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
                "renderParentIfLeaf": renderParentIfLeaf ? true : false,
                "offset": m64.nav.mainOffset
            }, function (res) {
                view.refreshTreeResponse(res, highlightId);
                if (isInitialRender && m64.meta64.urlCmd == "addNode" && m64.meta64.homeNodeOverride) {
                    m64.edit.editMode(true);
                    m64.edit.createSubNode(m64.meta64.currentNode.uid);
                }
            });
        };
        view.prevPage = function () {
            console.log("Running prevPage Query");
            m64.nav.mainOffset -= m64.nav.ROWS_PER_PAGE;
            if (m64.nav.mainOffset < 0) {
                m64.nav.mainOffset = 0;
            }
            loadPage();
        };
        view.nextPage = function () {
            console.log("Running nextPage Query");
            m64.nav.mainOffset += m64.nav.ROWS_PER_PAGE;
            loadPage();
        };
        var loadPage = function () {
            m64.util.json("renderNode", {
                "nodeId": m64.meta64.currentNodeId,
                "upLevel": null,
                "renderParentIfLeaf": true,
                "offset": m64.nav.mainOffset
            }, function (res) {
                view.refreshTreeResponse(res, null);
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
                "label": title,
                "selectable": ""
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
                "selectable": ""
            }, content, true);
        };
        var menuItem = function (name, id, onClick) {
            return m64.render.tag("paper-item", {
                "id": id,
                "onclick": onClick,
                "selectable": ""
            }, name, true);
        };
        var domId = "mainAppMenu";
        menuPanel.build = function () {
            var rssItems = menuItem("Feeds", "mainMenuRss", "m64.nav.openRssFeedsNode();");
            var mainMenuRss = makeTopLevelMenu("RSS", rssItems);
            var editMenuItems = menuItem("Create", "createNodeButton", "m64.edit.createNode();") +
                menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") +
                menuItem("Cut", "cutSelNodesButton", "m64.edit.cutSelNodes();") +
                menuItem("Paste", "pasteSelNodesButton", "m64.edit.pasteSelNodes();") +
                menuItem("Clear Selections", "clearSelectionsButton", "m64.edit.clearSelections();") +
                menuItem("Import", "openImportDlg", "(new m64.ImportDlg()).open();") +
                menuItem("Export", "openExportDlg", "(new m64.ExportDlg()).open();") +
                menuItem("Delete", "deleteSelNodesButton", "m64.edit.deleteSelNodes();");
            var editMenu = makeTopLevelMenu("Edit", editMenuItems);
            var moveMenuItems = menuItem("Up", "moveNodeUpButton", "m64.edit.moveNodeUp();") +
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
                menuItem("Files", "fileSearchDlgButton", "(new m64.SearchFilesDlg(true)).open();");
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
                    "style": "max-width: 200px;",
                    "src": imgUrl.value
                }, null, false);
            }
            return ret;
        };
        podcast.getMediaPlayerUrlFromNode = function (node) {
            var link = m64.props.getNodeProperty("meta64:rssItemLink", node);
            if (link && link.value && link.value.toLowerCase().contains(".mp3")) {
                return link.value;
            }
            var uri = m64.props.getNodeProperty("meta64:rssItemUri", node);
            if (uri && uri.value && uri.value.toLowerCase().contains(".mp3")) {
                return uri.value;
            }
            var encUrl = m64.props.getNodeProperty("meta64:rssItemEncUrl", node);
            if (encUrl && encUrl.value) {
                var encType = m64.props.getNodeProperty("meta64:rssItemEncType", node);
                if (encType && encType.value && encType.value.startsWith("audio/")) {
                    return encUrl.value;
                }
            }
            return null;
        };
        podcast.renderItemNode = function (node, rowStyling) {
            var ret = "";
            var rssTitle = m64.props.getNodeProperty("meta64:rssItemTitle", node);
            var rssDesc = m64.props.getNodeProperty("meta64:rssItemDesc", node);
            var rssAuthor = m64.props.getNodeProperty("meta64:rssItemAuthor", node);
            var rssLink = m64.props.getNodeProperty("meta64:rssItemLink", node);
            var rssUri = m64.props.getNodeProperty("meta64:rssItemUri", node);
            var entry = "";
            if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
                entry += m64.render.tag("a", {
                    "href": rssLink.value
                }, m64.render.tag("h3", {}, rssTitle.value));
            }
            var playerUrl = podcast.getMediaPlayerUrlFromNode(node);
            if (playerUrl) {
                entry += m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');",
                    "class": "standardButton"
                }, "Play");
            }
            if (rssDesc && rssDesc.value) {
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
        podcast.propOrderingFeedNode = function (node, properties) {
            var propOrder = [
                "meta64:rssFeedTitle",
                "meta64:rssFeedDesc",
                "meta64:rssFeedLink",
                "meta64:rssFeedUri",
                "meta64:rssFeedSrc",
                "meta64:rssFeedImageUrl"];
            return m64.props.orderProps(propOrder, properties);
        };
        podcast.propOrderingItemNode = function (node, properties) {
            var propOrder = [
                "meta64:rssItemTitle",
                "meta64:rssItemDesc",
                "meta64:rssItemLink",
                "meta64:rssItemUri",
                "meta64:rssItemAuthor"];
            return m64.props.orderProps(propOrder, properties);
        };
        podcast.openPlayerDialog = function (_uid) {
            uid = _uid;
            node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                var mp3Url_1 = podcast.getMediaPlayerUrlFromNode(node);
                if (mp3Url_1) {
                    m64.util.json("getPlayerInfo", {
                        "url": mp3Url_1
                    }, function (res) {
                        parseAdSegmentUid(uid);
                        var dlg = new m64.AudioPlayerDlg(mp3Url_1, uid, res.timeOffset);
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
                pushTimer = setInterval(podcast.pushTimerFunction, 10 * 1000);
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
m64.meta64.renderFunctionsByJcrType["meta64:rssitem"] = m64.podcast.renderItemNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = m64.podcast.propOrderingFeedNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = m64.podcast.propOrderingItemNode;
console.log("running module: systemfolder.js");
var m64;
(function (m64) {
    var systemfolder;
    (function (systemfolder) {
        systemfolder.renderNode = function (node, rowStyling) {
            var ret = "";
            var pathProp = m64.props.getNodeProperty("meta64:path", node);
            var path = "";
            if (pathProp) {
                path += m64.render.tag("h2", {}, pathProp.value);
            }
            var reindexButton = m64.render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.systemfolder.reindex('" + node.uid + "');",
                "class": "standardButton"
            }, "Reindex");
            var searchButton = m64.render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.systemfolder.search('" + node.uid + "');",
                "class": "standardButton"
            }, "Search");
            var buttonBar = m64.render.centeredButtonBar(reindexButton + searchButton);
            if (rowStyling) {
                ret += m64.render.tag("div", {
                    "class": "jcr-content"
                }, path + buttonBar);
            }
            else {
                ret += m64.render.tag("div", {
                    "class": "jcr-root-content"
                }, path + buttonBar);
            }
            return ret;
        };
        systemfolder.renderFileListNode = function (node, rowStyling) {
            var ret = "";
            var searchResultProp = m64.props.getNodeProperty(m64.jcrCnst.JSON_FILE_SEARCH_RESULT, node);
            if (searchResultProp) {
                var jcrContent = m64.render.renderJsonFileSearchResultProperty(searchResultProp.value);
                if (rowStyling) {
                    ret += m64.render.tag("div", {
                        "class": "jcr-content"
                    }, jcrContent);
                }
                else {
                    ret += m64.render.tag("div", {
                        "class": "jcr-root-content"
                    }, jcrContent);
                }
            }
            return ret;
        };
        systemfolder.fileListPropOrdering = function (node, properties) {
            var propOrder = [
                "meta64:json"];
            return m64.props.orderProps(propOrder, properties);
        };
        systemfolder.reindex = function (_uid) {
            var selNode = m64.meta64.getHighlightedNode();
            if (selNode) {
                m64.util.json("fileSearch", {
                    "nodeId": selNode.id,
                    "reindex": true,
                    "searchText": null
                }, systemfolder.reindexResponse, systemfolder);
            }
        };
        systemfolder.reindexResponse = function (res) {
            alert("Reindex complete.");
        };
        systemfolder.search = function (_uid) {
            (new m64.SearchFilesDlg(true)).open();
        };
        systemfolder.propOrdering = function (node, properties) {
            var propOrder = [
                "meta64:path"];
            return m64.props.orderProps(propOrder, properties);
        };
    })(systemfolder = m64.systemfolder || (m64.systemfolder = {}));
})(m64 || (m64 = {}));
m64.meta64.renderFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.renderNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.propOrdering;
m64.meta64.renderFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.renderFileListNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.fileListPropOrdering;
console.log("running module: DialogBase.js");
var m64;
(function (m64) {
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
                var modalsContainer = m64.util.polyElm("modalsContainer");
                var id = _this.id(_this.domId);
                var node = document.createElement("paper-dialog");
                node.setAttribute("id", id);
                modalsContainer.node.appendChild(node);
                node.style.border = "3px solid gray";
                Polymer.dom.flush();
                Polymer.updateStyles();
                if (_this.horizCenterDlgContent) {
                    var content = m64.render.tag("div", {
                        "style": "margin: 0 auto; max-width: 800px;"
                    }, _this.build());
                    m64.util.setHtml(id, content);
                }
                else {
                    var content = _this.build();
                    m64.util.setHtml(id, content);
                }
                _this.built = true;
                _this.init();
                console.log("Showing dialog: " + id);
                var polyElm = m64.util.polyElm(id);
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
                    "class": (centered ? "horizontal center-justified layout" : "") + " dialog-header"
                };
                if (id) {
                    attrs["id"] = _this.id(id);
                }
                return m64.render.tag("div", attrs, text);
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
        function SearchFilesDlg(lucene) {
            var _this = this;
            _super.call(this, "SearchFilesDlg");
            this.lucene = lucene;
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
                var nodeId = null;
                var selNode = m64.meta64.getHighlightedNode();
                if (selNode) {
                    nodeId = selNode.id;
                }
                m64.util.json("fileSearch", {
                    "nodeId": nodeId,
                    "reindex": false,
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
        function EditNodeDlg(typeName, createAtTop) {
            var _this = this;
            _super.call(this, "EditNodeDlg");
            this.typeName = typeName;
            this.createAtTop = createAtTop;
            this.fieldIdToPropMap = {};
            this.propEntries = new Array();
            this.build = function () {
                var header = _this.makeHeader("Edit Node");
                var saveNodeButton = _this.makeCloseButton("Save", "saveNodeButton", _this.saveNode, _this);
                var addPropertyButton = _this.makeButton("Add Property", "addPropertyButton", _this.addProperty, _this);
                var addTagsPropertyButton = _this.makeButton("Add Tags", "addTagsPropertyButton", _this.addTagsProperty, _this);
                var splitContentButton = _this.makeButton("Split", "splitContentButton", _this.splitContent, _this);
                var deletePropButton = _this.makeButton("Delete", "deletePropButton", _this.deletePropertyButtonClick, _this);
                var cancelEditButton = _this.makeCloseButton("Close", "cancelEditButton", _this.cancelEdit, _this);
                var buttonBar = m64.render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton + deletePropButton
                    + splitContentButton + cancelEditButton, "buttons");
                var width = 800;
                var height = 600;
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
                    style: "padding-left: 0px; max-width:" + width + "px;height:" + height + "px;width:100%; overflow:scroll; border:4px solid lightGray;",
                    class: "vertical-layout-row"
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
                    var editOrderedProps = m64.props.getPropertiesInEditingOrder(m64.edit.editNode, m64.edit.editNode.properties);
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
                        fields += m64.render.tag("div", { "display": "table-row" }, field);
                    }
                }
                var propTable = m64.render.tag("div", {
                    "display": "table",
                }, fields);
                m64.util.setHtml(_this.id("propertyEditFieldContainer"), propTable);
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
                if (prop.name !== m64.jcrCnst.CONTENT && !prop.name.startsWith("meta64:")) {
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
                        "typeName": _this.typeName ? _this.typeName : "nt:unstructured"
                    }, m64.edit.insertNodeResponse, m64.edit);
                }
                else {
                    m64.util.json("createSubNode", {
                        "nodeId": m64.edit.parentOfNewNode.id,
                        "newNodeName": newNodeName,
                        "typeName": _this.typeName ? _this.typeName : "nt:unstructured",
                        "createAtTop": _this.createAtTop
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
                var col = m64.render.tag("div", {
                    "style": "display: table-cell;"
                }, fields);
                return col;
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
                var propSelCheckbox = "";
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
                    propSelCheckbox = _this.makeCheckBox("", "selProp_" + propEntry.id, false);
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
                var selCol = m64.render.tag("div", {
                    "style": "width: 40px; display: table-cell; padding: 10px;"
                }, propSelCheckbox);
                var editCol = m64.render.tag("div", {
                    "style": "width: 100%; display: table-cell; padding: 10px;"
                }, field);
                return selCol + editCol;
            };
            this.deletePropertyButtonClick = function () {
                for (var id in _this.fieldIdToPropMap) {
                    if (_this.fieldIdToPropMap.hasOwnProperty(id)) {
                        var propEntry = _this.fieldIdToPropMap[id];
                        if (propEntry) {
                            var selPropDomId = "selProp_" + propEntry.id;
                            var selCheckbox = m64.util.polyElm(_this.id(selPropDomId));
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
            this.editNodeDlg = editNodeDlg;
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
                    "<div class='vertical-layout-row' style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
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
                    "style": "width: 100%; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
                    "ontimeupdate": "m64.podcast.onTimeUpdate('" + _this.nodeUid + "', this);",
                    "oncanplay": "m64.podcast.onCanPlay('" + _this.nodeUid + "', this);",
                    "controls": "controls",
                    "preload": "auto"
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
                var skipButtonBar = m64.render.centeredButtonBar(skipBack30Button + skipForward30Button);
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
                var speedButtonBar = m64.render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);
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
                return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
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
                var createFirstChildButton = _this.makeCloseButton("Create First Child", "createFirstChildButton", _this.createFirstChild, _this);
                var createLastChildButton = _this.makeCloseButton("Create Last Child", "createLastChildButton", _this.createLastChild, _this);
                var createInlineButton = _this.makeCloseButton("Create Inline", "createInlineButton", _this.createInline, _this);
                var backButton = _this.makeCloseButton("Cancel", "cancelButton");
                var buttonBar = m64.render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);
                var content = "";
                var typeIdx = 0;
                content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++);
                content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++);
                content += _this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++);
                var mainContent = m64.render.tag("div", {
                    "class": "listBox"
                }, content);
                return header + mainContent + buttonBar;
            };
            this.createFirstChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.createSubNode(null, _this.lastSelTypeName, true);
            };
            this.createLastChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.createSubNode(null, _this.lastSelTypeName, false);
            };
            this.createInline = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.insertNode(null, _this.lastSelTypeName);
            };
            this.onRowClick = function (payload) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvc3lzdGVtZm9sZGVyLnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvZGxnL0NyZWF0ZU5vZGVEbGcudHMiLCIuLi90cy9wYW5lbC9zZWFyY2hSZXN1bHRzUGFuZWwudHMiLCIuLi90cy9wYW5lbC90aW1lbGluZVJlc3VsdHNQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0FBLFlBQVksQ0FBQztBQUtiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUs5QixJQUFJLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBTUY7QUFFQSxDQUFDO0FBRUQsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFZekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxVQUFTLENBQUM7SUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQyxDQUFDO0FDNUNILE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQU12QyxJQUFVLEdBQUcsQ0E0Qlo7QUE1QkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLElBQUksQ0EwQnBCO0lBMUJELFdBQWlCLElBQUksRUFBQyxDQUFDO1FBRVIsU0FBSSxHQUFXLFdBQVcsQ0FBQztRQUMzQixxQkFBZ0IsR0FBVyxZQUFZLEdBQUcsVUFBVSxDQUFDO1FBQ3JELHFCQUFnQixHQUFXLFlBQVksR0FBRyxVQUFVLENBQUM7UUFJckQsdUJBQWtCLEdBQVcsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUV6RCxzQkFBaUIsR0FBVyx1QkFBdUIsQ0FBQztRQUNwRCxtQkFBYyxHQUFZLElBQUksQ0FBQztRQUMvQixtQkFBYyxHQUFZLElBQUksQ0FBQztRQUMvQiwyQkFBc0IsR0FBWSxJQUFJLENBQUM7UUFNdkMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFHaEMsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBQ2xDLHNCQUFpQixHQUFZLElBQUksQ0FBQztRQUVsQyxnQ0FBMkIsR0FBWSxLQUFLLENBQUM7SUFDNUQsQ0FBQyxFQTFCZ0IsSUFBSSxHQUFKLFFBQUksS0FBSixRQUFJLFFBMEJwQjtBQUNMLENBQUMsRUE1QlMsR0FBRyxLQUFILEdBQUcsUUE0Qlo7QUNqQ0QsSUFBVSxHQUFHLENBeUJaO0FBekJELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFJWDtRQUNJLG1CQUFtQixTQUFpQixFQUN6QixPQUFlO1lBRFAsY0FBUyxHQUFULFNBQVMsQ0FBUTtZQUN6QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQzFCLENBQUM7UUFDTCxnQkFBQztJQUFELENBQUMsQUFKRCxJQUlDO0lBSlksYUFBUyxZQUlyQixDQUFBO0lBRUQ7UUFDSSxtQkFBbUIsRUFBVSxFQUNsQixRQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBaUIsRUFDakIsTUFBZSxFQUNmLFFBQW1CO1lBTFgsT0FBRSxHQUFGLEVBQUUsQ0FBUTtZQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFtQjtZQUMzQixVQUFLLEdBQUwsS0FBSyxDQUFTO1lBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBUztZQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFTO1lBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUM5QixDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBUkQsSUFRQztJQVJZLGFBQVMsWUFRckIsQ0FBQTtJQUVEO1FBQ0ksaUJBQW1CLEVBQVUsRUFDbEIsR0FBVztZQURILE9BQUUsR0FBRixFQUFFLENBQVE7WUFDbEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUN0QixDQUFDO1FBQ0wsY0FBQztJQUFELENBQUMsQUFKRCxJQUlDO0lBSlksV0FBTyxVQUluQixDQUFBO0FBQ0wsQ0FBQyxFQXpCUyxHQUFHLEtBQUgsR0FBRyxRQXlCWjtBQzFCRCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFRdkMsc0JBQXNCLE1BQU07SUFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDakUsQ0FBQztBQWdCQSxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUc7SUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxVQUFTLFFBQVEsRUFBRSxPQUFPO0lBQzFELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztJQUNMLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxDQUFDLENBQUM7QUFLRixLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxVQUFTLFNBQVMsRUFBRSxPQUFPO0lBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUMsQ0FBQztBQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNyRCxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxVQUFTLEdBQUc7UUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFTQSxDQUFDO0FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRztJQUMvQixJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdDLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUN0RSxDQUFDLENBQUE7QUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRztJQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDL0QsQ0FBQyxDQUFBO0FBZUQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVMsR0FBRztRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsVUFBUyxHQUFHO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVMsR0FBRztRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVMsSUFBSSxFQUFFLE9BQU87UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUc7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQzthQUMvQixVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUN2QixVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUN2QixVQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQzthQUN6QixVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUc7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQTtBQUNMLENBQUM7QUFFRCxJQUFVLEdBQUcsQ0E4bUJaO0FBOW1CRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsSUFBSSxDQTRtQnBCO0lBNW1CRCxXQUFpQixJQUFJLEVBQUMsQ0FBQztRQUVSLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsd0JBQW1CLEdBQVksS0FBSyxDQUFDO1FBQ3JDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsWUFBTyxHQUFRLElBQUksQ0FBQztRQU9wQixrQkFBYSxHQUFHLFVBQVMsT0FBTztZQUN2QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLElBQUksY0FBVSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDN0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1ELElBQUksWUFBWSxHQUFXLENBQUMsQ0FBQztRQUdsQix3QkFBbUIsR0FBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBRWpFLFdBQU0sR0FBRyxVQUFTLEdBQUc7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUE7UUFNVSx1QkFBa0IsR0FBRyxVQUFTLElBQVUsRUFBRSxHQUFTO1lBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUNMLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZGLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNkLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQTtRQU9VLFlBQU8sR0FBRyxVQUFTLE1BQU0sRUFBRSxLQUFLO1lBQ3ZDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUNwQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVVLHdCQUFtQixHQUFHO1lBQzdCLFdBQVcsQ0FBQyxxQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUE7UUFFVSxxQkFBZ0IsR0FBRztZQUMxQixJQUFJLFNBQVMsR0FBRyxrQkFBYSxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDWixnQkFBVyxFQUFFLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsZ0JBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsWUFBTyxHQUFHLElBQUksZUFBVyxFQUFFLENBQUM7d0JBQzVCLFlBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbkIsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxZQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLFlBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakIsWUFBTyxHQUFHLElBQUksQ0FBQztnQkFDbkIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxTQUFJLEdBQUcsVUFBcUMsUUFBYSxFQUFFLFFBQXFCLEVBQ3ZGLFFBQXlELEVBQUUsWUFBa0IsRUFBRSxlQUFxQjtZQUVwRyxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsR0FBRyxRQUFRLEdBQUcsNkVBQTZFLENBQUMsQ0FBQztZQUMzSSxDQUFDO1lBRUQsSUFBSSxRQUFRLENBQUM7WUFDYixJQUFJLFdBQVcsQ0FBQztZQUVoQixJQUFJLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsWUFBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyxDQUFDO29CQUN0RCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxZQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pGLENBQUM7Z0JBTUQsUUFBUSxHQUFHLGdCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRW5DLFFBQVEsQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztnQkFDeEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUM7Z0JBSzFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQU0zQixRQUFRLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUdsQyxZQUFZLEVBQUUsQ0FBQztnQkFDZixXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdDLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsMkJBQTJCLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFtQkQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBR3RCO2dCQUNJLElBQUksQ0FBQztvQkFDRCxZQUFZLEVBQUUsQ0FBQztvQkFDZixxQkFBZ0IsRUFBRSxDQUFDO29CQUVuQixFQUFFLENBQUMsQ0FBQyxZQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxHQUFHLDBCQUEwQjs4QkFDakUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQU1oQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dDQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUNyRixDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLFFBQVEsQ0FBZSxXQUFXLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDOzRCQUNsRSxDQUFDO3dCQUNMLENBQUM7d0JBS0QsSUFBSSxDQUFDLENBQUM7NEJBQ0YsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQ0FDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBZ0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUNwRSxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLFFBQVEsQ0FBZSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ2pELENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDVixrQkFBYSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDaEUsQ0FBQztZQUVMLENBQUMsRUFFRDtnQkFDSSxJQUFJLENBQUM7b0JBQ0QsWUFBWSxFQUFFLENBQUM7b0JBQ2YscUJBQWdCLEVBQUUsQ0FBQztvQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUVsQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQzt3QkFDL0MsWUFBTyxHQUFHLElBQUksQ0FBQzt3QkFFZixFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixDQUFDLENBQUMsQ0FBQzs0QkFDdkIsd0JBQW1CLEdBQUcsSUFBSSxDQUFDOzRCQUMzQixDQUFDLElBQUksY0FBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDckUsQ0FBQzt3QkFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDOUMsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBRUQsSUFBSSxHQUFHLEdBQVcsNEJBQTRCLENBQUM7b0JBRy9DLElBQUksQ0FBQzt3QkFDRCxHQUFHLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3dCQUNsRCxHQUFHLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNoRCxDQUFFO29CQUFBLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsQ0FBQztvQkFhRCxDQUFDLElBQUksY0FBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2pDLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDVixrQkFBYSxDQUFDLHlDQUF5QyxHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRVAsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSxnQkFBVyxHQUFHLFVBQVMsT0FBZTtZQUM3QyxJQUFJLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztZQUNyQyxJQUFJLENBQUM7Z0JBQ0QsS0FBSyxHQUFHLENBQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyQyxDQUNBO1lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxPQUFPLENBQUM7UUFDbEIsQ0FBQyxDQUFBO1FBRVUsa0JBQWEsR0FBRyxVQUFTLE9BQWUsRUFBRSxTQUFjO1lBQy9ELElBQUksS0FBSyxHQUFHLHdCQUF3QixDQUFDO1lBQ3JDLElBQUksQ0FBQztnQkFDRCxLQUFLLEdBQUcsQ0FBTSxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3JDLENBQ0E7WUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLFNBQVMsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxjQUFTLEdBQUcsVUFBUyxXQUFXO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLFdBQVcsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO2dCQUNuRixNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUc7WUFDdkIsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFBO1FBR1UsaUJBQVksR0FBRyxVQUFTLEVBQUU7WUFFakMsVUFBVSxDQUFDO2dCQUNQLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFHUixVQUFVLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQTtRQVNVLGlCQUFZLEdBQUcsVUFBUyxjQUFjLEVBQUUsR0FBRztZQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLENBQUMsSUFBSSxjQUFVLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4RSxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBR1UsV0FBTSxHQUFHLFVBQVMsR0FBRyxFQUFFLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQUc7WUFDakMsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFNVSxnQkFBVyxHQUFHLFVBQVMsR0FBOEIsRUFBRSxFQUFFO1lBRWhFLElBQUksR0FBRyxHQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUcxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxHQUFHLEVBQUUsR0FBRyxVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDbEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHLFVBQVMsRUFBRTtZQUNsQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDckIsQ0FBQyxDQUFBO1FBR1UsdUJBQWtCLEdBQUcsVUFBUyxFQUFFO1lBQ3ZDLElBQUksRUFBRSxHQUFnQixXQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFvQixFQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQUtVLFdBQU0sR0FBRyxVQUFTLEVBQUU7WUFDM0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFBO1FBRVUsU0FBSSxHQUFHLFVBQVMsRUFBRTtZQUN6QixNQUFNLENBQUMsWUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM1QixDQUFDLENBQUE7UUFLVSxZQUFPLEdBQUcsVUFBUyxFQUFVO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBQ0QsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN0RSxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEVBQVU7WUFDeEMsSUFBSSxDQUFDLEdBQUcsWUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUtVLHVCQUFrQixHQUFHLFVBQVMsRUFBVTtZQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFBO1FBRVUsYUFBUSxHQUFHLFVBQVMsR0FBUTtZQUNuQyxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUVVLHNCQUFpQixHQUFHO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQUVVLGdCQUFXLEdBQUcsVUFBUyxHQUFXO1lBQ3pDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUE7UUFFVSxnQkFBVyxHQUFHLFVBQVMsRUFBVTtZQUN4QyxNQUFNLENBQUMsWUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBR1UsZ0JBQVcsR0FBRyxVQUFTLEVBQVUsRUFBRSxHQUFXO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixDQUFDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsWUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSxpQkFBWSxHQUFHLFVBQVMsRUFBVSxFQUFFLElBQVM7WUFDcEQsWUFBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFBO1FBRVUsWUFBTyxHQUFHLFVBQVMsRUFBVSxFQUFFLElBQVMsRUFBRSxPQUFZO1lBQzdELENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBUyxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksRUFBRSxDQUFDO29CQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFBO1FBT1UscUJBQWdCLEdBQUcsVUFBUyxHQUFXLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtZQUNsRixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO1FBS1UsZUFBVSxHQUFHLFVBQVMsR0FBUSxFQUFFLElBQVMsRUFBRSxHQUFXO1lBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsSUFBSSxjQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSxZQUFPLEdBQUcsVUFBUyxFQUFVLEVBQUUsT0FBZTtZQUNyRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQUcsV0FBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFLL0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUcsVUFBUyxHQUFXO1lBQzlDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksSUFBSSxDQUFDO1lBRVQsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUssRUFBRSxDQUFDO2dCQUNaLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFLVSxnQkFBVyxHQUFHLFVBQVMsR0FBVztZQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFBO1lBQ3BCLElBQUksQ0FBQztnQkFDRCxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ3ZDLEtBQUssRUFBRSxDQUFDO29CQUNaLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDO29CQUNyQixHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFHVSxjQUFTLEdBQUcsVUFBUyxHQUFXO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFFbEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUNmLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixHQUFHLElBQUksR0FBRyxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQU9VLGtCQUFhLEdBQUcsVUFBUyxLQUFhLEVBQUUsTUFBZTtZQUU5RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLEdBQUcsV0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUVWLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFFSixHQUFHLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBT1Usa0JBQWEsR0FBRyxVQUFTLEtBQWEsRUFBRSxHQUFZO1lBRTNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEdBQUcsR0FBRyxXQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDaEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUdOLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBR0osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNVSxnQkFBVyxHQUFHLFVBQWEsT0FBZSxFQUFFLElBQVk7WUFBRSxjQUFjO2lCQUFkLFdBQWMsQ0FBZCxzQkFBYyxDQUFkLElBQWM7Z0JBQWQsNkJBQWM7O1lBQy9FLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RELFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUksUUFBUSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQTtJQUNMLENBQUMsRUE1bUJnQixJQUFJLEdBQUosUUFBSSxLQUFKLFFBQUksUUE0bUJwQjtBQUNMLENBQUMsRUE5bUJTLEdBQUcsS0FBSCxHQUFHLFFBOG1CWjtBQ3h2QkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRTFDLElBQVUsR0FBRyxDQXFDWjtBQXJDRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsT0FBTyxDQW1DdkI7SUFuQ0QsV0FBaUIsT0FBTyxFQUFDLENBQUM7UUFFWCxrQkFBVSxHQUFXLFdBQVcsQ0FBQztRQUNqQyxxQkFBYSxHQUFXLGNBQWMsQ0FBQztRQUN2QyxvQkFBWSxHQUFXLGlCQUFpQixDQUFDO1FBQ3pDLGNBQU0sR0FBVyxZQUFZLENBQUM7UUFFOUIsbUJBQVcsR0FBVyxnQkFBZ0IsQ0FBQztRQUV2QyxxQkFBYSxHQUFXLGFBQWEsQ0FBQztRQUN0QyxtQkFBVyxHQUFXLE9BQU8sQ0FBQztRQUM5QixxQkFBYSxHQUFXLFNBQVMsQ0FBQztRQUVsQyxlQUFPLEdBQVcsYUFBYSxDQUFDO1FBQ2hDLGtCQUFVLEdBQVcsZUFBZSxDQUFDO1FBQ3JDLGVBQU8sR0FBVyxhQUFhLENBQUM7UUFDaEMsWUFBSSxHQUFXLE1BQU0sQ0FBQztRQUN0QixZQUFJLEdBQVcsVUFBVSxDQUFDO1FBQzFCLHFCQUFhLEdBQVcsa0JBQWtCLENBQUM7UUFDM0Msd0JBQWdCLEdBQVcsb0JBQW9CLENBQUM7UUFDaEQsK0JBQXVCLEdBQVcsYUFBYSxDQUFDO1FBRWhELHNCQUFjLEdBQVcsZUFBZSxDQUFDO1FBRXpDLFlBQUksR0FBVyxNQUFNLENBQUM7UUFDdEIsV0FBRyxHQUFXLEtBQUssQ0FBQztRQUNwQixhQUFLLEdBQVcsT0FBTyxDQUFDO1FBQ3hCLFlBQUksR0FBVyxNQUFNLENBQUM7UUFFdEIsZUFBTyxHQUFXLFFBQVEsQ0FBQztRQUMzQixnQkFBUSxHQUFXLFNBQVMsQ0FBQztRQUM3QixnQkFBUSxHQUFXLGNBQWMsQ0FBQztRQUVsQyxpQkFBUyxHQUFXLFVBQVUsQ0FBQztRQUMvQixrQkFBVSxHQUFXLFdBQVcsQ0FBQztJQUNoRCxDQUFDLEVBbkNnQixPQUFPLEdBQVAsV0FBTyxLQUFQLFdBQU8sUUFtQ3ZCO0FBQ0wsQ0FBQyxFQXJDUyxHQUFHLEtBQUgsR0FBRyxRQXFDWjtBQ3ZDRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFN0MsSUFBVSxHQUFHLENBMERaO0FBMURELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWCxJQUFpQixVQUFVLENBd0QxQjtJQXhERCxXQUFpQixVQUFVLEVBQUMsQ0FBQztRQUVkLHFCQUFVLEdBQVEsSUFBSSxDQUFDO1FBRXZCLGdDQUFxQixHQUFHO1lBQy9CLElBQUksSUFBSSxHQUFpQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLHFCQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixDQUFDLElBQUksY0FBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELHFCQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLENBQUMsSUFBSSw2QkFBeUIsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFPN0MsQ0FBQyxDQUFBO1FBRVUsK0JBQW9CLEdBQUc7WUFDOUIsSUFBSSxJQUFJLEdBQWlCLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRXJELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixxQkFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxxQkFBVSxHQUFHLElBQUksQ0FBQztZQUNsQixDQUFDLElBQUksb0JBQWdCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUVVLDJCQUFnQixHQUFHO1lBQzFCLElBQUksSUFBSSxHQUFpQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUVyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsSUFBSSxjQUFVLENBQUMsMkJBQTJCLEVBQUUsb0NBQW9DLEVBQUUsY0FBYyxFQUM3RjtvQkFDSSxRQUFJLENBQUMsSUFBSSxDQUE4RCxrQkFBa0IsRUFBRTt3QkFDdkYsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO3FCQUNwQixFQUFFLG1DQUF3QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLG1DQUF3QixHQUFHLFVBQVMsR0FBa0MsRUFBRSxHQUFRO1lBQ3ZGLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxVQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTlCLFVBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUMsRUF4RGdCLFVBQVUsR0FBVixjQUFVLEtBQVYsY0FBVSxRQXdEMUI7QUFDTCxDQUFDLEVBMURTLEdBQUcsS0FBSCxHQUFHLFFBMERaO0FDNURELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUV2QyxJQUFVLEdBQUcsQ0EwZ0JaO0FBMWdCRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsSUFBSSxDQXdnQnBCO0lBeGdCRCxXQUFpQixJQUFJLEVBQUMsQ0FBQztRQUVSLGVBQVUsR0FBRztZQUNwQixDQUFDLElBQUksR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFBO1FBRUQsSUFBSSxrQkFBa0IsR0FBRyxVQUFTLEdBQTRCO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUUzQyxRQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QyxRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QixVQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hDLFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVELElBQUksbUJBQW1CLEdBQUcsVUFBUyxHQUE2QixFQUFFLE9BQWU7WUFDN0UsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNWLFdBQVcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUM3QixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxJQUFJLG9CQUFvQixHQUFHLFVBQVMsR0FBOEI7WUFDOUQsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLElBQUksR0FBa0IsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQXNDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUduSCxJQUFJLGNBQWMsR0FBWSxTQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsY0FBYyxHQUFHLENBQUMsVUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQzsyQkFDOUUsQ0FBQyxTQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBS2pCLGFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO29CQUN4QixvQkFBZSxHQUFHLElBQUksZUFBVyxFQUFFLENBQUM7b0JBQ3BDLG9CQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osQ0FBQyxJQUFJLGNBQVUsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pFLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsSUFBSSxpQkFBaUIsR0FBRyxVQUFTLEdBQTJCO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQ25CLG1CQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUNwQixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsSUFBSSx1QkFBdUIsR0FBRyxVQUFTLEdBQWlDO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLDJCQUFzQixHQUFZLElBQUksQ0FBQztRQUl2QyxnQkFBVyxHQUFRLElBQUksQ0FBQztRQUt4QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUU1QixvQkFBZSxHQUFrQixJQUFJLENBQUM7UUFLdEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBS3BDLGdDQUEyQixHQUFZLEtBQUssQ0FBQztRQVE3QyxhQUFRLEdBQWtCLElBQUksQ0FBQztRQUcvQixvQkFBZSxHQUFnQixJQUFJLENBQUM7UUFVcEMscUJBQWdCLEdBQVEsSUFBSSxDQUFDO1FBRzdCLGtCQUFhLEdBQUcsVUFBUyxJQUFTO1lBQ3pDLE1BQU0sQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7Z0JBSXRELENBQUMsQ0FBQyxTQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksU0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO21CQUNuRSxDQUFDLFNBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBR1Usb0JBQWUsR0FBRyxVQUFTLElBQVM7WUFDM0MsTUFBTSxDQUFDLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUMxRSxDQUFDLENBQUE7UUFFVSx3QkFBbUIsR0FBRyxVQUFTLFFBQWlCLEVBQUUsV0FBb0I7WUFDN0UsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQzNCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsb0JBQWUsR0FBRyxJQUFJLGVBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDekQsb0JBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBY1UsZ0NBQTJCLEdBQUc7WUFDckMsdUJBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQzFCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsb0JBQWUsR0FBRyxJQUFJLGVBQVcsRUFBRSxDQUFDO1lBQ3BDLG9CQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRVUsdUJBQWtCLEdBQUcsVUFBUyxHQUE0QjtZQUNqRSxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLFVBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkMsVUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxnQkFBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLDBCQUFxQixHQUFHLFVBQVMsR0FBK0I7WUFDdkUsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLFVBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkMsZ0JBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQTBCLEVBQUUsT0FBWTtZQUMzRSxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBTXRDLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9DLFVBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGFBQVEsR0FBRyxVQUFTLE9BQWlCO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM5QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNyRixDQUFDO1lBR0QsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFNNUIsUUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFFNUIsVUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDakMsQ0FBQyxDQUFBO1FBRVUsZUFBVSxHQUFHLFVBQVMsR0FBWTtZQUV6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxPQUFPLEdBQWtCLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN6RCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN0QixDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLFNBQVMsR0FBRyxpQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsUUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7b0JBQ3BGLGNBQWMsRUFBRSxVQUFNLENBQUMsYUFBYTtvQkFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixXQUFXLEVBQUUsU0FBUyxDQUFDLElBQUk7aUJBQzlCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsaUJBQVksR0FBRyxVQUFTLEdBQVk7WUFFM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksT0FBTyxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDekQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFrQixVQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxTQUFTLEdBQWtCLGlCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwQixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxRQUFJLENBQUMsSUFBSSxDQUE0RCxpQkFBaUIsRUFBRTtvQkFDcEYsY0FBYyxFQUFFLFVBQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlDLFFBQVEsRUFBRSxTQUFTLENBQUMsSUFBSTtvQkFDeEIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUN6QixFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUcsVUFBUyxHQUFZO1lBRTVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBa0IsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3pELEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLElBQUksR0FBa0IsVUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksT0FBTyxHQUFHLHNCQUFpQixFQUFFLENBQUM7Z0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxRQUFJLENBQUMsSUFBSSxDQUE0RCxpQkFBaUIsRUFBRTtvQkFDcEYsY0FBYyxFQUFFLFVBQU0sQ0FBQyxhQUFhO29CQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLFdBQVcsRUFBRSxPQUFPLENBQUMsSUFBSTtpQkFDNUIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQVk7WUFFL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksT0FBTyxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDekQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFrQixVQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsUUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7b0JBQ3BGLGNBQWMsRUFBRSxVQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM5QyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLFdBQVcsRUFBRSxJQUFJO2lCQUNwQixFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUtVLGlCQUFZLEdBQUcsVUFBUyxJQUFJO1lBQ25DLElBQUksT0FBTyxHQUFXLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsTUFBTSxDQUFDLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUE7UUFLVSxpQkFBWSxHQUFHLFVBQVMsSUFBUztZQUN4QyxJQUFJLE9BQU8sR0FBVyxVQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRWhCLE1BQU0sQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFBO1FBRVUsc0JBQWlCLEdBQUc7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsZUFBZSxJQUFJLENBQUMsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM3RSxNQUFNLENBQUMsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQVE7WUFDdEMsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLGFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLENBQUMsSUFBSSxjQUFVLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELHVCQUFrQixHQUFHLEtBQUssQ0FBQztZQUUzQixRQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7Z0JBQzNFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTthQUNwQixFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBRVUsZUFBVSxHQUFHLFVBQVMsR0FBUyxFQUFFLFFBQWlCO1lBRXpELG9CQUFlLEdBQUcsVUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFNRCxJQUFJLElBQUksR0FBa0IsSUFBSSxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdkMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksR0FBRyxVQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLHFCQUFnQixHQUFHLElBQUksQ0FBQztnQkFDeEIsd0JBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUcsVUFBUyxHQUFTLEVBQUUsUUFBaUIsRUFBRSxXQUFxQjtZQU1uRixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxhQUFhLEdBQWtCLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMvRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixvQkFBZSxHQUFHLGFBQWEsQ0FBQztnQkFDcEMsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRixvQkFBZSxHQUFHLFVBQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osb0JBQWUsR0FBRyxVQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFlLENBQUMsQ0FBQyxDQUFDO29CQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUN2RCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztZQUNMLENBQUM7WUFLRCxxQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDeEIsd0JBQW1CLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQTtRQUVVLG1CQUFjLEdBQUcsVUFBUyxHQUFRO1lBQ3pDLGtCQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBRVUsb0JBQWUsR0FBRztZQUN6QixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQU81QixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixVQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQU1VLG1CQUFjLEdBQUc7WUFDeEIsSUFBSSxhQUFhLEdBQUcsVUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLElBQUksY0FBVSxDQUFDLGdFQUFnRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDMUYsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELENBQUMsSUFBSSxjQUFVLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsWUFBWSxFQUFFLGNBQWMsRUFDN0Y7Z0JBQ0ksSUFBSSxpQkFBaUIsR0FBa0IsNkJBQXdCLEVBQUUsQ0FBQztnQkFFbEUsUUFBSSxDQUFDLElBQUksQ0FBb0QsYUFBYSxFQUFFO29CQUN4RSxTQUFTLEVBQUUsYUFBYTtpQkFDM0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFHVSw2QkFBd0IsR0FBRztZQUVsQyxJQUFJLFFBQVEsR0FBVyxVQUFNLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUMxRCxJQUFJLFFBQVEsR0FBa0IsSUFBSSxDQUFDO1lBQ25DLElBQUksWUFBWSxHQUFZLEtBQUssQ0FBQztZQUlsQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5RCxJQUFJLElBQUksR0FBa0IsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTdELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFHRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDeEIsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRixRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRztZQUVyQixJQUFJLGFBQWEsR0FBRyxVQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLENBQUMsSUFBSSxjQUFVLENBQUMsc0RBQXNELENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsQ0FBQyxJQUFJLGNBQVUsQ0FDWCxhQUFhLEVBQ2IsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsMkNBQTJDLEVBQzNFLEtBQUssRUFDTDtnQkFDSSxnQkFBVyxHQUFHLGFBQWEsQ0FBQztnQkFDNUIsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRWxDLFVBQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUcxQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDNUIsVUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsT0FBaUI7WUFDL0MsbUJBQWMsR0FBRyxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLENBQVcsVUFBTyxFQUFQLG1CQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPLENBQUM7Z0JBQWxCLElBQUksRUFBRSxnQkFBQTtnQkFDUCxtQkFBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM3QjtRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUc7WUFDdkIsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxHQUFHLGdCQUFXLENBQUMsTUFBTSxHQUFHLHVDQUF1QyxFQUNwRyxhQUFhLEVBQUU7Z0JBRVgsSUFBSSxhQUFhLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBT2hELFFBQUksQ0FBQyxJQUFJLENBQWdELFdBQVcsRUFBRTtvQkFDbEUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxFQUFFO29CQUNoQyxlQUFlLEVBQUUsYUFBYSxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRSxHQUFHLElBQUk7b0JBQ2hFLFNBQVMsRUFBRSxnQkFBVztpQkFDekIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRVUsMEJBQXFCLEdBQUc7WUFDL0IsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxTQUFTLEVBQUUsMkhBQTJILEVBQUUsbUJBQW1CLEVBQUU7Z0JBR3pLLElBQUksSUFBSSxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osUUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO3dCQUNyRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQ2pCLFVBQVUsRUFBRSxlQUFlO3dCQUMzQixXQUFXLEVBQUUsUUFBSSxDQUFDLGlCQUFpQixFQUFFO3FCQUN4QyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzNCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQXhnQmdCLElBQUksR0FBSixRQUFJLEtBQUosUUFBSSxRQXdnQnBCO0FBQ0wsQ0FBQyxFQTFnQlMsR0FBRyxLQUFILEdBQUcsUUEwZ0JaO0FDNWdCRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFNekMsSUFBVSxHQUFHLENBMDBCWjtBQTEwQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLE1BQU0sQ0F3MEJ0QjtJQXgwQkQsV0FBaUIsTUFBTSxFQUFDLENBQUM7UUFFVixxQkFBYyxHQUFZLEtBQUssQ0FBQztRQUVoQyxpQkFBVSxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBSXZFLHNCQUFlLEdBQVksS0FBSyxDQUFDO1FBR2pDLGVBQVEsR0FBVyxDQUFDLENBQUM7UUFHckIsZUFBUSxHQUFXLFdBQVcsQ0FBQztRQUcvQixrQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixtQkFBWSxHQUFXLENBQUMsQ0FBQztRQUt6QixpQkFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixtQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUsxQixrQkFBVyxHQUFZLEtBQUssQ0FBQztRQUc3QixpQkFBVSxHQUFZLElBQUksQ0FBQztRQUMzQiw4QkFBdUIsR0FBUSxJQUFJLENBQUM7UUFDcEMsNEJBQXFCLEdBQVksS0FBSyxDQUFDO1FBTXZDLGdCQUFTLEdBQVksS0FBSyxDQUFDO1FBUzNCLG1CQUFZLEdBQXFDLEVBQUUsQ0FBQztRQUtwRCxrQkFBVyxHQUFxQyxFQUFFLENBQUM7UUFHbkQscUJBQWMsR0FBUSxFQUFFLENBQUM7UUFHekIsY0FBTyxHQUFXLENBQUMsQ0FBQztRQU1wQixvQkFBYSxHQUE4QixFQUFFLENBQUM7UUFTOUMsOEJBQXVCLEdBQXFDLEVBQUUsQ0FBQztRQUcvRCxvQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUNuQyxrQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUcvQixxQkFBYyxHQUFXLFFBQVEsQ0FBQztRQUtsQyxxQkFBYyxHQUFZLEtBQUssQ0FBQztRQUdoQyxtQkFBWSxHQUFZLEtBQUssQ0FBQztRQUs5QixvQ0FBNkIsR0FBUTtZQUM1QyxNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFFUyxrQ0FBMkIsR0FBUSxFQUFFLENBQUM7UUFFdEMsMkJBQW9CLEdBQVEsRUFBRSxDQUFDO1FBRS9CLHlCQUFrQixHQUFRLEVBQUUsQ0FBQztRQUs3QixvQkFBYSxHQUFRLEVBQUUsQ0FBQztRQUd4Qiw0QkFBcUIsR0FBUSxFQUFFLENBQUM7UUFHaEMsc0JBQWUsR0FBUSxJQUFJLENBQUM7UUFLNUIsa0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBQ2xDLHFCQUFjLEdBQVEsSUFBSSxDQUFDO1FBQzNCLG9CQUFhLEdBQVEsSUFBSSxDQUFDO1FBQzFCLHNCQUFlLEdBQVEsSUFBSSxDQUFDO1FBRzVCLGlCQUFVLEdBQVEsRUFBRSxDQUFDO1FBRXJCLCtCQUF3QixHQUFnQyxFQUFFLENBQUM7UUFDM0QscUNBQThCLEdBQWdDLEVBQUUsQ0FBQztRQUVqRSxzQkFBZSxHQUF5QjtZQUMvQyxVQUFVLEVBQUUsS0FBSztZQUNqQixjQUFjLEVBQUUsS0FBSztZQUNyQixVQUFVLEVBQUUsRUFBRTtZQUNkLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGNBQWMsRUFBRSxLQUFLO1NBQ3hCLENBQUM7UUFFUywwQkFBbUIsR0FBRztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDeEMsYUFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLGFBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUE7UUFNVSx5QkFBa0IsR0FBRyxVQUFTLElBQUk7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsZUFBUSxDQUFDO2dCQUN2QixpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHNCQUFlLEdBQUcsVUFBUyxJQUFJO1lBQ3RDLElBQUksR0FBRyxHQUFHLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFrQlUsb0JBQWEsR0FBRyxVQUFTLFFBQWEsRUFBRSxHQUFTLEVBQUUsT0FBYTtZQUN2RSxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BCLENBQUM7WUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDckMseUJBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ04seUJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXhCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YseUJBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hDLENBQUM7b0JBQ0QsSUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO29CQUVqRCxNQUFNLENBQUMseUJBQXlCLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDaEcsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMseUJBQXlCLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzVELENBQUM7WUFDTCxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsTUFBTSwyQ0FBMkMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsa0JBQVcsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTztZQUNoRCxJQUFJLE9BQU8sR0FBRyxzQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBSXBDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUdELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLElBQUksSUFBSSxHQUFHLHNCQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hDLElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLDhDQUE4QyxHQUFHLElBQUksQ0FBQztZQUNoRSxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsbUJBQVksR0FBRztZQUN0QixNQUFNLENBQUMscUJBQWMsS0FBSyxrQkFBVyxDQUFDO1FBQzFDLENBQUMsQ0FBQTtRQUVVLGNBQU8sR0FBRztZQUNqQixtQkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFVSxtQkFBWSxHQUFHLFVBQVMsUUFBa0IsRUFBRSxrQkFBNEI7WUFFL0UsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixnQkFBUyxHQUFHLElBQUksQ0FBQztZQUNyQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLGdCQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLENBQUMsQ0FBQztvQkFDWixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDNUIsOEJBQXVCLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUM7WUFLRCxJQUFJLENBQUMsQ0FBQztnQkFDRixRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsZ0JBQVMsR0FBRyxVQUFTLFFBQVE7WUFDcEMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLFNBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFnQjdDLENBQUMsQ0FBQTtRQVVVLGlCQUFVLEdBQUcsVUFBUyxFQUFRLEVBQUUsSUFBVTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO2dCQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFHRCxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDNUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFBO1FBRVUsd0JBQWlCLEdBQUcsVUFBUyxJQUFJO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQVksRUFBRSxDQUFDO2dCQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDO1lBRWpCLElBQUksSUFBSSxDQUFDO1lBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLG9DQUE2QixDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsb0NBQTZCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkYsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLCtCQUF3QixHQUFHO1lBQ2xDLElBQUksUUFBUSxHQUFZLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFFaEMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLG9CQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxvQkFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFLVSw4QkFBdUIsR0FBRztZQUNqQyxJQUFJLFFBQVEsR0FBWSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBRWhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0JBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQWEsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQztZQUVELEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxvQkFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsb0JBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxJQUFJLElBQUksR0FBa0IsbUJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUdVLGdDQUF5QixHQUFHO1lBQ25DLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBb0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDN0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBR1UsNEJBQXFCLEdBQUc7WUFDL0IsSUFBSSxRQUFRLEdBQW9CLEVBQUUsQ0FBQztZQUNuQyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxvQkFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsb0JBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxtQkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUseUJBQWtCLEdBQUc7WUFDNUIsb0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBRVUsNkJBQXNCLEdBQUcsVUFBUyxHQUFHLEVBQUUsSUFBSTtZQUNsRCxJQUFJLFFBQVEsR0FBVyxFQUFFLENBQUM7WUFDMUIsSUFBSSxJQUFJLEdBQVksS0FBSyxDQUFDO1lBRTFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFTLEtBQUssRUFBRSxLQUFLO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLFFBQVEsSUFBSSxHQUFHLENBQUM7b0JBQ3BCLENBQUM7b0JBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNoQixDQUFDO29CQUVELFFBQVEsSUFBSSxLQUFLLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7Z0JBQ3RCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsUUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDcEUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixRQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNwRSxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHFCQUFjLEdBQUcsVUFBUyxJQUFtQjtZQUNwRCxRQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtnQkFDMUYsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsZUFBZSxFQUFFLElBQUk7YUFDeEIsRUFBRSxVQUFTLEdBQW1DO2dCQUMzQyw2QkFBc0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFHVSxvQkFBYSxHQUFHLFVBQVMsRUFBVTtZQUMxQyxNQUFNLENBQUMsa0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUE7UUFFVSxtQkFBWSxHQUFHLFVBQVMsR0FBVztZQUMxQyxJQUFJLElBQUksR0FBa0IsbUJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsTUFBTSxDQUFDLDRCQUE0QixHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSx5QkFBa0IsR0FBRztZQUM1QixJQUFJLEdBQUcsR0FBa0IsOEJBQXVCLENBQUMscUJBQWMsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRyxVQUFTLEVBQUUsRUFBRSxNQUFNO1lBQzdDLElBQUksSUFBSSxHQUFrQixvQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1Asb0JBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDN0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLG9CQUFhLEdBQUcsVUFBUyxJQUFtQixFQUFFLE1BQWU7WUFDcEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ04sTUFBTSxDQUFDO1lBRVgsSUFBSSxnQkFBZ0IsR0FBWSxLQUFLLENBQUM7WUFHdEMsSUFBSSxrQkFBa0IsR0FBa0IsOEJBQXVCLENBQUMscUJBQWMsQ0FBQyxDQUFDO1lBQ2hGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV0QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztvQkFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsUUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ2hFLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLDhCQUF1QixDQUFDLHFCQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBRS9DLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUN6QyxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZFLENBQUM7Z0JBQ0QsUUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDaEUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsUUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLDhCQUF1QixHQUFHO1lBRWpDLElBQUksWUFBWSxHQUFXLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBYSxDQUFDLENBQUM7WUFDaEUsSUFBSSxhQUFhLEdBQWtCLHlCQUFrQixFQUFFLENBQUM7WUFDeEQsSUFBSSxhQUFhLEdBQVksYUFBYSxJQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEtBQUssZUFBUSxJQUFJLE9BQU8sS0FBSyxlQUFRLENBQUMsQ0FBQztZQUVuSCxJQUFJLGdCQUFnQixHQUFZLGFBQWEsSUFBRSxJQUFJLElBQUksaUJBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDO1lBQ3RGLElBQUksb0JBQW9CLEdBQUcsa0JBQVcsSUFBSSxzQkFBZSxDQUFDLGFBQWEsQ0FBQztZQUN4RSxJQUFJLG9CQUFvQixHQUFHLGtCQUFXLElBQUksc0JBQWUsQ0FBQyxhQUFhLENBQUM7WUFDeEUsSUFBSSxnQkFBZ0IsR0FBVyx1QkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvRCxJQUFJLGFBQWEsR0FBVyx1QkFBZ0IsRUFBRSxDQUFDO1lBQy9DLElBQUksU0FBUyxHQUFZLGdCQUFnQixHQUFHLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1lBQ25FLElBQUksV0FBVyxHQUFZLGdCQUFnQixHQUFHLGFBQWEsR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztZQUdyRixJQUFJLGFBQWEsR0FBRyxzQkFBZSxDQUFDLFFBQVEsSUFBSSxDQUFDLGtCQUFXLElBQUksQ0FBQyxDQUFDLGlCQUFVLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztZQUVoRyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLGlCQUFVLEdBQUcsZ0JBQWdCLEdBQUcsWUFBWSxHQUFHLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBRTFILFFBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDbkQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBVSxDQUFDLENBQUM7WUFFckQsSUFBSSxXQUFXLEdBQVksa0JBQVcsSUFBSSxDQUFDLGlCQUFVLENBQUM7WUFDdEQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVyRCxJQUFJLGFBQWEsR0FBWSxrQkFBVyxJQUFJLENBQUMsaUJBQVUsQ0FBQztZQUV4RCxRQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELFFBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLGtCQUFXLElBQUksT0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztZQUM5RSxRQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsaUJBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQzFGLFFBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUM7WUFDN0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLGlCQUFVLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdFLFFBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLFFBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUUxSCxRQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELFFBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDdEQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNyRCxRQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRTFELFFBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDMUQsUUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLGlCQUFVLENBQUMsQ0FBQztZQUM1RCxRQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsaUJBQVUsQ0FBQyxDQUFDO1lBQ3ZELFFBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsa0JBQVcsSUFBSSxDQUFDLFFBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDOUcsUUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxrQkFBVyxDQUFDLENBQUM7WUFDckQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztZQUNsRyxRQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsaUJBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ2pHLFFBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJO21CQUMzRSxhQUFhLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELFFBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLENBQUM7WUFDbkcsUUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztZQUNoRyxRQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsaUJBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbkYsUUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQy9FLFFBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLDRCQUFxQixDQUFDLENBQUM7WUFDaEYsUUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2hGLFFBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxpQkFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNsRixRQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUMsaUJBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbEYsUUFBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ25GLFFBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO1lBQ3hELFFBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ25FLFFBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDckQsUUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2xGLFFBQUksQ0FBQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDaEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUN0RCxRQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsSUFBRSxJQUFJLElBQUksaUJBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hJLFFBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxJQUFFLElBQUksSUFBSSxpQkFBVSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEksUUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO1lBSTdDLFFBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDMUQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUMxRCxRQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELFFBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLGtCQUFXLElBQUksT0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztZQUM5RSxRQUFJLENBQUMsYUFBYSxDQUFDLDZCQUE2QixFQUFFLGtCQUFXLElBQUksQ0FBQyxRQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQzlHLFFBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO1lBQ3JELFFBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDckQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBVSxDQUFDLENBQUM7WUFDckQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGlCQUFVLENBQUMsQ0FBQztZQUNuRCxRQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLGlCQUFVLENBQUMsQ0FBQztZQUNyRCxRQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsaUJBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDaEYsUUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLGlCQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2xGLFFBQUksQ0FBQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7WUFDaEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLGlCQUFVLElBQUksNEJBQXFCLENBQUMsQ0FBQztZQUdoRixRQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxrQkFBVyxDQUFDLENBQUM7WUFFN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRVUsNEJBQXFCLEdBQUc7WUFDL0IsSUFBSSxHQUFXLENBQUM7WUFDaEIsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLG9CQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxvQkFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXBDLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRVUsdUJBQWdCLEdBQUcsVUFBUyxJQUFtQjtZQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLHNCQUFlLElBQUksQ0FBQyxzQkFBZSxDQUFDLFFBQVEsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFBO1FBRVUsdUJBQWdCLEdBQUc7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBZSxJQUFJLENBQUMsc0JBQWUsQ0FBQyxRQUFRLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFYixNQUFNLENBQUMsc0JBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzNDLENBQUMsQ0FBQTtRQUVVLHlCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUN6QyxzQkFBZSxHQUFHLElBQUksQ0FBQztZQUN2QixrQkFBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDeEIscUJBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMvQixvQkFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzdCLHNCQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckMsQ0FBQyxDQUFBO1FBRVUsMkJBQW9CLEdBQUcsVUFBUyxHQUE4QjtZQUVyRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUV6QixRQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU1QyxVQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBRWxELDhCQUF1QixFQUFFLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRTdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxRQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHdCQUFpQixHQUFHLFVBQVMsR0FBRztZQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHNCQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLElBQUksR0FBa0Isc0JBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBQ3ZCLEtBQUssQ0FBQztnQkFDVixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLGVBQVEsR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBb0I7WUFDcEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUtELElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLFFBQUksQ0FBQyxXQUFXLENBQUMsb0JBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsb0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFLLENBQUMsMkJBQTJCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQU8zRSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVwRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLG1CQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDOUIsa0JBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxvQkFBYSxHQUFHO1lBQ3ZCLFFBQUksQ0FBQyxNQUFNLENBQUMsa0NBQTJCLEVBQUU7Z0JBQ3JDLFdBQU8sQ0FBQyxXQUFXO2dCQUNuQixXQUFPLENBQUMsWUFBWTtnQkFDcEIsV0FBTyxDQUFDLE1BQU07Z0JBQ2QsV0FBTyxDQUFDLFNBQVM7Z0JBQ2pCLFdBQU8sQ0FBQyxVQUFVO2dCQUNsQixXQUFPLENBQUMsT0FBTztnQkFDZixXQUFPLENBQUMsUUFBUTtnQkFDaEIsV0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLFdBQU8sQ0FBQyxVQUFVO2dCQUNsQixXQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUU1QixRQUFJLENBQUMsTUFBTSxDQUFDLDJCQUFvQixFQUFFO2dCQUM5QixXQUFPLENBQUMsWUFBWTtnQkFDcEIsV0FBTyxDQUFDLElBQUk7Z0JBQ1osV0FBTyxDQUFDLFdBQVc7Z0JBQ25CLFdBQU8sQ0FBQyxPQUFPO2dCQUNmLFdBQU8sQ0FBQyxVQUFVO2dCQUNsQixXQUFPLENBQUMsYUFBYTtnQkFDckIsV0FBTyxDQUFDLGdCQUFnQjtnQkFDeEIsV0FBTyxDQUFDLFNBQVM7Z0JBQ2pCLFdBQU8sQ0FBQyxVQUFVO2dCQUNsQixXQUFPLENBQUMsT0FBTztnQkFDZixXQUFPLENBQUMsUUFBUTtnQkFDaEIsV0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLFdBQU8sQ0FBQyxVQUFVO2dCQUNsQixXQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUU1QixRQUFJLENBQUMsTUFBTSxDQUFDLHlCQUFrQixFQUFFLENBQUMsV0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFBO1FBR1UsY0FBTyxHQUFHO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVoQyxFQUFFLENBQUMsQ0FBQyxxQkFBYyxDQUFDO2dCQUNmLE1BQU0sQ0FBQztZQUVYLHFCQUFjLEdBQUcsSUFBSSxDQUFDO1lBRXRCLElBQUksSUFBSSxHQUFHLFFBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRTtnQkFDakMscUJBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxvQkFBYSxFQUFFLENBQUM7WUFDaEIsMkJBQW9CLEVBQUUsQ0FBQztZQU92QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBVUgsa0JBQVcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDaEMsbUJBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFNbEMsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBcUJwQiwwQkFBbUIsRUFBRSxDQUFDO1lBQ3RCLDhCQUF1QixFQUFFLENBQUM7WUFFMUIsUUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFM0IsdUJBQWdCLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRztZQUMxQixJQUFJLFFBQVEsR0FBRyxRQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxVQUFVLENBQUM7b0JBQ1AsQ0FBQyxJQUFJLHFCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUM7WUFFRCxhQUFNLEdBQUcsUUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQTtRQUVVLHFCQUFjLEdBQUcsVUFBUyxPQUFPO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixRQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsMkJBQW9CLEdBQUc7WUFDOUIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsSUFBSSxjQUFVLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25FLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRztZQUMxQixFQUFFLENBQUMsQ0FBQyxzQkFBZSxDQUFDLENBQUMsQ0FBQztnQkFFbEIsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNwQixVQUFNLENBQUMsZUFBZSxDQUFDLGtCQUFXLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFlLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFFLElBQUk7b0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNiLFVBQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBR1UseUJBQWtCLEdBQUcsVUFBUyxLQUFLO1FBTTlDLENBQUMsQ0FBQTtRQUVVLHVCQUFnQixHQUFHLFVBQVMsU0FBUztZQUM1QyxRQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7Z0JBQzNFLFdBQVcsRUFBRSxTQUFTO2FBQ3pCLEVBQUUsMkJBQW9CLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFVSwwQkFBbUIsR0FBRztZQUM3QixRQUFJLENBQUMsSUFBSSxDQUFvRSxxQkFBcUIsRUFBRTtnQkFFaEcsaUJBQWlCLEVBQUUsc0JBQWU7YUFDckMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRVUscUJBQWMsR0FBRyxVQUFTLFFBQWdCO1lBQ2pELFFBQUksQ0FBQyxJQUFJLENBQTBELGdCQUFnQixFQUFFO2dCQUNqRixVQUFVLEVBQUUsUUFBUTthQUN2QixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7SUFDTCxDQUFDLEVBeDBCZ0IsTUFBTSxHQUFOLFVBQU0sS0FBTixVQUFNLFFBdzBCdEI7QUFDTCxDQUFDLEVBMTBCUyxHQUFHLEtBQUgsR0FBRyxRQTAwQlo7QUFJRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUM1QixDQUFDO0FDdDFCRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFdEMsSUFBVSxHQUFHLENBb09aO0FBcE9ELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWCxJQUFpQixHQUFHLENBa09uQjtJQWxPRCxXQUFpQixHQUFHLEVBQUMsQ0FBQztRQUNQLHFCQUFpQixHQUFXLE1BQU0sQ0FBQztRQUVuQyxjQUFVLEdBQVUsQ0FBQyxDQUFDO1FBR3RCLGlCQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFnQixHQUFHO1lBQzVCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsUUFBUSxFQUFHLGNBQVU7YUFDeEIsRUFBRSx1QkFBbUIsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQTtRQUVVLG9CQUFnQixHQUFHO1lBQzVCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLFFBQVEsRUFBRyxjQUFVO2FBQ3hCLEVBQUUsdUJBQW1CLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUE7UUFFVSxjQUFVLEdBQUcsVUFBUyxNQUFjO1lBSTNDLFVBQU0sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFNUMsUUFBSSxDQUFDLElBQUksQ0FBd0UsdUJBQXVCLEVBQUU7Z0JBQ3RHLFFBQVEsRUFBRSxNQUFNO2FBQ25CLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUE7UUFFRCxJQUFJLDZCQUE2QixHQUFHLFVBQVMsR0FBdUM7WUFDaEYsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxELFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFjLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxVQUFNLENBQUMsYUFBYSxLQUFLLFVBQU0sQ0FBQyx1QkFBdUIsQ0FBQztZQUNuRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLFVBQU0sQ0FBQyxhQUFhLEtBQUssVUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsdUJBQW1CLEdBQUc7WUFDN0IsTUFBTSxDQUFDLENBQUMsa0JBQWMsRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUVVLG1CQUFlLEdBQUcsVUFBUyxHQUE0QixFQUFFLEVBQUU7WUFDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxJQUFJLGNBQVUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsVUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEMsVUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGNBQVUsR0FBRztZQUVwQixFQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUV6QixNQUFNLENBQUM7WUFDWCxDQUFDO1lBS0QsY0FBVSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksT0FBTyxHQUFHLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDbkYsUUFBUSxFQUFFLFVBQU0sQ0FBQyxhQUFhO2dCQUM5QixTQUFTLEVBQUUsQ0FBQztnQkFDWixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixRQUFRLEVBQUcsY0FBVTthQUN4QixFQUFFLFVBQVMsR0FBNEI7Z0JBQ3BDLG1CQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFLVSx5QkFBcUIsR0FBRztZQUUvQixJQUFJLGNBQWMsR0FBRyxVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUdqQixJQUFJLElBQUksR0FBa0IsVUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWxFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBR3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcscUJBQWlCLENBQUM7b0JBR2xELE1BQU0sQ0FBQyxRQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBS1UsMEJBQXNCLEdBQUc7WUFDaEMsSUFBSSxDQUFDO2dCQUNELElBQUksY0FBYyxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDaEUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFHakIsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUVsRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUdwRCxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsR0FBRyxHQUFHLHFCQUFpQixDQUFDO3dCQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLE1BQU0sQ0FBQyxDQUFDO3dCQUV0RCxNQUFNLENBQUMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDaEMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztZQUNMLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULFFBQUksQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUN2RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSxrQkFBYyxHQUFHLFVBQVMsTUFBTSxFQUFFLEdBQUc7WUFFNUMsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3BGLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFLRCxVQUFNLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBTWxDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO29CQUN0QyxVQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO1lBQ0wsQ0FBQztZQUNELFVBQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQTtRQUVVLFlBQVEsR0FBRyxVQUFTLEdBQUc7WUFFOUIsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsVUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxjQUFVLENBQUMsOEJBQThCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFPVSxpQkFBYSxHQUFHLFVBQVMsR0FBRztZQUNuQyxJQUFJLFlBQVksR0FBUSxRQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUNuRCxVQUFVLENBQUM7Z0JBQ1AsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1QixVQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLFVBQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBRUQsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixVQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUE7UUFFVSx1QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1lBQ2xFLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsVUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFBO1FBRVUsV0FBTyxHQUFHO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLGNBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsUUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO29CQUNyRSxRQUFRLEVBQUUsVUFBTSxDQUFDLFVBQVU7b0JBQzNCLFNBQVMsRUFBRSxJQUFJO29CQUNmLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLFFBQVEsRUFBRSxjQUFVO2lCQUN2QixFQUFFLHVCQUFtQixDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGlCQUFhLEdBQUc7WUFDdkIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFsT2dCLEdBQUcsR0FBSCxPQUFHLEtBQUgsT0FBRyxRQWtPbkI7QUFDTCxDQUFDLEVBcE9TLEdBQUcsS0FBSCxHQUFHLFFBb09aO0FDdE9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUV4QyxJQUFVLEdBQUcsQ0FvQlo7QUFwQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLEtBQUssQ0FrQnJCO0lBbEJELFdBQWlCLEtBQUssRUFBQyxDQUFDO1FBRVQsMEJBQW9CLEdBQUcsVUFBUyxHQUE4QjtZQUVyRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQUVVLGtCQUFZLEdBQUc7WUFDdEIsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxRQUFRLEVBQUUsc0NBQXNDLEVBQUUscUJBQXFCLEVBQUU7Z0JBQ3JGLENBQUMsSUFBSSxjQUFVLENBQUMsZ0JBQWdCLEVBQUUsd0VBQXdFLEVBQUUscUJBQXFCLEVBQUU7b0JBQy9ILFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QixRQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUUsRUFBRSxFQUFFLDBCQUFvQixDQUFDLENBQUM7Z0JBQzdHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQWxCZ0IsS0FBSyxHQUFMLFNBQUssS0FBTCxTQUFLLFFBa0JyQjtBQUNMLENBQUMsRUFwQlMsR0FBRyxLQUFILEdBQUcsUUFvQlo7QUN0QkQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXhDLElBQVUsR0FBRyxDQWlPWjtBQWpPRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsS0FBSyxDQStOckI7SUEvTkQsV0FBaUIsT0FBSyxFQUFDLENBQUM7UUFFVCxrQkFBVSxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUEwQjtZQUM1RSxJQUFJLFFBQVEsR0FBd0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xELElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztZQUUxQixHQUFHLENBQUMsQ0FBYSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVMsQ0FBQztnQkFBdEIsSUFBSSxJQUFJLGtCQUFBO2dCQUNULFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzNEO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFRCxJQUFJLGdCQUFnQixHQUFHLFVBQVMsS0FBMEIsRUFBRSxHQUFXLEVBQUUsUUFBZ0I7WUFDckYsSUFBSSxNQUFNLEdBQVcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFLVSxtQkFBVyxHQUFHO1lBQ3JCLFVBQU0sQ0FBQyxjQUFjLEdBQUcsVUFBTSxDQUFDLGNBQWMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBUzdELFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLFVBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRVUsbUNBQTJCLEdBQUcsVUFBUyxZQUFZO1lBQzFELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUVwRCxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxLQUFLLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNVSxtQ0FBMkIsR0FBRyxVQUFTLElBQW1CLEVBQUUsS0FBMEI7WUFDN0YsSUFBSSxJQUFJLEdBQWEsVUFBTSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxJQUFJLFFBQVEsR0FBd0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xELGNBQWMsQ0FBQyxDQUFDLFdBQU8sQ0FBQyxPQUFPLEVBQUUsV0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELGNBQWMsQ0FBQyxDQUFDLFdBQU8sQ0FBQyxPQUFPLEVBQUUsV0FBTyxDQUFDLFVBQVUsRUFBRSxXQUFPLENBQUMsYUFBYSxFQUFFLFdBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWpILE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBR0QsSUFBSSxjQUFjLEdBQUcsVUFBUyxTQUFtQixFQUFFLEtBQTBCO1lBQ3pFLEdBQUcsQ0FBQyxDQUFhLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxDQUFDO2dCQUF0QixJQUFJLElBQUksa0JBQUE7Z0JBQ1QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzthQUNKO1FBQ0wsQ0FBQyxDQUFBO1FBR0QsSUFBSSxjQUFjLEdBQUcsVUFBUyxTQUFtQixFQUFFLEtBQTBCO1lBQ3pFLEdBQUcsQ0FBQyxDQUFhLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxDQUFDO2dCQUF0QixJQUFJLElBQUksa0JBQUE7Z0JBQ1QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzlDLENBQUM7YUFDSjtRQUNMLENBQUMsQ0FBQTtRQUtVLHdCQUFnQixHQUFHLFVBQVMsVUFBVTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksT0FBSyxHQUFXLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxXQUFTLEdBQVcsQ0FBQyxDQUFDO2dCQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBRSxRQUFRO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxZQUFZLEdBQUcsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFFMUQsV0FBUyxFQUFFLENBQUM7d0JBQ1osSUFBSSxFQUFFLEdBQVcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQzlCLE9BQU8sRUFBRSxxQkFBcUI7eUJBQ2pDLEVBQUUsVUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUUvQyxJQUFJLEdBQUcsU0FBUSxDQUFDO3dCQUNoQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNmLEdBQUcsR0FBRyxVQUFVLENBQUM7d0JBQ3JCLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQzFCLEdBQUcsR0FBRyxVQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDMUMsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDdEQsQ0FBQzt3QkFFRCxFQUFFLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQ25CLE9BQU8sRUFBRSxvQkFBb0I7eUJBQ2hDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRVIsT0FBSyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFOzRCQUN0QixPQUFPLEVBQUUsZ0JBQWdCO3lCQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUVYLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JELENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsV0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxNQUFNLENBQUMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQ3ZCLFFBQVEsRUFBRSxHQUFHO29CQUNiLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQUUsT0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTVUsdUJBQWUsR0FBRyxVQUFTLFlBQVksRUFBRSxJQUFJO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUVoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQUksSUFBSSxHQUFzQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSwwQkFBa0IsR0FBRyxVQUFTLFlBQVksRUFBRSxJQUFJO1lBQ3ZELElBQUksSUFBSSxHQUFzQix1QkFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQU1VLHNCQUFjLEdBQUcsVUFBUyxJQUFJO1lBQ3JDLElBQUksU0FBUyxHQUFXLDBCQUFrQixDQUFDLFdBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFHckUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNiLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDeEIsQ0FBQztZQUdELE1BQU0sQ0FBQyxTQUFTLElBQUksVUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN4QyxDQUFDLENBQUE7UUFNVSw2QkFBcUIsR0FBRyxVQUFTLElBQUk7WUFDNUMsSUFBSSxTQUFTLEdBQVcsMEJBQWtCLENBQUMsV0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksVUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM3RCxDQUFDLENBQUE7UUFFVSwwQkFBa0IsR0FBRyxVQUFTLElBQUk7WUFDekMsSUFBSSxTQUFTLEdBQVcsMEJBQWtCLENBQUMsV0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksVUFBTSxDQUFDLFFBQVEsQ0FBQztRQUM3RCxDQUFDLENBQUE7UUFLVSxzQkFBYyxHQUFHLFVBQVMsUUFBUTtZQUV6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUduQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzFCLENBQUM7WUFFRCxJQUFJLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsNEJBQW9CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSw0QkFBb0IsR0FBRyxVQUFTLE1BQU07WUFDN0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxDQUFDO1lBQzFCLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFTLENBQUMsRUFBRSxLQUFLO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixHQUFHLElBQUksUUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxHQUFHLElBQUksVUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsSUFBSSxRQUFRLENBQUM7WUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtJQUNMLENBQUMsRUEvTmdCLEtBQUssR0FBTCxTQUFLLEtBQUwsU0FBSyxRQStOckI7QUFDTCxDQUFDLEVBak9TLEdBQUcsS0FBSCxHQUFHLFFBaU9aO0FDbk9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUt6QyxJQUFVLEdBQUcsQ0E4aENaO0FBOWhDRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsTUFBTSxDQTRoQ3RCO0lBNWhDRCxXQUFpQixNQUFNLEVBQUMsQ0FBQztRQUNyQixJQUFJLEtBQUssR0FBWSxLQUFLLENBQUM7UUFNM0IsSUFBSSxrQkFBa0IsR0FBRztZQUNyQixNQUFNLENBQUMsMEhBQTBILENBQUM7UUFDdEksQ0FBQyxDQUFBO1FBRUQsSUFBSSxZQUFZLEdBQUcsVUFBUyxJQUFtQjtZQUkzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLG1CQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUlELElBQUksQ0FBQyxDQUFDO2dCQUNGLElBQUksTUFBTSxHQUFXLFVBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQzFCLE1BQU0sRUFBRSw4QkFBdUIsQ0FBQyxJQUFJLENBQUM7aUJBQ3hDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFFNUIsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDZixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBU1UsZUFBUSxHQUFHLFVBQVMsRUFBRSxFQUFFLElBQUk7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHFCQUFjLEdBQUcsVUFBUyxJQUFtQixFQUFFLFFBQWlCLEVBQUUsUUFBaUI7WUFDMUYsSUFBSSxTQUFTLEdBQVcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0UsSUFBSSxVQUFVLEdBQVcsRUFBRSxDQUFDO1lBRTVCLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFVBQVUsSUFBSSxrQ0FBa0MsR0FBRyxpQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNuRixDQUFDO1lBRUQsVUFBVSxJQUFJLE9BQU8sQ0FBQztZQUV0QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksS0FBSyxHQUFXLENBQUMsU0FBUyxLQUFLLFVBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7Z0JBQzNGLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDckYsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLEdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7Z0JBQ2hHLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQzFGLENBQUM7WUFFRCxVQUFVLElBQUksd0JBQXdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLFVBQVUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNoRCxDQUFDO1lBQ0QsVUFBVSxJQUFJLFFBQVEsQ0FBQztZQVl2QixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLFVBQVUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDbkUsQ0FBQztZQUVELFVBQVUsR0FBRyxVQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNwQixPQUFPLEVBQUUsYUFBYTthQUN6QixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRWYsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDLENBQUE7UUFPVSwyQkFBb0IsR0FBRyxVQUFTLE9BQWU7WUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQU83QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsVUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLE9BQU8sR0FBRyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztZQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRVUsMEJBQW1CLEdBQUcsVUFBUyxPQUFlO1lBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFBO1FBRVUsc0JBQWUsR0FBRyxVQUFTLE9BQWU7WUFLakQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFDNUQsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLDZCQUE2QixDQUFDLENBQUM7WUFDdkUsQ0FBQztZQUNELE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBRXBFLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBSVUsd0JBQWlCLEdBQUcsVUFBUyxJQUFtQjtZQUl2RCxJQUFJLEdBQUcsR0FBVyxVQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsYUFBYSxDQUFDO1lBQ25FLFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sdUNBQXVDLENBQUM7WUFDbkUsSUFBSSxVQUFVLEdBQVcsd0JBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFBO1FBVVUsd0JBQWlCLEdBQUcsVUFBUyxJQUFtQixFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVO1lBQzlHLElBQUksR0FBRyxHQUFXLDBCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRzVDLEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLElBQUksVUFBVSxHQUFHLHFCQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLFVBQVUsR0FBRyxTQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNiLEdBQUcsSUFBa0IsVUFBVSxDQUFDO2dCQUNwQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksY0FBYyxHQUFZLEtBQUssQ0FBQztnQkFLcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLElBQUksR0FBYSxVQUFNLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUMzRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNQLGNBQWMsR0FBRyxJQUFJLENBQUM7d0JBQ3RCLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBO29CQUNqQyxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLFdBQVcsR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUdsRixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNkLGNBQWMsR0FBRyxJQUFJLENBQUM7d0JBRXRCLElBQUksVUFBVSxHQUFHLFNBQUssQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBR25ELElBQUksYUFBYSxHQUFHLGtDQUFrQzs0QkFDbEQsbUNBQW1DOzRCQUNuQyxpQ0FBaUM7NEJBQ2pDLFVBQVU7NEJBQ1YsV0FBVzs0QkFDWCxtQkFBbUIsQ0FBQzt3QkFPeEIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs0QkFDYixHQUFHLElBQUksVUFBRyxDQUFDLEtBQUssRUFBRTtnQ0FDZCxPQUFPLEVBQUUsYUFBYTs2QkFDekIsRUFBRSxhQUFhLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixHQUFHLElBQUksVUFBRyxDQUFDLEtBQUssRUFBRTtnQ0FDZCxPQUFPLEVBQUUsa0JBQWtCOzZCQUM5QixFQUFFLGFBQWEsQ0FBQyxDQUFDO3dCQUN0QixDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsR0FBRyxJQUFJLFdBQVcsQ0FBQztvQkFDdkIsQ0FBQztvQkFFRCxJQUFJLFlBQVUsR0FBVyxTQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqRSxFQUFFLENBQUMsQ0FBQyxZQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNiLEdBQUcsSUFBa0IsWUFBVSxDQUFDO29CQUNwQyxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLE1BQU0sR0FBVyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBT3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3pELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osR0FBRyxJQUFJLE1BQU0sQ0FBQztnQkFDbEIsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLElBQUksR0FBVyxTQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEdBQUcsSUFBSSxVQUFHLENBQUMsS0FBSyxFQUFFO29CQUNkLE9BQU8sRUFBRSxjQUFjO2lCQUMxQixFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLHlDQUFrQyxHQUFHLFVBQVMsV0FBbUI7WUFDeEUsSUFBSSxPQUFPLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQztnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxJQUFJLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFMUMsR0FBRyxDQUFDLENBQWMsVUFBSSxFQUFKLGFBQUksRUFBSixrQkFBSSxFQUFKLElBQUksQ0FBQztvQkFBbEIsSUFBSSxLQUFLLGFBQUE7b0JBQ1YsSUFBSSxXQUFXLEdBQUcsVUFBRyxDQUFDLEtBQUssRUFBRTt3QkFDekIsT0FBTyxFQUFFLFlBQVk7cUJBQ3hCLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUVuQixJQUFJLGFBQWEsR0FBRyxVQUFHLENBQUMsY0FBYyxFQUFFO3dCQUNwQyxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLDZCQUE2QixHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSTtxQkFDbkUsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFakIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO29CQU90QixJQUFJLFFBQVEsR0FBRyxVQUFHLENBQUMsS0FBSyxFQUFFLEVBQ3pCLEVBQUUsYUFBYSxHQUFHLFlBQVksQ0FBQyxDQUFDO29CQUVqQyxPQUFPLElBQUksVUFBRyxDQUFDLEtBQUssRUFBRSxFQUNyQixFQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQztpQkFDOUI7WUFDTCxDQUNBO1lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxRQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsT0FBTyxHQUFHLGlCQUFpQixDQUFBO1lBQy9CLENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQVFVLDJCQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLFFBQWdCO1lBRTFHLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDM0IsSUFBSSxTQUFTLEdBQVksS0FBSyxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksV0FBVyxHQUFZLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRTdDLElBQUksS0FBSyxHQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztnQkFFNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMsSUFBSSxjQUFjLEdBQVksU0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsY0FBYyxHQUFHLENBQUMsVUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQzt1QkFDOUUsQ0FBQyxTQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFVRCxJQUFJLFNBQVMsR0FBa0IsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDM0QsSUFBSSxRQUFRLEdBQVksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUU3RCxJQUFJLGdCQUFnQixHQUFXLDJCQUFvQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2xHLElBQUksUUFBUSxHQUFXLDJCQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxELElBQUksS0FBSyxHQUFXLEdBQUcsR0FBRyxNQUFNLENBQUM7WUFDakMsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLGdCQUFnQixHQUFHLENBQUMsUUFBUSxHQUFHLGFBQWEsR0FBRyxlQUFlLENBQUM7Z0JBQ3hFLFNBQVMsRUFBRSxnQ0FBZ0MsR0FBRyxHQUFHLEdBQUcsS0FBSztnQkFDekQsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsT0FBTyxFQUFFLFFBQVE7YUFDcEIsRUFDRyxnQkFBZ0IsR0FBRyxVQUFHLENBQUMsS0FBSyxFQUFFO2dCQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLFVBQVU7YUFDekIsRUFBRSx3QkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUE7UUFFVSxrQkFBVyxHQUFHO1lBQ3JCLElBQUksSUFBSSxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hELElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDekQsVUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVoQyxJQUFJLE9BQU8sR0FBVyxzQkFBc0IsR0FBRyxHQUFHLENBQUM7WUFDbkQsSUFBSSxJQUFJLEdBQVcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sSUFBSSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2hGLENBQUM7WUFFRCxDQUFDLElBQUksY0FBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BELENBQUMsQ0FBQTtRQUVVLDBCQUFtQixHQUFHLFVBQVMsSUFBbUI7WUFDekQsSUFBSSxXQUFXLEdBQVcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRSxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDZCxjQUFjLEdBQUcsVUFBRyxDQUFDLEtBQUssRUFBRTtvQkFDeEIsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLE9BQU8sRUFBRSxpQkFBaUI7aUJBQzdCLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzFCLENBQUMsQ0FBQTtRQUVVLDJCQUFvQixHQUFHLFVBQVMsSUFBbUI7WUFDMUQsSUFBSSxNQUFNLEdBQVcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxJQUFJLFdBQVcsR0FBVyxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxXQUFXLEdBQUcsd0JBQXdCLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMzRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSx3QkFBaUIsR0FBRyxVQUFTLE9BQWdCLEVBQUUsT0FBZ0I7WUFDdEUsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFFeEIsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLHlEQUF5RCxHQUFHLE9BQU87YUFDL0UsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSxnQkFBUyxHQUFHLFVBQVMsT0FBZSxFQUFFLE9BQWU7WUFDNUQsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFFeEIsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLHVEQUF1RCxHQUFHLE9BQU87YUFDN0UsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSwyQkFBb0IsR0FBRyxVQUFTLElBQW1CLEVBQUUsU0FBa0IsRUFBRSxXQUFvQixFQUFFLGNBQXVCO1lBRTdILElBQUksU0FBUyxHQUFXLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLElBQUksU0FBUyxHQUFXLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLElBQUksWUFBWSxHQUFXLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWpGLElBQUksVUFBVSxHQUFXLEVBQUUsQ0FBQztZQUM1QixJQUFJLFNBQVMsR0FBVyxFQUFFLENBQUM7WUFDM0IsSUFBSSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7WUFDckMsSUFBSSxjQUFjLEdBQVcsRUFBRSxDQUFDO1lBQ2hDLElBQUksZ0JBQWdCLEdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksa0JBQWtCLEdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksZ0JBQWdCLEdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksV0FBVyxHQUFXLEVBQUUsQ0FBQztZQU03QixFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksU0FBUyxJQUFJLFVBQU0sQ0FBQyxRQUFRLElBQUksU0FBUyxJQUFJLFVBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxXQUFXLEdBQUcsVUFBRyxDQUFDLGNBQWMsRUFBRTtvQkFDOUIsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSwyQkFBMkIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7aUJBQzVELEVBQ0csT0FBTyxDQUFDLENBQUM7WUFDakIsQ0FBQztZQUVELElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztZQUc1QixFQUFFLENBQUMsQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLFdBQVcsRUFBRSxDQUFDO2dCQUVkLFVBQVUsR0FBRyxVQUFHLENBQUMsY0FBYyxFQUFFO29CQU83QixPQUFPLEVBQUUsd0NBQXdDO29CQUNqRCxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSztpQkFDckQsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUNoQixDQUFDO1lBT0QsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUdsQyxJQUFJLFFBQVEsR0FBWSxVQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUd0RSxXQUFXLEVBQUUsQ0FBQztnQkFFZCxJQUFJLEdBQUcsR0FBVyxRQUFRLEdBQUc7b0JBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU07b0JBQ3ZCLFNBQVMsRUFBRSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7b0JBQ3ZELFNBQVMsRUFBRSxTQUFTO29CQUdwQixPQUFPLEVBQUUsbUJBQW1CO2lCQUMvQjtvQkFDRzt3QkFDSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNO3dCQUN2QixTQUFTLEVBQUUseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLO3dCQUN2RCxPQUFPLEVBQUUsbUJBQW1CO3FCQUMvQixDQUFDO2dCQUVOLFNBQVMsR0FBRyxVQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUUzQyxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFcEMsV0FBVyxFQUFFLENBQUM7b0JBQ2QsbUJBQW1CLEdBQUcsVUFBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUMzQyxNQUFNLEVBQUUsOEJBQThCO3dCQUN0QyxJQUFJLEVBQUUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUc7d0JBQ2xDLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLO3FCQUMzRCxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLFdBQVcsRUFBRSxDQUFDO29CQUVkLGdCQUFnQixHQUFHLFVBQUcsQ0FBQyxtQkFBbUIsRUFBRTt3QkFDeEMsTUFBTSxFQUFFLDBCQUEwQjt3QkFDbEMsSUFBSSxFQUFFLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHO3dCQUNyQyxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLHVCQUF1QixHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSztxQkFDeEQsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztZQUlELEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELFdBQVcsRUFBRSxDQUFDO2dCQUVkLGNBQWMsR0FBRyxVQUFHLENBQUMsbUJBQW1CLEVBQ3BDO29CQUNJLEtBQUssRUFBRSxZQUFZO29CQUNuQixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHdCQUF3QixHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSztpQkFDekQsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFZixFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsc0JBQXNCLElBQUksVUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUVsRixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNaLFdBQVcsRUFBRSxDQUFDO3dCQUVkLGdCQUFnQixHQUFHLFVBQUcsQ0FBQyxtQkFBbUIsRUFBRTs0QkFDeEMsTUFBTSxFQUFFLG9CQUFvQjs0QkFDNUIsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLFNBQVMsRUFBRSx1QkFBdUIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7eUJBQ3hELEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNkLFdBQVcsRUFBRSxDQUFDO3dCQUVkLGtCQUFrQixHQUFHLFVBQUcsQ0FBQyxtQkFBbUIsRUFBRTs0QkFDMUMsTUFBTSxFQUFFLHNCQUFzQjs0QkFDOUIsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLFNBQVMsRUFBRSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7eUJBQzFELEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2IsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQU9ELElBQUksaUJBQWlCLEdBQVcsRUFBRSxDQUFDO1lBS25DLElBQUksY0FBYyxHQUFXLEVBQUUsQ0FBQztZQUtoQyxJQUFJLFVBQVUsR0FBVyxTQUFTLEdBQUcsVUFBVSxHQUFHLGdCQUFnQixHQUFHLG1CQUFtQixHQUFHLGlCQUFpQjtrQkFDdEcsY0FBYyxHQUFHLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7WUFFNUYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLDZCQUFzQixDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzRSxDQUFDLENBQUE7UUFFVSw2QkFBc0IsR0FBRyxVQUFTLE9BQWdCLEVBQUUsWUFBcUI7WUFHaEYsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQ1o7Z0JBQ0ksT0FBTyxFQUFFLG1CQUFtQixHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUM1RSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUE7UUFFVSwyQkFBb0IsR0FBRyxVQUFTLE9BQWU7WUFDdEQsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLG1CQUFtQjthQUMvQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUE7UUFFVSxzQkFBZSxHQUFHLFVBQVMsS0FBYSxFQUFFLEVBQVU7WUFDM0QsTUFBTSxDQUFDLFVBQUcsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDN0IsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLEVBQUU7YUFDYixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFBO1FBS1Usc0JBQWUsR0FBRyxVQUFTLEdBQVc7WUFDN0MsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxpQkFBVSxHQUFHLFVBQVMsSUFBbUI7WUFDaEQsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUc3QixJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkMsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVoRixJQUFJLFVBQVUsR0FBVyxTQUFTLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQVcsVUFBTSxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQzlELEdBQUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7WUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGVBQVEsR0FBRyxVQUFTLElBQVk7WUFDdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3JDLENBQUMsQ0FBQTtRQUtVLHlCQUFrQixHQUFHLFVBQVMsSUFBOEI7WUFDbkUsVUFBTSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBRS9DLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxHQUFHLFVBQU0sQ0FBQyxlQUFlLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLFFBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFFRCxVQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUV6QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFVBQU0sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUN6QixVQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztnQkFDeEIsVUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBTTFCLFVBQU0sQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixVQUFNLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO2dCQUVwQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBRUQsSUFBSSxTQUFTLEdBQVcsVUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUVqRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUM1RSxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksUUFBUSxHQUFXLDJCQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQU12RCxJQUFJLGVBQWUsR0FBVyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUkxRixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNoQyxJQUFJLEtBQUssR0FBVyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUNqQyxJQUFJLFdBQVMsR0FBVyxFQUFFLENBQUM7Z0JBQzNCLElBQUksY0FBYyxHQUFXLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxtQkFBbUIsR0FBVyxFQUFFLENBQUM7Z0JBQ3JDLElBQUksV0FBVyxHQUFXLEVBQUUsQ0FBQztnQkFNN0IsSUFBSSxTQUFTLEdBQVcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRixJQUFJLFNBQVMsR0FBVyxTQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hGLElBQUksWUFBWSxHQUFXLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFPdEYsRUFBRSxDQUFDLENBQUMsWUFBWSxJQUFJLFNBQVMsSUFBSSxVQUFNLENBQUMsUUFBUSxJQUFJLFNBQVMsSUFBSSxVQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDL0UsV0FBVyxHQUFHLFVBQUcsQ0FBQyxjQUFjLEVBQUU7d0JBQzlCLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSztxQkFDakUsRUFDRyxPQUFPLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsSUFBSSxRQUFJLENBQUMsY0FBYyxJQUFJLFFBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUYsbUJBQW1CLEdBQUcsVUFBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUMzQyxNQUFNLEVBQUUsOEJBQThCO3dCQUV0QyxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLDBCQUEwQixHQUFHLEdBQUcsR0FBRyxLQUFLO3FCQUN0RCxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBR0QsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUdoQyxjQUFjLEdBQUcsVUFBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUN0QyxNQUFNLEVBQUUsa0JBQWtCO3dCQUMxQixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLHdCQUF3QixHQUFHLEdBQUcsR0FBRyxLQUFLO3FCQUNwRCxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNmLENBQUM7Z0JBR0QsSUFBSSxTQUFTLEdBQWtCLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMzRCxJQUFJLFFBQVEsR0FBWSxTQUFTLElBQUksU0FBUyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUM7Z0JBRzNELEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixJQUFJLGNBQWMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxXQUFTLEdBQUcsNkJBQXNCLENBQUMsbUJBQW1CLEdBQUcsY0FBYyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dCQUMzRixDQUFDO2dCQUVELElBQUksT0FBTyxHQUFXLFVBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQzdCLE9BQU8sRUFBRSxDQUFDLFFBQVEsR0FBRyxpQ0FBaUMsR0FBRyxtQ0FBbUMsQ0FBQztvQkFDN0YsU0FBUyxFQUFFLGdDQUFnQyxHQUFHLEdBQUcsR0FBRyxLQUFLO29CQUN6RCxJQUFJLEVBQUUsS0FBSztpQkFDZCxFQUNHLFdBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQztnQkFFakMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQU94QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakMsQ0FBQztZQUdELFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV2QixFQUFFLENBQUMsQ0FBQyxPQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksVUFBVSxHQUFXLGlCQUFVLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGVBQVEsQ0FBQyxDQUFDO2dCQUM3RSxNQUFNLElBQUksd0JBQWlCLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDakUsQ0FBQztZQUVELElBQUksUUFBUSxHQUFXLENBQUMsQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxVQUFVLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBTTlDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDNUMsSUFBSSxJQUFJLEdBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxJQUFJLEdBQUcsR0FBVyxrQkFBVyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDdEUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixNQUFNLElBQUksR0FBRyxDQUFDOzRCQUNkLFFBQVEsRUFBRSxDQUFDO3dCQUNmLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztnQkFDbEMsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLFVBQVUsR0FBRyxpQkFBVSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxlQUFRLENBQUMsQ0FBQztnQkFDckUsTUFBTSxJQUFJLHdCQUFpQixDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7WUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDekIsV0FBVyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUVELENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBT2hDLFVBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxlQUFRLEdBQUc7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxlQUFRLEdBQUc7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxrQkFBVyxHQUFHLFVBQVMsQ0FBUyxFQUFFLElBQW1CLEVBQUUsT0FBZ0IsRUFBRSxVQUFrQixFQUFFLFFBQWdCO1lBRXBILEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUVkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsVUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTVCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzlELENBQUM7WUFDTCxDQUFDO1lBRUQsUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLEdBQUcsR0FBRywyQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU5RCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsOEJBQXVCLEdBQUcsVUFBUyxJQUFtQjtZQUM3RCxNQUFNLENBQUMsYUFBYSxHQUFHLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzRyxDQUFDLENBQUE7UUFHVSxzQkFBZSxHQUFHLFVBQVMsSUFBbUI7WUFFckQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFLTixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQWlCNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBUXZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFFL0IsQ0FBQztvQkFJRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEMsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdVLG1CQUFZLEdBQUcsVUFBUyxJQUFtQjtZQUNsRCxJQUFJLEdBQUcsR0FBVyw4QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBRWxDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBYTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUd2QyxJQUFJLEtBQUssR0FBVyxVQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztvQkFLNUMsSUFBSSxNQUFNLEdBQVcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFFdEQsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNoQixPQUFPLEVBQUUsS0FBSyxHQUFHLElBQUk7d0JBQ3JCLFFBQVEsRUFBRSxNQUFNLEdBQUcsSUFBSTtxQkFDMUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUQsSUFBSSxDQUFDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLFVBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJO3dCQUMxQixRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJO3FCQUMvQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsVUFBRyxDQUFDLEtBQUssRUFBRTtvQkFDZCxLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7aUJBQ25CLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNVSxVQUFHLEdBQUcsVUFBUyxHQUFXLEVBQUUsVUFBbUIsRUFBRSxPQUFnQixFQUFFLFFBQWtCO1lBRzVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxXQUFXLENBQUM7Z0JBQ2xDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFHcEIsSUFBSSxHQUFHLEdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEdBQUcsSUFBSSxHQUFHLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBUyxDQUFDLEVBQUUsQ0FBQztvQkFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDSixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUN4QixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixDQUFDO3dCQUtELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO3dCQUNqQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQy9CLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDbkIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWCxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUNELEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQzVDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLElBQUksSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsbUJBQVksR0FBRyxVQUFTLFNBQWlCLEVBQUUsT0FBZTtZQUNqRSxNQUFNLENBQUMsVUFBRyxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixNQUFNLEVBQUUsT0FBTztnQkFDZixPQUFPLEVBQUUsU0FBUztnQkFDbEIsSUFBSSxFQUFFLE9BQU87YUFDaEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFBO1FBRVUsb0JBQWEsR0FBRyxVQUFTLFNBQWlCLEVBQUUsT0FBZTtZQUNsRSxNQUFNLENBQUMsVUFBRyxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2FBQ2hCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLHdCQUFpQixHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1lBQ3RFLE1BQU0sQ0FBQyxVQUFHLENBQUMsYUFBYSxFQUFFO2dCQUN0QixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxjQUFjO2FBQzFCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLGlCQUFVLEdBQUcsVUFBUyxJQUFZLEVBQUUsRUFBVSxFQUFFLFFBQWEsRUFBRSxHQUFTO1lBQy9FLElBQUksT0FBTyxHQUFHO2dCQUNWLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUE7UUFFVSw2QkFBc0IsR0FBRyxVQUFTLFFBQWdCO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxVQUFNLENBQUMsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ2hFLENBQUMsQ0FBQTtRQUVVLHlCQUFrQixHQUFHLFVBQVMsUUFBZ0I7WUFDckQsTUFBTSxDQUFDLFVBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRyxVQUFTLFFBQWdCO1lBQ25ELE1BQU0sQ0FBQyxVQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFBO1FBRVUsMkJBQW9CLEdBQUcsVUFBUyxRQUFnQjtZQUN2RCxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsY0FBYyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxRQUFRLEtBQUssV0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9ELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDLEVBNWhDZ0IsTUFBTSxHQUFOLFVBQU0sS0FBTixVQUFNLFFBNGhDdEI7QUFDTCxDQUFDLEVBOWhDUyxHQUFHLEtBQUgsR0FBRyxRQThoQ1o7QUNuaUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQU16QyxJQUFVLEdBQUcsQ0EyTlo7QUEzTkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLElBQUksQ0F5TnBCO0lBek5ELFdBQWlCLElBQUksRUFBQyxDQUFDO1FBQ1Isc0JBQWlCLEdBQVcsV0FBVyxDQUFDO1FBRXhDLGdCQUFXLEdBQVEsSUFBSSxDQUFDO1FBQ3hCLG9CQUFlLEdBQVcsZ0JBQWdCLENBQUM7UUFDM0Msc0JBQWlCLEdBQVcsVUFBVSxDQUFDO1FBRXZDLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBS25CLGtCQUFhLEdBQVEsSUFBSSxDQUFDO1FBSzFCLG9CQUFlLEdBQVEsSUFBSSxDQUFDO1FBSzVCLHFCQUFnQixHQUFrQixJQUFJLENBQUM7UUFNdkMsa0JBQWEsR0FBUSxFQUFFLENBQUM7UUFTeEIsaUJBQVksR0FBcUMsRUFBRSxDQUFDO1FBRXBELHFCQUFnQixHQUFHO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUk7Z0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxJQUFJLElBQUk7Z0JBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxJQUFJO2dCQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQTtRQUVVLHVCQUFrQixHQUFHO1lBSzVCLEVBQUUsQ0FBQyxDQUFDLHFCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUMsSUFBSSxvQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHdCQUFtQixHQUFHLFVBQVMsR0FBNEI7WUFDbEUsa0JBQWEsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLHNCQUFrQixFQUFFLENBQUM7WUFDbEQsSUFBSSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxQixVQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUcsVUFBUyxHQUE0QjtZQUMvRCxvQkFBZSxHQUFHLEdBQUcsQ0FBQztZQUN0QixJQUFJLG9CQUFvQixHQUFHLElBQUksd0JBQW9CLEVBQUUsQ0FBQztZQUN0RCxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQyxRQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVCLFVBQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFVSx3QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1lBQ3BFLE9BQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0I7Z0JBQ2hDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLFFBQVEsRUFBRyxpQkFBWTthQUMxQixFQUFFLE9BQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVVLHNCQUFpQixHQUFHO1lBQzNCLElBQUksSUFBSSxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksY0FBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxXQUFPLENBQUMsYUFBYTtnQkFDbEMsWUFBWSxFQUFFLElBQUk7YUFDckIsRUFBRSxxQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtRQUVVLHlCQUFvQixHQUFHO1lBQzlCLElBQUksSUFBSSxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksY0FBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxXQUFPLENBQUMsT0FBTztnQkFDNUIsWUFBWSxFQUFFLElBQUk7YUFDckIsRUFBRSxxQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtRQUVVLG1CQUFjLEdBQUcsVUFBUyxJQUFtQjtZQUNwRCxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEQsaUJBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUVVLDhCQUF5QixHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVE7WUFDMUQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBTTNDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUVqQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBUyxDQUFDLEVBQUUsSUFBSTtnQkFDdkMsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBRVgsbUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFckIsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsTUFBTSxJQUFJLGlDQUE0QixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFBO1FBT1UsaUNBQTRCLEdBQUcsVUFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRO1lBRTNFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUUxQyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsc0JBQWlCLENBQUM7WUFHcEMsSUFBSSxhQUFhLEdBQUcsc0JBQWlCLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRWhELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLENBQUM7WUFDOUMsSUFBSSxPQUFPLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0UsTUFBTSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsNkJBQTZCO2dCQUN0QyxTQUFTLEVBQUUseUNBQXlDLEdBQUcsR0FBRyxHQUFHLEtBQUs7Z0JBQ2xFLElBQUksRUFBRSxLQUFLO2FBQ2QsRUFDRyxhQUFhO2tCQUNYLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNoQixJQUFJLEVBQUUsR0FBRyxHQUFHLGVBQWU7aUJBQzlCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUE7UUFFVSxzQkFBaUIsR0FBRyxVQUFTLEdBQUc7WUFDdkMsSUFBSSxVQUFVLEdBQUcsVUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLDRCQUE0QixHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUNsRyxNQUFNLENBQUMsVUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQTtRQUVVLDJCQUFzQixHQUFHLFVBQVMsTUFBTSxFQUFFLEdBQUc7WUFDcEQsbUJBQWMsRUFBRSxDQUFDO1lBQ2pCLHFCQUFnQixHQUFHLGlCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFckMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFBO1FBRVUsb0JBQWUsR0FBRyxVQUFTLEdBQVc7WUFJN0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLHdDQUF3QyxHQUFHLEdBQUcsQ0FBQztZQUN6RCxDQUFDO1lBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0UsVUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFLVSxtQkFBYyxHQUFHO1lBRXhCLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBR0QsSUFBSSxNQUFNLEdBQUcscUJBQWdCLENBQUMsR0FBRyxHQUFHLHNCQUFpQixDQUFDO1lBRXRELElBQUksR0FBRyxHQUFHLFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFTixRQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM3RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQXpOZ0IsSUFBSSxHQUFKLFFBQUksS0FBSixRQUFJLFFBeU5wQjtBQUNMLENBQUMsRUEzTlMsR0FBRyxLQUFILEdBQUcsUUEyTlo7QUNqT0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXhDLElBQVUsR0FBRyxDQW9DWjtBQXBDRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsS0FBSyxDQWtDckI7SUFsQ0QsV0FBaUIsS0FBSyxFQUFDLENBQUM7UUFFcEIsSUFBSSx1QkFBdUIsR0FBRyxVQUFTLEdBQWdDO1lBQ25FLFFBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFVSxpQkFBVyxHQUFrQixJQUFJLENBQUM7UUFLbEMscUJBQWUsR0FBRztZQUN6QixJQUFJLElBQUksR0FBaUIsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxjQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsaUJBQVcsR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQyxJQUFJLGNBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFBO1FBRVUscUJBQWUsR0FBRztZQUN6QixJQUFJLFNBQVMsR0FBaUIsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxRQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztZQUV0QyxRQUFJLENBQUMsSUFBSSxDQUEwRCxnQkFBZ0IsRUFBRTtnQkFDakYsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFO2FBQ3pCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7SUFDTCxDQUFDLEVBbENnQixLQUFLLEdBQUwsU0FBSyxLQUFMLFNBQUssUUFrQ3JCO0FBQ0wsQ0FBQyxFQXBDUyxHQUFHLEtBQUgsR0FBRyxRQW9DWjtBQ3RDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFFdkMsSUFBVSxHQUFHLENBeU9aO0FBek9ELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWCxJQUFpQixJQUFJLENBdU9wQjtJQXZPRCxXQUFpQixJQUFJLEVBQUMsQ0FBQztRQUVuQixJQUFJLGNBQWMsR0FBRyxVQUFTLEdBQXdCO1lBRWxELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQU9VLHNCQUFpQixHQUFHO1lBQzNCLE1BQU0sQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU07Z0JBQzNDLFVBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSztnQkFDdkMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNO2dCQUN4QyxVQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztRQUNoRCxDQUFDLENBQUE7UUFFVSwrQkFBMEIsR0FBRyxVQUFTLEdBQUc7WUFDaEQsSUFBSSxLQUFLLEdBQUcsb0JBQW9CLENBQUM7WUFHakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDckIsS0FBSyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ2hDLENBQUM7WUFFRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBR1UsbUNBQThCLEdBQUcsVUFBUyxHQUF1QjtZQUN4RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZixVQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUNwQyxVQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzVDLENBQUM7WUFDRCxVQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDL0IsVUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQztZQUM5QyxVQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO1lBQ2pELFVBQU0sQ0FBQyx1QkFBdUIsR0FBRyxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDN0QsVUFBTSxDQUFDLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztZQUV6RCxVQUFNLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDN0MsVUFBTSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksR0FBRyxVQUFNLENBQUMsYUFBYSxHQUFHLFVBQU0sQ0FBQyxXQUFXLENBQUM7WUFDckcsVUFBTSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztZQUV2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUE7UUFFVSxpQkFBWSxHQUFHO1lBQ3RCLENBQUMsSUFBSSxhQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUdVLGdCQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUUsR0FBRztZQUN2QyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLElBQUksRUFBRSxHQUFHO2FBQ1osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBS1UsZ0JBQVcsR0FBRztZQUNyQixJQUFJLFFBQVEsR0FBYSxJQUFJLFlBQVEsRUFBRSxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxpQkFBWSxHQUFHO1lBRXRCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFN0IsSUFBSSxPQUFlLENBQUM7WUFDcEIsSUFBSSxPQUFlLENBQUM7WUFDcEIsSUFBSSxZQUFZLEdBQVksS0FBSyxDQUFDO1lBRWxDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkQsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2dCQUk1QyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNiLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUczRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUVsRCxZQUFZLEdBQUcsQ0FBQyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxDQUFDO2dCQUtyRSxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUM3QixDQUFDO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsVUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixRQUFJLENBQUMsSUFBSSxDQUF3QyxPQUFPLEVBQUU7b0JBQ3RELFVBQVUsRUFBRSxPQUFPO29CQUNuQixVQUFVLEVBQUUsT0FBTztvQkFDbkIsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7b0JBQzFDLEtBQUssRUFBRSxRQUFJLENBQUMsbUJBQW1CO2lCQUNsQyxFQUFFLFVBQVMsR0FBdUI7b0JBQy9CLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ2Ysa0JBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDdkQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxXQUFNLEdBQUcsVUFBUyxzQkFBc0I7WUFDL0MsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFHRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTlCLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztnQkFDekIsZ0JBQVcsQ0FBQyxRQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELFFBQUksQ0FBQyxJQUFJLENBQTBDLFFBQVEsRUFBRSxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFBO1FBRVUsVUFBSyxHQUFHLFVBQVMsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHO1lBQzFDLFFBQUksQ0FBQyxJQUFJLENBQXdDLE9BQU8sRUFBRTtnQkFDdEQsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzFDLEtBQUssRUFBRSxRQUFJLENBQUMsbUJBQW1CO2FBQ2xDLEVBQUUsVUFBUyxHQUF1QjtnQkFDL0Isa0JBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFVSx5QkFBb0IsR0FBRztZQUM5QixDQUFDLENBQUMsWUFBWSxDQUFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHLFVBQVMsR0FBd0IsRUFBRSxHQUFZLEVBQUUsR0FBWSxFQUFFLFlBQXNCLEVBQUUsUUFBbUI7WUFDakksRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLEdBQUcsR0FBRyxxQkFBcUIsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFeEYsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLGdCQUFXLENBQUMsUUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxnQkFBVyxDQUFDLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDeEMsZ0JBQVcsQ0FBQyxRQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsbUNBQThCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXBDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JDLENBQUM7Z0JBR0QsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDO2dCQUV0QixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNoRSxFQUFFLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDO29CQUMxQixVQUFNLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2dCQUNqQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNoRSxFQUFFLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7b0JBQ3RDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxVQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQ3ZELEVBQUUsR0FBRyxVQUFNLENBQUMsVUFBVSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsK0JBQTBCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2YsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBTWhELENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3RDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3RDLGdCQUFXLENBQUMsUUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBR0QsSUFBSSxvQkFBb0IsR0FBRyxVQUFTLEdBQXVCO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsOEJBQThCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsVUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtJQUNMLENBQUMsRUF2T2dCLElBQUksR0FBSixRQUFJLEtBQUosUUFBSSxRQXVPcEI7QUFDTCxDQUFDLEVBek9TLEdBQUcsS0FBSCxHQUFHLFFBeU9aO0FDM09ELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUV2QyxJQUFVLEdBQUcsQ0EyS1o7QUEzS0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLElBQUksQ0F5S3BCO0lBektELFdBQWlCLElBQUksRUFBQyxDQUFDO1FBRVIsMkJBQXNCLEdBQVksS0FBSyxDQUFDO1FBRXhDLG9CQUFlLEdBQUc7WUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsZUFBZSxDQUFDO2dCQUN4QixNQUFNLENBQUM7WUFDWCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFcEIsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLGNBQWMsS0FBSyxVQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDakQsVUFBVSxJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDckUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsVUFBVSxJQUFJLGVBQWUsR0FBRyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hGLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNVSx3QkFBbUIsR0FBRyxVQUFTLEdBQTZCLEVBQUUsUUFBYztZQUNuRixVQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFL0IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSix5QkFBb0IsRUFBRSxDQUFDO1lBQzNCLENBQUM7WUFFRCxVQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUE7UUFLVSxnQkFBVyxHQUFHLFVBQVMsTUFBWSxFQUFFLGtCQUF3QixFQUFFLFdBQWlCLEVBQUUsZUFBeUI7WUFDbEgsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sR0FBRyxVQUFNLENBQUMsYUFBYSxDQUFDO1lBQ2xDLENBQUM7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLGNBQWMsR0FBa0IsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2hFLFdBQVcsR0FBRyxjQUFjLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQ3RFLENBQUM7WUFPRCxRQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixTQUFTLEVBQUUsSUFBSTtnQkFDZixvQkFBb0IsRUFBRSxrQkFBa0IsR0FBRyxJQUFJLEdBQUcsS0FBSztnQkFDdkQsUUFBUSxFQUFHLE9BQUcsQ0FBQyxVQUFVO2FBQzVCLEVBQUUsVUFBUyxHQUE0QjtnQkFDcEMsd0JBQW1CLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUV0QyxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksVUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLElBQUksVUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDM0UsUUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFVSxhQUFRLEdBQUc7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3RDLE9BQUcsQ0FBQyxVQUFVLElBQUksT0FBRyxDQUFDLGFBQWEsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLE9BQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFDRCxRQUFRLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGFBQVEsR0FBRztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEMsT0FBRyxDQUFDLFVBQVUsSUFBSSxPQUFHLENBQUMsYUFBYSxDQUFDO1lBQ3BDLFFBQVEsRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsSUFBSSxRQUFRLEdBQUc7WUFDWCxRQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxVQUFNLENBQUMsYUFBYTtnQkFDOUIsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsUUFBUSxFQUFHLE9BQUcsQ0FBQyxVQUFVO2FBQzVCLEVBQUUsVUFBUyxHQUE0QjtnQkFDcEMsd0JBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBUVUseUJBQW9CLEdBQUc7WUFDOUIsMkJBQXNCLEdBQUcsSUFBSSxDQUFDO1lBRTlCLFVBQVUsQ0FBQztnQkFDUCwyQkFBc0IsR0FBRyxLQUFLLENBQUM7Z0JBRS9CLElBQUksR0FBRyxHQUFRLE9BQUcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzlCLENBQUM7Z0JBR0QsSUFBSSxDQUFDLENBQUM7Z0JBTU4sQ0FBQztZQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQTtRQUtVLGdCQUFXLEdBQUc7WUFDckIsRUFBRSxDQUFDLENBQUMsMkJBQXNCLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQztRQVlmLENBQUMsQ0FBQTtRQUVVLDRCQUF1QixHQUFHLFVBQVMsS0FBYTtZQUN2RCxJQUFJLElBQUksR0FBa0IsUUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBUSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQztZQUVYLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksV0FBVyxHQUFHLFFBQVEsR0FBRyxVQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUtyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsV0FBVyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNuRCxDQUFDO2dCQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxtQkFBYyxHQUFHO1lBQ3hCLFFBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRSxFQUFFLEVBQUUsVUFBUyxHQUErQjtnQkFDMUgsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtJQUNMLENBQUMsRUF6S2dCLElBQUksR0FBSixRQUFJLEtBQUosUUFBSSxRQXlLcEI7QUFDTCxDQUFDLEVBM0tTLEdBQUcsS0FBSCxHQUFHLFFBMktaO0FDN0tELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUU1QyxJQUFVLEdBQUcsQ0E2SVo7QUE3SUQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLElBQWlCLFNBQVMsQ0EySXpCO0lBM0lELFdBQWlCLFNBQVMsRUFBQyxDQUFDO1FBRXhCLElBQUksZ0JBQWdCLEdBQUcsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLEVBQVc7WUFDdkUsSUFBSSxjQUFjLEdBQUc7Z0JBQ2pCLEtBQUssRUFBRSxjQUFjO2FBQ3hCLENBQUM7WUFFRixJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFaEUsSUFBSSxpQkFBaUIsR0FBRztnQkFDcEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsWUFBWSxFQUFFLEVBQUU7YUFDbkIsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ0MsaUJBQWtCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1lBRUQsTUFBTSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQU05QyxTQUFTO2dCQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQTtRQUVELElBQUksbUJBQW1CLEdBQUcsVUFBUyxPQUFlO1lBQzlDLE1BQU0sQ0FBQyxVQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtnQkFDNUIsT0FBTyxFQUFFLHNDQUFzQztnQkFDL0MsWUFBWSxFQUFFLEVBQUU7YUFHbkIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxRQUFRLEdBQUcsVUFBUyxJQUFZLEVBQUUsRUFBVSxFQUFFLE9BQVk7WUFDMUQsTUFBTSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO2dCQUM1QixJQUFJLEVBQUUsRUFBRTtnQkFDUixTQUFTLEVBQUUsT0FBTztnQkFDbEIsWUFBWSxFQUFFLEVBQUU7YUFDbkIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxLQUFLLEdBQVcsYUFBYSxDQUFDO1FBRXZCLGVBQUssR0FBRztZQVNmLElBQUksUUFBUSxHQUNSLFFBQVEsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDcEUsSUFBSSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXBELElBQUksYUFBYSxHQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsd0JBQXdCLENBQUM7Z0JBQ2hFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsbUNBQW1DLENBQUM7Z0JBQzdFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLENBQUM7Z0JBQy9ELFFBQVEsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsMkJBQTJCLENBQUM7Z0JBQ3JFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSx1QkFBdUIsRUFBRSw2QkFBNkIsQ0FBQztnQkFDcEYsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsK0JBQStCLENBQUM7Z0JBQ3BFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLCtCQUErQixDQUFDO2dCQUNwRSxRQUFRLENBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFDN0UsSUFBSSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXZELElBQUksYUFBYSxHQUNiLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsd0JBQXdCLENBQUM7Z0JBQzVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsMEJBQTBCLENBQUM7Z0JBQ2xFLFFBQVEsQ0FBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsMkJBQTJCLENBQUM7Z0JBQ3RFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsd0JBQXdCLEVBQUUsOEJBQThCLENBQUMsQ0FBQztZQUNwRixJQUFJLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFdkQsSUFBSSxtQkFBbUIsR0FDbkIsUUFBUSxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLHlDQUF5QyxDQUFDO2dCQUMvRixRQUFRLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUUsd0NBQXdDLENBQUM7Z0JBQzVGLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSx5QkFBeUIsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ25HLElBQUksY0FBYyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRXJFLElBQUksZ0JBQWdCLEdBQ2hCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSx1QkFBdUIsRUFBRSw4QkFBOEIsQ0FBQztnQkFDdEYsUUFBUSxDQUFDLHNCQUFzQixFQUFFLHVCQUF1QixFQUFFLDhCQUE4QixDQUFDLENBQUM7WUFDOUYsSUFBSSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFOUQsSUFBSSxlQUFlLEdBQ2YsUUFBUSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxzQ0FBc0MsQ0FBQztnQkFFckYsUUFBUSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxtQ0FBbUMsQ0FBQztnQkFDM0UsUUFBUSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx3Q0FBd0MsQ0FBQyxDQUFDO1lBRXZGLElBQUksVUFBVSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUU3RCxJQUFJLGlCQUFpQixHQUNqQixRQUFRLENBQUMsU0FBUyxFQUFFLHVCQUF1QixFQUFFLGtDQUFrQyxDQUFDO2dCQUNoRixRQUFRLENBQUMsVUFBVSxFQUFFLHdCQUF3QixFQUFFLCtCQUErQixDQUFDLENBQUM7WUFDcEYsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFFbkUsSUFBSSxvQkFBb0IsR0FDcEIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLDBCQUEwQixDQUFDO2dCQUM5RSxRQUFRLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLHVCQUF1QixDQUFDO2dCQUNqRSxRQUFRLENBQUMsVUFBVSxFQUFFLHVCQUF1QixFQUFFLDJCQUEyQixDQUFDO2dCQUMxRSxRQUFRLENBQUMsYUFBYSxFQUFFLDBCQUEwQixFQUFFLDhCQUE4QixDQUFDO2dCQUVuRixRQUFRLENBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFDbEYsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFLckUsSUFBSSxjQUFjLEdBQ2QsUUFBUSxDQUFDLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLHVDQUF1QyxDQUFDO2dCQUM5RixRQUFRLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsc0NBQXNDLENBQUM7Z0JBQ3pGLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSw2QkFBNkIsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1lBRy9HLElBQUksYUFBYSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVoRSxJQUFJLFVBQVUsR0FDVixRQUFRLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFDaEYsSUFBSSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVuRSxJQUFJLFNBQVMsR0FDVCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDOUUsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTVELElBQUksT0FBTyxHQUFtQixXQUFXLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxjQUFjLEdBQUcsV0FBVyxHQUFHLGVBQWUsR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLGFBQWE7a0JBQ3RKLFNBQVMsR0FBRyxZQUFZLENBQUM7WUFFL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFBO1FBRVUsY0FBSSxHQUFHO1lBQ2QsVUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTNJZ0IsU0FBUyxHQUFULGFBQVMsS0FBVCxhQUFTLFFBMkl6QjtBQUNMLENBQUMsRUE3SVMsR0FBRyxLQUFILEdBQUcsUUE2SVo7QUMvSUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBTzFDLElBQVUsR0FBRyxDQTZWWjtBQTdWRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1gsSUFBaUIsT0FBTyxDQTJWdkI7SUEzVkQsV0FBaUIsT0FBTyxFQUFDLENBQUM7UUFDWCxjQUFNLEdBQVEsSUFBSSxDQUFDO1FBQ25CLHdCQUFnQixHQUFXLElBQUksQ0FBQztRQUUzQyxJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQWtCLElBQUksQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBZ0IsSUFBSSxDQUFDO1FBRW5DLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztRQUVmLG1CQUFXLEdBQUc7WUFDckIsUUFBSSxDQUFDLElBQUksQ0FBb0QsYUFBYSxFQUFFLEVBQzNFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUE7UUFFRCxJQUFJLG1CQUFtQixHQUFHO1lBQ3RCLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUE7UUFFVSxzQkFBYyxHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUFtQjtZQUN6RSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7WUFDckIsSUFBSSxLQUFLLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEYsSUFBSSxJQUFJLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEYsSUFBSSxNQUFNLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdEYsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQ3hCLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUN2QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2lCQUN6QixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGtCQUFrQjtpQkFDOUIsRUFDRyxJQUFJLENBQUMsQ0FBQztZQUNkLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULEdBQUcsSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2lCQUN0QixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGlDQUF5QixHQUFHLFVBQVMsSUFBbUI7WUFDL0QsSUFBSSxJQUFJLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEYsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN0QixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEYsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEYsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDeEIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVVLHNCQUFjLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW1CO1lBQ3pFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRixJQUFJLE9BQU8sR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRixJQUFJLFNBQVMsR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RixJQUFJLE9BQU8sR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRixJQUFJLE1BQU0sR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRixJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7WUFFdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxLQUFLLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ3JCLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSztpQkFDeEIsRUFBRSxVQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUVELElBQUksU0FBUyxHQUFHLGlDQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osS0FBSyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUNoQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSztvQkFDOUQsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUNoQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFDeEIsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQzFCLEVBQUUsTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2lCQUN6QixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGtCQUFrQjtpQkFDOUIsRUFDRyxLQUFLLENBQUMsQ0FBQztZQUNmLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsNEJBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1lBQzNGLElBQUksU0FBUyxHQUFhO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjtnQkFDcEIsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLG1CQUFtQjtnQkFDbkIsd0JBQXdCLENBQUMsQ0FBQztZQUU5QixNQUFNLENBQUMsU0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRVUsNEJBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1lBQzNGLElBQUksU0FBUyxHQUFhO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjtnQkFDcEIsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLHNCQUFzQixDQUFDLENBQUM7WUFFNUIsTUFBTSxDQUFDLFNBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtRQUVVLHdCQUFnQixHQUFHLFVBQVMsSUFBWTtZQUMvQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ1gsSUFBSSxHQUFHLFVBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLFFBQU0sR0FBRyxpQ0FBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxRQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7d0JBQzlFLEtBQUssRUFBRSxRQUFNO3FCQUNoQixFQUFFLFVBQVMsR0FBK0I7d0JBQ3ZDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN2QixJQUFJLEdBQUcsR0FBRyxJQUFJLGtCQUFjLENBQUMsUUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQzFELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELElBQUksaUJBQWlCLEdBQUcsVUFBUyxJQUFZO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxNQUFNLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNULGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckMsQ0FBQztZQUNMLENBQUM7WUFDRCxJQUFJO2dCQUFDLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxDQUFDO1FBQ2pELENBQUMsQ0FBQTtRQUVELElBQUksa0JBQWtCLEdBQUcsVUFBUyxNQUFjO1lBQzVDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFaEIsSUFBSSxPQUFPLEdBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxHQUFHLENBQUMsQ0FBWSxVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sQ0FBQztnQkFBbkIsSUFBSSxHQUFHLGdCQUFBO2dCQUNSLElBQUksUUFBUSxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDMUMsUUFBUSxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxTQUFTLEdBQVcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELElBQUksT0FBTyxHQUFXLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksYUFBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1FBQ0wsQ0FBQyxDQUFBO1FBT0QsSUFBSSxnQkFBZ0IsR0FBRyxVQUFTLE9BQWU7WUFFM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxTQUFTLEdBQWEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqRCxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRVUsd0JBQWdCLEdBQUc7WUFFMUIsRUFBRSxDQUFDLENBQUMsY0FBTSxJQUFJLHdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDN0IsY0FBTSxDQUFDLFdBQVcsR0FBRyx3QkFBZ0IsQ0FBQztnQkFDdEMsd0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxpQkFBUyxHQUFHLFVBQVMsR0FBVyxFQUFFLEdBQVE7WUFDakQsY0FBTSxHQUFHLEdBQUcsQ0FBQztZQUNiLHdCQUFnQixFQUFFLENBQUM7WUFDbkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUVVLG9CQUFZLEdBQUcsVUFBUyxHQUFXLEVBQUUsR0FBUTtZQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBS2IsU0FBUyxHQUFHLFdBQVcsQ0FBQyx5QkFBaUIsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUVELGNBQU0sR0FBRyxHQUFHLENBQUM7WUFNYix3QkFBZ0IsRUFBRSxDQUFDO1lBRW5CLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN4QixHQUFHLENBQUMsQ0FBWSxVQUFVLEVBQVYseUJBQVUsRUFBVix3QkFBVSxFQUFWLElBQVUsQ0FBQztnQkFBdEIsSUFBSSxHQUFHLG1CQUFBO2dCQUVSLEVBQUUsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFNBQVM7b0JBQ25DLENBQUMsY0FBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUl6RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxjQUFNLENBQUMsV0FBVyxHQUFHLGNBQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFHOUQsY0FBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7d0JBQ3BCLGNBQU0sQ0FBQyxXQUFXLEdBQUcsY0FBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQzdDLENBQUM7b0JBRUQsSUFBSSxDQUFDLENBQUM7d0JBQ0YsY0FBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtvQkFDeEMsQ0FBQztvQkFDRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQzthQUNKO1FBQ0wsQ0FBQyxDQUFBO1FBR1UseUJBQWlCLEdBQUc7WUFRM0IsRUFBRSxDQUFDLENBQUMsY0FBTSxJQUFJLENBQUMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUZBQW1GLENBQUMsQ0FBQztvQkFDakcsY0FBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNuQixDQUFDO2dCQUVELHNCQUFjLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdVLGFBQUssR0FBRztZQUNmLEVBQUUsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsY0FBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLHNCQUFjLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSxjQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHFCQUFhLEdBQUcsVUFBUyxHQUFtQjtZQUNuRCxFQUFFLENBQUMsQ0FBQyxjQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULGNBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixVQUFVLENBQUM7b0JBQ1Asc0JBQWMsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLGNBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxDQUFDO29CQUM1QixjQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNkLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFFckIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDTixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLFlBQUksR0FBRztZQUNkLEVBQUUsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxhQUFLLEdBQUcsVUFBUyxJQUFZO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsY0FBTSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdVLFlBQUksR0FBRyxVQUFTLEtBQWE7WUFDcEMsRUFBRSxDQUFDLENBQUMsY0FBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxjQUFNLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsc0JBQWMsR0FBRyxVQUFTLEdBQVcsRUFBRSxVQUFrQjtZQUNoRSxFQUFFLENBQUMsQ0FBQyxVQUFNLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUU5QixRQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7Z0JBQzlFLEtBQUssRUFBRSxHQUFHO2dCQUNWLFlBQVksRUFBRSxVQUFVO2dCQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDeEIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUVELElBQUkscUJBQXFCLEdBQUc7UUFFNUIsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTNWZ0IsT0FBTyxHQUFQLFdBQU8sS0FBUCxXQUFPLFFBMlZ2QjtBQUNMLENBQUMsRUE3VlMsR0FBRyxLQUFILEdBQUcsUUE2Vlo7QUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDbkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ25GLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0FBQy9GLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0FDelcvRixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFFL0MsSUFBVSxHQUFHLENBaUdaO0FBakdELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWCxJQUFpQixZQUFZLENBK0Y1QjtJQS9GRCxXQUFpQixZQUFZLEVBQUMsQ0FBQztRQUNoQix1QkFBVSxHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUFtQjtZQUNyRSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7WUFDckIsSUFBSSxRQUFRLEdBQXNCLFNBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdFLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztZQUV0QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUN4QixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsSUFBSSxhQUFhLEdBQVcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQ25ELFFBQVEsRUFBRSxRQUFRO2dCQUNsQixTQUFTLEVBQUUsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLO2dCQUMxRCxPQUFPLEVBQUUsZ0JBQWdCO2FBQzVCLEVBQ0csU0FBUyxDQUFDLENBQUM7WUFFZixJQUFJLFlBQVksR0FBVyxVQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtnQkFDbEQsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRSwyQkFBMkIsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUs7Z0JBQ3pELE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsRUFDRyxRQUFRLENBQUMsQ0FBQztZQUVkLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFFdkUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxhQUFhO2lCQUN6QixFQUFFLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCO2lCQUM5QixFQUNHLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLCtCQUFrQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUFtQjtZQUM3RSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7WUFFckIsSUFBSSxnQkFBZ0IsR0FBc0IsU0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFPLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkcsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLFVBQVUsR0FBRyxVQUFNLENBQUMsa0NBQWtDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRW5GLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsR0FBRyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQixPQUFPLEVBQUUsYUFBYTtxQkFDekIsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7cUJBQzlCLEVBQ0csVUFBVSxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGlDQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUErQjtZQUMzRixJQUFJLFNBQVMsR0FBYTtnQkFDdEIsYUFBYSxDQUFDLENBQUM7WUFFbkIsTUFBTSxDQUFDLFNBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtRQUVVLG9CQUFPLEdBQUcsVUFBUyxJQUFZO1lBQ3RDLElBQUksT0FBTyxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtvQkFDckUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO29CQUNwQixTQUFTLEVBQUUsSUFBSTtvQkFDZixZQUFZLEVBQUUsSUFBSTtpQkFDckIsRUFBRSw0QkFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSw0QkFBZSxHQUFHLFVBQVMsR0FBNEI7WUFDOUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFBO1FBRVUsbUJBQU0sR0FBRyxVQUFTLElBQVk7WUFDckMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxDQUFDLENBQUE7UUFFVSx5QkFBWSxHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUErQjtZQUNuRixJQUFJLFNBQVMsR0FBYTtnQkFDdEIsYUFBYSxDQUFDLENBQUM7WUFFbkIsTUFBTSxDQUFDLFNBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtJQUNMLENBQUMsRUEvRmdCLFlBQVksR0FBWixnQkFBWSxLQUFaLGdCQUFZLFFBK0Y1QjtBQUNMLENBQUMsRUFqR1MsR0FBRyxLQUFILEdBQUcsUUFpR1o7QUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDekYsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0FBRWpHLEdBQUcsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO0FBQzdGLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0FDekdyRyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFN0MsSUFBVSxHQUFHLENBK1ZaO0FBL1ZELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFXWDtRQVFJLG9CQUFzQixLQUFhO1lBUnZDLGlCQW1WQztZQTNVeUIsVUFBSyxHQUFMLEtBQUssQ0FBUTtZQU4zQiwwQkFBcUIsR0FBWSxJQUFJLENBQUM7WUFvQjlDLFNBQUksR0FBRztZQUNQLENBQUMsQ0FBQTtZQUVELGVBQVUsR0FBRztZQUNiLENBQUMsQ0FBQTtZQUVELFVBQUssR0FBRztnQkFDSixNQUFNLENBQUMsRUFBRSxDQUFBO1lBQ2IsQ0FBQyxDQUFDO1lBRUYsU0FBSSxHQUFHO2dCQUNILElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFJaEIsSUFBSSxlQUFlLEdBQUcsUUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUd0RCxJQUFJLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFPN0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFNbEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVCLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUd2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztnQkFFckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUd2QixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO29CQUU3QixJQUFJLE9BQU8sR0FDUCxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFJZCxPQUFPLEVBQUcsbUNBQW1DO3FCQUNoRCxFQUNHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUN0QixRQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkF1QjlCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBR0YsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUszQixRQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFHRCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFFbEIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBR3JDLElBQUksT0FBTyxHQUFHLFFBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBZ0IvQixPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztnQkFNM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFHcEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLFVBQVMsV0FBVztvQkFHN0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztnQkFPSCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUdyQixVQUFVLENBQUM7b0JBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUdQLFVBQVUsQ0FBQztvQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDYixDQUFDLENBQUE7WUFZRCxPQUFFLEdBQUcsVUFBQyxFQUFFO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUM7b0JBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFHaEIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQztnQkFDRCxNQUFNLENBQUMsRUFBRSxHQUFHLFFBQVEsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQyxDQUFDLENBQUE7WUFFRCxzQkFBaUIsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVO2dCQUN6QyxNQUFNLENBQUMsVUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFBO1lBRUQsa0JBQWEsR0FBRyxVQUFDLFNBQWlCLEVBQUUsRUFBVTtnQkFDMUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxVQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtvQkFDN0IsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLElBQUksRUFBRSxFQUFFO29CQUNSLE9BQU8sRUFBRSxjQUFjO2lCQUMxQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHLFVBQUMsT0FBZSxFQUFFLEVBQVc7Z0JBQzNDLElBQUksS0FBSyxHQUFHO29CQUNSLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLENBQUM7Z0JBQ0YsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDTCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNLENBQUMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQTtZQUlELGVBQVUsR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYSxFQUFFLEdBQVM7Z0JBQzVELElBQUksT0FBTyxHQUFHO29CQUNWLFFBQVEsRUFBRSxRQUFRO29CQUNsQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ2pCLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFFRCxNQUFNLENBQUMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHLFVBQUMsSUFBWSxFQUFFLEVBQVUsRUFBRSxRQUFjLEVBQUUsR0FBUyxFQUFFLGdCQUEwQjtnQkFFOUYsSUFBSSxPQUFPLEdBQUc7b0JBQ1YsUUFBUSxFQUFFLFFBQVE7b0JBRWxCLGdCQUFnQixFQUFFLGdCQUFnQjtvQkFDbEMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUNqQixPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixDQUFDO2dCQUVGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFFakIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sR0FBRyxVQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztnQkFFRCxPQUFPLElBQUksR0FBRyxHQUFHLFVBQU0sQ0FBQyxhQUFhLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFFekQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUE7Z0JBQ3RDLENBQUM7Z0JBRUQsTUFBTSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFBO1lBRUQsaUJBQVksR0FBRyxVQUFDLEVBQVUsRUFBRSxRQUFhO2dCQUNyQyxRQUFJLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsZ0JBQVcsR0FBRyxVQUFDLEVBQVUsRUFBRSxHQUFXO2dCQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixDQUFDO2dCQUNELFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUE7WUFFRCxnQkFBVyxHQUFHLFVBQUMsRUFBVTtnQkFDckIsTUFBTSxDQUFDLFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hELENBQUMsQ0FBQTtZQUVELFlBQU8sR0FBRyxVQUFDLElBQVksRUFBRSxFQUFVO2dCQUMvQixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFBO1lBRUQsb0JBQWUsR0FBRyxVQUFDLEtBQWEsRUFBRSxFQUFVO2dCQUN4QyxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFVBQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUU7b0JBQ3BDLElBQUksRUFBRSxFQUFFO29CQUNSLE1BQU0sRUFBRSxFQUFFO2lCQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUE7WUFFRCxpQkFBWSxHQUFHLFVBQUMsS0FBYSxFQUFFLEVBQVUsRUFBRSxZQUFxQjtnQkFDNUQsRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRWpCLElBQUksS0FBSyxHQUFHO29CQUVSLE1BQU0sRUFBRSxFQUFFO29CQUNWLElBQUksRUFBRSxFQUFFO2lCQUNYLENBQUM7Z0JBWUYsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELElBQUksUUFBUSxHQUFXLFVBQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFdEUsUUFBUSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUM1QixLQUFLLEVBQUUsRUFBRTtpQkFDWixFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNwQixDQUFDLENBQUE7WUFFRCxlQUFVLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVyxFQUFFLFFBQWtCO2dCQUN2RCxJQUFJLEtBQUssR0FBRztvQkFDUixPQUFPLEVBQXlCLENBQUMsUUFBUSxHQUFHLG9DQUFvQyxHQUFHLEVBQUUsQ0FBQyxHQUFDLGdCQUFnQjtpQkFDMUcsQ0FBQztnQkFHRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUdELE1BQU0sQ0FBQyxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFBO1lBRUQsVUFBSyxHQUFHLFVBQUMsRUFBVTtnQkFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQztnQkFDRCxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakIsVUFBVSxDQUFDO29CQUNQLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFBO1lBelVHLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBT2YsVUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQXNKTSwyQkFBTSxHQUFiO1lBQ0ksSUFBSSxPQUFPLEdBQUcsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQXdLTCxpQkFBQztJQUFELENBQUMsQUFuVkQsSUFtVkM7SUFuVlksY0FBVSxhQW1WdEIsQ0FBQTtBQUNMLENBQUMsRUEvVlMsR0FBRyxLQUFILEdBQUcsUUErVlo7QUNqV0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRTdDLElBQVUsR0FBRyxDQTJCWjtBQTNCRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBZ0MsOEJBQVU7UUFFdEMsb0JBQW9CLEtBQWEsRUFBVSxPQUFlLEVBQVUsVUFBa0IsRUFBVSxXQUFxQixFQUM1RyxVQUFxQjtZQUhsQyxpQkF5QkM7WUFyQk8sa0JBQU0sWUFBWSxDQUFDLENBQUM7WUFGSixVQUFLLEdBQUwsS0FBSyxDQUFRO1lBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQUFVLGVBQVUsR0FBVixVQUFVLENBQVE7WUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBVTtZQUM1RyxlQUFVLEdBQVYsVUFBVSxDQUFXO1lBTzlCLFVBQUssR0FBRztnQkFDSixJQUFJLE9BQU8sR0FBVyxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBRTdHLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUM7c0JBQzVFLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEUsT0FBTyxJQUFJLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNuQixDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNoRCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUE7UUFuQkQsQ0FBQztRQW9CTCxpQkFBQztJQUFELENBQUMsQUF6QkQsQ0FBZ0MsY0FBVSxHQXlCekM7SUF6QlksY0FBVSxhQXlCdEIsQ0FBQTtBQUNMLENBQUMsRUEzQlMsR0FBRyxLQUFILEdBQUcsUUEyQlo7QUM3QkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTlDLElBQVUsR0FBRyxDQTRCWjtBQTVCRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBaUMsK0JBQVU7UUFFdkM7WUFGSixpQkEwQkM7WUF2Qk8sa0JBQU0sYUFBYSxDQUFDLENBQUM7WUFNekIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU3RCxJQUFJLFdBQVcsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO29CQUMzQyxlQUFlLEVBQUUsZUFBZTtvQkFDaEMsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLEtBQUs7b0JBQ1osS0FBSyxFQUFFLE1BQU07aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxJQUFJLFlBQVksR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDakMsT0FBTyxFQUFFLDJCQUEyQjtvQkFDcEMsT0FBTyxFQUFFLG9DQUFvQztpQkFDaEQsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFFaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7WUFDakMsQ0FBQyxDQUFBO1FBckJELENBQUM7UUFzQkwsa0JBQUM7SUFBRCxDQUFDLEFBMUJELENBQWlDLGNBQVUsR0EwQjFDO0lBMUJZLGVBQVcsY0EwQnZCLENBQUE7QUFDTCxDQUFDLEVBNUJTLEdBQUcsS0FBSCxHQUFHLFFBNEJaO0FDOUJELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUs3QyxJQUFVLEdBQUcsQ0FxQlo7QUFyQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQWdDLDhCQUFVO1FBRXRDLG9CQUFvQixPQUFhLEVBQVUsS0FBVyxFQUFVLFFBQWM7WUFGbEYsaUJBbUJDO1lBaEJPLGtCQUFNLFlBQVksQ0FBQyxDQUFDO1lBREosWUFBTyxHQUFQLE9BQU8sQ0FBTTtZQUFVLFVBQUssR0FBTCxLQUFLLENBQU07WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFNO1lBWTlFLFVBQUssR0FBRztnQkFDSixJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQzFFLE9BQU8sSUFBSSxVQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFBO1lBYkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULEtBQUssR0FBRyxTQUFTLENBQUM7WUFDdEIsQ0FBQztZQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7UUFVTCxpQkFBQztJQUFELENBQUMsQUFuQkQsQ0FBZ0MsY0FBVSxHQW1CekM7SUFuQlksY0FBVSxhQW1CdEIsQ0FBQTtBQUNMLENBQUMsRUFyQlMsR0FBRyxLQUFILEdBQUcsUUFxQlo7QUMxQkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBVTNDLElBQVUsR0FBRyxDQW1FWjtBQW5FRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBOEIsNEJBQVU7UUFDcEM7WUFESixpQkFpRUM7WUEvRE8sa0JBQU0sVUFBVSxDQUFDLENBQUM7WUFNdEIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRXRDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztvQkFDckQsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFFbkQsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQzVFLElBQUksbUJBQW1CLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxLQUFJLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUM5RyxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RixJQUFJLE9BQU8sR0FBRyxzQ0FBc0MsQ0FBQztnQkFFckQsSUFBSSxJQUFJLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztnQkFFcEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsV0FBVyxDQUFDO2dCQUVuQyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNuQixDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFBO1lBRUQsd0JBQW1CLEdBQUc7Z0JBQ2xCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRTFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ04sS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDTixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFVBQUssR0FBRztnQkFFSixJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUV2QyxRQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFBO1lBRUQsa0JBQWEsR0FBRztnQkFDWixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLElBQUksR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRXZDLENBQUMsSUFBSSxjQUFVLENBQUMsd0JBQXdCLEVBQ3BDLHdHQUF3RyxFQUN4RyxhQUFhLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLENBQUMsSUFBSSxvQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQTtRQTdERCxDQUFDO1FBOERMLGVBQUM7SUFBRCxDQUFDLEFBakVELENBQThCLGNBQVUsR0FpRXZDO0lBakVZLFlBQVEsV0FpRXBCLENBQUE7QUFDTCxDQUFDLEVBbkVTLEdBQUcsS0FBSCxHQUFHLFFBbUVaO0FDN0VELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUs1QyxJQUFVLEdBQUcsQ0F1R1o7QUF2R0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQStCLDZCQUFVO1FBRXJDO1lBRkosaUJBcUdDO1lBbEdPLGtCQUFNLFdBQVcsQ0FBQyxDQUFDO1lBTXZCLFVBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsQ0FBQztnQkFFekQsSUFBSSxZQUFZLEdBQ1osS0FBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUM7b0JBQzVDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7b0JBQ3BELEtBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztvQkFDMUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRW5ELElBQUksWUFBWSxHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUMvQjtvQkFDSSxPQUFPLEVBQUUsZUFBZTtpQkFDM0IsRUFDRCxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFDWjtvQkFDSSxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQzdCLE9BQU8sRUFBRSxTQUFTO29CQUNsQixLQUFLLEVBQUUsRUFBRTtpQkFDWixFQUNELEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUVwQixJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLHlCQUF5QixFQUNuRixLQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ2xDLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBRXJFLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXZGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7WUFNNUQsQ0FBQyxDQUFBO1lBRUQsV0FBTSxHQUFHO2dCQUNMLElBQUksUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUdoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQ2pDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFDakMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDO29CQUMzQixDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLENBQUMsSUFBSSxjQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyRSxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxRQUFJLENBQUMsSUFBSSxDQUF5QyxRQUFRLEVBQUU7b0JBQ3hELFVBQVUsRUFBRSxRQUFRO29CQUNwQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsU0FBUyxFQUFFLE9BQU87aUJBQ3JCLEVBQUUsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsR0FBd0I7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUc1QyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRWQsQ0FBQyxJQUFJLGNBQVUsQ0FDWCx5RUFBeUUsRUFDekUsUUFBUSxDQUNYLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsc0JBQWlCLEdBQUc7Z0JBRWhCLElBQUksQ0FBQyxHQUFHLFFBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQU1qQyxJQUFJLEdBQUcsR0FBRyxhQUFhLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUE7WUFFRCxxQkFBZ0IsR0FBRztnQkFDZixLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLFFBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQTtRQWhHRCxDQUFDO1FBaUdMLGdCQUFDO0lBQUQsQ0FBQyxBQXJHRCxDQUErQixjQUFVLEdBcUd4QztJQXJHWSxhQUFTLFlBcUdyQixDQUFBO0FBQ0wsQ0FBQyxFQXZHUyxHQUFHLEtBQUgsR0FBRyxRQXVHWjtBQzVHRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFM0MsSUFBVSxHQUFHLENBOEVaO0FBOUVELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUE4Qiw0QkFBVTtRQUNwQztZQURKLGlCQTRFQztZQTFFTyxrQkFBTSxVQUFVLENBQUMsQ0FBQztZQU10QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7b0JBQy9ELEtBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRXpELElBQUksZ0JBQWdCLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbkQsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7b0JBQ3JDLFVBQVUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2lCQUN4QyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLG9CQUFvQixHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLFVBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdkcsSUFBSSxXQUFXLEdBQUcsVUFBTSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBRXBFLElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDO2dCQUVwQyxJQUFJLE1BQU0sR0FBRyw2QkFBNkIsQ0FBQztnQkFDM0MsSUFBSSxRQUFRLEdBQUcsVUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQztnQkFFbEUsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDbkcsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFFOUUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUN2RCxDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHO2dCQUNkLElBQUksT0FBTyxHQUFHLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELFVBQU0sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLFVBQU0sQ0FBQyxXQUFXO3NCQUN6RixVQUFNLENBQUMsYUFBYSxDQUFDO2dCQUUzQixJQUFJLG9CQUFvQixHQUFHLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxVQUFNLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBRXhELFFBQUksQ0FBQyxJQUFJLENBQW9FLHFCQUFxQixFQUFFO29CQUVoRyxpQkFBaUIsRUFBRTt3QkFDZixjQUFjLEVBQUUsVUFBTSxDQUFDLGNBQWMsS0FBSyxVQUFNLENBQUMsYUFBYTt3QkFDOUQsVUFBVSxFQUFFLFVBQU0sQ0FBQyxlQUFlLENBQUMsUUFBUTt3QkFFM0MsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLGVBQWUsRUFBRSxLQUFLO3dCQUN0QixlQUFlLEVBQUUsS0FBSzt3QkFDdEIsY0FBYyxFQUFFLFVBQU0sQ0FBQyxZQUFZO3FCQUN0QztpQkFDSixFQUFFLEtBQUksQ0FBQyx1QkFBdUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUE7WUFFRCw0QkFBdUIsR0FBRyxVQUFDLEdBQXFDO2dCQUM1RCxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsVUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEMsVUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUdyQixDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILElBQUksT0FBTyxHQUFHLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQU0sQ0FBQyxjQUFjLElBQUksVUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSTtxQkFDN0YsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFHN0IsT0FBTyxHQUFHLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFNLENBQUMsWUFBWSxDQUFDO2dCQUUzQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQTtRQXhFRCxDQUFDO1FBeUVMLGVBQUM7SUFBRCxDQUFDLEFBNUVELENBQThCLGNBQVUsR0E0RXZDO0lBNUVZLFlBQVEsV0E0RXBCLENBQUE7QUFDTCxDQUFDLEVBOUVTLEdBQUcsS0FBSCxHQUFHLFFBOEVaO0FDaEZELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUVuRCxJQUFVLEdBQUcsQ0EwQlo7QUExQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQXNDLG9DQUFVO1FBRTVDO1lBRkosaUJBd0JDO1lBckJPLGtCQUFNLGtCQUFrQixDQUFDLENBQUM7WUFNOUIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxrQkFBa0IsR0FBRyxVQUFNLENBQUMsV0FBVyxHQUFHLDJCQUEyQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLHVCQUF1QixDQUFDLENBQUM7Z0JBRTVKLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUU3RCxJQUFJLGVBQWUsR0FBRyxVQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNELElBQUksa0JBQWtCLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3ZDLE9BQU8sRUFBRSxtQkFBbUI7aUJBQy9CLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRXBCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1lBQ25ELENBQUMsQ0FBQTtRQW5CRCxDQUFDO1FBb0JMLHVCQUFDO0lBQUQsQ0FBQyxBQXhCRCxDQUFzQyxjQUFVLEdBd0IvQztJQXhCWSxvQkFBZ0IsbUJBd0I1QixDQUFBO0FBQ0wsQ0FBQyxFQTFCUyxHQUFHLEtBQUgsR0FBRyxRQTBCWjtBQzVCRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFFNUMsSUFBVSxHQUFHLENBOENaO0FBOUNELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUErQiw2QkFBVTtRQUNyQztZQURKLGlCQTRDQztZQTFDTyxrQkFBTSxXQUFXLENBQUMsQ0FBQztZQU12QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFOUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUVyRixJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVwRSxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsZ0JBQVcsR0FBRztnQkFDVixJQUFJLGFBQWEsR0FBRyxVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxjQUFjLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUU5RCxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxJQUFJLGNBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLFFBQUksQ0FBQyxJQUFJLENBQTBDLGFBQWEsRUFBRTt3QkFDOUQsUUFBUSxFQUFFLGFBQWEsQ0FBQyxFQUFFO3dCQUMxQixnQkFBZ0IsRUFBRSxjQUFjO3FCQUNuQyxFQUFFLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsR0FBd0I7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzlDLFVBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hDLFFBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUNoQyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1FBeENELENBQUM7UUF5Q0wsZ0JBQUM7SUFBRCxDQUFDLEFBNUNELENBQStCLGNBQVUsR0E0Q3hDO0lBNUNZLGFBQVMsWUE0Q3JCLENBQUE7QUFDTCxDQUFDLEVBOUNTLEdBQUcsS0FBSCxHQUFHLFFBOENaO0FDaERELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUU1QyxJQUFVLEdBQUcsQ0ErQ1o7QUEvQ0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQStCLDZCQUFVO1FBQ3JDO1lBREosaUJBNkNDO1lBM0NPLGtCQUFNLFdBQVcsQ0FBQyxDQUFDO1lBTXZCLFVBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBRWhELElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztnQkFFL0UsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDMUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELGdCQUFXLEdBQUc7Z0JBQ1YsSUFBSSxhQUFhLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2hELElBQUksY0FBYyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFeEQsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLENBQUMsSUFBSSxjQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwRSxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixRQUFJLENBQUMsSUFBSSxDQUF5QyxRQUFRLEVBQUU7d0JBQ3hELFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRTt3QkFDMUIsZ0JBQWdCLEVBQUUsY0FBYztxQkFDbkMsRUFBRSxLQUFJLENBQUMsY0FBYyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsbUJBQWMsR0FBRyxVQUFDLEdBQXdCO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLENBQUMsSUFBSSxjQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDOUIsVUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEMsUUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUE7UUF6Q0QsQ0FBQztRQTBDTCxnQkFBQztJQUFELENBQUMsQUE3Q0QsQ0FBK0IsY0FBVSxHQTZDeEM7SUE3Q1ksYUFBUyxZQTZDckIsQ0FBQTtBQUNMLENBQUMsRUEvQ1MsR0FBRyxLQUFILEdBQUcsUUErQ1o7QUNqREQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRW5ELElBQVUsR0FBRyxDQTZEWjtBQTdERCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBc0Msb0NBQVU7UUFFNUM7WUFGSixpQkEyREM7WUF4RE8sa0JBQU0sa0JBQWtCLENBQUMsQ0FBQztZQU05QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGdJQUFnSSxDQUFDLENBQUM7Z0JBQzFLLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUMvRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVwRSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNuQixDQUFDLENBQUE7WUFFRCxnQkFBVyxHQUFHO2dCQUNWLE1BQU0sQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLFdBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsVUFBa0I7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksSUFBSSxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxJQUFJLGNBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2hFLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixDQUFDLElBQUksY0FBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsUUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO29CQUNyRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2pCLFlBQVksRUFBRSxVQUFVO29CQUN4QixTQUFTLEVBQUUsRUFBRTtvQkFDYixXQUFXLEVBQUUsRUFBRTtvQkFDZixZQUFZLEVBQUUsVUFBVTtpQkFDM0IsRUFBRSxRQUFJLENBQUMsbUJBQW1CLEVBQUUsUUFBSSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILFFBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtRQXRERCxDQUFDO1FBdURMLHVCQUFDO0lBQUQsQ0FBQyxBQTNERCxDQUFzQyxjQUFVLEdBMkQvQztJQTNEWSxvQkFBZ0IsbUJBMkQ1QixDQUFBO0FBQ0wsQ0FBQyxFQTdEUyxHQUFHLEtBQUgsR0FBRyxRQTZEWjtBQy9ERCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFFaEQsSUFBVSxHQUFHLENBNkRaO0FBN0RELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUFtQyxpQ0FBVTtRQUV6QztZQUZKLGlCQTJEQztZQXhETyxrQkFBTSxlQUFlLENBQUMsQ0FBQztZQU0zQixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFNUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyw2SEFBNkgsQ0FBQyxDQUFDO2dCQUN2SyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFOUQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDOUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO2dCQUMvRCxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxRQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFBO1lBRUQsZUFBVSxHQUFHO2dCQUNULE1BQU0sQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLFdBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsVUFBZTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxJQUFJLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUixDQUFDLElBQUksY0FBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEUsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLENBQUMsSUFBSSxjQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxRQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDakIsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLFNBQVMsRUFBRSxFQUFFO29CQUNiLFdBQVcsRUFBRSxFQUFFO29CQUNmLFlBQVksRUFBRSxVQUFVO2lCQUMzQixFQUFFLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxRQUFJLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsUUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1FBdERELENBQUM7UUF1REwsb0JBQUM7SUFBRCxDQUFDLEFBM0RELENBQW1DLGNBQVUsR0EyRDVDO0lBM0RZLGlCQUFhLGdCQTJEekIsQ0FBQTtBQUNMLENBQUMsRUE3RFMsR0FBRyxLQUFILEdBQUcsUUE2RFo7QUMvREQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBRWpELElBQVUsR0FBRyxDQWlFWjtBQWpFRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBb0Msa0NBQVU7UUFFMUMsd0JBQW9CLE1BQWU7WUFGdkMsaUJBK0RDO1lBNURPLGtCQUFNLGdCQUFnQixDQUFDLENBQUM7WUFEUixXQUFNLEdBQU4sTUFBTSxDQUFTO1lBT25DLFVBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQ3BFLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDekYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO2dCQUMvRCxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxRQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFBO1lBRUQsZUFBVSxHQUFHO2dCQUNULE1BQU0sQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLFdBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsVUFBZTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxJQUFJLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUixDQUFDLElBQUksY0FBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEUsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLENBQUMsSUFBSSxjQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUM7Z0JBQzFCLElBQUksT0FBTyxHQUFrQixVQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDekQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixNQUFNLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsQ0FBQztnQkFFRCxRQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxNQUFNO29CQUNoQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsWUFBWSxFQUFFLFVBQVU7aUJBQzNCLEVBQUUsUUFBSSxDQUFDLG1CQUFtQixFQUFFLFFBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQTtZQUVELFNBQUksR0FBRztnQkFDSCxRQUFJLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7UUExREQsQ0FBQztRQTJETCxxQkFBQztJQUFELENBQUMsQUEvREQsQ0FBb0MsY0FBVSxHQStEN0M7SUEvRFksa0JBQWMsaUJBK0QxQixDQUFBO0FBQ0wsQ0FBQyxFQWpFUyxHQUFHLEtBQUgsR0FBRyxRQWlFWjtBQ25FRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFFcEQsSUFBVSxHQUFHLENBMkVaO0FBM0VELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUF1QyxxQ0FBVTtRQUk3QywyQkFBb0IsUUFBZ0I7WUFKeEMsaUJBeUVDO1lBcEVPLGtCQUFNLG1CQUFtQixDQUFDLENBQUM7WUFEWCxhQUFRLEdBQVIsUUFBUSxDQUFRO1lBV3BDLFVBQUssR0FBRztnQkFFSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztnQkFFbkYsSUFBSSxPQUFPLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFFN0IsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUV2QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBRTdFLElBQUksb0JBQW9CLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSw0QkFBNEIsRUFDM0YsS0FBSSxDQUFDLGNBQWMsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFFN0UsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUU1RSxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3ZELENBQUMsQ0FBQTtZQUVELG1CQUFjLEdBQUc7Z0JBQ2IsS0FBSSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRXRELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxHQUFHLElBQUksS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsUUFBSSxDQUFDLElBQUksQ0FBeUQsZ0JBQWdCLEVBQUU7d0JBQ2hGLGFBQWEsRUFBRSxLQUFJLENBQUMsR0FBRzt3QkFDdkIsVUFBVSxFQUFFLEtBQUksQ0FBQyxRQUFRO3FCQUM1QixFQUFFLEtBQUksQ0FBQyxzQkFBc0IsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixDQUFDLElBQUksY0FBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELDJCQUFzQixHQUFHLFVBQUMsR0FBZ0M7Z0JBQ3RELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1QyxJQUFJLEdBQUcsR0FBRyxnQ0FBZ0MsQ0FBQztvQkFFM0MsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLEdBQUcsSUFBSSw2QkFBNkIsR0FBRyxHQUFHLENBQUMsSUFBSTs4QkFDekMsOEJBQThCLENBQUM7b0JBQ3pDLENBQUM7b0JBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO29CQUNoQixDQUFDLElBQUksY0FBVSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTt3QkFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBS2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNsRCxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFNBQUksR0FBRztnQkFDSCxLQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFBO1FBbEVELENBQUM7UUFtRUwsd0JBQUM7SUFBRCxDQUFDLEFBekVELENBQXVDLGNBQVUsR0F5RWhEO0lBekVZLHFCQUFpQixvQkF5RTdCLENBQUE7QUFDTCxDQUFDLEVBM0VTLEdBQUcsS0FBSCxHQUFHLFFBMkVaO0FDN0VELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUVuRCxJQUFVLEdBQUcsQ0FzRFo7QUF0REQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQXNDLG9DQUFVO1FBRTVDLDBCQUFvQixJQUFZO1lBRnBDLGlCQW9EQztZQWpETyxrQkFBTSxrQkFBa0IsQ0FBQyxDQUFDO1lBRFYsU0FBSSxHQUFKLElBQUksQ0FBUTtZQU9oQyxVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLHVGQUF1RixDQUFDLENBQUM7Z0JBRTVILElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztvQkFDckQsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRXhELElBQUksbUJBQW1CLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsRUFDckYsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztnQkFFNUUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3ZELENBQUMsQ0FBQTtZQUVELGtCQUFhLEdBQUc7Z0JBRVosSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFM0QsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQzNCLFFBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRTt3QkFDOUUsTUFBTSxFQUFFLFFBQVE7d0JBQ2hCLE9BQU8sRUFBRSxZQUFZO3FCQUN4QixFQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixDQUFDLElBQUksY0FBVSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckQsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELDBCQUFxQixHQUFHLFVBQUMsR0FBK0I7Z0JBQ3BELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxDQUFDLElBQUksY0FBVSxDQUFDLGtEQUFrRCxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEYsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFNBQUksR0FBRztnQkFDSCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDWixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLENBQUM7WUFDTCxDQUFDLENBQUE7UUEvQ0QsQ0FBQztRQWdETCx1QkFBQztJQUFELENBQUMsQUFwREQsQ0FBc0MsY0FBVSxHQW9EL0M7SUFwRFksb0JBQWdCLG1CQW9ENUIsQ0FBQTtBQUNMLENBQUMsRUF0RFMsR0FBRyxLQUFILEdBQUcsUUFzRFo7QUN4REQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBSXBELElBQVUsR0FBRyxDQTZJWjtBQTdJRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBdUMscUNBQVU7UUFFN0M7WUFGSixpQkEySUM7WUF4SU8sa0JBQU0sbUJBQW1CLENBQUMsQ0FBQztZQU0vQixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztnQkFFM0IsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsaUJBQWlCLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ25DLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO3dCQUNsQyxPQUFPLEVBQUUsd0JBQXdCO3FCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7Z0JBQzlCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFTcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDekIsSUFBSSxLQUFLLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7d0JBQzVCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO3dCQUMzQyxNQUFNLEVBQUUsTUFBTTt3QkFDZCxNQUFNLEVBQUUsT0FBTztxQkFDbEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBR2IsVUFBVSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUM1QixPQUFPLEVBQUUsc0JBQXNCO3FCQUNsQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsVUFBVSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUM5QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDakMsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2lCQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFHYixVQUFVLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQzlCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDNUIsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE1BQU0sRUFBRSxhQUFhO2lCQUN4QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFYixJQUFJLElBQUksR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUMzQixRQUFRLEVBQUUsTUFBTTtvQkFDaEIsU0FBUyxFQUFFLHFCQUFxQjtvQkFDaEMsV0FBVyxFQUFFLE9BQU87aUJBQ3ZCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRWYsb0JBQW9CLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUN4QyxFQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7WUFDekUsQ0FBQyxDQUFBO1lBRUQsbUJBQWMsR0FBRztnQkFDYixJQUFJLEdBQUcsR0FBWSxLQUFLLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3BFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNoQixDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQTtZQUVELGtCQUFhLEdBQUc7Z0JBRVosSUFBSSxVQUFVLEdBQUcsVUFBQyxXQUFXO29CQUV6QixDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDN0UsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO29CQU05RSxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTlFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ2QsR0FBRyxFQUFFLGFBQWEsR0FBRyxRQUFRO3dCQUM3QixJQUFJLEVBQUUsSUFBSTt3QkFDVixLQUFLLEVBQUUsS0FBSzt3QkFDWixXQUFXLEVBQUUsS0FBSzt3QkFDbEIsV0FBVyxFQUFFLEtBQUs7d0JBQ2xCLElBQUksRUFBRSxNQUFNO3FCQUNmLENBQUMsQ0FBQztvQkFFSCxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUNOLFVBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDckIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDTixDQUFDLElBQUksY0FBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDO2dCQUVGLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLENBQUMsSUFBSSxjQUFVLENBQUMsZUFBZSxFQUMzQiw2REFBNkQsRUFDN0QsbUJBQW1CLEVBRW5CO3dCQUNJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckIsQ0FBQyxFQUVEO3dCQUNJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQztvQkFDRixVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQU0sQ0FBQyxVQUFVLENBQUMsY0FBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEcsQ0FBQyxDQUFBO1FBdElELENBQUM7UUF1SUwsd0JBQUM7SUFBRCxDQUFDLEFBM0lELENBQXVDLGNBQVUsR0EySWhEO0lBM0lZLHFCQUFpQixvQkEySTdCLENBQUE7QUFDTCxDQUFDLEVBN0lTLEdBQUcsS0FBSCxHQUFHLFFBNklaO0FDakpELE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztBQUk1RCxJQUFVLEdBQUcsQ0FrS1o7QUFsS0QsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQStDLDZDQUFVO1FBRXJEO1lBRkosaUJBZ0tDO1lBN0pPLGtCQUFNLDJCQUEyQixDQUFDLENBQUM7WUFHdkMsYUFBUSxHQUFhLElBQUksQ0FBQztZQUMxQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7WUFDckMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFFN0IsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Z0JBRTNCLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFpQixJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNuQyxJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzt3QkFDbEMsT0FBTyxFQUFFLHdCQUF3QjtxQkFDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUVELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxhQUFhLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQUksb0JBQW9CLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3pDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVQLElBQUksSUFBSSxHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUMxQixRQUFRLEVBQUUsYUFBYSxHQUFHLFFBQVE7b0JBQ2xDLGtCQUFrQixFQUFFLEtBQUs7b0JBRXpCLE9BQU8sRUFBRSxVQUFVO29CQUNuQixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFUCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDckYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1lBQ2hGLENBQUMsQ0FBQTtZQUVELHNCQUFpQixHQUFHO2dCQUVoQixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLElBQUksTUFBTSxHQUFXO29CQUNqQixHQUFHLEVBQUUsYUFBYSxHQUFHLFFBQVE7b0JBRTdCLGdCQUFnQixFQUFFLEtBQUs7b0JBQ3ZCLFNBQVMsRUFBRSxPQUFPO29CQUNsQixXQUFXLEVBQUUsQ0FBQztvQkFDZCxlQUFlLEVBQUUsRUFBRTtvQkFJbkIsY0FBYyxFQUFFLEtBQUs7b0JBQ3JCLGNBQWMsRUFBRSxJQUFJO29CQUNwQixrQkFBa0IsRUFBRSxrQ0FBa0M7b0JBQ3RELG9CQUFvQixFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQVczRCxJQUFJLEVBQUU7d0JBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO3dCQUNwQixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO3dCQUNoRCxDQUFDO3dCQUVELFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDOzRCQUU3QyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQzVCLENBQUMsQ0FBQyxDQUFDO3dCQUVILElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFOzRCQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ25DLENBQUMsQ0FBQyxDQUFDO3dCQUVILElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFOzRCQUNuQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ25DLENBQUMsQ0FBQyxDQUFDO3dCQUVILElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFROzRCQUMzQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxjQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNwRCxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQzs0QkFDcEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQzt3QkFDckMsQ0FBQyxDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBUyxJQUFJOzRCQUNsQyxVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUM7aUJBQ0osQ0FBQztnQkFFRixDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHLFVBQUMsV0FBZ0I7Z0JBQzlCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzVDLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBS25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLG1CQUFtQixJQUFJLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7b0JBQ2hDLENBQUMsSUFBSSxjQUFVLENBQUMsZUFBZSxFQUMzQiw2REFBNkQsRUFDN0QsbUJBQW1CLEVBRW5CO3dCQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUM1QixDQUFDLEVBRUQ7d0JBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7b0JBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxtQkFBYyxHQUFHO2dCQUNiLElBQUksR0FBRyxHQUFZLEtBQUssQ0FBQztnQkFDekIsR0FBRyxDQUFDLENBQWEsVUFBYSxFQUFiLEtBQUEsS0FBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYSxDQUFDO29CQUExQixJQUFJLElBQUksU0FBQTtvQkFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDaEIsQ0FBQztpQkFDSjtnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1lBRUQsd0JBQW1CLEdBQUcsVUFBQyxXQUFnQjtnQkFDbkMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDO29CQUN0QyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QyxDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUVILENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFNLENBQUMsVUFBVSxDQUFDLGNBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUVoRyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7UUEzSkQsQ0FBQztRQTRKTCxnQ0FBQztJQUFELENBQUMsQUFoS0QsQ0FBK0MsY0FBVSxHQWdLeEQ7SUFoS1ksNkJBQXlCLDRCQWdLckMsQ0FBQTtBQUNMLENBQUMsRUFsS1MsR0FBRyxLQUFILEdBQUcsUUFrS1o7QUN0S0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRW5ELElBQVUsR0FBRyxDQThEWjtBQTlERCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBc0Msb0NBQVU7UUFFNUM7WUFGSixpQkE0REM7WUF6RE8sa0JBQU0sa0JBQWtCLENBQUMsQ0FBQztZQU05QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztnQkFFM0IsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsaUJBQWlCLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ25DLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO3dCQUNsQyxPQUFPLEVBQUUsd0JBQXdCO3FCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7Z0JBQzlCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2dCQUUxQixJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQ2hGLGdCQUFnQixHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQ3BDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFFdkIsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQzVGLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBRXBFLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsb0JBQW9CLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1lBQzVGLENBQUMsQ0FBQTtZQUVELGtCQUFhLEdBQUc7Z0JBQ1osSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFHbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDWixRQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7d0JBQzlFLFFBQVEsRUFBRSxjQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQ2xDLFdBQVcsRUFBRSxTQUFTO3FCQUN6QixFQUFFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELDBCQUFxQixHQUFHLFVBQUMsR0FBK0I7Z0JBQ3BELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUcvQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDLENBQUE7UUF2REQsQ0FBQztRQXdETCx1QkFBQztJQUFELENBQUMsQUE1REQsQ0FBc0MsY0FBVSxHQTREL0M7SUE1RFksb0JBQWdCLG1CQTRENUIsQ0FBQTtBQUNMLENBQUMsRUE5RFMsR0FBRyxLQUFILEdBQUcsUUE4RFo7QUNoRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBUTlDLElBQVUsR0FBRyxDQWl0Qlo7QUFqdEJELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUFpQywrQkFBVTtRQU92QyxxQkFBb0IsUUFBaUIsRUFBVSxXQUFvQjtZQVB2RSxpQkErc0JDO1lBdnNCTyxrQkFBTSxhQUFhLENBQUMsQ0FBQztZQURMLGFBQVEsR0FBUixRQUFRLENBQVM7WUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBUztZQUpuRSxxQkFBZ0IsR0FBUSxFQUFFLENBQUM7WUFDM0IsZ0JBQVcsR0FBcUIsSUFBSSxLQUFLLEVBQWEsQ0FBQztZQWlCdkQsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRTFDLElBQUksY0FBYyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEtBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3pGLElBQUksaUJBQWlCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDckcsSUFBSSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFDM0UsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxLQUFJLENBQUMsWUFBWSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNqRyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDM0csSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUVoRyxJQUFJLFNBQVMsR0FBRyxVQUFNLENBQUMsaUJBQWlCLENBQUMsY0FBYyxHQUFHLGlCQUFpQixHQUFHLHFCQUFxQixHQUFHLGdCQUFnQjtzQkFDaEgsa0JBQWtCLEdBQUcsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBR3hELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDaEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUVqQixJQUFJLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFFN0IsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsbUJBQW1CLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3JDLEVBQUUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO3dCQUNsQyxPQUFPLEVBQUUsd0JBQXdCO3FCQUNwQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFFRCxtQkFBbUIsSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckMsRUFBRSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ3RDLENBQUMsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDbkIsRUFBRSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUM7b0JBRXpDLEtBQUssRUFBRSwrQkFBK0IsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyw2REFBNkQ7b0JBQ3RJLEtBQUssRUFBRSxxQkFBcUI7aUJBRS9CLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO1lBQ3BELENBQUMsQ0FBQTtZQU1ELHVCQUFrQixHQUFHO2dCQUVqQixRQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7Z0JBRTdELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUdoQixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2dCQUMzQixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7Z0JBRzFDLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBR3RDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztvQkFDaEIsSUFBSSxnQkFBZ0IsR0FBRyxTQUFLLENBQUMsMkJBQTJCLENBQUMsUUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNsRyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBTW5CLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxLQUFLLEVBQUUsSUFBSTt3QkFLekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzdDLE1BQU0sQ0FBQzt3QkFDWCxDQUFDO3dCQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUM7d0JBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFFN0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3BELElBQUksY0FBYyxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFELElBQUksWUFBWSxHQUFHLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXRELElBQUksU0FBUyxHQUFjLElBQUksYUFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBRXJHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUVqQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBS25CLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQzt3QkFFdEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFDVixLQUFLLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNqRCxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLEtBQUssSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUM3RCxDQUFDO3dCQUVELE1BQU0sSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTs0QkFDeEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxzQkFBc0I7a0NBQzlGLDRCQUE0QixDQUFDO3lCQUV0QyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsSUFBSSxDQUFDLENBQUM7b0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUVqQyxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDdEIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFFMUMsTUFBTSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFOzRCQUN4QixJQUFJLEVBQUUsVUFBVTs0QkFDaEIsT0FBTyxFQUFFLGdCQUFnQjs0QkFDekIsTUFBTSxFQUFFLE1BQU07eUJBQ2pCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUViLFNBQVMsQ0FBQyxJQUFJLENBQUM7NEJBQ1gsRUFBRSxFQUFFLFVBQVU7NEJBQ2QsR0FBRyxFQUFFLEVBQUU7eUJBQ1YsQ0FBQyxDQUFDO29CQUNQLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxLQUFLLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDckMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDOzRCQUM5QixPQUFPLEVBQUUsZUFBZTt5QkFDM0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBR2IsTUFBTSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNuRSxDQUFDO2dCQUNMLENBQUM7Z0JBYUQsSUFBSSxTQUFTLEdBQVcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQ3BDO29CQUNJLFNBQVMsRUFBRSxPQUFPO2lCQUNyQixFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUdmLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUUvRCxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3hDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQzt3QkFDakQsVUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUNwRCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxLQUFLLEdBQUcsUUFBSSxDQUFDLGtCQUFrQjtvQkFDL0IsdUpBQXVKOzt3QkFFdkosRUFBRSxDQUFDO2dCQUVQLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQU9yRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxRQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFFakYsSUFBSSxjQUFjLEdBQUcsU0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxRQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO2dCQUU3RSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNoRixDQUFDLENBQUE7WUFFRCx1QkFBa0IsR0FBRztZQUtyQixDQUFDLENBQUE7WUFFRCxnQkFBVyxHQUFHO2dCQUNWLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFlLENBQUMsS0FBSSxDQUFDLENBQUM7Z0JBQ3JELEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQyxDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLFNBQUssQ0FBQyxrQkFBa0IsQ0FBQyxRQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxRQUFRLEdBQUc7b0JBQ1gsTUFBTSxFQUFFLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDeEIsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLGFBQWEsRUFBRSxFQUFFO2lCQUNwQixDQUFDO2dCQUNGLFFBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ2pJLENBQUMsQ0FBQTtZQUVELDRCQUF1QixHQUFHLFVBQUMsR0FBOEI7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxLQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCx5QkFBb0IsR0FBRyxVQUFDLEdBQVE7Z0JBQzVCLFFBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTFDLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2pELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUt4QixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM5QixDQUFDLENBQUE7WUFPRCw4QkFBeUIsR0FBRyxVQUFDLElBQVMsRUFBRSxPQUFlO2dCQUNuRCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0JBRW5CLElBQUksV0FBVyxHQUFHLFFBQUksQ0FBQywyQkFBMkIsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDNUUsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSw2QkFBNkIsR0FBRyxLQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFtQixHQUFHLE9BQU8sR0FBRyxLQUFLO2lCQUMvRixFQUNHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFFbEIsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBRXRCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFLcEUsWUFBWSxHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO3dCQUN0QyxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLDZCQUE2QixHQUFHLEtBQUksQ0FBQyxJQUFJLEdBQUcsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLO3FCQUNsRyxFQUNHLEtBQUssQ0FBQyxDQUFDO2dCQWNmLENBQUM7Z0JBRUQsSUFBSSxVQUFVLEdBQUcsY0FBYyxHQUFHLFdBQVcsR0FBRyxZQUFZLENBQUM7Z0JBQzdELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsU0FBUyxHQUFHLFVBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFDdEYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixDQUFDO2dCQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFBO1lBRUQsbUJBQWMsR0FBRyxVQUFDLE9BQWU7Z0JBQzdCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBRW5ELElBQUksT0FBTyxHQUFHLFFBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUd6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLENBQUM7Z0JBUUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQTtZQUtELG1CQUFjLEdBQUcsVUFBQyxRQUFnQjtnQkFDOUIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixDQUFDLElBQUksY0FBVSxDQUFDLGdCQUFnQixFQUFFLHVCQUF1QixHQUFHLFFBQVEsRUFBRSxjQUFjLEVBQUU7b0JBQ2xGLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQTtZQUVELDRCQUF1QixHQUFHLFVBQUMsUUFBZ0I7Z0JBRXZDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsUUFBSSxDQUFDLElBQUksQ0FBMEQsZ0JBQWdCLEVBQUU7b0JBQ2pGLFFBQVEsRUFBRSxRQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzFCLFVBQVUsRUFBRSxRQUFRO2lCQUN2QixFQUFFLFVBQVMsR0FBZ0M7b0JBQ3hDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFBO1lBR0QsMkJBQXNCLEdBQUcsVUFBQyxHQUFRLEVBQUUsZ0JBQXFCO2dCQUVyRCxFQUFFLENBQUMsQ0FBQyxRQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFNNUMsU0FBSyxDQUFDLDJCQUEyQixDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBR3BELFVBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUV4QixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELGtCQUFhLEdBQUcsVUFBQyxPQUFlO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUN2QixRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxNQUFNLEdBQUcsVUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztnQkFDTCxDQUFDO2dCQUdELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUM7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNqRSxLQUFLLENBQUM7d0JBQ1YsQ0FBQztvQkFDTCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksTUFBTSxHQUFHLFVBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixLQUFLLENBQUM7d0JBQ1YsQ0FBQztvQkFDTCxDQUFDO29CQUNELE9BQU8sRUFBRSxDQUFDO2dCQUNkLENBQUM7WUFDTCxDQUFDLENBQUE7WUFNRCxhQUFRLEdBQUc7Z0JBS1AsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFHNUIsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUN2QixDQUFDO2dCQUlELElBQUksQ0FBQyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDakMsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzVCLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxnQkFBVyxHQUFHLFVBQUMsV0FBb0I7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDZixXQUFXLEdBQUcsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELENBQUM7Z0JBTUQsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFFBQVEsSUFBSSxRQUFJLENBQUMsZUFBZSxDQUFDLFNBQVM7b0JBQ2pELFFBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVDLFFBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUM7Z0JBQzVDLENBQUM7Z0JBRUQsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLFFBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTt3QkFDckUsVUFBVSxFQUFFLFFBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTt3QkFDbkMsWUFBWSxFQUFFLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJO3dCQUN4QyxhQUFhLEVBQUUsV0FBVzt3QkFDMUIsVUFBVSxFQUFFLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsR0FBRyxpQkFBaUI7cUJBQ2hFLEVBQUUsUUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQUksQ0FBQyxDQUFDO2dCQUN0QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLFFBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRTt3QkFDOUUsUUFBUSxFQUFFLFFBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTt3QkFDakMsYUFBYSxFQUFFLFdBQVc7d0JBQzFCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQWlCO3dCQUM3RCxhQUFhLEVBQUcsS0FBSSxDQUFDLFdBQVc7cUJBQ25DLEVBQUUsUUFBSSxDQUFDLHFCQUFxQixFQUFFLFFBQUksQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQscUJBQWdCLEdBQUc7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUdoQyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFFaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQVMsS0FBYSxFQUFFLElBQVM7b0JBRXRELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLENBQUM7b0JBRzFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQzt3QkFDN0IsTUFBTSxDQUFDO29CQUVYLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBRXhFLElBQUksT0FBTyxDQUFDO3dCQUVaLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixJQUFJLE1BQU0sR0FBRyxVQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0NBQ1IsTUFBTSxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDOzRCQUN6RCxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUNoQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sR0FBRyxRQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQyxDQUFDO3dCQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUM7NEJBQ3BGLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0NBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7Z0NBQzFCLE9BQU8sRUFBRSxPQUFPOzZCQUNuQixDQUFDLENBQUM7d0JBQ1AsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbEQsQ0FBQztvQkFDTCxDQUFDO29CQUVELElBQUksQ0FBQyxDQUFDO3dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUVwRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7d0JBRWxCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPOzRCQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFFbEUsSUFBSSxPQUFPLENBQUM7NEJBQ1osRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3RCLElBQUksTUFBTSxHQUFHLFVBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQ0FDUixNQUFNLDRDQUE0QyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0NBQ3BFLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBRWhDLENBQUM7NEJBQUMsSUFBSSxDQUFDLENBQUM7Z0NBQ0osT0FBTyxHQUFHLFFBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ2xELENBQUM7NEJBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQzs0QkFDOUUsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDM0IsQ0FBQyxDQUFDLENBQUM7d0JBRUgsY0FBYyxDQUFDLElBQUksQ0FBQzs0QkFDaEIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJOzRCQUNqQixRQUFRLEVBQUUsUUFBUTt5QkFDckIsQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBRUwsQ0FBQyxDQUFDLENBQUM7Z0JBR0gsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLFFBQVEsR0FBRzt3QkFDWCxNQUFNLEVBQUUsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUN4QixVQUFVLEVBQUUsY0FBYzt3QkFDMUIsZ0JBQWdCLEVBQUUsUUFBSSxDQUFDLDJCQUEyQjtxQkFDckQsQ0FBQztvQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLFFBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDckUsUUFBSSxDQUFDLElBQUksQ0FBOEMsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFO3dCQUN0RyxPQUFPLEVBQUUsUUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3FCQUM1QixDQUFDLENBQUM7b0JBQ0gsUUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztnQkFDN0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCx3QkFBbUIsR0FBRyxVQUFDLFNBQW9CO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVM7c0JBQzdGLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRWhCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUV4QixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFaEQsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLFVBQVUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO29CQUMvQixVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUN2QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFFL0MsSUFBSSxPQUFPLEdBQVksSUFBSSxXQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNoRCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDekMsTUFBTSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7NEJBQ25DLElBQUksRUFBRSxFQUFFOzRCQUNSLFVBQVUsRUFBRSxVQUFVOzRCQUN0QixVQUFVLEVBQUUsVUFBVTs0QkFDdEIsT0FBTyxFQUFFLEtBQUs7NEJBQ2QsT0FBTyxFQUFFLFVBQVU7eUJBQ3RCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNqQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFOzRCQUNuQyxJQUFJLEVBQUUsRUFBRTs0QkFDUixPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsVUFBVTt5QkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDeEIsT0FBTyxFQUFFLHNCQUFzQjtpQkFDbEMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFWCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1lBRUQseUJBQW9CLEdBQUcsVUFBQyxTQUFvQixFQUFFLFNBQWM7Z0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFaEUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUVmLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUN2RSxJQUFJLEtBQUssR0FBRyxVQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakUsSUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ3hDLFVBQVUsR0FBRyxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSztzQkFDeEcsWUFBWSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFbkMsSUFBSSxlQUFlLEdBQVcsRUFBRSxDQUFDO2dCQUVqQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxLQUFLLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO3dCQUNsQixVQUFVLEVBQUUsVUFBVTt3QkFDdEIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRSxVQUFVO3FCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixlQUFlLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLFdBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUM3QyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztvQkFDMUMsQ0FBQztvQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixLQUFLLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDbEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFOzRCQUNsQixPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsVUFBVTt5QkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFOzRCQUN2QixJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUU7NEJBQ2xCLE9BQU8sRUFBRSxnQkFBZ0I7NEJBQ3pCLE1BQU0sRUFBRSxNQUFNO3lCQUNqQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFYixTQUFTLENBQUMsSUFBSSxDQUFDOzRCQUNYLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRTs0QkFDaEIsR0FBRyxFQUFFLFVBQVU7eUJBQ2xCLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxNQUFNLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQzNCLE9BQU8sRUFBRSxrREFBa0Q7aUJBQzlELEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRXBCLElBQUksT0FBTyxHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLEVBQUUsa0RBQWtEO2lCQUM5RCxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVWLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQzVCLENBQUMsQ0FBQTtZQUVELDhCQUF5QixHQUFHO2dCQUd4QixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFHM0MsSUFBSSxTQUFTLEdBQWMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNyRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUVaLElBQUksWUFBWSxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDOzRCQU03QyxJQUFJLFdBQVcsR0FBRyxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDdEQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQ0FDZCxJQUFJLE9BQU8sR0FBWSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQ0FDaEQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQ0FFVixLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBSTdDLE1BQU0sQ0FBQztnQ0FDWCxDQUFDOzRCQUNMLENBQUM7d0JBQ0wsQ0FBQzt3QkFDRCxJQUFJLENBQUMsQ0FBQzs0QkFDRixNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQzt3QkFDOUMsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQ3BDLENBQUMsQ0FBQTtZQUVELGlCQUFZLEdBQUc7Z0JBQ1gsSUFBSSxTQUFTLEdBQWtCLFFBQUksQ0FBQyxZQUFZLENBQUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxRQUFJLENBQUMsSUFBSSxDQUFnRCxXQUFXLEVBQUU7b0JBQ2xFLFFBQVEsRUFBRSxRQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzFCLGFBQWEsRUFBRSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUM7b0JBQ3hELFdBQVcsRUFBRSxJQUFJO2lCQUNwQixFQUFFLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQTtZQUVELHlCQUFvQixHQUFHLFVBQUMsR0FBMkI7Z0JBQy9DLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM5QixVQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoQyxRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELGVBQVUsR0FBRztnQkFDVCxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLFVBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osVUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEMsUUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoQyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BELENBQUM7WUFDTCxDQUFDLENBQUE7WUFoc0JHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEtBQUssRUFBYSxDQUFDO1FBQzlDLENBQUM7UUErckJMLGtCQUFDO0lBQUQsQ0FBQyxBQS9zQkQsQ0FBaUMsY0FBVSxHQStzQjFDO0lBL3NCWSxlQUFXLGNBK3NCdkIsQ0FBQTtBQUNMLENBQUMsRUFqdEJTLEdBQUcsS0FBSCxHQUFHLFFBaXRCWjtBQ3p0QkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBS2xELElBQVUsR0FBRyxDQTJGWjtBQTNGRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBcUMsbUNBQVU7UUFFM0MseUJBQW9CLFdBQWdCO1lBRnhDLGlCQXlGQztZQXRGTyxrQkFBTSxpQkFBaUIsQ0FBQyxDQUFDO1lBRFQsZ0JBQVcsR0FBWCxXQUFXLENBQUs7WUFPcEMsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFbkQsSUFBSSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxLQUFJLENBQUMsWUFBWSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNyRyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLDJCQUEyQixDQUFDLENBQUM7Z0JBRW5GLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUVoRixJQUFJLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFFN0IsRUFBRSxDQUFDLENBQUMsUUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsbUJBQW1CLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUM7MEJBQ2pFLHlDQUF5QyxDQUFDO2dCQUNwRCxDQUFDO2dCQUVELG1CQUFtQixJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUV2RixNQUFNLENBQUMsTUFBTSxHQUFHLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztZQUNwRCxDQUFDLENBQUE7WUFFRCx5QkFBb0IsR0FBRztnQkFDbkIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUdmLENBQUM7b0JBQ0csSUFBSSxlQUFlLEdBQUcsNEJBQTRCLENBQUM7b0JBRW5ELEtBQUssSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO3dCQUNsQyxNQUFNLEVBQUUsZUFBZTt3QkFDdkIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDO3dCQUM5QixhQUFhLEVBQUUscUJBQXFCO3dCQUNwQyxPQUFPLEVBQUUsTUFBTTtxQkFDbEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7Z0JBR0QsQ0FBQztvQkFDRyxJQUFJLGdCQUFnQixHQUFHLDZCQUE2QixDQUFDO29CQUVyRCxLQUFLLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7d0JBQy9CLGFBQWEsRUFBRSxxQkFBcUI7d0JBQ3BDLE9BQU8sRUFBRSxPQUFPO3FCQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFHRCxRQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7Z0JBRWpFLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQTtZQUVELGlCQUFZLEdBQUc7Z0JBQ1gsSUFBSSxnQkFBZ0IsR0FBRyxRQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLGlCQUFpQixHQUFHLFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7Z0JBRWpGLElBQUksUUFBUSxHQUFHO29CQUNYLE1BQU0sRUFBRSxRQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLFlBQVksRUFBRSxnQkFBZ0I7b0JBQzlCLGFBQWEsRUFBRSxpQkFBaUI7aUJBQ25DLENBQUM7Z0JBQ0YsUUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUgsQ0FBQyxDQUFBO1lBRUQseUJBQW9CLEdBQUcsVUFBQyxHQUE4QjtnQkFDbEQsUUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFFMUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDakQsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBS3hCLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQyxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFBO1FBcEZELENBQUM7UUFxRkwsc0JBQUM7SUFBRCxDQUFDLEFBekZELENBQXFDLGNBQVUsR0F5RjlDO0lBekZZLG1CQUFlLGtCQXlGM0IsQ0FBQTtBQUNMLENBQUMsRUEzRlMsR0FBRyxLQUFILEdBQUcsUUEyRlo7QUNoR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRW5ELElBQVUsR0FBRyxDQWlEWjtBQWpERCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBc0Msb0NBQVU7UUFFNUM7WUFGSixpQkErQ0M7WUE1Q08sa0JBQU0sa0JBQWtCLENBQUMsQ0FBQztZQU05QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQy9FLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxpQkFBaUIsRUFDN0YsS0FBSSxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsK0JBQStCLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFbkUsTUFBTSxDQUFDLE1BQU0sR0FBRywyRUFBMkUsR0FBRyxZQUFZO3NCQUNwRyxTQUFTLENBQUM7WUFDcEIsQ0FBQyxDQUFBO1lBRUQsc0JBQWlCLEdBQUc7Z0JBQ2hCLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNkLENBQUMsSUFBSSxjQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNuRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFLRCxVQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDeEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixRQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7b0JBQzNFLFFBQVEsRUFBRSxTQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzlCLFdBQVcsRUFBRSxVQUFVO29CQUN2QixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztvQkFDcEUsY0FBYyxFQUFHLEtBQUs7aUJBQ3pCLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELDhCQUF5QixHQUFHLFVBQUMsR0FBOEI7Z0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxDQUFDLElBQUksY0FBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUMsQ0FBQTtRQTFDRCxDQUFDO1FBMkNMLHVCQUFDO0lBQUQsQ0FBQyxBQS9DRCxDQUFzQyxjQUFVLEdBK0MvQztJQS9DWSxvQkFBZ0IsbUJBK0M1QixDQUFBO0FBQ0wsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWjtBQ25ERCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFFN0MsSUFBVSxHQUFHLENBdUxaO0FBdkxELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUFnQyw4QkFBVTtRQUV0QztZQUZKLGlCQXFMQztZQWxMTyxrQkFBTSxZQUFZLENBQUMsQ0FBQztZQU14QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFN0MsSUFBSSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLDJCQUEyQixFQUN4RixLQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSx5QkFBeUIsRUFBRSxLQUFJLENBQUMsaUJBQWlCLEVBQ3ZHLEtBQUksQ0FBQyxDQUFDO2dCQUNWLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBRXJFLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsR0FBRyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFaEcsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7Z0JBQ3BDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUV0QyxJQUFJLG1CQUFtQixHQUFHLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsVUFBVTtvQkFDaEYsaURBQWlELEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxNQUFNLEdBQUcsdURBQXVEO3NCQUN6SSxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUV4RCxNQUFNLENBQUMsTUFBTSxHQUFHLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztZQUNwRCxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQTtZQUtELFdBQU0sR0FBRztnQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBRTFDLFFBQUksQ0FBQyxJQUFJLENBQWdFLG1CQUFtQixFQUFFO29CQUMxRixRQUFRLEVBQUUsU0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUM5QixZQUFZLEVBQUUsSUFBSTtvQkFDbEIsZUFBZSxFQUFFLElBQUk7aUJBQ3hCLEVBQUUsS0FBSSxDQUFDLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQVNELDhCQUF5QixHQUFHLFVBQUMsR0FBbUM7Z0JBQzVELEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFLRCxzQkFBaUIsR0FBRyxVQUFDLEdBQW1DO2dCQUNwRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUVoQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsUUFBUTtvQkFDM0MsSUFBSSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztvQkFDeEQsSUFBSSxJQUFJLFVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN0QixPQUFPLEVBQUUsZ0JBQWdCO3FCQUM1QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksaUJBQWlCLEdBQUc7b0JBQ3BCLFNBQVMsRUFBRSw2QkFBNkIsR0FBRyxLQUFJLENBQUMsSUFBSSxHQUFHLDhCQUE4QjtvQkFDckYsTUFBTSxFQUFFLHVCQUF1QjtvQkFDL0IsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7aUJBQ3pDLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ25CLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDN0MsQ0FBQztnQkFHRCxJQUFJLElBQUksVUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRW5FLElBQUksSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtvQkFDeEIsS0FBSyxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7aUJBQzFDLEVBQUUsMENBQTBDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXJELFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQTtZQUVELDRCQUF1QixHQUFHO2dCQU90QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLFVBQVUsQ0FBQztvQkFDUCxJQUFJLE9BQU8sR0FBRyxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO29CQUU3RCxVQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFFeEIsUUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO3dCQUMzRSxRQUFRLEVBQUUsU0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO3dCQUM5QixZQUFZLEVBQUcsSUFBSTt3QkFDbkIsV0FBVyxFQUFHLElBQUk7d0JBQ2xCLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7cUJBQ3hELENBQUMsQ0FBQztnQkFFUCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHLFVBQUMsU0FBaUIsRUFBRSxTQUFpQjtnQkFJbkQsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBRXhCLFFBQUksQ0FBQyxJQUFJLENBQTRELGlCQUFpQixFQUFFO29CQUNwRixRQUFRLEVBQUUsU0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUM5QixXQUFXLEVBQUUsU0FBUztvQkFDdEIsV0FBVyxFQUFFLFNBQVM7aUJBQ3pCLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQTtZQUVELDRCQUF1QixHQUFHLFVBQUMsR0FBaUM7Z0JBRXhELFFBQUksQ0FBQyxJQUFJLENBQWdFLG1CQUFtQixFQUFFO29CQUMxRixRQUFRLEVBQUUsU0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO29CQUNoQyxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsZUFBZSxFQUFFLElBQUk7aUJBQ3hCLEVBQUUsS0FBSSxDQUFDLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELHdCQUFtQixHQUFHLFVBQUMsU0FBYyxFQUFFLFFBQWE7Z0JBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxTQUFTO29CQUVqRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFDM0QsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhOzBCQUM5RyxLQUFLLENBQUMsQ0FBQztvQkFFYixJQUFJLEdBQUcsR0FBRyxVQUFNLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRXRELEdBQUcsSUFBSSxLQUFLLEdBQUcsU0FBUyxHQUFHLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7b0JBRXJHLEdBQUcsSUFBSSxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDckIsT0FBTyxFQUFFLGlCQUFpQjtxQkFDN0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1lBRUQsd0JBQW1CLEdBQUc7Z0JBQ2xCLENBQUMsSUFBSSxvQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQyxDQUFBO1lBRUQsc0JBQWlCLEdBQUc7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFLdkMsVUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBT3hCLFFBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRTtvQkFDM0UsUUFBUSxFQUFFLFNBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDOUIsV0FBVyxFQUFFLFVBQVU7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDdEIsY0FBYyxFQUFFLEtBQUs7aUJBQ3hCLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUE7UUFoTEQsQ0FBQztRQWlMTCxpQkFBQztJQUFELENBQUMsQUFyTEQsQ0FBZ0MsY0FBVSxHQXFMekM7SUFyTFksY0FBVSxhQXFMdEIsQ0FBQTtBQUNMLENBQUMsRUF2TFMsR0FBRyxLQUFILEdBQUcsUUF1TFo7QUN6TEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBRWhELElBQVUsR0FBRyxDQXdFWjtBQXhFRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBbUMsaUNBQVU7UUFDekM7WUFESixpQkFzRUM7WUFwRU8sa0JBQU0sZUFBZSxDQUFDLENBQUM7WUFNM0IsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTVDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQ2hGLElBQUksa0JBQWtCLEdBQUcsK0JBQStCLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFFckcsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUU3RixJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ2pHLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3pFLElBQUksU0FBUyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFeEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxrQkFBa0IsR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3ZGLENBQUMsQ0FBQTtZQUVELGVBQVUsR0FBRztnQkFDVCxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBRXZELEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixDQUFDLElBQUksY0FBVSxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDekQsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxhQUFhLEdBQUcsVUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDakIsQ0FBQyxJQUFJLGNBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BELE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksU0FBUyxHQUFHLFFBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRWpELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLFVBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFbkUsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixRQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRTtvQkFDMUIsU0FBUyxFQUFFLE9BQU87aUJBQ3JCLEVBQUUsVUFBUyxHQUE0QjtvQkFDcEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQTtZQUVELHVCQUFrQixHQUFHLFVBQUMsR0FBNEIsRUFBRSxnQkFBeUI7Z0JBQ3pFLEVBQUUsQ0FBQyxDQUFDLFFBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsQ0FBQztnQkFFTCxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILElBQUksYUFBYSxHQUFHLFVBQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUNELENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNFLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFBO1FBbEVELENBQUM7UUFtRUwsb0JBQUM7SUFBRCxDQUFDLEFBdEVELENBQW1DLGNBQVUsR0FzRTVDO0lBdEVZLGlCQUFhLGdCQXNFekIsQ0FBQTtBQUNMLENBQUMsRUF4RVMsR0FBRyxLQUFILEdBQUcsUUF3RVo7QUMxRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBR2pELElBQVUsR0FBRyxDQStIWjtBQS9IRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBb0Msa0NBQVU7UUFFMUMsd0JBQW9CLFNBQWlCLEVBQVUsT0FBZSxFQUFVLGdCQUF3QjtZQUZwRyxpQkE2SEM7WUExSE8sa0JBQU0sZ0JBQWdCLENBQUMsQ0FBQztZQURSLGNBQVMsR0FBVCxTQUFTLENBQVE7WUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1lBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1lBb0JoRyxVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFN0MsSUFBSSxJQUFJLEdBQWtCLFVBQU0sQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsTUFBTSxvQkFBb0IsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxDQUFDO2dCQUVELElBQUksUUFBUSxHQUFzQixTQUFLLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUdyRixJQUFJLFdBQVcsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNqQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFLbkIsSUFBSSxhQUFhLEdBQVE7b0JBQ3JCLEtBQUssRUFBRSxLQUFJLENBQUMsU0FBUztvQkFDckIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUM1QixPQUFPLEVBQUUsaUZBQWlGO29CQUMxRixjQUFjLEVBQUUsNEJBQTRCLEdBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxXQUFXO29CQUN6RSxXQUFXLEVBQUUseUJBQXlCLEdBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxXQUFXO29CQUNuRSxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsU0FBUyxFQUFHLE1BQU07aUJBQ3JCLENBQUM7Z0JBRUYsSUFBSSxNQUFNLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBR2hELElBQUksZ0JBQWdCLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQzlDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUseUJBQXlCLEdBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxXQUFXO29CQUNqRSxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUNHLE9BQU8sQ0FBQyxDQUFDO2dCQUViLElBQUksbUJBQW1CLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQ2pELFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsd0JBQXdCLEdBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxXQUFXO29CQUNoRSxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUNHLE9BQU8sQ0FBQyxDQUFDO2dCQUViLElBQUksYUFBYSxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUdyRixJQUFJLGlCQUFpQixHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUMvQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHlCQUF5QjtvQkFDcEMsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxRQUFRLENBQUMsQ0FBQztnQkFFZCxJQUFJLGFBQWEsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDM0MsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSx5QkFBeUI7b0JBQ3BDLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQ0csTUFBTSxDQUFDLENBQUM7Z0JBRVosSUFBSSxhQUFhLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQzNDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsdUJBQXVCO29CQUNsQyxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUNHLElBQUksQ0FBQyxDQUFDO2dCQUVWLElBQUksY0FBYyxHQUFHLFVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUM7Z0JBR2pHLElBQUksV0FBVyxHQUFHLFVBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUN6QyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHNCQUFzQjtvQkFDakMsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztnQkFFYixJQUFJLFVBQVUsR0FBRyxVQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDeEMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSxxQkFBcUI7b0JBQ2hDLE9BQU8sRUFBRSxZQUFZO2lCQUN4QixFQUNHLE1BQU0sQ0FBQyxDQUFDO2dCQUdaLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdkYsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBRWpGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sR0FBRyxhQUFhLEdBQUcsY0FBYyxHQUFHLFNBQVMsQ0FBQztZQUN0RixDQUFDLENBQUE7WUFFRCxlQUFVLEdBQUc7Z0JBQ1QsV0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFFRCxhQUFRLEdBQUc7Z0JBQ1AsV0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7WUFDUCxDQUFDLENBQUE7WUF4SEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BFLFdBQU8sQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUNoRCxDQUFDO1FBR00sK0JBQU0sR0FBYjtZQUNJLGdCQUFLLENBQUMsTUFBTSxXQUFFLENBQUM7WUFDZixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU5QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixDQUFDO1FBQ0wsQ0FBQztRQTRHTCxxQkFBQztJQUFELENBQUMsQUE3SEQsQ0FBb0MsY0FBVSxHQTZIN0M7SUE3SFksa0JBQWMsaUJBNkgxQixDQUFBO0FBQ0wsQ0FBQyxFQS9IUyxHQUFHLEtBQUgsR0FBRyxRQStIWjtBQ2xJRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFFaEQsSUFBVSxHQUFHLENBdUZaO0FBdkZELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUFtQyxpQ0FBVTtRQUt6QztZQUxKLGlCQXFGQztZQS9FTyxrQkFBTSxlQUFlLENBQUMsQ0FBQztZQU0zQixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVoRCxJQUFJLHNCQUFzQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsd0JBQXdCLEVBQUUsS0FBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUMvSCxJQUFJLHFCQUFxQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDM0gsSUFBSSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxLQUFJLENBQUMsWUFBWSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUM5RyxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxTQUFTLEdBQUcsVUFBTSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixHQUFHLHFCQUFxQixHQUFHLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUUzSCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFFaEIsT0FBTyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQzVFLE9BQU8sSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFFaEYsSUFBSSxXQUFXLEdBQUcsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2hDLE9BQU8sRUFBRSxTQUFTO2lCQUNyQixFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUVaLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUM1QyxDQUFDLENBQUE7WUFlRCxxQkFBZ0IsR0FBRztnQkFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUE7WUFFRCxvQkFBZSxHQUFHO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN4QixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQTtZQUVELGlCQUFZLEdBQUc7Z0JBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUNELFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUE7WUFFRCxlQUFVLEdBQUcsVUFBQyxPQUFZO2dCQUN0QixJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELEtBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztnQkFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMvRCxDQUFDO2dCQUNELEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQTtZQUVELFNBQUksR0FBRztZQUNQLENBQUMsQ0FBQTtRQTdFRCxDQUFDO1FBNEJELG9DQUFZLEdBQVosVUFBYSxHQUFXLEVBQUUsUUFBZ0IsRUFBRSxPQUFlO1lBQ3ZELElBQUksT0FBTyxHQUFXO2dCQUNsQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsU0FBUyxFQUFFLE9BQU87YUFDckIsQ0FBQztZQUNGLE1BQU0sQ0FBQyxVQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDckIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQ2xDLFNBQVMsRUFBRSxVQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUNsRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQXdDTCxvQkFBQztJQUFELENBQUMsQUFyRkQsQ0FBbUMsY0FBVSxHQXFGNUM7SUFyRlksaUJBQWEsZ0JBcUZ6QixDQUFBO0FBQ0wsQ0FBQyxFQXZGUyxHQUFHLEtBQUgsR0FBRyxRQXVGWjtBQ3pGRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFFckQsSUFBVSxHQUFHLENBa0JaO0FBbEJELFdBQVUsR0FBRyxFQUFDLENBQUM7SUFDWDtRQUFBO1lBRUksVUFBSyxHQUFXLG9CQUFvQixDQUFDO1lBQ3JDLFVBQUssR0FBVyxlQUFlLENBQUM7WUFDaEMsWUFBTyxHQUFZLEtBQUssQ0FBQztZQUV6QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsZ0NBQWdDLENBQUM7Z0JBQzlDLElBQUksV0FBVyxHQUFHLG9DQUFvQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztZQUNoQyxDQUFDLENBQUM7WUFFRixTQUFJLEdBQUc7Z0JBQ0gsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDakQsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUE7UUFDTCxDQUFDO1FBQUQseUJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLHNCQUFrQixxQkFnQjlCLENBQUE7QUFDTCxDQUFDLEVBbEJTLEdBQUcsS0FBSCxHQUFHLFFBa0JaO0FDcEJELE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUV2RCxJQUFVLEdBQUcsQ0FrQlo7QUFsQkQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYO1FBQUE7WUFFSSxVQUFLLEdBQVcsc0JBQXNCLENBQUM7WUFDdkMsVUFBSyxHQUFXLGlCQUFpQixDQUFDO1lBQ2xDLFlBQU8sR0FBWSxLQUFLLENBQUM7WUFFekIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLGtDQUFrQyxDQUFDO2dCQUNoRCxJQUFJLFdBQVcsR0FBRywrQkFBK0IsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDaEMsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQUksQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUFELDJCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSx3QkFBb0IsdUJBZ0JoQyxDQUFBO0FBQ0wsQ0FBQyxFQWxCUyxHQUFHLEtBQUgsR0FBRyxRQWtCWiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdlbmVyYXRlZCB1c2luZyB0eXBlc2NyaXB0LWdlbmVyYXRvciB2ZXJzaW9uIDEuMTAtU05BUFNIT1Qgb24gMjAxNi0wNy0zMSAyMDoyMTowMS5cblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqc29uIHtcblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8ge1xuICAgICAgICAgICAgcHJpbmNpcGFsTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlczogUHJpdmlsZWdlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpbWFyeVR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBib29sZWFuO1xuICAgICAgICAgICAgaGFzQmluYXJ5OiBib29sZWFuO1xuICAgICAgICAgICAgYmluYXJ5SXNJbWFnZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGJpblZlcjogbnVtYmVyO1xuICAgICAgICAgICAgd2lkdGg6IG51bWJlcjtcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyO1xuICAgICAgICAgICAgY2hpbGRyZW5PcmRlcmVkOiBib29sZWFuO1xuICAgICAgICAgICAgdWlkOiBzdHJpbmc7XG4gICAgICAgICAgICBjcmVhdGVkQnk6IHN0cmluZztcbiAgICAgICAgICAgIGxhc3RNb2RpZmllZDogRGF0ZTtcbiAgICAgICAgICAgIGltZ0lkOiBzdHJpbmc7XG4gICAgICAgICAgICBvd25lcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcml2aWxlZ2VJbmZvIHtcbiAgICAgICAgICAgIHByaXZpbGVnZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHlJbmZvIHtcbiAgICAgICAgICAgIHR5cGU6IG51bWJlcjtcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgICAgICAgICB2YWx1ZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgYWJicmV2aWF0ZWQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlZkluZm8ge1xuICAgICAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhdGg6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXNlclByZWZlcmVuY2VzIHtcbiAgICAgICAgICAgIGVkaXRNb2RlOiBib29sZWFuO1xuICAgICAgICAgICAgYWR2YW5jZWRNb2RlOiBib29sZWFuO1xuICAgICAgICAgICAgbGFzdE5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGltcG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICBleHBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgICAgICAgICAgc2hvd01ldGFEYXRhOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRQcml2aWxlZ2VSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlczogc3RyaW5nW107XG4gICAgICAgICAgICBwcmluY2lwYWw6IHN0cmluZztcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVxdWVzdCB7XG4gICAgICAgICAgICBpZ25vcmVVcmw6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgICAgICBuZXdQYXNzd29yZDogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc0NvZGU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VBY2NvdW50UmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldFBsYXllckluZm9SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xuICAgICAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgbm9kZVBhdGg6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBjcmVhdGVBdFRvcDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcE5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldEZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIGluY2x1ZGVBY2w6IGJvb2xlYW47XG4gICAgICAgICAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgYm9va05hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHRydW5jYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgcGFyZW50SWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICB0ek9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgZHN0OiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICB0YXJnZXROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldENoaWxkSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBzb3J0RGlyOiBzdHJpbmc7XG4gICAgICAgICAgICBzb3J0RmllbGQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoUHJvcDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgICAgIHJlaW5kZXg6IGJvb2xlYW5cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3TmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHVwTGV2ZWw6IG51bWJlcjtcbiAgICAgICAgICAgIG9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgcmVuZGVyUGFyZW50SWZMZWFmOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVxdWVzdCB7XG4gICAgICAgICAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzaWJsaW5nSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICBjYXB0Y2hhOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlVXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICAgICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICAgICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGU6IFJlZkluZm87XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG5cbiAgICAgICAgICAgIC8qIGhvbGRzIHRydWUgaWYgd2UgaGl0IHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgY2hpbGQgbm9kZXMgKi9cbiAgICAgICAgICAgIGVuZFJlYWNoZWQ6IGJvb2xlYW47XG5cbiAgICAgICAgICAgIGRpc3BsYXllZFBhcmVudDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZU5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVByb3BlcnR5UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcHJvcGVydHlTYXZlZDogUHJvcGVydHlJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPcGVuU3lzdGVtRmlsZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaWdudXBSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkRnJvbVVybFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbmNvbnNvbGUubG9nKFwicnVubmluZyBhcHAuanNcIik7XG5cbi8vIHZhciBvbnJlc2l6ZSA9IHdpbmRvdy5vbnJlc2l6ZTtcbi8vIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7IGlmICh0eXBlb2Ygb25yZXNpemUgPT09ICdmdW5jdGlvbicpIG9ucmVzaXplKCk7IC8qKiAuLi4gKi8gfVxuXG52YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IHR5cGVvZiAob2JqZWN0KSA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIG9iamVjdC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0W1wib25cIiArIHR5cGVdID0gY2FsbGJhY2s7XG4gICAgfVxufTtcblxuLypcbiAqIFdBUk5JTkc6IFRoaXMgaXMgY2FsbGVkIGluIHJlYWx0aW1lIHdoaWxlIHVzZXIgaXMgcmVzaXppbmcgc28gYWx3YXlzIHRocm90dGxlIGJhY2sgYW55IHByb2Nlc3Npbmcgc28gdGhhdCB5b3UgZG9uJ3RcbiAqIGRvIGFueSBhY3R1YWwgcHJvY2Vzc2luZyBpbiBoZXJlIHVubGVzcyB5b3Ugd2FudCBpdCBWRVJZIGxpdmUsIGJlY2F1c2UgaXQgaXMuXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd1Jlc2l6ZSgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIldpbmRvd1Jlc2l6ZTogdz1cIiArIHdpbmRvdy5pbm5lcldpZHRoICsgXCIgaD1cIiArIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgd2luZG93UmVzaXplKTtcblxuLy8gdGhpcyBjb21tZW50ZWQgc2VjdGlvbiBpcyBub3Qgd29ya2luZyBpbiBteSBuZXcgeC1hcHAgY29kZSwgYnV0IGl0J3Mgb2sgdG8gY29tbWVudCBpdCBvdXQgZm9yIG5vdy5cbi8vXG4vLyBUaGlzIGlzIG91ciB0ZW1wbGF0ZSBlbGVtZW50IGluIGluZGV4Lmh0bWxcbi8vIHZhciBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjeC1hcHAnKTtcbi8vIC8vIExpc3RlbiBmb3IgdGVtcGxhdGUgYm91bmQgZXZlbnQgdG8ga25vdyB3aGVuIGJpbmRpbmdzXG4vLyAvLyBoYXZlIHJlc29sdmVkIGFuZCBjb250ZW50IGhhcyBiZWVuIHN0YW1wZWQgdG8gdGhlIHBhZ2Vcbi8vIGFwcC5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgY29uc29sZS5sb2coJ2FwcCByZWFkeSBldmVudCEnKTtcbi8vIH0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9seW1lci1yZWFkeScsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZygncG9seW1lci1yZWFkeSBldmVudCEnKTtcbn0pO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogY25zdC5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIGNvb2tpZVByZWZpeDtcclxuXHJcbi8vdG9kby0wOiB0eXBlc2NyaXB0IHdpbGwgbm93IGxldCB1cyBqdXN0IGRvIHRoaXM6IGNvbnN0IHZhcj0ndmFsdWUnO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGNuc3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEFOT046IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fVVNSOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luVXNyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fUFdEOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luUHdkXCI7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBsb2dpblN0YXRlPVwiMFwiIGlmIHVzZXIgbG9nZ2VkIG91dCBpbnRlbnRpb25hbGx5LiBsb2dpblN0YXRlPVwiMVwiIGlmIGxhc3Qga25vd24gc3RhdGUgb2YgdXNlciB3YXMgJ2xvZ2dlZCBpbidcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9TVEFURTogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblN0YXRlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCUjogXCI8ZGl2IGNsYXNzPSd2ZXJ0LXNwYWNlJz48L2Rpdj5cIjtcclxuICAgICAgICBleHBvcnQgbGV0IElOU0VSVF9BVFRBQ0hNRU5UOiBzdHJpbmcgPSBcInt7aW5zZXJ0LWF0dGFjaG1lbnR9fVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTkVXX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9WRV9VUERPV05fT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyB3b3JrcywgYnV0IEknbSBub3Qgc3VyZSBJIHdhbnQgaXQgZm9yIEFMTCBlZGl0aW5nLiBTdGlsbCB0aGlua2luZyBhYm91dCBkZXNpZ24gaGVyZSwgYmVmb3JlIEkgdHVybiB0aGlzXHJcbiAgICAgICAgICogb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBVU0VfQUNFX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBzaG93aW5nIHBhdGggb24gcm93cyBqdXN0IHdhc3RlcyBzcGFjZSBmb3Igb3JkaW5hcnkgdXNlcnMuIE5vdCByZWFsbHkgbmVlZGVkICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBTSE9XX1BBVEhfT05fUk9XUzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZXhwb3J0IGxldCBTSE9XX1BBVEhfSU5fRExHUzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19DTEVBUl9CVVRUT05fSU5fRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuIiwiXG5uYW1lc3BhY2UgbTY0IHtcbiAgICAvKiBUaGVzZSBhcmUgQ2xpZW50LXNpZGUgb25seSBtb2RlbHMsIGFuZCBhcmUgbm90IHNlZW4gb24gdGhlIHNlcnZlciBzaWRlIGV2ZXIgKi9cblxuICAgIC8qIE1vZGVscyBhIHRpbWUtcmFuZ2UgaW4gc29tZSBtZWRpYSB3aGVyZSBhbiBBRCBzdGFydHMgYW5kIHN0b3BzICovXG4gICAgZXhwb3J0IGNsYXNzIEFkU2VnbWVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiZWdpblRpbWU6IG51bWJlciwvL1xuICAgICAgICAgICAgcHVibGljIGVuZFRpbWU6IG51bWJlcikge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByb3BFbnRyeSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICAgICAgcHVibGljIHByb3BlcnR5OiBqc29uLlByb3BlcnR5SW5mbywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBtdWx0aTogYm9vbGVhbiwgLy9cbiAgICAgICAgICAgIHB1YmxpYyByZWFkT25seTogYm9vbGVhbiwgLy9cbiAgICAgICAgICAgIHB1YmxpYyBiaW5hcnk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgc3ViUHJvcHM6IFN1YlByb3BbXSkge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN1YlByb3Age1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyB2YWw6IHN0cmluZykge1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXRpbC5qc1wiKTtcclxuXHJcbi8vdG9kby0wOiBuZWVkIHRvIGZpbmQgdGhlIERlZmluaXRlbHlUeXBlZCBmaWxlIGZvciBQb2x5bWVyLlxyXG5kZWNsYXJlIHZhciBQb2x5bWVyO1xyXG5kZWNsYXJlIHZhciAkOyAvLzwtLS0tLS0tLS0tLS0tdGhpcyB3YXMgYSB3aWxkYXNzIGd1ZXNzLlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XHJcblxyXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XHJcbn1cclxuXHJcbmludGVyZmFjZSBfSGFzU2VsZWN0IHtcclxuICAgIHNlbGVjdD86IGFueTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBBcnJheSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9XQVJOSU5HOiBUaGVzZSBwcm90b3R5cGUgZnVuY3Rpb25zIG11c3QgYmUgZGVmaW5lZCBvdXRzaWRlIGFueSBmdW5jdGlvbnMuXHJcbmludGVyZmFjZSBBcnJheTxUPiB7XHJcbiAgICBjbG9uZSgpOiBBcnJheTxUPjtcclxuICAgIGluZGV4T2ZJdGVtQnlQcm9wKHByb3BOYW1lLCBwcm9wVmFsKTogbnVtYmVyO1xyXG4gICAgYXJyYXlNb3ZlSXRlbShmcm9tSW5kZXgsIHRvSW5kZXgpOiB2b2lkO1xyXG4gICAgaW5kZXhPZk9iamVjdChvYmo6IGFueSk6IG51bWJlcjtcclxufTtcclxuXHJcbkFycmF5LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCk7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuaW5kZXhPZkl0ZW1CeVByb3AgPSBmdW5jdGlvbihwcm9wTmFtZSwgcHJvcFZhbCkge1xyXG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldW3Byb3BOYW1lXSA9PT0gcHJvcFZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG4vKiBuZWVkIHRvIHRlc3QgYWxsIGNhbGxzIHRvIHRoaXMgbWV0aG9kIGJlY2F1c2UgaSBub3RpY2VkIGR1cmluZyBUeXBlU2NyaXB0IGNvbnZlcnNpb24gaSB3YXNuJ3QgZXZlbiByZXR1cm5pbmdcclxuYSB2YWx1ZSBmcm9tIHRoaXMgZnVuY3Rpb24hIHRvZG8tMFxyXG4qL1xyXG5BcnJheS5wcm90b3R5cGUuYXJyYXlNb3ZlSXRlbSA9IGZ1bmN0aW9uKGZyb21JbmRleCwgdG9JbmRleCkge1xyXG4gICAgdGhpcy5zcGxpY2UodG9JbmRleCwgMCwgdGhpcy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XHJcbn07XHJcblxyXG5pZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ICE9ICdmdW5jdGlvbicpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEYXRlIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcbiAgICBzdGRUaW1lem9uZU9mZnNldCgpOiBudW1iZXI7XHJcbiAgICBkc3QoKTogYm9vbGVhbjtcclxufTtcclxuXHJcbkRhdGUucHJvdG90eXBlLnN0ZFRpbWV6b25lT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgamFuID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCAwLCAxKTtcclxuICAgIHZhciBqdWwgPSBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIDYsIDEpO1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KGphbi5nZXRUaW1lem9uZU9mZnNldCgpLCBqdWwuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XHJcbn1cclxuXHJcbkRhdGUucHJvdG90eXBlLmRzdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSA8IHRoaXMuc3RkVGltZXpvbmVPZmZzZXQoKTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBTdHJpbmcgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG4gICAgc3RhcnRzV2l0aChzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICBzdHJpcElmU3RhcnRzV2l0aChzdHI6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGNvbnRhaW5zKHN0cjogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIHJlcGxhY2VBbGwoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICB1bmVuY29kZUh0bWwoKTogc3RyaW5nO1xyXG4gICAgZXNjYXBlRm9yQXR0cmliKCk6IHN0cmluZztcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpID09PSAwO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RyaXBJZlN0YXJ0c1dpdGggPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGFydHNXaXRoKHN0cikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0ci5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpICE9IC0xO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24oZmluZCwgcmVwbGFjZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZmluZCksICdnJyksIHJlcGxhY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUudW5lbmNvZGVIdG1sICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUudW5lbmNvZGVIdG1sID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKFwiJlwiKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VBbGwoJyZhbXA7JywgJyYnKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmZ3Q7JywgJz4nKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmbHQ7JywgJzwnKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmcXVvdDsnLCAnXCInKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmIzM5OycsIFwiJ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLmVzY2FwZUZvckF0dHJpYiAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmVzY2FwZUZvckF0dHJpYiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VBbGwoXCJcXFwiXCIsIFwiJnF1b3Q7XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXRpbCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQWpheDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZW91dE1lc3NhZ2VTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb2ZmbGluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHdhaXRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcGdyc0RsZzogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy90aGlzIGJsb3dzIHRoZSBoZWxsIHVwLCBub3Qgc3VyZSB3aHkuXHJcbiAgICAgICAgLy9cdE9iamVjdC5wcm90b3R5cGUudG9Kc29uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsIDQpO1xyXG4gICAgICAgIC8vXHR9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFzc2VydE5vdE51bGwgPSBmdW5jdGlvbih2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZhbCh2YXJOYW1lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlZhcmlhYmxlIG5vdCBmb3VuZDogXCIgKyB2YXJOYW1lKSkub3BlbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcbiAgICAgICAgICogc2Vzc2lvbiBpcyBvbmx5IGFsbG93ZWQgb25lIGNvbmN1cnJlbnQgY2FsbCBhbmQgc2ltdWx0YW5lb3VzIGNhbGxzIHdvdWxkIGp1c3QgXCJxdWV1ZSB1cFwiLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfYWpheENvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRheWxpZ2h0U2F2aW5nc1RpbWU6IGJvb2xlYW4gPSAobmV3IERhdGUoKS5kc3QoKSkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdG9Kc29uID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogVGhpcyBjYW1lIGZyb20gaGVyZTpcclxuXHRcdCAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWU/OiBhbnksIHVybD86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdXJsKVxyXG4gICAgICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xyXG4gICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0cylcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHNbMl0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFNldHMgdXAgYW4gaW5oZXJpdGFuY2UgcmVsYXRpb25zaGlwIHNvIHRoYXQgY2hpbGQgaW5oZXJpdHMgZnJvbSBwYXJlbnQsIGFuZCB0aGVuIHJldHVybnMgdGhlIHByb3RvdHlwZSBvZiB0aGVcclxuXHRcdCAqIGNoaWxkIHNvIHRoYXQgbWV0aG9kcyBjYW4gYmUgYWRkZWQgdG8gaXQsIHdoaWNoIHdpbGwgYmVoYXZlIGxpa2UgbWVtYmVyIGZ1bmN0aW9ucyBpbiBjbGFzc2ljIE9PUCB3aXRoXHJcblx0XHQgKiBpbmhlcml0YW5jZSBoaWVyYXJjaGllcy5cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5oZXJpdCA9IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpOiBhbnkge1xyXG4gICAgICAgICAgICBjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnByb3RvdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdFByb2dyZXNzTW9uaXRvciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbChwcm9ncmVzc0ludGVydmFsLCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvZ3Jlc3NJbnRlcnZhbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgaXNXYWl0aW5nID0gaXNBamF4V2FpdGluZygpO1xyXG4gICAgICAgICAgICBpZiAoaXNXYWl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICB3YWl0Q291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHdhaXRDb3VudGVyID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZyA9IG5ldyBQcm9ncmVzc0RsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YWl0Q291bnRlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAocGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGdyc0RsZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQganNvbiA9IGZ1bmN0aW9uIDxSZXF1ZXN0VHlwZSwgUmVzcG9uc2VUeXBlPihwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogUmVxdWVzdFR5cGUsIC8vXHJcbiAgICAgICAgICAgIGNhbGxiYWNrPzogKHJlc3BvbnNlOiBSZXNwb25zZVR5cGUsIHBheWxvYWQ/OiBhbnkpID0+IGFueSwgY2FsbGJhY2tUaGlzPzogYW55LCBjYWxsYmFja1BheWxvYWQ/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMgPT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUk9CQUJMRSBCVUc6IGpzb24gY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSArIFwiIHVzZWQgZ2xvYmFsICd3aW5kb3cnIGFzICd0aGlzJywgd2hpY2ggaXMgYWxtb3N0IG5ldmVyIGdvaW5nIHRvIGJlIGNvcnJlY3QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXJvbkFqYXg7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVxdWVzdDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2ZmbGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib2ZmbGluZTogaWdub3JpbmcgY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU09OLVBPU1RbZ2VuXTogW1wiICsgcG9zdE5hbWUgKyBcIl1cIiArIEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRG8gbm90IGRlbGV0ZSwgcmVzZWFyY2ggdGhpcyB3YXkuLi4gKi9cclxuICAgICAgICAgICAgICAgIC8vIHZhciBpcm9uQWpheCA9IHRoaXMuJCQoXCIjbXlJcm9uQWpheFwiKTtcclxuICAgICAgICAgICAgICAgIC8vaXJvbkFqYXggPSBQb2x5bWVyLmRvbSgoPF9IYXNSb290Pil3aW5kb3cuZG9jdW1lbnQucm9vdCkucXVlcnlTZWxlY3RvcihcIiNpcm9uQWpheFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheCA9IHBvbHlFbG1Ob2RlKFwiaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgudXJsID0gcG9zdFRhcmdldFVybCArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgudmVyYm9zZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgubWV0aG9kID0gXCJQT1NUXCI7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5jb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24vanNvblwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNwZWNpZnkgYW55IHVybCBwYXJhbXMgdGhpcyB3YXk6XHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5wYXJhbXM9J3tcImFsdFwiOlwianNvblwiLCBcInFcIjpcImNocm9tZVwifSc7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguaGFuZGxlQXMgPSBcImpzb25cIjsgLy8gaGFuZGxlLWFzIChpcyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRoaXMgbm90IGEgcmVxdWlyZWQgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgICAgIC8vIGlyb25BamF4Lm9uUmVzcG9uc2UgPSBcInV0aWwuaXJvbkFqYXhSZXNwb25zZVwiOyAvLyBvbi1yZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgLy8gKGlzXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9wKVxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguZGVib3VuY2VEdXJhdGlvbiA9IFwiMzAwXCI7IC8vIGRlYm91bmNlLWR1cmF0aW9uIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICBfYWpheENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlyb25SZXF1ZXN0ID0gaXJvbkFqYXguZ2VuZXJhdGVSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgc3RhcnRpbmcgcmVxdWVzdDogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTm90ZXNcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIElmIHVzaW5nIHRoZW4gZnVuY3Rpb246IHByb21pc2UudGhlbihzdWNjZXNzRnVuY3Rpb24sIGZhaWxGdW5jdGlvbik7XHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJIHRoaW5rIHRoZSB3YXkgdGhlc2UgcGFyYW1ldGVycyBnZXQgcGFzc2VkIGludG8gZG9uZS9mYWlsIGZ1bmN0aW9ucywgaXMgYmVjYXVzZSB0aGVyZSBhcmUgcmVzb2x2ZS9yZWplY3RcclxuICAgICAgICAgICAgICogbWV0aG9kcyBnZXR0aW5nIGNhbGxlZCB3aXRoIHRoZSBwYXJhbWV0ZXJzLiBCYXNpY2FsbHkgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvICdyZXNvbHZlJyBnZXQgZGlzdHJpYnV0ZWRcclxuICAgICAgICAgICAgICogdG8gYWxsIHRoZSB3YWl0aW5nIG1ldGhvZHMganVzdCBsaWtlIGFzIGlmIHRoZXkgd2VyZSBzdWJzY3JpYmluZyBpbiBhIHB1Yi9zdWIgbW9kZWwuIFNvIHRoZSAncHJvbWlzZSdcclxuICAgICAgICAgICAgICogcGF0dGVybiBpcyBzb3J0IG9mIGEgcHViL3N1YiBtb2RlbCBpbiBhIHdheVxyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogVGhlIHJlYXNvbiB0byByZXR1cm4gYSAncHJvbWlzZS5wcm9taXNlKCknIG1ldGhvZCBpcyBzbyBubyBvdGhlciBjb2RlIGNhbiBjYWxsIHJlc29sdmUvcmVqZWN0IGJ1dCBjYW5cclxuICAgICAgICAgICAgICogb25seSByZWFjdCB0byBhIGRvbmUvZmFpbC9jb21wbGV0ZS5cclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIGRlZmVycmVkLndoZW4ocHJvbWlzZTEsIHByb21pc2UyKSBjcmVhdGVzIGEgbmV3IHByb21pc2UgdGhhdCBiZWNvbWVzICdyZXNvbHZlZCcgb25seSB3aGVuIGFsbCBwcm9taXNlc1xyXG4gICAgICAgICAgICAgKiBhcmUgcmVzb2x2ZWQuIEl0J3MgYSBiaWcgXCJhbmQgY29uZGl0aW9uXCIgb2YgcmVzb2x2ZW1lbnQsIGFuZCBpZiBhbnkgb2YgdGhlIHByb21pc2VzIHBhc3NlZCB0byBpdCBlbmQgdXBcclxuICAgICAgICAgICAgICogZmFpbGluZywgaXQgZmFpbHMgdGhpcyBcIkFORGVkXCIgb25lIGFsc28uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpcm9uUmVxdWVzdC5jb21wbGV0ZXMudGhlbigvL1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBTdWNjZXNzXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIEpTT04tUkVTVUxUOiBcIiArIHBvc3ROYW1lICsgXCJcXG4gICAgSlNPTi1SRVNVTFQtREFUQTogXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGlyb25SZXF1ZXN0LnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyBpcyB1Z2x5IGJlY2F1c2UgaXQgY292ZXJzIGFsbCBmb3VyIGNhc2VzIGJhc2VkIG9uIHR3byBib29sZWFucywgYnV0IGl0J3Mgc3RpbGwgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaW1wbGVzdCB3YXkgdG8gZG8gdGhpcy4gV2UgaGF2ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgbWF5IG9yIG1heSBub3Qgc3BlY2lmeSBhICd0aGlzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIGFsd2F5cyBjYWxscyB3aXRoIHRoZSAncmVwb25zZScgcGFyYW0gYW5kIG9wdGlvbmFsbHkgYSBjYWxsYmFja1BheWxvYWQgcGFyYW0uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1BheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FuJ3Qgd2UganVzdCBsZXQgY2FsbGJhY2tQYXlsb2FkIGJlIHVuZGVmaW5lZCwgYW5kIGNhbGwgdGhlIGFib3ZlIGNhbGxiYWNrIG1ldGhvZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBub3QgZXZlbiBoYXZlIHRoaXMgZWxzZSBibG9jayBoZXJlIGF0IGFsbCAoaS5lLiBub3QgZXZlbiBjaGVjayBpZiBjYWxsYmFja1BheWxvYWQgaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwvdW5kZWZpbmVkLCBidXQganVzdCB1c2UgaXQsIGFuZCBub3QgaGF2ZSB0aGlzIGlmIGJsb2NrPylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dBbmRSZVRocm93KFwiRmFpbGVkIGhhbmRsaW5nIHJlc3VsdCBvZjogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIEZhaWxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gdXRpbC5qc29uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlyb25SZXF1ZXN0LnN0YXR1cyA9PSBcIjQwM1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgaW4gZGV0ZWN0ZWQgaW4gdXRpbC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZsaW5lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXRNZXNzYWdlU2hvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0TWVzc2FnZVNob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZXNzaW9uIHRpbWVkIG91dC4gUGFnZSB3aWxsIHJlZnJlc2guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1zZzogc3RyaW5nID0gXCJTZXJ2ZXIgcmVxdWVzdCBmYWlsZWQuXFxuXFxuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBjYXRjaCBibG9jayBzaG91bGQgZmFpbCBzaWxlbnRseSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiU3RhdHVzOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1c1RleHQgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiQ29kZTogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXMgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB0aGlzIGNhdGNoIGJsb2NrIHNob3VsZCBhbHNvIGZhaWwgc2lsZW50bHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyB3YXMgc2hvd2luZyBcImNsYXNzQ2FzdEV4Y2VwdGlvblwiIHdoZW4gSSB0aHJldyBhIHJlZ3VsYXIgXCJFeGNlcHRpb25cIiBmcm9tIHNlcnZlciBzbyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEknbSBqdXN0IHR1cm5pbmcgdGhpcyBvZmYgc2luY2UgaXRzJyBub3QgZGlzcGxheWluZyB0aGUgY29ycmVjdCBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXNnICs9IFwiUmVzcG9uc2U6IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5leGNlcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dBbmRSZVRocm93KFwiRmFpbGVkIHByb2Nlc3Npbmcgc2VydmVyLXNpZGUgZmFpbCBvZjogXCIgKyBwb3N0TmFtZSwgZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlyb25SZXF1ZXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBbmRUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlICsgXCJTVEFDSzogXCIgKyBzdGFjayk7XHJcbiAgICAgICAgICAgIHRocm93IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FuZFJlVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcsIGV4Y2VwdGlvbjogYW55KSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFwiW3N0YWNrLCBub3Qgc3VwcG9ydGVkXVwiO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgKyBcIlNUQUNLOiBcIiArIHN0YWNrKTtcclxuICAgICAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhamF4UmVhZHkgPSBmdW5jdGlvbihyZXF1ZXN0TmFtZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoX2FqYXhDb3VudGVyID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZ25vcmluZyByZXF1ZXN0czogXCIgKyByZXF1ZXN0TmFtZSArIFwiLiBBamF4IGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzQWpheFdhaXRpbmcgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9hamF4Q291bnRlciA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZXQgZm9jdXMgdG8gZWxlbWVudCBieSBpZCAoaWQgbXVzdCBzdGFydCB3aXRoICMpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxheWVkRm9jdXMgPSBmdW5jdGlvbihpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBzbyB1c2VyIHNlZXMgdGhlIGZvY3VzIGZhc3Qgd2UgdHJ5IGF0IC41IHNlY29uZHMgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSB0cnkgYWdhaW4gYSBmdWxsIHNlY29uZCBsYXRlci4gTm9ybWFsbHkgbm90IHJlcXVpcmVkLCBidXQgbmV2ZXIgdW5kZXNpcmFibGUgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogV2UgY291bGQgaGF2ZSBwdXQgdGhpcyBsb2dpYyBpbnNpZGUgdGhlIGpzb24gbWV0aG9kIGl0c2VsZiwgYnV0IEkgY2FuIGZvcnNlZSBjYXNlcyB3aGVyZSB3ZSBkb24ndCB3YW50IGFcclxuXHRcdCAqIG1lc3NhZ2UgdG8gYXBwZWFyIHdoZW4gdGhlIGpzb24gcmVzcG9uc2UgcmV0dXJucyBzdWNjZXNzPT1mYWxzZSwgc28gd2Ugd2lsbCBoYXZlIHRvIGNhbGwgY2hlY2tTdWNjZXNzIGluc2lkZVxyXG5cdFx0ICogZXZlcnkgcmVzcG9uc2UgbWV0aG9kIGluc3RlYWQsIGlmIHdlIHdhbnQgdGhhdCByZXNwb25zZSB0byBwcmludCBhIG1lc3NhZ2UgdG8gdGhlIHVzZXIgd2hlbiBmYWlsIGhhcHBlbnMuXHJcblx0XHQgKlxyXG5cdFx0ICogcmVxdWlyZXM6IHJlcy5zdWNjZXNzIHJlcy5tZXNzYWdlXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoZWNrU3VjY2VzcyA9IGZ1bmN0aW9uKG9wRnJpZW5kbHlOYW1lLCByZXMpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG9wRnJpZW5kbHlOYW1lICsgXCIgZmFpbGVkOiBcIiArIHJlcy5tZXNzYWdlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3VjY2VzcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGFkZHMgYWxsIGFycmF5IG9iamVjdHMgdG8gb2JqIGFzIGEgc2V0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGRBbGwgPSBmdW5jdGlvbihvYmosIGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibnVsbCBlbGVtZW50IGluIGFkZEFsbCBhdCBpZHg9XCIgKyBpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2FbaV1dID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudWxsT3JVbmRlZiA9IGZ1bmN0aW9uKG9iaik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogV2UgaGF2ZSB0byBiZSBhYmxlIHRvIG1hcCBhbnkgaWRlbnRpZmllciB0byBhIHVpZCwgdGhhdCB3aWxsIGJlIHJlcGVhdGFibGUsIHNvIHdlIGhhdmUgdG8gdXNlIGEgbG9jYWxcclxuXHRcdCAqICdoYXNoc2V0LXR5cGUnIGltcGxlbWVudGF0aW9uXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFVpZEZvcklkID0gZnVuY3Rpb24obWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qIGxvb2sgZm9yIHVpZCBpbiBtYXAgKi9cclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbWFwW2lkXTtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIG5vdCBmb3VuZCwgZ2V0IG5leHQgbnVtYmVyLCBhbmQgYWRkIHRvIG1hcCAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgdWlkID0gXCJcIiArIG1ldGE2NC5uZXh0VWlkKys7XHJcbiAgICAgICAgICAgICAgICBtYXBbaWRdID0gdWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB1aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVsZW1lbnRFeGlzdHMgPSBmdW5jdGlvbihpZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUYWtlcyB0ZXh0YXJlYSBkb20gSWQgKCMgb3B0aW9uYWwpIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VGV4dEFyZWFWYWxCeUlkID0gZnVuY3Rpb24oaWQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgZGU6IEhUTUxFbGVtZW50ID0gZG9tRWxtKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kZSkudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkb21FbG0gPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5ID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9seUVsbShpZCkubm9kZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHlFbG0gPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQb2x5bWVyLmRvbShlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seUVsbU5vZGUgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGUgPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUubm9kZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmRcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UmVxdWlyZWRFbGVtZW50ID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gJChpZCk7XHJcbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0UmVxdWlyZWRFbGVtZW50LiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoubGVuZ3RoICE9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnRUaW1lTWlsbGlzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVtcHR5U3RyaW5nID0gZnVuY3Rpb24odmFsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICF2YWwgfHwgdmFsLmxlbmd0aCA9PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9seUVsbShpZCkubm9kZS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IHdhcyBmb3VuZCwgb3IgZmFsc2UgaWYgZWxlbWVudCBub3QgZm91bmQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgZWxtLm5vZGUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVsbSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5kRW50ZXJLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnkpIHtcclxuICAgICAgICAgICAgYmluZEtleShpZCwgZnVuYywgMTMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5kS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55LCBrZXlDb2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgJChpZCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5Q29kZSkgeyAvLyAxMz09ZW50ZXIga2V5IGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogUmVtb3ZlZCBvbGRDbGFzcyBmcm9tIGVsZW1lbnQgYW5kIHJlcGxhY2VzIHdpdGggbmV3Q2xhc3MsIGFuZCBpZiBvbGRDbGFzcyBpcyBub3QgcHJlc2VudCBpdCBzaW1wbHkgYWRkc1xyXG5cdFx0ICogbmV3Q2xhc3MuIElmIG9sZCBjbGFzcyBleGlzdGVkLCBpbiB0aGUgbGlzdCBvZiBjbGFzc2VzLCB0aGVuIHRoZSBuZXcgY2xhc3Mgd2lsbCBub3cgYmUgYXQgdGhhdCBwb3NpdGlvbi4gSWZcclxuXHRcdCAqIG9sZCBjbGFzcyBkaWRuJ3QgZXhpc3QsIHRoZW4gbmV3IENsYXNzIGlzIGFkZGVkIGF0IGVuZCBvZiBjbGFzcyBsaXN0LlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGFuZ2VPckFkZENsYXNzID0gZnVuY3Rpb24oZWxtOiBzdHJpbmcsIG9sZENsYXNzOiBzdHJpbmcsIG5ld0NsYXNzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsbWVtZW50ID0gJChlbG0pO1xyXG4gICAgICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhvbGRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhuZXdDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBkaXNwbGF5cyBtZXNzYWdlIChtc2cpIG9mIG9iamVjdCBpcyBub3Qgb2Ygc3BlY2lmaWVkIHR5cGVcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdmVyaWZ5VHlwZSA9IGZ1bmN0aW9uKG9iajogYW55LCB0eXBlOiBhbnksIG1zZzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRIdG1sID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gZG9tRWxtKGlkKTtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSBQb2x5bWVyLmRvbShlbG0pO1xyXG5cclxuICAgICAgICAgICAgLy9Gb3IgUG9seW1lciAxLjAuMCwgeW91IG5lZWQgdGhpcy4uLlxyXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgcG9seUVsbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydHlDb3VudCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIHByb3A7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyBhbmQgdmFsdWVzXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByaW50T2JqZWN0ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eVtcIiArIGNvdW50ICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9IGsgKyBcIiAsIFwiICsgdiArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByaW50S2V5cyA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWspIHtcclxuICAgICAgICAgICAgICAgICAgICBrID0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9ICcsJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbCArPSBrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIE1ha2VzIGVsZUlkIGVuYWJsZWQgYmFzZWQgb24gdmlzIGZsYWdcclxuXHRcdCAqXHJcblx0XHQgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRFbmFibGVtZW50ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgZW5hYmxlOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVuYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIE1ha2VzIGVsZUlkIHZpc2libGUgYmFzZWQgb24gdmlzIGZsYWdcclxuXHRcdCAqXHJcblx0XHQgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgdmlzOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2aXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgJChlbG0pLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGlkaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICQoZWxtKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFByb2dyYW1hdGljYWxseSBjcmVhdGVzIG9iamVjdHMgYnkgbmFtZSwgc2ltaWxhciB0byB3aGF0IEphdmEgcmVmbGVjdGlvbiBkb2VzXHJcblxyXG4gICAgICAgICogZXg6IHZhciBleGFtcGxlID0gSW5zdGFuY2VMb2FkZXIuZ2V0SW5zdGFuY2U8TmFtZWRUaGluZz4od2luZG93LCAnRXhhbXBsZUNsYXNzJywgYXJncy4uLik7XHJcbiAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldEluc3RhbmNlID0gZnVuY3Rpb24gPFQ+KGNvbnRleHQ6IE9iamVjdCwgbmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGNvbnRleHRbbmFtZV0ucHJvdG90eXBlKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuY29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gPFQ+aW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGpjckNuc3QuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgamNyQ25zdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09NTUVOVF9CWTogc3RyaW5nID0gXCJjb21tZW50QnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBVQkxJQ19BUFBFTkQ6IHN0cmluZyA9IFwicHVibGljQXBwZW5kXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQUklNQVJZX1RZUEU6IHN0cmluZyA9IFwiamNyOnByaW1hcnlUeXBlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQT0xJQ1k6IHN0cmluZyA9IFwicmVwOnBvbGljeVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IE1JWElOX1RZUEVTOiBzdHJpbmcgPSBcImpjcjptaXhpblR5cGVzXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfUkVDSVA6IHN0cmluZyA9IFwicmVjaXBcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX1NVQkpFQ1Q6IHN0cmluZyA9IFwic3ViamVjdFwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IENSRUFURUQ6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENSRUFURURfQlk6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVEFHUzogc3RyaW5nID0gXCJ0YWdzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBVVUlEOiBzdHJpbmcgPSBcImpjcjp1dWlkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRURfQlk6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBKU09OX0ZJTEVfU0VBUkNIX1JFU1VMVDogc3RyaW5nID0gXCJtZXRhNjQ6anNvblwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IERJU0FCTEVfSU5TRVJUOiBzdHJpbmcgPSBcImRpc2FibGVJbnNlcnRcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBVU0VSOiBzdHJpbmcgPSBcInVzZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBXRDogc3RyaW5nID0gXCJwd2RcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMOiBzdHJpbmcgPSBcImVtYWlsXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT0RFOiBzdHJpbmcgPSBcImNvZGVcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fVkVSOiBzdHJpbmcgPSBcImJpblZlclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX0RBVEE6IHN0cmluZyA9IFwiamNyRGF0YVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX01JTUU6IHN0cmluZyA9IFwiamNyOm1pbWVUeXBlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX1dJRFRIOiBzdHJpbmcgPSBcImltZ1dpZHRoXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTUdfSEVJR0hUOiBzdHJpbmcgPSBcImltZ0hlaWdodFwiO1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGF0dGFjaG1lbnQuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgYXR0YWNobWVudCB7XHJcbiAgICAgICAgLyogTm9kZSBiZWluZyB1cGxvYWRlZCB0byAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBsb2FkTm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbUZpbGVEbGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIG02NC5uYW1lc3BhY2UgdmVyc2lvbiFcIik7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnKCkpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFRvIHJ1biBsZWdhY3kgdXBsb2FkZXIganVzdCBwdXQgdGhpcyB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgaGVyZSwgYW5kXHJcbiAgICAgICAgICAgIG5vdGhpbmcgZWxzZSBpcyByZXF1aXJlZC4gU2VydmVyIHNpZGUgcHJvY2Vzc2luZyBpcyBzdGlsbCBpbiBwbGFjZSBmb3IgaXRcclxuXHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21VcmxEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGUgQXR0YWNobWVudFwiLCBcIkRlbGV0ZSB0aGUgQXR0YWNobWVudCBvbiB0aGUgTm9kZT9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlQXR0YWNobWVudFJlcXVlc3QsIGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlPihcImRlbGV0ZUF0dGFjaG1lbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIG51bGwsIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBhdHRhY2htZW50XCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZW1vdmVCaW5hcnlCeVVpZCh1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgcmUtcmVuZGVyIGZyb20gbG9jYWwgZGF0YS5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogZWRpdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBlZGl0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgbTY0LkNyZWF0ZU5vZGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluc2VydEJvb2tSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnRCb29rUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRCb29rUmVzcG9uc2UgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBCb29rXCIsIHJlcyk7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWxldGVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2UsIHBheWxvYWQ6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlID0gcGF5bG9hZFtcInBvc3REZWxldGVTZWxOb2RlXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gc2VsTm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgaGlnaGxpZ2h0SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5pdE5vZGVFZGl0UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5pdE5vZGVFZGl0UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRWRpdGluZyBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz8gKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlIGFuZCB3ZSBhcmUgdGhlIGNvbW1lbnRlciAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGVkaXRpbmdBbGxvd2VkOiBib29sZWFuID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFNlcnZlciB3aWxsIGhhdmUgc2VudCB1cyBiYWNrIHRoZSByYXcgdGV4dCBjb250ZW50LCB0aGF0IHNob3VsZCBiZSBtYXJrZG93biBpbnN0ZWFkIG9mIGFueSBIVE1MLCBzb1xyXG4gICAgICAgICAgICAgICAgICAgICAqIHRoYXQgd2UgY2FuIGRpc3BsYXkgdGhpcyBhbmQgc2F2ZS5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZSA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgY2Fubm90IGVkaXQgbm9kZXMgdGhhdCB5b3UgZG9uJ3Qgb3duLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbW92ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTW92ZU5vZGVzUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTW92ZSBub2Rlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IG51bGw7IC8vIHJlc2V0XHJcbiAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZVNldCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2Ugbm9kZSBwb3NpdGlvblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dSZWFkT25seVByb3BlcnRpZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTm9kZSBJRCBhcnJheSBvZiBub2RlcyB0aGF0IGFyZSByZWFkeSB0byBiZSBtb3ZlZCB3aGVuIHVzZXIgY2xpY2tzICdGaW5pc2ggTW92aW5nJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZXNUb01vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMTogbmVlZCB0byBmaW5kIG91dCBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0byBkbyBhbiBvcmRlcmVkIHNldCBpbiBqYXZhc2NyaXB0IHNvIEkgZG9uJ3QgbmVlZFxyXG4gICAgICAgIGJvdGggbm9kZXNUb01vdmUgYW5kIG5vZGVzVG9Nb3ZlU2V0XHJcbiAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlU2V0OiBPYmplY3QgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRPZk5ld05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGluZGljYXRlcyBlZGl0b3IgaXMgZGlzcGxheWluZyBhIG5vZGUgdGhhdCBpcyBub3QgeWV0IHNhdmVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRpbmdVbnNhdmVkTm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5vZGUgKE5vZGVJbmZvLmphdmEpIHRoYXQgaXMgYmVpbmcgY3JlYXRlZCB1bmRlciB3aGVuIG5ldyBub2RlIGlzIGNyZWF0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgYmVpbmcgZWRpdGVkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiB0b2RvLTI6IHRoaXMgYW5kIHNldmVyYWwgb3RoZXIgdmFyaWFibGVzIGNhbiBub3cgYmUgbW92ZWQgaW50byB0aGUgZGlhbG9nIGNsYXNzPyBJcyB0aGF0IGdvb2Qgb3IgYmFkXHJcbiAgICAgICAgICogY291cGxpbmcvcmVzcG9uc2liaWxpdHk/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIEluc3RhbmNlIG9mIEVkaXROb2RlRGlhbG9nOiBGb3Igbm93IGNyZWF0aW5nIG5ldyBvbmUgZWFjaCB0aW1lICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZURsZ0luc3Q6IEVkaXROb2RlRGxnID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0eXBlPU5vZGVJbmZvLmphdmFcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFdoZW4gaW5zZXJ0aW5nIGEgbmV3IG5vZGUsIHRoaXMgaG9sZHMgdGhlIG5vZGUgdGhhdCB3YXMgY2xpY2tlZCBvbiBhdCB0aGUgdGltZSB0aGUgaW5zZXJ0IHdhcyByZXF1ZXN0ZWQsIGFuZFxyXG4gICAgICAgICAqIGlzIHNlbnQgdG8gc2VydmVyIGZvciBvcmRpbmFsIHBvc2l0aW9uIGFzc2lnbm1lbnQgb2YgbmV3IG5vZGUuIEFsc28gaWYgdGhpcyB2YXIgaXMgbnVsbCwgaXQgaW5kaWNhdGVzIHdlIGFyZVxyXG4gICAgICAgICAqIGNyZWF0aW5nIGluIGEgJ2NyZWF0ZSB1bmRlciBwYXJlbnQnIG1vZGUsIHZlcnN1cyBub24tbnVsbCBtZWFuaW5nICdpbnNlcnQgaW5saW5lJyB0eXBlIG9mIGluc2VydC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZUluc2VydFRhcmdldDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIHdlIGNhbiAndHJ5IHRvJyBpbnNlcnQgdW5kZXIgJ25vZGUnIG9yIGZhbHNlIGlmIG5vdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNFZGl0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBub2RlLnBhdGggIT0gXCIvXCIgJiZcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBDaGVjayB0aGF0IGlmIHdlIGhhdmUgYSBjb21tZW50QnkgcHJvcGVydHkgd2UgYXJlIHRoZSBjb21tZW50ZXIsIGJlZm9yZSBhbGxvd2luZyBlZGl0IGJ1dHRvbiBhbHNvLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAoIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB8fCBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSkpIC8vXHJcbiAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGFsbG93IHRoZSBkaXNhYmxlSW5zZXJ0IHByb3AgdG8gYmUgYWJsZSB0byB0dXJuIHRoaW5ncyBvZmYsIG5vZGUgYnkgbm9kZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNJbnNlcnRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5ESVNBQkxFX0lOU0VSVCwgbm9kZSkgPT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZSA9IGZ1bmN0aW9uKHR5cGVOYW1lPzogc3RyaW5nLCBjcmVhdGVBdFRvcD86Ym9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcodHlwZU5hbWUsIGNyZWF0ZUF0VG9wKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0LnNhdmVOZXdOb2RlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjYWxsZWQgdG8gZGlzcGxheSBlZGl0b3IgdGhhdCB3aWxsIGNvbWUgdXAgQkVGT1JFIGFueSBub2RlIGlzIHNhdmVkIG9udG8gdGhlIHNlcnZlciwgc28gdGhhdCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgICAqIGFueSBzYXZlIGlzIHBlcmZvcm1lZCB3ZSB3aWxsIGhhdmUgdGhlIGNvcnJlY3Qgbm9kZSBuYW1lLCBhdCBsZWFzdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgdmVyc2lvbiBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCwgYW5kIGN1cnJlbnRseSB0aGlzIG1lYW5zICdlZGl0aW5nVW5zYXZlZE5vZGUnIGlzIG5vdCBjdXJyZW50bHkgZXZlclxyXG4gICAgICAgICAqIHRyaWdnZXJlZC4gVGhlIG5ldyBhcHByb2FjaCBub3cgdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvICdyZW5hbWUnIG5vZGVzIGlzIHRvIGp1c3QgY3JlYXRlIG9uZSB3aXRoIGFcclxuICAgICAgICAgKiByYW5kb20gbmFtZSBhbiBsZXQgdXNlciBzdGFydCBlZGl0aW5nIHJpZ2h0IGF3YXkgYW5kIHRoZW4gcmVuYW1lIHRoZSBub2RlIElGIGEgY3VzdG9tIG5vZGUgbmFtZSBpcyBuZWVkZWQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIG1lYW5zIGlmIHdlIGNhbGwgdGhpcyBmdW5jdGlvbiAoc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lKSBpbnN0ZWFkIG9mICdzdGFydEVkaXRpbmdOZXdOb2RlKCknXHJcbiAgICAgICAgICogdGhhdCB3aWxsIGNhdXNlIHRoZSBHVUkgdG8gYWx3YXlzIHByb21wdCBmb3IgdGhlIG5vZGUgbmFtZSBiZWZvcmUgY3JlYXRpbmcgdGhlIG5vZGUuIFRoaXMgd2FzIHRoZSBvcmlnaW5hbFxyXG4gICAgICAgICAqIGZ1bmN0aW9uYWxpdHkgYW5kIHN0aWxsIHdvcmtzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDcmVhdGUgc3Vibm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNhdmVOb2RlUmVzcG9uc2UsIHBheWxvYWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLyogYmVjYXN1c2UgSSBkb24ndCB1bmRlcnN0YW5kICdlZGl0aW5nVW5zYXZlZE5vZGUnIHZhcmlhYmxlIGFueSBsb25nZXIgdW50aWwgaSByZWZyZXNoIG15IG1lbW9yeSwgaSB3aWxsIHVzZVxyXG4gICAgICAgICAgICAgICAgdGhlIG9sZCBhcHByb2FjaCBvZiByZWZyZXNoaW5nIGVudGlyZSB0cmVlIHJhdGhlciB0aGFuIG1vcmUgZWZmaWNpZW50IHJlZnJlc25Ob2RlT25QYWdlLCBiZWN1YXNlIGl0IHJlcXVpcmVzXHJcbiAgICAgICAgICAgICAgICB0aGUgbm9kZSB0byBhbHJlYWR5IGJlIG9uIHRoZSBwYWdlLCBhbmQgdGhpcyByZXF1aXJlcyBpbiBkZXB0aCBhbmFseXMgaSdtIG5vdCBnb2luZyB0byBkbyByaWdodCB0aGlzIG1pbnV0ZS5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvL3JlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlID0gZnVuY3Rpb24obW9kZVZhbD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2RlVmFsICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbW9kZVZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMzogcmVhbGx5IGVkaXQgbW9kZSBidXR0b24gbmVlZHMgdG8gYmUgc29tZSBraW5kIG9mIGJ1dHRvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGNhbiBzaG93IGFuIG9uL29mZiBzdGF0ZS5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2luY2UgZWRpdCBtb2RlIHR1cm5zIG9uIGxvdHMgb2YgYnV0dG9ucywgdGhlIGxvY2F0aW9uIG9mIHRoZSBub2RlIHdlIGFyZSB2aWV3aW5nIGNhbiBjaGFuZ2Ugc28gbXVjaCBpdFxyXG4gICAgICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnNhdmVVc2VyUHJlZmVyZW5jZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVVcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlQWJvdmUgPSBnZXROb2RlQWJvdmUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZUFib3ZlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlQWJvdmUubmFtZVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZURvd24gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZUJlbG93OiBqc29uLk5vZGVJbmZvID0gZ2V0Tm9kZUJlbG93KG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVCZWxvdyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUJlbG93Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Ub3AgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wTm9kZSA9IGdldEZpcnN0Q2hpbGROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9wTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogdG9wTm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Cb3R0b20gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYWJvdmUgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIHRvcCBub2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQWJvdmUgPSBmdW5jdGlvbihub2RlKTogYW55IHtcclxuICAgICAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAob3JkaW5hbCA8PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgLSAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBiZWxvdyB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgYm90dG9tIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCZWxvdyA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3JkaW5hbCA9IFwiICsgb3JkaW5hbCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsID09IC0xIHx8IG9yZGluYWwgPj0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsICsgMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEZpcnN0Q2hpbGROb2RlID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJ1bkVkaXROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gZWRpdE5vZGVDbGljazogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Jbml0Tm9kZUVkaXRSZXF1ZXN0LCBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlPihcImluaXROb2RlRWRpdFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgIH0sIGluaXROb2RlRWRpdFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZSA9IGZ1bmN0aW9uKHVpZD86IGFueSwgdHlwZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBwYXJlbnRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGdldCB0aGUgbm9kZSBzZWxlY3RlZCBmb3IgdGhlIGluc2VydCBwb3NpdGlvbiBieSB1c2luZyB0aGUgdWlkIGlmIG9uZSB3YXMgcGFzc2VkIGluIG9yIHVzaW5nIHRoZVxyXG4gICAgICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKHR5cGVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlID0gZnVuY3Rpb24odWlkPzogYW55LCB0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSksIG9yIGFueSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKiBub2RlIGlmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgbm9kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gaGlnaGxpZ2h0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBjcmVhdGVTdWJOb2RlOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZXBseVRvQ29tbWVudCA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGUodWlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3Rpb25zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGNvdWxkIHdyaXRlIGNvZGUgdGhhdCBvbmx5IHNjYW5zIGZvciBhbGwgdGhlIFwiU0VMXCIgYnV0dG9ucyBhbmQgdXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlbSwgYnV0IGZvciBub3dcclxuICAgICAgICAgICAgICogd2UgdGFrZSB0aGUgc2ltcGxlIGFwcHJvYWNoIGFuZCBqdXN0IHJlLXJlbmRlciB0aGUgcGFnZS4gVGhlcmUgaXMgbm8gY2FsbCB0byB0aGUgc2VydmVyLCBzbyB0aGlzIGlzXHJcbiAgICAgICAgICAgICAqIGFjdHVhbGx5IHZlcnkgZWZmaWNpZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIERlbGV0ZSB0aGUgc2luZ2xlIG5vZGUgaWRlbnRpZmllZCBieSAndWlkJyBwYXJhbWV0ZXIgaWYgdWlkIHBhcmFtZXRlciBpcyBwYXNzZWQsIGFuZCBpZiB1aWQgcGFyYW1ldGVyIGlzIG5vdFxyXG4gICAgICAgICAqIHBhc3NlZCB0aGVuIHVzZSB0aGUgbm9kZSBzZWxlY3Rpb25zIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25zIG9uIHRoZSBwYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBkZWxldGUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpID9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3N0RGVsZXRlU2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVOb2Rlc1JlcXVlc3QsIGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZT4oXCJkZWxldGVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBzZWxOb2Rlc0FycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlTm9kZXNSZXNwb25zZSwgbnVsbCwgeyBcInBvc3REZWxldGVTZWxOb2RlXCI6IHBvc3REZWxldGVTZWxOb2RlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgdGhlIG5vZGUgd2Ugd2FudCB0byBzY3JvbGwgdG8gYWZ0ZXIgYSBkZWxldGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICAvKiBVc2UgYSBoYXNobWFwLXR5cGUgYXBwcm9hY2ggdG8gc2F2aW5nIGFsbCBzZWxlY3RlZCBub2RlcyBpbnRvIGEgbG9vdXAgbWFwICovXHJcbiAgICAgICAgICAgIGxldCBub2Rlc01hcDogT2JqZWN0ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQoKTtcclxuICAgICAgICAgICAgbGV0IGJlc3ROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHRha2VOZXh0Tm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLyogbm93IHdlIHNjYW4gdGhlIGNoaWxkcmVuLCBhbmQgdGhlIGxhc3QgY2hpbGQgd2UgZW5jb3VudGVyZCB1cCB1bnRpbCB3ZSBmaW5kIHRoZSByaXN0IG9uZW4gaW4gbm9kZXNNYXAgd2lsbCBiZSB0aGVcclxuICAgICAgICAgICAgbm9kZSB3ZSB3aWxsIHdhbnQgdG8gc2VsZWN0IGFuZCBzY3JvbGwgdGhlIHVzZXIgdG8gQUZURVIgdGhlIGRlbGV0aW5nIGlzIGRvbmUgKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRha2VOZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlzIHRoaXMgbm9kZSBvbmUgdG8gYmUgZGVsZXRlZCAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzTWFwW25vZGUuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZU5leHROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlc3ROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmVzdE5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1dFNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgICAgICBcIkNvbmZpcm0gQ3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkN1dCBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSwgdG8gcGFzdGUvbW92ZSB0byBuZXcgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXNcIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gc2VsTm9kZXNBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkTm9kZXNUb01vdmVTZXQoc2VsTm9kZXNBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgYSB3YXkgdG8gZmluZCBhbGwgc2VsZWN0ZWQgY2hlY2tib3hlcyBpbiB0aGUgZ3VpIGFuZCByZXNldCB0aGVtIGFsbCB0byB1bmNoZWNrZWQgKi9cclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9OyAvLyBjbGVhciBzZWxlY3Rpb25zLlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgd2UgcmVuZGVyIGFnYWluIGFuZCB0aGUgbm9kZXMgdGhhdCB3ZXJlIGN1dCB3aWxsIGRpc2FwcGVhciBmcm9tIHZpZXcgKi9cclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxvYWROb2Rlc1RvTW92ZVNldCA9IGZ1bmN0aW9uKG5vZGVJZHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0W2lkXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFzdGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFBhc3RlXCIsIFwiUGFzdGUgXCIgKyBub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHVuZGVyIHNlbGVjdGVkIHBhcmVudCBub2RlID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzLCBwYXN0ZS5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEZvciBub3csIHdlIHdpbGwganVzdCBjcmFtIHRoZSBub2RlcyBvbnRvIHRoZSBlbmQgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBwYWdlLiBMYXRlciBvbiB3ZSBjYW4gZ2V0IG1vcmUgc3BlY2lmaWMgYWJvdXQgYWxsb3dpbmcgcHJlY2lzZSBkZXN0aW5hdGlvbiBsb2NhdGlvbiBmb3IgbW92ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Nb3ZlTm9kZXNSZXF1ZXN0LCBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlPihcIm1vdmVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Tm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Q2hpbGRJZFwiOiBoaWdobGlnaHROb2RlICE9IG51bGwgPyBoaWdobGlnaHROb2RlLmlkIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IG5vZGVzVG9Nb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbW92ZU5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Qm9va1dhckFuZFBlYWNlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaW5zZXJ0aW5nIHVuZGVyIHdoYXRldmVyIG5vZGUgdXNlciBoYXMgZm9jdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Qm9va1JlcXVlc3QsIGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlPihcImluc2VydEJvb2tcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRydW5jYXRlZFwiOiB1c2VyLmlzVGVzdFVzZXJBY2NvdW50KClcclxuICAgICAgICAgICAgICAgICAgICB9LCBpbnNlcnRCb29rUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZXRhNjQuanNcIik7XHJcblxyXG4vKipcclxuICogTWFpbiBBcHBsaWNhdGlvbiBpbnN0YW5jZSwgYW5kIGNlbnRyYWwgcm9vdCBsZXZlbCBvYmplY3QgZm9yIGFsbCBjb2RlLCBhbHRob3VnaCBlYWNoIG1vZHVsZSBnZW5lcmFsbHkgY29udHJpYnV0ZXMgb25lXHJcbiAqIHNpbmdsZXRvbiB2YXJpYWJsZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCB3aXRoIGEgbmFtZSB1c3VhbGx5IGlkZW50aWNhbCB0byB0aGF0IGZpbGUuXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWV0YTY0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhcHBJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1clVybFBhdGg6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICAgICAgZXhwb3J0IGxldCB1cmxDbWQ6IHN0cmluZztcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjb2RlRm9ybWF0RGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBuZXh0R3VpZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLyogbmFtZSBvZiBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVzZXJOYW1lOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG5cclxuICAgICAgICAvKiBzY3JlZW4gY2FwYWJpbGl0aWVzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZXZpY2VXaWR0aDogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZUhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVc2VyJ3Mgcm9vdCBub2RlLiBUb3AgbGV2ZWwgb2Ygd2hhdCBsb2dnZWQgaW4gdXNlciBpcyBhbGxvd2VkIHRvIHNlZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlSWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZVBhdGg6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc3BlY2lmaWVzIGlmIHRoaXMgaXMgYWRtaW4gdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQWRtaW5Vc2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIGFsd2F5cyBzdGFydCBvdXQgYXMgYW5vbiB1c2VyIHVudGlsIGxvZ2luICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0Fub25Vc2VyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc2lnbmFscyB0aGF0IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHRoZSBuZXh0IHRpbWUgd2UgZ28gdG8gdGhlIG1haW4gdHJlZSB2aWV3IHdpbmRvdyB3ZSBuZWVkIHRvIHJlZnJlc2ggZGF0YVxyXG4gICAgICAgICAqIGZyb20gdGhlIHNlcnZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdHJlZURpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS5pZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLyogTWFwcyBmcm9tIHRoZSBET00gSUQgdG8gdGhlIGVkaXRvciBqYXZhc2NyaXB0IGluc3RhbmNlIChBY2UgRWRpdG9yIGluc3RhbmNlKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWNlRWRpdG9yc0J5SWQ6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBjb3VudGVyIGZvciBsb2NhbCB1aWRzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBuZXh0VWlkOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVW5kZXIgYW55IGdpdmVuIG5vZGUsIHRoZXJlIGNhbiBiZSBvbmUgYWN0aXZlICdzZWxlY3RlZCcgbm9kZSB0aGF0IGhhcyB0aGUgaGlnaGxpZ2h0aW5nLCBhbmQgd2lsbCBiZSBzY3JvbGxlZFxyXG4gICAgICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAgICAgKiBzZWxlY3RlZCBub2RlIChOb2RlSW5mbyBvYmplY3QpXCIsIHdoZXJlIHRoZSBrZXkgaXMgdGhlIHBhcmVudCBub2RlIHVpZCwgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgY3VycmVudGx5XHJcbiAgICAgICAgICogc2VsZWN0ZWQgbm9kZSB3aXRoaW4gdGhhdCBwYXJlbnQuIE5vdGUgdGhpcyAnc2VsZWN0aW9uIHN0YXRlJyBpcyBvbmx5IHNpZ25pZmljYW50IG9uIHRoZSBjbGllbnQsIGFuZCBvbmx5IGZvclxyXG4gICAgICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBVc2VyLXNlbGVjdGFibGUgdXNlci1hY2NvdW50IG9wdGlvbnMgZWFjaCB1c2VyIGNhbiBzZXQgb24gaGlzIGFjY291bnQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IE1PREVfQURWQU5DRUQ6IHN0cmluZyA9IFwiYWR2YW5jZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IE1PREVfU0lNUExFOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgICAgICAvKiBjYW4gYmUgJ3NpbXBsZScgb3IgJ2FkdmFuY2VkJyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE1vZGVPcHRpb246IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9nZ2xlZCBieSBidXR0b24sIGFuZCBob2xkcyBpZiB3ZSBhcmUgZ29pbmcgdG8gc2hvdyBwcm9wZXJ0aWVzIG9yIG5vdCBvbiBlYWNoIG5vZGUgaW4gdGhlIG1haW4gdmlld1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1Byb3BlcnRpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogRmxhZyB0aGF0IGluZGljYXRlcyBpZiB3ZSBhcmUgcmVuZGVyaW5nIHBhdGgsIG93bmVyLCBtb2RUaW1lLCBldGMuIG9uIGVhY2ggcm93ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93TWV0YURhdGE6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBMaXN0IG9mIG5vZGUgcHJlZml4ZXMgdG8gZmxhZyBub2RlcyB0byBub3QgYWxsb3cgdG8gYmUgc2hvd24gaW4gdGhlIHBhZ2UgaW4gc2ltcGxlIG1vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0OiBhbnkgPSB7XHJcbiAgICAgICAgICAgIFwicmVwOlwiOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlYWRPbmx5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5hcnlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgYWxsIG5vZGUgdWlkcyB0byB0cnVlIGlmIHNlbGVjdGVkLCBvdGhlcndpc2UgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBkZWxldGVkIChub3QgZXhpc3RpbmcpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWxlY3RlZE5vZGVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogU2V0IG9mIGFsbCBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZCAoZnJvbSB0aGUgYWJicmV2aWF0ZWQgZm9ybSkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZGVkQWJicmV2Tm9kZUlkczogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIFJlbmRlck5vZGVSZXNwb25zZS5qYXZhIG9iamVjdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVEYXRhOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGFsbCB2YXJpYWJsZXMgZGVyaXZhYmxlIGZyb20gY3VycmVudE5vZGVEYXRhLCBidXQgc3RvcmVkIGRpcmVjdGx5IGZvciBzaW1wbGVyIGNvZGUvYWNjZXNzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZVVpZDogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlSWQ6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZVBhdGg6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIE1hcHMgZnJvbSBndWlkIHRvIERhdGEgT2JqZWN0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXRhT2JqTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGdW5jdGlvbnNCeUpjclR5cGU6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9O1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1c2VyUHJlZmVyZW5jZXM6IGpzb24uVXNlclByZWZlcmVuY2VzID0ge1xyXG4gICAgICAgICAgICBcImVkaXRNb2RlXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiZXhwb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU1haW5NZW51UGFuZWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidWlsZGluZyBtYWluIG1lbnUgcGFuZWxcIik7XHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBDcmVhdGVzIGEgJ2d1aWQnIG9uIHRoaXMgb2JqZWN0LCBhbmQgbWFrZXMgZGF0YU9iak1hcCBhYmxlIHRvIGxvb2sgdXAgdGhlIG9iamVjdCB1c2luZyB0aGF0IGd1aWQgaW4gdGhlXHJcbiAgICAgICAgICogZnV0dXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVnaXN0ZXJEYXRhT2JqZWN0ID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEuZ3VpZCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ndWlkID0gKytuZXh0R3VpZDtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmpNYXBbZGF0YS5ndWlkXSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T2JqZWN0QnlHdWlkID0gZnVuY3Rpb24oZ3VpZCkge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gZGF0YU9iak1hcFtndWlkXTtcclxuICAgICAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YSBvYmplY3Qgbm90IGZvdW5kOiBndWlkPVwiICsgZ3VpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgY2FsbGJhY2sgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgYSBzY3JpcHQgdG8gcnVuLCBvciBpZiBpdCdzIGEgZnVuY3Rpb24gb2JqZWN0IHRoYXQgd2lsbCBiZVxyXG4gICAgICAgICAqIHRoZSBmdW5jdGlvbiB0byBydW4uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBXaGVuZXZlciB3ZSBhcmUgYnVpbGRpbmcgYW4gb25DbGljayBzdHJpbmcsIGFuZCB3ZSBoYXZlIHRoZSBhY3R1YWwgZnVuY3Rpb24sIHJhdGhlciB0aGFuIHRoZSBuYW1lIG9mIHRoZVxyXG4gICAgICAgICAqIGZ1bmN0aW9uIChpLmUuIHdlIGhhdmUgdGhlIGZ1bmN0aW9uIG9iamVjdCBhbmQgbm90IGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIHdlIGhhbmRlIHRoYXQgYnkgYXNzaWduaW5nIGEgZ3VpZFxyXG4gICAgICAgICAqIHRvIHRoZSBmdW5jdGlvbiBvYmplY3QsIGFuZCB0aGVuIGVuY29kZSBhIGNhbGwgdG8gcnVuIHRoYXQgZ3VpZCBieSBjYWxsaW5nIHJ1bkNhbGxiYWNrLiBUaGVyZSBpcyBhIGxldmVsIG9mXHJcbiAgICAgICAgICogaW5kaXJlY3Rpb24gaGVyZSwgYnV0IHRoaXMgaXMgdGhlIHNpbXBsZXN0IGFwcHJvYWNoIHdoZW4gd2UgbmVlZCB0byBiZSBhYmxlIHRvIG1hcCBmcm9tIGEgc3RyaW5nIHRvIGFcclxuICAgICAgICAgKiBmdW5jdGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGN0eD1jb250ZXh0LCB3aGljaCBpcyB0aGUgJ3RoaXMnIHRvIGNhbGwgd2l0aCBpZiB3ZSBoYXZlIGEgZnVuY3Rpb24sIGFuZCBoYXZlIGEgJ3RoaXMnIGNvbnRleHQgdG8gYmluZCB0byBpdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHBheWxvYWQgaXMgYW55IGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gYmUgcGFzc2VkIGF0IHJ1bnRpbWVcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vdGU6IGRvZXNuJ3QgY3VycmVudGx5IHN1cHBvcnQgaGF2aW5nbiBhIG51bGwgY3R4IGFuZCBub24tbnVsbCBwYXlsb2FkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZW5jb2RlT25DbGljayA9IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSwgcGF5bG9hZD86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY3R4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF5bG9hZFN0ciA9IHBheWxvYWQgPyBwYXlsb2FkLmd1aWQgOiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibTY0Lm1ldGE2NC5ydW5DYWxsYmFjayhcIiArIGNhbGxiYWNrLmd1aWQgKyBcIixcIiArIGN0eC5ndWlkICsgXCIsXCIgKyBwYXlsb2FkU3RyICsgXCIpO1wiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJtNjQubWV0YTY0LnJ1bkNhbGxiYWNrKFwiICsgY2FsbGJhY2suZ3VpZCArIFwiKTtcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5leHBlY3RlZCBjYWxsYmFjayB0eXBlIGluIGVuY29kZU9uQ2xpY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBydW5DYWxsYmFjayA9IGZ1bmN0aW9uKGd1aWQsIGN0eCwgcGF5bG9hZCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YU9iaiA9IGdldE9iamVjdEJ5R3VpZChndWlkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gb2JqZWN0LCB3ZSBleHBlY3QgaXQgdG8gaGF2ZSBhICdjYWxsYmFjaycgcHJvcGVydHlcclxuICAgICAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGlmIChkYXRhT2JqLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gb3IgZWxzZSBzb21ldGltZXMgdGhlIHJlZ2lzdGVyZWQgb2JqZWN0IGl0c2VsZiBpcyB0aGUgZnVuY3Rpb24sXHJcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIG9rIHRvb1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXogPSBnZXRPYmplY3RCeUd1aWQoY3R4KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF5bG9hZE9iaiA9IHBheWxvYWQgPyBnZXRPYmplY3RCeUd1aWQocGF5bG9hZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbCh0aGl6LCBwYXlsb2FkT2JqKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iaigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmFibGUgdG8gZmluZCBjYWxsYmFjayBvbiByZWdpc3RlcmVkIGd1aWQ6IFwiICsgZ3VpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVkaXRNb2RlT3B0aW9uID09PSBNT0RFX1NJTVBMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBnb1RvTWFpblBhZ2UodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdvVG9NYWluUGFnZSA9IGZ1bmN0aW9uKHJlcmVuZGVyPzogYm9vbGVhbiwgZm9yY2VTZXJ2ZXJSZWZyZXNoPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKGZvcmNlU2VydmVyUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgdHJlZURpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcmVuZGVyIHx8IHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCByZS1yZW5kZXJpbmcgcGFnZSAoZWl0aGVyIGZyb20gc2VydmVyLCBvciBmcm9tIGxvY2FsIGRhdGEsIHRoZW4gd2UganVzdCBuZWVkIHRvIGxpdHRlcmFsbHkgc3dpdGNoXHJcbiAgICAgICAgICAgICAqIHBhZ2UgaW50byB2aXNpYmxlLCBhbmQgc2Nyb2xsIHRvIG5vZGUpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWxlY3RUYWIgPSBmdW5jdGlvbihwYWdlTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgaXJvblBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBjb2RlIGNhbiBiZSBtYWRlIG1vcmUgRFJZLCBidXQgaSdtIGp1c3QgdHJ5aW5nIGl0IG91dCBmb3Igbm93LCBzbyBpJ20gbm90IGJvdGhlcmluZyB0byBwZXJmZWN0IGl0IHlldC4gKi9cclxuICAgICAgICAgICAgLy8gJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvLyAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gaWYgKHBhZ2VOYW1lID09ICdtYWluVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICdzZWFyY2hUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAndGltZWxpbmVUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGRhdGEgKGlmIHByb3ZpZGVkKSBtdXN0IGJlIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgZGlhbG9nLCBhbmQgYWxsIHRoZSBkaWFsb2dcclxuICAgICAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgICAgICogT09QIHdpdGggJ3RoaXMnIGJlaW5nIGZpcnN0IHBhcmFtZXRlciBhbHdheXMpLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZVBhZ2UgPSBmdW5jdGlvbihwZz86IGFueSwgZGF0YT86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBnLnRhYklkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvb3BzLCB3cm9uZyBvYmplY3QgdHlwZSBwYXNzZWQgdG8gY2hhbmdlUGFnZSBmdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHVzaW5nIG1haW5Jcm9uUGFnZXM/PyAqL1xyXG4gICAgICAgICAgICB2YXIgcGFwZXJUYWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpOyAvL1wiI21haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9kZUJsYWNrTGlzdGVkID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIWluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIG5vZGUubmFtZS5zdGFydHNXaXRoKHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlVWlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6c3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbEFycmF5LnB1c2godWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICBSZXR1cm5zIGEgbmV3bHkgY2xvbmVkIGFycmF5IG9mIGFsbCB0aGUgc2VsZWN0ZWQgbm9kZXMgZWFjaCB0aW1lIGl0J3MgY2FsbGVkLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVJZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OnN0cmluZ1tdID0gW10sIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBzZWxlY3RlZCBub2Rlcy5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXkucHVzaChub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJuIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIGVhY2ggTm9kZUluZm8gd2hlcmUgdGhlIGtleSBpcyB0aGUgaWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQgPSBmdW5jdGlvbigpOiBPYmplY3Qge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSB0aGlzLmdldFNlbGVjdGVkTm9kZXNBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXRbc2VsQXJyYXlbaV0uaWRdID0gc2VsQXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgc2VsZWN0ZWQgbm9kZXMgYXMgTm9kZUluZm8uamF2YSBvYmplY3RzIGFycmF5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXJyYXkgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGVkTm9kZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzLCBub2RlKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1pbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXIgPT09IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IG93bmVyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxtID0gJChcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktb3RoZXJcIiwgXCJjcmVhdGVkLWJ5LW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBSZXR1cm5zIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIG5vZGUuaWQgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVGcm9tSWQgPSBmdW5jdGlvbihpZDogc3RyaW5nKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZFRvTm9kZU1hcFtpZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhdGhPZlVpZCA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEhpZ2hsaWdodGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dCeUlkID0gZnVuY3Rpb24oaWQsIHNjcm9sbCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaWdobGlnaHRSb3dCeUlkIGZhaWxlZCB0byBmaW5kIGlkOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2Nyb2xsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBkb25lSGlnaGxpZ2h0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICAgICAgbGV0IGN1ckhpZ2hsaWdodGVkTm9kZToganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgPT09IG5vZGUudWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbHJlYWR5IGhpZ2hsaWdodGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkID0gY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkb25lSGlnaGxpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF0gPSBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZDogc3RyaW5nID0gbm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG06IHN0cmluZyA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJvd0VsbSB8fCByb3dFbG0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmaW5kIHJvd0VsZW1lbnQgdG8gaGlnaGxpZ2h0OiBcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlYWxseSBuZWVkIHRvIHVzZSBwdWIvc3ViIGV2ZW50IHRvIGJyb2FkY2FzdCBlbmFibGVtZW50LCBhbmQgbGV0IGVhY2ggY29tcG9uZW50IGRvIHRoaXMgaW5kZXBlbmRlbnRseSBhbmRcclxuICAgICAgICAgKiBkZWNvdXBsZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVJc01pbmU6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlIT1udWxsICYmIChoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gdXNlck5hbWUgfHwgXCJhZG1pblwiID09PSB1c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGxldCBob21lTm9kZVNlbGVjdGVkOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSE9bnVsbCAmJiBob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGxldCBpbXBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5pbXBvcnRBbGxvd2VkO1xyXG4gICAgICAgICAgICBsZXQgZXhwb3J0RmVhdHVyZUVuYWJsZWQgPSBpc0FkbWluVXNlciB8fCB1c2VyUHJlZmVyZW5jZXMuZXhwb3J0QWxsb3dlZDtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE9yZGluYWw6IG51bWJlciA9IGdldE9yZGluYWxPZk5vZGUoaGlnaGxpZ2h0Tm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBudW1DaGlsZE5vZGVzOiBudW1iZXIgPSBnZXROdW1DaGlsZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSBoaWdobGlnaHRPcmRpbmFsID4gMCAmJiBudW1DaGlsZE5vZGVzID4gMTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gaGlnaGxpZ2h0T3JkaW5hbCA8IG51bUNoaWxkTm9kZXMgLSAxICYmIG51bUNoaWxkTm9kZXMgPiAxO1xyXG5cclxuICAgICAgICAgICAgLy90b2RvLTA6IG5lZWQgdG8gYWRkIHRvIHRoaXMgc2VsTm9kZUlzTWluZSB8fCBzZWxQYXJlbnRJc01pbmU7XHJcbiAgICAgICAgICAgIGxldCBjYW5DcmVhdGVOb2RlID0gdXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIChpc0FkbWluVXNlciB8fCAoIWlzQW5vblVzZXIgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbmFibGVtZW50OiBpc0Fub25Vc2VyPVwiICsgaXNBbm9uVXNlciArIFwiIHNlbE5vZGVDb3VudD1cIiArIHNlbE5vZGVDb3VudCArIFwiIHNlbE5vZGVJc01pbmU9XCIgKyBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wc1RvZ2dsZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBwcm9wc1RvZ2dsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImN1dFNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicGFzdGVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVTZWxlY3RlZCkpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVVcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBjYW5DcmVhdGVOb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSE9bnVsbCAmJiBob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQpKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0RmVhdHVyZUVuYWJsZWQgJiYgKHNlbE5vZGVJc01pbmUgfHwgKGhpZ2hsaWdodE5vZGUhPW51bGwgJiYgaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkKSkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIC8vVG9wIExldmVsIE1lbnUgVmlzaWJpbGl0eVxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2luZ2xlU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZztcclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQgYSBzaW5nbGUgU2VsIE5vZGVJRDogXCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T3JkaW5hbE9mTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE51bUNoaWxkTm9kZXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0Q3VycmVudE5vZGVEYXRhID0gZnVuY3Rpb24oZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZURhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGRhdGEubm9kZTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVVaWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUlkID0gZGF0YS5ub2RlLmlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVBhdGggPSBkYXRhLm5vZGUucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLnJlbmRlck5vZGVSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW1vdmVCaW5hcnlCeVVpZCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzQmluYXJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdXBkYXRlcyBjbGllbnQgc2lkZSBtYXBzIGFuZCBjbGllbnQtc2lkZSBpZGVudGlmaWVyIGZvciBuZXcgbm9kZSwgc28gdGhhdCB0aGlzIG5vZGUgaXMgJ3JlY29nbml6ZWQnIGJ5IGNsaWVudFxyXG4gICAgICAgICAqIHNpZGUgY29kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCB1cGRhdGVNYXBzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBhc3NpZ24gYSBwcm9wZXJ0eSBmb3IgZGV0ZWN0aW5nIHRoaXMgbm9kZSB0eXBlLCBJJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiB1c2luZyBzb21lIGtpbmQgb2YgY3VzdG9tIEpTXHJcbiAgICAgICAgICAgICAqIHByb3RvdHlwZS1yZWxhdGVkIGFwcHJvYWNoXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHVwZGF0ZU1hcHMgPyB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBGb3IgdGhlc2UgdHdvIHByb3BlcnRpZXMgdGhhdCBhcmUgYWNjZXNzZWQgZnJlcXVlbnRseSB3ZSBnbyBhaGVhZCBhbmQgbG9va3VwIHRoZSBwcm9wZXJ0aWVzIGluIHRoZVxyXG4gICAgICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgICAgICogc2ltcGxpZnkgY29kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuTEFTVF9NT0RJRklFRCwgbm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZU1hcHMpIHtcclxuICAgICAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgaWRUb05vZGVNYXBbbm9kZS5pZF0gPSBub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRDb25zdGFudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBPTElDWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwocmVhZE9ubHlQcm9wZXJ0eUxpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoYmluYXJ5UHJvcGVydHlMaXN0LCBbamNyQ25zdC5CSU5fREFUQV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXRBcHAgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBhcHBJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgIHRhYnMuYWRkRXZlbnRMaXN0ZW5lcihcImlyb24tc2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGFiQ2hhbmdlRXZlbnQodGFicy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5pdENvbnN0YW50cygpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2lnbnVwTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdG9kby0zOiBob3cgZG9lcyBvcmllbnRhdGlvbmNoYW5nZSBuZWVkIHRvIHdvcmsgZm9yIHBvbHltZXI/IFBvbHltZXIgZGlzYWJsZWRcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgXy5vcmllbnRhdGlvbkhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTGVhdmUgTWV0YTY0ID9cIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJIHRob3VnaHQgdGhpcyB3YXMgYSBnb29kIGlkZWEsIGJ1dCBhY3R1YWxseSBpdCBkZXN0cm95cyB0aGUgc2Vzc2lvbiwgd2hlbiB0aGUgdXNlciBpcyBlbnRlcmluZyBhblxyXG4gICAgICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgICAgICogZ29pbmcgdG8gYSBkaWZmZXJlbnQgdXJsIHNob3VsZG4ndCBibG93IHVwIHRoZSBzZXNzaW9uLCB3aGljaCBpcyB3aGF0ICdsb2dvdXQnIGRvZXMuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBkZXZpY2VXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICBkZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIGZvciBzY3JlZW4gc2l6ZSBpbiBhIHRpbWVyLiBXZSBkb24ndCB3YW50IHRvIG1vbml0b3IgYWN0dWFsIHNjcmVlbiByZXNpemUgZXZlbnRzIGJlY2F1c2UgaWYgYSB1c2VyXHJcbiAgICAgICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGEgdGhyb3R0bGUgc29ydCBvZi4gWWVzIEkga25vdyBob3cgdG8gbGlzdGVuIGZvciBldmVudHMuIE5vIEknbSBub3QgZG9pbmcgaXQgd3JvbmcgaGVyZS4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyB2YXIgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uc2NyZWVuU2l6ZUNoYW5nZSgpOyB9IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuaW5pdFByb2dyZXNzTW9uaXRvcigpO1xyXG5cclxuICAgICAgICAgICAgcHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9jZXNzVXJsUGFyYW1zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgICAgIGlmIChwYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXJsQ21kID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJjbWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hUYWJBY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5U2lnbnVwTWVzc2FnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2lnbnVwUmVzcG9uc2UgPSAkKFwiI3NpZ251cENvZGVSZXNwb25zZVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTaWdudXAgY29tcGxldGUuIFlvdSBtYXkgbm93IGxvZ2luLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUoY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBEb24ndCBuZWVkIHRoaXMgbWV0aG9kIHlldCwgYW5kIGhhdmVuJ3QgdGVzdGVkIHRvIHNlZSBpZiB3b3JrcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJykge1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9hZEFub25QYWdlSG9tZSA9IGZ1bmN0aW9uKGlnbm9yZVVybCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Bbm9uUGFnZUxvYWRSZXF1ZXN0LCBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlPihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlnbm9yZVVybFwiOiBpZ25vcmVVcmxcclxuICAgICAgICAgICAgfSwgYW5vblBhZ2VMb2FkUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlVXNlclByZWZlcmVuY2VzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHVzZXJQcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk9wZW5TeXN0ZW1GaWxlUmVxdWVzdCwganNvbi5PcGVuU3lzdGVtRmlsZVJlc3BvbnNlPihcIm9wZW5TeXN0ZW1GaWxlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogZmlsZU5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0b2RvLTA6IGZvciBub3cgSSdsbCBqdXN0IGRyb3AgdGhpcyBpbnRvIGEgZ2xvYmFsIHZhcmlhYmxlLiBJIGtub3cgdGhlcmUncyBhIGJldHRlciB3YXkuIFRoaXMgaXMgdGhlIG9ubHkgdmFyaWFibGVcclxud2UgaGF2ZSBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgYW5kIGlzIG9ubHkgcmVxdWlyZWQgZm9yIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uIGluIEpTIG9uIHRoZSBpbmRleC5odG1sIHBhZ2UgKi9cclxuaWYgKCF3aW5kb3dbXCJtZXRhNjRcIl0pIHtcclxuICAgIHZhciBtZXRhNjQgPSBtNjQubWV0YTY0O1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBuYXYge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1haW5PZmZzZXQ6bnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgdGhpcyB2YWx1ZSBwYXNzZWQgZnJvbSBzZXJ2ZXIgcmF0aGVyIHRoYW4gY29kZWQgaW4gVHlwZVNjcmlwdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUk9XU19QRVJfUEFHRTpudW1iZXIgPSAyNTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTWFpbk1lbnVIZWxwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL21ldGE2NC9wdWJsaWMvaGVscFwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIiA6IG1haW5PZmZzZXRcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Sc3NGZWVkc05vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvcnNzL2ZlZWRzXCIsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiIDogbWFpbk9mZnNldFxyXG4gICAgICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZXhwYW5kTW9yZSA9IGZ1bmN0aW9uKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvKiBJJ20gc2V0dGluZyB0aGlzIGhlcmUgc28gdGhhdCB3ZSBjYW4gY29tZSB1cCB3aXRoIGEgd2F5IHRvIG1ha2UgdGhlIGFiYnJldiBleHBhbmQgc3RhdGUgYmUgcmVtZW1iZXJlZCwgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMgaXMgbG93ZXIgcHJpb3JpdHkgZm9yIG5vdywgc28gaSdtIG5vdCB1c2luZyBpdCB5ZXQgKi9cclxuICAgICAgICAgICAgbWV0YTY0LmV4cGFuZGVkQWJicmV2Tm9kZUlkc1tub2RlSWRdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3QsIGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2U+KFwiZXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZFxyXG4gICAgICAgICAgICB9LCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwYW5kQWJicmV2aWF0ZWROb2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJWQUw6IFwiK0pTT04uc3RyaW5naWZ5KHJlcy5ub2RlSW5mbykpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlSW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGlzcGxheWluZ0hvbWUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50VmlzaWJsZVRvVXNlciA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIWRpc3BsYXlpbmdIb21lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwTGV2ZWxSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIGlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghcmVzIHx8ICFyZXMubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gZGF0YSBpcyB2aXNpYmxlIHRvIHlvdSBhYm92ZSB0aGlzIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZChpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZVcExldmVsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcmVudFZpc2libGVUb1VzZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBhdCByb290LiBDYW4ndCBnbyB1cC5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogdG9kby0wOiBmb3Igbm93IGFuIHVwbGV2ZWwgd2lsbCByZXNldCB0byB6ZXJvIG9mZnNldCwgYnV0IGV2ZW50dWFsbHkgSSB3YW50IHRvIGhhdmUgZWFjaCBsZXZlbCBvZiB0aGUgdHJlZSwgYmUgYWJsZSB0b1xyXG4gICAgICAgICAgICByZW1lbWJlciB3aGljaCBvZmZzZXQgaXQgd2FzIGF0IHNvIHdoZW4gdXNlciBkcmlsbHMgZG93biwgYW5kIHRoZW4gY29tZXMgYmFjayBvdXQsIHRoZXkgcGFnZSBiYWNrIG91dCBmcm9tIHRoZSBzYW1lIHBhZ2VzIHRoZXlcclxuICAgICAgICAgICAgZHJpbGxlZCBkb3duIGZyb20gKi9cclxuICAgICAgICAgICAgbWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogMSxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIiA6IG1haW5PZmZzZXRcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBMZXZlbFJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZERvbUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIitub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZFBvbHlFbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kVGhyb3coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tPbk5vZGVSb3cgcmVjaWV2ZWQgdWlkIHRoYXQgZG9lc24ndCBtYXAgdG8gYW55IG5vZGUuIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vbi1udWxsIGl0J3MgYWxyZWFkeSBkaXNwbGF5aW5nIGFuZCB3ZSBkbyBub3RoaW5nLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgdXBkYXRlTm9kZUluZm9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTm9kZSA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG5vZGUuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAgICAgKiBzaWxseSBsb29raW5nIGFzeW5jIHRpbWVyIGhlcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246IGFueSA9IHV0aWwucG9seUVsbSh1aWQgKyBcIl9zZWxcIik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlBhZ2VOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuaG9tZU5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib2Zmc2V0XCI6IG1haW5PZmZzZXRcclxuICAgICAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlB1YmxpY0hvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHByZWZzLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHByZWZzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DbG9zZUFjY291bnRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xvc2VBY2NvdW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9oIE5vIVwiLCBcIkNsb3NlIHlvdXIgQWNjb3VudD88cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGVsZXRlQWxsVXNlckNvb2tpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DbG9zZUFjY291bnRSZXF1ZXN0LCBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlPihcImNsb3NlQWNjb3VudFwiLCB7fSwgY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJvcHMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJvcHMge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9yZGVyUHJvcHMgPSBmdW5jdGlvbihwcm9wT3JkZXI6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHNOZXc6IGpzb24uUHJvcGVydHlJbmZvW10gPSBwcm9wcy5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SWR4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wT3JkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldElkeCA9IG1vdmVOb2RlUG9zaXRpb24ocHJvcHNOZXcsIHRhcmdldElkeCwgcHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtb3ZlTm9kZVBvc2l0aW9uID0gZnVuY3Rpb24ocHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10sIGlkeDogbnVtYmVyLCB0eXBlTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgbGV0IHRhZ0lkeDogbnVtYmVyID0gcHJvcHMuaW5kZXhPZkl0ZW1CeVByb3AoXCJuYW1lXCIsIHR5cGVOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHMuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIGlkeCsrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUb2dnbGVzIGRpc3BsYXkgb2YgcHJvcGVydGllcyBpbiB0aGUgZ3VpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcHNUb2dnbGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICAvLyBzZXREYXRhSWNvblVzaW5nSWQoXCIjZWRpdE1vZGVCdXR0b25cIiwgZWRpdE1vZGUgPyBcImVkaXRcIiA6XHJcbiAgICAgICAgICAgIC8vIFwiZm9yYmlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgICAgIC8vIHZhciBlbG0gPSAkKFwiI3Byb3BzVG9nZ2xlQnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAvLyBlbG0udG9nZ2xlQ2xhc3MoXCJ1aS1pY29uLWdyaWRcIiwgbWV0YTY0LnNob3dQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IGVkaXQuZWRpdE5vZGUucHJvcGVydGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaWNlIGlzIGhvdyB5b3UgZGVsZXRlIGFycmF5IGVsZW1lbnRzIGluIGpzLlxyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU29ydHMgcHJvcHMgaW5wdXQgYXJyYXkgaW50byB0aGUgcHJvcGVyIG9yZGVyIHRvIHNob3cgZm9yIGVkaXRpbmcuIFNpbXBsZSBhbGdvcml0aG0gZmlyc3QgZ3JhYnMgJ2pjcjpjb250ZW50J1xyXG4gICAgICAgICAqIG5vZGUgYW5kIHB1dHMgaXQgb24gdGhlIHRvcCwgYW5kIHRoZW4gZG9lcyBzYW1lIGZvciAnamN0Q25zdC5UQUdTJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYyhub2RlLCBwcm9wcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgICAgIG1vdmVQcm9wc1RvVG9wKFtqY3JDbnN0LkNPTlRFTlQsIGpjckNuc3QuVEFHU10sIHByb3BzTmV3KTtcclxuICAgICAgICAgICAgbW92ZVByb3BzVG9FbmQoW2pjckNuc3QuQ1JFQVRFRCwgamNyQ25zdC5DUkVBVEVEX0JZLCBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWV0sIHByb3BzTmV3KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIE1vdmVzIGFsbCB0aGUgcHJvcGVydGllcyBsaXN0ZWQgaW4gcHJvcExpc3QgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCBrZWVwcyB0aGVtIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgKi9cclxuICAgICAgICBsZXQgbW92ZVByb3BzVG9Ub3AgPSBmdW5jdGlvbihwcm9wc0xpc3Q6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZ0lkeCA9IHByb3BzLmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBwcm9wKTtcclxuICAgICAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hcnJheU1vdmVJdGVtKHRhZ0lkeCwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIE1vdmVzIGFsbCB0aGUgcHJvcGVydGllcyBsaXN0ZWQgaW4gcHJvcExpc3QgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCBrZWVwcyB0aGVtIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgKi9cclxuICAgICAgICBsZXQgbW92ZVByb3BzVG9FbmQgPSBmdW5jdGlvbihwcm9wc0xpc3Q6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZ0lkeCA9IHByb3BzLmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBwcm9wKTtcclxuICAgICAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5hcnJheU1vdmVJdGVtKHRhZ0lkeCwgcHJvcHMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbCBvciBhIGxpc3Qgb2YgUHJvcGVydHlJbmZvIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHJvcGVydGllcyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFibGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wZXJ0eS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRkOiBzdHJpbmcgPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtbmFtZS1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcGVydHkubmFtZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCaW5hcnlQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBcIltiaW5hcnldXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcmVuZGVyLndyYXBIdG1sKHByb3BlcnR5LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHByb3BzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRkICs9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS12YWwtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlICs9IHJlbmRlci50YWcoXCJ0clwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1yb3dcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3BlcnR5Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wQ291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwidGFibGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wZXJ0eS10YWJsZVwiXHJcbiAgICAgICAgICAgICAgICB9LCB0YWJsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGJydXRlIGZvcmNlIHNlYXJjaGVzIG9uIG5vZGUgKE5vZGVJbmZvLmphdmEpIG9iamVjdCBwcm9wZXJ0aWVzIGxpc3QsIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBwcm9wZXJ0eVxyXG4gICAgICAgICAqIChQcm9wZXJ0eUluZm8uamF2YSkgd2l0aCBuYW1lIG1hdGNoaW5nIHByb3BlcnR5TmFtZSwgZWxzZSBudWxsLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKToganNvbi5Qcm9wZXJ0eUluZm8ge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucHJvcGVydGllcylcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IG5vZGUucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgPT09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHlWYWwgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBnZXROb2RlUHJvcGVydHkocHJvcGVydHlOYW1lLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3AgPyBwcm9wLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVzIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGtub3cgd2hvIG93bnMgdGhpcyBub2RlIGFzc3VtZSB0aGUgYWRtaW4gb3ducyBpdC5cclxuICAgICAgICAgICAgaWYgKCFjcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRCeSA9IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyBPUiBjb25kaXRpb24gYmVjYXVzZSBvZiBjcmVhdGVkQnkgaXMgbnVsbCB3ZSBhc3N1bWUgd2UgZG8gbm90IG93biBpdCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc093bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgYSBzaW5nbGUtdmFsdWUgdHlwZSBwcm9wZXJ0eSAqL1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHByb3BlcnR5IGlzIG1pc3NpbmcgcmV0dXJuIGVtcHR5IHN0cmluZyAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZSB8fCBwcm9wZXJ0eS52YWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiBlbHNlIHJlbmRlciBtdWx0aS12YWx1ZSBwcm9wZXJ0eSAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICQuZWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGNuc3QuQlI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcmVuZGVyLmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgcG9zdFRhcmdldFVybDtcclxuZGVjbGFyZSB2YXIgcHJldHR5UHJpbnQ7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcmVuZGVyIHtcclxuICAgICAgICBsZXQgZGVidWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBjb250ZW50IGRpc3BsYXllZCB3aGVuIHRoZSB1c2VyIHNpZ25zIGluLCBhbmQgd2Ugc2VlIHRoYXQgdGhleSBoYXZlIG5vIGNvbnRlbnQgYmVpbmcgZGlzcGxheWVkLiBXZVxyXG4gICAgICAgICAqIHdhbnQgdG8gZ2l2ZSB0aGVtIHNvbWUgaW5zdHJ1Y3Rpb25zIGFuZCB0aGUgYWJpbGl0eSB0byBhZGQgY29udGVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgZ2V0RW1wdHlQYWdlUHJvbXB0ID0gZnVuY3Rpb24oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPHA+VGhlcmUgYXJlIG5vIHN1Ym5vZGVzIHVuZGVyIHRoaXMgbm9kZS4gPGJyPjxicj5DbGljayAnRURJVCBNT0RFJyBhbmQgdGhlbiB1c2UgdGhlICdBREQnIGJ1dHRvbiB0byBjcmVhdGUgY29udGVudC48L3A+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQmluYXJ5ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGUuYmluYXJ5SXNJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VJbWFnZVRhZyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgYW4gaW1hZ2Ugd2UgcmVuZGVyIGEgbGluayB0byB0aGUgYXR0YWNobWVudCwgc28gdGhhdCBpdCBjYW4gYmUgZG93bmxvYWRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuY2hvcjogc3RyaW5nID0gdGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJocmVmXCI6IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpXHJcbiAgICAgICAgICAgICAgICB9LCBcIltEb3dubG9hZCBBdHRhY2htZW50XVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYmluYXJ5LWxpbmtcIlxyXG4gICAgICAgICAgICAgICAgfSwgYW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQgbGl0dGxlIG1ldGhvZCBoZXJlLiBBbGwgR1VJIHBhZ2UvZGl2cyBhcmUgY3JlYXRlZCB1c2luZyB0aGlzIHNvcnQgb2Ygc3BlY2lmaWNhdGlvbiBoZXJlIHRoYXQgdGhleVxyXG4gICAgICAgICAqIGFsbCBtdXN0IGhhdmUgYSAnYnVpbGQnIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCBmaXJzdCB0aW1lIG9ubHksIGFuZCB0aGVuIHRoZSAnaW5pdCcgbWV0aG9kIGNhbGxlZCBiZWZvcmUgZWFjaFxyXG4gICAgICAgICAqIHRpbWUgdGhlIGNvbXBvbmVudCBnZXRzIGRpc3BsYXllZCB3aXRoIG5ldyBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmICdkYXRhJyBpcyBwcm92aWRlZCwgdGhpcyBpcyB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpZFBhZ2UgPSBmdW5jdGlvbihwZywgZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkUGFnZTogcGcuZG9tSWQ9XCIgKyBwZy5kb21JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBnLmJ1aWx0IHx8IGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHBnLmJ1aWxkKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGcuaW5pdCkge1xyXG4gICAgICAgICAgICAgICAgcGcuaW5pdChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlsZFJvd0hlYWRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoOiBib29sZWFuLCBzaG93TmFtZTogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhlYWRlclRleHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXYgY2xhc3M9J3BhdGgtZGlzcGxheSc+UGF0aDogXCIgKyBmb3JtYXRQYXRoKG5vZGUpICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXY+XCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChjb21tZW50QnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNvbW1lbnQgQnk6IFwiICsgY29tbWVudEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5jcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKG5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5DcmVhdGVkIEJ5OiBcIiArIG5vZGUuY3JlYXRlZEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBpZD0nb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCArIFwiJz48L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIiAgTW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBjb21tZW50aW5nOiBJIGRlY2lkZWQgdXNlcnMgd2lsbCB1bmRlcnN0YW5kIHRoZSBwYXRoIGFzIGEgc2luZ2xlIGxvbmcgZW50aXR5IHdpdGggbGVzcyBjb25mdXNpb24gdGhhblxyXG4gICAgICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIk5hbWU6IFwiICsgbm9kZS5uYW1lICsgXCIgW3VpZD1cIiArIG5vZGUudWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhlYWRlci10ZXh0XCJcclxuICAgICAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyVGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUGVnZG93biBtYXJrZG93biBwcm9jZXNzb3Igd2lsbCBjcmVhdGUgPGNvZGU+IGJsb2NrcyBhbmQgdGhlIGNsYXNzIGlmIHByb3ZpZGVkLCBzbyBpbiBvcmRlciB0byBnZXQgZ29vZ2xlXHJcbiAgICAgICAgICogcHJldHRpZmllciB0byBwcm9jZXNzIGl0IHRoZSByZXN0IG9mIHRoZSB3YXkgKHdoZW4gd2UgY2FsbCBwcmV0dHlQcmludCgpIGZvciB0aGUgd2hvbGUgcGFnZSkgd2Ugbm93IHJ1blxyXG4gICAgICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmplY3RDb2RlRm9ybWF0dGluZyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghY29udGVudCkgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgICAgIC8vIGBgYGpzXHJcbiAgICAgICAgICAgIC8vIHZhciB4ID0gMTA7XHJcbiAgICAgICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgICAgIC8vIGBgYFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBpZiAoY29udGVudC5jb250YWlucyhcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbmNvZGVMYW5ndWFnZXMoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPC9jb2RlPlwiLCBcIjwvcHJlPlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdFN1YnN0aXR1dGlvbnMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudC5yZXBsYWNlQWxsKFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbmNvZGVMYW5ndWFnZXMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICAgICAqIHNvbWV3aGVyZSwgYW5kIGZpbGwgb3V0IGEgbG90IG1vcmUgZmlsZSB0eXBlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjxjb2RlIGNsYXNzPVxcXCJcIiArIGxhbmdzW2ldICsgXCJcXFwiPlwiLCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGU+XCIsIFwiPHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWZ0ZXIgYSBwcm9wZXJ0eSwgb3Igbm9kZSBpcyB1cGRhdGVkIChzYXZlZCkgd2UgY2FuIG5vdyBjYWxsIHRoaXMgbWV0aG9kIGluc3RlYWQgb2YgcmVmcmVzaGluZyB0aGUgZW50aXJlIHBhZ2VcclxuICAgICAgICB3aGljaCBpcyB3aGF0J3MgZG9uZSBpbiBtb3N0IG9mIHRoZSBhcHAsIHdoaWNoIGlzIG11Y2ggbGVzcyBlZmZpY2llbnQgYW5kIHNuYXBweSB2aXN1YWxseSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaE5vZGVPblBhZ2UgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBsb29rdXAgdWlkIGZyb20gTm9kZUluZm8uaWQgdGhlbiBzZXQgdGhlIGNvbnRlbnQgb2YgdGhpcyBkaXYuXHJcbiAgICAgICAgICAgIC8vXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgLy90byB0aGUgdmFsdWUgZnJvbSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtZXRhNjQuaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZUlkIFwiICsgbm9kZS5pZCArIFwiIGluIHVpZCBtYXBcIjtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHVpZCAhPSBub2RlLnVpZCkgdGhyb3cgXCJ1aWQgY2hhbmdlZCB1bmV4cGVjdGx5IGFmdGVyIGluaXROb2RlXCI7XHJcbiAgICAgICAgICAgIGxldCByb3dDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHVpZCArIFwiX2NvbnRlbnRcIikuaHRtbChyb3dDb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZW5kZXJzIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB3aW5kb3cuIFRoZSByZW5kZXJpbmcgaW4gaGVyZSBpcyB2ZXJ5IGNlbnRyYWwgdG8gdGhlXHJcbiAgICAgICAgICogYXBwIGFuZCBpcyB3aGF0IHRoZSB1c2VyIHNlZXMgY292ZXJpbmcgOTAlIG9mIHRoZSBzY3JlZW4gbW9zdCBvZiB0aGUgdGltZS4gVGhlIFwiY29udGVudCogbm9kZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiB0b2RvLTA6IFJhdGhlciB0aGFuIGhhdmluZyB0aGlzIG5vZGUgcmVuZGVyZXIgaXRzZWxmIGJlIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgYWxsIHRoZSBkaWZmZXJlbnQgdHlwZXNcclxuICAgICAgICAgKiBvZiBub2RlcywgbmVlZCBhIG1vcmUgcGx1Z2dhYmxlIGRlc2lnbiwgd2hlcmUgcmVuZGVpbmcgb2YgZGlmZmVyZW50IHRoaW5ncyBpcyBkZWxldGFnZWQgdG8gc29tZVxyXG4gICAgICAgICAqIGFwcHJvcHJpYXRlIG9iamVjdC9zZXJ2aWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQ29udGVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluLCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJldDogc3RyaW5nID0gZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMjogZW5hYmxlIGhlYWRlclRleHQgd2hlbiBhcHByb3ByaWF0ZSBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd01ldGFEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gc2hvd0hlYWRlciA/IGJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkgOiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNob3dQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlbmRlckNvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNwZWNpYWwgUmVuZGVyaW5nIGZvciBOb2RlcyB0aGF0IGhhdmUgYSBwbHVnaW4tcmVuZGVyZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IG1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbbm9kZS5wcmltYXJ5VHlwZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGZ1bmMobm9kZSwgcm93U3R5bGluZylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250ZW50UHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5DT05URU5ULCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbnRlbnRQcm9wOiBcIiArIGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eShjb250ZW50UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqIGpjckNvbnRlbnQgZm9yIE1BUktET1dOOlxcblwiK2pjckNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlZENvbnRlbnQgPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz48L2Rpdj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxzY3JpcHQgdHlwZT0ndGV4dC9tYXJrZG93bic+XFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc2NyaXB0PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9tYXJrZWQtZWxlbWVudD5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiBkb2luZyBzZXJ2ZXItc2lkZSBtYXJrZG93biB3ZSBoYWQgdGhpcyBwcm9jZXNzaW5nIHRoZSBIVE1MIHRoYXQgd2FzIGdlbmVyYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2J1dCBJIGhhdmVuJ3QgbG9va2VkIGludG8gaG93IHRvIGdldCB0aGlzIGJhY2sgbm93IHRoYXQgd2UgYXJlIGRvaW5nIG1hcmtkb3duIG9uIGNsaWVudC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9qY3JDb250ZW50ID0gaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdFN1YnN0aXR1dGlvbnMoamNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG1hcmtlZENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbWFya2VkQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnBhdGgudHJpbSgpID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIlJvb3QgTm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyByZXQgKz0gXCI8ZGl2PltObyBDb250ZW50IFByb3BlcnR5XTwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzOiBzdHJpbmcgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlbmRlckJpbiAmJiBub2RlLmhhc0JpbmFyeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJpbmFyeTogc3RyaW5nID0gcmVuZGVyQmluYXJ5KG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBXZSBhcHBlbmQgdGhlIGJpbmFyeSBpbWFnZSBvciByZXNvdXJjZSBsaW5rIGVpdGhlciBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0IG9yIGF0IHRoZSBsb2NhdGlvbiB3aGVyZVxyXG4gICAgICAgICAgICAgICAgICogdGhlIHVzZXIgaGFzIHB1dCB7e2luc2VydC1hdHRhY2htZW50fX0gaWYgdGhleSBhcmUgdXNpbmcgdGhhdCB0byBtYWtlIHRoZSBpbWFnZSBhcHBlYXIgaW4gYSBzcGVjaWZpY1xyXG4gICAgICAgICAgICAgICAgICogbG9jYXRpbyBpbiB0aGUgY29udGVudCB0ZXh0LlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAocmV0LmNvbnRhaW5zKGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0LnJlcGxhY2VBbGwoY25zdC5JTlNFUlRfQVRUQUNITUVOVCwgYmluYXJ5KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGJpbmFyeTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRhZ3M6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlRBR1MsIG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodGFncykge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRhZ3MtY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCBcIlRhZ3M6IFwiICsgdGFncyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkgPSBmdW5jdGlvbihqc29uQ29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb246IFwiICsganNvbkNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gSlNPTi5wYXJzZShqc29uQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZURpdiA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzeXN0ZW1GaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZW50cnkuZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxPcGVuTGluayA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBcIm02NC5tZXRhNjQub3BlblN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkxvY2FsIE9wZW5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkb3dubG9hZExpbmsgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaGF2ZW4ndCBpbXBsZW1lbnRlZCBkb3dubG9hZCBjYXBhYmlsaXR5IHlldC5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBcIm9uY2xpY2tcIjogXCJtNjQubWV0YTY0LmRvd25sb2FkU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sIFwiRG93bmxvYWRcIilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmtzRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB9LCBsb2NhbE9wZW5MaW5rICsgZG93bmxvYWRMaW5rKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZpbGVOYW1lRGl2ICsgbGlua3NEaXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJyZW5kZXIgZmFpbGVkXCIsIGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiW3JlbmRlciBmYWlsZWRdXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAgICAgKiBjb250ZW50LiBUaGlzIGdlbmVyYXRlcyB0aGUgSFRNTCBmb3IgYSBzaW5nbGUgcm93L25vZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSBpbmRleCA+IDAgJiYgcm93Q291bnQgPiAxO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSBpbmRleCA8IGNvdW50IC0gMTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnP1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gZWRpdGluZ0FsbG93ZWQ9XCIrZWRpdGluZ0FsbG93ZWQpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaWYgbm90IHNlbGVjdGVkIGJ5IGJlaW5nIHRoZSBuZXcgY2hpbGQsIHRoZW4gd2UgdHJ5IHRvIHNlbGVjdCBiYXNlZCBvbiBpZiB0aGlzIG5vZGUgd2FzIHRoZSBsYXN0IG9uZVxyXG4gICAgICAgICAgICAgKiBjbGlja2VkIG9uIGZvciB0aGlzIHBhZ2UuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRlc3Q6IFtcIiArIHBhcmVudElkVG9Gb2N1c0lkTWFwW2N1cnJlbnROb2RlSWRdXHJcbiAgICAgICAgICAgIC8vICtcIl09PVtcIisgbm9kZS5pZCArIFwiXVwiKVxyXG4gICAgICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSAoZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFySHRtbFJldDogc3RyaW5nID0gbWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3dcIiArIChzZWxlY3RlZCA/IFwiIGFjdGl2ZS1yb3dcIiA6IFwiIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWQsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IGJrZ1N0eWxlXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhckh0bWxSZXQgKyB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93Tm9kZVVybCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgbXVzdCBmaXJzdCBjbGljayBvbiBhIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBub2RlLnBhdGguc3RyaXBJZlN0YXJ0c1dpdGgoXCIvcm9vdFwiKTtcclxuICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgcGF0aDtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IFwiVVJMIHVzaW5nIHBhdGg6IDxicj5cIiArIHVybDtcclxuICAgICAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcImpjcjp1dWlkXCIsIG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBcIjxwPlVSTCBmb3IgVVVJRDogPGJyPlwiICsgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgdXVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VG9wUmlnaHRJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy50b3AucmlnaHQnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nVGFnOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgICAgIHRvcFJpZ2h0SW1nVGFnID0gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiB0b3BSaWdodEltZyxcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidG9wLXJpZ2h0LWltYWdlXCJcclxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUmlnaHRJbWdUYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCa2dJbWFnZVN0eWxlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWdTdHlsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGJrZ0ltZykge1xyXG4gICAgICAgICAgICAgICAgYmtnSW1nU3R5bGUgPSBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcIiArIGJrZ0ltZyArIFwiKTtcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmtnSW1nU3R5bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNlbnRlcmVkQnV0dG9uQmFyID0gZnVuY3Rpb24oYnV0dG9ucz86IHN0cmluZywgY2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zOiBzdHJpbmcsIGNsYXNzZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxlZnQtanVzdGlmaWVkIGxheW91dCB2ZXJ0aWNhbC1sYXlvdXQtcm93IFwiICsgY2xhc3Nlc1xyXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVJvd0J1dHRvbkJhckh0bWwgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBjYW5Nb3ZlVXA6IGJvb2xlYW4sIGNhbk1vdmVEb3duOiBib29sZWFuLCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBvcGVuQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgc2VsQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGVkaXROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVVcEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1vdmVOb2RlRG93bkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGluc2VydE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5yZXBseVRvQ29tbWVudCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgLyogQ29uc3RydWN0IE9wZW4gQnV0dG9uICovXHJcbiAgICAgICAgICAgIGlmIChub2RlSGFzQ2hpbGRyZW4obm9kZS51aWQpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgIG9wZW5CdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBGb3Igc29tZSB1bmtub3duIHJlYXNvbiB0aGUgYWJpbGl0eSB0byBzdHlsZSB0aGlzIHdpdGggdGhlIGNsYXNzIGJyb2tlLCBhbmQgZXZlblxyXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyIGRlZGljYXRpbmcgc2V2ZXJhbCBob3VycyB0cnlpbmcgdG8gZmlndXJlIG91dCB3aHkgSSdtIHN0aWxsIGJhZmZsZWQuIEkgY2hlY2tlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgYSBodW5kcmVkIHRpbWVzIGFuZCBzdGlsbCBkb24ndCBrbm93IHdoYXQgSSdtIGRvaW5nIHdyb25nLi4uSSBqdXN0IGZpbmFsbHkgcHV0IHRoZSBnb2QgZGFtbiBmdWNraW5nIHN0eWxlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGhlcmUgdG8gYWNjb21wbGlzaCB0aGUgc2FtZSB0aGluZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7Y29sb3I6d2hpdGU7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2Lm9wZW5Ob2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIi8vXHJcbiAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiT3BlblwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgaW4gZWRpdCBtb2RlIHdlIGFsd2F5cyBhdCBsZWFzdCBjcmVhdGUgdGhlIHBvdGVudGlhbCAoYnV0dG9ucykgZm9yIGEgdXNlciB0byBpbnNlcnQgY29udGVudCwgYW5kIGlmXHJcbiAgICAgICAgICAgICAqIHRoZXkgZG9uJ3QgaGF2ZSBwcml2aWxlZ2VzIHRoZSBzZXJ2ZXIgc2lkZSBzZWN1cml0eSB3aWxsIGxldCB0aGVtIGtub3cuIEluIHRoZSBmdXR1cmUgd2UgY2FuIGFkZCBtb3JlXHJcbiAgICAgICAgICAgICAqIGludGVsbGlnZW5jZSB0byB3aGVuIHRvIHNob3cgdGhlc2UgYnV0dG9ucyBvciBub3QuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFZGl0aW5nIGFsbG93ZWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1tub2RlLnVpZF0gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgbm9kZUlkIFwiICsgbm9kZS51aWQgKyBcIiBzZWxlY3RlZD1cIiArIHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNzczogT2JqZWN0ID0gc2VsZWN0ZWQgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLnVpZCArIFwiX3NlbFwiLC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNoZWNrZWRcIjogXCJjaGVja2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy9wYWRkaW5nIGlzIGEgYmFjayBoYWNrIHRvIG1ha2UgY2hlY2tib3ggbGluZSB1cCB3aXRoIG90aGVyIGljb25zLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vKGkgd2lsbCBwcm9iYWJseSBlbmQgdXAgdXNpbmcgYSBwYXBlci1pY29uLWJ1dHRvbiB0aGF0IHRvZ2dsZXMgaGVyZSwgaW5zdGVhZCBvZiBjaGVja2JveClcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgfSA6IC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi10b3A6IDExcHg7XCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbEJ1dHRvbiA9IHRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGNzcywgXCJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgIWNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9cImljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5JTlNfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlXCIsIC8vXCJpY29uczptb3JlLWhvcml6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5pbnNlcnROb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiSW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL1BvbG1lciBJY29ucyBSZWZlcmVuY2U6IGh0dHBzOi8vZWxlbWVudHMucG9seW1lci1wcm9qZWN0Lm9yZy9lbGVtZW50cy9pcm9uLWljb25zP3ZpZXc9ZGVtbzpkZW1vL2luZGV4Lmh0bWxcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbHRcIjogXCJFZGl0IG5vZGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImVkaXRvcjptb2RlLWVkaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucnVuRWRpdE5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0Lk1PVkVfVVBET1dOX09OX1RPT0xCQVIgJiYgbWV0YTY0LmN1cnJlbnROb2RlLmNoaWxkcmVuT3JkZXJlZCAmJiAhY29tbWVudEJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlVXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZVVwQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctdXB3YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQubW92ZU5vZGVVcCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXCJVcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlRG93bkJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LWRvd253YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQubW92ZU5vZGVEb3duKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIkRuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaSB3aWxsIGJlIGZpbmRpbmcgYSByZXVzYWJsZS9EUlkgd2F5IG9mIGRvaW5nIHRvb2x0b3BzIHNvb24sIHRoaXMgaXMganVzdCBteSBmaXJzdCBleHBlcmltZW50LlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBIb3dldmVyIHRvb2x0aXBzIEFMV0FZUyBjYXVzZSBwcm9ibGVtcy4gTXlzdGVyeSBmb3Igbm93LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IGluc2VydE5vZGVUb29sdGlwOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAvL1x0XHRcdCB0YWcoXCJwYXBlci10b29sdGlwXCIsIHtcclxuICAgICAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgICAgICAvL1x0XHRcdCB9LCBcIklOU0VSVFMgYSBuZXcgbm9kZSBhdCB0aGUgY3VycmVudCB0cmVlIHBvc2l0aW9uLiBBcyBhIHNpYmxpbmcgb24gdGhpcyBsZXZlbC5cIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWRkTm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiQUREUyBhIG5ldyBub2RlIGluc2lkZSB0aGUgY3VycmVudCBub2RlLCBhcyBhIGNoaWxkIG9mIGl0LlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxCdXR0b25zOiBzdHJpbmcgPSBzZWxCdXR0b24gKyBvcGVuQnV0dG9uICsgaW5zZXJ0Tm9kZUJ1dHRvbiArIGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBpbnNlcnROb2RlVG9vbHRpcFxyXG4gICAgICAgICAgICAgICAgKyBhZGROb2RlVG9vbHRpcCArIGVkaXROb2RlQnV0dG9uICsgbW92ZU5vZGVVcEJ1dHRvbiArIG1vdmVOb2RlRG93bkJ1dHRvbiArIHJlcGx5QnV0dG9uO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFsbEJ1dHRvbnMubGVuZ3RoID4gMCA/IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoYWxsQnV0dG9ucykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0ID0gZnVuY3Rpb24oY29udGVudD86IHN0cmluZywgZXh0cmFDbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIE5vdyBidWlsZCBlbnRpcmUgY29udHJvbCBiYXIgKi9cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiICsgKGV4dHJhQ2xhc3NlcyA/IChcIiBcIiArIGV4dHJhQ2xhc3NlcykgOiBcIlwiKVxyXG4gICAgICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VIb3J6Q29udHJvbEdyb3VwID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVJhZGlvQnV0dG9uID0gZnVuY3Rpb24obGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZFxyXG4gICAgICAgICAgICB9LCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbm9kZUlkIChzZWUgbWFrZU5vZGVJZCgpKSBOb2RlSW5mbyBvYmplY3QgaGFzICdoYXNDaGlsZHJlbicgdHJ1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZUhhc0NoaWxkcmVuID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBub2RlSGFzQ2hpbGRyZW46IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZvcm1hdFBhdGggPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIGluamVjdCBzcGFjZSBpbiBoZXJlIHNvIHRoaXMgc3RyaW5nIGNhbiB3cmFwIGFuZCBub3QgYWZmZWN0IHdpbmRvdyBzaXplcyBhZHZlcnNlbHksIG9yIG5lZWQgc2Nyb2xsaW5nICovXHJcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2VBbGwoXCIvXCIsIFwiIC8gXCIpO1xyXG4gICAgICAgICAgICBsZXQgc2hvcnRQYXRoOiBzdHJpbmcgPSBwYXRoLmxlbmd0aCA8IDUwID8gcGF0aCA6IHBhdGguc3Vic3RyaW5nKDAsIDQwKSArIFwiLi4uXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9Sb290UGF0aDogc3RyaW5nID0gc2hvcnRQYXRoO1xyXG4gICAgICAgICAgICBpZiAobm9Sb290UGF0aC5zdGFydHNXaXRoKFwiL3Jvb3RcIikpIHtcclxuICAgICAgICAgICAgICAgIG5vUm9vdFBhdGggPSBub1Jvb3RQYXRoLnN1YnN0cmluZygwLCA1KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gc2hvcnRQYXRoIDogbm9Sb290UGF0aDtcclxuICAgICAgICAgICAgcmV0ICs9IFwiIFtcIiArIG5vZGUucHJpbWFyeVR5cGVOYW1lICsgXCJdXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHdyYXBIdG1sID0gZnVuY3Rpb24odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGRpdj5cIiArIHRleHQgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIHBhZ2UgYW5kIGFsd2F5cyBhbHNvIHRha2VzIGNhcmUgb2Ygc2Nyb2xsaW5nIHRvIHNlbGVjdGVkIG5vZGUgaWYgdGhlcmUgaXMgb25lIHRvIHNjcm9sbCB0b1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUGFnZUZyb21EYXRhID0gZnVuY3Rpb24oZGF0YT86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm02NC5yZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKClcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChcIk5vIGNvbnRlbnQgaXMgYXZhaWxhYmxlIGhlcmUuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVpZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaWRlbnRUb1VpZE1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBJJ20gY2hvb3NpbmcgdG8gcmVzZXQgc2VsZWN0ZWQgbm9kZXMgd2hlbiBhIG5ldyBwYWdlIGxvYWRzLCBidXQgdGhpcyBpcyBub3QgYSByZXF1aXJlbWVudC4gSSBqdXN0XHJcbiAgICAgICAgICAgICAgICAgKiBkb24ndCBoYXZlIGEgXCJjbGVhciBzZWxlY3Rpb25zXCIgZmVhdHVyZSB3aGljaCB3b3VsZCBiZSBuZWVkZWQgc28gdXNlciBoYXMgYSB3YXkgdG8gY2xlYXIgb3V0LlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKGRhdGEubm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2V0Q3VycmVudE5vZGVEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcyA/IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA6IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVOREVSIE5PREU6IFwiICsgZGF0YS5ub2RlLmlkICsgXCIgcHJvcENvdW50PVwiICsgcHJvcENvdW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG91dHB1dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGJrZ1N0eWxlOiBzdHJpbmcgPSBnZXROb2RlQmtnSW1hZ2VTdHlsZShkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTk9URTogbWFpbk5vZGVDb250ZW50IGlzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFnZSBjb250ZW50LCBhbmQgaXMgYWx3YXlzIHRoZSBub2RlIGRpc3BsYXllZCBhdCB0aGUgdG9cclxuICAgICAgICAgICAgICogb2YgdGhlIHBhZ2UgYWJvdmUgYWxsIHRoZSBvdGhlciBub2RlcyB3aGljaCBhcmUgaXRzIGNoaWxkIG5vZGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IG1haW5Ob2RlQ29udGVudDogc3RyaW5nID0gcmVuZGVyTm9kZUNvbnRlbnQoZGF0YS5ub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibWFpbk5vZGVDb250ZW50OiBcIittYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1haW5Ob2RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCBidXR0b25CYXI6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGEubm9kZS5wYXRoPVwiK2RhdGEubm9kZS5wYXRoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZENvbW1lbnROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShkYXRhLm5vZGUpKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZE5vZGUoZGF0YS5ub2RlKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBTaG93IFJlcGx5IGJ1dHRvbiBpZiB0aGlzIGlzIGEgcHVibGljbHkgYXBwZW5kYWJsZSBub2RlIGFuZCBub3QgY3JlYXRlZCBieSBjdXJyZW50IHVzZXIsXHJcbiAgICAgICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIGRhdGEubm9kZS51aWQgKyBcIicpO1wiIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBjbnN0Lk5FV19PTl9UT09MQkFSICYmIGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmUtYWx0XCIsIC8vaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaWRcIiA6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQWRkIGVkaXQgYnV0dG9uIGlmIGVkaXQgbW9kZSBhbmQgdGhpcyBpc24ndCB0aGUgcm9vdCAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXQuaXNFZGl0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHJvd0hlYWRlciA9IGJ1aWxkUm93SGVhZGVyKGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNyZWF0ZVN1Yk5vZGVCdXR0b24gfHwgZWRpdE5vZGVCdXR0b24gfHwgcmVwbHlCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBlZGl0Tm9kZUJ1dHRvbiArIHJlcGx5QnV0dG9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IChzZWxlY3RlZCA/IFwibWFpbk5vZGVDb250ZW50U3R5bGUgYWN0aXZlLXJvd1wiIDogXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBpbmFjdGl2ZS1yb3dcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgKyBtYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZm9yY2UgYWxsIGxpbmtzIHRvIG9wZW4gYSBuZXcgd2luZG93L3RhYiAqL1xyXG4gICAgICAgICAgICAgICAgLy8kKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpOyA8LS0tLSB0aGlzIGRvZXNuJ3Qgd29yay5cclxuICAgICAgICAgICAgICAgIC8vICQoJyNtYWluTm9kZUNvbnRlbnQnKS5maW5kKFwiYVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICQodGhpcykuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZSBzdGF0dXMgYmFyLlwiKTtcclxuICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuYXYubWFpbk9mZnNldCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcmV2QnV0dG9uOiBzdHJpbmcgPSBtYWtlQnV0dG9uKFwiUHJldiBQYWdlXCIsIFwicHJldlBhZ2VCdXR0b25cIiwgcHJldlBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGNlbnRlcmVkQnV0dG9uQmFyKHByZXZCdXR0b24sIFwicGFnaW5nLWJ1dHRvbi1iYXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByb3dDb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZENvdW50OiBudW1iZXIgPSBkYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hpbGRDb3VudDogXCIgKyBjaGlsZENvdW50KTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBkYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWRpdC5ub2Rlc1RvTW92ZVNldFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm93OiBzdHJpbmcgPSBnZW5lcmF0ZVJvdyhpLCBub2RlLCBuZXdEYXRhLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvd0NvdW50ID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gZ2V0RW1wdHlQYWdlUHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YS5lbmRSZWFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEJ1dHRvbiA9IG1ha2VCdXR0b24oXCJOZXh0IFBhZ2VcIiwgXCJuZXh0UGFnZUJ1dHRvblwiLCBuZXh0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gY2VudGVyZWRCdXR0b25CYXIobmV4dEJ1dHRvbiwgXCJwYWdpbmctYnV0dG9uLWJhclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgb3V0cHV0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV0dHlQcmludCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVE9ETy0zOiBJbnN0ZWFkIG9mIGNhbGxpbmcgc2NyZWVuU2l6ZUNoYW5nZSBoZXJlIGltbWVkaWF0ZWx5LCBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gc2V0IHRoZSBpbWFnZSBzaXplc1xyXG4gICAgICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAgICAgKiBzZXRIdG1sLCBzbyB0aGF0IGltYWdlcyBhbHdheXMgYXJlIEdVQVJBTlRFRUQgdG8gcmVuZGVyIGNvcnJlY3RseSBpbW1lZGlhdGVseS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByZXZQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJldiBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgICAgIHZpZXcucHJldlBhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXh0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICAgICAgdmlldy5uZXh0UGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJvdyA9IGZ1bmN0aW9uKGk6IG51bWJlciwgbm9kZToganNvbi5Ob2RlSW5mbywgbmV3RGF0YTogYm9vbGVhbiwgY2hpbGRDb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGp1c3RJbWFnZVNpemUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBlbG0uYXR0cihcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2hpY2ggd2Ugd2FudCwgYnV0IHRoZW4gd2UgYWxzbyBsaW1pdCBpdCB3aXRoIG1heC13aWR0aCBzbyBvbiBzbWFsbGVyIHNjcmVlbiBkZXZpY2VzIG9yIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIERPIE5PVCBERUxFVEUgKGZvciBhIGxvbmcgdGltZSBhdCBsZWFzdCkgVGhpcyBpcyB0aGUgb2xkIGxvZ2ljIGZvciByZXNpemluZyBpbWFnZXMgcmVzcG9uc2l2ZWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPVxcXCJcIiArIHYgKyBcIlxcXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiPlwiICsgY29udGVudCArIFwiPC9cIiArIHRhZyArIFwiPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiLz5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVRleHRBcmVhID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlRWRpdEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUGFzc3dvcmRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93UHJvcGVydHlUb0Rpc3BsYXkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0W3Byb3BOYW1lXSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1JlYWRPbmx5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0JpbmFyeVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmJpbmFyeVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IFwic2ltcGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2guanNcIik7XHJcblxyXG4vKlxyXG4gKiB0b2RvLTM6IHRyeSB0byByZW5hbWUgdG8gJ3NlYXJjaCcsIGJ1dCByZW1lbWJlciB5b3UgaGFkIGluZXhwbGlhYmxlIHByb2JsZW1zIHRoZSBmaXJzdCB0aW1lIHlvdSB0cmllZCB0byB1c2UgJ3NlYXJjaCdcclxuICogYXMgdGhlIHZhciBuYW1lLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNyY2gge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoT2Zmc2V0ID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lT2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyBzZWFyY2ggaGFzIGJlZW4gZG9uZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaFJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gdGltZWxpbmUgaGFzIGJlZW4gZG9uZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXaWxsIGJlIHRoZSBsYXN0IHJvdyBjbGlja2VkIG9uIChOb2RlSW5mby5qYXZhIG9iamVjdCkgYW5kIGhhdmluZyB0aGUgcmVkIGhpZ2hsaWdodCBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodFJvd05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byB0aGUgTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG51bVNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNyY2guc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggIT0gbnVsbCA/IC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hUYWJBY3RpdmF0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgYSBsb2dnZWQgaW4gdXNlciBjbGlja3MgdGhlIHNlYXJjaCB0YWIsIGFuZCBubyBzZWFyY2ggcmVzdWx0cyBhcmUgY3VycmVudGx5IGRpc3BsYXlpbmcsIHRoZW4gZ28gYWhlYWRcclxuICAgICAgICAgICAgICogYW5kIG9wZW4gdXAgdGhlIHNlYXJjaCBkaWFsb2cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobnVtU2VhcmNoUmVzdWx0cygpID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IFNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRzUGFuZWwgPSBuZXcgU2VhcmNoUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gc2VhcmNoUmVzdWx0c1BhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcInNlYXJjaFJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICAgICAgc2VhcmNoUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2Uoc2VhcmNoUmVzdWx0c1BhbmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdGltZWxpbmVSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgdGltZWxpbmVSZXN1bHRzUGFuZWwgPSBuZXcgVGltZWxpbmVSZXN1bHRzUGFuZWwoKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJ0aW1lbGluZVJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICAgICAgdGltZWxpbmVSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZSh0aW1lbGluZVJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaEZpbGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHJlcy5zZWFyY2hSZXN1bHROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiIDogc2VhcmNoT2Zmc2V0XHJcbiAgICAgICAgICAgIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCB0aW1lbGluZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeUNyZWF0ZVRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkNSRUFURUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCB0aW1lbGluZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdFNlYXJjaE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIG5vZGUudWlkID0gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKTtcclxuICAgICAgICAgICAgdWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2UgPSBmdW5jdGlvbihkYXRhLCB2aWV3TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZENvdW50ID0gZGF0YS5zZWFyY2hSZXN1bHRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb24gdGhlXHJcbiAgICAgICAgICAgICAqIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdFNlYXJjaE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgICAgIG91dHB1dCArPSByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtKG5vZGUsIGksIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodmlld05hbWUsIG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlbmRlcnMgYSBzaW5nbGUgbGluZSBvZiBzZWFyY2ggcmVzdWx0cyBvbiB0aGUgc2VhcmNoIHJlc3VsdHMgcGFnZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlLCBpbmRleCwgY291bnQsIHJvd0NvdW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdWlkID0gbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyU2VhcmNoUmVzdWx0OiBcIiArIHVpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSB3aXRoIGlkOiBcIiArY3NzSWQpXHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFySHRtbCA9IG1ha2VCdXR0b25CYXJIdG1sKFwiXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidXR0b25CYXJIdG1sPVwiICsgYnV0dG9uQmFySHRtbCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5vZGUtdGFibGUtcm93IGluYWN0aXZlLXJvd1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnNyY2guY2xpY2tPblNlYXJjaFJlc3VsdFJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXJIdG1sLy9cclxuICAgICAgICAgICAgICAgICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9zcmNoX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfSwgY29udGVudCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKHVpZCkge1xyXG4gICAgICAgICAgICB2YXIgZ290b0J1dHRvbiA9IHJlbmRlci5tYWtlQnV0dG9uKFwiR28gdG8gTm9kZVwiLCB1aWQsIFwibTY0LnNyY2guY2xpY2tTZWFyY2hOb2RlKCdcIiArIHVpZCArIFwiJyk7XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoZ290b0J1dHRvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25TZWFyY2hSZXN1bHRSb3cgPSBmdW5jdGlvbihyb3dFbG0sIHVpZCkge1xyXG4gICAgICAgICAgICB1bmhpZ2hsaWdodFJvdygpO1xyXG4gICAgICAgICAgICBoaWdobGlnaHRSb3dOb2RlID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImluYWN0aXZlLXJvd1wiLCBcImFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrU2VhcmNoTm9kZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHVwZGF0ZSBoaWdobGlnaHQgbm9kZSB0byBwb2ludCB0byB0aGUgbm9kZSBjbGlja2VkIG9uLCBqdXN0IHRvIHBlcnNpc3QgaXQgZm9yIGxhdGVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzcmNoLmhpZ2hsaWdodFJvd05vZGUgPSBzcmNoLnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIXNyY2guaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCB1aWQgaW4gc2VhcmNoIHJlc3VsdHM6IFwiICsgdWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCwgdHJ1ZSwgc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gc3R5bGluZyBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1bmhpZ2hsaWdodFJvdyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgdmFyIG5vZGVJZCA9IGhpZ2hsaWdodFJvd05vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgLyogY2hhbmdlIGNsYXNzIG9uIGVsZW1lbnQgKi9cclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzaGFyZS5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzaGFyZSB7XHJcblxyXG4gICAgICAgIGxldCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaGFyaW5nTm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSGFuZGxlcyAnU2hhcmluZycgYnV0dG9uIG9uIGEgc3BlY2lmaWMgbm9kZSwgZnJvbSBidXR0b24gYmFyIGFib3ZlIG5vZGUgZGlzcGxheSBpbiBlZGl0IG1vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlU2hhcmluZyA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaGFyaW5nTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZpbmRTaGFyZWROb2RlcyA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGZvY3VzTm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hQYWdlVGl0bGUgPSBcIlNoYXJlZCBOb2Rlc1wiO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2hhcmVkTm9kZXNSZXF1ZXN0LCBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2U+KFwiZ2V0U2hhcmVkTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZm9jdXNOb2RlLmlkXHJcbiAgICAgICAgICAgIH0sIGZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXNlci5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB1c2VyIHtcclxuXHJcbiAgICAgICAgbGV0IGxvZ291dFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ291dFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCBJIHdhbnQgdG8gYWxsb3cgY2VydGFpbiB1c2VycyBhZGRpdGlvbmFsIHByaXZpbGVnZXMuIEEgYml0IG9mIGEgaGFjayBiZWNhdXNlIGl0IHdpbGwgZ29cclxuICAgICAgICAgKiBpbnRvIHByb2R1Y3Rpb24sIGJ1dCBvbiBteSBvd24gcHJvZHVjdGlvbiB0aGVzZSBhcmUgbXkgXCJ0ZXN0VXNlckFjY291bnRzXCIsIHNvIG5vIHJlYWwgdXNlciB3aWxsIGJlIGFibGUgdG9cclxuICAgICAgICAgKiB1c2UgdGhlc2UgbmFtZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzVGVzdFVzZXJBY2NvdW50ID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhZGFtXCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImJvYlwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJjb3J5XCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRhblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcyk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBCUkFORElOR19USVRMRV9TSE9SVDtcclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMDogSWYgdXNlcnMgZ28gd2l0aCB2ZXJ5IGxvbmcgdXNlcm5hbWVzIHRoaXMgaXMgZ29ubmEgYmUgdWdseSAqL1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSArPSBcIjpcIiArIHJlcy51c2VyTmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcIiNoZWFkZXJBcHBOYW1lXCIpLmh0bWwodGl0bGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVE9ETy0zOiBtb3ZlIHRoaXMgaW50byBtZXRhNjQgbW9kdWxlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAocmVzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVJZCA9IHJlcy5yb290Tm9kZS5pZDtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZVBhdGggPSByZXMucm9vdE5vZGUucGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRhNjQudXNlck5hbWUgPSByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pc0FkbWluVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhZG1pblwiO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBbm9uVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICAgICAgbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlID0gcmVzLmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgICAgICBtZXRhNjQuYWxsb3dGaWxlU3lzdGVtU2VhcmNoID0gcmVzLmFsbG93RmlsZVN5c3RlbVNlYXJjaDtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMgPSByZXMudXNlclByZWZlcmVuY2VzO1xyXG4gICAgICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5zaG93TWV0YURhdGE7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gc2VydmVyOiBtZXRhNjQuZWRpdE1vZGVPcHRpb249XCIgKyBtZXRhNjQuZWRpdE1vZGVPcHRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuU2lnbnVwUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBTaWdudXBEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogV3JpdGUgYSBjb29raWUgdGhhdCBleHBpcmVzIGluIGEgeWVhciBmb3IgYWxsIHBhdGhzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cml0ZUNvb2tpZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbCk6IHZvaWQge1xyXG4gICAgICAgICAgICAkLmNvb2tpZShuYW1lLCB2YWwsIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgdWdseS4gSXQgaXMgdGhlIGJ1dHRvbiB0aGF0IGNhbiBiZSBsb2dpbiAqb3IqIGxvZ291dC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Mb2dpblBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsb2dpbkRsZzogTG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcucG9wdWxhdGVGcm9tQ29va2llcygpO1xyXG4gICAgICAgICAgICBsb2dpbkRsZy5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hMb2dpbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbGxVc3I6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IGNhbGxQd2Q6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IHVzaW5nQ29va2llczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxvZ2luU2Vzc2lvblJlYWR5ID0gJChcIiNsb2dpblNlc3Npb25SZWFkeVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gdHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHVzaW5nQ29va2llcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsb2dpblN0YXRlOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgd2UgaGF2ZSBrbm93biBzdGF0ZSBhcyBsb2dnZWQgb3V0LCB0aGVuIGRvIG5vdGhpbmcgaGVyZSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luU3RhdGUgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXNyOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB3ZDogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvb2tpZVVzZXI9XCIgKyB1c3IgKyBcIiB1c2luZ0Nvb2tpZXMgPSBcIiArIHVzaW5nQ29va2llcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IHVzciA/IHVzciA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4gd2l0aCBuYW1lOiBcIiArIGNhbGxVc3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiBjYWxsVXNyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogY2FsbFB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgY2FsbFVzciwgY2FsbFB3ZCwgdXNpbmdDb29raWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ291dCA9IGZ1bmN0aW9uKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9nb3V0UmVxdWVzdCwganNvbi5Mb2dvdXRSZXNwb25zZT4oXCJsb2dvdXRcIiwge30sIGxvZ291dFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW4gPSBmdW5jdGlvbihsb2dpbkRsZywgdXNyLCBwd2QpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c3IsXHJcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IHB3ZCxcclxuICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgdXNyLCBwd2QsIG51bGwsIGxvZ2luRGxnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUFsbFVzZXJDb29raWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uTG9naW5SZXNwb25zZSwgdXNyPzogc3RyaW5nLCBwd2Q/OiBzdHJpbmcsIHVzaW5nQ29va2llcz86IGJvb2xlYW4sIGxvZ2luRGxnPzogTG9naW5EbGcpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTG9naW5cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpblJlc3BvbnNlOiB1c3I9XCIgKyB1c3IgKyBcIiBob21lTm9kZU92ZXJyaWRlOiBcIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodXNyICE9IFwiYW5vbnltb3VzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IsIHVzcik7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdELCBwd2QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5EbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlOiBcIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlIGlzIG51bGwuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIHNldCBJRCB0byBiZSB0aGUgcGFnZSB3ZSB3YW50IHRvIHNob3cgdXNlciByaWdodCBhZnRlciBsb2dpbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdXRpbC5lbXB0eVN0cmluZyhyZXMuaG9tZU5vZGVPdmVycmlkZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVPdmVycmlkZT1cIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBsYXN0Tm9kZT1cIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlSWQ9XCIgKyBtZXRhNjQuaG9tZU5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoaWQsIGZhbHNlLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiQ29va2llIGxvZ2luIGZhaWxlZC5cIikpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBibG93IGF3YXkgZmFpbGVkIGNvb2tpZSBjcmVkZW50aWFscyBhbmQgcmVsb2FkIHBhZ2UsIHNob3VsZCByZXN1bHQgaW4gYnJhbmQgbmV3IHBhZ2UgbG9hZCBhcyBhbm9uXHJcbiAgICAgICAgICAgICAgICAgICAgICogdXNlci5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVzIGlzIEpTT04gcmVzcG9uc2Ugb2JqZWN0IGZyb20gc2VydmVyLlxyXG4gICAgICAgIGxldCByZWZyZXNoTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luUmVzcG9uc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHVzZXIuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdmlldy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB2aWV3IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlU3RhdHVzQmFyID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXR1c0xpbmUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCIgU2VsZWN0aW9uczogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQobWV0YTY0LnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIHBhcmFtZXRlciB3aGljaCwgaWYgc3VwcGxpZWQsIHNob3VsZCBiZSB0aGUgaWQgd2Ugc2Nyb2xsIHRvIHdoZW4gZmluYWxseSBkb25lIHdpdGggdGhlXHJcbiAgICAgICAgICogcmVuZGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCB0YXJnZXRJZD86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBhbmQgaWYgc3BlY2lmaWVkIG1ha2VzIHRoZSBwYWdlIHNjcm9sbCB0byBhbmQgaGlnaGxpZ2h0IHRoYXQgbm9kZSB1cG9uIHJlLXJlbmRlcmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlID0gZnVuY3Rpb24obm9kZUlkPzogYW55LCByZW5kZXJQYXJlbnRJZkxlYWY/OiBhbnksIGhpZ2hsaWdodElkPzogYW55LCBpc0luaXRpYWxSZW5kZXI/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0SWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gY3VycmVudFNlbE5vZGUgIT0gbnVsbCA/IGN1cnJlbnRTZWxOb2RlLmlkIDogbm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBJIGRvbid0IGtub3cgb2YgYW55IHJlYXNvbiAncmVmcmVzaFRyZWUnIHNob3VsZCBpdHNlbGYgcmVzZXQgdGhlIG9mZnNldCwgYnV0IEkgbGVhdmUgdGhpcyBjb21tZW50IGhlcmVcclxuICAgICAgICAgICAgYXMgYSBoaW50IGZvciB0aGUgZnV0dXJlLlxyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogcmVuZGVyUGFyZW50SWZMZWFmID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIiA6IG5hdi5tYWluT2Zmc2V0XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hUcmVlUmVzcG9uc2UocmVzLCBoaWdobGlnaHRJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlbmRlciAmJiBtZXRhNjQudXJsQ21kID09IFwiYWRkTm9kZVwiICYmIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5lZGl0TW9kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobWV0YTY0LmN1cnJlbnROb2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmV2UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgcHJldlBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0IC09IG5hdi5ST1dTX1BFUl9QQUdFO1xyXG4gICAgICAgICAgICBpZiAobmF2Lm1haW5PZmZzZXQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbG9hZFBhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHRQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCArPSBuYXYuUk9XU19QRVJfUEFHRTtcclxuICAgICAgICAgICAgbG9hZFBhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsb2FkUGFnZSA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiIDogbmF2Lm1haW5PZmZzZXRcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIG51bGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAgICAgKiBzY3JvbGxUb1RvcCwgYW5kIHRoZW4gc29tZSBvdGhlciBjb2RlIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyBsb2NhdGlvbiBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyLiB0aGVcclxuICAgICAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsbTogYW55ID0gbmF2LmdldFNlbGVjdGVkUG9seUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdG9kby0wOiByZW1vdmVkIG1haW5QYXBlclRhYnMgZnJvbSB2aXNpYmlsaXR5LCBidXQgd2hhdCBjb2RlIHNob3VsZCBnbyBoZXJlIG5vdz9cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IFRoZSBmb2xsb3dpbmcgd2FzIGluIGEgcG9seW1lciBleGFtcGxlIChjYW4gSSB1c2UgdGhpcz8pOiBhcHAuJC5oZWFkZXJQYW5lbE1haW4uc2Nyb2xsVG9Ub3AodHJ1ZSk7XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogbm90IHVzaW5nIG1haW5QYXBlclRhYnMgYW55IGxvbmdlciBzbyBzaHcgc2hvdWxkIGdvIGhlcmUgbm93ID9cclxuICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgIGxldCBlbG06IGFueSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRFZGl0UGF0aERpc3BsYXlCeUlkID0gZnVuY3Rpb24oZG9tSWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGVkaXQuZWRpdE5vZGU7XHJcbiAgICAgICAgICAgIGxldCBlOiBhbnkgPSAkKFwiI1wiICsgZG9tSWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGUuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgICAgIGUuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhEaXNwbGF5ID0gXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMjogRG8gd2UgcmVhbGx5IG5lZWQgSUQgaW4gYWRkaXRpb24gdG8gUGF0aCBoZXJlP1xyXG4gICAgICAgICAgICAgICAgLy8gcGF0aERpc3BsYXkgKz0gXCI8YnI+SUQ6IFwiICsgbm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGlzcGxheSArPSBcIjxicj5Nb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwocGF0aERpc3BsYXkpO1xyXG4gICAgICAgICAgICAgICAgZS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1NlcnZlckluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2VydmVySW5mb1JlcXVlc3QsIGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlPihcImdldFNlcnZlckluZm9cIiwge30sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhyZXMuc2VydmVySW5mbykpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1lbnVQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZW51UGFuZWwge1xyXG5cclxuICAgICAgICBsZXQgbWFrZVRvcExldmVsTWVudSA9IGZ1bmN0aW9uKHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGFwZXJJdGVtQXR0cnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzczogXCJtZW51LXRyaWdnZXJcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcGVySXRlbSA9IHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHBhcGVySXRlbUF0dHJzLCB0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFwZXJTdWJtZW51QXR0cnMgPSB7XHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IHRpdGxlLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICAgICAgKDxhbnk+cGFwZXJTdWJtZW51QXR0cnMpLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItc3VibWVudVwiLCBwYXBlclN1Ym1lbnVBdHRyc1xyXG4gICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAvL1wibGFiZWxcIjogdGl0bGUsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZXRhNjQtbWVudS1oZWFkaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdFwiXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgICwgcGFwZXJJdGVtICsgLy9cIjxwYXBlci1pdGVtIGNsYXNzPSdtZW51LXRyaWdnZXInPlwiICsgdGl0bGUgKyBcIjwvcGFwZXItaXRlbT5cIiArIC8vXHJcbiAgICAgICAgICAgICAgICBtYWtlU2Vjb25kTGV2ZWxMaXN0KGNvbnRlbnQpLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtYWtlU2Vjb25kTGV2ZWxMaXN0ID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1tZW51XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdCBteS1tZW51LXNlY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAvLyxcclxuICAgICAgICAgICAgICAgIC8vXCJtdWx0aVwiOiBcIm11bHRpXCJcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWVudUl0ZW0gPSBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9uQ2xpY2s6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IG9uQ2xpY2ssXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkb21JZDogc3RyaW5nID0gXCJtYWluQXBwTWVudVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvLyBJIGVuZGVkIHVwIG5vdCByZWFsbHkgbGlraW5nIHRoaXMgd2F5IG9mIHNlbGVjdGluZyB0YWJzLiBJIGNhbiBqdXN0IHVzZSBub3JtYWwgcG9seW1lciB0YWJzLlxyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIk1haW5cIiwgXCJtYWluUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdtYWluVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcInNlYXJjaFBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYignc2VhcmNoVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlRpbWVsaW5lXCIsIFwidGltZWxpbmVQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ3RpbWVsaW5lVGFiTmFtZScpO1wiKTtcclxuICAgICAgICAgICAgLy8gdmFyIHBhZ2VNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlBhZ2VcIiwgcGFnZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnNzSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGZWVkc1wiLCBcIm1haW5NZW51UnNzXCIsIFwibTY0Lm5hdi5vcGVuUnNzRmVlZHNOb2RlKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVSc3MgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUlNTXCIsIHJzc0l0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZGl0TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlXCIsIFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBcIm02NC5lZGl0LmNyZWF0ZU5vZGUoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgXCIobmV3IG02NC5SZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDdXRcIiwgXCJjdXRTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmN1dFNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUGFzdGVcIiwgXCJwYXN0ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQucGFzdGVTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNsZWFyIFNlbGVjdGlvbnNcIiwgXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgXCJtNjQuZWRpdC5jbGVhclNlbGVjdGlvbnMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJJbXBvcnRcIiwgXCJvcGVuSW1wb3J0RGxnXCIsIFwiKG5ldyBtNjQuSW1wb3J0RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJFeHBvcnRcIiwgXCJvcGVuRXhwb3J0RGxnXCIsIFwiKG5ldyBtNjQuRXhwb3J0RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGVcIiwgXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgZWRpdE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiRWRpdFwiLCBlZGl0TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBcIiwgXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVVcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRvd25cIiwgXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBUb3BcIiwgXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb1RvcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcInRvIEJvdHRvbVwiLCBcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVRvQm90dG9tKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJNb3ZlXCIsIG1vdmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBGaWxlXCIsIFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbUZpbGVEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21VcmxEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGUgQXR0YWNobWVudFwiLCBcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkF0dGFjaFwiLCBhdHRhY2htZW50TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaGFyaW5nTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRWRpdCBOb2RlIFNoYXJpbmdcIiwgXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgXCJtNjQuc2hhcmUuZWRpdE5vZGVTaGFyaW5nKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmluZCBTaGFyZWQgU3Vibm9kZXNcIiwgXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgXCJtNjQuc2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2hhcmVcIiwgc2hhcmluZ01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ29udGVudFwiLCBcImNvbnRlbnRTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogbWFrZSBhIHZlcnNpb24gb2YgdGhlIGRpYWxvZyB0aGF0IGRvZXMgYSB0YWcgc2VhcmNoXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlRhZ3NcIiwgXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hUYWdzRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGaWxlc1wiLCBcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IG02NC5TZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNlYXJjaFwiLCBzZWFyY2hNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlZFwiLCBcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlDcmVhdGVUaW1lKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNb2RpZmllZFwiLCBcInRpbWVsaW5lTW9kaWZpZWRCdXR0b25cIiwgXCJtNjQuc3JjaC50aW1lbGluZUJ5TW9kVGltZSgpO1wiKTsvL1xyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlRpbWVsaW5lXCIsIHRpbWVsaW5lTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlRvZ2dsZSBQcm9wZXJ0aWVzXCIsIFwicHJvcHNUb2dnbGVCdXR0b25cIiwgXCJtNjQucHJvcHMucHJvcHNUb2dnbGUoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJSZWZyZXNoXCIsIFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnJlZnJlc2goKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTaG93IFVSTFwiLCBcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBcIm02NC5yZW5kZXIuc2hvd05vZGVVcmwoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJQcmVmZXJlbmNlc1wiLCBcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCBcIihuZXcgbTY0LlByZWZzRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IGJ1Zzogc2VydmVyIGluZm8gbWVudSBpdGVtIGlzIHNob3dpbmcgdXAgKGFsdGhvdWdoIGNvcnJlY3RseSBkaXNhYmxlZCkgZm9yIG5vbi1hZG1pbiB1c2Vycy5cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiU2VydmVyIEluZm9cIiwgXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBcIm02NC52aWV3LnNob3dTZXJ2ZXJJbmZvKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlZpZXdcIiwgdmlld09wdGlvbnNNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogd2hhdGV2ZXIgaXMgY29tbWVudGVkIGlzIG9ubHkgY29tbWVudGVkIGZvciBwb2x5bWVyIGNvbnZlcnNpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgXCIobmV3IG02NC5DaGFuZ2VQYXNzd29yZERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFuYWdlIEFjY291bnRcIiwgXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsIFwiKG5ldyBtNjQuTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW5zZXJ0IEJvb2s6IFdhciBhbmQgUGVhY2VcIiwgXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgXCJtNjQuZWRpdC5pbnNlcnRCb29rV2FyQW5kUGVhY2UoKTtcIik7IC8vXHJcbiAgICAgICAgICAgIC8vIG1lbnVJdGVtKFwiRnVsbCBSZXBvc2l0b3J5IEV4cG9ydFwiLCBcImZ1bGxSZXBvc2l0b3J5RXhwb3J0XCIsIFwiXHJcbiAgICAgICAgICAgIC8vIGVkaXQuZnVsbFJlcG9zaXRvcnlFeHBvcnQoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB2YXIgbXlBY2NvdW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBY2NvdW50XCIsIG15QWNjb3VudEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZG1pbkl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiR2VuZXJhdGUgUlNTXCIsIFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgXCJtNjQucG9kY2FzdC5nZW5lcmF0ZVJTUygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGFkbWluTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBZG1pblwiLCBhZG1pbkl0ZW1zLCBcImFkbWluTWVudVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBoZWxwSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYWluIE1lbnUgSGVscFwiLCBcIm1haW5NZW51SGVscFwiLCBcIm02NC5uYXYub3Blbk1haW5NZW51SGVscCgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIG1haW5NZW51SGVscCA9IG1ha2VUb3BMZXZlbE1lbnUoXCJIZWxwL0RvY3NcIiwgaGVscEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gLyogcGFnZU1lbnUrICovIG1haW5NZW51UnNzICsgZWRpdE1lbnUgKyBtb3ZlTWVudSArIGF0dGFjaG1lbnRNZW51ICsgc2hhcmluZ01lbnUgKyB2aWV3T3B0aW9uc01lbnUgKyBzZWFyY2hNZW51ICsgdGltZWxpbmVNZW51ICsgbXlBY2NvdW50TWVudVxyXG4gICAgICAgICAgICAgICAgKyBhZG1pbk1lbnUgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwb2RjYXN0LmpzXCIpO1xuXG4vKlxuTk9URTogVGhlIEF1ZGlvUGxheWVyRGxnIEFORCB0aGlzIHNpbmdsZXRvbi1pc2ggY2xhc3MgYm90aCBzaGFyZSBzb21lIHN0YXRlIGFuZCBjb29wZXJhdGVcblxuUmVmZXJlbmNlOiBodHRwczovL3d3dy53My5vcmcvMjAxMC8wNS92aWRlby9tZWRpYWV2ZW50cy5odG1sXG4qL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwb2RjYXN0IHtcbiAgICAgICAgZXhwb3J0IGxldCBwbGF5ZXI6IGFueSA9IG51bGw7XG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRUaW1lUGVuZGluZzogbnVtYmVyID0gbnVsbDtcblxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XG4gICAgICAgIGxldCBhZFNlZ21lbnRzOiBBZFNlZ21lbnRbXSA9IG51bGw7XG5cbiAgICAgICAgbGV0IHB1c2hUaW1lcjogYW55ID0gbnVsbDtcblxuICAgICAgICBleHBvcnQgbGV0IGdlbmVyYXRlUlNTID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZW5lcmF0ZVJTU1JlcXVlc3QsIGpzb24uR2VuZXJhdGVSU1NSZXNwb25zZT4oXCJnZW5lcmF0ZVJTU1wiLCB7XG4gICAgICAgICAgICB9LCBnZW5lcmF0ZVJTU1Jlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBnZW5lcmF0ZVJTU1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBhbGVydCgncnNzIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0aXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZFRpdGxlXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IGRlc2M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWREZXNjXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IGltZ1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCIsIG5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgZmVlZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcImgyXCIsIHtcbiAgICAgICAgICAgICAgICB9LCB0aXRsZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgICAgIH0sIGRlc2MudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBmZWVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZmVlZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbWdVcmwpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImltZ1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXgtd2lkdGg6IDIwMHB4O1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBpbWdVcmwudmFsdWVcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCBsaW5rOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtTGlua1wiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChsaW5rICYmIGxpbmsudmFsdWUgJiYgbGluay52YWx1ZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5rLnZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKHVyaSAmJiB1cmkudmFsdWUgJiYgdXJpLnZhbHVlLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCIubXAzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVyaS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVuY1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1VybFwiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChlbmNVcmwgJiYgZW5jVXJsLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVuY1R5cGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1FbmNUeXBlXCIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChlbmNUeXBlICYmIGVuY1R5cGUudmFsdWUgJiYgZW5jVHlwZS52YWx1ZS5zdGFydHNXaXRoKFwiYXVkaW8vXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNVcmwudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySXRlbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgcnNzVGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NEZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NBdXRob3I6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1BdXRob3JcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzTGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzVXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgZW50cnk6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChyc3NMaW5rICYmIHJzc0xpbmsudmFsdWUgJiYgcnNzVGl0bGUgJiYgcnNzVGl0bGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHJlZlwiOiByc3NMaW5rLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgcmVuZGVyLnRhZyhcImgzXCIsIHt9LCByc3NUaXRsZS52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGxheWVyVXJsID0gZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZShub2RlKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXJVcmwpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Qub3BlblBsYXllckRpYWxvZygnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJQbGF5XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocnNzRGVzYyAmJiByc3NEZXNjLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgICAgIH0sIHJzc0Rlc2MudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocnNzQXV0aG9yICYmIHJzc0F1dGhvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIH0sIFwiQnk6IFwiICsgcnNzQXV0aG9yLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgZW50cnkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0ZlZWROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkRGVzY1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRMaW5rXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFVyaVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRTcmNcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0l0ZW1Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1BdXRob3JcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9wZW5QbGF5ZXJEaWFsb2cgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHVpZCA9IF91aWQ7XG4gICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xuXG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBtcDNVcmwgPSBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChtcDNVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0UGxheWVySW5mb1JlcXVlc3QsIGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlPihcImdldFBsYXllckluZm9cIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogbXAzVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRQbGF5ZXJJbmZvUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VWlkKHVpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGxnID0gbmV3IEF1ZGlvUGxheWVyRGxnKG1wM1VybCwgdWlkLCByZXMudGltZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkbGcub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRVaWQgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFkU2VnczoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJhZC1zZWdtZW50c1wiLCBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRTZWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VGV4dChhZFNlZ3MudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlIHVpZDogXCIgKyB1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRUZXh0ID0gZnVuY3Rpb24oYWRTZWdzOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGFkU2VnbWVudHMgPSBbXTtcblxuICAgICAgICAgICAgbGV0IHNlZ0xpc3Q6IHN0cmluZ1tdID0gYWRTZWdzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnIG9mIHNlZ0xpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VnVGltZXM6IHN0cmluZ1tdID0gc2VnLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VnVGltZXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgcmFuZ2U6IFwiICsgc2VnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGJlZ2luU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1swXSk7XG4gICAgICAgICAgICAgICAgbGV0IGVuZFNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMV0pO1xuXG4gICAgICAgICAgICAgICAgYWRTZWdtZW50cy5wdXNoKG5ldyBBZFNlZ21lbnQoYmVnaW5TZWNzLCBlbmRTZWNzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBjb252ZXJ0IGZyb20gZm9tcmF0IFwibWludXRlczpzZWNvbnRzXCIgdG8gYWJzb2x1dGUgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAgICAgKlxuICAgICAgICAqIHRvZG8tMDogbWFrZSB0aGlzIGFjY2VwdCBqdXN0IHNlY29uZHMsIG9yIG1pbjpzZWMsIG9yIGhvdXI6bWluOnNlYywgYW5kIGJlIGFibGUgdG9cbiAgICAgICAgKiBwYXJzZSBhbnkgb2YgdGhlbSBjb3JyZWN0bHkuXG4gICAgICAgICovXG4gICAgICAgIGxldCBjb252ZXJ0VG9TZWNvbmRzID0gZnVuY3Rpb24odGltZVZhbDogc3RyaW5nKSB7XG4gICAgICAgICAgICAvKiBlbmQgdGltZSBpcyBkZXNpZ25hdGVkIHdpdGggYXN0ZXJpc2sgYnkgdXNlciwgYW5kIHJlcHJlc2VudGVkIGJ5IC0xIGluIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgaWYgKHRpbWVWYWwgPT0gJyonKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBsZXQgdGltZVBhcnRzOiBzdHJpbmdbXSA9IHRpbWVWYWwuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgaWYgKHRpbWVQYXJ0cy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHZhbHVlOiBcIiArIHRpbWVWYWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMF0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMV0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICogNjAgKyBzZWNvbmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZXN0b3JlU3RhcnRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKiBtYWtlcyBwbGF5ZXIgYWx3YXlzIHN0YXJ0IHdoZXJldmVyIHRoZSB1c2VyIGxhc3Qgd2FzIHdoZW4gdGhleSBjbGlja2VkIFwicGF1c2VcIiAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBzdGFydFRpbWVQZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc3RhcnRUaW1lUGVuZGluZztcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVQZW5kaW5nID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25DYW5QbGF5ID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBwbGF5ZXIgPSBlbG07XG4gICAgICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvblRpbWVVcGRhdGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZywgZWxtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmICghcHVzaFRpbWVyKSB7XG4gICAgICAgICAgICAgICAgLyogcGluZyBzZXJ2ZXIgb25jZSBldmVyeSBmaXZlIG1pbnV0ZXNcblxuICAgICAgICAgICAgICAgICAgcGluZ2luZyBldmVyeSAxMCBzZWNvbmRzLCBmb3IgcnVubmluZyBhIHRlc3QgKHRvZG8tMDA6IHB1dCBiYWNrIHRvIDUqNjAqMTAwICg1IG1pbnV0ZXMpKVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcHVzaFRpbWVyID0gc2V0SW50ZXJ2YWwocHVzaFRpbWVyRnVuY3Rpb24sIDEwKjEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkN1cnJlbnRUaW1lPVwiICsgZWxtLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIHBsYXllciA9IGVsbTtcblxuICAgICAgICAgICAgLyogdG9kby0xOiB3ZSBjYWxsIHJlc3RvcmVTdGFydFRpbWUgdXBvbiBsb2FkaW5nIG9mIHRoZSBjb21wb25lbnQgYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBoYXZlIHRoZSBlZmZlY3QgZG9pbmcgYW55dGhpbmcgYXQgYWxsXG4gICAgICAgICAgICBhbmQgY2FuJ3QgZXZlbiB1cGRhdGUgdGhlIHNsaWRlciBkaXNwbGF5ZWQgcG9zaXRpb24sIHVudGlsIHBsYXlpbnMgaXMgU1RBUlRFRC4gTmVlZCB0byBjb21lIGJhY2sgYW5kIGZpeCB0aGlzIGJlY2F1c2UgdXNlcnNcbiAgICAgICAgICAgIGN1cnJlbnRseSBoYXZlIHRoZSBnbGl0Y2ggb2YgYWx3YXlzIGhlYXJpbmcgdGhlIGZpcnN0IGZyYWN0aW9uIG9mIGEgc2Vjb25kIG9mIHZpZGVvLCB3aGljaCBvZiBjb3Vyc2UgYW5vdGhlciB3YXkgdG8gZml4XG4gICAgICAgICAgICB3b3VsZCBiZSBieSBhbHRlcmluZyB0aGUgdm9sdW1uIHRvIHplcm8gdW50aWwgcmVzdG9yZVN0YXJ0VGltZSBoYXMgZ29uZSBpbnRvIGVmZmVjdCAqL1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuXG4gICAgICAgICAgICBpZiAoIWFkU2VnbWVudHMpIHJldHVybjtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBhZFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgLyogZW5kVGltZSBvZiAtMSBtZWFucyB0aGUgcmVzdCBvZiB0aGUgbWVkaWEgc2hvdWxkIGJlIGNvbnNpZGVyZWQgQURzICovXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5jdXJyZW50VGltZSA+PSBzZWcuYmVnaW5UaW1lICYmIC8vXG4gICAgICAgICAgICAgICAgICAgIChwbGF5ZXIuY3VycmVudFRpbWUgPD0gc2VnLmVuZFRpbWUgfHwgc2VnLmVuZFRpbWUgPCAwKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gZW5kIG9mIGF1ZGlvIGlmIHJlc3QgaXMgYW4gYWRkLCB3aXRoIGxvZ2ljIG9mIC0zIHRvIGVuc3VyZSB3ZSBkb24ndFxuICAgICAgICAgICAgICAgICAgICBnbyBpbnRvIGEgbG9vcCBqdW1waW5nIHRvIGVuZCBvdmVyIGFuZCBvdmVyIGFnYWluICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWcuZW5kVGltZSA8IDAgJiYgcGxheWVyLmN1cnJlbnRUaW1lIDwgcGxheWVyLmR1cmF0aW9uIC0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoganVtcCB0byBsYXN0IHRvIHNlY29uZHMgb2YgYXVkaW8sIGknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHBhdXNpbmcsIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBhcmUgaXMgbW9yZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGFib3V0IHRvIHBsYXksIHdlIGRvbid0IHdhbnQgdG8gaGFsdCBpdCBhbGwgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBwbGF5ZXIuZHVyYXRpb24gLSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIG9yIGVsc2Ugd2UgYXJlIGluIGEgY29tZXJjaWFsIHNlZ21lbnQgc28ganVtcCB0byBvbmUgc2Vjb25kIHBhc3QgaXQgKi9cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzZWcuZW5kVGltZSArIDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kby0wOiBmb3IgcHJvZHVjdGlvbiwgYm9vc3QgdGhpcyB1cCB0byBvbmUgbWludXRlICovXG4gICAgICAgIGV4cG9ydCBsZXQgcHVzaFRpbWVyRnVuY3Rpb24gPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGltZXJcIik7XG4gICAgICAgICAgICAvKiB0aGUgcHVycG9zZSBvZiB0aGlzIHRpbWVyIGlzIHRvIGJlIHN1cmUgdGhlIGJyb3dzZXIgc2Vzc2lvbiBkb2Vzbid0IHRpbWVvdXQgd2hpbGUgdXNlciBpcyBwbGF5aW5nXG4gICAgICAgICAgICBidXQgaWYgdGhlIG1lZGlhIGlzIHBhdXNlZCB3ZSBETyBhbGxvdyBpdCB0byB0aW1lb3V0LiBPdGh3ZXJ3aXNlIGlmIHVzZXIgaXMgbGlzdGVuaW5nIHRvIGF1ZGlvLCB3ZVxuICAgICAgICAgICAgY29udGFjdCB0aGUgc2VydmVyIGR1cmluZyB0aGlzIHRpbWVyIHRvIHVwZGF0ZSB0aGUgdGltZSBvbiB0aGUgc2VydmVyIEFORCBrZWVwIHNlc3Npb24gZnJvbSB0aW1pbmcgb3V0XG5cbiAgICAgICAgICAgIHRvZG8tMDogd291bGQgZXZlcnl0aGluZyB3b3JrIGlmICdwbGF5ZXInIFdBUyB0aGUganF1ZXJ5IG9iamVjdCBhbHdheXMuXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiAhcGxheWVyLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIC8qIHRoaXMgc2FmZXR5IGNoZWNrIHRvIGJlIHN1cmUgbm8gaGlkZGVuIGF1ZGlvIGNhbiBzdGlsbCBiZSBwbGF5aW5nIHNob3VsZCBubyBsb25nZXIgYmUgbmVlZGVkXG4gICAgICAgICAgICAgICAgbm93IHRoYXQgSSBoYXZlIHRoZSBjbG9zZSBsaXRlbmVyIGV2ZW4gb24gdGhlIGRpYWxvZywgYnV0IGknbGwgbGVhdmUgdGhpcyBoZXJlIGFueXdheS4gQ2FuJ3QgaHVydC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoISQocGxheWVyKS5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2luZyBwbGF5ZXIsIGJlY2F1c2UgaXQgd2FzIGRldGVjdGVkIGFzIG5vdCB2aXNpYmxlLiBwbGF5ZXIgZGlhbG9nIGdldCBoaWRkZW4/XCIpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkF1dG9zYXZlIHBsYXllciBpbmZvLlwiKTtcbiAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IHBhdXNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZGVzdHJveVBsYXllciA9IGZ1bmN0aW9uKGRsZzogQXVkaW9QbGF5ZXJEbGcpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcGxheSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNwZWVkID0gZnVuY3Rpb24ocmF0ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBsYXliYWNrUmF0ZSA9IHJhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgICAgIGV4cG9ydCBsZXQgc2tpcCA9IGZ1bmN0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNhdmVQbGF5ZXJJbmZvID0gZnVuY3Rpb24odXJsOiBzdHJpbmcsIHRpbWVPZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLlNldFBsYXllckluZm9SZXNwb25zZT4oXCJzZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB1cmwsXG4gICAgICAgICAgICAgICAgXCJ0aW1lT2Zmc2V0XCI6IHRpbWVPZmZzZXQsXG4gICAgICAgICAgICAgICAgXCJub2RlUGF0aFwiOiBub2RlLnBhdGhcbiAgICAgICAgICAgIH0sIHNldFBsYXllckluZm9SZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2V0UGxheWVySW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdzYXZlIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucmVuZGVyRmVlZE5vZGU7XG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucmVuZGVySXRlbU5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nRmVlZE5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nSXRlbU5vZGU7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzeXN0ZW1mb2xkZXIuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc3lzdGVtZm9sZGVyIHtcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHBhdGhQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpwYXRoXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChwYXRoUHJvcCkge1xuICAgICAgICAgICAgICAgIHBhdGggKz0gcmVuZGVyLnRhZyhcImgyXCIsIHtcbiAgICAgICAgICAgICAgICB9LCBwYXRoUHJvcC52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCByZWluZGV4QnV0dG9uOiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zeXN0ZW1mb2xkZXIucmVpbmRleCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJSZWluZGV4XCIpO1xuXG4gICAgICAgICAgICBsZXQgc2VhcmNoQnV0dG9uOiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zeXN0ZW1mb2xkZXIuc2VhcmNoKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIlNlYXJjaFwiKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZWluZGV4QnV0dG9uICsgc2VhcmNoQnV0dG9uKTtcblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgcGF0aCArIGJ1dHRvbkJhcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBhdGggKyBidXR0b25CYXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGaWxlTGlzdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkpTT05fRklMRV9TRUFSQ0hfUkVTVUxULCBub2RlKTtcbiAgICAgICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XG4gICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSByZW5kZXIucmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eShzZWFyY2hSZXN1bHRQcm9wLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZmlsZUxpc3RQcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0Ompzb25cIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlaW5kZXggPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5GaWxlU2VhcmNoUmVxdWVzdCwganNvbi5GaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNlbE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicmVpbmRleFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sIHJlaW5kZXhSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVpbmRleFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJSZWluZGV4IGNvbXBsZXRlLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAobmV3IG02NC5TZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0OnBhdGhcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucHJvcE9yZGVyaW5nO1xuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyRmlsZUxpc3ROb2RlO1xubTY0Lm1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6ZmlsZWxpc3RcIl0gPSBtNjQuc3lzdGVtZm9sZGVyLmZpbGVMaXN0UHJvcE9yZGVyaW5nO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRGlhbG9nQmFzZS5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgLypcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICAgICAqXG4gICAgICogdG9kbzogd2hlbiByZWZhY3RvcmluZyBhbGwgZGlhbG9ncyB0byB0aGlzIG5ldyBiYXNlLWNsYXNzIGRlc2lnbiBJJ20gYWx3YXlzXG4gICAgICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICAgICAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gICAgICogdGhleSBoYXZlIGJlZW4gY29uc3RydWN0ZWQgd2hlcmUgdGhleSBtZXJlbHkgaGF2ZSB0byBiZSByZXNob3duIGFuZFxuICAgICAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAgICAgKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgaG9yaXpDZW50ZXJEbGdDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcblxuICAgICAgICBkYXRhOiBhbnk7XG4gICAgICAgIGJ1aWx0OiBib29sZWFuO1xuICAgICAgICBndWlkOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvbUlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2UgcmVnaXN0ZXIgJ3RoaXMnIHNvIHdlIGNhbiBkbyBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogYXMgc3RyaW5ncy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICAgICAgYW55IGRlZmF1bHRzIG9yIHZhbHVlcyBpbiBmb3IgZmllbGRzLCBldGMuIHNob3VsZCBiZSBzZXQgd2hlbiB0aGUgZGlhbG9nIGlzIGRpc3BsYXllZCAqL1xuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VFdmVudCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGlzLmlkKHRoaXMuZG9tSWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICAgICAqIG9uY2UgaXQncyBjbG9zZWQsIEFORCB0aGF0IHNhbWUgY29kZSBzaG91bGQgZGVsZXRlIHRoZSBndWlkJ3Mgb2JqZWN0IGluXG4gICAgICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFwZXItZGlhbG9nXCIpO1xuXG4gICAgICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgICAgICAvL25vZGUuc2V0QXR0cmlidXRlKFwid2l0aC1iYWNrZHJvcFwiLCBcIndpdGgtYmFja2Ryb3BcIik7XG5cbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMzogcHV0IGluIENTUyBub3dcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcblxuXG4gICAgICAgICAgICBpZiAodGhpcy5ob3JpekNlbnRlckRsZ0NvbnRlbnQpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAvL2hvd3RvOiBleGFtcGxlIG9mIGhvdyB0byBjZW50ZXIgYSBkaXYgaW4gYW5vdGhlciBkaXYuIFRoaXMgZGl2IGlzIHRoZSBvbmUgYmVpbmcgY2VudGVyZWQuXG4gICAgICAgICAgICAgICAgICAgICAgLy9UaGUgdHJpY2sgdG8gZ2V0dGluZyB0aGUgbGF5b3V0IHdvcmtpbmcgd2FzIE5PVCBzZXR0aW5nIHRoaXMgd2lkdGggdG8gMTAwJSBldmVuIHRob3VnaCBzb21laG93XG4gICAgICAgICAgICAgICAgICAgICAgLy90aGUgbGF5b3V0IGRvZXMgcmVzdWx0IGluIGl0IGJlaW5nIDEwMCUgaSB0aGluay5cbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIiA6IFwibWFyZ2luOiAwIGF1dG87IG1heC13aWR0aDogODAwcHg7XCIgLy9cIm1hcmdpbjogMCBhdXRvOyB3aWR0aDogODAwcHg7XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIGxldCBsZWZ0ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgICAgICAvLyB9LCBcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgLy8gbGV0IGNlbnRlciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJzdHlsZVwiOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXG4gICAgICAgICAgICAgICAgLy8gfSwgdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQgcmlnaHQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgICAgIC8vIH0sIFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBsZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBsZXQgdGFibGU6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIixcbiAgICAgICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGVcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgfSwgcm93KTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHV0aWwuc2V0SHRtbChpZCwgdGFibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgICAgIGEgbXVjaCBiZXR0ZXIgZGlhbG9nLiAqL1xuICAgICAgICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5idWlsZCgpO1xuICAgICAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImNsYXNzXCIgOiBcIm1haW4tZGlhbG9nLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoaWQsIGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGxldCBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKGlkKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGkgdHJpZWQgdG8gdHdlYWsgdGhlIHBsYWNlbWVudCBvZiB0aGUgZGlhbG9nIHVzaW5nIGZpdEludG8sIGFuZCBpdCBkaWRuJ3Qgd29ya1xuICAgICAgICAgICAgc28gSSdtIGp1c3QgdXNpbmcgdGhlIHBhcGVyLWRpYWxvZyBDU1Mgc3R5bGluZyB0byBhbHRlciB0aGUgZGlhbG9nIHNpemUgdG8gZnVsbHNjcmVlblxuICAgICAgICAgICAgbGV0IGlyb25QYWdlcyA9IHV0aWwucG9seUVsbShcIm1haW5Jcm9uUGFnZXNcIik7XG5cbiAgICAgICAgICAgIEFmdGVyIHRoZSBUeXBlU2NyaXB0IGNvbnZlcnNpb24gSSBub3RpY2VkIGhhdmluZyBhIG1vZGFsIGZsYWcgd2lsbCBjYXVzZVxuICAgICAgICAgICAgYW4gaW5maW5pdGUgbG9vcCAoY29tcGxldGVseSBoYW5nKSBDaHJvbWUgYnJvd3NlciwgYnV0IHRoaXMgaXNzdWUgaXMgbW9zdCBsaWtlbHlcbiAgICAgICAgICAgIG5vdCByZWxhdGVkIHRvIFR5cGVTY3JpcHQgYXQgYWxsLCBidXQgaSdtIGp1c3QgbWVudGlvbiBUUyBqdXN0IGluIGNhc2UsIGJlY2F1c2VcbiAgICAgICAgICAgIHRoYXQncyB3aGVuIEkgbm90aWNlZCBpdC4gRGlhbG9ncyBhcmUgZmluZSBidXQgbm90IGEgZGlhbG9nIG9uIHRvcCBvZiBhbm90aGVyIGRpYWxvZywgd2hpY2ggaXNcbiAgICAgICAgICAgIHRoZSBjYXNlIHdoZXJlIGl0IGhhbmdzIGlmIG1vZGVsPXRydWVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUubm9DYW5jZWxPbk91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5ob3Jpem9udGFsT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLnZlcnRpY2FsT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmZpdEludG8gPSBpcm9uUGFnZXMubm9kZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY2VudGVyKCk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUub3BlbigpO1xuXG4gICAgICAgICAgICAvL3ZhciBkaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5EaWFsb2cnKTtcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaXJvbi1vdmVybGF5LWNsb3NlZCcsIGZ1bmN0aW9uKGN1c3RvbUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy92YXIgaWQgPSAoPGFueT5jdXN0b21FdmVudC5jdXJyZW50VGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqIERpYWxvZzogXCIgKyBpZCArIFwiIGlzIGNsb3NlZCFcIik7XG4gICAgICAgICAgICAgICAgdGhpei5jbG9zZUV2ZW50KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHNldHRpbmcgdG8gemVybyBtYXJnaW4gaW1tZWRpYXRlbHksIGFuZCB0aGVuIGFsbW9zdCBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWZ0ZSAxLjUgc2Vjb25kc1xuICAgICAgICAgICAgaXMgYSByZWFsbHkgdWdseSBoYWNrLCBidXQgSSBjb3VsZG4ndCBmaW5kIHRoZSByaWdodCBzdHlsZSBjbGFzcyBvciB3YXkgb2YgZG9pbmcgdGhpcyBpbiB0aGUgZ29vZ2xlXG4gICAgICAgICAgICBkb2NzIG9uIHRoZSBkaWFsb2cgY2xhc3MuXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcblxuICAgICAgICAgICAgLyogSSdtIGRvaW5nIHRoaXMgaW4gZGVzcGFyYXRpb24uIG5vdGhpbmcgZWxzZSBzZWVtcyB0byBnZXQgcmlkIG9mIHRoZSBtYXJnaW4gKi9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvOiBuZWVkIHRvIGNsZWFudXAgdGhlIHJlZ2lzdGVyZWQgSURzIHRoYXQgYXJlIGluIG1hcHMgZm9yIHRoaXMgZGlhbG9nICovXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHRoaXMuZG9tSWQpKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAgICAgKiBzdWZmaXggYXBwZW5kZWQpXG4gICAgICAgICAqL1xuICAgICAgICBpZCA9IChpZCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIl9kbGdJZFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZCArIFwiX2RsZ0lkXCIgKyB0aGlzLmRhdGEuZ3VpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VQYXNzd29yZEZpZWxkID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VFZGl0RmllbGQgPSAoZmllbGROYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU1lc3NhZ2VBcmVhID0gKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaWFsb2ctbWVzc2FnZVwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgICAgIG1ha2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG5cbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSBpcyByZXF1aXJlZCAobG9naWMgZmFpbHMgd2l0aG91dClcbiAgICAgICAgICAgICAgICBcImRpYWxvZy1jb25maXJtXCI6IFwiZGlhbG9nLWNvbmZpcm1cIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgb25DbGljayA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9uQ2xpY2sgKz0gXCI7XCIgKyBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBvbkNsaWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbGx5VmlzaWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wic3R5bGVcIl0gPSBcImRpc3BsYXk6bm9uZTtcIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmRFbnRlcktleSA9IChpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRIdG1sID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VSYWRpb0J1dHRvbiA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VDaGVja0JveCA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nLCBpbml0aWFsU3RhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcblxuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIC8vXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICA8cGFwZXItY2hlY2tib3ggb24tY2hhbmdlPVwiY2hlY2tib3hDaGFuZ2VkXCI+Y2xpY2s8L3BhcGVyLWNoZWNrYm94PlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNoZWNrYm94Q2hhbmdlZCA6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIC8vICAgICBpZihldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGVja2JveDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGNoZWNrYm94ICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUhlYWRlciA9ICh0ZXh0OiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjZW50ZXJlZD86IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogLypcImRpYWxvZy1oZWFkZXIgXCIgKyovIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIikrXCIgZGlhbG9nLWhlYWRlclwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIG1ha2luZyB0aGlzIEgyIHRhZyBjYXVzZXMgZ29vZ2xlIHRvIGRyYWcgaW4gYSBidW5jaCBvZiBpdHMgb3duIHN0eWxlcyBhbmQgYXJlIGhhcmQgdG8gb3ZlcnJpZGUgKi9cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIGF0dHJzLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvY3VzID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcbiAgICAgICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDb25maXJtRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ29uZmlybURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGl0bGU6IHN0cmluZywgcHJpdmF0ZSBtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGUgYnV0dG9uVGV4dDogc3RyaW5nLCBwcml2YXRlIHllc0NhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgIHByaXZhdGUgbm9DYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNvbmZpcm1EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQ6IHN0cmluZyA9IHRoaXMubWFrZUhlYWRlcihcIlwiLCBcIkNvbmZpcm1EbGdUaXRsZVwiKSArIHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiXCIsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk5vXCIsIFwiQ29uZmlybURsZ05vQnV0dG9uXCIsIHRoaXMubm9DYWxsYmFjayk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLmJ1dHRvblRleHQsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByb2dyZXNzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gcmVuZGVyLnRhZyhcInBhcGVyLXByb2dyZXNzXCIsIHtcbiAgICAgICAgICAgICAgICBcImluZGV0ZXJtaW5hdGVcIjogXCJpbmRldGVybWluYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgICAgIFwibWluXCI6IFwiMTAwXCIsXG4gICAgICAgICAgICAgICAgXCJtYXhcIjogXCIxMDAwXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmFyQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjI4MHB4OyBtYXJnaW46MjRweDtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiXG4gICAgICAgICAgICB9LCBwcm9ncmVzc0Jhcik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBiYXJDb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBNZXNzYWdlRGxnLmpzXCIpO1xyXG5cclxuLypcclxuICogQ2FsbGJhY2sgY2FuIGJlIG51bGwgaWYgeW91IGRvbid0IG5lZWQgdG8gcnVuIGFueSBmdW5jdGlvbiB3aGVuIHRoZSBkaWFsb2cgaXMgY2xvc2VkXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNZXNzYWdlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZT86IGFueSwgcHJpdmF0ZSB0aXRsZT86IGFueSwgcHJpdmF0ZSBjYWxsYmFjaz86IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMudGl0bGUpICsgXCI8cD5cIiArIHRoaXMubWVzc2FnZSArIFwiPC9wPlwiO1xyXG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IExvZ2luRGxnLmpzXCIpO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkvanF1ZXJ5LmQudHNcIiAvPlxuXG4vKlxuTm90ZTogVGhlIGpxdWVyeSBjb29raWUgbG9va3MgZm9yIGpxdWVyeSBkLnRzIGluIHRoZSByZWxhdGl2ZSBsb2NhdGlvbiBcIlwiLi4vanF1ZXJ5XCIgc28gYmV3YXJlIGlmIHlvdXJcbnRyeSB0byByZW9yZ2FuaXplIHRoZSBmb2xkZXIgc3RydWN0dXJlIEkgaGF2ZSBpbiB0eXBlZGVmcywgdGhpbmdzIHdpbGwgY2VydGFpbmx5IGJyZWFrXG4qL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkxvZ2luRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJMb2dpblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHZhciBsb2dpbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkxvZ2luXCIsIFwibG9naW5CdXR0b25cIiwgdGhpcy5sb2dpbiwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbExvZ2luQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihsb2dpbkJ1dHRvbiArIHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcbiAgICAgICAgICAgIHZhciBkaXZpZGVyID0gXCI8ZGl2PjxoMz5PciBMb2dpbiBXaXRoLi4uPC9oMz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm0gPSBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IGZvcm07XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInVzZXJOYW1lXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJwYXNzd29yZFwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVGcm9tQ29va2llcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XG5cbiAgICAgICAgICAgIGlmICh1c3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwd2QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldFBhc3N3b3JkID0gKCk6IGFueSA9PiB7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFJlc2V0IFBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgICAgICBcIlllcywgcmVzZXQuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaWdudXBEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFO1xuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEVfU0hPUlQ7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJzaWdudXBVc2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkNhcHRjaGFcIiwgXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGEtaW1hZ2VcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCJcIi8vXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgICAgIHZhciBzaWdudXBCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaWdudXBcIiwgXCJzaWdudXBCdXR0b25cIiwgdGhpcy5zaWdudXAsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNpZ251cEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBVc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgICAgIHZhciBjYXB0Y2hhID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIC8qIG5vIHJlYWwgdmFsaWRhdGlvbiB5ZXQsIG90aGVyIHRoYW4gbm9uLWVtcHR5ICovXG4gICAgICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNvcnJ5LCB5b3UgY2Fubm90IGxlYXZlIGFueSBmaWVsZHMgYmxhbmsuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TaWdudXBSZXF1ZXN0LGpzb24uU2lnbnVwUmVzcG9uc2U+KFwic2lnbnVwXCIsIHtcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBcImNhcHRjaGFcIjogY2FwdGNoYVxuICAgICAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXBSZXNwb25zZSA9IChyZXM6IGpzb24uU2lnbnVwUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG5cbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJTaWdudXBcIlxuICAgICAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuaWQoXCJzaWdudXBVc2VyTmFtZVwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcmVmc0RsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUHJlZnNEbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUGVmZXJlbmNlc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9uR3JvdXAgPSByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tZ3JvdXBcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgICAgICB9LCByYWRpb0J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrQm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJTaG93IFJvdyBNZXRhZGF0YVwiLCBcInNob3dNZXRhRGF0YVwiLCBtZXRhNjQuc2hvd01ldGFEYXRhKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSByYWRpb0J1dHRvbkdyb3VwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNhdmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJlZmVyZW5jZXNCdXR0b25cIiwgdGhpcy5zYXZlUHJlZmVyZW5jZXMsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHJhZGlvQmFyICsgY2hlY2tib3hCYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tib3ggPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSBzaG93TWV0YURhdGFDaGVja2JveC5ub2RlLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCxcclxuICAgICAgICAgICAgICAgICAgICBcImVkaXRNb2RlXCI6IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdE5vZGVcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IG1ldGE2NC5zaG93TWV0YURhdGFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXNSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogcHV0IHRoZXNlIHR3byBsaW5lcyBpbiBhIHV0aWxpdHkgbWV0aG9kXHJcbiAgICAgICAgICAgIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1hbmFnZUFjY291bnREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZUFjY291bnRCdXR0b24gPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBcIkFkbWluIENhbm5vdCBDbG9zZSBBY291bnRcIiA6IHRoaXMubWFrZUJ1dHRvbihcIkNsb3NlIEFjY291bnRcIiwgXCJjbG9zZUFjY291bnRCdXR0b25cIiwgXCJwcmVmcy5jbG9zZUFjY291bnQoKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJ1dHRvbkJhciArIGJvdHRvbUJ1dHRvbkJhckRpdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRXhwb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRXhwb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFeHBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkV4cG9ydCB0byBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFeHBvcnQgdG8gRmlsZSBOYW1lXCIsIFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEV4cG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoZXhwb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldEZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyh0YXJnZXRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cG9ydFJlcXVlc3QsIGpzb24uRXhwb3J0UmVzcG9uc2U+KFwiZXhwb3J0VG9YbWxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldEZpbGVOYW1lXCI6IHRhcmdldEZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5leHBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uRXhwb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEltcG9ydERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEltcG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiSW1wb3J0RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJJbXBvcnQgZnJvbSBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJGaWxlIG5hbWUgdG8gaW1wb3J0XCIsIFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEltcG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZUZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkltcG9ydFJlcXVlc3QsanNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaENvbnRlbnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaFRhZ3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hUYWdzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSB0YWdzIHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hGaWxlc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaEZpbGVzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBsdWNlbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoRmlsZXNEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBGaWxlc1wiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaEJ1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hGaWxlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGVJZCA9IHNlbE5vZGUuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXG4gICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0XG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaEZpbGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgcHdkOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFzc0NvZGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgdGhlIHVzZXIgaXMgZG9pbmcgYSBcIlJlc2V0IFBhc3N3b3JkXCIgd2Ugd2lsbCBoYXZlIGEgbm9uLW51bGwgcGFzc0NvZGUgaGVyZSwgYW5kIHdlIHNpbXBseSBzZW5kIHRoaXMgdG8gdGhlIHNlcnZlclxyXG4gICAgICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMucGFzc0NvZGUgPyBcIlBhc3N3b3JkIFJlc2V0XCIgOiBcIkNoYW5nZSBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG5cclxuICAgICAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiTmV3IFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoYW5nZVBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZEFjdGlvbkJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbENoYW5nZVBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjaGFuZ2VQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnB3ZCAmJiB0aGlzLnB3ZC5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0LGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdQYXNzd29yZFwiOiB0aGlzLnB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBwYXNzd29yZFwiLCByZXMpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IFwiUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCI8cD5Zb3UgbWF5IG5vdyBsb2dpbiBhcyA8Yj5cIiArIHJlcy51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgXCI8L2I+IHdpdGggeW91ciBuZXcgcGFzc3dvcmQuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZywgXCJQYXNzd29yZCBDaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIGxvZ2luIGNhbGwgRE9FUyB3b3JrLCBidXQgdGhlIHJlYXNvbiB3ZSBkb24ndCBkbyB0aGlzIGlzIGJlY2F1c2UgdGhlIFVSTCBzdGlsbCBoYXMgdGhlIHBhc3NDb2RlIG9uIGl0IGFuZCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dhbnQgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIGEgdXJsIHdpdGhvdXQgdGhhdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cyhcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVzZXRQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB1c2VyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHlvdXIgdXNlciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIGFuZCBhIGNoYW5nZS1wYXNzd29yZCBsaW5rIHdpbGwgYmUgc2VudCB0byB5b3VcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVzZXQgbXkgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIikudHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlck5hbWUgJiYgZW1haWxBZGRyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZXNldFBhc3N3b3JkUmVxdWVzdCwganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWxBZGRyZXNzXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJPb3BzLiBUcnkgdGhhdCBhZ2Fpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVzZXQgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21GaWxlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvLTA6IFRoaXMgaXMgdWdseSB0byBwcmUtY3JlYXRlIHRoZXNlIGlucHV0IGZpZWxkcy4gTmVlZCB0byBtYWtlIHRoZW0gYWJsZSB0byBhZGQgZHluYW1pY2FsbHkuXG4gICAgICAgICAgICAgKiAoV2lsbCBkbyB0aGlzIG1vZGlmaWNhdGlvbiBvbmNlIEkgZ2V0IHRoZSBkcmFnLW4tZHJvcCBzdHVmZiB3b3JraW5nIGZpcnN0KVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmlsZXNcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiBib29sZWFuIGZpZWxkIHRvIHNwZWNpZnkgaWYgd2UgZXhwbG9kZSB6aXAgZmlsZXMgb250byB0aGUgSkNSIHRyZWUgKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJleHBsb2RlWmlwc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBcImVuY3R5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgICAgIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWwgPSAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIikpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEZ1bmMgPSAoZXhwbG9kZVppcHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIikpLmF0dHIoXCJ2YWx1ZVwiLCBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSBkbyBzb21ldGhpbmcgZGlmZmVyZW50bHkgZnJvbSB0aGUgbm9ybWFsICd1dGlsLmpzb24oKScgY2FsbHMgdG8gdGhlIHNlcnZlciwgYmVjYXVzZVxuICAgICAgICAgICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpLmRyb3B6b25lKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVGaWxlTGlzdCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IHRoaXMuZmlsZUxpc3QuY29uY2F0KGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkpO1xuXG4gICAgICAgICAgICAvKiBEZXRlY3QgaWYgYW55IFpJUCBmaWxlcyBhcmUgY3VycmVudGx5IHNlbGVjdGVkLCBhbmQgYXNrIHVzZXIgdGhlIHF1ZXN0aW9uIGFib3V0IHdoZXRoZXIgdGhleVxuICAgICAgICAgICAgc2hvdWxkIGJlIGV4dHJhY3RlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyB0aGUgdXBsb2FkLCBhbmQgdXBsb2FkZWQgYXMgaW5kaXZpZHVhbCBub2Rlc1xuICAgICAgICAgICAgZm9yIGVhY2ggZmlsZSAqL1xuICAgICAgICAgICAgaWYgKCF0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgJiYgdGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGZpbGUgb2YgdGhpcy5maWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuQnV0dG9uRW5hYmxlbWVudCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICBkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWd1cmVEcm9wWm9uZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbVVybERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uVXBsb2FkRnJvbVVybFJlcXVlc3QsIGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlPihcInVwbG9hZEZyb21VcmxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgICAgIH0sIHRoaXMudXBsb2FkRnJvbVVybFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZyb21VcmxSZXNwb25zZSA9IChyZXM6IGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcblxuLypcbiAqIEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGVzKVxuICpcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICAgICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZU5hbWU/OiBzdHJpbmcsIHByaXZhdGUgY3JlYXRlQXRUb3A/OmJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGVsZXRlUHJvcEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkRlbGV0ZVwiLCBcImRlbGV0ZVByb3BCdXR0b25cIiwgdGhpcy5kZWxldGVQcm9wZXJ0eUJ1dHRvbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uICsgZGVsZXRlUHJvcEJ1dHRvblxuICAgICAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDYwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyBtYXgtd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDt3aWR0aDoxMDAlOyBvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBcInZlcnRpY2FsLWxheW91dC1yb3dcIlxuICAgICAgICAgICAgICAgIC8vXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiXG4gICAgICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VuZXJhdGVzIGFsbCB0aGUgSFRNTCBlZGl0IGZpZWxkcyBhbmQgcHV0cyB0aGVtIGludG8gdGhlIERPTSBtb2RlbCBvZiB0aGUgcHJvcGVydHkgZWRpdG9yIGRpYWxvZyBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwb3B1bGF0ZUVkaXROb2RlUGcgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIC8qIGNsZWFyIHRoaXMgbWFwIHRvIGdldCByaWQgb2Ygb2xkIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgICAgIC8qIGVkaXROb2RlIHdpbGwgYmUgbnVsbCBpZiB0aGlzIGlzIGEgbmV3IG5vZGUgYmVpbmcgY3JlYXRlZCAqL1xuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICAvKiBpdGVyYXRvciBmdW5jdGlvbiB3aWxsIGhhdmUgdGhlIHdyb25nICd0aGlzJyBzbyB3ZSBzYXZlIHRoZSByaWdodCBvbmUgKi9cbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZSwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGJ1dHRvbkJhciA9IHRoaXoubWFrZVByb3BlcnR5RWRpdEJ1dHRvbkJhcihwcm9wLCBmaWVsZElkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlTXVsdGlQcm9wRWRpdG9yKHByb3BFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeSwgYWNlRmllbGRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKCghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkgfHwgZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcInByb3BlcnR5RWRpdExpc3RJdGVtSGlkZGVuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcInN0eWxlXCIgOiBcImRpc3BsYXk6IFwiKyAoIXJkT25seSB8fCBtZXRhNjQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiaW5saW5lXCIgOiBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAgICAgfSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogRWRpdGluZyBhIG5ldyBub2RlICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IHRoaXMgZW50aXJlIGJsb2NrIG5lZWRzIHJldmlldyBub3cgKHJlZGVzaWduKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBuZXcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRJZCA9IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogXCJcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOZXcgTm9kZSBOYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogSSBjYW4gcmVtb3ZlIHRoaXMgZGl2IG5vdyA/XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsgXCJkaXNwbGF5XCI6IFwidGFibGUtcm93XCIgfSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9JJ20gbm90IHF1aXRlIHJlYWR5IHRvIGFkZCB0aGlzIGJ1dHRvbiB5ZXQuXG4gICAgICAgICAgICAvLyB2YXIgdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikudG9nZ2xlU2hvd1JlYWRPbmx5KCk7XCIgLy9cbiAgICAgICAgICAgIC8vIH0sIC8vXG4gICAgICAgICAgICAvLyAgICAgKGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiSGlkZSBSZWFkLU9ubHkgUHJvcGVydGllc1wiIDogXCJTaG93IFJlYWQtT25seSBQcm9wZXJ0aWVzXCIpKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBmaWVsZHMgKz0gdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b247XG5cbiAgICAgICAgICAgIC8vbGV0IHJvdyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBsZWZ0ICsgY2VudGVyICsgcmlnaHQpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcFRhYmxlOiBzdHJpbmcgPSByZW5kZXIudGFnKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgIH0sIGZpZWxkcyk7XG5cblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSwgcHJvcFRhYmxlKTtcblxuICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoYWNlRmllbGRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKGFjZUZpZWxkc1tpXS52YWwudW5lbmNvZGVIdG1sKCkpO1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgICAgICA6IC8vXG4gICAgICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKSkuaHRtbChpbnN0cik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBBbGxvdyBhZGRpbmcgb2YgbmV3IHByb3BlcnRpZXMgYXMgbG9uZyBhcyB0aGlzIGlzIGEgc2F2ZWQgbm9kZSB3ZSBhcmUgZWRpdGluZywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YXJ0XG4gICAgICAgICAgICAgKiBtYW5hZ2luZyBuZXcgcHJvcGVydGllcyBvbiB0aGUgY2xpZW50IHNpZGUuIFdlIG5lZWQgYSBnZW51aW5lIG5vZGUgYWxyZWFkeSBzYXZlZCBvbiB0aGUgc2VydmVyIGJlZm9yZSB3ZSBhbGxvd1xuICAgICAgICAgICAgICogYW55IHByb3BlcnR5IGVkaXRpbmcgdG8gaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlCdXR0b25cIiksICFlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSk7XG5cbiAgICAgICAgICAgIHZhciB0YWdzUHJvcEV4aXN0cyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcInRhZ3NcIiwgZWRpdC5lZGl0Tm9kZSkgIT0gbnVsbDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGFzVGFnc1Byb3A6IFwiICsgdGFnc1Byb3ApO1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiKSwgIXRhZ3NQcm9wRXhpc3RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZVNob3dSZWFkT25seSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vIGFsZXJ0KFwibm90IHlldCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgICAgICAvLyBzZWUgc2F2ZUV4aXN0aW5nTm9kZSBmb3IgaG93IHRvIGl0ZXJhdGUgYWxsIHByb3BlcnRpZXMsIGFsdGhvdWdoIEkgd29uZGVyIHdoeSBJIGRpZG4ndCBqdXN0IHVzZSBhIG1hcC9zZXQgb2ZcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgZWxlbWVudHNcbiAgICAgICAgICAgIC8vIGluc3RlYWQgc28gSSBkb24ndCBuZWVkIHRvIHBhcnNlIGFueSBET00gb3IgZG9tSWRzIGlub3JkZXIgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IG9mIHRoZW0/Pz8/XG4gICAgICAgIH1cblxuICAgICAgICBhZGRQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdCA9IG5ldyBFZGl0UHJvcGVydHlEbGcodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3Qub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChlZGl0LmVkaXROb2RlLCBcInRhZ3NcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcInRhZ3NcIixcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBcIlwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZShyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOb3RlOiBmaWVsZElkIHBhcmFtZXRlciBpcyBhbHJlYWR5IGRpYWxvZy1zcGVjaWZpYyBhbmQgZG9lc24ndCBuZWVkIGlkKCkgd3JhcHBlciBmdW5jdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiB0b2RvLTA6IHRoaXMgZnVuY3Rpb24gY2FuIGJlIGRlbGV0ZWQgb25jZSB0aGUgY2hlY2tib3ggYW5kICBhY3Rpb24gYnV0dG9ucyBhcmUgaW1wbGVtZW50ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBtYWtlUHJvcGVydHlFZGl0QnV0dG9uQmFyID0gKHByb3A6IGFueSwgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgY2xlYXJCdXR0b24gPSBjbnN0LlNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUiA/IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuY2xlYXJQcm9wZXJ0eSgnXCIgKyBmaWVsZElkICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIkNsZWFyXCIpIDogXCJcIjtcblxuICAgICAgICAgICAgdmFyIGFkZE11bHRpQnV0dG9uID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBkZWxldGVCdXR0b24gPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocHJvcC5uYW1lICE9PSBqY3JDbnN0LkNPTlRFTlQgJiYgIXByb3AubmFtZS5zdGFydHNXaXRoKFwibWV0YTY0OlwiKSkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdyB3ZSBqdXN0IGdvIHdpdGggdGhlIGRlc2lnbiB3aGVyZSB0aGUgYWN0dWFsIGNvbnRlbnQgcHJvcGVydHkgY2Fubm90IGJlIGRlbGV0ZWQuIFVzZXIgY2FuIGxlYXZlXG4gICAgICAgICAgICAgICAgICogY29udGVudCBibGFuayBidXQgbm90IGRlbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuZGVsZXRlUHJvcGVydHkoJ1wiICsgcHJvcC5uYW1lICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiRGVsXCIpO1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBJIGRvbid0IHRoaW5rIGl0IHJlYWxseSBtYWtlcyBzZW5zZSB0byBhbGxvdyBhIGpjcjpjb250ZW50IHByb3BlcnR5IHRvIGJlIG11bHRpdmFsdWVkLiBJIG1heSBiZSB3cm9uZyBidXRcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIG15IGN1cnJlbnQgYXNzdW1wdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBUaGVyZSdzIGEgYnVnIGluIGVkaXRpbmcgbXVsdGlwbGUtdmFsdWVkIHByb3BlcnRpZXMsIGFuZCBzbyBpJ20ganVzdCB0dXJuaW5nIGl0IG9mZiBmb3Igbm93XG4gICAgICAgICAgICAgICAgLy93aGlsZSBpIGNvbXBsZXRlIHRlc3Rpbmcgb2YgdGhlIHJlc3Qgb2YgdGhlIGFwcC5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGFkZE11bHRpQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuYWRkU3ViUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBcIkFkZCBNdWx0aVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbEJ1dHRvbnMgPSBhZGRNdWx0aUJ1dHRvbiArIGNsZWFyQnV0dG9uICsgZGVsZXRlQnV0dG9uO1xuICAgICAgICAgICAgaWYgKGFsbEJ1dHRvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicHJvcGVydHktZWRpdC1idXR0b24tYmFyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZVByb3BlcnR5UmVxdWVzdCwganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlPihcImRlbGV0ZVByb3BlcnR5XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiAmJiYgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSwgcHJvcGVydHlUb0RlbGV0ZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBwcm9wZXJ0eVwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIHJlbW92ZSBkZWxldGVkIHByb3BlcnR5IGZyb20gY2xpZW50IHNpZGUgZGF0YSwgc28gd2UgY2FuIHJlLXJlbmRlciBzY3JlZW4gd2l0aG91dCBtYWtpbmcgYW5vdGhlciBjYWxsIHRvXG4gICAgICAgICAgICAgICAgICogc2VydmVyXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcHJvcHMuZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhKHByb3BlcnR5VG9EZWxldGUpO1xuXG4gICAgICAgICAgICAgICAgLyogbm93IGp1c3QgcmUtcmVuZGVyIHNjcmVlbiBmcm9tIGxvY2FsIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCksIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCldO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogc2NhbiBmb3IgYWxsIG11bHRpLXZhbHVlIHByb3BlcnR5IGZpZWxkcyBhbmQgY2xlYXIgdGhlbSAqL1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKSwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIGZvciBub3cganVzdCBsZXQgc2VydmVyIHNpZGUgY2hva2Ugb24gaW52YWxpZCB0aGluZ3MuIEl0IGhhcyBlbm91Z2ggc2VjdXJpdHkgYW5kIHZhbGlkYXRpb24gdG8gYXQgbGVhc3QgcHJvdGVjdFxuICAgICAgICAgKiBpdHNlbGYgZnJvbSBhbnkga2luZCBvZiBkYW1hZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBzYXZlTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJZiBlZGl0aW5nIGFuIHVuc2F2ZWQgbm9kZSBpdCdzIHRpbWUgdG8gcnVuIHRoZSBpbnNlcnROb2RlLCBvciBjcmVhdGVTdWJOb2RlLCB3aGljaCBhY3R1YWxseSBzYXZlcyBvbnRvIHRoZVxuICAgICAgICAgICAgICogc2VydmVyLCBhbmQgd2lsbCBpbml0aWF0ZSBmdXJ0aGVyIGVkaXRpbmcgbGlrZSBmb3IgcHJvcGVydGllcywgZXRjLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVOZXdOb2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogbmVlZCB0byBtYWtlIHRoaXMgY29tcGF0aWJsZSB3aXRoIEFjZSBFZGl0b3IuXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlTmV3Tm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEVsc2Ugd2UgYXJlIGVkaXRpbmcgYSBzYXZlZCBub2RlLCB3aGljaCBpcyBhbHJlYWR5IHNhdmVkIG9uIHNlcnZlci5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVFeGlzdGluZ05vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVOZXdOb2RlID0gKG5ld05vZGVOYW1lPzogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIW5ld05vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZU5hbWUgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIHdlIGRpZG4ndCBjcmVhdGUgdGhlIG5vZGUgd2UgYXJlIGluc2VydGluZyB1bmRlciwgYW5kIG5laXRoZXIgZGlkIFwiYWRtaW5cIiwgdGhlbiB3ZSBuZWVkIHRvIHNlbmQgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgKiBlbWFpbCB1cG9uIHNhdmluZyB0aGlzIG5ldyBub2RlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJOYW1lICE9IGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAmJiAvL1xuICAgICAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAhPSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGVkaXQubm9kZUluc2VydFRhcmdldCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydE5vZGVSZXF1ZXN0LCBqc29uLkluc2VydE5vZGVSZXNwb25zZT4oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnRJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROYW1lXCI6IGVkaXQubm9kZUluc2VydFRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIlxuICAgICAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ3JlYXRlU3ViTm9kZVJlcXVlc3QsIGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlPihcImNyZWF0ZVN1Yk5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0aGlzLnR5cGVOYW1lID8gdGhpcy50eXBlTmFtZSA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlQXRUb3BcIiA6IHRoaXMuY3JlYXRlQXRUb3BcbiAgICAgICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbC5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IHRhYmxlLWNlbGw7XCJcbiAgICAgICAgICAgIH0sIGZpZWxkcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlU2luZ2xlUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSwgYWNlRmllbGRzOiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eSBzaW5nbGUtdHlwZTogXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgPyBwcm9wVmFsIDogJyc7XG4gICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbFN0ci5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFraW5nIHNpbmdsZSBwcm9wIGVkaXRvcjogcHJvcFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCJdIHZhbFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgICAgICAgICsgXCJdIGZpZWxkSWQ9XCIgKyBwcm9wRW50cnkuaWQpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcFNlbENoZWNrYm94OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcFNlbENoZWNrYm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJcIiwgXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc2VsQ29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiA0MHB4OyBkaXNwbGF5OiB0YWJsZS1jZWxsOyBwYWRkaW5nOiAxMHB4O1wiXG4gICAgICAgICAgICB9LCBwcm9wU2VsQ2hlY2tib3gpO1xuXG4gICAgICAgICAgICBsZXQgZWRpdENvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweDtcIlxuICAgICAgICAgICAgfSwgZmllbGQpO1xuXG4gICAgICAgICAgICByZXR1cm4gc2VsQ29sICsgZWRpdENvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5QnV0dG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgb3ZlciBhbGwgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5maWVsZElkVG9Qcm9wTWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRJZFRvUHJvcE1hcC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgUHJvcEVudHJ5IGZvciB0aGlzIGl0ZW0gKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3A9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsUHJvcERvbUlkID0gXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IGNoZWNrYm94IGNvbnRyb2wgYW5kIGl0cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9kby0xOiBnZXR0aW5nIHZhbHVlIG9mIGNoZWNrYm94IHNob3VsZCBiZSBpbiBzb21lIHNoYXJlZCB1dGlsaXR5IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHNlbFByb3BEb21JZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbENoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQ6IGJvb2xlYW4gPSBzZWxDaGVja2JveC5ub2RlLmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3AgSVMgQ0hFQ0tFRD1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcm9wZXJ0eShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZm9yIG5vdyBsZXRzJyBqdXN0IHN1cHBvcnQgZGVsZXRpbmcgb25lIHByb3BlcnR5IGF0IGEgdGltZSwgYW5kIHNvIHdlIGNhbiByZXR1cm4gb25jZSB3ZSBmb3VuZCBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgb25lIHRvIGRlbGV0ZS4gV291bGQgYmUgZWFzeSB0byBleHRlbmQgdG8gYWxsb3cgbXVsdGlwbGUtc2VsZWN0cyBpbiB0aGUgZnV0dXJlICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInByb3BFbnRyeSBub3QgZm91bmQgZm9yIGlkOiBcIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcHJvcGVydHk6IFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0UHJvcGVydHlEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZSBQcm9wZXJ0eVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLnNhdmVQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlUHJvcGVydHlCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiJyBjbGFzcz0ncGF0aC1kaXNwbGF5LWluLWVkaXRvcic+PC9kaXY+XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVsYXRlUHJvcGVydHlFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gJyc7XG5cbiAgICAgICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wTmFtZUlkID0gXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcE5hbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcE5hbWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOYW1lXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogUHJvcGVydHkgVmFsdWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wVmFsdWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgdGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiVmFsdWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSwgZmllbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiKSk7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIikpO1xuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBwcm9wZXJ0eVZhbHVlRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIiA6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ndmVydGljYWwtbGF5b3V0LXJvdycgc3R5bGU9XFxcIndpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsO2JvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1xcXCIgaWQ9J1wiXG4gICAgICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdldHMgcHJpdmlsZWdlcyBmcm9tIHNlcnZlciBhbmQgZGlzcGxheXMgaW4gR1VJIGFsc28uIEFzc3VtZXMgZ3VpIGlzIGFscmVhZHkgYXQgY29ycmVjdCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5vZGUgc2hhcmluZyBpbmZvLlwiKTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSGFuZGxlcyBnZXROb2RlUHJpdmlsZWdlcyByZXNwb25zZS5cbiAgICAgICAgICpcbiAgICAgICAgICogcmVzPWpzb24gb2YgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZS5qYXZhXG4gICAgICAgICAqXG4gICAgICAgICAqIHJlcy5hY2xFbnRyaWVzID0gbGlzdCBvZiBBY2Nlc3NDb250cm9sRW50cnlJbmZvLmphdmEganNvbiBvYmplY3RzXG4gICAgICAgICAqL1xuICAgICAgICBnZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlU2hhcmluZ1BnKHJlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGdvdHRlbiBiYWNrIGZyb20gdGhlIHNlcnZlciBjb250YWluaW5nIEFDTCBpbmZvIHNvIHdlIGNhbiBwb3B1bGF0ZSB0aGUgc2hhcmluZyBwYWdlIGluIHRoZSBndWlcbiAgICAgICAgICovXG4gICAgICAgIHBvcHVsYXRlU2hhcmluZ1BnID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgVGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICQuZWFjaChyZXMuYWNsRW50cmllcywgZnVuY3Rpb24oaW5kZXgsIGFjbEVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1saXN0XCJcbiAgICAgICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcHVibGljQXBwZW5kQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChyZXMucHVibGljQXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgcHVibGljQXBwZW5kQXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIHRvZG86IHVzZSBhY3R1YWwgcG9seW1lciBwYXBlci1jaGVja2JveCBoZXJlICovXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBwdWJsaWNBcHBlbmRBdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfSwgXCJBbGxvdyBwdWJsaWMgY29tbWVudGluZyB1bmRlciB0aGlzIG5vZGUuXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIiksIGh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBVc2luZyBvbkNsaWNrIG9uIHRoZSBlbGVtZW50IEFORCB0aGlzIHRpbWVvdXQgaXMgdGhlIG9ubHkgaGFjayBJIGNvdWxkIGZpbmQgdG8gZ2V0IGdldCB3aGF0IGFtb3VudHMgdG8gYSBzdGF0ZVxuICAgICAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAgICAgKiBzaW1wbHkgYSBidWcgaW4gZ29vZ2xlIGNvZGUgQUZBSUsuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpei5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IChwb2x5RWxtLm5vZGUuY2hlY2tlZCA/IHRydWUgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW1vdmVQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlPihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICAgICAgfSwgdGhpcy5yZW1vdmVQcml2aWxlZ2VSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJBY2xQcml2aWxlZ2VzID0gKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1lbnRyeVwiXG4gICAgICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAobmV3IFNoYXJlVG9QZXJzb25EbGcoKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNoYXJpbmcgbm9kZSB0byBwdWJsaWMuXCIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFkZCBwcml2aWxlZ2UgYW5kIHRoZW4gcmVsb2FkIHNoYXJlIG5vZGVzIGRpYWxvZyBmcm9tIHNjcmF0Y2ggZG9pbmcgYW5vdGhlciBjYWxsYmFjayB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IFwiZXZlcnlvbmVcIixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5yZWxvYWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVuYW1lTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlbmFtZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgY3VyTm9kZU5hbWVEaXNwbGF5ID0gXCI8aDMgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2gzPlwiO1xuICAgICAgICAgICAgdmFyIGN1ck5vZGVQYXRoRGlzcGxheSA9IFwiPGg0IGNsYXNzPSdwYXRoLWRpc3BsYXknIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikgKyBcIic+PC9oND5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1lTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZUJ1dHRvblwiLCB0aGlzLnJlbmFtZU5vZGUsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVuYW1lTm9kZUJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgY3VyTm9kZU5hbWVEaXNwbGF5ICsgY3VyTm9kZVBhdGhEaXNwbGF5ICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlbGVjdCBhIG5vZGUgdG8gcmVuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogaWYgbm8gbm9kZSBiZWxvdyB0aGlzIG5vZGUsIHJldHVybnMgbnVsbCAqL1xuICAgICAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1pbmdSb290Tm9kZSA9IChoaWdobGlnaHROb2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVJZCk7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmFtZU5vZGVSZXF1ZXN0LCBqc29uLlJlbmFtZU5vZGVSZXNwb25zZT4oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5yZW5hbWVOb2RlUmVzcG9uc2UocmVzLCByZW5hbWluZ1Jvb3ROb2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UsIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlbmFtZSBub2RlXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgaGlnaGxpZ2h0Tm9kZS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEF1ZGlvUGxheWVyRGxnLmpzXCIpO1xyXG5cclxuLyogVGhpcyBpcyBhbiBhdWRpbyBwbGF5ZXIgZGlhbG9nIHRoYXQgaGFzIGFkLXNraXBwaW5nIHRlY2hub2xvZ3kgcHJvdmlkZWQgYnkgcG9kY2FzdC50cyAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBdWRpb1BsYXllckRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVVybDogc3RyaW5nLCBwcml2YXRlIG5vZGVVaWQ6IHN0cmluZywgcHJpdmF0ZSBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJBdWRpb1BsYXllckRsZ1wiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydFRpbWVQZW5kaW5nIGluIGNvbnN0cnVjdG9yOiBcIiArIHN0YXJ0VGltZVBlbmRpbmcpO1xyXG4gICAgICAgICAgICBwb2RjYXN0LnN0YXJ0VGltZVBlbmRpbmcgPSBzdGFydFRpbWVQZW5kaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogV2hlbiB0aGUgZGlhbG9nIGNsb3NlcyB3ZSBuZWVkIHRvIHN0b3AgYW5kIHJlbW92ZSB0aGUgcGxheWVyICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbCgpIHtcclxuICAgICAgICAgICAgc3VwZXIuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSAkKFwiI1wiICsgdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpKTtcclxuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBwbGF5ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLyogZm9yIHNvbWUgcmVhc29uIHRoZSBhdWRpbyBwbGF5ZXIgbmVlZHMgdG8gYmUgYWNjZXNzZWQgbGlrZSBpdCdzIGFuIGFycmF5ICovXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJbMF0ucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkF1ZGlvIFBsYXllclwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt0aGlzLm5vZGVVaWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5rbm93biBub2RlIHVpZDogXCIgKyB0aGlzLm5vZGVVaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyB3aGVyZSBJIG5lZWQgYSBzaG9ydCBuYW1lIG9mIHRoZSBtZWRpYSBiZWluZyBwbGF5ZWQgKi9cclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG4gICAgICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL3JlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvcmVmX2F2X2RvbS5hc3BcclxuICAgICAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgICAgICBsZXQgcGxheWVyQXR0cmliczogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgcGFkZGluZzowcHg7IG1hcmdpbi10b3A6IDBweDsgbWFyZ2luLWxlZnQ6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9udGltZXVwZGF0ZVwiOiBcIm02NC5wb2RjYXN0Lm9uVGltZVVwZGF0ZSgnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbmNhbnBsYXlcIjogXCJtNjQucG9kY2FzdC5vbkNhblBsYXkoJ1wiICsgdGhpcy5ub2RlVWlkICsgXCInLCB0aGlzKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY29udHJvbHNcIjogXCJjb250cm9sc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmVsb2FkXCIgOiBcImF1dG9cIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHJlbmRlci50YWcoXCJhdWRpb1wiLCBwbGF5ZXJBdHRyaWJzKTtcclxuXHJcbiAgICAgICAgICAgIC8vU2tpcHBpbmcgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoLTMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiPCAzMHNcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2tpcEZvcndhcmQzMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoMzAsICdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIzMHMgPlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBza2lwQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNraXBCYWNrMzBCdXR0b24gKyBza2lwRm9yd2FyZDMwQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vU3BlZWQgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc3BlZWROb3JtYWxCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgxLjApO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiTm9ybWFsXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMTVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgxLjUpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiMS41WFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGVlZDJ4QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc3BlZWQoMik7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIyWFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGVlZEJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzcGVlZE5vcm1hbEJ1dHRvbiArIHNwZWVkMTVCdXR0b24gKyBzcGVlZDJ4QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vRGlhbG9nIEJ1dHRvbnNcclxuICAgICAgICAgICAgbGV0IHBhdXNlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3QucGF1c2UoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlBhdXNlXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wbGF5KCk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGxheUJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlBsYXlcIik7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogZXZlbiBpZiB0aGlzIGJ1dHRvbiBhcHBlYXJzIHRvIHdvcmssIEkgbmVlZCBpdCB0byBleHBsaWNpdGx5IGVuZm9yY2UgdGhlIHNhdmluZyBvZiB0aGUgdGltZXZhbHVlIEFORCB0aGUgcmVtb3ZhbCBvZiB0aGUgQVVESU8gZWxlbWVudCBmcm9tIHRoZSBET00gKi9cclxuICAgICAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZUF1ZGlvUGxheWVyRGxnQnV0dG9uXCIsIHRoaXMuY2xvc2VCdG4pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihwbGF5QnV0dG9uICsgcGF1c2VCdXR0b24gKyBjbG9zZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZGVzY3JpcHRpb24gKyBwbGF5ZXIgKyBza2lwQnV0dG9uQmFyICsgc3BlZWRCdXR0b25CYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIobnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZUJ0biA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ3JlYXRlTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIENyZWF0ZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBsYXN0U2VsRG9tSWQ6IHN0cmluZztcbiAgICAgICAgbGFzdFNlbFR5cGVOYW1lOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNyZWF0ZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkNyZWF0ZSBOZXcgTm9kZVwiKTtcblxuICAgICAgICAgICAgbGV0IGNyZWF0ZUZpcnN0Q2hpbGRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBGaXJzdCBDaGlsZFwiLCBcImNyZWF0ZUZpcnN0Q2hpbGRCdXR0b25cIiwgdGhpcy5jcmVhdGVGaXJzdENoaWxkLCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBjcmVhdGVMYXN0Q2hpbGRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBMYXN0IENoaWxkXCIsIFwiY3JlYXRlTGFzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlTGFzdENoaWxkLCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBJbmxpbmVcIiwgXCJjcmVhdGVJbmxpbmVCdXR0b25cIiwgdGhpcy5jcmVhdGVJbmxpbmUsIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY3JlYXRlRmlyc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUxhc3RDaGlsZEJ1dHRvbiArIGNyZWF0ZUlubGluZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdHlwZUlkeCA9IDA7XG4gICAgICAgICAgICAvKiB0b2RvLTE6IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGVudW1lcmF0ZSBhbmQgYWRkIHRoZSB0eXBlcyB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoICovXG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3RhbmRhcmQgVHlwZVwiLCBcIm50OnVuc3RydWN0dXJlZFwiLCB0eXBlSWR4KyspO1xuICAgICAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlJTUyBGZWVkXCIsIFwibWV0YTY0OnJzc2ZlZWRcIiwgdHlwZUlkeCsrKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTeXN0ZW0gRm9sZGVyXCIsIFwibWV0YTY0OnN5c3RlbWZvbGRlclwiLCB0eXBlSWR4KyspO1xuXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEJveFwiXG4gICAgICAgICAgICB9LCBjb250ZW50KTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUxpc3RJdGVtKHZhbDogc3RyaW5nLCB0eXBlTmFtZTogc3RyaW5nLCB0eXBlSWR4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHBheWxvYWQ6IE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZUlkeFwiOiB0eXBlSWR4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0SXRlbVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpLFxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLm9uUm93Q2xpY2ssIHRoaXMsIHBheWxvYWQpXG4gICAgICAgICAgICB9LCB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kby0wMDogbm90IGltcGxlbWVudGVkIHlldDogY3VycmVudGx5IGp1c3QgZG9lcyAnY3JlYXRlIGxhc3QgY2hpbGQnIGZ1bmN0aW9uYWxpdHkgKi9cbiAgICAgICAgY3JlYXRlRmlyc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVMYXN0Q2hpbGQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUlubGluZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVkaXQuaW5zZXJ0Tm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvblJvd0NsaWNrID0gKHBheWxvYWQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IGRpdklkID0gdGhpcy5pZChcInR5cGVSb3dcIiArIHBheWxvYWQudHlwZUlkeCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxUeXBlTmFtZSA9IHBheWxvYWQudHlwZU5hbWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RTZWxEb21JZCkge1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmxhc3RTZWxEb21JZCkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0U2VsRG9tSWQgPSBkaXZJZDtcbiAgICAgICAgICAgICQoXCIjXCIgKyBkaXZJZCkuYWRkQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNlYXJjaFJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaFJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInNlYXJjaFJlc3VsdHNQYW5lbFwiO1xyXG4gICAgICAgIHRhYklkOiBzdHJpbmcgPSBcInNlYXJjaFRhYk5hbWVcIjtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3NlYXJjaFBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdGltZWxpbmVSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZVJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwidGltZWxpbmVUYWJOYW1lXCI7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSd0aW1lbGluZVZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3RpbWVsaW5lUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC50aW1lbGluZVBhZ2VUaXRsZSk7XHJcbiAgICAgICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnRpbWVsaW5lUmVzdWx0cywgXCJ0aW1lbGluZVZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==