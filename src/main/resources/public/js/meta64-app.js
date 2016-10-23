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
            var selNodeIsMine = highlightNode && (highlightNode.createdBy === meta64.userName || "admin" === meta64.userName);
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
            m64.util.setEnablement("timelineButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("showServerInfoButton", meta64.isAdminUser);
            m64.util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            m64.util.setEnablement("refreshPageButton", !meta64.isAnonUser);
            m64.util.setEnablement("findSharedNodesButton", !meta64.isAnonUser && highlightNode != null);
            m64.util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);
            m64.util.setEnablement("adminMenu", meta64.isAdminUser);
            m64.util.setVisibility("openImportDlg", importAllowed && selNodeIsMine);
            m64.util.setVisibility("openExportDlg", exportAllowed && selNodeIsMine);
            m64.util.setVisibility("navHomeButton", !meta64.isAnonUser);
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
                    var rssFeedTitle = m64.props.getNodeProperty("rssFeedTitle", node);
                    if (rssFeedTitle) {
                        renderComplete = true;
                        ret += m64.podcast.renderFeedNode(node, rowStyling);
                    }
                }
                if (!renderComplete) {
                    var rssLink = m64.props.getNodeProperty("rssEntryLink", node);
                    if (rssLink) {
                        renderComplete = true;
                        ret += m64.podcast.renderEntryNode(node, rowStyling);
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
        podcast.generateRSS = function () {
            m64.util.json("generateRSS", {}, generateRSSResponse);
        };
        var generateRSSResponse = function () {
            alert('rss complete.');
        };
        podcast.renderFeedNode = function (node, rowStyling) {
            var ret = "";
            var title = m64.props.getNodeProperty("rssFeedTitle", node);
            var desc = m64.props.getNodeProperty("rssFeedDesc", node);
            var imgUrl = m64.props.getNodeProperty("rssFeedImageUrl", node);
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
            var rssTitle = m64.props.getNodeProperty("rssEntryTitle", node);
            var rssDesc = m64.props.getNodeProperty("rssEntryDesc", node);
            var rssAuthor = m64.props.getNodeProperty("rssEntryAuthor", node);
            var rssLink = m64.props.getNodeProperty("rssEntryLink", node);
            var entry = "";
            if (rssTitle) {
                entry += m64.render.tag("h3", {}, rssTitle.value);
            }
            if (rssDesc) {
                entry += m64.render.tag("p", {}, rssDesc.value);
            }
            if (rssAuthor && rssAuthor.value) {
                entry += m64.render.tag("div", {}, "By: " + rssAuthor.value);
            }
            if (rssLink.value.toLowerCase().indexOf(".mp3") != -1) {
                entry += m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');"
                }, "Play");
            }
            else {
                entry += m64.render.tag("a", {
                    "href": rssLink.value
                }, "Link");
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
                var rssLink_1 = m64.props.getNodeProperty("rssEntryLink", node);
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
            console.log("CurrentTime=" + elm.currentTime);
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
                    dlg.cancel();
                }, 1000);
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
                polyElm.node.noCancelOnOutsideClick = true;
                polyElm.node.open();
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
                    "id": _this.id(id)
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
                    "id": _this.id(id)
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
                var description = "";
                var playerAttribs = {
                    "src": _this.sourceUrl,
                    "id": _this.id("audioPlayer"),
                    "style": "width: 90%;",
                    "ontimeupdate": "m64.podcast.onTimeUpdate('" + _this.nodeUid + "', this);",
                    "oncanplay": "m64.podcast.onCanPlay('" + _this.nodeUid + "', this);",
                    "controls": "controls"
                };
                var player = m64.render.tag("audio", playerAttribs);
                var skipBack30Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.skip(-30, '" + _this.nodeUid + "', this);"
                }, "< 30s");
                var skipForward30Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.skip(30, '" + _this.nodeUid + "', this);"
                }, "30s >");
                var skipButtonBar = m64.render.centeredButtonBar(skipBack30Button + skipForward30Button);
                var speedNormalButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(1.0);"
                }, "Normal Speed");
                var speed15Button = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(1.5);"
                }, "1.5X");
                var speed2xButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.speed(2);"
                }, "2X");
                var speedButtonBar = m64.render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);
                var pauseButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.pause();"
                }, "Pause");
                var playButton = m64.render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.play();"
                }, "Play");
                var closeButton = _this.makeButton("Close", "closeAudioPlayerDlgButton", _this.closeBtn);
                var buttonBar = m64.render.centeredButtonBar(playButton + pauseButton + closeButton);
                return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
            };
            this.closeBtn = function () {
                debugger;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2pzb24tbW9kZWxzLnRzIiwiLi4vdHMvYXBwLnRzIiwiLi4vdHMvY25zdC50cyIsIi4uL3RzL21vZGVscy50cyIsIi4uL3RzL3V0aWwudHMiLCIuLi90cy9qY3JDbnN0LnRzIiwiLi4vdHMvYXR0YWNobWVudC50cyIsIi4uL3RzL2VkaXQudHMiLCIuLi90cy9tZXRhNjQudHMiLCIuLi90cy9uYXYudHMiLCIuLi90cy9wcmVmcy50cyIsIi4uL3RzL3Byb3BzLnRzIiwiLi4vdHMvcmVuZGVyLnRzIiwiLi4vdHMvc2VhcmNoLnRzIiwiLi4vdHMvc2hhcmUudHMiLCIuLi90cy91c2VyLnRzIiwiLi4vdHMvdmlldy50cyIsIi4uL3RzL21lbnUudHMiLCIuLi90cy9wb2RjYXN0LnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hDb250ZW50RGxnLnRzIiwiLi4vdHMvZGxnL1NlYXJjaFRhZ3NEbGcudHMiLCIuLi90cy9kbGcvU2VhcmNoRmlsZXNEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLnRzIiwiLi4vdHMvZGxnL1VwbG9hZEZyb21VcmxEbGcudHMiLCIuLi90cy9kbGcvRWRpdE5vZGVEbGcudHMiLCIuLi90cy9kbGcvRWRpdFByb3BlcnR5RGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJlVG9QZXJzb25EbGcudHMiLCIuLi90cy9kbGcvU2hhcmluZ0RsZy50cyIsIi4uL3RzL2RsZy9SZW5hbWVOb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0F1ZGlvUGxheWVyRGxnLnRzIiwiLi4vdHMvcGFuZWwvc2VhcmNoUmVzdWx0c1BhbmVsLnRzIiwiLi4vdHMvcGFuZWwvdGltZWxpbmVSZXN1bHRzUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUNBQSxZQUFZLENBQUM7QUFLYixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFLOUIsSUFBSSxRQUFRLEdBQUcsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7SUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ2pELE1BQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU1GO0FBRUEsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxF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LFlBQU8sR0FBWSxLQUFLLENBQUM7WUFFekIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLGtDQUFrQyxDQUFDO2dCQUNoRCxJQUFJLFdBQVcsR0FBRywrQkFBK0IsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDaEMsQ0FBQyxDQUFBO1lBRUQsU0FBSSxHQUFHO2dCQUNILENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQUksQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUFELDJCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSx3QkFBb0IsdUJBZ0JoQyxDQUFBO0FBQ0wsQ0FBQyxFQWxCUyxHQUFHLEtBQUgsR0FBRyxRQWtCWiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdlbmVyYXRlZCB1c2luZyB0eXBlc2NyaXB0LWdlbmVyYXRvciB2ZXJzaW9uIDEuMTAtU05BUFNIT1Qgb24gMjAxNi0wNy0zMSAyMDoyMTowMS5cblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqc29uIHtcblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8ge1xuICAgICAgICAgICAgcHJpbmNpcGFsTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlczogUHJpdmlsZWdlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJpbWFyeVR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIGhhc0NoaWxkcmVuOiBib29sZWFuO1xuICAgICAgICAgICAgaGFzQmluYXJ5OiBib29sZWFuO1xuICAgICAgICAgICAgYmluYXJ5SXNJbWFnZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGJpblZlcjogbnVtYmVyO1xuICAgICAgICAgICAgd2lkdGg6IG51bWJlcjtcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyO1xuICAgICAgICAgICAgY2hpbGRyZW5PcmRlcmVkOiBib29sZWFuO1xuICAgICAgICAgICAgdWlkOiBzdHJpbmc7XG4gICAgICAgICAgICBjcmVhdGVkQnk6IHN0cmluZztcbiAgICAgICAgICAgIGxhc3RNb2RpZmllZDogRGF0ZTtcbiAgICAgICAgICAgIGltZ0lkOiBzdHJpbmc7XG4gICAgICAgICAgICBvd25lcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBQcml2aWxlZ2VJbmZvIHtcbiAgICAgICAgICAgIHByaXZpbGVnZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHlJbmZvIHtcbiAgICAgICAgICAgIHR5cGU6IG51bWJlcjtcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgICAgICAgICB2YWx1ZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgaHRtbFZhbHVlOiBzdHJpbmc7XG4gICAgICAgICAgICBhYmJyZXZpYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVmSW5mbyB7XG4gICAgICAgICAgICBpZDogc3RyaW5nO1xuICAgICAgICAgICAgcGF0aDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVc2VyUHJlZmVyZW5jZXMge1xuICAgICAgICAgICAgZWRpdE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBhZHZhbmNlZE1vZGU6IGJvb2xlYW47XG4gICAgICAgICAgICBsYXN0Tm9kZTogc3RyaW5nO1xuICAgICAgICAgICAgaW1wb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIGV4cG9ydEFsbG93ZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICBzaG93TWV0YURhdGE6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcml2aWxlZ2VzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljQXBwZW5kOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBbm9uUGFnZUxvYWRSZXF1ZXN0IHtcbiAgICAgICAgICAgIGlnbm9yZVVybDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5ld1Bhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXNzQ29kZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVSU1NSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgICAgICB0aW1lT2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgICBub2RlUGF0aCA6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcE5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldEZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIGluY2x1ZGVBY2w6IGJvb2xlYW47XG4gICAgICAgICAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgYm9va05hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHRydW5jYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgcGFyZW50SWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHR6T2Zmc2V0OiBudW1iZXI7XG4gICAgICAgICAgICBkc3Q6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ291dFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBNb3ZlTm9kZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHRhcmdldE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgdGFyZ2V0Q2hpbGRJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkczogc3RyaW5nW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE5vZGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIHNvcnREaXI6IHN0cmluZztcbiAgICAgICAgICAgIHNvcnRGaWVsZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgICAgICAgICBzZWFyY2hQcm9wOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXF1ZXN0IHtcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3TmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHVwTGV2ZWw6IG51bWJlcjtcbiAgICAgICAgICAgIHJlbmRlclBhcmVudElmTGVhZjogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVzZXRQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0IHtcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBPcGVuU3lzdGVtRmlsZVJlcXVlc3Qge1xuICAgICAgICAgICAgZmlsZU5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCB7XG4gICAgICAgICAgICBwYXJlbnROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2libGluZ0lkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNpZ251cFJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICAgICAgY2FwdGNoYTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUJlbG93SWQ6IHN0cmluZztcbiAgICAgICAgICAgIGRlbGltaXRlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBVcGxvYWRGcm9tVXJsUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZVVybDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBZGRQcml2aWxlZ2VSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICAgICAgICAgIHJlbmRlck5vZGVSZXNwb25zZTogUmVuZGVyTm9kZVJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHVzZXI6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VBY2NvdW50UmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0UGxheWVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6bnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICAgICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGU6IFJlZkluZm87XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG4gICAgICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5U2F2ZWQ6IFByb3BlcnR5SW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgYXBwLmpzXCIpO1xuXG4vLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4vLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbihldmVudCkgeyBpZiAodHlwZW9mIG9ucmVzaXplID09PSAnZnVuY3Rpb24nKSBvbnJlc2l6ZSgpOyAvKiogLi4uICovIH1cblxudmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCB0eXBlb2YgKG9iamVjdCkgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICBvYmplY3QuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgIH1cbn07XG5cbi8qXG4gKiBXQVJOSU5HOiBUaGlzIGlzIGNhbGxlZCBpbiByZWFsdGltZSB3aGlsZSB1c2VyIGlzIHJlc2l6aW5nIHNvIGFsd2F5cyB0aHJvdHRsZSBiYWNrIGFueSBwcm9jZXNzaW5nIHNvIHRoYXQgeW91IGRvbid0XG4gKiBkbyBhbnkgYWN0dWFsIHByb2Nlc3NpbmcgaW4gaGVyZSB1bmxlc3MgeW91IHdhbnQgaXQgVkVSWSBsaXZlLCBiZWNhdXNlIGl0IGlzLlxuICovXG5mdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJXaW5kb3dSZXNpemU6IHc9XCIgKyB3aW5kb3cuaW5uZXJXaWR0aCArIFwiIGg9XCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHdpbmRvd1Jlc2l6ZSk7XG5cbi8vIHRoaXMgY29tbWVudGVkIHNlY3Rpb24gaXMgbm90IHdvcmtpbmcgaW4gbXkgbmV3IHgtYXBwIGNvZGUsIGJ1dCBpdCdzIG9rIHRvIGNvbW1lbnQgaXQgb3V0IGZvciBub3cuXG4vL1xuLy8gVGhpcyBpcyBvdXIgdGVtcGxhdGUgZWxlbWVudCBpbiBpbmRleC5odG1sXG4vLyB2YXIgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3gtYXBwJyk7XG4vLyAvLyBMaXN0ZW4gZm9yIHRlbXBsYXRlIGJvdW5kIGV2ZW50IHRvIGtub3cgd2hlbiBiaW5kaW5nc1xuLy8gLy8gaGF2ZSByZXNvbHZlZCBhbmQgY29udGVudCBoYXMgYmVlbiBzdGFtcGVkIHRvIHRoZSBwYWdlXG4vLyBhcHAuYWRkRXZlbnRMaXN0ZW5lcignZG9tLWNoYW5nZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKCdhcHAgcmVhZHkgZXZlbnQhJyk7XG4vLyB9KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvbHltZXItcmVhZHknLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coJ3BvbHltZXItcmVhZHkgZXZlbnQhJyk7XG59KTtcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGNuc3QuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBjb29raWVQcmVmaXg7XHJcblxyXG4vL3RvZG8tMDogdHlwZXNjcmlwdCB3aWxsIG5vdyBsZXQgdXMganVzdCBkbyB0aGlzOiBjb25zdCB2YXI9J3ZhbHVlJztcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBjbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBBTk9OOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1VTUjogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblVzclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1BXRDogc3RyaW5nID0gY29va2llUHJlZml4ICsgXCJsb2dpblB3ZFwiO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbG9naW5TdGF0ZT1cIjBcIiBpZiB1c2VyIGxvZ2dlZCBvdXQgaW50ZW50aW9uYWxseS4gbG9naW5TdGF0ZT1cIjFcIiBpZiBsYXN0IGtub3duIHN0YXRlIG9mIHVzZXIgd2FzICdsb2dnZWQgaW4nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT09LSUVfTE9HSU5fU1RBVEU6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5TdGF0ZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQlI6IFwiPGRpdiBjbGFzcz0ndmVydC1zcGFjZSc+PC9kaXY+XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTlNFUlRfQVRUQUNITUVOVDogc3RyaW5nID0gXCJ7e2luc2VydC1hdHRhY2htZW50fX1cIjtcclxuICAgICAgICBleHBvcnQgbGV0IE5FV19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IElOU19PTl9UT09MQkFSOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcbiIsIlxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbiAgICAvKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuICAgIGV4cG9ydCBjbGFzcyBBZFNlZ21lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgICAgIHB1YmxpYyBlbmRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wRW50cnkge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBwcm9wZXJ0eToganNvbi5Qcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdWJQcm9wIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cclxuZGVjbGFyZSB2YXIgUG9seW1lcjtcclxuZGVjbGFyZSB2YXIgJDsgLy88LS0tLS0tLS0tLS0tLXRoaXMgd2FzIGEgd2lsZGFzcyBndWVzcy5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXJyYXkgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vV0FSTklORzogVGhlc2UgcHJvdG90eXBlIGZ1bmN0aW9ucyBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBhbnkgZnVuY3Rpb25zLlxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG4gICAgY2xvbmUoKTogQXJyYXk8VD47XHJcbiAgICBpbmRleE9mSXRlbUJ5UHJvcChwcm9wTmFtZSwgcHJvcFZhbCk6IG51bWJlcjtcclxuICAgIGFycmF5TW92ZUl0ZW0oZnJvbUluZGV4LCB0b0luZGV4KTogdm9pZDtcclxuICAgIGluZGV4T2ZPYmplY3Qob2JqOiBhbnkpOiBudW1iZXI7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNsaWNlKDApO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmluZGV4T2ZJdGVtQnlQcm9wID0gZnVuY3Rpb24ocHJvcE5hbWUsIHByb3BWYWwpIHtcclxuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXVtwcm9wTmFtZV0gPT09IHByb3BWYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59O1xyXG5cclxuLyogbmVlZCB0byB0ZXN0IGFsbCBjYWxscyB0byB0aGlzIG1ldGhvZCBiZWNhdXNlIGkgbm90aWNlZCBkdXJpbmcgVHlwZVNjcmlwdCBjb252ZXJzaW9uIGkgd2Fzbid0IGV2ZW4gcmV0dXJuaW5nXHJcbmEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuKi9cclxuQXJyYXkucHJvdG90eXBlLmFycmF5TW92ZUl0ZW0gPSBmdW5jdGlvbihmcm9tSW5kZXgsIHRvSW5kZXgpIHtcclxuICAgIHRoaXMuc3BsaWNlKHRvSW5kZXgsIDAsIHRoaXMuc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xyXG59O1xyXG5cclxuaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGF0ZSBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIERhdGUge1xyXG4gICAgc3RkVGltZXpvbmVPZmZzZXQoKTogbnVtYmVyO1xyXG4gICAgZHN0KCk6IGJvb2xlYW47XHJcbn07XHJcblxyXG5EYXRlLnByb3RvdHlwZS5zdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGphbiA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICB2YXIganVsID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCA2LCAxKTtcclxuICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG59XHJcblxyXG5EYXRlLnByb3RvdHlwZS5kc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgPCB0aGlzLnN0ZFRpbWV6b25lT2Zmc2V0KCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RyaW5nIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb250YWlucyhzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICByZXBsYWNlQWxsKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdW5lbmNvZGVIdG1sKCk6IHN0cmluZztcclxuICAgIGVzY2FwZUZvckF0dHJpYigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRzV2l0aChzdHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSAhPSAtMTtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhcIiZcIikpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCcmYW1wOycsICcmJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmd0OycsICc+JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmx0OycsICc8JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJnF1b3Q7JywgJ1wiJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJiMzOTsnLCBcIidcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHV0aWwge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FqYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVvdXRNZXNzYWdlU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IG9mZmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3YWl0Q291bnRlcjogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IHBncnNEbGc6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgICAgIC8vXHRPYmplY3QucHJvdG90eXBlLnRvSnNvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgICAgICAvL1x0fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2YWwodmFyTmFtZSkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJWYXJpYWJsZSBub3QgZm91bmQ6IFwiICsgdmFyTmFtZSkpLm9wZW4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgYW4gYWpheCBjYWxsLCBidXQgdGhlIHNlcnZlciBhbHNvIGVuZm9yY2VzIHRoYXQgZWFjaFxyXG4gICAgICAgICAqIHNlc3Npb24gaXMgb25seSBhbGxvd2VkIG9uZSBjb25jdXJyZW50IGNhbGwgYW5kIHNpbXVsdGFuZW91cyBjYWxscyB3b3VsZCBqdXN0IFwicXVldWUgdXBcIi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgX2FqYXhDb3VudGVyOiBudW1iZXIgPSAwO1xyXG5cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKG5ldyBEYXRlKCkuZHN0KCkpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRvSnNvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFRoaXMgY2FtZSBmcm9tIGhlcmU6XHJcblx0XHQgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lPzogYW55LCB1cmw/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcblx0XHQgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG5cdFx0ICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIGNoaWxkKTogYW55IHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRQcm9ncmVzc01vbml0b3IgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwocHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByb2dyZXNzSW50ZXJ2YWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlzV2FpdGluZyA9IGlzQWpheFdhaXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGlzV2FpdGluZykge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlmICh3YWl0Q291bnRlciA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2FpdENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBncnNEbGcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGpzb24gPSBmdW5jdGlvbiA8UmVxdWVzdFR5cGUsIFJlc3BvbnNlVHlwZT4ocG9zdE5hbWU6IGFueSwgcG9zdERhdGE6IFJlcXVlc3RUeXBlLCAvL1xyXG4gICAgICAgICAgICBjYWxsYmFjaz86IChyZXNwb25zZTogUmVzcG9uc2VUeXBlLCBwYXlsb2FkPzogYW55KSA9PiBhbnksIGNhbGxiYWNrVGhpcz86IGFueSwgY2FsbGJhY2tQYXlsb2FkPzogYW55KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzID09PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUgKyBcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi1QT1NUW2dlbl06IFtcIiArIHBvc3ROYW1lICsgXCJdXCIgKyBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaXJvbkFqYXggPSB0aGlzLiQkKFwiI215SXJvbkFqYXhcIik7XHJcbiAgICAgICAgICAgICAgICAvL2lyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD4pd2luZG93LmRvY3VtZW50LnJvb3QpLnF1ZXJ5U2VsZWN0b3IoXCIjaXJvbkFqYXhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXggPSBwb2x5RWxtTm9kZShcImlyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnVybCA9IHBvc3RUYXJnZXRVcmwgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4Lm1ldGhvZCA9IFwiUE9TVFwiO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgucGFyYW1zPSd7XCJhbHRcIjpcImpzb25cIiwgXCJxXCI6XCJjaHJvbWVcIn0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5vblJlc3BvbnNlID0gXCJ1dGlsLmlyb25BamF4UmVzcG9uc2VcIjsgLy8gb24tcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmRlYm91bmNlRHVyYXRpb24gPSBcIjMwMFwiOyAvLyBkZWJvdW5jZS1kdXJhdGlvbiAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGYWlsZWQgc3RhcnRpbmcgcmVxdWVzdDogXCIgKyBwb3N0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBleDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vdGVzXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcbiAgICAgICAgICAgICAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcbiAgICAgICAgICAgICAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcbiAgICAgICAgICAgICAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcbiAgICAgICAgICAgICAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuICAgICAgICAgICAgICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcbiAgICAgICAgICAgICAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg8UmVzcG9uc2VUeXBlPmlyb25SZXF1ZXN0LnJlc3BvbnNlLCBjYWxsYmFja1BheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhbid0IHdlIGp1c3QgbGV0IGNhbGxiYWNrUGF5bG9hZCBiZSB1bmRlZmluZWQsIGFuZCBjYWxsIHRoZSBhYm92ZSBjYWxsYmFjayBtZXRob2RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgbm90IGV2ZW4gaGF2ZSB0aGlzIGVsc2UgYmxvY2sgaGVyZSBhdCBhbGwgKGkuZS4gbm90IGV2ZW4gY2hlY2sgaWYgY2FsbGJhY2tQYXlsb2FkIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsL3VuZGVmaW5lZCwgYnV0IGp1c3QgdXNlIGl0LCBhbmQgbm90IGhhdmUgdGhpcyBpZiBibG9jaz8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJGYWlsZWQgaGFuZGxpbmcgcmVzdWx0IG9mOiBcIiArIHBvc3ROYW1lICsgXCIgZXg9XCIgKyBleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBGYWlsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIHV0aWwuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcm9uUmVxdWVzdC5zdGF0dXMgPT0gXCI0MDNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluIGRldGVjdGVkIGluIHV0aWwuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0TWVzc2FnZVNob3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dE1lc3NhZ2VTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2Vzc2lvbiB0aW1lZCBvdXQuIFBhZ2Ugd2lsbCByZWZyZXNoLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlyb25SZXF1ZXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhamF4UmVhZHkgPSBmdW5jdGlvbihyZXF1ZXN0TmFtZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoX2FqYXhDb3VudGVyID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZ25vcmluZyByZXF1ZXN0czogXCIgKyByZXF1ZXN0TmFtZSArIFwiLiBBamF4IGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzQWpheFdhaXRpbmcgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9hamF4Q291bnRlciA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBzZXQgZm9jdXMgdG8gZWxlbWVudCBieSBpZCAoaWQgbXVzdCBzdGFydCB3aXRoICMpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxheWVkRm9jdXMgPSBmdW5jdGlvbihpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBzbyB1c2VyIHNlZXMgdGhlIGZvY3VzIGZhc3Qgd2UgdHJ5IGF0IC41IHNlY29uZHMgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSB0cnkgYWdhaW4gYSBmdWxsIHNlY29uZCBsYXRlci4gTm9ybWFsbHkgbm90IHJlcXVpcmVkLCBidXQgbmV2ZXIgdW5kZXNpcmFibGUgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogV2UgY291bGQgaGF2ZSBwdXQgdGhpcyBsb2dpYyBpbnNpZGUgdGhlIGpzb24gbWV0aG9kIGl0c2VsZiwgYnV0IEkgY2FuIGZvcnNlZSBjYXNlcyB3aGVyZSB3ZSBkb24ndCB3YW50IGFcclxuXHRcdCAqIG1lc3NhZ2UgdG8gYXBwZWFyIHdoZW4gdGhlIGpzb24gcmVzcG9uc2UgcmV0dXJucyBzdWNjZXNzPT1mYWxzZSwgc28gd2Ugd2lsbCBoYXZlIHRvIGNhbGwgY2hlY2tTdWNjZXNzIGluc2lkZVxyXG5cdFx0ICogZXZlcnkgcmVzcG9uc2UgbWV0aG9kIGluc3RlYWQsIGlmIHdlIHdhbnQgdGhhdCByZXNwb25zZSB0byBwcmludCBhIG1lc3NhZ2UgdG8gdGhlIHVzZXIgd2hlbiBmYWlsIGhhcHBlbnMuXHJcblx0XHQgKlxyXG5cdFx0ICogcmVxdWlyZXM6IHJlcy5zdWNjZXNzIHJlcy5tZXNzYWdlXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoZWNrU3VjY2VzcyA9IGZ1bmN0aW9uKG9wRnJpZW5kbHlOYW1lLCByZXMpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG9wRnJpZW5kbHlOYW1lICsgXCIgZmFpbGVkOiBcIiArIHJlcy5tZXNzYWdlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3VjY2VzcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGFkZHMgYWxsIGFycmF5IG9iamVjdHMgdG8gb2JqIGFzIGEgc2V0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGRBbGwgPSBmdW5jdGlvbihvYmosIGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwibnVsbCBlbGVtZW50IGluIGFkZEFsbCBhdCBpZHg9XCIgKyBpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2FbaV1dID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudWxsT3JVbmRlZiA9IGZ1bmN0aW9uKG9iaik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogV2UgaGF2ZSB0byBiZSBhYmxlIHRvIG1hcCBhbnkgaWRlbnRpZmllciB0byBhIHVpZCwgdGhhdCB3aWxsIGJlIHJlcGVhdGFibGUsIHNvIHdlIGhhdmUgdG8gdXNlIGEgbG9jYWxcclxuXHRcdCAqICdoYXNoc2V0LXR5cGUnIGltcGxlbWVudGF0aW9uXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFVpZEZvcklkID0gZnVuY3Rpb24obWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qIGxvb2sgZm9yIHVpZCBpbiBtYXAgKi9cclxuICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbWFwW2lkXTtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIG5vdCBmb3VuZCwgZ2V0IG5leHQgbnVtYmVyLCBhbmQgYWRkIHRvIG1hcCAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgdWlkID0gXCJcIiArIG1ldGE2NC5uZXh0VWlkKys7XHJcbiAgICAgICAgICAgICAgICBtYXBbaWRdID0gdWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB1aWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVsZW1lbnRFeGlzdHMgPSBmdW5jdGlvbihpZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUYWtlcyB0ZXh0YXJlYSBkb20gSWQgKCMgb3B0aW9uYWwpIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VGV4dEFyZWFWYWxCeUlkID0gZnVuY3Rpb24oaWQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgZGU6IEhUTUxFbGVtZW50ID0gZG9tRWxtKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kZSkudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBSQVcgRE9NIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmQuIERvIG5vdCBwcmVmaXggd2l0aCBcIiNcIlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkb21FbG0gPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5ID0gZnVuY3Rpb24oaWQpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9seUVsbShpZCkubm9kZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHlFbG0gPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQb2x5bWVyLmRvbShlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seUVsbU5vZGUgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGUgPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUubm9kZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIGVsZW1lbnQgYW5kIGRpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgaXQncyBub3QgZm91bmRcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UmVxdWlyZWRFbGVtZW50ID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gJChpZCk7XHJcbiAgICAgICAgICAgIGlmIChlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0UmVxdWlyZWRFbGVtZW50LiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoubGVuZ3RoICE9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnRUaW1lTWlsbGlzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVtcHR5U3RyaW5nID0gZnVuY3Rpb24odmFsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICF2YWwgfHwgdmFsLmxlbmd0aCA9PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRJbnB1dFZhbCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9seUVsbShpZCkubm9kZS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IHdhcyBmb3VuZCwgb3IgZmFsc2UgaWYgZWxlbWVudCBub3QgZm91bmQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBwb2x5RWxtKGlkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgZWxtLm5vZGUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVsbSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5kRW50ZXJLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnkpIHtcclxuICAgICAgICAgICAgYmluZEtleShpZCwgZnVuYywgMTMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5kS2V5ID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgZnVuYzogYW55LCBrZXlDb2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgJChpZCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5Q29kZSkgeyAvLyAxMz09ZW50ZXIga2V5IGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogUmVtb3ZlZCBvbGRDbGFzcyBmcm9tIGVsZW1lbnQgYW5kIHJlcGxhY2VzIHdpdGggbmV3Q2xhc3MsIGFuZCBpZiBvbGRDbGFzcyBpcyBub3QgcHJlc2VudCBpdCBzaW1wbHkgYWRkc1xyXG5cdFx0ICogbmV3Q2xhc3MuIElmIG9sZCBjbGFzcyBleGlzdGVkLCBpbiB0aGUgbGlzdCBvZiBjbGFzc2VzLCB0aGVuIHRoZSBuZXcgY2xhc3Mgd2lsbCBub3cgYmUgYXQgdGhhdCBwb3NpdGlvbi4gSWZcclxuXHRcdCAqIG9sZCBjbGFzcyBkaWRuJ3QgZXhpc3QsIHRoZW4gbmV3IENsYXNzIGlzIGFkZGVkIGF0IGVuZCBvZiBjbGFzcyBsaXN0LlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGFuZ2VPckFkZENsYXNzID0gZnVuY3Rpb24oZWxtOiBzdHJpbmcsIG9sZENsYXNzOiBzdHJpbmcsIG5ld0NsYXNzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsbWVtZW50ID0gJChlbG0pO1xyXG4gICAgICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhvbGRDbGFzcywgZmFsc2UpO1xyXG4gICAgICAgICAgICBlbG1lbWVudC50b2dnbGVDbGFzcyhuZXdDbGFzcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBkaXNwbGF5cyBtZXNzYWdlIChtc2cpIG9mIG9iamVjdCBpcyBub3Qgb2Ygc3BlY2lmaWVkIHR5cGVcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdmVyaWZ5VHlwZSA9IGZ1bmN0aW9uKG9iajogYW55LCB0eXBlOiBhbnksIG1zZzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRIdG1sID0gZnVuY3Rpb24oaWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gZG9tRWxtKGlkKTtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSBQb2x5bWVyLmRvbShlbG0pO1xyXG5cclxuICAgICAgICAgICAgLy9Gb3IgUG9seW1lciAxLjAuMCwgeW91IG5lZWQgdGhpcy4uLlxyXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgcG9seUVsbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UHJvcGVydHlDb3VudCA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgdmFyIHByb3A7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY291bnQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyBhbmQgdmFsdWVzXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByaW50T2JqZWN0ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wZXJ0eVtcIiArIGNvdW50ICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9IGsgKyBcIiAsIFwiICsgdiArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlcnJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogaXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QgY3JlYXRpbmcgYSBzdHJpbmcgY29udGFpbmluZyBpdCdzIGtleXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByaW50S2V5cyA9IGZ1bmN0aW9uKG9iajogT2JqZWN0KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWspIHtcclxuICAgICAgICAgICAgICAgICAgICBrID0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9ICcsJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbCArPSBrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIE1ha2VzIGVsZUlkIGVuYWJsZWQgYmFzZWQgb24gdmlzIGZsYWdcclxuXHRcdCAqXHJcblx0XHQgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRFbmFibGVtZW50ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgZW5hYmxlOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVuYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzYWJsaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIE1ha2VzIGVsZUlkIHZpc2libGUgYmFzZWQgb24gdmlzIGZsYWdcclxuXHRcdCAqXHJcblx0XHQgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZXRWaXNpYmlsaXR5ID0gZnVuY3Rpb24oZWxtSWQ6IHN0cmluZywgdmlzOiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBkb21FbG0oZWxtSWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gZWxtSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2aXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIC8vZWxtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgJChlbG0pLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGlkaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICQoZWxtKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFByb2dyYW1hdGljYWxseSBjcmVhdGVzIG9iamVjdHMgYnkgbmFtZSwgc2ltaWxhciB0byB3aGF0IEphdmEgcmVmbGVjdGlvbiBkb2VzXHJcblxyXG4gICAgICAgICogZXg6IHZhciBleGFtcGxlID0gSW5zdGFuY2VMb2FkZXIuZ2V0SW5zdGFuY2U8TmFtZWRUaGluZz4od2luZG93LCAnRXhhbXBsZUNsYXNzJywgYXJncy4uLik7XHJcbiAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldEluc3RhbmNlID0gZnVuY3Rpb24gPFQ+KGNvbnRleHQ6IE9iamVjdCwgbmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFQge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGNvbnRleHRbbmFtZV0ucHJvdG90eXBlKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuY29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgICAgICByZXR1cm4gPFQ+aW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGpjckNuc3QuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgamNyQ25zdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09NTUVOVF9CWTogc3RyaW5nID0gXCJjb21tZW50QnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBVQkxJQ19BUFBFTkQ6IHN0cmluZyA9IFwicHVibGljQXBwZW5kXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQUklNQVJZX1RZUEU6IHN0cmluZyA9IFwiamNyOnByaW1hcnlUeXBlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBQT0xJQ1k6IHN0cmluZyA9IFwicmVwOnBvbGljeVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IE1JWElOX1RZUEVTOiBzdHJpbmcgPSBcImpjcjptaXhpblR5cGVzXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfUkVDSVA6IHN0cmluZyA9IFwicmVjaXBcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMX1NVQkpFQ1Q6IHN0cmluZyA9IFwic3ViamVjdFwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IENSRUFURUQ6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENSRUFURURfQlk6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVEFHUzogc3RyaW5nID0gXCJ0YWdzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBVVUlEOiBzdHJpbmcgPSBcImpjcjp1dWlkXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMQVNUX01PRElGSUVEOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRURfQlk6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBKU09OX0ZJTEVfU0VBUkNIX1JFU1VMVDogc3RyaW5nID0gXCJqc29uRmlsZVNlYXJjaFJlc3VsdFwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IERJU0FCTEVfSU5TRVJUOiBzdHJpbmcgPSBcImRpc2FibGVJbnNlcnRcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBVU0VSOiBzdHJpbmcgPSBcInVzZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBXRDogc3RyaW5nID0gXCJwd2RcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEVNQUlMOiBzdHJpbmcgPSBcImVtYWlsXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT0RFOiBzdHJpbmcgPSBcImNvZGVcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fVkVSOiBzdHJpbmcgPSBcImJpblZlclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX0RBVEE6IHN0cmluZyA9IFwiamNyRGF0YVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQklOX01JTUU6IHN0cmluZyA9IFwiamNyOm1pbWVUeXBlXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgSU1HX1dJRFRIOiBzdHJpbmcgPSBcImltZ1dpZHRoXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTUdfSEVJR0hUOiBzdHJpbmcgPSBcImltZ0hlaWdodFwiO1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGF0dGFjaG1lbnQuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgYXR0YWNobWVudCB7XHJcbiAgICAgICAgLyogTm9kZSBiZWluZyB1cGxvYWRlZCB0byAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBsb2FkTm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbUZpbGVEbGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIG02NC5uYW1lc3BhY2UgdmVyc2lvbiFcIik7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnKCkpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFRvIHJ1biBsZWdhY3kgdXBsb2FkZXIganVzdCBwdXQgdGhpcyB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgaGVyZSwgYW5kXHJcbiAgICAgICAgICAgIG5vdGhpbmcgZWxzZSBpcyByZXF1aXJlZC4gU2VydmVyIHNpZGUgcHJvY2Vzc2luZyBpcyBzdGlsbCBpbiBwbGFjZSBmb3IgaXRcclxuXHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZTpqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1cGxvYWROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFVwbG9hZEZyb21VcmxEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBdHRhY2htZW50ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGUgQXR0YWNobWVudFwiLCBcIkRlbGV0ZSB0aGUgQXR0YWNobWVudCBvbiB0aGUgTm9kZT9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlQXR0YWNobWVudFJlcXVlc3QsIGpzb24uRGVsZXRlQXR0YWNobWVudFJlc3BvbnNlPihcImRlbGV0ZUF0dGFjaG1lbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIG51bGwsIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBhdHRhY2htZW50XCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZW1vdmVCaW5hcnlCeVVpZCh1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgcmUtcmVuZGVyIGZyb20gbG9jYWwgZGF0YS5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogZWRpdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBlZGl0IHtcclxuXHJcbiAgICAgICAgbGV0IGluc2VydEJvb2tSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnRCb29rUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRCb29rUmVzcG9uc2UgcnVubmluZy5cIik7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBCb29rXCIsIHJlcyk7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkZWxldGVOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZU5vZGVzUmVzcG9uc2UsIHBheWxvYWQ6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlID0gcGF5bG9hZFtcInBvc3REZWxldGVTZWxOb2RlXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gc2VsTm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgaGlnaGxpZ2h0SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5pdE5vZGVFZGl0UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uSW5pdE5vZGVFZGl0UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRWRpdGluZyBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzUmVwOiBib29sZWFuID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz8gKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlIGFuZCB3ZSBhcmUgdGhlIGNvbW1lbnRlciAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGVkaXRpbmdBbGxvd2VkOiBib29sZWFuID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFNlcnZlciB3aWxsIGhhdmUgc2VudCB1cyBiYWNrIHRoZSByYXcgdGV4dCBjb250ZW50LCB0aGF0IHNob3VsZCBiZSBtYXJrZG93biBpbnN0ZWFkIG9mIGFueSBIVE1MLCBzb1xyXG4gICAgICAgICAgICAgICAgICAgICAqIHRoYXQgd2UgY2FuIGRpc3BsYXkgdGhpcyBhbmQgc2F2ZS5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZSA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgY2Fubm90IGVkaXQgbm9kZXMgdGhhdCB5b3UgZG9uJ3Qgb3duLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbW92ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTW92ZU5vZGVzUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTW92ZSBub2Rlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IG51bGw7IC8vIHJlc2V0XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNldE5vZGVQb3NpdGlvblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBub2RlIHBvc2l0aW9uXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1JlYWRPbmx5UHJvcGVydGllczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOb2RlIElEIGFycmF5IG9mIG5vZGVzIHRoYXQgYXJlIHJlYWR5IHRvIGJlIG1vdmVkIHdoZW4gdXNlciBjbGlja3MgJ0ZpbmlzaCBNb3ZpbmcnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRPZk5ld05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGluZGljYXRlcyBlZGl0b3IgaXMgZGlzcGxheWluZyBhIG5vZGUgdGhhdCBpcyBub3QgeWV0IHNhdmVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRpbmdVbnNhdmVkTm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG5vZGUgKE5vZGVJbmZvLmphdmEpIHRoYXQgaXMgYmVpbmcgY3JlYXRlZCB1bmRlciB3aGVuIG5ldyBub2RlIGlzIGNyZWF0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE5vZGUgYmVpbmcgZWRpdGVkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiB0b2RvLTI6IHRoaXMgYW5kIHNldmVyYWwgb3RoZXIgdmFyaWFibGVzIGNhbiBub3cgYmUgbW92ZWQgaW50byB0aGUgZGlhbG9nIGNsYXNzPyBJcyB0aGF0IGdvb2Qgb3IgYmFkXHJcbiAgICAgICAgICogY291cGxpbmcvcmVzcG9uc2liaWxpdHk/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIEluc3RhbmNlIG9mIEVkaXROb2RlRGlhbG9nOiBGb3Igbm93IGNyZWF0aW5nIG5ldyBvbmUgZWFjaCB0aW1lICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZURsZ0luc3Q6IEVkaXROb2RlRGxnID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0eXBlPU5vZGVJbmZvLmphdmFcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFdoZW4gaW5zZXJ0aW5nIGEgbmV3IG5vZGUsIHRoaXMgaG9sZHMgdGhlIG5vZGUgdGhhdCB3YXMgY2xpY2tlZCBvbiBhdCB0aGUgdGltZSB0aGUgaW5zZXJ0IHdhcyByZXF1ZXN0ZWQsIGFuZFxyXG4gICAgICAgICAqIGlzIHNlbnQgdG8gc2VydmVyIGZvciBvcmRpbmFsIHBvc2l0aW9uIGFzc2lnbm1lbnQgb2YgbmV3IG5vZGUuIEFsc28gaWYgdGhpcyB2YXIgaXMgbnVsbCwgaXQgaW5kaWNhdGVzIHdlIGFyZVxyXG4gICAgICAgICAqIGNyZWF0aW5nIGluIGEgJ2NyZWF0ZSB1bmRlciBwYXJlbnQnIG1vZGUsIHZlcnN1cyBub24tbnVsbCBtZWFuaW5nICdpbnNlcnQgaW5saW5lJyB0eXBlIG9mIGluc2VydC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZUluc2VydFRhcmdldDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIHdlIGNhbiAndHJ5IHRvJyBpbnNlcnQgdW5kZXIgJ25vZGUnIG9yIGZhbHNlIGlmIG5vdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNFZGl0QWxsb3dlZCA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBub2RlLnBhdGggIT0gXCIvXCIgJiZcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBDaGVjayB0aGF0IGlmIHdlIGhhdmUgYSBjb21tZW50QnkgcHJvcGVydHkgd2UgYXJlIHRoZSBjb21tZW50ZXIsIGJlZm9yZSBhbGxvd2luZyBlZGl0IGJ1dHRvbiBhbHNvLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAoIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB8fCBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSkpIC8vXHJcbiAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGFsbG93IHRoZSBkaXNhYmxlSW5zZXJ0IHByb3AgdG8gYmUgYWJsZSB0byB0dXJuIHRoaW5ncyBvZmYsIG5vZGUgYnkgbm9kZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNJbnNlcnRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5ESVNBQkxFX0lOU0VSVCwgbm9kZSkgPT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0LnNhdmVOZXdOb2RlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjYWxsZWQgdG8gZGlzcGxheSBlZGl0b3IgdGhhdCB3aWxsIGNvbWUgdXAgQkVGT1JFIGFueSBub2RlIGlzIHNhdmVkIG9udG8gdGhlIHNlcnZlciwgc28gdGhhdCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgICAqIGFueSBzYXZlIGlzIHBlcmZvcm1lZCB3ZSB3aWxsIGhhdmUgdGhlIGNvcnJlY3Qgbm9kZSBuYW1lLCBhdCBsZWFzdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgdmVyc2lvbiBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCwgYW5kIGN1cnJlbnRseSB0aGlzIG1lYW5zICdlZGl0aW5nVW5zYXZlZE5vZGUnIGlzIG5vdCBjdXJyZW50bHkgZXZlclxyXG4gICAgICAgICAqIHRyaWdnZXJlZC4gVGhlIG5ldyBhcHByb2FjaCBub3cgdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvICdyZW5hbWUnIG5vZGVzIGlzIHRvIGp1c3QgY3JlYXRlIG9uZSB3aXRoIGFcclxuICAgICAgICAgKiByYW5kb20gbmFtZSBhbiBsZXQgdXNlciBzdGFydCBlZGl0aW5nIHJpZ2h0IGF3YXkgYW5kIHRoZW4gcmVuYW1lIHRoZSBub2RlIElGIGEgY3VzdG9tIG5vZGUgbmFtZSBpcyBuZWVkZWQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIG1lYW5zIGlmIHdlIGNhbGwgdGhpcyBmdW5jdGlvbiAoc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lKSBpbnN0ZWFkIG9mICdzdGFydEVkaXRpbmdOZXdOb2RlKCknXHJcbiAgICAgICAgICogdGhhdCB3aWxsIGNhdXNlIHRoZSBHVUkgdG8gYWx3YXlzIHByb21wdCBmb3IgdGhlIG5vZGUgbmFtZSBiZWZvcmUgY3JlYXRpbmcgdGhlIG5vZGUuIFRoaXMgd2FzIHRoZSBvcmlnaW5hbFxyXG4gICAgICAgICAqIGZ1bmN0aW9uYWxpdHkgYW5kIHN0aWxsIHdvcmtzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDcmVhdGUgc3Vibm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNhdmVOb2RlUmVzcG9uc2UsIHBheWxvYWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLyogYmVjYXN1c2UgSSBkb24ndCB1bmRlcnN0YW5kICdlZGl0aW5nVW5zYXZlZE5vZGUnIHZhcmlhYmxlIGFueSBsb25nZXIgdW50aWwgaSByZWZyZXNoIG15IG1lbW9yeSwgaSB3aWxsIHVzZVxyXG4gICAgICAgICAgICAgICAgdGhlIG9sZCBhcHByb2FjaCBvZiByZWZyZXNoaW5nIGVudGlyZSB0cmVlIHJhdGhlciB0aGFuIG1vcmUgZWZmaWNpZW50IHJlZnJlc25Ob2RlT25QYWdlLCBiZWN1YXNlIGl0IHJlcXVpcmVzXHJcbiAgICAgICAgICAgICAgICB0aGUgbm9kZSB0byBhbHJlYWR5IGJlIG9uIHRoZSBwYWdlLCBhbmQgdGhpcyByZXF1aXJlcyBpbiBkZXB0aCBhbmFseXMgaSdtIG5vdCBnb2luZyB0byBkbyByaWdodCB0aGlzIG1pbnV0ZS5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvL3JlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlID0gZnVuY3Rpb24obW9kZVZhbD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2RlVmFsICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbW9kZVZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMzogcmVhbGx5IGVkaXQgbW9kZSBidXR0b24gbmVlZHMgdG8gYmUgc29tZSBraW5kIG9mIGJ1dHRvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGNhbiBzaG93IGFuIG9uL29mZiBzdGF0ZS5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2luY2UgZWRpdCBtb2RlIHR1cm5zIG9uIGxvdHMgb2YgYnV0dG9ucywgdGhlIGxvY2F0aW9uIG9mIHRoZSBub2RlIHdlIGFyZSB2aWV3aW5nIGNhbiBjaGFuZ2Ugc28gbXVjaCBpdFxyXG4gICAgICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnNhdmVVc2VyUHJlZmVyZW5jZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVVcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlQWJvdmUgPSBnZXROb2RlQWJvdmUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZUFib3ZlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlQWJvdmUubmFtZVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZURvd24gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZUJlbG93OiBqc29uLk5vZGVJbmZvID0gZ2V0Tm9kZUJlbG93KG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVCZWxvdyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUJlbG93Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Ub3AgPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wTm9kZSA9IGdldEZpcnN0Q2hpbGROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9wTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogdG9wTm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Cb3R0b20gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYWJvdmUgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIHRvcCBub2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQWJvdmUgPSBmdW5jdGlvbihub2RlKTogYW55IHtcclxuICAgICAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAob3JkaW5hbCA8PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgLSAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBiZWxvdyB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgYm90dG9tIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCZWxvdyA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3JkaW5hbCA9IFwiICsgb3JkaW5hbCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsID09IC0xIHx8IG9yZGluYWwgPj0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsICsgMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEZpcnN0Q2hpbGROb2RlID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJ1bkVkaXROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gZWRpdE5vZGVDbGljazogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Jbml0Tm9kZUVkaXRSZXF1ZXN0LCBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlPihcImluaXROb2RlRWRpdFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgIH0sIGluaXROb2RlRWRpdFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZSA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuY3VycmVudE5vZGU7XHJcbiAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gcGFyZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZVN1Yk5vZGVVbmRlckhpZ2hsaWdodCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoIXBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVGFwIGEgbm9kZSB0byBpbnNlcnQgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRoaXMgaW5kaWNhdGVzIHdlIGFyZSBOT1QgaW5zZXJ0aW5nIGlubGluZS4gQW4gaW5saW5lIGluc2VydCB3b3VsZCBhbHdheXMgaGF2ZSBhIHRhcmdldC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG5vZGVJbnNlcnRUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlcGx5VG9Db21tZW50ID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgY3JlYXRlU3ViTm9kZSh1aWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vIHVpZCBwcm92aWRlZCB3ZSBkZWFmdWx0IHRvIGNyZWF0aW5nIGEgbm9kZSB1bmRlciB0aGUgY3VycmVudGx5IHZpZXdlZCBub2RlIChwYXJlbnQgb2YgY3VycmVudCBwYWdlKVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBjcmVhdGVTdWJOb2RlOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGlvbnMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogV2UgY291bGQgd3JpdGUgY29kZSB0aGF0IG9ubHkgc2NhbnMgZm9yIGFsbCB0aGUgXCJTRUxcIiBidXR0b25zIGFuZCB1cGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGVtLCBidXQgZm9yIG5vd1xyXG4gICAgICAgICAgICAgKiB3ZSB0YWtlIHRoZSBzaW1wbGUgYXBwcm9hY2ggYW5kIGp1c3QgcmUtcmVuZGVyIHRoZSBwYWdlLiBUaGVyZSBpcyBubyBjYWxsIHRvIHRoZSBzZXJ2ZXIsIHNvIHRoaXMgaXNcclxuICAgICAgICAgICAgICogYWN0dWFsbHkgdmVyeSBlZmZpY2llbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRGVsZXRlIHRoZSBzaW5nbGUgbm9kZSBpZGVudGlmaWVkIGJ5ICd1aWQnIHBhcmFtZXRlciBpZiB1aWQgcGFyYW1ldGVyIGlzIHBhc3NlZCwgYW5kIGlmIHVpZCBwYXJhbWV0ZXIgaXMgbm90XHJcbiAgICAgICAgICogcGFzc2VkIHRoZW4gdXNlIHRoZSBub2RlIHNlbGVjdGlvbnMgZm9yIG11bHRpcGxlIHNlbGVjdGlvbnMgb24gdGhlIHBhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIGRlbGV0ZSBmaXJzdC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc3REZWxldGVTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZU5vZGVzUmVxdWVzdCwganNvbi5EZWxldGVOb2Rlc1Jlc3BvbnNlPihcImRlbGV0ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IHNlbE5vZGVzQXJyYXlcclxuICAgICAgICAgICAgICAgICAgICB9LCBkZWxldGVOb2Rlc1Jlc3BvbnNlLCBudWxsLCB7IFwicG9zdERlbGV0ZVNlbE5vZGVcIjogcG9zdERlbGV0ZVNlbE5vZGUgfSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyB0aGUgbm9kZSB3ZSB3YW50IHRvIHNjcm9sbCB0byBhZnRlciBhIGRlbGV0ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0QmVzdFBvc3REZWxldGVTZWxOb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIC8qIFVzZSBhIGhhc2htYXAtdHlwZSBhcHByb2FjaCB0byBzYXZpbmcgYWxsIHNlbGVjdGVkIG5vZGVzIGludG8gYSBsb291cCBtYXAgKi9cclxuICAgICAgICAgICAgbGV0IG5vZGVzTWFwOiBPYmplY3QgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCgpO1xyXG4gICAgICAgICAgICBsZXQgYmVzdE5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgdGFrZU5leHROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgd2Ugc2NhbiB0aGUgY2hpbGRyZW4sIGFuZCB0aGUgbGFzdCBjaGlsZCB3ZSBlbmNvdW50ZXJkIHVwIHVudGlsIHdlIGZpbmQgdGhlIHJpc3Qgb25lbiBpbiBub2Rlc01hcCB3aWxsIGJlIHRoZVxyXG4gICAgICAgICAgICBub2RlIHdlIHdpbGwgd2FudCB0byBzZWxlY3QgYW5kIHNjcm9sbCB0aGUgdXNlciB0byBBRlRFUiB0aGUgZGVsZXRpbmcgaXMgZG9uZSAqL1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGFrZU5leHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaXMgdGhpcyBub2RlIG9uZSB0byBiZSBkZWxldGVkICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNNYXBbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlTmV4dE5vZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVzdE5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiZXN0Tm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZVNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIG1vdmUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcclxuICAgICAgICAgICAgICAgIFwiQ29uZmlybSBQYXN0ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJQYXN0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSB0byBuZXcgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXMsIG1vdmUuXCIsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2Rlc1RvTW92ZSA9IHNlbE5vZGVzQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTsgLy8gY2xlYXIgc2VsZWN0aW9ucy5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZpbmlzaE1vdmluZ1NlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gTW92ZVwiLCBcIk1vdmUgXCIgKyBub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHRvIHNlbGVjdGVkIGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzLCBtb3ZlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHBhZ2UuIExhdGVyIG9uIHdlIGNhbiBnZXQgbW9yZSBzcGVjaWZpYyBhYm91dCBhbGxvd2luZyBwcmVjaXNlIGRlc3RpbmF0aW9uIGxvY2F0aW9uIGZvciBtb3ZlZFxyXG4gICAgICAgICAgICAgICAgICAgICAqIG5vZGVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk1vdmVOb2Rlc1JlcXVlc3QsIGpzb24uTW92ZU5vZGVzUmVzcG9uc2U+KFwibW92ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXROb2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRDaGlsZElkXCI6IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCA/IGhpZ2hsaWdodE5vZGUuaWQgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogbm9kZXNUb01vdmVcclxuICAgICAgICAgICAgICAgICAgICB9LCBtb3ZlTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnNlcnRCb29rV2FyQW5kUGVhY2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybVwiLCBcIkluc2VydCBib29rIFdhciBhbmQgUGVhY2U/PHAvPldhcm5pbmc6IFlvdSBzaG91bGQgaGF2ZSBhbiBFTVBUWSBub2RlIHNlbGVjdGVkIG5vdywgdG8gc2VydmUgYXMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgYm9vayFcIiwgXCJZZXMsIGluc2VydCBib29rLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbnNlcnRCb29rUmVxdWVzdCwganNvbi5JbnNlcnRCb29rUmVzcG9uc2U+KFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9va05hbWVcIjogXCJXYXIgYW5kIFBlYWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGluc2VydEJvb2tSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1ldGE2NC5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIEFwcGxpY2F0aW9uIGluc3RhbmNlLCBhbmQgY2VudHJhbCByb290IGxldmVsIG9iamVjdCBmb3IgYWxsIGNvZGUsIGFsdGhvdWdoIGVhY2ggbW9kdWxlIGdlbmVyYWxseSBjb250cmlidXRlcyBvbmVcclxuICogc2luZ2xldG9uIHZhcmlhYmxlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHdpdGggYSBuYW1lIHVzdWFsbHkgaWRlbnRpY2FsIHRvIHRoYXQgZmlsZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBtZXRhNjQge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFwcEluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VyVXJsUGF0aDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgICBleHBvcnQgbGV0IHVybENtZDogc3RyaW5nO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVPdmVycmlkZTogc3RyaW5nO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNvZGVGb3JtYXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VydmVyTWFya2Rvd246IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKiB1c2VkIGFzIGEga2luZCBvZiAnc2VxdWVuY2UnIGluIHRoZSBhcHAsIHdoZW4gdW5pcXVlIHZhbHMgYSBuZWVkZWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRHdWlkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKiBuYW1lIG9mIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdXNlck5hbWU6IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcblxyXG4gICAgICAgIC8qIHNjcmVlbiBjYXBhYmlsaXRpZXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZVdpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGV2aWNlSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFVzZXIncyByb290IG5vZGUuIFRvcCBsZXZlbCBvZiB3aGF0IGxvZ2dlZCBpbiB1c2VyIGlzIGFsbG93ZWQgdG8gc2VlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaG9tZU5vZGVJZDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlUGF0aDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBZG1pblVzZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogYWx3YXlzIHN0YXJ0IG91dCBhcyBhbm9uIHVzZXIgdW50aWwgbG9naW4gKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQW5vblVzZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzaWduYWxzIHRoYXQgZGF0YSBoYXMgY2hhbmdlZCBhbmQgdGhlIG5leHQgdGltZSB3ZSBnbyB0byB0aGUgbWFpbiB0cmVlIHZpZXcgd2luZG93IHdlIG5lZWQgdG8gcmVmcmVzaCBkYXRhXHJcbiAgICAgICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0cmVlRGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1aWRUb05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLmlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIGNvdW50ZXIgZm9yIGxvY2FsIHVpZHMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRVaWQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlkZW50VG9VaWRNYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVbmRlciBhbnkgZ2l2ZW4gbm9kZSwgdGhlcmUgY2FuIGJlIG9uZSBhY3RpdmUgJ3NlbGVjdGVkJyBub2RlIHRoYXQgaGFzIHRoZSBoaWdobGlnaHRpbmcsIGFuZCB3aWxsIGJlIHNjcm9sbGVkXHJcbiAgICAgICAgICogdG8gd2hlbmV2ZXIgdGhlIHBhZ2Ugd2l0aCB0aGF0IGNoaWxkIGlzIHZpc2l0ZWQsIGFuZCBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCBob2xkcyB0aGUgbWFwIG9mIFwicGFyZW50IHVpZCB0b1xyXG4gICAgICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAgICAgKiBzZWxlY3RlZCBub2RlIHdpdGhpbiB0aGF0IHBhcmVudC4gTm90ZSB0aGlzICdzZWxlY3Rpb24gc3RhdGUnIGlzIG9ubHkgc2lnbmlmaWNhbnQgb24gdGhlIGNsaWVudCwgYW5kIG9ubHkgZm9yXHJcbiAgICAgICAgICogYmVpbmcgYWJsZSB0byBzY3JvbGwgdG8gdGhlIG5vZGUgZHVyaW5nIG5hdmlnYXRpbmcgYXJvdW5kIG9uIHRoZSB0cmVlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IHsgW2tleTogc3RyaW5nXToganNvbi5Ob2RlSW5mbyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qIFVzZXItc2VsZWN0YWJsZSB1c2VyLWFjY291bnQgb3B0aW9ucyBlYWNoIHVzZXIgY2FuIHNldCBvbiBoaXMgYWNjb3VudCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9BRFZBTkNFRDogc3RyaW5nID0gXCJhZHZhbmNlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTU9ERV9TSU1QTEU6IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgICAgIC8qIGNhbiBiZSAnc2ltcGxlJyBvciAnYWR2YW5jZWQnICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0TW9kZU9wdGlvbjogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2dnbGVkIGJ5IGJ1dHRvbiwgYW5kIGhvbGRzIGlmIHdlIGFyZSBnb2luZyB0byBzaG93IHByb3BlcnRpZXMgb3Igbm90IG9uIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB2aWV3XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93UHJvcGVydGllczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBGbGFnIHRoYXQgaW5kaWNhdGVzIGlmIHdlIGFyZSByZW5kZXJpbmcgcGF0aCwgb3duZXIsIG1vZFRpbWUsIGV0Yy4gb24gZWFjaCByb3cgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dNZXRhRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIExpc3Qgb2Ygbm9kZSBwcmVmaXhlcyB0byBmbGFnIG5vZGVzIHRvIG5vdCBhbGxvdyB0byBiZSBzaG93biBpbiB0aGUgcGFnZSBpbiBzaW1wbGUgbW9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgXCJyZXA6XCI6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVhZE9ubHlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmFyeVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBhbGwgbm9kZSB1aWRzIHRvIHRydWUgaWYgc2VsZWN0ZWQsIG90aGVyd2lzZSB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGRlbGV0ZWQgKG5vdCBleGlzdGluZylcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNlbGVjdGVkTm9kZXM6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBTZXQgb2YgYWxsIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGVkIChmcm9tIHRoZSBhYmJyZXZpYXRlZCBmb3JtKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZXhwYW5kZWRBYmJyZXZOb2RlSWRzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogUmVuZGVyTm9kZVJlc3BvbnNlLmphdmEgb2JqZWN0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZURhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYWxsIHZhcmlhYmxlcyBkZXJpdmFibGUgZnJvbSBjdXJyZW50Tm9kZURhdGEsIGJ1dCBzdG9yZWQgZGlyZWN0bHkgZm9yIHNpbXBsZXIgY29kZS9hY2Nlc3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlVWlkOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVJZDogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlUGF0aDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogTWFwcyBmcm9tIGd1aWQgdG8gRGF0YSBPYmplY3QgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRhdGFPYmpNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVzZXJQcmVmZXJlbmNlczoganNvbi5Vc2VyUHJlZmVyZW5jZXMgPSB7XHJcbiAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiYWR2YW5jZWRNb2RlXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImxhc3ROb2RlXCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcInNob3dNZXRhRGF0YVwiOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTWFpbk1lbnVQYW5lbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkaW5nIG1haW4gbWVudSBwYW5lbFwiKTtcclxuICAgICAgICAgICAgbWVudVBhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSAnZ3VpZCcgb24gdGhpcyBvYmplY3QsIGFuZCBtYWtlcyBkYXRhT2JqTWFwIGFibGUgdG8gbG9vayB1cCB0aGUgb2JqZWN0IHVzaW5nIHRoYXQgZ3VpZCBpbiB0aGVcclxuICAgICAgICAgKiBmdXR1cmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWdpc3RlckRhdGFPYmplY3QgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghZGF0YS5ndWlkKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmd1aWQgPSArK25leHRHdWlkO1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iak1hcFtkYXRhLmd1aWRdID0gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRPYmplY3RCeUd1aWQgPSBmdW5jdGlvbihndWlkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBkYXRhT2JqTWFwW2d1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIG9iamVjdCBub3QgZm91bmQ6IGd1aWQ9XCIgKyBndWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBjYWxsYmFjayBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBhIHNjcmlwdCB0byBydW4sIG9yIGlmIGl0J3MgYSBmdW5jdGlvbiBvYmplY3QgdGhhdCB3aWxsIGJlXHJcbiAgICAgICAgICogdGhlIGZ1bmN0aW9uIHRvIHJ1bi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFdoZW5ldmVyIHdlIGFyZSBidWlsZGluZyBhbiBvbkNsaWNrIHN0cmluZywgYW5kIHdlIGhhdmUgdGhlIGFjdHVhbCBmdW5jdGlvbiwgcmF0aGVyIHRoYW4gdGhlIG5hbWUgb2YgdGhlXHJcbiAgICAgICAgICogZnVuY3Rpb24gKGkuZS4gd2UgaGF2ZSB0aGUgZnVuY3Rpb24gb2JqZWN0IGFuZCBub3QgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gd2UgaGFuZGUgdGhhdCBieSBhc3NpZ25pbmcgYSBndWlkXHJcbiAgICAgICAgICogdG8gdGhlIGZ1bmN0aW9uIG9iamVjdCwgYW5kIHRoZW4gZW5jb2RlIGEgY2FsbCB0byBydW4gdGhhdCBndWlkIGJ5IGNhbGxpbmcgcnVuQ2FsbGJhY2suIFRoZXJlIGlzIGEgbGV2ZWwgb2ZcclxuICAgICAgICAgKiBpbmRpcmVjdGlvbiBoZXJlLCBidXQgdGhpcyBpcyB0aGUgc2ltcGxlc3QgYXBwcm9hY2ggd2hlbiB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gbWFwIGZyb20gYSBzdHJpbmcgdG8gYVxyXG4gICAgICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogY3R4PWNvbnRleHQsIHdoaWNoIGlzIHRoZSAndGhpcycgdG8gY2FsbCB3aXRoIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiwgYW5kIGhhdmUgYSAndGhpcycgY29udGV4dCB0byBiaW5kIHRvIGl0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZW5jb2RlT25DbGljayA9IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY3R4KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJtNjQubWV0YTY0LnJ1bkNhbGxiYWNrKFwiICsgY2FsbGJhY2suZ3VpZCArIFwiLFwiICsgY3R4Lmd1aWQgKyBcIik7XCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm02NC5tZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIpO1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmV4cGVjdGVkIGNhbGxiYWNrIHR5cGUgaW4gZW5jb2RlT25DbGlja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJ1bkNhbGxiYWNrID0gZnVuY3Rpb24oZ3VpZCwgY3R4KSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhT2JqID0gZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBvYmplY3QsIHdlIGV4cGVjdCBpdCB0byBoYXZlIGEgJ2NhbGxiYWNrJyBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAvLyB0aGF0IGlzIGEgZnVuY3Rpb25cclxuICAgICAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgb2sgdG9vXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhT2JqID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IGdldE9iamVjdEJ5R3VpZChjdHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbCh0aGl6KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YU9iaigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJ1bmFibGUgdG8gZmluZCBjYWxsYmFjayBvbiByZWdpc3RlcmVkIGd1aWQ6IFwiICsgZ3VpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpblNpbXBsZU1vZGUgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVkaXRNb2RlT3B0aW9uID09PSBNT0RFX1NJTVBMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBnb1RvTWFpblBhZ2UodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdvVG9NYWluUGFnZSA9IGZ1bmN0aW9uKHJlcmVuZGVyPzogYm9vbGVhbiwgZm9yY2VTZXJ2ZXJSZWZyZXNoPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKGZvcmNlU2VydmVyUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgdHJlZURpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcmVuZGVyIHx8IHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCByZS1yZW5kZXJpbmcgcGFnZSAoZWl0aGVyIGZyb20gc2VydmVyLCBvciBmcm9tIGxvY2FsIGRhdGEsIHRoZW4gd2UganVzdCBuZWVkIHRvIGxpdHRlcmFsbHkgc3dpdGNoXHJcbiAgICAgICAgICAgICAqIHBhZ2UgaW50byB2aXNpYmxlLCBhbmQgc2Nyb2xsIHRvIG5vZGUpXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWxlY3RUYWIgPSBmdW5jdGlvbihwYWdlTmFtZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgaXJvblBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBjb2RlIGNhbiBiZSBtYWRlIG1vcmUgRFJZLCBidXQgaSdtIGp1c3QgdHJ5aW5nIGl0IG91dCBmb3Igbm93LCBzbyBpJ20gbm90IGJvdGhlcmluZyB0byBwZXJmZWN0IGl0IHlldC4gKi9cclxuICAgICAgICAgICAgLy8gJChcIiNtYWluUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAvLyAkKFwiI3RpbWVsaW5lUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gaWYgKHBhZ2VOYW1lID09ICdtYWluVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2UgaWYgKHBhZ2VOYW1lID09ICdzZWFyY2hUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiNzZWFyY2hQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAndGltZWxpbmVUYWJOYW1lJykge1xyXG4gICAgICAgICAgICAvLyAgICAgJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCI4cHggc29saWQgcmVkXCIpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGRhdGEgKGlmIHByb3ZpZGVkKSBtdXN0IGJlIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgZGlhbG9nLCBhbmQgYWxsIHRoZSBkaWFsb2dcclxuICAgICAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgICAgICogT09QIHdpdGggJ3RoaXMnIGJlaW5nIGZpcnN0IHBhcmFtZXRlciBhbHdheXMpLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZVBhZ2UgPSBmdW5jdGlvbihwZz86IGFueSwgZGF0YT86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBnLnRhYklkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvb3BzLCB3cm9uZyBvYmplY3QgdHlwZSBwYXNzZWQgdG8gY2hhbmdlUGFnZSBmdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogdGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHVzaW5nIG1haW5Jcm9uUGFnZXM/PyAqL1xyXG4gICAgICAgICAgICB2YXIgcGFwZXJUYWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluSXJvblBhZ2VzXCIpOyAvL1wiI21haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzTm9kZUJsYWNrTGlzdGVkID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIWluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIG5vZGUubmFtZS5zdGFydHNXaXRoKHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2RlVWlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICB2YXIgc2VsQXJyYXkgPSBbXSwgaWR4ID0gMCwgdWlkO1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aWQgaW4gc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbEFycmF5W2lkeCsrXSA9IHVpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZUlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICB2YXIgc2VsQXJyYXkgPSBbXSwgaWR4ID0gMCwgdWlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHNlbGVjdGVkIG5vZGVzLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChzZWxlY3RlZE5vZGVzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVuYWJsZSB0byBmaW5kIHVpZFRvTm9kZU1hcCBmb3IgdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSBub2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm4gYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgZWFjaCBOb2RlSW5mbyB3aGVyZSB0aGUga2V5IGlzIHRoZSBpZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0U2VsZWN0ZWROb2Rlc0FzTWFwQnlJZCA9IGZ1bmN0aW9uKCk6IE9iamVjdCB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IE9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IHRoaXMuZ2V0U2VsZWN0ZWROb2Rlc0FycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJldFtzZWxBcnJheVtpXS5pZF0gPSBzZWxBcnJheVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogR2V0cyBzZWxlY3RlZCBub2RlcyBhcyBOb2RlSW5mby5qYXZhIG9iamVjdHMgYXJyYXkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBcnJheSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxBcnJheToganNvbi5Ob2RlSW5mb1tdID0gW107XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsZWFyU2VsZWN0ZWROb2RlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxlY3RlZE5vZGVzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMsIG5vZGUpIHtcclxuICAgICAgICAgICAgbGV0IG93bmVyQnVmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbWluZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5vd25lcnMpIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChyZXMub3duZXJzLCBmdW5jdGlvbihpbmRleCwgb3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lciA9PT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gb3duZXI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5vZGUub3duZXIgPSBvd25lckJ1ZjtcclxuICAgICAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI293bmVyRGlzcGxheVwiICsgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmh0bWwoXCIgKE1hbmFnZXI6IFwiICsgb3duZXJCdWYgKyBcIilcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1vdGhlclwiLCBcImNyZWF0ZWQtYnktbWVcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1tZVwiLCBcImNyZWF0ZWQtYnktb3RoZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBkYXRlTm9kZUluZm8gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTm9kZUluZm9SZXNwb25zZShyZXMsIG5vZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZUZyb21JZCA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBqc29uLk5vZGVJbmZvIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkVG9Ob2RlTWFwW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UGF0aE9mVWlkID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIltwYXRoIGVycm9yLiBpbnZhbGlkIHVpZDogXCIgKyB1aWQgKyBcIl1cIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gZnVuY3Rpb24oKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIGxldCByZXQ6IGpzb24uTm9kZUluZm8gPSBwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFtjdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodFJvd0J5SWQgPSBmdW5jdGlvbihpZCwgc2Nyb2xsKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0Tm9kZUZyb21JZChpZCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHROb2RlKG5vZGUsIHNjcm9sbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpZ2hsaWdodFJvd0J5SWQgZmFpbGVkIHRvIGZpbmQgaWQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudDogV2Ugd2FudCB0aGlzIHRvIGJlIHRoZSBvbmx5IG1ldGhvZCB0aGF0IGNhbiBzZXQgdmFsdWVzIG9uICdwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCcsIGFuZCBhbHdheXNcclxuICAgICAgICAgKiBzZXR0aW5nIHRoYXQgdmFsdWUgc2hvdWxkIGdvIHRocnUgdGhpcyBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhpZ2hsaWdodE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBzY3JvbGw6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRvbmVIaWdobGlnaHRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8qIFVuaGlnaGxpZ2h0IGN1cnJlbnRseSBoaWdobGlnaHRlZCBub2RlIGlmIGFueSAqL1xyXG4gICAgICAgICAgICBsZXQgY3VySGlnaGxpZ2h0ZWROb2RlOiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFscmVhZHkgaGlnaGxpZ2h0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmVIaWdobGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQgPSBjdXJIaWdobGlnaHRlZE5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRvbmVIaWdobGlnaHRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd0VsbTogc3RyaW5nID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGZpbmQgcm93RWxlbWVudCB0byBoaWdobGlnaHQ6IFwiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVhbGx5IG5lZWQgdG8gdXNlIHB1Yi9zdWIgZXZlbnQgdG8gYnJvYWRjYXN0IGVuYWJsZW1lbnQsIGFuZCBsZXQgZWFjaCBjb21wb25lbnQgZG8gdGhpcyBpbmRlcGVuZGVudGx5IGFuZFxyXG4gICAgICAgICAqIGRlY291cGxlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICAgICAgbGV0IHNlbE5vZGVDb3VudDogbnVtYmVyID0gdXRpbC5nZXRQcm9wZXJ0eUNvdW50KHNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZUlzTWluZTogYm9vbGVhbiA9IGhpZ2hsaWdodE5vZGUgJiYgKGhpZ2hsaWdodE5vZGUuY3JlYXRlZEJ5ID09PSB1c2VyTmFtZSB8fCBcImFkbWluXCIgPT09IHVzZXJOYW1lKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhvbWVOb2RlSWQ9XCIrbWV0YTY0LmhvbWVOb2RlSWQrXCIgaGlnaGxpZ2h0Tm9kZS5pZD1cIitoaWdobGlnaHROb2RlLmlkKTtcclxuICAgICAgICAgICAgbGV0IGhvbWVOb2RlU2VsZWN0ZWQ6IGJvb2xlYW4gPSBoaWdobGlnaHROb2RlICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZDtcclxuICAgICAgICAgICAgbGV0IGltcG9ydEFsbG93ZWQgPSBpc0FkbWluVXNlciB8fCB1c2VyUHJlZmVyZW5jZXMuaW1wb3J0QWxsb3dlZDtcclxuICAgICAgICAgICAgbGV0IGV4cG9ydEFsbG93ZWQgPSBpc0FkbWluVXNlciB8fCB1c2VyUHJlZmVyZW5jZXMuZXhwb3J0QWxsb3dlZDtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodE9yZGluYWw6IG51bWJlciA9IGdldE9yZGluYWxPZk5vZGUoaGlnaGxpZ2h0Tm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBudW1DaGlsZE5vZGVzOiBudW1iZXIgPSBnZXROdW1DaGlsZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlVXA6IGJvb2xlYW4gPSBoaWdobGlnaHRPcmRpbmFsID4gMCAmJiBudW1DaGlsZE5vZGVzID4gMTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gaGlnaGxpZ2h0T3JkaW5hbCA8IG51bUNoaWxkTm9kZXMgLSAxICYmIG51bUNoaWxkTm9kZXMgPiAxO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbmFibGVtZW50OiBpc0Fub25Vc2VyPVwiICsgaXNBbm9uVXNlciArIFwiIHNlbE5vZGVDb3VudD1cIiArIHNlbE5vZGVDb3VudCArIFwiIHNlbE5vZGVJc01pbmU9XCIgKyBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRBbGxvd2VkKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRBbGxvd2VkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wc1RvZ2dsZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBwcm9wc1RvZ2dsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJjbGVhclNlbGVjdGlvbnNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5pc2hNb3ZpbmdTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVTZWxlY3RlZCkpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVVcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFkbWluTWVudVwiLCBpc0FkbWluVXNlcik7XHJcblxyXG4gICAgICAgICAgICAvL1ZJU0lCSUxJVFlcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5JbXBvcnREbGdcIiwgaW1wb3J0QWxsb3dlZCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRBbGxvd2VkICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJuYXZIb21lQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBpc0FkbWluVXNlciB8fCAodXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgaXNBZG1pblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5Mb2dpbkRsZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibmF2TG9nb3V0QnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIGlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiYWRtaW5NZW51XCIsIGlzQWRtaW5Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNpbmdsZVNlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvdW5kIGEgc2luZ2xlIFNlbCBOb2RlSUQ6IFwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9yZGluYWxPZk5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50Tm9kZURhdGEgfHwgIWN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROdW1DaGlsZE5vZGVzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50Tm9kZURhdGEgfHwgIWN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldEN1cnJlbnROb2RlRGF0YSA9IGZ1bmN0aW9uKGRhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBkYXRhLm5vZGU7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlVWlkID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVQYXRoID0gZGF0YS5ub2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFub25QYWdlTG9hZFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnJlbmRlck5vZGVSZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBsaXN0dmlldyB0bzogXCIgKyByZXMuY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJsaXN0Vmlld1wiLCByZXMuY29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVtb3ZlQmluYXJ5QnlVaWQgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudWlkID09PSB1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmhhc0JpbmFyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVwZGF0ZXMgY2xpZW50IHNpZGUgbWFwcyBhbmQgY2xpZW50LXNpZGUgaWRlbnRpZmllciBmb3IgbmV3IG5vZGUsIHNvIHRoYXQgdGhpcyBub2RlIGlzICdyZWNvZ25pemVkJyBieSBjbGllbnRcclxuICAgICAgICAgKiBzaWRlIGNvZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaXROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgdXBkYXRlTWFwcz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXROb2RlIGhhcyBudWxsIG5vZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogYXNzaWduIGEgcHJvcGVydHkgZm9yIGRldGVjdGluZyB0aGlzIG5vZGUgdHlwZSwgSSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgdXNpbmcgc29tZSBraW5kIG9mIGN1c3RvbSBKU1xyXG4gICAgICAgICAgICAgKiBwcm90b3R5cGUtcmVsYXRlZCBhcHByb2FjaFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZS51aWQgPSB1cGRhdGVNYXBzID8gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKSA6IGlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgICAgIG5vZGUucHJvcGVydGllcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihub2RlLnByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogRm9yIHRoZXNlIHR3byBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFjY2Vzc2VkIGZyZXF1ZW50bHkgd2UgZ28gYWhlYWQgYW5kIGxvb2t1cCB0aGUgcHJvcGVydGllcyBpbiB0aGVcclxuICAgICAgICAgICAgICogcHJvcGVydHkgYXJyYXksIGFuZCBhc3NpZ24gdGhlbSBkaXJlY3RseSBhcyBub2RlIG9iamVjdCBwcm9wZXJ0aWVzIHNvIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UsIGFuZCBhbHNvXHJcbiAgICAgICAgICAgICAqIHNpbXBsaWZ5IGNvZGUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLmNyZWF0ZWRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmxhc3RNb2RpZmllZCA9IG5ldyBEYXRlKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIG5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVNYXBzKSB7XHJcbiAgICAgICAgICAgICAgICB1aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGlkVG9Ob2RlTWFwW25vZGUuaWRdID0gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0Q29uc3RhbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdCwgWyAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QT0xJQ1ksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKHJlYWRPbmx5UHJvcGVydHlMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuVVVJRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNSRUFURUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNSRUFURURfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlksLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKGJpbmFyeVByb3BlcnR5TGlzdCwgW2pjckNuc3QuQklOX0RBVEFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogdGhpcyBhbmQgZXZlcnkgb3RoZXIgbWV0aG9kIHRoYXQncyBjYWxsZWQgYnkgYSBsaXRzdGVuZXIgb3IgYSB0aW1lciBuZWVkcyB0byBoYXZlIHRoZSAnZmF0IGFycm93JyBzeW50YXggZm9yIHRoaXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRBcHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0QXBwIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFwcEluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhYnMgPSB1dGlsLnBvbHkoXCJtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICAgICB0YWJzLmFkZEV2ZW50TGlzdGVuZXIoXCJpcm9uLXNlbGVjdFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRhYkNoYW5nZUV2ZW50KHRhYnMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGluaXRDb25zdGFudHMoKTtcclxuICAgICAgICAgICAgZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMzogaG93IGRvZXMgb3JpZW50YXRpb25jaGFuZ2UgbmVlZCB0byB3b3JrIGZvciBwb2x5bWVyPyBQb2x5bWVyIGRpc2FibGVkXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAkKHdpbmRvdykuYmluZChcImJlZm9yZXVubG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgICAgICogXCJpZD1cXG15XFxwYXRoXCIgdHlwZSBvZiB1cmwgdG8gb3BlbiBhIHNwZWNpZmljIG5vZGUuIE5lZWQgdG8gcmV0aGluayAgQmFzaWNhbGx5IGZvciBub3cgSSdtIHRoaW5raW5nXHJcbiAgICAgICAgICAgICAqIGdvaW5nIHRvIGEgZGlmZmVyZW50IHVybCBzaG91bGRuJ3QgYmxvdyB1cCB0aGUgc2Vzc2lvbiwgd2hpY2ggaXMgd2hhdCAnbG9nb3V0JyBkb2VzLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiAkKHdpbmRvdykub24oXCJ1bmxvYWRcIiwgZnVuY3Rpb24oKSB7IHVzZXIubG9nb3V0KGZhbHNlKTsgfSk7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgZGV2aWNlV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVGhpcyBjYWxsIGNoZWNrcyB0aGUgc2VydmVyIHRvIHNlZSBpZiB3ZSBoYXZlIGEgc2Vzc2lvbiBhbHJlYWR5LCBhbmQgZ2V0cyBiYWNrIHRoZSBsb2dpbiBpbmZvcm1hdGlvbiBmcm9tXHJcbiAgICAgICAgICAgICAqIHRoZSBzZXNzaW9uLCBhbmQgdGhlbiByZW5kZXJzIHBhZ2UgY29udGVudCwgYWZ0ZXIgdGhhdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHVzZXIucmVmcmVzaExvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBDaGVjayBmb3Igc2NyZWVuIHNpemUgaW4gYSB0aW1lci4gV2UgZG9uJ3Qgd2FudCB0byBtb25pdG9yIGFjdHVhbCBzY3JlZW4gcmVzaXplIGV2ZW50cyBiZWNhdXNlIGlmIGEgdXNlclxyXG4gICAgICAgICAgICAgKiBpcyBleHBhbmRpbmcgYSB3aW5kb3cgd2UgYmFzaWNhbGx5IHdhbnQgdG8gbGltaXQgdGhlIENQVSBhbmQgY2hhb3MgdGhhdCB3b3VsZCBlbnN1ZSBpZiB3ZSB0cmllZCB0byBhZGp1c3RcclxuICAgICAgICAgICAgICogdGhpbmdzIGV2ZXJ5IHRpbWUgaXQgY2hhbmdlcy4gU28gd2UgdGhyb3R0bGUgYmFjayB0byBvbmx5IHJlb3JnYW5pemluZyB0aGUgc2NyZWVuIG9uY2UgcGVyIHNlY29uZC4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBhIHRocm90dGxlIHNvcnQgb2YuIFllcyBJIGtub3cgaG93IHRvIGxpc3RlbiBmb3IgZXZlbnRzLiBObyBJJ20gbm90IGRvaW5nIGl0IHdyb25nIGhlcmUuIFRoaXNcclxuICAgICAgICAgICAgICogdGltZXIgaXMgY29ycmVjdCBpbiB0aGlzIGNhc2UgYW5kIGJlaGF2ZXMgc3VwZXJpb3IgdG8gZXZlbnRzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogUG9seW1lci0+ZGlzYWJsZVxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsgdmFyIHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIGlmICh3aWR0aCAhPSBfLmRldmljZVdpZHRoKSB7IC8vIGNvbnNvbGUubG9nKFwiU2NyZWVuIHdpZHRoIGNoYW5nZWQ6IFwiICsgd2lkdGgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBfLmRldmljZVdpZHRoID0gd2lkdGg7IF8uZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBfLnNjcmVlblNpemVDaGFuZ2UoKTsgfSB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVNYWluTWVudVBhbmVsKCk7XHJcbiAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmluaXRQcm9ncmVzc01vbml0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIHByb2Nlc3NVcmxQYXJhbXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvY2Vzc1VybFBhcmFtcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgcGFzc0NvZGUgPSB1dGlsLmdldFBhcmFtZXRlckJ5TmFtZShcInBhc3NDb2RlXCIpO1xyXG4gICAgICAgICAgICBpZiAocGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBDaGFuZ2VQYXNzd29yZERsZyhwYXNzQ29kZSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVybENtZCA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwiY21kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWJDaGFuZ2VFdmVudCA9IGZ1bmN0aW9uKHRhYk5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRhYk5hbWUgPT0gXCJzZWFyY2hUYWJOYW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIHNyY2guc2VhcmNoVGFiQWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGlzcGxheVNpZ251cE1lc3NhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoc2lnbnVwUmVzcG9uc2UgPT09IFwib2tcIikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2lnbnVwIGNvbXBsZXRlLiBZb3UgbWF5IG5vdyBsb2dpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JlZW5TaXplQ2hhbmdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZURhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICAvLyBpZiAoZXZlbnQub3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvYWRBbm9uUGFnZUhvbWUgPSBmdW5jdGlvbihpZ25vcmVVcmwpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQW5vblBhZ2VMb2FkUmVxdWVzdCwganNvbi5Bbm9uUGFnZUxvYWRSZXNwb25zZT4oXCJhbm9uUGFnZUxvYWRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgICAgIH0sIGFub25QYWdlTG9hZFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZVVzZXJQcmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB1c2VyUHJlZmVyZW5jZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5TeXN0ZW1GaWxlID0gZnVuY3Rpb24oZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5PcGVuU3lzdGVtRmlsZVJlcXVlc3QsIGpzb24uT3BlblN5c3RlbUZpbGVSZXNwb25zZT4oXCJvcGVuU3lzdGVtRmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImZpbGVOYW1lXCI6IGZpbGVOYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyogdG9kby0wOiBmb3Igbm93IEknbGwganVzdCBkcm9wIHRoaXMgaW50byBhIGdsb2JhbCB2YXJpYWJsZS4gSSBrbm93IHRoZXJlJ3MgYSBiZXR0ZXIgd2F5LiBUaGlzIGlzIHRoZSBvbmx5IHZhcmlhYmxlXHJcbndlIGhhdmUgb24gdGhlIGdsb2JhbCBuYW1lc3BhY2UsIGFuZCBpcyBvbmx5IHJlcXVpcmVkIGZvciBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbiBpbiBKUyBvbiB0aGUgaW5kZXguaHRtbCBwYWdlICovXHJcbmlmICghd2luZG93W1wibWV0YTY0XCJdKSB7XHJcbiAgICB2YXIgbWV0YTY0ID0gbTY0Lm1ldGE2NDtcclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBuYXYuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbmF2IHtcclxuICAgICAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9yb3dcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTWFpbk1lbnVIZWxwID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL21ldGE2NC9wdWJsaWMvaGVscFwiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuUnNzRmVlZHNOb2RlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL3Jzcy9mZWVkc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBleHBhbmRNb3JlID0gZnVuY3Rpb24obm9kZUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qIEknbSBzZXR0aW5nIHRoaXMgaGVyZSBzbyB0aGF0IHdlIGNhbiBjb21lIHVwIHdpdGggYSB3YXkgdG8gbWFrZSB0aGUgYWJicmV2IGV4cGFuZCBzdGF0ZSBiZSByZW1lbWJlcmVkLCBidXR0b25cclxuICAgICAgICAgICAgdGhpcyBpcyBsb3dlciBwcmlvcml0eSBmb3Igbm93LCBzbyBpJ20gbm90IHVzaW5nIGl0IHlldCAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuZXhwYW5kZWRBYmJyZXZOb2RlSWRzW25vZGVJZF0gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCwganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZT4oXCJleHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkXHJcbiAgICAgICAgICAgIH0sIGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlZBTDogXCIrSlNPTi5zdHJpbmdpZnkocmVzLm5vZGVJbmZvKSk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGVJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5aW5nSG9tZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRWaXNpYmxlVG9Vc2VyID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhZGlzcGxheWluZ0hvbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBMZXZlbFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFyZXMgfHwgIXJlcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBkYXRhIGlzIHZpc2libGUgdG8geW91IGFib3ZlIHRoaXMgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKGlkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlVwTGV2ZWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFyZW50VmlzaWJsZVRvVXNlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGF0IHJvb3QuIENhbid0IGdvIHVwLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IDEsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB1cExldmVsUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgbWV0YTY0LmN1cnJlbnROb2RlSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudFNlbE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW2N1cnJlbnRTZWxOb2RlLnVpZF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGhpZ2hsaWdodGVkIG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb29raW5nIHVwIHVzaW5nIGVsZW1lbnQgaWQ6IFwiK25vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIERPTSBlbGVtZW50IG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkUG9seUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRTZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGhpZ2hsaWdodGVkIG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIHVwIHVzaW5nIGVsZW1lbnQgaWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLnBvbHlFbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbm9kZSBoaWdobGlnaHRlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tPbk5vZGVSb3cgcmVjaWV2ZWQgdWlkIHRoYXQgZG9lc24ndCBtYXAgdG8gYW55IG5vZGUuIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmVkIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICAgICAqIGlmIG5vbi1udWxsIGl0J3MgYWxyZWFkeSBkaXNwbGF5aW5nIGFuZCB3ZSBkbyBub3RoaW5nLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgdXBkYXRlTm9kZUluZm9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTm9kZSA9IGZ1bmN0aW9uKHVpZCk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG5vZGUuaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAgICAgKiBzaWxseSBsb29raW5nIGFzeW5jIHRpbWVyIGhlcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b2dnbGVOb2RlU2VsID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246IGFueSA9IHV0aWwucG9seUVsbSh1aWQgKyBcIl9zZWxcIik7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzW3VpZF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlBhZ2VOb2RlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYXZIb21lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmhvbWVOb2RlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2UHVibGljSG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJlZnMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJlZnMge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsb3NlQWNjb3VudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiT2ggTm8hXCIsIFwiQ2xvc2UgeW91ciBBY2NvdW50PzxwPiBBcmUgeW91IHN1cmU/XCIsIFwiWWVzLCBDbG9zZSBBY2NvdW50LlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9uZSBtb3JlIENsaWNrXCIsIFwiWW91ciBkYXRhIHdpbGwgYmUgZGVsZXRlZCBhbmQgY2FuIG5ldmVyIGJlIHJlY292ZXJlZC48cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNsb3NlQWNjb3VudFJlcXVlc3QsIGpzb24uQ2xvc2VBY2NvdW50UmVzcG9uc2U+KFwiY2xvc2VBY2NvdW50XCIsIHt9LCBjbG9zZUFjY291bnRSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcm9wcy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwcm9wcyB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc2V0RGF0YUljb25Vc2luZ0lkKFwiI2VkaXRNb2RlQnV0dG9uXCIsIGVkaXRNb2RlID8gXCJlZGl0XCIgOlxyXG4gICAgICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgICAgICAvLyB2YXIgZWxtID0gJChcIiNwcm9wc1RvZ2dsZUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAgICAgKiBub2RlIGFuZCBwdXRzIGl0IG9uIHRoZSB0b3AsIGFuZCB0aGVuIGRvZXMgc2FtZSBmb3IgJ2pjdENuc3QuVEFHUydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlciA9IGZ1bmN0aW9uKHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRJZHg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnSWR4OiBudW1iZXIgPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5DT05URU5UKTtcclxuICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFnSWR4ID0gcHJvcHNOZXcuaW5kZXhPZkl0ZW1CeVByb3AoXCJuYW1lXCIsIGpjckNuc3QuVEFHUyk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHByb3BzTmV3LmFycmF5TW92ZUl0ZW0odGFnSWR4LCB0YXJnZXRJZHgrKyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogcHJvcGVydGllcyB3aWxsIGJlIG51bGwgb3IgYSBsaXN0IG9mIFByb3BlcnR5SW5mbyBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcGVydHkubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLW5hbWUtY29sXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BlcnR5Lm5hbWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmluYXJ5UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gXCJbYmluYXJ5XVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS5odG1sVmFsdWUgPyBwcm9wZXJ0eS5odG1sVmFsdWUgOiBwcm9wZXJ0eS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZCArPSByZW5kZXIudGFnKFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtdmFsLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHZhbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZSArPSByZW5kZXIudGFnKFwidHJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3AtdGFibGUtcm93XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcENvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInRhYmxlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlclwiOiBcIjFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcGVydHktdGFibGVcIlxyXG4gICAgICAgICAgICAgICAgfSwgdGFibGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBicnV0ZSBmb3JjZSBzZWFyY2hlcyBvbiBub2RlIChOb2RlSW5mby5qYXZhKSBvYmplY3QgcHJvcGVydGllcyBsaXN0LCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgcHJvcGVydHlcclxuICAgICAgICAgKiAoUHJvcGVydHlJbmZvLmphdmEpIHdpdGggbmFtZSBtYXRjaGluZyBwcm9wZXJ0eU5hbWUsIGVsc2UgbnVsbC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IGpzb24uUHJvcGVydHlJbmZvIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBub2RlLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0Tm9kZVByb3BlcnR5VmFsID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lLCBub2RlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gZ2V0Tm9kZVByb3BlcnR5KHByb3BlcnR5TmFtZSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBrbm93IHdobyBvd25zIHRoaXMgbm9kZSBhc3N1bWUgdGhlIGFkbWluIG93bnMgaXQuXHJcbiAgICAgICAgICAgIGlmICghY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkQnkgPSBcImFkbWluXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFRoaXMgaXMgT1IgY29uZGl0aW9uIGJlY2F1c2Ugb2YgY3JlYXRlZEJ5IGlzIG51bGwgd2UgYXNzdW1lIHdlIGRvIG5vdCBvd24gaXQgKi9cclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vbk93bmVkQ29tbWVudE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSA9PSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHByb3BlcnR5IHZhbHVlLCBldmVuIGlmIG11bHRpcGxlIHByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZSB8fCBwcm9wZXJ0eS52YWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0xOiBtYWtlIHN1cmUgdGhpcyB3cmFwSHRtbCBpc24ndCBjcmVhdGluZyBhbiB1bm5lY2Vzc2FyeSBESVYgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXIud3JhcEh0bWwocHJvcGVydHkuaHRtbFZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24odmFsdWVzKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICQuZWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGNuc3QuQlI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcmVuZGVyLmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgcG9zdFRhcmdldFVybDtcclxuZGVjbGFyZSB2YXIgcHJldHR5UHJpbnQ7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcmVuZGVyIHtcclxuICAgICAgICBsZXQgZGVidWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBjb250ZW50IGRpc3BsYXllZCB3aGVuIHRoZSB1c2VyIHNpZ25zIGluLCBhbmQgd2Ugc2VlIHRoYXQgdGhleSBoYXZlIG5vIGNvbnRlbnQgYmVpbmcgZGlzcGxheWVkLiBXZVxyXG4gICAgICAgICAqIHdhbnQgdG8gZ2l2ZSB0aGVtIHNvbWUgaW5zdHJ1Y3Rpb25zIGFuZCB0aGUgYWJpbGl0eSB0byBhZGQgY29udGVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgZ2V0RW1wdHlQYWdlUHJvbXB0ID0gZnVuY3Rpb24oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPHA+VGhlcmUgYXJlIG5vIHN1Ym5vZGVzIHVuZGVyIHRoaXMgbm9kZS4gPGJyPjxicj5DbGljayAnRURJVCBNT0RFJyBhbmQgdGhlbiB1c2UgdGhlICdBREQnIGJ1dHRvbiB0byBjcmVhdGUgY29udGVudC48L3A+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVuZGVyQmluYXJ5ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGUuYmluYXJ5SXNJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VJbWFnZVRhZyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgYW4gaW1hZ2Ugd2UgcmVuZGVyIGEgbGluayB0byB0aGUgYXR0YWNobWVudCwgc28gdGhhdCBpdCBjYW4gYmUgZG93bmxvYWRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuY2hvcjogc3RyaW5nID0gdGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJocmVmXCI6IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpXHJcbiAgICAgICAgICAgICAgICB9LCBcIltEb3dubG9hZCBBdHRhY2htZW50XVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYmluYXJ5LWxpbmtcIlxyXG4gICAgICAgICAgICAgICAgfSwgYW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQgbGl0dGxlIG1ldGhvZCBoZXJlLiBBbGwgR1VJIHBhZ2UvZGl2cyBhcmUgY3JlYXRlZCB1c2luZyB0aGlzIHNvcnQgb2Ygc3BlY2lmaWNhdGlvbiBoZXJlIHRoYXQgdGhleVxyXG4gICAgICAgICAqIGFsbCBtdXN0IGhhdmUgYSAnYnVpbGQnIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCBmaXJzdCB0aW1lIG9ubHksIGFuZCB0aGVuIHRoZSAnaW5pdCcgbWV0aG9kIGNhbGxlZCBiZWZvcmUgZWFjaFxyXG4gICAgICAgICAqIHRpbWUgdGhlIGNvbXBvbmVudCBnZXRzIGRpc3BsYXllZCB3aXRoIG5ldyBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmICdkYXRhJyBpcyBwcm92aWRlZCwgdGhpcyBpcyB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpZFBhZ2UgPSBmdW5jdGlvbihwZywgZGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkUGFnZTogcGcuZG9tSWQ9XCIgKyBwZy5kb21JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBnLmJ1aWx0IHx8IGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHBnLmJ1aWxkKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGcuaW5pdCkge1xyXG4gICAgICAgICAgICAgICAgcGcuaW5pdChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlsZFJvd0hlYWRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoOiBib29sZWFuLCBzaG93TmFtZTogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGhlYWRlclRleHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXYgY2xhc3M9J3BhdGgtZGlzcGxheSc+UGF0aDogXCIgKyBmb3JtYXRQYXRoKG5vZGUpICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxkaXY+XCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xheno6IHN0cmluZyA9IChjb21tZW50QnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNvbW1lbnQgQnk6IFwiICsgY29tbWVudEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH0gLy9cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5jcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKG5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5DcmVhdGVkIEJ5OiBcIiArIG5vZGUuY3JlYXRlZEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBpZD0nb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCArIFwiJz48L3NwYW4+XCI7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIiAgTW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBjb21tZW50aW5nOiBJIGRlY2lkZWQgdXNlcnMgd2lsbCB1bmRlcnN0YW5kIHRoZSBwYXRoIGFzIGEgc2luZ2xlIGxvbmcgZW50aXR5IHdpdGggbGVzcyBjb25mdXNpb24gdGhhblxyXG4gICAgICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIk5hbWU6IFwiICsgbm9kZS5uYW1lICsgXCIgW3VpZD1cIiArIG5vZGUudWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhlYWRlci10ZXh0XCJcclxuICAgICAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyVGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUGVnZG93biBtYXJrZG93biBwcm9jZXNzb3Igd2lsbCBjcmVhdGUgPGNvZGU+IGJsb2NrcyBhbmQgdGhlIGNsYXNzIGlmIHByb3ZpZGVkLCBzbyBpbiBvcmRlciB0byBnZXQgZ29vZ2xlXHJcbiAgICAgICAgICogcHJldHRpZmllciB0byBwcm9jZXNzIGl0IHRoZSByZXN0IG9mIHRoZSB3YXkgKHdoZW4gd2UgY2FsbCBwcmV0dHlQcmludCgpIGZvciB0aGUgd2hvbGUgcGFnZSkgd2Ugbm93IHJ1blxyXG4gICAgICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmplY3RDb2RlRm9ybWF0dGluZyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghY29udGVudCkgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgICAgIC8vIGBgYGpzXHJcbiAgICAgICAgICAgIC8vIHZhciB4ID0gMTA7XHJcbiAgICAgICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgICAgIC8vIGBgYFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBpZiAoY29udGVudC5jb250YWlucyhcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBlbmNvZGVMYW5ndWFnZXMoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPC9jb2RlPlwiLCBcIjwvcHJlPlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdFN1YnN0aXR1dGlvbnMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudC5yZXBsYWNlQWxsKFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlbmNvZGVMYW5ndWFnZXMgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICAgICAqIHNvbWV3aGVyZSwgYW5kIGZpbGwgb3V0IGEgbG90IG1vcmUgZmlsZSB0eXBlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjxjb2RlIGNsYXNzPVxcXCJcIiArIGxhbmdzW2ldICsgXCJcXFwiPlwiLCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGU+XCIsIFwiPHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWZ0ZXIgYSBwcm9wZXJ0eSwgb3Igbm9kZSBpcyB1cGRhdGVkIChzYXZlZCkgd2UgY2FuIG5vdyBjYWxsIHRoaXMgbWV0aG9kIGluc3RlYWQgb2YgcmVmcmVzaGluZyB0aGUgZW50aXJlIHBhZ2VcclxuICAgICAgICB3aGljaCBpcyB3aGF0J3MgZG9uZSBpbiBtb3N0IG9mIHRoZSBhcHAsIHdoaWNoIGlzIG11Y2ggbGVzcyBlZmZpY2llbnQgYW5kIHNuYXBweSB2aXN1YWxseSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaE5vZGVPblBhZ2UgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vbmVlZCB0byBsb29rdXAgdWlkIGZyb20gTm9kZUluZm8uaWQgdGhlbiBzZXQgdGhlIGNvbnRlbnQgb2YgdGhpcyBkaXYuXHJcbiAgICAgICAgICAgIC8vXCJpZFwiOiB1aWQgKyBcIl9jb250ZW50XCJcclxuICAgICAgICAgICAgLy90byB0aGUgdmFsdWUgZnJvbSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtZXRhNjQuaWRlbnRUb1VpZE1hcFtub2RlLmlkXTtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZUlkIFwiICsgbm9kZS5pZCArIFwiIGluIHVpZCBtYXBcIjtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHVpZCAhPSBub2RlLnVpZCkgdGhyb3cgXCJ1aWQgY2hhbmdlZCB1bmV4cGVjdGx5IGFmdGVyIGluaXROb2RlXCI7XHJcbiAgICAgICAgICAgIGxldCByb3dDb250ZW50OiBzdHJpbmcgPSByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHVpZCArIFwiX2NvbnRlbnRcIikuaHRtbChyb3dDb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZW5kZXJzIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB3aW5kb3cuIFRoZSByZW5kZXJpbmcgaW4gaGVyZSBpcyB2ZXJ5IGNlbnRyYWwgdG8gdGhlXHJcbiAgICAgICAgICogYXBwIGFuZCBpcyB3aGF0IHRoZSB1c2VyIHNlZXMgY292ZXJpbmcgOTAlIG9mIHRoZSBzY3JlZW4gbW9zdCBvZiB0aGUgdGltZS4gVGhlIFwiY29udGVudCogbm9kZXMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiB0b2RvLTA6IFJhdGhlciB0aGFuIGhhdmluZyB0aGlzIG5vZGUgcmVuZGVyZXIgaXRzZWxmIGJlIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgYWxsIHRoZSBkaWZmZXJlbnQgdHlwZXNcclxuICAgICAgICAgKiBvZiBub2RlcywgbmVlZCBhIG1vcmUgcGx1Z2dhYmxlIGRlc2lnbiwgd2hlcmUgcmVuZGVpbmcgb2YgZGlmZmVyZW50IHRoaW5ncyBpcyBkZWxldGFnZWQgdG8gc29tZVxyXG4gICAgICAgICAqIGFwcHJvcHJpYXRlIG9iamVjdC9zZXJ2aWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJOb2RlQ29udGVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluLCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJldDogc3RyaW5nID0gZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRvZG8tMjogZW5hYmxlIGhlYWRlclRleHQgd2hlbiBhcHByb3ByaWF0ZSBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd01ldGFEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gc2hvd0hlYWRlciA/IGJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkgOiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnNob3dQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlbmRlckNvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNwZWNpYWwgUmVuZGVyaW5nIGZvciBTZWFyY2ggUmVzdWx0XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkpTT05fRklMRV9TRUFSQ0hfUkVTVUxULCBub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hSZXN1bHRQcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpjckNvbnRlbnQgPSByZW5kZXJKc29uRmlsZVNlYXJjaFJlc3VsdFByb3BlcnR5KHNlYXJjaFJlc3VsdFByb3AudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIFJTUyBGZWVkIG5vZGVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByc3NGZWVkVGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwicnNzRmVlZFRpdGxlXCIsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyc3NGZWVkVGl0bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gcG9kY2FzdC5yZW5kZXJGZWVkTm9kZShub2RlLCByb3dTdHlsaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFNwZWNpYWwgUmVuZGVyaW5nIGZvciBSU1MgRW50cnlcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByc3NMaW5rOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcInJzc0VudHJ5TGlua1wiLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnNzTGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBwb2RjYXN0LnJlbmRlckVudHJ5Tm9kZShub2RlLCByb3dTdHlsaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250ZW50UHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5DT05URU5ULCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvbnRlbnRQcm9wOiBcIiArIGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHByb3BzLnJlbmRlclByb3BlcnR5KGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCA9IFwiPGRpdj5cIiArIGpjckNvbnRlbnQgKyBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGE2NC5zZXJ2ZXJNYXJrZG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCA9IGluamVjdENvZGVGb3JtYXR0aW5nKGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCA9IGluamVjdFN1YnN0aXR1dGlvbnMoamNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9iYWJseSBjb3VsZCB1c2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJpbWcudG9wLnJpZ2h0XCIgZmVhdHVyZSBmb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gKEFsc28gbmVlZCB0byBtYWtlIHRoaXMgYSBjb25maWd1cmFibGUgb3B0aW9uLCBiZWNhdXNlIG90aGVyIGNsb25lcyBvZiBtZXRhNjQgZG9uJ3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2FudCBteSBnaXRodWIgbGluayEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSSBkZWNpZGVkIGZvciBub3cgSSBkb24ndCB3YW50IHRvIHNob3cgdGhlIGZvcmstbWUtb24tZ2l0aHViIGltYWdlIGF0IHVwcGVyIHJpZ2h0IG9mIGFwcCwgYnV0IHVuY29tbWVudGluZyB0aGlzIGxpbmUgaXMgYWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGF0J3MgcmVxdWlyZWQgdG8gYnJpbmcgaXQgYmFjay5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCIrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEkgc3BlbnQgaG91cnMgdHJ5aW5nIHRvIGdldCBtYXJrZWQtZWxlbWVudCB0byB3b3JrLiBVbnN1Y2Nlc3NmdWwgc3RpbGwsIHNvIEkganVzdCBoYXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHNlcnZlck1hcmtkb3duIGZsYWcgdGhhdCBJIGNhbiBzZXQgdG8gdHJ1ZSwgYW5kIHR1cm4gdGhpcyBleHBlcmltZW50YWwgZmVhdHVyZSBvZmYgZm9yIG5vdy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGFsdGVybmF0ZSBhdHRyaWJ1dGUgd2F5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBqY3JDb250ZW50ID0gamNyQ29udGVudC5yZXBsYWNlQWxsKFwiJ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJ7e3F1b3R9fVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hcmtkb3duPSdcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBqY3JDb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyArIFwiJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sIGpjci1jb250ZW50Jz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8bWFya2VkLWVsZW1lbnQgc2FuaXRpemU9J3RydWUnPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0YWcoXCJzY3JpcHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0L21hcmtkb3duXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9iYWJseSBjb3VsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIGlmIHdlIHdhbnRlZCB0by4gb29wcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vQ2xheS1GZXJndXNvbi9tZXRhNjQnPjxpbWcgc3JjPScvZm9yay1tZS1vbi1naXRodWIucG5nJyBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj48L21hcmtlZC1lbGVtZW50PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBpZiAoamNyQ29udGVudC5sZW5ndGggPiAwKSB7IGlmIChyb3dTdHlsaW5nKSB7IHJldCArPSB0YWcoXCJkaXZcIiwgeyBcImNsYXNzXCIgOiBcImpjci1jb250ZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogamNyQ29udGVudCk7IH0gZWxzZSB7IHJldCArPSB0YWcoXCJkaXZcIiwgeyBcImNsYXNzXCIgOiBcImpjci1yb290LWNvbnRlbnRcIiB9LCAvLyBwcm9iYWJseSBjb3VsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvciB0aGlzIC8vIGlmIHdlIHdhbnRlZCB0by4gb29wcy4gXCI8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vQ2xheS1GZXJndXNvbi9tZXRhNjQnPjxpbWcgc3JjPScvZm9yay1tZS1vbi1naXRodWIucG5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiICsgamNyQ29udGVudCk7IH0gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnBhdGgudHJpbSgpID09IFwiL1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIlJvb3QgTm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyByZXQgKz0gXCI8ZGl2PltObyBDb250ZW50IFByb3BlcnR5XTwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0aWVzOiBzdHJpbmcgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlbmRlckJpbiAmJiBub2RlLmhhc0JpbmFyeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJpbmFyeTogc3RyaW5nID0gcmVuZGVyQmluYXJ5KG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBXZSBhcHBlbmQgdGhlIGJpbmFyeSBpbWFnZSBvciByZXNvdXJjZSBsaW5rIGVpdGhlciBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0IG9yIGF0IHRoZSBsb2NhdGlvbiB3aGVyZVxyXG4gICAgICAgICAgICAgICAgICogdGhlIHVzZXIgaGFzIHB1dCB7e2luc2VydC1hdHRhY2htZW50fX0gaWYgdGhleSBhcmUgdXNpbmcgdGhhdCB0byBtYWtlIHRoZSBpbWFnZSBhcHBlYXIgaW4gYSBzcGVjaWZpY1xyXG4gICAgICAgICAgICAgICAgICogbG9jYXRpbyBpbiB0aGUgY29udGVudCB0ZXh0LlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAocmV0LmNvbnRhaW5zKGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0LnJlcGxhY2VBbGwoY25zdC5JTlNFUlRfQVRUQUNITUVOVCwgYmluYXJ5KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGJpbmFyeTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRhZ3M6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlRBR1MsIG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodGFncykge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRhZ3MtY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCBcIlRhZ3M6IFwiICsgdGFncyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkgPSBmdW5jdGlvbihqc29uQ29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb246IFwiICsganNvbkNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gSlNPTi5wYXJzZShqc29uQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZURpdiA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzeXN0ZW1GaWxlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZW50cnkuZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxPcGVuTGluayA9IHRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogXCJtNjQubWV0YTY0Lm9wZW5TeXN0ZW1GaWxlKCdcIiArIGVudHJ5LmZpbGVOYW1lICsgXCInKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJMb2NhbCBPcGVuXCIpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkb3dubG9hZExpbmsgPSB0YWcoXCJhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IFwibTY0Lm1ldGE2NC5kb3dubG9hZFN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkRvd25sb2FkXCIpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5rc0RpdiA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbG9jYWxPcGVuTGluayArIGRvd25sb2FkTGluayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB9LCBmaWxlTmFtZURpdiArIGxpbmtzRGl2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiW3JlbmRlciBmYWlsZWRdXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIHByaW1hcnkgbWV0aG9kIGZvciByZW5kZXJpbmcgZWFjaCBub2RlIChsaWtlIGEgcm93KSBvbiB0aGUgbWFpbiBIVE1MIHBhZ2UgdGhhdCBkaXNwbGF5cyBub2RlXHJcbiAgICAgICAgICogY29udGVudC4gVGhpcyBnZW5lcmF0ZXMgdGhlIEhUTUwgZm9yIGEgc2luZ2xlIHJvdy9ub2RlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogbm9kZSBpcyBhIE5vZGVJbmZvLmphdmEgSlNPTlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZUFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBpbmRleDogbnVtYmVyLCBjb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBsZXQgY2FuTW92ZVVwOiBib29sZWFuID0gaW5kZXggPiAwICYmIHJvd0NvdW50ID4gMTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gaW5kZXggPCBjb3VudCAtIDE7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSBub2RlLm5hbWUuc3RhcnRzV2l0aChcInJlcDpcIikgfHwgLypcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz9cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqL25vZGUucGF0aC5jb250YWlucyhcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVkaXRpbmdBbGxvd2VkOiBib29sZWFuID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBOb2RlIFJvd1tcIiArIGluZGV4ICsgXCJdIGVkaXRpbmdBbGxvd2VkPVwiK2VkaXRpbmdBbGxvd2VkKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIG5vdCBzZWxlY3RlZCBieSBiZWluZyB0aGUgbmV3IGNoaWxkLCB0aGVuIHdlIHRyeSB0byBzZWxlY3QgYmFzZWQgb24gaWYgdGhpcyBub2RlIHdhcyB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgICAgICogY2xpY2tlZCBvbiBmb3IgdGhpcyBwYWdlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0ZXN0OiBbXCIgKyBwYXJlbnRJZFRvRm9jdXNJZE1hcFtjdXJyZW50Tm9kZUlkXVxyXG4gICAgICAgICAgICAvLyArXCJdPT1bXCIrIG5vZGUuaWQgKyBcIl1cIilcclxuICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gKGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhckh0bWxSZXQ6IHN0cmluZyA9IG1ha2VSb3dCdXR0b25CYXJIdG1sKG5vZGUsIGNhbk1vdmVVcCwgY2FuTW92ZURvd24sIGVkaXRpbmdBbGxvd2VkKTtcclxuICAgICAgICAgICAgbGV0IGJrZ1N0eWxlOiBzdHJpbmcgPSBnZXROb2RlQmtnSW1hZ2VTdHlsZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5vZGUtdGFibGUtcm93XCIgKyAoc2VsZWN0ZWQgPyBcIiBhY3RpdmUtcm93XCIgOiBcIiBpbmFjdGl2ZS1yb3dcIiksXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsIC8vXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBia2dTdHlsZVxyXG4gICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXJIdG1sUmV0ICsgdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgfSwgcmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd05vZGVVcmwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IG11c3QgZmlyc3QgY2xpY2sgb24gYSBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gbm9kZS5wYXRoLnN0cmlwSWZTdGFydHNXaXRoKFwiL3Jvb3RcIik7XHJcbiAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIj9pZD1cIiArIHBhdGg7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtZXNzYWdlOiBzdHJpbmcgPSBcIlVSTCB1c2luZyBwYXRoOiA8YnI+XCIgKyB1cmw7XHJcbiAgICAgICAgICAgIGxldCB1dWlkOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJqY3I6dXVpZFwiLCBub2RlKTtcclxuICAgICAgICAgICAgaWYgKHV1aWQpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCI8cD5VUkwgZm9yIFVVSUQ6IDxicj5cIiArIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIj9pZD1cIiArIHV1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtZXNzYWdlLCBcIlVSTCBvZiBOb2RlXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFRvcFJpZ2h0SW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCB0b3BSaWdodEltZzogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcudG9wLnJpZ2h0Jywgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCB0b3BSaWdodEltZ1RhZzogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHRvcFJpZ2h0SW1nKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BSaWdodEltZ1RhZyA9IHRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogdG9wUmlnaHRJbWcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRvcC1yaWdodC1pbWFnZVwiXHJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRvcFJpZ2h0SW1nVGFnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQmtnSW1hZ2VTdHlsZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYmtnSW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy5ub2RlLmJrZycsIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgYmtnSW1nU3R5bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChia2dJbWcpIHtcclxuICAgICAgICAgICAgICAgIGJrZ0ltZ1N0eWxlID0gXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBia2dJbWcgKyBcIik7XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJrZ0ltZ1N0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjZW50ZXJlZEJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM/OiBzdHJpbmcsIGNsYXNzZXM/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dCBcIiArIGNsYXNzZXNcclxuICAgICAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IFwiICsgY2xhc3Nlc1xyXG4gICAgICAgICAgICB9LCBidXR0b25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVJvd0J1dHRvbkJhckh0bWwgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBjYW5Nb3ZlVXA6IGJvb2xlYW4sIGNhbk1vdmVEb3duOiBib29sZWFuLCBlZGl0aW5nQWxsb3dlZDogYm9vbGVhbikge1xyXG5cclxuICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBvcGVuQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgc2VsQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGVkaXROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVVcEJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1vdmVOb2RlRG93bkJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGluc2VydE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5yZXBseVRvQ29tbWVudCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgLyogQ29uc3RydWN0IE9wZW4gQnV0dG9uICovXHJcbiAgICAgICAgICAgIGlmIChub2RlSGFzQ2hpbGRyZW4obm9kZS51aWQpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgIG9wZW5CdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBGb3Igc29tZSB1bmtub3duIHJlYXNvbiB0aGUgYWJpbGl0eSB0byBzdHlsZSB0aGlzIHdpdGggdGhlIGNsYXNzIGJyb2tlLCBhbmQgZXZlblxyXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyIGRlZGljYXRpbmcgc2V2ZXJhbCBob3VycyB0cnlpbmcgdG8gZmlndXJlIG91dCB3aHkgSSdtIHN0aWxsIGJhZmZsZWQuIEkgY2hlY2tlZCBldmVyeXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgYSBodW5kcmVkIHRpbWVzIGFuZCBzdGlsbCBkb24ndCBrbm93IHdoYXQgSSdtIGRvaW5nIHdyb25nLi4uSSBqdXN0IGZpbmFsbHkgcHV0IHRoZSBnb2QgZGFtbiBmdWNraW5nIHN0eWxlIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGhlcmUgdG8gYWNjb21wbGlzaCB0aGUgc2FtZSB0aGluZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcImdyZWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImJhY2tncm91bmQtY29sb3I6ICM0Y2FmNTA7Y29sb3I6d2hpdGU7XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubmF2Lm9wZW5Ob2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIi8vXHJcbiAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiT3BlblwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgaW4gZWRpdCBtb2RlIHdlIGFsd2F5cyBhdCBsZWFzdCBjcmVhdGUgdGhlIHBvdGVudGlhbCAoYnV0dG9ucykgZm9yIGEgdXNlciB0byBpbnNlcnQgY29udGVudCwgYW5kIGlmXHJcbiAgICAgICAgICAgICAqIHRoZXkgZG9uJ3QgaGF2ZSBwcml2aWxlZ2VzIHRoZSBzZXJ2ZXIgc2lkZSBzZWN1cml0eSB3aWxsIGxldCB0aGVtIGtub3cuIEluIHRoZSBmdXR1cmUgd2UgY2FuIGFkZCBtb3JlXHJcbiAgICAgICAgICAgICAqIGludGVsbGlnZW5jZSB0byB3aGVuIHRvIHNob3cgdGhlc2UgYnV0dG9ucyBvciBub3QuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFZGl0aW5nIGFsbG93ZWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1tub2RlLnVpZF0gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgbm9kZUlkIFwiICsgbm9kZS51aWQgKyBcIiBzZWxlY3RlZD1cIiArIHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNzczogT2JqZWN0ID0gc2VsZWN0ZWQgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLnVpZCArIFwiX3NlbFwiLC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNoZWNrZWRcIjogXCJjaGVja2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy9wYWRkaW5nIGlzIGEgYmFjayBoYWNrIHRvIG1ha2UgY2hlY2tib3ggbGluZSB1cCB3aXRoIG90aGVyIGljb25zLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vKGkgd2lsbCBwcm9iYWJseSBlbmQgdXAgdXNpbmcgYSBwYXBlci1pY29uLWJ1dHRvbiB0aGF0IHRvZ2dsZXMgaGVyZSwgaW5zdGVhZCBvZiBjaGVja2JveClcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgfSA6IC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi10b3A6IDExcHg7XCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbEJ1dHRvbiA9IHRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGNzcywgXCJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTkVXX09OX1RPT0xCQVIgJiYgIWNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOnBpY3R1cmUtaW4tcGljdHVyZS1hbHRcIiwgLy9cImljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5JTlNfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlXCIsIC8vXCJpY29uczptb3JlLWhvcml6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5pbnNlcnROb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiSW5zXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL1BvbG1lciBJY29ucyBSZWZlcmVuY2U6IGh0dHBzOi8vZWxlbWVudHMucG9seW1lci1wcm9qZWN0Lm9yZy9lbGVtZW50cy9pcm9uLWljb25zP3ZpZXc9ZGVtbzpkZW1vL2luZGV4Lmh0bWxcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGVCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbHRcIjogXCJFZGl0IG5vZGUuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImVkaXRvcjptb2RlLWVkaXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQucnVuRWRpdE5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0Lk1PVkVfVVBET1dOX09OX1RPT0xCQVIgJiYgbWV0YTY0LmN1cnJlbnROb2RlLmNoaWxkcmVuT3JkZXJlZCAmJiAhY29tbWVudEJ5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlVXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZVVwQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctdXB3YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQubW92ZU5vZGVVcCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXCJVcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlRG93bkJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWNvblwiOiBcImljb25zOmFycm93LWRvd253YXJkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQubW92ZU5vZGVEb3duKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIkRuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaSB3aWxsIGJlIGZpbmRpbmcgYSByZXVzYWJsZS9EUlkgd2F5IG9mIGRvaW5nIHRvb2x0b3BzIHNvb24sIHRoaXMgaXMganVzdCBteSBmaXJzdCBleHBlcmltZW50LlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBIb3dldmVyIHRvb2x0aXBzIEFMV0FZUyBjYXVzZSBwcm9ibGVtcy4gTXlzdGVyeSBmb3Igbm93LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IGluc2VydE5vZGVUb29sdGlwOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAvL1x0XHRcdCB0YWcoXCJwYXBlci10b29sdGlwXCIsIHtcclxuICAgICAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgICAgICAvL1x0XHRcdCB9LCBcIklOU0VSVFMgYSBuZXcgbm9kZSBhdCB0aGUgY3VycmVudCB0cmVlIHBvc2l0aW9uLiBBcyBhIHNpYmxpbmcgb24gdGhpcyBsZXZlbC5cIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWRkTm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiQUREUyBhIG5ldyBub2RlIGluc2lkZSB0aGUgY3VycmVudCBub2RlLCBhcyBhIGNoaWxkIG9mIGl0LlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxCdXR0b25zOiBzdHJpbmcgPSBzZWxCdXR0b24gKyBvcGVuQnV0dG9uICsgaW5zZXJ0Tm9kZUJ1dHRvbiArIGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBpbnNlcnROb2RlVG9vbHRpcFxyXG4gICAgICAgICAgICAgICAgKyBhZGROb2RlVG9vbHRpcCArIGVkaXROb2RlQnV0dG9uICsgbW92ZU5vZGVVcEJ1dHRvbiArIG1vdmVOb2RlRG93bkJ1dHRvbiArIHJlcGx5QnV0dG9uO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFsbEJ1dHRvbnMubGVuZ3RoID4gMCA/IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoYWxsQnV0dG9ucykgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0ID0gZnVuY3Rpb24oY29udGVudD86IHN0cmluZywgZXh0cmFDbGFzc2VzPzogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIE5vdyBidWlsZCBlbnRpcmUgY29udHJvbCBiYXIgKi9cclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiICsgKGV4dHJhQ2xhc3NlcyA/IChcIiBcIiArIGV4dHJhQ2xhc3NlcykgOiBcIlwiKVxyXG4gICAgICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VIb3J6Q29udHJvbEdyb3VwID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVJhZGlvQnV0dG9uID0gZnVuY3Rpb24obGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBpZFxyXG4gICAgICAgICAgICB9LCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbm9kZUlkIChzZWUgbWFrZU5vZGVJZCgpKSBOb2RlSW5mbyBvYmplY3QgaGFzICdoYXNDaGlsZHJlbicgdHJ1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZUhhc0NoaWxkcmVuID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBub2RlSGFzQ2hpbGRyZW46IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGZvcm1hdFBhdGggPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBhdGg6IHN0cmluZyA9IG5vZGUucGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIGluamVjdCBzcGFjZSBpbiBoZXJlIHNvIHRoaXMgc3RyaW5nIGNhbiB3cmFwIGFuZCBub3QgYWZmZWN0IHdpbmRvdyBzaXplcyBhZHZlcnNlbHksIG9yIG5lZWQgc2Nyb2xsaW5nICovXHJcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2VBbGwoXCIvXCIsIFwiIC8gXCIpO1xyXG4gICAgICAgICAgICBsZXQgc2hvcnRQYXRoOiBzdHJpbmcgPSBwYXRoLmxlbmd0aCA8IDUwID8gcGF0aCA6IHBhdGguc3Vic3RyaW5nKDAsIDQwKSArIFwiLi4uXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9Sb290UGF0aDogc3RyaW5nID0gc2hvcnRQYXRoO1xyXG4gICAgICAgICAgICBpZiAobm9Sb290UGF0aC5zdGFydHNXaXRoKFwiL3Jvb3RcIikpIHtcclxuICAgICAgICAgICAgICAgIG5vUm9vdFBhdGggPSBub1Jvb3RQYXRoLnN1YnN0cmluZygwLCA1KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gc2hvcnRQYXRoIDogbm9Sb290UGF0aDtcclxuICAgICAgICAgICAgcmV0ICs9IFwiIFtcIiArIG5vZGUucHJpbWFyeVR5cGVOYW1lICsgXCJdXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHdyYXBIdG1sID0gZnVuY3Rpb24odGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGRpdj5cIiArIHRleHQgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIHBhZ2UgYW5kIGFsd2F5cyBhbHNvIHRha2VzIGNhcmUgb2Ygc2Nyb2xsaW5nIHRvIHNlbGVjdGVkIG5vZGUgaWYgdGhlcmUgaXMgb25lIHRvIHNjcm9sbCB0b1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUGFnZUZyb21EYXRhID0gZnVuY3Rpb24oZGF0YT86IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm02NC5yZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKClcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChcIk5vIGNvbnRlbnQgaXMgYXZhaWxhYmxlIGhlcmUuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVpZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaWRlbnRUb1VpZE1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBJJ20gY2hvb3NpbmcgdG8gcmVzZXQgc2VsZWN0ZWQgbm9kZXMgd2hlbiBhIG5ldyBwYWdlIGxvYWRzLCBidXQgdGhpcyBpcyBub3QgYSByZXF1aXJlbWVudC4gSSBqdXN0XHJcbiAgICAgICAgICAgICAgICAgKiBkb24ndCBoYXZlIGEgXCJjbGVhciBzZWxlY3Rpb25zXCIgZmVhdHVyZSB3aGljaCB3b3VsZCBiZSBuZWVkZWQgc28gdXNlciBoYXMgYSB3YXkgdG8gY2xlYXIgb3V0LlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKGRhdGEubm9kZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2V0Q3VycmVudE5vZGVEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcENvdW50OiBudW1iZXIgPSBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcyA/IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA6IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVOREVSIE5PREU6IFwiICsgZGF0YS5ub2RlLmlkICsgXCIgcHJvcENvdW50PVwiICsgcHJvcENvdW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG91dHB1dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGJrZ1N0eWxlOiBzdHJpbmcgPSBnZXROb2RlQmtnSW1hZ2VTdHlsZShkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTk9URTogbWFpbk5vZGVDb250ZW50IGlzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFnZSBjb250ZW50LCBhbmQgaXMgYWx3YXlzIHRoZSBub2RlIGRpc3BsYXllZCBhdCB0aGUgdG9cclxuICAgICAgICAgICAgICogb2YgdGhlIHBhZ2UgYWJvdmUgYWxsIHRoZSBvdGhlciBub2RlcyB3aGljaCBhcmUgaXRzIGNoaWxkIG5vZGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbGV0IG1haW5Ob2RlQ29udGVudDogc3RyaW5nID0gcmVuZGVyTm9kZUNvbnRlbnQoZGF0YS5ub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibWFpbk5vZGVDb250ZW50OiBcIittYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1haW5Ob2RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIGxldCBidXR0b25CYXI6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlU3ViTm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCByZXBseUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGEubm9kZS5wYXRoPVwiK2RhdGEubm9kZS5wYXRoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZENvbW1lbnROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShkYXRhLm5vZGUpKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZE5vZGUoZGF0YS5ub2RlKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNyZWF0ZWRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb21tZW50Qnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHVibGljQXBwZW5kOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBTaG93IFJlcGx5IGJ1dHRvbiBpZiB0aGlzIGlzIGEgcHVibGljbHkgYXBwZW5kYWJsZSBub2RlIGFuZCBub3QgY3JlYXRlZCBieSBjdXJyZW50IHVzZXIsXHJcbiAgICAgICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5lZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIGRhdGEubm9kZS51aWQgKyBcIicpO1wiIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSAmJiBjbnN0Lk5FV19PTl9UT09MQkFSICYmIGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmUtYWx0XCIsIC8vaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaWRcIiA6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0LmVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQWRkIGVkaXQgYnV0dG9uIGlmIGVkaXQgbW9kZSBhbmQgdGhpcyBpc24ndCB0aGUgcm9vdCAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXQuaXNFZGl0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQuZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHJvd0hlYWRlciA9IGJ1aWxkUm93SGVhZGVyKGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNyZWF0ZVN1Yk5vZGVCdXR0b24gfHwgZWRpdE5vZGVCdXR0b24gfHwgcmVwbHlCdXR0b24pIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgPSBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBlZGl0Tm9kZUJ1dHRvbiArIHJlcGx5QnV0dG9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IChzZWxlY3RlZCA/IFwibWFpbk5vZGVDb250ZW50U3R5bGUgYWN0aXZlLXJvd1wiIDogXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBpbmFjdGl2ZS1yb3dcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgICAgICBidXR0b25CYXIgKyBtYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoY29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZm9yY2UgYWxsIGxpbmtzIHRvIG9wZW4gYSBuZXcgd2luZG93L3RhYiAqL1xyXG4gICAgICAgICAgICAgICAgLy8kKFwiYVwiKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpOyA8LS0tLSB0aGlzIGRvZXNuJ3Qgd29yay5cclxuICAgICAgICAgICAgICAgIC8vICQoJyNtYWluTm9kZUNvbnRlbnQnKS5maW5kKFwiYVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICQodGhpcykuYXR0cihcInRhcmdldFwiLCBcIl9ibGFua1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZSBzdGF0dXMgYmFyLlwiKTtcclxuICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dDb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZENvdW50OiBudW1iZXIgPSBkYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hpbGRDb3VudDogXCIgKyBjaGlsZENvdW50KTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93OiBzdHJpbmcgPSBnZW5lcmF0ZVJvdyhpLCBub2RlLCBuZXdEYXRhLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdy5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3dDb3VudCA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IGdldEVtcHR5UGFnZVByb21wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJsaXN0Vmlld1wiLCBvdXRwdXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jb2RlRm9ybWF0RGlydHkpIHtcclxuICAgICAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUT0RPLTM6IEluc3RlYWQgb2YgY2FsbGluZyBzY3JlZW5TaXplQ2hhbmdlIGhlcmUgaW1tZWRpYXRlbHksIGl0IHdvdWxkIGJlIGJldHRlciB0byBzZXQgdGhlIGltYWdlIHNpemVzXHJcbiAgICAgICAgICAgICAqIGV4YWN0bHkgb24gdGhlIGF0dHJpYnV0ZXMgb2YgZWFjaCBpbWFnZSwgYXMgdGhlIEhUTUwgdGV4dCBpcyByZW5kZXJlZCBiZWZvcmUgd2UgZXZlbiBjYWxsXHJcbiAgICAgICAgICAgICAqIHNldEh0bWwsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWV0YTY0LnNjcmVlblNpemVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2VuZXJhdGVSb3cgPSBmdW5jdGlvbihpOiBudW1iZXIsIG5vZGU6IGpzb24uTm9kZUluZm8sIG5ld0RhdGE6IGJvb2xlYW4sIGNoaWxkQ291bnQ6IG51bWJlciwgcm93Q291bnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIFJFTkRFUiBST1dbXCIgKyBpICsgXCJdOiBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJvd0NvdW50Kys7IC8vIHdhcm5pbmc6IHRoaXMgaXMgdGhlIGxvY2FsIHZhcmlhYmxlL3BhcmFtZXRlclxyXG4gICAgICAgICAgICB2YXIgcm93ID0gcmVuZGVyTm9kZUFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvd1tcIiArIHJvd0NvdW50ICsgXCJdPVwiICsgcm93KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvc3RUYXJnZXRVcmwgKyBcImJpbi9maWxlLW5hbWU/bm9kZUlkPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG5vZGUucGF0aCkgKyBcIiZ2ZXI9XCIgKyBub2RlLmJpblZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNlZSBhbHNvOiBtYWtlSW1hZ2VUYWcoKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWRqdXN0SW1hZ2VTaXplID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9ICQoXCIjXCIgKyBub2RlLmltZ0lkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gZWxtLmF0dHIoXCJ3aWR0aFwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSBlbG0uYXR0cihcImhlaWdodFwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2lkdGg9XCIgKyB3aWR0aCArIFwiIGhlaWdodD1cIiArIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBOZXcgTG9naWMgaXMgdHJ5IHRvIGRpc3BsYXkgaW1hZ2UgYXQgMTUwJSBtZWFuaW5nIGl0IGNhbiBnbyBvdXRzaWRlIHRoZSBjb250ZW50IGRpdiBpdCdzIGluLFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHdoaWNoIHdlIHdhbnQsIGJ1dCB0aGVuIHdlIGFsc28gbGltaXQgaXQgd2l0aCBtYXgtd2lkdGggc28gb24gc21hbGxlciBzY3JlZW4gZGV2aWNlcyBvciBzbWFsbFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHdpbmRvdyByZXNpemluZ3MgZXZlbiBvbiBkZXNrdG9wIGJyb3dzZXJzIHRoZSBpbWFnZSB3aWxsIGFsd2F5cyBiZSBlbnRpcmVseSB2aXNpYmxlIGFuZCBub3RcclxuICAgICAgICAgICAgICAgICAgICAgKiBjbGlwcGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBtYXhXaWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwid2lkdGhcIiwgXCIxNTAlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBETyBOT1QgREVMRVRFIChmb3IgYSBsb25nIHRpbWUgYXQgbGVhc3QpIFRoaXMgaXMgdGhlIG9sZCBsb2dpYyBmb3IgcmVzaXppbmcgaW1hZ2VzIHJlc3BvbnNpdmVseSxcclxuICAgICAgICAgICAgICAgICAgICAgKiBhbmQgaXQgd29ya3MgZmluZSBidXQgbXkgbmV3IGxvZ2ljIGlzIGJldHRlciwgd2l0aCBsaW1pdGluZyBtYXggd2lkdGggYmFzZWQgb24gc2NyZWVuIHNpemUuIEJ1dFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGtlZXAgdGhpcyBvbGQgY29kZSBmb3Igbm93Li5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBzZXQgdGhlIHdpZHRoIHdlIHdhbnQgdG8gZ28gZm9yICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgbm9kZS53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIG5vZGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNlZSBhbHNvOiBhZGp1c3RJbWFnZVNpemUoKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUltYWdlVGFnID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgc3JjOiBzdHJpbmcgPSBnZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKTtcclxuICAgICAgICAgICAgbm9kZS5pbWdJZCA9IFwiaW1nVWlkX1wiICsgbm9kZS51aWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBpZiBpbWFnZSB3b24ndCBmaXQgb24gc2NyZWVuIHdlIHdhbnQgdG8gc2l6ZSBpdCBkb3duIHRvIGZpdFxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIFllcywgaXQgd291bGQgaGF2ZSBiZWVuIHNpbXBsZXIgdG8ganVzdCB1c2Ugc29tZXRoaW5nIGxpa2Ugd2lkdGg9MTAwJSBmb3IgdGhlIGltYWdlIHdpZHRoIGJ1dCB0aGVuXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgaGlnaHQgd291bGQgbm90IGJlIHNldCBleHBsaWNpdGx5IGFuZCB0aGF0IHdvdWxkIG1lYW4gdGhhdCBhcyBpbWFnZXMgYXJlIGxvYWRpbmcgaW50byB0aGUgcGFnZSxcclxuICAgICAgICAgICAgICAgICAqIHRoZSBlZmZlY3RpdmUgc2Nyb2xsIHBvc2l0aW9uIG9mIGVhY2ggcm93IHdpbGwgYmUgaW5jcmVhc2luZyBlYWNoIHRpbWUgdGhlIFVSTCByZXF1ZXN0IGZvciBhIG5ld1xyXG4gICAgICAgICAgICAgICAgICogaW1hZ2UgY29tcGxldGVzLiBXaGF0IHdlIHdhbnQgaXMgdG8gaGF2ZSBpdCBzbyB0aGF0IG9uY2Ugd2Ugc2V0IHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gc2Nyb2xsIGFcclxuICAgICAgICAgICAgICAgICAqIHBhcnRpY3VsYXIgcm93IGludG8gdmlldywgaXQgd2lsbCBzdGF5IHRoZSBjb3JyZWN0IHNjcm9sbCBsb2NhdGlvbiBFVkVOIEFTIHRoZSBpbWFnZXMgYXJlIHN0cmVhbWluZ1xyXG4gICAgICAgICAgICAgICAgICogaW4gYXN5bmNocm9ub3VzbHkuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2lkdGg6IG51bWJlciA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogd2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8qIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplICovXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogbm9kZS53aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogbm9kZS5oZWlnaHQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkXHJcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogY3JlYXRlcyBIVE1MIHRhZyB3aXRoIGFsbCBhdHRyaWJ1dGVzL3ZhbHVlcyBzcGVjaWZpZWQgaW4gYXR0cmlidXRlcyBvYmplY3QsIGFuZCBjbG9zZXMgdGhlIHRhZyBhbHNvIGlmXHJcbiAgICAgICAgICogY29udGVudCBpcyBub24tbnVsbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdGFnID0gZnVuY3Rpb24odGFnOiBzdHJpbmcsIGF0dHJpYnV0ZXM/OiBPYmplY3QsIGNvbnRlbnQ/OiBzdHJpbmcsIGNsb3NlVGFnPzogYm9vbGVhbik6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICAvKiBkZWZhdWx0IHBhcmFtZXRlciB2YWx1ZXMgKi9cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAoY2xvc2VUYWcpID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIGNsb3NlVGFnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8qIEhUTUwgdGFnIGl0c2VsZiAqL1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIjxcIiArIHRhZztcclxuXHJcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBTdHJpbmcodik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB3ZSBpbnRlbGxpZ2VudGx5IHdyYXAgc3RyaW5ncyB0aGF0IGNvbnRhaW4gc2luZ2xlIHF1b3RlcyBpbiBkb3VibGUgcXVvdGVzIGFuZCB2aWNlIHZlcnNhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodi5jb250YWlucyhcIidcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9J1wiICsgdiArIFwiJyBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjbG9zZVRhZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gXCIvPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlVGV4dEFyZWEgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VFZGl0RmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VQYXNzd29yZEZpZWxkID0gZnVuY3Rpb24oZmllbGROYW1lOiBzdHJpbmcsIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIiA6IFwibWV0YTY0LWlucHV0XCJcclxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b24gPSBmdW5jdGlvbih0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmliczogT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGRvbUlkIGlzIGlkIG9mIGRpYWxvZyBiZWluZyBjbG9zZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQmFja0J1dHRvbiA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgZG9tSWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5jYW5jZWxEaWFsb2coJ1wiICsgZG9tSWQgKyBcIicpO1wiICsgY2FsbGJhY2tcclxuICAgICAgICAgICAgfSwgdGV4dCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFsbG93UHJvcGVydHlUb0Rpc3BsYXkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0W3Byb3BOYW1lXSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1JlYWRPbmx5UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0JpbmFyeVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmJpbmFyeVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNhbml0aXplUHJvcGVydHlOYW1lID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IFwic2ltcGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2guanNcIik7XHJcblxyXG4vKlxyXG4gKiB0b2RvLTM6IHRyeSB0byByZW5hbWUgdG8gJ3NlYXJjaCcsIGJ1dCByZW1lbWJlciB5b3UgaGFkIGluZXhwbGlhYmxlIHByb2JsZW1zIHRoZSBmaXJzdCB0aW1lIHlvdSB0cmllZCB0byB1c2UgJ3NlYXJjaCdcclxuICogYXMgdGhlIHZhciBuYW1lLlxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNyY2gge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudW1TZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoICE9IG51bGwgPyAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiByZXMuc2VhcmNoUmVzdWx0Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIG5hdi5uYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdGltZWxpbmVCeU1vZFRpbWUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJERVNDXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogamNyQ25zdC5DT05URU5UXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBqY3JDbnN0LkNPTlRFTlRcclxuICAgICAgICAgICAgfSwgdGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRTZWFyY2hOb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQoaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIHVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlID0gZnVuY3Rpb24oZGF0YSwgdmlld05hbWUpIHtcclxuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuc2VhcmNoUmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOdW1iZXIgb2Ygcm93cyB0aGF0IGhhdmUgYWN0dWFsbHkgbWFkZSBpdCBvbnRvIHRoZSBwYWdlIHRvIGZhci4gTm90ZTogc29tZSBub2RlcyBnZXQgZmlsdGVyZWQgb3V0IG9uIHRoZVxyXG4gICAgICAgICAgICAgKiBjbGllbnQgc2lkZSBmb3IgdmFyaW91cyByZWFzb25zLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhLnNlYXJjaFJlc3VsdHMsIGZ1bmN0aW9uKGksIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHZpZXdOYW1lLCBvdXRwdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZW5kZXJzIGEgc2luZ2xlIGxpbmUgb2Ygc2VhcmNoIHJlc3VsdHMgb24gdGhlIHNlYXJjaCByZXN1bHRzIHBhZ2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJTZWFyY2hSZXN1bHRBc0xpc3RJdGVtID0gZnVuY3Rpb24obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhckh0bWwgPSBtYWtlQnV0dG9uQmFySHRtbChcIlwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlbmRlci5yZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5zcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFySHRtbC8vXHJcbiAgICAgICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfc3JjaF9jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUJ1dHRvbkJhckh0bWwgPSBmdW5jdGlvbih1aWQpIHtcclxuICAgICAgICAgICAgdmFyIGdvdG9CdXR0b24gPSByZW5kZXIubWFrZUJ1dHRvbihcIkdvIHRvIE5vZGVcIiwgdWlkLCBcIm02NC5zcmNoLmNsaWNrU2VhcmNoTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGdvdG9CdXR0b24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja09uU2VhcmNoUmVzdWx0Um93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpIHtcclxuICAgICAgICAgICAgdW5oaWdobGlnaHRSb3coKTtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0Um93Tm9kZSA9IHVpZFRvTm9kZU1hcFt1aWRdO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGlja1NlYXJjaE5vZGUgPSBmdW5jdGlvbih1aWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFzcmNoLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgdWlkIGluIHNlYXJjaCByZXN1bHRzOiBcIiArIHVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUsIHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIHN0eWxpbmcgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdW5oaWdobGlnaHRSb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Um93Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgIHZhciBub2RlSWQgPSBoaWdobGlnaHRSb3dOb2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgICAgIC8qIGNoYW5nZSBjbGFzcyBvbiBlbGVtZW50ICovXHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2hhcmUuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2Ugc2hhcmUge1xyXG5cclxuICAgICAgICBsZXQgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hhcmluZ05vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0Tm9kZVNoYXJpbmcgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOmpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2hhcmluZ05vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICAobmV3IFNoYXJpbmdEbGcoKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaW5kU2hhcmVkTm9kZXMgPSBmdW5jdGlvbigpIDogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6anNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGZvY3VzTm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUGFnZVRpdGxlID0gXCJTaGFyZWQgTm9kZXNcIjtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNoYXJlZE5vZGVzUmVxdWVzdCwganNvbi5HZXRTaGFyZWROb2Rlc1Jlc3BvbnNlPihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgICAgICB9LCBmaW5kU2hhcmVkTm9kZXNSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHVzZXIuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdXNlciB7XHJcblxyXG4gICAgICAgIGxldCBsb2dvdXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dvdXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmb3IgdGVzdGluZyBwdXJwb3NlcywgSSB3YW50IHRvIGFsbG93IGNlcnRhaW4gdXNlcnMgYWRkaXRpb25hbCBwcml2aWxlZ2VzLiBBIGJpdCBvZiBhIGhhY2sgYmVjYXVzZSBpdCB3aWxsIGdvXHJcbiAgICAgICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc1Rlc3RVc2VyQWNjb3VudCA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJib2JcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gQlJBTkRJTkdfVElUTEVfU0hPUlQ7XHJcblxyXG4gICAgICAgICAgICAvKiB0b2RvLTA6IElmIHVzZXJzIGdvIHdpdGggdmVyeSBsb25nIHVzZXJuYW1lcyB0aGlzIGlzIGdvbm5hIGJlIHVnbHkgKi9cclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgKz0gXCI6XCIgKyByZXMudXNlck5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRPRE8tMzogbW92ZSB0aGlzIGludG8gbWV0YTY0IG1vZHVsZSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5yb290Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlSWQgPSByZXMucm9vdE5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lID0gcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZSA9IHJlcy5hbm9uVXNlckxhbmRpbmdQYWdlTm9kZTtcclxuICAgICAgICAgICAgbWV0YTY0LmFsbG93RmlsZVN5c3RlbVNlYXJjaCA9IHJlcy5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2g7XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzID0gcmVzLnVzZXJQcmVmZXJlbmNlcztcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5hZHZhbmNlZE1vZGUgPyBtZXRhNjQuTU9ERV9BRFZBTkNFRCA6IG1ldGE2NC5NT0RFX1NJTVBMRTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHJlcy51c2VyUHJlZmVyZW5jZXMuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmcm9tIHNlcnZlcjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uPVwiICsgbWV0YTY0LmVkaXRNb2RlT3B0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblNpZ251cFBnID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdyaXRlIGEgY29va2llIHRoYXQgZXhwaXJlcyBpbiBhIHllYXIgZm9yIGFsbCBwYXRocyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgd3JpdGVDb29raWUgPSBmdW5jdGlvbihuYW1lLCB2YWwpOiB2b2lkIHtcclxuICAgICAgICAgICAgJC5jb29raWUobmFtZSwgdmFsLCB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHVnbHkuIEl0IGlzIHRoZSBidXR0b24gdGhhdCBjYW4gYmUgbG9naW4gKm9yKiBsb2dvdXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuTG9naW5QZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbG9naW5EbGc6IExvZ2luRGxnID0gbmV3IExvZ2luRGxnKCk7XHJcbiAgICAgICAgICAgIGxvZ2luRGxnLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcclxuICAgICAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTG9naW4gPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYWxsVXNyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBjYWxsUHdkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCB1c2luZ0Nvb2tpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobG9naW5TZXNzaW9uUmVhZHkgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IHRydWVcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogdXNpbmcgYmxhbmsgY3JlZGVudGlhbHMgd2lsbCBjYXVzZSBzZXJ2ZXIgdG8gbG9vayBmb3IgYSB2YWxpZCBzZXNzaW9uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSBmYWxzZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbG9naW5TdGF0ZTogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHdlIGhhdmUga25vd24gc3RhdGUgYXMgbG9nZ2VkIG91dCwgdGhlbiBkbyBub3RoaW5nIGhlcmUgKi9cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVzcjogc3RyaW5nID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgIGxldCBwd2Q6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdXNpbmdDb29raWVzID0gIXV0aWwuZW1wdHlTdHJpbmcodXNyKSAmJiAhdXRpbC5lbXB0eVN0cmluZyhwd2QpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb29raWVVc2VyPVwiICsgdXNyICsgXCIgdXNpbmdDb29raWVzID0gXCIgKyB1c2luZ0Nvb2tpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBlbXB5dCBjcmVkZW50aWFscyBjYXVzZXMgc2VydmVyIHRvIHRyeSB0byBsb2cgaW4gd2l0aCBhbnkgYWN0aXZlIHNlc3Npb24gY3JlZGVudGlhbHMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FsbFB3ZCA9IHB3ZCA/IHB3ZCA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY2FsbFVzcikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTG9naW5SZXF1ZXN0LCBqc29uLkxvZ2luUmVzcG9uc2U+KFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogY2FsbFVzcixcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IGNhbGxQd2QsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaExvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dvdXQgPSBmdW5jdGlvbih1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ291dFJlcXVlc3QsIGpzb24uTG9nb3V0UmVzcG9uc2U+KFwibG9nb3V0XCIsIHt9LCBsb2dvdXRSZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luID0gZnVuY3Rpb24obG9naW5EbGcsIHVzciwgcHdkKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNyLFxyXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgbG9naW5SZXNwb25zZShyZXMsIHVzciwgcHdkLCBudWxsLCBsb2dpbkRsZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxldGVBbGxVc2VyQ29va2llcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLkxvZ2luUmVzcG9uc2UsIHVzcj86IHN0cmluZywgcHdkPzogc3RyaW5nLCB1c2luZ0Nvb2tpZXM/OiBib29sZWFuLCBsb2dpbkRsZz86IExvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkxvZ2luXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW5SZXNwb25zZTogdXNyPVwiICsgdXNyICsgXCIgaG9tZU5vZGVPdmVycmlkZTogXCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHVzciAhPSBcImFub255bW91c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSLCB1c3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCwgcHdkKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIxXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsb2dpbkRsZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2luRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZTogXCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZSBpcyBudWxsLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBzZXQgSUQgdG8gYmUgdGhlIHBhZ2Ugd2Ugd2FudCB0byBzaG93IHVzZXIgcmlnaHQgYWZ0ZXIgbG9naW4gKi9cclxuICAgICAgICAgICAgICAgIGxldCBpZDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuZW1wdHlTdHJpbmcocmVzLmhvbWVOb2RlT3ZlcnJpZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMuaG9tZU5vZGVPdmVycmlkZTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVPdmVycmlkZSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgbGFzdE5vZGU9XCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZUlkPVwiICsgbWV0YTY0LmhvbWVOb2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IG1ldGE2NC5ob21lTm9kZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKGlkLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkNvb2tpZSBsb2dpbiBmYWlsZWQuXCIpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYmxvdyBhd2F5IGZhaWxlZCBjb29raWUgY3JlZGVudGlhbHMgYW5kIHJlbG9hZCBwYWdlLCBzaG91bGQgcmVzdWx0IGluIGJyYW5kIG5ldyBwYWdlIGxvYWQgYXMgYW5vblxyXG4gICAgICAgICAgICAgICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgICAgICBsZXQgcmVmcmVzaExvZ2luUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9naW5SZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyLnNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHZpZXcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgdmlldyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZVN0YXR1c0JhciA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNMaW5lID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiY291bnQ6IFwiICsgbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiIFNlbGVjdGlvbnM6IFwiICsgdXRpbC5nZXRQcm9wZXJ0eUNvdW50KG1ldGE2NC5zZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIgd2hpY2gsIGlmIHN1cHBsaWVkLCBzaG91bGQgYmUgdGhlIGlkIHdlIHNjcm9sbCB0byB3aGVuIGZpbmFsbHkgZG9uZSB3aXRoIHRoZVxyXG4gICAgICAgICAqIHJlbmRlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgdGFyZ2V0SWQ/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldElkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZCh0YXJnZXRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbmV3SWQgaXMgb3B0aW9uYWwgYW5kIGlmIHNwZWNpZmllZCBtYWtlcyB0aGUgcGFnZSBzY3JvbGwgdG8gYW5kIGhpZ2hsaWdodCB0aGF0IG5vZGUgdXBvbiByZS1yZW5kZXJpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZSA9IGZ1bmN0aW9uKG5vZGVJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBoaWdobGlnaHRJZD86IGFueSwgaXNJbml0aWFsUmVuZGVyPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGVJZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZUlkID0gbWV0YTY0LmN1cnJlbnROb2RlSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVmcmVzaGluZyB0cmVlOiBub2RlSWQ9XCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodElkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRJZCA9IGN1cnJlbnRTZWxOb2RlICE9IG51bGwgPyBjdXJyZW50U2VsTm9kZS5pZCA6IG5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiByZW5kZXJQYXJlbnRJZkxlYWYgPyB0cnVlIDogZmFsc2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIGhpZ2hsaWdodElkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNJbml0aWFsUmVuZGVyICYmIG1ldGE2NC51cmxDbWQgPT0gXCJhZGROb2RlXCIgJiYgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXRNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQuY3JlYXRlU3ViTm9kZShtZXRhNjQuY3VycmVudE5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRvZG8tMzogdGhpcyBzY3JvbGxpbmcgaXMgc2xpZ2h0bHkgaW1wZXJmZWN0LiBzb21ldGltZXMgdGhlIGNvZGUgc3dpdGNoZXMgdG8gYSB0YWIsIHdoaWNoIHRyaWdnZXJzXHJcbiAgICAgICAgICogc2Nyb2xsVG9Ub3AsIGFuZCB0aGVuIHNvbWUgb3RoZXIgY29kZSBzY3JvbGxzIHRvIGEgc3BlY2lmaWMgbG9jYXRpb24gYSBmcmFjdGlvbiBvZiBhIHNlY29uZCBsYXRlci4gdGhlXHJcbiAgICAgICAgICogJ3BlbmRpbmcnIGJvb2xlYW4gaGVyZSBpcyBhIGNydXRjaCBmb3Igbm93IHRvIGhlbHAgdmlzdWFsIGFwcGVhbCAoaS5lLiBzdG9wIGlmIGZyb20gc2Nyb2xsaW5nIHRvIG9uZSBwbGFjZVxyXG4gICAgICAgICAqIGFuZCB0aGVuIHNjcm9sbGluZyB0byBhIGRpZmZlcmVudCBwbGFjZSBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9TZWxlY3RlZE5vZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbG06IGFueSA9IG5hdi5nZXRTZWxlY3RlZFBvbHlFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGZpbmQgYSBzZWxlY3RlZCBub2RlIG9uIHRoaXMgcGFnZSwgc2Nyb2xsIHRvXHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgaW5zdGVhZC5cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAvL3RvZG8tMDogcmVtb3ZlZCBtYWluUGFwZXJUYWJzIGZyb20gdmlzaWJpbGl0eSwgYnV0IHdoYXQgY29kZSBzaG91bGQgZ28gaGVyZSBub3c/XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiBUaGUgZm9sbG93aW5nIHdhcyBpbiBhIHBvbHltZXIgZXhhbXBsZSAoY2FuIEkgdXNlIHRoaXM/KTogYXBwLiQuaGVhZGVyUGFuZWxNYWluLnNjcm9sbFRvVG9wKHRydWUpO1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9Ub3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IG5vdCB1c2luZyBtYWluUGFwZXJUYWJzIGFueSBsb25nZXIgc28gc2h3IHNob3VsZCBnbyBoZXJlIG5vdyA/XHJcbiAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgZWxtOiBhbnkgPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAvLyAgICAgaWYgKGVsbSAmJiBlbG0ubm9kZSAmJiB0eXBlb2YgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0RWRpdFBhdGhEaXNwbGF5QnlJZCA9IGZ1bmN0aW9uKGRvbUlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBlZGl0LmVkaXROb2RlO1xyXG4gICAgICAgICAgICBsZXQgZTogYW55ID0gJChcIiNcIiArIGRvbUlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBlLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICBlLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoRGlzcGxheSA9IFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IERvIHdlIHJlYWxseSBuZWVkIElEIGluIGFkZGl0aW9uIHRvIFBhdGggaGVyZT9cclxuICAgICAgICAgICAgICAgIC8vIHBhdGhEaXNwbGF5ICs9IFwiPGJyPklEOiBcIiArIG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aERpc3BsYXkgKz0gXCI8YnI+TW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5odG1sKHBhdGhEaXNwbGF5KTtcclxuICAgICAgICAgICAgICAgIGUuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNob3dTZXJ2ZXJJbmZvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFNlcnZlckluZm9SZXF1ZXN0LCBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZT4oXCJnZXRTZXJ2ZXJJbmZvXCIsIHt9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0U2VydmVySW5mb1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcocmVzLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZW51UGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWVudVBhbmVsIHtcclxuXHJcbiAgICAgICAgbGV0IG1ha2VUb3BMZXZlbE1lbnUgPSBmdW5jdGlvbih0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBhcGVySXRlbUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibWVudS10cmlnZ2VyXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXBlckl0ZW0gPSByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCBwYXBlckl0ZW1BdHRycywgdGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBhcGVyU3VibWVudUF0dHJzID0ge1xyXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB0aXRsZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAoPGFueT5wYXBlclN1Ym1lbnVBdHRycykuaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1zdWJtZW51XCIsIHBhcGVyU3VibWVudUF0dHJzXHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1ldGE2NC1tZW51LWhlYWRpbmdcIixcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0XCJcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLCBwYXBlckl0ZW0gKyAvL1wiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VTZWNvbmRMZXZlbExpc3QgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgLy8sXHJcbiAgICAgICAgICAgICAgICAvL1wibXVsdGlcIjogXCJtdWx0aVwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1lbnVJdGVtID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrXHJcbiAgICAgICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRvbUlkOiBzdHJpbmcgPSBcIm1haW5BcHBNZW51XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEkgZW5kZWQgdXAgbm90IHJlYWxseSBsaWtpbmcgdGhpcyB3YXkgb2Ygc2VsZWN0aW5nIHRhYnMuIEkgY2FuIGp1c3QgdXNlIG5vcm1hbCBwb2x5bWVyIHRhYnMuXHJcbiAgICAgICAgICAgIC8vIHZhciBwYWdlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ21haW5UYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwic2VhcmNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZVBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYigndGltZWxpbmVUYWJOYW1lJyk7XCIpO1xyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZlZWRzXCIsIFwibWFpbk1lbnVSc3NcIiwgXCJtNjQubmF2Lm9wZW5Sc3NGZWVkc05vZGUoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1ha2VUb3BMZXZlbE1lbnUoXCJSU1NcIiwgcnNzSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgXCIobmV3IG02NC5SZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEZWxldGVcIiwgXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2xlYXIgU2VsZWN0aW9uc1wiLCBcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCBcIm02NC5lZGl0LmNsZWFyU2VsZWN0aW9ucygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IG02NC5JbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IG02NC5FeHBvcnREbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkVkaXRcIiwgZWRpdE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkN1dFwiLCBcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlBhc3RlXCIsIFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5maW5pc2hNb3ZpbmdTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwXCIsIFwibW92ZU5vZGVVcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVXAoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJEb3duXCIsIFwibW92ZU5vZGVEb3duQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVEb3duKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gVG9wXCIsIFwibW92ZU5vZGVUb1RvcEJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVG9Ub3AoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJ0byBCb3R0b21cIiwgXCJtb3ZlTm9kZVRvQm90dG9tQnV0dG9uXCIsIFwibTY0LmVkaXQubW92ZU5vZGVUb0JvdHRvbSgpO1wiKTsvL1xyXG4gICAgICAgICAgICB2YXIgbW92ZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiTW92ZVwiLCBtb3ZlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gRmlsZVwiLCBcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsIFwibTY0LmF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21GaWxlRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVXBsb2FkIGZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCBcIm02NC5hdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tVXJsRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcIm02NC5hdHRhY2htZW50LmRlbGV0ZUF0dGFjaG1lbnQoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBdHRhY2hcIiwgYXR0YWNobWVudE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2hhcmluZ01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkVkaXQgTm9kZSBTaGFyaW5nXCIsIFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsIFwibTY0LnNoYXJlLmVkaXROb2RlU2hhcmluZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwibTY0LnNoYXJlLmZpbmRTaGFyZWROb2RlcygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIHNoYXJpbmdNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNoYXJlXCIsIHNoYXJpbmdNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNvbnRlbnRcIiwgXCJjb250ZW50U2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoQ29udGVudERsZygpKS5vcGVuKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IG1ha2UgYSB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgdGhhdCBkb2VzIGEgdGFnIHNlYXJjaFxyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJUYWdzXCIsIFwidGFnU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoVGFnc0RsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRmlsZXNcIiwgXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBtNjQuU2VhcmNoRmlsZXNEbGcoKSkub3BlbigpO1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlNlYXJjaFwiLCBzZWFyY2hNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRpbWVsaW5lTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ3JlYXRlZFwiLCBcInRpbWVsaW5lQ3JlYXRlZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlDcmVhdGVUaW1lKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNb2RpZmllZFwiLCBcInRpbWVsaW5lTW9kaWZpZWRCdXR0b25cIiwgXCJtNjQuc3JjaC50aW1lbGluZUJ5TW9kVGltZSgpO1wiKTsvL1xyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlRpbWVsaW5lXCIsIHRpbWVsaW5lTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2aWV3T3B0aW9uc01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlRvZ2dsZSBQcm9wZXJ0aWVzXCIsIFwicHJvcHNUb2dnbGVCdXR0b25cIiwgXCJtNjQucHJvcHMucHJvcHNUb2dnbGUoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJSZWZyZXNoXCIsIFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnJlZnJlc2goKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTaG93IFVSTFwiLCBcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBcIm02NC5yZW5kZXIuc2hvd05vZGVVcmwoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJQcmVmZXJlbmNlc1wiLCBcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCBcIihuZXcgbTY0LlByZWZzRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IGJ1Zzogc2VydmVyIGluZm8gbWVudSBpdGVtIGlzIHNob3dpbmcgdXAgKGFsdGhvdWdoIGNvcnJlY3RseSBkaXNhYmxlZCkgZm9yIG5vbi1hZG1pbiB1c2Vycy5cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiU2VydmVyIEluZm9cIiwgXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBcIm02NC52aWV3LnNob3dTZXJ2ZXJJbmZvKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gbWFrZVRvcExldmVsTWVudShcIlZpZXdcIiwgdmlld09wdGlvbnNNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogd2hhdGV2ZXIgaXMgY29tbWVudGVkIGlzIG9ubHkgY29tbWVudGVkIGZvciBwb2x5bWVyIGNvbnZlcnNpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgXCIobmV3IG02NC5DaGFuZ2VQYXNzd29yZERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFuYWdlIEFjY291bnRcIiwgXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsIFwiKG5ldyBtNjQuTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiSW5zZXJ0IEJvb2s6IFdhciBhbmQgUGVhY2VcIiwgXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgXCJtNjQuZWRpdC5pbnNlcnRCb29rV2FyQW5kUGVhY2UoKTtcIik7IC8vXHJcbiAgICAgICAgICAgIC8vIG1lbnVJdGVtKFwiRnVsbCBSZXBvc2l0b3J5IEV4cG9ydFwiLCBcImZ1bGxSZXBvc2l0b3J5RXhwb3J0XCIsIFwiXHJcbiAgICAgICAgICAgIC8vIGVkaXQuZnVsbFJlcG9zaXRvcnlFeHBvcnQoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB2YXIgbXlBY2NvdW50TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBY2NvdW50XCIsIG15QWNjb3VudEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhZG1pbkl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiR2VuZXJhdGUgUlNTXCIsIFwiZ2VuZXJhdGVSU1NCdXR0b25cIiwgXCJtNjQucG9kY2FzdC5nZW5lcmF0ZVJTUygpO1wiKTtcclxuICAgICAgICAgICAgdmFyIGFkbWluTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJBZG1pblwiLCBhZG1pbkl0ZW1zLCBcImFkbWluTWVudVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBoZWxwSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJNYWluIE1lbnUgSGVscFwiLCBcIm1haW5NZW51SGVscFwiLCBcIm02NC5uYXYub3Blbk1haW5NZW51SGVscCgpO1wiKTtcclxuICAgICAgICAgICAgdmFyIG1haW5NZW51SGVscCA9IG1ha2VUb3BMZXZlbE1lbnUoXCJIZWxwL0RvY3NcIiwgaGVscEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gLyogcGFnZU1lbnUrICovIG1haW5NZW51UnNzICsgZWRpdE1lbnUgKyBtb3ZlTWVudSArIGF0dGFjaG1lbnRNZW51ICsgc2hhcmluZ01lbnUgKyB2aWV3T3B0aW9uc01lbnUgKyBzZWFyY2hNZW51ICsgdGltZWxpbmVNZW51ICsgbXlBY2NvdW50TWVudVxyXG4gICAgICAgICAgICAgICAgKyBhZG1pbk1lbnUgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0ID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwb2RjYXN0LmpzXCIpO1xuXG4vKlxuTk9URTogVGhlIEF1ZGlvUGxheWVyRGxnIEFORCB0aGlzIHNpbmdsZXRvbi1pc2ggY2xhc3MgYm90aCBzaGFyZSBzb21lIHN0YXRlIGFuZCBjb29wZXJhdGVcblxuUmVmZXJlbmNlOiBodHRwczovL3d3dy53My5vcmcvMjAxMC8wNS92aWRlby9tZWRpYWV2ZW50cy5odG1sXG4qL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwb2RjYXN0IHtcbiAgICAgICAgZXhwb3J0IGxldCBwbGF5ZXI6IGFueSA9IG51bGw7XG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRUaW1lUGVuZGluZzogbnVtYmVyID0gbnVsbDtcblxuICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XG4gICAgICAgIGxldCBhZFNlZ21lbnRzOiBBZFNlZ21lbnRbXSA9IG51bGw7XG5cbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJTUyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2VuZXJhdGVSU1NSZXF1ZXN0LCBqc29uLkdlbmVyYXRlUlNTUmVzcG9uc2U+KFwiZ2VuZXJhdGVSU1NcIiwge1xuICAgICAgICAgICAgfSwgZ2VuZXJhdGVSU1NSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ2VuZXJhdGVSU1NSZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgYWxlcnQoJ3JzcyBjb21wbGV0ZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwicnNzRmVlZFRpdGxlXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IGRlc2M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwicnNzRmVlZERlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgaW1nVXJsOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcInJzc0ZlZWRJbWFnZVVybFwiLCBub2RlKTtcblxuICAgICAgICAgICAgbGV0IGZlZWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgdGl0bGUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCBkZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgZmVlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZlZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW1nVXJsKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWF4LXdpZHRoOiAzMDBweDtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogaW1nVXJsLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJFbnRyeU5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgcnNzVGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwicnNzRW50cnlUaXRsZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NEZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcInJzc0VudHJ5RGVzY1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCByc3NBdXRob3I6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwicnNzRW50cnlBdXRob3JcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzTGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJyc3NFbnRyeUxpbmtcIiwgbm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBlbnRyeTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChyc3NUaXRsZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJoM1wiLCB7XG4gICAgICAgICAgICAgICAgfSwgcnNzVGl0bGUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJzc0Rlc2MpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwicFwiLCB7XG4gICAgICAgICAgICAgICAgfSwgcnNzRGVzYy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnNzQXV0aG9yICYmIHJzc0F1dGhvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIH0sIFwiQnk6IFwiICsgcnNzQXV0aG9yLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJzc0xpbmsudmFsdWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiLm1wM1wiKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5vcGVuUGxheWVyRGlhbG9nKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJocmVmXCI6IHJzc0xpbmsudmFsdWVcbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIkxpbmtcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGVudHJ5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZW50cnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvcGVuUGxheWVyRGlhbG9nID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB1aWQgPSBfdWlkO1xuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcblxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcnNzTGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJyc3NFbnRyeUxpbmtcIiwgbm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJzc0xpbmsgJiYgcnNzTGluay52YWx1ZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCIubXAzXCIpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLkdldFBsYXllckluZm9SZXNwb25zZT4oXCJnZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXJsXCI6IHJzc0xpbmsudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFBsYXllckluZm9SZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBZFNlZ21lbnRVaWQodWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkbGcgPSBuZXcgQXVkaW9QbGF5ZXJEbGcocnNzTGluay52YWx1ZSwgdWlkLCByZXMudGltZU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkbGcub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRVaWQgPSBmdW5jdGlvbihfdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFkU2VnczoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJhZC1zZWdtZW50c1wiLCBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRTZWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlQWRTZWdtZW50VGV4dChhZFNlZ3MudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgdGhyb3cgXCJVbmFibGUgdG8gZmluZCBub2RlIHVpZDogXCIgKyB1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyc2VBZFNlZ21lbnRUZXh0ID0gZnVuY3Rpb24oYWRTZWdzOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGFkU2VnbWVudHMgPSBbXTtcblxuICAgICAgICAgICAgbGV0IHNlZ0xpc3Q6IHN0cmluZ1tdID0gYWRTZWdzLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgZm9yIChsZXQgc2VnIG9mIHNlZ0xpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VnVGltZXM6IHN0cmluZ1tdID0gc2VnLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VnVGltZXMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZhbGlkIHRpbWUgcmFuZ2U6IFwiICsgc2VnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGJlZ2luU2VjczogbnVtYmVyID0gY29udmVydFRvU2Vjb25kcyhzZWdUaW1lc1swXSk7XG4gICAgICAgICAgICAgICAgbGV0IGVuZFNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMV0pO1xuXG4gICAgICAgICAgICAgICAgYWRTZWdtZW50cy5wdXNoKG5ldyBBZFNlZ21lbnQoYmVnaW5TZWNzLCBlbmRTZWNzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBjb252ZXJ0IGZyb20gZm9tcmF0IFwibWludXRlczpzZWNvbnRzXCIgdG8gYWJzb2x1dGUgbnVtYmVyIG9mIHNlY29uZHNcbiAgICAgICAgKlxuICAgICAgICAqIHRvZG8tMDogbWFrZSB0aGlzIGFjY2VwdCBqdXN0IHNlY29uZHMsIG9yIG1pbjpzZWMsIG9yIGhvdXI6bWluOnNlYywgYW5kIGJlIGFibGUgdG9cbiAgICAgICAgKiBwYXJzZSBhbnkgb2YgdGhlbSBjb3JyZWN0bHkuXG4gICAgICAgICovXG4gICAgICAgIGxldCBjb252ZXJ0VG9TZWNvbmRzID0gZnVuY3Rpb24odGltZVZhbDogc3RyaW5nKSB7XG4gICAgICAgICAgICAvKiBlbmQgdGltZSBpcyBkZXNpZ25hdGVkIHdpdGggYXN0ZXJpc2sgYnkgdXNlciwgYW5kIHJlcHJlc2VudGVkIGJ5IC0xIGluIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgaWYgKHRpbWVWYWwgPT0gJyonKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBsZXQgdGltZVBhcnRzOiBzdHJpbmdbXSA9IHRpbWVWYWwuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgaWYgKHRpbWVQYXJ0cy5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHZhbHVlOiBcIiArIHRpbWVWYWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMF0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRzID0gbmV3IE51bWJlcih0aW1lUGFydHNbMV0pLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiBtaW51dGVzICogNjAgKyBzZWNvbmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZXN0b3JlU3RhcnRUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKiBtYWtlcyBwbGF5ZXIgYWx3YXlzIHN0YXJ0IHdoZXJldmVyIHRoZSB1c2VyIGxhc3Qgd2FzIHdoZW4gdGhleSBjbGlja2VkIFwicGF1c2VcIiAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiBzdGFydFRpbWVQZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc3RhcnRUaW1lUGVuZGluZztcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVQZW5kaW5nID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25DYW5QbGF5ID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBwbGF5ZXIgPSBlbG07XG4gICAgICAgICAgICByZXN0b3JlU3RhcnRUaW1lKCk7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IG9uVGltZVVwZGF0ZSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDdXJyZW50VGltZT1cIiArIGVsbS5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICBwbGF5ZXIgPSBlbG07XG5cbiAgICAgICAgICAgIC8qIHRvZG8tMTogd2UgY2FsbCByZXN0b3JlU3RhcnRUaW1lIHVwb24gbG9hZGluZyBvZiB0aGUgY29tcG9uZW50IGJ1dCBpdCBkb2Vzbid0IHNlZW0gdG8gaGF2ZSB0aGUgZWZmZWN0IGRvaW5nIGFueXRoaW5nIGF0IGFsbFxuICAgICAgICAgICAgYW5kIGNhbid0IGV2ZW4gdXBkYXRlIHRoZSBzbGlkZXIgZGlzcGxheWVkIHBvc2l0aW9uLCB1bnRpbCBwbGF5aW5zIGlzIFNUQVJURUQuIE5lZWQgdG8gY29tZSBiYWNrIGFuZCBmaXggdGhpcyBiZWNhdXNlIHVzZXJzXG4gICAgICAgICAgICBjdXJyZW50bHkgaGF2ZSB0aGUgZ2xpdGNoIG9mIGFsd2F5cyBoZWFyaW5nIHRoZSBmaXJzdCBmcmFjdGlvbiBvZiBhIHNlY29uZCBvZiB2aWRlbywgd2hpY2ggb2YgY291cnNlIGFub3RoZXIgd2F5IHRvIGZpeFxuICAgICAgICAgICAgd291bGQgYmUgYnkgYWx0ZXJpbmcgdGhlIHZvbHVtbiB0byB6ZXJvIHVudGlsIHJlc3RvcmVTdGFydFRpbWUgaGFzIGdvbmUgaW50byBlZmZlY3QgKi9cbiAgICAgICAgICAgIHJlc3RvcmVTdGFydFRpbWUoKTtcblxuICAgICAgICAgICAgaWYgKCFhZFNlZ21lbnRzKSByZXR1cm47XG4gICAgICAgICAgICBmb3IgKGxldCBzZWcgb2YgYWRTZWdtZW50cykge1xuICAgICAgICAgICAgICAgIC8qIGVuZFRpbWUgb2YgLTEgbWVhbnMgdGhlIHJlc3Qgb2YgdGhlIG1lZGlhIHNob3VsZCBiZSBjb25zaWRlcmVkIEFEcyAqL1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuY3VycmVudFRpbWUgPj0gc2VnLmJlZ2luVGltZSAmJiAvL1xuICAgICAgICAgICAgICAgICAgICAocGxheWVyLmN1cnJlbnRUaW1lIDw9IHNlZy5lbmRUaW1lIHx8IHNlZy5lbmRUaW1lIDwgMCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBqdW1wIHRvIGVuZCBvZiBhdWRpbyBpZiByZXN0IGlzIGFuIGFkZCwgd2l0aCBsb2dpYyBvZiAtMyB0byBlbnN1cmUgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgZ28gaW50byBhIGxvb3AganVtcGluZyB0byBlbmQgb3ZlciBhbmQgb3ZlciBhZ2FpbiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VnLmVuZFRpbWUgPCAwICYmIHBsYXllci5jdXJyZW50VGltZSA8IHBsYXllci5kdXJhdGlvbiAtIDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gbGFzdCB0byBzZWNvbmRzIG9mIGF1ZGlvLCBpJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiBwYXVzaW5nLCBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhlcmUgYXJlIGlzIG1vcmUgYXVkaW8gYXV0b21hdGljYWxseSBhYm91dCB0byBwbGF5LCB3ZSBkb24ndCB3YW50IHRvIGhhbHQgaXQgYWxsICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gcGxheWVyLmR1cmF0aW9uIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBvciBlbHNlIHdlIGFyZSBpbiBhIGNvbWVyY2lhbCBzZWdtZW50IHNvIGp1bXAgdG8gb25lIHNlY29uZCBwYXN0IGl0ICovXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRUaW1lID0gc2VnLmVuZFRpbWUgKyAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBwb2RjYXN0IGhhbmRsaW5nIGhhY2sgaXMgb25seSBpbiB0aGlzIGZpbGUgdGVtcG9yYXJpbHlcbiAgICAgICAgZXhwb3J0IGxldCBwYXVzZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGRlc3Ryb3lQbGF5ZXIgPSBmdW5jdGlvbihkbGc6QXVkaW9QbGF5ZXJEbGcpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRsZy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcGxheSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNwZWVkID0gZnVuY3Rpb24ocmF0ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBsYXliYWNrUmF0ZSA9IHJhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgICAgIGV4cG9ydCBsZXQgc2tpcCA9IGZ1bmN0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNhdmVQbGF5ZXJJbmZvID0gZnVuY3Rpb24odXJsOiBzdHJpbmcsIHRpbWVPZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLlNldFBsYXllckluZm9SZXNwb25zZT4oXCJzZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB1cmwsXG4gICAgICAgICAgICAgICAgXCJ0aW1lT2Zmc2V0XCI6IHRpbWVPZmZzZXQsXG4gICAgICAgICAgICAgICAgXCJub2RlUGF0aFwiOiBub2RlLnBhdGhcbiAgICAgICAgICAgIH0sIHNldFBsYXllckluZm9SZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2V0UGxheWVySW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICAvL2FsZXJ0KCdzYXZlIGNvbXBsZXRlLicpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRGlhbG9nQmFzZS5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgLypcbiAgICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICAgICAqXG4gICAgICogdG9kbzogd2hlbiByZWZhY3RvcmluZyBhbGwgZGlhbG9ncyB0byB0aGlzIG5ldyBiYXNlLWNsYXNzIGRlc2lnbiBJJ20gYWx3YXlzXG4gICAgICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICAgICAqIGNlcnRhaW4gZGlhbG9ncyAoaW5kZWVkIG1vc3Qgb2YgdGhlbSkgYmUgYWJsZSB0byBiZWhhdmUgYXMgc2luZ2xldG9ucyBvbmNlXG4gICAgICogdGhleSBoYXZlIGJlZW4gY29uc3RydWN0ZWQgd2hlcmUgdGhleSBtZXJlbHkgaGF2ZSB0byBiZSByZXNob3duIGFuZFxuICAgICAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAgICAgKiBtYWtpbmcgdGhlbSBpbnZpc2libGUuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGRhdGE6IGFueTtcbiAgICAgICAgYnVpbHQ6IGJvb2xlYW47XG4gICAgICAgIGd1aWQ6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9tSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBXZSByZWdpc3RlciAndGhpcycgc28gd2UgY2FuIGRvIG1ldGE2NC5nZXRPYmplY3RCeUd1aWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBvbiB0aGUgZGlhbG9nIGFuZCBiZSBhYmxlIHRvIGhhdmUgJ3RoaXMnIGF2YWlsYWJsZSB0byB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGVuY29kZWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBhcyBzdHJpbmdzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbnRlbnQgb2YgdGhlIGRpYWxvZyB3aGVuIGl0J3MgZGlzcGxheWVkLCBhbmQgc2hvdWxkIGJlIHRoZSBwbGFjZSB3aGVyZVxuICAgICAgICBhbnkgZGVmYXVsdHMgb3IgdmFsdWVzIGluIGZvciBmaWVsZHMsIGV0Yy4gc2hvdWxkIGJlIHNldCB3aGVuIHRoZSBkaWFsb2cgaXMgZGlzcGxheWVkICovXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIH1cblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgfTtcblxuICAgICAgICBvcGVuID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGlzLmlkKHRoaXMuZG9tSWQpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICAgICAqIG9uY2UgaXQncyBjbG9zZWQsIEFORCB0aGF0IHNhbWUgY29kZSBzaG91bGQgZGVsZXRlIHRoZSBndWlkJ3Mgb2JqZWN0IGluXG4gICAgICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFwZXItZGlhbG9nXCIpO1xuXG4gICAgICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgICAgICAvL25vZGUuc2V0QXR0cmlidXRlKFwid2l0aC1iYWNrZHJvcFwiLCBcIndpdGgtYmFja2Ryb3BcIik7XG5cbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgIC8vIHRvZG8tMzogcHV0IGluIENTUyBub3dcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcblxuICAgICAgICAgICAgLyogdG9kby0wOiBsb29rdXAgcGFwZXItZGlhbG9nLXNjcm9sbGFibGUsIGZvciBleGFtcGxlcyBvbiBob3cgd2UgY2FuIGltcGxlbWVudCBoZWFkZXIgYW5kIGZvb3RlciB0byBidWlsZFxuICAgICAgICAgICAgYSBtdWNoIGJldHRlciBkaWFsb2cuICovXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIC8vIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwiY2xhc3NcIiA6IFwibWFpbi1kaWFsb2ctY29udGVudFwiXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8gdGhpcy5idWlsZCgpKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcbiAgICAgICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgICAgICAvKiBub3cgb3BlbiBhbmQgZGlzcGxheSBwb2x5bWVyIGRpYWxvZyB3ZSBqdXN0IGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGxldCBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKGlkKTtcblxuICAgICAgICAgICAgLy9pIHRyaWVkIHRvIHR3ZWFrIHRoZSBwbGFjZW1lbnQgb2YgdGVoIGRpYWxvZyB1c2luZyBmaXRJbnRvLCBhbmQgaXQgZGlkbid0IHdvcmtcbiAgICAgICAgICAgIC8vc28gSSdtIGp1c3QgdXNpbmcgdGhlIHBhcGVyLWRpYWxvZyBDU1Mgc3R5bGluZyB0byBhbHRlciB0aGUgZGlhbG9nIHNpemUgdG8gZnVsbHNjcmVlblxuICAgICAgICAgICAgLy9sZXQgaXJvblBhZ2VzID0gdXRpbC5wb2x5RWxtKFwibWFpbklyb25QYWdlc1wiKTtcblxuICAgICAgICAgICAgLy9BZnRlciB0aGUgVHlwZVNjcmlwdCBjb252ZXJzaW9uIEkgbm90aWNlZCBoYXZpbmcgYSBtb2RhbCBmbGFnIHdpbGwgY2F1c2VcbiAgICAgICAgICAgIC8vYW4gaW5maW5pdGUgbG9vcCAoY29tcGxldGVseSBoYW5nKSBDaHJvbWUgYnJvd3NlciwgYnV0IHRoaXMgaXNzdWUgaXMgbW9zdCBsaWtlbHlcbiAgICAgICAgICAgIC8vbm90IHJlbGF0ZWQgdG8gVHlwZVNjcmlwdCBhdCBhbGwsIGJ1dCBpJ20ganVzdCBtZW50aW9uIFRTIGp1c3QgaW4gY2FzZSwgYmVjYXVzZVxuICAgICAgICAgICAgLy90aGF0J3Mgd2hlbiBJIG5vdGljZWQgaXQuIERpYWxvZ3MgYXJlIGZpbmUgYnV0IG5vdCBhIGRpYWxvZyBvbiB0b3Agb2YgYW5vdGhlciBkaWFsb2csIHdoaWNoIGlzXG4gICAgICAgICAgICAvL3RoZSBjYXNlIHdoZXJlIGl0IGhhbmdzIGlmIG1vZGVsPXRydWVcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5ub0NhbmNlbE9uT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmhvcml6b250YWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUudmVydGljYWxPZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuZml0SW50byA9IGlyb25QYWdlcy5ub2RlO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuY29uc3RyYWluKCk7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5jZW50ZXIoKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5vcGVuKCk7XG5cbiAgICAgICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgICAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgLy8gICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiB0b2RvOiBuZWVkIHRvIGNsZWFudXAgdGhlIHJlZ2lzdGVyZWQgSURzIHRoYXQgYXJlIGluIG1hcHMgZm9yIHRoaXMgZGlhbG9nICovXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHRoaXMuZG9tSWQpKTtcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAgICAgKiBzdWZmaXggYXBwZW5kZWQpXG4gICAgICAgICAqL1xuICAgICAgICBpZCA9IChpZCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIl9kbGdJZFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpZCArIFwiX2RsZ0lkXCIgKyB0aGlzLmRhdGEuZ3VpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VQYXNzd29yZEZpZWxkID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VFZGl0RmllbGQgPSAoZmllbGROYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibWV0YTY0LWlucHV0XCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZU1lc3NhZ2VBcmVhID0gKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaWFsb2ctbWVzc2FnZVwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgICAgIG1ha2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnMgPSB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2xvc2VCdXR0b24gPSAodGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55LCBpbml0aWFsbHlWaXNpYmxlPzogYm9vbGVhbik6IHN0cmluZyA9PiB7XG5cbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgLy8gd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSBpcyByZXF1aXJlZCAobG9naWMgZmFpbHMgd2l0aG91dClcbiAgICAgICAgICAgICAgICBcImRpYWxvZy1jb25maXJtXCI6IFwiZGlhbG9nLWNvbmZpcm1cIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgb25DbGljayA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvbkNsaWNrID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9uQ2xpY2sgKz0gXCI7XCIgKyBtZXRhNjQuZW5jb2RlT25DbGljayh0aGlzLmNhbmNlbCwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBvbkNsaWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbGx5VmlzaWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJzW1wic3R5bGVcIl0gPSBcImRpc3BsYXk6bm9uZTtcIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmRFbnRlcktleSA9IChpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRJbnB1dFZhbCA9IChpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRIdG1sID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VSYWRpb0J1dHRvbiA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VDaGVja0JveCA9IChsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nLCBpbml0aWFsU3RhdGU6IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcblxuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIC8vXCJvbkNsaWNrXCI6IFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBpZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICA8cGFwZXItY2hlY2tib3ggb24tY2hhbmdlPVwiY2hlY2tib3hDaGFuZ2VkXCI+Y2xpY2s8L3BhcGVyLWNoZWNrYm94PlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNoZWNrYm94Q2hhbmdlZCA6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIC8vICAgICBpZihldmVudC50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJjaGVja2VkXCJdID0gXCJjaGVja2VkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjaGVja2JveDogc3RyaW5nID0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGNoZWNrYm94ICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICAgICAgXCJmb3JcIjogaWRcbiAgICAgICAgICAgIH0sIGxhYmVsLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrYm94O1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUhlYWRlciA9ICh0ZXh0OiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjZW50ZXJlZD86IGJvb2xlYW4pOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJkaWFsb2ctaGVhZGVyIFwiICsgKGNlbnRlcmVkID8gXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCIgOiBcIlwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9hZGQgaWQgaWYgb25lIHdhcyBwcm92aWRlZFxuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImgyXCIsIGF0dHJzLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvY3VzID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcbiAgICAgICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDb25maXJtRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ29uZmlybURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGl0bGU6IHN0cmluZywgcHJpdmF0ZSBtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGUgYnV0dG9uVGV4dDogc3RyaW5nLCBwcml2YXRlIHllc0NhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgIHByaXZhdGUgbm9DYWxsYmFjaz86IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNvbmZpcm1EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQ6IHN0cmluZyA9IHRoaXMubWFrZUhlYWRlcihcIlwiLCBcIkNvbmZpcm1EbGdUaXRsZVwiKSArIHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiXCIsIFwiQ29uZmlybURsZ01lc3NhZ2VcIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk5vXCIsIFwiQ29uZmlybURsZ05vQnV0dG9uXCIsIHRoaXMubm9DYWxsYmFjayk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLmJ1dHRvblRleHQsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByb2dyZXNzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdmFyIHByb2dyZXNzQmFyID0gcmVuZGVyLnRhZyhcInBhcGVyLXByb2dyZXNzXCIsIHtcbiAgICAgICAgICAgICAgICBcImluZGV0ZXJtaW5hdGVcIjogXCJpbmRldGVybWluYXRlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgICAgIFwibWluXCI6IFwiMTAwXCIsXG4gICAgICAgICAgICAgICAgXCJtYXhcIjogXCIxMDAwXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYmFyQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjI4MHB4OyBtYXJnaW46MjRweDtcIixcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiXG4gICAgICAgICAgICB9LCBwcm9ncmVzc0Jhcik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBiYXJDb250YWluZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBNZXNzYWdlRGxnLmpzXCIpO1xyXG5cclxuLypcclxuICogQ2FsbGJhY2sgY2FuIGJlIG51bGwgaWYgeW91IGRvbid0IG5lZWQgdG8gcnVuIGFueSBmdW5jdGlvbiB3aGVuIHRoZSBkaWFsb2cgaXMgY2xvc2VkXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNZXNzYWdlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZT86IGFueSwgcHJpdmF0ZSB0aXRsZT86IGFueSwgcHJpdmF0ZSBjYWxsYmFjaz86IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMudGl0bGUpICsgXCI8cD5cIiArIHRoaXMubWVzc2FnZSArIFwiPC9wPlwiO1xyXG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IExvZ2luRGxnLmpzXCIpO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkvanF1ZXJ5LmQudHNcIiAvPlxuXG4vKlxuTm90ZTogVGhlIGpxdWVyeSBjb29raWUgbG9va3MgZm9yIGpxdWVyeSBkLnRzIGluIHRoZSByZWxhdGl2ZSBsb2NhdGlvbiBcIlwiLi4vanF1ZXJ5XCIgc28gYmV3YXJlIGlmIHlvdXJcbnRyeSB0byByZW9yZ2FuaXplIHRoZSBmb2xkZXIgc3RydWN0dXJlIEkgaGF2ZSBpbiB0eXBlZGVmcywgdGhpbmdzIHdpbGwgY2VydGFpbmx5IGJyZWFrXG4qL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkxvZ2luRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJMb2dpblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHZhciBsb2dpbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkxvZ2luXCIsIFwibG9naW5CdXR0b25cIiwgdGhpcy5sb2dpbiwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbExvZ2luQnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihsb2dpbkJ1dHRvbiArIHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcbiAgICAgICAgICAgIHZhciBkaXZpZGVyID0gXCI8ZGl2PjxoMz5PciBMb2dpbiBXaXRoLi4uPC9oMz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm0gPSBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IGZvcm07XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInVzZXJOYW1lXCIsIHVzZXIubG9naW4pO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJwYXNzd29yZFwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9wdWxhdGVGcm9tQ29va2llcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XG5cbiAgICAgICAgICAgIGlmICh1c3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwd2QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiKTtcblxuICAgICAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNldFBhc3N3b3JkID0gKCk6IGFueSA9PiB7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdXNyID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpO1xuXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFJlc2V0IFBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgICAgICBcIlllcywgcmVzZXQuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGl6LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaWdudXBEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFO1xuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEVfU0hPUlQ7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaWdudXBEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJzaWdudXBVc2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsXCIsIFwic2lnbnVwRW1haWxcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkNhcHRjaGFcIiwgXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGEtaW1hZ2VcIiAvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgcmVuZGVyLnRhZyhcImltZ1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2FwdGNoYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCJcIi8vXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsIGZhbHNlKSk7XG5cbiAgICAgICAgICAgIHZhciBzaWdudXBCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaWdudXBcIiwgXCJzaWdudXBCdXR0b25cIiwgdGhpcy5zaWdudXAsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNpZ251cEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBjYXB0Y2hhSW1hZ2UgKyBidXR0b25CYXI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAgICAgKiBcIm5vLXJlcGVhdDtcIiwgXCJiYWNrZ3JvdW5kLXNpemVcIiA6IFwiMTAwJSBhdXRvXCIgfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBVc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBFbWFpbFwiKTtcbiAgICAgICAgICAgIHZhciBjYXB0Y2hhID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgICAgIC8qIG5vIHJlYWwgdmFsaWRhdGlvbiB5ZXQsIG90aGVyIHRoYW4gbm9uLWVtcHR5ICovXG4gICAgICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIXBhc3N3b3JkIHx8IHBhc3N3b3JkLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNvcnJ5LCB5b3UgY2Fubm90IGxlYXZlIGFueSBmaWVsZHMgYmxhbmsuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TaWdudXBSZXF1ZXN0LGpzb24uU2lnbnVwUmVzcG9uc2U+KFwic2lnbnVwXCIsIHtcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBcImNhcHRjaGFcIjogY2FwdGNoYVxuICAgICAgICAgICAgfSwgdGhpcy5zaWdudXBSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXBSZXNwb25zZSA9IChyZXM6IGpzb24uU2lnbnVwUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG5cbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJTaWdudXBcIlxuICAgICAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuaWQoXCJzaWdudXBVc2VyTmFtZVwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcmVmc0RsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiUHJlZnNEbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUGVmZXJlbmNlc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiQWR2YW5jZWRcIiwgXCJlZGl0TW9kZUFkdmFuY2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9uR3JvdXAgPSByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tZ3JvdXBcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGVkXCI6IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKVxyXG4gICAgICAgICAgICB9LCByYWRpb0J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dNZXRhRGF0YUNoZWNrQm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJTaG93IFJvdyBNZXRhZGF0YVwiLCBcInNob3dNZXRhRGF0YVwiLCBtZXRhNjQuc2hvd01ldGFEYXRhKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94QmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKHNob3dNZXRhRGF0YUNoZWNrQm94KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSByYWRpb0J1dHRvbkdyb3VwO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNhdmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJlZmVyZW5jZXNCdXR0b25cIiwgdGhpcy5zYXZlUHJlZmVyZW5jZXMsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHJhZGlvQmFyICsgY2hlY2tib3hCYXIgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgICAgIDogbWV0YTY0Lk1PREVfQURWQU5DRUQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tib3ggPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSBzaG93TWV0YURhdGFDaGVja2JveC5ub2RlLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCxcclxuICAgICAgICAgICAgICAgICAgICBcImVkaXRNb2RlXCI6IG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0xOiBob3cgY2FuIEkgZmxhZyBhIHByb3BlcnR5IGFzIG9wdGlvbmFsIGluIFR5cGVTY3JpcHQgZ2VuZXJhdG9yID8gV291bGQgYmUgcHJvYmFibHkgc29tZSBraW5kIG9mIGpzb24vamFja3NvbiBAcmVxdWlyZWQgYW5ub3RhdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdE5vZGVcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJleHBvcnRBbGxvd2VkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2hvd01ldGFEYXRhXCI6IG1ldGE2NC5zaG93TWV0YURhdGFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzYXZlUHJlZmVyZW5jZXNSZXNwb25zZSA9IChyZXM6IGpzb24uU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcblxyXG4gICAgICAgICAgICAvL3RvZG8tMDogcHV0IHRoZXNlIHR3byBsaW5lcyBpbiBhIHV0aWxpdHkgbWV0aG9kXHJcbiAgICAgICAgICAgIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNob3dNZXRhRGF0YVwiKSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5jaGVja2VkID0gbWV0YTY0LnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1hbmFnZUFjY291bnREbGcuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBjbG9zZUFjY291bnRCdXR0b24gPSBtZXRhNjQuaXNBZG1pblVzZXIgPyBcIkFkbWluIENhbm5vdCBDbG9zZSBBY291bnRcIiA6IHRoaXMubWFrZUJ1dHRvbihcIkNsb3NlIEFjY291bnRcIiwgXCJjbG9zZUFjY291bnRCdXR0b25cIiwgXCJwcmVmcy5jbG9zZUFjY291bnQoKTtcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJ1dHRvbkJhciArIGJvdHRvbUJ1dHRvbkJhckRpdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRXhwb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRXhwb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFeHBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkV4cG9ydCB0byBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFeHBvcnQgdG8gRmlsZSBOYW1lXCIsIFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEV4cG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoZXhwb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldEZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyh0YXJnZXRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkV4cG9ydFJlcXVlc3QsIGpzb24uRXhwb3J0UmVzcG9uc2U+KFwiZXhwb3J0VG9YbWxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldEZpbGVOYW1lXCI6IHRhcmdldEZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5leHBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uRXhwb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkV4cG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEltcG9ydERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEltcG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiSW1wb3J0RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJJbXBvcnQgZnJvbSBYTUxcIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJGaWxlIG5hbWUgdG8gaW1wb3J0XCIsIFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIHZhciBpbXBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJJbXBvcnRcIiwgXCJpbXBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmltcG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEltcG9ydEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnROb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZUZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInNvdXJjZUZpbGVOYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgaW1wb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkltcG9ydFJlcXVlc3QsanNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaENvbnRlbnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaFRhZ3NEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hUYWdzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaFRhZ3NEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBUYWdzXCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSB0YWdzIHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoTm9kZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uTm9kZVNlYXJjaFJlcXVlc3QsIGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlPihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IHNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgXCJzb3J0RGlyXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzb3J0RmllbGRcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hGaWxlc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFNlYXJjaEZpbGVzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaEZpbGVzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggRmlsZXNcIik7XG5cbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLlwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoRmlsZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRmlsZVNlYXJjaFJlcXVlc3QsIGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlPihcImZpbGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0XG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaEZpbGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKHRoaXMuaWQoXCJzZWFyY2hUZXh0XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgcHdkOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFzc0NvZGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgdGhlIHVzZXIgaXMgZG9pbmcgYSBcIlJlc2V0IFBhc3N3b3JkXCIgd2Ugd2lsbCBoYXZlIGEgbm9uLW51bGwgcGFzc0NvZGUgaGVyZSwgYW5kIHdlIHNpbXBseSBzZW5kIHRoaXMgdG8gdGhlIHNlcnZlclxyXG4gICAgICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKHRoaXMucGFzc0NvZGUgPyBcIlBhc3N3b3JkIFJlc2V0XCIgOiBcIkNoYW5nZSBQYXNzd29yZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG5cclxuICAgICAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiTmV3IFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoYW5nZVBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZEFjdGlvbkJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbENoYW5nZVBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjaGFuZ2VQYXNzd29yZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnB3ZCAmJiB0aGlzLnB3ZC5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ2hhbmdlUGFzc3dvcmRSZXF1ZXN0LGpzb24uQ2hhbmdlUGFzc3dvcmRSZXNwb25zZT4oXCJjaGFuZ2VQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdQYXNzd29yZFwiOiB0aGlzLnB3ZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuY2hhbmdlUGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBwYXNzd29yZFwiLCByZXMpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9IFwiUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCI8cD5Zb3UgbWF5IG5vdyBsb2dpbiBhcyA8Yj5cIiArIHJlcy51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgXCI8L2I+IHdpdGggeW91ciBuZXcgcGFzc3dvcmQuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZywgXCJQYXNzd29yZCBDaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIGxvZ2luIGNhbGwgRE9FUyB3b3JrLCBidXQgdGhlIHJlYXNvbiB3ZSBkb24ndCBkbyB0aGlzIGlzIGJlY2F1c2UgdGhlIFVSTCBzdGlsbCBoYXMgdGhlIHBhc3NDb2RlIG9uIGl0IGFuZCB3ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3dhbnQgdG8gZGlyZWN0IHRoZSB1c2VyIHRvIGEgdXJsIHdpdGhvdXQgdGhhdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cyhcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVzZXRQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB1c2VyOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHlvdXIgdXNlciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzIGFuZCBhIGNoYW5nZS1wYXNzd29yZCBsaW5rIHdpbGwgYmUgc2VudCB0byB5b3VcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVzZXQgbXkgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihyZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWVzc2FnZSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc2V0UGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIikudHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlck5hbWUgJiYgZW1haWxBZGRyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZXNldFBhc3N3b3JkUmVxdWVzdCwganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2U+KFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2VyXCI6IHVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogZW1haWxBZGRyZXNzXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJPb3BzLiBUcnkgdGhhdCBhZ2Fpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZFJlc3BvbnNlID0gKHJlczoganNvbi5SZXNldFBhc3N3b3JkUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVzZXQgcGFzc3dvcmRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB0aGlzLnVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21GaWxlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvLTA6IFRoaXMgaXMgdWdseSB0byBwcmUtY3JlYXRlIHRoZXNlIGlucHV0IGZpZWxkcy4gTmVlZCB0byBtYWtlIHRoZW0gYWJsZSB0byBhZGQgZHluYW1pY2FsbHkuXG4gICAgICAgICAgICAgKiAoV2lsbCBkbyB0aGlzIG1vZGlmaWNhdGlvbiBvbmNlIEkgZ2V0IHRoZSBkcmFnLW4tZHJvcCBzdHVmZiB3b3JraW5nIGZpcnN0KVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZmlsZXNcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiBib29sZWFuIGZpZWxkIHRvIHNwZWNpZnkgaWYgd2UgZXhwbG9kZSB6aXAgZmlsZXMgb250byB0aGUgSkNSIHRyZWUgKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJleHBsb2RlWmlwc1wiKSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJleHBsb2RlWmlwc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgbGV0IGZvcm0gPSByZW5kZXIudGFnKFwiZm9ybVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBcImVuY3R5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgICAgIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgbGV0IGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHVwbG9hZEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc0FueVppcEZpbGVzID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWwgPSAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFwiICsgaSArIFwiRm9ybUlucHV0SWRcIikpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dFZhbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZEZ1bmMgPSAoZXhwbG9kZVppcHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIikpLmF0dHIoXCJ2YWx1ZVwiLCBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSBkbyBzb21ldGhpbmcgZGlmZmVyZW50bHkgZnJvbSB0aGUgbm9ybWFsICd1dGlsLmpzb24oKScgY2FsbHMgdG8gdGhlIHNlcnZlciwgYmVjYXVzZVxuICAgICAgICAgICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0FueVppcEZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ObyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRnVuYyhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBEcm9wem9uZTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpLmRyb3B6b25lKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVGaWxlTGlzdCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IHRoaXMuZmlsZUxpc3QuY29uY2F0KGRyb3B6b25lRXZ0LmdldFF1ZXVlZEZpbGVzKCkpO1xuXG4gICAgICAgICAgICAvKiBEZXRlY3QgaWYgYW55IFpJUCBmaWxlcyBhcmUgY3VycmVudGx5IHNlbGVjdGVkLCBhbmQgYXNrIHVzZXIgdGhlIHF1ZXN0aW9uIGFib3V0IHdoZXRoZXIgdGhleVxuICAgICAgICAgICAgc2hvdWxkIGJlIGV4dHJhY3RlZCBhdXRvbWF0aWNhbGx5IGR1cmluZyB0aGUgdXBsb2FkLCBhbmQgdXBsb2FkZWQgYXMgaW5kaXZpZHVhbCBub2Rlc1xuICAgICAgICAgICAgZm9yIGVhY2ggZmlsZSAqL1xuICAgICAgICAgICAgaWYgKCF0aGlzLnppcFF1ZXN0aW9uQW5zd2VyZWQgJiYgdGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJFeHBsb2RlIFppcHM/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiRG8geW91IHdhbnQgWmlwIGZpbGVzIGV4cGxvZGVkIG9udG8gdGhlIHRyZWUgd2hlbiB1cGxvYWRlZD9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJZZXMsIGV4cGxvZGUgemlwc1wiLCAvL1xuICAgICAgICAgICAgICAgICAgICAvL1llcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXouZXhwbG9kZVppcHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGZpbGUgb2YgdGhpcy5maWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlW1wibmFtZVwiXS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKFwiLnppcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcnVuQnV0dG9uRW5hYmxlbWVudCA9IChkcm9wem9uZUV2dDogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoZHJvcHpvbmVFdnQuZ2V0QWRkZWRGaWxlcygpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICBkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEJ1dHRvblwiKSkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWd1cmVEcm9wWm9uZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbVVybERsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgICAgIHVwbG9hZEZyb21VcmxEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAgICAgLyogaWYgdXBsb2FkaW5nIGZyb20gVVJMICovXG4gICAgICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uVXBsb2FkRnJvbVVybFJlcXVlc3QsIGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlPihcInVwbG9hZEZyb21VcmxcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgICAgIH0sIHRoaXMudXBsb2FkRnJvbVVybFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZyb21VcmxSZXNwb25zZSA9IChyZXM6IGpzb24uVXBsb2FkRnJvbVVybFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJVcGxvYWQgZnJvbSBVUkxcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcblxuLypcbiAqIEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGVzKVxuICpcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29udGVudEZpZWxkRG9tSWQ6IHN0cmluZztcbiAgICAgICAgZmllbGRJZFRvUHJvcE1hcDogYW55ID0ge307XG4gICAgICAgIHByb3BFbnRyaWVzOiBBcnJheTxQcm9wRW50cnk+ID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0Tm9kZURsZ1wiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFByb3BlcnR5IGZpZWxkcyBhcmUgZ2VuZXJhdGVkIGR5bmFtaWNhbGx5IGFuZCB0aGlzIG1hcHMgdGhlIERPTSBJRHMgb2YgZWFjaCBmaWVsZCB0byB0aGUgcHJvcGVydHkgb2JqZWN0IGl0XG4gICAgICAgICAgICAgKiBlZGl0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLnByb3BFbnRyaWVzID0gbmV3IEFycmF5PFByb3BFbnRyeT4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgc2F2ZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlTm9kZUJ1dHRvblwiLCB0aGlzLnNhdmVOb2RlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBQcm9wZXJ0eVwiLCBcImFkZFByb3BlcnR5QnV0dG9uXCIsIHRoaXMuYWRkUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBUYWdzXCIsIFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUYWdzUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNwbGl0Q29udGVudEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNwbGl0XCIsIFwic3BsaXRDb250ZW50QnV0dG9uXCIsIHRoaXMuc3BsaXRDb250ZW50LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uXG4gICAgICAgICAgICAgICAgKyBzcGxpdENvbnRlbnRCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uLCBcImJ1dHRvbnNcIik7XG5cbiAgICAgICAgICAgIC8qIHRvZG86IG5lZWQgc29tZXRoaW5nIGJldHRlciBmb3IgdGhpcyB3aGVuIHN1cHBvcnRpbmcgbW9iaWxlICovXG4gICAgICAgICAgICB2YXIgd2lkdGggPSA4MDA7IC8vd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gNDAwOyAvL3dpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIilcbiAgICAgICAgICAgIH0pICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSxcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IGNyZWF0ZSBDU1MgY2xhc3MgZm9yIHRoaXMuXG4gICAgICAgICAgICAgICAgc3R5bGU6IFwicGFkZGluZy1sZWZ0OiAwcHg7IHdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsOyBib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcIlxuICAgICAgICAgICAgfSwgXCJMb2FkaW5nLi4uXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEdlbmVyYXRlcyBhbGwgdGhlIEhUTUwgZWRpdCBmaWVsZHMgYW5kIHB1dHMgdGhlbSBpbnRvIHRoZSBET00gbW9kZWwgb2YgdGhlIHByb3BlcnR5IGVkaXRvciBkaWFsb2cgYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVFZGl0Tm9kZVBnID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICAvKiBjbGVhciB0aGlzIG1hcCB0byBnZXQgcmlkIG9mIG9sZCBwcm9wZXJ0aWVzICovXG4gICAgICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgICAgIHRoaXMucHJvcEVudHJpZXMgPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuXG4gICAgICAgICAgICAvKiBlZGl0Tm9kZSB3aWxsIGJlIG51bGwgaWYgdGhpcyBpcyBhIG5ldyBub2RlIGJlaW5nIGNyZWF0ZWQgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIGV4aXN0aW5nIG5vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLyogaXRlcmF0b3IgZnVuY3Rpb24gd2lsbCBoYXZlIHRoZSB3cm9uZyAndGhpcycgc28gd2Ugc2F2ZSB0aGUgcmlnaHQgb25lICovXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBlZGl0T3JkZXJlZFByb3BzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKGVkaXQuZWRpdE5vZGUucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IHRoaXoubWFrZVByb3BlcnR5RWRpdEJ1dHRvbkJhcihwcm9wLCBmaWVsZElkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gdGhpei5tYWtlTXVsdGlQcm9wRWRpdG9yKHByb3BFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeSwgYWNlRmllbGRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKCghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkgfHwgZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcInByb3BlcnR5RWRpdExpc3RJdGVtSGlkZGVuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBcInN0eWxlXCIgOiBcImRpc3BsYXk6IFwiKyAoIXJkT25seSB8fCBtZXRhNjQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiaW5saW5lXCIgOiBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICAgICAgfSwgZmllbGQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogRWRpdGluZyBhIG5ldyBub2RlICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IHRoaXMgZW50aXJlIGJsb2NrIG5lZWRzIHJldmlldyBub3cgKHJlZGVzaWduKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBuZXcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRJZCA9IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogXCJcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOZXcgTm9kZSBOYW1lXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogSSBjYW4gcmVtb3ZlIHRoaXMgZGl2IG5vdyA/XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHt9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgICAgIC8vIHZhciB0b2dnbGVSZWFkb25seVZpc0J1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGZpZWxkcyArPSB0b2dnbGVSZWFkb25seVZpc0J1dHRvbjtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSwgZmllbGRzKTtcblxuICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoYWNlRmllbGRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKGFjZUZpZWxkc1tpXS52YWwudW5lbmNvZGVIdG1sKCkpO1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgICAgICA6IC8vXG4gICAgICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKSkuaHRtbChpbnN0cik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBBbGxvdyBhZGRpbmcgb2YgbmV3IHByb3BlcnRpZXMgYXMgbG9uZyBhcyB0aGlzIGlzIGEgc2F2ZWQgbm9kZSB3ZSBhcmUgZWRpdGluZywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YXJ0XG4gICAgICAgICAgICAgKiBtYW5hZ2luZyBuZXcgcHJvcGVydGllcyBvbiB0aGUgY2xpZW50IHNpZGUuIFdlIG5lZWQgYSBnZW51aW5lIG5vZGUgYWxyZWFkeSBzYXZlZCBvbiB0aGUgc2VydmVyIGJlZm9yZSB3ZSBhbGxvd1xuICAgICAgICAgICAgICogYW55IHByb3BlcnR5IGVkaXRpbmcgdG8gaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlCdXR0b25cIiksICFlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSk7XG5cbiAgICAgICAgICAgIHZhciB0YWdzUHJvcEV4aXN0cyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcInRhZ3NcIiwgZWRpdC5lZGl0Tm9kZSkgIT0gbnVsbDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGFzVGFnc1Byb3A6IFwiICsgdGFnc1Byb3ApO1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiKSwgIXRhZ3NQcm9wRXhpc3RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZVNob3dSZWFkT25seSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vIGFsZXJ0KFwibm90IHlldCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgICAgICAvLyBzZWUgc2F2ZUV4aXN0aW5nTm9kZSBmb3IgaG93IHRvIGl0ZXJhdGUgYWxsIHByb3BlcnRpZXMsIGFsdGhvdWdoIEkgd29uZGVyIHdoeSBJIGRpZG4ndCBqdXN0IHVzZSBhIG1hcC9zZXQgb2ZcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgZWxlbWVudHNcbiAgICAgICAgICAgIC8vIGluc3RlYWQgc28gSSBkb24ndCBuZWVkIHRvIHBhcnNlIGFueSBET00gb3IgZG9tSWRzIGlub3JkZXIgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IG9mIHRoZW0/Pz8/XG4gICAgICAgIH1cblxuICAgICAgICBhZGRQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdCA9IG5ldyBFZGl0UHJvcGVydHlEbGcodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3Qub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChlZGl0LmVkaXROb2RlLCBcInRhZ3NcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcInRhZ3NcIixcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBcIlwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZVByb3BlcnR5UmVxdWVzdCwganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZT4oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZShyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBOb3RlOiBmaWVsZElkIHBhcmFtZXRlciBpcyBhbHJlYWR5IGRpYWxvZy1zcGVjaWZpYyBhbmQgZG9lc24ndCBuZWVkIGlkKCkgd3JhcHBlciBmdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgbWFrZVByb3BlcnR5RWRpdEJ1dHRvbkJhciA9IChwcm9wOiBhbnksIGZpZWxkSWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIGNsZWFyQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5jbGVhclByb3BlcnR5KCdcIiArIGZpZWxkSWQgKyBcIicpO1wiIC8vXG4gICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIFwiQ2xlYXJcIik7XG5cbiAgICAgICAgICAgIHZhciBhZGRNdWx0aUJ1dHRvbiA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZGVsZXRlQnV0dG9uID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHByb3AubmFtZSAhPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBGb3Igbm93IHdlIGp1c3QgZ28gd2l0aCB0aGUgZGVzaWduIHdoZXJlIHRoZSBhY3R1YWwgY29udGVudCBwcm9wZXJ0eSBjYW5ub3QgYmUgZGVsZXRlZC4gVXNlciBjYW4gbGVhdmVcbiAgICAgICAgICAgICAgICAgKiBjb250ZW50IGJsYW5rIGJ1dCBub3QgZGVsZXRlIGl0LlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGRlbGV0ZUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5kZWxldGVQcm9wZXJ0eSgnXCIgKyBwcm9wLm5hbWUgKyBcIicpO1wiIC8vXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICAgICAgXCJEZWxcIik7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIEkgZG9uJ3QgdGhpbmsgaXQgcmVhbGx5IG1ha2VzIHNlbnNlIHRvIGFsbG93IGEgamNyOmNvbnRlbnQgcHJvcGVydHkgdG8gYmUgbXVsdGl2YWx1ZWQuIEkgbWF5IGJlIHdyb25nIGJ1dFxuICAgICAgICAgICAgICAgICAqIHRoaXMgaXMgbXkgY3VycmVudCBhc3N1bXB0aW9uXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IFRoZXJlJ3MgYSBidWcgaW4gZWRpdGluZyBtdWx0aXBsZS12YWx1ZWQgcHJvcGVydGllcywgYW5kIHNvIGknbSBqdXN0IHR1cm5pbmcgaXQgb2ZmIGZvciBub3dcbiAgICAgICAgICAgICAgICAvL3doaWxlIGkgY29tcGxldGUgdGVzdGluZyBvZiB0aGUgcmVzdCBvZiB0aGUgYXBwLlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gYWRkTXVsdGlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5hZGRTdWJQcm9wZXJ0eSgnXCIgKyBmaWVsZElkICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgICAgIC8vIH0sIC8vXG4gICAgICAgICAgICAgICAgLy8gICAgIFwiQWRkIE11bHRpXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWxsQnV0dG9ucyA9IGFkZE11bHRpQnV0dG9uICsgY2xlYXJCdXR0b24gKyBkZWxldGVCdXR0b247XG4gICAgICAgICAgICBpZiAoYWxsQnV0dG9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoYWxsQnV0dG9ucywgXCJwcm9wZXJ0eS1lZGl0LWJ1dHRvbi1iYXJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRTdWJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdLnByb3BlcnR5O1xuXG4gICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHV0aWwuaXNPYmplY3QocHJvcC52YWx1ZXMpO1xuXG4gICAgICAgICAgICAvKiBjb252ZXJ0IHRvIG11bHRpLXR5cGUgaWYgd2UgbmVlZCB0byAqL1xuICAgICAgICAgICAgaWYgKCFpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKHByb3AudmFsdWUpO1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogbm93IGFkZCBuZXcgZW1wdHkgcHJvcGVydHkgYW5kIHBvcHVsYXRlIGl0IG9udG8gdGhlIHNjcmVlblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRPRE8tMzogZm9yIHBlcmZvcm1hbmNlIHdlIGNvdWxkIGRvIHNvbWV0aGluZyBzaW1wbGVyIHRoYW4gJ3BvcHVsYXRlRWRpdE5vZGVQZycgaGVyZSwgYnV0IGZvciBub3cgd2UganVzdFxuICAgICAgICAgICAgICogcmVyZW5kZXJpbmcgdGhlIGVudGlyZSBlZGl0IHBhZ2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHByb3AudmFsdWVzLnB1c2goXCJcIik7XG5cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBEZWxldGVzIHRoZSBwcm9wZXJ0eSBvZiB0aGUgc3BlY2lmaWVkIG5hbWUgb24gdGhlIG5vZGUgYmVpbmcgZWRpdGVkLCBidXQgZmlyc3QgZ2V0cyBjb25maXJtYXRpb24gZnJvbSB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBkZWxldGVQcm9wZXJ0eSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSB0aGUgUHJvcGVydHk6IFwiICsgcHJvcE5hbWUsIFwiWWVzLCBkZWxldGUuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlJbW1lZGlhdGUocHJvcE5hbWUpO1xuICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlID0gKHByb3BOYW1lOiBzdHJpbmcpID0+IHtcblxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRGVsZXRlUHJvcGVydHlSZXF1ZXN0LCBqc29uLkRlbGV0ZVByb3BlcnR5UmVzcG9uc2U+KFwiZGVsZXRlUHJvcGVydHlcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcm9wTmFtZVwiOiBwcm9wTmFtZVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZVByb3BlcnR5UmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5UmVzcG9uc2UocmVzLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnksIHByb3BlcnR5VG9EZWxldGU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgcHJvcGVydHlcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiByZW1vdmUgZGVsZXRlZCBwcm9wZXJ0eSBmcm9tIGNsaWVudCBzaWRlIHN0b3JhZ2UsIHNvIHdlIGNhbiByZS1yZW5kZXIgc2NyZWVuIHdpdGhvdXQgbWFraW5nIGFub3RoZXIgY2FsbCB0b1xuICAgICAgICAgICAgICAgICAqIHNlcnZlclxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByb3BzLmRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YShwcm9wZXJ0eVRvRGVsZXRlKTtcblxuICAgICAgICAgICAgICAgIC8qIG5vdyBqdXN0IHJlLXJlbmRlciBzY3JlZW4gZnJvbSBsb2NhbCB2YXJpYWJsZXMgKi9cbiAgICAgICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQpLCBcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFt0aGlzLmlkKGZpZWxkSWQpXTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIHNjYW4gZm9yIGFsbCBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBmaWVsZHMgYW5kIGNsZWFyIHRoZW0gKi9cbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjb3VudGVyIDwgMTAwMCkge1xuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkICsgXCJfc3ViUHJvcFwiICsgY291bnRlciksIFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkICsgXCJfc3ViUHJvcFwiICsgY291bnRlcildO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBmb3Igbm93IGp1c3QgbGV0IHNlcnZlciBzaWRlIGNob2tlIG9uIGludmFsaWQgdGhpbmdzLiBJdCBoYXMgZW5vdWdoIHNlY3VyaXR5IGFuZCB2YWxpZGF0aW9uIHRvIGF0IGxlYXN0IHByb3RlY3RcbiAgICAgICAgICogaXRzZWxmIGZyb20gYW55IGtpbmQgb2YgZGFtYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgc2F2ZU5vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogSWYgZWRpdGluZyBhbiB1bnNhdmVkIG5vZGUgaXQncyB0aW1lIHRvIHJ1biB0aGUgaW5zZXJ0Tm9kZSwgb3IgY3JlYXRlU3ViTm9kZSwgd2hpY2ggYWN0dWFsbHkgc2F2ZXMgb250byB0aGVcbiAgICAgICAgICAgICAqIHNlcnZlciwgYW5kIHdpbGwgaW5pdGlhdGUgZnVydGhlciBlZGl0aW5nIGxpa2UgZm9yIHByb3BlcnRpZXMsIGV0Yy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlTmV3Tm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IG5lZWQgdG8gbWFrZSB0aGlzIGNvbXBhdGlibGUgd2l0aCBBY2UgRWRpdG9yLlxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZU5ld05vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBFbHNlIHdlIGFyZSBlZGl0aW5nIGEgc2F2ZWQgbm9kZSwgd2hpY2ggaXMgYWxyZWFkeSBzYXZlZCBvbiBzZXJ2ZXIuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZS5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlRXhpc3RpbmdOb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlTmV3Tm9kZSA9IChuZXdOb2RlTmFtZT86IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCFuZXdOb2RlTmFtZSkge1xuICAgICAgICAgICAgICAgIG5ld05vZGVOYW1lID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJZiB3ZSBkaWRuJ3QgY3JlYXRlIHRoZSBub2RlIHdlIGFyZSBpbnNlcnRpbmcgdW5kZXIsIGFuZCBuZWl0aGVyIGRpZCBcImFkbWluXCIsIHRoZW4gd2UgbmVlZCB0byBzZW5kIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICogZW1haWwgdXBvbiBzYXZpbmcgdGhpcyBuZXcgbm9kZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyTmFtZSAhPSBlZGl0LnBhcmVudE9mTmV3Tm9kZS5jcmVhdGVkQnkgJiYgLy9cbiAgICAgICAgICAgICAgICBlZGl0LnBhcmVudE9mTmV3Tm9kZS5jcmVhdGVkQnkgIT0gXCJhZG1pblwiKSB7XG4gICAgICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChlZGl0Lm5vZGVJbnNlcnRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5JbnNlcnROb2RlUmVxdWVzdCwganNvbi5JbnNlcnROb2RlUmVzcG9uc2U+KFwiaW5zZXJ0Tm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50SWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0TmFtZVwiOiBlZGl0Lm5vZGVJbnNlcnRUYXJnZXQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZVxuICAgICAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQ3JlYXRlU3ViTm9kZVJlcXVlc3QsIGpzb24uQ3JlYXRlU3ViTm9kZVJlc3BvbnNlPihcImNyZWF0ZVN1Yk5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXdOb2RlTmFtZVwiOiBuZXdOb2RlTmFtZVxuICAgICAgICAgICAgICAgIH0sIGVkaXQuY3JlYXRlU3ViTm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVFeGlzdGluZ05vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGVcIik7XG5cbiAgICAgICAgICAgIC8qIGhvbGRzIGxpc3Qgb2YgcHJvcGVydGllcyB0byBzZW5kIHRvIHNlcnZlci4gRWFjaCBvbmUgaGF2aW5nIG5hbWUrdmFsdWUgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgICAgICAgICQuZWFjaCh0aGlzLnByb3BFbnRyaWVzLCBmdW5jdGlvbihpbmRleDogbnVtYmVyLCBwcm9wOiBhbnkpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tIEdldHRpbmcgcHJvcCBpZHg6IFwiICsgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgLyogSWdub3JlIHRoaXMgcHJvcGVydHkgaWYgaXQncyBvbmUgdGhhdCBjYW5ub3QgYmUgZWRpdGVkIGFzIHRleHQgKi9cbiAgICAgICAgICAgICAgICBpZiAocHJvcC5yZWFkT25seSB8fCBwcm9wLmJpbmFyeSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wLm11bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG5vbi1tdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BWYWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbcHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIElEOiBcIiArIHByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQocHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcFZhbCAhPT0gcHJvcC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGNoYW5nZWQ6IHByb3BOYW1lPVwiICsgcHJvcC5wcm9wZXJ0eS5uYW1lICsgXCIgcHJvcFZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AucHJvcGVydHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGRpZG4ndCBjaGFuZ2U6IFwiICsgcHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogRWxzZSB0aGlzIGlzIGEgTVVMVEkgcHJvcGVydHkgKi9cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbXVsdGkgcHJvcGVydHkgZmllbGQ6IFwiICsgSlNPTi5zdHJpbmdpZnkocHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFscyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChwcm9wLnN1YlByb3BzLCBmdW5jdGlvbihpbmRleCwgc3ViUHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1YlByb3BbXCIgKyBpbmRleCArIFwiXTogXCIgKyBKU09OLnN0cmluZ2lmeShzdWJQcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3N1YlByb3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIHN1YlByb3AgSUQ6IFwiICsgc3ViUHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJTZXR0aW5nW1wiICsgcHJvcFZhbCArIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IHV0aWwuZ2V0VGV4dEFyZWFWYWxCeUlkKHN1YlByb3AuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBzdWJQcm9wW1wiICsgaW5kZXggKyBcIl0gb2YgXCIgKyBwcm9wLm5hbWUgKyBcIiB2YWw9XCIgKyBwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWxzLnB1c2gocHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IHByb3AubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVzXCI6IHByb3BWYWxzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7Ly8gZW5kIGl0ZXJhdG9yXG5cbiAgICAgICAgICAgIC8qIGlmIGFueXRoaW5nIGNoYW5nZWQsIHNhdmUgdG8gc2VydmVyICovXG4gICAgICAgICAgICBpZiAocHJvcGVydGllc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyBzYXZlTm9kZSgpLiBQb3N0RGF0YT1cIiArIHV0aWwudG9Kc29uKHBvc3REYXRhKSk7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2F2ZU5vZGVSZXF1ZXN0LCBqc29uLlNhdmVOb2RlUmVzcG9uc2U+KFwic2F2ZU5vZGVcIiwgcG9zdERhdGEsIGVkaXQuc2F2ZU5vZGVSZXNwb25zZSwgbnVsbCwge1xuICAgICAgICAgICAgICAgICAgICBzYXZlZElkOiBlZGl0LmVkaXROb2RlLmlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIGNoYW5nZWQuIE5vdGhpbmcgdG8gc2F2ZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlTXVsdGlQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWFraW5nIE11bHRpIEVkaXRvcjogUHJvcGVydHkgbXVsdGktdHlwZTogbmFtZT1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCIgY291bnQ9XCJcbiAgICAgICAgICAgICAgICArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBwcm9wRW50cnkuc3ViUHJvcHMgPSBbXTtcblxuICAgICAgICAgICAgdmFyIHByb3BMaXN0ID0gcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlcztcbiAgICAgICAgICAgIGlmICghcHJvcExpc3QgfHwgcHJvcExpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBwcm9wTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIHByb3BMaXN0LnB1c2goXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByb3AgbXVsdGktdmFsW1wiICsgaSArIFwiXT1cIiArIHByb3BMaXN0W2ldKTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKHByb3BFbnRyeS5pZCArIFwiX3N1YlByb3BcIiArIGkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcExpc3RbaV07XG4gICAgICAgICAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsIHx8ICcnO1xuICAgICAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IChpID09IDAgPyBwcm9wRW50cnkucHJvcGVydHkubmFtZSA6IFwiKlwiKSArIFwiLlwiICsgaTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgdGV4dGFyZWEgd2l0aCBpZD1cIiArIGlkKTtcblxuICAgICAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcy5wdXNoKHN1YlByb3ApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5iaW5hcnkgfHwgcHJvcEVudHJ5LnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZVNpbmdsZVByb3BFZGl0b3IgPSAocHJvcEVudHJ5OiBQcm9wRW50cnksIGFjZUZpZWxkczogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHkgc2luZ2xlLXR5cGU6IFwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wRW50cnkucHJvcGVydHkudmFsdWU7XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgICAgdmFyIHByb3BWYWxTdHIgPSBwcm9wVmFsID8gcHJvcFZhbCA6ICcnO1xuICAgICAgICAgICAgcHJvcFZhbFN0ciA9IHByb3BWYWxTdHIuZXNjYXBlRm9yQXR0cmliKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1ha2luZyBzaW5nbGUgcHJvcCBlZGl0b3I6IHByb3BbXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiXSB2YWxbXCIgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVcbiAgICAgICAgICAgICAgICArIFwiXSBmaWVsZElkPVwiICsgcHJvcEVudHJ5LmlkKTtcblxuICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5yZWFkT25seSB8fCBwcm9wRW50cnkuYmluYXJ5KSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCI6IFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wRW50cnkucHJvcGVydHkubmFtZSA9PSBqY3JDbnN0LkNPTlRFTlQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RmllbGREb21JZCA9IHByb3BFbnRyeS5pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBzcGxpdENvbnRlbnQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZUJlbG93OiBqc29uLk5vZGVJbmZvID0gZWRpdC5nZXROb2RlQmVsb3coZWRpdC5lZGl0Tm9kZSk7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TcGxpdE5vZGVSZXF1ZXN0LCBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlPihcInNwbGl0Tm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5vZGVCZWxvd0lkXCI6IChub2RlQmVsb3cgPT0gbnVsbCA/IG51bGwgOiBub2RlQmVsb3cuaWQpLFxuICAgICAgICAgICAgICAgIFwiZGVsaW1pdGVyXCI6IG51bGxcbiAgICAgICAgICAgIH0sIHRoaXMuc3BsaXRDb250ZW50UmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50UmVzcG9uc2UgPSAocmVzOiBqc29uLlNwbGl0Tm9kZVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTcGxpdCBjb250ZW50XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYW5jZWxFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgIGlmIChtZXRhNjQudHJlZURpcnR5KSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXROb2RlRGxnLmluaXRcIik7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudEZpZWxkRG9tSWQpIHtcbiAgICAgICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyhcIiNcIiArIHRoaXMuY29udGVudEZpZWxkRG9tSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdFByb3BlcnR5RGxnLmpzXCIpO1xuXG4vKlxuICogUHJvcGVydHkgRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZSBQcm9wZXJ0aWVzKVxuICovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRWRpdFByb3BlcnR5RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBlZGl0Tm9kZURsZzogYW55O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGVkaXROb2RlRGxnOiBhbnkpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdFByb3BlcnR5RGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFZGl0IE5vZGUgUHJvcGVydHlcIik7XG5cbiAgICAgICAgICAgIHZhciBzYXZlUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJvcGVydHlCdXR0b25cIiwgdGhpcy5zYXZlUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGNhbmNlbEVkaXRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImVkaXRQcm9wZXJ0eVBnQ2xvc2VCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZVByb3BlcnR5QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIilcbiAgICAgICAgICAgICAgICAgICAgKyBcIicgY2xhc3M9J3BhdGgtZGlzcGxheS1pbi1lZGl0b3InPjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBwb3B1bGF0ZVByb3BlcnR5RWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9ICcnO1xuXG4gICAgICAgICAgICAvKiBQcm9wZXJ0eSBOYW1lIEZpZWxkICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkUHJvcE5hbWVJZCA9IFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BOYW1lSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BOYW1lSWQpLFxuICAgICAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmFtZVwiXG4gICAgICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFByb3BlcnR5IFZhbHVlIEZpZWxkICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkUHJvcFZhbHVlSWQgPSBcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcFZhbHVlSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BWYWx1ZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IHRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlZhbHVlXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgdmlldy5pbml0RWRpdFBhdGhEaXNwbGF5QnlJZCh0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIiksIGZpZWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIikpO1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCIpKTtcblxuICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZURhdGEsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogcHJvcGVydHlWYWx1ZURhdGFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlUHJvcGVydHlSZXF1ZXN0LCBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlPihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBXYXJuaW5nOiBkb24ndCBjb25mdXNlIHdpdGggRWRpdE5vZGVEbGcgKi9cbiAgICAgICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBqc29uLlNhdmVQcm9wZXJ0eVJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdE5vZGVEbGcuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVkaXROb2RlRGxnLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9wZXJ0eUVkaXQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNoYXJlVG9QZXJzb25EbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaGFyZVRvUGVyc29uRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNoYXJlVG9QZXJzb25EbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNoYXJlIE5vZGUgdG8gUGVyc29uXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlciB0byBTaGFyZSBXaXRoXCIsIFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICAgICAgdmFyIHNoYXJlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTaGFyZVwiLCBcInNoYXJlTm9kZVRvUGVyc29uQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QZXJzb24sXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIFwiPHA+RW50ZXIgdGhlIHVzZXJuYW1lIG9mIHRoZSBwZXJzb24geW91IHdhbnQgdG8gc2hhcmUgdGhpcyBub2RlIHdpdGg6PC9wPlwiICsgZm9ybUNvbnRyb2xzXG4gICAgICAgICAgICAgICAgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1BlcnNvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRVc2VyID0gdGhpcy5nZXRJbnB1dFZhbChcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0VXNlcikge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIHVzZXJuYW1lXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiB0YXJnZXRVc2VyLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCIsIFwid3JpdGVcIiwgXCJhZGRDaGlsZHJlblwiLCBcIm5vZGVUeXBlTWFuYWdlbWVudFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiIDogZmFsc2VcbiAgICAgICAgICAgIH0sIHRoaXoucmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiwgdGhpeik7XG4gICAgICAgIH1cblxuICAgICAgICByZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uID0gKHJlczoganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2hhcmUgTm9kZSB3aXRoIFBlcnNvblwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNoYXJpbmdEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaGFyaW5nRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNoYXJpbmdEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk5vZGUgU2hhcmluZ1wiKTtcblxuICAgICAgICAgICAgdmFyIHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHdpdGggUGVyc29uXCIsIFwic2hhcmVOb2RlVG9QZXJzb25QZ0J1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcmVOb2RlVG9QZXJzb25QZywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgbWFrZVB1YmxpY0J1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHRvIFB1YmxpY1wiLCBcInNoYXJlTm9kZVRvUHVibGljQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QdWJsaWMsXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVNoYXJpbmdCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVXaXRoUGVyc29uQnV0dG9uICsgbWFrZVB1YmxpY0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJzaGFyZU5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2Rpdj5cIiArIC8vXG4gICAgICAgICAgICAgICAgXCI8ZGl2IHN0eWxlPVxcXCJ3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDtib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcXFwiIGlkPSdcIlxuICAgICAgICAgICAgICAgICsgdGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBHZXRzIHByaXZpbGVnZXMgZnJvbSBzZXJ2ZXIgYW5kIGRpc3BsYXlzIGluIEdVSSBhbHNvLiBBc3N1bWVzIGd1aSBpcyBhbHJlYWR5IGF0IGNvcnJlY3QgcGFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHJlbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBub2RlIHNoYXJpbmcgaW5mby5cIik7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEhhbmRsZXMgZ2V0Tm9kZVByaXZpbGVnZXMgcmVzcG9uc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIHJlcz1qc29uIG9mIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UuamF2YVxuICAgICAgICAgKlxuICAgICAgICAgKiByZXMuYWNsRW50cmllcyA9IGxpc3Qgb2YgQWNjZXNzQ29udHJvbEVudHJ5SW5mby5qYXZhIGpzb24gb2JqZWN0c1xuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSA9IChyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVNoYXJpbmdQZyhyZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUHJvY2Vzc2VzIHRoZSByZXNwb25zZSBnb3R0ZW4gYmFjayBmcm9tIHRoZSBzZXJ2ZXIgY29udGFpbmluZyBBQ0wgaW5mbyBzbyB3ZSBjYW4gcG9wdWxhdGUgdGhlIHNoYXJpbmcgcGFnZSBpbiB0aGUgZ3VpXG4gICAgICAgICAqL1xuICAgICAgICBwb3B1bGF0ZVNoYXJpbmdQZyA9IChyZXM6IGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIFRoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAkLmVhY2gocmVzLmFjbEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4LCBhY2xFbnRyeSkge1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8aDQ+VXNlcjogXCIgKyBhY2xFbnRyeS5wcmluY2lwYWxOYW1lICsgXCI8L2g0PlwiO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtbGlzdFwiXG4gICAgICAgICAgICAgICAgfSwgVGhpcy5yZW5kZXJBY2xQcml2aWxlZ2VzKGFjbEVudHJ5LnByaW5jaXBhbE5hbWUsIGFjbEVudHJ5KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHB1YmxpY0FwcGVuZEF0dHJzID0ge1xuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkKCk7XCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAocmVzLnB1YmxpY0FwcGVuZCkge1xuICAgICAgICAgICAgICAgIHB1YmxpY0FwcGVuZEF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiB0b2RvOiB1c2UgYWN0dWFsIHBvbHltZXIgcGFwZXItY2hlY2tib3ggaGVyZSAqL1xuICAgICAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgcHVibGljQXBwZW5kQXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgICAgIFwiZm9yXCI6IHRoaXMuaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIilcbiAgICAgICAgICAgIH0sIFwiQWxsb3cgcHVibGljIGNvbW1lbnRpbmcgdW5kZXIgdGhpcyBub2RlLlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpLCBodG1sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVXNpbmcgb25DbGljayBvbiB0aGUgZWxlbWVudCBBTkQgdGhpcyB0aW1lb3V0IGlzIHRoZSBvbmx5IGhhY2sgSSBjb3VsZCBmaW5kIHRvIGdldCBnZXQgd2hhdCBhbW91bnRzIHRvIGEgc3RhdGVcbiAgICAgICAgICAgICAqIGNoYW5nZSBsaXN0ZW5lciBvbiBhIHBhcGVyLWNoZWNrYm94LiBUaGUgZG9jdW1lbnRlZCBvbi1jaGFuZ2UgbGlzdGVuZXIgc2ltcGx5IGRvZXNuJ3Qgd29yayBhbmQgYXBwZWFycyB0byBiZVxuICAgICAgICAgICAgICogc2ltcGx5IGEgYnVnIGluIGdvb2dsZSBjb2RlIEFGQUlLLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXouaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIikpO1xuXG4gICAgICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIiA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCIgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiAocG9seUVsbS5ub2RlLmNoZWNrZWQgPyB0cnVlIDogZmFsc2UpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVQcml2aWxlZ2UgPSAocHJpbmNpcGFsOiBzdHJpbmcsIHByaXZpbGVnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCwganNvbi5SZW1vdmVQcml2aWxlZ2VSZXNwb25zZT4oXCJyZW1vdmVQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IHByaW5jaXBhbCxcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZVwiOiBwcml2aWxlZ2VcbiAgICAgICAgICAgIH0sIHRoaXMucmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCwganNvbi5HZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlPihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5wYXRoLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyQWNsUHJpdmlsZWdlcyA9IChwcmluY2lwYWw6IGFueSwgYWNsRW50cnk6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgICQuZWFjaChhY2xFbnRyeS5wcml2aWxlZ2VzLCBmdW5jdGlvbihpbmRleCwgcHJpdmlsZWdlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVtb3ZlQnV0dG9uID0gdGhpei5tYWtlQnV0dG9uKFwiUmVtb3ZlXCIsIFwicmVtb3ZlUHJpdkJ1dHRvblwiLCAvL1xuICAgICAgICAgICAgICAgICAgICBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpei5ndWlkICsgXCIpLnJlbW92ZVByaXZpbGVnZSgnXCIgKyBwcmluY2lwYWwgKyBcIicsICdcIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lXG4gICAgICAgICAgICAgICAgICAgICsgXCInKTtcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQocmVtb3ZlQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIHJvdyArPSBcIjxiPlwiICsgcHJpbmNpcGFsICsgXCI8L2I+IGhhcyBwcml2aWxlZ2UgPGI+XCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZSArIFwiPC9iPiBvbiB0aGlzIG5vZGUuXCI7XG5cbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtZW50cnlcIlxuICAgICAgICAgICAgICAgIH0sIHJvdyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBzaGFyZU5vZGVUb1BlcnNvblBnID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgKG5ldyBTaGFyZVRvUGVyc29uRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNoYXJlTm9kZVRvUHVibGljID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaGFyaW5nIG5vZGUgdG8gcHVibGljLlwiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBBZGQgcHJpdmlsZWdlIGFuZCB0aGVuIHJlbG9hZCBzaGFyZSBub2RlcyBkaWFsb2cgZnJvbSBzY3JhdGNoIGRvaW5nIGFub3RoZXIgY2FsbGJhY2sgdG8gc2VydmVyXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogVE9ETzogdGhpcyBhZGRpdGlvbmFsIGNhbGwgY2FuIGJlIGF2b2lkZWQgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkFkZFByaXZpbGVnZVJlcXVlc3QsIGpzb24uQWRkUHJpdmlsZWdlUmVzcG9uc2U+KFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInByaW5jaXBhbFwiOiBcImV2ZXJ5b25lXCIsXG4gICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IFtcInJlYWRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogZmFsc2VcbiAgICAgICAgICAgIH0sIHRoaXMucmVsb2FkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFJlbmFtZU5vZGVEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBSZW5hbWVOb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJSZW5hbWVOb2RlRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJSZW5hbWUgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIGN1ck5vZGVOYW1lRGlzcGxheSA9IFwiPGgzIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9oMz5cIjtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlUGF0aERpc3BsYXkgPSBcIjxoNCBjbGFzcz0ncGF0aC1kaXNwbGF5JyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpICsgXCInPjwvaDQ+XCI7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbnRlciBuZXcgbmFtZSBmb3IgdGhlIG5vZGVcIiwgXCJuZXdOb2RlTmFtZUVkaXRGaWVsZFwiKTtcblxuICAgICAgICAgICAgdmFyIHJlbmFtZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVCdXR0b25cIiwgdGhpcy5yZW5hbWVOb2RlLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlbmFtZU5vZGVCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlbmFtZU5vZGVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGN1ck5vZGVOYW1lRGlzcGxheSArIGN1ck5vZGVQYXRoRGlzcGxheSArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmFtZU5vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgbmV3TmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJuZXdOb2RlTmFtZUVkaXRGaWVsZFwiKTtcblxuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuZXcgbm9kZSBuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZWxlY3QgYSBub2RlIHRvIHJlbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIGlmIG5vIG5vZGUgYmVsb3cgdGhpcyBub2RlLCByZXR1cm5zIG51bGwgKi9cbiAgICAgICAgICAgIHZhciBub2RlQmVsb3cgPSBlZGl0LmdldE5vZGVCZWxvdyhoaWdobGlnaHROb2RlKTtcblxuICAgICAgICAgICAgdmFyIHJlbmFtaW5nUm9vdE5vZGUgPSAoaGlnaGxpZ2h0Tm9kZS5pZCA9PT0gbWV0YTY0LmN1cnJlbnROb2RlSWQpO1xuXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5hbWVOb2RlUmVxdWVzdCwganNvbi5SZW5hbWVOb2RlUmVzcG9uc2U+KFwicmVuYW1lTm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5ld05hbWVcIjogbmV3TmFtZVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmFtZU5vZGVSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRoaXoucmVuYW1lTm9kZVJlc3BvbnNlKHJlcywgcmVuYW1pbmdSb290Tm9kZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmFtZU5vZGVSZXNwb25zZSA9IChyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlLCByZW5hbWluZ1BhZ2VSb290OiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZW5hbWUgbm9kZVwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbmFtaW5nUGFnZVJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShyZXMubmV3SWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHJlcy5uZXdJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpKS5odG1sKFwiTmFtZTogXCIgKyBoaWdobGlnaHROb2RlLm5hbWUpO1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIGhpZ2hsaWdodE5vZGUucGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBBdWRpb1BsYXllckRsZy5qc1wiKTtcclxuXHJcbi8qIFRoaXMgaXMgYW4gYXVkaW8gcGxheWVyIGRpYWxvZyB0aGF0IGhhcyBhZC1za2lwcGluZyB0ZWNobm9sb2d5IHByb3ZpZGVkIGJ5IHBvZGNhc3QudHMgKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgQXVkaW9QbGF5ZXJEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBzb3VyY2VVcmw6IHN0cmluZywgcHJpdmF0ZSBub2RlVWlkOiBzdHJpbmcsIHByaXZhdGUgc3RhcnRUaW1lUGVuZGluZzogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiQXVkaW9QbGF5ZXJEbGdcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRUaW1lUGVuZGluZyBpbiBjb25zdHJ1Y3RvcjogXCIgKyBzdGFydFRpbWVQZW5kaW5nKTtcclxuICAgICAgICAgICAgcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nID0gc3RhcnRUaW1lUGVuZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdoZW4gdGhlIGRpYWxvZyBjbG9zZXMgd2UgbmVlZCB0byBzdG9wIGFuZCByZW1vdmUgdGhlIHBsYXllciAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gJChcIiNcIiArIHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8qIGZvciBzb21lIHJlYXNvbiB0aGUgYXVkaW8gcGxheWVyIG5lZWRzIHRvIGJlIGFjY2Vzc2VkIGxpa2UgaXQncyBhbiBhcnJheSAqL1xyXG4gICAgICAgICAgICAgICAgcGxheWVyWzBdLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJBdWRpbyBQbGF5ZXJcIik7XHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIGlzIHdoZXJlIEkgbmVlZCBhIHNob3J0IG5hbWUgb2YgdGhlIG1lZGlhIGJlaW5nIHBsYXllZCAqL1xyXG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBcIlwiO1xyXG4gICAgICAgICAgICAvLyByZW5kZXIudGFnKFwicFwiLCB7XHJcbiAgICAgICAgICAgIC8vICB9LCBcIlNvdXJjZTogXCIgKyB0aGlzLnNvdXJjZVVybCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyQXR0cmliczogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogOTAlO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJvbnRpbWV1cGRhdGVcIjogXCJtNjQucG9kY2FzdC5vblRpbWVVcGRhdGUoJ1wiICsgdGhpcy5ub2RlVWlkICsgXCInLCB0aGlzKTtcIixcclxuICAgICAgICAgICAgICAgIFwib25jYW5wbGF5XCI6IFwibTY0LnBvZGNhc3Qub25DYW5QbGF5KCdcIiArIHRoaXMubm9kZVVpZCArIFwiJywgdGhpcyk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbnRyb2xzXCI6IFwiY29udHJvbHNcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHJlbmRlci50YWcoXCJhdWRpb1wiLCBwbGF5ZXJBdHRyaWJzKTtcclxuXHJcbiAgICAgICAgICAgIC8vU2tpcHBpbmcgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgc2tpcEJhY2szMEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNraXAoLTMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjwgMzBzXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBGb3J3YXJkMzBCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5za2lwKDMwLCAnXCIgKyB0aGlzLm5vZGVVaWQgKyBcIicsIHRoaXMpO1wiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2tpcEJhY2szMEJ1dHRvbiArIHNraXBGb3J3YXJkMzBCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9TcGVlZCBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuMCk7XCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiTm9ybWFsIFNwZWVkXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMTVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgxLjUpO1wiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjEuNVhcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWQyeEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDIpO1wiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjJYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9EaWFsb2cgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgcGF1c2VCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wYXVzZSgpO1wiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIlBhdXNlXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wbGF5KCk7XCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBldmVuIGlmIHRoaXMgYnV0dG9uIGFwcGVhcnMgdG8gd29yaywgSSBuZWVkIGl0IHRvIGV4cGxpY2l0bHkgZW5mb3JjZSB0aGUgc2F2aW5nIG9mIHRoZSB0aW1ldmFsdWUgQU5EIHRoZSByZW1vdmVsIG9mIHRoZSBBVURJTyBlbGVtZW50IGZyb20gdGhlIERPTSAqL1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBkZXNjcmlwdGlvbiArIHBsYXllciArIHNraXBCdXR0b25CYXIgKyBzcGVlZEJ1dHRvbkJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgcG9kY2FzdC5kZXN0cm95UGxheWVyKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3NlYXJjaFJlc3VsdHNWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjc2VhcmNoUGFnZVRpdGxlXCIpLmh0bWwoc3JjaC5zZWFyY2hQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC5zZWFyY2hSZXN1bHRzLCBcInNlYXJjaFJlc3VsdHNWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB0aW1lbGluZVJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRpbWVsaW5lUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIjtcclxuICAgICAgICB0YWJJZDogc3RyaW5nID0gXCJ0aW1lbGluZVRhYk5hbWVcIjtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGJ1aWxkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3RpbWVsaW5lUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3RpbWVsaW5lVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19