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
        edit.startEditingNewNode = function (typeName) {
            edit.editingUnsavedNode = false;
            edit.editNode = null;
            edit.editNodeDlgInst = new m64.EditNodeDlg(typeName);
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
        edit.createSubNode = function (uid, typeName) {
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
            edit.startEditingNewNode(typeName);
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
            var selNodeIsMine = highlightNode && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
            var homeNodeSelected = highlightNode && meta64.homeNodeId == highlightNode.id;
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
            m64.util.setEnablement("openImportDlg", importFeatureEnabled && (selNodeIsMine || meta64.homeNodeId == highlightNode.id));
            m64.util.setEnablement("openExportDlg", exportFeatureEnabled && (selNodeIsMine || meta64.homeNodeId == highlightNode.id));
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
        function EditNodeDlg(typeName) {
            var _this = this;
            _super.call(this, "EditNodeDlg");
            this.typeName = typeName;
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
                        "typeName": _this.typeName ? _this.typeName : "nt:unstructured"
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
                var createChildButton = _this.makeCloseButton("Create Child", "createChildButton", _this.createChild, _this);
                var createInlineButton = _this.makeCloseButton("Create Inline", "createInlineButton", _this.createInline, _this);
                var backButton = _this.makeCloseButton("Cancel", "cancelButton");
                var buttonBar = m64.render.centeredButtonBar(createChildButton + createInlineButton + backButton);
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
            this.createChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.createSubNode(null, _this.lastSelTypeName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvc3lzdGVtZm9sZGVyLnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvZGxnL0NyZWF0ZU5vZGVEbGcudHMiLCIuLi90cy9wYW5lbC9zZWFyY2hSZXN1bHRzUGFuZWwudHMiLCIuLi90cy9wYW5lbC90aW1lbGluZVJlc3VsdHNQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0FBLFlBQVksQ0FBQztBQUtiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUs5QixJQUFJLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0FBQ0wsQ0FB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QUFDLEVBbEJTLEdBQUcsS0FBSCxHQUFHLFFBa0JaIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2VuZXJhdGVkIHVzaW5nIHR5cGVzY3JpcHQtZ2VuZXJhdG9yIHZlcnNpb24gMS4xMC1TTkFQU0hPVCBvbiAyMDE2LTA3LTMxIDIwOjIxOjAxLlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpzb24ge1xuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgICAgICAgICBwcmluY2lwYWxOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBQcml2aWxlZ2VJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IGJvb2xlYW47XG4gICAgICAgICAgICBoYXNCaW5hcnk6IGJvb2xlYW47XG4gICAgICAgICAgICBiaW5hcnlJc0ltYWdlOiBib29sZWFuO1xuICAgICAgICAgICAgYmluVmVyOiBudW1iZXI7XG4gICAgICAgICAgICB3aWR0aDogbnVtYmVyO1xuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgICAgICBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICB1aWQ6IHN0cmluZztcbiAgICAgICAgICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xuICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBEYXRlO1xuICAgICAgICAgICAgaW1nSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgICAgICAgICAgcHJpdmlsZWdlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eUluZm8ge1xuICAgICAgICAgICAgdHlwZTogbnVtYmVyO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgICAgICAgICBodG1sVmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIGFiYnJldmlhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgICAgICAgICBlZGl0TW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGFkdmFuY2VkTW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBpbXBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgICAgICAgICAgZXhwb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgICAgICAgICAgaWdub3JlVXJsOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3NDb2RlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIG5vZGVQYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFBsYXllckluZm9SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0RmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgaW5jbHVkZUFjbDogYm9vbGVhbjtcbiAgICAgICAgICAgIGluY2x1ZGVPd25lcnM6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlRmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBib29rTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdHJ1bmNhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0TmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHR6T2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgICBkc3Q6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ291dFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHRhcmdldE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0Q2hpbGRJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkczogc3RyaW5nW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIHNvcnREaXI6IHN0cmluZztcbiAgICAgICAgICAgIHNvcnRGaWVsZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hQcm9wOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICAgICAgcmVpbmRleDogYm9vbGVhblxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2U6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBuZXdOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdXBMZXZlbDogbnVtYmVyO1xuICAgICAgICAgICAgcmVuZGVyUGFyZW50SWZMZWFmOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVxdWVzdCB7XG4gICAgICAgICAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzaWJsaW5nSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICBjYXB0Y2hhOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlVXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICAgICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICAgICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGU6IFJlZkluZm87XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG4gICAgICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5U2F2ZWQ6IFByb3BlcnR5SW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgYXBwLmpzXCIpO1xuXG4vLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4vLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbihldmVudCkgeyBpZiAodHlwZW9mIG9ucmVzaXplID09PSAnZnVuY3Rpb24nKSBvbnJlc2l6ZSgpOyAvKiogLi4uICovIH1cblxudmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCB0eXBlb2YgKG9iamVjdCkgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICBvYmplY3QuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgIH1cbn07XG5cbi8qXG4gKiBXQVJOSU5HOiBUaGlzIGlzIGNhbGxlZCBpbiByZWFsdGltZSB3aGlsZSB1c2VyIGlzIHJlc2l6aW5nIHNvIGFsd2F5cyB0aHJvdHRsZSBiYWNrIGFueSBwcm9jZXNzaW5nIHNvIHRoYXQgeW91IGRvbid0XG4gKiBkbyBhbnkgYWN0dWFsIHByb2Nlc3NpbmcgaW4gaGVyZSB1bmxlc3MgeW91IHdhbnQgaXQgVkVSWSBsaXZlLCBiZWNhdXNlIGl0IGlzLlxuICovXG5mdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJXaW5kb3dSZXNpemU6IHc9XCIgKyB3aW5kb3cuaW5uZXJXaWR0aCArIFwiIGg9XCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHdpbmRvd1Jlc2l6ZSk7XG5cbi8vIHRoaXMgY29tbWVudGVkIHNlY3Rpb24gaXMgbm90IHdvcmtpbmcgaW4gbXkgbmV3IHgtYXBwIGNvZGUsIGJ1dCBpdCdzIG9rIHRvIGNvbW1lbnQgaXQgb3V0IGZvciBub3cuXG4vL1xuLy8gVGhpcyBpcyBvdXIgdGVtcGxhdGUgZWxlbWVudCBpbiBpbmRleC5odG1sXG4vLyB2YXIgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3gtYXBwJyk7XG4vLyAvLyBMaXN0ZW4gZm9yIHRlbXBsYXRlIGJvdW5kIGV2ZW50IHRvIGtub3cgd2hlbiBiaW5kaW5nc1xuLy8gLy8gaGF2ZSByZXNvbHZlZCBhbmQgY29udGVudCBoYXMgYmVlbiBzdGFtcGVkIHRvIHRoZSBwYWdlXG4vLyBhcHAuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKCdhcHAgcmVhZHkgZXZlbnQhJyk7XG4vLyB9KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvbHltZXItcmVhZHknLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coJ3BvbHltZXItcmVhZHkgZXZlbnQhJyk7XG59KTtcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGNuc3QuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBjb29raWVQcmVmaXg7XHJcblxyXG4vL3RvZG8tMDogdHlwZXNjcmlwdCB3aWxsIG5vdyBsZXQgdXMganVzdCBkbyB0aGlzOiBjb25zdCB2YXI9J3ZhbHVlJztcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBjbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBBTk9OOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1VTUjogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblVzclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1BXRDogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblB3ZFwiO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbG9naW5TdGF0ZT1cIjBcIiBpZiB1c2VyIGxvZ2dlZCBvdXQgaW50ZW50aW9uYWxseS4gbG9naW5TdGF0ZT1cIjFcIiBpZiBsYXN0IGtub3duIHN0YXRlIG9mIHVzZXIgd2FzICdsb2dnZWQgaW4nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fU1RBVEU6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5TdGF0ZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQlI6IFwiPGRpdiBjbGFzcz0ndmVydC1zcGFjZSc+PC9kaXY+XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTlNFUlRfQVRUQUNITUVOVDogc3RyaW5nID0gXCJ7e2luc2VydC1hdHRhY2htZW50fX1cIjtcclxuICAgICAgICBleHBvcnQgbGV0IE5FV19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IElOU19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbiIsIlxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbiAgICAvKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuICAgIGV4cG9ydCBjbGFzcyBBZFNlZ21lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgICAgIHB1YmxpYyBlbmRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wRW50cnkge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBwcm9wZXJ0eToganNvbi5Qcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdWJQcm9wIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cclxuZGVjbGFyZSB2YXIgUG9seW1lcjtcclxuZGVjbGFyZSB2YXIgJDsgLy88LS0tLS0tLS0tLS0tLXRoaXMgd2FzIGEgd2lsZGFzcyBndWVzcy5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXJyYXkgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vV0FSTklORzogVGhlc2UgcHJvdG90eXBlIGZ1bmN0aW9ucyBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBhbnkgZnVuY3Rpb25zLlxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG4gICAgY2xvbmUoKTogQXJyYXk8VD47XHJcbiAgICBpbmRleE9mSXRlbUJ5UHJvcChwcm9wTmFtZSwgcHJvcFZhbCk6IG51bWJlcjtcclxuICAgIGFycmF5TW92ZUl0ZW0oZnJvbUluZGV4LCB0b0luZGV4KTogdm9pZDtcclxuICAgIGluZGV4T2ZPYmplY3Qob2JqOiBhbnkpOiBudW1iZXI7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmluZGV4T2ZJdGVtQnlQcm9wID0gZnVuY3Rpb24ocHJvcE5hbWUsIHByb3BWYWwpIHtcclxuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXVtwcm9wTmFtZV0gPT09IHByb3BWYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuLyogbmVlZCB0byB0ZXN0IGFsbCBjYWxscyB0byB0aGlzIG1ldGhvZCBiZWNhdXNlIGkgbm90aWNlZCBkdXJpbmcgVHlwZVNjcmlwdCBjb252ZXJzaW9uIGkgd2Fzbid0IGV2ZW4gcmV0dXJuaW5nXHJcbmEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuKi9cclxuQXJyYXkucHJvdG90eXBlLmFycmF5TW92ZUl0ZW0gPSBmdW5jdGlvbihmcm9tSW5kZXgsIHRvSW5kZXgpIHtcclxuICAgIHRoaXMuc3BsaWNlKHRvSW5kZXgsIDAsIHRoaXMuc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGF0ZSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIERhdGUge1xyXG4gICAgc3RkVGltZXpvbmVPZmZzZXQoKTogbnVtYmVyO1xyXG4gICAgZHN0KCk6IGJvb2xlYW47XHJcbn07XHJcblxyXG5EYXRlLnByb3RvdHlwZS5zdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGphbiA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICB2YXIganVsID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCA2LCAxKTtcclxuICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG59XHJcblxyXG5EYXRlLnByb3RvdHlwZS5kc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgPCB0aGlzLnN0ZFRpbWV6b25lT2Zmc2V0KCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RyaW5nIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb250YWlucyhzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICByZXBsYWNlQWxsKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdW5lbmNvZGVIdG1sKCk6IHN0cmluZztcclxuICAgIGVzY2FwZUZvckF0dHJpYigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRzV2l0aChzdHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSAhPSAtMTtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhcIiZcIikpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCcmYW1wOycsICcmJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmd0OycsICc+JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmx0OycsICc8JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJnF1b3Q7JywgJ1wiJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJiMzOTsnLCBcIidcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHV0aWwge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FqYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVvdXRNZXNzYWdlU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IG9mZmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3YWl0Q291bnRlcjogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IHBncnNEbGc6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgICAgIC8vXHRPYmplY3QucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgICAgICAvL1x0fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2YWwodmFyTmFtZSkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgYW4gYWpheCBjYWxsLCBidXQgdGhlIHNlcnZlciBhbHNvIGVuZm9yY2VzIHRoYXQgZWFjaFxyXG4gICAgICAgICAqIHNlc3Npb24gaXMgb25seSBhbGxvd2VkIG9uZSBjb25jdXJyZW50IGNhbGwgYW5kIHNpbXVsdGFuZW91cyBjYWxscyB3b3VsZCBqdXN0IFwicXVldWUgdXBcIi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKG5ldyBEYXRlKCkuZHN0KCkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFRoaXMgY2FtZSBmcm9tIGhlcmU6XHJcblx0XHQgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lPzogYW55LCB1cmw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcblx0XHQgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG5cdFx0ICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKTogYW55IHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRQcm9ncmVzc01vbml0b3IgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwocHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2dyZXNzSW50ZXJ2YWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlzV2FpdGluZyA9IGlzQWpheFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzV2FpdGluZykge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlmICh3YWl0Q291bnRlciA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGpzb24gPSBmdW5jdGlvbiA8UmVxdWVzdFR5cGUsIFJlc3BvbnNlVHlwZT4ocG9zdE5hbWU6IGFueSwgcG9zdERhdGE6IFJlcXVlc3RUeXBlLCAvL1xyXG4gICAgICAgICAgICBjYWxsYmFjaz86IChyZXNwb25zZTogUmVzcG9uc2VUeXBlLCBwYXlsb2FkPzogYW55KSA9PiBhbnksIGNhbGxiYWNrVGhpcz86IGFueSwgY2FsbGJhY2tQYXlsb2FkPzogYW55KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUgKyBcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi1QT1NUW2dlbl06IFtcIiArIHBvc3ROYW1lICsgXCJdXCIgKyBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaXJvbkFqYXggPSB0aGlzLiQkKFwiI215SXJvbkFqYXhcIik7XHJcbiAgICAgICAgICAgICAgICAvL2lyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD4pd2luZG93LmRvY3VtZW50LnJvb3QpLnF1ZXJ5U2VsZWN0b3IoXCIjaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXggPSBwb2x5RWxtTm9kZShcImlyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnVybCA9IHBvc3RUYXJnZXRVcmwgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4Lm1ldGhvZCA9IFwiUE9TVFwiO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgucGFyYW1zPSd7XCJhbHRcIjpcImpzb25cIiwgXCJxXCI6XCJjaHJvbWVcIn0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5vblJlc3BvbnNlID0gXCJ1dGlsLmlyb25BamF4UmVzcG9uc2VcIjsgLy8gb24tcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmRlYm91bmNlRHVyYXRpb24gPSBcIjMwMFwiOyAvLyBkZWJvdW5jZS1kdXJhdGlvbiAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwiRmFpbGVkIHN0YXJ0aW5nIHJlcXVlc3Q6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vdGVzXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcbiAgICAgICAgICAgICAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcbiAgICAgICAgICAgICAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcbiAgICAgICAgICAgICAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcbiAgICAgICAgICAgICAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuICAgICAgICAgICAgICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcbiAgICAgICAgICAgICAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhbid0IHdlIGp1c3QgbGV0IGNhbGxiYWNrUGF5bG9hZCBiZSB1bmRlZmluZWQsIGFuZCBjYWxsIHRoZSBhYm92ZSBjYWxsYmFjayBtZXRob2RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgbm90IGV2ZW4gaGF2ZSB0aGlzIGVsc2UgYmxvY2sgaGVyZSBhdCBhbGwgKGkuZS4gbm90IGV2ZW4gY2hlY2sgaWYgY2FsbGJhY2tQYXlsb2FkIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsL3VuZGVmaW5lZCwgYnV0IGp1c3QgdXNlIGl0LCBhbmQgbm90IGhhdmUgdGhpcyBpZiBibG9jaz8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBoYW5kbGluZyByZXN1bHQgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBGYWlsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIHV0aWwuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcm9uUmVxdWVzdC5zdGF0dXMgPT0gXCI0MDNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluIGRldGVjdGVkIGluIHV0aWwuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0TWVzc2FnZVNob3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dE1lc3NhZ2VTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2Vzc2lvbiB0aW1lZCBvdXQuIFBhZ2Ugd2lsbCByZWZyZXNoLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpcm9uUmVxdWVzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQW5kVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgICAgICB0aHJvdyBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBbmRSZVRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nLCBleGNlcHRpb246IGFueSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlICsgXCJTVEFDSzogXCIgKyBzdGFjayk7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYWpheFJlYWR5ID0gZnVuY3Rpb24ocmVxdWVzdE5hbWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKF9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0FqYXhXYWl0aW5nID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfYWpheENvdW50ZXIgPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3Qgc3RhcnQgd2l0aCAjKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsYXllZEZvY3VzID0gZnVuY3Rpb24oaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogc28gdXNlciBzZWVzIHRoZSBmb2N1cyBmYXN0IHdlIHRyeSBhdCAuNSBzZWNvbmRzICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgdHJ5IGFnYWluIGEgZnVsbCBzZWNvbmQgbGF0ZXIuIE5vcm1hbGx5IG5vdCByZXF1aXJlZCwgYnV0IG5ldmVyIHVuZGVzaXJhYmxlICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGNvdWxkIGhhdmUgcHV0IHRoaXMgbG9naWMgaW5zaWRlIHRoZSBqc29uIG1ldGhvZCBpdHNlbGYsIGJ1dCBJIGNhbiBmb3JzZWUgY2FzZXMgd2hlcmUgd2UgZG9uJ3Qgd2FudCBhXHJcblx0XHQgKiBtZXNzYWdlIHRvIGFwcGVhciB3aGVuIHRoZSBqc29uIHJlc3BvbnNlIHJldHVybnMgc3VjY2Vzcz09ZmFsc2UsIHNvIHdlIHdpbGwgaGF2ZSB0byBjYWxsIGNoZWNrU3VjY2VzcyBpbnNpZGVcclxuXHRcdCAqIGV2ZXJ5IHJlc3BvbnNlIG1ldGhvZCBpbnN0ZWFkLCBpZiB3ZSB3YW50IHRoYXQgcmVzcG9uc2UgdG8gcHJpbnQgYSBtZXNzYWdlIHRvIHRoZSB1c2VyIHdoZW4gZmFpbCBoYXBwZW5zLlxyXG5cdFx0ICpcclxuXHRcdCAqIHJlcXVpcmVzOiByZXMuc3VjY2VzcyByZXMubWVzc2FnZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGVja1N1Y2Nlc3MgPSBmdW5jdGlvbihvcEZyaWVuZGx5TmFtZSwgcmVzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhvcEZyaWVuZGx5TmFtZSArIFwiIGZhaWxlZDogXCIgKyByZXMubWVzc2FnZSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN1Y2Nlc3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZGRzIGFsbCBhcnJheSBvYmplY3RzIHRvIG9iaiBhcyBhIHNldCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWRkQWxsID0gZnVuY3Rpb24ob2JqLCBhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm51bGwgZWxlbWVudCBpbiBhZGRBbGwgYXQgaWR4PVwiICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbnVsbE9yVW5kZWYgPSBmdW5jdGlvbihvYmopOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGhhdmUgdG8gYmUgYWJsZSB0byBtYXAgYW55IGlkZW50aWZpZXIgdG8gYSB1aWQsIHRoYXQgd2lsbCBiZSByZXBlYXRhYmxlLCBzbyB3ZSBoYXZlIHRvIHVzZSBhIGxvY2FsXHJcblx0XHQgKiAnaGFzaHNldC10eXBlJyBpbXBsZW1lbnRhdGlvblxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVaWRGb3JJZCA9IGZ1bmN0aW9uKG1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgaWQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1hcFtpZF07XHJcblxyXG4gICAgICAgICAgICAvKiBpZiBub3QgZm91bmQsIGdldCBuZXh0IG51bWJlciwgYW5kIGFkZCB0byBtYXAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIHVpZCA9IFwiXCIgKyBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbGVtZW50RXhpc3RzID0gZnVuY3Rpb24oaWQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGFrZXMgdGV4dGFyZWEgZG9tIElkICgjIG9wdGlvbmFsKSBhbmQgcmV0dXJucyBpdHMgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFRleHRBcmVhVmFsQnlJZCA9IGZ1bmN0aW9uKGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGRlOiBIVE1MRWxlbWVudCA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZGUpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZG9tRWxtID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUG9seW1lci5kb20oZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHlFbG1Ob2RlID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFJlcXVpcmVkRWxlbWVudCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9ICQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldFJlcXVpcmVkRWxlbWVudC4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc09iamVjdCA9IGZ1bmN0aW9uKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50VGltZU1pbGxpcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbXB0eVN0cmluZyA9IGZ1bmN0aW9uKHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdmFsIHx8IHZhbC5sZW5ndGggPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWxtID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbG0gIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEVudGVyS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55KSB7XHJcbiAgICAgICAgICAgIGJpbmRLZXkoaWQsIGZ1bmMsIDEzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEtleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSwga2V5Q29kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICQoaWQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuXHRcdCAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcblx0XHQgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hhbmdlT3JBZGRDbGFzcyA9IGZ1bmN0aW9uKGVsbTogc3RyaW5nLCBvbGRDbGFzczogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbG1lbWVudCA9ICQoZWxtKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3Mob2xkQ2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3MobmV3Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogZGlzcGxheXMgbWVzc2FnZSAobXNnKSBvZiBvYmplY3QgaXMgbm90IG9mIHNwZWNpZmllZCB0eXBlXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHZlcmlmeVR5cGUgPSBmdW5jdGlvbihvYmo6IGFueSwgdHlwZTogYW55LCBtc2c6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SHRtbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoY29udGVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuXHJcbiAgICAgICAgICAgIC8vRm9yIFBvbHltZXIgMS4wLjAsIHlvdSBuZWVkIHRoaXMuLi5cclxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHBvbHlFbG0uaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnR5Q291bnQgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBwcm9wO1xyXG5cclxuICAgICAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgYW5kIHZhbHVlc1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludE9iamVjdCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIlxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHlbXCIgKyBjb3VudCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSBrICsgXCIgLCBcIiArIHYgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludEtleXMgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSAnLCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgKz0gaztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCBlbmFibGVkIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0RW5hYmxlbWVudCA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIHZpczogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmlzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICQoZWxtKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhpZGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAkKGVsbSkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBQcm9ncmFtYXRpY2FsbHkgY3JlYXRlcyBvYmplY3RzIGJ5IG5hbWUsIHNpbWlsYXIgdG8gd2hhdCBKYXZhIHJlZmxlY3Rpb24gZG9lc1xyXG5cclxuICAgICAgICAqIGV4OiB2YXIgZXhhbXBsZSA9IEluc3RhbmNlTG9hZGVyLmdldEluc3RhbmNlPE5hbWVkVGhpbmc+KHdpbmRvdywgJ0V4YW1wbGVDbGFzcycsIGFyZ3MuLi4pO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIDxUPihjb250ZXh0OiBPYmplY3QsIG5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBUIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShjb250ZXh0W25hbWVdLnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxUPmluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBqY3JDbnN0LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpjckNuc3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IENPTU1FTlRfQlk6IHN0cmluZyA9IFwiY29tbWVudEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQVUJMSUNfQVBQRU5EOiBzdHJpbmcgPSBcInB1YmxpY0FwcGVuZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFJJTUFSWV9UWVBFOiBzdHJpbmcgPSBcImpjcjpwcmltYXJ5VHlwZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUE9MSUNZOiBzdHJpbmcgPSBcInJlcDpwb2xpY3lcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBNSVhJTl9UWVBFUzogc3RyaW5nID0gXCJqY3I6bWl4aW5UeXBlc1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX0NPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX1JFQ0lQOiBzdHJpbmcgPSBcInJlY2lwXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9TVUJKRUNUOiBzdHJpbmcgPSBcInN1YmplY3RcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEX0JZOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkQnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFRBR1M6IHN0cmluZyA9IFwidGFnc1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVVJRDogc3RyaW5nID0gXCJqY3I6dXVpZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRDogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEX0JZOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQ6IHN0cmluZyA9IFwibWV0YTY0Ompzb25cIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBhdHRhY2htZW50LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGF0dGFjaG1lbnQge1xyXG4gICAgICAgIC8qIE5vZGUgYmVpbmcgdXBsb2FkZWQgdG8gKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVwbG9hZE5vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21GaWxlRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBtNjQubmFtZXNwYWNlIHZlcnNpb24hXCIpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZygpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3RlOiBUbyBydW4gbGVnYWN5IHVwbG9hZGVyIGp1c3QgcHV0IHRoaXMgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIGhlcmUsIGFuZFxyXG4gICAgICAgICAgICBub3RoaW5nIGVsc2UgaXMgcmVxdWlyZWQuIFNlcnZlciBzaWRlIHByb2Nlc3NpbmcgaXMgc3RpbGwgaW4gcGxhY2UgZm9yIGl0XHJcblxyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21VcmxEbGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJEZWxldGUgdGhlIEF0dGFjaG1lbnQgb24gdGhlIE5vZGU/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0LCBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZT4oXCJkZWxldGVBdHRhY2htZW50XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCBudWxsLCBub2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCB1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgYXR0YWNobWVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVtb3ZlQmluYXJ5QnlVaWQodWlkKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIHJlLXJlbmRlciBmcm9tIGxvY2FsIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGVkaXQuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgZWRpdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IG02NC5DcmVhdGVOb2RlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnNlcnRCb29rUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0Qm9va1Jlc3BvbnNlIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGVsZXRlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlLCBwYXlsb2FkOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZSA9IHBheWxvYWRbXCJwb3N0RGVsZXRlU2VsTm9kZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IHNlbE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIGhpZ2hsaWdodElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSBhbmQgd2UgYXJlIHRoZSBjb21tZW50ZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBTZXJ2ZXIgd2lsbCBoYXZlIHNlbnQgdXMgYmFjayB0aGUgcmF3IHRleHQgY29udGVudCwgdGhhdCBzaG91bGQgYmUgbWFya2Rvd24gaW5zdGVhZCBvZiBhbnkgSFRNTCwgc29cclxuICAgICAgICAgICAgICAgICAgICAgKiB0aGF0IHdlIGNhbiBkaXNwbGF5IHRoaXMgYW5kIHNhdmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGUgPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGNhbm5vdCBlZGl0IG5vZGVzIHRoYXQgeW91IGRvbid0IG93bi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIk1vdmUgbm9kZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBudWxsOyAvLyByZXNldFxyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmVTZXQgPSB7fTtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UmVhZE9ubHlQcm9wZXJ0aWVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTE6IG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlcmUncyBhIGJldHRlciB3YXkgdG8gZG8gYW4gb3JkZXJlZCBzZXQgaW4gamF2YXNjcmlwdCBzbyBJIGRvbid0IG5lZWRcclxuICAgICAgICBib3RoIG5vZGVzVG9Nb3ZlIGFuZCBub2Rlc1RvTW92ZVNldFxyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZVNldDogT2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50T2ZOZXdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpbmRpY2F0ZXMgZWRpdG9yIGlzIGRpc3BsYXlpbmcgYSBub2RlIHRoYXQgaXMgbm90IHlldCBzYXZlZCBvbiB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0aW5nVW5zYXZlZE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBub2RlIChOb2RlSW5mby5qYXZhKSB0aGF0IGlzIGJlaW5nIGNyZWF0ZWQgdW5kZXIgd2hlbiBuZXcgbm9kZSBpcyBjcmVhdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOb2RlIGJlaW5nIGVkaXRlZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogdG9kby0yOiB0aGlzIGFuZCBzZXZlcmFsIG90aGVyIHZhcmlhYmxlcyBjYW4gbm93IGJlIG1vdmVkIGludG8gdGhlIGRpYWxvZyBjbGFzcz8gSXMgdGhhdCBnb29kIG9yIGJhZFxyXG4gICAgICAgICAqIGNvdXBsaW5nL3Jlc3BvbnNpYmlsaXR5P1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBJbnN0YW5jZSBvZiBFZGl0Tm9kZURpYWxvZzogRm9yIG5vdyBjcmVhdGluZyBuZXcgb25lIGVhY2ggdGltZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVEbGdJbnN0OiBFZGl0Tm9kZURsZyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHlwZT1Ob2RlSW5mby5qYXZhXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBXaGVuIGluc2VydGluZyBhIG5ldyBub2RlLCB0aGlzIGhvbGRzIHRoZSBub2RlIHRoYXQgd2FzIGNsaWNrZWQgb24gYXQgdGhlIHRpbWUgdGhlIGluc2VydCB3YXMgcmVxdWVzdGVkLCBhbmRcclxuICAgICAgICAgKiBpcyBzZW50IHRvIHNlcnZlciBmb3Igb3JkaW5hbCBwb3NpdGlvbiBhc3NpZ25tZW50IG9mIG5ldyBub2RlLiBBbHNvIGlmIHRoaXMgdmFyIGlzIG51bGwsIGl0IGluZGljYXRlcyB3ZSBhcmVcclxuICAgICAgICAgKiBjcmVhdGluZyBpbiBhICdjcmVhdGUgdW5kZXIgcGFyZW50JyBtb2RlLCB2ZXJzdXMgbm9uLW51bGwgbWVhbmluZyAnaW5zZXJ0IGlubGluZScgdHlwZSBvZiBpbnNlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVJbnNlcnRUYXJnZXQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgdHJ1ZSBpZiB3ZSBjYW4gJ3RyeSB0bycgaW5zZXJ0IHVuZGVyICdub2RlJyBvciBmYWxzZSBpZiBub3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzRWRpdEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogQ2hlY2sgdGhhdCBpZiB3ZSBoYXZlIGEgY29tbWVudEJ5IHByb3BlcnR5IHdlIGFyZSB0aGUgY29tbWVudGVyLCBiZWZvcmUgYWxsb3dpbmcgZWRpdCBidXR0b24gYWxzby5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgKCFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSkgfHwgcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpKSAvL1xyXG4gICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYmVzdCB3ZSBjYW4gZG8gaGVyZSBpcyBhbGxvdyB0aGUgZGlzYWJsZUluc2VydCBwcm9wIHRvIGJlIGFibGUgdG8gdHVybiB0aGluZ3Mgb2ZmLCBub2RlIGJ5IG5vZGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzSW5zZXJ0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuRElTQUJMRV9JTlNFUlQsIG5vZGUpID09IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGUgPSBmdW5jdGlvbih0eXBlTmFtZT86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcodHlwZU5hbWUpO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Quc2F2ZU5ld05vZGUoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNhbGxlZCB0byBkaXNwbGF5IGVkaXRvciB0aGF0IHdpbGwgY29tZSB1cCBCRUZPUkUgYW55IG5vZGUgaXMgc2F2ZWQgb250byB0aGUgc2VydmVyLCBzbyB0aGF0IHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgICogYW55IHNhdmUgaXMgcGVyZm9ybWVkIHdlIHdpbGwgaGF2ZSB0aGUgY29ycmVjdCBub2RlIG5hbWUsIGF0IGxlYXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhpcyB2ZXJzaW9uIGlzIG5vIGxvbmdlciBiZWluZyB1c2VkLCBhbmQgY3VycmVudGx5IHRoaXMgbWVhbnMgJ2VkaXRpbmdVbnNhdmVkTm9kZScgaXMgbm90IGN1cnJlbnRseSBldmVyXHJcbiAgICAgICAgICogdHJpZ2dlcmVkLiBUaGUgbmV3IGFwcHJvYWNoIG5vdyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gJ3JlbmFtZScgbm9kZXMgaXMgdG8ganVzdCBjcmVhdGUgb25lIHdpdGggYVxyXG4gICAgICAgICAqIHJhbmRvbSBuYW1lIGFuIGxldCB1c2VyIHN0YXJ0IGVkaXRpbmcgcmlnaHQgYXdheSBhbmQgdGhlbiByZW5hbWUgdGhlIG5vZGUgSUYgYSBjdXN0b20gbm9kZSBuYW1lIGlzIG5lZWRlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgbWVhbnMgaWYgd2UgY2FsbCB0aGlzIGZ1bmN0aW9uIChzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUpIGluc3RlYWQgb2YgJ3N0YXJ0RWRpdGluZ05ld05vZGUoKSdcclxuICAgICAgICAgKiB0aGF0IHdpbGwgY2F1c2UgdGhlIEdVSSB0byBhbHdheXMgcHJvbXB0IGZvciB0aGUgbm9kZSBuYW1lIGJlZm9yZSBjcmVhdGluZyB0aGUgbm9kZS4gVGhpcyB3YXMgdGhlIG9yaWdpbmFsXHJcbiAgICAgICAgICogZnVuY3Rpb25hbGl0eSBhbmQgc3RpbGwgd29ya3MuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNyZWF0ZSBzdWJub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhdmVOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2F2ZU5vZGVSZXNwb25zZSwgcGF5bG9hZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBiZWNhc3VzZSBJIGRvbid0IHVuZGVyc3RhbmQgJ2VkaXRpbmdVbnNhdmVkTm9kZScgdmFyaWFibGUgYW55IGxvbmdlciB1bnRpbCBpIHJlZnJlc2ggbXkgbWVtb3J5LCBpIHdpbGwgdXNlXHJcbiAgICAgICAgICAgICAgICB0aGUgb2xkIGFwcHJvYWNoIG9mIHJlZnJlc2hpbmcgZW50aXJlIHRyZWUgcmF0aGVyIHRoYW4gbW9yZSBlZmZpY2llbnQgcmVmcmVzbk5vZGVPblBhZ2UsIGJlY3Vhc2UgaXQgcmVxdWlyZXNcclxuICAgICAgICAgICAgICAgIHRoZSBub2RlIHRvIGFscmVhZHkgYmUgb24gdGhlIHBhZ2UsIGFuZCB0aGlzIHJlcXVpcmVzIGluIGRlcHRoIGFuYWx5cyBpJ20gbm90IGdvaW5nIHRvIGRvIHJpZ2h0IHRoaXMgbWludXRlLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlKTtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHBheWxvYWQuc2F2ZWRJZCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE1vZGUgPSBmdW5jdGlvbihtb2RlVmFsPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVWYWwgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtb2RlVmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPyBmYWxzZSA6IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgICAgIC8vIHRoYXQgY2FuIHNob3cgYW4gb24vb2ZmIHN0YXRlLlxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTaW5jZSBlZGl0IG1vZGUgdHVybnMgb24gbG90cyBvZiBidXR0b25zLCB0aGUgbG9jYXRpb24gb2YgdGhlIG5vZGUgd2UgYXJlIHZpZXdpbmcgY2FuIGNoYW5nZSBzbyBtdWNoIGl0XHJcbiAgICAgICAgICAgICAqIGdvZXMgY29tcGxldGVseSBvZmZzY3JlZW4gb3V0IG9mIHZpZXcsIHNvIHdlIHNjcm9sbCBpdCBiYWNrIGludG8gdmlldyBldmVyeSB0aW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQuc2F2ZVVzZXJQcmVmZXJlbmNlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVVwID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVBYm92ZSA9IGdldE5vZGVBYm92ZShub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlQWJvdmUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGVBYm92ZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlRG93biA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlQmVsb3c6IGpzb24uTm9kZUluZm8gPSBnZXROb2RlQmVsb3cobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZUJlbG93ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlQmVsb3cubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb1RvcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BOb2RlID0gZ2V0Rmlyc3RDaGlsZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b3BOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiB0b3BOb2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb0JvdHRvbSA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBhYm92ZSB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgdG9wIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVBYm92ZSA9IGZ1bmN0aW9uKG5vZGUpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsIDw9IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCAtIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGJlbG93IHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSBib3R0b20gbm9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJlbG93ID0gZnVuY3Rpb24obm9kZTogYW55KToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcmRpbmFsID0gXCIgKyBvcmRpbmFsKTtcclxuICAgICAgICAgICAgaWYgKG9yZGluYWwgPT0gLTEgfHwgb3JkaW5hbCA+PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgKyAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Rmlyc3RDaGlsZE5vZGUgPSBmdW5jdGlvbigpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlblswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuRWRpdE5vZGUgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBlZGl0Tm9kZUNsaWNrOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluaXROb2RlRWRpdFJlcXVlc3QsIGpzb24uSW5pdE5vZGVFZGl0UmVzcG9uc2U+KFwiaW5pdE5vZGVFZGl0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgfSwgaW5pdE5vZGVFZGl0UmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnROb2RlID0gZnVuY3Rpb24odWlkPzogYW55LCB0eXBlTmFtZT86IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgICAgICBpZiAoIXBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIHBhcmVudFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgZ2V0IHRoZSBub2RlIHNlbGVjdGVkIGZvciB0aGUgaW5zZXJ0IHBvc2l0aW9uIGJ5IHVzaW5nIHRoZSB1aWQgaWYgb25lIHdhcyBwYXNzZWQgaW4gb3IgdXNpbmcgdGhlXHJcbiAgICAgICAgICAgICAqIGN1cnJlbnRseSBoaWdobGlnaHRlZCBub2RlIGlmIG5vIHVpZCB3YXMgcGFzc2VkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0RWRpdGluZ05ld05vZGUodHlwZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSksIG9yIGFueSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKiBub2RlIGlmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgbm9kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gaGlnaGxpZ2h0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBjcmVhdGVTdWJOb2RlOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlcGx5VG9Db21tZW50ID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgY3JlYXRlU3ViTm9kZSh1aWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGlvbnMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgY291bGQgd3JpdGUgY29kZSB0aGF0IG9ubHkgc2NhbnMgZm9yIGFsbCB0aGUgXCJTRUxcIiBidXR0b25zIGFuZCB1cGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGVtLCBidXQgZm9yIG5vd1xyXG4gICAgICAgICAgICAgKiB3ZSB0YWtlIHRoZSBzaW1wbGUgYXBwcm9hY2ggYW5kIGp1c3QgcmUtcmVuZGVyIHRoZSBwYWdlLiBUaGVyZSBpcyBubyBjYWxsIHRvIHRoZSBzZXJ2ZXIsIHNvIHRoaXMgaXNcclxuICAgICAgICAgICAgICogYWN0dWFsbHkgdmVyeSBlZmZpY2llbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRGVsZXRlIHRoZSBzaW5nbGUgbm9kZSBpZGVudGlmaWVkIGJ5ICd1aWQnIHBhcmFtZXRlciBpZiB1aWQgcGFyYW1ldGVyIGlzIHBhc3NlZCwgYW5kIGlmIHVpZCBwYXJhbWV0ZXIgaXMgbm90XHJcbiAgICAgICAgICogcGFzc2VkIHRoZW4gdXNlIHRoZSBub2RlIHNlbGVjdGlvbnMgZm9yIG11bHRpcGxlIHNlbGVjdGlvbnMgb24gdGhlIHBhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIGRlbGV0ZSBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc3REZWxldGVTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZU5vZGVzUmVxdWVzdCwganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlPihcImRlbGV0ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IHNlbE5vZGVzQXJyYXlcclxuICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVOb2Rlc1Jlc3BvbnNlLCBudWxsLCB7IFwicG9zdERlbGV0ZVNlbE5vZGVcIjogcG9zdERlbGV0ZVNlbE5vZGUgfSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyB0aGUgbm9kZSB3ZSB3YW50IHRvIHNjcm9sbCB0byBhZnRlciBhIGRlbGV0ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIC8qIFVzZSBhIGhhc2htYXAtdHlwZSBhcHByb2FjaCB0byBzYXZpbmcgYWxsIHNlbGVjdGVkIG5vZGVzIGludG8gYSBsb291cCBtYXAgKi9cclxuICAgICAgICAgICAgbGV0IG5vZGVzTWFwOiBPYmplY3QgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCgpO1xyXG4gICAgICAgICAgICBsZXQgYmVzdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdGFrZU5leHROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgd2Ugc2NhbiB0aGUgY2hpbGRyZW4sIGFuZCB0aGUgbGFzdCBjaGlsZCB3ZSBlbmNvdW50ZXJkIHVwIHVudGlsIHdlIGZpbmQgdGhlIHJpc3Qgb25lbiBpbiBub2Rlc01hcCB3aWxsIGJlIHRoZVxyXG4gICAgICAgICAgICBub2RlIHdlIHdpbGwgd2FudCB0byBzZWxlY3QgYW5kIHNjcm9sbCB0aGUgdXNlciB0byBBRlRFUiB0aGUgZGVsZXRpbmcgaXMgZG9uZSAqL1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFrZU5leHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaXMgdGhpcyBub2RlIG9uZSB0byBiZSBkZWxldGVkICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNNYXBbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlTmV4dE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVzdE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiZXN0Tm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3V0U2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcclxuICAgICAgICAgICAgICAgIFwiQ29uZmlybSBDdXRcIixcclxuICAgICAgICAgICAgICAgIFwiQ3V0IFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpLCB0byBwYXN0ZS9tb3ZlIHRvIG5ldyBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgICAgICBcIlllc1wiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBzZWxOb2Rlc0FycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIGxvYWROb2Rlc1RvTW92ZVNldChzZWxOb2Rlc0FycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAvKiB0b2RvLTA6IG5lZWQgdG8gaGF2ZSBhIHdheSB0byBmaW5kIGFsbCBzZWxlY3RlZCBjaGVja2JveGVzIGluIHRoZSBndWkgYW5kIHJlc2V0IHRoZW0gYWxsIHRvIHVuY2hlY2tlZCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307IC8vIGNsZWFyIHNlbGVjdGlvbnMuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyB3ZSByZW5kZXIgYWdhaW4gYW5kIHRoZSBub2RlcyB0aGF0IHdlcmUgY3V0IHdpbGwgZGlzYXBwZWFyIGZyb20gdmlldyAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbG9hZE5vZGVzVG9Nb3ZlU2V0ID0gZnVuY3Rpb24obm9kZUlkczogc3RyaW5nW10pIHtcclxuICAgICAgICAgICAgbm9kZXNUb01vdmVTZXQgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmVTZXRbaWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXN0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gUGFzdGVcIiwgXCJQYXN0ZSBcIiArIG5vZGVzVG9Nb3ZlLmxlbmd0aCArIFwiIG5vZGUocykgdW5kZXIgc2VsZWN0ZWQgcGFyZW50IG5vZGUgP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXMsIHBhc3RlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHBhZ2UuIExhdGVyIG9uIHdlIGNhbiBnZXQgbW9yZSBzcGVjaWZpYyBhYm91dCBhbGxvd2luZyBwcmVjaXNlIGRlc3RpbmF0aW9uIGxvY2F0aW9uIGZvciBtb3ZlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIG5vZGVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk1vdmVOb2Rlc1JlcXVlc3QsIGpzb24uTW92ZU5vZGVzUmVzcG9uc2U+KFwibW92ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROb2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRDaGlsZElkXCI6IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCA/IGhpZ2hsaWdodE5vZGUuaWQgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogbm9kZXNUb01vdmVcclxuICAgICAgICAgICAgICAgICAgICB9LCBtb3ZlTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnRCb29rV2FyQW5kUGVhY2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybVwiLCBcIkluc2VydCBib29rIFdhciBhbmQgUGVhY2U/PHAvPldhcm5pbmc6IFlvdSBzaG91bGQgaGF2ZSBhbiBFTVBUWSBub2RlIHNlbGVjdGVkIG5vdywgdG8gc2VydmUgYXMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgYm9vayFcIiwgXCJZZXMsIGluc2VydCBib29rLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbnNlcnRCb29rUmVxdWVzdCwganNvbi5JbnNlcnRCb29rUmVzcG9uc2U+KFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9va05hbWVcIjogXCJXYXIgYW5kIFBlYWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGluc2VydEJvb2tSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1ldGE2NC5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIEFwcGxpY2F0aW9uIGluc3RhbmNlLCBhbmQgY2VudHJhbCByb290IGxldmVsIG9iamVjdCBmb3IgYWxsIGNvZGUsIGFsdGhvdWdoIGVhY2ggbW9kdWxlIGdlbmVyYWxseSBjb250cmlidXRlcyBvbmVcclxuICogc2luZ2xldG9uIHZhcmlhYmxlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHdpdGggYSBuYW1lIHVzdWFsbHkgaWRlbnRpY2FsIHRvIHRoYXQgZmlsZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZXRhNjQge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFwcEluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VyVXJsUGF0aDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgICBleHBvcnQgbGV0IHVybENtZDogc3RyaW5nO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNvZGVGb3JtYXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VydmVyTWFya2Rvd246IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKiB1c2VkIGFzIGEga2luZCBvZiAnc2VxdWVuY2UnIGluIHRoZSBhcHAsIHdoZW4gdW5pcXVlIHZhbHMgYSBuZWVkZWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRHdWlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKiBuYW1lIG9mIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlck5hbWU6IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcblxyXG4gICAgICAgIC8qIHNjcmVlbiBjYXBhYmlsaXRpZXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZVdpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGV2aWNlSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVzZXIncyByb290IG5vZGUuIFRvcCBsZXZlbCBvZiB3aGF0IGxvZ2dlZCBpbiB1c2VyIGlzIGFsbG93ZWQgdG8gc2VlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVJZDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlUGF0aDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBZG1pblVzZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogYWx3YXlzIHN0YXJ0IG91dCBhcyBhbm9uIHVzZXIgdW50aWwgbG9naW4gKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQW5vblVzZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzaWduYWxzIHRoYXQgZGF0YSBoYXMgY2hhbmdlZCBhbmQgdGhlIG5leHQgdGltZSB3ZSBnbyB0byB0aGUgbWFpbiB0cmVlIHZpZXcgd2luZG93IHdlIG5lZWQgdG8gcmVmcmVzaCBkYXRhXHJcbiAgICAgICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0cmVlRGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1aWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLmlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIGNvdW50ZXIgZm9yIGxvY2FsIHVpZHMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRVaWQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkZW50VG9VaWRNYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVbmRlciBhbnkgZ2l2ZW4gbm9kZSwgdGhlcmUgY2FuIGJlIG9uZSBhY3RpdmUgJ3NlbGVjdGVkJyBub2RlIHRoYXQgaGFzIHRoZSBoaWdobGlnaHRpbmcsIGFuZCB3aWxsIGJlIHNjcm9sbGVkXHJcbiAgICAgICAgICogdG8gd2hlbmV2ZXIgdGhlIHBhZ2Ugd2l0aCB0aGF0IGNoaWxkIGlzIHZpc2l0ZWQsIGFuZCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCBob2xkcyB0aGUgbWFwIG9mIFwicGFyZW50IHVpZCB0b1xyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAgICAgKiBzZWxlY3RlZCBub2RlIHdpdGhpbiB0aGF0IHBhcmVudC4gTm90ZSB0aGlzICdzZWxlY3Rpb24gc3RhdGUnIGlzIG9ubHkgc2lnbmlmaWNhbnQgb24gdGhlIGNsaWVudCwgYW5kIG9ubHkgZm9yXHJcbiAgICAgICAgICogYmVpbmcgYWJsZSB0byBzY3JvbGwgdG8gdGhlIG5vZGUgZHVyaW5nIG5hdmlnYXRpbmcgYXJvdW5kIG9uIHRoZSB0cmVlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIFVzZXItc2VsZWN0YWJsZSB1c2VyLWFjY291bnQgb3B0aW9ucyBlYWNoIHVzZXIgY2FuIHNldCBvbiBoaXMgYWNjb3VudCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9BRFZBTkNFRDogc3RyaW5nID0gXCJhZHZhbmNlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9TSU1QTEU6IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgICAgIC8qIGNhbiBiZSAnc2ltcGxlJyBvciAnYWR2YW5jZWQnICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0TW9kZU9wdGlvbjogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2dnbGVkIGJ5IGJ1dHRvbiwgYW5kIGhvbGRzIGlmIHdlIGFyZSBnb2luZyB0byBzaG93IHByb3BlcnRpZXMgb3Igbm90IG9uIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB2aWV3XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UHJvcGVydGllczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBGbGFnIHRoYXQgaW5kaWNhdGVzIGlmIHdlIGFyZSByZW5kZXJpbmcgcGF0aCwgb3duZXIsIG1vZFRpbWUsIGV0Yy4gb24gZWFjaCByb3cgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dNZXRhRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIExpc3Qgb2Ygbm9kZSBwcmVmaXhlcyB0byBmbGFnIG5vZGVzIHRvIG5vdCBhbGxvdyB0byBiZSBzaG93biBpbiB0aGUgcGFnZSBpbiBzaW1wbGUgbW9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgXCJyZXA6XCI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVhZE9ubHlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmFyeVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBhbGwgbm9kZSB1aWRzIHRvIHRydWUgaWYgc2VsZWN0ZWQsIG90aGVyd2lzZSB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGRlbGV0ZWQgKG5vdCBleGlzdGluZylcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlbGVjdGVkTm9kZXM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBTZXQgb2YgYWxsIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGVkIChmcm9tIHRoZSBhYmJyZXZpYXRlZCBmb3JtKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZXhwYW5kZWRBYmJyZXZOb2RlSWRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogUmVuZGVyTm9kZVJlc3BvbnNlLmphdmEgb2JqZWN0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZURhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYWxsIHZhcmlhYmxlcyBkZXJpdmFibGUgZnJvbSBjdXJyZW50Tm9kZURhdGEsIGJ1dCBzdG9yZWQgZGlyZWN0bHkgZm9yIHNpbXBsZXIgY29kZS9hY2Nlc3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlVWlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVJZDogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlUGF0aDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogTWFwcyBmcm9tIGd1aWQgdG8gRGF0YSBPYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRhdGFPYmpNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGU6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVzZXJQcmVmZXJlbmNlczoganNvbi5Vc2VyUHJlZmVyZW5jZXMgPSB7XHJcbiAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiYWR2YW5jZWRNb2RlXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImxhc3ROb2RlXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcInNob3dNZXRhRGF0YVwiOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTWFpbk1lbnVQYW5lbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkaW5nIG1haW4gbWVudSBwYW5lbFwiKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSAnZ3VpZCcgb24gdGhpcyBvYmplY3QsIGFuZCBtYWtlcyBkYXRhT2JqTWFwIGFibGUgdG8gbG9vayB1cCB0aGUgb2JqZWN0IHVzaW5nIHRoYXQgZ3VpZCBpbiB0aGVcclxuICAgICAgICAgKiBmdXR1cmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWdpc3RlckRhdGFPYmplY3QgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghZGF0YS5ndWlkKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmd1aWQgPSArK25leHRHdWlkO1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iak1hcFtkYXRhLmd1aWRdID0gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRPYmplY3RCeUd1aWQgPSBmdW5jdGlvbihndWlkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBkYXRhT2JqTWFwW2d1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIG9iamVjdCBub3QgZm91bmQ6IGd1aWQ9XCIgKyBndWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBjYWxsYmFjayBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIHNjcmlwdCB0byBydW4sIG9yIGlmIGl0J3MgYSBmdW5jdGlvbiBvYmplY3QgdGhhdCB3aWxsIGJlXHJcbiAgICAgICAgICogdGhlIGZ1bmN0aW9uIHRvIHJ1bi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFdoZW5ldmVyIHdlIGFyZSBidWlsZGluZyBhbiBvbkNsaWNrIHN0cmluZywgYW5kIHdlIGhhdmUgdGhlIGFjdHVhbCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gdGhlIG5hbWUgb2YgdGhlXHJcbiAgICAgICAgICogZnVuY3Rpb24gKGkuZS4gd2UgaGF2ZSB0aGUgZnVuY3Rpb24gb2JqZWN0IGFuZCBub3QgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gd2UgaGFuZGUgdGhhdCBieSBhc3NpZ25pbmcgYSBndWlkXHJcbiAgICAgICAgICogdG8gdGhlIGZ1bmN0aW9uIG9iamVjdCwgYW5kIHRoZW4gZW5jb2RlIGEgY2FsbCB0byBydW4gdGhhdCBndWlkIGJ5IGNhbGxpbmcgcnVuQ2FsbGJhY2suIFRoZXJlIGlzIGEgbGV2ZWwgb2ZcclxuICAgICAgICAgKiBpbmRpcmVjdGlvbiBoZXJlLCBidXQgdGhpcyBpcyB0aGUgc2ltcGxlc3QgYXBwcm9hY2ggd2hlbiB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gbWFwIGZyb20gYSBzdHJpbmcgdG8gYVxyXG4gICAgICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogY3R4PWNvbnRleHQsIHdoaWNoIGlzIHRoZSAndGhpcycgdG8gY2FsbCB3aXRoIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiwgYW5kIGhhdmUgYSAndGhpcycgY29udGV4dCB0byBiaW5kIHRvIGl0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogcGF5bG9hZCBpcyBhbnkgZGF0YSBvYmplY3QgdGhhdCBuZWVkcyB0byBiZSBwYXNzZWQgYXQgcnVudGltZVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogbm90ZTogZG9lc24ndCBjdXJyZW50bHkgc3VwcG9ydCBoYXZpbmduIGEgbnVsbCBjdHggYW5kIG5vbi1udWxsIHBheWxvYWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbmNvZGVPbkNsaWNrID0gZnVuY3Rpb24oY2FsbGJhY2s6IGFueSwgY3R4PzogYW55LCBwYXlsb2FkPzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IC8vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChjdHgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QocGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXlsb2FkU3RyID0gcGF5bG9hZCA/IHBheWxvYWQuZ3VpZCA6IFwibnVsbFwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJtNjQubWV0YTY0LnJ1bkNhbGxiYWNrKFwiICsgY2FsbGJhY2suZ3VpZCArIFwiLFwiICsgY3R4Lmd1aWQgKyBcIixcIiArIHBheWxvYWRTdHIgKyBcIik7XCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm02NC5tZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIpO1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmV4cGVjdGVkIGNhbGxiYWNrIHR5cGUgaW4gZW5jb2RlT25DbGlja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJ1bkNhbGxiYWNrID0gZnVuY3Rpb24oZ3VpZCwgY3R4LCBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhT2JqID0gZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBvYmplY3QsIHdlIGV4cGVjdCBpdCB0byBoYXZlIGEgJ2NhbGxiYWNrJyBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAvLyB0aGF0IGlzIGEgZnVuY3Rpb25cclxuICAgICAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgb2sgdG9vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhT2JqID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IGdldE9iamVjdEJ5R3VpZChjdHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXlsb2FkT2JqID0gcGF5bG9hZCA/IGdldE9iamVjdEJ5R3VpZChwYXlsb2FkKSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsKHRoaXosIHBheWxvYWRPYmopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuYWJsZSB0byBmaW5kIGNhbGxiYWNrIG9uIHJlZ2lzdGVyZWQgZ3VpZDogXCIgKyBndWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluU2ltcGxlTW9kZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZWRpdE1vZGVPcHRpb24gPT09IE1PREVfU0lNUExFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGdvVG9NYWluUGFnZSh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ29Ub01haW5QYWdlID0gZnVuY3Rpb24ocmVyZW5kZXI/OiBib29sZWFuLCBmb3JjZVNlcnZlclJlZnJlc2g/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm9yY2VTZXJ2ZXJSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVyZW5kZXIgfHwgdHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgICAgICogcGFnZSBpbnRvIHZpc2libGUsIGFuZCBzY3JvbGwgdG8gbm9kZSlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlbGVjdFRhYiA9IGZ1bmN0aW9uKHBhZ2VOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgICg8X0hhc1NlbGVjdD5pcm9uUGFnZXMpLnNlbGVjdChwYWdlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKiB0aGlzIGNvZGUgY2FuIGJlIG1hZGUgbW9yZSBEUlksIGJ1dCBpJ20ganVzdCB0cnlpbmcgaXQgb3V0IGZvciBub3csIHNvIGknbSBub3QgYm90aGVyaW5nIHRvIHBlcmZlY3QgaXQgeWV0LiAqL1xyXG4gICAgICAgICAgICAvLyAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvLyAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBpZiAocGFnZU5hbWUgPT0gJ21haW5UYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3NlYXJjaFRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICd0aW1lbGluZVRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgZGF0YSAoaWYgcHJvdmlkZWQpIG11c3QgYmUgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBjdXJyZW50IGluc3RhbmNlIG9mIHRoZSBkaWFsb2csIGFuZCBhbGwgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqIG1ldGhvZHMgYXJlIG9mIGNvdXJzZSBzaW5nbGV0b25zIHRoYXQgYWNjZXB0IHRoaXMgZGF0YSBwYXJhbWV0ZXIgZm9yIGFueSBvcHRlcmF0aW9ucy4gKG9sZHNjaG9vbCB3YXkgb2YgZG9pbmdcclxuICAgICAgICAgKiBPT1Agd2l0aCAndGhpcycgYmVpbmcgZmlyc3QgcGFyYW1ldGVyIGFsd2F5cykuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBOb3RlOiBlYWNoIGRhdGEgaW5zdGFuY2UgaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIGd1aWQgbnVtYmVyaWMgcHJvcGVydHksIHVuaXF1ZSB0byBpdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hhbmdlUGFnZSA9IGZ1bmN0aW9uKHBnPzogYW55LCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGcudGFiSWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9vcHMsIHdyb25nIG9iamVjdCB0eXBlIHBhc3NlZCB0byBjaGFuZ2VQYWdlIGZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiB0aGlzIGlzIHRoZSBzYW1lIGFzIHNldHRpbmcgdXNpbmcgbWFpbklyb25QYWdlcz8/ICovXHJcbiAgICAgICAgICAgIHZhciBwYXBlclRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7IC8vXCIjbWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgKDxfSGFzU2VsZWN0PnBhcGVyVGFicykuc2VsZWN0KHBnLnRhYklkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb2RlQmxhY2tMaXN0ZWQgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcDtcclxuICAgICAgICAgICAgZm9yIChwcm9wIGluIHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgbm9kZS5uYW1lLnN0YXJ0c1dpdGgocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVVaWRzQXJyYXkgPSBmdW5jdGlvbigpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheTpzdHJpbmdbXSA9IFtdLCB1aWQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXkucHVzaCh1aWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgYSBuZXdseSBjbG9uZWQgYXJyYXkgb2YgYWxsIHRoZSBzZWxlY3RlZCBub2RlcyBlYWNoIHRpbWUgaXQncyBjYWxsZWQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZUlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6c3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHNlbGVjdGVkIG5vZGVzLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVuYWJsZSB0byBmaW5kIHVpZFRvTm9kZU1hcCBmb3IgdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxBcnJheS5wdXNoKG5vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm4gYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgZWFjaCBOb2RlSW5mbyB3aGVyZSB0aGUga2V5IGlzIHRoZSBpZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCA9IGZ1bmN0aW9uKCk6IE9iamVjdCB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2Rlc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJldFtzZWxBcnJheVtpXS5pZF0gPSBzZWxBcnJheVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyBzZWxlY3RlZCBub2RlcyBhcyBOb2RlSW5mby5qYXZhIG9iamVjdHMgYXJyYXkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBcnJheSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gW107XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0ZWROb2RlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMsIG5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IG93bmVyQnVmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbWluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5vd25lcnMpIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChyZXMub3duZXJzLCBmdW5jdGlvbihpbmRleCwgb3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gb3duZXI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5vZGUub3duZXIgPSBvd25lckJ1ZjtcclxuICAgICAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI293bmVyRGlzcGxheVwiICsgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmh0bWwoXCIgKE1hbmFnZXI6IFwiICsgb3duZXJCdWYgKyBcIilcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1vdGhlclwiLCBcImNyZWF0ZWQtYnktbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1tZVwiLCBcImNyZWF0ZWQtYnktb3RoZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm8gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTm9kZUluZm9SZXNwb25zZShyZXMsIG5vZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUZyb21JZCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkVG9Ob2RlTWFwW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UGF0aE9mVWlkID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIltwYXRoIGVycm9yLiBpbnZhbGlkIHVpZDogXCIgKyB1aWQgKyBcIl1cIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IGpzb24uTm9kZUluZm8gPSBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodFJvd0J5SWQgPSBmdW5jdGlvbihpZCwgc2Nyb2xsKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0Tm9kZUZyb21JZChpZCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHROb2RlKG5vZGUsIHNjcm9sbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpZ2hsaWdodFJvd0J5SWQgZmFpbGVkIHRvIGZpbmQgaWQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudDogV2Ugd2FudCB0aGlzIHRvIGJlIHRoZSBvbmx5IG1ldGhvZCB0aGF0IGNhbiBzZXQgdmFsdWVzIG9uICdwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCcsIGFuZCBhbHdheXNcclxuICAgICAgICAgKiBzZXR0aW5nIHRoYXQgdmFsdWUgc2hvdWxkIGdvIHRocnUgdGhpcyBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzY3JvbGw6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRvbmVIaWdobGlnaHRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qIFVuaGlnaGxpZ2h0IGN1cnJlbnRseSBoaWdobGlnaHRlZCBub2RlIGlmIGFueSAqL1xyXG4gICAgICAgICAgICBsZXQgY3VySGlnaGxpZ2h0ZWROb2RlOiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFscmVhZHkgaGlnaGxpZ2h0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmVIaWdobGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQgPSBjdXJIaWdobGlnaHRlZE5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRvbmVIaWdobGlnaHRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbTogc3RyaW5nID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGZpbmQgcm93RWxlbWVudCB0byBoaWdobGlnaHQ6IFwiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVhbGx5IG5lZWQgdG8gdXNlIHB1Yi9zdWIgZXZlbnQgdG8gYnJvYWRjYXN0IGVuYWJsZW1lbnQsIGFuZCBsZXQgZWFjaCBjb21wb25lbnQgZG8gdGhpcyBpbmRlcGVuZGVudGx5IGFuZFxyXG4gICAgICAgICAqIGRlY291cGxlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVDb3VudDogbnVtYmVyID0gdXRpbC5nZXRQcm9wZXJ0eUNvdW50KHNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZUlzTWluZTogYm9vbGVhbiA9IGhpZ2hsaWdodE5vZGUgJiYgKGhpZ2hsaWdodE5vZGUuY3JlYXRlZEJ5ID09PSB1c2VyTmFtZSB8fCBcImFkbWluXCIgPT09IHVzZXJOYW1lKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhvbWVOb2RlSWQ9XCIrbWV0YTY0LmhvbWVOb2RlSWQrXCIgaGlnaGxpZ2h0Tm9kZS5pZD1cIitoaWdobGlnaHROb2RlLmlkKTtcclxuICAgICAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZDtcclxuICAgICAgICAgICAgbGV0IGltcG9ydEZlYXR1cmVFbmFibGVkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmltcG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBleHBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5leHBvcnRBbGxvd2VkO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0T3JkaW5hbDogbnVtYmVyID0gZ2V0T3JkaW5hbE9mTm9kZShoaWdobGlnaHROb2RlKTtcclxuICAgICAgICAgICAgbGV0IG51bUNoaWxkTm9kZXM6IG51bWJlciA9IGdldE51bUNoaWxkTm9kZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IGhpZ2hsaWdodE9yZGluYWwgPiAwICYmIG51bUNoaWxkTm9kZXMgPiAxO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSBoaWdobGlnaHRPcmRpbmFsIDwgbnVtQ2hpbGROb2RlcyAtIDEgJiYgbnVtQ2hpbGROb2RlcyA+IDE7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogbmVlZCB0byBhZGQgdG8gdGhpcyBzZWxOb2RlSXNNaW5lIHx8IHNlbFBhcmVudElzTWluZTtcclxuICAgICAgICAgICAgbGV0IGNhbkNyZWF0ZU5vZGUgPSB1c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgKGlzQWRtaW5Vc2VyIHx8ICghaXNBbm9uVXNlciAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVuYWJsZW1lbnQ6IGlzQW5vblVzZXI9XCIgKyBpc0Fub25Vc2VyICsgXCIgc2VsTm9kZUNvdW50PVwiICsgc2VsTm9kZUNvdW50ICsgXCIgc2VsTm9kZUlzTWluZT1cIiArIHNlbE5vZGVJc01pbmUpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibmF2TG9nb3V0QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIGlzQW5vblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BzVG9nZ2xlOiBib29sZWFuID0gY3VycmVudE5vZGUgJiYgIWlzQW5vblVzZXI7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInByb3BzVG9nZ2xlQnV0dG9uXCIsIHByb3BzVG9nZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxvd0VkaXRNb2RlOiBib29sZWFuID0gY3VycmVudE5vZGUgJiYgIWlzQW5vblVzZXI7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBMZXZlbEJ1dHRvblwiLCBjdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY3V0U2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwYXN0ZVNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGVkaXQubm9kZXNUb01vdmUgIT0gbnVsbCAmJiAoc2VsTm9kZUlzTWluZSB8fCBob21lTm9kZVNlbGVjdGVkKSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlRG93bkJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjaGFuZ2VQYXNzd29yZFBnQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBpc0FkbWluVXNlciB8fCAodXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIGhpZ2hsaWdodE5vZGUuaGFzQmluYXJ5ICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGFsbG93RmlsZVN5c3RlbVNlYXJjaCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlZnJlc2hQYWdlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjcmVhdGVOb2RlQnV0dG9uXCIsIGNhbkNyZWF0ZU5vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkICYmIChzZWxOb2RlSXNNaW5lIHx8IGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuRXhwb3J0RGxnXCIsIGV4cG9ydEZlYXR1cmVFbmFibGVkICYmIChzZWxOb2RlSXNNaW5lIHx8IGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIC8vVG9wIExldmVsIE1lbnUgVmlzaWJpbGl0eVxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2luZ2xlU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZztcclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQgYSBzaW5nbGUgU2VsIE5vZGVJRDogXCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T3JkaW5hbE9mTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE51bUNoaWxkTm9kZXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0Q3VycmVudE5vZGVEYXRhID0gZnVuY3Rpb24oZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZURhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGRhdGEubm9kZTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVVaWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUlkID0gZGF0YS5ub2RlLmlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVBhdGggPSBkYXRhLm5vZGUucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLnJlbmRlck5vZGVSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW1vdmVCaW5hcnlCeVVpZCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzQmluYXJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdXBkYXRlcyBjbGllbnQgc2lkZSBtYXBzIGFuZCBjbGllbnQtc2lkZSBpZGVudGlmaWVyIGZvciBuZXcgbm9kZSwgc28gdGhhdCB0aGlzIG5vZGUgaXMgJ3JlY29nbml6ZWQnIGJ5IGNsaWVudFxyXG4gICAgICAgICAqIHNpZGUgY29kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCB1cGRhdGVNYXBzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBhc3NpZ24gYSBwcm9wZXJ0eSBmb3IgZGV0ZWN0aW5nIHRoaXMgbm9kZSB0eXBlLCBJJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiB1c2luZyBzb21lIGtpbmQgb2YgY3VzdG9tIEpTXHJcbiAgICAgICAgICAgICAqIHByb3RvdHlwZS1yZWxhdGVkIGFwcHJvYWNoXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHVwZGF0ZU1hcHMgPyB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBGb3IgdGhlc2UgdHdvIHByb3BlcnRpZXMgdGhhdCBhcmUgYWNjZXNzZWQgZnJlcXVlbnRseSB3ZSBnbyBhaGVhZCBhbmQgbG9va3VwIHRoZSBwcm9wZXJ0aWVzIGluIHRoZVxyXG4gICAgICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgICAgICogc2ltcGxpZnkgY29kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuTEFTVF9NT0RJRklFRCwgbm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZU1hcHMpIHtcclxuICAgICAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgaWRUb05vZGVNYXBbbm9kZS5pZF0gPSBub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRDb25zdGFudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBPTElDWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwocmVhZE9ubHlQcm9wZXJ0eUxpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoYmluYXJ5UHJvcGVydHlMaXN0LCBbamNyQ25zdC5CSU5fREFUQV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXRBcHAgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBhcHBJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgIHRhYnMuYWRkRXZlbnRMaXN0ZW5lcihcImlyb24tc2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGFiQ2hhbmdlRXZlbnQodGFicy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5pdENvbnN0YW50cygpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2lnbnVwTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdG9kby0zOiBob3cgZG9lcyBvcmllbnRhdGlvbmNoYW5nZSBuZWVkIHRvIHdvcmsgZm9yIHBvbHltZXI/IFBvbHltZXIgZGlzYWJsZWRcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgXy5vcmllbnRhdGlvbkhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTGVhdmUgTWV0YTY0ID9cIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJIHRob3VnaHQgdGhpcyB3YXMgYSBnb29kIGlkZWEsIGJ1dCBhY3R1YWxseSBpdCBkZXN0cm95cyB0aGUgc2Vzc2lvbiwgd2hlbiB0aGUgdXNlciBpcyBlbnRlcmluZyBhblxyXG4gICAgICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgICAgICogZ29pbmcgdG8gYSBkaWZmZXJlbnQgdXJsIHNob3VsZG4ndCBibG93IHVwIHRoZSBzZXNzaW9uLCB3aGljaCBpcyB3aGF0ICdsb2dvdXQnIGRvZXMuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBkZXZpY2VXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICBkZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIGZvciBzY3JlZW4gc2l6ZSBpbiBhIHRpbWVyLiBXZSBkb24ndCB3YW50IHRvIG1vbml0b3IgYWN0dWFsIHNjcmVlbiByZXNpemUgZXZlbnRzIGJlY2F1c2UgaWYgYSB1c2VyXHJcbiAgICAgICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGEgdGhyb3R0bGUgc29ydCBvZi4gWWVzIEkga25vdyBob3cgdG8gbGlzdGVuIGZvciBldmVudHMuIE5vIEknbSBub3QgZG9pbmcgaXQgd3JvbmcgaGVyZS4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyB2YXIgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uc2NyZWVuU2l6ZUNoYW5nZSgpOyB9IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuaW5pdFByb2dyZXNzTW9uaXRvcigpO1xyXG5cclxuICAgICAgICAgICAgcHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9jZXNzVXJsUGFyYW1zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgICAgIGlmIChwYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXJsQ21kID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJjbWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hUYWJBY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5U2lnbnVwTWVzc2FnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2lnbnVwUmVzcG9uc2UgPSAkKFwiI3NpZ251cENvZGVSZXNwb25zZVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTaWdudXAgY29tcGxldGUuIFlvdSBtYXkgbm93IGxvZ2luLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUoY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBEb24ndCBuZWVkIHRoaXMgbWV0aG9kIHlldCwgYW5kIGhhdmVuJ3QgdGVzdGVkIHRvIHNlZSBpZiB3b3JrcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJykge1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9hZEFub25QYWdlSG9tZSA9IGZ1bmN0aW9uKGlnbm9yZVVybCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Bbm9uUGFnZUxvYWRSZXF1ZXN0LCBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlPihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlnbm9yZVVybFwiOiBpZ25vcmVVcmxcclxuICAgICAgICAgICAgfSwgYW5vblBhZ2VMb2FkUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlVXNlclByZWZlcmVuY2VzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHVzZXJQcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk9wZW5TeXN0ZW1GaWxlUmVxdWVzdCwganNvbi5PcGVuU3lzdGVtRmlsZVJlc3BvbnNlPihcIm9wZW5TeXN0ZW1GaWxlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogZmlsZU5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0b2RvLTA6IGZvciBub3cgSSdsbCBqdXN0IGRyb3AgdGhpcyBpbnRvIGEgZ2xvYmFsIHZhcmlhYmxlLiBJIGtub3cgdGhlcmUncyBhIGJldHRlciB3YXkuIFRoaXMgaXMgdGhlIG9ubHkgdmFyaWFibGVcclxud2UgaGF2ZSBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgYW5kIGlzIG9ubHkgcmVxdWlyZWQgZm9yIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uIGluIEpTIG9uIHRoZSBpbmRleC5odG1sIHBhZ2UgKi9cclxuaWYgKCF3aW5kb3dbXCJtZXRhNjRcIl0pIHtcclxuICAgIHZhciBtZXRhNjQgPSBtNjQubWV0YTY0O1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBuYXYge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5NYWluTWVudUhlbHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvbWV0YTY0L3B1YmxpYy9oZWxwXCIsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Sc3NGZWVkc05vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvcnNzL2ZlZWRzXCIsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLyogSSdtIHNldHRpbmcgdGhpcyBoZXJlIHNvIHRoYXQgd2UgY2FuIGNvbWUgdXAgd2l0aCBhIHdheSB0byBtYWtlIHRoZSBhYmJyZXYgZXhwYW5kIHN0YXRlIGJlIHJlbWVtYmVyZWQsIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzIGlzIGxvd2VyIHByaW9yaXR5IGZvciBub3csIHNvIGknbSBub3QgdXNpbmcgaXQgeWV0ICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5leHBhbmRlZEFiYnJldk5vZGVJZHNbbm9kZUlkXSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0LCBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlPihcImV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWRcclxuICAgICAgICAgICAgfSwgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVkFMOiBcIitKU09OLnN0cmluZ2lmeShyZXMubm9kZUluZm8pKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZUluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRpc3BsYXlpbmdIb21lID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudFZpc2libGVUb1VzZXIgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFkaXNwbGF5aW5nSG9tZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cExldmVsUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCBpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIGRhdGEgaXMgdmlzaWJsZSB0byB5b3UgYWJvdmUgdGhpcyBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQoaWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2VXBMZXZlbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRWaXNpYmxlVG9Vc2VyKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgYXQgcm9vdC4gQ2FuJ3QgZ28gdXAuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogMSxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWREb21FbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwucG9seUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBub2RlIGhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFRocm93KFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uTm9kZVJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBzZXRzIHdoaWNoIG5vZGUgaXMgc2VsZWN0ZWQgb24gdGhpcyBwYWdlIChpLmUuIHBhcmVudCBub2RlIG9mIHRoaXMgcGFnZSBiZWluZyB0aGUgJ2tleScpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBpZiBub2RlLm93bmVyIGlzIGN1cnJlbnRseSBudWxsLCB0aGF0IG1lYW5zIHdlIGhhdmUgbm90IHJldHJpZXZlZCB0aGUgb3duZXIgZnJvbSB0aGUgc2VydmVyIHlldCwgYnV0XHJcbiAgICAgICAgICAgICAgICAgKiBpZiBub24tbnVsbCBpdCdzIGFscmVhZHkgZGlzcGxheWluZyBhbmQgd2UgZG8gbm90aGluZy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlLm93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHVwZGF0ZU5vZGVJbmZvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC51cGRhdGVOb2RlSW5mbyhub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3Blbk5vZGUgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gb3Blbk5vZGU6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShub2RlLmlkLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdW5mb3J0dW5hdGVseSB3ZSBoYXZlIHRvIHJlbHkgb24gb25DbGljaywgYmVjYXVzZSBvZiB0aGUgZmFjdCB0aGF0IGV2ZW50cyB0byBjaGVja2JveGVzIGRvbid0IGFwcGVhciB0byB3b3JrXHJcbiAgICAgICAgICogaW4gUG9sbWVyIGF0IGFsbCwgYW5kIHNpbmNlIG9uQ2xpY2sgcnVucyBCRUZPUkUgdGhlIHN0YXRlIGNoYW5nZSBpcyBjb21wbGV0ZWQsIHRoYXQgaXMgdGhlIHJlYXNvbiBmb3IgdGhlXHJcbiAgICAgICAgICogc2lsbHkgbG9va2luZyBhc3luYyB0aW1lciBoZXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdG9nZ2xlTm9kZVNlbCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgdG9nZ2xlQnV0dG9uOiBhbnkgPSB1dGlsLnBvbHlFbG0odWlkICsgXCJfc2VsXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUJ1dHRvbi5ub2RlLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZQYWdlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2SG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlB1YmxpY0hvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHByZWZzLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHByZWZzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DbG9zZUFjY291bnRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xvc2VBY2NvdW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9oIE5vIVwiLCBcIkNsb3NlIHlvdXIgQWNjb3VudD88cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGVsZXRlQWxsVXNlckNvb2tpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DbG9zZUFjY291bnRSZXF1ZXN0LCBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlPihcImNsb3NlQWNjb3VudFwiLCB7fSwgY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJvcHMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJvcHMge1xyXG5cclxuICAgICAgZXhwb3J0IGxldCBvcmRlclByb3BzID0gZnVuY3Rpb24ocHJvcE9yZGVyOiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0SWR4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcE9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgdGFyZ2V0SWR4ID0gbW92ZU5vZGVQb3NpdGlvbihwcm9wc05ldywgdGFyZ2V0SWR4LCBwcm9wKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBtb3ZlTm9kZVBvc2l0aW9uID0gZnVuY3Rpb24ocHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10sIGlkeDogbnVtYmVyLCB0eXBlTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHByb3BzLmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgcHJvcHMuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIGlkeCsrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBpZHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUb2dnbGVzIGRpc3BsYXkgb2YgcHJvcGVydGllcyBpbiB0aGUgZ3VpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcHNUb2dnbGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICAvLyBzZXREYXRhSWNvblVzaW5nSWQoXCIjZWRpdE1vZGVCdXR0b25cIiwgZWRpdE1vZGUgPyBcImVkaXRcIiA6XHJcbiAgICAgICAgICAgIC8vIFwiZm9yYmlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgICAgIC8vIHZhciBlbG0gPSAkKFwiI3Byb3BzVG9nZ2xlQnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAvLyBlbG0udG9nZ2xlQ2xhc3MoXCJ1aS1pY29uLWdyaWRcIiwgbWV0YTY0LnNob3dQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IGVkaXQuZWRpdE5vZGUucHJvcGVydGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaWNlIGlzIGhvdyB5b3UgZGVsZXRlIGFycmF5IGVsZW1lbnRzIGluIGpzLlxyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU29ydHMgcHJvcHMgaW5wdXQgYXJyYXkgaW50byB0aGUgcHJvcGVyIG9yZGVyIHRvIHNob3cgZm9yIGVkaXRpbmcuIFNpbXBsZSBhbGdvcml0aG0gZmlyc3QgZ3JhYnMgJ2pjcjpjb250ZW50J1xyXG4gICAgICAgICAqIG5vZGUgYW5kIHB1dHMgaXQgb24gdGhlIHRvcCwgYW5kIHRoZW4gZG9lcyBzYW1lIGZvciAnamN0Q25zdC5UQUdTJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgICAgbGV0IGZ1bmM6RnVuY3Rpb24gPSBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jKG5vZGUsIHByb3BzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BzTmV3OiBqc29uLlByb3BlcnR5SW5mb1tdID0gcHJvcHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkeDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHByb3BzTmV3LmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBqY3JDbnN0LkNPTlRFTlQpO1xyXG4gICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wc05ldy5hcnJheU1vdmVJdGVtKHRhZ0lkeCwgdGFyZ2V0SWR4KyspO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YWdJZHggPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5UQUdTKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzTmV3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbCBvciBhIGxpc3Qgb2YgUHJvcGVydHlJbmZvIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHJvcGVydGllcyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFibGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wZXJ0eS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRkOiBzdHJpbmcgPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtbmFtZS1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcGVydHkubmFtZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCaW5hcnlQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBcIltiaW5hcnldXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcmVuZGVyLndyYXBIdG1sKHByb3BlcnR5Lmh0bWxWYWx1ZSA/IHByb3BlcnR5Lmh0bWxWYWx1ZSA6IHByb3BlcnR5LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHByb3BzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRkICs9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS12YWwtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlICs9IHJlbmRlci50YWcoXCJ0clwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1yb3dcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3BlcnR5Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wQ291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwidGFibGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wZXJ0eS10YWJsZVwiXHJcbiAgICAgICAgICAgICAgICB9LCB0YWJsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGJydXRlIGZvcmNlIHNlYXJjaGVzIG9uIG5vZGUgKE5vZGVJbmZvLmphdmEpIG9iamVjdCBwcm9wZXJ0aWVzIGxpc3QsIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBwcm9wZXJ0eVxyXG4gICAgICAgICAqIChQcm9wZXJ0eUluZm8uamF2YSkgd2l0aCBuYW1lIG1hdGNoaW5nIHByb3BlcnR5TmFtZSwgZWxzZSBudWxsLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKToganNvbi5Qcm9wZXJ0eUluZm8ge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucHJvcGVydGllcylcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IG5vZGUucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgPT09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHlWYWwgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBnZXROb2RlUHJvcGVydHkocHJvcGVydHlOYW1lLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3AgPyBwcm9wLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVzIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGtub3cgd2hvIG93bnMgdGhpcyBub2RlIGFzc3VtZSB0aGUgYWRtaW4gb3ducyBpdC5cclxuICAgICAgICAgICAgaWYgKCFjcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRCeSA9IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyBPUiBjb25kaXRpb24gYmVjYXVzZSBvZiBjcmVhdGVkQnkgaXMgbnVsbCB3ZSBhc3N1bWUgd2UgZG8gbm90IG93biBpdCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc093bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlIHx8IHByb3BlcnR5LnZhbHVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTE6IG1ha2Ugc3VyZSB0aGlzIHdyYXBIdG1sIGlzbid0IGNyZWF0aW5nIGFuIHVubmVjZXNzYXJ5IERJViBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS5odG1sVmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbih2YWx1ZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgJC5lYWNoKHZhbHVlcywgZnVuY3Rpb24oaSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIud3JhcEh0bWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiByZW5kZXIuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBwb3N0VGFyZ2V0VXJsO1xyXG5kZWNsYXJlIHZhciBwcmV0dHlQcmludDtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSByZW5kZXIge1xyXG4gICAgICAgIGxldCBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcbiAgICAgICAgICogd2FudCB0byBnaXZlIHRoZW0gc29tZSBpbnN0cnVjdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIGFkZCBjb250ZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBnZXRFbXB0eVBhZ2VQcm9tcHQgPSBmdW5jdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCaW5hcnkgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhbiBpbWFnZSByZW5kZXIgdGhlIGltYWdlIGRpcmVjdGx5IG9udG8gdGhlIHBhZ2UgYXMgYSB2aXNpYmxlIGltYWdlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZS5iaW5hcnlJc0ltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUltYWdlVGFnKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCBhbiBpbWFnZSB3ZSByZW5kZXIgYSBsaW5rIHRvIHRoZSBhdHRhY2htZW50LCBzbyB0aGF0IGl0IGNhbiBiZSBkb3dubG9hZGVkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5jaG9yOiBzdHJpbmcgPSB0YWcoXCJhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIjogZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSlcclxuICAgICAgICAgICAgICAgIH0sIFwiW0Rvd25sb2FkIEF0dGFjaG1lbnRdXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJiaW5hcnktbGlua1wiXHJcbiAgICAgICAgICAgICAgICB9LCBhbmNob3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudCBsaXR0bGUgbWV0aG9kIGhlcmUuIEFsbCBHVUkgcGFnZS9kaXZzIGFyZSBjcmVhdGVkIHVzaW5nIHRoaXMgc29ydCBvZiBzcGVjaWZpY2F0aW9uIGhlcmUgdGhhdCB0aGV5XHJcbiAgICAgICAgICogYWxsIG11c3QgaGF2ZSBhICdidWlsZCcgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZpcnN0IHRpbWUgb25seSwgYW5kIHRoZW4gdGhlICdpbml0JyBtZXRob2QgY2FsbGVkIGJlZm9yZSBlYWNoXHJcbiAgICAgICAgICogdGltZSB0aGUgY29tcG9uZW50IGdldHMgZGlzcGxheWVkIHdpdGggbmV3IGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgJ2RhdGEnIGlzIHByb3ZpZGVkLCB0aGlzIGlzIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlkUGFnZSA9IGZ1bmN0aW9uKHBnLCBkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRQYWdlOiBwZy5kb21JZD1cIiArIHBnLmRvbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGcuYnVpbHQgfHwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbGQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwZy5idWlsdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwZy5pbml0KSB7XHJcbiAgICAgICAgICAgICAgICBwZy5pbml0KGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkUm93SGVhZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGg6IGJvb2xlYW4sIHNob3dOYW1lOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGVhZGVyVGV4dDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9PTl9ST1dTKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIGZvcm1hdFBhdGgobm9kZSkgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKGNvbW1lbnRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q29tbWVudCBCeTogXCIgKyBjb21tZW50QnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLmNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAobm9kZS5jcmVhdGVkQnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNyZWF0ZWQgQnk6IFwiICsgbm9kZS5jcmVhdGVkQnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGlkPSdvd25lckRpc3BsYXlcIiArIG5vZGUudWlkICsgXCInPjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiICBNb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb24gcm9vdCBub2RlIG5hbWUgd2lsbCBiZSBlbXB0eSBzdHJpbmcgc28gZG9uJ3Qgc2hvdyB0aGF0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIGNvbW1lbnRpbmc6IEkgZGVjaWRlZCB1c2VycyB3aWxsIHVuZGVyc3RhbmQgdGhlIHBhdGggYXMgYSBzaW5nbGUgbG9uZyBlbnRpdHkgd2l0aCBsZXNzIGNvbmZ1c2lvbiB0aGFuXHJcbiAgICAgICAgICAgICAqIGJyZWFraW5nIG91dCB0aGUgbmFtZSBmb3IgdGhlbS4gVGhleSBhbHJlYWR5IHVuc2Vyc3RhbmQgaW50ZXJuZXQgVVJMcy4gVGhpcyBpcyB0aGUgc2FtZSBjb25jZXB0LiBObyBuZWVkXHJcbiAgICAgICAgICAgICAqIHRvIGJhYnkgdGhlbS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlICFzaG93UGF0aCBjb25kaXRpb24gaGVyZSBpcyBiZWNhdXNlIGlmIHdlIGFyZSBzaG93aW5nIHRoZSBwYXRoIHRoZW4gdGhlIGVuZCBvZiB0aGF0IGlzIGFsd2F5cyB0aGVcclxuICAgICAgICAgICAgICogbmFtZSwgc28gd2UgZG9uJ3QgbmVlZCB0byBzaG93IHRoZSBwYXRoIEFORCB0aGUgbmFtZS4gT25lIGlzIGEgc3Vic3RyaW5nIG9mIHRoZSBvdGhlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChzaG93TmFtZSAmJiAhc2hvd1BhdGggJiYgbm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiTmFtZTogXCIgKyBub2RlLm5hbWUgKyBcIiBbdWlkPVwiICsgbm9kZS51aWQgKyBcIl1cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaGVhZGVyLXRleHRcIlxyXG4gICAgICAgICAgICB9LCBoZWFkZXJUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAgICAgKiBwcmV0dGlmaWVyIHRvIHByb2Nlc3MgaXQgdGhlIHJlc3Qgb2YgdGhlIHdheSAod2hlbiB3ZSBjYWxsIHByZXR0eVByaW50KCkgZm9yIHRoZSB3aG9sZSBwYWdlKSB3ZSBub3cgcnVuXHJcbiAgICAgICAgICogYW5vdGhlciBzdGFnZSBvZiB0cmFuc2Zvcm1hdGlvbiB0byBnZXQgdGhlIDxwcmU+IHRhZyBwdXQgaW4gd2l0aCAncHJldHR5cHJpbnQnIGV0Yy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdENvZGVGb3JtYXR0aW5nID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZW50KSByZXR1cm4gY29udGVudDtcclxuICAgICAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAgICAgLy8gYGBganNcclxuICAgICAgICAgICAgLy8gdmFyIHggPSAxMDtcclxuICAgICAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIGlmIChjb250ZW50LmNvbnRhaW5zKFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0U3Vic3RpdHV0aW9ucyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2VBbGwoXCJ7e2xvY2F0aW9uT3JpZ2lufX1cIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMTogbmVlZCB0byBwcm92aWRlIHNvbWUgd2F5IG9mIGhhdmluZyB0aGVzZSBsYW5ndWFnZSB0eXBlcyBjb25maWd1cmFibGUgaW4gYSBwcm9wZXJ0aWVzIGZpbGVcclxuICAgICAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGxhbmdzID0gW1wianNcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGUgY2xhc3M9XFxcIlwiICsgbGFuZ3NbaV0gKyBcIlxcXCI+XCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8P3ByZXR0aWZ5IGxhbmc9XCIgKyBsYW5nc1tpXSArIFwiPz48cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZT5cIiwgXCI8cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZnRlciBhIHByb3BlcnR5LCBvciBub2RlIGlzIHVwZGF0ZWQgKHNhdmVkKSB3ZSBjYW4gbm93IGNhbGwgdGhpcyBtZXRob2QgaW5zdGVhZCBvZiByZWZyZXNoaW5nIHRoZSBlbnRpcmUgcGFnZVxyXG4gICAgICAgIHdoaWNoIGlzIHdoYXQncyBkb25lIGluIG1vc3Qgb2YgdGhlIGFwcCwgd2hpY2ggaXMgbXVjaCBsZXNzIGVmZmljaWVudCBhbmQgc25hcHB5IHZpc3VhbGx5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTm9kZU9uUGFnZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIGxvb2t1cCB1aWQgZnJvbSBOb2RlSW5mby5pZCB0aGVuIHNldCB0aGUgY29udGVudCBvZiB0aGlzIGRpdi5cclxuICAgICAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAvL3RvIHRoZSB2YWx1ZSBmcm9tIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1ldGE2NC5pZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlSWQgXCIgKyBub2RlLmlkICsgXCIgaW4gdWlkIG1hcFwiO1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodWlkICE9IG5vZGUudWlkKSB0aHJvdyBcInVpZCBjaGFuZ2VkIHVuZXhwZWN0bHkgYWZ0ZXIgaW5pdE5vZGVcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAgICAgKiBhcHAgYW5kIGlzIHdoYXQgdGhlIHVzZXIgc2VlcyBjb3ZlcmluZyA5MCUgb2YgdGhlIHNjcmVlbiBtb3N0IG9mIHRoZSB0aW1lLiBUaGUgXCJjb250ZW50KiBub2Rlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMDogUmF0aGVyIHRoYW4gaGF2aW5nIHRoaXMgbm9kZSByZW5kZXJlciBpdHNlbGYgYmUgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyBhbGwgdGhlIGRpZmZlcmVudCB0eXBlc1xyXG4gICAgICAgICAqIG9mIG5vZGVzLCBuZWVkIGEgbW9yZSBwbHVnZ2FibGUgZGVzaWduLCB3aGVyZSByZW5kZWluZyBvZiBkaWZmZXJlbnQgdGhpbmdzIGlzIGRlbGV0YWdlZCB0byBzb21lXHJcbiAgICAgICAgICogYXBwcm9wcmlhdGUgb2JqZWN0L3NlcnZpY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVDb250ZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGgsIHNob3dOYW1lLCByZW5kZXJCaW4sIHJvd1N0eWxpbmcsIHNob3dIZWFkZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSBnZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zaG93TWV0YURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gYnVpbGRSb3dIZWFkZXIobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd1Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVuZGVyQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIE5vZGVzIHRoYXQgaGF2ZSBhIHBsdWdpbi1yZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZnVuYyhub2RlLCByb3dTdHlsaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcHJvcHMucmVuZGVyUHJvcGVydHkoY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gXCI8ZGl2PlwiICsgamNyQ29udGVudCArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnNlcnZlck1hcmtkb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkIHVzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoQWxzbyBuZWVkIHRvIG1ha2UgdGhpcyBhIGNvbmZpZ3VyYWJsZSBvcHRpb24sIGJlY2F1c2Ugb3RoZXIgY2xvbmVzIG9mIG1ldGE2NCBkb24ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3YW50IG15IGdpdGh1YiBsaW5rISlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIGRlY2lkZWQgZm9yIG5vdyBJIGRvbid0IHdhbnQgdG8gc2hvdyB0aGUgZm9yay1tZS1vbi1naXRodWIgaW1hZ2UgYXQgdXBwZXIgcmlnaHQgb2YgYXBwLCBidXQgdW5jb21tZW50aW5nIHRoaXMgbGluZSBpcyBhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoYXQncyByZXF1aXJlZCB0byBicmluZyBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1wiPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZycgY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIitcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSBzcGVudCBob3VycyB0cnlpbmcgdG8gZ2V0IG1hcmtlZC1lbGVtZW50IHRvIHdvcmsuIFVuc3VjY2Vzc2Z1bCBzdGlsbCwgc28gSSBqdXN0IGhhdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogc2VydmVyTWFya2Rvd24gZmxhZyB0aGF0IEkgY2FuIHNldCB0byB0cnVlLCBhbmQgdHVybiB0aGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIG9mZiBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogYWx0ZXJuYXRlIGF0dHJpYnV0ZSB3YXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnQgPSBqY3JDb250ZW50LnJlcGxhY2VBbGwoXCInXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInt7cXVvdH19XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2Rvd249J1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICsgXCInPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwgamNyLWNvbnRlbnQnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPC9kaXY+PC9tYXJrZWQtZWxlbWVudD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwic2NyaXB0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dC9tYXJrZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGlmIChqY3JDb250ZW50Lmxlbmd0aCA+IDApIHsgaWYgKHJvd1N0eWxpbmcpIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLWNvbnRlbnRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBqY3JDb250ZW50KTsgfSBlbHNlIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLXJvb3QtY29udGVudFwiIH0sIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yIHRoaXMgLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLiBcIjxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCIgKyBqY3JDb250ZW50KTsgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiUm9vdCBOb2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXM6IHN0cmluZyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVuZGVyQmluICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmluYXJ5OiBzdHJpbmcgPSByZW5kZXJCaW5hcnkobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgdXNlciBoYXMgcHV0IHt7aW5zZXJ0LWF0dGFjaG1lbnR9fSBpZiB0aGV5IGFyZSB1c2luZyB0aGF0IHRvIG1ha2UgdGhlIGltYWdlIGFwcGVhciBpbiBhIHNwZWNpZmljXHJcbiAgICAgICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChyZXQuY29udGFpbnMoY25zdC5JTlNFUlRfQVRUQUNITUVOVCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQucmVwbGFjZUFsbChjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gYmluYXJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnczogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuVEFHUywgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidGFncy1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiVGFnczogXCIgKyB0YWdzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKGpzb25Db250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjogXCIgKyBqc29uQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdDogYW55W10gPSBKU09OLnBhcnNlKGpzb25Db250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN5c3RlbUZpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LCBlbnRyeS5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbE9wZW5MaW5rID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IFwibTY0Lm1ldGE2NC5vcGVuU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiTG9jYWwgT3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRvd25sb2FkTGluayA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9oYXZlbid0IGltcGxlbWVudGVkIGRvd25sb2FkIGNhcGFiaWxpdHkgeWV0LlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwib25jbGlja1wiOiBcIm02NC5tZXRhNjQuZG93bmxvYWRTeXN0ZW1GaWxlKCdcIiArIGVudHJ5LmZpbGVOYW1lICsgXCInKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSwgXCJEb3dubG9hZFwiKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua3NEaXYgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGxvY2FsT3BlbkxpbmsgKyBkb3dubG9hZExpbmspO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmlsZU5hbWVEaXYgKyBsaW5rc0Rpdik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kUmVUaHJvdyhcInJlbmRlciBmYWlsZWRcIiwgZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJbcmVuZGVyIGZhaWxlZF1cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBwcmltYXJ5IG1ldGhvZCBmb3IgcmVuZGVyaW5nIGVhY2ggbm9kZSAobGlrZSBhIHJvdykgb24gdGhlIG1haW4gSFRNTCBwYWdlIHRoYXQgZGlzcGxheXMgbm9kZVxyXG4gICAgICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBub2RlLnVpZDtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDE7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IGluZGV4IDwgY291bnQgLSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSBlZGl0aW5nQWxsb3dlZD1cIitlZGl0aW5nQWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICAgICAqIGNsaWNrZWQgb24gZm9yIHRoaXMgcGFnZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAgICAgLy8gK1wiXT09W1wiKyBub2RlLmlkICsgXCJdXCIpXHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXJIdG1sUmV0OiBzdHJpbmcgPSBtYWtlUm93QnV0dG9uQmFySHRtbChub2RlLCBjYW5Nb3ZlVXAsIGNhbk1vdmVEb3duLCBlZGl0aW5nQWxsb3dlZCk7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dOb2RlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aC5zdHJpcElmU3RhcnRzV2l0aChcIi9yb290XCIpO1xyXG4gICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyBwYXRoO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwiamNyOnV1aWRcIiwgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobWVzc2FnZSwgXCJVUkwgb2YgTm9kZVwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUb3BSaWdodEltYWdlVGFnID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWdUYWc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh0b3BSaWdodEltZykge1xyXG4gICAgICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0b3AtcmlnaHQtaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BSaWdodEltZ1RhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZzogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcubm9kZS5ia2cnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgICAgICBia2dJbWdTdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgYmtnSW1nICsgXCIpO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBia2dJbWdTdHlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvdyBcIiArIGNsYXNzZXNcclxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBzZWxCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZVVwQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIG5vZGUudWlkICsgXCInKTtcIiAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYub3Blbk5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgICAgICogaW50ZWxsaWdlbmNlIHRvIHdoZW4gdG8gc2hvdyB0aGVzZSBidXR0b25zIG9yIG5vdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvL3BhZGRpbmcgaXMgYSBiYWNrIGhhY2sgdG8gbWFrZSBjaGVja2JveCBsaW5lIHVwIHdpdGggb3RoZXIgaWNvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL1wiaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0Lmluc2VydE5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy11cHdhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZVVwKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhZGROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gbWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VIb3Jpem9udGFsRmllbGRTZXQgPSBmdW5jdGlvbihjb250ZW50Pzogc3RyaW5nLCBleHRyYUNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCIgKyAoZXh0cmFDbGFzc2VzID8gKFwiIFwiICsgZXh0cmFDbGFzc2VzKSA6IFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcnpDb250cm9sR3JvdXAgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUmFkaW9CdXR0b24gPSBmdW5jdGlvbihsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkXHJcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBub2RlSWQgKHNlZSBtYWtlTm9kZUlkKCkpIE5vZGVJbmZvIG9iamVjdCBoYXMgJ2hhc0NoaWxkcmVuJyB0cnVlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSGFzQ2hpbGRyZW4gPSBmdW5jdGlvbih1aWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIG5vZGVIYXNDaGlsZHJlbjogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZm9ybWF0UGF0aCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgaW5qZWN0IHNwYWNlIGluIGhlcmUgc28gdGhpcyBzdHJpbmcgY2FuIHdyYXAgYW5kIG5vdCBhZmZlY3Qgd2luZG93IHNpemVzIGFkdmVyc2VseSwgb3IgbmVlZCBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZUFsbChcIi9cIiwgXCIgLyBcIik7XHJcbiAgICAgICAgICAgIGxldCBzaG9ydFBhdGg6IHN0cmluZyA9IHBhdGgubGVuZ3RoIDwgNTAgPyBwYXRoIDogcGF0aC5zdWJzdHJpbmcoMCwgNDApICsgXCIuLi5cIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBub1Jvb3RQYXRoOiBzdHJpbmcgPSBzaG9ydFBhdGg7XHJcbiAgICAgICAgICAgIGlmIChub1Jvb3RQYXRoLnN0YXJ0c1dpdGgoXCIvcm9vdFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBzaG9ydFBhdGggOiBub1Jvb3RQYXRoO1xyXG4gICAgICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JhcEh0bWwgPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlbmRlcnMgcGFnZSBhbmQgYWx3YXlzIGFsc28gdGFrZXMgY2FyZSBvZiBzY3JvbGxpbmcgdG8gc2VsZWN0ZWQgbm9kZSBpZiB0aGVyZSBpcyBvbmUgdG8gc2Nyb2xsIHRvXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQYWdlRnJvbURhdGEgPSBmdW5jdGlvbihkYXRhPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibTY0LnJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKFwiTm8gY29udGVudCBpcyBhdmFpbGFibGUgaGVyZS5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudWlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZGVudFRvVWlkTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEknbSBjaG9vc2luZyB0byByZXNldCBzZWxlY3RlZCBub2RlcyB3aGVuIGEgbmV3IHBhZ2UgbG9hZHMsIGJ1dCB0aGlzIGlzIG5vdCBhIHJlcXVpcmVtZW50LiBJIGp1c3RcclxuICAgICAgICAgICAgICAgICAqIGRvbid0IGhhdmUgYSBcImNsZWFyIHNlbGVjdGlvbnNcIiBmZWF0dXJlIHdoaWNoIHdvdWxkIGJlIG5lZWRlZCBzbyB1c2VyIGhhcyBhIHdheSB0byBjbGVhciBvdXQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUoZGF0YS5ub2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzID8gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOT1RFOiBtYWluTm9kZUNvbnRlbnQgaXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYWdlIGNvbnRlbnQsIGFuZCBpcyBhbHdheXMgdGhlIG5vZGUgZGlzcGxheWVkIGF0IHRoZSB0b1xyXG4gICAgICAgICAgICAgKiBvZiB0aGUgcGFnZSBhYm92ZSBhbGwgdGhlIG90aGVyIG5vZGVzIHdoaWNoIGFyZSBpdHMgY2hpbGQgbm9kZXMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbWFpbk5vZGVDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluTm9kZUNvbnRlbnQ6IFwiK21haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWFpbk5vZGVDb250ZW50Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbkJhcjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkQ29tbWVudE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKGRhdGEubm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkTm9kZT1cIitwcm9wcy5pc05vbk93bmVkTm9kZShkYXRhLm5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJ1wiICsgZGF0YS5ub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9pY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJpZFwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJ1bkVkaXROb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcm93SGVhZGVyID0gYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgLy8gJCgnI21haW5Ob2RlQ29udGVudCcpLmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd0NvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkQ291bnQ6IG51bWJlciA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGlsZENvdW50OiBcIiArIGNoaWxkQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb25cclxuICAgICAgICAgICAgICAgICAqIHRoZSBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGRhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0Lm5vZGVzVG9Nb3ZlU2V0W25vZGUuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3c6IHN0cmluZyA9IGdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm93Q291bnQgPT0gMCAmJiAhbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBnZXRFbXB0eVBhZ2VQcm9tcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgb3V0cHV0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV0dHlQcmludCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVE9ETy0zOiBJbnN0ZWFkIG9mIGNhbGxpbmcgc2NyZWVuU2l6ZUNoYW5nZSBoZXJlIGltbWVkaWF0ZWx5LCBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gc2V0IHRoZSBpbWFnZSBzaXplc1xyXG4gICAgICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAgICAgKiBzZXRIdG1sLCBzbyB0aGF0IGltYWdlcyBhbHdheXMgYXJlIEdVQVJBTlRFRUQgdG8gcmVuZGVyIGNvcnJlY3RseSBpbW1lZGlhdGVseS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdlbmVyYXRlUm93ID0gZnVuY3Rpb24oaTogbnVtYmVyLCBub2RlOiBqc29uLk5vZGVJbmZvLCBuZXdEYXRhOiBib29sZWFuLCBjaGlsZENvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiBSRU5ERVIgUk9XW1wiICsgaSArIFwiXTogbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByb3dDb3VudCsrOyAvLyB3YXJuaW5nOiB0aGlzIGlzIHRoZSBsb2NhbCB2YXJpYWJsZS9wYXJhbWV0ZXJcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlck5vZGVBc0xpc3RJdGVtKG5vZGUsIGksIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3dbXCIgKyByb3dDb3VudCArIFwiXT1cIiArIHJvdyk7XHJcbiAgICAgICAgICAgIHJldHVybiByb3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFVybEZvck5vZGVBdHRhY2htZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3N0VGFyZ2V0VXJsICsgXCJiaW4vZmlsZS1uYW1lP25vZGVJZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChub2RlLnBhdGgpICsgXCImdmVyPVwiICsgbm9kZS5iaW5WZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZWUgYWxzbzogbWFrZUltYWdlVGFnKCkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFkanVzdEltYWdlU2l6ZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI1wiICsgbm9kZS5pbWdJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IGVsbS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaGVpZ2h0ID0gZWxtLmF0dHIoXCJoZWlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndpZHRoPVwiICsgd2lkdGggKyBcIiBoZWlnaHQ9XCIgKyBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogTmV3IExvZ2ljIGlzIHRyeSB0byBkaXNwbGF5IGltYWdlIGF0IDE1MCUgbWVhbmluZyBpdCBjYW4gZ28gb3V0c2lkZSB0aGUgY29udGVudCBkaXYgaXQncyBpbixcclxuICAgICAgICAgICAgICAgICAgICAgKiB3aGljaCB3ZSB3YW50LCBidXQgdGhlbiB3ZSBhbHNvIGxpbWl0IGl0IHdpdGggbWF4LXdpZHRoIHNvIG9uIHNtYWxsZXIgc2NyZWVuIGRldmljZXMgb3Igc21hbGxcclxuICAgICAgICAgICAgICAgICAgICAgKiB3aW5kb3cgcmVzaXppbmdzIGV2ZW4gb24gZGVza3RvcCBicm93c2VycyB0aGUgaW1hZ2Ugd2lsbCBhbHdheXMgYmUgZW50aXJlbHkgdmlzaWJsZSBhbmQgbm90XHJcbiAgICAgICAgICAgICAgICAgICAgICogY2xpcHBlZC5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbWF4V2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTUwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogRE8gTk9UIERFTEVURSAoZm9yIGEgbG9uZyB0aW1lIGF0IGxlYXN0KSBUaGlzIGlzIHRoZSBvbGQgbG9naWMgZm9yIHJlc2l6aW5nIGltYWdlcyByZXNwb25zaXZlbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIGl0IHdvcmtzIGZpbmUgYnV0IG15IG5ldyBsb2dpYyBpcyBiZXR0ZXIsIHdpdGggbGltaXRpbmcgbWF4IHdpZHRoIGJhc2VkIG9uIHNjcmVlbiBzaXplLiBCdXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBrZWVwIHRoaXMgb2xkIGNvZGUgZm9yIG5vdy4uXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgaGVpZ2h0ID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBJbWFnZSBkb2VzIGZpdCBvbiBzY3JlZW4gc28gcmVuZGVyIGl0IGF0IGl0J3MgZXhhY3Qgc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIG5vZGUud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZWUgYWxzbzogYWRqdXN0SW1hZ2VTaXplKCkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbGV0IHNyYzogc3RyaW5nID0gZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUuaW1nSWQgPSBcImltZ1VpZF9cIiArIG5vZGUudWlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaWYgaW1hZ2Ugd29uJ3QgZml0IG9uIHNjcmVlbiB3ZSB3YW50IHRvIHNpemUgaXQgZG93biB0byBmaXRcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBZZXMsIGl0IHdvdWxkIGhhdmUgYmVlbiBzaW1wbGVyIHRvIGp1c3QgdXNlIHNvbWV0aGluZyBsaWtlIHdpZHRoPTEwMCUgZm9yIHRoZSBpbWFnZSB3aWR0aCBidXQgdGhlblxyXG4gICAgICAgICAgICAgICAgICogdGhlIGhpZ2h0IHdvdWxkIG5vdCBiZSBzZXQgZXhwbGljaXRseSBhbmQgdGhhdCB3b3VsZCBtZWFuIHRoYXQgYXMgaW1hZ2VzIGFyZSBsb2FkaW5nIGludG8gdGhlIHBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgZWZmZWN0aXZlIHNjcm9sbCBwb3NpdGlvbiBvZiBlYWNoIHJvdyB3aWxsIGJlIGluY3JlYXNpbmcgZWFjaCB0aW1lIHRoZSBVUkwgcmVxdWVzdCBmb3IgYSBuZXdcclxuICAgICAgICAgICAgICAgICAqIGltYWdlIGNvbXBsZXRlcy4gV2hhdCB3ZSB3YW50IGlzIHRvIGhhdmUgaXQgc28gdGhhdCBvbmNlIHdlIHNldCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHNjcm9sbCBhXHJcbiAgICAgICAgICAgICAgICAgKiBwYXJ0aWN1bGFyIHJvdyBpbnRvIHZpZXcsIGl0IHdpbGwgc3RheSB0aGUgY29ycmVjdCBzY3JvbGwgbG9jYXRpb24gRVZFTiBBUyB0aGUgaW1hZ2VzIGFyZSBzdHJlYW1pbmdcclxuICAgICAgICAgICAgICAgICAqIGluIGFzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBzZXQgdGhlIHdpZHRoIHdlIHdhbnQgdG8gZ28gZm9yICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKiBJbWFnZSBkb2VzIGZpdCBvbiBzY3JlZW4gc28gcmVuZGVyIGl0IGF0IGl0J3MgZXhhY3Qgc2l6ZSAqL1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IG5vZGUud2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IG5vZGUuaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZFxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNyZWF0ZXMgSFRNTCB0YWcgd2l0aCBhbGwgYXR0cmlidXRlcy92YWx1ZXMgc3BlY2lmaWVkIGluIGF0dHJpYnV0ZXMgb2JqZWN0LCBhbmQgY2xvc2VzIHRoZSB0YWcgYWxzbyBpZlxyXG4gICAgICAgICAqIGNvbnRlbnQgaXMgbm9uLW51bGxcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRhZyA9IGZ1bmN0aW9uKHRhZzogc3RyaW5nLCBhdHRyaWJ1dGVzPzogT2JqZWN0LCBjb250ZW50Pzogc3RyaW5nLCBjbG9zZVRhZz86IGJvb2xlYW4pOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgLyogZGVmYXVsdCBwYXJhbWV0ZXIgdmFsdWVzICovXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKGNsb3NlVGFnKSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBjbG9zZVRhZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvKiBIVE1MIHRhZyBpdHNlbGYgKi9cclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8XCIgKyB0YWc7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gU3RyaW5nKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB3ZSBpbnRlbGxpZ2VudGx5IHdyYXAgc3RyaW5ncyB0aGF0IGNvbnRhaW4gc2luZ2xlIHF1b3RlcyBpbiBkb3VibGUgcXVvdGVzIGFuZCB2aWNlIHZlcnNhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodi5jb250YWlucyhcIidcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9J1wiICsgdiArIFwiJyBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjbG9zZVRhZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gXCIvPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlVGV4dEFyZWEgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VFZGl0RmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VQYXNzd29yZEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZXRhNjQtaW5wdXRcIlxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbiA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJzOiBPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogZG9tSWQgaXMgaWQgb2YgZGlhbG9nIGJlaW5nIGNsb3NlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCYWNrQnV0dG9uID0gZnVuY3Rpb24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBkb21JZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmNhbmNlbERpYWxvZygnXCIgKyBkb21JZCArIFwiJyk7XCIgKyBjYWxsYmFja1xyXG4gICAgICAgICAgICB9LCB0ZXh0LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYWxsb3dQcm9wZXJ0eVRvRGlzcGxheSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3RbcHJvcE5hbWVdID09IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzUmVhZE9ubHlQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5yZWFkT25seVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzQmluYXJ5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuYmluYXJ5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2FuaXRpemVQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gXCJzaW1wbGVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BOYW1lID09PSBqY3JDbnN0LkNPTlRFTlQgPyBcIkNvbnRlbnRcIiA6IHByb3BOYW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNlYXJjaC5qc1wiKTtcclxuXHJcbi8qXHJcbiAqIHRvZG8tMzogdHJ5IHRvIHJlbmFtZSB0byAnc2VhcmNoJywgYnV0IHJlbWVtYmVyIHlvdSBoYWQgaW5leHBsaWFibGUgcHJvYmxlbXMgdGhlIGZpcnN0IHRpbWUgeW91IHRyaWVkIHRvIHVzZSAnc2VhcmNoJ1xyXG4gKiBhcyB0aGUgdmFyIG5hbWUuXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc3JjaCB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBfVUlEX1JPV0lEX1NVRkZJWDogc3RyaW5nID0gXCJfc3JjaF9yb3dcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2RlczogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaFBhZ2VUaXRsZTogc3RyaW5nID0gXCJTZWFyY2ggUmVzdWx0c1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVQYWdlVGl0bGU6IHN0cmluZyA9IFwiVGltZWxpbmVcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyBzZWFyY2ggaGFzIGJlZW4gZG9uZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaFJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gdGltZWxpbmUgaGFzIGJlZW4gZG9uZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXaWxsIGJlIHRoZSBsYXN0IHJvdyBjbGlja2VkIG9uIChOb2RlSW5mby5qYXZhIG9iamVjdCkgYW5kIGhhdmluZyB0aGUgcmVkIGhpZ2hsaWdodCBiYXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodFJvd05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byB0aGUgTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG51bVNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNyY2guc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggIT0gbnVsbCA/IC8vXHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cy5sZW5ndGggOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hUYWJBY3RpdmF0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgYSBsb2dnZWQgaW4gdXNlciBjbGlja3MgdGhlIHNlYXJjaCB0YWIsIGFuZCBubyBzZWFyY2ggcmVzdWx0cyBhcmUgY3VycmVudGx5IGRpc3BsYXlpbmcsIHRoZW4gZ28gYWhlYWRcclxuICAgICAgICAgICAgICogYW5kIG9wZW4gdXAgdGhlIHNlYXJjaCBkaWFsb2cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobnVtU2VhcmNoUmVzdWx0cygpID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IFNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRzUGFuZWwgPSBuZXcgU2VhcmNoUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gc2VhcmNoUmVzdWx0c1BhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcInNlYXJjaFJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICAgICAgc2VhcmNoUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2Uoc2VhcmNoUmVzdWx0c1BhbmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdGltZWxpbmVSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgdGltZWxpbmVSZXN1bHRzUGFuZWwgPSBuZXcgVGltZWxpbmVSZXN1bHRzUGFuZWwoKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJ0aW1lbGluZVJlc3VsdHNQYW5lbFwiLCBjb250ZW50KTtcclxuICAgICAgICAgICAgdGltZWxpbmVSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZSh0aW1lbGluZVJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaEZpbGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHJlcy5zZWFyY2hSZXN1bHROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5TW9kVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuTEFTVF9NT0RJRklFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0U2VhcmNoTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbm9kZS51aWQgPSB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpO1xyXG4gICAgICAgICAgICB1aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZSA9IGZ1bmN0aW9uKGRhdGEsIHZpZXdOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcclxuICAgICAgICAgICAgdmFyIGNoaWxkQ291bnQgPSBkYXRhLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvbiB0aGVcclxuICAgICAgICAgICAgICogY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciByb3dDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5zZWFyY2hSZXN1bHRzLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0U2VhcmNoTm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh2aWV3TmFtZSwgb3V0cHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVuZGVycyBhIHNpbmdsZSBsaW5lIG9mIHNlYXJjaCByZXN1bHRzIG9uIHRoZSBzZWFyY2ggcmVzdWx0cyBwYWdlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogbm9kZSBpcyBhIE5vZGVJbmZvLmphdmEgSlNPTlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGUsIGluZGV4LCBjb3VudCwgcm93Q291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1aWQgPSBub2RlLnVpZDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJTZWFyY2hSZXN1bHQ6IFwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjc3NJZCA9IHVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBOb2RlIFJvd1tcIiArIGluZGV4ICsgXCJdIHdpdGggaWQ6IFwiICtjc3NJZClcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXJIdG1sID0gbWFrZUJ1dHRvbkJhckh0bWwoXCJcIiArIHVpZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1dHRvbkJhckh0bWw9XCIgKyBidXR0b25CYXJIdG1sKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSByZW5kZXIucmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3cgaW5hY3RpdmUtcm93XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuc3JjaC5jbGlja09uU2VhcmNoUmVzdWx0Um93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsIC8vXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhckh0bWwvL1xyXG4gICAgICAgICAgICAgICAgKyByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX3NyY2hfY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCBjb250ZW50KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b25CYXJIdG1sID0gZnVuY3Rpb24odWlkKSB7XHJcbiAgICAgICAgICAgIHZhciBnb3RvQnV0dG9uID0gcmVuZGVyLm1ha2VCdXR0b24oXCJHbyB0byBOb2RlXCIsIHVpZCwgXCJtNjQuc3JjaC5jbGlja1NlYXJjaE5vZGUoJ1wiICsgdWlkICsgXCInKTtcIik7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChnb3RvQnV0dG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xpY2tPblNlYXJjaFJlc3VsdFJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKSB7XHJcbiAgICAgICAgICAgIHVuaGlnaGxpZ2h0Um93KCk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodFJvd05vZGUgPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xpY2tTZWFyY2hOb2RlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdXBkYXRlIGhpZ2hsaWdodCBub2RlIHRvIHBvaW50IHRvIHRoZSBub2RlIGNsaWNrZWQgb24sIGp1c3QgdG8gcGVyc2lzdCBpdCBmb3IgbGF0ZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNyY2guaGlnaGxpZ2h0Um93Tm9kZSA9IHNyY2gudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghc3JjaC5oaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIHVpZCBpbiBzZWFyY2ggcmVzdWx0czogXCIgKyB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkLCB0cnVlLCBzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBzdHlsaW5nIG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVuaGlnaGxpZ2h0Um93ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICB2YXIgbm9kZUlkID0gaGlnaGxpZ2h0Um93Tm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBjaGFuZ2UgY2xhc3Mgb24gZWxlbWVudCAqL1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNoYXJlLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNoYXJlIHtcclxuXHJcbiAgICAgICAgbGV0IGZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNoYXJpbmdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBIYW5kbGVzICdTaGFyaW5nJyBidXR0b24gb24gYSBzcGVjaWZpYyBub2RlLCBmcm9tIGJ1dHRvbiBiYXIgYWJvdmUgbm9kZSBkaXNwbGF5IGluIGVkaXQgbW9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVTaGFyaW5nID0gZnVuY3Rpb24oKSA6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYXJpbmdOb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZmluZFNoYXJlZE5vZGVzID0gZnVuY3Rpb24oKSA6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgZm9jdXNOb2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c05vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFBhZ2VUaXRsZSA9IFwiU2hhcmVkIE5vZGVzXCI7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRTaGFyZWROb2Rlc1JlcXVlc3QsIGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZT4oXCJnZXRTaGFyZWROb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBmb2N1c05vZGUuaWRcclxuICAgICAgICAgICAgfSwgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB1c2VyLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHVzZXIge1xyXG5cclxuICAgICAgICBsZXQgbG9nb3V0UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9nb3V0UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogZm9yIHRlc3RpbmcgcHVycG9zZXMsIEkgd2FudCB0byBhbGxvdyBjZXJ0YWluIHVzZXJzIGFkZGl0aW9uYWwgcHJpdmlsZWdlcy4gQSBiaXQgb2YgYSBoYWNrIGJlY2F1c2UgaXQgd2lsbCBnb1xyXG4gICAgICAgICAqIGludG8gcHJvZHVjdGlvbiwgYnV0IG9uIG15IG93biBwcm9kdWN0aW9uIHRoZXNlIGFyZSBteSBcInRlc3RVc2VyQWNjb3VudHNcIiwgc28gbm8gcmVhbCB1c2VyIHdpbGwgYmUgYWJsZSB0b1xyXG4gICAgICAgICAqIHVzZSB0aGVzZSBuYW1lc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNUZXN0VXNlckFjY291bnQgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImFkYW1cIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYm9iXCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNvcnlcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGFuXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IEJSQU5ESU5HX1RJVExFX1NIT1JUO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0wOiBJZiB1c2VycyBnbyB3aXRoIHZlcnkgbG9uZyB1c2VybmFtZXMgdGhpcyBpcyBnb25uYSBiZSB1Z2x5ICovXHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlICs9IFwiOlwiICsgcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiI2hlYWRlckFwcE5hbWVcIikuaHRtbCh0aXRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUT0RPLTM6IG1vdmUgdGhpcyBpbnRvIG1ldGE2NCBtb2R1bGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChyZXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZUlkID0gcmVzLnJvb3ROb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlUGF0aCA9IHJlcy5yb290Tm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZSA9IHJlcy51c2VyTmFtZTtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQWRtaW5Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFkbWluXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pc0Fub25Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFub255bW91c1wiO1xyXG4gICAgICAgICAgICBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGUgPSByZXMuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2ggPSByZXMuYWxsb3dGaWxlU3lzdGVtU2VhcmNoO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcyA9IHJlcy51c2VyUHJlZmVyZW5jZXM7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHJlcy51c2VyUHJlZmVyZW5jZXMuYWR2YW5jZWRNb2RlID8gbWV0YTY0Lk1PREVfQURWQU5DRUQgOiBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSByZXMudXNlclByZWZlcmVuY2VzLnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZnJvbSBzZXJ2ZXI6IG1ldGE2NC5lZGl0TW9kZU9wdGlvbj1cIiArIG1ldGE2NC5lZGl0TW9kZU9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5TaWdudXBQZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IFNpZ251cERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBXcml0ZSBhIGNvb2tpZSB0aGF0IGV4cGlyZXMgaW4gYSB5ZWFyIGZvciBhbGwgcGF0aHMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHdyaXRlQ29va2llID0gZnVuY3Rpb24obmFtZSwgdmFsKTogdm9pZCB7XHJcbiAgICAgICAgICAgICQuY29va2llKG5hbWUsIHZhbCwge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogMzY1LFxyXG4gICAgICAgICAgICAgICAgcGF0aDogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyB1Z2x5LiBJdCBpcyB0aGUgYnV0dG9uIHRoYXQgY2FuIGJlIGxvZ2luICpvciogbG9nb3V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlbkxvZ2luUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGxvZ2luRGxnOiBMb2dpbkRsZyA9IG5ldyBMb2dpbkRsZygpO1xyXG4gICAgICAgICAgICBsb2dpbkRsZy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XHJcbiAgICAgICAgICAgIGxvZ2luRGxnLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaExvZ2luID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbi5cIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FsbFVzcjogc3RyaW5nO1xyXG4gICAgICAgICAgICBsZXQgY2FsbFB3ZDogc3RyaW5nO1xyXG4gICAgICAgICAgICBsZXQgdXNpbmdDb29raWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9naW5TZXNzaW9uUmVhZHkgPSAkKFwiI2xvZ2luU2Vzc2lvblJlYWR5XCIpLnRleHQoKTtcclxuICAgICAgICAgICAgaWYgKGxvZ2luU2Vzc2lvblJlYWR5ID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSB0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIHVzaW5nIGJsYW5rIGNyZWRlbnRpYWxzIHdpbGwgY2F1c2Ugc2VydmVyIHRvIGxvb2sgZm9yIGEgdmFsaWQgc2Vzc2lvblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjYWxsVXNyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGNhbGxQd2QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdXNpbmdDb29raWVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gZmFsc2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxvZ2luU3RhdGU6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIGtub3duIHN0YXRlIGFzIGxvZ2dlZCBvdXQsIHRoZW4gZG8gbm90aGluZyBoZXJlICovXHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5TdGF0ZSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1c3I6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHdkOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG5cclxuICAgICAgICAgICAgICAgIHVzaW5nQ29va2llcyA9ICF1dGlsLmVtcHR5U3RyaW5nKHVzcikgJiYgIXV0aWwuZW1wdHlTdHJpbmcocHdkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29va2llVXNlcj1cIiArIHVzciArIFwiIHVzaW5nQ29va2llcyA9IFwiICsgdXNpbmdDb29raWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogZW1weXQgY3JlZGVudGlhbHMgY2F1c2VzIHNlcnZlciB0byB0cnkgdG8gbG9nIGluIHdpdGggYW55IGFjdGl2ZSBzZXNzaW9uIGNyZWRlbnRpYWxzLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjYWxsVXNyID0gdXNyID8gdXNyIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGNhbGxQd2QgPSBwd2QgPyBwd2QgOiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbiB3aXRoIG5hbWU6IFwiICsgY2FsbFVzcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNhbGxVc3IpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IGNhbGxVc3IsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBjYWxsUHdkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUmVzcG9uc2UocmVzLCBjYWxsVXNyLCBjYWxsUHdkLCB1c2luZ0Nvb2tpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nb3V0ID0gZnVuY3Rpb24odXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dvdXRSZXF1ZXN0LCBqc29uLkxvZ291dFJlc3BvbnNlPihcImxvZ291dFwiLCB7fSwgbG9nb3V0UmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRGxnLCB1c3IsIHB3ZCkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzcixcclxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcHdkLFxyXG4gICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luUmVzcG9uc2UocmVzLCB1c3IsIHB3ZCwgbnVsbCwgbG9naW5EbGcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQWxsVXNlckNvb2tpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzPzoganNvbi5Mb2dpblJlc3BvbnNlLCB1c3I/OiBzdHJpbmcsIHB3ZD86IHN0cmluZywgdXNpbmdDb29raWVzPzogYm9vbGVhbiwgbG9naW5EbGc/OiBMb2dpbkRsZykge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJMb2dpblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luUmVzcG9uc2U6IHVzcj1cIiArIHVzciArIFwiIGhvbWVOb2RlT3ZlcnJpZGU6IFwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh1c3IgIT0gXCJhbm9ueW1vdXNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUiwgdXNyKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QsIHB3ZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5EbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbkRsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGU6IFwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGUgaXMgbnVsbC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogc2V0IElEIHRvIGJlIHRoZSBwYWdlIHdlIHdhbnQgdG8gc2hvdyB1c2VyIHJpZ2h0IGFmdGVyIGxvZ2luICovXHJcbiAgICAgICAgICAgICAgICBsZXQgaWQ6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLmVtcHR5U3RyaW5nKHJlcy5ob21lTm9kZU92ZXJyaWRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZU92ZXJyaWRlPVwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLmhvbWVOb2RlT3ZlcnJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUgPSBpZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGxhc3ROb2RlPVwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVJZD1cIiArIG1ldGE2NC5ob21lTm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShpZCwgZmFsc2UsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJDb29raWUgbG9naW4gZmFpbGVkLlwiKSkub3BlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGJsb3cgYXdheSBmYWlsZWQgY29va2llIGNyZWRlbnRpYWxzIGFuZCByZWxvYWQgcGFnZSwgc2hvdWxkIHJlc3VsdCBpbiBicmFuZCBuZXcgcGFnZSBsb2FkIGFzIGFub25cclxuICAgICAgICAgICAgICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXMgaXMgSlNPTiByZXNwb25zZSBvYmplY3QgZnJvbSBzZXJ2ZXIuXHJcbiAgICAgICAgbGV0IHJlZnJlc2hMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW5SZXNwb25zZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdXNlci5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgIHVzZXIuc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB2aWV3LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHZpZXcge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcm9sbFRvU2VsTm9kZVBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVTdGF0dXNCYXIgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzTGluZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcImNvdW50OiBcIiArIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcIiBTZWxlY3Rpb25zOiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbmV3SWQgaXMgb3B0aW9uYWwgcGFyYW1ldGVyIHdoaWNoLCBpZiBzdXBwbGllZCwgc2hvdWxkIGJlIHRoZSBpZCB3ZSBzY3JvbGwgdG8gd2hlbiBmaW5hbGx5IGRvbmUgd2l0aCB0aGVcclxuICAgICAgICAgKiByZW5kZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIHRhcmdldElkPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRJZCkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQodGFyZ2V0SWQsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIGFuZCBpZiBzcGVjaWZpZWQgbWFrZXMgdGhlIHBhZ2Ugc2Nyb2xsIHRvIGFuZCBoaWdobGlnaHQgdGhhdCBub2RlIHVwb24gcmUtcmVuZGVyaW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWUgPSBmdW5jdGlvbihub2RlSWQ/OiBhbnksIHJlbmRlclBhcmVudElmTGVhZj86IGFueSwgaGlnaGxpZ2h0SWQ/OiBhbnksIGlzSW5pdGlhbFJlbmRlcj86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlSWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJZCA9IG1ldGE2NC5jdXJyZW50Tm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlZnJlc2hpbmcgdHJlZTogbm9kZUlkPVwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHRJZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBjdXJyZW50U2VsTm9kZSAhPSBudWxsID8gY3VycmVudFNlbE5vZGUuaWQgOiBub2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogcmVuZGVyUGFyZW50SWZMZWFmID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hUcmVlUmVzcG9uc2UocmVzLCBoaWdobGlnaHRJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlbmRlciAmJiBtZXRhNjQudXJsQ21kID09IFwiYWRkTm9kZVwiICYmIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5lZGl0TW9kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobWV0YTY0LmN1cnJlbnROb2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IHRoaXMgc2Nyb2xsaW5nIGlzIHNsaWdodGx5IGltcGVyZmVjdC4gc29tZXRpbWVzIHRoZSBjb2RlIHN3aXRjaGVzIHRvIGEgdGFiLCB3aGljaCB0cmlnZ2Vyc1xyXG4gICAgICAgICAqIHNjcm9sbFRvVG9wLCBhbmQgdGhlbiBzb21lIG90aGVyIGNvZGUgc2Nyb2xscyB0byBhIHNwZWNpZmljIGxvY2F0aW9uIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIuIHRoZVxyXG4gICAgICAgICAqICdwZW5kaW5nJyBib29sZWFuIGhlcmUgaXMgYSBjcnV0Y2ggZm9yIG5vdyB0byBoZWxwIHZpc3VhbCBhcHBlYWwgKGkuZS4gc3RvcCBpZiBmcm9tIHNjcm9sbGluZyB0byBvbmUgcGxhY2VcclxuICAgICAgICAgKiBhbmQgdGhlbiBzY3JvbGxpbmcgdG8gYSBkaWZmZXJlbnQgcGxhY2UgYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlcilcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNjcm9sbFRvU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxtOiBhbnkgPSBuYXYuZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBmaW5kIGEgc2VsZWN0ZWQgbm9kZSBvbiB0aGlzIHBhZ2UsIHNjcm9sbCB0b1xyXG4gICAgICAgICAgICAgICAgLy8gdG9wIGluc3RlYWQuXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy90b2RvLTA6IHJlbW92ZWQgbWFpblBhcGVyVGFicyBmcm9tIHZpc2liaWxpdHksIGJ1dCB3aGF0IGNvZGUgc2hvdWxkIGdvIGhlcmUgbm93P1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZG8tMzogVGhlIGZvbGxvd2luZyB3YXMgaW4gYSBwb2x5bWVyIGV4YW1wbGUgKGNhbiBJIHVzZSB0aGlzPyk6IGFwcC4kLmhlYWRlclBhbmVsTWFpbi5zY3JvbGxUb1RvcCh0cnVlKTtcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNjcm9sbFRvVG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBub3QgdXNpbmcgbWFpblBhcGVyVGFicyBhbnkgbG9uZ2VyIHNvIHNodyBzaG91bGQgZ28gaGVyZSBub3cgP1xyXG4gICAgICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGVsbTogYW55ID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQgPSBmdW5jdGlvbihkb21JZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZWRpdC5lZGl0Tm9kZTtcclxuICAgICAgICAgICAgbGV0IGU6IGFueSA9ICQoXCIjXCIgKyBkb21JZCk7XHJcbiAgICAgICAgICAgIGlmICghZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgZS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aERpc3BsYXkgPSBcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiBEbyB3ZSByZWFsbHkgbmVlZCBJRCBpbiBhZGRpdGlvbiB0byBQYXRoIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAvLyBwYXRoRGlzcGxheSArPSBcIjxicj5JRDogXCIgKyBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEaXNwbGF5ICs9IFwiPGJyPk1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGUuaHRtbChwYXRoRGlzcGxheSk7XHJcbiAgICAgICAgICAgICAgICBlLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93U2VydmVySW5mbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRTZXJ2ZXJJbmZvUmVxdWVzdCwganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2U+KFwiZ2V0U2VydmVySW5mb1wiLCB7fSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKHJlcy5zZXJ2ZXJJbmZvKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWVudVBhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG1lbnVQYW5lbCB7XHJcblxyXG4gICAgICAgIGxldCBtYWtlVG9wTGV2ZWxNZW51ID0gZnVuY3Rpb24odGl0bGU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwYXBlckl0ZW1BdHRycyA9IHtcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcIm1lbnUtdHJpZ2dlclwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFwZXJJdGVtID0gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwgcGFwZXJJdGVtQXR0cnMsIHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXBlclN1Ym1lbnVBdHRycyA9IHtcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogdGl0bGUsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAoPGFueT5wYXBlclN1Ym1lbnVBdHRycykuaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1zdWJtZW51XCIsIHBhcGVyU3VibWVudUF0dHJzXHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1ldGE2NC1tZW51LWhlYWRpbmdcIixcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0XCJcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLCBwYXBlckl0ZW0gKyAvL1wiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VTZWNvbmRMZXZlbExpc3QgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICAgICAgICAgIC8vLFxyXG4gICAgICAgICAgICAgICAgLy9cIm11bHRpXCI6IFwibXVsdGlcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtZW51SXRlbSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGljayxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRvbUlkOiBzdHJpbmcgPSBcIm1haW5BcHBNZW51XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEkgZW5kZWQgdXAgbm90IHJlYWxseSBsaWtpbmcgdGhpcyB3YXkgb2Ygc2VsZWN0aW5nIHRhYnMuIEkgY2FuIGp1c3QgdXNlIG5vcm1hbCBwb2x5bWVyIHRhYnMuXHJcbiAgICAgICAgICAgIC8vIHZhciBwYWdlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ21haW5UYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwic2VhcmNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZVBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYigndGltZWxpbmVUYWJOYW1lJyk7XCIpO1xyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZlZWRzXCIsIFwibWFpbk1lbnVSc3NcIiwgXCJtNjQubmF2Lm9wZW5Sc3NGZWVkc05vZGUoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1ha2VUb3BMZXZlbE1lbnUoXCJSU1NcIiwgcnNzSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVcIiwgXCJjcmVhdGVOb2RlQnV0dG9uXCIsIFwibTY0LmVkaXQuY3JlYXRlTm9kZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCBcIihuZXcgbTY0LlJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkN1dFwiLCBcImN1dFNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuY3V0U2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJQYXN0ZVwiLCBcInBhc3RlU2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5wYXN0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2xlYXIgU2VsZWN0aW9uc1wiLCBcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCBcIm02NC5lZGl0LmNsZWFyU2VsZWN0aW9ucygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IG02NC5JbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IG02NC5FeHBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZVwiLCBcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuZGVsZXRlU2VsTm9kZXMoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBlZGl0TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJFZGl0XCIsIGVkaXRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1vdmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcFwiLCBcIm1vdmVOb2RlVXBCdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVVwKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRG93blwiLCBcIm1vdmVOb2RlRG93bkJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlRG93bigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcInRvIFRvcFwiLCBcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVRvVG9wKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gQm90dG9tXCIsIFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVG9Cb3R0b20oKTtcIik7Ly9cclxuICAgICAgICAgICAgdmFyIG1vdmVNZW51ID0gbWFrZVRvcExldmVsTWVudShcIk1vdmVcIiwgbW92ZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXR0YWNobWVudE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIEZpbGVcIiwgXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCBcIm02NC5hdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tRmlsZURsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbVVybERsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZSBBdHRhY2htZW50XCIsIFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5kZWxldGVBdHRhY2htZW50KCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgYXR0YWNobWVudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQXR0YWNoXCIsIGF0dGFjaG1lbnRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNoYXJpbmdNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJFZGl0IE5vZGUgU2hhcmluZ1wiLCBcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCBcIm02NC5zaGFyZS5lZGl0Tm9kZVNoYXJpbmcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGaW5kIFNoYXJlZCBTdWJub2Rlc1wiLCBcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCBcIm02NC5zaGFyZS5maW5kU2hhcmVkTm9kZXMoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBzaGFyaW5nTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTaGFyZVwiLCBzaGFyaW5nTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDb250ZW50XCIsIFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBtYWtlIGEgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIHRoYXQgZG9lcyBhIHRhZyBzZWFyY2hcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVGFnc1wiLCBcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaFRhZ3NEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZpbGVzXCIsIFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaEZpbGVzRGxnKHRydWUpKS5vcGVuKCk7XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2VhcmNoXCIsIHNlYXJjaE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVkXCIsIFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1vZGlmaWVkXCIsIFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlNb2RUaW1lKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVGltZWxpbmVcIiwgdGltZWxpbmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVG9nZ2xlIFByb3BlcnRpZXNcIiwgXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBcIm02NC5wcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQucmVmcmVzaCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwibTY0LnJlbmRlci5zaG93Tm9kZVVybCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlByZWZlcmVuY2VzXCIsIFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsIFwiKG5ldyBtNjQuUHJlZnNEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYnVnOiBzZXJ2ZXIgaW5mbyBtZW51IGl0ZW0gaXMgc2hvd2luZyB1cCAoYWx0aG91Z2ggY29ycmVjdGx5IGRpc2FibGVkKSBmb3Igbm9uLWFkbWluIHVzZXJzLlxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTZXJ2ZXIgSW5mb1wiLCBcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIFwibTY0LnZpZXcuc2hvd1NlcnZlckluZm8oKTtcIik7IC8vXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVmlld1wiLCB2aWV3T3B0aW9uc01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgbTY0LkNoYW5nZVBhc3N3b3JkRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYW5hZ2UgQWNjb3VudFwiLCBcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgXCIobmV3IG02NC5NYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJJbnNlcnQgQm9vazogV2FyIGFuZCBQZWFjZVwiLCBcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBcIm02NC5lZGl0Lmluc2VydEJvb2tXYXJBbmRQZWFjZSgpO1wiKTsgLy9cclxuICAgICAgICAgICAgLy8gbWVudUl0ZW0oXCJGdWxsIFJlcG9zaXRvcnkgRXhwb3J0XCIsIFwiZnVsbFJlcG9zaXRvcnlFeHBvcnRcIiwgXCJcclxuICAgICAgICAgICAgLy8gZWRpdC5mdWxsUmVwb3NpdG9yeUV4cG9ydCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkbWluSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJHZW5lcmF0ZSBSU1NcIiwgXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBcIm02NC5wb2RjYXN0LmdlbmVyYXRlUlNTKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgYWRtaW5NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFkbWluXCIsIGFkbWluSXRlbXMsIFwiYWRtaW5NZW51XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1haW4gTWVudSBIZWxwXCIsIFwibWFpbk1lbnVIZWxwXCIsIFwibTY0Lm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAvKiBwYWdlTWVudSsgKi8gbWFpbk1lbnVSc3MgKyBlZGl0TWVudSArIG1vdmVNZW51ICsgYXR0YWNobWVudE1lbnUgKyBzaGFyaW5nTWVudSArIHZpZXdPcHRpb25zTWVudSArIHNlYXJjaE1lbnUgKyB0aW1lbGluZU1lbnUgKyBteUFjY291bnRNZW51XHJcbiAgICAgICAgICAgICAgICArIGFkbWluTWVudSArIG1haW5NZW51SGVscDtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChkb21JZCwgY29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHBvZGNhc3QuanNcIik7XG5cbi8qXG5OT1RFOiBUaGUgQXVkaW9QbGF5ZXJEbGcgQU5EIHRoaXMgc2luZ2xldG9uLWlzaCBjbGFzcyBib3RoIHNoYXJlIHNvbWUgc3RhdGUgYW5kIGNvb3BlcmF0ZVxuXG5SZWZlcmVuY2U6IGh0dHBzOi8vd3d3LnczLm9yZy8yMDEwLzA1L3ZpZGVvL21lZGlhZXZlbnRzLmh0bWxcbiovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIHBvZGNhc3Qge1xuICAgICAgICBleHBvcnQgbGV0IHBsYXllcjogYW55ID0gbnVsbDtcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIgPSBudWxsO1xuXG4gICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcbiAgICAgICAgbGV0IGFkU2VnbWVudHM6IEFkU2VnbWVudFtdID0gbnVsbDtcblxuICAgICAgICBsZXQgcHVzaFRpbWVyOiBhbnkgPSBudWxsO1xuXG4gICAgICAgIGV4cG9ydCBsZXQgZ2VuZXJhdGVSU1MgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdlbmVyYXRlUlNTUmVxdWVzdCwganNvbi5HZW5lcmF0ZVJTU1Jlc3BvbnNlPihcImdlbmVyYXRlUlNTXCIsIHtcbiAgICAgICAgICAgIH0sIGdlbmVyYXRlUlNTUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGdlbmVyYXRlUlNTUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGFsZXJ0KCdyc3MgY29tcGxldGUuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZlZWROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHRpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgZGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZERlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgaW1nVXJsOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIiwgbm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBmZWVkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgICAgIH0sIHRpdGxlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgICAgICAgICAgZmVlZCArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICAgICAgfSwgZGVzYy52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGZlZWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmZWVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGltZ1VybCkge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiaW1nXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1heC13aWR0aDogMjAwcHg7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IGltZ1VybC52YWx1ZVxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IGxpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKGxpbmsgJiYgbGluay52YWx1ZSAmJiBsaW5rLnZhbHVlLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCIubXAzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmsudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cmk6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1VcmlcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAodXJpICYmIHVyaS52YWx1ZSAmJiB1cmkudmFsdWUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcIi5tcDNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJpLnZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZW5jVXJsOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRW5jVXJsXCIsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKGVuY1VybCAmJiBlbmNVcmwudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW5jVHlwZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1R5cGVcIiwgbm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGVuY1R5cGUgJiYgZW5jVHlwZS52YWx1ZSAmJiBlbmNUeXBlLnZhbHVlLnN0YXJ0c1dpdGgoXCJhdWRpby9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY1VybC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc0Rlc2M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1EZXNjXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc0F1dGhvcjoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUF1dGhvclwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NMaW5rOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtTGlua1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NVcmk6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1VcmlcIiwgbm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBlbnRyeTogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHJzc0xpbmsgJiYgcnNzTGluay52YWx1ZSAmJiByc3NUaXRsZSAmJiByc3NUaXRsZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJocmVmXCI6IHJzc0xpbmsudmFsdWVcbiAgICAgICAgICAgICAgICB9LCByZW5kZXIudGFnKFwiaDNcIiwge30sIHJzc1RpdGxlLnZhbHVlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwbGF5ZXJVcmwgPSBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKHBsYXllclVybCkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5vcGVuUGxheWVyRGlhbG9nKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIlBsYXlcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyc3NEZXNjICYmIHJzc0Rlc2MudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICAgICAgfSwgcnNzRGVzYy52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyc3NBdXRob3IgJiYgcnNzQXV0aG9yLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgXCJCeTogXCIgKyByc3NBdXRob3IudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBlbnRyeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRUaXRsZVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWREZXNjXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZExpbmtcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVXJpXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFNyY1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRJbWFnZVVybFwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nSXRlbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1EZXNjXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtVXJpXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbUF1dGhvclwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblBsYXllckRpYWxvZyA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdWlkID0gX3VpZDtcbiAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XG5cbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1wM1VybCA9IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1wM1VybCkge1xuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRQbGF5ZXJJbmZvUmVxdWVzdCwganNvbi5HZXRQbGF5ZXJJbmZvUmVzcG9uc2U+KFwiZ2V0UGxheWVySW5mb1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBtcDNVcmxcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFBsYXllckluZm9SZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBZFNlZ21lbnRVaWQodWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkbGcgPSBuZXcgQXVkaW9QbGF5ZXJEbGcobXAzVXJsLCB1aWQsIHJlcy50aW1lT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRsZy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJzZUFkU2VnbWVudFVpZCA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRTZWdzOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcImFkLXNlZ21lbnRzXCIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChhZFNlZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VBZFNlZ21lbnRUZXh0KGFkU2Vncy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIG5vZGUgdWlkOiBcIiArIHVpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJzZUFkU2VnbWVudFRleHQgPSBmdW5jdGlvbihhZFNlZ3M6IHN0cmluZykge1xuICAgICAgICAgICAgYWRTZWdtZW50cyA9IFtdO1xuXG4gICAgICAgICAgICBsZXQgc2VnTGlzdDogc3RyaW5nW10gPSBhZFNlZ3Muc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICBmb3IgKGxldCBzZWcgb2Ygc2VnTGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBzZWdUaW1lczogc3RyaW5nW10gPSBzZWcuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChzZWdUaW1lcy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSByYW5nZTogXCIgKyBzZWcpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYmVnaW5TZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzBdKTtcbiAgICAgICAgICAgICAgICBsZXQgZW5kU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1sxXSk7XG5cbiAgICAgICAgICAgICAgICBhZFNlZ21lbnRzLnB1c2gobmV3IEFkU2VnbWVudChiZWdpblNlY3MsIGVuZFNlY3MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGNvbnZlcnQgZnJvbSBmb21yYXQgXCJtaW51dGVzOnNlY29udHNcIiB0byBhYnNvbHV0ZSBudW1iZXIgb2Ygc2Vjb25kc1xuICAgICAgICAqXG4gICAgICAgICogdG9kby0wOiBtYWtlIHRoaXMgYWNjZXB0IGp1c3Qgc2Vjb25kcywgb3IgbWluOnNlYywgb3IgaG91cjptaW46c2VjLCBhbmQgYmUgYWJsZSB0b1xuICAgICAgICAqIHBhcnNlIGFueSBvZiB0aGVtIGNvcnJlY3RseS5cbiAgICAgICAgKi9cbiAgICAgICAgbGV0IGNvbnZlcnRUb1NlY29uZHMgPSBmdW5jdGlvbih0aW1lVmFsOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIC8qIGVuZCB0aW1lIGlzIGRlc2lnbmF0ZWQgd2l0aCBhc3RlcmlzayBieSB1c2VyLCBhbmQgcmVwcmVzZW50ZWQgYnkgLTEgaW4gdmFyaWFibGVzICovXG4gICAgICAgICAgICBpZiAodGltZVZhbCA9PSAnKicpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGxldCB0aW1lUGFydHM6IHN0cmluZ1tdID0gdGltZVZhbC5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICBpZiAodGltZVBhcnRzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgdmFsdWU6IFwiICsgdGltZVZhbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBuZXcgTnVtYmVyKHRpbWVQYXJ0c1swXSkudmFsdWVPZigpO1xuICAgICAgICAgICAgbGV0IHNlY29uZHMgPSBuZXcgTnVtYmVyKHRpbWVQYXJ0c1sxXSkudmFsdWVPZigpO1xuICAgICAgICAgICAgcmV0dXJuIG1pbnV0ZXMgKiA2MCArIHNlY29uZHM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlc3RvcmVTdGFydFRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8qIG1ha2VzIHBsYXllciBhbHdheXMgc3RhcnQgd2hlcmV2ZXIgdGhlIHVzZXIgbGFzdCB3YXMgd2hlbiB0aGV5IGNsaWNrZWQgXCJwYXVzZVwiICovXG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHN0YXJ0VGltZVBlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzdGFydFRpbWVQZW5kaW5nO1xuICAgICAgICAgICAgICAgIHN0YXJ0VGltZVBlbmRpbmcgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvbkNhblBsYXkgPSBmdW5jdGlvbih1aWQ6IHN0cmluZywgZWxtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgIHBsYXllciA9IGVsbTtcbiAgICAgICAgICAgIHJlc3RvcmVTdGFydFRpbWUoKTtcbiAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9uVGltZVVwZGF0ZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKCFwdXNoVGltZXIpIHtcbiAgICAgICAgICAgICAgICAvKiBwaW5nIHNlcnZlciBvbmNlIHBlciBtaW51dGUgKi9cbiAgICAgICAgICAgICAgICBwdXNoVGltZXIgPSBzZXRJbnRlcnZhbChwdXNoVGltZXJGdW5jdGlvbiwgMTAwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkN1cnJlbnRUaW1lPVwiICsgZWxtLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIHBsYXllciA9IGVsbTtcblxuICAgICAgICAgICAgLyogdG9kby0xOiB3ZSBjYWxsIHJlc3RvcmVTdGFydFRpbWUgdXBvbiBsb2FkaW5nIG9mIHRoZSBjb21wb25lbnQgYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBoYXZlIHRoZSBlZmZlY3QgZG9pbmcgYW55dGhpbmcgYXQgYWxsXG4gICAgICAgICAgICBhbmQgY2FuJ3QgZXZlbiB1cGRhdGUgdGhlIHNsaWRlciBkaXNwbGF5ZWQgcG9zaXRpb24sIHVudGlsIHBsYXlpbnMgaXMgU1RBUlRFRC4gTmVlZCB0byBjb21lIGJhY2sgYW5kIGZpeCB0aGlzIGJlY2F1c2UgdXNlcnNcbiAgICAgICAgICAgIGN1cnJlbnRseSBoYXZlIHRoZSBnbGl0Y2ggb2YgYWx3YXlzIGhlYXJpbmcgdGhlIGZpcnN0IGZyYWN0aW9uIG9mIGEgc2Vjb25kIG9mIHZpZGVvLCB3aGljaCBvZiBjb3Vyc2UgYW5vdGhlciB3YXkgdG8gZml4XG4gICAgICAgICAgICB3b3VsZCBiZSBieSBhbHRlcmluZyB0aGUgdm9sdW1uIHRvIHplcm8gdW50aWwgcmVzdG9yZVN0YXJ0VGltZSBoYXMgZ29uZSBpbnRvIGVmZmVjdCAqL1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuXG4gICAgICAgICAgICBpZiAoIWFkU2VnbWVudHMpIHJldHVybjtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBhZFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgLyogZW5kVGltZSBvZiAtMSBtZWFucyB0aGUgcmVzdCBvZiB0aGUgbWVkaWEgc2hvdWxkIGJlIGNvbnNpZGVyZWQgQURzICovXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5jdXJyZW50VGltZSA+PSBzZWcuYmVnaW5UaW1lICYmIC8vXG4gICAgICAgICAgICAgICAgICAgIChwbGF5ZXIuY3VycmVudFRpbWUgPD0gc2VnLmVuZFRpbWUgfHwgc2VnLmVuZFRpbWUgPCAwKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gZW5kIG9mIGF1ZGlvIGlmIHJlc3QgaXMgYW4gYWRkLCB3aXRoIGxvZ2ljIG9mIC0zIHRvIGVuc3VyZSB3ZSBkb24ndFxuICAgICAgICAgICAgICAgICAgICBnbyBpbnRvIGEgbG9vcCBqdW1waW5nIHRvIGVuZCBvdmVyIGFuZCBvdmVyIGFnYWluICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWcuZW5kVGltZSA8IDAgJiYgcGxheWVyLmN1cnJlbnRUaW1lIDwgcGxheWVyLmR1cmF0aW9uIC0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoganVtcCB0byBsYXN0IHRvIHNlY29uZHMgb2YgYXVkaW8sIGknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHBhdXNpbmcsIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBhcmUgaXMgbW9yZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGFib3V0IHRvIHBsYXksIHdlIGRvbid0IHdhbnQgdG8gaGFsdCBpdCBhbGwgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBwbGF5ZXIuZHVyYXRpb24gLSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIG9yIGVsc2Ugd2UgYXJlIGluIGEgY29tZXJjaWFsIHNlZ21lbnQgc28ganVtcCB0byBvbmUgc2Vjb25kIHBhc3QgaXQgKi9cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzZWcuZW5kVGltZSArIDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kby0wOiBmb3IgcHJvZHVjdGlvbiwgYm9vc3QgdGhpcyB1cCB0byBvbmUgbWludXRlICovXG4gICAgICAgIGV4cG9ydCBsZXQgcHVzaFRpbWVyRnVuY3Rpb24gPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGltZXJcIik7XG4gICAgICAgICAgICAvKiB0aGUgcHVycG9zZSBvZiB0aGlzIHRpbWVyIGlzIHRvIGJlIHN1cmUgdGhlIGJyb3dzZXIgc2Vzc2lvbiBkb2Vzbid0IHRpbWVvdXQgd2hpbGUgdXNlciBpcyBwbGF5aW5nXG4gICAgICAgICAgICBidXQgaWYgdGhlIG1lZGlhIGlzIHBhdXNlZCB3ZSBETyBhbGxvdyBpdCB0byB0aW1lb3V0LiBPdGh3ZXJ3aXNlIGlmIHVzZXIgaXMgbGlzdGVuaW5nIHRvIGF1ZGlvLCB3ZVxuICAgICAgICAgICAgY29udGFjdCB0aGUgc2VydmVyIGR1cmluZyB0aGlzIHRpbWVyIHRvIHVwZGF0ZSB0aGUgdGltZSBvbiB0aGUgc2VydmVyIEFORCBrZWVwIHNlc3Npb24gZnJvbSB0aW1pbmcgb3V0XG5cbiAgICAgICAgICAgIHRvZG8tMDogd291bGQgZXZlcnl0aGluZyB3b3JrIGlmICdwbGF5ZXInIFdBUyB0aGUganF1ZXJ5IG9iamVjdCBhbHdheXMuXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiAhcGxheWVyLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIC8qIHRoaXMgc2FmZXR5IGNoZWNrIHRvIGJlIHN1cmUgbm8gaGlkZGVuIGF1ZGlvIGNhbiBzdGlsbCBiZSBwbGF5aW5nIHNob3VsZCBubyBsb25nZXIgYmUgbmVlZGVkXG4gICAgICAgICAgICAgICAgbm93IHRoYXQgSSBoYXZlIHRoZSBjbG9zZSBsaXRlbmVyIGV2ZW4gb24gdGhlIGRpYWxvZywgYnV0IGknbGwgbGVhdmUgdGhpcyBoZXJlIGFueXdheS4gQ2FuJ3QgaHVydC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoISQocGxheWVyKS5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2luZyBwbGF5ZXIsIGJlY2F1c2UgaXQgd2FzIGRldGVjdGVkIGFzIG5vdCB2aXNpYmxlLiBwbGF5ZXIgZGlhbG9nIGdldCBoaWRkZW4/XCIpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkF1dG9zYXZlIHBsYXllciBpbmZvLlwiKTtcbiAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IHBhdXNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZGVzdHJveVBsYXllciA9IGZ1bmN0aW9uKGRsZzogQXVkaW9QbGF5ZXJEbGcpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcGxheSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNwZWVkID0gZnVuY3Rpb24ocmF0ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBsYXliYWNrUmF0ZSA9IHJhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgICAgIGV4cG9ydCBsZXQgc2tpcCA9IGZ1bmN0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNhdmVQbGF5ZXJJbmZvID0gZnVuY3Rpb24odXJsOiBzdHJpbmcsIHRpbWVPZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLlNldFBsYXllckluZm9SZXNwb25zZT4oXCJzZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB1cmwsXG4gICAgICAgICAgICAgICAgXCJ0aW1lT2Zmc2V0XCI6IHRpbWVPZmZzZXQsXG4gICAgICAgICAgICAgICAgXCJub2RlUGF0aFwiOiBub2RlLnBhdGhcbiAgICAgICAgICAgIH0sIHNldFBsYXllckluZm9SZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2V0UGxheWVySW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdzYXZlIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucmVuZGVyRmVlZE5vZGU7XG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucmVuZGVySXRlbU5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nRmVlZE5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nSXRlbU5vZGU7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzeXN0ZW1mb2xkZXIuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc3lzdGVtZm9sZGVyIHtcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHBhdGhQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpwYXRoXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChwYXRoUHJvcCkge1xuICAgICAgICAgICAgICAgIHBhdGggKz0gcmVuZGVyLnRhZyhcImgyXCIsIHtcbiAgICAgICAgICAgICAgICB9LCBwYXRoUHJvcC52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCByZWluZGV4QnV0dG9uOiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zeXN0ZW1mb2xkZXIucmVpbmRleCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJSZWluZGV4XCIpO1xuXG4gICAgICAgICAgICBsZXQgc2VhcmNoQnV0dG9uOiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zeXN0ZW1mb2xkZXIuc2VhcmNoKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIlNlYXJjaFwiKTtcblxuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZWluZGV4QnV0dG9uICsgc2VhcmNoQnV0dG9uKTtcblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgcGF0aCArIGJ1dHRvbkJhcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBhdGggKyBidXR0b25CYXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGaWxlTGlzdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkpTT05fRklMRV9TRUFSQ0hfUkVTVUxULCBub2RlKTtcbiAgICAgICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XG4gICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSByZW5kZXIucmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eShzZWFyY2hSZXN1bHRQcm9wLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZmlsZUxpc3RQcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0Ompzb25cIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlaW5kZXggPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5GaWxlU2VhcmNoUmVxdWVzdCwganNvbi5GaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNlbE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicmVpbmRleFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sIHJlaW5kZXhSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVpbmRleFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJSZWluZGV4IGNvbXBsZXRlLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAobmV3IG02NC5TZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0OnBhdGhcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucHJvcE9yZGVyaW5nO1xuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyRmlsZUxpc3ROb2RlO1xubTY0Lm1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6ZmlsZWxpc3RcIl0gPSBtNjQuc3lzdGVtZm9sZGVyLmZpbGVMaXN0UHJvcE9yZGVyaW5nO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRGlhbG9nQmFzZS5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgLypcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICAgICAqXG4gICAgICogdG9kbzogd2hlbiByZWZhY3RvcmluZyBhbGwgZGlhbG9ncyB0byB0aGlzIG5ldyBiYXNlLWNsYXNzIGRlc2lnbiBJJ20gYWx3YXlzXG4gICAgICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICAgICAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gICAgICogdGhleSBoYXZlIGJlZW4gY29uc3RydWN0ZWQgd2hlcmUgdGhleSBtZXJlbHkgaGF2ZSB0byBiZSByZXNob3duIGFuZFxuICAgICAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAgICAgKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgaG9yaXpDZW50ZXJEbGdDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcblxuICAgICAgICBkYXRhOiBhbnk7XG4gICAgICAgIGJ1aWx0OiBib29sZWFuO1xuICAgICAgICBndWlkOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvbUlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2UgcmVnaXN0ZXIgJ3RoaXMnIHNvIHdlIGNhbiBkbyBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogYXMgc3RyaW5ncy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICAgICAgYW55IGRlZmF1bHRzIG9yIHZhbHVlcyBpbiBmb3IgZmllbGRzLCBldGMuIHNob3VsZCBiZSBzZXQgd2hlbiB0aGUgZGlhbG9nIGlzIGRpc3BsYXllZCAqL1xuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VFdmVudCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGlzLmlkKHRoaXMuZG9tSWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICAgICAqIG9uY2UgaXQncyBjbG9zZWQsIEFORCB0aGF0IHNhbWUgY29kZSBzaG91bGQgZGVsZXRlIHRoZSBndWlkJ3Mgb2JqZWN0IGluXG4gICAgICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFwZXItZGlhbG9nXCIpO1xuXG4gICAgICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgICAgICAvL25vZGUuc2V0QXR0cmlidXRlKFwid2l0aC1iYWNrZHJvcFwiLCBcIndpdGgtYmFja2Ryb3BcIik7XG5cbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMzogcHV0IGluIENTUyBub3dcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcblxuXG4gICAgICAgICAgICBpZiAodGhpcy5ob3JpekNlbnRlckRsZ0NvbnRlbnQpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAvL2hvd3RvOiBleGFtcGxlIG9mIGhvdyB0byBjZW50ZXIgYSBkaXYgaW4gYW5vdGhlciBkaXYuIFRoaXMgZGl2IGlzIHRoZSBvbmUgYmVpbmcgY2VudGVyZWQuXG4gICAgICAgICAgICAgICAgICAgICAgLy9UaGUgdHJpY2sgdG8gZ2V0dGluZyB0aGUgbGF5b3V0IHdvcmtpbmcgd2FzIE5PVCBzZXR0aW5nIHRoaXMgd2lkdGggdG8gMTAwJSBldmVuIHRob3VnaCBzb21laG93XG4gICAgICAgICAgICAgICAgICAgICAgLy90aGUgbGF5b3V0IGRvZXMgcmVzdWx0IGluIGl0IGJlaW5nIDEwMCUgaSB0aGluay5cbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIiA6IFwibWFyZ2luOiAwIGF1dG87IG1heC13aWR0aDogODAwcHg7XCIgLy9cIm1hcmdpbjogMCBhdXRvOyB3aWR0aDogODAwcHg7XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIGxldCBsZWZ0ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgICAgICAvLyB9LCBcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgLy8gbGV0IGNlbnRlciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJzdHlsZVwiOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXG4gICAgICAgICAgICAgICAgLy8gfSwgdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQgcmlnaHQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgICAgIC8vIH0sIFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBsZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBsZXQgdGFibGU6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIixcbiAgICAgICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgXCJkaXNwbGF5XCI6IFwidGFibGVcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgfSwgcm93KTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHV0aWwuc2V0SHRtbChpZCwgdGFibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgICAgIGEgbXVjaCBiZXR0ZXIgZGlhbG9nLiAqL1xuICAgICAgICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5idWlsZCgpO1xuICAgICAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImNsYXNzXCIgOiBcIm1haW4tZGlhbG9nLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoaWQsIGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGxldCBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKGlkKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGkgdHJpZWQgdG8gdHdlYWsgdGhlIHBsYWNlbWVudCBvZiB0aGUgZGlhbG9nIHVzaW5nIGZpdEludG8sIGFuZCBpdCBkaWRuJ3Qgd29ya1xuICAgICAgICAgICAgc28gSSdtIGp1c3QgdXNpbmcgdGhlIHBhcGVyLWRpYWxvZyBDU1Mgc3R5bGluZyB0byBhbHRlciB0aGUgZGlhbG9nIHNpemUgdG8gZnVsbHNjcmVlblxuICAgICAgICAgICAgbGV0IGlyb25QYWdlcyA9IHV0aWwucG9seUVsbShcIm1haW5Jcm9uUGFnZXNcIik7XG5cbiAgICAgICAgICAgIEFmdGVyIHRoZSBUeXBlU2NyaXB0IGNvbnZlcnNpb24gSSBub3RpY2VkIGhhdmluZyBhIG1vZGFsIGZsYWcgd2lsbCBjYXVzZVxuICAgICAgICAgICAgYW4gaW5maW5pdGUgbG9vcCAoY29tcGxldGVseSBoYW5nKSBDaHJvbWUgYnJvd3NlciwgYnV0IHRoaXMgaXNzdWUgaXMgbW9zdCBsaWtlbHlcbiAgICAgICAgICAgIG5vdCByZWxhdGVkIHRvIFR5cGVTY3JpcHQgYXQgYWxsLCBidXQgaSdtIGp1c3QgbWVudGlvbiBUUyBqdXN0IGluIGNhc2UsIGJlY2F1c2VcbiAgICAgICAgICAgIHRoYXQncyB3aGVuIEkgbm90aWNlZCBpdC4gRGlhbG9ncyBhcmUgZmluZSBidXQgbm90IGEgZGlhbG9nIG9uIHRvcCBvZiBhbm90aGVyIGRpYWxvZywgd2hpY2ggaXNcbiAgICAgICAgICAgIHRoZSBjYXNlIHdoZXJlIGl0IGhhbmdzIGlmIG1vZGVsPXRydWVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUubm9DYW5jZWxPbk91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5ob3Jpem9udGFsT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLnZlcnRpY2FsT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmZpdEludG8gPSBpcm9uUGFnZXMubm9kZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY2VudGVyKCk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUub3BlbigpO1xuXG4gICAgICAgICAgICAvL3ZhciBkaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5EaWFsb2cnKTtcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaXJvbi1vdmVybGF5LWNsb3NlZCcsIGZ1bmN0aW9uKGN1c3RvbUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy92YXIgaWQgPSAoPGFueT5jdXN0b21FdmVudC5jdXJyZW50VGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqIERpYWxvZzogXCIgKyBpZCArIFwiIGlzIGNsb3NlZCFcIik7XG4gICAgICAgICAgICAgICAgdGhpei5jbG9zZUV2ZW50KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHNldHRpbmcgdG8gemVybyBtYXJnaW4gaW1tZWRpYXRlbHksIGFuZCB0aGVuIGFsbW9zdCBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWZ0ZSAxLjUgc2Vjb25kc1xuICAgICAgICAgICAgaXMgYSByZWFsbHkgdWdseSBoYWNrLCBidXQgSSBjb3VsZG4ndCBmaW5kIHRoZSByaWdodCBzdHlsZSBjbGFzcyBvciB3YXkgb2YgZG9pbmcgdGhpcyBpbiB0aGUgZ29vZ2xlXG4gICAgICAgICAgICBkb2NzIG9uIHRoZSBkaWFsb2cgY2xhc3MuXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcblxuICAgICAgICAgICAgLyogSSdtIGRvaW5nIHRoaXMgaW4gZGVzcGFyYXRpb24uIG5vdGhpbmcgZWxzZSBzZWVtcyB0byBnZXQgcmlkIG9mIHRoZSBtYXJnaW4gKi9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvOiBuZWVkIHRvIGNsZWFudXAgdGhlIHJlZ2lzdGVyZWQgSURzIHRoYXQgYXJlIGluIG1hcHMgZm9yIHRoaXMgZGlhbG9nICovXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHRoaXMuZG9tSWQpKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAgICAgKiBzdWZmaXggYXBwZW5kZWQpXG4gICAgICAgICAqL1xuICAgICAgICBpZCA9IChpZCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIl9kbGdJZFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZCArIFwiX2RsZ0lkXCIgKyB0aGlzLmRhdGEuZ3VpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VQYXNzd29yZEZpZWxkID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VFZGl0RmllbGQgPSAoZmllbGROYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU1lc3NhZ2VBcmVhID0gKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaWFsb2ctbWVzc2FnZVwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgICAgIG1ha2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG5cbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSBpcyByZXF1aXJlZCAobG9naWMgZmFpbHMgd2l0aG91dClcbiAgICAgICAgICAgICAgICBcImRpYWxvZy1jb25maXJtXCI6IFwiZGlhbG9nLWNvbmZpcm1cIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgb25DbGljayA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9uQ2xpY2sgKz0gXCI7XCIgKyBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBvbkNsaWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbGx5VmlzaWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wic3R5bGVcIl0gPSBcImRpc3BsYXk6bm9uZTtcIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmRFbnRlcktleSA9IChpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRIdG1sID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VSYWRpb0J1dHRvbiA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VDaGVja0JveCA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nLCBpbml0aWFsU3RhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcblxuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIC8vXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICA8cGFwZXItY2hlY2tib3ggb24tY2hhbmdlPVwiY2hlY2tib3hDaGFuZ2VkXCI+Y2xpY2s8L3BhcGVyLWNoZWNrYm94PlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNoZWNrYm94Q2hhbmdlZCA6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIC8vICAgICBpZihldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGVja2JveDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGNoZWNrYm94ICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUhlYWRlciA9ICh0ZXh0OiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjZW50ZXJlZD86IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogLypcImRpYWxvZy1oZWFkZXIgXCIgKyovIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIikrXCIgZGlhbG9nLWhlYWRlclwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIG1ha2luZyB0aGlzIEgyIHRhZyBjYXVzZXMgZ29vZ2xlIHRvIGRyYWcgaW4gYSBidW5jaCBvZiBpdHMgb3duIHN0eWxlcyBhbmQgYXJlIGhhcmQgdG8gb3ZlcnJpZGUgKi9cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIGF0dHJzLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvY3VzID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcbiAgICAgICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDb25maXJtRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ29uZmlybURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGl0bGU6IHN0cmluZywgcHJpdmF0ZSBtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGUgYnV0dG9uVGV4dDogc3RyaW5nLCBwcml2YXRlIHllc0NhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgIHByaXZhdGUgbm9DYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNvbmZpcm1EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQ6IHN0cmluZyA9IHRoaXMubWFrZUhlYWRlcihcIlwiLCBcIkNvbmZpcm1EbGdUaXRsZVwiKSArIHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiXCIsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk5vXCIsIFwiQ29uZmlybURsZ05vQnV0dG9uXCIsIHRoaXMubm9DYWxsYmFjayk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLmJ1dHRvblRleHQsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByb2dyZXNzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gcmVuZGVyLnRhZyhcInBhcGVyLXByb2dyZXNzXCIsIHtcbiAgICAgICAgICAgICAgICBcImluZGV0ZXJtaW5hdGVcIjogXCJpbmRldGVybWluYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgICAgIFwibWluXCI6IFwiMTAwXCIsXG4gICAgICAgICAgICAgICAgXCJtYXhcIjogXCIxMDAwXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmFyQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjI4MHB4OyBtYXJnaW46MjRweDtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiXG4gICAgICAgICAgICB9LCBwcm9ncmVzc0Jhcik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBiYXJDb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBNZXNzYWdlRGxnLmpzXCIpO1xyXG5cclxuLypcclxuICogQ2FsbGJhY2sgY2FuIGJlIG51bGwgaWYgeW91IGRvbid0IG5lZWQgdG8gcnVuIGFueSBmdW5jdGlvbiB3aGVuIHRoZSBkaWFsb2cgaXMgY2xvc2VkXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNZXNzYWdlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZT86IGFueSwgcHJpdmF0ZSB0aXRsZT86IGFueSwgcHJpdmF0ZSBjYWxsYmFjaz86IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMudGl0bGUpICsgXCI8cD5cIiArIHRoaXMubWVzc2FnZSArIFwiPC9wPlwiO1xyXG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IExvZ2luRGxnLmpzXCIpO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkvanF1ZXJ5LmQudHNcIiAvPlxuXG4vKlxuTm90ZTogVGhlIGpxdWVyeSBjb29raWUgbG9va3MgZm9yIGpxdWVyeSBkLnRzIGluIHRoZSByZWxhdGl2ZSBsb2NhdGlvbiBcIlwiLi4vanF1ZXJ5XCIgc28gYmV3YXJlIGlmIHlvdXJcbnRyeSB0byByZW9yZ2FuaXplIHRoZSBmb2xkZXIgc3RydWN0dXJlIEkgaGF2ZSBpbiB0eXBlZGVmcywgdGhpbmdzIHdpbGwgY2VydGFpbmx5IGJyZWFrXG4qL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkxvZ2luRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJMb2dpblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHZhciBsb2dpbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkxvZ2luXCIsIFwibG9naW5CdXR0b25cIiwgdGhpcy5sb2dpbiwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbExvZ2luQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihsb2dpbkJ1dHRvbiArIHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcbiAgICAgICAgICAgIHZhciBkaXZpZGVyID0gXCI8ZGl2PjxoMz5PciBMb2dpbiBXaXRoLi4uPC9oMz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm0gPSBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IGZvcm07XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInVzZXJOYW1lXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJwYXNzd29yZFwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVGcm9tQ29va2llcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XG5cbiAgICAgICAgICAgIGlmICh1c3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwd2QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldFBhc3N3b3JkID0gKCk6IGFueSA9PiB7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFJlc2V0IFBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgICAgICBcIlllcywgcmVzZXQuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaWdudXBEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFO1xuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEVfU0hPUlQ7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJzaWdudXBVc2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkNhcHRjaGFcIiwgXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGEtaW1hZ2VcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCJcIi8vXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgICAgIHZhciBzaWdudXBCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaWdudXBcIiwgXCJzaWdudXBCdXR0b25cIiwgdGhpcy5zaWdudXAsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNpZ251cEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBVc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgICAgIHZhciBjYXB0Y2hhID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIC8qIG5vIHJlYWwgdmFsaWRhdGlvbiB5ZXQsIG90aGVyIHRoYW4gbm9uLWVtcHR5ICovXG4gICAgICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNvcnJ5LCB5b3UgY2Fubm90IGxlYXZlIGFueSBmaWVsZHMgYmxhbmsuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TaWdudXBSZXF1ZXN0LGpzb24uU2lnbnVwUmVzcG9uc2U+KFwic2lnbnVwXCIsIHtcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBcImNhcHRjaGFcIjogY2FwdGNoYVxuICAgICAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXBSZXNwb25zZSA9IChyZXM6IGpzb24uU2lnbnVwUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG5cbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJTaWdudXBcIlxuICAgICAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuaWQoXCJzaWdudXBVc2VyTmFtZVwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcmVmc0RsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUHJlZnNEbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUGVmZXJlbmNlc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9uR3JvdXAgPSByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tZ3JvdXBcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgICAgICB9LCByYWRpb0J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrQm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJTaG93IFJvdyBNZXRhZGF0YVwiLCBcInNob3dNZXRhRGF0YVwiLCBtZXRhNjQuc2hvd01ldGFEYXRhKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSByYWRpb0J1dHRvbkdyb3VwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNhdmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJlZmVyZW5jZXNCdXR0b25cIiwgdGhpcy5zYXZlUHJlZmVyZW5jZXMsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHJhZGlvQmFyICsgY2hlY2tib3hCYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tib3ggPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSBzaG93TWV0YURhdGFDaGVja2JveC5ub2RlLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCxcclxuICAgICAgICAgICAgICAgICAgICBcImVkaXRNb2RlXCI6IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdE5vZGVcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IG1ldGE2NC5zaG93TWV0YURhdGFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXNSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogcHV0IHRoZXNlIHR3byBsaW5lcyBpbiBhIHV0aWxpdHkgbWV0aG9kXHJcbiAgICAgICAgICAgIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1hbmFnZUFjY291bnREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZUFjY291bnRCdXR0b24gPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBcIkFkbWluIENhbm5vdCBDbG9zZSBBY291bnRcIiA6IHRoaXMubWFrZUJ1dHRvbihcIkNsb3NlIEFjY291bnRcIiwgXCJjbG9zZUFjY291bnRCdXR0b25cIiwgXCJwcmVmcy5jbG9zZUFjY291bnQoKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJ1dHRvbkJhciArIGJvdHRvbUJ1dHRvbkJhckRpdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRXhwb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRXhwb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFeHBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkV4cG9ydCB0byBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFeHBvcnQgdG8gRmlsZSBOYW1lXCIsIFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEV4cG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoZXhwb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldEZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyh0YXJnZXRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cG9ydFJlcXVlc3QsIGpzb24uRXhwb3J0UmVzcG9uc2U+KFwiZXhwb3J0VG9YbWxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldEZpbGVOYW1lXCI6IHRhcmdldEZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5leHBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uRXhwb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEltcG9ydERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEltcG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiSW1wb3J0RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJJbXBvcnQgZnJvbSBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJGaWxlIG5hbWUgdG8gaW1wb3J0XCIsIFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEltcG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZUZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkltcG9ydFJlcXVlc3QsanNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaENvbnRlbnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaFRhZ3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hUYWdzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSB0YWdzIHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hGaWxlc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaEZpbGVzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBsdWNlbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoRmlsZXNEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBGaWxlc1wiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaEJ1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hGaWxlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGVJZCA9IHNlbE5vZGUuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXG4gICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0XG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaEZpbGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgcHdkOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFzc0NvZGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgdGhlIHVzZXIgaXMgZG9pbmcgYSBcIlJlc2V0IFBhc3N3b3JkXCIgd2Ugd2lsbCBoYXZlIGEgbm9uLW51bGwgcGFzc0NvZGUgaGVyZSwgYW5kIHdlIHNpbXBseSBzZW5kIHRoaXMgdG8gdGhlIHNlcnZlclxyXG4gICAgICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMucGFzc0NvZGUgPyBcIlBhc3N3b3JkIFJlc2V0XCIgOiBcIkNoYW5nZSBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG5cclxuICAgICAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiTmV3IFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoYW5nZVBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZEFjdGlvbkJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbENoYW5nZVBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjaGFuZ2VQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnB3ZCAmJiB0aGlzLnB3ZC5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0LGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdQYXNzd29yZFwiOiB0aGlzLnB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBwYXNzd29yZFwiLCByZXMpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IFwiUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCI8cD5Zb3UgbWF5IG5vdyBsb2dpbiBhcyA8Yj5cIiArIHJlcy51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgXCI8L2I+IHdpdGggeW91ciBuZXcgcGFzc3dvcmQuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZywgXCJQYXNzd29yZCBDaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIGxvZ2luIGNhbGwgRE9FUyB3b3JrLCBidXQgdGhlIHJlYXNvbiB3ZSBkb24ndCBkbyB0aGlzIGlzIGJlY2F1c2UgdGhlIFVSTCBzdGlsbCBoYXMgdGhlIHBhc3NDb2RlIG9uIGl0IGFuZCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dhbnQgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIGEgdXJsIHdpdGhvdXQgdGhhdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cyhcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVzZXRQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB1c2VyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHlvdXIgdXNlciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIGFuZCBhIGNoYW5nZS1wYXNzd29yZCBsaW5rIHdpbGwgYmUgc2VudCB0byB5b3VcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVzZXQgbXkgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIikudHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlck5hbWUgJiYgZW1haWxBZGRyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZXNldFBhc3N3b3JkUmVxdWVzdCwganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWxBZGRyZXNzXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJPb3BzLiBUcnkgdGhhdCBhZ2Fpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVzZXQgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21GaWxlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvLTA6IFRoaXMgaXMgdWdseSB0byBwcmUtY3JlYXRlIHRoZXNlIGlucHV0IGZpZWxkcy4gTmVlZCB0byBtYWtlIHRoZW0gYWJsZSB0byBhZGQgZHluYW1pY2FsbHkuXG4gICAgICAgICAgICAgKiAoV2lsbCBkbyB0aGlzIG1vZGlmaWNhdGlvbiBvbmNlIEkgZ2V0IHRoZSBkcmFnLW4tZHJvcCBzdHVmZiB3b3JraW5nIGZpcnN0KVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmlsZXNcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiBib29sZWFuIGZpZWxkIHRvIHNwZWNpZnkgaWYgd2UgZXhwbG9kZSB6aXAgZmlsZXMgb250byB0aGUgSkNSIHRyZWUgKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJleHBsb2RlWmlwc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBcImVuY3R5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgICAgIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWwgPSAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIikpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEZ1bmMgPSAoZXhwbG9kZVppcHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIikpLmF0dHIoXCJ2YWx1ZVwiLCBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSBkbyBzb21ldGhpbmcgZGlmZmVyZW50bHkgZnJvbSB0aGUgbm9ybWFsICd1dGlsLmpzb24oKScgY2FsbHMgdG8gdGhlIHNlcnZlciwgYmVjYXVzZVxuICAgICAgICAgICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpLmRyb3B6b25lKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVGaWxlTGlzdCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IHRoaXMuZmlsZUxpc3QuY29uY2F0KGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkpO1xuXG4gICAgICAgICAgICAvKiBEZXRlY3QgaWYgYW55IFpJUCBmaWxlcyBhcmUgY3VycmVudGx5IHNlbGVjdGVkLCBhbmQgYXNrIHVzZXIgdGhlIHF1ZXN0aW9uIGFib3V0IHdoZXRoZXIgdGhleVxuICAgICAgICAgICAgc2hvdWxkIGJlIGV4dHJhY3RlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyB0aGUgdXBsb2FkLCBhbmQgdXBsb2FkZWQgYXMgaW5kaXZpZHVhbCBub2Rlc1xuICAgICAgICAgICAgZm9yIGVhY2ggZmlsZSAqL1xuICAgICAgICAgICAgaWYgKCF0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgJiYgdGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGZpbGUgb2YgdGhpcy5maWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuQnV0dG9uRW5hYmxlbWVudCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICBkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWd1cmVEcm9wWm9uZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbVVybERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uVXBsb2FkRnJvbVVybFJlcXVlc3QsIGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlPihcInVwbG9hZEZyb21VcmxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgICAgIH0sIHRoaXMudXBsb2FkRnJvbVVybFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZyb21VcmxSZXNwb25zZSA9IChyZXM6IGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcblxuLypcbiAqIEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGVzKVxuICpcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICAgICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZU5hbWU/OiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCwgdGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZU5vZGVCdXR0b24gKyBhZGRQcm9wZXJ0eUJ1dHRvbiArIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblxuICAgICAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDYwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyBtYXgtd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDt3aWR0aDoxMDAlOyBvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzIDogXCJ2ZXJ0aWNhbC1sYXlvdXQtcm93XCJcbiAgICAgICAgICAgICAgICAvL1wicGFkZGluZy1sZWZ0OiAwcHg7IHdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsOyBib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcIlxuICAgICAgICAgICAgfSwgXCJMb2FkaW5nLi4uXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdlbmVyYXRlcyBhbGwgdGhlIEhUTUwgZWRpdCBmaWVsZHMgYW5kIHB1dHMgdGhlbSBpbnRvIHRoZSBET00gbW9kZWwgb2YgdGhlIHByb3BlcnR5IGVkaXRvciBkaWFsb2cgYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVFZGl0Tm9kZVBnID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICAvKiBjbGVhciB0aGlzIG1hcCB0byBnZXQgcmlkIG9mIG9sZCBwcm9wZXJ0aWVzICovXG4gICAgICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucHJvcEVudHJpZXMgPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuXG4gICAgICAgICAgICAvKiBlZGl0Tm9kZSB3aWxsIGJlIG51bGwgaWYgdGhpcyBpcyBhIG5ldyBub2RlIGJlaW5nIGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIGV4aXN0aW5nIG5vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLyogaXRlcmF0b3IgZnVuY3Rpb24gd2lsbCBoYXZlIHRoZSB3cm9uZyAndGhpcycgc28gd2Ugc2F2ZSB0aGUgcmlnaHQgb25lICovXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBlZGl0T3JkZXJlZFByb3BzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKGVkaXQuZWRpdE5vZGUsIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHRoaXoubWFrZVByb3BlcnR5RWRpdEJ1dHRvbkJhcihwcm9wLCBmaWVsZElkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlTXVsdGlQcm9wRWRpdG9yKHByb3BFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeSwgYWNlRmllbGRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKCghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkgfHwgZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcInByb3BlcnR5RWRpdExpc3RJdGVtSGlkZGVuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcInN0eWxlXCIgOiBcImRpc3BsYXk6IFwiKyAoIXJkT25seSB8fCBtZXRhNjQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiaW5saW5lXCIgOiBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAgICAgfSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogRWRpdGluZyBhIG5ldyBub2RlICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IHRoaXMgZW50aXJlIGJsb2NrIG5lZWRzIHJldmlldyBub3cgKHJlZGVzaWduKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBuZXcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRJZCA9IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogXCJcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOZXcgTm9kZSBOYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogSSBjYW4gcmVtb3ZlIHRoaXMgZGl2IG5vdyA/XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHt9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgICAgIC8vIHZhciB0b2dnbGVSZWFkb25seVZpc0J1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGZpZWxkcyArPSB0b2dnbGVSZWFkb25seVZpc0J1dHRvbjtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSwgZmllbGRzKTtcblxuICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoYWNlRmllbGRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKGFjZUZpZWxkc1tpXS52YWwudW5lbmNvZGVIdG1sKCkpO1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgICAgICA6IC8vXG4gICAgICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKSkuaHRtbChpbnN0cik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBBbGxvdyBhZGRpbmcgb2YgbmV3IHByb3BlcnRpZXMgYXMgbG9uZyBhcyB0aGlzIGlzIGEgc2F2ZWQgbm9kZSB3ZSBhcmUgZWRpdGluZywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YXJ0XG4gICAgICAgICAgICAgKiBtYW5hZ2luZyBuZXcgcHJvcGVydGllcyBvbiB0aGUgY2xpZW50IHNpZGUuIFdlIG5lZWQgYSBnZW51aW5lIG5vZGUgYWxyZWFkeSBzYXZlZCBvbiB0aGUgc2VydmVyIGJlZm9yZSB3ZSBhbGxvd1xuICAgICAgICAgICAgICogYW55IHByb3BlcnR5IGVkaXRpbmcgdG8gaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlCdXR0b25cIiksICFlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSk7XG5cbiAgICAgICAgICAgIHZhciB0YWdzUHJvcEV4aXN0cyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcInRhZ3NcIiwgZWRpdC5lZGl0Tm9kZSkgIT0gbnVsbDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGFzVGFnc1Byb3A6IFwiICsgdGFnc1Byb3ApO1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiKSwgIXRhZ3NQcm9wRXhpc3RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZVNob3dSZWFkT25seSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vIGFsZXJ0KFwibm90IHlldCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgICAgICAvLyBzZWUgc2F2ZUV4aXN0aW5nTm9kZSBmb3IgaG93IHRvIGl0ZXJhdGUgYWxsIHByb3BlcnRpZXMsIGFsdGhvdWdoIEkgd29uZGVyIHdoeSBJIGRpZG4ndCBqdXN0IHVzZSBhIG1hcC9zZXQgb2ZcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgZWxlbWVudHNcbiAgICAgICAgICAgIC8vIGluc3RlYWQgc28gSSBkb24ndCBuZWVkIHRvIHBhcnNlIGFueSBET00gb3IgZG9tSWRzIGlub3JkZXIgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IG9mIHRoZW0/Pz8/XG4gICAgICAgIH1cblxuICAgICAgICBhZGRQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdCA9IG5ldyBFZGl0UHJvcGVydHlEbGcodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3Qub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChlZGl0LmVkaXROb2RlLCBcInRhZ3NcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcInRhZ3NcIixcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBcIlwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZShyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOb3RlOiBmaWVsZElkIHBhcmFtZXRlciBpcyBhbHJlYWR5IGRpYWxvZy1zcGVjaWZpYyBhbmQgZG9lc24ndCBuZWVkIGlkKCkgd3JhcHBlciBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgbWFrZVByb3BlcnR5RWRpdEJ1dHRvbkJhciA9IChwcm9wOiBhbnksIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIGNsZWFyQnV0dG9uID0gY25zdC5TSE9XX0NMRUFSX0JVVFRPTl9JTl9FRElUT1IgPyByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmNsZWFyUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJDbGVhclwiKSA6IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBhZGRNdWx0aUJ1dHRvbiA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZGVsZXRlQnV0dG9uID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHByb3AubmFtZSAhPT0gamNyQ25zdC5DT05URU5UICYmICFwcm9wLm5hbWUuc3RhcnRzV2l0aChcIm1ldGE2NDpcIikpIHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIEZvciBub3cgd2UganVzdCBnbyB3aXRoIHRoZSBkZXNpZ24gd2hlcmUgdGhlIGFjdHVhbCBjb250ZW50IHByb3BlcnR5IGNhbm5vdCBiZSBkZWxldGVkLiBVc2VyIGNhbiBsZWF2ZVxuICAgICAgICAgICAgICAgICAqIGNvbnRlbnQgYmxhbmsgYnV0IG5vdCBkZWxldGUgaXQuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGVsZXRlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmRlbGV0ZVByb3BlcnR5KCdcIiArIHByb3AubmFtZSArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIkRlbFwiKTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogSSBkb24ndCB0aGluayBpdCByZWFsbHkgbWFrZXMgc2Vuc2UgdG8gYWxsb3cgYSBqY3I6Y29udGVudCBwcm9wZXJ0eSB0byBiZSBtdWx0aXZhbHVlZC4gSSBtYXkgYmUgd3JvbmcgYnV0XG4gICAgICAgICAgICAgICAgICogdGhpcyBpcyBteSBjdXJyZW50IGFzc3VtcHRpb25cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogVGhlcmUncyBhIGJ1ZyBpbiBlZGl0aW5nIG11bHRpcGxlLXZhbHVlZCBwcm9wZXJ0aWVzLCBhbmQgc28gaSdtIGp1c3QgdHVybmluZyBpdCBvZmYgZm9yIG5vd1xuICAgICAgICAgICAgICAgIC8vd2hpbGUgaSBjb21wbGV0ZSB0ZXN0aW5nIG9mIHRoZSByZXN0IG9mIHRoZSBhcHAuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBhZGRNdWx0aUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmFkZFN1YlByb3BlcnR5KCdcIiArIGZpZWxkSWQgKyBcIicpO1wiIC8vXG4gICAgICAgICAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgICAgICAgICAvLyAgICAgXCJBZGQgTXVsdGlcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhbGxCdXR0b25zID0gYWRkTXVsdGlCdXR0b24gKyBjbGVhckJ1dHRvbiArIGRlbGV0ZUJ1dHRvbjtcbiAgICAgICAgICAgIGlmIChhbGxCdXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zLCBcInByb3BlcnR5LWVkaXQtYnV0dG9uLWJhclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFN1YlByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0ucHJvcGVydHk7XG5cbiAgICAgICAgICAgIHZhciBpc011bHRpID0gdXRpbC5pc09iamVjdChwcm9wLnZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8qIGNvbnZlcnQgdG8gbXVsdGktdHlwZSBpZiB3ZSBuZWVkIHRvICovXG4gICAgICAgICAgICBpZiAoIWlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzLnB1c2gocHJvcC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBub3cgYWRkIG5ldyBlbXB0eSBwcm9wZXJ0eSBhbmQgcG9wdWxhdGUgaXQgb250byB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogVE9ETy0zOiBmb3IgcGVyZm9ybWFuY2Ugd2UgY291bGQgZG8gc29tZXRoaW5nIHNpbXBsZXIgdGhhbiAncG9wdWxhdGVFZGl0Tm9kZVBnJyBoZXJlLCBidXQgZm9yIG5vdyB3ZSBqdXN0XG4gICAgICAgICAgICAgKiByZXJlbmRlcmluZyB0aGUgZW50aXJlIGVkaXQgcGFnZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChcIlwiKTtcblxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIERlbGV0ZXMgdGhlIHByb3BlcnR5IG9mIHRoZSBzcGVjaWZpZWQgbmFtZSBvbiB0aGUgbm9kZSBiZWluZyBlZGl0ZWQsIGJ1dCBmaXJzdCBnZXRzIGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5ID0gKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIHRoZSBQcm9wZXJ0eTogXCIgKyBwcm9wTmFtZSwgXCJZZXMsIGRlbGV0ZS5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eUltbWVkaWF0ZShwcm9wTmFtZSk7XG4gICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlUHJvcGVydHlJbW1lZGlhdGUgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZT4oXCJkZWxldGVQcm9wZXJ0eVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByb3BOYW1lXCI6IHByb3BOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlSZXNwb25zZShyZXMsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSwgcHJvcGVydHlUb0RlbGV0ZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBwcm9wZXJ0eVwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIHJlbW92ZSBkZWxldGVkIHByb3BlcnR5IGZyb20gY2xpZW50IHNpZGUgc3RvcmFnZSwgc28gd2UgY2FuIHJlLXJlbmRlciBzY3JlZW4gd2l0aG91dCBtYWtpbmcgYW5vdGhlciBjYWxsIHRvXG4gICAgICAgICAgICAgICAgICogc2VydmVyXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcHJvcHMuZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhKHByb3BlcnR5VG9EZWxldGUpO1xuXG4gICAgICAgICAgICAgICAgLyogbm93IGp1c3QgcmUtcmVuZGVyIHNjcmVlbiBmcm9tIGxvY2FsIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCksIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCldO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogc2NhbiBmb3IgYWxsIG11bHRpLXZhbHVlIHByb3BlcnR5IGZpZWxkcyBhbmQgY2xlYXIgdGhlbSAqL1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKSwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIGZvciBub3cganVzdCBsZXQgc2VydmVyIHNpZGUgY2hva2Ugb24gaW52YWxpZCB0aGluZ3MuIEl0IGhhcyBlbm91Z2ggc2VjdXJpdHkgYW5kIHZhbGlkYXRpb24gdG8gYXQgbGVhc3QgcHJvdGVjdFxuICAgICAgICAgKiBpdHNlbGYgZnJvbSBhbnkga2luZCBvZiBkYW1hZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBzYXZlTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJZiBlZGl0aW5nIGFuIHVuc2F2ZWQgbm9kZSBpdCdzIHRpbWUgdG8gcnVuIHRoZSBpbnNlcnROb2RlLCBvciBjcmVhdGVTdWJOb2RlLCB3aGljaCBhY3R1YWxseSBzYXZlcyBvbnRvIHRoZVxuICAgICAgICAgICAgICogc2VydmVyLCBhbmQgd2lsbCBpbml0aWF0ZSBmdXJ0aGVyIGVkaXRpbmcgbGlrZSBmb3IgcHJvcGVydGllcywgZXRjLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVOZXdOb2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogbmVlZCB0byBtYWtlIHRoaXMgY29tcGF0aWJsZSB3aXRoIEFjZSBFZGl0b3IuXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlTmV3Tm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEVsc2Ugd2UgYXJlIGVkaXRpbmcgYSBzYXZlZCBub2RlLCB3aGljaCBpcyBhbHJlYWR5IHNhdmVkIG9uIHNlcnZlci5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVFeGlzdGluZ05vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVOZXdOb2RlID0gKG5ld05vZGVOYW1lPzogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIW5ld05vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZU5hbWUgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIHdlIGRpZG4ndCBjcmVhdGUgdGhlIG5vZGUgd2UgYXJlIGluc2VydGluZyB1bmRlciwgYW5kIG5laXRoZXIgZGlkIFwiYWRtaW5cIiwgdGhlbiB3ZSBuZWVkIHRvIHNlbmQgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgKiBlbWFpbCB1cG9uIHNhdmluZyB0aGlzIG5ldyBub2RlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJOYW1lICE9IGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAmJiAvL1xuICAgICAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAhPSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGVkaXQubm9kZUluc2VydFRhcmdldCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydE5vZGVSZXF1ZXN0LCBqc29uLkluc2VydE5vZGVSZXNwb25zZT4oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnRJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROYW1lXCI6IGVkaXQubm9kZUluc2VydFRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIlxuICAgICAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ3JlYXRlU3ViTm9kZVJlcXVlc3QsIGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlPihcImNyZWF0ZVN1Yk5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0aGlzLnR5cGVOYW1lID8gdGhpcy50eXBlTmFtZSA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCJcbiAgICAgICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbC5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IHNpbmdsZS10eXBlOiBcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCA/IHByb3BWYWwgOiAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsU3RyLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWtpbmcgc2luZ2xlIHByb3AgZWRpdG9yOiBwcm9wW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIl0gdmFsW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlXG4gICAgICAgICAgICAgICAgKyBcIl0gZmllbGRJZD1cIiArIHByb3BFbnRyeS5pZCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkucmVhZE9ubHkgfHwgcHJvcEVudHJ5LmJpbmFyeSkge1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlZGl0Tm9kZURsZzogYW55KSB7XG4gICAgICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZVByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByb3BlcnR5QnV0dG9uXCIsIHRoaXMuc2F2ZVByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJlZGl0UHJvcGVydHlQZ0Nsb3NlQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgICAgICsgXCInIGNsYXNzPSdwYXRoLWRpc3BsYXktaW4tZWRpdG9yJz48L2Rpdj5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSAnJztcblxuICAgICAgICAgICAgLyogUHJvcGVydHkgTmFtZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BOYW1lSWQgPSBcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wTmFtZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BWYWx1ZUlkID0gXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BWYWx1ZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wVmFsdWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJWYWx1ZVwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCIpKTtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiKSk7XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVEYXRhLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHByb3BlcnR5VmFsdWVEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogV2FybmluZzogZG9uJ3QgY29uZnVzZSB3aXRoIEVkaXROb2RlRGxnICovXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIiA6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ndmVydGljYWwtbGF5b3V0LXJvdycgc3R5bGU9XFxcIndpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsO2JvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1xcXCIgaWQ9J1wiXG4gICAgICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdldHMgcHJpdmlsZWdlcyBmcm9tIHNlcnZlciBhbmQgZGlzcGxheXMgaW4gR1VJIGFsc28uIEFzc3VtZXMgZ3VpIGlzIGFscmVhZHkgYXQgY29ycmVjdCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5vZGUgc2hhcmluZyBpbmZvLlwiKTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSGFuZGxlcyBnZXROb2RlUHJpdmlsZWdlcyByZXNwb25zZS5cbiAgICAgICAgICpcbiAgICAgICAgICogcmVzPWpzb24gb2YgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZS5qYXZhXG4gICAgICAgICAqXG4gICAgICAgICAqIHJlcy5hY2xFbnRyaWVzID0gbGlzdCBvZiBBY2Nlc3NDb250cm9sRW50cnlJbmZvLmphdmEganNvbiBvYmplY3RzXG4gICAgICAgICAqL1xuICAgICAgICBnZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlU2hhcmluZ1BnKHJlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGdvdHRlbiBiYWNrIGZyb20gdGhlIHNlcnZlciBjb250YWluaW5nIEFDTCBpbmZvIHNvIHdlIGNhbiBwb3B1bGF0ZSB0aGUgc2hhcmluZyBwYWdlIGluIHRoZSBndWlcbiAgICAgICAgICovXG4gICAgICAgIHBvcHVsYXRlU2hhcmluZ1BnID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgVGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICQuZWFjaChyZXMuYWNsRW50cmllcywgZnVuY3Rpb24oaW5kZXgsIGFjbEVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1saXN0XCJcbiAgICAgICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcHVibGljQXBwZW5kQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChyZXMucHVibGljQXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgcHVibGljQXBwZW5kQXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIHRvZG86IHVzZSBhY3R1YWwgcG9seW1lciBwYXBlci1jaGVja2JveCBoZXJlICovXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBwdWJsaWNBcHBlbmRBdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfSwgXCJBbGxvdyBwdWJsaWMgY29tbWVudGluZyB1bmRlciB0aGlzIG5vZGUuXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIiksIGh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBVc2luZyBvbkNsaWNrIG9uIHRoZSBlbGVtZW50IEFORCB0aGlzIHRpbWVvdXQgaXMgdGhlIG9ubHkgaGFjayBJIGNvdWxkIGZpbmQgdG8gZ2V0IGdldCB3aGF0IGFtb3VudHMgdG8gYSBzdGF0ZVxuICAgICAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAgICAgKiBzaW1wbHkgYSBidWcgaW4gZ29vZ2xlIGNvZGUgQUZBSUsuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpei5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IChwb2x5RWxtLm5vZGUuY2hlY2tlZCA/IHRydWUgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW1vdmVQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlPihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICAgICAgfSwgdGhpcy5yZW1vdmVQcml2aWxlZ2VSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJBY2xQcml2aWxlZ2VzID0gKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1lbnRyeVwiXG4gICAgICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAobmV3IFNoYXJlVG9QZXJzb25EbGcoKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNoYXJpbmcgbm9kZSB0byBwdWJsaWMuXCIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFkZCBwcml2aWxlZ2UgYW5kIHRoZW4gcmVsb2FkIHNoYXJlIG5vZGVzIGRpYWxvZyBmcm9tIHNjcmF0Y2ggZG9pbmcgYW5vdGhlciBjYWxsYmFjayB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IFwiZXZlcnlvbmVcIixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5yZWxvYWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVuYW1lTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlbmFtZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgY3VyTm9kZU5hbWVEaXNwbGF5ID0gXCI8aDMgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2gzPlwiO1xuICAgICAgICAgICAgdmFyIGN1ck5vZGVQYXRoRGlzcGxheSA9IFwiPGg0IGNsYXNzPSdwYXRoLWRpc3BsYXknIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikgKyBcIic+PC9oND5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1lTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZUJ1dHRvblwiLCB0aGlzLnJlbmFtZU5vZGUsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVuYW1lTm9kZUJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgY3VyTm9kZU5hbWVEaXNwbGF5ICsgY3VyTm9kZVBhdGhEaXNwbGF5ICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlbGVjdCBhIG5vZGUgdG8gcmVuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogaWYgbm8gbm9kZSBiZWxvdyB0aGlzIG5vZGUsIHJldHVybnMgbnVsbCAqL1xuICAgICAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1pbmdSb290Tm9kZSA9IChoaWdobGlnaHROb2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVJZCk7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmFtZU5vZGVSZXF1ZXN0LCBqc29uLlJlbmFtZU5vZGVSZXNwb25zZT4oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5yZW5hbWVOb2RlUmVzcG9uc2UocmVzLCByZW5hbWluZ1Jvb3ROb2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UsIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlbmFtZSBub2RlXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgaGlnaGxpZ2h0Tm9kZS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEF1ZGlvUGxheWVyRGxnLmpzXCIpO1xyXG5cclxuLyogVGhpcyBpcyBhbiBhdWRpbyBwbGF5ZXIgZGlhbG9nIHRoYXQgaGFzIGFkLXNraXBwaW5nIHRlY2hub2xvZ3kgcHJvdmlkZWQgYnkgcG9kY2FzdC50cyAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBdWRpb1BsYXllckRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVVybDogc3RyaW5nLCBwcml2YXRlIG5vZGVVaWQ6IHN0cmluZywgcHJpdmF0ZSBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJBdWRpb1BsYXllckRsZ1wiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydFRpbWVQZW5kaW5nIGluIGNvbnN0cnVjdG9yOiBcIiArIHN0YXJ0VGltZVBlbmRpbmcpO1xyXG4gICAgICAgICAgICBwb2RjYXN0LnN0YXJ0VGltZVBlbmRpbmcgPSBzdGFydFRpbWVQZW5kaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogV2hlbiB0aGUgZGlhbG9nIGNsb3NlcyB3ZSBuZWVkIHRvIHN0b3AgYW5kIHJlbW92ZSB0aGUgcGxheWVyICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbCgpIHtcclxuICAgICAgICAgICAgc3VwZXIuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSAkKFwiI1wiICsgdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpKTtcclxuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBwbGF5ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLyogZm9yIHNvbWUgcmVhc29uIHRoZSBhdWRpbyBwbGF5ZXIgbmVlZHMgdG8gYmUgYWNjZXNzZWQgbGlrZSBpdCdzIGFuIGFycmF5ICovXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJbMF0ucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkF1ZGlvIFBsYXllclwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt0aGlzLm5vZGVVaWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5rbm93biBub2RlIHVpZDogXCIgKyB0aGlzLm5vZGVVaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyB3aGVyZSBJIG5lZWQgYSBzaG9ydCBuYW1lIG9mIHRoZSBtZWRpYSBiZWluZyBwbGF5ZWQgKi9cclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG4gICAgICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL3JlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvcmVmX2F2X2RvbS5hc3BcclxuICAgICAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgICAgICBsZXQgcGxheWVyQXR0cmliczogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgcGFkZGluZzowcHg7IG1hcmdpbi10b3A6IDBweDsgbWFyZ2luLWxlZnQ6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9udGltZXVwZGF0ZVwiOiBcIm02NC5wb2RjYXN0Lm9uVGltZVVwZGF0ZSgnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbmNhbnBsYXlcIjogXCJtNjQucG9kY2FzdC5vbkNhblBsYXkoJ1wiICsgdGhpcy5ub2RlVWlkICsgXCInLCB0aGlzKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY29udHJvbHNcIjogXCJjb250cm9sc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmVsb2FkXCIgOiBcImF1dG9cIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHJlbmRlci50YWcoXCJhdWRpb1wiLCBwbGF5ZXJBdHRyaWJzKTtcclxuXHJcbiAgICAgICAgICAgIC8vU2tpcHBpbmcgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoLTMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiPCAzMHNcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2tpcEZvcndhcmQzMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoMzAsICdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIzMHMgPlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBza2lwQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNraXBCYWNrMzBCdXR0b24gKyBza2lwRm9yd2FyZDMwQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vU3BlZWQgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc3BlZWROb3JtYWxCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgxLjApO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiTm9ybWFsXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMTVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgxLjUpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiMS41WFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGVlZDJ4QnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc3BlZWQoMik7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIyWFwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcGVlZEJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzcGVlZE5vcm1hbEJ1dHRvbiArIHNwZWVkMTVCdXR0b24gKyBzcGVlZDJ4QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vRGlhbG9nIEJ1dHRvbnNcclxuICAgICAgICAgICAgbGV0IHBhdXNlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3QucGF1c2UoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlBhdXNlXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wbGF5KCk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGxheUJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlBsYXlcIik7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogZXZlbiBpZiB0aGlzIGJ1dHRvbiBhcHBlYXJzIHRvIHdvcmssIEkgbmVlZCBpdCB0byBleHBsaWNpdGx5IGVuZm9yY2UgdGhlIHNhdmluZyBvZiB0aGUgdGltZXZhbHVlIEFORCB0aGUgcmVtb3ZlbCBvZiB0aGUgQVVESU8gZWxlbWVudCBmcm9tIHRoZSBET00gKi9cclxuICAgICAgICAgICAgbGV0IGNsb3NlQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZUF1ZGlvUGxheWVyRGxnQnV0dG9uXCIsIHRoaXMuY2xvc2VCdG4pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihwbGF5QnV0dG9uICsgcGF1c2VCdXR0b24gKyBjbG9zZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZGVzY3JpcHRpb24gKyBwbGF5ZXIgKyBza2lwQnV0dG9uQmFyICsgc3BlZWRCdXR0b25CYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIobnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbG9zZUJ0biA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ3JlYXRlTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIENyZWF0ZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBsYXN0U2VsRG9tSWQ6IHN0cmluZztcbiAgICAgICAgbGFzdFNlbFR5cGVOYW1lOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNyZWF0ZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkNyZWF0ZSBOZXcgTm9kZVwiKTtcblxuICAgICAgICAgICAgbGV0IGNyZWF0ZUNoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDcmVhdGUgQ2hpbGRcIiwgXCJjcmVhdGVDaGlsZEJ1dHRvblwiLCB0aGlzLmNyZWF0ZUNoaWxkLCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBJbmxpbmVcIiwgXCJjcmVhdGVJbmxpbmVCdXR0b25cIiwgdGhpcy5jcmVhdGVJbmxpbmUsIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY3JlYXRlQ2hpbGRCdXR0b24gKyBjcmVhdGVJbmxpbmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHR5cGVJZHggPSAwO1xuICAgICAgICAgICAgLyogdG9kby0xOiBuZWVkIGEgYmV0dGVyIHdheSB0byBlbnVtZXJhdGUgYW5kIGFkZCB0aGUgdHlwZXMgd2Ugd2FudCB0byBiZSBhYmxlIHRvIHNlYXJjaCAqL1xuICAgICAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlN0YW5kYXJkIFR5cGVcIiwgXCJudDp1bnN0cnVjdHVyZWRcIiwgdHlwZUlkeCsrKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJSU1MgRmVlZFwiLCBcIm1ldGE2NDpyc3NmZWVkXCIsIHR5cGVJZHgrKyk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3lzdGVtIEZvbGRlclwiLCBcIm1ldGE2NDpzeXN0ZW1mb2xkZXJcIiwgdHlwZUlkeCsrKTtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3RCb3hcIlxuICAgICAgICAgICAgfSwgY29udGVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VMaXN0SXRlbSh2YWw6IHN0cmluZywgdHlwZU5hbWU6IHN0cmluZywgdHlwZUlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCBwYXlsb2FkOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICBcInR5cGVJZHhcIjogdHlwZUlkeFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEl0ZW1cIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ0eXBlUm93XCIgKyB0eXBlSWR4KSxcbiAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogbWV0YTY0LmVuY29kZU9uQ2xpY2sodGhpcy5vblJvd0NsaWNrLCB0aGlzLCBwYXlsb2FkKVxuICAgICAgICAgICAgfSwgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUNoaWxkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUlubGluZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVkaXQuaW5zZXJ0Tm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvblJvd0NsaWNrID0gKHBheWxvYWQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IGRpdklkID0gdGhpcy5pZChcInR5cGVSb3dcIiArIHBheWxvYWQudHlwZUlkeCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxUeXBlTmFtZSA9IHBheWxvYWQudHlwZU5hbWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RTZWxEb21JZCkge1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmxhc3RTZWxEb21JZCkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0U2VsRG9tSWQgPSBkaXZJZDtcbiAgICAgICAgICAgICQoXCIjXCIgKyBkaXZJZCkuYWRkQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNlYXJjaFJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaFJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInNlYXJjaFJlc3VsdHNQYW5lbFwiO1xyXG4gICAgICAgIHRhYklkOiBzdHJpbmcgPSBcInNlYXJjaFRhYk5hbWVcIjtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3NlYXJjaFBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdGltZWxpbmVSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZVJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwidGltZWxpbmVUYWJOYW1lXCI7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSd0aW1lbGluZVZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3RpbWVsaW5lUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC50aW1lbGluZVBhZ2VUaXRsZSk7XHJcbiAgICAgICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnRpbWVsaW5lUmVzdWx0cywgXCJ0aW1lbGluZVZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==