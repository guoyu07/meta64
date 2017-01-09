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
        cnst.NEW_ON_TOOLBAR = false;
        cnst.INS_ON_TOOLBAR = false;
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
            }, 1300);
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
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeId,
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
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeData.node.id,
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
                var selNode = m64.meta64.getHighlightedNode();
                uid = selNode.uid;
            }
            var node = m64.meta64.uidToNodeMap[uid];
            if (node) {
                m64.util.json("setNodePosition", {
                    "parentNodeId": m64.meta64.currentNodeId,
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
                    return "m64.meta64.runCallback(" + callback.guid + "," + ctx.guid + "," + payloadStr + "," + delayCallback + ");";
                }
                else {
                    return "m64.meta64.runCallback(" + callback.guid + ",null,null," + delayCallback + ");";
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
            var prevPageExists = m64.nav.mainOffset > 0;
            var nextPageExists = !m64.nav.endReached;
            var selNodeCount = m64.util.getPropertyCount(meta64.selectedNodes);
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
        meta64.editSystemFile = function (fileName) {
            new m64.EditSystemFileDlg(fileName).open();
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
        nav.endReached = true;
        nav.ROWS_PER_PAGE = 25;
        nav.openMainMenuHelp = function () {
            nav.mainOffset = 0;
            m64.util.json("renderNode", {
                "nodeId": "/meta64/public/help",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        };
        nav.openRssFeedsNode = function () {
            nav.mainOffset = 0;
            m64.util.json("renderNode", {
                "nodeId": "/rss/feeds",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": nav.mainOffset,
                "goToLastPage": false
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
                "offset": nav.mainOffset,
                "goToLastPage": false
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
                    "offset": nav.mainOffset,
                    "goToLastPage": false
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
                    content += render.tag("div", {
                        "class": "systemFile",
                        "onclick": "m64.meta64.editSystemFile('" + entry.fileName + "')"
                    }, entry.fileName);
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
            var prevPageExists = m64.nav.mainOffset > 0;
            var nextPageExists = !m64.nav.endReached;
            var canMoveUp = (index > 0 && rowCount > 1) || prevPageExists;
            var canMoveDown = (index < count - 1) || nextPageExists;
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
        render.renderPageFromData = function (data, scrollToTop) {
            m64.meta64.codeFormatDirty = false;
            console.log("m64.render.renderPageFromData()");
            var newData = false;
            if (!data) {
                data = m64.meta64.currentNodeData;
            }
            else {
                newData = true;
            }
            m64.nav.endReached = data && data.endReached;
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
                var firstButton = render.makeButton("First Page", "firstPageButton", render.firstPage);
                var prevButton = render.makeButton("Prev Page", "prevPageButton", render.prevPage);
                output += render.centeredButtonBar(firstButton + prevButton, "paging-button-bar");
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
                var lastButton = render.makeButton("Last Page", "lastPageButton", render.lastPage);
                output += render.centeredButtonBar(nextButton + lastButton, "paging-button-bar");
            }
            m64.util.setHtml("listView", output);
            if (m64.meta64.codeFormatDirty) {
                prettyPrint();
            }
            $("a").attr("target", "_blank");
            m64.meta64.screenSizeChange();
            if (scrollToTop || !m64.meta64.getHighlightedNode()) {
                m64.view.scrollToTop();
            }
            else {
                m64.view.scrollToSelectedNode();
            }
        };
        render.firstPage = function () {
            console.log("First page button click.");
            m64.view.firstPage();
        };
        render.prevPage = function () {
            console.log("Prev page button click.");
            m64.view.prevPage();
        };
        render.nextPage = function () {
            console.log("Next page button click.");
            m64.view.nextPage();
        };
        render.lastPage = function () {
            console.log("Last page button click.");
            m64.view.lastPage();
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
                "offset": 0,
                "goToLastPage": false
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
        view.refreshTreeResponse = function (res, targetId, scrollToTop) {
            m64.render.renderPageFromData(res, scrollToTop);
            if (scrollToTop) {
            }
            else {
                if (targetId) {
                    m64.meta64.highlightRowById(targetId, true);
                }
                else {
                    view.scrollToSelectedNode();
                }
            }
            m64.meta64.refreshAllGuiEnablement();
            m64.util.delayedFocus("#mainNodeContent");
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
                "offset": m64.nav.mainOffset,
                "goToLastPage": false
            }, function (res) {
                if (res.offsetOfNodeFound > -1) {
                    m64.nav.mainOffset = res.offsetOfNodeFound;
                }
                view.refreshTreeResponse(res, highlightId);
                if (isInitialRender && m64.meta64.urlCmd == "addNode" && m64.meta64.homeNodeOverride) {
                    m64.edit.editMode(true);
                    m64.edit.createSubNode(m64.meta64.currentNode.uid);
                }
            });
        };
        view.firstPage = function () {
            console.log("Running firstPage Query");
            m64.nav.mainOffset = 0;
            loadPage(false);
        };
        view.prevPage = function () {
            console.log("Running prevPage Query");
            m64.nav.mainOffset -= m64.nav.ROWS_PER_PAGE;
            if (m64.nav.mainOffset < 0) {
                m64.nav.mainOffset = 0;
            }
            loadPage(false);
        };
        view.nextPage = function () {
            console.log("Running nextPage Query");
            m64.nav.mainOffset += m64.nav.ROWS_PER_PAGE;
            loadPage(false);
        };
        view.lastPage = function () {
            console.log("Running lastPage Query");
            loadPage(true);
        };
        var loadPage = function (goToLastPage) {
            m64.util.json("renderNode", {
                "nodeId": m64.meta64.currentNodeId,
                "upLevel": null,
                "renderParentIfLeaf": true,
                "offset": m64.nav.mainOffset,
                "goToLastPage": goToLastPage
            }, function (res) {
                if (goToLastPage) {
                    if (res.offsetOfNodeFound > -1) {
                        m64.nav.mainOffset = res.offsetOfNodeFound;
                    }
                }
                view.refreshTreeResponse(res, null, true);
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
                menuItem("Preferences", "accountPreferencesButton", "(new m64.PrefsDlg()).open();");
            var viewOptionsMenu = makeTopLevelMenu("View", viewOptionsMenuItems);
            var myAccountItems = menuItem("Change Password", "changePasswordPgButton", "(new m64.ChangePasswordDlg()).open();") +
                menuItem("Manage Account", "manageAccountButton", "(new m64.ManageAccountDlg()).open();");
            var myAccountMenu = makeTopLevelMenu("Account", myAccountItems);
            var adminItems = menuItem("Generate RSS", "generateRSSButton", "m64.podcast.generateRSS();") +
                menuItem("Server Info", "showServerInfoButton", "m64.view.showServerInfo();") +
                menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "m64.edit.insertBookWarAndPeace();");
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
            if (m64.meta64.isAnonUser)
                return;
            m64.util.json("setPlayerInfo", {
                "url": url,
                "timeOffset": timeOffset
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
            if (rowStyling) {
                ret += m64.render.tag("div", {
                    "class": "jcr-content"
                }, path);
            }
            else {
                ret += m64.render.tag("div", {
                    "class": "jcr-root-content"
                }, path);
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
        systemfolder.reindex = function () {
            var selNode = m64.meta64.getHighlightedNode();
            if (selNode) {
                m64.util.json("fileSearch", {
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
                    onClick = m64.meta64.encodeOnClick(callback, ctx);
                }
                onClick += m64.meta64.encodeOnClick(_this.cancel, _this, null, delayCloseCallback);
                if (onClick) {
                    attribs["onClick"] = onClick;
                }
                if (!initiallyVisible) {
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
                m64.util.delayedFocus(id);
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
console.log("running module: EditSystemFile.js");
var m64;
(function (m64) {
    var EditSystemFileDlg = (function (_super) {
        __extends(EditSystemFileDlg, _super);
        function EditSystemFileDlg(fileName) {
            var _this = this;
            _super.call(this, "EditSystemFileDlg");
            this.fileName = fileName;
            this.build = function () {
                var content = "<h2>File Editor: " + _this.fileName + "</h2>";
                var buttons = _this.makeCloseButton("Save", "SaveFileButton", _this.saveEdit)
                    + _this.makeCloseButton("Cancel", "CancelFileEditButton", _this.cancelEdit);
                content += m64.render.centeredButtonBar(buttons);
                return content;
            };
            this.saveEdit = function () {
                console.log("save.");
            };
            this.cancelEdit = function () {
                console.log("cancel.");
            };
            this.init = function () {
            };
        }
        return EditSystemFileDlg;
    }(m64.DialogBase));
    m64.EditSystemFileDlg = EditSystemFileDlg;
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
                _this.focus("searchText");
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
                        var field = "";
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
                var createFirstChildButton = _this.makeCloseButton("First", "createFirstChildButton", _this.createFirstChild, _this, true, 1000);
                var createLastChildButton = _this.makeCloseButton("Last", "createLastChildButton", _this.createLastChild, _this);
                var createInlineButton = _this.makeCloseButton("Inline", "createInlineButton", _this.createInline, _this);
                var backButton = _this.makeCloseButton("Cancel", "cancelButton");
                var buttonBar = m64.render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);
                var content = "";
                var typeIdx = 0;
                content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
                content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
                content += _this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);
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
                var node = m64.meta64.getHighlightedNode();
                if (node) {
                    var canInsertInline = m64.meta64.homeNodeId != node.id;
                    if (canInsertInline) {
                        $(_this.id("#createInlineButton")).show();
                    }
                    else {
                        $(_this.id("#createInlineButton")).hide();
                    }
                }
            };
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
            return m64.render.tag("div", {
                "class": "listItem" + (initiallySelected ? " selectedListItem" : ""),
                "id": divId,
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
                var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
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
                var header = "<h2 id='timelinePageTitle' class='page-title'></h2>";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvc3lzdGVtZm9sZGVyLnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL0VkaXRTeXN0ZW1GaWxlRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvZGxnL0NyZWF0ZU5vZGVEbGcudHMiLCIuLi90cy9wYW5lbC9zZWFyY2hSZXN1bHRzUGFuZWwudHMiLCIuLi90cy9wYW5lbC90aW1lbGluZVJlc3VsdHNQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQ0FBLFlBQVksQ0FBQztBQUtiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUs5QixJQUFJLFFBQVEsR0FBRyxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDO0lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxH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IHR5cGVzY3JpcHQtZ2VuZXJhdG9yIHZlcnNpb24gMS4xMC1TTkFQU0hPVCBvbiAyMDE2LTA3LTMxIDIwOjIxOjAxLlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpzb24ge1xuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzQ29udHJvbEVudHJ5SW5mbyB7XG4gICAgICAgICAgICBwcmluY2lwYWxOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBQcml2aWxlZ2VJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdO1xuICAgICAgICAgICAgaGFzQ2hpbGRyZW46IGJvb2xlYW47XG4gICAgICAgICAgICBoYXNCaW5hcnk6IGJvb2xlYW47XG4gICAgICAgICAgICBiaW5hcnlJc0ltYWdlOiBib29sZWFuO1xuICAgICAgICAgICAgYmluVmVyOiBudW1iZXI7XG4gICAgICAgICAgICB3aWR0aDogbnVtYmVyO1xuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgICAgICBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICB1aWQ6IHN0cmluZztcbiAgICAgICAgICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xuICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBEYXRlO1xuICAgICAgICAgICAgaW1nSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG93bmVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFByaXZpbGVnZUluZm8ge1xuICAgICAgICAgICAgcHJpdmlsZWdlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eUluZm8ge1xuICAgICAgICAgICAgdHlwZTogbnVtYmVyO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgICAgICAgICBhYmJyZXZpYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVc2VyUHJlZmVyZW5jZXMge1xuICAgICAgICAgICAgZWRpdE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBhZHZhbmNlZE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBsYXN0Tm9kZTogc3RyaW5nO1xuICAgICAgICAgICAgaW1wb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIGV4cG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICBzaG93TWV0YURhdGE6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljQXBwZW5kOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBbm9uUGFnZUxvYWRSZXF1ZXN0IHtcbiAgICAgICAgICAgIGlnbm9yZVVybDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzQ29kZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVSU1NSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgICAgICB0aW1lT2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgICAvL25vZGVQYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFBsYXllckluZm9SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgY3JlYXRlQXRUb3A6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVOb2Rlc1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkczogc3RyaW5nW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZVByb3BlcnR5UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICB0YXJnZXRGaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBpbmNsdWRlQWNsOiBib29sZWFuO1xuICAgICAgICAgICAgaW5jbHVkZU93bmVyczogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1JlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTaGFyZWROb2Rlc1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEltcG9ydFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzb3VyY2VGaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnRCb29rUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIGJvb2tOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0cnVuY2F0ZWQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudElkOiBzdHJpbmc7XG4gICAgICAgICAgICB0YXJnZXROYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBuZXdOb2RlTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdHlwZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9naW5SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgICAgICAgICAgdHpPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIGRzdDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9nb3V0UmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdGFyZ2V0Tm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICB0YXJnZXRDaGlsZElkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlcXVlc3Qge1xuICAgICAgICAgICAgc29ydERpcjogc3RyaW5nO1xuICAgICAgICAgICAgc29ydEZpZWxkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFByb3A6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRmlsZVNlYXJjaFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgICAgICByZWluZGV4OiBib29sZWFuXG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbW92ZVByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcmluY2lwYWw6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICB1cExldmVsOiBudW1iZXI7XG4gICAgICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIHJlbmRlclBhcmVudElmTGVhZjogYm9vbGVhbjtcbiAgICAgICAgICAgIGdvVG9MYXN0UGFnZTogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPcGVuU3lzdGVtRmlsZVJlcXVlc3Qge1xuICAgICAgICAgICAgZmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCB7XG4gICAgICAgICAgICBwYXJlbnROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2libGluZ0lkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNpZ251cFJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICAgICAgY2FwdGNoYTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUJlbG93SWQ6IHN0cmluZztcbiAgICAgICAgICAgIGRlbGltaXRlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZVVybDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBCcm93c2VGb2xkZXJSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRQcml2aWxlZ2VSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICAgICAgICAgIHJlbmRlck5vZGVSZXNwb25zZTogUmVuZGVyTm9kZVJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHVzZXI6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VBY2NvdW50UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlU3ViTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIGFjbEVudHJpZXM6IEFjY2Vzc0NvbnRyb2xFbnRyeUluZm9bXTtcbiAgICAgICAgICAgIG93bmVyczogc3RyaW5nW107XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZXJ2ZXJJbmZvOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbml0Tm9kZUVkaXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlSW5mbzogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHJvb3ROb2RlOiBSZWZJbmZvO1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XG4gICAgICAgICAgICB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlcztcbiAgICAgICAgICAgIGFsbG93RmlsZVN5c3RlbVNlYXJjaDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9nb3V0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VhcmNoUmVzdWx0Tm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbW92ZVByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuYW1lTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld0lkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlck5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlOiBOb2RlSW5mbztcbiAgICAgICAgICAgIGNoaWxkcmVuOiBOb2RlSW5mb1tdO1xuICAgICAgICAgICAgb2Zmc2V0T2ZOb2RlRm91bmQ6IG51bWJlcjtcblxuICAgICAgICAgICAgLyogaG9sZHMgdHJ1ZSBpZiB3ZSBoaXQgdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBjaGlsZCBub2RlcyAqL1xuICAgICAgICAgICAgZW5kUmVhY2hlZDogYm9vbGVhbjtcblxuICAgICAgICAgICAgZGlzcGxheWVkUGFyZW50OiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVNhdmVkOiBQcm9wZXJ0eUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNpZ251cFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3BsaXROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBCcm93c2VGb2xkZXJSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBsaXN0aW5nSnNvbjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc3VjY2VzczogYm9vbGVhbjtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxuY29uc29sZS5sb2coXCJydW5uaW5nIGFwcC5qc1wiKTtcblxuLy8gdmFyIG9ucmVzaXplID0gd2luZG93Lm9ucmVzaXplO1xuLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHsgaWYgKHR5cGVvZiBvbnJlc2l6ZSA9PT0gJ2Z1bmN0aW9uJykgb25yZXNpemUoKTsgLyoqIC4uLiAqLyB9XG5cbnZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChvYmplY3QuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RbXCJvblwiICsgdHlwZV0gPSBjYWxsYmFjaztcbiAgICB9XG59O1xuXG4vKlxuICogV0FSTklORzogVGhpcyBpcyBjYWxsZWQgaW4gcmVhbHRpbWUgd2hpbGUgdXNlciBpcyByZXNpemluZyBzbyBhbHdheXMgdGhyb3R0bGUgYmFjayBhbnkgcHJvY2Vzc2luZyBzbyB0aGF0IHlvdSBkb24ndFxuICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAqL1xuZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiV2luZG93UmVzaXplOiB3PVwiICsgd2luZG93LmlubmVyV2lkdGggKyBcIiBoPVwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemUpO1xuXG4vLyB0aGlzIGNvbW1lbnRlZCBzZWN0aW9uIGlzIG5vdCB3b3JraW5nIGluIG15IG5ldyB4LWFwcCBjb2RlLCBidXQgaXQncyBvayB0byBjb21tZW50IGl0IG91dCBmb3Igbm93LlxuLy9cbi8vIFRoaXMgaXMgb3VyIHRlbXBsYXRlIGVsZW1lbnQgaW4gaW5kZXguaHRtbFxuLy8gdmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4LWFwcCcpO1xuLy8gLy8gTGlzdGVuIGZvciB0ZW1wbGF0ZSBib3VuZCBldmVudCB0byBrbm93IHdoZW4gYmluZGluZ3Ncbi8vIC8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuLy8gYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbi8vICAgICBjb25zb2xlLmxvZygnYXBwIHJlYWR5IGV2ZW50IScpO1xuLy8gfSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2x5bWVyLXJlYWR5JywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xufSk7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBjbnN0LmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgY29va2llUHJlZml4O1xyXG5cclxuLy90b2RvLTE6IHR5cGVzY3JpcHQgd2lsbCBub3cgbGV0IHVzIGp1c3QgZG8gdGhpczogY29uc3QgdmFyPSd2YWx1ZSc7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgY25zdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9VU1I6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Vc3JcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGxvZ2luU3RhdGU9XCIwXCIgaWYgdXNlciBsb2dnZWQgb3V0IGludGVudGlvbmFsbHkuIGxvZ2luU3RhdGU9XCIxXCIgaWYgbGFzdCBrbm93biBzdGF0ZSBvZiB1c2VyIHdhcyAnbG9nZ2VkIGluJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJSOiBcIjxkaXYgY2xhc3M9J3ZlcnQtc3BhY2UnPjwvZGl2PlwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TX09OX1RPT0xCQVI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbiIsIlxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbiAgICAvKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuICAgIGV4cG9ydCBjbGFzcyBBZFNlZ21lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgICAgIHB1YmxpYyBlbmRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wRW50cnkge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBwcm9wZXJ0eToganNvbi5Qcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdWJQcm9wIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cclxuZGVjbGFyZSB2YXIgUG9seW1lcjtcclxuZGVjbGFyZSB2YXIgJDsgLy88LS0tLS0tLS0tLS0tLXRoaXMgd2FzIGEgd2lsZGFzcyBndWVzcy5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXJyYXkgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vV0FSTklORzogVGhlc2UgcHJvdG90eXBlIGZ1bmN0aW9ucyBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBhbnkgZnVuY3Rpb25zLlxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG4gICAgY2xvbmUoKTogQXJyYXk8VD47XHJcbiAgICBpbmRleE9mSXRlbUJ5UHJvcChwcm9wTmFtZSwgcHJvcFZhbCk6IG51bWJlcjtcclxuICAgIGFycmF5TW92ZUl0ZW0oZnJvbUluZGV4LCB0b0luZGV4KTogdm9pZDtcclxuICAgIGluZGV4T2ZPYmplY3Qob2JqOiBhbnkpOiBudW1iZXI7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmluZGV4T2ZJdGVtQnlQcm9wID0gZnVuY3Rpb24ocHJvcE5hbWUsIHByb3BWYWwpIHtcclxuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXVtwcm9wTmFtZV0gPT09IHByb3BWYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuLyogbmVlZCB0byB0ZXN0IGFsbCBjYWxscyB0byB0aGlzIG1ldGhvZCBiZWNhdXNlIGkgbm90aWNlZCBkdXJpbmcgVHlwZVNjcmlwdCBjb252ZXJzaW9uIGkgd2Fzbid0IGV2ZW4gcmV0dXJuaW5nXHJcbmEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuKi9cclxuQXJyYXkucHJvdG90eXBlLmFycmF5TW92ZUl0ZW0gPSBmdW5jdGlvbihmcm9tSW5kZXgsIHRvSW5kZXgpIHtcclxuICAgIHRoaXMuc3BsaWNlKHRvSW5kZXgsIDAsIHRoaXMuc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGF0ZSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIERhdGUge1xyXG4gICAgc3RkVGltZXpvbmVPZmZzZXQoKTogbnVtYmVyO1xyXG4gICAgZHN0KCk6IGJvb2xlYW47XHJcbn07XHJcblxyXG5EYXRlLnByb3RvdHlwZS5zdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGphbiA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICB2YXIganVsID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCA2LCAxKTtcclxuICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG59XHJcblxyXG5EYXRlLnByb3RvdHlwZS5kc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgPCB0aGlzLnN0ZFRpbWV6b25lT2Zmc2V0KCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RyaW5nIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb250YWlucyhzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICByZXBsYWNlQWxsKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdW5lbmNvZGVIdG1sKCk6IHN0cmluZztcclxuICAgIGVzY2FwZUZvckF0dHJpYigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRzV2l0aChzdHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSAhPSAtMTtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhcIiZcIikpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCcmYW1wOycsICcmJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmd0OycsICc+JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmx0OycsICc8JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJnF1b3Q7JywgJ1wiJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJiMzOTsnLCBcIidcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHV0aWwge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FqYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVvdXRNZXNzYWdlU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IG9mZmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3YWl0Q291bnRlcjogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IHBncnNEbGc6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgICAgIC8vXHRPYmplY3QucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgICAgICAvL1x0fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2YWwodmFyTmFtZSkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgYW4gYWpheCBjYWxsLCBidXQgdGhlIHNlcnZlciBhbHNvIGVuZm9yY2VzIHRoYXQgZWFjaFxyXG4gICAgICAgICAqIHNlc3Npb24gaXMgb25seSBhbGxvd2VkIG9uZSBjb25jdXJyZW50IGNhbGwgYW5kIHNpbXVsdGFuZW91cyBjYWxscyB3b3VsZCBqdXN0IFwicXVldWUgdXBcIi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKG5ldyBEYXRlKCkuZHN0KCkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFRoaXMgY2FtZSBmcm9tIGhlcmU6XHJcblx0XHQgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lPzogYW55LCB1cmw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcblx0XHQgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG5cdFx0ICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKTogYW55IHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRQcm9ncmVzc01vbml0b3IgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwocHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2dyZXNzSW50ZXJ2YWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlzV2FpdGluZyA9IGlzQWpheFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzV2FpdGluZykge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlmICh3YWl0Q291bnRlciA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGpzb24gPSBmdW5jdGlvbiA8UmVxdWVzdFR5cGUsIFJlc3BvbnNlVHlwZT4ocG9zdE5hbWU6IGFueSwgcG9zdERhdGE6IFJlcXVlc3RUeXBlLCAvL1xyXG4gICAgICAgICAgICBjYWxsYmFjaz86IChyZXNwb25zZTogUmVzcG9uc2VUeXBlLCBwYXlsb2FkPzogYW55KSA9PiBhbnksIGNhbGxiYWNrVGhpcz86IGFueSwgY2FsbGJhY2tQYXlsb2FkPzogYW55KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUgKyBcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi1QT1NUW2dlbl06IFtcIiArIHBvc3ROYW1lICsgXCJdXCIgKyBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaXJvbkFqYXggPSB0aGlzLiQkKFwiI215SXJvbkFqYXhcIik7XHJcbiAgICAgICAgICAgICAgICAvL2lyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD4pd2luZG93LmRvY3VtZW50LnJvb3QpLnF1ZXJ5U2VsZWN0b3IoXCIjaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXggPSBwb2x5RWxtTm9kZShcImlyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnVybCA9IHBvc3RUYXJnZXRVcmwgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4Lm1ldGhvZCA9IFwiUE9TVFwiO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgucGFyYW1zPSd7XCJhbHRcIjpcImpzb25cIiwgXCJxXCI6XCJjaHJvbWVcIn0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5vblJlc3BvbnNlID0gXCJ1dGlsLmlyb25BamF4UmVzcG9uc2VcIjsgLy8gb24tcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmRlYm91bmNlRHVyYXRpb24gPSBcIjMwMFwiOyAvLyBkZWJvdW5jZS1kdXJhdGlvbiAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwiRmFpbGVkIHN0YXJ0aW5nIHJlcXVlc3Q6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vdGVzXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcbiAgICAgICAgICAgICAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcbiAgICAgICAgICAgICAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcbiAgICAgICAgICAgICAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcbiAgICAgICAgICAgICAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuICAgICAgICAgICAgICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcbiAgICAgICAgICAgICAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhbid0IHdlIGp1c3QgbGV0IGNhbGxiYWNrUGF5bG9hZCBiZSB1bmRlZmluZWQsIGFuZCBjYWxsIHRoZSBhYm92ZSBjYWxsYmFjayBtZXRob2RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgbm90IGV2ZW4gaGF2ZSB0aGlzIGVsc2UgYmxvY2sgaGVyZSBhdCBhbGwgKGkuZS4gbm90IGV2ZW4gY2hlY2sgaWYgY2FsbGJhY2tQYXlsb2FkIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsL3VuZGVmaW5lZCwgYnV0IGp1c3QgdXNlIGl0LCBhbmQgbm90IGhhdmUgdGhpcyBpZiBibG9jaz8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBoYW5kbGluZyByZXN1bHQgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBGYWlsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIHV0aWwuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcm9uUmVxdWVzdC5zdGF0dXMgPT0gXCI0MDNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluIGRldGVjdGVkIGluIHV0aWwuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0TWVzc2FnZVNob3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dE1lc3NhZ2VTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2Vzc2lvbiB0aW1lZCBvdXQuIFBhZ2Ugd2lsbCByZWZyZXNoLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWUsIGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpcm9uUmVxdWVzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQW5kVGhyb3cgPSBmdW5jdGlvbihtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgICAgICB0aHJvdyBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBbmRSZVRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nLCBleGNlcHRpb246IGFueSkge1xyXG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBcIltzdGFjaywgbm90IHN1cHBvcnRlZF1cIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlICsgXCJTVEFDSzogXCIgKyBzdGFjayk7XHJcbiAgICAgICAgICAgIHRocm93IGV4Y2VwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYWpheFJlYWR5ID0gZnVuY3Rpb24ocmVxdWVzdE5hbWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKF9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0FqYXhXYWl0aW5nID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfYWpheENvdW50ZXIgPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3QgYmUgYWN0dWFsIGpxdWVyeSBzZWxlY3RvcikgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGF5ZWRGb2N1cyA9IGZ1bmN0aW9uKGlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIHNvIHVzZXIgc2VlcyB0aGUgZm9jdXMgZmFzdCB3ZSB0cnkgYXQgLjUgc2Vjb25kcyAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIHRyeSBhZ2FpbiBhIGZ1bGwgc2Vjb25kIGxhdGVyLiBOb3JtYWxseSBub3QgcmVxdWlyZWQsIGJ1dCBuZXZlciB1bmRlc2lyYWJsZSAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkZvY3VzaW5nIElEOiBcIitpZCk7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCAxMzAwKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGNvdWxkIGhhdmUgcHV0IHRoaXMgbG9naWMgaW5zaWRlIHRoZSBqc29uIG1ldGhvZCBpdHNlbGYsIGJ1dCBJIGNhbiBmb3JzZWUgY2FzZXMgd2hlcmUgd2UgZG9uJ3Qgd2FudCBhXHJcblx0XHQgKiBtZXNzYWdlIHRvIGFwcGVhciB3aGVuIHRoZSBqc29uIHJlc3BvbnNlIHJldHVybnMgc3VjY2Vzcz09ZmFsc2UsIHNvIHdlIHdpbGwgaGF2ZSB0byBjYWxsIGNoZWNrU3VjY2VzcyBpbnNpZGVcclxuXHRcdCAqIGV2ZXJ5IHJlc3BvbnNlIG1ldGhvZCBpbnN0ZWFkLCBpZiB3ZSB3YW50IHRoYXQgcmVzcG9uc2UgdG8gcHJpbnQgYSBtZXNzYWdlIHRvIHRoZSB1c2VyIHdoZW4gZmFpbCBoYXBwZW5zLlxyXG5cdFx0ICpcclxuXHRcdCAqIHJlcXVpcmVzOiByZXMuc3VjY2VzcyByZXMubWVzc2FnZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGVja1N1Y2Nlc3MgPSBmdW5jdGlvbihvcEZyaWVuZGx5TmFtZSwgcmVzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghcmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhvcEZyaWVuZGx5TmFtZSArIFwiIGZhaWxlZDogXCIgKyByZXMubWVzc2FnZSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN1Y2Nlc3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZGRzIGFsbCBhcnJheSBvYmplY3RzIHRvIG9iaiBhcyBhIHNldCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWRkQWxsID0gZnVuY3Rpb24ob2JqLCBhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm51bGwgZWxlbWVudCBpbiBhZGRBbGwgYXQgaWR4PVwiICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbnVsbE9yVW5kZWYgPSBmdW5jdGlvbihvYmopOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGhhdmUgdG8gYmUgYWJsZSB0byBtYXAgYW55IGlkZW50aWZpZXIgdG8gYSB1aWQsIHRoYXQgd2lsbCBiZSByZXBlYXRhYmxlLCBzbyB3ZSBoYXZlIHRvIHVzZSBhIGxvY2FsXHJcblx0XHQgKiAnaGFzaHNldC10eXBlJyBpbXBsZW1lbnRhdGlvblxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVaWRGb3JJZCA9IGZ1bmN0aW9uKG1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSwgaWQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1hcFtpZF07XHJcblxyXG4gICAgICAgICAgICAvKiBpZiBub3QgZm91bmQsIGdldCBuZXh0IG51bWJlciwgYW5kIGFkZCB0byBtYXAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIHVpZCA9IFwiXCIgKyBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbGVtZW50RXhpc3RzID0gZnVuY3Rpb24oaWQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGFrZXMgdGV4dGFyZWEgZG9tIElkICgjIG9wdGlvbmFsKSBhbmQgcmV0dXJucyBpdHMgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFRleHRBcmVhVmFsQnlJZCA9IGZ1bmN0aW9uKGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGRlOiBIVE1MRWxlbWVudCA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZGUpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZG9tRWxtID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUG9seW1lci5kb20oZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHlFbG1Ob2RlID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlLm5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFJlcXVpcmVkRWxlbWVudCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9ICQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldFJlcXVpcmVkRWxlbWVudC4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc09iamVjdCA9IGZ1bmN0aW9uKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50VGltZU1pbGxpcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbXB0eVN0cmluZyA9IGZ1bmN0aW9uKHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdmFsIHx8IHZhbC5sZW5ndGggPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvbHlFbG0oaWQpLm5vZGUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWxtID0gcG9seUVsbShpZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbG0gIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEVudGVyS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55KSB7XHJcbiAgICAgICAgICAgIGJpbmRLZXkoaWQsIGZ1bmMsIDEzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluZEtleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSwga2V5Q29kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICQoaWQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuXHRcdCAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcblx0XHQgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hhbmdlT3JBZGRDbGFzcyA9IGZ1bmN0aW9uKGVsbTogc3RyaW5nLCBvbGRDbGFzczogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbG1lbWVudCA9ICQoZWxtKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3Mob2xkQ2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3MobmV3Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogZGlzcGxheXMgbWVzc2FnZSAobXNnKSBvZiBvYmplY3QgaXMgbm90IG9mIHNwZWNpZmllZCB0eXBlXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHZlcmlmeVR5cGUgPSBmdW5jdGlvbihvYmo6IGFueSwgdHlwZTogYW55LCBtc2c6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SHRtbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoY29udGVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IGRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuXHJcbiAgICAgICAgICAgIC8vRm9yIFBvbHltZXIgMS4wLjAsIHlvdSBuZWVkIHRoaXMuLi5cclxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHBvbHlFbG0uaW5uZXJIVE1MID0gY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnR5Q291bnQgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBwcm9wO1xyXG5cclxuICAgICAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgYW5kIHZhbHVlc1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludE9iamVjdCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIlxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHlbXCIgKyBjb3VudCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSBrICsgXCIgLCBcIiArIHYgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmludEtleXMgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSAnLCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWwgKz0gaztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCBlbmFibGVkIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0RW5hYmxlbWVudCA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGVsbS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKGVsbUlkOiBzdHJpbmcsIHZpczogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodmlzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNob3dpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICQoZWxtKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhpZGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAkKGVsbSkuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBQcm9ncmFtYXRpY2FsbHkgY3JlYXRlcyBvYmplY3RzIGJ5IG5hbWUsIHNpbWlsYXIgdG8gd2hhdCBKYXZhIHJlZmxlY3Rpb24gZG9lc1xyXG5cclxuICAgICAgICAqIGV4OiB2YXIgZXhhbXBsZSA9IEluc3RhbmNlTG9hZGVyLmdldEluc3RhbmNlPE5hbWVkVGhpbmc+KHdpbmRvdywgJ0V4YW1wbGVDbGFzcycsIGFyZ3MuLi4pO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIDxUPihjb250ZXh0OiBPYmplY3QsIG5hbWU6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBUIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShjb250ZXh0W25hbWVdLnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICAgICAgcmV0dXJuIDxUPmluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBqY3JDbnN0LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGpjckNuc3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IENPTU1FTlRfQlk6IHN0cmluZyA9IFwiY29tbWVudEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQVUJMSUNfQVBQRU5EOiBzdHJpbmcgPSBcInB1YmxpY0FwcGVuZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFJJTUFSWV9UWVBFOiBzdHJpbmcgPSBcImpjcjpwcmltYXJ5VHlwZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUE9MSUNZOiBzdHJpbmcgPSBcInJlcDpwb2xpY3lcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBNSVhJTl9UWVBFUzogc3RyaW5nID0gXCJqY3I6bWl4aW5UeXBlc1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX0NPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX1JFQ0lQOiBzdHJpbmcgPSBcInJlY2lwXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9TVUJKRUNUOiBzdHJpbmcgPSBcInN1YmplY3RcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDUkVBVEVEX0JZOiBzdHJpbmcgPSBcImpjcjpjcmVhdGVkQnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPTlRFTlQ6IHN0cmluZyA9IFwiamNyOmNvbnRlbnRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFRBR1M6IHN0cmluZyA9IFwidGFnc1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVVJRDogc3RyaW5nID0gXCJqY3I6dXVpZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRDogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEX0JZOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQ6IHN0cmluZyA9IFwibWV0YTY0Ompzb25cIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBhdHRhY2htZW50LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGF0dGFjaG1lbnQge1xyXG4gICAgICAgIC8qIE5vZGUgYmVpbmcgdXBsb2FkZWQgdG8gKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVwbG9hZE5vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21GaWxlRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBtNjQubmFtZXNwYWNlIHZlcnNpb24hXCIpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZygpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3RlOiBUbyBydW4gbGVnYWN5IHVwbG9hZGVyIGp1c3QgcHV0IHRoaXMgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIGhlcmUsIGFuZFxyXG4gICAgICAgICAgICBub3RoaW5nIGVsc2UgaXMgcmVxdWlyZWQuIFNlcnZlciBzaWRlIHByb2Nlc3NpbmcgaXMgc3RpbGwgaW4gcGxhY2UgZm9yIGl0XHJcblxyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21GaWxlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21VcmxEbGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJEZWxldGUgdGhlIEF0dGFjaG1lbnQgb24gdGhlIE5vZGU/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXF1ZXN0LCBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZT4oXCJkZWxldGVBdHRhY2htZW50XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCBudWxsLCBub2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlLCB1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgYXR0YWNobWVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVtb3ZlQmluYXJ5QnlVaWQodWlkKTtcclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIHJlLXJlbmRlciBmcm9tIGxvY2FsIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGVkaXQuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgZWRpdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IG02NC5DcmVhdGVOb2RlRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbnNlcnRCb29rUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0Qm9va1Jlc3BvbnNlIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZGVsZXRlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlLCBwYXlsb2FkOiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZSA9IHBheWxvYWRbXCJwb3N0RGVsZXRlU2VsTm9kZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IHNlbE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIGhpZ2hsaWdodElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSBhbmQgd2UgYXJlIHRoZSBjb21tZW50ZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBTZXJ2ZXIgd2lsbCBoYXZlIHNlbnQgdXMgYmFjayB0aGUgcmF3IHRleHQgY29udGVudCwgdGhhdCBzaG91bGQgYmUgbWFya2Rvd24gaW5zdGVhZCBvZiBhbnkgSFRNTCwgc29cclxuICAgICAgICAgICAgICAgICAgICAgKiB0aGF0IHdlIGNhbiBkaXNwbGF5IHRoaXMgYW5kIHNhdmUuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGUgPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGNhbm5vdCBlZGl0IG5vZGVzIHRoYXQgeW91IGRvbid0IG93bi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIk1vdmUgbm9kZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBudWxsOyAvLyByZXNldFxyXG4gICAgICAgICAgICAgICAgbm9kZXNUb01vdmVTZXQgPSB7fTtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UmVhZE9ubHlQcm9wZXJ0aWVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTE6IG5lZWQgdG8gZmluZCBvdXQgaWYgdGhlcmUncyBhIGJldHRlciB3YXkgdG8gZG8gYW4gb3JkZXJlZCBzZXQgaW4gamF2YXNjcmlwdCBzbyBJIGRvbid0IG5lZWRcclxuICAgICAgICBib3RoIG5vZGVzVG9Nb3ZlIGFuZCBub2Rlc1RvTW92ZVNldFxyXG4gICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZVNldDogT2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50T2ZOZXdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpbmRpY2F0ZXMgZWRpdG9yIGlzIGRpc3BsYXlpbmcgYSBub2RlIHRoYXQgaXMgbm90IHlldCBzYXZlZCBvbiB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0aW5nVW5zYXZlZE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBub2RlIChOb2RlSW5mby5qYXZhKSB0aGF0IGlzIGJlaW5nIGNyZWF0ZWQgdW5kZXIgd2hlbiBuZXcgbm9kZSBpcyBjcmVhdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOb2RlIGJlaW5nIGVkaXRlZFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogdG9kby0yOiB0aGlzIGFuZCBzZXZlcmFsIG90aGVyIHZhcmlhYmxlcyBjYW4gbm93IGJlIG1vdmVkIGludG8gdGhlIGRpYWxvZyBjbGFzcz8gSXMgdGhhdCBnb29kIG9yIGJhZFxyXG4gICAgICAgICAqIGNvdXBsaW5nL3Jlc3BvbnNpYmlsaXR5P1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBJbnN0YW5jZSBvZiBFZGl0Tm9kZURpYWxvZzogRm9yIG5vdyBjcmVhdGluZyBuZXcgb25lIGVhY2ggdGltZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVEbGdJbnN0OiBFZGl0Tm9kZURsZyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHlwZT1Ob2RlSW5mby5qYXZhXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBXaGVuIGluc2VydGluZyBhIG5ldyBub2RlLCB0aGlzIGhvbGRzIHRoZSBub2RlIHRoYXQgd2FzIGNsaWNrZWQgb24gYXQgdGhlIHRpbWUgdGhlIGluc2VydCB3YXMgcmVxdWVzdGVkLCBhbmRcclxuICAgICAgICAgKiBpcyBzZW50IHRvIHNlcnZlciBmb3Igb3JkaW5hbCBwb3NpdGlvbiBhc3NpZ25tZW50IG9mIG5ldyBub2RlLiBBbHNvIGlmIHRoaXMgdmFyIGlzIG51bGwsIGl0IGluZGljYXRlcyB3ZSBhcmVcclxuICAgICAgICAgKiBjcmVhdGluZyBpbiBhICdjcmVhdGUgdW5kZXIgcGFyZW50JyBtb2RlLCB2ZXJzdXMgbm9uLW51bGwgbWVhbmluZyAnaW5zZXJ0IGlubGluZScgdHlwZSBvZiBpbnNlcnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVJbnNlcnRUYXJnZXQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgdHJ1ZSBpZiB3ZSBjYW4gJ3RyeSB0bycgaW5zZXJ0IHVuZGVyICdub2RlJyBvciBmYWxzZSBpZiBub3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzRWRpdEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogQ2hlY2sgdGhhdCBpZiB3ZSBoYXZlIGEgY29tbWVudEJ5IHByb3BlcnR5IHdlIGFyZSB0aGUgY29tbWVudGVyLCBiZWZvcmUgYWxsb3dpbmcgZWRpdCBidXR0b24gYWxzby5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgKCFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSkgfHwgcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpKSAvL1xyXG4gICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYmVzdCB3ZSBjYW4gZG8gaGVyZSBpcyBhbGxvdyB0aGUgZGlzYWJsZUluc2VydCBwcm9wIHRvIGJlIGFibGUgdG8gdHVybiB0aGluZ3Mgb2ZmLCBub2RlIGJ5IG5vZGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzSW5zZXJ0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuRElTQUJMRV9JTlNFUlQsIG5vZGUpID09IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGUgPSBmdW5jdGlvbih0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OmJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKHR5cGVOYW1lLCBjcmVhdGVBdFRvcCk7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5zYXZlTmV3Tm9kZShcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogY2FsbGVkIHRvIGRpc3BsYXkgZWRpdG9yIHRoYXQgd2lsbCBjb21lIHVwIEJFRk9SRSBhbnkgbm9kZSBpcyBzYXZlZCBvbnRvIHRoZSBzZXJ2ZXIsIHNvIHRoYXQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAgKiBhbnkgc2F2ZSBpcyBwZXJmb3JtZWQgd2Ugd2lsbCBoYXZlIHRoZSBjb3JyZWN0IG5vZGUgbmFtZSwgYXQgbGVhc3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIHZlcnNpb24gaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQsIGFuZCBjdXJyZW50bHkgdGhpcyBtZWFucyAnZWRpdGluZ1Vuc2F2ZWROb2RlJyBpcyBub3QgY3VycmVudGx5IGV2ZXJcclxuICAgICAgICAgKiB0cmlnZ2VyZWQuIFRoZSBuZXcgYXBwcm9hY2ggbm93IHRoYXQgd2UgaGF2ZSB0aGUgYWJpbGl0eSB0byAncmVuYW1lJyBub2RlcyBpcyB0byBqdXN0IGNyZWF0ZSBvbmUgd2l0aCBhXHJcbiAgICAgICAgICogcmFuZG9tIG5hbWUgYW4gbGV0IHVzZXIgc3RhcnQgZWRpdGluZyByaWdodCBhd2F5IGFuZCB0aGVuIHJlbmFtZSB0aGUgbm9kZSBJRiBhIGN1c3RvbSBub2RlIG5hbWUgaXMgbmVlZGVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhpcyBtZWFucyBpZiB3ZSBjYWxsIHRoaXMgZnVuY3Rpb24gKHN0YXJ0RWRpdGluZ05ld05vZGVXaXRoTmFtZSkgaW5zdGVhZCBvZiAnc3RhcnRFZGl0aW5nTmV3Tm9kZSgpJ1xyXG4gICAgICAgICAqIHRoYXQgd2lsbCBjYXVzZSB0aGUgR1VJIHRvIGFsd2F5cyBwcm9tcHQgZm9yIHRoZSBub2RlIG5hbWUgYmVmb3JlIGNyZWF0aW5nIHRoZSBub2RlLiBUaGlzIHdhcyB0aGUgb3JpZ2luYWxcclxuICAgICAgICAgKiBmdW5jdGlvbmFsaXR5IGFuZCBzdGlsbCB3b3Jrcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0RWRpdGluZ05ld05vZGVXaXRoTmFtZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnROb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ3JlYXRlIHN1Ym5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZU5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5TYXZlTm9kZVJlc3BvbnNlLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIC8qIGJlY2FzdXNlIEkgZG9uJ3QgdW5kZXJzdGFuZCAnZWRpdGluZ1Vuc2F2ZWROb2RlJyB2YXJpYWJsZSBhbnkgbG9uZ2VyIHVudGlsIGkgcmVmcmVzaCBteSBtZW1vcnksIGkgd2lsbCB1c2VcclxuICAgICAgICAgICAgICAgIHRoZSBvbGQgYXBwcm9hY2ggb2YgcmVmcmVzaGluZyBlbnRpcmUgdHJlZSByYXRoZXIgdGhhbiBtb3JlIGVmZmljaWVudCByZWZyZXNuTm9kZU9uUGFnZSwgYmVjdWFzZSBpdCByZXF1aXJlc1xyXG4gICAgICAgICAgICAgICAgdGhlIG5vZGUgdG8gYWxyZWFkeSBiZSBvbiB0aGUgcGFnZSwgYW5kIHRoaXMgcmVxdWlyZXMgaW4gZGVwdGggYW5hbHlzIGknbSBub3QgZ29pbmcgdG8gZG8gcmlnaHQgdGhpcyBtaW51dGUuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLy9yZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcGF5bG9hZC5zYXZlZElkKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0TW9kZSA9IGZ1bmN0aW9uKG1vZGVWYWw/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZVZhbCAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1vZGVWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0b2RvLTM6IHJlYWxseSBlZGl0IG1vZGUgYnV0dG9uIG5lZWRzIHRvIGJlIHNvbWUga2luZCBvZiBidXR0b25cclxuICAgICAgICAgICAgLy8gdGhhdCBjYW4gc2hvdyBhbiBvbi9vZmYgc3RhdGUuXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNpbmNlIGVkaXQgbW9kZSB0dXJucyBvbiBsb3RzIG9mIGJ1dHRvbnMsIHRoZSBsb2NhdGlvbiBvZiB0aGUgbm9kZSB3ZSBhcmUgdmlld2luZyBjYW4gY2hhbmdlIHNvIG11Y2ggaXRcclxuICAgICAgICAgICAgICogZ29lcyBjb21wbGV0ZWx5IG9mZnNjcmVlbiBvdXQgb2Ygdmlldywgc28gd2Ugc2Nyb2xsIGl0IGJhY2sgaW50byB2aWV3IGV2ZXJ5IHRpbWVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5zYXZlVXNlclByZWZlcmVuY2VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVXAgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IFwiW25vZGVBYm92ZV1cIlxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZURvd24gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiW25vZGVCZWxvd11cIixcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb1RvcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogXCJbdG9wTm9kZV1cIlxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvQm90dG9tID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGFib3ZlIHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSB0b3Agbm9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUFib3ZlID0gZnVuY3Rpb24obm9kZSk6IGFueSB7XHJcbiAgICAgICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKG9yZGluYWwgPD0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsIC0gMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYmVsb3cgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIGJvdHRvbSBub2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQmVsb3cgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGluYWwgPSBcIiArIG9yZGluYWwpO1xyXG4gICAgICAgICAgICBpZiAob3JkaW5hbCA9PSAtMSB8fCBvcmRpbmFsID49IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCArIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRGaXJzdENoaWxkTm9kZSA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSB8fCAhbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBydW5FZGl0Tm9kZSA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVua25vd24gbm9kZUlkIGluIGVkaXROb2RlQ2xpY2s6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5pdE5vZGVFZGl0UmVxdWVzdCwganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZT4oXCJpbml0Tm9kZUVkaXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBpbml0Tm9kZUVkaXRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydE5vZGUgPSBmdW5jdGlvbih1aWQ/OiBhbnksIHR5cGVOYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gcGFyZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZSA9IGZ1bmN0aW9uKHVpZD86IGFueSwgdHlwZU5hbWU/OiBzdHJpbmcsIGNyZWF0ZUF0VG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgbm8gdWlkIHByb3ZpZGVkIHdlIGRlYWZ1bHQgdG8gY3JlYXRpbmcgYSBub2RlIHVuZGVyIHRoZSBjdXJyZW50bHkgdmlld2VkIG5vZGUgKHBhcmVudCBvZiBjdXJyZW50IHBhZ2UpLCBvciBhbnkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICogbm9kZSBpZiB0aGVyZSBpcyBhIHNlbGVjdGVkIG5vZGUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IGhpZ2hsaWdodE5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gY3JlYXRlU3ViTm9kZTogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdGhpcyBpbmRpY2F0ZXMgd2UgYXJlIE5PVCBpbnNlcnRpbmcgaW5saW5lLiBBbiBpbmxpbmUgaW5zZXJ0IHdvdWxkIGFsd2F5cyBoYXZlIGEgdGFyZ2V0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN0YXJ0RWRpdGluZ05ld05vZGUodHlwZU5hbWUsIGNyZWF0ZUF0VG9wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVwbHlUb0NvbW1lbnQgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjcmVhdGVTdWJOb2RlKHVpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0aW9ucyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBjb3VsZCB3cml0ZSBjb2RlIHRoYXQgb25seSBzY2FucyBmb3IgYWxsIHRoZSBcIlNFTFwiIGJ1dHRvbnMgYW5kIHVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZW0sIGJ1dCBmb3Igbm93XHJcbiAgICAgICAgICAgICAqIHdlIHRha2UgdGhlIHNpbXBsZSBhcHByb2FjaCBhbmQganVzdCByZS1yZW5kZXIgdGhlIHBhZ2UuIFRoZXJlIGlzIG5vIGNhbGwgdG8gdGhlIHNlcnZlciwgc28gdGhpcyBpc1xyXG4gICAgICAgICAgICAgKiBhY3R1YWxseSB2ZXJ5IGVmZmljaWVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBEZWxldGUgdGhlIHNpbmdsZSBub2RlIGlkZW50aWZpZWQgYnkgJ3VpZCcgcGFyYW1ldGVyIGlmIHVpZCBwYXJhbWV0ZXIgaXMgcGFzc2VkLCBhbmQgaWYgdWlkIHBhcmFtZXRlciBpcyBub3RcclxuICAgICAgICAgKiBwYXNzZWQgdGhlbiB1c2UgdGhlIG5vZGUgc2VsZWN0aW9ucyBmb3IgbXVsdGlwbGUgc2VsZWN0aW9ucyBvbiB0aGUgcGFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gZGVsZXRlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSA/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9zdERlbGV0ZVNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRCZXN0UG9zdERlbGV0ZVNlbE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlTm9kZXNSZXF1ZXN0LCBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2U+KFwiZGVsZXRlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogc2VsTm9kZXNBcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGRlbGV0ZU5vZGVzUmVzcG9uc2UsIG51bGwsIHsgXCJwb3N0RGVsZXRlU2VsTm9kZVwiOiBwb3N0RGVsZXRlU2VsTm9kZSB9KTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBHZXRzIHRoZSBub2RlIHdlIHdhbnQgdG8gc2Nyb2xsIHRvIGFmdGVyIGEgZGVsZXRlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRCZXN0UG9zdERlbGV0ZVNlbE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgLyogVXNlIGEgaGFzaG1hcC10eXBlIGFwcHJvYWNoIHRvIHNhdmluZyBhbGwgc2VsZWN0ZWQgbm9kZXMgaW50byBhIGxvb3VwIG1hcCAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZXNNYXA6IE9iamVjdCA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVzQXNNYXBCeUlkKCk7XHJcbiAgICAgICAgICAgIGxldCBiZXN0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCB0YWtlTmV4dE5vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qIG5vdyB3ZSBzY2FuIHRoZSBjaGlsZHJlbiwgYW5kIHRoZSBsYXN0IGNoaWxkIHdlIGVuY291bnRlcmQgdXAgdW50aWwgd2UgZmluZCB0aGUgcmlzdCBvbmVuIGluIG5vZGVzTWFwIHdpbGwgYmUgdGhlXHJcbiAgICAgICAgICAgIG5vZGUgd2Ugd2lsbCB3YW50IHRvIHNlbGVjdCBhbmQgc2Nyb2xsIHRoZSB1c2VyIHRvIEFGVEVSIHRoZSBkZWxldGluZyBpcyBkb25lICovXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YWtlTmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpcyB0aGlzIG5vZGUgb25lIHRvIGJlIGRlbGV0ZWQgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2Rlc01hcFtub2RlLmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRha2VOZXh0Tm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBiZXN0Tm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJlc3ROb2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXRTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFxyXG4gICAgICAgICAgICAgICAgXCJDb25maXJtIEN1dFwiLFxyXG4gICAgICAgICAgICAgICAgXCJDdXQgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocyksIHRvIHBhc3RlL21vdmUgdG8gbmV3IGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IHNlbE5vZGVzQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZE5vZGVzVG9Nb3ZlU2V0KHNlbE5vZGVzQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRvZG8tMDogbmVlZCB0byBoYXZlIGEgd2F5IHRvIGZpbmQgYWxsIHNlbGVjdGVkIGNoZWNrYm94ZXMgaW4gdGhlIGd1aSBhbmQgcmVzZXQgdGhlbSBhbGwgdG8gdW5jaGVja2VkICovXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTsgLy8gY2xlYXIgc2VsZWN0aW9ucy5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogbm93IHdlIHJlbmRlciBhZ2FpbiBhbmQgdGhlIG5vZGVzIHRoYXQgd2VyZSBjdXQgd2lsbCBkaXNhcHBlYXIgZnJvbSB2aWV3ICovXHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsb2FkTm9kZXNUb01vdmVTZXQgPSBmdW5jdGlvbihub2RlSWRzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgICAgICBub2Rlc1RvTW92ZVNldCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpZCBvZiBub2RlSWRzKSB7XHJcbiAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZVNldFtpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhc3RlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBQYXN0ZVwiLCBcIlBhc3RlIFwiICsgbm9kZXNUb01vdmUubGVuZ3RoICsgXCIgbm9kZShzKSB1bmRlciBzZWxlY3RlZCBwYXJlbnQgbm9kZSA/XCIsXHJcbiAgICAgICAgICAgICAgICBcIlllcywgcGFzdGUuXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBGb3Igbm93LCB3ZSB3aWxsIGp1c3QgY3JhbSB0aGUgbm9kZXMgb250byB0aGUgZW5kIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICogcGFnZS4gTGF0ZXIgb24gd2UgY2FuIGdldCBtb3JlIHNwZWNpZmljIGFib3V0IGFsbG93aW5nIHByZWNpc2UgZGVzdGluYXRpb24gbG9jYXRpb24gZm9yIG1vdmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICogbm9kZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTW92ZU5vZGVzUmVxdWVzdCwganNvbi5Nb3ZlTm9kZXNSZXNwb25zZT4oXCJtb3ZlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldENoaWxkSWRcIjogaGlnaGxpZ2h0Tm9kZSAhPSBudWxsID8gaGlnaGxpZ2h0Tm9kZS5pZCA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBub2Rlc1RvTW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG1vdmVOb2Rlc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydEJvb2tXYXJBbmRQZWFjZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtXCIsIFwiSW5zZXJ0IGJvb2sgV2FyIGFuZCBQZWFjZT88cC8+V2FybmluZzogWW91IHNob3VsZCBoYXZlIGFuIEVNUFRZIG5vZGUgc2VsZWN0ZWQgbm93LCB0byBzZXJ2ZSBhcyB0aGUgcm9vdCBub2RlIG9mIHRoZSBib29rIVwiLCBcIlllcywgaW5zZXJ0IGJvb2suXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGluc2VydGluZyB1bmRlciB3aGF0ZXZlciBub2RlIHVzZXIgaGFzIGZvY3VzZWQgKi9cclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydEJvb2tSZXF1ZXN0LCBqc29uLkluc2VydEJvb2tSZXNwb25zZT4oXCJpbnNlcnRCb29rXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJib29rTmFtZVwiOiBcIldhciBhbmQgUGVhY2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0cnVuY2F0ZWRcIjogdXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgaW5zZXJ0Qm9va1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWV0YTY0LmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIE1haW4gQXBwbGljYXRpb24gaW5zdGFuY2UsIGFuZCBjZW50cmFsIHJvb3QgbGV2ZWwgb2JqZWN0IGZvciBhbGwgY29kZSwgYWx0aG91Z2ggZWFjaCBtb2R1bGUgZ2VuZXJhbGx5IGNvbnRyaWJ1dGVzIG9uZVxyXG4gKiBzaW5nbGV0b24gdmFyaWFibGUgdG8gdGhlIGdsb2JhbCBzY29wZSwgd2l0aCBhIG5hbWUgdXN1YWxseSBpZGVudGljYWwgdG8gdGhhdCBmaWxlLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG1ldGE2NCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYXBwSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJVcmxQYXRoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXJsQ21kOiBzdHJpbmc7XHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZU92ZXJyaWRlOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY29kZUZvcm1hdERpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIHVzZWQgYXMgYSBraW5kIG9mICdzZXF1ZW5jZScgaW4gdGhlIGFwcCwgd2hlbiB1bmlxdWUgdmFscyBhIG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dEd1aWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8qIG5hbWUgb2YgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1c2VyTmFtZTogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuXHJcbiAgICAgICAgLyogc2NyZWVuIGNhcGFiaWxpdGllcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGV2aWNlV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCBkZXZpY2VIZWlnaHQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVXNlcidzIHJvb3Qgbm9kZS4gVG9wIGxldmVsIG9mIHdoYXQgbG9nZ2VkIGluIHVzZXIgaXMgYWxsb3dlZCB0byBzZWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZUlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVQYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNwZWNpZmllcyBpZiB0aGlzIGlzIGFkbWluIHVzZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0FkbWluVXNlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBhbHdheXMgc3RhcnQgb3V0IGFzIGFub24gdXNlciB1bnRpbCBsb2dpbiAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBbm9uVXNlcjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZXhwb3J0IGxldCBhbm9uVXNlckxhbmRpbmdQYWdlTm9kZTogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93RmlsZVN5c3RlbVNlYXJjaDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNpZ25hbHMgdGhhdCBkYXRhIGhhcyBjaGFuZ2VkIGFuZCB0aGUgbmV4dCB0aW1lIHdlIGdvIHRvIHRoZSBtYWluIHRyZWUgdmlldyB3aW5kb3cgd2UgbmVlZCB0byByZWZyZXNoIGRhdGFcclxuICAgICAgICAgKiBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRyZWVEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUuaWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIE1hcHMgZnJvbSB0aGUgRE9NIElEIHRvIHRoZSBlZGl0b3IgamF2YXNjcmlwdCBpbnN0YW5jZSAoQWNlIEVkaXRvciBpbnN0YW5jZSkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFjZUVkaXRvcnNCeUlkOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogY291bnRlciBmb3IgbG9jYWwgdWlkcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFVpZDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAgICAgKiB0byB3aGVuZXZlciB0aGUgcGFnZSB3aXRoIHRoYXQgY2hpbGQgaXMgdmlzaXRlZCwgYW5kIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwIGhvbGRzIHRoZSBtYXAgb2YgXCJwYXJlbnQgdWlkIHRvXHJcbiAgICAgICAgICogc2VsZWN0ZWQgbm9kZSAoTm9kZUluZm8gb2JqZWN0KVwiLCB3aGVyZSB0aGUga2V5IGlzIHRoZSBwYXJlbnQgbm9kZSB1aWQsIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGN1cnJlbnRseVxyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAgICAgKiBiZWluZyBhYmxlIHRvIHNjcm9sbCB0byB0aGUgbm9kZSBkdXJpbmcgbmF2aWdhdGluZyBhcm91bmQgb24gdGhlIHRyZWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLyogVXNlci1zZWxlY3RhYmxlIHVzZXItYWNjb3VudCBvcHRpb25zIGVhY2ggdXNlciBjYW4gc2V0IG9uIGhpcyBhY2NvdW50ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX0FEVkFOQ0VEOiBzdHJpbmcgPSBcImFkdmFuY2VkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLyogY2FuIGJlICdzaW1wbGUnIG9yICdhZHZhbmNlZCcgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlT3B0aW9uOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZ2dsZWQgYnkgYnV0dG9uLCBhbmQgaG9sZHMgaWYgd2UgYXJlIGdvaW5nIHRvIHNob3cgcHJvcGVydGllcyBvciBub3Qgb24gZWFjaCBub2RlIGluIHRoZSBtYWluIHZpZXdcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dQcm9wZXJ0aWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIEZsYWcgdGhhdCBpbmRpY2F0ZXMgaWYgd2UgYXJlIHJlbmRlcmluZyBwYXRoLCBvd25lciwgbW9kVGltZSwgZXRjLiBvbiBlYWNoIHJvdyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd01ldGFEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTGlzdCBvZiBub2RlIHByZWZpeGVzIHRvIGZsYWcgbm9kZXMgdG8gbm90IGFsbG93IHRvIGJlIHNob3duIGluIHRoZSBwYWdlIGluIHNpbXBsZSBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdDogYW55ID0ge1xyXG4gICAgICAgICAgICBcInJlcDpcIjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWFkT25seVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluYXJ5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIGFsbCBub2RlIHVpZHMgdG8gdHJ1ZSBpZiBzZWxlY3RlZCwgb3RoZXJ3aXNlIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZGVsZXRlZCAobm90IGV4aXN0aW5nKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIFNldCBvZiBhbGwgbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZWQgKGZyb20gdGhlIGFiYnJldmlhdGVkIGZvcm0pICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBleHBhbmRlZEFiYnJldk5vZGVJZHM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlRGF0YTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBhbGwgdmFyaWFibGVzIGRlcml2YWJsZSBmcm9tIGN1cnJlbnROb2RlRGF0YSwgYnV0IHN0b3JlZCBkaXJlY3RseSBmb3Igc2ltcGxlciBjb2RlL2FjY2Vzc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZUlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVQYXRoOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gZ3VpZCB0byBEYXRhIE9iamVjdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGF0YU9iak1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fTtcclxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlclByZWZlcmVuY2VzOiBqc29uLlVzZXJQcmVmZXJlbmNlcyA9IHtcclxuICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwibGFzdE5vZGVcIjogXCJcIixcclxuICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVNYWluTWVudVBhbmVsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICAgICAqIGZ1dHVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZ2lzdGVyRGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFkYXRhLmd1aWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbmV4dEd1aWQ7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9iamVjdEJ5R3VpZCA9IGZ1bmN0aW9uKGd1aWQpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGRhdGFPYmpNYXBbZ3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGNhbGxiYWNrIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgc2NyaXB0IHRvIHJ1biwgb3IgaWYgaXQncyBhIGZ1bmN0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmVcclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbmV2ZXIgd2UgYXJlIGJ1aWxkaW5nIGFuIG9uQ2xpY2sgc3RyaW5nLCBhbmQgd2UgaGF2ZSB0aGUgYWN0dWFsIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiB0aGUgbmFtZSBvZiB0aGVcclxuICAgICAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAgICAgKiB0byB0aGUgZnVuY3Rpb24gb2JqZWN0LCBhbmQgdGhlbiBlbmNvZGUgYSBjYWxsIHRvIHJ1biB0aGF0IGd1aWQgYnkgY2FsbGluZyBydW5DYWxsYmFjay4gVGhlcmUgaXMgYSBsZXZlbCBvZlxyXG4gICAgICAgICAqIGluZGlyZWN0aW9uIGhlcmUsIGJ1dCB0aGlzIGlzIHRoZSBzaW1wbGVzdCBhcHByb2FjaCB3aGVuIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBtYXAgZnJvbSBhIHN0cmluZyB0byBhXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBjdHg9Y29udGV4dCwgd2hpY2ggaXMgdGhlICd0aGlzJyB0byBjYWxsIHdpdGggaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCBhbmQgaGF2ZSBhICd0aGlzJyBjb250ZXh0IHRvIGJpbmQgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBwYXlsb2FkIGlzIGFueSBkYXRhIG9iamVjdCB0aGF0IG5lZWRzIHRvIGJlIHBhc3NlZCBhdCBydW50aW1lXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub3RlOiBkb2Vzbid0IGN1cnJlbnRseSBzdXBwb3J0IGhhdmluZ24gYSBudWxsIGN0eCBhbmQgbm9uLW51bGwgcGF5bG9hZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZU9uQ2xpY2sgPSBmdW5jdGlvbihjYWxsYmFjazogYW55LCBjdHg/OiBhbnksIHBheWxvYWQ/OiBhbnksIGRlbGF5Q2FsbGJhY2s/OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KGN0eCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChwYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBheWxvYWRTdHIgPSBwYXlsb2FkID8gcGF5bG9hZC5ndWlkIDogXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vdG9kby0wOiB3aHkgaXNuJ3QgcGF5bG9hZFN0ciBpbiBxdW90ZXM/IEl0IHdhcyBsaWtlIHRoaXMgZXZlbiBiZWZvcmUgc3dpdGNoaW5nIHRvIGJhY2t0aWNrIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgbTY0Lm1ldGE2NC5ydW5DYWxsYmFjaygke2NhbGxiYWNrLmd1aWR9LCR7Y3R4Lmd1aWR9LCR7cGF5bG9hZFN0cn0sJHtkZWxheUNhbGxiYWNrfSk7YDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBtNjQubWV0YTY0LnJ1bkNhbGxiYWNrKCR7Y2FsbGJhY2suZ3VpZH0sbnVsbCxudWxsLCR7ZGVsYXlDYWxsYmFja30pO2A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuZXhwZWN0ZWQgY2FsbGJhY2sgdHlwZSBpbiBlbmNvZGVPbkNsaWNrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQsIGRlbGF5Q2FsbGJhY2s/OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsYmFjayBydW46IFwiK2RlbGF5Q2FsbGJhY2spO1xyXG4gICAgICAgICAgICAvKiBkZXBlbmRpbmcgb24gZGVsYXlDYWxsYmFjaywgcnVuIHRoZSBjYWxsYmFjayBlaXRoZXIgaW1tZWRpYXRlbHkgb3Igd2l0aCBhIGRlbGF5ICovXHJcbiAgICAgICAgICAgIGlmIChkZWxheUNhbGxiYWNrID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBydW5DYWxsYmFja0ltbWVkaWF0ZShndWlkLCBjdHgsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgfSwgZGVsYXlDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBydW5DYWxsYmFja0ltbWVkaWF0ZSA9IGZ1bmN0aW9uKGd1aWQsIGN0eCwgcGF5bG9hZCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YU9iaiA9IGdldE9iamVjdEJ5R3VpZChndWlkKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gb2JqZWN0LCB3ZSBleHBlY3QgaXQgdG8gaGF2ZSBhICdjYWxsYmFjaycgcHJvcGVydHlcclxuICAgICAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGlmIChkYXRhT2JqLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gb3IgZWxzZSBzb21ldGltZXMgdGhlIHJlZ2lzdGVyZWQgb2JqZWN0IGl0c2VsZiBpcyB0aGUgZnVuY3Rpb24sXHJcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIG9rIHRvb1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXogPSBnZXRPYmplY3RCeUd1aWQoY3R4KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF5bG9hZE9iaiA9IHBheWxvYWQgPyBnZXRPYmplY3RCeUd1aWQocGF5bG9hZCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbCh0aGl6LCBwYXlsb2FkT2JqKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iaigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmFibGUgdG8gZmluZCBjYWxsYmFjayBvbiByZWdpc3RlcmVkIGd1aWQ6IFwiICsgZ3VpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVkaXRNb2RlT3B0aW9uID09PSBNT0RFX1NJTVBMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBnb1RvTWFpblBhZ2UodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdvVG9NYWluUGFnZSA9IGZ1bmN0aW9uKHJlcmVuZGVyPzogYm9vbGVhbiwgZm9yY2VTZXJ2ZXJSZWZyZXNoPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKGZvcmNlU2VydmVyUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgdHJlZURpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcmVuZGVyIHx8IHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCByZS1yZW5kZXJpbmcgcGFnZSAoZWl0aGVyIGZyb20gc2VydmVyLCBvciBmcm9tIGxvY2FsIGRhdGEsIHRoZW4gd2UganVzdCBuZWVkIHRvIGxpdHRlcmFsbHkgc3dpdGNoXHJcbiAgICAgICAgICAgICAqIHBhZ2UgaW50byB2aXNpYmxlLCBhbmQgc2Nyb2xsIHRvIG5vZGUpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWxlY3RUYWIgPSBmdW5jdGlvbihwYWdlTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgaXJvblBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBjb2RlIGNhbiBiZSBtYWRlIG1vcmUgRFJZLCBidXQgaSdtIGp1c3QgdHJ5aW5nIGl0IG91dCBmb3Igbm93LCBzbyBpJ20gbm90IGJvdGhlcmluZyB0byBwZXJmZWN0IGl0IHlldC4gKi9cclxuICAgICAgICAgICAgLy8gJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvLyAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gaWYgKHBhZ2VOYW1lID09ICdtYWluVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICdzZWFyY2hUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAndGltZWxpbmVUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGRhdGEgKGlmIHByb3ZpZGVkKSBtdXN0IGJlIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgZGlhbG9nLCBhbmQgYWxsIHRoZSBkaWFsb2dcclxuICAgICAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgICAgICogT09QIHdpdGggJ3RoaXMnIGJlaW5nIGZpcnN0IHBhcmFtZXRlciBhbHdheXMpLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZVBhZ2UgPSBmdW5jdGlvbihwZz86IGFueSwgZGF0YT86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBnLnRhYklkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvb3BzLCB3cm9uZyBvYmplY3QgdHlwZSBwYXNzZWQgdG8gY2hhbmdlUGFnZSBmdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHVzaW5nIG1haW5Jcm9uUGFnZXM/PyAqL1xyXG4gICAgICAgICAgICB2YXIgcGFwZXJUYWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpOyAvL1wiI21haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9kZUJsYWNrTGlzdGVkID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIWluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIG5vZGUubmFtZS5zdGFydHNXaXRoKHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlVWlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IHN0cmluZ1tdID0gW10sIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheS5wdXNoKHVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgUmV0dXJucyBhIG5ld2x5IGNsb25lZCBhcnJheSBvZiBhbGwgdGhlIHNlbGVjdGVkIG5vZGVzIGVhY2ggdGltZSBpdCdzIGNhbGxlZC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkgPSBmdW5jdGlvbigpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheTogc3RyaW5nW10gPSBbXSwgdWlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHNlbGVjdGVkIG5vZGVzLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVuYWJsZSB0byBmaW5kIHVpZFRvTm9kZU1hcCBmb3IgdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxBcnJheS5wdXNoKG5vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm4gYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgZWFjaCBOb2RlSW5mbyB3aGVyZSB0aGUga2V5IGlzIHRoZSBpZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCA9IGZ1bmN0aW9uKCk6IE9iamVjdCB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2Rlc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJldFtzZWxBcnJheVtpXS5pZF0gPSBzZWxBcnJheVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyBzZWxlY3RlZCBub2RlcyBhcyBOb2RlSW5mby5qYXZhIG9iamVjdHMgYXJyYXkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBcnJheSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gW107XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0ZWROb2RlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMsIG5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IG93bmVyQnVmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbWluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5vd25lcnMpIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChyZXMub3duZXJzLCBmdW5jdGlvbihpbmRleCwgb3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gb3duZXI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5vZGUub3duZXIgPSBvd25lckJ1ZjtcclxuICAgICAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI293bmVyRGlzcGxheVwiICsgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmh0bWwoXCIgKE1hbmFnZXI6IFwiICsgb3duZXJCdWYgKyBcIilcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1vdGhlclwiLCBcImNyZWF0ZWQtYnktbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1tZVwiLCBcImNyZWF0ZWQtYnktb3RoZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm8gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTm9kZUluZm9SZXNwb25zZShyZXMsIG5vZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUZyb21JZCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkVG9Ob2RlTWFwW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UGF0aE9mVWlkID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIltwYXRoIGVycm9yLiBpbnZhbGlkIHVpZDogXCIgKyB1aWQgKyBcIl1cIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IGpzb24uTm9kZUluZm8gPSBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodFJvd0J5SWQgPSBmdW5jdGlvbihpZCwgc2Nyb2xsKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0Tm9kZUZyb21JZChpZCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHROb2RlKG5vZGUsIHNjcm9sbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpZ2hsaWdodFJvd0J5SWQgZmFpbGVkIHRvIGZpbmQgaWQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudDogV2Ugd2FudCB0aGlzIHRvIGJlIHRoZSBvbmx5IG1ldGhvZCB0aGF0IGNhbiBzZXQgdmFsdWVzIG9uICdwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCcsIGFuZCBhbHdheXNcclxuICAgICAgICAgKiBzZXR0aW5nIHRoYXQgdmFsdWUgc2hvdWxkIGdvIHRocnUgdGhpcyBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzY3JvbGw6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRvbmVIaWdobGlnaHRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qIFVuaGlnaGxpZ2h0IGN1cnJlbnRseSBoaWdobGlnaHRlZCBub2RlIGlmIGFueSAqL1xyXG4gICAgICAgICAgICBsZXQgY3VySGlnaGxpZ2h0ZWROb2RlOiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFscmVhZHkgaGlnaGxpZ2h0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmVIaWdobGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQgPSBjdXJIaWdobGlnaHRlZE5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRvbmVIaWdobGlnaHRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbTogc3RyaW5nID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGZpbmQgcm93RWxlbWVudCB0byBoaWdobGlnaHQ6IFwiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVhbGx5IG5lZWQgdG8gdXNlIHB1Yi9zdWIgZXZlbnQgdG8gYnJvYWRjYXN0IGVuYWJsZW1lbnQsIGFuZCBsZXQgZWFjaCBjb21wb25lbnQgZG8gdGhpcyBpbmRlcGVuZGVudGx5IGFuZFxyXG4gICAgICAgICAqIGRlY291cGxlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICAgICAgbGV0IHByZXZQYWdlRXhpc3RzOiBib29sZWFuID0gbmF2Lm1haW5PZmZzZXQgPiAwO1xyXG4gICAgICAgICAgICBsZXQgbmV4dFBhZ2VFeGlzdHM6IGJvb2xlYW4gPSAhbmF2LmVuZFJlYWNoZWQ7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlQ291bnQ6IG51bWJlciA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVJc01pbmU6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgKGhpZ2hsaWdodE5vZGUuY3JlYXRlZEJ5ID09PSB1c2VyTmFtZSB8fCBcImFkbWluXCIgPT09IHVzZXJOYW1lKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhvbWVOb2RlSWQ9XCIrbWV0YTY0LmhvbWVOb2RlSWQrXCIgaGlnaGxpZ2h0Tm9kZS5pZD1cIitoaWdobGlnaHROb2RlLmlkKTtcclxuICAgICAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkO1xyXG4gICAgICAgICAgICBsZXQgaW1wb3J0RmVhdHVyZUVuYWJsZWQgPSBpc0FkbWluVXNlciB8fCB1c2VyUHJlZmVyZW5jZXMuaW1wb3J0QWxsb3dlZDtcclxuICAgICAgICAgICAgbGV0IGV4cG9ydEZlYXR1cmVFbmFibGVkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmV4cG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHRPcmRpbmFsOiBudW1iZXIgPSBnZXRPcmRpbmFsT2ZOb2RlKGhpZ2hsaWdodE5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgbnVtQ2hpbGROb2RlczogbnVtYmVyID0gZ2V0TnVtQ2hpbGROb2RlcygpO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gKGhpZ2hsaWdodE9yZGluYWwgPiAwICYmIG51bUNoaWxkTm9kZXMgPiAxKSB8fCBwcmV2UGFnZUV4aXN0cztcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gKGhpZ2hsaWdodE9yZGluYWwgPCBudW1DaGlsZE5vZGVzIC0gMSAmJiBudW1DaGlsZE5vZGVzID4gMSkgfHwgbmV4dFBhZ2VFeGlzdHM7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogbmVlZCB0byBhZGQgdG8gdGhpcyBzZWxOb2RlSXNNaW5lIHx8IHNlbFBhcmVudElzTWluZTtcclxuICAgICAgICAgICAgbGV0IGNhbkNyZWF0ZU5vZGUgPSB1c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgKGlzQWRtaW5Vc2VyIHx8ICghaXNBbm9uVXNlciAvKiAmJiBzZWxOb2RlSXNNaW5lICovKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVuYWJsZW1lbnQ6IGlzQW5vblVzZXI9XCIgKyBpc0Fub25Vc2VyICsgXCIgc2VsTm9kZUNvdW50PVwiICsgc2VsTm9kZUNvdW50ICsgXCIgc2VsTm9kZUlzTWluZT1cIiArIHNlbE5vZGVJc01pbmUpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibmF2TG9nb3V0QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIGlzQW5vblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BzVG9nZ2xlOiBib29sZWFuID0gY3VycmVudE5vZGUgJiYgIWlzQW5vblVzZXI7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInByb3BzVG9nZ2xlQnV0dG9uXCIsIHByb3BzVG9nZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxvd0VkaXRNb2RlOiBib29sZWFuID0gY3VycmVudE5vZGUgJiYgIWlzQW5vblVzZXI7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBMZXZlbEJ1dHRvblwiLCBjdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY3V0U2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwYXN0ZVNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGVkaXQubm9kZXNUb01vdmUgIT0gbnVsbCAmJiAoc2VsTm9kZUlzTWluZSB8fCBob21lTm9kZVNlbGVjdGVkKSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlRG93bkJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBjYW5Nb3ZlRG93bik7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjaGFuZ2VQYXNzd29yZFBnQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBpc0FkbWluVXNlciB8fCAodXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIGhpZ2hsaWdodE5vZGUuaGFzQmluYXJ5ICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGFsbG93RmlsZVN5c3RlbVNlYXJjaCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlZnJlc2hQYWdlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjcmVhdGVOb2RlQnV0dG9uXCIsIGNhbkNyZWF0ZU5vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkICYmIChzZWxOb2RlSXNNaW5lIHx8IChoaWdobGlnaHROb2RlICE9IG51bGwgJiYgaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkKSkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuRXhwb3J0RGxnXCIsIGV4cG9ydEZlYXR1cmVFbmFibGVkICYmIChzZWxOb2RlSXNNaW5lIHx8IChoaWdobGlnaHROb2RlICE9IG51bGwgJiYgaG9tZU5vZGVJZCA9PSBoaWdobGlnaHROb2RlLmlkKSkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEZlYXR1cmVFbmFibGVkKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImZpbGVTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgYWxsb3dGaWxlU3lzdGVtU2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIC8vVG9wIExldmVsIE1lbnUgVmlzaWJpbGl0eVxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJhZG1pbk1lbnVcIiwgaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2luZ2xlU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZztcclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQgYSBzaW5nbGUgU2VsIE5vZGVJRDogXCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T3JkaW5hbE9mTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUgfHwgIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmlkID09PSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE51bUNoaWxkTm9kZXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnROb2RlRGF0YSB8fCAhY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0Q3VycmVudE5vZGVEYXRhID0gZnVuY3Rpb24oZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZURhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGRhdGEubm9kZTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVVaWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZUlkID0gZGF0YS5ub2RlLmlkO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVBhdGggPSBkYXRhLm5vZGUucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblBhZ2VMb2FkUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQW5vblBhZ2VMb2FkUmVzcG9uc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzLnJlbmRlck5vZGVSZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW1vdmVCaW5hcnlCeVVpZCA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaGFzQmluYXJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdXBkYXRlcyBjbGllbnQgc2lkZSBtYXBzIGFuZCBjbGllbnQtc2lkZSBpZGVudGlmaWVyIGZvciBuZXcgbm9kZSwgc28gdGhhdCB0aGlzIG5vZGUgaXMgJ3JlY29nbml6ZWQnIGJ5IGNsaWVudFxyXG4gICAgICAgICAqIHNpZGUgY29kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCB1cGRhdGVNYXBzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBhc3NpZ24gYSBwcm9wZXJ0eSBmb3IgZGV0ZWN0aW5nIHRoaXMgbm9kZSB0eXBlLCBJJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiB1c2luZyBzb21lIGtpbmQgb2YgY3VzdG9tIEpTXHJcbiAgICAgICAgICAgICAqIHByb3RvdHlwZS1yZWxhdGVkIGFwcHJvYWNoXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHVwZGF0ZU1hcHMgPyB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpIDogaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBGb3IgdGhlc2UgdHdvIHByb3BlcnRpZXMgdGhhdCBhcmUgYWNjZXNzZWQgZnJlcXVlbnRseSB3ZSBnbyBhaGVhZCBhbmQgbG9va3VwIHRoZSBwcm9wZXJ0aWVzIGluIHRoZVxyXG4gICAgICAgICAgICAgKiBwcm9wZXJ0eSBhcnJheSwgYW5kIGFzc2lnbiB0aGVtIGRpcmVjdGx5IGFzIG5vZGUgb2JqZWN0IHByb3BlcnRpZXMgc28gdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYW5kIGFsc29cclxuICAgICAgICAgICAgICogc2ltcGxpZnkgY29kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUuY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuTEFTVF9NT0RJRklFRCwgbm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZU1hcHMpIHtcclxuICAgICAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgaWRUb05vZGVNYXBbbm9kZS5pZF0gPSBub2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRDb25zdGFudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBPTElDWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwocmVhZE9ubHlQcm9wZXJ0eUxpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5hZGRBbGwoYmluYXJ5UHJvcGVydHlMaXN0LCBbamNyQ25zdC5CSU5fREFUQV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdG9kby0wOiB0aGlzIGFuZCBldmVyeSBvdGhlciBtZXRob2QgdGhhdCdzIGNhbGxlZCBieSBhIGxpdHN0ZW5lciBvciBhIHRpbWVyIG5lZWRzIHRvIGhhdmUgdGhlICdmYXQgYXJyb3cnIHN5bnRheCBmb3IgdGhpcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEFwcCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXRBcHAgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBhcHBJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgIHRhYnMuYWRkRXZlbnRMaXN0ZW5lcihcImlyb24tc2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGFiQ2hhbmdlRXZlbnQodGFicy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5pdENvbnN0YW50cygpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2lnbnVwTWVzc2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdG9kby0zOiBob3cgZG9lcyBvcmllbnRhdGlvbmNoYW5nZSBuZWVkIHRvIHdvcmsgZm9yIHBvbHltZXI/IFBvbHltZXIgZGlzYWJsZWRcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgXy5vcmllbnRhdGlvbkhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTGVhdmUgTWV0YTY0ID9cIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJIHRob3VnaHQgdGhpcyB3YXMgYSBnb29kIGlkZWEsIGJ1dCBhY3R1YWxseSBpdCBkZXN0cm95cyB0aGUgc2Vzc2lvbiwgd2hlbiB0aGUgdXNlciBpcyBlbnRlcmluZyBhblxyXG4gICAgICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rICBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgICAgICogZ29pbmcgdG8gYSBkaWZmZXJlbnQgdXJsIHNob3VsZG4ndCBibG93IHVwIHRoZSBzZXNzaW9uLCB3aGljaCBpcyB3aGF0ICdsb2dvdXQnIGRvZXMuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBkZXZpY2VXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICBkZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUaGlzIGNhbGwgY2hlY2tzIHRoZSBzZXJ2ZXIgdG8gc2VlIGlmIHdlIGhhdmUgYSBzZXNzaW9uIGFscmVhZHksIGFuZCBnZXRzIGJhY2sgdGhlIGxvZ2luIGluZm9ybWF0aW9uIGZyb21cclxuICAgICAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdXNlci5yZWZyZXNoTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIGZvciBzY3JlZW4gc2l6ZSBpbiBhIHRpbWVyLiBXZSBkb24ndCB3YW50IHRvIG1vbml0b3IgYWN0dWFsIHNjcmVlbiByZXNpemUgZXZlbnRzIGJlY2F1c2UgaWYgYSB1c2VyXHJcbiAgICAgICAgICAgICAqIGlzIGV4cGFuZGluZyBhIHdpbmRvdyB3ZSBiYXNpY2FsbHkgd2FudCB0byBsaW1pdCB0aGUgQ1BVIGFuZCBjaGFvcyB0aGF0IHdvdWxkIGVuc3VlIGlmIHdlIHRyaWVkIHRvIGFkanVzdFxyXG4gICAgICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGEgdGhyb3R0bGUgc29ydCBvZi4gWWVzIEkga25vdyBob3cgdG8gbGlzdGVuIGZvciBldmVudHMuIE5vIEknbSBub3QgZG9pbmcgaXQgd3JvbmcgaGVyZS4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBjb3JyZWN0IGluIHRoaXMgY2FzZSBhbmQgYmVoYXZlcyBzdXBlcmlvciB0byBldmVudHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBQb2x5bWVyLT5kaXNhYmxlXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyB2YXIgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uZGV2aWNlV2lkdGggPSB3aWR0aDsgXy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIF8uc2NyZWVuU2l6ZUNoYW5nZSgpOyB9IH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuaW5pdFByb2dyZXNzTW9uaXRvcigpO1xyXG5cclxuICAgICAgICAgICAgcHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9jZXNzVXJsUGFyYW1zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgICAgIGlmIChwYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXJsQ21kID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJjbWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRhYkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24odGFiTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hUYWJBY3RpdmF0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5U2lnbnVwTWVzc2FnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2lnbnVwUmVzcG9uc2UgPSAkKFwiI3NpZ251cENvZGVSZXNwb25zZVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTaWdudXAgY29tcGxldGUuIFlvdSBtYXkgbm93IGxvZ2luLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcmVlblNpemVDaGFuZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUoY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBEb24ndCBuZWVkIHRoaXMgbWV0aG9kIHlldCwgYW5kIGhhdmVuJ3QgdGVzdGVkIHRvIHNlZSBpZiB3b3JrcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJykge1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9hZEFub25QYWdlSG9tZSA9IGZ1bmN0aW9uKGlnbm9yZVVybCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Bbm9uUGFnZUxvYWRSZXF1ZXN0LCBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlPihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlnbm9yZVVybFwiOiBpZ25vcmVVcmxcclxuICAgICAgICAgICAgfSwgYW5vblBhZ2VMb2FkUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlVXNlclByZWZlcmVuY2VzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHVzZXJQcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblN5c3RlbUZpbGUgPSBmdW5jdGlvbihmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk9wZW5TeXN0ZW1GaWxlUmVxdWVzdCwganNvbi5PcGVuU3lzdGVtRmlsZVJlc3BvbnNlPihcIm9wZW5TeXN0ZW1GaWxlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogZmlsZU5hbWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRTeXN0ZW1GaWxlID0gZnVuY3Rpb24oZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBuZXcgRWRpdFN5c3RlbUZpbGVEbGcoZmlsZU5hbWUpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIHRvZG8tMDogZm9yIG5vdyBJJ2xsIGp1c3QgZHJvcCB0aGlzIGludG8gYSBnbG9iYWwgdmFyaWFibGUuIEkga25vdyB0aGVyZSdzIGEgYmV0dGVyIHdheS4gVGhpcyBpcyB0aGUgb25seSB2YXJpYWJsZVxyXG53ZSBoYXZlIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlLCBhbmQgaXMgb25seSByZXF1aXJlZCBmb3IgYXBwbGljYXRpb24gaW5pdGlhbGl6YXRpb24gaW4gSlMgb24gdGhlIGluZGV4Lmh0bWwgcGFnZSAqL1xyXG5pZiAoIXdpbmRvd1tcIm1ldGE2NFwiXSkge1xyXG4gICAgdmFyIG1ldGE2NCA9IG02NC5tZXRhNjQ7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbmF2LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG5hdiB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBfVUlEX1JPV0lEX1NVRkZJWDogc3RyaW5nID0gXCJfcm93XCI7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogZXZlbnR1YWxseSB3aGVuIHdlIGRvIHBhZ2luZyBmb3Igb3RoZXIgbGlzdHMsIHdlIHdpbGwgbmVlZCBhIHNldCBvZiB0aGVzZSB2YXJpYWJsZXMgZm9yIGVhY2ggbGlzdCBkaXNwbGF5IChpLmUuIHNlYXJjaCwgdGltZWxpbmUsIGV0YykgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG1haW5PZmZzZXQ6bnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IGVuZFJlYWNoZWQ6Ym9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogbmVlZCB0byBoYXZlIHRoaXMgdmFsdWUgcGFzc2VkIGZyb20gc2VydmVyIHJhdGhlciB0aGFuIGNvZGVkIGluIFR5cGVTY3JpcHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IFJPV1NfUEVSX1BBR0U6bnVtYmVyID0gMjU7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3Blbk1haW5NZW51SGVscCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBcIi9tZXRhNjQvcHVibGljL2hlbHBcIixcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwib2Zmc2V0XCIgOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIiA6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuUnNzRmVlZHNOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL3Jzcy9mZWVkc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIiA6IG1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiIDogZmFsc2VcclxuICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLyogSSdtIHNldHRpbmcgdGhpcyBoZXJlIHNvIHRoYXQgd2UgY2FuIGNvbWUgdXAgd2l0aCBhIHdheSB0byBtYWtlIHRoZSBhYmJyZXYgZXhwYW5kIHN0YXRlIGJlIHJlbWVtYmVyZWQsIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzIGlzIGxvd2VyIHByaW9yaXR5IGZvciBub3csIHNvIGknbSBub3QgdXNpbmcgaXQgeWV0ICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5leHBhbmRlZEFiYnJldk5vZGVJZHNbbm9kZUlkXSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0LCBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlPihcImV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWRcclxuICAgICAgICAgICAgfSwgZXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cGFuZEFiYnJldmlhdGVkTm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVkFMOiBcIitKU09OLnN0cmluZ2lmeShyZXMubm9kZUluZm8pKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZUluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRpc3BsYXlpbmdIb21lID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlSWQgPT09IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudFZpc2libGVUb1VzZXIgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFkaXNwbGF5aW5nSG9tZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cExldmVsUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCBpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIGRhdGEgaXMgdmlzaWJsZSB0byB5b3UgYWJvdmUgdGhpcyBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQoaWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2VXBMZXZlbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRWaXNpYmxlVG9Vc2VyKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgYXQgcm9vdC4gQ2FuJ3QgZ28gdXAuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMDogZm9yIG5vdyBhbiB1cGxldmVsIHdpbGwgcmVzZXQgdG8gemVybyBvZmZzZXQsIGJ1dCBldmVudHVhbGx5IEkgd2FudCB0byBoYXZlIGVhY2ggbGV2ZWwgb2YgdGhlIHRyZWUsIGJlIGFibGUgdG9cclxuICAgICAgICAgICAgcmVtZW1iZXIgd2hpY2ggb2Zmc2V0IGl0IHdhcyBhdCBzbyB3aGVuIHVzZXIgZHJpbGxzIGRvd24sIGFuZCB0aGVuIGNvbWVzIGJhY2sgb3V0LCB0aGV5IHBhZ2UgYmFjayBvdXQgZnJvbSB0aGUgc2FtZSBwYWdlcyB0aGV5XHJcbiAgICAgICAgICAgIGRyaWxsZWQgZG93biBmcm9tICovXHJcbiAgICAgICAgICAgIG1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IDEsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwib2Zmc2V0XCIgOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIiA6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWREb21FbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwucG9seUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBub2RlIGhpZ2hsaWdodGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFRocm93KFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uTm9kZVJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBzZXRzIHdoaWNoIG5vZGUgaXMgc2VsZWN0ZWQgb24gdGhpcyBwYWdlIChpLmUuIHBhcmVudCBub2RlIG9mIHRoaXMgcGFnZSBiZWluZyB0aGUgJ2tleScpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vbi1udWxsIGl0J3MgYWxyZWFkeSBkaXNwbGF5aW5nIGFuZCB3ZSBkbyBub3RoaW5nLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgdXBkYXRlTm9kZUluZm9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTm9kZSA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG5vZGUuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAgICAgKiBzaWxseSBsb29raW5nIGFzeW5jIHRpbWVyIGhlcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246IGFueSA9IHV0aWwucG9seUVsbSh1aWQgKyBcIl9zZWxcIik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlBhZ2VOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuaG9tZU5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib2Zmc2V0XCI6IG1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIiA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZQdWJsaWNIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcmVmcy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwcmVmcyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xvc2VBY2NvdW50UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ2xvc2VBY2NvdW50UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsb3NlQWNjb3VudCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPaCBObyFcIiwgXCJDbG9zZSB5b3VyIEFjY291bnQ/PHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiT25lIG1vcmUgQ2xpY2tcIiwgXCJZb3VyIGRhdGEgd2lsbCBiZSBkZWxldGVkIGFuZCBjYW4gbmV2ZXIgYmUgcmVjb3ZlcmVkLjxwPiBBcmUgeW91IHN1cmU/XCIsIFwiWWVzLCBDbG9zZSBBY2NvdW50LlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLmRlbGV0ZUFsbFVzZXJDb29raWVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2xvc2VBY2NvdW50UmVxdWVzdCwganNvbi5DbG9zZUFjY291bnRSZXNwb25zZT4oXCJjbG9zZUFjY291bnRcIiwge30sIGNsb3NlQWNjb3VudFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHByb3BzLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHByb3BzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcmRlclByb3BzID0gZnVuY3Rpb24ocHJvcE9yZGVyOiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcclxuICAgICAgICAgICAgbGV0IHByb3BzTmV3OiBqc29uLlByb3BlcnR5SW5mb1tdID0gcHJvcHMuY2xvbmUoKTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldElkeDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHByb3Agb2YgcHJvcE9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJZHggPSBtb3ZlTm9kZVBvc2l0aW9uKHByb3BzTmV3LCB0YXJnZXRJZHgsIHByb3ApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbW92ZU5vZGVQb3NpdGlvbiA9IGZ1bmN0aW9uKHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdLCBpZHg6IG51bWJlciwgdHlwZU5hbWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCB0YWdJZHg6IG51bWJlciA9IHByb3BzLmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHByb3BzLmFycmF5TW92ZUl0ZW0odGFnSWR4LCBpZHgrKyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc2V0RGF0YUljb25Vc2luZ0lkKFwiI2VkaXRNb2RlQnV0dG9uXCIsIGVkaXRNb2RlID8gXCJlZGl0XCIgOlxyXG4gICAgICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgICAgICAvLyB2YXIgZWxtID0gJChcIiNwcm9wc1RvZ2dsZUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAgICAgKiBub2RlIGFuZCBwdXRzIGl0IG9uIHRoZSB0b3AsIGFuZCB0aGVuIGRvZXMgc2FtZSBmb3IgJ2pjdENuc3QuVEFHUydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbbm9kZS5wcmltYXJ5VHlwZU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMobm9kZSwgcHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcHNOZXc6IGpzb24uUHJvcGVydHlJbmZvW10gPSBwcm9wcy5jbG9uZSgpO1xyXG4gICAgICAgICAgICBtb3ZlUHJvcHNUb1RvcChbamNyQ25zdC5DT05URU5ULCBqY3JDbnN0LlRBR1NdLCBwcm9wc05ldyk7XHJcbiAgICAgICAgICAgIG1vdmVQcm9wc1RvRW5kKFtqY3JDbnN0LkNSRUFURUQsIGpjckNuc3QuQ1JFQVRFRF9CWSwgamNyQ25zdC5MQVNUX01PRElGSUVELCBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlldLCBwcm9wc05ldyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBNb3ZlcyBhbGwgdGhlIHByb3BlcnRpZXMgbGlzdGVkIGluIHByb3BMaXN0IGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQga2VlcHMgdGhlbSBpbiB0aGUgb3JkZXIgc3BlY2lmaWVkICovXHJcbiAgICAgICAgbGV0IG1vdmVQcm9wc1RvVG9wID0gZnVuY3Rpb24ocHJvcHNMaXN0OiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdJZHggPSBwcm9wcy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgcHJvcCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBNb3ZlcyBhbGwgdGhlIHByb3BlcnRpZXMgbGlzdGVkIGluIHByb3BMaXN0IGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQga2VlcHMgdGhlbSBpbiB0aGUgb3JkZXIgc3BlY2lmaWVkICovXHJcbiAgICAgICAgbGV0IG1vdmVQcm9wc1RvRW5kID0gZnVuY3Rpb24ocHJvcHNMaXN0OiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdJZHggPSBwcm9wcy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgcHJvcCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHByb3BzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogcHJvcGVydGllcyB3aWxsIGJlIG51bGwgb3IgYSBsaXN0IG9mIFByb3BlcnR5SW5mbyBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcGVydHkubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLW5hbWUtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BlcnR5Lm5hbWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmluYXJ5UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gXCJbYmluYXJ5XVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZCArPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtdmFsLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSArPSByZW5kZXIudGFnKFwidHJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtcm93XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcENvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInRhYmxlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlclwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcGVydHktdGFibGVcIlxyXG4gICAgICAgICAgICAgICAgfSwgdGFibGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBicnV0ZSBmb3JjZSBzZWFyY2hlcyBvbiBub2RlIChOb2RlSW5mby5qYXZhKSBvYmplY3QgcHJvcGVydGllcyBsaXN0LCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgcHJvcGVydHlcclxuICAgICAgICAgKiAoUHJvcGVydHlJbmZvLmphdmEpIHdpdGggbmFtZSBtYXRjaGluZyBwcm9wZXJ0eU5hbWUsIGVsc2UgbnVsbC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IGpzb24uUHJvcGVydHlJbmZvIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBub2RlLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5VmFsID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gZ2V0Tm9kZVByb3BlcnR5KHByb3BlcnR5TmFtZSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBrbm93IHdobyBvd25zIHRoaXMgbm9kZSBhc3N1bWUgdGhlIGFkbWluIG93bnMgaXQuXHJcbiAgICAgICAgICAgIGlmICghY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkQnkgPSBcImFkbWluXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFRoaXMgaXMgT1IgY29uZGl0aW9uIGJlY2F1c2Ugb2YgY3JlYXRlZEJ5IGlzIG51bGwgd2UgYXNzdW1lIHdlIGRvIG5vdCBvd24gaXQgKi9cclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSA9PSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHByb3BlcnR5IHZhbHVlLCBldmVuIGlmIG11bHRpcGxlIHByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKiBJZiB0aGlzIGlzIGEgc2luZ2xlLXZhbHVlIHR5cGUgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpZiBwcm9wZXJ0eSBpcyBtaXNzaW5nIHJldHVybiBlbXB0eSBzdHJpbmcgKi9cclxuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWUgfHwgcHJvcGVydHkudmFsdWUubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogZWxzZSByZW5kZXIgbXVsdGktdmFsdWUgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPGRpdj5cIjtcclxuICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAkLmVhY2godmFsdWVzLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBjbnN0LkJSO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci53cmFwSHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHJlbmRlci5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIHBvc3RUYXJnZXRVcmw7XHJcbmRlY2xhcmUgdmFyIHByZXR0eVByaW50O1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHJlbmRlciB7XHJcbiAgICAgICAgbGV0IGRlYnVnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgY29udGVudCBkaXNwbGF5ZWQgd2hlbiB0aGUgdXNlciBzaWducyBpbiwgYW5kIHdlIHNlZSB0aGF0IHRoZXkgaGF2ZSBubyBjb250ZW50IGJlaW5nIGRpc3BsYXllZC4gV2VcclxuICAgICAgICAgKiB3YW50IHRvIGdpdmUgdGhlbSBzb21lIGluc3RydWN0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gYWRkIGNvbnRlbnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGdldEVtcHR5UGFnZVByb21wdCA9IGZ1bmN0aW9uKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxwPlRoZXJlIGFyZSBubyBzdWJub2RlcyB1bmRlciB0aGlzIG5vZGUuIDxicj48YnI+Q2xpY2sgJ0VESVQgTU9ERScgYW5kIHRoZW4gdXNlIHRoZSAnQUREJyBidXR0b24gdG8gY3JlYXRlIGNvbnRlbnQuPC9wPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlbmRlckJpbmFyeSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiB0aGlzIGlzIGFuIGltYWdlIHJlbmRlciB0aGUgaW1hZ2UgZGlyZWN0bHkgb250byB0aGUgcGFnZSBhcyBhIHZpc2libGUgaW1hZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChub2RlLmJpbmFyeUlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYWtlSW1hZ2VUYWcobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgbm90IGFuIGltYWdlIHdlIHJlbmRlciBhIGxpbmsgdG8gdGhlIGF0dGFjaG1lbnQsIHNvIHRoYXQgaXQgY2FuIGJlIGRvd25sb2FkZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbmNob3I6IHN0cmluZyA9IHRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaHJlZlwiOiBnZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKVxyXG4gICAgICAgICAgICAgICAgfSwgXCJbRG93bmxvYWQgQXR0YWNobWVudF1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImJpbmFyeS1saW5rXCJcclxuICAgICAgICAgICAgICAgIH0sIGFuY2hvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSW1wb3J0YW50IGxpdHRsZSBtZXRob2QgaGVyZS4gQWxsIEdVSSBwYWdlL2RpdnMgYXJlIGNyZWF0ZWQgdXNpbmcgdGhpcyBzb3J0IG9mIHNwZWNpZmljYXRpb24gaGVyZSB0aGF0IHRoZXlcclxuICAgICAgICAgKiBhbGwgbXVzdCBoYXZlIGEgJ2J1aWxkJyBtZXRob2QgdGhhdCBpcyBjYWxsZWQgZmlyc3QgdGltZSBvbmx5LCBhbmQgdGhlbiB0aGUgJ2luaXQnIG1ldGhvZCBjYWxsZWQgYmVmb3JlIGVhY2hcclxuICAgICAgICAgKiB0aW1lIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNwbGF5ZWQgd2l0aCBuZXcgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBJZiAnZGF0YScgaXMgcHJvdmlkZWQsIHRoaXMgaXMgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWRQYWdlID0gZnVuY3Rpb24ocGcsIGRhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidWlsZFBhZ2U6IHBnLmRvbUlkPVwiICsgcGcuZG9tSWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwZy5idWlsdCB8fCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBwZy5idWlsZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIHBnLmJ1aWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBnLmluaXQpIHtcclxuICAgICAgICAgICAgICAgIHBnLmluaXQoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGRSb3dIZWFkZXIgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzaG93UGF0aDogYm9vbGVhbiwgc2hvd05hbWU6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX09OX1JPV1MpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2IGNsYXNzPSdwYXRoLWRpc3BsYXknPlBhdGg6IFwiICsgZm9ybWF0UGF0aChub2RlKSArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAoY29tbWVudEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5Db21tZW50IEJ5OiBcIiArIGNvbW1lbnRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9IC8vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChub2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q3JlYXRlZCBCeTogXCIgKyBub2RlLmNyZWF0ZWRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IGA8c3BhbiBpZD0nb3duZXJEaXNwbGF5JHtub2RlLnVpZH0nPjwvc3Bhbj5gO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gYCAgTW9kOiAke25vZGUubGFzdE1vZGlmaWVkfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogb24gcm9vdCBub2RlIG5hbWUgd2lsbCBiZSBlbXB0eSBzdHJpbmcgc28gZG9uJ3Qgc2hvdyB0aGF0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIGNvbW1lbnRpbmc6IEkgZGVjaWRlZCB1c2VycyB3aWxsIHVuZGVyc3RhbmQgdGhlIHBhdGggYXMgYSBzaW5nbGUgbG9uZyBlbnRpdHkgd2l0aCBsZXNzIGNvbmZ1c2lvbiB0aGFuXHJcbiAgICAgICAgICAgICAqIGJyZWFraW5nIG91dCB0aGUgbmFtZSBmb3IgdGhlbS4gVGhleSBhbHJlYWR5IHVuc2Vyc3RhbmQgaW50ZXJuZXQgVVJMcy4gVGhpcyBpcyB0aGUgc2FtZSBjb25jZXB0LiBObyBuZWVkXHJcbiAgICAgICAgICAgICAqIHRvIGJhYnkgdGhlbS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlICFzaG93UGF0aCBjb25kaXRpb24gaGVyZSBpcyBiZWNhdXNlIGlmIHdlIGFyZSBzaG93aW5nIHRoZSBwYXRoIHRoZW4gdGhlIGVuZCBvZiB0aGF0IGlzIGFsd2F5cyB0aGVcclxuICAgICAgICAgICAgICogbmFtZSwgc28gd2UgZG9uJ3QgbmVlZCB0byBzaG93IHRoZSBwYXRoIEFORCB0aGUgbmFtZS4gT25lIGlzIGEgc3Vic3RyaW5nIG9mIHRoZSBvdGhlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChzaG93TmFtZSAmJiAhc2hvd1BhdGggJiYgbm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IGBOYW1lOiAke25vZGUubmFtZX0gW3VpZD0ke25vZGUudWlkfV1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJoZWFkZXItdGV4dFwiXHJcbiAgICAgICAgICAgIH0sIGhlYWRlclRleHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlclRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFBlZ2Rvd24gbWFya2Rvd24gcHJvY2Vzc29yIHdpbGwgY3JlYXRlIDxjb2RlPiBibG9ja3MgYW5kIHRoZSBjbGFzcyBpZiBwcm92aWRlZCwgc28gaW4gb3JkZXIgdG8gZ2V0IGdvb2dsZVxyXG4gICAgICAgICAqIHByZXR0aWZpZXIgdG8gcHJvY2VzcyBpdCB0aGUgcmVzdCBvZiB0aGUgd2F5ICh3aGVuIHdlIGNhbGwgcHJldHR5UHJpbnQoKSBmb3IgdGhlIHdob2xlIHBhZ2UpIHdlIG5vdyBydW5cclxuICAgICAgICAgKiBhbm90aGVyIHN0YWdlIG9mIHRyYW5zZm9ybWF0aW9uIHRvIGdldCB0aGUgPHByZT4gdGFnIHB1dCBpbiB3aXRoICdwcmV0dHlwcmludCcgZXRjLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0Q29kZUZvcm1hdHRpbmcgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIWNvbnRlbnQpIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgICAgICAvLyBleGFtcGxlIG1hcmtkb3duOlxyXG4gICAgICAgICAgICAvLyBgYGBqc1xyXG4gICAgICAgICAgICAvLyB2YXIgeCA9IDEwO1xyXG4gICAgICAgICAgICAvLyB2YXIgeSA9IFwidGVzdFwiO1xyXG4gICAgICAgICAgICAvLyBgYGBcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQuY29udGFpbnMoXCI8Y29kZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gZW5jb2RlTGFuZ3VhZ2VzKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjwvY29kZT5cIiwgXCI8L3ByZT5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmplY3RTdWJzdGl0dXRpb25zID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZUFsbChcInt7bG9jYXRpb25PcmlnaW59fVwiLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZW5jb2RlTGFuZ3VhZ2VzID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdG9kby0xOiBuZWVkIHRvIHByb3ZpZGUgc29tZSB3YXkgb2YgaGF2aW5nIHRoZXNlIGxhbmd1YWdlIHR5cGVzIGNvbmZpZ3VyYWJsZSBpbiBhIHByb3BlcnRpZXMgZmlsZVxyXG4gICAgICAgICAgICAgKiBzb21ld2hlcmUsIGFuZCBmaWxsIG91dCBhIGxvdCBtb3JlIGZpbGUgdHlwZXMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgbGFuZ3MgPSBbXCJqc1wiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJjc3NcIl07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFuZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZSBjbGFzcz1cXFwiXCIgKyBsYW5nc1tpXSArIFwiXFxcIj5cIiwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIjw/cHJldHRpZnkgbGFuZz1cIiArIGxhbmdzW2ldICsgXCI/PjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjxjb2RlPlwiLCBcIjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGFmdGVyIGEgcHJvcGVydHksIG9yIG5vZGUgaXMgdXBkYXRlZCAoc2F2ZWQpIHdlIGNhbiBub3cgY2FsbCB0aGlzIG1ldGhvZCBpbnN0ZWFkIG9mIHJlZnJlc2hpbmcgdGhlIGVudGlyZSBwYWdlXHJcbiAgICAgICAgd2hpY2ggaXMgd2hhdCdzIGRvbmUgaW4gbW9zdCBvZiB0aGUgYXBwLCB3aGljaCBpcyBtdWNoIGxlc3MgZWZmaWNpZW50IGFuZCBzbmFwcHkgdmlzdWFsbHkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hOb2RlT25QYWdlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvL25lZWQgdG8gbG9va3VwIHVpZCBmcm9tIE5vZGVJbmZvLmlkIHRoZW4gc2V0IHRoZSBjb250ZW50IG9mIHRoaXMgZGl2LlxyXG4gICAgICAgICAgICAvL1wiaWRcIjogdWlkICsgXCJfY29udGVudFwiXHJcbiAgICAgICAgICAgIC8vdG8gdGhlIHZhbHVlIGZyb20gcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbWV0YTY0LmlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgICAgIGlmICghdWlkKSB0aHJvdyBgVW5hYmxlIHRvIGZpbmQgbm9kZUlkICR7bm9kZS5pZH0gaW4gdWlkIG1hcGA7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmICh1aWQgIT0gbm9kZS51aWQpIHRocm93IFwidWlkIGNoYW5nZWQgdW5leHBlY3RseSBhZnRlciBpbml0Tm9kZVwiO1xyXG4gICAgICAgICAgICBsZXQgcm93Q29udGVudDogc3RyaW5nID0gcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB1aWQgKyBcIl9jb250ZW50XCIpLmh0bWwocm93Q29udGVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmVuZGVycyBlYWNoIG5vZGUgaW4gdGhlIG1haW4gd2luZG93LiBUaGUgcmVuZGVyaW5nIGluIGhlcmUgaXMgdmVyeSBjZW50cmFsIHRvIHRoZVxyXG4gICAgICAgICAqIGFwcCBhbmQgaXMgd2hhdCB0aGUgdXNlciBzZWVzIGNvdmVyaW5nIDkwJSBvZiB0aGUgc2NyZWVuIG1vc3Qgb2YgdGhlIHRpbWUuIFRoZSBcImNvbnRlbnQqIG5vZGVzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogdG9kby0wOiBSYXRoZXIgdGhhbiBoYXZpbmcgdGhpcyBub2RlIHJlbmRlcmVyIGl0c2VsZiBiZSByZXNwb25zaWJsZSBmb3IgcmVuZGVyaW5nIGFsbCB0aGUgZGlmZmVyZW50IHR5cGVzXHJcbiAgICAgICAgICogb2Ygbm9kZXMsIG5lZWQgYSBtb3JlIHBsdWdnYWJsZSBkZXNpZ24sIHdoZXJlIHJlbmRlaW5nIG9mIGRpZmZlcmVudCB0aGluZ3MgaXMgZGVsZXRhZ2VkIHRvIHNvbWVcclxuICAgICAgICAgKiBhcHByb3ByaWF0ZSBvYmplY3Qvc2VydmljZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZUNvbnRlbnQgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzaG93UGF0aCwgc2hvd05hbWUsIHJlbmRlckJpbiwgcm93U3R5bGluZywgc2hvd0hlYWRlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZXQ6IHN0cmluZyA9IGdldFRvcFJpZ2h0SW1hZ2VUYWcobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKiB0b2RvLTI6IGVuYWJsZSBoZWFkZXJUZXh0IHdoZW4gYXBwcm9wcmlhdGUgaGVyZSAqL1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNob3dNZXRhRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IHNob3dIZWFkZXIgPyBidWlsZFJvd0hlYWRlcihub2RlLCBzaG93UGF0aCwgc2hvd05hbWUpIDogXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zaG93UHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCByZW5kZXJDb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBTcGVjaWFsIFJlbmRlcmluZyBmb3IgTm9kZXMgdGhhdCBoYXZlIGEgcGx1Z2luLXJlbmRlcmVyXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSBtZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW25vZGUucHJpbWFyeVR5cGVOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBmdW5jKG5vZGUsIHJvd1N0eWxpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29udGVudFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb250ZW50UHJvcDogXCIgKyBjb250ZW50UHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcHJvcHMucmVuZGVyUHJvcGVydHkoY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKiBqY3JDb250ZW50IGZvciBNQVJLRE9XTjpcXG5cIitqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYXJrZWRDb250ZW50ID0gXCI8bWFya2VkLWVsZW1lbnQgc2FuaXRpemU9J3RydWUnPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8c2NyaXB0IHR5cGU9J3RleHQvbWFya2Rvd24nPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8L3NjcmlwdD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1doZW4gZG9pbmcgc2VydmVyLXNpZGUgbWFya2Rvd24gd2UgaGFkIHRoaXMgcHJvY2Vzc2luZyB0aGUgSFRNTCB0aGF0IHdhcyBnZW5lcmF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9idXQgSSBoYXZlbid0IGxvb2tlZCBpbnRvIGhvdyB0byBnZXQgdGhpcyBiYWNrIG5vdyB0aGF0IHdlIGFyZSBkb2luZyBtYXJrZG93biBvbiBjbGllbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vamNyQ29udGVudCA9IGluamVjdENvZGVGb3JtYXR0aW5nKGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2pjckNvbnRlbnQgPSBpbmplY3RTdWJzdGl0dXRpb25zKGpjckNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBtYXJrZWRDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG1hcmtlZENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghcmVuZGVyQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXRoLnRyaW0oKSA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCJSb290IE5vZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPGRpdj5bTm8gQ29udGVudCBQcm9wZXJ0eV08L2Rpdj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydGllczogc3RyaW5nID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJCaW4gJiYgbm9kZS5oYXNCaW5hcnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBiaW5hcnk6IHN0cmluZyA9IHJlbmRlckJpbmFyeShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogV2UgYXBwZW5kIHRoZSBiaW5hcnkgaW1hZ2Ugb3IgcmVzb3VyY2UgbGluayBlaXRoZXIgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dCBvciBhdCB0aGUgbG9jYXRpb24gd2hlcmVcclxuICAgICAgICAgICAgICAgICAqIHRoZSB1c2VyIGhhcyBwdXQge3tpbnNlcnQtYXR0YWNobWVudH19IGlmIHRoZXkgYXJlIHVzaW5nIHRoYXQgdG8gbWFrZSB0aGUgaW1hZ2UgYXBwZWFyIGluIGEgc3BlY2lmaWNcclxuICAgICAgICAgICAgICAgICAqIGxvY2F0aW8gaW4gdGhlIGNvbnRlbnQgdGV4dC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldC5jb250YWlucyhjbnN0LklOU0VSVF9BVFRBQ0hNRU5UKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldC5yZXBsYWNlQWxsKGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQsIGJpbmFyeSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBiaW5hcnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0YWdzOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5UQUdTLCBub2RlKTtcclxuICAgICAgICAgICAgaWYgKHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0YWdzLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJUYWdzOiBcIiArIHRhZ3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5ID0gZnVuY3Rpb24oanNvbkNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqc29uOiBcIiArIGpzb25Db250ZW50KTtcclxuICAgICAgICAgICAgICAgIGxldCBsaXN0OiBhbnlbXSA9IEpTT04ucGFyc2UoanNvbkNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGVudHJ5IG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzeXN0ZW1GaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBgbTY0Lm1ldGE2NC5lZGl0U3lzdGVtRmlsZSgnJHtlbnRyeS5maWxlTmFtZX0nKWBcclxuICAgICAgICAgICAgICAgICAgICB9LCBlbnRyeS5maWxlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG9wZW5TeXN0ZW1GaWxlIHdvcmtlZCBvbiBsaW51eCwgYnV0IGknbSBzd2l0Y2hpbmcgdG8gZnVsbCB0ZXh0IGZpbGUgZWRpdCBjYXBhYmlsaXR5IG9ubHkgYW5kIGRvaW5nIHRoYXRcclxuICAgICAgICAgICAgICAgICAgICBpbnNpZGUgbWV0YTY0IGZyb20gbm93IG9uLCBzbyBvcGVuU3lzdGVtRmlsZSBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCBsb2NhbE9wZW5MaW5rID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibTY0Lm1ldGE2NC5vcGVuU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sIFwiTG9jYWwgT3BlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCBkb3dubG9hZExpbmsgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vaGF2ZW4ndCBpbXBsZW1lbnRlZCBkb3dubG9hZCBjYXBhYmlsaXR5IHlldC5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBcIm9uY2xpY2tcIjogXCJtNjQubWV0YTY0LmRvd25sb2FkU3lzdGVtRmlsZSgnXCIgKyBlbnRyeS5maWxlTmFtZSArIFwiJylcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sIFwiRG93bmxvYWRcIilcclxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgbGlua3NEaXYgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sIGxvY2FsT3BlbkxpbmsgKyBkb3dubG9hZExpbmspO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250ZW50ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSwgZmlsZU5hbWVEaXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmxvZ0FuZFJlVGhyb3coXCJyZW5kZXIgZmFpbGVkXCIsIGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiW3JlbmRlciBmYWlsZWRdXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAgICAgKiBjb250ZW50LiBUaGlzIGdlbmVyYXRlcyB0aGUgSFRNTCBmb3IgYSBzaW5nbGUgcm93L25vZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGxldCBwcmV2UGFnZUV4aXN0czogYm9vbGVhbiA9IG5hdi5tYWluT2Zmc2V0ID4gMDtcclxuICAgICAgICAgICAgbGV0IG5leHRQYWdlRXhpc3RzOiBib29sZWFuID0gIW5hdi5lbmRSZWFjaGVkO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gKGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDEpIHx8IHByZXZQYWdlRXhpc3RzO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZURvd246IGJvb2xlYW4gPSAoaW5kZXggPCBjb3VudCAtIDEpIHx8IG5leHRQYWdlRXhpc3RzO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSBlZGl0aW5nQWxsb3dlZD1cIitlZGl0aW5nQWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICAgICAqIGNsaWNrZWQgb24gZm9yIHRoaXMgcGFnZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAgICAgLy8gK1wiXT09W1wiKyBub2RlLmlkICsgXCJdXCIpXHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXJIdG1sUmV0OiBzdHJpbmcgPSBtYWtlUm93QnV0dG9uQmFySHRtbChub2RlLCBjYW5Nb3ZlVXAsIGNhbk1vdmVEb3duLCBlZGl0aW5nQWxsb3dlZCk7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBtNjQubmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICcke3VpZH0nKTtgLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dOb2RlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aC5zdHJpcElmU3RhcnRzV2l0aChcIi9yb290XCIpO1xyXG4gICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyBwYXRoO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwiamNyOnV1aWRcIiwgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobWVzc2FnZSwgXCJVUkwgb2YgTm9kZVwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUb3BSaWdodEltYWdlVGFnID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWdUYWc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh0b3BSaWdodEltZykge1xyXG4gICAgICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0b3AtcmlnaHQtaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BSaWdodEltZ1RhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZzogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcubm9kZS5ia2cnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYXMgSSB3YXMgY29udmVydGluZ2kgc29tZSBzdHJpbmdzIHRvIGJhY2t0aWNrIGkgbm90aWNlZCB0aGlzIFVSTCBtaXNzaW5nIHRoZSBxdW90ZXMgYXJvdW5kIHRoZSBzdHJpbmcuIElzIHRoaXMgYSBidWc/XHJcbiAgICAgICAgICAgICAgICBia2dJbWdTdHlsZSA9IGBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtia2dJbWd9KTtgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBia2dJbWdTdHlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgdmVydGljYWwtbGF5b3V0LXJvdyBcIiArIGNsYXNzZXNcclxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBzZWxCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZVVwQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJyR7bm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0Lm5hdi5vcGVuTm9kZSgnJHtub2RlLnVpZH0nKTtgLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgICAgICogaW50ZWxsaWdlbmNlIHRvIHdoZW4gdG8gc2hvdyB0aGVzZSBidXR0b25zIG9yIG5vdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvL3BhZGRpbmcgaXMgYSBiYWNrIGhhY2sgdG8gbWFrZSBjaGVja2JveCBsaW5lIHVwIHdpdGggb3RoZXIgaWNvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL1wiaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQuaW5zZXJ0Tm9kZSgnJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LnJ1bkVkaXROb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy11cHdhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0Lm1vdmVOb2RlVXAoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0Lm1vdmVOb2RlRG93bignJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhZGROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gbWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zLCBcInJvdy10b29sYmFyXCIpIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcml6b250YWxGaWVsZFNldCA9IGZ1bmN0aW9uKGNvbnRlbnQ/OiBzdHJpbmcsIGV4dHJhQ2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3cgYnVpbGQgZW50aXJlIGNvbnRyb2wgYmFyICovXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwgLy9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIiArIChleHRyYUNsYXNzZXMgPyAoXCIgXCIgKyBleHRyYUNsYXNzZXMpIDogXCJcIilcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSG9yekNvbnRyb2xHcm91cCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCJcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VSYWRpb0J1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcclxuICAgICAgICAgICAgfSwgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5vZGVJZCAoc2VlIG1ha2VOb2RlSWQoKSkgTm9kZUluZm8gb2JqZWN0IGhhcyAnaGFzQ2hpbGRyZW4nIHRydWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVIYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gbm9kZUhhc0NoaWxkcmVuOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmb3JtYXRQYXRoID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBub2RlLnBhdGg7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlQWxsKFwiL1wiLCBcIiAvIFwiKTtcclxuICAgICAgICAgICAgbGV0IHNob3J0UGF0aDogc3RyaW5nID0gcGF0aC5sZW5ndGggPCA1MCA/IHBhdGggOiBwYXRoLnN1YnN0cmluZygwLCA0MCkgKyBcIi4uLlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vUm9vdFBhdGg6IHN0cmluZyA9IHNob3J0UGF0aDtcclxuICAgICAgICAgICAgaWYgKG5vUm9vdFBhdGguc3RhcnRzV2l0aChcIi9yb290XCIpKSB7XHJcbiAgICAgICAgICAgICAgICBub1Jvb3RQYXRoID0gbm9Sb290UGF0aC5zdWJzdHJpbmcoMCwgNSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IG1ldGE2NC5pc0FkbWluVXNlciA/IHNob3J0UGF0aCA6IG5vUm9vdFBhdGg7XHJcbiAgICAgICAgICAgIHJldCArPSBcIiBbXCIgKyBub2RlLnByaW1hcnlUeXBlTmFtZSArIFwiXVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cmFwSHRtbCA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxkaXY+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVuZGVycyBwYWdlIGFuZCBhbHdheXMgYWxzbyB0YWtlcyBjYXJlIG9mIHNjcm9sbGluZyB0byBzZWxlY3RlZCBub2RlIGlmIHRoZXJlIGlzIG9uZSB0byBzY3JvbGwgdG9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclBhZ2VGcm9tRGF0YSA9IGZ1bmN0aW9uKGRhdGE/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgc2Nyb2xsVG9Ub3A/OiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm02NC5yZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKClcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hdi5lbmRSZWFjaGVkID0gZGF0YSAmJiBkYXRhLmVuZFJlYWNoZWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoXCJObyBjb250ZW50IGlzIGF2YWlsYWJsZSBoZXJlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmlkZW50VG9VaWRNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogSSdtIGNob29zaW5nIHRvIHJlc2V0IHNlbGVjdGVkIG5vZGVzIHdoZW4gYSBuZXcgcGFnZSBsb2FkcywgYnV0IHRoaXMgaXMgbm90IGEgcmVxdWlyZW1lbnQuIEkganVzdFxyXG4gICAgICAgICAgICAgICAgICogZG9uJ3QgaGF2ZSBhIFwiY2xlYXIgc2VsZWN0aW9uc1wiIGZlYXR1cmUgd2hpY2ggd291bGQgYmUgbmVlZGVkIHNvIHVzZXIgaGFzIGEgd2F5IHRvIGNsZWFyIG91dC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShkYXRhLm5vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNldEN1cnJlbnROb2RlRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMgPyBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFTkRFUiBOT0RFOiBcIiArIGRhdGEubm9kZS5pZCArIFwiIHByb3BDb3VudD1cIiArIHByb3BDb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBvdXRwdXQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUoZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE5PVEU6IG1haW5Ob2RlQ29udGVudCBpcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhZ2UgY29udGVudCwgYW5kIGlzIGFsd2F5cyB0aGUgbm9kZSBkaXNwbGF5ZWQgYXQgdGhlIHRvXHJcbiAgICAgICAgICAgICAqIG9mIHRoZSBwYWdlIGFib3ZlIGFsbCB0aGUgb3RoZXIgbm9kZXMgd2hpY2ggYXJlIGl0cyBjaGlsZCBub2Rlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBtYWluTm9kZUNvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtYWluTm9kZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uQmFyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVkaXROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRhLm5vZGUucGF0aD1cIitkYXRhLm5vZGUucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWROb2RlKGRhdGEubm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB1YmxpY0FwcGVuZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LnJlcGx5VG9Db21tZW50KCcke2RhdGEubm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgY25zdC5ORVdfT05fVE9PTEJBUiAmJiBlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL2ljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7dWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQucnVuRWRpdE5vZGUoJyR7dWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcm93SGVhZGVyID0gYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJyR7dWlkfScpO2AsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgLy8gJCgnI21haW5Ob2RlQ29udGVudCcpLmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpcnN0QnV0dG9uOiBzdHJpbmcgPSBtYWtlQnV0dG9uKFwiRmlyc3QgUGFnZVwiLCBcImZpcnN0UGFnZUJ1dHRvblwiLCBmaXJzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZCdXR0b246IHN0cmluZyA9IG1ha2VCdXR0b24oXCJQcmV2IFBhZ2VcIiwgXCJwcmV2UGFnZUJ1dHRvblwiLCBwcmV2UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gY2VudGVyZWRCdXR0b25CYXIoZmlyc3RCdXR0b24gKyBwcmV2QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRDb3VudDogbnVtYmVyID0gZGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoaWxkQ291bnQ6IFwiICsgY2hpbGRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvblxyXG4gICAgICAgICAgICAgICAgICogdGhlIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXQubm9kZXNUb01vdmVTZXRbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvdzogc3RyaW5nID0gZ2VuZXJhdGVSb3coaSwgbm9kZSwgbmV3RGF0YSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3dDb3VudCA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IGdldEVtcHR5UGFnZVByb21wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEuZW5kUmVhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHRCdXR0b24gPSBtYWtlQnV0dG9uKFwiTmV4dCBQYWdlXCIsIFwibmV4dFBhZ2VCdXR0b25cIiwgbmV4dFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RCdXR0b24gPSBtYWtlQnV0dG9uKFwiTGFzdCBQYWdlXCIsIFwibGFzdFBhZ2VCdXR0b25cIiwgbGFzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGNlbnRlcmVkQnV0dG9uQmFyKG5leHRCdXR0b24gKyBsYXN0QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJsaXN0Vmlld1wiLCBvdXRwdXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jb2RlRm9ybWF0RGlydHkpIHtcclxuICAgICAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUT0RPLTM6IEluc3RlYWQgb2YgY2FsbGluZyBzY3JlZW5TaXplQ2hhbmdlIGhlcmUgaW1tZWRpYXRlbHksIGl0IHdvdWxkIGJlIGJldHRlciB0byBzZXQgdGhlIGltYWdlIHNpemVzXHJcbiAgICAgICAgICAgICAqIGV4YWN0bHkgb24gdGhlIGF0dHJpYnV0ZXMgb2YgZWFjaCBpbWFnZSwgYXMgdGhlIEhUTUwgdGV4dCBpcyByZW5kZXJlZCBiZWZvcmUgd2UgZXZlbiBjYWxsXHJcbiAgICAgICAgICAgICAqIHNldEh0bWwsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWV0YTY0LnNjcmVlblNpemVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxUb1RvcCB8fCAhbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZmlyc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmlyc3QgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgICAgICB2aWV3LmZpcnN0UGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmV2UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByZXYgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnByZXZQYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV4dCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgICAgIHZpZXcubmV4dFBhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbGFzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMYXN0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICAgICAgdmlldy5sYXN0UGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJvdyA9IGZ1bmN0aW9uKGk6IG51bWJlciwgbm9kZToganNvbi5Ob2RlSW5mbywgbmV3RGF0YTogYm9vbGVhbiwgY2hpbGRDb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGp1c3RJbWFnZVNpemUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBlbG0uYXR0cihcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2hpY2ggd2Ugd2FudCwgYnV0IHRoZW4gd2UgYWxzbyBsaW1pdCBpdCB3aXRoIG1heC13aWR0aCBzbyBvbiBzbWFsbGVyIHNjcmVlbiBkZXZpY2VzIG9yIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIERPIE5PVCBERUxFVEUgKGZvciBhIGxvbmcgdGltZSBhdCBsZWFzdCkgVGhpcyBpcyB0aGUgb2xkIGxvZ2ljIGZvciByZXNpemluZyBpbWFnZXMgcmVzcG9uc2l2ZWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBgJHtrfT1cIiR7dn1cIiBgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gYCR7a309JyR7dn0nIGA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9yZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gYD4ke2NvbnRlbnR9PC8ke3RhZ30+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIi8+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VUZXh0QXJlYSA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUVkaXRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVBhc3N3b3JkRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uID0gZnVuY3Rpb24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd1Byb3BlcnR5VG9EaXNwbGF5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdFtwcm9wTmFtZV0gPT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNSZWFkT25seVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNCaW5hcnlQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYW5pdGl6ZVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBcInNpbXBsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWUgPT09IGpjckNuc3QuQ09OVEVOVCA/IFwiQ29udGVudFwiIDogcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoLmpzXCIpO1xyXG5cclxuLypcclxuICogdG9kby0zOiB0cnkgdG8gcmVuYW1lIHRvICdzZWFyY2gnLCBidXQgcmVtZW1iZXIgeW91IGhhZCBpbmV4cGxpYWJsZSBwcm9ibGVtcyB0aGUgZmlyc3QgdGltZSB5b3UgdHJpZWQgdG8gdXNlICdzZWFyY2gnXHJcbiAqIGFzIHRoZSB2YXIgbmFtZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzcmNoIHtcclxuICAgICAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9zcmNoX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlNlYXJjaCBSZXN1bHRzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVBhZ2VUaXRsZTogc3RyaW5nID0gXCJUaW1lbGluZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE9mZnNldCA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZU9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudW1TZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoICE9IG51bGwgPyAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogMCxcclxuICAgICAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCIgOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBuYXYubmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lQnlNb2RUaW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gJ3RpbWVsaW5lJyB1bmRlci5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiREVTQ1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5MQVNUX01PRElGSUVELFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lQnlDcmVhdGVUaW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gJ3RpbWVsaW5lJyB1bmRlci5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiREVTQ1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogamNyQ25zdC5DUkVBVEVELFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IG51bGxcclxuICAgICAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRTZWFyY2hOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlID0gZnVuY3Rpb24oZGF0YSwgdmlld05hbWUpIHtcclxuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAgICAgKiBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhLnNlYXJjaFJlc3VsdHMsIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHZpZXdOYW1lLCBvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIGEgc2luZ2xlIGxpbmUgb2Ygc2VhcmNoIHJlc3VsdHMgb24gdGhlIHNlYXJjaCByZXN1bHRzIHBhZ2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhckh0bWwgPSBtYWtlQnV0dG9uQmFySHRtbChcIlwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LnNyY2guY2xpY2tPblNlYXJjaFJlc3VsdFJvdyh0aGlzLCAnJHt1aWR9Jyk7YCwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbC8vXHJcbiAgICAgICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfc3JjaF9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICAgICAgdmFyIGdvdG9CdXR0b24gPSByZW5kZXIubWFrZUJ1dHRvbihcIkdvIHRvIE5vZGVcIiwgdWlkLCBgbTY0LnNyY2guY2xpY2tTZWFyY2hOb2RlKCcke3VpZH0nKTtgKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uU2VhcmNoUmVzdWx0Um93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpIHtcclxuICAgICAgICAgICAgdW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0Um93Tm9kZSA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja1NlYXJjaE5vZGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgdWlkIGluIHNlYXJjaCByZXN1bHRzOiBcIiArIHVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUsIHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIHN0eWxpbmcgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgIHZhciBub2RlSWQgPSBoaWdobGlnaHRSb3dOb2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8qIGNoYW5nZSBjbGFzcyBvbiBlbGVtZW50ICovXHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2hhcmUuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc2hhcmUge1xyXG5cclxuICAgICAgICBsZXQgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hhcmluZ05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZVNoYXJpbmcgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFNoYXJpbmdEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaW5kU2hhcmVkTm9kZXMgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNoYXJlZE5vZGVzUmVxdWVzdCwganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlPihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHVzZXIuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXNlciB7XHJcblxyXG4gICAgICAgIGxldCBsb2dvdXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmb3IgdGVzdGluZyBwdXJwb3NlcywgSSB3YW50IHRvIGFsbG93IGNlcnRhaW4gdXNlcnMgYWRkaXRpb25hbCBwcml2aWxlZ2VzLiBBIGJpdCBvZiBhIGhhY2sgYmVjYXVzZSBpdCB3aWxsIGdvXHJcbiAgICAgICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1Rlc3RVc2VyQWNjb3VudCA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJib2JcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gQlJBTkRJTkdfVElUTEVfU0hPUlQ7XHJcblxyXG4gICAgICAgICAgICAvKiB0b2RvLTA6IElmIHVzZXJzIGdvIHdpdGggdmVyeSBsb25nIHVzZXJuYW1lcyB0aGlzIGlzIGdvbm5hIGJlIHVnbHkgKi9cclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgKz0gXCI6XCIgKyByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRPRE8tMzogbW92ZSB0aGlzIGludG8gbWV0YTY0IG1vZHVsZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlSWQgPSByZXMucm9vdE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lID0gcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZSA9IHJlcy5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICAgICAgbWV0YTY0LmFsbG93RmlsZVN5c3RlbVNlYXJjaCA9IHJlcy5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2g7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzID0gcmVzLnVzZXJQcmVmZXJlbmNlcztcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5hZHZhbmNlZE1vZGUgPyBtZXRhNjQuTU9ERV9BRFZBTkNFRCA6IG1ldGE2NC5NT0RFX1NJTVBMRTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHJlcy51c2VyUHJlZmVyZW5jZXMuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIHNlcnZlcjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uPVwiICsgbWV0YTY0LmVkaXRNb2RlT3B0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblNpZ251cFBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdyaXRlIGEgY29va2llIHRoYXQgZXhwaXJlcyBpbiBhIHllYXIgZm9yIGFsbCBwYXRocyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JpdGVDb29raWUgPSBmdW5jdGlvbihuYW1lLCB2YWwpOiB2b2lkIHtcclxuICAgICAgICAgICAgJC5jb29raWUobmFtZSwgdmFsLCB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHVnbHkuIEl0IGlzIHRoZSBidXR0b24gdGhhdCBjYW4gYmUgbG9naW4gKm9yKiBsb2dvdXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTG9naW5QZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbG9naW5EbGc6IExvZ2luRGxnID0gbmV3IExvZ2luRGxnKCk7XHJcbiAgICAgICAgICAgIGxvZ2luRGxnLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTG9naW4gPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYWxsVXNyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBjYWxsUHdkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCB1c2luZ0Nvb2tpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobG9naW5TZXNzaW9uUmVhZHkgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IHRydWVcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogdXNpbmcgYmxhbmsgY3JlZGVudGlhbHMgd2lsbCBjYXVzZSBzZXJ2ZXIgdG8gbG9vayBmb3IgYSB2YWxpZCBzZXNzaW9uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSBmYWxzZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbG9naW5TdGF0ZTogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHdlIGhhdmUga25vd24gc3RhdGUgYXMgbG9nZ2VkIG91dCwgdGhlbiBkbyBub3RoaW5nIGhlcmUgKi9cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVzcjogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgIGxldCBwd2Q6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXNpbmdDb29raWVzID0gIXV0aWwuZW1wdHlTdHJpbmcodXNyKSAmJiAhdXRpbC5lbXB0eVN0cmluZyhwd2QpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb29raWVVc2VyPVwiICsgdXNyICsgXCIgdXNpbmdDb29raWVzID0gXCIgKyB1c2luZ0Nvb2tpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBlbXB5dCBjcmVkZW50aWFscyBjYXVzZXMgc2VydmVyIHRvIHRyeSB0byBsb2cgaW4gd2l0aCBhbnkgYWN0aXZlIHNlc3Npb24gY3JlZGVudGlhbHMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IHB3ZCA/IHB3ZCA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY2FsbFVzcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogY2FsbFVzcixcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IGNhbGxQd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaExvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dvdXQgPSBmdW5jdGlvbih1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ291dFJlcXVlc3QsIGpzb24uTG9nb3V0UmVzcG9uc2U+KFwibG9nb3V0XCIsIHt9LCBsb2dvdXRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luID0gZnVuY3Rpb24obG9naW5EbGcsIHVzciwgcHdkKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNyLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIHVzciwgcHdkLCBudWxsLCBsb2dpbkRsZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBbGxVc2VyQ29va2llcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLkxvZ2luUmVzcG9uc2UsIHVzcj86IHN0cmluZywgcHdkPzogc3RyaW5nLCB1c2luZ0Nvb2tpZXM/OiBib29sZWFuLCBsb2dpbkRsZz86IExvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkxvZ2luXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW5SZXNwb25zZTogdXNyPVwiICsgdXNyICsgXCIgaG9tZU5vZGVPdmVycmlkZTogXCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHVzciAhPSBcImFub255bW91c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSLCB1c3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCwgcHdkKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIxXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpbkRsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZTogXCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZSBpcyBudWxsLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBzZXQgSUQgdG8gYmUgdGhlIHBhZ2Ugd2Ugd2FudCB0byBzaG93IHVzZXIgcmlnaHQgYWZ0ZXIgbG9naW4gKi9cclxuICAgICAgICAgICAgICAgIGxldCBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuZW1wdHlTdHJpbmcocmVzLmhvbWVOb2RlT3ZlcnJpZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMuaG9tZU5vZGVPdmVycmlkZTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgbGFzdE5vZGU9XCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZUlkPVwiICsgbWV0YTY0LmhvbWVOb2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKGlkLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkNvb2tpZSBsb2dpbiBmYWlsZWQuXCIpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYmxvdyBhd2F5IGZhaWxlZCBjb29raWUgY3JlZGVudGlhbHMgYW5kIHJlbG9hZCBwYWdlLCBzaG91bGQgcmVzdWx0IGluIGJyYW5kIG5ldyBwYWdlIGxvYWQgYXMgYW5vblxyXG4gICAgICAgICAgICAgICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgICAgICBsZXQgcmVmcmVzaExvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHZpZXcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdmlldyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZVN0YXR1c0JhciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNMaW5lID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiY291bnQ6IFwiICsgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiIFNlbGVjdGlvbnM6IFwiICsgdXRpbC5nZXRQcm9wZXJ0eUNvdW50KG1ldGE2NC5zZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIgd2hpY2gsIGlmIHN1cHBsaWVkLCBzaG91bGQgYmUgdGhlIGlkIHdlIHNjcm9sbCB0byB3aGVuIGZpbmFsbHkgZG9uZSB3aXRoIHRoZVxyXG4gICAgICAgICAqIHJlbmRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgdGFyZ2V0SWQ/OiBhbnksIHNjcm9sbFRvVG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcywgc2Nyb2xsVG9Ub3ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvVG9wKSB7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQodGFyZ2V0SWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNtYWluTm9kZUNvbnRlbnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIGFuZCBpZiBzcGVjaWZpZWQgbWFrZXMgdGhlIHBhZ2Ugc2Nyb2xsIHRvIGFuZCBoaWdobGlnaHQgdGhhdCBub2RlIHVwb24gcmUtcmVuZGVyaW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWUgPSBmdW5jdGlvbihub2RlSWQ/OiBhbnksIHJlbmRlclBhcmVudElmTGVhZj86IGFueSwgaGlnaGxpZ2h0SWQ/OiBhbnksIGlzSW5pdGlhbFJlbmRlcj86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlSWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJZCA9IG1ldGE2NC5jdXJyZW50Tm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlZnJlc2hpbmcgdHJlZTogbm9kZUlkPVwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHRJZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBjdXJyZW50U2VsTm9kZSAhPSBudWxsID8gY3VycmVudFNlbE5vZGUuaWQgOiBub2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIEkgZG9uJ3Qga25vdyBvZiBhbnkgcmVhc29uICdyZWZyZXNoVHJlZScgc2hvdWxkIGl0c2VsZiByZXNldCB0aGUgb2Zmc2V0LCBidXQgSSBsZWF2ZSB0aGlzIGNvbW1lbnQgaGVyZVxyXG4gICAgICAgICAgICBhcyBhIGhpbnQgZm9yIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiByZW5kZXJQYXJlbnRJZkxlYWYgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiOiBuYXYubWFpbk9mZnNldCxcclxuICAgICAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gcmVzLm9mZnNldE9mTm9kZUZvdW5kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIGhpZ2hsaWdodElkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNJbml0aWFsUmVuZGVyICYmIG1ldGE2NC51cmxDbWQgPT0gXCJhZGROb2RlXCIgJiYgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXRNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShtZXRhNjQuY3VycmVudE5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZpcnN0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgZmlyc3RQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGxvYWRQYWdlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJldlBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIHByZXZQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCAtPSBuYXYuUk9XU19QRVJfUEFHRTtcclxuICAgICAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvYWRQYWdlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHRQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCArPSBuYXYuUk9XU19QRVJfUEFHRTtcclxuICAgICAgICAgICAgbG9hZFBhZ2UoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsYXN0UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgbGFzdFBhZ2UgUXVlcnlcIik7XHJcbiAgICAgICAgICAgIC8vbmF2Lm1haW5PZmZzZXQgKz0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgICAgIGxvYWRQYWdlKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxvYWRQYWdlID0gZnVuY3Rpb24oZ29Ub0xhc3RQYWdlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBnb1RvTGFzdFBhZ2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdvVG9MYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMub2Zmc2V0T2ZOb2RlRm91bmQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IHJlcy5vZmZzZXRPZk5vZGVGb3VuZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoVHJlZVJlc3BvbnNlKHJlcywgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IHRoaXMgc2Nyb2xsaW5nIGlzIHNsaWdodGx5IGltcGVyZmVjdC4gc29tZXRpbWVzIHRoZSBjb2RlIHN3aXRjaGVzIHRvIGEgdGFiLCB3aGljaCB0cmlnZ2Vyc1xyXG4gICAgICAgICAqIHNjcm9sbFRvVG9wLCBhbmQgdGhlbiBzb21lIG90aGVyIGNvZGUgc2Nyb2xscyB0byBhIHNwZWNpZmljIGxvY2F0aW9uIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIuIHRoZVxyXG4gICAgICAgICAqICdwZW5kaW5nJyBib29sZWFuIGhlcmUgaXMgYSBjcnV0Y2ggZm9yIG5vdyB0byBoZWxwIHZpc3VhbCBhcHBlYWwgKGkuZS4gc3RvcCBpZiBmcm9tIHNjcm9sbGluZyB0byBvbmUgcGxhY2VcclxuICAgICAgICAgKiBhbmQgdGhlbiBzY3JvbGxpbmcgdG8gYSBkaWZmZXJlbnQgcGxhY2UgYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlcilcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNjcm9sbFRvU2VsZWN0ZWROb2RlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZWxtOiBhbnkgPSBuYXYuZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBmaW5kIGEgc2VsZWN0ZWQgbm9kZSBvbiB0aGlzIHBhZ2UsIHNjcm9sbCB0b1xyXG4gICAgICAgICAgICAgICAgLy8gdG9wIGluc3RlYWQuXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiI21haW5Db250YWluZXJcIikuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdG9kby0wOiByZW1vdmVkIG1haW5QYXBlclRhYnMgZnJvbSB2aXNpYmlsaXR5LCBidXQgd2hhdCBjb2RlIHNob3VsZCBnbyBoZXJlIG5vdz9cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vbGV0IGUgPSAkKFwiI21haW5Db250YWluZXJcIik7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogbm90IHVzaW5nIG1haW5QYXBlclRhYnMgYW55IGxvbmdlciBzbyBzaHcgc2hvdWxkIGdvIGhlcmUgbm93ID9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbkNvbnRhaW5lclwiKS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0RWRpdFBhdGhEaXNwbGF5QnlJZCA9IGZ1bmN0aW9uKGRvbUlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBlZGl0LmVkaXROb2RlO1xyXG4gICAgICAgICAgICBsZXQgZTogYW55ID0gJChcIiNcIiArIGRvbUlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICBlLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoRGlzcGxheSA9IFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IERvIHdlIHJlYWxseSBuZWVkIElEIGluIGFkZGl0aW9uIHRvIFBhdGggaGVyZT9cclxuICAgICAgICAgICAgICAgIC8vIHBhdGhEaXNwbGF5ICs9IFwiPGJyPklEOiBcIiArIG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERpc3BsYXkgKz0gXCI8YnI+TW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5odG1sKHBhdGhEaXNwbGF5KTtcclxuICAgICAgICAgICAgICAgIGUuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dTZXJ2ZXJJbmZvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNlcnZlckluZm9SZXF1ZXN0LCBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZT4oXCJnZXRTZXJ2ZXJJbmZvXCIsIHt9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcocmVzLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZW51UGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWVudVBhbmVsIHtcclxuXHJcbiAgICAgICAgbGV0IG1ha2VUb3BMZXZlbE1lbnUgPSBmdW5jdGlvbih0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBhcGVySXRlbUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibWVudS10cmlnZ2VyXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXBlckl0ZW0gPSByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCBwYXBlckl0ZW1BdHRycywgdGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcGVyU3VibWVudUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQpIHtcclxuICAgICAgICAgICAgICAgICg8YW55PnBhcGVyU3VibWVudUF0dHJzKS5pZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXN1Ym1lbnVcIiwgcGFwZXJTdWJtZW51QXR0cnNcclxuICAgICAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAgICAgLy9cImxhYmVsXCI6IHRpdGxlLFxyXG4gICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwibWV0YTY0LW1lbnUtaGVhZGluZ1wiLFxyXG4gICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwibWVudS1jb250ZW50IHN1Ymxpc3RcIlxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAsIHBhcGVySXRlbSArIC8vXCI8cGFwZXItaXRlbSBjbGFzcz0nbWVudS10cmlnZ2VyJz5cIiArIHRpdGxlICsgXCI8L3BhcGVyLWl0ZW0+XCIgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWFrZVNlY29uZExldmVsTGlzdChjb250ZW50KSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbWFrZVNlY29uZExldmVsTGlzdCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItbWVudVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWVudS1jb250ZW50IHN1Ymxpc3QgbXktbWVudS1zZWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICAgICAgLy8sXHJcbiAgICAgICAgICAgICAgICAvL1wibXVsdGlcIjogXCJtdWx0aVwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1lbnVJdGVtID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICAgICAgfSwgbmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZG9tSWQ6IHN0cmluZyA9IFwibWFpbkFwcE1lbnVcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlsZCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLy8gSSBlbmRlZCB1cCBub3QgcmVhbGx5IGxpa2luZyB0aGlzIHdheSBvZiBzZWxlY3RpbmcgdGFicy4gSSBjYW4ganVzdCB1c2Ugbm9ybWFsIHBvbHltZXIgdGFicy5cclxuICAgICAgICAgICAgLy8gdmFyIHBhZ2VNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJNYWluXCIsIFwibWFpblBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYignbWFpblRhYk5hbWUnKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJTZWFyY2hcIiwgXCJzZWFyY2hQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ3NlYXJjaFRhYk5hbWUnKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAvLyAgICAgbWVudUl0ZW0oXCJUaW1lbGluZVwiLCBcInRpbWVsaW5lUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCd0aW1lbGluZVRhYk5hbWUnKTtcIik7XHJcbiAgICAgICAgICAgIC8vIHZhciBwYWdlTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJQYWdlXCIsIHBhZ2VNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJzc0l0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmVlZHNcIiwgXCJtYWluTWVudVJzc1wiLCBcIm02NC5uYXYub3BlblJzc0ZlZWRzTm9kZSgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIG1haW5NZW51UnNzID0gbWFrZVRvcExldmVsTWVudShcIlJTU1wiLCByc3NJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWRpdE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNyZWF0ZVwiLCBcImNyZWF0ZU5vZGVCdXR0b25cIiwgXCJtNjQuZWRpdC5jcmVhdGVOb2RlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsIFwiKG5ldyBtNjQuUmVuYW1lTm9kZURsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3V0XCIsIFwiY3V0U2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5jdXRTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlBhc3RlXCIsIFwicGFzdGVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LnBhc3RlU2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwibTY0LmVkaXQuY2xlYXJTZWxlY3Rpb25zKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW1wb3J0XCIsIFwib3BlbkltcG9ydERsZ1wiLCBcIihuZXcgbTY0LkltcG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRXhwb3J0XCIsIFwib3BlbkV4cG9ydERsZ1wiLCBcIihuZXcgbTY0LkV4cG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlXCIsIFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5kZWxldGVTZWxOb2RlcygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkVkaXRcIiwgZWRpdE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwXCIsIFwibW92ZU5vZGVVcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVXAoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEb3duXCIsIFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVEb3duKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gVG9wXCIsIFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVG9Ub3AoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBCb3R0b21cIiwgXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb0JvdHRvbSgpO1wiKTsvL1xyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiTW92ZVwiLCBtb3ZlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gRmlsZVwiLCBcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21GaWxlRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCBcIm02NC5hdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tVXJsRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcIm02NC5hdHRhY2htZW50LmRlbGV0ZUF0dGFjaG1lbnQoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBdHRhY2hcIiwgYXR0YWNobWVudE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkVkaXQgTm9kZSBTaGFyaW5nXCIsIFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsIFwibTY0LnNoYXJlLmVkaXROb2RlU2hhcmluZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwibTY0LnNoYXJlLmZpbmRTaGFyZWROb2RlcygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIHNoYXJpbmdNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNoYXJlXCIsIHNoYXJpbmdNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNvbnRlbnRcIiwgXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IG1ha2UgYSB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgdGhhdCBkb2VzIGEgdGFnIHNlYXJjaFxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJUYWdzXCIsIFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoVGFnc0RsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmlsZXNcIiwgXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoRmlsZXNEbGcodHJ1ZSkpLm9wZW4oKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTZWFyY2hcIiwgc2VhcmNoTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNyZWF0ZWRcIiwgXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgXCJtNjQuc3JjaC50aW1lbGluZUJ5Q3JlYXRlVGltZSgpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTW9kaWZpZWRcIiwgXCJ0aW1lbGluZU1vZGlmaWVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeU1vZFRpbWUoKTtcIik7Ly9cclxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJUaW1lbGluZVwiLCB0aW1lbGluZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJUb2dnbGUgUHJvcGVydGllc1wiLCBcInByb3BzVG9nZ2xlQnV0dG9uXCIsIFwibTY0LnByb3BzLnByb3BzVG9nZ2xlKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUmVmcmVzaFwiLCBcInJlZnJlc2hQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5yZWZyZXNoKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiU2hvdyBVUkxcIiwgXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgXCJtNjQucmVuZGVyLnNob3dOb2RlVXJsKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUHJlZmVyZW5jZXNcIiwgXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgXCIobmV3IG02NC5QcmVmc0RsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlZpZXdcIiwgdmlld09wdGlvbnNNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gV09SSyBJTiBQUk9HUkVTUyAoIGRvIG5vdCBkZWxldGUpXHJcbiAgICAgICAgICAgIC8vIHZhciBmaWxlU3lzdGVtTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiUmVpbmRleFwiLCBcImZpbGVTeXNSZWluZGV4QnV0dG9uXCIsIFwibTY0LnN5c3RlbWZvbGRlci5yZWluZGV4KCk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwiZmlsZVN5c1NlYXJjaEJ1dHRvblwiLCBcIm02NC5zeXN0ZW1mb2xkZXIuc2VhcmNoKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICAvLyAgICAgLy9tZW51SXRlbShcIkJyb3dzZVwiLCBcImZpbGVTeXNCcm93c2VCdXR0b25cIiwgXCJtNjQuc3lzdGVtZm9sZGVyLmJyb3dzZSgpO1wiKTtcclxuICAgICAgICAgICAgLy8gdmFyIGZpbGVTeXN0ZW1NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkZpbGVTeXNcIiwgZmlsZVN5c3RlbU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgbTY0LkNoYW5nZVBhc3N3b3JkRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYW5hZ2UgQWNjb3VudFwiLCBcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgXCIobmV3IG02NC5NYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIik7IC8vXHJcblxyXG4gICAgICAgICAgICAvLyBtZW51SXRlbShcIkZ1bGwgUmVwb3NpdG9yeSBFeHBvcnRcIiwgXCJmdWxsUmVwb3NpdG9yeUV4cG9ydFwiLCBcIlxyXG4gICAgICAgICAgICAvLyBlZGl0LmZ1bGxSZXBvc2l0b3J5RXhwb3J0KCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQWNjb3VudFwiLCBteUFjY291bnRJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWRtaW5JdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkdlbmVyYXRlIFJTU1wiLCBcImdlbmVyYXRlUlNTQnV0dG9uXCIsIFwibTY0LnBvZGNhc3QuZ2VuZXJhdGVSU1MoKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNlcnZlciBJbmZvXCIsIFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgXCJtNjQudmlldy5zaG93U2VydmVySW5mbygpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW5zZXJ0IEJvb2s6IFdhciBhbmQgUGVhY2VcIiwgXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgXCJtNjQuZWRpdC5pbnNlcnRCb29rV2FyQW5kUGVhY2UoKTtcIik7IC8vXHJcbiAgICAgICAgICAgIHZhciBhZG1pbk1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQWRtaW5cIiwgYWRtaW5JdGVtcywgXCJhZG1pbk1lbnVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVscEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFpbiBNZW51IEhlbHBcIiwgXCJtYWluTWVudUhlbHBcIiwgXCJtNjQubmF2Lm9wZW5NYWluTWVudUhlbHAoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudUhlbHAgPSBtYWtlVG9wTGV2ZWxNZW51KFwiSGVscC9Eb2NzXCIsIGhlbHBJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IC8qIHBhZ2VNZW51KyAqLyBtYWluTWVudVJzcyArIGVkaXRNZW51ICsgbW92ZU1lbnUgKyBhdHRhY2htZW50TWVudSArIHNoYXJpbmdNZW51ICsgdmlld09wdGlvbnNNZW51IC8qICsgZmlsZVN5c3RlbU1lbnUgKi8gKyBzZWFyY2hNZW51ICsgdGltZWxpbmVNZW51ICsgbXlBY2NvdW50TWVudVxyXG4gICAgICAgICAgICAgICAgKyBhZG1pbk1lbnUgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwb2RjYXN0LmpzXCIpO1xuXG4vKlxuTk9URTogVGhlIEF1ZGlvUGxheWVyRGxnIEFORCB0aGlzIHNpbmdsZXRvbi1pc2ggY2xhc3MgYm90aCBzaGFyZSBzb21lIHN0YXRlIGFuZCBjb29wZXJhdGVcblxuUmVmZXJlbmNlOiBodHRwczovL3d3dy53My5vcmcvMjAxMC8wNS92aWRlby9tZWRpYWV2ZW50cy5odG1sXG4qL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwb2RjYXN0IHtcbiAgICAgICAgZXhwb3J0IGxldCBwbGF5ZXI6IGFueSA9IG51bGw7XG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRUaW1lUGVuZGluZzogbnVtYmVyID0gbnVsbDtcblxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XG4gICAgICAgIGxldCBhZFNlZ21lbnRzOiBBZFNlZ21lbnRbXSA9IG51bGw7XG5cbiAgICAgICAgbGV0IHB1c2hUaW1lcjogYW55ID0gbnVsbDtcblxuICAgICAgICBleHBvcnQgbGV0IGdlbmVyYXRlUlNTID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZW5lcmF0ZVJTU1JlcXVlc3QsIGpzb24uR2VuZXJhdGVSU1NSZXNwb25zZT4oXCJnZW5lcmF0ZVJTU1wiLCB7XG4gICAgICAgICAgICB9LCBnZW5lcmF0ZVJTU1Jlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBnZW5lcmF0ZVJTU1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBhbGVydCgncnNzIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0aXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZFRpdGxlXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IGRlc2M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWREZXNjXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IGltZ1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCIsIG5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgZmVlZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcImgyXCIsIHtcbiAgICAgICAgICAgICAgICB9LCB0aXRsZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgICAgIGZlZWQgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgICAgIH0sIGRlc2MudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LCBmZWVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZmVlZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbWdVcmwpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImltZ1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXgtd2lkdGg6IDIwMHB4O1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBpbWdVcmwudmFsdWVcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCBsaW5rOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtTGlua1wiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChsaW5rICYmIGxpbmsudmFsdWUgJiYgbGluay52YWx1ZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5rLnZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKHVyaSAmJiB1cmkudmFsdWUgJiYgdXJpLnZhbHVlLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCIubXAzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVyaS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVuY1VybDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUVuY1VybFwiLCBub2RlKTtcbiAgICAgICAgICAgIGlmIChlbmNVcmwgJiYgZW5jVXJsLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVuY1R5cGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1FbmNUeXBlXCIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChlbmNUeXBlICYmIGVuY1R5cGUudmFsdWUgJiYgZW5jVHlwZS52YWx1ZS5zdGFydHNXaXRoKFwiYXVkaW8vXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNVcmwudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySXRlbU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgcnNzVGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1UaXRsZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NEZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NBdXRob3I6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1BdXRob3JcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzTGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzVXJpOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVXJpXCIsIG5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgZW50cnk6IHN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChyc3NMaW5rICYmIHJzc0xpbmsudmFsdWUgJiYgcnNzVGl0bGUgJiYgcnNzVGl0bGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHJlZlwiOiByc3NMaW5rLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgcmVuZGVyLnRhZyhcImgzXCIsIHt9LCByc3NUaXRsZS52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGxheWVyVXJsID0gZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZShub2RlKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXJVcmwpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LnBvZGNhc3Qub3BlblBsYXllckRpYWxvZygnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJQbGF5XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocnNzRGVzYyAmJiByc3NEZXNjLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBcIiwge1xuICAgICAgICAgICAgICAgIH0sIHJzc0Rlc2MudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocnNzQXV0aG9yICYmIHJzc0F1dGhvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIH0sIFwiQnk6IFwiICsgcnNzQXV0aG9yLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgZW50cnkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0ZlZWROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkVGl0bGVcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkRGVzY1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRMaW5rXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFVyaVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRTcmNcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkSW1hZ2VVcmxcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZ0l0ZW1Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtRGVzY1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1BdXRob3JcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9wZW5QbGF5ZXJEaWFsb2cgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHVpZCA9IF91aWQ7XG4gICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xuXG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBtcDNVcmwgPSBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChtcDNVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0UGxheWVySW5mb1JlcXVlc3QsIGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlPihcImdldFBsYXllckluZm9cIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogbXAzVXJsXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRQbGF5ZXJJbmZvUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VWlkKHVpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGxnID0gbmV3IEF1ZGlvUGxheWVyRGxnKG1wM1VybCwgdWlkLCByZXMudGltZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkbGcub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRVaWQgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFkU2VnczoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJhZC1zZWdtZW50c1wiLCBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRTZWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VGV4dChhZFNlZ3MudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlIHVpZDogXCIgKyB1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRUZXh0ID0gZnVuY3Rpb24oYWRTZWdzOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGFkU2VnbWVudHMgPSBbXTtcblxuICAgICAgICAgICAgbGV0IHNlZ0xpc3Q6IHN0cmluZ1tdID0gYWRTZWdzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnIG9mIHNlZ0xpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VnVGltZXM6IHN0cmluZ1tdID0gc2VnLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VnVGltZXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgcmFuZ2U6IFwiICsgc2VnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGJlZ2luU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1swXSk7XG4gICAgICAgICAgICAgICAgbGV0IGVuZFNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMV0pO1xuXG4gICAgICAgICAgICAgICAgYWRTZWdtZW50cy5wdXNoKG5ldyBBZFNlZ21lbnQoYmVnaW5TZWNzLCBlbmRTZWNzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBjb252ZXJ0IGZyb20gZm9tcmF0IFwibWludXRlczpzZWNvbnRzXCIgdG8gYWJzb2x1dGUgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAgICAgKlxuICAgICAgICAqIHRvZG8tMDogbWFrZSB0aGlzIGFjY2VwdCBqdXN0IHNlY29uZHMsIG9yIG1pbjpzZWMsIG9yIGhvdXI6bWluOnNlYywgYW5kIGJlIGFibGUgdG9cbiAgICAgICAgKiBwYXJzZSBhbnkgb2YgdGhlbSBjb3JyZWN0bHkuXG4gICAgICAgICovXG4gICAgICAgIGxldCBjb252ZXJ0VG9TZWNvbmRzID0gZnVuY3Rpb24odGltZVZhbDogc3RyaW5nKSB7XG4gICAgICAgICAgICAvKiBlbmQgdGltZSBpcyBkZXNpZ25hdGVkIHdpdGggYXN0ZXJpc2sgYnkgdXNlciwgYW5kIHJlcHJlc2VudGVkIGJ5IC0xIGluIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgaWYgKHRpbWVWYWwgPT0gJyonKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBsZXQgdGltZVBhcnRzOiBzdHJpbmdbXSA9IHRpbWVWYWwuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgaWYgKHRpbWVQYXJ0cy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHZhbHVlOiBcIiArIHRpbWVWYWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMF0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMV0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICogNjAgKyBzZWNvbmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZXN0b3JlU3RhcnRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKiBtYWtlcyBwbGF5ZXIgYWx3YXlzIHN0YXJ0IHdoZXJldmVyIHRoZSB1c2VyIGxhc3Qgd2FzIHdoZW4gdGhleSBjbGlja2VkIFwicGF1c2VcIiAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBzdGFydFRpbWVQZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc3RhcnRUaW1lUGVuZGluZztcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVQZW5kaW5nID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25DYW5QbGF5ID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBwbGF5ZXIgPSBlbG07XG4gICAgICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvblRpbWVVcGRhdGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZywgZWxtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmICghcHVzaFRpbWVyKSB7XG4gICAgICAgICAgICAgICAgLyogcGluZyBzZXJ2ZXIgb25jZSBldmVyeSBmaXZlIG1pbnV0ZXMgKi9cbiAgICAgICAgICAgICAgICBwdXNoVGltZXIgPSBzZXRJbnRlcnZhbChwdXNoVGltZXJGdW5jdGlvbiwgNSo2MCoxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDdXJyZW50VGltZT1cIiArIGVsbS5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICBwbGF5ZXIgPSBlbG07XG5cbiAgICAgICAgICAgIC8qIHRvZG8tMTogd2UgY2FsbCByZXN0b3JlU3RhcnRUaW1lIHVwb24gbG9hZGluZyBvZiB0aGUgY29tcG9uZW50IGJ1dCBpdCBkb2Vzbid0IHNlZW0gdG8gaGF2ZSB0aGUgZWZmZWN0IGRvaW5nIGFueXRoaW5nIGF0IGFsbFxuICAgICAgICAgICAgYW5kIGNhbid0IGV2ZW4gdXBkYXRlIHRoZSBzbGlkZXIgZGlzcGxheWVkIHBvc2l0aW9uLCB1bnRpbCBwbGF5aW5zIGlzIFNUQVJURUQuIE5lZWQgdG8gY29tZSBiYWNrIGFuZCBmaXggdGhpcyBiZWNhdXNlIHVzZXJzXG4gICAgICAgICAgICBjdXJyZW50bHkgaGF2ZSB0aGUgZ2xpdGNoIG9mIGFsd2F5cyBoZWFyaW5nIHRoZSBmaXJzdCBmcmFjdGlvbiBvZiBhIHNlY29uZCBvZiB2aWRlbywgd2hpY2ggb2YgY291cnNlIGFub3RoZXIgd2F5IHRvIGZpeFxuICAgICAgICAgICAgd291bGQgYmUgYnkgYWx0ZXJpbmcgdGhlIHZvbHVtbiB0byB6ZXJvIHVudGlsIHJlc3RvcmVTdGFydFRpbWUgaGFzIGdvbmUgaW50byBlZmZlY3QgKi9cbiAgICAgICAgICAgIHJlc3RvcmVTdGFydFRpbWUoKTtcblxuICAgICAgICAgICAgaWYgKCFhZFNlZ21lbnRzKSByZXR1cm47XG4gICAgICAgICAgICBmb3IgKGxldCBzZWcgb2YgYWRTZWdtZW50cykge1xuICAgICAgICAgICAgICAgIC8qIGVuZFRpbWUgb2YgLTEgbWVhbnMgdGhlIHJlc3Qgb2YgdGhlIG1lZGlhIHNob3VsZCBiZSBjb25zaWRlcmVkIEFEcyAqL1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuY3VycmVudFRpbWUgPj0gc2VnLmJlZ2luVGltZSAmJiAvL1xuICAgICAgICAgICAgICAgICAgICAocGxheWVyLmN1cnJlbnRUaW1lIDw9IHNlZy5lbmRUaW1lIHx8IHNlZy5lbmRUaW1lIDwgMCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGVuZCBvZiBhdWRpbyBpZiByZXN0IGlzIGFuIGFkZCwgd2l0aCBsb2dpYyBvZiAtMyB0byBlbnN1cmUgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgZ28gaW50byBhIGxvb3AganVtcGluZyB0byBlbmQgb3ZlciBhbmQgb3ZlciBhZ2FpbiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VnLmVuZFRpbWUgPCAwICYmIHBsYXllci5jdXJyZW50VGltZSA8IHBsYXllci5kdXJhdGlvbiAtIDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gbGFzdCB0byBzZWNvbmRzIG9mIGF1ZGlvLCBpJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiBwYXVzaW5nLCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhlcmUgYXJlIGlzIG1vcmUgYXVkaW8gYXV0b21hdGljYWxseSBhYm91dCB0byBwbGF5LCB3ZSBkb24ndCB3YW50IHRvIGhhbHQgaXQgYWxsICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gcGxheWVyLmR1cmF0aW9uIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBvciBlbHNlIHdlIGFyZSBpbiBhIGNvbWVyY2lhbCBzZWdtZW50IHNvIGp1bXAgdG8gb25lIHNlY29uZCBwYXN0IGl0ICovXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc2VnLmVuZFRpbWUgKyAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG8tMDogZm9yIHByb2R1Y3Rpb24sIGJvb3N0IHRoaXMgdXAgdG8gb25lIG1pbnV0ZSAqL1xuICAgICAgICBleHBvcnQgbGV0IHB1c2hUaW1lckZ1bmN0aW9uID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHVzaFRpbWVyXCIpO1xuICAgICAgICAgICAgLyogdGhlIHB1cnBvc2Ugb2YgdGhpcyB0aW1lciBpcyB0byBiZSBzdXJlIHRoZSBicm93c2VyIHNlc3Npb24gZG9lc24ndCB0aW1lb3V0IHdoaWxlIHVzZXIgaXMgcGxheWluZ1xuICAgICAgICAgICAgYnV0IGlmIHRoZSBtZWRpYSBpcyBwYXVzZWQgd2UgRE8gYWxsb3cgaXQgdG8gdGltZW91dC4gT3Rod2Vyd2lzZSBpZiB1c2VyIGlzIGxpc3RlbmluZyB0byBhdWRpbywgd2VcbiAgICAgICAgICAgIGNvbnRhY3QgdGhlIHNlcnZlciBkdXJpbmcgdGhpcyB0aW1lciB0byB1cGRhdGUgdGhlIHRpbWUgb24gdGhlIHNlcnZlciBBTkQga2VlcCBzZXNzaW9uIGZyb20gdGltaW5nIG91dFxuXG4gICAgICAgICAgICB0b2RvLTA6IHdvdWxkIGV2ZXJ5dGhpbmcgd29yayBpZiAncGxheWVyJyBXQVMgdGhlIGpxdWVyeSBvYmplY3QgYWx3YXlzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgIXBsYXllci5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvKiB0aGlzIHNhZmV0eSBjaGVjayB0byBiZSBzdXJlIG5vIGhpZGRlbiBhdWRpbyBjYW4gc3RpbGwgYmUgcGxheWluZyBzaG91bGQgbm8gbG9uZ2VyIGJlIG5lZWRlZFxuICAgICAgICAgICAgICAgIG5vdyB0aGF0IEkgaGF2ZSB0aGUgY2xvc2UgbGl0ZW5lciBldmVuIG9uIHRoZSBkaWFsb2csIGJ1dCBpJ2xsIGxlYXZlIHRoaXMgaGVyZSBhbnl3YXkuIENhbid0IGh1cnQuICovXG4gICAgICAgICAgICAgICAgaWYgKCEkKHBsYXllcikuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NpbmcgcGxheWVyLCBiZWNhdXNlIGl0IHdhcyBkZXRlY3RlZCBhcyBub3QgdmlzaWJsZS4gcGxheWVyIGRpYWxvZyBnZXQgaGlkZGVuP1wiKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJBdXRvc2F2ZSBwbGF5ZXIgaW5mby5cIik7XG4gICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBwb2RjYXN0IGhhbmRsaW5nIGhhY2sgaXMgb25seSBpbiB0aGlzIGZpbGUgdGVtcG9yYXJpbHlcbiAgICAgICAgZXhwb3J0IGxldCBwYXVzZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGRlc3Ryb3lQbGF5ZXIgPSBmdW5jdGlvbihkbGc6IEF1ZGlvUGxheWVyRGxnKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxQbGF5ZXIgPSAkKHBsYXllcik7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUGxheWVyLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkbGcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRsZy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDc1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHBsYXkgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzcGVlZCA9IGZ1bmN0aW9uKHJhdGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5YmFja1JhdGUgPSByYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IHNraXAgPSBmdW5jdGlvbihkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lICs9IGRlbHRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzYXZlUGxheWVySW5mbyA9IGZ1bmN0aW9uKHVybDogc3RyaW5nLCB0aW1lT2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikgcmV0dXJuO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXRQbGF5ZXJJbmZvUmVxdWVzdCwganNvbi5TZXRQbGF5ZXJJbmZvUmVzcG9uc2U+KFwic2V0UGxheWVySW5mb1wiLCB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogdXJsLFxuICAgICAgICAgICAgICAgIFwidGltZU9mZnNldFwiOiB0aW1lT2Zmc2V0IC8vLFxuICAgICAgICAgICAgICAgIC8vXCJub2RlUGF0aFwiOiBub2RlLnBhdGhcbiAgICAgICAgICAgIH0sIHNldFBsYXllckluZm9SZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2V0UGxheWVySW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdzYXZlIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucmVuZGVyRmVlZE5vZGU7XG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucmVuZGVySXRlbU5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NmZWVkXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nRmVlZE5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpyc3NpdGVtXCJdID0gbTY0LnBvZGNhc3QucHJvcE9yZGVyaW5nSXRlbU5vZGU7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzeXN0ZW1mb2xkZXIuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc3lzdGVtZm9sZGVyIHtcblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgcGF0aFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnBhdGhcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHBhdGhQcm9wKSB7XG4gICAgICAgICAgICAgICAgcGF0aCArPSByZW5kZXIudGFnKFwiaDJcIiwge1xuICAgICAgICAgICAgICAgIH0sIHBhdGhQcm9wLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogVGhpcyB3YXMgYW4gZXhwZXJpbWVudCB0byBsb2FkIGEgbm9kZSBwcm9wZXJ0eSB3aXRoIHRoZSByZXN1bHRzIG9mIGEgZGlyZWN0b3J5IGxpc3RpbmcsIGJ1dCBJIGRlY2lkZWQgdGhhdFxuICAgICAgICAgICAgcmVhbGx5IGlmIEkgd2FudCB0byBoYXZlIGEgZmlsZSBicm93c2VyLCB0aGUgcmlnaHQgd2F5IHRvIGRvIHRoYXQgaXMgdG8gaGF2ZSBhIGRlZGljYXRlZCB0YWIgdGhhdCBjYW4gZG8gaXRcbiAgICAgICAgICAgIGp1c3QgbGlrZSB0aGUgb3RoZXIgdG9wLWxldmVsIHRhYnMgKi9cbiAgICAgICAgICAgIC8vbGV0IGZpbGVMaXN0aW5nUHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6anNvblwiLCBub2RlKTtcbiAgICAgICAgICAgIC8vbGV0IGZpbGVMaXN0aW5nID0gZmlsZUxpc3RpbmdQcm9wID8gcmVuZGVyLnJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkoZmlsZUxpc3RpbmdQcm9wLnZhbHVlKSA6IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIHBhdGggLyogKyBmaWxlTGlzdGluZyAqLyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBhdGggLyogKyBmaWxlTGlzdGluZyAqLyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckZpbGVMaXN0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuSlNPTl9GSUxFX1NFQVJDSF9SRVNVTFQsIG5vZGUpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaFJlc3VsdFByb3ApIHtcbiAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHJlbmRlci5yZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBmaWxlTGlzdFByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6anNvblwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVpbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSwgcmVpbmRleFJlc3BvbnNlLCBzeXN0ZW1mb2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBicm93c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgYnJvd3NlIGZ1bmN0aW9uIHdvcmtzLCBidXQgaSdtIGRpc2FibGluZyBpdCwgZm9yIG5vdyBiZWNhdXNlIHdoYXQgSSdsbCBiZSBkb2luZyBpbnN0ZWFkIGlzIG1ha2luZyBpdFxuICAgICAgICAgICAgLy8gc3dpdGNoIHRvIGEgRmlsZUJyb3dzZXIgVGFiIChtYWluIHRhYikgd2hlcmUgYnJvd3Npbmcgd2lsbCBhbGwgYmUgZG9uZS4gTm8gSkNSIG5vZGVzIHdpbGwgYmUgdXBkYXRlZCBkdXJpbmdcbiAgICAgICAgICAgIC8vIHRoZSBwcm9jZXNzIG9mIGJyb3dzaW5nIGFuZCBlZGl0aW5nIGZpbGVzIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICAvLyBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgLy8gICAgIHV0aWwuanNvbjxqc29uLkJyb3dzZUZvbGRlclJlcXVlc3QsIGpzb24uQnJvd3NlRm9sZGVyUmVzcG9uc2U+KFwiYnJvd3NlRm9sZGVyXCIsIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJub2RlSWRcIjogc2VsTm9kZS5wYXRoXG4gICAgICAgICAgICAvLyAgICAgfSwgc3lzdGVtZm9sZGVyLnJlZnJlc2hSZXNwb25zZSwgc3lzdGVtZm9sZGVyKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkJyb3dzZUZvbGRlclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvL25hdi5tYWluT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIC8vIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxuICAgICAgICAgICAgLy8gICAgIFwidXBMZXZlbFwiOiBudWxsLFxuICAgICAgICAgICAgLy8gICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXG4gICAgICAgICAgICAvLyAgICAgXCJvZmZzZXRcIjogMCxcbiAgICAgICAgICAgIC8vICAgICBcImdvVG9MYXN0UGFnZVwiIDogZmFsc2VcbiAgICAgICAgICAgIC8vIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVpbmRleFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xuICAgICAgICAgICAgYWxlcnQoXCJSZWluZGV4IGNvbXBsZXRlLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAobmV3IG02NC5TZWFyY2hGaWxlc0RsZyh0cnVlKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBwcm9wZXJ0aWVzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XG4gICAgICAgICAgICBsZXQgcHJvcE9yZGVyOiBzdHJpbmdbXSA9IFsvL1xuICAgICAgICAgICAgICAgIFwibWV0YTY0OnBhdGhcIl07XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5vcmRlclByb3BzKHByb3BPcmRlciwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnN5c3RlbWZvbGRlclwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucHJvcE9yZGVyaW5nO1xuXG5tNjQubWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IG02NC5zeXN0ZW1mb2xkZXIucmVuZGVyRmlsZUxpc3ROb2RlO1xubTY0Lm1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6ZmlsZWxpc3RcIl0gPSBtNjQuc3lzdGVtZm9sZGVyLmZpbGVMaXN0UHJvcE9yZGVyaW5nO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRGlhbG9nQmFzZS5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgLypcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICAgICAqXG4gICAgICogdG9kbzogd2hlbiByZWZhY3RvcmluZyBhbGwgZGlhbG9ncyB0byB0aGlzIG5ldyBiYXNlLWNsYXNzIGRlc2lnbiBJJ20gYWx3YXlzXG4gICAgICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICAgICAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gICAgICogdGhleSBoYXZlIGJlZW4gY29uc3RydWN0ZWQgd2hlcmUgdGhleSBtZXJlbHkgaGF2ZSB0byBiZSByZXNob3duIGFuZFxuICAgICAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAgICAgKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgaG9yaXpDZW50ZXJEbGdDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcblxuICAgICAgICBkYXRhOiBhbnk7XG4gICAgICAgIGJ1aWx0OiBib29sZWFuO1xuICAgICAgICBndWlkOiBzdHJpbmc7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRvbUlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2UgcmVnaXN0ZXIgJ3RoaXMnIHNvIHdlIGNhbiBkbyBtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJyBhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBlbmNvZGVkIGluIG9uQ2xpY2sgbWV0aG9kc1xuICAgICAgICAgICAgICogYXMgc3RyaW5ncy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2cgd2hlbiBpdCdzIGRpc3BsYXllZCwgYW5kIHNob3VsZCBiZSB0aGUgcGxhY2Ugd2hlcmVcbiAgICAgICAgYW55IGRlZmF1bHRzIG9yIHZhbHVlcyBpbiBmb3IgZmllbGRzLCBldGMuIHNob3VsZCBiZSBzZXQgd2hlbiB0aGUgZGlhbG9nIGlzIGRpc3BsYXllZCAqL1xuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VFdmVudCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGlzLmlkKHRoaXMuZG9tSWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICAgICAqIG9uY2UgaXQncyBjbG9zZWQsIEFORCB0aGF0IHNhbWUgY29kZSBzaG91bGQgZGVsZXRlIHRoZSBndWlkJ3Mgb2JqZWN0IGluXG4gICAgICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFwZXItZGlhbG9nXCIpO1xuXG4gICAgICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgICAgICAvL25vZGUuc2V0QXR0cmlidXRlKFwid2l0aC1iYWNrZHJvcFwiLCBcIndpdGgtYmFja2Ryb3BcIik7XG5cbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMzogcHV0IGluIENTUyBub3dcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcblxuXG4gICAgICAgICAgICBpZiAodGhpcy5ob3JpekNlbnRlckRsZ0NvbnRlbnQpIHtcblxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaG93dG86IGV4YW1wbGUgb2YgaG93IHRvIGNlbnRlciBhIGRpdiBpbiBhbm90aGVyIGRpdi4gVGhpcyBkaXYgaXMgdGhlIG9uZSBiZWluZyBjZW50ZXJlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIHRyaWNrIHRvIGdldHRpbmcgdGhlIGxheW91dCB3b3JraW5nIHdhcyBOT1Qgc2V0dGluZyB0aGlzIHdpZHRoIHRvIDEwMCUgZXZlbiB0aG91Z2ggc29tZWhvd1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGUgbGF5b3V0IGRvZXMgcmVzdWx0IGluIGl0IGJlaW5nIDEwMCUgaSB0aGluay5cbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW46IDAgYXV0bzsgbWF4LXdpZHRoOiA4MDBweDtcIiAvL1wibWFyZ2luOiAwIGF1dG87IHdpZHRoOiA4MDBweDtcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWlsZCgpKTtcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoaWQsIGNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGxlZnQgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgICAgIC8vIH0sIFwibGVmdFwiKTtcbiAgICAgICAgICAgICAgICAvLyBsZXQgY2VudGVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgICAgICAvLyB9LCB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgICAgIC8vIGxldCByaWdodCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJzdHlsZVwiOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGxldCByb3cgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsgXCJkaXNwbGF5XCI6IFwidGFibGUtcm93XCIgfSwgbGVmdCArIGNlbnRlciArIHJpZ2h0KTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGxldCB0YWJsZTogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLFxuICAgICAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgIC8vICAgICB9LCByb3cpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gdXRpbC5zZXRIdG1sKGlkLCB0YWJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKiB0b2RvLTA6IGxvb2t1cCBwYXBlci1kaWFsb2ctc2Nyb2xsYWJsZSwgZm9yIGV4YW1wbGVzIG9uIGhvdyB3ZSBjYW4gaW1wbGVtZW50IGhlYWRlciBhbmQgZm9vdGVyIHRvIGJ1aWxkXG4gICAgICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLmJ1aWxkKCk7XG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGhpcy5idWlsdCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRpYWxvZzogXCIgKyBpZCk7XG5cbiAgICAgICAgICAgIC8qIG5vdyBvcGVuIGFuZCBkaXNwbGF5IHBvbHltZXIgZGlhbG9nIHdlIGp1c3QgY3JlYXRlZCAqL1xuICAgICAgICAgICAgbGV0IHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0oaWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaSB0cmllZCB0byB0d2VhayB0aGUgcGxhY2VtZW50IG9mIHRoZSBkaWFsb2cgdXNpbmcgZml0SW50bywgYW5kIGl0IGRpZG4ndCB3b3JrXG4gICAgICAgICAgICBzbyBJJ20ganVzdCB1c2luZyB0aGUgcGFwZXItZGlhbG9nIENTUyBzdHlsaW5nIHRvIGFsdGVyIHRoZSBkaWFsb2cgc2l6ZSB0byBmdWxsc2NyZWVuXG4gICAgICAgICAgICBsZXQgaXJvblBhZ2VzID0gdXRpbC5wb2x5RWxtKFwibWFpbklyb25QYWdlc1wiKTtcblxuICAgICAgICAgICAgQWZ0ZXIgdGhlIFR5cGVTY3JpcHQgY29udmVyc2lvbiBJIG5vdGljZWQgaGF2aW5nIGEgbW9kYWwgZmxhZyB3aWxsIGNhdXNlXG4gICAgICAgICAgICBhbiBpbmZpbml0ZSBsb29wIChjb21wbGV0ZWx5IGhhbmcpIENocm9tZSBicm93c2VyLCBidXQgdGhpcyBpc3N1ZSBpcyBtb3N0IGxpa2VseVxuICAgICAgICAgICAgbm90IHJlbGF0ZWQgdG8gVHlwZVNjcmlwdCBhdCBhbGwsIGJ1dCBpJ20ganVzdCBtZW50aW9uIFRTIGp1c3QgaW4gY2FzZSwgYmVjYXVzZVxuICAgICAgICAgICAgdGhhdCdzIHdoZW4gSSBub3RpY2VkIGl0LiBEaWFsb2dzIGFyZSBmaW5lIGJ1dCBub3QgYSBkaWFsb2cgb24gdG9wIG9mIGFub3RoZXIgZGlhbG9nLCB3aGljaCBpc1xuICAgICAgICAgICAgdGhlIGNhc2Ugd2hlcmUgaXQgaGFuZ3MgaWYgbW9kZWw9dHJ1ZVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5ub0NhbmNlbE9uT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmhvcml6b250YWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuZml0SW50byA9IGlyb25QYWdlcy5ub2RlO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY29uc3RyYWluKCk7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5vcGVuKCk7XG5cbiAgICAgICAgICAgIC8vdmFyIGRpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkRpYWxvZycpO1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpcm9uLW92ZXJsYXktY2xvc2VkJywgZnVuY3Rpb24oY3VzdG9tRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvL3ZhciBpZCA9ICg8YW55PmN1c3RvbUV2ZW50LmN1cnJlbnRUYXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKiogRGlhbG9nOiBcIiArIGlkICsgXCIgaXMgY2xvc2VkIVwiKTtcbiAgICAgICAgICAgICAgICB0aGl6LmNsb3NlRXZlbnQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgc2V0dGluZyB0byB6ZXJvIG1hcmdpbiBpbW1lZGlhdGVseSwgYW5kIHRoZW4gYWxtb3N0IGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhZnRlIDEuNSBzZWNvbmRzXG4gICAgICAgICAgICBpcyBhIHJlYWxseSB1Z2x5IGhhY2ssIGJ1dCBJIGNvdWxkbid0IGZpbmQgdGhlIHJpZ2h0IHN0eWxlIGNsYXNzIG9yIHdheSBvZiBkb2luZyB0aGlzIGluIHRoZSBnb29nbGVcbiAgICAgICAgICAgIGRvY3Mgb24gdGhlIGRpYWxvZyBjbGFzcy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuXG4gICAgICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIH0sIDEwKTtcblxuICAgICAgICAgICAgLyogSSdtIGRvaW5nIHRoaXMgaW4gZGVzcGFyYXRpb24uIG5vdGhpbmcgZWxzZSBzZWVtcyB0byBnZXQgcmlkIG9mIHRoZSBtYXJnaW4gKi9cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XG4gICAgICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG86IG5lZWQgdG8gY2xlYW51cCB0aGUgcmVnaXN0ZXJlZCBJRHMgdGhhdCBhcmUgaW4gbWFwcyBmb3IgdGhpcyBkaWFsb2cgKi9cbiAgICAgICAgcHVibGljIGNhbmNlbCgpIHtcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQodGhpcy5kb21JZCkpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNhbmNlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSGVscGVyIG1ldGhvZCB0byBnZXQgdGhlIHRydWUgaWQgdGhhdCBpcyBzcGVjaWZpYyB0byB0aGlzIGRpYWxvZyAoaS5lLiBndWlkXG4gICAgICAgICAqIHN1ZmZpeCBhcHBlbmRlZClcbiAgICAgICAgICovXG4gICAgICAgIGlkID0gKGlkKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlmIChpZCA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAvKiBpZiBkaWFsb2cgYWxyZWFkeSBzdWZmaXhlZCAqL1xuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiX2RsZ0lkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlkICsgXCJfZGxnSWRcIiArIHRoaXMuZGF0YS5ndWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVBhc3N3b3JkRmllbGQgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIubWFrZVBhc3N3b3JkRmllbGQodGV4dCwgdGhpcy5pZChpZCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUVkaXRGaWVsZCA9IChmaWVsZE5hbWU6IHN0cmluZywgaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZXRhNjQtaW5wdXRcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlTWVzc2FnZUFyZWEgPSAobWVzc2FnZTogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1tZXNzYWdlXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBcIiwgYXR0cnMsIG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9kbzogdGhlcmUncyBhIG1ha2VCdXR0b24gKGFuZCBvdGhlciBzaW1pbGFyIG1ldGhvZHMpIHRoYXQgZG9uJ3QgaGF2ZSB0aGVcbiAgICAgICAgLy8gZW5jb2RlQ2FsbGJhY2sgY2FwYWJpbGl0eSB5ZXRcbiAgICAgICAgbWFrZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFRoZSByZWFzb24gZGVsYXlDbG9zZUNhbGxiYWNrIGlzIGhlcmUgaXMgc28gdGhhdCB3ZSBjYW4gZW5jb2RlIGEgYnV0dG9uIHRvIHBvcHVwIGEgbmV3IGRpYWxvZyBvdmVyIHRoZSB0b3Agb2ZcbiAgICAgICAgYW4gZXhpc3RpbmcgZGlhbG9nLCBhbmQgaGF2ZSB0aGF0IGhhcHBlbiBpbnN0YW50bHksIHJhdGhlciB0aGFuIGxldHRpbmcgaXQgY2xvc2UsIGFuZCBUSEVOIHBvcGluZyB1cCBhIHNlY29uZCBkaWFsb2csXG4gICAgICAgIGJlY2FzdWUgdXNpbmcgdGhlIGRlbGF5IG1lYW5zIHRoYXQgdGhlIG9uZSBiZWluZyBoaWRkZW4gaXMgbm90IGFibGUgdG8gYmVjb21lIGhpZGRlbiBiZWZvcmUgdGhlIG9uZSBjb21lcyB1cCBiZWNhdXNlXG4gICAgICAgIHRoYXQgY3JlYXRlcyBhbiB1Z2x5bmVzcy4gSXQncyBiZXR0ZXIgdG8gcG9wdXAgb25lIHJpZ2h0IG92ZXIgdGhlIG90aGVyIGFuZCBubyBmbGlja2VyIGhhcHBlbnMgaW4gdGhhdCBjYXNlLiAqL1xuICAgICAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlOiBib29sZWFuID0gdHJ1ZSwgZGVsYXlDbG9zZUNhbGxiYWNrOiBudW1iZXIgPSAwKTogc3RyaW5nID0+IHtcblxuICAgICAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcblxuICAgICAgICAgICAgICAgIC8qIHdhcm5pbmc6IHRoaXMgZGlhbG9nLWNvbmZpcm0gd2lsbCBjYXVzZSBnb29nbGUgcG9seW1lciB0byBjbG9zZSB0aGUgZGlhbG9nIGluc3RhbnRseSB3aGVuIHRoZSBidXR0b25cbiAgICAgICAgICAgICAgICAgaXMgY2xpY2tlZCBhbmQgc29tZXRpbWVzIHdlIGRvbid0IHdhbnQgdGhhdCwgbGlrZSBmb3IgZXhhbXBsZSwgd2hlbiB3ZSBvcGVuIGEgZGlhbG9nIG92ZXIgYW5vdGhlciBkaWFsb2csXG4gICAgICAgICAgICAgICAgIHdlIGRvbid0IHdhbnQgdGhlIGluc3RhbnRhbmVvdXMgY2xvc2UgYW5kIGRpc3BsYXkgb2YgYmFja2dyb3VuZC4gSXQgY3JlYXRlcyBhIGZsaWNrZXIgZWZmZWN0LlxuXG4gICAgICAgICAgICAgICAgXCJkaWFsb2ctY29uZmlybVwiOiBcImRpYWxvZy1jb25maXJtXCIsXG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZCksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBvbkNsaWNrID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9uQ2xpY2sgPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25DbGljayArPSBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcywgbnVsbCwgZGVsYXlDbG9zZUNhbGxiYWNrKTtcblxuICAgICAgICAgICAgaWYgKG9uQ2xpY2spIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG9uQ2xpY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaW5pdGlhbGx5VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJzdHlsZVwiXSA9IFwiZGlzcGxheTpub25lO1wiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZEVudGVyS2V5ID0gKGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuYmluZEVudGVyS2V5KHRoaXMuaWQoaWQpLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSwgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldElucHV0VmFsID0gKGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChpZCkpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldEh0bWwgPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChpZCksIHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVJhZGlvQnV0dG9uID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZFxuICAgICAgICAgICAgfSwgbGFiZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUNoZWNrQm94ID0gKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGluaXRpYWxTdGF0ZTogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgLy9cIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIDxwYXBlci1jaGVja2JveCBvbi1jaGFuZ2U9XCJjaGVja2JveENoYW5nZWRcIj5jbGljazwvcGFwZXItY2hlY2tib3g+XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY2hlY2tib3hDaGFuZ2VkIDogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgLy8gICAgIGlmKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoZWNrYm94OiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgYXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgY2hlY2tib3ggKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiBpZFxuICAgICAgICAgICAgfSwgbGFiZWwsIHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tib3g7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlSGVhZGVyID0gKHRleHQ6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNlbnRlcmVkPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAvKlwiZGlhbG9nLWhlYWRlciBcIiArKi8gKGNlbnRlcmVkID8gXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCIgOiBcIlwiKSArIFwiIGRpYWxvZy1oZWFkZXJcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9hZGQgaWQgaWYgb25lIHdhcyBwcm92aWRlZFxuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBtYWtpbmcgdGhpcyBIMiB0YWcgY2F1c2VzIGdvb2dsZSB0byBkcmFnIGluIGEgYnVuY2ggb2YgaXRzIG93biBzdHlsZXMgYW5kIGFyZSBoYXJkIHRvIG92ZXJyaWRlICovXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCBhdHRycywgdGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb2N1cyA9IChpZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgaWQgPSBcIiNcIiArIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKGlkKTtcbiAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyAgICAgJChpZCkuZm9jdXMoKTtcbiAgICAgICAgICAgIC8vIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ29uZmlybURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIENvbmZpcm1EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSB5ZXNDYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgICBwcml2YXRlIG5vQ2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICAgICAgc3VwZXIoXCJDb25maXJtRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBjb250ZW50OiBzdHJpbmcgPSB0aGlzLm1ha2VIZWFkZXIoXCJcIiwgXCJDb25maXJtRGxnVGl0bGVcIikgKyB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIlwiLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiWWVzXCIsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiLCB0aGlzLnllc0NhbGxiYWNrKVxuICAgICAgICAgICAgICAgICsgdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJOb1wiLCBcIkNvbmZpcm1EbGdOb0J1dHRvblwiLCB0aGlzLm5vQ2FsbGJhY2spO1xuICAgICAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYnV0dG9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLnRpdGxlLCBcIkNvbmZpcm1EbGdUaXRsZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLm1lc3NhZ2UsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5idXR0b25UZXh0LCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBFZGl0U3lzdGVtRmlsZS5qc1wiKTtcblxuLyogVGhpcyBkaWFsb2cgaXMgY3VycmVuZXRseSBhIHdvcmsgaW4gcHJvZ3Jlc3MgYW5kIHdpbGwgZXZlbnR1YWxseSBiZSBhYmxlIHRvIGVkaXQgYSB0ZXh0IGZpbGUgb24gdGhlIHNlcnZlciAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRTeXN0ZW1GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgICAgICBzdXBlcihcIkVkaXRTeXN0ZW1GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSBcIjxoMj5GaWxlIEVkaXRvcjogXCIgKyB0aGlzLmZpbGVOYW1lICsgXCI8L2gyPlwiO1xuXG4gICAgICAgICAgICBsZXQgYnV0dG9ucyA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcIlNhdmVGaWxlQnV0dG9uXCIsIHRoaXMuc2F2ZUVkaXQpXG4gICAgICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcIkNhbmNlbEZpbGVFZGl0QnV0dG9uXCIsIHRoaXMuY2FuY2VsRWRpdCk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYW5jZWwuXCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUHJvZ3Jlc3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJQcm9ncmVzc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUHJvY2Vzc2luZyBSZXF1ZXN0XCIsIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgICAgIFwiaW5kZXRlcm1pbmF0ZVwiOiBcImluZGV0ZXJtaW5hdGVcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiODAwXCIsXG4gICAgICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgICAgICBcIm1heFwiOiBcIjEwMDBcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MjgwcHg7IG1hcmdpbjoyNHB4O1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJhckNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1lc3NhZ2VEbGcuanNcIik7XHJcblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXNzYWdlPzogYW55LCBwcml2YXRlIHRpdGxlPzogYW55LCBwcml2YXRlIGNhbGxiYWNrPzogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWVzc2FnZURsZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJNZXNzYWdlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy50aXRsZSkgKyBcIjxwPlwiICsgdGhpcy5tZXNzYWdlICsgXCI8L3A+XCI7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiT2tcIiwgXCJtZXNzYWdlRGxnT2tCdXR0b25cIiwgdGhpcy5jYWxsYmFjaykpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTG9naW5EbGcuanNcIik7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XG5cbi8qXG5Ob3RlOiBUaGUganF1ZXJ5IGNvb2tpZSBsb29rcyBmb3IganF1ZXJ5IGQudHMgaW4gdGhlIHJlbGF0aXZlIGxvY2F0aW9uIFwiXCIuLi9qcXVlcnlcIiBzbyBiZXdhcmUgaWYgeW91clxudHJ5IHRvIHJlb3JnYW5pemUgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgSSBoYXZlIGluIHR5cGVkZWZzLCB0aGluZ3Mgd2lsbCBjZXJ0YWlubHkgYnJlYWtcbiovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBMb2dpbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiTG9naW5EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkxvZ2luXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdmFyIGxvZ2luQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiTG9naW5cIiwgXCJsb2dpbkJ1dHRvblwiLCB0aGlzLmxvZ2luLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRm9yZ290IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLCB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGxvZ2luQnV0dG9uICsgcmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuICAgICAgICAgICAgdmFyIGRpdmlkZXIgPSBcIjxkaXY+PGgzPk9yIExvZ2luIFdpdGguLi48L2gzPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybSA9IGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gZm9ybTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInBhc3N3b3JkXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3B1bGF0ZUZyb21Db29raWVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHVzciA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XG4gICAgICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICAgICAgaWYgKHVzcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB1c3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHB3ZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiLCBwd2QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9naW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgICAgICB2YXIgcHdkID0gdGhpcy5nZXRJbnB1dFZhbChcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB1c2VyLmxvZ2luKHRoaXMsIHVzciwgcHdkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogYW55ID0+IHtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gUmVzZXQgUGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICBcIlJlc2V0IHlvdXIgcGFzc3dvcmQgPzxwPllvdSdsbCBzdGlsbCBiZSBhYmxlIHRvIGxvZ2luIHdpdGggeW91ciBvbGQgcGFzc3dvcmQgdW50aWwgdGhlIG5ldyBvbmUgaXMgc2V0LlwiLFxuICAgICAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXouY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgUmVzZXRQYXNzd29yZERsZyh1c3IpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNpZ251cERsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEU7XG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRV9TSE9SVDtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNpZ251cERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaWdudXBEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihCUkFORElOR19USVRMRSArIFwiIFNpZ251cFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInNpZ251cFVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJzaWdudXBQYXNzd29yZFwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWxcIiwgXCJzaWdudXBFbWFpbFwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiQ2FwdGNoYVwiLCBcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIHZhciBjYXB0Y2hhSW1hZ2UgPSByZW5kZXIudGFnKFwiZGl2XCIsIC8vXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYS1pbWFnZVwiIC8vXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICByZW5kZXIudGFnKFwiaW1nXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBcIlwiLy9cbiAgICAgICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJcIiwgZmFsc2UpKTtcblxuICAgICAgICAgICAgdmFyIHNpZ251cEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNpZ251cFwiLCBcInNpZ251cEJ1dHRvblwiLCB0aGlzLnNpZ251cCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgbmV3Q2FwdGNoYUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlRyeSBEaWZmZXJlbnQgSW1hZ2VcIiwgXCJ0cnlBbm90aGVyQ2FwdGNoYUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2lnbnVwQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNpZ251cEJ1dHRvbiArIG5ld0NhcHRjaGFCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGNhcHRjaGFJbWFnZSArIGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqICQoXCIjXCIgKyBfLmRvbUlkICsgXCItbWFpblwiKS5jc3MoeyBcImJhY2tncm91bmRJbWFnZVwiIDogXCJ1cmwoL2libS03MDItYnJpZ2h0LmpwZyk7XCIgXCJiYWNrZ3JvdW5kLXJlcGVhdFwiIDpcbiAgICAgICAgICAgICAqIFwibm8tcmVwZWF0O1wiLCBcImJhY2tncm91bmQtc2l6ZVwiIDogXCIxMDAlIGF1dG9cIiB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICB9XG5cbiAgICAgICAgc2lnbnVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFVzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHBhc3N3b3JkID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFBhc3N3b3JkXCIpO1xuICAgICAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cEVtYWlsXCIpO1xuICAgICAgICAgICAgdmFyIGNhcHRjaGEgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAgICAgLyogbm8gcmVhbCB2YWxpZGF0aW9uIHlldCwgb3RoZXIgdGhhbiBub24tZW1wdHkgKi9cbiAgICAgICAgICAgIGlmICghdXNlck5hbWUgfHwgdXNlck5hbWUubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhZW1haWwgfHwgZW1haWwubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICAgICAhY2FwdGNoYSB8fCBjYXB0Y2hhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU29ycnksIHlvdSBjYW5ub3QgbGVhdmUgYW55IGZpZWxkcyBibGFuay5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNpZ251cFJlcXVlc3QsanNvbi5TaWdudXBSZXNwb25zZT4oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNlck5hbWUsXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgICAgIFwiY2FwdGNoYVwiOiBjYXB0Y2hhXG4gICAgICAgICAgICB9LCB0aGlzLnNpZ251cFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cFJlc3BvbnNlID0gKHJlczoganNvbi5TaWdudXBSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2lnbnVwIG5ldyB1c2VyXCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qIGNsb3NlIHRoZSBzaWdudXAgZGlhbG9nICovXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcbiAgICAgICAgICAgICAgICAgICAgXCJVc2VyIEluZm9ybWF0aW9uIEFjY2VwdGVkLjxwLz5DaGVjayB5b3VyIGVtYWlsIGZvciBzaWdudXAgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICAgICAgKSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5QW5vdGhlckNhcHRjaGEgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciBuID0gdXRpbC5jdXJyZW50VGltZU1pbGxpcygpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZW1iZWQgYSB0aW1lIHBhcmFtZXRlciBqdXN0IHRvIHRod2FydCBicm93c2VyIGNhY2hpbmcsIGFuZCBlbnN1cmUgc2VydmVyIGFuZCBicm93c2VyIHdpbGwgbmV2ZXIgcmV0dXJuIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBpbWFnZSB0d2ljZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHNyYyA9IHBvc3RUYXJnZXRVcmwgKyBcImNhcHRjaGE/dD1cIiArIG47XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSkuYXR0cihcInNyY1wiLCBzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZUluaXRTaWdudXBQZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VJbml0U2lnbnVwUGcoKTtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByZWZzRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgUHJlZnNEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQZWZlcmVuY2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9ucyA9IHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiU2ltcGxlXCIsIFwiZWRpdE1vZGVTaW1wbGVcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJBZHZhbmNlZFwiLCBcImVkaXRNb2RlQWR2YW5jZWRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFkaW9CdXR0b25Hcm91cCA9IHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1ncm91cFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpXHJcbiAgICAgICAgICAgIH0sIHJhZGlvQnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tCb3ggPSB0aGlzLm1ha2VDaGVja0JveChcIlNob3cgUm93IE1ldGFkYXRhXCIsIFwic2hvd01ldGFEYXRhXCIsIG1ldGE2NC5zaG93TWV0YURhdGEpO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tib3hCYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAoc2hvd01ldGFEYXRhQ2hlY2tCb3gpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVnZW5kID0gXCI8bGVnZW5kPkVkaXQgTW9kZTo8L2xlZ2VuZD5cIjtcclxuICAgICAgICAgICAgdmFyIHJhZGlvQmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKGxlZ2VuZCArIGZvcm1Db250cm9scyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBjaGVja2JveEJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlcyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcG9seUVsbS5ub2RlLnNlbGVjdGVkID09IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA/IG1ldGE2NC5NT0RFX1NJTVBMRVxyXG4gICAgICAgICAgICAgICAgOiBtZXRhNjQuTU9ERV9BRFZBTkNFRDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHNob3dNZXRhRGF0YUNoZWNrYm94Lm5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VELFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSxcclxuICAgICAgICAgICAgICAgICAgICAvKiB0b2RvLTE6IGhvdyBjYW4gSSBmbGFnIGEgcHJvcGVydHkgYXMgb3B0aW9uYWwgaW4gVHlwZVNjcmlwdCBnZW5lcmF0b3IgPyBXb3VsZCBiZSBwcm9iYWJseSBzb21lIGtpbmQgb2YganNvbi9qYWNrc29uIEByZXF1aXJlZCBhbm5vdGF0aW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogbWV0YTY0LnNob3dNZXRhRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLnNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlID0gKHJlczoganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2aW5nIFByZWZlcmVuY2VzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IHRyeSBhbmQgbWFpbnRhaW4gc2Nyb2xsIHBvc2l0aW9uID8gdGhpcyBpcyBnb2luZyB0byBiZSBhc3luYywgc28gd2F0Y2ggb3V0LlxyXG4gICAgICAgICAgICAgICAgLy8gdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc2VsZWN0KG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PSBtZXRhNjQuTU9ERV9TSU1QTEUgPyB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgOiB0aGlzXHJcbiAgICAgICAgICAgICAgICAuaWQoXCJlZGl0TW9kZUFkdmFuY2VkXCIpKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBwdXQgdGhlc2UgdHdvIGxpbmVzIGluIGEgdXRpbGl0eSBtZXRob2RcclxuICAgICAgICAgICAgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNoZWNrZWQgPSBtZXRhNjQuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWFuYWdlQWNjb3VudERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hbmFnZUFjY291bnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWFuYWdlQWNjb3VudERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJNYW5hZ2UgQWNjb3VudFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2xvc2VBY2NvdW50QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYmFja0J1dHRvbik7XHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjbG9zZS1hY2NvdW50LWJhclwiXHJcbiAgICAgICAgICAgIH0sIGJvdHRvbUJ1dHRvbkJhcik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBFeHBvcnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBFeHBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkV4cG9ydCB0byBGaWxlIE5hbWVcIiwgXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGV4cG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkV4cG9ydFwiLCBcImV4cG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuZXhwb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihleHBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHRhcmdldEZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBleHBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwb3J0UmVxdWVzdCwganNvbi5FeHBvcnRSZXNwb25zZT4oXCJleHBvcnRUb1htbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmV4cG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5FeHBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFeHBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogSW1wb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgSW1wb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkZpbGUgbmFtZSB0byBpbXBvcnRcIiwgXCJzb3VyY2VGaWxlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGltcG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkltcG9ydFwiLCBcImltcG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuaW1wb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsSW1wb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihpbXBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltcG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgc291cmNlRmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNvdXJjZUZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBpbXBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW1wb3J0UmVxdWVzdCxqc29uLkltcG9ydFJlc3BvbnNlPihcImltcG9ydFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlRmlsZU5hbWVcIjogc291cmNlRmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmltcG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGltcG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5JbXBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW1wb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbXBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoQ29udGVudERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaENvbnRlbnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoQ29udGVudERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoIENvbnRlbnRcIik7XG5cbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBPbmx5IGNvbnRlbnQgdGV4dCB3aWxsIGJlIHNlYXJjaGVkLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5DT05URU5UKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLy91dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaFRhZ3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hUYWdzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSB0YWdzIHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hGaWxlc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaEZpbGVzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBsdWNlbmU6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2VhcmNoRmlsZXNEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBGaWxlc1wiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaEJ1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzZWFyY2hCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBpbnN0cnVjdGlvbnMgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hGaWxlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoc2VsTm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGVJZCA9IHNlbE5vZGUuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkZpbGVTZWFyY2hSZXF1ZXN0LCBqc29uLkZpbGVTZWFyY2hSZXNwb25zZT4oXCJmaWxlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXG4gICAgICAgICAgICAgICAgXCJyZWluZGV4XCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0XG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaEZpbGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgcHdkOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFzc0NvZGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgdGhlIHVzZXIgaXMgZG9pbmcgYSBcIlJlc2V0IFBhc3N3b3JkXCIgd2Ugd2lsbCBoYXZlIGEgbm9uLW51bGwgcGFzc0NvZGUgaGVyZSwgYW5kIHdlIHNpbXBseSBzZW5kIHRoaXMgdG8gdGhlIHNlcnZlclxyXG4gICAgICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMucGFzc0NvZGUgPyBcIlBhc3N3b3JkIFJlc2V0XCIgOiBcIkNoYW5nZSBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG5cclxuICAgICAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiTmV3IFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoYW5nZVBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZEFjdGlvbkJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbENoYW5nZVBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjaGFuZ2VQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnB3ZCAmJiB0aGlzLnB3ZC5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0LGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdQYXNzd29yZFwiOiB0aGlzLnB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBwYXNzd29yZFwiLCByZXMpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IFwiUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCI8cD5Zb3UgbWF5IG5vdyBsb2dpbiBhcyA8Yj5cIiArIHJlcy51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgXCI8L2I+IHdpdGggeW91ciBuZXcgcGFzc3dvcmQuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZywgXCJQYXNzd29yZCBDaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIGxvZ2luIGNhbGwgRE9FUyB3b3JrLCBidXQgdGhlIHJlYXNvbiB3ZSBkb24ndCBkbyB0aGlzIGlzIGJlY2F1c2UgdGhlIFVSTCBzdGlsbCBoYXMgdGhlIHBhc3NDb2RlIG9uIGl0IGFuZCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dhbnQgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIGEgdXJsIHdpdGhvdXQgdGhhdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cyhcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVzZXRQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB1c2VyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHlvdXIgdXNlciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIGFuZCBhIGNoYW5nZS1wYXNzd29yZCBsaW5rIHdpbGwgYmUgc2VudCB0byB5b3VcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVzZXQgbXkgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIikudHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlck5hbWUgJiYgZW1haWxBZGRyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZXNldFBhc3N3b3JkUmVxdWVzdCwganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWxBZGRyZXNzXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJPb3BzLiBUcnkgdGhhdCBhZ2Fpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVzZXQgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21GaWxlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvLTA6IFRoaXMgaXMgdWdseSB0byBwcmUtY3JlYXRlIHRoZXNlIGlucHV0IGZpZWxkcy4gTmVlZCB0byBtYWtlIHRoZW0gYWJsZSB0byBhZGQgZHluYW1pY2FsbHkuXG4gICAgICAgICAgICAgKiAoV2lsbCBkbyB0aGlzIG1vZGlmaWNhdGlvbiBvbmNlIEkgZ2V0IHRoZSBkcmFnLW4tZHJvcCBzdHVmZiB3b3JraW5nIGZpcnN0KVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmlsZXNcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiBib29sZWFuIGZpZWxkIHRvIHNwZWNpZnkgaWYgd2UgZXhwbG9kZSB6aXAgZmlsZXMgb250byB0aGUgSkNSIHRyZWUgKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJleHBsb2RlWmlwc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBcImVuY3R5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgICAgIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWwgPSAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIikpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEZ1bmMgPSAoZXhwbG9kZVppcHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIikpLmF0dHIoXCJ2YWx1ZVwiLCBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSBkbyBzb21ldGhpbmcgZGlmZmVyZW50bHkgZnJvbSB0aGUgbm9ybWFsICd1dGlsLmpzb24oKScgY2FsbHMgdG8gdGhlIHNlcnZlciwgYmVjYXVzZVxuICAgICAgICAgICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpLmRyb3B6b25lKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVGaWxlTGlzdCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IHRoaXMuZmlsZUxpc3QuY29uY2F0KGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkpO1xuXG4gICAgICAgICAgICAvKiBEZXRlY3QgaWYgYW55IFpJUCBmaWxlcyBhcmUgY3VycmVudGx5IHNlbGVjdGVkLCBhbmQgYXNrIHVzZXIgdGhlIHF1ZXN0aW9uIGFib3V0IHdoZXRoZXIgdGhleVxuICAgICAgICAgICAgc2hvdWxkIGJlIGV4dHJhY3RlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyB0aGUgdXBsb2FkLCBhbmQgdXBsb2FkZWQgYXMgaW5kaXZpZHVhbCBub2Rlc1xuICAgICAgICAgICAgZm9yIGVhY2ggZmlsZSAqL1xuICAgICAgICAgICAgaWYgKCF0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgJiYgdGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGZpbGUgb2YgdGhpcy5maWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuQnV0dG9uRW5hYmxlbWVudCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICBkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWd1cmVEcm9wWm9uZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbVVybERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uVXBsb2FkRnJvbVVybFJlcXVlc3QsIGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlPihcInVwbG9hZEZyb21VcmxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgICAgIH0sIHRoaXMudXBsb2FkRnJvbVVybFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZyb21VcmxSZXNwb25zZSA9IChyZXM6IGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcblxuLypcbiAqIEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGVzKVxuICpcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICAgICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZU5hbWU/OiBzdHJpbmcsIHByaXZhdGUgY3JlYXRlQXRUb3A/OmJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGVsZXRlUHJvcEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkRlbGV0ZVwiLCBcImRlbGV0ZVByb3BCdXR0b25cIiwgdGhpcy5kZWxldGVQcm9wZXJ0eUJ1dHRvbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uICsgZGVsZXRlUHJvcEJ1dHRvblxuICAgICAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDYwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyBtYXgtd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDt3aWR0aDoxMDAlOyBvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBcInZlcnRpY2FsLWxheW91dC1yb3dcIlxuICAgICAgICAgICAgICAgIC8vXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiXG4gICAgICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VuZXJhdGVzIGFsbCB0aGUgSFRNTCBlZGl0IGZpZWxkcyBhbmQgcHV0cyB0aGVtIGludG8gdGhlIERPTSBtb2RlbCBvZiB0aGUgcHJvcGVydHkgZWRpdG9yIGRpYWxvZyBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwb3B1bGF0ZUVkaXROb2RlUGcgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIC8qIGNsZWFyIHRoaXMgbWFwIHRvIGdldCByaWQgb2Ygb2xkIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgICAgIC8qIGVkaXROb2RlIHdpbGwgYmUgbnVsbCBpZiB0aGlzIGlzIGEgbmV3IG5vZGUgYmVpbmcgY3JlYXRlZCAqL1xuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICAvKiBpdGVyYXRvciBmdW5jdGlvbiB3aWxsIGhhdmUgdGhlIHdyb25nICd0aGlzJyBzbyB3ZSBzYXZlIHRoZSByaWdodCBvbmUgKi9cbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZSwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VNdWx0aVByb3BFZGl0b3IocHJvcEVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZVNpbmdsZVByb3BFZGl0b3IocHJvcEVudHJ5LCBhY2VGaWVsZHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB8fCBlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcInByb3BlcnR5RWRpdExpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1IaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwic3R5bGVcIiA6IFwiZGlzcGxheTogXCIrICghcmRPbmx5IHx8IG1ldGE2NC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJpbmxpbmVcIiA6IFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICB9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBFZGl0aW5nIGEgbmV3IG5vZGUgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogdGhpcyBlbnRpcmUgYmxvY2sgbmVlZHMgcmV2aWV3IG5vdyAocmVkZXNpZ24pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIG5ldyBub2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY2VGaWVsZElkID0gdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5ldyBOb2RlIE5hbWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgICAgIC8vIHZhciB0b2dnbGVSZWFkb25seVZpc0J1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGZpZWxkcyArPSB0b2dnbGVSZWFkb25seVZpc0J1dHRvbjtcblxuICAgICAgICAgICAgLy9sZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wVGFibGU6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlXCIsXG4gICAgICAgICAgICAgICAgfSwgZmllbGRzKTtcblxuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLCBwcm9wVGFibGUpO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChhY2VGaWVsZHNbaV0uaWQpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoYWNlRmllbGRzW2ldLnZhbC51bmVuY29kZUh0bWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5hY2VFZGl0b3JzQnlJZFthY2VGaWVsZHNbaV0uaWRdID0gZWRpdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluc3RyID0gZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUgPyAvL1xuICAgICAgICAgICAgICAgIFwiWW91IG1heSBsZWF2ZSB0aGlzIGZpZWxkIGJsYW5rIGFuZCBhIHVuaXF1ZSBJRCB3aWxsIGJlIGFzc2lnbmVkLiBZb3Ugb25seSBuZWVkIHRvIHByb3ZpZGUgYSBuYW1lIGlmIHlvdSB3YW50IHRoaXMgbm9kZSB0byBoYXZlIGEgbW9yZSBtZWFuaW5nZnVsIFVSTC5cIlxuICAgICAgICAgICAgICAgIDogLy9cbiAgICAgICAgICAgICAgICBcIlwiO1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpKS5odG1sKGluc3RyKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFsbG93IGFkZGluZyBvZiBuZXcgcHJvcGVydGllcyBhcyBsb25nIGFzIHRoaXMgaXMgYSBzYXZlZCBub2RlIHdlIGFyZSBlZGl0aW5nLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gc3RhcnRcbiAgICAgICAgICAgICAqIG1hbmFnaW5nIG5ldyBwcm9wZXJ0aWVzIG9uIHRoZSBjbGllbnQgc2lkZS4gV2UgbmVlZCBhIGdlbnVpbmUgbm9kZSBhbHJlYWR5IHNhdmVkIG9uIHRoZSBzZXJ2ZXIgYmVmb3JlIHdlIGFsbG93XG4gICAgICAgICAgICAgKiBhbnkgcHJvcGVydHkgZWRpdGluZyB0byBoYXBwZW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUJ1dHRvblwiKSwgIWVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKTtcblxuICAgICAgICAgICAgdmFyIHRhZ3NQcm9wRXhpc3RzID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwidGFnc1wiLCBlZGl0LmVkaXROb2RlKSAhPSBudWxsO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoYXNUYWdzUHJvcDogXCIgKyB0YWdzUHJvcCk7XG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIpLCAhdGFnc1Byb3BFeGlzdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlU2hvd1JlYWRPbmx5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLy8gYWxlcnQoXCJub3QgeWV0IGltcGxlbWVudGVkLlwiKTtcbiAgICAgICAgICAgIC8vIHNlZSBzYXZlRXhpc3RpbmdOb2RlIGZvciBob3cgdG8gaXRlcmF0ZSBhbGwgcHJvcGVydGllcywgYWx0aG91Z2ggSSB3b25kZXIgd2h5IEkgZGlkbid0IGp1c3QgdXNlIGEgbWFwL3NldCBvZlxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyBlbGVtZW50c1xuICAgICAgICAgICAgLy8gaW5zdGVhZCBzbyBJIGRvbid0IG5lZWQgdG8gcGFyc2UgYW55IERPTSBvciBkb21JZHMgaW5vcmRlciB0byBpdGVyYXRlIG92ZXIgdGhlIGxpc3Qgb2YgdGhlbT8/Pz9cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0ID0gbmV3IEVkaXRQcm9wZXJ0eURsZyh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdC5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUYWdzUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGVkaXQuZWRpdE5vZGUsIFwidGFnc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IFwidGFnc1wiLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IFwiXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5hZGRUYWdzUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUYWdzUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkFkZCBUYWdzIFByb3BlcnR5XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlKHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFN1YlByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0ucHJvcGVydHk7XG5cbiAgICAgICAgICAgIHZhciBpc011bHRpID0gdXRpbC5pc09iamVjdChwcm9wLnZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8qIGNvbnZlcnQgdG8gbXVsdGktdHlwZSBpZiB3ZSBuZWVkIHRvICovXG4gICAgICAgICAgICBpZiAoIWlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzLnB1c2gocHJvcC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBub3cgYWRkIG5ldyBlbXB0eSBwcm9wZXJ0eSBhbmQgcG9wdWxhdGUgaXQgb250byB0aGUgc2NyZWVuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogVE9ETy0zOiBmb3IgcGVyZm9ybWFuY2Ugd2UgY291bGQgZG8gc29tZXRoaW5nIHNpbXBsZXIgdGhhbiAncG9wdWxhdGVFZGl0Tm9kZVBnJyBoZXJlLCBidXQgZm9yIG5vdyB3ZSBqdXN0XG4gICAgICAgICAgICAgKiByZXJlbmRlcmluZyB0aGUgZW50aXJlIGVkaXQgcGFnZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChcIlwiKTtcblxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIERlbGV0ZXMgdGhlIHByb3BlcnR5IG9mIHRoZSBzcGVjaWZpZWQgbmFtZSBvbiB0aGUgbm9kZSBiZWluZyBlZGl0ZWQsIGJ1dCBmaXJzdCBnZXRzIGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5ID0gKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIHRoZSBQcm9wZXJ0eTogXCIgKyBwcm9wTmFtZSwgXCJZZXMsIGRlbGV0ZS5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eUltbWVkaWF0ZShwcm9wTmFtZSk7XG4gICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlUHJvcGVydHlJbW1lZGlhdGUgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZT4oXCJkZWxldGVQcm9wZXJ0eVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByb3BOYW1lXCI6IHByb3BOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlUHJvcGVydHlSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlSZXNwb25zZShyZXMsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlUHJvcGVydHlSZXNwb25zZSA9IChyZXM6IGFueSwgcHJvcGVydHlUb0RlbGV0ZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBwcm9wZXJ0eVwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIHJlbW92ZSBkZWxldGVkIHByb3BlcnR5IGZyb20gY2xpZW50IHNpZGUgZGF0YSwgc28gd2UgY2FuIHJlLXJlbmRlciBzY3JlZW4gd2l0aG91dCBtYWtpbmcgYW5vdGhlciBjYWxsIHRvXG4gICAgICAgICAgICAgICAgICogc2VydmVyXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcHJvcHMuZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhKHByb3BlcnR5VG9EZWxldGUpO1xuXG4gICAgICAgICAgICAgICAgLyogbm93IGp1c3QgcmUtcmVuZGVyIHNjcmVlbiBmcm9tIGxvY2FsIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCksIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCldO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogc2NhbiBmb3IgYWxsIG11bHRpLXZhbHVlIHByb3BlcnR5IGZpZWxkcyBhbmQgY2xlYXIgdGhlbSAqL1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNvdW50ZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKSwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIGZvciBub3cganVzdCBsZXQgc2VydmVyIHNpZGUgY2hva2Ugb24gaW52YWxpZCB0aGluZ3MuIEl0IGhhcyBlbm91Z2ggc2VjdXJpdHkgYW5kIHZhbGlkYXRpb24gdG8gYXQgbGVhc3QgcHJvdGVjdFxuICAgICAgICAgKiBpdHNlbGYgZnJvbSBhbnkga2luZCBvZiBkYW1hZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBzYXZlTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJZiBlZGl0aW5nIGFuIHVuc2F2ZWQgbm9kZSBpdCdzIHRpbWUgdG8gcnVuIHRoZSBpbnNlcnROb2RlLCBvciBjcmVhdGVTdWJOb2RlLCB3aGljaCBhY3R1YWxseSBzYXZlcyBvbnRvIHRoZVxuICAgICAgICAgICAgICogc2VydmVyLCBhbmQgd2lsbCBpbml0aWF0ZSBmdXJ0aGVyIGVkaXRpbmcgbGlrZSBmb3IgcHJvcGVydGllcywgZXRjLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVOZXdOb2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogbmVlZCB0byBtYWtlIHRoaXMgY29tcGF0aWJsZSB3aXRoIEFjZSBFZGl0b3IuXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlTmV3Tm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEVsc2Ugd2UgYXJlIGVkaXRpbmcgYSBzYXZlZCBub2RlLCB3aGljaCBpcyBhbHJlYWR5IHNhdmVkIG9uIHNlcnZlci5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVFeGlzdGluZ05vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVOZXdOb2RlID0gKG5ld05vZGVOYW1lPzogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIW5ld05vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZU5hbWUgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIHdlIGRpZG4ndCBjcmVhdGUgdGhlIG5vZGUgd2UgYXJlIGluc2VydGluZyB1bmRlciwgYW5kIG5laXRoZXIgZGlkIFwiYWRtaW5cIiwgdGhlbiB3ZSBuZWVkIHRvIHNlbmQgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgKiBlbWFpbCB1cG9uIHNhdmluZyB0aGlzIG5ldyBub2RlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJOYW1lICE9IGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAmJiAvL1xuICAgICAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAhPSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGVkaXQubm9kZUluc2VydFRhcmdldCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluc2VydE5vZGVSZXF1ZXN0LCBqc29uLkluc2VydE5vZGVSZXNwb25zZT4oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnRJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROYW1lXCI6IGVkaXQubm9kZUluc2VydFRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIlxuICAgICAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ3JlYXRlU3ViTm9kZVJlcXVlc3QsIGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlPihcImNyZWF0ZVN1Yk5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0aGlzLnR5cGVOYW1lID8gdGhpcy50eXBlTmFtZSA6IFwibnQ6dW5zdHJ1Y3R1cmVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3JlYXRlQXRUb3BcIiA6IHRoaXMuY3JlYXRlQXRUb3BcbiAgICAgICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbC5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IHRhYmxlLWNlbGw7XCJcbiAgICAgICAgICAgIH0sIGZpZWxkcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlU2luZ2xlUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSwgYWNlRmllbGRzOiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eSBzaW5nbGUtdHlwZTogXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBsYWJlbCA9IHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgPyBwcm9wVmFsIDogJyc7XG4gICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbFN0ci5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFraW5nIHNpbmdsZSBwcm9wIGVkaXRvcjogcHJvcFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCJdIHZhbFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgICAgICAgICsgXCJdIGZpZWxkSWQ9XCIgKyBwcm9wRW50cnkuaWQpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcFNlbENoZWNrYm94OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcFNlbENoZWNrYm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJcIiwgXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc2VsQ29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiA0MHB4OyBkaXNwbGF5OiB0YWJsZS1jZWxsOyBwYWRkaW5nOiAxMHB4O1wiXG4gICAgICAgICAgICB9LCBwcm9wU2VsQ2hlY2tib3gpO1xuXG4gICAgICAgICAgICBsZXQgZWRpdENvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweDtcIlxuICAgICAgICAgICAgfSwgZmllbGQpO1xuXG4gICAgICAgICAgICByZXR1cm4gc2VsQ29sICsgZWRpdENvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5QnV0dG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgb3ZlciBhbGwgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5maWVsZElkVG9Qcm9wTWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRJZFRvUHJvcE1hcC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgUHJvcEVudHJ5IGZvciB0aGlzIGl0ZW0gKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3A9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsUHJvcERvbUlkID0gXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IGNoZWNrYm94IGNvbnRyb2wgYW5kIGl0cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9kby0xOiBnZXR0aW5nIHZhbHVlIG9mIGNoZWNrYm94IHNob3VsZCBiZSBpbiBzb21lIHNoYXJlZCB1dGlsaXR5IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHNlbFByb3BEb21JZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbENoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQ6IGJvb2xlYW4gPSBzZWxDaGVja2JveC5ub2RlLmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3AgSVMgQ0hFQ0tFRD1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcm9wZXJ0eShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZm9yIG5vdyBsZXRzJyBqdXN0IHN1cHBvcnQgZGVsZXRpbmcgb25lIHByb3BlcnR5IGF0IGEgdGltZSwgYW5kIHNvIHdlIGNhbiByZXR1cm4gb25jZSB3ZSBmb3VuZCBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgb25lIHRvIGRlbGV0ZS4gV291bGQgYmUgZWFzeSB0byBleHRlbmQgdG8gYWxsb3cgbXVsdGlwbGUtc2VsZWN0cyBpbiB0aGUgZnV0dXJlICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInByb3BFbnRyeSBub3QgZm91bmQgZm9yIGlkOiBcIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcHJvcGVydHk6IFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0UHJvcGVydHlEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZSBQcm9wZXJ0eVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLnNhdmVQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlUHJvcGVydHlCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiJyBjbGFzcz0ncGF0aC1kaXNwbGF5LWluLWVkaXRvcic+PC9kaXY+XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVsYXRlUHJvcGVydHlFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gJyc7XG5cbiAgICAgICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wTmFtZUlkID0gXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcE5hbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcE5hbWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOYW1lXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogUHJvcGVydHkgVmFsdWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wVmFsdWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgdGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiVmFsdWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSwgZmllbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiKSk7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIikpO1xuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBwcm9wZXJ0eVZhbHVlRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIiA6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0ndmVydGljYWwtbGF5b3V0LXJvdycgc3R5bGU9XFxcIndpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsO2JvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1xcXCIgaWQ9J1wiXG4gICAgICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdldHMgcHJpdmlsZWdlcyBmcm9tIHNlcnZlciBhbmQgZGlzcGxheXMgaW4gR1VJIGFsc28uIEFzc3VtZXMgZ3VpIGlzIGFscmVhZHkgYXQgY29ycmVjdCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVsb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5vZGUgc2hhcmluZyBpbmZvLlwiKTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSGFuZGxlcyBnZXROb2RlUHJpdmlsZWdlcyByZXNwb25zZS5cbiAgICAgICAgICpcbiAgICAgICAgICogcmVzPWpzb24gb2YgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZS5qYXZhXG4gICAgICAgICAqXG4gICAgICAgICAqIHJlcy5hY2xFbnRyaWVzID0gbGlzdCBvZiBBY2Nlc3NDb250cm9sRW50cnlJbmZvLmphdmEganNvbiBvYmplY3RzXG4gICAgICAgICAqL1xuICAgICAgICBnZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlU2hhcmluZ1BnKHJlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGdvdHRlbiBiYWNrIGZyb20gdGhlIHNlcnZlciBjb250YWluaW5nIEFDTCBpbmZvIHNvIHdlIGNhbiBwb3B1bGF0ZSB0aGUgc2hhcmluZyBwYWdlIGluIHRoZSBndWlcbiAgICAgICAgICovXG4gICAgICAgIHBvcHVsYXRlU2hhcmluZ1BnID0gKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgVGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICQuZWFjaChyZXMuYWNsRW50cmllcywgZnVuY3Rpb24oaW5kZXgsIGFjbEVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1saXN0XCJcbiAgICAgICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgcHVibGljQXBwZW5kQXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChyZXMucHVibGljQXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgcHVibGljQXBwZW5kQXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIHRvZG86IHVzZSBhY3R1YWwgcG9seW1lciBwYXBlci1jaGVja2JveCBoZXJlICovXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBwdWJsaWNBcHBlbmRBdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfSwgXCJBbGxvdyBwdWJsaWMgY29tbWVudGluZyB1bmRlciB0aGlzIG5vZGUuXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIiksIGh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBVc2luZyBvbkNsaWNrIG9uIHRoZSBlbGVtZW50IEFORCB0aGlzIHRpbWVvdXQgaXMgdGhlIG9ubHkgaGFjayBJIGNvdWxkIGZpbmQgdG8gZ2V0IGdldCB3aGF0IGFtb3VudHMgdG8gYSBzdGF0ZVxuICAgICAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAgICAgKiBzaW1wbHkgYSBidWcgaW4gZ29vZ2xlIGNvZGUgQUZBSUsuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpei5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKSk7XG5cbiAgICAgICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IChwb2x5RWxtLm5vZGUuY2hlY2tlZCA/IHRydWUgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW1vdmVQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlPihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICAgICAgfSwgdGhpcy5yZW1vdmVQcml2aWxlZ2VSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJBY2xQcml2aWxlZ2VzID0gKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1lbnRyeVwiXG4gICAgICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAobmV3IFNoYXJlVG9QZXJzb25EbGcoKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNoYXJpbmcgbm9kZSB0byBwdWJsaWMuXCIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFkZCBwcml2aWxlZ2UgYW5kIHRoZW4gcmVsb2FkIHNoYXJlIG5vZGVzIGRpYWxvZyBmcm9tIHNjcmF0Y2ggZG9pbmcgYW5vdGhlciBjYWxsYmFjayB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IFwiZXZlcnlvbmVcIixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5yZWxvYWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVuYW1lTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlbmFtZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgY3VyTm9kZU5hbWVEaXNwbGF5ID0gXCI8aDMgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2gzPlwiO1xuICAgICAgICAgICAgdmFyIGN1ck5vZGVQYXRoRGlzcGxheSA9IFwiPGg0IGNsYXNzPSdwYXRoLWRpc3BsYXknIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikgKyBcIic+PC9oND5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1lTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZUJ1dHRvblwiLCB0aGlzLnJlbmFtZU5vZGUsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVuYW1lTm9kZUJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgY3VyTm9kZU5hbWVEaXNwbGF5ICsgY3VyTm9kZVBhdGhEaXNwbGF5ICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlbGVjdCBhIG5vZGUgdG8gcmVuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogaWYgbm8gbm9kZSBiZWxvdyB0aGlzIG5vZGUsIHJldHVybnMgbnVsbCAqL1xuICAgICAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1pbmdSb290Tm9kZSA9IChoaWdobGlnaHROb2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVJZCk7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmFtZU5vZGVSZXF1ZXN0LCBqc29uLlJlbmFtZU5vZGVSZXNwb25zZT4oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5yZW5hbWVOb2RlUmVzcG9uc2UocmVzLCByZW5hbWluZ1Jvb3ROb2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UsIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlbmFtZSBub2RlXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgaGlnaGxpZ2h0Tm9kZS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEF1ZGlvUGxheWVyRGxnLmpzXCIpO1xyXG5cclxuLyogVGhpcyBpcyBhbiBhdWRpbyBwbGF5ZXIgZGlhbG9nIHRoYXQgaGFzIGFkLXNraXBwaW5nIHRlY2hub2xvZ3kgcHJvdmlkZWQgYnkgcG9kY2FzdC50cyAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBdWRpb1BsYXllckRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVVybDogc3RyaW5nLCBwcml2YXRlIG5vZGVVaWQ6IHN0cmluZywgcHJpdmF0ZSBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJBdWRpb1BsYXllckRsZ1wiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHN0YXJ0VGltZVBlbmRpbmcgaW4gY29uc3RydWN0b3I6ICR7c3RhcnRUaW1lUGVuZGluZ31gKTtcclxuICAgICAgICAgICAgcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nID0gc3RhcnRUaW1lUGVuZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdoZW4gdGhlIGRpYWxvZyBjbG9zZXMgd2UgbmVlZCB0byBzdG9wIGFuZCByZW1vdmUgdGhlIHBsYXllciAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gJChcIiNcIiArIHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8qIGZvciBzb21lIHJlYXNvbiB0aGUgYXVkaW8gcGxheWVyIG5lZWRzIHRvIGJlIGFjY2Vzc2VkIGxpa2UgaXQncyBhbiBhcnJheSAqL1xyXG4gICAgICAgICAgICAgICAgcGxheWVyWzBdLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJBdWRpbyBQbGF5ZXJcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdGhpcy5ub2RlVWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBgdW5rbm93biBub2RlIHVpZDogJHt0aGlzLm5vZGVVaWR9YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIGlzIHdoZXJlIEkgbmVlZCBhIHNob3J0IG5hbWUgb2YgdGhlIG1lZGlhIGJlaW5nIHBsYXllZCAqL1xyXG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSByZW5kZXIudGFnKFwicFwiLCB7XHJcbiAgICAgICAgICAgIH0sIHJzc1RpdGxlLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vcmVmZXJlbmNlczpcclxuICAgICAgICAgICAgLy9odHRwOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9yZWZfYXZfZG9tLmFzcFxyXG4gICAgICAgICAgICAvL2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQXVkaW9fQVBJXHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJBdHRyaWJzOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICBcInNyY1wiOiB0aGlzLnNvdXJjZVVybCxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImF1ZGlvUGxheWVyXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiAxMDAlOyBwYWRkaW5nOjBweDsgbWFyZ2luLXRvcDogMHB4OyBtYXJnaW4tbGVmdDogMHB4OyBtYXJnaW4tcmlnaHQ6IDBweDtcIixcclxuICAgICAgICAgICAgICAgIFwib250aW1ldXBkYXRlXCI6IGBtNjQucG9kY2FzdC5vblRpbWVVcGRhdGUoJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgICAgICBcIm9uY2FucGxheVwiOiBgbTY0LnBvZGNhc3Qub25DYW5QbGF5KCcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICAgICAgXCJjb250cm9sc1wiOiBcImNvbnRyb2xzXCIsXHJcbiAgICAgICAgICAgICAgICBcInByZWxvYWRcIiA6IFwiYXV0b1wiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gcmVuZGVyLnRhZyhcImF1ZGlvXCIsIHBsYXllckF0dHJpYnMpO1xyXG5cclxuICAgICAgICAgICAgLy9Ta2lwcGluZyBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBza2lwQmFjazMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBtNjQucG9kY2FzdC5za2lwKC0zMCwgJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCI8IDMwc1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBza2lwRm9yd2FyZDMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBtNjQucG9kY2FzdC5za2lwKDMwLCAnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2tpcEJhY2szMEJ1dHRvbiArIHNraXBGb3J3YXJkMzBCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9TcGVlZCBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuMCk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWQxNUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuNSk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIxLjVYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMnhCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgyKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjJYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9EaWFsb2cgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgcGF1c2VCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wYXVzZSgpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGF1c2VcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnBsYXkoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwbGF5QnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBldmVuIGlmIHRoaXMgYnV0dG9uIGFwcGVhcnMgdG8gd29yaywgSSBuZWVkIGl0IHRvIGV4cGxpY2l0bHkgZW5mb3JjZSB0aGUgc2F2aW5nIG9mIHRoZSB0aW1ldmFsdWUgQU5EIHRoZSByZW1vdmFsIG9mIHRoZSBBVURJTyBlbGVtZW50IGZyb20gdGhlIERPTSAqL1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBkZXNjcmlwdGlvbiArIHBsYXllciArIHNraXBCdXR0b25CYXIgKyBzcGVlZEJ1dHRvbkJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcihudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDcmVhdGVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgICAgICBsYXN0U2VsVHlwZU5hbWU6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgICAgICBsZXQgY3JlYXRlRmlyc3RDaGlsZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiRmlyc3RcIiwgXCJjcmVhdGVGaXJzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlRmlyc3RDaGlsZCwgdGhpcywgdHJ1ZSwgMTAwMCk7XG4gICAgICAgICAgICBsZXQgY3JlYXRlTGFzdENoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJMYXN0XCIsIFwiY3JlYXRlTGFzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlTGFzdENoaWxkLCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIklubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjcmVhdGVGaXJzdENoaWxkQnV0dG9uICsgY3JlYXRlTGFzdENoaWxkQnV0dG9uICsgY3JlYXRlSW5saW5lQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0eXBlSWR4ID0gMDtcbiAgICAgICAgICAgIC8qIHRvZG8tMTogbmVlZCBhIGJldHRlciB3YXkgdG8gZW51bWVyYXRlIGFuZCBhZGQgdGhlIHR5cGVzIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBzZWFyY2ggKi9cbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTdGFuZGFyZCBUeXBlXCIsIFwibnQ6dW5zdHJ1Y3R1cmVkXCIsIHR5cGVJZHgrKywgdHJ1ZSk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiUlNTIEZlZWRcIiwgXCJtZXRhNjQ6cnNzZmVlZFwiLCB0eXBlSWR4KyssIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTeXN0ZW0gRm9sZGVyXCIsIFwibWV0YTY0OnN5c3RlbWZvbGRlclwiLCB0eXBlSWR4KyssIGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImxpc3RCb3hcIlxuICAgICAgICAgICAgfSwgY29udGVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VMaXN0SXRlbSh2YWw6IHN0cmluZywgdHlwZU5hbWU6IHN0cmluZywgdHlwZUlkeDogbnVtYmVyLCBpbml0aWFsbHlTZWxlY3RlZDogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcGF5bG9hZDogT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdHlwZU5hbWUsXG4gICAgICAgICAgICAgICAgXCJ0eXBlSWR4XCI6IHR5cGVJZHhcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBkaXZJZDogc3RyaW5nID0gdGhpcy5pZChcInR5cGVSb3dcIiArIHR5cGVJZHgpO1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbGx5U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxUeXBlTmFtZSA9IHR5cGVOYW1lO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlbERvbUlkID0gZGl2SWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEl0ZW1cIiArIChpbml0aWFsbHlTZWxlY3RlZCA/IFwiIHNlbGVjdGVkTGlzdEl0ZW1cIiA6IFwiXCIpLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogZGl2SWQsXG4gICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IG1ldGE2NC5lbmNvZGVPbkNsaWNrKHRoaXMub25Sb3dDbGljaywgdGhpcywgcGF5bG9hZClcbiAgICAgICAgICAgIH0sIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVGaXJzdENoaWxkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUxhc3RDaGlsZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXN0U2VsVHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcImNob29zZSBhIHR5cGUuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShudWxsLCB0aGlzLmxhc3RTZWxUeXBlTmFtZSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlSW5saW5lID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdC5pbnNlcnROb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUm93Q2xpY2sgPSAocGF5bG9hZDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgZGl2SWQgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgcGF5bG9hZC50eXBlSWR4KTtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbFR5cGVOYW1lID0gcGF5bG9hZC50eXBlTmFtZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFNlbERvbUlkKSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMubGFzdFNlbERvbUlkKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxEb21JZCA9IGRpdklkO1xuICAgICAgICAgICAgJChcIiNcIiArIGRpdklkKS5hZGRDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBjYW5JbnNlcnRJbmxpbmU6IGJvb2xlYW4gPSBtZXRhNjQuaG9tZU5vZGVJZCAhPSBub2RlLmlkO1xuICAgICAgICAgICAgICAgIGlmIChjYW5JbnNlcnRJbmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmlkKFwiI2NyZWF0ZUlubGluZUJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmlkKFwiI2NyZWF0ZUlubGluZUJ1dHRvblwiKSkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJyBjbGFzcz0ncGFnZS10aXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdGltZWxpbmVSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZVJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwidGltZWxpbmVUYWJOYW1lXCI7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZScgY2xhc3M9J3BhZ2UtdGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0ndGltZWxpbmVWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgJChcIiN0aW1lbGluZVBhZ2VUaXRsZVwiKS5odG1sKHNyY2gudGltZWxpbmVQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC50aW1lbGluZVJlc3VsdHMsIFwidGltZWxpbmVWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=