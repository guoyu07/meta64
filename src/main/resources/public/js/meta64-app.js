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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvc3lzdGVtZm9sZGVyLnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvZGxnL0NyZWF0ZU5vZGVEbGcudHMiLCIuLi90cy9wYW5lbC9zZWFyY2hSZXN1bHRzUGFuZWwudHMiLCIuLi90cy9wYW5lbC90aW1lbGluZVJlc3VsdHNQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0FBLFlBQVksQ0FBQztBQUtiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUs5QixJQUFJLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0FBQ0wsQ0FB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QWdCOUIsQ0FBQTtBQUNMLENBQUMsRUFsQlMsR0FBRyxLQUFILEdBQUcsUUFrQlo7QUNwQkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBRXZELElBQVUsR0FBRyxDQWtCWjtBQWxCRCxXQUFVLEdBQUcsRUFBQyxDQUFDO0lBQ1g7UUFBQTtZQUVJLFVBQUssR0FBVyxzQkFBc0IsQ0FBQztZQUN2QyxVQUFLLEdBQVcsaUJBQWlCLENBQUM7WUFDbEMsWUFBTyxHQUFZLEtBQUssQ0FBQztZQUV6QixVQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsa0NBQWtDLENBQUM7Z0JBQ2hELElBQUksV0FBVyxHQUFHLCtCQUErQixDQUFDO2dCQUNsRCxNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFFRCxTQUFJLEdBQUc7Z0JBQ0gsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNyRCxRQUFJLENBQUMseUJBQXlCLENBQUMsUUFBSSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUE7UUFDTCxDQUFDO1FBQUQsMkJBQUM7SUFBRCxDQUFDLEFBaEJELElBZ0JDO0lBaEJZLHdCQUFvQix1QkFnQmhDLENBQUE7QUFDTCxDQUFDLEVBbEJTLEdBQUcsS0FBSCxHQUFHLFFBa0JaIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2VuZXJhdGVkIHVzaW5nIHR5cGVzY3JpcHQtZ2VuZXJhdG9yIHZlcnNpb24gMS4xMC1TTkFQU0hPVCBvbiAyMDE2LTA3LTMxIDIwOjIxOjAxLlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpzb24ge1xuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgICAgICAgICBwcmluY2lwYWxOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBQcml2aWxlZ2VJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IGJvb2xlYW47XG4gICAgICAgICAgICBoYXNCaW5hcnk6IGJvb2xlYW47XG4gICAgICAgICAgICBiaW5hcnlJc0ltYWdlOiBib29sZWFuO1xuICAgICAgICAgICAgYmluVmVyOiBudW1iZXI7XG4gICAgICAgICAgICB3aWR0aDogbnVtYmVyO1xuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgICAgICBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICB1aWQ6IHN0cmluZztcbiAgICAgICAgICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xuICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBEYXRlO1xuICAgICAgICAgICAgaW1nSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgICAgICAgICAgcHJpdmlsZWdlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eUluZm8ge1xuICAgICAgICAgICAgdHlwZTogbnVtYmVyO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgICAgICAgICBodG1sVmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIGFiYnJldmlhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgICAgICAgICBlZGl0TW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGFkdmFuY2VkTW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBpbXBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgICAgICAgICAgZXhwb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgICAgICAgICAgaWdub3JlVXJsOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3NDb2RlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIG5vZGVQYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFBsYXllckluZm9SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0RmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgaW5jbHVkZUFjbDogYm9vbGVhbjtcbiAgICAgICAgICAgIGluY2x1ZGVPd25lcnM6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlRmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBib29rTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdHJ1bmNhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0TmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHR6T2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgICBkc3Q6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ291dFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHRhcmdldE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0Q2hpbGRJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkczogc3RyaW5nW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIHNvcnREaXI6IHN0cmluZztcbiAgICAgICAgICAgIHNvcnRGaWVsZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hQcm9wOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICAgICAgcmVpbmRleDogYm9vbGVhblxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW1vdmVQcml2aWxlZ2VSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2U6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBuZXdOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdXBMZXZlbDogbnVtYmVyO1xuICAgICAgICAgICAgcmVuZGVyUGFyZW50SWZMZWFmOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVxdWVzdCB7XG4gICAgICAgICAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzaWJsaW5nSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICBjYXB0Y2hhOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlVXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICAgICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICAgICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGU6IFJlZkluZm87XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG4gICAgICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5U2F2ZWQ6IFByb3BlcnR5SW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgYXBwLmpzXCIpO1xuXG4vLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4vLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbihldmVudCkgeyBpZiAodHlwZW9mIG9ucmVzaXplID09PSAnZnVuY3Rpb24nKSBvbnJlc2l6ZSgpOyAvKiogLi4uICovIH1cblxudmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCB0eXBlb2YgKG9iamVjdCkgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICBvYmplY3QuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgIH1cbn07XG5cbi8qXG4gKiBXQVJOSU5HOiBUaGlzIGlzIGNhbGxlZCBpbiByZWFsdGltZSB3aGlsZSB1c2VyIGlzIHJlc2l6aW5nIHNvIGFsd2F5cyB0aHJvdHRsZSBiYWNrIGFueSBwcm9jZXNzaW5nIHNvIHRoYXQgeW91IGRvbid0XG4gKiBkbyBhbnkgYWN0dWFsIHByb2Nlc3NpbmcgaW4gaGVyZSB1bmxlc3MgeW91IHdhbnQgaXQgVkVSWSBsaXZlLCBiZWNhdXNlIGl0IGlzLlxuICovXG5mdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJXaW5kb3dSZXNpemU6IHc9XCIgKyB3aW5kb3cuaW5uZXJXaWR0aCArIFwiIGg9XCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHdpbmRvd1Jlc2l6ZSk7XG5cbi8vIHRoaXMgY29tbWVudGVkIHNlY3Rpb24gaXMgbm90IHdvcmtpbmcgaW4gbXkgbmV3IHgtYXBwIGNvZGUsIGJ1dCBpdCdzIG9rIHRvIGNvbW1lbnQgaXQgb3V0IGZvciBub3cuXG4vL1xuLy8gVGhpcyBpcyBvdXIgdGVtcGxhdGUgZWxlbWVudCBpbiBpbmRleC5odG1sXG4vLyB2YXIgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3gtYXBwJyk7XG4vLyAvLyBMaXN0ZW4gZm9yIHRlbXBsYXRlIGJvdW5kIGV2ZW50IHRvIGtub3cgd2hlbiBiaW5kaW5nc1xuLy8gLy8gaGF2ZSByZXNvbHZlZCBhbmQgY29udGVudCBoYXMgYmVlbiBzdGFtcGVkIHRvIHRoZSBwYWdlXG4vLyBhcHAuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKCdhcHAgcmVhZHkgZXZlbnQhJyk7XG4vLyB9KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvbHltZXItcmVhZHknLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coJ3BvbHltZXItcmVhZHkgZXZlbnQhJyk7XG59KTtcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGNuc3QuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBjb29raWVQcmVmaXg7XHJcblxyXG4vL3RvZG8tMDogdHlwZXNjcmlwdCB3aWxsIG5vdyBsZXQgdXMganVzdCBkbyB0aGlzOiBjb25zdCB2YXI9J3ZhbHVlJztcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBjbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBBTk9OOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1VTUjogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblVzclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1BXRDogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblB3ZFwiO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbG9naW5TdGF0ZT1cIjBcIiBpZiB1c2VyIGxvZ2dlZCBvdXQgaW50ZW50aW9uYWxseS4gbG9naW5TdGF0ZT1cIjFcIiBpZiBsYXN0IGtub3duIHN0YXRlIG9mIHVzZXIgd2FzICdsb2dnZWQgaW4nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fU1RBVEU6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5TdGF0ZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQlI6IFwiPGRpdiBjbGFzcz0ndmVydC1zcGFjZSc+PC9kaXY+XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTlNFUlRfQVRUQUNITUVOVDogc3RyaW5nID0gXCJ7e2luc2VydC1hdHRhY2htZW50fX1cIjtcclxuICAgICAgICBleHBvcnQgbGV0IE5FV19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IElOU19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbiIsIlxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbiAgICAvKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuICAgIGV4cG9ydCBjbGFzcyBBZFNlZ21lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgICAgIHB1YmxpYyBlbmRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wRW50cnkge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBwcm9wZXJ0eToganNvbi5Qcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdWJQcm9wIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cclxuZGVjbGFyZSB2YXIgUG9seW1lcjtcclxuZGVjbGFyZSB2YXIgJDsgLy88LS0tLS0tLS0tLS0tLXRoaXMgd2FzIGEgd2lsZGFzcyBndWVzcy5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXJyYXkgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vV0FSTklORzogVGhlc2UgcHJvdG90eXBlIGZ1bmN0aW9ucyBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBhbnkgZnVuY3Rpb25zLlxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG4gICAgY2xvbmUoKTogQXJyYXk8VD47XHJcbiAgICBpbmRleE9mSXRlbUJ5UHJvcChwcm9wTmFtZSwgcHJvcFZhbCk6IG51bWJlcjtcclxuICAgIGFycmF5TW92ZUl0ZW0oZnJvbUluZGV4LCB0b0luZGV4KTogdm9pZDtcclxuICAgIGluZGV4T2ZPYmplY3Qob2JqOiBhbnkpOiBudW1iZXI7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmluZGV4T2ZJdGVtQnlQcm9wID0gZnVuY3Rpb24ocHJvcE5hbWUsIHByb3BWYWwpIHtcclxuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXVtwcm9wTmFtZV0gPT09IHByb3BWYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuLyogbmVlZCB0byB0ZXN0IGFsbCBjYWxscyB0byB0aGlzIG1ldGhvZCBiZWNhdXNlIGkgbm90aWNlZCBkdXJpbmcgVHlwZVNjcmlwdCBjb252ZXJzaW9uIGkgd2Fzbid0IGV2ZW4gcmV0dXJuaW5nXHJcbmEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuKi9cclxuQXJyYXkucHJvdG90eXBlLmFycmF5TW92ZUl0ZW0gPSBmdW5jdGlvbihmcm9tSW5kZXgsIHRvSW5kZXgpIHtcclxuICAgIHRoaXMuc3BsaWNlKHRvSW5kZXgsIDAsIHRoaXMuc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGF0ZSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIERhdGUge1xyXG4gICAgc3RkVGltZXpvbmVPZmZzZXQoKTogbnVtYmVyO1xyXG4gICAgZHN0KCk6IGJvb2xlYW47XHJcbn07XHJcblxyXG5EYXRlLnByb3RvdHlwZS5zdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGphbiA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICB2YXIganVsID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCA2LCAxKTtcclxuICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG59XHJcblxyXG5EYXRlLnByb3RvdHlwZS5kc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgPCB0aGlzLnN0ZFRpbWV6b25lT2Zmc2V0KCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RyaW5nIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb250YWlucyhzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICByZXBsYWNlQWxsKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdW5lbmNvZGVIdG1sKCk6IHN0cmluZztcclxuICAgIGVzY2FwZUZvckF0dHJpYigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRzV2l0aChzdHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSAhPSAtMTtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhcIiZcIikpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCcmYW1wOycsICcmJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmd0OycsICc+JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmx0OycsICc8JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJnF1b3Q7JywgJ1wiJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJiMzOTsnLCBcIidcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHV0aWwge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FqYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVvdXRNZXNzYWdlU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IG9mZmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3YWl0Q291bnRlcjogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IHBncnNEbGc6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgICAgIC8vXHRPYmplY3QucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgICAgICAvL1x0fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2YWwodmFyTmFtZSkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgYW4gYWpheCBjYWxsLCBidXQgdGhlIHNlcnZlciBhbHNvIGVuZm9yY2VzIHRoYXQgZWFjaFxyXG4gICAgICAgICAqIHNlc3Npb24gaXMgb25seSBhbGxvd2VkIG9uZSBjb25jdXJyZW50IGNhbGwgYW5kIHNpbXVsdGFuZW91cyBjYWxscyB3b3VsZCBqdXN0IFwicXVldWUgdXBcIi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKG5ldyBEYXRlKCkuZHN0KCkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFRoaXMgY2FtZSBmcm9tIGhlcmU6XHJcblx0XHQgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lPzogYW55LCB1cmw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcblx0XHQgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG5cdFx0ICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKTogYW55IHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRQcm9ncmVzc01vbml0b3IgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwocHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2dyZXNzSW50ZXJ2YWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlzV2FpdGluZyA9IGlzQWpheFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzV2FpdGluZykge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlmICh3YWl0Q291bnRlciA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGpzb24gPSBmdW5jdGlvbiA8UmVxdWVzdFR5cGUsIFJlc3BvbnNlVHlwZT4ocG9zdE5hbWU6IGFueSwgcG9zdERhdGE6IFJlcXVlc3RUeXBlLCAvL1xyXG4gICAgICAgICAgICBjYWxsYmFjaz86IChyZXNwb25zZTogUmVzcG9uc2VUeXBlLCBwYXlsb2FkPzogYW55KSA9PiBhbnksIGNhbGxiYWNrVGhpcz86IGFueSwgY2FsbGJhY2tQYXlsb2FkPzogYW55KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUgKyBcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi1QT1NUW2dlbl06IFtcIiArIHBvc3ROYW1lICsgXCJdXCIgKyBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaXJvbkFqYXggPSB0aGlzLiQkKFwiI215SXJvbkFqYXhcIik7XHJcbiAgICAgICAgICAgICAgICAvL2lyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD4pd2luZG93LmRvY3VtZW50LnJvb3QpLnF1ZXJ5U2VsZWN0b3IoXCIjaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXggPSBwb2x5RWxtTm9kZShcImlyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnVybCA9IHBvc3RUYXJnZXRVcmwgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4Lm1ldGhvZCA9IFwiUE9TVFwiO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgucGFyYW1zPSd7XCJhbHRcIjpcImpzb25cIiwgXCJxXCI6XCJjaHJvbWVcIn0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5vblJlc3BvbnNlID0gXCJ1dGlsLmlyb25BamF4UmVzcG9uc2VcIjsgLy8gb24tcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmRlYm91bmNlRHVyYXRpb24gPSBcIjMwMFwiOyAvLyBkZWJvdW5jZS1kdXJhdGlvbiAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwiRmFpbGVkIHN0YXJ0aW5nIHJlcXVlc3Q6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vdGVzXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcbiAgICAgICAgICAgICAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcbiAgICAgICAgICAgICAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcbiAgICAgICAgICAgICAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcbiAgICAgICAgICAgICAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuICAgICAgICAgICAgICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcbiAgICAgICAgICAgICAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhbid0IHdlIGp1c3QgbGV0IGNhbGxiYWNrUGF5bG9hZCBiZSB1bmRlZmluZWQsIGFuZCBjYWxsIHRoZSBhYm92ZSBjYWxsYmFjayBtZXRob2RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgbm90IGV2ZW4gaGF2ZSB0aGlzIGVsc2UgYmxvY2sgaGVyZSBhdCBhbGwgKGkuZS4gbm90IGV2ZW4gY2hlY2sgaWYgY2FsbGJhY2tQYXlsb2FkIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsL3VuZGVmaW5lZCwgYnV0IGp1c3QgdXNlIGl0LCBhbmQgbm90IGhhdmUgdGhpcyBpZiBibG9jaz8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBoYW5kbGluZyByZXN1bHQgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBGYWlsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIHV0aWwuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcm9uUmVxdWVzdC5zdGF0dXMgPT0gXCI0MDNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluIGRldGVjdGVkIGluIHV0aWwuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0TWVzc2FnZVNob3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dE1lc3NhZ2VTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2Vzc2lvbiB0aW1lZCBvdXQuIFBhZ2Ugd2lsbCByZWZyZXNoLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpcm9uUmVxdWVzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQW5kVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgICAgICB0aHJvdyBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBbmRSZVRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nLCBleGNlcHRpb246IGFueSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlICsgXCJTVEFDSzogXCIgKyBzdGFjayk7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYWpheFJlYWR5ID0gZnVuY3Rpb24ocmVxdWVzdE5hbWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKF9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0FqYXhXYWl0aW5nID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfYWpheENvdW50ZXIgPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3Qgc3RhcnQgd2l0aCAjKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsYXllZEZvY3VzID0gZnVuY3Rpb24oaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogc28gdXNlciBzZWVzIHRoZSBmb2N1cyBmYXN0IHdlIHRyeSBhdCAuNSBzZWNvbmRzICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgdHJ5IGFnYWluIGEgZnVsbCBzZWNvbmQgbGF0ZXIuIE5vcm1hbGx5IG5vdCByZXF1aXJlZCwgYnV0IG5ldmVyIHVuZGVzaXJhYmxlICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGNvdWxkIGhhdmUgcHV0IHRoaXMgbG9naWMgaW5zaWRlIHRoZSBqc29uIG1ldGhvZCBpdHNlbGYsIGJ1dCBJIGNhbiBmb3JzZWUgY2FzZXMgd2hlcmUgd2UgZG9uJ3Qgd2FudCBhXHJcblx0XHQgKiBtZXNzYWdlIHRvIGFwcGVhciB3aGVuIHRoZSBqc29uIHJlc3BvbnNlIHJldHVybnMgc3VjY2Vzcz09ZmFsc2UsIHNvIHdlIHdpbGwgaGF2ZSB0byBjYWxsIGNoZWNrU3VjY2VzcyBpbnNpZGVcclxuXHRcdCAqIGV2ZXJ5IHJlc3BvbnNlIG1ldGhvZCBpbnN0ZWFkLCBpZiB3ZSB3YW50IHRoYXQgcmVzcG9uc2UgdG8gcHJpbnQgYSBtZXNzYWdlIHRvIHRoZSB1c2VyIHdoZW4gZmFpbCBoYXBwZW5zLlxyXG5cdFx0ICpcclxuXHRcdCAqIHJlcXVpcmVzOiByZXMuc3VjY2VzcyByZXMubWVzc2FnZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGVja1N1Y2Nlc3MgPSBmdW5jdGlvbihvcEZyaWVuZGx5TmFtZSwgcmVzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhvcEZyaWVuZGx5TmFtZSArIFwiIGZhaWxlZDogXCIgKyByZXMubWVzc2FnZSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN1Y2Nlc3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZGRzIGFsbCBhcnJheSBvYmplY3RzIHRvIG9iaiBhcyBhIHNldCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWRkQWxsID0gZnVuY3Rpb24ob2JqLCBhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm51bGwgZWxlbWVudCBpbiBhZGRBbGwgYXQgaWR4PVwiICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbnVsbE9yVW5kZWYgPSBmdW5jdGlvbihvYmopOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGhhdmUgdG8gYmUgYWJsZSB0byBtYXAgYW55IGlkZW50aWZpZXIgdG8gYSB1aWQsIHRoYXQgd2lsbCBiZSByZXBlYXRhYmxlLCBzbyB3ZSBoYXZlIHRvIHVzZSBhIGxvY2FsXHJcblx0XHQgKiAnaGFzaHNldC10eXBlJyBpbXBsZW1lbnRhdGlvblxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVaWRGb3JJZCA9IGZ1bmN0aW9uKG1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgaWQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1hcFtpZF07XHJcblxyXG4gICAgICAgICAgICAvKiBpZiBub3QgZm91bmQsIGdldCBuZXh0IG51bWJlciwgYW5kIGFkZCB0byBtYXAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIHVpZCA9IFwiXCIgKyBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbGVtZW50RXhpc3RzID0gZnVuY3Rpb24oaWQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGFrZXMgdGV4dGFyZWEgZG9tIElkICgjIG9wdGlvbmFsKSBhbmQgcmV0dXJucyBpdHMgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFRleHRBcmVhVmFsQnlJZCA9IGZ1bmN0aW9uKGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGRlOiBIVE1MRWxlbWVudCA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZGUpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZG9tRWxtID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUG9seW1lci5kb20oZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHlFbG1Ob2RlID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFJlcXVpcmVkRWxlbWVudCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9ICQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldFJlcXVpcmVkRWxlbWVudC4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc09iamVjdCA9IGZ1bmN0aW9uKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50VGltZU1pbGxpcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbXB0eVN0cmluZyA9IGZ1bmN0aW9uKHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdmFsIHx8IHZhbC5sZW5ndGggPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWxtID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbG0gIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEVudGVyS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55KSB7XHJcbiAgICAgICAgICAgIGJpbmRLZXkoaWQsIGZ1bmMsIDEzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEtleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSwga2V5Q29kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICQoaWQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuXHRcdCAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcblx0XHQgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hhbmdlT3JBZGRDbGFzcyA9IGZ1bmN0aW9uKGVsbTogc3RyaW5nLCBvbGRDbGFzczogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbG1lbWVudCA9ICQoZWxtKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3Mob2xkQ2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3MobmV3Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogZGlzcGxheXMgbWVzc2FnZSAobXNnKSBvZiBvYmplY3QgaXMgbm90IG9mIHNwZWNpZmllZCB0eXBlXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHZlcmlmeVR5cGUgPSBmdW5jdGlvbihvYmo6IGFueSwgdHlwZTogYW55LCBtc2c6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SHRtbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoY29udGVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuXHJcbiAgICAgICAgICAgIC8vRm9yIFBvbHltZXIgMS4wLjAsIHlvdSBuZWVkIHRoaXMuLi5cclxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHBvbHlFbG0uaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnR5Q291bnQgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBwcm9wO1xyXG5cclxuICAgICAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgYW5kIHZhbHVlc1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludE9iamVjdCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIlxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHlbXCIgKyBjb3VudCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSBrICsgXCIgLCBcIiArIHYgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludEtleXMgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSAnLCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgKz0gaztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCBlbmFibGVkIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0RW5hYmxlbWVudCA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIHZpczogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmlzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICQoZWxtKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhpZGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAkKGVsbSkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBQcm9ncmFtYXRpY2FsbHkgY3JlYXRlcyBvYmplY3RzIGJ5IG5hbWUsIHNpbWlsYXIgdG8gd2hhdCBKYXZhIHJlZmxlY3Rpb24gZG9lc1xyXG5cclxuICAgICAgICAqIGV4OiB2YXIgZXhhbXBsZSA9IEluc3RhbmNlTG9hZGVyLmdldEluc3RhbmNlPE5hbWVkVGhpbmc+KHdpbmRvdywgJ0V4YW1wbGVDbGFzcycsIGFyZ3MuLi4pO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIDxUPihjb250ZXh0OiBPYmplY3QsIG5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBUIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShjb250ZXh0W25hbWVdLnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxUPmluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBqY3JDbnN0LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpjckNuc3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IENPTU1FTlRfQlk6IHN0cmluZyA9IFwiY29tbWVudEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQVUJMSUNfQVBQRU5EOiBzdHJpbmcgPSBcInB1YmxpY0FwcGVuZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFJJTUFSWV9UWVBFOiBzdHJpbmcgPSBcImpjcjpwcmltYXJ5VHlwZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUE9MSUNZOiBzdHJpbmcgPSBcInJlcDpwb2xpY3lcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBNSVhJTl9UWVBFUzogc3RyaW5nID0gXCJqY3I6bWl4aW5UeXBlc1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX0NPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX1JFQ0lQOiBzdHJpbmcgPSBcInJlY2lwXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9TVUJKRUNUOiBzdHJpbmcgPSBcInN1YmplY3RcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEX0JZOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkQnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFRBR1M6IHN0cmluZyA9IFwidGFnc1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVVJRDogc3RyaW5nID0gXCJqY3I6dXVpZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRDogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEX0JZOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQ6IHN0cmluZyA9IFwibWV0YTY0Ompzb25cIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBhdHRhY2htZW50LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGF0dGFjaG1lbnQge1xyXG4gICAgICAgIC8qIE5vZGUgYmVpbmcgdXBsb2FkZWQgdG8gKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVwbG9hZE5vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21GaWxlRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBtNjQubmFtZXNwYWNlIHZlcnNpb24hXCIpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZygpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3RlOiBUbyBydW4gbGVnYWN5IHVwbG9hZGVyIGp1c3QgcHV0IHRoaXMgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIGhlcmUsIGFuZFxyXG4gICAgICAgICAgICBub3RoaW5nIGVsc2UgaXMgcmVxdWlyZWQuIFNlcnZlciBzaWRlIHByb2Nlc3NpbmcgaXMgc3RpbGwgaW4gcGxhY2UgZm9yIGl0XHJcblxyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21VcmxEbGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJEZWxldGUgdGhlIEF0dGFjaG1lbnQgb24gdGhlIE5vZGU/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0LCBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZT4oXCJkZWxldGVBdHRhY2htZW50XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCBudWxsLCBub2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCB1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgYXR0YWNobWVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVtb3ZlQmluYXJ5QnlVaWQodWlkKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIHJlLXJlbmRlciBmcm9tIGxvY2FsIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGVkaXQuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgZWRpdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IG02NC5DcmVhdGVOb2RlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnNlcnRCb29rUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0Qm9va1Jlc3BvbnNlIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGVsZXRlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlLCBwYXlsb2FkOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZSA9IHBheWxvYWRbXCJwb3N0RGVsZXRlU2VsTm9kZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IHNlbE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIGhpZ2hsaWdodElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSBhbmQgd2UgYXJlIHRoZSBjb21tZW50ZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBTZXJ2ZXIgd2lsbCBoYXZlIHNlbnQgdXMgYmFjayB0aGUgcmF3IHRleHQgY29udGVudCwgdGhhdCBzaG91bGQgYmUgbWFya2Rvd24gaW5zdGVhZCBvZiBhbnkgSFRNTCwgc29cclxuICAgICAgICAgICAgICAgICAgICAgKiB0aGF0IHdlIGNhbiBkaXNwbGF5IHRoaXMgYW5kIHNhdmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGUgPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGNhbm5vdCBlZGl0IG5vZGVzIHRoYXQgeW91IGRvbid0IG93bi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIk1vdmUgbm9kZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBudWxsOyAvLyByZXNldFxyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2Ugbm9kZSBwb3NpdGlvblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dSZWFkT25seVByb3BlcnRpZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTm9kZSBJRCBhcnJheSBvZiBub2RlcyB0aGF0IGFyZSByZWFkeSB0byBiZSBtb3ZlZCB3aGVuIHVzZXIgY2xpY2tzICdGaW5pc2ggTW92aW5nJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZXNUb01vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50T2ZOZXdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpbmRpY2F0ZXMgZWRpdG9yIGlzIGRpc3BsYXlpbmcgYSBub2RlIHRoYXQgaXMgbm90IHlldCBzYXZlZCBvbiB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0aW5nVW5zYXZlZE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBub2RlIChOb2RlSW5mby5qYXZhKSB0aGF0IGlzIGJlaW5nIGNyZWF0ZWQgdW5kZXIgd2hlbiBuZXcgbm9kZSBpcyBjcmVhdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOb2RlIGJlaW5nIGVkaXRlZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogdG9kby0yOiB0aGlzIGFuZCBzZXZlcmFsIG90aGVyIHZhcmlhYmxlcyBjYW4gbm93IGJlIG1vdmVkIGludG8gdGhlIGRpYWxvZyBjbGFzcz8gSXMgdGhhdCBnb29kIG9yIGJhZFxyXG4gICAgICAgICAqIGNvdXBsaW5nL3Jlc3BvbnNpYmlsaXR5P1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBJbnN0YW5jZSBvZiBFZGl0Tm9kZURpYWxvZzogRm9yIG5vdyBjcmVhdGluZyBuZXcgb25lIGVhY2ggdGltZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVEbGdJbnN0OiBFZGl0Tm9kZURsZyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHlwZT1Ob2RlSW5mby5qYXZhXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBXaGVuIGluc2VydGluZyBhIG5ldyBub2RlLCB0aGlzIGhvbGRzIHRoZSBub2RlIHRoYXQgd2FzIGNsaWNrZWQgb24gYXQgdGhlIHRpbWUgdGhlIGluc2VydCB3YXMgcmVxdWVzdGVkLCBhbmRcclxuICAgICAgICAgKiBpcyBzZW50IHRvIHNlcnZlciBmb3Igb3JkaW5hbCBwb3NpdGlvbiBhc3NpZ25tZW50IG9mIG5ldyBub2RlLiBBbHNvIGlmIHRoaXMgdmFyIGlzIG51bGwsIGl0IGluZGljYXRlcyB3ZSBhcmVcclxuICAgICAgICAgKiBjcmVhdGluZyBpbiBhICdjcmVhdGUgdW5kZXIgcGFyZW50JyBtb2RlLCB2ZXJzdXMgbm9uLW51bGwgbWVhbmluZyAnaW5zZXJ0IGlubGluZScgdHlwZSBvZiBpbnNlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVJbnNlcnRUYXJnZXQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgdHJ1ZSBpZiB3ZSBjYW4gJ3RyeSB0bycgaW5zZXJ0IHVuZGVyICdub2RlJyBvciBmYWxzZSBpZiBub3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzRWRpdEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogQ2hlY2sgdGhhdCBpZiB3ZSBoYXZlIGEgY29tbWVudEJ5IHByb3BlcnR5IHdlIGFyZSB0aGUgY29tbWVudGVyLCBiZWZvcmUgYWxsb3dpbmcgZWRpdCBidXR0b24gYWxzby5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgKCFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSkgfHwgcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpKSAvL1xyXG4gICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYmVzdCB3ZSBjYW4gZG8gaGVyZSBpcyBhbGxvdyB0aGUgZGlzYWJsZUluc2VydCBwcm9wIHRvIGJlIGFibGUgdG8gdHVybiB0aGluZ3Mgb2ZmLCBub2RlIGJ5IG5vZGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzSW5zZXJ0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuRElTQUJMRV9JTlNFUlQsIG5vZGUpID09IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGUgPSBmdW5jdGlvbih0eXBlTmFtZT86c3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZyh0eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5zYXZlTmV3Tm9kZShcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogY2FsbGVkIHRvIGRpc3BsYXkgZWRpdG9yIHRoYXQgd2lsbCBjb21lIHVwIEJFRk9SRSBhbnkgbm9kZSBpcyBzYXZlZCBvbnRvIHRoZSBzZXJ2ZXIsIHNvIHRoYXQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAgKiBhbnkgc2F2ZSBpcyBwZXJmb3JtZWQgd2Ugd2lsbCBoYXZlIHRoZSBjb3JyZWN0IG5vZGUgbmFtZSwgYXQgbGVhc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIHZlcnNpb24gaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQsIGFuZCBjdXJyZW50bHkgdGhpcyBtZWFucyAnZWRpdGluZ1Vuc2F2ZWROb2RlJyBpcyBub3QgY3VycmVudGx5IGV2ZXJcclxuICAgICAgICAgKiB0cmlnZ2VyZWQuIFRoZSBuZXcgYXBwcm9hY2ggbm93IHRoYXQgd2UgaGF2ZSB0aGUgYWJpbGl0eSB0byAncmVuYW1lJyBub2RlcyBpcyB0byBqdXN0IGNyZWF0ZSBvbmUgd2l0aCBhXHJcbiAgICAgICAgICogcmFuZG9tIG5hbWUgYW4gbGV0IHVzZXIgc3RhcnQgZWRpdGluZyByaWdodCBhd2F5IGFuZCB0aGVuIHJlbmFtZSB0aGUgbm9kZSBJRiBhIGN1c3RvbSBub2RlIG5hbWUgaXMgbmVlZGVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhpcyBtZWFucyBpZiB3ZSBjYWxsIHRoaXMgZnVuY3Rpb24gKHN0YXJ0RWRpdGluZ05ld05vZGVXaXRoTmFtZSkgaW5zdGVhZCBvZiAnc3RhcnRFZGl0aW5nTmV3Tm9kZSgpJ1xyXG4gICAgICAgICAqIHRoYXQgd2lsbCBjYXVzZSB0aGUgR1VJIHRvIGFsd2F5cyBwcm9tcHQgZm9yIHRoZSBub2RlIG5hbWUgYmVmb3JlIGNyZWF0aW5nIHRoZSBub2RlLiBUaGlzIHdhcyB0aGUgb3JpZ2luYWxcclxuICAgICAgICAgKiBmdW5jdGlvbmFsaXR5IGFuZCBzdGlsbCB3b3Jrcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGVXaXRoTmFtZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnROb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ3JlYXRlIHN1Ym5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZU5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5TYXZlTm9kZVJlc3BvbnNlLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIC8qIGJlY2FzdXNlIEkgZG9uJ3QgdW5kZXJzdGFuZCAnZWRpdGluZ1Vuc2F2ZWROb2RlJyB2YXJpYWJsZSBhbnkgbG9uZ2VyIHVudGlsIGkgcmVmcmVzaCBteSBtZW1vcnksIGkgd2lsbCB1c2VcclxuICAgICAgICAgICAgICAgIHRoZSBvbGQgYXBwcm9hY2ggb2YgcmVmcmVzaGluZyBlbnRpcmUgdHJlZSByYXRoZXIgdGhhbiBtb3JlIGVmZmljaWVudCByZWZyZXNuTm9kZU9uUGFnZSwgYmVjdWFzZSBpdCByZXF1aXJlc1xyXG4gICAgICAgICAgICAgICAgdGhlIG5vZGUgdG8gYWxyZWFkeSBiZSBvbiB0aGUgcGFnZSwgYW5kIHRoaXMgcmVxdWlyZXMgaW4gZGVwdGggYW5hbHlzIGknbSBub3QgZ29pbmcgdG8gZG8gcmlnaHQgdGhpcyBtaW51dGUuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLy9yZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcGF5bG9hZC5zYXZlZElkKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0TW9kZSA9IGZ1bmN0aW9uKG1vZGVWYWw/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZVZhbCAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1vZGVWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0b2RvLTM6IHJlYWxseSBlZGl0IG1vZGUgYnV0dG9uIG5lZWRzIHRvIGJlIHNvbWUga2luZCBvZiBidXR0b25cclxuICAgICAgICAgICAgLy8gdGhhdCBjYW4gc2hvdyBhbiBvbi9vZmYgc3RhdGUuXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNpbmNlIGVkaXQgbW9kZSB0dXJucyBvbiBsb3RzIG9mIGJ1dHRvbnMsIHRoZSBsb2NhdGlvbiBvZiB0aGUgbm9kZSB3ZSBhcmUgdmlld2luZyBjYW4gY2hhbmdlIHNvIG11Y2ggaXRcclxuICAgICAgICAgICAgICogZ29lcyBjb21wbGV0ZWx5IG9mZnNjcmVlbiBvdXQgb2Ygdmlldywgc28gd2Ugc2Nyb2xsIGl0IGJhY2sgaW50byB2aWV3IGV2ZXJ5IHRpbWVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5zYXZlVXNlclByZWZlcmVuY2VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVXAgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZUFib3ZlID0gZ2V0Tm9kZUFib3ZlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVBYm92ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbm9kZUFib3ZlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVEb3duID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVCZWxvdyhub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlQmVsb3cgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVCZWxvdy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGUubmFtZVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvVG9wID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcE5vZGUgPSBnZXRGaXJzdENoaWxkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvcE5vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IHRvcE5vZGUubmFtZVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvQm90dG9tID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGFib3ZlIHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSB0b3Agbm9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUFib3ZlID0gZnVuY3Rpb24obm9kZSk6IGFueSB7XHJcbiAgICAgICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKG9yZGluYWwgPD0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsIC0gMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYmVsb3cgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIGJvdHRvbSBub2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQmVsb3cgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGluYWwgPSBcIiArIG9yZGluYWwpO1xyXG4gICAgICAgICAgICBpZiAob3JkaW5hbCA9PSAtMSB8fCBvcmRpbmFsID49IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCArIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRGaXJzdENoaWxkTm9kZSA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSB8fCAhbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBydW5FZGl0Tm9kZSA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVua25vd24gbm9kZUlkIGluIGVkaXROb2RlQ2xpY2s6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5pdE5vZGVFZGl0UmVxdWVzdCwganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZT4oXCJpbml0Tm9kZUVkaXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBpbml0Tm9kZUVkaXRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydE5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gcGFyZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZSA9IGZ1bmN0aW9uKHVpZD86IGFueSwgdHlwZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vIHVpZCBwcm92aWRlZCB3ZSBkZWFmdWx0IHRvIGNyZWF0aW5nIGEgbm9kZSB1bmRlciB0aGUgY3VycmVudGx5IHZpZXdlZCBub2RlIChwYXJlbnQgb2YgY3VycmVudCBwYWdlKSwgb3IgYW55IHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAqIG5vZGUgaWYgdGhlcmUgaXMgYSBzZWxlY3RlZCBub2RlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHROb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBoaWdobGlnaHROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIGNyZWF0ZVN1Yk5vZGU6IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRoaXMgaW5kaWNhdGVzIHdlIGFyZSBOT1QgaW5zZXJ0aW5nIGlubGluZS4gQW4gaW5saW5lIGluc2VydCB3b3VsZCBhbHdheXMgaGF2ZSBhIHRhcmdldC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKHR5cGVOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVwbHlUb0NvbW1lbnQgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjcmVhdGVTdWJOb2RlKHVpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0aW9ucyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBjb3VsZCB3cml0ZSBjb2RlIHRoYXQgb25seSBzY2FucyBmb3IgYWxsIHRoZSBcIlNFTFwiIGJ1dHRvbnMgYW5kIHVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZW0sIGJ1dCBmb3Igbm93XHJcbiAgICAgICAgICAgICAqIHdlIHRha2UgdGhlIHNpbXBsZSBhcHByb2FjaCBhbmQganVzdCByZS1yZW5kZXIgdGhlIHBhZ2UuIFRoZXJlIGlzIG5vIGNhbGwgdG8gdGhlIHNlcnZlciwgc28gdGhpcyBpc1xyXG4gICAgICAgICAgICAgKiBhY3R1YWxseSB2ZXJ5IGVmZmljaWVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBEZWxldGUgdGhlIHNpbmdsZSBub2RlIGlkZW50aWZpZWQgYnkgJ3VpZCcgcGFyYW1ldGVyIGlmIHVpZCBwYXJhbWV0ZXIgaXMgcGFzc2VkLCBhbmQgaWYgdWlkIHBhcmFtZXRlciBpcyBub3RcclxuICAgICAgICAgKiBwYXNzZWQgdGhlbiB1c2UgdGhlIG5vZGUgc2VsZWN0aW9ucyBmb3IgbXVsdGlwbGUgc2VsZWN0aW9ucyBvbiB0aGUgcGFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gZGVsZXRlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSA/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9zdERlbGV0ZVNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRCZXN0UG9zdERlbGV0ZVNlbE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlTm9kZXNSZXF1ZXN0LCBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2U+KFwiZGVsZXRlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogc2VsTm9kZXNBcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGRlbGV0ZU5vZGVzUmVzcG9uc2UsIG51bGwsIHsgXCJwb3N0RGVsZXRlU2VsTm9kZVwiOiBwb3N0RGVsZXRlU2VsTm9kZSB9KTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBHZXRzIHRoZSBub2RlIHdlIHdhbnQgdG8gc2Nyb2xsIHRvIGFmdGVyIGEgZGVsZXRlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRCZXN0UG9zdERlbGV0ZVNlbE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgLyogVXNlIGEgaGFzaG1hcC10eXBlIGFwcHJvYWNoIHRvIHNhdmluZyBhbGwgc2VsZWN0ZWQgbm9kZXMgaW50byBhIGxvb3VwIG1hcCAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZXNNYXA6IE9iamVjdCA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVzQXNNYXBCeUlkKCk7XHJcbiAgICAgICAgICAgIGxldCBiZXN0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCB0YWtlTmV4dE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qIG5vdyB3ZSBzY2FuIHRoZSBjaGlsZHJlbiwgYW5kIHRoZSBsYXN0IGNoaWxkIHdlIGVuY291bnRlcmQgdXAgdW50aWwgd2UgZmluZCB0aGUgcmlzdCBvbmVuIGluIG5vZGVzTWFwIHdpbGwgYmUgdGhlXHJcbiAgICAgICAgICAgIG5vZGUgd2Ugd2lsbCB3YW50IHRvIHNlbGVjdCBhbmQgc2Nyb2xsIHRoZSB1c2VyIHRvIEFGVEVSIHRoZSBkZWxldGluZyBpcyBkb25lICovXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YWtlTmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpcyB0aGlzIG5vZGUgb25lIHRvIGJlIGRlbGV0ZWQgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2Rlc01hcFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRha2VOZXh0Tm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBiZXN0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJlc3ROb2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gbW92ZSBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFxyXG4gICAgICAgICAgICAgICAgXCJDb25maXJtIFBhc3RlXCIsXHJcbiAgICAgICAgICAgICAgICBcIlBhc3RlIFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpIHRvIG5ldyBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgICAgICBcIlllcywgbW92ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gc2VsTm9kZXNBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9OyAvLyBjbGVhciBzZWxlY3Rpb25zLlxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZmluaXNoTW92aW5nU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBNb3ZlXCIsIFwiTW92ZSBcIiArIG5vZGVzVG9Nb3ZlLmxlbmd0aCArIFwiIG5vZGUocykgdG8gc2VsZWN0ZWQgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXMsIG1vdmUuXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBGb3Igbm93LCB3ZSB3aWxsIGp1c3QgY3JhbSB0aGUgbm9kZXMgb250byB0aGUgZW5kIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICogcGFnZS4gTGF0ZXIgb24gd2UgY2FuIGdldCBtb3JlIHNwZWNpZmljIGFib3V0IGFsbG93aW5nIHByZWNpc2UgZGVzdGluYXRpb24gbG9jYXRpb24gZm9yIG1vdmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICogbm9kZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTW92ZU5vZGVzUmVxdWVzdCwganNvbi5Nb3ZlTm9kZXNSZXNwb25zZT4oXCJtb3ZlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldENoaWxkSWRcIjogaGlnaGxpZ2h0Tm9kZSAhPSBudWxsID8gaGlnaGxpZ2h0Tm9kZS5pZCA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBub2Rlc1RvTW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG1vdmVOb2Rlc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydEJvb2tXYXJBbmRQZWFjZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtXCIsIFwiSW5zZXJ0IGJvb2sgV2FyIGFuZCBQZWFjZT88cC8+V2FybmluZzogWW91IHNob3VsZCBoYXZlIGFuIEVNUFRZIG5vZGUgc2VsZWN0ZWQgbm93LCB0byBzZXJ2ZSBhcyB0aGUgcm9vdCBub2RlIG9mIHRoZSBib29rIVwiLCBcIlllcywgaW5zZXJ0IGJvb2suXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGluc2VydGluZyB1bmRlciB3aGF0ZXZlciBub2RlIHVzZXIgaGFzIGZvY3VzZWQgKi9cclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydEJvb2tSZXF1ZXN0LCBqc29uLkluc2VydEJvb2tSZXNwb25zZT4oXCJpbnNlcnRCb29rXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib29rTmFtZVwiOiBcIldhciBhbmQgUGVhY2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0cnVuY2F0ZWRcIjogdXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgaW5zZXJ0Qm9va1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWV0YTY0LmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIE1haW4gQXBwbGljYXRpb24gaW5zdGFuY2UsIGFuZCBjZW50cmFsIHJvb3QgbGV2ZWwgb2JqZWN0IGZvciBhbGwgY29kZSwgYWx0aG91Z2ggZWFjaCBtb2R1bGUgZ2VuZXJhbGx5IGNvbnRyaWJ1dGVzIG9uZVxyXG4gKiBzaW5nbGV0b24gdmFyaWFibGUgdG8gdGhlIGdsb2JhbCBzY29wZSwgd2l0aCBhIG5hbWUgdXN1YWxseSBpZGVudGljYWwgdG8gdGhhdCBmaWxlLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG1ldGE2NCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYXBwSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJVcmxQYXRoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXJsQ21kOiBzdHJpbmc7XHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY29kZUZvcm1hdERpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXJ2ZXJNYXJrZG93bjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qIHVzZWQgYXMgYSBraW5kIG9mICdzZXF1ZW5jZScgaW4gdGhlIGFwcCwgd2hlbiB1bmlxdWUgdmFscyBhIG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dEd1aWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8qIG5hbWUgb2YgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1c2VyTmFtZTogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuXHJcbiAgICAgICAgLyogc2NyZWVuIGNhcGFiaWxpdGllcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGV2aWNlV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCBkZXZpY2VIZWlnaHQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVXNlcidzIHJvb3Qgbm9kZS4gVG9wIGxldmVsIG9mIHdoYXQgbG9nZ2VkIGluIHVzZXIgaXMgYWxsb3dlZCB0byBzZWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZUlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVQYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNwZWNpZmllcyBpZiB0aGlzIGlzIGFkbWluIHVzZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0FkbWluVXNlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBhbHdheXMgc3RhcnQgb3V0IGFzIGFub24gdXNlciB1bnRpbCBsb2dpbiAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBbm9uVXNlcjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZXhwb3J0IGxldCBhbm9uVXNlckxhbmRpbmdQYWdlTm9kZTogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93RmlsZVN5c3RlbVNlYXJjaDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNpZ25hbHMgdGhhdCBkYXRhIGhhcyBjaGFuZ2VkIGFuZCB0aGUgbmV4dCB0aW1lIHdlIGdvIHRvIHRoZSBtYWluIHRyZWUgdmlldyB3aW5kb3cgd2UgbmVlZCB0byByZWZyZXNoIGRhdGFcclxuICAgICAgICAgKiBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRyZWVEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUuaWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIE1hcHMgZnJvbSB0aGUgRE9NIElEIHRvIHRoZSBlZGl0b3IgamF2YXNjcmlwdCBpbnN0YW5jZSAoQWNlIEVkaXRvciBpbnN0YW5jZSkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFjZUVkaXRvcnNCeUlkOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogY291bnRlciBmb3IgbG9jYWwgdWlkcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFVpZDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAgICAgKiB0byB3aGVuZXZlciB0aGUgcGFnZSB3aXRoIHRoYXQgY2hpbGQgaXMgdmlzaXRlZCwgYW5kIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwIGhvbGRzIHRoZSBtYXAgb2YgXCJwYXJlbnQgdWlkIHRvXHJcbiAgICAgICAgICogc2VsZWN0ZWQgbm9kZSAoTm9kZUluZm8gb2JqZWN0KVwiLCB3aGVyZSB0aGUga2V5IGlzIHRoZSBwYXJlbnQgbm9kZSB1aWQsIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGN1cnJlbnRseVxyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAgICAgKiBiZWluZyBhYmxlIHRvIHNjcm9sbCB0byB0aGUgbm9kZSBkdXJpbmcgbmF2aWdhdGluZyBhcm91bmQgb24gdGhlIHRyZWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLyogVXNlci1zZWxlY3RhYmxlIHVzZXItYWNjb3VudCBvcHRpb25zIGVhY2ggdXNlciBjYW4gc2V0IG9uIGhpcyBhY2NvdW50ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX0FEVkFOQ0VEOiBzdHJpbmcgPSBcImFkdmFuY2VkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLyogY2FuIGJlICdzaW1wbGUnIG9yICdhZHZhbmNlZCcgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlT3B0aW9uOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZ2dsZWQgYnkgYnV0dG9uLCBhbmQgaG9sZHMgaWYgd2UgYXJlIGdvaW5nIHRvIHNob3cgcHJvcGVydGllcyBvciBub3Qgb24gZWFjaCBub2RlIGluIHRoZSBtYWluIHZpZXdcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dQcm9wZXJ0aWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIEZsYWcgdGhhdCBpbmRpY2F0ZXMgaWYgd2UgYXJlIHJlbmRlcmluZyBwYXRoLCBvd25lciwgbW9kVGltZSwgZXRjLiBvbiBlYWNoIHJvdyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd01ldGFEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTGlzdCBvZiBub2RlIHByZWZpeGVzIHRvIGZsYWcgbm9kZXMgdG8gbm90IGFsbG93IHRvIGJlIHNob3duIGluIHRoZSBwYWdlIGluIHNpbXBsZSBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdDogYW55ID0ge1xyXG4gICAgICAgICAgICBcInJlcDpcIjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWFkT25seVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluYXJ5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIGFsbCBub2RlIHVpZHMgdG8gdHJ1ZSBpZiBzZWxlY3RlZCwgb3RoZXJ3aXNlIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZGVsZXRlZCAobm90IGV4aXN0aW5nKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIFNldCBvZiBhbGwgbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZWQgKGZyb20gdGhlIGFiYnJldmlhdGVkIGZvcm0pICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBleHBhbmRlZEFiYnJldk5vZGVJZHM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlRGF0YTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBhbGwgdmFyaWFibGVzIGRlcml2YWJsZSBmcm9tIGN1cnJlbnROb2RlRGF0YSwgYnV0IHN0b3JlZCBkaXJlY3RseSBmb3Igc2ltcGxlciBjb2RlL2FjY2Vzc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZUlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVQYXRoOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gZ3VpZCB0byBEYXRhIE9iamVjdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGF0YU9iak1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fTtcclxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlclByZWZlcmVuY2VzOiBqc29uLlVzZXJQcmVmZXJlbmNlcyA9IHtcclxuICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwibGFzdE5vZGVcIjogXCJcIixcclxuICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVNYWluTWVudVBhbmVsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICAgICAqIGZ1dHVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZ2lzdGVyRGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFkYXRhLmd1aWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbmV4dEd1aWQ7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9iamVjdEJ5R3VpZCA9IGZ1bmN0aW9uKGd1aWQpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGRhdGFPYmpNYXBbZ3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGNhbGxiYWNrIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgc2NyaXB0IHRvIHJ1biwgb3IgaWYgaXQncyBhIGZ1bmN0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmVcclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbmV2ZXIgd2UgYXJlIGJ1aWxkaW5nIGFuIG9uQ2xpY2sgc3RyaW5nLCBhbmQgd2UgaGF2ZSB0aGUgYWN0dWFsIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiB0aGUgbmFtZSBvZiB0aGVcclxuICAgICAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAgICAgKiB0byB0aGUgZnVuY3Rpb24gb2JqZWN0LCBhbmQgdGhlbiBlbmNvZGUgYSBjYWxsIHRvIHJ1biB0aGF0IGd1aWQgYnkgY2FsbGluZyBydW5DYWxsYmFjay4gVGhlcmUgaXMgYSBsZXZlbCBvZlxyXG4gICAgICAgICAqIGluZGlyZWN0aW9uIGhlcmUsIGJ1dCB0aGlzIGlzIHRoZSBzaW1wbGVzdCBhcHByb2FjaCB3aGVuIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBtYXAgZnJvbSBhIHN0cmluZyB0byBhXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBjdHg9Y29udGV4dCwgd2hpY2ggaXMgdGhlICd0aGlzJyB0byBjYWxsIHdpdGggaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCBhbmQgaGF2ZSBhICd0aGlzJyBjb250ZXh0IHRvIGJpbmQgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBwYXlsb2FkIGlzIGFueSBkYXRhIG9iamVjdCB0aGF0IG5lZWRzIHRvIGJlIHBhc3NlZCBhdCBydW50aW1lXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZU9uQ2xpY2sgPSBmdW5jdGlvbihjYWxsYmFjazogYW55LCBjdHg/OiBhbnksIHBheWxvYWQ/OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChwYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBheWxvYWRTdHIgPSBwYXlsb2FkID8gcGF5bG9hZC5ndWlkIDogXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm02NC5tZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIsXCIgKyBjdHguZ3VpZCArIFwiLFwiICsgcGF5bG9hZFN0ciArIFwiKTtcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibTY0Lm1ldGE2NC5ydW5DYWxsYmFjayhcIiArIGNhbGxiYWNrLmd1aWQgKyBcIik7XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuZXhwZWN0ZWQgY2FsbGJhY2sgdHlwZSBpbiBlbmNvZGVPbkNsaWNrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFPYmogPSBnZXRPYmplY3RCeUd1aWQoZ3VpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vIHRoYXQgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICBpZiAoZGF0YU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG9yIGVsc2Ugc29tZXRpbWVzIHRoZSByZWdpc3RlcmVkIG9iamVjdCBpdHNlbGYgaXMgdGhlIGZ1bmN0aW9uLFxyXG4gICAgICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFPYmogPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gZ2V0T2JqZWN0QnlHdWlkKGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBheWxvYWRPYmogPSBwYXlsb2FkID8gZ2V0T2JqZWN0QnlHdWlkKHBheWxvYWQpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGwodGhpeiwgcGF5bG9hZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmooKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5hYmxlIHRvIGZpbmQgY2FsbGJhY2sgb24gcmVnaXN0ZXJlZCBndWlkOiBcIiArIGd1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5TaW1wbGVNb2RlID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBlZGl0TW9kZU9wdGlvbiA9PT0gTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2ggPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZ29Ub01haW5QYWdlKHRydWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnb1RvTWFpblBhZ2UgPSBmdW5jdGlvbihyZXJlbmRlcj86IGJvb2xlYW4sIGZvcmNlU2VydmVyUmVmcmVzaD86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIHRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXJlbmRlciB8fCB0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgcmUtcmVuZGVyaW5nIHBhZ2UgKGVpdGhlciBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBkYXRhLCB0aGVuIHdlIGp1c3QgbmVlZCB0byBsaXR0ZXJhbGx5IHN3aXRjaFxyXG4gICAgICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0VGFiID0gZnVuY3Rpb24ocGFnZU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAgICAgKDxfSGFzU2VsZWN0Pmlyb25QYWdlcykuc2VsZWN0KHBhZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgY29kZSBjYW4gYmUgbWFkZSBtb3JlIERSWSwgYnV0IGknbSBqdXN0IHRyeWluZyBpdCBvdXQgZm9yIG5vdywgc28gaSdtIG5vdCBib3RoZXJpbmcgdG8gcGVyZmVjdCBpdCB5ZXQuICovXHJcbiAgICAgICAgICAgIC8vICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGlmIChwYWdlTmFtZSA9PSAnbWFpblRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAnc2VhcmNoVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3RpbWVsaW5lVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgICAgICogbWV0aG9kcyBhcmUgb2YgY291cnNlIHNpbmdsZXRvbnMgdGhhdCBhY2NlcHQgdGhpcyBkYXRhIHBhcmFtZXRlciBmb3IgYW55IG9wdGVyYXRpb25zLiAob2xkc2Nob29sIHdheSBvZiBkb2luZ1xyXG4gICAgICAgICAqIE9PUCB3aXRoICd0aGlzJyBiZWluZyBmaXJzdCBwYXJhbWV0ZXIgYWx3YXlzKS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIE5vdGU6IGVhY2ggZGF0YSBpbnN0YW5jZSBpcyByZXF1aXJlZCB0byBoYXZlIGEgZ3VpZCBudW1iZXJpYyBwcm9wZXJ0eSwgdW5pcXVlIHRvIGl0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGFuZ2VQYWdlID0gZnVuY3Rpb24ocGc/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwZy50YWJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib29wcywgd3Jvbmcgb2JqZWN0IHR5cGUgcGFzc2VkIHRvIGNoYW5nZVBhZ2UgZnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgaXMgdGhlIHNhbWUgYXMgc2V0dGluZyB1c2luZyBtYWluSXJvblBhZ2VzPz8gKi9cclxuICAgICAgICAgICAgdmFyIHBhcGVyVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTsgLy9cIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+cGFwZXJUYWJzKS5zZWxlY3QocGcudGFiSWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vZGVCbGFja0xpc3RlZCA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFpblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wO1xyXG4gICAgICAgICAgICBmb3IgKHByb3AgaW4gc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBub2RlLm5hbWUuc3RhcnRzV2l0aChwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgdmFyIHNlbEFycmF5ID0gW10sIGlkeCA9IDAsIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVJZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgdmFyIHNlbEFycmF5ID0gW10sIGlkeCA9IDAsIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBzZWxlY3RlZCBub2Rlcy5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJuIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIGVhY2ggTm9kZUluZm8gd2hlcmUgdGhlIGtleSBpcyB0aGUgaWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQgPSBmdW5jdGlvbigpOiBPYmplY3Qge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSB0aGlzLmdldFNlbGVjdGVkTm9kZXNBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXRbc2VsQXJyYXlbaV0uaWRdID0gc2VsQXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgc2VsZWN0ZWQgbm9kZXMgYXMgTm9kZUluZm8uamF2YSBvYmplY3RzIGFycmF5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXJyYXkgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGVkTm9kZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzLCBub2RlKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1pbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXIgPT09IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IG93bmVyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxtID0gJChcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktb3RoZXJcIiwgXCJjcmVhdGVkLWJ5LW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBSZXR1cm5zIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIG5vZGUuaWQgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVGcm9tSWQgPSBmdW5jdGlvbihpZDogc3RyaW5nKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZFRvTm9kZU1hcFtpZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhdGhPZlVpZCA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEhpZ2hsaWdodGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dCeUlkID0gZnVuY3Rpb24oaWQsIHNjcm9sbCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaWdobGlnaHRSb3dCeUlkIGZhaWxlZCB0byBmaW5kIGlkOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2Nyb2xsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBkb25lSGlnaGxpZ2h0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICAgICAgbGV0IGN1ckhpZ2hsaWdodGVkTm9kZToganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgPT09IG5vZGUudWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbHJlYWR5IGhpZ2hsaWdodGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkID0gY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkb25lSGlnaGxpZ2h0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF0gPSBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZDogc3RyaW5nID0gbm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCByb3dFbG06IHN0cmluZyA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJvd0VsbSB8fCByb3dFbG0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmaW5kIHJvd0VsZW1lbnQgdG8gaGlnaGxpZ2h0OiBcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlYWxseSBuZWVkIHRvIHVzZSBwdWIvc3ViIGV2ZW50IHRvIGJyb2FkY2FzdCBlbmFibGVtZW50LCBhbmQgbGV0IGVhY2ggY29tcG9uZW50IGRvIHRoaXMgaW5kZXBlbmRlbnRseSBhbmRcclxuICAgICAgICAgKiBkZWNvdXBsZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVJc01pbmU6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICYmIChoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gdXNlck5hbWUgfHwgXCJhZG1pblwiID09PSB1c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGxldCBob21lTm9kZVNlbGVjdGVkOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAmJiBob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGxldCBpbXBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5pbXBvcnRBbGxvd2VkO1xyXG4gICAgICAgICAgICBsZXQgZXhwb3J0RmVhdHVyZUVuYWJsZWQgPSBpc0FkbWluVXNlciB8fCB1c2VyUHJlZmVyZW5jZXMuZXhwb3J0QWxsb3dlZDtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE9yZGluYWw6IG51bWJlciA9IGdldE9yZGluYWxPZk5vZGUoaGlnaGxpZ2h0Tm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBudW1DaGlsZE5vZGVzOiBudW1iZXIgPSBnZXROdW1DaGlsZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSBoaWdobGlnaHRPcmRpbmFsID4gMCAmJiBudW1DaGlsZE5vZGVzID4gMTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gaGlnaGxpZ2h0T3JkaW5hbCA8IG51bUNoaWxkTm9kZXMgLSAxICYmIG51bUNoaWxkTm9kZXMgPiAxO1xyXG5cclxuICAgICAgICAgICAgLy90b2RvLTA6IG5lZWQgdG8gYWRkIHRvIHRoaXMgc2VsTm9kZUlzTWluZSB8fCBzZWxQYXJlbnRJc01pbmU7XHJcbiAgICAgICAgICAgIGxldCBjYW5DcmVhdGVOb2RlID0gdXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIChpc0FkbWluVXNlciB8fCAoIWlzQW5vblVzZXIgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbmFibGVtZW50OiBpc0Fub25Vc2VyPVwiICsgaXNBbm9uVXNlciArIFwiIHNlbE5vZGVDb3VudD1cIiArIHNlbE5vZGVDb3VudCArIFwiIHNlbE5vZGVJc01pbmU9XCIgKyBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wc1RvZ2dsZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBwcm9wc1RvZ2dsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5pc2hNb3ZpbmdTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVTZWxlY3RlZCkpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVVcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBjYW5DcmVhdGVOb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCBob21lTm9kZUlkPT1oaWdobGlnaHROb2RlLmlkKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0RmVhdHVyZUVuYWJsZWQgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVJZD09aGlnaGxpZ2h0Tm9kZS5pZCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIC8vVG9wIExldmVsIE1lbnUgVmlzaWJpbGl0eVxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2luZ2xlU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZztcclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQgYSBzaW5nbGUgU2VsIE5vZGVJRDogXCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T3JkaW5hbE9mTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE51bUNoaWxkTm9kZXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0Q3VycmVudE5vZGVEYXRhID0gZnVuY3Rpb24oZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZURhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGRhdGEubm9kZTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVVaWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUlkID0gZGF0YS5ub2RlLmlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVBhdGggPSBkYXRhLm5vZGUucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLnJlbmRlck5vZGVSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW1vdmVCaW5hcnlCeVVpZCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzQmluYXJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdXBkYXRlcyBjbGllbnQgc2lkZSBtYXBzIGFuZCBjbGllbnQtc2lkZSBpZGVudGlmaWVyIGZvciBuZXcgbm9kZSwgc28gdGhhdCB0aGlzIG5vZGUgaXMgJ3JlY29nbml6ZWQnIGJ5IGNsaWVudFxyXG4gICAgICAgICAqIHNpZGUgY29kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCB1cGRhdGVNYXBzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBhc3NpZ24gYSBwcm9wZXJ0eSBmb3IgZGV0ZWN0aW5nIHRoaXMgbm9kZSB0eXBlLCBJJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiB1c2luZyBzb21lIGtpbmQgb2YgY3VzdG9tIEpTXHJcbiAgICAgICAgICAgICAqIHByb3RvdHlwZS1yZWxhdGVkIGFwcHJvYWNoXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHVwZGF0ZU1hcHMgPyB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBGb3IgdGhlc2UgdHdvIHByb3BlcnRpZXMgdGhhdCBhcmUgYWNjZXNzZWQgZnJlcXVlbnRseSB3ZSBnbyBhaGVhZCBhbmQgbG9va3VwIHRoZSBwcm9wZXJ0aWVzIGluIHRoZVxyXG4gICAgICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgICAgICogc2ltcGxpZnkgY29kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuTEFTVF9NT0RJRklFRCwgbm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZU1hcHMpIHtcclxuICAgICAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgaWRUb05vZGVNYXBbbm9kZS5pZF0gPSBub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRDb25zdGFudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBPTElDWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwocmVhZE9ubHlQcm9wZXJ0eUxpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoYmluYXJ5UHJvcGVydHlMaXN0LCBbamNyQ25zdC5CSU5fREFUQV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXRBcHAgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBhcHBJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgIHRhYnMuYWRkRXZlbnRMaXN0ZW5lcihcImlyb24tc2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGFiQ2hhbmdlRXZlbnQodGFicy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5pdENvbnN0YW50cygpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2lnbnVwTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdG9kby0zOiBob3cgZG9lcyBvcmllbnRhdGlvbmNoYW5nZSBuZWVkIHRvIHdvcmsgZm9yIHBvbHltZXI/IFBvbHltZXIgZGlzYWJsZWRcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgXy5vcmllbnRhdGlvbkhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTGVhdmUgTWV0YTY0ID9cIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJIHRob3VnaHQgdGhpcyB3YXMgYSBnb29kIGlkZWEsIGJ1dCBhY3R1YWxseSBpdCBkZXN0cm95cyB0aGUgc2Vzc2lvbiwgd2hlbiB0aGUgdXNlciBpcyBlbnRlcmluZyBhblxyXG4gICAgICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgICAgICogZ29pbmcgdG8gYSBkaWZmZXJlbnQgdXJsIHNob3VsZG4ndCBibG93IHVwIHRoZSBzZXNzaW9uLCB3aGljaCBpcyB3aGF0ICdsb2dvdXQnIGRvZXMuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBkZXZpY2VXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICBkZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIGZvciBzY3JlZW4gc2l6ZSBpbiBhIHRpbWVyLiBXZSBkb24ndCB3YW50IHRvIG1vbml0b3IgYWN0dWFsIHNjcmVlbiByZXNpemUgZXZlbnRzIGJlY2F1c2UgaWYgYSB1c2VyXHJcbiAgICAgICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGEgdGhyb3R0bGUgc29ydCBvZi4gWWVzIEkga25vdyBob3cgdG8gbGlzdGVuIGZvciBldmVudHMuIE5vIEknbSBub3QgZG9pbmcgaXQgd3JvbmcgaGVyZS4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyB2YXIgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uc2NyZWVuU2l6ZUNoYW5nZSgpOyB9IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuaW5pdFByb2dyZXNzTW9uaXRvcigpO1xyXG5cclxuICAgICAgICAgICAgcHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9jZXNzVXJsUGFyYW1zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgICAgIGlmIChwYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXJsQ21kID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJjbWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hUYWJBY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5U2lnbnVwTWVzc2FnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2lnbnVwUmVzcG9uc2UgPSAkKFwiI3NpZ251cENvZGVSZXNwb25zZVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTaWdudXAgY29tcGxldGUuIFlvdSBtYXkgbm93IGxvZ2luLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUoY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBEb24ndCBuZWVkIHRoaXMgbWV0aG9kIHlldCwgYW5kIGhhdmVuJ3QgdGVzdGVkIHRvIHNlZSBpZiB3b3JrcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJykge1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9hZEFub25QYWdlSG9tZSA9IGZ1bmN0aW9uKGlnbm9yZVVybCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Bbm9uUGFnZUxvYWRSZXF1ZXN0LCBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlPihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlnbm9yZVVybFwiOiBpZ25vcmVVcmxcclxuICAgICAgICAgICAgfSwgYW5vblBhZ2VMb2FkUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlVXNlclByZWZlcmVuY2VzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHVzZXJQcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk9wZW5TeXN0ZW1GaWxlUmVxdWVzdCwganNvbi5PcGVuU3lzdGVtRmlsZVJlc3BvbnNlPihcIm9wZW5TeXN0ZW1GaWxlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogZmlsZU5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0b2RvLTA6IGZvciBub3cgSSdsbCBqdXN0IGRyb3AgdGhpcyBpbnRvIGEgZ2xvYmFsIHZhcmlhYmxlLiBJIGtub3cgdGhlcmUncyBhIGJldHRlciB3YXkuIFRoaXMgaXMgdGhlIG9ubHkgdmFyaWFibGVcclxud2UgaGF2ZSBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgYW5kIGlzIG9ubHkgcmVxdWlyZWQgZm9yIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uIGluIEpTIG9uIHRoZSBpbmRleC5odG1sIHBhZ2UgKi9cclxuaWYgKCF3aW5kb3dbXCJtZXRhNjRcIl0pIHtcclxuICAgIHZhciBtZXRhNjQgPSBtNjQubWV0YTY0O1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBuYXYge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5NYWluTWVudUhlbHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvbWV0YTY0L3B1YmxpYy9oZWxwXCIsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Sc3NGZWVkc05vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCIvcnNzL2ZlZWRzXCIsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLyogSSdtIHNldHRpbmcgdGhpcyBoZXJlIHNvIHRoYXQgd2UgY2FuIGNvbWUgdXAgd2l0aCBhIHdheSB0byBtYWtlIHRoZSBhYmJyZXYgZXhwYW5kIHN0YXRlIGJlIHJlbWVtYmVyZWQsIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzIGlzIGxvd2VyIHByaW9yaXR5IGZvciBub3csIHNvIGknbSBub3QgdXNpbmcgaXQgeWV0ICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5leHBhbmRlZEFiYnJldk5vZGVJZHNbbm9kZUlkXSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0LCBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlPihcImV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWRcclxuICAgICAgICAgICAgfSwgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVkFMOiBcIitKU09OLnN0cmluZ2lmeShyZXMubm9kZUluZm8pKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZUluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRpc3BsYXlpbmdIb21lID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudFZpc2libGVUb1VzZXIgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFkaXNwbGF5aW5nSG9tZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cExldmVsUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCBpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIGRhdGEgaXMgdmlzaWJsZSB0byB5b3UgYWJvdmUgdGhpcyBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQoaWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2VXBMZXZlbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRWaXNpYmxlVG9Vc2VyKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgYXQgcm9vdC4gQ2FuJ3QgZ28gdXAuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogMSxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWREb21FbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwucG9seUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBub2RlIGhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFRocm93KFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uTm9kZVJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBzZXRzIHdoaWNoIG5vZGUgaXMgc2VsZWN0ZWQgb24gdGhpcyBwYWdlIChpLmUuIHBhcmVudCBub2RlIG9mIHRoaXMgcGFnZSBiZWluZyB0aGUgJ2tleScpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBpZiBub2RlLm93bmVyIGlzIGN1cnJlbnRseSBudWxsLCB0aGF0IG1lYW5zIHdlIGhhdmUgbm90IHJldHJpZXZlZCB0aGUgb3duZXIgZnJvbSB0aGUgc2VydmVyIHlldCwgYnV0XHJcbiAgICAgICAgICAgICAgICAgKiBpZiBub24tbnVsbCBpdCdzIGFscmVhZHkgZGlzcGxheWluZyBhbmQgd2UgZG8gbm90aGluZy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlLm93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHVwZGF0ZU5vZGVJbmZvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC51cGRhdGVOb2RlSW5mbyhub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3Blbk5vZGUgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gb3Blbk5vZGU6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShub2RlLmlkLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdW5mb3J0dW5hdGVseSB3ZSBoYXZlIHRvIHJlbHkgb24gb25DbGljaywgYmVjYXVzZSBvZiB0aGUgZmFjdCB0aGF0IGV2ZW50cyB0byBjaGVja2JveGVzIGRvbid0IGFwcGVhciB0byB3b3JrXHJcbiAgICAgICAgICogaW4gUG9sbWVyIGF0IGFsbCwgYW5kIHNpbmNlIG9uQ2xpY2sgcnVucyBCRUZPUkUgdGhlIHN0YXRlIGNoYW5nZSBpcyBjb21wbGV0ZWQsIHRoYXQgaXMgdGhlIHJlYXNvbiBmb3IgdGhlXHJcbiAgICAgICAgICogc2lsbHkgbG9va2luZyBhc3luYyB0aW1lciBoZXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdG9nZ2xlTm9kZVNlbCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgdG9nZ2xlQnV0dG9uOiBhbnkgPSB1dGlsLnBvbHlFbG0odWlkICsgXCJfc2VsXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUJ1dHRvbi5ub2RlLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZQYWdlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2SG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlB1YmxpY0hvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHByZWZzLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHByZWZzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DbG9zZUFjY291bnRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xvc2VBY2NvdW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9oIE5vIVwiLCBcIkNsb3NlIHlvdXIgQWNjb3VudD88cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGVsZXRlQWxsVXNlckNvb2tpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DbG9zZUFjY291bnRSZXF1ZXN0LCBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlPihcImNsb3NlQWNjb3VudFwiLCB7fSwgY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJvcHMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJvcHMge1xyXG5cclxuICAgICAgZXhwb3J0IGxldCBvcmRlclByb3BzID0gZnVuY3Rpb24ocHJvcE9yZGVyOiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgICBsZXQgdGFyZ2V0SWR4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcE9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgdGFyZ2V0SWR4ID0gbW92ZU5vZGVQb3NpdGlvbihwcm9wc05ldywgdGFyZ2V0SWR4LCBwcm9wKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBtb3ZlTm9kZVBvc2l0aW9uID0gZnVuY3Rpb24ocHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10sIGlkeDogbnVtYmVyLCB0eXBlTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHByb3BzLmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgcHJvcHMuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIGlkeCsrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBpZHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUb2dnbGVzIGRpc3BsYXkgb2YgcHJvcGVydGllcyBpbiB0aGUgZ3VpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcHNUb2dnbGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICAvLyBzZXREYXRhSWNvblVzaW5nSWQoXCIjZWRpdE1vZGVCdXR0b25cIiwgZWRpdE1vZGUgPyBcImVkaXRcIiA6XHJcbiAgICAgICAgICAgIC8vIFwiZm9yYmlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgICAgIC8vIHZhciBlbG0gPSAkKFwiI3Byb3BzVG9nZ2xlQnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAvLyBlbG0udG9nZ2xlQ2xhc3MoXCJ1aS1pY29uLWdyaWRcIiwgbWV0YTY0LnNob3dQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09IGVkaXQuZWRpdE5vZGUucHJvcGVydGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3BsaWNlIGlzIGhvdyB5b3UgZGVsZXRlIGFycmF5IGVsZW1lbnRzIGluIGpzLlxyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU29ydHMgcHJvcHMgaW5wdXQgYXJyYXkgaW50byB0aGUgcHJvcGVyIG9yZGVyIHRvIHNob3cgZm9yIGVkaXRpbmcuIFNpbXBsZSBhbGdvcml0aG0gZmlyc3QgZ3JhYnMgJ2pjcjpjb250ZW50J1xyXG4gICAgICAgICAqIG5vZGUgYW5kIHB1dHMgaXQgb24gdGhlIHRvcCwgYW5kIHRoZW4gZG9lcyBzYW1lIGZvciAnamN0Q25zdC5UQUdTJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgICAgbGV0IGZ1bmM6RnVuY3Rpb24gPSBtZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jKG5vZGUsIHByb3BzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BzTmV3OiBqc29uLlByb3BlcnR5SW5mb1tdID0gcHJvcHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkeDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHByb3BzTmV3LmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBqY3JDbnN0LkNPTlRFTlQpO1xyXG4gICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wc05ldy5hcnJheU1vdmVJdGVtKHRhZ0lkeCwgdGFyZ2V0SWR4KyspO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YWdJZHggPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5UQUdTKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzTmV3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbCBvciBhIGxpc3Qgb2YgUHJvcGVydHlJbmZvIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHJvcGVydGllcyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFibGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wZXJ0eS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRkOiBzdHJpbmcgPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtbmFtZS1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcGVydHkubmFtZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCaW5hcnlQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBcIltiaW5hcnldXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcmVuZGVyLndyYXBIdG1sKHByb3BlcnR5Lmh0bWxWYWx1ZSA/IHByb3BlcnR5Lmh0bWxWYWx1ZSA6IHByb3BlcnR5LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHByb3BzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRkICs9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS12YWwtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlICs9IHJlbmRlci50YWcoXCJ0clwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1yb3dcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3BlcnR5Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wQ291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwidGFibGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wZXJ0eS10YWJsZVwiXHJcbiAgICAgICAgICAgICAgICB9LCB0YWJsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGJydXRlIGZvcmNlIHNlYXJjaGVzIG9uIG5vZGUgKE5vZGVJbmZvLmphdmEpIG9iamVjdCBwcm9wZXJ0aWVzIGxpc3QsIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBwcm9wZXJ0eVxyXG4gICAgICAgICAqIChQcm9wZXJ0eUluZm8uamF2YSkgd2l0aCBuYW1lIG1hdGNoaW5nIHByb3BlcnR5TmFtZSwgZWxzZSBudWxsLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKToganNvbi5Qcm9wZXJ0eUluZm8ge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucHJvcGVydGllcylcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IG5vZGUucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgPT09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHlWYWwgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBnZXROb2RlUHJvcGVydHkocHJvcGVydHlOYW1lLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3AgPyBwcm9wLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVzIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGRvbid0IGtub3cgd2hvIG93bnMgdGhpcyBub2RlIGFzc3VtZSB0aGUgYWRtaW4gb3ducyBpdC5cclxuICAgICAgICAgICAgaWYgKCFjcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRCeSA9IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyBPUiBjb25kaXRpb24gYmVjYXVzZSBvZiBjcmVhdGVkQnkgaXMgbnVsbCB3ZSBhc3N1bWUgd2UgZG8gbm90IG93biBpdCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9uT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc093bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlIHx8IHByb3BlcnR5LnZhbHVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTE6IG1ha2Ugc3VyZSB0aGlzIHdyYXBIdG1sIGlzbid0IGNyZWF0aW5nIGFuIHVubmVjZXNzYXJ5IERJViBlbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS5odG1sVmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbih2YWx1ZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgJC5lYWNoKHZhbHVlcywgZnVuY3Rpb24oaSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIud3JhcEh0bWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiByZW5kZXIuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBwb3N0VGFyZ2V0VXJsO1xyXG5kZWNsYXJlIHZhciBwcmV0dHlQcmludDtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSByZW5kZXIge1xyXG4gICAgICAgIGxldCBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcbiAgICAgICAgICogd2FudCB0byBnaXZlIHRoZW0gc29tZSBpbnN0cnVjdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIGFkZCBjb250ZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBnZXRFbXB0eVBhZ2VQcm9tcHQgPSBmdW5jdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCaW5hcnkgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhbiBpbWFnZSByZW5kZXIgdGhlIGltYWdlIGRpcmVjdGx5IG9udG8gdGhlIHBhZ2UgYXMgYSB2aXNpYmxlIGltYWdlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZS5iaW5hcnlJc0ltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUltYWdlVGFnKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCBhbiBpbWFnZSB3ZSByZW5kZXIgYSBsaW5rIHRvIHRoZSBhdHRhY2htZW50LCBzbyB0aGF0IGl0IGNhbiBiZSBkb3dubG9hZGVkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5jaG9yOiBzdHJpbmcgPSB0YWcoXCJhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIjogZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSlcclxuICAgICAgICAgICAgICAgIH0sIFwiW0Rvd25sb2FkIEF0dGFjaG1lbnRdXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJiaW5hcnktbGlua1wiXHJcbiAgICAgICAgICAgICAgICB9LCBhbmNob3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudCBsaXR0bGUgbWV0aG9kIGhlcmUuIEFsbCBHVUkgcGFnZS9kaXZzIGFyZSBjcmVhdGVkIHVzaW5nIHRoaXMgc29ydCBvZiBzcGVjaWZpY2F0aW9uIGhlcmUgdGhhdCB0aGV5XHJcbiAgICAgICAgICogYWxsIG11c3QgaGF2ZSBhICdidWlsZCcgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZpcnN0IHRpbWUgb25seSwgYW5kIHRoZW4gdGhlICdpbml0JyBtZXRob2QgY2FsbGVkIGJlZm9yZSBlYWNoXHJcbiAgICAgICAgICogdGltZSB0aGUgY29tcG9uZW50IGdldHMgZGlzcGxheWVkIHdpdGggbmV3IGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgJ2RhdGEnIGlzIHByb3ZpZGVkLCB0aGlzIGlzIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlkUGFnZSA9IGZ1bmN0aW9uKHBnLCBkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRQYWdlOiBwZy5kb21JZD1cIiArIHBnLmRvbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGcuYnVpbHQgfHwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbGQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwZy5idWlsdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwZy5pbml0KSB7XHJcbiAgICAgICAgICAgICAgICBwZy5pbml0KGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkUm93SGVhZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGg6IGJvb2xlYW4sIHNob3dOYW1lOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGVhZGVyVGV4dDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9PTl9ST1dTKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIGZvcm1hdFBhdGgobm9kZSkgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKGNvbW1lbnRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q29tbWVudCBCeTogXCIgKyBjb21tZW50QnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLmNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAobm9kZS5jcmVhdGVkQnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNyZWF0ZWQgQnk6IFwiICsgbm9kZS5jcmVhdGVkQnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGlkPSdvd25lckRpc3BsYXlcIiArIG5vZGUudWlkICsgXCInPjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiICBNb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb24gcm9vdCBub2RlIG5hbWUgd2lsbCBiZSBlbXB0eSBzdHJpbmcgc28gZG9uJ3Qgc2hvdyB0aGF0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIGNvbW1lbnRpbmc6IEkgZGVjaWRlZCB1c2VycyB3aWxsIHVuZGVyc3RhbmQgdGhlIHBhdGggYXMgYSBzaW5nbGUgbG9uZyBlbnRpdHkgd2l0aCBsZXNzIGNvbmZ1c2lvbiB0aGFuXHJcbiAgICAgICAgICAgICAqIGJyZWFraW5nIG91dCB0aGUgbmFtZSBmb3IgdGhlbS4gVGhleSBhbHJlYWR5IHVuc2Vyc3RhbmQgaW50ZXJuZXQgVVJMcy4gVGhpcyBpcyB0aGUgc2FtZSBjb25jZXB0LiBObyBuZWVkXHJcbiAgICAgICAgICAgICAqIHRvIGJhYnkgdGhlbS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlICFzaG93UGF0aCBjb25kaXRpb24gaGVyZSBpcyBiZWNhdXNlIGlmIHdlIGFyZSBzaG93aW5nIHRoZSBwYXRoIHRoZW4gdGhlIGVuZCBvZiB0aGF0IGlzIGFsd2F5cyB0aGVcclxuICAgICAgICAgICAgICogbmFtZSwgc28gd2UgZG9uJ3QgbmVlZCB0byBzaG93IHRoZSBwYXRoIEFORCB0aGUgbmFtZS4gT25lIGlzIGEgc3Vic3RyaW5nIG9mIHRoZSBvdGhlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChzaG93TmFtZSAmJiAhc2hvd1BhdGggJiYgbm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiTmFtZTogXCIgKyBub2RlLm5hbWUgKyBcIiBbdWlkPVwiICsgbm9kZS51aWQgKyBcIl1cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaGVhZGVyLXRleHRcIlxyXG4gICAgICAgICAgICB9LCBoZWFkZXJUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAgICAgKiBwcmV0dGlmaWVyIHRvIHByb2Nlc3MgaXQgdGhlIHJlc3Qgb2YgdGhlIHdheSAod2hlbiB3ZSBjYWxsIHByZXR0eVByaW50KCkgZm9yIHRoZSB3aG9sZSBwYWdlKSB3ZSBub3cgcnVuXHJcbiAgICAgICAgICogYW5vdGhlciBzdGFnZSBvZiB0cmFuc2Zvcm1hdGlvbiB0byBnZXQgdGhlIDxwcmU+IHRhZyBwdXQgaW4gd2l0aCAncHJldHR5cHJpbnQnIGV0Yy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdENvZGVGb3JtYXR0aW5nID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZW50KSByZXR1cm4gY29udGVudDtcclxuICAgICAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAgICAgLy8gYGBganNcclxuICAgICAgICAgICAgLy8gdmFyIHggPSAxMDtcclxuICAgICAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIGlmIChjb250ZW50LmNvbnRhaW5zKFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0U3Vic3RpdHV0aW9ucyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2VBbGwoXCJ7e2xvY2F0aW9uT3JpZ2lufX1cIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMTogbmVlZCB0byBwcm92aWRlIHNvbWUgd2F5IG9mIGhhdmluZyB0aGVzZSBsYW5ndWFnZSB0eXBlcyBjb25maWd1cmFibGUgaW4gYSBwcm9wZXJ0aWVzIGZpbGVcclxuICAgICAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGxhbmdzID0gW1wianNcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGUgY2xhc3M9XFxcIlwiICsgbGFuZ3NbaV0gKyBcIlxcXCI+XCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8P3ByZXR0aWZ5IGxhbmc9XCIgKyBsYW5nc1tpXSArIFwiPz48cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZT5cIiwgXCI8cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZnRlciBhIHByb3BlcnR5LCBvciBub2RlIGlzIHVwZGF0ZWQgKHNhdmVkKSB3ZSBjYW4gbm93IGNhbGwgdGhpcyBtZXRob2QgaW5zdGVhZCBvZiByZWZyZXNoaW5nIHRoZSBlbnRpcmUgcGFnZVxyXG4gICAgICAgIHdoaWNoIGlzIHdoYXQncyBkb25lIGluIG1vc3Qgb2YgdGhlIGFwcCwgd2hpY2ggaXMgbXVjaCBsZXNzIGVmZmljaWVudCBhbmQgc25hcHB5IHZpc3VhbGx5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTm9kZU9uUGFnZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIGxvb2t1cCB1aWQgZnJvbSBOb2RlSW5mby5pZCB0aGVuIHNldCB0aGUgY29udGVudCBvZiB0aGlzIGRpdi5cclxuICAgICAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAvL3RvIHRoZSB2YWx1ZSBmcm9tIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1ldGE2NC5pZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlSWQgXCIgKyBub2RlLmlkICsgXCIgaW4gdWlkIG1hcFwiO1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodWlkICE9IG5vZGUudWlkKSB0aHJvdyBcInVpZCBjaGFuZ2VkIHVuZXhwZWN0bHkgYWZ0ZXIgaW5pdE5vZGVcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAgICAgKiBhcHAgYW5kIGlzIHdoYXQgdGhlIHVzZXIgc2VlcyBjb3ZlcmluZyA5MCUgb2YgdGhlIHNjcmVlbiBtb3N0IG9mIHRoZSB0aW1lLiBUaGUgXCJjb250ZW50KiBub2Rlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMDogUmF0aGVyIHRoYW4gaGF2aW5nIHRoaXMgbm9kZSByZW5kZXJlciBpdHNlbGYgYmUgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyBhbGwgdGhlIGRpZmZlcmVudCB0eXBlc1xyXG4gICAgICAgICAqIG9mIG5vZGVzLCBuZWVkIGEgbW9yZSBwbHVnZ2FibGUgZGVzaWduLCB3aGVyZSByZW5kZWluZyBvZiBkaWZmZXJlbnQgdGhpbmdzIGlzIGRlbGV0YWdlZCB0byBzb21lXHJcbiAgICAgICAgICogYXBwcm9wcmlhdGUgb2JqZWN0L3NlcnZpY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVDb250ZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGgsIHNob3dOYW1lLCByZW5kZXJCaW4sIHJvd1N0eWxpbmcsIHNob3dIZWFkZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSBnZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zaG93TWV0YURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gYnVpbGRSb3dIZWFkZXIobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd1Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVuZGVyQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIE5vZGVzIHRoYXQgaGF2ZSBhIHBsdWdpbi1yZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZnVuYyhub2RlLCByb3dTdHlsaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcHJvcHMucmVuZGVyUHJvcGVydHkoY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gXCI8ZGl2PlwiICsgamNyQ29udGVudCArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnNlcnZlck1hcmtkb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkIHVzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoQWxzbyBuZWVkIHRvIG1ha2UgdGhpcyBhIGNvbmZpZ3VyYWJsZSBvcHRpb24sIGJlY2F1c2Ugb3RoZXIgY2xvbmVzIG9mIG1ldGE2NCBkb24ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3YW50IG15IGdpdGh1YiBsaW5rISlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIGRlY2lkZWQgZm9yIG5vdyBJIGRvbid0IHdhbnQgdG8gc2hvdyB0aGUgZm9yay1tZS1vbi1naXRodWIgaW1hZ2UgYXQgdXBwZXIgcmlnaHQgb2YgYXBwLCBidXQgdW5jb21tZW50aW5nIHRoaXMgbGluZSBpcyBhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoYXQncyByZXF1aXJlZCB0byBicmluZyBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1wiPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZycgY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIitcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSBzcGVudCBob3VycyB0cnlpbmcgdG8gZ2V0IG1hcmtlZC1lbGVtZW50IHRvIHdvcmsuIFVuc3VjY2Vzc2Z1bCBzdGlsbCwgc28gSSBqdXN0IGhhdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogc2VydmVyTWFya2Rvd24gZmxhZyB0aGF0IEkgY2FuIHNldCB0byB0cnVlLCBhbmQgdHVybiB0aGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIG9mZiBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogYWx0ZXJuYXRlIGF0dHJpYnV0ZSB3YXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnQgPSBqY3JDb250ZW50LnJlcGxhY2VBbGwoXCInXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInt7cXVvdH19XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2Rvd249J1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICsgXCInPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwgamNyLWNvbnRlbnQnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPC9kaXY+PC9tYXJrZWQtZWxlbWVudD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwic2NyaXB0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dC9tYXJrZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGlmIChqY3JDb250ZW50Lmxlbmd0aCA+IDApIHsgaWYgKHJvd1N0eWxpbmcpIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLWNvbnRlbnRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBqY3JDb250ZW50KTsgfSBlbHNlIHsgcmV0ICs9IHRhZyhcImRpdlwiLCB7IFwiY2xhc3NcIiA6IFwiamNyLXJvb3QtY29udGVudFwiIH0sIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yIHRoaXMgLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLiBcIjxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCIgKyBqY3JDb250ZW50KTsgfSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiUm9vdCBOb2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXM6IHN0cmluZyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVuZGVyQmluICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmluYXJ5OiBzdHJpbmcgPSByZW5kZXJCaW5hcnkobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgdXNlciBoYXMgcHV0IHt7aW5zZXJ0LWF0dGFjaG1lbnR9fSBpZiB0aGV5IGFyZSB1c2luZyB0aGF0IHRvIG1ha2UgdGhlIGltYWdlIGFwcGVhciBpbiBhIHNwZWNpZmljXHJcbiAgICAgICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChyZXQuY29udGFpbnMoY25zdC5JTlNFUlRfQVRUQUNITUVOVCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQucmVwbGFjZUFsbChjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gYmluYXJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnczogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuVEFHUywgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidGFncy1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiVGFnczogXCIgKyB0YWdzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKGpzb25Db250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjogXCIgKyBqc29uQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdDogYW55W10gPSBKU09OLnBhcnNlKGpzb25Db250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN5c3RlbUZpbGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LCBlbnRyeS5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbE9wZW5MaW5rID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IFwibTY0Lm1ldGE2NC5vcGVuU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiTG9jYWwgT3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRvd25sb2FkTGluayA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9oYXZlbid0IGltcGxlbWVudGVkIGRvd25sb2FkIGNhcGFiaWxpdHkgeWV0LlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwib25jbGlja1wiOiBcIm02NC5tZXRhNjQuZG93bmxvYWRTeXN0ZW1GaWxlKCdcIiArIGVudHJ5LmZpbGVOYW1lICsgXCInKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSwgXCJEb3dubG9hZFwiKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua3NEaXYgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGxvY2FsT3BlbkxpbmsgKyBkb3dubG9hZExpbmspO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmlsZU5hbWVEaXYgKyBsaW5rc0Rpdik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kUmVUaHJvdyhcInJlbmRlciBmYWlsZWRcIiwgZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJbcmVuZGVyIGZhaWxlZF1cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBwcmltYXJ5IG1ldGhvZCBmb3IgcmVuZGVyaW5nIGVhY2ggbm9kZSAobGlrZSBhIHJvdykgb24gdGhlIG1haW4gSFRNTCBwYWdlIHRoYXQgZGlzcGxheXMgbm9kZVxyXG4gICAgICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBub2RlLnVpZDtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDE7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IGluZGV4IDwgY291bnQgLSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSBlZGl0aW5nQWxsb3dlZD1cIitlZGl0aW5nQWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICAgICAqIGNsaWNrZWQgb24gZm9yIHRoaXMgcGFnZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAgICAgLy8gK1wiXT09W1wiKyBub2RlLmlkICsgXCJdXCIpXHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXJIdG1sUmV0OiBzdHJpbmcgPSBtYWtlUm93QnV0dG9uQmFySHRtbChub2RlLCBjYW5Nb3ZlVXAsIGNhbk1vdmVEb3duLCBlZGl0aW5nQWxsb3dlZCk7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dOb2RlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aC5zdHJpcElmU3RhcnRzV2l0aChcIi9yb290XCIpO1xyXG4gICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyBwYXRoO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwiamNyOnV1aWRcIiwgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobWVzc2FnZSwgXCJVUkwgb2YgTm9kZVwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUb3BSaWdodEltYWdlVGFnID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWdUYWc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh0b3BSaWdodEltZykge1xyXG4gICAgICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0b3AtcmlnaHQtaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BSaWdodEltZ1RhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZzogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcubm9kZS5ia2cnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgICAgICBia2dJbWdTdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgYmtnSW1nICsgXCIpO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBia2dJbWdTdHlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvdyBcIiArIGNsYXNzZXNcclxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBzZWxCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZVVwQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIG5vZGUudWlkICsgXCInKTtcIiAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYub3Blbk5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgICAgICogaW50ZWxsaWdlbmNlIHRvIHdoZW4gdG8gc2hvdyB0aGVzZSBidXR0b25zIG9yIG5vdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvL3BhZGRpbmcgaXMgYSBiYWNrIGhhY2sgdG8gbWFrZSBjaGVja2JveCBsaW5lIHVwIHdpdGggb3RoZXIgaWNvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL1wiaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0Lmluc2VydE5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy11cHdhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZVVwKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhZGROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gbWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VIb3Jpem9udGFsRmllbGRTZXQgPSBmdW5jdGlvbihjb250ZW50Pzogc3RyaW5nLCBleHRyYUNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCIgKyAoZXh0cmFDbGFzc2VzID8gKFwiIFwiICsgZXh0cmFDbGFzc2VzKSA6IFwiXCIpXHJcbiAgICAgICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcnpDb250cm9sR3JvdXAgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUmFkaW9CdXR0b24gPSBmdW5jdGlvbihsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkXHJcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBub2RlSWQgKHNlZSBtYWtlTm9kZUlkKCkpIE5vZGVJbmZvIG9iamVjdCBoYXMgJ2hhc0NoaWxkcmVuJyB0cnVlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSGFzQ2hpbGRyZW4gPSBmdW5jdGlvbih1aWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIG5vZGVIYXNDaGlsZHJlbjogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZm9ybWF0UGF0aCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgaW5qZWN0IHNwYWNlIGluIGhlcmUgc28gdGhpcyBzdHJpbmcgY2FuIHdyYXAgYW5kIG5vdCBhZmZlY3Qgd2luZG93IHNpemVzIGFkdmVyc2VseSwgb3IgbmVlZCBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZUFsbChcIi9cIiwgXCIgLyBcIik7XHJcbiAgICAgICAgICAgIGxldCBzaG9ydFBhdGg6IHN0cmluZyA9IHBhdGgubGVuZ3RoIDwgNTAgPyBwYXRoIDogcGF0aC5zdWJzdHJpbmcoMCwgNDApICsgXCIuLi5cIjtcclxuXHJcbiAgICAgICAgICAgIGxldCBub1Jvb3RQYXRoOiBzdHJpbmcgPSBzaG9ydFBhdGg7XHJcbiAgICAgICAgICAgIGlmIChub1Jvb3RQYXRoLnN0YXJ0c1dpdGgoXCIvcm9vdFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBzaG9ydFBhdGggOiBub1Jvb3RQYXRoO1xyXG4gICAgICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JhcEh0bWwgPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlbmRlcnMgcGFnZSBhbmQgYWx3YXlzIGFsc28gdGFrZXMgY2FyZSBvZiBzY3JvbGxpbmcgdG8gc2VsZWN0ZWQgbm9kZSBpZiB0aGVyZSBpcyBvbmUgdG8gc2Nyb2xsIHRvXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQYWdlRnJvbURhdGEgPSBmdW5jdGlvbihkYXRhPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibTY0LnJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKFwiTm8gY29udGVudCBpcyBhdmFpbGFibGUgaGVyZS5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudWlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZGVudFRvVWlkTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEknbSBjaG9vc2luZyB0byByZXNldCBzZWxlY3RlZCBub2RlcyB3aGVuIGEgbmV3IHBhZ2UgbG9hZHMsIGJ1dCB0aGlzIGlzIG5vdCBhIHJlcXVpcmVtZW50LiBJIGp1c3RcclxuICAgICAgICAgICAgICAgICAqIGRvbid0IGhhdmUgYSBcImNsZWFyIHNlbGVjdGlvbnNcIiBmZWF0dXJlIHdoaWNoIHdvdWxkIGJlIG5lZWRlZCBzbyB1c2VyIGhhcyBhIHdheSB0byBjbGVhciBvdXQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUoZGF0YS5ub2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzID8gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgb3V0cHV0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOT1RFOiBtYWluTm9kZUNvbnRlbnQgaXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYWdlIGNvbnRlbnQsIGFuZCBpcyBhbHdheXMgdGhlIG5vZGUgZGlzcGxheWVkIGF0IHRoZSB0b1xyXG4gICAgICAgICAgICAgKiBvZiB0aGUgcGFnZSBhYm92ZSBhbGwgdGhlIG90aGVyIG5vZGVzIHdoaWNoIGFyZSBpdHMgY2hpbGQgbm9kZXMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbWFpbk5vZGVDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluTm9kZUNvbnRlbnQ6IFwiK21haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWFpbk5vZGVDb250ZW50Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbkJhcjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkQ29tbWVudE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKGRhdGEubm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkTm9kZT1cIitwcm9wcy5pc05vbk93bmVkTm9kZShkYXRhLm5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJ1wiICsgZGF0YS5ub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9pY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJpZFwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJ1bkVkaXROb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcm93SGVhZGVyID0gYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgLy8gJCgnI21haW5Ob2RlQ29udGVudCcpLmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd0NvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkQ291bnQ6IG51bWJlciA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGlsZENvdW50OiBcIiArIGNoaWxkQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb25cclxuICAgICAgICAgICAgICAgICAqIHRoZSBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBkYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3c6IHN0cmluZyA9IGdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSByb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvd0NvdW50ID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gZ2V0RW1wdHlQYWdlUHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIG91dHB1dCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmNvZGVGb3JtYXREaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcImFcIikuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFRPRE8tMzogSW5zdGVhZCBvZiBjYWxsaW5nIHNjcmVlblNpemVDaGFuZ2UgaGVyZSBpbW1lZGlhdGVseSwgaXQgd291bGQgYmUgYmV0dGVyIHRvIHNldCB0aGUgaW1hZ2Ugc2l6ZXNcclxuICAgICAgICAgICAgICogZXhhY3RseSBvbiB0aGUgYXR0cmlidXRlcyBvZiBlYWNoIGltYWdlLCBhcyB0aGUgSFRNTCB0ZXh0IGlzIHJlbmRlcmVkIGJlZm9yZSB3ZSBldmVuIGNhbGxcclxuICAgICAgICAgICAgICogc2V0SHRtbCwgc28gdGhhdCBpbWFnZXMgYWx3YXlzIGFyZSBHVUFSQU5URUVEIHRvIHJlbmRlciBjb3JyZWN0bHkgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuc2NyZWVuU2l6ZUNoYW5nZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCkpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJvdyA9IGZ1bmN0aW9uKGk6IG51bWJlciwgbm9kZToganNvbi5Ob2RlSW5mbywgbmV3RGF0YTogYm9vbGVhbiwgY2hpbGRDb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGp1c3RJbWFnZVNpemUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBlbG0uYXR0cihcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2hpY2ggd2Ugd2FudCwgYnV0IHRoZW4gd2UgYWxzbyBsaW1pdCBpdCB3aXRoIG1heC13aWR0aCBzbyBvbiBzbWFsbGVyIHNjcmVlbiBkZXZpY2VzIG9yIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIERPIE5PVCBERUxFVEUgKGZvciBhIGxvbmcgdGltZSBhdCBsZWFzdCkgVGhpcyBpcyB0aGUgb2xkIGxvZ2ljIGZvciByZXNpemluZyBpbWFnZXMgcmVzcG9uc2l2ZWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPVxcXCJcIiArIHYgKyBcIlxcXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiPlwiICsgY29udGVudCArIFwiPC9cIiArIHRhZyArIFwiPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IFwiLz5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVRleHRBcmVhID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlRWRpdEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUGFzc3dvcmRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmliczogT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGRvbUlkIGlzIGlkIG9mIGRpYWxvZyBiZWluZyBjbG9zZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQmFja0J1dHRvbiA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgZG9tSWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5jYW5jZWxEaWFsb2coJ1wiICsgZG9tSWQgKyBcIicpO1wiICsgY2FsbGJhY2tcclxuICAgICAgICAgICAgfSwgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93UHJvcGVydHlUb0Rpc3BsYXkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0W3Byb3BOYW1lXSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1JlYWRPbmx5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0JpbmFyeVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmJpbmFyeVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IFwic2ltcGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2guanNcIik7XHJcblxyXG4vKlxyXG4gKiB0b2RvLTM6IHRyeSB0byByZW5hbWUgdG8gJ3NlYXJjaCcsIGJ1dCByZW1lbWJlciB5b3UgaGFkIGluZXhwbGlhYmxlIHByb2JsZW1zIHRoZSBmaXJzdCB0aW1lIHlvdSB0cmllZCB0byB1c2UgJ3NlYXJjaCdcclxuICogYXMgdGhlIHZhciBuYW1lLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNyY2gge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudW1TZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoICE9IG51bGwgPyAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCB0aW1lbGluZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeUNyZWF0ZVRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkNSRUFURUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogbnVsbFxyXG4gICAgICAgICAgICB9LCB0aW1lbGluZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdFNlYXJjaE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIG5vZGUudWlkID0gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKTtcclxuICAgICAgICAgICAgdWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2UgPSBmdW5jdGlvbihkYXRhLCB2aWV3TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZENvdW50ID0gZGF0YS5zZWFyY2hSZXN1bHRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb24gdGhlXHJcbiAgICAgICAgICAgICAqIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdFNlYXJjaE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgICAgIG91dHB1dCArPSByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtKG5vZGUsIGksIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodmlld05hbWUsIG91dHB1dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlbmRlcnMgYSBzaW5nbGUgbGluZSBvZiBzZWFyY2ggcmVzdWx0cyBvbiB0aGUgc2VhcmNoIHJlc3VsdHMgcGFnZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlLCBpbmRleCwgY291bnQsIHJvd0NvdW50KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdWlkID0gbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyU2VhcmNoUmVzdWx0OiBcIiArIHVpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSB3aXRoIGlkOiBcIiArY3NzSWQpXHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFySHRtbCA9IG1ha2VCdXR0b25CYXJIdG1sKFwiXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidXR0b25CYXJIdG1sPVwiICsgYnV0dG9uQmFySHRtbCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5vZGUtdGFibGUtcm93IGluYWN0aXZlLXJvd1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnNyY2guY2xpY2tPblNlYXJjaFJlc3VsdFJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXJIdG1sLy9cclxuICAgICAgICAgICAgICAgICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9zcmNoX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfSwgY29udGVudCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKHVpZCkge1xyXG4gICAgICAgICAgICB2YXIgZ290b0J1dHRvbiA9IHJlbmRlci5tYWtlQnV0dG9uKFwiR28gdG8gTm9kZVwiLCB1aWQsIFwibTY0LnNyY2guY2xpY2tTZWFyY2hOb2RlKCdcIiArIHVpZCArIFwiJyk7XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoZ290b0J1dHRvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25TZWFyY2hSZXN1bHRSb3cgPSBmdW5jdGlvbihyb3dFbG0sIHVpZCkge1xyXG4gICAgICAgICAgICB1bmhpZ2hsaWdodFJvdygpO1xyXG4gICAgICAgICAgICBoaWdobGlnaHRSb3dOb2RlID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImluYWN0aXZlLXJvd1wiLCBcImFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrU2VhcmNoTm9kZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHVwZGF0ZSBoaWdobGlnaHQgbm9kZSB0byBwb2ludCB0byB0aGUgbm9kZSBjbGlja2VkIG9uLCBqdXN0IHRvIHBlcnNpc3QgaXQgZm9yIGxhdGVyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzcmNoLmhpZ2hsaWdodFJvd05vZGUgPSBzcmNoLnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIXNyY2guaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCB1aWQgaW4gc2VhcmNoIHJlc3VsdHM6IFwiICsgdWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCwgdHJ1ZSwgc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gc3R5bGluZyBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1bmhpZ2hsaWdodFJvdyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgdmFyIG5vZGVJZCA9IGhpZ2hsaWdodFJvd05vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgLyogY2hhbmdlIGNsYXNzIG9uIGVsZW1lbnQgKi9cclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiYWN0aXZlLXJvd1wiLCBcImluYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzaGFyZS5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzaGFyZSB7XHJcblxyXG4gICAgICAgIGxldCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaGFyaW5nTm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSGFuZGxlcyAnU2hhcmluZycgYnV0dG9uIG9uIGEgc3BlY2lmaWMgbm9kZSwgZnJvbSBidXR0b24gYmFyIGFib3ZlIG5vZGUgZGlzcGxheSBpbiBlZGl0IG1vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlU2hhcmluZyA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaGFyaW5nTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZpbmRTaGFyZWROb2RlcyA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGZvY3VzTm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9jdXNOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hQYWdlVGl0bGUgPSBcIlNoYXJlZCBOb2Rlc1wiO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2hhcmVkTm9kZXNSZXF1ZXN0LCBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2U+KFwiZ2V0U2hhcmVkTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZm9jdXNOb2RlLmlkXHJcbiAgICAgICAgICAgIH0sIGZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXNlci5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB1c2VyIHtcclxuXHJcbiAgICAgICAgbGV0IGxvZ291dFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ291dFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCBJIHdhbnQgdG8gYWxsb3cgY2VydGFpbiB1c2VycyBhZGRpdGlvbmFsIHByaXZpbGVnZXMuIEEgYml0IG9mIGEgaGFjayBiZWNhdXNlIGl0IHdpbGwgZ29cclxuICAgICAgICAgKiBpbnRvIHByb2R1Y3Rpb24sIGJ1dCBvbiBteSBvd24gcHJvZHVjdGlvbiB0aGVzZSBhcmUgbXkgXCJ0ZXN0VXNlckFjY291bnRzXCIsIHNvIG5vIHJlYWwgdXNlciB3aWxsIGJlIGFibGUgdG9cclxuICAgICAgICAgKiB1c2UgdGhlc2UgbmFtZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzVGVzdFVzZXJBY2NvdW50ID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhZGFtXCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImJvYlwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJjb3J5XCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRhblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcyk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBCUkFORElOR19USVRMRV9TSE9SVDtcclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMDogSWYgdXNlcnMgZ28gd2l0aCB2ZXJ5IGxvbmcgdXNlcm5hbWVzIHRoaXMgaXMgZ29ubmEgYmUgdWdseSAqL1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSArPSBcIjpcIiArIHJlcy51c2VyTmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcIiNoZWFkZXJBcHBOYW1lXCIpLmh0bWwodGl0bGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVE9ETy0zOiBtb3ZlIHRoaXMgaW50byBtZXRhNjQgbW9kdWxlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAocmVzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVJZCA9IHJlcy5yb290Tm9kZS5pZDtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZVBhdGggPSByZXMucm9vdE5vZGUucGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRhNjQudXNlck5hbWUgPSByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pc0FkbWluVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhZG1pblwiO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBbm9uVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICAgICAgbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlID0gcmVzLmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgICAgICBtZXRhNjQuYWxsb3dGaWxlU3lzdGVtU2VhcmNoID0gcmVzLmFsbG93RmlsZVN5c3RlbVNlYXJjaDtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMgPSByZXMudXNlclByZWZlcmVuY2VzO1xyXG4gICAgICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5zaG93TWV0YURhdGE7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gc2VydmVyOiBtZXRhNjQuZWRpdE1vZGVPcHRpb249XCIgKyBtZXRhNjQuZWRpdE1vZGVPcHRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuU2lnbnVwUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBTaWdudXBEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogV3JpdGUgYSBjb29raWUgdGhhdCBleHBpcmVzIGluIGEgeWVhciBmb3IgYWxsIHBhdGhzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cml0ZUNvb2tpZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbCk6IHZvaWQge1xyXG4gICAgICAgICAgICAkLmNvb2tpZShuYW1lLCB2YWwsIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgdWdseS4gSXQgaXMgdGhlIGJ1dHRvbiB0aGF0IGNhbiBiZSBsb2dpbiAqb3IqIGxvZ291dC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Mb2dpblBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsb2dpbkRsZzogTG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcucG9wdWxhdGVGcm9tQ29va2llcygpO1xyXG4gICAgICAgICAgICBsb2dpbkRsZy5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hMb2dpbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbGxVc3I6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IGNhbGxQd2Q6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IHVzaW5nQ29va2llczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxvZ2luU2Vzc2lvblJlYWR5ID0gJChcIiNsb2dpblNlc3Npb25SZWFkeVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gdHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHVzaW5nQ29va2llcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsb2dpblN0YXRlOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgd2UgaGF2ZSBrbm93biBzdGF0ZSBhcyBsb2dnZWQgb3V0LCB0aGVuIGRvIG5vdGhpbmcgaGVyZSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luU3RhdGUgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXNyOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB3ZDogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvb2tpZVVzZXI9XCIgKyB1c3IgKyBcIiB1c2luZ0Nvb2tpZXMgPSBcIiArIHVzaW5nQ29va2llcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IHVzciA/IHVzciA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4gd2l0aCBuYW1lOiBcIiArIGNhbGxVc3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiBjYWxsVXNyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogY2FsbFB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgY2FsbFVzciwgY2FsbFB3ZCwgdXNpbmdDb29raWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ291dCA9IGZ1bmN0aW9uKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9nb3V0UmVxdWVzdCwganNvbi5Mb2dvdXRSZXNwb25zZT4oXCJsb2dvdXRcIiwge30sIGxvZ291dFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW4gPSBmdW5jdGlvbihsb2dpbkRsZywgdXNyLCBwd2QpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c3IsXHJcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IHB3ZCxcclxuICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgdXNyLCBwd2QsIG51bGwsIGxvZ2luRGxnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUFsbFVzZXJDb29raWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uTG9naW5SZXNwb25zZSwgdXNyPzogc3RyaW5nLCBwd2Q/OiBzdHJpbmcsIHVzaW5nQ29va2llcz86IGJvb2xlYW4sIGxvZ2luRGxnPzogTG9naW5EbGcpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTG9naW5cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpblJlc3BvbnNlOiB1c3I9XCIgKyB1c3IgKyBcIiBob21lTm9kZU92ZXJyaWRlOiBcIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodXNyICE9IFwiYW5vbnltb3VzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IsIHVzcik7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdELCBwd2QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5EbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlOiBcIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlIGlzIG51bGwuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIHNldCBJRCB0byBiZSB0aGUgcGFnZSB3ZSB3YW50IHRvIHNob3cgdXNlciByaWdodCBhZnRlciBsb2dpbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdXRpbC5lbXB0eVN0cmluZyhyZXMuaG9tZU5vZGVPdmVycmlkZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVPdmVycmlkZT1cIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBsYXN0Tm9kZT1cIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlSWQ9XCIgKyBtZXRhNjQuaG9tZU5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoaWQsIGZhbHNlLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiQ29va2llIGxvZ2luIGZhaWxlZC5cIikpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBibG93IGF3YXkgZmFpbGVkIGNvb2tpZSBjcmVkZW50aWFscyBhbmQgcmVsb2FkIHBhZ2UsIHNob3VsZCByZXN1bHQgaW4gYnJhbmQgbmV3IHBhZ2UgbG9hZCBhcyBhbm9uXHJcbiAgICAgICAgICAgICAgICAgICAgICogdXNlci5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVzIGlzIEpTT04gcmVzcG9uc2Ugb2JqZWN0IGZyb20gc2VydmVyLlxyXG4gICAgICAgIGxldCByZWZyZXNoTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luUmVzcG9uc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHVzZXIuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdmlldy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB2aWV3IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlU3RhdHVzQmFyID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXR1c0xpbmUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCIgU2VsZWN0aW9uczogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQobWV0YTY0LnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIHBhcmFtZXRlciB3aGljaCwgaWYgc3VwcGxpZWQsIHNob3VsZCBiZSB0aGUgaWQgd2Ugc2Nyb2xsIHRvIHdoZW4gZmluYWxseSBkb25lIHdpdGggdGhlXHJcbiAgICAgICAgICogcmVuZGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCB0YXJnZXRJZD86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBhbmQgaWYgc3BlY2lmaWVkIG1ha2VzIHRoZSBwYWdlIHNjcm9sbCB0byBhbmQgaGlnaGxpZ2h0IHRoYXQgbm9kZSB1cG9uIHJlLXJlbmRlcmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlID0gZnVuY3Rpb24obm9kZUlkPzogYW55LCByZW5kZXJQYXJlbnRJZkxlYWY/OiBhbnksIGhpZ2hsaWdodElkPzogYW55LCBpc0luaXRpYWxSZW5kZXI/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0SWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gY3VycmVudFNlbE5vZGUgIT0gbnVsbCA/IGN1cnJlbnRTZWxOb2RlLmlkIDogbm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IHJlbmRlclBhcmVudElmTGVhZiA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoVHJlZVJlc3BvbnNlKHJlcywgaGlnaGxpZ2h0SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0luaXRpYWxSZW5kZXIgJiYgbWV0YTY0LnVybENtZCA9PSBcImFkZE5vZGVcIiAmJiBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuZWRpdE1vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG1ldGE2NC5jdXJyZW50Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAgICAgKiBzY3JvbGxUb1RvcCwgYW5kIHRoZW4gc29tZSBvdGhlciBjb2RlIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyBsb2NhdGlvbiBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyLiB0aGVcclxuICAgICAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsbTogYW55ID0gbmF2LmdldFNlbGVjdGVkUG9seUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdG9kby0wOiByZW1vdmVkIG1haW5QYXBlclRhYnMgZnJvbSB2aXNpYmlsaXR5LCBidXQgd2hhdCBjb2RlIHNob3VsZCBnbyBoZXJlIG5vdz9cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IFRoZSBmb2xsb3dpbmcgd2FzIGluIGEgcG9seW1lciBleGFtcGxlIChjYW4gSSB1c2UgdGhpcz8pOiBhcHAuJC5oZWFkZXJQYW5lbE1haW4uc2Nyb2xsVG9Ub3AodHJ1ZSk7XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogbm90IHVzaW5nIG1haW5QYXBlclRhYnMgYW55IGxvbmdlciBzbyBzaHcgc2hvdWxkIGdvIGhlcmUgbm93ID9cclxuICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgIGxldCBlbG06IGFueSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRFZGl0UGF0aERpc3BsYXlCeUlkID0gZnVuY3Rpb24oZG9tSWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGVkaXQuZWRpdE5vZGU7XHJcbiAgICAgICAgICAgIGxldCBlOiBhbnkgPSAkKFwiI1wiICsgZG9tSWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGUuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgICAgIGUuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhEaXNwbGF5ID0gXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMjogRG8gd2UgcmVhbGx5IG5lZWQgSUQgaW4gYWRkaXRpb24gdG8gUGF0aCBoZXJlP1xyXG4gICAgICAgICAgICAgICAgLy8gcGF0aERpc3BsYXkgKz0gXCI8YnI+SUQ6IFwiICsgbm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGlzcGxheSArPSBcIjxicj5Nb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwocGF0aERpc3BsYXkpO1xyXG4gICAgICAgICAgICAgICAgZS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1NlcnZlckluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2VydmVySW5mb1JlcXVlc3QsIGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlPihcImdldFNlcnZlckluZm9cIiwge30sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhyZXMuc2VydmVySW5mbykpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1lbnVQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZW51UGFuZWwge1xyXG5cclxuICAgICAgICBsZXQgbWFrZVRvcExldmVsTWVudSA9IGZ1bmN0aW9uKHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGFwZXJJdGVtQXR0cnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzczogXCJtZW51LXRyaWdnZXJcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcGVySXRlbSA9IHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHBhcGVySXRlbUF0dHJzLCB0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFwZXJTdWJtZW51QXR0cnMgPSB7XHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IHRpdGxlLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICAgICAgKDxhbnk+cGFwZXJTdWJtZW51QXR0cnMpLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItc3VibWVudVwiLCBwYXBlclN1Ym1lbnVBdHRyc1xyXG4gICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAvL1wibGFiZWxcIjogdGl0bGUsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZXRhNjQtbWVudS1oZWFkaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdFwiXHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgICwgcGFwZXJJdGVtICsgLy9cIjxwYXBlci1pdGVtIGNsYXNzPSdtZW51LXRyaWdnZXInPlwiICsgdGl0bGUgKyBcIjwvcGFwZXItaXRlbT5cIiArIC8vXHJcbiAgICAgICAgICAgICAgICBtYWtlU2Vjb25kTGV2ZWxMaXN0KGNvbnRlbnQpLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtYWtlU2Vjb25kTGV2ZWxMaXN0ID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1tZW51XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdCBteS1tZW51LXNlY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgICAgICAvLyxcclxuICAgICAgICAgICAgICAgIC8vXCJtdWx0aVwiOiBcIm11bHRpXCJcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWVudUl0ZW0gPSBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9uQ2xpY2s6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IG9uQ2xpY2ssXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkb21JZDogc3RyaW5nID0gXCJtYWluQXBwTWVudVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvLyBJIGVuZGVkIHVwIG5vdCByZWFsbHkgbGlraW5nIHRoaXMgd2F5IG9mIHNlbGVjdGluZyB0YWJzLiBJIGNhbiBqdXN0IHVzZSBub3JtYWwgcG9seW1lciB0YWJzLlxyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIk1haW5cIiwgXCJtYWluUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdtYWluVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcInNlYXJjaFBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYignc2VhcmNoVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlRpbWVsaW5lXCIsIFwidGltZWxpbmVQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ3RpbWVsaW5lVGFiTmFtZScpO1wiKTtcclxuICAgICAgICAgICAgLy8gdmFyIHBhZ2VNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlBhZ2VcIiwgcGFnZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnNzSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGZWVkc1wiLCBcIm1haW5NZW51UnNzXCIsIFwibTY0Lm5hdi5vcGVuUnNzRmVlZHNOb2RlKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVSc3MgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUlNTXCIsIHJzc0l0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZGl0TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlXCIsIFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBcIm02NC5lZGl0LmNyZWF0ZU5vZGUoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgXCIobmV3IG02NC5SZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGVcIiwgXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2xlYXIgU2VsZWN0aW9uc1wiLCBcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCBcIm02NC5lZGl0LmNsZWFyU2VsZWN0aW9ucygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IG02NC5JbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IG02NC5FeHBvcnREbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkVkaXRcIiwgZWRpdE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkN1dFwiLCBcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlBhc3RlXCIsIFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5maW5pc2hNb3ZpbmdTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwXCIsIFwibW92ZU5vZGVVcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVXAoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEb3duXCIsIFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVEb3duKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gVG9wXCIsIFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVG9Ub3AoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBCb3R0b21cIiwgXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb0JvdHRvbSgpO1wiKTsvL1xyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiTW92ZVwiLCBtb3ZlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gRmlsZVwiLCBcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21GaWxlRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCBcIm02NC5hdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tVXJsRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcIm02NC5hdHRhY2htZW50LmRlbGV0ZUF0dGFjaG1lbnQoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBdHRhY2hcIiwgYXR0YWNobWVudE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkVkaXQgTm9kZSBTaGFyaW5nXCIsIFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsIFwibTY0LnNoYXJlLmVkaXROb2RlU2hhcmluZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwibTY0LnNoYXJlLmZpbmRTaGFyZWROb2RlcygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIHNoYXJpbmdNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNoYXJlXCIsIHNoYXJpbmdNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNvbnRlbnRcIiwgXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IG1ha2UgYSB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgdGhhdCBkb2VzIGEgdGFnIHNlYXJjaFxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJUYWdzXCIsIFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoVGFnc0RsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmlsZXNcIiwgXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoRmlsZXNEbGcodHJ1ZSkpLm9wZW4oKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTZWFyY2hcIiwgc2VhcmNoTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNyZWF0ZWRcIiwgXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgXCJtNjQuc3JjaC50aW1lbGluZUJ5Q3JlYXRlVGltZSgpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTW9kaWZpZWRcIiwgXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeU1vZFRpbWUoKTtcIik7Ly9cclxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJUaW1lbGluZVwiLCB0aW1lbGluZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJUb2dnbGUgUHJvcGVydGllc1wiLCBcInByb3BzVG9nZ2xlQnV0dG9uXCIsIFwibTY0LnByb3BzLnByb3BzVG9nZ2xlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUmVmcmVzaFwiLCBcInJlZnJlc2hQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5yZWZyZXNoKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiU2hvdyBVUkxcIiwgXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgXCJtNjQucmVuZGVyLnNob3dOb2RlVXJsKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUHJlZmVyZW5jZXNcIiwgXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgXCIobmV3IG02NC5QcmVmc0RsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBidWc6IHNlcnZlciBpbmZvIG1lbnUgaXRlbSBpcyBzaG93aW5nIHVwIChhbHRob3VnaCBjb3JyZWN0bHkgZGlzYWJsZWQpIGZvciBub24tYWRtaW4gdXNlcnMuXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNlcnZlciBJbmZvXCIsIFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgXCJtNjQudmlldy5zaG93U2VydmVySW5mbygpO1wiKTsgLy9cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJWaWV3XCIsIHZpZXdPcHRpb25zTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHdoYXRldmVyIGlzIGNvbW1lbnRlZCBpcyBvbmx5IGNvbW1lbnRlZCBmb3IgcG9seW1lciBjb252ZXJzaW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgbXlBY2NvdW50SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZFBnQnV0dG9uXCIsIFwiKG5ldyBtNjQuQ2hhbmdlUGFzc3dvcmREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1hbmFnZSBBY2NvdW50XCIsIFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCBcIihuZXcgbTY0Lk1hbmFnZUFjY291bnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkluc2VydCBCb29rOiBXYXIgYW5kIFBlYWNlXCIsIFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIFwibTY0LmVkaXQuaW5zZXJ0Qm9va1dhckFuZFBlYWNlKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICAvLyBtZW51SXRlbShcIkZ1bGwgUmVwb3NpdG9yeSBFeHBvcnRcIiwgXCJmdWxsUmVwb3NpdG9yeUV4cG9ydFwiLCBcIlxyXG4gICAgICAgICAgICAvLyBlZGl0LmZ1bGxSZXBvc2l0b3J5RXhwb3J0KCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQWNjb3VudFwiLCBteUFjY291bnRJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRtaW5JdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkdlbmVyYXRlIFJTU1wiLCBcImdlbmVyYXRlUlNTQnV0dG9uXCIsIFwibTY0LnBvZGNhc3QuZ2VuZXJhdGVSU1MoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBhZG1pbk1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQWRtaW5cIiwgYWRtaW5JdGVtcywgXCJhZG1pbk1lbnVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVscEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFpbiBNZW51IEhlbHBcIiwgXCJtYWluTWVudUhlbHBcIiwgXCJtNjQubmF2Lm9wZW5NYWluTWVudUhlbHAoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudUhlbHAgPSBtYWtlVG9wTGV2ZWxNZW51KFwiSGVscC9Eb2NzXCIsIGhlbHBJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IC8qIHBhZ2VNZW51KyAqLyBtYWluTWVudVJzcyArIGVkaXRNZW51ICsgbW92ZU1lbnUgKyBhdHRhY2htZW50TWVudSArIHNoYXJpbmdNZW51ICsgdmlld09wdGlvbnNNZW51ICsgc2VhcmNoTWVudSArIHRpbWVsaW5lTWVudSArIG15QWNjb3VudE1lbnVcclxuICAgICAgICAgICAgICAgICsgYWRtaW5NZW51ICsgbWFpbk1lbnVIZWxwO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGRvbUlkLCBjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcG9kY2FzdC5qc1wiKTtcblxuLypcbk5PVEU6IFRoZSBBdWRpb1BsYXllckRsZyBBTkQgdGhpcyBzaW5nbGV0b24taXNoIGNsYXNzIGJvdGggc2hhcmUgc29tZSBzdGF0ZSBhbmQgY29vcGVyYXRlXG5cblJlZmVyZW5jZTogaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxuKi9cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2UgcG9kY2FzdCB7XG4gICAgICAgIGV4cG9ydCBsZXQgcGxheWVyOiBhbnkgPSBudWxsO1xuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlciA9IG51bGw7XG5cbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xuICAgICAgICBsZXQgYWRTZWdtZW50czogQWRTZWdtZW50W10gPSBudWxsO1xuXG4gICAgICAgIGxldCBwdXNoVGltZXI6IGFueSA9IG51bGw7XG5cbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJTUyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2VuZXJhdGVSU1NSZXF1ZXN0LCBqc29uLkdlbmVyYXRlUlNTUmVzcG9uc2U+KFwiZ2VuZXJhdGVSU1NcIiwge1xuICAgICAgICAgICAgfSwgZ2VuZXJhdGVSU1NSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ2VuZXJhdGVSU1NSZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgYWxlcnQoJ3JzcyBjb21wbGV0ZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWRUaXRsZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCBkZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkRGVzY1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCBpbWdVcmw6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWRJbWFnZVVybFwiLCBub2RlKTtcblxuICAgICAgICAgICAgbGV0IGZlZWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgdGl0bGUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCBkZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgZmVlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZlZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW1nVXJsKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWF4LXdpZHRoOiAyMDBweDtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogaW1nVXJsLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgbGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAobGluayAmJiBsaW5rLnZhbHVlICYmIGxpbmsudmFsdWUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcIi5tcDNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluay52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHVyaToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLCBub2RlKTtcbiAgICAgICAgICAgIGlmICh1cmkgJiYgdXJpLnZhbHVlICYmIHVyaS52YWx1ZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cmkudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBlbmNVcmw6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1FbmNVcmxcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAoZW5jVXJsICYmIGVuY1VybC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBlbmNUeXBlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRW5jVHlwZVwiLCBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZW5jVHlwZSAmJiBlbmNUeXBlLnZhbHVlICYmIGVuY1R5cGUudmFsdWUuc3RhcnRzV2l0aChcImF1ZGlvL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jVXJsLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckl0ZW1Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzRGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbURlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzQXV0aG9yOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc0xpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc1VyaToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLCBub2RlKTtcblxuICAgICAgICAgICAgbGV0IGVudHJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocnNzTGluayAmJiByc3NMaW5rLnZhbHVlICYmIHJzc1RpdGxlICYmIHJzc1RpdGxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIjogcnNzTGluay52YWx1ZVxuICAgICAgICAgICAgICAgIH0sIHJlbmRlci50YWcoXCJoM1wiLCB7fSwgcnNzVGl0bGUudmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHBsYXllclVybCA9IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICBpZiAocGxheWVyVXJsKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0Lm9wZW5QbGF5ZXJEaWFsb2coJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJzc0Rlc2MgJiYgcnNzRGVzYy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCByc3NEZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJzc0F1dGhvciAmJiByc3NBdXRob3IudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICB9LCBcIkJ5OiBcIiArIHJzc0F1dGhvci52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGVudHJ5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZW50cnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFRpdGxlXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZERlc2NcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkTGlua1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRVcmlcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkU3JjXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCJdO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbURlc2NcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtTGlua1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1VcmlcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCJdO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvcGVuUGxheWVyRGlhbG9nID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB1aWQgPSBfdWlkO1xuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcblxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbXAzVXJsID0gZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAobXAzVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLkdldFBsYXllckluZm9SZXNwb25zZT4oXCJnZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXJsXCI6IG1wM1VybFxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFVpZCh1aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRsZyA9IG5ldyBBdWRpb1BsYXllckRsZyhtcDNVcmwsIHVpZCwgcmVzLnRpbWVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VWlkID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBhZFNlZ3M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwiYWQtc2VnbWVudHNcIiwgbm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFkU2Vncykge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFRleHQoYWRTZWdzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZSB1aWQ6IFwiICsgdWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VGV4dCA9IGZ1bmN0aW9uKGFkU2Vnczogc3RyaW5nKSB7XG4gICAgICAgICAgICBhZFNlZ21lbnRzID0gW107XG5cbiAgICAgICAgICAgIGxldCBzZWdMaXN0OiBzdHJpbmdbXSA9IGFkU2Vncy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBzZWdMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlZ1RpbWVzOiBzdHJpbmdbXSA9IHNlZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ1RpbWVzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHJhbmdlOiBcIiArIHNlZyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBiZWdpblNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMF0pO1xuICAgICAgICAgICAgICAgIGxldCBlbmRTZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzFdKTtcblxuICAgICAgICAgICAgICAgIGFkU2VnbWVudHMucHVzaChuZXcgQWRTZWdtZW50KGJlZ2luU2VjcywgZW5kU2VjcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogY29udmVydCBmcm9tIGZvbXJhdCBcIm1pbnV0ZXM6c2Vjb250c1wiIHRvIGFic29sdXRlIG51bWJlciBvZiBzZWNvbmRzXG4gICAgICAgICpcbiAgICAgICAgKiB0b2RvLTA6IG1ha2UgdGhpcyBhY2NlcHQganVzdCBzZWNvbmRzLCBvciBtaW46c2VjLCBvciBob3VyOm1pbjpzZWMsIGFuZCBiZSBhYmxlIHRvXG4gICAgICAgICogcGFyc2UgYW55IG9mIHRoZW0gY29ycmVjdGx5LlxuICAgICAgICAqL1xuICAgICAgICBsZXQgY29udmVydFRvU2Vjb25kcyA9IGZ1bmN0aW9uKHRpbWVWYWw6IHN0cmluZykge1xuICAgICAgICAgICAgLyogZW5kIHRpbWUgaXMgZGVzaWduYXRlZCB3aXRoIGFzdGVyaXNrIGJ5IHVzZXIsIGFuZCByZXByZXNlbnRlZCBieSAtMSBpbiB2YXJpYWJsZXMgKi9cbiAgICAgICAgICAgIGlmICh0aW1lVmFsID09ICcqJykgcmV0dXJuIC0xO1xuICAgICAgICAgICAgbGV0IHRpbWVQYXJ0czogc3RyaW5nW10gPSB0aW1lVmFsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICAgIGlmICh0aW1lUGFydHMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSB2YWx1ZTogXCIgKyB0aW1lVmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzBdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzFdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyAqIDYwICsgc2Vjb25kcztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVzdG9yZVN0YXJ0VGltZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogbWFrZXMgcGxheWVyIGFsd2F5cyBzdGFydCB3aGVyZXZlciB0aGUgdXNlciBsYXN0IHdhcyB3aGVuIHRoZXkgY2xpY2tlZCBcInBhdXNlXCIgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgc3RhcnRUaW1lUGVuZGluZykge1xuICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHN0YXJ0VGltZVBlbmRpbmc7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lUGVuZGluZyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9uQ2FuUGxheSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgcGxheWVyID0gZWxtO1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25UaW1lVXBkYXRlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBpZiAoIXB1c2hUaW1lcikge1xuICAgICAgICAgICAgICAgIC8qIHBpbmcgc2VydmVyIG9uY2UgcGVyIG1pbnV0ZSAqL1xuICAgICAgICAgICAgICAgIHB1c2hUaW1lciA9IHNldEludGVydmFsKHB1c2hUaW1lckZ1bmN0aW9uLCAxMDAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ3VycmVudFRpbWU9XCIgKyBlbG0uY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgcGxheWVyID0gZWxtO1xuXG4gICAgICAgICAgICAvKiB0b2RvLTE6IHdlIGNhbGwgcmVzdG9yZVN0YXJ0VGltZSB1cG9uIGxvYWRpbmcgb2YgdGhlIGNvbXBvbmVudCBidXQgaXQgZG9lc24ndCBzZWVtIHRvIGhhdmUgdGhlIGVmZmVjdCBkb2luZyBhbnl0aGluZyBhdCBhbGxcbiAgICAgICAgICAgIGFuZCBjYW4ndCBldmVuIHVwZGF0ZSB0aGUgc2xpZGVyIGRpc3BsYXllZCBwb3NpdGlvbiwgdW50aWwgcGxheWlucyBpcyBTVEFSVEVELiBOZWVkIHRvIGNvbWUgYmFjayBhbmQgZml4IHRoaXMgYmVjYXVzZSB1c2Vyc1xuICAgICAgICAgICAgY3VycmVudGx5IGhhdmUgdGhlIGdsaXRjaCBvZiBhbHdheXMgaGVhcmluZyB0aGUgZmlyc3QgZnJhY3Rpb24gb2YgYSBzZWNvbmQgb2YgdmlkZW8sIHdoaWNoIG9mIGNvdXJzZSBhbm90aGVyIHdheSB0byBmaXhcbiAgICAgICAgICAgIHdvdWxkIGJlIGJ5IGFsdGVyaW5nIHRoZSB2b2x1bW4gdG8gemVybyB1bnRpbCByZXN0b3JlU3RhcnRUaW1lIGhhcyBnb25lIGludG8gZWZmZWN0ICovXG4gICAgICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG5cbiAgICAgICAgICAgIGlmICghYWRTZWdtZW50cykgcmV0dXJuO1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnIG9mIGFkU2VnbWVudHMpIHtcbiAgICAgICAgICAgICAgICAvKiBlbmRUaW1lIG9mIC0xIG1lYW5zIHRoZSByZXN0IG9mIHRoZSBtZWRpYSBzaG91bGQgYmUgY29uc2lkZXJlZCBBRHMgKi9cbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmN1cnJlbnRUaW1lID49IHNlZy5iZWdpblRpbWUgJiYgLy9cbiAgICAgICAgICAgICAgICAgICAgKHBsYXllci5jdXJyZW50VGltZSA8PSBzZWcuZW5kVGltZSB8fCBzZWcuZW5kVGltZSA8IDApKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoganVtcCB0byBlbmQgb2YgYXVkaW8gaWYgcmVzdCBpcyBhbiBhZGQsIHdpdGggbG9naWMgb2YgLTMgdG8gZW5zdXJlIHdlIGRvbid0XG4gICAgICAgICAgICAgICAgICAgIGdvIGludG8gYSBsb29wIGp1bXBpbmcgdG8gZW5kIG92ZXIgYW5kIG92ZXIgYWdhaW4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlZy5lbmRUaW1lIDwgMCAmJiBwbGF5ZXIuY3VycmVudFRpbWUgPCBwbGF5ZXIuZHVyYXRpb24gLSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGxhc3QgdG8gc2Vjb25kcyBvZiBhdWRpbywgaSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgcGF1c2luZywgaW4gY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXJlIGFyZSBpcyBtb3JlIGF1ZGlvIGF1dG9tYXRpY2FsbHkgYWJvdXQgdG8gcGxheSwgd2UgZG9uJ3Qgd2FudCB0byBoYWx0IGl0IGFsbCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmxvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHBsYXllci5kdXJhdGlvbiAtIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyogb3IgZWxzZSB3ZSBhcmUgaW4gYSBjb21lcmNpYWwgc2VnbWVudCBzbyBqdW1wIHRvIG9uZSBzZWNvbmQgcGFzdCBpdCAqL1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHNlZy5lbmRUaW1lICsgMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvLTA6IGZvciBwcm9kdWN0aW9uLCBib29zdCB0aGlzIHVwIHRvIG9uZSBtaW51dGUgKi9cbiAgICAgICAgZXhwb3J0IGxldCBwdXNoVGltZXJGdW5jdGlvbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInB1c2hUaW1lclwiKTtcbiAgICAgICAgICAgIC8qIHRoZSBwdXJwb3NlIG9mIHRoaXMgdGltZXIgaXMgdG8gYmUgc3VyZSB0aGUgYnJvd3NlciBzZXNzaW9uIGRvZXNuJ3QgdGltZW91dCB3aGlsZSB1c2VyIGlzIHBsYXlpbmdcbiAgICAgICAgICAgIGJ1dCBpZiB0aGUgbWVkaWEgaXMgcGF1c2VkIHdlIERPIGFsbG93IGl0IHRvIHRpbWVvdXQuIE90aHdlcndpc2UgaWYgdXNlciBpcyBsaXN0ZW5pbmcgdG8gYXVkaW8sIHdlXG4gICAgICAgICAgICBjb250YWN0IHRoZSBzZXJ2ZXIgZHVyaW5nIHRoaXMgdGltZXIgdG8gdXBkYXRlIHRoZSB0aW1lIG9uIHRoZSBzZXJ2ZXIgQU5EIGtlZXAgc2Vzc2lvbiBmcm9tIHRpbWluZyBvdXRcblxuICAgICAgICAgICAgdG9kby0wOiB3b3VsZCBldmVyeXRoaW5nIHdvcmsgaWYgJ3BsYXllcicgV0FTIHRoZSBqcXVlcnkgb2JqZWN0IGFsd2F5cy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAocGxheWVyICYmICFwbGF5ZXIucGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgLyogdGhpcyBzYWZldHkgY2hlY2sgdG8gYmUgc3VyZSBubyBoaWRkZW4gYXVkaW8gY2FuIHN0aWxsIGJlIHBsYXlpbmcgc2hvdWxkIG5vIGxvbmdlciBiZSBuZWVkZWRcbiAgICAgICAgICAgICAgICBub3cgdGhhdCBJIGhhdmUgdGhlIGNsb3NlIGxpdGVuZXIgZXZlbiBvbiB0aGUgZGlhbG9nLCBidXQgaSdsbCBsZWF2ZSB0aGlzIGhlcmUgYW55d2F5LiBDYW4ndCBodXJ0LiAqL1xuICAgICAgICAgICAgICAgIGlmICghJChwbGF5ZXIpLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbG9zaW5nIHBsYXllciwgYmVjYXVzZSBpdCB3YXMgZGV0ZWN0ZWQgYXMgbm90IHZpc2libGUuIHBsYXllciBkaWFsb2cgZ2V0IGhpZGRlbj9cIik7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQXV0b3NhdmUgcGxheWVyIGluZm8uXCIpO1xuICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgICAgIGV4cG9ydCBsZXQgcGF1c2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBkZXN0cm95UGxheWVyID0gZnVuY3Rpb24oZGxnOiBBdWRpb1BsYXllckRsZyk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsUGxheWVyID0gJChwbGF5ZXIpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFBsYXllci5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGxnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkbGcuY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwbGF5ID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgc3BlZWQgPSBmdW5jdGlvbihyYXRlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGxheWJhY2tSYXRlID0gcmF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBwb2RjYXN0IGhhbmRsaW5nIGhhY2sgaXMgb25seSBpbiB0aGlzIGZpbGUgdGVtcG9yYXJpbHlcbiAgICAgICAgZXhwb3J0IGxldCBza2lwID0gZnVuY3Rpb24oZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSArPSBkZWx0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZVBsYXllckluZm8gPSBmdW5jdGlvbih1cmw6IHN0cmluZywgdGltZU9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHJldHVybjtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0UGxheWVySW5mb1JlcXVlc3QsIGpzb24uU2V0UGxheWVySW5mb1Jlc3BvbnNlPihcInNldFBsYXllckluZm9cIiwge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IHVybCxcbiAgICAgICAgICAgICAgICBcInRpbWVPZmZzZXRcIjogdGltZU9mZnNldCxcbiAgICAgICAgICAgICAgICBcIm5vZGVQYXRoXCI6IG5vZGUucGF0aFxuICAgICAgICAgICAgfSwgc2V0UGxheWVySW5mb1Jlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZXRQbGF5ZXJJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIC8vYWxlcnQoJ3NhdmUgY29tcGxldGUuJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBtNjQucG9kY2FzdC5yZW5kZXJGZWVkTm9kZTtcbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBtNjQucG9kY2FzdC5yZW5kZXJJdGVtTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBtNjQucG9kY2FzdC5wcm9wT3JkZXJpbmdGZWVkTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBtNjQucG9kY2FzdC5wcm9wT3JkZXJpbmdJdGVtTm9kZTtcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHN5c3RlbWZvbGRlci5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzeXN0ZW1mb2xkZXIge1xuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgcGF0aFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnBhdGhcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHBhdGhQcm9wKSB7XG4gICAgICAgICAgICAgICAgcGF0aCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgICAgIH0sIHBhdGhQcm9wLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHJlaW5kZXhCdXR0b246IHN0cmluZyA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnN5c3RlbWZvbGRlci5yZWluZGV4KCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIlJlaW5kZXhcIik7XG5cbiAgICAgICAgICAgIGxldCBzZWFyY2hCdXR0b246IHN0cmluZyA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnN5c3RlbWZvbGRlci5zZWFyY2goJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiU2VhcmNoXCIpO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlaW5kZXhCdXR0b24gKyBzZWFyY2hCdXR0b24pO1xuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBwYXRoICsgYnV0dG9uQmFyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCArIGJ1dHRvbkJhcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZpbGVMaXN0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaFJlc3VsdFByb3ApIHtcbiAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHJlbmRlci5yZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBmaWxlTGlzdFByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6anNvblwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVpbmRleCA9IGZ1bmN0aW9uKF91aWQ6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSwgcmVpbmRleFJlc3BvbnNlLCBzeXN0ZW1mb2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZWluZGV4UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlKSB7XG4gICAgICAgICAgICBhbGVydChcIlJlaW5kZXggY29tcGxldGUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2ggPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIChuZXcgbTY0LlNlYXJjaEZpbGVzRGxnKHRydWUpKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cGF0aFwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubTY0Lm1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gbTY0LnN5c3RlbWZvbGRlci5yZW5kZXJOb2RlO1xubTY0Lm1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gbTY0LnN5c3RlbWZvbGRlci5wcm9wT3JkZXJpbmc7XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OmZpbGVsaXN0XCJdID0gbTY0LnN5c3RlbWZvbGRlci5yZW5kZXJGaWxlTGlzdE5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IG02NC5zeXN0ZW1mb2xkZXIuZmlsZUxpc3RQcm9wT3JkZXJpbmc7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBEaWFsb2dCYXNlLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICAvKlxuICAgICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBkaWFsb2cgYm94ZXMuXG4gICAgICpcbiAgICAgKiB0b2RvOiB3aGVuIHJlZmFjdG9yaW5nIGFsbCBkaWFsb2dzIHRvIHRoaXMgbmV3IGJhc2UtY2xhc3MgZGVzaWduIEknbSBhbHdheXNcbiAgICAgKiBjcmVhdGluZyBhIG5ldyBkaWFsb2cgZWFjaCB0aW1lLCBzbyB0aGUgbmV4dCBvcHRpbWl6YXRpb24gd2lsbCBiZSB0byBtYWtlXG4gICAgICogY2VydGFpbiBkaWFsb2dzIChpbmRlZWQgbW9zdCBvZiB0aGVtKSBiZSBhYmxlIHRvIGJlaGF2ZSBhcyBzaW5nbGV0b25zIG9uY2VcbiAgICAgKiB0aGV5IGhhdmUgYmVlbiBjb25zdHJ1Y3RlZCB3aGVyZSB0aGV5IG1lcmVseSBoYXZlIHRvIGJlIHJlc2hvd24gYW5kXG4gICAgICogcmVwb3B1bGF0ZWQgdG8gcmVvcGVuIG9uZSBvZiB0aGVtLCBhbmQgY2xvc2luZyBhbnkgb2YgdGhlbSBpcyBtZXJlbHkgZG9uZSBieVxuICAgICAqIG1ha2luZyB0aGVtIGludmlzaWJsZS5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBob3JpekNlbnRlckRsZ0NvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgICAgIGRhdGE6IGFueTtcbiAgICAgICAgYnVpbHQ6IGJvb2xlYW47XG4gICAgICAgIGd1aWQ6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9tSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBXZSByZWdpc3RlciAndGhpcycgc28gd2UgY2FuIGRvIG1ldGE2NC5nZXRPYmplY3RCeUd1aWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBvbiB0aGUgZGlhbG9nIGFuZCBiZSBhYmxlIHRvIGhhdmUgJ3RoaXMnIGF2YWlsYWJsZSB0byB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGVuY29kZWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBhcyBzdHJpbmdzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbnRlbnQgb2YgdGhlIGRpYWxvZyB3aGVuIGl0J3MgZGlzcGxheWVkLCBhbmQgc2hvdWxkIGJlIHRoZSBwbGFjZSB3aGVyZVxuICAgICAgICBhbnkgZGVmYXVsdHMgb3IgdmFsdWVzIGluIGZvciBmaWVsZHMsIGV0Yy4gc2hvdWxkIGJlIHNldCB3aGVuIHRoZSBkaWFsb2cgaXMgZGlzcGxheWVkICovXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIH1cblxuICAgICAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIH07XG5cbiAgICAgICAgb3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBnZXQgY29udGFpbmVyIHdoZXJlIGFsbCBkaWFsb2dzIGFyZSBjcmVhdGVkICh0cnVlIHBvbHltZXIgZGlhbG9ncylcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG1vZGFsc0NvbnRhaW5lciA9IHV0aWwucG9seUVsbShcIm1vZGFsc0NvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgLyogc3VmZml4IGRvbUlkIGZvciB0aGlzIGluc3RhbmNlL2d1aWQgKi9cbiAgICAgICAgICAgIGxldCBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUT0RPLiBJTVBPUlRBTlQ6IG5lZWQgdG8gcHV0IGNvZGUgaW4gdG8gcmVtb3ZlIHRoaXMgZGlhbG9nIGZyb20gdGhlIGRvbVxuICAgICAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICAgICAqIG1hcCBpbiB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgICAgIC8vTk9URTogVGhpcyB3b3JrcywgYnV0IGlzIGFuIGV4YW1wbGUgb2Ygd2hhdCBOT1QgdG8gZG8gYWN0dWFsbHkuIEluc3RlYWQgYWx3YXlzXG4gICAgICAgICAgICAvL3NldCB0aGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSAncG9seUVsbS5ub2RlJyBiZWxvdy5cbiAgICAgICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XG4gICAgICAgICAgICBtb2RhbHNDb250YWluZXIubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5ib3JkZXIgPSBcIjNweCBzb2xpZCBncmF5XCI7XG5cbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhvcml6Q2VudGVyRGxnQ29udGVudCkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIC8vaG93dG86IGV4YW1wbGUgb2YgaG93IHRvIGNlbnRlciBhIGRpdiBpbiBhbm90aGVyIGRpdi4gVGhpcyBkaXYgaXMgdGhlIG9uZSBiZWluZyBjZW50ZXJlZC5cbiAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB0cmljayB0byBnZXR0aW5nIHRoZSBsYXlvdXQgd29ya2luZyB3YXMgTk9UIHNldHRpbmcgdGhpcyB3aWR0aCB0byAxMDAlIGV2ZW4gdGhvdWdoIHNvbWVob3dcbiAgICAgICAgICAgICAgICAgICAgICAvL3RoZSBsYXlvdXQgZG9lcyByZXN1bHQgaW4gaXQgYmVpbmcgMTAwJSBpIHRoaW5rLlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiIDogXCJtYXJnaW46IDAgYXV0bzsgbWF4LXdpZHRoOiA4MDBweDtcIiAvL1wibWFyZ2luOiAwIGF1dG87IHdpZHRoOiA4MDBweDtcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoaWQsIGNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxlZnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgICAgIC8vIH0sIFwibGVmdFwiKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQgY2VudGVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgICAgICAvLyB9LCB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgICAgIC8vIGxldCByaWdodCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJzdHlsZVwiOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGxldCByb3cgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsgXCJkaXNwbGF5XCI6IFwidGFibGUtcm93XCIgfSwgbGVmdCArIGNlbnRlciArIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGxldCB0YWJsZTogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLFxuICAgICAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgIC8vICAgICB9LCByb3cpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gdXRpbC5zZXRIdG1sKGlkLCB0YWJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKiB0b2RvLTA6IGxvb2t1cCBwYXBlci1kaWFsb2ctc2Nyb2xsYWJsZSwgZm9yIGV4YW1wbGVzIG9uIGhvdyB3ZSBjYW4gaW1wbGVtZW50IGhlYWRlciBhbmQgZm9vdGVyIHRvIGJ1aWxkXG4gICAgICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLmJ1aWxkKCk7XG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGhpcy5idWlsdCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRpYWxvZzogXCIgKyBpZCk7XG5cbiAgICAgICAgICAgIC8qIG5vdyBvcGVuIGFuZCBkaXNwbGF5IHBvbHltZXIgZGlhbG9nIHdlIGp1c3QgY3JlYXRlZCAqL1xuICAgICAgICAgICAgbGV0IHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0oaWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaSB0cmllZCB0byB0d2VhayB0aGUgcGxhY2VtZW50IG9mIHRoZSBkaWFsb2cgdXNpbmcgZml0SW50bywgYW5kIGl0IGRpZG4ndCB3b3JrXG4gICAgICAgICAgICBzbyBJJ20ganVzdCB1c2luZyB0aGUgcGFwZXItZGlhbG9nIENTUyBzdHlsaW5nIHRvIGFsdGVyIHRoZSBkaWFsb2cgc2l6ZSB0byBmdWxsc2NyZWVuXG4gICAgICAgICAgICBsZXQgaXJvblBhZ2VzID0gdXRpbC5wb2x5RWxtKFwibWFpbklyb25QYWdlc1wiKTtcblxuICAgICAgICAgICAgQWZ0ZXIgdGhlIFR5cGVTY3JpcHQgY29udmVyc2lvbiBJIG5vdGljZWQgaGF2aW5nIGEgbW9kYWwgZmxhZyB3aWxsIGNhdXNlXG4gICAgICAgICAgICBhbiBpbmZpbml0ZSBsb29wIChjb21wbGV0ZWx5IGhhbmcpIENocm9tZSBicm93c2VyLCBidXQgdGhpcyBpc3N1ZSBpcyBtb3N0IGxpa2VseVxuICAgICAgICAgICAgbm90IHJlbGF0ZWQgdG8gVHlwZVNjcmlwdCBhdCBhbGwsIGJ1dCBpJ20ganVzdCBtZW50aW9uIFRTIGp1c3QgaW4gY2FzZSwgYmVjYXVzZVxuICAgICAgICAgICAgdGhhdCdzIHdoZW4gSSBub3RpY2VkIGl0LiBEaWFsb2dzIGFyZSBmaW5lIGJ1dCBub3QgYSBkaWFsb2cgb24gdG9wIG9mIGFub3RoZXIgZGlhbG9nLCB3aGljaCBpc1xuICAgICAgICAgICAgdGhlIGNhc2Ugd2hlcmUgaXQgaGFuZ3MgaWYgbW9kZWw9dHJ1ZVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5ub0NhbmNlbE9uT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmhvcml6b250YWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuZml0SW50byA9IGlyb25QYWdlcy5ub2RlO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY29uc3RyYWluKCk7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5vcGVuKCk7XG5cbiAgICAgICAgICAgIC8vdmFyIGRpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkRpYWxvZycpO1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpcm9uLW92ZXJsYXktY2xvc2VkJywgZnVuY3Rpb24oY3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL3ZhciBpZCA9ICg8YW55PmN1c3RvbUV2ZW50LmN1cnJlbnRUYXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKiogRGlhbG9nOiBcIiArIGlkICsgXCIgaXMgY2xvc2VkIVwiKTtcbiAgICAgICAgICAgICAgICB0aGl6LmNsb3NlRXZlbnQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgc2V0dGluZyB0byB6ZXJvIG1hcmdpbiBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWxtb3N0IGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhZnRlIDEuNSBzZWNvbmRzXG4gICAgICAgICAgICBpcyBhIHJlYWxseSB1Z2x5IGhhY2ssIGJ1dCBJIGNvdWxkbid0IGZpbmQgdGhlIHJpZ2h0IHN0eWxlIGNsYXNzIG9yIHdheSBvZiBkb2luZyB0aGlzIGluIHRoZSBnb29nbGVcbiAgICAgICAgICAgIGRvY3Mgb24gdGhlIGRpYWxvZyBjbGFzcy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuXG4gICAgICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIH0sIDEwKTtcblxuICAgICAgICAgICAgLyogSSdtIGRvaW5nIHRoaXMgaW4gZGVzcGFyYXRpb24uIG5vdGhpbmcgZWxzZSBzZWVtcyB0byBnZXQgcmlkIG9mIHRoZSBtYXJnaW4gKi9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG86IG5lZWQgdG8gY2xlYW51cCB0aGUgcmVnaXN0ZXJlZCBJRHMgdGhhdCBhcmUgaW4gbWFwcyBmb3IgdGhpcyBkaWFsb2cgKi9cbiAgICAgICAgcHVibGljIGNhbmNlbCgpIHtcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQodGhpcy5kb21JZCkpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNhbmNlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSGVscGVyIG1ldGhvZCB0byBnZXQgdGhlIHRydWUgaWQgdGhhdCBpcyBzcGVjaWZpYyB0byB0aGlzIGRpYWxvZyAoaS5lLiBndWlkXG4gICAgICAgICAqIHN1ZmZpeCBhcHBlbmRlZClcbiAgICAgICAgICovXG4gICAgICAgIGlkID0gKGlkKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlmIChpZCA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAvKiBpZiBkaWFsb2cgYWxyZWFkeSBzdWZmaXhlZCAqL1xuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiX2RsZ0lkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkICsgXCJfZGxnSWRcIiArIHRoaXMuZGF0YS5ndWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVBhc3N3b3JkRmllbGQgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIubWFrZVBhc3N3b3JkRmllbGQodGV4dCwgdGhpcy5pZChpZCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUVkaXRGaWVsZCA9IChmaWVsZE5hbWU6IHN0cmluZywgaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZXRhNjQtaW5wdXRcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlTWVzc2FnZUFyZWEgPSAobWVzc2FnZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1tZXNzYWdlXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBcIiwgYXR0cnMsIG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9kbzogdGhlcmUncyBhIG1ha2VCdXR0b24gKGFuZCBvdGhlciBzaW1pbGFyIG1ldGhvZHMpIHRoYXQgZG9uJ3QgaGF2ZSB0aGVcbiAgICAgICAgLy8gZW5jb2RlQ2FsbGJhY2sgY2FwYWJpbGl0eSB5ZXRcbiAgICAgICAgbWFrZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VDbG9zZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogYW55LCBjdHg/OiBhbnksIGluaXRpYWxseVZpc2libGU/OiBib29sZWFuKTogc3RyaW5nID0+IHtcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAvLyB3YXJuaW5nOiB0aGlzIGRpYWxvZy1jb25maXJtIGlzIHJlcXVpcmVkIChsb2dpYyBmYWlscyB3aXRob3V0KVxuICAgICAgICAgICAgICAgIFwiZGlhbG9nLWNvbmZpcm1cIjogXCJkaWFsb2ctY29uZmlybVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBvbkNsaWNrID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2sgPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25DbGljayArPSBcIjtcIiArIG1ldGE2NC5lbmNvZGVPbkNsaWNrKHRoaXMuY2FuY2VsLCB0aGlzKTtcblxuICAgICAgICAgICAgaWYgKG9uQ2xpY2spIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG9uQ2xpY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsbHlWaXNpYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJzdHlsZVwiXSA9IFwiZGlzcGxheTpub25lO1wiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZEVudGVyS2V5ID0gKGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuYmluZEVudGVyS2V5KHRoaXMuaWQoaWQpLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSwgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldElucHV0VmFsID0gKGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChpZCkpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEh0bWwgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChpZCksIHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVJhZGlvQnV0dG9uID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZFxuICAgICAgICAgICAgfSwgbGFiZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUNoZWNrQm94ID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGluaXRpYWxTdGF0ZTogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgLy9cIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIDxwYXBlci1jaGVja2JveCBvbi1jaGFuZ2U9XCJjaGVja2JveENoYW5nZWRcIj5jbGljazwvcGFwZXItY2hlY2tib3g+XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY2hlY2tib3hDaGFuZ2VkIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgLy8gICAgIGlmKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoZWNrYm94OiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgYXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgY2hlY2tib3ggKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiBpZFxuICAgICAgICAgICAgfSwgbGFiZWwsIHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tib3g7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlSGVhZGVyID0gKHRleHQ6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNlbnRlcmVkPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAvKlwiZGlhbG9nLWhlYWRlciBcIiArKi8gKGNlbnRlcmVkID8gXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCIgOiBcIlwiKStcIiBkaWFsb2ctaGVhZGVyXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vYWRkIGlkIGlmIG9uZSB3YXMgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogbWFraW5nIHRoaXMgSDIgdGFnIGNhdXNlcyBnb29nbGUgdG8gZHJhZyBpbiBhIGJ1bmNoIG9mIGl0cyBvd24gc3R5bGVzIGFuZCBhcmUgaGFyZCB0byBvdmVycmlkZSAqL1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwgYXR0cnMsIHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9jdXMgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xuICAgICAgICAgICAgICAgIGlkID0gXCIjXCIgKyBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENvbmZpcm1EbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBDb25maXJtRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB0aXRsZTogc3RyaW5nLCBwcml2YXRlIG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZSBidXR0b25UZXh0OiBzdHJpbmcsIHByaXZhdGUgeWVzQ2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICAgcHJpdmF0ZSBub0NhbGxiYWNrPzogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ29uZmlybURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgY29udGVudDogc3RyaW5nID0gdGhpcy5tYWtlSGVhZGVyKFwiXCIsIFwiQ29uZmlybURsZ1RpdGxlXCIpICsgdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJcIiwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlllc1wiLCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIiwgdGhpcy55ZXNDYWxsYmFjaylcbiAgICAgICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIiwgdGhpcy5ub0NhbGxiYWNrKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy50aXRsZSwgXCJDb25maXJtRGxnVGl0bGVcIik7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5tZXNzYWdlLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMuYnV0dG9uVGV4dCwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUHJvZ3Jlc3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJQcm9ncmVzc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUHJvY2Vzc2luZyBSZXF1ZXN0XCIsIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgICAgIFwiaW5kZXRlcm1pbmF0ZVwiOiBcImluZGV0ZXJtaW5hdGVcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiODAwXCIsXG4gICAgICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgICAgICBcIm1heFwiOiBcIjEwMDBcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MjgwcHg7IG1hcmdpbjoyNHB4O1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJhckNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1lc3NhZ2VEbGcuanNcIik7XHJcblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXNzYWdlPzogYW55LCBwcml2YXRlIHRpdGxlPzogYW55LCBwcml2YXRlIGNhbGxiYWNrPzogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWVzc2FnZURsZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJNZXNzYWdlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy50aXRsZSkgKyBcIjxwPlwiICsgdGhpcy5tZXNzYWdlICsgXCI8L3A+XCI7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiT2tcIiwgXCJtZXNzYWdlRGxnT2tCdXR0b25cIiwgdGhpcy5jYWxsYmFjaykpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTG9naW5EbGcuanNcIik7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XG5cbi8qXG5Ob3RlOiBUaGUganF1ZXJ5IGNvb2tpZSBsb29rcyBmb3IganF1ZXJ5IGQudHMgaW4gdGhlIHJlbGF0aXZlIGxvY2F0aW9uIFwiXCIuLi9qcXVlcnlcIiBzbyBiZXdhcmUgaWYgeW91clxudHJ5IHRvIHJlb3JnYW5pemUgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgSSBoYXZlIGluIHR5cGVkZWZzLCB0aGluZ3Mgd2lsbCBjZXJ0YWlubHkgYnJlYWtcbiovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBMb2dpbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiTG9naW5EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkxvZ2luXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdmFyIGxvZ2luQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiTG9naW5cIiwgXCJsb2dpbkJ1dHRvblwiLCB0aGlzLmxvZ2luLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRm9yZ290IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLCB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGxvZ2luQnV0dG9uICsgcmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuICAgICAgICAgICAgdmFyIGRpdmlkZXIgPSBcIjxkaXY+PGgzPk9yIExvZ2luIFdpdGguLi48L2gzPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybSA9IGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gZm9ybTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInBhc3N3b3JkXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3B1bGF0ZUZyb21Db29raWVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHVzciA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XG4gICAgICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICAgICAgaWYgKHVzcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB1c3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHB3ZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiLCBwd2QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9naW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgICAgICB2YXIgcHdkID0gdGhpcy5nZXRJbnB1dFZhbChcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB1c2VyLmxvZ2luKHRoaXMsIHVzciwgcHdkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogYW55ID0+IHtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gUmVzZXQgUGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICBcIlJlc2V0IHlvdXIgcGFzc3dvcmQgPzxwPllvdSdsbCBzdGlsbCBiZSBhYmxlIHRvIGxvZ2luIHdpdGggeW91ciBvbGQgcGFzc3dvcmQgdW50aWwgdGhlIG5ldyBvbmUgaXMgc2V0LlwiLFxuICAgICAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXouY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgUmVzZXRQYXNzd29yZERsZyh1c3IpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNpZ251cERsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEU7XG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRV9TSE9SVDtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNpZ251cERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaWdudXBEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihCUkFORElOR19USVRMRSArIFwiIFNpZ251cFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInNpZ251cFVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJzaWdudXBQYXNzd29yZFwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWxcIiwgXCJzaWdudXBFbWFpbFwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiQ2FwdGNoYVwiLCBcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIHZhciBjYXB0Y2hhSW1hZ2UgPSByZW5kZXIudGFnKFwiZGl2XCIsIC8vXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYS1pbWFnZVwiIC8vXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICByZW5kZXIudGFnKFwiaW1nXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIlwiLy9cbiAgICAgICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJcIiwgZmFsc2UpKTtcblxuICAgICAgICAgICAgdmFyIHNpZ251cEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNpZ251cFwiLCBcInNpZ251cEJ1dHRvblwiLCB0aGlzLnNpZ251cCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgbmV3Q2FwdGNoYUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlRyeSBEaWZmZXJlbnQgSW1hZ2VcIiwgXCJ0cnlBbm90aGVyQ2FwdGNoYUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2lnbnVwQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNpZ251cEJ1dHRvbiArIG5ld0NhcHRjaGFCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGNhcHRjaGFJbWFnZSArIGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqICQoXCIjXCIgKyBfLmRvbUlkICsgXCItbWFpblwiKS5jc3MoeyBcImJhY2tncm91bmRJbWFnZVwiIDogXCJ1cmwoL2libS03MDItYnJpZ2h0LmpwZyk7XCIgXCJiYWNrZ3JvdW5kLXJlcGVhdFwiIDpcbiAgICAgICAgICAgICAqIFwibm8tcmVwZWF0O1wiLCBcImJhY2tncm91bmQtc2l6ZVwiIDogXCIxMDAlIGF1dG9cIiB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICB9XG5cbiAgICAgICAgc2lnbnVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFVzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHBhc3N3b3JkID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFBhc3N3b3JkXCIpO1xuICAgICAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cEVtYWlsXCIpO1xuICAgICAgICAgICAgdmFyIGNhcHRjaGEgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAgICAgLyogbm8gcmVhbCB2YWxpZGF0aW9uIHlldCwgb3RoZXIgdGhhbiBub24tZW1wdHkgKi9cbiAgICAgICAgICAgIGlmICghdXNlck5hbWUgfHwgdXNlck5hbWUubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhZW1haWwgfHwgZW1haWwubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhY2FwdGNoYSB8fCBjYXB0Y2hhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU29ycnksIHlvdSBjYW5ub3QgbGVhdmUgYW55IGZpZWxkcyBibGFuay5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNpZ251cFJlcXVlc3QsanNvbi5TaWdudXBSZXNwb25zZT4oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNlck5hbWUsXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgICAgIFwiY2FwdGNoYVwiOiBjYXB0Y2hhXG4gICAgICAgICAgICB9LCB0aGlzLnNpZ251cFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cFJlc3BvbnNlID0gKHJlczoganNvbi5TaWdudXBSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2lnbnVwIG5ldyB1c2VyXCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qIGNsb3NlIHRoZSBzaWdudXAgZGlhbG9nICovXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcbiAgICAgICAgICAgICAgICAgICAgXCJVc2VyIEluZm9ybWF0aW9uIEFjY2VwdGVkLjxwLz5DaGVjayB5b3VyIGVtYWlsIGZvciBzaWdudXAgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICAgICAgKSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5QW5vdGhlckNhcHRjaGEgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciBuID0gdXRpbC5jdXJyZW50VGltZU1pbGxpcygpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZW1iZWQgYSB0aW1lIHBhcmFtZXRlciBqdXN0IHRvIHRod2FydCBicm93c2VyIGNhY2hpbmcsIGFuZCBlbnN1cmUgc2VydmVyIGFuZCBicm93c2VyIHdpbGwgbmV2ZXIgcmV0dXJuIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBpbWFnZSB0d2ljZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHNyYyA9IHBvc3RUYXJnZXRVcmwgKyBcImNhcHRjaGE/dD1cIiArIG47XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSkuYXR0cihcInNyY1wiLCBzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZUluaXRTaWdudXBQZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VJbml0U2lnbnVwUGcoKTtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByZWZzRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgUHJlZnNEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQZWZlcmVuY2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9ucyA9IHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiU2ltcGxlXCIsIFwiZWRpdE1vZGVTaW1wbGVcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJBZHZhbmNlZFwiLCBcImVkaXRNb2RlQWR2YW5jZWRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFkaW9CdXR0b25Hcm91cCA9IHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1ncm91cFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpXHJcbiAgICAgICAgICAgIH0sIHJhZGlvQnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tCb3ggPSB0aGlzLm1ha2VDaGVja0JveChcIlNob3cgUm93IE1ldGFkYXRhXCIsIFwic2hvd01ldGFEYXRhXCIsIG1ldGE2NC5zaG93TWV0YURhdGEpO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tib3hCYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAoc2hvd01ldGFEYXRhQ2hlY2tCb3gpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVnZW5kID0gXCI8bGVnZW5kPkVkaXQgTW9kZTo8L2xlZ2VuZD5cIjtcclxuICAgICAgICAgICAgdmFyIHJhZGlvQmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKGxlZ2VuZCArIGZvcm1Db250cm9scyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBjaGVja2JveEJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlcyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcG9seUVsbS5ub2RlLnNlbGVjdGVkID09IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA/IG1ldGE2NC5NT0RFX1NJTVBMRVxyXG4gICAgICAgICAgICAgICAgOiBtZXRhNjQuTU9ERV9BRFZBTkNFRDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHNob3dNZXRhRGF0YUNoZWNrYm94Lm5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VELFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSxcclxuICAgICAgICAgICAgICAgICAgICAvKiB0b2RvLTE6IGhvdyBjYW4gSSBmbGFnIGEgcHJvcGVydHkgYXMgb3B0aW9uYWwgaW4gVHlwZVNjcmlwdCBnZW5lcmF0b3IgPyBXb3VsZCBiZSBwcm9iYWJseSBzb21lIGtpbmQgb2YganNvbi9qYWNrc29uIEByZXF1aXJlZCBhbm5vdGF0aW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogbWV0YTY0LnNob3dNZXRhRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLnNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlID0gKHJlczoganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2aW5nIFByZWZlcmVuY2VzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IHRyeSBhbmQgbWFpbnRhaW4gc2Nyb2xsIHBvc2l0aW9uID8gdGhpcyBpcyBnb2luZyB0byBiZSBhc3luYywgc28gd2F0Y2ggb3V0LlxyXG4gICAgICAgICAgICAgICAgLy8gdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc2VsZWN0KG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PSBtZXRhNjQuTU9ERV9TSU1QTEUgPyB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgOiB0aGlzXHJcbiAgICAgICAgICAgICAgICAuaWQoXCJlZGl0TW9kZUFkdmFuY2VkXCIpKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBwdXQgdGhlc2UgdHdvIGxpbmVzIGluIGEgdXRpbGl0eSBtZXRob2RcclxuICAgICAgICAgICAgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNoZWNrZWQgPSBtZXRhNjQuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWFuYWdlQWNjb3VudERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hbmFnZUFjY291bnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWFuYWdlQWNjb3VudERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJNYW5hZ2UgQWNjb3VudFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2xvc2VBY2NvdW50QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYmFja0J1dHRvbik7XHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjbG9zZS1hY2NvdW50LWJhclwiXHJcbiAgICAgICAgICAgIH0sIGJvdHRvbUJ1dHRvbkJhcik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBFeHBvcnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBFeHBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkV4cG9ydCB0byBGaWxlIE5hbWVcIiwgXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGV4cG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkV4cG9ydFwiLCBcImV4cG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuZXhwb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihleHBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHRhcmdldEZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBleHBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwb3J0UmVxdWVzdCwganNvbi5FeHBvcnRSZXNwb25zZT4oXCJleHBvcnRUb1htbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmV4cG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5FeHBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFeHBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogSW1wb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgSW1wb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkZpbGUgbmFtZSB0byBpbXBvcnRcIiwgXCJzb3VyY2VGaWxlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGltcG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkltcG9ydFwiLCBcImltcG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuaW1wb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsSW1wb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihpbXBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltcG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgc291cmNlRmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNvdXJjZUZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBpbXBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW1wb3J0UmVxdWVzdCxqc29uLkltcG9ydFJlc3BvbnNlPihcImltcG9ydFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlRmlsZU5hbWVcIjogc291cmNlRmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmltcG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGltcG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5JbXBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW1wb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbXBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoQ29udGVudERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaENvbnRlbnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoQ29udGVudERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIENvbnRlbnRcIik7XG5cbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBPbmx5IGNvbnRlbnQgdGV4dCB3aWxsIGJlIHNlYXJjaGVkLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5DT05URU5UKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoVGFnc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaFRhZ3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoVGFnc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIFRhZ3NcIik7XG5cbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBPbmx5IHRhZ3MgdGV4dCB3aWxsIGJlIHNlYXJjaGVkLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaEZpbGVzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoRmlsZXNEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGx1Y2VuZTogYm9vbGVhbikge1xuICAgICAgICAgICAgc3VwZXIoXCJTZWFyY2hGaWxlc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIEZpbGVzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoQnV0dG9uXCIsIHRoaXMuc2VhcmNoVGFncywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaEZpbGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkID0gc2VsTm9kZS5pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRmlsZVNlYXJjaFJlcXVlc3QsIGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlPihcImZpbGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcbiAgICAgICAgICAgICAgICBcInJlaW5kZXhcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHRcbiAgICAgICAgICAgIH0sIHNyY2guc2VhcmNoRmlsZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ2hhbmdlUGFzc3dvcmREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBDaGFuZ2VQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBwd2Q6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXNzQ29kZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiQ2hhbmdlUGFzc3dvcmREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2cuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBJZiB0aGUgdXNlciBpcyBkb2luZyBhIFwiUmVzZXQgUGFzc3dvcmRcIiB3ZSB3aWxsIGhhdmUgYSBub24tbnVsbCBwYXNzQ29kZSBoZXJlLCBhbmQgd2Ugc2ltcGx5IHNlbmQgdGhpcyB0byB0aGUgc2VydmVyXHJcbiAgICAgICAgICogd2hlcmUgaXQgd2lsbCB2YWxpZGF0ZSB0aGUgcGFzc0NvZGUsIGFuZCBpZiBpdCdzIHZhbGlkIHVzZSBpdCB0byBwZXJmb3JtIHRoZSBjb3JyZWN0IHBhc3N3b3JkIGNoYW5nZSBvbiB0aGUgY29ycmVjdFxyXG4gICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy5wYXNzQ29kZSA/IFwiUGFzc3dvcmQgUmVzZXRcIiA6IFwiQ2hhbmdlIFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSByZW5kZXIudGFnKFwicFwiLCB7XHJcblxyXG4gICAgICAgICAgICB9LCBcIkVudGVyIHlvdXIgbmV3IHBhc3N3b3JkIGJlbG93Li4uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJOZXcgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hhbmdlUGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkQWN0aW9uQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsQ2hhbmdlUGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNoYW5nZVBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJjaGFuZ2VQYXNzd29yZDFcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucHdkICYmIHRoaXMucHdkLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DaGFuZ2VQYXNzd29yZFJlcXVlc3QsanNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlPihcImNoYW5nZVBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5ld1Bhc3N3b3JkXCI6IHRoaXMucHdkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc0NvZGVcIjogdGhpcy5wYXNzQ29kZVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5jaGFuZ2VQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkludmFsaWQgcGFzc3dvcmQocykuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkUmVzcG9uc2UgPSAocmVzOiBqc29uLkNoYW5nZVBhc3N3b3JkUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIHBhc3N3b3JkXCIsIHJlcykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0gXCJQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIjxwPllvdSBtYXkgbm93IGxvZ2luIGFzIDxiPlwiICsgcmVzLnVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyBcIjwvYj4gd2l0aCB5b3VyIG5ldyBwYXNzd29yZC5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnLCBcIlBhc3N3b3JkIENoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpei5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbG9naW4gY2FsbCBET0VTIHdvcmssIGJ1dCB0aGUgcmVhc29uIHdlIGRvbid0IGRvIHRoaXMgaXMgYmVjYXVzZSB0aGUgVVJMIHN0aWxsIGhhcyB0aGUgcGFzc0NvZGUgb24gaXQgYW5kIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vd2FudCB0byBkaXJlY3QgdGhlIHVzZXIgdG8gYSB1cmwgd2l0aG91dCB0aGF0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VzZXIubG9naW4obnVsbCwgcmVzLnVzZXIsIHRoaXoucHdkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZXNldFBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgUmVzZXRQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVzZXI6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIlJlc2V0UGFzc3dvcmREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVzZXQgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgeW91ciB1c2VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgYW5kIGEgY2hhbmdlLXBhc3N3b3JkIGxpbmsgd2lsbCBiZSBzZW50IHRvIHlvdVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwidXNlck5hbWVcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWwgQWRkcmVzc1wiLCBcImVtYWlsQWRkcmVzc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZXNldCBteSBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIixcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlc2V0UGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKS50cmltKCk7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbEFkZHJlc3MgPSB0aGlzLmdldElucHV0VmFsKFwiZW1haWxBZGRyZXNzXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1c2VyTmFtZSAmJiBlbWFpbEFkZHJlc3MpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlc2V0UGFzc3dvcmRSZXF1ZXN0LCBqc29uLlJlc2V0UGFzc3dvcmRSZXNwb25zZT4oXCJyZXNldFBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbEFkZHJlc3NcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMucmVzZXRQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk9vcHMuIFRyeSB0aGF0IGFnYWluLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNldFBhc3N3b3JkUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlc2V0UGFzc3dvcmRSZXNwb25zZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZXNldCBwYXNzd29yZFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQYXNzd29yZCByZXNldCBlbWFpbCB3YXMgc2VudC4gQ2hlY2sgeW91ciBpbmJveC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInVzZXJOYW1lXCIsIHRoaXMudXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbUZpbGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIERyb3B6b25lO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgVXBsb2FkRnJvbUZpbGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgICAgIGxldCBmb3JtRmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEZvciBub3cgSSBqdXN0IGhhcmQtY29kZSBpbiA3IGVkaXQgZmllbGRzLCBidXQgd2UgY291bGQgdGhlb3JldGljYWxseSBtYWtlIHRoaXMgZHluYW1pYyBzbyB1c2VyIGNhbiBjbGljayAnYWRkJ1xuICAgICAgICAgICAgICogYnV0dG9uIGFuZCBhZGQgbmV3IG9uZXMgb25lIGF0IGEgdGltZS4gSnVzdCBub3QgdGFraW5nIHRoZSB0aW1lIHRvIGRvIHRoYXQgeWV0LlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIHRvZG8tMDogVGhpcyBpcyB1Z2x5IHRvIHByZS1jcmVhdGUgdGhlc2UgaW5wdXQgZmllbGRzLiBOZWVkIHRvIG1ha2UgdGhlbSBhYmxlIHRvIGFkZCBkeW5hbWljYWxseS5cbiAgICAgICAgICAgICAqIChXaWxsIGRvIHRoaXMgbW9kaWZpY2F0aW9uIG9uY2UgSSBnZXQgdGhlIGRyYWctbi1kcm9wIHN0dWZmIHdvcmtpbmcgZmlyc3QpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0ID0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkXCIgKyBpICsgXCJGb3JtSW5wdXRJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJmaWxlc1wiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvKiB3cmFwIGluIERJViB0byBmb3JjZSB2ZXJ0aWNhbCBhbGlnbiAqL1xuICAgICAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tYm90dG9tOiAxMHB4O1wiXG4gICAgICAgICAgICAgICAgfSwgaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybU5vZGVJZFwiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlSWRcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8qIGJvb2xlYW4gZmllbGQgdG8gc3BlY2lmeSBpZiB3ZSBleHBsb2RlIHppcCBmaWxlcyBvbnRvIHRoZSBKQ1IgdHJlZSAqL1xuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImV4cGxvZGVaaXBzXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpLFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIFwiZW5jdHlwZVwiOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIixcbiAgICAgICAgICAgICAgICBcImRhdGEtYWpheFwiOiBcImZhbHNlXCIgLy8gTkVXIGZvciBtdWx0aXBsZSBmaWxlIHVwbG9hZCBzdXBwb3J0Pz8/XG4gICAgICAgICAgICB9LCBmb3JtRmllbGRzKTtcblxuICAgICAgICAgICAgdXBsb2FkRmllbGRDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZpZWxkQ29udGFpbmVyXCIpXG4gICAgICAgICAgICB9LCBcIjxwPlVwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXI8L3A+XCIgKyBmb3JtKTtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIHVwbG9hZEZpZWxkQ29udGFpbmVyICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzQW55WmlwRmlsZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICBsZXQgcmV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbCA9ICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkXCIgKyBpICsgXCJGb3JtSW5wdXRJZFwiKSkudmFsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0VmFsLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoXCIuemlwXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRGaWxlTm93ID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkRnVuYyA9IChleHBsb2RlWmlwcykgPT4ge1xuICAgICAgICAgICAgICAgIC8qIFVwbG9hZCBmb3JtIGhhcyBoaWRkZW4gaW5wdXQgZWxlbWVudCBmb3Igbm9kZUlkIHBhcmFtZXRlciAqL1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybU5vZGVJZFwiKSkuYXR0cihcInZhbHVlXCIsIGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSkuYXR0cihcInZhbHVlXCIsIGV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBUaGlzIGlzIHRoZSBvbmx5IHBsYWNlIHdlIGRvIHNvbWV0aGluZyBkaWZmZXJlbnRseSBmcm9tIHRoZSBub3JtYWwgJ3V0aWwuanNvbigpJyBjYWxscyB0byB0aGUgc2VydmVyLCBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICogdGhpcyBpcyBoaWdobHkgc3BlY2lhbGl6ZWQgaGVyZSBmb3IgZm9ybSB1cGxvYWRpbmcsIGFuZCBpcyBkaWZmZXJlbnQgZnJvbSBub3JtYWwgYWpheCBjYWxscy5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PigkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1cIikpWzBdKSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcHJtcyA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJtcy5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJtcy5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVcGxvYWQgZmFpbGVkLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQW55WmlwRmlsZXMoKSkge1xuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkV4cGxvZGUgWmlwcz9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJEbyB5b3Ugd2FudCBaaXAgZmlsZXMgZXhwbG9kZWQgb250byB0aGUgdHJlZSB3aGVuIHVwbG9hZGVkP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlllcywgZXhwbG9kZSB6aXBzXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIC8vWWVzIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkRnVuYyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwvL1xuICAgICAgICAgICAgICAgICAgICAvL05vIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIERyb3B6b25lO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsZUxpc3Q6IE9iamVjdFtdID0gbnVsbDtcbiAgICAgICAgemlwUXVlc3Rpb25BbnN3ZXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBleHBsb2RlWmlwczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkIEFjdGlvbiBVUkw6IFwiICsgcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIpO1xuXG4gICAgICAgICAgICBsZXQgaGlkZGVuSW5wdXRDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJoaWRkZW5JbnB1dENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiZGlzcGxheTogbm9uZTtcIlxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIFwiYWN0aW9uXCI6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgIFwiYXV0b1Byb2Nlc3NRdWV1ZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvKiBOb3RlOiB3ZSBhbHNvIGhhdmUgc29tZSBzdHlsaW5nIGluIG1ldGE2NC5jc3MgZm9yICdkcm9wem9uZScgKi9cbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZHJvcHpvbmVcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJkcm9wem9uZS1mb3JtLWlkXCIpXG4gICAgICAgICAgICB9LCBcIlwiKTtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIG51bGwsIG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgZm9ybSArIGhpZGRlbklucHV0Q29udGFpbmVyICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlndXJlRHJvcFpvbmUgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIGxldCBjb25maWc6IE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgIC8vIFByZXZlbnRzIERyb3B6b25lIGZyb20gdXBsb2FkaW5nIGRyb3BwZWQgZmlsZXMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6IFwiZmlsZXNcIixcbiAgICAgICAgICAgICAgICBtYXhGaWxlc2l6ZTogMixcbiAgICAgICAgICAgICAgICBwYXJhbGxlbFVwbG9hZHM6IDEwLFxuXG4gICAgICAgICAgICAgICAgLyogTm90IHN1cmUgd2hhdCdzIHRoaXMgaXMgZm9yLCBidXQgdGhlICdmaWxlcycgcGFyYW1ldGVyIG9uIHRoZSBzZXJ2ZXIgaXMgYWx3YXlzIE5VTEwsIHVubGVzc1xuICAgICAgICAgICAgICAgIHRoZSB1cGxvYWRNdWx0aXBsZSBpcyBmYWxzZSAqL1xuICAgICAgICAgICAgICAgIHVwbG9hZE11bHRpcGxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhZGRSZW1vdmVMaW5rczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6IFwiRHJhZyAmIERyb3AgZmlsZXMgaGVyZSwgb3IgQ2xpY2tcIixcbiAgICAgICAgICAgICAgICBoaWRkZW5JbnB1dENvbnRhaW5lcjogXCIjXCIgKyB0aGl6LmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFRoaXMgZG9lc24ndCB3b3JrIGF0IGFsbC4gRHJvcHpvbmUgYXBwYXJlbnRseSBjbGFpbXMgdG8gc3VwcG9ydCB0aGlzIGJ1dCBkb2Vzbid0LlxuICAgICAgICAgICAgICAgIFNlZSB0aGUgXCJzZW5kaW5nXCIgZnVuY3Rpb24gYmVsb3csIHdoZXJlIEkgZW5kZWQgdXAgcGFzc2luZyB0aGVzZSBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgIGhlYWRlcnMgOiB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCIgOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwiZXhwbG9kZVppcHNcIiA6IGV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRyb3B6b25lID0gdGhpczsgLy8gY2xvc3VyZVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXouaWQoXCJ1cGxvYWRCdXR0b25cIikpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gZ2V0IHVwbG9hZCBidXR0b24uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2UucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3B6b25lLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwiYWRkZWRmaWxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei51cGRhdGVGaWxlTGlzdCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoucnVuQnV0dG9uRW5hYmxlbWVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcInJlbW92ZWRmaWxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei51cGRhdGVGaWxlTGlzdCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoucnVuQnV0dG9uRW5hYmxlbWVudCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcInNlbmRpbmdcIiwgZnVuY3Rpb24oZmlsZSwgeGhyLCBmb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwibm9kZUlkXCIsIGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJleHBsb2RlWmlwc1wiLCB0aGlzLmV4cGxvZGVaaXBzID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJxdWV1ZWNvbXBsZXRlXCIsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKSkuZHJvcHpvbmUoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUZpbGVMaXN0ID0gKGRyb3B6b25lRXZ0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSBkcm9wem9uZUV2dC5nZXRBZGRlZEZpbGVzKCk7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gdGhpcy5maWxlTGlzdC5jb25jYXQoZHJvcHpvbmVFdnQuZ2V0UXVldWVkRmlsZXMoKSk7XG5cbiAgICAgICAgICAgIC8qIERldGVjdCBpZiBhbnkgWklQIGZpbGVzIGFyZSBjdXJyZW50bHkgc2VsZWN0ZWQsIGFuZCBhc2sgdXNlciB0aGUgcXVlc3Rpb24gYWJvdXQgd2hldGhlciB0aGV5XG4gICAgICAgICAgICBzaG91bGQgYmUgZXh0cmFjdGVkIGF1dG9tYXRpY2FsbHkgZHVyaW5nIHRoZSB1cGxvYWQsIGFuZCB1cGxvYWRlZCBhcyBpbmRpdmlkdWFsIG5vZGVzXG4gICAgICAgICAgICBmb3IgZWFjaCBmaWxlICovXG4gICAgICAgICAgICBpZiAoIXRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCAmJiB0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkV4cGxvZGUgWmlwcz9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJEbyB5b3Ugd2FudCBaaXAgZmlsZXMgZXhwbG9kZWQgb250byB0aGUgdHJlZSB3aGVuIHVwbG9hZGVkP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlllcywgZXhwbG9kZSB6aXBzXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIC8vWWVzIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5leHBsb2RlWmlwcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLmZpbGVMaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVbXCJuYW1lXCJdLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoXCIuemlwXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBydW5CdXR0b25FbmFibGVtZW50ID0gKGRyb3B6b25lRXZ0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChkcm9wem9uZUV2dC5nZXRBZGRlZEZpbGVzKCkubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgIGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkQnV0dG9uXCIpKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyZURyb3Bab25lKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tVXJsRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgVXBsb2FkRnJvbVVybERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tVXJsRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybERpdiA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRmllbGQgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVcGxvYWQgRnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsXCIpO1xuICAgICAgICAgICAgdXBsb2FkRnJvbVVybERpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICB9LCB1cGxvYWRGcm9tVXJsRmllbGQpO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIHVwbG9hZEZyb21VcmxEaXYgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRGaWxlTm93ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHNvdXJjZVVybCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1cGxvYWRGcm9tVXJsXCIpO1xuXG4gICAgICAgICAgICAvKiBpZiB1cGxvYWRpbmcgZnJvbSBVUkwgKi9cbiAgICAgICAgICAgIGlmIChzb3VyY2VVcmwpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5VcGxvYWRGcm9tVXJsUmVxdWVzdCwganNvbi5VcGxvYWRGcm9tVXJsUmVzcG9uc2U+KFwidXBsb2FkRnJvbVVybFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGF0dGFjaG1lbnQudXBsb2FkTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VVcmxcIjogc291cmNlVXJsXG4gICAgICAgICAgICAgICAgfSwgdGhpcy51cGxvYWRGcm9tVXJsUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRnJvbVVybFJlc3BvbnNlID0gKHJlczoganNvbi5VcGxvYWRGcm9tVXJsUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlVwbG9hZCBmcm9tIFVSTFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoXCJ1cGxvYWRGcm9tVXJsXCIpLCBcIlwiKTtcblxuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBFZGl0Tm9kZURsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgYWNlO1xuXG4vKlxuICogRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZXMpXG4gKlxuICovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRWRpdE5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb250ZW50RmllbGREb21JZDogc3RyaW5nO1xuICAgICAgICBmaWVsZElkVG9Qcm9wTWFwOiBhbnkgPSB7fTtcbiAgICAgICAgcHJvcEVudHJpZXM6IEFycmF5PFByb3BFbnRyeT4gPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuICAgICAgICBlZGl0UHJvcGVydHlEbGdJbnN0OiBhbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB0eXBlTmFtZT86IHN0cmluZykge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0Tm9kZURsZ1wiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFByb3BlcnR5IGZpZWxkcyBhcmUgZ2VuZXJhdGVkIGR5bmFtaWNhbGx5IGFuZCB0aGlzIG1hcHMgdGhlIERPTSBJRHMgb2YgZWFjaCBmaWVsZCB0byB0aGUgcHJvcGVydHkgb2JqZWN0IGl0XG4gICAgICAgICAgICAgKiBlZGl0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlTm9kZUJ1dHRvblwiLCB0aGlzLnNhdmVOb2RlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBQcm9wZXJ0eVwiLCBcImFkZFByb3BlcnR5QnV0dG9uXCIsIHRoaXMuYWRkUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBUYWdzXCIsIFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUYWdzUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNwbGl0Q29udGVudEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNwbGl0XCIsIFwic3BsaXRDb250ZW50QnV0dG9uXCIsIHRoaXMuc3BsaXRDb250ZW50LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uXG4gICAgICAgICAgICAgICAgKyBzcGxpdENvbnRlbnRCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uLCBcImJ1dHRvbnNcIik7XG5cbiAgICAgICAgICAgIC8qIHRvZG86IG5lZWQgc29tZXRoaW5nIGJldHRlciBmb3IgdGhpcyB3aGVuIHN1cHBvcnRpbmcgbW9iaWxlICovXG4gICAgICAgICAgICB2YXIgd2lkdGggPSA4MDA7IC8vd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gNjAwOyAvL3dpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIilcbiAgICAgICAgICAgIH0pICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IGNyZWF0ZSBDU1MgY2xhc3MgZm9yIHRoaXMuXG4gICAgICAgICAgICAgICAgc3R5bGU6IFwicGFkZGluZy1sZWZ0OiAwcHg7IG1heC13aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O3dpZHRoOjEwMCU7IG92ZXJmbG93OnNjcm9sbDsgYm9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XCIsXG4gICAgICAgICAgICAgICAgY2xhc3MgOiBcInZlcnRpY2FsLWxheW91dC1yb3dcIlxuICAgICAgICAgICAgICAgIC8vXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiXG4gICAgICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VuZXJhdGVzIGFsbCB0aGUgSFRNTCBlZGl0IGZpZWxkcyBhbmQgcHV0cyB0aGVtIGludG8gdGhlIERPTSBtb2RlbCBvZiB0aGUgcHJvcGVydHkgZWRpdG9yIGRpYWxvZyBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwb3B1bGF0ZUVkaXROb2RlUGcgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIC8qIGNsZWFyIHRoaXMgbWFwIHRvIGdldCByaWQgb2Ygb2xkIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgICAgIC8qIGVkaXROb2RlIHdpbGwgYmUgbnVsbCBpZiB0aGlzIGlzIGEgbmV3IG5vZGUgYmVpbmcgY3JlYXRlZCAqL1xuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICAvKiBpdGVyYXRvciBmdW5jdGlvbiB3aWxsIGhhdmUgdGhlIHdyb25nICd0aGlzJyBzbyB3ZSBzYXZlIHRoZSByaWdodCBvbmUgKi9cbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZSwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgICAgIHZhciBhY2VGaWVsZHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgUHJvcGVydHlJbmZvLmphdmEgb2JqZWN0c1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogV2FybmluZyBlYWNoIGl0ZXJhdG9yIGxvb3AgaGFzIGl0cyBvd24gJ3RoaXMnXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJC5lYWNoKGVkaXRPcmRlcmVkUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBwcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICogaWYgcHJvcGVydHkgbm90IGFsbG93ZWQgdG8gZGlzcGxheSByZXR1cm4gdG8gYnlwYXNzIHRoaXMgcHJvcGVydHkvaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3AubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGlkaW5nIHByb3BlcnR5OiBcIiArIHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRJZCA9IHRoaXouaWQoXCJlZGl0Tm9kZVRleHRDb250ZW50XCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgZWRpdCBmaWVsZCBcIiArIGZpZWxkSWQgKyBcIiBmb3IgcHJvcGVydHkgXCIgKyBwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc011bHRpID0gcHJvcC52YWx1ZXMgJiYgcHJvcC52YWx1ZXMubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzUmVhZE9ubHlQcm9wID0gcmVuZGVyLmlzUmVhZE9ubHlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcEVudHJ5OiBQcm9wRW50cnkgPSBuZXcgUHJvcEVudHJ5KGZpZWxkSWQsIHByb3AsIGlzTXVsdGksIGlzUmVhZE9ubHlQcm9wLCBpc0JpbmFyeVByb3AsIG51bGwpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXouZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXSA9IHByb3BFbnRyeTtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5wcm9wRW50cmllcy5wdXNoKHByb3BFbnRyeSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gdGhpei5tYWtlUHJvcGVydHlFZGl0QnV0dG9uQmFyKHByb3AsIGZpZWxkSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VNdWx0aVByb3BFZGl0b3IocHJvcEVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZVNpbmdsZVByb3BFZGl0b3IocHJvcEVudHJ5LCBhY2VGaWVsZHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB8fCBlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcInByb3BlcnR5RWRpdExpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1IaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwic3R5bGVcIiA6IFwiZGlzcGxheTogXCIrICghcmRPbmx5IHx8IG1ldGE2NC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJpbmxpbmVcIiA6IFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICB9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBFZGl0aW5nIGEgbmV3IG5vZGUgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogdGhpcyBlbnRpcmUgYmxvY2sgbmVlZHMgcmV2aWV3IG5vdyAocmVkZXNpZ24pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIG5ldyBub2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY2VGaWVsZElkID0gdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5ldyBOb2RlIE5hbWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kby0wOiBJIGNhbiByZW1vdmUgdGhpcyBkaXYgbm93ID9cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge30sIGZpZWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSSdtIG5vdCBxdWl0ZSByZWFkeSB0byBhZGQgdGhpcyBidXR0b24geWV0LlxuICAgICAgICAgICAgLy8gdmFyIHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgIC8vICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnRvZ2dsZVNob3dSZWFkT25seSgpO1wiIC8vXG4gICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgLy8gICAgIChlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcIkhpZGUgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIiA6IFwiU2hvdyBSZWFkLU9ubHkgUHJvcGVydGllc1wiKSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gZmllbGRzICs9IHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZHMpO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChhY2VGaWVsZHNbaV0uaWQpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoYWNlRmllbGRzW2ldLnZhbC51bmVuY29kZUh0bWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5hY2VFZGl0b3JzQnlJZFthY2VGaWVsZHNbaV0uaWRdID0gZWRpdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluc3RyID0gZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUgPyAvL1xuICAgICAgICAgICAgICAgIFwiWW91IG1heSBsZWF2ZSB0aGlzIGZpZWxkIGJsYW5rIGFuZCBhIHVuaXF1ZSBJRCB3aWxsIGJlIGFzc2lnbmVkLiBZb3Ugb25seSBuZWVkIHRvIHByb3ZpZGUgYSBuYW1lIGlmIHlvdSB3YW50IHRoaXMgbm9kZSB0byBoYXZlIGEgbW9yZSBtZWFuaW5nZnVsIFVSTC5cIlxuICAgICAgICAgICAgICAgIDogLy9cbiAgICAgICAgICAgICAgICBcIlwiO1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpKS5odG1sKGluc3RyKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFsbG93IGFkZGluZyBvZiBuZXcgcHJvcGVydGllcyBhcyBsb25nIGFzIHRoaXMgaXMgYSBzYXZlZCBub2RlIHdlIGFyZSBlZGl0aW5nLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gc3RhcnRcbiAgICAgICAgICAgICAqIG1hbmFnaW5nIG5ldyBwcm9wZXJ0aWVzIG9uIHRoZSBjbGllbnQgc2lkZS4gV2UgbmVlZCBhIGdlbnVpbmUgbm9kZSBhbHJlYWR5IHNhdmVkIG9uIHRoZSBzZXJ2ZXIgYmVmb3JlIHdlIGFsbG93XG4gICAgICAgICAgICAgKiBhbnkgcHJvcGVydHkgZWRpdGluZyB0byBoYXBwZW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUJ1dHRvblwiKSwgIWVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKTtcblxuICAgICAgICAgICAgdmFyIHRhZ3NQcm9wRXhpc3RzID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwidGFnc1wiLCBlZGl0LmVkaXROb2RlKSAhPSBudWxsO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoYXNUYWdzUHJvcDogXCIgKyB0YWdzUHJvcCk7XG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIpLCAhdGFnc1Byb3BFeGlzdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlU2hvd1JlYWRPbmx5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLy8gYWxlcnQoXCJub3QgeWV0IGltcGxlbWVudGVkLlwiKTtcbiAgICAgICAgICAgIC8vIHNlZSBzYXZlRXhpc3RpbmdOb2RlIGZvciBob3cgdG8gaXRlcmF0ZSBhbGwgcHJvcGVydGllcywgYWx0aG91Z2ggSSB3b25kZXIgd2h5IEkgZGlkbid0IGp1c3QgdXNlIGEgbWFwL3NldCBvZlxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyBlbGVtZW50c1xuICAgICAgICAgICAgLy8gaW5zdGVhZCBzbyBJIGRvbid0IG5lZWQgdG8gcGFyc2UgYW55IERPTSBvciBkb21JZHMgaW5vcmRlciB0byBpdGVyYXRlIG92ZXIgdGhlIGxpc3Qgb2YgdGhlbT8/Pz9cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0ID0gbmV3IEVkaXRQcm9wZXJ0eURsZyh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdC5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUYWdzUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGVkaXQuZWRpdE5vZGUsIFwidGFnc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IFwidGFnc1wiLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IFwiXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5hZGRUYWdzUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUYWdzUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkFkZCBUYWdzIFByb3BlcnR5XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlKHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE5vdGU6IGZpZWxkSWQgcGFyYW1ldGVyIGlzIGFscmVhZHkgZGlhbG9nLXNwZWNpZmljIGFuZCBkb2Vzbid0IG5lZWQgaWQoKSB3cmFwcGVyIGZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBtYWtlUHJvcGVydHlFZGl0QnV0dG9uQmFyID0gKHByb3A6IGFueSwgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgY2xlYXJCdXR0b24gPSBjbnN0LlNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUiA/IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuY2xlYXJQcm9wZXJ0eSgnXCIgKyBmaWVsZElkICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIkNsZWFyXCIpIDogXCJcIjtcblxuICAgICAgICAgICAgdmFyIGFkZE11bHRpQnV0dG9uID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBkZWxldGVCdXR0b24gPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocHJvcC5uYW1lICE9PSBqY3JDbnN0LkNPTlRFTlQgJiYgIXByb3AubmFtZS5zdGFydHNXaXRoKFwibWV0YTY0OlwiKSkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdyB3ZSBqdXN0IGdvIHdpdGggdGhlIGRlc2lnbiB3aGVyZSB0aGUgYWN0dWFsIGNvbnRlbnQgcHJvcGVydHkgY2Fubm90IGJlIGRlbGV0ZWQuIFVzZXIgY2FuIGxlYXZlXG4gICAgICAgICAgICAgICAgICogY29udGVudCBibGFuayBidXQgbm90IGRlbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuZGVsZXRlUHJvcGVydHkoJ1wiICsgcHJvcC5uYW1lICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiRGVsXCIpO1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBJIGRvbid0IHRoaW5rIGl0IHJlYWxseSBtYWtlcyBzZW5zZSB0byBhbGxvdyBhIGpjcjpjb250ZW50IHByb3BlcnR5IHRvIGJlIG11bHRpdmFsdWVkLiBJIG1heSBiZSB3cm9uZyBidXRcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIG15IGN1cnJlbnQgYXNzdW1wdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBUaGVyZSdzIGEgYnVnIGluIGVkaXRpbmcgbXVsdGlwbGUtdmFsdWVkIHByb3BlcnRpZXMsIGFuZCBzbyBpJ20ganVzdCB0dXJuaW5nIGl0IG9mZiBmb3Igbm93XG4gICAgICAgICAgICAgICAgLy93aGlsZSBpIGNvbXBsZXRlIHRlc3Rpbmcgb2YgdGhlIHJlc3Qgb2YgdGhlIGFwcC5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGFkZE11bHRpQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuYWRkU3ViUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBcIkFkZCBNdWx0aVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbEJ1dHRvbnMgPSBhZGRNdWx0aUJ1dHRvbiArIGNsZWFyQnV0dG9uICsgZGVsZXRlQnV0dG9uO1xuICAgICAgICAgICAgaWYgKGFsbEJ1dHRvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicHJvcGVydHktZWRpdC1idXR0b24tYmFyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZVByb3BlcnR5UmVxdWVzdCwganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlPihcImRlbGV0ZVByb3BlcnR5XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55LCBwcm9wZXJ0eVRvRGVsZXRlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIGRlbGV0ZWQgcHJvcGVydHkgZnJvbSBjbGllbnQgc2lkZSBzdG9yYWdlLCBzbyB3ZSBjYW4gcmUtcmVuZGVyIHNjcmVlbiB3aXRob3V0IG1ha2luZyBhbm90aGVyIGNhbGwgdG9cbiAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9wcy5kZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlUb0RlbGV0ZSk7XG5cbiAgICAgICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBzY2FuIGZvciBhbGwgbXVsdGktdmFsdWUgcHJvcGVydHkgZmllbGRzIGFuZCBjbGVhciB0aGVtICovXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHNhdmVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIGVkaXRpbmcgYW4gdW5zYXZlZCBub2RlIGl0J3MgdGltZSB0byBydW4gdGhlIGluc2VydE5vZGUsIG9yIGNyZWF0ZVN1Yk5vZGUsIHdoaWNoIGFjdHVhbGx5IHNhdmVzIG9udG8gdGhlXG4gICAgICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVOZXdOb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRWxzZSB3ZSBhcmUgZWRpdGluZyBhIHNhdmVkIG5vZGUsIHdoaWNoIGlzIGFscmVhZHkgc2F2ZWQgb24gc2VydmVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGUuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZU5ld05vZGUgPSAobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBuZXdOb2RlTmFtZSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogSWYgd2UgZGlkbid0IGNyZWF0ZSB0aGUgbm9kZSB3ZSBhcmUgaW5zZXJ0aW5nIHVuZGVyLCBhbmQgbmVpdGhlciBkaWQgXCJhZG1pblwiLCB0aGVuIHdlIG5lZWQgdG8gc2VuZCBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlck5hbWUgIT0gZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICYmIC8vXG4gICAgICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Tm9kZVJlcXVlc3QsIGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlPihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5hbWVcIjogZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiXG4gICAgICAgICAgICAgICAgfSwgZWRpdC5pbnNlcnROb2RlUmVzcG9uc2UsIGVkaXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DcmVhdGVTdWJOb2RlUmVxdWVzdCwganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2U+KFwiY3JlYXRlU3ViTm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIlxuICAgICAgICAgICAgICAgIH0sIGVkaXQuY3JlYXRlU3ViTm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVFeGlzdGluZ05vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGVcIik7XG5cbiAgICAgICAgICAgIC8qIGhvbGRzIGxpc3Qgb2YgcHJvcGVydGllcyB0byBzZW5kIHRvIHNlcnZlci4gRWFjaCBvbmUgaGF2aW5nIG5hbWUrdmFsdWUgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgICAgICAgICQuZWFjaCh0aGlzLnByb3BFbnRyaWVzLCBmdW5jdGlvbihpbmRleDogbnVtYmVyLCBwcm9wOiBhbnkpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tIEdldHRpbmcgcHJvcCBpZHg6IFwiICsgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgLyogSWdub3JlIHRoaXMgcHJvcGVydHkgaWYgaXQncyBvbmUgdGhhdCBjYW5ub3QgYmUgZWRpdGVkIGFzIHRleHQgKi9cbiAgICAgICAgICAgICAgICBpZiAocHJvcC5yZWFkT25seSB8fCBwcm9wLmJpbmFyeSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wLm11bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG5vbi1tdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BWYWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbcHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIElEOiBcIiArIHByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQocHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcFZhbCAhPT0gcHJvcC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGNoYW5nZWQ6IHByb3BOYW1lPVwiICsgcHJvcC5wcm9wZXJ0eS5uYW1lICsgXCIgcHJvcFZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AucHJvcGVydHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGRpZG4ndCBjaGFuZ2U6IFwiICsgcHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogRWxzZSB0aGlzIGlzIGEgTVVMVEkgcHJvcGVydHkgKi9cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFscyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChwcm9wLnN1YlByb3BzLCBmdW5jdGlvbihpbmRleCwgc3ViUHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1YlByb3BbXCIgKyBpbmRleCArIFwiXTogXCIgKyBKU09OLnN0cmluZ2lmeShzdWJQcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3N1YlByb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIHN1YlByb3AgSUQ6IFwiICsgc3ViUHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJTZXR0aW5nW1wiICsgcHJvcFZhbCArIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHN1YlByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBzdWJQcm9wW1wiICsgaW5kZXggKyBcIl0gb2YgXCIgKyBwcm9wLm5hbWUgKyBcIiB2YWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWxzLnB1c2gocHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVzXCI6IHByb3BWYWxzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7Ly8gZW5kIGl0ZXJhdG9yXG5cbiAgICAgICAgICAgIC8qIGlmIGFueXRoaW5nIGNoYW5nZWQsIHNhdmUgdG8gc2VydmVyICovXG4gICAgICAgICAgICBpZiAocHJvcGVydGllc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyBzYXZlTm9kZSgpLiBQb3N0RGF0YT1cIiArIHV0aWwudG9Kc29uKHBvc3REYXRhKSk7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZU5vZGVSZXF1ZXN0LCBqc29uLlNhdmVOb2RlUmVzcG9uc2U+KFwic2F2ZU5vZGVcIiwgcG9zdERhdGEsIGVkaXQuc2F2ZU5vZGVSZXNwb25zZSwgbnVsbCwge1xuICAgICAgICAgICAgICAgICAgICBzYXZlZElkOiBlZGl0LmVkaXROb2RlLmlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIGNoYW5nZWQuIE5vdGhpbmcgdG8gc2F2ZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlTXVsdGlQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWFraW5nIE11bHRpIEVkaXRvcjogUHJvcGVydHkgbXVsdGktdHlwZTogbmFtZT1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCIgY291bnQ9XCJcbiAgICAgICAgICAgICAgICArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMgPSBbXTtcblxuICAgICAgICAgICAgdmFyIHByb3BMaXN0ID0gcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlcztcbiAgICAgICAgICAgIGlmICghcHJvcExpc3QgfHwgcHJvcExpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIHByb3BMaXN0LnB1c2goXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb3AgbXVsdGktdmFsW1wiICsgaSArIFwiXT1cIiArIHByb3BMaXN0W2ldKTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKHByb3BFbnRyeS5pZCArIFwiX3N1YlByb3BcIiArIGkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcExpc3RbaV07XG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsIHx8ICcnO1xuICAgICAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IChpID09IDAgPyBwcm9wRW50cnkucHJvcGVydHkubmFtZSA6IFwiKlwiKSArIFwiLlwiICsgaTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgdGV4dGFyZWEgd2l0aCBpZD1cIiArIGlkKTtcblxuICAgICAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcy5wdXNoKHN1YlByb3ApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5iaW5hcnkgfHwgcHJvcEVudHJ5LnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVNpbmdsZVByb3BFZGl0b3IgPSAocHJvcEVudHJ5OiBQcm9wRW50cnksIGFjZUZpZWxkczogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHkgc2luZ2xlLXR5cGU6IFwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wRW50cnkucHJvcGVydHkudmFsdWU7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsID8gcHJvcFZhbCA6ICcnO1xuICAgICAgICAgICAgcHJvcFZhbFN0ciA9IHByb3BWYWxTdHIuZXNjYXBlRm9yQXR0cmliKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1ha2luZyBzaW5nbGUgcHJvcCBlZGl0b3I6IHByb3BbXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiXSB2YWxbXCIgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVcbiAgICAgICAgICAgICAgICArIFwiXSBmaWVsZElkPVwiICsgcHJvcEVudHJ5LmlkKTtcblxuICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5yZWFkT25seSB8fCBwcm9wRW50cnkuYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCI6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkucHJvcGVydHkubmFtZSA9PSBqY3JDbnN0LkNPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RmllbGREb21JZCA9IHByb3BFbnRyeS5pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBzcGxpdENvbnRlbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZUJlbG93OiBqc29uLk5vZGVJbmZvID0gZWRpdC5nZXROb2RlQmVsb3coZWRpdC5lZGl0Tm9kZSk7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TcGxpdE5vZGVSZXF1ZXN0LCBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlPihcInNwbGl0Tm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5vZGVCZWxvd0lkXCI6IChub2RlQmVsb3cgPT0gbnVsbCA/IG51bGwgOiBub2RlQmVsb3cuaWQpLFxuICAgICAgICAgICAgICAgIFwiZGVsaW1pdGVyXCI6IG51bGxcbiAgICAgICAgICAgIH0sIHRoaXMuc3BsaXRDb250ZW50UmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50UmVzcG9uc2UgPSAocmVzOiBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTcGxpdCBjb250ZW50XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgIGlmIChtZXRhNjQudHJlZURpcnR5KSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXROb2RlRGxnLmluaXRcIik7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudEZpZWxkRG9tSWQpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuY29udGVudEZpZWxkRG9tSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdFByb3BlcnR5RGxnLmpzXCIpO1xuXG4vKlxuICogUHJvcGVydHkgRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZSBQcm9wZXJ0aWVzKVxuICovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRWRpdFByb3BlcnR5RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBlZGl0Tm9kZURsZzogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVkaXROb2RlRGxnOiBhbnkpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdFByb3BlcnR5RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFZGl0IE5vZGUgUHJvcGVydHlcIik7XG5cbiAgICAgICAgICAgIHZhciBzYXZlUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJvcGVydHlCdXR0b25cIiwgdGhpcy5zYXZlUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGNhbmNlbEVkaXRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImVkaXRQcm9wZXJ0eVBnQ2xvc2VCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZVByb3BlcnR5QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIilcbiAgICAgICAgICAgICAgICAgICAgKyBcIicgY2xhc3M9J3BhdGgtZGlzcGxheS1pbi1lZGl0b3InPjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBwb3B1bGF0ZVByb3BlcnR5RWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9ICcnO1xuXG4gICAgICAgICAgICAvKiBQcm9wZXJ0eSBOYW1lIEZpZWxkICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkUHJvcE5hbWVJZCA9IFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BOYW1lSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BOYW1lSWQpLFxuICAgICAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmFtZVwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFByb3BlcnR5IFZhbHVlIEZpZWxkICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkUHJvcFZhbHVlSWQgPSBcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcFZhbHVlSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BWYWx1ZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IHRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlZhbHVlXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIiksIGZpZWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIikpO1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCIpKTtcblxuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZURhdGEsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogcHJvcGVydHlWYWx1ZURhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBXYXJuaW5nOiBkb24ndCBjb25mdXNlIHdpdGggRWRpdE5vZGVEbGcgKi9cbiAgICAgICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdE5vZGVEbGcuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVkaXROb2RlRGxnLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9wZXJ0eUVkaXQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNoYXJlVG9QZXJzb25EbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaGFyZVRvUGVyc29uRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNoYXJlVG9QZXJzb25EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNoYXJlIE5vZGUgdG8gUGVyc29uXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlciB0byBTaGFyZSBXaXRoXCIsIFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHNoYXJlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTaGFyZVwiLCBcInNoYXJlTm9kZVRvUGVyc29uQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QZXJzb24sXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIFwiPHA+RW50ZXIgdGhlIHVzZXJuYW1lIG9mIHRoZSBwZXJzb24geW91IHdhbnQgdG8gc2hhcmUgdGhpcyBub2RlIHdpdGg6PC9wPlwiICsgZm9ybUNvbnRyb2xzXG4gICAgICAgICAgICAgICAgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1BlcnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRVc2VyID0gdGhpcy5nZXRJbnB1dFZhbChcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0VXNlcikge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIHVzZXJuYW1lXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiB0YXJnZXRVc2VyLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCIsIFwid3JpdGVcIiwgXCJhZGRDaGlsZHJlblwiLCBcIm5vZGVUeXBlTWFuYWdlbWVudFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiIDogZmFsc2VcbiAgICAgICAgICAgIH0sIHRoaXoucmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiwgdGhpeik7XG4gICAgICAgIH1cblxuICAgICAgICByZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uID0gKHJlczoganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2hhcmUgTm9kZSB3aXRoIFBlcnNvblwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNoYXJpbmdEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaGFyaW5nRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNoYXJpbmdEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk5vZGUgU2hhcmluZ1wiKTtcblxuICAgICAgICAgICAgdmFyIHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHdpdGggUGVyc29uXCIsIFwic2hhcmVOb2RlVG9QZXJzb25QZ0J1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcmVOb2RlVG9QZXJzb25QZywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgbWFrZVB1YmxpY0J1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHRvIFB1YmxpY1wiLCBcInNoYXJlTm9kZVRvUHVibGljQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QdWJsaWMsXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVNoYXJpbmdCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVXaXRoUGVyc29uQnV0dG9uICsgbWFrZVB1YmxpY0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJzaGFyZU5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2Rpdj5cIiArIC8vXG4gICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSd2ZXJ0aWNhbC1sYXlvdXQtcm93JyBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICAgICArIHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIYW5kbGVzIGdldE5vZGVQcml2aWxlZ2VzIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgICAgICpcbiAgICAgICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgICAgICovXG4gICAgICAgIGdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVTaGFyaW5nUGcgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAgICAgJC5lYWNoKHJlcy5hY2xFbnRyaWVzLCBmdW5jdGlvbihpbmRleCwgYWNsRW50cnkpIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWxpc3RcIlxuICAgICAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwdWJsaWNBcHBlbmRBdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFsbG93UHVibGljQ29tbWVudGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJlcy5wdWJsaWNBcHBlbmQpIHtcbiAgICAgICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogdG9kbzogdXNlIGFjdHVhbCBwb2x5bWVyIHBhcGVyLWNoZWNrYm94IGhlcmUgKi9cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWNDb21tZW50aW5nQ2hhbmdlZCA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFVzaW5nIG9uQ2xpY2sgb24gdGhlIGVsZW1lbnQgQU5EIHRoaXMgdGltZW91dCBpcyB0aGUgb25seSBoYWNrIEkgY291bGQgZmluZCB0byBnZXQgZ2V0IHdoYXQgYW1vdW50cyB0byBhIHN0YXRlXG4gICAgICAgICAgICAgKiBjaGFuZ2UgbGlzdGVuZXIgb24gYSBwYXBlci1jaGVja2JveC4gVGhlIGRvY3VtZW50ZWQgb24tY2hhbmdlIGxpc3RlbmVyIHNpbXBseSBkb2Vzbid0IHdvcmsgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGl6LmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpKTtcblxuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCIgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogKHBvbHlFbG0ubm9kZS5jaGVja2VkID8gdHJ1ZSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlUHJpdmlsZWdlID0gKHByaW5jaXBhbDogc3RyaW5nLCBwcml2aWxlZ2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbW92ZVByaXZpbGVnZVJlcXVlc3QsIGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2U+KFwicmVtb3ZlUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiBwcmluY2lwYWwsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VcIjogcHJpdmlsZWdlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbW92ZVByaXZpbGVnZVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUucGF0aCxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlckFjbFByaXZpbGVnZXMgPSAocHJpbmNpcGFsOiBhbnksIGFjbEVudHJ5OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAkLmVhY2goYWNsRW50cnkucHJpdmlsZWdlcywgZnVuY3Rpb24oaW5kZXgsIHByaXZpbGVnZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXoubWFrZUJ1dHRvbihcIlJlbW92ZVwiLCBcInJlbW92ZVByaXZCdXR0b25cIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXouZ3VpZCArIFwiKS5yZW1vdmVQcml2aWxlZ2UoJ1wiICsgcHJpbmNpcGFsICsgXCInLCAnXCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZVxuICAgICAgICAgICAgICAgICAgICArIFwiJyk7XCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICByb3cgKz0gXCI8Yj5cIiArIHByaW5jaXBhbCArIFwiPC9iPiBoYXMgcHJpdmlsZWdlIDxiPlwiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWUgKyBcIjwvYj4gb24gdGhpcyBub2RlLlwiO1xuXG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWVudHJ5XCJcbiAgICAgICAgICAgICAgICB9LCByb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb25QZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIChuZXcgU2hhcmVUb1BlcnNvbkRsZygpKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1B1YmxpYyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hhcmluZyBub2RlIHRvIHB1YmxpYy5cIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWRkIHByaXZpbGVnZSBhbmQgdGhlbiByZWxvYWQgc2hhcmUgbm9kZXMgZGlhbG9nIGZyb20gc2NyYXRjaCBkb2luZyBhbm90aGVyIGNhbGxiYWNrIHRvIHNlcnZlclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRPRE86IHRoaXMgYWRkaXRpb25hbCBjYWxsIGNhbiBiZSBhdm9pZGVkIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCJdLFxuICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbG9hZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZW5hbWVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUmVuYW1lTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVuYW1lIE5vZGVcIik7XG5cbiAgICAgICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZVBhdGhEaXNwbGF5ID0gXCI8aDQgY2xhc3M9J3BhdGgtZGlzcGxheScgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSArIFwiJz48L2g0PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW50ZXIgbmV3IG5hbWUgZm9yIHRoZSBub2RlXCIsIFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZW5hbWVOb2RlQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZW5hbWVOb2RlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKG5ld05hbWUpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmV3IG5vZGUgbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2VsZWN0IGEgbm9kZSB0byByZW5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBpZiBubyBub2RlIGJlbG93IHRoaXMgbm9kZSwgcmV0dXJucyBudWxsICovXG4gICAgICAgICAgICB2YXIgbm9kZUJlbG93ID0gZWRpdC5nZXROb2RlQmVsb3coaGlnaGxpZ2h0Tm9kZSk7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuYW1lTm9kZVJlcXVlc3QsIGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlPihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJuZXdOYW1lXCI6IG5ld05hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGl6LnJlbmFtZU5vZGVSZXNwb25zZShyZXMsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbmFtZU5vZGVSZXNwb25zZSwgcmVuYW1pbmdQYWdlUm9vdDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVuYW1lIG5vZGVcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZW5hbWluZ1BhZ2VSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUocmVzLm5ld0lkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCByZXMubmV3SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSkuaHRtbChcIk5hbWU6IFwiICsgaGlnaGxpZ2h0Tm9kZS5uYW1lKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyBoaWdobGlnaHROb2RlLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQXVkaW9QbGF5ZXJEbGcuanNcIik7XHJcblxyXG4vKiBUaGlzIGlzIGFuIGF1ZGlvIHBsYXllciBkaWFsb2cgdGhhdCBoYXMgYWQtc2tpcHBpbmcgdGVjaG5vbG9neSBwcm92aWRlZCBieSBwb2RjYXN0LnRzICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIEF1ZGlvUGxheWVyRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc291cmNlVXJsOiBzdHJpbmcsIHByaXZhdGUgbm9kZVVpZDogc3RyaW5nLCBwcml2YXRlIHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzdXBlcihcIkF1ZGlvUGxheWVyRGxnXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0VGltZVBlbmRpbmcgaW4gY29uc3RydWN0b3I6IFwiICsgc3RhcnRUaW1lUGVuZGluZyk7XHJcbiAgICAgICAgICAgIHBvZGNhc3Quc3RhcnRUaW1lUGVuZGluZyA9IHN0YXJ0VGltZVBlbmRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBXaGVuIHRoZSBkaWFsb2cgY2xvc2VzIHdlIG5lZWQgdG8gc3RvcCBhbmQgcmVtb3ZlIHRoZSBwbGF5ZXIgKi9cclxuICAgICAgICBwdWJsaWMgY2FuY2VsKCkge1xyXG4gICAgICAgICAgICBzdXBlci5jYW5jZWwoKTtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9ICQoXCIjXCIgKyB0aGlzLmlkKFwiYXVkaW9QbGF5ZXJcIikpO1xyXG4gICAgICAgICAgICBpZiAocGxheWVyICYmIHBsYXllci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBmb3Igc29tZSByZWFzb24gdGhlIGF1ZGlvIHBsYXllciBuZWVkcyB0byBiZSBhY2Nlc3NlZCBsaWtlIGl0J3MgYW4gYXJyYXkgKi9cclxuICAgICAgICAgICAgICAgIHBsYXllclswXS5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQXVkaW8gUGxheWVyXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3RoaXMubm9kZVVpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmtub3duIG5vZGUgdWlkOiBcIiArIHRoaXMubm9kZVVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIGlzIHdoZXJlIEkgbmVlZCBhIHNob3J0IG5hbWUgb2YgdGhlIG1lZGlhIGJlaW5nIHBsYXllZCAqL1xyXG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSByZW5kZXIudGFnKFwicFwiLCB7XHJcbiAgICAgICAgICAgIH0sIHJzc1RpdGxlLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVmZXJlbmNlczpcclxuICAgICAgICAgICAgLy9odHRwOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9yZWZfYXZfZG9tLmFzcFxyXG4gICAgICAgICAgICAvL2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQXVkaW9fQVBJXHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJBdHRyaWJzOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICBcInNyY1wiOiB0aGlzLnNvdXJjZVVybCxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiAxMDAlOyBwYWRkaW5nOjBweDsgbWFyZ2luLXRvcDogMHB4OyBtYXJnaW4tbGVmdDogMHB4OyBtYXJnaW4tcmlnaHQ6IDBweDtcIixcclxuICAgICAgICAgICAgICAgIFwib250aW1ldXBkYXRlXCI6IFwibTY0LnBvZGNhc3Qub25UaW1lVXBkYXRlKCdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uY2FucGxheVwiOiBcIm02NC5wb2RjYXN0Lm9uQ2FuUGxheSgnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjb250cm9sc1wiOiBcImNvbnRyb2xzXCIsXHJcbiAgICAgICAgICAgICAgICBcInByZWxvYWRcIiA6IFwiYXV0b1wiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gcmVuZGVyLnRhZyhcImF1ZGlvXCIsIHBsYXllckF0dHJpYnMpO1xyXG5cclxuICAgICAgICAgICAgLy9Ta2lwcGluZyBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBza2lwQmFjazMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc2tpcCgtMzAsICdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCI8IDMwc1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBza2lwRm9yd2FyZDMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Quc2tpcCgzMCwgJ1wiICsgdGhpcy5ub2RlVWlkICsgXCInLCB0aGlzKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2tpcEJhY2szMEJ1dHRvbiArIHNraXBGb3J3YXJkMzBCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9TcGVlZCBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuMCk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWQxNUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuNSk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIxLjVYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMnhCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgyKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjJYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9EaWFsb2cgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgcGF1c2VCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wYXVzZSgpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGF1c2VcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnBsYXkoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwbGF5QnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBldmVuIGlmIHRoaXMgYnV0dG9uIGFwcGVhcnMgdG8gd29yaywgSSBuZWVkIGl0IHRvIGV4cGxpY2l0bHkgZW5mb3JjZSB0aGUgc2F2aW5nIG9mIHRoZSB0aW1ldmFsdWUgQU5EIHRoZSByZW1vdmVsIG9mIHRoZSBBVURJTyBlbGVtZW50IGZyb20gdGhlIERPTSAqL1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBkZXNjcmlwdGlvbiArIHBsYXllciArIHNraXBCdXR0b25CYXIgKyBzcGVlZEJ1dHRvbkJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcihudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDcmVhdGVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgICAgICBsYXN0U2VsVHlwZU5hbWU6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgICAgICBsZXQgY3JlYXRlQ2hpbGRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNyZWF0ZSBDaGlsZFwiLCBcImNyZWF0ZUNoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlQ2hpbGQsIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGNyZWF0ZUlubGluZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ3JlYXRlIElubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjcmVhdGVDaGlsZEJ1dHRvbiArIGNyZWF0ZUlubGluZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdHlwZUlkeCA9IDA7XG4gICAgICAgICAgICAvKiB0b2RvLTE6IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGVudW1lcmF0ZSBhbmQgYWRkIHRoZSB0eXBlcyB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoICovXG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiU3RhbmRhcmQgVHlwZVwiLCBcIm50OnVuc3RydWN0dXJlZFwiLCB0eXBlSWR4KyspO1xuICAgICAgICAgICAgY29udGVudCArPSB0aGlzLm1ha2VMaXN0SXRlbShcIlJTUyBGZWVkXCIsIFwibWV0YTY0OnJzc2ZlZWRcIiwgdHlwZUlkeCsrKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTeXN0ZW0gRm9sZGVyXCIsIFwibWV0YTY0OnN5c3RlbWZvbGRlclwiLCB0eXBlSWR4KyspO1xuXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEJveFwiXG4gICAgICAgICAgICB9LCBjb250ZW50KTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUxpc3RJdGVtKHZhbDogc3RyaW5nLCB0eXBlTmFtZTogc3RyaW5nLCB0eXBlSWR4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHBheWxvYWQ6IE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIFwidHlwZUlkeFwiOiB0eXBlSWR4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0SXRlbVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpLFxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLm9uUm93Q2xpY2ssIHRoaXMsIHBheWxvYWQpXG4gICAgICAgICAgICB9LCB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlQ2hpbGQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlSW5saW5lID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdC5pbnNlcnROb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUm93Q2xpY2sgPSAocGF5bG9hZDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgZGl2SWQgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgcGF5bG9hZC50eXBlSWR4KTtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbFR5cGVOYW1lID0gcGF5bG9hZC50eXBlTmFtZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFNlbERvbUlkKSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMubGFzdFNlbERvbUlkKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxEb21JZCA9IGRpdklkO1xuICAgICAgICAgICAgJChcIiNcIiArIGRpdklkKS5hZGRDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3NlYXJjaFJlc3VsdHNWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjc2VhcmNoUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC5zZWFyY2hQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC5zZWFyY2hSZXN1bHRzLCBcInNlYXJjaFJlc3VsdHNWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB0aW1lbGluZVJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVsaW5lUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIjtcclxuICAgICAgICB0YWJJZDogc3RyaW5nID0gXCJ0aW1lbGluZVRhYk5hbWVcIjtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3RpbWVsaW5lUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3RpbWVsaW5lVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19