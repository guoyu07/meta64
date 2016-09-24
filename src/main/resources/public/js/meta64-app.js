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
        cnst.MOVE_UPDOWN_ON_TOOLBAR = false;
        cnst.USE_ACE_EDITOR = false;
        cnst.SHOW_PATH_ON_ROWS = true;
        cnst.SHOW_PATH_IN_DLGS = true;
    })(cnst = m64.cnst || (m64.cnst = {}));
})(m64 || (m64 = {}));
var m64;
(function (m64) {
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
                console.log("Failed starting request: " + postName);
                throw ex;
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
                    throw "Failed handling result of: " + postName + " ex=" + ex;
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
                    throw "Failed processing server-side fail of: " + postName;
                }
            });
            return ironRequest;
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
                elm.style.display = 'block';
            }
            else {
                elm.style.display = 'none';
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
            (new m64.UploadFromFileDlg()).open();
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
        var insertBookResponse = function (res) {
            console.log("insertBookResponse running.");
            m64.util.checkSuccess("Insert Book", res);
            m64.view.refreshTree(null, false);
            m64.meta64.selectTab("mainTabName");
            m64.view.scrollToSelectedNode();
        };
        var deleteNodesResponse = function (res, payload) {
            if (m64.util.checkSuccess("Delete node", res)) {
                debugger;
                m64.meta64.clearSelectedNodes();
                var highlightId = null;
                if (payload) {
                    var selNode = payload["postDeleteSelNode"];
                    highlightId = selNode.id;
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
        edit.createSubNodeUnderHighlight = function () {
            edit.parentOfNewNode = m64.meta64.getHighlightedNode();
            if (!edit.parentOfNewNode) {
                (new m64.MessageDlg("Tap a node to insert under.")).open();
                return;
            }
            edit.nodeInsertTarget = null;
            edit.startEditingNewNode();
        };
        edit.replyToComment = function (uid) {
            edit.createSubNode(uid);
        };
        edit.createSubNode = function (uid) {
            if (!uid) {
                edit.parentOfNewNode = m64.meta64.currentNode;
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
        meta64.encodeOnClick = function (callback, ctx) {
            if (typeof callback == "string") {
                return callback;
            }
            else if (typeof callback == "function") {
                meta64.registerDataObject(callback);
                if (ctx) {
                    meta64.registerDataObject(ctx);
                    return "m64.meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
                }
                else {
                    return "m64.meta64.runCallback(" + callback.guid + ");";
                }
            }
            else {
                throw "unexpected callback type in encodeOnClick";
            }
        };
        meta64.runCallback = function (guid, ctx) {
            var dataObj = meta64.getObjectByGuid(guid);
            if (dataObj.callback) {
                dataObj.callback();
            }
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = meta64.getObjectByGuid(ctx);
                    dataObj.call(thiz);
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
            var selNodeIsMine = highlightNode && highlightNode.createdBy === meta64.userName;
            var homeNodeSelected = highlightNode && meta64.homeNodeId == highlightNode.id;
            var importAllowed = meta64.isAdminUser || meta64.userPreferences.importAllowed;
            var exportAllowed = meta64.isAdminUser || meta64.userPreferences.exportAllowed;
            var highlightOrdinal = meta64.getOrdinalOfNode(highlightNode);
            var numChildNodes = meta64.getNumChildNodes();
            var canMoveUp = highlightOrdinal > 0 && numChildNodes > 1;
            var canMoveDown = highlightOrdinal < numChildNodes - 1 && numChildNodes > 1;
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
            m64.util.setEnablement("insertBookWarAndPeaceButton", meta64.isAdminUser || m64.user.isTestUserAccount() && selNodeIsMine);
            m64.util.setEnablement("uploadFromFileButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("uploadFromUrlButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("deleteAttachmentsButton", !meta64.isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            m64.util.setEnablement("editNodeSharingButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("renameNodePgButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
            m64.util.setEnablement("searchDlgButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("showServerInfoButton", meta64.isAdminUser);
            m64.util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            m64.util.setEnablement("refreshPageButton", !meta64.isAnonUser);
            m64.util.setEnablement("findSharedNodesButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);
            m64.util.setVisibility("openImportDlg", importAllowed && selNodeIsMine);
            m64.util.setVisibility("openExportDlg", exportAllowed && selNodeIsMine);
            m64.util.setVisibility("navHomeButton", !meta64.isAnonUser);
            m64.util.setVisibility("editModeButton", allowEditMode);
            m64.util.setVisibility("upLevelButton", meta64.currentNode && m64.nav.parentVisibleToUser());
            m64.util.setVisibility("insertBookWarAndPeaceButton", meta64.isAdminUser || m64.user.isTestUserAccount() && selNodeIsMine);
            m64.util.setVisibility("propsToggleButton", !meta64.isAnonUser);
            m64.util.setVisibility("openLoginDlgButton", meta64.isAnonUser);
            m64.util.setVisibility("navLogoutButton", !meta64.isAnonUser);
            m64.util.setVisibility("openSignupPgButton", meta64.isAnonUser);
            m64.util.setVisibility("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setVisibility("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setVisibility("userPreferencesMainAppButton", !meta64.isAnonUser);
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
            if (!meta64.currentNodeData || !meta64.currentNodeData.children)
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
                console.log("getSelectedPolyElement failed.");
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
        nav.navHomeResponse = function (res) {
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
                }, nav.navHomeResponse);
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
                var contentProp = m64.props.getNodeProperty(m64.jcrCnst.CONTENT, node);
                if (contentProp) {
                    var jcrContent = m64.props.renderProperty(contentProp);
                    jcrContent = "<div>" + jcrContent + "</div>";
                    if (jcrContent.length > 0) {
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
                    else {
                        ret += "<div>[No Content Text]</div>";
                        var properties_1 = m64.props.renderProperties(node.properties);
                        if (properties_1) {
                            ret += properties_1;
                        }
                    }
                }
                else {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    var properties_2 = m64.props.renderProperties(node.properties);
                    if (properties_2) {
                        ret += properties_2;
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
                "id": fieldId
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
            var title = BRANDING_TITLE;
            if (!m64.meta64.isAnonUser) {
                title += " - " + res.userName;
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
        var makeTopLevelMenu = function (title, content) {
            return m64.render.tag("paper-submenu", {
                "label": title,
            }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" +
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
            var editMenuItems = menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") +
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
            var searchMenuItems = menuItem("Content", "searchDlgButton", "(new m64.SearchContentDlg()).open();") +
                menuItem("Tags", "searchDlgButton", "(new m64.SearchTagsDlg()).open();");
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
            var helpItems = menuItem("Main Menu Help", "mainMenuHelp", "m64.nav.openMainMenuHelp();");
            var mainMenuHelp = makeTopLevelMenu("Help/Docs", helpItems);
            var content = editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
                + mainMenuHelp;
            m64.util.setHtml(domId, content);
        };
        menuPanel.init = function () {
            m64.meta64.refreshAllGuiEnablement();
        };
    })(menuPanel = m64.menuPanel || (m64.menuPanel = {}));
})(m64 || (m64 = {}));
console.log("running module: DialogBase.js");
var m64;
(function (m64) {
    var DialogBase = (function () {
        function DialogBase(domId) {
            var _this = this;
            this.domId = domId;
            this.init = function () {
            };
            this.build = function () {
                return "";
            };
            this.open = function () {
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
                polyElm.node.refit();
                polyElm.node.constrain();
                polyElm.node.center();
                polyElm.node.open();
            };
            this.cancel = function () {
                var polyElm = m64.util.polyElm(_this.id(_this.domId));
                polyElm.node.cancel();
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
                    "id": id
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
                    "id": _this.id(id)
                };
                if (callback != undefined) {
                    attribs["onClick"] = m64.meta64.encodeOnClick(callback, ctx);
                }
                return m64.render.tag("paper-button", attribs, text, true);
            };
            this.makeCloseButton = function (text, id, callback, ctx) {
                var attribs = {
                    "raised": "raised",
                    "dialog-confirm": "dialog-confirm",
                    "id": _this.id(id)
                };
                if (callback != undefined) {
                    attribs["onClick"] = m64.meta64.encodeOnClick(callback, ctx);
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
                var width = window.innerWidth * 0.6;
                var height = window.innerHeight * 0.4;
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
                    style: "padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll;"
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
                var clearButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.meta64.getObjectByGuid(" + _this.guid + ").clearProperty('" + fieldId + "');"
                }, "Clear");
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
                        "newNodeName": newNodeName
                    }, m64.edit.insertNodeResponse, m64.edit);
                }
                else {
                    m64.util.json("createSubNode", {
                        "nodeId": m64.edit.parentOfNewNode.id,
                        "newNodeName": newNodeName
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9kbGcvYmFzZS9EaWFsb2dCYXNlLnRzIiwiLi4vdHMvZGxnL0NvbmZpcm1EbGcudHMiLCIuLi90cy9kbGcvUHJvZ3Jlc3NEbGcudHMiLCIuLi90cy9kbGcvTWVzc2FnZURsZy50cyIsIi4uL3RzL2RsZy9Mb2dpbkRsZy50cyIsIi4uL3RzL2RsZy9TaWdudXBEbGcudHMiLCIuLi90cy9kbGcvUHJlZnNEbGcudHMiLCIuLi90cy9kbGcvTWFuYWdlQWNjb3VudERsZy50cyIsIi4uL3RzL2RsZy9FeHBvcnREbGcudHMiLCIuLi90cy9kbGcvSW1wb3J0RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaENvbnRlbnREbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoVGFnc0RsZy50cyIsIi4uL3RzL2RsZy9DaGFuZ2VQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9SZXNldFBhc3N3b3JkRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21GaWxlRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvcGFuZWwvc2VhcmNoUmVzdWx0c1BhbmVsLnRzIiwiLi4vdHMvcGFuZWwvdGltZWxpbmVSZXN1bHRzUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUNBQSxZQUFZLENBQUM7QUFLYixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFLOUIsSUFBSSxRQUFRLEdBQUcsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7SUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ2pELE1BQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU1GO0FBRUEsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBWXpDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsVUFBUyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN4QyxDQUFD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QUFHLEVBQUMsQ0FBQztJQUNYO1FBQUE7WUFFSSxVQUFLLEdBQVcsc0JBQXNCLENBQUM7WUFDdkMsVUFBSyxHQUFXLGlCQUFpQixDQUFDO1lBQ2xDLFlBQU8sR0FBWSxLQUFLLENBQUM7WUFFekIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLGtDQUFrQyxDQUFDO2dCQUNoRCxJQUFJLFdBQVcsR0FBRywrQkFBK0IsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDaEMsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQUksQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUFELDJCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSx3QkFBb0IsdUJBZ0JoQyxDQUFBO0FBQ0wsQ0FBQyxFQWxCUyxHQUFHLEtBQUgsR0FBRyxRQWtCWiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdlbmVyYXRlZCB1c2luZyB0eXBlc2NyaXB0LWdlbmVyYXRvciB2ZXJzaW9uIDEuMTAtU05BUFNIT1Qgb24gMjAxNi0wNy0zMSAyMDoyMTowMS5cblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqc29uIHtcblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8ge1xuICAgICAgICAgICAgcHJpbmNpcGFsTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlczogUHJpdmlsZWdlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpbWFyeVR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBib29sZWFuO1xuICAgICAgICAgICAgaGFzQmluYXJ5OiBib29sZWFuO1xuICAgICAgICAgICAgYmluYXJ5SXNJbWFnZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGJpblZlcjogbnVtYmVyO1xuICAgICAgICAgICAgd2lkdGg6IG51bWJlcjtcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyO1xuICAgICAgICAgICAgY2hpbGRyZW5PcmRlcmVkOiBib29sZWFuO1xuICAgICAgICAgICAgdWlkOiBzdHJpbmc7XG4gICAgICAgICAgICBjcmVhdGVkQnk6IHN0cmluZztcbiAgICAgICAgICAgIGxhc3RNb2RpZmllZDogRGF0ZTtcbiAgICAgICAgICAgIGltZ0lkOiBzdHJpbmc7XG4gICAgICAgICAgICBvd25lcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcml2aWxlZ2VJbmZvIHtcbiAgICAgICAgICAgIHByaXZpbGVnZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHlJbmZvIHtcbiAgICAgICAgICAgIHR5cGU6IG51bWJlcjtcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgICAgICAgICB2YWx1ZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgaHRtbFZhbHVlOiBzdHJpbmc7XG4gICAgICAgICAgICBhYmJyZXZpYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVc2VyUHJlZmVyZW5jZXMge1xuICAgICAgICAgICAgZWRpdE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBhZHZhbmNlZE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBsYXN0Tm9kZTogc3RyaW5nO1xuICAgICAgICAgICAgaW1wb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIGV4cG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICBzaG93TWV0YURhdGE6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljQXBwZW5kOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBbm9uUGFnZUxvYWRSZXF1ZXN0IHtcbiAgICAgICAgICAgIGlnbm9yZVVybDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzQ29kZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlU3ViTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBuZXdOb2RlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVBdHRhY2htZW50UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0RmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgaW5jbHVkZUFjbDogYm9vbGVhbjtcbiAgICAgICAgICAgIGluY2x1ZGVPd25lcnM6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNlcnZlckluZm9SZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlRmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1JlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBib29rTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgdHJ1bmNhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0TmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9naW5SZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgICAgICAgICAgdHpPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIGRzdDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9nb3V0UmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdGFyZ2V0Tm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICB0YXJnZXRDaGlsZElkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlcXVlc3Qge1xuICAgICAgICAgICAgc29ydERpcjogc3RyaW5nO1xuICAgICAgICAgICAgc29ydEZpZWxkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFByb3A6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3TmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHVwTGV2ZWw6IG51bWJlcjtcbiAgICAgICAgICAgIHJlbmRlclBhcmVudElmTGVhZjogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzaWJsaW5nSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICBjYXB0Y2hhOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlVXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICAgICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZVByb3BlcnR5UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBub2RlSW5mbzogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEV4cG9ydFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBhY2xFbnRyaWVzOiBBY2Nlc3NDb250cm9sRW50cnlJbmZvW107XG4gICAgICAgICAgICBvd25lcnM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgcHVibGljQXBwZW5kOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VydmVySW5mbzogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTaGFyZWROb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEltcG9ydFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5pdE5vZGVFZGl0UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnRCb29rUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBuZXdOb2RlOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTG9naW5SZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICByb290Tm9kZTogUmVmSW5mbztcbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBhbm9uVXNlckxhbmRpbmdQYWdlTm9kZTogc3RyaW5nO1xuICAgICAgICAgICAgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ291dFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlU2VhcmNoUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgc2VhcmNoUmVzdWx0czogTm9kZUluZm9bXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG4gICAgICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5U2F2ZWQ6IFByb3BlcnR5SW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTaWdudXBSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkRnJvbVVybFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbmNvbnNvbGUubG9nKFwicnVubmluZyBhcHAuanNcIik7XG5cbi8vIHZhciBvbnJlc2l6ZSA9IHdpbmRvdy5vbnJlc2l6ZTtcbi8vIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7IGlmICh0eXBlb2Ygb25yZXNpemUgPT09ICdmdW5jdGlvbicpIG9ucmVzaXplKCk7IC8qKiAuLi4gKi8gfVxuXG52YXIgYWRkRXZlbnQgPSBmdW5jdGlvbihvYmplY3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsIHx8IHR5cGVvZiAob2JqZWN0KSA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgIG9iamVjdC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0W1wib25cIiArIHR5cGVdID0gY2FsbGJhY2s7XG4gICAgfVxufTtcblxuLypcbiAqIFdBUk5JTkc6IFRoaXMgaXMgY2FsbGVkIGluIHJlYWx0aW1lIHdoaWxlIHVzZXIgaXMgcmVzaXppbmcgc28gYWx3YXlzIHRocm90dGxlIGJhY2sgYW55IHByb2Nlc3Npbmcgc28gdGhhdCB5b3UgZG9uJ3RcbiAqIGRvIGFueSBhY3R1YWwgcHJvY2Vzc2luZyBpbiBoZXJlIHVubGVzcyB5b3Ugd2FudCBpdCBWRVJZIGxpdmUsIGJlY2F1c2UgaXQgaXMuXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd1Jlc2l6ZSgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIldpbmRvd1Jlc2l6ZTogdz1cIiArIHdpbmRvdy5pbm5lcldpZHRoICsgXCIgaD1cIiArIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgd2luZG93UmVzaXplKTtcblxuLy8gdGhpcyBjb21tZW50ZWQgc2VjdGlvbiBpcyBub3Qgd29ya2luZyBpbiBteSBuZXcgeC1hcHAgY29kZSwgYnV0IGl0J3Mgb2sgdG8gY29tbWVudCBpdCBvdXQgZm9yIG5vdy5cbi8vXG4vLyBUaGlzIGlzIG91ciB0ZW1wbGF0ZSBlbGVtZW50IGluIGluZGV4Lmh0bWxcbi8vIHZhciBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjeC1hcHAnKTtcbi8vIC8vIExpc3RlbiBmb3IgdGVtcGxhdGUgYm91bmQgZXZlbnQgdG8ga25vdyB3aGVuIGJpbmRpbmdzXG4vLyAvLyBoYXZlIHJlc29sdmVkIGFuZCBjb250ZW50IGhhcyBiZWVuIHN0YW1wZWQgdG8gdGhlIHBhZ2Vcbi8vIGFwcC5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgY29uc29sZS5sb2coJ2FwcCByZWFkeSBldmVudCEnKTtcbi8vIH0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9seW1lci1yZWFkeScsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZygncG9seW1lci1yZWFkeSBldmVudCEnKTtcbn0pO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogY25zdC5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIGNvb2tpZVByZWZpeDtcclxuXHJcbi8vdG9kby0wOiB0eXBlc2NyaXB0IHdpbGwgbm93IGxldCB1cyBqdXN0IGRvIHRoaXM6IGNvbnN0IHZhcj0ndmFsdWUnO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGNuc3Qge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEFOT046IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fVVNSOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luVXNyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fUFdEOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luUHdkXCI7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBsb2dpblN0YXRlPVwiMFwiIGlmIHVzZXIgbG9nZ2VkIG91dCBpbnRlbnRpb25hbGx5LiBsb2dpblN0YXRlPVwiMVwiIGlmIGxhc3Qga25vd24gc3RhdGUgb2YgdXNlciB3YXMgJ2xvZ2dlZCBpbidcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9TVEFURTogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblN0YXRlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCUjogXCI8ZGl2IGNsYXNzPSd2ZXJ0LXNwYWNlJz48L2Rpdj5cIjtcclxuICAgICAgICBleHBvcnQgbGV0IElOU0VSVF9BVFRBQ0hNRU5UOiBzdHJpbmcgPSBcInt7aW5zZXJ0LWF0dGFjaG1lbnR9fVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTkVXX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9WRV9VUERPV05fT05fVE9PTEJBUjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcbiIsIlxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG4gICAgXG4gICAgZXhwb3J0IGNsYXNzIFByb3BFbnRyeSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICAgICAgcHVibGljIHByb3BlcnR5OiBqc29uLlByb3BlcnR5SW5mbywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBtdWx0aTogYm9vbGVhbiwgLy9cbiAgICAgICAgICAgIHB1YmxpYyByZWFkT25seTogYm9vbGVhbiwgLy9cbiAgICAgICAgICAgIHB1YmxpYyBiaW5hcnk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgc3ViUHJvcHM6IFN1YlByb3BbXSkge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN1YlByb3Age1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyB2YWw6IHN0cmluZykge1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXRpbC5qc1wiKTtcclxuXHJcbi8vdG9kby0wOiBuZWVkIHRvIGZpbmQgdGhlIERlZmluaXRlbHlUeXBlZCBmaWxlIGZvciBQb2x5bWVyLlxyXG5kZWNsYXJlIHZhciBQb2x5bWVyO1xyXG5kZWNsYXJlIHZhciAkOyAvLzwtLS0tLS0tLS0tLS0tdGhpcyB3YXMgYSB3aWxkYXNzIGd1ZXNzLlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XHJcblxyXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XHJcbn1cclxuXHJcbmludGVyZmFjZSBfSGFzU2VsZWN0IHtcclxuICAgIHNlbGVjdD86IGFueTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBBcnJheSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9XQVJOSU5HOiBUaGVzZSBwcm90b3R5cGUgZnVuY3Rpb25zIG11c3QgYmUgZGVmaW5lZCBvdXRzaWRlIGFueSBmdW5jdGlvbnMuXHJcbmludGVyZmFjZSBBcnJheTxUPiB7XHJcbiAgICBjbG9uZSgpOiBBcnJheTxUPjtcclxuICAgIGluZGV4T2ZJdGVtQnlQcm9wKHByb3BOYW1lLCBwcm9wVmFsKTogbnVtYmVyO1xyXG4gICAgYXJyYXlNb3ZlSXRlbShmcm9tSW5kZXgsIHRvSW5kZXgpOiB2b2lkO1xyXG4gICAgaW5kZXhPZk9iamVjdChvYmo6IGFueSk6IG51bWJlcjtcclxufTtcclxuXHJcbkFycmF5LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCk7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuaW5kZXhPZkl0ZW1CeVByb3AgPSBmdW5jdGlvbihwcm9wTmFtZSwgcHJvcFZhbCkge1xyXG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldW3Byb3BOYW1lXSA9PT0gcHJvcFZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG4vKiBuZWVkIHRvIHRlc3QgYWxsIGNhbGxzIHRvIHRoaXMgbWV0aG9kIGJlY2F1c2UgaSBub3RpY2VkIGR1cmluZyBUeXBlU2NyaXB0IGNvbnZlcnNpb24gaSB3YXNuJ3QgZXZlbiByZXR1cm5pbmdcclxuYSB2YWx1ZSBmcm9tIHRoaXMgZnVuY3Rpb24hIHRvZG8tMFxyXG4qL1xyXG5BcnJheS5wcm90b3R5cGUuYXJyYXlNb3ZlSXRlbSA9IGZ1bmN0aW9uKGZyb21JbmRleCwgdG9JbmRleCkge1xyXG4gICAgdGhpcy5zcGxpY2UodG9JbmRleCwgMCwgdGhpcy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XHJcbn07XHJcblxyXG5pZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ICE9ICdmdW5jdGlvbicpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEYXRlIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcbiAgICBzdGRUaW1lem9uZU9mZnNldCgpOiBudW1iZXI7XHJcbiAgICBkc3QoKTogYm9vbGVhbjtcclxufTtcclxuXHJcbkRhdGUucHJvdG90eXBlLnN0ZFRpbWV6b25lT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgamFuID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCAwLCAxKTtcclxuICAgIHZhciBqdWwgPSBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIDYsIDEpO1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KGphbi5nZXRUaW1lem9uZU9mZnNldCgpLCBqdWwuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XHJcbn1cclxuXHJcbkRhdGUucHJvdG90eXBlLmRzdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSA8IHRoaXMuc3RkVGltZXpvbmVPZmZzZXQoKTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBTdHJpbmcgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG4gICAgc3RhcnRzV2l0aChzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICBzdHJpcElmU3RhcnRzV2l0aChzdHI6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGNvbnRhaW5zKHN0cjogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIHJlcGxhY2VBbGwoZmluZDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICB1bmVuY29kZUh0bWwoKTogc3RyaW5nO1xyXG4gICAgZXNjYXBlRm9yQXR0cmliKCk6IHN0cmluZztcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpID09PSAwO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RyaXBJZlN0YXJ0c1dpdGggPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGFydHNXaXRoKHN0cikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3Vic3RyaW5nKHN0ci5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpICE9IC0xO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24oZmluZCwgcmVwbGFjZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZmluZCksICdnJyksIHJlcGxhY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUudW5lbmNvZGVIdG1sICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUudW5lbmNvZGVIdG1sID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKFwiJlwiKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VBbGwoJyZhbXA7JywgJyYnKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmZ3Q7JywgJz4nKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmbHQ7JywgJzwnKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmcXVvdDsnLCAnXCInKS8vXHJcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCcmIzM5OycsIFwiJ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLmVzY2FwZUZvckF0dHJpYiAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmVzY2FwZUZvckF0dHJpYiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VBbGwoXCJcXFwiXCIsIFwiJnF1b3Q7XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXRpbCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQWpheDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZW91dE1lc3NhZ2VTaG93bjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb2ZmbGluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHdhaXRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcGdyc0RsZzogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy90aGlzIGJsb3dzIHRoZSBoZWxsIHVwLCBub3Qgc3VyZSB3aHkuXHJcbiAgICAgICAgLy9cdE9iamVjdC5wcm90b3R5cGUudG9Kc29uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMsIG51bGwsIDQpO1xyXG4gICAgICAgIC8vXHR9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFzc2VydE5vdE51bGwgPSBmdW5jdGlvbih2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZhbCh2YXJOYW1lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlZhcmlhYmxlIG5vdCBmb3VuZDogXCIgKyB2YXJOYW1lKSkub3BlbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcbiAgICAgICAgICogc2Vzc2lvbiBpcyBvbmx5IGFsbG93ZWQgb25lIGNvbmN1cnJlbnQgY2FsbCBhbmQgc2ltdWx0YW5lb3VzIGNhbGxzIHdvdWxkIGp1c3QgXCJxdWV1ZSB1cFwiLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBfYWpheENvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRheWxpZ2h0U2F2aW5nc1RpbWU6IGJvb2xlYW4gPSAobmV3IERhdGUoKS5kc3QoKSkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdG9Kc29uID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogVGhpcyBjYW1lIGZyb20gaGVyZTpcclxuXHRcdCAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWU/OiBhbnksIHVybD86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdXJsKVxyXG4gICAgICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xyXG4gICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0cylcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHNbMl0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFNldHMgdXAgYW4gaW5oZXJpdGFuY2UgcmVsYXRpb25zaGlwIHNvIHRoYXQgY2hpbGQgaW5oZXJpdHMgZnJvbSBwYXJlbnQsIGFuZCB0aGVuIHJldHVybnMgdGhlIHByb3RvdHlwZSBvZiB0aGVcclxuXHRcdCAqIGNoaWxkIHNvIHRoYXQgbWV0aG9kcyBjYW4gYmUgYWRkZWQgdG8gaXQsIHdoaWNoIHdpbGwgYmVoYXZlIGxpa2UgbWVtYmVyIGZ1bmN0aW9ucyBpbiBjbGFzc2ljIE9PUCB3aXRoXHJcblx0XHQgKiBpbmhlcml0YW5jZSBoaWVyYXJjaGllcy5cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5oZXJpdCA9IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpOiBhbnkge1xyXG4gICAgICAgICAgICBjaGlsZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnByb3RvdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdFByb2dyZXNzTW9uaXRvciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbChwcm9ncmVzc0ludGVydmFsLCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvZ3Jlc3NJbnRlcnZhbCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgaXNXYWl0aW5nID0gaXNBamF4V2FpdGluZygpO1xyXG4gICAgICAgICAgICBpZiAoaXNXYWl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICB3YWl0Q291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHdhaXRDb3VudGVyID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZyA9IG5ldyBQcm9ncmVzc0RsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YWl0Q291bnRlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAocGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGdyc0RsZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQganNvbiA9IGZ1bmN0aW9uIDxSZXF1ZXN0VHlwZSwgUmVzcG9uc2VUeXBlPihwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogUmVxdWVzdFR5cGUsIC8vXHJcbiAgICAgICAgICAgIGNhbGxiYWNrPzogKHJlc3BvbnNlOiBSZXNwb25zZVR5cGUsIHBheWxvYWQ/OiBhbnkpID0+IGFueSwgY2FsbGJhY2tUaGlzPzogYW55LCBjYWxsYmFja1BheWxvYWQ/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMgPT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUk9CQUJMRSBCVUc6IGpzb24gY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSArIFwiIHVzZWQgZ2xvYmFsICd3aW5kb3cnIGFzICd0aGlzJywgd2hpY2ggaXMgYWxtb3N0IG5ldmVyIGdvaW5nIHRvIGJlIGNvcnJlY3QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXJvbkFqYXg7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVxdWVzdDtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2ZmbGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib2ZmbGluZTogaWdub3JpbmcgY2FsbCBmb3IgXCIgKyBwb3N0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU09OLVBPU1RbZ2VuXTogW1wiICsgcG9zdE5hbWUgKyBcIl1cIiArIEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRG8gbm90IGRlbGV0ZSwgcmVzZWFyY2ggdGhpcyB3YXkuLi4gKi9cclxuICAgICAgICAgICAgICAgIC8vIHZhciBpcm9uQWpheCA9IHRoaXMuJCQoXCIjbXlJcm9uQWpheFwiKTtcclxuICAgICAgICAgICAgICAgIC8vaXJvbkFqYXggPSBQb2x5bWVyLmRvbSgoPF9IYXNSb290Pil3aW5kb3cuZG9jdW1lbnQucm9vdCkucXVlcnlTZWxlY3RvcihcIiNpcm9uQWpheFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheCA9IHBvbHlFbG1Ob2RlKFwiaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgudXJsID0gcG9zdFRhcmdldFVybCArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgudmVyYm9zZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXgubWV0aG9kID0gXCJQT1NUXCI7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5jb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24vanNvblwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNwZWNpZnkgYW55IHVybCBwYXJhbXMgdGhpcyB3YXk6XHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5wYXJhbXM9J3tcImFsdFwiOlwianNvblwiLCBcInFcIjpcImNocm9tZVwifSc7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguaGFuZGxlQXMgPSBcImpzb25cIjsgLy8gaGFuZGxlLWFzIChpcyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRoaXMgbm90IGEgcmVxdWlyZWQgcHJvcGVydHkgKi9cclxuICAgICAgICAgICAgICAgIC8vIGlyb25BamF4Lm9uUmVzcG9uc2UgPSBcInV0aWwuaXJvbkFqYXhSZXNwb25zZVwiOyAvLyBvbi1yZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgLy8gKGlzXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9wKVxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguZGVib3VuY2VEdXJhdGlvbiA9IFwiMzAwXCI7IC8vIGRlYm91bmNlLWR1cmF0aW9uIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICBfYWpheENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlyb25SZXF1ZXN0ID0gaXJvbkFqYXguZ2VuZXJhdGVSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCBzdGFydGluZyByZXF1ZXN0OiBcIiArIHBvc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGV4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTm90ZXNcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIElmIHVzaW5nIHRoZW4gZnVuY3Rpb246IHByb21pc2UudGhlbihzdWNjZXNzRnVuY3Rpb24sIGZhaWxGdW5jdGlvbik7XHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJIHRoaW5rIHRoZSB3YXkgdGhlc2UgcGFyYW1ldGVycyBnZXQgcGFzc2VkIGludG8gZG9uZS9mYWlsIGZ1bmN0aW9ucywgaXMgYmVjYXVzZSB0aGVyZSBhcmUgcmVzb2x2ZS9yZWplY3RcclxuICAgICAgICAgICAgICogbWV0aG9kcyBnZXR0aW5nIGNhbGxlZCB3aXRoIHRoZSBwYXJhbWV0ZXJzLiBCYXNpY2FsbHkgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvICdyZXNvbHZlJyBnZXQgZGlzdHJpYnV0ZWRcclxuICAgICAgICAgICAgICogdG8gYWxsIHRoZSB3YWl0aW5nIG1ldGhvZHMganVzdCBsaWtlIGFzIGlmIHRoZXkgd2VyZSBzdWJzY3JpYmluZyBpbiBhIHB1Yi9zdWIgbW9kZWwuIFNvIHRoZSAncHJvbWlzZSdcclxuICAgICAgICAgICAgICogcGF0dGVybiBpcyBzb3J0IG9mIGEgcHViL3N1YiBtb2RlbCBpbiBhIHdheVxyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogVGhlIHJlYXNvbiB0byByZXR1cm4gYSAncHJvbWlzZS5wcm9taXNlKCknIG1ldGhvZCBpcyBzbyBubyBvdGhlciBjb2RlIGNhbiBjYWxsIHJlc29sdmUvcmVqZWN0IGJ1dCBjYW5cclxuICAgICAgICAgICAgICogb25seSByZWFjdCB0byBhIGRvbmUvZmFpbC9jb21wbGV0ZS5cclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIGRlZmVycmVkLndoZW4ocHJvbWlzZTEsIHByb21pc2UyKSBjcmVhdGVzIGEgbmV3IHByb21pc2UgdGhhdCBiZWNvbWVzICdyZXNvbHZlZCcgb25seSB3aGVuIGFsbCBwcm9taXNlc1xyXG4gICAgICAgICAgICAgKiBhcmUgcmVzb2x2ZWQuIEl0J3MgYSBiaWcgXCJhbmQgY29uZGl0aW9uXCIgb2YgcmVzb2x2ZW1lbnQsIGFuZCBpZiBhbnkgb2YgdGhlIHByb21pc2VzIHBhc3NlZCB0byBpdCBlbmQgdXBcclxuICAgICAgICAgICAgICogZmFpbGluZywgaXQgZmFpbHMgdGhpcyBcIkFORGVkXCIgb25lIGFsc28uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpcm9uUmVxdWVzdC5jb21wbGV0ZXMudGhlbigvL1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBTdWNjZXNzXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIEpTT04tUkVTVUxUOiBcIiArIHBvc3ROYW1lICsgXCJcXG4gICAgSlNPTi1SRVNVTFQtREFUQTogXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGlyb25SZXF1ZXN0LnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyBpcyB1Z2x5IGJlY2F1c2UgaXQgY292ZXJzIGFsbCBmb3VyIGNhc2VzIGJhc2VkIG9uIHR3byBib29sZWFucywgYnV0IGl0J3Mgc3RpbGwgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaW1wbGVzdCB3YXkgdG8gZG8gdGhpcy4gV2UgaGF2ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgbWF5IG9yIG1heSBub3Qgc3BlY2lmeSBhICd0aGlzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIGFsd2F5cyBjYWxscyB3aXRoIHRoZSAncmVwb25zZScgcGFyYW0gYW5kIG9wdGlvbmFsbHkgYSBjYWxsYmFja1BheWxvYWQgcGFyYW0uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1BheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FuJ3Qgd2UganVzdCBsZXQgY2FsbGJhY2tQYXlsb2FkIGJlIHVuZGVmaW5lZCwgYW5kIGNhbGwgdGhlIGFib3ZlIGNhbGxiYWNrIG1ldGhvZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBub3QgZXZlbiBoYXZlIHRoaXMgZWxzZSBibG9jayBoZXJlIGF0IGFsbCAoaS5lLiBub3QgZXZlbiBjaGVjayBpZiBjYWxsYmFja1BheWxvYWQgaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwvdW5kZWZpbmVkLCBidXQganVzdCB1c2UgaXQsIGFuZCBub3QgaGF2ZSB0aGlzIGlmIGJsb2NrPylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCA8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkZhaWxlZCBoYW5kbGluZyByZXN1bHQgb2Y6IFwiICsgcG9zdE5hbWUgKyBcIiBleD1cIiArIGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIEZhaWxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gdXRpbC5qc29uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlyb25SZXF1ZXN0LnN0YXR1cyA9PSBcIjQwM1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgaW4gZGV0ZWN0ZWQgaW4gdXRpbC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZsaW5lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXRNZXNzYWdlU2hvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0TWVzc2FnZVNob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZXNzaW9uIHRpbWVkIG91dC4gUGFnZSB3aWxsIHJlZnJlc2guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1zZzogc3RyaW5nID0gXCJTZXJ2ZXIgcmVxdWVzdCBmYWlsZWQuXFxuXFxuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBjYXRjaCBibG9jayBzaG91bGQgZmFpbCBzaWxlbnRseSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiU3RhdHVzOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1c1RleHQgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiQ29kZTogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXMgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB0aGlzIGNhdGNoIGJsb2NrIHNob3VsZCBhbHNvIGZhaWwgc2lsZW50bHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyB3YXMgc2hvd2luZyBcImNsYXNzQ2FzdEV4Y2VwdGlvblwiIHdoZW4gSSB0aHJldyBhIHJlZ3VsYXIgXCJFeGNlcHRpb25cIiBmcm9tIHNlcnZlciBzbyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEknbSBqdXN0IHR1cm5pbmcgdGhpcyBvZmYgc2luY2UgaXRzJyBub3QgZGlzcGxheWluZyB0aGUgY29ycmVjdCBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXNnICs9IFwiUmVzcG9uc2U6IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5leGNlcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXJvblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFqYXhSZWFkeSA9IGZ1bmN0aW9uKHJlcXVlc3ROYW1lKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChfYWpheENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklnbm9yaW5nIHJlcXVlc3RzOiBcIiArIHJlcXVlc3ROYW1lICsgXCIuIEFqYXggY3VycmVudGx5IGluIHByb2dyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBamF4V2FpdGluZyA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gX2FqYXhDb3VudGVyID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNldCBmb2N1cyB0byBlbGVtZW50IGJ5IGlkIChpZCBtdXN0IHN0YXJ0IHdpdGggIykgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGF5ZWRGb2N1cyA9IGZ1bmN0aW9uKGlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIHNvIHVzZXIgc2VlcyB0aGUgZm9jdXMgZmFzdCB3ZSB0cnkgYXQgLjUgc2Vjb25kcyAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIHRyeSBhZ2FpbiBhIGZ1bGwgc2Vjb25kIGxhdGVyLiBOb3JtYWxseSBub3QgcmVxdWlyZWQsIGJ1dCBuZXZlciB1bmRlc2lyYWJsZSAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBjb3VsZCBoYXZlIHB1dCB0aGlzIGxvZ2ljIGluc2lkZSB0aGUganNvbiBtZXRob2QgaXRzZWxmLCBidXQgSSBjYW4gZm9yc2VlIGNhc2VzIHdoZXJlIHdlIGRvbid0IHdhbnQgYVxyXG5cdFx0ICogbWVzc2FnZSB0byBhcHBlYXIgd2hlbiB0aGUganNvbiByZXNwb25zZSByZXR1cm5zIHN1Y2Nlc3M9PWZhbHNlLCBzbyB3ZSB3aWxsIGhhdmUgdG8gY2FsbCBjaGVja1N1Y2Nlc3MgaW5zaWRlXHJcblx0XHQgKiBldmVyeSByZXNwb25zZSBtZXRob2QgaW5zdGVhZCwgaWYgd2Ugd2FudCB0aGF0IHJlc3BvbnNlIHRvIHByaW50IGEgbWVzc2FnZSB0byB0aGUgdXNlciB3aGVuIGZhaWwgaGFwcGVucy5cclxuXHRcdCAqXHJcblx0XHQgKiByZXF1aXJlczogcmVzLnN1Y2Nlc3MgcmVzLm1lc3NhZ2VcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hlY2tTdWNjZXNzID0gZnVuY3Rpb24ob3BGcmllbmRseU5hbWUsIHJlcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcob3BGcmllbmRseU5hbWUgKyBcIiBmYWlsZWQ6IFwiICsgcmVzLm1lc3NhZ2UpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdWNjZXNzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWRkcyBhbGwgYXJyYXkgb2JqZWN0cyB0byBvYmogYXMgYSBzZXQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFkZEFsbCA9IGZ1bmN0aW9uKG9iaiwgYSk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghYVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJudWxsIGVsZW1lbnQgaW4gYWRkQWxsIGF0IGlkeD1cIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbYVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG51bGxPclVuZGVmID0gZnVuY3Rpb24ob2JqKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG5cdFx0ICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VWlkRm9ySWQgPSBmdW5jdGlvbihtYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLyogbG9vayBmb3IgdWlkIGluIG1hcCAqL1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBcIlwiICsgbWV0YTY0Lm5leHRVaWQrKztcclxuICAgICAgICAgICAgICAgIG1hcFtpZF0gPSB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWxlbWVudEV4aXN0cyA9IGZ1bmN0aW9uKGlkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRha2VzIHRleHRhcmVhIGRvbSBJZCAoIyBvcHRpb25hbCkgYW5kIHJldHVybnMgaXRzIHZhbHVlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUZXh0QXJlYVZhbEJ5SWQgPSBmdW5jdGlvbihpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBkZTogSFRNTEVsZW1lbnQgPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxIVE1MSW5wdXRFbGVtZW50PmRlKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRvbUVsbSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHkgPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seUVsbSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFBvbHltZXIuZG9tKGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtTm9kZSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRSZXF1aXJlZEVsZW1lbnQgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPYmplY3QgPSBmdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5sZW5ndGggIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudFRpbWVNaWxsaXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZW1wdHlTdHJpbmcgPSBmdW5jdGlvbih2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXZhbCB8fCB2YWwubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgd2FzIGZvdW5kLCBvciBmYWxzZSBpZiBlbGVtZW50IG5vdCBmb3VuZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWxtICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRFbnRlcktleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xyXG4gICAgICAgICAgICBiaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnksIGtleUNvZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICAkKGlkKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlDb2RlKSB7IC8vIDEzPT1lbnRlciBrZXkgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBSZW1vdmVkIG9sZENsYXNzIGZyb20gZWxlbWVudCBhbmQgcmVwbGFjZXMgd2l0aCBuZXdDbGFzcywgYW5kIGlmIG9sZENsYXNzIGlzIG5vdCBwcmVzZW50IGl0IHNpbXBseSBhZGRzXHJcblx0XHQgKiBuZXdDbGFzcy4gSWYgb2xkIGNsYXNzIGV4aXN0ZWQsIGluIHRoZSBsaXN0IG9mIGNsYXNzZXMsIHRoZW4gdGhlIG5ldyBjbGFzcyB3aWxsIG5vdyBiZSBhdCB0aGF0IHBvc2l0aW9uLiBJZlxyXG5cdFx0ICogb2xkIGNsYXNzIGRpZG4ndCBleGlzdCwgdGhlbiBuZXcgQ2xhc3MgaXMgYWRkZWQgYXQgZW5kIG9mIGNsYXNzIGxpc3QuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZU9yQWRkQ2xhc3MgPSBmdW5jdGlvbihlbG06IHN0cmluZywgb2xkQ2xhc3M6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWxtZW1lbnQgPSAkKGVsbSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG9sZENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG5ld0NsYXNzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGRpc3BsYXlzIG1lc3NhZ2UgKG1zZykgb2Ygb2JqZWN0IGlzIG5vdCBvZiBzcGVjaWZpZWQgdHlwZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB2ZXJpZnlUeXBlID0gZnVuY3Rpb24ob2JqOiBhbnksIHR5cGU6IGFueSwgbXNnOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldEh0bWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IFBvbHltZXIuZG9tKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAvL0ZvciBQb2x5bWVyIDEuMC4wLCB5b3UgbmVlZCB0aGlzLi4uXHJcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBwb2x5RWxtLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQcm9wZXJ0eUNvdW50ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBudW1iZXIge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvcDtcclxuXHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRPYmplY3QgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCJcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5W1wiICsgY291bnQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gayArIFwiICwgXCIgKyB2ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVyclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRLZXlzID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJywnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsICs9IGs7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgZW5hYmxlZCBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldEVuYWJsZW1lbnQgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCBlbmFibGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRW5hYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNhYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgdmlzaWJsZSBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCB2aXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpcykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoaWRpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUHJvZ3JhbWF0aWNhbGx5IGNyZWF0ZXMgb2JqZWN0cyBieSBuYW1lLCBzaW1pbGFyIHRvIHdoYXQgSmF2YSByZWZsZWN0aW9uIGRvZXNcclxuXHJcbiAgICAgICAgKiBleDogdmFyIGV4YW1wbGUgPSBJbnN0YW5jZUxvYWRlci5nZXRJbnN0YW5jZTxOYW1lZFRoaW5nPih3aW5kb3csICdFeGFtcGxlQ2xhc3MnLCBhcmdzLi4uKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiA8VD4oY29udGV4dDogT2JqZWN0LCBuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogVCB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoY29udGV4dFtuYW1lXS5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgICAgIHJldHVybiA8VD5pbnN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogamNyQ25zdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqY3JDbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT01NRU5UX0JZOiBzdHJpbmcgPSBcImNvbW1lbnRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFVCTElDX0FQUEVORDogc3RyaW5nID0gXCJwdWJsaWNBcHBlbmRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBSSU1BUllfVFlQRTogc3RyaW5nID0gXCJqY3I6cHJpbWFyeVR5cGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBPTElDWTogc3RyaW5nID0gXCJyZXA6cG9saWN5XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgTUlYSU5fVFlQRVM6IHN0cmluZyA9IFwiamNyOm1peGluVHlwZXNcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9DT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9SRUNJUDogc3RyaW5nID0gXCJyZWNpcFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfU1VCSkVDVDogc3RyaW5nID0gXCJzdWJqZWN0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRDogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRF9CWTogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBUQUdTOiBzdHJpbmcgPSBcInRhZ3NcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFVVSUQ6IHN0cmluZyA9IFwiamNyOnV1aWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRUQ6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRF9CWTogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkQnlcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBhdHRhY2htZW50LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGF0dGFjaG1lbnQge1xyXG4gICAgICAgIC8qIE5vZGUgYmVpbmcgdXBsb2FkZWQgdG8gKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVwbG9hZE5vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblVwbG9hZEZyb21GaWxlRGxnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBtNjQubmFtZXNwYWNlIHZlcnNpb24hXCIpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21VcmxEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGUgQXR0YWNobWVudFwiLCBcIkRlbGV0ZSB0aGUgQXR0YWNobWVudCBvbiB0aGUgTm9kZT9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlQXR0YWNobWVudFJlcXVlc3QsIGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlPihcImRlbGV0ZUF0dGFjaG1lbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIG51bGwsIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBhdHRhY2htZW50XCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZW1vdmVCaW5hcnlCeVVpZCh1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgcmUtcmVuZGVyIGZyb20gbG9jYWwgZGF0YS5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogZWRpdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBlZGl0IHtcclxuXHJcbiAgICAgICAgbGV0IGluc2VydEJvb2tSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnRCb29rUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRCb29rUmVzcG9uc2UgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBCb29rXCIsIHJlcyk7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWxldGVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2UsIHBheWxvYWQ6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbE5vZGUgPSBwYXlsb2FkW1wicG9zdERlbGV0ZVNlbE5vZGVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBzZWxOb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIGhpZ2hsaWdodElkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluaXROb2RlRWRpdFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHJlcy5ub2RlSW5mbztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSBub2RlLm5hbWUuc3RhcnRzV2l0aChcInJlcDpcIikgfHwgLyogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnPyAqL25vZGUucGF0aC5jb250YWlucyhcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUgYW5kIHdlIGFyZSB0aGUgY29tbWVudGVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogU2VydmVyIHdpbGwgaGF2ZSBzZW50IHVzIGJhY2sgdGhlIHJhdyB0ZXh0IGNvbnRlbnQsIHRoYXQgc2hvdWxkIGJlIG1hcmtkb3duIGluc3RlYWQgb2YgYW55IEhUTUwsIHNvXHJcbiAgICAgICAgICAgICAgICAgICAgICogdGhhdCB3ZSBjYW4gZGlzcGxheSB0aGlzIGFuZCBzYXZlLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBjYW5ub3QgZWRpdCBub2RlcyB0aGF0IHlvdSBkb24ndCBvd24uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtb3ZlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Nb3ZlTm9kZXNSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJNb3ZlIG5vZGVzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gbnVsbDsgLy8gcmVzZXRcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIG5vZGUgcG9zaXRpb25cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UmVhZE9ubHlQcm9wZXJ0aWVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVzVG9Nb3ZlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudE9mTmV3Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaW5kaWNhdGVzIGVkaXRvciBpcyBkaXNwbGF5aW5nIGEgbm9kZSB0aGF0IGlzIG5vdCB5ZXQgc2F2ZWQgb24gdGhlIHNlcnZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdGluZ1Vuc2F2ZWROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbm9kZSAoTm9kZUluZm8uamF2YSkgdGhhdCBpcyBiZWluZyBjcmVhdGVkIHVuZGVyIHdoZW4gbmV3IG5vZGUgaXMgY3JlYXRlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTm9kZSBiZWluZyBlZGl0ZWRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMjogdGhpcyBhbmQgc2V2ZXJhbCBvdGhlciB2YXJpYWJsZXMgY2FuIG5vdyBiZSBtb3ZlZCBpbnRvIHRoZSBkaWFsb2cgY2xhc3M/IElzIHRoYXQgZ29vZCBvciBiYWRcclxuICAgICAgICAgKiBjb3VwbGluZy9yZXNwb25zaWJpbGl0eT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlRGxnSW5zdDogRWRpdE5vZGVEbGcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR5cGU9Tm9kZUluZm8uamF2YVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbiBpbnNlcnRpbmcgYSBuZXcgbm9kZSwgdGhpcyBob2xkcyB0aGUgbm9kZSB0aGF0IHdhcyBjbGlja2VkIG9uIGF0IHRoZSB0aW1lIHRoZSBpbnNlcnQgd2FzIHJlcXVlc3RlZCwgYW5kXHJcbiAgICAgICAgICogaXMgc2VudCB0byBzZXJ2ZXIgZm9yIG9yZGluYWwgcG9zaXRpb24gYXNzaWdubWVudCBvZiBuZXcgbm9kZS4gQWxzbyBpZiB0aGlzIHZhciBpcyBudWxsLCBpdCBpbmRpY2F0ZXMgd2UgYXJlXHJcbiAgICAgICAgICogY3JlYXRpbmcgaW4gYSAnY3JlYXRlIHVuZGVyIHBhcmVudCcgbW9kZSwgdmVyc3VzIG5vbi1udWxsIG1lYW5pbmcgJ2luc2VydCBpbmxpbmUnIHR5cGUgb2YgaW5zZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSW5zZXJ0VGFyZ2V0OiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0VkaXRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIG5vZGUucGF0aCAhPSBcIi9cIiAmJlxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICghcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpIHx8IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKSkgLy9cclxuICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGJlc3Qgd2UgY2FuIGRvIGhlcmUgaXMgYWxsb3cgdGhlIGRpc2FibGVJbnNlcnQgcHJvcCB0byBiZSBhYmxlIHRvIHR1cm4gdGhpbmdzIG9mZiwgbm9kZSBieSBub2RlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0luc2VydEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkRJU0FCTEVfSU5TRVJULCBub2RlKSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Quc2F2ZU5ld05vZGUoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNhbGxlZCB0byBkaXNwbGF5IGVkaXRvciB0aGF0IHdpbGwgY29tZSB1cCBCRUZPUkUgYW55IG5vZGUgaXMgc2F2ZWQgb250byB0aGUgc2VydmVyLCBzbyB0aGF0IHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgICogYW55IHNhdmUgaXMgcGVyZm9ybWVkIHdlIHdpbGwgaGF2ZSB0aGUgY29ycmVjdCBub2RlIG5hbWUsIGF0IGxlYXN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhpcyB2ZXJzaW9uIGlzIG5vIGxvbmdlciBiZWluZyB1c2VkLCBhbmQgY3VycmVudGx5IHRoaXMgbWVhbnMgJ2VkaXRpbmdVbnNhdmVkTm9kZScgaXMgbm90IGN1cnJlbnRseSBldmVyXHJcbiAgICAgICAgICogdHJpZ2dlcmVkLiBUaGUgbmV3IGFwcHJvYWNoIG5vdyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gJ3JlbmFtZScgbm9kZXMgaXMgdG8ganVzdCBjcmVhdGUgb25lIHdpdGggYVxyXG4gICAgICAgICAqIHJhbmRvbSBuYW1lIGFuIGxldCB1c2VyIHN0YXJ0IGVkaXRpbmcgcmlnaHQgYXdheSBhbmQgdGhlbiByZW5hbWUgdGhlIG5vZGUgSUYgYSBjdXN0b20gbm9kZSBuYW1lIGlzIG5lZWRlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgbWVhbnMgaWYgd2UgY2FsbCB0aGlzIGZ1bmN0aW9uIChzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUpIGluc3RlYWQgb2YgJ3N0YXJ0RWRpdGluZ05ld05vZGUoKSdcclxuICAgICAgICAgKiB0aGF0IHdpbGwgY2F1c2UgdGhlIEdVSSB0byBhbHdheXMgcHJvbXB0IGZvciB0aGUgbm9kZSBuYW1lIGJlZm9yZSBjcmVhdGluZyB0aGUgbm9kZS4gVGhpcyB3YXMgdGhlIG9yaWdpbmFsXHJcbiAgICAgICAgICogZnVuY3Rpb25hbGl0eSBhbmQgc3RpbGwgd29ya3MuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNyZWF0ZSBzdWJub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhdmVOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uU2F2ZU5vZGVSZXNwb25zZSwgcGF5bG9hZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBiZWNhc3VzZSBJIGRvbid0IHVuZGVyc3RhbmQgJ2VkaXRpbmdVbnNhdmVkTm9kZScgdmFyaWFibGUgYW55IGxvbmdlciB1bnRpbCBpIHJlZnJlc2ggbXkgbWVtb3J5LCBpIHdpbGwgdXNlXHJcbiAgICAgICAgICAgICAgICB0aGUgb2xkIGFwcHJvYWNoIG9mIHJlZnJlc2hpbmcgZW50aXJlIHRyZWUgcmF0aGVyIHRoYW4gbW9yZSBlZmZpY2llbnQgcmVmcmVzbk5vZGVPblBhZ2UsIGJlY3Vhc2UgaXQgcmVxdWlyZXNcclxuICAgICAgICAgICAgICAgIHRoZSBub2RlIHRvIGFscmVhZHkgYmUgb24gdGhlIHBhZ2UsIGFuZCB0aGlzIHJlcXVpcmVzIGluIGRlcHRoIGFuYWx5cyBpJ20gbm90IGdvaW5nIHRvIGRvIHJpZ2h0IHRoaXMgbWludXRlLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vcmVuZGVyLnJlZnJlc2hOb2RlT25QYWdlKHJlcy5ub2RlKTtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHBheWxvYWQuc2F2ZWRJZCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE1vZGUgPSBmdW5jdGlvbihtb2RlVmFsPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVWYWwgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtb2RlVmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSA9IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPyBmYWxzZSA6IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgICAgIC8vIHRoYXQgY2FuIHNob3cgYW4gb24vb2ZmIHN0YXRlLlxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTaW5jZSBlZGl0IG1vZGUgdHVybnMgb24gbG90cyBvZiBidXR0b25zLCB0aGUgbG9jYXRpb24gb2YgdGhlIG5vZGUgd2UgYXJlIHZpZXdpbmcgY2FuIGNoYW5nZSBzbyBtdWNoIGl0XHJcbiAgICAgICAgICAgICAqIGdvZXMgY29tcGxldGVseSBvZmZzY3JlZW4gb3V0IG9mIHZpZXcsIHNvIHdlIHNjcm9sbCBpdCBiYWNrIGludG8gdmlldyBldmVyeSB0aW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQuc2F2ZVVzZXJQcmVmZXJlbmNlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVVwID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVBYm92ZSA9IGdldE5vZGVBYm92ZShub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlQWJvdmUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGVBYm92ZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlRG93biA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlQmVsb3c6IGpzb24uTm9kZUluZm8gPSBnZXROb2RlQmVsb3cobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZUJlbG93ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlQmVsb3cubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb1RvcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BOb2RlID0gZ2V0Rmlyc3RDaGlsZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b3BOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiB0b3BOb2RlLm5hbWVcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVUb0JvdHRvbSA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIHNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBhYm92ZSB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgdG9wIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVBYm92ZSA9IGZ1bmN0aW9uKG5vZGUpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsIDw9IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCAtIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGJlbG93IHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSBib3R0b20gbm9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJlbG93ID0gZnVuY3Rpb24obm9kZTogYW55KToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBvcmRpbmFsOiBudW1iZXIgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcmRpbmFsID0gXCIgKyBvcmRpbmFsKTtcclxuICAgICAgICAgICAgaWYgKG9yZGluYWwgPT0gLTEgfHwgb3JkaW5hbCA+PSBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgKyAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Rmlyc3RDaGlsZE5vZGUgPSBmdW5jdGlvbigpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEgfHwgIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlblswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuRWRpdE5vZGUgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBlZGl0Tm9kZUNsaWNrOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkluaXROb2RlRWRpdFJlcXVlc3QsIGpzb24uSW5pdE5vZGVFZGl0UmVzcG9uc2U+KFwiaW5pdE5vZGVFZGl0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgfSwgaW5pdE5vZGVFZGl0UmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBwYXJlbnRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGdldCB0aGUgbm9kZSBzZWxlY3RlZCBmb3IgdGhlIGluc2VydCBwb3NpdGlvbiBieSB1c2luZyB0aGUgdWlkIGlmIG9uZSB3YXMgcGFzc2VkIGluIG9yIHVzaW5nIHRoZVxyXG4gICAgICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZVVuZGVySGlnaGxpZ2h0ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJUYXAgYSBub2RlIHRvIGluc2VydCB1bmRlci5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdGhpcyBpbmRpY2F0ZXMgd2UgYXJlIE5PVCBpbnNlcnRpbmcgaW5saW5lLiBBbiBpbmxpbmUgaW5zZXJ0IHdvdWxkIGFsd2F5cyBoYXZlIGEgdGFyZ2V0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN0YXJ0RWRpdGluZ05ld05vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVwbHlUb0NvbW1lbnQgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjcmVhdGVTdWJOb2RlKHVpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGUgPSBmdW5jdGlvbih1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gY3JlYXRlU3ViTm9kZTogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdGhpcyBpbmRpY2F0ZXMgd2UgYXJlIE5PVCBpbnNlcnRpbmcgaW5saW5lLiBBbiBpbmxpbmUgaW5zZXJ0IHdvdWxkIGFsd2F5cyBoYXZlIGEgdGFyZ2V0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN0YXJ0RWRpdGluZ05ld05vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3Rpb25zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGNvdWxkIHdyaXRlIGNvZGUgdGhhdCBvbmx5IHNjYW5zIGZvciBhbGwgdGhlIFwiU0VMXCIgYnV0dG9ucyBhbmQgdXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlbSwgYnV0IGZvciBub3dcclxuICAgICAgICAgICAgICogd2UgdGFrZSB0aGUgc2ltcGxlIGFwcHJvYWNoIGFuZCBqdXN0IHJlLXJlbmRlciB0aGUgcGFnZS4gVGhlcmUgaXMgbm8gY2FsbCB0byB0aGUgc2VydmVyLCBzbyB0aGlzIGlzXHJcbiAgICAgICAgICAgICAqIGFjdHVhbGx5IHZlcnkgZWZmaWNpZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIERlbGV0ZSB0aGUgc2luZ2xlIG5vZGUgaWRlbnRpZmllZCBieSAndWlkJyBwYXJhbWV0ZXIgaWYgdWlkIHBhcmFtZXRlciBpcyBwYXNzZWQsIGFuZCBpZiB1aWQgcGFyYW1ldGVyIGlzIG5vdFxyXG4gICAgICAgICAqIHBhc3NlZCB0aGVuIHVzZSB0aGUgbm9kZSBzZWxlY3Rpb25zIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25zIG9uIHRoZSBwYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBkZWxldGUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpID9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3N0RGVsZXRlU2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVOb2Rlc1JlcXVlc3QsIGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZT4oXCJkZWxldGVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBzZWxOb2Rlc0FycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlTm9kZXNSZXNwb25zZSwgbnVsbCwgeyBcInBvc3REZWxldGVTZWxOb2RlXCI6IHBvc3REZWxldGVTZWxOb2RlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgdGhlIG5vZGUgd2Ugd2FudCB0byBzY3JvbGwgdG8gYWZ0ZXIgYSBkZWxldGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICAvKiBVc2UgYSBoYXNobWFwLXR5cGUgYXBwcm9hY2ggdG8gc2F2aW5nIGFsbCBzZWxlY3RlZCBub2RlcyBpbnRvIGEgbG9vdXAgbWFwICovXHJcbiAgICAgICAgICAgIGxldCBub2Rlc01hcDogT2JqZWN0ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQoKTtcclxuICAgICAgICAgICAgbGV0IGJlc3ROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHRha2VOZXh0Tm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLyogbm93IHdlIHNjYW4gdGhlIGNoaWxkcmVuLCBhbmQgdGhlIGxhc3QgY2hpbGQgd2UgZW5jb3VudGVyZCB1cCB1bnRpbCB3ZSBmaW5kIHRoZSByaXN0IG9uZW4gaW4gbm9kZXNNYXAgd2lsbCBiZSB0aGVcclxuICAgICAgICAgICAgbm9kZSB3ZSB3aWxsIHdhbnQgdG8gc2VsZWN0IGFuZCBzY3JvbGwgdGhlIHVzZXIgdG8gQUZURVIgdGhlIGRlbGV0aW5nIGlzIGRvbmUgKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRha2VOZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlzIHRoaXMgbm9kZSBvbmUgdG8gYmUgZGVsZXRlZCAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzTWFwW25vZGUuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZU5leHROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlc3ROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmVzdE5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBtb3ZlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgICAgICBcIkNvbmZpcm0gUGFzdGVcIixcclxuICAgICAgICAgICAgICAgIFwiUGFzdGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgdG8gbmV3IGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzLCBtb3ZlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZXNUb01vdmUgPSBzZWxOb2Rlc0FycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307IC8vIGNsZWFyIHNlbGVjdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaW5pc2hNb3ZpbmdTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIE1vdmVcIiwgXCJNb3ZlIFwiICsgbm9kZXNUb01vdmUubGVuZ3RoICsgXCIgbm9kZShzKSB0byBzZWxlY3RlZCBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgICAgICBcIlllcywgbW92ZS5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEZvciBub3csIHdlIHdpbGwganVzdCBjcmFtIHRoZSBub2RlcyBvbnRvIHRoZSBlbmQgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBwYWdlLiBMYXRlciBvbiB3ZSBjYW4gZ2V0IG1vcmUgc3BlY2lmaWMgYWJvdXQgYWxsb3dpbmcgcHJlY2lzZSBkZXN0aW5hdGlvbiBsb2NhdGlvbiBmb3IgbW92ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Nb3ZlTm9kZXNSZXF1ZXN0LCBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlPihcIm1vdmVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Tm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Q2hpbGRJZFwiOiBoaWdobGlnaHROb2RlICE9IG51bGwgPyBoaWdobGlnaHROb2RlLmlkIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IG5vZGVzVG9Nb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbW92ZU5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Qm9va1dhckFuZFBlYWNlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaW5zZXJ0aW5nIHVuZGVyIHdoYXRldmVyIG5vZGUgdXNlciBoYXMgZm9jdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Qm9va1JlcXVlc3QsIGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlPihcImluc2VydEJvb2tcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRydW5jYXRlZFwiOiB1c2VyLmlzVGVzdFVzZXJBY2NvdW50KClcclxuICAgICAgICAgICAgICAgICAgICB9LCBpbnNlcnRCb29rUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZXRhNjQuanNcIik7XHJcblxyXG4vKipcclxuICogTWFpbiBBcHBsaWNhdGlvbiBpbnN0YW5jZSwgYW5kIGNlbnRyYWwgcm9vdCBsZXZlbCBvYmplY3QgZm9yIGFsbCBjb2RlLCBhbHRob3VnaCBlYWNoIG1vZHVsZSBnZW5lcmFsbHkgY29udHJpYnV0ZXMgb25lXHJcbiAqIHNpbmdsZXRvbiB2YXJpYWJsZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCB3aXRoIGEgbmFtZSB1c3VhbGx5IGlkZW50aWNhbCB0byB0aGF0IGZpbGUuXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWV0YTY0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhcHBJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1clVybFBhdGg6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICAgICAgZXhwb3J0IGxldCB1cmxDbWQ6IHN0cmluZztcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjb2RlRm9ybWF0RGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IHNlcnZlck1hcmtkb3duOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBuZXh0R3VpZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLyogbmFtZSBvZiBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVzZXJOYW1lOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG5cclxuICAgICAgICAvKiBzY3JlZW4gY2FwYWJpbGl0aWVzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZXZpY2VXaWR0aDogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZUhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVc2VyJ3Mgcm9vdCBub2RlLiBUb3AgbGV2ZWwgb2Ygd2hhdCBsb2dnZWQgaW4gdXNlciBpcyBhbGxvd2VkIHRvIHNlZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlSWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZVBhdGg6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc3BlY2lmaWVzIGlmIHRoaXMgaXMgYWRtaW4gdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQWRtaW5Vc2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIGFsd2F5cyBzdGFydCBvdXQgYXMgYW5vbiB1c2VyIHVudGlsIGxvZ2luICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0Fub25Vc2VyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNpZ25hbHMgdGhhdCBkYXRhIGhhcyBjaGFuZ2VkIGFuZCB0aGUgbmV4dCB0aW1lIHdlIGdvIHRvIHRoZSBtYWluIHRyZWUgdmlldyB3aW5kb3cgd2UgbmVlZCB0byByZWZyZXNoIGRhdGFcclxuICAgICAgICAgKiBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRyZWVEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUuaWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIE1hcHMgZnJvbSB0aGUgRE9NIElEIHRvIHRoZSBlZGl0b3IgamF2YXNjcmlwdCBpbnN0YW5jZSAoQWNlIEVkaXRvciBpbnN0YW5jZSkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFjZUVkaXRvcnNCeUlkOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogY291bnRlciBmb3IgbG9jYWwgdWlkcyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbmV4dFVpZDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAgICAgKiB0byB3aGVuZXZlciB0aGUgcGFnZSB3aXRoIHRoYXQgY2hpbGQgaXMgdmlzaXRlZCwgYW5kIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwIGhvbGRzIHRoZSBtYXAgb2YgXCJwYXJlbnQgdWlkIHRvXHJcbiAgICAgICAgICogc2VsZWN0ZWQgbm9kZSAoTm9kZUluZm8gb2JqZWN0KVwiLCB3aGVyZSB0aGUga2V5IGlzIHRoZSBwYXJlbnQgbm9kZSB1aWQsIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGN1cnJlbnRseVxyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAgICAgKiBiZWluZyBhYmxlIHRvIHNjcm9sbCB0byB0aGUgbm9kZSBkdXJpbmcgbmF2aWdhdGluZyBhcm91bmQgb24gdGhlIHRyZWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLyogVXNlci1zZWxlY3RhYmxlIHVzZXItYWNjb3VudCBvcHRpb25zIGVhY2ggdXNlciBjYW4gc2V0IG9uIGhpcyBhY2NvdW50ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX0FEVkFOQ0VEOiBzdHJpbmcgPSBcImFkdmFuY2VkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLyogY2FuIGJlICdzaW1wbGUnIG9yICdhZHZhbmNlZCcgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlT3B0aW9uOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZ2dsZWQgYnkgYnV0dG9uLCBhbmQgaG9sZHMgaWYgd2UgYXJlIGdvaW5nIHRvIHNob3cgcHJvcGVydGllcyBvciBub3Qgb24gZWFjaCBub2RlIGluIHRoZSBtYWluIHZpZXdcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dQcm9wZXJ0aWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIEZsYWcgdGhhdCBpbmRpY2F0ZXMgaWYgd2UgYXJlIHJlbmRlcmluZyBwYXRoLCBvd25lciwgbW9kVGltZSwgZXRjLiBvbiBlYWNoIHJvdyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd01ldGFEYXRhOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTGlzdCBvZiBub2RlIHByZWZpeGVzIHRvIGZsYWcgbm9kZXMgdG8gbm90IGFsbG93IHRvIGJlIHNob3duIGluIHRoZSBwYWdlIGluIHNpbXBsZSBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdDogYW55ID0ge1xyXG4gICAgICAgICAgICBcInJlcDpcIjogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWFkT25seVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYmluYXJ5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIGFsbCBub2RlIHVpZHMgdG8gdHJ1ZSBpZiBzZWxlY3RlZCwgb3RoZXJ3aXNlIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZGVsZXRlZCAobm90IGV4aXN0aW5nKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIFNldCBvZiBhbGwgbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZWQgKGZyb20gdGhlIGFiYnJldmlhdGVkIGZvcm0pICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBleHBhbmRlZEFiYnJldk5vZGVJZHM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlRGF0YTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBhbGwgdmFyaWFibGVzIGRlcml2YWJsZSBmcm9tIGN1cnJlbnROb2RlRGF0YSwgYnV0IHN0b3JlZCBkaXJlY3RseSBmb3Igc2ltcGxlciBjb2RlL2FjY2Vzc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZUlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVQYXRoOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gZ3VpZCB0byBEYXRhIE9iamVjdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGF0YU9iak1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlclByZWZlcmVuY2VzOiBqc29uLlVzZXJQcmVmZXJlbmNlcyA9IHtcclxuICAgICAgICAgICAgXCJlZGl0TW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwibGFzdE5vZGVcIjogXCJcIixcclxuICAgICAgICAgICAgXCJpbXBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVNYWluTWVudVBhbmVsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICAgICAqIGZ1dHVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZ2lzdGVyRGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFkYXRhLmd1aWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrbmV4dEd1aWQ7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9iamVjdEJ5R3VpZCA9IGZ1bmN0aW9uKGd1aWQpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGRhdGFPYmpNYXBbZ3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGEgb2JqZWN0IG5vdCBmb3VuZDogZ3VpZD1cIiArIGd1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGNhbGxiYWNrIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgc2NyaXB0IHRvIHJ1biwgb3IgaWYgaXQncyBhIGZ1bmN0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmVcclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcnVuLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbmV2ZXIgd2UgYXJlIGJ1aWxkaW5nIGFuIG9uQ2xpY2sgc3RyaW5nLCBhbmQgd2UgaGF2ZSB0aGUgYWN0dWFsIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiB0aGUgbmFtZSBvZiB0aGVcclxuICAgICAgICAgKiBmdW5jdGlvbiAoaS5lLiB3ZSBoYXZlIHRoZSBmdW5jdGlvbiBvYmplY3QgYW5kIG5vdCBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB3ZSBoYW5kZSB0aGF0IGJ5IGFzc2lnbmluZyBhIGd1aWRcclxuICAgICAgICAgKiB0byB0aGUgZnVuY3Rpb24gb2JqZWN0LCBhbmQgdGhlbiBlbmNvZGUgYSBjYWxsIHRvIHJ1biB0aGF0IGd1aWQgYnkgY2FsbGluZyBydW5DYWxsYmFjay4gVGhlcmUgaXMgYSBsZXZlbCBvZlxyXG4gICAgICAgICAqIGluZGlyZWN0aW9uIGhlcmUsIGJ1dCB0aGlzIGlzIHRoZSBzaW1wbGVzdCBhcHByb2FjaCB3aGVuIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBtYXAgZnJvbSBhIHN0cmluZyB0byBhXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBjdHg9Y29udGV4dCwgd2hpY2ggaXMgdGhlICd0aGlzJyB0byBjYWxsIHdpdGggaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCBhbmQgaGF2ZSBhICd0aGlzJyBjb250ZXh0IHRvIGJpbmQgdG8gaXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbmNvZGVPbkNsaWNrID0gZnVuY3Rpb24oY2FsbGJhY2s6IGFueSwgY3R4KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IC8vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRGF0YU9iamVjdChjdHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm02NC5tZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIsXCIgKyBjdHguZ3VpZCArIFwiKTtcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibTY0Lm1ldGE2NC5ydW5DYWxsYmFjayhcIiArIGNhbGxiYWNrLmd1aWQgKyBcIik7XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuZXhwZWN0ZWQgY2FsbGJhY2sgdHlwZSBpbiBlbmNvZGVPbkNsaWNrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuQ2FsbGJhY2sgPSBmdW5jdGlvbihndWlkLCBjdHgpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFPYmogPSBnZXRPYmplY3RCeUd1aWQoZ3VpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vIHRoYXQgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICBpZiAoZGF0YU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG9yIGVsc2Ugc29tZXRpbWVzIHRoZSByZWdpc3RlcmVkIG9iamVjdCBpdHNlbGYgaXMgdGhlIGZ1bmN0aW9uLFxyXG4gICAgICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFPYmogPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gZ2V0T2JqZWN0QnlHdWlkKGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsKHRoaXopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcInVuYWJsZSB0byBmaW5kIGNhbGxiYWNrIG9uIHJlZ2lzdGVyZWQgZ3VpZDogXCIgKyBndWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluU2ltcGxlTW9kZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZWRpdE1vZGVPcHRpb24gPT09IE1PREVfU0lNUExFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGdvVG9NYWluUGFnZSh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ29Ub01haW5QYWdlID0gZnVuY3Rpb24ocmVyZW5kZXI/OiBib29sZWFuLCBmb3JjZVNlcnZlclJlZnJlc2g/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm9yY2VTZXJ2ZXJSZWZyZXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVyZW5kZXIgfHwgdHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgICAgICogcGFnZSBpbnRvIHZpc2libGUsIGFuZCBzY3JvbGwgdG8gbm9kZSlcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlbGVjdFRhYiA9IGZ1bmN0aW9uKHBhZ2VOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgICAgICg8X0hhc1NlbGVjdD5pcm9uUGFnZXMpLnNlbGVjdChwYWdlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvKiB0aGlzIGNvZGUgY2FuIGJlIG1hZGUgbW9yZSBEUlksIGJ1dCBpJ20ganVzdCB0cnlpbmcgaXQgb3V0IGZvciBub3csIHNvIGknbSBub3QgYm90aGVyaW5nIHRvIHBlcmZlY3QgaXQgeWV0LiAqL1xyXG4gICAgICAgICAgICAvLyAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvLyAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBpZiAocGFnZU5hbWUgPT0gJ21haW5UYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3NlYXJjaFRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI3NlYXJjaFBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICd0aW1lbGluZVRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgZGF0YSAoaWYgcHJvdmlkZWQpIG11c3QgYmUgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBjdXJyZW50IGluc3RhbmNlIG9mIHRoZSBkaWFsb2csIGFuZCBhbGwgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqIG1ldGhvZHMgYXJlIG9mIGNvdXJzZSBzaW5nbGV0b25zIHRoYXQgYWNjZXB0IHRoaXMgZGF0YSBwYXJhbWV0ZXIgZm9yIGFueSBvcHRlcmF0aW9ucy4gKG9sZHNjaG9vbCB3YXkgb2YgZG9pbmdcclxuICAgICAgICAgKiBPT1Agd2l0aCAndGhpcycgYmVpbmcgZmlyc3QgcGFyYW1ldGVyIGFsd2F5cykuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBOb3RlOiBlYWNoIGRhdGEgaW5zdGFuY2UgaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIGd1aWQgbnVtYmVyaWMgcHJvcGVydHksIHVuaXF1ZSB0byBpdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hhbmdlUGFnZSA9IGZ1bmN0aW9uKHBnPzogYW55LCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGcudGFiSWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9vcHMsIHdyb25nIG9iamVjdCB0eXBlIHBhc3NlZCB0byBjaGFuZ2VQYWdlIGZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiB0aGlzIGlzIHRoZSBzYW1lIGFzIHNldHRpbmcgdXNpbmcgbWFpbklyb25QYWdlcz8/ICovXHJcbiAgICAgICAgICAgIHZhciBwYXBlclRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7IC8vXCIjbWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgKDxfSGFzU2VsZWN0PnBhcGVyVGFicykuc2VsZWN0KHBnLnRhYklkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb2RlQmxhY2tMaXN0ZWQgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcDtcclxuICAgICAgICAgICAgZm9yIChwcm9wIGluIHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgbm9kZS5uYW1lLnN0YXJ0c1dpdGgocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVVaWRzQXJyYXkgPSBmdW5jdGlvbigpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxBcnJheSA9IFtdLCBpZHggPSAwLCB1aWQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkgPSBmdW5jdGlvbigpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxBcnJheSA9IFtdLCBpZHggPSAwLCB1aWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gc2VsZWN0ZWQgbm9kZXMuXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3RlZE5vZGUgY291bnQ6IFwiICsgdXRpbC5nZXRQcm9wZXJ0eUNvdW50KHNlbGVjdGVkTm9kZXMpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5hYmxlIHRvIGZpbmQgdWlkVG9Ob2RlTWFwIGZvciB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbEFycmF5W2lkeCsrXSA9IG5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHJldHVybiBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGZvciBlYWNoIE5vZGVJbmZvIHdoZXJlIHRoZSBrZXkgaXMgdGhlIGlkICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXNNYXBCeUlkID0gZnVuY3Rpb24oKTogT2JqZWN0IHtcclxuICAgICAgICAgICAgbGV0IHJldDogT2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gdGhpcy5nZXRTZWxlY3RlZE5vZGVzQXJyYXkoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmV0W3NlbEFycmF5W2ldLmlkXSA9IHNlbEFycmF5W2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBHZXRzIHNlbGVjdGVkIG5vZGVzIGFzIE5vZGVJbmZvLmphdmEgb2JqZWN0cyBhcnJheSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2Rlc0FycmF5ID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mb1tdIHtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbEFycmF5W2lkeCsrXSA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3RlZE5vZGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm9SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcywgbm9kZSkge1xyXG4gICAgICAgICAgICBsZXQgb3duZXJCdWY6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtaW5lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLm93bmVycykge1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHJlcy5vd25lcnMsIGZ1bmN0aW9uKGluZGV4LCBvd25lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyID09PSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBvd25lcjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5vd25lciA9IG93bmVyQnVmO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsbSA9ICQoXCIjb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uaHRtbChcIiAoTWFuYWdlcjogXCIgKyBvd25lckJ1ZiArIFwiKVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChtaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJjcmVhdGVkLWJ5LW90aGVyXCIsIFwiY3JlYXRlZC1ieS1tZVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJjcmVhdGVkLWJ5LW1lXCIsIFwiY3JlYXRlZC1ieS1vdGhlclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVOb2RlSW5mbyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlKHJlcywgbm9kZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUmV0dXJucyB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBub2RlLmlkIHZhbHVlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlRnJvbUlkID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICByZXR1cm4gaWRUb05vZGVNYXBbaWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQYXRoT2ZVaWQgPSBmdW5jdGlvbih1aWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiW3BhdGggZXJyb3IuIGludmFsaWQgdWlkOiBcIiArIHVpZCArIFwiXVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUucGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRIaWdobGlnaHRlZE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgbGV0IHJldDoganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Um93QnlJZCA9IGZ1bmN0aW9uKGlkLCBzY3JvbGwpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIG5vZGU6IGpzb24uTm9kZUluZm8gPSBnZXROb2RlRnJvbUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodE5vZGUobm9kZSwgc2Nyb2xsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlnaGxpZ2h0Um93QnlJZCBmYWlsZWQgdG8gZmluZCBpZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSW1wb3J0YW50OiBXZSB3YW50IHRoaXMgdG8gYmUgdGhlIG9ubHkgbWV0aG9kIHRoYXQgY2FuIHNldCB2YWx1ZXMgb24gJ3BhcmVudFVpZFRvRm9jdXNOb2RlTWFwJywgYW5kIGFsd2F5c1xyXG4gICAgICAgICAqIHNldHRpbmcgdGhhdCB2YWx1ZSBzaG91bGQgZ28gdGhydSB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNjcm9sbDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBsZXQgZG9uZUhpZ2hsaWdodGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLyogVW5oaWdobGlnaHQgY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgYW55ICovXHJcbiAgICAgICAgICAgIGxldCBjdXJIaWdobGlnaHRlZE5vZGU6IGpzb24uTm9kZUluZm8gPSBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgICAgIGlmIChjdXJIaWdobGlnaHRlZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJIaWdobGlnaHRlZE5vZGUudWlkID09PSBub2RlLnVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWxyZWFkeSBoaWdobGlnaHRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZUhpZ2hsaWdodGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dFbG1JZCA9IGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93RWxtID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZG9uZUhpZ2hsaWdodGluZykge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdID0gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtOiBzdHJpbmcgPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyb3dFbG0gfHwgcm93RWxtLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gZmluZCByb3dFbGVtZW50IHRvIGhpZ2hsaWdodDogXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImluYWN0aXZlLXJvd1wiLCBcImFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZWFsbHkgbmVlZCB0byB1c2UgcHViL3N1YiBldmVudCB0byBicm9hZGNhc3QgZW5hYmxlbWVudCwgYW5kIGxldCBlYWNoIGNvbXBvbmVudCBkbyB0aGlzIGluZGVwZW5kZW50bHkgYW5kXHJcbiAgICAgICAgICogZGVjb3VwbGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hBbGxHdWlFbmFibGVtZW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVDb3VudDogbnVtYmVyID0gdXRpbC5nZXRQcm9wZXJ0eUNvdW50KHNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZUlzTWluZTogYm9vbGVhbiA9IGhpZ2hsaWdodE5vZGUgJiYgaGlnaGxpZ2h0Tm9kZS5jcmVhdGVkQnkgPT09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhvbWVOb2RlSWQ9XCIrbWV0YTY0LmhvbWVOb2RlSWQrXCIgaGlnaGxpZ2h0Tm9kZS5pZD1cIitoaWdobGlnaHROb2RlLmlkKTtcclxuICAgICAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICYmIG1ldGE2NC5ob21lTm9kZUlkID09IGhpZ2hsaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGxldCBpbXBvcnRBbGxvd2VkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmltcG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBleHBvcnRBbGxvd2VkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmV4cG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHRPcmRpbmFsOiBudW1iZXIgPSBnZXRPcmRpbmFsT2ZOb2RlKGhpZ2hsaWdodE5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgbnVtQ2hpbGROb2RlczogbnVtYmVyID0gZ2V0TnVtQ2hpbGROb2RlcygpO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gaGlnaGxpZ2h0T3JkaW5hbCA+IDAgJiYgbnVtQ2hpbGROb2RlcyA+IDE7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IGhpZ2hsaWdodE9yZGluYWwgPCBudW1DaGlsZE5vZGVzIC0gMSAmJiBudW1DaGlsZE5vZGVzID4gMTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW5hYmxlbWVudDogaXNBbm9uVXNlcj1cIiArIGlzQW5vblVzZXIgKyBcIiBzZWxOb2RlQ291bnQ9XCIgKyBzZWxOb2RlQ291bnQgKyBcIiBzZWxOb2RlSXNNaW5lPVwiICsgc2VsTm9kZUlzTWluZSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJuYXZMb2dvdXRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0QWxsb3dlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5JbXBvcnREbGdcIiwgaW1wb3J0QWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcHNUb2dnbGU6IGJvb2xlYW4gPSBjdXJyZW50Tm9kZSAmJiAhaXNBbm9uVXNlcjtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgcHJvcHNUb2dnbGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbG93RWRpdE1vZGU6IGJvb2xlYW4gPSBjdXJyZW50Tm9kZSAmJiAhaXNBbm9uVXNlcjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cExldmVsQnV0dG9uXCIsIGN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgZWRpdC5ub2Rlc1RvTW92ZSAhPSBudWxsICYmIChzZWxOb2RlSXNNaW5lIHx8IGhvbWVOb2RlU2VsZWN0ZWQpKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVXBCdXR0b25cIiwgY2FuTW92ZVVwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIGNhbk1vdmVEb3duKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIGlzQWRtaW5Vc2VyIHx8IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlZnJlc2hQYWdlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG5cclxuICAgICAgICAgICAgLy9WSVNJQklMSVRZXHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIGltcG9ydEFsbG93ZWQgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0QWxsb3dlZCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibmF2SG9tZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1cExldmVsQnV0dG9uXCIsIG1ldGE2NC5jdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIGlzQWRtaW5Vc2VyIHx8IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwic2VhcmNoTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ0aW1lbGluZU1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXNlclByZWZlcmVuY2VzTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTaW5nbGVTZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmb3VuZCBhIHNpbmdsZSBTZWwgTm9kZUlEOiBcIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRPcmRpbmFsT2ZOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudE5vZGVEYXRhIHx8ICFjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaWQgPT09IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0TnVtQ2hpbGROb2RlcyA9IGZ1bmN0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudE5vZGVEYXRhIHx8ICFjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRDdXJyZW50Tm9kZURhdGEgPSBmdW5jdGlvbihkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gZGF0YS5ub2RlO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZVVpZCA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlSWQgPSBkYXRhLm5vZGUuaWQ7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlUGF0aCA9IGRhdGEubm9kZS5wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhbm9uUGFnZUxvYWRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Bbm9uUGFnZUxvYWRSZXNwb25zZSk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMucmVuZGVyTm9kZVJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgbGlzdHZpZXcgdG86IFwiICsgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbW92ZUJpbmFyeUJ5VWlkID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5oYXNCaW5hcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1cGRhdGVzIGNsaWVudCBzaWRlIG1hcHMgYW5kIGNsaWVudC1zaWRlIGlkZW50aWZpZXIgZm9yIG5ldyBub2RlLCBzbyB0aGF0IHRoaXMgbm9kZSBpcyAncmVjb2duaXplZCcgYnkgY2xpZW50XHJcbiAgICAgICAgICogc2lkZSBjb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0Tm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHVwZGF0ZU1hcHM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0Tm9kZSBoYXMgbnVsbCBub2RlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGFzc2lnbiBhIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgdGhpcyBub2RlIHR5cGUsIEknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHVzaW5nIHNvbWUga2luZCBvZiBjdXN0b20gSlNcclxuICAgICAgICAgICAgICogcHJvdG90eXBlLXJlbGF0ZWQgYXBwcm9hY2hcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGUudWlkID0gdXBkYXRlTWFwcyA/IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCkgOiBpZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBub2RlLnByb3BlcnRpZXMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIobm9kZS5wcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEZvciB0aGVzZSB0d28gcHJvcGVydGllcyB0aGF0IGFyZSBhY2Nlc3NlZCBmcmVxdWVudGx5IHdlIGdvIGFoZWFkIGFuZCBsb29rdXAgdGhlIHByb3BlcnRpZXMgaW4gdGhlXHJcbiAgICAgICAgICAgICAqIHByb3BlcnR5IGFycmF5LCBhbmQgYXNzaWduIHRoZW0gZGlyZWN0bHkgYXMgbm9kZSBvYmplY3QgcHJvcGVydGllcyBzbyB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLCBhbmQgYWxzb1xyXG4gICAgICAgICAgICAgKiBzaW1wbGlmeSBjb2RlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZS5jcmVhdGVkQnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbm9kZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5MQVNUX01PRElGSUVELCBub2RlKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXBkYXRlTWFwcykge1xyXG4gICAgICAgICAgICAgICAgdWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZFRvTm9kZU1hcFtub2RlLmlkXSA9IG5vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdENvbnN0YW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3QsIFsgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUE9MSUNZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChyZWFkT25seVByb3BlcnR5TGlzdCwgWyAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlVVSUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVEX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVELCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVEX0JZLC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmFkZEFsbChiaW5hcnlQcm9wZXJ0eUxpc3QsIFtqY3JDbnN0LkJJTl9EQVRBXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IHRoaXMgYW5kIGV2ZXJ5IG90aGVyIG1ldGhvZCB0aGF0J3MgY2FsbGVkIGJ5IGEgbGl0c3RlbmVyIG9yIGEgdGltZXIgbmVlZHMgdG8gaGF2ZSB0aGUgJ2ZhdCBhcnJvdycgc3ludGF4IGZvciB0aGlzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0QXBwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdEFwcCBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcHBJbml0aWFsaXplZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGFwcEluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YWJzID0gdXRpbC5wb2x5KFwibWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJDaGFuZ2VFdmVudCh0YWJzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpbml0Q29uc3RhbnRzKCk7XHJcbiAgICAgICAgICAgIGRpc3BsYXlTaWdudXBNZXNzYWdlKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAgICAgKiAkKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBfLm9yaWVudGF0aW9uSGFuZGxlcik7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJMZWF2ZSBNZXRhNjQgP1wiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIEkgdGhvdWdodCB0aGlzIHdhcyBhIGdvb2QgaWRlYSwgYnV0IGFjdHVhbGx5IGl0IGRlc3Ryb3lzIHRoZSBzZXNzaW9uLCB3aGVuIHRoZSB1c2VyIGlzIGVudGVyaW5nIGFuXHJcbiAgICAgICAgICAgICAqIFwiaWQ9XFxteVxccGF0aFwiIHR5cGUgb2YgdXJsIHRvIG9wZW4gYSBzcGVjaWZpYyBub2RlLiBOZWVkIHRvIHJldGhpbmsgIEJhc2ljYWxseSBmb3Igbm93IEknbSB0aGlua2luZ1xyXG4gICAgICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogJCh3aW5kb3cpLm9uKFwidW5sb2FkXCIsIGZ1bmN0aW9uKCkgeyB1c2VyLmxvZ291dChmYWxzZSk7IH0pO1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGRldmljZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFRoaXMgY2FsbCBjaGVja3MgdGhlIHNlcnZlciB0byBzZWUgaWYgd2UgaGF2ZSBhIHNlc3Npb24gYWxyZWFkeSwgYW5kIGdldHMgYmFjayB0aGUgbG9naW4gaW5mb3JtYXRpb24gZnJvbVxyXG4gICAgICAgICAgICAgKiB0aGUgc2Vzc2lvbiwgYW5kIHRoZW4gcmVuZGVycyBwYWdlIGNvbnRlbnQsIGFmdGVyIHRoYXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB1c2VyLnJlZnJlc2hMb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogQ2hlY2sgZm9yIHNjcmVlbiBzaXplIGluIGEgdGltZXIuIFdlIGRvbid0IHdhbnQgdG8gbW9uaXRvciBhY3R1YWwgc2NyZWVuIHJlc2l6ZSBldmVudHMgYmVjYXVzZSBpZiBhIHVzZXJcclxuICAgICAgICAgICAgICogaXMgZXhwYW5kaW5nIGEgd2luZG93IHdlIGJhc2ljYWxseSB3YW50IHRvIGxpbWl0IHRoZSBDUFUgYW5kIGNoYW9zIHRoYXQgd291bGQgZW5zdWUgaWYgd2UgdHJpZWQgdG8gYWRqdXN0XHJcbiAgICAgICAgICAgICAqIHRoaW5ncyBldmVyeSB0aW1lIGl0IGNoYW5nZXMuIFNvIHdlIHRocm90dGxlIGJhY2sgdG8gb25seSByZW9yZ2FuaXppbmcgdGhlIHNjcmVlbiBvbmNlIHBlciBzZWNvbmQuIFRoaXNcclxuICAgICAgICAgICAgICogdGltZXIgaXMgYSB0aHJvdHRsZSBzb3J0IG9mLiBZZXMgSSBrbm93IGhvdyB0byBsaXN0ZW4gZm9yIGV2ZW50cy4gTm8gSSdtIG5vdCBkb2luZyBpdCB3cm9uZyBoZXJlLiBUaGlzXHJcbiAgICAgICAgICAgICAqIHRpbWVyIGlzIGNvcnJlY3QgaW4gdGhpcyBjYXNlIGFuZCBiZWhhdmVzIHN1cGVyaW9yIHRvIGV2ZW50cy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFBvbHltZXItPmRpc2FibGVcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IHZhciB3aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBpZiAod2lkdGggIT0gXy5kZXZpY2VXaWR0aCkgeyAvLyBjb25zb2xlLmxvZyhcIlNjcmVlbiB3aWR0aCBjaGFuZ2VkOiBcIiArIHdpZHRoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogXy5kZXZpY2VXaWR0aCA9IHdpZHRoOyBfLmRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogXy5zY3JlZW5TaXplQ2hhbmdlKCk7IH0gfSwgMTUwMCk7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgdXBkYXRlTWFpbk1lbnVQYW5lbCgpO1xyXG4gICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5pbml0UHJvZ3Jlc3NNb25pdG9yKCk7XHJcblxyXG4gICAgICAgICAgICBwcm9jZXNzVXJsUGFyYW1zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2Nlc3NVcmxQYXJhbXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHBhc3NDb2RlID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJwYXNzQ29kZVwiKTtcclxuICAgICAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgQ2hhbmdlUGFzc3dvcmREbGcocGFzc0NvZGUpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cmxDbWQgPSB1dGlsLmdldFBhcmFtZXRlckJ5TmFtZShcImNtZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGFiQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbih0YWJOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0YWJOYW1lID09IFwic2VhcmNoVGFiTmFtZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBzcmNoLnNlYXJjaFRhYkFjdGl2YXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRpc3BsYXlTaWdudXBNZXNzYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBzaWdudXBSZXNwb25zZSA9ICQoXCIjc2lnbnVwQ29kZVJlc3BvbnNlXCIpLnRleHQoKTtcclxuICAgICAgICAgICAgaWYgKHNpZ251cFJlc3BvbnNlID09PSBcIm9rXCIpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2NyZWVuU2l6ZUNoYW5nZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudE5vZGVEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC5jdXJyZW50Tm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUobWV0YTY0LmN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICAvLyBpZiAoZXZlbnQub3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvYWRBbm9uUGFnZUhvbWUgPSBmdW5jdGlvbihpZ25vcmVVcmwpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQW5vblBhZ2VMb2FkUmVxdWVzdCwganNvbi5Bbm9uUGFnZUxvYWRSZXNwb25zZT4oXCJhbm9uUGFnZUxvYWRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgICAgIH0sIGFub25QYWdlTG9hZFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZVVzZXJQcmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB1c2VyUHJlZmVyZW5jZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0b2RvLTA6IGZvciBub3cgSSdsbCBqdXN0IGRyb3AgdGhpcyBpbnRvIGEgZ2xvYmFsIHZhcmlhYmxlLiBJIGtub3cgdGhlcmUncyBhIGJldHRlciB3YXkuIFRoaXMgaXMgdGhlIG9ubHkgdmFyaWFibGVcclxud2UgaGF2ZSBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgYW5kIGlzIG9ubHkgcmVxdWlyZWQgZm9yIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uIGluIEpTIG9uIHRoZSBpbmRleC5odG1sIHBhZ2UgKi9cclxuaWYgKCF3aW5kb3dbXCJtZXRhNjRcIl0pIHtcclxuICAgIHZhciBtZXRhNjQgPSBtNjQubWV0YTY0O1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBuYXYge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZE1vcmUgPSBmdW5jdGlvbihub2RlSWQ6IHN0cmluZykgOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qIEknbSBzZXR0aW5nIHRoaXMgaGVyZSBzbyB0aGF0IHdlIGNhbiBjb21lIHVwIHdpdGggYSB3YXkgdG8gbWFrZSB0aGUgYWJicmV2IGV4cGFuZCBzdGF0ZSBiZSByZW1lbWJlcmVkLCBidXR0b25cclxuICAgICAgICAgICAgdGhpcyBpcyBsb3dlciBwcmlvcml0eSBmb3Igbm93LCBzbyBpJ20gbm90IHVzaW5nIGl0IHlldCAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuZXhwYW5kZWRBYmJyZXZOb2RlSWRzW25vZGVJZF0gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCwganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZT4oXCJleHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkXHJcbiAgICAgICAgICAgIH0sIGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlZBTDogXCIrSlNPTi5zdHJpbmdpZnkocmVzLm5vZGVJbmZvKSk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGVJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5aW5nSG9tZSA9IGZ1bmN0aW9uKCkgOiBib29sZWFue1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRWaXNpYmxlVG9Vc2VyID0gZnVuY3Rpb24oKSA6IGJvb2xlYW57XHJcbiAgICAgICAgICAgIHJldHVybiAhZGlzcGxheWluZ0hvbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBMZXZlbFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgaWQpIDogdm9pZHtcclxuICAgICAgICAgICAgaWYgKCFyZXMgfHwgIXJlcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBkYXRhIGlzIHZpc2libGUgdG8geW91IGFib3ZlIHRoaXMgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKGlkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlVwTGV2ZWwgPSBmdW5jdGlvbigpIDogdm9pZHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFyZW50VmlzaWJsZVRvVXNlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGF0IHJvb3QuIENhbid0IGdvIHVwLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IDEsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB1cExldmVsUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgbWV0YTY0LmN1cnJlbnROb2RlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCkgOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOnN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb29raW5nIHVwIHVzaW5nIGVsZW1lbnQgaWQ6IFwiK25vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkUG9seUVsZW1lbnQgPSBmdW5jdGlvbigpIDogYW55e1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOnN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uTm9kZVJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKSA6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbGlja09uTm9kZVJvdyByZWNpZXZlZCB1aWQgdGhhdCBkb2Vzbid0IG1hcCB0byBhbnkgbm9kZS4gdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogc2V0cyB3aGljaCBub2RlIGlzIHNlbGVjdGVkIG9uIHRoaXMgcGFnZSAoaS5lLiBwYXJlbnQgbm9kZSBvZiB0aGlzIHBhZ2UgYmVpbmcgdGhlICdrZXknKVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaWYgbm9kZS5vd25lciBpcyBjdXJyZW50bHkgbnVsbCwgdGhhdCBtZWFucyB3ZSBoYXZlIG5vdCByZXRyaWV2ZWQgdGhlIG93bmVyIGZyb20gdGhlIHNlcnZlciB5ZXQsIGJ1dFxyXG4gICAgICAgICAgICAgICAgICogaWYgbm9uLW51bGwgaXQncyBhbHJlYWR5IGRpc3BsYXlpbmcgYW5kIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZS5vd25lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyB1cGRhdGVOb2RlSW5mb1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQudXBkYXRlTm9kZUluZm8obm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Ob2RlID0gZnVuY3Rpb24odWlkKSA6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG5vZGUuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAgICAgKiBzaWxseSBsb29raW5nIGFzeW5jIHRpbWVyIGhlcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246YW55ID0gdXRpbC5wb2x5RWxtKHVpZCArIFwiX3NlbFwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVCdXR0b24ubm9kZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcudXBkYXRlU3RhdHVzQmFyKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2SG9tZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkgOiB2b2lke1xyXG4gICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2SG9tZSA9IGZ1bmN0aW9uKCkgOnZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sIG5hdkhvbWVSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2UHVibGljSG9tZSA9IGZ1bmN0aW9uKCkgOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHByZWZzLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHByZWZzIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5DbG9zZUFjY291bnRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xvc2VBY2NvdW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9oIE5vIVwiLCBcIkNsb3NlIHlvdXIgQWNjb3VudD88cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGVsZXRlQWxsVXNlckNvb2tpZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DbG9zZUFjY291bnRSZXF1ZXN0LCBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlPihcImNsb3NlQWNjb3VudFwiLCB7fSwgY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJvcHMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJvcHMge1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRvZ2dsZXMgZGlzcGxheSBvZiBwcm9wZXJ0aWVzIGluIHRoZSBndWkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9wc1RvZ2dsZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQuc2hvd1Byb3BlcnRpZXMgPSBtZXRhNjQuc2hvd1Byb3BlcnRpZXMgPyBmYWxzZSA6IHRydWU7XHJcbiAgICAgICAgICAgIC8vIHNldERhdGFJY29uVXNpbmdJZChcIiNlZGl0TW9kZUJ1dHRvblwiLCBlZGl0TW9kZSA/IFwiZWRpdFwiIDpcclxuICAgICAgICAgICAgLy8gXCJmb3JiaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyBmaXggZm9yIHBvbHltZXJcclxuICAgICAgICAgICAgLy8gdmFyIGVsbSA9ICQoXCIjcHJvcHNUb2dnbGVCdXR0b25cIik7XHJcbiAgICAgICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZ3JpZFwiLCBtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAvLyBlbG0udG9nZ2xlQ2xhc3MoXCJ1aS1pY29uLWZvcmJpZGRlblwiLCAhbWV0YTY0LnNob3dQcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzW2ldLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzcGxpY2UgaXMgaG93IHlvdSBkZWxldGUgYXJyYXkgZWxlbWVudHMgaW4ganMuXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBTb3J0cyBwcm9wcyBpbnB1dCBhcnJheSBpbnRvIHRoZSBwcm9wZXIgb3JkZXIgdG8gc2hvdyBmb3IgZWRpdGluZy4gU2ltcGxlIGFsZ29yaXRobSBmaXJzdCBncmFicyAnamNyOmNvbnRlbnQnXHJcbiAgICAgICAgICogbm9kZSBhbmQgcHV0cyBpdCBvbiB0aGUgdG9wLCBhbmQgdGhlbiBkb2VzIHNhbWUgZm9yICdqY3RDbnN0LlRBR1MnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIgPSBmdW5jdGlvbihwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHNOZXc6IGpzb24uUHJvcGVydHlJbmZvW10gPSBwcm9wcy5jbG9uZSgpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0SWR4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRhZ0lkeDogbnVtYmVyID0gcHJvcHNOZXcuaW5kZXhPZkl0ZW1CeVByb3AoXCJuYW1lXCIsIGpjckNuc3QuQ09OVEVOVCk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHByb3BzTmV3LmFycmF5TW92ZUl0ZW0odGFnSWR4LCB0YXJnZXRJZHgrKyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhZ0lkeCA9IHByb3BzTmV3LmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBqY3JDbnN0LlRBR1MpO1xyXG4gICAgICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wc05ldy5hcnJheU1vdmVJdGVtKHRhZ0lkeCwgdGFyZ2V0SWR4KyspO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHByb3BlcnRpZXMgd2lsbCBiZSBudWxsIG9yIGEgbGlzdCBvZiBQcm9wZXJ0eUluZm8gb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihwcm9wZXJ0aWVzKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWJsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHByb3BlcnRpZXMsIGZ1bmN0aW9uKGksIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3BlcnR5Lm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGQ6IHN0cmluZyA9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1uYW1lLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JpbmFyeVByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IFwiW2JpbmFyeV1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSByZW5kZXIud3JhcEh0bWwocHJvcGVydHkuaHRtbFZhbHVlID8gcHJvcGVydHkuaHRtbFZhbHVlIDogcHJvcGVydHkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcHJvcHMucmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGQgKz0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXZhbC1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUgKz0gcmVuZGVyLnRhZyhcInRyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXJvd1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJ0YWJsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJib3JkZXJcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3BlcnR5LXRhYmxlXCJcclxuICAgICAgICAgICAgICAgIH0sIHRhYmxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYnJ1dGUgZm9yY2Ugc2VhcmNoZXMgb24gbm9kZSAoTm9kZUluZm8uamF2YSkgb2JqZWN0IHByb3BlcnRpZXMgbGlzdCwgYW5kIHJldHVybnMgdGhlIGZpcnN0IHByb3BlcnR5XHJcbiAgICAgICAgICogKFByb3BlcnR5SW5mby5qYXZhKSB3aXRoIG5hbWUgbWF0Y2hpbmcgcHJvcGVydHlOYW1lLCBlbHNlIG51bGwuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBqc29uLlByb3BlcnR5SW5mbyB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSB8fCAhbm9kZS5wcm9wZXJ0aWVzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3AubmFtZSA9PT0gcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eVZhbCA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IGdldE5vZGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcCA/IHByb3AudmFsdWUgOiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydXMgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb25Pd25lZE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3Qga25vdyB3aG8gb3ducyB0aGlzIG5vZGUgYXNzdW1lIHRoZSBhZG1pbiBvd25zIGl0LlxyXG4gICAgICAgICAgICBpZiAoIWNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZEJ5ID0gXCJhZG1pblwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIGlzIE9SIGNvbmRpdGlvbiBiZWNhdXNlIG9mIGNyZWF0ZWRCeSBpcyBudWxsIHdlIGFzc3VtZSB3ZSBkbyBub3Qgb3duIGl0ICovXHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb25Pd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgPT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBwcm9wZXJ0eSB2YWx1ZSwgZXZlbiBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWUgfHwgcHJvcGVydHkudmFsdWUubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMTogbWFrZSBzdXJlIHRoaXMgd3JhcEh0bWwgaXNuJ3QgY3JlYXRpbmcgYW4gdW5uZWNlc3NhcnkgRElWIGVsZW1lbnQuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLndyYXBIdG1sKHByb3BlcnR5Lmh0bWxWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKHZhbHVlcyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPGRpdj5cIjtcclxuICAgICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAkLmVhY2godmFsdWVzLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBjbnN0LkJSO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci53cmFwSHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHJlbmRlci5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIHBvc3RUYXJnZXRVcmw7XHJcbmRlY2xhcmUgdmFyIHByZXR0eVByaW50O1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHJlbmRlciB7XHJcbiAgICAgICAgbGV0IGRlYnVnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgY29udGVudCBkaXNwbGF5ZWQgd2hlbiB0aGUgdXNlciBzaWducyBpbiwgYW5kIHdlIHNlZSB0aGF0IHRoZXkgaGF2ZSBubyBjb250ZW50IGJlaW5nIGRpc3BsYXllZC4gV2VcclxuICAgICAgICAgKiB3YW50IHRvIGdpdmUgdGhlbSBzb21lIGluc3RydWN0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gYWRkIGNvbnRlbnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGdldEVtcHR5UGFnZVByb21wdCA9IGZ1bmN0aW9uKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxwPlRoZXJlIGFyZSBubyBzdWJub2RlcyB1bmRlciB0aGlzIG5vZGUuIDxicj48YnI+Q2xpY2sgJ0VESVQgTU9ERScgYW5kIHRoZW4gdXNlIHRoZSAnQUREJyBidXR0b24gdG8gY3JlYXRlIGNvbnRlbnQuPC9wPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlbmRlckJpbmFyeSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiB0aGlzIGlzIGFuIGltYWdlIHJlbmRlciB0aGUgaW1hZ2UgZGlyZWN0bHkgb250byB0aGUgcGFnZSBhcyBhIHZpc2libGUgaW1hZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChub2RlLmJpbmFyeUlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYWtlSW1hZ2VUYWcobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgbm90IGFuIGltYWdlIHdlIHJlbmRlciBhIGxpbmsgdG8gdGhlIGF0dGFjaG1lbnQsIHNvIHRoYXQgaXQgY2FuIGJlIGRvd25sb2FkZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBhbmNob3I6IHN0cmluZyA9IHRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaHJlZlwiOiBnZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKVxyXG4gICAgICAgICAgICAgICAgfSwgXCJbRG93bmxvYWQgQXR0YWNobWVudF1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImJpbmFyeS1saW5rXCJcclxuICAgICAgICAgICAgICAgIH0sIGFuY2hvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSW1wb3J0YW50IGxpdHRsZSBtZXRob2QgaGVyZS4gQWxsIEdVSSBwYWdlL2RpdnMgYXJlIGNyZWF0ZWQgdXNpbmcgdGhpcyBzb3J0IG9mIHNwZWNpZmljYXRpb24gaGVyZSB0aGF0IHRoZXlcclxuICAgICAgICAgKiBhbGwgbXVzdCBoYXZlIGEgJ2J1aWxkJyBtZXRob2QgdGhhdCBpcyBjYWxsZWQgZmlyc3QgdGltZSBvbmx5LCBhbmQgdGhlbiB0aGUgJ2luaXQnIG1ldGhvZCBjYWxsZWQgYmVmb3JlIGVhY2hcclxuICAgICAgICAgKiB0aW1lIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNwbGF5ZWQgd2l0aCBuZXcgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBJZiAnZGF0YScgaXMgcHJvdmlkZWQsIHRoaXMgaXMgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWRQYWdlID0gZnVuY3Rpb24ocGcsIGRhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidWlsZFBhZ2U6IHBnLmRvbUlkPVwiICsgcGcuZG9tSWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwZy5idWlsdCB8fCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBwZy5idWlsZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIHBnLmJ1aWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBnLmluaXQpIHtcclxuICAgICAgICAgICAgICAgIHBnLmluaXQoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGRSb3dIZWFkZXIgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzaG93UGF0aDogYm9vbGVhbiwgc2hvd05hbWU6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBoZWFkZXJUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX09OX1JPV1MpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2IGNsYXNzPSdwYXRoLWRpc3BsYXknPlBhdGg6IFwiICsgZm9ybWF0UGF0aChub2RlKSArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAoY29tbWVudEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5Db21tZW50IEJ5OiBcIiArIGNvbW1lbnRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9IC8vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChub2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q3JlYXRlZCBCeTogXCIgKyBub2RlLmNyZWF0ZWRCeSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gaWQ9J293bmVyRGlzcGxheVwiICsgbm9kZS51aWQgKyBcIic+PC9zcGFuPlwiO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCIgIE1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBvbiByb290IG5vZGUgbmFtZSB3aWxsIGJlIGVtcHR5IHN0cmluZyBzbyBkb24ndCBzaG93IHRoYXRcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogY29tbWVudGluZzogSSBkZWNpZGVkIHVzZXJzIHdpbGwgdW5kZXJzdGFuZCB0aGUgcGF0aCBhcyBhIHNpbmdsZSBsb25nIGVudGl0eSB3aXRoIGxlc3MgY29uZnVzaW9uIHRoYW5cclxuICAgICAgICAgICAgICogYnJlYWtpbmcgb3V0IHRoZSBuYW1lIGZvciB0aGVtLiBUaGV5IGFscmVhZHkgdW5zZXJzdGFuZCBpbnRlcm5ldCBVUkxzLiBUaGlzIGlzIHRoZSBzYW1lIGNvbmNlcHQuIE5vIG5lZWRcclxuICAgICAgICAgICAgICogdG8gYmFieSB0aGVtLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBUaGUgIXNob3dQYXRoIGNvbmRpdGlvbiBoZXJlIGlzIGJlY2F1c2UgaWYgd2UgYXJlIHNob3dpbmcgdGhlIHBhdGggdGhlbiB0aGUgZW5kIG9mIHRoYXQgaXMgYWx3YXlzIHRoZVxyXG4gICAgICAgICAgICAgKiBuYW1lLCBzbyB3ZSBkb24ndCBuZWVkIHRvIHNob3cgdGhlIHBhdGggQU5EIHRoZSBuYW1lLiBPbmUgaXMgYSBzdWJzdHJpbmcgb2YgdGhlIG90aGVyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHNob3dOYW1lICYmICFzaG93UGF0aCAmJiBub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCJOYW1lOiBcIiArIG5vZGUubmFtZSArIFwiIFt1aWQ9XCIgKyBub2RlLnVpZCArIFwiXVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJoZWFkZXItdGV4dFwiXHJcbiAgICAgICAgICAgIH0sIGhlYWRlclRleHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlclRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFBlZ2Rvd24gbWFya2Rvd24gcHJvY2Vzc29yIHdpbGwgY3JlYXRlIDxjb2RlPiBibG9ja3MgYW5kIHRoZSBjbGFzcyBpZiBwcm92aWRlZCwgc28gaW4gb3JkZXIgdG8gZ2V0IGdvb2dsZVxyXG4gICAgICAgICAqIHByZXR0aWZpZXIgdG8gcHJvY2VzcyBpdCB0aGUgcmVzdCBvZiB0aGUgd2F5ICh3aGVuIHdlIGNhbGwgcHJldHR5UHJpbnQoKSBmb3IgdGhlIHdob2xlIHBhZ2UpIHdlIG5vdyBydW5cclxuICAgICAgICAgKiBhbm90aGVyIHN0YWdlIG9mIHRyYW5zZm9ybWF0aW9uIHRvIGdldCB0aGUgPHByZT4gdGFnIHB1dCBpbiB3aXRoICdwcmV0dHlwcmludCcgZXRjLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0Q29kZUZvcm1hdHRpbmcgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAgICAgLy8gYGBganNcclxuICAgICAgICAgICAgLy8gdmFyIHggPSAxMDtcclxuICAgICAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIGlmIChjb250ZW50LmNvbnRhaW5zKFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0U3Vic3RpdHV0aW9ucyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50LnJlcGxhY2VBbGwoXCJ7e2xvY2F0aW9uT3JpZ2lufX1cIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMTogbmVlZCB0byBwcm92aWRlIHNvbWUgd2F5IG9mIGhhdmluZyB0aGVzZSBsYW5ndWFnZSB0eXBlcyBjb25maWd1cmFibGUgaW4gYSBwcm9wZXJ0aWVzIGZpbGVcclxuICAgICAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGxhbmdzID0gW1wianNcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGUgY2xhc3M9XFxcIlwiICsgbGFuZ3NbaV0gKyBcIlxcXCI+XCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8P3ByZXR0aWZ5IGxhbmc9XCIgKyBsYW5nc1tpXSArIFwiPz48cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZT5cIiwgXCI8cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZnRlciBhIHByb3BlcnR5LCBvciBub2RlIGlzIHVwZGF0ZWQgKHNhdmVkKSB3ZSBjYW4gbm93IGNhbGwgdGhpcyBtZXRob2QgaW5zdGVhZCBvZiByZWZyZXNoaW5nIHRoZSBlbnRpcmUgcGFnZVxyXG4gICAgICAgIHdoaWNoIGlzIHdoYXQncyBkb25lIGluIG1vc3Qgb2YgdGhlIGFwcCwgd2hpY2ggaXMgbXVjaCBsZXNzIGVmZmljaWVudCBhbmQgc25hcHB5IHZpc3VhbGx5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTm9kZU9uUGFnZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIGxvb2t1cCB1aWQgZnJvbSBOb2RlSW5mby5pZCB0aGVuIHNldCB0aGUgY29udGVudCBvZiB0aGlzIGRpdi5cclxuICAgICAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAvL3RvIHRoZSB2YWx1ZSBmcm9tIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1ldGE2NC5pZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlSWQgXCIgKyBub2RlLmlkICsgXCIgaW4gdWlkIG1hcFwiO1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodWlkICE9IG5vZGUudWlkKSB0aHJvdyBcInVpZCBjaGFuZ2VkIHVuZXhwZWN0bHkgYWZ0ZXIgaW5pdE5vZGVcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAgICAgKiBhcHAgYW5kIGlzIHdoYXQgdGhlIHVzZXIgc2VlcyBjb3ZlcmluZyA5MCUgb2YgdGhlIHNjcmVlbiBtb3N0IG9mIHRoZSB0aW1lLiBUaGUgXCJjb250ZW50KiBub2Rlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVDb250ZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGgsIHNob3dOYW1lLCByZW5kZXJCaW4sIHJvd1N0eWxpbmcsIHNob3dIZWFkZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSBnZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zaG93TWV0YURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gYnVpbGRSb3dIZWFkZXIobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd1Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbnRlbnRQcm9wOiBcIiArIGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudDogc3RyaW5nID0gcHJvcHMucmVuZGVyUHJvcGVydHkoY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQgPSBcIjxkaXY+XCIgKyBqY3JDb250ZW50ICsgXCI8L2Rpdj5cIlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoamNyQ29udGVudC5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnNlcnZlck1hcmtkb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkIHVzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoQWxzbyBuZWVkIHRvIG1ha2UgdGhpcyBhIGNvbmZpZ3VyYWJsZSBvcHRpb24sIGJlY2F1c2Ugb3RoZXIgY2xvbmVzIG9mIG1ldGE2NCBkb24ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3YW50IG15IGdpdGh1YiBsaW5rISlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIGRlY2lkZWQgZm9yIG5vdyBJIGRvbid0IHdhbnQgdG8gc2hvdyB0aGUgZm9yay1tZS1vbi1naXRodWIgaW1hZ2UgYXQgdXBwZXIgcmlnaHQgb2YgYXBwLCBidXQgdW5jb21tZW50aW5nIHRoaXMgbGluZSBpcyBhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoYXQncyByZXF1aXJlZCB0byBicmluZyBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1wiPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZycgY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIitcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSBzcGVudCBob3VycyB0cnlpbmcgdG8gZ2V0IG1hcmtlZC1lbGVtZW50IHRvIHdvcmsuIFVuc3VjY2Vzc2Z1bCBzdGlsbCwgc28gSSBqdXN0IGhhdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogc2VydmVyTWFya2Rvd24gZmxhZyB0aGF0IEkgY2FuIHNldCB0byB0cnVlLCBhbmQgdHVybiB0aGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIG9mZiBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogYWx0ZXJuYXRlIGF0dHJpYnV0ZSB3YXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnQgPSBqY3JDb250ZW50LnJlcGxhY2VBbGwoXCInXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInt7cXVvdH19XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2Rvd249J1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICsgXCInPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwgamNyLWNvbnRlbnQnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPC9kaXY+PC9tYXJrZWQtZWxlbWVudD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwic2NyaXB0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dC9tYXJrZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb2JhYmx5IGNvdWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8ZGl2PltObyBDb250ZW50IFRleHRdPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzOiBzdHJpbmcgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogaWYgKGpjckNvbnRlbnQubGVuZ3RoID4gMCkgeyBpZiAocm93U3R5bGluZykgeyByZXQgKz0gdGFnKFwiZGl2XCIsIHsgXCJjbGFzc1wiIDogXCJqY3ItY29udGVudFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICogamNyQ29udGVudCk7IH0gZWxzZSB7IHJldCArPSB0YWcoXCJkaXZcIiwgeyBcImNsYXNzXCIgOiBcImpjci1yb290LWNvbnRlbnRcIiB9LCAvLyBwcm9iYWJseSBjb3VsZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yIHRoaXMgLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLiBcIjxhXHJcbiAgICAgICAgICAgICAgICAgICAgICogaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZydcclxuICAgICAgICAgICAgICAgICAgICAgKiBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiICsgamNyQ29udGVudCk7IH0gfVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXRoLnRyaW0oKSA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCJSb290IE5vZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPGRpdj5bTm8gQ29udGVudCBQcm9wZXJ0eV08L2Rpdj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydGllczogc3RyaW5nID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJCaW4gJiYgbm9kZS5oYXNCaW5hcnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBiaW5hcnk6IHN0cmluZyA9IHJlbmRlckJpbmFyeShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogV2UgYXBwZW5kIHRoZSBiaW5hcnkgaW1hZ2Ugb3IgcmVzb3VyY2UgbGluayBlaXRoZXIgYXQgdGhlIGVuZCBvZiB0aGUgdGV4dCBvciBhdCB0aGUgbG9jYXRpb24gd2hlcmVcclxuICAgICAgICAgICAgICAgICAqIHRoZSB1c2VyIGhhcyBwdXQge3tpbnNlcnQtYXR0YWNobWVudH19IGlmIHRoZXkgYXJlIHVzaW5nIHRoYXQgdG8gbWFrZSB0aGUgaW1hZ2UgYXBwZWFyIGluIGEgc3BlY2lmaWNcclxuICAgICAgICAgICAgICAgICAqIGxvY2F0aW8gaW4gdGhlIGNvbnRlbnQgdGV4dC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldC5jb250YWlucyhjbnN0LklOU0VSVF9BVFRBQ0hNRU5UKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldC5yZXBsYWNlQWxsKGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQsIGJpbmFyeSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBiaW5hcnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0YWdzOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5UQUdTLCBub2RlKTtcclxuICAgICAgICAgICAgaWYgKHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0YWdzLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJUYWdzOiBcIiArIHRhZ3MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBwcmltYXJ5IG1ldGhvZCBmb3IgcmVuZGVyaW5nIGVhY2ggbm9kZSAobGlrZSBhIHJvdykgb24gdGhlIG1haW4gSFRNTCBwYWdlIHRoYXQgZGlzcGxheXMgbm9kZVxyXG4gICAgICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBub2RlLnVpZDtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDE7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IGluZGV4IDwgY291bnQgLSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLiBidWc/XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbiA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSBlZGl0aW5nQWxsb3dlZD1cIitlZGl0aW5nQWxsb3dlZCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICAgICAqIGNsaWNrZWQgb24gZm9yIHRoaXMgcGFnZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAgICAgLy8gK1wiXT09W1wiKyBub2RlLmlkICsgXCJdXCIpXHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25CYXJIdG1sUmV0OiBzdHJpbmcgPSBtYWtlUm93QnV0dG9uQmFySHRtbChub2RlLCBjYW5Nb3ZlVXAsIGNhbk1vdmVEb3duLCBlZGl0aW5nQWxsb3dlZCk7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3NzSWQ6IHN0cmluZyA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLCAvL1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dOb2RlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aC5zdHJpcElmU3RhcnRzV2l0aChcIi9yb290XCIpO1xyXG4gICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyBwYXRoO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZTogc3RyaW5nID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwiamNyOnV1aWRcIiwgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobWVzc2FnZSwgXCJVUkwgb2YgTm9kZVwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUb3BSaWdodEltYWdlVGFnID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLnRvcC5yaWdodCcsIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgdG9wUmlnaHRJbWdUYWc6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh0b3BSaWdodEltZykge1xyXG4gICAgICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0b3AtcmlnaHQtaW1hZ2VcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3BSaWdodEltZ1RhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZzogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcubm9kZS5ia2cnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGJrZ0ltZ1N0eWxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgICAgICBia2dJbWdTdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiICsgYmtnSW1nICsgXCIpO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBia2dJbWdTdHlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2VudGVyZWRCdXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zPzogc3RyaW5nLCBjbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidXR0b25CYXIgPSBmdW5jdGlvbihidXR0b25zOiBzdHJpbmcsIGNsYXNzZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxlZnQtanVzdGlmaWVkIGxheW91dCBcIiArIGNsYXNzZXNcclxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VSb3dCdXR0b25CYXJIdG1sID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgY2FuTW92ZVVwOiBib29sZWFuLCBjYW5Nb3ZlRG93bjogYm9vbGVhbiwgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IHB1YmxpY0FwcGVuZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3BlbkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHNlbEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBlZGl0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1vdmVOb2RlVXBCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZURvd25CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBpbnNlcnROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTaG93IFJlcGx5IGJ1dHRvbiBpZiB0aGlzIGlzIGEgcHVibGljbHkgYXBwZW5kYWJsZSBub2RlIGFuZCBub3QgY3JlYXRlZCBieSBjdXJyZW50IHVzZXIsXHJcbiAgICAgICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiIC8vXHJcbiAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBidXR0b25Db3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8qIENvbnN0cnVjdCBPcGVuIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZUhhc0NoaWxkcmVuKG5vZGUudWlkKSkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBvcGVuQnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIGRlZGljYXRpbmcgc2V2ZXJhbCBob3VycyB0cnlpbmcgdG8gZmlndXJlIG91dCB3aHkgSSdtIHN0aWxsIGJhZmZsZWQuIEkgY2hlY2tlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgaHVuZHJlZCB0aW1lcyBhbmQgc3RpbGwgZG9uJ3Qga25vdyB3aGF0IEknbSBkb2luZyB3cm9uZy4uLkkganVzdCBmaW5hbGx5IHB1dCB0aGUgZ29kIGRhbW4gZnVja2luZyBzdHlsZSBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJiYWNrZ3JvdW5kLWNvbG9yOiAjNGNhZjUwO2NvbG9yOndoaXRlO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2Lm9wZW5Ob2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIi8vXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIk9wZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGluIGVkaXQgbW9kZSB3ZSBhbHdheXMgYXQgbGVhc3QgY3JlYXRlIHRoZSBwb3RlbnRpYWwgKGJ1dHRvbnMpIGZvciBhIHVzZXIgdG8gaW5zZXJ0IGNvbnRlbnQsIGFuZCBpZlxyXG4gICAgICAgICAgICAgKiB0aGV5IGRvbid0IGhhdmUgcHJpdmlsZWdlcyB0aGUgc2VydmVyIHNpZGUgc2VjdXJpdHkgd2lsbCBsZXQgdGhlbSBrbm93LiBJbiB0aGUgZnV0dXJlIHdlIGNhbiBhZGQgbW9yZVxyXG4gICAgICAgICAgICAgKiBpbnRlbGxpZ2VuY2UgdG8gd2hlbiB0byBzaG93IHRoZXNlIGJ1dHRvbnMgb3Igbm90LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRWRpdGluZyBhbGxvd2VkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gbWV0YTY0LnNlbGVjdGVkTm9kZXNbbm9kZS51aWRdID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIG5vZGVJZCBcIiArIG5vZGUudWlkICsgXCIgc2VsZWN0ZWQ9XCIgKyBzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjc3M6IE9iamVjdCA9IHNlbGVjdGVkID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYudG9nZ2xlTm9kZVNlbCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjaGVja2VkXCI6IFwiY2hlY2tlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vcGFkZGluZyBpcyBhIGJhY2sgaGFjayB0byBtYWtlIGNoZWNrYm94IGxpbmUgdXAgd2l0aCBvdGhlciBpY29ucy5cclxuICAgICAgICAgICAgICAgICAgICAvLyhpIHdpbGwgcHJvYmFibHkgZW5kIHVwIHVzaW5nIGEgcGFwZXItaWNvbi1idXR0b24gdGhhdCB0b2dnbGVzIGhlcmUsIGluc3RlYWQgb2YgY2hlY2tib3gpXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi10b3A6IDExcHg7XCJcclxuICAgICAgICAgICAgICAgIH0gOiAvL1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLnVpZCArIFwiX3NlbFwiLC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYudG9nZ2xlTm9kZVNlbCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxCdXR0b24gPSB0YWcoXCJwYXBlci1jaGVja2JveFwiLCBjc3MsIFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0Lk5FV19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmUtYWx0XCIsIC8vXCJpY29uczptb3JlLXZlcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuSU5TX09OX1RPT0xCQVIgJiYgIWNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydE5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZVwiLCAvL1wiaWNvbnM6bW9yZS1ob3JpelwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQuaW5zZXJ0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkluc1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9Qb2xtZXIgSWNvbnMgUmVmZXJlbmNlOiBodHRwczovL2VsZW1lbnRzLnBvbHltZXItcHJvamVjdC5vcmcvZWxlbWVudHMvaXJvbi1pY29ucz92aWV3PWRlbW86ZGVtby9pbmRleC5odG1sXHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwgLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWx0XCI6IFwiRWRpdCBub2RlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJ1bkVkaXROb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRWRpdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5NT1ZFX1VQRE9XTl9PTl9UT09MQkFSICYmIG1ldGE2NC5jdXJyZW50Tm9kZS5jaGlsZHJlbk9yZGVyZWQgJiYgIWNvbW1lbnRCeSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZVVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVVcEJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LXVwd2FyZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0Lm1vdmVOb2RlVXAoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiVXBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZURvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZURvd25CdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy1kb3dud2FyZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0Lm1vdmVOb2RlRG93bignXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXCJEblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGkgd2lsbCBiZSBmaW5kaW5nIGEgcmV1c2FibGUvRFJZIHdheSBvZiBkb2luZyB0b29sdG9wcyBzb29uLCB0aGlzIGlzIGp1c3QgbXkgZmlyc3QgZXhwZXJpbWVudC5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogSG93ZXZlciB0b29sdGlwcyBBTFdBWVMgY2F1c2UgcHJvYmxlbXMuIE15c3RlcnkgZm9yIG5vdy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBpbnNlcnROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJJTlNFUlRTIGEgbmV3IG5vZGUgYXQgdGhlIGN1cnJlbnQgdHJlZSBwb3NpdGlvbi4gQXMgYSBzaWJsaW5nIG9uIHRoaXMgbGV2ZWwuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFkZE5vZGVUb29sdGlwOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAvL1x0XHRcdCB0YWcoXCJwYXBlci10b29sdGlwXCIsIHtcclxuICAgICAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgICAgICAvL1x0XHRcdCB9LCBcIkFERFMgYSBuZXcgbm9kZSBpbnNpZGUgdGhlIGN1cnJlbnQgbm9kZSwgYXMgYSBjaGlsZCBvZiBpdC5cIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsQnV0dG9uczogc3RyaW5nID0gc2VsQnV0dG9uICsgb3BlbkJ1dHRvbiArIGluc2VydE5vZGVCdXR0b24gKyBjcmVhdGVTdWJOb2RlQnV0dG9uICsgaW5zZXJ0Tm9kZVRvb2x0aXBcclxuICAgICAgICAgICAgICAgICsgYWRkTm9kZVRvb2x0aXAgKyBlZGl0Tm9kZUJ1dHRvbiArIG1vdmVOb2RlVXBCdXR0b24gKyBtb3ZlTm9kZURvd25CdXR0b24gKyByZXBseUJ1dHRvbjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhbGxCdXR0b25zLmxlbmd0aCA+IDAgPyBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMpIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcml6b250YWxGaWVsZFNldCA9IGZ1bmN0aW9uKGNvbnRlbnQ/OiBzdHJpbmcsIGV4dHJhQ2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3cgYnVpbGQgZW50aXJlIGNvbnRyb2wgYmFyICovXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwgLy9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIiArIChleHRyYUNsYXNzZXMgPyAoXCIgXCIgKyBleHRyYUNsYXNzZXMpIDogXCJcIilcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSG9yekNvbnRyb2xHcm91cCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCJcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VSYWRpb0J1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcclxuICAgICAgICAgICAgfSwgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5vZGVJZCAoc2VlIG1ha2VOb2RlSWQoKSkgTm9kZUluZm8gb2JqZWN0IGhhcyAnaGFzQ2hpbGRyZW4nIHRydWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVIYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gbm9kZUhhc0NoaWxkcmVuOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmb3JtYXRQYXRoID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBub2RlLnBhdGg7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlQWxsKFwiL1wiLCBcIiAvIFwiKTtcclxuICAgICAgICAgICAgbGV0IHNob3J0UGF0aDogc3RyaW5nID0gcGF0aC5sZW5ndGggPCA1MCA/IHBhdGggOiBwYXRoLnN1YnN0cmluZygwLCA0MCkgKyBcIi4uLlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vUm9vdFBhdGg6IHN0cmluZyA9IHNob3J0UGF0aDtcclxuICAgICAgICAgICAgaWYgKG5vUm9vdFBhdGguc3RhcnRzV2l0aChcIi9yb290XCIpKSB7XHJcbiAgICAgICAgICAgICAgICBub1Jvb3RQYXRoID0gbm9Sb290UGF0aC5zdWJzdHJpbmcoMCwgNSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IG1ldGE2NC5pc0FkbWluVXNlciA/IHNob3J0UGF0aCA6IG5vUm9vdFBhdGg7XHJcbiAgICAgICAgICAgIHJldCArPSBcIiBbXCIgKyBub2RlLnByaW1hcnlUeXBlTmFtZSArIFwiXVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cmFwSHRtbCA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxkaXY+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVuZGVycyBwYWdlIGFuZCBhbHdheXMgYWxzbyB0YWtlcyBjYXJlIG9mIHNjcm9sbGluZyB0byBzZWxlY3RlZCBub2RlIGlmIHRoZXJlIGlzIG9uZSB0byBzY3JvbGwgdG9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclBhZ2VGcm9tRGF0YSA9IGZ1bmN0aW9uKGRhdGE/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtNjQucmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld0RhdGE6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoXCJObyBjb250ZW50IGlzIGF2YWlsYWJsZSBoZXJlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmlkZW50VG9VaWRNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogSSdtIGNob29zaW5nIHRvIHJlc2V0IHNlbGVjdGVkIG5vZGVzIHdoZW4gYSBuZXcgcGFnZSBsb2FkcywgYnV0IHRoaXMgaXMgbm90IGEgcmVxdWlyZW1lbnQuIEkganVzdFxyXG4gICAgICAgICAgICAgICAgICogZG9uJ3QgaGF2ZSBhIFwiY2xlYXIgc2VsZWN0aW9uc1wiIGZlYXR1cmUgd2hpY2ggd291bGQgYmUgbmVlZGVkIHNvIHVzZXIgaGFzIGEgd2F5IHRvIGNsZWFyIG91dC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShkYXRhLm5vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNldEN1cnJlbnROb2RlRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMgPyBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFTkRFUiBOT0RFOiBcIiArIGRhdGEubm9kZS5pZCArIFwiIHByb3BDb3VudD1cIiArIHByb3BDb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBvdXRwdXQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUoZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE5PVEU6IG1haW5Ob2RlQ29udGVudCBpcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhZ2UgY29udGVudCwgYW5kIGlzIGFsd2F5cyB0aGUgbm9kZSBkaXNwbGF5ZWQgYXQgdGhlIHRvXHJcbiAgICAgICAgICAgICAqIG9mIHRoZSBwYWdlIGFib3ZlIGFsbCB0aGUgb3RoZXIgbm9kZXMgd2hpY2ggYXJlIGl0cyBjaGlsZCBub2Rlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBtYWluTm9kZUNvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtYWluTm9kZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uQmFyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVkaXROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRhLm5vZGUucGF0aD1cIitkYXRhLm5vZGUucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWROb2RlKGRhdGEubm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB1YmxpY0FwcGVuZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5yZXBseVRvQ29tbWVudCgnXCIgKyBkYXRhLm5vZGUudWlkICsgXCInKTtcIiAvL1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgY25zdC5ORVdfT05fVE9PTEJBUiAmJiBlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL2ljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcImlkXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJ1wiICsgdWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIEFkZCBlZGl0IGJ1dHRvbiBpZiBlZGl0IG1vZGUgYW5kIHRoaXMgaXNuJ3QgdGhlIHJvb3QgKi9cclxuICAgICAgICAgICAgICAgIGlmIChlZGl0LmlzRWRpdEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdE5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImVkaXRvcjptb2RlLWVkaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucnVuRWRpdE5vZGUoJ1wiICsgdWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRWRpdFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZDtcclxuICAgICAgICAgICAgICAgIC8vIHZhciByb3dIZWFkZXIgPSBidWlsZFJvd0hlYWRlcihkYXRhLm5vZGUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjcmVhdGVTdWJOb2RlQnV0dG9uIHx8IGVkaXROb2RlQnV0dG9uIHx8IHJlcGx5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gbWFrZUhvcml6b250YWxGaWVsZFNldChjcmVhdGVTdWJOb2RlQnV0dG9uICsgZWRpdE5vZGVCdXR0b24gKyByZXBseUJ1dHRvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoc2VsZWN0ZWQgPyBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGFjdGl2ZS1yb3dcIiA6IFwibWFpbk5vZGVDb250ZW50U3R5bGUgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5uYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQmFyICsgbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKGNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGZvcmNlIGFsbCBsaW5rcyB0byBvcGVuIGEgbmV3IHdpbmRvdy90YWIgKi9cclxuICAgICAgICAgICAgICAgIC8vJChcImFcIikuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTsgPC0tLS0gdGhpcyBkb2Vzbid0IHdvcmsuXHJcbiAgICAgICAgICAgICAgICAvLyAkKCcjbWFpbk5vZGVDb250ZW50JykuZmluZChcImFcIikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAkKHRoaXMpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ1cGRhdGUgc3RhdHVzIGJhci5cIik7XHJcbiAgICAgICAgICAgIHZpZXcudXBkYXRlU3RhdHVzQmFyKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRDb3VudDogbnVtYmVyID0gZGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoaWxkQ291bnQ6IFwiICsgY2hpbGRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvblxyXG4gICAgICAgICAgICAgICAgICogdGhlIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGRhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdzogc3RyaW5nID0gZ2VuZXJhdGVSb3coaSwgbm9kZSwgbmV3RGF0YSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm93Q291bnQgPT0gMCAmJiAhbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBnZXRFbXB0eVBhZ2VQcm9tcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwibGlzdFZpZXdcIiwgb3V0cHV0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV0dHlQcmludCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVE9ETy0zOiBJbnN0ZWFkIG9mIGNhbGxpbmcgc2NyZWVuU2l6ZUNoYW5nZSBoZXJlIGltbWVkaWF0ZWx5LCBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gc2V0IHRoZSBpbWFnZSBzaXplc1xyXG4gICAgICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAgICAgKiBzZXRIdG1sLCBzbyB0aGF0IGltYWdlcyBhbHdheXMgYXJlIEdVQVJBTlRFRUQgdG8gcmVuZGVyIGNvcnJlY3RseSBpbW1lZGlhdGVseS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdlbmVyYXRlUm93ID0gZnVuY3Rpb24oaTogbnVtYmVyLCBub2RlOiBqc29uLk5vZGVJbmZvLCBuZXdEYXRhOiBib29sZWFuLCBjaGlsZENvdW50OiBudW1iZXIsIHJvd0NvdW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiBSRU5ERVIgUk9XW1wiICsgaSArIFwiXTogbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByb3dDb3VudCsrOyAvLyB3YXJuaW5nOiB0aGlzIGlzIHRoZSBsb2NhbCB2YXJpYWJsZS9wYXJhbWV0ZXJcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlck5vZGVBc0xpc3RJdGVtKG5vZGUsIGksIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3dbXCIgKyByb3dDb3VudCArIFwiXT1cIiArIHJvdyk7XHJcbiAgICAgICAgICAgIHJldHVybiByb3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFVybEZvck5vZGVBdHRhY2htZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb3N0VGFyZ2V0VXJsICsgXCJiaW4vZmlsZS1uYW1lP25vZGVJZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChub2RlLnBhdGgpICsgXCImdmVyPVwiICsgbm9kZS5iaW5WZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZWUgYWxzbzogbWFrZUltYWdlVGFnKCkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFkanVzdEltYWdlU2l6ZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI1wiICsgbm9kZS5pbWdJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IGVsbS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaGVpZ2h0ID0gZWxtLmF0dHIoXCJoZWlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndpZHRoPVwiICsgd2lkdGggKyBcIiBoZWlnaHQ9XCIgKyBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogTmV3IExvZ2ljIGlzIHRyeSB0byBkaXNwbGF5IGltYWdlIGF0IDE1MCUgbWVhbmluZyBpdCBjYW4gZ28gb3V0c2lkZSB0aGUgY29udGVudCBkaXYgaXQncyBpbixcclxuICAgICAgICAgICAgICAgICAgICAgKiB3aGljaCB3ZSB3YW50LCBidXQgdGhlbiB3ZSBhbHNvIGxpbWl0IGl0IHdpdGggbWF4LXdpZHRoIHNvIG9uIHNtYWxsZXIgc2NyZWVuIGRldmljZXMgb3Igc21hbGxcclxuICAgICAgICAgICAgICAgICAgICAgKiB3aW5kb3cgcmVzaXppbmdzIGV2ZW4gb24gZGVza3RvcCBicm93c2VycyB0aGUgaW1hZ2Ugd2lsbCBhbHdheXMgYmUgZW50aXJlbHkgdmlzaWJsZSBhbmQgbm90XHJcbiAgICAgICAgICAgICAgICAgICAgICogY2xpcHBlZC5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbWF4V2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTUwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogRE8gTk9UIERFTEVURSAoZm9yIGEgbG9uZyB0aW1lIGF0IGxlYXN0KSBUaGlzIGlzIHRoZSBvbGQgbG9naWMgZm9yIHJlc2l6aW5nIGltYWdlcyByZXNwb25zaXZlbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIGl0IHdvcmtzIGZpbmUgYnV0IG15IG5ldyBsb2dpYyBpcyBiZXR0ZXIsIHdpdGggbGltaXRpbmcgbWF4IHdpZHRoIGJhc2VkIG9uIHNjcmVlbiBzaXplLiBCdXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBrZWVwIHRoaXMgb2xkIGNvZGUgZm9yIG5vdy4uXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgaGVpZ2h0ID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBJbWFnZSBkb2VzIGZpdCBvbiBzY3JlZW4gc28gcmVuZGVyIGl0IGF0IGl0J3MgZXhhY3Qgc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIG5vZGUud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZWUgYWxzbzogYWRqdXN0SW1hZ2VTaXplKCkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbGV0IHNyYzogc3RyaW5nID0gZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUuaW1nSWQgPSBcImltZ1VpZF9cIiArIG5vZGUudWlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaWYgaW1hZ2Ugd29uJ3QgZml0IG9uIHNjcmVlbiB3ZSB3YW50IHRvIHNpemUgaXQgZG93biB0byBmaXRcclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBZZXMsIGl0IHdvdWxkIGhhdmUgYmVlbiBzaW1wbGVyIHRvIGp1c3QgdXNlIHNvbWV0aGluZyBsaWtlIHdpZHRoPTEwMCUgZm9yIHRoZSBpbWFnZSB3aWR0aCBidXQgdGhlblxyXG4gICAgICAgICAgICAgICAgICogdGhlIGhpZ2h0IHdvdWxkIG5vdCBiZSBzZXQgZXhwbGljaXRseSBhbmQgdGhhdCB3b3VsZCBtZWFuIHRoYXQgYXMgaW1hZ2VzIGFyZSBsb2FkaW5nIGludG8gdGhlIHBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgZWZmZWN0aXZlIHNjcm9sbCBwb3NpdGlvbiBvZiBlYWNoIHJvdyB3aWxsIGJlIGluY3JlYXNpbmcgZWFjaCB0aW1lIHRoZSBVUkwgcmVxdWVzdCBmb3IgYSBuZXdcclxuICAgICAgICAgICAgICAgICAqIGltYWdlIGNvbXBsZXRlcy4gV2hhdCB3ZSB3YW50IGlzIHRvIGhhdmUgaXQgc28gdGhhdCBvbmNlIHdlIHNldCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHNjcm9sbCBhXHJcbiAgICAgICAgICAgICAgICAgKiBwYXJ0aWN1bGFyIHJvdyBpbnRvIHZpZXcsIGl0IHdpbGwgc3RheSB0aGUgY29ycmVjdCBzY3JvbGwgbG9jYXRpb24gRVZFTiBBUyB0aGUgaW1hZ2VzIGFyZSBzdHJlYW1pbmdcclxuICAgICAgICAgICAgICAgICAqIGluIGFzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBzZXQgdGhlIHdpZHRoIHdlIHdhbnQgdG8gZ28gZm9yICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKiBJbWFnZSBkb2VzIGZpdCBvbiBzY3JlZW4gc28gcmVuZGVyIGl0IGF0IGl0J3MgZXhhY3Qgc2l6ZSAqL1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IG5vZGUud2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IG5vZGUuaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZFxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGNyZWF0ZXMgSFRNTCB0YWcgd2l0aCBhbGwgYXR0cmlidXRlcy92YWx1ZXMgc3BlY2lmaWVkIGluIGF0dHJpYnV0ZXMgb2JqZWN0LCBhbmQgY2xvc2VzIHRoZSB0YWcgYWxzbyBpZlxyXG4gICAgICAgICAqIGNvbnRlbnQgaXMgbm9uLW51bGxcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRhZyA9IGZ1bmN0aW9uKHRhZz86IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPVxcXCJcIiArIHYgKyBcIlxcXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIj5cIiArIGNvbnRlbnQgKyBcIjwvXCIgKyB0YWcgKyBcIj5cIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIi8+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VUZXh0QXJlYSA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUVkaXRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVBhc3N3b3JkRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uID0gZnVuY3Rpb24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGF0dHJpYnM6IE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IGNhbGxiYWNrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBkb21JZCBpcyBpZCBvZiBkaWFsb2cgYmVpbmcgY2xvc2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJhY2tCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRvbUlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5tZXRhNjQuY2FuY2VsRGlhbG9nKCdcIiArIGRvbUlkICsgXCInKTtcIiArIGNhbGxiYWNrXHJcbiAgICAgICAgICAgIH0sIHRleHQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd1Byb3BlcnR5VG9EaXNwbGF5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdFtwcm9wTmFtZV0gPT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNSZWFkT25seVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNCaW5hcnlQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYW5pdGl6ZVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBcInNpbXBsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWUgPT09IGpjckNuc3QuQ09OVEVOVCA/IFwiQ29udGVudFwiIDogcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoLmpzXCIpO1xyXG5cclxuLypcclxuICogdG9kby0zOiB0cnkgdG8gcmVuYW1lIHRvICdzZWFyY2gnLCBidXQgcmVtZW1iZXIgeW91IGhhZCBpbmV4cGxpYWJsZSBwcm9ibGVtcyB0aGUgZmlyc3QgdGltZSB5b3UgdHJpZWQgdG8gdXNlICdzZWFyY2gnXHJcbiAqIGFzIHRoZSB2YXIgbmFtZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzcmNoIHtcclxuICAgICAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9zcmNoX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlNlYXJjaCBSZXN1bHRzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVBhZ2VUaXRsZTogc3RyaW5nID0gXCJUaW1lbGluZVwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHNlYXJjaCBoYXMgYmVlbiBkb25lLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyB0aW1lbGluZSBoYXMgYmVlbiBkb25lLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdpbGwgYmUgdGhlIGxhc3Qgcm93IGNsaWNrZWQgb24gKE5vZGVJbmZvLmphdmEgb2JqZWN0KSBhbmQgaGF2aW5nIHRoZSByZWQgaGlnaGxpZ2h0IGJhclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaGlnaGxpZ2h0Um93Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkZW50VG9VaWRNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIHRoZSBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1aWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbnVtU2VhcmNoUmVzdWx0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3JjaC5zZWFyY2hSZXN1bHRzICE9IG51bGwgJiYgLy9cclxuICAgICAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzICE9IG51bGwgJiYgLy9cclxuICAgICAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCAhPSBudWxsID8gLy9cclxuICAgICAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaFRhYkFjdGl2YXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBhIGxvZ2dlZCBpbiB1c2VyIGNsaWNrcyB0aGUgc2VhcmNoIHRhYiwgYW5kIG5vIHNlYXJjaCByZXN1bHRzIGFyZSBjdXJyZW50bHkgZGlzcGxheWluZywgdGhlbiBnbyBhaGVhZFxyXG4gICAgICAgICAgICAgKiBhbmQgb3BlbiB1cCB0aGUgc2VhcmNoIGRpYWxvZy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChudW1TZWFyY2hSZXN1bHRzKCkgPT0gMCAmJiAhbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgc2VhcmNoUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdHNQYW5lbCA9IG5ldyBTZWFyY2hSZXN1bHRzUGFuZWwoKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBzZWFyY2hSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwic2VhcmNoUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZShzZWFyY2hSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB0aW1lbGluZVJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgICAgIGxldCB0aW1lbGluZVJlc3VsdHNQYW5lbCA9IG5ldyBUaW1lbGluZVJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRpbWVsaW5lUmVzdWx0c1BhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB0aW1lbGluZVJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHRpbWVsaW5lUmVzdWx0c1BhbmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogamNyQ25zdC5DT05URU5UXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBqY3JDbnN0LkNPTlRFTlRcclxuICAgICAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRTZWFyY2hOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlID0gZnVuY3Rpb24oZGF0YSwgdmlld05hbWUpIHtcclxuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAgICAgKiBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhLnNlYXJjaFJlc3VsdHMsIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHZpZXdOYW1lLCBvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIGEgc2luZ2xlIGxpbmUgb2Ygc2VhcmNoIHJlc3VsdHMgb24gdGhlIHNlYXJjaCByZXN1bHRzIHBhZ2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhckh0bWwgPSBtYWtlQnV0dG9uQmFySHRtbChcIlwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbC8vXHJcbiAgICAgICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfc3JjaF9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICAgICAgdmFyIGdvdG9CdXR0b24gPSByZW5kZXIubWFrZUJ1dHRvbihcIkdvIHRvIE5vZGVcIiwgdWlkLCBcIm02NC5zcmNoLmNsaWNrU2VhcmNoTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uU2VhcmNoUmVzdWx0Um93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpIHtcclxuICAgICAgICAgICAgdW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0Um93Tm9kZSA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja1NlYXJjaE5vZGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgdWlkIGluIHNlYXJjaCByZXN1bHRzOiBcIiArIHVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUsIHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIHN0eWxpbmcgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgIHZhciBub2RlSWQgPSBoaWdobGlnaHRSb3dOb2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8qIGNoYW5nZSBjbGFzcyBvbiBlbGVtZW50ICovXHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2hhcmUuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc2hhcmUge1xyXG5cclxuICAgICAgICBsZXQgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hhcmluZ05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZVNoYXJpbmcgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFNoYXJpbmdEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaW5kU2hhcmVkTm9kZXMgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNoYXJlZE5vZGVzUmVxdWVzdCwganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlPihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHVzZXIuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXNlciB7XHJcblxyXG4gICAgICAgIGxldCBsb2dvdXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmb3IgdGVzdGluZyBwdXJwb3NlcywgSSB3YW50IHRvIGFsbG93IGNlcnRhaW4gdXNlcnMgYWRkaXRpb25hbCBwcml2aWxlZ2VzLiBBIGJpdCBvZiBhIGhhY2sgYmVjYXVzZSBpdCB3aWxsIGdvXHJcbiAgICAgICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1Rlc3RVc2VyQWNjb3VudCA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJib2JcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gQlJBTkRJTkdfVElUTEU7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlICs9IFwiIC0gXCIgKyByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRPRE8tMzogbW92ZSB0aGlzIGludG8gbWV0YTY0IG1vZHVsZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlSWQgPSByZXMucm9vdE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lID0gcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZSA9IHJlcy5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMgPSByZXMudXNlclByZWZlcmVuY2VzO1xyXG4gICAgICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2hvd01ldGFEYXRhID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5zaG93TWV0YURhdGE7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gc2VydmVyOiBtZXRhNjQuZWRpdE1vZGVPcHRpb249XCIgKyBtZXRhNjQuZWRpdE1vZGVPcHRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuU2lnbnVwUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBTaWdudXBEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogV3JpdGUgYSBjb29raWUgdGhhdCBleHBpcmVzIGluIGEgeWVhciBmb3IgYWxsIHBhdGhzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cml0ZUNvb2tpZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbCk6IHZvaWQge1xyXG4gICAgICAgICAgICAkLmNvb2tpZShuYW1lLCB2YWwsIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgdWdseS4gSXQgaXMgdGhlIGJ1dHRvbiB0aGF0IGNhbiBiZSBsb2dpbiAqb3IqIGxvZ291dC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Mb2dpblBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsb2dpbkRsZzogTG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcucG9wdWxhdGVGcm9tQ29va2llcygpO1xyXG4gICAgICAgICAgICBsb2dpbkRsZy5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hMb2dpbiA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbGxVc3I6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IGNhbGxQd2Q6IHN0cmluZztcclxuICAgICAgICAgICAgbGV0IHVzaW5nQ29va2llczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxvZ2luU2Vzc2lvblJlYWR5ID0gJChcIiNsb2dpblNlc3Npb25SZWFkeVwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gdHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHVzaW5nQ29va2llcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsb2dpblN0YXRlOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgd2UgaGF2ZSBrbm93biBzdGF0ZSBhcyBsb2dnZWQgb3V0LCB0aGVuIGRvIG5vdGhpbmcgaGVyZSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luU3RhdGUgPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXNyOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB3ZDogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuXHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvb2tpZVVzZXI9XCIgKyB1c3IgKyBcIiB1c2luZ0Nvb2tpZXMgPSBcIiArIHVzaW5nQ29va2llcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsbFVzciA9IHVzciA/IHVzciA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4gd2l0aCBuYW1lOiBcIiArIGNhbGxVc3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiBjYWxsVXNyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogY2FsbFB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgY2FsbFVzciwgY2FsbFB3ZCwgdXNpbmdDb29raWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ291dCA9IGZ1bmN0aW9uKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9nb3V0UmVxdWVzdCwganNvbi5Mb2dvdXRSZXNwb25zZT4oXCJsb2dvdXRcIiwge30sIGxvZ291dFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW4gPSBmdW5jdGlvbihsb2dpbkRsZywgdXNyLCBwd2QpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c3IsXHJcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IHB3ZCxcclxuICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpblJlc3BvbnNlKHJlcywgdXNyLCBwd2QsIG51bGwsIGxvZ2luRGxnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUFsbFVzZXJDb29raWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uTG9naW5SZXNwb25zZSwgdXNyPzogc3RyaW5nLCBwd2Q/OiBzdHJpbmcsIHVzaW5nQ29va2llcz86IGJvb2xlYW4sIGxvZ2luRGxnPzogTG9naW5EbGcpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTG9naW5cIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpblJlc3BvbnNlOiB1c3I9XCIgKyB1c3IgKyBcIiBob21lTm9kZU92ZXJyaWRlOiBcIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodXNyICE9IFwiYW5vbnltb3VzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IsIHVzcik7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdELCBwd2QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5EbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlOiBcIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlIGlzIG51bGwuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIHNldCBJRCB0byBiZSB0aGUgcGFnZSB3ZSB3YW50IHRvIHNob3cgdXNlciByaWdodCBhZnRlciBsb2dpbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdXRpbC5lbXB0eVN0cmluZyhyZXMuaG9tZU5vZGVPdmVycmlkZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVPdmVycmlkZT1cIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBsYXN0Tm9kZT1cIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlSWQ9XCIgKyBtZXRhNjQuaG9tZU5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoaWQsIGZhbHNlLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiQ29va2llIGxvZ2luIGZhaWxlZC5cIikpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBibG93IGF3YXkgZmFpbGVkIGNvb2tpZSBjcmVkZW50aWFscyBhbmQgcmVsb2FkIHBhZ2UsIHNob3VsZCByZXN1bHQgaW4gYnJhbmQgbmV3IHBhZ2UgbG9hZCBhcyBhbm9uXHJcbiAgICAgICAgICAgICAgICAgICAgICogdXNlci5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVzIGlzIEpTT04gcmVzcG9uc2Ugb2JqZWN0IGZyb20gc2VydmVyLlxyXG4gICAgICAgIGxldCByZWZyZXNoTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luUmVzcG9uc2VcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHVzZXIuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdmlldy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB2aWV3IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlU3RhdHVzQmFyID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXR1c0xpbmUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCIgU2VsZWN0aW9uczogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQobWV0YTY0LnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIHBhcmFtZXRlciB3aGljaCwgaWYgc3VwcGxpZWQsIHNob3VsZCBiZSB0aGUgaWQgd2Ugc2Nyb2xsIHRvIHdoZW4gZmluYWxseSBkb25lIHdpdGggdGhlXHJcbiAgICAgICAgICogcmVuZGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaFRyZWVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlcz86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlLCB0YXJnZXRJZD86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBhbmQgaWYgc3BlY2lmaWVkIG1ha2VzIHRoZSBwYWdlIHNjcm9sbCB0byBhbmQgaGlnaGxpZ2h0IHRoYXQgbm9kZSB1cG9uIHJlLXJlbmRlcmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlID0gZnVuY3Rpb24obm9kZUlkPzogYW55LCByZW5kZXJQYXJlbnRJZkxlYWY/OiBhbnksIGhpZ2hsaWdodElkPzogYW55LCBpc0luaXRpYWxSZW5kZXI/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0SWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gY3VycmVudFNlbE5vZGUgIT0gbnVsbCA/IGN1cnJlbnRTZWxOb2RlLmlkIDogbm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IHJlbmRlclBhcmVudElmTGVhZiA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoVHJlZVJlc3BvbnNlKHJlcywgaGlnaGxpZ2h0SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0luaXRpYWxSZW5kZXIgJiYgbWV0YTY0LnVybENtZCA9PSBcImFkZE5vZGVcIiAmJiBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuZWRpdE1vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG1ldGE2NC5jdXJyZW50Tm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAgICAgKiBzY3JvbGxUb1RvcCwgYW5kIHRoZW4gc29tZSBvdGhlciBjb2RlIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyBsb2NhdGlvbiBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyLiB0aGVcclxuICAgICAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsbTogYW55ID0gbmF2LmdldFNlbGVjdGVkUG9seUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdG9kby0wOiByZW1vdmVkIG1haW5QYXBlclRhYnMgZnJvbSB2aXNpYmlsaXR5LCBidXQgd2hhdCBjb2RlIHNob3VsZCBnbyBoZXJlIG5vdz9cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IFRoZSBmb2xsb3dpbmcgd2FzIGluIGEgcG9seW1lciBleGFtcGxlIChjYW4gSSB1c2UgdGhpcz8pOiBhcHAuJC5oZWFkZXJQYW5lbE1haW4uc2Nyb2xsVG9Ub3AodHJ1ZSk7XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogbm90IHVzaW5nIG1haW5QYXBlclRhYnMgYW55IGxvbmdlciBzbyBzaHcgc2hvdWxkIGdvIGhlcmUgbm93ID9cclxuICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gICAgIGlmIChzY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgIGxldCBlbG06IGFueSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRFZGl0UGF0aERpc3BsYXlCeUlkID0gZnVuY3Rpb24oZG9tSWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IGVkaXQuZWRpdE5vZGU7XHJcbiAgICAgICAgICAgIGxldCBlOiBhbnkgPSAkKFwiI1wiICsgZG9tSWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGUuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgICAgIGUuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGhEaXNwbGF5ID0gXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMjogRG8gd2UgcmVhbGx5IG5lZWQgSUQgaW4gYWRkaXRpb24gdG8gUGF0aCBoZXJlP1xyXG4gICAgICAgICAgICAgICAgLy8gcGF0aERpc3BsYXkgKz0gXCI8YnI+SUQ6IFwiICsgbm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sYXN0TW9kaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoRGlzcGxheSArPSBcIjxicj5Nb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwocGF0aERpc3BsYXkpO1xyXG4gICAgICAgICAgICAgICAgZS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1NlcnZlckluZm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0U2VydmVySW5mb1JlcXVlc3QsIGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlPihcImdldFNlcnZlckluZm9cIiwge30sIGZ1bmN0aW9uKHJlczoganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhyZXMuc2VydmVySW5mbykpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1lbnVQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZW51UGFuZWwge1xyXG5cclxuICAgICAgICBsZXQgbWFrZVRvcExldmVsTWVudSA9IGZ1bmN0aW9uKHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItc3VibWVudVwiLCB7XHJcbiAgICAgICAgICAgICAgXCJsYWJlbFwiIDogdGl0bGUsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZXRhNjQtbWVudS1oZWFkaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAvL1wiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdFwiXHJcbiAgICAgICAgICAgIH0sIFwiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VTZWNvbmRMZXZlbExpc3QgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZW51LWNvbnRlbnQgc3VibGlzdCBteS1tZW51LXNlY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIC8vLFxyXG4gICAgICAgICAgICAgICAgLy9cIm11bHRpXCI6IFwibXVsdGlcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtZW51SXRlbSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGlja1xyXG4gICAgICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkb21JZDogc3RyaW5nID0gXCJtYWluQXBwTWVudVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvLyBJIGVuZGVkIHVwIG5vdCByZWFsbHkgbGlraW5nIHRoaXMgd2F5IG9mIHNlbGVjdGluZyB0YWJzLiBJIGNhbiBqdXN0IHVzZSBub3JtYWwgcG9seW1lciB0YWJzLlxyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIk1haW5cIiwgXCJtYWluUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdtYWluVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcInNlYXJjaFBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYignc2VhcmNoVGFiTmFtZScpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlRpbWVsaW5lXCIsIFwidGltZWxpbmVQYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ3RpbWVsaW5lVGFiTmFtZScpO1wiKTtcclxuICAgICAgICAgICAgLy8gdmFyIHBhZ2VNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlBhZ2VcIiwgcGFnZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWRpdE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCBcIihuZXcgbTY0LlJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZVwiLCBcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuZGVsZXRlU2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwibTY0LmVkaXQuY2xlYXJTZWxlY3Rpb25zKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW1wb3J0XCIsIFwib3BlbkltcG9ydERsZ1wiLCBcIihuZXcgbTY0LkltcG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRXhwb3J0XCIsIFwib3BlbkV4cG9ydERsZ1wiLCBcIihuZXcgbTY0LkV4cG9ydERsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgZWRpdE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiRWRpdFwiLCBlZGl0TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3V0XCIsIFwibW92ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiUGFzdGVcIiwgXCJmaW5pc2hNb3ZpbmdTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmZpbmlzaE1vdmluZ1NlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBcIiwgXCJtb3ZlTm9kZVVwQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVVcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRvd25cIiwgXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZURvd24oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBUb3BcIiwgXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb1RvcCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcInRvIEJvdHRvbVwiLCBcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVRvQm90dG9tKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciBtb3ZlTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJNb3ZlXCIsIG1vdmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBGaWxlXCIsIFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbUZpbGVEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21VcmxEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGUgQXR0YWNobWVudFwiLCBcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkF0dGFjaFwiLCBhdHRhY2htZW50TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaGFyaW5nTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRWRpdCBOb2RlIFNoYXJpbmdcIiwgXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgXCJtNjQuc2hhcmUuZWRpdE5vZGVTaGFyaW5nKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmluZCBTaGFyZWQgU3Vibm9kZXNcIiwgXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgXCJtNjQuc2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2hhcmVcIiwgc2hhcmluZ01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VhcmNoTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ29udGVudFwiLCBcInNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBtYWtlIGEgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIHRoYXQgZG9lcyBhIHRhZyBzZWFyY2hcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVGFnc1wiLCBcInNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaFRhZ3NEbGcoKSkub3BlbigpO1wiKTtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2VhcmNoXCIsIHNlYXJjaE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVkXCIsIFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1vZGlmaWVkXCIsIFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlNb2RUaW1lKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVGltZWxpbmVcIiwgdGltZWxpbmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVG9nZ2xlIFByb3BlcnRpZXNcIiwgXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBcIm02NC5wcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQucmVmcmVzaCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwibTY0LnJlbmRlci5zaG93Tm9kZVVybCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlByZWZlcmVuY2VzXCIsIFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsIFwiKG5ldyBtNjQuUHJlZnNEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYnVnOiBzZXJ2ZXIgaW5mbyBtZW51IGl0ZW0gaXMgc2hvd2luZyB1cCAoYWx0aG91Z2ggY29ycmVjdGx5IGRpc2FibGVkKSBmb3Igbm9uLWFkbWluIHVzZXJzLlxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTZXJ2ZXIgSW5mb1wiLCBcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIFwibTY0LnZpZXcuc2hvd1NlcnZlckluZm8oKTtcIik7IC8vXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVmlld1wiLCB2aWV3T3B0aW9uc01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgbTY0LkNoYW5nZVBhc3N3b3JkRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYW5hZ2UgQWNjb3VudFwiLCBcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgXCIobmV3IG02NC5NYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJJbnNlcnQgQm9vazogV2FyIGFuZCBQZWFjZVwiLCBcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBcIm02NC5lZGl0Lmluc2VydEJvb2tXYXJBbmRQZWFjZSgpO1wiKTsgLy9cclxuICAgICAgICAgICAgLy8gbWVudUl0ZW0oXCJGdWxsIFJlcG9zaXRvcnkgRXhwb3J0XCIsIFwiZnVsbFJlcG9zaXRvcnlFeHBvcnRcIiwgXCJcclxuICAgICAgICAgICAgLy8gZWRpdC5mdWxsUmVwb3NpdG9yeUV4cG9ydCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1haW4gTWVudSBIZWxwXCIsIFwibWFpbk1lbnVIZWxwXCIsIFwibTY0Lm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAvKiBwYWdlTWVudSsgKi8gZWRpdE1lbnUgKyBtb3ZlTWVudSArIGF0dGFjaG1lbnRNZW51ICsgc2hhcmluZ01lbnUgKyB2aWV3T3B0aW9uc01lbnUgKyBzZWFyY2hNZW51ICsgdGltZWxpbmVNZW51ICsgbXlBY2NvdW50TWVudVxyXG4gICAgICAgICAgICAgICAgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBEaWFsb2dCYXNlLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICAvKlxuICAgICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBkaWFsb2cgYm94ZXMuXG4gICAgICpcbiAgICAgKiB0b2RvOiB3aGVuIHJlZmFjdG9yaW5nIGFsbCBkaWFsb2dzIHRvIHRoaXMgbmV3IGJhc2UtY2xhc3MgZGVzaWduIEknbSBhbHdheXNcbiAgICAgKiBjcmVhdGluZyBhIG5ldyBkaWFsb2cgZWFjaCB0aW1lLCBzbyB0aGUgbmV4dCBvcHRpbWl6YXRpb24gd2lsbCBiZSB0byBtYWtlXG4gICAgICogY2VydGFpbiBkaWFsb2dzIChpbmRlZWQgbW9zdCBvZiB0aGVtKSBiZSBhYmxlIHRvIGJlaGF2ZSBhcyBzaW5nbGV0b25zIG9uY2VcbiAgICAgKiB0aGV5IGhhdmUgYmVlbiBjb25zdHJ1Y3RlZCB3aGVyZSB0aGV5IG1lcmVseSBoYXZlIHRvIGJlIHJlc2hvd24gYW5kXG4gICAgICogcmVwb3B1bGF0ZWQgdG8gcmVvcGVuIG9uZSBvZiB0aGVtLCBhbmQgY2xvc2luZyBhbnkgb2YgdGhlbSBpcyBtZXJlbHkgZG9uZSBieVxuICAgICAqIG1ha2luZyB0aGVtIGludmlzaWJsZS5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgZGF0YTogYW55O1xuICAgICAgICBidWlsdDogYm9vbGVhbjtcbiAgICAgICAgZ3VpZDogc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkb21JZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7fTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFdlIHJlZ2lzdGVyICd0aGlzJyBzbyB3ZSBjYW4gZG8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZCBpbiBvbkNsaWNrIG1ldGhvZHNcbiAgICAgICAgICAgICAqIG9uIHRoZSBkaWFsb2cgYW5kIGJlIGFibGUgdG8gaGF2ZSAndGhpcycgYXZhaWxhYmxlIHRvIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgZW5jb2RlZCBpbiBvbkNsaWNrIG1ldGhvZHNcbiAgICAgICAgICAgICAqIGFzIHN0cmluZ3MuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcyk7XG4gICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMuZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgdG8gaW5pdGlhbGl6ZSB0aGUgY29udGVudCBvZiB0aGUgZGlhbG9nIHdoZW4gaXQncyBkaXNwbGF5ZWQsIGFuZCBzaG91bGQgYmUgdGhlIHBsYWNlIHdoZXJlXG4gICAgICAgIGFueSBkZWZhdWx0cyBvciB2YWx1ZXMgaW4gZm9yIGZpZWxkcywgZXRjLiBzaG91bGQgYmUgc2V0IHdoZW4gdGhlIGRpYWxvZyBpcyBkaXNwbGF5ZWQgKi9cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBnZXQgY29udGFpbmVyIHdoZXJlIGFsbCBkaWFsb2dzIGFyZSBjcmVhdGVkICh0cnVlIHBvbHltZXIgZGlhbG9ncylcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIG1vZGFsc0NvbnRhaW5lciA9IHV0aWwucG9seUVsbShcIm1vZGFsc0NvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgLyogc3VmZml4IGRvbUlkIGZvciB0aGlzIGluc3RhbmNlL2d1aWQgKi9cbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUT0RPLiBJTVBPUlRBTlQ6IG5lZWQgdG8gcHV0IGNvZGUgaW4gdG8gcmVtb3ZlIHRoaXMgZGlhbG9nIGZyb20gdGhlIGRvbVxuICAgICAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICAgICAqIG1hcCBpbiB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgICAgIC8vTk9URTogVGhpcyB3b3JrcywgYnV0IGlzIGFuIGV4YW1wbGUgb2Ygd2hhdCBOT1QgdG8gZG8gYWN0dWFsbHkuIEluc3RlYWQgYWx3YXlzXG4gICAgICAgICAgICAvL3NldCB0aGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSAncG9seUVsbS5ub2RlJyBiZWxvdy5cbiAgICAgICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XG4gICAgICAgICAgICBtb2RhbHNDb250YWluZXIubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5ib3JkZXIgPSBcIjNweCBzb2xpZCBncmF5XCI7XG5cbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGlhbG9nOiBcIiArIGlkKTtcblxuICAgICAgICAgICAgLyogbm93IG9wZW4gYW5kIGRpc3BsYXkgcG9seW1lciBkaWFsb2cgd2UganVzdCBjcmVhdGVkICovXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbShpZCk7XG5cbiAgICAgICAgICAgIC8vQWZ0ZXIgdGhlIFR5cGVTY3JpcHQgY29udmVyc2lvbiBJIG5vdGljZWQgaGF2aW5nIGEgbW9kYWwgZmxhZyB3aWxsIGNhdXNlXG4gICAgICAgICAgICAvL2FuIGluZmluaXRlIGxvb3AgKGNvbXBsZXRlbHkgaGFuZykgQ2hyb21lIGJyb3dzZXIsIGJ1dCB0aGlzIGlzc3VlIGlzIG1vc3QgbGlrZWx5XG4gICAgICAgICAgICAvL25vdCByZWxhdGVkIHRvIFR5cGVTY3JpcHQgYXQgYWxsLCBidXQgaSdtIGp1c3QgbWVudGlvbiBUUyBqdXN0IGluIGNhc2UsIGJlY2F1c2VcbiAgICAgICAgICAgIC8vdGhhdCdzIHdoZW4gSSBub3RpY2VkIGl0LiBEaWFsb2dzIGFyZSBmaW5lIGJ1dCBub3QgYSBkaWFsb2cgb24gdG9wIG9mIGFub3RoZXIgZGlhbG9nLCB3aGljaCBpc1xuICAgICAgICAgICAgLy90aGUgY2FzZSB3aGVyZSBpdCBoYW5ncyBpZiBtb2RlbD10cnVlXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNlbnRlcigpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG86IG5lZWQgdG8gY2xlYW51cCB0aGUgcmVnaXN0ZXJlZCBJRHMgdGhhdCBhcmUgaW4gbWFwcyBmb3IgdGhpcyBkaWFsb2cgKi9cbiAgICAgICAgY2FuY2VsID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuY2FuY2VsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGdldCB0aGUgdHJ1ZSBpZCB0aGF0IGlzIHNwZWNpZmljIHRvIHRoaXMgZGlhbG9nIChpLmUuIGd1aWRcbiAgICAgICAgICogc3VmZml4IGFwcGVuZGVkKVxuICAgICAgICAgKi9cbiAgICAgICAgaWQgPSAoaWQpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIC8qIGlmIGRpYWxvZyBhbHJlYWR5IHN1ZmZpeGVkICovXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCJfZGxnSWRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQgKyBcIl9kbGdJZFwiICsgdGhpcy5kYXRhLmd1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlUGFzc3dvcmRGaWVsZCh0ZXh0LCB0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU1lc3NhZ2VBcmVhID0gKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaWFsb2ctbWVzc2FnZVwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgICAgIG1ha2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55KTogc3RyaW5nID0+IHtcblxuICAgICAgICAgICAgdmFyIGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAvLyB3YXJuaW5nOiB0aGlzIGRpYWxvZy1jb25maXJtIGlzIHJlcXVpcmVkIChsb2dpYyBmYWlscyB3aXRob3V0KVxuICAgICAgICAgICAgICAgIFwiZGlhbG9nLWNvbmZpcm1cIjogXCJkaWFsb2ctY29uZmlybVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmRFbnRlcktleSA9IChpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRIdG1sID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VSYWRpb0J1dHRvbiA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VDaGVja0JveCA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nLCBpbml0aWFsU3RhdGU6Ym9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuXG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgLy9cIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy9cbi8vICAgICAgICAgICAgIDxwYXBlci1jaGVja2JveCBvbi1jaGFuZ2U9XCJjaGVja2JveENoYW5nZWRcIj5jbGljazwvcGFwZXItY2hlY2tib3g+XG4vL1xuLy8gICAgICAgICAgICAgY2hlY2tib3hDaGFuZ2VkIDogZnVuY3Rpb24oZXZlbnQpe1xuLy8gICAgIGlmKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4vLyAgICAgfVxuLy8gfVxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoZWNrYm94OiBzdHJpbmcgPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgYXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgY2hlY2tib3ggKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiBpZFxuICAgICAgICAgICAgfSwgbGFiZWwsIHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tib3g7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlSGVhZGVyID0gKHRleHQ6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNlbnRlcmVkPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1oZWFkZXIgXCIgKyAoY2VudGVyZWQgPyBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXRcIiA6IFwiXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiaDJcIiwgYXR0cnMsIHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9jdXMgPSAoaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xuICAgICAgICAgICAgICAgIGlkID0gXCIjXCIgKyBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENvbmZpcm1EbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBDb25maXJtRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB0aXRsZTogc3RyaW5nLCBwcml2YXRlIG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZSBidXR0b25UZXh0OiBzdHJpbmcsIHByaXZhdGUgeWVzQ2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICAgcHJpdmF0ZSBub0NhbGxiYWNrPzogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ29uZmlybURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgY29udGVudDogc3RyaW5nID0gdGhpcy5tYWtlSGVhZGVyKFwiXCIsIFwiQ29uZmlybURsZ1RpdGxlXCIpICsgdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJcIiwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlllc1wiLCBcIkNvbmZpcm1EbGdZZXNCdXR0b25cIiwgdGhpcy55ZXNDYWxsYmFjaylcbiAgICAgICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIiwgdGhpcy5ub0NhbGxiYWNrKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy50aXRsZSwgXCJDb25maXJtRGxnVGl0bGVcIik7XG4gICAgICAgICAgICB0aGlzLnNldEh0bWwodGhpcy5tZXNzYWdlLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMuYnV0dG9uVGV4dCwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUHJvZ3Jlc3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJQcm9ncmVzc0RsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUHJvY2Vzc2luZyBSZXF1ZXN0XCIsIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgICAgIFwiaW5kZXRlcm1pbmF0ZVwiOiBcImluZGV0ZXJtaW5hdGVcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiODAwXCIsXG4gICAgICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgICAgICBcIm1heFwiOiBcIjEwMDBcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MjgwcHg7IG1hcmdpbjoyNHB4O1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJhckNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1lc3NhZ2VEbGcuanNcIik7XHJcblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXNzYWdlPzogYW55LCBwcml2YXRlIHRpdGxlPzogYW55LCBwcml2YXRlIGNhbGxiYWNrPzogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWVzc2FnZURsZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gXCJNZXNzYWdlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy50aXRsZSkgKyBcIjxwPlwiICsgdGhpcy5tZXNzYWdlICsgXCI8L3A+XCI7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiT2tcIiwgXCJtZXNzYWdlRGxnT2tCdXR0b25cIiwgdGhpcy5jYWxsYmFjaykpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTG9naW5EbGcuanNcIik7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XG5cbi8qXG5Ob3RlOiBUaGUganF1ZXJ5IGNvb2tpZSBsb29rcyBmb3IganF1ZXJ5IGQudHMgaW4gdGhlIHJlbGF0aXZlIGxvY2F0aW9uIFwiXCIuLi9qcXVlcnlcIiBzbyBiZXdhcmUgaWYgeW91clxudHJ5IHRvIHJlb3JnYW5pemUgdGhlIGZvbGRlciBzdHJ1Y3R1cmUgSSBoYXZlIGluIHR5cGVkZWZzLCB0aGluZ3Mgd2lsbCBjZXJ0YWlubHkgYnJlYWtcbiovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBMb2dpbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiTG9naW5EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkxvZ2luXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdmFyIGxvZ2luQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiTG9naW5cIiwgXCJsb2dpbkJ1dHRvblwiLCB0aGlzLmxvZ2luLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRm9yZ290IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLCB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGxvZ2luQnV0dG9uICsgcmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuICAgICAgICAgICAgdmFyIGRpdmlkZXIgPSBcIjxkaXY+PGgzPk9yIExvZ2luIFdpdGguLi48L2gzPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybSA9IGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gZm9ybTtcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInBhc3N3b3JkXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3B1bGF0ZUZyb21Db29raWVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHVzciA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XG4gICAgICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICAgICAgaWYgKHVzcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB1c3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHB3ZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiLCBwd2QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbG9naW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgICAgICB2YXIgcHdkID0gdGhpcy5nZXRJbnB1dFZhbChcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB1c2VyLmxvZ2luKHRoaXMsIHVzciwgcHdkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogYW55ID0+IHtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gUmVzZXQgUGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICBcIlJlc2V0IHlvdXIgcGFzc3dvcmQgPzxwPllvdSdsbCBzdGlsbCBiZSBhYmxlIHRvIGxvZ2luIHdpdGggeW91ciBvbGQgcGFzc3dvcmQgdW50aWwgdGhlIG5ldyBvbmUgaXMgc2V0LlwiLFxuICAgICAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXouY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgUmVzZXRQYXNzd29yZERsZyh1c3IpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNpZ251cERsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEU7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJzaWdudXBVc2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkNhcHRjaGFcIiwgXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGEtaW1hZ2VcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCJcIi8vXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgICAgIHZhciBzaWdudXBCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaWdudXBcIiwgXCJzaWdudXBCdXR0b25cIiwgdGhpcy5zaWdudXAsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNpZ251cEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBVc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgICAgIHZhciBjYXB0Y2hhID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIC8qIG5vIHJlYWwgdmFsaWRhdGlvbiB5ZXQsIG90aGVyIHRoYW4gbm9uLWVtcHR5ICovXG4gICAgICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNvcnJ5LCB5b3UgY2Fubm90IGxlYXZlIGFueSBmaWVsZHMgYmxhbmsuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TaWdudXBSZXF1ZXN0LGpzb24uU2lnbnVwUmVzcG9uc2U+KFwic2lnbnVwXCIsIHtcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBcImNhcHRjaGFcIjogY2FwdGNoYVxuICAgICAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXBSZXNwb25zZSA9IChyZXM6IGpzb24uU2lnbnVwUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG5cbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJTaWdudXBcIlxuICAgICAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuaWQoXCJzaWdudXBVc2VyTmFtZVwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcmVmc0RsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUHJlZnNEbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUGVmZXJlbmNlc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9uR3JvdXAgPSByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tZ3JvdXBcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgICAgICB9LCByYWRpb0J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrQm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJTaG93IFJvdyBNZXRhZGF0YVwiLCBcInNob3dNZXRhRGF0YVwiLCBtZXRhNjQuc2hvd01ldGFEYXRhKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSByYWRpb0J1dHRvbkdyb3VwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNhdmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJlZmVyZW5jZXNCdXR0b25cIiwgdGhpcy5zYXZlUHJlZmVyZW5jZXMsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHJhZGlvQmFyICsgY2hlY2tib3hCYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tib3ggPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSBzaG93TWV0YURhdGFDaGVja2JveC5ub2RlLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCxcclxuICAgICAgICAgICAgICAgICAgICBcImVkaXRNb2RlXCI6IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdE5vZGVcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IG1ldGE2NC5zaG93TWV0YURhdGFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXNSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogcHV0IHRoZXNlIHR3byBsaW5lcyBpbiBhIHV0aWxpdHkgbWV0aG9kXHJcbiAgICAgICAgICAgIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1hbmFnZUFjY291bnREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZUFjY291bnRCdXR0b24gPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBcIkFkbWluIENhbm5vdCBDbG9zZSBBY291bnRcIiA6IHRoaXMubWFrZUJ1dHRvbihcIkNsb3NlIEFjY291bnRcIiwgXCJjbG9zZUFjY291bnRCdXR0b25cIiwgXCJwcmVmcy5jbG9zZUFjY291bnQoKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJ1dHRvbkJhciArIGJvdHRvbUJ1dHRvbkJhckRpdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRXhwb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRXhwb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFeHBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkV4cG9ydCB0byBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFeHBvcnQgdG8gRmlsZSBOYW1lXCIsIFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEV4cG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoZXhwb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldEZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyh0YXJnZXRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cG9ydFJlcXVlc3QsIGpzb24uRXhwb3J0UmVzcG9uc2U+KFwiZXhwb3J0VG9YbWxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldEZpbGVOYW1lXCI6IHRhcmdldEZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5leHBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uRXhwb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEltcG9ydERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEltcG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiSW1wb3J0RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJJbXBvcnQgZnJvbSBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJGaWxlIG5hbWUgdG8gaW1wb3J0XCIsIFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEltcG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZUZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkltcG9ydFJlcXVlc3QsanNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaENvbnRlbnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaFRhZ3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hUYWdzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSB0YWdzIHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDaGFuZ2VQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5nZVBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIHB3ZDogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJDaGFuZ2VQYXNzd29yZERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiB3aGVyZSBpdCB3aWxsIHZhbGlkYXRlIHRoZSBwYXNzQ29kZSwgYW5kIGlmIGl0J3MgdmFsaWQgdXNlIGl0IHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgcGFzc3dvcmQgY2hhbmdlIG9uIHRoZSBjb3JyZWN0XHJcbiAgICAgICAgICogdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnBhc3NDb2RlID8gXCJQYXNzd29yZCBSZXNldFwiIDogXCJDaGFuZ2UgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgICAgIH0sIFwiRW50ZXIgeW91ciBuZXcgcGFzc3dvcmQgYmVsb3cuLi5cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIk5ldyBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxDaGFuZ2VQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHdkID0gdGhpcy5nZXRJbnB1dFZhbChcImNoYW5nZVBhc3N3b3JkMVwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wd2QgJiYgdGhpcy5wd2QubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNoYW5nZVBhc3N3b3JkUmVxdWVzdCxqc29uLkNoYW5nZVBhc3N3b3JkUmVzcG9uc2U+KFwiY2hhbmdlUGFzc3dvcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibmV3UGFzc3dvcmRcIjogdGhpcy5wd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXNzQ29kZVwiOiB0aGlzLnBhc3NDb2RlXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmNoYW5nZVBhc3N3b3JkUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW52YWxpZCBwYXNzd29yZChzKS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2UgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtc2cgPSBcIlBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiPHA+WW91IG1heSBub3cgbG9naW4gYXMgPGI+XCIgKyByZXMudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICArIFwiPC9iPiB3aXRoIHlvdXIgbmV3IHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2csIFwiUGFzc3dvcmQgQ2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGl6LnBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBsb2dpbiBjYWxsIERPRVMgd29yaywgYnV0IHRoZSByZWFzb24gd2UgZG9uJ3QgZG8gdGhpcyBpcyBiZWNhdXNlIHRoZSBVUkwgc3RpbGwgaGFzIHRoZSBwYXNzQ29kZSBvbiBpdCBhbmQgd2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy93YW50IHRvIGRpcmVjdCB0aGUgdXNlciB0byBhIHVybCB3aXRob3V0IHRoYXQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlci5sb2dpbihudWxsLCByZXMudXNlciwgdGhpei5wd2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFJlc2V0UGFzc3dvcmREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBSZXNldFBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUmVzZXRQYXNzd29yZERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJSZXNldCBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciB5b3VyIHVzZXIgbmFtZSBhbmQgZW1haWwgYWRkcmVzcyBhbmQgYSBjaGFuZ2UtcGFzc3dvcmQgbGluayB3aWxsIGJlIHNlbnQgdG8geW91XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbCBBZGRyZXNzXCIsIFwiZW1haWxBZGRyZXNzXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc2V0UGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlJlc2V0IG15IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVzZXRQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVzZXRQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNldFBhc3N3b3JkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsQWRkcmVzcyA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJlbWFpbEFkZHJlc3NcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVzZXJOYW1lICYmIGVtYWlsQWRkcmVzcykge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVzZXRQYXNzd29yZFJlcXVlc3QsIGpzb24uUmVzZXRQYXNzd29yZFJlc3BvbnNlPihcInJlc2V0UGFzc3dvcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidXNlclwiOiB1c2VyTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5yZXNldFBhc3N3b3JkUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGpzb24uUmVzZXRQYXNzd29yZFJlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlc2V0IHBhc3N3b3JkXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBhc3N3b3JkIHJlc2V0IGVtYWlsIHdhcyBzZW50LiBDaGVjayB5b3VyIGluYm94LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdGhpcy51c2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZpbGVzXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8qIHdyYXAgaW4gRElWIHRvIGZvcmNlIHZlcnRpY2FsIGFsaWduICovXG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi1ib3R0b206IDEwcHg7XCJcbiAgICAgICAgICAgICAgICB9LCBpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVJZFwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLyogYm9vbGVhbiBmaWVsZCB0byBzcGVjaWZ5IGlmIHdlIGV4cGxvZGUgemlwIGZpbGVzIG9udG8gdGhlIEpDUiB0cmVlICovXG4gICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhwbG9kZVppcHNcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWNjb3JkaW5nIHRvIHNvbWUgb25saW5lIHBvc3RzIEkgc2hvdWxkIGhhdmUgbmVlZGVkIGRhdGEtYWpheD1cImZhbHNlXCIgb24gdGhpcyBmb3JtIGJ1dCBpdCBpcyB3b3JraW5nIGFzIGlzXG4gICAgICAgICAgICAgKiB3aXRob3V0IHRoYXQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1cIiksXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJlbmN0eXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuICAgICAgICAgICAgICAgIFwiZGF0YS1hamF4XCI6IFwiZmFsc2VcIiAvLyBORVcgZm9yIG11bHRpcGxlIGZpbGUgdXBsb2FkIHN1cHBvcnQ/Pz9cbiAgICAgICAgICAgIH0sIGZvcm1GaWVsZHMpO1xuXG4gICAgICAgICAgICB1cGxvYWRGaWVsZENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRmllbGRDb250YWluZXJcIilcbiAgICAgICAgICAgIH0sIFwiPHA+VXBsb2FkIGZyb20geW91ciBjb21wdXRlcjwvcD5cIiArIGZvcm0pO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsID0gJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpKS52YWwoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGdW5jID0gKGV4cGxvZGVaaXBzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogVXBsb2FkIGZvcm0gaGFzIGhpZGRlbiBpbnB1dCBlbGVtZW50IGZvciBub2RlSWQgcGFyYW1ldGVyICovXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpKS5hdHRyKFwidmFsdWVcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpKS5hdHRyKFwidmFsdWVcIiwgZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgZG8gc29tZXRoaW5nIGRpZmZlcmVudGx5IGZyb20gdGhlIG5vcm1hbCAndXRpbC5qc29uKCknIGNhbGxzIHRvIHRoZSBzZXJ2ZXIsIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIGhpZ2hseSBzcGVjaWFsaXplZCBoZXJlIGZvciBmb3JtIHVwbG9hZGluZywgYW5kIGlzIGRpZmZlcmVudCBmcm9tIG5vcm1hbCBhamF4IGNhbGxzLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+KCQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSlbMF0pKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm1zID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVwbG9hZCBmYWlsZWQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbVVybERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uVXBsb2FkRnJvbVVybFJlcXVlc3QsIGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlPihcInVwbG9hZEZyb21VcmxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgICAgIH0sIHRoaXMudXBsb2FkRnJvbVVybFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZyb21VcmxSZXNwb25zZSA9IChyZXM6IGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcblxuLypcbiAqIEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGVzKVxuICpcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICAgICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0Tm9kZURsZ1wiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFByb3BlcnR5IGZpZWxkcyBhcmUgZ2VuZXJhdGVkIGR5bmFtaWNhbGx5IGFuZCB0aGlzIG1hcHMgdGhlIERPTSBJRHMgb2YgZWFjaCBmaWVsZCB0byB0aGUgcHJvcGVydHkgb2JqZWN0IGl0XG4gICAgICAgICAgICAgKiBlZGl0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlTm9kZUJ1dHRvblwiLCB0aGlzLnNhdmVOb2RlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBQcm9wZXJ0eVwiLCBcImFkZFByb3BlcnR5QnV0dG9uXCIsIHRoaXMuYWRkUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBUYWdzXCIsIFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUYWdzUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNwbGl0Q29udGVudEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNwbGl0XCIsIFwic3BsaXRDb250ZW50QnV0dG9uXCIsIHRoaXMuc3BsaXRDb250ZW50LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uXG4gICAgICAgICAgICAgICAgKyBzcGxpdENvbnRlbnRCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uLCBcImJ1dHRvbnNcIik7XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIilcbiAgICAgICAgICAgIH0pICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IGNyZWF0ZSBDU1MgY2xhc3MgZm9yIHRoaXMuXG4gICAgICAgICAgICAgICAgc3R5bGU6IFwicGFkZGluZy1sZWZ0OiAwcHg7IHdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsO1wiIC8vIGJvcmRlcjo0cHggc29saWRcbiAgICAgICAgICAgICAgICAvLyBsaWdodEdyYXk7XCJcbiAgICAgICAgICAgIH0sIFwiTG9hZGluZy4uLlwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYWxsIHRoZSBIVE1MIGVkaXQgZmllbGRzIGFuZCBwdXRzIHRoZW0gaW50byB0aGUgRE9NIG1vZGVsIG9mIHRoZSBwcm9wZXJ0eSBlZGl0b3IgZGlhbG9nIGJveC5cbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHBvcHVsYXRlRWRpdE5vZGVQZyA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICAgICAgLyogY2xlYXIgdGhpcyBtYXAgdG8gZ2V0IHJpZCBvZiBvbGQgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcblxuICAgICAgICAgICAgLyogZWRpdE5vZGUgd2lsbCBiZSBudWxsIGlmIHRoaXMgaXMgYSBuZXcgbm9kZSBiZWluZyBjcmVhdGVkICovXG4gICAgICAgICAgICBpZiAoZWRpdC5lZGl0Tm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBleGlzdGluZyBub2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIC8qIGl0ZXJhdG9yIGZ1bmN0aW9uIHdpbGwgaGF2ZSB0aGUgd3JvbmcgJ3RoaXMnIHNvIHdlIHNhdmUgdGhlIHJpZ2h0IG9uZSAqL1xuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZWRpdE9yZGVyZWRQcm9wcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBQcm9wZXJ0eUluZm8uamF2YSBvYmplY3RzXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBXYXJuaW5nIGVhY2ggaXRlcmF0b3IgbG9vcCBoYXMgaXRzIG93biAndGhpcydcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goZWRpdE9yZGVyZWRQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgKiBpZiBwcm9wZXJ0eSBub3QgYWxsb3dlZCB0byBkaXNwbGF5IHJldHVybiB0byBieXBhc3MgdGhpcyBwcm9wZXJ0eS9pdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcC5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZElkID0gdGhpei5pZChcImVkaXROb2RlVGV4dENvbnRlbnRcIiArIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBlZGl0IGZpZWxkIFwiICsgZmllbGRJZCArIFwiIGZvciBwcm9wZXJ0eSBcIiArIHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSBwcm9wLnZhbHVlcyAmJiBwcm9wLnZhbHVlcy5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNSZWFkT25seVByb3AgPSByZW5kZXIuaXNSZWFkT25seVByb3BlcnR5KHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wRW50cnk6IFByb3BFbnRyeSA9IG5ldyBQcm9wRW50cnkoZmllbGRJZCwgcHJvcCwgaXNNdWx0aSwgaXNSZWFkT25seVByb3AsIGlzQmluYXJ5UHJvcCwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpei5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdID0gcHJvcEVudHJ5O1xuICAgICAgICAgICAgICAgICAgICB0aGl6LnByb3BFbnRyaWVzLnB1c2gocHJvcEVudHJ5KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgPSB0aGl6Lm1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIocHJvcCwgZmllbGRJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBidXR0b25CYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZU11bHRpUHJvcEVkaXRvcihwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlU2luZ2xlUHJvcEVkaXRvcihwcm9wRW50cnksIGFjZUZpZWxkcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6ICgoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHx8IGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbUhpZGRlblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJzdHlsZVwiIDogXCJkaXNwbGF5OiBcIisgKCFyZE9ubHkgfHwgbWV0YTY0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcImlubGluZVwiIDogXCJub25lXCIpXG4gICAgICAgICAgICAgICAgICAgIH0sIGZpZWxkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIEVkaXRpbmcgYSBuZXcgbm9kZSAqL1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiB0aGlzIGVudGlyZSBibG9jayBuZWVkcyByZXZpZXcgbm93IChyZWRlc2lnbilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgbmV3IG5vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkSWQgPSB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmV3IE5vZGUgTmFtZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IEkgY2FuIHJlbW92ZSB0aGlzIGRpdiBub3cgP1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7fSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9JJ20gbm90IHF1aXRlIHJlYWR5IHRvIGFkZCB0aGlzIGJ1dHRvbiB5ZXQuXG4gICAgICAgICAgICAvLyB2YXIgdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikudG9nZ2xlU2hvd1JlYWRPbmx5KCk7XCIgLy9cbiAgICAgICAgICAgIC8vIH0sIC8vXG4gICAgICAgICAgICAvLyAgICAgKGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiSGlkZSBSZWFkLU9ubHkgUHJvcGVydGllc1wiIDogXCJTaG93IFJlYWQtT25seSBQcm9wZXJ0aWVzXCIpKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBmaWVsZHMgKz0gdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b247XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksIGZpZWxkcyk7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGFjZUZpZWxkc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShhY2VGaWVsZHNbaV0udmFsLnVuZW5jb2RlSHRtbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmFjZUVkaXRvcnNCeUlkW2FjZUZpZWxkc1tpXS5pZF0gPSBlZGl0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5zdHIgPSBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA/IC8vXG4gICAgICAgICAgICAgICAgXCJZb3UgbWF5IGxlYXZlIHRoaXMgZmllbGQgYmxhbmsgYW5kIGEgdW5pcXVlIElEIHdpbGwgYmUgYXNzaWduZWQuIFlvdSBvbmx5IG5lZWQgdG8gcHJvdmlkZSBhIG5hbWUgaWYgeW91IHdhbnQgdGhpcyBub2RlIHRvIGhhdmUgYSBtb3JlIG1lYW5pbmdmdWwgVVJMLlwiXG4gICAgICAgICAgICAgICAgOiAvL1xuICAgICAgICAgICAgICAgIFwiXCI7XG5cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIikpLmh0bWwoaW5zdHIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3cgYWRkaW5nIG9mIG5ldyBwcm9wZXJ0aWVzIGFzIGxvbmcgYXMgdGhpcyBpcyBhIHNhdmVkIG5vZGUgd2UgYXJlIGVkaXRpbmcsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBzdGFydFxuICAgICAgICAgICAgICogbWFuYWdpbmcgbmV3IHByb3BlcnRpZXMgb24gdGhlIGNsaWVudCBzaWRlLiBXZSBuZWVkIGEgZ2VudWluZSBub2RlIGFscmVhZHkgc2F2ZWQgb24gdGhlIHNlcnZlciBiZWZvcmUgd2UgYWxsb3dcbiAgICAgICAgICAgICAqIGFueSBwcm9wZXJ0eSBlZGl0aW5nIHRvIGhhcHBlbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5QnV0dG9uXCIpLCAhZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgdGFnc1Byb3BFeGlzdHMgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJ0YWdzXCIsIGVkaXQuZWRpdE5vZGUpICE9IG51bGw7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhhc1RhZ3NQcm9wOiBcIiArIHRhZ3NQcm9wKTtcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIiksICF0YWdzUHJvcEV4aXN0cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVTaG93UmVhZE9ubHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvLyBhbGVydChcIm5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAgICAgLy8gc2VlIHNhdmVFeGlzdGluZ05vZGUgZm9yIGhvdyB0byBpdGVyYXRlIGFsbCBwcm9wZXJ0aWVzLCBhbHRob3VnaCBJIHdvbmRlciB3aHkgSSBkaWRuJ3QganVzdCB1c2UgYSBtYXAvc2V0IG9mXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIGVsZW1lbnRzXG4gICAgICAgICAgICAvLyBpbnN0ZWFkIHNvIEkgZG9uJ3QgbmVlZCB0byBwYXJzZSBhbnkgRE9NIG9yIGRvbUlkcyBpbm9yZGVyIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBvZiB0aGVtPz8/P1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3QgPSBuZXcgRWRpdFByb3BlcnR5RGxnKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0Lm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoZWRpdC5lZGl0Tm9kZSwgXCJ0YWdzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJ0YWdzXCIsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogXCJcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLmFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQWRkIFRhZ3MgUHJvcGVydHlcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogTm90ZTogZmllbGRJZCBwYXJhbWV0ZXIgaXMgYWxyZWFkeSBkaWFsb2ctc3BlY2lmaWMgYW5kIGRvZXNuJ3QgbmVlZCBpZCgpIHdyYXBwZXIgZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIG1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIgPSAocHJvcDogYW55LCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XG5cbiAgICAgICAgICAgIHZhciBjbGVhckJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuY2xlYXJQcm9wZXJ0eSgnXCIgKyBmaWVsZElkICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIkNsZWFyXCIpO1xuXG4gICAgICAgICAgICB2YXIgYWRkTXVsdGlCdXR0b24gPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGRlbGV0ZUJ1dHRvbiA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChwcm9wLm5hbWUgIT09IGpjckNuc3QuQ09OVEVOVCkge1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdyB3ZSBqdXN0IGdvIHdpdGggdGhlIGRlc2lnbiB3aGVyZSB0aGUgYWN0dWFsIGNvbnRlbnQgcHJvcGVydHkgY2Fubm90IGJlIGRlbGV0ZWQuIFVzZXIgY2FuIGxlYXZlXG4gICAgICAgICAgICAgICAgICogY29udGVudCBibGFuayBidXQgbm90IGRlbGV0ZSBpdC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuZGVsZXRlUHJvcGVydHkoJ1wiICsgcHJvcC5uYW1lICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiRGVsXCIpO1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBJIGRvbid0IHRoaW5rIGl0IHJlYWxseSBtYWtlcyBzZW5zZSB0byBhbGxvdyBhIGpjcjpjb250ZW50IHByb3BlcnR5IHRvIGJlIG11bHRpdmFsdWVkLiBJIG1heSBiZSB3cm9uZyBidXRcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIG15IGN1cnJlbnQgYXNzdW1wdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBUaGVyZSdzIGEgYnVnIGluIGVkaXRpbmcgbXVsdGlwbGUtdmFsdWVkIHByb3BlcnRpZXMsIGFuZCBzbyBpJ20ganVzdCB0dXJuaW5nIGl0IG9mZiBmb3Igbm93XG4gICAgICAgICAgICAgICAgLy93aGlsZSBpIGNvbXBsZXRlIHRlc3Rpbmcgb2YgdGhlIHJlc3Qgb2YgdGhlIGFwcC5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIGFkZE11bHRpQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuYWRkU3ViUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBcIkFkZCBNdWx0aVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbEJ1dHRvbnMgPSBhZGRNdWx0aUJ1dHRvbiArIGNsZWFyQnV0dG9uICsgZGVsZXRlQnV0dG9uO1xuICAgICAgICAgICAgaWYgKGFsbEJ1dHRvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicHJvcGVydHktZWRpdC1idXR0b24tYmFyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZVByb3BlcnR5UmVxdWVzdCwganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlPihcImRlbGV0ZVByb3BlcnR5XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55LCBwcm9wZXJ0eVRvRGVsZXRlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIGRlbGV0ZWQgcHJvcGVydHkgZnJvbSBjbGllbnQgc2lkZSBzdG9yYWdlLCBzbyB3ZSBjYW4gcmUtcmVuZGVyIHNjcmVlbiB3aXRob3V0IG1ha2luZyBhbm90aGVyIGNhbGwgdG9cbiAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9wcy5kZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlUb0RlbGV0ZSk7XG5cbiAgICAgICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBzY2FuIGZvciBhbGwgbXVsdGktdmFsdWUgcHJvcGVydHkgZmllbGRzIGFuZCBjbGVhciB0aGVtICovXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHNhdmVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIGVkaXRpbmcgYW4gdW5zYXZlZCBub2RlIGl0J3MgdGltZSB0byBydW4gdGhlIGluc2VydE5vZGUsIG9yIGNyZWF0ZVN1Yk5vZGUsIHdoaWNoIGFjdHVhbGx5IHNhdmVzIG9udG8gdGhlXG4gICAgICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVOZXdOb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRWxzZSB3ZSBhcmUgZWRpdGluZyBhIHNhdmVkIG5vZGUsIHdoaWNoIGlzIGFscmVhZHkgc2F2ZWQgb24gc2VydmVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGUuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZU5ld05vZGUgPSAobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBuZXdOb2RlTmFtZSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogSWYgd2UgZGlkbid0IGNyZWF0ZSB0aGUgbm9kZSB3ZSBhcmUgaW5zZXJ0aW5nIHVuZGVyLCBhbmQgbmVpdGhlciBkaWQgXCJhZG1pblwiLCB0aGVuIHdlIG5lZWQgdG8gc2VuZCBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlck5hbWUgIT0gZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICYmIC8vXG4gICAgICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Tm9kZVJlcXVlc3QsIGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlPihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5hbWVcIjogZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWVcbiAgICAgICAgICAgICAgICB9LCBlZGl0Lmluc2VydE5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNyZWF0ZVN1Yk5vZGVSZXF1ZXN0LCBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZT4oXCJjcmVhdGVTdWJOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWVcbiAgICAgICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlXCIpO1xuXG4gICAgICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5wcm9wRW50cmllcywgZnVuY3Rpb24oaW5kZXg6IG51bWJlciwgcHJvcDogYW55KSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8qIElnbm9yZSB0aGlzIHByb3BlcnR5IGlmIGl0J3Mgb25lIHRoYXQgY2Fubm90IGJlIGVkaXRlZCBhcyB0ZXh0ICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3AucmVhZE9ubHkgfHwgcHJvcC5iaW5hcnkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICghcHJvcC5tdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBub24tbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3Byb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBJRDogXCIgKyBwcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBjaGFuZ2VkOiBwcm9wTmFtZT1cIiArIHByb3AucHJvcGVydHkubmFtZSArIFwiIHByb3BWYWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcCBkaWRuJ3QgY2hhbmdlOiBcIiArIHByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIEVsc2UgdGhpcyBpcyBhIE1VTFRJIHByb3BlcnR5ICovXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcC5zdWJQcm9wcywgZnVuY3Rpb24oaW5kZXgsIHN1YlByb3ApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBBY2UgRWRpdG9yIGZvciBzdWJQcm9wIElEOiBcIiArIHN1YlByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiU2V0dGluZ1tcIiArIHByb3BWYWwgKyBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgc3ViUHJvcFtcIiArIGluZGV4ICsgXCJdIG9mIFwiICsgcHJvcC5uYW1lICsgXCIgdmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlc1wiOiBwcm9wVmFsc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pOy8vIGVuZCBpdGVyYXRvclxuXG4gICAgICAgICAgICAvKiBpZiBhbnl0aGluZyBjaGFuZ2VkLCBzYXZlIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVOb2RlUmVxdWVzdCwganNvbi5TYXZlTm9kZVJlc3BvbnNlPihcInNhdmVOb2RlXCIsIHBvc3REYXRhLCBlZGl0LnNhdmVOb2RlUmVzcG9uc2UsIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aGluZyBjaGFuZ2VkLiBOb3RoaW5nIHRvIHNhdmUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU11bHRpUHJvcEVkaXRvciA9IChwcm9wRW50cnk6IFByb3BFbnRyeSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyBNdWx0aSBFZGl0b3I6IFByb3BlcnR5IG11bHRpLXR5cGU6IG5hbWU9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiIGNvdW50PVwiXG4gICAgICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0gXCJcIjtcblxuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzID0gW107XG5cbiAgICAgICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgICAgICBpZiAoIXByb3BMaXN0IHx8IHByb3BMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcHJvcExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5pZChwcm9wRW50cnkuaWQgKyBcIl9zdWJQcm9wXCIgKyBpKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsID0gcHJvcEVudHJ5LmJpbmFyeSA/IFwiW2JpbmFyeV1cIiA6IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgICAgICBwcm9wVmFsU3RyID0gcHJvcFZhbC5lc2NhcGVGb3JBdHRyaWIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSAoaSA9PSAwID8gcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgOiBcIipcIikgKyBcIi5cIiArIGk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3ViUHJvcDogU3ViUHJvcCA9IG5ldyBTdWJQcm9wKGlkLCBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMucHVzaChzdWJQcm9wKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IHNpbmdsZS10eXBlOiBcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCA/IHByb3BWYWwgOiAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsU3RyLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYWtpbmcgc2luZ2xlIHByb3AgZWRpdG9yOiBwcm9wW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIl0gdmFsW1wiICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlXG4gICAgICAgICAgICAgICAgKyBcIl0gZmllbGRJZD1cIiArIHByb3BFbnRyeS5pZCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkucmVhZE9ubHkgfHwgcHJvcEVudHJ5LmJpbmFyeSkge1xuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlZGl0Tm9kZURsZzogYW55KSB7XG4gICAgICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZVByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByb3BlcnR5QnV0dG9uXCIsIHRoaXMuc2F2ZVByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJlZGl0UHJvcGVydHlQZ0Nsb3NlQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgICAgICsgXCInIGNsYXNzPSdwYXRoLWRpc3BsYXktaW4tZWRpdG9yJz48L2Rpdj5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSAnJztcblxuICAgICAgICAgICAgLyogUHJvcGVydHkgTmFtZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BOYW1lSWQgPSBcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wTmFtZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZFByb3BWYWx1ZUlkID0gXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BWYWx1ZUlkLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wVmFsdWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJWYWx1ZVwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5TmFtZVRleHRDb250ZW50XCIpKTtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiKSk7XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVEYXRhLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHByb3BlcnR5VmFsdWVEYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogV2FybmluZzogZG9uJ3QgY29uZnVzZSB3aXRoIEVkaXROb2RlRGxnICovXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIiA6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiA9IChyZXM6IGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIChuZXcgU2hhcmluZ0RsZygpKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXJlTm9kZVRvUGVyc29uUGcsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VTaGFyaW5nQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC40O1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgICAgIFwiPGRpdiBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICAgICArIHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIYW5kbGVzIGdldE5vZGVQcml2aWxlZ2VzIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgICAgICpcbiAgICAgICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgICAgICovXG4gICAgICAgIGdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVTaGFyaW5nUGcgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAgICAgJC5lYWNoKHJlcy5hY2xFbnRyaWVzLCBmdW5jdGlvbihpbmRleCwgYWNsRW50cnkpIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWxpc3RcIlxuICAgICAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwdWJsaWNBcHBlbmRBdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFsbG93UHVibGljQ29tbWVudGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJlcy5wdWJsaWNBcHBlbmQpIHtcbiAgICAgICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogdG9kbzogdXNlIGFjdHVhbCBwb2x5bWVyIHBhcGVyLWNoZWNrYm94IGhlcmUgKi9cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWNDb21tZW50aW5nQ2hhbmdlZCA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFVzaW5nIG9uQ2xpY2sgb24gdGhlIGVsZW1lbnQgQU5EIHRoaXMgdGltZW91dCBpcyB0aGUgb25seSBoYWNrIEkgY291bGQgZmluZCB0byBnZXQgZ2V0IHdoYXQgYW1vdW50cyB0byBhIHN0YXRlXG4gICAgICAgICAgICAgKiBjaGFuZ2UgbGlzdGVuZXIgb24gYSBwYXBlci1jaGVja2JveC4gVGhlIGRvY3VtZW50ZWQgb24tY2hhbmdlIGxpc3RlbmVyIHNpbXBseSBkb2Vzbid0IHdvcmsgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGl6LmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpKTtcblxuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCIgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogKHBvbHlFbG0ubm9kZS5jaGVja2VkID8gdHJ1ZSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlUHJpdmlsZWdlID0gKHByaW5jaXBhbDogc3RyaW5nLCBwcml2aWxlZ2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbW92ZVByaXZpbGVnZVJlcXVlc3QsIGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2U+KFwicmVtb3ZlUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiBwcmluY2lwYWwsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VcIjogcHJpdmlsZWdlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbW92ZVByaXZpbGVnZVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUucGF0aCxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlckFjbFByaXZpbGVnZXMgPSAocHJpbmNpcGFsOiBhbnksIGFjbEVudHJ5OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAkLmVhY2goYWNsRW50cnkucHJpdmlsZWdlcywgZnVuY3Rpb24oaW5kZXgsIHByaXZpbGVnZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXoubWFrZUJ1dHRvbihcIlJlbW92ZVwiLCBcInJlbW92ZVByaXZCdXR0b25cIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXouZ3VpZCArIFwiKS5yZW1vdmVQcml2aWxlZ2UoJ1wiICsgcHJpbmNpcGFsICsgXCInLCAnXCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZVxuICAgICAgICAgICAgICAgICAgICArIFwiJyk7XCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICByb3cgKz0gXCI8Yj5cIiArIHByaW5jaXBhbCArIFwiPC9iPiBoYXMgcHJpdmlsZWdlIDxiPlwiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWUgKyBcIjwvYj4gb24gdGhpcyBub2RlLlwiO1xuXG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWVudHJ5XCJcbiAgICAgICAgICAgICAgICB9LCByb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb25QZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIChuZXcgU2hhcmVUb1BlcnNvbkRsZygpKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1B1YmxpYyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hhcmluZyBub2RlIHRvIHB1YmxpYy5cIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWRkIHByaXZpbGVnZSBhbmQgdGhlbiByZWxvYWQgc2hhcmUgbm9kZXMgZGlhbG9nIGZyb20gc2NyYXRjaCBkb2luZyBhbm90aGVyIGNhbGxiYWNrIHRvIHNlcnZlclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRPRE86IHRoaXMgYWRkaXRpb25hbCBjYWxsIGNhbiBiZSBhdm9pZGVkIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCJdLFxuICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IGZhbHNlXG4gICAgICAgICAgICB9LCB0aGlzLnJlbG9hZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZW5hbWVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUmVuYW1lTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVuYW1lIE5vZGVcIik7XG5cbiAgICAgICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZVBhdGhEaXNwbGF5ID0gXCI8aDQgY2xhc3M9J3BhdGgtZGlzcGxheScgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSArIFwiJz48L2g0PlwiO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW50ZXIgbmV3IG5hbWUgZm9yIHRoZSBub2RlXCIsIFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZW5hbWVOb2RlQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZW5hbWVOb2RlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKG5ld05hbWUpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmV3IG5vZGUgbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2VsZWN0IGEgbm9kZSB0byByZW5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBpZiBubyBub2RlIGJlbG93IHRoaXMgbm9kZSwgcmV0dXJucyBudWxsICovXG4gICAgICAgICAgICB2YXIgbm9kZUJlbG93ID0gZWRpdC5nZXROb2RlQmVsb3coaGlnaGxpZ2h0Tm9kZSk7XG5cbiAgICAgICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuYW1lTm9kZVJlcXVlc3QsIGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlPihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJuZXdOYW1lXCI6IG5ld05hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGl6LnJlbmFtZU5vZGVSZXNwb25zZShyZXMsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbmFtZU5vZGVSZXNwb25zZSwgcmVuYW1pbmdQYWdlUm9vdDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVuYW1lIG5vZGVcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZW5hbWluZ1BhZ2VSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUocmVzLm5ld0lkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCByZXMubmV3SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSkuaHRtbChcIk5hbWU6IFwiICsgaGlnaGxpZ2h0Tm9kZS5uYW1lKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyBoaWdobGlnaHROb2RlLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3NlYXJjaFJlc3VsdHNWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjc2VhcmNoUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC5zZWFyY2hQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC5zZWFyY2hSZXN1bHRzLCBcInNlYXJjaFJlc3VsdHNWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB0aW1lbGluZVJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVsaW5lUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIjtcclxuICAgICAgICB0YWJJZDogc3RyaW5nID0gXCJ0aW1lbGluZVRhYk5hbWVcIjtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3RpbWVsaW5lUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3RpbWVsaW5lVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19